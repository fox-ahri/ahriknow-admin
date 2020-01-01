<template>
    <div id="tools-json" class="tools-json">
        <el-row :gutter="20">
            <el-col :xs="24" :sm="24" :md="10" style="display: flex">
                <el-input
                    type="textarea"
                    :rows="15"
                    :placeholder="$t('l.tools.json.inputData')"
                    v-model="data"
                ></el-input>
                <el-button
                    plain
                    @click="format"
                    style="height: 50px;margin: 0 10px"
                >{{ $t('l.tools.json.format') }}</el-button>
            </el-col>
            <el-col :xs="24" :sm="24" :md="14">
                <JsonViewer :value="json" copyable boxed></JsonViewer>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import JsonViewer from "vue-json-viewer";
export default {
    name: "tools-json",
    components: {
        JsonViewer
    },
    data() {
        return {
            data: "",
            json: {}
        };
    },
    methods: {
        format() {
            try {
                this.json = JSON.parse(this.data);
            } catch {
                this.$message({
                    message: this.$t("l.tools.json.error"),
                    type: "warning"
                });
                this.json = {};
            }
        }
    },
    mounted() {}
};
</script>