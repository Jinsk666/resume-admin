<template>
    <div>
        <div class="container">
            <div class="title2">原料信息</div>
            <el-form label-width="200px" class="demo-ruleForm">
				<el-row>
					<el-col :span="( item.dataType == 10 ) ? 20 : 10 "
						v-for="(item, index) in moduleDataAddDto.generalInfoList"
						:key="index">
						<el-form-item v-if="item.dataType != 9" :label="item.label + ' : '">
							{{item.value}}
						</el-form-item>
						<!-- 上传图片 -->
						<el-form-item v-else-if="item.label == '企业图片'" :label="item.label + ' : '" style="z-index:99;">
							<img
								class="show-img"
								v-for="(item, index) in moduleDataAddDto.imgUrlList"
								:key="index"
								:src="item.url" alt="">
						</el-form-item>
						<!-- 上传图片 -->
						<el-form-item v-else-if="item.label == '企业Logo'" :label="item.label + ' : '" style="z-index:99;">
							
						</el-form-item>
					</el-col>
				</el-row>
                <!-- 文档上传 -->
                <el-row>
                    <el-col :span="10">
                        <el-form-item label="本地文档上传 :" prop="enterpriseName">
                            <a style="color: #409eff;" target="_blank" href=""></a>
                        </el-form-item>
                    </el-col>
                </el-row>
			</el-form>
        </div>
		<div class="footer">
            <el-button size="small" @click="back">返回</el-button>
		</div>
    </div>
</template>

<script>
	import { getFactory } from '@/api/v2'
    export default {
        data() {
            return {
				imgList: [], //图片列表
				moduleDataAddDto: [],
            }
		},
		computed: {
			id: function () {
				return this.$route.query.id
			}
		},
		mounted() {
			getFactory(this.id).then( data => {
				this.moduleDataAddDto = data.data;
			})
		},
		methods: {
            back() {
                this.$router.go(-1);
            }
		},
    }
</script>

<style lang="scss" scoped>
	.show-img {
		width: 148px;
		height: 148px;
		margin: 3px;
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
			width: 90%;
			height: 50px;
			line-height: 50px;
			border-bottom: 1px dashed #ccc;
			margin: 0 0 20px 30px;
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
		width: 148px;
		height: 148px;
		line-height: 148px;
		text-align: center;
	}
	.avatar {
		width: 148px;
		height: 148px;
		display: block;
	}
</style>