<template>
  <script :id=id type="text/plain" ></script>
</template>
<script>
export default {
  name: "UE",
  data() {
    return {
      editor: null
    };
  },
  props: {
    defaultMsg: {
      type: String
    },
    config: {
      type: Object
    },
    id: {
      type: String
    }
  },
  mounted() {
    const _this = this;
    this.editor = UE.getEditor(this.id, this.config); // 初始化UE
    this.editor.addListener("ready", function() {
      _this.editor.setContent(_this.defaultMsg); // 确保UE加载完成后，放入内容。
    });
    this.editor.addListener("selectionchange", function() {
      let ueCont = _this.editor.getContent();
      _this.$emit("ue-say", ueCont);
    });

  },
  methods: {
    getUEContent() {
      // 获取内容方法
      // console.log(this.editor.getPlainTxt())
      let ueCont = this.editor.getContent();

      let r = /style="[^"]*"/g;
      ueCont = ueCont.replace(r, "");
      return ueCont;
    },
    resetContent() {
      this.editor.setContent("");
      this.editor.reset();
    }    
  },
  destroyed (){
    return this.editor.destroy();
  },
};
</script>
