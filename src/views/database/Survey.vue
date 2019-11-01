<template>
    <div id="database-survey" class="database-survey">
        <comp-nav></comp-nav>
        <section>
            <article>
                <el-tabs type="border-card" v-model="name">
                    <el-tab-pane name="mongo">
                        <span slot="label" class="nocopy">
                            <i class="iconfont akMongoDB"></i> Mongo
                        </span>
                        <div class="mongo">
                            <div class="db" v-for="i in mongo">
                                <div class="name">{{ i.name }}</div>
                                <div class="desc">{{ i.desc }}</div>
                                <div class="username">{{ i.username }}</div>
                                <div class="password">{{ i.password }}</div>
                                <div class="delete">
                                    <el-button type="text">删除</el-button>
                                    <el-button type="text">管理</el-button>
                                </div>
                            </div>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane name="mysql">
                        <span slot="label" class="nocopy">
                            <i class="iconfont akMySQL"></i> Mysql
                        </span>
                        <el-button type="text">MysqlAdmin</el-button>
                        <div class="mysql">
                            <div class="db" v-for="i in mysql">
                                <div class="name">{{ i.name }}</div>
                                <div class="desc">{{ i.desc }}</div>
                                <div class="username">{{ i.username }}</div>
                                <div class="password">{{ i.password }}</div>
                                <div class="delete">
                                    <el-button type="text">删除</el-button>
                                    <el-button type="text">管理</el-button>
                                </div>
                            </div>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane name="redis">
                        <span slot="label" class="nocopy">
                            <i class="iconfont akRedis"></i> Redis
                        </span>
                        <div class="opera">未开放...</div>
                    </el-tab-pane>
                </el-tabs>
            </article>
            <footer class="nocopy">
                <router-link to="/admin">Home</router-link>&nbsp;|&nbsp;
                <router-link to="/ahridata/survey">AhriData</router-link>&nbsp;|&nbsp;
                <router-link to="/blog/survey">Ahriblog</router-link>&nbsp;|&nbsp;
                <router-link to="/notebook/book">Notebook</router-link>&nbsp;|&nbsp;
                <router-link to="/database/survey">Database</router-link>&nbsp;|&nbsp;
                <router-link to="/transfer/galaxy">Transfer</router-link>
            </footer>
        </section>
    </div>
</template>

<script>
import CompNav from "@/components/CompNav.vue";
export default {
    name: "database-survey",
    components: {
        "comp-nav": CompNav
    },
    data() {
        return {
            user: {
                role: 0
            },
            mongo: [
                {
                    _id: "1",
                    name: "Mongo1",
                    desc:
                        "The first mongodb.The first mongodb.The first mongodb.The first mongodb.",
                    username: "ahri",
                    password: "123456",
                    closed: false
                },
                {
                    _id: "2",
                    name: "Mongo1",
                    desc: "The first mongodb.",
                    username: "ahri",
                    password: "123456",
                    closed: false
                }
            ],
            mysql: [
                {
                    _id: "1",
                    name: "Mysql1",
                    desc:
                        "The first mysql.The first mysql.The first mysql.The first mysql.",
                    username: "ahri",
                    password: "123456",
                    closed: false
                },
                {
                    _id: "2",
                    name: "Mysql2",
                    desc: "The first mysql.",
                    username: "ahri",
                    password: "123456",
                    closed: false
                }
            ],
            name: "mongo"
        };
    },
    created() {},
    methods: {},
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
        this.name = this.$route.query.db || "mongo";
    }
};
</script>

<style lang="scss" scoped>
#database-survey {
    height: 100%;
    overflow: hidden;
    nav {
        z-index: 100;
        width: 100%;
        height: 80px;
        background: #fff;
        box-shadow: #999 0 0 4px;
        position: fixed;
        top: 0;
        left: 0;
        line-height: 80px;
        padding: 0 30px;
        a {
            font-weight: bold;
            color: #2c3e50;
            &.router-link-exact-active {
                color: #42b983;
            }
        }
    }
    section {
        z-index: 10;
        width: 100%;
        height: 100%;
        padding-top: 90px;
        overflow-y: scroll;
        article {
            min-height: 100%;
            padding: 30px 50px 100px 50px;
            .mongo,
            .mysql {
                .db {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    cursor: pointer;
                    padding: 0 20px;
                    margin: 15px 50px;
                    box-shadow: #ccc 0 0 8px;
                    height: 50px;
                    &:hover {
                        box-shadow: #ccc 0 0 12px;
                    }
                    div {
                        overflow: hidden;
                    }
                    .name {
                        width: 200px;
                    }
                    .desc {
                        width: 300px;
                        overflow: hidden;
                    }
                    .username,
                    .password {
                        width: 120px;
                    }
                }
            }
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