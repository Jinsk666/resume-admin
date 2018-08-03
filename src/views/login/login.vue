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
                <div class="login-code">
                    <p class="login-label">验证码</p>
                    <input id="password" type="text" @keyup.enter.native="handleLogin" v-model="verify" placeholder="请输入验证码"/>
                    <button id="send_sms_code" :class="{ right_phone: rightPhone }" v-show="!countdownTime" @click="sendVerify">发送验证码</button>
                    <button v-show="countdownTime" >重新发送({{countdownTime}})</button>
                </div>
                <button class="to-login" id="login_btn" @click="handleLogin">登录</button>
                <p class="backlogo"><router-link :to="{ name: 'accountLogin', query: {phone: this.phone} }">账号密码登录</router-link></p>
            </div>
            <!-- <img class="copyright" src="~@/assets/images/login/icon_copyright.png"/> -->
        </div>
    </div>
</template>

<script>
	import { getVerify } from '@/api/login';

    export default {
        data() {
            return {
                phone: this.$route.query.phone || '', // 手机号码
                verify: '', // 验证码
				countdownTime: 0, // 发送验证时倒计时
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
				}else if(!(/^\d{4}$/gi.test(this.verify))){
					/*  提示 */
					this.$message.error( '请填写正确的验证码' );
					return;
                }
                // 提交 action 记录 token
                this.$store.dispatch('Login', {username: this.phone, password: this. verify}).then(() => {
                    this.$router.push({ path: '/' })
                }).catch((res) => {
                    this.$message.error( res.message );
                })
			},
			/* 验证码请求 */
            async sendVerify(){
				if( this.rightPhone ){
					/* 验证码读秒 */
					this.countdownTime = 60;
					this.timer = setInterval(() => {
						this.countdownTime--;
						if( this.countdownTime == 0 ){
							clearInterval( this.timer );
							this.timer = null;
						}
					},1000)
					let res = await getVerify( this.phone );
					if( res.code == '0000' ){
						
					}else{
						/*  提示 */
						this.$message.error( res.message );
					}
				}else{
					/*  提示 */
					this.$message.error('请填写正确的手机号码。');
				}
            }
        }
    }
</script>

<style lang='scss' scoped>
  @import '~@/styles/login.scss'
</style>
