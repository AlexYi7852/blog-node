
const { exec, escape } = require('../database/mysql')
const login = (username, password) => {
    // 通过 escape 防止 sql 攻击
    username = escape(username)
    password = escape(password)
    const sql = `select username, realname from users where username=${ username } and password=${ password }`
    return exec(sql).then(res => {
        return res[0] || {}
    })
}

module.exports = { login }