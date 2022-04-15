<template>
<div>
    <section>
           <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <div>
                <el-form-item>
                <el-input v-model="filters.plate_name" placeholder="请输入板块名称或代码搜索"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-date-picker
                        v-model="filters.create_time"
                        type="date"
                        placeholder="发布时间查询">
                    </el-date-picker>
                </el-form-item>

                <el-form-item>
                <el-button type="primary"@click="page=1;getList()">查询</el-button>
                <el-button type="primary"@click="addList()">策略介绍</el-button>
                </el-form-item>
                <el-button  type="primary"@click="add()" >添加主题板块</el-button>
                </div>
            </el-form>
        </el-col>
        <el-table  ref="multipleTable" :data="datas"  highlight-current-row v-loading="listLoading" :fit="true" @selection-change="selsChange" style="width: 100%;">
            <el-table-column type="selection" width="55"></el-table-column>
            
             <el-table-column prop="" label="序号" min-width="60" >
                <template scope="num">
                    <!-- {{num.$index+1}} -->
                    {{datas.length - num.$index}}
                </template>
            </el-table-column>
            <el-table-column prop="theme_name" label="主题名称" min-width="100">
                <template scope="scope">
                    <div class="deleted-text" v-if="scope.row.type == 1">{{ scope.row.theme_name }}</div>
                    <div v-else>{{ scope.row.theme_name }}</div>
                </template>
            </el-table-column>
            <el-table-column prop="plate_name" label="板块名称(代码)" min-width="100">
                 <template scope="scope">
                    <div class="deleted-text" v-if="scope.row.type == 1">{{ scope.row.plate_name }}</div>
                    <div v-else>{{ scope.row.plate_name }}</div>
                </template>
            </el-table-column>
            <el-table-column prop="create_time" label="发布时间" min-width="100" >
                <template scope="scope">
                    <div class="deleted-text" v-if="scope.row.type == 1">{{ scope.row.create_time }}</div>
                    <div v-else>{{ scope.row.create_time }}</div>
                </template>
            </el-table-column>
            <el-table-column prop="operation_user" label="最近操作账号" min-width="100">
                <template scope="scope">
                    <div class="deleted-text" v-if="scope.row.type == 1">{{ scope.row.operation_user }}</div>
                    <div v-else>{{ scope.row.operation_user }}</div>
                </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" min-width="100" >
                <template scope="scope">
                    <div  v-if="scope.row.status == 1">
                        <div v-if="scope.row.status=='1' ">已启用</div> 
                        <div v-else>已禁用</div>
                    </div>
                    <div  v-else>
                        <div v-if="scope.row.status=='1' ">已启用</div> 
                        <div v-else>已禁用</div>
                    </div>

                </template>
            </el-table-column>
            <el-table-column label="操作" min-width="100">
                <template scope="scope">
                    <div v-if="scope.row.type ==1">
                        <el-button disabled type="danger" size="small"  @click="handleDel(scope.$index, scope.row)" v-if="scope.row.status=='1'">禁用</el-button>
                        <el-button disabled type="danger" size="small"  @click="handleDel(scope.$index, scope.row)" v-else="">启用</el-button>
                        <el-button disabled size="small" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
                        <el-button disabled type="danger" size="small"  @click="delTheme(scope.$index, scope.row)" >已删除</el-button>
                    </div>
                    <div v-else>
                        <el-button type="danger" size="small"  @click="handleDel(scope.$index, scope.row)" v-if="scope.row.status=='1'">禁用</el-button>
                        <el-button type="danger" size="small"  @click="handleDel(scope.$index, scope.row)" v-else="">启用</el-button>
                        <el-button size="small" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
                        <el-button type="danger" size="small"  @click="delTheme(scope.$index, scope.row)">删除</el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination v-if="this.total>this.size" @current-change="handleCurrentChange" :current-page="page" :page-size=this.size layout="total, prev, pager, next, jumper" :total=this.total></el-pagination>
        <!--编辑/添加界面-->
        <el-dialog :title=dialogTitle  :visible.sync="dialogVisible" :close-on-click-modal="false">
            <el-form  :model="editForm" :rules="rules" ref="editForm" label-width="100px" >
                <div>
                    <span style="color:#F00">*注：列表中已启用状态主题最多不能超过10个，新添加主题默认为已启用状态。</span>
                </div>
                <br>
                <el-form-item label="主题报告名称" prop="theme_name" label-width="120px">
                    <el-input  v-model="editForm.theme_name" placeholder="请输入主题报告名称,不超过6个汉子 "></el-input>
                </el-form-item>
                <el-form-item label="板块名称" prop="plate_name">
                    
                    <!-- <el-input  v-model="editForm.plate_name"  placeholder="输入板块名称/代码搜索,可添加多个"></el-input> -->
                    <div>
                        <el-select multiple  v-model="editForm.plate_name" filterable remote clearable placeholder="关键词" v-on:clear="add_select_clear" :remote-method="select_remoteMethod"
                            @change="selectchange" :loading="select_loading" auto-complete="off" style="width:600px;">
                            <el-option v-for="item in select_options" :key="item.value" :label="item.labelCode" :value="item.labelCode"></el-option>
                        </el-select>
                        <!-- <el-button type="primary" :disabled="bankuaiList.length >=5" @click="addBankuai">添加</el-button> -->
                    </div>
                </el-form-item>
                <!--  :on-exceed="handleExceed"
                :file-list="editForm.fileList"
                :limit="1"
                -->
                <el-form-item  label="主题报告封面图：" label-width="100px" style="margin-top:2%" prop="theme_pic" >
                    <el-upload
                        ref="upload"
                        class="avatar-uploader" 
                        action="/api/file/imageUpload/"
                        accept="image/*" 
                        :show-file-list="false"
                        :on-remove="handleRemove"
                        :on-success="handleImageSuccess"
                        :before-upload="handleBeforeUpload"
                        :http-request="fnUploadRequest">
                        <img v-if="editForm.theme_pic" :src="editForm.theme_pic" width="178px" height="178px" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item  label="主题报告内容:" prop="theme_reason" label-width="100px" style="margin-top:2%">
                     <quill-editor  v-model="editForm.theme_reason" 
                                  :options="editorOption">
                    </quill-editor>
                </el-form-item>
                <el-form-item>
                    <!-- <el-button @click.native="dialogVisible = false; $refs['editForm'].clearValidate();">取消</el-button> -->
                    <el-button @click.native="dialogVisible = false; $refs['editForm'].clearValidate(); ">取消</el-button>
                    <el-button type="primary"@click.native="editSubmit" :loading="editLoading">确定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </section>
    <!-- <router-view v-else></router-view> -->
    </div>
</template>
<script>
    import '../../common/js/DateFormat';
    import utils from '../../api/utils.js';
    import util from '../../common/js/util';
    import keyboardWizard from "../../common/js/KeyboardWizard.js";
    import {imageDefault} from "../../common/js/urls";
    import UeEdit from '../UeEdit.vue';
    import api from '../../api/api.js';
    import {ArticleList,Articlesave,Articleupdate,Articledelect,Articleupdateview} from "../../api/ydApi.js";
    // import api from '../../api/api.js';
    import axios from 'axios'
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
        components: {UeEdit},
        data() {
            var validatePass = (rule, value, callback) => {//验证标题6个汉子，或者12个字母
                var len = 0;
                for (var i = 0; i < value.length; i++) {
                    var a = value.charAt(i);
                    if (a.match(/[^\x00-\xff]/ig) != null) {//汉字两个字节
                        len+=2;
                    }else{
                        len+=1;
                    }
                }
                if(len>12){
                    callback(new Error("主题报告名称不能超过6个汉字"));
                }else{
                    callback();
                }
                // if(value.split(" ").join("").length == 0){
                //     callback(new Error("主题报告名称不能输入空格!"));
                // }else{
                //     callback(); 
                // }
            };
            // var validatePass = (rule, value, callback) => {
                // if(value.match(/^[ ]*$/)){
                //     callback(new Error("主题报告名称不能输入空格!"));
                // }else{
                //     callback(); 
                // }
            // }
            return {
                editorOption:{
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

                // // 图片上传
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
                // // 开始上传数据
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
                desin:false,
                biaoqianForm:[],
                options:[],
                checkList: [],
                select_options:[],
                select_loading:false,
                zhushuiid:'',
                flag:'0',
                multipleSelection:[],
                likeFrom:{},
                iden:'',
                textarea: "",
                // dialogTitle1: "",
                // isDisable:"",
                activeName: "",
                title:'',
                dialogTitle: "新增",
                radio: '1',
                ident: 0,
                editOrAdd:false,
                filters: {
                    plate_name:'',
                    create_time:''
                },
                datas: [],
                sels: [],
                total: 0,
                page: 1,
                size: 10,
                totalStatus:'',
                currentPage: 1,
                listLoading: false,
                chakanFormVisible:false,
                Loading: false,
                showUeEdit:false,
                dialogVisible: false,//编辑界面是否显示
                editLoading: false,
                arr:[],
                selectedList:[],
                // editFormRules: {
                //     content: [
                //         { required: true, message: '请输入正文内容', trigger: 'change' },
                //     ],
                //     name: [
                //         { required: true, message: '请选择标签', trigger: 'change' }
                //     ],
                //     title:[
                //         { required: true, message: '请输入标题', trigger: 'blur' }
                //     ]
                // },
                //编辑界面数据
                editForm: {
                },
                defaultModules: {
                    toolbar: ['image']
                },
                rules:{
                    plate_name:[   
                        {required: true, message: '请填写板块名称', trigger: 'blur'},
                    ],
                    theme_name:[   
                        {required: true, message: '请填写主题报告名称', trigger: 'blur'},
                        {validator: validatePass, message: '主题报告名称不能超过6个汉字', trigger: 'blur'}
                    ],
                    theme_pic:[   
                        {required: true, message: '请上传主题报告封面图', trigger: 'blur'},
                    ],
                    theme_reason: [   
                    {required: true, message: '请填写主题报告内容', trigger: 'blur'}
                ]
                }

            }
        },
        methods: {
            addBankuai() {
                this.bankuaiList.push('')
                if(this.bankuaiList.length >5){
                    this.$message.error('策略风格最多只能添加5次');
                }
            },
            add_select_clear() {
                this.editForm.sec_code = "";
            },
            handleBeforeUpload(file){
                if("image/jpeg"!=file.type&&"image/jpg"!=file.type&&"image/png"!=file.type){
                    this.$message.warning(`格式错误请重新上传，仅支持（jpg、png）`);
                    return false;
                }
                  let fileSize = (file.size / 1024 )< 500;

                if (!fileSize) {
                    this.$message.error('图片上传建议不超过500KB');
                    return false;
                }
            },
            select_remoteMethod(query) {
                if (query !== "") {
                    this.select_loading = true;
                    setTimeout(async () => {
                    this.select_loading = false;
                    var result = await keyboardWizard.getBanKuai(query);
                    result.forEach((v)=> {
                        v.labelCode = v.label + '(' + v.value + ')';
                    });
                    this.select_options = result;
                    }, 200);
                } else {
                    this.select_options = [];
                }
            },
            selectchange(val) {
                // alert(123)
                // console.log(val);
                // var r = this.editForm.sec_name;
                //  if (this.selectedList[val]) return;
                // for (var i = 0; i < this.select_options.length; i++) {
                //     var s = this.select_options[i];
                //     if (s.value == val) {
                //         // this.$set(this.selectedList, val, s);
                //         // alert(s)
                //         this.arr.push(s.label+'('+ val+')')
                //     }
                // }
                this.selectedList = val
            },
             handleExceed(files, fileList) {
                this.$message.warning(`当前限制选择 1 个文件~`);
            },
            handleImageSuccess(res, file) {
                // this.$set(this.editForm, 'theme_pic', imageDefault + res.message)
            },
            fnUploadRequest(option) {
                utils.ossput(new Date().getTime().toString(), option.file).then(res => {
                    this.$set(this.editForm, 'theme_pic', res.url);
                });
            },
            handleRemove(response, fileList) {
                this.$set(this.editForm, 'theme_pic',"")
            },   
            handleImageSuccessAdd(res, file) {
               this.$set(this.editForm, 'theme_pic', imageDefault + res.message)
            },
            handleRemoveAdd(response, fileList) {
                this.$set(this.editForm, 'theme_pic',"")
            },
            beforeImageUpload(file) {
                /* const isJPG = file.type === 'image/jpeg';
                 const isLt2M = file.size / 1024 / 1024 < 2;
                 if (!isJPG) {
                 this.$message.error('上传头像图片只能是 JPG 格式!');
                 }
                 if (!isLt2M) {
                 this.$message.error('上传头像图片大小不能超过 2MB!');
                 }
                 return isJPG && isLt2M;*/
                return true;
            },    
            selsChange: function(sels) {
			    this.sels = sels;
		    },
            handleCurrentChange(val) {
                this.page = val;
            },
            addList(){
                this.$router.push({path:'/cljs$ThemeInvestment'})
            },
            add:function(){
                this.selectedList=[];
                this.editOrAdd = true;
                this.dialogTitle = "主题板块管理";
                this.dialogVisible = true;
                this.$nextTick(() => {
                    this.$refs['upload'].clearFiles();
                })
                this.editForm = {
                    plate_name: '',
                };
                // this.$refs['editForm'].clearValidate(); 
            },
           async editSubmit(){
                if(this.ident == 0){
                    let para = Object.assign({}, this.editForm);
                    para = {
                        type:0,
                        status:1,
                        theme_name:this.editForm.theme_name
                    }
                    let result = await api.getStatus(para);
                    this.totalStatus = result.data;
                    if( this.totalStatus == 9999){
                        this.$message.error('该主题已被启用，请勿重复添加');
                        return;
                    }
                    if(this.totalStatus>=10){
                        this.$message.error('已启用主题已超过10个，请先关闭部分已启用主题');
                        return;
                    }
                    console.log(this.selectedList.length+"------"+this.selectedList);
                    if(this.selectedList.length > 5){
                        this.$message.error('每个主题最多添加5个板块');
                        return;
                    }
                }
               if(this.ident == 1){
                   let length = this.editForm.plate_name.length;
                   console.log(length+"------"+this.editForm.plate_name.length);
                   if(length > 5){
                       this.$message.error('添加的板块不能超过5个');
                       return;
                   }
               }
                this.$refs.editForm.validate((valid) => {
                if (valid) {
                this.$confirm('确认提交吗？', '提示', {}).then(async () => {
                    if(this.ident == 0){
                        let paraStatus = Object.assign({}, this.editForm);
                        paraStatus = {
                            type:0,
                            status:1,
                            theme_name:this.editForm.theme_name
                        }
                        let resultStatus = await api.getStatus(paraStatus);
                        this.totalStatus = resultStatus.data;
                        if( this.totalStatus == 9999){
                            this.$message.error('该主题已被启用，请勿重复添加');
                            return;
                        }
                        if(this.totalStatus>=10){
                            this.$message.error('已启用主题已超过10个，请先关闭部分已启用主题');
                            return;
                        }
                        if(this.selectedList.length > 5){
                            this.$message.error('每个主题最多添加5个板块');
                            return;
                        }
                    }

                    this.editLoading = true;
                    let result={};
                    let para = Object.assign({}, this.editForm);
                    let user = JSON.parse(sessionStorage.getItem('user'));
                    para.operation_user = user.user_name
                    para = Object.assign(para, {plate_name: this.selectedList.join('、')});
                    para.type=0
                    para.status=1

                    if(this.editOrAdd){
                            result= await api.addTheme(para);
                            if(result.state){
                                this.$message({message: '提交成功',type: 'success'});
                                this.editForm.fileList=[];
                                this.ident = 0
                            }else{
                                this.$message.error('提交失败');
                            }
                    }else{
                        result= await api.updateCy4ThemeInvestment(para);
                        console.log(para)
                        if(result.state){
                            this.$message({message: '提交成功',type: 'success'});
                        }else{
                            this.$message.error('提交失败');
                        }

                    }
                    this.clearEdit();
                    this.dialogVisible = false;
                    this.editLoading = false;
                    this.getList()
                });
                }
                })

                
            },
            //获取列表
            async getList(para){
                para = {
                    page : this.page,
                    size : this.size,
                    plate_name : this.filters.plate_name,
                    pub_time : this.filters.create_time&&new Date(this.filters.create_time).format('yyyy-MM-dd')
                };
                await api.selectCy4ThemeInvestmentByPage(para).then(res => {
                    console.log(JSON.stringify(res));
                    let result=res.data.result;
                    this.total = res.data.total;
                    var array = [];
                    var times = "";
                    for(var i=0;i<result.length;i++){
                        var date = new Date(result[i].create_time);
                        var Y = date.getFullYear() + '-';
                        var  M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
                        var  D = (date.getDate() < 10 ? '0'+(date.getDate()) : date.getDate()) + ' ';
                        var  h = (date.getHours() < 10 ? '0'+(date.getHours()) : date.getHours()) + ':';
                        var  m = (date.getMinutes() < 10 ? '0'+(date.getMinutes()) : date.getMinutes());
                        result[i].create_time=Y+M+D+h+m;
                        times = Y+M+D
                        if(result[i].type=='0'){
                            array.push(times)
                        }
                        
                    }
                    this.datas = result
                    
                });
            },
            //控制启用停用
            handleDel:function(index,row){
                this.editForm = Object.assign({}, row);
                // alert(JSON.stringify(this.editForm))
                if(row.status ==1){
                     this.$confirm('确认禁用该产品吗?', '提示', {
                        type: 'warning'
                    }).then(async () => {
                        this.editForm.status='0';
						let result=await api.updateStatus(this.editForm.id,this.editForm.status);
                        this.listLoading = false;
						this.getList();
						 this.$message({
                            message: '已禁用',
                            type: 'success'
                            });
                    }).catch(() => {

                    });
                }if(row.status ==0){
                    this.$confirm('确认启用该产品吗?', '提示', {
                        type: 'warning'
                    }).then(async () => {
                        let para = {
                            type:0,
                            status:1,
                            theme_name:this.editForm.theme_name
                        }
                        let result=await api.getStatus(para);
                        this.totalStatus = result.data;
                        if( this.totalStatus == 9999){
                            this.$message.error('该名称主题已被启用，请勿重复启用同名称主题');
                            return;
                        }else if(this.totalStatus>=10){
                            this.$message.error('启用主题不能超过10个');
                            return;
                        }else{
                            let result=await api.updateStatus(this.editForm.id,para.status);
                            console.log(JSON.stringify(result));
                            this.listLoading = false;
                            this.getList();
                            this.$message({
                                message: '已启用',
                                type: 'success'
                            });
                        }
						
                    }).catch(() => {

                    });
                   
                }
            },

            handleClick(tab, event) {
                console.log(tab, event);
            },
            handleCurrentChange(val) {
                this.page = val;
                var para = {
                    page:this.page,
                    size:this.size
                };
                this.getList(para)
            },
            //显示编辑界面
            async handleEdit (index, row) {
                this.ident = 1
                this.selectedList=[];
                console.log(JSON.stringify(row))
                this.dialogTitle = "编辑";
                this.editOrAdd = false;
                this.dialogVisible = true;
                this.editForm = Object.assign({}, row);
                this.showUeEdit = true;
                this.editForm.plate_name = []
                // this.editForm.plate_name.push(row.plate_name);
                var arr = row.plate_name.split("、");
                arr.forEach((v) => {
                    this.select_options.push(v);
                    this.editForm.plate_name.push(v);
                });
                this.selectedList.push(row.plate_name);
                console.log(this.select_options)
                // this.$refs['editForm'].clearValidate();
            },
        
            //删除
            async delTheme(index, row) {
                var confirmText=''
                confirmText = '若确认删除则不可恢复，确定要删除该内容吗?'
                const newDatas = [] 
                const h = this.$createElement 
                newDatas.push(h('p', null, confirmText)) 
                        this.$confirm( '提示', 
                        { title: '删除提示',
                        message: h('div', null, newDatas), 
                        showCancelButton: true, 
                        confirmButtonText: '确定', 
                        cancelButtonText: '取消' } ).then(async () => {
                  this.listLoading = true;
                  await  api.delectCy4ThemeInvestment(row.id).then(res=>{
                    var result=res.data;
                    if (res.state) {
                        this.listLoading = false;
                        this.$message({
                            message: "删除成功",
                            type: "success"
                        });
                        this.iden='0'
                    } else {
                        this.listLoading = false;
                        this.$message({
                            message: "删除失败",
                            type: "error"
                        });
                        
                    }
                    this.getList();
				});

            })
            .catch(() => {
               });
            },
            //恢复编辑页面为默认
            clearEdit(){
                let tmpObj = {
                };
                this.showUeEdit = false;
                this.editForm = Object.assign({}, tmpObj);
            },

        },
        mounted() {
            this.getList();
            // this.getStatus();
        }
    }
</script>
<style slot-scope>
.deleted-text{
        color: #999999;
    }
 
    .deleted-text{
        color: #999999;
    }
    .el-dialog.el-dialog--small{
        overflow-x: hidden;
    }
    .el-dialog__body{
        max-height: 800px;
        overflow-y: auto;
/*        margin-right: -14px;
        padding-right: 34px;*/
    }
    .ql-container.ql-snow{
        max-height: 200px;
        overflow-y: auto;
    }
    .el-pagination{
        text-align: center;
    }
    .el-message-box__message p:first-child{
    text-align: center;
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