<template>
	<div class="spotTemp">
		<Stock  v-for='(data,index) in editForm.jingxuangegu'  :key=data :stockObj=data :index=index :ref=stockRef @remStock="remStock"></Stock>
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