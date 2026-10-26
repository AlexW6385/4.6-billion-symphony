# Changelog

What changed for visitors of the exhibition, newest first.

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
