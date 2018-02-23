/**
 * Created by jian on 2018/2/10.
 */
// --dbpath=D:\Development\nodeBlog\db --port=27018
const mongoose = require("mongoose");
// 用户的表结构
module.exports = new mongoose.Schema({
    // 用户名
    username: String,
    password: String,
    isAdmin: {
        type: Boolean,
        default: false
    }

})