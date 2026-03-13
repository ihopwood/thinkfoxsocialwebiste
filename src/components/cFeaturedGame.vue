<template>
    <section class="featured-game container py-3 py-md-4">
        <div class="featured-shell mx-auto">
            <header class="featured-header section-panel text-center mb-4 mb-md-5">
                <img v-if="logoSrc" :src="logoSrc" :alt="game.logoAlt || game.title" class="featured-logo mb-3" />
                <p v-if="game.kicker" class="featured-kicker mb-2">{{ game.kicker }}</p>
                <h1 class="featured-title mb-2">{{ game.title }}</h1>
                <p class="featured-intro mb-0">{{ game.intro }}</p>
            </header>

            <div class="featured-content">
                <article v-for="feature in game.features" :key="feature.title" class="feature-block">
                    <h2>{{ feature.title }}</h2>
                    <p>{{ feature.description }}</p>
                </article>
            </div>
        </div>
    </section>
</template>

<script>
const logoAssets = import.meta.glob('/src/assets/**/*.{png,jpg,jpeg,webp,svg,avif,gif}', {
    eager: true,
    import: 'default'
})

export default {
    name: 'cFeaturedGame',
    props: {
        game: {
            type: Object,
            required: true
        }
    },
    computed: {
        logoSrc() {
            const logoPath = this.game.logoPath
            if (!logoPath) {
                return ''
            }

            if (logoPath.startsWith('/')) {
                return logoPath
            }

            const bundledAsset =
                logoAssets[`/src/assets/${logoPath}`] ||
                logoAssets[`/src/assets/games/${logoPath}`]

            return bundledAsset || logoPath
        }
    }
}
</script>
