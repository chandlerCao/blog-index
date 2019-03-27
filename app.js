// js
require('@/js/left-bar');
function IsPC() {
    var userAgentInfo = navigator.userAgent;
    var Agents = ["Android", "iPhone",
        "SymbianOS", "Windows Phone",
        "iPad", "iPod"];
    var flag = true;
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
            flag = false;
            break;
        }
    }
    return flag;
}
if (IsPC()) require('@/js/right-bar');
require('@/js/blog-main');
// less
require('@/com/less/reset.less');
require('@/com/less/com.less');
require('@/less/app.less');