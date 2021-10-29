<template>
  <div>
  <div class="messagelist">
    <h3>消息</h3>
    <!--项目-->
    <div class="box">
     <ul class="newslist">
       <li v-for="item in messageData">
            <p v-html="item.invitationHtml " ></p>
            <span>{{item.invitationTime}}</span>
         <div style="display: block; text-align: right">
           <el-button type="success" plain @click="agreeInfo(item.activeCode)">接受邀请</el-button>
         </div>
       </li>
     </ul>

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
import MainSidebar from '../main-sidebar.vue';
import HomeSidebar from '../home-sidebar.vue';
export default {
  name: 'messagelist',
  components: {
      MainSidebar,
      HomeSidebar
  },
    data () {
        return {
            projectValue:'',
            messageData:[],
            page:1,
            limit:1,
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
            localStorage.setItem('projectId', row.id )
            localStorage.setItem('projectName',row.name)
            this.$router.push({
                name: 'projectrepositories',
                query: {
                    'id':row.id,
                    'projectName':row.name
                }
            })
        },
        //获取数据
        getDataList(){
            var _this=this;
            _this.axios.defaults.headers.common['token'] = _this.token
            this.axios.get(this.config.baseURL + '/app/depot/invitationWaitList',{params:{
                    "page":_this.page,
                    "limit":_this.limit,
                    /* "depotId":_this.$route.query.depotId*/

                }})
                .then(function (response) {
                    _this.messageData=response.data.list
                    console.log("_this.messageData.length",_this.messageData)
                    _this.total= _this.messageData.length
                    _this.$refs.child.messageLength= _this.messageData.length


                })
        },
        //同意邀请
        agreeInfo(code){
            var _this=this;
            _this.axios.defaults.headers.common['token'] = _this.token
            this.axios.get(this.config.baseURL + '/app/depot/activeInvitation',{params:{code:code}})
                .then(function (response) {
                    console.log(" this.messageData",  response.data)
                    var  msgType=response.data.code==0?'success':'warning'
                    _this.$message({
                        message: response.data.msg,
                        type: msgType
                    });
                    _this.$router.go(0);

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
  a {
    color: #42b983;
  }
 .messagelist{
    position: relative;
    margin:110px 15px  15px;
    padding: 15px 30px;
    min-height: calc(100vh - 60px);
    background: #fff;
    border-radius: 8px;
  }
 .messagelist h3{
    font-size: 18px;
    line-height: 40px;
    color: #666;
  }
 .messagelist .box{
    margin-top: 20px;
    width: 100%;
  }
 .messagelist .box .morelink{
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
  .messagelist  .newslist span{
      font-size: 12px;
      line-height: 30px;
      color: #999;
  }

 .messagelist .iconlock{
    display: block;
    margin: 5px 10px;
    width: 12px;
    height:16px;
    background: url("../../assets/icon_lock.png") no-repeat;
  }
 .messagelist .iconcode{
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
  .messagebox{
    font-size: 14px;
    line-height: 18px;
    color: #999;
  }
  .messagebox h1{
    font-size: 14px;
    line-height: 18px;
    color: #999;
  }
  .newslist{
    width: 100%;
  }
  .newslist li{
    margin-top: 10px;
    width: 100%;
  }
  .newslist li p{
   width: 100%;
    font-size: 14px;
    line-height: 20px;
    color: #333;
  }
  .newslist li p h1{
      font-size: 14px;
  }
  .newslist li span{
    display: block;
    width: 100%;
    line-height: 30px;
    text-align: right;
  }
  .newslist  h1{
      font-size: 14px;
  }
  .newslist p{
      font-size: 14px;
  }
</style>
