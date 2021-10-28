<template>
  <div>
  <div class="repositorydetail">
    <el-row>
      <el-col :span="24">
        <div class="top">
         <!-- <img src="../../assets/photo.jpg"/>
          <p>项目名称  &nbsp  /</p>-->
          <el-row>
            <el-col :span="14">
              <h3>{{depotName}}</h3>
            </el-col>
           <!-- <el-col :span="10">
              <router-link  :to="{path:'/commiterecord',query:{depotId:this.$route.query.depotId}}">
                <el-button style="float: right" type="primary" plain>提交记录</el-button>
              </router-link>
              <router-link :to="{path:'/branch',query:{depotId:this.$route.query.depotId,projectId:this.$route.query.projectId}}">
                <el-button style="float: right; margin: 0 10px" type="primary" plain>分支管理</el-button>
              </router-link>
              <router-link :to="{path:'/member',query:{membertype:'depot',depotId:this.$route.query.depotId}}">
                <el-button style="float: right" type="primary" plain>成员管理</el-button>
              </router-link>
            </el-col>-->
          </el-row>
        </div>
      </el-col>
      <el-col :span="12"> </el-col>
    </el-row>
<!--<div class="top-box">
  <el-row :gutter="20" class="">
    <el-col :span="1">&nbsp;</el-col>
    <el-col :span="3">提交历史</el-col>
    <el-col :span="1">&nbsp;</el-col>
    <el-col :span="5">分支</el-col>
    <el-col :span="6">发布版本</el-col>
    <el-col :span="8">网址</el-col>
  </el-row>
</div>-->
    <div class="box">
      <p class="text">{{description}}</p>
    </div>
    <!--仓库基本信息-->
    <div v-if="ifNewFile==false">
      <el-row :gutter="10" class="marT-20">
        <el-col :span="3">
          <el-select size="medium" v-model="branchName" placeholder="请选择" @change="getTreeList('')">
            <el-option
                    v-for="item in branchList"
                    :key="item.simpleName"
                    :label="item.simpleName"
                    :value="item.simpleName">
            </el-option>
          </el-select>
        </el-col>
      <!--  <el-col :span="4">  <el-input v-model="projectValue"  size="medium" placeholder="输入文件名称"></el-input></el-col>
        <el-col :span="4">   <el-button type="primary" size="medium" @click="">查询</el-button></el-col>-->
        <el-col :span="3">   <el-button type="primary" size="medium" @click="ifNewFile=true" >新建文件</el-button></el-col>
        <el-col :span="3">   <el-button type="primary" size="medium" @click="dialogCreatMerge=true" >新建合并请求</el-button></el-col>
        <el-col :span="3">   <el-button type="primary" size="medium" @click="sendDiolog=true" >邀请新成员</el-button></el-col>
       <!-- <el-col :span="4"> &lt;!&ndash;  <el-button type="primary" size="medium" @click="dialogRepository=true" >修改仓库信息</el-button>&ndash;&gt;</el-col>-->
        <el-col :span="12">
            <el-input placeholder="请输入内容" v-model="copyHttps" class="input-with-select">
              <el-select  size="medium" v-model="httpsValue" slot="prepend" placeholder="请选择" @change="changeHttp">
                <el-option
                        v-for="item in https"
                        :key="item.name"
                        :label="item.name"
                        :value="item.value">
                </el-option>
              </el-select>
              <el-button slot="append" icon="el-icon-document-copy"   @click="copy(copyHttps)"></el-button>
            </el-input>
        </el-col>
      </el-row>
      <!--项目-->
      <div class="box">
        <div class="file-top">
          <el-row>
            <el-col :span="6">
              文件
              <!--{{webhookData.committer['name']}}-->
            </el-col>
            <el-col style="font-size: 12px; text-align: right" :span="18">
              最后一次提交：<span style="color: #1179b5"> {{webhookData.commitId}}</span> &nbsp;于&nbsp;{{webhookData.commitTime}}

            </el-col>
          </el-row>
        </div>
        <el-table class="projectData"
                  :data="treeList"
                  style="width: 100%">
          <el-table-column width="50"
                  prop="mode"
                  label="">
            <template slot-scope="scope">
              <i @click="goTreeInfo(scope.row)"  :class="[scope.row.mode=='tree'?'el-icon-folder':'el-icon-document']"></i> &nbsp;{{scope.row.fragmentName}}
            </template>
          </el-table-column>
          <el-table-column
                  prop="flatten_path"
                  label="仓库名称"
                  width="230">
          </el-table-column>
          <el-table-column
                  prop="lastCommitMessage"
                  label="描述">
          </el-table-column>
     <!--     <el-table-column
                  prop="name"
                  label="创建时间">
          </el-table-column>-->
          <el-table-column  width="180"
                  prop="lastCommitDate"
                  label="上次更新">
          </el-table-column>

        </el-table>
      </div>
      <!--//项目-->
      <div class="readme-box">
        <h4 class="readme-box-top">
          README.md
        </h4>
        <div class="readme-con">
<!--          <codemirror  ref="myCm"  v-model="fileContent"  :options="cmOptions"   @changes="changes" class="code" ></codemirror>-->
          <VueShowdown
                  :markdown="fileContentUppercase?fileContentUppercase:fileContent"
                  flavor="github"
                  :options="{ emoji: true }"/>
        </div>

      </div>
    </div>
    <!--//仓库基本信息-->
    <!--新建文件-->
    <div v-else="">
      <el-form :model="newForm" ref="newForm" :rules="rules" class="demo-ruleForm">
        <el-form-item  prop="fileName">
          <el-input placeholder="请输入文件名称"  v-model="newForm.fileName">
            <template slot="prepend">{{openPath}}</template>
          </el-input>
        </el-form-item>
        <el-form-item>
      <el-select style="margin-top: 20px" size="medium" v-model="branchName" placeholder="请选择">
        <el-option
                v-for="item in branchList"
                :key="item.simpleName"
                :label="item.simpleName"
                :value="item.simpleName">
        </el-option>
      </el-select>
        </el-form-item>
        <el-form-item  prop="fileDes">
      <el-input style="margin: 20px 0" v-model="newForm.fileDes"   placeholder="请输入文件简介"></el-input>
        </el-form-item>
        <el-form-item   prop="fileContent" >
          <codemirror  ref="myCm"  v-model="newForm.fileContent"   :options="cmOptionsNew"   @changes="changes" class="code" ></codemirror></el-form-item>
        <el-form-item>
      <div style="text-align: center; margin-top: 20px;">
        <el-button style=" width:130px" type=""  @click="resetForm('newForm')" >取消</el-button>
        <el-button style=" width: 130px" type="primary"  @click="creatNewFile('newForm')" >提 交</el-button>
      </div>
        </el-form-item>
      </el-form>
    </div>
    <!--//新建文件-->
    <el-dialog title="邀请新成员" :visible.sync="sendDiolog" :close-on-click-modal=false>
      <el-form :model="sendForm">
        <el-form-item label="邀请人邮箱" >
          <el-input v-model="sendForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="授权类型">
          <el-select v-model="sendForm.authType" placeholder="请选择活授权类型">
            <el-option
                    v-for="item in authTypeOption"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="sendDiolog = false">取 消</el-button>
        <el-button type="primary" @click="sentMember">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改仓库信息" :visible.sync="dialogRepository" :close-on-click-modal=false>
      <el-form :model="projectForm" :rules="rules2" ref="projectForm" >
        <el-form-item  label="仓库名称">
          <el-input v-model="projectForm.name" autocomplete="off"></el-input>
          <p style="font-size: 12px; color: #f81d22">仓库名称只允许字母、数字或者下划线(_)、中划线(-)、点(.)</p>
        </el-form-item>
        <el-form-item  label="设置主分支">
        <el-select size="medium" v-model="projectForm.branchName" placeholder="请选择">
          <el-option
                  v-for="item in branchList"
                  :key="item.simpleName"
                  :label="item.simpleName"
                  :value="item.simpleName">
          </el-option>
        </el-select>
        </el-form-item>
        <el-form-item  label="简介">
          <el-input type="textarea" v-model="projectForm.description"></el-input>
        </el-form-item>
        <el-form-item prop="ifPublic"  label="是否公开" >
          <el-radio v-model="projectForm.ifPublic" label="1">公开</el-radio>
          <el-radio v-model="projectForm.ifPublic" label="2">私有</el-radio>
        </el-form-item>
        <el-form-item >
          <el-checkbox v-model="projectForm.isReadme">新建Readme</el-checkbox>
        </el-form-item>

        <el-form-item>
          <div style="display: block; text-align: center">
            <el-button  @click="dialogRepository=false">取 消</el-button>
            <el-button type="primary" @click=" saveRepositories() ">确 定</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="新建合并请求" :visible.sync="dialogCreatMerge" :close-on-click-modal=false>
      <el-row :gutter="10" class="marT-20">
        <el-col :span="7">
         <span> 源分支：</span>
          <el-select  size="medium" v-model="sourceBranch" placeholder="请选择" @change="changeBranch()">
            <el-option
                    v-for="item in branchList"
                    :key="item.simpleName"
                    :label="item.simpleName"
                    :value="item.simpleName">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="7">

          <span>   目标分支：</span>
          <el-select size="medium" v-model="distBranch" placeholder="请选择" @change="changeBranch()">
            <el-option
                    v-for="item in branchList"
                    :key="item.simpleName"
                    :label="item.simpleName"
                    :value="item.simpleName">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="4" v-if="ifCanMerge">
          <p  style="margin-left: 10px; line-height:40px;color: #12990b">可以合并</p>
        </el-col>
        <el-col :span="4" v-else>
          <p  style="margin-left: 10px;line-height:40px; color: #d31519"> 不可自动合并</p>
        </el-col>

      </el-row>
      <el-form :model="mergeForm" :rules="rules2" ref="mergeForm" >
        <el-form-item prop="name" label="请输入合并请求标题" >
          <el-input v-model="mergeForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="desc" label="描述内容" >
          <el-input type="textarea" v-model="mergeForm.desc"></el-input>
        </el-form-item>
        <el-form-item label="选择审核人" prop="ownerType" >
          <el-select size="medium" v-model="mergeForm.ownerType" placeholder="请选择">
            <el-option
                    v-for="item in memberLisr"
                    :key="item.userId"
                    :label="item.username"
                    :value="item.userId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <div style="display: block; text-align: center">
            <el-button  @click=" resetForm('mergeForm')">取 消</el-button>
            <el-button :disabled="!ifCanMerge" type="primary" @click=" crearMerge('mergeForm') ">确 定</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>
  </div>
</template>

<script>
// @ is an alias to /src
import CodeSidebar from '../code-sidebar.vue';
import MainSidebar from '../main-sidebar.vue';
import { codemirror } from 'vue-codemirror'
require( 'codemirror/theme/idea.css')
require("codemirror/mode/python/python.js")
require("codemirror/mode/css/css.js")
require("codemirror/mode/markdown/markdown.js")
require("codemirror/mode/go/go.js")
require('codemirror/addon/fold/foldcode.js')
require('codemirror/addon/fold/foldgutter.js')
require('codemirror/addon/fold/brace-fold.js')
require('codemirror/addon/fold/xml-fold.js')
require('codemirror/addon/fold/indent-fold.js')
require('codemirror/addon/fold/markdown-fold.js')
require('codemirror/addon/fold/comment-fold.js')

export default {
  name: 'repositorydetail',
  components: {
      codemirror
  },

    data () {
        return {
            webhookData:'',
            treeData:{},
            depotName:'',
            description:'',
            treeList:[],
            treeDetail:'',
            openPath:'',
            pathFolder:'',
            projectValue:'',
            languageVal:'',
            ifNewFile:false,
            sendDiolog:false,
            languageOptions:[ ],
            dialogRepository:false,
            branchName:'master',
            depotId:'',
             projectId:'',
             HttpPathUrl:'',
             SshPathUrl:'',
             httpsValue:1,
             https:[
               { 'name':'  HTTP  ',
                 value:1
               },
               { 'name':'   SSH    ',
                 value:2
               },
             ],
          copyHttps:'',
            projectForm:{
                name:'',
                description:'',
                ifPublic:'',
                branchName:'master'
            },
            rules2: {
                name: [{ required: true,message: '请填写名称', trigger: 'blur'}],
                desc: [ { required: true, message: '请填写简介',trigger: 'blur' } ],
                projectId:[{ required: true, message: '请选择所属仓库',trigger: 'blur' }],
                ifPublic:[{ required: true, message: '请选择',trigger: 'blur' }]
            },
          rules: {
            fileName: [{ required: true,message: '请填写名称', trigger: 'blur'}],
            fileDes: [ { required: true, message: '请填写简介',trigger: 'blur' } ],
            fileContent: [ { required: true, message: '请填文件内容',trigger: 'blur' } ],
          },
            sendForm: {
                email:'',
                authType:'',

            },
            newForm:{
                fileName:'',//新建文件名称
                fileDes:'',
                fileContent:'',
            },
            fileContent:'',
          fileContentUppercase:'',
            authTypeOption:[

              {
                value:'1',
                label:'Owner'
              },
              {
                value:'2',
                label:'Developer'
              },
              {
                value:'3',
                label:'Reporter'
              }

            ],
            projectData:[
                {
                    ifFile:1,
                    fragmentName:'aaa',
                    ownName:'ownname',
                    name:'bbc'
                },
                {
                    ifFile:0,
                    fragmentName:'aaa',
                    ownName:'ownname',
                    name:'bbc'
                }
            ],
            branchList:'',
            cmOptions:{
                tabSize: 4,
                mode: 'markdown',
                theme:"idea",
                styleActiveLine: true,
                lineNumbers: true,
                line: true,
                foldgutter: true,
                readOnly:true,
                gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter","CodeMirror-lint-markers"],
                lineWrapping: true, //代码折叠
                foldGutter: true,
                matchBrackets: true,  //括号匹配
                autoCloseBrackets: true
            },
            cmOptionsNew:{
                tabSize: 4,
                mode: 'markdown',
                theme:"idea",
                styleActiveLine: true,
                lineNumbers: true,
                line: true,
                foldgutter: true,
                readOnly:false,
                gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter","CodeMirror-lint-markers"],
                lineWrapping: true, //代码折叠
                foldGutter: true,
                matchBrackets: true,  //括号匹配
                autoCloseBrackets: true
            },
          dialogCreatMerge:false,
          dialogMergeInfo:false,
          sourceBranch:'master',//源分支
          distBranch:'master',//目标分支
          branchList:'',
          ifCanMerge:false,
          mergeForm:{
            name:'',
            desc:'',
            ownerType:''
          },
          rules2: {
            name: [{ required: true,message: '请填写名称', trigger: 'blur'}],
            desc: [ { required: true, message: '请填写简介',trigger: 'blur' } ],
            ownerType: [ { required: true, message: '请选择审核人',trigger: 'blur' } ],
          },
          memberLisr:[]
        }
    },
    mounted(){
        /*this.$route.query.id;*/
      this.depotId=this.$route.query.depotId;
      this.projectId=this.$route.query.projectId;
        this.getBranchList()//获取分支列表
        this.getWebhookData()//获取top提交信息
        this.getdepotInfo()//获取仓库基本信息
        this.getTreeList()//获取Treelist
        this.getDepotMember()//获取仓库成员
        this.changeBranch()//默认是否可以合并
    },
    watch: {
        '$route'(to, from) {
            this.getBranchList()//获取分支列表
            this.getWebhookData()//获取top提交信息
            this.getdepotInfo()//获取仓库基本信息
            this.getTreeList()//获取Treelist
        }
    },
    methods:{
        //打开文件夹
        goTreeInfo(row){
            var _this=this;
            _this.openPath=row.path+"/";
            console.log(" _this.openPath", _this.openPath)
            let query = this.$router.history.current.query;
            let path = this.$router.history.current.path;
            query.t = Math.random()
            this.$router.push({ path, query: query });
            if(row.mode=='tree'){
                _this.axios.get(this.config.baseURL + '/app/user/*/project/*/git/treeinfo/** ',{params:{
                    'depotId':this.depotId,
                    'ref':_this.branchName,
                    'path':row.path
                }})
                    .then(function (response) {
                        _this.treeList=response.data.model.infos
                        _this.pathFolder=row.flatten_path+"/"
                        console.log("  0000000", response.data)
                    })
            }else{
                localStorage.setItem('path',row.path)
                this.$router.push({
                    name: 'filedetail',
                    query: {
                        'projectId': this.projectId,
                        'depotId':this.depotId,
                        'sha':row.lastCommitId,
                        'path':row.path,
                         'ref':_this.branchName
                    }
                })
            }
        },
      copy(data)  {
          let url = data;
        let oInput = document.createElement('input');
        oInput.value = url;
        document.body.appendChild(oInput);
        oInput.select(); // 选择对象;
        console.log(oInput.value)
        document.execCommand("Copy"); // 执行浏览器复制命令
        this.$message({
          message: '复制成功',
          type: 'success'
        });
        oInput.remove()
      },
      changeHttp(){
          var _this=this;
          console.log("_this.copyHttps",_this.copyHttps)
        _this.copyHttps=_this.httpsValue==1?_this.HttpPathUrl:_this.SshPathUrl
      },
        getTreeDetail(row){
        },
        //获取tree
        getTreeList(path){
            var _this=this;
            console.log("_this.branchName",_this.branchName)
            _this.projectForm.branchName=_this.branchName
            this.axios.get(this.config.baseURL + '/app/user/*/project/*/git/treeinfo/** ',{params:{
                'depotId':_this.depotId,
                'ref':_this.branchName,
                'path':path?path:''
            }})
                .then(function (response) {
                    _this.treeList=response.data.model.infos
                    console.log("  0000000", response.data)
                    if(response.data.code==0){
                        for(var i=0; i<_this.treeList.length; i++){
                            var cur=_this.treeList[i]
                          console.log("cur",cur)
                            if(cur.path=='readme.md'){
                                //获取文件基本信息
                                var params = new URLSearchParams();
                                params.append("depotId",_this.depotId);
                                params.append("sha", cur.lastCommitId);
                                params.append("path", cur.path);
                                _this.axios.post(_this.config.baseURL + '/app/entry/getByteContent ',params)
                                    .then(function (response) {
                                        _this.fileContent=response.data.data
                                    })
                            }
                          if(cur.path=='README.md'){
                            //获取文件基本信息
                            var params = new URLSearchParams();
                            params.append("depotId",_this.depotId);
                            params.append("sha", cur.lastCommitId);
                            params.append("path", cur.path);
                            _this.axios.post(_this.config.baseURL + '/app/entry/getByteContent ',params)
                                    .then(function (response) {
                                      _this.fileContentUppercase=response.data.data
                                    })
                          }
                        }
                    }
                })
        },
      changeBranch(e){
        var _this=this;
        var params = new URLSearchParams();
        params.append("depotId", _this.depotId);
        params.append("srcBranch",_this.sourceBranch);
        params.append("targetBranch", _this.distBranch);
        _this.axios.post(_this.config.baseURL + '/app/pullReq/canMerge',params)
                .then(function (response) {
                  console.log("response.data.data  ",response.data.data )
                  if(response.data.data=="MERGEABLE"){
                    console.log("MERGEABLE  ")
                    console.log("可合并")
                    _this.ifCanMerge=true

                  }else{
                    console.log("不可合并")
                    _this.ifCanMerge=false
                  }
                })
      },
      //仓库成员
      getDepotMember(){
        var _this=this;
        _this.axios.defaults.headers.common['token'] = _this.token
        var params = new URLSearchParams();
        params.append("page", 1);
        params.append("limit", 50);
        params.append("userName", '');
        params.append("depotId", _this.depotId);
        this.axios.post(this.config.baseURL + '/app/depot/getDepotUserList',params)
                .then(function (response) {
                  console.log("=response.data------------",response.data)
                         for(var i=0; i< response.data.pageList.records.length; i++){
                           var cur=response.data.pageList.records[i]
                           if(cur.authType==1){
                             _this.memberLisr.push(cur)
                           }
                         }
              /*    _this.memberLisr=response.data.pageList.records*/

                })
      },
      //创建合并请求
      crearMerge(formName){
        var _this=this;
        this.$refs[formName].validate((valid) => {
          if(valid){
            _this.axios.defaults.headers.common['token'] = _this.token
            this.axios.post(this.config.baseURL + '/app/pullReq/createPullRequest',{
              "auditUserId": _this.mergeForm.ownerType,
              "depotId":  _this.depotId,
              "description": _this.mergeForm.desc,
              "distBranch": _this.distBranch,
              "sourceBranch": _this.sourceBranch,
              "title": _this.mergeForm.name
            })
                    .then(function (response) {
                      _this.$message({
                        message: response.data.msg,
                        type: response.data.code == 0 ? "success" : "warning"
                      });
                      _this.$refs[formName].resetFields();
                      _this.dialogCreatMerge=false
                    })
          }})

      },
        //获取仓库基本信息
        getdepotInfo(){
            var _this=this;
            this.axios.get(this.config.baseURL + '/app/depot/'+_this.projectId+'/'+_this.depotId,{params:{
                'depotId':this.depotId,
                'projectId':this.projectId
            }})
                .then(function (response) {
                  _this.projectForm.name=_this.depotName=response.data.depot.name
                    _this.projectForm.description =_this.description=response.data.depot.description
                  _this.copyHttps= _this.HttpPathUrl=response.data.depot.cloneHttpPathUrl
                  _this.SshPathUrl=response.data.depot.cloneSshPathUrl
                    console.log(" _this.depotName",  _this.SshPathUrl)
                })
        },
        //获取top更新信息
        getWebhookData(){
            var _this=this;
            this.axios.get(this.config.baseURL + '/app/user/*/project/*/git/tree/** ',{params:{
                'depotId':_this.depotId,
                'ref':_this.branchName,
            }})
                .then(function (response) {
                    _this.webhookData=response.data.headCommit
                    _this.webhookData.commitId= _this.webhookData.commitId.substring(0,10)
                })
        },
        //获取分支
        getBranchList(){
            var _this=this;
            console.log("depotId",_this.$route.query.depotId)
            this.axios.get(this.config.baseURL + '/app/user/*/project/*/git/'+_this.projectId+'/'+_this.depotId+'/refs',{params:{
                'depotId':_this.depotId,
                'projectId':_this.projectId
            }})
                .then(function (response) {
                    _this.branchList=response.data.refs
                })
        },
        searchSubmit () {
            console.log('11')
        },
        changes(){
        },
        resetForm(formName ){
            console.log("formName",formName)
            var _this=this;
            _this.$refs[formName].resetFields();
            this.ifNewFile=false
          this.dialogCreatMerge=false
        },
        //新建文件pathFolder
        creatNewFile(newForm){
                var _this=this;
              _this.axios.defaults.headers.common['token'] = _this.token
                var params = new URLSearchParams();
                params.append("projectId", _this.projectId);
                params.append("depotId",_this.depotId);
                params.append("ref",_this.branchName);
                params.append("path",_this.openPath+_this.newForm.fileName);
                params.append("content", _this.newForm.fileContent);
                params.append("msg", _this.newForm.fileDes);
          this.$refs[newForm].validate((valid) => {
            if(valid){
              _this.axios.post(this.config.baseURL + '/app/'+_this.projectId+'/'+_this.depotId+'/commit/'+_this.branchName,params)
                      .then(function (response) {
                        console.log(" this.000",  response)
                        var  msgType=response.data.code==0?'success':'warning'
                        if(response.data.code==0){
                          _this.ifNewFile=false
                          _this.resetForm('newForm')
                        }

                        _this.getTreeList()
                        _this.$message({
                          message: response.data.msg,
                          type: msgType
                        });

                      })
            }})

        },
        //邀请新成员
        sentMember(){
            var _this=this;
            _this.axios.defaults.headers.common['token'] = _this.token
            var params = new URLSearchParams();
            params.append("authType", _this.sendForm.authType);
            params.append("depotId",_this.depotId);
            params.append("depotName",_this.depotName);
            params.append("developerUserEmail",_this.sendForm.email);
            params.append("invitationUserId", this.userId);
            params.append("invitationUserName", this.userInfo.trueName);
            var params1={

                "authType": _this.sendForm.authType,
                "depotId": _this.depotId,
                "depotName": this.depotName,
                "developerUserEmail": _this.sendForm.email,
                "invitationUserId": this.userId,
                "invitationUserName":this.userInfo.trueName

            }
            console.log("params", this.userInfo)
            _this.axios.post(this.config.baseURL + '/app/depot/sendInvitation',params1)
                .then(function (response) {
                    console.log(" this.000",  response)
                    var  msgType=''
                  if(response.data.code==0){
                    msgType='success'
                    _this.sendDiolog=false
                  }else {
                    msgType='warning'
                  }
                    _this.$message({
                        message: response.data.msg,
                        type: msgType
                    });
                  _this.sendForm.email=""
                })

        },
        //修改仓库信息
        saveRepositories(){
            var _this=this;
            var params ={
                "depotId":_this.depotId,
                "name":_this.projectForm.name,
                "description":_this.projectForm.description,
                "newHeadRef":_this.projectForm.branchName,
                "ownerId":this.userId,
            }
            _this.axios.post(this.config.baseURL + '/app/depot/updateDepot',params)
                .then(function (response) {
                    console.log(" this.2222",  response)
                    var  msgType=response.data.code==0?'success':'warning'
                    _this.dialogRepository=response.data.code==0?false:true
                    _this.$message({
                        message: response.data.msg,
                        type: msgType
                    });

                })
        },
        //重置
        resetFormSave(formName,dialogEle) {
            var _this=this;
            _this.projectForm.name=_this.depotName
            _this.projectForm.description=_this.description
            _this.projectForm.branchName=_this.branchName

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
  .marT-20{
    margin-top: 20px;
  }
  .repositorydetail {
    position: relative;
    margin: 130px 15px 15px;
    padding: 15px 30px;
    min-height: calc(100vh - 60px);
    background: #fff;
    border-radius: 8px;}
  .repositorydetail .top{
    width: 100%;
    line-height: 40px;

  }
  .repositorydetail .top img{
    float: left;
    width: 40px;
    height:40px;
    border-radius: 50%;
    border: 1px solid #dedede;
  }
  .repositorydetail .top p{
    float: left;
    margin: 0 10px;
    font-size: 14px;
    color: #999;
  }
   .el-select .el-input {
    width: 130px;
  }
   .el-select{
     width: 120px;
   }
   .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }
  .repositorydetail .top h3{
    font-size: 18px;
    color: #000;
  }
  .repositorydetail .box{
    margin-top: 20px;
  }
  .repositorydetail .box .text{
    font-size:12px;
    line-height: 20px;
    color: #666;
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
  .repositorydetail .iconlock{
    display: block;
    margin: 5px 10px;
    width: 12px;
    height:16px;
    background: url("../../assets/icon_lock.png") no-repeat;
  }
  .repositorydetail i{
    font-size: 20px;
    cursor: pointer;
  }
  .repositorydetail .el-select .el-input{
    width: 100px;
  }
  .readme-box{
    margin-top: 20px;
    width: 100%;
    border:1px solid #dedede;
  }
  .readme-box-top{
    height: 40px;
    line-height: 40px;
    font-style: 14px;
    text-indent: 20px;
    background: #eaecf0;

  }
  .readme-con{
    width: 96%;
    padding: 2%;
    min-height: 300px;
    box-sizing: content-box;
    color: #666;
  }
  .vue-codemirror{
    border:1px solid #dedede;
  }
  .file-top{
    padding: 10px;
    background: #e6f0fa;
  }
  .top-box{
    margin: 20px 0 0 0 ;
    padding: 10px;
    font-size: 14px;
    line-height: 20px;
    background: #f1f2f4;
    border:1px solid #d9dbe0;
  }
</style>
