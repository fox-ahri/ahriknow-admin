<template>
    <div id="dataview-datav" class="dataview-datav">
        <section>
            <div class="panel">
                <div class="opera">
                    <el-button icon="el-icon-back" @click="goBack"></el-button>
                    <span style="margin-right: 50px">视图名称: {{ $route.query.name }}</span>
                    <span>引用方式: &lt;iframe src="http[s]://monitor.ahriknow.com/#/datav?spf=刷新时间&key={{ k }}"&gt;&lt;/iframe&gt; </span>
                </div>
                <div class="set_view">
                    <div class="view">
                        <iframe
                            :src="'https://monitor.ahriknow.com/#/datav?spf=3&key=' + k"
                            frameborder="0"
                        ></iframe>
                    </div>
                    <div class="set">
                        <el-button @click="set" style="margin-bottom: 16px">提交</el-button>
                        <el-button @click="reload" style="margin-bottom: 16px">刷新</el-button>
                        <codemirror v-model="data" :options="options"></codemirror>
                    </div>
                </div>
            </div>
        </section>
        <footer>
            <foot-nav></foot-nav>
        </footer>
    </div>
</template>

<script>
import FootNav from "@/components/FootNav.vue";
import { codemirror } from "vue-codemirror-lite";
require("codemirror/mode/javascript/javascript.js");
export default {
    name: "dataview-datav",
    components: {
        "foot-nav": FootNav,
        codemirror
    },
    data() {
        return {
            user: {
                role: 0
            },
            loading: null,
            k: "",
            data: "",
            options: {
                mode: "string",
                tabSize: 4,
                lineNumbers: true,
                lineWrapping: true,
                extraKeys: { "Ctrl-Space": "autocomplete" },
                mode: "javascript"
            },
            import: "<iframe src=\"'http://monitor.ahriknow.com/#/datav?spf=3&key=' + k\"></iframe>"
        };
    },
    methods: {
        goBack() {
            this.$router.push({ name: "dataview" });
        },
        openFullScreen() {
            this.loading = this.$loading({
                lock: true,
                text: "Loading。。。",
                spinner: "el-icon-loading",
                background: "rgba(0, 0, 0, 0.7)"
            });
        },
        set() {
            let self = this;
            this.openFullScreen();
            let data = {
                key: this.k,
                value: JSON.parse(this.data)
            };
            this.axios({
                url: self.url + "/dataview/data/",
                method: "post",
                data: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(
                function(response) {
                    if (response.data.code === 200) {
                        self.$message({
                            showClose: true,
                            message: "数据更新成功",
                            type: "success"
                        });
                    } else {
                        console.log(response);
                        self.$message({
                            showClose: true,
                            message: "服务器内部错误"
                        });
                    }
                    self.closeFullScreen();
                },
                function(response) {
                    console.log(response);
                    self.$message({
                        showClose: true,
                        message: "客户端错误，请求失败"
                    });
                    self.closeFullScreen();
                }
            );
        },
        closeFullScreen() {
            try {
                this.loading.close();
            } catch {}
        },
        reload() {
            window.location.reload();
        }
    },
    mounted() {
        if (!this.$route.query.hasOwnProperty("_id")) {
            this.goBack();
        }
        if (this.$store.state.user != null) {
            this.user = this.$store.state.user;
        } else {
            this.user = {
                role: 0
            };
            window.location = "/";
            return false;
        }
        this.k = this.$route.query._id;
        let self = this;
        this.openFullScreen();
        this.axios
            .get(self.url + "/dataview/data/", {
                params: {
                    key: self.$route.query._id
                }
            })
            .then(response => {
                if (response.data.code === 200) {
                    self.data = JSON.stringify(
                        JSON.parse(response.data.data),
                        null,
                        4
                    );
                } else {
                    console.log(response);
                    self.$message({
                        showClose: true,
                        message: "服务器内部错误"
                    });
                }
                self.closeFullScreen();
            })
            .catch(response => {
                console.log(response);
                self.$message({
                    showClose: true,
                    message: "客户端错误，请求失败"
                });
                self.closeFullScreen();
            });
    }
};
</script>

<style lang="scss" scoped>
#dataview-datav {
    height: 100%;
    section {
        min-height: 100%;
        padding: 100px 50px 100px 50px;
        .panel {
            width: 90%;
            margin: 0 auto;
            box-shadow: #ccc 0 0 8px;
            padding: 30px;
            .opera {
                display: flex;
                padding: 15px 0;
                align-items: center;
                .el-input {
                    margin: 0 10px;
                }
                button {
                    margin-right: 10px;
                }
            }
            .set_view {
                display: flex;
                .view {
                    width: 600px;
                    height: 400px;
                    iframe {
                        width: 100%;
                        height: 100%;
                    }
                }
                .set {
                    margin-left: 15px;
                    flex: 1;
                }
            }
        }
    }
    footer {
        width: 100%;
        height: 60px;
        margin-top: -60px;
    }
}
</style>