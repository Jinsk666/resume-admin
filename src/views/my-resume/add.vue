<template>
    <div class="add-container" v-show="isLoadingEnd">
        <!-- <theme-picker></theme-picker> -->
        <!-- <div id="container">
            <div id="selectfiles" class="btn-op borderright">
				换图
			</div>
			<div id="ossfile1"></div>
			<a style="display: none" id="postfiles1" href="javascript:void(0);" onclick="apply(18);"></a>
			<a style="display: none" id="callback" href="javascript:void(0);" onclick="callback();"></a>
			<input type="hidden" id="commentFileUrl" name="commentFileUrl" />
        </div> -->
        <div class="phone-container">
            <main-phone
                @editStep="editStep"
                @clickBase="clickBase"
                @addLastStep="addLastStep"
                @handleCommand="handleCommand"
                >
            </main-phone>
        </div>
        <div style="display:none;" class="left-container" :class="{'left-active': isLeftActive}">
            <div class="toggle-item" @click="isLeftActive = !isLeftActive">
                <img v-if="!isLeftActive" src="@/assets/images/left-arrow.png" alt="">
                <img v-else src="@/assets/images/right-arrow.png" alt="">
            </div>
            <div class="left-tabs">
                <el-tabs type="border-card">
                    <!-- 手机展示主题 -->
                    <el-tab-pane label="风格设置">
                        <div class="theme-container">
                            <span
                                v-for="(item, index) in themeColor"
                                :key="index"
                                :style="{background: item.color}"
                                @click="handleTheme(item.name)"
                                class="round">

                            </span>
                        </div>
                    </el-tab-pane>
                    <!-- 显示隐藏 以及 位置 -->
                    <el-tab-pane label="模块设置">
                        <ul class="is-more">
                            <li
                                class="clearfix"
                                v-for="(item, index) in stroeData.moduleInfos"
                                v-dragging="{ item: item, list: stroeData.moduleInfos, group: 'stroeData' }"
                                :key="index">
                                <div class="left name">
                                    <span>{{item.moduleName}}</span>
                                </div>
                                <div class="left display">
                                    <el-switch
                                        v-model="item.display"
                                        active-value=1
                                        inactive-value=0
                                        active-color="#45BC9c"
                                        inactive-color="#CDCDCD">
                                    </el-switch>
                                </div>
                            </li>
                        </ul>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
        <div class="right-container">
            <div class="top-btn">
                <el-button type="primary" size="small" @click="saveData">保 存</el-button>
                <el-button type="primary" size="small" plain @click="cancelData">取 消</el-button>
            </div>
            <div class="add-list">
                <div
                    :class="{active: productModuleIndex == -1}"
                    class="product-btn"
                    @click="handleProductModule">{{productInfo.productName || '产品模版'}}</div>
                <div
                    class="ellipsis material-list"
                    :class="{active: productModuleIndex == index}"
                    v-if="productInfo.productInfos.length > 0"
                    v-for="(item, index) in productInfo.productInfos"
                    :key="index"
                    :title="item.productName"
                    @click="handleMaterialModule(index)"
                    @mouseover="mouseoverMaterialIndex = index"
                    @mouseout="mouseoverMaterialIndex = -1">
                    <span>{{item.productName}}</span>
                    <span
                        @click.stop="deleteMaterial(index)"
                        v-show="mouseoverMaterialIndex == index"
                        class="el-icon-circle-close material-close">
                    </span>
                </div>
                <div class="add-material" @click="addMaterial">
                    <svg-icon icon-class="add"></svg-icon>
                    添加原料页
                </div>
            </div>
        </div>
        <!-- 基本信息 -->
        <base-dialog
            :baseDialog="baseDialog"
            @baseDialogSure="baseDialogSure"
            @baseDialogCancel="baseDialogCancel"
            @handleClose="handleClose"
            >
        </base-dialog>
        <!-- 步骤弹出框 -->
        <step-dialog
            :stepDialog="stepDialog"
            @handleClose="handleClose"
            @stepDialogSure="stepDialogSure"
            @stepDialogCancel="stepDialogCancel"
            @addStepDialogSure="addStepDialogSure"
            @deleteStep="deleteStep"
            >
        </step-dialog>
        <!-- 填写原料弹出框 -->
        <el-dialog
            title="添加原料名称"
            :visible.sync="materialDialog"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            width="548px">
            <div class="material-container">
                <div class="materal-img">
                    <img src="@/assets/images/add-ma.png" alt="原料">
                </div>
                <h3>添加原料名称</h3>
                <el-input v-model="materialName" autofocus="true" placeholder="请填写原料名称"></el-input>
                <h3 class="add-entry" @click="addMaterialSure">立即填写更多原料信息</h3>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="materialDialogSure" size="small">确 定</el-button>
                <el-button @click="materialDialog = false" size="small">取 消</el-button>
            </span>
        </el-dialog>
        <!-- 填写原料外链弹出框 -->
        <el-dialog
            title="添加生产流程"
            :visible.sync="outerMaterialDialog"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            width="548px">
            <div class="material-container">
                <div class="materal-img">
                    <img src="@/assets/images/outer-link.png" alt="原料">
                </div>
                <h3>引用外部链接</h3>
                <el-input style="width:200px;" v-model="outerMaterialName" autofocus="true" placeholder="请输入商品名称"></el-input>
                <el-input style="width:300px;" v-model="outerMaterialUrl" placeholder="请输入URL 例如: https://www.***.com"></el-input>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="outerMaterialDialog = false" size="small">取 消</el-button>
                <el-button type="primary" @click="outerMaterialDialogSure" size="small">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import { ContainerMixin, ElementMixin } from 'vue-slicksort'
    import MainPhone from '@/components/MainPhone'
    import StepDialog from '@/components/StepDialog'
    import BaseDialog from '@/components/BaseDialog'
    //import ThemePicker from "@/components/ThemePicker";
    import { deepClone, Step2Class } from '@/utils'
    import { getTemplateModule, addResume, editResume, getResumeDetails } from '@/api'
    export default {
        components: {/* ThemePicker, */  MainPhone, StepDialog, BaseDialog },
        data() {
            return {
                themeColor: [{color: '#45BC9C', name: 'theme1'}, {color: '#00ACE9', name: 'theme2'}, {color: '#4A90E2', name: 'theme3'}, {color: '#5DBA19', name: 'theme4'}, {color: '#FFD117', name: 'theme5'}],
                mouseoverMaterialIndex: -1,
                loading: '',
                isLoadingEnd: false, //手机显示开关 第一个接口加载完毕是临界点
                noEditData: {}, //每次都存入 页面刚进来的数据 取消的时候使用
                productModuleIndex: -1, // 右侧点击样式
                moduleInfos: {}, // 各个步骤的 数据模版
                // 最终上传的数据
                productInfo: {
                    productName: '',//产品名称
                    imgUrl: '', // 产品图片
                    backColor: '', //皮肤
                    templateCode: '', //模板
                    uniqueCode: '', // 唯一编码
                    generalInfoList:[], //产品字段
                    // 产品流程
                    moduleInfos:[],
                    // 原料列表
                    productInfos:[],
                    productImportList: [], // 原料外链接
                },
                // 基本原料
                material: {
                    productName: '原料',
                    imgUrl: '',
                    generalInfoList: [],
                    moduleInfos: []
                },
                addStepIndex: 0, //添加步骤的下标
                baseStep: ['采购','种植','采收', '仓储', '加工', '包装', '检测'],
                baseDialog: false, // 基本信息弹出框
                stepDialog: false, // 添加步骤弹出框
                materialDialog: false, // 原料名称弹出框
                outerMaterialDialog: false, //
                materialName: '', // 新添加的原料名称
                outerMaterialName: '',// 原料 名称
                outerMaterialUrl: '', // 原料 url
                isLeftActive: false, // 左侧 toggle
            }
        },
        computed: {
            stepData() {
                return this.$store.state.app.stepData
            },
            stepDataClone() {
                return this.$store.state.app.stepDataClone
            },
            isMaterial() {
                return this.$store.state.app.isMaterial
            },
            accordionIndex() {
                return this.$store.state.app.accordionIndex
            },
            stroeData: {
                get: function() {
                    if( this.$store.state.app.isMaterial === false ){
                        return this.productInfo
                    }else {
                        return this.productInfo.productInfos[this.$store.state.app.isMaterial]
                    }
                },
                set: function(newValue) {
                    if( this.$store.state.app.isMaterial === false ){
                        this.productInfo = newValue;
                    }else {
                        this.productInfo.productInfos[this.$store.state.app.isMaterial] = newValue;
                    }
                }
            },
            isEdit() {
                return this.$route.query.code
            }
        },
        mounted() {
            // let rootDom = document.querySelectorAll('.menu-wrapper')[0];
            // rootDom.querySelector('.el-menu-item').classList.add('is-active');
        },
        created: function() {
            this.loading = this.$loading({text:'拼命加载中...'});
            // 获取模板  push 模板到数据中
            getTemplateModule().then( data => {
                this.loading.close();
                let res = data.data.moduleInfos;
                this.moduleInfos['基本信息'] = data.data.generalInfoList || [];
                res.forEach((val, index, arr) => {
                    //val['class'] = Step2Class(val.moduleName);
                    this.moduleInfos[val.moduleName] = val;
                    // 取出种植 加工的 步骤
                    if( val.moduleName == '种植' || val.moduleName == '加工') {
                        try{
                            let clone = deepClone(val.subModelInfoInfoList[1].subModelInfoInfoList[0]);
                            if( val.moduleName == '种植' ) this.$store.commit('ADD_FARM_MODULE', clone);
                            else this.$store.commit('ADD_PROCESS_MODULE', clone);
                        }catch(err){
                            throw new error(err);
                        }
                    }
                });
                var two = ['productInfo', 'material'];
                if( this.isEdit ) {
                    two = ['material'];
                }
                for(let i = 0; i < two.length; i++){
                    let row = two[i];
                    this[row].generalInfoList = deepClone(this.moduleInfos['基本信息']) || [];
                    this.baseStep.forEach((val, index) => {
                        if(this.moduleInfos[val]) this[row].moduleInfos.push( deepClone(this.moduleInfos[val]) )
                    })
                }
                // push 数据到 模版中
                    // 基本信息push
                if( !this.isEdit ) {
                    this.noEditData = deepClone(this.productInfo); // 存入初始值
                    let clone = deepClone(this.productInfo);
                    this.$store.commit('SWITCH_STEPDATA', this.productInfo);
                    this.$store.commit('SWITCH_STEPDATA_CLONE', clone);
                    this.stroeData = this.productInfo;
                    // 显示 手机
                    this.isLoadingEnd = true;
                }else {
                    getResumeDetails( this.isEdit ).then(data => {
                        this.loading.close();
                        if( data.data ) {
                            // 置入皮肤颜色
                            if( data.data.backColor ) {
                                this.$nextTick( () => {
                                    let phone = document.getElementById('phone-container');
                                    phone.className = data.data.backColor;
                                })
                            }
                            this.noEditData = data.data;
                            let clone = deepClone(data.data);
                            this.productInfo = clone;

                            let clone2 = deepClone(this.productInfo);
                            this.$store.commit('SWITCH_STEPDATA', this.productInfo);
                            this.$store.commit('SWITCH_STEPDATA_CLONE', clone2);
                            // 显示 手机
                            this.isLoadingEnd = true;
                        }
                    })
                }
            }).catch(err => {
                this.loading.close();
            })
        },
        methods: {
            // 主题切换
            handleTheme(name) {
                this.productInfo.backColor = name;
                let phone = document.getElementById('phone-container');
                phone.className = name;
            },
            //  其实可以 将 stepDialog 放入 store
            editStep(index) {
                this.stepDialog = true;
                this.$store.commit('ACCORDION_INDEX', index);
                //this.$refs.moveDom.style.marginLeft = 0 + 'px';
            },
            addLastStep() {
                this.stepDialog = true;
            },
            handleClose() {
                this.baseDialog = false;
                this.stepDialog = false;
                this.materialDialog = false;
            },
            //右侧列表点击  主要是改变 storeData 分辨是 产品流程 还是 原料流程
            handleProductModule() {
                this.productModuleIndex = -1;
                this.$store.commit('IS_MATERIAL', false);

                let clone = deepClone(this.stroeData);
                this.$store.commit('SWITCH_STEPDATA', this.stroeData);
                this.$store.commit('SWITCH_STEPDATA_CLONE', clone);
            },
            handleMaterialModule(index) {
                this.productModuleIndex = index;
                this.$store.commit('IS_MATERIAL', index);

                let clone = deepClone(this.stroeData);
                this.$store.commit('SWITCH_STEPDATA', this.stroeData);
                this.$store.commit('SWITCH_STEPDATA_CLONE', clone);
            },
            // 点击折叠面板
            // handleAccordionChange(val) {
            //     if(val === '' || val == '-1') return;
            //     console.log(val);
            //     this.stepDialog = true;
            //     this.$store.commit('ACCORDION_INDEX', val);
            // },
            // 基本信息弹出
            clickBase() {
                this.baseDialog = true;
            },
            baseDialogCancel() {
                // 取消 需要拿到副本 重新设置 storeData
                this.baseDialog = false;
                let clone = deepClone(this.stepDataClone);
                this.$store.commit('SWITCH_STEPDATA', clone);
                this.stroeData = clone;
            },
            baseDialogSure() {
                //确认 需要拿到副本 重新设置 副本
                this.baseDialog = false;
                let clone = deepClone(this.stepData);
                this.$store.commit('SWITCH_STEPDATA_CLONE', clone);
            },
            // 添加原料
            addMaterial() {
                // this.stepDialog = true;
                // this.$store.commit('IS_MATERIAL', this.productInfo.productInfos.length);
                // let clone = deepClone(this.material);
                // this.productInfo.productInfos.push(clone);

                // this.handleMaterialModule(this.isMaterial);
                this.materialName = '';
                this.materialDialog = true;
            },
            // 立即填写 更多原料信息
            addMaterialSure() {
                if(this.materialName == '') {
                    this.$message.error('请输入原料名称');
                    return;
                }
                this.$store.commit('IS_MATERIAL', this.productInfo.productInfos.length);
                this.materialDialogSure();
                this.stepDialog = true;
                this.handleMaterialModule(this.isMaterial);
            },
            // 原料弹出框
            materialDialogSure() {
                if(this.materialName == '') {
                    this.$message.error('请输入原料名称');
                    return;
                }
                //debugger
                this.materialDialog = false;
                let clone = deepClone(this.material);
                clone.productName = this.materialName;
                this.productInfo.productInfos.push(clone);
            },
            // phone 原料添加
            addOuterMaterial() {
                this.outerMaterialName = '';
                this.outerMaterialUrl = '';
                this.outerMaterialDialog = true;
            },
            outerMaterialDialogSure() {
                if(this.outerMaterialName == '' || this.outerMaterialUrl == '') {
                    this.$message.error('请输入完整信息');
                    return;
                }
                this.productInfo.productImportList.push({
                    "label": this.outerMaterialName,
                    "value": this.outerMaterialUrl
                })
                this.outerMaterialDialog = false;
            },
            handleCommand(val) {
                if( val == 'inner' ) {
                    this.addMaterial();
                } else {
                    this.addOuterMaterial();
                }
            },
            // 步骤弹出框
            stepDialogSure() {
                this.stepDialog = false;
                let clone = deepClone(this.stepData);
                this.$store.commit('SWITCH_STEPDATA_CLONE', clone);
                this.stroeData = clone;
            },
            stepDialogCancel() {
                this.stepDialog = false;
                let clone = deepClone(this.stepDataClone);
                this.$store.commit('SWITCH_STEPDATA', clone);
                this.stroeData = clone;
                // 如果选中项是最后一项 比如 accordionIndx == 7 但是 要恢复到 6 项  accordionIndex 下标越界 要重置
                this.$store.commit('ACCORDION_INDEX', 0);
            },
            addStepDialogSure(index, name) {
                index = index + 1;
                this.addStepIndex = index;
                let clone = deepClone(this.moduleInfos[name]);
                this.stepData.moduleInfos.splice(index, 0, clone);
                this.$store.commit('ACCORDION_INDEX', index);
            },
            // 保存数据
            saveData() {
                if( this.productInfo.productName == ''){
                    this.$message.error('请输入产品名称');
                    return;
                }
                if( !this.isEdit || this.$route.query.add) {
                    addResume(this.productInfo).then( data => {
                        this.$message.success('保存成功.')
                        this.$router.push('/resume/index');
                    })
                }else {
                    editResume(this.productInfo).then( data => {
                        this.$message.success('保存成功.')
                        this.$router.push('/resume/index');
                    })
                }
            },
            cancelData() {
                this.$confirm('确定要放弃修改吗', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    //type: 'warning'
                }).then(() => {
                    // let clone = deepClone(this.noEditData);
                    // this.productInfo = clone;
                    // let clone2 = deepClone(this.productInfo);
                    // this.$store.commit('SWITCH_STEPDATA', this.productInfo);
                    // this.$store.commit('SWITCH_STEPDATA_CLONE', clone2);
                    // this.stroeData = this.productInfo;
                    // 以上注视 其实就是 location.reload(); 体验好一点 可以使用 provide / inject 组合
                    window.location.reload();
                    // this.$message({
                    //     type: 'success',
                    //     message: '取消成功'
                    // });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
            },
            // 删除原料
            deleteMaterial(index) {
                this.$confirm('确定要删除原料吗', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    //type: 'warning'
                }).then(() => {
                    this.productInfo.productInfos.splice( index, 1);
                    this.$message({
                        type: 'success',
                        message: '删除成功'
                    });
                    if( index == this.isMaterial ) this.handleProductModule();
                }).catch((err) => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            //删除步骤
            deleteStep(index) {
                if( this.stepData.moduleInfos.length == 1 ) {
                    this.$message('至少有一个流程');
                    return;
                }
                this.$confirm('确定要删除步骤吗', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    //type: 'warning'
                }).then(() => {
                    // 如果删除的是选中项 且 还是最后一项  那么 下标就越界  我们让 index - 1 保证不会不越界
                    if(this.stepData.moduleInfos.length == index + 1 && this.accordionIndex == index){
                        this.$store.commit('ACCORDION_INDEX', index - 1);
                    }
                    this.stepData.moduleInfos.splice(index, 1);
                    this.$message({
                        type: 'success',
                        message: '删除成功'
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
        },
    }
</script>

<style lang="scss" scoped>
    @import '../../styles/mixin';

    .btn-op{width:105px;height:45px;line-height: 45px;display: inline-block;font-size: 18px;text-align: center;}
    .borderright{border-right: 1px solid;}
    .btn-op img{margin-top: -3px; margin-right: 5px;width: auto!important;display: inline!important;}
    .zoombtn-op{width: 107px;height: 53px;line-height: 53px;}
    .add-container {
        position: relative;
        .left-active {
            width: 0;
        }
    }
    .is-more {
        padding: 0;
        li {
            height:40px;
            line-height: 40px;
            padding-left: 40px;
            cursor: move;
            &:hover {
                background: #f5f5f5;
            }
            div {
                margin: 0 10px;
            }
        }
    }
    .materal-img {
        width: 110px;
        margin: 0 auto;
    }
    .active {
        background: #E1E6E9;
        color: $color;
    }
    .material-list{
        position: relative;
    }
    .material-close {
        color: red;
        position:absolute;
        top: 16px;
        right: 20px;
        //margin-right: 10px;
    }
    .left-container {
        position: relative;
        height: calc(100% + 40px);
        width: 260px;
        position: absolute;
        left: 0;
        top: -20px;
        background: #FFF;
        text-align: center;
        border-right: 1px solid #e6e6e6;
        transition: width .28s;
        .left-tabs {
            overflow: hidden;
        }
        .toggle-item {
            width: 24px;
            position: absolute;
            right: -24px;
            top: 280px;
            cursor: pointer;
        }
        .round {
            float: left;
            height: 30px;
            width: 30px;
            border-radius: 50%;
            margin: 6px;
            cursor: pointer;
        }
    }
    .right-container{
        height: calc(100% - 60px);
        width: 180px;
        position: fixed;
        right: 0;
        top: 60px;
        background: #FFF;
        text-align: center;
        border-left: 1px solid #e6e6e6;
        .top-btn {
            padding: 8.4px;
        }
        .add-list {
            color: #979797;
            .product-btn{
                border-top: 1px solid #E1E6E9;
            }
            >div{
                font-size: 14px;
                padding: 0 6px;
                height: 48px;
                line-height: 48px;
                border-bottom: 1px solid #E1E6E9;
                cursor: pointer;
            }
            .add-material {
                font-size:14px;
                width:140px;
                height: 38px;
                line-height: 38px;
                border: 1px dashed #ccc;
                border-radius: 6px;
                margin: 20px auto;
                cursor: pointer;
                &:hover {
                    color: $color;
                    border-color: $color;
                }
            }
        }
    }
    .step-container {
        .top-step {
            width:2000px;
        }
        .step-item {
            width: 60px;
            height: 42px;
            line-height: 42px;
            text-align: center;
            border: 1px solid #ddd;
            border-radius: 6px;
        }
    }
    .middle-container {
        z-index:8;
        position: relative;
        margin-top: 20px;
        border: 1px dashed #ebeef5;
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
    .phone-container {
        margin-right: 180px;
    }
    .material-container {
        text-align: center;
        .add-entry {
            color: #4A90E2;
            cursor: pointer;
        }
        h3 {
            color: $color;
        }
    }
</style>