<template>
    <div id="restful-survey" class="restful-survey">
        <comp-nav active="/restful/survey"></comp-nav>
        <section>
            <article>
                <div class="document">
                    <a v-if="document != ''" :href="document" target="_black">参考文档</a>
                </div>
                <br />
                <el-card class="box-card">
                    <div class="opera">
                        <el-input placeholder="请输入要搜索的项目名" v-model="filter" clearable></el-input>
                        <el-button type="primary" @click="new_project">新建项目</el-button>
                    </div>
                    <div class="project">
                        <div class="access" style="font-size: 18px;font-weight: 700">Access</div>
                        <div class="name" style="font-size: 18px;font-weight: 700">Name</div>
                        <div class="desc" style="font-size: 18px;font-weight: 700">Describe</div>
                        <div class="date" style="font-size: 18px;font-weight: 700">Date</div>
                        <div
                            class="user"
                            style="font-size: 18px;font-weight: 700"
                            v-if="user.role > 90"
                        >User</div>
                        <div class="btn"></div>
                    </div>
                    <div
                        class="project"
                        v-for="i in project.filter(item => !filter || item.name.includes(filter))"
                    >
                        <div class="access">{{ i._id }}</div>
                        <div class="name">{{ i.name }}</div>
                        <div class="desc">{{ i.desc }}</div>
                        <div class="date">{{ i.date }}</div>
                        <div class="user" v-if="user.role > 90">{{ i.username }}</div>
                        <div class="btn">
                            <el-button type="text" @click="delete_project(i._id)">删除</el-button>
                            <el-button type="text" @click="manage_project(i._id)">管理</el-button>
                        </div>
                    </div>
                </el-card>
            </article>
            <footer>
                <foot-nav></foot-nav>
            </footer>
        </section>
        <el-dialog
            title="新建项目"
            :visible.sync="dialogFormVisible"
            @close="close"
            :close-on-click-modal="false"
        >
            <el-form :model="form">
                <el-form-item label="项目名" label-width="120px">
                    <el-input v-model="form.name" autocomplete="off" placeholder="Project Name"></el-input>
                </el-form-item>
                <el-form-item label="项目描述" label-width="120px">
                    <el-input type="textarea" v-model="form.desc" placeholder="Project Describe"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="add_project">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import CompNav from "@/components/CompNav.vue";
import FootNav from "@/components/FootNav.vue";
export default {
    name: "restful-survey",
    components: {
        "comp-nav": CompNav,
        "foot-nav": FootNav
    },
    data() {
        return {
            user: {
                role: 0
            },
            dialogFormVisible: false,
            form: {
                name: "",
                desc: ""
            },
            filter: "",
            project: [],
            document: "",
            loading: {}
        };
    },
    created() {},
    methods: {
        openFullScreen() {
            this.loading = this.$loading({
                lock: true,
                text: "Loading。。。",
                spinner: "el-icon-loading",
                background: "rgba(0, 0, 0, 0.7)"
            });
        },
        new_project() {
            this.dialogFormVisible = true;
        },
        close() {
            this.form = {
                name: "",
                desc: ""
            };
        },
        add_project() {
            let self = this;
            this.openFullScreen();
            this.form.user_id = this.user._id;
            this.form.username = this.user.username;
            this.axios({
                url: self.url + "/api/restful/project/",
                method: "post",
                data: JSON.stringify(self.form),
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(
                function(response) {
                    if (response.data.code === 200) {
                        response.data.data.username = self.user.username;
                        self.project.push(response.data.data);
                        self.$message({
                            showClose: true,
                            message: "项目创建成功",
                            type: "success"
                        });
                        self.dialogFormVisible = false;
                    } else if (response.data.code === 400) {
                        self.$message({
                            showClose: true,
                            message: "项目名重复",
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
        },
        delete_project(_id) {
            this.$confirm("确认删除？", "确认:", { type: "error" })
                .then(_ => {
                    let self = this;
                    this.openFullScreen();
                    this.axios
                        .delete(self.url + "/api/restful/project/", {
                            data: {
                                user_id: self.user._id,
                                _id: _id
                            }
                        })
                        .then(response => {
                            if (response.data.code === 0) {
                                localStorage.removeItem("auth");
                                self.$router.push("/auth/login");
                            } else if (response.data.code === 200) {
                                self.project = self.project.filter(item => {
                                    return item._id != _id;
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
        },
        manage_project(_id) {
            this.$router.push({ name: "restful-api", query: { _id: _id } });
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
            .get(self.url + "/api/restful/project/", {
                params: {
                    user_id: self.user._id
                }
            })
            .then(response => {
                if (response.data.code === 0) {
                    localStorage.removeItem("auth");
                    self.$router.push("/auth/login");
                } else if (response.data.code === 200) {
                    self.project = response.data.data;
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
        this.openFullScreen();
        this.axios
            .get(self.url + "/api/setting/document/", {
                params: {
                    user_id: self.user._id,
                    who: 3
                }
            })
            .then(response => {
                if (response.data.code === 0) {
                    localStorage.removeItem("auth");
                    self.$router.push("/auth/login");
                } else if (response.data.code === 200) {
                    self.document = response.data.data.url;
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
    }
};
</script>

<style lang="scss" scoped>
#restful-survey {
    height: 100%;
    overflow: hidden;
    nav {
        z-index: 100;
        width: 100%;
        height: 80px;
        background: #fff;
        box-shadow: #999 0 0 4px;
        position: fixed;
        top: 0;
        left: 0;
        line-height: 80px;
        padding: 0 30px;
        a {
            font-weight: bold;
            color: #2c3e50;
            &.router-link-exact-active {
                color: #42b983;
            }
        }
    }
    section {
        z-index: 10;
        width: 100%;
        height: 100%;
        padding-top: 90px;
        overflow-y: scroll;
        article {
            min-height: 100%;
            padding: 30px 50px 100px 50px;
            .box-card {
                width: 1200px;
                margin: 0 auto;
                .opera {
                    display: flex;
                    margin: 15px 0;
                    .el-button {
                        margin-left: 15px;
                    }
                }
                .project {
                    display: flex;
                    justify-content: space-between;
                    height: 60px;
                    line-height: 60px;
                    .access {
                        width: 350px;
                        overflow: hidden;
                    }
                    .name {
                        width: 200px;
                        overflow: hidden;
                    }
                    .desc {
                        width: 600px;
                        overflow: hidden;
                    }
                    .date {
                        width: 300px;
                    }
                    .user {
                        width: 140px;
                    }
                    .btn {
                        width: 150px;
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
}
</style>