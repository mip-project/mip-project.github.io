{{ target: layout-doc(master = layout) }}

{{ block: content }}
<mip-fixed type="left" top="64px" class="layout-sidebar">
  <mip-sidenav m-bind:menu="menu" m-bind:chapters="chapters" m-bind:url="url">
  </mip-sidenav>
</mip-fixed>
<div class="layout-main-content">
  <div class="content-wrapper">
    {{ use:markdown-breadcrumb(list = ${list}) }}
    <div class="markdown-body">
      ${content|raw}
    </div>
    {{ use:markdown-toolbar() }}
    {{ use:markdown-paginator(last = ${last}, next = ${next}) }}
  </div>
  <mip-data>
    <script type="application/json">
      {
        "menu": ${*menu|json},
        "chapters": ${*chapters|json},
        'url': "${url}"
      }
    </script>
  </mip-data>
</div>
{{ /block }}
