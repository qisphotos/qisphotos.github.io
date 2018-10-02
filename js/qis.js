/* Try it page - QIS interactions
 * Requires    - QIS/static/js/common_view.min.js
 * 
 * Copyright (c) Quru Ltd 2018
 */

'use strict';

/* QIS demo back end, adjusts the 'src' of img_el based on the toolbox functions called */

function QISToolbox(img_el, w, h, fill, event_map) {

    // Updates the image this.el for the latest toolbox state
    this.updateImage = function() {
        let url = this.getImageURL();

        if (!this.el.getAttribute('data-src-url')) {
            // We'll be injecting data into 'src', so keep an attribute for
            // what the 'src' URL would be normally
            this.el.setAttribute('data-src-url', this.el.src);
        }

        if (url !== this.el.getAttribute('data-src-url')) {
            // Don't allow overlapping requests
            if (this.loading) {
                return;
            }
            // Request the image (resumes at this._imageLoaded)
            this.loading = true;
            if (this.events.loading) {
                this.events.loading();
            }
            this._asyncBlobLoad(
                url,
                ['content-type', 'content-length', 'x-from-cache', 'x-time-taken'],
                this._imageLoaded.bind(this)
            );
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

    // Callback for when the image has loaded (see also this._asyncBlobLoad):
    //    url is as originally requested
    //    blob is null on error (and the headers dict empty)
    //    headers dict keys are as originally requested, but the values may be null
    this._imageLoaded = function(url, blob, headers) {
        let stats = {};
        if (blob) {
            // Apply the new image
            let oldDataUrl = this.el.src,
                newDataUrl = URL.createObjectURL(blob);
            this.el.src = newDataUrl;
            this.el.setAttribute('data-src-url', url);
            stats = this._getImageStats(url, blob, headers);
            // If the old src was a data URL, free it up
            if (oldDataUrl.indexOf('http') !== 0) {
                URL.revokeObjectURL(oldDataUrl);
            }
        }
        else {
            console.log('Background image loading failed');
        }
        // Notify that we're done
        this.loading = false;
        if (this.events.complete) {
            this.events.complete(stats);
        }
    };

    // Returns a dict of stats about the image that just loaded
    this._getImageStats = function(url, blob, headers) {
        // Default stats
        let stats = {
            'image_spec': {},
            'size_original': 0,       // TODO Currently unavailable, hard code it for now?
            'type_original': '',
            'size_new': 0,
            'type_new': '',
            'cached_locally': false,
            'cached_server': false,   // Ignore this when cached_locally is true
            'server_time_millis': 0   // Ditto
        };
        // Parse the URL
        let idx = url.indexOf('?');
        let imageSpec = QU.QueryStringToObject(url.substring(idx + 1), false);
        stats.image_spec = imageSpec;
        // Get the old and new file formats
        try {
            idx = imageSpec.src.lastIndexOf('.');
            if (idx !== -1) {
                stats.type_original = imageSpec.src.substring(idx + 1).toUpperCase();
            }
            stats.type_new = imageSpec.format.toUpperCase();
        } catch(e) { }
        // Get the old and new file sizes
        try {
            if (blob && blob.size) {
                stats.size_new = blob.size;  // blob.size is poorly supported in mobile browsers
            }
            else if (headers['content-length']) {
                stats.size_new = parseInt(headers['content-length'], 10);
            }
        } catch(e) { }
        // Get caching info
        try {
            if (!headers['content-length'] || !headers['x-time-taken']) {
                // The browser never even contacted the server
                stats.cached_locally = true;
            }
            else {
                // The browser did contact the server
                if (this.timing_cache === undefined) {
                    this.timing_cache = {};
                }
                // Discussion: the XHR API hides 304 Not Modified responses and presents
                // them as 200 OK responses, complete with cached 200 headers. There is no
                // way of telling a real 200 from a faked 200 other than the fact that the
                // QIS headers are exactly the same. Therefore we're going to keep a small
                // cache of {URL: x-time-taken} headers, and if we get the exact same value
                // for the same URL we're going to assume it was really a 304 response.
                if (this.timing_cache[url] !== undefined && this.timing_cache[url] === headers['x-time-taken']) {
                    // The browser probably got a 304 Not Modified
                    stats.cached_locally = true;
                }
                else {
                    // The browser got a 200 OK
                    if (headers['x-from-cache']) {
                        stats.cached_server = (headers['x-from-cache'].toLowerCase() === 'true');
                    }
                    if (headers['x-time-taken']) {
                        stats.server_time_millis = parseInt(headers['x-time-taken'], 10) / 1000;
                    }
                    this.timing_cache[url] = headers['x-time-taken'];
                }
            }
        } catch(e) { }

        return stats;
    };

    // An XHR data loader that returns data as a Blob and also selected HTTP headers
    this._asyncBlobLoad = function(url, headers_wanted, callback) {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.responseType = "blob";  // Ask for the result as a Blob (requires IE10+)
        xhr.onload = function(e) {
            // Get the requested headers
            let headers = {};
            if (headers_wanted && headers_wanted.length) {
                headers_wanted.forEach(function(h) {
                    headers[h] = xhr.getResponseHeader(h);
                });
            }
            // Done
            callback(url, xhr.response, headers);
        };
        xhr.onerror = function(e) {
            // Done with no data
            callback(url, null, {});
        };
        xhr.send();
    }

    // Rounds up a value to a nearest round number (e.g. nearest 100)
    this._roundUp = function(val, nearest) {
        let rem = val % nearest;
        if (rem !== 0)
            return (val - rem) + nearest;
        else
            return val;
    };

    // Resets the tools state to initial values
    this.reset = function() {
        this.zoomLevel = 0;
        this.angle = 0;
        this.flipped = false;
        this.overlayPath = '';
        this.updateImage();
    };
    // Zoom in (1) or out (-1) between levels 0 to 3
    this.zoom = function(delta) {
        this.zoomLevel = Math.max(Math.min(this.zoomLevel + delta, 3), 0);
        this.updateImage();
    };
    // Rotate clockwise by an angle (on top of the last call)
    this.rotate = function(delta) {
        this.angle += delta;
        if (this.angle >= 360) this.angle -= 360;
        if (this.angle <= -360) this.angle += 360;
        this.updateImage();
    };
    // Flip horizontally - toggles
    this.toggleFlip = function() {
        this.flipped = !this.flipped;
        this.updateImage();
    };
    // Apply a watermark - toggles
    this.toggleWatermark = function(img_path) {
        this.overlayPath = this.overlayPath ? '' : img_path;
        this.updateImage();
    };

    // Setup - set the class state
    this.el = img_el;
    this.dimension = this._roundUp(w > h ? w : h, 100);
    this.fill = fill || 'white';
    this.events = event_map || {};
    this.loading = false;
    // Setup - parse the image URL
    let qsIdx = this.el.src.indexOf('?');
    this.imageBaseURL = this.el.src.substring(0, qsIdx);
    this.imageSpec = QU.QueryStringToObject(this.el.src.substring(qsIdx + 1), false);
    // Setup - set the initial tools state
    this.reset();
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
ToolboxUI.showImageStats = function(stats) {
    // Note: stats dict may be empty on error
    let info = QU.id('rendered');
    if (!('image_spec' in stats)) {
        info.innerText = 'Sorry, that image didn\'t load';
    }
    else {
        if (stats.cached_locally) {
            info.innerText = stats.type_new + ' image returned from your browser\'s local cache';
        }
        else if (stats.cached_server) {
            info.innerText = stats.type_new + ' image returned in ' +
                stats.server_time_millis + ' milliseconds from the QIS server\'s cache ' +
                '(from ' + stats.type_original + ' original)';
        }
        else {
            info.innerText = stats.type_new + ' image generated in ' +
                stats.server_time_millis + ' milliseconds from the ' +
                stats.type_original + ' original';
        }
    }
};
ToolboxUI.zoomIn = function()       { this.toolbox.zoom(1); }
ToolboxUI.zoomOut = function()      { this.toolbox.zoom(-1); }
ToolboxUI.rotate = function()       { this.toolbox.rotate(90); }
ToolboxUI.flip = function()         { this.toolbox.toggleFlip(); }
ToolboxUI.watermark = function()    { this.toolbox.toggleWatermark('/web/splash/sample-white.svg'); }
ToolboxUI.reset = function()        { this.toolbox.reset(); }
ToolboxUI.view = function(download) {
    window.open(this.toolbox.getImageURL() +
               (download ? '&attach=1' : ''));
}
