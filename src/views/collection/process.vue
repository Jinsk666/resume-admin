<template>
    <div class="code-list">
        <div class="search-header clearfix">
            <div class="left code-input">
                <el-input
                    
                    :placeholder="list[tabId].placeholder"
                    size="small"
                    prefix-icon="el-icon-search"
                    v-model="ready[tabId].likeParams">
                </el-input>
            </div>
            <div class="left">
                <el-date-picker
                    size="small"
                    v-model="ready[tabId].time"
                    type="daterange"
                    :default-time="['00:00:00', '23:59:00']"
                    value-format="timestamp"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                </el-date-picker>
            </div>
            <div class="right search-btn">
                  <el-button size="small" type="primary" @click="handleSearchBtn(1)">搜索</el-button>
            </div>
        </div>
        <div class="code-container">
            <template>
                <el-tabs v-model="tabId" type="card" @tab-click="handleTabClick" v-if="steps">
                    <el-tab-pane v-for="(item, index) in steps" :key="index" :label="item.name" :name="item.id">
                        <div class="container-top">
                            <div class="left">{{item.name}}信息列表</div>
                            <div class="right">
                                <router-link :to="{name: 'collectionAddProcess', query: {tab: item.class, tabId: item.id, tabName: item.name}}">
                                    <el-button size="small" type="danger" round>添加信息</el-button>
                                </router-link>
                            </div>
                        </div>
                        <div class="container-table" :class="item.class">
                            <el-table
                                :data="list[item.id].data"
                                stripe
                                style="width: 100%">
                                <el-table-column
                                    v-for="(item, index) in list[item.id].label"
                                    :key="index"
                                    align="center"
                                    :prop="item.prop"
                                    :label="item.label"
                                    :formatter="formatter"
                                    :min-width="item.width">
                                </el-table-column>
                                <el-table-column
                                    align="center"
                                    label="操作"
                                    width="100">
                                    <template slot-scope="scope">
                                        <el-dropdown trigger="click" @command="handleCommand">
                                            <span class="el-dropdown-link pointer-fater" @click="clickDropdown(scope)">
                                                <svg-icon icon-class="point"></svg-icon>
                                            </span>
                                            <el-dropdown-menu slot="dropdown">
                                                    <el-dropdown-item command="view">查看</el-dropdown-item>
                                                    <el-dropdown-item command="edit" v-if="rows.row && rows.row.state == 0">修改</el-dropdown-item>
                                                    <el-dropdown-item command="publish" v-if="rows.row && rows.row.state == 0">发布</el-dropdown-item>
                                                    <el-dropdown-item command="delete" v-if="rows.row && rows.row.state == 0">删除</el-dropdown-item>
                                            </el-dropdown-menu>
                                        </el-dropdown>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <div class="pagination">
                                <el-pagination
                                    @current-change="handleSearch"
                                    :current-page="currentPage"
                                    background
                                    layout="prev, pager, next"
                                    :page-size="20"
                                    :total="totalCount">
                                </el-pagination>
                            </div>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </template>
        </div>
    </div>
</template>

<script>
    import { publishModuleData, deleteModuleData, getModuleDataList } from '@/api/v2'
    import { formatTime, step2Class, deepClone } from '@/utils'
    export default {
        data() {
            return {
                steps: [ {name:'种植', class: 'zz', id: '2'},{name:'采收', class: 'cs', id: '3'},{name:'仓储', class:'cc', id: '6'},{name:'加工', class:'jg', id: '4'},{name:'包装',class:'bz', id: '5'},{name:'检测',class:'jc', id: '7'} ],
                tab: 'zz', // bz
                tabId: '2', //当前选中流程
                tabName: '种植', // 包装
                currentPage: 1,
                totalCount: 20,
                rows: {},
                ready:{
                    '2':{ // zz
                        likeParams: '',
                        time: [],
                    },
                    '3':{ //cs
                        likeParams: '',
                        time: [],
                    },
                    '6':{ // cc
                        likeParams: '',
                        time: [],
                    },
                    '4':{ // jg
                        likeParams: '',
                        time: [],
                    },
                    '5':{ // 包装
                        likeParams: '',
                        time: [],
                    },
                    '7':{ // 检测
                        likeParams: '',
                        time: [],
                    },
                },
                list:{
                    '2':{ // zz
                        label:[ {prop: 'zzUniqueCode',label: '编号', width: '180' },
                                {prop: 'insertTime',label: '创建时间', width: '180' },
                                {prop: 'zzBatchNumber',label: '种植批次号', width: '180' },
                                {prop: 'zzMedicineName',label: '药材名称', width: '180' },
                                {prop: 'zzGermplasmPrimitives',label: '种质/基原', width: '180' },
                                {prop: 'selectEnterpriseName',label: '企业名称', width: '180' },
                            ],
                        placeholder:'编号/创建时间/种植批次号/药材名称/种质/基原/企业名称',
                        likeParams: '',
                        time: [],
                        data: []
                    },
                    '3':{ //cs
                        label:[ {prop: 'csUniqueCode',label: '编号', width: '180' },
                                {prop: 'insertTime',label: '创建时间', width: '180' },
                                {prop: 'csBatchNumber',label: '采收批次号', width: '180' },
                                {prop: 'csPosition',label: '采收部位', width: '180' },
                                {prop: 'csDate',label: '采收日期', width: '180' },
                                {prop: 'selectEnterpriseName',label: '采收企业主体', width: '180' },
                            ],
                        placeholder:'编号/创建时间/采收批次号/采收部位/采收日期/采收企业主体',
                        likeParams: '',
                        time: [],
                        data: []
                    },
                    '6':{ // cc
                        label:[ {prop: 'ccUniqueCode',label: '编号', width: '180' },
                                {prop: 'insertTime',label: '创建时间', width: '180' },
                                {prop: 'ccBatchCode',label: '入库批次号', width: '180' },
                                {prop: 'ccClassification',label: '仓储分类', width: '180' },
                                {prop: 'ccType',label: '仓库类型', width: '180' },
                                {prop: 'selectEnterpriseName',label: '仓储企业主体', width: '180' },
                            ],
                        placeholder:'编号/创建时间/入库批次号/仓储分类/仓库类型/仓储企业主体',
                        likeParams: '',
                        time: [],
                        data: []
                    },
                    '4':{ // jg
                        label:[ {prop: 'jgUniqueCode',label: '编号', width: '180' },
                                {prop: 'insertTime',label: '创建时间', width: '180' },
                                {prop: 'jgType',label: '加工类型', width: '180' },
                                {prop: 'jgProductName',label: '加工产品名', width: '180' },
                                {prop: 'jgBatchNumber',label: '加工批次号', width: '180' },
                                {prop: 'selectEnterpriseName',label: '加工企业主体', width: '180' },
                            ],
                        placeholder:'编号/创建时间/加工类型/加工产品名/加工批次号/加工企业主体',
                        likeParams: '',
                        time: [],
                        data: []
                    },
                    '5':{ // 包装
                        label:[ {prop: 'bzUniqueCode',label: '编号', width: '180' },
                                {prop: 'insertTime',label: '创建时间', width: '180' },
                                {prop: 'bzType',label: '包装类型', width: '180' },
                                {prop: 'bzPackMethod',label: '包装方式', width: '180' },
                                {prop: 'bzBatchCode',label: '包装批次号', width: '180' },
                                {prop: 'selectEnterpriseName',label: '包装企业主体', width: '180' }
                            ],
                        placeholder:'编号/创建时间/包装类型/包装方式/包装批次号/包装企业主体',
                        likeParams: '',
                        time: [],
                        data: []
                    },
                    '7':{ // 检测
                        label:[ {prop: 'jcUniqueCode',label: '编号', width: '180' },
                                {prop: 'insertTime',label: '创建时间', width: '180' },
                                {prop: 'jcType',label: '检测类型', width: '180' },
                                {prop: 'jcProject',label: '检测项目', width: '180' },
                                {prop: 'jcBatchCode',label: '检测产品批次', width: '180' },
                                {prop: 'selectEnterpriseName',label: '检测企业主体', width: '180' },
                            ],
                        placeholder:'编号/创建时间/检测类型/检测项目/检测产品批次/检测企业主体',
                        likeParams: '',
                        time: [],
                        data: []
                    },
                },
            }
        },
        mounted() {
            this.tab = this.$route.query.tab || 'zz';
            this.tabId = this.$route.query.tabId || '2';
            this.tabName = this.$route.query.tabName || '种植';
            this.handleSearch(1);
        },
        methods: {
            formatter(row, column, cellValue, index) {
                if( column.label == '采收日期' && row.csDate ) {
                    return formatTime(cellValue, 'Y-m-d')
                }
                if( column.label == '创建时间' && row.insertTime ){
                    return formatTime(cellValue, 'Y-m-d')
                }
                return cellValue;
            },
            inputFocus(e){
                console.log(e)
                e.path[0].style.width = '400px';
            },
            inputBlur(e) {
                e.path[0].style.width = '300px';
            },
            // 搜索按钮
            handleSearch(val) {
                this.moduleDataResponseDto = [];
                if( this.list[this.tabId].time == null ) this.list[this.tabId].time = [];
                let beginTime = this.list[this.tabId].time[0] || '';
                let endTime = this.list[this.tabId].time[1] || '';
                getModuleDataList(this.list[this.tabId].likeParams, val, this.tabId, beginTime, endTime).then( data => {
                    this.totalCount = data.data.pageCount * 20;
                    this.list[this.tabId].data = data.data.moduleDataResponseDto;
                    this.currentPage = val;
                })
            },
            handleSearchBtn(val) {
                let clone = deepClone(this.ready[this.tabId]);
                this.list[this.tabId].likeParams = clone.likeParams;
                this.list[this.tabId].time = clone.time;
                this.handleSearch(val);
            },
            // tab 点击
            handleTabClick(tab, event) {
                if( this.list[this.tabId].data.length == 0 ){
                    this.handleSearch(1);
                }
                this.tabName = tab.label;
                this.tab = step2Class(this.tabName).toLowerCase();
            },
            // 三个小点 点击 主要是拿到表格行 数据
            clickDropdown(row) {
                this.rows = row;
                console.log(row)
            },
            // 下拉框点击
            handleCommand(val) {
                if( val == 'view' ) {
                    this.$router.push({name: 'collectionViewProcess', query: {id: this.rows.row[this.tab + 'UniqueCode'], tab: this.tab, tabId: this.tabId, tabName: this.tabName}})
                } else if( val == 'edit' ) {
                    this.$router.push({name: 'collectionAddProcess', query: {id: this.rows.row[this.tab + 'UniqueCode'], tab: this.tab, tabId: this.tabId, tabName: this.tabName}})
                } else if( val == 'publish' ) {
                    let col = this.rows.row;
                    if( !col.selectEnterpriseCode || !col.selectEnterpriseName ) {
                        this.$message.error('该条数据没有企业信息，请填写企业信息');
                        return;
                    }
                    publishModuleData( col[[this.tab + 'UniqueCode']], Number(this.tabId), col.selectEnterpriseCode, col.selectEnterpriseName  ).then( data => {
                        this.$message.success('发布成功');
                    })
                }else if ( val == 'delete' ){
                    this.$confirm('确定要删除吗', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        //type: 'warning'
                    }).then(() => {
                        deleteModuleData(this.rows.row[this.tab + 'UniqueCode'], Number(this.tabId)).then( data => {
                            this.list[this.tabId].data.splice(this.rows.$index, 1);
                            this.$message({
                                type: 'success',
                                message: '删除成功'
                            });
                        })
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });
                    });
                }
            }
        },
    }
</script>

<style lang="scss" scoped>
    .code-list {
        padding: 15px;
    }
    .search-header {
        background: #FFF;
        padding: 12px;
        margin-bottom: 15px;
    }
    .code-input {
        width: 420px;
        margin-right: 10px;
    }
    .search-btn {
        padding-right: 20px;
    }
    .time {
        display: inline-block;
        margin: 0 20px;
    }
    .pointer-fater {
        font-size: 36px;
    }
    .code-container {
        background: #FFF;
        .container-top {
            .left {
                font-weight: 400;
                padding-left:20px;
            }
            .right {
                padding-right: 20px;
            }
            height: 60px;
            line-height: 60px;
        }
        .container-table {
            border-top: 1px solid #ebeef5;
        }
    }
    .pagination {
        text-align: center;
        padding: 20px 0;
    }
</style>