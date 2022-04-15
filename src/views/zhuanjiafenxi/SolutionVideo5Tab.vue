<template>
<div>
<p></p>
  <el-tabs v-model="activeName"   @tab-click="handleClick">
    <el-tab-pane label="盘前解读（五星）" name="first"><SolutionVideo :vipNum="5" :type="0" /> </el-tab-pane>
    <el-tab-pane label="收盘点评（五星）" name="second"><SolutionVideo :vipNum="5" :type="1"/></el-tab-pane>
  </el-tabs>
</div>
</template>

<script>
import SolutionVideo from './SolutionVideo.vue'
  export default {
      components: {SolutionVideo},
    data() {
      return {
        activeName: 'first',
        vipNum:'',
      };
    },
    methods: {
      handleClick(tab, event) {
      },
    },
 
    mounted() {
    },
  };
</script>