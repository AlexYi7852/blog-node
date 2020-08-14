
const { loginValid } = require('../controller/user')
const { SuccessModel, ErrorModel } = require('../model/resModel')

const handlerUserRouter = req => {
    let method = req.method
    // 登陆
    if (method === 'POST' && req.path === '/api/user/login') {
        const { username, password } = req.body
        const result = loginValid(username, password)
        return result.then(row => {
            if (row.username) {
                return new SuccessModel()
            } else {
                return new ErrorModel('登陆失败')
            }
        })
        
    }
}

module.exports = handlerUserRouter