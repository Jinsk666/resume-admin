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
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="stepDialogCancel" size="small">取 消</el-button>
                <el-button type="primary" @click="stepDialogSure" size="small">保 存</el-button>
            </span>
        </el-dialog>

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
    export default {
        props: ['stepDialog'],
        data() {
            return {
                thirdPartyTable: [],
                addStepDialog: false,
                step: ['种植','采收', '仓储', '加工', '包装', '检测'],
                chooseStep: '种植',
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
            },

        },
    }
</script>

<style lang="scss" scoped>
    @import '../../../styles/mixin';
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