/**
 * Created by jian on 2018/2/10.
 */
const express = require("express");
const router = express.Router();
const User = require("../models/User")
const Category = require("../models/Category")
const Content = require("../models/Content")
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
        /**
         * 1升序
         * -1降序
         */
        Category.find().sort({_id: -1}).limit(limit).skip(skip).then(function (categories) {
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


router.post('/category/add', function (req, res) {

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
    }).then(function (rs) {
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
    }).then(function (newCategory) {
        res.render('admin/success', {
            userInfo: req.userInfo,
            msg: '分类保存成功',
            url: '/admin/category'
        });
    })

});
// 分类修改
router.get('/category/edit', function (req, res) {

    let id = req.query.id || "";
    console.log(id);
    Category.findOne({
        _id: id
    }).then(function (category) {
        console.log(category);
        if (!category) {
            res.render('admin/error', {
                userInfo: req.userInfo,
                msg: "分类不存在"
            })
            return Promise.reject()
        } else {
            res.render('admin/category_edit', {
                userInfo: req.userInfo,
                category: category
            })
        }
    })
})


/*
 * 分类的修改保存
 * */
router.post('/category/edit', function (req, res) {

    //获取要修改的分类的信息，并且用表单的形式展现出来
    var id = req.query.id || '';
    //获取post提交过来的名称
    var name = req.body.name || '';

    //获取要修改的分类信息
    Category.findOne({
        _id: id
    }).then(function (category) {
        if (!category) {
            res.render('admin/error', {
                userInfo: req.userInfo,
                msg: '分类信息不存在'
            });
            return Promise.reject();
        } else {
            //当用户没有做任何的修改提交的时候
            if (name == category.name) {
                res.render('admin/success', {
                    userInfo: req.userInfo,
                    msg: '修改成功',
                    url: '/admin/category'
                });
                return Promise.reject();
            } else {
                //要修改的分类名称是否已经在数据库中存在
                return Category.findOne({
                    _id: {$ne: id},
                    name: name
                });
            }
        }
    }).then(function (sameCategory) {
        if (sameCategory) {
            res.render('admin/error', {
                userInfo: req.userInfo,
                msg: '数据库中已经存在同名分类'
            });
            return Promise.reject();
        } else {
            return Category.update({
                _id: id
            }, {
                name: name
            });
        }
    }).then(function () {
        res.render('admin/success', {
            userInfo: req.userInfo,
            msg: '修改成功',
            url: '/admin/category'
        });
    })

});


// 删除分类
router.get("/category/del", function (req, res) {
    let id = req.query.id || "";
    Category.remove({
        _id: id
    }).then(function () {
        res.render('admin/success', {
            userInfo: req.userInfo,
            msg: '删除成功',
            url: '/admin/category'
        });
    })
});

// 内容首页
router.get("/content", function (req, res) {
    // 从数据库中读取所有的用户数据
    let page = Number(req.query.page || 1);
    let limit = 20;
    let pages = 0;
    Content.count().then(function (count) {
        pages = Math.ceil(count / limit);
        // 取值不能超过pages
        page = Math.min(page, pages);
        // 取值不能小于1
        page = Math.max(page, 1);
        let skip = (page - 1) * limit;
        Content.find().limit(limit).skip(skip).populate(['category', 'user']).sort({addTime: -1}).then(function (contents) {
            console.log(contents);
            res.render("admin/content_index", {
                userInfo: req.userInfo,
                contents: contents,
                page: page,
                count: count,
                pages: pages,
                limit: limit
            })
        })
    })
});


// 内容add
router.get("/content/add", function (req, res) {
    Category.find().sort({_id: -1}).then(function (categories) {

        res.render("admin/content_add", {
            userInfo: req.userInfo,
            categories: categories
        });
    });
});


// 内容保存
router.post('/content/add', function (req, res) {
    if (req.body.category == '') {
        res.render('admin/error', {
            userInfo: req.userInfo,
            msg: '分类内容不能为空'
        });
        return;
    }

    if (req.body.title == '') {
        res.render('admin/error', {
            userInfo: req.userInfo,
            msg: '标题不能为空'
        });
        return;
    }

    // 保存数据到数据库

    new Content({
        category: req.body.category,
        title: req.body.title,
        description: req.body.description,
        content: req.body.content
    }).save().then(function (rs) {
        if (rs) {
            res.render('admin/success', {
                userInfo: req.userInfo,
                msg: '保存成功',
                url: '/admin/content'
            });
        }
    })
});

// 修改
router.get('/content/edit', function (req, res) {
    let id = req.query.id || '';
    let categories = [];
    Category.find().sort({_id: -1}).then(function (rs) {
        categories = rs;
        return Content.findOne({
            _id: id
        }).populate('category')
    }).then(function (content) {
        if (!content) {
            res.render('admin/error', {
                userInfo: req.userInfo,
                msg: "指定内容不存在"
            });
            return Promise.reject();
        } else {
            res.render('admin/content_edit', {
                userInfo: req.userInfo,
                content: content,
                categories: categories
            })
        }
    })

});
// 内容保存
router.post("/content/edit", function (req, res) {
    let id = req.query.id || '';
    if (req.body.category == '') {
        res.render('admin/error', {
            userInfo: req.userInfo,
            msg: '分类内容不能为空'
        });
        return;
    }

    if (req.body.title == '') {
        res.render('admin/error', {
            userInfo: req.userInfo,
            msg: '标题不能为空'
        });
        return;
    }

    Content.update({
        _id: id
    }, {
        category: req.body.category,
        title: req.body.title,
        description: req.body.description,
        content: req.body.content
    }).then(function () {
        res.render("admin/success", {
            userInfo: req.userInfo,
            msg: "保存成功",
            url: '/admin/content/edit?id=' + id
        })
    })
});

// 删除内容
router.get("/content/del", function (req, res) {
    let id = req.query.id || "";
    Content.remove({
        _id: id
    }).then(function () {
        res.render('admin/success', {
            userInfo: req.userInfo,
            msg: '删除成功',
            url: '/admin/content'
        });
    })
});

module.exports = router;
