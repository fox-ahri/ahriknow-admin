<template>
    <div id="auth-login" class="auth-login">
        <el-card class="box-card">
            <div slot="header" class="clearfix nocopy">
                <span>登录</span>
                <el-button style="float: right; padding: 3px 0" type="text" @click="goto">Sign up</el-button>
                <el-button
                    style="float: right; padding: 3px 0"
                    type="text"
                    @click="$router.push('/')"
                >Home</el-button>
            </div>
            <div class="form">
                <el-form
                    :model="ruleForm"
                    status-icon
                    :rules="rules"
                    ref="ruleForm"
                    label-width="100px"
                    class="demo-ruleForm"
                >
                    <el-form-item label="用户名" prop="username">
                        <el-input
                            type="text"
                            v-model="ruleForm.username"
                            autocomplete="off"
                            placeholder="Username"
                            @keyup.enter.native="submitForm('ruleForm')"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input
                            type="password"
                            v-model="ruleForm.password"
                            autocomplete="off"
                            placeholder="Password"
                            @keyup.enter.native="submitForm('ruleForm')"
                        ></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitForm('ruleForm')">Sign in</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-card>
    </div>
</template>

<script>
export default {
    name: "auth-login",
    data() {
        var validateUsername = (rule, value, callback) => {
            callback();
            if (value === "") {
                callback(new Error("请输入用户名"));
            } else {
                callback();
            }
        };
        var validatePassword = (rule, value, callback) => {
            callback();
            if (value === "") {
                callback(new Error("请输入密码"));
            } else {
                callback();
            }
        };
        return {
            ruleForm: {
                username: "",
                password: ""
            },
            rules: {
                username: [{ validator: validateUsername, trigger: "blur" }],
                password: [{ validator: validatePassword, trigger: "blur" }]
            },
            loading: {}
        };
    },
    created() {},
    methods: {
        goto() {
            this.$router.push("/auth/register");
        },
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.loading = this.$loading({
                        lock: true,
                        text: "Loading",
                        spinner: "el-icon-loading",
                        background: "rgba(0, 0, 0, 0.7)"
                    });
                    let self = this;
                    this.axios({
                        url: self.url + "/verification/auth/login/",
                        method: "post",
                        data: JSON.stringify(self.ruleForm),
                        headers: {
                            "Content-Type": "application/json"
                        }
                    }).then(
                        function(response) {
                            if (response.data.code === 200) {
                                self.$message({
                                    showClose: true,
                                    message: "登陆成功",
                                    type: "success"
                                });
                                self.$store.commit(
                                    "SAVE_USER",
                                    response.data.data
                                );
                                let from =
                                    localStorage.getItem("from") || "/admin";
                                if (
                                    from == "/auth/login" ||
                                    from == "/auth/register" ||
                                    from == "/auth/verification"
                                )
                                    from = "/admin";
                                localStorage.removeItem("from");
                                self.$router.push(from);
                            } else if (response.data.code === 300) {
                                self.$message({
                                    showClose: true,
                                    message: "用户被禁用",
                                    type: "error"
                                });
                            } else if (response.data.code === 301) {
                                localStorage.setItem(
                                    "username",
                                    self.ruleForm.username
                                );
                                self.$router.push({
                                    name: "auth-verification",
                                    params: self.ruleForm.username
                                });
                            } else if (response.data.code === 400) {
                                self.$message({
                                    showClose: true,
                                    message: "用户名或密码错误",
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
                } else {
                    return false;
                }
            });
        }
    },
    mounted() {},
    beforeRouteLeave(to, from, next) {
        try {
            this.loading.close();
        } catch {}
        next();
    }
};
</script>

<style lang="scss" scoped>
#auth-login {
    width: 100%;
    height: 100%;
    .box-card {
        background: #fffc;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -62%);
        padding-right: 20px;
        width: 480px;
        .form {
            button {
                width: 100%;
            }
        }
        .clearfix {
            button {
                margin-left: 15px;
            }
        }
    }
}
</style>