<template>
    <div id="home" class="home">
        <div id="nav" class="nocopy">
            <router-link to="/admin">Home</router-link>&nbsp;|&nbsp;
            <router-link to="/auth/login">Sign in</router-link>&nbsp;|&nbsp;
            <router-link to="/ahridata/survey">AhriData</router-link>&nbsp;|&nbsp;
            <router-link to="/blog/survey">Ahriblog</router-link>&nbsp;|&nbsp;
            <router-link to="/notebook/book">Notebook</router-link>
            <span v-if="user.role == 100">
                &nbsp;|&nbsp;
                <router-link to="/setting/user">UserManage</router-link>
            </span>
        </div>
    </div>
</template>

<script>
export default {
    name: "home",
    data() {
        return {
            user: {
                role: 0
            }
        };
    },
    methods: {},
    mounted() {
        if (this.$store.state.user != null) {
            this.user = this.$store.state.user;
        } else {
            this.user = {
                role: 0
            };
        }
    }
};
</script>

<style lang="scss" scoped>
#home {
    width: 100%;
    height: 100%;
    background: url("../assets/bg.jpg") no-repeat 100%;
    background-size: cover;
    #nav {
        padding: 30px;
        a {
            font-weight: bold;
            color: #ccc8;
            &.router-link-exact-active {
                color: #42b983;
            }
        }
    }
}
</style>
