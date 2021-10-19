<template>
  <div>
  <div class="newfile">
    <h3>新建文件</h3>
    <!--项目-->
    <div class="box">

      <el-form :inline="true"  class="demo-form-inline">
        <el-form-item label="">
          <el-input v-model="projectValue"  size="medium" placeholder="输入成员名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="medium" @click="searchSubmit">查询</el-button>
        </el-form-item>
      </el-form>
     <div style="text-align: right">
       <el-button type="primary" plain  @click="dialogFormBranch=true">新建分支</el-button>
     </div>
      <!--<div  style="text-align: right"><el-button type="primary">邀请新成员</el-button></div>-->
      <h4>分支：</h4>
      <dl class="menmerList" v-for="item in branchList">
        <dt>fdfsfsdf</dt>
        <dd> <el-button plain size="small">普通成员</el-button></dd>
      </dl>

    </div>
    <!--//项目-->

  </div>

  </div>
</template>

<script>
// @ is an alias to /src
import MainSidebar from '../main-sidebar.vue';
import HomeSidebar from '../home-sidebar.vue';
export default {
  name: 'newfile',
  components: {
      MainSidebar,
      HomeSidebar
  },
    data () {
        return {
            dialogFormBranch:false,
            projectValue:'',
            projectData:[],
            branchName:'',
            branchList:[],
        }
    },
    mounted(){
      var _this=this;
      console.log("depotId",_this.$route.query.depotId)
        this.axios.get(this.config.baseURL + '/app/user/*/project/*/git/list_branches',{params:{
            'depotId':this.$route.query.depotId
        }})
            .then(function (response) {
                _this.projectData=response.data
                console.log(" this.projectData", response)
                _this.newfileList=response.data.list
                if(response.data.code!=0){
                    _this.$message({
                        message: response.data.msg,
                        type: response.data.code ==  "warning"
                    });

                }
            })
    },
    methods:{
      //搜索提交
        searchSubmit () {
            console.log('11')
        },
        //新建分支
        creatNewBranch(){
            var _this = this;
            /*this.$route.query.id;*/
            var params = new URLSearchParams();
            params.append("depotId",_this.$route.query.depotId);
            params.append("branch_name", _this.newfileName);
            this.axios.post(this.config.baseURL + '/app/user/*/project/*/git/branches/create', params)
                .then(function (response) {
                    console.log(" response", response.data)
                    _this.dialogFormBranch=false
                  var  msgType=response.data.code==0?'success':'warning'
                    _this.$message({
                        message: response.data.msg,
                        type: msgType
                    });
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
  .newfile{
    position: relative;
    margin:15px;
    padding: 15px 30px;
    margin-left: 310px;
    min-height: calc(100vh - 60px);
    background: #fff;
    border-radius: 8px;
  }
  .newfile h3{
    font-size: 18px;
    line-height: 40px;
    color: #666;
  }
  .newfile .box{
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
  .newfile .iconlock{
    display: block;
    margin: 5px 10px;
    width: 12px;
    height:16px;
    background: url("../../assets/icon_lock.png") no-repeat;
  }
  .newfile .iconcode{
    float: left;
    margin-right: 10px;
    display: inline-block;
    width: 26px;
    height: 26px;
    background: url("../../assets/icon_code.png") no-repeat;
    background-size: cover;
  }
  .newfile .menmerList{
    width: 100%;
    display: block;
    overflow: hidden;
    color: #333;
    font-size: 14px;
    line-height: 50px;
    border-bottom: 1px solid #dedede;
  }
  .newfile .menmerList dt{
    float: left;

  }
  .newfile .menmerList dd{
    float: right;
  }

</style>
