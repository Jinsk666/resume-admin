<template>
    <div class="code-list">
        <div class="search-header clearfix">
            <div class="left code-input">
                <el-input
                    placeholder="编码批次"
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
                <div class="left">编码列表</div>
                <div class="right">
                      <el-button size="small" type="danger" round @click="codeDialog=true">对应履历数据</el-button>
                </div>
                <div class="right">
                      <el-button size="small" type="primary" round @click="handleInnerCode">生成内部履历溯源码</el-button>
                </div>
            </div>
            <div class="container-table">
                <el-table
                    :data="tableData"
                    stripe
                    style="width: 100%">
                    <el-table-column
                        align="center"
                        prop="batchCode"
                        label="编码批次"
                        min-width="200">
                    </el-table-column>
                    <el-table-column
                    align="center"
                        prop="numbers"
                        label="生成溯源码个数"
                        min-width="120">
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
                                    <router-link :to="{name: 'listDetails', query: {code: row.batchCode}}">
                                        <el-dropdown-item command="code">详情</el-dropdown-item>
                                    </router-link>
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
        <!-- 生成内部履历溯源码 -->
        <el-dialog
            title="生成内部履历溯源码"
            :visible.sync="innerDialog"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            width="500px"
        >
            <div class="codeContent">
                <el-form label-position="right" label-width="140px" :model="innerCode">
                <el-form-item label="日期批次：">
                    <el-date-picker
                        size="small"
                        v-model="innerCode.time"
                        type="date"
                        :editable="false"
                        placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="生成溯源码数量：">
                    <el-input size="small" v-model="innerCode.count" style="width:220px;"></el-input>
                </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="innerDialog = false">取 消</el-button>
                <el-button size="small" type="primary" @click="innerDialogSure">确 定</el-button>
            </span>
        </el-dialog>
        <map-code-dialog
            resumeCode=""
            from=""
            :codeDialog="codeDialog"
            @codeDialogSure="codeDialogSure"
            @codeDialogCancel="codeDialogCancel"
            @handleClose="handleClose">
        </map-code-dialog>
    </div>
</template>

<script>
    import { getCodeList, addCode } from '@/api'
    import mapCodeDialog from '@/components/MapCodeDialog'
    import { formatTime } from '@/utils'
    export default {
        components: { mapCodeDialog },
        data() {
            return {
                currentPage: 1,
                codeDialog: false,// 驸马弹出框
                innerDialog: false, // 内部履历弹出框
                search: { // 搜索条件
                    resumeCode: '',
                },
                totalCount: 20,
                tableData: [],
                row: {batchCode:''},
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
                getCodeList(this.search.resumeCode, val).then(((data) => {
                    this.totalCount = data.data.pageCount * 20;
                    this.tableData = data.data.resumeBatchTwoResponseList;
                    this.currentPage = val;
                }))
            },
            clickDropdown(row) {
                this.row = row;
            },
            handleCommand(code) {
            },
            // 内部溯源码 弹出框
            handleInnerCode() {
                this.innerDialog = true;
                this.innerCode = {time: '', count: '',}
            },
            //内部溯源码 确定
            innerDialogSure() {
                this.innerDialog = false;
                let time = formatTime(this.innerCode.time, 'Y-m-d');
                var count = 0;
                try {
                    count = Number(this.innerCode.count);
                }catch(e){

                }
                addCode( time, count).then( (data)=> {
                    if( data.code == '0000' ){
                        this.handleSearch(1);
                        this.$message({
                            type:'success',
                            message: '添加成功'
                        })
                    }
                })
            },
            // 驸马弹出框
            codeDialogSure() {
                this.codeDialog = false;
            },
            codeDialogCancel() {
                this.codeDialog = false;
            },
            handleClose() {
                this.codeDialog = false;
            }
        },
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