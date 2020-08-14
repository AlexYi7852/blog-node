
const { set } = require('../database/redis')
const { login } = require('../controller/user')
const { SuccessModel, ErrorModel } = require('../model/resModel')

const handlerUserRouter = (req, res) => {
    let method = req.method
    // 登陆
    if (method === 'POST' && req.path === '/api/user/login') {
        const { username, password } = req.body
        const result = login(username, password)
        return result.then(row => {
            if (row.username) {
                // 设置 session
                req.session.username = row.username
                req.session.realname = row.realname
                // 同步到 redis
                set(req.sessionId, req.session)
                return new SuccessModel()
            }
            return new ErrorModel('登陆失败')
        })
    }
    // 登陆验证测试
    // if (method === 'GET' && req.path === '/api/user/login-test') {
    //     if (req.session.username) {
    //         return Promise.resolve(new SuccessModel(
    //             { session: req.session }
    //         ))
    //     }
    //     return Promise.resolve(new ErrorModel('尚未登陆'))
    // }
}

module.exports = handlerUserRouter