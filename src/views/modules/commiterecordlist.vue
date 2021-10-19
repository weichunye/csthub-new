<template>
  <div>
  <div class="commiterecord">
    <h3>提交记录</h3>

    <div class="block" style="margin-top: 20px">
      <el-timeline>
        <el-timeline-item v-for="item in fileList"  :timestamp="item.commitDate" placement="top">
          <el-card >
            <p @click="toCommiteDetal(item.commitId,item.name)">
              {{item.name}}
            </p>

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
  name: 'commiterecordlist',
  components: {
      MainSidebar,
      CodeSidebar
  },
    data () {
        return {
          newSha:'',
            branchValue:'',
            cordData:[],
            cordList:'',
            page:1,
            limit:5,
            total:1,
            branchName:'master',
            fileList:[]
        }
    },
    mounted(){
      this.getCordList()
      this.getWebhookData()
    },
    methods:{
      //获取top更新信息
      getWebhookData(){
        var _this=this;
        this.axios.get(this.config.baseURL + '/app/user/*/project/*/git/tree/** ',{params:{
            'depotId':this.$route.query.depotId,
            'ref':"master",
          }})
                .then(function (response) {
                  _this.newSha=response.data.headCommit.commitId
                  _this.getRecordList()
                  console.log("  _this.newSha",  _this.newSha)

                })
      },
      //获取提交文件列表
      getRecordList(){
        var _this=this;
        var params = new URLSearchParams();
        params.append("depotId",this.$route.query.depotId);
        params.append("bashSha",this.$route.query.sha);
        params.append("sha",_this.newSha);
        params.append("path", "");
        _this.axios.post(_this.config.baseURL + '/app/diff/getDiffEntriesRaw',params)
                .then(function (response) {
                  _this.fileList=response.data.diff.stat.paths
                  console.log(" _this.fileList", _this.fileList)
                })
      },
      //搜索提交
        searchSubmit () {
            console.log('11')
        },
        getCordList(){
            var _this = this;
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
                    _this.cordList=response.data.pageList.records;

                })
        },
        //记录详情
        toCommiteDetal(id,path){
            console.log("id",id)
            this.$router.push({
                name: 'commitdetail',
                query: {
                    'sha':this.$route.query.sha,
                    'path':path,
                    'depotId':this.$route.query.depotId

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
