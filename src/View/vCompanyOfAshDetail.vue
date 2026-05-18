<template>
    <div class="d-flex flex-column min-vh-100">
        <cHeader />
        <main class="flex-grow-1 mt-5 pt-4">
            <section class="container py-4">
                <div class="coa-header text-center mb-4">
                    <img src="/src/assets/games/companyofash/logo/coalogo.png" alt="Company of Ash Logo" class="mb-3"
                        style="max-width:220px;" />
                    <h1 class="display-5 mb-2">Company of Ash: Grimdark Skirmish Warfare</h1>
                    <p class="lead">Command elite military units in a war-torn fantasy realm where steel, tactics, and
                        cunning determine victory.</p>
                </div>
                <div class="row g-4">
                    <div class="col-md-7">
                        <h2 class="h4 mb-3">Game Features</h2>
                        <ul class="list-group mb-4">
                            <li class="list-group-item">Tactical Squad Combat: Lead your Company through intense
                                skirmish battles using positioning, cover mechanics, and coordinated squad maneuvers.
                            </li>
                            <li class="list-group-item">Army Builder Tools: Customize your forces with the interactive
                                Army Builder.</li>
                            <li class="list-group-item">Advanced Combat Calculator: Resolve complex combat interactions
                                with our integrated tool.</li>
                            <li class="list-group-item">Expandable Universe: New unit types, weapons, and special rules
                                keep the game fresh.</li>
                        </ul>
                        <a href="/src/assets/games/companyofash/pages/ArmyBuilder.html" target="_blank"
                            class="btn btn-primary mb-3">Open Army Builder</a>
                    </div>
                    <div class="col-md-5">
                        <h2 class="h4 mb-3">Combat Calculator</h2>
                        <iframe :src="combatCalcUrl" width="100%" height="600"
                            style="border:1px solid #ccc;border-radius:10px;background:#1a1a1e;"
                            title="Combat Calculator"></iframe>
                        <div class="small text-muted mt-2">Calculator opens in-page. For full screen, <a
                                :href="combatCalcUrl" target="_blank">open in new tab</a>.</div>
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
            combatCalcUrl: '/src/assets/games/companyofash/pages/CombatCac.html'
        }
    }
}
</script>

<style scoped>
.coa-header img {
    max-height: 120px;
}

.coa-header h1 {
    font-weight: 700;
}

.coa-header {
    margin-bottom: 2.5rem;
}

.list-group-item {
    background: rgba(18, 38, 61, 0.84);
    color: #e0e0e0;
    border: 1px solid rgba(122, 169, 216, 0.18);
    font-size: 1.04rem;
    margin-bottom: 0.2rem;
}

.btn-primary {
    background: var(--was-fox);
    border-color: var(--was-fox);
    color: #222;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
}

.btn-primary:hover {
    background: var(--was-sky-deep);
    border-color: var(--was-sky-deep);
    color: #fff;
}

iframe {
    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.18);
}
</style>
