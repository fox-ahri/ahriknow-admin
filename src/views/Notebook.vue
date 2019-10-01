<template>
    <div id="notebook" class="notebook">
        <router-view />
    </div>
</template>

<script>
export default {
    name: "notebook",
    data() {
        return {};
    },
    created() {},
    methods: {},
    mounted() {
        try {
            if (this.$store.state.user != null) {
                this.user = this.$store.state.user;
            } else {
                this.user = {
                    role: 0
                };
                window.location = "/";
                return false;
            }
        } catch (e) {
            window.location = "/";
        }
    }
};
</script>

<style lang="scss" scoped>
#notebook {
    width: 100%;
    height: 100%;
}
</style>