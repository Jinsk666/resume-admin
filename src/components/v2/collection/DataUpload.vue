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
                    <el-form-item label="企业名称:" id="factory">
                        <el-select
                            :popper-append-to-body="false"
                            @visible-change="handleShow"
                            @change="factoryChange"
                            filterable
                            remote
                            :remote-method="remoteMethod"
                            :loading="loading"
                            v-model="form.name"
                            placeholder="请选择"
                            size="small"
                            style="width:240px;">
                            <el-option
                                v-for="item in factoryList"
                                :key="item.enterpriseCode"
                                :label="item.enterpriseName"
                                :value="item.enterpriseCode">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="批次号:" id="batchCode">
                        <el-select
                            :disabled="form.name ? false : true"
                            :popper-append-to-body="false"
                            @visible-change="handleShow1"
                            filterable
                            remote
                            :remote-method="remoteMethod1"
                            :loading="loading1"
                            v-model="form.batchCode"
                            placeholder="请选择"
                            size="small"
                            style="width:240px">
                            <el-option
                                v-for="item in batchCodeList"
                                :key="item.enterpriseCode"
                                :label="item.uniqueCode"
                                :value="item.uniqueCode">
                            </el-option>
                        </el-select>
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
    import { scrollMore } from '@/utils'
    import { getStaticFactoryList, getStaticModuleList } from '@/api/v2'
    export default {
        props: ["isDataUpload", 'type'],
        data() {
            return {
                form: {
                    name: '',
                    batchCode: ''
                },
                isRemote: false,
                loading: false,
                loading1: false,

                factoryList:[],
                factoryPage: 1,// 当前页数
                factoryPageCount: 0, // 总共页数
                factoryLikeParams: '', // 搜索条件

                batchCodeList: [],
                batchCodePage: 1,
                batchCodePageCount: 0,
                batchCodeLikeParams: '',
            }
        },
        mounted() {
            this.remoteMethod('',1);
        },
        methods: {
            dataUploadSure() {
                this.$emit('dataUploadSure', this.form.batchCode);
            },
            dataUploadCancel() {
                this.$emit('dataUploadCancel');
            },
            handleClose() {
                this.$emit('handleClose');
            },
            factoryChange(val,oldValue) {
                this.remoteMethod1('',1)
            },
            handleShow(val){
                let dom = document.querySelectorAll('#factory .el-select-dropdown__wrap')[0];
                if( val == false ) {
                    dom.removeEventListener('scroll', this.loadMore);
                }else {
                    setTimeout(()=>{
                        dom.addEventListener('scroll', this.loadMore);
                    },200)
                }
            },
            handleShow1(val){
                let dom = document.querySelectorAll('#batchCode .el-select-dropdown__wrap')[0];
                if( val == false ) {
                    dom.removeEventListener('scroll', this.loadMore1);
                }else {
                    setTimeout(()=>{
                        dom.addEventListener('scroll', this.loadMore1);
                    },200)
                }
            },
            loadMore() {
                scrollMore('#factory .el-select-dropdown__wrap', () => {
                    if( !this.isRemote ) {
                        this.factoryPage++;
                        if( this.factoryPage > this.factoryPageCount ) {
                            this.$message('没用更多数据了')
                            return;
                        }
                        this.remoteMethod(this.factoryLikeParams, this.factoryPage);
                    }
                })
            },
            loadMore1() {
                scrollMore('#batchCode .el-select-dropdown__wrap', () => {
                    if( !this.isRemote ) {
                        this.batchCodePage++;
                        if( this.batchCodePage > this.batchCodePageCount ) {
                            this.$message('没用更多数据了')
                            return;
                        }
                        this.remoteMethod(this.batchCodeLinkParams, this.batchCodePage);
                    }
                })
            },
            remoteMethod(query, page) {
                if( !page ) this.factoryPage = 1;
                if( this.factoryPage == 1 ) this.factoryList = [];
                this.factoryLikeParams = query;
                this.isRemote = true;
                this.loading = true;
                getStaticFactoryList(this.factoryLikeParams, this.factoryPage, Number(this.type)).then(data => {
                    this.factoryPageCount = data.data.pageCount;
                    this.factoryList = this.factoryList.concat(data.data.releaseEnterpriseResponseDto);
                    this.loading = false;
                    this.isRemote = false;
                })
            },
            remoteMethod1(query, page) {
                if( !page ) this.batchCodePage = 1;
                if( this.batchCodePage == 1 ) this.batchCodeList = [];
                this.batchCodeLikeParams = query;
                this.isRemote = true;
                this.loading1 = true;
                getStaticModuleList(this.form.name, this.factoryLikeParams, this.batchCodePage, Number(this.type)).then(data => {
                    this.batchCodePageCount = data.data.pageCount;
                    this.batchCodeList = this.batchCodeList.concat(data.data.moduleDataAccessResponseDto);
                    this.loading1 = false;
                    this.isRemote = false;
                })
            },
        },
    }
</script>

<style lang="scss" scoped>
    .dialog-container {
        //text-align: center;
    }
</style>