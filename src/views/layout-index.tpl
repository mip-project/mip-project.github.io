{{ target: layout-index(master = layout) }}

{{ block: content }}
<div class="home-wrapper">
    <section class="top-section">
        <div class="container">
            <div class="top-text">
                <h1>移动网页加速器</h1>
                <p>使用 MIP 无需等待加载</br>页面内容将以更友好的方式瞬时到达用户</p>
                <div class="top-buttons">
                    <a class="top-btn-start" data-type="mip" href="https://mip-project.github.io/guide/index.html">快速入门</a>
                    <a class="top-btn-github" data-type="mip" href="https://github.com/mipengine/mip2">GitHub</a>
                </div>
            </div>
        </div>
    </section>
    <section class="intro-section">
        <div class="container">
            <h1>MIP是什么</h1>
            <p>WHAT IS MOBILE INSTANT PAGES</p>
            <div class="mip-parts">
                <div class="mip-parts-html">
                    <h2>MIP-HTML</h2>
                    <p>通过MIP-HTML规范限制HTML以达到提升页面性能的效果</p>
                </div>
                <div class="mip-parts-js">
                    <h2>MIP-JS</h2>
                    <p>精心设计的组件核心JS确保快速渲染MIP-HTML网页</p>
                </div>
                <div class="mip-parts-cache">
                    <h2>MIP-CACHE</h2>
                    <p>给所有符合MIP-HTML规范的网页提供CDN缓存服务，主动提高页面加载速度</p>
                </div>
            </div>
        </div>
    </section>
    <section class="advantage-section">
        <div class="container">
            <h1>MIP的优势</h1>
            <p>THE ADVANTAGES OF MOBILE INSTANT PAGES</p>
            <div class="mip-advantages">
                <div class="mip-advan-section">
                    <div>
                        <h2>丰富灵活的内置组件</h2>
                        <p>MIP提供实用、强大的基础组件<br/>开发者可以根据需求任意选择</p>
                        <a class="mip-advan-section-button" data-type="mip" href="#">查看详情<i class="arrow"></i></a>
                        <div class="mip-advan-section-img advan-1"></div>
                    </div>
                    <div>
                        <h2>开放的接入技术</h2>
                        <p>MIP是一项永久的开源计划<br/>提供持续优化的解决方案</p>
                        <a class="mip-advan-section-button" data-type="mip" href="#">查看详情<i class="arrow"></i></a>
                        <div class="mip-advan-section-img advan-2"></div>
                    </div>
                </div>
                <div class="mip-advan-section">
                    <div>
                        <h2>更好的整站体验</h2>
                        <p>更流畅的页面切换体验<br/>天然的站点离线缓存支持</p>
                        <a class="mip-advan-section-button" data-type="mip" href="#">查看详情<i class="arrow"></i></a>
                        <div class="mip-advan-section-img advan-3"></div>
                    </div>
                    <div>
                        <h2>简单便捷的开发规范</h2>
                        <p>提供MVVM机制降低组件开发难度<br/>提供更为简单高效的组件互动方式</p>
                        <a class="mip-advan-section-button" data-type="mip" href="#">查看详情<i class="arrow"></i></a>
                        <div class="mip-advan-section-img advan-4"></div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <section class="footer-section">
        <div class="container">
            <div class="pc">
                <div>
                    <h2>使用文档</h2>
                    <a data-type="mip" href="#">简介</a>
                    <a data-type="mip" href="#">开发规范</a>
                    <a data-type="mip" href="#">组件说明</a>
                    <a data-type="mip" href="#">工具接口</a>
                    <a data-type="mip" href="#">帮助中心</a>
                    <a data-type="mip" href="#">成功案例</a>
                </div>
                <div>
                    <h2>组件列表</h2>
                    <a data-type="mip" href="#">内置组件</a>
                    <a data-type="mip" href="#">个性化组件</a>
                    <a data-type="mip" href="#">广告组件</a>
                </div>
                <div>
                    <h2>常用链接</h2>
                    <a data-type="mip" href="#">MIP 官方博客</a>
                    <a data-type="mip" href="#">MIP-CLI 本地开发工具</a>
                    <a data-type="mip" href="#">MIP 升级动态</a>
                    <a data-type="mip" href="#">MIP 代码校验工具</a>
                    <a data-type="mip" href="#">MIP 效果预览工具</a>
                    <a data-type="mip" href="#">MIP 组件审核平台</a>
                </div>
                <div>
                    <h2>联系我们</h2>
                    <a data-type="mip" href="#">Github</a>
                    <a data-type="mip" href="#">mipengine@baidu.com</a>
                    <a data-type="mip" href="#" class="qr-code"></a>
                    <a data-type="mip" href="#">扫码加入 QQ 群</a>
                </div>
            </div>
            <div class="mobile">
                <div>
                    <a data-type="mip" href="#" class="qr-code"></a>
                    <a data-type="mip" href="#">扫码加入 QQ 群</a>
                    <div class="mobile-contact">
                        联系我们:
                        <a data-type="mip" href="#">Github</a>
                        <a data-type="mip" href="#">mipengine@baidu.com</a>
                    </div>
                </div>
            </div>
        </div>
        <p>@2018 mipengine</p>
    </section>
</div>

<mip-data>
  <script type="application/json">
    {
      "navbar": ${*navbar|json},
      "sidebarFragment": "nav",
      "sidebarSecondFragment": "nav"
    }
  </script>
</mip-data>
{{ /block }}
