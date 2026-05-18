<template>
  <nav class="navbar navbar-expand-lg fixed-top shadow-sm app-nav">
    <div class="container py-2">
      <RouterLink class="navbar-brand py-0 header-brand" to="/" aria-label="Think Fox Social Home">
        <img src="@/assets/logo.PNG" alt="Think Fox Social" class="header-logo" />
      </RouterLink>

      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav align-items-lg-center gap-lg-2 mb-3 mb-lg-0 ms-lg-3">
          <li class="nav-item">
            <RouterLink class="nav-link nav-pill" to="/blog">Blog</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link nav-pill" :to="{ path: '/', hash: '#About' }">About</RouterLink>
          </li>

          <li v-for="game in games" :key="game.id" class="nav-item">
            <RouterLink class="nav-link nav-pill" :to="{ path: '/', hash: `#${game.anchorId || game.id}` }">
              {{ game.navLabel || game.title }}
            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link nav-pill" to="/store">Store</RouterLink>
          </li>

        </ul>

        <div class="ms-lg-auto d-flex flex-wrap gap-2 align-items-center social-wrap">
          <a v-for="s in socials" :key="s.id" :href="s.href"
            :class="['social-pill', { 'patron-pill': s.type === 'patron' }]" :aria-label="'Think Fox on ' + s.label">
            <i :class="s.icon"></i>
          </a>
          <button class="theme-toggle" @click="toggleTheme"
            :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'">
            <i :class="isDark ? 'bi bi-sun-fill' : 'bi bi-moon-stars-fill'"></i>
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import socialsData from '/src/assets/socials.json';

const gameModules = import.meta.glob('/src/assets/games/*/game.json', { eager: true });
const games = Object.values(gameModules)
  .map((m) => m.default || m)
  .sort((a, b) => (a.order || 999) - (b.order || 999));

export default {
  name: 'cHeader',
  data() {
    return {
      games,
      socials: socialsData.filter(s => s.href),
      isDark: true
    };
  },
  mounted() {
    this.isDark = (document.documentElement.getAttribute('data-theme') || 'dark') === 'dark';
  },
  methods: {
    toggleTheme() {
      this.isDark = !this.isDark;
      const theme = this.isDark ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('was-theme', theme);
    }
  }
}
</script>