<template>
    <section class="container py-4">
        <div class="page-shell mx-auto">
            <header class="page-header text-center mb-5">
                <p class="page-kicker">World War II Aerial Combat</p>
                <h1 class="page-title mb-3">On Wings — Store</h1>
                <p class="page-intro">Pick up the rules, expansions, and accessories to take flight at your table.</p>
            </header>

            <div class="product-grid">
                <div class="product-card" v-for="product in products" :key="product.id">
                    <div class="product-img-wrap">
                        <img :src="product.image" :alt="product.name" class="product-img" />
                    </div>
                    <div class="product-body">
                        <p class="product-tag">{{ product.tag }}</p>
                        <h2 class="product-name">{{ product.name }}</h2>
                        <p class="product-desc">{{ product.description }}</p>
                    </div>
                    <div class="product-footer">
                        <span class="product-price">{{ product.price === 0 ? 'Free' : '$' + product.price.toFixed(2)
                            }}</span>
                        <button class="buy-btn" @click="buy(product)">
                            {{ product.price === 0 ? 'Download' : 'Add to Cart' }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
export default {
    name: 'cOnWings',
    data() {
        return {
            products: [
                { id: 1, tag: 'Core Game', name: 'On Wings Core Rules', description: 'The complete World War II aerial combat rulebook. Everything you need to start flying.', price: 9.99, image: 'https://placehold.co/320x180/112640/7aa9d8?text=On+Wings+Rules' },
                { id: 2, tag: 'Print & Play', name: 'Starter Kit', description: 'Printable planes, tokens, and play aids for the full base game experience.', price: 14.99, image: 'https://placehold.co/320x180/112640/7aa9d8?text=Starter+Kit' },
                { id: 3, tag: 'Expansion', name: 'Eastern Front', description: 'New planes, missions, and campaign rules for the brutal Eastern Front theatre.', price: 9.99, image: 'https://placehold.co/320x180/0a1628/d4875f?text=Eastern+Front' },
                { id: 4, tag: 'Accessories', name: 'Token Set', description: 'Printable damage markers, altitude tokens, and status indicators.', price: 4.99, image: 'https://placehold.co/320x180/0a1628/ece38a?text=Token+Set' },
                { id: 5, tag: 'Digital', name: 'Quick Reference Card', description: 'One-page PDF summary of all core rules and modifiers. Perfect for new players.', price: 0, image: 'https://placehold.co/320x180/112640/6ecf8e?text=Quick+Reference' },
            ],
        };
    },
    methods: {
        buy(product) {
            alert(product.price === 0 ? `Downloading: ${product.name}` : `Added to cart: ${product.name}`);
        },
    },
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
    max-width: 600px;
    margin: 0 auto;
    line-height: 1.7;
}

.product-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.25rem;
}

.product-card {
    background: linear-gradient(180deg, rgba(19, 42, 67, 0.9), rgba(12, 24, 40, 0.75));
    border: 1px solid rgba(122, 169, 216, 0.3);
    border-radius: 14px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    transition: border-color 0.2s, box-shadow 0.2s;
}

.product-card:hover {
    border-color: rgba(212, 135, 95, 0.6);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.product-img-wrap {
    overflow: hidden;
}

.product-img {
    width: 100%;
    height: 160px;
    object-fit: cover;
    display: block;
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
    margin-bottom: 0.25rem;
}

.product-name {
    font-size: 1.05rem;
    color: var(--was-paper);
    margin-bottom: 0.4rem;
    font-family: 'Alegreya SC', Georgia, serif;
}

.product-desc {
    font-size: 0.9rem;
    color: var(--was-text-muted);
    line-height: 1.55;
    margin: 0;
}

.product-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 1rem;
    border-top: 1px solid rgba(122, 169, 216, 0.15);
}

.product-price {
    font-weight: 700;
    color: var(--was-fox);
    font-size: 1.1rem;
    font-family: 'Alegreya SC', Georgia, serif;
}

.buy-btn {
    background: transparent;
    border: 1px solid rgba(212, 135, 95, 0.7);
    color: var(--was-fox);
    border-radius: 999px;
    padding: 0.35rem 1rem;
    font-size: 0.85rem;
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
