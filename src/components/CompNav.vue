<template>
    <div id="comp-nav" class="comp-nav">
        <nav class="nocopy">
            <router-link to="/admin">Home</router-link>&nbsp;|&nbsp;
            <router-link to="/auth/login">Sign in</router-link>&nbsp;|&nbsp;
            <router-link to="/auth/register">Sign up</router-link>&nbsp;|&nbsp;
            <router-link to="/ahridata/survey">AhriData</router-link>&nbsp;|&nbsp;
            <router-link to="/blog/survey">Ahriblog</router-link>&nbsp;|&nbsp;
            <router-link to="/notebook/book">Notebook</router-link>
            <!-- &nbsp;|&nbsp;<router-link to="/transfer/galaxy">Transfer</router-link> -->
        </nav>
    </div>
</template>

<script>
export default {
    name: "comp-nav",
    data() {
        return {};
    },
    created() {},
    methods: {},
    mounted() {}
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
        a {
            font-weight: bold;
            color: #2c3e50;
            &.router-link-exact-active {
                color: #42b983;
            }
        }
    }
}
</style>