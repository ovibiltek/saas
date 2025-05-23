/*
 Shadow animation 1.11
 http://www.bitstorm.org/jquery/shadow-animation/
 Copyright 2011, 2013 Edwin Martin
 Contributors: Mark Carver, Xavier Lepretre and Jason Redding
 Released under the MIT and GPL licenses.
*/
'use strict'; jQuery(function (h) {
    function r(b, m, d) {
        var l = []; h.each(b, function (f) {
            var g = [], e = b[f]; f = m[f]; e.b && g.push("inset"); "undefined" !== typeof f.left && g.push(parseFloat(e.left + d * (f.left - e.left)) + "px " + parseFloat(e.top + d * (f.top - e.top)) + "px"); "undefined" !== typeof f.blur && g.push(parseFloat(e.blur + d * (f.blur - e.blur)) + "px"); "undefined" !== typeof f.a && g.push(parseFloat(e.a + d * (f.a - e.a)) + "px"); if ("undefined" !== typeof f.color) {
                var p = "rgb" + (h.support.rgba ? "a" : "") + "(" + parseInt(e.color[0] + d * (f.color[0] - e.color[0]),
                    10) + "," + parseInt(e.color[1] + d * (f.color[1] - e.color[1]), 10) + "," + parseInt(e.color[2] + d * (f.color[2] - e.color[2]), 10); h.support.rgba && (p += "," + parseFloat(e.color[3] + d * (f.color[3] - e.color[3]))); g.push(p + ")")
            } l.push(g.join(" "))
        }); return l.join(", ")
    } function q(b) {
        function m() { var a = /^inset\b/.exec(b.substring(c)); return null !== a && 0 < a.length ? (k.b = !0, c += a[0].length, !0) : !1 } function d() {
            var a = /^(-?[0-9\.]+)(?:px)?\s+(-?[0-9\.]+)(?:px)?(?:\s+(-?[0-9\.]+)(?:px)?)?(?:\s+(-?[0-9\.]+)(?:px)?)?/.exec(b.substring(c));
            return null !== a && 0 < a.length ? (k.left = parseInt(a[1], 10), k.top = parseInt(a[2], 10), k.blur = a[3] ? parseInt(a[3], 10) : 0, k.a = a[4] ? parseInt(a[4], 10) : 0, c += a[0].length, !0) : !1
        } function l() {
            var a = /^#([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})/.exec(b.substring(c)); if (null !== a && 0 < a.length) return k.color = [parseInt(a[1], 16), parseInt(a[2], 16), parseInt(a[3], 16), 1], c += a[0].length, !0; a = /^#([0-9a-fA-F])([0-9a-fA-F])([0-9a-fA-F])/.exec(b.substring(c)); if (null !== a && 0 < a.length) return k.color = [17 * parseInt(a[1], 16), 17 * parseInt(a[2],
                16), 17 * parseInt(a[3], 16), 1], c += a[0].length, !0; a = /^rgb\(\s*([0-9\.]+)\s*,\s*([0-9\.]+)\s*,\s*([0-9\.]+)\s*\)/.exec(b.substring(c)); if (null !== a && 0 < a.length) return k.color = [parseInt(a[1], 10), parseInt(a[2], 10), parseInt(a[3], 10), 1], c += a[0].length, !0; a = /^rgba\(\s*([0-9\.]+)\s*,\s*([0-9\.]+)\s*,\s*([0-9\.]+)\s*,\s*([0-9\.]+)\s*\)/.exec(b.substring(c)); return null !== a && 0 < a.length ? (k.color = [parseInt(a[1], 10), parseInt(a[2], 10), parseInt(a[3], 10), parseFloat(a[4])], c += a[0].length, !0) : !1
        } function f() {
            var a = /^\s+/.exec(b.substring(c));
            null !== a && 0 < a.length && (c += a[0].length)
        } function g() { var a = /^\s*,\s*/.exec(b.substring(c)); return null !== a && 0 < a.length ? (c += a[0].length, !0) : !1 } function e(a) { if (h.isPlainObject(a)) { var b, e, c = 0, d = []; h.isArray(a.color) && (e = a.color, c = e.length); for (b = 0; 4 > b; b++)b < c ? d.push(e[b]) : 3 === b ? d.push(1) : d.push(0) } return h.extend({ left: 0, top: 0, blur: 0, spread: 0 }, a) } for (var p = [], c = 0, n = b.length, k = e(); c < n;)if (m()) f(); else if (d()) f(); else if (l()) f(); else if (g()) p.push(e(k)), k = {}; else break; p.push(e(k)); return p
    } h.extend(!0,
        h, { support: { rgba: function () { var b = h("script:first"), m = b.css("color"), d = !1; if (/^rgba/.test(m)) d = !0; else try { d = m !== b.css("color", "rgba(0, 0, 0, 0.5)").css("color"), b.css("color", m) } catch (l) { } b.removeAttr("style"); return d }() } }); var s = h("html").prop("style"), n; h.each(["boxShadow", "MozBoxShadow", "WebkitBoxShadow"], function (b, h) { if ("undefined" !== typeof s[h]) return n = h, !1 }); n && (h.Tween.propHooks.boxShadow = {
            get: function (b) { return h(b.elem).css(n) }, set: function (b) {
                var m = b.elem.style, d = q(h(b.elem)[0].style[n] ||
                    h(b.elem).css(n)), l = q(b.end), f = Math.max(d.length, l.length), g; for (g = 0; g < f; g++)l[g] = h.extend({}, d[g], l[g]), d[g] ? "color" in d[g] && !1 !== h.isArray(d[g].color) || (d[g].color = l[g].color || [0, 0, 0, 0]) : d[g] = q("0 0 0 0 rgba(0,0,0,0)")[0]; b.run = function (b) { b = r(d, l, b); m[n] = b }
            }
        })
});