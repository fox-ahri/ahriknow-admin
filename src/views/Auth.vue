<template>
    <div id="auth" class="auth">
        <transition name="component-fade" mode="out-in">
            <router-view />
        </transition>
    </div>
</template>

<script>
export default {
    name: "auth",
    data() {
        return {};
    },
    created() {},
    methods: {},
    mounted() {}
};
</script>

<style lang="scss" scoped>
#auth {
    width: 100%;
    height: 100%;
    background: url("../assets/404.jpg") no-repeat center;
    background-size: cover;
    .component-fade-enter-active,
    .component-fade-leave-active {
        transition: opacity 0.2s ease;
    }
    .component-fade-enter,
    .component-fade-leave-to {
        opacity: 0;
    }
}
</style>