<template>
  <div>
  <div class="commiterecord">
    <h3>提交记录</h3>

    <div class="block" style="margin-top: 20px">
      <el-timeline>
        <el-timeline-item v-for="item in cordList"  :timestamp="item.commitDate" placement="top">
          <el-card>
            {{item.path}}
            <span class="imgbor" @click="toCommiteList(item.sha,item.path)">{{item.shortMessage.slice(0,1)}}</span>
           <!-- <span class="imgbor">{{item.shortMessage.slice(0,1)}}</span>-->
            <h4>{{item.shortMessage}}</h4>
            <p>{{item.committer.name}} 提交于 {{item.commitDate}} <span style="float: right">{{item.sha}}</span> </p>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </div>
    <div style="margin-top: 30px; text-align: center">
      <el-pagination @size-change="pageSizeChangeHandle" @current-change="pageCurrentChangeHandle"
                     :current-page="page"
                     background :page-size="limit" layout=" prev, next ">
      </el-pagination>
    </div>

  </div>


  </div>
</template>

<script>
// @ is an alias to /src
import MainSidebar from '../main-sidebar.vue';
import CodeSidebar from '../code-sidebar.vue';
export default {
  name: 'commiterecord',
  components: {
      MainSidebar,
      CodeSidebar
  },
    data () {
        return {
            dialogFormBranch:false,
            branchValue:'',
            cordData:[],
            cordList:'',
            page:1,
            limit:10,
            total:1,
            branchName:'master'
        }
    },
    mounted(){
      this.getCordList()
    },
    methods:{
      //搜索提交
        searchSubmit () {
            console.log('11')
        },
        getCordList(){
            var _this = this;
            /*this.$route.query.id;*/
           /* _this.axios.defaults.headers.common['token'] = _this.token*/
           console.log("_this.page",_this.page)
            var params = new URLSearchParams();
            params.append("depotId",this.$route.query.depotId);
            params.append("page", _this.page);
            params.append("limit", _this.limit);
            params.append("ref", _this.branchName);
            params.append("path", '');
            _this.axios.post(this.config.baseURL + '/app/depot/getCommits', params)
                .then(function (response) {
                    console.log(" response", response.data)
                    if(response.data.pageList.records.length==0){
                        if(_this.page>1){
                            _this.$message({
                                message: '已经是最后一页了',
                                type: 'warning'
                            });
                        }if(_this.page==1){
                            _this.$message({
                                message: '已经是第一页了',
                                type: 'warning'
                            });
                        }

                        return false
                    }
                    _this.cordData=response.data.pageList;
                    _this.cordList=response.data.pageList.records.slice(1,response.data.pageList.records.length)

                })
        },
      //记录列表
      toCommiteList(id,path){
        console.log("id",id)
        this.$router.push({
          name: 'commiterecordlist',
          query: {
            'sha':id,
            'depotId':this.$route.query.depotId,
            'path':path
          }
        })
      },
        //记录详情
        toCommiteDetal(id,path){
            console.log("id",id)
            this.$router.push({
                name: 'commitdetail',
                query: {
                    'sha':id,
                    'path':path
                }
            })
        },
        //分页
        pageSizeChangeHandle(val) {
            this.page = 1
            this.limit = val
            this.getCordList
        },
        // 分页, 当前页
        pageCurrentChangeHandle(val) {
            var _this=this;
            console.log(val)
            _this.page = val
            _this.getCordList()
        }
          ,
        //行点击事件
        goToPositores (row, event, column) {
            console.log(row)
            this.$router.push({
                name: 'projectrepositories',
                query: {
                    'id':row.id,
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


  .commiterecord{
    position: relative;
    margin:15px;
    padding: 15px 30px;
    margin-left: 310px;
    min-height: calc(100vh - 60px);
    background: #fff;
    border-radius: 8px;
  }
  .commiterecord .imgbor{
    float: left;
    margin: 5px 10px 0 0;
    width: 36px;
    height:36px;
    color: #fff;
    line-height: 36px;
    text-align: center;
    background: #195487;
    border-radius: 50%;
  }
  .commiterecord h3{
    font-size: 18px;
    line-height: 40px;
    color: #666;
  }
  .commiterecord .box{
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
  .commiterecord .iconlock{
    display: block;
    margin: 5px 10px;
    width: 12px;
    height:16px;
    background: url("../../assets/icon_lock.png") no-repeat;
  }
  .commiterecord .iconcode{
    float: left;
    margin-right: 10px;
    display: inline-block;
    width: 26px;
    height: 26px;
    background: url("../../assets/icon_code.png") no-repeat;
    background-size: cover;
  }
  .commiterecord .menmerList{
    width: 100%;
    display: block;
    overflow: hidden;
    color: #333;
    font-size: 14px;
    line-height: 50px;
    border-bottom: 1px solid #dedede;
  }
  .commiterecord .menmerList dt{
    float: left;

  }
  .commiterecord .menmerList dd{
    float: right;
    margin-right: 10px;
  }

</style>
