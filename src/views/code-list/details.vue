<template>
    <div class="code-list">
        <!-- <div class="search-header clearfix">
            <div class="left code-input">
                <el-input
                    placeholder="内部溯源码, 履历数据编码"
                    prefix-icon="el-icon-search"
                    v-model="search.likeParams">
                </el-input>
            </div>
            <div class="left">
                <span class="time">时间范围</span>
                <el-date-picker
                    v-model="search.time"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                </el-date-picker>
            </div>
            <div class="right search-btn">
                  <el-button size="medium" type="primary" @click="handleSearch(1)">搜索</el-button>
            </div>
        </div> -->
        <div class="code-container">
            <div class="container-top">
                <div class="left">溯源码列表</div>
                <div class="right" style="display:none;">
                      <el-button size="medium" type="danger" round>导出表格</el-button>
                </div>
            </div>
            <div class="container-table">
                <el-table
                    :data="tableData"
                    stripe
                    style="width: 100%">
                    <el-table-column
                        align="center"
                        prop="traceabilityNumber"
                        label="内部溯源码"
                        min-width="140">
                    </el-table-column>
                    <el-table-column
                    align="center"
                        prop="insertTime"
                        label="对应时间"
                        :formatter='timeFormatter'
                        min-width="120">
                    </el-table-column>
                    <el-table-column
                    align="center"
                        prop="resumeNumber"
                        label="履历数据编码"
                        min-width="180">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="browseNum"
                        label="被查看次数"
                        min-width="60">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="addressUrl"
                        label="履历地址"
                        min-width="260">
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
                                    <el-dropdown-item command="qrcode">下载二维码</el-dropdown-item>
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
        <canvas id="qrcode"></canvas>
        <a id="downloadLink"></a>
    </div>
</template>

<script>
    import { getCodeDetailsList } from '@/api/index'
    import { getEleTime, formatTime } from '@/utils/index'
    import  qrcode  from 'qrcode'
    export default {
        data() {
            return {
                currentPage: 1, // 当前页数
                totalCount: 1,
                search: { // 搜索条件
                    batchCode: this.$route.query.code,
                    time: [],
                    likeParams: ''
                },
                tableData: [],
                row: {},
            }
        },
        mounted() {
            this.handleSearch(1);
        },
        methods: {
            timeFormatter(row, column) {
                return formatTime(row.insertTime, 'Y-m-d')
            },
            clickDropdown(row) {
                this.row = row;
            },
            handleCommand(code) {
                if( code == 'qrcode'){
                    let base = this.row.addressUrl;
                    let resumeCode = this.row.resumeNumber;
                    let canvas = document.querySelectorAll('#qrcode')[0];
                    qrcode.toCanvas(canvas, base, (error) => {
                        if(error) {
                            console.log(error);
                            this.$message.error('下载失败');
                        }else {
                            this.$message({
                                type: 'success',
                                message: '下载成功',
                                duration: 1000
                            });
                            let url = canvas.toDataURL('image/png');
                            // 构造a标签并模拟点击
                            var downloadLink = document.getElementById('downloadLink');
                            downloadLink.setAttribute('href', url);
                            downloadLink.setAttribute('download', resumeCode);
                            downloadLink.click();
                        }
                    })
                }
            },
            handleSearch(val) {
                let time = [];
                if(this.search.time.length != 0) time = getEleTime(this.search.time);
                getCodeDetailsList(this.search.batchCode, time[0] || '', time[1] || '', this.search.likeParams, val).then( data => {
                    this.totalCount = 20 * data.data.pageCount;
                    this.tableData = data.data.resumeBatchTwoDetailResponseList;
                    this.currentPage = val;
                })
            }
        },
    }
</script>

<style lang="scss" scoped>
    #qrcode, #downloadLink {
        width:1px;
        height:1px;
        display:none;
    }
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