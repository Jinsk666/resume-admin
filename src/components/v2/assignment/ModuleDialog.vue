<template>
    <div>
        <el-dialog
            title="选择模板"
            :visible.sync="moduleDialog"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :before-close="handleClose"
            width="700px">
            <div class="container">
                <div class="header">
                    <el-input prefix-icon="el-icon-search" v-model="likeParams" clearable placeholder="输入关键字" size="small" style="width:200px; margin-right:20px;"></el-input>
                    <el-button type="primary" size="small" @click="handleSearch(1)">搜索</el-button>
                </div>
                <div class="content">
                    <el-table
                        :data="tableData"
                        highlight-current-row
                        @current-change="handleChange"
                        border
                        style="width: 100%">
                        <el-table-column
                            prop="imgUrl"
                            label="图片"
                            align="center"
                            width="180">
                        </el-table-column>
                        <el-table-column
                            prop="uniqueCode"
                            label="模板编码"
                            align="center"
                            width="180">
                        </el-table-column>
                        <el-table-column
                            prop="resumeTemplateName"
                            align="center"
                            label="模板名称">
                        </el-table-column>
                        <el-table-column
                            :formatter="formatter"
                            align="center"
                            prop="insertTime"
                            label="创建日期">
                        </el-table-column>
                    </el-table>
                </div>
                <div class="paganation"></div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="moduleDialogSure" size="small">确定</el-button>
                <el-button @click="moduleDialogCancel" size="small">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import { getModuleList } from '@/api/v2'
    import { formatTime } from '@/utils'
    export default {
        props: ['moduleDialog'],
        data() {
            return {
               likeParams: '',
               code: '',
               tableData: [],
            }
        },
        mounted() {
            this.handleSearch(1);
        },
        methods: {
            handleSearch(page) {
                if( !this.moduleDialog ) return;
                getModuleList(this.likeParams, page).then(data => {
                    this.tableData = data.data.resumeTemplateTwoOneResponseList;
                })
            },
            moduleDialogSure() {
                this.$emit('moduleDialogSure', this.code)
            },
            moduleDialogCancel() {
                this.$emit('moduleDialogCancel')
            },
            handleClose() {
                this.$emit('handleClose');
            },
            formatter(row, column, cellValue, index) {
                return formatTime(cellValue, 'Y-m-d')
            },
            handleChange(current, old) {
                console.log(current)
                this.code = current.uniqueCode;
            }
        }
    }
</script>

<style lang="scss" scoped>
    .header {
        margin-bottom: 20px;
    }
    .content{
        max-height:200px;
        overflow-y: auto;
    }
</style>