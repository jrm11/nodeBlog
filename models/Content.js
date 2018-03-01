/**
 * Created by jian on 2018/2/10.
 */
const mongoose = require("mongoose");
const contentsSchema = require("../schemas/contents");

module.exports = mongoose.model('Content', contentsSchema);
