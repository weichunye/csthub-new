<template>
  <div class="education_box">
    <div class="education_login">
      <!--登录-->
      <span class="dltit">登 录</span>
      <div class="pass-login-covers" style="display: block;">
        <div class="email">
          <el-input v-model="userName" placeholder="请输入用户名"></el-input>
        </div>
        <div class="email">
          <el-input type="password" v-model="userPassWord" placeholder="请输入密码"></el-input>
        </div>
        <div class="login">
          <div style="cursor:pointer;" type="button" @click="loginSubmite" class="btn-current-big disabled">登录</div>
        </div>
        <div class="auto-login">
          <label class="label">
            <input type="checkbox" name="autolog" id="autolog" checked="" class="case">下次自动登录
            <div class="login-links">
              <!-- 	<a href="" class="">忘记密码</a> &nbsp; | &nbsp; -->
              <router-link to="/register">注册</router-link>

            </div>
          </label>

        </div>
      </div>
      <!--登录end-->
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

      loginSubmite(){
        var _this=this;
        var params = {
          "mobileOrEmail":_this.userName,
          "password":_this.userPassWord,
        }
        var errorMsg=''
        if(!_this.userName){
          _this.$message({
            message: "请填写用户名",
            type:"warning"
          });
        }else if(!_this.userPassWord){
          _this.$message({
            message: "请填写登录密码",
            type:"warning"
          });
        }else{
          _this.axios.post(this.config.baseURL+'/app/login',params)
                  .then(function(response) {
                    console.log("response",response)
                    if(response.data.code==0){
                      _this.userInfo=response.data.userInfo;
                      /*console.log("_this.userInfo",_this.userInfo)*/
                      console.log("_this.$store",_this.$store)
                      _this.$store.commit('isLoginEd', JSON.stringify(response.data.userInfo))
                      _this.$store.commit('getToken', JSON.stringify(response.data.token))
                      /* _this.axios.defaults.headers.common['token'] =  response.data.token;*/
                      _this.$router.push({
                        name: 'home',
                      })
                    }else{
                      _this.$message({
                        message: response.data.msg,
                        type:"warning"
                      });
                    }

                  })
        }


      }
    }
  }
</script>
<style scoped>
  *{
    font-family: 'PingFang SC', 'Helvetica Neue', 'Microsoft YaHei UI', 'Microsoft YaHei', 'Noto Sans CJK SC', Sathu, EucrosiaUPC, Arial, Helvetica, sans-serif;
    color: #000;
  }
  html {
    background: none;
    height: 100%;
    margin: 0 !important;
  }

  body {
    font-size: 12px;
    margin: 0;
    background: #fff  no-repeat;
    background-size: 100% 100%;
  }

  .pass-login-covers {
    position: relative;
  }

  .ipt-tips-default, .email, .password {
    margin-bottom: 20px;
  }

  .ipt-default-current {
    width: 336px;
  }

  .text-style {
    height: 42px;
    padding-left: 20px;
    padding-right: 20px;
    color: #666666;
    font-size: 14px;
    border: 1px solid #dddddd;
    background: #f4f4f4;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    border-radius: 4px;
    -webkit-border-radius: 4px;
    -moz-border-radius: 4px;
  }

  .login {
    margin-bottom: 20px;
  }

  .auto-login {
    line-height: 14px;
    *zoom: 1;
  }

  .login-links {
    color: #999999;
    position: absolute;
    right: 0;
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
  }

  .btn-current-big {
    width: 336px;
    height: 42px;
    font-size: 16px;
    line-height: 42px;
  }

  .disabled {
    color: #fff;
    background: #ff6c00;
    border: 1px solid #ff6c00;
    border-radius: 4px;
    cursor: pointer;
    text-align: center;
    cursor: default;
  }

  .auto-login a {
    text-decoration: none;
    color: inherit;
  }

  /*表单美化*/
  .label { /*flex布局让子元素水平垂直居中*/
    display: flex;
    align-items: center;
    position: relative;
  }

  .case[type=checkbox], input[type=radio] {
    -webkit-appearance: none;
    appearance: none;
    outline: none;
    width: 15px;
    height: 15px;
    cursor: pointer;
    vertical-align: center;
    background: #FFE300;
    border: 1px solid #FFE300;
    position: relative;
    border-radius: 2px;
    margin-right: 10px;
  }

  .case[type=checkbox]:checked::after {
    content: "\2713";
    display: block;
    position: absolute;
    top: 0px;
    left: 1px;
    right: 0;
    bottom: 0;
    width: 10px;
    height: 10px;
    line-height: 10px;
    border: 1px solid #FFE300;
    color: #fff;
    font-size: 12px;
  }

  .case[type=radio]:checked::after {
    content: "";
    display: block;
    position: absolute;
    top: 2px;
    left: 2px;
    right: 0;
    bottom: 0;
    width: 6px;
    height: 6px;
    background-color: red;
  }

  .case[type=radio], .case[type=radio]:checked::after {
    border-radius: 50%;
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

  .password {
    display: flex;
    justify-content: space-between;
  }

  .idbtn {
    cursor: pointer;
    background: #ff6c00;
    border: 1px solid #ff6c00;
    color: #fff;
  }

</style>
