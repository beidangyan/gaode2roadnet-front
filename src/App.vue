<script setup lang="ts">
import GaoDe from '@/components/GaoDe.vue'
import console from '@/components/console.vue'
</script>

<template>
  <div id="content">
    <console />
    <GaoDe />
  </div>
</template>

<script lang="ts">
export default {
  name: 'App',
  components: {
    GaoDe,
    console
  }
}
</script>


<style scoped>
#content {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
}
</style>
