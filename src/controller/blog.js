
const xss = require('xss')
const { exec, escape } = require('../database/mysql')

const getList = (author, keyword) => {
    // 通过 xss 库防止xss 攻击、escape 防止 sql 攻击
    author = xss(escape(author))
    let sql = `select * from blogs where 1=1 `
    if (author) {
        sql += `and author=${ author } `
    }
    if (keyword) {
        sql += `and title like '%${ xss(escape(keyword)) }%' `
    }
    sql += `order by createtime desc`
    console.log(sql)
    // 返回 promise
    return exec(sql)
}

const getDetail = id => {
    // 先返回假数据（数据是正确的）
    let sql = `select * from blogs where id=${ id }`
    return exec(sql)
}

const newBlog = (blogData = {}) => {
    // blogData是一个博客对象，包含title、content属性
    // 通过 xss 库防止xss 攻击、escape 防止 sql 攻击
    const title = xss(escape(blogData.title))
    const author = xss(escape(blogData.author))
    const content = xss(escape(blogData.content))
    const createTime = Date.now()
    let sql = `insert into blogs (title, content, createtime, author) values (${ title }, ${ content }, ${ createTime }, ${ author })`
    console.log(sql)
    return exec(sql)
}

const updateBlog = (id, blogData = {}) => {
    // id 就是更新博客的 id
    // blogData是一个博客对象，包含title、content属性
    // 通过 xss 库防止xss 攻击、escape 防止 sql 攻击
    const title = xss(escape(blogData.title))
    const content = xss(escape(blogData.content))
    const sql = `update blogs set title=${ title }, content=${ content } where id='${ id }'`
    return exec(sql)
}

const deleteBlog = (id, author) => {
    // id 就是删除博客的 id
    const sql = `delete from blogs where id='${ id }' and author=${ author }`
    return exec(sql)
}

module.exports = { getList, getDetail, newBlog, updateBlog, deleteBlog }