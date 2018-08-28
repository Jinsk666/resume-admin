<template>
    <div>
        <el-dialog
            title="选择模板"
            :visible.sync="moduleDialog"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :before-close="handleClose"
            width="700px">
            <div class="container">
                <div class="header">
                    <el-input prefix-icon="el-icon-search" v-model="ready.likeParams" clearable placeholder="模版编码/创建日期/模版名称" size="medium" style="width:260px; margin-right:10px;"></el-input>
                    <el-button type="primary" size="small" @click="handleSearchBtn(1)">搜索</el-button>
                </div>
                <div class="content">
                    <el-table
                        v-loading="tableLoading"
                        :height="tableHeight"
                        :data="tableData"
                        highlight-current-row
                        @current-change="handleChange"
                        border
                        style="width: 100%">
                        <el-table-column
                            prop="imgUrl"
                            label="图片"
                            align="center"
                            width="180">
                            <template slot-scope="scope">
                                    <img v-if="scope.row.imgUrl" :src="scope.row.imgUrl" alt="" style="width:50px; height:30px;">
                            </template>
                        </el-table-column>
                        <el-table-column
                            :formatter="formatter"
                            align="center"
                            prop="insertTime"
                            label="创建日期">
                        </el-table-column>
                        <el-table-column
                            prop="uniqueCode"
                            label="模板编码"
                            align="center"
                            width="180">
                        </el-table-column>
                        <el-table-column
                            prop="resumeTemplateName"
                            align="center"
                            label="模板名称">
                        </el-table-column>
                    </el-table>
                </div>
                <div class="paganation"></div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="moduleDialogSure" size="small">确定</el-button>
                <el-button @click="moduleDialogCancel" size="small">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import { getModuleList } from '@/api/v2'
    import { formatTime, scrollMore, throttle, deepClone } from '@/utils'
    export default {
        props: ['moduleDialog'],
        data() {
            return {
               code: '',
               tableData: [],
               currentPage: 2,
               isLoaded: true,  // 是否加载完成
               isBind: true, // 保证滚动元素只绑定一次
               scrollDom: '', // 滚动对象
               tableHeight: 0,
               tableLoading: false,
               search: {
                   likeParams:'',
                   time:'',
               },
               ready: {
                   likeParams:'',
                   time:'',
               },
            }
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
            this.handleSearch(1);
        },
        methods: {
            // 不是分页 下拉加载
            handleSearch(page) {
                this.isLoaded = false;
                if( !page ) page = this.currentPage;
                if( !this.moduleDialog ) return;
                this.tableLoading = true;
                this.tableData = []; // 搜索之前重置数据
                getModuleList(this.search.likeParams, page).then(data => {
                    this.tableLoading = false;
                    this.isLoaded = true;
                    if( data.data && data.data.resumeTemplateTwoOneResponseList.length == 0 ) {
                        this.$message('没有更多数据了');
                        return;
                    }
                    this.tableData = data.data.resumeTemplateTwoOneResponseList || [];
                    // 将图片的列表转为 原来的 imgUrl
                    this.tableData.forEach((val, index, arr) => {
                        if( val.imgUrlList && val.imgUrlList[0] ) val.imgUrl = val.imgUrlList[0].url || '';
                    })
                    this.scrollDom = document.querySelectorAll('.content .el-table__body-wrapper')[0];
                    this.$nextTick( () => {
                        this.tableHeight = this.tableData.length > 3 ? 300 : 'auto';
                        if( this.tableHeight == 'auto' ){
                             this.scrollDom.style.height = 'auto';
                        }
                        this.isBind && this.scrollDom.addEventListener('scroll', this.throttleLoad);
                        this.isBind = false;
                    })
                })
            },
            handleSearchBtn(page){
                let clone = deepClone(this.ready);
                this.search = clone;
                this.handleSearch(page)
            },
            moduleDialogSure() {
                this.$emit('moduleDialogSure', this.code)
            },
            moduleDialogCancel() {
                this.$emit('moduleDialogCancel')
            },
            handleClose() {
                this.$emit('handleClose');
            },
            formatter(row, column, cellValue, index) {
                return formatTime(cellValue, 'Y-m-d')
            },
            handleChange(current, old) {
                console.log(current)
                this.code = current.uniqueCode;
            },
            loadMore(){
                scrollMore('.content .el-table__body-wrapper', () => {
                    if( !this.isLoaded ) return;
                    this.isLoaded = false;
                    getModuleList(this.search.likeParams, this.currentPage).then(data => {
                        this.isLoaded = true;
                        if( data.data && data.data.resumeTemplateTwoOneResponseList.length == 0 ) {
                            this.$message('没有更多数据了');
                            return;
                        }
                        this.tableData = this.tableData.concat( data.data.resumeTemplateTwoOneResponseList );
                        // 将图片的列表转为 原来的 imgUrl
                        this.tableData.forEach((val, index, arr) => {
                            if( val.imgUrlList && val.imgUrlList[0] ) val.imgUrl = val.imgUrlList[0].url || '';
                        })
                        this.currentPage++;
                    })
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .header {
        margin-bottom: 20px;
    }
    .content{
        overflow-y: auto;
    }
</style>