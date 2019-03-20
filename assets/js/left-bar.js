import { Tooltip } from "../com/js/com";
// 头像动画
; (function () {
    $('#head-portrait').on('webkitAnimationEnd animationend', function () {
        $(this).removeClass();
    }).hover(function () {
        $(this).addClass('tada animated');
    }, function () {
        $(this).removeClass('tada animated');
    });
})();
// 联系方式
; (function () {
    // 微信二维码
    new Tooltip({
        el: $('#wechat__icon'),
        theme: 'light',
        content: '<img width="100" src="./img/WeChat-qr-code.jpg">'
    });
    // qq二维码
    new Tooltip({
        el: $('#qq__icon'),
        theme: 'light',
        content: '<img width="100" src="./img/QQ-qr-code.jpg">'
    });
    // github
    new Tooltip({
        el: $('#github__icon'),
        theme: 'light',
        content: 'github'
    });
    // 邮箱
    new Tooltip({
        el: $('#email__icon'),
        theme: 'light',
        content: '597649635@qq.com'
    });
})();