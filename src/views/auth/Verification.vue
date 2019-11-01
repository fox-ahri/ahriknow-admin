<template>
    <div id="auth-verification" class="auth-verification">
        <comp-nav></comp-nav>
        <section>
            <article>
                <div class="box">
                    <el-card class="box-card">
                        <div class="tips" v-if="!show">
                            欢迎加入狸知，
                            激活连接已发送至 {{ email }}，
                            <el-button type="text" @click="reSend">重新发送</el-button>
                        </div>
                        <div class="tip" v-if="show">
                            用户不存在或已激活,请刷新&nbsp;&nbsp;或&nbsp;&nbsp;
                            <router-link to="/auth/login">Sign in</router-link>
                        </div>
                    </el-card>
                </div>
            </article>
            <footer class="nocopy">
                <router-link to="/admin">Home</router-link>&nbsp;|&nbsp;
                <router-link to="/auth/login">Sign in</router-link>&nbsp;|&nbsp;
                <router-link to="/auth/register">Sign up</router-link>&nbsp;|&nbsp;
                <router-link to="/ahridata/survey">AhriData</router-link>&nbsp;|&nbsp;
                <router-link to="/blog/survey">Ahriblog</router-link>&nbsp;|&nbsp;
                <router-link to="/notebook/book">Notebook</router-link>&nbsp;|&nbsp;
                <router-link to="/transfer/galaxy">Transfer</router-link>
            </footer>
        </section>
    </div>
</template>

<script>
import CompNav from '@/components/CompNav.vue'
export default {
    name: "auth-verification",
    components: {
        "comp-nav": CompNav
    },
    data() {
        return {
            username: "",
            email: "1",
            show: false
        };
    },
    created() {},
    methods: {
        reSend() {
            let self = this;
            this.axios({
                url: self.url + "/verification/auth/verification/",
                method: "post",
                data: JSON.stringify({ email: self.email }),
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(
                function(response) {
                    if (response.data.code === 200) {
                        self.$message({
                            showClose: true,
                            message: "发送成功",
                            type: "success"
                        });
                    } else if (response.data.code === 400) {
                        self.$message({
                            showClose: true,
                            message: "用户不存在或已激活,请刷新"
                        });
                        self.show = true;
                    } else {
                        console.log(response);
                        self.$message({
                            showClose: true,
                            message: "服务器内部错误,请重试"
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
        }
    },
    mounted() {
        if (this.$route.params.hasOwnProperty("username")) {
            this.username = this.$route.params;
        } else {
            if (localStorage.getItem("username")) {
                this.username = localStorage.getItem("username");
            } else {
                this.$router.push({ name: "auth-login" });
                return;
            }
        }
        let self = this;
        this.axios
            .get(self.url + "/verification/auth/verification/", {
                params: {
                    username: self.username
                }
            })
            .then(response => {
                if (response.data.code == 200) {
                    self.email = response.data.data;
                } else {
                    this.$router.push({ name: "auth-login" });
                }
            })
            .catch(response => {
                this.$router.push({ name: "auth-login" });
            });
    },
    beforeRouteLeave(to, from, next) {
        localStorage.removeItem("username");
        next();
    }
};
</script>

<style lang="scss" scoped>
#auth-verification {
    width: 100%;
    height: 100%;
    section {
        z-index: 10;
        width: 100%;
        height: 100%;
        padding-top: 90px;
        overflow-y: scroll;
        article {
            min-height: 100%;
            padding: 30px 50px 100px 50px;
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