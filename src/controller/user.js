
const xss = require('xss')
const { exec, escape } = require('../database/mysql')
const login = (username, password) => {
    // 通过 xss 库防止xss 攻击、escape 防止 sql 攻击
    username = xss(escape(username))
    password = xss(escape(password))
    const sql = `select username, realname from users where username=${ username } and password=${ password }`
    return exec(sql).then(res => {
        return res[0] || {}
    })
}

module.exports = { login }