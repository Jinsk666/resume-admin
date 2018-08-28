<template>
    <div class="code-list">
        <div class="search-header clearfix">
            <div class="left code-input">
                <el-input
                    placeholder="对应溯源码"
                    size="small"
                    prefix-icon="el-icon-search"
                    v-model="search.resumeCode">
                </el-input>
            </div>
            <div class="right search-btn">
                  <el-button size="small" type="primary" @click="handleSearch(1)">搜索</el-button>
            </div>
        </div>
        <div class="code-container">
            <div class="container-top">
                <div class="left">对应码列表</div>
            </div>
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
    </div>
</template>

<script>
    import { getMapResumeList } from '@/api'
    import mapCodeDialog from '@/components/MapCodeDialog'
    export default {
        components: { mapCodeDialog },
        data() {
            return {
                currentPage: 1,
                search: { // 搜索条件
                    resumeCode: '',
                },
                totalCount: 20,
                tableData: [],
            }
        },
        mounted() {
            this.handleSearch(1);
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
        width: 260px;
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