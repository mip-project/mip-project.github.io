{{ target: layout-doc(master = layout) }}

{{ block: content }}
<div class="layout-main-content">
  <div class="content-wrapper">
    {{ use:markdown-breadcrumb(list = ${breadcrumbs}) }}
    ${content|raw}
    {{ use:markdown-toolbar() }}
    {{ use:markdown-paginator(last = ${last}, next = ${next}) }}
  </div>
</div>
{{ /block }}
