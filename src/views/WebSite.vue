<template>
    <div id="website" class="website">
        <router-view />
    </div>
</template>

<script>
export default {
    name: "website",
    data() {
        return {};
    },
    created() {},
    methods: {},
    mounted() {}
};
</script>

<style lang="scss" scoped>
#website {
    width: 100%;
    height: 100%;
}
</style>