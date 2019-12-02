<template>
    <div id="dbm-mongo-auth" class="dbm-mongo-auth">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>登录</span>
                <el-button
                    style="float: right; padding: 3px 0"
                    type="text"
                    @click="$router.push('/')"
                >Home</el-button>
            </div>
            <el-form ref="form" :model="form" label-width="80px">
                <el-form-item label="DB">
                    <el-input v-model="form.database"></el-input>
                </el-form-item>
                <el-form-item label="Host" style="width: 70%;display: inline-block">
                    <el-input v-model="form.host"></el-input>
                </el-form-item>
                <el-form-item label="Port" style="width: 30%;display: inline-block">
                    <el-input v-model="form.port"></el-input>
                </el-form-item>
                <el-form-item label="User">
                    <el-input v-model="form.username"></el-input>
                </el-form-item>
                <el-form-item label="Pass">
                    <el-input v-model="form.password"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="login">登录</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script>
export default {
    name: "dbm-mongo-auth",
    data() {
        return {
            form: {
                database: "",
                username: "",
                password: "",
                host: "",
                port: "27017"
            }
        };
    },
    methods: {
        login() {
            let self = this;
            let loading = this.$loading({
                lock: true,
                text: "正在登录",
                spinner: "el-icon-loading",
                background: "rgba(0, 0, 0, 0.7)"
            });
            this.axios({
                url: self.url + "/dbm/mongo/auth/",
                method: "post",
                data: JSON.stringify(self.form),
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(
                function(response) {
                    if (response.data.code === 200) {
                        self.$message({
                            showClose: true,
                            message: "登录成功",
                            type: "success"
                        });
                        localStorage.setItem(
                            "mongo",
                            JSON.stringify(response.data.data.auth)
                        );
                        self.$router.push({
                            name: "dbm-mongo-mongo",
                            query: {
                                user: self.form.username,
                                db: self.form.database
                            }
                        });
                    } else if (response.data.code === 400) {
                        self.$message({
                            showClose: true,
                            message: "登陆失败:" + response.data.msg,
                            type: "warning"
                        });
                    } else {
                        console.log(response);
                        self.$message({
                            showClose: true,
                            message: "服务器内部错误"
                        });
                    }
                    loading.close();
                },
                function(response) {
                    console.log(response);
                    self.$message({
                        showClose: true,
                        message: "客户端错误，请求失败"
                    });
                    loading.close();
                }
            );
        }
    },
    mounted() {
        let params = this.$route.params;
        if (params.hasOwnProperty("_id")) {
            this.form.database = params.name;
            this.form.username = params.username;
            this.form.password = params.password;
            this.form.host = "aaahri.com";
        }
    }
};
</script>

<style lang="scss" scoped>
#dbm-mongo-auth {
    padding-top: 220px;
    .box-card {
        width: 580px;
        margin: 0 auto;
    }
}
</style>