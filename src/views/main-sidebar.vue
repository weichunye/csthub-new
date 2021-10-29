<template>
    <div>
        <Header></Header>
        <p class="returnPage" @click="back">返回<i class="el-icon-arrow-left"></i></p>
        <div class="sidebar">
            <el-menu
                    default-active="$router.path"
                    class="el-menu-demo"
                    @open="handleOpen"
                    @close="handleClose"
                    background-color="#003265"
                    text-color="#fff"
                    mode="horizontal"
                    active-text-color="#ffd04b">
                <!--                <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">-->
                <el-menu-item index="/" @click="goDetails('index')">
                    <!--                    <i class="el-icon-menu"></i>-->
                    <span slot="title">工作台</span>
                </el-menu-item>
                <el-menu-item index="/projects" @click="goDetails('projects')">
                    <!--                    <i class="el-icon-folder"></i>-->
                    <span slot="title">项目</span>
                </el-menu-item>
                <el-menu-item index="/projectrepositories"  v-if="!this.$route.query.depotId"  @click="goDetails('projectrepositories')">
                    <!--                    <i class="el-icon-document-copy"></i>-->
                    <span slot="title">代码仓库</span>
                </el-menu-item>
                <el-submenu index="3"  @click="goDetails('projectrepositories')" v-else>
                    <template slot="title">
                        <router-link  :to="{path:'/projectrepositories',query:{projectId:this.$route.query.projectId}}" >
                            <!--                            <i class="el-icon-document-copy"></i>-->
                            <span>代码仓库</span>
                        </router-link>
                    </template>
                    <el-menu-item index="4-2"  @click="goDetails('repositorydetail')">源码</el-menu-item>
                    <el-menu-item index="4-3"  @click="goDetails('branch')">分支管理</el-menu-item>
                    <!-- <el-menu-item index="4-4"  @click="goDetails('MergeList')" >合并请求</el-menu-item>-->
                    <el-menu-item index="4-1"   @click="goDetails('member')">成员管理</el-menu-item>
                    <el-menu-item index="4-5" @click="goDetails('commiterecord')">提交记录</el-menu-item>
                </el-submenu>
                <el-menu-item index="/snippets"  @click="goDetails('snippets')">
                    <!--                    <i class="el-icon-postcard"></i>-->
                    <span slot="title">代码片段</span>

                </el-menu-item>
                <!--     <el-menu-item index="6">
                         <i class="el-icon-setting"></i>
                         <span slot="title">合并请求</span>
                     </el-menu-item>-->



                <el-menu-item index="/creatssh"  @click="goDetails('creatssh')">
                    <!--                    <i class="el-icon-setting"></i>-->
                    <span slot="title">公钥管理</span>
                </el-menu-item>
                <el-menu-item index="/MergeList"  @click="goDetails('MergeList')">
                    <!--                    <i class="el-icon-edit-outline"></i>-->
                    <span slot="title">合并请求</span>
                </el-menu-item>
                <el-menu-item index="/resetPassWord"  @click="resetPassWord()">
                    <!--                    <i class="el-icon-edit"></i>-->
                    <span slot="title">重置HTTP克隆独立密码</span>
                </el-menu-item>
                <!--   <el-menu-item index="8">
                       <i class="el-icon-setting"></i>
                       <span slot="title">源码</span>
                   </el-menu-item>-->
            </el-menu>

        </div>
        <el-dialog title="重置HTTP克隆独立密码"  :visible.sync="resetPassWordDialog" :show-close="false"  :close-on-click-modal="false">
            <el-form :model="clonePwdForm"  :rules="rules4" ref="clonePwdForm">
                <el-form-item label="设置密码" prop="pwdVal" >
                    <el-input type="password" v-model="clonePwdForm.pwdVal" ></el-input>
                </el-form-item>
                <el-form-item   label="确认密码" prop="pwdValRe" >
                    <el-input type="password" v-model="clonePwdForm.pwdValRe" ></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="checkPwd('clonePwdForm') ">确 定</el-button>
                <el-button @click="resetFormPassWordDialog('clonePwdForm')">取 消</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    import Header from "./header";

    export default {
        name: 'MainSidebar',
        components: {
            Header,
        },
        props: {
            msg: String
        },
        data() {
            return {
                dialogProjectForm: false,//新建项目
                dialogRepository: false,//仓库
                dialogCode: false,//仓库
                formLabelWidth: '130px',
                messageLength:'',
                projectList:[],
                resetPassWordDialog:false,
                clonePwdForm:{
                    pwdVal:'',
                    pwdValRe:''
                },
                rules4: {
                    pwdVal: [{ required: true,message: '请填写密码', trigger: 'blur'}],
                    pwdValRe: [{ required: true,message: '请重复填写密码', trigger: 'blur'}],
                },
            }
        },
        mounted() {
            /* console.log(" this.$store.state.userInfo)",JSON.parse(this.$store.state.userInfo).userId )*/
            console.log("window.location.href ", this.$route.params.path)
            this.routePath = this.$route.path;
            console.log(" this,routePath", this.routePath)
            let path = this.$route.path;
            this.navConfig = [
                {index:'1',path:['/system/aa','/system/bb','/system/cc']},
            ];
            let thisNav = this.navConfig.find(item =>{
                return item.path.includes(path);
            });
            this.defaultOpeneds = [thisNav.index];

        },
        methods: {
            resetPassWord(){
                this.resetPassWordDialog=true

            },
            resetFormPassWordDialog(formName) {
                this.$refs[formName].resetFields();
                this.resetPassWordDialog=false
            },
            checkPwd(formName) {
                var _this = this;
                _this.axios.defaults.headers.common['token'] = _this.token
                var params = new URLSearchParams();
                params.append("httpClonePwd", _this.clonePwdForm.pwdVal);
                this.$refs[formName].validate((valid) => {
                    if(valid){
                        if(_this.clonePwdForm.pwdVal!=_this.clonePwdForm.pwdValRe){
                            _this.$message({
                                message: "两次密码需保持一致",
                                type: "warning"
                            });
                            return
                        }
                        _this.axios.post(this.config.baseURL + '/app/key/setHttpClonePwd', params)
                            .then(function (response) {
                                if(response.data.code==0){
                                    sessionStorage.setItem("isSetHttpClonePwd",1)
                                    _this.isSetHttpClonePwd=false
                                    _this.$message({
                                        message:"重置HTTP克隆独立密码成功",
                                        type: response.data.code == 0 ? "success" : "warning"
                                    });
                                    _this.resetPassWordDialog=false
                                    _this.$refs[formName].resetFields();
                                }
                            })
                    }
                });
            },
            goDetails(ele){
                var _this=this
                var name=""
                var params={}
                if(ele=="index"){
                    name="/"
                    params={}
                }
                if(ele=="projects"){
                    name="/projects"
                    params={}
                }
                if(ele=="projectrepositories"){
                    name="/projectrepositories"
                    params={projectId:this.$route.query.projectId}
                }
                if(ele=="repositorydetail"){
                    name="/repositorydetail"
                    params={depotId:this.$route.query.depotId,projectId:this.$route.query.projectId}
                }
                if(ele=="branch"){
                    name="/branch"
                    params={depotId:this.$route.query.depotId,projectId:this.$route.query.projectId}
                }
                if(ele=="MergeList"){
                    name="/MergeList"
                    params={depotId:this.$route.query.depotId,projectId:this.$route.query.projectId}
                }
                if(ele=="commiterecord"){
                    name="/commiterecord"
                    params={depotId:this.$route.query.depotId,projectId:this.$route.query.projectId}
                }
                if(ele=="member"){
                    name="/member"
                    params={depotId:this.$route.query.depotId,projectId:this.$route.query.projectId}
                }
                if(ele=="snippets"){
                    name="/snippets"
                    params={}
                }
                if(ele=="creatssh"){
                    name="/creatssh"
                    params={}
                }
                console.log("name",name)
                console.log("params",params)

                setTimeout(() => { //路由跳转
                    _this.$router.push({path:name,query:params});
                }, 100)


            },
            handleOpen(key, keyPath) {
                console.log(key, keyPath);
            },
            handleClose(key, keyPath) {
                console.log(key, keyPath);
            },
            back(){
                this.$router.go(-1);//返回上一层
            },
        }
    }
</script>
<style scoped>
    ul {
        list-style-type: none;
        padding: 0;
    }

    a {
        color: #fff;

    }

    .sidebar {
        position: fixed;
        left:0;
        top:0;
        bottom: 0;
        width: 100%;
        /*z-index: 9;*/
        display: block;
        padding:33px 0px 0;
    }
    .sidebar  .el-menu{
        border: none;
        padding-left:50px;
        border-bottom:1px solid rgba(255,255,255,0.3);
    }
    .sidebar  .el-menu .is-active span{
        color:rgb(255, 208, 75);
    }
    .sidebar .el-menu--horizontal li{
        padding:0 30px!important;
    }
    .sidebar .el-menu--horizontal li.is-active{
        background-color: rgb(255, 208, 75) !important;
    }
    .el-menu-item.is-active i{
        color:#ffffff!important;
    }
    .sidebar span{
        color: #fff!important;
    }
    .returnPage{
        position: fixed;
        right: 50px;
        top: 53px;
        font-size: 15px;
        color: #ffffff;
        line-height: 20px;
        z-index: 100;
        cursor: pointer;
    }
    .returnPage i{
        color: #ffffff;
        margin-left: 5px;
        transform:rotate(180deg);
    }

</style>
