<template>
    <div class="login">
        <div class="login-side">
            <img class="side-img" src="~@/assets/images/login/icon_side.png" alt="side"/>
            <!-- <img class="side-icon" src="@/assets/imgs/icon_sign.png" alt="icon"/> -->
        </div>
        <div class="login-content">
            <div class="login-detail">
                <div class="login-title">
                    <img src="~@/assets/images/login/login_logo.png" alt="side"/>
                </div>
                <div class="login-phone">
                    <p class="login-label">手机号</p>
                    <input id="phone" type="text" v-model="phone" placeholder="请输入手机号"/>
                </div>
                <div class="login-phone">
                    <p class="login-label">密码</p>
                    <input id="password" type="password" v-model="password" placeholder="请输入密码" @keyup.enter.native="handleLogin" />
                </div>
                <button class="to-login" id="login_btn" @click="handleLogin">登录</button>
                <p class="backlogo"><router-link :to="{ name: 'login', query: { phone: this.phone } }">短信验证码登录</router-link>&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;<router-link :to="{ name: 'forget', query: { phone: this.phone } }">忘记密码？</router-link></p>
            </div>
            <!-- <img class="copyright" src="~@/assets/images/login/icon_copyright.png"/> -->
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                phone: this.$route.query.phone || '', // 手机号码
                password: '', // 密码
            }
        },
        computed: {
          //判断手机号码
            rightPhone: function (){
                return /^1\d{10}$/gi.test(this.phone);
            }
        },
        methods: {
            /* 登陆请求  */
            handleLogin(){
				if (!this.rightPhone){
					/*  提示 */
					this.$message.error( '请填写正确的手机号码。' );
					return;
				}else if( this.password.trim() == '' ){
                    /*  提示 */
					this.$message.error( '请填写密码。' );
					return;
                }
                // 提交 action 记录 token
                this.$store.dispatch('AccountLogin', {username: this.phone, password: this. password}).then(() => {
                    this.$router.push({ path: '/' })
                }).catch((res) => {
                    this.$message.error( res.message );
                })
			},
        }
    }
</script>

<style lang='scss' scoped>
//   @import '../../style/login';
  @import '~@/styles/login.scss'
</style>
