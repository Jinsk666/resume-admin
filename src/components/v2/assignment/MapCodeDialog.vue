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
                <div v-else class="resume-top">
                履历数据编号:
                <el-select
                    :popper-append-to-body="false"
                    @visible-change="handleShow1"
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
                                :popper-append-to-body="false"
                                @visible-change="handleShow"
                                @focus="batchCodeFocus"
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
    import { setMapCode, getCodeList, getResumeList } from '@/api'
    import { isNumber, scrollMore } from '@/utils'
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
                isFirst: true, // 产品批次 在第一次 focus 触发
                isRemote: false, // 下拉框是否在 请求数据
                optionsPage: 1, // 当前页数
                optionsPageCount: 0, // 总共页数
                optionsLinkParams: '', // 搜索条件
                resumeOptionsPage: 1,
                resumeOptionsPageCount: 0,
                resumeOptionsLinkParams: '',
            }
        },
        mounted() {
            if( this.from != 'resume' ) {
                this.remoteMethodTop('', 1);
            }
        },
        methods: {
            batchCodeFocus() {
                if( this.isFirst ) {
                    this.options = [];
                    this.remoteMethod('', 1);
                    this.isFirst = false;
                }
            },
            // 产品批次
            handleShow(val) {
                let dom = document.querySelectorAll('.code-bottom .el-select-dropdown__wrap')[0];
                if( val == false ) {
                    dom.removeEventListener('scroll', this.loadMore);
                }else {
                    setTimeout(()=>{
                        dom.addEventListener('scroll', this.loadMore);
                    },200)
                }
            },
            //  产品批次
            loadMore() {
                scrollMore('.code-bottom .el-select-dropdown__wrap', () => {
                    if( !this.isRemote ) {
                        this.optionsPage++;
                        if( this.optionsPage > this.optionsPageCount ) {
                            this.$message('没用更多数据了')
                            return;
                        }
                        this.remoteMethod(this.optionsLinkParams, this.optionsPage);
                    }
                })
                // let dom = document.querySelectorAll('.code-bottom .el-select-dropdown__wrap')[0];
                // var scrollTop = dom.scrollTop; // 滑动高度
                // var windowHeight = dom.clientHeight; //可视区的高度
                // var scrollHeight = dom.scrollHeight; //滚动条的总高度
                // if(scrollTop + windowHeight == scrollHeight) {
                    
                // }
            },
            // 数据编码
            handleShow1(val){
                let dom = document.querySelectorAll('.resume-top .el-select-dropdown__wrap')[0];
                if( val == false ) {
                    dom.removeEventListener('scroll', this.loadMore1);
                }else {
                    setTimeout(()=>{
                        dom.addEventListener('scroll', this.loadMore1);
                    },200)
                }
            },
            // 数据编码
            loadMore1() {
                let dom = document.querySelectorAll('.resume-top .el-select-dropdown__wrap')[0];
                var scrollTop = dom.scrollTop; // 滑动高度
                var windowHeight = dom.clientHeight; //可视区的高度
                var scrollHeight = dom.scrollHeight; //滚动条的总高度
                if(scrollTop + windowHeight == scrollHeight) {
                    if( !this.isRemote ) {
                        this.resumeOptionsPage++;
                        if( this.resumeOptionsPage > this.resumeOptionsPageCount ) {
                            this.$message('没用更多数据了')
                            return;
                        }
                        this.remoteMethod(this.resumeOptionsLinkParams, this.resumeOptionsPage);
                    }
                }
            },
            // 确定
            codeDialogSure() {
                if( !this.mapCode.batchCode && !this.mapCode.inputCode ) {
                    this.$message.error('请输入履历对应码或产品批次');
                    return;
                }
                if(!this.resumeCode && !this.mapCode.resumeCode){
                    this.$message.error('请填写履历数据编码');
                    return;
                }
                if( this.mapCode.batchCode && ( !this.mapCode.startePoint || !this.mapCode.endPoint ) ) {
                    this.$message.error('请填写溯源号段');
                    return;
                }
                if( this.mapCode.startePoint &&  this.mapCode.endPoint) {
                    if( !isNumber( this.mapCode.startePoint ) || !isNumber( this.mapCode.endPoint )) {
                        this.$message.error('溯源号段应为数字');
                        return;
                    }
                    if( isNumber( this.mapCode.startePoint ) && isNumber( this.mapCode.endPoint ) ) {
                        if( this.mapCode.startePoint > this.mapCode.endPoint ) {
                            this.$message.error('溯源号段填写错误');
                            return;
                        }
                    }
                }
                setMapCode( (this.resumeCode?this.resumeCode:this.mapCode.resumeCode),this.mapCode.inputCode,this.mapCode.batchCode,this.mapCode.startePoint,this.mapCode.endPoint ).then((data) => {
                    if( data.data.inExistenceList && data.data.inExistenceList.length > 0 ) {
                        this.$message.error('该履历码已经对应过');
                        return;
                    }
                    if( data.data.inExistenceList && data.data.nonConformityList.length > 0 ){
                        this.$message.error('履历码不符合规则');
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
            remoteMethod(query, page) {
                if( !page ) this.optionsPage = 1;
                if( this.optionsPage == 1 ) this.options = [];
                this.optionsLinkParams = query;
                this.isRemote = true;
                this.loading = true;
                getCodeList(this.optionsLinkParams, this.optionsPage).then(data => {
                    this.optionsPageCount = data.data.pageCount;
                    this.options = this.options.concat(data.data.resumeBatchTwoOneResponseList);
                    this.loading = false;
                    this.isRemote = false;
                })
            },
            remoteMethodTop(query, page) {
                if( !page ) this.resumeOptionsPage = 1;
                if( this.resumeOptionsPage == 1 ) this.resumeOptions = [];
                this.resumeOptionsLinkParams = query;
                this.isRemote = true;
                this.loading1 = true;
                getResumeList(this.resumeOptionsLinkParams, this.resumeOptionsPage).then(data => {
                    this.optionsPageCount = data.data.pageCount;
                    this.resumeOptions = this.resumeOptions.concat(data.data.resumeDataTwoOneResponseList);
                    this.loading1 = false;
                    this.isRemote = false;
                })
            }
        },
    }
</script>

<style lang="scss" scoped>
    .code-container {
        //border-top: 1px solid #ddd;
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