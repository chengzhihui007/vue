<template>
    <celue :isLable="a" v-model="first"></celue>
</template>
<script>
import celue from './celue$ThemeInvestment.vue';
export default {
    components: { celue },
    data (){
        return {
            editForm:{},
            xuanguForm:{},
            activeName0: this.$route.query.tab || 'first',
            activeName1: this.$route.query.tab2 || 'first',
            rules:{

            }
        };
    },
    watch: {
        activeName0(val) {
            this.$router.push({query: {tab: val, tab2: 'first'}})
        },
        activeName1(val) {
            var tab = this.$route.query.tab;
            this.$router.push({query: {tab: tab, tab2: val}})
        }
    },
    methods:{
    }
}
</script>
<style>
    .head {
        font-size: 20px;
        border-bottom: 1px solid rgb(177, 172, 172);
        padding-bottom: 20px;
        margin-bottom: 50px;
    }
    .dialog-footer {
        width:400px;
　　　　 border:1px solid red;
        margin:0 auto;
    }
    .xuandiv{
        width:1400px;
　　　　 border:1px solid red;
        margin:0 auto;
    }
    .divForm{
        width:1000px;
　　　　 border:1px solid red;
        margin:0 auto;
    }
    .el-pagination{
        text-align: center;
    }
</style>
