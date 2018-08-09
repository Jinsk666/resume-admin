<template>
    <div id="phone" @click="editProductName = false">
        <div class="phone-top">
            <img src="~@/assets/images/phone-top.png" alt="">
        </div>
        <div class="logo-img">
            <!-- http://admin.ytbuyer.com/ytfarmapi/file/uploadImage -->
            <!-- :headers="{processData: false, contentType: false}" -->
            <el-upload
                class="logo-uploader"
                action=""
                :before-upload="uploadFile"
                :show-file-list="false"
                >
                <img v-if="stepData.imgUrl" :src="stepData.imgUrl" class="avatar">
                <i v-else class="avatar-uploader-icon"></i>
            </el-upload>
        </div>
        <div class="code">
            <div class="code-font">溯源码 </div>
        </div>
        <div class="container clearfix">
            <div class="intro">
                <div class="intro-name ellipsis" v-show="!editProductName" @click.stop="editProductName = !editProductName">
                    {{stepData.productName || '点击填写产品名称'}}
                </div>
                <div class="intro-name" v-show="editProductName" @click.stop="editProductName = true">
                    <el-input autofocus="true" v-model="stepData.productName" placeholder="填写产品名称"></el-input>
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
                <!-- 基本信息 -->
				<el-row :class="item.label == 'IMG' ? '' : 'factory-info'"
					v-show="stepData.generalInfoList.length > 0 "
					:span="24"
					v-for="(item, index) in stepData.generalInfoList"
					:key="index">
                    <el-col v-if="item.label != 'IMG'" :span="8"><div class="left">{{item.label}}</div></el-col>
                    <el-col v-if="item.label != 'IMG'" :span="16"><div class="right t">{{item.value}}</div></el-col>
                </el-row>
            </div>
            <!-- 折叠开始 -->
            <el-collapse accordion @change="handleAccordionChange" v-model="activeName" class="accordion-list">
                <!-- 原料 -->
                <div
                    v-if="isMaterial === false"
                    @mouseover="isEnterMaterial = true"
                    @mouseout="isEnterMaterial = false"
                    :class="{over: isEnterMaterial}">
                     <el-collapse-item
                        class="acc-li"
                        name="-1">
                        <template slot="title">
                            <i class="acc-font YL"> 原料 </i>
                            <!-- <span class="step-edit2 right" @click.stop="editMaterial()" v-show="isEnterMaterial">
                                <i class="el-icon-edit"></i>
                            </span> -->
                            <div class="my right" @click.stop>
                                <el-dropdown trigger="click" class="right step-edit2" @command="handleCommand" v-show="isEnterMaterial">
                                <span class="el-dropdown-link"  >
                                    <i class="el-icon-edit"></i>
                                </span>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item command="inner">创建新原料</el-dropdown-item>
                                    <el-dropdown-item command="outer">引用外部链接</el-dropdown-item>
                                </el-dropdown-menu>
                                </el-dropdown>
                            </div>
                        </template>
                        <!-- 原料链接 -->
                        <div
                            class="acc-row acc-phone-material">
                            <span
                                v-for="(item, index) in stepData.productInfos"
                                :key="index"
                                class="ellipsis phone-material">
                                {{item.productName}}
                            </span>
                            <!-- 加号 -->
                            <!-- <span class="phone-material">
                                <i class="el-icon-plus"></i>
                            </span> -->
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
                        :stepData="{data: item, index: index, mouseOverIndex: mouseOverIndex, isEnterStep: isEnterStep}"
                        @editStep="editStep"
                        @handleEnterStep="handleEnterStep"
                        @handleLeaveStep="handleLeaveStep"
                    >
                    </base-step>
                </div>
            </el-collapse>
            <div class="acc-li add-step" @click="addLastStep">
                <i class="el-icon-plus"></i> &nbsp;&nbsp;新增
            </div>
        </div>
        <transition name="fade" mode="out-in">
            <div id="mask" v-show="isEnterBase || isEnterStep || isEnterMaterial"></div>
        </transition>
        <div class="phone-bottom">
            <img src="~@/assets/images/phone-bottom.png" alt="">
        </div>
    </div>
</template>

<script>
    import BaseStep from '@/components/BaseStep/index';
    import axios from 'axios'
    import { isImg } from '@/utils/index'

    export default {
        name:'MainPhone',
        components: { BaseStep },
        data() {
            return {
                editProductName: true,
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
        methods: {
            // 上传
            uploadFile(file) {
                if( !isImg(file.name) ) {
                    this.$message({
                        message: '只能上传图片',
                        type:'error'
                    })
                    return;
                }
                var formData = new FormData();
                formData.append('file', file);
                formData.append('userId', '0');
                formData.append('flag', '');
                formData.append('fileType', '0');
                axios.post("http://admin.ytbuyer.com/ytfarmapi/file/uploadImage", formData).then((res)=>{
                     if(res.data.code == 0 && res.data.data.fileUrl){
                         this.$message({
                             message:"上传成功",
                             type:'success'
                         })
                         this.stepData.imgUrl = res.data.data.fileUrl;
                     }else{
                        this.$message({
                            message:res.data.msg,
                            type:'error'
                        })
                    }
                 })
                return false;
            },
            // phone 上的编辑按钮
            editStep(index) {
                this.$emit('editStep', index);
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
            // 末尾追加步骤
            addLastStep() {
                this.$emit('addLastStep');
            },
            //添加原料
            handleCommand(val) {
                this.$emit('handleCommand', val);
            }
        },
    }
</script>

<style lang="scss" scoped>
    @import '../../styles/mixin';
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
        position: relative;
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
</style>