{{ target: layout }}
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
      {{ use:layout-navbar(navbar = ${navbar}) }}
    </mip-fixed>
    {{ block: content }}{{ /block }}
    <!-- <script src="https://c.mipcdn.com/static/v1/mip.js"></script> -->
    <script src="https://bos.nj.bpc.baidu.com/assets/mip/projects/mip.js"></script>
    <script src="https://c.mipcdn.com/static/v1/mip-fixed/mip-fixed.js"></script>
    <script src="https://c.mipcdn.com/static/v1/mip-nav-slidedown/mip-nav-slidedown.js"></script>
  </body>
</html>
