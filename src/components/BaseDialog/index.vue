<template>
    <!-- 基本信息添加 -->
    <el-dialog
        title="基本信息"
        :visible.sync="baseDialog"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :before-close="handleClose"
        width="548px">
        <div v-if="toData.generalInfoList">
            <el-form :inline="true" ref="productInfoDom" label-width="80px" size="mini">
                <el-form-item
                    v-for="(item, index) in toData.generalInfoList"
                    :key="index"
                    :label="item.label"
                >
                    <el-input
                        v-model="item.value"
                        v-if="item.label != '流转信息' && item.label.indexOf('时间') == -1"
                        :placeholder="item.describe">
                    </el-input>
                    <el-input
                        v-if="item.label == '流转信息'"
                        type="textarea"
                        :placeholder="item.describe"
                        v-model="item.value"
                        rows="4"
                        style="width:408px;">
                        </el-input>
                        <el-date-picker
                        v-if="item.label.indexOf('时间') != -1"
                        style="width:158px;"
                        type="date"
                        v-model="item.value">
                        </el-date-picker>
                </el-form-item>
            </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="baseDialogCancel" size="small">取 消</el-button>
            <el-button type="primary" @click="baseDialogSure" size="small">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
    export default {
        props: ['baseDialog'],
        data() {
            return {

            }
        },
        computed: {
            toData() {
                return this.$store.state.app.stepData || []
            },
            toDataClone() {
                return this.$store.state.app.stepDataClone || []
            },
        },
        methods: {
            handleClose() {
                this.$emit('handleClose');
            },
            baseDialogCancel() {
                this.$emit('baseDialogCancel');
            },
            baseDialogSure() {
                this.$emit('baseDialogSure');
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>