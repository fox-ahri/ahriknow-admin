<template>
    <div id="setting-usermanage" class="setting-usermanage">
        <div class="pagination nocopy">
            <el-button icon="el-icon-back" @click="goBack"></el-button>
            <div>
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
                    :total="this.users.length"
                    background
                ></el-pagination>
                <el-button type="primary" size="mini" @click="addUser">添加用户</el-button>
            </div>
        </div>
        <el-table
            :data="users.filter(data => data.role < user.role && (!search || data.username.includes(search.toLowerCase())))"
            style="width: 100%"
            border
            highlight-current-row
            :default-sort="{prop: 'date', order: 'descending'}"
        >
            <el-table-column label="Namename" prop="username"></el-table-column>
            <el-table-column label="Email" prop="email" sortable></el-table-column>
            <el-table-column label="Apply" prop="apply"></el-table-column>
            <el-table-column label="role" prop="role"></el-table-column>
            <el-table-column label="Disabled" prop="disabled" :formatter="formatBoolean"></el-table-column>
            <el-table-column label="Verification" prop="verification" :formatter="formatBoolean"></el-table-column>
            <el-table-column label="Last" prop="last"></el-table-column>
            <el-table-column label="Avatar" prop="avatar" v-if="showImage" width="120">
                <template slot-scope="scope">
                    <el-image
                        style="width: 100px; height: 80px"
                        :src="scope.row.avatar"
                        fit="contain"
                        :preview-src-list="[scope.row.image]"
                    ></el-image>
                </template>
            </el-table-column>
            <el-table-column align="right" width="340">
                <template slot="header" slot-scope="scope">
                    <el-input v-model="search" size="mini" placeholder="输入关键字搜索" />
                </template>
                <template slot-scope="scope">
                    验证
                    <el-switch
                        v-model="scope.row.verification"
                        active-color="#13ce66"
                        inactive-color="#ff4949"
                        @change="change(scope.row)"
                    ></el-switch>&nbsp;&nbsp;禁用
                    <el-switch
                        v-model="scope.row.disabled"
                        active-color="#ff4949"
                        inactive-color="#13ce66"
                        @change="change(scope.row)"
                    ></el-switch>
                    <el-input
                        v-model="scope.row.role"
                        placeholder="请输入权限"
                        style="width: 60px;margin: 0 20px"
                    ></el-input>
                    <el-button size="mini" type="primary" @click="handleChangeRole(scope.row)">Write</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog title="新增用户" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
            <el-form :model="form">
                <el-form-item label="用户名" label-width="120px">
                    <el-input v-model="form.username" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="密码" label-width="120px">
                    <el-input v-model="form.password" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitAddUser">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: "setting-usermanage",
    data() {
        return {
            user: {
                role: 0
            },
            users: [],
            search: "",
            showImage: false,
            pageSize: 10,
            currentPage: 1,
            dialogFormVisible: false,
            form: {
                username: "",
                password: ""
            }
        };
    },
    created() {},
    methods: {
        goBack() {
            this.$router.push({ name: "home" });
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
        addUser() {
            this.form.username = "";
            this.form.password = "";
            this.dialogFormVisible = true;
        },
        submitAddUser() {
            let self = this;
            this.axios({
                url: self.url + "/api/setting/user/",
                method: "post",
                data: JSON.stringify({
                    user_id: self.user._id,
                    username: self.form.username,
                    password: self.form.password
                }),
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(
                function(response) {
                    if (response.data.code === 200) {
                        self.$message({
                            showClose: true,
                            message: "添加成功",
                            type: "success"
                        });
                        self.getData();
                        self.dialogFormVisible = false;
                    } else if (response.data.code === 400) {
                        self.$message({
                            showClose: true,
                            message: "用户名重复",
                            type: "warning"
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
        handleSizeChange(val) {
            this.users = this.users.slice(0, val);
            this.currentPage = 1;
            this.pageSize = val;
            this.handleCurrentChange(1);
        },
        handleCurrentChange(val) {
            this.users = this.users.slice(
                this.pageSize * (val - 1),
                this.pageSize * val
            );
        },
        change(val) {
            let self = this;
            this.axios
                .delete(self.url + "/api/setting/user/", {
                    data: {
                        user_id: self.user._id,
                        _id: val._id,
                        disabled: val.disabled,
                        verification: val.verification
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
                })
                .catch(response => {
                    console.log(response);
                    self.$message({
                        showClose: true,
                        message: "客户端错误，请求失败"
                    });
                });
        },
        handleChangeRole(val) {
            let self = this;
            this.axios
                .put(self.url + "/api/setting/user/", {
                    user_id: self.user._id,
                    _id: val._id,
                    role: val.role
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
                        val.apply = "";
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
                })
                .catch(response => {
                    console.log(response);
                    self.$message({
                        showClose: true,
                        message: "客户端错误，请求失败"
                    });
                });
        },
        getData() {
            let self = this;
            this.axios
                .get(self.url + "/api/setting/user/", {
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
                        self.users = response.data.data;
                        self.handleSizeChange(self.pageSize);
                        self.currentPage = Math.ceil(
                            self.users.length / self.pageSize
                        );
                        self.handleCurrentChange(self.currentPage);
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
            if (this.user.role < 100) {
                window.location = "/";
                return false;
            }
        } else {
            this.user = {
                role: 0
            };
            window.location = "/";
            return false;
        }
        this.getData();
    }
};
</script>

<style lang="scss" scoped>
#setting-usermanage {
    width: 100%;
    height: 100%;
    padding: 100px;
    .pagination {
        display: flex;
        justify-content: space-between;
        padding: 20px 0;
        div {
            display: flex;
            justify-content: space-between;
        }
    }
}
</style>