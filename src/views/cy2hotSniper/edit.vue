<template>
	<div>
		<el-upload
				class="upload-demo"
				action="/api/file/imageUpload/"
				:on-preview="handlePreview"
				:on-remove="handleRemove"
				:on-success="joinImg"
				:show-file-list="false"
				list-type="picture">
			<el-button size="small" type="primary">点击上传图片</el-button>只能上传jpg/png文件
		</el-upload>
		<UE :defaultMsg=Msg :config=config :id=ueId :ref=ueId v-on:ue-say="listenToUe"></UE>
	</div>
</template>

<script>
    import UE from '../Edit.vue';
    export default {
        components: {
            UE
        },
        data() {
            return {
                fileList2: [],
                UeContent: '',
                Msg: this.defaultMsg,
                config: {
                    toolbars: [
                        [
                            'paragraph'
                        ]
                    ],
                    initialFrameWidth: 760,
                    maximumWords: this.maxWords, //允许的最大字符数
                    catchRemoteImageEnable: false,
                    elementPathEnabled: false,
                    wordCount: true,
                    enableAutoSave: false
                },
                ueId: this.setId()
            }
        },
        methods: {
            listenToUe(ueSay) {
                var b = this.ueId;
                var opt = this.$refs[b].editor.options,
                    max = opt.maximumWords;
                if (!opt.wordCount) {
                    return;
                }

                var count = this.$refs[b].editor.getContentLength(true);
                if (count > max) {
                    this.$message({
                        message: '字数超过最大限制',
                        type: 'warning',
                        showClose: true
                    });
                }
                this.Msg = ueSay;
                var dataName = this.thisData;
                let tmpObj = {
                    name: dataName,
                    data: ueSay
                };
                this.$emit('ueIpt-say', tmpObj)
            },
            joinImg(response, file, fileList) {
                var b = this.ueId;
                this.$refs[b].editor.execCommand('insertimage', [{
                    src: 'http://app2.zslxt.com/image/' + response.message,
                    width: '100',
                    height: '100'
                }]);
            },
            handleRemove(file, fileList) {},
            handlePreview(file) {},
            getUEContent() {
                var b = this.ueId;
                var content = this.$refs[b].getUEContent();
                return content
            },
            setId() {
                let nowId = 'ue' + new Date().getTime();
                this.id = nowId;
                return nowId
            },
            blur() {
                alert(1)
            }
        },
        mounted() {},
        props: {
            defaultMsg: {
                type: String
            },
            maxWords: {
                type: Number
            },
            thisData: {
                type: String
            }

        }
    }
</script>

<style>
    .editor-container {
        max-height: 400px;
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
</style>