<template>
        <el-form-item :label='title'>
           <Stockname :stockObj=stockNameCode :v-on:stock-say="listenStock"></Stockname>
            <el-button type="danger" size="small" style="position: absolute;right: 20px;top: 0px;z-index: 88;" @click="remThis(index)">删除个股</el-button>
            <div style="height: 10px;" @click='getNowStock'></div>
            关注理由<UeEdit :thisData="'reason'" v-on:ueIpt-say="listenThisUe" :maxWords=200  :defaultMsg='stockObj["reason"]' :ref=nowRef></UeEdit>
            推荐原因<UeEdit :thisData="'analysis'" v-on:ueIpt-say="listenThisUe" :maxWords=200  :defaultMsg='stockObj["analysis"]' :ref=nowRef></UeEdit>
        </el-form-item>
    </template>

<script>
    import Stockname from "../Stockname.vue";
    import UeEdit from './edit.vue';
    export default {
        data() {
            return {
                title: this.setTitle(),
                nowRef: this.setRef(),
                stockNameCode: this.stockObj
            }
        },
        components: {
            UeEdit,
            Stockname
        },
        methods: {
            listenThisUe(thisUe) {
                this.stockObj[thisUe.name] = thisUe.data;
                return thisUe
            },
            listenStock(thisStock) {
                this.stockObj.name = thisStock.name;
                this.stockObj.code = thisStock.code;
                return thisStock
            },
            getNowStock() {
                let a = this.nowRef;
                let stock = this.stockObj;
                stock['content'] = this.$refs[a].getUEContent()
                    // console.log(stock)
                    // let stock = this.$refs[a].getUEContent()
                return stock
            },
            setTitle(index) {
                return '精选个股' + (Number(this.index) + 1)
            },
            setRef(index) {
                return 'stock' + (Number(this.index) + 1)
            },
            remThis: function(index) {
                this.$emit('remStock', index)
            }
        },
        props: {
            stockObj: {
                type: Object
            },
            index: {
                type: Number
            },

        }
    }
</script>