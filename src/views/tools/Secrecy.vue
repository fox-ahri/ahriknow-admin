<template>
    <div id="tools-secrecy" class="tools-secrecy">
        <el-row>
            <el-col :xs="12" :sm="10" :md="8" :lg="6">
                <el-tabs tab-position="left" v-model="activeName">
                    <el-tab-pane label="单向加密" name="first">
                        <div class="type">
                            <el-button plain @click="secrecy('md5')">MD5 En</el-button>
                        </div>
                        <div class="type">
                            <el-button plain @click="secrecy('sha1')">SHA-1 En</el-button>
                        </div>
                        <div class="type">
                            <el-button plain @click="secrecy('sha224')">SHA-224 En</el-button>
                        </div>
                        <div class="type">
                            <el-button plain @click="secrecy('sha256')">SHA-256 En</el-button>
                        </div>
                        <div class="type">
                            <el-button plain @click="secrecy('sha384')">SHA-384 En</el-button>
                        </div>
                        <div class="type">
                            <el-button plain @click="secrecy('sha512')">SHA-512 En</el-button>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="对称加密" name="second">
                        <div class="type">
                            <el-input v-model="key" placeholder="请输入 KEY"></el-input>
                        </div>
                        <div class="type">
                            <el-button plain @click="secrecy('des')">DES Encode</el-button>
                        </div>
                        <div class="type">
                            <el-button plain @click="secrecy('d-des')">DES Decode</el-button>
                        </div>
                        <div class="type">
                            <el-button plain @click="secrecy('des3')">DES3 Encode</el-button>
                        </div>
                        <div class="type">
                            <el-button plain @click="secrecy('d-des3')">DES3 Decode</el-button>
                        </div>
                        <div class="type">
                            <el-button plain @click="secrecy('aes')">AES Encode</el-button>
                        </div>
                        <div class="type">
                            <el-button plain @click="secrecy('d-aes')">AES Decode</el-button>
                        </div>
                        <div class="type">
                            <el-button plain @click="secrecy('base64')">Base64 Encode</el-button>
                        </div>
                        <div class="type">
                            <el-button plain @click="secrecy('d-base64')">Base64 Decode</el-button>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="非对称加密" name="thred">
                        <div class="type">
                            <el-button plain @click="secrecy('rsa')">RSA Encode</el-button>
                        </div>
                        <div class="type">
                            <el-button plain @click="secrecy('d-rsa')">RSA Decode</el-button>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </el-col>
            <el-col :xs="12" :sm="14" :md="16" :lg="18">
                <el-row>
                    <el-col :span="11" v-show="activeName == 'thred'">
                        <div class="key">
                            <div class="len">
                                <el-select v-model="length" placeholder="请选择 密钥长度">
                                    <el-option label="1024" value="1024"></el-option>
                                    <el-option label="2048" value="2048"></el-option>
                                </el-select>
                                <el-input placeholder="请输入密码(为空不设置)" v-model="pass" clearable></el-input>
                                <el-button plain @click="secrecy('')">生成</el-button>
                            </div>
                            <el-input
                                clear="private"
                                type="textarea"
                                :rows="19"
                                placeholder="Private Key"
                                v-model="priK"
                            ></el-input>
                            <br />
                            <el-input
                                type="textarea"
                                :rows="10"
                                placeholder="Public Key"
                                v-model="pubK"
                            ></el-input>
                        </div>
                    </el-col>
                    <el-col :span="activeName == 'thred'? 13:24">
                        <el-row>
                            <el-col :span="24">
                                <codemirror v-model="code" :options="options"></codemirror>
                                <div class="btn-bottom">
                                    <el-button
                                        plain
                                        @click="code = ''"
                                        size="small"
                                        icon="el-icon-top"
                                    >清空</el-button>
                                    <el-button
                                        plain
                                        v-clipboard:copy="code"
                                        v-clipboard:success="success"
                                        v-clipboard:error="onError"
                                        size="small"
                                        icon="el-icon-top"
                                    >复制</el-button>
                                    <el-button
                                        plain
                                        @click="code = result"
                                        icon="el-icon-upload2"
                                        style="transform: translate(30px, 30px);width: 80px"
                                    ></el-button>
                                </div>
                            </el-col>
                            <el-col :span="24">
                                <div class="btn-bottom">
                                    <el-button
                                        plain
                                        @click="result = ''"
                                        size="small"
                                        icon="el-icon-bottom"
                                    >清空</el-button>
                                    <el-button
                                        plain
                                        v-clipboard:copy="result"
                                        v-clipboard:success="success"
                                        v-clipboard:error="onError"
                                        size="small"
                                        icon="el-icon-bottom"
                                    >复制</el-button>
                                </div>
                                <codemirror v-model="result" :options="options"></codemirror>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import { codemirror } from "vue-codemirror-lite";
require("codemirror/theme/3024-day.css");
export default {
    name: "tools-secrecy",
    components: {
        codemirror
    },
    data() {
        return {
            options: {
                mode: "string",
                tabSize: 4,
                lineNumbers: true,
                lineWrapping: true,
                theme: "3024-day",
                extraKeys: { "Ctrl-Space": "autocomplete" }
            },
            key: "",
            code: "",
            result: "",
            activeName: "first",
            priK: "",
            pubK: "",
            pass: "",
            length: "1024"
        };
    },
    methods: {
        copy() {
            var Url2 = document.getElementById("test");
            Url2.select();
            document.execCommand("Copy");
            alert("已复制好，可贴粘。");
        },
        success() {
            this.$message({
                message: "复制成功",
                type: "success"
            });
        },
        onError() {
            this.$message.error("复制出错了");
        },
        secrecy(val) {
            if (this.code == "" && val != "") {
                this.$notify.error({
                    title: "错误",
                    message: "还没有内容呢",
                    position: "top-right"
                });
                return;
            }
            let self = this;
            let form = {};
            if (this.activeName == "first") {
                form = {
                    type: val,
                    value: this.code
                };
            } else if (this.activeName == "second") {
                if (this.key == "") {
                    this.$notify.error({
                        title: "错误",
                        message: "请输入密钥",
                        position: "top-right"
                    });
                    return;
                }
                form = {
                    algorithm: val,
                    value: this.code,
                    key: this.key
                };
            } else {
                let op = 1;
                if (val == "rsa") op = 2;
                if (val == "d-rsa") op = 3;
                form = {
                    opera: op,
                    length: this.length,
                    pass: this.pass,
                    priK: this.priK,
                    pubK: this.pubK,
                    value: this.code
                };
            }
            window.loading = this.$loading({
                lock: true,
                text: "Loading",
                spinner: "el-icon-loading",
                background: "rgba(0, 0, 0, 0.7)"
            });
            this.axios({
                url: self.url + "/tools/secrecy/",
                method: "post",
                data: JSON.stringify(form),
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(
                function(response) {
                    if (response.data.code === 200) {
                        if (response.data.data.hasOwnProperty("opera")) {
                            if (response.data.data.opera == "1") {
                                self.priK = response.data.data.priK;
                                self.pubK = response.data.data.pubK;
                            } else {
                                self.result = response.data.data.result;
                            }
                        } else {
                            self.result = response.data.data.result;
                        }
                        self.$message({
                            showClose: true,
                            message: "成功",
                            type: "success"
                        });
                    } else if (response.data.code === 400) {
                        self.$message({
                            showClose: true,
                            type: "warning",
                            message: response.data.msg
                        });
                    } else if (response.data.code === 500) {
                        self.$message({
                            showClose: true,
                            message: response.data.msg
                        });
                    } else {
                        console.log(response);
                        self.$message({
                            showClose: true,
                            message: "服务器内部错误"
                        });
                    }
                    try {
                        window.loading.close();
                    } catch {}
                },
                function(response) {
                    console.log(response);
                    self.$message({
                        showClose: true,
                        message: "客户端错误，请求失败"
                    });
                    try {
                        window.loading.close();
                    } catch {}
                }
            );
        }
    },
    mounted() {}
};
</script>

<style lang="scss" scoped>
#tools-secrecy {
    .type {
        margin: 10px 15px;
        display: flex;
        .el-button {
            width: 100%;
        }
    }
    .btn-bottom {
        padding: 10px 0;
    }
    .key {
        display: flex;
        flex-direction: column;
        padding: 0 10px;
        .len {
            display: flex;
            margin-bottom: 10px;
        }
    }
}
</style>