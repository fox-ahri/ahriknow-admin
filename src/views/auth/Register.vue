<template>
    <div id="auth-register" class="auth-register">
        <el-card class="box-card">
            <div slot="header" class="clearfix nocopy">
                <span>注册</span>
                <el-button style="float: right; padding: 3px 0" type="text" @click="goto">Sign in</el-button>
                <el-button style="float: right; padding: 3px 0" type="text" @click="$router.push('/')">Home</el-button>
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
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                        <el-input
                            type="email"
                            v-model="ruleForm.email"
                            autocomplete="off"
                            placeholder="Email"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input
                            type="password"
                            v-model="ruleForm.password"
                            autocomplete="off"
                            placeholder="Password"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="确认密码" prop="checkPass">
                        <el-input
                            type="password"
                            v-model="ruleForm.checkPass"
                            autocomplete="off"
                            placeholder="Check pass"
                        ></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitForm('ruleForm')">Sign up</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-card>
    </div>
</template>

<script>
export default {
    name: "auth-register",
    data() {
        var validateUsername = (rule, value, callback) => {
            if (value === "") {
                callback(new Error("请输入用户名"));
            } else {
                callback();
            }
        };
        var validatePass = (rule, value, callback) => {
            if (value === "") {
                callback(new Error("请输入密码"));
            } else {
                if (this.ruleForm.checkPass !== "") {
                    this.$refs.ruleForm.validateField("checkPass");
                }
                callback();
            }
        };
        var validatePass2 = (rule, value, callback) => {
            if (value === "") {
                callback(new Error("请再次输入密码"));
            } else if (value !== this.ruleForm.password) {
                callback(new Error("两次输入密码不一致!"));
            } else {
                callback();
            }
        };
        return {
            ruleForm: {
                username: "",
                password: "",
                checkPass: "",
                email: ""
            },
            rules: {
                username: [
                    { required: true, message: "请输入用户名", trigger: "blur" }
                ],
                password: [
                    { required: true, validator: validatePass, trigger: "blur" }
                ],
                checkPass: [
                    {
                        required: true,
                        validator: validatePass2,
                        trigger: "blur"
                    }
                ],
                email: [
                    {
                        required: true,
                        message: "请输入邮箱地址",
                        trigger: "blur"
                    },
                    {
                        type: "email",
                        message: "请输入正确的邮箱地址",
                        trigger: ["blur", "change"]
                    }
                ]
            },
            loading: {}
        };
    },
    methods: {
        goto() {
            this.$router.push("/auth/login");
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
                        url: self.url + "/verification/auth/register/",
                        method: "post",
                        data: JSON.stringify(self.ruleForm),
                        headers: {
                            "Content-Type": "application/json"
                        }
                    }).then(
                        function(response) {
                            if (response.data.code === 200) {
                                localStorage.setItem(
                                    "username",
                                    self.ruleForm.username
                                );
                                self.$router.push("/auth/verification");
                            } else if (response.data.code === 400) {
                                self.$message({
                                    showClose: true,
                                    message: "密码不一致",
                                    type: "warning"
                                });
                            } else if (response.data.code === 401) {
                                self.$message({
                                    showClose: true,
                                    message: "用户名重复",
                                    type: "warning"
                                });
                            } else if (response.data.code === 402) {
                                self.$message({
                                    showClose: true,
                                    message: "邮箱已存在",
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
    beforeRouteLeave(to, from, next) {
        try {
            this.loading.close();
        } catch {}
        next();
    }
};
</script>

<style lang="scss" scoped>
#auth-register {
    width: 100%;
    height: 100%;
    position: relative;
    .box-card {
        background: #fffc;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -62%);
        padding-right: 20px;
        width: 540px;
        .form {
            button {
                width: 100%;
            }
        }
        .clearfix{
            button{
                margin-left: 15px;
            }
        }
    }
}
</style>