<template>
  <div class="d-flex flex-column min-vh-100">
    <cHeader />
    <main class="flex-grow-1 mt-5 pt-4">
      <section class="container py-4 page-shell">
        <header class="text-center mb-4">
          <p class="page-kicker">Resolution Tool</p>
          <h1 class="page-title mb-3">Combat Calculator</h1>
        </header>

        <div class="d-flex justify-content-center gap-2 mb-4">
          <button class="nav-pill" :class="{ 'active-tab': activeTab === 'ranged' }" @click="activeTab = 'ranged'">Ranged Fire</button>
          <button class="nav-pill" :class="{ 'active-tab': activeTab === 'melee' }" @click="activeTab = 'melee'">Melee</button>
          <button class="nav-pill px-3" @click="showHelp = true">?</button>
        </div>

        <div v-if="showHelp" class="modal-overlay d-flex align-items-center justify-content-center" @click.self="showHelp = false">
          <div class="card p-4 mx-3" style="max-width: 600px; z-index: 1050;">
            <div class="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
              <h5 class="m-0" style="color: var(--was-paper)">Calculator Guide</h5>
              <button class="btn-close btn-close-white" @click="showHelp = false"></button>
            </div>
            <div class="small text-muted" style="line-height: 1.6; max-height: 60vh; overflow-y: auto;">
              <h6 style="color: var(--was-sky)">RANGED FIRE</h6>
              <p>Build your attacking squad using up to 3 slots. Set Optimum (+1 Fortune), Normal, or Long (−1) per weapon. The calculator will automatically process modifiers against the selected target.</p>
              <h6 style="color: var(--was-sky)">MELEE</h6>
              <p>Enter stats directly. Suppression removes models from the attack pool. 2+ suppression = −1 Fortune. 4 = Pinned. Resolves paired and uncontested attacks dynamically.</p>
            </div>
          </div>
        </div>

        <div v-show="activeTab === 'ranged'" class="row">
          <div class="col-lg-6 mb-4">
            <div class="card p-3 section-panel mb-3">
              <h3 class="slabel">Attacking Squad</h3>
              
              <div v-for="(slot, idx) in rSlots" :key="slot.id" class="slot-box p-3 mb-3 rounded">
                <div class="d-flex justify-content-between align-items-center mb-2">
                  <span class="fw-bold" style="color: var(--was-sky)">Unit Slot {{ idx + 1 }}</span>
                  <button class="btn btn-sm text-danger p-0" @click="removeSlot(idx)">×</button>
                </div>
                
                <div class="row g-2 align-items-center mb-2">
                  <div class="col-4"><label class="small text-muted mb-0">Faction</label></div>
                  <div class="col-8">
                    <select class="form-select was-input form-select-sm" v-model="slot.fac" @change="slotFacChanged(slot)">
                      <option value="SU">Sol Union</option>
                      <option value="EC">East. Coalition</option>
                    </select>
                  </div>
                </div>

                <div class="row g-2 align-items-center mb-2">
                  <div class="col-4"><label class="small text-muted mb-0">Unit</label></div>
                  <div class="col-8">
                    <select class="form-select was-input form-select-sm" v-model="slot.unit" @change="slotUnitChanged(slot)">
                      <option v-for="u in getFacUnits(slot.fac)" :key="u" :value="u">{{ u }}</option>
                    </select>
                  </div>
                </div>

                <div class="row g-2 align-items-center mb-2">
                  <div class="col-4"><label class="small text-muted mb-0">Weapon</label></div>
                  <div class="col-8">
                    <select class="form-select was-input form-select-sm" v-model="slot.wpn">
                      <option v-for="w in getRangedWeapons(slot.unit)" :key="w" :value="w">{{ w }}</option>
                    </select>
                  </div>
                </div>

                <div class="row g-2 align-items-center mb-2">
                  <div class="col-4"><label class="small text-muted mb-0">Models</label></div>
                  <div class="col-8">
                    <input type="number" class="form-control was-input form-control-sm" v-model.number="slot.cnt" min="1" max="8">
                  </div>
                </div>

                <div class="row g-2 align-items-center mb-2">
                  <div class="col-4"><label class="small text-muted mb-0">Range</label></div>
                  <div class="col-8 tog-row">
                    <button class="tog" :class="{ active: slot.range === 'optimum' }" @click="slot.range = 'optimum'">Opt +1</button>
                    <button class="tog" :class="{ active: slot.range === 'normal' }" @click="slot.range = 'normal'">Normal</button>
                    <button class="tog" :class="{ active: slot.range === 'long' }" @click="slot.range = 'long'">Long −1</button>
                  </div>
                </div>
                <div class="small text-muted mt-2">{{ getSlotInfo(slot) }}</div>
              </div>

              <button v-if="rSlots.length < 3" class="buy-btn w-100" style="border-style: dashed;" @click="addSlot">+ Add unit to squad</button>
              
              <hr>
              
              <div class="d-flex align-items-center gap-3">
                <label class="small text-muted" style="min-width: 60px;">Mode</label>
                <div class="tog-row">
                  <button class="tog" :class="{ active: rMode === 'normal' }" @click="rMode = 'normal'">Normal</button>
                  <button class="tog" :class="{ active: rMode === 'overwatch' }" @click="rMode = 'overwatch'">Overwatch −1</button>
                  <button class="tog" :class="{ active: rMode === 'splitfire' }" @click="rMode = 'splitfire'">Split fire −1</button>
                </div>
              </div>
            </div>
          </div>

          <div class="col-lg-6 mb-4">
            <div class="card p-3 section-panel">
              <h3 class="slabel text-danger">Target</h3>
              
              <div class="d-flex gap-2 mb-2">
                <select class="form-select was-input w-50" v-model="rDefFac" @change="defFacChanged">
                  <option value="EC">East. Coalition</option>
                  <option value="SU">Sol Union</option>
                </select>
                <select class="form-select was-input w-50" v-model="rDefUnit">
                  <option v-for="u in getFacUnits(rDefFac)" :key="u" :value="u">{{ u }}</option>
                </select>
              </div>
              <div class="small text-muted mb-3" v-html="defStatsHtml"></div>

              <div class="d-flex align-items-center gap-3 mb-2">
                <label class="small text-muted" style="min-width: 70px;">Cover</label>
                <div class="tog-row">
                  <button class="tog" :class="{ active: rCover === 'none' }" @click="rCover = 'none'">None</button>
                  <button class="tog" :class="{ active: rCover === 'cover1' }" @click="rCover = 'cover1'">Cover 1 −1</button>
                  <button class="tog" :class="{ active: rCover === 'cover2' }" @click="rCover = 'cover2'">Cover 2 −2</button>
                </div>
              </div>

              <div v-if="!defIsArmor" class="d-flex align-items-center gap-3 mb-2">
                <label class="small text-muted" style="min-width: 70px;">Go to Ground</label>
                <div class="tog-row">
                  <button class="tog" :class="{ active: rGtg === false }" @click="rGtg = false">No</button>
                  <button class="tog" :class="{ active: rGtg === true }" @click="rGtg = true">Yes (First open, rest Cov1)</button>
                </div>
              </div>

              <div class="d-flex align-items-center gap-3 mb-2">
                <label class="small text-muted" style="min-width: 70px;">Facing</label>
                <div class="tog-row">
                  <button class="tog" :class="{ active: rFacing === 'front' }" @click="rFacing = 'front'">Front</button>
                  <button class="tog" :class="{ active: rFacing === 'side' }" @click="rFacing = 'side'">Side −1</button>
                  <button class="tog" :class="{ active: rFacing === 'rear' }" @click="rFacing = 'rear'">Rear −2</button>
                </div>
              </div>

              <div class="d-flex align-items-center gap-3 mb-2">
                <label class="small text-muted" style="min-width: 70px;">Existing Sup</label>
                <input type="number" class="form-control was-input form-control-sm" style="width: 70px;" v-model.number="rExistingSup" min="0" max="4">
              </div>

              <div v-if="defIsArmor" class="mt-3 pt-3 border-top">
                <label class="small text-muted d-block mb-1">Armor Critical Damage (Penalty)</label>
                <div class="d-flex gap-2">
                  <button v-for="i in 5" :key="i" class="apip" :class="{ hit: rArmDmg >= i }" @click="rArmDmg = rArmDmg === i ? i - 1 : i">−{{ i }}</button>
                </div>
                <div class="fw-bold mt-2" style="color: var(--was-gold)">Effective Defense: {{ effectiveDef }}</div>
              </div>

              <div v-if="defHasERA" class="mt-2 text-warning small">
                 <label><input type="checkbox" v-model="rEraActive"> ERA Active (4+ negates hit/crits, one use)</label>
              </div>
              <div v-if="defIsTough" class="mt-2 text-danger small">⚠ TOUGH — Infantry weapons need Fortune 6+ to damage</div>
            </div>

            <button class="buy-btn w-100 mt-2 py-2" @click="rollRanged">Roll Ranged Attack</button>

            <div v-if="rResults" class="mt-4">
              <div class="d-flex gap-2 mb-3">
                <div v-for="(met, k) in rResults.metrics" :key="k" class="card section-panel flex-fill text-center p-2">
                  <div class="fs-4 fw-bold" :class="met.colorClass">{{ met.val }}</div>
                  <div class="small text-muted">{{ met.label }}</div>
                </div>
              </div>
              <div v-for="(c, i) in rResults.crits" :key="i" class="alert alert-warning py-2 small" :class="{'bg-danger text-white border-danger': c.cat}">
                <strong class="d-block text-uppercase" style="font-size: 0.8em; letter-spacing: 0.05em">Critical Effect</strong>
                {{ c.detail }}
              </div>
              <div class="card section-panel p-3 small font-monospace log-box" v-html="rResults.log"></div>
            </div>
          </div>
        </div>

        <div v-show="activeTab === 'melee'" class="row">
           <div class="col-lg-6 mb-4">
             <div class="card p-3 section-panel">
                <h3 class="slabel" style="color: var(--was-sky)">Attacker</h3>
                
                <div class="row g-2 mb-2 align-items-center">
                  <div class="col-4 small text-muted">Skill Die</div>
                  <div class="col-8 tog-row">
                    <button v-for="d in [4,6,8,10]" :key="'ad'+d" class="tog" :class="{ active: mAtt.skill === d }" @click="mAtt.skill = d">D{{d}}</button>
                  </div>
                </div>
                <div class="row g-2 mb-2 align-items-center">
                  <div class="col-4 small text-muted">Weapon</div>
                  <div class="col-8 tog-row">
                    <button class="tog" :class="{ active: mAtt.wpn === 'standard' }" @click="mAtt.wpn = 'standard'">Standard</button>
                    <button class="tog" :class="{ active: mAtt.wpn === 'at' }" @click="mAtt.wpn = 'at'">AT</button>
                    <button class="tog" :class="{ active: mAtt.wpn === 'iat' }" @click="mAtt.wpn = 'iat'">IAT</button>
                  </div>
                </div>
                <div class="row g-2 mb-2 align-items-center">
                  <div class="col-4 small text-muted">Models</div>
                  <div class="col-8"><input type="number" class="form-control was-input form-control-sm w-50" v-model.number="mAtt.models" min="1"></div>
                </div>
                <div class="row g-2 mb-2 align-items-center">
                  <div class="col-4 small text-muted">Atk / Model</div>
                  <div class="col-8"><input type="number" class="form-control was-input form-control-sm w-50" v-model.number="mAtt.apm" min="1"></div>
                </div>
                <div class="row g-2 mb-2 align-items-center">
                  <div class="col-4 small text-muted">Suppression</div>
                  <div class="col-8 d-flex align-items-center gap-2">
                    <input type="number" class="form-control was-input form-control-sm w-50" v-model.number="mAtt.sup" min="0" max="4">
                    <span class="small text-muted">4=Pinned</span>
                  </div>
                </div>
                <hr>
                <div class="d-flex gap-3 small text-muted">
                  <label><input type="checkbox" v-model="mAtt.apex"> Apex</label>
                  <label><input type="checkbox" v-model="mAtt.feral"> Feral +1</label>
                  <label><input type="checkbox" v-model="mAtt.tough"> Tough</label>
                </div>
             </div>
           </div>

           <div class="col-lg-6 mb-4">
             <div class="card p-3 section-panel">
                <h3 class="slabel text-danger">Defender</h3>
                
                <div class="row g-2 mb-2 align-items-center">
                  <div class="col-4 small text-muted">Skill Die</div>
                  <div class="col-8 tog-row">
                    <button v-for="d in [4,6,8,10]" :key="'dd'+d" class="tog" :class="{ active: mDef.skill === d }" @click="mDef.skill = d">D{{d}}</button>
                  </div>
                </div>
                <div class="row g-2 mb-2 align-items-center">
                  <div class="col-4 small text-muted">Target Type</div>
                  <div class="col-8 tog-row">
                    <button class="tog" :class="{ active: mDef.type === 'infantry' }" @click="mDef.type = 'infantry'">Infantry</button>
                    <button class="tog" :class="{ active: mDef.type === 'armor' }" @click="mDef.type = 'armor'">Armor</button>
                    <button class="tog" :class="{ active: mDef.type === 'mecha' }" @click="mDef.type = 'mecha'">Mecha</button>
                  </div>
                </div>
                <div class="row g-2 mb-2 align-items-center">
                  <div class="col-4 small text-muted">Models</div>
                  <div class="col-8"><input type="number" class="form-control was-input form-control-sm w-50" v-model.number="mDef.models" min="1"></div>
                </div>
                <div class="row g-2 mb-2 align-items-center">
                  <div class="col-4 small text-muted">Atk / Model</div>
                  <div class="col-8"><input type="number" class="form-control was-input form-control-sm w-50" v-model.number="mDef.apm" min="1"></div>
                </div>
                <div class="row g-2 mb-2 align-items-center" v-if="mDef.type !== 'infantry'">
                  <div class="col-4 small text-muted">Structure HP</div>
                  <div class="col-8"><input type="number" class="form-control was-input form-control-sm w-50" v-model.number="mDef.struct" min="1"></div>
                </div>
                <div class="row g-2 mb-2 align-items-center">
                  <div class="col-4 small text-muted">Suppression</div>
                  <div class="col-8 d-flex align-items-center gap-2">
                    <input type="number" class="form-control was-input form-control-sm w-50" v-model.number="mDef.sup" min="0" max="4">
                    <span class="small text-muted">4=Pinned</span>
                  </div>
                </div>
                <hr>
                <div class="d-flex gap-3 small text-muted">
                  <label><input type="checkbox" v-model="mDef.apex"> Apex</label>
                  <label><input type="checkbox" v-model="mDef.feral"> Feral +1</label>
                  <label><input type="checkbox" v-model="mDef.tough"> Tough</label>
                </div>
             </div>

             <button class="buy-btn w-100 mt-3 py-2" @click="rollMelee">Resolve Melee</button>

             <div v-if="mResults" class="mt-4">
               <div class="d-flex gap-2 mb-3">
                <div v-for="(met, k) in mResults.metrics" :key="k" class="card section-panel flex-fill text-center p-2">
                  <div class="fs-4 fw-bold" :class="met.colorClass">{{ met.val }}</div>
                  <div class="small text-muted">{{ met.label }}</div>
                </div>
              </div>
              <div v-for="(c, i) in mResults.crits" :key="i" class="alert alert-warning py-2 small" :class="{'bg-danger text-white border-danger': c.cat}">
                <strong class="d-block text-uppercase" style="font-size: 0.8em; letter-spacing: 0.05em">Critical Effect</strong>
                {{ c.detail }}
              </div>
              <div class="card section-panel p-3 small font-monospace log-box" v-html="mResults.log"></div>
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

// Database Objects
const UNITS = {
  // Sol Union
  "Combat infantry": {f:"SU",role:"Infantry",skill:"D6",move:4,melee:1,def:7,struct:null,w:["RCM","melee blades","improvised AT melee"],kw:"Infantry",pts:14},
  "WC LMG drone": {f:"SU",role:"Infantry",skill:"D6",move:4,melee:1,def:7,struct:null,w:["ARQ LMG","melee blades"],kw:"Infantry",pts:15},
  "combat scout": {f:"SU",role:"Infantry",skill:"D8",move:5,melee:1,def:7,struct:null,w:["RCM","melee blades","improvised AT melee"],kw:"infantry, scout",pts:21},
  "Combat Engineer": {f:"SU",role:"Infantry",skill:"D6",move:4,melee:1,def:7,struct:null,w:["SCM","Antitank melee"],kw:"infantry, ECM, Demolitions",pts:18},
  "Drone operator": {f:"SU",role:"Infantry",skill:"D6",move:4,melee:1,def:7,struct:null,w:["FPD 2","melee blades","SCM"],kw:"infantry",pts:17},
  "FPD carrier Drone": {f:"SU",role:"Infantry",skill:"D6",move:4,melee:1,def:7,struct:null,w:["melee blades"],kw:"infantry, drone carrier",pts:10},
  "Urban Tactical engagement armor": {f:"SU",role:"Power armor",skill:"D8",move:4,melee:1,def:8,struct:null,w:["ARQ LMG","CPD","anti tank melee"],kw:"Infantry, jump, Tough",pts:46},
  "anti armor Gunner": {f:"SU",role:"infantry",skill:"D6",move:4,melee:1,def:7,struct:null,w:["AAR","Antitank melee"],kw:"Infantry",pts:16},
  "Pack Leader": {f:"SU",role:"infantry",skill:"D6",move:8,melee:2,def:7,struct:null,w:["SCM","claws","anti tank melee"],kw:"Feral, leashed, Apex",pts:28},
  "Leashed Hybrid": {f:"SU",role:"infantry",skill:"D6",move:8,melee:1,def:7,struct:null,w:["SCM","claws","anti tank melee"],kw:"feral, leashed",pts:25},
  "Leashed Hybrid gunner": {f:"SU",role:"infantry",skill:"D6",move:8,melee:1,def:7,struct:null,w:["shotgun","claws","anti tank melee"],kw:"feral, leashed",pts:23},
  "Bull Duck": {f:"SU",role:"light armor",skill:"D6",move:8,melee:2,def:9,struct:4,w:["GMP 60"],kw:"amphibious, Transport 8",exposed:["GMP 60"],protected:[],main:null},
  "Hoplite": {f:"SU",role:"light armor",skill:"D6",move:8,melee:3,def:9,struct:4,w:["MTG 75","ARQ LMG"],kw:"ERA",exposed:["ARQ LMG"],protected:[],main:"MTG 75"},
  "Spartan": {f:"SU",role:"light armor",skill:"D6",move:8,melee:3,def:9,struct:4,w:["MAW","GOAT 100"],kw:"ERA, Scout",exposed:["GOAT 100"],protected:[],main:"MAW"},
  "Cataphract": {f:"SU",role:"heavy armor",skill:"D6",move:6,melee:4,def:11,struct:10,w:["MMTGx","MTG 75","GMP 60"],kw:"MaDDs, ERA, Stable turret",exposed:["GMP 60"],protected:["MTG 75"],main:"MMTGx"},
  "MACS": {f:"SU",role:"mecha",skill:"D6",move:6,melee:5,def:9,struct:6,w:["MTG 75","GOAT 100","MTG 75"],kw:"MaDDs",exposed:["GOAT 100"],protected:["MTG 75","MTG 75"],main:null},
  "MACS Suppressor": {f:"SU",role:"mecha",skill:"D6",move:6,melee:5,def:9,struct:6,w:["MAW","GOAT 100","MAW"],kw:"MaDDs",exposed:["GOAT 100"],protected:["MAW","MAW"],main:null},
  "Truck": {f:"SU",role:"light armor",skill:"D6",move:7,melee:2,def:7,struct:2,w:[],kw:"Transport 4",exposed:[],protected:[],main:null},
  "Truck Armed": {f:"SU",role:"light armor",skill:"D6",move:7,melee:2,def:7,struct:2,w:["ARQ LMG"],kw:"Transport 4",exposed:["ARQ LMG"],protected:[],main:null},
  // Eastern Coalition
  "Jade Warrior smg": {f:"EC",role:"infantry",skill:"D6",move:4,melee:1,def:7,struct:null,w:["QRAs","melee blades","improvised AT melee"],kw:"Infantry"},
  "Jade Warrior Rifle": {f:"EC",role:"infantry",skill:"D6",move:4,melee:1,def:7,struct:null,w:["QQSr","melee blades","improvised AT melee"],kw:"Infantry"},
  "Jade Gunner": {f:"EC",role:"infantry",skill:"D6",move:4,melee:1,def:7,struct:null,w:["QxLMG","melee blades","improvised AT melee"],kw:"infantry"},
  "Jade scouts": {f:"EC",role:"infantry",skill:"D6",move:6,melee:1,def:6,struct:null,w:["QRAs","melee blades","anti tank melee"],kw:"infantry, Scout"},
  "Jade Drone operator": {f:"EC",role:"infantry",skill:"D6",move:4,melee:1,def:7,struct:null,w:["QRAS","melee blades","improvised AT melee"],kw:"Infantry, Drone"},
  "Jade Signal": {f:"EC",role:"infantry",skill:"D6",move:4,melee:1,def:7,struct:null,w:["QRAS","melee blades","improvised AT melee"],kw:"Infantry, ECM"},
  "Jade Fist": {f:"EC",role:"infantry",skill:"D6",move:4,melee:1,def:7,struct:null,w:["QRAs","FIST","anti tank melee"],kw:"infantry"},
  "Guardian frame": {f:"EC",role:"infantry",skill:"D8",move:6,melee:1,def:8,struct:null,w:["QxLMG","QRAs","anti tank melee"],kw:"infantry, scout"},
  "Hover Bee": {f:"EC",role:"light armor",skill:"D6",move:10,melee:2,def:8,struct:6,w:["QxLMG"],kw:"Transport 6, hover",exposed:[],protected:["QxLMG"],main:null},
  "cloud runner gun": {f:"EC",role:"light armor",skill:"D6",move:12,melee:2,def:7,struct:4,w:["QxLMG"],kw:"scout",exposed:["QxLMG"],protected:[],main:null},
  "cloud runner FIST": {f:"EC",role:"light armor",skill:"D6",move:12,melee:2,def:7,struct:4,w:["FIST"],kw:"scout",exposed:["FIST"],protected:[],main:null},
  "cloud runner Transport": {f:"EC",role:"light armor",skill:"D6",move:12,melee:2,def:7,struct:4,w:["APPDs"],kw:"scout, Transport 4",exposed:[],protected:[],main:null},
  "iron cliff MBT": {f:"EC",role:"heavy armor",skill:"D6",move:6,melee:3,def:10,struct:8,w:["lun ton","QxLMG"],kw:"turret, MaDDs",exposed:["QxLMG"],protected:[],main:"lun ton"},
  "Land Crab": {f:"EC",role:"mecha",skill:"D6",move:8,melee:6,def:10,struct:6,w:["plasma hammer","QxLMG"],kw:"",exposed:["QxLMG"],protected:[],main:"plasma hammer"},
  "celestial sword": {f:"EC",role:"mecha",skill:"D8",move:9,melee:6,def:9,struct:8,w:["plasma lance","Qmax"],kw:"MaDDs, shield",exposed:["Qmax"],protected:[],main:"plasma lance"}
};

const WEAPONS = {
  "AAR": {dmg:"D8", rof:1,range:'36"',opt:'24–30"',long:'42"', rules:["Anti-material","Smoke 2"]},
  "ARQ LMG": {dmg:"D4", rof:3,range:'36"',opt:'12–18"',long:'42"', rules:["Infantry"]},
  "anti tank melee": {dmg:"melee",rof:1,range:"melee", rules:["Melee","Anti-armor melee"]},
  "Antitank melee": {dmg:"melee",rof:1,range:"melee", rules:["Melee","Anti-armor melee"]},
  "claws": {dmg:"melee",rof:1,range:"melee", rules:["Melee","Anti-armor melee"]},
  "melee blades": {dmg:"melee",rof:1,range:"melee", rules:["Melee"]},
  "improvised AT melee": {dmg:"melee",rof:1,range:"melee", rules:["Melee","IAT"]},
  "FIST": {dmg:"D10",rof:1,range:'48"',opt:'24–32"', rules:["Guided","Blast 2"]},
  "Fist": {dmg:"D10",rof:1,range:'48"',opt:'24–32"', rules:["Guided","Blast 2"]},
  "FPD 2": {dmg:"D8", rof:1,range:"drone", rules:["Drone","CFD","Blast 2"]},
  "GMP 60": {dmg:"D6", rof:1,range:'36"',opt:'30–36"',long:'56"', rules:["Blast 2","Smoke","Infantry"]},
  "GOAT 100": {dmg:"D12",rof:1,range:'48"',opt:'30–40"', rules:["Guided","Blast 2"]},
  "lun ton": {dmg:"D8", rof:2,range:'54"',opt:'36–42"',long:'66"', rules:[]},
  "MAW": {dmg:"D6", rof:3,range:'40"',opt:'20–30"',long:'52"', rules:["Anti-material"]},
  "MMTGx": {dmg:"D20",rof:1,range:'36"',opt:'24–30"',long:'48"', rules:["Blast 4","Ignores cover","Brace"]},
  "MTG 75": {dmg:"D8", rof:2,range:'48"',opt:'28–34"',long:'60"', rules:["Blast 2"]},
  "CPD": {dmg:"D8", rof:1,range:'6"', rules:["Blast 4","Placed"]},
  "plasma hammer": {dmg:"D10",rof:1,range:'36"',opt:'24–30"', rules:["Blast 4"]},
  "plasma lance": {dmg:"D8", rof:1,range:'36"',opt:'24–30"', rules:["Blast 2"]},
  "Qmax": {dmg:"D6", rof:3,range:'38"',opt:'30–36"',long:'48"', rules:[]},
  "QQSr": {dmg:"D6", rof:1,range:'30"',opt:'20–26"',long:'40"', rules:["Infantry"]},
  "QRAs": {dmg:"D4", rof:3,range:'12"',opt:'4–10"', rules:["Infantry"]},
  "QRAS": {dmg:"D4", rof:3,range:'12"',opt:'4–10"', rules:["Infantry"]},
  "QxLMG": {dmg:"D4", rof:3,range:'34"',opt:'24–30"',long:'48"', rules:[]},
  "RCM": {dmg:"D4", rof:2,range:'24"',opt:'8–14"', long:'30"', rules:["Infantry"]},
  "SCM": {dmg:"D4", rof:3,range:'18"',opt:'6–10"', rules:["Infantry"]},
  "shotgun": {dmg:"D4", rof:1,range:'12"', rules:["Blast 2"]},
  "APPDs": {dmg:"D4", rof:3,range:"contact", rules:["APPD"]},
};

const CRIT_TABLE=[
  [null,null,"SEC_A","MOB_HALF","SEC_B","SENSOR","MOB_HALF","ARMOR_1"],
  [null,"MAIN_DMG","MOB_HALF","SEC_A","ARMOR_1","SENSOR","ARMOR_2","IMMOBILIZED"],
  ["CATASTROPHIC",null,"MAIN_DMG","MOB_HALF","SENSOR","ARMOR_2","IMMOBILIZED","CATASTROPHIC"]
];

function critLabel(code) {
  const map = {"SEC_A":"Secondary weapon A destroyed", "SEC_B":"Secondary weapon B destroyed", "MAIN_DMG":"Main weapon damaged (−1 die step)", "MOB_HALF":"Mobility kill (half speed)", "SENSOR":"Sensor damage (−1 Fort, stacks)", "ARMOR_1":"Armor damage −1 def", "ARMOR_2":"Armor damage −2 def", "IMMOBILIZED":"Immobilized", "CATASTROPHIC":"Catastrophic hit — destroyed"};
  return map[code] || code;
}

export default {
  name: 'vCombatCalc',
  components: { cHeader, cFooter },
  data() {
    return {
      activeTab: 'ranged',
      showHelp: false,
      
      // Ranged State
      rSlots: [],
      rMode: 'normal',
      rDefFac: 'EC',
      rDefUnit: 'Jade Warrior smg',
      rCover: 'none',
      rGtg: false,
      rFacing: 'front',
      rExistingSup: 0,
      rArmDmg: 0,
      rEraActive: true,
      rResults: null,
      
      // Melee State
      mAtt: { skill: 6, wpn: 'standard', models: 4, apm: 1, sup: 0, apex: false, feral: false, tough: false },
      mDef: { skill: 6, type: 'infantry', models: 3, apm: 1, struct: 6, sup: 0, apex: false, feral: false, tough: false },
      mResults: null
    };
  },
  created() {
    this.addSlot();
  },
  computed: {
    defU() { return UNITS[this.rDefUnit]; },
    defIsArmor() { return this.defU && this.defU.struct !== null; },
    defIsMecha() { return this.defU && (this.defU.role === 'mecha' || this.defU.role === 'Mecha'); },
    defIsTough() { return this.defU && this.defU.kw && /tough/i.test(this.defU.kw); },
    defHasERA() { return this.defU && this.defU.kw && /era/i.test(this.defU.kw); },
    effectiveDef() {
      if(!this.defU) return 0;
      let d = this.defU.def;
      if(this.rFacing === 'side') d -= 1;
      if(this.rFacing === 'rear') d -= 2;
      return d - this.rArmDmg;
    },
    defStatsHtml() {
      if(!this.defU) return '';
      const u = this.defU;
      let h = `<b>Role:</b> ${u.role} | <b>Def:</b> ${u.def} | <b>HP:</b> ${u.struct ?? '—'} | <b>Skill:</b> ${u.skill}`;
      if(this.defIsTough) h += ' | <b class="text-danger">TOUGH</b>';
      if(this.defHasERA) h += ' | <b class="text-warning">ERA</b>';
      return h;
    }
  },
  watch: {
    rDefUnit() {
      this.rArmDmg = 0;
      this.rGtg = false;
      this.rEraActive = true;
    }
  },
  methods: {
    // Utility
    dd(s) { const m = s.match(/D(\d+)/i); return m ? +m[1] : 6; },
    rD(s) { return Math.floor(Math.random()*s)+1; },
    rF(s) { let r = this.rD(s); if(r === 1) r = this.rD(s); return r; },
    
    // Ranged
    getFacUnits(fac) { return Object.keys(UNITS).filter(k => UNITS[k].f === fac); },
    getRangedWeapons(unitName) {
      const u = UNITS[unitName]; if(!u) return [];
      let w = u.w.filter(wn => {
        const wd = WEAPONS[wn];
        return wd && wd.range !== 'melee' && wd.range !== 'contact' && !(wd.rules && wd.rules.includes('APPD'));
      });
      if(!w.length) w = u.w.filter(wn => WEAPONS[wn] && WEAPONS[wn].range !== 'melee');
      return w.length ? w : ["None"];
    },
    addSlot() {
      const fac = this.rDefFac === 'EC' ? 'SU' : 'EC';
      const u = this.getFacUnits(fac)[0];
      const w = this.getRangedWeapons(u)[0];
      this.rSlots.push({ id: Date.now()+Math.random(), fac, unit: u, wpn: w, cnt: 3, range: 'optimum' });
    },
    removeSlot(idx) { this.rSlots.splice(idx, 1); },
    slotFacChanged(s) { s.unit = this.getFacUnits(s.fac)[0]; this.slotUnitChanged(s); },
    slotUnitChanged(s) { s.wpn = this.getRangedWeapons(s.unit)[0]; },
    defFacChanged() { this.rDefUnit = this.getFacUnits(this.rDefFac)[0]; },
    getSlotInfo(s) {
      const w = WEAPONS[s.wpn]; if(!w) return '';
      return `${w.dmg} ROF ${w.rof} — ${s.cnt} model(s) = ${s.cnt * w.rof} rolls | ${w.rules ? w.rules.join(', ') : 'none'}`;
    },
    resolveCrit(fortResult, damAmt, unitName) {
      const u = UNITS[unitName];
      const row = Math.min(damAmt, 3) - 1;
      const col = Math.min(Math.max(fortResult, 1), 8) - 1;
      const code = CRIT_TABLE[row][col];
      if(!code) return null;
      let detail = critLabel(code);
      if(code === "SEC_A" || code === "SEC_B"){
        if(u){
          const pool = code === "SEC_A" ? u.exposed : u.protected;
          if(pool && pool.length > 0) detail = (code==="SEC_A"?"Exposed":"Protected")+" wpn destroyed: "+pool[Math.floor(Math.random()*pool.length)];
          else detail = "Secondary wpn hit (empty slot)";
        }
      }
      if(code === "MAIN_DMG" && u){
        if(unitName === "MACS") detail = "Weapon system damaged (−1 die step): random";
        else if(u.main) detail = "Main wpn damaged (−1 die step): "+u.main;
        else detail = "Main wpn hit — no dedicated main wpn, no effect";
      }
      return { code, detail, cat: code === 'CATASTROPHIC' };
    },
    rollRanged() {
      if(!this.rSlots.length) return;
      const du = this.defU;
      const ed = this.effectiveDef;
      const coverMod = this.rCover === 'cover2' ? -2 : this.rCover === 'cover1' ? -1 : 0;
      let eraReady = this.defHasERA && this.rEraActive;
      const modMod = (this.rMode === 'overwatch' || this.rMode === 'splitfire') ? -1 : 0;
      
      let totCas = 0, totDmg = 0, totSup = 0, lastFort = 0, attackIndex = 0;
      const log = [], crits = [];
      
      log.push(`<span class="text-secondary">Target: ${this.rDefUnit} | Eff. def: ${ed}</span>`);

      this.rSlots.forEach((slot, si) => {
        const u = UNITS[slot.unit], w = WEAPONS[slot.wpn];
        if(!u || !w) return;
        
        const rm = slot.range === 'optimum' ? 1 : slot.range === 'long' ? -1 : 0;
        const fs = this.dd(u.skill), ds = this.dd(w.dmg);
        const isInfWpn = w.rules && w.rules.includes('Infantry');
        const ignoresCover = w.rules && w.rules.includes('Ignores cover');
        
        log.push(`<br><span class="text-secondary">── Slot ${si+1}: ${slot.unit} × ${slot.cnt} (${slot.wpn}) | ${slot.range}</span>`);
        
        for(let m = 0; m < slot.cnt; m++){
          let rf = this.rF(fs);
          const gtgMod = this.rGtg ? (attackIndex === 0 ? 0 : Math.min(coverMod, -1)) : coverMod;
          const ec = ignoresCover ? 0 : gtgMod;
          const mf = Math.max(0, rf + rm + ec + modMod);
          lastFort = rf;
          
          log.push(`<span class="text-secondary">&nbsp;&nbsp;Model ${m+1}: Fort ${rf} (mod ${mf})</span>`);
          
          for(let r = 0; r < w.rof; r++){
            attackIndex++;
            const wd = this.rD(ds), tot = mf + wd, ex = tot - ed;
            
            if(ex <= 0){ log.push(`<span class="text-muted">&nbsp;&nbsp;&nbsp;&nbsp;Shot ${r+1}: Wpn ${wd} → Total ${tot} vs ${ed} — miss</span>`); continue; }
            
            if(this.defIsArmor || this.defIsMecha){
              if(isInfWpn && this.defIsArmor && !this.defIsMecha){ log.push(`<span class="text-muted">&nbsp;&nbsp;&nbsp;&nbsp;Infantry wpn vs armor — no effect</span>`); continue; }
              const dmg = Math.min(3, ex);
              
              if(eraReady){
                const eraRoll = this.rD(6);
                if(eraRoll >= 4){
                  log.push(`<span class="text-warning">&nbsp;&nbsp;&nbsp;&nbsp;ERA triggered! Roll ${eraRoll} (4+) — damage negated. ERA expended.</span>`);
                  eraReady = false; this.rEraActive = false;
                  continue;
                } else {
                  log.push(`<span class="text-secondary">&nbsp;&nbsp;&nbsp;&nbsp;ERA failed (roll ${eraRoll}) — damage applies</span>`);
                  eraReady = false; this.rEraActive = false;
                }
              }
              
              totDmg += dmg;
              const crit = this.resolveCrit(mf, dmg, this.rDefUnit);
              if(crit) crits.push(crit);
              log.push(`<span class="text-danger">&nbsp;&nbsp;&nbsp;&nbsp;Shot ${r+1}: Wpn ${wd} → Total ${tot} — HIT ${dmg} dmg ${crit ? ' + CRIT' : ''}</span>`);
              
            } else {
              let sup = 0, cas = 0;
              if(ex >= 1) sup = 1; if(ex >= 2){ sup = 1; cas = 1; } if(ex >= 3){ sup = 2; cas = 1; }
              
              if(cas > 0 && this.defIsTough && isInfWpn && rf < 6){
                log.push(`<span class="text-muted">&nbsp;&nbsp;&nbsp;&nbsp;Shot ${r+1}: Total ${tot} — TOUGH: Fort < 6, no casualty. ${sup} sup only.</span>`);
                totSup += sup; continue;
              }
              totSup += sup; totCas += cas;
              log.push(`<span class="text-danger">&nbsp;&nbsp;&nbsp;&nbsp;Shot ${r+1}: Total ${tot} — ${cas} cas, ${sup} sup</span>`);
            }
          }
        }
      });
      
      if(this.rGtg) totSup = Math.min(totSup + 1, 4);
      totSup = Math.min(totSup + this.rExistingSup, 4);
      
      const metrics = [];
      if(this.defIsArmor || this.defIsMecha){
        const rem = Math.max(0, du.struct - totDmg);
        metrics.push({ label: 'Damage', val: totDmg, colorClass: totDmg > 0 ? 'text-danger' : '' });
        metrics.push({ label: 'HP Left', val: rem, colorClass: rem === 0 ? 'text-danger' : 'text-warning' });
        metrics.push({ label: 'Status', val: rem === 0 ? 'DESTROYED' : 'Intact', colorClass: rem === 0 ? 'text-danger' : 'text-success' });
      } else {
        metrics.push({ label: 'Casualties', val: totCas, colorClass: totCas > 0 ? 'text-danger' : '' });
        metrics.push({ label: 'Suppression', val: totSup, colorClass: totSup >= 4 ? 'text-danger' : totSup >= 2 ? 'text-warning' : 'text-success' });
        metrics.push({ label: 'Status', val: totSup >= 4 ? 'Pinned' : totSup >= 2 ? '-1 Fort' : 'Clear', colorClass: totSup >= 4 ? 'text-danger' : totSup >= 2 ? 'text-warning' : 'text-success' });
      }
      metrics.push({ label: 'Last Fort', val: lastFort, colorClass: 'text-info' });
      
      this.rResults = { metrics, crits, log: log.join('<br>') };
    },

    // Melee
    rollMelee() {
      const rollFort = (sides, penalty, apex) => {
        let r = this.rF(sides);
        if(apex){ const r2 = this.rF(sides); if(r2 > r) r = r2; }
        return { raw: r, mod: Math.max(0, r + penalty) };
      };

      // Attacker
      const attPinned = this.mAtt.sup >= 4;
      const attSup = attPinned ? 4 : this.mAtt.sup;
      const attFortPen = (attSup >= 2 ? -1 : 0) + (this.mAtt.feral ? 1 : 0);
      const attSuppressedModels = attPinned ? this.mAtt.models : Math.min(attSup, this.mAtt.models);
      const attActive = Math.max(0, this.mAtt.models - attSuppressedModels);
      const totalAttAtk = attActive * this.mAtt.apm;

      // Defender
      const defPinned = this.mDef.sup >= 4;
      const defSup = defPinned ? 4 : this.mDef.sup;
      const defFortPen = (defSup >= 2 ? -1 : 0) + (this.mDef.feral ? 1 : 0);
      const defSuppressedModels = defPinned ? this.mDef.models : Math.min(defSup, this.mDef.models);
      const defActive = Math.max(0, this.mDef.models - defSuppressedModels);
      const totalDefAtk = defActive * this.mDef.apm;

      const isVehicle = this.mDef.type === 'armor' || this.mDef.type === 'mecha';
      const paired = Math.min(totalAttAtk, totalDefAtk);
      const attUncontested = Math.max(0, totalAttAtk - paired);
      const defUncontested = Math.max(0, totalDefAtk - paired);

      const log = [], crits = [];
      let attCas = 0, defCas = 0, defDmg = 0;

      log.push(`<span class="text-secondary">Paired: ${paired} | Att uncontested: ${attUncontested} | Def uncontested: ${defUncontested}</span><br>`);

      // Paired
      for(let i=0; i<paired; i++){
        const af = rollFort(this.mAtt.skill, attFortPen, this.mAtt.apex);
        const am = this.rD(6); const aTot = af.mod + am;
        const df = rollFort(this.mDef.skill, defFortPen, this.mDef.apex);
        const dm = this.rD(6); const dTot = df.mod + dm;
        
        log.push(`<span class="text-secondary">Exchange ${i+1}: Att(F${af.raw}+M${am}=${aTot}) vs Def(F${df.raw}+M${dm}=${dTot})</span>`);
        
        if(aTot > dTot){ // Att wins
          if(isVehicle){
             const c = this.resolveCrit(af.mod, 1, '');
             if(c) crits.push(c);
             log.push(`<span class="text-danger">&nbsp;&nbsp;Att wins → Crit DAM 1: ${c ? c.detail : 'no effect'}</span>`);
          } else {
             if(this.mDef.tough && af.raw < this.mDef.skill) log.push(`<span class="text-muted">&nbsp;&nbsp;Att wins but TOUGH — Fort not max, no cas</span>`);
             else { defCas++; log.push(`<span class="text-danger">&nbsp;&nbsp;Att wins → 1 def casualty</span>`); }
          }
        } else { // Def wins
          if(this.mAtt.tough && df.raw < this.mDef.skill) log.push(`<span class="text-muted">&nbsp;&nbsp;Def wins but att TOUGH — Fort not max, no cas</span>`);
          else { attCas++; log.push(`<span class="text-danger">&nbsp;&nbsp;Def wins → 1 att casualty</span>`); }
        }
      }

      // Attacker Uncontested
      if(attUncontested > 0){
        log.push(`<br><span class="text-secondary">── Attacker uncontested (${attUncontested}) ──</span>`);
        if(isVehicle){
          if(this.mAtt.wpn === 'at' || this.mAtt.wpn === 'iat'){
            const dmg = Math.min(3, attUncontested);
            const af = rollFort(this.mAtt.skill, attFortPen, this.mAtt.apex);
            if(this.mAtt.wpn === 'iat' && af.raw < 6) log.push(`<span class="text-muted">&nbsp;&nbsp;IAT: needs natural 6, rolled ${af.raw} — no effect</span>`);
            else {
              defDmg += dmg;
              const c = this.resolveCrit(af.mod, dmg, '');
              if(c) crits.push(c);
              log.push(`<span class="text-danger">&nbsp;&nbsp;AT melee → DAM ${dmg}: ${c ? c.detail : 'no effect'}</span>`);
            }
          } else {
            for(let i=0; i<attUncontested; i++){
              const af = rollFort(this.mAtt.skill, attFortPen, this.mAtt.apex);
              const c = this.resolveCrit(af.mod, 1, '');
              if(c) crits.push(c);
              log.push(`<span class="text-${c?'danger':'muted'}">&nbsp;&nbsp;Uncontested ${i+1}: Fort ${af.mod} → ${c ? c.detail : 'no crit'}</span>`);
            }
          }
        } else {
          for(let i=0; i<attUncontested; i++){
            const af = rollFort(this.mAtt.skill, attFortPen, this.mAtt.apex);
            if(this.mDef.tough){
              if(af.raw >= this.mAtt.skill){ defCas++; log.push(`<span class="text-danger">&nbsp;&nbsp;Uncontested ${i+1}: TOUGH met → casualty</span>`); }
              else log.push(`<span class="text-muted">&nbsp;&nbsp;Uncontested ${i+1}: TOUGH — miss</span>`);
            } else {
              if(af.mod >= 4){ defCas++; log.push(`<span class="text-danger">&nbsp;&nbsp;Uncontested ${i+1}: Fort ${af.mod} (4+) → cas</span>`); }
              else log.push(`<span class="text-muted">&nbsp;&nbsp;Uncontested ${i+1}: Fort ${af.mod} — miss</span>`);
            }
          }
        }
      }

      // Defender Uncontested
      if(defUncontested > 0){
        log.push(`<br><span class="text-secondary">── Defender uncontested (${defUncontested}) ──</span>`);
        for(let i=0; i<defUncontested; i++){
          const df = rollFort(this.mDef.skill, defFortPen, this.mDef.apex);
          if(this.mAtt.tough){
            if(df.raw >= this.mDef.skill){ attCas++; log.push(`<span class="text-danger">&nbsp;&nbsp;Def uncnt ${i+1}: TOUGH met → casualty</span>`); }
            else log.push(`<span class="text-muted">&nbsp;&nbsp;Def uncnt ${i+1}: TOUGH — miss</span>`);
          } else {
            if(df.mod >= 4){ attCas++; log.push(`<span class="text-danger">&nbsp;&nbsp;Def uncnt ${i+1}: Fort ${df.mod} (4+) → cas</span>`); }
            else log.push(`<span class="text-muted">&nbsp;&nbsp;Def uncnt ${i+1}: Fort ${df.mod} — miss</span>`);
          }
        }
      }

      // Results
      const metrics = [];
      metrics.push({ label: 'Att Casualties', val: attCas, colorClass: attCas > 0 ? 'text-danger' : 'text-success' });
      if(isVehicle){
        const rem = Math.max(0, this.mDef.struct - defDmg);
        metrics.push({ label: 'Def Damage', val: defDmg, colorClass: defDmg > 0 ? 'text-danger' : 'text-success' });
        metrics.push({ label: 'Def HP Left', val: rem, colorClass: rem === 0 ? 'text-danger' : 'text-warning' });
      } else {
        const finalSup = Math.min(this.mDef.sup + Math.min(defCas, 4), 4);
        metrics.push({ label: 'Def Casualties', val: defCas, colorClass: defCas > 0 ? 'text-danger' : 'text-success' });
        metrics.push({ label: 'Def Suppression', val: finalSup, colorClass: finalSup >= 4 ? 'text-danger' : finalSup >= 2 ? 'text-warning' : 'text-success' });
      }

      this.mResults = { metrics, crits, log: log.join('<br>') };
    }
  }
}
</script>

<style scoped>
.page-shell { max-width: 1040px; }
.page-kicker {
  color: var(--was-gold);
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  font-size: 0.74rem;
  margin-bottom: 0.4rem;
}
.page-title {
  color: var(--was-paper);
}

.nav-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.42rem 0.92rem;
  border: 1px solid rgba(122, 169, 216, 0.55);
  border-radius: 999px;
  color: var(--was-text);
  background: transparent;
  font-family: 'Alegreya SC', Georgia, serif;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  transition: all 0.25s ease;
}
.nav-pill:hover, .nav-pill.active-tab {
  border-color: var(--was-fox);
  background: rgba(212, 135, 95, 0.25);
  color: var(--was-paper);
}

.slabel {
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .1em;
  color: var(--was-gold);
  margin-bottom: 0.75rem;
  border-bottom: 1px solid var(--was-border);
  padding-bottom: 0.25rem;
}

.was-input {
  background-color: var(--was-night);
  border: 1px solid var(--was-border);
  color: var(--was-text);
}
.was-input:focus {
  background-color: var(--was-ink);
  color: var(--was-text);
  border-color: var(--was-sky);
  box-shadow: none;
}

.tog-row { display: flex; gap: 4px; flex-wrap: wrap; }
.tog {
  font-size: 0.8rem;
  padding: 0.25rem 0.6rem;
  border: 1px solid var(--was-border);
  border-radius: 6px;
  cursor: pointer;
  background: var(--was-night);
  color: var(--was-text-muted);
  transition: all .12s;
}
.tog.active {
  background: var(--was-sky-deep);
  color: var(--was-paper);
  border-color: var(--was-sky);
  font-weight: 500;
}

.apip {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1.5px solid var(--was-border);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 700;
  background: var(--was-night);
  color: var(--was-text-muted);
}
.apip.hit {
  background: rgba(245, 120, 120, 0.2);
  color: #f57878;
  border-color: #f57878;
}

.buy-btn {
    background: transparent;
    border: 1px solid rgba(212, 135, 95, 0.6);
    color: var(--was-fox);
    border-radius: 8px;
    padding: 0.4rem 0.9rem;
    font-size: 0.9rem;
    font-weight: 700;
    cursor: pointer;
    letter-spacing: 0.04em;
    transition: all 0.2s;
}
.buy-btn:hover {
    background: var(--was-fox);
    color: var(--was-ink);
}

.slot-box {
  background-color: rgba(0,0,0,0.2);
  border: 1px solid var(--was-border);
}

.log-box {
  max-height: 300px;
  overflow-y: auto;
  background: var(--was-ink);
  line-height: 1.6;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.7);
  z-index: 1040;
}
</style>