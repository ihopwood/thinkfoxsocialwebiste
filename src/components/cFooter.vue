<template>
  <footer class="footer mt-auto py-4">
    <div class="container">
      <div class="footer-inner">
        <div class="footer-brand">
          <p class="footer-name">Think Fox Social</p>
          <p class="footer-tagline">Bringing Imaginations to Life Through Tabletop Gaming</p>
        </div>
        <nav class="footer-links">
          <RouterLink to="/">Home</RouterLink>
          <RouterLink to="/store">Store</RouterLink>
          <RouterLink to="/blog">Blog</RouterLink>
          <RouterLink to="/onwings">On Wings</RouterLink>
          <RouterLink to="/companyofash">Company of Ash</RouterLink>
        </nav>
      </div>
      <div class="footer-bottom">
        <p class="footer-copy">&copy; 2026 Think Fox Social. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'cFooter'
}
</script>

<style scoped>
.footer {
  background: linear-gradient(180deg, rgba(10, 20, 34, 0.94), rgba(8, 15, 26, 0.96));
  border-top: 1px solid rgba(122, 169, 216, 0.3);
}

.footer-inner {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 1.5rem;
  padding-bottom: 1.25rem;
  border-bottom: 1px solid rgba(122, 169, 216, 0.12);
  margin-bottom: 1rem;
}

.footer-name {
  font-family: 'Alegreya SC', Georgia, serif;
  font-weight: 700;
  font-size: 1.05rem;
  color: var(--was-paper);
  margin: 0 0 0.2rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.footer-tagline {
  font-size: 0.82rem;
  color: var(--was-text-muted);
  margin: 0;
}

.footer-links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem 1.25rem;
  align-items: center;
}

.footer-links a {
  font-size: 0.88rem;
  color: var(--was-text-muted);
  text-decoration: none;
  font-family: 'Alegreya SC', Georgia, serif;
  font-weight: 700;
  letter-spacing: 0.04em;
  transition: color 0.2s;
}

.footer-links a:hover {
  color: var(--was-fox);
}

.footer-bottom {
  text-align: center;
}

.footer-copy {
  font-size: 0.8rem;
  color: rgba(205, 217, 234, 0.45);
  margin: 0;
  letter-spacing: 0.05em;
  font-family: 'Alegreya SC', Georgia, serif;
}
</style>
