const fs = require('fs');
const path = require('path');
// 加载默认配置文件
const defaultConfig = require('./default.config');
const readline = require('readline');
// 加载工具函数
const utils = require('./util.js');
// 获取 node 执行时的路径
const cwd = process.cwd();
// DBLike 存放数据的文件夹路径
const DBLikePath = path.resolve(cwd, '.dblike');
// 是否已经存在 DBLike 存放数据的文件夹路径
const existDBLike = utils.dirExist(DBLikePath);

// 记录是否正在创建数据，不同同时调用两次或以上的 create 方法；
let isCreate = false;

// 不存在 DBLike 存放数据的文件夹时创建它，存在则跳过
if (!existDBLike) {
  // 同步创建 DBLike 存放数据的文件夹
  fs.mkdirSync(DBLikePath);
}

class DBLike {
  // 构造函数，调用 new DBLike 时执行
  constructor(config) {
    // 如果传入了 config 就用传入的 config, 未传入则用默认的
    const _config = config ? config : defaultConfig;
    // config 是一个数组，数组里是对象， 每一个对象描述了一种资源
    // 以下代码是遍历数组中的资源并处理
    _config.forEach(resource => {
      // 将遍历出的每一个资源传入资源处理函数
      this.handleTable(resource);
    })
  }
  // 资源处理函数
  handleTable(resource) {
    // 根据资源中的名称定义存储该资源数据的文件的路径
    const filePath = path.join(DBLikePath, resource.name);
    // 创建存储该资源数据的文件
    fs.appendFileSync(filePath, '');

    // 存储针对该资源的操作函数
    this[resource.name] = {
      // 创建数据的函数
      create: (data) => {
        // 调用真正创建数据的函数，并传入该资源对应的文件路径
        return this.create(filePath, data);
      },
      // 根据 id 更新数据的函数
      update: (id, data) => {
        // 调用真正更新数据的函数，并传入该资源对应的文件路径
        return this.update(filePath, id, data);
      },
      // 根据 id 获取数据的函数
      get: (id, data) => {
        // 调用真正获取数据的函数，并传入该资源对应的文件路径
        return this.get(filePath, id, data);
      },
      // 查询数据的函数
      query: (option) => {
        // 调用真正获取数据的函数，并传入该资源对应的文件路径
        return this.query(filePath, option);
      },
      // 根据 id 删除数据的函数
      delete: (id) => {
        // 调用真正删除数据的函数，并传入该资源对应的文件路径
        return this.delete(filePath, id);
      },
    };
  }
  // 真正创建数据的函数
  // 创建数据的原理是往文件末尾添加数据，每一行代表一条数据，逐行读取当前文件中的数据 并将 counter + 1;
  // 在末尾添加数据时将 id 设置为 counter
  async create(tablePath, data) {
    if (isCreate) {
      throw new Error('正在执行 create 方法, 请检查代码，确保上一次的 create 已经完成, 可以在 上次的create(...).then(() => {}) 中处理逻辑');
    }

    isCreate = true;

    // 计数器，用来创建数据的 id
    let counter = 0;
    // 创建逐行读取文件
    const reader = readline.createInterface({
      input: fs.createReadStream(tablePath),
      crlfDelay: Infinity
    });

    // 返回一个 promise
    return new Promise(resolve => {
      // 逐行读取文件
      reader.on('line', line => {
        // 每读取一行文件使 counter + 1;
        counter += 1;
      });

      // 读取完了文件中的所有行
      reader.on('close', () => {
        // 设置数据的 id
        data.id = counter;
        // 将数据转为 JSON 串后写入到文件的最后
        fs.appendFileSync(tablePath, `${JSON.stringify(data)}\n`);
        // 返回添加成功的数据
        resolve(data);
        isCreate = false;
      })
    })
  }
  // 真正更新数据的函数
  // 更新数据的原理是将数据一行行的复制进临时文件，当某一行数据的 id 与传入的 id 相同时， 就用传入的数据
  // 代替原本的数据写入到临时文件中, 全部复制完毕后，删除原文件，将临时文件重命名为原文件名
  update(tablePath, id, data) {
    // 临时文件路径
    const tempPath = `${tablePath}_temp`;
    // 创建逐行读取文件
    const reader = readline.createInterface({
      input: fs.createReadStream(tablePath),
      crlfDelay: Infinity
    });

    return new Promise(resolve => {
      // 逐行读取文件
      reader.on('line', line => {
        // 解析当前行的数据为对象
        const row = JSON.parse(line);
        // 校验当前行数据的 id 是否与传入的 id 相等, 相等则将要更新的数据写入
        if (row.id === id) {
          // 将原数据的 id 更新到传入的数据上
          data.id = row.id;
          // 将数据追加到临时文件
          fs.appendFileSync(tempPath, `${JSON.stringify(data)}\n`);
          return;
        };

        // 将数据追加到临时文件
        fs.appendFileSync(tempPath, `${line}\n`);
      })

      reader.on('close', () => {
        // 删除原文件
        fs.unlinkSync(tablePath);
        // 重命名临时文件为原文件名
        fs.renameSync(tempPath, tablePath);

        // 返回更新的数据
        resolve(data);
      })
    })
  }
  // 根据 id 获取数据
  // 原理是逐行读取数据，id 匹配时返回匹配的数据
  get(tablePath, id) {
    // 创建逐行读取文件
    const reader = readline.createInterface({
      input: fs.createReadStream(tablePath),
      crlfDelay: Infinity
    });

    return new Promise(resolve => {
      reader.on('line', line => {
        const row = JSON.parse(line);
        // 校验 id 是否匹配
        if (row.id === id) {
          // 返回匹配的数据
          resolve(row);
        }
      });
    })
  }
  // 查询数据列表, limit 代表要查询的条数，start 代表开始的位置
  query(tablePath, {
    limit = 0,
    start = 0,
  }) {
    // 如果 limit 为 0 直接返回空数据
    if (limit === 0) return Promise.resolve([]);

    // 计数器
    let counter = 0;
    // 要返回的数组，后续会填充该数组
    const arr = [];
    // 创建逐行读取文件
    const reader = readline.createInterface({
      input: fs.createReadStream(tablePath),
      crlfDelay: Infinity
    });

    return new Promise(resolve => {
      // 逐行读取文件
      reader.on('line', line => {
        const row = JSON.parse(line);

        // 假设 start 为 10 limit 为 5； counter >= start 时才是需要的数据，当 counter - 10 大于 limit 的 5 时
        // 就不应该将数据 push 到 arr 里了，所以有以下的条件
        // start <= counter 并且 counter - start 的差小于 limit 时将数据填充到 arr 里
        if (start <= counter && (counter - start) < limit) {
          arr.push(row);
        }

        // 每读取一行将 counter + 1
        counter += 1;
      })

      reader.on('close', () => {
        // 读取完所有行后返回 arr;
        resolve(arr);
      })
    })
  }
  // 根据 id 删除数据
  // 删除数据的原理是将数据一行行的复制进临时文件，当某一行数据的 id 与传入的 id 相同时， 就不将该条
  // 数据写入到临时文件中, 全部复制完毕后，删除原文件，将临时文件重命名为原文件名
  delete(tablePath, id) {
    // 临时文件路径
    const tempPath = `${tablePath}_temp`;
    // 创建逐行读取文件
    const reader = readline.createInterface({
      input: fs.createReadStream(tablePath),
      crlfDelay: Infinity
    });

    return new Promise(resolve => {
      reader.on('line', line => {
        // 解析当前行的数据为对象
        const row = JSON.parse(line);
        // 校验当前行数据的 id 是否与传入的 id 相等, 相等则跳过，即不将该数据写入临时文件。
        if (row.id === id) return;
        // 将数据写入临时文件
        fs.appendFileSync(tempPath, `${line}\n`);
      })

      reader.on('close', () => {
        // 删除原文件
        fs.unlinkSync(tablePath);
        // 重命名临时文件为原文件名
        fs.renameSync(tempPath, tablePath);

        // 返回删除的数据的 id
        resolve(id);
      })
    })
  }
}

module.exports = DBLike;