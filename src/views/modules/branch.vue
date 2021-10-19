<template>
  <div>
  <div class="branch">
    <h3>仓库名称</h3>
    <!--项目-->
    <div class="box">

    <!--  <el-form :inline="true"  class="demo-form-inline">
        <el-form-item label="">
          <el-input v-model="branchValue"  size="medium" placeholder="输入分支名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="medium" @click="searchSubmit">查询</el-button>
        </el-form-item>
      </el-form>-->
     <div style="text-align: right">
       <el-button type="primary" plain  @click="dialogFormBranch=true">新建分支</el-button>
     </div>
      <!--<div  style="text-align: right"><el-button type="primary">邀请新成员</el-button></div>-->
      <h4>分支：</h4>
      <dl class="menmerList" v-for="item in branchList">
        <dt>{{item.simpleName}}</dt>
        <dd><el-button type="danger" @click="delBranch(item.simpleName)" size="mini">删除</el-button></dd>
        <dd>2019-10-17</dd>

      </dl>


    </div>
    <!--//项目-->

  </div>

    <el-dialog title="新建分支" :visible.sync="dialogFormBranch" :close-on-click-modal="false">
      <el-input v-model="branchName" auto-complete="off" placeholder="请输入分支名称"></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormBranch = false">取 消</el-button>
        <el-button type="primary" @click="creatNewBranch">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// @ is an alias to /src
import MainSidebar from '../main-sidebar.vue';
import CodeSidebar from '../code-sidebar.vue';
export default {
  name: 'branch',
  components: {
      MainSidebar,
      CodeSidebar
  },
    data () {
        return {
            dialogFormBranch:false,
            branchValue:'',
            projectData:[],
            branchName:'',
            branchList:[],
             projectId:"",
             depotId:"",
        }
    },
    mounted(){
       this.projectId=this.$route.query.projectId
      this.depotId=this.$route.query.depotId
      this.getBranchList()
    },
    methods:{
      //搜索提交
        searchSubmit () {
            console.log('11')
        },
        getBranchList(){
            var _this=this;
            this.axios.get(this.config.baseURL + '/app/user/*/project/*/git/'+_this.projectId+'/'+_this.depotId+'/refs',{params:{
                'depotId':_this.depotId,
                'projectId':_this.projectId
            }})
                .then(function (response) {
                    _this.projectData=response.data
                    _this.branchList=response.data.refs
                    if(response.data.code!=0){
                        _this.$message({
                            message: response.data.msg,
                            type: response.data.code ==  "warning"
                        });

                    }
                })
        },
        //新建分支
        creatNewBranch(){
            var _this = this;
            /*this.$route.query.id;*/
            _this.axios.defaults.headers.common['token'] = _this.token
            var params = new URLSearchParams();
            params.append("depotId",_this.depotId);
            params.append("branch_name", _this.branchName);
            _this.axios.post(this.config.baseURL + '/app/user/*/project/*/git/branches/create', params)
                .then(function (response) {
                    console.log(" response", response.data)
                    _this.dialogFormBranch=false
                  _this.branchName=''
                  var  msgType=response.data.code==0?'success':'warning'
                    _this.$message({
                        message: response.data.msg,
                        type: msgType
                    });
                    _this.getBranchList()
                })
        },
        //删除分支
        delBranch(branchName){
            var _this = this;
            _this.$confirm('确定删除该分支?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                _this.axios.defaults.headers.common['token'] = _this.token
                var params = new URLSearchParams();
                params.append("depotId",_this.depotId);
                params.append("branch_name",branchName);
                _this.axios.post(this.config.baseURL + '/app/user/*/project/*/git/branches/delete', params)
                    .then(function (response) {
                        var  msgType=response.data.code==0?'success':'warning'
                        _this.$message({
                            message: response.data.msg,
                            type: msgType
                        });
                        _this.getBranchList()
                    })

            })

        },
        //行点击事件
        goToPositores (row, event, column) {
            console.log(row)
            this.$router.push({
                name: 'projectrepositories',
                query: {
                    'id':row.id
                }
            })
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

  .branch{
    position: relative;
    margin:15px;
    padding: 15px 30px;
    margin-left: 310px;
    min-height: calc(100vh - 60px);
    background: #fff;
    border-radius: 8px;
  }
  .branch h3{
    font-size: 18px;
    line-height: 40px;
    color: #666;
  }
  .branch .box{
    margin-top: 20px;
    width: 100%;
  }
  .home .box .morelink{
    display: block;
    margin-top: 10px;
    padding-right: 20px;
    font-size: 12px;
    color: #4396ca;
    text-align: right;
    text-decoration: underline;
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
  .branch .iconlock{
    display: block;
    margin: 5px 10px;
    width: 12px;
    height:16px;
    background: url("../../assets/icon_lock.png") no-repeat;
  }
  .branch .iconcode{
    float: left;
    margin-right: 10px;
    display: inline-block;
    width: 26px;
    height: 26px;
    background: url("../../assets/icon_code.png") no-repeat;
    background-size: cover;
  }
  .branch .menmerList{
    width: 100%;
    display: block;
    overflow: hidden;
    color: #333;
    font-size: 14px;
    line-height: 50px;
    border-bottom: 1px solid #dedede;
  }
  .branch .menmerList dt{
    float: left;

  }
  .branch .menmerList dd{
    float: right;
    margin-right: 10px;
  }

</style>
