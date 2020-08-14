
const redis = require('redis')
const { REDIS_CONFIG } = require('../config/db')

// 创建客户端
const redisClient = redis.createClient(REDIS_CONFIG.port, REDIS_CONFIG.host)
redisClient.on('error', err => {
    console.error(err)
})

function set (key, val) {
    if (typeof val === 'object') {
        val = JSON.stringify(val)
    }
    redisClient.set(key, val, redis.print)
}

function get (key) {
    return new Promise((reslove, reject) => {
        redisClient.get(key, (err, val) => {
            if (err) {
                reject(err)
                return
            }
            if (val === null) {
                reslove(null)
                return
            }
            try {
                reslove(JSON.parse(val))
            } catch (error) {
                reslove(val)
            }
            reslove(val)
        })
    })
}

module.exports = { get, set }