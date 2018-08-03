{{ target: markdown-paginator }}
<div class="markdown-paginator">

  <a class="markdown-paginator-item{{ if: ${last} == null }} hide-in-small{{ /if }}" data-type="mip" href="${last.url}">
    {{ if: ${last} != null }}
    <p class="label">上一页</p>
    <p class="title">${last.name}</p>
    {{ /if }}
  </a>
  <a class="markdown-paginator-item{{ if: ${next} == null }} hide-in-small{{ /if }}" data-type="mip" href="${next.url}">
    {{ if: ${next} != null }}
    <p class="label">下一页</p>
    <p class="title">${next.name}</p>
    {{ /if }}
  </a>
</div>
