<!-- 赋码弹出框 -->
<template>
    <div>
        <el-dialog
            title="履历赋码"
            :visible.sync="codeDialog"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :before-close="handleClose"
            width="800px"
            >
            <div class="code-container">
                <div v-if="from=='resume'">
                履历数据编号: <el-input disabled v-model="resumeCode" placeholder="请输入内容" style="width: 220px;" size="small"></el-input>
                </div>
                <div v-else>
                履历数据编号:
                <el-select
                    filterable
                    remote
                    :remote-method="remoteMethodTop"
                    :loading="loading1"
                    v-model="mapCode.resumeCode"
                    placeholder="请选择"
                    size="small"
                    style="width:262px">
                    <el-option
                        v-for="item in resumeOptions"
                        :key="item.uniqueCode"
                        :value="item.uniqueCode">
                    </el-option>
                </el-select>
                </div>
                <div class="code-bottom">
                    <div class="left code-left">
                        <div>
                            <div class="font">手动输入对应履历码</div>
                        </div>
                        <div class="left add-border">
                            <el-input
                                v-model="mapCode.inputCode"
                                type="textarea"
                                :rows="5"
                                :autosize="{ minRows: 5, maxRows: 10}"
                                placeholder="多个溯源码请用 , 隔开"
                                style="width: 318px;"
                                >
                            </el-input>
                        </div>
                    </div>
                    <div class="right code-right">
                        <div class="font2">对应批次履历码范围</div>
                        <div class="choose-product">
                            选择产品批次:
                            <el-select
                                filterable
                                remote
                                :remote-method="remoteMethod"
                                :loading="loading"
                                v-model="mapCode.batchCode"
                                placeholder="请选择"
                                size="small"
                                style="width:262px">
                                <el-option
                                    v-for="item in options"
                                    :key="item.batchCode"
                                    :label="item.batchCode"
                                    :value="item.batchCode">
                                </el-option>
                            </el-select>
                        </div>
                        <div>
                            选择溯源号段:
                            <el-input v-model="mapCode.startePoint" size="small" style="width:120px;"></el-input>
                            —
                            <el-input v-model="mapCode.endPoint" size="small" style="width:120px;"></el-input>
                        </div>
                    </div>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="codeDialogCancel">取 消</el-button>
                <el-button size="small" type="primary" @click="codeDialogSure">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import { setMapCode, getCodeList, getResumeList} from '@/api'
    export default {
        props:[ 'codeDialog', 'resumeCode', 'from'],
        data() {
            return {
                mapCode: {
                    resumeCode: '',
                    inputCode: '',
                    batchCode: '',
                    startePoint: '',
                    endPoint: ''
                },
                options:[],
                resumeOptions: [],
                loading: '',
                loading1: '',
            }
        },
        mounted() {
            // getCodeList('', 1).then(((data) => {
            //     this.options = data.data.resumeBatchTwoResponseList;
            // }))
            this.remoteMethod();
            if( this.from != 'resume' ) {
                this.remoteMethodTop();
                // getResumeList('', 1).then(data => {
                //     this.resumeOptions = data.data.productInfoListSubset;
                // })
            }
        },
        methods: {
            codeDialogSure() {
                setMapCode( (this.resumeCode?this.resumeCode:this.mapCode.resumeCode),this.mapCode.inputCode,this.mapCode.batchCode,this.mapCode.startePoint,this.mapCode.endPoint ).then((data) => {
                    if( data.data.inExistenceList && data.data.inExistenceList.length > 0 ) {
                        this.$message.error('履历码已经对应过');
                        return;
                    }
                    if( data.data.inExistenceList && data.data.nonConformityList.length > 0 ){
                        this.$message.error('履历码不符合规则');
                        return;
                    }
                    if( !this.mapCode.batchCode ) {
                        this.$message.error('输入有误');
                        return;
                    }
                    if(!this.resumeCode && !this.mapCode.resumeCode){
                        this.$message.error('请填写履历数据编码');
                        return;
                    }
                    this.$message.success('赋码成功');
                    this.$emit('codeDialogSure');
                })
            },
            codeDialogCancel() {
                this.$emit('codeDialogCancel');
            },
            handleClose() {
                this.$emit('handleClose');
            },
            remoteMethod(query) {
                this.loading = true;
                getCodeList(query, 1).then(data => {
                    this.loading = false;
                    this.options = data.data.resumeBatchTwoResponseList;
                })
            },
            remoteMethodTop(query) {
                this.loading1 = true;
                getResumeList(query, 1).then(data => {
                    this.loading1 = false;
                    this.resumeOptions = data.data.productInfoListSubset;
                })
            }
        },
    }
</script>

<style lang="scss" scoped>
    .code-container {
        border-top: 1px solid #ddd;
        padding: 10px;
        overflow: hidden;
        .font, .font2 {
            font-weight: 500;
            font-size: 15px;
            margin: 10px 0;
        }
        .font2 {
            margin: 10px 0 30px 0;
        }
        .code-bottom {
            padding-top: 16px;
        }
        .choose-product {
            margin: 10px 0;
        }
    }
    .add-border {
        width: 350px;
        border-right: 1px solid #C7C7C7;
    }
    .code-left {
        width: 50%;
    }
    .code-right {
        width: 50%;
    }
</style>