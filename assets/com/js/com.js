export const body = $('body:first');
// loading图
export const Loading = function () {
    this.loading_box = $(`<div class="com-loading-box">
        <div class="com-loading-main">
            <div class="com-loading-item"></div>
            <div class="com-loading-item"></div>
            <div class="com-loading-item"></div>
        </div>
    </div>`);
    Loading.prototype.show = function () {
        this.loading_box.appendTo($(document.body));
        return this;
    }
    Loading.prototype.hide = function () {
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
    this.theme = opts.theme || '#424e67';
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
            this.scroll_el.animate({ 'scrollTop': 0 }, 300);
        });
    }
    this.handler();
    this.animateEnd();
}