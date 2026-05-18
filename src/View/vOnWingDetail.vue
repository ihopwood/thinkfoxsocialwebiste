<template>
  <div class="d-flex flex-column min-vh-100">
    <cHeader />
    <main class="flex-grow-1 mt-5 pt-4">
      <cOnWings />
    </main>
    <cFooter />
  </div>
</template>
<script>
import cOnWings from '@/components/GameDetails/cOnWings.vue';



export default {
  name: 'vPage',
  components: {
    cOnWings
  },
  setup() {
    return {

    }
  }
}
</script>

<style scoped></style>
