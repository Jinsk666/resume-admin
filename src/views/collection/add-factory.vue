<template>
    <div>
        <div class="container">
            <div class="title2">添加原料信息</div>
            <el-form label-width="200px" class="demo-ruleForm">
				<el-row>
					<el-col :span="( item.dataType == 10 ) ? 20 : 10 "
						v-for="(item, index) in moduleDataAddDto.generalInfoList"
						:key="index">
						<el-form-item v-if="item.dataType == 1 || item.dataType == 2" :label="item.label + ' : '">
							<el-input v-model="item.value" size="small"></el-input>
						</el-form-item>
						<!-- textarea -->
						<el-form-item v-else-if="item.dataType == 10" :label="item.label + ' : '">
							<el-input type="textarea" :rows="5" v-model="item.value" placeholder="最多输入1000字"></el-input>
						</el-form-item>
						<!-- 上传图片 -->
						<el-form-item v-else-if="item.label == '企业图片'" :label="item.label + ' : '" style="z-index:99;">
							<el-upload
								action=""
								:before-upload="beforeUpload"
								:http-request="uploadFile1"
								:on-remove="removeUpload"
								list-type="picture-card"
								:file-list="moduleDataAddDto.imgUrlList"
								>
								<i class="el-icon-plus"></i>
							</el-upload>
						</el-form-item>
						<!-- 上传图片 -->
						<el-form-item v-else-if="item.label == '企业Logo'" :label="item.label + ' : '" style="z-index:99;">
							<el-upload
								class="avatar-uploader"
								action=""
								:before-upload="beforeUpload"
								:http-request="uploadFile"
								:show-file-list="false"
								>
								<img v-if="moduleDataAddDto.logoUrl" :src="moduleDataAddDto.logoUrl" class="avatar">
								<i v-else class="el-icon-plus avatar-uploader-icon"></i>
							</el-upload>
						</el-form-item>
					</el-col>
				</el-row>
                <!-- 文档上传 -->
                <el-row>
                    <el-col :span="10">
                        <el-form-item label="本地文档上传 :" prop="enterpriseName">
                            <el-button type="primary" size="small" icon="el-icon-upload2">选择本地文档</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
			</el-form>
        </div>
		<div class="footer">
			<el-button type="primary" size="small" @click="submitForm" style="margin:20px;">保存</el-button>
            <el-button size="small" @click="handleCancel">取消</el-button>
		</div>
        <data-upload :isDataUpload="isDataUpload"></data-upload>
    </div>
</template>

<script>
	import { addFactory, editFactory, getFactory } from '@/api/v2'
	import { isImg } from '@/utils'
	import { deleteUrl } from '@/utils/v2'
	import { uploadImg } from '@/utils/upload'
    import DataUpload from '@/components/v2/collection/DataUpload'
    export default {
        components: { DataUpload },
        data() {
            return {
				isDataUpload: false, // 数据接入弹出框
				imgList: [], //判断是否重复
				moduleDataAddDto: { //上传的数据
					enterpriseSelectName: '', //下拉框企业名称
					externalQuoteList: [], //外部引用
					generalInfoList: [
						{label: '企业名称', value: '', dataType:'1'},
						{label: '企业地址', value: '', dataType:'1'},
						{label: '统一社会信用代码', value: '', dataType:'1'},
						{label: '企业负责人', value: '', dataType:'1'},
						{label: '企业简介', value: '', dataType:'10'},
						{label: '企业图片', value: '', dataType:'9'},
						{label: '企业Logo', value: '', dataType:'9'},
					], //基本信息
					subModelInfoList: [], // 种植 加工用
					moduleName: '',
					moduleUniqueCode: '', // 接入数据编码
					imgUrlList: [], // 产品图片
					logoUrl: '', // logo
					videoUrlList: [], //视频
					type: 1
				},
            }
		},
		computed: {
			id: function () {
				return this.$route.query.id
			}
		},
		mounted() {
			if( this.id ){ // 修改
				getFactory(this.id).then( data => {
					this.moduleDataAddDto = data.data;
				})
            }
		},
		methods: {
			submitForm() {
				this.moduleDataAddDto.moduleName = this.moduleDataAddDto.generalInfoList[0].value || '';
				if( !this.id ) {
					addFactory(this.moduleDataAddDto).then( data => {
						this.$message.success('添加成功');
						this.$router.go(-1);
					})
				}else {
					this.moduleDataAddDto.type = 1;
					editFactory(this.moduleDataAddDto).then( data => {
						this.$message.success('修改成功');
						this.$router.go(-1);
					})
				}
			},
			removeUpload(file, fileList) {
				this.moduleDataAddDto.imgUrlList = deleteUrl(file.url, this.moduleDataAddDto.imgUrlList)
			},
			beforeUpload(file){
				if( !isImg(file.name) ) {
					this.$message({
						message: '只能上传图片',
						type:'error'
					})
					return false;
				}
			},
			async uploadFile1(params) {
				let data = await uploadImg(params.file);
				if( !data ) return;
				this.imgList.push(data.data.fileUrl);
				this.moduleDataAddDto.imgUrlList.push( {'name': data.data.fileUrl, 'url': data.data.fileUrl} )
            },
			async uploadFile(params) {
				let data = await uploadImg(params.file);
				if( !data ) return;
				this.moduleDataAddDto.logoUrl = data.data.fileUrl;
            },
            handleCancel() {
                this.$router.go(-1);
            }
		},
    }
</script>

<style lang="scss" scoped>
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