<template>
    <section>
        <div class="wrapper">
            <div  class="toolbar">产品内活动信息</div>
            <div class="right">
            <el-form :model="editForm" :rules="rules" ref="editForm" :inline="true">
                <el-row>
                    <el-col>
                        <el-form-item required label="活动名称：" prop='subject'>
                            <el-input disabled v-model="editForm.subject" style="width:100%"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>    
                <el-row>
                    <el-col>
                        <el-form-item required label="PC活动链接地址：" prop='PCline'>
                            <el-input :disabled="editForm.state =='2'" placeholder="请输入链接地址" v-model="editForm.PCline" style="width :300%"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col>
                        <el-form-item required label="APP活动链接地址：" prop='APPline'>
                            <el-input :disabled="editForm.state =='2'" placeholder="请输入链接地址" v-model="editForm.APPline" style="width :300%"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col>
                        <el-form-item required label="PC分享链接地址：" prop='PClineShare'>
                            <el-input :disabled="editForm.state =='2'" placeholder="请输入链接地址" v-model="editForm.PClineShare" style="width :300%"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                
                <el-row>
                    <el-col>
                        <el-form-item required label="历史战绩：" ></el-form-item>
                        <el-form-item  prop="historyStart">
                            <el-date-picker
                            v-model="editForm.historyStart"
                            type="date"
                            value-format="yyyy-MM-dd"
                            placeholder="选择区间范围-开始时间">
                            </el-date-picker>
                        </el-form-item> 
                        &nbsp;&nbsp;&nbsp;——&nbsp;&nbsp;&nbsp;           
                        <el-form-item  prop="historyEnd">
                            <el-date-picker              
                            v-model="editForm.historyEnd"
                            type="date"
                            value-format="yyyy-MM-dd"
                            placeholder="选择区间范围-结束时间">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row> 
                <div class="div">
                    <el-row v-for="(form, i) in dataArray" :key="i">
                        <el-col :span="60">
                            <el-form :model="form" :rules="rules" ref="form">
                                <el-form-item prop = 'sec_name'>
                                    <el-select v-model="form.sec_name" filterable remote clearable placeholder="股票名称" @clear="add_select_clear(i)" :remote-method="select_remoteMethod"
                                        @change="(value) => selectchange(value, i)" :loading="select_loading" auto-complete="off" style="width: 75%;">
                                        <el-option v-for="item in select_options" :key="item.value" :label="item.value" :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item prop='sec_code'>
                                    <el-input placeholder="股票代码" v-model="form.sec_code" style="width: 80%;"></el-input>
                                </el-form-item>
                                <el-form-item prop='interval_inc'>
                                    <el-input placeholder="区间涨幅(XX.NN)" v-model="form.interval_inc" style="width: 80%;"></el-input>
                                </el-form-item>
                                <el-form-item prop='interval_amp'>
                                    <el-input placeholder="区间振幅(XX.NN)" v-model="form.interval_amp" style="width: 80%;"></el-input>
                                </el-form-item>
                                <el-form-item prop='selection_time'>
                                    <el-date-picker
                                        v-model="form.selection_time"
                                        type="date"
                                        value-format="yyyy-MM-dd"
                                        placeholder="入选时间(YYYY-MM-DD)" >
                                    </el-date-picker>
                                </el-form-item>
                            </el-form>
                        </el-col>
                    </el-row>
                </div>              
                <el-form-item label="活动规则：" prop='ac_guize'> 
                    <el-input type="textarea" :rows="6"  v-model="editForm.ac_guize" placeholder="不超过1000个汉字" style="width: 800px"></el-input>
                </el-form-item>
                <div  class="toolbar">助力活动信息</div>
                <el-row :gutter="10">
                    <el-col :span="6">
                        <el-form-item required label="好友助力活动详情：" prop='friendline'>
                            <el-input :disabled="editForm.state =='2'" placeholder="请输入活动链接地址" v-model="editForm.friendline" style="width: 300%;"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible1()">取 消</el-button>
                <el-button type="primary"  @click="editSubmit()" >提交</el-button>
            </div>
        </div>
    </section>
    </template> 
    <script>
    import '../../common/js/DateFormat';
    import tuokeUrl from '../../api/tuoke.js';
    import api from "../../api/api.js";
    import keyboardWizard from "../../common/js/KeyboardWizard.js";
    export default {
        data() {
            return {
                dataArray: [
                    {sec_name: '', sec_code: '', interval_inc: '', interval_amp: '', selection_time: '' },
                    {sec_name: '', sec_code: '', interval_inc: '', interval_amp: '', selection_time: '' },
                    {sec_name: '', sec_code: '', interval_inc: '', interval_amp: '', selection_time: '' },
                    {sec_name: '', sec_code: '', interval_inc: '', interval_amp: '', selection_time: '' },
                    {sec_name: '', sec_code: '', interval_inc: '', interval_amp: '', selection_time: '' },
                ],
                select_options:[],
                editForm:{},
                select_loading:false,
                rules:{
                    APPline: [
                        {required: true, message: '请填写链接地址', trigger: 'blur'},
                        {validator:(rule, value, callback)=>{
                            console.log(value)
                            try{
                                if(value){
                                    new URL(value)
                                }
                            }catch(e){
                                callback(new Error("请正确填写链接地址"))
                            }
                            callback()
                        },trigger: 'blur'}                     
                    ],
                    PCline: [
                        {required: true, message: '请填写链接地址', trigger: 'blur'},
                        {validator:(rule, value, callback)=>{
                            try{
                                if(value){
                                    new URL(value)
                                }
                            }catch(e){
                                callback(new Error("请正确填写链接地址"))
                            }
                            callback()
                        },trigger: 'blur'}                     
                    ],
                    PClineShare: [
                        {required: true, message: '请填写链接地址', trigger: 'blur'},
                        {validator:(rule, value, callback)=>{
                            try{
                                if(value){
                                    new URL(value)
                                }
                            }catch(e){
                                callback(new Error("请正确填写链接地址"))
                            }
                            callback()
                        },trigger: 'blur'}                     
                    ],
                    friendline:[
                        {required: true, message: '请填写链接地址', trigger: 'blur'},
                        {validator:(rule, value, callback)=>{
                            try{
                                if(value){
                                    new URL(value)
                                }
                            }catch(e){
                                callback(new Error("请正确填写链接地址"))
                            }
                            callback()
                        },trigger: 'blur'}
                    ],
                    ac_guize:[
                        {required: true, message: '请输入活动规则', trigger: 'blur'},
                        {max: 1000, message: '活动规则最多不能超过1000个汉字', trigger: 'blur'}
                    ],
                    sec_name:[
                        {required: true, message: '请填写股票名称', trigger: 'change'},
                    ],
                    sec_code:[
                        {required: true, message: '请填写股票代码', trigger: 'change'},
                    ],
                    interval_inc:[
                        {required: true, message: '请填写历史战绩信息', trigger: 'blur' },
                        {validator:(rule, value, callback)=>{
                            var reg = /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/;
                            if (reg.test(value) === false) {
                            callback(new Error("战绩信息填写格式错误"));
                            }
                            callback();
                        },trigger:'blur'},
                    ],
                    interval_amp:[
                        {required: true, message: '请填写历史战绩信息', trigger: 'blur' },
                        {validator:(rule, value, callback)=>{
                            var reg = /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/;
                            if (reg.test(value) === false) {
                            callback(new Error("战绩信息填写格式错误"));
                            }
                            callback();
                        },trigger:'blur'},
                    ],
                    selection_time:[
                        {required: true, message: '请填写历史战绩信息', trigger: 'blur' }
                    ],
                    historyStart: [
                        {required: true, message: '请选择区间开始时间', trigger: 'blur'},
                        
                    ],  
                    historyEnd: [
                        {required: true, message: '请选择区间结束时间', trigger: 'blur'},
                        {validator:(rule, value, callback)=>{
                            
                            if(new Date(value).format('yyyy-MM-dd')<=new Date(this.editForm.historyStart).format('yyyy-MM-dd')){
                                callback(new Error("结束时间必须在开始时间以后"))
                            }
                            callback()
                        },trigger: 'blur'}                      
                    ]   
                }
            }
        },
        methods:{
            dialogVisible1(){
                this.$router.go(-1);
            },
            editSubmit(){
                var _this = this
                var p1=new Promise(function(resolve, reject) {
                    var forms = _this.$refs.form;
                    var t =0;
                    forms.forEach(v => {
                        v.validate((valid) => {
                            console.log(valid)
                            if(valid){
                                t+=1
                            }
                            if(t == 4){
                                resolve();
                            }else{
                                return;
                            }
                        });
                    });
                });
        
                var p2=new Promise(function(resolve, reject) {
                    _this.$refs.editForm.validate((valid) => {
                        if(valid){
                            resolve();
                        }
                    });
                });
                Promise.all([p1,p2]).then(function(){
                    _this.$confirm("确认提交吗？", "提示", {}).then(async () => {
                        var id = _this.$route.query.id;
                        var path = tuokeUrl.url+id
                        var ref = ydc.sync().ref(path);
                        //获取节点中最新数据
                        let user = JSON.parse(sessionStorage.getItem('user'));
                        ref.orderByKey().limitToLast(20).get((res) => {
                            res.nodeContent['historyForm'] = _this.dataArray
                            res.nodeContent.PCline = _this.editForm.PCline
                            res.nodeContent.APPline = _this.editForm.APPline
                            res.nodeContent.PClineShare = _this.editForm.PClineShare
                            res.nodeContent.historyStart = _this.editForm.historyStart
                            res.nodeContent.historyEnd = _this.editForm.historyEnd
                            res.nodeContent.ac_guize = _this.editForm.ac_guize
                            res.nodeContent.friendline = _this.editForm.friendline
                            res.nodeContent.updateTime = new Date().format('yyyy-MM-dd hh:mm')
                            res.nodeContent.operator = user.user_name
                            // 更新节点
                            ref.set(res.nodeContent,function(){
                                _this.$message({message: '提交成功',type: 'success', onClose() {
                                    _this.$router.push({path: '/laXinHuoDong'});
                                }});
                            })
                        });
                    });
                });
            },
            getList(){
                var ac_name = this.$route.query.id;
                var path = tuokeUrl.url + ac_name
                var ref = ydc.sync().ref(path);
                //获取节点
                ref.orderByKey().limitToLast(30).get((res) => {
                    this.editForm = res.nodeContent
                    this.hisData = res.nodeContent.historyForm
                    for(var i in this.hisData){
                        this.$set(this.dataArray[i], 'sec_name', this.hisData[i].sec_name);
                        this.$set(this.dataArray[i], 'sec_code', this.hisData[i].sec_code);
                        this.$set(this.dataArray[i], 'interval_inc', this.hisData[i].interval_inc);
                        this.$set(this.dataArray[i], 'interval_amp', this.hisData[i].interval_amp);
                        this.$set(this.dataArray[i], 'selection_time', this.hisData[i].selection_time);
                    }
                });
            },
            add_select_clear(i) {
                this.dataArray[i].sec_code = "";
            },
            select_remoteMethod(query) {
                this.select_options = [];
                if (query !== "") {
                    this.select_loading = true;
                    setTimeout(async () => {
                        this.select_loading = false;
                        var result = await api.searchStock(query)
                        let data=result.data;
                        data.forEach(d=>{
                            this.select_options.push({value:d.jc,label:d.dm})
                        })
                    }, 200);
                } else {
                    this.select_options = [];
                }
            },
            
            selectchange(name, i1) {
                if (name.length != 0) {
                    var i = 0;
                    this.dataArray.forEach(v => {
                        if(v.sec_name == name){
                            i+=1;
                            if (i > 1) {
                                this.$message({
                                    message: '该股票已添加，请勿重复添加',
                                    type: 'error'
                                });
                            }
                            return;
                        }
                    });
                }
                for (var i in this.select_options) {
                    if (this.select_options[i].value == name) {
                        var label = this.select_options[i].label.slice(-6);
                        this.$set(this.dataArray[i1], 'sec_code', label);
                        break;
                    }
                }
            },
        },
        mounted() {
            this.getList();
        }
    }
    </script>
    <style>
        .el-row {
            margin-bottom: 10px;
        }
        .el-col {
            border-radius: 4px;
        }
        .bg-purple-dark {
            background: #99a9bf;
        }
        .bg-purple {
            background: #d3dce6;
        }
        .bg-purple-light {
            background: #e5e9f2;
        }
        .grid-content {
            border-radius: 4px;
            min-height: 36px;
        }
        .row-bg {
            padding: 10px 0;
            background-color: #f9fafc;
        }
        .el-form-item__content{
            display: inline-block;
        }
        .el-form-item__input{
            display: inline-block;
        }
        .content {
            width: 800px;
        }
        .head {
            font-size: 20px;
            border-bottom: 1px solid rgb(177, 172, 172);
            padding-bottom: 10px;
            margin-bottom: 10px;
        }
        .wrapper {
            transform:translateY(2%);/**下移元素**/
            -ms-transform:translateY(2%);
            -webkit-transform:translateY(2%);
        }
        .wrapper > div {
            margin-bottom: 20px;
        }
        .div{
            margin-left: 85px;
        }
        .dialog-footer{
            padding-left: 400px;
        }
        .content {
            width: 800px;
        }
    </style>
    
    