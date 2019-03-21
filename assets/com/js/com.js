export const body = $('body:first');
export const $win = $(window);
// loading图
export const Loading = function (opts) {
    this.default = {
        par: body,
        text: '正在加载，请稍后...'
    };
    this.timer = null;
    this.isShowLoading = false;
    this.config = Object.assign(this.default, opts);
    this.loading_box = $(`<div class="com-loading-box" style="top: ${this.config.par.scrollTop()}px;">
        <div class="com-loading-main">
            <div class="com-loading-icon">
                <div class="com-loading-item"></div>
                <div class="com-loading-item"></div>
                <div class="com-loading-item"></div>
            </div>
            <strong class="com-loading-text">${this.config.text}</strong>
        </div>
    </div>`);
    Loading.prototype.show = function () {
        this.timer = setTimeout(() => {
            this.isShowLoading = true;
            // 父节点移除滚动条
            this.config.par.css('overflow', 'hidden');
            this.loading_box.appendTo(this.config.par);
        }, 100);
        return this;
    }
    Loading.prototype.hide = function () {
        if (!this.isShowLoading) {
            clearTimeout(this.timer);
            return;
        }
        this.config.par.css('overflow', '');
        this.loading_box.fadeOut(100, function () {
            $(this).remove();
        });
        return this;
    }
}
// 分页
export const Page = function (opts) {
    /**
     * 父级: par
     * 总条数: total
     * 每页显示条数: page_size
     * 当前页码: now_page
     * 是否显示总数: show_total
     * 样式: theme
     * url 连接
     */
    this.el = opts.par || $();
    this.total = opts.total || 0;
    if (this.total < 1) return;
    this.page_size = opts.page_size || 0;
    this.now_page = opts.now_page || 1;
    this.url = opts.url || 'javascript:;';
    this.theme = opts.theme || '#2e97ff';
    this.on_change = opts.on_change || function () { };
    this.page_len = Math.ceil(this.total / this.page_size);
    // 初始化
    Page.prototype.init = function () {
        this.el.append(`<div class="com-page-box">
                <span class="com-page-total">共 ${this.total} 条</span>
                <div class="com-page-ul">${this.create_page_num()}</div>
            </div>
        `);
    }
    // 循环出页码
    Page.prototype.create_page_num = function () {
        // 多少页
        const page_len = this.page_len;
        let list_str = '';
        // 上一页
        const is_first_page = this.now_page === 1;
        list_str += `<a href="${is_first_page ? 'javascript:;' : this.url + (this.now_page - 1)}" class="com-page-prev fa fa-angle-left${is_first_page ? ' disabled' : ''}"></a>`;
        // 第一页
        list_str += `<a href="${this.url}1" class="com-page-num" ${is_first_page ? `style="border: 1px solid ${this.theme}; color: ${this.theme}"` : ''} data-page="1">1</a>`;
        // 向前5页
        if (this.now_page > 5) {
            list_str += `<a href="${this.url}${this.now_page - 5 < 1 ? 1 : this.now_page - 5}" class="com-page-li-jump__prev">
                <i class="page-ellipsis"></i>
                <i class="page-arrow page-arrow-left fa fa-angle-double-left" style="color: ${this.theme};"></i>
            </a>`;
        } else {
            this.el.find('.com-page-li-jump__prev:first').remove();
        }
        // 循环生成页码
        let [start, limit] = [1, 0];
        if (this.now_page <= 5) {
            start = 2;
            limit = this.now_page + 2;
        } else if (this.now_page > page_len - 5) {
            start = this.now_page - 2;
            limit = page_len - 1;
        } else {
            start = this.now_page - 2;
            limit = this.now_page + 2
        }
        for (let i = start; i <= limit; i++) {
            if (i > page_len - 1) break;
            list_str += `<a href="${this.url}${i}" class="com-page-num" ${i === this.now_page ? `style="border: 1px solid ${this.theme}; color: ${this.theme}"` : ''}  data-page="${i}">${i}</a>`;
        }
        // 向后5页
        if (this.now_page <= page_len - 5) {
            list_str += `<a href="${this.url}${this.now_page + 5 > page_len ? page_len : this.now_page + 5}" class="com-page-li-jump__next">
                <i class="page-ellipsis"></i>
                <i class="page-arrow page-arrow-right fa fa-angle-double-right" style="color: ${this.theme};"></i>
            </a>`;
        } else {
            this.el.find('.com-page-li-jump__next:first').remove();
        }
        // 最后一页
        const is_last_page = this.now_page === page_len;
        if (page_len !== 1) list_str += `<a href="${this.url}${page_len}" class="com-page-num" ${is_last_page ? `style="border: 1px solid ${this.theme}; color: ${this.theme}"` : ''} data-page="${page_len}">${page_len}</a>`;
        // 下一页
        list_str += `<a href="${is_last_page ? 'javascript:;' : this.url + (this.now_page + 1)}" class="com-page-next fa fa-angle-right${is_last_page ? ' disabled' : ''}"></a>`;
        return list_str;
    }
    // 分页事件监听
    Page.prototype.page_listener = function () {
        const _this = this;
        this.el.find('.com-page-num').on('click', function () {
            _this.on_change();
        }).on('mouseover', function () {
            if (_this.now_page !== $(this).data('page')) _this.Page_add_active($(this));
        }).on('mouseout', function () {
            if (_this.now_page !== $(this).data('page')) _this.Page_remove_active($(this));
        });

        // 上页鼠标移入移出
        this.el.find('.com-page-prev:first').hover(function () {
            if (_this.now_page !== 1) _this.Page_add_active($(this));
        }, function () {
            if (_this.now_page !== 1) _this.Page_remove_active($(this));
        }).on('click', function () {
            _this.on_change();
        })

        // 下页鼠标移入
        this.el.find('.com-page-next:first').hover(function () {
            if (_this.now_page !== _this.page_len) _this.Page_add_active($(this));
        }, function () {
            if (_this.now_page !== _this.page_len) _this.Page_remove_active($(this));
        }).on('click', function () {
            _this.on_change();
        })
    }
    Page.prototype.Page_add_active = function (page_el) {
        page_el.css({
            border: `1px solid ${this.theme}`,
            color: this.theme
        });
    }
    Page.prototype.Page_remove_active = function (page_el) {
        page_el.css({
            border: '1px solid #dcdee2',
            color: '#000'
        });
    }
    this.init();
    // 按钮监听
    this.page_listener();
}
// tooltip
export const Tooltip = function (opts) {
    this.el = opts.el || $();
    this.theme = opts.theme || 'dark';
    this.content = opts.content || '默认文字';
    this.tooltip_dis = 10;
    this.ani_dis = 10;
    Tooltip.prototype.event = function () {
        const _this = this;
        _this.el.hover(function () {
            _this.show();
        }, function () {
            _this.hide();
        });
    }
    Tooltip.prototype.show = function () {
        this.tooltip_box = $(`<div class="com-tooltip-box ${this.theme}">${this.content}</div>`);
        const tooltip_box = this.tooltip_box;
        $(document.body).append(tooltip_box);
        // 计算父级left和bottom值
        const left = (this.el.width() - tooltip_box.outerWidth()) / 2 + this.el.offset().left;
        const top = this.el.offset().top - tooltip_box.outerHeight() - this.tooltip_dis;
        tooltip_box.css({
            left,
            top: top - this.ani_dis
        }).animate({
            opacity: 1,
            top
        }, 250);
    }
    Tooltip.prototype.hide = function () {
        const _this = this;
        _this.tooltip_box.animate({
            opacity: 0,
            top: `-=${_this.ani_dis}px`
        }, 250, function () {
            $(this).remove();
        });
    }
    this.event();
}
// 回到顶部
export const PageUp = function (opts) {
    this.scroll_el = opts.scroll_el || body;
    this.parent_el = opts.parent_el || body;
    const { right, bottom } = opts.styles || {};
    this.pageup_btn = $(`<div class="com-page-up" style="right: ${right}px; bottom: ${bottom}px;">
        <i class="fa fa-caret-up"></i>
    </div>`);
    this.parent_el.append(this.pageup_btn);

    // top按钮动画
    PageUp.prototype.animateEnd = function () {
        this.pageup_btn.on('animationEnd webkitAnimationEnd', function () {
            $(this).removeClass('rubberBand animated');
        });
    }
    // 回到顶部
    PageUp.prototype.handler = function () {
        this.pageup_btn.click(() => {
            this.pageup_btn.addClass('rubberBand animated');
            this.scroll_el.stop().animate({ 'scrollTop': 0 }, 300);
        });
    }
    this.handler();
    this.animateEnd();
}
// 格式化日期
export const TimestampFormat = function (timestamp) {
    var timeArr = timestamp.match(/(\d+)\-(\d+)\-(\d+)\s(\d+)\:(\d+)\:(\d+)/);
    timestamp = new Date(timeArr[1], parseInt(timeArr[2]) - 1, timeArr[3], timeArr[4], timeArr[5], timeArr[6]).getTime() / 1000;
    function zeroize(num) {
        return (String(num).length === 1 ? '0' : '') + num;
    }

    var curTimestamp = parseInt(new Date().getTime() / 1000); //当前时间戳
    var timestampDiff = curTimestamp - timestamp; // 参数时间戳与当前时间戳相差秒数

    var curDate = new Date(curTimestamp * 1000); // 当前时间日期对象
    var tmDate = new Date(timestamp * 1000);  // 参数时间戳转换成的日期对象
    var Y = tmDate.getFullYear(), m = tmDate.getMonth() + 1, d = tmDate.getDate();
    var H = tmDate.getHours(), i = tmDate.getMinutes(), s = tmDate.getSeconds();

    if (timestampDiff < 60) { // 一分钟以内
        return "刚刚";
    } else if (timestampDiff < 3600) { // 一小时前之内
        return Math.floor(timestampDiff / 60) + "分钟前";
    } else if (curDate.getFullYear() == Y && curDate.getMonth() + 1 == m && curDate.getDate() == d) {
        return '今天' + zeroize(H) + ':' + zeroize(i);
    } else {
        var newDate = new Date((curTimestamp - 86400) * 1000); // 参数中的时间戳加一天转换成的日期对象
        if (newDate.getFullYear() == Y && newDate.getMonth() + 1 == m && newDate.getDate() == d) {
            return '昨天' + zeroize(H) + ':' + zeroize(i);
        } else if (curDate.getFullYear() == Y) {
            return zeroize(m) + '月' + zeroize(d) + '日 ' + zeroize(H) + ':' + zeroize(i);
        } else {
            return Y + '年' + zeroize(m) + '月' + zeroize(d) + '日 ' + zeroize(H) + ':' + zeroize(i);
        }
    }
}