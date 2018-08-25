<template>
    <div>
        <div class="container" v-if="mainLoading">
            <div class="title2">添加原料信息</div>
            <el-form label-width="200px" class="demo-ruleForm">
				<el-row>
					<el-col :span="( item.dataType == 10 || item.dataType == 9 || item.dataType == 8) ? 20 : 10 "
						v-for="(item, index) in moduleDataAddDto.generalInfoList"
						:key="index">
						<el-form-item v-if="item.dataType == 8" :label="item.label + ' : '">
							<el-col :span="10">
								<el-input id="link" v-model="item.value" size="small"></el-input>
							</el-col>
							<!-- 提示信息 -->
							<el-col :span="10">
								<el-tooltip class="item" effect="light" content="消费者在查看原料信息时, 会直接跳转到该链接地址" placement="bottom-start">
									<i class="el-icon-question" style="font-size:30px; margin-top: 4px;"></i>
								</el-tooltip>
							</el-col>
						</el-form-item>
						<!-- 下拉框处理 -->
						<el-form-item v-else-if="item.dataType == 7" :label="item.label + ' : '">
							<el-select
								:popper-append-to-body="false"
								@visible-change="handleShow"
								@change="handleChange"
								filterable
								remote
								:remote-method="remoteMethod"
								:loading="loading"
								v-model="item.value"
								placeholder="请选择"
								size="small"
								style="width:100%">
								<el-option
									v-for="item in options"
									:key="item.uniqueCode"
									:value="item.uniqueCode"
									:label="item.enterpriseName">
								</el-option>
							</el-select>
						</el-form-item>
						<!-- textarea -->
						<el-form-item v-else-if="item.dataType == 10" :label="item.label + ' : '">
							<el-input type="textarea" :rows="5" v-model="item.value" placeholder="请输入文本"></el-input>
						</el-form-item>
						<!-- 上传图片 -->
						<el-form-item v-else-if="item.dataType == 9" :label="item.label + ' : '" style="z-index:99;">
							<el-upload
								action=""
								:before-upload="beforeUpload"
								:http-request="uploadFile"
								:on-remove="removeUpload"
								list-type="picture-card"
								:file-list="moduleDataAddDto.imgUrlList"
								>
								<i class="el-icon-plus"></i>
							</el-upload>
						</el-form-item>
						<el-form-item v-else :label="item.label + ' : '">
							<el-input v-model="item.value" size="small"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
                	<!-- 文档上传 -->
				<el-row>
                    <el-col :span="10">
                        <el-form-item label="本地文档上传 :">
							<el-upload
								class="upload-demo"
								action=""
								:http-request="uploadBaseFile"
								>
								<el-button type="primary" size="small">
									<img class="outer-link-icon" src="@/assets/images/v2/get-upload.png" alt="">
									选择本地文档
								</el-button>
							</el-upload>
                        </el-form-item>
                    </el-col>
				</el-row>
                	<!-- 数据接入 -->
				<el-row>
                    <el-col :span="10">
                        <el-form-item label="数据接入 :">
                            <el-button type="primary" size="small" @click="isDataUpload = true">
								<img class="outer-link-icon" src="@/assets/images/v2/get-icon.png" alt="">
								选择数据接入
							</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
			</el-form>
        </div>
		<div class="footer">
			<el-button type="primary" size="small" @click="submitForm" style="margin:20px;">保存</el-button>
            <router-link :to="{name: 'collectionMaterial'}">
                <el-button size="small">取消</el-button>
            </router-link>
		</div>
        <data-upload
			v-if="isDataUpload"
			@dataUploadSure="dataUploadSure"
			@dataUploadCancel="dataUploadCancel"
			@handleClose="handleClose"
			:isDataUpload="isDataUpload"
			:type="1">
		</data-upload>
    </div>
</template>

<script>
	import { getModelList, addModuleData, editModuleData, getModuleData, getFactoryList } from '@/api/v2'
	import { isImg, scrollMore } from '@/utils'
	import { setModule } from '@/utils/v2'
	import { uploadImg, uploadFileDemo } from '@/utils/upload'
    import DataUpload from '@/components/v2/collection/DataUpload'
    export default {
        components: { DataUpload },
        data() {
            return {
				mainLoading: false,
				loading: false,
				isDataUpload: false, // 数据接入弹出框
				// 最终上传的数据
                moduleDataAddDto: {
					enterpriseSelectName: '', //下拉框企业名称
					externalQuoteList: [], //外部引用
					generalInfoList: [], //基本信息
					subModelInfoList: [], // 种植 加工用
					moduleName: '',  //模块名称
					moduleUniqueCode: '', // 接入数据编码
					imgUrlList: [], // 产品图片
					videoUrlList: [], //视频
					type: 1, //基本信息
				},
				moduleInfos: {},
				options: [], //下拉框列表

				isRemote: false, // 下拉框是否在 请求数据
                optionsPage: 1, // 当前页数
                optionsPageCount: 0, // 总共页数
                optionsLinkParams: '', // 搜索条件
            }
		},
		computed: {
			id: function() {
				return this.$route.query.id
			}
		},
		mounted() {
			this.remoteMethod('')
			this.mainLoading = this.$loading({text:'拼命加载中...'});
			if(this.id) { // 修改
				getModuleData( this.id, 1 ).then( data => {
					this.mainLoading.close();
					this.moduleDataAddDto = data.data;
				})
			}else {
				getModelList().then( data => {
					this.mainLoading.close();
					data.data.forEach( val => {
						this.moduleInfos[val.moduleName] = val;
					});
					this.moduleDataAddDto.generalInfoList = this.moduleInfos['原料'].generalInfoList;
				} )
			}
		},
		methods: {
			submitForm() {
				// 给 原料的类型
				this.moduleDataAddDto.type = 1;
				// 给 原料的名称
				this.moduleDataAddDto.moduleName = this.moduleDataAddDto.generalInfoList[0].value || '原料';
				// 给 外部链接
				let external = document.getElementById('link').value;
				if( external ) this.moduleDataAddDto.externalQuoteList.push( {externalName: external, externalURL: external} );
				if( this.id ) {
					editModuleData(this.moduleDataAddDto).then( data => {
						this.$message.success('修改成功');
						this.$router.go(-1);
					})
				}else {
					addModuleData(this.moduleDataAddDto).then( data => {
						this.$message.success('添加成功');
						this.$router.go(-1);
					})
				}
			},
			// 上传图片相关
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
			async uploadFile(params) {
				let data = await uploadImg(params.file);
				if( !data ) return;
				this.moduleDataAddDto.imgUrlList.push( {'name': data.data.fileUrl, 'url': data.data.fileUrl} )
			},
			async uploadBaseFile(params) {
				let data = await uploadFileDemo(params.file)
			},
			// 下拉框处理
			handleShow(val) {
                let dom = document.querySelectorAll('.demo-ruleForm .el-select-dropdown__wrap')[0];
                if( val == false ) {
                    dom.removeEventListener('scroll', this.loadMore);
                }else {
                    setTimeout(()=>{
                        dom.addEventListener('scroll', this.loadMore);
                    },200)
                }
			},
			// 最外层 赋值 企业名称  讲道理应该是 企业 编码
			handleChange(code) {
				this.options.forEach( val => {
					if( val.uniqueCode == code ) {
						this.moduleDataAddDto.enterpriseSelectName = val.enterpriseName;
					}
				})
			},
			loadMore() {
                scrollMore('.code-bottom .el-select-dropdown__wrap', () => {
                    if( !this.isRemote ) {
                        this.optionsPage++;
                        if( this.optionsPage > this.optionsPageCount ) {
                            this.$message('没用更多数据了')
                            return;
                        }
                        this.remoteMethod(this.optionsLinkParams, this.optionsPage);
                    }
                })
            },
			remoteMethod(query, page) {
                if( !page ) this.optionsPage = 1;
                if( this.optionsPage == 1 ) this.options = [];
                this.optionsLinkParams = query;
                this.isRemote = true;
                this.loading = true;
                getFactoryList(this.optionsLinkParams, this.optionsPage, 1).then(data => {
                    this.optionsPageCount = data.data.pageCount;
                    this.options = this.options.concat(data.data.enterpriseInfoTwoOneResponseList);
                    this.loading = false;
                    this.isRemote = false;
                })
			},
			// 数据接入
			dataUploadSure(code) {
				this.isDataUpload = false;
				this.mainLoading = this.$loading({text:'拼命加载中...'});
				getModuleData( code, 1 ).then( data => {
					this.mainLoading.close();
					this.moduleDataAddDto = data.data;
					this.moduleDataAddDto.moduleUniqueCode = code;
				})
			},
			dataUploadCancel() {
				this.isDataUpload = false;
			},
			handleClose() {
				this.isDataUpload = false;
			}
		},
    }
</script>

<style lang="scss" scoped>
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