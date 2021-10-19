<template>
  <div>
  <div class="filedetail">
    <el-row>
      <el-col :span="12">
        <div class="top">
          <img src="../../assets/photo.jpg"/>
          <p>项目名称  &nbsp /{{depotName}}/</p>
          <h3>{{fileIndo.name}}</h3>
          <p>   </p>
        </div>
      </el-col>
      <el-col :span="12"> </el-col>
    </el-row>
    <div  style="text-align: right"  class="box">
    <el-button v-if="ifEdit==false"type="primary" @click="editFile">编辑</el-button>
    <el-button v-else="" style="float:right;" type="primary" @click="creatNewFile">保存</el-button>
    </div>
    <div class="box">
      <p  v-if="ifEdit==false"  class="text">{{fileMsg}}</p>
      <el-input v-else="" v-model="editInput" size="medium" placeholder="输入提交说明"></el-input>
    </div>
    <div class="file-top">
      <el-row>
        <el-col :span="2" >
          <i class="el-icon-arrow-left" @click="goHistory"></i>
        </el-col>
        <el-col :span="6">
          文件
          <!-- {{webhookData.committer.name}}-->
        </el-col>
        <el-col style="font-size: 12px; text-align: right" :span="16">
          最后一次提交： {{webhookData.commitId}}于{{webhookData.commitTime}}
        </el-col>
      </el-row>
    </div>
    <!--仓库基本信息-->

    <!--//仓库基本信息-->
    <!--新建文件-->
   <!-- {{fileContent}}-->
    <VueShowdown v-highlight v-if="ifEdit==false"
            :markdown="fileContent"
            flavor="github"
            :options="{ emoji: true }"   style="border: 1px solid #dedede; min-height: 300px; padding: 15px"/>
    <codemirror  v-else ref="myCm"  v-model="fileContent"  :options="cmOptions"   @changes="changes" class="code" ></codemirror>
  </div>
  </div>
</template>

<script>
// @ is an alias to /src
import CodeSidebar from '../code-sidebar.vue';
import MainSidebar from '../main-sidebar.vue';
import { codemirror } from 'vue-codemirror'
require( 'codemirror/theme/idea.css')
require("codemirror/mode/css/css.js")
require("codemirror/mode/python/python.js")
require('codemirror/addon/fold/foldcode.js')
require('codemirror/addon/fold/foldgutter.js')
require('codemirror/addon/fold/brace-fold.js')
require('codemirror/addon/fold/xml-fold.js')
require('codemirror/addon/fold/indent-fold.js')
require('codemirror/addon/fold/markdown-fold.js')
require('codemirror/addon/fold/comment-fold.js')
export default {
  name: 'filedetail',
  components: {
      codemirror
  },
    data () {
        return {
            webhookData:'',
            depotName:'',
            branchName:'',
            branchList:'',
            fileName:'',//新建文件名称
            fileDes:'',
            fileContent:'',
            fileIndo:'',
            ifEdit:false,
            fileMsg:'',
            editInput:'',
            projectId:this.$route.query.projectId,
            depotId:this.$route.query.depotId,
            coder:null,
            cmOptions:{
                tabSize: 4,
                mode: { name: 'css', json: true },
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
            }
        }
    },
    mounted(){
        /*this.$route.query.id;*/
        this.getdepotInfo()//获取仓库基本信息
        this.getWebhookData()//获取top提交信息
        this.getFileInfo(this.$route.query.sha)//获取文件基本信息
       /* this.coder = CodeMirror.fromTextArea(this.$refs.textarea, this.options)*/
    },
    watch: {
        '$route'(to, from) {
            this.getdepotInfo()//获取仓库基本信息
            this.getWebhookData()//获取top提交信息
            this.getFileInfo(this.$route.query.sha)//获取文件基本信息
        }
    },
    methods:{
        //获取仓库基本信息
        getdepotInfo(){
            var _this=this;
            this.axios.get(this.config.baseURL + '/app/depot/'+this.projectId+'/'+this.depotId,{params:{
                'depotId':this.depotId,
                'projectId':this.projectId
            }})
                .then(function (response) {
                    _this.depotName=response.data.depot.name
                    console.log(" _this.depotName", response)
                })
        },
        //获取top更新信息
        getWebhookData(){
            var _this=this;
            this.axios.get(this.config.baseURL + '/app/user/*/project/*/git/tree/** ',{params:{
                'depotId':this.$route.query.depotId,
                'ref':'master'
            }})
                .then(function (response) {
                    _this.webhookData=response.data.headCommit;
                    console.log(" _this.webhookData", _this.webhookData)
                })
        },
        //获取文件基本信息
        getFileInfo(sha){
            var _this=this;
            var params = new URLSearchParams();
            params.append("depotId", _this.depotId);
            params.append("sha",sha);
            params.append("path", _this.$route.query.path);
            _this.axios.post(this.config.baseURL + '/app/entry/getEntry ',params)
                .then(function (response) {
                    _this.fileIndo=response.data.file
                    _this.fileContent=response.data.fileContent
                    _this.fileMsg=response.data.file.commit.shortMessage
                    console.log("  111111", response.data)
                })
        },
        searchSubmit () {
            console.log('11')

        },
        //编辑文件
        editFile(){
            console.log("00000")
            var _this=this;
            _this.ifEdit=true;
            _this.editInput=_this.fileMsg
            _this.cmOptions.readOnly=false
        },
        changes(){
        },
        goHistory(){
            this.$router.go(-1)
        },
        creatNewFile(){
                var _this=this;
          console.log("_this.$route.query.ref",_this.$route.query.ref)
              _this.axios.defaults.headers.common['token'] = _this.token
                var params = new URLSearchParams();
                params.append("projectId",_this.projectId);
                params.append("depotId", _this.depotId);
                params.append("ref",_this.$route.query.ref);
                params.append("path",  _this.$route.query.path);
                params.append("content", _this.fileContent);
                params.append("msg", _this.editInput);
            _this.axios.post(this.config.baseURL + '/app/'+_this.projectId+'/'+_this.depotId+'/commit/'+_this.$route.query.ref,params)
                    .then(function (response) {
                          _this.ifEdit=false;
                          _this.getFileInfo(response.data.sha)
                        _this.$router.push({
                            name: 'filedetail',
                            query: {
                                'projectId': _this.projectId,
                                'depotId': _this.depotId,
                                'sha':response.data.sha,
                                'path':_this.$route.query.path,
                                'ref':_this.$route.query.ref,
                            }
                        })
                        _this.cmOptions.readOnly=true
                        console.log("  _this.$route.query.sha",  _this.$route.query.sha)
                          var  msgType=response.data.code==0?'success':'warning'
                          _this.$message({
                              message: response.data.msg,
                              type: msgType
                          });

                      _this.$router.push({
                        name: 'repositorydetail',
                        query: {
                          depotId:_this.depotId,
                          projectId:_this.projectId
                        }
                      })
                    })
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
  .filedetail { position: relative;
    margin: 80px 15px 15px;
    padding: 15px 30px;
    margin-left: 310px;
    min-height: calc(100vh - 60px);
    background: #fff;
    border-radius: 8px;}
  .filedetail .top{
    width: 100%;
    line-height: 40px;

  }
  .filedetail .top img{
    float: left;
    width: 40px;
    height:40px;
    border-radius: 50%;
    border: 1px solid #dedede;
  }
  .filedetail .top p{
    float: left;
    margin: 0 10px;
    font-size: 14px;
    color: #999;
  }
  .filedetail .top h3{
    font-size: 18px;
    color: #000;
  }
  .filedetail .box{
    padding: 10px;
    overflow: hidden;
  }
  .filedetail .box .text{
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
  .filedetail .iconlock{
    display: block;
    margin: 5px 10px;
    width: 12px;
    height:16px;
    background: url("../../assets/icon_lock.png") no-repeat;
  }
  .filedetail i{
    font-size: 20px;
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
    padding: 20px 10px;
    width: 100%;
    font-size: 12px;
    line-height: 16px;
    color: #666;
  }
  .vue-codemirror{
    border:1px solid #dedede;
  }
  .file-top{
    padding: 10px;
    background: #e6f0fa;
  }
</style>
