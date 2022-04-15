<template>
    <div class="content">
        <div class="chat-wrap">
            <div class="chat-nav" >
                <a href="javascript:void(0)" :class="qx == 4 ? 'act' : ''" @click="navClick(4)">四星实时聊天</a>
                <a href="javascript:void(0)" :class="qx == 5 ? 'act' : ''" @click="navClick(5)">五星实时聊天</a>
            </div>
            <div class="chat-box-scroll" id="chat-box-scroll">
            <!--四星-->
            <div class="chat-box" id="chatBox">
                <ul v-if="dataArr != null && dataArr.length != 0">
                    <li v-for="(v, k) in dataArr" :key="k" class="clear">
                        <div class="chat-img"><img :src="v.avatar||defaultAvatar"></div>
                        <div class="chat-info">
                            <div class="chat-tel">{{v.nickname}} {{new Date(v.time).format('yyyy-MM-dd')==new Date().format('yyyy-MM-dd')?new Date(v.time).format('hh:mm'):new Date(v.time).format('yyyy-MM-dd hh:mm')}}</div>
                            <div class="chat-message">
                                <div class="chat-content">{{v.content}}</div>
                            </div>
                        </div>
                    </li>
                </ul>
                <ul v-else class="chat-nul">
                   暂无聊天数据
                </ul>
            </div>
            <!--五星-->
            <!--<div class="chat-box" v-show="qx == 5">
                <ul>
                    <li v-for="(v, k) in dataArr" :key="k" class="clear">
                        <div class="chat-img"><img :src="v.avatar||defaultAvatar"></div>
                        <div class="chat-info">
                            <div class="chat-tel">{{v.nickname}} {{new Date(v.time).format('yyyy-MM-dd')==new Date().format('yyyy-MM-dd')?new Date(v.time).format('hh:mm'):new Date(v.time).format('yyyy-MM-dd hh:mm')}}</div>
                            <div class="chat-message">
                                <div class="chat-content">{{v.content}}</div>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
            -->
            </div>
        </div>
    </div>
</template>
<script>
import '../../common/js/DateFormat';
    export default {
        data() {
            return {
                defaultAvatar:'https://p2.music.126.net/5Ro1SzzscayIeN79n9X4NA==/109951163828048206.jpg?param=50y50',
                qx: 4,
                dataArr: [
                    {
                        avatar: 'https://p2.music.126.net/5Ro1SzzscayIeN79n9X4NA==/109951163828048206.jpg?param=50y50',
                        nickname: '12346',
                        time: '12:59',
                        content: 'fdafdafds'
                    },
                    {
                        avatar: 'https://p2.music.126.net/5Ro1SzzscayIeN79n9X4NA==/109951163828048206.jpg?param=50y50',
                        nickname: '12346',
                        time: '12:59',
                        content: 'fdafdafdsfdafdafdsfdafdafdsfdafdafdsfdafdafds'
                    }
                ]
            }
        },
        mounted() {
            this.getHistoryByDays(2)
        },
        methods: {
            chatScrollEnd(value) {
                let cbs = document.getElementById('chat-box-scroll');
                // if (cbs.scrollTo) {
                //     cbs.scrollTo(0, value)
                // }

              cbs.scrollTop = value;
            },
            getDivHeight(){
               setTimeout(()=>{
                    let height = document.getElementById('chatBox').offsetHeight;
                    this.chatScrollEnd(height);  
               },50)
            },
            navClick(n){
                this.qx = n;
                this.getHistoryByDays(2);
               
            },
            getHistoryByDays(days){
                let path="/ydhxgtest/ZhuanJiaFenXi/JiePanShiPinAsk/";
                //取消订阅
                this.unsubscribeData(path+"4/"+new Date().format('yyyyMMdd'))                
                this.unsubscribeData(path+"5/"+new Date().format('yyyyMMdd'))    
                this.dataArr=[]
                path=path+this.qx;
                ydc.sync().ref(path).orderByKey().firstLevel().limitToLast(days).get(d=>{
                    if(!d.success){
                        this.subscribeData(path+"/"+new Date().format('yyyyMMdd'))
                        return;
                    }
                    let ds=Object.keys(d.nodeContent)
                    ds.sort()
                    this.scrollData(path,ds)
                })
            },
            
            scrollData(path,ds,endValue){
                if(!ds[0]){
                    this.subscribeData(path+"/"+new Date().format('yyyyMMdd')) 
                    this.getDivHeight();              
                    return;
                }
                this.nextData(path+"/"+ds[0],100,d=>{
                    let keys=Object.keys(d).sort()
                    if(!keys.length){
                        ds.shift()
                        this.scrollData(path,ds)
                    }else{
                        //记录最后的值
                        endValue=keys[keys.length-1]
                        //处理数据
                        keys.forEach(i=>{
                            this.dataArr.push(d[i])
                        })
                        //如果最后值不存在就结束遍历
                        if(endValue){
                            this.scrollData(path,ds,endValue)
                        }  
                    }
                },false,endValue);
            },
            nextData(path,limitSize,fn,desc,endValue,callback){
                if(!desc){
                    if(endValue){
                        ydc.sync().ref(path).orderByKey().startAt(endValue).limitToFirst(limitSize+1).get(d=>{
                            if(!d.success){
                                console.error(d)
                                return;
                            }
                            delete d.nodeContent[endValue]
                            fn(d.nodeContent);
                            return;
                        })
                    }else{
                        ydc.sync().ref(path).orderByKey().limitToFirst(limitSize).get(d=>{
                            if(!d.success){
                                console.error(d)
                                return;
                            }
                            delete d.nodeContent[endValue]
                            fn(d.nodeContent);
                            return;
                        })
                    }
                }else{
                 
                }
            },
            /**订阅数据 */
            subscribeData(path){
                ydc.sync().ref(path).on("child_add",d=>{
                    if(!d.success){
                        return
                    }
                    this.dataArr.push(d.nodeContent)
                    this.getDivHeight();
                })
            },
            unsubscribeData(path){
                ydc.sync().ref(path).off("child_add")
            }

        }
    }
</script>
<style scoped>
    .content{
        padding-top: 20px;
    }
    .chat-wrap{
        max-height: calc(100vh - 140px);
        background: #000;
        overflow: hidden;
    }
    .chat-nav{
        height: 40px;
        background: #ffffff;
    }
    .chat-nav a{
        display: block;
        width: 100px;
        height: 39px;
        line-height: 40px;
        text-align: center;
        font-size: 14px;
        color: #000000;
        float: left;
        text-decoration: none;
        border: 1px solid #ccc;
        border-bottom: none;
    }
    .chat-nav a.act{
        background: #169bd5;
    }
    .chat-box{
        width: 800px;
        height: auto;
        overflow: hidden;
    }
    .chat-box-scroll{
        height: calc(100vh - 180px);
        overflow-y: auto;
        position: relative;
    }
    .chat-box li{
        margin-bottom: 20px;
    }
    .chat-box li .chat-img{
        width: 50px;
        height: 50px;
        margin-right: 20px;
        border-radius: 50%;
        overflow: hidden;
        float: left;
    }
    .chat-info{
        width: 600px;
        float: left;
    }
    .chat-tel{
        height: 20px;
        color: #FFF;
        margin-top: 5px;
        margin-bottom: 10px;
    }
    .chat-message{
        position: relative;

    }
    .chat-content{
        border-radius: 5px;
        line-height: 24px;
        padding: 10px;
        background: #FFF;
        display: inline-block;
        color: #333;
        font-size: 14px;

    }
    .chat-content::after{
        content: '';
        position: absolute;
        display: block;
        width: 11px;
        height: 15px;
        background: url("../../assets/icon-chat.png") no-repeat;
        left: -11px;
        top: 10px;
    }
    /* 清除浮动 */
    .clear:before,.clear:after {
        content:"";
        display:table;
    }
    .clear:after {
        clear:both;
        overflow:hidden;
    }
    .chat-nul {
        color: #fff;
        position: absolute;
    }
    .clear {
        zoom:1; /* for ie6 & ie7 */
    }
</style>
