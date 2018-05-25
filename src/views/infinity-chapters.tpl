{{ target: infinity-chapters }}
<div class="wd-infinity-chapters">
    {{ for: ${chapters} as ${item} }}
        <a class="chapter-title" href="${item.hash}">${item.text|raw}</a>
        {{ if: ${item.children} }}
        <div class="children-${level}">
            {{ use: infinity-chapters(chapters = ${item.children}, level = ${level} + 1) }}
        </div>
        {{ /if }}
    {{ /for }}
</div>
