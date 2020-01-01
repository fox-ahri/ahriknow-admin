<template>
    <div id="footnav" class="footnav nocopy">
        <router-link to="/admin">{{ $t('l.comp.home') }}</router-link>&nbsp;|&nbsp;
        <router-link to="/notebook/book">{{ $t('l.comp.notebook') }}</router-link>&nbsp;|&nbsp;
        <router-link to="/blog/survey">{{ $t('l.comp.ahriblog') }}</router-link>&nbsp;|&nbsp;
        <router-link to="/ahridata/survey">{{ $t('l.comp.ahridata') }}</router-link>&nbsp;|&nbsp;
        <router-link to="/database/survey">{{ $t('l.comp.database') }}</router-link>&nbsp;|&nbsp;
        <router-link to="/dataview/survey">{{ $t('l.comp.dataview') }}</router-link>&nbsp;|&nbsp;
        <router-link to="/restful/survey">{{ $t('l.comp.restful') }}</router-link>&nbsp;|&nbsp;
        <router-link to="/website/survey">{{ $t('l.comp.website') }}</router-link>&nbsp;|&nbsp;
        <router-link to="/transfer/galaxy">{{ $t('l.comp.transfer') }}</router-link>&nbsp;|&nbsp;
        <router-link to="/dbm/mysql-auth">{{ $t('l.comp.dbms.mysql') }}</router-link>&nbsp;|&nbsp;
        <router-link to="/dbm/mongo-auth">{{ $t('l.comp.dbms.mongo') }}</router-link>&nbsp;|&nbsp;
        <router-link to="/tools">{{ $t('l.comp.tools') }}</router-link>
    </div>
</template>

<script>
export default {
    name: "footnav",
    methods:{
        change_lang(lang) {
            this.$i18n.locale = lang;
        }
    }
};
</script>

<style lang="scss" scoped>
#footnav {
    width: 100%;
    height: 100%;
    background: #eee;
    line-height: 60px;
    text-align: center;
    a {
        font-size: 14px;
        color: #2c3e50;
        &.router-link-exact-active {
            color: #42b983;
        }
    }
}
</style>