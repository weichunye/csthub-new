<template>
    <div>
        <div class="positories">

            <el-row>
                <el-col :span="24">
                    <div class="top">
                       <!-- <img src="../../assets/photo.jpg"/>-->
                        <!--<p>创建者  &nbsp  /</p>-->
                        <el-row>
                            <el-col :span="16">
                                <h3 v-if="projectName">{{projectName}}</h3>
                                <h3 v-else>仓库</h3>
                            </el-col>
                            <el-col :span="8">
                                <router-link :to="{path:'/member',query:{membertype:'project',projectId:this.$route.query.projectId}}">
                                <el-button v-if="this.$route.query.projectId" style="float: right" type="primary" plain>成员管理</el-button>
                                </router-link>
                            </el-col>
                        </el-row>

                    </div>
                </el-col>
                <el-col :span="4">
                <!--    <el-select size="medium" v-model="projectId" placeholder="请选择" @change="">
                        <el-option
                                v-for="item in projectOptions"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>-->
                </el-col>
            </el-row>
            <el-row style="margin-top: 20px">
                <el-col :span="5">
                    <el-input v-model="depotValue" size="medium" placeholder="输入仓库名称"  @keyup.enter.native="searchSubmit"></el-input>
                </el-col>
                <el-col :span="1"> &nbsp</el-col>
                <el-col :span="4">
                    <el-select size="medium" v-model="limitsType" placeholder="请选择" @change="searchSubmit()">
                        <el-option
                                v-for="item in limitsTypeOption"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :span="1"> &nbsp</el-col>
                <el-col :span="2">
                    <el-button type="primary" size="medium" @click="searchSubmit()">查询</el-button>

                </el-col>
                <el-col :span="3">
                    <el-button  size="medium" @click="resetFrom()">重置</el-button>
                </el-col>

            </el-row>
          <!--  <el-row style="margin: 30px 0 10px">
                <el-col :span="2">
                    <el-button size="medium">全部</el-button>
                </el-col>
                <el-col :span="2">
                    <el-button size="medium">公有</el-button>
                </el-col>
                <el-col :span="2">
                    <el-button size="medium">私有</el-button>
                </el-col>
                <el-col :span="4">
                    <el-select size="medium" v-model="languageVal" placeholder="请选择语言">
                        <el-option
                                v-for="item in languageOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :span="2"></el-col>
                <el-col :span="2"></el-col>
            </el-row>-->
            <!--项目-->
            <div class="box">
                <el-table class="projectData"
                          :data="projectData"
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
                    <el-table-column  width="120"
                            prop="createTime"
                            label="创建时间">
                        <template slot-scope="scope">
                            {{scope.row.createTime.substring(0,10)}}
                        </template>
                    </el-table-column>
                    <el-table-column   width="120"
                            prop="name"
                            label="上次更新">
                        <template slot-scope="scope">
                            {{scope.row.lastUpdateTime}}
                        </template>
                    </el-table-column>
                    <el-table-column  width="80"  prop="lastUpdateTime">
                        <template slot-scope="scope">
                            <!-- <span class="iconlock"></span>-->
                            <el-button v-if="scope.row.ownerId==userId" type="danger" @click="delDeport(scope.row)" size="mini">删除</el-button>
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
                    <el-pagination @size-change="pageSizeChangeHandle" @current-change="pageCurrentChangeHandle"
                                   :current-page="page"
                                   background :page-size="limit" layout="total, prev, pager, next, jumper" :total="total">
                    </el-pagination>
                </div>
            </div>
            <!--//项目-->
        </div>
    </div>
</template>

<script>
    // @ is an alias to /src
    import ProjsetsSidebar from '../projects-sidebar.vue';
    import MainSidebar from '../main-sidebar.vue';
    export default {
        name: 'projectrepositories',
        components: {
            ProjsetsSidebar,
            MainSidebar
        },
        data() {
            return {
                projectName:'',
                depotValue: '',
                projectId: '',
                page: 1,
                limit:10,
                total: 0,
                projectOptions: [ ],
                projectData: [],
                limitsType:'',
                userId:this.userId,
                limitsTypeOption:[
                    { 'name':'  私有  ',
                        id:1
                    },
                    { 'name':'  公有  ',
                        id:2
                    },
                ],
            }
        },
        mounted() {
            var _this=this
            console.log("00000000000000000000userId",this.userId)
            _this.userId==this.userId
            console.log("111111111111111",  _this.userId)
          this.projectName=this.$route.query.projectName
            this.getProjectList()
            console.log("this.$route.query.projectId",this.$route.query.projectId)
            if(this.$route.query.projectId){
                console.log("000")
                this.getDataList()

            }else{
                console.log("LL")
                this.getAllDeopr()
            }
            this.$store.commit('getProjectId', this.$route.query.projectId)
        },
        watch: {
            '$route'(to, from) {
                //监控路由，更新tab
                if(this.$route.query.projectId){
                    this.getDataList()
                }else{
                    this.getAllDeopr()
                }}
        },
        methods: {
            searchSubmit() {
                if(this.$route.query.projectId){
                    this.getDataList()
                }else{
                    this.getAllDeopr()
                }
            },
            resetFrom(){
                var _this=this;
                _this.depotValue=''
                _this.limitsType=''
                _this.searchSubmit()
            },
            getAllDeopr(){
                var _this = this;
                /*this.$route.query.id;*/
                var params = new URLSearchParams();
                params.append("page", _this.page);
                params.append("limit", _this.limit);
                params.append("depotName", _this.depotValue);
                params.append("projectId", "");
                params.append("accessLevel",  _this.limitsType)
                this.axios.post(this.config.baseURL + '/app/depot/myDepotListPage ', params)
                    .then(function (response) {
                        console.log(" response", response.data)
                        _this.projectData = response.data.pageList.records
                        _this.total= response.data.pageList.total
                    })
            },
            //获取数据
            getDataList(val) {
                var _this = this;
                /*this.$route.query.id;*/
                var params = new URLSearchParams();
                params.append("page", _this.page);
                params.append("limit", _this.limit);
                params.append("projectId", _this.$route.query.projectId);
                params.append("depotName", ""/*_this.$route.query.projectName*/);
                params.append("accessLevel",  _this.limitsType);
                this.axios.post(this.config.baseURL + '/app/getProjectDepotList ', params)
                    .then(function (response) {
                        console.log(" response", response.data)
                        _this.projectData = response.data.pageList.records
                        _this.total= response.data.pageList.total
                        if (response.data.code != 0) {
                            _this.$message({
                                message: response.data.msg,
                                type: response.data.code == "warning"
                            });
                        }
                    })
            },
            getProjectList(){
                var _this = this;
                _this.axios.defaults.headers.common['token'] = _this.token
                this.axios.post(this.config.baseURL + '/app/myProjectList  ')
                    .then(function (response) {
                        console.log(" 1112", response.data)
                        _this.projectOptions = response.data.list

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
            //删除
            delDeport(row){
                console.log("row",row)
                var _this=this;
                _this.$confirm('确定删除该仓库?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    _this.axios.defaults.headers.common['token'] = _this.token
                    var params = new URLSearchParams();
                    params.append("depotId",row.id);
                    this.axios.post(this.config.baseURL + '/app/depot/deleteDepot',params)
                        .then(function (response) {
                            var  msgType=response.data.code==0?'success':'warning'
                            _this.$message({
                                message: response.data.msg,
                                type: msgType
                            });
                            if(_this.$route.query.projectId){
                                _this.getDataList()
                            }else{
                                _this.getAllDeopr()
                            }
                        })
                })

            },
            //分页
            pageSizeChangeHandle(val) {
                this.page = 1
                this.limit = val
                if(this.$route.query.projectId){
                    this.getDataList()
                }else{
                    this.getAllDeopr()
                }
            },
            // 分页, 当前页
            pageCurrentChangeHandle(val) {
                this.page = val
                if(this.$route.query.projectId){
                    this.getDataList()
                }else{
                    this.getAllDeopr()
                }
            }
        }
    }
</script>
<style scoped>
    * {
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

    .positories {
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

    .positories .top {
        width: 100%;
        line-height: 40px;

    }

    .positories .top img {
        float: left;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        border: 1px solid #dedede;
    }

    .positories .top p {
        float: left;
        margin: 0 10px;
        font-size: 14px;
        color: #999;
    }

    .positories .top h3 {
        font-size: 18px;
        color: #000;
    }

    .entrepottable h4 {
        width: 100%;
        font-size: 14px;

    }

    .entrepottable p {
        overflow: hidden;
        display: block;
        width: 100%;
    }

    .entrepottable p span {
        font-size: 12px;
        color: #999;
    }

    .entrepottable .el-table td {
        padding: 6px 0;
    }

    .positories .iconlock {
        display: block;
        margin: 5px 10px;
        width: 12px;
        height: 16px;
        background: url("../../assets/icon_lock.png") no-repeat;
    }

    .positories  .iconcode{
        float: left;
        margin-right: 10px;
        display: inline-block;
        width: 26px;
        height: 26px;
        line-height: 26px;
        text-align: center;
        /*background: #438dd1;*/
        border-radius: 50%;
        color: #438dd1;
        font-style: italic;
        cursor: pointer;
        padding-right: 10px;
        font-weight: bold;
        border-right: 1px solid #dedede;
    }
</style>
