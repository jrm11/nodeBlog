/**
 * Created by jian on 2018/2/10.
 * 启动入口文件
 */
const express = require("express");
const swig = require("swig");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const Cookies = require("cookies");
let app = express();
let User = require("./models/User");
// 设置静态文件托管
app.use('/public', express.static(__dirname + '/public'));


// 配置模板引擎
// 第一个参数，模板名称，也是文件后缀 第二各参数解析模板的方法
app.engine('html', swig.renderFile);

// 设置模板文件存放的目录，第一个参数必须有，第二个参数是文件目录
app.set("views", "./views");
// 第一个参数必须是view engine 第二个参数与app.engine中第一个参数一致
app.set("view engine", 'html');
swig.setDefaults({cache: false});
app.use(bodyParser.urlencoded({extended: true}));
// 设置cookies
app.use(function (req, res, next) {
    req.cookies = new Cookies(req, res);
    req.userInfo = {};
    // 解析登录用户的登录信息
    if (req.cookies.get("userInfo")) {
        try {
            req.userInfo = JSON.parse(req.cookies.get("userInfo"));
            // 获取当前登录用户的类型，是否是管理员
            User.findById(req.userInfo._id).then(function (userInfo) {
                req.userInfo.isAdmin = Boolean(userInfo.isAdmin);
                next();
            })
        } catch (e) {
            next();
        }
    } else {
        next();
    }
});
// 更具不同功能划分模块
app.use('/admin', require('./routers/admin'));
app.use('/api', require('./routers/api'));
app.use('/', require('./routers/main'));

// 监听http请求
mongoose.connect('mongodb://localhost:27018/blog', function (err) {
    if (err) {
        console.log("连接失败");
    } else {
        console.log("连接成功");
        app.listen(8081);
    }
});
