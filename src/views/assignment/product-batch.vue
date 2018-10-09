<template>
    <div class="content">
        <div class="search-header clearfix">
            <div class="left code-input">
                <el-input
                    size="medium"
                    placeholder="模板名称/编号"
                    prefix-icon="el-icon-search"
                    v-model="ready.likeParams">
                </el-input>
            </div>
            <div class="left">
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
            </div>
            <div class="left search-btn">
                  <el-button size="small" type="primary" @click="handleSearchBtn(1)">搜索</el-button>
            </div>
        </div>
        <div class="block">
            <router-link :to="{name: 'assignmentAdd'}">
                <div class="item add-btn">
                    <div class="add">
                        <i class="el-icon-plus"></i>
                    </div>
                    <div class="add-font">新建履历</div>
                </div>
            </router-link>
        </div>
        <div
            v-for="(item, index) in resumeList"
            :key="index"
            class="block">
            <div class="item">
                <div class="item-top">
                    <div class="logo">
                        <img v-if="item.imgUrlList && item.imgUrlList[0]" :src="item.imgUrlList[0].url" alt="">
                        <img v-else src="~@/assets/images/resume/icon7.png" alt="">
                    </div>
                    <div class="overlay">
                        <ul>
                            <li @click="codeDialogShow(item.uniqueCode)">
                                <p class="circle"><img src="~@/assets/images/resume/icon1.png" alt=""></p>
                                <p>赋码</p>
                            </li>
                            <li>
                                <router-link :to="{name: 'assignmentAdd', query: {code: item.uniqueCode}}">
                                    <p class="circle"><img src="~@/assets/images/resume/icon2.png" alt=""></p>
                                    <p>编辑</p>
                                </router-link>
                            </li>
                            <li @click="handlePreview(item.uniqueCode)">
                                <p class="circle"><img src="~@/assets/images/resume/icon3.png" alt=""></p>
                                <p>预览</p>
                            </li>
                            <!-- <li>
                                <router-link :to="{name: 'assignmentAdd', query: {code: item.uniqueCode, add: 1}}">
                                    <p class="circle"><img src="~@/assets/images/resume/icon4.png" alt=""></p>
                                    <p>复制并新建</p>
                                </router-link>
                            </li> -->
                            <li>
                                <router-link :to="{name: 'assignmentMap', query: {code: item.uniqueCode}}">
                                    <p class="circle"><img src="~@/assets/images/resume/icon5.png" alt=""></p>
                                    <p>查看对应</p> <!-- 发布详情 -->
                                </router-link>
                            </li>
                            <li @click="resumeCode = item.uniqueCode; deleteDialog=true; deleteResumeIndex = index;">
                                <p class="circle"><img src="~@/assets/images/resume/icon6.png" alt=""></p>
                                <p>删除</p>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="item-bottom">
                    <div class="name ellipsis name-title" :title="item.resumeTemplateName">{{item.resumeTemplateName}}</div>
                    <div class="name ellipsis name-code" :title="item.uniqueCode">{{item.uniqueCode}}</div>
                    <div class="time">
                        <div class="left">时间: {{item.insertTime | formatTime('Y-m-d')}}</div>
                        <div class="right">访问: {{item.visitNum || 0}} 次</div>
                    </div>
                </div>
            </div>
        </div>
        <map-code-dialog :codeDialog="codeDialog"
                         from="resume"
                         :resumeCode="resumeCode"
                        @codeDialogSure="codeDialogSure"
                        @codeDialogCancel="codeDialogCancel"
                        @handleClose="handleClose">
        </map-code-dialog>
        <el-dialog
            center
            title="删除履历"
            :visible.sync="deleteDialog"
            :close-on-click-modal="false"
            width="400px">

            <div class="deleteDialog-container">
                确定要删除吗
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="deleteDialog = false" size="small">取 消</el-button>
                <el-button type="primary" @click="deleteDialogSure" size="small">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import { getResumeList, deleteResume } from '@/api'
    import mapCodeDialog from '@/components/v2/assignment/MapCodeDialog'
    import { formatTime, throttle, deepClone } from '@/utils'
    export default {
        components: { mapCodeDialog },
        data() {
            return {
                search: {
                    likeParams: '',
                    time: [],
                },
                ready: {
                    likeParams: '',
                    time: [],
                },
                loading: '',
                resumeList: [],
                codeDialog: false, // 驸马弹出框
                deleteDialog: false, // 删除弹出框
                deleteResumeIndex: '', //删除的顺序
                resumeCode: '',
                isLoaded: true, // 是否加载完成
                currentPage: 2
            }
        },
        filters: {
            formatTime
        },
        created() {
            // 绑定 滚动事件
            // 为了 解除绑定 再套一层函数
            this.throttleLoad =  throttle( () => {
                this.loadMore();
            }, 200, 400);
            window.addEventListener('scroll', this.throttleLoad)
        },
        destroyed () {
			// 移除 window 事件
            window.removeEventListener('scroll', this.throttleLoad)
            this.throttleLoad = null;
		},
        mounted() {
            getResumeList('', 1).then(data => {
                this.resumeList = data.data.resumeDataTwoOneResponseList;
                this.isLoaded = true; // 可以继续加载
            })
        },
        methods: {
            handleSearch(val){
                if( this.search.time == null ) this.search.time = [];
                let beginTime = this.search.time[0] || '';
                let endTime = this.search.time[1] || '';
                getResumeList(this.search.likeParams, val, beginTime, endTime).then(data => {
                    this.currentPage = 2;
                    this.resumeList = data.data.resumeDataTwoOneResponseList;
                    this.isLoaded = true; // 可以继续加载
                })
            },
            handleSearchBtn() {
                let clone = deepClone(this.ready);
                this.search = clone;
                this.handleSearch(1);
            },
            handlePreview(code){
                //测试地址
                //let url = 'http://cs.nongchangyun.cn/resume-portal-beta/#/defaults?resumeCode=' + code;
                //正式地址
                //let url = 'http://erp.farmeasy.cn/resume-portal-beta/#/defaults?resumeCode=' + code;
                let url = process.env.PORTAL_API + "/#/defaults?resumeCode=" + code;
                window.open(url);
            },
            deleteDialogSure() {
                this.deleteDialog = false;
                deleteResume(this.resumeCode).then(data => {
                    this.$message.success('删除成功');
                    this.resumeList.splice( this.deleteResumeIndex, 1);
                }).catch( err => {
                    console.log(err)
                })
            },
            codeDialogShow(val) {
                this.resumeCode = val;
                this.codeDialog = true;
            },
            codeDialogSure(val) {
                this.codeDialog = false;
            },
            codeDialogCancel() {
                this.codeDialog = false;
            },
            handleClose() {
                this.codeDialog = false;
            },
            // 加载更多函数
            loadMore() {
                var scrollTop = document.documentElement.scrollTop||document.body.scrollTop;
                //可视区的高度
                var windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
                //滚动条的总高度
                var scrollHeight = document.documentElement.scrollHeight||document.body.scrollHeight;
                //滚动条到底部的条件
                if(this.isLoaded && scrollTop + windowHeight == scrollHeight){
                    this.loading = this.$loading({text:'加载中...'});
                    this.isLoaded = false;
                    //写后台加载数据的函数
                    if( this.search.time == null ) this.search.time = [];
                    let beginTime = this.search.time[0] || '';
                    let endTime = this.search.time[1] || '';
                    getResumeList(this.search.likeParams, this.currentPage, beginTime, endTime).then(data => {
                        this.loading.close();
                        if( data.code != '0000') return;
                        if( data.data.resumeDataTwoOneResponseList.length == 0 ){
                            this.$message('没有更多数据了。');
                            return;
                        }
                        this.resumeList = this.resumeList.concat( data.data.resumeDataTwoOneResponseList );
                        this.currentPage++; // 页数 + 1
                        this.isLoaded = true; // 可以继续加载
                    }).catch( e => {
                        this.loading.close();
                        this.isLoaded = true; // 可以继续加载
                    })
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import '../../styles/mixin';
    .search-header {
        padding: 15px;
    }
    .search-btn {
        margin-left: 10px;
        margin-top: 2px;
    }
    .deleteDialog-container {
        text-align: center;
    }
    .content {
        width: 100%;
        padding: 10px 20px;
        //background: #FFF;
        overflow: hidden;
    }
    .code-input {
        width: 230px;
        margin-right: 10px;
    }
    .block {
        float: left;
        width: 230px;
        height: 315px;
        margin: 10px;
        .add-btn {
            cursor: pointer;
            .add {
                position: absolute;
                left:50%;
                top: 60px;
                transform: translateX(-50%);
                font-size:100px;
                color: #ddd;
            }
            .add-font {
                text-align: center;
                position: absolute;
                left: 50%;
                bottom: 30%;
                transform: translateX(-50%);
            }
        }
        .item {
            border: 1px solid #e7e7e7;
            border-radius: 6px;
            background: #FCFCFC;
            position: relative;
            height: 100%;
        }
    }
    .item-top {
        height: 224px;
        overflow: hidden;
        .logo {
            width: 230px;
            img {
                width: 100%;
            }
        }
        .overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 224px;
            border-top-left-radius: 6px;
            border-top-right-radius: 6px;
            background: rgba(0, 0, 0, .6);
            display: none;
            p {
                margin: 0;
                font-size: 14px;
            }
            ul {
                overflow: hidden;
                padding: 0;
                margin-top: 10px;
            }
            li {
                float: left;
                width: 33%;
                text-align: center;
                position: relative;
                color: #FFF;
                margin: 10px 0;
                cursor: pointer;
                p {
                    font-size: 12px;
                }
            }
            .circle {
                display: inline-block;
                width: 40px;
                height: 40px;
                background: #fff;
                border-radius: 50%;
                margin: 10px 0;
                background: rgba(255, 255, 255, .25);
                &:hover {
                    background: $color;
                }
            }
        }
    }
    .item-top:hover .overlay {
        display: block;
    }
    .item-bottom {
        font-size: 12px;
        overflow: hidden;
        position: relative;
        .name {
            color: #8FA1AC;
            font-weight: 500;
            text-align: center;
            padding: 5px 10px;
        }
        .name-title {
            font-size: 16px;
            font-weight: 500;
        }
        .name-code {
            font-size: 14px;
        }
        .time {
            overflow: hidden;
            padding: 8px 20px;
        }
    }


</style>