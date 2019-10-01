<template>
    <div id="ahridata-collection" class="ahridata-collection">
        <section>
            <div class="panel">
                <div class="title">
                    <div>
                        <span class="name">Data Pool: {{ params.dp.name }}</span>&nbsp;&nbsp;&nbsp;&nbsp;
                        <span
                            class="name"
                        >Data Collection: {{ params.col.name }}</span>
                    </div>
                    <span class="pagination">
                        <el-pagination
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page="currentPage"
                            :page-sizes="[5, 10, 20, 50]"
                            :page-size="pageSize"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="data.length"
                            background
                        ></el-pagination>
                        <el-button type="primary" size="mini" @click="addDocument">添加记录</el-button>
                    </span>
                </div>
                <div class="opera">
                    <el-button icon="el-icon-back" @click="goBack"></el-button>
                    <el-select v-model="name" clearable placeholder="请选择字段名">
                        <el-option
                            v-for="(v, k) in tableData[0]"
                            v-if="k != 'adata-datapool' && k != 'adata-password' && k != '_id'"
                            :key="k"
                            :label="k"
                            :value="k"
                        ></el-option>
                    </el-select>
                    <el-input placeholder="请输入搜索内容" v-model="search" clearable></el-input>
                </div>
                <div class="collection">
                    <el-table
                        :data="tableData.filter(data => !search || !name || data[name] === true || data[name] === false || data[name].includes(this.search)?true:false)"
                        border
                        style="width: 100%"
                    >
                        <el-table-column fixed prop="_id" label="_id" width="210"></el-table-column>
                        <el-table-column
                            v-for="i in params.col.columns"
                            :prop="i.name"
                            :label="i.name + ' (' + i.type + ')'"
                            :formatter="formatBoolean"
                            min-width="160"
                        ></el-table-column>
                        <el-table-column fixed="right" label="操作" width="100">
                            <template slot-scope="scope">
                                <el-button
                                    @click="handleClick(scope.row)"
                                    type="text"
                                    size="small"
                                >编辑</el-button>
                                <el-button
                                    type="text"
                                    size="small"
                                    @click="handleDelete(scope.row)"
                                >删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <br />
                <br />
                <div class="newList">
                    <el-input
                        placeholder="请输入列名"
                        v-model="newColumn.name"
                        class="input-with-select"
                    >
                        <div class="div" slot="prepend">
                            <el-select
                                style="width: 160px;margin-right:26px;border-right: #ccc solid 1px"
                                v-model="newColumn.column"
                                placeholder="请选择插入位置"
                            >
                                <el-option label="在 _id 后插入" value="_id"></el-option>
                                <el-option
                                    v-for="i in params.col.columns"
                                    :label="'在 ' + i.name + ' 后插入'"
                                    :value="i.name"
                                ></el-option>
                            </el-select>
                            <el-select
                                style="width: 160px"
                                v-model="newColumn.type"
                                placeholder="请选择类型"
                            >
                                <el-option label="int 类型" value="int"></el-option>
                                <el-option label="string 类型" value="string"></el-option>
                                <el-option label="boolen 类型" value="boolen"></el-option>
                                <el-option label="number 类型" value="number"></el-option>
                            </el-select>
                        </div>
                        <div slot="append" class="div">
                            <el-button
                                style="margin-right: 20px;border-right: #ccc solid 1px"
                                icon="el-icon-check"
                                @click="insert"
                            >提交</el-button>
                            <el-select
                                style="width: 200px;margin-right:24px;border-right: #ccc solid 1px"
                                v-model="delColumn"
                                placeholder="请选要删除的列"
                            >
                                <el-option
                                    v-for="i in params.col.columns"
                                    :label="'删除 ' + i.name + ' 列'"
                                    :value="i.name"
                                ></el-option>
                            </el-select>
                            <el-button slot="append" icon="el-icon-check" @click="deleteColumn">删除</el-button>
                        </div>
                    </el-input>
                </div>
            </div>
        </section>
        <footer class="nocopy">
            <router-link to="/admin">Home</router-link>&nbsp;|&nbsp;
            <router-link to="/auth/login">Sign in</router-link>&nbsp;|&nbsp;
            <router-link to="/auth/register">Sign up</router-link>&nbsp;|&nbsp;
            <router-link to="/ahridata/survey">AhriData</router-link>&nbsp;|&nbsp;
            <router-link to="/notebook/book">Notebook</router-link>
        </footer>
        <el-dialog
            title="添加记录"
            :visible.sync="dialogVisible"
            :close-on-click-modal="false"
            @close="handleCancel"
        >
            <el-form
                :model="dynamicValidateForm"
                ref="dynamicValidateForm"
                label-width="100px"
                class="demo-dynamic"
            >
                <el-form-item
                    v-for="(column, index) in dynamicValidateForm.columns"
                    :label="column.name"
                    :key="column.key"
                >
                    <el-input v-if="column.type != 'boolen'" v-model="column.value"></el-input>
                    <el-radio
                        v-if="column.type == 'boolen'"
                        v-model="column.value"
                        border
                        :label="true"
                    >True</el-radio>
                    <el-radio
                        v-if="column.type == 'boolen'"
                        v-model="column.value"
                        border
                        :label="false"
                    >False</el-radio>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="insertDocument()">提交</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: "ahridata-collection",
    data() {
        return {
            dialogVisible: false,
            delColumn: "",
            name: "",
            search: "",
            pageSize: 5,
            currentPage: 1,
            tableData: [],
            dynamicValidateForm: {
                columns: [
                    {
                        value: ""
                    }
                ]
            },
            newColumn: {
                column: "_id",
                name: "",
                type: "string"
            },
            params: {
                dp: {
                    name: ""
                },
                col: {
                    name: "",
                    columns: []
                }
            },
            data: [],
            edit: false,
            tmp: "",
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
            this.$router.push({ name: "ahridata-survey" });
        },
        handleCancel() {
            this.edit = false;
            this.dialogVisible = false;
        },
        formatBoolean: function(row, column, cellValue) {
            var ret = ""; //你想在页面展示的值
            if (cellValue === true) {
                ret = "true"; //根据自己的需求设定
            } else if (cellValue === false) {
                ret = "false";
            } else ret = cellValue;
            return ret;
        },
        addDocument() {
            this.dynamicValidateForm.columns = JSON.parse(
                JSON.stringify(this.params.col.columns)
            );
            this.dialogVisible = true;
        },
        // isNumber(val) {
        //     var regPos = /^\d+(\.\d+)?$/; //非负浮点数
        //     var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
        //     if (regPos.test(val) || regNeg.test(val)) {
        //         return true;
        //     } else {
        //         return false;
        //     }
        // },
        insertDocument() {
            let tag = true;
            this.dynamicValidateForm.columns.forEach(data => {
                switch (data.type) {
                    case "int":
                        data.value = parseInt(data.value);
                        break;
                    case "string":
                        data.value = data.value || "";
                        break;
                    case "boolen":
                        if (!data.hasOwnProperty("value")) {
                            data.value = null;
                        }
                        break;
                    case "number":
                        data.value = parseFloat(data.value);
                        break;
                    default:
                        break;
                }
                if (!tag) throw new Error("");
            });
            if (tag) {
                if (this.edit) {
                    let self = this;
                    this.openFullScreen();
                    this.axios
                        .put(self.url + "/api/ahridata/datarea/", {
                            user_id: self.user._id,
                            _id: self.params.col._id,
                            col_id: self.tmp,
                            datapool: self.params.dp._id,
                            password: self.params.dp.password,
                            data: self.dynamicValidateForm.columns
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
                                self.getData();
                                self.handleSizeChange(self.pageSize);
                                self.currentPage = Math.ceil(
                                    self.data.length / self.pageSize
                                );
                                self.handleCurrentChange(self.currentPage);
                                self.dialogVisible = false;
                            } else if (response.data.code === 400) {
                                self.$message({
                                    showClose: true,
                                    message: "更改失败",
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
                    let self = this;
                    this.openFullScreen();
                    this.axios({
                        url: self.url + "/api/ahridata/datarea/",
                        method: "post",
                        data: JSON.stringify({
                            user_id: self.user._id,
                            _id: self.params.col._id,
                            datapool: self.params.dp._id,
                            password: self.params.dp.password,
                            data: self.dynamicValidateForm.columns
                        }),
                        headers: {
                            "Content-Type": "application/json"
                        }
                    }).then(
                        function(response) {
                            if (response.data.code === 200) {
                                self.data.push(response.data.data);
                                self.$message({
                                    showClose: true,
                                    message: "添加成功",
                                    type: "success"
                                });
                                self.handleSizeChange(self.pageSize);
                                self.currentPage = Math.ceil(
                                    self.data.length / self.pageSize
                                );
                                self.handleCurrentChange(self.currentPage);
                                self.dialogVisible = false;
                            } else if (response.data.code === 400) {
                                self.$message({
                                    showClose: true,
                                    message: "添加失败",
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
            }
        },
        handleClick(row) {
            this.edit = true;
            this.tmp = row._id;
            let arr = JSON.parse(JSON.stringify(this.params.col.columns));
            this.dynamicValidateForm.columns = [];
            arr.forEach(a => {
                this.dynamicValidateForm.columns.push({
                    name: a.name,
                    value: row[a.name]
                });
            });
            this.dialogVisible = true;
        },
        handleDelete(row) {
            this.$confirm("确认删除？", "确认:", { type: "error" })
                .then(_ => {
                    let self = this;
                    this.openFullScreen();
                    this.axios
                        .delete(self.url + "/api/ahridata/datarea/", {
                            data: {
                                user_id: self.user._id,
                                _id: row._id,
                                col_id: self.params.col._id
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
                                self.data = self.data.filter(item => {
                                    return item._id != row._id;
                                });
                                self.handleSizeChange(self.pageSize);
                                self.currentPage = Math.ceil(
                                    self.data.length / self.pageSize
                                );
                                self.handleCurrentChange(self.currentPage);
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
        insert() {
            if (this.newColumn.name == "") {
                this.$message({
                    showClose: true,
                    message: "列名不能为空",
                    type: "warning"
                });
                return;
            }
            let tag = this.params.col.columns.some(column => {
                return this.newColumn.name == column.name;
            });
            if (tag) {
                this.$message({
                    showClose: true,
                    message: "列名重复",
                    type: "warning"
                });
                return;
            }
            if (this.newColumn.name.includes(" ")) {
                this.$message({
                    showClose: true,
                    message: "列名不能包含空格",
                    type: "warning"
                });
                return;
            }
            this.newColumn.key = Date.now();
            let columns = this.params.col.columns;
            let pos = columns.findIndex(
                value => value.name == this.newColumn.column
            );
            columns.splice(
                pos + 1,
                0,
                JSON.parse(JSON.stringify(this.newColumn))
            );
            let self = this;
            this.openFullScreen();
            this.axios
                .put(self.url + "/api/ahridata/datacol/", {
                    opera: true,
                    columns: columns,
                    column: self.newColumn.name,
                    _id: self.params.col._id,
                    user_id: self.user._id
                })
                .then(response => {
                    if (response.data.code === 0) {
                        localStorage.removeItem("auth");
                        self.$router.push("/auth/login");
                    } else if (response.data.code === 200) {
                        self.$message({
                            showClose: true,
                            message: "添加成功",
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
        deleteColumn() {
            if (this.delColumn == "") {
                this.$message({
                    showClose: true,
                    message: "请选择要删除的列",
                    type: "warning"
                });
                return;
            }
            this.$confirm("确认删除？", "确认:", { type: "error" })
                .then(_ => {
                    let columns = this.params.col.columns.filter(column => {
                        return column.name != this.delColumn;
                    });
                    let self = this;
                    this.openFullScreen();
                    this.axios
                        .put(self.url + "/api/ahridata/datacol/", {
                            opera: false,
                            columns: columns,
                            column: self.delColumn,
                            _id: self.params.col._id,
                            user_id: self.user._id
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
                                self.params.col.columns = response.data.data;
                                self.delColumn = "";
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
        getColumn() {
            let self = this;
            this.openFullScreen();
            this.axios
                .get(self.url + "/api/ahridata/datacol/", {
                    params: {
                        user_id: self.user._id,
                        _id: self.params.col._id
                    }
                })
                .then(response => {
                    if (response.data.code === 0) {
                        localStorage.removeItem("auth");
                        self.$router.push("/auth/login");
                    } else if (response.data.code === 200) {
                        self.params.col.columns = response.data.data;
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
        getData() {
            let self = this;
            this.openFullScreen();
            this.axios
                .get(self.url + "/api/ahridata/datarea/", {
                    params: {
                        user_id: self.user._id,
                        _id: self.params.col._id
                    }
                })
                .then(response => {
                    if (response.data.code === 0) {
                        localStorage.removeItem("auth");
                        self.$router.push("/auth/login");
                    } else if (response.data.code === 200) {
                        self.data = response.data.data;
                        self.handleSizeChange(self.pageSize);
                        self.currentPage = Math.ceil(
                            self.data.length / self.pageSize
                        );
                        self.handleCurrentChange(self.currentPage);
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
        if (this.$route.params.hasOwnProperty("col")) {
            this.params = this.$route.params;
        } else {
            if (localStorage.getItem("params")) {
                this.params = JSON.parse(localStorage.getItem("params"));
            } else {
                this.$router.push({ name: "ahridata-survey" });
                return;
            }
        }
        this.getColumn();
        this.getData();
    },
    watch: {
        name() {
            this.search = "";
        }
    },
    beforeRouteLeave(to, from, next) {
        localStorage.removeItem("params");
        next();
    }
};
</script>

<style lang="scss" scoped>
#ahridata-collection {
    height: 100%;
    section {
        min-height: 100%;
        padding: 100px 50px 100px 50px;
        .panel {
            width: 90%;
            margin: 0 auto;
            box-shadow: #ccc 0 0 8px;
            padding: 30px;
            .title {
                display: flex;
                justify-content: space-between;
                .pagination {
                    display: flex;
                    justify-content: space-between;
                    button {
                        margin-left: 24px;
                    }
                }
            }
            .opera {
                display: flex;
                padding: 15px 0;
                justify-content: space-between;
                .el-input {
                    margin-left: 10px;
                }
                button {
                    margin-right: 100px;
                }
            }
            .newList {
                padding: 15px 0;
                .el-select .el-input {
                    width: 130px;
                }
                .input-with-select .el-input-group__prepend {
                    background-color: #fff;
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
</style>