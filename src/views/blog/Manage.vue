<template>
    <div id="blog-manage" class="blog-manage">
        <aside>
            <div class="title nocopy" :title="blog.name">Ahri Blog - {{ blog.name }}</div>
            <div class="tree">
                <div class="opera">
                    <el-button icon="el-icon-back" @click="goBack"></el-button>
                    <el-input placeholder="输入关键字进行过滤" v-model="filterText"></el-input>
                </div>
                <div class="article">
                    <div
                        class="tip"
                        v-show="article.length == 0 || article.filter(item => !filterText || item.name.includes(filterText)).length == 0"
                    >没有文章</div>
                    <el-button
                        icon="el-icon-edit"
                        style="width: 100%;margin: 20px 0"
                        @click="newArticle"
                    >添加文章</el-button>
                    <el-tag v-if="form.n" :type="blog.contribute == '投稿'?'info':'success'">
                        <div class="name">{{ form.name }}</div>
                        <div class="other">
                            <el-button
                                size="mini"
                                type="text"
                                icon="el-icon-close"
                                @click="handlCancel"
                            ></el-button>
                        </div>
                    </el-tag>
                    <el-tag
                        v-for="i in article.filter(item => !filterText || item.name.includes(filterText))"
                        :type="i.disabled?'info':'primary'"
                        @click="editArticle(i)"
                    >
                        <div class="name">{{i.name}}</div>
                        <div class="other">
                            <el-switch
                                v-if="user.role > 90"
                                v-model="i.disabled"
                                active-color="#ff4949"
                                inactive-color="#13ce66"
                                @change="changeStatus(i)"
                            ></el-switch>
                            <el-button
                                size="mini"
                                type="text"
                                icon="el-icon-close"
                                @click="deleteArticle(i)"
                            ></el-button>
                        </div>
                    </el-tag>
                </div>
            </div>
        </aside>
        <section>
            <article>
                <div v-show="edit" class="left">
                    <div class="button">
                        <el-button @click="handlsave()">保存</el-button>
                        <el-button @click="handlCancel()">取消</el-button>
                    </div>
                    <div class="info">
                        <el-form ref="form" :model="form" label-width="80px">
                            <el-form-item label="文章名">
                                <el-input v-model="form.name" placeholder="文章名"></el-input>
                            </el-form-item>
                            <el-form-item label="关键字">
                                <el-input v-model="form.tags" placeholder="关键字 用 ‘，’ 分隔"></el-input>
                            </el-form-item>
                            <el-form-item label="缩略图">
                                <el-upload
                                    class="avatar-uploader"
                                    :data="{type:'book',user_id:user._id}"
                                    :action="upload_url"
                                    :show-file-list="false"
                                    :on-success="handleAvatarSuccess"
                                >
                                    <img v-if="form.image" :src="form.image" class="avatar" />
                                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                </el-upload>
                            </el-form-item>
                        </el-form>
                    </div>
                    <mavon-editor
                        ref="md"
                        @imgAdd="imgAdd"
                        @change="change"
                        :toolbars="toolbars"
                        v-model="content"
                        :tabSize="4"
                    ></mavon-editor>
                </div>
                <div v-show="!edit" class="right">
                    <div class="button" v-if="art._id">
                        <div class="doc">Article:&nbsp;&nbsp;{{ art.name }}</div>
                        <el-button v-if="user.role == 100" @click="setAbout">设为关于</el-button>
                        <el-button @click="handlEdit()">编辑</el-button>
                    </div>
                    <div class="content html markdown-body" v-html="html"></div>
                </div>
            </article>
            <footer>
                <router-link to="/admin">Home</router-link>&nbsp;|&nbsp;
                <router-link to="/auth/login">Sign in</router-link>&nbsp;|&nbsp;
                <router-link to="/auth/register">Sign up</router-link>&nbsp;|&nbsp;
                <router-link to="/ahridata/survey">AhriData</router-link>&nbsp;|&nbsp;
                <router-link to="/blog/survey">Ahriblog</router-link>&nbsp;|&nbsp;
                <router-link to="/notebook/book">Notebook</router-link>
                <!-- <router-link to="/transfer/galaxy">Transfer</router-link>&nbsp;|&nbsp; -->
            </footer>
        </section>
    </div>
</template>

<script>
import { mavonEditor } from "mavon-editor";
import "mavon-editor/dist/css/index.css";
export default {
    name: "blog-manage",
    components: {
        mavonEditor
    },
    data() {
        return {
            user: {
                role: 0
            },
            upload_url: this.url + "/api/ahriblog/upload/",
            filterText: "",
            blog: {},
            article: [],
            form: {
                n: false,
                name: "",
                tags: "",
                image: ""
            },
            art: {},
            edit: false,
            content: "",
            html: "",
            codeStyle: "tomorrow-night", // 编辑区 code 样式
            toolbars: {
                bold: true, // 粗体
                italic: true, // 斜体
                header: true, // 标题
                underline: true, // 下划线
                strikethrough: true, // 中划线
                mark: false, // 标记
                superscript: false, // 上角标
                subscript: false, // 下角标
                quote: true, // 引用
                ol: true, // 有序列表
                ul: true, // 无序列表
                link: true, // 链接
                imagelink: true, // 图片链接
                code: true, // code
                table: true, // 表格
                fullscreen: true, // 全屏编辑
                readmodel: false, // 沉浸式阅读
                htmlcode: true, // 展示html源码
                help: false, // 帮助
                /* 1.3.5 */
                undo: true, // 上一步
                redo: false, // 下一步
                trash: false, // 清空
                save: false, // 保存（触发events中的save事件）
                /* 1.4.2 */
                navigation: false, // 导航目录
                /* 2.1.8 */
                alignleft: true, // 左对齐
                aligncenter: true, // 居中
                alignright: true, // 右对齐
                /* 2.2.1 */
                subfield: true, // 单双栏模式
                preview: true, // 预览
                boxShadow: false
            },
            loading: {}
        };
    },
    created() {},
    methods: {
        goBack() {
            this.$router.push({ name: "blog-survey" });
        },
        setAbout() {
            let self = this;
            this.axios
                .put(self.url + "/api/setting/about/", {
                    content: self.html,
                    user_id: self.user._id
                })
                .then(response => {
                    if (response.data.code === 0) {
                        localStorage.removeItem("auth");
                        self.$router.push("/auth/login");
                    } else if (response.data.code === 200) {
                        self.$message({
                            showClose: true,
                            message: "设置成功",
                            type: "success"
                        });
                    } else {
                        console.log(response.data);
                        self.$message({
                            showClose: true,
                            message: "服务器内部错误"
                        });
                    }
                })
                .catch(response => {
                    console.log(response);
                    self.$message({
                        showClose: true,
                        message: "客户端错误，请求失败"
                    });
                });
        },
        deleteArticle(val) {
            this.$confirm("确认删除？", "确认:", { type: "error" })
                .then(_ => {
                    let self = this;
                    this.openFullScreen();
                    this.axios
                        .delete(self.url + "/api/ahriblog/article/", {
                            data: {
                                user_id: self.user._id,
                                _id: val._id,
                                disabled: val.disabled,
                                removed: true
                            }
                        })
                        .then(response => {
                            if (response.data.code === 0) {
                                localStorage.removeItem("auth");
                                self.$router.push("/auth/login");
                            } else if (response.data.code === 200) {
                                self.article = self.article.filter(item => {
                                    return item._id != val._id;
                                });
                                self.$message({
                                    showClose: true,
                                    message: "删除成功",
                                    type: "success"
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
            window.event
                ? (window.event.cancelBubble = true)
                : e.stopPropagation(); // 阻止冒泡事件
        },
        changeStatus(val) {
            let self = this;
            this.openFullScreen();
            this.axios
                .delete(self.url + "/api/ahriblog/article/", {
                    data: {
                        user_id: self.user._id,
                        _id: val._id,
                        disabled: val.disabled,
                        removed: false
                    }
                })
                .then(response => {
                    if (response.data.code === 0) {
                        localStorage.removeItem("auth");
                        self.$router.push("/auth/login");
                    } else if (response.data.code === 200) {
                        self.$message({
                            showClose: true,
                            message: "更改成功",
                            type: "success"
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
            window.event
                ? (window.event.cancelBubble = true)
                : e.stopPropagation(); // 阻止冒泡事件
        },
        change(val, render) {
            this.html = render;
            this.md_content = val;
        },
        editArticle(val) {
            this.content = val.markdown;
            this.art = JSON.parse(JSON.stringify(val));
            this.form = this.art;
            this.edit = false;
        },
        handlEdit() {
            this.edit = true;
        },
        newArticle() {
            this.form = {
                n: true,
                name: "",
                tags: "",
                image: ""
            };
            this.content = "";
            this.edit = true;
        },
        handlCancel() {
            this.form.n = false;
            this.edit = false;
            this.art = {};
        },
        imgAdd(pos, file) {
            let param = new FormData();
            param.append("user_id", this.user._id);
            param.append("file", file);
            let self = this;
            this.axios
                .post(self.url + "/api/ahriblog/upload/", param, {
                    headers: { "Content-Type": "multipart/form-data" }
                })
                .then(function(response) {
                    self.$refs.md.$img2Url(pos, response.data.data);
                })
                .catch(function(error) {
                    console.log(error);
                });
        },
        handleAvatarSuccess(response, file, fileList) {
            if (response.code === 200) {
                this.form.image = response.data;
            } else {
                this.$message({
                    showClose: true,
                    message: "上传失败"
                });
            }
        },
        openFullScreen() {
            this.loading = this.$loading({
                lock: true,
                text: "Loading",
                spinner: "el-icon-loading",
                background: "rgba(0, 0, 0, 0.7)"
            });
        },
        handlsave() {
            if (this.form.n) {
                let self = this;
                this.openFullScreen();
                this.form.user_id = this.user._id;
                this.form.markdown = this.content;
                this.form.html = this.html;
                this.form.category = this.blog._id;
                if (this.blog.contribute == "投稿") {
                    this.form.disabled = true;
                } else {
                    this.form.disabled = false;
                }
                this.axios({
                    url: self.url + "/api/ahriblog/article/",
                    method: "post",
                    data: JSON.stringify(self.form),
                    headers: {
                        "Content-Type": "application/json"
                    }
                }).then(
                    function(response) {
                        if (response.data.code === 200) {
                            self.article.push(response.data.data);
                            self.$message({
                                showClose: true,
                                message: "添加成功",
                                type: "success"
                            });
                            self.form = {
                                n: false,
                                name: "",
                                tags: "",
                                image: ""
                            };
                            self.edit = false;
                            self.art = {};
                        } else if (response.data.code === 400) {
                            self.$message({
                                showClose: true,
                                message: "名称重复",
                                type: "warning"
                            });
                        } else {
                            console.log(response);
                            self.$message({
                                showClose: true,
                                message: "服务器内部错误"
                            });
                        }
                        self.loading.close();
                    },
                    function(response) {
                        console.log(response);
                        self.$message({
                            showClose: true,
                            message: "客户端错误，请求失败"
                        });
                        self.loading.close();
                    }
                );
            } else {
                let self = this;
                this.openFullScreen();
                this.form.user_id = this.user._id;
                this.form.markdown = this.content;
                this.form.html = this.html;
                this.axios
                    .put(self.url + "/api/ahriblog/article/", self.form)
                    .then(response => {
                        if (response.data.code === 0) {
                            localStorage.removeItem("auth");
                            self.$router.push("/auth/login");
                        } else if (response.data.code === 200) {
                            self.article.forEach(art => {
                                if (art._id == response.data.data._id) {
                                    for (let k in art) {
                                        art[k] = response.data.data[k];
                                    }
                                }
                            });
                            self.$message({
                                showClose: true,
                                message: "更改成功",
                                type: "success"
                            });
                            self.edit = false;
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
            }
        },
        getArticle() {
            let self = this;
            this.axios
                .get(self.url + "/api/ahriblog/article/", {
                    params: {
                        user_id: self.user._id,
                        category: self.blog._id,
                        role: self.user.role
                    }
                })
                .then(response => {
                    if (response.data.code === 0) {
                        localStorage.removeItem("auth");
                        self.$router.push("/auth/login");
                    } else if (response.data.code === 200) {
                        self.article = response.data.data;
                    } else {
                        console.log(response);
                        self.$message({
                            showClose: true,
                            message: "服务器内部错误"
                        });
                    }
                })
                .catch(response => {
                    console.log(response);
                    self.$message({
                        showClose: true,
                        message: "客户端错误，请求失败"
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
            this.blog = this.$route.params;
        } else {
            if (localStorage.getItem("blog")) {
                this.blog = JSON.parse(localStorage.getItem("blog"));
            } else {
                this.$router.push({ name: "ahridata-survey" });
                return;
            }
        }
        this.getArticle();
    },
    beforeRouteLeave(to, from, next) {
        localStorage.removeItem("blog");
        try {
            this.loading.close();
        } catch {}
        next();
    }
};
</script>

<style lang="scss" scoped>
#blog-manage {
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
        border: 1px dashed #d9d9d9;
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }
    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
    width: 100%;
    height: 100%;
    background: #fff;
    display: flex;
    aside {
        width: 380px;
        height: 100%;
        box-shadow: #bbb 0 0 8px;
        .title {
            width: 100%;
            height: 80px;
            box-shadow: #ccc 0 0 4px;
            padding: 0 15px;
            line-height: 80px;
            text-align: center;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            color: #2c3e50;
            font-size: 24px;
            font-weight: bold;
        }
        .tree {
            height: 100%;
            padding-top: 150px;
            margin-top: -145px;
            .opera {
                height: 60px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                box-shadow: #eee 0 2px 2px;
                padding: 0 10px;
                button {
                    margin-right: 10px;
                }
            }
            .article {
                height: 100%;
                overflow-y: scroll;
                padding: 20px;
                .tip {
                    width: 100%;
                    height: 80px;
                    line-height: 80px;
                    text-align: center;
                    box-shadow: #ccc 0 0 6px;
                    font-size: 24px;
                }
                .el-tag {
                    width: 100%;
                    display: flex;
                    margin: 10px 0;
                    justify-content: space-between;
                    cursor: pointer;
                    .opera {
                        padding: 0;
                    }
                }
            }
        }
    }
    section {
        flex: 1;
        height: 100%;
        overflow-y: scroll;
        article {
            min-height: 100%;
            padding: 20px 10px 100px 10px;
            .left {
                padding: 0 20px;
                .button {
                    text-align: right;
                    padding: 10px 0;
                }
            }
            .right {
                padding: 20px 40px;
                max-width: 1200px;
                margin: 0 auto;
                box-shadow: #ccc 0 0 4px;
                .button {
                    display: flex;
                    justify-content: space-between;
                    padding: 20px 0;
                    .doc {
                        font-size: 22px;
                        color: #2c3e50;
                        font-weight: bold;
                    }
                }
                .content {
                    padding: 20px 40px;
                    box-shadow: #ddd 0 0 4px;
                }
            }
        }
        footer {
            width: 100%;
            height: 60px;
            background: #eee;
            margin-top: -60px;
            line-height: 60px;
            text-align: center;
            a {
                font-size: 14px;
                color: #2c3e50;
            }
        }
    }
}
</style>