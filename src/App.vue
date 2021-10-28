<template>
  <div id="app">
    <div id="nav">
      <MainSidebar></MainSidebar>
    </div>
    <router-view/>
  </div>
</template>

<script>
    // @ is an alias to /src
    import MainSidebar from './views/main-sidebar.vue';
    export default {
        name: 'projects',
        components: {
            MainSidebar
        },

    }
</script>
<style>
  *{
    margin:0;
    padding: 0;
  }
  body{
    background: #003265;
  }
#app {
  width: 100%;
  height: 100%;
  /*background: #fff;*/
  /*border: 1px solid #fff;*/
  box-sizing: border-box;
}

  html,body{
    height:100%;
  }
</style>
