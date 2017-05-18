/**
 * ITCAST WEB
 * Created by zhousg on 2017/2/19.
 */
$(function(){
    /*动态响应式轮播图*/
    banner();
    /*初始页签*/
    initTabs();
    /*初始化工具提示 *自己初始化* */
    $('[data-toggle="tooltip"]').tooltip();
});
/*动态响应式轮播图*/
var banner = function(){
    /*
     * 1.获取轮播图数据  ajax异步获取数据
     *
     * 2.获取数据之后 根据当前设备来渲染轮播图
     * 2.1 判断设备    根据设备的宽度来区分  小于768px认为是移动端 反之非移动端
     * 2.2 把数据转换成html格式的字符串  （动态创建dom js拼接字符串  模版引擎 underscore.template ）
     * 2.3 渲染到页面当中
     *
     * 3.测试 在切换设备的时候动态渲染   resize
     *
     * 4.移动端手势切换 （上一张  下一张）
     * */

    /*实现*/
    /*获取需要操作的元素*/
    var banner = $('.wjs_banner');

    var point = banner.find('.carousel-indicators');

    var image = banner.find('.carousel-inner');

    /*1.获取轮播图数据  ajax异步获取数据*/
    var getData = function(callback){
        /*缓存数据*/
        if(window.imageData){
            callback && callback(window.imageData);
            return false;
        }
        /*ajax*/
        $.ajax({
            type:'get',
            url:'js/data.json',
            data:'',
            dataType:'json',
            success:function(data){
                window.imageData = data;
                /*渲染*/
                callback && callback(window.imageData);
            }
        });
    };

    /*
     ** 2.获取数据之后 根据当前设备来渲染轮播图
     * 2.1 判断设备    根据设备的宽度来区分  小于768px认为是移动端 反之非移动端
     * 2.2 把数据转换成html格式的字符串  （动态创建dom js拼接字符串  模版引擎 underscore.template ）
     * 2.3 渲染到页面当中
     * */
    var render = function(){
        getData(function(data){
            /*使用数据*/
            /*2.1 判断设备 */
            var width = $(window).width();
            var isMobile = width < 768 ? true : false;
            /*2.2 把数据转换成html格式的字符串 */
            /*1.获取模版内容*/
            /*2.转换成模版函数*/
            /*3.通过这个模版函数转换成html*/
            var pointStr = $('#point').html();
            var imageStr = $('#image').html();

            var pointFuc = _.template(pointStr);
            var imageFuc = _.template(imageStr);

            var pointHtml = pointFuc({model:data});
            var imageHtml = imageFuc({model:data,isM:isMobile});

            /*2.3 渲染到页面当中*/
            point.html(pointHtml);
            image.html(imageHtml);
        });
    }

    /*3.测试 在切换设备的时候动态渲染 resize*/
    /*多次请求  解决方案：缓存数据   最好存在全局变量当中 */
    $(window).on('resize',function(){
        /*重新渲染*/
        render();
    }).trigger('resize');/*trigger 主动触发 传入的事件*/

    /*4.移动端手势切换 （上一张  下一张）*/
    /*假设x方向移动了50以上就认为是一个手势*/

    /*在jquery当中绑定touch相关事件的时候  会有一个叫originalEvent它是原生事件当中的TouchEvent*/
    var startX = 0;/*记录开的的坐标*/
    var distanceX = 0;/*滑动的距离*/
    var isMove = false;/*记录有没有滑动过*/
    banner.on('touchstart',function(e){
        startX = e.originalEvent.touches[0].clientX;
    }).on('touchmove',function(e){
        var moveX = e.originalEvent.touches[0].clientX;
        distanceX = moveX - startX;
        isMove = true;
    }).on('touchend',function(e){

        /*手势的条件是什么*/
        /*1.必须滑动过 2.距离要超过 50px*/
        if(isMove && Math.abs(distanceX) > 50){
            /*满足条件*/
            /*怎么判断方向*/
            if(distanceX > 0){
                /*方向是右  上一张*/
                $('.carousel').carousel('prev');
            }else{
                /*方向是左  下一张*/
                $('.carousel').carousel('next');
            }
        }

        /*重置参数*/
        startX = 0;
        distanceX = 0;
        isMove = false;
    });

};


/*初始化页签功能*/
var initTabs = function(){
    /*
    * 1.在一行显示    计算每个盒子的宽度让后设置给父容器
    * 2.保证滑动的结构  加一个外容器 (完成)
    * 3.使用iscroll做区域滚动
    * */

    /*获取需要操作的元素*/
    var parentBox = $('.nav-tabs-parent');
    var childBox = parentBox.children();
    var Tabs = childBox.find('li');

    /*1.在一行显示*/
    var width = 0;

    Tabs.each(function(k,v){
        width += $(v).outerWidth(true);
        /*
        * width()   内容
        * innerWidth() 内容+内边距
        * outerWidth() 内容+内边距+边框
        * outerWidth(true) 内容+内边距+边框+外边距
        * */
    });

    childBox.width(width);

    /*3.使用iscroll做区域滚动*/
    new IScroll('.nav-tabs-parent',{
        scrollX:true,
        scrollY:false
    });

}