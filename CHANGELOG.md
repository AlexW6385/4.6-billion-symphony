# Changelog

What changed for visitors of the exhibition, newest first.

## v1.3 — 2026-10-26 · Six more places

- **New places to visit:** 西格玛海滩 (the 虚民's luxury space station), 边缘之星 (the world at the edge of 绒球's star system where the 印加 found the creators' threads), 畸变之星 (the flesh world made to fight 扭曲), 监狱塔 (the tower Lin built for the birds in the frozen void), 灰烬之岛 on the moon, and 监狱之岛 · 无尽囚笼, the storm-bound prison island of 虚民母球.
- With these, every place the book names often enough to matter can now be visited, or is part of an entry that covers it.

## v1.2 — 2026-10-26 · Lighter frames, eleven new places

- **Smoother on 绒球 and in the void.** The exhibition used to draw a lot that was off screen: every stand of trees and town on the visible side of the planet, behind you included, and every other frame the shadows drew most of it a second time — so frames alternated between light and heavy and the picture juddered. Now what is out of view is skipped (unless it could cast a shadow into view), creatures too far away to be more than a speck are skipped, and so are far entries in the void that would be smaller than a pixel. On a meadow a frame now draws less than half of what it did.
- **Quality adjusts sooner.** If frames keep arriving late (more than one in ten), the picture steps its detail down instead of juddering at 45 fps; it steps back up when frames are on time again.
- **Jumps don't jerk.** When the camera finds a better view while it is already flying, it bends its path smoothly instead of jumping.
- **New places to visit:** 漂泊号 (the 虚民 disc fortress, in the void by 虚民星系), 虚空冰山 (the living iceberg), 混沌空间 (the gathering point where the chaos flickers), 监测站 (the 尔什民 checkpoint), and in the frozen void 奇迹之星, the phoenixes' 信号塔 and 稳定大陆, the land that never changes shape; in 不可预见之地 the 制造塔 that makes bodies for those who enter; on 绒球 the 立蝎's 金字塔 in the southern jungle, the 珊瑚礁 piled up like mountain ranges, and the cloud creators' 云岛 over the cloud sea.

## v1.1 — 2026-10-26 · Smoother

- **Share an entry.** Every entry card has a "分享这个词条" link: on a phone it opens the system share sheet, elsewhere it copies a link. Opening that link lands directly on the entry.
- **Moving between worlds is quicker.** After you have visited one planet and one of the other worlds, going to the next world needs only a handful of new shaders instead of dozens, so the dark moment between worlds is shorter. The fade into a new world no longer stops half-way.
- **No more freezes behind the library and the reader.** The exhibition used to build the next world in the background while one of them was open, which froze scrolling for a second or more. It no longer does.
- **Jumping to an entry shows it.** The camera used to land with the entry behind a tower, a trunk or a hill far more often than it should (a mistake in how it checked its line of sight), or stay on the moon after visiting it. Now 744 of 767 entries are framed in the open after a jump (before: 654).
- **Jumps start instantly.** The camera sets off at once and finds its best view while flying, instead of thinking first; the first jump in a world is also faster.
- The underground and Midgard are now lit like every other world: the lights nearest to you shine, so the tunnels look nearly the same and draw faster.
- Under the hood: all the old patch layers are folded into the code they changed, so new worlds and entries can be added without fighting them.

## v1.0

- The exhibition as it stood before this brief: 绒球, 虚空, 梦境岛, 虚民母球, 尔什, 地下世界, 米德加尔特, 白色通道 and 不可预见之地 to fly through; entries with models, chapter links, library, search, timeline, the reader for your own copy of the novel, side stories and per-world music.
