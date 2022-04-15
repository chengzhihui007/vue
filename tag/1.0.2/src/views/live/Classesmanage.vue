<template>
  <section class="mtop">
    <template>
      <el-row>
        <el-col :span="24">
          <div class="tip">
            <p>课程管理</p>
          </div>
        </el-col>
        <el-col :span="16">
          <el-table
            :data="classes"
            highlight-current-row
            v-loading="loading"
            style="width: 100%;"
          >
            <el-table-column
              type="selection"
              width="55"
            >
            </el-table-column>
            <el-table-column
              prop="id"
              label="ID"
              width="60"
            >
            </el-table-column>
            <el-table-column
              prop="title"
              label="课程名称"
            >
            </el-table-column>
            <el-table-column
              prop="nickname"
              label="讲师"
            >
            </el-table-column>
            <el-table-column
              prop="start"
              label="开始时间"
            >
            </el-table-column>
            <el-table-column
              prop="end"
              label="结束时间"
            >
            </el-table-column>
            <el-table-column label="头像">
              <template slot-scope="scope">
                <img
                  v-bind:src="scope.row.head"
                  width="25"
                />
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              width="150"
            >
              <template slot-scope="scope">
                <el-button
                  size="small"
                  @click="handleEdit(scope.$index, scope.row)"
                >编辑</el-button>
                <el-button
                  type="danger"
                  size="small"
                  @click="handleDel(scope.$index, scope.row)"
                >删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
        <el-col :span="8">
          <el-form
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            label-width="100px"
            class="ruleForm"
          >
            <el-form-item
              label="选择老师"
              prop="tid"
            >
              <el-select
                style="width: 46%;"
                v-model="ruleForm.tid"
                placeholder="请选择老师"
              >
                <el-option
                  label="李鑫"
                  value="15"
                ></el-option>
                <el-option
                  label="张利"
                  value="16"
                ></el-option>
                <el-option
                  label="乐强"
                  value="17"
                ></el-option>
                <el-option
                  label="揭冲"
                  value="18"
                ></el-option>
                <el-option
                  label="董也"
                  value="21"
                ></el-option>
                <el-option
                  label="吴敬华"
                  value="23"
                ></el-option>
                <el-option
                  label="曾小武"
                  value="26"
                ></el-option>
                <el-option
                  label="郭海涛"
                  value="27"
                  selected="selected"
                ></el-option>
                <el-option
                  label="付林林"
                  value="29"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="课程名称"
              prop="title"
            >
              <el-input
                style="width: 46%;"
                v-model="ruleForm.title"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="开始时间"
              required
            >
              <el-col :span="11">
                <el-form-item prop="start">
                  <el-time-picker
                    type="fixed-time"
                    placeholder="选择时间"
                    format="HH:mm"
                    value-format="HH:mm"
                    v-model="ruleForm.start"
                    style="width: 100%;"
                  ></el-time-picker>
                </el-form-item>
              </el-col>
            </el-form-item>
            <el-form-item
              label="结束时间"
              required
            >
              <el-col :span="11">
                <el-form-item prop="end">
                  <el-time-picker
                    type="fixed-time"
                    placeholder="选择时间"
                    format="HH:mm"
                    value-format="HH:mm"
                    v-model="ruleForm.end"
                    style="width: 100%;"
                  ></el-time-picker>
                </el-form-item>
              </el-col>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                @click="submitForm('ruleForm')"
              >添加课程</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <!--弹窗数据-->
      <el-dialog
        title="编辑课程"
        :visible.sync="editclass"
        width="30%"
        center
      >
        <el-form
          :model="editruleForm"
          :rules="editrules"
          ref="editruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item
            label="课程ID"
            prop="id"
          >
            <el-input
              style="width: 46%;"
              v-model="editruleForm.id"
              :disabled="true"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="选择老师"
            prop="tid"
          >
            <el-select
              v-model="value"
              placeholder="请选择老师"
            >
              <el-option
                v-for="item in options"
                :label="item.label"
                v-bind:key="item.value"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="课程名称"
            prop="title"
          >
            <el-input
              style="width: 46%;"
              v-model="editruleForm.title"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="开始时间"
            required
          >
            <el-col :span="11">
              <el-form-item prop="start">
                <el-time-picker
                  type="fixed-time"
                  placeholder="开始时间"
                  format="HH:mm"
                  value-format="HH:mm"
                  v-model="editruleForm.start"
                  style="width: 100%;"
                ></el-time-picker>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item
            label="结束时间"
            required
          >
            <el-col :span="11">
              <el-form-item prop="end">
                <el-time-picker
                  type="fixed-time"
                  placeholder="结束时间"
                  format="HH:mm"
                  value-format="HH:mm"
                  v-model="editruleForm.end"
                  style="width: 100%;"
                ></el-time-picker>
              </el-form-item>
            </el-col>
          </el-form-item>
        </el-form>
        <div
          slot="footer"
          class="dialog-footer"
        >
          <el-button @click="editclass = false">取 消</el-button>
          <el-button
            type="primary"
            @click="submiteditForm('editruleForm')"
          >确 定</el-button>
        </div>
      </el-dialog>
    </template>
  </section>
</template>

<script>
import {
  classes,
  scorelist,
  classesAdd,
  classesUp,
  classesDel
} from "../../api/getdatas";
import qs from "qs";
export default {
  data() {
    return {
      filters: {
        real_name: ""
      },
      loading: false,
      classes: [],

      ruleForm: {
        tid: "",
        title: "",
        start: "",
        end: ""
      },
      rules: {
        tid: [{ required: true, message: "请选择老师", trigger: "blur" }],
        title: [
          { required: true, message: "请输入课程名称", trigger: "blur" },
          { min: 3, max: 15, message: "长度在 3 到 15 个字符", trigger: "blur" }
        ],
        start: [
          { required: true, message: "请选择课程开始时间", trigger: "blur" }
        ],
        end: [
          { required: true, message: "请选择课程结束时间", trigger: "blur" }
        ]
      },
      editclass: false,
      options: [
        {
          value: 15,
          label: "李鑫"
        },
        {
          value: 16,
          label: "张利"
        },
        {
          value: 17,
          label: "乐强"
        },
        {
          value: 18,
          label: "揭冲"
        },
        {
          value: 21,
          label: "董也"
        },
        {
          value: "23",
          label: "吴敬华"
        },
        {
          value: 26,
          label: "曾小武"
        },
        {
          value: 27,
          label: "郭海涛"
        },
        {
          value: 29,
          label: "付林林"
        }
      ],
      value: 0,
      editruleForm: {
        id: 0,
        tid: 0,
        title: "",
        start: "",
        end: ""
      },
      editrules: {
        tid: [{ required: true, message: "请选择老师", trigger: "blur" }],
        title: [
          { required: true, message: "请输入课程名称", trigger: "blur" },
          { min: 3, max: 15, message: "长度在 3 到 15 个字符", trigger: "blur" }
        ],
        start: [
          { required: true, message: "请选择课程开始时间", trigger: "blur" }
        ],
        end: [
          { required: true, message: "请选择课程结束时间", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    handleEdit(index, row) {
      this.editclass = true;
      this.value = row.tid;
      this.editruleForm.tid = row.tid;
      this.editruleForm.id = row.id;
      this.editruleForm.title = row.title;
      this.editruleForm.start = row.start;
      this.editruleForm.end = row.end;
    },
    handleDel: function(index, row) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let para = { id: row.id };
          classesDel(qs.stringify(para)).then(res => {
            if (res.data) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.getClass();
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    getClass: function() {
      classes().then(res => {
        this.classes = res.data;
      });
    },
    getScores: function() {
      scorelist().then(res => {
        this.scorelist = res.data;
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let para = this.ruleForm;
          classesAdd(qs.stringify(para)).then(res => {
            if (res.data == 1) {
              this.$message({
                message: "提交成功",
                type: "success"
              });
              this.getClass();
            } else {
              this.$message.error("提交失败");
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    submiteditForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let para = this.editruleForm;
          classesUp(qs.stringify(para)).then(res => {
            if (res.data == 1) {
              this.$message({
                message: "提交成功",
                type: "success"
              });
              this.editclass = false;
              this.getClass();
            } else {
              this.$message.error("提交失败");
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  },
  mounted() {
    this.getClass();
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




