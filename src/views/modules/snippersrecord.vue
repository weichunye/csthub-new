<template>
  <div>
  <div class="snippersrecord">
    <h3>代码片段历史</h3>
    <div class="block" style="margin-top: 20px">
      <el-timeline>
        <el-timeline-item v-for="item in snippetList"  :timestamp="item.createTime" placement="top">
          <el-card>
           <!-- <span class="imgbor" @click="toCommiteDetal(item)">{{picName=item.description?item.description.slice(0,1):''}}</span>-->
            <span class="imgbor">{{picName=item.description?item.description.slice(0,1):''}}</span>
            <h4>{{item.description=item.description?item.description:'暂无简介'}}</h4>
            <p>{{item.createUserName?item.createUserName:'null'}}： 提交于 {{item.createTime}} <span style="float: right">{{item.version}}</span> </p>
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
export default {
  name: 'snippersrecord',
    data () {
        return {
          snippetList:'',
            page:1,
            limit:5,
            total:1,
            branchName:'master',
            picName:''
        }
    },
    mounted(){
      this.getCordList()
    },
    methods:{
        getCordList(){
                var _this=this;
                this.axios.get(this.config.baseURL + '/app/snippetversion/list',{params:{
                    'snippetId': this.$route.query.snippetsId,
                }})
                    .then(function (response) {
                        if(response.data.page.list.length==0){
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
                        _this.snippetList=response.data.page.list
                        console.log(" _this.snippetList",  _this.snippetList)
                    })

        },
        //记录详情
        toCommiteDetal(item){
            localStorage.setItem('snippetsId',item.snippetId)
            this.$router.push({
                name: 'snipperrecorddetail',
                query: {
                    'id':item.snippetId,
                    'sha':item.version
                }
            })
        },
        //分页
        pageSizeChangeHandle(val) {
            this.page = 1
            this.limit = val
            this.getCordList()
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


  .snippersrecord{
    position: relative;
    margin: 90px 15px 15px;
    padding: 15px 30px;
    margin-left: 310px;
    min-height: calc(100vh - 60px);
    background: #fff;
    border-radius: 8px;
  }
  .snippersrecord .imgbor{
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
  .snippersrecord h3{
    font-size: 18px;
    line-height: 40px;
    color: #666;
  }
  .snippersrecord .box{
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
  .snippersrecord .iconlock{
    display: block;
    margin: 5px 10px;
    width: 12px;
    height:16px;
    background: url("../../assets/icon_lock.png") no-repeat;
  }
  .snippersrecord .iconcode{
    float: left;
    margin-right: 10px;
    display: inline-block;
    width: 26px;
    height: 26px;
    background: url("../../assets/icon_code.png") no-repeat;
    background-size: cover;
  }
  .snippersrecord .menmerList{
    width: 100%;
    display: block;
    overflow: hidden;
    color: #333;
    font-size: 14px;
    line-height: 50px;
    border-bottom: 1px solid #dedede;
  }
  .snippersrecord .menmerList dt{
    float: left;

  }
  .snippersrecord .menmerList dd{
    float: right;
    margin-right: 10px;
  }

</style>
