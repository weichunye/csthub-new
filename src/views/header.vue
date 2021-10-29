<template>
    <div>
        <div class="header">
            <div class="holde-div">
                <!-- <img class="logo" src="../assets/logo.png"/>-->
                <p class="logoname">LOGO</p>

            </div>
            <div class="right-div">

                <el-button  class="newproject" v-popover:popover4></el-button>
                <router-link to="messagelist">
                    <i router class="topmessage el-icon-message"></i>
                    <span v-if="messageLength>0" class="topmessagenum">{{messageLength}}</span>
                </router-link>
                <div  class="search-box">

                    <input v-model="keyword"  @keyup.enter="searchSubmit"/>
                    <router-link :to="{path:'/SearchPage',query:{keyword:keyword}}">
                        <button></button>
                    </router-link>

                </div>
                <dl class="userinfo">
                    <!--                    <dt>-->
                    <!--                        <img src="../assets/photo.jpg"/>-->
                    <!--                        <span> </span>-->
                    <!--                    </dt>-->
                    <dd>
                        {{ this.userInfo.trueName }}
                    </dd>
                </dl>
                <a  class="loginout" @click="loginOut"  href="https://passport.escience.cn/logout?WebServerURL=http://www.cstos.cstcloud.cn"></a>


            </div>


        </div>
        <!--新建项目-->
        <el-dialog title="新建项目" :visible.sync="dialogProjectForm" :close-on-click-modal=false>
            <el-form :model="form" :rules="rules1" ref="form">
                <el-form-item label="项目名称" prop="name" :label-width="formLabelWidth">
                    <el-input v-model="form.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="项目简介" prop="desc" :label-width="formLabelWidth">
                    <el-input type="textarea" v-model="form.desc"></el-input>
                    <p  style="margin-left: 5px; font-size: 12px; color: #999"> 限2000字</p>
                </el-form-item>
                <!--  <el-form-item label="是否公开" :label-width="formLabelWidth">
                      <el-radio v-model="form.radio" label="1">私有</el-radio>
                      <el-radio v-model="form.radio" label="2">公开</el-radio>
                  </el-form-item>-->
                <el-form-item>
                    <div style="display: block; text-align: center">
                        <el-button @click="resetForm('form','dialogProjectForm')">取 消</el-button>
                        <el-button type="primary" @click=" newProject('form')">确 定</el-button>
                    </div>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!--//新建项目-->
        <!--新建仓库-->
        <el-dialog title="新建仓库" :visible.sync="dialogRepository" :close-on-click-modal=false>
            <el-form :model="projectForm" :rules="rules2" ref="projectForm" >
                <el-form-item prop="name" label="仓库名称" :label-width="formLabelWidth">
                    <el-input v-model="projectForm.name" autocomplete="off"></el-input>
                    <p style="font-size: 12px; color: #f81d22">仓库名称只允许字母、数字或者下划线(_)、中划线(-)、点(.)</p>
                </el-form-item>
                <el-form-item label="选择项目" :label-width="formLabelWidth">
                    <el-select size="medium" v-model="projectForm.projectId" placeholder="请选择">
                        <el-option
                                v-for="item in projectList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="desc" label="简介" :label-width="formLabelWidth">
                    <el-input type="textarea" v-model="projectForm.desc"></el-input>
                    <p  style="margin-left: 5px; font-size: 12px; color: #999"> 限2000字</p>
                </el-form-item>
                <el-form-item prop="ifPublic"  label="是否公开" :label-width="formLabelWidth">
                    <el-radio v-model="projectForm.ifPublic" label="1">私有</el-radio>
                    <el-radio v-model="projectForm.ifPublic" label="2">公开</el-radio>
                </el-form-item>
                <el-form-item>
                    <div style="display: block; text-align: center">
                        <el-button  @click=" resetForm('projectForm','dialogRepository')">取 消</el-button>
                        <el-button type="primary" @click=" newRepositories('projectForm') ">确 定</el-button>
                    </div>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!--//新建仓库-->
        <!--新建代码片段-->
        <el-dialog title="新建代码片段" :visible.sync="dialogCode" :close-on-click-modal=false>
            <el-form :model="snippetForm"  :rules="rules3" ref="snippetForm">
                <el-form-item label="标题" prop="name" :label-width="formLabelWidth">
                    <el-input v-model="snippetForm.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="代码片段" prop="desc" :label-width="formLabelWidth">
                    <el-input v-model="snippetForm.desc" autocomplete="off" placeholder="简介"></el-input>
                    <el-input :rows="5" style="margin-top: 10px;" type="textarea" v-model="snippetForm.codeSnippet"  placeholder="代码片段"></el-input>
                </el-form-item>
                <el-form-item label="所属类型" prop="ownerType" :label-width="formLabelWidth">
                    <el-select size="medium" v-model="snippetForm.ownerType" placeholder="请选择">
                        <el-option
                                v-for="item in ownerTypeOption"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="snippetForm.ownerType==2" prop="projectId" label="选择项目" :label-width="formLabelWidth">
                    <el-select size="medium" v-model="snippetForm.projectId" placeholder="请选择">
                        <el-option
                                v-for="item in projectList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click=" resetForm('snippetForm','dialogCode')">取 消</el-button>
                <el-button type="primary" @click=" newSnippe('snippetForm') ">确 定</el-button>
            </div>
        </el-dialog>
        <!--//新建代码片段-->
        <!--创建弹出-->
        <el-popover
                ref="popover4"
                placement="top"
                width="120"
                trigger="click">
            <div  class="newbox">
                <el-button @click="newFun(1)" style="margin: 10px;display: block" type="primary" plain>创建项目
                </el-button>
                <el-button @click="newFun(2)" style="margin: 10px;display: block" type="primary" plain>创建仓库
                </el-button>
                <!--  <el-button style="margin: 10px;display: block" type="primary" plain>导入仓库</el-button>-->
                <el-button @click="newFun(3)" style="margin: 10px;display: block" type="primary" plain>代码片段
                </el-button>
            </div>
        </el-popover>
    </div>
</template>

<script>
    export default {
        name: 'Header',
        props: {
            msg: String
        },
        data() {
            return {
                searchVal:'',
                dialogProjectForm: false,//新建项目
                dialogRepository: false,//仓库
                dialogCode: false,//仓库
                formLabelWidth: '130px',
                messageLength:'',
                form: {
                    name: '',
                    affiliation: '',//归属
                    desc: '',//简介,
                    path: '',//路径
                    radio: '1',
                    languageVal: '',
                },
                projectForm: {
                    name: '',
                    isReadme: 0,
                    desc: '',//简介,
                    path: '',//路径
                    projectId: '',
                    ifPublic: '1',
                    languageVal: '',
                },
                snippetForm: {
                    id:'',
                    name: '',
                    desc: '',//简介,
                    codeSnippet: '',
                    language:1,
                    ownerType:1,
                },
                keyword:'',
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
                languageOptions: [
                    {
                        value: '1',
                        label: '黄金糕'
                    },
                    {
                        value: '2',
                        label: '绿豆糕'
                    },
                    {
                        value: '3',
                        label: '切糕糕'
                    },
                    {
                        value: '4',
                        label: '年糕糕'
                    },
                ],
                newbox: false,
                routePath: '',
                rules1: {
                    name: [{ required: true,message: '请填写名称', trigger: 'blur'}],
                    desc: [ { required: true, message: '请填写简介',trigger: 'blur' } ],
                },
                rules2: {
                    name: [{ required: true,message: '请填写名称', trigger: 'blur'}],
                    desc: [ { required: true, message: '请填写简介',trigger: 'blur' } ],
                    projectId:[{ required: true, message: '请选择所属仓库',trigger: 'blur' }],
                    ifPublic:[{ required: true, message: '请选择',trigger: 'blur' }]
                },
                rules3: {
                    name: [{ required: true,message: '请填写名称', trigger: 'blur'}],
                    desc: [ { required: true, message: '请填写简介',trigger: 'blur' } ],
                    ownerType:[{ required: true, message: '所属类型',trigger: 'blur' }],
                    ifPublic:[{ required: true, message: '请选择',trigger: 'blur' }],
                    projectId:[{ required: true, message: '请选择所属项目',trigger: 'blur' }]
                },
                projectList:[]
            }
        },
        mounted() {
            /* console.log(" this.$store.state.userInfo)",JSON.parse(this.$store.state.userInfo).userId )*/
            console.log("userInfo.userId ", this.userInfo )
            this.routePath = this.$route.path;
            console.log(" this,routePath", this.routePath)
            this.token?this.getDataList():''

        },
        methods: {
            searchSubmit() {
                this.$router.push({
                    name: 'SearchPage',
                    query: {
                        keyword:this.keyword
                    }

                })

            },

            newFun(e) {
                this.newbox = false;
                if (e == 1) {
                    this.dialogProjectForm = true
                }
                if (e == 2) {
                    this.getProjectList()
                    this.dialogRepository = true
                }
                if (e == 3) {
                    this.getProjectList()
                    this.dialogCode = true
                }
            },
// 新建项目
            newProject(formName) {
                var _this = this;
                var params = {
                    "description": _this.form.desc,
                    "name": _this.form.name,
                    "ownerId": this.userId,
                };
                if(_this.form.desc.length>2000){
                    _this.$message({
                        message: "简介字数限制为2000字，请重新输入",
                        type: "warning"
                    });
                    return
                }
                this.$refs[formName].validate((valid) => {
                    if(valid){
                        _this.axios.post(this.config.baseURL + '/app/project', params)
                            .then(function (response) {
                                console.log("response", response)
                                if(response.data.code==0){
                                    _this.$message({
                                        message: response.data.msg,
                                        type: response.data.code == 0 ? "success" : "warning"
                                    });
                                    _this.dialogProjectForm = false
                                    _this.$refs[formName].resetFields();
                                    _this.$router.go(0);
                                }
                            })
                    }
                });
            },
            // 新建仓库
            newRepositories(formName) {
                var _this = this;
                console.log("_this.projectForm.ifPublic",_this.projectForm.ifPublic)
                var params = {
                    "description": _this.projectForm.desc,
                    "name": _this.projectForm.name,
                    "accessLevel":_this.projectForm.ifPublic,
                    "isReadme":_this.projectForm.isReadme==true?1:0,
                    "projectId":_this.projectForm.projectId,
                    "ownerId": this.userId ,
                };
                if(_this.projectForm.desc.length>2000){
                    _this.$message({
                        message: "简介字数限制为2000字，请重新输入",
                        type: "warning"
                    });
                    return
                }
                this.$refs[formName].validate((valid) => {
                    if(valid){
                        _this.axios.post(this.config.baseURL + '/app/depot/depot', params)
                            .then(function (response) {
                                console.log("response", response)
                                if(response.data.code==0){
                                    _this.$message({
                                        message: response.data.msg,
                                        type: response.data.code == 0 ? "success" : "warning"
                                    });
                                    _this.dialogRepository  = false
                                    _this.axios.defaults.headers.common['token'] = _this.token
                                    var params1 = new URLSearchParams();
                                    params1.append("projectId", _this.projectForm.projectId);
                                    params1.append("depotId", response.data.depot.id);
                                    params1.append("ref",'master');
                                    /*  params1.append("path",_this.projectForm.name+ '/readme.md');*/
                                    params1.append("path", '.gitkeep');
                                    params1.append("content", 'This is .gitkeep');
                                    params1.append("msg", '.gitkeep');
                                    _this.axios.post(_this.config.baseURL + '/app/'+ _this.projectForm.projectId+'/'+response.data.depot.id+'/commit/master',params1)
                                        .then(function (response) {
                                            if(response.data.code==0){
                                                _this.$refs[formName].resetFields();
                                                _this.$router.go(0);
                                            }
                                        })
                                }
                            })}
                });
            },
            // 新建代码片段
            newSnippe(formName) {
                var _this = this;
                var params = {
                    "name": _this.snippetForm.name,
                    "description":_this.snippetForm.desc,
                    "id":null,
                    "codeSnippet": _this.snippetForm.codeSnippet,
                    "language":1,
                    "ownerId": _this.snippetForm.ownerType==2? _this.snippetForm.projectId:_this.userId,
                    "createUserId": _this.userId ,
                    "ownerType": _this.snippetForm.ownerType,
                    "createUserName": this.userInfo.trueName,
                };
                console.log("params",formName)
                this.$refs[formName].validate((valid) => {
                    if(valid){
                        _this.axios.post(this.config.baseURL + '/app/snippet/save', params)
                            .then(function (response) {
                                console.log("新建代码片段", response)
                                if(response.data.code==0){
                                    _this.$message({
                                        message: response.data.msg,
                                        type: response.data.code == 0 ? "success" : "warning"
                                    });
                                    _this.dialogCode  = false
                                    _this.$refs[formName].resetFields();
                                    _this.$router.go(0);
                                }
                            })}
                });
            },
            //获取邀请消息列表
            getDataList(){
                var _this=this;
                _this.axios.defaults.headers.common['token'] = _this.token
                this.axios.get(this.config.baseURL + '/app/depot/invitationWaitList')
                    .then(function (response) {
                        _this.messageLength=response.data.list.length

                    })
            },
            //获取项目列表
            getProjectList(){
                var _this = this;
                _this.axios.defaults.headers.common['token'] = _this.token
                this.axios.post(this.config.baseURL + '/app/myProjectList  ')
                    .then(function (response) {
                        console.log(" response", response.data)
                        _this.projectList = response.data.list
                        if (response.data.code != 0) {
                            _this.$message({
                                message: response.data.msg,
                                type: response.data.code == "warning"
                            });
                        }
                    })
            },
            //退出登录
            loginOut(){
                var _this = this;
                sessionStorage.clear()
                localStorage.clear();
            },
            //重置
            resetForm(formName,dialogEle) {
                var _this=this;
                _this.$refs[formName].resetFields();
                _this[dialogEle]=false;

            }
        }
    }
</script>
<style scoped>
    *{border: none}
    ul {
        list-style-type: none;
        padding: 0;
    }

    a {
        color: #42b983;
    }

    .header {
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        min-height: 30px;
        line-height:30px;
        background: #EDEEF0;
        padding:0 30px;
        box-sizing: border-box;
        z-index: 11;
    }
    .header .holde-div{
        float: left;
        width: 230px;
        height: 30px;
        margin:3px 0 0 0;
    }
    .header .right-div{
        float: right;
        display:inline-flex;
        align-items: center;
    }
    .header .logo{
        float: left;
        margin:10px;
        height: 40px;
    }
    .header .logoname{
        float: left;
        margin-left:0;
        font-size: 26px;
        font-weight: bold;
        color: #333333;
        letter-spacing: 2px;
    }

    .header .search-box{
        float: left;
        /*margin-top: 13px;*/
        padding: 0 0 0 10px;
        width: 360px;
        height: 32px;
        border: 1px solid #dedede;
        background: #fff;
    }
    .header .search-box input{
        float: left;
        padding-left: 10px;
        width: 268px;
        height: 30px;


        /*border-radius:20px 0 0 20px;*/

    }
    /*    .header .search-box input:focus{
            background: #FFFFFF;
            border: 1px solid #dedede;
            outline:1px solid #fff;
        }*/
    .header .search-box button{
        padding: 0px 10px 0 10px;
        float: right;
        width: 40px;
        height: 32px;
        line-height: 32px;
        text-align: center;
        margin-top: 5px;
        /*color: #fff;*/
        /*background: #4495ca;*/
        /*border: none;*/
        /*border-radius:0 20px 20px 0 ;*/
        background: url("../assets/search.png") no-repeat;
        background-size: 23px ;

    }
    .header  .newproject{
        float: left;
        margin: 0 20px 0 20px;
        width: 18px;
        height: 19px;
        cursor: pointer;
        background: url("../assets/icon_newproject.png") no-repeat center;
        border:none;
        background-size: 30px 30px;
    }
    .header .topmessage{
        float: right;
        margin: 0px 20px 0 0;
        width: 30px;
        height: 30px;
        font-size: 30px;
        color: #de0a1e;
        z-index: 1001;
        cursor: pointer;
    }
    .header .topmessagenum{
        float: right;
        color: #f3e010;
        z-index: 1002;
        background: #F56C6C;
        padding: 2px 5px;
        font-size: 12px;
        line-height: 12px;
        border-radius: 50%;
        color: #fff;
        cursor: pointer;
    }
    .header .userinfo{
        overflow: hidden;
        float: right;
        margin: 0  20px;
    }
    .header .loginout{
        width: 24px;
        height: 24px;
        display: block;
        float: right;
        margin: 0  20px 0 0;
        font-size: 14px;
        color: #d31519;
        background: url("../assets/login-out.png") no-repeat;
        background-size: 25px ;
    }
    .header .userinfo dt {
        float: left;
        position: relative;
        float: left;
    }

    .header .userinfo dt img {
        padding: 2px;
        margin-top: 8px;
        display: block;
        width: 36px;
        height:36px;
        border-radius: 50%;
        border: 1px solid #8ae7f9;
    }
    .header .userinfo dd {
        float: left;
        margin-left: 10px;
        font-size: 14px;
        line-height: 30px;
        color: #000;
        text-align: center;

    }


</style>
