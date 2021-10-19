<template>
  <div>
    <div class="repositorydetail">
      <el-row>
        <el-col :span="24">
          <div class="top">
            <!-- <img src="../../assets/photo.jpg"/>
             <p>项目名称  &nbsp  /</p>-->
          </div>
        </el-col>
        <el-col :span="12"> </el-col>
      </el-row>
      <div class="box">
        <p class="text"></p>
      </div>
      <!--仓库基本信息-->
      <div>
        <el-row :gutter="10" class="marT-20">
          <el-col :span="4">
            <el-select size="medium" v-model="sourceBranch" placeholder="请选择" @change="changeBranch()">
              <el-option
                      v-for="item in branchList"
                      :key="item.simpleName"
                      :label="item.simpleName"
                      :value="item.simpleName">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="4">
            <el-select size="medium" v-model="distBranch" placeholder="请选择" @change="changeBranch()">
              <el-option
                      v-for="item in branchList"
                      :key="item.simpleName"
                      :label="item.simpleName"
                      :value="item.simpleName">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="4" v-if="ifCanMerge">
            <p >可以合并</p>
          </el-col>
          <el-col :span="4" v-else>
            <p>不可自动合并</p>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" @click=" dialogCreatMerge=true">新建合并请求</el-button>
          </el-col>
        </el-row>
      </div>
    </div>
    <!--新建仓库-->
    <el-dialog title="新建合并请求" :visible.sync="dialogCreatMerge" :close-on-click-modal=false>
      <el-form :model="mergeForm" :rules="rules2" ref="mergeForm" >
        <el-form-item prop="name" label="请输入合并请求标题" >
          <el-input v-model="mergeForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="desc" label="描述内容" >
          <el-input type="textarea" v-model="mergeForm.desc"></el-input>
        </el-form-item>
        <el-form-item label="选择审核人" prop="ownerType" >
          <el-select size="medium" v-model="mergeForm.ownerType" placeholder="请选择">
            <el-option
                    v-for="item in memberLisr"
                    :key="item.userId"
                    :label="item.username"
                    :value="item.userId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <div style="display: block; text-align: center">
            <el-button  @click=" resetForm('projectForm','dialogRepository')">取 消</el-button>
            <el-button type="primary" @click=" crearMerge('mergeForm') ">确 定</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--//新建仓库-->
  </div>
</template>

<script>
  // @ is an alias to /src
  export default {
    name: 'MergePage',
    data () {
      return {
        sourceBranch:'master',//源分支
        distBranch:'master',//目标分支
        dialogCreatMerge:false,
        branchList:'',
        ifCanMerge:false,
        mergeForm:{
          name:'',
          desc:'',
          ownerType:''
        },
        rules2: {
          name: [{ required: true,message: '请填写名称', trigger: 'blur'}],
          desc: [ { required: true, message: '请填写简介',trigger: 'blur' } ],
          ownerType: [ { required: true, message: '请选择审核人',trigger: 'blur' } ],
        },
        page:1,
        limit:10,
        memberLisr:''
      }
    },
    mounted(){
      /*this.$route.query.id;*/
      this.depotId=this.$route.query.depotId;
      this.projectId=this.$route.query.projectId;
      this.getBranchList()//获取分支列表
      this.changeBranch()
      this.getDepotMember()
    },
    watch: {
      '$route'(to, from) {
        this.getBranchList()//获取分支列表
      }
    },
    methods:{
      changeBranch(e){
        var _this=this;
        var params = new URLSearchParams();
        params.append("depotId", _this.depotId);
        params.append("srcBranch",_this.sourceBranch);
        params.append("targetBranch", _this.distBranch);
        _this.axios.post(_this.config.baseURL + '/app/pullReq/canMerge',params)
                .then(function (response) {
                  if(response.data.data=="ALREADY_MERGED"){
                    console.log("ALREADY_MERGED")
                    _this.ifCanMerge=true

                  }
                  console.log("response1111111111111111",response)
                })
      },
      //穿件合并请求
      crearMerge(formName){
        var _this=this;
        this.$refs[formName].validate((valid) => {
          if(valid){
            _this.axios.defaults.headers.common['token'] = _this.token
            this.axios.post(this.config.baseURL + '/app/pullReq/createPullRequest',{
                "auditUserId": _this.mergeForm.ownerType,
                "depotId": 68,
                "description": _this.mergeForm.name,
                "distBranch": _this.sourceBranch,
                "sourceBranch": _this.sourceBranch,
                "title": _this.mergeForm.desc
              })
                    .then(function (response) {
                      _this.$message({
                        message: response.data.msg,
                        type: response.data.code == 0 ? "success" : "warning"
                      });
                    })
          }})

      },
      //获取分支
      getBranchList(){
        var _this=this;
        console.log("depotId",_this.$route.query.depotId)
        this.axios.get(this.config.baseURL + '/app/user/*/project/*/git/'+_this.projectId+'/'+_this.depotId+'/refs',{params:{
            'depotId':_this.depotId,
            'projectId':_this.projectId
          }})
                .then(function (response) {
                  _this.branchList=response.data.refs
                })
      },
      //仓库成员
      getDepotMember(){
        var _this=this;
        _this.axios.defaults.headers.common['token'] = _this.token
        var params = new URLSearchParams();
        params.append("page", _this.page);
        params.append("limit", _this.limit);
        params.append("userName", '');
        params.append("depotId", _this.depotId);
        this.axios.post(this.config.baseURL + '/app/depot/getDepotUserList',params)
                .then(function (response) {
                  console.log("=response.data",response.data)
                  _this.memberLisr=response.data.pageList.records

                })
      },
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
  .marT-20{
    margin-top: 20px;
  }
  .repositorydetail {
    position: relative;
    margin: 80px 15px 15px;
    padding: 15px 30px;
    margin-left: 310px;
    min-height: calc(100vh - 60px);
    background: #fff;
    border-radius: 8px;}
  .repositorydetail .top{
    width: 100%;
    line-height: 40px;

  }
  .repositorydetail .top img{
    float: left;
    width: 40px;
    height:40px;
    border-radius: 50%;
    border: 1px solid #dedede;
  }
  .repositorydetail .top p{
    float: left;
    margin: 0 10px;
    font-size: 14px;
    color: #999;
  }
  .el-select .el-input {
    width: 130px;
  }
  .el-select{
    width: 120px;
  }
  .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }
  .repositorydetail .top h3{
    font-size: 18px;
    color: #000;
  }
  .repositorydetail .box{
    margin-top: 20px;
  }
  .repositorydetail .box .text{
    font-size:12px;
    line-height: 20px;
    color: #666;
  }
  .entrepottable h4{
    width: 100%;
    font-size: 14px;

  }
  .entrepottable p{
    overflow: hidden;
    display: block;
    width: 100%;
  }
  .entrepottable p span{
    font-size: 12px;
    color: #999;
  }
  .entrepottable .el-table td{
    padding: 6px 0;
  }
  .repositorydetail .iconlock{
    display: block;
    margin: 5px 10px;
    width: 12px;
    height:16px;
    background: url("../../assets/icon_lock.png") no-repeat;
  }
  .repositorydetail i{
    font-size: 20px;
    cursor: pointer;
  }
  .repositorydetail .el-select .el-input{
    width: 100px;
  }
  .readme-box{
    margin-top: 20px;
    width: 100%;
    border:1px solid #dedede;
  }
  .readme-box-top{
    height: 40px;
    line-height: 40px;
    font-style: 14px;
    text-indent: 20px;
    background: #eaecf0;

  }
  .readme-con{
    width: 96%;
    padding: 2%;
    min-height: 300px;
    box-sizing: content-box;
    color: #666;
  }
  .vue-codemirror{
    border:1px solid #dedede;
  }
  .file-top{
    padding: 10px;
    background: #e6f0fa;
  }
  .top-box{
    margin: 20px 0 0 0 ;
    padding: 10px;
    font-size: 14px;
    line-height: 20px;
    background: #f1f2f4;
    border:1px solid #d9dbe0;
  }
</style>
