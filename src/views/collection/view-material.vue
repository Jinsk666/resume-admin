<template>
    <div>
        <div class="container">
            <div class="title2">原料信息</div>
            <el-form label-width="200px" class="demo-ruleForm">
				<el-row>
					<el-col :span="( item.dataType == 10 || item.dataType == 9) ? 20 : 10 "
						v-for="(item, index) in moduleDataAddDto.generalInfoList"
						:key="index">
						<el-form-item v-if="item.dataType != 9 && item.dataType != 7 && item.dataType != 8" :label="item.label + ' : '">
							{{item.value}}
						</el-form-item>
						<el-form-item v-else-if="item.dataType == 7" :label="item.label + ' : '">
							{{moduleDataAddDto.enterpriseSelectName}}
						</el-form-item>
						<el-form-item v-else-if="item.dataType == 8" :label="item.label + ' : '">
							<a target="_blank" style="color: #409EFF;" :href="item.value">{{item.value}}</a>
						</el-form-item>
						<!-- 上传图片 -->
						<el-form-item v-else-if="item.dataType == 9" :label="item.label + ' : '" style="z-index:99;">
								<img
									class="show-img"
									v-for="(item, index) in moduleDataAddDto.imgUrlList"
									:key="index"
									:src="item.url" alt="">
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
		<div class="footer">
            <el-button size="small" @click="backs">返回</el-button>
		</div>
    </div>
</template>

<script>
	import { getModuleData } from '@/api/v2'
    export default {
        data() {
            return {
				isDataUpload: false, // 数据接入弹出框
				moduleDataAddDto: []
            }
		},
		computed: {
			id: function() {
				return this.$route.query.id
			}
		},
		mounted() {
			getModuleData( this.id, 1 ).then( data => {
				this.moduleDataAddDto = data.data;
			})
		},
		methods: {
            backs() {
                this.$router.go(-1);
            }
		},
    }
</script>

<style lang="scss" scoped>
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
</style>