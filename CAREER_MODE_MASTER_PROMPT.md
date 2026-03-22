# SWIM26 Career Mode Master Prompt

## Purpose
Use this prompt to redesign SWIM26 career mode into **two clearly separated long-form modes**:
1. **Player Career** — a single-athlete journey from school swimming to national-team and world-stage competition.
2. **Club / Coaching Career** — a management fantasy focused on building a swim club, hiring staff, developing athletes, qualifying relays, and growing a program into an international powerhouse.

This document also folds in:
- a repo audit of the current SWIM26 implementation,
- a benchmark review of strong sports-game career loops,
- a swimming-specific progression ladder based on real competitive structures,
- and a detailed implementation prompt for systems, UX, pacing, and long-term retention.

---

## 1) Current Repo Audit: What Exists vs. What Is Missing

### What the current project already does well
- `CareerScreen` already sells the fantasy visually: career ladder, sponsorships, coaching unit, milestones, and season timeline are represented as premium UI concepts.
- `ClubScreen` already sells a management fantasy: scouting, staffing, sponsorships, competitions, and club setup are all represented at the surface level.
- `GameManager` already tracks a basic `careerEventIndex` and `careerTier`, and emits a `careerEventUnlocked` event.
- Player data already includes progression-related identity fields like level, XP, reputation, fame, cosmetics, and specialty.

### Current structural gap
Right now, the product mixes **athlete progression fantasy** and **club management fantasy** inside overlapping surfaces instead of treating them as distinct careers.

### Current logic gap
The current core logic is still shallow:
- `GameManager.getCareerEventAt()` is still a placeholder and returns `null`.
- Career progression currently advances by simply incrementing `careerEventIndex` after a career race.
- The current `IPlayerSwimmer` shape only reflects athlete progression, not a fully separated club/coaching save architecture.

### Design consequence
The UI already implies a deep sports-life simulation, but the underlying systems are not yet structured to support:
- separate save fantasies,
- seasonal stakes,
- qualification pressure,
- athlete development arcs,
- staff consequences,
- meaningful scouting/recruitment decisions,
- or a true swimming ladder from school to global competition.

---

## 2) Benchmark: What Popular Sports Career Modes Do Well

### A. Single-athlete career mode patterns worth borrowing
Observed in flagship sports titles such as **Road to the Show**, **NBA 2K MyCAREER**, **TopSpin 2K MyCAREER**, and **EA Sports FC Player Career**:

#### 1. Identity-first onboarding
The best modes begin with a strong identity hook:
- origin story,
- archetype choice,
- early proving grounds,
- rival introduction,
- and a sense that the athlete is entering a larger ecosystem.

**SWIM26 translation:**
Start Player Career with a swimming identity package:
- age bracket,
- school / club background,
- primary stroke,
- race-distance archetype,
- coach relationship,
- personality tendency,
- and a first rival from the same region.

#### 2. Short-term gameplay inside long-term progression
The best sports careers make every match matter because it feeds:
- form,
- relationships,
- selection,
- contracts,
- rankings,
- media perception,
- and future opportunities.

**SWIM26 translation:**
Every race should feed at least one long-loop system:
- qualification time progress,
- coach trust,
- fatigue/recovery,
- rival pressure,
- sponsor interest,
- federation visibility,
- selection odds.

#### 3. Distinct “play” and “management” fantasies
The best sports games keep the player fantasy and the franchise/manager fantasy distinct even when they share a universe.

**SWIM26 translation:**
Do not bury club management inside the athlete mode or vice versa.
- Player Career = “I am the swimmer.”
- Club/Coaching Career = “I run the program.”

#### 4. Narrative through systems, not just cutscenes
Strong sports modes use dynamic context:
- coach feedback,
- media reactions,
- milestone scenes,
- selection drama,
- rivalry callbacks,
- role changes.

**SWIM26 translation:**
Let the game generate swimming drama from:
- missed qualifying cuts,
- relay selection disputes,
- overtraining risk,
- event scheduling conflicts,
- team politics,
- breakthrough swims,
- surprise underdogs.

#### 5. Multiple pacing layers
Addictive sports careers usually alternate between:
- high-frequency playable moments,
- medium-frequency management choices,
- low-frequency “season-defining” moments.

**SWIM26 translation:**
Use 3 pacing loops:
- **Weekly loop:** training blocks, recovery, local meets, coach decisions.
- **Season loop:** qualifiers, championships, selection lists, sponsorships.
- **Career loop:** school → junior → national → continental/world → Olympic-cycle fantasy.

### B. Club / manager mode patterns worth borrowing
Observed in franchise / dynasty / manager modes:

#### 1. Roster-building tension
A good management mode creates scarcity around:
- budget,
- contracts,
- staff slots,
- training facility level,
- recruitment reach,
- and morale.

#### 2. Development over pure acquisition
The best modes make it fun to build hidden gems, not just sign stars.

**SWIM26 translation:**
Youth pipelines and swimmer development should matter more than a pure transfer market fantasy.

#### 3. Meaningful delegation
Management gameplay becomes deeper when the user chooses what to personally control vs. automate.

**SWIM26 translation:**
Allow assistants to automate:
- conditioning plans,
- travel booking,
- scouting reports,
- sponsor handling,
- and training microcycles.

#### 4. Club identity and philosophy
Great management modes let users build a recognizable philosophy.

**SWIM26 translation:**
Club identity should affect:
- athlete recruitment fit,
- development bonuses,
- sponsor fit,
- staff chemistry,
- and fan/supporter growth.

---

## 3) Real Swimming Career Ladder: Grounding the Fantasy in the Sport

Design the SWIM26 progression ladder to feel authentic to competitive swimming structures rather than copying football-style leagues.

### Real-feel development arc
A swimming career usually feels like this:
1. **School / local club foundation**
2. **Regional and state/provincial age-group competition**
3. **Junior / youth elite meets**
4. **National qualifying meets and national championships**
5. **University / collegiate or elite club high-performance phase**
6. **National team selection / trials**
7. **Continental and world-level competition**
8. **Major pinnacle cycle** (World Championships / Olympics-like fantasy)

### Recommended SWIM26 Player Career ladder
Use an 8-stage ladder instead of the current flatter 5-tier abstraction.

#### Stage 1 — School Circuit
Fantasy: unknown swimmer learning pressure and fundamentals.
- School invitationals
- District meets
- School championships
- Basic time standards
- First rival and first coach trust arcs

#### Stage 2 — Local Club Circuit
Fantasy: moving from raw talent to structured training.
- Club invitationals
- Weekend time-trial meets
- Technique camps
- Stroke-specialty identity begins to matter

#### Stage 3 — Regional Age-Group
Fantasy: first real ladder pressure.
- Regional qualifiers
- Age-group finals
- Relay selection
- Travel fatigue starts to matter
- Rankings become visible

#### Stage 4 — Junior Elite
Fantasy: prospect status.
- Junior nationals / elite youth series
- Media mentions
- Sponsor scouting
- Event specialization vs. multi-event load decisions

#### Stage 5 — National Pathway
Fantasy: national relevance.
- National qualifiers
- National championships
- Federation camps
- Selection standards and cuts
- Stronger rivalry / politics / lane pressure

#### Stage 6 — Collegiate / Pro Club High Performance
Fantasy: elite environment management.
- University dual meets or pro-club training squads
- Facility quality matters more
- staff specialization matters more
- schedule compression creates burnout risk

#### Stage 7 — International Selection
Fantasy: trying to make the team.
- National trials
- relay camp
- selection committees
- taper timing
- pressure of one-chance swims

#### Stage 8 — Global Stage
Fantasy: swimming immortality.
- Continental championships
- World championships
- world rankings
- records
- legacy goals

### Important realism note
Swimming progression should feel less like a weekly league table and more like a combination of:
- training blocks,
- qualification standards,
- meet calendars,
- selection moments,
- peaking/tapering,
- and event specialization.

That real-sport rhythm is what will make the game feel authentic instead of generic.

---

## 4) Separation Plan: Two Distinct Career Modes

## Mode A — Player Career
### Fantasy statement
“I am one swimmer trying to build a life, earn selection, master races, and become great.”

### Core player verbs
- Train
- Race
- Recover
- Choose event focus
- Build relationships
- Manage schedule and energy
- Chase qualifying cuts
- Earn selection
- Build reputation and legacy

### Player Career core systems
1. **Athlete Build System**
   - stroke archetype,
   - distance profile,
   - body/engine traits,
   - mental style,
   - underwater skill ceiling,
   - turn quality,
   - pacing IQ.

2. **Training Block System**
   - macrocycle,
   - mesocycle,
   - microcycle,
   - gym,
   - technique,
   - race-pace,
   - recovery.

3. **Fatigue / Readiness / Taper System**
   - acute fatigue,
   - chronic load,
   - sleep / morale,
   - readiness score,
   - taper timing bonus.

4. **Qualification System**
   - meet cuts,
   - federation standards,
   - school/team selection,
   - lane seeding,
   - invite-only events.

5. **Rival / Coach / Media System**
   - rival arcs,
   - coach trust,
   - teammate competition,
   - sponsor offers,
   - media narratives.

6. **Lifestyle & Decision Layer**
   - rest vs. extra session,
   - safe schedule vs. overload,
   - specialization vs. versatility,
   - relay duty vs. individual preparation,
   - appearance obligations vs. recovery.

7. **Legacy Layer**
   - medals,
   - records,
   - breakthrough swims,
   - signature events,
   - hall-of-fame style milestones.

### Player Career anti-boredom rules
- Never make the player grind the same event too many times without new stakes.
- Every meet must advance at least one of these: ranking, cut time, rivalry, selection, sponsor arc, or personal milestone.
- Always present one “safe” path and one “risky/high-reward” path.
- Use surprise story events sparingly but consistently.
- Make race goals contextual, not always “finish first.”
  Examples:
  - hit a cut time,
  - negative-split correctly,
  - survive a heavy-load week,
  - beat one rival in heat seeding,
  - secure relay selection.

---

## Mode B — Club / Coaching Career
### Fantasy statement
“I build, coach, and manage a swim program from small club to international powerhouse.”

### Core player verbs
- Recruit
- Hire
- Develop
- Plan calendar
- Allocate budget
- Assign staff
- Enter competitions
- Build facilities
- Manage morale
- Produce champions and relays

### Club/Coaching Career core systems
1. **Club Identity System**
   - founding location,
   - philosophy,
   - youth vs. elite focus,
   - sprint vs. endurance bias,
   - academic/college pipeline vs. pro pathway,
   - community prestige.

2. **Roster Pyramid**
   - academy swimmers,
   - prospects,
   - senior squad,
   - relay specialists,
   - stars,
   - veterans.

3. **Staffing System**
   - head coach,
   - assistant coaches,
   - strength coach,
   - physio,
   - sports scientist,
   - scout / recruiting coordinator,
   - psychologist.

4. **Training Philosophy Engine**
   - high-volume aerobic,
   - sprint-power,
   - technical efficiency,
   - IM versatility,
   - relay chemistry focus.

5. **Meet Entry & Calendar Strategy**
   - who swims where,
   - how often,
   - who tapers,
   - who trains through,
   - which relays to prioritize,
   - balancing club visibility vs. athlete burnout.

6. **Athlete Development & Retention**
   - progression curves,
   - morale,
   - promise fulfillment,
   - scholarship / salary / support package,
   - transfers,
   - breakout timing,
   - injury and burnout risk.

7. **Finance & Growth**
   - memberships,
   - sponsors,
   - prize funds,
   - operating costs,
   - facility upgrades,
   - event hosting,
   - academy expansion.

8. **Club Prestige & Competitive Climb**
   - local reputation,
   - regional status,
   - national relevance,
   - international invitations,
   - relay prestige,
   - alumni legacy.

### Club/Coaching anti-boredom rules
- Management decisions must have visible athlete consequences.
- Staff hires must create meaningful playstyle differences.
- Prospects should surprise the player; some overperform, some stall.
- Relay strategy should matter often.
- Facility upgrades must change outcomes, not just numbers.
- The player must sometimes choose between short-term wins and long-term development.

---

## 5) Shared World Rules Across Both Modes

These two modes should live in the same universe but not collapse into each other.

### Shared data world
- Same pools
- Same federations
- Same sponsor brands
- Same world ranking structure
- Same event taxonomy
- Same calendar logic
- Same commentary/news ecosystem

### Different save fantasies
- **Player Career save:** one athlete is the center of the world.
- **Club/Coaching Career save:** the club is the center of the world.

### Optional crossover features
These should be bonus layers, not required complexity:
- Retired Player Career athlete can become a coach profile later.
- Club mode can generate “star swimmer stories” using the same narrative system.
- Shared rival clubs and shared world news feed can create continuity.

---

## 6) Mechanics That Make Swimming Playable and Addictive

## A. Race-to-race decision depth
Before each meet, ask the player to make meaningful prep choices:
- go heavy into training,
- taper lightly,
- full taper,
- enter extra event,
- skip relay,
- protect recovery,
- chase qualifying time.

These choices should influence:
- readiness,
- confidence,
- sponsor visibility,
- coach approval,
- and race performance windows.

## B. Race goals beyond finishing position
Swimming gets more interesting when each swim has layered objectives:
- place goal,
- time goal,
- split goal,
- technique goal,
- stamina goal,
- rivalry goal,
- selection goal.

## C. Training as playable texture, not just menus
Use short-form, high-signal training interactions:
- turn timing drills,
- breakout rhythm drills,
- underwater dolphin control,
- pacing challenge ghosts,
- stroke efficiency drills,
- relay takeover timing.

Do not overuse them. They should be punchy and skippable, with meaningful rewards.

## D. Form arcs and breakthrough moments
One of the most addictive sports-game feelings is sensing that the athlete is “coming into form.”

Use hidden and visible variables:
- technique sharpness,
- confidence,
- race composure,
- fatigue balance,
- coach trust,
- momentum.

This creates dramatic beats like:
- “I wasn’t the best swimmer overall, but I peaked at the right meet.”

## E. Specialization tension
Swimming is more interesting when the player must choose:
- 50/100 sprint route,
- 100/200 specialist route,
- IM all-rounder route,
- distance route,
- relay utility role.

That identity should open some doors and close others.

## F. Meet format drama
Use the actual feel of swimming competition:
- heats,
- semis,
- finals,
- seeded finals,
- time standards,
- relay selection,
- morning/evening split,
- lane assignments.

This instantly makes the sport feel more authentic.

---

## 7) Recommended Content Structure for Long-Term Retention

### Player Career content layers
#### Layer 1 — Always-on loop
- weekly training plan,
- readiness,
- race entry,
- reward recap.

#### Layer 2 — Seasonal arc
- qualification ladder,
- championship calendar,
- rival update,
- coach expectations,
- sponsor pressure.

#### Layer 3 — Career-defining moments
- first national cut,
- first major medal,
- national team call-up,
- relay anchor role,
- world record attempt,
- comeback from slump,
- late-career reinvention.

### Club/Coaching content layers
#### Layer 1 — Always-on loop
- roster review,
- training allocation,
- meet entries,
- scouting and staff actions.

#### Layer 2 — Seasonal arc
- sponsor renewals,
- club ranking climb,
- academy graduation,
- major relay campaigns,
- budget pressure.

#### Layer 3 — Dynasty moments
- produce first national champion,
- open elite facility,
- sign generational prospect,
- qualify multiple swimmers for world stage,
- win major club title,
- survive a financial downturn,
- build legacy staff tree.

---

## 8) Information Architecture Proposal for SWIM26

## Main menu separation
Replace the current blended career fantasy with:
- **Player Career**
- **Club / Coaching Career**
- Quick Race
- Live Events
- Rankings
- Social

## Player Career hub tabs
- Overview
- Calendar
- Training
- Coach
- Rankings
- Rivals
- Sponsors
- Legacy

## Club / Coaching hub tabs
- Club HQ
- Roster
- Staff
- Academy
- Calendar
- Scouting
- Finance
- Facilities
- Competitions
- Prestige

## Save architecture proposal
Add separate save roots:
- `playerCareerSave`
- `clubCareerSave`

Do not try to force both fantasies into one state object.

---

## 9) Data Model Direction

## Player Career entities
- Athlete profile
- Event specialties
- Personal bests
- Season goals
- Qualification standards
- Calendar entries
- Readiness state
- Fatigue state
- Relationship state
- Rival arcs
- Sponsorships
- Media reputation
- Selection status
- Legacy records

## Club Career entities
- Club profile
- Club philosophy
- Budget and operating cashflow
- Facilities
- Staff roster
- Athlete roster
- Prospect pipeline
- Training groups
- Competition schedule
- Sponsor portfolio
- Prestige / reputation
- Club records
- Relay units

## World entities shared by both modes
- Competition definitions
- Regions / federations
- ranking ladders
- event templates
- qualification rules
- venue catalog
- sponsor pools
- generated news stories

---

## 10) Career Pacing Rules

### Golden rules
1. Every week must present at least one meaningful choice.
2. Every meet must have more than one success condition.
3. Every month must move at least one medium-term arc.
4. Every season must feature at least one defining pressure moment.
5. Every stage transition must feel earned and ceremonial.

### Anti-grind rules
- Never ask for more than 2-3 similar low-stakes meets in a row without new story pressure.
- Fast-sim should be safe for low-stakes content.
- Big meets must feel different in presentation, pressure, and rewards.
- If the player fails, branch the path instead of hard-stopping progress.

### Failure design
Failure should create drama, not dead air.
Examples:
- miss a cut → redirected to last-chance qualifier,
- lose selection → gain revenge objective,
- overtrain → forced recovery block,
- sponsor deal collapses → gain underdog narrative bonus,
- star prospect leaves club → rival club story begins.

---

## 11) MASTER IMPLEMENTATION PROMPT

Copy the prompt below into the planning / generation workflow when building the full SWIM26 career systems.

---

You are redesigning SWIM26 career mode into a premium long-term sports experience with **two fully separated but universe-consistent modes**:

### Mode 1: Player Career
Build a single-athlete swimming life simulation where the player starts in the **school/local club phase** and rises through **regional, junior elite, national, selection, and global championship stages**.

### Mode 2: Club / Coaching Career
Build a management mode where the player runs a swim club or coaching program, hires staff, recruits and develops swimmers, manages training groups and relays, grows facilities and finances, and climbs from a local club to a national and global powerhouse.

### High-level design goals
- Make the game feel **authentically like competitive swimming**, not a reskinned football career mode.
- Make both career modes **addictive, dramatic, and highly replayable**.
- Keep **short-term gameplay exciting** and **long-term progression meaningful**.
- Ensure the player always has **interesting choices**, not just repetitive race grind.
- Let the systems generate drama through **selection pressure, fatigue, tapering, coach trust, rivalries, relay decisions, sponsorship, rankings, and qualification standards**.

### Required design principles
1. **Separate fantasies cleanly**
   - Player Career and Club/Coaching Career must have different hubs, different save structures, different progression logic, and different reward loops.
   - They may share world data, event rules, rankings, sponsors, venues, and news, but they must not feel like the same mode with a different skin.

2. **Use a real-feel swimming progression ladder**
   - Player Career should progress through:
     - School Circuit
     - Local Club Circuit
     - Regional Age-Group
     - Junior Elite
     - National Pathway
     - Collegiate/Pro Club High Performance
     - International Selection
     - Global Stage
   - Club/Coaching Career should progress from:
     - small local program
     - regional relevance
     - national-level club
     - elite development hub
     - international powerhouse

3. **Design around swimming-specific stakes**
   - qualification times,
   - heats/semis/finals,
   - morning/evening sessions,
   - relay selection,
   - taper timing,
   - event specialization,
   - coaching blocks,
   - overtraining risk,
   - readiness,
   - rankings,
   - records.

4. **Keep the mode from becoming boring**
   - Every race must advance at least one of the following: rankings, qualification progress, rivalry, sponsorship, coach trust, selection status, or legacy.
   - Do not make “win race, gain XP, repeat” the whole loop.
   - Use multiple success conditions such as: hit a cut time, execute race plan, beat one rival, qualify for final, secure selection, defend ranking.
   - Allow failure to branch into new content instead of creating dead ends.

5. **Make progression emotional**
   - Include breakthrough moments, slumps, pressure swims, comeback arcs, relay drama, staff tensions, selection disappointments, and milestone celebrations.
   - Use generated systemic storytelling rather than relying only on scripted cutscenes.

### Deliverables to generate
Create a complete design package with the following sections:
1. Career mode overview
2. Comparison between Player Career and Club/Coaching Career
3. Core gameplay loops for each mode
4. Progression ladders and stage gates
5. Data model / save architecture
6. Seasonal calendar structure
7. Qualification and selection systems
8. Training, fatigue, readiness, and taper systems
9. Rival, coach, sponsor, federation, and media systems
10. Club management systems including staffing, academy, facilities, finance, and roster development
11. Anti-boredom pacing rules
12. Failure-state branching rules
13. UX / menu architecture
14. Content-generation templates for meets, story beats, and dynamic objectives
15. A live-ops-friendly extension strategy for future championships, federations, and sponsor arcs

### Player Career mechanics requirements
Include:
- athlete creation with swimming archetypes,
- event specialization and multi-event tradeoffs,
- training blocks and recovery,
- race-plan goals,
- personal best tracking,
- qualification cuts,
- national selection logic,
- coach trust,
- rival arcs,
- sponsor offers,
- legacy milestones,
- world ranking climb.

### Club / Coaching Career mechanics requirements
Include:
- club founding or hired-manager path,
- club identity/philosophy,
- athlete recruitment and development,
- staff hiring and delegation,
- academy pipeline,
- relay building,
- meet entry strategy,
- facility upgrades,
- budget and sponsor management,
- morale and retention,
- prestige climb,
- club-level championships and international invitations.

### Tone requirements
- Premium
- grounded in real swimming culture
- aspirational
- dramatic without being cheesy
- cleanly systemized for implementation
- detailed enough that design, engineering, UI/UX, and content teams can all build from it

### Output requirements
Produce:
- a top-level vision,
- a detailed systems blueprint,
- a progression ladder,
- a menu / UX breakdown,
- a database/entity outline,
- and a content framework with enough specificity to begin implementation immediately.

---

## 12) Immediate Recommended Next Steps for the Repo

1. Create separate route/hub ownership for `Player Career` and `Club / Coaching Career` instead of blending both fantasies.
2. Replace the placeholder `getCareerEventAt()` path with a real event database and stage-gate rules.
3. Expand the data model beyond the current single-athlete save assumptions.
4. Add calendar, qualification, and selection systems before adding more cosmetic career UI.
5. Make race outcomes feed readiness, relationships, rankings, and qualification progress.
6. Build club mode around swimmer development and relay strategy rather than generic transfer-market tropes alone.

---

## 13) Repo-Fit Notes for SWIM26 Specifically

### Existing files that suggest where this design should land
- `src/components/menu/CareerScreen.tsx` should evolve into the **Player Career hub**, not a generic blended career panel.
- `src/components/menu/ClubScreen.tsx` should evolve into the **Club / Coaching Career hub**, not a parallel alternate fantasy inside the same progression logic.
- `src/core/GameManager.ts` needs a real career event source, proper stage logic, and separate progression handling by mode.
- `src/types/index.ts` should be expanded to support separate save domains and richer season/career state.

### Principle for implementation
The next major milestone should not be “add more career cards.”
It should be:

**“Establish a true dual-career architecture with swimming-authentic progression and replayable stakes.”**

