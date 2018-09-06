<template>
    <div>
        <!-- 添加产品模态框 -->
        <el-dialog
            title="选择原料信息"
            :visible.sync="materialMapDialog"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :before-close="handleClose"
            width="960px">
            <div class="step-container clearfix" v-if="toData.moduleInfos">
                <!-- 表单内容 -->
                <div class="middle-container">
                    <div class="search">
                        <el-input prefix-icon="el-icon-search"
                            v-model="ready.likeParams"
                            clearable
                            :placeholder="list.placeholder"
                            size="medium" style="width:300px; margin-right:10px;">
                        </el-input>
                        <el-date-picker
                            size="medium"
                            v-model="ready.time"
                            type="daterange"
                            :default-time="['00:00:00', '23:59:00']"
                            value-format="timestamp"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                        </el-date-picker>
                        <el-button class="search-btn" type="primary" size="small" @click="handleSearchBtn(1)">搜索</el-button>
                    </div>
                    <div class="current-code">
                        当前选中项为 {{toDataClone.uniqueCode}}
                    </div>
                    <div
                        class="content"
                        >
                        <el-table
                            ref="currentTable"
                            :height='tableHeight'
                            :data="list.data"
                            highlight-current-row
                            @current-change="handleChange"
                            @row-click="handleRowClick"
                            border
                            style="width: 100%">
                            <el-table-column
                                v-for="(item, index) in list.label"
                                :key="index"
                                :prop="item.prop"
                                :label="item.label"
                                align="center"
                                :formatter="formatter"
                                :min-width="item.width">
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="MaterialMapDialogSure" size="small">保 存</el-button>
                <el-button @click="MaterialMapDialogCancel" size="small">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import { getModuleDataList } from '@/api/v2'
    import { deepClone, step2Class, isImg, formatTime, scrollMore, throttle } from '@/utils'
    export default {
        props: ['materialMapDialog'],
        data() {
            return {
                list:{
                    label:[ {prop: 'ylUniqueCode',label: '编号', width: '180' },
                            {prop: 'insertTime',label: '创建时间', width: '180' },
                            {prop: 'ylName',label: '原料名称', width: '180' },
                            {prop: 'ylSpecifications',label: '规格', width: '180' },
                            {prop: 'selectEnterpriseName',label: '企业名称', width: '180' },
                        ],
                    placeholder:'编号/原料名称/规格/企业名称',
                    likeParams: '',
                    time: [],
                    type: 1,
                    currentPage: 2,
                    data: [],
                    currentRow: null,
                },
                ready: {
                    likeParams: '',
                    time: []
                },
                tableHeight: 0,
                scrollDom: '',
                isLoaded: true,  // 是否加载完成
                isBind: true, // 保证滚动元素只绑定一次
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
        beforeMount() {
            // 绑定 滚动事件
                // 为了 解除绑定 再套一层函数
            this.throttleLoad =  throttle( () => {
                this.loadMore();
            }, 200, 400);
        },
        beforeDestroy () {
            // 移除 window 事件
            this.scrollDom.removeEventListener('scroll', this.throttleLoad)
            this.throttleLoad = null;
		},
        mounted() {
            if(this.materialMapDialog && this.list.data.length == 0 ) {
                this.handleSearch(1);
            }
        },
        methods: {
            // 搜索数据
            handleSearch(page) {
                this.isLoaded = false;
                if( !page ) page = this.list.currentPage;
                let choose = this.list;
                if( choose.time == null ) choose.time = [];
                let beginTime = choose.time[0] || '';
                let endTime = choose.time[1] || '';
                getModuleDataList(choose.likeParams, page, choose.type, beginTime, endTime).then( data => {
                    this.isLoaded = true;
                    choose.data = data.data.moduleDataResponseDto || [];
                    this.scrollDom = document.querySelectorAll('.content .el-table__body-wrapper')[0];
                    this.$nextTick( () => {
                        this.tableHeight = choose.data.length > 3 ? 300 : 'auto';
                        if( this.tableHeight == 'auto' ) {
                            this.scrollDom.style.height = 'auto';
                        }
                        this.isBind && this.scrollDom.addEventListener('scroll', this.throttleLoad);
                        this.isBind = false;
                    })
                })
            },
            handleSearchBtn(page) {
                let clone = deepClone(this.ready);
                this.list.likeParams = clone.likeParams;
                this.list.time = clone.time;
                this.handleSearch(page);
            },
            // 点击 tr 改变id
            handleChange(current, old) {
                let uniqueCode = 'ylUniqueCode';
                this.toData.uniqueCode= current ? current[uniqueCode] : '';
                if( current ){
                    this.toData.uniqueCode = current[uniqueCode];
                }else {
                    this.toData.uniqueCode = '';
                    this.list.currentRow = null;
                }
            },
            handleRowClick(row, event, column) {
                if( this.list.currentRow && this.list.currentRow.ylUniqueCode == row.ylUniqueCode ) {
                    this.$refs.currentTable.setCurrentRow();
                }else {
                    this.list.currentRow = row;
                }
            },
            handleClose() {
                this.$emit('handleClose');
            },
            MaterialMapDialogSure() {
                this.$emit('MaterialMapDialogSure');
            },
            MaterialMapDialogCancel() {
                this.$emit('MaterialMapDialogCancel');
            },
            formatter(row, column, cellValue, index) {
                if( column.label == '创建时间' && row.insertTime ){
                    return formatTime(cellValue, 'Y-m-d')
                }
                return cellValue;
            },
            loadMore(){
                scrollMore('.content .el-table__body-wrapper', () => {
                    if( !this.isLoaded ) return;
                    this.isLoaded = false;
                    let choose = this.list;
                    if( choose.time == null ) choose.time = [];
                    let beginTime = choose.time[0] || '';
                    let endTime = choose.time[1] || '';
                    getModuleDataList(choose.likeParams, choose.currentPage, choose.type, beginTime, endTime).then(data => {
                        this.isLoaded = true;
                        if( data.data && data.data.moduleDataResponseDto.length == 0 ) {
                            this.$message('没有更多数据了');
                            return;
                        }
                        choose.data = choose.data.concat( data.data.moduleDataResponseDto );
                        choose.currentPage++;
                    })
                })
            }
        },
    }
</script>

<style lang="scss" scoped>
    @import '../../../styles/mixin';
    .search-btn {
        margin-left: 10px;
    }
    .search, .current-code {
        padding: 0 0 20px 10px
    }
    .content {
        padding: 0 10px 10px 10px;
        overflow: auto;
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