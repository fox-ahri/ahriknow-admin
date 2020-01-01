<template>
    <div id="tools" class="tools">
        <comp-nav active="/tools/secrecy"></comp-nav>
        <section>
            <nav class="tools-nav">
                <router-link to="/tools/secrecy">{{ $t('l.tools.secrecy.title') }}</router-link>&nbsp;|&nbsp;
                <router-link to="/tools/image">{{ $t('l.tools.image.title') }}</router-link>&nbsp;|&nbsp;
                <router-link to="/tools/ocr">{{ $t('l.tools.ocr.title') }}</router-link>&nbsp;|&nbsp;
                <router-link to="/tools/face">{{ $t('l.tools.faceDetect.title') }}</router-link>&nbsp;|&nbsp;
                <router-link to="/tools/json">{{ $t('l.tools.json.title') }}</router-link>
            </nav>
            <router-view />
        </section>
    </div>
</template>

<script>
import CompNav from "@/components/CompNav.vue";
export default {
    name: "tools",
    components: {
        "comp-nav": CompNav
    },
    data() {
        return {};
    }
};
</script>

<style lang="scss" scoped>
#tools {
    width: 100%;
    height: 100%;
    section {
        padding: 20px;
        .tools-nav {
            padding: 20px 0;
            line-height: 30px;
            a {
                font-weight: bold;
                color: #2c3e50;
                &.router-link-exact-active {
                    color: #42b983;
                }
            }
        }
        padding-top: 100px;
    }
}
</style>