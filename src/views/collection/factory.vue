<template>
    <div class="code-list">
        <div class="search-header clearfix">
            <div class="left code-input">
                <el-input
                    placeholder="编号/企业名称/企业位置/企业负责人"
                    size="small"
                    prefix-icon="el-icon-search"
                    v-model="ready.resumeCode">
                </el-input>
            </div>
            <div class="left">
                <el-date-picker
                    size="small"
                    v-model="ready.time"
                    type="daterange"
                    value-format="timestamp"
                    :default-time="['00:00:00', '23:59:00']"
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
            <div class="container-top">
                <div class="left">企业信息列表</div>
                <div class="right">
                    <router-link :to="{name: 'collectionAddFactory'}">
                        <el-button size="small" type="danger" round>添加信息</el-button>
                    </router-link>
                </div>
            </div>
            <div class="container-table">
                <el-table
                    :data="enterpriseInfoTwoOneResponseList"
                    stripe
                    style="width: 100%">
                    <el-table-column
                        align="center"
                        prop="uniqueCode"
                        label="编号"
                        min-width="200">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="insertTime"
                        :formatter="formatter"
                        label="创建时间"
                        min-width="200">
                    </el-table-column>
                    <el-table-column
                    align="center"
                        prop="enterpriseName"
                        label="企业名称"
                        min-width="200">
                    </el-table-column>
                    <el-table-column
                    align="center"
                        prop="enterprisePosition"
                        label="企业地址"
                        min-width="200">
                    </el-table-column>
                    <el-table-column
                    align="center"
                        prop="responsibleUser"
                        label="企业负责人"
                        min-width="200">
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
                                        <el-dropdown-item command="edit">修改</el-dropdown-item>
                                        <el-dropdown-item command="delete">删除</el-dropdown-item>
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
        </div>
    </div>
</template>

<script>
    import { getFactoryList, deleteFactory } from '@/api/v2'
    import { formatTime, deepClone } from '@/utils'
    export default {
        components: {  },
        data() {
            return {
                currentPage: 1,
                ready: { // 搜索条件
                    resumeCode: '',
                    time: [],
                },
                search: { // 搜索条件
                    resumeCode: '',
                    time: [],
                },
                totalCount: 20,
                enterpriseInfoTwoOneResponseList: [],
                rows: [],
            }
        },
        mounted() {
            this.handleSearch(1);
        },
        methods: {
            // 搜索按钮
            handleSearch(val) {
                this.enterpriseInfoTwoOneResponseList = [];
                if( this.search.time == null ) this.search.time = [];
                let beginTime = this.search.time[0] || '';
                let endTime = this.search.time[1] || '';
                getFactoryList(this.search.resumeCode, val, 1, beginTime, endTime).then( data => {
                    this.totalCount = data.data.pageCount * 20;
                    this.enterpriseInfoTwoOneResponseList = data.data.enterpriseInfoTwoOneResponseList;
                    this.currentPage = val;
                })
            },
            handleSearchBtn(val) {
                let clone = deepClone(this.ready);
                this.search = clone;
                this.handleSearch(val);
            },
            clickDropdown(row) {
                this.rows = row;
                console.log(row)
            },
            handleCommand(val) {
                console.log(val)
                if( val == 'view' ) {
                    this.$router.push({name: 'collectionViewFactory', query: { id: this.rows.row.uniqueCode }})
                } else if( val == 'edit' ) {
                    this.$router.push({name: 'collectionAddFactory', query: { id: this.rows.row.uniqueCode }})
                } else if ( val == 'delete' ){
                    this.$confirm('确定要删除吗', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        //type: 'warning'
                    }).then(() => {
                        deleteFactory(this.rows.row.uniqueCode).then( data => {
                            this.enterpriseInfoTwoOneResponseList.splice( this.rows.$index, 1);
                            this.$message.success('删除成功');
                        })
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });
                    });
                }
            },
            // 格式化时间
            formatter(row, column, cellValue, index) {
                return formatTime(cellValue, 'Y-m-d')
            },
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
        width: 320px;
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