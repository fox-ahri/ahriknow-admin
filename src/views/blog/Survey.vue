<template>
    <div id="blog-survey" class="blog-survey">
        <comp-nav active="/blog/survey"></comp-nav>
        <section>
            <article>
                <div v-if="user.role >= 50" class="pagination nocopy">
                    <el-switch
                        style="margin:auto 20px"
                        v-model="showImage"
                        active-text="显示图片"
                        active-color="#13ce66"
                        inactive-color="#ff4949"
                    ></el-switch>
                    <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="currentPage"
                        :page-sizes="[5, 10, 20, 50]"
                        :page-size="pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="this.data.length"
                        background
                    ></el-pagination>
                    <el-button type="primary" size="mini" @click="newBook">新建分类</el-button>
                </div>
                <div v-if="user.role < 50" class="pagination nocopy">
                    <el-button type="primary" size="mini" @click="show = true">申请自行发稿</el-button>
                </div>
                <el-table
                    :data="tableData.filter(data => !search || data.name.includes(search.toLowerCase()))"
                    style="width: 100%"
                    border
                    highlight-current-row
                    :default-sort="{prop: 'date', order: 'descending'}"
                >
                    <el-table-column label="Category Name" prop="name" sortable></el-table-column>
                    <el-table-column label="Describe" prop="describe"></el-table-column>
                    <el-table-column
                        v-if="user.role > 90"
                        label="Username"
                        prop="username"
                        sortable
                    ></el-table-column>
                    <el-table-column label="Date" prop="date" sortable></el-table-column>
                    <el-table-column label="Contribute" prop="contribute" width="120" sortable></el-table-column>
                    <el-table-column label="Image" prop="image" v-if="showImage">
                        <template slot-scope="scope">
                            <el-image
                                style="width: 100px; height: 80px"
                                :src="scope.row.image"
                                fit="contain"
                                :preview-src-list="[scope.row.image]"
                            ></el-image>
                        </template>
                    </el-table-column>
                    <el-table-column align="right" width="210">
                        <template slot="header" slot-scope="scope">
                            <el-input v-model="search" size="mini" placeholder="输入关键字搜索" />
                        </template>
                        <template slot-scope="scope">
                            <el-button
                                v-if="user.role >= 50 && scope.row.contribute == '普通' || user.role > 90"
                                size="mini"
                                @click="handleEdit(scope.$index, scope.row)"
                            >更改</el-button>
                            <el-button
                                v-if="user.role >= 50 && scope.row.contribute == '普通' || user.role > 90"
                                size="mini"
                                type="danger"
                                @click="handleDelete(scope.$index, scope.row)"
                            >删除</el-button>
                            <el-button
                                v-if="user.role >= 50 && scope.row.contribute == '普通' || user.role > 90"
                                size="mini"
                                type="primary"
                                @click="handleWrite(scope.$index, scope.row)"
                            >管理</el-button>
                            <el-button
                                v-if="user.role < 90 && scope.row.contribute == '投稿'"
                                size="mini"
                                type="primary"
                                @click="handleWrite(scope.$index, scope.row)"
                            >投稿</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </article>
            <footer>
                <foot-nav></foot-nav>
            </footer>
        </section>
        <el-dialog
            title="新建分类"
            :visible.sync="dialogFormVisible"
            @close="edit = false"
            :close-on-click-modal="false"
        >
            <el-form :model="form">
                <el-form-item label="分类名" :label-width="formLabelWidth">
                    <el-input v-model="form.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="描 述" :label-width="formLabelWidth">
                    <el-input v-model="form.describe" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item v-if="user.role > 90" label="投稿" :label-width="formLabelWidth">
                    <el-radio-group v-model="form.contribute">
                        <el-radio label="普通"></el-radio>
                        <el-radio label="投稿"></el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="缩略图" :label-width="formLabelWidth">
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
            <div slot="footer" class="dialog-footer">
                <el-button @click="resetForm">取 消</el-button>
                <el-button type="primary" @click="submitForm">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="申请" :visible.sync="show">
            <el-form>
                <el-form-item label="留言" label-width="120px">
                    <el-input
                        autocomplete="off"
                        type="textarea"
                        placeholder="请输入留言"
                        v-model="msg"
                        rows="6"
                    >></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="show = false">取 消</el-button>
                <el-button type="primary" @click="apply">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import CompNav from "@/components/CompNav.vue";
import FootNav from "@/components/FootNav.vue";
export default {
    name: "blog-survey",
    components: {
        "comp-nav": CompNav,
        "foot-nav": FootNav
    },
    data() {
        return {
            user: {
                role: 0
            },
            pageSize: 10,
            currentPage: 1,
            data: [],
            tableData: [],
            search: "",
            showImage: false,
            dialogFormVisible: false,
            form: {
                name: "",
                describe: "",
                contribute: "普通",
                image:
                    "https://ahriknow.oss-cn-beijing.aliyuncs.com/default_blog.jpg"
            },
            formLabelWidth: "120px",
            upload_url: this.url + "/api/ahriblog/upload/",
            edit: false,
            loading: {},
            show: false,
            msg: ""
        };
    },
    created() {},
    methods: {
        apply() {
            let self = this;
            this.axios({
                url: self.url + "/api/setting/apply/",
                method: "post",
                data: JSON.stringify({ user_id: self.user._id, name: 'ahriblog', msg: self.msg }),
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(
                function(response) {
                    if (response.data.code === 200) {
                        self.$message({
                            showClose: true,
                            message: "成功提交申请",
                            type: "success"
                        });
                        self.show = false;
                    } else {
                        console.log(response);
                        self.$message({
                            showClose: true,
                            message: "服务器内部错误"
                        });
                    }
                },
                function(response) {
                    console.log(response);
                    self.$message({
                        showClose: true,
                        message: "客户端错误，请求失败"
                    });
                }
            );
        },
        handleEdit(index, row) {
            this.dialogFormVisible = true;
            this.edit = true;
            this.form = row;
        },
        handleDelete(index, row) {
            this.$confirm("确认删除？", "确认:", { type: "error" })
                .then(_ => {
                    let self = this;
                    this.openFullScreen();
                    this.axios
                        .delete(self.url + "/api/ahriblog/category/", {
                            data: {
                                user_id: self.user._id,
                                _id: row._id
                            }
                        })
                        .then(response => {
                            if (response.data.code === 0) {
                                localStorage.removeItem("auth");
                                self.$router.push("/auth/login");
                            } else if (response.data.code === 200) {
                                self.data = self.data.filter(item => {
                                    return item._id != row._id;
                                });
                                self.tableData = this.data.slice(
                                    self.pageSize * (self.currentPage - 1),
                                    self.pageSize * self.currentPage
                                );
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
        },
        handleWrite(index, row) {
            this.$router.push({
                name: "blog-manage",
                params: row,
                query: { name: row.name, _id: row._id }
            });
        },
        handleSizeChange(val) {
            this.tableData = this.data.slice(0, val);
            this.currentPage = 1;
            this.pageSize = val;
            this.handleCurrentChange(1);
        },
        handleCurrentChange(val) {
            this.tableData = this.data.slice(
                this.pageSize * (val - 1),
                this.pageSize * val
            );
        },
        newBook() {
            this.form = {
                name: "",
                describe: "",
                contribute: "普通",
                image:
                    "https://ahriknow.oss-cn-beijing.aliyuncs.com/default_blog.jpg"
            };
            this.dialogFormVisible = true;
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
        submitForm() {
            if (this.edit) {
                if (this.form.name == "") {
                    this.$message({
                        showClose: true,
                        message: "请输入笔记名",
                        type: "warning"
                    });
                    return;
                }
                this.form.user_id = this.user._id;
                let self = this;
                this.openFullScreen();
                this.axios
                    .put(self.url + "/api/ahriblog/category/", self.form)
                    .then(response => {
                        if (response.data.code === 0) {
                            localStorage.removeItem("auth");
                            self.$router.push("/auth/login");
                        } else if (response.data.code === 200) {
                            self.data.forEach(item => {
                                if (item._id == response.data.data._id) {
                                    item.name = response.data.data.name;
                                    item.data = response.data.data.data;
                                    item.describe = response.data.data.describe;
                                    item.image = response.data.data.image;
                                    item.contribute =
                                        response.data.data.contribute;
                                }
                            });
                            self.$message({
                                showClose: true,
                                message: "更改成功",
                                type: "success"
                            });
                            self.form = {
                                name: "",
                                describe: "",
                                contribute: "普通",
                                image:
                                    "https://ahriknow.oss-cn-beijing.aliyuncs.com/default_blog.jpg"
                            };
                            self.dialogFormVisible = false;
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
            } else {
                if (this.form.name == "") {
                    this.$message({
                        showClose: true,
                        message: "请输入笔记名",
                        type: "warning"
                    });
                    return;
                }
                let self = this;
                this.openFullScreen();
                this.form.user_id = this.user._id;
                this.axios({
                    url: self.url + "/api/ahriblog/category/",
                    method: "post",
                    data: JSON.stringify(self.form),
                    headers: {
                        "Content-Type": "application/json"
                    }
                }).then(
                    function(response) {
                        if (response.data.code === 200) {
                            response.data.data.username = self.user.username;
                            self.data.push(response.data.data);
                            self.handleSizeChange(self.pageSize);
                            self.currentPage = Math.ceil(
                                self.data.length / self.pageSize
                            );
                            self.handleCurrentChange(self.currentPage);
                            self.$message({
                                showClose: true,
                                message: "添加成功",
                                type: "success"
                            });
                            self.form = {
                                name: "",
                                describe: "",
                                contribute: "普通",
                                image:
                                    "https://ahriknow.oss-cn-beijing.aliyuncs.com/default_blog.jpg"
                            };
                            self.dialogFormVisible = false;
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
            }
        },
        resetForm() {
            this.form = {
                name: "",
                describe: "",
                private: "公开",
                image:
                    "https://ahriknow.oss-cn-beijing.aliyuncs.com/default_blog.jpg"
            };
            this.dialogFormVisible = false;
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
        let self = this;
        this.openFullScreen();
        this.axios
            .get(self.url + "/api/ahriblog/category/", {
                params: {
                    user_id: self.user._id,
                    role: self.user.role
                }
            })
            .then(response => {
                if (response.data.code === 0) {
                    localStorage.removeItem("auth");
                    self.$router.push("/auth/login");
                } else if (response.data.code === 200) {
                    self.data = response.data.data;
                    self.handleSizeChange(10);
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
    beforeRouteLeave(to, from, next) {
        try {
            this.loading.close();
        } catch {}
        next();
    }
};
</script>

<style lang="scss" scoped>
#blog-survey {
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
        min-width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }
    .avatar {
        width: 178px;
        display: block;
    }
    height: 100%;
    overflow: hidden;
    section {
        z-index: 10;
        width: 100%;
        height: 100%;
        padding-top: 90px;
        overflow-y: scroll;
        article {
            min-height: 100%;
            padding: 30px 50px 100px 50px;
            .pagination {
                display: flex;
                justify-content: flex-end;
                padding: 20px 0;
                button {
                    margin-left: 20px;
                }
            }
        }
        footer {
            width: 100%;
            height: 60px;
            margin-top: -60px;
        }
    }
}
</style>