<template>
    <div>
        <div class="container">
            <div class="title2">企业信息</div>
            <el-form label-width="200px" class="demo-ruleForm">
				<el-row>
					<el-col :span="( item.dataType == 10 ) ? 20 : 10 "
						v-for="(item, index) in moduleDataAddDto.generalInfoList"
						:key="index">
						<el-form-item v-if="item.dataType == 1 || item.dataType == 2" :label="item.label + ' : '" :required="item.required ? true : false">
							<el-input v-model="item.value" size="small"></el-input>
						</el-form-item>
						<!-- textarea -->
						<el-form-item v-else-if="item.dataType == 10" :label="item.label + ' : '">
							<el-input type="textarea" :rows="5" v-model="item.value" placeholder="请输入文本"></el-input>
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
                    <el-col :span="20">
                        <el-form-item label="本地文档上传 :">
								<el-button type="primary" size="small" @click="docUpload">
									<img class="outer-link-icon" src="@/assets/images/v2/get-upload.png" alt="">
									选择本地文档
								</el-button>
								<input type="file" ref="docFile" @change="uploadBaseFile" style="display:none;">
								<div class="outer-link-file">
									<span class="one-outer-link"
										v-for="(item, index) in moduleDataAddDto.documentUrlList"
										v-if="item.url"
										:key="index">
										<a target="_blank" :href="item.url">{{item.name}}</a>
										<span
											@click.stop="deleteDoc(index)"
											class="el-icon-circle-close doc-delete">
										</span>
									</span>
								</div>
                        </el-form-item>
                    </el-col>
				</el-row>
			</el-form>
			<!-- 地图 -->
			<!-- <input v-model="map.center">
			<baidu-map
			class="map"
				:center="map.center"
				@moving="syncCenterAndZoom"
				@moveend="syncCenterAndZoom"
				@zoomend="syncCenterAndZoom">
			</baidu-map> -->
        </div>
		<div class="footer">
			<el-button type="primary" size="small" @click="submitForm" style="margin:20px;">保存</el-button>
            <el-button size="small" @click="handleCancel">取消</el-button>
		</div>
    </div>
</template>

<script>
	import { addFactory, editFactory, getFactory } from '@/api/v2'
	import { isImg } from '@/utils'
	import { deleteUrl, generalValidate } from '@/utils/v2'
	import { uploadImg, uploadFileDemo, isAcceptFile, setOssUrl } from '@/utils/upload'

    export default {
        data() {
            return {
				isDataUpload: false, // 数据接入弹出框
				imgList: [], //判断是否重复
				moduleDataAddDto: { //上传的数据
					documentUrlList: [],
					enterpriseSelectName: '', //下拉框企业名称
					externalQuoteList: [], //外部引用
					generalInfoList: [
						{label: '企业名称', value: '', dataType:'1', required: 1},
						{label: '企业地址', value: '', dataType:'1', required: 0},
						{label: '统一社会信用代码', value: '', dataType:'1', required: 1},
						{label: '企业负责人', value: '', dataType:'1', required: 0},
						{label: '企业简介', value: '', dataType:'10', required: 0},
						{label: '企业图片', value: '', dataType:'9', required: 0},
						{label: '企业Logo', value: '', dataType:'9', required: 0}
					], //基本信息
					subModelInfoList: [], // 种植 加工用
					moduleName: '',
					moduleUniqueCode: '', // 接入数据编码
					imgUrlList: [], // 产品图片
					logoUrl: '', // logo
					videoUrlList: [], //视频
					type: 1
				},
				map: {
					center: '北京市'
				}
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
				// 验证必填
				let validate = generalValidate( this.moduleDataAddDto );
				if( validate ){
					this.$message.error(validate + '是必填字段');
					return;
				}

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
			},
			// 上传文档
			docUpload() {
				this.$refs.docFile.click();
			},
			async uploadBaseFile(e) {
				if ( !isAcceptFile(e.target.files[0]) ){
					this.$message.error('只允许上传 txt,doc,docx,xls,xlsx,pdf 结尾的文件');
					return;
				}
				let data = await uploadFileDemo(e.target.files[0]);
				setOssUrl(data, this.moduleDataAddDto.documentUrlList);
			},
			deleteDoc(index) {
                this.$confirm('确定要删除吗', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    //type: 'warning'
                }).then(() => {
                    this.moduleDataAddDto.documentUrlList.splice(index, 1);
                    this.$message({
                        type: 'success',
                        message: '删除成功'
                    });
                }).catch((err) => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
			},
			// 地图
			handleMapReady( { BMap, map } ) {
				console.log(BMap, map)
				this.map.center = '山西大学商务学院'
				this.map.zoom = 15
			},
			syncCenterAndZoom(e) {
				debugger;
				const {lng, lat} = e.target.getCenter()
				//this.center.lng = lng
				//this.center.lat = lat
				this.map.center = e.target.Yg;
				//this.zoom = e.target.getZoom()
			}
		},
    }
</script>

<style lang="scss" scoped>
	.map {
		height: 300px;
		width: 300px;
	}
	.outer-link-file {
        display: inline-block;
        margin: 0 10px;
        .one-outer-link {
            display: inline-block;
			padding: 0 10px 0 22px;
			font-size:12px;
            text-align: center;
            border: 1px solid #ddd;
            border-radius: 4px;
			margin: 0 5px;
			height: 35px;
			cursor: pointer;
			line-height:32px;
			.doc-delete {
				color: red;
				visibility: hidden;
			}
			&:hover .doc-delete{
				visibility: inherit;
			}
        }
    }
	.outer-link-icon {
		width: 14px;
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
		margin: 15px auto;
		background: #fff;
		.title2 {
			width: 95%;
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