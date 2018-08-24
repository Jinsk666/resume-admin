<template>
    <div>
        <el-dialog
            title="提示"
            :visible.sync="isDataUpload"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :before-close="handleClose"
            width="400px">
            <div class="dialog-container">
                <el-form label-position="right" label-width="90px" :model="form">
                    <el-form-item label="企业名称:">
                        <el-select
                            :popper-append-to-body="false"
                            @visible-change="handleShow"
                            filterable
                            remote
                            :remote-method="remoteMethodTop"
                            :loading="loading1"
                            v-model="form.name"
                            placeholder="请选择"
                            size="small"
                            style="width:240px">
                            <el-option
                                v-for="item in resumeOptions"
                                :key="item.uniqueCode"
                                :value="item.uniqueCode">
                            </el-option>
                        </el-select>
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
            },
            handleClose() {
                this.$emit('handleClose');
            }
        },
    }
</script>

<style lang="scss" scoped>
    .dialog-container {
        //text-align: center;
    }
</style>