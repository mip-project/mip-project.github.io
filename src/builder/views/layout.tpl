{{ target: layout }}
<!DOCTYPE html>
<html mip>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1">
    <title>MIP page</title>
    <link rel="canonical" href="对应的原页面地址">
    <!-- <link rel="stylesheet" type="text/css" href="https://c.mipcdn.com/static/v1/mip.css"> -->
    <!-- <link rel="stylesheet" href="https://bos.nj.bpc.baidu.com/assets/mip/projects/mip.css"> -->
    <link rel="stylesheet" href="http://127.0.0.1:8080/dist/mip.css">
    <style mip-custom>
      ${css|raw}
    </style>
  </head>
  <body>
    {{ block: content }}{{ /block }}
    <mip-shell on="ready:MIP.setData({ready:m.ready+1})">
      <script type="application/json">
        {
          "routes": [
            {
              "pattern": "*",
              "meta": {
                 "header": {
                  "show": false
                }
              }
            }
          ]
        }
      </script>
      <mip-fixed type="top" class="layout-navbar-fixed" mip-shell>
        {{ use:layout-navbar(navbar = ${navbar}) }}
      </mip-fixed>
      <mip-fixed type="left" top="50px" class="layout-sidebar" mip-shell>
        ${siderbar|raw}
      </mip-fixed>
      <mip-data mip-shell>
        <script type="application/json">
          {
            "ready": 0,
            "url": ""
          }
        </script>
      </mip-data>
      <mip-script mip-shell>
        MIP.watch('url', function (val) {
          console.log(val)
        })

        MIP.setData({
          url: location.href
        })
      </mip-script>
    </mip-shell>
    <script src="http://127.0.0.1:8080/dist/mip.js"></script>
    <!-- <script src="https://c.mipcdn.com/static/v1/mip.js"></script> -->
    <!-- <script src="https://bos.nj.bpc.baidu.com/assets/mip/projects/mip.js"></script> -->
    <script src="https://c.mipcdn.com/static/v1/mip-fixed/mip-fixed.js"></script>
    <script src="https://c.mipcdn.com/static/v1/mip-nav-slidedown/mip-nav-slidedown.js"></script>
    <script src="https://c.mipcdn.com/static/v2/mip-script/mip-script.js"></script>
  </body>
</html>
