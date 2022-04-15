<template>
<div>
  <quill-editor ref="myTextEditor"
              v-model="content"
              :options="editorOption">
  </quill-editor>
  <div v-on:click="sub">
    获取
  </div>
  
</div>
</template>

<script>
  export default {
  data () {
    return {
      content: '',
       editorOption: {
          modules: {
            toolbar: [
              ['image']
            ]
          },
          imageImport: false,
          imageResize: {
            displaySize: true
          }
        }
    }
  },
  props: {
      /*编辑器的内容*/
      value: {
          type: String
      }
  },

  // if you need to manually control the data synchronization, parent component needs to explicitly emit an event instead of relying on implicit binding
  // 如果需要手动控制数据同步，父组件需要显式地处理changed事件
  methods: {
    delHtmlTag:function(str){
      console.log(str)
      return str.replace(/<([a-zA-Z1-6]+)(\s*[^>]*)?>/g, "<$1>");
    },
    sub:function(){
      var tmp = this.delHtmlTag(this.content)
      console.log(tmp)
    },
    onEditorBlur(editor) {
      console.log('editor blur!', editor)
    },
    onEditorFocus(editor) {
      console.log('editor focus!', editor)
    },
    onEditorReady(editor) {
      console.log('editor ready!', editor)
    },
    onEditorChange({ editor, html, text }) {
      // console.log('editor change!', editor, html, text)
      this.content = html
    }
  },
  // if you need to get the current editor object, you can find the editor object like this, the $ref object is a ref attribute corresponding to the dom redefined
  // 如果你需要得到当前的editor对象来做一些事情，你可以像下面这样定义一个方法属性来获取当前的editor对象，实际上这里的$refs对应的是当前组件内所有关联了ref属性的组件元素对象
  computed: {
    editor() {
      return this.$refs.myTextEditor.quillEditor
    }
  },
  mounted() {
    // you can use current editor object to do something(editor methods)
    console.log('this is my editor', this.editor)
    // this.editor to do something...
  }
}
</script>

<style>
  .ql-container .ql-editor {
    min-height: 5em;
    padding-bottom: 1em;
    max-height: 25em;
  }
  .html {
    height: 9em;
    overflow-y: auto;
    border: 1px solid #ccc;
    border-top: none;
    resize: vertical;
  }
</style>