<template>
    <div class="code-list">
        <el-tabs v-model="activeName2" type="card" @tab-click="handleClick">
            <el-tab-pane label="对应码列表" name="one">
                <div class="search-header clearfix">
                    <div class="left code-input">
                        <el-input
                            placeholder="对应溯源码"
                            size="small"
                            prefix-icon="el-icon-search"
                            v-model="search.resumeCode">
                        </el-input>
                    </div>
                    <div class="left search-btn">
                        <el-button size="small" type="primary" @click="handleSearch(1)">搜索</el-button>
                    </div>
                </div>
                <div class="code-container">
                    <!-- <div class="container-top">
                        <div class="left">对应码列表</div>
                    </div> -->
                    <div class="container-table">
                        <el-table
                            :data="tableData"
                            stripe
                            style="width: 100%">
                            <el-table-column
                                align="center"
                                prop="insideCode"
                                label="对应溯源码"
                                min-width="200">
                            </el-table-column>
                            <el-table-column
                                align="center"
                                prop="browseNum"
                                label="被访问次数"
                                min-width="200">
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
            </el-tab-pane>
            <el-tab-pane label="评论详情" name="two">
                <div class="search-header clearfix">
                    <div class="left code-input">
                        <el-input
                            placeholder="请输入评论内容搜索"
                            size="small"
                            prefix-icon="el-icon-search"
                            v-model="comments.search.resumeCode">
                        </el-input>
                    </div>
                    <div class="left selected-input">
                        <el-select multiple size="small" v-model="comments.star" placeholder="请选择">
                            <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="left search-btn">
                        <el-button size="small" type="primary" @click="handleCommentSearch(1)">搜索</el-button>
                    </div>
                    <div class="right">
                        <el-button size="small" type="danger" round @click.native="handleDeleteArr">批量删除</el-button>
                    </div>
                </div>
                <div class="code-container">
                    <!-- <div class="container-top">
                        <div class="left">对应码列表</div>
                    </div> -->
                    <div class="container-table">
                        <el-table
                            :data="comments.tableData"
                            stripe
                            style="width: 100%"
                            @selection-change="handleSelectionChange">
                            <el-table-column
                                type="selection"
                                width="55">
                            </el-table-column>
                            <el-table-column
                                align="center"
                                prop="batchCode"
                                label="对应溯源码"
                                min-width="200">
                            </el-table-column>
                            <el-table-column
                                align="center"
                                prop="commentStars"
                                label="评分"
                                :formatter="rateFormatter"
                                min-width="200">
                            </el-table-column>
                            <el-table-column
                                align="center"
                                prop="commentContent"
                                label="评论内容"
                                min-width="200">
                            </el-table-column>
                            <el-table-column
                                align="center"
                                prop="insertTime"
                                label="评论日期"
                                :formatter="dateFormatter"
                                min-width="200">
                            </el-table-column>
                            <el-table-column
                                align="center"
                                label="操作"
                                width="100">
                                <template slot-scope="scope">
                                    <el-dropdown trigger="click" @command="handleCommand">
                                        <span class="el-dropdown-link pointer-fater" @click="clickDropdown(scope.row)">
                                            <svg-icon icon-class="point"></svg-icon>
                                        </span>
                                        <el-dropdown-menu slot="dropdown">
                                            <el-dropdown-item command="delete">删除</el-dropdown-item>
                                        </el-dropdown-menu>
                                        </el-dropdown>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="pagination">
                            <el-pagination
                                @current-change="handleCommentSearch"
                                :current-page="comments.currentPage"
                                background
                                layout="prev, pager, next"
                                :page-size="20"
                                :total="comments.totalCount">
                            </el-pagination>
                        </div>
                    </div>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    import { getMapResumeList, getCommentsList, deleteComment } from '@/api'
    import mapCodeDialog from '@/components/MapCodeDialog'
    import { formatTime } from '@/utils'
    export default {
        components: { mapCodeDialog },
        data() {
            return {
                options:[
                    {value: 1, label: '1星'},
                    {value: 2, label: '2星'},
                    {value: 3, label: '3星'},
                    {value: 4, label: '4星'},
                    {value: 5, label: '5星'},
                ],
                activeName2: 'one',
                currentPage: 1,
                search: { // 搜索条件
                    resumeCode: '',
                },
                totalCount: 20,
                tableData: [],
                comments: {
                    selectArr:[],
                    currentPage: 1,
                    search: { // 搜索条件
                        resumeCode: '',
                    },
                    star: [],
                    totalCount: 20,
                    tableData: [],
                    row:{},
                }
            }
        },
        mounted() {
            this.handleSearch(1);
            this.handleCommentSearch(1);
        },
        methods: {
            // 搜索按钮
            handleSearch(val) {
                getMapResumeList(this.search.resumeCode, val, this.$route.query.code || '').then(((data) => {
                    this.totalCount = data.data.pageCount * 20;
                    this.tableData = data.data.batchCorrespondTwoOneList || [];
                    this.currentPage = val;
                }))
            },
            handleCommentSearch(val) {
                getCommentsList(this.comments.search.resumeCode, val, this.$route.query.code || '', this.comments.star.join(',')).then(data => {
                    this.comments.totalCount = data.data.pageCount * 20;
                    this.comments.tableData = data.data.resumeCommentTwoOneResponseList || [];
                    this.comments.currentPage = val;
                })
            },
            handleClick() {

            },
            delete(code) {
                deleteComment(code).then(data => {
                    this.$message.success('删除成功');
                    this.handleCommentSearch(this.comments.currentPage);
                })
            },
            handleCommand(code){
                if( code == 'delete' ) {
                    this.delete(this.comments.row.batchCode);
                }
            },
            handleDeleteArr() {
                if( this.comments.selectArr.length > 0 ) {
                    let arr = [];
                    this.comments.selectArr.forEach( val => {
                        arr.push( val.batchCode );
                    })
                    this.delete(arr.join(','));
                }else {
                    this.$message('请选择要删除的评论');
                }
            },
            clickDropdown(row) {
                this.comments.row = row;
            },
            handleSelectionChange(val){
                this.comments.selectArr = val;
            },
            rateFormatter(row, column, cellValue, index) {
                return cellValue + '星';
            },
            dateFormatter(row, column, cellValue, index) {
                return formatTime(cellValue, 'Y-m-d')
            },
        },
    }
</script>

<style lang="scss" scoped>
    .code-list {
        padding: 15px;
        margin: 15px;
        background: #fff;
    }
    .search-header {
        background: #FFF;
        padding: 12px;
        margin-bottom: 15px;
    }
    .code-input {
        width: 260px;
    }
    .selected-input {
        margin-left: 18px;
    }
    .search-btn {
        padding-left: 20px;
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