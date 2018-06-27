
<!DOCTYPE html>
<html mip>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1">
    <title>MIP page</title>
    <link rel="canonical" href="对应的原页面地址">
    <!-- <link rel="stylesheet" type="text/css" href="https://c.mipcdn.com/static/v1/mip.css"> -->
    <link rel="stylesheet" href="https://bos.nj.bpc.baidu.com/assets/mip/projects/mip.css">
    <style mip-custom>
      ${css|raw}
    </style>
  </head>
  <body>
    <mip-fixed type="top" class="layout-navbar-fixed">
      <div class="layout-navbar-logo"></div>
      <div class="mip-nav-wrapper ui-dep-1 layout-navbar">
        <mip-nav-slidedown
            data-id="bs-navbar"
            class="mip-element-sidebar container"
            data-showbrand="0"
            data-brandname="MIP 官网">
            <nav id="bs-navbar" class="navbar-collapse collapse navbar navbar-static-top">
                <ul class="nav navbar-nav navbar-right">
                    <li>
                        <a href="//www.mipengine.org/">首页</a>
                    </li>
                    <li>
                        <a href="//www.mipengine.org/timeline.html">动态</a>
                    </li>
                    <li>
                        <a href="http://www.cnblogs.com/mipengine/">博客</a>
                    </li>
                    <li class="navbar-wise-close">
                        <span id="navbar-wise-close-btn"></span>
                    </li>
                </ul>
            </nav>
        </mip-nav-slidedown>
      </div>
    </mip-fixed>
    <div class="layout-side-bar">
      ${siderbar|raw}
    </div>
    <div class="layout-main-content">
      <div class="content-wrapper">
        {{ use:markdown-breadcrumb(list = ${list}) }}
        ${content|raw}
        {{ use:markdown-toolbar() }}
        {{ use:markdown-paginator(last = ${last}, next = ${next}) }}
      </div>
    </div>
    <!-- <script src="https://c.mipcdn.com/static/v1/mip.js"></script> -->
    <script src="https://bos.nj.bpc.baidu.com/assets/mip/projects/mip.js"></script>
    <script src="https://c.mipcdn.com/static/v1/mip-fixed/mip-fixed.js"></script>
    <script src="https://c.mipcdn.com/static/v1/mip-nav-slidedown/mip-nav-slidedown.js"></script>
  </body>
</html>
