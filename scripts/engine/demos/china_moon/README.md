# 中国登月计划 · 原生动画演示

此示例是在 **huashu-art-motion 的现有口播片段引擎** 上增加的场景，**不是另起一个独立动画引擎**。

## 目录

- `../../clips/china_moon.js`：自定义语法 `CLIPS.china_moon`，复用原项目的 `U`、`MO`、`TY`
- `../../examples/china_moon_2026.json`：时长 52 秒的八镜头时间轴
- `index.html`：使用 `../../clip.html` 的网页播放器，自动播放 / 暂停 / 拖动 / 分镜跳转
- `validate.py`：独立检查 spec 结构、分镜是否覆盖 0—52 秒
- 原生输出链路：`scripts/engine/render.py --spec ...`
- 原生数字质检：`scripts/qa.py --spec ...`

## 本地预览

在仓库根目录执行：

```sh
python3 -m http.server 8000
```

访问：

```text
http://localhost:8000/scripts/engine/demos/china_moon/
```

也可以直接看原生时间轴控件：

```text
http://localhost:8000/scripts/engine/clip.html?spec=examples/china_moon_2026.json
```

> 不要双击本地 HTML 用 `file://` 打开：原生 `clip.js` 会请求 spec / 语法文件 / 字体资源，需要 HTTP 服务。

## 原项目渲染 MP4

系统先安装 `uv`、`ffmpeg`、Playwright Chromium：

```sh
uv run --with playwright playwright install chromium
uv run --with playwright python scripts/engine/render.py \
  --spec scripts/engine/examples/china_moon_2026.json \
  --out 中国登月计划_原生版.mp4
```

渲染前抽帧确认（截图位于目录）：

```sh
uv run --with playwright python scripts/engine/render.py \
  --spec scripts/engine/examples/china_moon_2026.json \
  --stills 1,8,15,22,29,36,43,49 \
  --out moon-stills
```

执行原项目 QA（检查确定性、运动面积、跳帧、文字框景）：

```sh
uv run scripts/qa.py \
  --spec scripts/engine/examples/china_moon_2026.json \
  --out moon-qa
```

```sh
python3 scripts/engine/demos/china_moon/validate.py
```

## 内容口径

- 2007 嫦娥一号绕月；2013 嫦娥三号软着陆；2020 嫦娥五号正面采样返回；2024 嫦娥六号首次实现月球背面采样返回
- 嫦娥六号带回 **1935.3 克** 月球样品
- 2026-08-23 国家航天局披露：嫦娥七号任务不满足发射条件，不能在 2026 年原定发射窗口实施；视频不将其表现为成功发射
- 嫦娥八号此前规划于 **2028 年前后** 开展月球资源原位利用等试验，时间属于计划不是既成事实
- 载人登月 **2030 年前** 为工程目标，长征十号、梦舟、揽月正在研制和验证，尚不能表现为已经登月
- 动画轨道、火箭和航天器均属 **科普示意**，并非轨道动力学仿真或外形精确复刻

来源：

1. 国家航天局《嫦娥七号任务不满足发射条件，不能在今年预定窗口实施》（2026-08-23）https://www.cnsa.gov.cn/n6758823/index.html
2. 中国载人航天工程办公室《2026年中国载人航天工程将深化推进空间站应用与发展和载人月球探测两大任务》（2026-02-27）https://statistics.cmse.gov.cn/xwzx/202602/t20260227_57278.html
3. 国家航天局《嫦娥八号国际合作机遇公告》（2023-10-02）https://www.cnsa.gov.cn/n6758823/n6758838/c10392100/content.html
4. 中国载人航天工程办公室《工程简介》https://statistics.cmse.gov.cn/gygc/gcjj/

资料核对：2026-10-09。

## 版权说明

新增场景为纯程序化绘画，不调用原仓库中仅供演示的花叔肖像、帧库或其他受限素材。代码遵守原仓库 MIT 许可。
