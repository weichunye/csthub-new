<template>
  <div class="education_box">
    <div class="education_login">
      <!--登录-->
      <span class="dltit">注  册</span>
      <div class="pass-login-covers" style="display: block;">
        <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="用户名" prop="userName">
            <el-input v-model="ruleForm.userName"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="userEmail">
            <el-input v-model="ruleForm.userEmail"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="userPhone">
            <el-input v-model="ruleForm.userPhone"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="userPassWord">
            <el-input type="password" v-model="ruleForm.userPassWord" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="reUserPassWord">
            <el-input type="password" v-model="ruleForm.reUserPassWord" autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="loginSubmite('ruleForm')">提交</el-button>
            <el-button @click="resetForm('ruleForm')">重置</el-button>
          </el-form-item>
        </el-form>

      </div>
      <!--登录end-->
    </div>

  </div>
</template>

<script>
// @ is an alias to /src
export default {
  name: 'register',
  components: {
  },
    data () {
        var validatePass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入密码'));
            } else {
                if (this.ruleForm.checkPass !== '') {
                    this.$refs.ruleForm.validateField('reUserPassWord');
                }
                callback();
            }
        };
        var validatePass2 = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'));
            } else if (value !== this.ruleForm.userPassWord) {
                callback(new Error('两次输入密码不一致!'));
            } else {
                callback();
            }
        };
        return {
            ruleForm:{
                userName:'',
                userEmail:'',
                userPhone:'',
                userPassWord:'',
                reUserPassWord:''
            },
            rules: {
                userName: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                ],
                userEmail: [
                    { required: true, message: '请输入活邮箱', trigger: 'blur' }
                ],
                userPhone: [
                    { required: true, message: '请输入电话号', trigger: 'blur' }
                ],
                userPassWord: [
                    {  validator: validatePass, trigger: 'blur' }
                ],
                reUserPassWord: [
                    {  validator: validatePass2,  trigger: 'blur' }
                ],
            }

        }
    },
    mounted(){
        this.$nextTick(function () {
            $('.sidebar').hide()

        })
    },
    methods:{

        loginSubmite(formName){
            var _this=this;
            var params = new URLSearchParams();
            params.append("username",_this.ruleForm.userName);
            params.append("mobile",_this.ruleForm.userPhone);
            params.append("email",_this.ruleForm.userEmail);
            params.append("password",_this.ruleForm.userPassWord);
            var params={
              "username":_this.ruleForm.userName,
            "mobile":_this.ruleForm.userPhone,
            "email":_this.ruleForm.userEmail,
           "password":_this.ruleForm.userPassWord
            }
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    _this.axios.post(this.config.baseURL+'/app/register',params)
                        .then(function(response) {
                            if(response.data.code==0){
                                _this.$alert('', '注册成功，马上去登录', {
                                    confirmButtonText: '确定',
                                    callback: action => {
                                        console.log("response",response)
                                        _this.$router.push('/')
                                    }
                                });

                            }else{
                                _this.$message({
                                    message: response.data.msg,
                                    type:"warning"
                                });
                            }
                        })
                }})
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
