<template>
    <div class="tree-info-block">
        <div class="tree-head headTreeBg"></div>
        <div class="tree-body" v-if="toData.data.length == 1 && toData.data[0].generalInfoList.length > 0">
          <!--第一个为右侧-->
          <div class="tree-w174 headTopTreeBg" >
            <div class="tree-right">
              <div class="tree-line-right treeLineRight"></div>
              <div class="farm-img" @click="viewMore(0)">
                <img v-if="toData.data[0].imgUrlList"
                    :src="toData.data[0].imgUrlList[0]"/>
                <img v-else
                    src="~@/assets/images/no-img.png"/>
              </div>
              <div class="txt-flow">
                {{ toData.data[0].generalInfoList[0].value || ''}}
                <span class="more" @click="viewMore(0)">更多》</span>
                <br/>
                <p class="txt-date">{{ toData.data[0].generalInfoList[1].value | formatTime('Y-m-d') }}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="tree-body" v-if="toData.data.length > 1 && toData.data[0].generalInfoList.length > 0">
          <!--第一个为右侧-->
          <div class="tree-w174 headTopTreeBg" >
            <div class="tree-right">
              <div class="tree-line-right treeLineRight"></div>
              <div class="farm-img" @click="viewMore(0)">
                <img v-if="toData.data[0].imgUrlList"
                    :src="toData.data[0].imgUrlList[0]"/>
                <img v-else
                    src="~@/assets/images/no-img.png"/>
              </div>
              <div class="txt-flow">
                {{ toData.data[0].generalInfoList[0].value || ''}}
                <span class="more" @click="viewMore(0)">更多》</span>
                <br/>
                <p class="txt-date">{{ toData.data[0].generalInfoList[1].value | formatTime('Y-m-d') }}</p>
              </div>
            </div>
          </div>
          <!--循环tree-w348,里面有一个left,一个right-->
          <div v-for="(item, index) in toData.data.slice(1)" :key="index">
            <div v-if="index%2==0" class="tree-h174-left rightTreeBg">
              <div class="tree-left">
                <div class="tree-line-left treeLineleft"></div>
                <div class="farm-img" @click="viewMore(index + 1)">
                  <img v-if="item.imgUrlList"
                      :src="item.imgUrlList[0]"/>
                  <img v-else
                      src="~@/assets/images/no-img.png"/>
                </div>
                <div class="txt-flow">
                  {{ toData.data.slice(1)[index].generalInfoList[0].value || '' }}
                  <span class="more" @click="viewMore(index + 1)">更多》</span>
                  <br/>
                  <p class="txt-date">{{ toData.data.slice(1)[index].generalInfoList[1].value | formatTime('Y-m-d') }}</p>
                </div>
              </div>
            </div>
            <div v-if="index%2==1" class="tree-h174-right rightTreeBg">
              <div class="tree-right">
                <div class="tree-line-right treeLineRight"></div>
                <div class="farm-img" @click="viewMore(index + 1)">
                  <img v-if="item.imgUrlList"
                      :src="item.imgUrlList[0]"/>
                  <img v-else
                      src="~@/assets/images/no-img.png"/>
                </div>
                <div class="txt-flow">
                  {{ toData.data.slice(1)[index].generalInfoList[0].value || ''}}
                  <span class="more" @click="viewMore(index + 1)">更多》</span>
                  <br/>
                  <p class="txt-date">{{ toData.data.slice(1)[index].generalInfoList[1].value | formatTime('Y-m-d') }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="tree-foot footTreeBg"></div>
      </div>
</template>

<script>
    import { formatTime } from '@/utils'
    export default {
        props: ['toData'],
        data() {
            return {
            }
        },
        methods: {
            viewMore() {
                
            }
        },
        filters: {
			formatTime
		},
    }
</script>

<style lang='scss' scope>
    @import '../../styles/mixin';
// 树
.more {
  visibility: hidden;
}
.headTreeBg {
    background: url('~@/assets/images/tree-head.png') no-repeat;
    background-size: 100% 100%;
};
.headTopTreeBg {
    background: url('~@/assets/images/tree-body-one.png') no-repeat center bottom;
    background-size: 100% 100%;
}
.footTreeBg {
    background: url('~@/assets/images/tree-foot.png') no-repeat;
    background-size: 100% 100%;
};
.treeLineRight {
    background: url('~@/assets/images/tree-right.png') no-repeat;
    background-size: 100%;
};
.treeLineleft {
    background: url('~@/assets/images/tree-left.png') no-repeat;
     background-size: 100%;
};
.rightTreeBg {
    background: url('~@/assets/images/tree-body.png') no-repeat center bottom;
    background-size: 100% 100%;
};
.tree-right .txt-flow{
    padding-left: 60px!important;
}
.tree-left .txt-flow{
    padding-left: 15px!important;
}
.tree-info-block{
  position: relative;
  padding: 20px 0 153px;
}
.tree-info-block .tree-head{
  height: 76px;
  //background: url(../../images/resume/YinpianResume_tree_head.png) no-repeat center top;
}
.tree-info-block .tree-foot{
  position: absolute;
  left: 0;
  bottom: 2px;
  right: 0;
  z-index: 1;
  height: 153px;
  //background: url(../../images/resume/YinpianResume_tree_foot.png) no-repeat center top;
}
.tree-body .tree-w174{
  position: relative;
  height: 100px;

  //background: url(../../images/resume/YinpianResume_tree_body_head.png) repeat-y;
}
.tree-body .tree-h174-left{
  position: relative;
  height: 100px;
  //margin-left:-2px;
  //background: url(../../images/resume/YinpianResume_tree_body.png) repeat-y center top;
}
.tree-body .tree-h174-left .tree-left{
  position: absolute;
  top: 0;
  left: 5px;
  width: 154px;
  height:100px;
  //box-sizing: border-box;
}
.tree-body .tree-left .tree-line-left{
  position: absolute;
  right: 16px;
  top: 25px;
  width: 71px;
  height: 11px;
  //background: url('/static/image/tree/YinpianResume_tree_linel.png') no-repeat;
  //background-size: 100%;
  //content: '';
}
.tree-body .tree-w174 .tree-right{
  position: absolute;
  bottom: 0;
  right: -2px;
  width: 190px;
  height: 100px;
  padding-left: 30px;
  box-sizing: border-box;
}
.tree-body .tree-h174-right{
  position: relative;
  height: 100px;
  //background: url(../../images/resume/YinpianResume_tree_body.png) repeat-y center bottom;
}
.tree-body .tree-h174-right .tree-right{
  position: absolute;
  top: 0;
  right: -2px;
  width: 190px;
  padding-left: 30px;
  box-sizing: border-box;
}
.tree-body .tree-right .tree-line-right{
  position: absolute;
  left: 20px;
  top: 25px;
  width: 71px;
  height: 11px;
  //background: url('/static/image/tree/YinpianResume_tree_liner.png') no-repeat;
  //background-size: 100%;
  //content: '';
}
.tree-body .farm-img{
  float: left;
  width: 47px;
  height: 47px;
  margin-left: 18px;
  border: 3px solid #99c19b;
  border-radius: 50%;
  overflow: hidden;
}
.tree-body .tree-right .farm-img{
  margin-left: 62px;
}
.tree-body .farm-img img{
  width: 100%;
  height: 100%;
}
.tree-body .txt-flow{
  display: inline-block;
  min-width: 134px;
  line-height: 20px;
  margin-top: 6px;
  font-size: 14px;
  color: #2b2b2b;
  text-align: left;
  padding-left: 30px;
  box-sizing: border-box;
}
.tree-body .txt-flow span{
  font-size: 12px;
  color: #49b39b;
}
.tree-body .company-name{
  display: inline-block;
  max-width: 130px;
  vertical-align: top;
  text-indent: 14px;
  color: #92bd00;
  word-break: break-all;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.tree-body .txt-date{
  display: inline;
  font-size: 12px;
  color: #666;
}
.tree-body .director-name{
  display: inline-block;
  max-width: 130px;
  vertical-align: top;
  text-indent: 14px;
  color: #666;
  font-size: 15px;
  word-break: break-all;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.tree-body .txt-result{
  display: inline-block;
  max-width: 130px;
  vertical-align: top;
  text-indent: 14px;
  color: #dd2516;
  font-size: 15px;
  word-break: break-all;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.tree-body .view-more{
  display: inline-block;
  max-width: 140px;
  vertical-align: top;
  text-indent: 14px;
  color: #379d62;
  font-size: 15px;
  overflow: hidden;
  cursor: pointer;
}
.pick-pictures{
  float: left;
  max-width: 96px;
  padding: 32px 0 0;
  overflow: hidden;
}
.pick-pictures img{
  float: left;
  width: 42px;
  height: 42px;
  margin-left: 6px;
  border-radius: 50%;
}
.farm-img img {
  pointer-events: none;
}
</style>