<template>
    <div class="d-flex flex-column min-vh-100">
        <cHeader />
        <main class="flex-grow-1 mt-5 pt-4">
            <section class="container py-4">
                <div class="page-shell mx-auto">

                    <header class="text-center mb-5">
                        <p class="page-kicker">Think Fox Social</p>
                        <h1 class="page-title mb-3">Store</h1>
                        <p class="page-intro">Print-and-play rules, digital tools, and expansions for all Think Fox
                            games. Everything listed is currently in development or early access.</p>
                    </header>

                    <!-- Filter tabs -->
                    <div class="filter-row mb-4">
                        <button v-for="tab in tabs" :key="tab" :class="['filter-btn', { active: activeTab === tab }]"
                            @click="activeTab = tab">{{ tab }}</button>
                    </div>

                    <!-- Products grouped by game -->
                    <div v-for="game in filteredGames" :key="game.id" class="game-section mb-5">
                        <div class="game-section-head mb-3">
                            <h2 class="game-section-title">{{ game.name }}</h2>
                            <span class="game-section-tag">{{ game.tag }}</span>
                        </div>
                        <div class="product-grid">
                            <div class="product-card" v-for="product in game.products" :key="product.id">
                                <div class="product-img-wrap">
                                    <img :src="product.image" :alt="product.name" class="product-img" />
                                </div>
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

                </div>
            </section>
        </main>
        <cFooter />
    </div>
</template>

<script>
import cHeader from '@/components/cHeader.vue';
import cFooter from '@/components/cFooter.vue';

const allGames = [
    {
        id: 'onwings',
        name: 'On Wings',
        tag: 'World War II Aerial Combat',
        products: [
            { id: 'ow1', tag: 'Core Game', name: 'Core Rules PDF', description: 'Complete World War II aerial combat rulebook. Everything needed to take to the skies.', price: 9.99, image: 'https://placehold.co/320x180/112640/7aa9d8?text=On+Wings+Rules' },
            { id: 'ow2', tag: 'Print & Play', name: 'Starter Kit', description: 'Printable planes, tokens, altitude discs, and play aids to run your first game.', price: 14.99, image: 'https://placehold.co/320x180/112640/7aa9d8?text=Starter+Kit' },
            { id: 'ow3', tag: 'Expansion', name: 'Eastern Front', description: 'New planes, missions, and campaign rules for the brutal Eastern Front theatre.', price: 9.99, image: 'https://placehold.co/320x180/0a1628/d4875f?text=Eastern+Front' },
            { id: 'ow4', tag: 'Accessories', name: 'Token Set', description: 'Printable damage markers, altitude tokens, and status indicators.', price: 4.99, image: 'https://placehold.co/320x180/0a1628/ece38a?text=Token+Set' },
            { id: 'ow5', tag: 'Digital', name: 'Quick Reference Card', description: 'One-page PDF of all core rules and modifiers. Perfect for new players.', price: 0, image: 'https://placehold.co/320x180/112640/6ecf8e?text=Quick+Reference' },
        ]
    },
    {
        id: 'aethercup',
        name: 'Aether Cup',
        tag: 'High-Stakes Airship Racing',
        products: [
            { id: 'ac1', tag: 'Core Game', name: 'Core Rules PDF', description: 'Full rulebook for Aether Cup airship racing. Design your fleet and race for glory.', price: 9.99, image: 'https://placehold.co/320x180/183656/ece38a?text=Aether+Cup+Rules' },
            { id: 'ac2', tag: 'Print & Play', name: 'Ship Fleet Kit', description: 'Printable Torpedo boats and Frigates — English and German analogues ready to assemble.', price: 12.99, image: 'https://placehold.co/320x180/183656/ece38a?text=Fleet+Kit' },
            { id: 'ac3', tag: 'Accessories', name: 'Captain & Crew Cards', description: 'A deck of unique captain and crew ability cards to customize your racing strategy.', price: 7.99, image: 'https://placehold.co/320x180/0a1628/d4875f?text=Crew+Cards' },
            { id: 'ac4', tag: 'Accessories', name: 'Hull Templates Pack', description: 'Movement and maneuvering templates for precision racing on the course.', price: 4.99, image: 'https://placehold.co/320x180/0a1628/ece38a?text=Templates' },
            { id: 'ac5', tag: 'Digital', name: 'Race Tracker Sheet', description: 'Printable lap and damage tracking sheet for up to 6 racers.', price: 0, image: 'https://placehold.co/320x180/183656/6ecf8e?text=Race+Tracker' },
        ]
    },
    {
        id: 'companyofash',
        name: 'Company of Ash',
        tag: 'Grimdark Skirmish Warfare',
        products: [
            { id: 'coa1', tag: 'Core Game', name: 'Core Rules PDF', description: 'Complete rules for Company of Ash grimdark skirmish combat.', price: 9.99, image: 'https://placehold.co/320x180/1a1028/d4875f?text=CoA+Rules' },
            { id: 'coa2', tag: 'Print & Play', name: 'Starter Force Kit', description: 'Printable tokens, unit cards, and terrain tiles to run your first skirmish.', price: 14.99, image: 'https://placehold.co/320x180/1a1028/7aa9d8?text=Starter+Force' },
            { id: 'coa3', tag: 'Digital Tool', name: 'Army Builder', description: 'Interactive web tool to build and print your force list. Free forever.', price: 0, image: 'https://placehold.co/320x180/1a1028/6ecf8e?text=Army+Builder', link: '/src/assets/games/companyofash/pages/ArmyBuilder.html' },
            { id: 'coa4', tag: 'Digital Tool', name: 'Combat Calculator', description: 'Web-based dice resolution tool for ranged and melee combat. Free forever.', price: 0, image: 'https://placehold.co/320x180/1a1028/6ecf8e?text=Combat+Calc', link: '/src/assets/games/companyofash/pages/CombatCac.html' },
            { id: 'coa5', tag: 'Expansion', name: 'Northern Campaign', description: 'New missions, units, and terrain rules for winter warfare environments.', price: 9.99, image: 'https://placehold.co/320x180/1a1028/d4875f?text=Northern+Campaign' },
        ]
    },
];

export default {
    name: 'vStore',
    components: { cHeader, cFooter },
    data() {
        return {
            activeTab: 'All Games',
            tabs: ['All Games', 'On Wings', 'Aether Cup', 'Company of Ash'],
            games: allGames,
        };
    },
    computed: {
        filteredGames() {
            if (this.activeTab === 'All Games') return this.games;
            return this.games.filter(g => g.name === this.activeTab);
        }
    },
    methods: {
        buy(product) {
            if (product.price === 0 && product.link) {
                window.open(product.link, '_blank');
            } else if (product.price === 0) {
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
    max-width: 640px;
    margin: 0 auto;
    line-height: 1.7;
}

/* Filter Tabs */
.filter-row {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.filter-btn {
    padding: 0.4rem 1rem;
    border: 1px solid rgba(122, 169, 216, 0.4);
    border-radius: 999px;
    background: transparent;
    color: var(--was-text-muted);
    font-family: 'Alegreya SC', Georgia, serif;
    font-size: 0.9rem;
    font-weight: 700;
    cursor: pointer;
    letter-spacing: 0.04em;
    transition: all 0.2s;
}

.filter-btn:hover {
    border-color: var(--was-fox);
    color: var(--was-fox);
}

.filter-btn.active {
    background: rgba(212, 135, 95, 0.18);
    border-color: var(--was-fox);
    color: var(--was-fox);
}

/* Game Sections */
.game-section-head {
    display: flex;
    align-items: baseline;
    gap: 0.75rem;
    border-bottom: 1px solid rgba(122, 169, 216, 0.2);
    padding-bottom: 0.5rem;
}

.game-section-title {
    font-size: 1.3rem;
    color: var(--was-paper);
    letter-spacing: 0.06em;
    text-transform: uppercase;
    margin: 0;
}

.game-section-tag {
    font-size: 0.74rem;
    color: var(--was-text-muted);
    letter-spacing: 0.08em;
    text-transform: uppercase;
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
    overflow: hidden;
    transition: border-color 0.2s, box-shadow 0.2s;
}

.product-card:hover {
    border-color: rgba(212, 135, 95, 0.5);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
}

.product-img-wrap {
    overflow: hidden;
}

.product-img {
    width: 100%;
    height: 140px;
    object-fit: cover;
    display: block;
}

.product-body {
    flex: 1;
    padding: 0.9rem;
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
    margin-bottom: 0.3rem;
    font-family: 'Alegreya SC', Georgia, serif;
}

.product-desc {
    font-size: 0.87rem;
    color: var(--was-text-muted);
    line-height: 1.5;
    margin: 0;
}

.product-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.7rem 0.9rem;
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
