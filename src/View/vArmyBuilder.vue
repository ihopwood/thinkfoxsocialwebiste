<template>
  <div class="d-flex flex-column min-vh-100">
    <cHeader />
    <main class="flex-grow-1 mt-5 pt-4">
      <section class="container-fluid py-4 page-shell">
        <header class="text-center mb-4 d-print-none">
          <p class="page-kicker">Force Construction Tool</p>
          <h1 class="page-title mb-3">Army Builder</h1>
        </header>

        <div class="row d-print-none">
          <div class="col-lg-4 col-md-5 mb-4 sidebar">
            <div class="card p-3 mb-3 section-panel">
              <h3 class="slabel">Setup</h3>
              <div class="mb-3">
                <label class="form-label text-muted small mb-1">Army Name</label>
                <input type="text" class="form-control was-input" v-model="armyName" placeholder="Unnamed force">
              </div>
              <div class="mb-3">
                <label class="form-label text-muted small mb-1">Faction</label>
                <div class="tog-row">
                  <button class="tog" :class="{ active: faction === 'SU' }" @click="faction = 'SU'">Sol Union</button>
                  <button class="tog" :class="{ active: faction === 'EC' }" @click="faction = 'EC'">East. Coalition</button>
                </div>
              </div>
              <div class="mb-2">
                <label class="form-label text-muted small mb-1">Game Size</label>
                <div class="tog-row">
                  <button class="tog" :class="{ active: size === '500' }" @click="size = '500'">500</button>
                  <button class="tog" :class="{ active: size === '1000' }" @click="size = '1000'">1000</button>
                  <button class="tog" :class="{ active: size === '1500' }" @click="size = '1500'">1500</button>
                </div>
              </div>
            </div>

            <div class="card p-3 mb-3 section-panel">
              <h3 class="slabel">Strategic Assets <span class="fw-normal text-muted text-lowercase" style="letter-spacing:0">— or not both</span></h3>
              <div class="d-flex align-items-center justify-content-between mb-2">
                <label class="text-muted small">Airstrikes (12pts ea)</label>
                <input type="number" class="form-control was-input w-25" v-model.number="airstrikes" min="0" max="6">
              </div>
              <div class="d-flex align-items-center justify-content-between">
                <label class="text-muted small">Artillery (15pts ea)</label>
                <input type="number" class="form-control was-input w-25" v-model.number="artillery" min="0" max="4">
              </div>
              <div v-if="assetWarn" class="warn-item err mt-2">{{ assetWarn }}</div>
            </div>

            <button class="buy-btn w-100 mb-3" @click="addPlatoon">+ Add Platoon</button>

            <div class="card p-3 mb-3 section-panel pts-bar">
              <div class="d-flex justify-content-between align-items-baseline mb-1">
                <span class="pts-val" :class="{ 'text-danger': totalPts > parseInt(size) }">{{ totalPts }}</span>
                <span class="pts-meta">of {{ size }}pts</span>
              </div>
              <div class="d-flex justify-content-between mb-1">
                <span class="pts-meta">{{ Math.max(0, parseInt(size) - totalPts) }} remaining</span>
              </div>
              <div class="pts-track mt-2">
                <div class="pts-fill" :class="ptsFillClass" :style="{ width: ptsPercent + '%' }"></div>
              </div>
            </div>

            <div class="warnings-panel mb-3">
              <div v-for="(warn, idx) in warnings" :key="idx" class="warn-item" :class="{ err: warn.err }">
                {{ warn.err ? '⚠' : '△' }} {{ warn.msg }}
              </div>
            </div>

            <button class="buy-btn w-100" @click="doPrint">Generate Army Sheet</button>
          </div>

          <div class="col-lg-8 col-md-7 main-content">
            <div v-if="platoons.length === 0" class="empty-state card section-panel text-center p-5">
              <p class="text-muted mb-0">No platoons yet — add your first platoon from the sidebar.</p>
            </div>
            
            <div v-for="(p, pi) in platoons" :key="p.id" class="card section-panel platoon mb-3">
              <div class="platoon-header d-flex justify-content-between align-items-center border-bottom pb-2 mb-2">
                <h4 class="m-0" style="color: var(--was-sky)">Platoon {{ pi + 1 }}</h4>
                <div class="d-flex align-items-center gap-3">
                  <span class="fw-bold" style="color: var(--was-gold)">{{ platPts(p) }}pts</span>
                  <button class="btn btn-sm btn-outline-danger" @click="removePlatoon(p.id)">Remove</button>
                </div>
              </div>
              
              <div class="platoon-body">
                <div v-if="p.sections.length === 0" class="text-muted small mb-2">No sections yet</div>
                
                <div v-for="s in p.sections" :key="s.sid" class="section-row d-flex gap-2 p-2 mb-2 rounded">
                  <div class="flex-grow-1">
                    <div class="d-flex align-items-center gap-2">
                      <strong style="color: var(--was-paper)">{{ s.name }}</strong>
                      <span v-if="getAvail(s)" class="badge avail" :class="getAvail(s).toLowerCase()">{{ getAvail(s) }}</span>
                    </div>
                    <div class="sec-sub text-muted mt-1">{{ getSubtext(s) }}</div>
                    
                    <div v-if="s.type === 'squad' && SQUADS[s.name]" class="mt-2">
                      <div v-if="SQUADS[s.name].upgrade">
                        <button class="btn btn-sm opt-toggle" :class="{ on: s.upgrade }" @click="s.upgrade = !s.upgrade">
                          {{ s.upgrade ? '✓ ' : '' }}{{ SQUADS[s.name].upgrade.label }}
                        </button>
                      </div>
                      <div v-if="SQUADS[s.name].transports && SQUADS[s.name].transports.length" class="mt-1">
                        <select class="form-select was-input form-select-sm w-auto" v-model="s.transport">
                          <option :value="null">No transport</option>
                          <option v-for="t in SQUADS[s.name].transports" :key="t" :value="t">
                            {{ t }} (+{{ UNITS[t].pts }}pts)
                          </option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div class="fw-bold text-end" style="color: var(--was-gold); min-width: 50px;">
                    {{ secPts(s) }}pts
                  </div>
                  <div>
                    <button class="btn btn-sm btn-outline-danger py-0 px-2" @click="removeSection(p.id, s.sid)">×</button>
                  </div>
                </div>

                <div v-for="(w, idx) in platoonWarns(p)" :key="'pw'+idx" class="pl-warn" :class="{ err: w.err }">
                  {{ w.msg }}
                </div>

                <div class="d-flex gap-2 mt-3">
                  <select class="form-select was-input" v-model="p.addSelection">
                    <option value="">-- Select Section --</option>
                    <optgroup label="— Squad Types —">
                      <option v-for="opt in getAvailableSquads()" :key="'sq'+opt.name" :value="'squad||'+opt.name">
                        {{ opt.name }} — {{ opt.pts }}pts {{ opt.avail ? '['+opt.avail+']' : '' }}
                      </option>
                    </optgroup>
                    <optgroup label="— Vehicles & Mecha —">
                      <option v-for="opt in getAvailableVehicles()" :key="'v'+opt.name" :value="'vehicle||'+opt.name">
                        {{ opt.name }} — {{ opt.pts }}pts [{{ opt.avail }}]
                      </option>
                    </optgroup>
                  </select>
                  <button class="buy-btn text-nowrap" @click="addSection(p.id)">+ Add</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="d-none d-print-block print-sheet p-4 bg-white text-dark">
        <div class="p-head border-bottom border-dark border-2 pb-2 mb-3">
          <div class="fs-4 fw-bold">{{ armyName || 'Unnamed Force' }}</div>
          <div class="text-muted small">{{ faction === 'SU' ? 'Sol Union' : 'Eastern Coalition' }} · {{ size }}pt game · {{ totalPts }}/{{ size }}pts</div>
        </div>

        <div v-if="airstrikes > 0 || artillery > 0" class="p-assets border rounded p-2 mb-3 small">
          <b>Strategic assets:</b> 
          <span v-if="airstrikes > 0">{{ airstrikes }}× Airstrike (D20 ROF1 Blast 4, scout-called, {{ airstrikes * 12 }}pts) </span>
          <span v-if="artillery > 0">{{ artillery }}× Artillery Barrage (D12 ROF4 Blast 4, scout-called, {{ artillery * 15 }}pts)</span>
        </div>

        <div v-for="(p, pi) in platoons" :key="'pr'+p.id" class="p-platoon mb-4 pb-inside-avoid">
          <div class="d-flex justify-content-between border-bottom border-secondary mb-2 fw-bold small">
            <span>Platoon {{ pi + 1 }}</span>
            <span>{{ platPts(p) }}pts</span>
          </div>
          <div v-for="s in p.sections" :key="'prs'+s.sid" class="p-unit border rounded p-2 mb-2 pb-inside-avoid small">
            <div class="d-flex justify-content-between fw-bold">
              <span>{{ s.name }}</span>
              <span>{{ secPts(s) }}pts</span>
            </div>
            <div v-if="s.type === 'squad'">
              <div class="text-muted" style="font-size: 0.85em">{{ printSquadComp(s) }}</div>
              <div style="font-size: 0.85em">{{ printSquadStats(s) }}</div>
              <div class="d-flex flex-wrap gap-1 mt-1" v-html="printSquadWeapons(s)"></div>
              <div class="fst-italic text-muted mt-1" style="font-size: 0.8em">{{ printSquadKw(s) }}</div>
              <div v-if="s.transport" class="mt-2 pt-1 border-top">
                 <div class="d-flex justify-content-between fw-bold" style="font-size:0.9em">
                    <span>{{ s.transport }} (transport)</span>
                    <span>{{ UNITS[s.transport].pts }}pts</span>
                 </div>
                 <div style="font-size: 0.85em">{{ printVehicleStats(s.transport) }}</div>
                 <div class="d-flex flex-wrap gap-1 mt-1" v-html="printVehicleWeapons(s.transport)"></div>
                 <div v-html="printVehicleStruct(s.transport)"></div>
              </div>
            </div>
            <div v-else>
              <div style="font-size: 0.85em">{{ printVehicleStats(s.name) }}</div>
              <div class="d-flex flex-wrap gap-1 mt-1" v-html="printVehicleWeapons(s.name)"></div>
              <div class="fst-italic text-muted mt-1" style="font-size: 0.8em">{{ UNITS[s.name].kw }}</div>
              <div v-html="printVehicleStruct(s.name)"></div>
            </div>
          </div>
        </div>

        <div v-if="warnings.length > 0" class="p-warns border border-warning rounded p-2 bg-light mt-3 small">
          <b>Warnings:</b>
          <div v-for="(w, idx) in warnings" :key="'pw2'+idx" :class="{'text-danger': w.err, 'text-warning-emphasis': !w.err}">
            {{ w.err ? '⚠' : '△' }} {{ w.msg }}
          </div>
        </div>
        <div class="mt-2 fw-bold text-end">Total: {{ totalPts }}pts of {{ size }}pts</div>
      </section>
    </main>
    <cFooter class="d-print-none" />
  </div>
</template>

<script>
import cHeader from '@/components/cHeader.vue';
import cFooter from '@/components/cFooter.vue';

// Database Objects
const UNITS = {
  // Sol Union infantry
  "Combat infantry": {f:"SU",role:"Infantry",skill:"D6",move:4,melee:1,def:7,struct:null,w:["RCM","melee blades","improvised AT melee"],kw:"Infantry",pts:14,avail:null,exposed:[],protected:[],main:null},
  "WC LMG drone": {f:"SU",role:"Infantry",skill:"D6",move:4,melee:1,def:7,struct:null,w:["ARQ LMG","melee blades"],kw:"Infantry",pts:15,avail:null,exposed:[],protected:[],main:null},
  "combat scout": {f:"SU",role:"Infantry",skill:"D8",move:5,melee:1,def:7,struct:null,w:["RCM","melee blades","improvised AT melee"],kw:"infantry, scout",pts:21,avail:null,exposed:[],protected:[],main:null},
  "Combat Engineer": {f:"SU",role:"Infantry",skill:"D6",move:4,melee:1,def:7,struct:null,w:["SCM","Antitank melee"],kw:"infantry, ECM, Demolitions",pts:18,avail:null,exposed:[],protected:[],main:null},
  "Drone operator": {f:"SU",role:"Infantry",skill:"D6",move:4,melee:1,def:7,struct:null,w:["FPD 2","melee blades","SCM"],kw:"infantry",pts:17,avail:null,exposed:[],protected:[],main:null},
  "FPD carrier Drone": {f:"SU",role:"Infantry",skill:"D6",move:4,melee:1,def:7,struct:null,w:["melee blades"],kw:"infantry, drone carrier",pts:10,avail:null,exposed:[],protected:[],main:null},
  "Urban Tactical engagement armor": {f:"SU",role:"Power armor",skill:"D8",move:4,melee:1,def:8,struct:null,w:["ARQ LMG","CPD","anti tank melee"],kw:"Infantry, jump, Tough",pts:46,avail:null,exposed:[],protected:[],main:null},
  "anti armor Gunner": {f:"SU",role:"infantry",skill:"D6",move:4,melee:1,def:7,struct:null,w:["AAR","Antitank melee"],kw:"Infantry",pts:16,avail:null,exposed:[],protected:[],main:null},
  "Pack Leader": {f:"SU",role:"infantry",skill:"D6",move:8,melee:2,def:7,struct:null,w:["SCM","claws","anti tank melee"],kw:"Feral, leashed, Apex",pts:28,avail:null,exposed:[],protected:[],main:null},
  "Leashed Hybrid": {f:"SU",role:"infantry",skill:"D6",move:8,melee:1,def:7,struct:null,w:["SCM","claws","anti tank melee"],kw:"feral, leashed",pts:25,avail:null,exposed:[],protected:[],main:null},
  "Leashed Hybrid gunner": {f:"SU",role:"infantry",skill:"D6",move:8,melee:1,def:7,struct:null,w:["shotgun","claws","anti tank melee"],kw:"feral, leashed",pts:23,avail:null,exposed:[],protected:[],main:null},
  // Sol Union vehicles
  "Bull Duck": {f:"SU",role:"light armor",skill:"D6",move:8,melee:2,def:9,struct:4,w:["GMP 60"],kw:"amphibious, Transport 8",pts:47,avail:"platoon",exposed:["GMP 60"],protected:[],main:null},
  "Hoplite": {f:"SU",role:"light armor",skill:"D6",move:8,melee:3,def:9,struct:4,w:["MTG 75","ARQ LMG"],kw:"ERA",pts:60,avail:"basic",exposed:["ARQ LMG"],protected:[],main:"MTG 75"},
  "Spartan": {f:"SU",role:"light armor",skill:"D6",move:8,melee:3,def:9,struct:4,w:["MAW","GOAT 100"],kw:"ERA",pts:57,avail:"platoon",exposed:["GOAT 100"],protected:[],main:"MAW"},
  "Cataphract": {f:"SU",role:"heavy armor",skill:"D6",move:6,melee:4,def:11,struct:10,w:["MMTGx","MTG 75","GMP 60"],kw:"MaDDs, ERA, Stable turret",pts:94,avail:"company",exposed:["GMP 60"],protected:["MTG 75"],main:"MMTGx"},
  "MACS": {f:"SU",role:"mecha",skill:"D6",move:6,melee:5,def:9,struct:6,w:["MTG 75","GOAT 100","MTG 75"],kw:"MaDDs",pts:81,avail:"company",exposed:["GOAT 100"],protected:["MTG 75","MTG 75"],main:null},
  "MACS Suppressor":{f:"SU",role:"mecha",skill:"D6",move:6,melee:5,def:9,struct:6,w:["MAW","GOAT 100","MAW"],kw:"MaDDs",pts:73,avail:"company",exposed:["GOAT 100"],protected:["MAW","MAW"],main:null},
  "Truck": {f:"SU",role:"light armor",skill:"D6",move:7,melee:2,def:7,struct:2,w:[],kw:"Transport 4",pts:32,avail:"basic",exposed:[],protected:[],main:null},
  "Truck Armed": {f:"SU",role:"light armor",skill:"D6",move:7,melee:2,def:7,struct:2,w:["ARQ LMG"],kw:"Transport 4",pts:37,avail:"basic",exposed:["ARQ LMG"],protected:[],main:null},
  // Eastern Coalition
  "Jade Warrior smg": {f:"EC",role:"infantry",skill:"D6",move:4,melee:1,def:7,struct:null,w:["QRAs","melee blades","improvised AT melee"],kw:"Infantry",pts:14,avail:null,exposed:[],protected:[],main:null},
  "Jade Warrior Rifle": {f:"EC",role:"infantry",skill:"D6",move:4,melee:1,def:7,struct:null,w:["QQSr","melee blades","improvised AT melee"],kw:"Infantry",pts:14,avail:null,exposed:[],protected:[],main:null},
  "Jade Gunner": {f:"EC",role:"infantry",skill:"D6",move:4,melee:1,def:7,struct:null,w:["QxLMG","melee blades","improvised AT melee"],kw:"infantry",pts:17,avail:null,exposed:[],protected:[],main:null},
  "Jade scouts": {f:"EC",role:"infantry",skill:"D6",move:6,melee:1,def:6,struct:null,w:["QRAs","melee blades","anti tank melee"],kw:"infantry, Scout",pts:20,avail:null,exposed:[],protected:[],main:null},
  "Jade Drone operator":{f:"EC",role:"infantry",skill:"D6",move:4,melee:1,def:7,struct:null,w:["QRAS","melee blades","improvised AT melee"],kw:"Infantry, Drone",pts:14,avail:null,exposed:[],protected:[],main:null},
  "Jade Signal": {f:"EC",role:"infantry",skill:"D6",move:4,melee:1,def:7,struct:null,w:["QRAS","melee blades","improvised AT melee"],kw:"Infantry, ECM",pts:20,avail:null,exposed:[],protected:[],main:null},
  "Jade Fist": {f:"EC",role:"infantry",skill:"D6",move:4,melee:1,def:7,struct:null,w:["QRAs","FIST","anti tank melee"],kw:"infantry",pts:22,avail:null,exposed:[],protected:[],main:null},
  "Guardian frame": {f:"EC",role:"infantry",skill:"D8",move:6,melee:1,def:8,struct:null,w:["QxLMG","QRAs","anti tank melee"],kw:"infantry, scout",pts:31,avail:null,exposed:[],protected:[],main:null},
  "Hover Bee": {f:"EC",role:"light armor",skill:"D6",move:10,melee:2,def:8,struct:6,w:["QxLMG"],kw:"Transport 6, hover",pts:55,avail:null,exposed:[],protected:["QxLMG"],main:null},
  "cloud runner gun": {f:"EC",role:"light armor",skill:"D6",move:12,melee:2,def:7,struct:4,w:["QxLMG"],kw:"scout",pts:48,avail:null,exposed:["QxLMG"],protected:[],main:null},
  "cloud runner FIST": {f:"EC",role:"light armor",skill:"D6",move:12,melee:2,def:7,struct:4,w:["FIST"],kw:"scout",pts:49,avail:null,exposed:["FIST"],protected:[],main:null},
  "cloud runner Transport": {f:"EC",role:"light armor",skill:"D6",move:12,melee:2,def:7,struct:4,w:["APPDs"],kw:"scout, Transport 4",pts:43,avail:null,exposed:[],protected:[],main:null},
  "iron cliff MBT": {f:"EC",role:"heavy armor",skill:"D6",move:6,melee:3,def:10,struct:8,w:["lun ton","QxLMG"],kw:"turret, MaDDs",pts:74,avail:"company",exposed:["QxLMG"],protected:[],main:"lun ton"},
  "Land Crab": {f:"EC",role:"mecha",skill:"D6",move:8,melee:6,def:10,struct:6,w:["plasma hammer","QxLMG"],kw:"",pts:65,avail:"basic",exposed:["QxLMG"],protected:[],main:"plasma hammer"},
  "celestial sword": {f:"EC",role:"mecha",skill:"D8",move:9,melee:6,def:9,struct:8,w:["plasma lance","Qmax"],kw:"MaDDs, shield",pts:87,avail:"company",exposed:["Qmax"],protected:[],main:"plasma lance"}
};

const WEAPONS = {
  "AAR": {dmg:"D8", rof:1, range:'36"', opt:'24-30"', long:'42"',  rules:"Smoke 2"},
  "ARQ LMG": {dmg:"D4", rof:3, range:'36"', opt:'12-18"', long:'42"',  rules:"Infantry"},
  "anti tank melee":{dmg:"melee",rof:1,range:"melee",opt:null,long:null,    rules:"AT melee"},
  "Antitank melee":{dmg:"melee",rof:1,range:"melee",opt:null,long:null,     rules:"AT melee"},
  "claws": {dmg:"melee",rof:1,range:"melee",opt:null,long:null,      rules:"Melee"},
  "melee blades": {dmg:"melee",rof:1,range:"melee",opt:null,long:null,      rules:"Melee"},
  "improvised AT melee":{dmg:"melee",rof:1,range:"melee",opt:null,long:null, rules:"IAT melee"},
  "FIST": {dmg:"D10",rof:1, range:'48"', opt:'24-32"', long:null,   rules:"Blast 2, Guided"},
  "Fist": {dmg:"D10",rof:1, range:'48"', opt:'24-32"', long:null,   rules:"Blast 2, Guided"},
  "FPD 2": {dmg:"D8", rof:1, range:"drone",opt:null,long:null,       rules:"Drone, CFD, Blast 2"},
  "GMP 60": {dmg:"D6", rof:1, range:'36"', opt:'30-36"', long:'56"',  rules:"Blast 2, Smoke, Infantry"},
  "GOAT 100": {dmg:"D12",rof:1, range:'48"', opt:'30-40"', long:null,   rules:"Guided, Blast 2"},
  "lun ton": {dmg:"D8", rof:2, range:'54"', opt:'36-42"', long:'66"',  rules:""},
  "MAW": {dmg:"D6", rof:3, range:'40"', opt:'20-30"', long:'52"',  rules:""},
  "MMTGx": {dmg:"D20",rof:1, range:'36"', opt:'24-30"', long:'48"',  rules:"Blast 4, Ignores cover, Brace"},
  "MTG 75": {dmg:"D8", rof:2, range:'48"', opt:'28-34"', long:'60"',  rules:"Blast 2"},
  "CPD": {dmg:"D8", rof:1, range:'6"',  opt:null,     long:null,   rules:"Blast 4, Placed"},
  "plasma hammer": {dmg:"D10",rof:1, range:'36"', opt:'24-30"', long:null,   rules:"Blast 4"},
  "plasma lance": {dmg:"D8", rof:1, range:'36"', opt:'24-30"', long:null,   rules:"Blast 2"},
  "Qmax": {dmg:"D6", rof:3, range:'38"', opt:'30-36"', long:'48"',  rules:""},
  "QQSr": {dmg:"D6", rof:1, range:'30"', opt:'20-26"', long:'40"',  rules:"Infantry"},
  "QRAs": {dmg:"D4", rof:3, range:'12"', opt:'4-10"',  long:null,   rules:"Infantry"},
  "QRAS": {dmg:"D4", rof:3, range:'12"', opt:'4-10"',  long:null,   rules:"Infantry"},
  "QxLMG": {dmg:"D4", rof:3, range:'34"', opt:'24-30"', long:'48"',  rules:""},
  "RCM": {dmg:"D4", rof:2, range:'24"', opt:'8-14"',  long:'30"',  rules:"Infantry"},
  "SCM": {dmg:"D4", rof:3, range:'18"', opt:'6-10"',  long:null,   rules:"Infantry"},
  "shotgun": {dmg:"D4", rof:1, range:'12"', opt:null,     long:null,   rules:"Blast 2"},
  "APPDs": {dmg:"D4", rof:3, range:"contact",opt:null,  long:null,   rules:"APPD, triggers on charge"},
};

const SQUADS = {
  // Sol Union
  "Combat Team": {f:"SU",avail:"basic", troops:[{u:"Combat infantry",n:3},{u:"WC LMG drone",n:1}], pts:57, transports:[], upgrade:null},
  "Scout Team": {f:"SU",avail:"company", troops:[{u:"combat scout",n:4}], pts:84, transports:["Truck","Truck Armed"], upgrade:null},
  "Drone Combat Team": {f:"SU",avail:"company", troops:[{u:"Combat infantry",n:2},{u:"Drone operator",n:1},{u:"FPD carrier Drone",n:1}], pts:55, transports:["Truck","Truck Armed"], upgrade:null},
  "Engineer Team": {f:"SU",avail:"company", troops:[{u:"Combat Engineer",n:4}], pts:72, transports:["Truck","Truck Armed"], upgrade:null},
  "Anti Armor Team": {f:"SU",avail:"platoon", troops:[{u:"Combat infantry",n:3},{u:"anti armor Gunner",n:1}], pts:58, transports:["Truck","Truck Armed"], upgrade:null},
  "PA Combat Team": {f:"SU",avail:"basic", troops:[{u:"Urban Tactical engagement armor",n:2}], pts:92, transports:[], upgrade:null},
  // Eastern Coalition
  "Jade Warriors": {f:"EC",avail:"basic", troops:[{u:"Jade Warrior smg",n:1},{u:"Jade Warrior Rifle",n:4},{u:"Jade Gunner",n:1}], pts:87, transports:["Hover Bee"], upgrade:null},
  "Jade Scouts": {f:"EC",avail:"platoon", troops:[{u:"Jade scouts",n:4}], pts:80, transports:["cloud runner Transport"], upgrade:null},
  "Jade Signals": {f:"EC",avail:"platoon", troops:[{u:"Jade Warrior smg",n:3},{u:"Jade Signal",n:1}], pts:62, transports:["cloud runner Transport"], upgrade:null},
  "Drone Team": {f:"EC",avail:"platoon", troops:[{u:"Jade Warrior smg",n:2},{u:"Jade Drone operator",n:2}], pts:56, transports:["cloud runner Transport"], upgrade:null},
  "Jade Fist": {f:"EC",avail:"platoon", troops:[{u:"Jade Warrior smg",n:2},{u:"Jade Fist",n:2}], pts:72, transports:["cloud runner Transport"], upgrade:null},
  "Guardian Frame": {f:"EC",avail:"platoon", troops:[{u:"Guardian frame",n:3}], pts:93, transports:[], upgrade:null},
  "Cloud Runners": {f:"EC",avail:"platoon", troops:[{u:"cloud runner gun",n:3}], pts:144, transports:[], upgrade:{label:"Replace 1 Gun with FIST (+1pt)",pts:1}},
};

const CRIT_TABLE=[
  [null,null,"SEC_A","MOB_HALF","SEC_B","SENSOR","MOB_HALF","ARMOR_1"],
  [null,"MAIN_DMG","MOB_HALF","SEC_A","ARMOR_1","SENSOR","ARMOR_2","IMMOBILIZED"],
  ["CATASTROPHIC",null,"MAIN_DMG","MOB_HALF","SENSOR","ARMOR_2","IMMOBILIZED","CATASTROPHIC"]
];

const ASSET_LIMITS={"500":{air:2,art:1},"1000":{air:3,art:2},"1500":{air:6,art:4}};

export default {
  name: 'vArmyBuilder',
  components: { cHeader, cFooter },
  data() {
    return {
      UNITS, WEAPONS, SQUADS,
      armyName: '',
      faction: 'SU',
      size: '500',
      airstrikes: 0,
      artillery: 0,
      platoons: [],
      nextPid: 1,
      nextSid: 1
    };
  },
  computed: {
    assetPts() {
      return (this.airstrikes * 12) + (this.artillery * 15);
    },
    totalPts() {
      return this.platoons.reduce((a, p) => a + this.platPts(p), 0) + this.assetPts;
    },
    ptsPercent() {
      const lim = parseInt(this.size);
      return Math.min(100, (this.totalPts / lim) * 100);
    },
    ptsFillClass() {
      const lim = parseInt(this.size);
      if (this.totalPts > lim) return 'over bg-danger';
      if (this.totalPts > lim * 0.9) return 'warn bg-warning';
      return 'bg-info';
    },
    assetWarn() {
      const lim = ASSET_LIMITS[this.size];
      if (this.airstrikes > 0 && this.artillery > 0) return 'Cannot mix airstrikes and artillery';
      if (this.airstrikes > lim.air) return `Max ${lim.air} airstrikes at ${this.size}pts`;
      if (this.artillery > lim.art) return `Max ${lim.art} artillery at ${this.size}pts`;
      return null;
    },
    warnings() {
      const warns = [];
      const lim = parseInt(this.size), tp = this.totalPts;
      const alim = ASSET_LIMITS[this.size];

      if(tp > lim) warns.push({msg:`Over points limit: ${tp}/${lim}pts`, err:true});
      if(this.platoons.length < 3) warns.push({msg:`Company has ${this.platoons.length} platoon(s) — minimum 3 required`});
      if(this.platoons.length > 4) warns.push({msg:`${this.platoons.length} platoons — maximum 4`, err:true});
      if(this.airstrikes > 0 && this.artillery > 0) warns.push({msg:`Cannot mix airstrikes and artillery`, err:true});
      if(this.airstrikes > alim.air) warns.push({msg:`Airstrikes: max ${alim.air} at ${this.size}pts`, err:true});
      if(this.artillery > alim.art) warns.push({msg:`Artillery: max ${alim.art} at ${this.size}pts`, err:true});

      const maxCompany = Math.max(1, Math.floor(this.platoons.length / 2));
      const companyCounts = {};
      
      this.platoons.forEach((p, i) => {
        const n = p.sections.length;
        if(n === 0) warns.push({msg:`Platoon ${i+1}: empty`});
        else if(n === 1) warns.push({msg:`Platoon ${i+1}: only 1 section — minimum 2`});
        else if(n === 2 && p.sections[0].name !== p.sections[1].name)
          warns.push({msg:`Platoon ${i+1}: 2-section platoon — both sections must match`});

        const spart = p.sections.filter(s => s.name === 'Spartan').length;
        if(spart > 1) warns.push({msg:`Platoon ${i+1}: max 1 Spartan per platoon`, err:true});

        const platCounts = {};
        p.sections.forEach(s => {
          const av = s.type === 'vehicle' ? (UNITS[s.name] || {}).avail : (SQUADS[s.name] || {}).avail;
          if(av === 'company') companyCounts[s.name] = (companyCounts[s.name] || 0) + 1;
          if(av === 'platoon') platCounts[s.name] = (platCounts[s.name] || 0) + 1;
        });
        Object.entries(platCounts).forEach(([n, c]) => {
          if(c > 1) warns.push({msg:`Platoon ${i+1}: ${n} — max 1 per platoon`});
        });
      });

      Object.entries(companyCounts).forEach(([n, c]) => {
        if(c > maxCompany) warns.push({msg:`${n}: ${c} in list — max 1 per 2 platoons`, err:true});
      });

      return warns;
    }
  },
  watch: {
    faction() {
      this.platoons = [];
      this.nextPid = 1;
      this.nextSid = 1;
    }
  },
  methods: {
    secPts(s) {
      if(s.type === 'squad'){
        const sq = SQUADS[s.name]; if(!sq) return 0;
        let p = sq.pts + (s.upgrade ? sq.upgrade.pts : 0);
        if(s.transport){ const tu = UNITS[s.transport]; if(tu) p += tu.pts; }
        return p;
      }
      const u = UNITS[s.name]; return u ? u.pts : 0;
    },
    platPts(p) {
      return p.sections.reduce((a, s) => a + this.secPts(s), 0);
    },
    addPlatoon() {
      this.platoons.push({ id: this.nextPid++, sections: [], addSelection: '' });
    },
    removePlatoon(pid) {
      this.platoons = this.platoons.filter(p => p.id !== pid);
    },
    addSection(pid) {
      const p = this.platoons.find(p => p.id === pid);
      if(!p || !p.addSelection) return;
      const [type, name] = p.addSelection.split('||');
      if(p.sections.length >= 4) { alert('Maximum 4 sections per platoon.'); return; }
      p.sections.push({ sid: this.nextSid++, type, name, upgrade: false, transport: null });
      p.addSelection = ''; // reset
    },
    removeSection(pid, sid) {
      const p = this.platoons.find(p => p.id === pid);
      if(p) p.sections = p.sections.filter(s => s.sid !== sid);
    },
    getAvail(s) {
      if(s.type === 'squad') return SQUADS[s.name]?.avail || '';
      return UNITS[s.name]?.avail || '';
    },
    getSubtext(s) {
      if(s.type === 'squad'){
        const sq = SQUADS[s.name];
        return sq ? sq.troops.map(t => `${t.n}× ${t.u}`).join(', ') : '';
      }
      const u = UNITS[s.name];
      return u ? `${u.role} · Def ${u.def}${u.struct ? ' · HP '+u.struct : ''} · Move ${u.move}"${u.kw ? ' · '+u.kw : ''}` : '';
    },
    getAvailableSquads() {
      return Object.entries(SQUADS)
        .filter(([,v]) => v.f === this.faction)
        .map(([n,v]) => ({ name: n, pts: v.pts, avail: v.avail }));
    },
    getAvailableVehicles() {
      return Object.entries(UNITS)
        .filter(([,v]) => v.f === this.faction && v.avail && v.struct !== null)
        .map(([n,v]) => ({ name: n, pts: v.pts, avail: v.avail }));
    },
    platoonWarns(p) {
      const w = [];
      const n = p.sections.length;
      if(n === 1) w.push({msg:'Only 1 section — minimum 2'});
      else if(n === 2 && p.sections[0].name !== p.sections[1].name) w.push({msg:'2-section platoon — sections must match'});
      if(p.sections.filter(s => s.name === 'Spartan').length > 1) w.push({msg:'Max 1 Spartan per platoon', err:true});
      return w;
    },
    doPrint() {
      window.print();
    },
    // Print Helpers
    wpnHtml(wname) {
      const key = Object.keys(WEAPONS).find(k => k.toLowerCase() === wname.toLowerCase());
      const w = key ? WEAPONS[key] : null;
      if(!w || w.range === 'melee' || w.range === 'contact') return null;
      const rangeStr = w.opt ? `Rng ${w.range} · Opt ${w.opt}${w.long ? ' · Long '+w.long : ''}` : w.range ? `Rng ${w.range}` : '';
      return `<div class="border rounded px-1 py-0 me-1 mb-1 d-inline-block"><b>${wname}</b> ${w.dmg} ROF${w.rof}${rangeStr ? ' · '+rangeStr : ''}${w.rules ? ' · '+w.rules : ''}</div>`;
    },
    unitCrits(uName) {
      const u = UNITS[uName]; if(!u || !u.struct) return [];
      const tally = new Map();
      CRIT_TABLE.forEach(row => row.forEach(code => {
        if(!code) return;
        let label = '';
        if(code === 'SEC_A') label = u.exposed?.length ? 'Exposed destroyed: '+u.exposed.join('/') : 'Exposed wpn hit (none)';
        else if(code === 'SEC_B') label = u.protected?.length ? 'Protected destroyed: '+u.protected.join('/') : 'Protected wpn hit (none)';
        else if(code === 'MAIN_DMG'){
          if(uName === 'MACS' || uName === 'MACS Suppressor') label = 'Weapon system damaged (random)';
          else label = u.main ? 'Main wpn damaged: '+u.main : 'Main wpn hit (none)';
        } else {
          const m = {'MOB_HALF':'Mobility ½ (permanent)','SENSOR':'Sensor dmg −1 Fortune','ARMOR_1':'Armor −1 defense','ARMOR_2':'Armor −2 defense','IMMOBILIZED':'Immobilized','CATASTROPHIC':'Catastrophic — destroyed'};
          label = m[code] || code;
        }
        if(!tally.has(label)) tally.set(label, {label, count:0, cat:code==='CATASTROPHIC'});
        tally.get(label).count++;
      }));
      return [...tally.values()];
    },
    printSquadComp(s) {
      const sq = SQUADS[s.name]; if(!sq) return '';
      return sq.troops.map(t => `${t.n}× ${t.u}`).join(' + ') + (s.upgrade && sq.upgrade ? ' + '+sq.upgrade.label : '');
    },
    printSquadStats(s) {
      const sq = SQUADS[s.name]; if(!sq) return '';
      const prim = UNITS[sq.troops[0].u];
      return prim ? `${prim.role} · Skill ${prim.skill} · Move ${prim.move}" · Def ${prim.def} · Melee ${prim.melee}` : '';
    },
    printSquadWeapons(s) {
      const sq = SQUADS[s.name]; if(!sq) return '';
      const allWpns = new Set();
      sq.troops.forEach(t => { const u = UNITS[t.u]; if(u) u.w.forEach(w => allWpns.add(w)); });
      return [...allWpns].map(this.wpnHtml).filter(Boolean).join('');
    },
    printSquadKw(s) {
      const sq = SQUADS[s.name]; if(!sq) return '';
      const kwSet = new Set();
      sq.troops.forEach(t => { const u = UNITS[t.u]; if(u && u.kw) u.kw.split(',').forEach(k => kwSet.add(k.trim())); });
      return [...kwSet].join(', ');
    },
    printVehicleStats(uName) {
      const u = UNITS[uName]; if(!u) return '';
      return `${u.role} · Skill ${u.skill} · Move ${u.move}" · Def ${u.def} · Melee ${u.melee} · HP ${u.struct}`;
    },
    printVehicleWeapons(uName) {
      const u = UNITS[uName]; if(!u) return '';
      return u.w.map(this.wpnHtml).filter(Boolean).join('');
    },
    printVehicleStruct(uName) {
      const u = UNITS[uName]; if(!u) return '';
      const boxes = Array(u.struct).fill('<span style="display:inline-block;width:12px;height:12px;border:1px solid #000;border-radius:2px;margin-right:2px;"></span>').join('');
      const crits = this.unitCrits(uName);
      const critHtml = crits.length ? `<div class="mt-1 d-flex flex-wrap gap-2">${crits.map(c => `<div class="border rounded px-1" style="font-size:0.8em">${Array(c.count).fill('<span style="display:inline-block;width:8px;height:8px;border:1px solid #000;margin-right:2px;vertical-align:middle"></span>').join('')}<span>${c.label}</span></div>`).join('')}</div>` : '';
      return `<div class="d-flex align-items-center gap-1 mt-1"><span class="text-muted" style="font-size:0.85em">Structure:</span>${boxes}</div>${critHtml}`;
    }
  }
}
</script>

<style scoped>
.page-shell {
  max-width: 1200px;
}
.page-title {
  color: var(--was-paper);
}
.page-kicker {
  color: var(--was-gold);
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  font-size: 0.74rem;
  margin-bottom: 0.4rem;
}

.slabel {
  font-size: 0.75rem;
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

.tog-row {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}
.tog {
  font-size: 0.8rem;
  padding: 0.25rem 0.75rem;
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

.pts-val {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--was-gold);
}
.pts-meta {
  font-size: 0.8rem;
  color: var(--was-text-muted);
}
.pts-track {
  height: 6px;
  background: var(--was-night);
  border-radius: 3px;
  overflow: hidden;
}
.pts-fill {
  height: 100%;
  border-radius: 3px;
  transition: width .3s;
}

.warn-item {
  font-size: 0.8rem;
  color: var(--was-gold);
  padding: 4px 8px;
  background: rgba(236, 227, 138, 0.1);
  border: 1px solid rgba(236, 227, 138, 0.3);
  border-radius: 5px;
  margin-bottom: 4px;
}
.warn-item.err {
  color: #f57878;
  background: rgba(245, 120, 120, 0.1);
  border-color: rgba(245, 120, 120, 0.3);
}

.avail {
  font-size: 0.65rem;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 700;
}
.avail.basic { background: var(--was-sky-deep); color: var(--was-paper); }
.avail.platoon { background: rgba(236, 227, 138, 0.2); color: var(--was-gold); }
.avail.company { background: rgba(212, 135, 95, 0.2); color: var(--was-fox); }

.pl-warn {
  font-size: 0.75rem;
  color: var(--was-gold);
  margin-top: 5px;
  padding: 4px 8px;
  background: rgba(236, 227, 138, 0.1);
  border-radius: 5px;
}
.pl-warn.err {
  color: #f57878;
  background: rgba(245, 120, 120, 0.1);
}

.opt-toggle {
  font-size: 0.75rem;
  padding: 2px 8px;
  border-radius: 4px;
  border: 1px solid var(--was-border);
  background: var(--was-night);
  color: var(--was-text-muted);
}
.opt-toggle.on {
  background: rgba(110, 207, 142, 0.2);
  color: #6ecf8e;
  border-color: #1a6e3a;
}

.section-row {
  background-color: var(--was-night);
  border: 1px solid transparent;
}

@media print {
  .pb-inside-avoid {
    page-break-inside: avoid;
  }
}
</style>