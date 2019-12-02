<template>
    <div id="ahridata-survey" class="ahridata-survey">
        <comp-nav active="/ahridata/survey"></comp-nav>
        <section>
            <article>
                <div class="document">
                    <a v-if="document != ''" :href="document" target="_black">参考文档</a>
                </div>
                <br />
                <el-tabs type="border-card" v-model="tab">
                    <el-tab-pane name="access">
                        <span slot="label" class="nocopy">
                            <i class="el-icon-setting"></i> AccessKey
                        </span>
                        <div class="access">
                            <div>
                                <span class="name nocopy">AccessKey:</span>
                                <span class="key">{{ user._id }}</span>
                            </div>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane>
                        <span slot="label" class="nocopy">
                            <i class="el-icon-s-cooperation"></i> Library
                        </span>
                        <div class="download">
                            <div>
                                <a
                                    href="https://ahriknow.oss-cn-beijing.aliyuncs.com/adata.es5.min.js"
                                    target="_black"
                                >&lt;script src="https://ahriknow.oss-cn-beijing.aliyuncs.com/adata.es5.min.js" type="text/javascript"&gt;&lt;/script&gt;</a>
                            </div>
                            <div>
                                <a
                                    href="https://ahriknow.oss-cn-beijing.aliyuncs.com/adata.es6.min.js"
                                    target="_black"
                                >&lt;script src="https://ahriknow.oss-cn-beijing.aliyuncs.com/adata.es6.min.js" type="text/javascript"&gt;&lt;/script&gt;</a>
                            </div>
                            <div>
                                <a
                                    href="https://ahriknow.oss-cn-beijing.aliyuncs.com/adata.js"
                                    target="_black"
                                >&lt;script src="https://ahriknow.oss-cn-beijing.aliyuncs.com/adata.js" type="text/javascript"&gt;&lt;/script&gt;</a>
                            </div>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane name="dp">
                        <span slot="label" class="nocopy">
                            <i class="el-icon-s-data"></i> 数据池
                        </span>
                        <div class="opera">
                            <el-input v-model="search" placeholder="输入关键字搜索" clearable></el-input>
                            <el-button @click="handleNewDP">新建数据池</el-button>
                        </div>
                        <el-card
                            v-if="!datapool.some(item => item.name.includes(this.search)) || datapool.length == 0"
                            class="box-card"
                        >
                            <div class="tip">没有数据</div>
                        </el-card>
                        <el-card
                            v-for="i in datapool.filter(item => !search || item.name.includes(this.search))"
                            class="box-card"
                        >
                            <div slot="header" class="clearfix">
                                <span class="span">
                                    <i class="el-icon-s-data nocopy">&nbsp;:&nbsp;</i>
                                    <span style="font-size: 22px;font-weight: 700">{{ i.name }}</span>
                                </span>
                                <span class="span">
                                    <i class="el-icon-connection nocopy">&nbsp;:&nbsp;</i>
                                    {{ i._id }}
                                </span>
                                <span class="span">
                                    <i class="el-icon-key nocopy">&nbsp;:&nbsp;</i>
                                    {{ i.password }}
                                </span>
                                <el-button
                                    style="float: right; padding: 3px 0"
                                    type="text"
                                    @click="handleNewCol(i._id)"
                                >添加数据集</el-button>
                                <el-button
                                    style="float: right; padding: 3px 0"
                                    type="text"
                                    @click="handleEdit(i)"
                                >更改</el-button>
                                <el-button
                                    style="float: right; padding: 3px 0"
                                    type="text"
                                    @click="handleDelete(i._id)"
                                >删除</el-button>
                            </div>
                            <el-table :data="i.datacol" border style="width: 100%">
                                <el-table-column label="ID">
                                    <template slot-scope="scope">
                                        <span style="margin-left: 10px">{{ scope.row._id }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="数据集">
                                    <template slot-scope="scope">
                                        <span style="margin-left: 10px">{{ scope.row.name }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="描述">
                                    <template slot-scope="scope">
                                        <span style="margin-left: 10px">{{ scope.row.describe }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="日期" width="140">
                                    <template slot-scope="scope">
                                        <span style="margin-left: 10px">{{ scope.row.date }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="列数" width="100">
                                    <template slot-scope="scope">
                                        <span
                                            style="margin-left: 10px"
                                        >{{ scope.row.columns.length }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="操作" width="144">
                                    <template slot-scope="scope">
                                        <el-button
                                            size="mini"
                                            @click="handleEditTable(scope.$index, scope.row, i)"
                                        >编辑</el-button>
                                        <el-button
                                            size="mini"
                                            type="danger"
                                            @click="handleDeleteTable(scope.$index, scope.row)"
                                        >删除</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-card>
                    </el-tab-pane>
                    <el-tab-pane name="fp">
                        <span slot="label" class="nocopy">
                            <i class="el-icon-files"></i> 文件池
                        </span>
                        <div class="opera">
                            <el-input v-model="searchFile" placeholder="输入关键字搜索" clearable></el-input>
                            <el-button @click="handleNewFP">新建文件池</el-button>
                        </div>
                        <el-card
                            v-if="!fileData.some(item => item.name.includes(this.searchFile)) || fileData.length == 0"
                            class="box-card"
                        >
                            <div class="tip">没有数据</div>
                        </el-card>
                        <div class="cards">
                            <el-card
                                v-for="i in fileData.filter(item => !searchFile || item.name.includes(this.searchFile))"
                                class="box-card"
                            >
                                <div slot="header" class="clearfix">
                                    <span>{{ i.name }}</span>
                                    <el-button
                                        style="float: right; padding: 3px 0"
                                        type="text"
                                        @click="handleFiledata(i)"
                                    >进入文件池</el-button>
                                    <el-button
                                        style="float: right; padding: 3px 0"
                                        type="text"
                                        @click="handleDeleteFile(i._id)"
                                    >删除</el-button>
                                </div>
                                <div class="id">
                                    <i class="el-icon-connection nocopy">&nbsp;:&nbsp;</i>
                                    {{ i._id }}
                                </div>
                                <div class="password">
                                    <i class="el-icon-key nocopy">&nbsp;:&nbsp;</i>
                                    {{ i.password }}
                                </div>
                                <div class="size">
                                    <i class="el-icon-s-data nocopy">&nbsp;:&nbsp;</i>
                                    {{ i.size }}&nbsp;M
                                </div>
                            </el-card>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </article>
            <footer>
                <foot-nav></foot-nav>
            </footer>
        </section>
        <el-dialog
            title="新建数据池"
            :visible.sync="dialogFormVisible"
            @close="handleCancel"
            :close-on-click-modal="false"
        >
            <el-form :model="form">
                <el-form-item label="数据池名称" label-width="100px">
                    <el-input v-model="form.name" autocomplete="off" placeholder="数据池名称"></el-input>
                </el-form-item>
                <el-form-item label="数据池密钥" label-width="100px">
                    <el-input v-model="form.password" autocomplete="off" placeholder="数据池密钥"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="handleCancel">取 消</el-button>
                <el-button type="primary" @click="handleSave">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog
            title="添加数据集"
            :visible.sync="dialogTableVisible"
            width="800px"
            @close="handleCancelDC"
            :close-on-click-modal="false"
        >
            <span
                style="display: block;color: #333;margin-left: 44px;font-size: 18px;padding: 10px 0;"
            >默认已存在唯一&nbsp;&nbsp;id,&nbsp;列名不能包含空格</span>
            <el-form
                :model="dynamicValidateForm"
                ref="dynamicValidateForm"
                label-width="100px"
                class="demo-dynamic"
            >
                <el-form-item label="集合名">
                    <el-input
                        v-model="dynamicValidateForm.name"
                        placeholder="Collection Name"
                        style="width: 530px;"
                    ></el-input>
                </el-form-item>
                <el-form-item label="描述">
                    <el-input
                        v-model="dynamicValidateForm.describe"
                        placeholder="Collection Describe"
                        style="width: 530px;"
                    ></el-input>
                </el-form-item>
                <el-form-item
                    v-for="(column, index) in dynamicValidateForm.columns"
                    :label="'第 ' + (index + 1) + ' 列'"
                    :key="column.key"
                    :prop="'columns.' + index + '.name'"
                >
                    <el-input
                        v-model="column.name"
                        placeholder="Column Name"
                        style="width: 300px;margin-right: 15px;"
                    ></el-input>
                    <el-select v-model="column.type" placeholder="请选择" style="margin-right: 15px;">
                        <el-option v-for="i in typelist" :key="i" :label="i" :value="i"></el-option>
                    </el-select>
                    <el-button v-if="index > 0" @click.prevent="removeColumn(column)">删除</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button @click="addColumn">新增列</el-button>
                    <el-button type="primary" @click="submitForm('dynamicValidateForm')">提交</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <el-dialog
            title="添加文件池"
            :visible.sync="dialogFileVisible"
            width="800px"
            @close="handleCancelFP"
            :close-on-click-modal="false"
        >
            <el-form ref="form" :model="formFile" label-width="80px">
                <el-form-item label="文件池名">
                    <el-input v-model="formFile.name" placeholder="文件池名称"></el-input>
                </el-form-item>
                <el-form-item label="连接密钥">
                    <el-input v-model="formFile.password" placeholder="文件池密钥"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogFileVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitFileForm">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import CompNav from "@/components/CompNav.vue";
import FootNav from "@/components/FootNav.vue";
export default {
    name: "ahridata-survey",
    components: {
        "comp-nav": CompNav,
        "foot-nav": FootNav
    },
    data() {
        return {
            user: {
                role: 0
            },
            tab: "access",
            search: "",
            searchFile: "",
            show: false,
            dialogFormVisible: false,
            dialogTableVisible: false,
            dialogFileVisible: false,
            form: {
                name: "",
                password: ""
            },
            formFile: {
                name: "",
                password: "",
                dirs: [],
                size: 0
            },
            datapool: [],
            edit: false,
            dynamicValidateForm: {
                name: "",
                describe: "",
                columns: [
                    {
                        name: "",
                        type: "string",
                        key: Date.now()
                    }
                ]
            },
            typelist: ["int", "string", "boolen", "number"],
            tmp: "",
            fileData: [],
            document: "",
            loading: {}
        };
    },
    created() {},
    methods: {
        openFullScreen() {
            this.loading = this.$loading({
                lock: true,
                text: "Loading",
                spinner: "el-icon-loading",
                background: "rgba(0, 0, 0, 0.7)"
            });
        },
        handleEditTable(index, row, dp) {
            let data = {
                dp: dp,
                col: row
            };
            localStorage.setItem("params", JSON.stringify(data));
            this.$router.push({
                name: "ahridata-collection",
                params: data
            });
        },
        handleDeleteTable(index, row) {
            this.$confirm("确认删除？", "确认:", { type: "error" })
                .then(_ => {
                    let self = this;
                    this.openFullScreen();
                    this.axios
                        .delete(self.url + "/api/ahridata/datacol/", {
                            data: {
                                user_id: self.user._id,
                                _id: row._id
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
                                self.getData();
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
        handleNewDP() {
            this.dialogFormVisible = true;
        },
        handleNewFP() {
            this.dialogFileVisible = true;
        },
        handleCancel() {
            this.edit = false;
            this.form.name = "";
            this.form.password = "";
            this.dialogFormVisible = false;
        },
        handleCancelDC() {
            this.dynamicValidateForm = {
                name: "",
                describe: "",
                columns: [
                    {
                        name: "",
                        type: "string",
                        key: Date.now()
                    }
                ]
            };
        },
        handleCancelFP() {
            this.formFile.name = "";
            this.formFile.password = "";
            this.dialogFileVisible = false;
        },
        handleSave() {
            if (this.form.name == "") {
                this.$message({
                    showClose: true,
                    message: "请输入数据池名称",
                    type: "warning"
                });
                return;
            }
            if (this.form.password == "") {
                this.$message({
                    showClose: true,
                    message: "请输入数据池密钥",
                    type: "warning"
                });
                return;
            }
            if (this.edit) {
                this.form.user_id = this.user._id;
                let self = this;
                this.openFullScreen();
                this.axios
                    .put(self.url + "/api/ahridata/datapool/", self.form)
                    .then(response => {
                        if (response.data.code === 0) {
                            localStorage.removeItem("auth");
                            self.$router.push("/auth/login");
                        } else if (response.data.code === 200) {
                            self.datapool.forEach(item => {
                                if (item._id == response.data.data._id) {
                                    item.name = response.data.data.name;
                                    item.password = response.data.data.password;
                                }
                            });
                            self.$message({
                                showClose: true,
                                message: "更改成功",
                                type: "success"
                            });
                            self.handleCancel();
                        } else if (response.data.code === 400) {
                            self.$message({
                                showClose: true,
                                message: "名称重复",
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
            } else {
                let self = this;
                this.openFullScreen();
                this.form.user_id = this.user._id;
                this.axios({
                    url: self.url + "/api/ahridata/datapool/",
                    method: "post",
                    data: JSON.stringify(self.form),
                    headers: {
                        "Content-Type": "application/json"
                    }
                }).then(
                    function(response) {
                        if (response.data.code === 0) {
                            localStorage.removeItem("auth");
                            self.$router.push("/auth/login");
                        } else if (response.data.code === 200) {
                            self.datapool.push(response.data.data);
                            self.$message({
                                showClose: true,
                                message: "添加成功",
                                type: "success"
                            });
                            self.handleCancel();
                        } else if (response.data.code === 400) {
                            self.$message({
                                showClose: true,
                                message: "名称重复",
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
            }
        },
        handleEdit(val) {
            this.edit = true;
            this.form._id = val._id;
            this.form.name = val.name;
            this.form.password = val.password;
            this.dialogFormVisible = true;
        },
        getData() {
            let self = this;
            this.openFullScreen();
            this.axios
                .get(self.url + "/api/ahridata/datapool/", {
                    params: {
                        user_id: self.user._id
                    }
                })
                .then(response => {
                    if (response.data.code === 0) {
                        localStorage.removeItem("auth");
                        self.$router.push("/auth/login");
                    } else if (response.data.code === 200) {
                        self.datapool = response.data.data;
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
        handleDelete(id) {
            this.$confirm("确认删除？", "确认:", { type: "error" })
                .then(_ => {
                    let self = this;
                    this.openFullScreen();
                    this.axios
                        .delete(self.url + "/api/ahridata/datapool/", {
                            data: {
                                user_id: self.user._id,
                                _id: id
                            }
                        })
                        .then(response => {
                            if (response.data.code === 0) {
                                localStorage.removeItem("auth");
                                self.$router.push("/auth/login");
                            } else if (response.data.code === 200) {
                                self.datapool = self.datapool.filter(item => {
                                    return item._id != id;
                                });
                                self.$message({
                                    showClose: true,
                                    message: "删除成功",
                                    type: "success"
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
        handleFiledata(val) {
            localStorage.setItem("file", JSON.stringify(val));
            this.$router.push({ name: "ahridata-filedata", params: val });
        },
        handleDeleteFile(id) {
            this.$confirm("确认删除？", "确认:", { type: "error" })
                .then(_ => {
                    let self = this;
                    this.openFullScreen();
                    this.axios
                        .delete(self.url + "/api/ahridata/filepool/", {
                            data: {
                                user_id: self.user._id,
                                _id: id
                            }
                        })
                        .then(response => {
                            if (response.data.code === 0) {
                                localStorage.removeItem("auth");
                                self.$router.push("/auth/login");
                            } else if (response.data.code === 200) {
                                self.fileData = self.fileData.filter(item => {
                                    return item._id != id;
                                });
                                self.$message({
                                    showClose: true,
                                    message: "删除成功",
                                    type: "success"
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
        handleNewCol(id) {
            this.tmp = id;
            this.dialogTableVisible = true;
        },
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if (this.dynamicValidateForm.name == "") {
                    this.$message({
                        showClose: true,
                        message: "请输入集合名",
                        type: "warning"
                    });
                    return;
                }
                let arr = [];
                let tag = true;
                this.dynamicValidateForm.columns.forEach(column => {
                    if (column.name == "") {
                        this.$message({
                            showClose: true,
                            message: "列名不能为空",
                            type: "warning"
                        });
                        tag = false;
                    } else if (column.name.includes(" ")) {
                        this.$message({
                            showClose: true,
                            message: "列名不能包含空格",
                            type: "warning"
                        });
                        tag = false;
                    }
                    arr.push(column.name);
                });
                if (!tag) {
                    return;
                }
                if (new Set(arr).size != arr.length) {
                    this.$message({
                        showClose: true,
                        message: "列名不能重复",
                        type: "warning"
                    });
                    return;
                }
                if (valid) {
                    let self = this;
                    this.openFullScreen();
                    this.dynamicValidateForm.user_id = this.user._id;
                    this.dynamicValidateForm.datapool = this.tmp;
                    this.axios({
                        url: self.url + "/api/ahridata/datacol/",
                        method: "post",
                        data: JSON.stringify(self.dynamicValidateForm),
                        headers: {
                            "Content-Type": "application/json"
                        }
                    }).then(
                        function(response) {
                            if (response.data.code === 0) {
                                localStorage.removeItem("auth");
                                self.$router.push("/auth/login");
                            } else if (response.data.code === 200) {
                                self.$message({
                                    showClose: true,
                                    message: "添加成功",
                                    type: "success"
                                });
                                self.dialogTableVisible = false;
                                self.getData();
                            } else if (response.data.code === 400) {
                                self.$message({
                                    showClose: true,
                                    message: "名称重复",
                                    type: "warning"
                                });
                                self.loading.close();
                            } else {
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
        },
        submitFileForm() {
            if (this.formFile.name == "") {
                self.$message({
                    showClose: true,
                    message: "请输入文件池名称",
                    type: "warning"
                });
                return;
            }
            if (this.formFile.password == "") {
                self.$message({
                    showClose: true,
                    message: "请输入文件池密钥",
                    type: "warning"
                });
                return;
            }
            this.formFile.user_id = this.user._id;
            let self = this;
            this.openFullScreen();
            this.axios({
                url: self.url + "/api/ahridata/filepool/",
                method: "post",
                data: JSON.stringify(self.formFile),
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(
                function(response) {
                    if (response.data.code === 0) {
                        localStorage.removeItem("auth");
                        self.$router.push("/auth/login");
                    } else if (response.data.code === 200) {
                        self.$message({
                            showClose: true,
                            message: "添加成功",
                            type: "success"
                        });
                        self.fileData.push(response.data.data);
                        self.dialogFileVisible = false;
                    } else if (response.data.code === 400) {
                        self.$message({
                            showClose: true,
                            message: "名称重复",
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
        removeColumn(item) {
            var index = this.dynamicValidateForm.columns.indexOf(item);
            if (index !== -1) {
                this.dynamicValidateForm.columns.splice(index, 1);
            }
        },
        addColumn() {
            this.dynamicValidateForm.columns.push({
                name: "",
                type: "string",
                key: Date.now()
            });
        },
        getFilepool() {
            let self = this;
            this.openFullScreen();
            this.axios
                .get(self.url + "/api/ahridata/filepool/", {
                    params: {
                        user_id: self.user._id
                    }
                })
                .then(response => {
                    if (response.data.code === 0) {
                        localStorage.removeItem("auth");
                        self.$router.push("/auth/login");
                    } else if (response.data.code === 200) {
                        self.fileData = response.data.data;
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
    },
    mounted() {
        if (this.$store.state.user != null) {
            this.user = this.$store.state.user;
        } else {
            this.user = {
                role: 0
            };
            window.location = "/";
            return false;
        }
        this.getData();
        this.getFilepool();
        this.tab = this.$route.query.tab || "access";
        let self = this;
        this.openFullScreen();
        this.axios
            .get(self.url + "/api/setting/document/", {
                params: {
                    user_id: self.user._id,
                    who: 2
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
#ahridata-survey {
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
            .access {
                height: 300px;
                display: flex;
                justify-content: center;
                align-items: center;
                .name {
                    display: inline-block;
                    height: 30px;
                    width: 160px;
                    line-height: 30px;
                    text-align: center;
                    box-shadow: #ccc 0 0 6px;
                    background: #eee;
                    font-size: 24px;
                }
                .key {
                    display: inline-block;
                    height: 30px;
                    width: 360px;
                    line-height: 30px;
                    text-align: center;
                    box-shadow: #ccc 0 0 6px;
                    font-size: 24px;
                }
            }
            .download {
                height: 300px;
                div {
                    margin: 40px;
                    a {
                        margin: 20px;
                        color: #888;
                        font-size: 20px;
                        transition: 0.2s;
                        text-decoration: none;
                        &:hover {
                            color: #333;
                        }
                    }
                }
            }
            .opera {
                max-width: 1200px;
                margin: 20px auto;
                display: flex;
                justify-content: space-between;
                button {
                    margin-left: 100px;
                }
            }
            .text {
                font-size: 14px;
            }

            .item {
                margin-bottom: 18px;
            }

            .clearfix:before,
            .clearfix:after {
                display: table;
                content: "";
            }
            .clearfix:after {
                clear: both;
            }
            .box-card {
                max-width: 1200px;
                margin: 20px auto;
                .tip {
                    text-align: center;
                    color: #2c3e50;
                    font-size: 18px;
                }
                .clearfix {
                    .span {
                        margin: 0 20px;
                        box-shadow: #ccc 0 0 4px;
                        padding: 10px 20px 4px 0;
                        border-radius: 4px;
                        i {
                            font-size: 22px;
                            background: #eee;
                            padding: 5px;
                            border-radius: 4px;
                            margin-right: 20px;
                        }
                    }
                    button {
                        margin-left: 15px;
                    }
                }
            }
            .cards {
                display: flex;
                flex-wrap: wrap;
                max-width: 1200px;
                margin: 0 auto;
                .text {
                    font-size: 14px;
                }

                .item {
                    margin-bottom: 18px;
                }

                .clearfix:before,
                .clearfix:after {
                    display: table;
                    content: "";
                }
                .clearfix:after {
                    clear: both;
                }
                .box-card {
                    width: 31%;
                    margin: 1%;
                }
                @media screen and (max-width: 1500px) {
                    .box-card {
                        width: 48%;
                        margin: 1%;
                    }
                }
                @media screen and (max-width: 800px) {
                    .box-card {
                        width: 98%;
                        margin: 1%;
                    }
                }
                .id,
                .password,
                .size {
                    margin: 10px 0;
                    i {
                        font-size: 22px;
                        background: #eee;
                        padding: 5px;
                        border-radius: 4px;
                        margin-right: 5px;
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