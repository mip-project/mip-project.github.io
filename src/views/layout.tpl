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
    <style mip-custom>
      ${css|raw}
    </style>
  </head>
  <body>
    {{ block: content }}{{ /block }}
    <mip-data>
      <script type="application/json">
        {
          "active": 0,
          "navIndex": 0,
          "navbarStyle": {
            "width": "0",
            "transform": ""
          },
          "navSep": 0,
          "navbar": ${*navbar|json},
          "menu": ${*menu|json},
          "chapters": ${*chapters|json},
          'url': "${url}"
        }
      </script>
    </mip-data>
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

    <mip-fixed type="top" class="layout-navbar-fixed">
      {{ use:layout-navbar(navbar = ${navbar}) }}
    </mip-fixed>
    <mip-fixed type="left" top="64px" class="layout-sidebar">
      <mip-sidenav m-bind:menu="menu" m-bind:chapters="chapters" m-bind:url="url">
      </mip-sidenav>
    </mip-fixed>

    <!-- <script src="http://172.18.19.102:8080/dist/mip.js"></script> -->
    <script src="https://c.mipcdn.com/static/v2/mip.js"></script>
    <!-- <script src="https://bos.nj.bpc.baidu.com/assets/mip/projects/mip.js"></script> -->
    <script src="http://127.0.0.1:8111/mip-sidenav/mip-sidenav.js"></script>
    <script src="https://c.mipcdn.com/static/v1/mip-fixed/mip-fixed.js"></script>
    <script src="https://c.mipcdn.com/static/v1/mip-nav-slidedown/mip-nav-slidedown.js"></script>
    <script src="https://c.mipcdn.com/static/v2/mip-script/mip-script.js"></script>
  </body>
</html>
