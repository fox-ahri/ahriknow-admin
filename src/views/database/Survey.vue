<template>
    <div id="database-survey" class="database-survey">
        <comp-nav active="/database/survey"></comp-nav>
        <section>
            <article>
                <el-tabs type="border-card" v-model="name">
                    <el-tab-pane name="mongo">
                        <span slot="label" class="nocopy">
                            <i class="iconfont akMongoDB"></i> Mongo
                        </span>
                        <div class="mongo">
                            <el-button type="text" @click="createMongo('mongo')">新建</el-button>
                            <div class="db" v-for="i in mongo">
                                <div class="name">{{ i.name }}</div>
                                <div class="desc">{{ i.desc }}</div>
                                <div class="username">{{ i.username }}</div>
                                <div class="password">{{ i.password }}</div>
                                <div class="delete">
                                    <el-button type="text" @click="deleteDB(i._id, 'mongo')">删除</el-button>
                                    <el-button type="text" @click="manage('mongo', i)">管理</el-button>
                                </div>
                            </div>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane name="mysql">
                        <span slot="label" class="nocopy">
                            <i class="iconfont akMySQL"></i> Mysql
                        </span>
                        <div class="mysql">
                            <el-button type="text" @click="createMongo('mysql')">新建</el-button>
                            <div class="db" v-for="i in mysql">
                                <div class="name">{{ i.name }}</div>
                                <div class="desc">{{ i.desc }}</div>
                                <div class="username">{{ i.username }}</div>
                                <div class="password">{{ i.password }}</div>
                                <div class="delete">
                                    <el-button type="text" @click="deleteDB(i._id, 'mysql')">删除</el-button>
                                    <el-button type="text" @click="manage('mysql', i)">管理</el-button>
                                </div>
                            </div>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane name="redis">
                        <span slot="label" class="nocopy">
                            <i class="iconfont akRedis"></i> Redis
                        </span>
                        <div class="opera">未开放...</div>
                    </el-tab-pane>
                </el-tabs>
            </article>
            <footer class="nocopy">
                <router-link to="/admin">Home</router-link>&nbsp;|&nbsp;
                <router-link to="/ahridata/survey">AhriData</router-link>&nbsp;|&nbsp;
                <router-link to="/blog/survey">Ahriblog</router-link>&nbsp;|&nbsp;
                <router-link to="/notebook/book">Notebook</router-link>&nbsp;|&nbsp;
                <router-link to="/database/survey">Database</router-link>&nbsp;|&nbsp;
                <router-link to="/transfer/galaxy">Transfer</router-link>
            </footer>
        </section>
        <el-dialog
            title="新建数据库"
            :visible.sync="dialogFormVisible"
            @close="close"
            :close-on-click-modal="false"
        >
            <el-form :model="form" label-width="80px">
                <el-form-item label="数据库名">
                    <el-input v-model="form.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="简介">
                    <el-input v-model="form.desc" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="用户名">
                    <el-input v-model="form.user" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="密码">
                    <el-input v-model="form.pass" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="create">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import CompNav from "@/components/CompNav.vue";
export default {
    name: "database-survey",
    components: {
        "comp-nav": CompNav
    },
    data() {
        return {
            user: {
                role: 0
            },
            dialogFormVisible: false,
            form: {
                name: "",
                desc: "",
                user: "",
                pass: ""
            },
            mongo: [],
            mysql: [],
            name: "mongo"
        };
    },
    methods: {
        close() {
            this.form = {
                name: "",
                desc: "",
                user: "",
                pass: ""
            };
        },
        createMongo(val) {
            this.form.type = val;
            this.form.user_id = this.user._id;
            this.dialogFormVisible = true;
        },
        manage(type, val) {
            if (type == "mongo") {
                this.$router.push({ name: "dbm-mongo-auth", params: val });
            } else {
                this.$router.push({ name: "dbm-mysql-auth", params: val });
            }
        },
        deleteDB(_id, type) {
            this.$confirm("确认删除？", "确认:", { type: "error" })
                .then(_ => {
                    let path = "";
                    if (type == "mongo") {
                        path = this.url + "/api/database/mongo/";
                    } else {
                        path = this.url + "/api/database/mysql/";
                    }
                    let self = this;
                    this.axios
                        .delete(path, {
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
                                if (type == "mongo") {
                                    self.mongo = self.mongo.filter(item => {
                                        return item._id != _id;
                                    });
                                } else {
                                    self.mysql = self.mysql.filter(item => {
                                        return item._id != _id;
                                    });
                                }
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
                        })
                        .catch(response => {
                            console.log(response);
                            self.$message({
                                showClose: true,
                                message: "客户端错误，请求失败"
                            });
                        });
                })
                .catch(_ => {
                    this.$message({
                        showClose: true,
                        message: "取消删除"
                    });
                });
        },
        create() {
            let path = "";
            if (this.form.type == "mongo") {
                path = this.url + "/api/database/mongo/";
            } else {
                path = this.url + "/api/database/mysql/";
            }
            let self = this;
            this.axios({
                url: path,
                method: "post",
                data: JSON.stringify(this.form),
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(
                function(response) {
                    if (response.data.code === 0) {
                        localStorage.removeItem("auth");
                        self.$router.push("/auth/login");
                    } else if (response.data.code === 200) {
                        if (self.form.type == "mongo") {
                            self.mongo.push({
                                _id: response.data.data._id,
                                name: self.form.name,
                                desc: self.form.desc,
                                username: self.form.user,
                                password: self.form.pass,
                                closed: false
                            });
                        } else {
                            self.mysql.push({
                                _id: response.data.data._id,
                                name: self.form.name,
                                desc: self.form.desc,
                                username: self.form.user,
                                password: self.form.pass,
                                closed: false
                            });
                        }
                        self.$message({
                            showClose: true,
                            message: "创建成功",
                            type: "success"
                        });
                        self.dialogFormVisible = false;
                    } else if (response.data.code === 400) {
                        self.$message({
                            type: "warning",
                            showClose: true,
                            message: "数据库重复"
                        });
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
        getData(val) {
            let path = "";
            if (val == "mongo") {
                path = this.url + "/api/database/mongo/";
            } else {
                path = this.url + "/api/database/mysql/";
            }
            let self = this;
            this.axios
                .get(path, {
                    params: {
                        user_id: self.user._id
                    }
                })
                .then(response => {
                    if (response.data.code === 0) {
                        localStorage.removeItem("auth");
                        self.$router.push("/auth/login");
                    } else if (response.data.code === 200) {
                        if (val == "mongo") {
                            self.mongo = response.data.data;
                        } else {
                            self.mysql = response.data.data;
                        }
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
        this.name = this.$route.query.db || "mongo";
        this.getData("mongo");
        this.getData("mysql");
    }
};
</script>

<style lang="scss" scoped>
#database-survey {
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
            .mongo,
            .mysql {
                .db {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    cursor: pointer;
                    padding: 0 20px;
                    margin: 15px 50px;
                    box-shadow: #ccc 0 0 8px;
                    height: 50px;
                    &:hover {
                        box-shadow: #ccc 0 0 12px;
                    }
                    div {
                        overflow: hidden;
                    }
                    .name {
                        width: 200px;
                    }
                    .desc {
                        width: 300px;
                        overflow: hidden;
                    }
                    .username,
                    .password {
                        width: 120px;
                    }
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