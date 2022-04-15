<template>
    <section v-if="$route.path === '/celueshezhi'">
        <el-tabs v-model="activeName0" type="card" @tab-click="handleClick">
            <!-- <el-tab-pane label="热点之波段再起" name="first">
               <celue :isLable="tab.label"></celue>
            </el-tab-pane>
            <el-tab-pane label="热点之风云出动">
               <celue :isLable="tab.label"></celue>
            </el-tab-pane>
            <el-tab-pane label="热点之主升浪选股">
               <celue :isLable="tab.label"></celue>               
            </el-tab-pane> -->
            
            <el-tab-pane v-for="(v, i) in rdTabs" :label="v.label" :name="v.name">
               <celue :isLable="v.label" v-model="activeName1"></celue>               
            </el-tab-pane>
        </el-tabs>
    </section>
    <section v-else>
        <el-tabs v-model="activeName0" type="card" @tab-click="handleClick">
            <!-- <el-tab-pane label="主题之波段再起" name="first">
               <celue :isLable="tab.label"></celue>
            </el-tab-pane>
            <el-tab-pane label="主题之风云出动">
               <celue :isLable="tab.label"></celue>
            </el-tab-pane>
            <el-tab-pane label="主题之主升浪选股">
               <celue :isLable="tab.label"></celue>               
            </el-tab-pane> -->
            <el-tab-pane v-for="(v, i) in ztTabs" :label="v.label" :name="v.name">
               <celue :isLable="v.label" v-model="activeName1"></celue>               
            </el-tab-pane>
        </el-tabs>
    </section>
</template>
<script>
import celue from './celue.vue';
export default {
    components: { celue },
    data (){
        return {
            
            rdTabs: [
                {
                    label: '热点之一飞冲天',
                    name: 'first'
                },{
                    label: '热点之步步为赢',
                    name: 'second'
                },{
                    label: '热点之一箭三雕',
                    name: 'third'
                }
            ],
            ztTabs: [
                {
                    label: '主题之一飞冲天',
                    name: 'first'
                },{
                    label: '主题之步步为赢',
                    name: 'second'
                },{
                    label: '主题之一箭三雕',
                    name: 'third'
                }
            ],
            editForm:{},
            xuanguForm:{},
            // activeName: "first",
            // activeName0:'first',
            activeName0: this.$route.query.tab || 'first',
            activeName1: this.$route.query.tab2 || 'first',
            // activeName2:'',
            // active:'first',
            // active1:'',
            // active2:'',

            // addForm:{
            //     date:'',
            //     name:'',
            //     address:''
            // },
            page: 1,
            size:10,
            total:50,
            currentPage: 1,
             addForm: [{
                date: '1',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
                }, {
                    date: '2',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1517 弄'
                }, {
                    date: '3',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1519 弄'
                }, {
                    date: '4',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1516 弄'
            }],
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
        handleClick(tab, event) {
            this.activeName1 = 'first';
            // console.log(tab, event);
            // console.log(tab.label)
        },
        handleCurrentChange(val) {
            this.page = val;
        },
        handleCurrentChange(val) {
            this.page = val;
            var para = {
                page:this.page,
                size:this.size,
                // sec_name : this.filters.sec_name,
                // pub_date : this.filters.pub_date
            };
        //    alert( JSON.stringify(para))
            // this.getList(this.page,this.size,this.sec_name,this.pub_date)
            // this.getList(para)
        },
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
