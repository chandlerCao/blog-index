require('@/js/blog-main');

require('@/less/config');
require('@/less/reset');
require('@/less/blog');

if( module.hot ) {
    module.hot.accept('@/less/blog.less', function() {
        window.location.reload();
    });
}