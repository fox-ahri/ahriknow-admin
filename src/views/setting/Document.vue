<template>
    <div id="settiing-document" class="settiing-document">
        <div class="pagination nocopy">
            <el-button icon="el-icon-back" @click="goBack"></el-button>
            <div class="nav">
                <router-link to="/setting/user">UserManage</router-link>&nbsp;|&nbsp;
                <router-link to="/setting/friend">Friend</router-link>&nbsp;|&nbsp;
                <router-link to="/setting/apply">Apply</router-link>
            </div>
        </div>
        <div class="box ahridata">
            <el-input placeholder="请输入网址" v-model="ahridata">
                <template slot="prepend">Ahridata</template>
                <el-button slot="append" icon="el-icon-check" @click="set_doc(2, ahridata)"></el-button>
            </el-input>
        </div>
        <div class="box restful">
            <el-input placeholder="请输入网址" v-model="restful">
                <template slot="prepend">Restful&nbsp;&nbsp;</template>
                <el-button slot="append" icon="el-icon-check" @click="set_doc(3, restful)"></el-button>
            </el-input>
        </div>
        <div class="box website">
            <el-input placeholder="请输入网址" v-model="website">
                <template slot="prepend">Website</template>
                <el-button slot="append" icon="el-icon-check" @click="set_doc(4, website)"></el-button>
            </el-input>
        </div>
    </div>
</template>

<script>
export default {
    name: "settiing-document",
    data() {
        return {
            user: {
                role: 0
            },
            document: [],
            ahridata: "",
            restful: "",
            website: ""
        };
    },
    created() {},
    methods: {
        goBack() {
            this.$router.push({ name: "home" });
        },
        set_doc(who, what) {
            let self = this;
            this.axios
                .put(self.url + "/api/setting/document/", {
                    user_id: self.user._id,
                    who: who,
                    what: what
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
            .get(self.url + "/api/setting/document/", {
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
                    self.document = response.data.data;
                    response.data.data.forEach(element => {
                        switch (element.about) {
                            case 2:
                                self.ahridata = element.url;
                                break;
                            case 3:
                                self.restful = element.url;
                                break;
                            case 4:
                                self.website = element.url;
                                break;
                            default:
                                break;
                        }
                    });
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
#settiing-document {
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
    .box {
        width: 900px;
        margin: 20px auto;
    }
}
</style>