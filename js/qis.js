/* Try it page - QIS interactions
 * Requires    - QIS/static/js/common_view.min.js
 * 
 * Copyright (c) Quru Ltd 2018
 */

'use strict';

/* QIS demo back end, adjusts the 'src' of img_el based on the functions called */

function QISToolbox(img_el, w, h, fill, event_map) {
    // Updates the image this.el for the latest toolbox state
    this.updateImage = function() {
        let url = this.getImageURL();
        if (url !== this.el.src) {
            if (this.events.loading) { this.events.loading(); }
            // TODO load with XHR
            this.el.src = url;
            // TODO move to where data loaded
            if (this.events.complete) {
                let fn = this.events.complete;
                setTimeout(fn, 1000);
            }
        }
    };

    // Returns the QIS URL for the current image and tools state
    this.getImageURL = function() {
        let specCopy = QU.clone(this.imageSpec);
	    specCopy.format = 'jpg';
        specCopy.quality = 80;
        specCopy.width = this.dimension;
        specCopy.height = this.dimension;
        specCopy.fill = this.fill;
        if (this.angle !== 0) {
            specCopy.angle = this.angle;
        }
        if (this.flipped) {
            specCopy.flip = 'h';
        }
        if (this.overlayPath) {
            specCopy.overlay = this.overlayPath;
            specCopy.ovsize = 0.8;
            specCopy.ovopacity = 0.4;
            specCopy.ovpos = 'c';
        }
        if (this.zoomLevel !== 0) {
            let delta = 0.1 * this.zoomLevel;
            specCopy.left = delta.toFixed(4);
            specCopy.top = delta.toFixed(4);
            specCopy.right = (1 - delta).toFixed(4);
            specCopy.bottom = (1 - delta).toFixed(4);
        }
        return this.imageBaseURL + '?' + QU.ObjectToQueryString(specCopy);
    };

    // Resets the tools state to initial values
    this.reset = function() {
        this.zoomLevel = 0;
        this.angle = 0;
        this.flipped = false;
        this.overlayPath = '';
        this.updateImage();
    };

    this.zoom = function(delta) {
        this.zoomLevel = Math.max(Math.min(this.zoomLevel + delta, 3), 0);
        this.updateImage();
    };
    this.rotate = function(delta) {
        this.angle += delta;
        if (this.angle >= 360) this.angle -= 360;
        if (this.angle <= -360) this.angle += 360;
        this.updateImage();
    };
    this.toggleFlip = function() {
        this.flipped = !this.flipped;
        this.updateImage();
    };
    this.toggleWatermark = function(img_path) {
        this.overlayPath = this.overlayPath ? '' : img_path;
        this.updateImage();
    };

    // Rounds up a value to the nearest number
    this._roundUp = function(val, nearest) {
        let rem = val % nearest;
        if (rem !== 0)
            return (val - rem) + nearest;
        else
            return val;
    }

    // Set the class state
    this.el = img_el;
    this.dimension = this._roundUp(w > h ? w : h, 100);
    this.fill = fill || 'white';
    this.events = event_map || {};
    // Parse the image URL
    let qsIdx = this.el.src.indexOf('?');
    this.imageBaseURL = this.el.src.substring(0, qsIdx);
    this.imageSpec = QU.QueryStringToObject(this.el.src.substring(qsIdx + 1), false);
    // Set initial tools state
    this.reset();
}

/* XHR image loader that also provides QIS and image stats */

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
ToolboxUI.watermark = function() { this.toolbox.toggleWatermark('/web/splash/sample-white.svg'); }
ToolboxUI.reset = function() { this.toolbox.reset(); }

/* Page setup */

var initialiseToolbox = true;

QU.whenReady(function() {
    if (initialiseToolbox) {
        ToolboxUI.setup(new QISToolbox(
            QU.id('bg_image'),    // The background img element to load and modify
            window.innerWidth,    // The viewport size
            window.innerHeight,
            'black',              // The page background colour
            {
                // What to do on img load-started and load-complete events
                'loading': function() { ToolboxUI.showLoading(true); },
                'complete': function() { ToolboxUI.showLoading(false); }
            }
        ));
    }
});
