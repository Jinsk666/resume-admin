<template>
	<div
		@mouseover="handleEnterStep"
		@mouseout="handleLeaveStep"
		:class="{over: stepData.isEnterStep && stepData.index === stepData.mouseOverIndex}"
		>
		<!-- 基本模版 -> ( 图 + 文字 + 履历外链 ) -->
		<el-collapse-item
			class="acc-li"
			:name="stepData.index"
			:class="stepData.data.moduleName | step2Class"
			>
			<template slot="title">
				<i class="acc-font"
					:class="stepData.data.moduleName | step2Class">
					{{stepData.data.moduleName}}
				</i>
				<span class="step-edit right" @click.stop="editStep(stepData.index)" v-show="stepData.index === stepData.mouseOverIndex">
					<i class="el-icon-edit"></i>
				</span>
			</template>
			<div v-if="stepData.data.moduleName != '种植' && stepData.data.moduleName != '加工'">
				<el-row
					class="acc-row"
					v-if="stepData.data.imgUrlList"
					v-for="(item, index) in stepData.data.imgUrlList"
					:key="(index + 100)">
					<el-col :span="24"><img :src="item" class="acc-img"></el-col>
				</el-row>
				<el-row
					class="acc-row factory-info"
					v-for="(item, index) in stepData.data.generalInfoList"
					v-if="item.label.indexOf('图片') == -1 && item.label.indexOf('上传检测报告') == -1"
					:key="(index + 200)">
					<el-col :span="8"><div class="left">{{item.label}}</div></el-col>
					<el-col v-if="dateList.includes(item.dataType)" :span="16"><div class="right t">{{item.value | formatTime('Y-m-d')}}</div></el-col>
					<el-col v-else :span="16"><div class="right t">{{item.value}}</div></el-col>
				</el-row>
			</div>
			<!-- 种植处理 -->
			<div v-else-if="stepData.data.moduleName == '种植' || stepData.data.moduleName == '加工'">
				<el-tabs v-model="activeName2">
				<el-tab-pane
					:label="item.label || '无返回'"
					:name="index+'h'"
					v-for="(item, index) in stepData.data.subModelInfoInfoList"
					:key="(index + 300)">
					<span slot="label">
						<span class="pro-icon-1" v-if="item.label == '种植基本信息'"><svg-icon icon-class="zz"></svg-icon></span>
						<span class="pro-icon-2" v-else-if="item.label == '环境信息'"><svg-icon icon-class="hj"></svg-icon></span>
						<span class="pro-icon-2" v-else-if="item.label == '田间管理'"><svg-icon icon-class="tj"></svg-icon></span>
						<span class="pro-icon-1" v-if="item.label == '加工基本信息'"><svg-icon icon-class="jg"></svg-icon></span>
						<span class="pro-icon-2" v-if="item.label == '工序流程'"><svg-icon icon-class="gx"></svg-icon></span>
						{{item.label || '无返回'}}
					</span>
					<div class="item-container" v-if="index != 1">
						<div class="env-info">
							<span class="env-info-pointer"></span><span class="env-info-line"></span>
							<span class="env-info-font">{{item.label}}</span>
							<span class="env-info-line"></span><span class="env-info-pointer"></span>
						</div>
						<el-row
							class="acc-row"
							v-for="(item, index1) in item.imgUrlList"
							:key="(index1 + 400)">
							<el-col :span="24"><img :src="item" class="acc-img"></el-col>
						</el-row>
						<el-row
							class="acc-row factory-info"
							v-for="(item, index) in item.generalInfoList"
							v-if="item.label.indexOf('图片') == -1"
							:key="(index + 500)">
							<el-col :span="8"><div class="left">{{item.label}}</div></el-col>
							<el-col v-if="dateList.includes(item.dataType)" :span="16"><div class="right t">{{item.value | formatTime('Y-m-d')}}</div></el-col>
							<el-col v-else :span="16"><div class="right t">{{item.value}}</div></el-col>
						</el-row>
					</div>
					<div v-else-if="stepData.data.moduleName == '种植' && index == 1">
						<!-- 树苗 -->
						<base-tree :toData="{data: item.subModelInfoInfoList}"></base-tree>
					</div>
					<div v-else-if="stepData.data.moduleName == '加工' && index == 1">
						<div
							class="right jg-step"
							v-for="(item2, index) in item.subModelInfoInfoList"
							:key="(index + 1000)">
							<div class="point-line" v-if="index != item.subModelInfoInfoList.length - 1"></div>
							<span class="circle-img" v-if="index == 0">
								<img src="@/assets/images/jg-point.png" alt="">
							</span>
							<span class="circle" v-else></span>
							<div v-if="item2.imgUrlList"><img :src="item2.imgUrlList[0]" alt="图片"></div>
							<div>工序名称: {{item2.generalInfoList[0].value}}</div>
							<div>生产时间段: {{item2.generalInfoList[1].value | formatTime('Y-m-d')}}</div>
						</div>
					</div>
				</el-tab-pane>
			</el-tabs>
			</div>
		</el-collapse-item>
	</div>
</template>

<script>
	import BaseTree from '@/components/BaseTree'
	import { formatTime, step2Class } from '@/utils'
    export default {
		components: { BaseTree },
        props: ['stepData'],
        data() {
            return {
				activeName2: '0h',
				dateList: [3, 4, 5, 6],
            }
		},
		filters: {
			formatTime, step2Class
		},
		methods: {
			editStep(index) {
				this.$emit("editStep", index);
			},
			handleEnterStep() {
				this.$emit("handleEnterStep");
			},
			handleLeaveStep() {
				this.$emit("handleLeaveStep");
			}
		},
    }
</script>

<style lang="scss" scoped>
	@import '../../styles/mixin';
	.pro-icon-1, .pro-icon-2 {
		position: absolute;
		top: -69px;
		font-size: 24px;
	}
	.pro-icon-1 {
		left: 30px;
	}
	.pro-icon-2 {
		left: 16px;
	}
	.jg-step {
		position: relative;
		width: calc(100% - 50px);
		border: 1px solid #ccc;
		border-radius: 6px;
		margin-bottom: 10px;
		padding: 4px 10px;
		img {
			height: 110px;
			border-radius: 6px;
		}
		.point-line {
			position: absolute;
			height: 124%;
			width: 2px;
			background: #E8E8E8;
			left: -30px;
			top:16px;
		}
		.circle {
			padding: 6px 6px;
			background: #E8E8E8;
			border-radius: 50%;
			position: absolute;
			left: -35px;
			top: 16px;
		}
		.circle-img {
			position: absolute;
			left: -41px;
			top: 8px;
			display: inline-block;
			img {
				height: 24px;
				width: 24px;
			}
		}
	}
	.env-info {
		text-align: center;
		height: 30px;
		line-height: 30px;
		margin: 10px 0;
		.env-info-pointer {
			border: 5px solid $color;
			display: inline-block;
		}
		.env-info-line {
			width: 30px;
			height: 2px;
			position: relative;
			bottom: 3.6px;
			background: $color;
			display:inline-block;
		}
		.env-info-font {
			font-size: 18px;
			display: inline-block;
			margin: 0 20px;
			color: #30544E;
		}
	}
	.over {
		position: relative;
		z-index: 99;
	}
	.step-edit {
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
	.acc-li{
		margin: 8px 0;
		padding: 0 20px;
		background-color: #fff;
		border-radius: 6px;
		.QY {
			@include bis('~@/assets/images/factory.png');
		}
		.JG {
			@include bis('~@/assets/images/process.png');
		}
		.TJ {
			@include bis('~@/assets/images/farm.png');
		}
		.ZJ {
			@include bis('~@/assets/images/quality.png');
		}
		.ZZ {
			@include bis('~@/assets/images/plant.png');
		}
		.CC {
			@include bis('~@/assets/images/ware.png');
		}
		.CC {
			@include bis('~@/assets/images/ware.png');
		}
		.BZ {
			@include bis('~@/assets/images/package.png');
		}
		.CG {
			@include bis('~@/assets/images/buy.png');
		}
		.CS {
			@include bis('~@/assets/images/get.png');
		}

	}
	.acc-font{
		display: inline-block;
		position: relative;
		padding-left: 30px;
		background-size: 20px 20px!important;
		background-position: left center;
		transition: transform .4s;
		font-style: normal;
	}
	.acc-row .t {
		width: 100%;
		text-align: right;
	}
	.acc-img {
		width:100%;
		margin-bottom: 10px;
	}
	.factory-info {
		font-size: 16px;
		padding:20px 0;
		line-height: 20px;
		border-bottom: 1px dashed $color2;
	}
</style>