/**
 * Created by jian on 2018/2/10.
 */
const express = require("express");
const router = express.Router();
const User = require("../models/User")
const Category = require("../models/Category")
router.use(function (req, res, next) {
    if (!req.userInfo.isAdmin) {
        // 如果当前用户是非管理员
        res.send("对不起，只有管理员才能进入 ");
        return;
    }
    next();
});

router.get('/', function (req, res, next) {
    res.render("admin/index", {
        userInfo: req.userInfo
    });
});

// 用户管理
router.get('/user', function (req, res) {
    // 从数据库中读取所有的用户数据
    let page = Number(req.query.page || 1);
    let limit = 20;

    let pages = 0;
    User.count().then(function (count) {
        pages = Math.ceil(count / limit);
        // 取值不能超过pages
        page = Math.min(page, pages);
        // 取值不能小于1
        page = Math.max(page, 1);
        let skip = (page - 1) * limit;
        User.find().limit(limit).skip(skip).then(function (users) {
            res.render("admin/user_index", {
                userInfo: req.userInfo,
                users: users,
                page: page,
                count: count,
                pages: pages,
                limit: limit
            })
        })
    })
});

// 分类管理

router.get("/category", function (req, res) {

    // 从数据库中读取所有的用户数据
    let page = Number(req.query.page || 1);
    let limit = 20;

    let pages = 0;
    Category.count().then(function (count) {
        pages = Math.ceil(count / limit);
        // 取值不能超过pages
        page = Math.min(page, pages);
        // 取值不能小于1
        page = Math.max(page, 1);
        let skip = (page - 1) * limit;
        Category.find().limit(limit).skip(skip).then(function (categories) {
            res.render("admin/category_index", {
                userInfo: req.userInfo,
                categories: categories,
                page: page,
                count: count,
                pages: pages,
                limit: limit
            })
        })
    })
});
// 分类的添加
router.get("/category/add", function (req, res) {
    res.render("admin/category_add", {})
});

/*
 * 分类的保存
 *
 * */


router.post('/category/add', function(req, res) {

    var name = req.body.name || '';

    if (name == '') {
        res.render('admin/error', {
            userInfo: req.userInfo,
            msg: '名称不能为空'
        });
        return;
    }

    //数据库中是否已经存在同名分类名称
    Category.findOne({
        name: name
    }).then(function(rs) {
        if (rs) {
            //数据库中已经存在该分类了
            res.render('admin/error', {
                userInfo: req.userInfo,
                msg: '分类已经存在了'
            })
            return Promise.reject();
        } else {
            //数据库中不存在该分类，可以保存
            return new Category({
                name: name
            }).save();
        }
    }).then(function(newCategory) {
        res.render('admin/success', {
            userInfo: req.userInfo,
            msg: '分类保存成功',
            url: '/admin/category'
        });
    })

});


module.exports = router;
