<template>
  <nav class="navbar navbar-expand-lg fixed-top shadow-sm app-nav">
    <div class="container py-2">
      <a class="navbar-brand py-0 header-brand" href="#About" aria-label="Go to About section">
        <img src="@/assets/logo.PNG" alt="Think Fox Social" class="header-logo me-2" />
      </a>

      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav align-items-lg-center gap-lg-2 mb-3 mb-lg-0 ms-lg-3">
          <li class="nav-item">
            <a class="nav-link nav-pill" href="#About">About</a>
          </li>
          <li v-for="game in games" :key="game.id" class="nav-item">
            <a class="nav-link nav-pill" :href="`#${game.anchorId || game.id}`">
              {{ game.navLabel || game.title }}
            </a>
          </li>
        </ul>

        <div class="ms-lg-auto d-flex flex-wrap gap-2 social-wrap">
          <a v-for="s in socials" :key="s.id" :href="s.href"
            :class="['social-pill', { 'patron-pill': s.type === 'patron' }]" :aria-label="'Think Fox on ' + s.label">
            <i :class="s.icon"></i>
          </a>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import socialsData from '/src/assets/socials.json';

const gameModules = import.meta.glob('/src/assets/games/*/game.json', {
  eager: true
});

const games = Object.values(gameModules)
  .map((module) => module.default || module)
  .sort((a, b) => (a.order || 999) - (b.order || 999));

export default {
  name: 'cHeader',
  data() {
    return {
      games,
      socials: socialsData.filter(s => s.href)
    };
  }
}
</script>