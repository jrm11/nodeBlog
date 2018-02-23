/**
 * Created by jian on 2018/2/10.
 */
const express = require("express");
const router = express.Router();
const Category = require("../models/Category")

router.get('/', function (req, res, next) {
    Category.find().then(function (categories) {
        res.render("main/index", {
            userInfo: req.userInfo,
            categories: categories
        })
    })
})
module.exports = router;
