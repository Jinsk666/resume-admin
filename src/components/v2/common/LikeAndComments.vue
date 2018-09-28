<template>
    <div class="container-bottom">
        <div class="left">
            <div class="img">
                <div class="img-container good-img-1">
                </div>
            </div>
            <div class="font">
                <span class="theme-color">{{setThumbsUpNum}}</span>&nbsp;赞
            </div>
        </div>
        <div class="right">
            <div class="img">
                <div class="img-container comment-img">
                </div>
            </div>
            <div class="font">
                <span class="theme-color">{{commentsTotal}}</span>&nbsp;评论
            </div>
        </div>
    </div>
</template>

<script>
    import { getCommentsList } from '@/api/v2';
    export default {
        props:['thumbsUpNum'],
        data() {
            return {
                commentsTotal: 0,
                isLikeCount: 0,
                setThumbsUpNum: this.thumbsUpNum || 0
            }
        },
        computed: {
            
        },
        mounted() {
            let resumeCode = this.$route.query.code;
            resumeCode && getCommentsList(resumeCode, 1).then(data => {
                if( !data.data ) {
                    this.$toast('获取评论失败');
                    return;
                }
                this.commentsTotal = data.data.totalNum || 0;
            })
        },
        methods:{
        }
    }
</script>

<style lang="scss" scoped>
    .container-bottom {
        margin: 0 auto;
        width: 346px;
        background: #fff;
        font-size: 14px;
        padding: 10px 0;
        height: 60px;
        border-radius: 6px;
        >div {
            display: inline-block;
            width: 49%;
            text-align: center;
            height: 42px;
            line-height: 42px;
        }
        .left {
            float: left;
            width: 49%;
            border-right: 1px solid #e7e7e7;
        }
        .img-container {
            display: inline-block;
            width: 30px;
            height: 32px;
            margin-top: 4px;
        }
        .img {
            float: left;
            width: 40%;
            text-align: right;
        }
        .font {
            float: right;
            width: 55%;
            text-align: left;
        }
        .right {
            float: right;
            width: 49%;
        }
        .comment-img {
            background: url('~@/assets/images/comments/1.2.png') no-repeat center center;
            background-size: 22px;
        }
        .good-img-1 {
            background: url('~@/assets/images/comments/1.1.png') no-repeat center center;
            background-size: 22px;
        }
        .good-img-2 {
            margin-top: 0;
            background: url('~@/assets/images/comments/1.3.png') no-repeat top center;
            background-size: 30px;
        }
    }
</style>