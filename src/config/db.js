
const env = process.env.NODE_ENV // 环境变量

let MYSQL_CONFIG
if (env === 'dev') {
    // 开发环境配置
    MYSQL_CONFIG = {
        host: 'localhost',
        user: 'root',
        password: 'Alex001573',
        port: '3306',
        database: 'myBlog'
    }
}
if (env === 'prodution') {
    // 线上环境配置
    MYSQL_CONFIG = {
        host: 'localhost',
        user: 'root',
        password: 'Alex001573',
        port: '3306',
        database: 'myBlog'
    }
}

module.exports = { MYSQL_CONFIG }