<template>
    <div>
        <el-dialog
            title="添加企业"
            :visible.sync="isAddFactory"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :before-close="handleClose"
            width="450px">
            <div class="dialog-container">
                <el-form label-position="right" label-width="130px">
                    <el-form-item label="企业名称:">
                        <el-input type="text" size="small" style="width:240px" v-model="factory">

                        </el-input>
                    </el-form-item>
                    <el-form-item label="统一社会信用代码:">
                        <el-input type="text" size="small" style="width:240px" v-model="code">

                        </el-input>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" type="primary" @click="addFactorySure">确 定</el-button>
                <el-button size="small" @click="addFactoryCancel">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        props: ['isAddFactory'],
        data() {
            return {
                factory:'',
                code:''
            }
        },
        methods: {
            handleClose() {
                this.$emit('handleClose');
            },
            addFactorySure() {
                this.$emit('addFactorySure');
            },
            addFactoryCancel() {
                this.$emit('addFactoryCancel');
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>