<template>
    <div class="main">
        <div class="container">
            <div class="left one">
                <router-link :to="{name: 'collectionMaterial'}">
                    <img src="@/assets/images/v2/collection-one.png" alt="">
                    <p>原料信息</p>
                </router-link>
            </div>
            <div class="left two">
                <router-link :to="{name: 'collectionFactory'}">
                    <img src="@/assets/images/v2/collection-two.png" alt="">
                    <p>企业信息</p>
                </router-link>
            </div>
            <div class="left three">
                <router-link :to="{name: 'collectionProcess'}">
                    <img src="@/assets/images/v2/collection-three.png" alt="">
                    <p>环节信息</p>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
            }
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
        height: 250px;
        width: 900px;
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