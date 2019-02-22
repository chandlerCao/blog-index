export const host = 'http://192.168.1.34:7070';
import { TimestampFormat } from '../com/js/com';
// app
export const app = $('#app');
// ajax
export const ajax = function (opts) {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: opts.type || 'get',
            url: `${host}${opts.url}`,
            data: opts.data || {},
            dataType: 'json'
        }).done(data => {
            if (data.c === 0) resolve(data.d);
            else {
                reject();
                alert(data.m);
            }
        }).catch(err => {
            alert('请求超时！服务器发生异常！');
        });
    });
}
export const artLike = function (aid) {
    return ajax({ url: '/index/article/givealike', data: { aid } });
}
// 获取hash动态路径参数
export const getParmasByHash = function () {
    const hash = window.location.hash;
    const regArr = hash.match(/(\w+)=[^&]+/g);
    const data = {};
    if (regArr && regArr.length) {
        regArr.forEach(params => {
            const paramsArr = params.split('=');
            data[paramsArr[0]] = paramsArr[1];
        });
        return data;
    } else return {};
}
// 侧边栏背景切换
export const banner3d = function (box, imgArr) {
    /**
     * box: 父级
     * imgArr 图片数组
     * rowLen 横排个数
     * colLen 竖排个数
     */
    // 盒子宽高
    const box_width = box.width();
    const box_height = box.height();

    let img_width, img_height;
    getImageSizeByUrl(imgArr[0]).then(imgSize => {
        img_width = imgSize.w;
        img_height = imgSize.h;

        let new_width, new_height;
        if (img_width < box_width) {
            new_width = box_width;
            new_height = box_height * box_width / img_width;
        } else if (img_height < box_height) {
            new_height = box_height;
            new_width = box_width * box_height / img_height;
        }

        init(new_width, new_height)
    }).catch(e => {
    });

    function init(new_width, new_height) {
        let rowLen = 3, colLen = 5;

        // 单元宽高
        const cell_w = Math.floor(box_width / rowLen);
        const cell_h = box_height / colLen;
        // 单元格总数
        const cell_num = rowLen * colLen;
        // 循环生成
        let html = ``;
        new Array(cell_num).fill('').forEach((item, i) => {
            let str = ``;
            imgArr.forEach((url, j) => {
                let transform = '';
                if (j === 0) transform = `transform: rotateY(0)`;
                if (j === 1) transform = `transform: rotateY(90deg)`;
                if (j === 2) transform = `transform: rotateY(180deg)`;
                if (j === 3) transform = `transform: rotateY(270deg)`;
                const bpx = i % rowLen * cell_w;
                const bpy = Math.floor(i / rowLen) * cell_h;
                str += `<div style="position: absolute; width: 100%; height: 100%; left: 0; top: 0; background-image: url(${url}); background-size: ${new_width}px ${new_height}px; background-position: ${-bpx}px ${-bpy}px; transform-origin: center center -${cell_w / 2}px; ${transform}; animation: picture3DSwitch${j + 1} 20s ${0.04 * i + 2}s infinite"></div>`;
            });
            html += `<div style="transform-style: preserve-3d; float: left; position: relative; width: ${cell_w}px; height: ${cell_h}px;">${str}</div>`;
        });
        box.html(html);
    }

    // 获取图片宽高
    function getImageSizeByUrl(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = function () {
                resolve({ w: img.width, h: img.height });
            }
            img.onerror = function (e) {
                reject(e);
            }
            img.src = src;
        })
    }
}
// 日期格式化
export const formateDate = function (date) {
    const new_date = date.slice(0, date.length - 5).replace('T', ' ');
    // 获取时间日期
    const hour = parseInt(new_date.match(/\s(\d+)/));
    // 增加八个小时
    const new_hour = toZero(hour + 8);
    return new_date.replace(/\s(\d+)/, ' ' + new_hour);
}
// 转为0
export const toZero = function (num) {
    return num < 10 ? '0' + num : num;
}
// 本地存储
export const storage = {
    set(key, value) {
        window.localStorage.setItem(key, JSON.stringify(value));
    },
    get(key) {
        return JSON.parse(window.localStorage.getItem(key));
    }
}
// 图片加载完成
export const imgload = function (src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = function () {
            resolve(img);
        }
        img.onerror = function (e) {
            reject(e);
        }
        img.src = src;
    })
}
// 模板
export const tmp = {
    // 导航
    navTmp() {
        return `{{~it:nav}}
            <li class="nav-item" data-reg="{{=nav.reg}}">
                <a href="{{=nav.href}}" class="nav-outer" {{=nav.target}}>
                    <span class="nav-inner">
                        <i class="nav-icon {{=nav.icon}}"></i>
                        <span class="nav-text">{{=nav.text}}</span>
                    </span>
                </a>
            </li>
        {{~}}`;
    },
    articleTmp() {
        return `{{~it:atc}}
            <article class="article-item">
                <div class="art-pretty">
                    <b class="art-dotts"></b>
                    <time class="art-time">
                        {{=atc.date}}
                    </time>
                </div>
                <div class="art-main com-block">
                    <a href="#article?aid={{=atc.aid}}" class="art-wrap">
                        <div class="art-info">
                            <h2 class="art-title">{{=atc.title}}</h2>
                            <h3 class="art-note" title="{{=atc.preface}}">
                                <span>{{=atc.preface}}</span>
                            </h3>
                        </div>
                        <div class="art-img" style="background-image: url(${host}/{{=atc.cover}})"></div>
                    </a>
                    <div class="art-meta">
                        <a href="javascript:;" class="art-heart heart-box art-icon{{? atc.is_like }} act {{?}} mr20" data-aid="{{=atc.aid}}">
                            <i class="heart-icon__pic"></i>
                            <span class="heart-icon__text">喜欢(<span class="like-num">{{=atc.like_count}}</span>)</span>
                        </a>
                        <a href="javascript:;" class="com-icon art-comment art-icon mr20">
                            <i class="com-icon__pic eye-icon"></i>
                            <span class="com-icon__text">阅读({{=atc.read_count}})</span>
                        </a>
                        <a href="#article?tag={{=atc.tag_name}}&page=1" class="com-icon art-tag art-icon mr20">
                            <i class="com-icon__pic tag-icon" style="background-image: url(${host}/{{=atc.tag_url}})"></i>
                            <span class="com-icon__text">{{=atc.tag_name}}</span>
                        </a>
                    </div>
                </div>
            </article>
        {{~}}`
    }
}
// 评论
export class Comment {
    constructor(el, opts) {
        this.el = el;
        // 加载评论列表回调函数
        this.commentMore = opts.methods.commentMore;
        // 添加评论（回复）
        this.add = opts.methods.add;
        // 点赞
        this.like = opts.methods.like;
        // 加载更多回复
        this.replyMore = opts.methods.replyMore;
        // 模板
        this.temps = {
            commentBox(title = '评论') {
                return `<div class="com-comment-block">
                            <div class="comment-line">
                                <span>${title}</span>
                            </div>
                            <!-- 发布评论框 -->
                            <div class="publish-box">
                                <!-- 用户头像 -->
                                ${this.userFace()}
                                <div class="ml50">
                                    <!-- 公共评论输入框 -->
                                    ${this.pubPublishInput({ type: 'comment' })}
                                </div>
                            </div>
                            <!-- 评论列表 -->
                            <div class="comment-box"></div>
                            <div class="comment-more mt10">加载更多 ></div>
                        </div>`
            },
            // 头像
            userFace(str) {
                return `<div class="user-face fl">${str || ''}</div>`
            },
            // 公共评论（回复）输入框
            pubPublishInput(obj = {}) {
                return `<div class="pub-publish-submit mt10" style="background-color: ${obj.bgColor};">
                            <div class="publish-input">
                                <input type="text" class="com-text comment-input animated" placeholder="${obj.plh || '说点啥呗~'}" autofocus="autofocus">
                            </div>
                            <div class="publish-action">
                                <input type="text" class="com-text user-input animated" placeholder="我的大名！">
                                <button type="button" data-type="${obj.type}" class="${obj.type}-btn publish-btn com-button blue mini"> <i class="fa fa-send"></i> ${obj.subText || '评论'}</button>
                            </div>
                        </div>`
            },
            // 公共评论主要内容展示
            pubPublishContent(commentItem, type = "comment") {
                return `<div class="pub-publish-content ${type}-publish-content" data-cid="${commentItem.cid}" data-cuser="${commentItem.user}" data-aid="${commentItem.aid}" data-type="${type}">
                            <div class="user-name">${commentItem.user} <span class="user-city">${commentItem.city}的大佬</span></div>
                            <div class="comment-content">${commentItem.toUser ? `回复 <span style="color: #2e97ff;">${commentItem.toUser}</span>：` : ''}${commentItem.content}</div>
                            <div class="comment-bar clear mt10">
                                <div class="com-icon fl">
                                    <i class="com-icon__pic calendar-icon"></i>
                                    <span class="com-icon__text">${TimestampFormat(commentItem.date)}</span>
                                </div>
                                <div class="action-box fr">
                                    <a href="javascript:;" class="comment-like heart-box art-icon mr20 ${commentItem.isLike ? 'act' : ''}" data-cid="${commentItem.cid}"${commentItem.rid ? ` data-rid="${commentItem.rid}"` : ''}>
                                        <i class="heart-icon__pic"></i>
                                        <span class="heart-icon__text">喜欢(<span class="like-num">${commentItem.likeCount}</span>)</span>
                                    </a>
                                    <a href="javascript:;" class="com-icon reply-action">
                                        <i class="com-icon__pic reply-icon">&nbsp;</i>
                                        <span class="com-icon__text">回复</span>
                                    </a>
                                </div>
                            </div>
                            ${commentItem.replyData && commentItem.replyData.list.length ? this.replyBox({ list: commentItem.replyData.list, isMore: commentItem.replyData.isMore, cid: commentItem.cid }) : ``}
                        </div>`
            },
            // 评论列表项
            commentList(commentData, type = "comment") {
                if (!commentData || !commentData.length) return '';
                return commentData.reduce((commentStr, commentItem) => {
                    return commentStr += `<div class="${type}-item item flipInX enter">
                                ${this.userFace(commentItem.user[0])}
                                <div class="ml50">
                                    ${this.pubPublishContent(commentItem, type)}
                                </div>
                            </div>`
                }, '')
            },
            // 回复盒子
            replyBox(obj = {}) {
                return `<!-- 回复block，如果有回复内容 -->
                <div class="reply-box">
                    <div class="reply-list">
                        ${this.commentList(obj.list, 'reply')}
                    </div>
                    ${obj.isMore ? `<div class="reply-more" data-cid="${obj.cid}">加载更多 ></div>` : ''}
                </div>`
            },
            // noComment
            noComment(tip = '暂无评论！') {
                return `<div class="no-comment com-plain">${tip}</div>`;
            }
        }
        el.append(this.temps.commentBox(opts.title));
        // 加载评论
        this.getCommentList();
        // 触发回复
        this.replyAction();
        // 添加评论（回复）
        this.addComment();
        // 点赞
        this.commentLike();
        // 加载更多回复
        this.getReplyList();
    }
    // 获取列表
    getCommentList() {
        const that = this;
        // 评论列表父级
        const commentBox = that.el.find('.comment-box:first');
        // 加载更多评论点击
        const commentMoreBtn = that.el.find('.comment-more:first');
        // 获取更多评论
        commentMoreBtn.on('click', function () {
            // 获取当前页码
            if ($(this).data('page') === undefined) {
                $(this).data('page', 0);
            } else {
                $(this).data('page', $(this).data('page') + 1);
            }
            // 执行加载更多回调函数
            that.commentMore($(this).data('page'), data => {
                const { list, isMore } = data;
                if (list && list.length) {
                    const commentListStr = that.temps.commentList(list);
                    commentBox.append(commentListStr);
                }
                if (!isMore) commentMoreBtn.remove();
                if (!list.length) commentBox.append(that.temps.noComment('暂无评论，快来抢沙发吧！'));
            });
        });
        commentMoreBtn.trigger('click');
    }
    // 触发回复
    replyAction() {
        const that = this;
        // 上个回复框
        let prevReplyInput = $();
        that.el.off('click.replyAction').delegate('.reply-action', 'click.replyAction', function (e) {
            e.stopPropagation();
            // 当前回复的评论条目
            const commentMainCnt = $(this).parents('.pub-publish-content:first');
            // 当前回复的评论信息
            const commentInfo = commentMainCnt.data();
            // 判断是否生成了回复输入框
            const replyInput = commentMainCnt.find('>.pub-publish-submit:first');
            // 隐藏上个回复框
            if (replyInput.length) {
                if (prevReplyInput[0] === replyInput[0]) replyInput.toggle();
                else {
                    prevReplyInput.hide();
                    replyInput.show();
                }
                prevReplyInput = replyInput;
            } else {
                prevReplyInput.hide();
                commentMainCnt.find('.comment-bar:first').after(that.temps.pubPublishInput({
                    type: 'reply',
                    plh: `回复${commentInfo.cuser}`,
                    subText: '回复',
                    bgColor: commentInfo.type === 'comment' ? '#f8fafc' : '#fff'
                }));
                prevReplyInput = commentMainCnt.find('>.pub-publish-submit:first');
            }
        });
    }
    // 添加评论（回复）
    addComment() {
        const that = this;
        that.el.off('click.publish').delegate('.publish-btn', 'click.publish', function () {
            const $this = $(this);
            // 获取评论输入框
            const commentInp = $this.parent().prev().find('.comment-input:first');
            const commentVal = $.trim(commentInp.val());
            // 如果评论为空，提示
            if (!commentVal) { alert('说点啥呗~'); return; }
            // 获取用户名输入框
            const userVal = $.trim($this.prev().val());
            if (!userVal) { alert('尊姓大名！'); return; }
            // 清空输入框值
            commentInp.val('');

            // 请求参数
            const { cid, cuser } = $this.parents('.pub-publish-content:first').data() || {};
            const reqData = {
                content: commentVal,
                user: userVal,
                aid: getParmasByHash().aid,
                cid: cid,
                toUser: cuser
            };
            that.add && that.add(reqData, data => {
                console.log(data);
                if (data.type === 'comment') {
                    // 获取评论列表盒子
                    const commentBox = $this.parents('.publish-box:first').siblings('.comment-box:first');
                    commentBox.prepend(that.temps.commentList(data.list));
                    commentBox.find('.no-comment:first').remove();
                } else {
                    const commentMainCnt = $this.parents('.pub-publish-content:last');
                    let replyList = commentMainCnt.find('.reply-list:first');

                    if (!replyList.length) {
                        replyList = $('<div class="reply-box"><div class="reply-list"></div></div>');
                        commentMainCnt.append(replyList);
                    }
                    replyList.append(that.temps.commentList(data.list, 'reply'));
                    // 关闭回复输入框
                    $this.parents('.pub-publish-submit:first').hide();
                }
            });
        });
        // 输入框回车触发
        that.el.off('keydown.commentInp').delegate('.comment-input', 'keydown.commentInp', function (e) {
            if (e.keyCode === 13) $(this).parent().next().find('.publish-btn:first').trigger('click.publish');
        });
        // 输入框回车触发
        that.el.off('keydown.userInp').delegate('.user-input', 'keydown.userInp', function (e) {
            if (e.keyCode === 13) $(this).next().trigger('click.publish');
        });
    }
    // 评论（回复）点赞
    commentLike() {
        const that = this;
        let like_complete = true;
        that.el.off('click.commentLike').delegate('.comment-like', 'click.commentLike', function () {
            if (!like_complete) return;
            like_complete = false;
            const data = $(this).data();
            // 点赞
            that.like && that.like(data, commentLikeInfo => {
                if (commentLikeInfo.likeState) $(this).addClass('act');
                else $(this).removeClass('act');
                $(this).find('.like-num:first').text(commentLikeInfo.likeTotal);
                like_complete = true;
            });
        });
    }
    // 加载更多回复
    getReplyList() {
        const that = this;
        that.el.off('click.replyMore').delegate('.reply-more', 'click.replyMore', function () {
            const $this = $(this);
            const replyList = $this.prev();
            let { cid, page } = $this.data();
            page = page || 0;
            page++;
            $this.data('page', page);
            // 加载更多回复
            that.replyMore && that.replyMore({ cid, page }, commentData => {
                const { list, isMore } = commentData;
                replyList.append(that.temps.commentList(list, 'reply'));
                if (isMore === 0) $this.remove();
            });
        })
    }
}