{{ target: markdown-breadcrumb }}
<p class="markdown-breadcrumb">
  {{ for: ${list} as ${item}, ${index} }}
  <span>${item.title}</span>{{ if: ${list.length} > ${index} + 1 }}<span class="split">/</span>{{ /if }}
  {{ /for }}
</p>
