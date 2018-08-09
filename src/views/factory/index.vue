<template>
    <div>
        <div class="title">企业信息</div>
        <div class="container">
            <div class="title2">企业信息填写</div>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="200px" class="demo-ruleForm">
				<el-row>
					<el-col :span="10">
						<el-form-item label="企业名称 :" prop="enterpriseName">
							<el-input autofocus="true" v-model="ruleForm.enterpriseName"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="10">
						<el-form-item label="企业地址 : ">
							<el-input v-model="ruleForm.address"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="10">
						<el-form-item label="企业地址 : ">
							<el-select v-model="ruleForm.provincesId" placeholder="省" @change="provCnChange" class="country">
								<el-option
								v-for="item in provCnList"
								:key="item.areaInfoId"
								:label="item.nameCn"
								:value="item.areaInfoId">
								</el-option>
							</el-select>
							<el-select v-model="ruleForm.cityId" placeholder="市" @change="cityCnChange" class="country">
								<el-option
								v-for="item in cityCnList"
								:key="item.areaInfoId"
								:label="item.nameCn"
								:value="item.areaInfoId">
								</el-option>
							</el-select>
							<el-select v-model="ruleForm.countyId" placeholder="区" @change="countyCnChange" class="country">
								<el-option
								v-for="item in countyCnList"
								:key="item.areaInfoId"
								:label="item.nameCn"
								:value="item.areaInfoId">
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="10">
						<el-form-item label="负责人 : ">
							<el-input v-model="ruleForm.chargePerson"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="10">
						<el-form-item label="统一社会信用代码 : ">
							<el-input v-model="ruleForm.creditCode"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="10">
						<el-form-item label="企业logo : " style="position:absolute; z-index:99999;">
							<el-upload
								class="avatar-uploader"
								action=""
								:before-upload="uploadFile"
								:show-file-list="false"
								>
								<img v-if="ruleForm.logoImgUrl" :src="ruleForm.logoImgUrl" class="avatar">
								<i v-else class="el-icon-plus avatar-uploader-icon"></i>
							</el-upload>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="10">
						<el-form-item label="企业简介 : " prop="description">
							<el-input type="textarea" :rows="5" v-model="ruleForm.description" placeholder="最多输入1000字"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
        </div>
		<div class="footer">
			<el-button type="primary" size="small" @click="submitForm('ruleForm')">确认</el-button>
		</div>
    </div>
</template>

<script>
	import axios from 'axios'
	import { addFactoryInfo, editFactoryInfo, getCountry, getFactoryInfo } from '@/api/login';
	import { isImg } from '@/utils'
	import { setFactory } from '@/utils/auth'
    export default {
        data() {
            return {
                ruleForm: {
					enterpriseName: '',// 企业名称
					address: '', // 企业地址
					provCn: '', //省
					provincesId: '', //省 ID
					cityCn: '', //市名称
					cityId: '', //市 ID
					countyCn: '', // 县名称
					countyId: '', //县 ID
					chargePerson: '', //负责人
					creditCode: '', //企业信用编码
					logoImgUrl: '', //企业logo
					description: '', // 企业简介
				},
				rules: {
					enterpriseName: [
						{ required: true, message: '请输入企业名称', trigger: 'blur' },
					],
					description:[
						{max: 1000, message: '最多输入 1000 字'}
					]
				},
				provCnList: [],
				cityCnList:[],
				countyCnList:[],
            }
		},
		computed: {
			factoryId: function () {
				return this.$store.state.user.factoryId
			}
		},
		mounted() {
			if( Number(this.factoryId) ) {
				getFactoryInfo(this.factoryId).then( data => {
					this.ruleForm = data.data;
					if( data.data.cityId == 0 ) this.ruleForm.cityId = '';
					if( data.data.countyId == 0 ) this.ruleForm.countyId = '';
					if( data.data.provincesId == 0 ) this.ruleForm.provincesId = '';
					getCountry(0).then( data => {
						this.provCnList = data.data;
					})
					if( this.ruleForm.provincesId ) {
						getCountry(this.ruleForm.provincesId).then( data => {
							this.cityCnList = data.data;
						})
					}
					if( this.ruleForm.cityId ) {
						getCountry(this.ruleForm.cityId).then( data => {
							this.countyCnList = data.data;
						})
					}
				})
			}else {
				getCountry(0).then( data => {
					this.provCnList = data.data;
				})
			}
		},
		methods: {
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
				if (valid) {
					if( Number(this.factoryId) ){ // 有企业
						this.ruleForm.enterpriseInfoId = Number( this.factoryId )
						editFactoryInfo(this.ruleForm).then( data => {
							this.$message.success('修改成功');
							this.$router.push({name: 'Resume'})
						});
					}else {
						addFactoryInfo(this.ruleForm).then( data => {
							let id = data.data.enterpriseInfoResponseDTO.enterpriseInfoId
							// 企业 ID 存入 store
							this.$store.commit('SET_FACTORY', id);
							setFactory(id);
							this.$message.success('添加成功');
							this.$router.push({name: 'Resume'})
						});
					}
				} else {
					console.log('error');
					return false;
				}
				});
			},
			countryMap(val, arr) {
				let obj = {};
				obj = arr.find((item)=>{
					return item.areaInfoId === val;
				});
				return obj.nameCn;
			},
			provCnChange(val) {
				this.ruleForm.provCn = this.countryMap(val, this.provCnList);
				getCountry(val).then( data => {
					this.cityCnList = data.data;
					this.countyCnList = [];
					this.ruleForm.cityCn = '';
					this.ruleForm.cityId = '';
					this.ruleForm.countyCn = '';
					this.ruleForm.countyId = '';
				})
			},
			cityCnChange(val) {
				this.ruleForm.cityCn = this.countryMap(val, this.cityCnList);
				getCountry(val).then( data => {
					this.countyCnList = data.data;
					this.ruleForm.countyCn = '';
					this.ruleForm.countyId = '';
				})
			},
			countyCnChange(val) {
				this.ruleForm.countyCn = this.countryMap(val, this.countyCnList);
			},
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
                         this.ruleForm.logoImgUrl = res.data.data.fileUrl;
                     }else{
                        this.$message({
                            message:res.data.msg,
                            type:'error'
                        })
                    }
                 })
                return false;
            },
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