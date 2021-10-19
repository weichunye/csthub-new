<template>
  <div>
    <div class="snipperdetails">
      <el-row>
        <el-col :span="12">
          <div class="top">
         <!--   <img src="../../assets/photo.jpg"/>-->
            <!--<p>代码片段  &nbsp /{{snippetData.ownerId}}/</p>-->
            <h3>{{snippetData.name}}</h3>
            <p>   </p>
          </div>
        </el-col>
        <el-col :span="12"> </el-col>
      </el-row>
      <router-link  :to="{path:'/snippersrecord',query:{snippetsId:this.$route.query.snippetsId}}">
      <p class="text-1" >历史版本</p>
      </router-link>
      <div  style="text-align: right"  class="box">
        <el-button v-if="ifEdit==false"type="primary" @click="editFile">编辑</el-button>
        <el-button v-else="" style="float:right;" type="primary" @click="creatNewFile">保存</el-button>
      </div>

      <div   v-if="ifEdit==true" class="box">
        <el-input  style="width: 30%; margin-right: 10px" v-model="snippetData.name" size="medium" placeholder="名称"></el-input>
        <el-select size="medium" v-model="ownerType" placeholder="请选择">
          <el-option
                  v-for="item in ownerTypeOption"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
          </el-option>
        </el-select>
      </div>
      <div class="box">
        <p  v-if="ifEdit==false"  class="text">{{snippetData.description}}</p>
        <el-input v-else="" v-model="snippetData.description" size="medium" placeholder="输入提交说明"></el-input>
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
           最后一次提交： {{snippetData.version}} 于 {{snippetData.updateTime}}
          </el-col>
        </el-row>
      </div>
      <!--仓库基本信息-->

      <!--//仓库基本信息-->
      <!--新建文件-->
      <!-- {{fileContent}}-->
      <codemirror  ref="myCm"  v-model="fileContent"  :options="cmOptions"   @changes="changes" class="code" ></codemirror>
    </div>
  </div>
</template>

<script>
    // @ is an alias to /src
    import HomeSidebar from '../home-sidebar.vue';
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
        name: 'snipperdetails',
        components: {
            codemirror
        },

        data () {
            return {
                snippetData:'',
                ownerType:"",
                snipperbName:'',//新建文件名称
                fileDes:'',
                fileContent:'',
                fileIndo:'',
                ifEdit:false,
                fileMsg:'',
                editInput:'',
                coder:null,
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
            this.getSnippersInfo()//获取片段基本信息
        },
        watch: {
            '$route'(to, from) {
                this.getSnippersInfo()//获取仓库基本信息
            }
        },
        methods:{
            //获取代码片段基本信息
            getSnippersInfo(){
                var _this=this;
                this.axios.get(this.config.baseURL + '/app/snippet/info/'+ this.$route.query.snippetsId,{params:{
                    'id':this.$route.query.snippetsId
                }})
                    .then(function (response) {
                        console.log(" _this.snippetData", response)
                        _this.snippetData=response.data.snippet
                        _this.ownerType=response.data.snippet.ownerType
                        _this.fileContent=response.data.snippet.codeSnippet

                    })
            },

            searchSubmit () {
                console.log('11')

            },
            //编辑文件
            editFile(){
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
            newSnippe(formName) {
                var _this = this;
                var params = {
                    "name": _this.snippetForm.name,
                    "description":_this.snippetForm.description,
                    "id":null,
                    "codeSnippet": _this.fileContent,
                    "language":1,
                    "ownerId": this.userId ,
                    "createUserId": this.userId ,
                    "createUserName": this.userInfo.trueName,
                    "ownerType": _this.snippetForm.ownerType,
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
            creatNewFile(){
                var _this=this;
                _this.axios.defaults.headers.common['token'] = _this.token
                var params = {
                    "name": _this.snippetData.name,
                    "description":_this.snippetData.description,
                    "id":_this.snippetData.id,
                    "codeSnippet": _this.fileContent,
                    "language":1,
                    "ownerId": this.userId ,
                    "createUserId": this.userId ,
                    "ownerType": _this.ownerType,
                    "createUserName": this.userInfo.trueName,

                };
                _this.axios.put(this.config.baseURL + '/app/snippet/update',params)
                    .then(function (response) {
                        console.log(" this.000",  response)
                        if(response.data.code==0){

                        }
                        _this.ifEdit=false;
                        _this.cmOptions.readOnly=true
                        console.log("  _this.$route.query.sha",  _this.$route.query.sha)
                        var  msgType=response.data.code==0?'success':'warning'
                        _this.$message({
                            message: response.data.msg,
                            type: msgType
                        });

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
  .snipperdetails {
    position: relative;
    margin: 80px 15px 15px;
    padding: 15px 30px;
    margin-left: 310px;
    min-height: calc(100vh - 60px);
    background: #fff;
    border-radius: 8px;}
  .snipperdetails .top{
    width: 100%;
    line-height: 40px;

  }
  .snipperdetails .top img{
    float: left;
    width: 40px;
    height:40px;
    border-radius: 50%;
    border: 1px solid #dedede;
  }
  .snipperdetails .top p{
    float: left;
    margin: 0 10px;
    font-size: 14px;
    color: #999;
  }
  .snipperdetails .top h3{
    font-size: 18px;
    color: #000;
  }
  .snipperdetails .box{
    padding: 10px;
    overflow: hidden;
  }
  .snipperdetails .box .text{
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
  .snipperdetails .iconlock{
    display: block;
    margin: 5px 10px;
    width: 12px;
    height:16px;
    background: url("../../assets/icon_lock.png") no-repeat;
  }
  .snipperdetails i{
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
  .text-1{
    margin-top: 20px;
    font-size: 12px;
    color: #206fb8;
    text-decoration: underline;
    cursor: pointer;
  }
</style>
