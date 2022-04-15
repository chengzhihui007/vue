<template>
	<el-form-item :label='title'>
		<!--<el-input v-model="stockObj.name" auto-complete="off" placeholder="个股名称" style="width:120px;" prop="name"></el-input>(6个字以内)-->
		<Stockname :stockObj=stockNameCode  v-on:stock-say="listenStock"></Stockname>
		<el-button type="danger" size="small" style="position: absolute;right: 20px;top: 0px;z-index: 88;" @click="remThis(index)">删除个股</el-button>
		<div style="height: 10px;" @click='getNowStock'></div>
		<UeEdit :thisData="'content'" v-on:ueIpt-say="listenThisUe" :maxWords=10000 :defaultMsg='stockObj["content"]' :ref=nowRef></UeEdit>

	</el-form-item>
</template>

<script>
	import UeEdit from '../UeEdit.vue';
    import Stockname from "../Stockname.vue";
	export default {
		data(){

			return{
                select_loading: false,
                select_options: [],
				title:this.setTitle(),
				nowRef:this.setRef(),
                stockNameCode:{"name":this.stockObj["name"],"code":this.stockObj["code"]}
			}
		},
        components: {UeEdit,Stockname},
		methods: {
            listenThisUe(thisUe){
                this.stockObj[thisUe.name] = thisUe.data;
                return thisUe
            },
            listenStock(thisStock){
                this.stockObj.name = thisStock.name;
                this.stockObj.code = thisStock.code;
                return thisStock
            },
            select_remoteMethod(query) {
                if (query !== '') {
                    this.select_loading = true;
                    setTimeout(async () => {
                        this.select_loading = false;
                        this.select_options = await kbspiritDataStore.query(query);
                    }, 200);
                } else {
                    this.select_options = [];
                }
            },
            getNowStock(){
            	let a = this.nowRef;
            	let stock = this.stockObj;
            	stock['content'] = this.$refs[a].getUEContent()
            	// console.log(stock)
            	// let stock = this.$refs[a].getUEContent()
            	return stock
            },
			setTitle(index){
				return '精选个股' + (Number(this.index)+1)
			},
			setRef(index){
				return 'stock' + (Number(this.index)+1)
			},
            remThis:function(index){
            	this.$emit('remStock',index);
            	this.stockObj.name='';
            	this.stockObj.code='';
                this.stockObj["content"]='';
            }
		},
	    props: {
	      stockObj: {
	        type: Object
	      },
	      index:{
	      	type: Number
	      },

	    }
	}
</script>