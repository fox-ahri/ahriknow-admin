<template>
    <div id="tools-image" class="tools-image">
        <section>
            <el-input :placeholder="$t('l.tools.image.inputKey')" v-model="key" @keyup.enter.native="search">
                <div slot="append">
                    <el-button
                        icon="el-icon-search"
                        @click="search"
                        style="border-right: solid 1px #ccc"
                    >{{ $t('l.tools.image.search') }}</el-button>
                    <el-button icon="el-icon-plus" @click="add">{{ $t('l.tools.image.add') }}</el-button>
                </div>
            </el-input>
            <el-card v-for="i in items">
                <div class="box">
                    <div class="image">
                        <img :src="i.url + '?' + i.params" alt="http://api.aaahri.com/image/" />
                    </div>
                    <div class="info">
                        <el-select v-model="i.url" placeholder="请选择地址" style="width: 30%">
                            <el-option
                                label="http://api.aaahri.com/image/"
                                value="http://api.aaahri.com/image/"
                            ></el-option>
                            <el-option
                                label="https://aaahri.com/image/"
                                value="https://aaahri.com/image/"
                            ></el-option>
                        </el-select>&nbsp;
                        <span>{{ i.url }}{{ key }}/{{ i.name }}</span>
                        <el-input type="textarea" :rows="3" :placeholder="$t('l.tools.image.inputParams')" v-model="i.params"></el-input>
                        <div class="name" style="display: flex">
                            <el-input v-model="i.name" :placeholder="$t('l.tools.image.requireName')"></el-input>
                            <el-button icon="el-icon-s-order" @click="save(i)">{{ $t('l.tools.image.save') }}</el-button>
                            <el-button icon="el-icon-delete-solid" @click="deleteImg(i)">{{ $t('l.tools.image.delete') }}</el-button>
                        </div>
                    </div>
                </div>
            </el-card>
        </section>
    </div>
</template>

<script>
export default {
    name: "tools-image",
    data() {
        return {
            key: "key",
            items: []
        };
    },
    methods: {
        search() {
            this.getData();
        },
        add() {
            if (this.key == "") {
                this.$message.error("请输入 KEY");
                return;
            }
            this.getData();
            let self = this;
            let form = {
                key: self.key,
                name: new Date().getTime().toString(),
                url: "https://aaahri.com/image/",
                params: ""
            };
            this.axios({
                url: self.url + "/public/tools/image/",
                method: "post",
                data: JSON.stringify(form),
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(
                function(response) {
                    if (response.data.code === 200) {
                        self.getData();
                        self.$message({
                            showClose: true,
                            message: "添加成功",
                            type: "success"
                        });
                    } else if (response.data.code === 400) {
                        self.$message({
                            showClose: true,
                            message: "name 重复",
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
        save(val) {
            let self = this;
            this.axios
                .put(self.url + "/public/tools/image/", val)
                .then(response => {
                    if (response.data.code === 200) {
                        self.$message({
                            showClose: true,
                            message: "保存成功",
                            type: "success"
                        });
                    } else if (response.data.code === 400) {
                        self.$message({
                            showClose: true,
                            message: "name 重复",
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
        deleteImg(val) {
            let self = this;
            this.axios
                .delete(self.url + "/public/tools/image/", {
                    data: val
                })
                .then(response => {
                    if (response.data.code === 200) {
                        this.getData();
                        self.$message({
                            showClose: true,
                            message: "删除成功",
                            type: "success"
                        });
                    } else if (response.data.code === 400) {
                        self.$message({
                            showClose: true,
                            message: "删除失败",
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
                .get(self.url + "/public/tools/image/", {
                    params: {
                        key: self.key
                    }
                })
                .then(response => {
                    if (response.data.code === 200) {
                        self.items = response.data.data;
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
        this.getData();
    }
};
</script>

<style lang="scss" scoped>
#tools-image {
    section {
        width: 1200px;
        margin: 0 auto;
        .el-card {
            margin: 10px 0;
            .box {
                display: flex;
                .image {
                    width: 300px;
                    height: 170px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    img {
                        max-width: 300px;
                        max-height: 170px;
                    }
                }
                .info {
                    height: 170px;
                    flex: 1;
                }
            }
        }
    }
}
</style>