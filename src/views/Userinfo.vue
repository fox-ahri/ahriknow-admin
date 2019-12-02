<template>
    <div id="userinfo" class="userinfo">
        <comp-nav active="/userinfo"></comp-nav>
        <section>
            <article>
                <el-card class="box-card">
                    <el-form
                        :model="user"
                        status-icon
                        ref="ruleForm"
                        :rules="rules"
                        label-width="100px"
                        class="demo-ruleForm"
                    >
                        <el-form-item label="用户名" prop="username">
                            <el-input
                                type="text"
                                v-model="user.username"
                                autocomplete="off"
                                disabled
                            ></el-input>
                        </el-form-item>
                        <el-form-item
                            label="邮箱"
                            prop="email"
                            :rules="[
                                        { required: true, message: '请输入邮箱地址', trigger: 'blur' },
                                        { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
                                    ]"
                        >
                            <el-input v-model="user.email" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="头像" prop="avatar">
                            <el-input v-model="user.avatar" autocomplete="off"></el-input>
                            <el-upload
                                class="avatar-uploader"
                                :action="upload_url"
                                :data="{ user_id: user._id }"
                                :show-file-list="false"
                                :on-success="handleAvatarSuccess"
                            >
                                <img v-if="user.avatar" :src="user.avatar" class="avatar" />
                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload>
                        </el-form-item>
                        <el-form-item label="电话" prop="phone">
                            <el-input v-model="user.phone" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="姓名" prop="name">
                            <el-input v-model="user.name" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="性别" prop="sex">
                            <el-radio v-model="user.sex" label="男">男</el-radio>
                            <el-radio v-model="user.sex" label="女">女</el-radio>
                            <el-radio v-model="user.sex" label="保密">保密</el-radio>
                        </el-form-item>
                        <el-form-item label="生日" prop="birthday">
                            <el-date-picker
                                v-model="user.birthday"
                                type="date"
                                value-format="yyyy-MM-dd"
                                placeholder="生日"
                            ></el-date-picker>
                        </el-form-item>
                        <el-form-item label="上次登录" prop="last">
                            <el-input v-model="user.last" autocomplete="off" disabled></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
                            <el-button type="primary">更改密码</el-button>
                        </el-form-item>
                    </el-form>
                </el-card>
            </article>
            <footer>
                <foot-nav></foot-nav>
            </footer>
        </section>
        <el-dialog title="验证码" :visible.sync="dialogFormVisible">
            <el-form>
                <el-form-item label="验证码">
                    <el-input v-model="code" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import CompNav from "@/components/CompNav.vue";
import FootNav from "@/components/FootNav.vue";
export default {
    name: "userinfo",
    components: {
        "comp-nav": CompNav,
        "foot-nav": FootNav
    },
    data() {
        let checkPhone = (rule, value, callback) => {
            if (value === "") {
                callback();
            } else {
                const reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
                if (reg.test(value)) {
                    callback();
                } else {
                    return callback(new Error("请输入正确的手机号"));
                }
            }
        };
        return {
            user: {
                role: 0
            },
            rules: {
                phone: [{ validator: checkPhone, trigger: "blur" }]
            },
            email: "",
            code: "",
            dialogFormVisible: false,
            imageUrl: "",
            upload_url: this.url + "/api/auth/upload/"
        };
    },
    methods: {
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    let c = false;
                    if (this.user.email != this.email) {
                        c = true;
                    }
                    let self = this;
                    this.user.c = c;
                    this.axios
                        .put(self.url + "/verification/auth/change/", self.user)
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
                                self.$store.commit(
                                    "SAVE_USER",
                                    JSON.stringify(self.user)
                                );
                                if (c) {
                                    localStorage.clear();
                                    self.$store.commit("LOGOUT");
                                    this.$router.push("/auth/login");
                                }
                            } else if (response.data.code === 401) {
                                self.$message({
                                    showClose: true,
                                    message: "邮箱重复",
                                    type: "warning"
                                });
                            } else if (response.data.code === 402) {
                                self.$message({
                                    showClose: true,
                                    message: "手机号重复",
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
                } else {
                    console.log("error submit!!");
                    return false;
                }
            });
        },
        handleAvatarSuccess(res, file) {
            this.user.avatar = res.data;
            this.$store.commit("SAVE_USER", JSON.stringify(this.user));
        }
    },
    mounted() {
        if (this.$store.state.user != null) {
            this.user = this.$store.state.user;
            this.email = this.user.email;
        } else {
            this.user = {
                role: 0
            };
            window.location = "/";
            return false;
        }
    }
};
</script>

<style lang="scss" scoped>
#userinfo {
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
                width: 800px;
                margin: 0 auto;
                .el-icon-plus,
                .avatar-uploader-icon {
                    border: 1px dashed #d9d9d9;
                }
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