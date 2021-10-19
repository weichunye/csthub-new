<template>
    <div class="search">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="项目" name="first">
          <el-table class="projectData"
                    :data="projectList"
                    style="width: 100%"   >
            <el-table-column  width="300"
                    label="项目名称">
              <template slot-scope="scope">
                <span class="iconcode" @click="goToProjects(scope.row)">{{scope.row.name.slice(0,1)}}</span>
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
            <el-table-column  width="180"
                    prop="createTime"
                    label="创建时间">
              <template slot-scope="scope">
                {{scope.row.createTime.substring(0,10)}}
              </template>
            </el-table-column>
            <el-table-column  width="180"
                    prop="lastUpdateTime"
                    label="上次更新">
              <template slot-scope="scope">
                {{scope.row.lastUpdateTime.substring(0,10)}}
              </template>
            </el-table-column>
          </el-table>
          <div style="margin-top: 30px; text-align: center">
            <el-pagination @size-change="projectSizeChangeHandle" @current-change="projectCurrentChangeHandle"
                           :current-page="project.page"
                           background :page-size="project.limit" layout="total, prev, pager, next, jumper" :total="project.total">
            </el-pagination>
          </div>
        </el-tab-pane>
        <el-tab-pane label="仓库" name="second">
          <el-table class="projectData"
                    :data="depotList"
                    style="width: 100%">
            <el-table-column  width="300"
                    prop="fragmentName"
                    label="仓库名称">
              <template slot-scope="scope">
                <span class="iconcode"  @click="goToDetail(scope.row)">{{scope.row.name.slice(0,1)}}</span>
                <p>{{scope.row.name}}</p>
              </template>

            </el-table-column>
            <el-table-column
                    prop="description"
                    label="描述">
            </el-table-column>
            <el-table-column  width="180"
                    prop="createTime"
                    label="创建时间">
              <template slot-scope="scope">
                {{scope.row.createTime.substring(0,10)}}
              </template>
            </el-table-column>
            <el-table-column  width="180"
                    prop="name"
                    label="上次更新">
              <template slot-scope="scope">
                {{scope.row.lastUpdateTime}}
              </template>
            </el-table-column>
            <!--     <el-table-column width="120" prop="">
                     <template slot-scope="scope">
                         <span  style="float: left" class="iconlock"></span>
                     &lt;!&ndash;    <el-button plain size="small">修改</el-button>&ndash;&gt;
                     </template>
                 </el-table-column>-->
          </el-table>
          <div style="margin-top: 30px; text-align: center">
            <el-pagination @size-change="deportSizeChangeHandle" @current-change="deportCurrentChangeHandle"
                           :current-page="deport.page"
                           background :page-size="deport.limit" layout="total, prev, pager, next, jumper" :total="deport.total">
            </el-pagination>
          </div>
        </el-tab-pane>
        <el-tab-pane label="代码片段" name="third">
          <el-table class="projectData"
                    :data="snippetList"
                    style="width: 100%"    >
            <el-table-column
                    label="片段名称"
                    prop="name">
              <template slot-scope="scope">
                <span class="iconcode" @click="goToPositores(scope.row)"> {{scope.row.name.slice(0,1)}}</span>
                <p>{{scope.row.name}}</p>
              </template>
            </el-table-column>
            <el-table-column
                    prop="username"
                    label="创建人">
            </el-table-column>
            <el-table-column  width="180"
                    prop="createTime"
                    label="创建时间">
              <template slot-scope="scope">
                {{scope.row.createTime.substring(0,10)}}
              </template>
            </el-table-column>
            <el-table-column  width="180"
                    prop="updateTime"
                    label="上次更新">
              <template slot-scope="scope">
                {{scope.row.updateTime.substring(0,10)}}
              </template>
            </el-table-column>
          </el-table>
          <div style="margin-top: 30px; text-align: center">
            <el-pagination @size-change="snippetSizeChangeHandle" @current-change="snippetCurrentChangeHandle"
                           :current-page="snipet.page"
                           background :page-size="snipet.limit" layout="total, prev, pager, next, jumper" :total="snipet.total">
            </el-pagination>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
</template>

<script>
  // @ is an alias to /src
  export default {
    name: 'SearchPage',
    data () {
      return {
        keyWord:'',
        activeName: '',
        dataLisr:'',
        activeName:'first',
        page:1,
        limit:10,
        total:10,
        projectList:'',
        depotList:'',
        snippetList:'',
        project:{
          page:1,
          limit:10,
          total:1,
        },
        deport:{
          page:1,
          limit:10,
          total:1,
        },
        snipet:{
          page:1,
          limit:10,
          total:1,
        },
      }
    },
    mounted(){
      this.keyWord=this.$route.query.keyword
      /*this.getSearchData()*/
      this.getProjectsDataList()
      this.getDeportDataList()
      this.getSnippetDataList()
      /*this.$route.query.id;*/
    },
    watch: {
      '$route'(to, from) {
        this.keyWord=this.$route.query.keyword
        this.getProjectsDataList()
        this.getDeportDataList()
        this.getSnippetDataList()
      }
    },
    methods:{
      handleClick(tab, event) {
        console.log(tab, event);
    },
      //获取项目数据
      getProjectsDataList(){
        var _this=this;
        _this.axios.defaults.headers.common['token'] = _this.token
        var params = new URLSearchParams();
        params.append("page", _this.project.page);
        params.append("limit", _this.project.limit);
        params.append("projectName", _this.keyWord);
        this.axios.post(this.config.baseURL + '/app/myProjectListPage',params)
                .then(function (response) {
                  _this.projectList=response.data.pageList.records
                  _this.project.total=response.data.pageList.total

                  if(response.data.code!=0){
                    _this.$message({
                      message: response.data.msg,
                      type: response.data.code ==  "warning"
                    });

                  }
                })
      },
      //获取仓库数据
      getDeportDataList(val) {
        var _this = this;
        /*this.$route.query.id;*/
        var params = new URLSearchParams();
        params.append("page", _this.deport.page);
        params.append("limit", _this.deport.limit);
        params.append("depotName", _this.keyWord)
        this.axios.post(this.config.baseURL + '/app/getProjectDepotList ', params)
                .then(function (response) {

                  _this.depotList = response.data.pageList.records
                  _this.deport.total= response.data.pageList.total
                  if (response.data.code != 0) {
                    _this.$message({
                      message: response.data.msg,
                      type: response.data.code == "warning"
                    });
                  }
                })
      },
      //获取代码片段数据
      getSnippetDataList(){
        var _this=this;
        this.axios.get(this.config.baseURL + '/app/snippet/list',{params:{
            "page":_this.snipet.page,
            "limit":_this.snipet.limit,
            "name":_this.keyWord,

          }})
                .then(function (response) {
                  _this.snippetList=response.data.page.records
                  _this.snipet.total=response.data.page.total

                  if(response.data.code!=0){
                    _this.$message({
                      message: response.data.msg,
                      type: response.data.code ==  "warning"
                    });

                  }
                })
      },
      //行点击事件
      goToProjects (row, event, column) {
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
      goToDetail(row, event, column) {
        var _this=this
        console.log("_this.$route.query.id",row)
        this.$router.push({
          name: 'repositorydetail',
          query: {
            'projectId':row.projectId,
            'depotId':row.id,

          }
        })
      },
      //行点击事件
      goToPositores (row) {
        var _this=this;
        console.log(row)
        this.$router.push({
          name: 'snipperdetails',
          query: {
            snippetsId:row.id
          }

        })
      },
      getSearchData(e){
        var _this=this;
        var params = new URLSearchParams();
        params.append("keyword", _this.$route.query.keyword);
        _this.axios.post(_this.config.baseURL + '/app/index/search',params)
                .then(function (response) {
                  _this.projectList=response.data.search.projectList
                  _this.project.total=response.data.search.projectList.length
                  _this.depotList=response.data.search.depotList
                  _this.snippetList=response.data.search.snippetList
                  console.log("222222222",response.data)
                })
      },
      //项目分页
      projectSizeChangeHandle(val) {
        console.log(val)
        this.project.page = 1
        this.project.limit = val
        this.getProjectsDataList()
      },
      // 项目分页, 当前页
      projectCurrentChangeHandle(val) {
        console.log("id",val)
        this.project.page = val
        this.getProjectsDataList()
      },
      //仓库分页
      deportSizeChangeHandle(val) {
        console.log("11",val)
        this.deport.page = 1
        this.deport.limit = val
        this.getDeportDataList()
      },
      // 仓库分页, 当前页
      deportCurrentChangeHandle(val) {
        console.log("id",val)
        this.deport.page = val
        this.getDeportDataList()
      },
      //代码片段分页
      snippetSizeChangeHandle(val) {
        console.log("11",val)
        this.snipet.page = 1
        this.snipet.limit = val
        this.getSnippetDataList()
      },
      // 代码片段分页, 当前页
      snippetCurrentChangeHandle(val) {
        console.log("id",val)
        this.snipet.page = val
        this.getSnippetDataList()
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
  .search {
    position: relative;
    margin: 80px 15px 15px;
    padding: 15px 30px;
    margin-left: 310px;
    min-height: calc(100vh - 60px);
    background: #fff;
    border-radius: 8px;}
  .iconcode{
    float: left;
    margin-right: 10px;
    display: inline-block;
    width: 26px;
    height: 26px;
    line-height: 26px;
    color: #fff;
    text-align: center;
    background: #438dd1;
    border-radius: 50%;
    cursor: pointer;
    /*  background: url("../assets/icon_code.png") no-repeat;
      background-size: cover;*/
  }

</style>
