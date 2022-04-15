<template>
	<div>

		<el-select v-model="stockObj.name" filterable remote clearable placeholder="关键词" v-on:clear="add_select_clear"
				   :remote-method="select_remoteMethod" :change="selectchange()" :loading="select_loading" auto-complete="off" style="width:120px;">
			<el-option v-for="item in select_options" :key="item.value"  :label="item.label" :value="item.value">
			</el-option>
		</el-select>
		<el-input v-model="stockObj.code" auto-complete="off" style="width:120px;margin-left:10px;"></el-input>
	</div>
</template>
<script>
import kbspiritDataStore from '../common/js/kbspiritDataStore.js';
export default {
	data(){
		return{
			select_options:[],
			code:'',
			select_loading:false
		}
	},
	methods: {
        selectchange(){
            var r= this.stockObj.name;

            for( var i in this.select_options )
            {
                if(this.select_options[i].value==r)
                {
                    this.stockObj.name=this.select_options[i].label;
                    this.stockObj.code=r;
                }
            }
            this.$emit('stock-say',this.stockObj)
            //console.log("name:::"+this.editForm.stock_name+"value:::"+this.editForm.stock_code);
        },
        add_select_clear() {
            this.stockObj.code="";
        },
        select_remoteMethod(query) {
            if (query !== "") {
                this.select_loading = true;
                setTimeout(async () => {
                    this.select_loading = false;
                    var result = await kbspiritDataStore.query(query);
                    this.select_options=result;
                    //this.editForm.stock_code = this.select_options[0]? this.select_options[0].value: "";
                    //this.editForm.stock_name=this.select_options[0]? this.select_options[0].label: "";
                }, 200);
                // console.log(JSON.stringify(this.select_options));
            } else {
                this.select_options = [];
            }

        },
	},
    props: {
      stockObj: {
        type: Object
      },
    }
}	
</script>