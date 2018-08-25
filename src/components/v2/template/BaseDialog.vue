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
                    :label="item.label+' : '"
                    :prop="item.label"
                >
                    <el-input
                        v-model="item.value"
                        v-if="item.label != '简要介绍' && item.label.indexOf('时间') == -1"
                        :placeholder="item.describe">
                    </el-input>
                    <el-input
                        v-if="item.label == '简要介绍'"
                        type="textarea"
                        :placeholder="item.describe"
                        v-model="item.value"
                        rows="4"
                        style="width:408px;">
                        </el-input>
                        <el-date-picker
                        v-if="item.label.indexOf('时间') != -1"
                        style="width:158px;"
                        :editable="false"
                        type="date"
                        value-format="timestamp"
                        v-model="item.value">
                        </el-date-picker>
                </el-form-item>
            </el-form>
            <div class="third-party">第三方认证</div>
            <!-- 第三方 -->
            <el-table
                :data="toData.authenticationList"
                stripe
                size="mini"
                border
                style="width: 100%">
                <el-table-column
                    type="index"
                    label="序号"
                    align="center"
                    min-width="50">
                </el-table-column>
                <el-table-column
                    align="center"
                    label="操作"
                    width="100">
                    <template slot-scope="scope">
                        <span class="todo" v-if="isAdd" @click="handleThirdAdd(scope.$index, toData.authenticationList,scope)">+</span>
                        <span class="todo" v-if="isDelete" @click="handleThirdDelete(scope.$index, toData.authenticationList)">-</span>
                    </template>
                </el-table-column>
                <el-table-column
                    align="center"
                    prop="label"
                    label="认证名称"
                    min-width="150">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.label" size="small"></el-input>
                    </template>
                </el-table-column>
                <el-table-column
                align="center"
                    prop="value"
                    label="机构名称"
                    min-width="150">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.value" size="small"></el-input>
                    </template>
                </el-table-column>
            </el-table>
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
                isAdd: true,
                isDelete: false,
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
            },
            // 第三方
            handleThirdAdd(index, rows, scope) {
                rows.push({label:'',value:''})
                if( rows.length == 3 ) {
                    this.isAdd = false;
                    this.isDelete = true;
                }else if( rows.length == 1 ) {
                    this.isAdd = true;
                    this.isDelete = false;
                }else {
                    this.isAdd = true;
                    this.isDelete = true;
                }
            },
            handleThirdDelete(index, rows) {
                if( rows.length == 1 ) return;
                rows.splice(index, 1);
                if( rows.length == 1 ) {
                    this.isAdd = true;
                    this.isDelete = false;
                }else {
                    this.isAdd = true;
                    this.isDelete = true;
                }
            },
        },
    }
</script>

<style lang="scss" scoped>
    .third-party {
        font-weight: 500;
        margin-bottom: 10px;
    }
    .todo {
        font-size: 16px;
        cursor: pointer;
        padding: 0 4px;
    }
</style>