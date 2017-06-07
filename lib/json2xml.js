/**
 * Converts JSON object to XML string.
 *
 *
 * Copyright(c) 2011 Etienne Lachance <et@etiennelachance.com>
 * MIT Licensed
 */

/*
 * Modifications (Ivo Georgiev <ivo@linvo.org>):
 *  Escape XML entities to avoid breaking the XML if any string in the JSON contains a special char
 *  Ignore special objects - objects that inherit other objects (in practice, when working with a third-party library, most of those are circular structures)
 */

/*
 *  Modifications (Alan Clarke <hi@alz.so>):
 *  added unit tests, ability to add xml node attributes, xml header option and simplified syntax
 *  removed root node, this is already covered by the module's default functionality
 */

/*
 *  Modifications (Tony Kelly <tonyk2005@gmail.com>):
 *  Refactored attributes into a separate object to help with more complex schemas
 *  Allow Keys to be ignored by putting an underscore (_) before the key name : _Key
 */

var util = require('util');

var settings = {
    header : false,
    attributes : {}
};

module.exports = function xml(json, opts) {
    'use strict';

    if (opts) {
        Object.keys(settings).forEach(function (k) {
            if (opts[k] === undefined) {
                opts[k] = settings[k];
            }
        });
    } else {
        opts = settings;
    }

    var result = opts.header ? '<?xml version="1.0" encoding="UTF-8"?>' : '';
    opts.header = false;

    if (!!json.length && typeof json !== 'string') { //Array
        json.forEach(function (node) {
            result += xml(node, opts);
        });
    } else if (typeof json === 'object') {
        Object.keys(json).forEach(function (key) {
            var node = json[key],
                attributes = '';

            if (node === undefined || node === null) {
                node = '';
            }

            if (opts['attributes'][key]) {
                Object.keys(opts['attributes'][key]).forEach(function (k) {
                    attributes += util.format(' %s="%s"', k, opts['attributes'][key][k]);
                });
            }
            var inner = xml(node, opts);

            if (inner) {
                //Ignore keys that start with a star (so you can have an array of the same element without a parent)
                if(key.substring(0, 1) === '_'){
                    result += util.format("%s", xml(node, opts));
                }else{
                    result += util.format("<%s%s>%s</%s>", key, attributes, xml(node, opts), key);
                }
            } else {
                result += util.format("<%s%s/>", key, attributes);
            }
        });
    } else {
        return json.toString().replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    return result;
};

