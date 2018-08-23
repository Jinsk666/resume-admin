<template>
	<div>
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
			</template>
		</el-collapse-item>
	</div>
</template>

<script>
	import { step2Class } from '@/utils'
    export default {
        props: ['stepData'],
        data() {
            return {
				
            }
		},
		filters: {
			step2Class
		},
		methods: {
			
		},
    }
</script>

<style lang="scss" scoped>
	@import '../../../styles/mixin';
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
		.JC {
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