<template>
    <div class="d-flex flex-column min-vh-100">
        <cHeader />
        <main class="flex-grow-1 mt-5 pt-4">
            <section class="container py-4">
                <div class="page-shell mx-auto">

                    <!-- Header -->
                    <header class="text-center mb-5">
                        <p class="page-kicker">Tactical Warfare Game</p>
                        <h1 class="page-title mb-3">Company of Ash</h1>
                        <p class="page-intro">Command elite military units in a war-torn fantasy realm. Squad-based
                            combat with
                            dynamic terrain, destructible environments, and devastating special abilities.</p>
                    </header>

                    <!-- Tools Row -->
                    <div class="tools-row mb-5">
                        <RouterLink :to="armyBuilderUrl" class="tool-card">
                            <div class="tool-icon"><i class="bi bi-layout-text-sidebar-reverse"></i></div>
                            <div>
                                <p class="tool-label">Army Builder</p>
                                <p class="tool-desc">Build and print your force list. Select units, weapons, and platoon
                                    structure.</p>
                            </div>
                            <span class="tool-arrow">→</span>
                        </RouterLink>
                        <RouterLink :to="combatCalcUrl" class="tool-card">
                            <div class="tool-icon"><i class="bi bi-calculator"></i></div>
                            <div>
                                <p class="tool-label">Combat Calculator</p>
                                <p class="tool-desc">Resolve ranged and melee combat with cover, facing, and suppression
                                    modifiers.</p>
                            </div>
                            <span class="tool-arrow">→</span>
                        </RouterLink>
                    </div>

                    <!-- Features -->
                    <h2 class="section-heading mb-3">Game Features</h2>
                    <div class="feature-grid mb-5">
                        <div class="feature-item" v-for="feat in features" :key="feat.title">
                            <h3>{{ feat.title }}</h3>
                            <p>{{ feat.desc }}</p>
                        </div>
                    </div>

                    <!-- Store -->
                    <h2 class="section-heading mb-3">Store</h2>
                    <div class="product-grid">
                        <div class="product-card" v-for="product in products" :key="product.id">
                            <div class="product-body">
                                <p class="product-tag">{{ product.tag }}</p>
                                <h3 class="product-name">{{ product.name }}</h3>
                                <p class="product-desc">{{ product.description }}</p>
                            </div>
                            <div class="product-footer">
                                <span class="product-price">{{ product.price === 0 ? 'Free' : '$' +
                                    product.price.toFixed(2) }}</span>
                                <button class="buy-btn" @click="buy(product)">
                                    {{ product.price === 0 ? 'Download' : 'Add to Cart' }}
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </section>
        </main>
        <cFooter />
    </div>
</template>

<script>
import cHeader from '@/components/cHeader.vue';
import cFooter from '@/components/cFooter.vue';

export default {
    name: 'vCompanyOfAshDetail',
    components: { cHeader, cFooter },
    data() {
        return {
            armyBuilderUrl: '/armybuilder',
            combatCalcUrl: '/combatcalc',
            features: [
                { title: 'Tactical Squad Combat', desc: 'Lead your Company through intense skirmish battles using positioning, cover mechanics, and coordinated squad maneuvers.' },
                { title: 'Army Builder Tools', desc: 'Customize your forces with the interactive Army Builder. Select units, weapons, and balance your force composition.' },
                { title: 'Combat Calculator', desc: 'Resolve complex combat with our integrated tool. Factor in range, cover, facing, and unit capabilities.' },
                { title: 'Expandable Universe', desc: 'New unit types, weapons, and special rules keep the game fresh and engaging as the universe grows.' },
            ],
            products: [
                { id: 1, tag: 'Core Game', name: 'Core Rules PDF', description: 'Complete rules for Company of Ash. Print or play digital.', price: 9.99 },
                { id: 2, tag: 'Print & Play', name: 'Starter Force Kit', description: 'Printable tokens, unit cards, and terrain tiles to get your first game running.', price: 14.99 },
                { id: 3, tag: 'Digital Tool', name: 'Army Builder', description: 'Interactive web tool to build and print your force list.', price: 0 },
                { id: 4, tag: 'Digital Tool', name: 'Combat Calculator', description: 'Web-based dice resolution tool for ranged and melee combat.', price: 0 },
                { id: 5, tag: 'Expansion', name: 'Northern Campaign', description: 'New missions, units, and terrain rules for winter warfare environments.', price: 9.99 },
            ],
        };
    },
    methods: {
        buy(product) {
            if (product.price === 0) {
                const url = product.name === 'Army Builder' ? this.armyBuilderUrl : this.combatCalcUrl;
                this.$router.push(url);
            } else {
                alert(`Added to cart: ${product.name}`);
            }
        }
    }
}
</script>

<style scoped>
.page-shell {
    max-width: 1040px;
}

.page-kicker {
    color: var(--was-gold);
    font-weight: 700;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    font-size: 0.74rem;
    margin-bottom: 0.4rem;
}

.page-title {
    font-size: clamp(1.8rem, 3.2vw, 2.6rem);
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: var(--was-paper);
}

.page-intro {
    color: var(--was-text-muted);
    font-size: 1.04rem;
    max-width: 680px;
    margin: 0 auto;
    line-height: 1.7;
}

.section-heading {
    font-size: 1rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--was-gold);
    border-bottom: 1px solid rgba(122, 169, 216, 0.2);
    padding-bottom: 0.5rem;
}

/* Tool Cards */
.tools-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
}

@media (max-width: 640px) {
    .tools-row {
        grid-template-columns: 1fr;
    }
}

.tool-card {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.25rem 1.25rem;
    background: linear-gradient(180deg, rgba(19, 42, 67, 0.9), rgba(12, 24, 40, 0.75));
    border: 1px solid rgba(122, 169, 216, 0.35);
    border-radius: 14px;
    text-decoration: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    color: inherit;
}

.tool-card:hover {
    border-color: var(--was-fox);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.28);
    color: inherit;
}

.tool-icon {
    font-size: 1.8rem;
    color: var(--was-sky);
    flex-shrink: 0;
    line-height: 1;
}

.tool-label {
    font-family: 'Alegreya SC', Georgia, serif;
    font-size: 1.05rem;
    color: var(--was-paper);
    font-weight: 700;
    margin: 0 0 0.2rem;
}

.tool-desc {
    font-size: 0.87rem;
    color: var(--was-text-muted);
    margin: 0;
    line-height: 1.5;
}

.tool-arrow {
    margin-left: auto;
    font-size: 1.2rem;
    color: var(--was-fox);
    flex-shrink: 0;
}

/* Feature Grid */
.feature-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 0.9rem;
}

.feature-item {
    background: linear-gradient(180deg, rgba(19, 42, 67, 0.84), rgba(12, 24, 40, 0.62));
    border: 1px solid rgba(122, 169, 216, 0.2);
    border-radius: 12px;
    padding: 1rem;
}

.feature-item h3 {
    font-size: 0.95rem;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--was-fox);
    margin: 0 0 0.35rem;
}

.feature-item p {
    font-size: 0.9rem;
    color: var(--was-text-muted);
    margin: 0;
    line-height: 1.55;
}

/* Product Grid */
.product-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 1rem;
}

.product-card {
    background: linear-gradient(180deg, rgba(19, 42, 67, 0.9), rgba(12, 24, 40, 0.75));
    border: 1px solid rgba(122, 169, 216, 0.25);
    border-radius: 14px;
    display: flex;
    flex-direction: column;
    transition: border-color 0.2s, box-shadow 0.2s;
}

.product-card:hover {
    border-color: rgba(212, 135, 95, 0.5);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
}

.product-body {
    flex: 1;
    padding: 1rem;
}

.product-tag {
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--was-gold);
    margin-bottom: 0.2rem;
}

.product-name {
    font-size: 1rem;
    color: var(--was-paper);
    margin-bottom: 0.35rem;
    font-family: 'Alegreya SC', Georgia, serif;
}

.product-desc {
    font-size: 0.88rem;
    color: var(--was-text-muted);
    line-height: 1.5;
    margin: 0;
}

.product-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 1rem;
    border-top: 1px solid rgba(122, 169, 216, 0.12);
}

.product-price {
    font-weight: 700;
    color: var(--was-fox);
    font-size: 1.05rem;
    font-family: 'Alegreya SC', Georgia, serif;
}

.buy-btn {
    background: transparent;
    border: 1px solid rgba(212, 135, 95, 0.6);
    color: var(--was-fox);
    border-radius: 999px;
    padding: 0.3rem 0.9rem;
    font-size: 0.84rem;
    font-weight: 700;
    cursor: pointer;
    letter-spacing: 0.04em;
    transition: all 0.2s;
}

.buy-btn:hover {
    background: var(--was-fox);
    color: #111;
}
</style>
