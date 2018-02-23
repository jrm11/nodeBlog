/**
 * Created by jian on 2018/2/10.
 */
const express = require("express");
const  router = express.Router();
router.get('/',function (req,res,next) {
    console.log(req.userInfo.isAdmin);
    res.render("main/index",{
        userInfo:req.userInfo
    })
})
module.exports = router;
