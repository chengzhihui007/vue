<template>
    <section >
        <el-tabs v-model="activeName0" type="card" >
            <celue :isLable="a" v-model="first"></celue>
        </el-tabs>
    </section>
</template>
<script>
import celue from './celue$HotTuyere.vue';
export default {
    components: { celue },
    data (){
        return {
            editForm:{},
            xuanguForm:{},
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
