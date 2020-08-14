
const { login } = require('../controller/user')
const { SuccessModel, ErrorModel } = require('../model/resModel')

const handlerUserRouter = (req, res) => {
    let method = req.method
    // 登陆
    if (method === 'GET' && req.path === '/api/user/login') {
        // const { username, password } = req.body
        const { username, password } = req.query
        const result = login(username, password)
        return result.then(row => {
            if (row.username) {
                // 设置cookie
                // httpOnly 限制前端修改 cookie
                res.setHeader('Set-cookie', `username=${ row.username }; path=/; httpOnly`)
                return new SuccessModel()
            }
            return new ErrorModel('登陆失败')
        })
    }
    // 登陆验证测试
    if (method === 'GET' && req.path === '/api/user/login-test') {
        if (req.cookie.username) {
            return Promise.resolve(new SuccessModel(
                { username: req.cookie.username }
            ))
        }
        return Promise.resolve(new ErrorModel('尚未登陆'))
    }
}

module.exports = handlerUserRouter