{{ target: mip-layout }}

<!DOCTYPE html>
<html mip>
    <head>
        <meta charset="utf-8">
        <title>${title} | MIP</title>
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, minimal-ui">
        <meta name="description" content="${description}">
        <meta name="keywords" content="${keywords}">
        <meta name="theme-color" content="#2874f0">
       <!--  <link rel="stylesheet" href="https://bos.nj.bpc.baidu.com/assets/mip/projects/mip.css"> -->
        <link rel="stylesheet" type="text/css" href="https://mipcache.bdstatic.com/static/v1/mip.css">
        <!-- <link rel="stylesheet" type="text/css" href="http://127.0.0.1:8080/dist/mip.css"> -->
        <link rel="canonical" href="${originUrl}">
        <style mip-custom>
            ${baseStyle|raw}
            ${layoutStyle|raw}
            {{ block: style }}{{ /block }}
        </style>
    </head>
    <body>
        <mip-fixed type="top" top="0px" left="0px" right="0px" class="mip-nav-wrapper">
            <mip-nav-slidedown
                data-id="bs-navbar"
                class="mip-navbar"
                data-showbrand="1"
                data-brandname="MIP"
                data-brandhref="/"
            >
                <nav id="bs-navbar" class="navbar-collapse collapse navbar navbar-static-top">
                    <ul class="nav navbar-nav navbar-right">
                        {{ for: ${tabs} as ${item} }}
                        <li class="navbar-item {{ if: ${item.url} === ${activeTab} }}in-active{{ /if }}">
                            <a href="${item.url}" class="navbar-link">${item.name}</a>
                        </li>
                        {{ /for }}
                        <li class="navbar-wise-close">
                            <span id="navbar-wise-close-btn"></span>
                        </li>
                    </ul>
                </nav>
            </mip-nav-slidedown>
        </mip-fixed>
        <div id="app" class="application theme--light">
            <div class="application--wrap">
                <div class="app-view-container">
                    {{ block: content }}{{ /block }}
                </div>
                {{ block: footer }}{{ /block }}
            </div>
        </div>
        <!-- <script src="http://127.0.0.1:8080/dist/mip.js"></script> -->
        <!-- <script src="https://bos.nj.bpc.baidu.com/assets/mip/projects/mip.js"></script> -->
        <script src="https://mipcache.bdstatic.com/static/v1/mip.js"></script>
        <script src="https://mipcache.bdstatic.com/static/v1/mip-fixed/mip-fixed.js"></script>
        <script src="https://mipcache.bdstatic.com/static/v1/mip-nav-slidedown/mip-nav-slidedown.js"></script>
        {{ block: script }}{{ /block }}
    </body>
</html>
