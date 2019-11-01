<template>
    <div id="comp-nav" class="comp-nav">
        <nav class="nocopy">
            <div class="a">
                <router-link to="/admin">Home</router-link>&nbsp;|&nbsp;
                <router-link to="/notebook/book">Notebook</router-link>&nbsp;|&nbsp;
                <router-link to="/blog/survey">Ahriblog</router-link>&nbsp;|&nbsp;
                <router-link to="/ahridata/survey">Ahridata</router-link>&nbsp;|&nbsp;
                <router-link to="/database/survey">Database</router-link>&nbsp;|&nbsp;
                <router-link to="/restful/survey">Restful</router-link>&nbsp;|&nbsp;
                <router-link to="/website/survey">Website</router-link>&nbsp;|&nbsp;
                <router-link to="/dbm/mysql-auth">MysqlAdmin</router-link>&nbsp;|&nbsp;
                <router-link to="/dbm/mongo-auth">MongoAdmin</router-link>
                <!-- &nbsp;|&nbsp;<router-link to="/transfer/galaxy">Transfer</router-link> -->
            </div>
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
    methods: {
        logout() {
            localStorage.clear();
            this.$store.commit("LOGOUT");
            this.user = {
                role: 0
            };
            this.$router.push("/admin");
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