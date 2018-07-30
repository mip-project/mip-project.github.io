{{ target: markdown-paginator }}
<div class="markdown-paginator">
  {{ if: ${last} != null }}
  <div class="markdown-paginator-item">
    <p>上一页</p>
    <a data-type="mip" href="${last.url}">${last.name}</a>
  </div>
  {{ /if }}
  {{ if: ${next} != null }}
  <div class="markdown-paginator-item">
    <p>下一页</p>
    <a data-type="mip" href="${next.url}">${next.name}</a>
  </div>
  {{ /if }}
</div>
