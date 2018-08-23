<template>
    <div class="main">
        <div class="container">
            <img src="@/assets/images/v2/more-static.png" alt="">
            <p>敬请期待!</p>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                data() {
                    return {
                      
                    }
                },
            }
        },
    }
</script>

<style lang="scss" scoped>
    @import '../../../styles/mixin';
    .main {
        position: relative;
        height: calc(100vh - 110px);
    }
    .container {
        @include center();
        width: 200px;
        height: 300px;
        p {
            text-align: center;
            font-size: 22px;
            color: #757575;
            margin-top: 40px;
        }
    }
</style>