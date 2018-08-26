<template>
    <div>
        <div class="container" v-if="tab != 'zz' && tab != 'jg'">
            <div class="title2">{{tabName}}信息</div>
            <el-form label-width="200px" class="demo-ruleForm">
				<el-row> <!-- 9图片 10富文本 8 链接-->
					<el-col :span="( item.dataType == 10 || item.dataType == 9 ) ? 20 : 10 "
						v-for="(item, index) in moduleDataAddDto.generalInfoList"
						:key="index">
						<!-- 下拉框处理 -->
						<el-form-item v-if="item.dataType == 7 && item.label.indexOf('企业') != -1" :label="item.label + ' : '">
							{{moduleDataAddDto.enterpriseSelectName}}
						</el-form-item>
						<!-- 上传图片 -->
						<el-form-item v-else-if="item.dataType == 9" :label="item.label + ' : '" style="z-index:99;">
							<img
									class="show-img"
									v-for="(item, index) in moduleDataAddDto.imgUrlList"
									:key="index"
									:src="item.url" alt="">
						</el-form-item>
                        <el-form-item v-else-if="item.dataType == 3 || item.dataType == 4" :label="item.label + ' : '" style="z-index:99;">
                            {{item.value | formatTime('Y-m-d')}}
                        </el-form-item>
                        <el-form-item v-else-if="item.dataType == 5 || item.dataType == 6" :label="item.label + ' : '" style="z-index:99;">
                            {{item.value && item.value.split('-_-')[0] | formatTime('Y-m-d')}} {{item.value ? '~' : ''}} {{item.value && item.value.split('-_-')[1] | formatTime('Y-m-d')}}
                        </el-form-item>
                        <el-form-item v-else :label="item.label + ' : '">
							{{item.value}}
						</el-form-item>

					</el-col>
				</el-row>
                <!-- 引用外部链接 -->
                <el-row>
                    <el-col :span="20">
                        <el-form-item label="引用外部链接 :">
                            <div class="outer-link">
                                <span class="one-outer-link"
                                    v-for="(item, index) in moduleDataAddDto.externalQuoteList"
                                    v-if="item.externalURL"
                                    :key="index">
                                    <a target="_blank" :href="item.externalURL">{{item.externalName}}</a>
                                </span>
                            </div>
                        </el-form-item>
                    </el-col>
				</el-row>
				<!-- 文档上传 -->
                <el-row>
                    <el-col :span="20">
                        <el-form-item label="本地文档上传 :" >
                            <div class="outer-link-file">
								<span class="one-outer-link"
									v-for="(item, index) in moduleDataAddDto.documentUrlList"
									v-if="item.url"
									:key="index">
									<a target="_blank" :href="item.url">{{item.name}}</a>
								</span>
							</div>
                        </el-form-item>
                    </el-col>
                </el-row>
			</el-form>
        </div>
        <div class="container" v-else-if="tab == 'zz' || tab == 'jg'">
            <div class="title2">{{tabName}}信息</div>
            <div class="tabs-container">
                <el-tabs style="margin-top: 10px;" v-model="activeIndex">
                    <el-tab-pane
                        v-for="(item0, index0) in moduleDataAddDto.subModelInfoList"
                        :key="index0"
                        :name="String(index0)">
                        <span slot="label">
                            <svg-icon v-if="item0.label == '种植基本信息'" icon-class="zz"></svg-icon>
                            <svg-icon v-if="item0.label == '环境信息'" icon-class="hj"></svg-icon>
                            <svg-icon v-if="item0.label == '田间管理'" icon-class="tj"></svg-icon>
                            <svg-icon v-if="item0.label == '加工基本信息'" icon-class="jg"></svg-icon>
                            <svg-icon v-if="item0.label == '工序流程'" icon-class="gx"></svg-icon>
                            {{item0.label || '无返回'}}
                        </span>
                        <div v-if="item0.label == '种植基本信息' ||  item0.label == '环境信息' || item0.label == '加工基本信息'">
                            <!-- 同上 -->
                            <el-form label-width="200px" class="demo-ruleForm">
                                <el-row>
                                    <el-col :span="( item.dataType == 10 || item.dataType == 9 ) ? 20 : 10 "
                                        v-for="(item, index) in item0.generalInfoList"
                                        :key="index">
                                        <!-- 下拉框处理 -->
                                        <el-form-item v-if="item.dataType == 7 && item.label.indexOf('企业') != -1" :label="item.label + ' : '">
                                            {{moduleDataAddDto.enterpriseSelectName}}
                                        </el-form-item>
                                        <!-- 上传图片 -->
                                        <el-form-item v-else-if="item.dataType == 9 && item0.imgUrlList" :label="item.label + ' : '" style="z-index:99;">
                                            <img
                                                class="show-img"
                                                v-for="(item, index) in item0.imgUrlList"
                                                :key="index"
                                                :src="item.url" alt="">
                                        </el-form-item>
                                        <el-form-item v-else-if="item.dataType == 3 || item.dataType == 4" :label="item.label + ' : '" style="z-index:99;">
                                            {{item.value | formatTime('Y-m-d')}}
                                        </el-form-item>
                                        <el-form-item v-else-if="item.dataType == 5 || item.dataType == 6" :label="item.label + ' : '" style="z-index:99;">
                                            {{item.value && item.value.split('-_-')[0] | formatTime('Y-m-d')}} {{item.value ? '~' : ''}} {{item.value && item.value.split('-_-')[1] | formatTime('Y-m-d')}}
                                        </el-form-item>
                                        <el-form-item v-else :label="item.label + ' : '">
                                            {{item.value}}
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <!-- 引用外部链接 -->
                                <el-row>
                                    <el-col :span="20">
                                        <el-form-item label="引用外部链接 :">
                                            <div class="outer-link">
                                                <span class="one-outer-link"
                                                    v-if="item.externalURL"
                                                    v-for="(item, index) in item0.externalQuoteList"
                                                    :key="index">
                                                    <a target="_blank" :href="item.externalURL">{{item.externalName}}</a>
                                                </span>
                                            </div>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <!-- 文档上传 -->
                                <el-row>
                                    <el-col :span="20">
                                        <el-form-item label="本地文档上传 :" >
                                            <div class="outer-link-file">
                                                <span class="one-outer-link"
                                                    v-for="(item, index) in moduleDataAddDto.documentUrlList"
                                                    v-if="item.url"
                                                    :key="index">
                                                    <a target="_blank" :href="item.url">{{item.name}}</a>
                                                </span>
                                            </div>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </el-form>
                        </div>
                        <div v-if="(item0.label == '田间管理' ||  item0.label == '工序流程') && item0.subModelInfoInfoList">
                            <div
                                v-for="(item1, index1) in item0.subModelInfoInfoList"
                                :key="index1">
                                <div class="farm-container">
                                    <div class="left">
                                        <svg-icon icon-class="diamond"></svg-icon>
                                        <span class="farm-index">{{item1.label + (index1+1)}}</span>
                                        <svg-icon icon-class="diamond"></svg-icon>
                                    </div>
                                    <div class="left line"></div>
                                </div>
                                <!-- 同上 -->
                                <el-form label-width="200px" class="demo-ruleForm">
                                    <el-row>
                                        <el-col :span="( item.dataType == 10 || item.dataType == 9 ) ? 20 : 10 "
                                            v-for="(item, index) in item1.generalInfoList"
                                            :key="index">
                                            <!-- 上传图片 -->
                                            <el-form-item v-if="item.dataType == 9 && item1.imgUrlList" :label="item.label + ' : '" style="z-index:99;">
                                                <img
                                                    class="show-img"
                                                    v-for="(item, index) in item1.imgUrlList"
                                                    :key="index"
                                                    :src="item.url" alt="">
                                            </el-form-item>
                                            <el-form-item v-else-if="item.dataType == 3 || item.dataType == 4" :label="item.label + ' : '" style="z-index:99;">
                                                {{item.value | formatTime('Y-m-d')}}
                                            </el-form-item>
                                            <el-form-item v-else-if="item.dataType == 5 || item.dataType == 6" :label="item.label + ' : '" style="z-index:99;">
                                                {{item.value && item.value.split('-_-')[0] | formatTime('Y-m-d')}} {{item.value ? '~' : ''}} {{item.value && item.value.split('-_-')[1] | formatTime('Y-m-d')}}
                                            </el-form-item>
                                            <el-form-item v-else :label="item.label + ' : '">
                                                {{item.value}}
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                </el-form>
                            </div>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
		<div class="footer">
            <router-link :to="{name: 'collectionProcess', query: {tab: tab, tabId: tabId, tabName: tabName}}">
                <el-button size="small">取消</el-button>
            </router-link>
		</div>
    </div>
</template>

<script>
    import { getModuleData } from '@/api/v2'
    export default {
        data() {
            return {
                moduleDataAddDto: [],
                activeIndex: '0'
            }
        },
        computed: {
            id: function() {
                return this.$route.query.id
            },
            tab: function() {
                return this.$route.query.tab
            },
            tabId: function() {
                return this.$route.query.tabId
            },
            tabName: function() {
                return this.$route.query.tabName
            }
        },
        mounted() {
            getModuleData(this.id, this.tabId).then( data => {
                this.moduleDataAddDto = data.data;
            })
        }
    }
</script>

<style lang="scss" scoped>
    @import '../../styles/mixin';
    .outer-link-file {
        display: inline-block;
        margin: 0 10px;
        .one-outer-link {
            display: inline-block;
			padding: 0 40px;
			font-size:12px;
            text-align: center;
            border: 1px solid #ddd;
            border-radius: 4px;
			margin: 0 5px;
			height: 35px;
			line-height:32px;
        }
    }
    .outer-link-icon {
        width: 14px;
    }
    .outer-link {
        display: inline-block;
        margin: 0 10px;
        .one-outer-link {
            display: inline-block;
            padding: 0 40px;
            height: 32px;
            line-height: 30px;
            text-align: center;
            border: 1px solid #ddd;
            border-radius: 4px;
            margin: 0 5px;
            background: #fff url('~@/assets/images/v2/outer-link.png') no-repeat 5% center;
            background-size: 20px 18px;
        }
    }
    .show-img {
		width: 148px;
		height: 148px;
		margin: 3px;
	}
    .tabs-container {
        width: 96%;
        margin-left: 20px;
        position: relative;
        .right-data {
            position: absolute;
            top: 0px;
            right: 20px;
        }
    }
    .title {
		height: 50px;
		line-height: 50px;
		background: #fff;
		padding-left: 30px;
		margin-bottom: 20px;
		font-size: 14px;
		font-weight: 500;
	}
	.container {
		width: 98%;
		margin: 20px auto;
		background: #fff;
		.title2 {
			width: 96%;
			height: 50px;
			line-height: 50px;
			border-bottom: 1px dashed #ccc;
			margin: 0 0 20px 20px;
			font-size: 14px;
			font-weight: 500;
        }
        .upload-row {
            padding-left: 30px;
            font-size: 14px;
            padding-bottom: 20px;
            .format {
                display: inline-block;
                width:100px;
                text-align: right;
            }
        }
	}
	.footer {
		text-align: center;
		background: #fff;
		width: 98%;
		margin: 0 auto;
		height: 60px;
		line-height: 60px;
	}
	.country {
		width: 32%;
	}


	.avatar-uploader-icon {
		font-size: 28px;
		color: #8c939d;
		width: 178px;
		height: 178px;
		line-height: 178px;
		text-align: center;
	}
	.avatar {
		width: 178px;
		height: 178px;
		display: block;
	}
    .add-farm {
        width: 90%;
        height: 40px;
        line-height: 40px;
        color: #fff;
        text-align: center;
        background: #409EFF;
        margin: 20px auto;
        border-radius: 6px;
        cursor: pointer;
        &:hover {
            opacity: .8;
        }
    }
    .farm-container {
        overflow: hidden;
        margin: 10px 32px 10px 20px;
        color: #409EFF;
        .line {
            height: 1px;
            min-width: 86%;
            background: #409EFF;
            margin-top: 9px
        }
        .farm-index {
            padding: 0 10px;
        }
        .delete {
            position: absolute;
            top: 6px;
            right: 32px;
            width: 28px;
            height: 28px;
            line-height: 28px;
            background: #409EFF;
            color: #fff;
            text-align: center;
            cursor: pointer;
            &:hover {
                opacity: .8;
            }
        }
    }
    .file-item {
        display: inline-block;
        .upload-item {
            border: 1px dashed #c0ccda;
            width: 148px;
            height: 148px;
            line-height: 146px;
            border-radius: 6px;
            text-align: center;
            display: inline-block;
            &:hover {
                border-color: #409EFF;
            }
            input {
                display: none!important;
            }
            i {
                font-size: 28px;
                color: #8c939d;
            }
        }
    }
    .form-container{
        margin-top: 20px;
    }
    .img-container {
        display: inline-block;
        img {
            width: 148px;
            height: 148px;
        }
    }
    .outer-link-img {
        width: 100px;
        margin: 10px auto;
    }
    .block{
        display: block;
    }
    .addstep-container {
        overflow: hidden;
    }
    .addstep-li {
        margin: 0 20px;
    }
    .move {
        font-size: 22px;
        cursor: pointer;
        height: 42px;
        line-height: 42px;
        border: 1px solid #ddd;
        border-radius: 6px;
        &:hover {
            color: #409EFF;
            border: 1px solid #409EFF;
        }
    }
    .icon-jt {
        font-size: 55px;
        color:#d8d8d8;
        position: relative;
        top: -8px;
    }
    .top-step {
        overflow: hidden;
        margin-left:1px;
        transition: margin .3s;
        .item-btn {
            position: relative;
        }
    }
    .step-add-middle {
        position: absolute;
        right: 24px;
        z-index:99;
    }
    .step-add {
        margin-top: 8px;
        background:#FFF;
        cursor: pointer;
    }
    .todo {
        font-size: 16px;
        cursor: pointer;
        padding: 0 4px;
    }
    .active {
        background: #409EFF;
        color: #FFF;
        cursor: auto;
    }
    .top-step-contaiber{
        margin: 0 10px;
        width: 588px;
        white-space: nowrap;
        overflow: hidden;
    }
    .step-container {
        .top-step {
            width:20000px;
        }
        .step-item {
            position: relative;
            width: 60px;
            height: 42px;
            line-height: 42px;
            text-align: center;
            border: 1px solid #ddd;
            border-radius: 6px;
            cursor: pointer;
        }
        .delete-add {
            position: absolute;
            top: -12px;
            color: red;
        }
    }
    .middle-container {
        z-index:8;
        position: relative;
        margin-top: 20px;
        border: 1px dashed #ccc;
        border-radius: 6px;
        .current-font {
            color: #19A9E8;
            font-weight: 500;
            font-size: 15px;
            position: absolute;
            top: -13px;
            left: 10px;
            z-index: 9;
            background: #FFF;
        }
        .outer-btn {
            text-align: center;
            margin: 14px;
        }
    }
    .file-container {
        margin-right: 10px;
    }
</style>