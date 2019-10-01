<template>
    <div id="notebook-document" class="notebook-document">
        <aside>
            <div class="title nocopy">{{ book.name }}</div>
            <div class="tree">
                <div class="opera">
                    <el-button icon="el-icon-back" @click="goBack"></el-button>
                    <el-input placeholder="输入关键字进行过滤" v-model="filterText"></el-input>
                </div>
                <div class="catalog">
                    <el-tree
                        :data="data"
                        node-key="id"
                        :expand-on-click-node="false"
                        :filter-node-method="filterNode"
                        ref="tree"
                        highlight-current
                        draggable
                        @node-click="read"
                        default-expand-all
                    >
                        <span class="custom-tree-node nocopy" slot-scope="{ node, data }">
                            <span>{{ node.label }}</span>
                            <span>
                                <el-button
                                    v-if="data.dept < 3"
                                    type="text"
                                    size="mini"
                                    @click="() => append(data)"
                                >
                                    <i class="el-icon-plus"></i>
                                </el-button>
                                <el-button
                                    type="text"
                                    size="mini"
                                    @click="() => remove(node, data)"
                                >
                                    <i class="el-icon-minus"></i>
                                </el-button>
                            </span>
                        </span>
                    </el-tree>
                    <br />
                    <el-button size="medium" style="width: 100%" @click="newDoc">添加</el-button>
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
                    <div class="button" v-if="document.id">
                        <div class="doc">Document:&nbsp;&nbsp;{{ document.name }}</div>
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
                <router-link to="/notebook/book">Notebook</router-link>
            </footer>
        </section>
        <el-dialog
            title="添加文档"
            :visible.sync="dialogFormVisible"
            @close="closeDialog"
            :close-on-click-modal="false"
        >
            <el-form :model="form">
                <el-form-item label="文档名称" :label-width="formLabelWidth">
                    <el-input
                        v-focus="focus"
                        v-model="form.name"
                        autocomplete="off"
                        @keyup.enter.native="newDocument(tmp)"
                    ></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="newDocument(tmp)">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { mavonEditor } from "mavon-editor";
import "mavon-editor/dist/css/index.css";
export default {
    name: "notebook-document",
    components: {
        mavonEditor
    },
    data() {
        return {
            focus: false,
            user: {
                role: 0
            },
            edit: false,
            book: {},
            data: [],
            document: {},
            filterText: "",
            content: "",
            html: `<h1>Welcome to AhriKnow Notebook!</h1>`,
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
            dialogFormVisible: false,
            form: {
                name: ""
            },
            formLabelWidth: "120px",
            tmp: {},
            loading: {}
        };
    },
    created() {},
    methods: {
        goBack() {
            this.$router.push({ name: "notebook-book" });
        },
        closeDialog() {
            this.form.name = "";
        },
        newDocument(data) {
            if (this.form.name == "") {
                this.$message({
                    showClose: true,
                    message: "文档名不能为空",
                    type: "warning"
                });
            }
            if (data) {
                const newChild = {
                    id: new Date().getTime(),
                    label: this.form.name,
                    dept: data.dept + 1,
                    children: []
                };
                if (!data.children) {
                    this.$set(data, "children", []);
                }
                this.changeCatalog();
                data.children.push(newChild);
                this.read(newChild);
            } else {
                let new_doc = {
                    id: new Date().getTime(),
                    label: this.form.name,
                    dept: 1,
                    children: []
                };
                this.changeCatalog();
                this.data.push(new_doc);
            }
            this.form.name = "";
            this.dialogFormVisible = false;
        },
        append(data) {
            this.tmp = data;
            this.dialogFormVisible = true;
            this.focus = true;
            window.event
                ? (window.event.cancelBubble = true)
                : e.stopPropagation(); // 阻止冒泡事件
        },
        remove(node, data) {
            this.$confirm("确认删除？", "确认:", { type: "error" })
                .then(_ => {
                    const parent = node.parent;
                    const children = parent.data.children || parent.data;
                    const index = children.findIndex(d => d.id === data.id);
                    children.splice(index, 1);
                    this.changeCatalog();
                    if (data.id == this.document.id) {
                        this.edit = false;
                        this.document.id = "";
                    }
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
        filterNode(value, data) {
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        },
        newDoc() {
            this.tmp = false;
            this.dialogFormVisible = true;
            this.focus = true;
        },
        read(data) {
            this.html = "";
            let self = this;
            this.openFullScreen();
            this.axios
                .get(self.url + "/api/notebook/document/", {
                    params: {
                        user_id: self.user._id,
                        book_id: self.book._id,
                        doc_id: data.id
                    }
                })
                .then(response => {
                    if (response.data.code === 0) {
                        localStorage.removeItem("auth");
                        self.$router.push("/auth/login");
                    } else if (response.data.code === 200) {
                        self.document = response.data.data;
                        self.document.name = data.label;
                        self.content = self.document.content;
                    } else {
                        console.log(response);
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
        changeCatalog() {
            let self = this;
            this.openFullScreen();
            this.axios
                .put(self.url + "/api/notebook/catalog/", {
                    user_id: self.user._id,
                    _id: self.book._id,
                    catalog: self.data
                })
                .then(response => {
                    if (response.data.code === 0) {
                        localStorage.removeItem("auth");
                        self.$router.push("/auth/login");
                    } else if (response.data.code === 200) {
                        self.$message({
                            showClose: true,
                            message: "操作成功",
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
        },
        handlEdit(type) {
            this.edit = true;
        },
        handlsave() {
            let self = this;
            this.openFullScreen();
            this.axios
                .put(self.url + "/api/notebook/document/", {
                    user_id: self.user._id,
                    book_id: self.book._id,
                    doc_id: self.document.id,
                    content: self.content,
                    html: self.html
                })
                .then(response => {
                    if (response.data.code === 0) {
                        localStorage.removeItem("auth");
                        self.$router.push("/auth/login");
                    } else if (response.data.code === 200) {
                        this.edit = false;
                        self.$message({
                            showClose: true,
                            message: "更改成功",
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
        },
        handlCancel() {
            this.edit = false;
        },
        imgAdd(pos, file) {
            let param = new FormData();
            param.append("user_id", this.user._id);
            param.append("file", file);
            let self = this;
            this.axios
                .post(self.url + "/api/notebook/upload/", param, {
                    headers: { "Content-Type": "multipart/form-data" }
                })
                .then(function(response) {
                    self.$refs.md.$img2Url(pos, response.data.data);
                })
                .catch(function(error) {
                    console.log(error);
                });
            // 添加图片 Base64 格式
            // let self = this;
            // let reader = new FileReader();
            // reader.readAsDataURL(file);
            // reader.οnlοad = e => {
            //     var dataBase64 = e.target.result;
            //     var videoNum = dataBase64.split(";base64,");
            //     self.$refs.md.$img2Url(pos, e.target.result);
            // };
        },
        change(val, render) {
            this.html = render;
            this.md_content = val;
        },
        openFullScreen() {
            this.loading = this.$loading({
                lock: true,
                text: "Loading",
                spinner: "el-icon-loading",
                background: "rgba(0, 0, 0, 0.7)"
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
            this.book = this.$route.params;
        } else {
            if (localStorage.getItem("book")) {
                this.book = JSON.parse(localStorage.getItem("book"));
            } else {
                this.$router.push({ name: "notebook-book" });
                return;
            }
        }
        let self = this;
        this.openFullScreen();
        this.axios
            .get(self.url + "/api/notebook/catalog/", {
                params: {
                    user_id: self.user._id,
                    _id: self.book._id
                }
            })
            .then(response => {
                if (response.data.code === 0) {
                    localStorage.removeItem("auth");
                    self.$router.push("/auth/login");
                } else if (response.data.code === 200) {
                    self.book.catalog = response.data.data;
                    self.data = self.book.catalog;
                } else {
                    console.log(response);
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
    watch: {
        filterText(val) {
            this.$refs.tree.filter(val);
        }
    },
    beforeRouteLeave(to, from, next) {
        localStorage.removeItem("book");
        try {
            this.loading.close();
        } catch {}
        next();
    }
};
</script>

<style lang="scss" scoped>
#notebook-document {
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
            .catalog {
                padding: 10px;
                .custom-tree-node {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    font-size: 14px;
                    padding-right: 8px;
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