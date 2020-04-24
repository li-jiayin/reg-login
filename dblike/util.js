const fs = require('fs');

// 检测文件夹是否存在
const dirExist = (filePath) => {
  try {
    const stat = fs.statSync(filePath);
    return true;
  } catch(e) {
    return false;
  }
}

module.exports = {
  dirExist,
}