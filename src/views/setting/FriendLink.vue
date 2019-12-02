<template>
    <div id="settiing-document" class="settiing-document">
        <div class="pagination nocopy">
            <el-button icon="el-icon-back" @click="goBack"></el-button>
            <div class="nav">
                <router-link to="/setting/user">UserManage</router-link>&nbsp;|&nbsp;
                <router-link to="/setting/apply">Apply</router-link>&nbsp;|&nbsp;
                <router-link to="/setting/document">Document</router-link>
            </div>
        </div>
        <el-card v-for="i in links">
            <div class="link">
                <div class="index">{{ i.index }}</div>
                <img :src="i.image" alt />
                <div class="name">{{ i.name }}</div>
                <div class="desc">{{ i.desc }}</div>
                <div class="url">{{ i.url }}</div>
                <el-button plain @click="remove(i)">删除</el-button>
            </div>
        </el-card>
        <el-card>
            <el-form label-width="80px">
                <el-form-item label="序号">
                    <el-input v-model="newlink.index"></el-input>
                </el-form-item>
                <el-form-item label="标题">
                    <el-input v-model="newlink.name"></el-input>
                </el-form-item>
                <el-form-item label="描述">
                    <el-input v-model="newlink.desc"></el-input>
                </el-form-item>
                <el-form-item label="链接">
                    <el-input v-model="newlink.url"></el-input>
                </el-form-item>
                <el-form-item label="图片">
                    <el-input v-model="newlink.image"></el-input>
                    <el-upload
                        class="avatar-uploader"
                        :action="upload_url"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                    >
                        <img v-if="newlink.image" :src="newlink.image" class="avatar" />
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submit">添加</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script>
import { link } from 'fs';
export default {
    name: "settiing-document",
    data() {
        return {
            user: {
                role: 0
            },
            upload_url: this.url + "/api/setting/friend/upload/",
            image: "",
            newlink: {
                index: "1",
                name: "",
                url: "",
                desc: "",
                image: ""
            },
            links: []
        };
    },
    created() {},
    methods: {
        goBack() {
            this.$router.push({ name: "home" });
        },
        handleAvatarSuccess(response, file, fileList) {
            if (response.code === 200) {
                this.newlink.image = response.data;
            } else {
                this.$message({
                    showClose: true,
                    message: "上传失败"
                });
            }
        },
        submit() {
            this.links.push(this.newlink);
            let self = this;
            this.axios
                .put(self.url + "/api/setting/friend/", {
                    user_id: self.user._id,
                    links: this.links
                })
                .then(response => {
                    if (response.data.code === 0) {
                        localStorage.removeItem("auth");
                        self.$router.push("/auth/login");
                    } else if (response.data.code === 200) {
                        this.newlink = {
                            indes: "1",
                            name: "",
                            url: "",
                            image: "",
                            desc: ""
                        };
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
        },
        remove(val) {
            this.links = this.links.filter(link => {
                return link.name != val.name;
            });
            let self = this;
            this.axios
                .put(self.url + "/api/setting/friend/", {
                    user_id: self.user._id,
                    links: this.links
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
            .get(self.url + "/api/setting/friend/", {
                params: {
                    user_id: self.user._id
                }
            })
            .then(response => {
                if (response.data.code === 0) {
                    localStorage.removeItem("auth");
                    self.$router.push("/auth/login");
                } else if (response.data.code === 200) {
                    self.links = response.data.data;
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
        border: 1px dashed #d9d9d9;
        font-size: 28px;
        color: #8c939d;
        height: 178px;
        line-height: 178px;
        text-align: center;
        min-width: 178px;
    }
    .avatar {
        height: 178px;
        display: block;
    }
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
    .link {
        display: flex;
        justify-content: space-between;
        line-height: 40px;
        .index{
            width: 100px;
        }
        img {
            width: 40px;
            height: 40px;
        }
        .name {
            width: 100px;
        }
        .desc {
            width: 300px;
        }
        .url{
            width: 400px;
        }
    }
}
</style>