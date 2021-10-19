<template>
    <div class="sidebar">
        <ul class="nav-list">
          <li class="curli">
              <router-link to="/">
              <span>
                  <img src="../assets/icon_sidebar_nav_0.png"/>
              </span>
              <p>工作台</p>
              </router-link>
          </li>
            <li>
                <router-link to="/projectrepositories">
              <span>
                  <img src="../assets/icon_sidebar_nav_6.png"/>
              </span>
                <p>代码仓库</p>
                </router-link>
            </li>
            <li>
                <router-link to="/snippets">
              <span>
                  <img src="../assets/icon_sidebar_nav_5.png"/>
              </span>
                <p>代码片段</p>
                </router-link>
            </li>
            <li v-if="this.$route.query.projectName">
                <router-link :to="{path:'/member',query:{membertype:'project',projectId:this.$route.query.projectId}}">
              <span>
                  <img src="../assets/icon_sidebar_nav_1.png"/>
              </span>
                    <p>成员</p>
                </router-link>
            </li>
          <!--  <li>
              <span>
                  <img src="../assets/icon_sidebar_nav_4.png"/>
              </span>
                <p>统计</p>
            </li>
            <li>
              <span>
                  <img src="../assets/icon_sidebar_nav_4.png"/>
              </span>
                <p>设置</p>
            </li>-->
        </ul>
        <!--//导航-->
    </div>
</template>

<script>
    export default {
        name: 'MainSidebar',
        props: {
            msg: String
        }
    }
</script>
<style scoped>
    ul {
        list-style-type: none;
        padding: 0;
    }

    a {
        color: #42b983;
    }
    .sidebar .top{
        width: 100%;
        height:90px;
        line-height: 90px;
        text-align: center;
        font-size: 30px;
        letter-spacing: 2px;
        color: #fff;
        background: #3375af;
    }

    .sidebar .nav-list{
        position: fixed;
        left:0;
        top:50%;
        width: 297px;

    }
    .sidebar .nav-list li{
        width: 100%;
        height:56px;
    }
    .sidebar .nav-list li a{
        display: block;
        width: 100%;
        height:100%;
    }
    .sidebar .nav-list .curli{
        color: #fff;
        background: #4396ca;
    }
    .sidebar .nav-list .curli p{
        color: #fff;
    }
    .sidebar .nav-list li:hover{
        background: #e0f4fd;
        cursor: pointer;
    }
    .sidebar .nav-list li:hover span, .sidebar .nav-list .curli span{
        background: #418cbb;
    }
    .sidebar .nav-list li:hover p{
        color: #4396ca;
        font-weight: bold;
    }
    .sidebar .nav-list li span{
        float: left;
        overflow: hidden;
        display: block;
        margin: 13px 15px 0;
        width: 28px;
        height:28px;
        line-height: 28px;
        text-align: center;
        background: #b7c0c7;
        border-radius: 50%;
    }
    .sidebar .nav-list li span img{
        display: block;
        margin:5px 6px 0;
        width: 16px;
        height:17px;
    }
    .sidebar .nav-list li p{
        float: left;
        font-size: 14px;
        line-height: 56px;
        color: #94a2ae;
    }

</style>
