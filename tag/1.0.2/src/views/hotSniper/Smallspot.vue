<template>
	<div class="spotTemp">
		<el-button type="danger" size="small" style="position: absolute;right: 20px;top: 0px;z-index: 88;" @click="remSpot(index)">删除此模板</el-button>
        <el-form-item :label="direction"   prop="redianfangxiang">
			<el-input v-model="editForm.redianfangxiang"  placeholder="（限10个字以内）" ></el-input>
		</el-form-item>
		<el-form-item label="热点短评"  prop="redianduanping">
			<el-input v-model="editForm.redianduanping"  placeholder="（限10个字以内）"></el-input>
        </el-form-item>
		<el-form-item label="涨停加数"  prop="zhangtingjiashu">
			<el-input v-model="editForm.zhangtingjiashu" placeholder="（限10个字以内）"></el-input>
		</el-form-item>
		<el-form-item label="个股涨跌比"  prop="geguzhangdiebi" >
			<el-input v-model="editForm.geguzhangdiebi" placeholder="（限10个字以内）"></el-input>
		</el-form-item>
		<el-form-item label="指数涨幅"  prop="zhishuzhangfu">
			<el-input v-model="editForm.zhishuzhangfu" placeholder="（限10个字以内）"></el-input>
        </el-form-item>
        <el-form-item label="指数涨幅排行"  prop="zhishuzhangfupaihang">
			<el-input v-model="editForm.zhishuzhangfupaihang" placeholder="（限10个字以内）"></el-input>
		</el-form-item>
		<el-form-item label="资金流入流出对比"  prop="zijinduibi">
			<el-input v-model="editForm.zijinduibi" placeholder="（限10个字以内）"></el-input>
		</el-form-item>
		<el-form-item label="热点题材分析" prop="redianfenxi">
			<UeEdit :thisData="'redianfenxi'" v-on:ueIpt-say="listenThisUe" :maxWords=200 :defaultMsg=editForm.redianfenxi   ></UeEdit>
		</el-form-item>
		<el-form-item label="板块走势分析" prop="bankuaifenxi">
			<UeEdit :thisData="'bankuaifenxi'" v-on:ueIpt-say="listenThisUe" :maxWords=200 :defaultMsg=editForm.bankuaifenxi ></UeEdit>
		</el-form-item>
		<Stock  v-for='(data,index) in editForm.jingxuangegu' :stockObj=data :index=index :ref=stockRef @remStock="remStock"></Stock>
		<el-button type="primary" @click="addStock">+ 添加个股</el-button>
	</div>
</template>

<script>
    import UeEdit from './edit.vue';
    import Stock from './Stock.vue';
    export default {
        data() {
            return {
                direction: this.setTitle(),
                stockRef: this.setRef()
            }
        },
        components: {
            UeEdit,
            Stock
        },
        methods: {
            listenThisUe(thisUe) {
                this.editForm[thisUe.name] = thisUe.data;
                return thisUe
            },
            setRef(index) {
                return 'Sto' + (Number(this.index) + 1)
            },
            setTitle(index) {
                return '热点方向' + (Number(this.index) + 1)
            },
            remSpot: function(index) {
                this.$emit('remove', index)
            },
            addStock() {
                this.editForm.jingxuangegu.push({
                    name: '',
                    code: '',
                    reason: '',
                    analysis: ''
                })
            },
            remStock(index) {
                this.editForm.jingxuangegu.splice(index, 1);
            }
        },

        props: {
            editForm: {
                type: Object
            },
            index: {
                type: Number
            },
            maxWords: {
                type: Number
            }
        }
    }
</script>

<style>
    .el-form-item__label {
        /*width: 110px !important;*/
        text-align: left;
    }
    
    .el-form-item__content {
        /*margin-left: 110px !important;*/
    }
    
    .spotTemp {
        position: relative;
        padding-top: 35px;
    }
    
    .spotTemp:after {
        content: "";
        width: 100%;
        padding-top: 10px;
        height: 0;
        margin: 0 auto;
        display: block;
        margin-top: 10px;
        border-top: 1px dashed #666;
    }
</style>