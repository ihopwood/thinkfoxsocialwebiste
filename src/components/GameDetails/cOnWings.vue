<template>
    <div class="storefront">
        <h1 class="mb-4">On Wings Storefront</h1>
        <div class="products">
            <div class="product-card" v-for="product in products" :key="product.id">
                <img :src="product.image" :alt="product.name" class="product-image" />
                <h2 class="product-title">{{ product.name }}</h2>
                <p class="product-desc">{{ product.description }}</p>
                <div class="product-footer">
                    <span class="product-price">${{ product.price }}</span>
                    <button class="buy-btn" @click="buy(product)">Buy</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
// import cAbout from './cAbout.vue';
// import cFeaturedGame from './cFeaturedGame.vue';

// const gameModules = import.meta.glob('/src/assets/games/*/game.json', {
//     eager: true
// });

// const games = Object.values(gameModules)
//     .map((module) => module.default || module)
//     .sort((a, b) => (a.order || 999) - (b.order || 999));

export default {
    name: 'cOnWings',
    data() {
        return {
            products: [
                {
                    id: 1,
                    name: 'On Wings Base Game',
                    description: 'The core World War II aerial combat experience. Includes all base rules and components.',
                    price: 39.99,
                    image: 'https://placehold.co/300x180?text=On+Wings+Base',
                },
                {
                    id: 2,
                    name: 'Expansion: Eastern Front',
                    description: 'Expand your battles to the Eastern Front with new planes, missions, and scenarios.',
                    price: 19.99,
                    image: 'https://placehold.co/300x180?text=Eastern+Front',
                },
                {
                    id: 3,
                    name: 'Miniature Planes Set',
                    description: 'A set of detailed miniature planes to enhance your On Wings experience.',
                    price: 24.99,
                    image: 'https://placehold.co/300x180?text=Miniature+Planes',
                },
            ],
        };
    },
    methods: {
        buy(product) {
            alert(`Thank you for buying: ${product.name}!`);
        },
    },
}
</script>

<style scoped>
.storefront {
    max-width: 900px;
    margin: 0 auto;
    padding: 2rem 1rem;
}

.products {
    display: flex;
    flex-wrap: wrap;
    gap: 2rem;
    justify-content: center;
}

.product-card {
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    padding: 1.5rem;
    width: 300px;
    display: flex;
    flex-direction: column;
    align-items: center;
    transition: box-shadow 0.2s;
}

.product-card:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.product-image {
    width: 100%;
    height: 180px;
    object-fit: cover;
    border-radius: 8px;
    margin-bottom: 1rem;
}

.product-title {
    font-size: 1.3rem;
    margin: 0.5rem 0 0.2rem 0;
}

.product-desc {
    font-size: 1rem;
    color: #555;
    margin-bottom: 1rem;
    text-align: center;
}

.product-footer {
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
}

.product-price {
    font-weight: bold;
    color: #1a7f37;
    font-size: 1.1rem;
}

.buy-btn {
    background: #007bff;
    color: #fff;
    border: none;
    border-radius: 6px;
    padding: 0.5rem 1.2rem;
    cursor: pointer;
    font-size: 1rem;
    transition: background 0.2s;
}

.buy-btn:hover {
    background: #0056b3;
}
</style>