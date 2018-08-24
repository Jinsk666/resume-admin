<template>
    <div class="code-list">
        <div class="search-header clearfix">
            <div class="left code-input">
                <el-input
                    placeholder="编号/名称/批次号/所属企业"
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
                <div class="left">原料信息列表列表</div>
                <div class="right">
                    <router-link :to="{name: 'collectionAddMaterial'}">
                        <el-button size="small" type="danger" round>添加原料</el-button>
                    </router-link>
                </div>
            </div>
            <div class="container-table">
                <el-table
                    :data="moduleDataResponseDto"
                    stripe
                    style="width: 100%">
                    <el-table-column
                        align="center"
                        prop="ylUniqueCode"
                        label="编号"
                        min-width="200">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="ylName"
                        label="名称"
                        min-width="120">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="ylBatchNumber"
                        label="批次号"
                        min-width="200">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="selectEnterpriseName"
                        label="所属企业"
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
                                        <el-dropdown-item command="publish">发布</el-dropdown-item>
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
    import { getModuleDataList, deleteModuleData, publishModuleData } from '@/api/v2'
    import { formatTime } from '@/utils'
    export default {
        components: {  },
        data() {
            return {
                currentPage: 1,
                innerDialog: false, // 内部履历弹出框
                search: { // 搜索条件
                    resumeCode: '',
                },
                totalCount: 20,
                moduleDataResponseDto: [],
                rows: {},
                innerCode: {
                    time: '',
                    count: '',
                }
            }
        },
        mounted() {
            this.handleSearch(1);
        },
        methods: {
            // 搜索按钮
            handleSearch(val) {
                getModuleDataList(this.search.resumeCode, val, 1).then(((data) => {
                    this.totalCount = data.data.pageCount * 20;
                    this.moduleDataResponseDto = data.data.moduleDataResponseDto;
                    this.currentPage = val;
                }))
            },
            // 下拉点击
            clickDropdown(row) {
                this.rows = row;
                console.log(row)
            },
            handleCommand(val) {
                console.log(val)
                if( val == 'view' ) {
                    this.$router.push({name: 'collectionViewMaterial',query:{ id: this.rows.row.ylUniqueCode } })
                } else if( val == 'edit' ) {
                    this.$router.push({name: 'collectionAddMaterial', query: { id: this.rows.row.ylUniqueCode  }})
                } else if( val == 'publish' ) {
                    let col = this.rows.row;
                    publishModuleData( col.ylUniqueCode, 1, col.selectEnterpriseName, col.selectEnterpriseCode  ).then( data => {
                        this.$message.success('发布成功');
                    })
                } else {
                    this.$confirm('确定要删除吗', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        //type: 'warning'
                    }).then(() => {
                        deleteModuleData(this.rows.row.ylUniqueCode, 1).then( data => {
                            this.moduleDataResponseDto.splice(this.rows.$index, 1);
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
            },
        }
    }
</script>

<style lang="scss" scoped>
    .code-list {
        padding: 20px;
    }
    .search-header {
        border-radius: 6px;
        background: #FFF;
        padding: 12px;
        margin-bottom: 20px;
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
        border-radius: 6px;
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
            border-top: 1px solid #ddd;
        }
    }
    .pagination {
        text-align: center;
        padding: 20px 0;
    }
</style>