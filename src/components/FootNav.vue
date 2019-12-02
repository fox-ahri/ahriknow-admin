<template>
    <div id="footnav" class="footnav nocopy">
        <router-link to="/admin">Home</router-link>&nbsp;|&nbsp;
        <router-link to="/notebook/book">Notebook</router-link>&nbsp;|&nbsp;
        <router-link to="/blog/survey">Ahriblog</router-link>&nbsp;|&nbsp;
        <router-link to="/ahridata/survey">AhriData</router-link>&nbsp;|&nbsp;
        <router-link to="/database/survey">Database</router-link>&nbsp;|&nbsp;
        <router-link to="/restful/survey">Restful</router-link>&nbsp;|&nbsp;
        <router-link to="/website/survey">Website</router-link>&nbsp;|&nbsp;
        <router-link to="/transfer/galaxy">Transfer</router-link>&nbsp;|&nbsp;
        <router-link to="/dbm/mysql-auth">MysqlAdmin</router-link>&nbsp;|&nbsp;
        <router-link to="/dbm/mongo-auth">MongoAdmin</router-link>&nbsp;|&nbsp;
        <router-link to="/tools">Tools</router-link>
    </div>
</template>

<script>
export default {
    name: "footnav"
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