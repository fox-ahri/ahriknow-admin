<template>
    <div id="dbm-mysql-mysql" class="dbm-mysql-mysql">
        <aside ref="aside">
            <nav>
                <div class="title">Ahri - MySQLAdmin</div>
                <div class="nav">
                    <i class="iconfont akhome" @click="home"></i>
                    <i class="iconfont aklog-out" @click="exit"></i>
                </div>
            </nav>
            <article>
                <el-button
                    style="margin 10px 0;width: 100%;"
                    @click="dialogFormVisible = true"
                >新建数据库</el-button>
                <el-collapse
                    v-model="activeDB"
                    accordion
                    @change="handleShowDB"
                    style="padding-left: 15px;"
                >
                    <el-collapse-item v-for="i in databases" :title="i.name" :name="i.name">
                        <el-card class="box-card">
                            <div class="opera">
                                <el-button
                                    icon="el-icon-plus"
                                    size="mini"
                                    @click="dialogFormTable = true"
                                ></el-button>&nbsp;
                                <el-input
                                    placeholder="请输入过滤内容"
                                    size="mini"
                                    v-model="i.search"
                                    clearable
                                ></el-input>
                            </div>
                            <div style="padding: 5px">
                                <div
                                    class="table"
                                    v-for="j in i.tables.filter(tb => !i.search || tb.table_name.includes(i.search))"
                                    :title="j.table_name"
                                    @click="handleShowTB(i.name, j.table_name)"
                                >
                                    <i
                                        class="el-icon-circle-close"
                                        @click="delete_tb(j.table_name)"
                                    ></i>&nbsp;&nbsp;
                                    <span class="name">{{ j.table_name }}</span>
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
                        <el-button icon="iconfont akSqlServer" @click="code_sql">
                            <b>&nbsp;SQL</b>
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
                        <el-button icon="iconfont akSqlServer" @click="code_sql">
                            <b>&nbsp;SQL</b>
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
                        <el-button icon="iconfont akclear" @click="delete_db">
                            <b>&nbsp;删除</b>
                        </el-button>
                    </el-button-group>
                </el-card>
            </transition>
            <transition name="my">
                <el-card class="box-card2" v-show="show_page == 3">
                    <el-button-group>
                        <el-button icon="iconfont akback" @click="backDB">
                            <b>&nbsp;Back</b>
                        </el-button>
                        <el-button icon="iconfont akSqlServer" @click="code_sql">
                            <b>&nbsp;SQL</b>
                        </el-button>
                        <el-button icon="iconfont akimport" disabled>
                            <b>&nbsp;导入</b>
                        </el-button>
                        <el-button icon="iconfont akexport" disabled>
                            <b>&nbsp;导出</b>
                        </el-button>
                        <el-button icon="iconfont akinsert" @click="new_data">
                            <b>&nbsp;插入</b>
                        </el-button>
                        <el-button icon="iconfont akcustom-clear" @click="truncate('')">
                            <b>&nbsp;清空</b>
                        </el-button>
                        <el-button icon="iconfont akclear" @click="delete_tb('')">
                            <b>&nbsp;删除</b>
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
                                    <span class="content">{{ data.user?data.user[0][0]:'' }}</span>
                                </div>
                                <div>
                                    <span class="icon">
                                        <b>字符集</b>
                                    </span>
                                    <span
                                        class="content"
                                    >{{ data.collation?data.collation[0][1]:'' }}</span>
                                </div>
                                <div>
                                    <span class="icon">
                                        <b>版本</b>
                                    </span>
                                    <span class="content">{{ data.version?data.version[0][0]:'' }}</span>
                                </div>
                            </el-card>
                        </div>
                        <div class="item">
                            <el-card class="child-card">
                                <div>
                                    <span class="icon">
                                        <b>启动时间</b>
                                    </span>
                                    <span class="content">
                                        {{ data.uptime?data.uptime[0][1]:'' }}&nbsp;
                                        <b>S</b>
                                    </span>
                                </div>
                                <div>
                                    <span class="icon">
                                        <b>数据空间</b>
                                    </span>
                                    <span class="content">
                                        {{ data.size?data.size[0][0]:'' }}&nbsp;
                                        <b>MB</b>
                                    </span>
                                </div>
                            </el-card>
                        </div>
                    </el-card>
                </transition>
                <transition name="my">
                    <el-card class="box-card" v-show="show_page == 2">
                        <el-pagination
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page="currentPage"
                            :page-sizes="[5, 10, 20, 50, 200]"
                            :page-size="pageSize"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="this.select_db.tables.length"
                            background
                        ></el-pagination>
                        <el-table
                            :data="show_db.tables.filter(tb => !search_table || tb.table_name.includes(search_table))"
                            style="width: 100%"
                        >
                            <el-table-column label="表名" min-width="200">
                                <template slot-scope="scope">
                                    <i class="el-icon-film"></i>
                                    <span style="margin-left: 10px">{{ scope.row.table_name }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="表类型" prop="table_type" width="140"></el-table-column>
                            <el-table-column label="表行数" prop="table_rows" width="120"></el-table-column>
                            <el-table-column label="创建时间" prop="create_time" min-width="160"></el-table-column>
                            <el-table-column label="排序规则" prop="table_collation" min-width="140"></el-table-column>
                            <el-table-column width="280" fixed="right">
                                <template slot="header" slot-scope="scope">
                                    <div style="display: flex;">
                                        <el-input
                                            v-model="search_table"
                                            size="mini"
                                            placeholder="输入关键字搜索"
                                        />
                                        <el-button
                                            style="height: 28px;margin-top: 6px;"
                                            size="mini"
                                            type="primary"
                                            @click="dialogFormTable = true"
                                        >新建表</el-button>
                                    </div>
                                </template>
                                <template slot-scope="scope">
                                    <el-button
                                        size="mini"
                                        type="primary"
                                        @click="handleShowTB(select_db.name, scope.row.table_name)"
                                    >浏览</el-button>
                                    <el-button size="mini" type="success">结构</el-button>
                                    <el-button
                                        size="mini"
                                        type="warning"
                                        @click="truncate(scope.row.table_name)"
                                    >清空</el-button>
                                    <el-button
                                        size="mini"
                                        type="danger"
                                        @click="delete_tb(scope.row.table_name)"
                                    >删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-card>
                </transition>
                <transition name="my">
                    <el-card class="box-card" v-show="show_page == 3">
                        <div style="display: flex">
                            <el-pagination
                                @size-change="handleSizeChange"
                                @current-change="handleCurrentChange"
                                :current-page="currentPage"
                                :page-sizes="[5, 10, 20, 50, 100, 200, 500]"
                                :page-size="pageSize"
                                layout="total, sizes, prev, pager, next, jumper"
                                :total="this.select_table.length"
                                background
                            ></el-pagination>&nbsp;&nbsp;&nbsp;&nbsp;
                            <el-button size="mini" type="primary" @click="new_data">添加</el-button>
                        </div>
                        <el-table :data="show_table" style="width: 100%">
                            <el-table-column width="160" fixed="left">
                                <template slot="header" slot-scope="scope">
                                    <el-input
                                        v-model="search_table"
                                        size="mini"
                                        placeholder="输入关键字搜索"
                                    />
                                </template>
                                <template slot-scope="scope">
                                    <el-button
                                        size="mini"
                                        type="primary"
                                        @click="edit_data(scope.row)"
                                    >更改</el-button>
                                    <el-button
                                        size="mini"
                                        type="danger"
                                        @click="delete_data(scope.row)"
                                    >删除</el-button>
                                </template>
                            </el-table-column>
                            <el-table-column
                                v-for="i,index in column"
                                :label="i[3]+' -- '+i[15]"
                                min-width="200"
                                show-overflow-tooltip
                            >
                                <template slot-scope="scope">
                                    <span style="margin-left: 10px">{{ scope.row[index] }}</span>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-card>
                </transition>
            </article>
        </section>
        <el-dialog
            title="新建数据库"
            :visible.sync="dialogFormVisible"
            @close="new_db.name='',new_db.charset='utf8mb4',new_db.collation='utf8mb4_general_ci'"
            :close-on-click-modal="false"
        >
            <el-form :model="new_db">
                <el-form-item label="数据库名" label-width="120px">
                    <el-input v-model="new_db.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="字符集" label-width="120px">
                    <el-select v-model="new_db.charset" placeholder="请选择字符集">
                        <el-option label="utf8mb4" value="utf8mb4"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="排序规则" label-width="120px">
                    <el-select v-model="new_db.collation" placeholder="请选择排序规则">
                        <el-option label="utf8mb4_general_ci" value="utf8mb4_general_ci"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleAddDB">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog
            title="新建表"
            :visible.sync="dialogFormTable"
            @close="close_new_table"
            :close-on-click-modal="false"
            width="90%"
        >
            <div style="height: 500px;width: 100%;overflow-y: scroll">
                <el-input v-model="table_name" placeholder="表名"></el-input>
                <el-card class="item" v-for="i in new_tb" style="margin: 5px;">
                    <el-button icon="el-icon-circle-close" @click="removeColumn(i)"></el-button>&nbsp;&nbsp;
                    <el-checkbox v-model="i.isPrimary">主键</el-checkbox>&nbsp;&nbsp;
                    <el-input v-model="i.name" placeholder="请输入列名" style="width: 140px"></el-input>&nbsp;&nbsp;
                    <el-select v-model="i.type" placeholder="请选择类型" style="width: 140px">
                        <el-option label="int" value="INT"></el-option>
                        <el-option label="varchar" value="VARCHAR"></el-option>
                        <el-option label="text" value="TEXT"></el-option>
                        <el-option label="date" value="DATE"></el-option>
                    </el-select>&nbsp;&nbsp;
                    <el-input v-model="i.length" placeholder="请输入长度" style="width: 140px"></el-input>&nbsp;&nbsp;
                    <el-input
                        v-model="i.default"
                        :disabled="i.isPrimary"
                        placeholder="请输入默认值"
                        style="width: 140px"
                    ></el-input>&nbsp;&nbsp;
                    <el-switch
                        v-show="!i.isPrimary"
                        style="display: inline-block"
                        v-model="i.unique"
                        active-color="#13ce66"
                        inactive-color="#ff4949"
                        active-text="唯一"
                    ></el-switch>&nbsp;&nbsp;
                    <el-switch
                        v-show="!i.isPrimary"
                        style="display: inline-block"
                        v-model="i.notNull"
                        active-color="#13ce66"
                        inactive-color="#ff4949"
                        active-text="允许空"
                    ></el-switch>&nbsp;&nbsp;
                    <el-switch
                        v-show="i.isPrimary&&i.type=='INT'"
                        style="display: inline-block"
                        v-model="i.auto"
                        active-color="#13ce66"
                        inactive-color="#ff4949"
                        active-text="自增"
                    ></el-switch>
                </el-card>
                <div style="width: 300px">
                    <el-input placeholder="请输入列数" v-model="count">
                        <template slot="prepend">列数</template>
                        <el-button slot="append" icon="el-icon-search" @click="addColumn">添加列</el-button>
                    </el-input>
                </div>
            </div>
            <el-dialog width="90%" title="内层 Dialog" :visible.sync="innerVisible" append-to-body>
                <codemirror v-model="sql" :options="options" style="width: 100%"></codemirror>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="innerVisible = false">取 消</el-button>
                    <el-button type="primary" @click="handleAddTB">确 定</el-button>
                </div>
            </el-dialog>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormTable = false">取 消</el-button>
                <el-button type="primary" @click="createSql">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="SQL:" :visible.sync="dialogEditor" @close="close_exec_sql" fullscreen>
            <codemirror v-model="code" :options="options"></codemirror>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogEditor = false">关闭</el-button>
                <el-button type="primary" @click="exec">执行</el-button>
            </span>
            <div class="console">
                <JsonViewer :value="result"></JsonViewer>
            </div>
        </el-dialog>
        <el-dialog
            :title="'向 '+select_db.name+'.'+select_tb+' 添加：'"
            :visible.sync="addData"
            @close="add_data = {}"
            fullscreen
        >
            <el-form ref="form" label-width="180px">
                <el-form-item v-for="i in column" :label="i[3]+' -- '+i[15]">
                    <el-input v-model="add_data[i[3]]"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addData = false,add_data = {}">关闭</el-button>
                <el-button type="primary" @click="new_data">添加</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { codemirror } from "vue-codemirror-lite";
require("codemirror/mode/sql/sql.js");
require("codemirror/theme/3024-day.css");
import JsonViewer from "vue-json-viewer";
export default {
    name: "dbm-mysql-mysql",
    components: {
        codemirror,
        JsonViewer
    },
    data() {
        function randomString(len) {
            len = len || 32;
            var $chars =
                "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            var maxPos = $chars.length;
            var pwd = "";
            for (let i = 0; i < len; i++) {
                pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
            }
            return pwd;
        }
        return {
            code: "select * from *;",
            options: {
                mode: "sql",
                tabSize: 4,
                lineNumbers: true,
                lineWrapping: true,
                theme: "3024-day",
                extraKeys: { "Ctrl-Space": "autocomplete" }
            },
            dialogEditor: false,
            count: 1,
            auth: {},
            activeDB: "",
            databases: [],
            loading: {
                close: () => {}
            },
            select_db: {
                tables: []
            },
            select_tb: "",
            show_db: {
                tables: []
            },
            iShow: true,
            show_page: 1,
            currentPage: 2,
            pageSize: 10,
            search_table: "",
            data: {},
            dialogFormVisible: false,
            table_name: "",
            new_db: {
                name: "",
                charset: "utf8mb4",
                collation: "utf8mb4_general_ci"
            },
            dialogFormTable: false,
            innerVisible: false,
            sql: "",
            new_tb: [
                {
                    id: randomString(8),
                    isPrimary: true,
                    name: "q",
                    type: "INT",
                    length: "100",
                    default: "",
                    unique: false,
                    notNull: false,
                    auto: false
                }
            ],
            select_table: [],
            show_table: [],
            column: [],
            result: [],
            addData: false,
            add_data: {},
            add: true,
            val: []
        };
    },
    methods: {
        user() {
            this.handleShowDB("mysql");
            this.handleShowTB("mysql", "user");
        },
        code_sql() {
            this.dialogEditor = true;
        },
        exec() {
            let sqls = this.code.split(";");
            let s = {};
            for (let i = 0; i < sqls.length; i++) {
                sqls[i] = sqls[i].replace(/(^\s*)|(\s*$)/g, "");
                if (sqls[i].length > 0) s["sql-" + i] = sqls[i];
            }
            this.execute(s, data => {
                this.result = data;
            });
        },
        exit() {
            localStorage.removeItem("mysql");
            this.$router.push("/dbm/mysql-auth");
        },
        backDB() {
            this.show_page = 2;
        },
        randomString(len) {
            len = len || 32;
            var $chars =
                "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"; /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
            var maxPos = $chars.length;
            var pwd = "";
            for (let i = 0; i < len; i++) {
                pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
            }
            return pwd;
        },
        addColumn() {
            for (let i = 0; i < this.count; i++) {
                this.new_tb.push({
                    id: this.randomString(8),
                    isPrimary: false,
                    name: "",
                    type: "INT",
                    length: "",
                    default: "",
                    unique: false,
                    notNull: false,
                    auto: false
                });
            }
        },
        removeColumn(val) {
            this.new_tb = this.new_tb.filter(col => {
                return val.id != col.id;
            });
        },
        pagination() {
            this.show_db.tables = this.select_db.tables.slice(
                (this.currentPage - 1) * this.pageSize,
                this.currentPage * this.pageSize
            );
            this.show_table = this.select_table.slice(
                (this.currentPage - 1) * this.pageSize,
                this.currentPage * this.pageSize
            );
        },
        handleSizeChange(val) {
            this.pageSize = val;
            this.pagination();
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.pagination();
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
        openFullScreen() {
            this.loading = this.$loading({
                lock: true,
                text: "Loading",
                spinner: "el-icon-loading",
                background: "rgba(0, 0, 0, 0.7)"
            });
        },
        handleAddDB() {
            if (this.new_db.name == "") {
                this.$message({
                    showClose: true,
                    message: "请输入数据库名",
                    type: "warning"
                });
                return;
            }
            if (
                this.databases.some(db => {
                    return db.name == this.new_db.name;
                })
            ) {
                this.$message({
                    showClose: true,
                    message: "数据库名重复",
                    type: "warning"
                });
                return;
            }
            this.execute(
                {
                    create: `CREATE DATABASE ${this.new_db.name} DEFAULT CHARSET ${this.new_db.charset} COLLATE ${this.new_db.collation};`
                },
                data => {
                    this.databases.push({
                        name: this.new_db.name,
                        search: "",
                        tables: [],
                        size: "0"
                    });
                    this.$message({
                        showClose: true,
                        message: `已创建数据库 ---- ${this.new_db.name}`,
                        type: "success"
                    });
                    this.dialogFormVisible = false;
                }
            );
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
                    tag = db.tables.length;
                    this.select_db = db;
                    this.pagination();
                }
            });
            if (tag != 0) return;
            this.execute(
                {
                    tbs: `select * from information_schema.tables where table_schema='${db_name}'`,
                    size: `select concat(round(sum(data_length)/(1024*1024),2) + round(sum(index_length)/(1024*1024),2)) as 'DB Size' from information_schema.tables where table_schema='${db_name}'`
                },
                data => {
                    let tmp = [];
                    data.tbs.forEach(tb => {
                        tmp.push({
                            search: "",
                            table_name: tb[2],
                            table_type: tb[4],
                            table_rows: tb[7],
                            create_time: tb[14],
                            table_collation: tb[17]
                        });
                    });
                    this.databases.forEach(db => {
                        if (db.name == db_name) {
                            db.tables = tmp;
                            db.size = data.size[0][0];
                            this.select_db = db;
                            this.pagination();
                        }
                    });
                }
            );
        },
        createSql() {
            if (this.table_name == "") {
                this.$message({
                    showClose: true,
                    message: "请输入表名",
                    type: "warning"
                });
                return;
            }
            let ss = [];
            let tmp = "",
                p = [],
                u = [];

            this.new_tb.forEach(col => {
                if (col.isPrimary) {
                    p.push("`" + col.name + "`");
                }
                if (col.unique) {
                    u.push("`" + col.name + "`");
                }
                ss.push(
                    `${"`" + col.name + "`"}${" " + col.type}${
                        (col.length && col.type == "INT") ||
                        (col.length && col.type == "VARCHAR")
                            ? "(" + col.length + ")"
                            : ""
                    }${col.notNull ? " NULL" : " NOT NULL"}${
                        !col.isPrimary && col.default
                            ? col.type == "INT"
                                ? " DEFAULT " + col.default + ""
                                : " DEFAULT '" + col.default + "'"
                            : ""
                    }${
                        col.isPrimary && col.auto && col.type == "INT"
                            ? " AUTO_INCREMENT"
                            : ""
                    }`
                );
            });
            ss[0] =
                `CREATE TABLE \`${this.select_db.name}\`.\`${this.table_name}\` ( ` +
                ss[0];
            if (p.length > 0) ss.push("PRIMARY KEY (" + p.join(",") + ")");
            if (u.length > 0) ss.push("UNIQUE (" + u.join(",") + ")");
            this.sql = ss.join(" , ") + ") ENGINE = InnoDB;";
            this.innerVisible = true;
        },
        close_new_table() {
            this.table_name = "";
            this.new_tb = [
                {
                    id: this.randomString(8),
                    isPrimary: true,
                    name: "q",
                    type: "INT",
                    length: "100",
                    default: "",
                    unique: false,
                    notNull: false,
                    auto: false
                }
            ];
        },
        close_exec_sql() {
            if (this.show_page == 2) {
                this.handleShowDB(this.select_db.name);
            }
            if (this.show_page == 3) {
                this.handleShowTB(this.select_db.name, this.select_tb);
            }
        },
        handleAddTB() {
            this.execute(
                {
                    create: this.sql
                },
                data => {
                    this.databases.forEach(db => {
                        db.tables = [];
                    });
                    this.handleShowDB(this.select_db.name);
                    this.handleShowTB(this.select_db.name, this.table_name);
                    this.$message({
                        showClose: true,
                        message: `已创建表 ---- ${this.table_name}`,
                        type: "success"
                    });
                    this.dialogFormTable = false;
                    this.innerVisible = false;
                }
            );
        },
        handleShowTB(db_name, tb_name) {
            this.select_tb = tb_name;
            this.show_page = 3;
            this.execute(
                {
                    columns: `SELECT * FROM information_schema.columns WHERE table_schema = '${db_name}' AND table_name = '${tb_name}'`,
                    table: `select * from ${db_name}.${tb_name}`
                },
                data => {
                    this.select_table = data.table;
                    this.column = data.columns;
                    this.pagination();
                }
            );
        },
        getData() {
            this.execute(
                {
                    port: `show variables  like 'port'`,
                    version: `select version()`,
                    uptime: `show status like 'uptime'`,
                    collation: `show variables like 'collation%'`,
                    user: `select user()`,
                    size: `select concat(round(sum(DATA_LENGTH/1024/1024),2)) as data from information_schema.tables`
                },
                data => {
                    this.data = data;
                }
            );
        },
        home() {
            this.getData();
            this.activeDB = "";
            this.databases.forEach(db => {
                db.search = "";
                db.tables = [];
                db.size = "0";
            });
            this.select_db = {
                tables: []
            };
            this.show_db = {
                tables: []
            };
            this.show_page = 1;
            this.currentPage = 2;
            this.pageSize = 10;
            this.search_table = "";
            this.databases = [];
            this.execute(
                {
                    dbs: "show databases;"
                },
                data => {
                    data.dbs.forEach(db => {
                        this.databases.push({
                            name: db[0],
                            search: "",
                            tables: [],
                            size: "0"
                        });
                    });
                }
            );
        },
        delete_db() {
            this.$confirm(
                `确认删除数据库 ---- ${this.select_db.name} ?`,
                "确认:",
                { type: "error" }
            )
                .then(_ => {
                    this.execute(
                        {
                            delete: `DROP DATABASE \`${this.select_db.name}\``
                        },
                        data => {
                            this.home();
                            this.$message({
                                showClose: true,
                                message: `已删除数据库 ---- ${this.select_db.name}`,
                                type: "success"
                            });
                        }
                    );
                })
                .catch(_ => {
                    this.$message({
                        showClose: true,
                        message: `取消删除数据库 ---- ${this.select_db.name}`
                    });
                });
        },
        delete_tb(val) {
            this.$confirm(
                `确认删除表 ---- ${val ? val : this.select_tb} ？`,
                "确认:",
                { type: "error" }
            )
                .then(_ => {
                    let sql = "";
                    if (val == "")
                        sql = `DROP TABLE \`${this.select_db.name}\`.\`${this.select_tb}\``;
                    else
                        sql = `DROP TABLE \`${this.select_db.name}\`.\`${val}\``;
                    this.execute(
                        {
                            delete: sql
                        },
                        data => {
                            this.databases.forEach(db => {
                                db.tables = [];
                            });
                            this.handleShowDB(this.select_db.name);
                            this.$message({
                                showClose: true,
                                message: `已删除表 ---- ${this.select_tb}`,
                                type: "success"
                            });
                        }
                    );
                })
                .catch(_ => {
                    this.$message({
                        showClose: true,
                        message: `取消删除表 ---- ${val ? val : this.select_tb}`
                    });
                });
            window.event
                ? (window.event.cancelBubble = true)
                : e.stopPropagation();
        },
        truncate(val) {
            this.$confirm(
                `确认清空表 ---- ${val ? val : this.select_tb} ？`,
                "确认:",
                { type: "error" }
            )
                .then(_ => {
                    if (val == "") {
                        this.execute(
                            {
                                delete: `truncate table \`${this.select_db.name}\`.\`${this.select_tb}\``
                            },
                            data => {
                                this.handleShowTB(
                                    this.select_db.name,
                                    this.select_tb
                                );
                                this.$message({
                                    showClose: true,
                                    message: `已清空表 ---- ${this.select_tb}`,
                                    type: "success"
                                });
                            }
                        );
                    } else {
                        this.execute(
                            {
                                delete: `truncate table \`${this.select_db.name}\`.\`${val}\``
                            },
                            data => {
                                this.$message({
                                    showClose: true,
                                    message: `已清空表 ---- ${val}`,
                                    type: "success"
                                });
                            }
                        );
                    }
                })
                .catch(_ => {
                    this.$message({
                        showClose: true,
                        message: `取消清空表 ---- ${val ? val : this.select_tb}`
                    });
                });
        },
        execute(sql, func = data => {}) {
            let self = this;
            this.openFullScreen();
            this.axios({
                url: self.url + "/dbm/mysql/mysql/",
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
        },
        delete_data(row) {
            let sql = `delete from ${this.select_db.name}.${this.select_tb} where `;
            let where = [];
            for (let i = 0; i < this.column.length; i++) {
                let tmp = `${this.column[i][3]}=${
                    this.column[i][15].substr(0, 3) == "int"
                        ? row[i]
                        : "'" + row[i] + "'"
                }`;
                where.push(tmp);
            }
            this.execute(
                {
                    delete: sql + where.join(" and ")
                },
                data => {
                    this.handleShowTB(this.select_db.name, this.select_tb);
                }
            );
        },
        new_data() {
            if (this.addData) {
                if (this.add) {
                    let tmp = [];
                    for (let k in this.add_data) {
                        if (this.add_data[k] == "") {
                        } else {
                            tmp.push([
                                k,
                                this.column.filter(col => col[3] == k)[0][15],
                                this.add_data[k]
                            ]);
                        }
                    }
                    let w = [],
                        v = [];
                    tmp.forEach(t => {
                        if (t[1].substr(0, 3) != "int") {
                            t[2] = "'" + t[2] + "'";
                        }
                        w.push(t[0]);
                        v.push(t[2]);
                    });
                    let sql = `insert into ${this.select_db.name}.${
                        this.select_tb
                    } (${w.join(",")}) values (${v.join(",")})`;
                    this.execute(
                        {
                            insert: sql
                        },
                        data => {
                            this.handleShowTB(
                                this.select_db.name,
                                this.select_tb
                            );
                            this.addData = false;
                        }
                    );
                } else {
                    let tmp = [];
                    let old = [];
                    for (let k in this.add_data) {
                        tmp.push([
                            k,
                            this.column.filter(col => col[3] == k)[0][15],
                            this.add_data[k]
                        ]);
                    }
                    let v = [];
                    tmp.forEach(t => {
                        if (t[1].substr(0, 3) != "int") {
                            t[2] = "'" + t[2] + "'";
                        }
                        v.push(`${t[0]}=${t[2]}`);
                    });
                    let sql = `update ${this.select_db.name}.${
                        this.select_tb
                    } set ${v.join(",")} where ${this.val.join(" and ")}`;
                    this.execute(
                        {
                            update: sql
                        },
                        data => {
                            this.handleShowTB(
                                this.select_db.name,
                                this.select_tb
                            );
                            this.addData = false;
                        }
                    );
                }
            } else {
                this.add = true;
                this.addData = true;
            }
        },
        edit_data(val) {
            this.add = false;
            let w = [];
            let tmp = {};
            for (let i = 0; i < this.column.length; i++) {
                tmp[this.column[i][3]] = val[i];
                if (this.column[i][15].substr(0, 3) == "int") {
                    w.push(`${this.column[i][3]}=${val[i]}`);
                } else {
                    w.push(`${this.column[i][3]}='${val[i]}'`);
                }
            }
            this.add_data = tmp;
            this.val = w;
            this.addData = true;
        }
    },
    mounted() {
        if (localStorage.getItem("mysql")) {
            this.auth = JSON.parse(localStorage.getItem("mysql"));
        }
        this.home();
    },
    beforeRouteLeave(to, from, next) {
        localStorage.removeItem("mysql");
        next();
    },
    watch: {
        show_page() {
            this.currentPage = 1;
            this.pageSize = 10;
        }
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
#dbm-mysql-mysql {
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