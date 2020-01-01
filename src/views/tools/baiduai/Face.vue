<template>
    <div id="tools-face" class="tools-face">
        <el-row :gutter="20">
            <el-col :xs="20" :sm="6" :md="6">
                <el-upload
                    class="avatar-uploader"
                    :action="upload_url"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="start"
                    name="image"
                >
                    <img v-if="img" :src="img" class="avatar" />
                    <i class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            </el-col>
            <el-col :xs="20" :sm="18" :md="18">
                <JsonViewer :value="json" copyable boxed></JsonViewer>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import JsonViewer from "vue-json-viewer";
export default {
    name: "tools-face",
    components: {
        JsonViewer
    },
    data() {
        return {
            upload_url: this.url + "/ai/face_detect/",
            img: "",
            json: {},
            loading: null
        };
    },
    methods: {
        start() {
            this.loading = this.$loading({
                lock: true,
                text: "Loading",
                spinner: "el-icon-loading",
                background: "rgba(0, 0, 0, 0.7)"
            });
        },
        handleAvatarSuccess(response, file, fileList) {
            if (response.code === 200) {
                this.json = response.data;
            } else {
                this.$message({
                    showClose: true,
                    message: response.msg
                });
            }
            try {
                this.loading.close();
            } catch {}
        }
    }
};
</script>

<style lang="scss" scoped>
#tools-face {
    .avatar-uploader {
        border: 1px dashed #d9d9d9;
        text-align: center;
    }
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409eff;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        width: 100%;
        height: 100%;
        color: #8c939d;
        line-height: 178px;
        text-align: center;
    }
    .avatar {
        width: 100%;
        height: 100%;
        display: block;
    }
}
</style>