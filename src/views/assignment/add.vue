<template>
    <div class="add-container" v-show="isLoadingEnd">
        <div class="phone-container">
            <main-phone
                :globalPool="globalPool"
                @editStep="editStep"
                @clickBase="clickBase"
                >
            </main-phone>
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
                    @click="handleProductModule">{{resumeTemplateTwoOne.resumeTemplateName || '产品模版'}}</div>
                <div
                    class="ellipsis material-list"
                    :class="{active: productModuleIndex == index}"
                    v-if="resumeTemplateTwoOne.resumeTemplateTwoOnes.length > 0"
                    v-for="(item, index) in resumeTemplateTwoOne.resumeTemplateTwoOnes"
                    :key="index"
                    :title="item.resumeTemplateName"
                    @click="handleMaterialModule(index)"
                    @mouseover="mouseoverMaterialIndex = index"
                    @mouseout="mouseoverMaterialIndex = -1">
                    <span>{{item.resumeTemplateName}}</span>
                    <!-- <span
                        @click.stop="deleteMaterial(index)"
                        v-show="mouseoverMaterialIndex == index"
                        class="el-icon-circle-close material-close">
                    </span> -->
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
            v-if="stepDialog"
            :stepDialog="stepDialog"
            @handleClose="handleClose"
            @stepDialogSure="stepDialogSure"
            @stepDialogCancel="stepDialogCancel"
            >
        </step-dialog>
        <!-- 模版选择弹出框 -->
        <module-dialog
            v-if="moduleDialog"
            :moduleDialog="moduleDialog"
            @handleClose="handleClose2"
            @moduleDialogSure="moduleDialogSure"
            @moduleDialogCancel="moduleDialogCancel"
            >

        </module-dialog>
        <materials-dialog
            v-if="materialMapDialog"
            :materialMapDialog="materialMapDialog"
            @MaterialMapDialogSure="MaterialMapDialogSure"
            @MaterialMapDialogCancel="MaterialMapDialogCancel"
            @handleClose="handleClose"
            >
        </materials-dialog>
    </div>
</template>

<script>
    import MainPhone from '@/components/v2/assignment/MainPhone'
    import StepDialog from '@/components/v2/assignment/StepDialog'
    import BaseDialog from '@/components/v2/template/BaseDialog'
    import ModuleDialog from '@/components/v2/assignment/ModuleDialog'
    import MaterialsDialog from '@/components/v2/assignment/MaterialDialog' // 原料对应数据弹出框
    import { deepClone, Step2Class } from '@/utils'
    import { dataPool, materialData, isHaveCode } from '@/utils/v2'
    import { getModuleList, getModuleDetails } from '@/api/v2'
    import { addResume, editResume, getResumeDetails } from '@/api'
    export default {
        components: {/* ThemePicker, */  MainPhone, StepDialog, BaseDialog, ModuleDialog, MaterialsDialog },
        data() {
            return {
                //themeColor: [{color: '#45BC9C', name: 'theme1'}, {color: '#00ACE9', name: 'theme2'}, {color: '#4A90E2', name: 'theme3'}, {color: '#5DBA19', name: 'theme4'}, {color: '#FFD117', name: 'theme5'}],
                globalPool: {}, //承载数据的数据池  可能很大 不放入 store
                mouseoverMaterialIndex: -1,
                loading: '',
                isLoadingEnd: false, //手机显示开关 第一个接口加载完毕是临界点
                productModuleIndex: -1, // 右侧点击样式
                moduleInfos: {}, // 各个步骤的 数据模版
                // 最终上传的数据
                resumeTemplateTwoOne: {
                    resumeTemplateName: '',//产品名称
                    imgUrlList: [], // 产品图片
                    logoUrl: '', // logo
                    backColor: '', //皮肤
                    templateCode: '', //模板
                    uniqueCode: '', // 唯一编码
                    generalInfoList:[], //产品字段
                    // 产品流程
                    moduleInfos:[],
                    // 原料列表
                    resumeTemplateTwoOnes:[],
                    productImportList: [], // 原料外链接
                    externalQuoteList:[]
                },
                // 基本原料
                material: {
                    resumeTemplateName: '原料',
                    imgUrlList: [],
                    logoUrl: '',
                    generalInfoList: [],
                    moduleInfos: [],
                    externalQuoteList: []
                },
                addStepIndex: 0, //添加步骤的下标
                baseStep: ['采购','种植','采收', '仓储', '加工', '包装', '检测'],
                baseDialog: false, // 基本信息弹出框
                stepDialog: false, // 添加步骤弹出框
                materialDialog: false, // 原料名称弹出框
                materialMapDialog: false, // 原料对应数据弹出框
                outerMaterialDialog: false, //
                materialName: '', // 新添加的原料名称
                outerMaterialName: '',// 原料 名称
                outerMaterialUrl: '', // 原料 url
                isLeftActive: false, // 左侧 toggle
                moduleDialog: false,
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
                        return this.resumeTemplateTwoOne
                    }else {
                        return this.resumeTemplateTwoOne.resumeTemplateTwoOnes[this.$store.state.app.isMaterial]
                    }
                },
                set: function(newValue) {
                    if( this.$store.state.app.isMaterial === false ){
                        this.resumeTemplateTwoOne = newValue;
                    }else {
                        this.resumeTemplateTwoOne.resumeTemplateTwoOnes[this.$store.state.app.isMaterial] = newValue;
                    }
                }
            },
            templateCode() { // 模板 code
                return this.$route.query.templateCode
            },
            code() { // 履历 code  有 code 就相当于是编辑
                return this.$route.query.code
            }
        },
        mounted() {
            
        },
        // templateCode 模版Id 表示从模版进入   code 履历Id 表示修改履历
        created: function() {
            this.$store.commit('IS_MATERIAL', false);
            this.loading = this.$loading({text:'拼命加载中...'});
            // 如果选了 模板 就不显示模板框
            if( !this.templateCode && !this.code) {
                this.moduleDialog = true;
                this.isLoadingEnd = true;
                this.loading.close();
            }else {
                if( this.templateCode ) {
                    getModuleDetails( this.templateCode ).then(data => {
                        // 置入皮肤颜色
                        if( data.data.backColor ) {
                            this.$nextTick( () => {
                                let phone = document.getElementsByClassName('phone-container');
                                phone.className = data.data.backColor;
                            })
                        }

                        this.loading.close();
                        let clone = deepClone(data.data);
                        this.resumeTemplateTwoOne = clone;

                        let clone2 = deepClone(this.resumeTemplateTwoOne);
                        this.$store.commit('SWITCH_STEPDATA', this.resumeTemplateTwoOne);
                        this.$store.commit('SWITCH_STEPDATA_CLONE', clone2);
                        // 显示 手机
                        this.isLoadingEnd = true;
                    })
                }else if(this.code) {
                    getResumeDetails( this.code ).then(data => {
                        data.data.resumeTemplateTwoOnes = data.data.resumeDataTwoOnes;

                        // 置入皮肤颜色
                        if( data.data.backColor ) {
                            this.$nextTick( () => {
                                let phone = document.getElementsByClassName('phone-container');
                                phone.className = data.data.backColor;
                            })
                        }

                        this.loading.close();
                        let clone = deepClone(data.data);
                        this.resumeTemplateTwoOne = clone;

                        let clone2 = deepClone(this.resumeTemplateTwoOne);
                        this.$store.commit('SWITCH_STEPDATA', this.resumeTemplateTwoOne);
                        this.$store.commit('SWITCH_STEPDATA_CLONE', clone2);
                        // 显示 手机
                        this.isLoadingEnd = true;

                        dataPool(clone.moduleInfos, this.globalPool);
                    })
                }
            }
        },
        methods: {
            // // 主题切换
            // handleTheme(name) {
            //     this.resumeTemplateTwoOne.backColor = name;
            //     let phone = document.getElementById('phone');
            //     phone.className = name;
            // },
            //  其实可以 将 stepDialog 放入 store
            editStep(index, name) {
                this.stepDialog = true;
                this.$store.commit('ACCORDION_INDEX', index);
                this.$store.commit('ACCORDION_NAME', name);
                //this.$refs.moveDom.style.marginLeft = 0 + 'px';
            },
            handleClose() {
                this.baseDialog = false;
                this.stepDialog = false;
                this.materialDialog = false;
                this.materialMapDialog = false;
            },
            //右侧列表点击  主要是改变 storeData 分辨是 产品流程 还是 原料流程
            handleProductModule() {
                this.productModuleIndex = -1;
                this.$store.commit('IS_MATERIAL', false);

                let clone = deepClone(this.stroeData);
                this.$store.commit('SWITCH_STEPDATA', this.stroeData);
                this.$store.commit('SWITCH_STEPDATA_CLONE', clone);
            },
            async handleMaterialModule(index) { //TODO:
                this.productModuleIndex = index;
                this.$store.commit('IS_MATERIAL', index);
                // 根据原料 id 查找原料信息
                let clone = deepClone(this.stroeData);
                this.$store.commit('SWITCH_STEPDATA', this.stroeData);
                this.$store.commit('SWITCH_STEPDATA_CLONE', clone);
                // stepData 变话之后 立刻调用  这里的 storeData == stepData
                dataPool(clone.moduleInfos, this.globalPool);
                // 这里也需要 并发 原料 的 步骤
                    // 这里需要判断是否是有链接
                    //这里需要 调取原料  stepData 已经变为原料
                if( this.stepData.uniqueCode ) {
                    if( !this.globalPool[this.stepData.uniqueCode] ) {
                        var data = await materialData(this.stepData.uniqueCode, this.globalPool)
                    }else {
                        var data = this.globalPool[this.stepData.uniqueCode];
                    }
                    this.stepData.generalInfoList = data.generalInfoList;
                    this.stepData.imgUrlList = data.imgUrlList;
                    this.stepData.logoUrl = data.logoUrl;
                    this.stepData.enterpriseName = data.enterpriseSelectName;
                    this.stepData.resumeTemplateName = data.moduleName;
                    if( data.externalQuoteList ) this.stepData.externalQuoteList = data.externalQuoteList;
                    else this.stepData.externalQuoteList = [];
                    this.$store.commit('SWITCH_STEPDATA', this.stepData);
                    let clones = deepClone(this.stepData);
                    this.$store.commit('SWITCH_STEPDATA_CLONE', clones);
                    this.stroeData = this.stepData;
                }else {
                    this.materialMapDialog = true;
                }
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
                if( this.isMaterial !== false ) {
                    this.materialMapDialog = true;
                }else {
                    this.baseDialog = true;
                }
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
            // 步骤弹出框
            stepDialogSure() {
                this.stepDialog = false;
                let clone = deepClone(this.stepData);
                this.$store.commit('SWITCH_STEPDATA_CLONE', clone);
                this.stroeData = clone;
                // 并发 请求选中的数据 扔进数据池
                    // globalPool  可以存入 store 这样 修改数据的地方也可以用到
                dataPool(clone.moduleInfos, this.globalPool);
            },
            stepDialogCancel() {
                this.stepDialog = false;
                let clone = deepClone(this.stepDataClone);
                this.$store.commit('SWITCH_STEPDATA', clone);
                this.stroeData = clone;
                // 如果选中项是最后一项 比如 accordionIndx == 7 但是 要恢复到 6 项  accordionIndex 下标越界 要重置
                this.$store.commit('ACCORDION_INDEX', 0);
            },
            // 模版选择
            moduleDialogSure(code) {
                if( !code ) this.$router.go(-1);
                    else  this.$router.push( { name: 'assignmentAdd', query: { templateCode: code } } );
            },
            moduleDialogCancel() {
                this.$router.go(-1);
            },
            handleClose2() {
                this.$router.go(-1);
            },
            // 保存数据
            saveData() {
                if( this.resumeTemplateTwoOne.resumeTemplateName == ''){
                    this.$message.error('请输入产品名称');
                    return;
                }
                this.resumeTemplateTwoOne.resumeDataTwoOnes = this.resumeTemplateTwoOne.resumeTemplateTwoOnes;
                 // 限制编码 如果任何一个没有对应数据 就不能保存
                if( !isHaveCode(this.resumeTemplateTwoOne) ) {
                    this.$message.error( '原料以及流程环节必须选择信息' );
                    return;
                }
                if( !this.code && this.templateCode ) { // 模版保存
                    addResume(this.resumeTemplateTwoOne).then( data => {
                        this.$message.success('保存成功.')
                        this.$router.push({name: 'assignmentProductBatch'});
                    })
                }else { // 履历修改
                    editResume(this.resumeTemplateTwoOne).then( data => {
                        this.$message.success('保存成功.')
                        this.$router.push({name: 'assignmentProductBatch'});
                    })
                }
            },
            // 取消输入
            cancelData() {
                this.$confirm('确定要放弃修改吗', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    //type: 'warning'
                }).then(() => {
                    // let clone = deepClone(this.noEditData);
                    // this.resumeTemplateTwoOne = clone;
                    // let clone2 = deepClone(this.resumeTemplateTwoOne);
                    // this.$store.commit('SWITCH_STEPDATA', this.resumeTemplateTwoOne);
                    // this.$store.commit('SWITCH_STEPDATA_CLONE', clone2);
                    // this.stroeData = this.resumeTemplateTwoOne;
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
            // 原料
            MaterialMapDialogSure(code) {
                if( !this.stepData.uniqueCode ) {
                    this.$message('请选择一条数据后保存');
                    return;
                }
                this.materialMapDialog = false;
                //  请求原料数据 扔进数据池
                materialData(this.stepData.uniqueCode, this.globalPool).then( data => {
                    this.stepData.generalInfoList = data.generalInfoList;
                    this.stepData.imgUrlList = data.imgUrlList;
                    this.stepData.logoUrl = data.logoUrl;
                    this.stepData.enterpriseName = data.enterpriseSelectName;
                    this.stepData.resumeTemplateName = data.moduleName;
                    if( data.externalQuoteList ) this.stepData.externalQuoteList = data.externalQuoteList;
                    else this.stepData.externalQuoteList = [];
                    this.$store.commit('SWITCH_STEPDATA', this.stepData);
                    let clone = deepClone(this.stepData);
                    this.$store.commit('SWITCH_STEPDATA_CLONE', clone);
                    this.stroeData = this.stepData;
                })
            },
            MaterialMapDialogCancel() {
                this.materialMapDialog = false;
            }
        },
    }
</script>

<style lang="scss" scoped>
    @import '../../styles/mixin';
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