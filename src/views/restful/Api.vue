<template>
    <div id="restful-api" class="restful-api">
        <section>
            <div class="panel">
                <div class="opera">
                    <el-button icon="el-icon-back" @click="goBack"></el-button>
                    <el-input placeholder="请输入要搜索的 Api" v-model="search" clearable></el-input>
                    <el-select v-model="method" placeholder="过滤">
                        <el-option label="全部请求方式" value></el-option>
                        <el-option label="GET" value="GET"></el-option>
                        <el-option label="POST" value="POST"></el-option>
                        <el-option label="PUT" value="PUT"></el-option>
                        <el-option label="DELETE" value="DELETE"></el-option>
                    </el-select>&nbsp;&nbsp;
                    <el-button type="primary" @click="new_api" style="height: 40px">新建接口</el-button>
                </div>
                <div class="btn">
                    <div class="url">
                        <el-tooltip class="item" effect="dark" placement="bottom">
                            <div slot="content">
                                <el-tag
                                    type="success"
                                    style="font-size: 20px"
                                >HTTPS 请求地址: https://aaahri.com/restful/api/{{ $route.query._id }}/&nbsp;${api}&nbsp;/&nbsp;</el-tag>
                                <el-tag type="info" style="font-size: 20px">[必须以&nbsp;/&nbsp;结尾]</el-tag>
                                <br />
                                <el-tag
                                    type="success"
                                    style="font-size: 20px"
                                >HTTP 请求地址: http://api.aaahri.com/restful/api/{{ $route.query._id }}/&nbsp;${api}&nbsp;/</el-tag>
                                <el-tag type="info" style="font-size: 20px">[必须以&nbsp;/&nbsp;结尾]</el-tag>
                                <br />

                                <el-tag type="success" style="font-size: 18px">
                                    <div
                                        style="text-align: left"
                                    >POST: "Content-type": "application/x-www-form-urlencoded"、"Content-type": "application/json"</div>
                                </el-tag>
                                <br />
                                <el-tag type="success" style="font-size: 18px">
                                    <div
                                        style="text-align: left"
                                    >PUT、DELETE: "Content-type": "application/x-www-form-urlencoded"</div>
                                </el-tag>
                            </div>
                            <el-tag type="warning" style="font-size: 18px">注意</el-tag>
                        </el-tooltip>
                    </div>
                </div>
                <el-table
                    :data="apis.filter(item => (!search || item.api.includes(search))&&(!method || item.method==method))"
                    style="width: 100%"
                    :default-sort="{prop: 'date', order: 'descending'}"
                >
                    <el-table-column type="expand">
                        <template slot-scope="props">
                            <div class="info receive">
                                <div class="title">Receive</div>
                                <div class="container">
                                    <div class="variable" v-for="i in props.row.receive">
                                        <el-input class="name" v-model="i.name"></el-input>
                                        <el-select class="type" v-model="i.type" placeholder="变量类型">
                                            <el-option label="String" value="string"></el-option>
                                            <el-option label="Number" value="number"></el-option>
                                            <el-option label="Boolen" value="bool"></el-option>
                                            <el-option
                                                v-if="props.row.method != 'GET'"
                                                label="JSON"
                                                value="json"
                                            ></el-option>
                                        </el-select>&nbsp;
                                        <el-button @click="removeAaary(props.row.receive, i)">删除</el-button>
                                    </div>
                                    <el-button @click="add_variable(props.row.receive)">添加参数</el-button>
                                </div>
                            </div>
                            <br />
                            <div class="info handle">
                                <div class="title">Handle</div>
                                <div class="container">
                                    <el-button @click="add_opera(props.row.handle)">添加操作</el-button>
                                    <br />
                                    <el-card
                                        class="box-card"
                                        v-for="i in props.row.handle"
                                        style="margin: 10px;"
                                    >
                                        <el-select v-model="i.op" placeholder="请选择">
                                            <el-option label="选择数据池" value="o1"></el-option>
                                            <el-option label="类型转换" value="o2"></el-option>
                                        </el-select>
                                        <el-select
                                            v-show="i.op == 'o1'"
                                            v-model="i.dc"
                                            placeholder="请选择数据集"
                                        >
                                            <el-option
                                                v-for="i in dcs"
                                                :key="i._id"
                                                :value="i._id+'.'+i.datapool"
                                                :label="i.name+' ---- '+i.dp_name"
                                            >
                                                <span style="float: left">{{ i.name }}</span>
                                                <span
                                                    style="float: right; color: #8492a6; font-size: 13px"
                                                >{{ i.dp_name }}</span>
                                            </el-option>
                                        </el-select>
                                        <dir v-show="i.op == 'o1'">+-*/</dir>
                                        <dir v-show="i.op == 'o2'">to</dir>
                                    </el-card>
                                </div>
                            </div>
                            <br />
                            <div class="info return">
                                <div class="title">Return</div>
                                <div class="container">
                                    <div class="select">
                                        <el-select
                                            v-model="props.row.return.type"
                                            placeholder="返回值类型"
                                        >
                                            <el-option label="String" value="string">
                                                <span style="float: left">String</span>
                                                <span
                                                    style="float: right; color: #8492a6; font-size: 13px"
                                                >自定义</span>
                                            </el-option>
                                            <el-option label="JSON" value="json">
                                                <span style="float: left">JSON</span>
                                                <span
                                                    style="float: right; color: #8492a6; font-size: 13px"
                                                >自定义</span>
                                            </el-option>
                                            <el-option
                                                v-for="i in props.row.handle.variable"
                                                :label="i"
                                                :value="i"
                                            >
                                                <span style="float: left">{{ i }}</span>
                                                <span
                                                    style="float: right; color: #8492a6; font-size: 13px"
                                                >变量</span>
                                            </el-option>
                                        </el-select>
                                    </div>
                                    <div
                                        class="data"
                                        v-show="props.row.return.type == 'string' || props.row.return.type == 'json'"
                                    >
                                        <el-input
                                            type="textarea"
                                            :rows="4"
                                            placeholder="Return data"
                                            v-model="props.row.return.data"
                                        ></el-input>
                                    </div>
                                </div>
                            </div>
                            <div class="btn">
                                <div></div>
                                <el-button type="primary" @click="update_api(props.row)">保存</el-button>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="Api" prop="api"></el-table-column>
                    <el-table-column label="Method" prop="method" sortable></el-table-column>
                    <el-table-column label="Date" prop="date"></el-table-column>
                    <el-table-column label="Delete" prop="date">
                        <template slot-scope="scope">
                            <el-button type="text" @click="handleDelete(scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </section>
        <footer>
            <foot-nav></foot-nav>
        </footer>
        <el-dialog
            title="新建接口"
            :visible.sync="dialogFormVisible"
            @close="close"
            :close-on-click-modal="false"
        >
            <el-form :model="form">
                <el-form-item label="Api" label-width="120px">
                    <el-input v-model="form.api" autocomplete="off" placeholder="Api"></el-input>
                </el-form-item>
                <el-form-item label="Method" label-width="120px">
                    <el-select v-model="form.method" placeholder="Method">
                        <el-option label="GET" value="GET"></el-option>
                        <el-option label="POST" value="POST"></el-option>
                        <el-option label="PUT" value="PUT"></el-option>
                        <el-option label="DELETE" value="DELETE"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="add_api">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import FootNav from "@/components/FootNav.vue";
export default {
    name: "restful-api",
    components: {
        "foot-nav": FootNav
    },
    data() {
        return {
            user: {
                role: 0
            },
            dialogFormVisible: false,
            form: {
                api: "/",
                method: "GET"
            },
            search: "",
            method: "",
            apis: [],
            dcs: []
        };
    },
    created() {},
    methods: {
        add_opera(val) {
            val.push({
                op: "",
                dc: "",
                transfor: []
            });
        },
        goBack() {
            this.$router.push({ name: "restful" });
        },
        openFullScreen() {
            this.loading = this.$loading({
                lock: true,
                text: "Loading。。。",
                spinner: "el-icon-loading",
                background: "rgba(0, 0, 0, 0.7)"
            });
        },
        removeAaary(_arr, _obj) {
            var length = _arr.length;
            for (var i = 0; i < length; i++) {
                if (_arr[i] == _obj) {
                    if (i == 0) {
                        _arr.shift(); //删除并返回数组的第一个元素
                        return _arr;
                    } else if (i == length - 1) {
                        _arr.pop(); //删除并返回数组的最后一个元素
                        return _arr;
                    } else {
                        _arr.splice(i, 1); //删除下标为i的元素
                        return _arr;
                    }
                }
            }
        },
        add_variable(val) {
            val.push({
                name: "variableName",
                type: "string"
            });
        },
        close() {
            this.form = {
                api: "/",
                method: "GET",
                receive: [],
                return: {}
            };
        },
        new_api() {
            this.dialogFormVisible = true;
        },
        add_api() {
            let self = this;
            this.openFullScreen();
            this.form.user_id = this.user._id;
            this.form.project = this.$route.query._id;
            this.axios({
                url: self.url + "/api/restful/api/",
                method: "post",
                data: JSON.stringify(self.form),
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(
                function(response) {
                    if (response.data.code === 200) {
                        self.apis.push(response.data.data);
                        self.$message({
                            showClose: true,
                            message: "Api 创建成功",
                            type: "success"
                        });
                        self.dialogFormVisible = false;
                    } else if (response.data.code === 400) {
                        self.$message({
                            showClose: true,
                            message: "Api 重复",
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
        update_api(val) {
            console.log(val);
            let self = this;
            this.openFullScreen();
            this.axios
                .put(self.url + "/api/restful/api/", {
                    user_id: self.user._id,
                    data: val
                })
                .then(response => {
                    if (response.data.code === 0) {
                        localStorage.removeItem("auth");
                        self.$router.push("/auth/login");
                    } else if (response.data.code === 200) {
                        self.$message({
                            showClose: true,
                            message: "更新成功",
                            type: "success"
                        });
                    } else if (response.data.code === 400) {
                        self.$message.error("返回数据格式错误，应为 JSON");
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
        handleDelete(val) {
            this.$confirm("确认删除？", "确认:", { type: "error" })
                .then(_ => {
                    let self = this;
                    this.openFullScreen();
                    this.axios
                        .delete(self.url + "/api/restful/api/", {
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
                                self.apis = self.apis.filter(api => {
                                    return api._id != val._id;
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
        }
    },
    mounted() {
        if (!this.$route.query.hasOwnProperty("_id")) {
            this.goBack();
        }
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
            .get(self.url + "/api/restful/api/", {
                params: {
                    user_id: self.user._id,
                    project: this.$route.query._id
                }
            })
            .then(response => {
                if (response.data.code === 0) {
                    localStorage.removeItem("auth");
                    self.$router.push("/auth/login");
                } else if (response.data.code === 200) {
                    self.apis = response.data.data;
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
        this.axios
            .get(self.url + "/api/restful/dp/", {
                params: {
                    user_id: self.user._id
                }
            })
            .then(response => {
                if (response.data.code === 0) {
                    localStorage.removeItem("auth");
                    self.$router.push("/auth/login");
                } else if (response.data.code === 200) {
                    self.dcs = response.data.data;
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
#restful-api {
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
                display: flex;
                padding: 15px 0;
                justify-content: space-between;
                .el-input {
                    margin: 0 10px;
                }
                button {
                    margin-right: 10px;
                }
            }
            .btn {
                display: flex;
                justify-content: space-between;
                .url {
                    font-size: 20px;
                    text-align: left;
                }
            }
            .demo-table-expand {
                font-size: 0;
            }
            .demo-table-expand label {
                width: 90px;
                color: #99a9bf;
            }
            .demo-table-expand .el-form-item {
                margin-right: 0;
                margin-bottom: 0;
                width: 50%;
            }
            .info {
                display: flex;
                .title {
                    font-size: 18px;
                    font-weight: bold;
                    margin: 10px;
                    width: 120px;
                }
            }
            .receive {
                display: flex;
                .title {
                    font-size: 18px;
                    font-weight: bold;
                    margin: 10px;
                    width: 120px;
                }
                .container {
                    flex: 1;
                    .variable {
                        display: flex;
                        margin: 5px 0;
                        .name {
                            width: 200px;
                            margin-right: 5px;
                        }
                    }
                }
            }
            .return {
                .container {
                    flex: 1;
                    .data {
                        margin: 10px 0;
                    }
                }
            }
            .btn {
                text-align: right;
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