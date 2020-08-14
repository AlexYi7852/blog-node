
const fs = require('fs')
const path = require('path')
const readline = require('readline')

// 文件名
const fileName = path.join(__dirname, '../', '../', 'logs', 'access.log')
// 创建read stream
const readStream = fs.createReadStream(fileName)
// 创建 readline 对象
const rl = readline.createInterface({
    input: readStream
})

let sum = 0 // 总数
let chromeNum = 0 // 
// 逐行读取
rl.on('line', lineData => {
    if (!lineData) {
        return
    }
    sum++ // 记录总行数
    const arr = lineData.split(' -- ')
    if (arr[2] && arr[2].indexOf('Chrome') > 0) {
        chromeNum++ // 记录 chrome 行数
    }
})
// 监听读取完成
rl.on('close', () => {
    console.log(`chrome 占比：${ chromeNum / sum }`)
})