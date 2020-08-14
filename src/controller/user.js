
const { exec } = require('../database/mysql')
const loginValid = (username, password) => {
    const sql = `select username, realname from users where username='${ username }' and password='${ password }'`
    return exec(sql).then(res => {
        return res[0] || {}
    })
}

module.exports = { loginValid }