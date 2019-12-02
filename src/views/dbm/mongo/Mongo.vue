<template>
    <div id="dbm-mongo-mongo" class="dbm-mongo-mongo">
        <aside ref="aside">
            <nav>
                <div class="title">Ahri - MongoAdmin</div>
                <div class="nav">
                    <i class="iconfont akhome" @click="home"></i>
                    <i class="iconfont aklog-out" @click="exit"></i>
                </div>
            </nav>
            <article>
                <el-button style="margin 10px 0;width: 100%;">新建数据库</el-button>
                <el-collapse
                    v-model="activeDB"
                    @change="handleShowDB"
                    accordion
                    style="padding-left: 15px;"
                >
                    <el-collapse-item
                        v-for="i in databases"
                        v-if="i.name != 'config'"
                        :title="i.name"
                        :name="i.name"
                    >
                        <el-card class="box-card">
                            <div class="opera">
                                <el-button icon="el-icon-plus" size="mini"></el-button>&nbsp;
                                <el-input placeholder="请输入过滤内容" size="mini" clearable></el-input>
                            </div>
                            <div style="padding: 5px">
                                <div
                                    class="table"
                                    v-for="j in i.cols.filter(tb => !i.search || tb.col_name.includes(i.search))"
                                    :title="j.col_name"
                                    @click="handleShowTB(i.name, j.col_name)"
                                >
                                    <i
                                        class="el-icon-circle-close"
                                        @click="delete_tb(i.name, j.col_name)"
                                    ></i>&nbsp;&nbsp;
                                    <span class="name">{{ j.col_name }}</span>
                                </div>
                            </div>
                        </el-card>
                    </el-collapse-item>
                </el-collapse>
            </article>
        </aside>
        <section ref="section">
            <el-card class="box-card1">
                <i ref="i" class="el-icon-s-fold" @click="show"></i>
            </el-card>
            <transition name="my">
                <el-card class="box-card2" v-show="show_page == 1">
                    <el-button-group>
                        <el-button icon="iconfont akhome" @click="home">
                            <b>&nbsp;Home</b>
                        </el-button>
                        <el-button icon="iconfont akSqlServer" @click="sql">
                            <b>&nbsp;NoSQL</b>
                        </el-button>
                        <el-button icon="iconfont akaccount" @click="user">
                            <b>&nbsp;账户</b>
                        </el-button>
                        <el-button icon="iconfont akimport" disabled>
                            <b>&nbsp;导入</b>
                        </el-button>
                    </el-button-group>
                </el-card>
            </transition>
            <transition name="my">
                <el-card class="box-card2" v-show="show_page == 2">
                    <el-button-group>
                        <el-button icon="iconfont akhome" @click="home">
                            <b>&nbsp;Home</b>
                        </el-button>
                        <el-button icon="iconfont akSqlServer" @click="sql">
                            <b>&nbsp;NoSQL</b>
                        </el-button>
                        <el-button icon="iconfont akaccount" @click="user">
                            <b>&nbsp;账户</b>
                        </el-button>
                        <el-button icon="iconfont akimport" disabled>
                            <b>&nbsp;导入</b>
                        </el-button>
                        <el-button icon="iconfont akexport" disabled>
                            <b>&nbsp;导出</b>
                        </el-button>
                        <el-button icon="iconfont akclear">
                            <b>&nbsp;删除</b>
                        </el-button>
                    </el-button-group>
                </el-card>
            </transition>
            <transition name="my">
                <el-card class="box-card2" v-show="show_page == 3">
                    <el-button-group>
                        <el-button icon="iconfont akhome" @click="home">
                            <b>&nbsp;Home</b>
                        </el-button>
                        <el-button icon="iconfont akSqlServer" @click="sql">
                            <b>&nbsp;NoSQL</b>
                        </el-button>
                        <el-button icon="iconfont akaccount" @click="user">
                            <b>&nbsp;账户</b>
                        </el-button>
                        <el-button icon="iconfont akimport" disabled>
                            <b>&nbsp;导入</b>
                        </el-button>
                        <el-button icon="iconfont akexport" disabled>
                            <b>&nbsp;导出</b>
                        </el-button>
                        <el-button icon="iconfont akinsert" disabled>
                            <b>&nbsp;插入</b>
                        </el-button>
                        <el-button
                            icon="iconfont akclear"
                            @click="delete_tb(select_db.name, select_tb.name)"
                        >
                            <b>&nbsp;删除</b>
                        </el-button>
                    </el-button-group>
                </el-card>
            </transition>
            <transition name="my">
                <el-card class="box-card2" v-show="show_page == 4">
                    <el-button-group>
                        <el-button icon="iconfont akhome" @click="home">
                            <b>&nbsp;Home</b>
                        </el-button>
                        <el-button icon="iconfont akaccount" @click="user">
                            <b>&nbsp;账户</b>
                        </el-button>
                    </el-button-group>
                </el-card>
            </transition>
            <article>
                <transition name="my">
                    <el-card class="box-card" v-show="show_page == 1">
                        <div class="item">
                            <el-card class="child-card">
                                <div>
                                    <span class="icon">
                                        <b>主机名</b>
                                    </span>
                                    <span class="content">{{ auth.host }}</span>
                                </div>
                                <div>
                                    <span class="icon">
                                        <b>用户</b>
                                    </span>
                                    <span class="content">{{ auth.user }}</span>
                                </div>
                                <div>
                                    <span class="icon">
                                        <b>版本</b>
                                    </span>
                                    <span class="content">{{ info.version?info.version:'' }}</span>
                                </div>
                                <div>
                                    <span class="icon">
                                        <b>最大Bson</b>
                                    </span>
                                    <span
                                        class="content"
                                    >{{ info.maxBsonObjectSize?info.maxBsonObjectSize:'' }}</span>
                                </div>
                            </el-card>
                        </div>
                        <div class="item">
                            <el-card class="child-card">
                                <div>
                                    <span class="icon">
                                        <b>系统</b>
                                    </span>
                                    <span
                                        class="content"
                                    >{{ info.buildEnvironment?info.buildEnvironment.target_os:'' }}</span>
                                </div>
                                <div>
                                    <span class="icon">
                                        <b>服务器</b>
                                    </span>
                                    <span
                                        class="content"
                                    >{{ info.buildEnvironment?info.buildEnvironment.distmod:'' }}</span>
                                </div>
                                <div>
                                    <span class="icon">
                                        <b>架构</b>
                                    </span>
                                    <span
                                        class="content"
                                    >{{ info.buildEnvironment?info.buildEnvironment.target_arch:'' }}</span>
                                </div>
                            </el-card>
                        </div>
                    </el-card>
                </transition>
                <transition name="my">
                    <el-card class="box-card" v-show="show_page == 2">
                        <el-table :data="select_db.cols" style="width: 100%">
                            <el-table-column label="集合名">
                                <template slot-scope="scope">
                                    <i class="el-icon-time"></i>
                                    <span style="margin-left: 10px">{{ scope.row.col_name }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="数据条数">
                                <template slot-scope="scope">
                                    <i class="el-icon-time"></i>
                                    <span style="margin-left: 10px">{{ scope.row.col_rows }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作">
                                <template slot-scope="scope">
                                    <el-button
                                        size="mini"
                                        type="primary"
                                        @click="handleShowTB(select_db.name, scope.row.col_name)"
                                    >浏览</el-button>
                                    <el-button
                                        size="mini"
                                        type="danger"
                                        @click="delete_tb(select_db.name, scope.row.col_name)"
                                    >删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-card>
                </transition>
                <transition name="my">
                    <div v-show="show_page == 3">
                        <el-card class="box-card">
                            <JsonViewer :value="select_tb.data" :expand-depth="2" copyable></JsonViewer>
                        </el-card>
                    </div>
                </transition>
                <transition name="my">
                    <div v-show="show_page == 4">
                        <el-card class="box-card">
                            <codemirror v-model="code" :options="options"></codemirror>
                        </el-card>
                        <div style="text-align: right;padding: 15px 0">
                            <el-button type="primary" @click="exec">执行</el-button>
                        </div>
                        <el-card class="box-card">
                            <JsonViewer :value="result" :expand-depth="2" copyable boxed sort></JsonViewer>
                        </el-card>
                    </div>
                </transition>
            </article>
        </section>
    </div>
</template>

<script>
import { codemirror } from "vue-codemirror-lite";
require("codemirror/mode/sql/sql.js");
require("codemirror/theme/3024-day.css");
import JsonViewer from "vue-json-viewer";
export default {
    name: "dbm-mongo-mongo",
    components: {
        codemirror,
        JsonViewer
    },
    data() {
        return {
            auth: {},
            iShow: true,
            show_page: 1,
            databases: [],
            loading: {},
            activeDB: "",
            select_db: {
                cols: []
            },
            select_tb: {
                name: "",
                data: {}
            },
            new_data: "",
            info: {},
            result: {},
            code: "",
            options: {
                mode: "sql",
                tabSize: 4,
                lineWrapping: true,
                theme: "3024-day",
                extraKeys: { "Ctrl-Space": "autocomplete" }
            }
        };
    },
    methods: {
        openFullScreen() {
            this.loading = this.$loading({
                lock: true,
                text: "Loading",
                spinner: "el-icon-loading",
                background: "rgba(0, 0, 0, 0.7)"
            });
        },
        show() {
            if (this.iShow) {
                this.$refs.aside.style.left = "-360px";
                this.$refs.section.style.left = "0";
                this.$refs.i.style.transform = "rotate(180deg)";
                this.iShow = false;
            } else {
                this.$refs.aside.style.left = "0";
                this.$refs.section.style.left = "360px";
                this.$refs.i.style.transform = "rotate(0)";
                this.iShow = true;
            }
        },
        handleShowDB(db_name) {
            if (!db_name) {
                this.show_page = 1;
                return;
            }
            this.activeDB = db_name;
            this.show_page = 2;
            let tag = 0;
            this.databases.forEach(db => {
                if (db.name == db_name) {
                    tag = db.cols.length;
                    this.select_db = db;
                }
            });
            if (tag != 0) return;
            this.execute(
                {
                    cols: [`show collections`, db_name]
                },
                data => {
                    let tmp = [];
                    data.cols.forEach(col => {
                        tmp.push({
                            col_name: col[0],
                            col_rows: col[1]
                        });
                    });
                    this.databases.forEach(db => {
                        if (db.name == db_name) {
                            db.cols = tmp;
                            this.select_db = db;
                        }
                    });
                }
            );
        },
        handleShowTB(db, tb) {
            this.show_page = 3;
            this.select_tb.name = tb;
            let s = this.createSql(`use ${db};db.${tb}.find();`);
            this.execute(s, data => {
                this.select_tb.data = data;
            });
        },
        insert() {
            let s = this.createSql(
                `use ${this.select_db.name};db.${this.select_tb.name}.insert(${this.new_data});`
            );
            this.execute(s, data => {
                if (data) {
                    this.handleShowTB(this.select_db.name, this.select_tb.name);
                    this.$message({
                        showClose: true,
                        message: "添加成功",
                        type: "success"
                    });
                } else
                    this.$message({
                        showClose: true,
                        message: "没有数据",
                        type: "error"
                    });
            });
        },
        user() {
            this.handleShowDB("admin");
            this.handleShowTB("admin", "system.users");
        },
        sql() {
            this.show_page = 4;
        },
        exec() {
            let s = this.createSql(this.code);
            this.execute(s, data => {
                this.result = data;
            });
        },
        delete_tb(db, tb) {
            this.execute(
                {
                    drop: [`drop collection`, db, tb]
                },
                data => {
                    this.databases.forEach(odb => {
                        if(odb.name = db){
                            odb.cols = [];
                        }
                    });
                    this.handleShowDB(db);
                    this.handleShowTB(db, tb);
                }
            );
            window.event
                ? (window.event.cancelBubble = true)
                : e.stopPropagation();
        },
        exit() {
            localStorage.removeItem("mongo");
            this.$router.push("/dbm/mongo-auth");
        },
        home() {
            this.show_page = 1;
            this.databases = [];
            this.activeDB = "";
            this.select_db = {};
            this.info = {};
            this.execute(
                {
                    dbs: [`show dbs;`],
                    info: ["info"]
                },
                data => {
                    data.dbs.forEach(db => {
                        this.databases.push({ name: db, cols: [] });
                    });
                    this.info = data.info;
                }
            );
        },
        createSql(code) {
            let sqls = code.split(";");
            let s = [];
            for (let i = 0; i < sqls.length; i++) {
                sqls[i] = sqls[i].replace(/(^\s*)|(\s*$)/g, "");
                if (sqls[i].length > 0) s.push([i, sqls[i]]);
            }
            return s;
        },
        execute(sql, func = data => {}) {
            let self = this;
            this.openFullScreen();
            this.axios({
                url: self.url + "/dbm/mongo/mongo/",
                method: "post",
                data: JSON.stringify({
                    sql: sql,
                    auth: self.auth
                }),
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(
                function(response) {
                    if (response.data.code === 200) {
                        func(response.data.data);
                    } else if (response.data.code === 400) {
                        self.$notify.error({
                            title: "操作失败",
                            message: `<div style="color: #f6b93b">${response.data.msg}</div>`,
                            duration: 0,
                            dangerouslyUseHTMLString: true
                        });
                    } else {
                        console.log(response);
                        self.$message({
                            showClose: true,
                            message: "服务器内部错误"
                        });
                    }
                    setTimeout(() => {
                        self.loading.close();
                    }, 600);
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
    mounted() {
        if (localStorage.getItem("mongo")) {
            this.auth = JSON.parse(localStorage.getItem("mongo"));
        }
        this.home();
    },
    beforeRouteLeave(to, from, next) {
        localStorage.removeItem("mongo");
        next();
    }
};
</script>

<style lang="scss" scoped>
.codesql {
    font-size: 11pt;
    font-family: Consolas, Menlo, Monaco, Lucida Console, Liberation Mono,
        DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace,
        serif;
}
.my-enter-active {
    transition: all 0.6s cubic-bezier(1, 0.5, 0.8, 1);
}
.my-leave-active {
    transition: all 0.1s cubic-bezier(1, 0.5, 0.8, 1);
}
.my-enter,
.my-leave-to {
    transform: translateX(10px);
    opacity: 0;
}
#dbm-mongo-mongo {
    width: 100%;
    height: 100%;
    aside {
        position: fixed;
        top: 0;
        left: 0;
        width: 360px;
        height: 100%;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        transition: 0.4s;
        nav {
            z-index: 999;
            height: 140px;
            box-shadow: 0 2px 0 0 #ddd;
            .title {
                width: 100%;
                height: 80px;
                padding-top: 30px;
                text-align: center;
                font-size: 28px;
                font-weight: bold;
            }
            .nav {
                display: flex;
                justify-content: space-around;
                padding: 0 26px;
                i {
                    font-size: 32px;
                    transition: 0.2s;
                    cursor: pointer;
                    &:hover {
                        color: #666;
                    }
                    &:active {
                        color: #222;
                    }
                }
            }
        }
        article {
            flex: 1;
            overflow-y: scroll;
            padding: 22px;
            .box-card {
                .opera {
                    display: flex;
                    justify-content: space-between;
                }
                .table {
                    cursor: pointer;
                    margin: 8px;
                    font-size: 14px;
                    transition: 0.4s;
                    height: 30px;
                    line-height: 30px;
                    display: flex;
                    align-items: center;
                    .el-icon-circle-close {
                        transition: 0.4s;
                        &:hover {
                            color: #74b9ff;
                        }
                    }
                    &:hover {
                        .name {
                            color: #999;
                            font-size: 13px;
                        }
                    }
                    &:active {
                        .name {
                            font-size: 12px;
                        }
                    }
                }
            }
        }
    }
    section {
        position: fixed;
        height: 100%;
        top: 0;
        left: 360px;
        right: 0;
        transition: 0.4s;
        .box-card1 {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 80px;
            line-height: 60px;
            i {
                font-size: 32px;
                cursor: pointer;
                transition: 0.2s;
                &:hover {
                    color: #999;
                }
            }
        }
        .box-card2 {
            position: absolute;
            top: 80px;
            left: 0;
            right: 0;
            height: 60px;
        }
        article {
            position: absolute;
            top: 140px;
            left: 0;
            right: 0;
            bottom: 0;
            overflow-y: scroll;
            padding: 30px;
            .box-card {
                .item {
                    width: 33.3%;
                    padding: 15px;
                    float: left;
                    .child-card {
                        min-height: 200px;
                        width: 100%;
                        .icon {
                            height: 32px;
                            line-height: 32px;
                            text-align: center;
                            width: 30%;
                            border: #ccc solid 1px;
                            display: inline-block;
                            background: #ccc;
                            border-radius: 4px 0 0 4px;
                            overflow: hidden;
                        }
                        .content {
                            height: 32px;
                            line-height: 32px;
                            width: 70%;
                            padding-left: 8px;
                            border: #ccc solid 1px;
                            display: inline-block;
                            border-radius: 0 4px 4px 0;
                            overflow: hidden;
                        }
                    }
                }
                @media screen and (max-width: 1400px) {
                    .item {
                        width: 50%;
                    }
                }
            }
        }
    }
}
</style>