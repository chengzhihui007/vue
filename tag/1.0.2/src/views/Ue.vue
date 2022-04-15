<template>
  <div class="components-container">
    <div class="editor-container">
      <UE :defaultMsg=defaultMsg :config=config :id=ue1 ref="ue"></UE>
    </div>
    <p v-on:click="getUEContent()">获取内容</p>
  </div>
</template>

<script>
  import UE from './Edit.vue';
  export default {
    components: {UE},
    data() {
      return {
        defaultMsg: '',
        config: {
          initialFrameWidth: null,
          initialFrameHeight: 200,
          toolbars: [
              // ['insertimage']
          ],
          // imagePathFormat:'../assets/{filename}',
          catchRemoteImageEnable:false,
          elementPathEnabled : false,
          wordCount:false
        },
        ue1: "ue1", // 不同编辑器必须不同的id
      }
    },
    methods: {
      getUEContent() {
        let content = this.$refs.ue.getUEContent(); // 调用子组件方法
        console.log(content)
      }
    }
  };
</script>

<style>
  .editor-container{
    max-height: 400px;
    overflow-y: auto;
  }
  .info{
    border-radius: 10px;
    line-height: 20px;
    padding: 10px;
    margin: 10px;
    background-color: #ffffff;
  }
  #edui_fixedlayer{
    z-index: 3000 !important;
  }
  .edui-default.edui-dialog{
    z-index: 3000 !important;
  }
  .edui-default .edui-dialog-modalmask {
    opacity: 0.3;
    background-color: #000;
  }
</style>


