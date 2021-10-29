<template>
  <div>
  <div class="home">
    <h3>项目</h3>
    <!--项目-->
    <div class="box">
      <el-form :inline="true"  class="demo-form-inline">
        <el-form-item label="">
          <el-input v-model="projectName"  size="medium" placeholder="输入项目名称"  @keyup.enter.native="getDataList"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="medium" @click="getDataList"  >查询</el-button>
        </el-form-item>
      </el-form>
      <el-table class="projectData"
                :data="projectData"
                style="width: 100%"   >
        <el-table-column
                label="项目名称"
                width="300">
          <template slot-scope="scope">
            <span class="iconcode" @click="goToPositores(scope.row)">{{scope.row.name.slice(0,1)}}</span>
            <p>{{scope.row.name}}</p>
          </template>
        </el-table-column>
        <el-table-column
                prop="description"
                label="项目描述">
        </el-table-column>
        <el-table-column  width="80"
                prop="depotNum"
                label="代码仓库">
        </el-table-column>
        <el-table-column width="80"
                prop="snippetNum"
                label="代码片段">
        </el-table-column>
        <el-table-column width="80"
                prop="userNum"
                label="项目成员">
        </el-table-column>
        <el-table-column  width="120"
                prop="createTime"
                label="创建时间">
          <template slot-scope="scope">
            {{scope.row.createTime.substring(0,10)}}
          </template>
        </el-table-column>
        <el-table-column width="120"
                prop="lastUpdateTime"
                label="上次更新">
          <template slot-scope="scope">
            {{scope.row.lastUpdateTime.substring(0,10)}}
          </template>
        </el-table-column>
       <!-- <el-table-column  width="60"  prop="lastUpdateTime">
          <template slot-scope="scope">
            <span class="iconlock"></span>
          </template>
        </el-table-column>-->
      </el-table>
      <div  style="margin-top: 20px; text-align: center">
        <el-pagination @size-change="pageSizeChangeHandle" @current-change="pageCurrentChangeHandle" :current-page="page"
                       background  :page-size="limit"   layout="total, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </div>
    <!--//项目-->
  </div>
  </div>
</template>

<script>
// @ is an alias to /src
export default {
  name: 'projects',
    data () {
        return {
            projectValue:'',
            projectData:[],
            page:1,
            limit:10,
            total:0,
            projectName:''
        }
    },
    mounted(){
    var _this=this;
    _this.getDataList()


    },
    methods:{
      //搜索提交
        searchSubmit () {
            console.log('11')
        },
        //行点击事件
        goToPositores (row, event, column) {
            var _this=this;
            console.log(row)
            _this.$store.commit('getDepotId', row.id)
            this.$router.push({
                name: 'projectrepositories',
                query: {
                    'projectId':row.id,
                    'projectName':row.name
                }
            })
        },
        //获取数据
        getDataList(){
            var _this=this;
            _this.axios.defaults.headers.common['token'] = _this.token
            var params = new URLSearchParams();
            params.append("page", _this.page);
            params.append("limit", _this.limit);
            params.append("projectName", _this.projectName);
            this.axios.post(this.config.baseURL + '/app/myProjectListPage',params)
                .then(function (response) {
                    _this.projectData=response.data.pageList.records
                    console.log(" this.projectData",  response.data)
                    _this.total=response.data.pageList.total
                    console.log(" _this.total", _this.total)

                    if(response.data.code!=0){
                        _this.$message({
                            message: response.data.msg,
                            type: response.data.code ==  "warning"
                        });

                    }
                })
        },

        //分页
        pageSizeChangeHandle(val) {
            this.page = 1
            this.limit = val
            this.getDataList()
        },
        // 分页, 当前页
        pageCurrentChangeHandle(val) {
            this.page = val
            this.getDataList()
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
  .home{
    position: relative;
    padding: 15px 30px;
    /*margin-left: 230px;*/
    min-height: calc(100vh - 60px);
    background: #fff;
    border-radius: 8px;
    box-sizing: border-box;
  }
  .home h3{
    font-size: 18px;
    line-height: 40px;
    color: #666;
  }
  .home .box{
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
  .home .iconlock{
    display: block;
    margin: 5px 10px;
    width: 12px;
    height:16px;
    background: url("../../assets/icon_lock.png") no-repeat;
  }

</style>
