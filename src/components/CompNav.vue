<template>
    <div id="comp-nav" class="comp-nav">
        <nav class="nocopy">
            <el-menu
                :default-active="active"
                class="el-menu-demo"
                mode="horizontal"
                @select="handleSelect"
                style="height: 70px;margin-top:10px"
            >
                <el-menu-item index="/admin">Home</el-menu-item>
                <el-menu-item index="/notebook/book">Notebook</el-menu-item>
                <el-menu-item index="/blog/survey">Ahriblog</el-menu-item>
                <el-menu-item index="/ahridata/survey">Ahridata</el-menu-item>
                <el-menu-item index="/database/survey">Database</el-menu-item>
                <el-menu-item index="/restful/survey">Restful</el-menu-item>
                <el-menu-item index="/website/survey">Website</el-menu-item>
                <el-menu-item index="/tools/secrecy">Tools</el-menu-item>
                <el-submenu index>
                    <template slot="title">DBM</template>
                    <el-menu-item index="/dbm/mysql-auth">MysqlAdmin</el-menu-item>
                    <el-menu-item index="/dbm/mongo-auth">MongoAdmin</el-menu-item>
                </el-submenu>
            </el-menu>
            <!-- <div class="a">
                <router-link to="/admin">Home</router-link>&nbsp;|&nbsp;
                <router-link to="/notebook/book">Notebook</router-link>&nbsp;|&nbsp;
                <router-link to="/blog/survey">Ahriblog</router-link>&nbsp;|&nbsp;
                <router-link to="/ahridata/survey">Ahridata</router-link>&nbsp;|&nbsp;
                <router-link to="/database/survey">Database</router-link>&nbsp;|&nbsp;
                <router-link to="/restful/survey">Restful</router-link>&nbsp;|&nbsp;
                <router-link to="/website/survey">Website</router-link>&nbsp;|&nbsp;
                <router-link to="/dbm/mysql-auth">MysqlAdmin</router-link>&nbsp;|&nbsp;
                <router-link to="/dbm/mongo-auth">MongoAdmin</router-link>&nbsp;|&nbsp;
                <router-link to="/tools">Tools</router-link>
                &nbsp;|&nbsp;<router-link to="/transfer/galaxy">Transfer</router-link>
            </div>-->
            <div class="btn">
                <button @click="logout()">
                    <i class>退出</i>
                </button>
            </div>
        </nav>
    </div>
</template>

<script>
export default {
    name: "comp-nav",
    props: ["active"],
    data() {
        return {
            activeIndex: "1"
        };
    },
    methods: {
        logout() {
            localStorage.clear();
            this.$store.commit("LOGOUT");
            this.user = {
                role: 0
            };
            this.$router.push("/admin");
        },
        handleSelect(key, keyPath) {
            if (this.$route.path != key) {
                this.$router.push(key);
                this.activeIndex = key;
            }
        }
    }
};
</script>

<style lang="scss" scoped>
#comp-nav {
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
        display: flex;
        justify-content: space-between;
        a {
            font-weight: bold;
            color: #2c3e50;
            &.router-link-exact-active {
                color: #42b983;
            }
        }
        .btn {
            button {
                background: none;
                border: none;
                color: #333;
                margin: 0 10px;
                cursor: pointer;
                transition: 0.2s;
                &:hover {
                    color: #666;
                }
            }
        }
    }
}
</style>