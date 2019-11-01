<template>
    <div id="website-survey" class="website-survey">
        <comp-nav></comp-nav>
        <section>
            <article v-if="!user.website">
                <el-button type="primary" size="mini" @click="apply(false)">申请权限&nbsp\&nbsp刷新</el-button>
            </article>
            <article v-if="user.hasOwnProperty('website') && user.website == true">
                <el-card class="box-card">
                    <div class="opera">
                        <a v-if="document" :href="document" target="_black">参考文档</a>&nbsp;&nbsp;
                        <el-button type="primary" @click="new_website">添加网站</el-button>
                    </div>
                    <el-table :data="website" style="width: 100%">
                        <el-table-column type="expand">
                            <template slot-scope="props">
                                <el-form label-position="left" inline class="demo-table-expand">
                                    <el-form-item label="FTP 地址:">
                                        <span>{{ props.row.domain }}</span>
                                    </el-form-item>
                                    <el-form-item label="FTP 端口:">
                                        <span>21</span>
                                    </el-form-item>
                                    <el-form-item label="FTP 用户:">
                                        <span>{{ props.row.ftp_username }}</span>
                                    </el-form-item>
                                    <el-form-item label="FTP 密码:">
                                        <span>{{ props.row.ftp_password }}</span>
                                    </el-form-item>
                                    <el-form-item label="数据库地址:" v-if="props.row.sql">
                                        <span>{{ props.row.domain }}</span>&nbsp;&nbsp;&nbsp;&nbsp;
                                        <span>
                                            <el-switch
                                                style="display: inline-block"
                                                v-model="props.row.db_remote"
                                                active-color="#13ce66"
                                                inactive-color="#ff4949"
                                                active-text="远程"
                                                inactive-text="仅主机"
                                                @change="remote(props.row, props.row.db_username, props.row.db_remote)"
                                            ></el-switch>
                                        </span>
                                    </el-form-item>
                                    <el-form-item label="管理数据库:" v-if="props.row.sql">
                                        <span>
                                            <a
                                                href="http://mysql.ahriknow.org:888/phpmyadmin_f0a47bba7b4eaa77/index.php"
                                                target="_black"
                                            >管理数据库</a>
                                        </span>
                                    </el-form-item>
                                    <el-form-item label="MySQL 数据库名:" v-if="props.row.sql">
                                        <span>{{ props.row.db_username }}</span>
                                    </el-form-item>
                                    <el-form-item label="MySQL 字符集:" v-if="props.row.sql">
                                        <span>{{ props.row.db_charset }}</span>
                                    </el-form-item>
                                    <el-form-item label="MySQL 用户名:" v-if="props.row.sql">
                                        <span>{{ props.row.db_username }}</span>
                                    </el-form-item>
                                    <el-form-item label="MySQL 密码:" v-if="props.row.sql">
                                        <span>{{ props.row.db_password }}</span>
                                    </el-form-item>
                                </el-form>
                            </template>
                        </el-table-column>
                        <el-table-column label="网站名" prop="name" width="120"></el-table-column>
                        <el-table-column label="域名">
                            <template slot-scope="scope">
                                <a
                                    class="site_domain"
                                    :href="'http://' + scope.row.domain"
                                    target="_black"
                                >{{ scope.row.domain }}</a>
                            </template>
                        </el-table-column>
                        <el-table-column label="日期" prop="date"></el-table-column>
                        <el-table-column
                            label="用户"
                            prop="username"
                            width="120"
                            v-if="user.role > 90"
                        ></el-table-column>
                        <el-table-column label="状态" width="160">
                            <template slot-scope="scope">
                                <el-switch
                                    v-if="user.role > 90 || !scope.row.closed"
                                    style="display: block"
                                    v-model="scope.row.status"
                                    active-color="#13ce66"
                                    inactive-color="#ff4949"
                                    active-text="启用"
                                    inactive-text="停止"
                                    @change="change(scope.row, false)"
                                ></el-switch>
                                <span v-if="user.role <= 90 && scope.row.closed">该站点被禁用</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="Tomcat" width="160">
                            <template slot-scope="scope">
                                <el-switch
                                    style="display: block"
                                    v-model="scope.row.tomcat"
                                    active-color="#13ce66"
                                    inactive-color="#ff4949"
                                    active-text="启用"
                                    inactive-text="关闭"
                                    @change="change(scope.row, true)"
                                ></el-switch>
                            </template>
                        </el-table-column>
                        <el-table-column label="删除" width="120">
                            <template slot-scope="scope">
                                <el-button
                                    type="text"
                                    @click="file(scope.row._id, scope.row.domain)"
                                >文件</el-button>
                                <el-button type="text" @click="deleteSite(scope.row._id)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-card>
            </article>
            <footer>
                <foot-nav></foot-nav>
            </footer>
        </section>
        <el-dialog
            title="新建站点"
            :visible.sync="dialogFormVisible"
            @close="close"
            :close-on-click-modal="false"
        >
            <el-form :model="form">
                <el-form-item label="站点名称" label-width="120px">
                    <el-input v-model="form.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="域名" label-width="120px">
                    <el-input v-model="form.domain" autocomplete="off" style="width:60%"></el-input>
                    <el-select
                        v-model="form.main_domain"
                        placeholder="请选择"
                        style="width:39%;margin-left: 1%"
                    >
                        <el-option label=".ahriknow.org" value=".ahriknow.org"></el-option>
                        <el-option label=".aknow.xyz" value=".aknow.xyz"></el-option>
                        <el-option label=".codeline.xyz" value=".codeline.xyz"></el-option>
                        <el-option label="自定义" value="auto"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label label-width="120px" v-show="form.main_domain == 'auto'">
                    <el-tag
                        type="danger"
                        effect="plain"
                        style="font-size: 16px"
                    >请将自定义域名的 CNAME 解析指向 ahriknow.org</el-tag>
                </el-form-item>
                <el-form-item label="FTP 用户名" label-width="120px">
                    <el-input v-model="form.ftp_username" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="FTP 密码" label-width="120px">
                    <el-input v-model="form.ftp_password" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="MySQL" label-width="120px">
                    <el-switch
                        style="display: block;margin-top: 8px;"
                        v-model="form.sql"
                        active-color="#13ce66"
                        inactive-color="#ff4949"
                        active-text="创建 MySQL"
                    ></el-switch>
                </el-form-item>
                <el-form-item label="MySQL 用户名" label-width="120px" v-show="form.sql">
                    <el-input v-model="form.db_username" autocomplete="off" style="width:360px"></el-input>&nbsp;&nbsp;
                    <span style="font-size: 18px">数据库同名</span>
                </el-form-item>
                <el-form-item label="MySQL 密码" label-width="120px" v-show="form.sql">
                    <el-input v-model="form.db_password" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="MySQL 字符集" label-width="120px" v-show="form.sql">
                    <el-select v-model="form.db_charset" placeholder="请选择字符集">
                        <el-option label="utf8" value="utf8"></el-option>
                        <el-option label="utf8mb4" value="utf8mb4"></el-option>
                        <el-option label="gbk" value="gbk"></el-option>
                        <el-option label="big5" value="big5"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="add_website">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog
            title="文件"
            :visible.sync="dialogTableVisible"
            :close-on-click-modal="false"
            width="80%"
        >
            <el-table :data="files" style="width: 100%">
                <el-table-column label="Name">
                    <template slot-scope="scope">
                        <i v-show="scope.row.type == 'dir'" class="el-icon-folder-opened"></i>
                        <i v-show="scope.row.type == 'file'" class="el-icon-tickets"></i>
                        <span style="margin-left: 10px">{{ scope.row.name }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="Size">
                    <template slot-scope="scope">
                        <span style="margin-left: 10px">{{ scope.row.size }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180">
                    <template slot-scope="scope">
                        <div class="div" style="text-align: right">
                            <el-button
                                size="mini"
                                v-if="scope.row.name.endWith('.zip')"
                                @click="unzip(scope.row)"
                            >解压</el-button>
                            <el-button size="mini" type="danger" @click="deleteFile(scope.row)">删除</el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <br />
            <el-upload
                class="upload-demo"
                drag
                :show-file-list="false"
                :data="{path: web.domain}"
                action="https://ahriknow.org/upload/"
                :on-success="success"
                :before-upload="before"
            >
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">
                    将文件拖到此处，或
                    <em>点击上传</em>
                </div>
            </el-upload>
        </el-dialog>
        <el-dialog title="申请" :visible.sync="show">
            <el-form>
                <el-form-item label="留言" label-width="120px">
                    <el-input
                        autocomplete="off"
                        type="textarea"
                        placeholder="请输入留言"
                        v-model="msg"
                        rows="6"
                    >></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="show = false">取 消</el-button>
                <el-button type="primary" @click="apply(true)">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import CompNav from "@/components/CompNav.vue";
import FootNav from "@/components/FootNav.vue";
export default {
    name: "website-survey",
    components: {
        "comp-nav": CompNav,
        "foot-nav": FootNav
    },
    data() {
        return {
            user: {
                role: 0
            },
            filter: "",
            dialogFormVisible: false,
            dialogTableVisible: false,
            form: {
                name: "",
                domain: "",
                main_domain: ".ahriknow.org",
                ftp_username: "",
                ftp_password: "",
                sql: false,
                db_username: "",
                db_password: "",
                db_charset: "utf8mb4"
            },
            website: [],
            document: "",
            loading: {},
            files: [],
            web: {},
            show: false,
            msg: ""
        };
    },
    created() {},
    methods: {
        apply(val) {
            if (!val) {
                let self = this;
                this.openFullScreen();
                this.axios
                    .get(self.url + "/api/setting/apply/", {
                        params: {
                            user_id: self.user._id,
                            name: "website"
                        }
                    })
                    .then(response => {
                        if (response.data.code === 0) {
                            localStorage.removeItem("auth");
                            self.$router.push("/auth/login");
                        } else if (response.data.code === 200) {
                            self.show = true;
                        } else if (response.data.code === 400) {
                            self.user.website = true;
                            self.$store.commit(
                                "SAVE_USER",
                                JSON.stringify(self.user)
                            );
                            self.user = self.$store.state.user;
                        } else {
                            console.log(response);
                            self.$message({
                                showClose: true,
                                message: "服务器内部错误"
                            });
                        }
                        self.loading.close();
                    })
                    .catch(response => {
                        console.log(response);
                        self.$message({
                            showClose: true,
                            message: "客户端错误，请求失败"
                        });
                        self.loading.close();
                    });
            }
            if (val) {
                let self = this;
                this.openFullScreen();
                this.axios({
                    url: self.url + "/api/setting/apply/",
                    method: "post",
                    data: JSON.stringify({
                        user_id: self.user._id,
                        name: "website",
                        msg: self.msg
                    }),
                    headers: {
                        "Content-Type": "application/json"
                    }
                }).then(
                    function(response) {
                        if (response.data.code === 200) {
                            self.$message({
                                showClose: true,
                                message: "成功提交申请",
                                type: "success"
                            });
                            self.show = false;
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
            }
        },
        before() {
            this.openFullScreen();
        },
        success() {
            this.file(this.web._id, this.web.domain);
        },
        deleteFile(val) {
            this.$confirm("确认删除？", "确认:", { type: "error" })
                .then(_ => {
                    let self = this;
                    this.openFullScreen();
                    this.axios
                        .delete(self.url + "/api/website/files/", {
                            data: {
                                user_id: self.user._id,
                                _id: self.web._id,
                                name: val.name,
                                type: val.type
                            }
                        })
                        .then(response => {
                            if (response.data.code === 0) {
                                localStorage.removeItem("auth");
                                self.$router.push("/auth/login");
                            } else if (response.data.code === 200) {
                                self.$message({
                                    showClose: true,
                                    message: "删除成功",
                                    type: "success"
                                });
                                self.files = [];
                                response.data.data.dir.forEach(dir => {
                                    self.files.push({
                                        name: dir.split(";")[0],
                                        type: "dir",
                                        size: ""
                                    });
                                });
                                response.data.data.files.forEach(file => {
                                    self.files.push({
                                        name: file.split(";")[0],
                                        type: "file",
                                        size: file.split(";")[1]
                                    });
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
                            self.loading.close();
                        })
                        .catch(response => {
                            console.log(response);
                            self.$message({
                                showClose: true,
                                message: "客户端错误，请求失败"
                            });
                            self.loading.close();
                        });
                })
                .catch(_ => {
                    this.$message({
                        showClose: true,
                        message: "取消删除"
                    });
                });
        },
        unzip(val) {
            let self = this;
            this.openFullScreen();
            this.axios({
                url: self.url + "/api/website/files/",
                method: "post",
                data: JSON.stringify({
                    user_id: self.user._id,
                    _id: self.web._id,
                    name: val.name
                }),
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(
                function(response) {
                    if (response.data.code === 200) {
                        self.$message({
                            showClose: true,
                            message: "解压成功",
                            type: "success"
                        });
                        self.files = [];
                        response.data.data.dir.forEach(dir => {
                            self.files.push({
                                name: dir.split(";")[0],
                                type: "dir",
                                size: ""
                            });
                        });
                        response.data.data.files.forEach(file => {
                            self.files.push({
                                name: file.split(";")[0],
                                type: "file",
                                size: file.split(";")[1]
                            });
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
        },
        file(_id, domain) {
            this.web._id = _id;
            this.web.domain = domain;
            this.files = [];
            let self = this;
            this.openFullScreen();
            this.axios
                .get(self.url + "/api/website/files/", {
                    params: {
                        user_id: self.user._id,
                        _id: _id
                    }
                })
                .then(response => {
                    if (response.data.code === 0) {
                        localStorage.removeItem("auth");
                        self.$router.push("/auth/login");
                    } else if (response.data.code === 200) {
                        response.data.data.dir.forEach(dir => {
                            self.files.push({
                                name: dir.split(";")[0],
                                type: "dir",
                                size: ""
                            });
                        });
                        response.data.data.files.forEach(file => {
                            self.files.push({
                                name: file.split(";")[0],
                                type: "file",
                                size: file.split(";")[1]
                            });
                        });
                        self.dialogTableVisible = true;
                    } else {
                        console.log(response);
                        self.$message({
                            showClose: true,
                            message: "服务器内部错误"
                        });
                    }
                    self.loading.close();
                })
                .catch(response => {
                    console.log(response);
                    self.$message({
                        showClose: true,
                        message: "客户端错误，请求失败"
                    });
                    self.loading.close();
                });
        },
        openFullScreen() {
            this.loading = this.$loading({
                lock: true,
                text: "Loading。。。",
                spinner: "el-icon-loading",
                background: "rgba(0, 0, 0, 0.7)"
            });
        },
        close() {
            this.form = {
                name: "",
                domain: "",
                main_domain: ".ahriknow.org",
                ftp_username: "",
                ftp_password: "",
                sql: false,
                db_username: "",
                db_password: "",
                db_charset: "utf8mb4"
            };
        },
        new_website() {
            this.dialogFormVisible = true;
        },
        add_website() {
            const h = this.$createElement;
            if (this.form.name == "") {
                this.$notify({
                    title: "提示：",
                    message: h("i", { style: "color: #f0932b" }, "请输入站点名")
                });
                return;
            }
            if (this.form.domain == "") {
                this.$notify({
                    title: "提示：",
                    message: h("i", { style: "color: #f0932b" }, "请输入域名")
                });
                return;
            }
            if (this.form.ftp_username.length < 4) {
                this.$notify({
                    title: "提示：",
                    message: h(
                        "i",
                        { style: "color: #f0932b" },
                        "FTP 用户名长度最少为 4"
                    )
                });
                return;
            }
            let str = this.form.ftp_username;
            let t = str.charAt(0).toLowerCase();
            if (t > "z" || t < "a") {
                this.$notify({
                    title: "提示：",
                    message: h(
                        "i",
                        { style: "color: #f0932b" },
                        "FTP 用户名应以字母开头"
                    )
                });
                return;
            }
            if (this.form.ftp_password.length < 4) {
                this.$notify({
                    title: "提示：",
                    message: h(
                        "i",
                        { style: "color: #f0932b" },
                        "FTP 密码长度最少为 4"
                    )
                });
                return;
            }
            if (this.form.sql) {
                if (this.form.db_username.length < 4) {
                    this.$notify({
                        title: "提示：",
                        message: h(
                            "i",
                            { style: "color: #f0932b" },
                            "数据库 用户名长度最少为 4"
                        )
                    });
                    return;
                }
                let db_str = this.form.db_username;
                let db_t = db_str.charAt(0).toLowerCase();
                if (db_t > "z" || db_t < "a") {
                    this.$notify({
                        title: "提示：",
                        message: h(
                            "i",
                            { style: "color: #f0932b" },
                            "数据库 用户名应以字母开头"
                        )
                    });
                    return;
                }
                if (this.form.db_password.length < 4) {
                    this.$notify({
                        title: "提示：",
                        message: h(
                            "i",
                            { style: "color: #f0932b" },
                            "数据库 密码长度最少为 4"
                        )
                    });
                    return;
                }
            }
            let self = this;
            this.openFullScreen();
            this.form.user_id = this.user._id;
            this.form.username = this.user.username;
            this.axios({
                url: self.url + "/api/website/vhost/",
                method: "post",
                data: JSON.stringify(self.form),
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(
                function(response) {
                    if (response.data.code === 200) {
                        self.website.push(response.data.data);
                        self.$message({
                            showClose: true,
                            message: "站点创建成功",
                            type: "success"
                        });
                        self.dialogFormVisible = false;
                    } else if (response.data.code === 201) {
                        self.website.push(response.data.data);
                        self.$message({
                            showClose: true,
                            message: "站点创建成功,但数据库创建失败",
                            type: "warning"
                        });
                        self.dialogFormVisible = false;
                    } else if (response.data.code === 400) {
                        self.$message({
                            showClose: true,
                            message: "网络错误，请刷新重试",
                            type: "warning"
                        });
                    } else if (response.data.code === 401) {
                        self.$message({
                            showClose: true,
                            message: "域名重复",
                            type: "warning"
                        });
                    } else if (response.data.code === 402) {
                        self.$message({
                            showClose: true,
                            message: "FTP 用户名重复",
                            type: "warning"
                        });
                    } else if (response.data.code === 403) {
                        self.$message({
                            showClose: true,
                            message: "数据库 用户名重复",
                            type: "warning"
                        });
                    } else if (response.data.code === 444) {
                        self.$message({
                            showClose: true,
                            message: response.data.msg,
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
        },
        deleteSite(_id) {
            this.$confirm("确认删除？", "确认:", { type: "error" })
                .then(_ => {
                    let self = this;
                    this.openFullScreen();
                    this.axios
                        .delete(self.url + "/api/website/vhost/", {
                            data: {
                                user_id: self.user._id,
                                _id: _id
                            }
                        })
                        .then(response => {
                            if (response.data.code === 0) {
                                localStorage.removeItem("auth");
                                self.$router.push("/auth/login");
                            } else if (response.data.code === 200) {
                                self.website = self.website.filter(item => {
                                    return item._id != _id;
                                });
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
                            self.loading.close();
                        })
                        .catch(response => {
                            console.log(response);
                            self.$message({
                                showClose: true,
                                message: "客户端错误，请求失败"
                            });
                            self.loading.close();
                        });
                })
                .catch(_ => {
                    this.$message({
                        showClose: true,
                        message: "取消删除"
                    });
                });
        },
        change(val, tomcat) {
            if (tomcat) {
                this.loading = this.$loading({
                    lock: true,
                    text: "设置 Tomcat 较慢，请等待",
                    spinner: "el-icon-loading",
                    background: "rgba(0, 0, 0, 0.7)"
                });
            } else {
                this.loading = this.$loading({
                    lock: true,
                    text: "Loading。。。",
                    spinner: "el-icon-loading",
                    background: "rgba(0, 0, 0, 0.7)"
                });
            }
            let self = this;
            this.openFullScreen();
            this.axios
                .put(self.url + "/api/website/vhost/", {
                    user_id: self.user._id,
                    _id: val._id,
                    status: val.status,
                    tomcat: tomcat,
                    remote: {
                        ch: false
                    }
                })
                .then(response => {
                    if (response.data.code === 0) {
                        localStorage.removeItem("auth");
                        self.$router.push("/auth/login");
                    } else if (response.data.code === 200) {
                        self.$message({
                            showClose: true,
                            message: "网站状态更改成功",
                            type: "success"
                        });
                    } else if (response.data.code === 400) {
                        self.$message({
                            showClose: true,
                            message: "出现错误，请刷新重试",
                            type: "warning"
                        });
                    } else {
                        console.log(response.data);
                        self.$message({
                            showClose: true,
                            message: "服务器内部错误"
                        });
                    }
                    self.loading.close();
                })
                .catch(response => {
                    console.log(response);
                    self.$message({
                        showClose: true,
                        message: "客户端错误，请求失败"
                    });
                    self.loading.close();
                });
        },
        remote(val, name, remote) {
            let self = this;
            this.openFullScreen();
            this.axios
                .put(self.url + "/api/website/vhost/", {
                    user_id: self.user._id,
                    _id: val._id,
                    status: "",
                    tomcat: "",
                    remote: {
                        ch: true,
                        name: name,
                        re: remote
                    }
                })
                .then(response => {
                    if (response.data.code === 0) {
                        localStorage.removeItem("auth");
                        self.$router.push("/auth/login");
                    } else if (response.data.code === 200) {
                        self.$message({
                            showClose: true,
                            message: "网站状态更改成功",
                            type: "success"
                        });
                    } else if (response.data.code === 400) {
                        self.$message({
                            showClose: true,
                            message: "出现错误，请刷新重试",
                            type: "warning"
                        });
                    } else {
                        console.log(response.data);
                        self.$message({
                            showClose: true,
                            message: "服务器内部错误"
                        });
                    }
                    self.loading.close();
                })
                .catch(response => {
                    console.log(response);
                    self.$message({
                        showClose: true,
                        message: "客户端错误，请求失败"
                    });
                    self.loading.close();
                });
        }
    },
    mounted() {
        String.prototype.endWith = function(endStr) {
            var d = this.length - endStr.length;
            return d >= 0 && this.lastIndexOf(endStr) == d;
        };
        if (this.$store.state.user != null) {
            this.user = this.$store.state.user;
        } else {
            this.user = {
                role: 0
            };
            window.location = "/";
            return false;
        }
        let self = this;
        this.openFullScreen();
        this.axios
            .get(self.url + "/api/website/vhost/", {
                params: {
                    user_id: self.user._id
                }
            })
            .then(response => {
                if (response.data.code === 0) {
                    localStorage.removeItem("auth");
                    self.$router.push("/auth/login");
                } else if (response.data.code === 200) {
                    self.website = response.data.data;
                } else {
                    console.log(response);
                    self.$message({
                        showClose: true,
                        message: "服务器内部错误"
                    });
                }
                self.loading.close();
            })
            .catch(response => {
                console.log(response);
                self.$message({
                    showClose: true,
                    message: "客户端错误，请求失败"
                });
                self.loading.close();
            });
        this.openFullScreen();
        this.axios
            .get(self.url + "/api/setting/document/", {
                params: {
                    user_id: self.user._id,
                    who: 4
                }
            })
            .then(response => {
                if (response.data.code === 0) {
                    localStorage.removeItem("auth");
                    self.$router.push("/auth/login");
                } else if (response.data.code === 200) {
                    self.document = response.data.data.url;
                } else {
                    console.log(response);
                    self.$message({
                        showClose: true,
                        message: "服务器内部错误"
                    });
                }
                self.loading.close();
            })
            .catch(response => {
                console.log(response);
                self.$message({
                    showClose: true,
                    message: "客户端错误，请求失败"
                });
                self.loading.close();
            });
    }
};
</script>

<style lang="scss" scoped>
#website-survey {
    height: 100%;
    overflow: hidden;
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
                width: 1300px;
                margin: 0 auto;
                .opera {
                    padding: 15px 0;
                    text-align: right;
                }
                .demo-table-expand {
                    font-size: 0;
                }
                .demo-table-expand label {
                    width: 90px;
                    color: #99a9bf;
                }
                .demo-table-expand .el-form-item {
                    margin-right: 0;
                    margin-bottom: 0;
                    width: 50%;
                }
                .site_domain {
                    font-size: 18px;
                    color: #666;
                    transition: 0.3s;
                    &:hover {
                        color: #999;
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
}
</style>