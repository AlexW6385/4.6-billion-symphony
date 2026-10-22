# 进化的四十六亿重奏 · 3D 展览馆

一个关于小说《进化的四十六亿重奏》的同人 3D 互动展览馆：绒球、虚空、虚民母球、尔什……琳去过的地方都可以飞过去看看。每个发光的小点都是一个词条，点开有简介、相关词条和原著章节；图书馆里能按分类、故事线和章节找；还有几百篇挂在各地的小番外。

**在线访问：** https://alexw6385.github.io/4.6-billion-symphony/

## 版权说明

- 这是读者做的非官方同人项目，与作者、起点中文网无关。原著版权归作者与起点中文网所有。
- **仓库和页面里不包含原文。** 词条和介绍都是用自己的话概括的，`chapters.js` 里只有卷名、章序和章名。`tools/check_overlap.py` 用来检查有没有和原文连续 12 字相同的地方。
- 番外是新写的小故事，页面上会标明“不是原文”。
- 阅读器可以载入读者自己的 txt，文件只在本机浏览器里读取和保存，不会上传。
- 请不要往仓库里提交原文（`.gitignore` 已经排除了 `novel.txt` 和所有 `.txt`）。

## 本地运行

需要 Node.js 18+。

```bash
npm install
npm run serve        # 构建 site/ 并打开 http://localhost:8080
```

## 构建

```bash
npm run build        # dist/：页面片段 + 数据，未压缩
npm run build:min    # dist/：压缩版
npm run build:site   # site/：完整的 HTML 文档（压缩），GitHub Pages 用的就是它
```

页面由 `src/` 里的文件按 `scripts/order.txt` 的顺序拼成一个 `index.html`，数据（`data/`）作为单独的脚本放在旁边。结构说明见 [docs/架构.md](docs/架构.md)。

## 测试

```bash
npx playwright install chromium   # 第一次需要
npm test                          # 桌面端 + 手机端界面测试，再把每个世界走一遍
npm run test:quick                # 只跑桌面端
```

测试用 Playwright 驱动无头 Chromium（软件 WebGL），用虚拟时钟让动画可重复。可选环境变量：

- `CHROMIUM_PATH`：用指定的 Chromium。
- `NOVEL_TXT`：阅读器“载入 txt”测试用的文件。不设的话会生成一份只有章名和占位文字的假文件（`tests/fixtures/`，不提交）。

`tests/` 里还有几个调试脚本：`audit.cjs`（逐个检查词条在画面里是否可见）、`perf5.cjs`（每帧耗时）、`trace1.cjs`（性能采样）、`probe.cjs`。见 [docs/性能.md](docs/性能.md)。

## 内容工具

这些工具需要你自己的一份原文（`NOVEL=/path/to/novel.txt`，或放在仓库根目录的 `novel.txt`，已被忽略）：

```bash
python3 tools/check_overlap.py             # 词条和番外里有没有和原文连续 12 字相同的句子
python3 tools/find_in_chapters.py <id>...  # 在词条标注的章节里找它的名字，核对章节对不对
node tools/thin.mjs 20                     # 简介最短的 20 个词条
```

番外的写法见 [docs/番外写作指南.md](docs/番外写作指南.md)。

## 目录

```
src/        页面源码（按 scripts/order.txt 拼接）
data/       词条、章节索引、连线
scripts/    构建与本地服务
tests/      Playwright 测试和调试脚本
tools/      内容检查工具
docs/       说明文档
```

## 许可

- 代码：[MIT](LICENSE)。
- 词条文字、番外等原创内容：[CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/deed.zh-hans)（署名、非商业）。
- 这两项许可只针对本项目自己写的部分，不涉及原著。
