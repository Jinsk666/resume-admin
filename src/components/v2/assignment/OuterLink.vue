<template>
    <div>
        <!-- 外部链接 -->
        <el-dialog
        title="外部链接"
        :visible.sync="outerLinkDialog"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :before-close="handleClose"
        width="548px">
            <el-table
                :data="outerData"
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
                        <span class="todo" v-if="isAdd" @click="handleThirdAdd(scope.$index, outerData,scope)">+</span>
                        <span class="todo" v-if="isDelete" @click="handleThirdDelete(scope.$index, outerData)">-</span>
                    </template>
                </el-table-column>
                <el-table-column
                    align="center"
                    prop="externalName"
                    label="名称"
                    min-width="150">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.externalName" size="small"></el-input>
                    </template>
                </el-table-column>
                <el-table-column
                align="center"
                    prop="externalURL"
                    label="URL"
                    min-width="150">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.externalURL" size="small"></el-input>
                    </template>
                </el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer">
            <el-button @click="outerLinkDialogCancel" size="small">取 消</el-button>
            <el-button type="primary" @click="outerLinkDialogSure" size="small">确 定</el-button>
        </span>
        </el-dialog>
    </div>
</template>

<script>
    import { deepClone } from '@/utils'
    export default {
        props: ['outerData', 'outerLinkDialog'],
        data() {
            return {
                list: [],  // 这是一个副本  如果取消就用这个换掉 改变的
                // 外部链接
                isAdd: true,
                isDelete: false,
            }
        },
        mounted() {
            this.list = deepClone(this.outerData)
            if( this.outerData.length == 1 ) {
                this.isAdd = true;
                this.isDelete = false;
            }else if( this.outerData.length == 3 ) {
                this.isAdd = false;
                this.isDelete = true;
            }else {
                this.isAdd = true;
                this.isDelete = true;
            }
        },
        methods: {
            handleThirdAdd(index, rows, scope) {
                rows.push({externalName:'',externalURL:''})
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
            outerLinkDialogSure() {
                this.$emit('outerLinkDialogSure');
            },
            outerLinkDialogCancel() {
                this.$emit('outerLinkDialogCancel', this.list);
            },
            handleClose() {
                this.$emit('handleClose');
            }
        },
    }
</script>

<style scoped>
    .todo {
        font-size: 16px;
        cursor: pointer;
        padding: 0 4px;
    }
</style>