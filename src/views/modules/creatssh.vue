<template>
  <div>
    <div class="ssh">
      <!--项目-->
      <div class="sshtop">
        <el-button type="primary" @click="dialogSSH=true">新增SSH公钥</el-button>
      </div>
      <el-card class="box-card" v-for="item in sshDataList">
        <el-row :gutter="20">
          <el-col :span="18">
            <p>
              公钥名称：{{item.title}}<br>
              公钥指纹（Finger Print）：{{item.fingerPrint}}<br>
              添加于：{{item.createdTime}}<br>
            </p>

          </el-col>
          <el-col :span="6">
            <el-button size="small" type="danger" plain @click="sshDel(item.id)">删除</el-button>
            <el-button size="small" @click="editorSsh(item)">编辑</el-button>
          </el-col>
        </el-row>
      </el-card>
      <!--//项目-->
    </div>
    <!--新建代码片段-->
    <el-dialog title="新增SSH公钥" :visible.sync="dialogSSH" :before-close="resetForm">
      <el-form :model="sshForm"  :rules="rules1" ref="sshForm">
        <el-form-item label="公钥名称" prop="sshName" >
          <el-input  v-model="sshForm.sshName" autocomplete="off" ></el-input>
        </el-form-item>
        <el-form-item label="公钥内容" prop="sshcontent" >
          <el-input v-model="sshForm.sshcontent" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click=" resetForm('sshForm')">取 消</el-button>
        <el-button v-if="type==0" type="primary" @click=" newSsh('sshForm') ">确 定</el-button>
        <el-button v-if="type==1" type="primary" @click=" newSsh('sshForm') ">修改</el-button>
      </div>
    </el-dialog>
    <!--//新建代码片段-->
  </div>
</template>

<script>
    // @ is an alias to /src
    import MainSidebar from '../main-sidebar.vue';
    import HomeSidebar from '../home-sidebar.vue';
    export default {
        name: 'creatssh',
        components: {
            MainSidebar,
            HomeSidebar
        },
        data () {
            return {
              dialogSSH:false,
              sshDataList:[],
              type:0,
              sshId:'',
              newUrl:'',
              sshForm:{
                sshName:'',
                sshcontent:'',

              },
              rules1: {
                sshcontent: [ { required: true, message: '请填写公钥内容',trigger: 'blur' } ],
              },
            }
        },
        mounted(){
            var _this=this;
            _this.getSshList()
        },
        methods:{
          changeSsh(){
            this.dialogSSH=false
          },
          //编辑
          editorSsh(e){
            var _this=this;
            console.log(e)
            _this.type=1
            _this.dialogSSH=true
            _this.sshForm.sshName=e.title
            _this.sshForm.sshcontent=e.content
            _this.sshId=e.id
          },
          resetForm(){
            this.$refs['sshForm'].resetFields();
            this.dialogSSH=false
            this.type=0
            this.sshForm.sshName=''
            this.sshForm.sshcontent=''
            this.sshId=''
          },
          getSshList(){
            var _this=this;
            _this.axios.defaults.headers.common['token'] = _this.token
            _this.axios.post(this.config.baseURL + '/app/key/keyList ')
                    .then(function (response) {
                      _this.sshDataList=response.data.data
                      console.log(" _this.sshDataList", _this.sshDataList)

                    })
          },
          sshDel(id){
            var _this = this;
            _this.$confirm('确定删除该公钥?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              var params = new URLSearchParams();
              params.append("keyId", id);
              _this.axios.defaults.headers.common['token'] = _this.token
              _this.axios.post(this.config.baseURL +   "/app/key/delSshKey", params)
                      .then(function (response) {
                        if(response.data.code==0){
                          _this.getSshList()
                        }
                        _this.$message({
                          message: response.data.msg,
                          type: response.data.code == 0 ? "success" : "warning"
                        });

                      })
            })


          },
          newSsh(formName){
            var _this = this;
            if(_this.type==0){
              var params = {
                'title':_this.sshForm.sshName,
                'content':_this.sshForm.sshcontent,
              };
              _this.newUrl= '/app/key/addKey'
            }else{
              var params = {
                'title':_this.sshForm.sshName,
                'content':_this.sshForm.sshcontent,
                'id':_this.sshId
              };
              _this.newUrl='/app/key/updateSshKey'
            }
            _this.axios.defaults.headers.common['token'] = _this.token
            this.$refs[formName].validate((valid) => {
              if(valid){
                _this.axios.post(this.config.baseURL +   _this.newUrl, params)
                        .then(function (response) {
                          if(response.data.code==0){
                            _this.dialogSSH = false
                            _this.$refs[formName].resetFields();
                            _this.getSshList()
                            _this.sshForm.sshName=''
                            _this.sshForm.sshcontent=''
                            _this.sshId=''
                          }
                          _this.$message({
                            message: response.data.msg,
                            type: response.data.code == 0 ? "success" : "warning"
                          });
                        })
              }
            });
          }
        }
    }
</script>
<style scoped>
  *{
    font-family: 'PingFang SC', 'Helvetica Neue', 'Microsoft YaHei UI', 'Microsoft YaHei', 'Noto Sans CJK SC', Sathu, EucrosiaUPC, Arial, Helvetica, sans-serif;
    color: #000;
  }
  ul {
    list-style-type: none;
    padding: 0;
  }

  a {
    color: #42b983;
  }
  .ssh{
    position: relative;
    margin: 80px 15px 15px;
    padding: 15px 30px;
    margin-left: 310px;
    min-height: calc(100vh - 60px);
    background: #fff;
    border-radius: 8px;
  }
  .ssh .sshtop{
    padding: 10px;
    height: 60px;
    border-bottom: 1px solid #dedede;
  }
  .ssh .sshtop .el-button--primary{
    float: right;
  }
  .ssh .sshtop .el-button--primary span{
    color: #fff;
  }
  .box-card{
    overflow: hidden;
    margin-top: 15px;
  }
  .box-card .el-button{
    float: right;
    margin:0 5px;
  }
  .box-card p{
    font-size: 14px;
    line-height: 30px;
    color: #666;
  }


</style>
