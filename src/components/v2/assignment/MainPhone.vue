<template>
    <div id="phone">
        <div class="phone-top">
            <img src="~@/assets/images/phone-top.png" alt="">
        </div>
        <div v-show="stepData.externalQuoteList && stepData.externalQuoteList[0] && stepData.externalQuoteList[0].externalURL">
            <span class="step-edit iframe-edit" @click.stop="clickBase">
                <i class="el-icon-edit"></i>
            </span>
            <iframe v-if="stepData.externalQuoteList && stepData.externalQuoteList[0]"  :src="stepData.externalQuoteList[0].externalURL" width="100%" height="700px;"></iframe>
        </div>
        <div v-show="!stepData.externalQuoteList || stepData.externalQuoteList.length == 0">
            <div class="logo-img">
                <el-upload
                    class="logo-uploader"
                    action=""
                    :before-upload="beforeUpload"
                    :http-request="uploadFile"
                    :show-file-list="false"
                    >
                    <img v-if="stepData.imgUrlList && stepData.imgUrlList[0]" :src="stepData.imgUrlList[0].url" class="avatar">
                    <i v-else class="avatar-uploader-icon"></i>
                </el-upload>
            </div>
            <div class="code">
                <div class="code-font">溯源码 </div>
            </div>
            <div class="container clearfix">
                <div class="intro">
                    <div class="intro-name ellipsis">
                        {{stepData.resumeTemplateName || '产品名称'}}
                    </div>
                </div>
                <div ref="baseDom" class="intro-content clear"
                    @mouseover="enterBase"
                    @mouseout="leaveBase"
                    :class="{over: isEnterBase}"
                    >
                    <span class="step-edit right" v-show="isEnterBase" @click.stop="clickBase">
                        <i class="el-icon-edit"></i>
                    </span>
                    <div class="bg-connect">
                        <div class="bg-connect-left left"></div>
                        <div class="bg-connect-right right"></div>
                    </div>
                    <!-- 第三方企业认证 -->
                    <el-row :gutter="20" class="icon-info icon-info-top" v-if="stepData.authenticationList && stepData.authenticationList.length > 0">
                        <el-col
                            :span="24 / stepData.authenticationList.length"
                            v-for="(item, index) in stepData.authenticationList"
                            v-if="item.label"
                            :key="index">
                            <div
                            type="text"
                            class="ellipsis"
                            :class="'factory' + index"
                            @click="thirdActive = index">{{item.label}}</div>
                        </el-col>
                    </el-row>
                    <el-row class="icon-info" v-if="stepData.authenticationList && stepData.authenticationList.length > 0">
                        <el-col
                            class="factory-intro"
                            v-show="thirdActive == index && item.value"
                            :span="24"
                            v-for="(item, index) in stepData.authenticationList"
                            :key="index">
                            {{item.value}}
                            <div class="factory-intro-top"
                            :style="stepData.authenticationList.length == 2 ? (index==1 ?'left:60%;':''): (stepData.authenticationList.length == 3 ? (index==1 ?'left:44%;':(index==2 ?'left:80%;':'')): '')"></div>
                        </el-col>
                    </el-row>
                    <!-- 基本信息 -->
                    <el-row :class="item.label == 'IMG' ? '' : 'factory-info'"
                        v-show="stepData.generalInfoList.length > 0 "
                        :span="24"
                        v-for="(item, index) in stepData.generalInfoList"
                        v-if="item.dataType != 9"
                        :key="index">
                        <el-col  :span="8"><div class="left">{{item.label}}</div></el-col>
                        <el-col v-if="item.label.indexOf('企业') == -1"  :span="16"><div class="right t">{{item.value}}</div></el-col>
                        <el-col v-else  :span="16"><div class="right t">{{stepData.enterpriseName}}</div></el-col>
                    </el-row>
                </div>
                <!-- 折叠开始 -->
                <el-collapse accordion @change="handleAccordionChange" v-model="activeName" class="accordion-list">
                    <!-- 原料 -->
                    <div
                        v-if="isMaterial === false"
                        >
                        <el-collapse-item
                            class="acc-li"
                            name="-1">
                            <template slot="title">
                                <i class="acc-font YL"> 原料 </i>
                            </template>
                            <!-- 原料链接 -->
                            <div
                                class="acc-row acc-phone-material">
                                <span
                                    v-for="(item, index) in stepData.resumeTemplateTwoOnes"
                                    :key="index"
                                    class="ellipsis phone-material">
                                    {{item.resumeTemplateName}}
                                </span>
                            </div>
                            <!-- 原料外链 -->
                            <div
                                class="acc-row acc-phone-material"
                                v-if="stepData.productImportList">
                                <span
                                    v-for="(item, index) in stepData.productImportList"
                                    :key="(index + 1000)"
                                    class="ellipsis LL-button">
                                    <a target="_blank" :href="item.value">{{item.label}}</a>
                                </span>
                            </div>
                        </el-collapse-item>
                    </div>
                <!-- 除了原料之外的其他流程 -->
                    <div v-for="(item, index) in stepData.moduleInfos" :key="index" @mouseover="mouseOverIndex = index">
                        <base-step
                            :stepData="{data: item, globalPool: globalPool, index: index, mouseOverIndex: mouseOverIndex, isEnterStep: isEnterStep}"
                            @editStep="editStep"
                            @handleEnterStep="handleEnterStep"
                            @handleLeaveStep="handleLeaveStep"
                        >
                        </base-step>
                    </div>
                </el-collapse>
            </div>
            <transition name="fade" mode="out-in">
                <div id="mask" v-show="isEnterBase || isEnterStep"></div>
            </transition>
        </div>
        <div class="phone-bottom">
            <img src="~@/assets/images/phone-bottom.png" alt="">
        </div>
    </div>
</template>

<script>
    import BaseStep from '@/components/v2/assignment/BaseStep';
    import { isImg } from '@/utils/index'
    import { uploadImg } from '@/utils/upload'

    export default {
        name:'MainPhone',
        props: ['globalPool'],
        components: { BaseStep },
        data() {
            return {
                thirdActive: 0,
                isEnterBase: false,
                isEnterMaterial: false,
                isEnterStep: false,
                activeName: '',
                mouseOverIndex: '', //鼠标移入
                logoUrl: '',
            }
        },
        computed: {
            stepData() {
                return this.$store.state.app.stepData
            },
            stepDataClone() {
                return this.$store.state.app.stepDataClone
            },
            isMaterial() {
                return this.$store.state.app.isMaterial
            },
        },
        mounted() {
            debugger
        },
        methods: {
            // 上传
            beforeUpload(file){
				if( !isImg(file.name) ) {
					this.$message({
						message: '只能上传图片',
						type:'error'
					})
					return false;
				}
            },
            async uploadFile(params) {
				let data = await uploadImg(params.file);
                if( !data ) return;
                this.stepData.imgUrlList = [];
                this.stepData.imgUrlList.push( {'name': data.data.fileUrl, 'url': data.data.fileUrl} )
            },
            // phone 上的编辑按钮
            editStep(index, name) {
                this.$emit('editStep', index, name);
            },
            handleAccordionChange(val) {
                this.activeName = val;
            },
            // 是否进入基本信息
            enterBase() {
                this.isEnterBase = true;
            },
            leaveBase() {
                this.isEnterBase = false;
            },
            clickBase() {
                this.$emit('clickBase');
            },
            // 鼠标是否进入步骤流程
            handleEnterStep() {
                this.isEnterStep = true;
            },
            handleLeaveStep() {
                this.isEnterStep = false;
            },
            //添加原料
            handleCommand(val) {
                this.$emit('handleCommand', val);
            }
        },
    }
</script>

<style lang="scss" scoped>
    @import '../../../styles/mixin';
    #phone {
        position: relative;
        .iframe-edit {
            position: absolute;
            top: 19px;
            left: 172px;
        }
    }
    .phone-top, .phone-bottom {
        width: 375px;
        img {
            width: 100%;
        }
    }
    .acc-li {
        .YL {
            @include bis('~@/assets/images/material.png');
        }
    }
    .over {
        position: relative;
        z-index: 99;
    }
    .step-edit2 {
        margin-right: 10px;
		height: 30px;
		width: 30px;
		margin-top: 10px;
		background: $color;
		border-radius: 4px;
		i {
			color: #fff;
			position: relative;
			bottom: 8px;
			left: 6px;
		}
    }
    .step-edit {
        margin-right: 10px;
        height: 30px;
        width: 30px;
        margin-top: -10px;
        background: $color;
        border-radius: 4px;
        text-align: center;
        position: absolute;
        right: 20px;
        z-index: 9;
        cursor: pointer;
        i {
            color: #fff;
            position: relative;
            top: 6px;
        }
    }
    .acc-phone-material {
        overflow: hidden;
    }
    .phone-material {
        border: 1px solid #E2E2E2;
        padding: 4px 14px;
        margin: 6px;
        float: left;
        min-width: 80px;
        text-align: center;
        i {
            cursor: pointer;
        }
    }
    .add-step {
        width: 346px;
        height: 46px;
        line-height: 46px;
        margin: 10px auto;
        text-align: center;
        cursor: pointer;
    }
    #mask {
        position: absolute;
        background: rgba(0, 0, 0, .5);
        width:375px;
        height:100%;
        margin: 20px auto;
        top: 0;
        z-index:2;
    }
    .more-border {
        border: 1px solid $color!important;
    }
    .container {
        padding: 20px 0;
        background: $color;
    }
    #phone {
        width: 375px;
        margin-top: 20px;
        margin: 20px auto;
    }
    .code {
        @include wh(100%, 69px);
        position: relative;
        @include bis('~@/assets/images/bg-code.png');
        .code-font{
            @include center();
            @include wh(100%, 69px);
            line-height: 69px;
            font-size: 17px;
            text-align: center;
        }
    }
    .intro {
        margin: 0 auto;
        @include wh(346px, 70px);
        @include bR(9px);
        @include bis('~@/assets/images/bg-name.png');
        background-color: #fff;
        background-size: 80%;
        background-position: center center;
        position: relative;
        .intro-name {
            font-size: 24px;
            @include center();
            color: $color;
            font-weight: bold;
            width: 200px;
            text-align: center;
        }
    }
    .intro-content {
        margin: 20px auto;
        width: 346px;
        background-color: #fff;
        padding: 20px;
        @include bR(9px);
        position: relative;
    }
    .bg-connect {
        div{
            position: absolute;
            top: -28px;
            @include wh(6px, 40px);
            @include bis('~@/assets/images/connect.png');
            background-size: 6px 40px;
        }
        .bg-connect-left{
            left: 20px;
        }
        .bg-connect-right{
            right: 20px;
        }
    }
    .accordion-list {
		font-size: 18px;
		width: 346px;
		margin: 0 auto;
    }
    .factory-info {
        font-size: 16px;
        padding:20px 0;
        line-height: 20px;
        border-bottom: 1px dashed $color2;
    }
    .logo-uploader {
        background: url('~@/assets/images/add-logo.png') center center no-repeat;
        background-size: 346px 200px;
    }
    .avatar-uploader-icon {
        display: inline-block;
        font-size: 38px;
        color: #8c939d;
        width: 375px;
        height: 220px;
        line-height: 178px;
        text-align: center;
    }
    .avatar {
        width: 375px;
        height: 220px;
        display: block;
    }
    .LL-button {
        display: inline-block;
        cursor: pointer;
        height: 30px;
        line-height: 30px;
        font-size: 14px;
        padding: 0 10px 0 22px !important;
        margin: 6px 20px 20px 6px!important;
        border:1px solid rgba(86, 190, 158, .54);
        background-color: rgba(88, 191, 159,.05);
        @include bis('~@/assets/images/tag.png');
        @include bR(4px);
        background-size: 14px 14px;
        background-position: 6px center;
        color:$color;
    }
    .LL-href {
        width: 100%;
        height: 30px;
        display: inline-block;
        color:$color;
    }
    .icon-info {
        font-size: 14px;
        .factory0 {
            @include bis('~@/assets/images/factory-1.png');
        }
        .factory1 {
            @include bis('~@/assets/images/factory-2.png');
        }
        .factory2 {
            @include bis('~@/assets/images/factory-3.png');
        }
        .ellipsis  {
            margin: 10px 0;
            padding-left: 20px;
            background-size: 16px 18px;
            height: 20px;
            line-height: 19px;
            font-size: 14px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            width:100%;
            display: inline-block;
            text-align: left;
        }
        .factory-intro {
            width: 100%;
            background-color: #ededed;
            color:#666;
            text-align: left;
            @include bR(4px);
            padding: 5px 10px;
            position: relative;
            .factory-intro-top {
                position: absolute;
                width:15px;
                height:7px;
                top: -7px;
                left: 8%;
                @include bis('~@/assets/images/cart.png');
            }
            .factory-intro-top2{
                left: 20px;
            }
        }
    }
</style>