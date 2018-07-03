{{ target: layout-navbar }}
<div class="layout-navbar">
  <div class="navbar-logo"></div>
  <ul class="navbar-menu">
    {{ for: ${navbar} as ${item} }}
      {{ if: ${item.children} }}
      <li class="navbar-item">
        <span class="menu-name">${item.name}<i class="arrow"></i></span>
        <ul class="navbar-sub-menu">
          {{ for: ${item.children} as ${subItem} }}
          <li class="navbar-sub-item"><a data-type="mip" href="${subItem.url}">${subItem.name}</a></li>
          {{ /for }}
        </ul>
      </li>
      {{ else }}
      <li class="navbar-item"><a data-type="mip" href="${item.url}" class="menu-name">${item.name}</a></li>
      {{ /if }}
    {{ /for }}
  </ul>
  <div class="navbar-toggle"><i class="iconfont icon-bars"></i></div>
</div>
