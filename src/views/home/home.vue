<template>
    <div class="main">
        <div class="container">
            <div class="left one">
                <router-link :to="{name: 'templateIndex'}">
                    <img src="@/assets/images/v2/one.png" alt="">
                    <p>产品管理</p>
                </router-link>
                
            </div>
            <div class="right two">
                <router-link :to="{name: 'collectionIndex'}">
                    <img src="@/assets/images/v2/two.png" alt="">
                    <p>溯源数据</p>
                </router-link>
            </div>
            <div class="left three">
                <router-link :to="{name: 'assignmentIndex'}">
                    <img src="@/assets/images/v2/three.png" alt="">
                    <p>履历赋码</p>
                </router-link>
            </div>
            <div class="right four">
                <router-link :to="{name: 'StayTunedIndex'}">
                    <img src="@/assets/images/v2/four.png" alt="">
                    <p>统计分析</p>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script>
    import { homeRequest } from '@/api/v2'
    	import { getFactoryInfo  } from '@/api/login';

    export default {
        data() {
            return {
            }
        },
        computed: {
			factoryId: function () {
				return this.$store.state.user.factoryId
			}
		},
        created() {
            getFactoryInfo(this.factoryId).then( data => {
                debugger
                if( data.data.creditCode ) {
                    homeRequest()
                }else {
                    this.$router.push({name: 'factory'});
                }
            })
        },
    }
</script>

<style lang="scss" scoped>
    @import '../../styles/mixin';
    .main {
        position: relative;
        width: 100%;
        min-height: calc(100vh - 110px)
    }
    .container{
        @include center();
        height: 500px;
        width: 600px;
        >div{
            width: 300px;
            height:250px;
            text-align: center;
            &:hover {
                opacity: 0.8;
            }
            img {
                width:140px;
            }
            p {
                font-size: 26px;
                color: #757575;

            }
        }
        a{
            display: inline-block;
            width:100%;
            height: 100%;
        }
    }
</style>