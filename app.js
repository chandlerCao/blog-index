require('@/js/blog-main');

require('@/less/reset');
require('@/less/app');

if( module.hot ) {
    module.hot.accept('@/less/app.less', function() {
        window.location.reload();
    });
}