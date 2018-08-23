<template>
    <div>
        <!-- 添加产品模态框 -->
        <el-dialog
            title="生产流程"
            :visible.sync="stepDialog"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :before-close="handleClose"
            width="900px">
            <div class="step-container clearfix" v-if="toData.moduleInfos">
                <!-- 流程步骤 -->
                <div class="clearfix">
                    <span class="left move" @click="leftMove">
                        <i class="el-icon-caret-left"></i>
                    </span>
                    <div class="top-step-contaiber left">
                        <div class="top-step" ref="moveDom">
                            <div class="left item-btn"
                                v-for="(item, index) in toData.moduleInfos"
                                :key="index">
                                <!-- 步骤 -->
                                <div
                                    class="left step-item"
                                    @click="handleStep(index, item.moduleName)"
                                    :class="{active: accordionIndex == index}">
                                    {{item.moduleName || ''}}
                                </div>
                                <div class="left" v-show="toData.moduleInfos.length - 1 != index">
                                    <div class="left icon-jt">
                                        <svg-icon icon-class="jt"></svg-icon>
                                    </div>
                                </div>
                            </div>
                            <div id="last_add" class="left step-add" style="visibility:hidden;">
                                <i class="el-icon-circle-plus-outline"></i>
                            </div>
                        </div>
                    </div>
                    <span class="right move" id="last_move" @click="rightMove">
                        <i class="el-icon-caret-right"></i>
                    </span>
                </div>
                <!-- 表单内容 -->
                <div class="middle-container">
                    <div class="current-font">当前{{toData.moduleInfos[accordionIndex].moduleName || ''}}流程</div>
                    <div class="search"></div>
                    <div
                        v-for="(item, index) in toData.moduleInfos"
                        :key="index">
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
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="stepDialogCancel" size="small">取 消</el-button>
                <el-button type="primary" @click="stepDialogSure" size="small">保 存</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import { deepClone } from '@/utils/index'
    import { isImg } from '@/utils/index'
    import  axios  from 'axios'
    export default {
        props: ['stepDialog'],
        data() {
            return {
                list:{
                    '种植':{ // zz
                        label:[ {prop: 'zzUniqueCode',label: '编号', width: '200' },
                                {prop: 'zzBatchNumber',label: '种植批次号', width: '200' },
                                {prop: 'zzMedicineName',label: '药材名称', width: '200' },
                                {prop: 'zzGermplasmPrimitives',label: '种质/基原', width: '200' },
                                {prop: 'zzEnterpriseName',label: '企业名称', width: '200' },
                            ],
                        placeholder:'编号/种植批次号/药材名称/种质/基原/企业名称',
                        likeParams: '',
                        type: 2,
                        data: []
                    },
                    '采收':{ //cs
                        label:[ {prop: 'csUniqueCode',label: '编号', width: '200' },
                                {prop: 'csBatchNumber',label: '采收批次号', width: '200' },
                                {prop: 'csPosition',label: '采收部位', width: '200' },
                                {prop: 'csDate',label: '采收日期', width: '200' },
                                {prop: 'csEnterpriseName',label: '采收企业主体', width: '200' },
                            ],
                        placeholder:'编号/采收批次号/采收部位/采收日期/采收企业主体',
                        likeParams: '',
                        type: 3,
                        data: []
                    },
                    '仓储':{ // cc
                        label:[ {prop: 'ccUniqueCode',label: '编号', width: '200' },
                                {prop: 'ccBatchCode',label: '入库批次号', width: '200' },
                                {prop: 'ccClassification',label: '仓储分类', width: '200' },
                                {prop: 'ccType',label: '仓库类型', width: '200' },
                                {prop: 'ccEnterpriseName',label: '仓储企业主体', width: '200' },
                            ],
                        placeholder:'编号/入库批次号/仓储分类/仓库类型/仓储企业主体',
                        likeParams: '',
                        type: 6,
                        data: []
                    },
                    '加工':{ // jg
                        label:[ {prop: 'jgUniqueCode',label: '编号', width: '200' },
                                {prop: 'jgType',label: '加工类型', width: '200' },
                                {prop: 'jgProductName',label: '加工产品名', width: '200' },
                                {prop: 'jgBatchNumber',label: '加工批次号', width: '200' },
                                {prop: 'jgEnterpriseName',label: '加工企业主体', width: '200' },
                            ],
                        placeholder:'编号/加工类型/加工产品名/加工批次号/加工企业主体',
                        likeParams: '',
                        type: 4,
                        data: []
                    },
                    '包装':{ // 包装
                        label:[ {prop: 'bzUniqueCode',label: '编号', width: '200' },
                                {prop: 'bzType',label: '包装类型', width: '200' },
                                {prop: 'bzPackMethod',label: '包装方式', width: '200' },
                                {prop: 'bzBatchCode',label: '包装批次号', width: '200' },
                                {prop: 'bzEnterpriseName',label: '包装企业主体', width: '200' }
                            ],
                        placeholder:'编号/包装类型/包装方式/包装批次号/包装企业主体',
                        likeParams: '',
                        type: 5,
                        data: []
                    },
                    '检测':{ // 检测
                        label:[ {prop: 'jcUniqueCode',label: '编号', width: '200' },
                                {prop: 'jcType',label: '检测类型', width: '200' },
                                {prop: 'jcProject',label: '检测项目', width: '200' },
                                {prop: 'jcBatchCode',label: '检测产品批次', width: '200' },
                                {prop: 'jcEnterpriseName',label: '检测企业主体', width: '200' },
                            ],
                        placeholder:'编号/检测类型/检测项目/检测产品批次/检测企业主体',
                        likeParams: '',
                        type: 7,
                        data: []
                    },
                },
            }
        },
        computed: {
            toData() {
                return this.$store.state.app.stepData || []
            },
            toDataClone() {
                return this.$store.state.app.stepDataClone || []
            },
            accordionIndex() {
                return this.$store.state.app.accordionIndex || 0
            },
            accordionName() {
                return this.$store.state.app.accordionName || 0
            }
        },
        methods: {
            //  步骤移动
            handleSearch(val) {
                getModuleDataList(this.list[this.activeId].likeParams, val, this.activeId).then( data => {
                    this.totalCount = data.data.pageCount * 20;
                    this.list[this.activeId].data = data.data.moduleDataResponseDto;
                    this.currentPage = val;
                })
            },
            leftMove() {
                let current = parseInt(this.$refs.moveDom.style.marginLeft || 0);
                if( current == 0 ) return;
                this.$refs.moveDom.style.marginLeft = current + 115 + 'px';
            },
            rightMove(isNo, index) { // isNo 代表添加步骤 index 代表 + 号下标
                if(isNo != '1'){
                    if (document.getElementById("last_add").offsetLeft < document.getElementById("last_move").offsetLeft) return;
                }
                let current = parseInt(this.$refs.moveDom.style.marginLeft || 0);
                if( index != -1 && this.toData.moduleInfos.length > 5) this.$refs.moveDom.style.marginLeft = current - 115 + 'px';
            },
            //弹出框步骤按钮点击
            handleStep(val, name) {
                this.$store.commit('ACCORDION_INDEX', val);
                this.$store.commit('ACCORDION_NAME', name);
            },
            handleClose() {
                this.$emit('handleClose');
            },
            stepDialogSure() {
                this.$emit('stepDialogSure');
            },
            stepDialogCancel() {
                this.$emit('stepDialogCancel');
            }
        },
    }
</script>

<style lang="scss" scoped>
    @import '../../../styles/mixin';
    .add-farm {
        width: 540px;
        height: 40px;
        line-height: 40px;
        color: #fff;
        text-align: center;
        background: #409EFF;
        margin: 20px auto;
        border-radius: 6px;
        cursor: pointer;
        &:hover {
            opacity: .8;
        }
    }
    .farm-container {
        overflow: hidden;
        margin: 10px 32px 10px 20px;
        color: #409EFF;
        .line {
            height: 1px;
            min-width: 486px;
            background: #409EFF;
            margin-top: 12px
        }
        .farm-index {
            padding: 0 10px;
        }
        .delete {
            position: absolute;
            right: 32px;
            width: 28px;
            height: 28px;
            line-height: 28px;
            background: #409EFF;
            color: #fff;
            text-align: center;
            cursor: pointer;
            &:hover {
                opacity: .8;
            }
        }
    }
    .file-item {
        display: inline-block;
        .upload-item {
            border: 1px dashed #c0ccda;
            width: 148px;
            height: 148px;
            line-height: 146px;
            border-radius: 6px;
            text-align: center;
            display: inline-block;
            &:hover {
                border-color: #409EFF;
            }
            input {
                display: none!important;
            }
            i {
                font-size: 28px;
                color: #8c939d;
            }
        }
    }
    .form-container{
        margin-top: 20px;
    }
    .img-container {
        display: inline-block;
        img {
            width: 148px;
            height: 148px;
        }
    }
    .outer-link-img {
        width: 100px;
        margin: 10px auto;
    }
    .block{
        display: block;
    }
    .addstep-container {
        overflow: hidden;
    }
    .addstep-li {
        margin: 0 20px;
    }
    .move {
        font-size: 22px;
        cursor: pointer;
        height: 42px;
        line-height: 42px;
        border: 1px solid #ddd;
        border-radius: 6px;
        &:hover {
            color: #409EFF;
            border: 1px solid #409EFF;
        }
    }
    .icon-jt {
        font-size: 55px;
        color:#d8d8d8;
        position: relative;
        top: -8px;
    }
    .top-step {
        overflow: hidden;
        margin-left:1px;
        transition: margin .3s;
        .item-btn {
            position: relative;
        }
    }
    .step-add-middle {
        position: absolute;
        right: 24px;
        z-index:99;
    }
    .step-add {
        margin-top: 8px;
        background:#FFF;
        cursor: pointer;
    }
    .todo {
        font-size: 16px;
        cursor: pointer;
        padding: 0 4px;
    }
    .active {
        background: #409EFF;
        color: #FFF;
        cursor: auto;
    }
    .top-step-contaiber{
        margin: 0 10px;
        width: 788px;
        white-space: nowrap;
        overflow: hidden;
    }
    .step-container {
        .top-step {
            width:20000px;
        }
        .step-item {
            position: relative;
            width: 60px;
            height: 42px;
            line-height: 42px;
            text-align: center;
            border: 1px solid #ddd;
            border-radius: 6px;
            cursor: pointer;
        }
        .delete-add {
            position: absolute;
            top: -12px;
            color: red;
        }
    }
    .middle-container {
        z-index:8;
        position: relative;
        margin-top: 20px;
        border: 1px dashed #ccc;
        border-radius: 6px;
        .current-font {
            color: #19A9E8;
            font-weight: 500;
            font-size: 15px;
            position: absolute;
            top: -13px;
            left: 10px;
            z-index: 9;
            background: #FFF;
        }
        .outer-btn {
            text-align: center;
            margin: 14px;
        }
    }
    .file-container {
        margin-right: 10px;
    }
</style>