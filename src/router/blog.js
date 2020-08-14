
const { SuccessModel, ErrorModel } = require('../model/resModel')
const {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    deleteBlog
} = require('../controller/blog')

const handlerBlogRouter = (req, res) => {
    let method = req.method
    let blogId = req.query.id || ''

    if (method === 'GET') {
        // 获取博客列表
        if (req.path === '/api/blog/list') {
            let author = req.query.author || ''
            let kewword = req.query.kewword || ''
            let result = getList(author, kewword)
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
            const author = 'Alex Yi'
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