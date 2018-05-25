{{ target: mip-index(master = mip-layout) }}

{{ block: style }}
{{ /block }}

{{ block: script }}{{ /block }}

{{ block: content }}

<div id="container" class="index-page-wrapper app-view">
    <div class="section-slogan">
        <h1 class="slogan-title">LAVAS</h1>
        <div class="slogan-desc-wrapper wd-md-show wd-lg-show">
            <h3 class="slogan-desc">基于 Vue.js 的 PWA 解决方案</h3>
            <h3 class="slogan-desc">帮助开发者快速搭建 PWA 应用，解决接入 PWA 的各种问题</h3>
        </div>
        <div class="slogan-desc-wrapper wd-xs-show wd-sm-show">
            <h3 class="slogan-desc">基于 Vue.js 的 PWA 解决方案，帮助开发者快速搭建 PWA 应用，解决接入 PWA 的各种问题</h3>
        </div>
        <div class="btn-wrapper">
            <a class="btn-startup"
                href="/guide"
            ><i class="fa fa-paper-plane" aria-hidden="true"></i>起步</a>
            <a class="btn-github"
                href="https://www.github.com/lavas-project"
                target="_blank"
            ><i aria-hidden="true" class="fa icon fa-github"></i>Github</a>
        </div>
    </div>
    <div class="section-feature">
        <div class="section-feature-mask">
            <div class="section-feature-inner">
                <div class="feature-wrapper">
                    <div class="icon-wrapper">
                        <svg class="feature-icon" width="200px" height="200px" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path fill="#333333" d="M853.333333 490.666667h-64v-170.666667c0-46.933333-38.4-85.333333-85.333333-85.333333h-170.666667V170.666667c0-59.733333-46.933333-106.666667-106.666666-106.666667S320 110.933333 320 170.666667v64h-170.666667c-46.933333 0-85.333333 38.4-85.333333 85.333333v162.133333H128c64 0 115.2 51.2 115.2 115.2S192 712.533333 128 712.533333H64v162.133334c0 46.933333 38.4 85.333333 85.333333 85.333333h162.133334V896c0-64 51.2-115.2 115.2-115.2s115.2 51.2 115.2 115.2v64h162.133333c46.933333 0 85.333333-38.4 85.333333-85.333333v-170.666667H853.333333c59.733333 0 106.666667-46.933333 106.666667-106.666667s-46.933333-106.666667-106.666667-106.666666z" /></svg>
                    </div>
                    <h3 class="feature-title">完善的前端开发框架</h3>
                </div>
                <div class="feature-wrapper">
                    <div class="icon-wrapper">
                        <svg class="feature-icon" width="200px" height="200px" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path fill="#333333" d="M320 128l-64 64v128L128 448v192L0 768v192h704l64-64V768H64l128-128h640l64-64V448H192l128-128h640l64-64V128z" /></svg>
                    </div>
                    <h3 class="feature-title">自动化站点 PWA 实现</h3>
                </div>
                <div class="feature-wrapper">
                    <div class="icon-wrapper">
                        <svg class="feature-icon" width="200px" height="200px" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path fill="#333333" d="M738.5088 1023.83616H285.4912c-66.68288 0-120.75008-57.30304-120.75008-127.95904V128.12288c0-70.69696 54.0672-127.95904 120.79104-127.95904h452.93568c66.7648 0 120.832 57.26208 120.832 127.95904v767.75424c0 70.656-54.0672 127.95904-120.832 127.95904z m60.37504-895.71328c0-35.34848-27.0336-63.97952-60.416-63.97952H285.53216c-33.3824 0-60.416 28.672-60.416 63.97952v31.9488h573.76768v-31.9488z m0 95.96928H225.11616v511.83616h573.76768V224.09216z m0 575.81568H225.11616v95.96928c0 35.34848 27.0336 63.97952 60.416 63.97952h452.93568c33.3824 0 60.416-28.672 60.416-63.97952V799.9488zM512 927.86688c-24.9856 0-45.30176-21.504-45.30176-47.96416 0-26.50112 20.2752-48.00512 45.30176-48.00512 24.9856 0 45.30176 21.504 45.30176 48.00512 0 26.50112-20.2752 47.96416-45.30176 47.96416z" /></svg>
                    </div>
                    <h3 class="feature-title">Lavas App 支持</h3>
                </div>
            </div>
        </div>
    </div>
    <div class="section-cli">
        <div class="section-cli-inner">
            <div class="cli-wrapper">
                <h1 class="cli-title">Lavas CLI</h1>
                <p class="cli-desc">通过 Lavas 命令行工具，可以快速构建出 PWA 项目框架。框架所提供的功能基本涵盖了 Web App 大多数应用场景，包括服务端渲染（SSR）、单页应用（SPA）、多页应用（MPA）等等，并且能够在构建项目时自动生成 manifest.json、Service Worker 等文件，使站点具有 PWA 功能。</p>
                <p class="cli-desc">我们提供了一系列教程来帮助您快速上手 Lavas，您可以根据 Codelab 按步骤学习框架的使用，也可以通过阅读 Lavas 相关的技术文档，深入理解 Lavas 是怎么运作的。</p>
                <div class="btn-wrapper">
                    <a class="btn-codelab" href="/codelab"><i class="fa fa-book" aria-hidden="true"></i>Codelab</a>
                    <a class="btn-guide"
                        href="/guide" target="_blank"
                    ><i class="fa fa-tablet" aria-hidden="true"></i>教程</a>
                </div>
            </div>
            <div class="shell-typed-wrapper">
                <div class="typed-title">
                    <span class="bash-btn bash-close"></span>
                    <span class="bash-btn bash-small"></span>
                    <span class="bash-btn bash-full"></span>
                </div>
                <div class="typed-content"><div class="typed-content-in">
                    <span class="hljs-string">~</span> <span class="hljs-meta">$</span> <span class="hljs-built_in">npm</span> install -g <span class="hljs-keyword">lavas</span>
                    <br>
                    <span class="hljs-meta">-- lavas@2.2.3</span>
                    <br>
                    <span class="hljs-string">~</span> <span class="hljs-meta">$</span> <span class="hljs-keyword">lavas</span> init
                    <br>
                    LAVAS <span class="hljs-attr">INFO</span> 欢迎使用 Lavas 解决方案
                    <br>
                    LAVAS <span class="hljs-attr">INFO</span> 开始新建一个 Lavas PWA 项目
                    <br>
                    <span class="hljs-attr">?</span> 选择一个模版类型（<span class="hljs-attr">按上下键选择</span>）：
                    <br>
                    <span class="hljs-literal">> Basic</span>
                    <br>
                    <span class="hljs-literal">&nbsp;&nbsp;&nbsp;&nbsp;lavas 基础模板，包含 PWA 工程化相关必需内容</span>
                    <br>
                    AppShell
                    <br>
                    <span class="hljs-meta">&nbsp;&nbsp;&nbsp;&nbsp;lavas appShell 模板，包含 PWA 工程化以及基础 UI 相关必需内容</span>
                    <br>
                    正在拉取云端数据，请稍候...
                    <br>
                    <span class="hljs-attr">? </span><span class="hljs-meta">请输入项目名称：(pwa-project)</span> test
                    <br>
                    <span class="hljs-attr">? </span><span class="hljs-meta">请输入项目作者：(xxx)</span> my-name
                    <br>
                    <span class="hljs-attr">? </span><span class="hljs-meta">请输入email：(xxx@xxx.xxx)</span> my-name@baidu.com
                    <br>
                    <span class="hljs-attr">? </span><span class="hljs-meta">请输入项目描述：(这是一个 Lavas PWA 项目)</span>
                    <br>
                    LAVAS <span class="hljs-attr">INFO</span> 正在导出工程...
                    <br>
                    LAVAS <span class="hljs-attr">INFO</span> 项目已创建成功！
                    <br>
                    LAVAS <span class="hljs-attr">INFO</span> 您可以操作如下命令快速开始开发 Lavas 工程
                    <br>
                    <br>
                    <span class="hljs-attr">cd test</span>
                    <br>
                    <span class="hljs-attr">npm install</span>
                    <br>
                    <span class="hljs-attr">lavas dev</span>
                </div></div>
            </div>
        </div>
    </div>
    <div class="section-lavas-app">
        <div class="content-wrapper">
            <div class="content-inner">
                <div class="lavas-app-content">
                    <h1 class="lavas-app-title">Lavas App</h1>
                    <p class="lavas-app-desc">对于使用 Lavas 解决方案构建的站点，我们提供了一套在线应用打包平台，能够快速将您的 web 站点打包成原生应用，实现多端开发。</p>
                    <div class="btn-wrapper">
                        <a class="btn-app" href="/app"><i class="fa fa-book" aria-hidden="true"></i>Lavas App</a>
                    </div>
                </div>
            </div>
        </div>
        <div class="section-inner">
            <div class="lavas-app-screen">
                <div class="a ui-dep-1"><div class="img"></div></div>
                <div class="b ui-dep-3"><div class="img"></div></div>
                <div class="c ui-dep-5"><div class="img"></div></div>
            </div>
        </div>
    </div>
    <div class="section-us-show">
        <div class="us-inner-wrapper">
            <h1>关注我们</h1>
            <div class="us-desc wd-sm-show wd-md-show wd-lg-show">
                <h3>可以通过以下渠道，及时与我们交流 Lavas 动态</h3>
                <h3>Lavas 官方 QQ 群， 群号：655433298</h3>
            </div>
            <div class="us-desc wd-xs-show">
                <h3>Lavas 官方 QQ 群</h3>
                <h3>群号：655433298</h3>
            </div>
            <div class="us-qrcode"><div class="img"></div></div>
            <div class="btn-wrapper">
                <a class="contact-item btn-github" href="https://www.github.com/lavas-project"><i aria-hidden="true" class="fa icon fa-github"></i>Github</a>
                <a class="contact-item btn-email" href="mailto:lavas@baidu.com"><i class="fa fa-envelope" aria-hidden="true"></i> lavas@baidu.com</a>
            </div>
        </div>
    </div>
</div>

{{ /block }}

{{ block: footer }}

<div id="footer-wrapper">
    <div id="footer">
        <div class="footer-box">
            <p class="copyright">
                Copyright © ${year} &nbsp; &nbsp;Lavas Project
            </p>
        </div>
    </div>
</div>

{{ /block }}
