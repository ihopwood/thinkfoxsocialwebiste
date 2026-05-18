<template>
    <div class="d-flex flex-column min-vh-100">
        <cHeader />
        <main class="flex-grow-1 mt-5 pt-4">
            <section class="container py-4">
                <div class="page-shell mx-auto">

                    <!-- Header -->
                    <header class="text-center mb-5">
                        <p class="page-kicker">High-Stakes Airship Racing</p>
                        <h1 class="page-title mb-3">Aether Cup</h1>
                        <p class="page-intro">Step into the fantastical world of the Aether Cup, where speed,
                            navigation, and
                            custom-built airships collide in the ultimate aerial race.</p>
                    </header>

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
    name: 'vAetherCupDetail',
    components: { cHeader, cFooter },
    data() {
        return {
            features: [
                { title: 'Design Your Fleet', desc: 'Print your own fleet of ships, including Torpedo boats and Frigates based on unique English and German analogues. The current core set provides everything needed to begin, with ongoing updates expanding your racing horizons.' },
                { title: 'Master the Course', desc: 'Aether Cup is designed for precision play. Use specialized movement templates to navigate your airships, and keep a sharp eye on orientation — the "Red on Right, Returning!" rule keeps you on course.' },
                { title: 'Built for Growth', desc: 'The Aether Cup universe is expanding with new terrain models, small-scale ship variants, and playtested rules for airship racing alongside new captain, crew, and equipment cards.' },
                { title: 'Play Your Way', desc: 'Whether you are a master ship-builder or a tactical pilot, Aether Cup offers a growing and engaging experience designed to reward creativity, precision, and skill at the table.' },
            ],
            products: [
                { id: 1, tag: 'Core Game', name: 'Core Rules PDF', description: 'Full rulebook for Aether Cup airship racing. Design your fleet and race for glory.', price: 9.99 },
                { id: 2, tag: 'Print & Play', name: 'Ship Fleet Kit', description: 'Printable Torpedo boats and Frigates — English and German analogues ready to assemble and race.', price: 12.99 },
                { id: 3, tag: 'Accessories', name: 'Captain & Crew Cards', description: 'A deck of unique captain and crew ability cards to customize your racing strategy.', price: 7.99 },
                { id: 4, tag: 'Accessories', name: 'Hull Templates Pack', description: 'Movement and maneuvering templates for precision racing on any course.', price: 4.99 },
                { id: 5, tag: 'Digital', name: 'Race Tracker Sheet', description: 'Printable lap and damage tracking sheet for up to 6 racers.', price: 0 },
            ],
        };
    },
    methods: {
        buy(product) {
            if (product.price === 0) {
                alert(`Downloading: ${product.name}`);
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
    font-size: 1rem;
    font-family: 'Alegreya SC', Georgia, serif;
}

.buy-btn {
    background: transparent;
    border: 1px solid rgba(212, 135, 95, 0.6);
    color: var(--was-fox);
    border-radius: 999px;
    padding: 0.3rem 0.85rem;
    font-size: 0.82rem;
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
