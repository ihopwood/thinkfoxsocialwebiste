<template>
    <div class="d-flex flex-column min-vh-100">
        <cHeader />
        <main class="flex-grow-1 mt-5 pt-4">
            <section class="container py-4">
                <div class="page-shell mx-auto">

                    <header class="text-center mb-5">
                        <p class="page-kicker">Think Fox Social</p>
                        <h1 class="page-title mb-3">News &amp; Updates</h1>
                        <p class="page-intro">Design notes, game updates, and community news from the Think Fox Social
                            team.</p>
                    </header>

                    <!-- Category Filter -->
                    <div class="filter-row mb-4">
                        <button v-for="cat in categories" :key="cat"
                            :class="['filter-btn', { active: activeCategory === cat }]" @click="activeCategory = cat">{{
                            cat }}</button>
                    </div>

                    <!-- Posts -->
                    <div class="post-list">
                        <article class="post-card" v-for="post in filteredPosts" :key="post.id" @click="openPost(post)">
                            <div class="post-meta">
                                <span class="post-category">{{ post.category }}</span>
                                <span class="post-date">{{ post.date }}</span>
                            </div>
                            <h2 class="post-title">{{ post.title }}</h2>
                            <p class="post-excerpt">{{ post.excerpt }}</p>
                            <div class="post-footer">
                                <span class="post-author">by {{ post.author }}</span>
                                <button class="read-more-btn">Read More →</button>
                            </div>
                        </article>
                    </div>

                    <!-- Post Detail Modal -->
                    <div v-if="activePost" class="modal-overlay" @click.self="activePost = null">
                        <div class="modal-box">
                            <button class="modal-close" @click="activePost = null">×</button>
                            <p class="post-category mb-1">{{ activePost.category }}</p>
                            <h2 class="post-title mb-1">{{ activePost.title }}</h2>
                            <p class="modal-meta mb-3">{{ activePost.date }} · by {{ activePost.author }}</p>
                            <div class="modal-body" v-html="activePost.body"></div>
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

const posts = [
    {
        id: 1,
        category: 'Announcements',
        date: 'May 2026',
        title: 'Welcome to Think Fox Social!',
        author: 'The Team',
        excerpt: 'We are excited to launch our new website showcasing all of our tabletop games and projects. Here is what you can expect from us going forward.',
        body: `<p>Welcome to Think Fox Social — the home of our growing tabletop game library.</p>
<p>We are a small team of game designers and enthusiasts passionate about creating accessible, strategic, and fun tabletop experiences. This website is the hub for everything we create — from aerial combat in <strong>On Wings</strong> to high-stakes airship racing in <strong>Aether Cup</strong> to the grimdark squad warfare of <strong>Company of Ash</strong>.</p>
<p>In the coming months you can expect:</p>
<ul>
  <li>Regular rules updates and balance patches</li>
  <li>New print-and-play content added to the store</li>
  <li>Design diaries diving deep into how our games are built</li>
  <li>Community spotlights and battle reports</li>
</ul>
<p>Thanks for being here. The most important rule of all — <em>have fun!</em></p>`
    },
    {
        id: 2,
        category: 'On Wings',
        date: 'April 2026',
        title: 'On Wings v1.2 — Rules Update',
        author: 'Design Team',
        excerpt: 'Version 1.2 is live with clarifications to the G-force system, updated climb rates for heavy fighters, and two new scenario missions.',
        body: `<p><strong>On Wings v1.2</strong> is now available as a free download from the Store.</p>
<h3>Key Changes</h3>
<ul>
  <li><strong>G-Force Clarification:</strong> Hard turns now explicitly state that the penalty applies at the end of the maneuver phase, not on declaration.</li>
  <li><strong>Heavy Fighter Climb Rate:</strong> Heavy fighters reduced from 2 altitude steps to 1 on a powered climb. This better reflects historical performance data.</li>
  <li><strong>New Scenario — Escort Mission:</strong> A bomber escort mission with asymmetric win conditions for both sides.</li>
  <li><strong>New Scenario — Dawn Patrol:</strong> A low-visibility dogfight scenario with reduced initial detection range.</li>
  <li>Various typo and layout fixes throughout.</li>
</ul>
<p>If you purchased the PDF previously, re-download it from the Store to get the updated version at no extra cost.</p>`
    },
    {
        id: 3,
        category: 'Aether Cup',
        date: 'March 2026',
        title: 'Aether Cup: New Ships Coming Soon',
        author: 'Design Team',
        excerpt: 'We are hard at work on the next wave of airship designs for Aether Cup, including the new Frigate class and updated movement templates.',
        body: `<p>The next wave of content for <strong>Aether Cup</strong> is in the pipeline and we are very excited to share an early look.</p>
<h3>What Is Coming</h3>
<p><strong>The Ironclad Frigate</strong> — a slower, heavier ship class with superior ramming stats and a unique defensive hull ability that negates the first collision damage each race.</p>
<p><strong>Updated Movement Templates</strong> — revised arc templates for tighter courses and new optional rules for variable wind lanes that add a dynamic element to racing.</p>
<p><strong>Captain Card Expansion</strong> — 12 new captain ability cards covering sabotage, crew bonuses, and emergency boosts.</p>
<p>We are aiming for a late summer release. Follow us on our socials for sneak peeks as development continues.</p>`
    },
    {
        id: 4,
        category: 'Company of Ash',
        date: 'February 2026',
        title: 'Army Builder 2.0 Released',
        author: 'Design Team',
        excerpt: 'The Army Builder tool has been completely rewritten with a new squad-slot interface, updated points values, and a print-ready army sheet generator.',
        body: `<p><strong>Army Builder 2.0</strong> is now live and available free from the Company of Ash page or the Store.</p>
<h3>What Is New</h3>
<ul>
  <li><strong>New UI:</strong> A completely overhauled sidebar + main panel layout makes building your list faster and more intuitive.</li>
  <li><strong>Updated Points:</strong> All unit and weapon costs have been reviewed and updated for the current meta.</li>
  <li><strong>Print Sheet Generator:</strong> Generate a print-ready army sheet with all stats, weapons, and critical damage boxes — no more manual sheets.</li>
  <li><strong>Strategic Assets:</strong> Airstrikes and artillery assets are now tracked directly in the builder.</li>
  <li><strong>Validation Warnings:</strong> The builder now flags illegal builds (over points, missing command units, etc.) in real time.</li>
</ul>
<p>Open the Army Builder directly from the <a href="/companyofash">Company of Ash page</a>.</p>`
    },
    {
        id: 5,
        category: 'Design Notes',
        date: 'January 2026',
        title: 'Design Notes: The Philosophy Behind Company of Ash',
        author: 'Lead Designer',
        excerpt: 'A deep dive into the design decisions that shaped Company of Ash — from the Fortune die system to squad composition rules.',
        body: `<p>Company of Ash started as a simple question: what if squad-level skirmish games focused on <em>meaningful decisions</em> rather than dice volume?</p>
<h3>The Fortune Die</h3>
<p>Most wargames use a fixed target number to resolve fire. CoA uses the Fortune die — a single die per weapon that rolls for both hit quality and special effects in one roll. This keeps the game fast while making each roll feel significant. A roll of natural 6 always does something interesting. A roll of 1 always misses, no matter the modifiers.</p>
<h3>Suppression Over Casualties</h3>
<p>We deliberately designed suppression to be more tactically valuable than raw kills. A suppressed unit cannot move, attacks at reduced effectiveness, and eventually becomes pinned. This encourages players to think about controlling the board, not just removing models.</p>
<h3>The Squad Slot System</h3>
<p>The army builder reinforces this by organizing forces into platoons with composition rules. You cannot simply spam the most powerful unit — you need a balanced force that can fulfill multiple roles. This creates interesting army-building decisions and ensures no two lists are identical.</p>
<p>We will continue these design notes over the coming months covering vehicles, terrain rules, and the campaign system. Stay tuned.</p>`
    },
];

export default {
    name: 'vBlog',
    components: { cHeader, cFooter },
    data() {
        return {
            posts,
            activeCategory: 'All',
            activePost: null,
            categories: ['All', 'Announcements', 'On Wings', 'Aether Cup', 'Company of Ash', 'Design Notes'],
        };
    },
    computed: {
        filteredPosts() {
            if (this.activeCategory === 'All') return this.posts;
            return this.posts.filter(p => p.category === this.activeCategory);
        }
    },
    methods: {
        openPost(post) {
            this.activePost = post;
        }
    }
}
</script>

<style scoped>
.page-shell {
    max-width: 860px;
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

/* Filter */
.filter-row {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.filter-btn {
    padding: 0.35rem 0.9rem;
    border: 1px solid rgba(122, 169, 216, 0.35);
    border-radius: 999px;
    background: transparent;
    color: var(--was-text-muted);
    font-family: 'Alegreya SC', Georgia, serif;
    font-size: 0.88rem;
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
    background: rgba(212, 135, 95, 0.16);
    border-color: var(--was-fox);
    color: var(--was-fox);
}

/* Post List */
.post-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.post-card {
    background: linear-gradient(180deg, rgba(19, 42, 67, 0.88), rgba(12, 24, 40, 0.72));
    border: 1px solid rgba(122, 169, 216, 0.25);
    border-radius: 14px;
    padding: 1.25rem 1.4rem;
    cursor: pointer;
    transition: border-color 0.2s, box-shadow 0.2s;
}

.post-card:hover {
    border-color: rgba(212, 135, 95, 0.5);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
}

.post-meta {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.5rem;
}

.post-category {
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--was-gold);
}

.post-date {
    font-size: 0.78rem;
    color: var(--was-text-muted);
}

.post-title {
    font-size: 1.2rem;
    color: var(--was-paper);
    margin-bottom: 0.4rem;
    letter-spacing: 0.03em;
}

.post-excerpt {
    font-size: 0.93rem;
    color: var(--was-text-muted);
    line-height: 1.6;
    margin-bottom: 0.75rem;
}

.post-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.post-author {
    font-size: 0.8rem;
    color: var(--was-sky);
    font-style: italic;
}

.read-more-btn {
    background: transparent;
    border: 1px solid rgba(122, 169, 216, 0.4);
    color: var(--was-sky);
    border-radius: 999px;
    padding: 0.28rem 0.85rem;
    font-size: 0.82rem;
    font-weight: 700;
    cursor: pointer;
    letter-spacing: 0.04em;
    transition: all 0.2s;
}

.read-more-btn:hover {
    background: rgba(122, 169, 216, 0.15);
    border-color: var(--was-sky);
}

/* Modal */
.modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.7);
    z-index: 200;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding: 2rem 1rem;
    overflow-y: auto;
}

.modal-box {
    background: linear-gradient(180deg, rgba(14, 30, 50, 0.98), rgba(8, 18, 32, 0.98));
    border: 1px solid rgba(122, 169, 216, 0.4);
    border-radius: 16px;
    padding: 2rem;
    max-width: 680px;
    width: 100%;
    position: relative;
}

.modal-close {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: none;
    border: none;
    color: var(--was-text-muted);
    font-size: 1.5rem;
    line-height: 1;
    cursor: pointer;
    padding: 0 0.25rem;
    transition: color 0.2s;
}

.modal-close:hover {
    color: var(--was-paper);
}

.modal-meta {
    font-size: 0.82rem;
    color: var(--was-text-muted);
}

.modal-body {
    font-size: 0.97rem;
    color: var(--was-text);
    line-height: 1.75;
}

.modal-body p {
    margin-bottom: 0.9rem;
}

.modal-body h3 {
    font-size: 1rem;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--was-fox);
    margin: 1.25rem 0 0.4rem;
}

.modal-body ul {
    padding-left: 1.4rem;
    margin-bottom: 0.9rem;
}

.modal-body li {
    margin-bottom: 0.35rem;
    color: var(--was-text-muted);
}

.modal-body a {
    color: var(--was-sky);
}

.modal-body strong {
    color: var(--was-cream);
}
</style>
