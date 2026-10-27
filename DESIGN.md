# 进化的四十六亿重奏 · 3D 展览馆 — Design

> **This document is the brief for the whole project.** It is written so that an implementing agent can work from it, alone, indefinitely, without further direction from the author. Read it in full before touching anything, follow it, keep §11 (status) and §10 (decisions) current. If something is unclear, decide in the spirit of §3 and record the decision in §10 — do not stop to ask. Implementation detail lives in `docs/架构.md`, `docs/性能.md` and `docs/番外写作指南.md`; this file is the direction.

## 1. What this is

A fan-made, non-commercial, interactive 3D **exhibition hall** (展览馆) of the novel 《进化的四十六亿重奏》: "a museum of the universe born from the novel." Every place 琳 has been — 绒球, 虚空, 虚民母球, 尔什, the dream island, the underground world, and **every other place the book describes, in the void and beyond** — can be entered and flown through. Every glowing point is an entry with a paraphrased summary, related entries and the chapters it comes from; a library lets you browse by category, storyline, era and chapter; short original side stories (番外) hang around the worlds; a reader lets you load your *own* copy of the novel locally.

It covers the **whole novel**, breadth first, and it keeps growing: the more of the book is in it, the better. There is no "complete".

**Live site:** https://alexw6385.github.io/4.6-billion-symphony/
**Source of truth for content:** the private repo **https://github.com/AlexW6385/rongqiu-source** (`novel.txt`, UTF-8, ~34 MB) — see §4.

## 2. What this is NOT

- **Not connected to 绒球世界.** [rongqiu-world](https://github.com/AlexW6385/rongqiu-world) is a separate project with different goals (realism, ground-level, 绒球 only). The two share no code, no data, no links, and no obligations to agree with each other. Do not build bridges between them.
- **Not a host for the original text.** The repo and the page never contain the novel's prose. Entries and descriptions are paraphrased; `chapters.js` holds only volume names, chapter numbers and titles. `tools/check_overlap.py` enforces a 12-character overlap limit and is run before every content commit.
- **Not official.** Independent of the author and 起点中文网; copyright of the novel stays with them.
- **Not a game.** No objectives or progression. Flying, looking, reading and browsing are the whole interaction.
- **Not a heavy app.** Stylised worlds, not photoreal; no asset pipeline; runs on a phone.

## 3. What to get right, in order

When goals conflict, resolve in this order.

1. **Legally clean.** No original text, ever. Side stories clearly labelled as not from the book. The reader keeps the user's txt on their own machine only.
2. **Smooth, always.** No stutter, no hitches, no dropped input, on the author's desktop and phone. A new feature that costs smoothness is not finished until it no longer does. Smoothness beats visuals.
3. **Silky interaction.** Entering a world, flying to an entry, opening a card, jumping from the library, changing pages in the reader, sharing a link — every transition is immediate, animated cleanly, and never breaks. Interaction bugs are fixed before new content.
4. **Faithful and ever richer.** Every place, thing, being and event the novel describes gets an entry, a model and a chapter link; every place can be entered. Content order follows importance in the novel. More is always better.
5. **As good-looking as it can be within 2.** Better models, lighting, atmosphere and motion are welcome whenever they cost nothing in smoothness.
6. **No accumulated debt.** Problems are fixed when found, not stacked. The codebase must stay something an agent can understand in one reading.

## 4. Source of truth and token economy

- **The novel is in `rongqiu-source`** (private). An implementing agent attaches that repo to read `novel.txt`. It is far too long to read end to end — **do not**. Work search-first: keep a list of names and aliases (`data/wiki*.js` already holds hundreds), locate occurrences with text search by chapter, read only the passage around each hit (a few hundred characters each side; more when a description runs long). Read a whole chapter only when it is clearly a set-piece for a place or event.
- **Working notes** (which passages were used for which entry, what is still missing per chapter) may be kept in `rongqiu-source/exhibition/` so they are never re-derived. Nothing from there enters this repo except the paraphrased entries.
- **Entries are the public paraphrase.** Each `data/wiki*.js` entry: id, name, category, world and coordinates, era, one-line `s`, body `d`, chapters `ch`, related `rel`, shape `k`/`kp`. Body text is written fresh from understanding, not by editing sentences of the original; the overlap checker is the gate.
- **Batch the work.** When reading a chapter range for one entry, note every other entry it touches and update them in the same pass. Never re-read a range already covered for the same purpose.

## 5. Architecture

- **One page, assembled by a script.** `src/` holds the page in numbered fragments (`00_head.html` … `99_tail.html`); `scripts/order.txt` fixes the order; `scripts/build.mjs` produces `index.html`, `build:min` a minified build, `build:site` the `site/` GitHub Pages publishes. All JS fragments share one IIFE and call each other directly. See `docs/架构.md` for the file-by-file table.
- **Data is separate from code.** `data/wiki*.js` (entries, `window.WIKI`), `data/chapters.js` (index), `data/links.js` (relations), plus `ERAS`, `CATS`, `REGIONS`. Content edits touch `data/`, not `src/`.
- **Spaces.** The unit of the world is a *space* (`enterSpace(id)`): a planet, a region of the void, a dream, an underground world, a ship. Every named place in the novel is either a space or a located sub-place inside a space. Expanding the exhibition means adding spaces and filling them.
- **Layered src/:** core renderer & picking → fx → creatures → planet template → per-space content → entry models (`45_kit`, `46_ents`, `47_new`) → UI, reader, side stories, audio.
- **Tests:** Playwright + headless Chromium with a virtual clock; UI tests on desktop and phone layouts, then a walk through every space. `tests/audit.cjs` checks every entry is visible and unoccluded; `tests/perf5.cjs` / `trace1.cjs` measure frame cost.
- **Content tools** (need the private novel): `check_overlap.py`, `find_in_chapters.py`, `thin.mjs`.
- **Music.** Synthesised in the browser (Web Audio: FM / wavetable, synthesised-impulse reverb), no audio files, cheap enough never to touch §6. Each space has a theme, but the themes are related: one motif that evolves with the story — the eras of the timeline and the worlds 琳 reaches in sequence are variations of it, so the exhibition sounds like one story rather than unrelated loops. Music fades to near-silence or stops while the reader or library is open (as the frame-rate reductions already do for rendering). Crossfade on every space change. On phones, sound starts only after the first interaction (browser autoplay rules): default muted with a clear toggle; do not fight this.
- **Deployment:** GitHub Actions builds `site/` and publishes to GitHub Pages on every push to `main`.

## 6. Performance and smoothness

Hard rules; measure, don't guess.

- **Frame budget:** steady 60 fps on the author's desktop and the phone's native refresh, in every space, with the UI open or closed. Any single frame over 50 ms during normal use is a bug.
- **Transitions:** entering a space, jumping to an entry and returning to the void must not hitch. Known today: shader compilation happens in the ~1 s black screen when switching worlds — eliminate it (precompile, warm up materials during the idle time of the previous space, or keep one shared material set).
- **Loading:** first frame on a cold load within 3 s on the author's desktop; data for other spaces loads lazily or in idle time, never blocking.
- **Work scheduling:** anything that can take more than a few ms per frame (placement, occlusion search, texture painting, layout) is sliced across frames or done in idle time, as `docs/性能.md` already does for several systems. Keep that discipline for everything new.
- **Power:** keep the existing idle/panel frame-rate reductions; they must never cause a visible stall when activity resumes.
- **Measure rendering and placement changes** with `perf5.cjs` on the affected space only, before and after; record regressions in §10 if accepted, otherwise fix. Data-only changes are not measured.
- **Lightweight by construction:** no new large assets; procedural models from the kit; textures generated or tiny; the minified site stays small enough that a phone on mobile data opens it without waiting.

## 7. Constraints and rules

- Never commit `.txt` or any original prose. Run `check_overlap.py` before committing entry or side-story text.
- Every new entry has: name, category, world + coordinates, era, summary, body, chapter list; every new place is reachable, visible (`audit.cjs` passes) and in the library.
- Side stories follow `docs/番外写作指南.md` and are marked "不是原文".
- Mobile layout always works. Testing is tiered to keep the agent's time on content (see §7a).
- No gameplay; no accounts or server; no second renderer.
- Keep docs current: when `src/` structure or data fields change, `docs/架构.md` changes in the same commit.
- Commits are authored as the repository owner (Alex Wang <alex119122114@gmail.com>) with no AI co-author trailers; messages in English, saying what changed and why.

### 7a. Testing tiers

Testing exists to catch regressions, not to be the work. Three tiers:

- **Per change:** the quick suite (`npm run test:quick`) or the one test covering what changed. Data-only changes (`data/`) run `check_overlap.py` and nothing else. No audit, no perf, no screenshots.
- **Per task end and before every release:** the full suite (`npm test`, both layouts), `audit.cjs`, `perf5.cjs` compared with the baseline, and screenshots at the fixed viewpoints.
- **High-risk operations only** (folding patch layers, replacing a renderer-level system, upgrading three.js): screenshot comparison after each step.

Test and tool output must be summarised (failures and totals only); never paste whole logs into the working context.

## 8. Depth is layered

**Per space**
- L1 — enterable; correct overall form and layout; the major places and entries from the text present and placed; in the library and the map of spaces.
- L2 — every entry the text gives for this space, each with a model that reads as the thing; connections (`links.js`) between them; chapter links verified with `find_in_chapters.py`.
- L3 — life and motion: creatures and phenomena moving as described; ambient effects; the space's own sound.
- L4 — close-ups and side stories for its key moments; small located details the text mentions in passing.

**Per entry**
- L1 — exists, placed, summarised, chapter-linked.
- L2 — full body text from all its passages; related entries; a model instead of a generic shape.
- L3 — distinct model with recognisable detail; motion or behaviour if the thing moves.

**Visuals (only within §6)**
- L1 — clean stylised look, consistent lighting per space (current).
- L2 — better materials, atmosphere and sky per space; smoother creature motion.
- L3 — space-specific set pieces (storms, swarms, light shows) as the book describes, sliced so they stay smooth.

## 9. Decisions delegated to the implementing agent

Decide without asking, within the rules; record each in §10.

- **The patch layers.** `src/49c_fixA.js` … `49q_lean.js` are sequential overrides. Fold them into the files they patch, in small verified steps (full test suite + `audit.cjs` + before/after screenshots at fixed viewpoints per step), until no `fix*` layer remains and each behaviour lives in one place. Do this early (Phase 0); it is the main obstacle to everything after.
- **Three.js version.** Currently r128 from CDN. Upgrade only if it buys smoothness or a visual gain that matters, and only with the full test suite and screenshots passing; otherwise keep r128.
- **Build/structure.** Keep the concatenation scheme unless modules become clearly better for the agent's own understanding; a change must keep "no bundler, static hosting".
- Which spaces to add next and in what order (from the novel's importance), model designs, kit extensions, side-story topics.
- Any implementation detail not fixed here.

## 10. Decisions log

Append-only: date, decision, reason.

- 2026-10 — 绒球 visual-quality work moved out to its own repo. Reason: keep the 展览馆 lightweight and whole-book.
- 2026-10-26 — 展览馆 and 绒球世界 are independent: no shared code, data or links. Reason: different goals; coupling would constrain both.
- 2026-10-26 — The project is open-ended, not "complete after volume 8": keep adding spaces, entries, detail and side stories indefinitely. Reason: author's wish for ever more content.
- 2026-10-26 — Every place the novel describes, in the void and elsewhere, is to become enterable. Reason: the exhibition covers the whole universe of the book.
- 2026-10-26 — Smoothness is prioritised over visuals; zero stutter is a hard rule. Reason: author's instruction.
- 2026-10-26 — Technical debt is fixed as found; the patch layers are to be folded in Phase 0. Reason: author's instruction not to stack problems; the layers block understanding.
- 2026-10-26 — The novel is read search-first from `rongqiu-source`, with working notes kept there, to save tokens. Reason: 34 MB of text; cost.
- 2026-10-26 — This document is the brief for autonomous work; the agent decides §9 items itself.
- 2026-10-26 — One evolving motif across spaces and eras; music retreats when panels are open; muted by default on phones. Reason: coherence as an exhibition; smoothness and autoplay rules.
- 2026-10-26 — Patch layers folded: no file reassigns another file's function; an extension of a function is a named stage (`xBase` ← `q3_x` ← `x`) that calls the previous one; `SPEC`/`KIND`/`ENT` keys are written once. Layers that were whole subsystems (`49k_ground`, `49l_light`, `49n_soften`, `49o_nav`, `49p_stable`, `49z_eggs`) stay as modules under their subject; grab-bag layers (`fixA`…`fixH`, `q_models`, `fixesA`, `lean`) are dissolved into their homes. Reason: §9; one place per behaviour without a risky rewrite of working systems.
- 2026-10-26 — Refactors that must not change the picture are verified with `tests/fingerprint.cjs` (every model and every scene object, deterministic) and `tests/shots.cjs` (pixel comparison at fixed viewpoints). Reason: a 2 MB single scope cannot be checked by reading.
- 2026-10-26 — Every world has the same light layout (2 directional, 1 hemisphere, 2 pooled point lights, one fog kind per world type); missing lights are added dark; all point lights go through the pool (the underground's 17 and Midgard's 10 now light through the nearest two). Reason: shader programs are shared across worlds (new programs per switch 18–49 → 1–9); small lighting change accepted.
- 2026-10-26 — No world is built ahead of time; a first visit builds under the loading cover. Reason: a build is a 0.3–2 s block of script with no invisible moment to run it (it froze the library and reader, or the picture).
- 2026-10-26 — No git tags or GitHub releases; versions live in `CHANGELOG.md` only. Reason: the agent cannot push tags and the author wants no manual step.
- 2026-10-26 — Entries are shareable by link (`#e=id`). Reason: DESIGN listed sharing as an interaction; it did not exist.
- 2026-10-26 — Scenery sets on a planet are culled against the view (and the shadow box's column along the sun) just before each frame and restored after it, rather than by three.js (which cannot cull instanced sets). Creatures under a few pixels and far open-space entries under 1.5 px are not drawn. Reason: §6; a meadow drew 1,500 calls and 6 M triangles a frame, and the shadow map redrew most of it every other frame.
- 2026-10-26 — The quality step drops on dropped frames (over 10 % of frames above 26 ms) or under 52 fps, not only under 42 fps. Reason: §6 asks for steady 60; a steady 45 judders and never triggered a step.
- 2026-10-26 — Phase 2 entries for a place reuse the existing kinds of space (an entry with a model in its space) rather than new spaces; a place becomes its own space only when the book spends long inside it. Reason: L1 first for every place (§11 Phase 2), most important first.
- 2026-10-26 — The ~60 "minor" places of the coverage index (a handful of mentions in a few chapters each: 盐湖, 花海, 镜坑平原 …) are not given entries of their own; each is folded into the entry it belongs to when that entry is brought to L2 in Phase 3. Phase 2 counts as done once every verified-missing place is enterable. Reason: an entry per passing mention would add clutter, not faithfulness; the parent entry is where a reader looks for it.
- 2026-10-26 — Parts of far models under a pixel in radius are not drawn (listed once per model, biggest first). Reason: §6; open spaces drew hundreds of calls for eyes and claws a few pixels wide.
- 2026-10-26 — The coverage index finds place names by their endings plus quoted names that are travelled to, cross-checked with the 绒球 encyclopedia index, and is curated by hand: each candidate gets a status in `rongqiu-source/exhibition/review.json` (missing, minor, covered inside another entry, not a place). "Minor" (a real place with a handful of mentions in a few chapters) is not a Phase 2 item; it can join an existing entry later. Reason: a raw suffix list is mostly phrases; Phase 2 needs a list of real places in order.
- 2026-10-27 — Phase 3 bodies for entries without encyclopedia notes are drafted in parallel by helper agents from a fixed brief (search-first windows, paraphrase only), each draft checked by a script for verbatim runs of 12+ characters, chapter titles that do not resolve, and unknown related ids, then read over before it is merged. Reason: 340+ thin entries; one at a time would take weeks, and the checks keep the legal rule and the chapter links mechanical.
- 2026-10-27 — A far LOD for the tree stands (coarse copy past ~150 units, per tree in the vertex shader) was tried and dropped: the shader-window approach still sends every vertex, the arrival view got heavier, and triangle counts barely moved. A real gain needs instances re-sorted on the CPU by distance; not worth its risk to the cutaway now.
- 2026-10-27 — What does work is the coarser copy per whole stand, switched on the CPU when the stand's nearest edge is far (arrival view 2.15 M → 1.24 M triangles); kept.

## 11. Roadmap and status

The implementing agent updates this section at the end of every session. Phases run in order; within a phase, order is the agent's choice. A phase is done when its items are built, pass the release-tier checks of §7a, are pushed, and the live site works on desktop and phone.

**Done**
- Spaces: 绒球, 虚空, 梦境岛, 虚民母球, 尔什, 地下世界 and others; entries with models, chapter links, library, search, timeline, share.
- Reader for the user's own txt; side stories; per-space audio; desktop and phone UI.
- Playwright suite; audit and perf tools; content-check tools; Pages deployment.
- `DESIGN.md` (this brief), 2026-10-26.

**Phase 0 — Debt and smoothness baseline**
- ✅ Fold the patch layers (2026-10-26): no `fix*` layer remains, no function is reassigned across files; `docs/架构.md` updated. Fingerprint and screenshots identical before/after.
- ✅ Baseline: `tests/baseline/perf.json` (perf5 per space); fixed viewpoints in `tests/viewpoints.json` (`tests/shots.cjs`); `tests/fingerprint.cjs`. (Screenshots are not stored in the repo: regenerate from a tagged build.)
- ✅ (2026-10-26) Frame weight: `tests/calls.cjs` counts draw calls and triangles; view and shadow culling of scenery sets, speck culling of creatures and far entries (meadow 1,900 → 874 calls, 8.9 M → 3.8 M triangles a frame; no heavy shadow frames). Quality steps react to dropped frames. Not yet: a far LOD for tree stands (a 1,256-triangle tree drawn hundreds of metres away), merging an entry model's static parts (the void still draws ~800 calls).
- ◐ World-switch hitch: programs shared across worlds (1–9 new per switch after the first planet / non-planet visit); fade-in waits for warm-up frames; no prebuild stalls. Still open: a first visit to a world builds and compiles under the loading cover (1–2 s). Next ideas: async program linking (KHR_parallel_shader_compile; three r128 links synchronously in `getProgram`), slicing the builders.
- ✅ Interaction path walked on desktop and phone (`tests/path.cjs`): library/reader stalls removed, first jumps cheap; sharing added.
- ✅ Audit (`tests/baseline/audit.json`): 113 of 767 entries failed before Phase 0, 23 now (4 of them whole planets seen from orbit, as intended). Fixed: the moon view swallowed jumps; the clear-view search tested the wrong ray, so entries ended behind towers and trunks; poses that could not centre the entry were chosen. Left: 5 fast fliers off-screen, 11 with something in the way, 3 under the card.
- `CHANGELOG.md` has v1.1.
- Phase 1 needs read access to `rongqiu-source`: granted by the author for every session (add the repo when a session needs it).

**Phase 1 — Coverage index**
- Using the novel (search-first) and the existing entries, build `rongqiu-source/exhibition/coverage.md`: every named place in the book, which space it belongs to (or needs), whether it is enterable, which entries exist for it, and which are missing or thin (`thin.mjs`). Rank missing content by importance.
- ✅ (2026-10-26) `coverage.md` built by `tools/coverage.py` (with `REVIEW=`): 713 recurring place names; 135 have an entry, the other 578 reviewed by hand (`tools/ctx.py`, `tools/whohas.py`) — 68 verified missing, ranked, each with its space; 45 covered inside another entry; 54 minor; 411 not places. Plus thin place entries ranked by how much the book discusses them. Biggest gaps: 立蝎 pyramids (绒球), 漂泊号 (虚空, big enough for its own space), 气态星 and 奇迹之星 (凝固虚空), 梦境空间, 神民之国, 幻想空间, 混沌空间, 制造塔. A few rows still say "check against …": settle them as Phase 2 reaches them.

**Phase 2 — Every place enterable**
- Add the missing spaces and sub-places from the index to L1, most important first, until every named place can be entered.
- ✅ (2026-10-26) Every place on the verified-missing list now has an entry with a model, text and chapters (or turned out, on a second look, to be covered under another name — `review.json` says which): 漂泊号, 虚空冰山, 混沌空间, 监测站, 西格玛海滩, 边缘之星, 畸变之星 (void); 奇迹之星, 信号塔, 稳定大陆, 监狱塔 (frozen void); 制造塔 (不可预见之地); 金字塔, 珊瑚礁, 云岛, 灰烬之岛 (绒球 and its moon); 监狱之岛 (虚民母球). Audit after them: 22 flagged of 784 (baseline 23 of 767), none of them new. Phase 2 done by the rule in §10: the 60-odd "minor" places in `coverage.md` go into their parent entries during Phase 3.

**Phase 3 — Entries to L2**
- All entries to Entry L2; all spaces to Space L2; `links.js` relations filled; chapter links verified.
- 🔶 (2026-10-26) 绒球: every entry with an encyclopedia note in the source repo (73 notes, five of them filed under another id: naodaichong→naodai, yilong_pt→yilong, jingshu→crystalwood, jueshu→ud_fern, mingshidao→isles) is rewritten to L2 — body text from all its passages, eras, related entries, chapters checked to resolve. Minor places folded into their parents as reached. Next: the other spaces' thin entries (no notes there; research from the text, search-first).
- 🔶 (2026-10-27) Other spaces: 145 of the thinnest entries with the most mentions in the text (void, frozen void, Midgard, dream, tunnel, 不可预见之地, plus 绒球's remaining units and people) rewritten to L2 from the text, several old errors corrected on the way. About 340 entries are still under 260 characters; most are minor, worked through in order of how much the book says about them.
- 🔶 (2026-10-27) Every entry now has at least 260 characters of body text drawn from all its passages (about 560 rewritten in Phase 3, Lin's own entry among them), each checked for verbatim runs, chapter titles and related ids; old errors found on the way were corrected. Left for Phase 3: the 175 bodies still under 400 characters where the book says more, the event entries, and Space L2 (models and links per space).
- 🔶 (2026-10-27) Every entry body is now at least 400 characters unless the book says no more (those are listed in `tools/thin_skip.txt`); the 22 event entries are told in full; the central subjects (琳, 尔什, the void, the 虚民, the creator, the scholar …) run to 1,300–2,500 characters. Left for Phase 3: Space L2 — a model that reads as the thing for every entry still on a generic shape, and the relations in `links.js` checked per space.

- ✅ (2026-10-27) Phase 3 done: every entry has its body from all its passages (≥ 400 characters unless the book says less), its chapters resolving to real chapter titles, at least three related entries (seven exceptions with only one or two real ties), and a place and a model in its space — the last seven without one (two in the void, five on 绒球) were given them. Space L2 holds for every space by this measure.

**Phase 4 — Life, visuals, side stories**
- Spaces to L3; Visuals L2; side stories for the key moments of each space (Space L4 begins).

- 🔶 (2026-10-27) Phase 4 begun: every entry has at least one side story (the seventeen Phase 2 places got theirs); every creature or character model without motion of its own now breathes and turns a little (a fallback, not a substitute for the motions the book describes).

**Phase 5 onward — Keep going**
- No final state. Loop: find what the book describes that is still missing, thin or shallower than its text (new entries, places, details, side stories, motion), add it, test it, release it. Prefer the item adding the most faithfulness and richness per unit of work; keep §6 green at all times. Stop only when the author says so.

## 12. Releases

Every push to `main` deploys to GitHub Pages; that is the release. Whenever a meaningful chunk is done — a phase, a new space, a tier of entries, a visible smoothness or visual gain — add a version to `CHANGELOG.md` (`vMAJOR.MINOR`, newest first), in plain language a reader of the novel would understand (what they can now visit or read), not a list of commits. No git tags or GitHub releases: the agent's session cannot push them and the author does not want a manual step.
- Never push a version with a failing test, a failing audit, a perf regression or a known interaction bug; fix first.
