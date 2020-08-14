
const { SuccessModel, ErrorModel } = require('../model/resModel')
const {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    deleteBlog
} = require('../controller/blog')

// 登陆验证
const loginValid = req => {
    if (!req.session.username) {
        return Promise.resolve(new ErrorModel('尚未登陆'))
    }
    
}

const handlerBlogRouter = (req, res) => {
    let method = req.method
    let blogId = req.query.id || ''

    if (method === 'GET') {
        // 获取博客列表
        if (req.path === '/api/blog/list') {
            let author = req.query.author || ''
            let keyword = req.query.keyword || ''
            if (req.query.isadmin) {
                // 管理员界面
                const validResult = loginValid(req)
                if (validResult) {
                    // 未登录
                    return validResult
                }
                // 强制查询自己的博客
                author = req.session.username
            }
            let result = getList(author, keyword)
            return result.then(list => {
                return new SuccessModel(list)
            })
        }
        // 获取博客详情
        if (req.path === '/api/blog/detail') {
            let result = getDetail(blogId)
            return result.then(detail => {
                return new SuccessModel(detail)
            })
        }
    }
    if (method === 'POST') {
        // 新增博客
        if (req.path === '/api/blog/new') {
            const validResult = loginValid(req)
            if (validResult) {
                // 未登录
                return validResult
            }
            req.body.author = req.session.username
            let result = newBlog(req.body)
            return result.then(row => {
                if (row.insertId) {
                    return new SuccessModel()
                }
                return new ErrorModel('新增博客失败')
            })
        }
        // 更新博客
        if (req.path === '/api/blog/update') {
            const validResult = loginValid(req)
            if (validResult) {
                // 未登录
                return validResult
            }
            const result = updateBlog(blogId, req.body)
            return result.then(row => {
                if (row.affectedRows) {
                    return new SuccessModel()
                }
                return new ErrorModel('更新博客失败')
            })
        }
        // 删除博客
        if (req.path === '/api/blog/del') {
            const validResult = loginValid(req)
            if (validResult) {
                // 未登录
                return validResult
            }
            const author = req.session.username
            const result = deleteBlog(blogId, author)
            return result.then(row => {
                if (row.affectedRows) {
                    return new SuccessModel()
                }
                return new ErrorModel('删除博客失败')
            })
        }
    }
}

module.exports = handlerBlogRouter