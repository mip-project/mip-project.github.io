{{ target: markdown-toolbar }}
<div class="markdown-toolbar">
  {{ if: ${feedbackLink} }}
  <a data-type="mip" href="${feedbackLink}"><span><i class="iconfont icon-feedback"></i> 反馈</span></a>
  {{ /if }}

  {{ if: ${editLink} }}
  <a data-type="mip" href="${editLink}"><span><i class="iconfont icon-edit"></i>编辑</span></a>
  {{ /if }}
</div>
