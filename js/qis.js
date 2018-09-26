/* Try it page - QIS interactions
 * Requires    - QIS/static/js/common_view.min.js
 * 
 * Copyright (c) Quru Ltd 2018
 */

'use strict';


function QISToolbox(img_el, w, h, fill, event_map) {
    this.el = img_el;
    this.dimension = w > h ? w : h;
    this.fill = fill;
    this.events = event_map;

    // TODO parse the URL

    this.zoom = function(delta) { console.log('Toolbox zoom'); };
    this.rotate = function(delta) { console.log('Toolbox rotate'); };
    this.toggleFlip = function() { console.log('Toolbox flip'); };
    this.toggleWatermark = function(img_path) { console.log('Toolbox wmark'); };
}


function AsyncImageLoader() {

}

/* UI front end for the toolbox class */

var ToolboxUI = {};
ToolboxUI.setup = function(toolbox) {
    this.toolbox = toolbox;
};
ToolboxUI.showLoading = function(show) {
    let mask = QU.id('bg_mask');
    QU.elSetClass(mask, 'dark-layer', show);
};
ToolboxUI.zoomIn = function() { this.toolbox.zoom(1); }
ToolboxUI.zoomOut = function() { this.toolbox.zoom(-1); }
ToolboxUI.rotate = function() { this.toolbox.rotate(90); }
ToolboxUI.flip = function() { this.toolbox.toggleFlip(); }
ToolboxUI.watermark = function() { this.toolbox.toggleWatermark('/web/logos/Quru Image Server Full.svg'); }

QU.whenReady(function() {
    ToolboxUI.setup(new QISToolbox(
        QU.id('bg_image'),
        window.innerWidth,
        window.innerHeight,
        'black', {
            'loading': function() { ToolboxUI.showLoading(true); },
            'complete': function() { ToolboxUI.showLoading(false); }
        }
    ));
});
