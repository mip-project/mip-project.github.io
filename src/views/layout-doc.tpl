{{ target: layout-doc(master = layout) }}

{{ block: content }}
<div class="layout-main-content">
  <div class="content-wrapper">
    {{ use:markdown-breadcrumb(list = ${list}) }}
    <div class="markdown-body">
      ${content|raw}
    </div>
    {{ use:markdown-toolbar() }}
    {{ use:markdown-paginator(last = ${last}, next = ${next}) }}
  </div>
</div>
{{ /block }}
