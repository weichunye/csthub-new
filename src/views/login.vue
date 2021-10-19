<template>
  <div class="education_box">
    <div class="education_login">
      <!--登录-->
      <span class="dltit">登 录</span>
      <div class="pass-login-covers" style="display: block;">
    <iframe src="https://passport.escience.cn/oauth2/authorize?response_type=code&redirect_uri=http://www.cstos.cstcloud.cn/csthub/web/auth/callback&client_id=94253&theme=embed">

    </iframe>
        <a  class="a-link" href="https://passport.escience.cn/regist.jsp"> 注册</a>
        <router-link to="/home">首页</router-link>
      </div>
      <!--登录end-->
    </div>
    <div class="login-bg-left">

    </div>

  </div>
</template>

<script>
    // @ is an alias to /src
    export default {
        name: 'login',
        components: {
        },
        data () {
            return {
                userName:'',
                userPassWord:''
            }
        },
        mounted(){
            this.$nextTick(function () {
                $('.sidebar').hide()
            })
        },
        methods:{

        }
    }
</script>
<style scoped>

  .education_box{
    display: block;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-image: linear-gradient(to right, #5c3ddd , #407ee8);
    background-size: 100% 100%;
  }
  .login-bg-left{
    position: fixed;
    left: 0;
    top: 100px;
    width: 794px;
    height: 670px;
    background: url("../assets/login_bg_left.png") no-repeat;
  }

  .pass-login-covers {
    position: relative;
  }
  .pass-login-covers iframe{
    border: 0;
    width: 280px;
    height: 330px;
  }
  .a-link{
    position: absolute;
    right: 20px;
    bottom: 55px;
    font-size: 13px;
    color: #08a;
  }
  .education_login {
    width: 336px;
    min-height: 380px;
    background: #ffffff;
    position: relative;
    margin: 0 auto;
    padding: 20px 32px 30px 32px;
    -webkit-box-shadow: 0px 1px 12px 0px rgba(0, 0, 0, 0.2);
    box-shadow: 0px 1px 12px 0px rgba(0, 0, 0, 0.2);
    position: absolute;
    right: 15%;
    top: 15%;;
    text-align: center;
    z-index: 100;
  }

  /*表单美化*/
  .dltit {
    font-size: 18px;
    color: #333;
    width: 80px;
    display: inline-block;
    height: 30px;
    text-align: center;
    margin: 0 auto 20px;

  }

</style>
