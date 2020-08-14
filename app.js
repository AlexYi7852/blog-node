
const querystring = require('querystring')
const handlerBlogRouter = require('./src/router/blog')
const handlerUserRouter = require('./src/router/user')

const postDataHandler = req => {
    return new Promise((reslove, reject) => {
        if (req.method !== 'POST' || req.headers['content-type'] !== 'application/json') {
            reslove({})
            return
        }
        let postData = ''
        req.on('data', chunk => {
            postData += chunk.toString()
        })
        req.on('end', () => {
            if (!postData) {
                reslove({})
                return
            }
            reslove(JSON.parse(postData))
        })
    })
}

const serverHandler = (req, res) => {
    // 设置返回格式
    res.setHeader('Content-type', 'application/json')

    // 获取path
    let url = req.url
    req.path = url.split('?')[0]

    // 解析query
    req.query = querystring.parse(url.split('?')[1])

    // 解析cookie
    req.cookie = {}
    const cookie = req.headers.cookie || '' // k1=v1;k2=v2;k3=v3
    cookie.split(';').forEach(item => {
        if (!item) return
        const obj = item.split('=')
        const key = obj[0].trim()
        const val = obj[1].trim()
        console.log(key, val)
        req.cookie[key] = val
    });

    // 处理post data
    postDataHandler(req).then(postData => {
        req.body = postData
        // 处理博客路由
        // let blogData = handlerBlogRouter(req, res)
        // if (blogData) {
        //     res.end(JSON.stringify(blogData))
        //     return
        // }
        const blogResult = handlerBlogRouter(req, res)
        if (blogResult) {
            blogResult.then(blogData => {
                res.end(JSON.stringify(blogData))
            })
            return
        }
        // 处理登陆路由
        // let userData = handlerUserRouter(req, res)
        const userResult = handlerUserRouter(req, res)
        if (userResult) {
            userResult.then(userData => {
                res.end(JSON.stringify(userData))
            })
            return
        }
        // 找不到路由，返回404
        res.writeHead(404, { 'Content-type': 'text/plain' })
        res.write('404 Not Fount\n')
        res.end()
    })

    
}

module.exports = serverHandler

// process.env.NODE_ENV