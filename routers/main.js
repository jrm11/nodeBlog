/**
 * Created by jian on 2018/2/10.
 */
const express = require("express");
const router = express.Router();
const Category = require("../models/Category")
const Content = require("../models/Content")
// 处理通用数据
let data;
router.use(function (req, res, next) {
    data = {
        userInfo: req.userInfo,
        categories: []
    };

    Category.find().then(function (categories) {
        data.categories = categories;
        next();
    })
});
// 首页
router.get('/', function (req, res, next) {
    data.category = req.query.category || '';
    data.page = Number(req.query.page || 1);
    data.limit = 3;
    data.pages = 0;
    let where = {};
    if (data.category) {
        where.category = data.category;
    }
    // 从数据库中读取所有的用户数据
    Content.where(where).count().then(function (count) {
        data.count = count;
        data.pages = Math.ceil(data.count / data.limit);
        // 取值不能超过pages
        data.page = Math.min(data.page, data.pages);
        // 取值不能小于1
        data.page = Math.max(data.page, 1);
        let skip = (data.page - 1) * data.limit;
        return Content.where(where).find().limit(data.limit).skip(skip).populate(['category', 'user']).sort({addTime: -1});
    }).then(function (contents) {
        data.contents = contents;
        console.log(data);
        res.render("main/index", data)
    })
});

router.get("/view", function (req, res) {
    let contentId = req.query.contentid || '';
    Content.findOne({
        _id: contentId
    }).then(function (content) {
        data.content = content;
        content.views ++;
        content.save();
        res.render('main/view',data)
    })
});
module.exports = router;
