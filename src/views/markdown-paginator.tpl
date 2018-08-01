{{ target: markdown-paginator }}
<div class="markdown-paginator">

  <div class="markdown-paginator-item">
    {{ if: ${last} != null }}
    <p>上一页</p>
    <a data-type="mip" href="${last.url}">${last.name}</a>
    {{ /if }}
  </div>
  <div class="markdown-paginator-item">
    {{ if: ${next} != null }}
    <p>下一页</p>
    <a data-type="mip" href="${next.url}">${next.name}</a>
    {{ /if }}
  </div>
</div>
