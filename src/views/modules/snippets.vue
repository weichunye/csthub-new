<template>
  <div>
    <div class="home">
      <h3>代码片段</h3>
      <!--项目-->
      <div class="box">
        <el-select size="medium" v-model="ownerType" placeholder="请选择" @change="getDataList('')">
          <el-option
                  v-for="item in ownerTypeOption"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
          </el-option>
        </el-select>
      <!--  <el-form :inline="true"  class="demo-form-inline">
          <el-form-item label="">
            <el-input v-model="snippetsName"  size="medium" placeholder="输入项目名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button size="medium" @click="getDataList">查询</el-button>
          </el-form-item>
        </el-form>-->
        <el-table class="projectData"
                  :data="snippetsData"
                  style="width: 100%"    >
          <el-table-column
                  label="片段名称"
                  width="300"   prop="name">
            <template slot-scope="scope">
              <span class="iconcode" @click="goToPositores(scope.row)"> {{scope.row.name.slice(0,1)}}</span>
              <p>{{scope.row.name}}</p>
            </template>

          </el-table-column>
          <el-table-column
                  prop="username"
                  label="创建人">
          </el-table-column>
          <el-table-column
                  prop="createTime"
                  label="创建时间">
            <template slot-scope="scope">
              {{scope.row.createTime.substring(0,10)}}
            </template>
          </el-table-column>
          <el-table-column
                  prop="updateTime"
                  label="上次更新">
            <template slot-scope="scope">
              {{scope.row.updateTime.substring(0,10)}}
            </template>
          </el-table-column>
          <el-table-column  width="60"  prop="lastUpdateTime">
            <template slot-scope="scope">
             <!-- <span class="iconlock"></span>-->
              <el-button type="danger" @click="delSnippet(scope.row)" size="mini">删除</el-button>
            </template>
          </el-table-column>
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
        name: 'snippets',
        data () {
            return {
                snippetsName:'',
                snippetsData:[],
                page:1,
                limit:10,
                total:0,
                ownerType:1,
                ownerTypeOption:[
                    {
                        id: 1,
                        name:'个人'
                    },
                    {
                        id: 2,
                        name:'项目'
                    },

                ] ,
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
            //获取数据
            getDataList(){
                var _this=this;
                this.axios.get(this.config.baseURL + '/app/snippet/list',{params:{
                    "page":_this.page,
                    "limit":_this.limit,
                    "name":_this.snippetsName,
                    "ownerType":_this.ownerType,
                    "ownerId":'',
                    "createUserId": _this.userId,


                }})
                    .then(function (response) {
                        console.log(" this.projectData",  response.data)
                        _this.snippetsData=response.data.page.records
                        _this.total=response.data.page.total
                        console.log(" _this.total", _this.snippetsData)

                        if(response.data.code!=0){
                            _this.$message({
                                message: response.data.msg,
                                type: response.data.code ==  "warning"
                            });

                        }
                    })
            },
            //删除
            delSnippet(row){
                var _this=this;
              this.$confirm('确定删除该片段代码?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                this.axios.delete(this.config.baseURL + '/app/snippet/delete',{params:{
                    'snippetId':row.id,
                  }})
                        .then(function (response) {
                          var  msgType=response.data.code==0?'success':'warning'
                          _this.$message({
                            message: response.data.msg,
                            type: msgType
                          });
                          _this.getDataList()
                        })
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
    margin:50px 60px;
    padding: 15px 30px;
    margin-top: 150px;
    /*height: 100%;*/
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
  .home .iconcode{
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
