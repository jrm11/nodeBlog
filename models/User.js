/**
 * Created by jian on 2018/2/10.
 */
const mongoose = require("mongoose");
const userSchema = require("../schemas/users");

module.exports = mongoose.model('User', userSchema);
