<template>
    <div>
        <div class="container" v-if="tab != 'zz' && tab != 'jg'">
            <div class="title2">添加{{tabName}}信息</div>
            <el-form label-width="200px" class="demo-ruleForm">
				<el-row>
					<el-col :span="( item.dataType == 10 || item.dataType == 9 || item.dataType == 8) ? 22 : 11 "
						v-for="(item, index) in moduleDataAddDto.generalInfoList"
						:key="index">
						<el-form-item v-if="item.dataType == 3 || item.dataType == 4" :label="item.label + ' : '">
							<el-date-picker
                                size="small"
                                style="width:100%;"
                                value-format="timestamp"
                                :editable="false"
                                type="date"
                                v-model="item.value">
                            </el-date-picker>
						</el-form-item>
						<el-form-item v-else-if="item.dataType == 5 || item.dataType == 6" :label="item.label + ' : '">
                            <el-date-picker
                                size="small"
                                v-model="item.value"
                                type="daterange"
                                :editable="false"
                                value-format="timestamp"
                                range-separator="至"
                                start-placeholder="开始"
                                end-placeholder="结束">
                            </el-date-picker>
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
                                    :label="item.enterpriseName"
									:value="item.uniqueCode">
								</el-option>
							</el-select>
						</el-form-item>
						<!-- textarea -->
						<el-form-item v-else-if="item.dataType == 10" :label="item.label + ' : '">
							<el-input type="textarea" :rows="5" v-model="item.value" placeholder="最多输入1000字"></el-input>
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
                <!-- 引用外部链接 -->
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="引用外部链接 :">
                            <el-button type="primary" size="small" @click="handleOuterLink(moduleDataAddDto, '1')">
                                <img class="outer-link-icon" src="@/assets/images/v2/outer-link-icon.png" alt="">
                                引用外部链接
                            </el-button>
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
                    <el-col :span="22">
                        <el-form-item label="本地文档上传 :">
                            <el-button type="primary" size="small" @click="handleInnerDoc(moduleDataAddDto, '1')">
                                <img class="outer-link-icon" src="@/assets/images/v2/get-upload.png" alt="">
                                选择本地文档
                            </el-button>
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
        <div class="container" v-else-if="tab == 'zz' || tab == 'jg'">
            <div class="title2">添加{{tabName}}信息</div>
            <div class="tabs-container">
                <div class="right-data">
                    <!-- 文档上传 -->
                    <el-button type="primary" size="small">
                        <img class="outer-link-icon" src="@/assets/images/v2/get-upload.png" alt="">
                        选择本地文档
                    </el-button>
                    <!-- 数据接入 -->
                    <el-button type="primary" size="small" @click="isDataUpload = true">
                        <img class="outer-link-icon" src="@/assets/images/v2/get-icon.png" alt="">
                        选择数据接入
                    </el-button>
                </div>
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
                            <el-form label-width="200px" class="demo-ruleForm" v-if="moduleDataAddDto.subModelInfoList.length > 0">
                                <el-row>
                                    <el-col :span="( item.dataType == 10 || item.dataType == 9 || item.dataType == 8) ? 22 : 11 "
                                        v-for="(item, index) in item0.generalInfoList"
                                        :key="index">
                                        <el-form-item v-if="item.dataType == 3 || item.dataType == 4" :label="item.label + ' : '">
                                            <el-date-picker
                                                size="small"
                                                style="width:100%;"
                                                value-format="timestamp"
                                                :editable="false"
                                                type="date"
                                                v-model="item.value">
                                            </el-date-picker>
                                        </el-form-item>
                                        <el-form-item v-else-if="item.dataType == 5 || item.dataType == 6" :label="item.label + ' : '">
                                            <el-date-picker
                                                size="small"
                                                style="width:100%;"
                                                v-model="item.value"
                                                type="daterange"
                                                :editable="false"
                                                value-format="timestamp"
                                                range-separator="至"
                                                start-placeholder="开始"
                                                end-placeholder="结束">
                                            </el-date-picker>
                                        </el-form-item>
                                        <!-- 下拉框处理 -->
                                        <el-form-item v-else-if="item.dataType == 7 && item.label.indexOf('企业') != -1" :label="item.label + ' : '">
                                            <el-select
                                                :popper-append-to-body="false"
                                                @visible-change="handleShow"
                                                @change="handleChange2"
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
                                                    :label="item.enterpriseName"
                                                    :value="item.uniqueCode">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item v-else-if="item.dataType == 7 && item.label.indexOf('来源') != -1" :label="item.label + ' : '">
                                        <el-select
                                            style="width:100%"
                                            placeholder="请选择"
                                            size="small"
                                            v-model="item.value">
                                            <el-option
                                                v-for="item in options2"
                                                :key="item.label"
                                                :value="item.value">
                                            </el-option>
                                        </el-select>
                                        </el-form-item>
                                        <!-- textarea -->
                                        <el-form-item v-else-if="item.dataType == 10" :label="item.label + ' : '">
                                            <el-input type="textarea" :rows="5" v-model="item.value" placeholder="最多输入1000字"></el-input>
                                        </el-form-item>
                                        <!-- 上传图片 -->
                                        <el-form-item v-else-if="item.dataType == 9"
                                            :label="item.label + ' : '"
                                            style="z-index:99;">
                                            <el-upload
                                                action=""
                                                :before-upload="beforeUpload"
                                                :http-request="uploadFile1"
                                                :on-remove="removeUpload1"
                                                list-type="picture-card"
                                                :file-list="moduleDataAddDto.subModelInfoList[activeIndex].imgUrlList ? moduleDataAddDto.subModelInfoList[activeIndex].imgUrlList : []"
                                                >
                                                <i class="el-icon-plus"></i>
                                                </el-upload>
                                        </el-form-item>
                                        <el-form-item v-else :label="item.label + ' : '">
                                            <el-input v-model="item.value" size="small"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <!-- 引用外部链接 -->
                                <el-row>
                                    <el-col :span="22">
                                        <el-form-item label="引用外部链接 :">
                                            <el-button type="primary" size="small" @click="handleOuterLink(item0, '2')">
                                                <img class="outer-link-icon" src="@/assets/images/v2/outer-link-icon.png" alt="">
                                                引用外部链接
                                            </el-button>
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
                                    <div class="delete" @click="deleteFarm(item0, index1)">
                                        <i class="el-icon-delete"></i>
                                    </div>
                                </div>
                                <!-- 同上 -->
                                <el-form label-width="200px" class="demo-ruleForm" v-if="moduleDataAddDto.subModelInfoList[activeIndex].subModelInfoInfoList">
                                    <el-row>
                                        <el-col :span="( item.dataType == 10 || item.dataType == 9 || item.dataType == 8) ? 22 : 11 "
                                            v-for="(item, index) in item1.generalInfoList"
                                            :key="index">
                                            <el-form-item v-if="item.dataType == 3 || item.dataType == 4" :label="item.label + ' : '">
                                                <el-date-picker
                                                    size="small"
                                                    style="width:100%;"
                                                    value-format="timestamp"
                                                    :editable="false"
                                                    type="date"
                                                    v-model="item.value">
                                                </el-date-picker>
                                            </el-form-item>
                                            <el-form-item v-else-if="item.dataType == 5 || item.dataType == 6" :label="item.label + ' : '">
                                                <el-date-picker
                                                    size="small"
                                                    style="width:100%;"
                                                    v-model="item.value"
                                                    type="daterange"
                                                    :editable="false"
                                                    value-format="timestamp"
                                                    range-separator="至"
                                                    start-placeholder="开始"
                                                    end-placeholder="结束">
                                                </el-date-picker>
                                            </el-form-item>
                                            <!-- textarea -->
                                            <el-form-item v-else-if="item.dataType == 10" :label="item.label + ' : '">
                                                <el-input type="textarea" :rows="5" v-model="item.value" placeholder="最多输入1000字"></el-input>
                                            </el-form-item>
                                            <!-- 上传图片 -->
                                            <el-form-item v-else-if="item.dataType == 9" :label="item.label + ' : '" style="z-index:99;">
                                                <div @click="conso(index1)">
                                                    <el-upload
                                                        action=""
                                                        :before-upload="beforeUpload"
                                                        :http-request="uploadFile2"
                                                        :on-remove="removeUpload2"
                                                        list-type="picture-card"
                                                        :file-list="moduleDataAddDto.subModelInfoList[activeIndex].subModelInfoInfoList[index1].imgUrlList ?
                                                                    moduleDataAddDto.subModelInfoList[activeIndex].subModelInfoInfoList[index1].imgUrlList : []"
                                                        >
                                                        <i class="el-icon-plus"></i>
                                                    </el-upload>
                                                </div>
                                            </el-form-item>
                                            <el-form-item v-else :label="item.label + ' : '">
                                                <el-input v-model="item.value" size="small"></el-input>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                </el-form>
                            </div>
                            <div class="add-farm" @click="addFarm(item0, tabName)"> <i class="el-icon-plus"></i> 新增</div>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
		<div class="footer">
			<el-button type="primary" size="small" @click="submitForm" style="margin:20px;">保存</el-button>
            <router-link :to="{name: 'collectionMaterial'}">
                <el-button size="small">取消</el-button>
            </router-link>
		</div>
        <!-- 外部链接 -->
        <outer-link
            v-if="outerLinkDialog"
            :outerData="outerData"
            :outerLinkDialog="outerLinkDialog"
            @outerLinkDialogSure="outerLinkDialogSure"
            @outerLinkDialogCancel="outerLinkDialogCancel"
            @handleClose="handleClose"
        >
        </outer-link>
        <!-- 数据接入 -->
        <data-upload
			v-if="isDataUpload"
			@dataUploadSure="dataUploadSure"
			@dataUploadCancel="dataUploadCancel"
			@handleClose="handleClose"
			:isDataUpload="isDataUpload"
			:type="tabId">
		</data-upload>
    </div>
</template>

<script>
    import OuterLink from '@/components/v2/collection/OuterLink'
    import DataUpload from '@/components/v2/collection/DataUpload'

    import { getModelList, getModuleData, getFactoryList, addModuleData, editModuleData } from '@/api/v2'
    import { isImg, scrollMore, deepClone } from '@/utils'
    import { uploadImg } from '@/utils/upload'
    import { deleteUrl } from '@/utils/v2'
    export default {
        components: { OuterLink, DataUpload },
        data() {
            return {
                activeIndex: '0',
                isDataUpload: false, // 数据接入开关
                outerLinkDialog: false, // 外部链接开关
                outerData: [], //外部链接传值
                outerLinkIndex: '', // 区分普通 1  特殊 2   数据接入不用这个 因为就在最外层
                loading: false,
                mainLoading: false,
                moduleInfos: {},
                // 最终上传的数据
                moduleDataAddDto: {
                    enterpriseSelectName: '', //下拉框企业名称
                    externalQuoteList: [{'externalName': '', 'externalURL': ''}], //外部引用
                    generalInfoList: [], //基本信息
                    subModelInfoList: [], // 种植 加工用
                    moduleName: '',  //模块名称
                    moduleUniqueCode: '', // 接入数据编码
                    imgUrlList: [], // 产品图片
                    videoUrlList: [], //视频
                    type: null, //类型
                },
                options2:[{label: 1, value: '自繁'}, {label: 2, value: '外采'}],
                options: [],
                isRemote: false, // 下拉框是否在 请求数据
                optionsPage: 1, // 当前页数
                optionsPageCount: 0, // 总共页数
                optionsLinkParams: '', // 搜索条件

                lastIndex: 0, // 多步骤触发条件
                tjModule:{}, // 田间增加内容
                jgModule: {}, // 加工增加内容
            }
        },
        computed: {
            tab: function() {
                return this.$route.query.tab
            },
            tabName: function() {
                return this.$route.query.tabName
            },
            tabId: function() {
                return this.$route.query.tabId
            },
            id: function() { // 数据编码id
                return this.$route.query.id
            }
        },
        mounted() {
            this.mainLoading = this.$loading({text:'拼命加载中...'});
            this.remoteMethod();// 获取企业列表
            getModelList().then( data => {
                data.data.forEach( val => {
                    this.moduleInfos[val.moduleName] = val;
                });
                if( !this.id ) {
                    this.moduleDataAddDto.generalInfoList = this.moduleInfos[this.tabName].generalInfoList;
                    this.moduleDataAddDto.subModelInfoList = this.moduleInfos[this.tabName].subModelInfoList;
                }
                let tjModule = deepClone(this.moduleInfos['种植'].subModelInfoList[2].subModelInfoInfoList[0])
                this.tjModule = tjModule;
                let jgModule = deepClone(this.moduleInfos['加工'].subModelInfoList[1].subModelInfoInfoList[0]);
                this.jgModule = jgModule;
                this.mainLoading.close();
            })
            if( this.id ) {
                // 下面还有一个 调用此方法
                getModuleData( this.id, this.tabId ).then( data => {
                    this.moduleDataAddDto = data.data;
                    // string -> array
                    this.moduleDataAddDto.generalInfoList && this.moduleDataAddDto.generalInfoList.forEach( val => {
                        if( val.value && val.value.indexOf('-_-') != -1 ) val.value = val.value.split('-_-');
                    })
                    this.moduleDataAddDto.subModelInfoList && this.moduleDataAddDto.subModelInfoList.forEach( val1 => {
                        val1.generalInfoList && val1.generalInfoList.forEach( val2 => {
                            if( val2.value && val2.value.indexOf('-_-') != -1 ) val2.value = val2.value.split('-_-');
                        })
                        val1.subModelInfoInfoList && val1.subModelInfoInfoList.forEach( val4 => {
                            val4.generalInfoList && val4.generalInfoList.forEach( val4 => {
                                if( val4.value && val4.value.indexOf('-_-') != -1 ) val4.value = val4.value.split('-_-');
                            })
                        })
                    })
                    this.mainLoading.close();
                })
            }
        },
        methods: {
            // 看 点的是哪个步骤
            conso(a) {
                this.lastIndex = a;
            },
            // 保存
            submitForm() {
                this.moduleDataAddDto.type = Number(this.tabId);
                this.moduleDataAddDto.moduleName = this.tabName;
                // if( this.tab != 'zz' && this.tab != 'jg' ) {
                //     this.moduleDataAddDto.moduleName = this.moduleDataAddDto.generalInfoList[0].value || '';
                // }

                // array => string
                this.moduleDataAddDto.generalInfoList && this.moduleDataAddDto.generalInfoList.forEach( val => {
                    if( Array.isArray(val.value) ) val.value = val.value.join('-_-');
                })
                this.moduleDataAddDto.subModelInfoList && this.moduleDataAddDto.subModelInfoList.forEach( val1 => {
                    val1.generalInfoList && val1.generalInfoList.forEach( val2 => {
                        if( Array.isArray(val2.value) ) val2.value = val2.value.join('-_-');
                    })
                    val1.subModelInfoInfoList && val1.subModelInfoInfoList.forEach( val4 => {
                        val4.generalInfoList && val4.generalInfoList.forEach( val4 => {
                            if( Array.isArray(val4.value) ) val4.value = val4.value.join('-_-');
                        })
                    })
                })
				if( this.id ) {
					editModuleData(this.moduleDataAddDto).then( data => {
						this.$message.success('修改成功');
                        //this.$router.go(-1);
                        this.$router.push({name: 'collectionProcess', query:{tab: this.tab, tabId: this.tabId, tabName: this.tabName}});
					})
				}else {
					addModuleData(this.moduleDataAddDto).then( data => {
						this.$message.success('添加成功');
                        //this.$router.go(-1);
                        this.$router.push({name: 'collectionProcess', query:{tab: this.tab, tabId: this.tabId, tabName: this.tabName}});

					})
				}
            },
            addFarm(item, name) {
                var clone;
                if( name == '种植' ) { clone = deepClone(this.tjModule)}
                else { clone = deepClone(this.jgModule)}
                item.subModelInfoInfoList.push(clone);
            },
            deleteFarm(item, index) {
                item.subModelInfoInfoList.splice(index, 1)
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
            handleChange2(code) {
				this.options.forEach( val => {
					if( val.uniqueCode == code ) {
						this.moduleDataAddDto.subModelInfoList[0].enterpriseSelectName = val.enterpriseName;
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
            // 上传图片相关
            removeUpload(file, fileList) {
				this.moduleDataAddDto.imgUrlList = deleteUrl(file.url, this.moduleDataAddDto.imgUrlList)
			},
            removeUpload1(file, fileList) {
                this.moduleDataAddDto.subModelInfoList[this.activeIndex].imgUrlList = deleteUrl(file.url, this.moduleDataAddDto.subModelInfoList[this.activeIndex].imgUrlList);
			},
            removeUpload2(file, fileList) {
                this.moduleDataAddDto.subModelInfoList[this.activeIndex].subModelInfoInfoList[this.lastIndex].imgUrlList =
                deleteUrl(file.url, moduleDataAddDto.subModelInfoList[this.activeIndex].subModelInfoInfoList[this.lastIndex].imgUrlList);
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
            // 0 普通  1 种植 加工 普通 2 种植 加工 添加步骤
			async uploadFile(params) {
				let data = await uploadImg(params.file);
				if( !data ) return;
				this.moduleDataAddDto.imgUrlList.push( {'name': data.data.fileUrl, 'url': data.data.fileUrl} )
            },
			async uploadFile1(params) {
				let data = await uploadImg(params.file);
                if( !data ) return;
                if( !this.moduleDataAddDto.subModelInfoList[this.activeIndex].imgUrlList ) this.moduleDataAddDto.subModelInfoList[this.activeIndex].imgUrlList = [];
				this.moduleDataAddDto.subModelInfoList[this.activeIndex].imgUrlList.push( {'name': data.data.fileUrl, 'url': data.data.fileUrl} )
            },
			async uploadFile2(params) {
				let data = await uploadImg(params.file);
                if( !data ) return;
                if( !this.moduleDataAddDto.subModelInfoList[this.activeIndex].subModelInfoInfoList[this.lastIndex].imgUrlList ) this.moduleDataAddDto.subModelInfoList[this.activeIndex].subModelInfoInfoList[this.lastIndex].imgUrlList = [];
				this.moduleDataAddDto.subModelInfoList[this.activeIndex].subModelInfoInfoList[this.lastIndex].imgUrlList.push( {'name': data.data.fileUrl, 'url': data.data.fileUrl} )
            },
            // 外部链接
            outerLinkDialogSure() {
                let clone = deepClone(this.outerData);
                if( this.outerLinkIndex == 1 ) {
                    this.moduleDataAddDto.externalQuoteList = clone;
                }else if( this.outerLinkIndex == 2 ){
                    this.moduleDataAddDto.subModelInfoList[this.activeIndex].externalQuoteList = clone;
                }
                this.outerLinkDialog = false;
            },
            outerLinkDialogCancel(list) {
                let clone = deepClone(list);
                if( this.outerLinkIndex == 1 ) {
                    this.moduleDataAddDto.externalQuoteList = clone;
                }else if( this.outerLinkIndex == 2 ){
                    this.moduleDataAddDto.subModelInfoList[this.activeIndex].externalQuoteList = clone;
                }
                this.outerLinkDialog = false;
            },
            handleClose() {
                this.outerLinkDialog = false;
                this.isDataUpload = false;
            },
            handleOuterLink(data, index) {
                this.outerLinkIndex = index;
                this.outerLinkDialog = true;
                this.outerData = data.externalQuoteList;
                if( !this.outerData || this.outerData.length == 0 ) {
                    this.outerData = [{'externalName': '', 'externalURL': ''}];
                }
            },
            // 数据接入
            handleInnerDoc() {
                this.isDataUpload = true;
            },
            dataUploadSure(code) {
                this.isDataUpload = false;
                this.mainLoading = this.$loading({text:'拼命加载中...'});
                getModuleData( code, this.tabId ).then( data => {
                    this.moduleDataAddDto = data.data;
                    // string -> array
                    this.moduleDataAddDto.generalInfoList && this.moduleDataAddDto.generalInfoList.forEach( val => {
                        if( val.value && val.value.indexOf('-_-') != -1 ) val.value = val.value.split('-_-');
                    })
                    this.moduleDataAddDto.subModelInfoList && this.moduleDataAddDto.subModelInfoList.forEach( val1 => {
                        val1.generalInfoList && val1.generalInfoList.forEach( val2 => {
                            if( val2.value && val2.value.indexOf('-_-') != -1 ) val2.value = val2.value.split('-_-');
                        })
                        val1.subModelInfoInfoList && val1.subModelInfoInfoList.forEach( val4 => {
                            val4.generalInfoList && val4.generalInfoList.forEach( val4 => {
                                if( val4.value && val4.value.indexOf('-_-') != -1 ) val4.value = val4.value.split('-_-');
                            })
                        })
                    })
                    this.moduleDataAddDto.moduleUniqueCode = code;
                    this.mainLoading.close();
                })
            },
            dataUploadCancel() {
                this.isDataUpload = false;
            }
        },
    }
</script>

<style lang="scss" scoped>
    @import '../../styles/mixin';
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
    .tabs-container {
        width: 96%;
        margin-left: 20px;
        position: relative;
        .right-data {
            position: absolute;
            top: 0px;
            right: 20px;
            z-index: 999;
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
        position: relative;
        margin: 10px 32px 10px 20px;
        color: #409EFF;
        height: 36px;
        .line {
            height: 1px;
            min-width: 86%;
            background: #409EFF;
            margin-top: 9px
        }
        .farm-index {
            padding: 0 10px;
            width: 96px;
            text-align: center;
            display: inline-block;
        }
        .delete {
            position: absolute;
            top: -4px;
            right: 18px;
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