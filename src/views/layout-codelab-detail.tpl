{{ target: layout-codelab-detail(master = layout) }}

{{ block: content }}


<div class="step-tabs-wrapper">

  {{ if:  ${codelabMenu} && ${codelabMenu.info} }}
  <div class="step-head">
    <div class="step-head-inner">
      <p class="title">${codelabMenu.info.name}</p>
      <p class="des">${codelabMenu.info.description}</p>
    </div>
  </div>
  {{ /if }}

  <div class="step-content-main">
    <mip-stepper-tabs
        m-bind:menu-steps="codelabMenu"
        m-bind:codelab-step-selected="codelabStepSelected"
      >
    </mip-stepper-tabs>

    <div class="step-content-wrapper">
      <div class="step-content-list">
          <div class="content-item show">
            <div class="markdown-body">
              ${content|raw}
            </div>
          </div>
      </div>
    </div>
  </div>
</div>

<mip-data>
  <script type="application/json">
    {
      "navbar": ${*navbar|json},
      "sidebarFragment": "nav",
      "sidebarSecondFragment": "codelabs",
      "codelabMenu": ${*codelabMenu|json},
      "codelabStepSelected": "${url}"
    }
  </script>
</mip-data>

<!-- <div class="layout-main-content"> -->
<!--   <div class="content-wrapper">
    {{ use:markdown-breadcrumb(list = ${list}) }}
    <div class="markdown-body">
      ${content|raw}
    </div>
    {{ use:markdown-toolbar() }}
    {{ use:markdown-paginator(last = ${last}, next = ${next}) }}
  </div> -->
<!-- </div> -->

{{ /block }}

{{ block: sidebar }}
<div class="navbar-menu-wrapper"
  m-bind:class="{hide:sidebarFragment!=='codelabs'}"
>
  <h1 on="tap:MIP.setData({sidebarFragment:'nav'})">CODELABS</h1>
  <mip-stepper-tabs
    m-bind:menu-steps="codelabMenu"
    m-bind:codelab-step-selected="codelabStepSelected"
  ></mip-stepper-tabs>
</div>
{{ /block }}

