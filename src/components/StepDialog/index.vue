<template>
    <div>
        <!-- 添加产品模态框 -->
        <el-dialog
            title="生产流程"
            :visible.sync="stepDialog"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :before-close="handleClose"
            width="700px">
            <div class="step-container clearfix" v-if="toData.moduleInfos">
                <!-- 流程步骤 -->
                <div class="clearfix">
                    <span class="left move" @click="leftMove">
                        <i class="el-icon-caret-left"></i>
                    </span>
                    <div class="top-step-contaiber left">
                        <div class="top-step" ref="moveDom">
                            <div class="left step-add" @click="addStep(-1)">
                                <i class="el-icon-circle-plus-outline"></i>
                            </div>
                            <div class="left item-btn"
                                v-for="(item, index) in toData.moduleInfos"
                                :key="index">
                                <!-- 步骤 -->
                                <div
                                    class="left step-item"
                                    @click="handleStep(index)"
                                    @mouseover="mouseOverIndex = index"
                                    @mouseout="mouseOverIndex = -1"
                                    :class="{active: accordionIndex == index}">
                                    {{item.moduleName || ''}}
                                    <span class="delete-add"
                                        @click.stop="deleteStep(index)"
                                        v-show="mouseOverIndex == index">
                                        <i class="el-icon-remove"></i>
                                    </span>
                                </div>
                                <div class="left" v-show="toData.moduleInfos.length - 1 != index">
                                    <div class="left icon-jt">
                                        <svg-icon icon-class="jt"></svg-icon>
                                    </div>
                                    <div class="left step-add step-add-middle" @click="addStep(index)">
                                        <i class="el-icon-circle-plus-outline"></i>
                                    </div>
                                </div>
                            </div>
                            <div id="last_add" class="left step-add" @click="addStep(toData.moduleInfos.length - 1)">
                                <i class="el-icon-circle-plus-outline"></i>
                            </div>
                        </div>
                    </div>
                    <span class="right move" id="last_move" @click="rightMove">
                        <i class="el-icon-caret-right"></i>
                    </span>
                </div>
                <!-- 表单内容 -->
                <div class="middle-container" v-if="toData.moduleInfos[accordionIndex] && toData.moduleInfos[accordionIndex].moduleName != '种植' && toData.moduleInfos[accordionIndex].moduleName != '加工'">
                    <div class="current-font">当前{{toData.moduleInfos[accordionIndex].moduleName || ''}}流程</div>
                    <div class="outer-btn" style="display:none;">
                            <el-button type="primary" icon="el-icon-plus" size="small">添加人工录入</el-button>
                            <el-button type="primary" icon="el-icon-upload2" size="small" @click="uploadDialogShow">选择本地文档</el-button>
                            <el-button type="primary" icon="el-icon-plus" size="small" @click="outerDialogShow">添加引用数据</el-button>
                    </div>
                    <div class="form-container">
                        <el-form
                            v-if="toData.moduleInfos && toData.moduleInfos.length > 0"
                            :inline="true" ref="productInfoDom" label-width="120px" size="mini">
                            <el-form-item
                                :class="{block: item.label == '图片'}"
                                v-for="(item, index) in toData.moduleInfos[accordionIndex].generalInfoList"
                                :key="index"
                                :label="item.label + ':'"
                            >
                                <el-input
                                    v-if="item.label == '备注'"
                                    :placeholder="item.describe"
                                    type="textarea"
                                    v-model="item.value"
                                    rows="4"
                                    style="width:446px;">
                                </el-input>
                                <el-date-picker
                                    v-else-if="item.label.indexOf('时间') != -1 || item.label.indexOf('日期') != -1"
                                    style="width:158px;"
                                    @change="item.value = +item.value"
                                    type="date"
                                    v-model="item.value">
                                </el-date-picker>
                                <div  v-else-if="item.label == '图片'" class="file-container">
                                    <div class="img-container" v-if="toData.moduleInfos[accordionIndex].imgUrlList">
                                        <span  v-for="(item, index) in toData.moduleInfos[accordionIndex].imgUrlList"
                                            :key="index">
                                            <img :src="item" alt="">
                                        </span>
                                    </div>
                                    <div class="file-item">
                                        <label class="upload-item" :for="'file' + index">
                                            <i class="el-icon-plus"></i>
                                            <input type="file" :id="'file' + index" class="upload-input" @change="uploadFile($event, toData.moduleInfos[accordionIndex])">
                                        </label>
                                    </div>
                                </div>
                                <el-input
                                    v-model="item.value"
                                    :placeholder="item.describe"
                                    v-else>
                                </el-input>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
                <!-- 种植加工单独处理 -->
                <div class="middle-container" v-if="toData.moduleInfos[accordionIndex] && (toData.moduleInfos[accordionIndex].moduleName == '种植' || toData.moduleInfos[accordionIndex].moduleName == '加工')">
                    <div class="current-font">当前{{toData.moduleInfos[accordionIndex].moduleName || ''}}流程</div>
                    <el-tabs style="margin-top: 10px;">
                        <el-tab-pane
                            v-for="(item0, index0) in toData.moduleInfos[accordionIndex].subModelInfoInfoList"
                            :key="index0">
                            <span slot="label">
                                <svg-icon v-if="item0.label == '种植基本信息'" icon-class="zz"></svg-icon>
                                <svg-icon v-if="item0.label == '环境信息'" icon-class="hj"></svg-icon>
                                <svg-icon v-if="item0.label == '田间管理'" icon-class="tj"></svg-icon>
                                <svg-icon v-if="item0.label == '加工基本信息'" icon-class="jg"></svg-icon>
                                <svg-icon v-if="item0.label == '工序流程'" icon-class="gx"></svg-icon>
                                {{item0.label || '无返回'}}
                            </span>
                            <div v-if="index0 != 1">
                                <el-form
                                    v-if="item0.generalInfoList && item0.generalInfoList.length > 0"
                                    :inline="true" ref="productInfoDom" label-width="120px" size="mini">
                                    <el-form-item
                                        v-for="(item, index) in item0.generalInfoList"
                                        :key="index"
                                        :class="{block: item.label == '图片'}"
                                        :label="item.label + ':'"
                                    >
                                        <el-input
                                            v-if="item.label == '备注'"
                                            :placeholder="item.describe"
                                            type="textarea"
                                            v-model="item.value"
                                            rows="4"
                                            style="width:446px;">
                                        </el-input>
                                        <el-date-picker
                                            v-else-if="item.label.indexOf('时间') != -1 || item.label.indexOf('日期') != -1"
                                            style="width:158px;"
                                            type="date"
                                            @change="item.value = +item.value"
                                            v-model="item.value">
                                        </el-date-picker>
                                        <div  v-else-if="item.label.indexOf('图片') != -1" class="file-container">
                                            <div class="img-container" v-if="item0.imgUrlList">
                                                <img v-for="(item, index) in item0.imgUrlList" :key="index" :src="item" alt="">
                                            </div>
                                            <div class="file-item">
                                                <label class="upload-item" :for="'file' + (index0+100)">
                                                    <i class="el-icon-plus"></i>
                                                    <input type="file" :id="'file' + (index0+100)" class="upload-input" @change="uploadFile($event, item0)">
                                                </label>
                                            </div>
                                        </div>
                                        <el-input
                                            v-model="item.value"
                                            :placeholder="item.describe"
                                            v-else>
                                        </el-input>
                                    </el-form-item>
                                </el-form>
                            </div>
                            <div v-if="index0 == 1 && item0.subModelInfoInfoList">
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
                                        <div class="delete" @click="deleteFarm(item0, index0)">
                                            <i class="el-icon-delete"></i>
                                        </div>
                                    </div>
                                    <el-form
                                        :inline="true" ref="productInfoDom" label-width="120px" size="mini">
                                        <el-form-item
                                            v-for="(item, index) in item1.generalInfoList"
                                            :key="index"
                                            :class="{block: item.label == '图片'}"
                                            :label="item.label + ':'"
                                        >
                                            <el-input
                                                v-if="item.label == '备注'"
                                                :placeholder="item.describe"
                                                type="textarea"
                                                v-model="item.value"
                                                rows="4"
                                                style="width:446px;">
                                            </el-input>
                                            <el-date-picker
                                                v-else-if="item.label.indexOf('时间') != -1 || item.label.indexOf('日期') != -1"
                                                style="width:158px;"
                                                type="date"
                                                @change="item.value = +item.value"
                                                v-model="item.value">
                                            </el-date-picker>
                                            <div  v-else-if="item.label.indexOf('图片') != -1" class="file-container">
                                                <div class="img-container" v-if="item1.imgUrlList">
                                                    <img v-for="(item, index) in item1.imgUrlList" :key="index" :src="item" alt="">
                                                </div>
                                                <div class="file-item">
                                                    <label class="upload-item" :for="'file' + (index1+1000)">
                                                        <i class="el-icon-plus"></i>
                                                        <input type="file" :id="'file' + (index1+1000)" class="upload-input" @change="uploadFile($event, item1)">
                                                    </label>
                                                </div>
                                            </div>
                                            <el-input
                                                v-model="item.value"
                                                :placeholder="item.describe"
                                                v-else>
                                            </el-input>
                                        </el-form-item>
                                    </el-form>
                                </div>
                                <div class="add-farm" @click="addFarm(item0, toData.moduleInfos[accordionIndex].moduleName)"> <i class="el-icon-plus"></i> 新增</div>
                            </div>
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="stepDialogCancel" size="small">取 消</el-button>
                <el-button type="primary" @click="stepDialogSure" size="small">保 存</el-button>
            </span>
        </el-dialog>

        <!-- 引用外部链接 -->
        <el-dialog
            title="引用外部链接"
            :visible.sync="outerDialog"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            width="700px">
            <div>
                <div class="outer-link-img">
                    <img src="~@/assets/images/outer-link.png" alt="">
                </div>
                <el-table
                    :data="outerDialogData"
                    stripe
                    size="mini"
                    border
                    style="width: 100%">
                    <el-table-column
                        type="index"
                        label="序号"
                        align="center"
                        min-width="50">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        label="操作"
                        width="100">
                        <template slot-scope="scope">
                            <span class="todo" @click="handleOuterAdd(scope.$index, outerDialogData,scope)">+</span>
                            <span class="todo" @click="handleOuterDelete(scope.$index, outerDialogData)">-</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="label"
                        label="名称"
                        min-width="100">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.label"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column
                    align="center"
                        prop="value"
                        label="URL"
                        min-width="200">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.value"></el-input>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="outerDialogCancel" size="small">取 消</el-button>
                <el-button type="primary" @click="outerDialogSure" size="small">保 存</el-button>
            </span>
        </el-dialog>

        <!-- 上传 -->
        <el-dialog
            title="选择文件"
            :visible.sync="uploadDialog"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            width="500px">
            <div class="upload-container">
                
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="uploadDialog = false" size="small">取 消</el-button>
                <el-button type="primary" @click="uploadDialogSure" size="small">保 存</el-button>
            </span>
        </el-dialog>
        <!-- 人工录入 -->

        <!-- 添加按钮弹出框 -->
        <el-dialog
            title="选择流程"
            :visible.sync="addStepDialog"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :before-close="handleClose2"
            width="500px">
            <div class="addstep-container">
                <div class="left addstep-li" v-for="(item, index) in step" :key="index">
                    <el-radio v-model="chooseStep" :label="item" >{{item}}</el-radio>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addStepDialog = false" size="small">取 消</el-button>
                <el-button type="primary" @click="addStepDialogSure" size="small">保 存</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import { deepClone } from '@/utils/index'
    import { isImg } from '@/utils/index'
    import  axios  from 'axios'
    export default {
        props: ['stepDialog'],
        data() {
            return {
                addStepDialog: false,
                outerDialog: false,
                uploadDialog: false,
                outerDialogData: [],
                dialogImageUrl: '',
                fileDialog: false,
                step: ['采购','种植','采收', '仓储', '加工', '包装', '质检'],
                chooseStep: '采购',
                addIndex: 0,
                mouseOverIndex: -1, // 鼠标移入的步骤
            }
        },
        computed: {
            toData() {
                return this.$store.state.app.stepData || []
            },
            toDataClone() {
                return this.$store.state.app.stepDataClone || []
            },
            accordionIndex() {
                return this.$store.state.app.accordionIndex || 0
            },
            farmModule() {
                return this.$store.state.app.farmModule || {}
            },
            processModule() {
                return this.$store.state.app.processModule || {}
            }
        },
        methods: {
            //  添加农事
            addFarm(item, name) {
                var clone;
                if( name == '种植' ) { clone = deepClone(this.farmModule)}
                else { clone = deepClone(this.processModule)}
                item.subModelInfoInfoList.push(clone);
            },
            //删除农事
            deleteFarm(item, index) {
                item.subModelInfoInfoList.splice(index - 1, 1)
            },
            //  步骤移动
            leftMove() {
                let current = parseInt(this.$refs.moveDom.style.marginLeft || 0);
                if( current == 0 ) return;
                this.$refs.moveDom.style.marginLeft = current + 115 + 'px';
            },
            rightMove(isNo, index) { // isNo 代表添加步骤 index 代表 + 号下标
                if(isNo != '1'){
                    if (document.getElementById("last_add").offsetLeft < document.getElementById("last_move").offsetLeft) return;
                }
                let current = parseInt(this.$refs.moveDom.style.marginLeft || 0);
                if( index != -1 && this.toData.moduleInfos.length > 5) this.$refs.moveDom.style.marginLeft = current - 115 + 'px';
            },
            //弹出框步骤按钮点击
            handleStep(val) {
                this.$store.commit('ACCORDION_INDEX', val);
            },
            handleClose() {
                this.$emit('handleClose');
            },
            handleClose2() {
                this.addStepDialog = false;
            },
            stepDialogSure() {
                this.$emit('stepDialogSure');
            },
            stepDialogCancel() {
                this.$emit('stepDialogCancel');
            },
            // 外部链接
            outerDialogShow() {
                this.outerDialog = true;
                this.outerDialogData = this.toData.moduleInfos[this.accordionIndex].outsideResumeFunc || [];
                if( this.outerDialogData.length == 0 )this.outerDialogData.push({label:'', value: ''});
            },
            // 取消 要 重置数据
            outerDialogCancel() {
                this.outerDialog = false;
                let clone = deepClone(this.toDataClone.moduleInfos[this.accordionIndex].outsideResumeFunc);
                this.toData.moduleInfos[this.accordionIndex].outsideResumeFunc =  clone;
            },
            // 确定要改变 clone 中的数据
            outerDialogSure() {
                this.outerDialog = false;
                let clone = deepClone(this.toData.moduleInfos[this.accordionIndex].outsideResumeFunc);
                this.toDataClone.moduleInfos[this.accordionIndex].outsideResumeFunc =  clone;
            },
            // 选择本地文档
            uploadDialogShow() {
                this.uploadDialog = true;
            },
            uploadDialogSure() {
                this.uploadDialog = false;
            },
            handleOuterAdd(index, rows, scope) {
                console.log(scope)
                //rows.splice(index,0, {lable:'',value:''});
                rows.push({lable:'',value:''})
            },
            handleOuterDelete(index, rows) {
                if( rows.length == 1 ) return;
                rows.splice(index, 1);
            },
            // 上传文件
            uploadFile($event, obj) {
                let file = $event.target.files[0];
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
                         if ( !obj.imgUrlList ) {
                            obj.imgUrlList = [];
                         }
                         //this.toData.moduleInfos[this.accordionIndex].imgUrlList.push(res.data.data.fileUrl);
                         obj.imgUrlList.push(res.data.data.fileUrl);
                     }else{
                        this.$message({
                            message:res.data.msg,
                            type:'error'
                        })
                    }
                 })
                return false;
            },
            // 添加步骤弹出框确认
            addStep(index) {
                this.addStepDialog = true;
                this.addIndex = index;
            },
            addStepDialogSure() {
                this.$emit('addStepDialogSure', this.addIndex, this.chooseStep)
                this.addStepDialog = false;
                this.rightMove('1', this.addIndex);
            },
            //删除步骤
            deleteStep(index) {
                this.$emit('deleteStep', index);
            }

        },
    }
</script>

<style lang="scss" scoped>
    @import '../../styles/mixin';
    .add-farm {
        width: 540px;
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
        overflow: hidden;
        margin: 10px 32px 10px 20px;
        color: #409EFF;
        .line {
            height: 1px;
            min-width: 486px;
            background: #409EFF;
            margin-top: 12px
        }
        .farm-index {
            padding: 0 10px;
        }
        .delete {
            position: absolute;
            right: 32px;
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
    .todo {
        font-size: 16px;
        cursor: pointer;
        padding: 0 4px;
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