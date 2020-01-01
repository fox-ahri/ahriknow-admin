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
                <el-menu-item index="/admin">{{ $t('l.comp.home') }}</el-menu-item>
                <el-menu-item index="/notebook/book">{{ $t('l.comp.notebook') }}</el-menu-item>
                <el-menu-item index="/blog/survey">{{ $t('l.comp.ahriblog') }}</el-menu-item>
                <el-menu-item index="/ahridata/survey">{{ $t('l.comp.ahridata') }}</el-menu-item>
                <el-menu-item index="/database/survey">{{ $t('l.comp.database') }}</el-menu-item>
                <el-menu-item index="/dataview/survey">{{ $t('l.comp.dataview') }}</el-menu-item>
                <el-menu-item index="/restful/survey">{{ $t('l.comp.restful') }}</el-menu-item>
                <el-menu-item index="/website/survey">{{ $t('l.comp.website') }}</el-menu-item>
                <el-menu-item index="/tools/secrecy">{{ $t('l.comp.tools') }}</el-menu-item>
                <el-submenu index>
                    <template slot="title">{{ $t('l.comp.dbm') }}</template>
                    <el-menu-item index="/dbm/mysql-auth">{{ $t('l.comp.dbms.mysql') }}</el-menu-item>
                    <el-menu-item index="/dbm/mongo-auth">{{ $t('l.comp.dbms.mongo') }}</el-menu-item>
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
                <el-tooltip class="item" effect="dark" placement="bottom">
                    <div slot="content" style="display: flex;flex-direction: column">
                        <el-button type="text" @click="change_lang('中文简体')">中文简体</el-button>
                        <el-button type="text" @click="change_lang('English')">English</el-button>
                    </div>
                    <el-button type="text">
                        <i>{{ this.$i18n.locale }}</i>
                    </el-button>
                </el-tooltip>
                <button @click="logout()">
                    <i>{{ $t('l.comp.exit') }}</i>
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
        change_lang(lang) {
            this.$i18n.locale = lang;
        },
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