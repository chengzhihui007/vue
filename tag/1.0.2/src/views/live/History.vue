<template>
    <section class="mtop">
        <template>
            <el-row>                
                <el-col :span="24">
                    <div class="tip">
                        <p>战绩汇总</p>
                    </div>
                    <el-col :span="16">
                        <el-col :span="4" v-for="item in scorelist" :key="item.id" style="margin-right:20px; margin-top:10px;">
                            <el-card :body-style="{ padding: '0px' }" shadow="hover">
                                <img :src="item.imager" class="image">
                                <div style="padding: 14px;">
                                    <span></span>
                                    <div class="bottom clearfix">
                                    <time class="time">{{item.update_time}}</time>
                                    <el-button type="danger" class="button" icon="el-icon-delete" @click="handleDel(item.id)" circle></el-button>                                   
                                    </div>
                                </div>
                            </el-card>
                        </el-col>
                        
                    </el-col>

                    <el-col :span="8">
                        <h2>增加战绩汇总</h2>
                        <el-upload
                        action="http://ydgpzbj.ydtg.com.cn:84/index/yapi/upscoreimg"
                        list-type="picture-card"
                        name="image"
                        :on-preview="handlePictureCardPreview"
                        :on-remove="handleRemove"
                        :on-success="handlesuccess">
                        <i class="el-icon-plus"></i>
                        </el-upload>
                        <el-dialog :visible.sync="dialogVisible">
                        <img width="100%" :src="dialogImageUrl" alt="">
                        </el-dialog>
                    </el-col>
                </el-col>
            </el-row>            
        </template>
    </section>
</template>

<script>
import { classes, scorelist,scoredel } from "../../api/getdatas";
var qs = require('qs');
export default {
  data() {
    return {
      filters: {
        real_name: ""
      },
      dialogImageUrl: "",
      dialogVisible: false,
      loading: false,
      classes: [],
      scorelist: [],
      formLabelAlign: [],
      editclass: false
    };
  },
  methods: {
    handleDel(row){
        let para = {id: row}        
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            scoredel(qs.stringify(para)).then(res => {
                this.$message({
                    type: 'success',
                    message: '删除成功!'
                });
                this.getScores();
            });
        }).catch(() => {
            this.$message({
                type: 'info',
                message: '已取消删除'
            });          
        }); 
    },
    handlesuccess(data){
        this.$message({
            type: 'success',
            message: '发布成功'
        }); 
        this.getScores();
        console.log(data);
    },
    handleRemove(file, fileList) {
        console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
    },       
    getScores: function() {
      scorelist().then(res => {
        this.scorelist = res.data;
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    submiteditForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  },
  mounted() {
    this.getScores();
  }
};
</script>
<style scoped>
.ruleForm {
  padding-left: 30px;
}
.time {
  font-size: 13px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 40px;
}

.button {
  float: right;
}

.image {
  width: 100%;
  display: block;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}
</style>




