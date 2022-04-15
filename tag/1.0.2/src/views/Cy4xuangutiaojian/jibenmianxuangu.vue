<template>
  <div class="content">
    <div class="chosecon">
      <div class="title">基本面选股</div>
      <div class="chosebox">
        <div class="cbtitle">选股条件</div>
        <div class="cbcon clear">
          <div class="cbleft">
            <div class="cbcontitle">基本面选股</div>
            <div class="cbleft-con">
              <el-tree :data="treedata" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
            </div>
          </div>
          <div class="cbright">
            <div class="cbcontitle">已选条件</div>
            <div class="cbright-con">
              <el-form ref="choseform" :model="choseform" label-width="80px">
                <el-form-item label="满足方式" prop="option1">
                    <el-radio v-model="radio" label="0">全部满足</el-radio>
                    <el-radio v-model="radio" label="1">任一满足</el-radio>
                </el-form-item>
                <el-form-item label="包含ST股" prop="option2">
                    <el-radio v-model="radio1" label="0">是</el-radio>
                    <el-radio v-model="radio1" label="1">否</el-radio>
                </el-form-item>
                <div class="line"></div>
                <div class="selectedbox">
                  <div
                    class="selper"
                    @mouseenter="selperMouseenter(k)"
                    @mouseleave="selperMouseleave(k)"
                    :class="seleShowClose[k] ? 'selper-hover' : ''"
                    v-for="(v, k) in seleData"
                    :key="k"
                  >
                    <i class="el-icon-close" v-show="seleShowClose[k]" @click="seleDelete(k)"></i>
                    <p class="name" @click="selperClick(k)">{{v.parentName}}：</p>
                    <p @click="selperClick(k)">{{v.name}}：{{v.content}}</p>
                  </div>
                </div>
              </el-form>
            </div>
          </div>
        </div>
      </div>
      <div class="chosebtn">
        <el-button class="banknameclearall" type="primary" @click="bnclearallClick" v-if="seleData.length > 0">清空当前已选</el-button>
        <el-button @click="choseClose">取消</el-button>
        <el-button @click="choseConfirm" type="primary">确定</el-button>
      </div>
    </div>
    <!--点击结果区时显示的弹窗-->
    <div class="pop" v-show="pops">
      <div class="popcon" >
        <el-form :model="seleForm" :rules="rules" ref="seleForm" class="clear">
          <el-form-item class="poptitle">参数设置：</el-form-item>
          <p class="t" v-show="seleForm.xsBgq">报告期</p>
          <el-form-item>
            <el-select v-model="seleForm.bgq" v-show="seleForm.xsBgq" filterable placeholder="请选择">
                <el-option
                  v-for="item in options1"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="txtper">{{seleForm.name}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;万（可直接输入数值）</el-form-item>
          <el-row>
            <el-col :span="50">
              <el-form-item>
            <el-select v-model="seleForm.dyVal" style="width:100px;float:left" filterable placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            </el-form-item>
            </el-col>
            <el-col :span="10">
              <div v-if="seleForm.dyVal=='介于'">
                <el-form-item style="float:left" prop='jieyu'>
                  <el-input v-model="seleForm.jieyu"></el-input>
                </el-form-item>
                至
                <el-form-item prop='jieyu1'>
                  <el-input v-model="seleForm.jieyu1"></el-input>
                </el-form-item>
              </div>
              <div v-else>
                <el-form-item prop='numVal'>
                  <el-input v-model="seleForm.numVal" ></el-input>
                </el-form-item>
              </div>
              
            </el-col>
          </el-row>
           
        </el-form>
        <div class="popbtn">
          <el-button size="small" @click="popsClose">取消</el-button>
          <el-button size="small" @click="popsConfirm" type="primary">确定</el-button>
        </div>
      </div>
    </div>


    <div class="pop" v-show="pop">
      <div class="popcon">
        <el-form :model="ruleForm" :rules="rules"  ref="ruleForm" v-if="label=='总股本'" class="clear">
          <el-form-item class="poptitle">参数设置：</el-form-item>
          <el-form-item class="txtper">总股本&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;万（可直接输入数值）</el-form-item>
          <el-row>
            <el-col :span="50">
              <el-form-item>
                <el-select v-model="value" style="width:100px;float:left" filterable placeholder="请选择">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="10"> -->
              <template v-if="value=='介于'">
                <el-col :span="8">
                  <el-form-item style="float:left" prop='jieyu'>
                    <el-input v-model="ruleForm.jieyu"  ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="2"><div class="divh">至</div></el-col>
                <el-col :span="8">
                  <el-form-item prop='jieyu1'>
                    <el-input v-model="ruleForm.jieyu1"  ></el-input>
                  </el-form-item>
                </el-col>
              </template>
              <template v-else>
                <el-col :span="8">
                  <el-form-item prop='zgb'>
                    <el-input v-model="ruleForm.zgb"></el-input>
                  </el-form-item>
                </el-col>
              </template>
              
            <!-- </el-col> -->
          </el-row>
        </el-form>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" v-else-if="label=='流通A股'" class="clear">
          <el-form-item class="poptitle">参数设置：</el-form-item>
          <el-form-item class="txtper">流通A股&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;万（可直接输入数值）</el-form-item>
          <el-row>
            <el-col :span="50">
              <el-form-item>
            <el-select v-model="value" style="width:100px;float:left" filterable placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
             </el-form-item>
            </el-col>
              <template v-if="value=='介于'">
                <el-col :span="8">
                  <el-form-item style="float:left" prop='jieyu'>
                    <el-input v-model="ruleForm.jieyu"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="2"><div class="divh">至</div></el-col>
                <el-col :span="8">
                  <el-form-item prop='jieyu1'>
                    <el-input v-model="ruleForm.jieyu1"></el-input>
                  </el-form-item>
                </el-col>
              </template>
              <template v-else>
                <el-col :span="8">
                  <el-form-item prop='ltab'>
                    <el-input v-model="ruleForm.ltab"></el-input>
                  </el-form-item>
                </el-col>
              </template>
          </el-row>
        </el-form>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" v-else-if="label=='流通比例'" class="clear">
          <el-form-item class="poptitle">参数设置：</el-form-item>
          <el-form-item class="txtper">流通比例&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;%（可直接输入数值）</el-form-item>
          <el-row>
            <el-col :span="50">
              <el-form-item>
                <el-select v-model="value" style="width:100px;float:left" filterable placeholder="请选择">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <template v-if="value=='介于'">
                <el-col :span="8">
                  <el-form-item style="float:left" prop='jieyu'>
                    <el-input v-model="ruleForm.jieyu"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="2"><div class="divh">至</div></el-col>
                <el-col :span="8">
                  <el-form-item prop='jieyu1'>
                    <el-input v-model="ruleForm.jieyu1"></el-input>
                  </el-form-item>
                </el-col>
              </template>
              <template v-else>
                <el-col :span="8">
                  <el-form-item prop='ltbl'>
                    <el-input v-model="ruleForm.ltbl"></el-input>
                  </el-form-item>
                </el-col>
              </template>
          </el-row>
        </el-form>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" v-else-if="label=='股东总数'" class="clear">
          <el-form-item class="poptitle">参数设置：</el-form-item>
          <p class="t">报告期</p>
          <el-form-item>
          <el-select v-model="value1" filterable placeholder="请选择">
              <el-option
                v-for="item in options1"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
          </el-select>
          </el-form-item>
          <el-form-item class="txtper">股东总数&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;万（可直接输入数值）</el-form-item>
          <el-row>
            <el-col :span="50">
              <el-form-item>
                  <el-select v-model="value" style="width:100px;float:left" filterable placeholder="请选择">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
              </el-form-item>
            </el-col>
            <template v-if="value=='介于'">
                <el-col :span="8">
                  <el-form-item style="float:left" prop='jieyu'>
                    <el-input v-model="ruleForm.jieyu"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="2"><div class="divh">至</div></el-col>
                <el-col :span="8">
                  <el-form-item prop='jieyu1'>
                    <el-input v-model="ruleForm.jieyu1"></el-input>
                  </el-form-item>
                </el-col>
              </template>
              <template v-else>
                <el-col :span="8">
                  <el-form-item prop='gdzs'>
                    <el-input v-model="ruleForm.gdzs"></el-input>
                  </el-form-item>
                </el-col>
              </template>
          </el-row>
        </el-form>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" v-else-if="label=='主营业务收入'" class="clear">
          <el-form-item class="poptitle">参数设置：</el-form-item>
          <p class="t">报告期</p>
          <el-form-item>
            <el-select v-model="value1" filterable placeholder="请选择">
                <el-option
                  v-for="item in options1"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="txtper">主营业务收入&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;万（可直接输入数值）</el-form-item>
           <el-row>
            <el-col :span="50">
              <el-form-item>
                  <el-select v-model="value" style="width:100px;float:left" filterable placeholder="请选择">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
              </el-form-item>
            </el-col>
           <template v-if="value=='介于'">
                <el-col :span="8">
                  <el-form-item style="float:left" prop='jieyu'>
                    <el-input v-model="ruleForm.jieyu"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="2"><div class="divh">至</div></el-col>
                <el-col :span="8">
                  <el-form-item prop='jieyu1'>
                    <el-input v-model="ruleForm.jieyu1"></el-input>
                  </el-form-item>
                </el-col>
              </template>
              <template v-else>
                <el-col :span="8">
                  <el-form-item prop='zyywsr'>
                    <el-input v-model="ruleForm.zyywsr"></el-input>
                  </el-form-item>
                </el-col>
              </template>
          </el-row>
        </el-form>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" v-else-if="label=='资产总计'" class="clear">
          <el-form-item class="poptitle">参数设置：</el-form-item>
          <p class="t">报告期</p>
          <el-form-item>
            <el-select v-model="value1" filterable placeholder="请选择">
                <el-option
                  v-for="item in options1"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
            </el-select>`
          </el-form-item>
          <el-form-item class="txtper">资产总计&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;万（可直接输入数值）</el-form-item>
            <el-row>
              <el-col :span="50">
                <el-form-item>
                    <el-select v-model="value" style="width:100px;float:left" filterable placeholder="请选择">
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                </el-form-item>
              </el-col>
              <template v-if="value=='介于'">
                <el-col :span="8">
                  <el-form-item style="float:left" prop='jieyu'>
                    <el-input v-model="ruleForm.jieyu"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="2"><div class="divh">至</div></el-col>
                <el-col :span="8">
                  <el-form-item prop='jieyu1'>
                    <el-input v-model="ruleForm.jieyu1"></el-input>
                  </el-form-item>
                </el-col>
              </template>
              <template v-else>
                <el-col :span="8">
                  <el-form-item prop='zczj'>
                    <el-input v-model="ruleForm.zczj"></el-input>
                  </el-form-item>
                </el-col>
              </template>
            </el-row>
        </el-form>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" v-else-if="label=='股东权益合计'" class="clear">
          <el-form-item class="poptitle">参数设置：</el-form-item>
          <p class="t">报告期</p>
          <el-form-item>
            <el-select v-model="value1" filterable placeholder="请选择">
                <el-option
                  v-for="item in options1"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="txtper">股东权益合计&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;亿元（可直接输入数值）</el-form-item>
            <el-row>
              <el-col :span="50">
                <el-form-item>
                    <el-select v-model="value" style="width:100px;float:left" filterable placeholder="请选择">
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                </el-form-item>
              </el-col>
              <template v-if="value=='介于'">
                <el-col :span="8">
                  <el-form-item style="float:left" prop='jieyu'>
                    <el-input v-model="ruleForm.jieyu"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="2"><div class="divh">至</div></el-col>
                <el-col :span="8">
                  <el-form-item prop='jieyu1'>
                    <el-input v-model="ruleForm.jieyu1"></el-input>
                  </el-form-item>
                </el-col>
              </template>
              <template v-else>
                <el-col :span="8">
                  <el-form-item prop='gdqyhj'>
                    <el-input v-model="ruleForm.gdqyhj" ></el-input>
                  </el-form-item>
                </el-col>
              </template>
            </el-row>
        </el-form>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" v-else-if="label=='每股公积金'" class="clear">
          <el-form-item class="poptitle">参数设置：</el-form-item>
          <p class="t">报告期</p>
          <el-form-item>
            <el-select v-model="value1" filterable placeholder="请选择">
                <el-option
                  v-for="item in options1"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="txtper">每股公积金&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;亿元（可直接输入数值）</el-form-item>
            <el-row>
              <el-col :span="50">
                <el-form-item>
                    <el-select v-model="value" style="width:100px;float:left" filterable placeholder="请选择">
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                </el-form-item>
              </el-col>
              <template v-if="value=='介于'">
                <el-col :span="8">
                  <el-form-item style="float:left" prop='jieyu'>
                    <el-input v-model="ruleForm.jieyu"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="2"><div class="divh">至</div></el-col>
                <el-col :span="8">
                  <el-form-item prop='jieyu1'>
                    <el-input v-model="ruleForm.jieyu1"></el-input>
                  </el-form-item>
                </el-col>
              </template>
              <template v-else>
                <el-col :span="8">
                  <el-form-item prop='mggjj'>
                    <el-input v-model="ruleForm.mggjj"></el-input>
                  </el-form-item>
                </el-col>
              </template>
            </el-row>
        </el-form>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" v-else-if="label=='投资收益'" class="clear">
          <el-form-item class="poptitle">参数设置：</el-form-item>
          <p class="t">报告期</p>
          <el-form-item>
            <el-select v-model="value1" filterable placeholder="请选择">
                <el-option
                  v-for="item in options1"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="txtper">投资收益&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;亿元（可直接输入数值）</el-form-item>
            <el-row>
              <el-col :span="50">
                <el-form-item>
                    <el-select v-model="value" style="width:100px;float:left" filterable placeholder="请选择">
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                </el-form-item>
              </el-col>
              <template v-if="value=='介于'">
                <el-col :span="8">
                  <el-form-item style="float:left" prop='jieyu'>
                    <el-input v-model="ruleForm.jieyu"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="2"><div class="divh">至</div></el-col>
                <el-col :span="8">
                  <el-form-item prop='jieyu1'>
                    <el-input v-model="ruleForm.jieyu1"></el-input>
                  </el-form-item>
                </el-col>
              </template>
              <template v-else>
                <el-col :span="8">
                  <el-form-item prop='tzsy'>
                    <el-input v-model="ruleForm.tzsy"></el-input>
                  </el-form-item>
                </el-col>
              </template>
            </el-row>
        </el-form>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" v-else-if="label=='每股净资产'" class="clear">
          <el-form-item class="poptitle">参数设置：</el-form-item>
          <p class="t">报告期</p>
          <el-form-item>
            <el-select v-model="value1" filterable placeholder="请选择">
                <el-option
                  v-for="item in options1"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="txtper">每股净资产&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;元（可直接输入数值）</el-form-item>
            <el-row>
              <el-col :span="50">
                <el-form-item>
                    <el-select v-model="value" style="width:100px;float:left" filterable placeholder="请选择">
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                </el-form-item>
              </el-col>
              <template v-if="value=='介于'">
                <el-col :span="8">
                  <el-form-item style="float:left" prop='jieyu'>
                    <el-input v-model="ruleForm.jieyu"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="2"><div class="divh">至</div></el-col>
                <el-col :span="8">
                  <el-form-item prop='jieyu1'>
                    <el-input v-model="ruleForm.jieyu1"></el-input>
                  </el-form-item>
                </el-col>
              </template>
              <template v-else>
                <el-col :span="8">
                  <el-form-item prop='mgjzc'>
                    <el-input v-model="ruleForm.mgjzc"></el-input>
                  </el-form-item>
                </el-col>
              </template>
            </el-row>
        </el-form>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" v-else-if="label=='最新价格'" class="clear">
          <el-form-item class="poptitle">参数设置：</el-form-item>
          <el-form-item class="txtper">最新价格&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;元（可直接输入数值）</el-form-item>
            <el-row>
              <el-col :span="50">
                <el-form-item>
                    <el-select v-model="value" style="width:100px;float:left" filterable placeholder="请选择">
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                </el-form-item>
              </el-col>
              <template v-if="value=='介于'">
                <el-col :span="8">
                  <el-form-item style="float:left" prop='jieyu'>
                    <el-input v-model="ruleForm.jieyu"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="2"><div class="divh">至</div></el-col>
                <el-col :span="8">
                  <el-form-item prop='jieyu1'>
                    <el-input v-model="ruleForm.jieyu1"></el-input>
                  </el-form-item>
                </el-col>
              </template>
              <template v-else>
                <el-col :span="8">
                  <el-form-item prop='zxjg'>
                    <el-input v-model="ruleForm.zxjg"></el-input>
                  </el-form-item>
                </el-col>
              </template>
            </el-row>
        </el-form>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" v-else-if="label=='每股收益'" class="clear">
          <el-form-item class="poptitle">参数设置：</el-form-item>
          <p class="t">报告期</p>
          <el-form-item>
            <el-select v-model="value1" filterable placeholder="请选择">
                <el-option
                  v-for="item in options1"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="txtper">每股收益&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;元（可直接输入数值）</el-form-item>
            <el-row>
              <el-col :span="50">
                <el-form-item>
                    <el-select v-model="value" style="width:100px;float:left" filterable placeholder="请选择">
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                </el-form-item>
              </el-col>
              <template v-if="value=='介于'">
                <el-col :span="8">
                  <el-form-item style="float:left" prop='jieyu'>
                    <el-input v-model="ruleForm.jieyu" ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="2"><div class="divh">至</div></el-col>
                <el-col :span="8">
                  <el-form-item prop='jieyu1'>
                    <el-input v-model="ruleForm.jieyu1"></el-input>
                  </el-form-item>
                </el-col>
              </template>
              <template v-else>
                <el-col :span="8">
                  <el-form-item prop='mgsy'>
                    <el-input v-model="ruleForm.mgsy"></el-input>
                  </el-form-item>
                </el-col>
              </template>
            </el-row>
        </el-form>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" v-else-if="label=='股利收益率'" class="clear">
          <el-form-item class="poptitle">参数设置：</el-form-item>
          <p class="t">报告期</p>
          <el-form-item>
            <el-select v-model="value1" filterable placeholder="请选择">
                <el-option
                  v-for="item in options1"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="txtper">股利收益率&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;%（可直接输入数值）</el-form-item>
            <el-row>
              <el-col :span="50">
                <el-form-item>
                    <el-select v-model="value" style="width:100px;float:left" filterable placeholder="请选择">
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                </el-form-item>
              </el-col>
              <template v-if="value=='介于'">
                <el-col :span="8">
                  <el-form-item style="float:left" prop='jieyu'>
                    <el-input v-model="ruleForm.jieyu"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="2"><div class="divh">至</div></el-col>
                <el-col :span="8">
                  <el-form-item prop='jieyu1'>
                    <el-input v-model="ruleForm.jieyu1"></el-input>
                  </el-form-item>
                </el-col>
              </template>
              <template v-else>
                <el-col :span="8">
                  <el-form-item prop='syl'>
                    <el-input v-model="ruleForm.syl"></el-input>
                  </el-form-item>
                </el-col>
              </template>
            </el-row>
        </el-form>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" v-else-if="label=='每股现金流'" class="clear">
          <el-form-item class="poptitle">参数设置：</el-form-item>
          <p class="t">报告期</p>
          <el-form-item>
            <el-select v-model="value1" filterable placeholder="请选择">
                <el-option
                  v-for="item in options1"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="txtper">每股现金流&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;%（可直接输入数值）</el-form-item>
            <el-row>
              <el-col :span="50">
                <el-form-item>
                    <el-select v-model="value" style="width:100px;float:left" filterable placeholder="请选择">
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                </el-form-item>
              </el-col>
              <template v-if="value=='介于'">
                <el-col :span="8">
                  <el-form-item style="float:left" prop='jieyu'>
                    <el-input v-model="ruleForm.jieyu"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="2"><div class="divh">至</div></el-col>
                <el-col :span="8">
                  <el-form-item prop='jieyu1'>
                    <el-input v-model="ruleForm.jieyu1"></el-input>
                  </el-form-item>
                </el-col>
              </template>
              <template v-else>
                <el-col :span="8">
                  <el-form-item prop='mgxjl'>
                    <el-input v-model="ruleForm.mgxjl"></el-input>
                  </el-form-item>
                </el-col>
              </template>
            </el-row>
        </el-form>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" v-else-if="label=='股价涨跌幅'" class="clear">
          <el-form-item class="poptitle">参数设置：</el-form-item>
          <el-form-item class="txtper">股价涨跌幅&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;%（可直接输入数值）</el-form-item>
            <el-row>
              <el-col :span="50">
                <el-form-item>
                    <el-select v-model="value" style="width:100px;float:left" filterable placeholder="请选择">
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                </el-form-item>
              </el-col>
              <template v-if="value=='介于'">
                <el-col :span="8">
                  <el-form-item style="float:left" prop='jieyu'>
                    <el-input v-model="ruleForm.jieyu"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="2"><div class="divh">至</div></el-col>
                <el-col :span="8">
                  <el-form-item prop='jieyu1'>
                    <el-input v-model="ruleForm.jieyu1"></el-input>
                  </el-form-item>
                </el-col>
              </template>
              <template v-else>
                <el-col :span="8">
                  <el-form-item prop='gjzdf'>
                    <el-input v-model="ruleForm.gjzdf"></el-input>
                  </el-form-item>
                </el-col>
              </template>
            </el-row>
        </el-form>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" v-else-if="label=='市盈率（动）'" class="clear">
          <el-form-item class="poptitle">参数设置：</el-form-item>
          <el-form-item class="txtper">市盈率（动）&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;（可直接输入数值）</el-form-item>
            <el-row>
              <el-col :span="50">
                <el-form-item>
                    <el-select v-model="value" style="width:100px;float:left" filterable placeholder="请选择">
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                </el-form-item>
              </el-col>
              <template v-if="value=='介于'">
                <el-col :span="8">
                  <el-form-item style="float:left" prop='jieyu'>
                    <el-input v-model="ruleForm.jieyu"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="2"><div class="divh">至</div></el-col>
                <el-col :span="8">
                  <el-form-item prop='jieyu1'>
                    <el-input v-model="ruleForm.jieyu1"></el-input>
                  </el-form-item>
                </el-col>
              </template>
              <template v-else>
                <el-col :span="8">
                  <el-form-item prop='syld'>
                    <el-input v-model="ruleForm.syld"></el-input>
                  </el-form-item>
                </el-col>
              </template>
            </el-row>
        </el-form>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" v-else-if="label=='二级行业平均市盈率'" class="clear">
          <el-form-item class="poptitle">参数设置：</el-form-item>
          <el-form-item class="txtper">二级行业平均市盈率&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;%（可直接输入数值）</el-form-item>
            <el-row>
              <el-col :span="50">
                <el-form-item>
                    <el-select v-model="value" style="width:100px;float:left" filterable placeholder="请选择">
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                </el-form-item>
              </el-col>
              <template v-if="value=='介于'">
                <el-col :span="8">
                  <el-form-item style="float:left" prop='jieyu'>
                    <el-input v-model="ruleForm.jieyu"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="2"><div class="divh">至</div></el-col>
                <el-col :span="8">
                  <el-form-item prop='jieyu1'>
                    <el-input v-model="ruleForm.jieyu1"></el-input>
                  </el-form-item>
                </el-col>
              </template>
              <template v-else>
                <el-col :span="8">
                  <el-form-item prop='ejhypjsyl'>
                    <el-input v-model="ruleForm.ejhypjsyl"></el-input>
                  </el-form-item>
                </el-col>
              </template>
            </el-row>
        </el-form>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" v-else-if="label=='成交量'" class="clear">
          <el-form-item class="poptitle">参数设置：</el-form-item>
          <el-form-item class="txtper">成交量&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;万元（可直接输入数值）</el-form-item>
            <el-row>
              <el-col :span="50">
                <el-form-item>
                    <el-select v-model="value" style="width:100px;float:left" filterable placeholder="请选择">
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                </el-form-item>
              </el-col>
              <template v-if="value=='介于'">
                <el-col :span="8">
                  <el-form-item style="float:left" prop='jieyu'>
                    <el-input v-model="ruleForm.jieyu"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="2"><div class="divh">至</div></el-col>
                <el-col :span="8">
                  <el-form-item prop='jieyu1'>
                    <el-input v-model="ruleForm.jieyu1"></el-input>
                  </el-form-item>
                </el-col>
              </template>
              <template v-else>
                <el-col :span="8">
                  <el-form-item prop='cjl'>
                    <el-input v-model="ruleForm.cjl"></el-input>
                  </el-form-item>
                </el-col>
              </template>
            </el-row>
        </el-form>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" v-else-if="label=='净利润'" class="clear">
          <el-form-item class="poptitle">参数设置：</el-form-item>
          <p class="t">报告期</p>
          <el-form-item>
            <el-select v-model="value1" filterable placeholder="请选择">
                <el-option
                  v-for="item in options1"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="txtper">净利润&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;亿元（可直接输入数值）</el-form-item>
            <el-row>
              <el-col :span="50">
                <el-form-item>
                    <el-select v-model="value" style="width:100px;float:left" filterable placeholder="请选择">
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                </el-form-item>
              </el-col>
              <template v-if="value=='介于'">
                <el-col :span="8">
                  <el-form-item style="float:left" prop='jieyu'>
                    <el-input v-model="ruleForm.jieyu"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="2"><div class="divh">至</div></el-col>
                <el-col :span="8">
                  <el-form-item prop='jieyu1'>
                    <el-input v-model="ruleForm.jieyu1"></el-input>
                  </el-form-item>
                </el-col>
              </template>
              <template v-else>
                <el-col :span="8">
                  <el-form-item prop='jlr'>
                    <el-input v-model="ruleForm.jlr"></el-input>
                  </el-form-item>
                </el-col>
              </template>
            </el-row>
        </el-form>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" v-else-if="label=='净利润率（%）'" class="clear">
          <el-form-item class="poptitle">参数设置：</el-form-item>
          <p class="t">报告期</p>
          <el-form-item>
            <el-select v-model="value1" filterable placeholder="请选择">
                <el-option
                  v-for="item in options1"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="txtper">净利润率&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;%（可直接输入数值）</el-form-item>
            <el-row>
              <el-col :span="50">
                <el-form-item>
                    <el-select v-model="value" style="width:100px;float:left" filterable placeholder="请选择">
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                </el-form-item>
              </el-col>
              <template v-if="value=='介于'">
                <el-col :span="8">
                  <el-form-item style="float:left" prop='jieyu'>
                    <el-input v-model="ruleForm.jieyu"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="2"><div class="divh">至</div></el-col>
                <el-col :span="8">
                  <el-form-item prop='jieyu1'>
                    <el-input v-model="ruleForm.jieyu1"></el-input>
                  </el-form-item>
                </el-col>
              </template>
              <template v-else>
                <el-col :span="8">
                  <el-form-item prop='jlrl'>
                    <el-input v-model="ruleForm.jlrl"></el-input>
                  </el-form-item>
                </el-col>
              </template>
            </el-row>
        </el-form>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" v-else-if="label=='最近2年净利润率'" class="clear">
          <el-form-item class="poptitle">参数设置：</el-form-item>
          <p class="t">报告期</p>
          <el-form-item>
            <el-select v-model="value2" filterable placeholder="请选择">
                <el-option
                  v-for="item in options2"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="txtper">净利润率&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;%（可直接输入数值）</el-form-item>
          <el-row>
              <el-col :span="50">
                均
                <el-form-item>
                    <el-select v-model="value" style="width:100px;float:left" filterable placeholder="请选择">
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                </el-form-item>
              </el-col>
              <template v-if="value=='介于'">
                <el-col :span="8">
                  <el-form-item style="float:left" prop='jieyu'>
                    <el-input v-model="ruleForm.jieyu"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="2"><div class="divh">至</div></el-col>
                <el-col :span="8">
                  <el-form-item prop='jieyu1'>
                    <el-input v-model="ruleForm.jieyu1"></el-input>
                  </el-form-item>
                </el-col>
              </template>
              <template v-else>
                <el-col :span="8">
                  <el-form-item prop='zxln'>
                    <el-input v-model="ruleForm.zxln"></el-input>
                  </el-form-item>
                </el-col>
              </template>
            </el-row>
        </el-form>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" v-else-if="label=='净资产收益率'" class="clear">
          <el-form-item class="poptitle">参数设置：</el-form-item>
          <p class="t">报告期</p>
          <el-form-item>
          <el-select v-model="value1" filterable placeholder="请选择">
              <el-option
                v-for="item in options1"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
          </el-select>
          </el-form-item>
          <el-form-item class="txtper">净资产收益率&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;%（可直接输入数值）</el-form-item>
            <el-row>
              <el-col :span="50">
                <el-form-item>
                    <el-select v-model="value" style="width:100px;float:left" filterable placeholder="请选择">
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                </el-form-item>
              </el-col>
              <template v-if="value=='介于'">
                <el-col :span="8">
                  <el-form-item style="float:left" prop='jieyu'>
                    <el-input v-model="ruleForm.jieyu"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="2"><div class="divh">至</div></el-col>
                <el-col :span="8">
                  <el-form-item prop='jieyu1'>
                    <el-input v-model="ruleForm.jieyu1"></el-input>
                  </el-form-item>
                </el-col>
              </template>
              <template v-else>
                <el-col :span="8">
                  <el-form-item prop='jzcsyl'>
                    <el-input v-model="ruleForm.jzcsyl"></el-input>
                  </el-form-item>
                </el-col>
              </template>
            </el-row>
        </el-form>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" v-else-if="label=='过去2年净资产收益率'" class="clear">
          <el-form-item class="poptitle">参数设置：</el-form-item>
          <p class="t">报告期</p>
          <el-form-item>
            <el-select v-model="value2" filterable placeholder="请选择">
                <el-option
                  v-for="item in options2"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="txtper">净资产收益率&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;%（可直接输入数值）</el-form-item>
            <el-row>
              <el-col :span="50">
                均
                <el-form-item>
                    <el-select v-model="value" style="width:100px;float:left" filterable placeholder="请选择">
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                </el-form-item>
              </el-col>
              <template v-if="value=='介于'">
                <el-col :span="8">
                  <el-form-item style="float:left" prop='jieyu'>
                    <el-input v-model="ruleForm.jieyu"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="2"><div class="divh">至</div></el-col>
                <el-col :span="8">
                  <el-form-item prop='jieyu1'>
                    <el-input v-model="ruleForm.jieyu1"></el-input>
                  </el-form-item>
                </el-col>
              </template>
              <template v-else>
                <el-col :span="8">
                  <el-form-item prop='gqjzcsyl'>
                    <el-input v-model="ruleForm.gqjzcsyl"></el-input>
                  </el-form-item>
                </el-col>
              </template>
            </el-row>
        </el-form>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" v-else-if="label=='主营业务利润'" class="clear">
          <el-form-item class="poptitle">参数设置：</el-form-item>
          <p class="t">报告期</p>
          <el-form-item>
            <el-select v-model="value1" filterable placeholder="请选择">
                <el-option
                  v-for="item in options1"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="txtper">主营业务利润&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;亿元（可直接输入数值）</el-form-item>
            <el-row>
              <el-col :span="50">
                <el-form-item>
                    <el-select v-model="value" style="width:100px;float:left" filterable placeholder="请选择">
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                </el-form-item>
              </el-col>
              <template v-if="value=='介于'">
                <el-col :span="8">
                  <el-form-item style="float:left" prop='jieyu'>
                    <el-input v-model="ruleForm.jieyu"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="2"><div class="divh">至</div></el-col>
                <el-col :span="8">
                  <el-form-item prop='jieyu1'>
                    <el-input v-model="ruleForm.jieyu1"></el-input>
                  </el-form-item>
                </el-col>
              </template>
              <template v-else>
                <el-col :span="8">
                  <el-form-item prop='zyywlr'>
                    <el-input v-model="ruleForm.zyywlr"></el-input>
                  </el-form-item>
                </el-col>
              </template>
            </el-row>
        </el-form>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" v-else-if="label=='净收益增长率'" class="clear">
          <el-form-item class="poptitle">参数设置：</el-form-item>
          <p class="t">报告期</p>
          <el-form-item>
            <el-select v-model="value1" filterable placeholder="请选择">
                <el-option
                  v-for="item in options1"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="txtper">净收益增长率&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;%（可直接输入数值）</el-form-item>
             <el-row>
              <el-col :span="50">
                <el-form-item>
                    <el-select v-model="value" style="width:100px;float:left" filterable placeholder="请选择">
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                </el-form-item>
              </el-col>
              <template v-if="value=='介于'">
                <el-col :span="8">
                  <el-form-item style="float:left" prop='jieyu'>
                    <el-input v-model="ruleForm.jieyu"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="2"><div class="divh">至</div></el-col>
                <el-col :span="8">
                  <el-form-item prop='jieyu1'>
                    <el-input v-model="ruleForm.jieyu1"></el-input>
                  </el-form-item>
                </el-col>
              </template>
              <template v-else>
                <el-col :span="8">
                  <el-form-item prop='jsyzzl'>
                    <el-input v-model="ruleForm.jsyzzl"></el-input>
                  </el-form-item>
                </el-col>
              </template>
            </el-row>
        </el-form>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" v-else-if="label=='连续2年净收益增长率'" class="clear">
          <el-form-item class="poptitle">参数设置：</el-form-item>
          <p class="t">报告期</p>
          <el-form-item>
            <el-select v-model="value2" filterable placeholder="请选择">
                <el-option
                  v-for="item in options2"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="txtper">净资产收益率&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;%（可直接输入数值）</el-form-item>
            <el-row>
              <el-col :span="50">
                均
                <el-form-item>
                    <el-select v-model="value" style="width:100px;float:left" filterable placeholder="请选择">
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                </el-form-item>
              </el-col>
              <template v-if="value=='介于'">
                <el-col :span="8">
                  <el-form-item style="float:left" prop='jieyu'>
                    <el-input v-model="ruleForm.jieyu"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="2"><div class="divh">至</div></el-col>
                <el-col :span="8">
                  <el-form-item prop='jieyu1'>
                    <el-input v-model="ruleForm.jieyu1"></el-input>
                  </el-form-item>
                </el-col>
              </template>
              <template v-else>
                <el-col :span="8">
                  <el-form-item prop='mgsy'>
                    <el-input v-model="ruleForm.lxjsy"></el-input>
                  </el-form-item>
                </el-col>
              </template>
            </el-row>
        </el-form>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" v-else-if="label=='营业收入增长率'" class="clear">
          <el-form-item class="poptitle">参数设置：</el-form-item>
          <p class="t">报告期</p>
          <el-form-item>
            <el-select v-model="value1" filterable placeholder="请选择">
                <el-option
                  v-for="item in options1"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="txtper">营业收入增长率&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;%（可直接输入数值）</el-form-item>
            <el-row>
              <el-col :span="50">
                <el-form-item>
                    <el-select v-model="value" style="width:100px;float:left" filterable placeholder="请选择">
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                </el-form-item>
              </el-col>
              <template v-if="value=='介于'">
                <el-col :span="8">
                  <el-form-item style="float:left" prop='jieyu'>
                    <el-input v-model="ruleForm.jieyu"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="2"><div class="divh">至</div></el-col>
                <el-col :span="8">
                  <el-form-item prop='jieyu1'>
                    <el-input v-model="ruleForm.jieyu1"></el-input>
                  </el-form-item>
                </el-col>
              </template>
              <template v-else>
                <el-col :span="8">
                  <el-form-item prop='yysrzzl'>
                    <el-input v-model="ruleForm.yysrzzl"></el-input>
                  </el-form-item>
                </el-col>
              </template>
            </el-row>
        </el-form>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" v-else-if="label=='连续2年营业收入增长率'" class="clear">
          <el-form-item class="poptitle">参数设置：</el-form-item>
          <p class="t">报告期</p>
          <el-form-item>
            <el-select v-model="value2" filterable placeholder="请选择">
                <el-option
                  v-for="item in options2"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="txtper">营业收入增长率&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;%（可直接输入数值）</el-form-item>
            <el-row>
              <el-col :span="50">
                均
                <el-form-item>
                    <el-select v-model="value" style="width:100px;float:left" filterable placeholder="请选择">
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                </el-form-item>
              </el-col>
              <template v-if="value=='介于'">
                <el-col :span="8">
                  <el-form-item style="float:left" prop='jieyu'>
                    <el-input v-model="ruleForm.jieyu"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="2"><div class="divh">至</div></el-col>
                <el-col :span="8">
                  <el-form-item prop='jieyu1'>
                    <el-input v-model="ruleForm.jieyu1"></el-input>
                  </el-form-item>
                </el-col>
              </template>
              <template v-else>
                <el-col :span="8">
                  <el-form-item prop='lxyysrzzl'>
                    <el-input v-model="ruleForm.lxyysrzzl"></el-input>
                  </el-form-item>
                </el-col>
              </template>
            </el-row>
        </el-form>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" v-else-if="label=='三年营业收入复合增速'" class="clear">
          <el-form-item class="poptitle">参数设置：</el-form-item>
          <p class="t">报告期</p>
          <el-form-item>
            <el-select v-model="value1" filterable placeholder="请选择">
                <el-option
                  v-for="item in options1"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="txtper">三年营业收入复合增速&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;%（可直接输入数值）</el-form-item>
            <el-row>
              <el-col :span="50">
                <el-form-item>
                    <el-select v-model="value" style="width:100px;float:left" filterable placeholder="请选择">
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                </el-form-item>
              </el-col>
              <template v-if="value=='介于'">
                <el-col :span="8">
                  <el-form-item style="float:left" prop='jieyu'>
                    <el-input v-model="ruleForm.jieyu"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="2"><div class="divh">至</div></el-col>
                <el-col :span="8">
                  <el-form-item prop='jieyu1'>
                    <el-input v-model="ruleForm.jieyu1"></el-input>
                  </el-form-item>
                </el-col>
              </template>
              <template v-else>
                <el-col :span="8">
                  <el-form-item prop='snyysrfhzs'>
                    <el-input v-model="ruleForm.snyysrfhzs"></el-input>
                  </el-form-item>
                </el-col>
              </template>
            </el-row>
        </el-form>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" v-else-if="label=='加权净资产收益率'" class="clear">
          <el-form-item class="poptitle">参数设置：</el-form-item>
          <p class="t">报告期</p>
          <el-form-item>
            <el-select v-model="value1" filterable placeholder="请选择">
                <el-option
                  v-for="item in options1"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="txtper">加权净资产收益率&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;%（可直接输入数值）</el-form-item>
            <el-row>
                <el-col :span="50">
                  <el-form-item>
                      <el-select v-model="value" style="width:100px;float:left" filterable placeholder="请选择">
                        <el-option
                          v-for="item in options"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                  </el-form-item>
                </el-col>
                <template v-if="value=='介于'">
                <el-col :span="8">
                  <el-form-item style="float:left" prop='jieyu'>
                    <el-input v-model="ruleForm.jieyu"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="2"><div class="divh">至</div></el-col>
                <el-col :span="8">
                  <el-form-item prop='jieyu1'>
                    <el-input v-model="ruleForm.jieyu1"></el-input>
                  </el-form-item>
                </el-col>
              </template>
              <template v-else>
                <el-col :span="8">
                  <el-form-item prop='jqjzcsyl'>
                    <el-input v-model="ruleForm.jqjzcsyl"></el-input>
                  </el-form-item>
                </el-col>
              </template>
              </el-row>
        </el-form>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" v-else-if="label=='三年归母净利润复合增速'" class="clear">
          <el-form-item class="poptitle">参数设置：</el-form-item>
          <p class="t">报告期</p>
          <el-form-item>
            <el-select v-model="value1" filterable placeholder="请选择">
                <el-option
                  v-for="item in options1"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="txtper">三年归母净利润复合增速&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;%（可直接输入数值）</el-form-item>
            <el-row>
                <el-col :span="50">
                  <el-form-item>
                      <el-select v-model="value" style="width:100px;float:left" filterable placeholder="请选择">
                        <el-option
                          v-for="item in options"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                  </el-form-item>
                </el-col>
                <template v-if="value=='介于'">
                <el-col :span="8">
                  <el-form-item style="float:left" prop='jieyu'>
                    <el-input v-model="ruleForm.jieyu"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="2"><div class="divh">至</div></el-col>
                <el-col :span="8">
                  <el-form-item prop='jieyu1'>
                    <el-input v-model="ruleForm.jieyu1"></el-input>
                  </el-form-item>
                </el-col>
              </template>
              <template v-else>
                <el-col :span="8">
                  <el-form-item prop='sngmjlr'>
                    <el-input v-model="ruleForm.sngmjlr"></el-input>
                  </el-form-item>
                </el-col>
              </template>
              </el-row>
        </el-form>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" v-else-if="label=='市净率'" class="clear">
          <el-form-item class="poptitle">参数设置：</el-form-item>
          <el-form-item class="txtper">市净率&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;（可直接输入数值）</el-form-item>
            <el-row>
              <el-col :span="50">
                <el-form-item>
                    <el-select v-model="value" style="width:100px;float:left" filterable placeholder="请选择">
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                </el-form-item>
              </el-col>
              <template v-if="value=='介于'">
                <el-col :span="8">
                  <el-form-item style="float:left" prop='jieyu'>
                    <el-input v-model="ruleForm.jieyu"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="2"><div class="divh">至</div></el-col>
                <el-col :span="8">
                  <el-form-item prop='jieyu1'>
                    <el-input v-model="ruleForm.jieyu1"></el-input>
                  </el-form-item>
                </el-col>
              </template>
              <template v-else>
                <el-col :span="8">
                  <el-form-item prop='sjl'>
                    <el-input v-model="ruleForm.sjl"></el-input>
                  </el-form-item>
                </el-col>
              </template>
            </el-row>
        </el-form>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" v-else-if="label=='总市值'" class="clear">
          <el-form-item class="poptitle">参数设置：</el-form-item>
          <el-form-item class="txtper">总市值&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;%（可直接输入数值）</el-form-item>
            <el-row>
              <el-col :span="50">
                <el-form-item>
                    <el-select v-model="value" style="width:100px;float:left" filterable placeholder="请选择">
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                </el-form-item>
              </el-col>
              <template v-if="value=='介于'">
                <el-col :span="8">
                  <el-form-item style="float:left" prop='jieyu'>
                    <el-input v-model="ruleForm.jieyu"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="2"><div class="divh">至</div></el-col>
                <el-col :span="8">
                  <el-form-item prop='jieyu1'>
                    <el-input v-model="ruleForm.jieyu1"></el-input>
                  </el-form-item>
                </el-col>
              </template>
              <template v-else>
                <el-col :span="8">
                  <el-form-item prop='zsz'>
                    <el-input v-model="ruleForm.zsz"></el-input>
                  </el-form-item>
                </el-col>
              </template>
            </el-row>
        </el-form>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" v-else-if="label=='流通市值'" class="clear">
          <el-form-item class="poptitle">参数设置：</el-form-item>
          <el-form-item class="txtper">流通市值&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;%（可直接输入数值）</el-form-item>
          <el-row>
              <el-col :span="50">
                <el-form-item>
                    <el-select v-model="value" style="width:100px;float:left" filterable placeholder="请选择">
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                </el-form-item>
              </el-col>
              <template v-if="value=='介于'">
                <el-col :span="8">
                  <el-form-item style="float:left" prop='jieyu'>
                    <el-input v-model="ruleForm.jieyu"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="2"><div class="divh">至</div></el-col>
                <el-col :span="8">
                  <el-form-item prop='jieyu1'>
                    <el-input v-model="ruleForm.jieyu1"></el-input>
                  </el-form-item>
                </el-col>
              </template>
              <template v-else>
                <el-col :span="8">
                  <el-form-item prop='ltsz'>
                    <el-input v-model="ruleForm.ltsz"></el-input>
                  </el-form-item>
                </el-col>
              </template>
            </el-row>
        </el-form>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" v-else-if="label=='每股净资产'" class="clear">
          <el-form-item class="poptitle">参数设置：</el-form-item>
          <p class="t">报告期</p>
          <el-form-item>
            <el-select v-model="value1" filterable placeholder="请选择">
                <el-option
                  v-for="item in options1"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="txtper">每股净资产&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;元（可直接输入数值）</el-form-item>
            <el-row>
                <el-col :span="50">
                  <el-form-item>
                      <el-select v-model="value" style="width:100px;float:left" filterable placeholder="请选择">
                        <el-option
                          v-for="item in options"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                  </el-form-item>
                </el-col>
                <template v-if="value=='介于'">
                <el-col :span="8">
                  <el-form-item style="float:left" prop='jieyu'>
                    <el-input v-model="ruleForm.jieyu"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="2"><div class="divh">至</div></el-col>
                <el-col :span="8">
                  <el-form-item prop='jieyu1'>
                    <el-input v-model="ruleForm.jieyu1"></el-input>
                  </el-form-item>
                </el-col>
              </template>
              <template v-else>
                <el-col :span="8">
                  <el-form-item prop='mgjzc'>
                    <el-input v-model="ruleForm.mgjzc"></el-input>
                  </el-form-item>
                </el-col>
              </template>
              </el-row>
        </el-form>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" v-else-if="label=='流动比率'" class="clear">
          <el-form-item class="poptitle">参数设置：</el-form-item>
          <p class="t">报告期</p>
          <el-form-item>
            <el-select v-model="value1" filterable placeholder="请选择">
                <el-option
                  v-for="item in options1"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="txtper">流动比率&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;%（可直接输入数值）</el-form-item>
            <el-row>
                <el-col :span="50">
                  <el-form-item>
                      <el-select v-model="value" style="width:100px;float:left" filterable placeholder="请选择">
                        <el-option
                          v-for="item in options"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                  </el-form-item>
                </el-col>
                <template v-if="value=='介于'">
                <el-col :span="8">
                  <el-form-item style="float:left" prop='jieyu'>
                    <el-input v-model="ruleForm.jieyu"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="2"><div class="divh">至</div></el-col>
                <el-col :span="8">
                  <el-form-item prop='jieyu1'>
                    <el-input v-model="ruleForm.jieyu1" ></el-input>
                  </el-form-item>
                </el-col>
              </template>
              <template v-else>
                <el-col :span="8">
                  <el-form-item prop='ldbl'>
                    <el-input v-model="ruleForm.ldbl"></el-input>
                  </el-form-item>
                </el-col>
              </template>
              </el-row>
        </el-form>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" v-else-if="label=='资产负债比率'" class="clear">
          <el-form-item class="poptitle">参数设置：</el-form-item>
          <p class="t">报告期</p>
          <el-form-item>
            <el-select v-model="value1"  filterable placeholder="请选择">
                <el-option
                  v-for="item in options1"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="txtper">资产负债比率&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;%（可直接输入数值）</el-form-item>
            <el-row>
                <el-col :span="50">
                  <el-form-item>
                      <el-select v-model="value" style="width:100px;float:left" filterable placeholder="请选择">
                        <el-option
                          v-for="item in options"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                  </el-form-item>
                </el-col>
                <template v-if="value=='介于'">
                <el-col :span="8">
                  <el-form-item style="float:left" prop='jieyu'>
                    <el-input v-model="ruleForm.jieyu" ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="2"><div class="divh">至</div></el-col>
                <el-col :span="8">
                  <el-form-item prop='jieyu1'>
                    <el-input v-model="ruleForm.jieyu1" ></el-input>
                  </el-form-item>
                </el-col>
              </template>
              <template v-else>
                <el-col :span="8">
                  <el-form-item prop='zcfzbl'>
                    <el-input v-model="ruleForm.zcfzbl"></el-input>
                  </el-form-item>
                </el-col>
              </template>
              </el-row>
        </el-form>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" v-else-if="label=='应收账款周转率'" class="clear">
          <el-form-item class="poptitle">参数设置：</el-form-item>
          <p class="t">报告期</p>
          <el-form-item>
            <el-select v-model="value1"  filterable placeholder="请选择">
                <el-option
                  v-for="item in options1"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="txtper">应收账款周转率&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;次（可直接输入数值）</el-form-item>
            <el-row>
                <el-col :span="50">
                  <el-form-item>
                      <el-select v-model="value" style="width:100px;float:left" filterable placeholder="请选择">
                        <el-option
                          v-for="item in options"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                  </el-form-item>
                </el-col>
                <template v-if="value=='介于'">
                <el-col :span="8">
                  <el-form-item style="float:left" prop='jieyu'>
                    <el-input v-model="ruleForm.jieyu" ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="2"><div class="divh">至</div></el-col>
                <el-col :span="8">
                  <el-form-item prop='jieyu1'>
                    <el-input v-model="ruleForm.jieyu1" ></el-input>
                  </el-form-item>
                </el-col>
              </template>
              <template v-else>
                <el-col :span="8">
                  <el-form-item prop='yszkzzl'>
                    <el-input v-model="ruleForm.yszkzzl" ></el-input>
                  </el-form-item>
                </el-col>
              </template>
              </el-row>
        </el-form>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" v-else-if="label=='存货周转次数'" class="clear">
          <el-form-item class="poptitle">参数设置：</el-form-item>
          <p class="t">报告期</p>
          <el-form-item>
            <el-select v-model="value1" filterable placeholder="请选择">
                <el-option
                  v-for="item in options1"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="txtper">存货周转次数&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;次（可直接输入数值）</el-form-item>
            <el-row>
                <el-col :span="50">
                  <el-form-item>
                      <el-select v-model="value" style="width:100px;float:left" filterable placeholder="请选择">
                        <el-option
                          v-for="item in options"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                  </el-form-item>
                </el-col>
                <template v-if="value=='介于'">
                <el-col :span="8">
                  <el-form-item style="float:left" prop='jieyu'>
                    <el-input v-model="ruleForm.jieyu" ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="2"><div class="divh">至</div></el-col>
                <el-col :span="8">
                  <el-form-item prop='jieyu1'>
                    <el-input v-model="ruleForm.jieyu1"></el-input>
                  </el-form-item>
                </el-col>
              </template>
              <template v-else>
                <el-col :span="8">
                  <el-form-item prop='chzzcs'>
                    <el-input v-model="ruleForm.chzzcs" ></el-input>
                  </el-form-item>
                </el-col>
              </template>
              </el-row>
        </el-form>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" v-else-if="label=='流动资产周转率'" class="clear">
          <el-form-item class="poptitle">参数设置：</el-form-item>
          <p class="t">报告期</p>
          <el-form-item>
            <el-select v-model="value1"  filterable placeholder="请选择">
                <el-option
                  v-for="item in options1"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="txtper">流动资产周转率&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;次（可直接输入数值）</el-form-item>
            <el-row>
                <el-col :span="50">
                  <el-form-item>
                      <el-select v-model="value" style="width:100px;float:left" filterable placeholder="请选择">
                        <el-option
                          v-for="item in options"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                  </el-form-item>
                </el-col>
                <template v-if="value=='介于'">
                <el-col :span="8">
                  <el-form-item style="float:left" prop='jieyu'>
                    <el-input v-model="ruleForm.jieyu"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="2"><div class="divh">至</div></el-col>
                <el-col :span="8">
                  <el-form-item prop='jieyu1'>
                    <el-input v-model="ruleForm.jieyu1"></el-input>
                  </el-form-item>
                </el-col>
              </template>
              <template v-else>
                <el-col :span="8">
                  <el-form-item prop='ldzczzl'>
                    <el-input v-model="ruleForm.ldzczzl"></el-input>
                  </el-form-item>
                </el-col>
              </template>
              </el-row>
        </el-form>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" v-else="label=='总资产周转率'" class="clear">
          <el-form-item class="poptitle">参数设置：</el-form-item>
          <p class="t">报告期</p>
          <el-form-item>
            <el-select v-model="value1" filterable placeholder="请选择">
                <el-option
                  v-for="item in options1"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="txtper">总资产周转率&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;次（可直接输入数值）</el-form-item>
            <el-row>
                <el-col :span="50">
                  <el-form-item>
                      <el-select v-model="value" style="width:100px;float:left" filterable placeholder="请选择">
                        <el-option
                          v-for="item in options"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                  </el-form-item>
                </el-col>
                <template v-if="value=='介于'">
                <el-col :span="8">
                  <el-form-item style="float:left" prop='jieyu'>
                    <el-input v-model="ruleForm.jieyu"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="2"><div class="divh">至</div></el-col>
                <el-col :span="8">
                  <el-form-item prop='jieyu1'>
                    <el-input v-model="ruleForm.jieyu1"></el-input>
                  </el-form-item>
                </el-col>
              </template>
              <template v-else>
                <el-col :span="8">
                  <el-form-item prop='zzczzl'>
                    <el-input v-model="ruleForm.zzczzl" ></el-input>
                  </el-form-item>
                </el-col>
              </template>
              </el-row>
        </el-form>
        <div class="popbtn">
          <el-button size="small" @click="popClose">取消</el-button>
          <el-button size="small" @click="popConfirm" type="primary">确定</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import api from "../../api/api.js";
  export default {
    data() {
      //保留四位小数
      var checkNum = (rule, value, callback) => {
        // var reg = /^(([^0][0-9]+|0)\.([0-9]{1,4})$)|^([^0][0-9]+|0)$/;
        var reg = /^(([1-9][0-9]*)|(([0]\.\d{1,4}|[1-9][0-9]*\.\d{1,4})))$/;
        if (reg.test(value) === false) {
          callback(new Error("输入数字可具体到小数点后四位"));
        }
        callback();
      };
      //保留两位小数
      var checkNumTWO = (rule, value, callback) => {
        var reg = /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/;
        if (reg.test(value) === false) {
          callback(new Error("输入数字可具体到小数点后两位"));
        }
        callback();
      };
      return {
        ruleForm:{
          zgb:'10000',
          jieyu:'50.00',
          jieyu1:'50.00',
          ltab:'10000',
          ltbl:'50.00',
          gdzs:'10.00',
          zyywsr:'10000',
          zczj:'10000',
          gdqyhj:'10',
          mggjj:'10',
          tzsy:'10',
          mgjzc:'10',
          zxjg:'10',
          mgsy:'10',
          syl:'0.05',
          mgxjl:'5',
          gjzdf:'10',
          syld:'0.1',    
          ejhypjsyl:'10',
          cjl:'10',
          jlr:'100',
          jlrl:'50',
          zxln:'50',
          jzcsyl:'50',
          gqjzcsyl:'50',
          zyywlr:'5',
          jsyzzl:'50',
          lxjsy:'50',
          yysrzzl:'50',
          lxyysrzzl:'50',
          snyysrfhzs:'50',
          jqjzcsyl:'50',
          sngmjlr:'50',
          sjl:'0.1',
          zsz:'10',
          ltsz:'10',
          mgjzc1:'10',
          ldbl:'10',
          zcfzbl:'100',
          yszkzzl:'100',
          chzzcs:'10',
          ldzczzl:'5',
          zzczzl:'5'
        },
        seleForm:{
          numVal:'',
          jieyu:'50.00',
          jieyu1:'50.00'
        },
        seleIndex: '',
        radio:'0',
        radio1:'1',
        pop: false, //二级弹窗,
        pops:false,//点击结果区显示的弹窗
        // xsBgq:false,//点击结果区时报告期是否显示
        label:'',//选择的菜单
        parent:'',//选择节点的父节点
        currentData: {
          option1: '',
          option2: ''
        }, //pop里的数据
        dyVal:'',
        bgq:'',
        numVal:'',
        // zgb:'10000',
        
        
        moudle_flag:'',
        isLabel:'',
        options: [{
            value: '大于',
            label: '大于'
          }, {
            value: '小于',
            label: '小于'
          }, {
            value: '等于',
            label: '等于'
          }, {
            value: '介于',
            label: '介于'
          }],
        value:'大于',
        value1:'最新一期',
        value2:'最新两年',
        options1:[
          {
            value: '选项1',
            label: '最新一期'
          }
        ],
        options2:[
          {
            value: '选项1',
            label: '最新两年'
          }
        ],
        seleData: [], //已选择数据列表
        choseform: {
          option1: '',
          option2: '',
        },
        seleShowClose: [
          false, false
        ],
        treedata: [
          {
            label: '常用条件',
            children: [
                {label: '总股本',pop: true},
                {label: '流通A股',pop: true},
                {label: '流通比例',pop: true},
                {label: '股东总数',pop: true},
                {label: '主营业务收入',pop: true},
                {label: '资产总计',pop: true},
                {label: '股东权益合计',pop: true},
                {label: '每股公积金',pop: true},
                {label: '投资收益',pop: true},
                {label: '每股净资产',pop: true}
            ],
            // children: []
          },
          {
            label: '价格',
            children: [
                {label: '最新价格',pop: true}, 
                {label: '每股收益',pop: true},
                {label: '股利收益率',pop: true},
                {label: '每股现金流',pop: true},
                {label: '股价涨跌幅',pop: true},
                {label: '市盈率（动）',pop: true},
                {label: '二级行业平均市盈率',pop: true},
            ]
          },
          {
            label: '股票指标',
            children: [
                {label: '成交量',pop: true}
            ]
          },
          {
            label: '利润率',
            children: [
                {label: '净利润',pop: true}, 
                {label: '净利润率（%）',pop: true},
                {label: '最近2年净利润率',pop: true},
                {label: '净资产收益率',pop: true},
                {label: '过去2年净资产收益率',pop: true},
                {label: '主营业务利润',pop: true}
            ]
          },
          {
            label: '增长',
            children: [
                {label: '净收益增长率',pop: true}, 
                {label: '连续2年净收益增长率',pop: true},
                {label: '营业收入增长率',pop: true},
                {label: '连续2年营业收入增长率',pop: true},
                {label: '三年营业收入复合增速',pop: true},
                {label: '加权净资产收益率',pop: true},
                {label: '三年归母净利润复合增速',pop: true}
            ]
          },
          {
            label: '估价',
            children: [
                {label: '市净率',pop: true}, 
                {label: '总市值',pop: true},
                {label: '流通市值',pop: true}
            ]
          },
          {
            label: '财务比率',
            children: [
                {label: '每股净资产',pop: true}, 
                {label: '流动比率',pop: true},
                {label: '资产负债比率',pop: true},
                {label: '应收账款周转率',pop: true},
                {label: '存货周转次数',pop: true},
                {label: '流动资产周转率',pop: true},
                {label: '总资产周转率',pop: true}
            ]
          }
        ],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        rules:{
          zgb: [
            { type: "int", validator: checkNum, trigger: "blur" }
          ],
          ltab: [
            { type: "int", validator: checkNum, trigger: "blur" }
          ],
          jieyu:[
            { type: "int", validator: checkNum, trigger: "blur" }
          ],
          jieyu1:[
            { type: "int", validator: checkNum, trigger: "blur" }
          ],
          ltbl:[
            { type: "int", validator: checkNumTWO, trigger: "blur" }
          ],
          gdzs:[
            { type: "int", validator: checkNum, trigger: "blur" }
          ],
          zyywsr:[
            { type: "int", validator: checkNum, trigger: "blur" }
          ],
          zczj:[
            { type: "int", validator: checkNum, trigger: "blur" }
          ],
          gdqyhj:[
            { type: "int", validator: checkNum, trigger: "blur" }
          ],
          mggjj:[
            { type: "int", validator: checkNum, trigger: "blur" }
          ],
          tzsy:[
            { type: "int", validator: checkNum, trigger: "blur" }
          ],
          mgjzc:[
            { type: "int", validator: checkNumTWO, trigger: "blur" }
          ],
          zxjg:[
            { type: "int", validator: checkNumTWO, trigger: "blur" }
          ],
          mgsy:[
            { type: "int", validator: checkNumTWO, trigger: "blur" }
          ],
          syl:[
            { type: "int", validator: checkNumTWO, trigger: "blur" }
          ],
          mgxjl:[
            { type: "int", validator: checkNumTWO, trigger: "blur" }
          ],
          gjzdf:[
            { type: "int", validator: checkNumTWO, trigger: "blur" }
          ],
          syld:[
            { type: "int", validator: checkNumTWO, trigger: "blur" }
          ],
          ejhypjsyl:[
            { type: "int", validator: checkNumTWO, trigger: "blur" }
          ],
          cjl:[
            { type: "int", validator: checkNum, trigger: "blur" }
          ],
          jlr:[
            { type: "int", validator: checkNum, trigger: "blur" }
          ],
          jlrl:[
            { type: "int", validator: checkNumTWO, trigger: "blur" }
          ],
          zxln:[
            { type: "int", validator: checkNumTWO, trigger: "blur" }
          ],
          jzcsyl:[
            { type: "int", validator: checkNumTWO, trigger: "blur" }
          ],
          gqjzcsyl:[
            { type: "int", validator: checkNumTWO, trigger: "blur" }
          ],
          zyywlr:[
            { type: "int", validator: checkNum, trigger: "blur" }
          ],
          jsyzzl:[
            { type: "int", validator: checkNumTWO, trigger: "blur" }
          ],
          lxjsy:[
            { type: "int", validator: checkNumTWO, trigger: "blur" }
          ],
          yysrzzl:[
            { type: "int", validator: checkNumTWO, trigger: "blur" }
          ],
          lxyysrzzl:[
            { type: "int", validator: checkNumTWO, trigger: "blur" }
          ],
          snyysrfhzs:[
            { type: "int", validator: checkNumTWO, trigger: "blur" }
          ],
          jqjzcsyl:[
            { type: "int", validator: checkNumTWO, trigger: "blur" }
          ],
          sngmjlr:[
            { type: "int", validator: checkNumTWO, trigger: "blur" }
          ],
          sjl:[
            { type: "int", validator: checkNumTWO, trigger: "blur" }
          ],
          zsz:[
            { type: "int", validator: checkNum, trigger: "blur" }
          ],
          ltsz:[
            { type: "int", validator: checkNum, trigger: "blur" }
          ],
          mgjzc1:[
            { type: "int", validator: checkNumTWO, trigger: "blur" }
          ],
          ldbl:[
            { type: "int", validator: checkNumTWO, trigger: "blur" }
          ],
          zcfzbl:[
            { type: "int", validator: checkNumTWO, trigger: "blur" }
          ],
          yszkzzl:[
            { type: "int", validator: checkNumTWO, trigger: "blur" }
          ],
          chzzcs:[
            { type: "int", validator: checkNumTWO, trigger: "blur" }
          ],
          ldzczzl:[
            { type: "int", validator: checkNumTWO, trigger: "blur" }
          ],
          zzczzl:[
            { type: "int", validator: checkNumTWO, trigger: "blur" }
          ],
          numVal:[
            { type: "int", validator: checkNum, trigger: "blur" }
          ]
        }
      }
    },
    mounted() {
    },
    methods: {
      checkKeydown(e, value){
        this.ltab = value;
        },
      handleNodeClick(data) {
        console.log(data);
      },
      // 选中列表hover
      selperMouseenter(n) {
        this.seleShowClose[n] = true;
        this.$set(this.seleShowClose, n, true)
      },
      selperMouseleave(n) {
        this.seleShowClose[n] = false;
        this.$set(this.seleShowClose, n, false)
      },
      selperClick(v) {
        this.seleForm = this.seleData[v]
        this.seleIndex = v;
        this.pops = true;
      },
      //一级弹窗关闭
      choseClose() {
        // this.$parent.fatherMethod();
        // this.$router.push({path:'/cy4Strategy'})
        this.$router.go(-1)
      },
      //一级弹窗确定
      choseConfirm() {
        // sessionStorage.setItem('seleData', JSON.stringify(this.seleData));
        let arr = [];
        this.isLabel = this.$route.query.isLable
        var pathName = this.$router.currentRoute.path;
        if(pathName=='/rdztybcl/jibenmianxuangu'){
          this.moudle_flag='1'
        }else if(pathName=='/rdztgcz/jibenmianxuangu'){
          this.moudle_flag='2'
        }else if(pathName=='/rdztgcz/jibenmianxuangu1'){
          this.moudle_flag='3'
        }else if(pathName=='/rdztgcz/jibenmianxuangu2'){
          this.moudle_flag='4'
        }else if(pathName=='/rdztgcz/jibenmianxuangu3'){
          this.moudle_flag='5'
        }else if(pathName=='/rdztgcz/jibenmianxuangu4'){
          this.moudle_flag='6'
        }else if(pathName=='/rdztgcz/jibenmianxuangu5'){
          this.moudle_flag='7'
        }else if(pathName=='/rdztgcz/jibenmianxuangu6'){
          this.moudle_flag='8'
        }else if(pathName=='/rdztgcz/jibenmianxuangu7'){
          this.moudle_flag='9'
        }else if(pathName=='/clsz/RDjibenmianxuangu'){
          if(this.isLabel=='热点之一飞冲天'){
            this.moudle_flag='10'
          }else if(this.isLabel=='热点之步步为赢'){
            this.moudle_flag='11'
          }else{
            this.moudle_flag='12'
          }
        }else if(pathName=='/clsz/ZTjibenmianxuangu'){
          if(this.isLabel=='主题之一飞冲天'){
            this.moudle_flag='13'
          }else if(this.isLabel=='主题之步步为赢'){
            this.moudle_flag='14'
          }else{
            this.moudle_flag='15'
          }
        }else if(pathName=='/rdztgaoguan/Ggjibenmianxuangu'){
          this.moudle_flag='16'
        }else if(pathName=='/rdztgaoguan/LHjibenmianxuangu'){
          this.moudle_flag='17'
        }else if(pathName=='/rdztgaoguan/ZLjibenmianxuangu'){
          this.moudle_flag='18'
        }
        for(var i=0;i<this.seleData.length;i++){
            let stockSel = {}
            // if(this.radio=='1'){
              stockSel.satisfaction_mode = this.radio
            // }else{
            //   stockSel.satisfaction_mode = '全部满足'
            // }
            // if(this.radio1=='1'){
              stockSel.contain_ST = this.radio1
            // }else{
            //   stockSel.contain_ST = '是'
            // }
            stockSel.moudle_flag = this.moudle_flag
            stockSel.parent_name = this.seleData[i].parentName
            stockSel.report_period = this.seleData[i].bgq
            stockSel.child_name = this.seleData[i].name
            stockSel.calculation_symbol = this.seleData[i].dyVal
            stockSel.fill_data = this.seleData[i].numVal
            stockSel.fill_data_left = this.seleData[i].jieyu
            stockSel.fill_data_right = this.seleData[i].jieyu1
            stockSel.result_content = this.seleData[i].content
            stockSel.operation_user = JSON.parse(sessionStorage.getItem('user')).user_name
            arr.push(stockSel)
        }
        if(arr.length==0){
          api.deleteCy4FundamentalStockSelection(this.moudle_flag).then(()=>{
              this.$router.go(-1)
          });
        }else{
          api.addCy4FundamentalStockSelection(arr).then(()=>{
              this.$router.go(-1)
          });
        }
        
        // this.$router.go(-1)
      },
      //二级弹窗关闭
      popClose() {
        this.pop = false;
        this.$refs['ruleForm'].resetFields();
      },
      //选择结果区点击二级弹窗关闭
      popsClose() {
        this.pops = false;
        this.$refs['ruleForm'].resetFields();
      },
      //选择结果区点击二级弹窗确定
      popsConfirm() {
        this.$refs.seleForm.validate((valid) => {
          if (valid) {
            this.dyVal = this.seleForm.dyVal
            this.jieyu = this.seleForm.jieyu
            this.jieyu1 = this.seleForm.jieyu1
            this.bgq = this.seleForm.bgq
              
            for(var i=0;i<this.seleData.length;i++){
              if(i==this.seleIndex){//判断选中的条件与seleData中的下标相同
                console.log(this.seleData[i]);
                // var indexName = this.seleData[i].name
                if(this.seleData[i].name == '总股本'){//判断条件的name
                    this.numVal = this.seleForm.numVal
                    //重新拼装条件中的content
                    if(this.dyVal=='介于'){
                    this.seleForm.content = this.dyVal+this.jieyu+'——'+this.jieyu1+'万'
                    }else{
                    this.seleForm.content = this.dyVal+this.numVal+'万'
                    }
                }else if(this.seleData[i].name == '流通A股'){
                    this.numVal = this.seleForm.numVal
                    if(this.dyVal=='介于'){
                    this.seleForm.content = this.dyVal+this.jieyu+'——'+this.jieyu1+'万'
                    }else{
                    this.seleForm.content = this.dyVal+this.numVal+'万'
                    }
                }else if(this.seleData[i].name == '流通比例'){
                    this.numVal = this.seleForm.numVal
                    if(this.dyVal=='介于'){
                    this.seleForm.content = this.dyVal+this.jieyu+'——'+this.jieyu1+'万'
                    }else{
                    this.seleForm.content = this.dyVal+this.numVal+'万'
                    }
                }else if(this.seleData[i].name == '股东总数'){
                    this.numVal = this.seleForm.numVal
                    if(this.dyVal=='介于'){
                    this.seleForm.content = this.dyVal+this.jieyu+'——'+this.jieyu1+'万'
                    }else{
                    this.seleForm.content = this.dyVal+this.numVal+'万'
                    }
                }else if(this.seleData[i].name == '主营业务收入'){
                    this.numVal = this.seleForm.numVal
                    if(this.dyVal=='介于'){
                    this.seleForm.content = this.dyVal+this.jieyu+'——'+this.jieyu1+'万'
                    }else{
                    this.seleForm.content = this.dyVal+this.numVal+'万'
                    }
                }else if(this.seleData[i].name == '资产总计'){
                    this.numVal = this.seleForm.numVal
                    if(this.dyVal=='介于'){
                    this.seleForm.content = this.dyVal+this.jieyu+'——'+this.jieyu1+'万'
                    }else{
                    this.seleForm.content = this.dyVal+this.numVal+'万'
                    }
                }else if(this.seleData[i].name == '股东权益合计'){
                    this.numVal = this.seleForm.numVal
                    if(this.dyVal=='介于'){
                    this.seleForm.content = this.dyVal+this.jieyu+'——'+this.jieyu1+'亿元'
                    }else{
                    this.seleForm.content = this.dyVal+this.numVal+'亿元'
                    }
                }else if(this.seleData[i].name == '每股公积金'){
                    this.numVal = this.seleForm.numVal
                    if(this.dyVal=='介于'){
                    this.seleForm.content = this.dyVal+this.jieyu+'——'+this.jieyu1+'亿元'
                    }else{
                    this.seleForm.content = this.dyVal+this.numVal+'亿元'
                    }
                }else if(this.seleData[i].name == '投资收益'){
                    this.numVal = this.seleForm.numVal
                    if(this.dyVal=='介于'){
                    this.seleForm.content = this.dyVal+this.jieyu+'——'+this.jieyu1+'亿元'
                    }else{
                    this.seleForm.content = this.dyVal+this.numVal+'亿元'
                    }
                }else if(this.seleData[i].name == '每股净资产'){
                    this.numVal = this.seleForm.numVal
                    if(this.dyVal=='介于'){
                    this.seleForm.content = this.dyVal+this.jieyu+'——'+this.jieyu1+'元'
                    }else{
                    this.seleForm.content = this.dyVal+this.numVal+'元'
                    }
                }else if(this.seleData[i].name == '最新价格'){
                    this.numVal = this.seleForm.numVal
                    if(this.dyVal=='介于'){
                    this.seleForm.content = this.dyVal+this.jieyu+'——'+this.jieyu1+'元'
                    }else{
                    this.seleForm.content = this.dyVal+this.numVal+'元'
                    }
                }else if(this.seleData[i].name == '每股收益'){
                    this.numVal = this.seleForm.numVal
                    if(this.dyVal=='介于'){
                    this.seleForm.content = this.dyVal+this.jieyu+'——'+this.jieyu1+'元'
                    }else{
                    this.seleForm.content = this.dyVal+this.numVal+'元'
                    }
                }else if(this.seleData[i].name == '股利收益率'){
                    this.numVal = this.seleForm.numVal
                    if(this.dyVal=='介于'){
                    this.seleForm.content = this.dyVal+this.jieyu+'——'+this.jieyu1+'%'
                    }else{
                    this.seleForm.content = this.dyVal+this.numVal+'%'
                    }
                }else if(this.seleData[i].name == '每股现金流'){
                    this.numVal = this.seleForm.numVal
                    if(this.dyVal=='介于'){
                    this.seleForm.content = this.dyVal+this.jieyu+'——'+this.jieyu1+'%'
                    }else{
                    this.seleForm.content = this.dyVal+this.numVal+'%'
                    }
                }else if(this.seleData[i].name == '股价涨跌幅'){
                    this.numVal = this.seleForm.numVal
                    if(this.dyVal=='介于'){
                    this.seleForm.content = this.dyVal+this.jieyu+'——'+this.jieyu1+'万'
                    }else{
                    this.seleForm.content = this.dyVal+this.numVal+'万'
                    }
                }else if(this.seleData[i].name == '市盈率（动）'){
                    this.numVal = this.seleForm.numVal
                    if(this.dyVal=='介于'){
                    this.seleForm.content = this.dyVal+this.jieyu+'——'+this.jieyu1
                    }else{
                    this.seleForm.content = this.dyVal+this.numVal
                    }
                }else if(this.seleData[i].name == '二级行业平均市盈率'){
                    this.numVal = this.seleForm.numVal
                    if(this.dyVal=='介于'){
                    this.seleForm.content = this.dyVal+this.jieyu+'——'+this.jieyu1+'%'
                    }else{
                    this.seleForm.content = this.dyVal+this.numVal+'%'
                    }
                }else if(this.seleData[i].name == '成交量'){
                    this.numVal = this.seleForm.numVal
                    if(this.dyVal=='介于'){
                    this.seleForm.content = this.dyVal+this.jieyu+'——'+this.jieyu1+'万元'
                    }else{
                    this.seleForm.content = this.dyVal+this.numVal+'万元'
                    }
                }else if(this.seleData[i].name == '净利润'){
                    this.numVal = this.seleForm.numVal
                    if(this.dyVal=='介于'){
                    this.seleForm.content = this.dyVal+this.jieyu+'——'+this.jieyu1+'亿万'
                    }else{
                    this.seleForm.content = this.dyVal+this.numVal+'亿万'
                    }
                }else if(this.seleData[i].name == '净利润率'){
                    this.numVal = this.seleForm.numVal
                    if(this.dyVal=='介于'){
                    this.seleForm.content = this.dyVal+this.jieyu+'——'+this.jieyu1+'%'
                    }else{
                    this.seleForm.content = this.dyVal+this.numVal+'%'
                    }
                }else if(this.seleData[i].name == '最近2年净利润率'){
                    this.numVal = this.seleForm.numVal
                    if(this.dyVal=='介于'){
                    this.seleForm.content = this.dyVal+this.jieyu+'——'+this.jieyu1+'%'
                    }else{
                    this.seleForm.content = this.dyVal+this.numVal+'%'
                    }
                }else if(this.seleData[i].name == '净资产收益率'){
                    this.numVal = this.seleForm.numVal
                    if(this.dyVal=='介于'){
                    this.seleForm.content = this.dyVal+this.jieyu+'——'+this.jieyu1+'%'
                    }else{
                    this.seleForm.content = this.dyVal+this.numVal+'%'
                    }
                }else if(this.seleData[i].name == '过去2年净资产收益率'){
                    this.numVal = this.seleForm.numVal
                    if(this.dyVal=='介于'){
                    this.seleForm.content = this.dyVal+this.jieyu+'——'+this.jieyu1+'%'
                    }else{
                    this.seleForm.content = this.dyVal+this.numVal+'%'
                    }
                }else if(this.seleData[i].name == '主营业务利润'){
                    this.numVal = this.seleForm.numVal
                    if(this.dyVal=='介于'){
                    this.seleForm.content = this.dyVal+this.jieyu+'——'+this.jieyu1+'亿元'
                    }else{
                    this.seleForm.content = this.dyVal+this.numVal+'亿元'
                    }
                }else if(this.seleData[i].name == '净收益增长率'){
                    this.numVal = this.seleForm.numVal
                    if(this.dyVal=='介于'){
                    this.seleForm.content = this.dyVal+this.jieyu+'——'+this.jieyu1+'%'
                    }else{
                    this.seleForm.content = this.dyVal+this.numVal+'%'
                    }
                }else if(this.seleData[i].name == '连续2年净收益增长率'){
                    this.numVal = this.seleForm.numVal
                    if(this.dyVal=='介于'){
                    this.seleForm.content = this.dyVal+this.jieyu+'——'+this.jieyu1+'%'
                    }else{
                    this.seleForm.content = this.dyVal+this.numVal+'%'
                    }
                }else if(this.seleData[i].name == '营业收入增长率'){
                    this.numVal = this.seleForm.numVal
                    if(this.dyVal=='介于'){
                    this.seleForm.content = this.dyVal+this.jieyu+'——'+this.jieyu1+'%'
                    }else{
                    this.seleForm.content = this.dyVal+this.numVal+'%'
                    }
                }else if(this.seleData[i].name == '连续2年营业收入增长率'){
                    this.numVal = this.seleForm.numVal
                    if(this.dyVal=='介于'){
                    this.seleForm.content = this.dyVal+this.jieyu+'——'+this.jieyu1+'%'
                    }else{
                    this.seleForm.content = this.dyVal+this.numVal+'%'
                    }
                }else if(this.seleData[i].name == '三年营业收入复合增速'){
                    this.numVal = this.seleForm.numVal
                    if(this.dyVal=='介于'){
                    this.seleForm.content = this.dyVal+this.jieyu+'——'+this.jieyu1+'%'
                    }else{
                    this.seleForm.content = this.dyVal+this.numVal+'%'
                    }
                }else if(this.seleData[i].name == '加权净资产收益率'){
                    this.numVal = this.seleForm.numVal
                    if(this.dyVal=='介于'){
                    this.seleForm.content = this.dyVal+this.jieyu+'——'+this.jieyu1+'%'
                    }else{
                    this.seleForm.content = this.dyVal+this.numVal+'%'
                    }
                }else if(this.seleData[i].name == '三年归母净利润复合增速'){
                    this.numVal = this.seleForm.numVal
                    if(this.dyVal=='介于'){
                    this.seleForm.content = this.dyVal+this.jieyu+'——'+this.jieyu1+'%'
                    }else{
                    this.seleForm.content = this.dyVal+this.numVal+'%'
                    }
                }else if(this.seleData[i].name == '市净率'){
                    this.numVal = this.seleForm.numVal
                    if(this.dyVal=='介于'){
                    this.seleForm.content = this.dyVal+this.jieyu+'——'+this.jieyu1
                    }else{
                    this.seleForm.content = this.dyVal+this.numVal
                    }
                }else if(this.seleData[i].name == '总市值'){
                    this.numVal = this.seleForm.numVal
                    if(this.dyVal=='介于'){
                    this.seleForm.content = this.dyVal+this.jieyu+'——'+this.jieyu1+'%'
                    }else{
                    this.seleForm.content = this.dyVal+this.numVal+'%'
                    }
                }else if(this.seleData[i].name == '流通市值'){
                    this.numVal = this.seleForm.numVal
                    if(this.dyVal=='介于'){
                    this.seleForm.content = this.dyVal+this.jieyu+'——'+this.jieyu1+'%'
                    }else{
                    this.seleForm.content = this.dyVal+this.numVal+'%'
                    }
                }else if(this.seleData[i].name == '每股净资产'){
                    this.numVal = this.seleForm.numVal
                    if(this.dyVal=='介于'){
                    this.seleForm.content = this.dyVal+this.jieyu+'——'+this.jieyu1+'元'
                    }else{
                    this.seleForm.content = this.dyVal+this.numVal+'元'
                    }
                }else if(this.seleData[i].name == '流动比率'){
                    this.numVal = this.seleForm.numVal
                    if(this.dyVal=='介于'){
                    this.seleForm.content = this.dyVal+this.jieyu+'——'+this.jieyu1+'%'
                    }else{
                    this.seleForm.content = this.dyVal+this.numVal+'%'
                    }
                }else if(this.seleData[i].name == '资产负债比率'){
                    this.numVal = this.seleForm.numVal
                    if(this.dyVal=='介于'){
                    this.seleForm.content = this.dyVal+this.jieyu+'——'+this.jieyu1+'%'
                    }else{
                    this.seleForm.content = this.dyVal+this.numVal+'%'
                    }
                }else if(this.seleData[i].name == '应收账款周转率'){
                    this.numVal = this.seleForm.numVal
                    if(this.dyVal=='介于'){
                    this.seleForm.content = this.dyVal+this.jieyu+'——'+this.jieyu1+'%'
                    }else{
                    this.seleForm.content = this.dyVal+this.numVal+'%'
                    }
                }else if(this.seleData[i].name == '存货周转次数'){
                    this.numVal = this.seleForm.numVal
                    if(this.dyVal=='介于'){
                    this.seleForm.content = this.dyVal+this.jieyu+'——'+this.jieyu1+'次'
                    }else{
                    this.seleForm.content = this.dyVal+this.numVal+'次'
                    }
                }else if(this.seleData[i].name == '流动资产周转率'){
                    this.numVal = this.seleForm.numVal
                    if(this.dyVal=='介于'){
                    this.seleForm.content = this.dyVal+this.jieyu+'——'+this.jieyu1+'%'
                    }else{
                    this.seleForm.content = this.dyVal+this.numVal+'%'
                    }
                }else if(this.seleData[i].name == '总资产周转率'){
                    this.numVal = this.seleForm.numVal
                    if(this.dyVal=='介于'){
                    this.seleForm.content = this.dyVal+this.jieyu+'——'+this.jieyu1+'%'
                    }else{
                    this.seleForm.content = this.dyVal+this.numVal+'%'
                    }
                }
              }
            }
            // this.seleForm.content = dyVal + jieyu1 + numVal
            this.$set(this.seleData,this.seleIndex,this.seleForm)
            this.pops = false;
        } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      //二级弹窗确定
      popConfirm() {//parent  父节点  label  子节点  value是大于等   value1  报告期
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            let result = {}; 
            if(this.label=='总股本'){
              result.xsBgq=false
              result.parentName = this.parent
              result.name = this.label
              if(this.value=='介于'){
                  result.content = this.value+this.ruleForm.jieyu+'——'+this.ruleForm.jieyu1+'万'
                  result.dyVal = this.value
                  result.jieyu = this.ruleForm.jieyu
                  result.jieyu1 = this.ruleForm.jieyu1
              }else{
                  result.content = this.value+this.ruleForm.zgb+'万'
                  result.dyVal = this.value
                  result.numVal = this.ruleForm.zgb
              }
              this.seleForm = result
              this.seleData.push(result)
            }else if(this.label=='流通A股'){
              result.parentName = this.parent
              result.name = this.label
              if(this.value=='介于'){
                  result.content = this.value+this.ruleForm.jieyu+'——'+this.ruleForm.jieyu1+'万'
                  result.dyVal = this.value
                  result.jieyu = this.ruleForm.jieyu
                  result.jieyu1 = this.ruleForm.jieyu1
              }else{
                  result.content = this.value+this.ruleForm.ltab+'万'
                  result.dyVal = this.value
                  result.numVal = this.ruleForm.ltab
              }
              this.seleData.push(result)
            }else if(this.label=='流通比例'){
              result.parentName = this.parent
              result.name = this.label
              if(this.value=='介于'){
                  result.content = this.value+this.ruleForm.jieyu+'——'+this.ruleForm.jieyu1+'%'
                  result.dyVal = this.value
                  result.jieyu = this.ruleForm.jieyu
                  result.jieyu1 = this.ruleForm.jieyu1
              }else{
                  result.content = this.value+this.ruleForm.ltbl+'%'
                  result.dyVal = this.value
                  result.numVal = this.ruleForm.ltbl
              }
              this.seleData.push(result)
            }else if(this.label=='股东总数'){
              result.xsBgq=true
              result.parentName = this.parent
              result.name = this.label
              if(this.value=='介于'){
                  result.bgq = this.value1
                  result.dyVal = this.value
                  result.jieyu = this.ruleForm.jieyu
                  result.jieyu1 = this.ruleForm.jieyu1
                  result.content = '('+this.value1+')'+this.value+this.ruleForm.jieyu+'——'+this.ruleForm.jieyu1+'万'
              }else{
                  result.content = '('+this.value1+')'+this.value+this.ruleForm.gdzs+'万'
                  result.bgq = this.value1
                  result.dyVal = this.value
                  result.numVal = this.ruleForm.gdzs
              }
              this.seleData.push(result)
            }else if(this.label=='主营业务收入'){
              result.parentName = this.parent
              result.name = this.label
              if(this.value=='介于'){
                  result.bgq = this.value1
                  result.dyVal = this.value
                  result.jieyu = this.ruleForm.jieyu
                  result.jieyu1 = this.ruleForm.jieyu1
                  result.content = '('+this.value1+')'+this.value+this.ruleForm.jieyu+'——'+this.ruleForm.jieyu1+'万'
              }else{
                  result.content = '('+this.value1+')'+this.value+this.ruleForm.zyywsr+'万'
                  result.bgq = this.value1
                  result.dyVal = this.value
                  result.numVal = this.ruleForm.zyywsr
              }
              this.seleData.push(result)
            }else if(this.label=='资产总计'){
              result.parentName = this.parent
              result.name = this.label
              if(this.value=='介于'){
                  result.bgq = this.value1
                  result.dyVal = this.value
                  result.jieyu = this.ruleForm.jieyu
                  result.jieyu1 = this.ruleForm.jieyu1
                  result.content = '('+this.value1+')'+this.value+this.ruleForm.jieyu+'——'+this.ruleForm.jieyu1+'万'
              }else{
                  result.content = '('+this.value1+')'+this.value+this.ruleForm.zczj+'万'
                  result.bgq = this.value1
                  result.dyVal = this.value
                  result.numVal = this.ruleForm.zczj
              }
              this.seleData.push(result)
            }else if(this.label=='股东权益合计'){
              result.parentName = this.parent
              result.name = this.label
              if(this.value=='介于'){
                  result.bgq = this.value1
                  result.dyVal = this.value
                  result.jieyu = this.ruleForm.jieyu
                  result.jieyu1 = this.ruleForm.jieyu1
                  result.content = '('+this.value1+')'+this.value+this.ruleForm.jieyu+'——'+this.ruleForm.jieyu1+'亿元'
              }else{
                  result.content = '('+this.value1+')'+this.value+this.ruleForm.gdqyhj+'亿元'
                  result.bgq = this.value1
                  result.dyVal = this.value
                  result.numVal = this.ruleForm.gdqyhj
              }
              this.seleData.push(result)
            }else if(this.label=='每股公积金'){
              result.parentName = this.parent
              result.name = this.label
              if(this.value=='介于'){
                  result.bgq = this.value1
                  result.dyVal = this.value
                  result.jieyu = this.ruleForm.jieyu
                  result.jieyu1 = this.ruleForm.jieyu1
                  result.content = '('+this.value1+')'+this.value+this.ruleForm.jieyu+'——'+this.ruleForm.jieyu1+'亿元'
              }else{
                  result.content = '('+this.value1+')'+this.value+this.ruleForm.mggjj+'亿元'
                  result.bgq = this.value1
                  result.dyVal = this.value
                  result.numVal = this.ruleForm.mggjj
              }
              this.seleData.push(result)
            }else if(this.label=='投资收益'){
              result.parentName = this.parent
              result.name = this.label
              if(this.value=='介于'){
                  result.bgq = this.value1
                  result.dyVal = this.value
                  result.jieyu = this.ruleForm.jieyu
                  result.jieyu1 = this.ruleForm.jieyu1
                  result.content = '('+this.value1+')'+this.value+this.ruleForm.jieyu+'——'+this.ruleForm.jieyu1+'亿元'
              }else{
                  result.content = '('+this.value1+')'+this.value+this.ruleForm.tzsy+'亿元'
                  result.bgq = this.value1
                  result.dyVal = this.value
                  result.numVal = this.ruleForm.tzsy
              }
              this.seleData.push(result)
            }else if(this.label=='每股净资产'){
              result.parentName = this.parent
              result.name = this.label
              if(this.value=='介于'){
                  result.bgq = this.value1
                  result.dyVal = this.value
                  result.jieyu = this.ruleForm.jieyu
                  result.jieyu1 = this.ruleForm.jieyu1
                  result.content = '('+this.value1+')'+this.value+this.ruleForm.jieyu+'——'+this.ruleForm.jieyu1+'元'
              }else{
                  result.content = '('+this.value1+')'+this.value+this.ruleForm.mgjzc+'元'
                  result.bgq = this.value1
                  result.dyVal = this.value
                  result.numVal = this.ruleForm.mgjzc
              }
              this.seleData.push(result)
            }else if(this.label=='最新价格'){
              result.parentName = this.parent
              result.name = this.label
              if(this.value=='介于'){
                  result.dyVal = this.value
                  result.jieyu = this.ruleForm.jieyu
                  result.jieyu1 = this.ruleForm.jieyu1
                  result.content = this.value+this.ruleForm.jieyu+'——'+this.ruleForm.jieyu1+'元'
              }else{
                  result.content = this.value+this.ruleForm.zxjg+'元'
                  result.dyVal = this.value
                  result.numVal = this.ruleForm.zxjg
              }
              this.seleData.push(result)
            }else if(this.label=='每股收益'){
              result.parentName = this.parent
              result.name = this.label
              if(this.value=='介于'){
                  result.bgq = this.value1
                  result.dyVal = this.value
                  result.jieyu = this.ruleForm.jieyu
                  result.jieyu1 = this.ruleForm.jieyu1
                  result.content = '('+this.value1+')'+this.value+this.ruleForm.jieyu+'——'+this.ruleForm.jieyu1+'元'
              }else{
                  result.content = '('+this.value1+')'+this.value+this.ruleForm.mgsy+'元'
                  result.bgq = this.value1
                  result.dyVal = this.value
                  result.numVal = this.ruleForm.mgsy
              }
              this.seleData.push(result)
            }else if(this.label=='股利收益率'){
              result.parentName = this.parent
              result.name = this.label
              if(this.value=='介于'){
                  result.bgq = this.value1
                  result.dyVal = this.value
                  result.jieyu = this.ruleForm.jieyu
                  result.jieyu1 = this.ruleForm.jieyu1
                  result.content = '('+this.value1+')'+this.value+this.ruleForm.jieyu+'——'+this.ruleForm.jieyu1+'%'
              }else{
                  result.content = '('+this.value1+')'+this.value+this.ruleForm.syl+'%'
                  result.bgq = this.value1
                  result.dyVal = this.value
                  result.numVal = this.ruleForm.syl
              }
              this.seleData.push(result)
            }else if(this.label=='每股现金流'){
              result.parentName = this.parent
              result.name = this.label
              if(this.value=='介于'){
                  result.bgq = this.value1
                  result.dyVal = this.value
                  result.jieyu = this.ruleForm.jieyu
                  result.jieyu1 = this.ruleForm.jieyu1
                  result.content = '('+this.value1+')'+this.value+this.ruleForm.jieyu+'——'+this.ruleForm.jieyu1+'%'
              }else{
                  result.content = '('+this.value1+')'+this.value+this.ruleForm.mgxjl+'%'
                  result.bgq = this.value1
                  result.dyVal = this.value
                  result.numVal = this.ruleForm.mgxjl
              }
              this.seleData.push(result)
            }else if(this.label=='股价涨跌幅'){
              result.parentName = this.parent
              result.name = this.label
              if(this.value=='介于'){
                  result.dyVal = this.value
                  result.jieyu = this.ruleForm.jieyu
                  result.jieyu1 = this.ruleForm.jieyu1
                  result.content = this.value+this.ruleForm.jieyu+'——'+this.ruleForm.jieyu1+'%'
              }else{
                  result.content = this.value+this.ruleForm.gjzdf+'%'
                  result.dyVal = this.value
                  result.numVal = this.ruleForm.gjzdf
              }
              this.seleData.push(result)
            }else if(this.label=='市盈率（动）'){
              result.parentName = this.parent
              result.name = this.label
              if(this.value=='介于'){
                  result.dyVal = this.value
                  result.jieyu = this.ruleForm.jieyu
                  result.jieyu1 = this.ruleForm.jieyu1
                  result.content = this.value+this.ruleForm.jieyu+'——'+this.ruleForm.jieyu1
              }else{
                  result.content = this.value+this.ruleForm.syld
                  result.dyVal = this.value
                  result.numVal = this.ruleForm.syld
              }
              this.seleData.push(result)
            }else if(this.label=='二级行业平均市盈率'){
              result.parentName = this.parent
              result.name = this.label
              if(this.value=='介于'){
                  result.dyVal = this.value
                  result.jieyu = this.ruleForm.jieyu
                  result.jieyu1 = this.ruleForm.jieyu1
                  result.content = this.value+this.ruleForm.jieyu+'——'+this.ruleForm.jieyu1+'%'
              }else{
                  result.content = this.value+this.ruleForm.ejhypjsyl+'%'
                  result.dyVal = this.value
                  result.numVal = this.ruleForm.ejhypjsyl
              }
              this.seleData.push(result)
            }else if(this.label=='成交量'){
              result.parentName = this.parent
              result.name = this.label
              if(this.value=='介于'){
                  result.dyVal = this.value
                  result.jieyu = this.ruleForm.jieyu
                  result.jieyu1 = this.ruleForm.jieyu1
                  result.content = this.value+this.ruleForm.jieyu+'——'+this.ruleForm.jieyu1+'万元'
              }else{
                  result.content = this.value+this.ruleForm.cjl+'万元'
                  result.dyVal = this.value
                  result.numVal = this.ruleForm.cjl
              }
              this.seleData.push(result)
            }else if(this.label=='净利润'){
              result.parentName = this.parent
              result.name = this.label
              if(this.value=='介于'){
                  result.bgq = this.value1
                  result.dyVal = this.value
                  result.jieyu = this.ruleForm.jieyu
                  result.jieyu1 = this.ruleForm.jieyu1
                  result.content = '('+this.value1+')'+this.value+this.ruleForm.jieyu+'——'+this.ruleForm.jieyu1+'亿元'
              }else{
                  result.content = '('+this.value1+')'+this.value+this.ruleForm.jlr+'亿元'
                  result.bgq = this.value1
                  result.dyVal = this.value
                  result.numVal = this.ruleForm.jlr
              }
              this.seleData.push(result)
            }else if(this.label=='净利润率'){
              result.parentName = this.parent
              result.name = this.label
              if(this.value=='介于'){
                  result.bgq = this.value1
                  result.dyVal = this.value
                  result.jieyu = this.ruleForm.jieyu
                  result.jieyu1 = this.ruleForm.jieyu1
                  result.content = '('+this.value1+')'+this.value+this.ruleForm.jieyu+'——'+this.ruleForm.jieyu1+'%'
              }else{
                  result.content = '('+this.value1+')'+this.value+this.ruleForm.jlrl+'%'
                  result.bgq = this.value1
                  result.dyVal = this.value
                  result.numVal = this.ruleForm.jlrl
              }
              this.seleData.push(result)
            }else if(this.label=='最近2年净利润率'){
              result.parentName = this.parent
              result.name = this.label
              if(this.value=='介于'){
                  result.bgq = this.value2
                  result.dyVal = this.value
                  result.jieyu = this.ruleForm.jieyu
                  result.jieyu1 = this.ruleForm.jieyu1
                  result.content = '('+this.value2+')'+this.value+this.ruleForm.jieyu+'——'+this.ruleForm.jieyu1+'%'
              }else{
                  result.content = '('+this.value2+')'+this.value+this.ruleForm.zxln+'%'
                  result.bgq = this.value2
                  result.dyVal = this.value
                  result.numVal = this.ruleForm.zxln
              }
              this.seleData.push(result)
            }else if(this.label=='净资产收益率'){
              result.parentName = this.parent
              result.name = this.label
              if(this.value=='介于'){
                  result.bgq = this.value1
                  result.dyVal = this.value
                  result.jieyu = this.ruleForm.jieyu
                  result.jieyu1 = this.ruleForm.jieyu1
                  result.content = '('+this.value1+')'+this.value+this.ruleForm.jieyu+'——'+this.ruleForm.jieyu1+'%'
              }else{
                  result.content = '('+this.value1+')'+this.value+this.ruleForm.jzcsyl+'%'
                  result.bgq = this.value1
                  result.dyVal = this.value
                  result.numVal = this.ruleForm.jzcsyl
              }
              this.seleData.push(result)
            }else if(this.label=='过去2年净资产收益率'){
              result.parentName = this.parent
              result.name = this.label
              if(this.value=='介于'){
                  result.bgq = this.value2
                  result.dyVal = this.value
                  result.jieyu = this.ruleForm.jieyu
                  result.jieyu1 = this.ruleForm.jieyu1
                  result.content = '('+this.value2+')'+this.value+this.ruleForm.jieyu+'——'+this.ruleForm.jieyu1+'%'
              }else{
                  result.content = '('+this.value2+')'+this.value+this.ruleForm.gqjzcsyl+'%'
                  result.bgq = this.value2
                  result.dyVal = this.value
                  result.numVal = this.ruleForm.gqjzcsyl
              }
              this.seleData.push(result)
            }else if(this.label=='主营业务利润'){
              result.parentName = this.parent
              result.name = this.label
              if(this.value=='介于'){
                  result.bgq = this.value1
                  result.dyVal = this.value
                  result.jieyu = this.ruleForm.jieyu
                  result.jieyu1 = this.ruleForm.jieyu1
                  result.content = '('+this.value1+')'+this.value+this.ruleForm.jieyu+'——'+this.ruleForm.jieyu1+'亿元'
              }else{
                  result.content = '('+this.value1+')'+this.value+this.ruleForm.zyywlr+'亿元'
                  result.bgq = this.value1
                  result.dyVal = this.value
                  result.numVal = this.ruleForm.zyywlr
              }
              this.seleData.push(result)
            }else if(this.label=='净收益增长率'){
              result.parentName = this.parent
              result.name = this.label
              if(this.value=='介于'){
                  result.bgq = this.value1
                  result.dyVal = this.value
                  result.jieyu = this.ruleForm.jieyu
                  result.jieyu1 = this.ruleForm.jieyu1
                  result.content = '('+this.value1+')'+this.value+this.ruleForm.jieyu+'——'+this.ruleForm.jieyu1+'%'
              }else{
                  result.content = '('+this.value1+')'+this.value+this.ruleForm.jsyzzl+'%'
                  result.bgq = this.value1
                  result.dyVal = this.value
                  result.numVal = this.ruleForm.jsyzzl
              }
              this.seleData.push(result)
            }else if(this.label=='连续2年净收益增长率'){
              result.parentName = this.parent
              result.name = this.label
              if(this.value=='介于'){
                  result.bgq = this.value2
                  result.dyVal = this.value
                  result.jieyu = this.ruleForm.jieyu
                  result.jieyu1 = this.ruleForm.jieyu1
                  result.content = '('+this.value2+')'+this.value+this.ruleForm.jieyu+'——'+this.ruleForm.jieyu1+'%'
              }else{
                  result.content = '('+this.value2+')'+this.value+this.ruleForm.lxjsy+'%'
                  result.bgq = this.value2
                  result.dyVal = this.value
                  result.numVal = this.ruleForm.lxjsy
              }
              this.seleData.push(result)
            }else if(this.label=='营业收入增长率'){
              result.parentName = this.parent
              result.name = this.label
              if(this.value=='介于'){
                  result.bgq = this.value1
                  result.dyVal = this.value
                  result.jieyu = this.ruleForm.jieyu
                  result.jieyu1 = this.ruleForm.jieyu1
                  result.content = '('+this.value1+')'+this.value+this.ruleForm.jieyu+'——'+this.ruleForm.jieyu1+'%'
              }else{
                  result.content = '('+this.value1+')'+this.value+this.ruleForm.yysrzzl+'%'
                  result.bgq = this.value1
                  result.dyVal = this.value
                  result.numVal = this.ruleForm.yysrzzl
              }
              this.seleData.push(result)
            }else if(this.label=='连续2年营业收入增长率'){
              result.parentName = this.parent
              result.name = this.label
              if(this.value=='介于'){
                  result.bgq = this.value2
                  result.dyVal = this.value
                  result.jieyu = this.ruleForm.jieyu
                  result.jieyu1 = this.ruleForm.jieyu1
                  result.content = '('+this.value2+')'+this.value+this.ruleForm.jieyu+'——'+this.ruleForm.jieyu1+'%'
              }else{
                  result.content = '('+this.value2+')'+this.value+this.ruleForm.lxyysrzzl+'%'
                  result.bgq = this.value2
                  result.dyVal = this.value
                  result.numVal = this.ruleForm.lxyysrzzl
              }
              this.seleData.push(result)
            }else if(this.label=='三年营业收入复合增速'){
              result.parentName = this.parent
              result.name = this.label
              if(this.value=='介于'){
                  result.bgq = this.value1
                  result.dyVal = this.value
                  result.jieyu = this.ruleForm.jieyu
                  result.jieyu1 = this.ruleForm.jieyu1
                  result.content = '('+this.value1+')'+this.value+this.ruleForm.jieyu+'——'+this.ruleForm.jieyu1+'%'
              }else{
                  result.content = '('+this.value1+')'+this.value+this.ruleForm.snyysrfhzs+'%'
                  result.bgq = this.value1
                  result.dyVal = this.value
                  result.numVal = this.ruleForm.snyysrfhzs
              }
              this.seleData.push(result)
            }else if(this.label=='加权净资产收益率'){
              result.parentName = this.parent
              result.name = this.label
              if(this.value=='介于'){
                  result.bgq = this.value1
                  result.dyVal = this.value
                  result.jieyu = this.ruleForm.jieyu
                  result.jieyu1 = this.ruleForm.jieyu1
                  result.content = '('+this.value1+')'+this.value+this.ruleForm.jieyu+'——'+this.ruleForm.jieyu1+'%'
              }else{
                  result.content = '('+this.value1+')'+this.value+this.ruleForm.jqjzcsyl+'%'
                  result.bgq = this.value1
                  result.dyVal = this.value
                  result.numVal = this.ruleForm.jqjzcsyl
              }
              this.seleData.push(result)
            }else if(this.label=='三年归母净利润复合增速'){
              result.parentName = this.parent
              result.name = this.label
              if(this.value=='介于'){
                  result.bgq = this.value1
                  result.dyVal = this.value
                  result.jieyu = this.ruleForm.jieyu
                  result.jieyu1 = this.ruleForm.jieyu1
                  result.content = '('+this.value1+')'+this.value+this.ruleForm.jieyu+'——'+this.ruleForm.jieyu1+'%'
              }else{
                  result.content = '('+this.value1+')'+this.value+this.ruleForm.sngmjlr+'%'
                  result.bgq = this.value1
                  result.dyVal = this.value
                  result.numVal = this.ruleForm.sngmjlr
              }
              this.seleData.push(result)
            }else if(this.label=='市净率'){
              result.parentName = this.parent
              result.name = this.label
              if(this.value=='介于'){
                  result.dyVal = this.value
                  result.jieyu = this.ruleForm.jieyu
                  result.jieyu1 = this.ruleForm.jieyu1
                  result.content = this.value+this.ruleForm.jieyu+'——'+this.ruleForm.jieyu1
              }else{
                  result.content = this.value+this.ruleForm.sjl
                  result.dyVal = this.value
                  result.numVal = this.ruleForm.sjl
              }
              this.seleData.push(result)
            }else if(this.label=='总市值'){
              result.parentName = this.parent
              result.name = this.label
              if(this.value=='介于'){
                  result.dyVal = this.value
                  result.jieyu = this.ruleForm.jieyu
                  result.jieyu1 = this.ruleForm.jieyu1
                  result.content = this.value+this.ruleForm.jieyu+'——'+this.ruleForm.jieyu1+'%'
              }else{
                  result.content = this.value+this.ruleForm.zsz+'%'
                  result.dyVal = this.value
                  result.numVal = this.ruleForm.zsz
              }
              this.seleData.push(result)
            }else if(this.label=='流通市值'){
              result.parentName = this.parent
              result.name = this.label
              if(this.value=='介于'){
                  result.dyVal = this.value
                  result.jieyu = this.ruleForm.jieyu
                  result.jieyu1 = this.ruleForm.jieyu1
                  result.content = this.value+this.ruleForm.jieyu+'——'+this.ruleForm.jieyu1+'%'
              }else{
                  result.content = this.value+this.ruleForm.ltsz+'%'
                  result.dyVal = this.value
                  result.numVal = this.ruleForm.ltsz
              }
              this.seleData.push(result)
            }else if(this.label=='每股净资产'){
              result.parentName = this.parent
              result.name = this.label
              if(this.value=='介于'){
                  result.bgq = this.value1
                  result.dyVal = this.value
                  result.jieyu = this.ruleForm.jieyu
                  result.jieyu1 = this.ruleForm.jieyu1
                  result.content = '('+this.value1+')'+this.value+this.ruleForm.jieyu+'——'+this.ruleForm.jieyu1+'元'
              }else{
                  result.content = '('+this.value1+')'+this.value+this.ruleForm.mgjzc1+'元'
                  result.bgq = this.value1
                  result.dyVal = this.value
                  result.numVal = this.ruleForm.mgjzc1
              }
              this.seleData.push(result)
            }else if(this.label=='流动比率'){
              result.parentName = this.parent
              result.name = this.label
              if(this.value=='介于'){
                  result.bgq = this.value1
                  result.dyVal = this.value
                  result.jieyu = this.ruleForm.jieyu
                  result.jieyu1 = this.ruleForm.jieyu1
                  result.content = '('+this.value1+')'+this.value+this.ruleForm.jieyu+'——'+this.ruleForm.jieyu1+'%'
              }else{
                  result.content = '('+this.value1+')'+this.value+this.ruleForm.ldbl+'%'
                  result.bgq = this.value1
                  result.dyVal = this.value
                  result.numVal = this.ruleForm.ldbl
              }
              this.seleData.push(result)
            }else if(this.label=='资产负债比率'){
              result.parentName = this.parent
              result.name = this.label
              if(this.value=='介于'){
                  result.bgq = this.value1
                  result.dyVal = this.value
                  result.jieyu = this.ruleForm.jieyu
                  result.jieyu1 = this.ruleForm.jieyu1
                  result.content = '('+this.value1+')'+this.value+this.ruleForm.jieyu+'——'+this.ruleForm.jieyu1+'%'
              }else{
                  result.content = '('+this.value1+')'+this.value+this.ruleForm.zcfzbl+'%'
                  result.bgq = this.value1
                  result.dyVal = this.value
                  result.numVal = this.ruleForm.zcfzbl
              }
              this.seleData.push(result)
            }else if(this.label=='应收账款周转率'){
              result.parentName = this.parent
              result.name = this.label
              if(this.value=='介于'){
                  result.bgq = this.value1
                  result.dyVal = this.value
                  result.jieyu = this.ruleForm.jieyu
                  result.jieyu1 = this.ruleForm.jieyu1
                  result.content = '('+this.value1+')'+this.value+this.ruleForm.jieyu+'——'+this.ruleForm.jieyu1+'次'
              }else{
                  result.content = '('+this.value1+')'+this.value+this.ruleForm.yszkzzl+'次'
                  result.bgq = this.value1
                  result.dyVal = this.value
                  result.numVal = this.ruleForm.yszkzzl
              }
              this.seleData.push(result)
            }else if(this.label=='存货周转次数'){
              result.parentName = this.parent
              result.name = this.label
              if(this.value=='介于'){
                  result.bgq = this.value1
                  result.dyVal = this.value
                  result.jieyu = this.ruleForm.jieyu
                  result.jieyu1 = this.ruleForm.jieyu1
                  result.content = '('+this.value1+')'+this.value+this.ruleForm.jieyu+'——'+this.ruleForm.jieyu1+'次'
              }else{
                  result.content = '('+this.value1+')'+this.value+this.ruleForm.chzzcs+'次'
                  result.bgq = this.value1
                  result.dyVal = this.value
                  result.numVal = this.ruleForm.chzzcs
              }
              this.seleData.push(result)
            }else if(this.label=='流动资产周转率'){
              result.parentName = this.parent
              result.name = this.label
              if(this.value=='介于'){
                  result.bgq = this.value1
                  result.dyVal = this.value
                  result.jieyu = this.ruleForm.jieyu
                  result.jieyu1 = this.ruleForm.jieyu1
                  result.content = '('+this.value1+')'+this.value+this.ruleForm.jieyu+'——'+this.ruleForm.jieyu1+'次'
              }else{
                  result.content = '('+this.value1+')'+this.value+this.ruleForm.ldzczzl+'次'
                  result.bgq = this.value1
                  result.dyVal = this.value
                  result.numVal = this.ruleForm.ldzczzl
              }
              this.seleData.push(result)
            }else if(this.label=='总资产周转率'){
              result.parentName = this.parent
              result.name = this.label
              if(this.value=='介于'){
                  result.bgq = this.value1
                  result.dyVal = this.value
                  result.jieyu = this.ruleForm.jieyu
                  result.jieyu1 = this.ruleForm.jieyu1
                  result.content = '('+this.value1+')'+this.value+this.ruleForm.jieyu+'——'+this.ruleForm.jieyu1+'次'
              }else{
                  result.content = '('+this.value1+')'+this.value+this.ruleForm.zzczzl+'次'
                  result.bgq = this.value1
                  result.dyVal = this.value
                  result.numVal = this.ruleForm.zzczzl
              }
              this.seleData.push(result)
            }
            this.pop = false;
        } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      seleDelete(n) {
        this.seleData.splice(n, 1);
      },
      handleNodeClick(data, data1, data2) {
        console.log(data1);
        this.label = data.label;
        this.parent = data1.parent.data.label        
        if (data.pop) {
          this.pop = true;
        }
      },
      //清除选择列表
      bnclearallClick(){
          this.seleData = [];
          this.$set(this.seleData);
      },
    },
    mounted() {
      this.seleData =this.$route.query.seleData
        // var selected = sessionStorage.getItem('seleData');
        // this.seleData = JSON.parse(selected);
    }
  }
</script>
<style scoped>
  .content {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, .6);
  }

  .chosecon {
    width: 700px;
    height: 600px;
    position: absolute;
    left: 50%;
    top: 50%;
    margin-top: -300px;
    margin-left: -350px;
    background: #e4e4e4;
    padding: 10px 20px 20px;
  }

  .title {
    font-size: 20px;
    color: #000;
    line-height: 30px;
    text-align: center;
    border-bottom: 1px solid rgba(0, 0, 0, .1);
    padding-bottom: 10px;
  }

  .chosebox {
    background: #FFF;
    padding: 0 20px 20px;
  }

  .cbtitle {
    font-size: 16px;
    color: #000;
    line-height: 30px;
  }

  .cbcon {
  }

  .cbleft {
    width: 160px;
    float: left;
    margin-right: 10px;
  }

  .cbcontitle {
    font-size: 14px;
    color: #000;
    line-height: 30px;
    background: #e3e3e3;
    text-align: center;
  }

  .cbright {
    width: 450px;
    float: right;
  }

  .cbleft-con {
    height: 320px;
    border: 1px solid #e1e1e1;
    overflow-y: auto;
  }

  .line {
    width: 100%;
    height: 1px;
    background: #e1e1e1;
  }

  .selectedbox {

  }

  .selper {
    padding: 10px 0 0 30px;
    margin-bottom: 10px;
    position: relative;
  }

  .selper-hover {
    background: rgba(0, 0, 0, .1);
  }

  .selper .el-icon-close {
    font-size: 20px;
    position: absolute;
    top: 12px;
    left: 0px;
  }

  .selper p {
    font-size: 14px;
    color: #000000;
    line-height: 24px;
  }

  .selper p.name {
    color: #169db5;
  }

  .selectedbox {
    height: 325px;
    overflow-y: auto;
  }

  .pop {
    width: 92%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, .4);
  }

  .popcon {
    width: 600px;
    position: absolute;
    left: 55%;
    top: 50%;
    margin-top: -150px;
    margin-left: -300px;
    background: #FFF;
    padding: 10px 20px;
  }

  .poptitle {
    font-size: 16px;
    color: #000;
    line-height: 30px;
    border-bottom: 1px solid rgba(0, 0, 0, .1);
    padding-bottom: 10px;
  }

  .popcon .t {
    line-height: 30px;
    margin-bottom: 5px;
  }

  .popcon .selper {
    padding: 0;
    width: 200px;
    height: 30px;
    line-height: 30px;
  }

  .popcon .txtper {

  }

  .popcon .txtinput {
    width: 40px;
  }

  .popbtn {
    margin-top: 20px;
    text-align: right;
  }
  .chosebtn{
    margin-top: 10px;
    text-align: right;
  }
  .divh{
    line-height: 40px; 
  }

  /deep/ .el-form-item {
    margin-bottom: 0;
  }
</style>
