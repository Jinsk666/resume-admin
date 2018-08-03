<template>
    <div class="content">
        <div class="block">
            <router-link :to="{name: 'AddResume'}">
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
                        <img v-if="item.imgUrl" :src="item.imgUrl" alt="">
                        <img v-else src="~@/assets/images/resume/icon7.png" alt="">
                    </div>
                    <div class="overlay">
                        <ul>
                            <li @click="codeDialogShow(item.uniqueCode)">
                                <p class="circle"><img src="~@/assets/images/resume/icon1.png" alt=""></p>
                                <p>赋码</p>
                            </li>
                            <li>
                                <router-link :to="{name: 'AddResume', query: {code: item.uniqueCode}}">
                                    <p class="circle"><img src="~@/assets/images/resume/icon2.png" alt=""></p>
                                    <p>编辑</p>
                                </router-link>
                            </li>
                            <li>
                                <router-link :to="{name: 'resumeList', query: {code: item.uniqueCode}}">
                                    <p class="circle"><img src="~@/assets/images/resume/icon5.png" alt=""></p>
                                    <p>查看对应</p>
                                </router-link>
                            </li>
                            <li @click="resumeCode = item.uniqueCode; deleteDialog=true;">
                                <p class="circle"><img src="~@/assets/images/resume/icon6.png" alt=""></p>
                                <p>删除</p>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="item-bottom">
                    <div class="name">{{item.productName}}</div>
                    <div class="name">履历数据编码: {{item.uniqueCode}}</div>
                    <div class="time">
                        <div class="left">时间: {{item.insertTime | formatTime('Y-m-d')}}</div>
                        <div class="right">访问: 0 次</div>
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
                <el-button type="primary" @click="deleteDialogSure" size="small">保 存</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import { getResumeList, deleteResume } from '@/api'
    import mapCodeDialog from '@/components/MapCodeDialog'
    import { formatTime } from '@/utils'
    export default {
        components: { mapCodeDialog },
        data() {
            return {
                resumeList: [],
                codeDialog: false, // 驸马弹出框
                deleteDialog: false, // 删除弹出框
                deleteResumeIndex: '', //删除的顺序
                resumeCode: '',
            }
        },
        filters: {
            formatTime
        },
        mounted() {
            getResumeList('', 1).then(data => {
                this.resumeList = data.data.productInfoListSubset;
            })
        },
        methods: {
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
            }
        },
    }
</script>

<style lang="scss" scoped>
    @import '../../styles/mixin';
    .deleteDialog-container {
        text-align: center;
    }
    .content {
        width: 100%;
        padding: 20px;
        //background: #FFF;
        overflow: hidden;
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
            border: 1px dashed #C8C8C8;
            border-radius: 6px;
            background: #FCFCFC;
            position: relative;
            height: 100%;
        }
    }
    .item-top {
        height: 236px;
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
            height: 236px;
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
            padding: 5px 0;
        }
        .time {
            overflow: hidden;
            padding: 8px;
        }
    }


</style>