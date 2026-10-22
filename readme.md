# picture.xpi 项目说明

这是一个 **Firefox 浏览器扩展**（`.xpi` 就是 Firefox 的安装包，解压后就是本目录）。

## 一句话说明它干什么

让「广东教育考试相关网站」在需要拍照上传时，可以改成 **从图库选照片**，而不是只能用摄像头拍照。

目标网站主要是：

- `www.eeagd.edu.cn`（广东教育考试院相关页面）
- `pg.eeagd.edu.cn`（页面里嵌套的 iframe）

扩展显示名称：`让网站支持从图库上传图片`（版本 3.2）

---

## 项目结构

```
picture/
├── manifest.json          # 扩展“身份证”：名称、权限、要加载哪些脚本
├── background.html        # 后台页（旧写法，实际以 manifest 里的 scripts 为准）
├── msg.js                 # 残留脚本：检测页面里的视频位置（当前未在 manifest 中启用）
├── images/
│   └── icon128.png        # 扩展图标
├── js/
│   ├── inite.js           # 初始化本地存储（媒体类型等，像是旧功能残留）
│   ├── background.js      # 核心逻辑：改 JS、改跳转、改 UA
│   └── ua-page.js         # 在网页里伪装成支付宝 App 的浏览器
└── META-INF/              # Firefox 签名文件（安装时校验用，一般不用改）
```

---

## 它具体做了哪几件事

### 1. 伪装成「支付宝 App 里的浏览器」

网站有时会检测：是不是支付宝打开的。

本扩展用两种方式伪装：

| 方式 | 文件 | 作用 |
|------|------|------|
| 改网络请求头 | `background.js` | 访问 `www.eeagd.edu.cn` 时，把 User-Agent 改成支付宝客户端 |
| 改网页里的 JS 属性 | `ua-page.js` | 让页面读到的 `navigator.userAgent` 也是支付宝 UA |

这样页面更容易走「支付宝 H5」那套流程。

### 2. 把 iframe 跳转到支付宝 H5 页面

当父页面是 `pg.eeagd.edu.cn`，且 iframe 要打开：

`www.eeagd.edu.cn/h5cjewmzz?...`

扩展会把它重定向到：

`www.eeagd.edu.cn/h5alipay/pages/index/index?...&rkType=2`

并保留原来的 `token`、`timestamp` 参数。

### 3. 拦截网页 JS，把「拍照」改成「选图」

这是本扩展最核心的功能。

它会监听地址里包含：

`www.eeagd.edu.cn/h5alipay/static/js/`

的脚本请求，在浏览器把 JS 交给网页之前，先改内容：

1. 把 `this.handleStart()` 改成 `this._handleStart()`（避免原逻辑直接跑起来）
2. 把 `navigator.mediaDevices.getUserMedia`（调摄像头）换成一段「从图库选图」的代码（`uni.chooseImage`），选完后转成 base64，再继续原来的下一步

简单说：**原来要开摄像头拍照 → 现在弹图库选照片。**

---

## 权限说明（manifest.json）

扩展申请了较多权限，常见用途如下：

| 权限 | 用途 |
|------|------|
| `webRequest` / `webRequestBlocking` | 拦截请求、改 JS、改跳转、改 UA |
| `tabs` | 操作标签页 |
| `*://*/*` / `<all_urls>` | 可作用于较广范围的网址（实际逻辑主要盯 eeagd） |
| `downloads` | 下载相关（更像旧功能残留） |
| `nativeMessaging` 等 | 和本地程序通信（`msg.js` 里有用到，当前未挂进主流程） |

---

## 重要文件怎么读

### `manifest.json`

告诉 Firefox：

- 扩展叫什么、版本多少
- 后台加载 `inite.js` + `background.js`
- 在 `www.eeagd.edu.cn` 注入 `ua-page.js`
- 需要哪些权限

### `js/background.js`（核心）

包含：

1. **响应体过滤** `listener`：改网站返回的 JS
2. **替换规则** `jsreplace`：匹配哪个 URL、替换哪些字符串
3. **iframe 重定向**：`h5cjewmzz` → `h5alipay`
4. **请求头 UA 伪装**：假装支付宝

注意：这个文件里有一段逻辑写了两遍（`listener`、`doinject` 重复定义），属于代码冗余，不影响理解「它想干什么」。

### `js/ua-page.js`

在页面主世界里覆盖 `navigator.userAgent`，让网页 JS 也看到支付宝 UA。

### `js/inite.js` / `msg.js`

像是从「媒体嗅探 / 下载类扩展」留下来的旧代码（视频格式列表、查 video/iframe 位置），**当前主功能不依赖它们完成选图上传**。

---

## 怎么理解使用场景（给非程序员）

1. 你打开考试相关网页，页面里嵌了一个需要「支付宝环境」的上传页。
2. 扩展把这个嵌套页引导到支付宝 H5 流程，并伪装成支付宝打开。
3. 上传页原本要调用摄像头；扩展改掉网页脚本，改成从图库选图。
4. 选中的图片转成 base64，按原流程继续提交。

---

## 已知问题 / 可改进点

1. **`background.js` 代码重复**：`listener`、`doinject` 定义了两次，可清理。
2. **`background.html` 引用了不存在的 `js/bookmarks.js`**：且 manifest 已直接加载脚本，这个 html 可能已过时。
3. **`inite.js`、`msg.js` 偏残留**：和「选图上传」主目标关系不大，容易让人困惑。
4. **权限偏大**：实际只服务 eeagd 相关站点，但声明了很宽的网址权限。
5. **强依赖具体页面脚本**：网站一旦改版（JS 路径或函数名变了），替换规则可能失效，需要同步更新 `jsreplace`。

---

## 如何安装（参考）

1. 用 Firefox 打开 `about:debugging`
2. 选择「临时载入附加组件」
3. 选中本目录下的 `manifest.json`

（正式安装一般使用带签名的 `.xpi`；解压目录适合调试。）

---

## 更新记录

- 2026-10-12：新增本说明文档，梳理 XPI 解压后的功能、结构和注意事项。
