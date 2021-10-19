<template>
  <div>
    <div class="commitdetail">
      <h3>提交记录</h3>
      <div class="file-top">
        <el-row>
          <el-col :span="6">
            文件
            <!--{{webhookData.committer['name']}}-->
          </el-col>
          <el-col style="font-size: 12px; text-align: right" :span="18">
            最后一次提交：<span style="color: #1179b5"> {{newSha}}</span> &nbsp;于&nbsp;{{webhookData.commitTime}}

          </el-col>
        </el-row>
      </div>
      <div id="codeId" class="block" style="margin-top: 20px">


      </div>

    </div>


  </div>
</template>

<script>
    // @ is an alias to /src
    import CodeMirror from 'codemirror'
    import 'codemirror/addon/merge/merge'
    import 'codemirror/lib/codemirror.css'
    import 'codemirror/addon/merge/merge.js'
    import 'codemirror/addon/merge/merge.css'
    import DiffMatchPatch from 'diff-match-patch'
    window.diff_match_patch = DiffMatchPatch
    window.DIFF_DELETE = -1
    window.DIFF_INSERT = 1
    window.DIFF_EQUAL = 0
    export default {
        name: 'snipperrecorddetail',
        data () {
            return {
                dialogFormBranch:false,
                branchValue:'',
                cordData:[],
                cordList:'',
                page:1,
                limit:5,
                branchName:'master',
                webhookData:'',
                newSha:'',
                leftCode:'',
                rightCode:'',
            }
        },
        mounted(){
            this.getSnippersInfo()//获取top提交信息

        },
        methods:{
            //搜索提交
            searchSubmit () {
                console.log('11')
            },
            //获取top更新信息
            getSnippersInfo(){
                var _this=this;
                this.axios.get(this.config.baseURL + '/app/snippet/info/'+ this.$route.query.snippetsId,{params:{
                    'id':this.$route.query.snippetsId
                }})
                    .then(function (response) {
                        console.log(" _this.snippetData", response)
                        _this.snippetData=response.data.snippet
                        _this.newSha=response.data.snippet.version
                        if(response.data.code==0){
                            _this.getCodeData()
                        }

                    })
            },
            initUI(value,orig2) {
                if (value == null) return;
                let target = document.getElementById("codeId");
                target.innerHTML = "";
                CodeMirror.MergeView(target, {
                    value: value,//上次内容
                    origLeft: null,
                    orig: orig2,//本次内容
                    lineNumbers: true,//显示行号
                    mode: "text/html",
                    highlightDifferences: true,
                    connect: 'align',
                    readOnly: true,//只读 不可修改
                });
            },
            getCodeData(){
                var _this=this;
                var params = new URLSearchParams();
                _this.axios.defaults.headers.common['token'] = _this.token
                params.append("oldVersion",_this.$route.query.sha);
                params.append("newVersion", _this.newSha);
                this.axios.post(this.config.baseURL + '/app/snippetversion/twoSnippetVersionDiff',params)
                    .then(function (response) {
                        console.log("response0000",response)
                        _this.leftCode=response.data.data.oldVersion.codeSnippet;
                        _this.rightCode=response.data.data.newVersion.codeSnippet;
                        _this.initUI( _this.leftCode,_this.rightCode)
                    })
            },
            //行点击事件
            goToPositores (row, event, column) {

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
  .commitdetail{
    position: relative;
    margin: 80px 15px 15px;
    padding: 15px 30px;
    margin-left: 310px;
    min-height: calc(100vh - 60px);
    background: #fff;
    border-radius: 8px;
  }
  .commitdetail h3{
    font-size: 18px;
    line-height: 40px;
    color: #666;
  }
  .commitdetail .box{
    margin-top: 20px;
    width: 100%;
  }

  .file-top{
    padding: 10px;
    background: #e6f0fa;
  }

</style>
