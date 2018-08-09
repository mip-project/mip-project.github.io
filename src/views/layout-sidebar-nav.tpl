{{ target: layout-sidebar-nav }}
<div class="sidebar-fragment sidebar-nav-wrapper"
  m-bind:class="{hide:sidebarFragment!=='nav'}"
>
  <h1 on="tap:MIP.setData({sidebarFragment:m.sidebarSecondFragment})"><span>目录</span></h1>
  <ul class="navbar-menu-wrapper">
  {{ for: ${navbar} as ${item}, ${index} }}
    {{ if: ${item.children} }}
    <li class="navbar-item">
      <span class="menu-name">${item.name}</span>
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
</div>
