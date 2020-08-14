const { exec } = require('../database/mysql')

const getList = (author, keyword) => {
    let sql = `select * from blogs where 1=1 `
    if (author) {
        sql += `and author='${ author }' `
    }
    if (keyword) {
        sql += `and title like '%${ keyword }%' `
    }
    sql += `order by createtime desc`
    console.log(sql, 'sql')
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
    const { title, content, author } = blogData
    const createTime = Date.now()
    let sql = `insert into blogs (title, content, createtime, author) values ('${ title }', '${ content }', ${ createTime }, '${ author }')`
    return exec(sql)
}

const updateBlog = (id, blogData = {}) => {
    // id 就是更新博客的 id
    // blogData是一个博客对象，包含title、content属性
    const { title, content } = blogData
    const sql = `update blogs set title='${ title }', content='${ content }' where id='${ id }'`
    return exec(sql)
}

const deleteBlog = (id, author) => {
    // id 就是删除博客的 id
    const sql = `delete from blogs where id='${ id }' and author='${ author }'`
    return exec(sql)
}

module.exports = { getList, getDetail, newBlog, updateBlog, deleteBlog }