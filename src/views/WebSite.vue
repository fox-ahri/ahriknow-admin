<template>
    <div id="website" class="website">
        <router-view />
    </div>
</template>

<script>
export default {
    name: "website"
};
</script>

<style lang="scss" scoped>
#website {
    width: 100%;
    height: 100%;
}
</style>