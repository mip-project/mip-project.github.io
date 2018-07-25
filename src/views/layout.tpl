{{ target: layout }}
<!DOCTYPE html>
<html mip>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1">
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
    {{ block: content }}{{ /block }}
    <mip-data>
      <script type="application/json">
        {
          "navIndex": ${navIndex},
          "navbarStyle": {
            "width": "0",
            "transform": ""
          },
          "navSep": 0,
          "navbar": ${*navbar|json}
        }
      </script>
    </mip-data>

    {{ if: false }}
    <mip-script>
      function navIndicate(val) {
        var navbar = MIP.getData('navbar');
        var width = navbar[val].width + 'px';
        var translateX = 0;
        for (var i = 0; i < val; i++) {
          translateX += navbar[i].width + MIP.getData('navSep');
        }
        var transform = 'translateX(' + translateX + 'px)';
        MIP.setData({
          navbarStyle: {
            width: width,
            transform: transform
          }
        });
      }

      function getNavSep() {
        return MIP.viewport.getWidth() > 992 ? 50 : 30
      }

      MIP.watch('active', function () {
        var curUrl = location.pathname;
        var url = MIP.getData('originalUrl');
        if (url === curUrl) {
          return;
        }
        MIP.setData({
          chapters: MIP.getData('originalChapters')
        })
      })

      MIP.watch('navIndex', function (val) {
        navIndicate(val);
      })

      MIP.watch('navSep', function (val) {
        navIndicate(MIP.getData('navIndex'));
      })

      MIP.watch('url', function (val) {
        console.log('url is watched:' + val)

        if (val === '/' || val === '') {
          MIP.setData({
            navIndex: 0
          });
          return;
        }

        var navbar = MIP.getData('navbar');
        for (var i = 0; i < navbar.length; i++) {
          if (navbar[i].url !== '/' && val.indexOf(navbar[i].url) === 0) {
            MIP.setData({
              navIndex: i
            });
            return;
          }
        }
      })

      MIP.viewport.on('resize', function () {
        MIP.setData({
          navSep: getNavSep()
        })
      })

      MIP.setData({
        navSep: getNavSep()
      })
    </mip-script>

    {{ /if }}

    <mip-fixed type="top" class="layout-navbar-fixed">
      {{ use:layout-navbar(navbar = ${navbar}) }}
    </mip-fixed>

    <!-- <script src="http://172.18.19.102:8080/dist/mip.js"></script> -->
    <script src="https://c.mipcdn.com/static/v2/mip.js"></script>
    <!-- <script src="https://bos.nj.bpc.baidu.com/assets/mip/projects/mip.js"></script> -->
    <script src="/assets/mip-sidenav/mip-sidenav.js"></script>
    <script src="https://c.mipcdn.com/static/v1/mip-fixed/mip-fixed.js"></script>
    <script src="https://c.mipcdn.com/static/v1/mip-nav-slidedown/mip-nav-slidedown.js"></script>
    {{ if: false }}
    <script src="https://c.mipcdn.com/static/v2/mip-script/mip-script.js"></script>
    {{ /if }}
  </body>
</html>
