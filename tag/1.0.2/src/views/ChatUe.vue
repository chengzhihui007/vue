<template>
    <div class="components-container">
        <div class="editor-container">
            <UE :defaultMsg=defaultMsg :config=config :id=ue1 ref="ue"></UE>
            <el-upload
                    class="upload-demo"
                    action="/api/file/imageUpload/"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :on-success="joinImg"
                    :show-file-list="false"
                    list-type="picture">
                <el-button size="small" type="primary">点击上传图片</el-button>
                只能上传jpg/png文件
            </el-upload>
        </div>
    </div>
</template>

<script>
    import UE from './Edit.vue';
    import {imageDefault} from "../common/js/urls";
    export default {
        components: {UE},
        data() {
            return {
                defaultMsg: '',
                config: {
                    initialFrameWidth: null,
                    initialFrameHeight: 100,
                    toolbars: [
                        // ['fontfamily', 'fontsize', 'forecolor', 'bold', 'italic', 'link', 'emotion',]
                    ],
                    // imagePathFormat:'../assets/{filename}',
                    catchRemoteImageEnable: false,
                    elementPathEnabled: false,
                    wordCount: false
                },
                ue1: "uechat", // 不同编辑器必须不同的id
            }
        },
        methods: {
            getUEContent() {
                let content = this.$refs.ue.getUEContent(); // 调用子组件方法
                return content
            },
            setUEContent() {
                this.$refs.ue.resetContent();
            },
            joinImg(response, file, fileList) {
                this.$refs.ue.editor.execCommand('insertimage', [
                    {
                        src: imageDefault+response.message,
                        // src:'http://192.168.11.103:10001/image/'+response.message,
                        width: '100',
                        height: '100'
                    }
                ]);
            },
            handleRemove(file, fileList) {
            },
            handlePreview(file) {
            },
        }
    };
</script>

<style>
    .editor-container {
        max-height: 200px;
        overflow-y: auto;
    }

    .info {
        border-radius: 10px;
        line-height: 20px;
        padding: 10px;
        margin: 10px;
        background-color: #ffffff;
    }

    #edui_fixedlayer {
        z-index: 3000 !important;
    }

    .edui-default.edui-dialog {
        z-index: 3000 !important;
    }

    .edui-default .edui-dialog-modalmask {
        opacity: 0.3;
        background-color: #000;
    }

    .submit {
        float: right;
        margin: 10px 10px;
    }

    .upload-demo {

    }
</style>


