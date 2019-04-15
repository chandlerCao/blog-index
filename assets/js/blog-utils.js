export const host = '';
import { TimestampFormat, $win } from '../com/js/com';
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
// 获取hash动态路径参数
export const getParmasByHash = function () {
    const hash = window.location.hash;
    const regArr = hash.match(/(\w+)=([^&])+/g);
    const data = {};
    if (regArr && regArr.length) {
        regArr.forEach(params => {
            const paramsArr = params.split('=');
            // decodeURIComponent 解决中文问题
            data[paramsArr[0]] = decodeURIComponent(paramsArr[1]);
        });
        return data;
    } return {};
}
// 侧边栏背景3D切换
export const banner3d = function (box, imgArr) {
    /**
     * box: 父级
     * imgArr 图片数组
     * rowLen 横排个数
     * colLen 竖排个数
     */
    // 父级宽高
    const box_width = box.width();
    const box_height = box.height();

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
    // 计算应该展示的图片尺寸
    function calDisplaySize() {
        const imgPromise = [];
        imgArr.forEach((src, i) => {
            imgPromise.push(new Promise((resolve, reject) => {
                getImageSizeByUrl(src).then(imgSize => {
                    // 获取图片原始宽高
                    let img_width = imgSize.w, img_height = imgSize.h;
                    let new_width, new_height;
                    if ($win.width() > 800) new_height = box_height;
                    else new_width = box_width;
                    if (img_height < box_height) new_width = img_width * (new_height / img_height);
                    else new_width = img_width * (new_height / img_height);
                    resolve({ w: new_width, h: new_height })
                });
            }));
        });
        return imgPromise;
    }
    // 初始化图片宽高
    const imgPromise = calDisplaySize();
    Promise.all(imgPromise).then(imgSizeArr => {
        init(imgSizeArr);
    });

    function init(imgSizeArr) {
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
                str += `<div style="position: absolute; width: 100%; height: 100%; left: 0; top: 0; background-image: url(${url}); background-size: ${imgSizeArr[j].w}px ${imgSizeArr[j].h}px; background-position: ${-bpx}px ${-bpy}px; transform-origin: center center -${cell_w / 2}px; ${transform}; animation: picture3DSwitch${j + 1} 20s ${0.04 * i + 2}s infinite"></div>`;
            });
            html += `<div style="transform-style: preserve-3d; float: left; position: relative; width: ${cell_w}px; height: ${cell_h}px;">${str}</div>`;
        });
        box.html(html);
    }
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
// 防抖
export const PreventShaking = (fn, delay) => {
    let timer = null;
    return function () {
        timer && clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(this, [...arguments]);
        }, delay);
    }
}
// canvas雪花
export const Snow = function (imgArr) {

    const promiseImgArr = [];

    imgArr.forEach(imgSrc => {
        promiseImgArr.push(new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = function () {
                resolve(img);
            }
            img.onerror = function (err) {
                reject(err);
            }
            img.src = imgSrc;
        }))
    });

    Promise.all(promiseImgArr).then(function (imgs) {
        // 初始化
        initStar(imgs);
        // 重绘
        requestAnimationFrame(starFlash);
    })

    function drawObj(cxt, img, x, y, r, color) {
        /**星星 */
        // let r2 = r / 2.5;
        // cxt.beginPath();
        // for (let i = 0; i < 5; i++) {
        //     cxt.lineTo(Math.cos((18 + i * 72) / 180 * Math.PI) * r + x, -Math.sin((18 + i * 72) / 180 * Math.PI) * r + y);
        //     cxt.lineTo(Math.cos((54 + i * 72) / 180 * Math.PI) * r2 + x, -Math.sin((54 + i * 72) / 180 * Math.PI) * r2 + y);
        // }
        // cxt.closePath();
        // //设置边框样式以及填充颜色
        // cxt.fillStyle = color;
        // cxt.fill();
        /**星星 */

        /**雪花 */
        cxt.beginPath();
        cxt.drawImage(img, x, y, r, r);
        cxt.closePath();
        /**雪花 */
    }
    const canvas = $('#canvasBg');
    const ctx = canvas[0].getContext('2d');
    const color = '#6eaaff';
    let snowArr = [];
    let starLen = Math.floor($win.width() * $win.height() / 40000);
    starLen = starLen < 10 ? 10 : starLen;
    function random() {
        return Math.random();
    }
    canvas.attr({
        width: $win.width(),
        height: $win.height()
    });
    function initStar(imgs) {
        const imgLen = imgs.length;
        ctx.clearRect(0, 0, canvas.attr('width'), canvas.attr('height'));
        // 初始化每一个雪花
        for (let i = 0; i < starLen; i++) {
            const x = random() * canvas.attr('width');
            snowArr.push({
                x: x,
                startX: x,
                y: random() * canvas.attr('height'),
                speedY: 1,
                r: random() * 8 + 8,
                xNum: 0,
                range: random() * 40,
                img: imgs[Math.floor(Math.random() * imgLen)]
            });
        }
    };

    function starFlash() {
        ctx.clearRect(0, 0, canvas.attr('width'), canvas.attr('height'));
        for (let i = 0; i < starLen; i++) {
            // y轴加
            snowArr[i].y += snowArr[i].speedY;
            if (snowArr[i].y >= $win.height()) snowArr[i].y = -snowArr[i].r;

            snowArr[i].xNum--;
            if (snowArr[i].xNum === -360) snowArr[i].xNum = 0;

            snowArr[i].x = snowArr[i].startX - snowArr[i].range * Math.sin(Math.PI / 180 * snowArr[i].xNum);

            // g.arc(snowArr[i].x, snowArr[i].y, snowArr[i].r, 0, Math.PI * 2);
            drawObj(ctx, snowArr[i].img, snowArr[i].x, snowArr[i].y, snowArr[i].r, color);
        };
        setTimeout(function () {
            requestAnimationFrame(starFlash);
        }, 20);
    };
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
        // 无评论时显示的文字
        this.noCommentMsg = opts.noCommentMsg || '暂无评论，快来抢沙发吧！';
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
                return `<div class="pub-publish-submit mt10">
                    <div class="publish-input">
                        <input type="text" class="com-text comment-input animated" placeholder="${obj.plh || '说点啥呗~'}" autofocus="autofocus">
                        <span class="comment-text-line"></span>
                    </div>
                    <div class="publish-action">
                        <div class="publish-user-text">
                            <input type="text" class="com-text user-input animated" placeholder="我的大名！">
                            <span class="comment-text-line"></span>
                        </div>
                        <button type="button" data-type="${obj.type}" class="${obj.type}-btn publish-btn com-button blue mini"> <i class="fa fa-send"></i> ${obj.subText || '评论'}</button>
                    </div>
                </div>`
            },
            // 公共评论主要内容展示
            pubPublishContent(commentItem, type = "comment") {
                return `<div class="pub-publish-content ${type}-publish-content" ${commentItem.cid ? `data-cid="${commentItem.cid}"` : ``} ${commentItem.mid ? `data-mid="${commentItem.mid}"` : ''} data-cuser="${commentItem.user}" ${commentItem.aid ? `data-aid="${commentItem.aid}"` : ``} data-type="${type}">
                            <div class="user-name">${commentItem.user} <span class="user-city">${commentItem.city}的大佬</span></div>
                            <div class="comment-content">${commentItem.toUser ? `回复 <span style="color: #2e97ff;">${commentItem.toUser}</span>：` : ''}${commentItem.content}</div>
                            <div class="comment-bar clear mt10">
                                <div class="com-icon fl">
                                    <i class="com-icon__pic calendar-icon"></i>
                                    <span class="com-icon__text">${TimestampFormat(commentItem.date)}</span>
                                </div>
                                <div class="action-box fr">
                                    <a href="javascript:;" class="comment-like heart-box art-icon mr10 ${commentItem.isLike ? 'act' : ''}" ${commentItem.cid ? `data-cid="${commentItem.cid}"` : ``} ${commentItem.mid ? `data-mid="${commentItem.mid}"` : ''}${commentItem.rid ? ` data-rid="${commentItem.rid}"` : ''}>
                                        <i class="heart-icon__pic"></i>
                                        <span class="heart-icon__text">喜欢(<span class="like-num">${commentItem.likeCount}</span>)</span>
                                    </a>
                                    <a href="javascript:;" class="com-icon reply-action">
                                        <i class="com-icon__pic reply-icon">&nbsp;</i>
                                        <span class="com-icon__text">回复</span>
                                    </a>
                                </div>
                            </div>
                            ${commentItem.replyData && commentItem.replyData.list.length ? this.replyBox({ list: commentItem.replyData.list, isMore: commentItem.replyData.isMore, cid: commentItem.cid, mid: commentItem.mid }) : ``}
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
                    ${obj.isMore ? `<div class="reply-more" ${obj.cid ? `data-cid="${obj.cid}"` : ``} ${obj.mid ? `data-mid="${obj.mid}"` : ''}>加载更多 ></div>` : ''}
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
        let end = true;
        // 评论列表父级
        const commentBox = that.el.find('.comment-box:first');
        // 加载更多评论点击
        const commentMoreBtn = that.el.find('.comment-more:first');
        // 获取更多评论
        commentMoreBtn.on('click', function () {
            if (!end) return false;
            end = false;
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
                if (!list.length) commentBox.append(that.temps.noComment(that.noCommentMsg));
                end = true;
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
                    subText: '回复'
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
            const userVal = $.trim($this.prev().find('.user-input:first').val());
            if (!userVal) { alert('尊姓大名！'); return; }
            // 清空输入框值
            commentInp.val('');

            // 请求参数
            const { mid, cid, cuser } = $this.parents('.pub-publish-content:first').data() || {};
            const reqData = {
                content: commentVal,
                user: userVal,
                mid,
                cid,
                aid: getParmasByHash().aid,
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

                    if (!replyList.length) replyList = $('<div class="reply-list"></div>').appendTo($(`<div class="reply-box"></div>`).appendTo(commentMainCnt));
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
            if (e.keyCode === 13) $(this).parent().next().trigger('click.publish');
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
        let end = true;
        that.el.off('click.replyMore').delegate('.reply-more', 'click.replyMore', function () {
            if (!end) return false;
            end = false;
            const $this = $(this);
            const replyList = $this.prev();
            let { mid, cid, page } = $this.data();
            console.log(mid);
            page = page || 0;
            page++;
            $this.data('page', page);
            // 加载更多回复
            that.replyMore && that.replyMore({ mid, cid, page }, commentData => {
                const { list, isMore } = commentData;
                replyList.append(that.temps.commentList(list, 'reply'));
                if (isMore === 0) $this.remove();
                end = true;
            });
        })
    }
}
// 判断是否为pc端
export const IsPC = () => {
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