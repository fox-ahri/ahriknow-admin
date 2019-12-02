<template>
    <div id="home" class="home">
        <div id="nav" ref="nav" class="nocopy">
            <div class="a">
                <router-link to="/admin">Ahriknow</router-link>
                <span v-if="user.role == 100">
                    &nbsp;|&nbsp;
                    <router-link to="/setting/document">Setting</router-link>
                </span>
                &nbsp;|&nbsp;
                <router-link to="/tools">Tools</router-link>
            </div>
            <div class="btn">
                <button v-show="user.role == 0" @click="to('/auth/login')">
                    <i class>登录</i>
                </button>
                <button v-show="user.role == 0" @click="to('/auth/register')">
                    <i class>注册</i>
                </button>
                <button v-show="user.role > 0" @click="to('/auth/logout')">
                    <i class>退出</i>
                </button>
                <button v-show="user.role > 0" @click="to('/userinfo')">
                    <i class>我</i>
                </button>
            </div>
        </div>
        <div class="content">
            <el-carousel height="600px">
                <el-carousel-item>
                    <div class="items" @click="goto('/ahridata/survey')">
                        <img src="https://aaahri.cn/1.jpg" alt="img" />
                        <div class="container">
                            <div>
                                <i class="el-icon-s-data"></i>
                            </div>
                            <div class="title">数据服务</div>
                            <div class="desc">
                                数据服务提供数据存储以及文件存储
                                <br />JS SDK
                            </div>
                        </div>
                    </div>
                </el-carousel-item>
                <el-carousel-item>
                    <div class="items" @click="goto('/restful/survey')">
                        <img
                            src="https://aaahri.cn/2.jpg?x-oss-process=image/auto-orient,1/quality,q_90/bright,-27"
                            alt="img"
                        />
                        <div class="container">
                            <div>
                                <i class="el-icon-no-smoking"></i>
                            </div>
                            <div class="title">接口</div>
                            <div class="desc">快速创建Restful接口，开发前端应用</div>
                        </div>
                    </div>
                </el-carousel-item>
                <el-carousel-item>
                    <div class="items" @click="goto('/website/survey')">
                        <img
                            src="https://aaahri.cn/3.jpg?x-oss-process=image/auto-orient,1/quality,q_90/bright,-37"
                            alt="img"
                        />
                        <div class="container">
                            <div>
                                <i class="iconfont akweb"></i>
                            </div>
                            <div class="title">虚拟主机</div>
                            <div class="desc">
                                创建虚拟主机，搭建站点
                                <br />支持PHP、Tomcat、MySQL
                            </div>
                        </div>
                    </div>
                </el-carousel-item>
            </el-carousel>
            <div class="items1">
                <div class="item" @click="goto('/notebook/book')">
                    <div class="title">笔记文档</div>
                    <div class="desc">笔记文档提供笔记记录以及文档编写</div>
                    <div>
                        <i class="el-icon-s-management"></i>
                    </div>
                </div>
                <div class="item" @click="goto('/blog/survey')">
                    <div class="title">博客</div>
                    <div class="desc">博客可以发布文章或投稿</div>
                    <div>
                        <i class="el-icon-reading"></i>
                    </div>
                </div>
                <div class="item" @click="goto('/dbm/mongo-auth')">
                    <div class="title">Mongo - Admin</div>
                    <div class="desc">Mongo 在线管理系统</div>
                    <div>
                        <i class="iconfont akMongoDB"></i>
                    </div>
                </div>
                <div class="item" @click="goto('/dbm/mysql-auth')">
                    <div class="title">MySQL - Admin</div>
                    <div class="desc">MySQL 在线管理系统</div>
                    <div>
                        <i class="iconfont akMySQL"></i>
                    </div>
                </div>
            </div>
            <div class="items2">
                <div class="item" @click="goto('/ahridata/survey')">
                    <div class="title">数据服务</div>
                    <div class="desc">
                        数据服务提供数据存储以及文件存储
                        <br />JS SDK
                    </div>
                    <div>
                        <i class="el-icon-s-data"></i>
                    </div>
                </div>
                <div class="item" @click="goto('/restful/survey')">
                    <div class="title">接口</div>
                    <div class="desc">快速创建Restful接口，开发前端应用</div>
                    <div>
                        <i class="el-icon-no-smoking"></i>
                    </div>
                </div>
                <div class="item" @click="goto('/website/survey')">
                    <div class="title">虚拟主机</div>
                    <div class="desc">
                        创建虚拟主机，搭建站点
                        <br />支持PHP、Tomcat、MySQL
                    </div>
                    <div>
                        <i class="iconfont akweb"></i>
                    </div>
                </div>
            </div>
            <div class="item-article">
                <mavon-editor
                    :toolbarsFlag="false"
                    v-model="html"
                    :tabSize="4"
                    defaultOpen="preview"
                    :subfield="false"
                    codeStyle="atom-one-dark"
                ></mavon-editor>
            </div>
            <div class="info">
                <div class="item1 nocopy">
                    <div class="title">服务</div>
                    <div class="service" @click="goto('/tools')">Tools</div>
                    <div class="service" @click="goto('/notebook/book')">Notebook</div>
                    <div class="service" @click="goto('/blog/survey')">Ahriblog</div>
                    <div class="service" @click="goto('/ahridata/survey')">Ahridata</div>
                    <div class="service" @click="goto('/restful/survey')">RestfulApi</div>
                    <div class="service" @click="goto('/website/survey')">WebSite</div>
                    <div class="service" @click="goto('/dbm/mysql-auth')">Mysql-Admin</div>
                    <div class="service" @click="goto('/dbm/mongo-auth')">Mongo-Admin</div>
                </div>
                <div class="item2">
                    <div class="item3">
                        <div class="i">
                            <a href="https://www.ahriknow.com" target="_black">博客：www.ahriknow.com</a>
                            <a
                                href="http://monitor.ahriknow.com"
                                target="_black"
                            >监控：monitor.ahriknow.com</a>
                        </div>
                        <div class="contact">
                            <div class="i">联系我:</div>
                            <el-tooltip content="https://github.com/fox-ahri" placement="top">
                                <a href="https://github.com/fox-ahri" target="_black">
                                    <span>
                                        <i class="iconfont akgithub"></i>
                                    </span>
                                </a>
                            </el-tooltip>
                            <el-tooltip placement="top">
                                <div slot="content" class="qq">
                                    <img src="../assets/qq.jpg" style="width: 180px" alt />
                                </div>
                                <span>
                                    <i class="iconfont akqq"></i>
                                </span>
                            </el-tooltip>
                            <el-tooltip placement="top">
                                <div slot="content" class="wx">
                                    <img src="../assets/wx.png" style="width: 180px" alt />
                                </div>
                                <span>
                                    <i class="iconfont akweixin"></i>
                                </span>
                            </el-tooltip>
                            <el-tooltip content="myfsnow@163.com" placement="top">
                                <span>
                                    <i class="iconfont akemail"></i>
                                </span>
                            </el-tooltip>
                        </div>
                    </div>
                    <div class="item4">
                        <div
                            class="c"
                        >© 2019 ahriknow.com 版权所有&nbsp;&nbsp;&nbsp;&nbsp;吉ICP备 19000749号-5</div>
                        <!-- <div class="b">
                            <img src="../assets/TB2.gif" alt="1" />&nbsp;
                            <a
                                href="http://www.beian.gov.cn/portal/registerSystemInfo"
                                target="_black"
                            >
                                <img src="../assets/TB1.png" alt="2" />&nbsp;
                                <span>吉公网安备 xxx号</span>
                            </a>
                        </div>-->
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import "mavon-editor/dist/css/index.css";
import { mavonEditor } from "mavon-editor";
export default {
    name: "home",
    components: {
        mavonEditor
    },
    data() {
        return {
            user: {
                role: 0
            },
            html: ""
        };
    },
    created() {
        window.loading = this.$loading({
            lock: true,
            text: "Loading",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)"
        });
    },
    methods: {
        to(path) {
            if (path == "/auth/logout") {
                localStorage.clear();
                this.$store.commit("LOGOUT");
                this.user = {
                    role: 0
                };
            } else {
                this.$router.push(path);
            }
        },
        goto(path) {
            this.$router.push(path);
        },
        toDB(path, val) {
            this.$router.push(path + "?db=" + val);
        }
    },
    mounted() {
        if (this.$store.state.user != null) {
            this.user = this.$store.state.user;
        } else {
            this.user = {
                role: 0
            };
        }
        window.onscroll = () => {
            let scrollTop =
                document.documentElement.scrollTop || document.body.scrollTop;
            if (scrollTop <= 180) {
                try {
                    this.$refs.nav.style.background = `rgba(24,24,24,${scrollTop /
                        200})`;
                } catch {}
            }
        };
        window.onload = () => {
            let st =
                document.documentElement.scrollTop || document.body.scrollTop;
            if (st >= 180) {
                this.$refs.nav.style.background = `rgba(24,24,24,0.9)`;
            }
        };
        let self = this;
        this.axios
            .get(self.url + "/data/ahriblog/about/", {
                params: {
                    home: 11
                }
            })
            .then(response => {
                self.html = response.data.data.content;
            })
            .catch(response => {
                console.log(response);
            });
        try {
            setTimeout(() => {
                window.loading.close();
            }, 800);
        } catch {}
    }
};
</script>

<style lang="scss" scoped>
#home {
    width: 100%;
    background: rgb(240, 240, 240);
    .el-carousel__item img {
        height: 100%;
        width: 100%;
    }
    #nav {
        z-index: 9999;
        padding: 30px;
        height: 80px;
        width: 100%;
        position: fixed;
        top: 0;
        left: 0;
        background: rgba(24, 24, 24, 0);
        display: flex;
        justify-content: space-between;
        a {
            font-weight: bold;
            color: #ccc8;
            &.router-link-exact-active {
                color: #42b983;
            }
        }
        .btn {
            button {
                background: none;
                border: none;
                color: #fff;
                margin: 0 10px;
                cursor: pointer;
                transition: 0.2s;
                &:hover {
                    color: #ccc;
                }
            }
        }
    }
    .content {
        .items {
            position: relative;
            .container {
                position: absolute;
                height: 300px;
                width: 800px;
                top: 200px;
                right: 200px;
                text-align: right;
                transition: 0.3s;
                i {
                    font-size: 260px;
                    color: #fff9;
                }
                color: #fffa;
                cursor: pointer;
                &:hover {
                    transform: translate(5px, 5px);
                    color: #fff;
                    i {
                        font-size: 260px;
                        color: #fff;
                    }
                }
            }
        }
        .items1 {
            padding-top: 40px;
            height: 350px;
            width: 1000px;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            .item {
                height: 100%;
                width: 240px;
                background: #fff;
                text-align: center;
                cursor: pointer;
                transition: 0.3s;
                box-shadow: 0 0 5px rgba(71, 68, 68, 0.2);
                &:hover {
                    transform: scale(1.1);
                    background: rgb(240, 250, 250);
                }
                &:hover .title {
                    color: #ff6a00;
                }
                .title {
                    padding: 26px 0;
                    font-size: 26px;
                    transition: 0.3s;
                }
                .desc {
                    padding: 10px 20px;
                    height: 68px;
                }
                i {
                    font-size: 100px;
                }
            }
        }
        .items2 {
            padding-top: 40px;
            height: 350px;
            width: 1000px;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            .item {
                height: 100%;
                width: 320px;
                background: #fff;
                text-align: center;
                cursor: pointer;
                transition: 0.3s;
                box-shadow: 0 0 5px rgba(71, 68, 68, 0.2);
                &:hover {
                    transform: scale(1.1);
                    background: rgb(240, 250, 250);
                }
                &:hover .title {
                    color: #ff6a00;
                }
                .title {
                    padding: 26px 0;
                    font-size: 26px;
                    transition: 0.3s;
                }
                .desc {
                    padding: 10px 20px;
                    height: 68px;
                }
                i {
                    font-size: 100px;
                }
            }
        }
        .item-article {
            background: #fff;
            // padding: 30px;
            width: 1000px;
            margin: 40px auto;
        }
        .info {
            height: 300px;
            background: rgb(24, 24, 24);
            display: flex;
            justify-content: center;
            .item1 {
                width: 200px;
                height: 100%;
                border-right: #777 solid 1px;
                color: #ccc;
                padding: 30px;
                .title {
                    font-size: 22px;
                }
                .service {
                    margin: 5px 10px;
                    font-size: 16px;
                    cursor: pointer;
                    transition: 0.2s;
                    &:hover {
                        color: #999;
                    }
                    &:active {
                        color: #aaa;
                    }
                }
            }
            .item2 {
                width: 560px;
                height: 100%;
                display: flex;
                flex-direction: column;
                .item3 {
                    width: 560px;
                    flex: 1;
                    border-bottom: #777 solid 1px;
                    position: relative;
                    .i {
                        height: 100px;
                        display: flex;
                        flex-direction: column;
                        padding: 50px 0 0 30px;
                        a {
                            font-size: 18px;
                            color: #ccc;
                            text-decoration: none;
                            transition: 0.3s;
                            &:hover {
                                color: #aaa;
                            }
                        }
                    }
                    .contact {
                        position: absolute;
                        bottom: 10px;
                        display: flex;
                        justify-content: space-around;
                        .i {
                            height: 50px;
                            font-size: 20px;
                            color: #ccc;
                            line-height: 50px;
                            padding: 0 30px;
                            transform: translateY(-10px);
                        }
                        a {
                            text-decoration: none;
                        }
                        span {
                            margin: 0 30px;
                            cursor: pointer;
                            i {
                                font-size: 28px;
                                color: #aaa;
                                transition: 0.2s;
                            }
                            &:hover {
                                i {
                                    color: #ccc;
                                }
                            }
                        }
                        .qq {
                            background: #fff;
                            width: 160px;
                            height: 160px;
                        }
                    }
                }
                .item4 {
                    width: 560px;
                    height: 80px;
                    padding: 26px 20px;
                    display: flex;
                    justify-content: space-between;
                    .c {
                        color: #ccc;
                    }
                    .b {
                        img {
                            width: 26px;
                            height: 26px;
                        }
                        span {
                            display: inline-block;
                            height: 26px;
                            line-height: 26px;
                            transform: translateY(-6px);
                            color: #ccc;
                        }
                    }
                }
            }
        }
    }
}
</style>
