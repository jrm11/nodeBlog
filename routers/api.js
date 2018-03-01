/**
 * Created by jian on 2018/2/10.
 */
const express = require("express");
const User = require('../models/User');
const Content = require('../models/Content');

const router = express.Router();

// 统一返回格式
let reqData;
router.use(function (req, res, next) {
    reqData = {
        code: 0,
        msg: ''
    };
    next();
});
router.post('/user/register', function (req, res, next) {
    console.log(req.body);
    let username = req.body.username;
    let password = req.body.password;
    let repassword = req.body.repassword;
    if (username == "") {
        reqData.code = 1;
        reqData.msg = "用户名不能为空";
        res.json(reqData);
        return;
    }

    if (password == "") {
        reqData.code = 2;
        reqData.msg = "密码不能为空";
        res.json(reqData);
        return;
    }

    if (password != repassword) {
        reqData.code = 3;
        reqData.msg = "密码不一致";
        res.json(reqData);
        return;
    }

    User.findOne({
        username: username
    }).then(function (userInfo) {
        console.log(userInfo);
        if (userInfo) {
            reqData.code = 4;
            reqData.msg = "用户名已存在";
            res.json(reqData)
            return;
        }
        let user = new User({
            username: username,
            password: password
        });
        return user.save();

    }).then(function (newUserInfo) {
        console.log(newUserInfo);
        reqData.msg = "注册成功";
        res.json(reqData);
    })
})

// 登录逻辑
router.post("/user/login", function (req, res) {
    console.log(req.body);
    let username = req.body.username;
    let password = req.body.password;
    if (username == "" || password == "") {
        reqData.code = 1;
        reqData.msg = "用户名或密码不能为空";
        res.json(reqData);
        return;
    }

    // 查找用户名与密码
    User.findOne({
        username: username,
        password: password
    }).then(function (userInfo) {
        console.log(userInfo)
        if (!userInfo) {
            reqData.code = 2;
            reqData.msg = "用户名或密码错误"
            res.json(reqData);
            return;
        }
        reqData.msg = "登陆成功";
        reqData.userInfo = {
            _id: userInfo._id,
            username: userInfo.username
        }
        req.cookies.set("userInfo", JSON.stringify({
            _id: userInfo._id,
            username: userInfo.username
        }));
        res.json(reqData);
        return;
    })
})

// 退出登录
router.get('/user/logout', function (req, res) {
    req.cookies.set("userInfo", null);
    reqData.msg = "退出成功";
    res.json(reqData);
});

/*
 * 获取指定文章的所有评论
 * */
router.get('/comment', function(req, res) {
    var contentId = req.query.contentid || '';

    Content.findOne({
        _id: contentId
    }).then(function(content) {
        reqData.data = content.comments;
        res.json(reqData);
    })
});


// 评论提交
router.post('/comment/post', function (req, res) {
    // 内容id
    let contentId = req.body.contentid || "";
    let postData = {
        username: req.userInfo.username,
        postTime: new Date(),
        content: req.body.content
    }
// 查询这篇文章的内容信息
    Content.findOne({
        _id:contentId
    }).then(function (content) {
        content.comments.push(postData);
        return content.save();
    }).then(function (newConent) {
        reqData.msg = '评论成功';
        reqData.data = newConent;
        res.json(reqData)
    })
});
module.exports = router;