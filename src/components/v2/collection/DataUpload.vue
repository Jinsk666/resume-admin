<template>
    <div>
        <el-dialog
            title="提示"
            :visible.sync="isDataUpload"
            width="400px">
            <div class="dialog-container">
                <el-form label-position="right" label-width="90px" :model="form">
                    <el-form-item label="企业名称:">
                        <el-input v-model="form.name" size="small" style="width:240px;"></el-input>
                    </el-form-item>
                    <el-form-item label="批次号:">
                        <el-input v-model="form.batchCode" size="small" style="width:240px;"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" type="primary" @click="dataUploadSure">确 定</el-button>
                <el-button size="small" @click="dataUploadCancel">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        props: ["isDataUpload"],
        data() {
            return {
                form: {
                    name: '',
                    batchCode: ''
                }
            }
        },
        methods: {
            dataUploadSure() {
                this.$emit('dataUploadSure');
            },
            dataUploadCancel() {
                this.$emit('dataUploadCancel');
            }
        },
    }
</script>

<style lang="scss" scoped>
    .dialog-container {
        //text-align: center;
    }
</style>