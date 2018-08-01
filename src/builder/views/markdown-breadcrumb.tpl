{{ target: markdown-breadcrumb }}
<p class="markdown-breadcrumb">
  什么鬼什么鬼
  {{ for: ${list} as ${item}, ${index} }}
  <span>${item.name}</span>{{ if: ${list.length} > ${index} + 1 }}<span class="split">/</span>{{ /if }}
  {{ /for }}
</p>
