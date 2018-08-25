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
                    <div class="search">
                        <el-input prefix-icon="el-icon-search"
                            v-model="list[toData.moduleInfos[accordionIndex].moduleName].likeParams"
                            clearable
                            :placeholder="list[toData.moduleInfos[accordionIndex].moduleName].placeholder"
                            size="small" style="width:200px; margin-right:20px;">
                        </el-input>
                        <el-button type="primary" size="small" @click="handleSearch(1)">搜索</el-button>

                        当前选中数据 编号为 {{toDataClone.moduleInfos[accordionIndex].moduleDataCode}}
                    </div>
                    <div
                        class="table-container"
                        v-show="item.moduleName == accordionName"
                        v-for="(item, index) in toData.moduleInfos"
                        :key="index">
                        <el-table
                            :data="list[item.moduleName].data"
                            highlight-current-row
                            @current-change="handleChange"
                            border
                            style="width: 100%">
                            <el-table-column
                                v-for="(item, index) in list[item.moduleName].label"
                                :key="index"
                                :prop="item.prop"
                                :label="item.label"
                                align="center"
                                :min-width="item.width">
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
    import { getModuleDataList } from '@/api/v2'
    import { deepClone, step2Class, isImg } from '@/utils'
    export default {
        props: ['stepDialog'],
        data() {
            return {
                list:{ // 这里必须给 中文名字 或者 英文缩写  因为 要包括所有流程
                    '种植':{ // zz
                        label:[ {prop: 'zzUniqueCode',label: '编号', width: '200' },
                                {prop: 'zzBatchNumber',label: '种植批次号', width: '200' },
                                {prop: 'zzMedicineName',label: '药材名称', width: '200' },
                                {prop: 'selectEnterpriseName',label: '企业名称', width: '200' },
                            ],
                        placeholder:'编号/种植批次号/药材名称/企业名称',
                        likeParams: '',
                        type: 2,
                        totalCount: 0,
                        currentPage: 1,
                        data: []
                    },
                    '采收':{ //cs
                        label:[ {prop: 'csUniqueCode',label: '编号', width: '200' },
                                {prop: 'csBatchNumber',label: '采收批次号', width: '200' },
                                {prop: 'csPosition',label: '采收部位', width: '200' },
                                {prop: 'selectEnterpriseName',label: '采收企业主体', width: '200' },
                            ],
                        placeholder:'编号/采收批次号/采收部位/采收企业主体',
                        likeParams: '',
                        type: 3,
                        totalCount: 0,
                        currentPage: 1,
                        data: []
                    },
                    '仓储':{ // cc
                        label:[ {prop: 'ccUniqueCode',label: '编号', width: '200' },
                                {prop: 'ccBatchCode',label: '入库批次号', width: '200' },
                                {prop: 'ccClassification',label: '仓储分类', width: '200' },
                                {prop: 'selectEnterpriseName',label: '仓储企业主体', width: '200' },
                            ],
                        placeholder:'编号/入库批次号/仓储分类/仓储企业主体',
                        likeParams: '',
                        type: 6,
                        totalCount: 0,
                        currentPage: 1,
                        data: []
                    },
                    '加工':{ // jg
                        label:[ {prop: 'jgUniqueCode',label: '编号', width: '200' },
                                {prop: 'jgProductName',label: '加工产品名', width: '200' },
                                {prop: 'jgBatchNumber',label: '加工批次号', width: '200' },
                                {prop: 'selectEnterpriseName',label: '加工企业主体', width: '200' },
                            ],
                        placeholder:'编号/加工产品名/加工批次号/加工企业主体',
                        likeParams: '',
                        type: 4,
                        totalCount: 0,
                        currentPage: 1,
                        data: []
                    },
                    '包装':{ // 包装
                        label:[ {prop: 'bzUniqueCode',label: '编号', width: '200' },
                                {prop: 'bzType',label: '包装类型', width: '200' },
                                {prop: 'bzBatchCode',label: '包装批次号', width: '200' },
                                {prop: 'selectEnterpriseName',label: '包装企业主体', width: '200' }
                            ],
                        placeholder:'编号/包装类型/包装批次号/包装企业主体',
                        likeParams: '',
                        type: 5,
                        totalCount: 0,
                        currentPage: 1,
                        data: []
                    },
                    '检测':{ // 检测
                        label:[ {prop: 'jcUniqueCode',label: '编号', width: '200' },
                                {prop: 'jcProject',label: '检测项目', width: '200' },
                                {prop: 'jcBatchCode',label: '检测产品批次', width: '200' },
                                {prop: 'selectEnterpriseName',label: '检测企业主体', width: '200' },
                            ],
                        placeholder:'编号/检测项目/检测产品批次/检测企业主体',
                        likeParams: '',
                        type: 7,
                        totalCount: 0,
                        currentPage: 1,
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
        // watch: {
        //     accordionName(newValue, oldValue) {
        //         if(this.stepDialog && this.list[this.accordionName].data.length == 0 ) {
        //             this.handleSearch(1);
        //         }
        //     }
        // },
        mounted() {
            debugger   //为了缓存 高亮 用 watch  代替;
            if(this.stepDialog && this.list[this.accordionName].data.length == 0 ) {
                this.handleSearch(1);
            }
        },
        methods: {
            //弹出框步骤按钮点击
            handleStep(index, name) {
                this.$store.commit('ACCORDION_INDEX', index);
                this.$store.commit('ACCORDION_NAME', name);
                if( this.list[this.accordionName].data.length == 0 ) {
                    this.handleSearch(1);
                }
            },
            // 搜索数据
            handleSearch(val) {
                if( !val ) val = 1;
                let choose = this.list[this.accordionName];
                getModuleDataList(choose.likeParams, val, choose.type).then( data => {
                    choose.totalCount = data.data.pageCount * 20;
                    choose.data = data.data.moduleDataResponseDto;
                    choose.currentPage = val;
                })
            },
            // 点击 tr 改变id
            handleChange(current, old) {
                console.log(current)
                let uniqueCode = step2Class(this.accordionName).toLowerCase() + 'UniqueCode';
                this.toData.moduleInfos[this.accordionIndex].moduleDataCode = current[uniqueCode];
            },
            //  步骤移动
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
    .search {
        padding: 20px 10px
    }
    .table-container {
        padding: 0 10px 10px 10px;
    }
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