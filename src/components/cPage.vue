<template>
  <div class="c-page">
    <div id="About" class="section-anchor">
      <cAbout />
    </div>

    <div v-for="game in games" :id="game.anchorId || game.id" :key="game.id || game.title" class="section-anchor">
      <cFeaturedGame :game="game" />
    </div>
  </div>
</template>

<script>
import cAbout from './cAbout.vue';
import cFeaturedGame from './cFeaturedGame.vue';

const gameModules = import.meta.glob('/src/assets/games/*/game.json', {
  eager: true
});

const games = Object.values(gameModules)
  .map((module) => module.default || module)
  .sort((a, b) => (a.order || 999) - (b.order || 999));

export default {
  name: 'cPage',
  components: {
    cAbout,
    cFeaturedGame
  },
  data() {
    return {
      games
    };
  }
}
</script>