{{ target: layout-doc(master = layout) }}

{{ block: content }}
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
{{ /block }}
