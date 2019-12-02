<template>
    <div id="setting-apply" class="setting-apply">
        <div class="pagination nocopy">
            <el-button icon="el-icon-back" @click="goBack"></el-button>
            <div class="nav">
                <router-link to="/setting/user">UserManage</router-link>&nbsp;|&nbsp;
                <router-link to="/setting/friend">Friend</router-link>&nbsp;|&nbsp;
                <router-link to="/setting/document">Document</router-link>
            </div>
        </div>
        <el-table
            :data="apply.filter(data => search === '' || data.ok === search)"
            style="width: 100%"
            border
            highlight-current-row
        >
            <el-table-column label="Username" prop="username"></el-table-column>
            <el-table-column label="Name" prop="name"></el-table-column>
            <el-table-column label="Message" prop="msg"></el-table-column>
            <el-table-column label="Apply" prop="ok" :formatter="formatBoolean"></el-table-column>
            <el-table-column align="right" width="300">
                <template slot="header" slot-scope="scope">
                    <el-radio-group v-model="search">
                        <el-radio :label="true">已授权</el-radio>
                        <el-radio :label="false">未授权</el-radio>
                        <el-radio :label="''">全部</el-radio>
                    </el-radio-group>
                </template>
                <template slot-scope="scope">
                    <el-switch
                        v-model="scope.row.ok"
                        active-color="#13ce66"
                        inactive-color="#ff4949"
                        active-text="授权"
                        inactive-text="取消"
                        @change="change(scope.row)"
                    ></el-switch>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
export default {
    name: "setting-apply",
    data() {
        return {
            user: {
                role: 0
            },
            search: "",
            apply: []
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
        change(val) {
            let self = this;
            this.axios
                .put(self.url + "/api/setting/apply/", {
                    user_id: self.user._id,
                    name: val.name,
                    user: val.user,
                    ok: val.ok
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
        let self = this;
        this.axios
            .get(self.url + "/api/setting/apply/", {
                params: {
                    user_id: self.user._id
                }
            })
            .then(response => {
                if (response.data.code === 0) {
                    localStorage.removeItem("auth");
                    self.$router.push("/auth/login");
                } else if (response.data.code === 200) {
                    self.apply = response.data.data;
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
};
</script>

<style lang="scss" scoped>
#setting-apply {
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