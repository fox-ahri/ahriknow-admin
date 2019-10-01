<template>
    <div id="error404" class="error404 nocopy">
        <div class="box">
            <span>404</span>
            <router-link to="/admin">Home</router-link>
        </div>
    </div>
</template>

<script>
export default {
    name: "error404",
    data() {
        return {};
    },
    created() {},
    methods: {},
    mounted() {}
};
</script>

<style lang="scss" scoped>
#error404 {
    width: 100%;
    height: 100%;
    background: url("../assets/404.jpg") no-repeat center;
    background-size: cover;
    display: flex;
    justify-content: center;
    align-items: center;
    .box {
        width: 400px;
        text-align: center;
        span {
            font-size: 240px;
            color: #ccc;
        }
        a {
            color: #ccc;
            font-size: 20px;
        }
    }
}
</style>