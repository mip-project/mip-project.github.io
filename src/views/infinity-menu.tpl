{{ target: infinity-menu }}
<div class="wd-infinity-menu">
    {{ for: ${menu} as ${menuItem} }}
        {{ var: name = ${menuItem.text} || ${menuItem.name} }}
        {{ if: ${menuItem.children} }}
        <div class="l-${level}">
            <div class="folder show">${name}</div>
            <div class="children-${level}">
                {{ use: infinity-menu(menu = ${menuItem.children}, level = ${level} + 1) }}
            </div>
        </div>
        {{ else }}
        {{ var: href = ${menuItem.url} }}
        <div class="l-${level}">
            <a data-type="mip" href="${href}">${name}</a>
        </div>
        {{ /if }}
    {{ /for }}
</div>
