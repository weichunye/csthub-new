<template>
  <div class="about">
    <h1>This is an about page</h1>
    {{ $route.meta.isTab }}
  </div>
</template>
<script>
    export default {
        name: 'about',
        props: {
            msg: String
        },
            data () {
                return {
                    loading: true
                }
            }
    }
</script>
