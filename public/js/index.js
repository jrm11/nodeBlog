/**
 * Created by jian on 2018/2/10.
 */
$(function () {
    const login = $("#loginBox");
    const register = $("#registerBox");
    const userInfo = $(".userInfo");

    login.find("a").on("click", function (e) {
        e.preventDefault();
        register.show();
        login.hide();
    });

    register.find("a").on("click", function (e) {
        e.preventDefault();
        register.hide();
        login.show();
    });

    register.find("button").on("click", function () {
        $.ajax({
            type: "POST",
            url: '/api/user/register',
            dataType: 'json',
            data: {
                username: register.find("[name=username]").val(),
                password: register.find("[name=password]").val(),
                repassword: register.find("[name=repassword]").val()
            },
            success: function (res) {
                console.log(res);
                register.find(".colWarning").html(res.msg);
                if (!res.code) {
                    setTimeout(function () {
                        register.hide();
                        login.show();
                    }, 1000)
                }
            },
            error: function () {
                console.log("error");
            }
        })
    });

    login.find("button").on("click", function () {
        $.ajax({
            type: "POST",
            url: '/api/user/login',
            dataType: 'json',
            data: {
                username: login.find("[name=username]").val(),
                password: login.find("[name=password]").val(),
            },
            success: function (res) {
                console.log(res);
                login.find(".colWarning").html(res.msg);
                userInfo.html(userInfo.username)
                location.reload();
            },
            error: function () {
                console.log("error");
            }
        })
    })
    // 退出登录
    $("#logout").on("click",function (e) {
        e.preventDefault();
        $.ajax({
            url:"/api/user/logout",
            success:function (res) {
                if(!res.code){
                    location.reload();
                }
            },
            error:function () {
                
            }
        })
        
    })
});