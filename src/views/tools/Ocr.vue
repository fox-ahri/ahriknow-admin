<template>
    <div id="tools-ocr" class="tools-ocr">
        <el-row :gutter="20">
            <el-col :xs="20" :sm="6" :md="6">
                <el-select v-model="lang" placeholder="请选择识别语言" style="width: 100%">
                    <el-option label="通用" value="common"></el-option>
                    <el-option label="中文简体" value="chi_sim"></el-option>
                    <el-option label="中文繁体" value="chi_tra"></el-option>
                    <el-option label="西藏" value="bob"></el-option>
                    <el-option label="白俄罗斯" value="bel"></el-option>
                    <el-option label="英文" value="eng"></el-option>
                    <el-option label="法语" value="fra"></el-option>
                    <el-option label="德语" value="deu"></el-option>
                    <el-option label="日语" value="jpn"></el-option>
                    <el-option label="南非荷兰语" value="afr"></el-option>
                    <el-option label="阿姆哈拉语" value="amh"></el-option>
                    <el-option label="阿拉伯语" value="ara"></el-option>
                    <el-option label="阿萨姆" value="asm"></el-option>
                </el-select>
                <el-upload
                    class="avatar-uploader"
                    :data="{lang: lang}"
                    :action="upload_url"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="start"
                    name="image"
                >
                    <!-- <img v-if="img" :src="img" class="avatar" /> -->
                    <i class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
                <el-image
                    style="width: 100%; height: 100%"
                    v-if="img"
                    :src="img"
                    :preview-src-list="srcList"
                ></el-image>
            </el-col>
            <el-col :xs="20" :sm="18" :md="18">
                <el-input type="textarea" :rows="15" v-model="text"></el-input>
                <el-button
                    plain
                    v-clipboard:copy="text"
                    v-clipboard:success="success"
                    v-clipboard:error="onError"
                    icon="el-icon-upload2"
                    style="margin-top: 10px"
                >{{ $t('l.tools.ocr.copy')}}</el-button>
            </el-col>
        </el-row>
    </div>
</template>

<script>
export default {
    name: "tools-ocr",
    data() {
        return {
            upload_url: this.url + "/tools/ocr/",
            img: "",
            text: "",
            loading: null,
            lang: "chi_sim",
            srcList: []
        };
    },
    methods: {
        success() {
            this.$message({
                message: "复制成功",
                type: "success"
            });
        },
        onError() {
            this.$message.error("复制出错了");
        },
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
                this.srcList[0] = response.data.url;
                this.img = response.data.url;
                this.text = response.data.text;
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
    },
    mounted() {},
    watch: {
        lang() {
            this.text = "";
            this.img = "";
        }
    }
};
</script>

<style lang="scss" scoped>
#tools-ocr {
    .avatar-uploader {
        border: 1px dashed #d9d9d9;
        text-align: center;
        margin: 20px 0;
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