<template>
    <div id="notebook-book" class="notebook-book">
        <comp-nav></comp-nav>
        <section>
            <article>
                <div class="pagination nocopy">
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
                    <el-button type="primary" size="mini" @click="newBook">新建笔记</el-button>
                </div>

                <el-table
                    :data="tableData.filter(data => !search || data.name.includes(search.toLowerCase()))"
                    style="width: 100%"
                    border
                    highlight-current-row
                    :default-sort="{prop: 'date', order: 'descending'}"
                >
                    <el-table-column label="Name" prop="name"></el-table-column>
                    <el-table-column label="Date" prop="date" sortable></el-table-column>
                    <el-table-column label="Describe" prop="describe"></el-table-column>
                    <el-table-column label="Private" prop="private"></el-table-column>
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
                    <el-table-column align="right" width="240">
                        <template slot="header" slot-scope="scope">
                            <el-input v-model="search" size="mini" placeholder="输入关键字搜索" />
                        </template>
                        <template slot-scope="scope">
                            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">Edit</el-button>
                            <el-button
                                size="mini"
                                type="danger"
                                @click="handleDelete(scope.$index, scope.row)"
                            >Delete</el-button>
                            <el-button
                                size="mini"
                                type="primary"
                                @click="handleWrite(scope.$index, scope.row)"
                            >Write</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </article>
            <footer class="nocopy">
                <router-link to="/admin">Home</router-link>&nbsp;|&nbsp;
                <router-link to="/auth/login">Sign in</router-link>&nbsp;|&nbsp;
                <router-link to="/auth/register">Sign up</router-link>&nbsp;|&nbsp;
                <router-link to="/ahridata/survey">AhriData</router-link>&nbsp;|&nbsp;
                <router-link to="/blog/survey">Ahriblog</router-link>&nbsp;|&nbsp;
                <router-link to="/notebook/book">Notebook</router-link>&nbsp;|&nbsp;
                <router-link to="/transfer/galaxy">Transfer</router-link>
            </footer>
        </section>
        <el-dialog
            title="新建笔记"
            :visible.sync="dialogFormVisible"
            @close="edit = false"
            :close-on-click-modal="false"
        >
            <el-form :model="form">
                <el-form-item label="笔记名" :label-width="formLabelWidth">
                    <el-input v-model="form.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="描 述" :label-width="formLabelWidth">
                    <el-input v-model="form.describe" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="公 开" :label-width="formLabelWidth">
                    <el-radio-group v-model="form.private">
                        <el-radio label="公开"></el-radio>
                        <el-radio label="私有"></el-radio>
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
    </div>
</template>

<script>
import CompNav from '@/components/CompNav.vue'
export default {
    name: "notebook-book",
    components: {
        "comp-nav": CompNav
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
                private: "公开",
                image: ""
            },
            formLabelWidth: "120px",
            upload_url: this.url + "/api/notebook/upload/",
            edit: false,
            loading: {}
        };
    },
    created() {},
    methods: {
        handleEdit(index, row) {
            this.dialogFormVisible = true;
            this.edit = true;
            this.form = {
                _id: row._id,
                name: row.name,
                describe: row.describe,
                private: row.private,
                image: row.image
            };
        },
        handleDelete(index, row) {
            this.$confirm("确认删除？", "确认:", { type: "error" })
                .then(_ => {
                    let self = this;
                    this.openFullScreen();
                    this.axios
                        .delete(self.url + "/api/notebook/book/", {
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
            localStorage.setItem("book", JSON.stringify(row));
            this.$router.push({ name: "notebook-document", params: row });
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
                    .put(self.url + "/api/notebook/book/", self.form)
                    .then(response => {
                        if (response.data.code === 0) {
                            localStorage.removeItem("auth");
                            self.$router.push("/auth/login");
                        } else if (response.data.code === 200) {
                            this.form = {
                                name: "",
                                describe: "",
                                private: "公开",
                                image: ""
                            };
                            self.data.forEach(item => {
                                if (item._id == response.data.data._id) {
                                    item.name = response.data.data.name;
                                    item.data = response.data.data.data;
                                    item.describe = response.data.data.describe;
                                    item.image = response.data.data.image;
                                    item.private = response.data.data.private;
                                }
                            });
                            self.$message({
                                showClose: true,
                                message: "更改成功",
                                type: "success"
                            });
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
                    url: self.url + "/api/notebook/book/",
                    method: "post",
                    data: JSON.stringify(self.form),
                    headers: {
                        "Content-Type": "application/json"
                    }
                }).then(
                    function(response) {
                        if (response.data.code === 200) {
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
                                private: "公开",
                                image: ""
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
                image: ""
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
            .get(self.url + "/api/notebook/book/", {
                params: {
                    user_id: self.user._id
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
#notebook-book {
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
            background: #eee;
            margin-top: -60px;
            line-height: 60px;
            text-align: center;
            a {
                font-size: 14px;
                color: #2c3e50;
                &.router-link-exact-active {
                    color: #42b983;
                }
            }
        }
    }
}
</style>