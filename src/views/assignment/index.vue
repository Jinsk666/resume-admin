<template>
    <div class="main">
        <div class="container">
            <div class="left one">
                <router-link :to="{name: 'assignmentAdd'}">
                    <img src="@/assets/images/v2/assignment-one.png" alt="">
                    <p>新建履历</p>
                </router-link>
            </div>
            <div class="left two">
                <router-link :to="{name: 'assignmentProductBatch'}">
                    <img src="@/assets/images/v2/assignment-two.png" alt="">
                    <p>产品批次管理</p>
                </router-link>
            </div>
            <div class="left three">
                <router-link :to="{name: 'assignmentQrcode'}">
                    <img src="@/assets/images/v2/assignment-three.png" alt="">
                    <p>二维码管理</p>
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