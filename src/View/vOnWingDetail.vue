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
import cHeader from '@/components/cHeader.vue';
import cFooter from '@/components/cFooter.vue';
import cOnWings from '@/components/GameDetails/cOnWings.vue';

export default {
  name: 'vOnWingDetail',
  components: { cHeader, cFooter, cOnWings }
}
</script>

<style scoped></style>
