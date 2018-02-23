/**
 * Created by jian on 2018/2/22.
 */
const mongoose = require('mongoose');
const categoriesSchema = require('../schemas/categories');
module.exports = mongoose.model("Category", categoriesSchema)

