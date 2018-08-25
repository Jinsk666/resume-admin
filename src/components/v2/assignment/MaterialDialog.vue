<template>
    <div>
        <!-- 添加产品模态框 -->
        <el-dialog
            title="选择原料信息"
            :visible.sync="materialMapDialog"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :before-close="handleClose"
            width="900px">
            <div class="step-container clearfix" v-if="toData.moduleInfos">
                <!-- 表单内容 -->
                <div class="middle-container">
                    <div class="search">
                        <el-input prefix-icon="el-icon-search"
                            v-model="list.likeParams"
                            clearable
                            :placeholder="list.placeholder"
                            size="small" style="width:200px; margin-right:20px;">
                        </el-input>
                        <el-button type="primary" size="small" @click="handleSearch(1)">搜索</el-button>
                        当前选中项为 {{toDataClone.uniqueCode}}
                    </div>
                    <div
                        class="table-container"
                        >
                        <el-table
                            :data="list.data"
                            highlight-current-row
                            @current-change="handleChange"
                            border
                            style="width: 100%">
                            <el-table-column
                                v-for="(item, index) in list.label"
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
                <el-button @click="MaterialMapDialogCancel" size="small">取 消</el-button>
                <el-button type="primary" @click="MaterialMapDialogSure" size="small">保 存</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import { getModuleDataList } from '@/api/v2'
    import { deepClone, step2Class, isImg } from '@/utils'
    export default {
        props: ['materialMapDialog'],
        data() {
            return {
                list:{
                    label:[ {prop: 'ylUniqueCode',label: '编号', width: '200' },
                            {prop: 'ylName',label: '原料名称', width: '200' },
                            {prop: 'ylSpecifications',label: '规格', width: '200' },
                            {prop: 'selectEnterpriseName',label: '企业名称', width: '200' },
                        ],
                    placeholder:'编号/原料名称/规格/企业名称',
                    likeParams: '',
                    type: 1,
                    totalCount: 0,
                    currentPage: 1,
                    data: []
                }
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
        mounted() {
            if(this.materialMapDialog && this.list.data.length == 0 ) {
                this.handleSearch(1);
            }
        },
        methods: {
            // 搜索数据
            handleSearch(val) {
                if( !val ) val = 1;
                let choose = this.list;
                getModuleDataList(choose.likeParams, val, choose.type).then( data => {
                    choose.totalCount = data.data.pageCount * 20;
                    choose.data = data.data.moduleDataResponseDto;
                    choose.currentPage = val;
                })
            },
            // 点击 tr 改变id
            handleChange(current, old) {
                let uniqueCode = 'ylUniqueCode';
                this.toData.uniqueCode= current[uniqueCode];
            },
            handleClose() {
                this.$emit('handleClose');
            },
            MaterialMapDialogSure() {
                this.$emit('MaterialMapDialogSure');
            },
            MaterialMapDialogCancel() {
                this.$emit('MaterialMapDialogCancel');
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