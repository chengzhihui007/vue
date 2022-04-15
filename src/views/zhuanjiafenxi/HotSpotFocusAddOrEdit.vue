<template>
    <section style="padding-left: 5%; padding-right: 20%;">
         <!--编辑界面-->

         <br/>
            <el-form  :model="editForm" :rules="rules" ref="editForm" label-width="120px" >
                <el-form-item label="标题" prop="title">
                    <el-input  v-model="editForm.title" placeholder="请输入标题，不超过20个汉字"></el-input>
                </el-form-item>
                <el-form-item label="内容" prop="content">
                     <quill-editor v-model="editForm.content"
                                  :options="editorOption">
                    </quill-editor>
                </el-form-item>
               <el-form-item label="相关个股" prop="stocks">
                    <el-button v-if="editForm.stocks.length<10" size="mini" type="primary" @click="addStocks({stockCode:'',stockName:''})">添加</el-button>
                </el-form-item>
                <el-form-item v-for="(stock, index) in editForm.stocks" :key="index">
                    <el-col :span="5">
                        <el-select
                          v-model="stock.stockName"
                          @change="selectChange(stock)"
                          filterable
                          remote
                          placeholder="股票名称"
                          :remote-method="remoteMethod"
                          :loading="loading">
                          <el-option
                            v-for="item in options"
                            :key="item.stockCode"
                            :label="item.stockName"
                            :value="item.stockName">
                            <span style="float: left">{{ item.stockName }}</span>
                            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.stockCode }}</span>
                          </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="5">
                        <el-input readonly v-model="stock.stockCode"  placeholder="股票代码"   style="width: 100%; padding-left:5%"></el-input>
                    </el-col>
                    <el-col :span="5">
                        <el-button type="danger"@click="editForm.stocks.splice(index,1)"  icon="el-icon-delete" style=" margin-left:10%"></el-button>
                    </el-col>
                 </el-form-item>
                <el-form-item label="老师职业信息" prop="personId" >
                    <el-select  v-model="editForm.personId" @change="selectTeacher" clearable placeholder="请选择老师执业信息"  >
                        <el-option
                                v-for="item in teacherFrom"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <div>{{ description }}</div>
                </el-form-item>
                    <br/>
                    <br/>
                    <br/>
                <el-form-item>
                    <el-button @click="$router.push({path:'/hotSpotFocus',query:{}})">取消</el-button>
                    <el-button type="primary" @click="editSubmit('editForm')">提交</el-button>
                </el-form-item>
            </el-form>
    </section>
</template>

<script>
    import '../../common/js/DateFormat';
    import utils from '../../api/utils.js';
    import {listPracticalSolution,insertPracticalSolution,updatePracticalSolution,deletePracticalSolution} from "../../api/cyApi.js";
    import api from "../../api/api.js"
    import {imageDefault} from "../../common/js/urls";
    import qullconfig from "../../common/js/quill-config";


let uploadConfig={
             action:  '/api/file/imageUpload/',  // 必填参数 图片上传地址
           methods: 'POST',  // 必填参数 图片上传方式
              token: '',  // 可选参数 如果需要token验证，假设你的token有存放在sessionStorage
              name: 'file',  // 必填参数 文件的参数名
            size: 500,  // 可选参数   图片大小，单位为Kb, 1M = 1024Kb
                accept: 'image/png, image/gif, image/jpeg, image/bmp, image/x-icon'  // 可选 可上传的图片格式
}
    export default {
        props:["vipNum","type"],
        data() {
            var checkname = (rule, value, callback) => {
                setTimeout(() => {
                    if(this.editForm.content.replace(/<\/?.+?>/g,"").match(/^[ ]*$/)){
                        callback(new Error("请填写消息内容"));
                        return false;
                    } else {
                        callback();
                    }
                }, 500);
            };
            var validatePass = (rule, value, callback) => {//验证标题12个汉子，或者24个字母
                var len = 0;
                for (var i = 0; i < value.length; i++) {
                    var a = value.charAt(i);
                    if (a.match(/[^\x00-\xff]/ig) != null) {//汉字两个字节
                        len+=2;
                    }else{
                        len+=1;
                    }
                }
                if(len > 40){
                    callback(new Error("标题字数不能超过20个汉字"));
                }else{
                    callback();
                }
            };
            return {
                options:[],
                id:'',
                editorOption: {
                    placeholder:'请输入内容并编辑样式',
                    modules: {
                        toolbar: {
                            container: qullconfig.toolOptions,  // 工具栏选项
                            handlers:{
                                image:function(){
        console.log(this);
        var self = this;

        var fileInput = this.container.querySelector('input.ql-image[type=file]');
        if (fileInput === null) {
            fileInput = document.createElement('input');
            fileInput.setAttribute('type', 'file');
            // 设置图片参数名
            if (uploadConfig.name) {
                fileInput.setAttribute('name', uploadConfig.name);
            }
            // 可设置上传图片的格式
            fileInput.setAttribute('accept', uploadConfig.accept);
            fileInput.classList.add('ql-image');
            // 监听选择文件
            fileInput.addEventListener('change', function () {

                                //验证图片
            if("image/jpeg"!=fileInput.files[0].type&&"image/jpg"!=fileInput.files[0].type&&"image/png"!=fileInput.files[0].type){
                window.eleMsg.warning(`格式错误请重新上传，仅支持（jpg、png）`);
                return false;
            }

                // 创建formData
                var formData = new FormData();
                formData.append(uploadConfig.name, fileInput.files[0]);
                formData.append('object','product');

                // 如果需要token且存在token
                if (uploadConfig.token) {
                    formData.append('token', uploadConfig.token)
                }

                utils.ossput(new Date().getTime().toString(), fileInput.files[0]).then(res => {

                    let length = self.quill.getSelection(true).index;
                    //这里很重要，你图片上传成功后，img的src需要在这里添加，res.path就是你服务器返回的图片链接。
                    self.quill.insertEmbed(length, 'image',  res.url);
                    self.quill.setSelection(length + 1)

                    fileInput.value = ''
                });

                // 图片上传
                // var xhr = new XMLHttpRequest();
                // xhr.open(uploadConfig.methods, uploadConfig.action, true);
                // // 上传数据成功，会触发
                // xhr.onload = function (e) {
                //     if (xhr.status === 200) {
                //         var res = JSON.parse(xhr.responseText);
                //         let length = self.quill.getSelection(true).index;
                //         //这里很重要，你图片上传成功后，img的src需要在这里添加，res.path就是你服务器返回的图片链接。
                //         self.quill.insertEmbed(length, 'image', imageDefault + res.message);
                //         self.quill.setSelection(length + 1)
                //     }
                //     fileInput.value = ''
                // };
                // 开始上传数据
                // xhr.upload.onloadstart = function (e) {
                //     fileInput.value = ''
                // };
                // // 当发生网络异常的时候会触发，如果上传数据的过程还未结束
                // xhr.upload.onerror = function (e) {
                // };
                // // 上传数据完成（成功或者失败）时会触发
                // xhr.upload.onloadend = function (e) {
                //     // console.log('上传结束')
                // };
                // xhr.send(formData)
            });
            this.container.appendChild(fileInput);
        }
        fileInput.click();
                                }
                            }
                        }
                    }
                },
                audioFileList:[],

                filters: {
                    date: '',
                    title: '',
                },
                datas: [],
                pageNum: 1,
                pageSize: 15,
                total: 0,
                dialogTitle: "添加",
                editOrAdd:false,
                team_id:"",
                listLoading: false,
                dialogVisible: false,//编辑界面是否显示
                editLoading: false,
                //编辑界面数据
                editForm: {
                   stocks:[],
                },
                teacherFrom:{},
                description: '',
                rules: {
                    title: [
                        {required: true, message: '请填写标题', trigger: 'blur'},
                        {validator:(rule, value, callback)=>{
                            if(!value.trim()){
                                callback(new Error("标题不能为空字符串"))
                            } else
                            {callback()}
                        },trigger: 'blur'},
                        { validator: validatePass, trigger: ['change', 'blur']}
                    ],
                     category: [
                         { required: true, message: '请选择分类', trigger: 'blur' }
                    ],
                    audioAddress: [
                        { required: true, message: "请选择语音文件", trigger: "change" }
                    ],
                    content: [
                        {required: true, message: '请填写消息内容', trigger: 'blur'},
                        { validator: checkname, message: "请填写消息内容", trigger: ['change', "blur"]}
                        // {max: 500, message: '长度在500个字符', trigger: 'blur'},
                        // {validator:(rule, value, callback)=>{
                        //     let c=value||'';
                        //     let div=document.createElement("div");div.innerHTML=c;c=div.textContent||'';
                        //     if(c.length>500){
                        //         callback(new Error("长度在500个字符"))
                        //     }
                        //     callback()
                        // },trigger: 'blur'}
                    ],
                    personId: [
                        {required: true, message: '请选择老师信息', trigger: 'blur'}
                    ],
                    stocks:[
                     {required: true, message: '请填写相关个股', trigger: 'blur',},
                     {validator:(rule, value, callback)=>{
                        this.editForm.stocks= value.filter(d=>{
                            return !!d.stockCode
                         })
                         if(this.editForm.stocks.length<=0){
                             callback(new Error("请填写相关个股"))
                         }

                         callback()
                     },trigger: 'blur'}
                    ]
                },
            }
        },
        methods: {
            selectTeacher(val) {
               let teac = this.teacherFrom.find(e => {
                   return val == e.id;
               });
                if (teac) {
                    this.description = teac.description;
                    this.editForm.teacDescription = teac.description;
                    this.editForm.teacName = teac.name;
                } else {
                    this.description = '';
                    this.editForm.teacDescription = '';
                    this.editForm.teacName = '';
                }

            },
            addStocks(data) {
                this.editForm.stocks.push(data)
            },
            selectChange(obj){
                let option=this.options.find(d=>{
                    return d.stockName==obj.stockName;
                });

                let res = this.editForm.stocks.find(d=> {
                    return (d.codePrefix + d.stockCode) == option.stockCode;
                });

                if (res) {
                    this.$message({
                        message: '该股票已添加，请勿重复添加',
                        type: 'error'
                    });
                    obj.stockName = '';
                    obj.codePrefix = '';
                    obj.stockCode = '';
                    return false;
                }
                obj.codePrefix=option.stockCode.substr(0, 2);
                obj.stockCode=option.stockCode.slice(-6);
            },
           async remoteMethod(query){
                   this.options=[]
                   let resp=await api.searchStock(query);
                   if(!resp||!resp.state){
                       return
                   }
                   let data=resp.data;
                   data.forEach(d=>{
                       this.options.push({stockName:d.jc,stockCode:d.dm})
                   })
            },
            handleRemove(response, fileList) {
                this.editForm.audioAddress = "";
            },
            handleExceed(files, fileList) {
                this.$message.warning(`当前限制选择 1 个文件~`);
            },
            handleAudioBeforeUpload(file){
                if("audio/mp3"!=file.type){
                this.$message.warning(`仅支持mp3格式`);
                return false;
                }
            },
            handleAudioSuccess(res, file) {
              this.editForm.audioAddress=mp3Default + res.message;
              let audioAddress=mp3Default + res.message;
              if(audioAddress){
                let audio=new Audio(audioAddress);
                audio.addEventListener("loadedmetadata",()=>{
                    let duration=audio.duration;
                    if(duration){
                       this.editForm.audioDuration=duration*1000
                    }
                });
             }
             this.$refs['upload'].clearValidate()
            },
            handleCurrentChange(val) {
                this.page = val;
                this.getList();
            },
            combineEditFormContentAndImg(){
            },
            splitEditFormContentAndImg(){
            },
            resetForm(formName){
            this.dialogVisible = false;
                this.$refs[formName].resetFields();
            },
            //获取列表数据
           async getList() {
                this.listLoading = true;
                let params={
                    pageNum: this.pageNum,
                    pageSize: this.pageSize
                }
                this.filters.date&&(params.date=new Date(this.filters.date).format("yyyy-MM-dd"))
                this.filters.title&&(params.title=this.filters.title)
                let resp=await api.findHotSpotFocusByPage(params)
                if(!resp){
                    return;
                }
                let data=resp.data;
                this.datas=data.list
                this.total = data.total;
                this.listLoading = false;
            },
            handleDel: function (index, row) {
                this.editForm = Object.assign({}, row);

                    this.$confirm('若删除该内容则不可恢复，确定要删除该内容吗？', '提示', {
                        type: 'warning'
                    }).then(async () => {
                       let resp=await api.deleteSolutionVideoById(this.editForm.id)
                                     if(!resp||!resp.state){
                                    this.$message({
                                            message: '删除失败: '+(resp?resp.data:''),
                                            type: 'error'
                                        });
                                   }else if(resp.state){
                                         this.$message({
                                            message: '删除成功',
                                            type: 'success'
                                        });
                                        // this.page=1;
                                        this.getList()
                                   }
                    }).catch((e) => {
                        console.error(e)
                    });
            },
            //显示新增界面
            handleAdd: function () {
                this.audioFileList=[]
                this.editOrAdd = true;
                this.dialogTitle = "语音上传";
                this.dialogVisible = true;
                this.editForm = {
                    title: '',
                    audioAddress:''
                };
            },
            //显示编辑界面
            handleEdit: function (index, row) {
                this.editOrAdd = false;
                this.dialogTitle = "语音修改";
                this.dialogVisible = true;
                this.editForm= {
                    id: row.id,
                    title: row.title,
                    audioAddress:row.audioAddress,
                    audioDuration:row.audioDuration,
                }
                this.audioFileList=[{ name: row.audioAddress, url: row.audioAddress }];
            },
            //编辑
            editSubmit: function (formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then( async () => {
                            if(this.editOrAdd==true){
                                let params={
                                    title:this.editForm.title,
                                    operator:this.userName,
                                    content:this.editForm.content,
                                    stocks:this.editForm.stocks,
                                    personId: this.editForm.personId,
                                    teacName: this.editForm.teacName,
                                    teacDescription: this.editForm.teacDescription
                                }
                                let resp=await api.insertHotSpotFocus(params)
                                if(!resp||!resp.state){
                                 this.$message({
                                         message: '添加失败: '+(resp?resp.data:''),
                                         type: 'error'
                                     });
                                }else if(resp.state){
                                      this.$message({
                                         message: '添加成功',
                                         type: 'success'
                                     });
                                     this.$router.push({path:'/hotSpotFocus',query:{}})
                                }
                                this.dialogVisible = false;
                            }
                            if(this.editOrAdd ==false){
                                let params={
                                    id:this.editForm.id,
                                    title:this.editForm.title,
                                    operator:this.userName,
                                    content:this.editForm.content,
                                    stocks:this.editForm.stocks,
                                    personId: this.editForm.personId,
                                    teacName: this.editForm.teacName,
                                    teacDescription: this.editForm.teacDescription
                                }
                                let resp=await api.updateHotSpotFocus(params)
                                if(!resp||!resp.state){
                                    this.$message({
                                        message: '修改失败: '+((resp?resp.data:'')),
                                        type: 'error'
                                     });
                                }else if(resp.state){
                                    this.$message({
                                        message: '修改成功',
                                        type: 'success'
                                    });
                                    this.$router.push({path:'/hotSpotFocus',query:{}})
                                }
                                this.dialogVisible = false;
                            }
                        });
                    }
                });
            },
            selsChange: function (sels) {
                this.sels = sels;
            },
            async selectTeacherList(flag) {
                let paras = {
                    //pageNo: this.page,
                    //pageSize: 10,
                    flag:flag

                };
                let lists = await api.selectPersonList(paras);
                let arr = [];
                for(let i=0;i<lists.length;i++){

                    arr.push(lists[i]);

                }
                this.teacherFrom = arr;
                this.listLoading = false;
            }
        },
        async  mounted() {
            window.eleMsg=this.$message
            var user = sessionStorage.getItem('user');
            var userArray = JSON.parse(user);
            this.team_id = userArray.team_id;
            this.team_name = userArray.team_name;
            this.userName=userArray.user_name
            this.editOrAdd=true;
            this.selectTeacherList(0);
            if(this.$route.query.id){
                this.editOrAdd=false;
               let resp=await api.findHotSpotFocusById(this.$route.query.id)
                if(!resp){
                    return;
                }

                if (resp.data.personId) {
                    resp.data.personId = resp.data.personId + "";
                }
                this.editForm=resp.data;
                this.selectTeacher(resp.data.personId);
            }

        }
    }

</script>
<style  >
    .deleted-text{
        color: #999999;
    }
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }
    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
</style>

<style >
.ql-container{
 height: 20em;
}
.ql-toolbar.ql-snow{
    line-height:initial;
}
 .ql-toolbar.ql-snow button.ql-link
, .ql-img-hidden .ql-toolbar.ql-snow button.ql-image
,.ql-toolbar.ql-snow button.ql-video
{
    display: none;
}
</style>
