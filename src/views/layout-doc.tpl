{{ target: layout-doc(master = layout) }}

{{ block: content }}
<mip-fixed type="left" top="64px" class="layout-sidebar">
  <mip-sidenav m-bind:menu="menu" m-bind:chapters="chapters" m-bind:url="url">
  </mip-sidenav>
</mip-fixed>
<div class="layout-main-content">
  <div class="content-wrapper">
    {{ use:markdown-breadcrumb(list = ${breadcrumbs}) }}
    <div class="markdown-body">
      ${content|raw}
    </div>
    {{ use:markdown-toolbar() }}
    {{ use:markdown-paginator(last = ${last}, next = ${next}) }}
  </div>
</div>
<mip-data>
  <script type="application/json">
    {
      "navbar": ${*navbar|json},
      "sidebarFragment": "nav",
      "sidebarSecondFragment": "guide",
      "menu": ${*menu|json},
      "chapters": ${*chapters|json},
      'url': "${url}"
    }
  </script>
</mip-data>
{{ /block }}

{{ block: sidebar }}
<div class="navbar-menu-wrapper"
  m-bind:class="{hide:sidebarFragment!=='guide'}"
>
  <h1 on="tap:MIP.setData({sidebarFragment:'nav'})">文档目录</h1>
  <mip-sidenav m-bind:menu="menu" m-bind:chapters="chapters" m-bind:url="url"></mip-sidenav>
</div>
{{ /block }}
