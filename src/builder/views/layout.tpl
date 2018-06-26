
<!DOCTYPE html>
<html mip>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1">
    <title>MIP page</title>
    <link rel="canonical" href="对应的原页面地址">
    <link rel="stylesheet" href="https://bos.nj.bpc.baidu.com/assets/mip/projects/mip.css">
    <style mip-custom>
      ${css|raw}
    </style>
  </head>
  <body>
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
    <script src="https://bos.nj.bpc.baidu.com/assets/mip/projects/mip.js"></script>
  </body>
</html>
