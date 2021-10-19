<template>
    <div>
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
                <router-link to="/projects">
              <span>
                  <img src="../assets/icon_sidebar_nav_7.png"/>
              </span>
                    <p>项目</p>
                </router-link>
            </li>
            <li>
                <router-link  :to="{path:'/projectrepositories',query:{projectType:'all'}}" >
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
           <!-- <li>
              <span>
                  <img src="../assets/icon_sidebar_nav_4.png"/>
              </span>
                <p>合并请求</p>
            </li>-->
        </ul>
    </div>
</template>

<script>
    export default {
        name: 'HomeSidebar',

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
    .nav-list{
        position: fixed;
        left:0;
        top:50%;
        width: 297px;

    }
    .nav-list li{
        width: 100%;
        height:56px;
    }
    .nav-list li a{
        display: block;
        width: 100%;
        height:100%;
    }
    .nav-list .curli{
        color: #fff;
        background: #4396ca;
    }
    .nav-list .curli p{
        color: #fff;
    }
    .nav-list li:hover{
        background: #e0f4fd;
        cursor: pointer;
    }
    .nav-list li:hover span,  .nav-list .curli span{
        background: #418cbb;
    }
    .nav-list li:hover p{
        color: #4396ca;
        font-weight: bold;
    }
    .nav-list li span{
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
    .nav-list li span img{
        display: block;
        margin:5px 6px 0;
        width: 16px;
        height:17px;
    }
    .nav-list li p{
        float: left;
        font-size: 14px;
        line-height: 56px;
        color: #94a2ae;
    }
</style>
