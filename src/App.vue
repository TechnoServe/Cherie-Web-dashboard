<template>
  <component :is="layout">
  </component>
</template>

<script>
import DashboardLayout from './views/layouts/LayoutDefault.vue'
import LoginLayout from './views/layouts/LoginLayout.vue'
export default {
  name: 'App',
  components:{
    DashboardLayout,
    LoginLayout,
  },
  data() {
    return {
      layout: null,
    };
  },
    watch: {
    $route(to) {
      // set layout by route meta
      if (to.meta.layout !== undefined) {
        this.layout = to.meta.layout
      } else {
        this.layout = "DashboardLayout" // this is default layout if route meta is not set
      }
    },
  },

}
</script>

<style scoped>
</style>
