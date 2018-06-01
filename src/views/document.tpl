{{ target: mip-document(master = mip-layout) }}

{{ block: style }}

.doc-layout .markdown-body .md-related.like-box {
    display: none;
}

.doc-layout #sidebar-left .version-select-wrapper {
    margin-top: 20px;
    display: block;
    font-size: 16px;
    color: #ffffff;
}

.mip-version-select-label {
    text-align: center;
    margin-bottom: 10px;
}

.mip-version-select .version-item {
    display: block;
    color: #fff;
    margin: 5px;
    text-align: center;
}

.mip-version-select .version-item.in-active {
    background: #666;
}

#sidebar-mip {
    padding: 20px;
    background: #37474f;
}

.doc-layout #sidebar-mip .version-select-wrapper {
    margin-top: 20px;
    display: block;
    font-size: 16px;
    color: #ffffff;
}

#sidebar-mip .sidebar .wd-infinity-menu a {
    color: #ccc;
}

#sidebar-mip .sidebar .wd-infinity-menu .folder {
    color: #fff;
}

.sidebar-toggle-wrapper {
    z-index: 50!important;
}

#sidebar-toggle {
    display: none;
}

@media screen and (max-width: 767px) {
    #sidebar-toggle {
        display: block;
        background: #37474f;
        color: #fff;
        width: 26px;
        height: 26px;
        position: relative;
    }

    #sidebar-toggle::after {
        content: '';
        width: 8px;
        height: 8px;
        border-top: 2px solid #fff;
        border-right: 2px solid #fff;
        display: block;
        top: 50%;
        left: 50%;
        position: absolute;
        transform: translate(-50%, -50%) rotate(45deg);
    }
}

{{ /block }}

{{ block: script }}

<script src="https://mipcache.bdstatic.com/static/v1/mip-sidebar/mip-sidebar.js"></script>

{{ /block }}

{{ block: content }}

<div class="doc-layout app-view">
    <div class="wd-sidebar" id="sidebar-left">
        <mip-fixed type="left" top="64px" bottom="0px" class="wd-sidebar-pc">
            <div class="menu-wrapper">
                ${menu|raw}
            </div>
        </mip-fixed>
    </div>

    <mip-fixed type="left" bottom="50px" class="sidebar-toggle-wrapper">
        <div id="sidebar-toggle" on="tap:sidebar-mip.open"></div>
    </mip-fixed>

    <mip-sidebar
        id="sidebar-mip"
        layout="nodisplay"
        class="mip-hidden"
    >
        <div class="sidebar">
            ${menu|raw}
        </div>
    </mip-sidebar>

    <div class="markdown-wrapper">
        <div class="md-content ui-dep-1">
            <div class="markdown-body">
                ${content|raw}
            </div>
        </div>
    </div>

    <div class="wd-sidebar" id="sidebar-right">
        <mip-fixed type="right" top="64px" bottom="0px" class="wd-sidebar-pc">
            <div class="sidebar-right-wrapper">
                <div class="sidebar-right-inner">
                    <div class="chapter-wrapper ui-dep-1">
                        ${chapters|raw}
                    </div>
                </div>
            </div>
        </mip-fixed>
    </div>
</div>

{{ /block }}
