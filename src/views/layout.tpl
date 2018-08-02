{{ target: layout }}
<!DOCTYPE html>
<html mip>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, minimal-ui">
    <title>MIP page</title>
    <link rel="canonical" href="对应的原页面地址">
    <link rel="stylesheet" type="text/css" href="https://c.mipcdn.com/static/v2/mip.css">
    <!-- <link rel="stylesheet" href="https://bos.nj.bpc.baidu.com/assets/mip/projects/mip.css"> -->
    <!-- <link rel="stylesheet" href="http://172.18.19.102:8080/dist/mip.css"> -->
    {{ if: ${development} }}
    <link rel="stylesheet" type="text/css" href="/src/builder/dist/index.css">
    {{ else }}
    <style mip-custom>
      ${css|raw}
    </style>
    {{ /if }}
  </head>
  <body>
    {{ use:layout-navbar(navbar = ${navbar}) }}

    <mip-sidebar
      id="nav-sidebar"
      layout="nodisplay"
      side="right"
      class="mip-hidden nav-sidebar"
    >
      {{ use:layout-sidebar-nav(navbar = ${navbar}) }}
      {{ block: sidebar }}{{ /block }}
    </mip-sidebar>

    {{ block: content }}{{ /block }}

    <!-- <script src="http://172.18.19.102:8080/dist/mip.js"></script> -->
    <script src="https://c.mipcdn.com/static/v2/mip.js"></script>
    <!-- <script src="https://bos.nj.bpc.baidu.com/assets/mip/projects/mip.js"></script> -->
    <script src="https://bos.nj.bpc.baidu.com/assets/mip/temp/mip-sidenav.js"></script>
    <script src="https://bos.nj.bpc.baidu.com/assets/mip/codelab/mip-stepper-tabs.js"></script>
    <script src="https://c.mipcdn.com/static/v1/mip-fixed/mip-fixed.js"></script>
    <script src="https://c.mipcdn.com/static/v1/mip-sidebar/mip-sidebar.js"></script>
  </body>
</html>
