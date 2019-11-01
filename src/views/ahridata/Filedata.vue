<template>
    <div id="ahridata-filedata" class="ahridata-filedata">
        <section>
            <div class="panel">
                <div class="opera">
                    <el-button icon="el-icon-back" @click="goBack"></el-button>
                    <el-button @click="handleNewBlock">新建存储块</el-button>
                </div>
                <el-tabs
                    tab-position="left"
                    style="min-height: 300px;max-height: 700px;overflow: auto;"
                    :before-leave="change"
                    type="border-card"
                    closable
                    @tab-remove="removeTab"
                >
                    <el-tab-pane v-for="i in filepool.dirs" v-if="i != ''" :label="i" :name="i">
                        <div class="upload">
                            <el-upload
                                class="upload-demo"
                                :data="{user_id:user._id,filepool:filepool._id,dir:i}"
                                drag
                                :action="upload_url"
                                :on-success="success"
                                :show-file-list="false"
                                multiple
                                style="margin-right: 60px;"
                            >
                                <i class="el-icon-upload"></i>
                                <div class="el-upload__text">
                                    将文件拖到此处，或
                                    <em>点击上传</em>
                                </div>
                            </el-upload>
                            <div v-show="info.filename" class="info">
                                <div class="name">
                                    <i class="el-icon-files"></i>
                                    {{ info.Nfilename }}
                                </div>
                                <div class="path">
                                    <i class="el-icon-magic-stick"></i>
                                    {{ info.path }}
                                </div>
                                <div class="size">
                                    <i class="el-icon-copy-document"></i>
                                    {{ info.filesize /1000000 }}&nbsp;
                                    <b>M</b>
                                </div>
                                <div class="type">
                                    <i class="el-icon-s-operation"></i>
                                    {{ info.filetype }}
                                </div>
                            </div>
                        </div>
                        <div class="files">
                            <div class="demo-image__preview file" v-for="i in files">
                                <div class="mask">
                                    <a :href="i.path" target="_blank">
                                        <i class="el-icon-download"></i>
                                    </a>
                                    <!-- <el-button icon="el-icon-download" @click="download(i)"></el-button> -->
                                    <el-button icon="el-icon-delete" @click="deleteFile(i)"></el-button>
                                    <el-button icon="el-icon-info" @click="info = i"></el-button>
                                </div>
                                <el-image
                                    v-if="i.filetype && (i.filetype.toUpperCase() == 'JPG'||
                                        i.filetype.toUpperCase() == 'JPEG'||
                                        i.filetype.toUpperCase() == 'PNG'||
                                        i.filetype.toUpperCase() == 'BMP'||
                                        i.filetype.toUpperCase() == 'GIF'||
                                        i.filetype.toUpperCase() == 'SVG'||
                                        i.filetype.toUpperCase() == 'ICO')"
                                    style="width: 110px; height: 110px"
                                    :src="i.path"
                                    :preview-src-list="srcList"
                                ></el-image>
                                <div
                                    class="f"
                                    v-else-if="i.filetype && i.filetype.toUpperCase() == 'ZIP'"
                                >
                                    <i class="iconfont icon-zip"></i>
                                </div>
                                <div
                                    class="f"
                                    v-else-if="i.filetype && i.filetype.toUpperCase() == 'RAR'"
                                >
                                    <i class="iconfont icon-icon_xinyong_xianxing_jijin-"></i>
                                </div>
                                <div
                                    class="f"
                                    v-else-if="i.filetype && i.filetype.toUpperCase() == 'TXT'"
                                >
                                    <i class="iconfont icon-text"></i>
                                </div>
                                <div
                                    class="f"
                                    v-else-if="i.filetype && i.filetype.toUpperCase() == 'PPTX'"
                                >
                                    <i class="iconfont icon-ppt"></i>
                                </div>
                                <div
                                    class="f"
                                    v-else-if="i.filetype && (i.filetype.toUpperCase() == 'DOC' || i.filetype.toUpperCase() == 'DOCX')"
                                >
                                    <i class="iconfont icon-wordwenjian"></i>
                                </div>
                                <div
                                    class="f"
                                    v-else-if="i.filetype && (i.filetype.toUpperCase() == 'XLS' || i.filetype.toUpperCase() == 'XLSX')"
                                >
                                    <i class="iconfont icon-web-icon-"></i>
                                </div>
                                <div class="f" v-else>
                                    <i class="iconfont icon-file"></i>
                                </div>
                            </div>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </section>
        <footer>
            <foot-nav></foot-nav>
        </footer>
        <el-dialog
            title="添加文件池"
            :visible.sync="dialogBlockVisible"
            width="800px"
            @close="handleCancel"
            :close-on-click-modal="false"
        >
            <el-form ref="form" :model="formBlock" label-width="80px">
                <el-form-item label="文件池名">
                    <el-input v-model="formBlock.name" placeholder="文件池名称"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogBlockVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitForm">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import FootNav from "@/components/FootNav.vue";
export default {
    name: "ahridata-filedata",
    components: {
        "foot-nav": FootNav
    },
    data() {
        return {
            user: {
                role: 0
            },
            search: "",
            filepool: {},
            upload_url: this.url + "/api/ahridata/filedata/upload/",
            files: [],
            srcList: [],
            tab: "",
            dialogBlockVisible: false,
            formBlock: {
                name: ""
            },
            info: {
                filename: "",
                path: "",
                filesize: "",
                filetype: ""
            },
            loading: {}
        };
    },
    created() {},
    methods: {
        openFullScreen() {
            this.loading = this.$loading({
                lock: true,
                text: "Loading",
                spinner: "el-icon-loading",
                background: "rgba(0, 0, 0, 0.7)"
            });
        },
        goBack() {
            this.$router.push("/ahridata/survey?tab=fp");
        },
        download(val) {
            return `${this.url}/api/ahridata/filedata/download/?user_id=${this.user._id}&_id=${val._id}`;
        },
        removeTab(targetName) {
            this.$confirm("确认删除？", "确认:", { type: "error" })
                .then(_ => {
                    let self = this;
                    this.openFullScreen();
                    let data = {
                        user_id: this.user._id,
                        filepool: this.filepool._id,
                        dirs: this.filepool.dirs,
                        name: targetName,
                        dir: ""
                    };
                    this.axios
                        .put(self.url + "/api/ahridata/filepool/", data)
                        .then(response => {
                            if (response.data.code === 0) {
                                localStorage.removeItem("auth");
                                self.$router.push("/auth/login");
                            } else if (response.data.code === 200) {
                                self.filepool.dirs.pop(targetName);
                                localStorage.setItem(
                                    "file",
                                    JSON.stringify(self.filepool)
                                );
                                self.$message({
                                    showClose: true,
                                    message: "操作成功",
                                    type: "success"
                                });
                            } else if (response.data.code === 400) {
                                self.$message({
                                    showClose: true,
                                    message: "名称重复",
                                    type: "warning"
                                });
                            } else {
                                console.log(response.data);
                                self.$message({
                                    showClose: true,
                                    message: "服务器内部错误"
                                });
                            }
                            self.loading.close();
                        })
                        .catch(response => {
                            console.log(response);
                            self.$message({
                                showClose: true,
                                message: "客户端错误，请求失败"
                            });
                            self.loading.close();
                        });
                })
                .catch(_ => {
                    this.$message({
                        showClose: true,
                        message: "取消删除"
                    });
                });
        },
        handleNewBlock() {
            this.dialogBlockVisible = true;
        },
        handleCancel() {
            this.formBlock.name = "";
            this.dialogBlockVisible = false;
        },
        submitForm() {
            if (this.formBlock.name == "") {
                this.$message({
                    showClose: true,
                    message: "请输入文件夹名称",
                    type: "warning"
                });
                return;
            }
            if (this.filepool.dirs.indexOf(this.formBlock.name) > -1) {
                this.$message({
                    showClose: true,
                    message: "文件夹名称重复",
                    type: "warning"
                });
                return;
            }
            this.formBlock.user_id = this.user._id;
            this.formBlock.filepool = this.filepool._id;
            this.formBlock.dirs = this.filepool.dirs;
            let self = this;
            this.openFullScreen();
            this.axios
                .put(self.url + "/api/ahridata/filepool/", self.formBlock)
                .then(response => {
                    if (response.data.code === 0) {
                        localStorage.removeItem("auth");
                        self.$router.push("/auth/login");
                    } else if (response.data.code === 200) {
                        self.filepool.dirs.push(self.formBlock.name);
                        localStorage.setItem(
                            "file",
                            JSON.stringify(self.filepool)
                        );
                        self.$message({
                            showClose: true,
                            message: "操作成功",
                            type: "success"
                        });
                        self.handleCancel();
                    } else if (response.data.code === 400) {
                        self.$message({
                            showClose: true,
                            message: "名称重复",
                            type: "warning"
                        });
                    } else {
                        console.log(response.data);
                        self.$message({
                            showClose: true,
                            message: "服务器内部错误"
                        });
                    }
                    self.loading.close();
                })
                .catch(response => {
                    console.log(response);
                    self.$message({
                        showClose: true,
                        message: "客户端错误，请求失败"
                    });
                    self.loading.close();
                });
        },
        success(response, file, fileList) {
            this.files.push(response);
            this.change(this.tab);
        },
        change(activeName, oldActiveName) {
            if (activeName != 0) {
                this.getFiles(activeName);
                this.tab = activeName;
            }
        },
        getFiles(dir) {
            let self = this;
            this.openFullScreen();
            this.axios
                .get(self.url + "/api/ahridata/fileblock/", {
                    params: {
                        filepool: self.filepool._id,
                        dir: dir,
                        user_id: self.user._id
                    }
                })
                .then(response => {
                    if (response.data.code === 0) {
                        localStorage.removeItem("auth");
                        self.$router.push("/auth/login");
                    } else if (response.data.code === 200) {
                        self.files = response.data.data;
                        self.srcList = [];
                        self.files.forEach(element => {
                            if (
                                element.filetype.toUpperCase() == "JPG" ||
                                element.filetype.toUpperCase() == "JPEG" ||
                                element.filetype.toUpperCase() == "PNG" ||
                                element.filetype.toUpperCase() == "BMP" ||
                                element.filetype.toUpperCase() == "GIF" ||
                                element.filetype.toUpperCase() == "SVG" ||
                                element.filetype.toUpperCase() == "ICO"
                            )
                                self.srcList.push(element.path);
                        });
                    } else {
                        self.$message({
                            showClose: true,
                            message: "服务器内部错误"
                        });
                    }
                    self.loading.close();
                })
                .catch(response => {
                    console.log(response);
                    self.$message({
                        showClose: true,
                        message: "客户端错误，请求失败"
                    });
                    self.loading.close();
                });
        },
        deleteFile(val) {
            this.$confirm("确认删除？", "确认:", { type: "error" })
                .then(_ => {
                    let self = this;
                    this.openFullScreen();
                    this.axios
                        .delete(self.url + "/api/ahridata/fileblock/", {
                            data: {
                                user_id: self.user._id,
                                _id: val._id
                            }
                        })
                        .then(response => {
                            if (response.data.code === 0) {
                                localStorage.removeItem("auth");
                                self.$router.push("/auth/login");
                            } else if (response.data.code === 200) {
                                self.$message({
                                    showClose: true,
                                    message: "删除成功",
                                    type: "success"
                                });
                                self.files = self.files.filter(item => {
                                    return item._id != val._id;
                                });
                            } else {
                                console.log(response.data);
                                self.$message({
                                    showClose: true,
                                    message: "服务器内部错误"
                                });
                            }
                            self.loading.close();
                        })
                        .catch(response => {
                            console.log(response);
                            self.$message({
                                showClose: true,
                                message: "客户端错误，请求失败"
                            });
                            self.loading.close();
                        });
                })
                .catch(_ => {
                    this.$message({
                        showClose: true,
                        message: "取消删除"
                    });
                });
        }
    },
    mounted() {
        if (this.$store.state.user != null) {
            this.user = this.$store.state.user;
        } else {
            this.user = {
                role: 0
            };
            window.location = "/";
            return false;
        }
        if (this.$route.params.hasOwnProperty("_id")) {
            this.filepool = this.$route.params;
        } else {
            if (localStorage.getItem("file")) {
                this.filepool = JSON.parse(localStorage.getItem("file"));
            } else {
                this.$router.push({ name: "ahridata-survey" });
                return;
            }
        }
        this.tab = this.filepool.dirs[0];
        this.getFiles(this.filepool.dirs[0]);
    },
    beforeRouteLeave(to, from, next) {
        localStorage.removeItem("file");
        next();
    }
};
</script>

<style lang="scss" scoped>
#ahridata-filedata {
    height: 100%;
    section {
        min-height: 100%;
        padding: 100px 50px 100px 50px;
        .panel {
            width: 90%;
            margin: 0 auto;
            box-shadow: #ccc 0 0 8px;
            padding: 30px;
            .opera {
                padding: 15px 0;
            }
            .upload {
                display: flex;
                .info {
                    div {
                        margin: 5px 0;
                        font-size: 18px;
                        i {
                            padding: 5px;
                            border-radius: 4px;
                            font-size: 24px;
                            background: #ccc;
                        }
                    }
                    .path {
                        white-space: normal;
                        word-break: break-all;
                        word-wrap: break-word;
                    }
                }
            }
            .files {
                display: flex;
                flex-wrap: wrap;
                .file {
                    // z-index: 999;
                    position: relative;
                    width: 120px;
                    height: 120px;
                    margin: 15px;
                    cursor: pointer;
                    border-radius: 2px;
                    box-shadow: #ccc 0 0 4px;
                    padding: 5px;
                    &:hover {
                        box-shadow: #bbb 0 0 5px;
                    }
                    &:hover .mask {
                        height: 80%;
                    }
                    .mask {
                        z-index: 1;
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 0;
                        background: #0007;
                        border-radius: 2px;
                        transition: 0.2s;
                        overflow: hidden;
                        display: flex;
                        justify-content: space-around;
                        align-items: center;
                        cursor: pointer;
                        a {
                            display: block;
                            background: none;
                            text-align: center;
                            line-height: 30px;
                            border-radius: 4px;
                            border: none;
                            width: 30px;
                            height: 30px;
                            margin: 0;
                            padding: 0;
                            color: #fff;
                            font-size: 20px;
                            transition: 0.2s;
                            &:hover {
                                border: #ccc solid 1px;
                            }
                        }
                        button {
                            display: block;
                            background: none;
                            border: none;
                            width: 30px;
                            height: 30px;
                            margin: 0;
                            padding: 0;
                            color: #fff;
                            font-size: 20px;
                            transition: 0.2s;
                            &:hover {
                                padding-top: 2px;
                                border: #ccc solid 1px;
                            }
                        }
                    }
                    .f {
                        text-align: center;
                        line-height: 120px;
                        i {
                            font-size: 66px;
                        }
                    }
                }
            }
        }
    }
    footer {
        width: 100%;
        height: 60px;
        margin-top: -60px;
    }
}
</style>