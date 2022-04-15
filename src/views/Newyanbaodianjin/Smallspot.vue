<template>
	<div class="spotTemp" >
		<Stock v-for='(data,index) in editForm.jingXuanGeGu' :stockObj=data :index=index :ref=stockRef @remStock="remStock"></Stock>
		<el-button type="primary" @click="addStock">+ 添加个股</el-button>
	</div>
</template>

<script>
	import UeEdit from '../UeEdit.vue';
	import Stock from './Stock.vue';
	export default {
		data(){
			return{
				direction:this.setTitle(),
				stockRef:this.setRef()
			}
		},
		components: {UeEdit,Stock},
		methods: {
			setRef(index){
				return 'Sto' + (Number(this.index)+1)
			},
			setTitle(index){
				return '主题' + (Number(this.index)+1)
			},
			getAnalyUe(){
				// .replaceAll("</?[^/?(br)|(p)][^><]*>","")
//				return this.$refs['analysis'].getUEContent()
			},
			getUeCon(){
				let ref = this.stockRef;
				this.editForm.jingXuanGeGu = [];
				console.log(this.$refs[ref])
				if(this.$refs[ref]==undefined){
                    this.$confirm('请至少添加一支个股')
				}else{
                    for(let i=0;i<this.$refs[ref].length;i++){

                        this.editForm.jingXuanGeGu[i] = this.$refs[ref][i].getNowStock()
                    }
                    this.editForm.zhuTiMiaoShu = this.getAnalyUe();
                    let spot = this.editForm;
                    return spot
				}

			},
			getIndex: function(index){
			},
            remSpot:function(index){
            	this.$emit('remove',index)
            },
            addStock(){
            	this.editForm.jingXuanGeGu.push({
            		name:'',
            		code:'',
					jianjie:'',
                    content:''
            	})
            },
            remStock(index){
            	this.editForm.jingXuanGeGu.splice(index, 1);
            }
		},
	    props: {
	      editForm: {
	        type: Object
	      },
	      index:{
	      	type: Number
	      },

	    }
	}
</script>

<style>
	.el-form-item__label{
		/*width: 110px !important;*/
		text-align: left;
	}
	.el-form-item__content{
		/*margin-left: 110px !important;*/
	}
	.spotTemp{
		position: relative;
		padding-top: 35px;
	}
	.spotTemp:after{
		content: "";
		width: 100%;
		padding-top: 10px;
		height: 0;
		margin: 0 auto;
		display: block;
		margin-top: 10px;
		border-top: 1px dashed  #666;
	}
</style>