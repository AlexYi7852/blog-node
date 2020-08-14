
const redis = require('./src/database/redis')
const querystring = require('querystring')
const { access } = require('./src/utils/logs')
const handlerBlogRouter = require('./src/router/blog')
const handlerUserRouter = require('./src/router/user')

// session 数据
// const SESSION_DATA = {}

// 设置 cookie 过期时间
const setCookieExpires = () => {
    const date = new Date()
    date.setTime(date.getTime() + (24 * 60 * 60 * 1000))
    return date.toGMTString()
}

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
    // 记录 access_log
    const { method, url, headers } = { ...req }
    access(`${ method } -- ${ url } -- ${ headers['user-agent'] } -- ${ Date.now() }`)
    // 设置返回格式
    res.setHeader('Content-type', 'application/json')

    // 获取path
    req.path = url.split('?')[0]

    // 解析query
    req.query = querystring.parse(url.split('?')[1])

    // 解析cookie
    req.cookie = {}
    const cookie = headers.cookie || '' // k1=v1;k2=v2;k3=v3
    cookie.split(';').forEach(item => {
        if (!item) return
        const obj = item.split('=')
        const key = obj[0].trim()
        const val = obj[1].trim()
        req.cookie[key] = val
    });

    // 解析 session
    let isSetCookie = false // 判断是否需要设置cookie
    let userId = req.cookie.userid
    if (!userId) {
        isSetCookie = true
        userId = `${ Date.now() }_${ Math.random() }`
        // 初始化 redis 中 session 值
        redis.set(userId, {})
    }
    // 获取 session
    req.sessionId = userId
    redis.get(req.sessionId).then(sessionData => {
        if (sessionData === null) {
            // 初始化 redis 中 session 值
            redis.set(req.sessionI, {})
            // 设置session
            req.session = {}
        } else {
            req.session = sessionData
        }
        // 处理post data
        return postDataHandler(req)
    })
    // if (userId) {
    //     if (!SESSION_DATA[userId]) {
    //         SESSION_DATA[userId] = {}
    //     }
    // } else {
    //     isSetCookie = true
    //     userId = `${ Date.now() }_${ Math.random() }`
    //     SESSION_DATA[userId] = {}
    // }
    // req.session = SESSION_DATA[userId]
    
    .then(postData => {
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
                if (isSetCookie) {
                    res.setHeader('Set-cookie', `userid=${ userId }; path=/; httpOnly; expires=${ setCookieExpires() }`)
                }
                res.end(JSON.stringify(blogData))
            })
            return
        }
        // 处理登陆路由
        // let userData = handlerUserRouter(req, res)
        const userResult = handlerUserRouter(req, res)
        if (userResult) {
            userResult.then(userData => {
                if (isSetCookie) {
                    // 设置cookie
                    // httpOnly 限制前端修改 cookie
                    res.setHeader('Set-cookie', `userid=${ userId }; path=/; httpOnly; expires=${ setCookieExpires() }`)
                }
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