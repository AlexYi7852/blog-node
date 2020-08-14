
const fs = require('fs')
const path = require('path')

// 写日志
function writeLog (writeStearm, log) {
    writeStearm.write(log + '\n')
}

// 生成 write stream
function createWriteStream (fileName) {
    // 生成文件路劲
    const fullFileName = path.join(__dirname, '../', '../', 'logs', fileName)
    const writeStearm = fs.createWriteStream(fullFileName, {
        flags: 'a' // a: 追加、w: 覆盖
    })
    return writeStearm
}

// 写入访问日志
const accessWriteStearm = createWriteStream('access.log')
function access (log) {
    writeLog(accessWriteStearm, log)
}

module.exports = { access }