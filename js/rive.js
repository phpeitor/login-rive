(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["rive"] = factory();
	else
		root["rive"] = factory();
})(this, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Animation: () => (/* reexport safe */ _Animation__WEBPACK_IMPORTED_MODULE_0__.Animation)
/* harmony export */ });
/* harmony import */ var _Animation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);



/***/ }),
/* 2 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Animation: () => (/* binding */ Animation)
/* harmony export */ });
/**
 * Represents an animation that can be played on an Artboard.
 * Wraps animations and instances from the runtime and keeps track of playback state.
 *
 * The `Animation` class manages the state and behavior of a single animation instance,
 * including its current time, loop count, and ability to scrub to a specific time.
 *
 * The class provides methods to advance the animation, apply its interpolated keyframe
 * values to the Artboard, and clean up the underlying animation instance when the
 * animation is no longer needed.
 */
var Animation = /** @class */ (function () {
    /**
     * Constructs a new animation
     * @constructor
     * @param {any} animation: runtime animation object
     * @param {any} instance: runtime animation instance object
     */
    function Animation(animation, artboard, runtime, playing) {
        this.animation = animation;
        this.artboard = artboard;
        this.playing = playing;
        this.loopCount = 0;
        /**
         * The time to which the animation should move to on the next render.
         * If not null, the animation will scrub to this time instead of advancing by the given time.
         */
        this.scrubTo = null;
        this.instance = new runtime.LinearAnimationInstance(animation, artboard);
    }
    Object.defineProperty(Animation.prototype, "name", {
        /**
         * Returns the animation's name
         */
        get: function () {
            return this.animation.name;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Animation.prototype, "time", {
        /**
         * Returns the animation's name
         */
        get: function () {
            return this.instance.time;
        },
        /**
         * Sets the animation's current time
         */
        set: function (value) {
            this.instance.time = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Animation.prototype, "loopValue", {
        /**
         * Returns the animation's loop type
         */
        get: function () {
            return this.animation.loopValue;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Animation.prototype, "needsScrub", {
        /**
         * Indicates whether the animation needs to be scrubbed.
         * @returns `true` if the animation needs to be scrubbed, `false` otherwise.
         */
        get: function () {
            return this.scrubTo !== null;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Advances the animation by the give time. If the animation needs scrubbing,
     * time is ignored and the stored scrub value is used.
     * @param time the time to advance the animation by if no scrubbing required
     */
    Animation.prototype.advance = function (time) {
        if (this.scrubTo === null) {
            this.instance.advance(time);
        }
        else {
            this.instance.time = 0;
            this.instance.advance(this.scrubTo);
            this.scrubTo = null;
        }
    };
    /**
     * Apply interpolated keyframe values to the artboard. This should be called after calling
     * .advance() on an animation instance so that new values are applied to properties.
     *
     * Note: This does not advance the artboard, which updates all objects on the artboard
     * @param mix - Mix value for the animation from 0 to 1
     */
    Animation.prototype.apply = function (mix) {
        this.instance.apply(mix);
    };
    /**
     * Deletes the backing Wasm animation instance; once this is called, this
     * animation is no more.
     */
    Animation.prototype.cleanup = function () {
        this.instance.delete();
    };
    return Animation;
}());



/***/ }),
/* 3 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   RuntimeLoader: () => (/* binding */ RuntimeLoader)
/* harmony export */ });
/* harmony import */ var _rive_advanced_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4);
/* harmony import */ var package_json__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5);
var __assign = (undefined && undefined.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};


// Runtime singleton; use getInstance to provide a callback that returns the
// Rive runtime
var RuntimeLoader = /** @class */ (function () {
    // Class is never instantiated
    function RuntimeLoader() {
    }
    // Rejects all pending awaitInstance() promises and resets loading state so
    // the next call to getInstance() / awaitInstance() can retry with a new URL.
    RuntimeLoader.notifyError = function (error) {
        var _a;
        RuntimeLoader.isLoading = false;
        while (RuntimeLoader.errorCallbackQueue.length > 0) {
            (_a = RuntimeLoader.errorCallbackQueue.shift()) === null || _a === void 0 ? void 0 : _a(error);
        }
        RuntimeLoader.callBackQueue = [];
    };
    // Loads the runtime
    RuntimeLoader.loadRuntime = function () {
        // Capture the URL at call time so the catch closure always refers to the
        // URL this particular attempt used, even if wasmURL is mutated for a retry.
        var attemptedUrl = RuntimeLoader.wasmURL;
        var wasmBinary = RuntimeLoader.wasmBinary;
        if (RuntimeLoader.enablePerfMarks)
            performance.mark('rive:wasm-init:start');
        _rive_advanced_mjs__WEBPACK_IMPORTED_MODULE_0__["default"](__assign({ 
            // Loads Wasm bundle
            locateFile: function () { return attemptedUrl; } }, (wasmBinary ? { wasmBinary: wasmBinary } : {})))
            .then(function (rive) {
            var _a;
            if (RuntimeLoader.enablePerfMarks) {
                performance.mark('rive:wasm-init:end');
                performance.measure('rive:wasm-init', 'rive:wasm-init:start', 'rive:wasm-init:end');
            }
            RuntimeLoader.runtime = rive;
            RuntimeLoader.errorCallbackQueue = [];
            // Fire all the callbacks
            while (RuntimeLoader.callBackQueue.length > 0) {
                (_a = RuntimeLoader.callBackQueue.shift()) === null || _a === void 0 ? void 0 : _a(RuntimeLoader.runtime);
            }
        })
            .catch(function (error) {
            // Capture specific error details
            var errorDetails = {
                message: (error === null || error === void 0 ? void 0 : error.message) || "Unknown error",
                type: (error === null || error === void 0 ? void 0 : error.name) || "Error",
                // Some browsers may provide additional WebAssembly-specific details
                wasmError: error instanceof WebAssembly.CompileError ||
                    error instanceof WebAssembly.RuntimeError,
                originalError: error,
            };
            // Log detailed error for debugging
            console.debug("Rive WASM load error details:", errorDetails);
            // In case the primary URL fails, or the wasm was not supported, try the
            // fallback URL (a rive_fallback.wasm compiled for older architectures).
            // The fallback can be customised or disabled via setWasmFallbackUrl().
            // TODO: (Gordon): preemptively test browser support and load the correct wasm file. Then use the fallback only if the primary fails.
            var fallbackUrl = RuntimeLoader.wasmFallbackURL;
            var alreadyOnFallback = fallbackUrl !== null &&
                attemptedUrl.toLowerCase() === fallbackUrl.toLowerCase();
            if (fallbackUrl !== null && !alreadyOnFallback) {
                console.warn("Failed to load WASM from ".concat(attemptedUrl, " (").concat(errorDetails.message, "), trying fallback URL: ").concat(fallbackUrl));
                // Clear wasmBinary so the retry actually fetches via locateFile
                // instead of re-using the same (failing) in-memory binary.
                RuntimeLoader.wasmBinary = null;
                RuntimeLoader.setWasmUrl(fallbackUrl);
                RuntimeLoader.loadRuntime();
            }
            else {
                // When alreadyOnFallback is true, wasmURL has already been overwritten
                // with the fallback URL, so we can no longer recover the original
                // primary URL here. The primary URL was logged in the earlier warning.
                var triedUrls = alreadyOnFallback
                    ? "the configured WASM URL or its fallback (".concat(fallbackUrl, ")")
                    : attemptedUrl;
                var errorMessage = [
                    "Could not load Rive WASM file from ".concat(triedUrls, "."),
                    "Possible reasons:",
                    "- Network connection is down",
                    "- WebAssembly is not supported in this environment",
                    "- The WASM file is corrupted or incompatible",
                    "\nError details:",
                    "- Type: ".concat(errorDetails.type),
                    "- Message: ".concat(errorDetails.message),
                    "- WebAssembly-specific error: ".concat(errorDetails.wasmError),
                    "\nTo resolve, you may need to:",
                    "1. Check your network connection",
                    "2. Set a new WASM source via RuntimeLoader.setWasmUrl()",
                    "3. Call RuntimeLoader.awaitInstance() again",
                ].join("\n");
                console.error(errorMessage);
                RuntimeLoader.notifyError(new Error(errorMessage));
            }
        });
    };
    // Provides a runtime instance via a callback
    RuntimeLoader.getInstance = function (callback, onError) {
        // If it's not loading, start loading runtime
        if (!RuntimeLoader.isLoading) {
            RuntimeLoader.isLoading = true;
            RuntimeLoader.loadRuntime();
        }
        if (!RuntimeLoader.runtime) {
            RuntimeLoader.callBackQueue.push(callback);
            if (onError) {
                RuntimeLoader.errorCallbackQueue.push(onError);
            }
        }
        else {
            callback(RuntimeLoader.runtime);
        }
    };
    // Provides a runtime instance via a promise; rejects if WASM fails to load.
    RuntimeLoader.awaitInstance = function () {
        return new Promise(function (resolve, reject) {
            return RuntimeLoader.getInstance(resolve, reject);
        });
    };
    // Manually sets the wasm url
    RuntimeLoader.setWasmUrl = function (url) {
        RuntimeLoader.wasmURL = url;
    };
    // Gets the current wasm url
    RuntimeLoader.getWasmUrl = function () {
        return RuntimeLoader.wasmURL;
    };
    /**
     * Sets the URL used as a fallback when the primary WASM URL fails to load.
     * Pass `null` to disable the fallback entirely.
     *
     * Defaults to pulling from the jsdelivr CDN.
     */
    RuntimeLoader.setWasmFallbackUrl = function (url) {
        RuntimeLoader.wasmFallbackURL = url;
    };
    // Gets the current fallback wasm url (null means fallback is disabled)
    RuntimeLoader.getWasmFallbackUrl = function () {
        return RuntimeLoader.wasmFallbackURL;
    };
    // Manually sets the wasm binary or clears it with null
    RuntimeLoader.setWasmBinary = function (value) {
        if ((value instanceof ArrayBuffer) || value === null) {
            RuntimeLoader.wasmBinary = value;
            return;
        }
        console.error("setWasmBinary expects an ArrayBuffer or null");
    };
    // Gets the current wasm build as ArrayBuffer or null
    RuntimeLoader.getWasmBinary = function () {
        return RuntimeLoader.wasmBinary;
    };
    // Flag to indicate that loading has started/completed
    RuntimeLoader.isLoading = false;
    // List of callbacks for the runtime that come in while loading
    RuntimeLoader.callBackQueue = [];
    // Path to the Wasm file; default path works for testing only;
    // if embedded wasm is used then this is never used.
    RuntimeLoader.wasmURL = "https://unpkg.com/".concat(package_json__WEBPACK_IMPORTED_MODULE_1__.name, "@").concat(package_json__WEBPACK_IMPORTED_MODULE_1__.version, "/rive.wasm");
    // Fallback WASM URL tried when the primary URL fails. Set to null to disable
    // the fallback entirely. Defaults to pulling from the jsdelivr CDN.
    RuntimeLoader.wasmFallbackURL = "https://cdn.jsdelivr.net/npm/".concat(package_json__WEBPACK_IMPORTED_MODULE_1__.name, "@").concat(package_json__WEBPACK_IMPORTED_MODULE_1__.version, "/rive_fallback.wasm");
    RuntimeLoader.wasmBinary = null;
    // Error callbacks enqueued from .getInstance()
    RuntimeLoader.errorCallbackQueue = [];
    /**
     * When true, performance.mark / performance.measure entries are emitted for
     * WASM initialization.
     */
    RuntimeLoader.enablePerfMarks = false;
    return RuntimeLoader;
}());



/***/ }),
/* 4 */
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });

var Rive = (() => {
  var _scriptName = typeof document != 'undefined' ? document.currentScript?.src : undefined;
  
  return (
function(moduleArg = {}) {
  var moduleRtn;

var l = moduleArg, aa, ba, ca = new Promise((a, b) => {
  aa = a;
  ba = b;
}), da = "object" == typeof window, ea = "function" == typeof importScripts;
function fa() {
  function a(g) {
    const k = d;
    c = b = 0;
    d = new Map();
    k.forEach(p => {
      try {
        p(g);
      } catch (m) {
        console.error(m);
      }
    });
    this.mb();
    e && e.Nb();
  }
  let b = 0, c = 0, d = new Map(), e = null, f = null;
  this.requestAnimationFrame = function(g) {
    b ||= requestAnimationFrame(a.bind(this));
    const k = ++c;
    d.set(k, g);
    return k;
  };
  this.cancelAnimationFrame = function(g) {
    d.delete(g);
    b && 0 == d.size && (cancelAnimationFrame(b), b = 0);
  };
  this.Lb = function(g) {
    f && (document.body.remove(f), f = null);
    g || (f = document.createElement("div"), f.style.backgroundColor = "black", f.style.position = "fixed", f.style.right = 0, f.style.top = 0, f.style.color = "white", f.style.padding = "4px", f.innerHTML = "RIVE FPS", g = function(k) {
      f.innerHTML = "RIVE FPS " + k.toFixed(1);
    }, document.body.appendChild(f));
    e = new function() {
      let k = 0, p = 0;
      this.Nb = function() {
        var m = performance.now();
        p ? (++k, m -= p, 1000 < m && (g(1000 * k / m), k = p = 0)) : (p = m, k = 0);
      };
    }();
  };
  this.mb = function() {
  };
}
function ha() {
  console.assert(!0);
  const a = new Map();
  let b = -Infinity;
  this.push = function(c) {
    c = c + 255 >> 8;
    a.has(c) && clearTimeout(a.get(c));
    a.set(c, setTimeout(function() {
      a.delete(c);
      0 == a.length ? b = -Infinity : c == b && (b = Math.max(...a.keys()), console.assert(b < c));
    }, 1000));
    b = Math.max(c, b);
    return b << 8;
  };
}
const ia = l.onRuntimeInitialized;
l.onRuntimeInitialized = function() {
  ia && ia();
  let a = l.decodeAudio;
  l.decodeAudio = function(f, g) {
    f = a(f);
    g(f);
  };
  let b = l.decodeFont;
  l.decodeFont = function(f, g) {
    f = b(f);
    g(f);
  };
  let c = l.setFallbackFontCb;
  l.setFallbackFontCallback = "function" === typeof c ? function(f) {
    c(f);
  } : function() {
    console.warn("Module.setFallbackFontCallback called, but text support is not enabled in this build.");
  };
  const d = l.FileAssetLoader;
  l.ptrToAsset = f => {
    let g = l.ptrToFileAsset(f);
    return g.isImage ? l.ptrToImageAsset(f) : g.isFont ? l.ptrToFontAsset(f) : g.isAudio ? l.ptrToAudioAsset(f) : g;
  };
  l.CustomFileAssetLoader = d.extend("CustomFileAssetLoader", {__construct:function({loadContents:f}) {
    this.__parent.__construct.call(this);
    this.Bb = f;
  }, loadContents:function(f, g) {
    f = l.ptrToAsset(f);
    return this.Bb(f, g);
  },});
  l.CDNFileAssetLoader = d.extend("CDNFileAssetLoader", {__construct:function() {
    this.__parent.__construct.call(this);
  }, loadContents:function(f) {
    let g = l.ptrToAsset(f);
    f = g.cdnUuid;
    if ("" === f) {
      return !1;
    }
    (function(k, p) {
      var m = new XMLHttpRequest();
      m.responseType = "arraybuffer";
      m.onreadystatechange = function() {
        4 == m.readyState && 200 == m.status && p(m);
      };
      m.open("GET", k, !0);
      m.send(null);
    })(g.cdnBaseUrl + "/" + f, k => {
      g.decode(new Uint8Array(k.response));
    });
    return !0;
  },});
  l.FallbackFileAssetLoader = d.extend("FallbackFileAssetLoader", {__construct:function() {
    this.__parent.__construct.call(this);
    this.ib = [];
  }, addLoader:function(f) {
    this.ib.push(f);
  }, loadContents:function(f, g) {
    for (let k of this.ib) {
      if (k.loadContents(f, g)) {
        return !0;
      }
    }
    return !1;
  },});
  let e = l.computeAlignment;
  l.computeAlignment = function(f, g, k, p, m = 1.0) {
    return e.call(this, f, g, k, p, m);
  };
};
const ja = l.onRuntimeInitialized;
l.onRuntimeInitialized = function() {
  function a(r) {
    this.G = r;
    this.Ab = r.getContext("2d");
    this.Eb = d;
    this.S = [];
    this.ja = 0;
    this.clear = function() {
      console.assert(0 == this.ja);
      this.S = [];
      e.delete(this);
    };
    this.save = function() {
      ++this.ja;
      this.S.push(d.save.bind(d));
    };
    this.restore = function() {
      0 < this.ja && (this.S.push(d.restore.bind(d)), --this.ja);
    };
    this.transform = function(u) {
      this.S.push(d.transform.bind(d, u));
    };
    this.align = function(u, z, A, C, H = 1.0) {
      this.S.push(d.align.bind(d, u, z, A, C, H));
    };
    this.flush = function() {
      console.assert(0 == this.ja);
      e.add(this);
      d.Ya || c();
    };
    this["delete"] = function() {
    };
  }
  function b(r, u = !1) {
    var z = {alpha:!0, depth:u, stencil:u, antialias:u, premultipliedAlpha:!0, preserveDrawingBuffer:0, powerPreference:"high-performance", failIfMajorPerformanceCaveat:0, enableExtensionsByDefault:!1, explicitSwapControl:0, renderViaOffscreenBackBuffer:0,};
    u = r.getContext("webgl2", z);
    if (!u) {
      return null;
    }
    z = ka(u, z);
    la(z);
    const A = f(r.width, r.height);
    A.La = z;
    A.G = r;
    A.Ma = r.width;
    A.Za = r.height;
    A.T = u;
    var C = A.delete;
    A.delete = function() {
      C.call(this);
      var H = this.La;
      q === w[H] && (q = null);
      "object" == typeof JSEvents && JSEvents.Qc(w[H].F.canvas);
      w[H] && w[H].F.canvas && (w[H].F.canvas.zb = void 0);
      this.La = this.G = this.Ma = this.T = w[H] = null;
    };
    return A;
  }
  function c() {
    if (d) {
      var r = d.Db, u = 0, z = 0, A = 0, C = Array(e.size), H = 0;
      for (var J of e) {
        J.ea = Math.min(J.G.width, r), J.da = Math.min(J.G.height, r), J.Ja = J.da * J.ea, u = Math.max(u, J.ea), z = Math.max(z, J.da), A += J.Ja, C[H++] = J;
      }
      e.clear();
      if (!(0 >= A)) {
        u = 1 << (0 >= u ? 0 : 32 - Math.clz32(u - 1));
        for (z = 1 << (0 >= z ? 0 : 32 - Math.clz32(z - 1)); z * u < A;) {
          u <= z ? u *= 2 : z *= 2;
        }
        u = Math.min(u, r);
        u = Math.min(z, r);
        C.sort((Z, ob) => ob.Ja - Z.Ja);
        A = new l.DynamicRectanizer(r);
        for (J = 0; J < C.length;) {
          A.reset(u, z);
          for (H = J; H < C.length; ++H) {
            var K = C[H], I = A.addRect(K.ea, K.da);
            if (0 > I) {
              console.assert(H > J);
              break;
            }
            K.pa = I & 65535;
            K.qa = I >> 16;
          }
          K = p.push(A.drawWidth());
          I = m.push(A.drawHeight());
          console.assert(K >= A.drawWidth());
          console.assert(I >= A.drawHeight());
          console.assert(K <= r);
          console.assert(I <= r);
          d.G.width != K && (d.G.width = K);
          d.G.height != I && (d.G.height = I);
          d.clear();
          for (K = J; K < H; ++K) {
            I = C[K];
            d.saveClipRect(I.pa, I.qa, I.pa + I.ea, I.qa + I.da);
            let Z = new l.Mat2D();
            Z.xx = I.ea / I.G.width;
            Z.yy = I.da / I.G.height;
            Z.xy = Z.yx = 0;
            Z.tx = I.pa;
            Z.ty = I.qa;
            d.transform(Z);
            for (const ob of I.S) {
              ob();
            }
            d.restoreClipRect();
            I.S = [];
          }
          for (d.flush(); J < H; ++J) {
            K = C[J], I = K.Ab, I.globalCompositeOperation = "copy", I.drawImage(d.G, K.pa, K.qa, K.ea, K.da, 0, 0, K.G.width, K.G.height);
          }
          J = H;
        }
      }
    }
  }
  ja && ja();
  let d = null;
  const e = new Set(), f = l.makeRenderer;
  l.makeRenderer = function(r, u) {
    if (!d) {
      function z(A) {
        var C = document.createElement("canvas");
        C.width = 1;
        C.height = 1;
        d = b(C, A);
        if (!d) {
          return null;
        }
        d.Ya = !!d.T.getExtension("WEBGL_shader_pixel_local_storage");
        d.Db = Math.min(d.T.getParameter(d.T.MAX_RENDERBUFFER_SIZE), d.T.getParameter(d.T.MAX_TEXTURE_SIZE));
        d.Ka = !d.Ya;
        if (A = d.T.getExtension("WEBGL_debug_renderer_info")) {
          C = d.T.getParameter(A.UNMASKED_RENDERER_WEBGL), d.T.getParameter(A.UNMASKED_VENDOR_WEBGL).includes("Google") && C.includes("ANGLE Metal Renderer") && (d.Ka = !1);
        }
        return d;
      }
      d = z(!0);
      if (!d) {
        throw "Unable to create WebGL context, your environment may not support WebGL. Try out @rive-app/canvas as an alternative.";
      }
      d.Ka || (d = z(!1));
    }
    return u ? new a(r) : b(r, d.Ka);
  };
  const g = l.Artboard.prototype["delete"];
  l.Artboard.prototype["delete"] = function() {
    this.Fb = !0;
    g.call(this);
  };
  const k = l.Artboard.prototype.draw;
  l.Artboard.prototype.draw = function(r) {
    r.S ? r.S.push(() => {
      this.Fb || k.call(this, r.Eb);
    }) : k.call(this, r);
  };
  const p = new ha(), m = new ha(), t = new fa();
  l.requestAnimationFrame = t.requestAnimationFrame.bind(t);
  l.cancelAnimationFrame = t.cancelAnimationFrame.bind(t);
  l.enableFPSCounter = t.Lb.bind(t);
  t.mb = c;
  l.resolveAnimationFrame = c;
  let v = l.load;
  l.load = function(r, u, z = !0) {
    const A = new l.FallbackFileAssetLoader();
    void 0 !== u && A.addLoader(u);
    z && (u = new l.CDNFileAssetLoader(), A.addLoader(u));
    return Promise.resolve(v(r, A));
  };
  const x = l.WebGL2Renderer.prototype.clear;
  l.WebGL2Renderer.prototype.clear = function() {
    la(this.La);
    const r = this.G;
    if (this.Ma != r.width || this.Za != r.height) {
      this.resize(r.width, r.height), this.Ma = r.width, this.Za = r.height;
    }
    x.call(this);
  };
  l.decodeImage = function(r, u) {
    r = l.decodeWebGL2Image(r);
    u(r);
  };
  let n = l.Renderer.prototype.align;
  l.Renderer.prototype.align = function(r, u, z, A, C = 1.0) {
    n.call(this, r, u, z, A, C);
  };
};
var ma = Object.assign({}, l), na = "./this.program", y = "", oa, pa;
if (da || ea) {
  ea ? y = self.location.href : "undefined" != typeof document && document.currentScript && (y = document.currentScript.src), _scriptName && (y = _scriptName), y.startsWith("blob:") ? y = "" : y = y.substr(0, y.replace(/[?#].*/, "").lastIndexOf("/") + 1), ea && (pa = a => {
    var b = new XMLHttpRequest();
    b.open("GET", a, !1);
    b.responseType = "arraybuffer";
    b.send(null);
    return new Uint8Array(b.response);
  }), oa = (a, b, c) => {
    if (qa(a)) {
      var d = new XMLHttpRequest();
      d.open("GET", a, !0);
      d.responseType = "arraybuffer";
      d.onload = () => {
        200 == d.status || 0 == d.status && d.response ? b(d.response) : c();
      };
      d.onerror = c;
      d.send(null);
    } else {
      fetch(a, {credentials:"same-origin"}).then(e => e.ok ? e.arrayBuffer() : Promise.reject(Error(e.status + " : " + e.url))).then(b, c);
    }
  };
}
var ra = l.print || console.log.bind(console), sa = l.printErr || console.error.bind(console);
Object.assign(l, ma);
ma = null;
l.thisProgram && (na = l.thisProgram);
var ta;
l.wasmBinary && (ta = l.wasmBinary);
var ua, va = !1, B, D, E, wa, F, G, xa, ya;
function za() {
  var a = ua.buffer;
  l.HEAP8 = B = new Int8Array(a);
  l.HEAP16 = E = new Int16Array(a);
  l.HEAPU8 = D = new Uint8Array(a);
  l.HEAPU16 = wa = new Uint16Array(a);
  l.HEAP32 = F = new Int32Array(a);
  l.HEAPU32 = G = new Uint32Array(a);
  l.HEAPF32 = xa = new Float32Array(a);
  l.HEAPF64 = ya = new Float64Array(a);
}
var Aa = [], Ba = [], Ca = [];
function Da() {
  var a = l.preRun.shift();
  Aa.unshift(a);
}
var Ea = 0, Fa = null, Ga = null;
function Ha(a) {
  l.onAbort?.(a);
  a = "Aborted(" + a + ")";
  sa(a);
  va = !0;
  a = new WebAssembly.RuntimeError(a + ". Build with -sASSERTIONS for more info.");
  ba(a);
  throw a;
}
var Ia = a => a.startsWith("data:application/octet-stream;base64,"), qa = a => a.startsWith("file://"), Ja;
function Ka(a) {
  if (a == Ja && ta) {
    return new Uint8Array(ta);
  }
  if (pa) {
    return pa(a);
  }
  throw "both async and sync fetching of the wasm failed";
}
function La(a) {
  return ta ? Promise.resolve().then(() => Ka(a)) : new Promise((b, c) => {
    oa(a, d => b(new Uint8Array(d)), () => {
      try {
        b(Ka(a));
      } catch (d) {
        c(d);
      }
    });
  });
}
function Ma(a, b, c) {
  return La(a).then(d => WebAssembly.instantiate(d, b)).then(c, d => {
    sa(`failed to asynchronously prepare wasm: ${d}`);
    Ha(d);
  });
}
function Na(a, b) {
  var c = Ja;
  return ta || "function" != typeof WebAssembly.instantiateStreaming || Ia(c) || qa(c) || "function" != typeof fetch ? Ma(c, a, b) : fetch(c, {credentials:"same-origin"}).then(d => WebAssembly.instantiateStreaming(d, a).then(b, function(e) {
    sa(`wasm streaming compile failed: ${e}`);
    sa("falling back to ArrayBuffer instantiation");
    return Ma(c, a, b);
  }));
}
var Oa, Pa, Ta = {569016:(a, b, c, d, e) => {
  if ("undefined" === typeof window || void 0 === (window.AudioContext || window.webkitAudioContext)) {
    return 0;
  }
  if ("undefined" === typeof window.h) {
    window.h = {Ea:0};
    window.h.I = {};
    window.h.I.Ba = a;
    window.h.I.capture = b;
    window.h.I.Pa = c;
    window.h.ha = {};
    window.h.ha.stopped = d;
    window.h.ha.ub = e;
    let f = window.h;
    f.C = [];
    f.mc = function(g) {
      for (var k = 0; k < f.C.length; ++k) {
        if (null == f.C[k]) {
          return f.C[k] = g, k;
        }
      }
      f.C.push(g);
      return f.C.length - 1;
    };
    f.yb = function(g) {
      for (f.C[g] = null; 0 < f.C.length;) {
        if (null == f.C[f.C.length - 1]) {
          f.C.pop();
        } else {
          break;
        }
      }
    };
    f.Tc = function(g) {
      for (var k = 0; k < f.C.length; ++k) {
        if (f.C[k] == g) {
          return f.yb(k);
        }
      }
    };
    f.sa = function(g) {
      return f.C[g];
    };
    f.Xa = ["touchend", "click"];
    f.unlock = function() {
      for (var g = 0; g < f.C.length; ++g) {
        var k = f.C[g];
        null != k && null != k.K && k.state === f.ha.ub && k.K.resume().then(() => {
          Qa(k.nb);
        }, p => {
          console.error("Failed to resume audiocontext", p);
        });
      }
      f.Xa.map(function(p) {
        document.removeEventListener(p, f.unlock, !0);
      });
    };
    f.Xa.map(function(g) {
      document.addEventListener(g, f.unlock, !0);
    });
  }
  window.h.Ea += 1;
  return 1;
}, 571194:() => {
  "undefined" !== typeof window.h && (window.h.Xa.map(function(a) {
    document.removeEventListener(a, window.h.unlock, !0);
  }), --window.h.Ea, 0 === window.h.Ea && delete window.h);
}, 571498:() => void 0 !== navigator.mediaDevices && void 0 !== navigator.mediaDevices.getUserMedia, 571602:() => {
  try {
    var a = new (window.AudioContext || window.webkitAudioContext)(), b = a.sampleRate;
    a.close();
    return b;
  } catch (c) {
    return 0;
  }
}, 571773:(a, b, c, d, e, f) => {
  if ("undefined" === typeof window.h) {
    return -1;
  }
  var g = {}, k = {};
  a == window.h.I.Ba && 0 != c && (k.sampleRate = c);
  g.K = new (window.AudioContext || window.webkitAudioContext)(k);
  g.K.suspend();
  g.state = window.h.ha.stopped;
  c = 0;
  a != window.h.I.Ba && (c = b);
  g.Y = g.K.createScriptProcessor(d, c, b);
  g.Y.onaudioprocess = function(p) {
    if (null == g.ta || 0 == g.ta.length) {
      g.ta = new Float32Array(xa.buffer, e, d * b);
    }
    if (a == window.h.I.capture || a == window.h.I.Pa) {
      for (var m = 0; m < b; m += 1) {
        for (var t = p.inputBuffer.getChannelData(m), v = g.ta, x = 0; x < d; x += 1) {
          v[x * b + m] = t[x];
        }
      }
      Ra(f, d, e);
    }
    if (a == window.h.I.Ba || a == window.h.I.Pa) {
      for (Sa(f, d, e), m = 0; m < p.outputBuffer.numberOfChannels; ++m) {
        for (t = p.outputBuffer.getChannelData(m), v = g.ta, x = 0; x < d; x += 1) {
          t[x] = v[x * b + m];
        }
      }
    } else {
      for (m = 0; m < p.outputBuffer.numberOfChannels; ++m) {
        p.outputBuffer.getChannelData(m).fill(0.0);
      }
    }
  };
  a != window.h.I.capture && a != window.h.I.Pa || navigator.mediaDevices.getUserMedia({audio:!0, video:!1}).then(function(p) {
    g.Fa = g.K.createMediaStreamSource(p);
    g.Fa.connect(g.Y);
    g.Y.connect(g.K.destination);
  }).catch(function(p) {
    console.log("Failed to get user media: " + p);
  });
  a == window.h.I.Ba && g.Y.connect(g.K.destination);
  g.nb = f;
  return window.h.mc(g);
}, 574650:a => window.h.sa(a).K.sampleRate, 574723:a => {
  a = window.h.sa(a);
  void 0 !== a.Y && (a.Y.onaudioprocess = function() {
  }, a.Y.disconnect(), a.Y = void 0);
  void 0 !== a.Fa && (a.Fa.disconnect(), a.Fa = void 0);
  a.K.close();
  a.K = void 0;
  a.nb = void 0;
}, 575123:a => {
  window.h.yb(a);
}, 575173:a => {
  a = window.h.sa(a);
  a.K.resume();
  a.state = window.h.ha.ub;
}, 575312:a => {
  a = window.h.sa(a);
  a.K.suspend();
  a.state = window.h.ha.stopped;
}}, Ua = a => {
  for (; 0 < a.length;) {
    a.shift()(l);
  }
};
function Va() {
  var a = F[+Wa >> 2];
  Wa += 4;
  return a;
}
var Xa = (a, b) => {
  for (var c = 0, d = a.length - 1; 0 <= d; d--) {
    var e = a[d];
    "." === e ? a.splice(d, 1) : ".." === e ? (a.splice(d, 1), c++) : c && (a.splice(d, 1), c--);
  }
  if (b) {
    for (; c; c--) {
      a.unshift("..");
    }
  }
  return a;
}, Ya = a => {
  var b = "/" === a.charAt(0), c = "/" === a.substr(-1);
  (a = Xa(a.split("/").filter(d => !!d), !b).join("/")) || b || (a = ".");
  a && c && (a += "/");
  return (b ? "/" : "") + a;
}, Za = a => {
  var b = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/.exec(a).slice(1);
  a = b[0];
  b = b[1];
  if (!a && !b) {
    return ".";
  }
  b &&= b.substr(0, b.length - 1);
  return a + b;
}, $a = a => {
  if ("/" === a) {
    return "/";
  }
  a = Ya(a);
  a = a.replace(/\/$/, "");
  var b = a.lastIndexOf("/");
  return -1 === b ? a : a.substr(b + 1);
}, ab = () => {
  if ("object" == typeof crypto && "function" == typeof crypto.getRandomValues) {
    return a => crypto.getRandomValues(a);
  }
  Ha("initRandomDevice");
}, bb = a => (bb = ab())(a), cb = (...a) => {
  for (var b = "", c = !1, d = a.length - 1; -1 <= d && !c; d--) {
    c = 0 <= d ? a[d] : "/";
    if ("string" != typeof c) {
      throw new TypeError("Arguments to path.resolve must be strings");
    }
    if (!c) {
      return "";
    }
    b = c + "/" + b;
    c = "/" === c.charAt(0);
  }
  b = Xa(b.split("/").filter(e => !!e), !c).join("/");
  return (c ? "/" : "") + b || ".";
}, db = "undefined" != typeof TextDecoder ? new TextDecoder("utf8") : void 0, L = (a, b, c) => {
  var d = b + c;
  for (c = b; a[c] && !(c >= d);) {
    ++c;
  }
  if (16 < c - b && a.buffer && db) {
    return db.decode(a.subarray(b, c));
  }
  for (d = ""; b < c;) {
    var e = a[b++];
    if (e & 128) {
      var f = a[b++] & 63;
      if (192 == (e & 224)) {
        d += String.fromCharCode((e & 31) << 6 | f);
      } else {
        var g = a[b++] & 63;
        e = 224 == (e & 240) ? (e & 15) << 12 | f << 6 | g : (e & 7) << 18 | f << 12 | g << 6 | a[b++] & 63;
        65536 > e ? d += String.fromCharCode(e) : (e -= 65536, d += String.fromCharCode(55296 | e >> 10, 56320 | e & 1023));
      }
    } else {
      d += String.fromCharCode(e);
    }
  }
  return d;
}, eb = [], fb = a => {
  for (var b = 0, c = 0; c < a.length; ++c) {
    var d = a.charCodeAt(c);
    127 >= d ? b++ : 2047 >= d ? b += 2 : 55296 <= d && 57343 >= d ? (b += 4, ++c) : b += 3;
  }
  return b;
}, gb = (a, b, c, d) => {
  if (!(0 < d)) {
    return 0;
  }
  var e = c;
  d = c + d - 1;
  for (var f = 0; f < a.length; ++f) {
    var g = a.charCodeAt(f);
    if (55296 <= g && 57343 >= g) {
      var k = a.charCodeAt(++f);
      g = 65536 + ((g & 1023) << 10) | k & 1023;
    }
    if (127 >= g) {
      if (c >= d) {
        break;
      }
      b[c++] = g;
    } else {
      if (2047 >= g) {
        if (c + 1 >= d) {
          break;
        }
        b[c++] = 192 | g >> 6;
      } else {
        if (65535 >= g) {
          if (c + 2 >= d) {
            break;
          }
          b[c++] = 224 | g >> 12;
        } else {
          if (c + 3 >= d) {
            break;
          }
          b[c++] = 240 | g >> 18;
          b[c++] = 128 | g >> 12 & 63;
        }
        b[c++] = 128 | g >> 6 & 63;
      }
      b[c++] = 128 | g & 63;
    }
  }
  b[c] = 0;
  return c - e;
};
function hb(a, b) {
  var c = Array(fb(a) + 1);
  a = gb(a, c, 0, c.length);
  b && (c.length = a);
  return c;
}
var ib = [];
function jb(a, b) {
  ib[a] = {input:[], H:[], V:b};
  kb(a, lb);
}
var lb = {open(a) {
  var b = ib[a.node.Da];
  if (!b) {
    throw new M(43);
  }
  a.s = b;
  a.seekable = !1;
}, close(a) {
  a.s.V.ra(a.s);
}, ra(a) {
  a.s.V.ra(a.s);
}, read(a, b, c, d) {
  if (!a.s || !a.s.V.hb) {
    throw new M(60);
  }
  for (var e = 0, f = 0; f < d; f++) {
    try {
      var g = a.s.V.hb(a.s);
    } catch (k) {
      throw new M(29);
    }
    if (void 0 === g && 0 === e) {
      throw new M(6);
    }
    if (null === g || void 0 === g) {
      break;
    }
    e++;
    b[c + f] = g;
  }
  e && (a.node.timestamp = Date.now());
  return e;
}, write(a, b, c, d) {
  if (!a.s || !a.s.V.Sa) {
    throw new M(60);
  }
  try {
    for (var e = 0; e < d; e++) {
      a.s.V.Sa(a.s, b[c + e]);
    }
  } catch (f) {
    throw new M(29);
  }
  d && (a.node.timestamp = Date.now());
  return e;
},}, mb = {hb() {
  a: {
    if (!eb.length) {
      var a = null;
      "undefined" != typeof window && "function" == typeof window.prompt && (a = window.prompt("Input: "), null !== a && (a += "\n"));
      if (!a) {
        a = null;
        break a;
      }
      eb = hb(a, !0);
    }
    a = eb.shift();
  }
  return a;
}, Sa(a, b) {
  null === b || 10 === b ? (ra(L(a.H, 0)), a.H = []) : 0 != b && a.H.push(b);
}, ra(a) {
  a.H && 0 < a.H.length && (ra(L(a.H, 0)), a.H = []);
}, Wb() {
  return {xc:25856, zc:5, wc:191, yc:35387, vc:[3, 28, 127, 21, 4, 0, 1, 0, 17, 19, 26, 0, 18, 15, 23, 22, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,]};
}, Xb() {
  return 0;
}, Yb() {
  return [24, 80];
},}, nb = {Sa(a, b) {
  null === b || 10 === b ? (sa(L(a.H, 0)), a.H = []) : 0 != b && a.H.push(b);
}, ra(a) {
  a.H && 0 < a.H.length && (sa(L(a.H, 0)), a.H = []);
},};
function pb(a, b) {
  var c = a.l ? a.l.length : 0;
  c >= b || (b = Math.max(b, c * (1048576 > c ? 2.0 : 1.125) >>> 0), 0 != c && (b = Math.max(b, 256)), c = a.l, a.l = new Uint8Array(b), 0 < a.v && a.l.set(c.subarray(0, a.v), 0));
}
var N = {N:null, U() {
  return N.createNode(null, "/", 16895, 0);
}, createNode(a, b, c, d) {
  if (24576 === (c & 61440) || 4096 === (c & 61440)) {
    throw new M(63);
  }
  N.N || (N.N = {dir:{node:{X:N.j.X, P:N.j.P, ka:N.j.ka, za:N.j.za, sb:N.j.sb, xb:N.j.xb, tb:N.j.tb, rb:N.j.rb, Ga:N.j.Ga}, stream:{aa:N.m.aa}}, file:{node:{X:N.j.X, P:N.j.P}, stream:{aa:N.m.aa, read:N.m.read, write:N.m.write, $a:N.m.$a, jb:N.m.jb, lb:N.m.lb}}, link:{node:{X:N.j.X, P:N.j.P, la:N.j.la}, stream:{}}, ab:{node:{X:N.j.X, P:N.j.P}, stream:qb}});
  c = rb(a, b, c, d);
  16384 === (c.mode & 61440) ? (c.j = N.N.dir.node, c.m = N.N.dir.stream, c.l = {}) : 32768 === (c.mode & 61440) ? (c.j = N.N.file.node, c.m = N.N.file.stream, c.v = 0, c.l = null) : 40960 === (c.mode & 61440) ? (c.j = N.N.link.node, c.m = N.N.link.stream) : 8192 === (c.mode & 61440) && (c.j = N.N.ab.node, c.m = N.N.ab.stream);
  c.timestamp = Date.now();
  a && (a.l[b] = c, a.timestamp = c.timestamp);
  return c;
}, Fc(a) {
  return a.l ? a.l.subarray ? a.l.subarray(0, a.v) : new Uint8Array(a.l) : new Uint8Array(0);
}, j:{X(a) {
  var b = {};
  b.Cc = 8192 === (a.mode & 61440) ? a.id : 1;
  b.Hc = a.id;
  b.mode = a.mode;
  b.Nc = 1;
  b.uid = 0;
  b.Gc = 0;
  b.Da = a.Da;
  16384 === (a.mode & 61440) ? b.size = 4096 : 32768 === (a.mode & 61440) ? b.size = a.v : 40960 === (a.mode & 61440) ? b.size = a.link.length : b.size = 0;
  b.tc = new Date(a.timestamp);
  b.Mc = new Date(a.timestamp);
  b.Ac = new Date(a.timestamp);
  b.Gb = 4096;
  b.uc = Math.ceil(b.size / b.Gb);
  return b;
}, P(a, b) {
  void 0 !== b.mode && (a.mode = b.mode);
  void 0 !== b.timestamp && (a.timestamp = b.timestamp);
  if (void 0 !== b.size && (b = b.size, a.v != b)) {
    if (0 == b) {
      a.l = null, a.v = 0;
    } else {
      var c = a.l;
      a.l = new Uint8Array(b);
      c && a.l.set(c.subarray(0, Math.min(b, a.v)));
      a.v = b;
    }
  }
}, ka() {
  throw sb[44];
}, za(a, b, c, d) {
  return N.createNode(a, b, c, d);
}, sb(a, b, c) {
  if (16384 === (a.mode & 61440)) {
    try {
      var d = tb(b, c);
    } catch (f) {
    }
    if (d) {
      for (var e in d.l) {
        throw new M(55);
      }
    }
  }
  delete a.parent.l[a.name];
  a.parent.timestamp = Date.now();
  a.name = c;
  b.l[c] = a;
  b.timestamp = a.parent.timestamp;
}, xb(a, b) {
  delete a.l[b];
  a.timestamp = Date.now();
}, tb(a, b) {
  var c = tb(a, b), d;
  for (d in c.l) {
    throw new M(55);
  }
  delete a.l[b];
  a.timestamp = Date.now();
}, rb(a) {
  var b = [".", ".."], c;
  for (c of Object.keys(a.l)) {
    b.push(c);
  }
  return b;
}, Ga(a, b, c) {
  a = N.createNode(a, b, 41471, 0);
  a.link = c;
  return a;
}, la(a) {
  if (40960 !== (a.mode & 61440)) {
    throw new M(28);
  }
  return a.link;
},}, m:{read(a, b, c, d, e) {
  var f = a.node.l;
  if (e >= a.node.v) {
    return 0;
  }
  a = Math.min(a.node.v - e, d);
  if (8 < a && f.subarray) {
    b.set(f.subarray(e, e + a), c);
  } else {
    for (d = 0; d < a; d++) {
      b[c + d] = f[e + d];
    }
  }
  return a;
}, write(a, b, c, d, e, f) {
  b.buffer === B.buffer && (f = !1);
  if (!d) {
    return 0;
  }
  a = a.node;
  a.timestamp = Date.now();
  if (b.subarray && (!a.l || a.l.subarray)) {
    if (f) {
      return a.l = b.subarray(c, c + d), a.v = d;
    }
    if (0 === a.v && 0 === e) {
      return a.l = b.slice(c, c + d), a.v = d;
    }
    if (e + d <= a.v) {
      return a.l.set(b.subarray(c, c + d), e), d;
    }
  }
  pb(a, e + d);
  if (a.l.subarray && b.subarray) {
    a.l.set(b.subarray(c, c + d), e);
  } else {
    for (f = 0; f < d; f++) {
      a.l[e + f] = b[c + f];
    }
  }
  a.v = Math.max(a.v, e + d);
  return d;
}, aa(a, b, c) {
  1 === c ? b += a.position : 2 === c && 32768 === (a.node.mode & 61440) && (b += a.node.v);
  if (0 > b) {
    throw new M(28);
  }
  return b;
}, $a(a, b, c) {
  pb(a.node, b + c);
  a.node.v = Math.max(a.node.v, b + c);
}, jb(a, b, c, d, e) {
  if (32768 !== (a.node.mode & 61440)) {
    throw new M(43);
  }
  a = a.node.l;
  if (e & 2 || a.buffer !== B.buffer) {
    if (0 < c || c + b < a.length) {
      a.subarray ? a = a.subarray(c, c + b) : a = Array.prototype.slice.call(a, c, c + b);
    }
    c = !0;
    Ha();
    b = void 0;
    if (!b) {
      throw new M(48);
    }
    B.set(a, b);
  } else {
    c = !1, b = a.byteOffset;
  }
  return {o:b, sc:c};
}, lb(a, b, c, d) {
  N.m.write(a, b, 0, d, c, !1);
  return 0;
},},}, ub = (a, b) => {
  var c = 0;
  a && (c |= 365);
  b && (c |= 146);
  return c;
}, vb = null, wb = {}, xb = [], yb = 1, zb = null, Ab = !0, M = class {
  constructor(a) {
    this.name = "ErrnoError";
    this.$ = a;
  }
}, sb = {}, Bb = class {
  constructor() {
    this.h = {};
    this.node = null;
  }
  get flags() {
    return this.h.flags;
  }
  set flags(a) {
    this.h.flags = a;
  }
  get position() {
    return this.h.position;
  }
  set position(a) {
    this.h.position = a;
  }
}, Cb = class {
  constructor(a, b, c, d) {
    a ||= this;
    this.parent = a;
    this.U = a.U;
    this.Aa = null;
    this.id = yb++;
    this.name = b;
    this.mode = c;
    this.j = {};
    this.m = {};
    this.Da = d;
  }
  get read() {
    return 365 === (this.mode & 365);
  }
  set read(a) {
    a ? this.mode |= 365 : this.mode &= -366;
  }
  get write() {
    return 146 === (this.mode & 146);
  }
  set write(a) {
    a ? this.mode |= 146 : this.mode &= -147;
  }
};
function Db(a, b = {}) {
  a = cb(a);
  if (!a) {
    return {path:"", node:null};
  }
  b = Object.assign({gb:!0, Ua:0}, b);
  if (8 < b.Ua) {
    throw new M(32);
  }
  a = a.split("/").filter(g => !!g);
  for (var c = vb, d = "/", e = 0; e < a.length; e++) {
    var f = e === a.length - 1;
    if (f && b.parent) {
      break;
    }
    c = tb(c, a[e]);
    d = Ya(d + "/" + a[e]);
    c.Aa && (!f || f && b.gb) && (c = c.Aa.root);
    if (!f || b.fb) {
      for (f = 0; 40960 === (c.mode & 61440);) {
        if (c = Eb(d), d = cb(Za(d), c), c = Db(d, {Ua:b.Ua + 1}).node, 40 < f++) {
          throw new M(32);
        }
      }
    }
  }
  return {path:d, node:c};
}
function Fb(a) {
  for (var b;;) {
    if (a === a.parent) {
      return a = a.U.kb, b ? "/" !== a[a.length - 1] ? `${a}/${b}` : a + b : a;
    }
    b = b ? `${a.name}/${b}` : a.name;
    a = a.parent;
  }
}
function Gb(a, b) {
  for (var c = 0, d = 0; d < b.length; d++) {
    c = (c << 5) - c + b.charCodeAt(d) | 0;
  }
  return (a + c >>> 0) % zb.length;
}
function tb(a, b) {
  var c = 16384 === (a.mode & 61440) ? (c = Hb(a, "x")) ? c : a.j.ka ? 0 : 2 : 54;
  if (c) {
    throw new M(c);
  }
  for (c = zb[Gb(a.id, b)]; c; c = c.ac) {
    var d = c.name;
    if (c.parent.id === a.id && d === b) {
      return c;
    }
  }
  return a.j.ka(a, b);
}
function rb(a, b, c, d) {
  a = new Cb(a, b, c, d);
  b = Gb(a.parent.id, a.name);
  a.ac = zb[b];
  return zb[b] = a;
}
function Ib(a) {
  var b = ["r", "w", "rw"][a & 3];
  a & 512 && (b += "w");
  return b;
}
function Hb(a, b) {
  if (Ab) {
    return 0;
  }
  if (!b.includes("r") || a.mode & 292) {
    if (b.includes("w") && !(a.mode & 146) || b.includes("x") && !(a.mode & 73)) {
      return 2;
    }
  } else {
    return 2;
  }
  return 0;
}
function Jb(a, b) {
  try {
    return tb(a, b), 20;
  } catch (c) {
  }
  return Hb(a, "wx");
}
function Kb(a) {
  a = xb[a];
  if (!a) {
    throw new M(8);
  }
  return a;
}
function Lb(a, b = -1) {
  a = Object.assign(new Bb(), a);
  if (-1 == b) {
    a: {
      for (b = 0; 4096 >= b; b++) {
        if (!xb[b]) {
          break a;
        }
      }
      throw new M(33);
    }
  }
  a.W = b;
  return xb[b] = a;
}
function Mb(a, b = -1) {
  a = Lb(a, b);
  a.m?.Ec?.(a);
  return a;
}
var qb = {open(a) {
  a.m = wb[a.node.Da].m;
  a.m.open?.(a);
}, aa() {
  throw new M(70);
},};
function kb(a, b) {
  wb[a] = {m:b};
}
function Nb(a, b) {
  var c = "/" === b;
  if (c && vb) {
    throw new M(10);
  }
  if (!c && b) {
    var d = Db(b, {gb:!1});
    b = d.path;
    d = d.node;
    if (d.Aa) {
      throw new M(10);
    }
    if (16384 !== (d.mode & 61440)) {
      throw new M(54);
    }
  }
  b = {type:a, Pc:{}, kb:b, Zb:[]};
  a = a.U(b);
  a.U = b;
  b.root = a;
  c ? vb = a : d && (d.Aa = b, d.U && d.U.Zb.push(b));
}
function Ob(a, b, c) {
  var d = Db(a, {parent:!0}).node;
  a = $a(a);
  if (!a || "." === a || ".." === a) {
    throw new M(28);
  }
  var e = Jb(d, a);
  if (e) {
    throw new M(e);
  }
  if (!d.j.za) {
    throw new M(63);
  }
  return d.j.za(d, a, b, c);
}
function Pb(a) {
  return Ob(a, 16895, 0);
}
function Qb(a, b, c) {
  "undefined" == typeof c && (c = b, b = 438);
  Ob(a, b | 8192, c);
}
function Rb(a, b) {
  if (!cb(a)) {
    throw new M(44);
  }
  var c = Db(b, {parent:!0}).node;
  if (!c) {
    throw new M(44);
  }
  b = $a(b);
  var d = Jb(c, b);
  if (d) {
    throw new M(d);
  }
  if (!c.j.Ga) {
    throw new M(63);
  }
  c.j.Ga(c, b, a);
}
function Eb(a) {
  a = Db(a).node;
  if (!a) {
    throw new M(44);
  }
  if (!a.j.la) {
    throw new M(28);
  }
  return cb(Fb(a.parent), a.j.la(a));
}
function Sb(a, b, c) {
  if ("" === a) {
    throw new M(44);
  }
  if ("string" == typeof b) {
    var d = {r:0, "r+":2, w:577, "w+":578, a:1089, "a+":1090,}[b];
    if ("undefined" == typeof d) {
      throw Error(`Unknown file open mode: ${b}`);
    }
    b = d;
  }
  c = b & 64 ? ("undefined" == typeof c ? 438 : c) & 4095 | 32768 : 0;
  if ("object" == typeof a) {
    var e = a;
  } else {
    a = Ya(a);
    try {
      e = Db(a, {fb:!(b & 131072)}).node;
    } catch (f) {
    }
  }
  d = !1;
  if (b & 64) {
    if (e) {
      if (b & 128) {
        throw new M(20);
      }
    } else {
      e = Ob(a, c, 0), d = !0;
    }
  }
  if (!e) {
    throw new M(44);
  }
  8192 === (e.mode & 61440) && (b &= -513);
  if (b & 65536 && 16384 !== (e.mode & 61440)) {
    throw new M(54);
  }
  if (!d && (c = e ? 40960 === (e.mode & 61440) ? 32 : 16384 === (e.mode & 61440) && ("r" !== Ib(b) || b & 512) ? 31 : Hb(e, Ib(b)) : 44)) {
    throw new M(c);
  }
  if (b & 512 && !d) {
    c = e;
    c = "string" == typeof c ? Db(c, {fb:!0}).node : c;
    if (!c.j.P) {
      throw new M(63);
    }
    if (16384 === (c.mode & 61440)) {
      throw new M(31);
    }
    if (32768 !== (c.mode & 61440)) {
      throw new M(28);
    }
    if (d = Hb(c, "w")) {
      throw new M(d);
    }
    c.j.P(c, {size:0, timestamp:Date.now()});
  }
  b &= -131713;
  e = Lb({node:e, path:Fb(e), flags:b, seekable:!0, position:0, m:e.m, nc:[], error:!1});
  e.m.open && e.m.open(e);
  !l.logReadFiles || b & 1 || (Tb ||= {}, a in Tb || (Tb[a] = 1));
  return e;
}
function Ub(a, b, c) {
  if (null === a.W) {
    throw new M(8);
  }
  if (!a.seekable || !a.m.aa) {
    throw new M(70);
  }
  if (0 != c && 1 != c && 2 != c) {
    throw new M(28);
  }
  a.position = a.m.aa(a, b, c);
  a.nc = [];
}
var Vb;
function Wb(a, b, c) {
  a = Ya("/dev/" + a);
  var d = ub(!!b, !!c);
  Xb ||= 64;
  var e = Xb++ << 8 | 0;
  kb(e, {open(f) {
    f.seekable = !1;
  }, close() {
    c?.buffer?.length && c(10);
  }, read(f, g, k, p) {
    for (var m = 0, t = 0; t < p; t++) {
      try {
        var v = b();
      } catch (x) {
        throw new M(29);
      }
      if (void 0 === v && 0 === m) {
        throw new M(6);
      }
      if (null === v || void 0 === v) {
        break;
      }
      m++;
      g[k + t] = v;
    }
    m && (f.node.timestamp = Date.now());
    return m;
  }, write(f, g, k, p) {
    for (var m = 0; m < p; m++) {
      try {
        c(g[k + m]);
      } catch (t) {
        throw new M(29);
      }
    }
    p && (f.node.timestamp = Date.now());
    return m;
  }});
  Qb(a, d, e);
}
var Xb, Yb = {}, Tb, Wa = void 0, Zb = (a, b) => Object.defineProperty(b, "name", {value:a}), $b = [], O = [], P, Q = a => {
  if (!a) {
    throw new P("Cannot use deleted val. handle = " + a);
  }
  return O[a];
}, ac = a => {
  switch(a) {
    case void 0:
      return 2;
    case null:
      return 4;
    case !0:
      return 6;
    case !1:
      return 8;
    default:
      const b = $b.pop() || O.length;
      O[b] = a;
      O[b + 1] = 1;
      return b;
  }
}, bc = a => {
  var b = Error, c = Zb(a, function(d) {
    this.name = a;
    this.message = d;
    d = Error(d).stack;
    void 0 !== d && (this.stack = this.toString() + "\n" + d.replace(/^Error(:[^\n]*)?\n/, ""));
  });
  c.prototype = Object.create(b.prototype);
  c.prototype.constructor = c;
  c.prototype.toString = function() {
    return void 0 === this.message ? this.name : `${this.name}: ${this.message}`;
  };
  return c;
}, cc, dc, R = a => {
  for (var b = ""; D[a];) {
    b += dc[D[a++]];
  }
  return b;
}, ec = [], fc = () => {
  for (; ec.length;) {
    var a = ec.pop();
    a.g.ga = !1;
    a["delete"]();
  }
}, gc, hc = {}, ic = (a, b) => {
  if (void 0 === b) {
    throw new P("ptr should not be undefined");
  }
  for (; a.B;) {
    b = a.na(b), a = a.B;
  }
  return b;
}, jc = {}, mc = a => {
  a = kc(a);
  var b = R(a);
  lc(a);
  return b;
}, nc = (a, b) => {
  var c = jc[a];
  if (void 0 === c) {
    throw a = `${b} has unknown type ${mc(a)}`, new P(a);
  }
  return c;
}, oc = () => {
}, pc = !1, qc = (a, b, c) => {
  if (b === c) {
    return a;
  }
  if (void 0 === c.B) {
    return null;
  }
  a = qc(a, b, c.B);
  return null === a ? null : c.Jb(a);
}, rc = {}, sc = (a, b) => {
  b = ic(a, b);
  return hc[b];
}, tc, vc = (a, b) => {
  if (!b.u || !b.o) {
    throw new tc("makeClassHandle requires ptr and ptrType");
  }
  if (!!b.J !== !!b.D) {
    throw new tc("Both smartPtrType and smartPtr must be specified");
  }
  b.count = {value:1};
  return uc(Object.create(a, {g:{value:b, writable:!0,},}));
}, uc = a => {
  if ("undefined" === typeof FinalizationRegistry) {
    return uc = b => b, a;
  }
  pc = new FinalizationRegistry(b => {
    b = b.g;
    --b.count.value;
    0 === b.count.value && (b.D ? b.J.O(b.D) : b.u.i.O(b.o));
  });
  uc = b => {
    var c = b.g;
    c.D && pc.register(b, {g:c}, b);
    return b;
  };
  oc = b => {
    pc.unregister(b);
  };
  return uc(a);
}, wc = {}, xc = a => {
  for (; a.length;) {
    var b = a.pop();
    a.pop()(b);
  }
};
function yc(a) {
  return this.fromWireType(G[a >> 2]);
}
var zc = {}, Ac = {}, T = (a, b, c) => {
  function d(k) {
    k = c(k);
    if (k.length !== a.length) {
      throw new tc("Mismatched type converter count");
    }
    for (var p = 0; p < a.length; ++p) {
      S(a[p], k[p]);
    }
  }
  a.forEach(function(k) {
    Ac[k] = b;
  });
  var e = Array(b.length), f = [], g = 0;
  b.forEach((k, p) => {
    jc.hasOwnProperty(k) ? e[p] = jc[k] : (f.push(k), zc.hasOwnProperty(k) || (zc[k] = []), zc[k].push(() => {
      e[p] = jc[k];
      ++g;
      g === f.length && d(e);
    }));
  });
  0 === f.length && d(e);
};
function Bc(a, b, c = {}) {
  var d = b.name;
  if (!a) {
    throw new P(`type "${d}" must have a positive integer typeid pointer`);
  }
  if (jc.hasOwnProperty(a)) {
    if (c.Tb) {
      return;
    }
    throw new P(`Cannot register type '${d}' twice`);
  }
  jc[a] = b;
  delete Ac[a];
  zc.hasOwnProperty(a) && (b = zc[a], delete zc[a], b.forEach(e => e()));
}
function S(a, b, c = {}) {
  if (!("argPackAdvance" in b)) {
    throw new TypeError("registerType registeredInstance requires argPackAdvance");
  }
  return Bc(a, b, c);
}
var Cc = a => {
  throw new P(a.g.u.i.name + " instance already deleted");
};
function Dc() {
}
var Ec = (a, b, c) => {
  if (void 0 === a[b].A) {
    var d = a[b];
    a[b] = function(...e) {
      if (!a[b].A.hasOwnProperty(e.length)) {
        throw new P(`Function '${c}' called with an invalid number of arguments (${e.length}) - expects one of (${a[b].A})!`);
      }
      return a[b].A[e.length].apply(this, e);
    };
    a[b].A = [];
    a[b].A[d.fa] = d;
  }
}, Fc = (a, b, c) => {
  if (l.hasOwnProperty(a)) {
    if (void 0 === c || void 0 !== l[a].A && void 0 !== l[a].A[c]) {
      throw new P(`Cannot register public name '${a}' twice`);
    }
    Ec(l, a, a);
    if (l.hasOwnProperty(c)) {
      throw new P(`Cannot register multiple overloads of a function with the same number of arguments (${c})!`);
    }
    l[a].A[c] = b;
  } else {
    l[a] = b, void 0 !== c && (l[a].Oc = c);
  }
}, Gc = a => {
  if (void 0 === a) {
    return "_unknown";
  }
  a = a.replace(/[^a-zA-Z0-9_]/g, "$");
  var b = a.charCodeAt(0);
  return 48 <= b && 57 >= b ? `_${a}` : a;
};
function Hc(a, b, c, d, e, f, g, k) {
  this.name = a;
  this.constructor = b;
  this.M = c;
  this.O = d;
  this.B = e;
  this.Ob = f;
  this.na = g;
  this.Jb = k;
  this.ob = [];
}
var Ic = (a, b, c) => {
  for (; b !== c;) {
    if (!b.na) {
      throw new P(`Expected null or instance of ${c.name}, got an instance of ${b.name}`);
    }
    a = b.na(a);
    b = b.B;
  }
  return a;
};
function Jc(a, b) {
  if (null === b) {
    if (this.Ra) {
      throw new P(`null is not a valid ${this.name}`);
    }
    return 0;
  }
  if (!b.g) {
    throw new P(`Cannot pass "${Kc(b)}" as a ${this.name}`);
  }
  if (!b.g.o) {
    throw new P(`Cannot pass deleted object as a pointer of type ${this.name}`);
  }
  return Ic(b.g.o, b.g.u.i, this.i);
}
function Lc(a, b) {
  if (null === b) {
    if (this.Ra) {
      throw new P(`null is not a valid ${this.name}`);
    }
    if (this.va) {
      var c = this.Ta();
      null !== a && a.push(this.O, c);
      return c;
    }
    return 0;
  }
  if (!b || !b.g) {
    throw new P(`Cannot pass "${Kc(b)}" as a ${this.name}`);
  }
  if (!b.g.o) {
    throw new P(`Cannot pass deleted object as a pointer of type ${this.name}`);
  }
  if (!this.ua && b.g.u.ua) {
    throw new P(`Cannot convert argument of type ${b.g.J ? b.g.J.name : b.g.u.name} to parameter type ${this.name}`);
  }
  c = Ic(b.g.o, b.g.u.i, this.i);
  if (this.va) {
    if (void 0 === b.g.D) {
      throw new P("Passing raw pointer to smart pointer is illegal");
    }
    switch(this.hc) {
      case 0:
        if (b.g.J === this) {
          c = b.g.D;
        } else {
          throw new P(`Cannot convert argument of type ${b.g.J ? b.g.J.name : b.g.u.name} to parameter type ${this.name}`);
        }
        break;
      case 1:
        c = b.g.D;
        break;
      case 2:
        if (b.g.J === this) {
          c = b.g.D;
        } else {
          var d = b.clone();
          c = this.cc(c, ac(() => d["delete"]()));
          null !== a && a.push(this.O, c);
        }
        break;
      default:
        throw new P("Unsupporting sharing policy");
    }
  }
  return c;
}
function Mc(a, b) {
  if (null === b) {
    if (this.Ra) {
      throw new P(`null is not a valid ${this.name}`);
    }
    return 0;
  }
  if (!b.g) {
    throw new P(`Cannot pass "${Kc(b)}" as a ${this.name}`);
  }
  if (!b.g.o) {
    throw new P(`Cannot pass deleted object as a pointer of type ${this.name}`);
  }
  if (b.g.u.ua) {
    throw new P(`Cannot convert argument of type ${b.g.u.name} to parameter type ${this.name}`);
  }
  return Ic(b.g.o, b.g.u.i, this.i);
}
function Nc(a, b, c, d, e, f, g, k, p, m, t) {
  this.name = a;
  this.i = b;
  this.Ra = c;
  this.ua = d;
  this.va = e;
  this.bc = f;
  this.hc = g;
  this.qb = k;
  this.Ta = p;
  this.cc = m;
  this.O = t;
  e || void 0 !== b.B ? this.toWireType = Lc : (this.toWireType = d ? Jc : Mc, this.L = null);
}
var Oc = (a, b, c) => {
  if (!l.hasOwnProperty(a)) {
    throw new tc("Replacing nonexistent public symbol");
  }
  void 0 !== l[a].A && void 0 !== c ? l[a].A[c] = b : (l[a] = b, l[a].fa = c);
}, Pc = [], Qc, Rc = a => {
  var b = Pc[a];
  b || (a >= Pc.length && (Pc.length = a + 1), Pc[a] = b = Qc.get(a));
  return b;
}, Sc = (a, b, c = []) => {
  a.includes("j") ? (a = a.replace(/p/g, "i"), b = (0,l["dynCall_" + a])(b, ...c)) : b = Rc(b)(...c);
  return b;
}, Tc = (a, b) => (...c) => Sc(a, b, c), U = (a, b) => {
  a = R(a);
  var c = a.includes("j") ? Tc(a, b) : Rc(b);
  if ("function" != typeof c) {
    throw new P(`unknown function pointer with signature ${a}: ${b}`);
  }
  return c;
}, Uc, Vc = (a, b) => {
  function c(f) {
    e[f] || jc[f] || (Ac[f] ? Ac[f].forEach(c) : (d.push(f), e[f] = !0));
  }
  var d = [], e = {};
  b.forEach(c);
  throw new Uc(`${a}: ` + d.map(mc).join([", "]));
};
function Wc(a) {
  for (var b = 1; b < a.length; ++b) {
    if (null !== a[b] && void 0 === a[b].L) {
      return !0;
    }
  }
  return !1;
}
function Xc(a, b, c, d, e) {
  var f = b.length;
  if (2 > f) {
    throw new P("argTypes array size mismatch! Must at least get return value and 'this' types!");
  }
  var g = null !== b[1] && null !== c, k = Wc(b), p = "void" !== b[0].name, m = f - 2, t = Array(m), v = [], x = [];
  return Zb(a, function(...n) {
    if (n.length !== m) {
      throw new P(`function ${a} called with ${n.length} arguments, expected ${m}`);
    }
    x.length = 0;
    v.length = g ? 2 : 1;
    v[0] = e;
    if (g) {
      var r = b[1].toWireType(x, this);
      v[1] = r;
    }
    for (var u = 0; u < m; ++u) {
      t[u] = b[u + 2].toWireType(x, n[u]), v.push(t[u]);
    }
    n = d(...v);
    if (k) {
      xc(x);
    } else {
      for (u = g ? 1 : 2; u < b.length; u++) {
        var z = 1 === u ? r : t[u - 2];
        null !== b[u].L && b[u].L(z);
      }
    }
    r = p ? b[0].fromWireType(n) : void 0;
    return r;
  });
}
var Yc = (a, b) => {
  for (var c = [], d = 0; d < a; d++) {
    c.push(G[b + 4 * d >> 2]);
  }
  return c;
}, Zc = a => {
  a = a.trim();
  const b = a.indexOf("(");
  return -1 !== b ? a.substr(0, b) : a;
}, $c = (a, b, c) => {
  if (!(a instanceof Object)) {
    throw new P(`${c} with invalid "this": ${a}`);
  }
  if (!(a instanceof b.i.constructor)) {
    throw new P(`${c} incompatible with "this" of type ${a.constructor.name}`);
  }
  if (!a.g.o) {
    throw new P(`cannot call emscripten binding method ${c} on deleted object`);
  }
  return Ic(a.g.o, a.g.u.i, b.i);
}, ad = a => {
  9 < a && 0 === --O[a + 1] && (O[a] = void 0, $b.push(a));
}, bd = {name:"emscripten::val", fromWireType:a => {
  var b = Q(a);
  ad(a);
  return b;
}, toWireType:(a, b) => ac(b), argPackAdvance:8, readValueFromPointer:yc, L:null,}, cd = (a, b, c) => {
  switch(b) {
    case 1:
      return c ? function(d) {
        return this.fromWireType(B[d]);
      } : function(d) {
        return this.fromWireType(D[d]);
      };
    case 2:
      return c ? function(d) {
        return this.fromWireType(E[d >> 1]);
      } : function(d) {
        return this.fromWireType(wa[d >> 1]);
      };
    case 4:
      return c ? function(d) {
        return this.fromWireType(F[d >> 2]);
      } : function(d) {
        return this.fromWireType(G[d >> 2]);
      };
    default:
      throw new TypeError(`invalid integer width (${b}): ${a}`);
  }
}, Kc = a => {
  if (null === a) {
    return "null";
  }
  var b = typeof a;
  return "object" === b || "array" === b || "function" === b ? a.toString() : "" + a;
}, dd = (a, b) => {
  switch(b) {
    case 4:
      return function(c) {
        return this.fromWireType(xa[c >> 2]);
      };
    case 8:
      return function(c) {
        return this.fromWireType(ya[c >> 3]);
      };
    default:
      throw new TypeError(`invalid float width (${b}): ${a}`);
  }
}, ed = (a, b, c) => {
  switch(b) {
    case 1:
      return c ? d => B[d] : d => D[d];
    case 2:
      return c ? d => E[d >> 1] : d => wa[d >> 1];
    case 4:
      return c ? d => F[d >> 2] : d => G[d >> 2];
    default:
      throw new TypeError(`invalid integer width (${b}): ${a}`);
  }
}, fd = "undefined" != typeof TextDecoder ? new TextDecoder("utf-16le") : void 0, gd = (a, b) => {
  var c = a >> 1;
  for (var d = c + b / 2; !(c >= d) && wa[c];) {
    ++c;
  }
  c <<= 1;
  if (32 < c - a && fd) {
    return fd.decode(D.subarray(a, c));
  }
  c = "";
  for (d = 0; !(d >= b / 2); ++d) {
    var e = E[a + 2 * d >> 1];
    if (0 == e) {
      break;
    }
    c += String.fromCharCode(e);
  }
  return c;
}, hd = (a, b, c) => {
  c ??= 2147483647;
  if (2 > c) {
    return 0;
  }
  c -= 2;
  var d = b;
  c = c < 2 * a.length ? c / 2 : a.length;
  for (var e = 0; e < c; ++e) {
    E[b >> 1] = a.charCodeAt(e), b += 2;
  }
  E[b >> 1] = 0;
  return b - d;
}, jd = a => 2 * a.length, kd = (a, b) => {
  for (var c = 0, d = ""; !(c >= b / 4);) {
    var e = F[a + 4 * c >> 2];
    if (0 == e) {
      break;
    }
    ++c;
    65536 <= e ? (e -= 65536, d += String.fromCharCode(55296 | e >> 10, 56320 | e & 1023)) : d += String.fromCharCode(e);
  }
  return d;
}, ld = (a, b, c) => {
  c ??= 2147483647;
  if (4 > c) {
    return 0;
  }
  var d = b;
  c = d + c - 4;
  for (var e = 0; e < a.length; ++e) {
    var f = a.charCodeAt(e);
    if (55296 <= f && 57343 >= f) {
      var g = a.charCodeAt(++e);
      f = 65536 + ((f & 1023) << 10) | g & 1023;
    }
    F[b >> 2] = f;
    b += 4;
    if (b + 4 > c) {
      break;
    }
  }
  F[b >> 2] = 0;
  return b - d;
}, md = a => {
  for (var b = 0, c = 0; c < a.length; ++c) {
    var d = a.charCodeAt(c);
    55296 <= d && 57343 >= d && ++c;
    b += 4;
  }
  return b;
}, nd = (a, b, c) => {
  var d = [];
  a = a.toWireType(d, c);
  d.length && (G[b >> 2] = ac(d));
  return a;
}, od = [], pd = {}, qd = a => {
  var b = pd[a];
  return void 0 === b ? R(a) : b;
}, rd = a => {
  var b = od.length;
  od.push(a);
  return b;
}, sd = (a, b) => {
  for (var c = Array(a), d = 0; d < a; ++d) {
    c[d] = nc(G[b + 4 * d >> 2], "parameter " + d);
  }
  return c;
}, td = Reflect.construct, ud = a => 0 === a % 4 && (0 !== a % 100 || 0 === a % 400), vd = [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335], wd = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334], xd = [], yd = a => {
  a.Dc = a.getExtension("WEBGL_draw_instanced_base_vertex_base_instance");
}, zd = a => {
  a.Lc = a.getExtension("WEBGL_multi_draw_instanced_base_vertex_base_instance");
}, Ad = a => {
  var b = "EXT_color_buffer_float EXT_conservative_depth EXT_disjoint_timer_query_webgl2 EXT_texture_norm16 NV_shader_noperspective_interpolation WEBGL_clip_cull_distance EXT_color_buffer_half_float EXT_depth_clamp EXT_float_blend EXT_texture_compression_bptc EXT_texture_compression_rgtc EXT_texture_filter_anisotropic KHR_parallel_shader_compile OES_texture_float_linear WEBGL_blend_func_extended WEBGL_compressed_texture_astc WEBGL_compressed_texture_etc WEBGL_compressed_texture_etc1 WEBGL_compressed_texture_s3tc WEBGL_compressed_texture_s3tc_srgb WEBGL_debug_renderer_info WEBGL_debug_shaders WEBGL_lose_context WEBGL_multi_draw".split(" ");
  return (a.getSupportedExtensions() || []).filter(c => b.includes(c));
}, Bd = 1, Cd = [], V = [], Dd = [], Ed = [], Fd = [], Gd = [], Hd = [], w = [], Id = {}, Jd = 4, Kd = 0, Ld = a => {
  for (var b = Bd++, c = a.length; c < b; c++) {
    a[c] = null;
  }
  return b;
}, Md = (a, b, c, d) => {
  for (var e = 0; e < a; e++) {
    var f = W[c](), g = f && Ld(d);
    f ? (f.name = g, d[g] = f) : X ||= 1282;
    F[b + 4 * e >> 2] = g;
  }
}, ka = (a, b) => {
  var c = Ld(w), d = {handle:c, attributes:b, version:b.Kc, F:a};
  a.canvas && (a.canvas.zb = d);
  w[c] = d;
  ("undefined" == typeof b.Kb || b.Kb) && Nd(d);
  return c;
}, la = a => {
  q = w[a];
  l.Bc = W = q?.F;
  return !(a && !W);
}, Nd = a => {
  a ||= q;
  if (!a.Ub) {
    a.Ub = !0;
    var b = a.F;
    yd(b);
    zd(b);
    2 <= a.version && (b.cb = b.getExtension("EXT_disjoint_timer_query_webgl2"));
    if (2 > a.version || !b.cb) {
      b.cb = b.getExtension("EXT_disjoint_timer_query");
    }
    b.$b = b.getExtension("WEBGL_multi_draw");
    Ad(b).forEach(c => {
      c.includes("lose_context") || c.includes("debug") || b.getExtension(c);
    });
  }
}, X, q, Od = {}, Qd = () => {
  if (!Pd) {
    var a = {USER:"web_user", LOGNAME:"web_user", PATH:"/", PWD:"/", HOME:"/home/web_user", LANG:("object" == typeof navigator && navigator.languages && navigator.languages[0] || "C").replace("-", "_") + ".UTF-8", _:na || "./this.program"}, b;
    for (b in Od) {
      void 0 === Od[b] ? delete a[b] : a[b] = Od[b];
    }
    var c = [];
    for (b in a) {
      c.push(`${b}=${a[b]}`);
    }
    Pd = c;
  }
  return Pd;
}, Pd, Rd = [];
function Sd() {
  var a = Ad(W);
  return a = a.concat(a.map(b => "GL_" + b));
}
var Td = (a, b) => {
  if (b) {
    var c = void 0;
    switch(a) {
      case 36346:
        c = 1;
        break;
      case 36344:
        return;
      case 34814:
      case 36345:
        c = 0;
        break;
      case 34466:
        var d = W.getParameter(34467);
        c = d ? d.length : 0;
        break;
      case 33309:
        if (2 > q.version) {
          X ||= 1282;
          return;
        }
        c = Sd().length;
        break;
      case 33307:
      case 33308:
        if (2 > q.version) {
          X ||= 1280;
          return;
        }
        c = 33307 == a ? 3 : 0;
    }
    if (void 0 === c) {
      switch(d = W.getParameter(a), typeof d) {
        case "number":
          c = d;
          break;
        case "boolean":
          c = d ? 1 : 0;
          break;
        case "string":
          X ||= 1280;
          return;
        case "object":
          if (null === d) {
            switch(a) {
              case 34964:
              case 35725:
              case 34965:
              case 36006:
              case 36007:
              case 32873:
              case 34229:
              case 36662:
              case 36663:
              case 35053:
              case 35055:
              case 36010:
              case 35097:
              case 35869:
              case 32874:
              case 36389:
              case 35983:
              case 35368:
              case 34068:
                c = 0;
                break;
              default:
                X ||= 1280;
                return;
            }
          } else {
            if (d instanceof Float32Array || d instanceof Uint32Array || d instanceof Int32Array || d instanceof Array) {
              for (a = 0; a < d.length; ++a) {
                F[b + 4 * a >> 2] = d[a];
              }
              return;
            }
            try {
              c = d.name | 0;
            } catch (e) {
              X ||= 1280;
              sa(`GL_INVALID_ENUM in glGet${0}v: Unknown object returned from WebGL getParameter(${a})! (error: ${e})`);
              return;
            }
          }
          break;
        default:
          X ||= 1280;
          sa(`GL_INVALID_ENUM in glGet${0}v: Native code calling glGet${0}v(${a}) and it returns ${d} of type ${typeof d}!`);
          return;
      }
    }
    F[b >> 2] = c;
  } else {
    X ||= 1281;
  }
}, Vd = a => {
  var b = fb(a) + 1, c = Ud(b);
  c && gb(a, D, c, b);
  return c;
}, Wd = a => "]" == a.slice(-1) && a.lastIndexOf("["), Xd = a => {
  a -= 5120;
  return 0 == a ? B : 1 == a ? D : 2 == a ? E : 4 == a ? F : 6 == a ? xa : 5 == a || 28922 == a || 28520 == a || 30779 == a || 30782 == a ? G : wa;
}, Yd = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], Zd = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], $d = (a, b, c, d) => {
  function e(n, r, u) {
    for (n = "number" == typeof n ? n.toString() : n || ""; n.length < r;) {
      n = u[0] + n;
    }
    return n;
  }
  function f(n, r) {
    return e(n, r, "0");
  }
  function g(n, r) {
    function u(A) {
      return 0 > A ? -1 : 0 < A ? 1 : 0;
    }
    var z;
    0 === (z = u(n.getFullYear() - r.getFullYear())) && 0 === (z = u(n.getMonth() - r.getMonth())) && (z = u(n.getDate() - r.getDate()));
    return z;
  }
  function k(n) {
    switch(n.getDay()) {
      case 0:
        return new Date(n.getFullYear() - 1, 11, 29);
      case 1:
        return n;
      case 2:
        return new Date(n.getFullYear(), 0, 3);
      case 3:
        return new Date(n.getFullYear(), 0, 2);
      case 4:
        return new Date(n.getFullYear(), 0, 1);
      case 5:
        return new Date(n.getFullYear() - 1, 11, 31);
      case 6:
        return new Date(n.getFullYear() - 1, 11, 30);
    }
  }
  function p(n) {
    var r = n.ba;
    for (n = new Date((new Date(n.ca + 1900, 0, 1)).getTime()); 0 < r;) {
      var u = n.getMonth(), z = (ud(n.getFullYear()) ? Yd : Zd)[u];
      if (r > z - n.getDate()) {
        r -= z - n.getDate() + 1, n.setDate(1), 11 > u ? n.setMonth(u + 1) : (n.setMonth(0), n.setFullYear(n.getFullYear() + 1));
      } else {
        n.setDate(n.getDate() + r);
        break;
      }
    }
    u = new Date(n.getFullYear() + 1, 0, 4);
    r = k(new Date(n.getFullYear(), 0, 4));
    u = k(u);
    return 0 >= g(r, n) ? 0 >= g(u, n) ? n.getFullYear() + 1 : n.getFullYear() : n.getFullYear() - 1;
  }
  var m = G[d + 40 >> 2];
  d = {kc:F[d >> 2], jc:F[d + 4 >> 2], Ha:F[d + 8 >> 2], Va:F[d + 12 >> 2], Ia:F[d + 16 >> 2], ca:F[d + 20 >> 2], R:F[d + 24 >> 2], ba:F[d + 28 >> 2], Sc:F[d + 32 >> 2], ic:F[d + 36 >> 2], lc:m ? m ? L(D, m) : "" : ""};
  c = c ? L(D, c) : "";
  m = {"%c":"%a %b %d %H:%M:%S %Y", "%D":"%m/%d/%y", "%F":"%Y-%m-%d", "%h":"%b", "%r":"%I:%M:%S %p", "%R":"%H:%M", "%T":"%H:%M:%S", "%x":"%m/%d/%y", "%X":"%H:%M:%S", "%Ec":"%c", "%EC":"%C", "%Ex":"%m/%d/%y", "%EX":"%H:%M:%S", "%Ey":"%y", "%EY":"%Y", "%Od":"%d", "%Oe":"%e", "%OH":"%H", "%OI":"%I", "%Om":"%m", "%OM":"%M", "%OS":"%S", "%Ou":"%u", "%OU":"%U", "%OV":"%V", "%Ow":"%w", "%OW":"%W", "%Oy":"%y",};
  for (var t in m) {
    c = c.replace(new RegExp(t, "g"), m[t]);
  }
  var v = "Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "), x = "January February March April May June July August September October November December".split(" ");
  m = {"%a":n => v[n.R].substring(0, 3), "%A":n => v[n.R], "%b":n => x[n.Ia].substring(0, 3), "%B":n => x[n.Ia], "%C":n => f((n.ca + 1900) / 100 | 0, 2), "%d":n => f(n.Va, 2), "%e":n => e(n.Va, 2, " "), "%g":n => p(n).toString().substring(2), "%G":p, "%H":n => f(n.Ha, 2), "%I":n => {
    n = n.Ha;
    0 == n ? n = 12 : 12 < n && (n -= 12);
    return f(n, 2);
  }, "%j":n => {
    for (var r = 0, u = 0; u <= n.Ia - 1; r += (ud(n.ca + 1900) ? Yd : Zd)[u++]) {
    }
    return f(n.Va + r, 3);
  }, "%m":n => f(n.Ia + 1, 2), "%M":n => f(n.jc, 2), "%n":() => "\n", "%p":n => 0 <= n.Ha && 12 > n.Ha ? "AM" : "PM", "%S":n => f(n.kc, 2), "%t":() => "\t", "%u":n => n.R || 7, "%U":n => f(Math.floor((n.ba + 7 - n.R) / 7), 2), "%V":n => {
    var r = Math.floor((n.ba + 7 - (n.R + 6) % 7) / 7);
    2 >= (n.R + 371 - n.ba - 2) % 7 && r++;
    if (r) {
      53 == r && (u = (n.R + 371 - n.ba) % 7, 4 == u || 3 == u && ud(n.ca) || (r = 1));
    } else {
      r = 52;
      var u = (n.R + 7 - n.ba - 1) % 7;
      (4 == u || 5 == u && ud(n.ca % 400 - 1)) && r++;
    }
    return f(r, 2);
  }, "%w":n => n.R, "%W":n => f(Math.floor((n.ba + 7 - (n.R + 6) % 7) / 7), 2), "%y":n => (n.ca + 1900).toString().substring(2), "%Y":n => n.ca + 1900, "%z":n => {
    n = n.ic;
    var r = 0 <= n;
    n = Math.abs(n) / 60;
    return (r ? "+" : "-") + String("0000" + (n / 60 * 100 + n % 60)).slice(-4);
  }, "%Z":n => n.lc, "%%":() => "%"};
  c = c.replace(/%%/g, "\x00\x00");
  for (t in m) {
    c.includes(t) && (c = c.replace(new RegExp(t, "g"), m[t](d)));
  }
  c = c.replace(/\0\0/g, "%");
  t = hb(c, !1);
  if (t.length > b) {
    return 0;
  }
  B.set(t, a);
  return t.length - 1;
};
[44].forEach(a => {
  sb[a] = new M(a);
  sb[a].stack = "<generic error, no stack>";
});
zb = Array(4096);
Nb(N, "/");
Pb("/tmp");
Pb("/home");
Pb("/home/web_user");
(function() {
  Pb("/dev");
  kb(259, {read:() => 0, write:(d, e, f, g) => g,});
  Qb("/dev/null", 259);
  jb(1280, mb);
  jb(1536, nb);
  Qb("/dev/tty", 1280);
  Qb("/dev/tty1", 1536);
  var a = new Uint8Array(1024), b = 0, c = () => {
    0 === b && (b = bb(a).byteLength);
    return a[--b];
  };
  Wb("random", c);
  Wb("urandom", c);
  Pb("/dev/shm");
  Pb("/dev/shm/tmp");
})();
(function() {
  Pb("/proc");
  var a = Pb("/proc/self");
  Pb("/proc/self/fd");
  Nb({U() {
    var b = rb(a, "fd", 16895, 73);
    b.j = {ka(c, d) {
      var e = Kb(+d);
      c = {parent:null, U:{kb:"fake"}, j:{la:() => e.path},};
      return c.parent = c;
    }};
    return b;
  }}, "/proc/self/fd");
})();
P = l.BindingError = class extends Error {
  constructor(a) {
    super(a);
    this.name = "BindingError";
  }
};
O.push(0, 1, void 0, 1, null, 1, !0, 1, !1, 1,);
l.count_emval_handles = () => O.length / 2 - 5 - $b.length;
cc = l.PureVirtualError = bc("PureVirtualError");
for (var ae = Array(256), be = 0; 256 > be; ++be) {
  ae[be] = String.fromCharCode(be);
}
dc = ae;
l.getInheritedInstanceCount = () => Object.keys(hc).length;
l.getLiveInheritedInstances = () => {
  var a = [], b;
  for (b in hc) {
    hc.hasOwnProperty(b) && a.push(hc[b]);
  }
  return a;
};
l.flushPendingDeletes = fc;
l.setDelayFunction = a => {
  gc = a;
  ec.length && gc && gc(fc);
};
tc = l.InternalError = class extends Error {
  constructor(a) {
    super(a);
    this.name = "InternalError";
  }
};
Object.assign(Dc.prototype, {isAliasOf:function(a) {
  if (!(this instanceof Dc && a instanceof Dc)) {
    return !1;
  }
  var b = this.g.u.i, c = this.g.o;
  a.g = a.g;
  var d = a.g.u.i;
  for (a = a.g.o; b.B;) {
    c = b.na(c), b = b.B;
  }
  for (; d.B;) {
    a = d.na(a), d = d.B;
  }
  return b === d && c === a;
}, clone:function() {
  this.g.o || Cc(this);
  if (this.g.ia) {
    return this.g.count.value += 1, this;
  }
  var a = uc, b = Object, c = b.create, d = Object.getPrototypeOf(this), e = this.g;
  a = a(c.call(b, d, {g:{value:{count:e.count, ga:e.ga, ia:e.ia, o:e.o, u:e.u, D:e.D, J:e.J,},}}));
  a.g.count.value += 1;
  a.g.ga = !1;
  return a;
}, ["delete"]() {
  this.g.o || Cc(this);
  if (this.g.ga && !this.g.ia) {
    throw new P("Object already scheduled for deletion");
  }
  oc(this);
  var a = this.g;
  --a.count.value;
  0 === a.count.value && (a.D ? a.J.O(a.D) : a.u.i.O(a.o));
  this.g.ia || (this.g.D = void 0, this.g.o = void 0);
}, isDeleted:function() {
  return !this.g.o;
}, deleteLater:function() {
  this.g.o || Cc(this);
  if (this.g.ga && !this.g.ia) {
    throw new P("Object already scheduled for deletion");
  }
  ec.push(this);
  1 === ec.length && gc && gc(fc);
  this.g.ga = !0;
  return this;
},});
Object.assign(Nc.prototype, {Pb(a) {
  this.qb && (a = this.qb(a));
  return a;
}, bb(a) {
  this.O?.(a);
}, argPackAdvance:8, readValueFromPointer:yc, fromWireType:function(a) {
  function b() {
    return this.va ? vc(this.i.M, {u:this.bc, o:c, J:this, D:a,}) : vc(this.i.M, {u:this, o:a,});
  }
  var c = this.Pb(a);
  if (!c) {
    return this.bb(a), null;
  }
  var d = sc(this.i, c);
  if (void 0 !== d) {
    if (0 === d.g.count.value) {
      return d.g.o = c, d.g.D = a, d.clone();
    }
    d = d.clone();
    this.bb(a);
    return d;
  }
  d = this.i.Ob(c);
  d = rc[d];
  if (!d) {
    return b.call(this);
  }
  d = this.ua ? d.Hb : d.pointerType;
  var e = qc(c, this.i, d.i);
  return null === e ? b.call(this) : this.va ? vc(d.i.M, {u:d, o:e, J:this, D:a,}) : vc(d.i.M, {u:d, o:e,});
},});
Uc = l.UnboundTypeError = bc("UnboundTypeError");
for (var W, ce = 0; 32 > ce; ++ce) {
  Rd.push(Array(ce));
}
var ee = {__syscall_fcntl64:function(a, b, c) {
  Wa = c;
  try {
    var d = Kb(a);
    switch(b) {
      case 0:
        var e = Va();
        if (0 > e) {
          break;
        }
        for (; xb[e];) {
          e++;
        }
        return Mb(d, e).W;
      case 1:
      case 2:
        return 0;
      case 3:
        return d.flags;
      case 4:
        return e = Va(), d.flags |= e, 0;
      case 12:
        return e = Va(), E[e + 0 >> 1] = 2, 0;
      case 13:
      case 14:
        return 0;
    }
    return -28;
  } catch (f) {
    if ("undefined" == typeof Yb || "ErrnoError" !== f.name) {
      throw f;
    }
    return -f.$;
  }
}, __syscall_ioctl:function(a, b, c) {
  Wa = c;
  try {
    var d = Kb(a);
    switch(b) {
      case 21509:
        return d.s ? 0 : -59;
      case 21505:
        if (!d.s) {
          return -59;
        }
        if (d.s.V.Wb) {
          a = [3, 28, 127, 21, 4, 0, 1, 0, 17, 19, 26, 0, 18, 15, 23, 22, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,];
          var e = Va();
          F[e >> 2] = 25856;
          F[e + 4 >> 2] = 5;
          F[e + 8 >> 2] = 191;
          F[e + 12 >> 2] = 35387;
          for (var f = 0; 32 > f; f++) {
            B[e + f + 17] = a[f] || 0;
          }
        }
        return 0;
      case 21510:
      case 21511:
      case 21512:
        return d.s ? 0 : -59;
      case 21506:
      case 21507:
      case 21508:
        if (!d.s) {
          return -59;
        }
        if (d.s.V.Xb) {
          for (e = Va(), a = [], f = 0; 32 > f; f++) {
            a.push(B[e + f + 17]);
          }
        }
        return 0;
      case 21519:
        if (!d.s) {
          return -59;
        }
        e = Va();
        return F[e >> 2] = 0;
      case 21520:
        return d.s ? -28 : -59;
      case 21531:
        e = Va();
        if (!d.m.Vb) {
          throw new M(59);
        }
        return d.m.Vb(d, b, e);
      case 21523:
        if (!d.s) {
          return -59;
        }
        d.s.V.Yb && (f = [24, 80], e = Va(), E[e >> 1] = f[0], E[e + 2 >> 1] = f[1]);
        return 0;
      case 21524:
        return d.s ? 0 : -59;
      case 21515:
        return d.s ? 0 : -59;
      default:
        return -28;
    }
  } catch (g) {
    if ("undefined" == typeof Yb || "ErrnoError" !== g.name) {
      throw g;
    }
    return -g.$;
  }
}, __syscall_openat:function(a, b, c, d) {
  Wa = d;
  try {
    b = b ? L(D, b) : "";
    var e = b;
    if ("/" === e.charAt(0)) {
      b = e;
    } else {
      var f = -100 === a ? "/" : Kb(a).path;
      if (0 == e.length) {
        throw new M(44);
      }
      b = Ya(f + "/" + e);
    }
    var g = d ? Va() : 0;
    return Sb(b, c, g).W;
  } catch (k) {
    if ("undefined" == typeof Yb || "ErrnoError" !== k.name) {
      throw k;
    }
    return -k.$;
  }
}, _abort_js:() => {
  Ha("");
}, _embind_create_inheriting_constructor:(a, b, c) => {
  a = R(a);
  b = nc(b, "wrapper");
  c = Q(c);
  var d = b.i, e = d.M, f = d.B.M, g = d.B.constructor;
  a = Zb(a, function(...k) {
    d.B.ob.forEach(function(p) {
      if (this[p] === f[p]) {
        throw new cc(`Pure virtual function ${p} must be implemented in JavaScript`);
      }
    }.bind(this));
    Object.defineProperty(this, "__parent", {value:e});
    this.__construct(...k);
  });
  e.__construct = function(...k) {
    if (this === e) {
      throw new P("Pass correct 'this' to __construct");
    }
    k = g.implement(this, ...k);
    oc(k);
    var p = k.g;
    k.notifyOnDestruction();
    p.ia = !0;
    Object.defineProperties(this, {g:{value:p}});
    uc(this);
    k = p.o;
    k = ic(d, k);
    if (hc.hasOwnProperty(k)) {
      throw new P(`Tried to register registered instance: ${k}`);
    }
    hc[k] = this;
  };
  e.__destruct = function() {
    if (this === e) {
      throw new P("Pass correct 'this' to __destruct");
    }
    oc(this);
    var k = this.g.o;
    k = ic(d, k);
    if (hc.hasOwnProperty(k)) {
      delete hc[k];
    } else {
      throw new P(`Tried to unregister unregistered instance: ${k}`);
    }
  };
  a.prototype = Object.create(e);
  Object.assign(a.prototype, c);
  return ac(a);
}, _embind_finalize_value_object:a => {
  var b = wc[a];
  delete wc[a];
  var c = b.Ta, d = b.O, e = b.eb, f = e.map(g => g.Sb).concat(e.map(g => g.ec));
  T([a], f, g => {
    var k = {};
    e.forEach((p, m) => {
      var t = g[m], v = p.Qb, x = p.Rb, n = g[m + e.length], r = p.dc, u = p.fc;
      k[p.Mb] = {read:z => t.fromWireType(v(x, z)), write:(z, A) => {
        var C = [];
        r(u, z, n.toWireType(C, A));
        xc(C);
      }};
    });
    return [{name:b.name, fromWireType:p => {
      var m = {}, t;
      for (t in k) {
        m[t] = k[t].read(p);
      }
      d(p);
      return m;
    }, toWireType:(p, m) => {
      for (var t in k) {
        if (!(t in m)) {
          throw new TypeError(`Missing field: "${t}"`);
        }
      }
      var v = c();
      for (t in k) {
        k[t].write(v, m[t]);
      }
      null !== p && p.push(d, v);
      return v;
    }, argPackAdvance:8, readValueFromPointer:yc, L:d,}];
  });
}, _embind_register_bigint:() => {
}, _embind_register_bool:(a, b, c, d) => {
  b = R(b);
  S(a, {name:b, fromWireType:function(e) {
    return !!e;
  }, toWireType:function(e, f) {
    return f ? c : d;
  }, argPackAdvance:8, readValueFromPointer:function(e) {
    return this.fromWireType(D[e]);
  }, L:null,});
}, _embind_register_class:(a, b, c, d, e, f, g, k, p, m, t, v, x) => {
  t = R(t);
  f = U(e, f);
  k &&= U(g, k);
  m &&= U(p, m);
  x = U(v, x);
  var n = Gc(t);
  Fc(n, function() {
    Vc(`Cannot construct ${t} due to unbound types`, [d]);
  });
  T([a, b, c], d ? [d] : [], r => {
    r = r[0];
    if (d) {
      var u = r.i;
      var z = u.M;
    } else {
      z = Dc.prototype;
    }
    r = Zb(t, function(...J) {
      if (Object.getPrototypeOf(this) !== A) {
        throw new P("Use 'new' to construct " + t);
      }
      if (void 0 === C.Z) {
        throw new P(t + " has no accessible constructor");
      }
      var K = C.Z[J.length];
      if (void 0 === K) {
        throw new P(`Tried to invoke ctor of ${t} with invalid number of parameters (${J.length}) - expected (${Object.keys(C.Z).toString()}) parameters instead!`);
      }
      return K.apply(this, J);
    });
    var A = Object.create(z, {constructor:{value:r},});
    r.prototype = A;
    var C = new Hc(t, r, A, x, u, f, k, m);
    if (C.B) {
      var H;
      (H = C.B).oa ?? (H.oa = []);
      C.B.oa.push(C);
    }
    u = new Nc(t, C, !0, !1, !1);
    H = new Nc(t + "*", C, !1, !1, !1);
    z = new Nc(t + " const*", C, !1, !0, !1);
    rc[a] = {pointerType:H, Hb:z};
    Oc(n, r);
    return [u, H, z];
  });
}, _embind_register_class_class_function:(a, b, c, d, e, f, g) => {
  var k = Yc(c, d);
  b = R(b);
  b = Zc(b);
  f = U(e, f);
  T([], [a], p => {
    function m() {
      Vc(`Cannot call ${t} due to unbound types`, k);
    }
    p = p[0];
    var t = `${p.name}.${b}`;
    b.startsWith("@@") && (b = Symbol[b.substring(2)]);
    var v = p.i.constructor;
    void 0 === v[b] ? (m.fa = c - 1, v[b] = m) : (Ec(v, b, t), v[b].A[c - 1] = m);
    T([], k, x => {
      x = Xc(t, [x[0], null].concat(x.slice(1)), null, f, g);
      void 0 === v[b].A ? (x.fa = c - 1, v[b] = x) : v[b].A[c - 1] = x;
      if (p.i.oa) {
        for (const n of p.i.oa) {
          n.constructor.hasOwnProperty(b) || (n.constructor[b] = x);
        }
      }
      return [];
    });
    return [];
  });
}, _embind_register_class_class_property:(a, b, c, d, e, f, g, k) => {
  b = R(b);
  f = U(e, f);
  T([], [a], p => {
    p = p[0];
    var m = `${p.name}.${b}`, t = {get() {
      Vc(`Cannot access ${m} due to unbound types`, [c]);
    }, enumerable:!0, configurable:!0};
    t.set = k ? () => {
      Vc(`Cannot access ${m} due to unbound types`, [c]);
    } : () => {
      throw new P(`${m} is a read-only property`);
    };
    Object.defineProperty(p.i.constructor, b, t);
    T([], [c], v => {
      v = v[0];
      var x = {get() {
        return v.fromWireType(f(d));
      }, enumerable:!0};
      k && (k = U(g, k), x.set = n => {
        var r = [];
        k(d, v.toWireType(r, n));
        xc(r);
      });
      Object.defineProperty(p.i.constructor, b, x);
      return [];
    });
    return [];
  });
}, _embind_register_class_constructor:(a, b, c, d, e, f) => {
  var g = Yc(b, c);
  e = U(d, e);
  T([], [a], k => {
    k = k[0];
    var p = `constructor ${k.name}`;
    void 0 === k.i.Z && (k.i.Z = []);
    if (void 0 !== k.i.Z[b - 1]) {
      throw new P(`Cannot register multiple constructors with identical number of parameters (${b - 1}) for class '${k.name}'! Overload resolution is currently only performed using the parameter count, not actual type info!`);
    }
    k.i.Z[b - 1] = () => {
      Vc(`Cannot construct ${k.name} due to unbound types`, g);
    };
    T([], g, m => {
      m.splice(1, 0, null);
      k.i.Z[b - 1] = Xc(p, m, null, e, f);
      return [];
    });
    return [];
  });
}, _embind_register_class_function:(a, b, c, d, e, f, g, k) => {
  var p = Yc(c, d);
  b = R(b);
  b = Zc(b);
  f = U(e, f);
  T([], [a], m => {
    function t() {
      Vc(`Cannot call ${v} due to unbound types`, p);
    }
    m = m[0];
    var v = `${m.name}.${b}`;
    b.startsWith("@@") && (b = Symbol[b.substring(2)]);
    k && m.i.ob.push(b);
    var x = m.i.M, n = x[b];
    void 0 === n || void 0 === n.A && n.className !== m.name && n.fa === c - 2 ? (t.fa = c - 2, t.className = m.name, x[b] = t) : (Ec(x, b, v), x[b].A[c - 2] = t);
    T([], p, r => {
      r = Xc(v, r, m, f, g);
      void 0 === x[b].A ? (r.fa = c - 2, x[b] = r) : x[b].A[c - 2] = r;
      return [];
    });
    return [];
  });
}, _embind_register_class_property:(a, b, c, d, e, f, g, k, p, m) => {
  b = R(b);
  e = U(d, e);
  T([], [a], t => {
    t = t[0];
    var v = `${t.name}.${b}`, x = {get() {
      Vc(`Cannot access ${v} due to unbound types`, [c, g]);
    }, enumerable:!0, configurable:!0};
    x.set = p ? () => Vc(`Cannot access ${v} due to unbound types`, [c, g]) : () => {
      throw new P(v + " is a read-only property");
    };
    Object.defineProperty(t.i.M, b, x);
    T([], p ? [c, g] : [c], n => {
      var r = n[0], u = {get() {
        var A = $c(this, t, v + " getter");
        return r.fromWireType(e(f, A));
      }, enumerable:!0};
      if (p) {
        p = U(k, p);
        var z = n[1];
        u.set = function(A) {
          var C = $c(this, t, v + " setter"), H = [];
          p(m, C, z.toWireType(H, A));
          xc(H);
        };
      }
      Object.defineProperty(t.i.M, b, u);
      return [];
    });
    return [];
  });
}, _embind_register_emval:a => S(a, bd), _embind_register_enum:(a, b, c, d) => {
  function e() {
  }
  b = R(b);
  e.values = {};
  S(a, {name:b, constructor:e, fromWireType:function(f) {
    return this.constructor.values[f];
  }, toWireType:(f, g) => g.value, argPackAdvance:8, readValueFromPointer:cd(b, c, d), L:null,});
  Fc(b, e);
}, _embind_register_enum_value:(a, b, c) => {
  var d = nc(a, "enum");
  b = R(b);
  a = d.constructor;
  d = Object.create(d.constructor.prototype, {value:{value:c}, constructor:{value:Zb(`${d.name}_${b}`, function() {
  })},});
  a.values[c] = d;
  a[b] = d;
}, _embind_register_float:(a, b, c) => {
  b = R(b);
  S(a, {name:b, fromWireType:d => d, toWireType:(d, e) => e, argPackAdvance:8, readValueFromPointer:dd(b, c), L:null,});
}, _embind_register_function:(a, b, c, d, e, f) => {
  var g = Yc(b, c);
  a = R(a);
  a = Zc(a);
  e = U(d, e);
  Fc(a, function() {
    Vc(`Cannot call ${a} due to unbound types`, g);
  }, b - 1);
  T([], g, k => {
    Oc(a, Xc(a, [k[0], null].concat(k.slice(1)), null, e, f), b - 1);
    return [];
  });
}, _embind_register_integer:(a, b, c, d, e) => {
  b = R(b);
  -1 === e && (e = 4294967295);
  e = k => k;
  if (0 === d) {
    var f = 32 - 8 * c;
    e = k => k << f >>> f;
  }
  var g = b.includes("unsigned") ? function(k, p) {
    return p >>> 0;
  } : function(k, p) {
    return p;
  };
  S(a, {name:b, fromWireType:e, toWireType:g, argPackAdvance:8, readValueFromPointer:ed(b, c, 0 !== d), L:null,});
}, _embind_register_memory_view:(a, b, c) => {
  function d(f) {
    return new e(B.buffer, G[f + 4 >> 2], G[f >> 2]);
  }
  var e = [Int8Array, Uint8Array, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array,][b];
  c = R(c);
  S(a, {name:c, fromWireType:d, argPackAdvance:8, readValueFromPointer:d,}, {Tb:!0,});
}, _embind_register_std_string:(a, b) => {
  b = R(b);
  var c = "std::string" === b;
  S(a, {name:b, fromWireType:function(d) {
    var e = G[d >> 2], f = d + 4;
    if (c) {
      for (var g = f, k = 0; k <= e; ++k) {
        var p = f + k;
        if (k == e || 0 == D[p]) {
          g = g ? L(D, g, p - g) : "";
          if (void 0 === m) {
            var m = g;
          } else {
            m += String.fromCharCode(0), m += g;
          }
          g = p + 1;
        }
      }
    } else {
      m = Array(e);
      for (k = 0; k < e; ++k) {
        m[k] = String.fromCharCode(D[f + k]);
      }
      m = m.join("");
    }
    lc(d);
    return m;
  }, toWireType:function(d, e) {
    e instanceof ArrayBuffer && (e = new Uint8Array(e));
    var f = "string" == typeof e;
    if (!(f || e instanceof Uint8Array || e instanceof Uint8ClampedArray || e instanceof Int8Array)) {
      throw new P("Cannot pass non-string to std::string");
    }
    var g = c && f ? fb(e) : e.length;
    var k = Ud(4 + g + 1), p = k + 4;
    G[k >> 2] = g;
    if (c && f) {
      gb(e, D, p, g + 1);
    } else {
      if (f) {
        for (f = 0; f < g; ++f) {
          var m = e.charCodeAt(f);
          if (255 < m) {
            throw lc(p), new P("String has UTF-16 code units that do not fit in 8 bits");
          }
          D[p + f] = m;
        }
      } else {
        for (f = 0; f < g; ++f) {
          D[p + f] = e[f];
        }
      }
    }
    null !== d && d.push(lc, k);
    return k;
  }, argPackAdvance:8, readValueFromPointer:yc, L(d) {
    lc(d);
  },});
}, _embind_register_std_wstring:(a, b, c) => {
  c = R(c);
  if (2 === b) {
    var d = gd;
    var e = hd;
    var f = jd;
    var g = k => wa[k >> 1];
  } else {
    4 === b && (d = kd, e = ld, f = md, g = k => G[k >> 2]);
  }
  S(a, {name:c, fromWireType:k => {
    for (var p = G[k >> 2], m, t = k + 4, v = 0; v <= p; ++v) {
      var x = k + 4 + v * b;
      if (v == p || 0 == g(x)) {
        t = d(t, x - t), void 0 === m ? m = t : (m += String.fromCharCode(0), m += t), t = x + b;
      }
    }
    lc(k);
    return m;
  }, toWireType:(k, p) => {
    if ("string" != typeof p) {
      throw new P(`Cannot pass non-string to C++ string type ${c}`);
    }
    var m = f(p), t = Ud(4 + m + b);
    G[t >> 2] = m / b;
    e(p, t + 4, m + b);
    null !== k && k.push(lc, t);
    return t;
  }, argPackAdvance:8, readValueFromPointer:yc, L(k) {
    lc(k);
  }});
}, _embind_register_value_object:(a, b, c, d, e, f) => {
  wc[a] = {name:R(b), Ta:U(c, d), O:U(e, f), eb:[],};
}, _embind_register_value_object_field:(a, b, c, d, e, f, g, k, p, m) => {
  wc[a].eb.push({Mb:R(b), Sb:c, Qb:U(d, e), Rb:f, ec:g, dc:U(k, p), fc:m,});
}, _embind_register_void:(a, b) => {
  b = R(b);
  S(a, {Ic:!0, name:b, argPackAdvance:0, fromWireType:() => {
  }, toWireType:() => {
  },});
}, _emscripten_get_now_is_monotonic:() => 1, _emscripten_memcpy_js:(a, b, c) => D.copyWithin(a, b, b + c), _emscripten_throw_longjmp:() => {
  throw Infinity;
}, _emval_as:(a, b, c) => {
  a = Q(a);
  b = nc(b, "emval::as");
  return nd(b, c, a);
}, _emval_call:(a, b, c, d) => {
  a = od[a];
  b = Q(b);
  return a(null, b, c, d);
}, _emval_call_method:(a, b, c, d, e) => {
  a = od[a];
  b = Q(b);
  c = qd(c);
  return a(b, b[c], d, e);
}, _emval_decref:ad, _emval_get_method_caller:(a, b, c) => {
  var d = sd(a, b), e = d.shift();
  a--;
  var f = Array(a);
  b = `methodCaller<(${d.map(g => g.name).join(", ")}) => ${e.name}>`;
  return rd(Zb(b, (g, k, p, m) => {
    for (var t = 0, v = 0; v < a; ++v) {
      f[v] = d[v].readValueFromPointer(m + t), t += d[v].argPackAdvance;
    }
    g = 1 === c ? td(k, f) : k.apply(g, f);
    return nd(e, p, g);
  }));
}, _emval_get_property:(a, b) => {
  a = Q(a);
  b = Q(b);
  return ac(a[b]);
}, _emval_incref:a => {
  9 < a && (O[a + 1] += 1);
}, _emval_new_array:() => ac([]), _emval_new_cstring:a => ac(qd(a)), _emval_new_object:() => ac({}), _emval_run_destructors:a => {
  var b = Q(a);
  xc(b);
  ad(a);
}, _emval_set_property:(a, b, c) => {
  a = Q(a);
  b = Q(b);
  c = Q(c);
  a[b] = c;
}, _emval_take_value:(a, b) => {
  a = nc(a, "_emval_take_value");
  a = a.readValueFromPointer(b);
  return ac(a);
}, _gmtime_js:function(a, b, c) {
  a = new Date(1000 * (b + 2097152 >>> 0 < 4194305 - !!a ? (a >>> 0) + 4294967296 * b : NaN));
  F[c >> 2] = a.getUTCSeconds();
  F[c + 4 >> 2] = a.getUTCMinutes();
  F[c + 8 >> 2] = a.getUTCHours();
  F[c + 12 >> 2] = a.getUTCDate();
  F[c + 16 >> 2] = a.getUTCMonth();
  F[c + 20 >> 2] = a.getUTCFullYear() - 1900;
  F[c + 24 >> 2] = a.getUTCDay();
  F[c + 28 >> 2] = (a.getTime() - Date.UTC(a.getUTCFullYear(), 0, 1, 0, 0, 0, 0)) / 864E5 | 0;
}, _localtime_js:function(a, b, c) {
  a = new Date(1000 * (b + 2097152 >>> 0 < 4194305 - !!a ? (a >>> 0) + 4294967296 * b : NaN));
  F[c >> 2] = a.getSeconds();
  F[c + 4 >> 2] = a.getMinutes();
  F[c + 8 >> 2] = a.getHours();
  F[c + 12 >> 2] = a.getDate();
  F[c + 16 >> 2] = a.getMonth();
  F[c + 20 >> 2] = a.getFullYear() - 1900;
  F[c + 24 >> 2] = a.getDay();
  F[c + 28 >> 2] = (ud(a.getFullYear()) ? vd : wd)[a.getMonth()] + a.getDate() - 1 | 0;
  F[c + 36 >> 2] = -(60 * a.getTimezoneOffset());
  b = (new Date(a.getFullYear(), 6, 1)).getTimezoneOffset();
  var d = (new Date(a.getFullYear(), 0, 1)).getTimezoneOffset();
  F[c + 32 >> 2] = (b != d && a.getTimezoneOffset() == Math.min(d, b)) | 0;
}, _tzset_js:(a, b, c, d) => {
  var e = (new Date()).getFullYear(), f = new Date(e, 0, 1), g = new Date(e, 6, 1);
  e = f.getTimezoneOffset();
  var k = g.getTimezoneOffset();
  G[a >> 2] = 60 * Math.max(e, k);
  F[b >> 2] = Number(e != k);
  a = p => p.toLocaleTimeString(void 0, {hour12:!1, timeZoneName:"short"}).split(" ")[1];
  f = a(f);
  g = a(g);
  k < e ? (gb(f, D, c, 17), gb(g, D, d, 17)) : (gb(f, D, d, 17), gb(g, D, c, 17));
}, beginPixelLocalStorageWEBGL:function(a, b, c) {
  (a = w[a].F.Ca) && a.beginPixelLocalStorageWEBGL(l.HEAPU32.subarray(c, c + b));
}, decode_image:function(a, b, c) {
  var d = l.images;
  d || (d = new Map(), l.images = d);
  var e = new Image();
  d.set(a, e);
  b = l.HEAP8.subarray(b, b + c);
  c = new Uint8Array(c);
  c.set(b);
  e.src = URL.createObjectURL(new Blob([c], {type:"image/png"}));
  e.onload = function() {
    l._setWebImage(a, e.width, e.height);
  };
}, delete_image:function(a) {
  var b = l.images;
  b && b.get(a) && b.delete(a);
}, emscripten_asm_const_int:(a, b, c) => {
  xd.length = 0;
  for (var d; d = D[b++];) {
    var e = 105 != d;
    e &= 112 != d;
    c += e && c % 8 ? 4 : 0;
    xd.push(112 == d ? G[c >> 2] : 105 == d ? F[c >> 2] : ya[c >> 3]);
    c += e ? 8 : 4;
  }
  return Ta[a](...xd);
}, emscripten_date_now:() => Date.now(), emscripten_get_now:() => performance.now(), emscripten_resize_heap:a => {
  var b = D.length;
  a >>>= 0;
  if (2147483648 < a) {
    return !1;
  }
  for (var c = 1; 4 >= c; c *= 2) {
    var d = b * (1 + 0.2 / c);
    d = Math.min(d, a + 100663296);
    var e = Math;
    d = Math.max(a, d);
    a: {
      e = (e.min.call(e, 2147483648, d + (65536 - d % 65536) % 65536) - ua.buffer.byteLength + 65535) / 65536;
      try {
        ua.grow(e);
        za();
        var f = 1;
        break a;
      } catch (g) {
      }
      f = void 0;
    }
    if (f) {
      return !0;
    }
  }
  return !1;
}, emscripten_webgl_enable_extension:(a, b) => {
  a = w[a];
  b = b ? L(D, b) : "";
  b.startsWith("GL_") && (b = b.substr(3));
  "WEBGL_draw_instanced_base_vertex_base_instance" == b && yd(W);
  "WEBGL_multi_draw_instanced_base_vertex_base_instance" == b && zd(W);
  "WEBGL_multi_draw" == b && (W.$b = W.getExtension("WEBGL_multi_draw"));
  return !!a.F.getExtension(b);
}, emscripten_webgl_get_current_context:() => q ? q.handle : 0, emscripten_webgl_make_context_current:a => la(a) ? 0 : -5, enable_WEBGL_provoking_vertex:function(a) {
  a = w[a].F;
  a.pb = a.getExtension("WEBGL_provoking_vertex");
  return !!a.pb;
}, enable_WEBGL_shader_pixel_local_storage_coherent:function(a) {
  a = w[a].F;
  const b = a.getExtension("WEBGL_shader_pixel_local_storage");
  return b && b.isCoherent() && 5 == b.framebufferTexturePixelLocalStorageWEBGL.length ? (a.Ca = b, !0) : !1;
}, endPixelLocalStorageWEBGL:function(a, b, c) {
  (a = w[a].F.Ca) && a.endPixelLocalStorageWEBGL(l.HEAPU32.subarray(c, c + b));
}, environ_get:(a, b) => {
  var c = 0;
  Qd().forEach((d, e) => {
    var f = b + c;
    e = G[a + 4 * e >> 2] = f;
    for (f = 0; f < d.length; ++f) {
      B[e++] = d.charCodeAt(f);
    }
    B[e] = 0;
    c += d.length + 1;
  });
  return 0;
}, environ_sizes_get:(a, b) => {
  var c = Qd();
  G[a >> 2] = c.length;
  var d = 0;
  c.forEach(e => d += e.length + 1);
  G[b >> 2] = d;
  return 0;
}, fd_close:function(a) {
  try {
    var b = Kb(a);
    if (null === b.W) {
      throw new M(8);
    }
    b.Qa && (b.Qa = null);
    try {
      b.m.close && b.m.close(b);
    } catch (c) {
      throw c;
    } finally {
      xb[b.W] = null;
    }
    b.W = null;
    return 0;
  } catch (c) {
    if ("undefined" == typeof Yb || "ErrnoError" !== c.name) {
      throw c;
    }
    return c.$;
  }
}, fd_read:function(a, b, c, d) {
  try {
    a: {
      var e = Kb(a);
      a = b;
      for (var f, g = b = 0; g < c; g++) {
        var k = G[a >> 2], p = G[a + 4 >> 2];
        a += 8;
        var m = e, t = f, v = B;
        if (0 > p || 0 > t) {
          throw new M(28);
        }
        if (null === m.W) {
          throw new M(8);
        }
        if (1 === (m.flags & 2097155)) {
          throw new M(8);
        }
        if (16384 === (m.node.mode & 61440)) {
          throw new M(31);
        }
        if (!m.m.read) {
          throw new M(28);
        }
        var x = "undefined" != typeof t;
        if (!x) {
          t = m.position;
        } else if (!m.seekable) {
          throw new M(70);
        }
        var n = m.m.read(m, v, k, p, t);
        x || (m.position += n);
        var r = n;
        if (0 > r) {
          var u = -1;
          break a;
        }
        b += r;
        if (r < p) {
          break;
        }
        "undefined" != typeof f && (f += r);
      }
      u = b;
    }
    G[d >> 2] = u;
    return 0;
  } catch (z) {
    if ("undefined" == typeof Yb || "ErrnoError" !== z.name) {
      throw z;
    }
    return z.$;
  }
}, fd_seek:function(a, b, c, d, e) {
  b = c + 2097152 >>> 0 < 4194305 - !!b ? (b >>> 0) + 4294967296 * c : NaN;
  try {
    if (isNaN(b)) {
      return 61;
    }
    var f = Kb(a);
    Ub(f, b, d);
    Pa = [f.position >>> 0, (Oa = f.position, 1.0 <= +Math.abs(Oa) ? 0.0 < Oa ? +Math.floor(Oa / 4294967296.0) >>> 0 : ~~+Math.ceil((Oa - +(~~Oa >>> 0)) / 4294967296.0) >>> 0 : 0)];
    F[e >> 2] = Pa[0];
    F[e + 4 >> 2] = Pa[1];
    f.Qa && 0 === b && 0 === d && (f.Qa = null);
    return 0;
  } catch (g) {
    if ("undefined" == typeof Yb || "ErrnoError" !== g.name) {
      throw g;
    }
    return g.$;
  }
}, fd_write:function(a, b, c, d) {
  try {
    a: {
      var e = Kb(a);
      a = b;
      for (var f, g = b = 0; g < c; g++) {
        var k = G[a >> 2], p = G[a + 4 >> 2];
        a += 8;
        var m = e, t = k, v = p, x = f, n = B;
        if (0 > v || 0 > x) {
          throw new M(28);
        }
        if (null === m.W) {
          throw new M(8);
        }
        if (0 === (m.flags & 2097155)) {
          throw new M(8);
        }
        if (16384 === (m.node.mode & 61440)) {
          throw new M(31);
        }
        if (!m.m.write) {
          throw new M(28);
        }
        m.seekable && m.flags & 1024 && Ub(m, 0, 2);
        var r = "undefined" != typeof x;
        if (!r) {
          x = m.position;
        } else if (!m.seekable) {
          throw new M(70);
        }
        var u = m.m.write(m, n, t, v, x, void 0);
        r || (m.position += u);
        var z = u;
        if (0 > z) {
          var A = -1;
          break a;
        }
        b += z;
        "undefined" != typeof f && (f += z);
      }
      A = b;
    }
    G[d >> 2] = A;
    return 0;
  } catch (C) {
    if ("undefined" == typeof Yb || "ErrnoError" !== C.name) {
      throw C;
    }
    return C.$;
  }
}, framebufferPixelLocalClearValuefvWEBGL:function(a, b, c, d, e, f) {
  (a = w[a].F.Ca) && a.framebufferPixelLocalClearValuefvWEBGL(b, [c, d, e, f]);
}, framebufferTexturePixelLocalStorageWEBGL:function(a, b, c, d, e, f) {
  (a = w[a].F.Ca) && a.framebufferTexturePixelLocalStorageWEBGL(b, Fd[c], d, e, f);
}, glActiveTexture:a => W.activeTexture(a), glAttachShader:(a, b) => {
  W.attachShader(V[a], Gd[b]);
}, glBindBuffer:(a, b) => {
  35051 == a ? W.Na = b : 35052 == a && (W.Oa = b);
  W.bindBuffer(a, Cd[b]);
}, glBindBufferRange:(a, b, c, d, e) => {
  W.bindBufferRange(a, b, Cd[c], d, e);
}, glBindFramebuffer:(a, b) => {
  W.bindFramebuffer(a, Dd[b]);
}, glBindRenderbuffer:(a, b) => {
  W.bindRenderbuffer(a, Ed[b]);
}, glBindTexture:(a, b) => {
  W.bindTexture(a, Fd[b]);
}, glBindVertexArray:a => {
  W.bindVertexArray(Hd[a]);
}, glBlendEquation:a => W.blendEquation(a), glBlendFunc:(a, b) => W.blendFunc(a, b), glBlitFramebuffer:(a, b, c, d, e, f, g, k, p, m) => W.blitFramebuffer(a, b, c, d, e, f, g, k, p, m), glBufferData:(a, b, c, d) => {
  c && b ? W.bufferData(a, D, d, c, b) : W.bufferData(a, b, d);
}, glBufferSubData:(a, b, c, d) => {
  c && W.bufferSubData(a, b, D, d, c);
}, glClear:a => W.clear(a), glClearBufferfv:(a, b, c) => {
  W.clearBufferfv(a, b, xa, c >> 2);
}, glClearBufferuiv:(a, b, c) => {
  W.clearBufferuiv(a, b, G, c >> 2);
}, glClearColor:(a, b, c, d) => W.clearColor(a, b, c, d), glClearDepthf:a => W.clearDepth(a), glClearStencil:a => W.clearStencil(a), glColorMask:(a, b, c, d) => {
  W.colorMask(!!a, !!b, !!c, !!d);
}, glCompileShader:a => {
  W.compileShader(Gd[a]);
}, glCreateProgram:() => {
  var a = Ld(V), b = W.createProgram();
  b.name = a;
  b.ya = b.wa = b.xa = 0;
  b.Wa = 1;
  V[a] = b;
  return a;
}, glCreateShader:a => {
  var b = Ld(Gd);
  Gd[b] = W.createShader(a);
  return b;
}, glCullFace:a => W.cullFace(a), glDeleteBuffers:(a, b) => {
  for (var c = 0; c < a; c++) {
    var d = F[b + 4 * c >> 2], e = Cd[d];
    e && (W.deleteBuffer(e), e.name = 0, Cd[d] = null, d == W.Na && (W.Na = 0), d == W.Oa && (W.Oa = 0));
  }
}, glDeleteFramebuffers:(a, b) => {
  for (var c = 0; c < a; ++c) {
    var d = F[b + 4 * c >> 2], e = Dd[d];
    e && (W.deleteFramebuffer(e), e.name = 0, Dd[d] = null);
  }
}, glDeleteProgram:a => {
  if (a) {
    var b = V[a];
    b ? (W.deleteProgram(b), b.name = 0, V[a] = null) : X ||= 1281;
  }
}, glDeleteRenderbuffers:(a, b) => {
  for (var c = 0; c < a; c++) {
    var d = F[b + 4 * c >> 2], e = Ed[d];
    e && (W.deleteRenderbuffer(e), e.name = 0, Ed[d] = null);
  }
}, glDeleteShader:a => {
  if (a) {
    var b = Gd[a];
    b ? (W.deleteShader(b), Gd[a] = null) : X ||= 1281;
  }
}, glDeleteTextures:(a, b) => {
  for (var c = 0; c < a; c++) {
    var d = F[b + 4 * c >> 2], e = Fd[d];
    e && (W.deleteTexture(e), e.name = 0, Fd[d] = null);
  }
}, glDeleteVertexArrays:(a, b) => {
  for (var c = 0; c < a; c++) {
    var d = F[b + 4 * c >> 2];
    W.deleteVertexArray(Hd[d]);
    Hd[d] = null;
  }
}, glDepthFunc:a => W.depthFunc(a), glDepthMask:a => {
  W.depthMask(!!a);
}, glDepthRangef:(a, b) => W.depthRange(a, b), glDisable:a => W.disable(a), glDrawArrays:(a, b, c) => {
  W.drawArrays(a, b, c);
}, glDrawArraysInstanced:(a, b, c, d) => {
  W.drawArraysInstanced(a, b, c, d);
}, glDrawBuffers:(a, b) => {
  for (var c = Rd[a], d = 0; d < a; d++) {
    c[d] = F[b + 4 * d >> 2];
  }
  W.drawBuffers(c);
}, glDrawElements:(a, b, c, d) => {
  W.drawElements(a, b, c, d);
}, glDrawElementsInstanced:(a, b, c, d, e) => {
  W.drawElementsInstanced(a, b, c, d, e);
}, glEnable:a => W.enable(a), glEnableVertexAttribArray:a => {
  W.enableVertexAttribArray(a);
}, glFlush:() => W.flush(), glFramebufferRenderbuffer:(a, b, c, d) => {
  W.framebufferRenderbuffer(a, b, c, Ed[d]);
}, glFramebufferTexture2D:(a, b, c, d, e) => {
  W.framebufferTexture2D(a, b, c, Fd[d], e);
}, glFrontFace:a => W.frontFace(a), glGenBuffers:(a, b) => {
  Md(a, b, "createBuffer", Cd);
}, glGenFramebuffers:(a, b) => {
  Md(a, b, "createFramebuffer", Dd);
}, glGenRenderbuffers:(a, b) => {
  Md(a, b, "createRenderbuffer", Ed);
}, glGenTextures:(a, b) => {
  Md(a, b, "createTexture", Fd);
}, glGenVertexArrays:(a, b) => {
  Md(a, b, "createVertexArray", Hd);
}, glGenerateMipmap:a => W.generateMipmap(a), glGetIntegerv:(a, b) => Td(a, b), glGetProgramiv:(a, b, c) => {
  if (c) {
    if (a >= Bd) {
      X ||= 1281;
    } else {
      if (a = V[a], 35716 == b) {
        a = W.getProgramInfoLog(a), null === a && (a = "(unknown error)"), F[c >> 2] = a.length + 1;
      } else if (35719 == b) {
        if (!a.ya) {
          for (b = 0; b < W.getProgramParameter(a, 35718); ++b) {
            a.ya = Math.max(a.ya, W.getActiveUniform(a, b).name.length + 1);
          }
        }
        F[c >> 2] = a.ya;
      } else if (35722 == b) {
        if (!a.wa) {
          for (b = 0; b < W.getProgramParameter(a, 35721); ++b) {
            a.wa = Math.max(a.wa, W.getActiveAttrib(a, b).name.length + 1);
          }
        }
        F[c >> 2] = a.wa;
      } else if (35381 == b) {
        if (!a.xa) {
          for (b = 0; b < W.getProgramParameter(a, 35382); ++b) {
            a.xa = Math.max(a.xa, W.getActiveUniformBlockName(a, b).length + 1);
          }
        }
        F[c >> 2] = a.xa;
      } else {
        F[c >> 2] = W.getProgramParameter(a, b);
      }
    }
  } else {
    X ||= 1281;
  }
}, glGetString:a => {
  var b = Id[a];
  if (!b) {
    switch(a) {
      case 7939:
        b = Vd(Sd().join(" "));
        break;
      case 7936:
      case 7937:
      case 37445:
      case 37446:
        (b = W.getParameter(a)) || (X ||= 1280);
        b = b ? Vd(b) : 0;
        break;
      case 7938:
        b = Vd(`OpenGL ES 3.0 (${W.getParameter(7938)})`);
        break;
      case 35724:
        b = W.getParameter(35724);
        var c = b.match(/^WebGL GLSL ES ([0-9]\.[0-9][0-9]?)(?:$| .*)/);
        null !== c && (3 == c[1].length && (c[1] += "0"), b = `OpenGL ES GLSL ES ${c[1]} (${b})`);
        b = Vd(b);
        break;
      default:
        X ||= 1280;
    }
    Id[a] = b;
  }
  return b;
}, glGetUniformBlockIndex:(a, b) => W.getUniformBlockIndex(V[a], b ? L(D, b) : ""), glGetUniformLocation:(a, b) => {
  b = b ? L(D, b) : "";
  if (a = V[a]) {
    var c = a, d = c.ma, e = c.wb, f;
    if (!d) {
      for (c.ma = d = {}, c.vb = {}, f = 0; f < W.getProgramParameter(c, 35718); ++f) {
        var g = W.getActiveUniform(c, f);
        var k = g.name;
        g = g.size;
        var p = Wd(k);
        p = 0 < p ? k.slice(0, p) : k;
        var m = c.Wa;
        c.Wa += g;
        e[p] = [g, m];
        for (k = 0; k < g; ++k) {
          d[m] = k, c.vb[m++] = p;
        }
      }
    }
    c = a.ma;
    d = 0;
    e = b;
    f = Wd(b);
    0 < f && (d = parseInt(b.slice(f + 1)) >>> 0, e = b.slice(0, f));
    if ((e = a.wb[e]) && d < e[0] && (d += e[1], c[d] = c[d] || W.getUniformLocation(a, b))) {
      return d;
    }
  } else {
    X ||= 1281;
  }
  return -1;
}, glInvalidateFramebuffer:(a, b, c) => {
  for (var d = Rd[b], e = 0; e < b; e++) {
    d[e] = F[c + 4 * e >> 2];
  }
  W.invalidateFramebuffer(a, d);
}, glLinkProgram:a => {
  a = V[a];
  W.linkProgram(a);
  a.ma = 0;
  a.wb = {};
}, glPixelStorei:(a, b) => {
  3317 == a ? Jd = b : 3314 == a && (Kd = b);
  W.pixelStorei(a, b);
}, glReadPixels:(a, b, c, d, e, f, g) => {
  if (W.Na) {
    W.readPixels(a, b, c, d, e, f, g);
  } else {
    var k = Xd(f);
    g >>>= 31 - Math.clz32(k.BYTES_PER_ELEMENT);
    W.readPixels(a, b, c, d, e, f, k, g);
  }
}, glRenderbufferStorageMultisample:(a, b, c, d, e) => W.renderbufferStorageMultisample(a, b, c, d, e), glScissor:(a, b, c, d) => W.scissor(a, b, c, d), glShaderSource:(a, b, c, d) => {
  for (var e = "", f = 0; f < b; ++f) {
    var g = (g = G[c + 4 * f >> 2]) ? L(D, g, d ? G[d + 4 * f >> 2] : void 0) : "";
    e += g;
  }
  W.shaderSource(Gd[a], e);
}, glStencilFunc:(a, b, c) => W.stencilFunc(a, b, c), glStencilFuncSeparate:(a, b, c, d) => W.stencilFuncSeparate(a, b, c, d), glStencilMask:a => W.stencilMask(a), glStencilOp:(a, b, c) => W.stencilOp(a, b, c), glStencilOpSeparate:(a, b, c, d) => W.stencilOpSeparate(a, b, c, d), glTexParameteri:(a, b, c) => W.texParameteri(a, b, c), glTexStorage2D:(a, b, c, d, e) => W.texStorage2D(a, b, c, d, e), glTexStorage3D:(a, b, c, d, e, f) => W.texStorage3D(a, b, c, d, e, f), glTexSubImage2D:(a, b, c, d, e, 
f, g, k, p) => {
  if (W.Oa) {
    W.texSubImage2D(a, b, c, d, e, f, g, k, p);
  } else {
    if (p) {
      var m = Xd(k);
      W.texSubImage2D(a, b, c, d, e, f, g, k, m, p >>> 31 - Math.clz32(m.BYTES_PER_ELEMENT));
    } else {
      if (p) {
        m = Xd(k);
        var t = f * ((Kd || e) * ({5:3, 6:4, 8:2, 29502:3, 29504:4, 26917:2, 26918:2, 29846:3, 29847:4}[g - 6402] || 1) * m.BYTES_PER_ELEMENT + Jd - 1 & -Jd);
        p = m.subarray(p >>> 31 - Math.clz32(m.BYTES_PER_ELEMENT), p + t >>> 31 - Math.clz32(m.BYTES_PER_ELEMENT));
      } else {
        p = null;
      }
      W.texSubImage2D(a, b, c, d, e, f, g, k, p);
    }
  }
}, glUniform1i:(a, b) => {
  var c = W, d = c.uniform1i;
  var e = W.Ib;
  if (e) {
    var f = e.ma[a];
    "number" == typeof f && (e.ma[a] = f = W.getUniformLocation(e, e.vb[a] + (0 < f ? `[${f}]` : "")));
    a = f;
  } else {
    X ||= 1282, a = void 0;
  }
  d.call(c, a, b);
}, glUniformBlockBinding:(a, b, c) => {
  a = V[a];
  W.uniformBlockBinding(a, b, c);
}, glUseProgram:a => {
  a = V[a];
  W.useProgram(a);
  W.Ib = a;
}, glVertexAttribDivisor:(a, b) => {
  W.vertexAttribDivisor(a, b);
}, glVertexAttribIPointer:(a, b, c, d, e) => {
  W.vertexAttribIPointer(a, b, c, d, e);
}, glVertexAttribPointer:(a, b, c, d, e, f) => {
  W.vertexAttribPointer(a, b, c, !!d, e, f);
}, glViewport:(a, b, c, d) => W.viewport(a, b, c, d), invoke_vii:de, isWindowsBrowser:function() {
  return -1 < navigator.platform.indexOf("Win");
}, provokingVertexWEBGL:function(a, b) {
  (a = w[a].F.pb) && a.provokingVertexWEBGL(b);
}, strftime:$d, strftime_l:(a, b, c, d) => $d(a, b, c, d), upload_image:function(a, b) {
  var c = l.images;
  c && (b = c.get(b)) && (a = w[a].F, a.pixelStorei(a.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !0), a.texImage2D(a.TEXTURE_2D, 0, a.RGBA, a.RGBA, a.UNSIGNED_BYTE, b), a.pixelStorei(a.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !1));
}, wasm_start_image_decode:function(a, b, c) {
  b = l.HEAP8.subarray(b, b + c);
  c = new Uint8Array(c);
  c.set(b);
  createImageBitmap(new Blob([c])).then(function(d) {
    var e = (new OffscreenCanvas(d.width, d.height)).getContext("2d");
    e.drawImage(d, 0, 0);
    e = e.getImageData(0, 0, d.width, d.height);
    var f = e.data.length, g = l.Cb(f);
    l.oc.set(e.data, g);
    l.qc(a, d.width, d.height, g, f);
  }).catch(function(d) {
    d = d.message || "decode failed";
    var e = l.Jc(d) + 1, f = l.Cb(e);
    l.Rc(d, f, e);
    l.rc(a, f);
    l.pc(f);
  });
}}, Y = function() {
  function a(c) {
    Y = c.exports;
    ua = Y.memory;
    za();
    Qc = Y.__indirect_function_table;
    Ba.unshift(Y.__wasm_call_ctors);
    Ea--;
    l.monitorRunDependencies?.(Ea);
    0 == Ea && (null !== Fa && (clearInterval(Fa), Fa = null), Ga && (c = Ga, Ga = null, c()));
    return Y;
  }
  var b = {env:ee, wasi_snapshot_preview1:ee,};
  Ea++;
  l.monitorRunDependencies?.(Ea);
  if (l.instantiateWasm) {
    try {
      return l.instantiateWasm(b, a);
    } catch (c) {
      sa(`Module.instantiateWasm callback failed with error: ${c}`), ba(c);
    }
  }
  Ja ||= Ia("webgl2_advanced.wasm") ? "webgl2_advanced.wasm" : l.locateFile ? l.locateFile("webgl2_advanced.wasm", y) : y + "webgl2_advanced.wasm";
  Na(b, function(c) {
    a(c.instance);
  }).catch(ba);
  return {};
}(), lc = a => (lc = Y.free)(a), Ud = a => (Ud = Y.malloc)(a);
l._setWebImage = (a, b, c) => (l._setWebImage = Y.setWebImage)(a, b, c);
var kc = a => (kc = Y.__getTypeName)(a);
l._wasm_image_decode_complete = (a, b, c, d, e) => (l._wasm_image_decode_complete = Y.wasm_image_decode_complete)(a, b, c, d, e);
l._wasm_image_decode_error = (a, b) => (l._wasm_image_decode_error = Y.wasm_image_decode_error)(a, b);
var Qa = l._ma_device__on_notification_unlocked = a => (Qa = l._ma_device__on_notification_unlocked = Y.ma_device__on_notification_unlocked)(a);
l._ma_malloc_emscripten = (a, b) => (l._ma_malloc_emscripten = Y.ma_malloc_emscripten)(a, b);
l._ma_free_emscripten = (a, b) => (l._ma_free_emscripten = Y.ma_free_emscripten)(a, b);
var Ra = l._ma_device_process_pcm_frames_capture__webaudio = (a, b, c) => (Ra = l._ma_device_process_pcm_frames_capture__webaudio = Y.ma_device_process_pcm_frames_capture__webaudio)(a, b, c), Sa = l._ma_device_process_pcm_frames_playback__webaudio = (a, b, c) => (Sa = l._ma_device_process_pcm_frames_playback__webaudio = Y.ma_device_process_pcm_frames_playback__webaudio)(a, b, c), fe = (a, b) => (fe = Y.setThrew)(a, b), ge = a => (ge = Y._emscripten_stack_restore)(a), he = () => (he = Y.emscripten_stack_get_current)();
l.dynCall_iiiji = (a, b, c, d, e, f) => (l.dynCall_iiiji = Y.dynCall_iiiji)(a, b, c, d, e, f);
l.dynCall_iij = (a, b, c, d) => (l.dynCall_iij = Y.dynCall_iij)(a, b, c, d);
l.dynCall_iiji = (a, b, c, d, e) => (l.dynCall_iiji = Y.dynCall_iiji)(a, b, c, d, e);
l.dynCall_jii = (a, b, c) => (l.dynCall_jii = Y.dynCall_jii)(a, b, c);
l.dynCall_vijj = (a, b, c, d, e, f) => (l.dynCall_vijj = Y.dynCall_vijj)(a, b, c, d, e, f);
l.dynCall_jiji = (a, b, c, d, e) => (l.dynCall_jiji = Y.dynCall_jiji)(a, b, c, d, e);
l.dynCall_viijii = (a, b, c, d, e, f, g) => (l.dynCall_viijii = Y.dynCall_viijii)(a, b, c, d, e, f, g);
l.dynCall_iiiiij = (a, b, c, d, e, f, g) => (l.dynCall_iiiiij = Y.dynCall_iiiiij)(a, b, c, d, e, f, g);
l.dynCall_iiiiijj = (a, b, c, d, e, f, g, k, p) => (l.dynCall_iiiiijj = Y.dynCall_iiiiijj)(a, b, c, d, e, f, g, k, p);
l.dynCall_iiiiiijj = (a, b, c, d, e, f, g, k, p, m) => (l.dynCall_iiiiiijj = Y.dynCall_iiiiiijj)(a, b, c, d, e, f, g, k, p, m);
function de(a, b, c) {
  var d = he();
  try {
    Rc(a)(b, c);
  } catch (e) {
    ge(d);
    if (e !== e + 0) {
      throw e;
    }
    fe(1, 0);
  }
}
var ie;
Ga = function je() {
  ie || ke();
  ie || (Ga = je);
};
function ke() {
  function a() {
    if (!ie && (ie = !0, l.calledRun = !0, !va)) {
      l.noFSInit || Vb || (Vb = !0, l.stdin = l.stdin, l.stdout = l.stdout, l.stderr = l.stderr, l.stdin ? Wb("stdin", l.stdin) : Rb("/dev/tty", "/dev/stdin"), l.stdout ? Wb("stdout", null, l.stdout) : Rb("/dev/tty", "/dev/stdout"), l.stderr ? Wb("stderr", null, l.stderr) : Rb("/dev/tty1", "/dev/stderr"), Sb("/dev/stdin", 0), Sb("/dev/stdout", 1), Sb("/dev/stderr", 1));
      Ab = !1;
      Ua(Ba);
      aa(l);
      if (l.onRuntimeInitialized) {
        l.onRuntimeInitialized();
      }
      if (l.postRun) {
        for ("function" == typeof l.postRun && (l.postRun = [l.postRun]); l.postRun.length;) {
          var b = l.postRun.shift();
          Ca.unshift(b);
        }
      }
      Ua(Ca);
    }
  }
  if (!(0 < Ea)) {
    if (l.preRun) {
      for ("function" == typeof l.preRun && (l.preRun = [l.preRun]); l.preRun.length;) {
        Da();
      }
    }
    Ua(Aa);
    0 < Ea || (l.setStatus ? (l.setStatus("Running..."), setTimeout(function() {
      setTimeout(function() {
        l.setStatus("");
      }, 1);
      a();
    }, 1)) : a());
  }
}
if (l.preInit) {
  for ("function" == typeof l.preInit && (l.preInit = [l.preInit]); 0 < l.preInit.length;) {
    l.preInit.pop()();
  }
}
ke();
moduleRtn = ca;



  return moduleRtn;
}
);
})();
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Rive);


/***/ }),
/* 5 */
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"name":"@rive-app/webgl2","version":"2.37.8","description":"Rive\'s webgl2 based web api.","main":"rive.js","homepage":"https://rive.app","repository":{"type":"git","url":"https://github.com/rive-app/rive-wasm/tree/master/js"},"keywords":["rive","animation"],"author":"Rive","contributors":["Luigi Rosso <luigi@rive.app> (https://rive.app)","Maxwell Talbot <max@rive.app> (https://rive.app)","Arthur Vivian <arthur@rive.app> (https://rive.app)","Umberto Sonnino <umberto@rive.app> (https://rive.app)","Matthew Sullivan <matt.j.sullivan@gmail.com> (mailto:matt.j.sullivan@gmail.com)","Chris Dalton <chris@rive.app> (https://rive.app)"],"license":"MIT","files":["rive.js","rive.wasm","rive_fallback.wasm","rive.js.map","rive.d.ts","rive_advanced.mjs.d.ts","runtimeLoader.d.ts","utils"],"typings":"rive.d.ts","dependencies":{},"browser":{"fs":false,"path":false}}');

/***/ }),
/* 6 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AudioAssetWrapper: () => (/* reexport safe */ _finalizationRegistry__WEBPACK_IMPORTED_MODULE_3__.AudioAssetWrapper),
/* harmony export */   AudioWrapper: () => (/* reexport safe */ _finalizationRegistry__WEBPACK_IMPORTED_MODULE_3__.AudioWrapper),
/* harmony export */   BLANK_URL: () => (/* reexport safe */ _sanitizeUrl__WEBPACK_IMPORTED_MODULE_2__.BLANK_URL),
/* harmony export */   CustomFileAssetLoaderWrapper: () => (/* reexport safe */ _finalizationRegistry__WEBPACK_IMPORTED_MODULE_3__.CustomFileAssetLoaderWrapper),
/* harmony export */   FileAssetWrapper: () => (/* reexport safe */ _finalizationRegistry__WEBPACK_IMPORTED_MODULE_3__.FileAssetWrapper),
/* harmony export */   FileFinalizer: () => (/* reexport safe */ _finalizationRegistry__WEBPACK_IMPORTED_MODULE_3__.FileFinalizer),
/* harmony export */   FontAssetWrapper: () => (/* reexport safe */ _finalizationRegistry__WEBPACK_IMPORTED_MODULE_3__.FontAssetWrapper),
/* harmony export */   FontWrapper: () => (/* reexport safe */ _finalizationRegistry__WEBPACK_IMPORTED_MODULE_3__.FontWrapper),
/* harmony export */   ImageAssetWrapper: () => (/* reexport safe */ _finalizationRegistry__WEBPACK_IMPORTED_MODULE_3__.ImageAssetWrapper),
/* harmony export */   ImageWrapper: () => (/* reexport safe */ _finalizationRegistry__WEBPACK_IMPORTED_MODULE_3__.ImageWrapper),
/* harmony export */   RiveFont: () => (/* reexport safe */ _riveFont__WEBPACK_IMPORTED_MODULE_4__.RiveFont),
/* harmony export */   createFinalization: () => (/* reexport safe */ _finalizationRegistry__WEBPACK_IMPORTED_MODULE_3__.createFinalization),
/* harmony export */   finalizationRegistry: () => (/* reexport safe */ _finalizationRegistry__WEBPACK_IMPORTED_MODULE_3__.finalizationRegistry),
/* harmony export */   registerKeyboardInteractions: () => (/* reexport safe */ _registerKeyboardInteractions__WEBPACK_IMPORTED_MODULE_1__.registerKeyboardInteractions),
/* harmony export */   registerTouchInteractions: () => (/* reexport safe */ _registerTouchInteractions__WEBPACK_IMPORTED_MODULE_0__.registerTouchInteractions),
/* harmony export */   sanitizeUrl: () => (/* reexport safe */ _sanitizeUrl__WEBPACK_IMPORTED_MODULE_2__.sanitizeUrl)
/* harmony export */ });
/* harmony import */ var _registerTouchInteractions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7);
/* harmony import */ var _registerKeyboardInteractions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8);
/* harmony import */ var _sanitizeUrl__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(9);
/* harmony import */ var _finalizationRegistry__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(10);
/* harmony import */ var _riveFont__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(11);







/***/ }),
/* 7 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   registerTouchInteractions: () => (/* binding */ registerTouchInteractions)
/* harmony export */ });
var _this = undefined;
/**
 * Extracts ClientCoordinates from a TouchList, respecting multi-touch vs.
 * single-touch mode. In single-touch mode, only the touch matching
 * primaryTouchId is returned (or the first touch when primaryTouchId is null).
 */
var getTouchCoordinates = function (changedTouches, enableMultiTouch, primaryTouchId) {
    var _a;
    var coordinates = [];
    if (enableMultiTouch) {
        for (var i = 0; i < changedTouches.length; i++) {
            var touch = changedTouches[i];
            coordinates.push({
                clientX: touch.clientX,
                clientY: touch.clientY,
                identifier: touch.identifier,
            });
        }
    }
    else {
        // In "single-touch mode", only track the primary finger identified at touchstart.
        // Search changedTouches for the touch matching the recorded primary touch identifier, or (on initial touchstart)
        // take the first available touch identifier.
        var primaryTouch = primaryTouchId !== null
            ? (_a = Array.from(changedTouches).find(function (t) { return t.identifier === primaryTouchId; })) !== null && _a !== void 0 ? _a : null
            : changedTouches[0];
        if (primaryTouch) {
            coordinates.push({
                clientX: primaryTouch.clientX,
                clientY: primaryTouch.clientY,
                identifier: primaryTouch.identifier,
            });
        }
    }
    return coordinates;
};
/**
 * Returns the clientX and clientY properties from touch or mouse events. Also
 * calls preventDefault() on the event if it is a touchstart or touchmove to prevent
 * scrolling the page on mobile devices
 * @param event - Either a TouchEvent or a MouseEvent
 * @param isTouchScrollEnabled - Whether touch scrolling is enabled
 * @param enableMultiTouch - Whether to process multiple simultaneous touches
 * @param primaryTouchId - When working with single touches, only process the touch
 *   with this identifier. Pass null to accept any touch (used during touchstart to
 *   capture the first finger down).
 * @returns - Coordinates of the clientX and clientY properties from the touch/mouse event
 */
var getClientCoordinates = function (event, isTouchScrollEnabled, enableMultiTouch, primaryTouchId) {
    var _a;
    var touchEvent = event;
    if ((_a = touchEvent.changedTouches) === null || _a === void 0 ? void 0 : _a.length) {
        // This flag, if false, prevents touch events on the canvas default behavior
        // which may prevent scrolling if a drag motion on the canvas is performed
        if (!isTouchScrollEnabled && ["touchstart", "touchmove"].includes(event.type)) {
            event.preventDefault();
        }
        return getTouchCoordinates(touchEvent.changedTouches, enableMultiTouch, primaryTouchId);
    }
    return [
        {
            clientX: event.clientX,
            clientY: event.clientY,
            identifier: 0,
        },
    ];
};
/**
 * Registers mouse move/up/down callback handlers on the canvas to send meaningful coordinates to
 * the state machine pointer move/up/down functions based on cursor interaction
 */
var registerTouchInteractions = function (_a) {
    var canvas = _a.canvas, artboard = _a.artboard, _b = _a.stateMachines, stateMachines = _b === void 0 ? [] : _b, renderer = _a.renderer, rive = _a.rive, fit = _a.fit, alignment = _a.alignment, _c = _a.isTouchScrollEnabled, isTouchScrollEnabled = _c === void 0 ? false : _c, _d = _a.dispatchPointerExit, dispatchPointerExit = _d === void 0 ? true : _d, _e = _a.enableMultiTouch, enableMultiTouch = _e === void 0 ? false : _e, _f = _a.layoutScaleFactor, layoutScaleFactor = _f === void 0 ? 1.0 : _f;
    if (!canvas ||
        !stateMachines.length ||
        !renderer ||
        !rive ||
        !artboard ||
        typeof window === "undefined") {
        return null;
    }
    /**
     * After a touchend event, some browsers may fire synthetic mouse events
     * (mouseover, mousedown, mousemove, mouseup) if the touch interaction did not cause
     * any default action (such as scrolling).
     *
     * This is done to simulate the behavior of a mouse for applications that do not support
     * touch events.
     *
     * We're keeping track of the previous event to not send the synthetic mouse events if the
     * touch event was a click (touchstart -> touchend).
     *
     * This is only needed when `isTouchScrollEnabled` is false
     * When true, `preventDefault()` is called which prevents this behaviour.
     **/
    var _prevEventType = null;
    var _syntheticEventsActive = false;
    /**
     * When enableMultiTouch is false ("single-touch mode"), we track the identifier of the first finger that touched down.
     * All subsequent touch events are filtered to this identifier so that a second finger
     * moving cannot displace the tracked pointer position.
     * Reset to null when the primary finger lifts (or touchcancel is called)
     */
    var _primaryTouchId = null;
    var processEventCallback = function (event) {
        var _a;
        // Exit early out of all synthetic mouse events
        // https://stackoverflow.com/questions/9656990/how-to-prevent-simulated-mouse-events-in-mobile-browsers
        // https://stackoverflow.com/questions/25572070/javascript-touchend-versus-click-dilemma
        if (_syntheticEventsActive && event instanceof MouseEvent) {
            // Synthetic event finished
            if (event.type == "mouseup") {
                _syntheticEventsActive = false;
            }
            return;
        }
        // Test if it's a "touch click". This could cause the browser to send
        // synthetic mouse events.
        _syntheticEventsActive =
            isTouchScrollEnabled &&
                event.type === "touchend" &&
                _prevEventType === "touchstart";
        _prevEventType = event.type;
        var boundingRect = event.currentTarget.getBoundingClientRect();
        // On touchstart in single-touch mode, record the first new finger as the primary
        // touch if we aren't already tracking one.
        if (!enableMultiTouch && event.type === "touchstart" && _primaryTouchId === null) {
            var firstTouch = (_a = event.changedTouches) === null || _a === void 0 ? void 0 : _a[0];
            if (firstTouch) {
                _primaryTouchId = firstTouch.identifier;
            }
        }
        var coordinateSets = getClientCoordinates(event, isTouchScrollEnabled, enableMultiTouch, enableMultiTouch ? null : _primaryTouchId);
        var forwardMatrix = rive.computeAlignment(fit, alignment, {
            minX: 0,
            minY: 0,
            maxX: boundingRect.width,
            maxY: boundingRect.height,
        }, artboard.bounds, layoutScaleFactor);
        var invertedMatrix = new rive.Mat2D();
        forwardMatrix.invert(invertedMatrix);
        coordinateSets.forEach(function (coordinateSet) {
            var clientX = coordinateSet.clientX;
            var clientY = coordinateSet.clientY;
            if (!clientX && !clientY) {
                return;
            }
            var canvasX = clientX - boundingRect.left;
            var canvasY = clientY - boundingRect.top;
            var canvasCoordinatesVector = new rive.Vec2D(canvasX, canvasY);
            var transformedVector = rive.mapXY(invertedMatrix, canvasCoordinatesVector);
            var transformedX = transformedVector.x();
            var transformedY = transformedVector.y();
            coordinateSet.transformedX = transformedX;
            coordinateSet.transformedY = transformedY;
            transformedVector.delete();
            canvasCoordinatesVector.delete();
        });
        invertedMatrix.delete();
        forwardMatrix.delete();
        switch (event.type) {
            /**
             * There's a 2px buffer for a hitRadius when translating the pointer coordinates
             * down to the state machine. In cases where the hitbox is about that much away
             * from the Artboard border, we don't have exact precision on determining pointer
             * exit. We're therefore adding to the translated coordinates on mouseout of a canvas
             * to ensure that we report the mouse has truly exited the hitarea.
             * https://github.com/rive-app/rive-cpp/blob/master/src/animation/state_machine_instance.cpp#L336
             *
             */
            case "mouseout":
                var _loop_1 = function (stateMachine) {
                    if (dispatchPointerExit) {
                        coordinateSets.forEach(function (coordinateSet) {
                            stateMachine.pointerExit(coordinateSet.transformedX, coordinateSet.transformedY, coordinateSet.identifier);
                        });
                    }
                    else {
                        coordinateSets.forEach(function (coordinateSet) {
                            stateMachine.pointerMove(coordinateSet.transformedX, coordinateSet.transformedY, coordinateSet.identifier);
                        });
                    }
                };
                for (var _i = 0, stateMachines_1 = stateMachines; _i < stateMachines_1.length; _i++) {
                    var stateMachine = stateMachines_1[_i];
                    _loop_1(stateMachine);
                }
                break;
            // Pointer moving/hovering on the canvas
            case "touchmove":
            case "mouseover":
            case "mousemove": {
                var _loop_2 = function (stateMachine) {
                    coordinateSets.forEach(function (coordinateSet) {
                        stateMachine.pointerMove(coordinateSet.transformedX, coordinateSet.transformedY, coordinateSet.identifier);
                    });
                };
                for (var _b = 0, stateMachines_2 = stateMachines; _b < stateMachines_2.length; _b++) {
                    var stateMachine = stateMachines_2[_b];
                    _loop_2(stateMachine);
                }
                break;
            }
            // Pointer click initiated but not released yet on the canvas
            case "touchstart":
            case "mousedown": {
                var _loop_3 = function (stateMachine) {
                    coordinateSets.forEach(function (coordinateSet) {
                        stateMachine.pointerDown(coordinateSet.transformedX, coordinateSet.transformedY, coordinateSet.identifier);
                    });
                };
                for (var _c = 0, stateMachines_3 = stateMachines; _c < stateMachines_3.length; _c++) {
                    var stateMachine = stateMachines_3[_c];
                    _loop_3(stateMachine);
                }
                break;
            }
            // Pointer click released on the canvas
            case "touchend": {
                var _loop_4 = function (stateMachine) {
                    coordinateSets.forEach(function (coordinateSet) {
                        stateMachine.pointerUp(coordinateSet.transformedX, coordinateSet.transformedY, coordinateSet.identifier);
                        stateMachine.pointerExit(coordinateSet.transformedX, coordinateSet.transformedY, coordinateSet.identifier);
                    });
                };
                for (var _d = 0, stateMachines_4 = stateMachines; _d < stateMachines_4.length; _d++) {
                    var stateMachine = stateMachines_4[_d];
                    _loop_4(stateMachine);
                }
                // Release the primary touch lock once that finger lifts so the next
                // touchstart can claim a new primary finger.
                if (!enableMultiTouch &&
                    coordinateSets.some(function (c) { return c.identifier === _primaryTouchId; })) {
                    _primaryTouchId = null;
                }
                break;
            }
            case "mouseup": {
                var _loop_5 = function (stateMachine) {
                    coordinateSets.forEach(function (coordinateSet) {
                        stateMachine.pointerUp(coordinateSet.transformedX, coordinateSet.transformedY, coordinateSet.identifier);
                    });
                };
                for (var _e = 0, stateMachines_5 = stateMachines; _e < stateMachines_5.length; _e++) {
                    var stateMachine = stateMachines_5[_e];
                    _loop_5(stateMachine);
                }
                break;
            }
            default:
        }
    };
    var touchCancelCallback = function () {
        _primaryTouchId = null;
    };
    var callback = processEventCallback.bind(_this);
    canvas.addEventListener("mouseover", callback);
    canvas.addEventListener("mouseout", callback);
    canvas.addEventListener("mousemove", callback);
    canvas.addEventListener("mousedown", callback);
    canvas.addEventListener("mouseup", callback);
    canvas.addEventListener("touchmove", callback, {
        passive: isTouchScrollEnabled,
    });
    canvas.addEventListener("touchstart", callback, {
        passive: isTouchScrollEnabled,
    });
    canvas.addEventListener("touchend", callback);
    canvas.addEventListener("touchcancel", touchCancelCallback);
    return function () {
        canvas.removeEventListener("mouseover", callback);
        canvas.removeEventListener("mouseout", callback);
        canvas.removeEventListener("mousemove", callback);
        canvas.removeEventListener("mousedown", callback);
        canvas.removeEventListener("mouseup", callback);
        canvas.removeEventListener("touchmove", callback);
        canvas.removeEventListener("touchstart", callback);
        canvas.removeEventListener("touchend", callback);
        canvas.removeEventListener("touchcancel", touchCancelCallback);
    };
};


/***/ }),
/* 8 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   registerKeyboardInteractions: () => (/* binding */ registerKeyboardInteractions)
/* harmony export */ });
/**
 * Registers focus and tab-traversal event handlers on the canvas to route
 * Tab/Shift+Tab to the active Rive state machine's focus manager.
 *
 * Mirrors registerTouchInteractions for pointer events.
 *
 * Returns a cleanup function that removes all registered event listeners,
 * or null if the setup conditions are not met.
 */
var registerKeyboardInteractions = function (_a) {
    var canvas = _a.canvas, stateMachine = _a.stateMachine, rive = _a.rive, hasFocusNodes = _a.hasFocusNodes;
    if (!canvas ||
        !stateMachine ||
        !rive ||
        typeof window === "undefined") {
        return null;
    }
    // Work off an assumption of a single state machine
    var mainSm = stateMachine;
    var canvasHasFocus = false;
    var onCanvasFocus = function (_event) {
        canvasHasFocus = true;
    };
    var onCanvasBlur = function (_event) {
        canvasHasFocus = false;
    };
    var onKeyDown = function (event) {
        if (!canvasHasFocus)
            return;
        if (event.code === "Tab" && hasFocusNodes) {
            var forward = !event.shiftKey;
            var focusMoved = forward ? mainSm.focusNext() : mainSm.focusPrevious();
            if (focusMoved) {
                // Keep Tab inside the canvas — a Rive node received focus.
                event.preventDefault();
            }
            else {
                // No more traversable nodes — release Tab to the page.
                // Since we're not preventing default, blur event will fire on the canvas
                canvasHasFocus = false;
            }
        }
    };
    canvas.addEventListener("focus", onCanvasFocus);
    canvas.addEventListener("blur", onCanvasBlur);
    canvas.addEventListener("keydown", onKeyDown);
    return function () {
        canvas.removeEventListener("focus", onCanvasFocus);
        canvas.removeEventListener("blur", onCanvasBlur);
        canvas.removeEventListener("keydown", onKeyDown);
    };
};


/***/ }),
/* 9 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BLANK_URL: () => (/* binding */ BLANK_URL),
/* harmony export */   sanitizeUrl: () => (/* binding */ sanitizeUrl)
/* harmony export */ });
// Reference: https://github.com/braintree/sanitize-url/tree/main
var invalidProtocolRegex = /^([^\w]*)(javascript|data|vbscript)/im;
var htmlEntitiesRegex = /&#(\w+)(^\w|;)?/g;
var htmlCtrlEntityRegex = /&(newline|tab);/gi;
var ctrlCharactersRegex = /[\u0000-\u001F\u007F-\u009F\u2000-\u200D\uFEFF]/gim;
var urlSchemeRegex = /^.+(:|&colon;)/gim;
var relativeFirstCharacters = [".", "/"];
var BLANK_URL = "about:blank";
function isRelativeUrlWithoutProtocol(url) {
    return relativeFirstCharacters.indexOf(url[0]) > -1;
}
// adapted from https://stackoverflow.com/a/29824550/2601552
function decodeHtmlCharacters(str) {
    var removedNullByte = str.replace(ctrlCharactersRegex, "");
    return removedNullByte.replace(htmlEntitiesRegex, function (match, dec) {
        return String.fromCharCode(dec);
    });
}
function sanitizeUrl(url) {
    if (!url) {
        return BLANK_URL;
    }
    var sanitizedUrl = decodeHtmlCharacters(url)
        .replace(htmlCtrlEntityRegex, "")
        .replace(ctrlCharactersRegex, "")
        .trim();
    if (!sanitizedUrl) {
        return BLANK_URL;
    }
    if (isRelativeUrlWithoutProtocol(sanitizedUrl)) {
        return sanitizedUrl;
    }
    var urlSchemeParseResults = sanitizedUrl.match(urlSchemeRegex);
    if (!urlSchemeParseResults) {
        return sanitizedUrl;
    }
    var urlScheme = urlSchemeParseResults[0];
    if (invalidProtocolRegex.test(urlScheme)) {
        return BLANK_URL;
    }
    return sanitizedUrl;
}


/***/ }),
/* 10 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AudioAssetWrapper: () => (/* binding */ AudioAssetWrapper),
/* harmony export */   AudioWrapper: () => (/* binding */ AudioWrapper),
/* harmony export */   CustomFileAssetLoaderWrapper: () => (/* binding */ CustomFileAssetLoaderWrapper),
/* harmony export */   FileAssetWrapper: () => (/* binding */ FileAssetWrapper),
/* harmony export */   FileFinalizer: () => (/* binding */ FileFinalizer),
/* harmony export */   FontAssetWrapper: () => (/* binding */ FontAssetWrapper),
/* harmony export */   FontWrapper: () => (/* binding */ FontWrapper),
/* harmony export */   ImageAssetWrapper: () => (/* binding */ ImageAssetWrapper),
/* harmony export */   ImageWrapper: () => (/* binding */ ImageWrapper),
/* harmony export */   createFinalization: () => (/* binding */ createFinalization),
/* harmony export */   finalizationRegistry: () => (/* binding */ finalizationRegistry)
/* harmony export */ });
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var FileFinalizer = /** @class */ (function () {
    function FileFinalizer(file) {
        this.selfUnref = false;
        this._file = file;
    }
    FileFinalizer.prototype.unref = function () {
        if (this._file) {
            this._file.unref();
        }
    };
    return FileFinalizer;
}());
var ObjectFinalizer = /** @class */ (function () {
    function ObjectFinalizer(finalizableObject) {
        this._finalizableObject = finalizableObject;
    }
    ObjectFinalizer.prototype.unref = function () {
        this._finalizableObject.unref();
    };
    return ObjectFinalizer;
}());
var AssetWrapper = /** @class */ (function () {
    function AssetWrapper() {
        this.selfUnref = false;
    }
    AssetWrapper.prototype.unref = function () { };
    return AssetWrapper;
}());
var ImageWrapper = /** @class */ (function (_super) {
    __extends(ImageWrapper, _super);
    function ImageWrapper(image) {
        var _this = _super.call(this) || this;
        _this._nativeImage = image;
        return _this;
    }
    Object.defineProperty(ImageWrapper.prototype, "nativeImage", {
        get: function () {
            return this._nativeImage;
        },
        enumerable: false,
        configurable: true
    });
    ImageWrapper.prototype.unref = function () {
        if (this.selfUnref) {
            this._nativeImage.unref();
        }
    };
    return ImageWrapper;
}(AssetWrapper));
var AudioWrapper = /** @class */ (function (_super) {
    __extends(AudioWrapper, _super);
    function AudioWrapper(audio) {
        var _this = _super.call(this) || this;
        _this._nativeAudio = audio;
        return _this;
    }
    Object.defineProperty(AudioWrapper.prototype, "nativeAudio", {
        get: function () {
            return this._nativeAudio;
        },
        enumerable: false,
        configurable: true
    });
    AudioWrapper.prototype.unref = function () {
        if (this.selfUnref) {
            this._nativeAudio.unref();
        }
    };
    return AudioWrapper;
}(AssetWrapper));
var FontWrapper = /** @class */ (function (_super) {
    __extends(FontWrapper, _super);
    function FontWrapper(font) {
        var _this = _super.call(this) || this;
        _this._nativeFont = font;
        return _this;
    }
    Object.defineProperty(FontWrapper.prototype, "nativeFont", {
        get: function () {
            return this._nativeFont;
        },
        enumerable: false,
        configurable: true
    });
    FontWrapper.prototype.unref = function () {
        if (this.selfUnref) {
            this._nativeFont.unref();
        }
    };
    return FontWrapper;
}(AssetWrapper));
var CustomFileAssetLoaderWrapper = /** @class */ (function () {
    function CustomFileAssetLoaderWrapper(runtime, loaderCallback) {
        this._assetLoaderCallback = loaderCallback;
        this.assetLoader = new runtime.CustomFileAssetLoader({
            loadContents: this.loadContents.bind(this),
        });
    }
    CustomFileAssetLoaderWrapper.prototype.loadContents = function (asset, bytes) {
        var assetWrapper;
        if (asset.isImage) {
            assetWrapper = new ImageAssetWrapper(asset);
        }
        else if (asset.isAudio) {
            assetWrapper = new AudioAssetWrapper(asset);
        }
        else if (asset.isFont) {
            assetWrapper = new FontAssetWrapper(asset);
        }
        return this._assetLoaderCallback(assetWrapper, bytes);
    };
    return CustomFileAssetLoaderWrapper;
}());
/**
 * Rive class representing a FileAsset with relevant metadata fields to describe
 * an asset associated wtih the Rive File
 */
var FileAssetWrapper = /** @class */ (function () {
    function FileAssetWrapper(nativeAsset) {
        this._nativeFileAsset = nativeAsset;
    }
    FileAssetWrapper.prototype.decode = function (bytes) {
        this._nativeFileAsset.decode(bytes);
    };
    Object.defineProperty(FileAssetWrapper.prototype, "name", {
        get: function () {
            return this._nativeFileAsset.name;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FileAssetWrapper.prototype, "fileExtension", {
        get: function () {
            return this._nativeFileAsset.fileExtension;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FileAssetWrapper.prototype, "uniqueFilename", {
        get: function () {
            return this._nativeFileAsset.uniqueFilename;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FileAssetWrapper.prototype, "isAudio", {
        get: function () {
            return this._nativeFileAsset.isAudio;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FileAssetWrapper.prototype, "isImage", {
        get: function () {
            return this._nativeFileAsset.isImage;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FileAssetWrapper.prototype, "isFont", {
        get: function () {
            return this._nativeFileAsset.isFont;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FileAssetWrapper.prototype, "cdnUuid", {
        get: function () {
            return this._nativeFileAsset.cdnUuid;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FileAssetWrapper.prototype, "nativeFileAsset", {
        get: function () {
            return this._nativeFileAsset;
        },
        enumerable: false,
        configurable: true
    });
    return FileAssetWrapper;
}());
/**
 * Rive class extending the FileAsset that exposes a `setRenderImage()` API with a
 * decoded Image (via the `decodeImage()` API) to set a new Image on the Rive FileAsset
 */
var ImageAssetWrapper = /** @class */ (function (_super) {
    __extends(ImageAssetWrapper, _super);
    function ImageAssetWrapper() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ImageAssetWrapper.prototype.setRenderImage = function (image) {
        this._nativeFileAsset.setRenderImage(image.nativeImage);
    };
    return ImageAssetWrapper;
}(FileAssetWrapper));
/**
 * Rive class extending the FileAsset that exposes a `setAudioSource()` API with a
 * decoded Audio (via the `decodeAudio()` API) to set a new Audio on the Rive FileAsset
 */
var AudioAssetWrapper = /** @class */ (function (_super) {
    __extends(AudioAssetWrapper, _super);
    function AudioAssetWrapper() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AudioAssetWrapper.prototype.setAudioSource = function (audio) {
        this._nativeFileAsset.setAudioSource(audio.nativeAudio);
    };
    return AudioAssetWrapper;
}(FileAssetWrapper));
/**
 * Rive class extending the FileAsset that exposes a `setFont()` API with a
 * decoded Font (via the `decodeFont()` API) to set a new Font on the Rive FileAsset
 */
var FontAssetWrapper = /** @class */ (function (_super) {
    __extends(FontAssetWrapper, _super);
    function FontAssetWrapper() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FontAssetWrapper.prototype.setFont = function (font) {
        this._nativeFileAsset.setFont(font.nativeFont);
    };
    return FontAssetWrapper;
}(FileAssetWrapper));
var FakeFinalizationRegistry = /** @class */ (function () {
    function FakeFinalizationRegistry(_) {
    }
    FakeFinalizationRegistry.prototype.register = function (object) {
        object.selfUnref = true;
    };
    FakeFinalizationRegistry.prototype.unregister = function (_) { };
    return FakeFinalizationRegistry;
}());
var MyFinalizationRegistry = typeof FinalizationRegistry !== "undefined"
    ? FinalizationRegistry
    : FakeFinalizationRegistry;
var finalizationRegistry = new MyFinalizationRegistry(function (ob) {
    ob === null || ob === void 0 ? void 0 : ob.unref();
});
var createFinalization = function (target, finalizable) {
    var finalizer = new ObjectFinalizer(finalizable);
    finalizationRegistry.register(target, finalizer);
};



/***/ }),
/* 11 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   RiveFont: () => (/* binding */ RiveFont)
/* harmony export */ });
/* harmony import */ var _runtimeLoader__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3);

// Class to manage fallback fonts for Rive.
var RiveFont = /** @class */ (function () {
    // Class is never instantiated
    function RiveFont() {
    }
    /**
     * Set a callback to dynamically set a list of fallback fonts based on the missing glyph and/or style of the default font.
     * Set null to clear the callback.
     * @param fontCallback Callback to set a list of fallback fonts.
     */
    RiveFont.setFallbackFontCallback = function (fontCallback) {
        RiveFont._fallbackFontCallback = fontCallback !== null && fontCallback !== void 0 ? fontCallback : null;
        RiveFont._wireFallbackProc();
    };
    // Get the pointer value to the Embind Font object from FontWrapper
    RiveFont._fontToPtr = function (fontWrapper) {
        var _a;
        if (fontWrapper == null)
            return null;
        var embindFont = fontWrapper.nativeFont;
        var ptr = (_a = embindFont === null || embindFont === void 0 ? void 0 : embindFont.ptr) === null || _a === void 0 ? void 0 : _a.call(embindFont);
        return ptr !== null && ptr !== void 0 ? ptr : null;
    };
    RiveFont._getFallbackPtr = function (fonts, index) {
        if (index < 0 || index >= fonts.length)
            return null;
        return RiveFont._fontToPtr(fonts[index]);
    };
    // Create the callback Rive expects to use for fallback fonts (regardless if set via a user-supplied static list, or callback)
    // 1. Ensure WASM is ready
    // 2. Bias for checking user callback over static list of fonts and pass it down to Rive to store as reference
    //    - When calling the user callback, check if we have any fonts left to check, and if not, return null to indicate there are no more fallbacks to try.
    //    - If the user callback returns an array of fonts, pass the pointer value to Rive of the font to try
    // 3. If no callback is provided, or the callback returns null, try the static list of fonts if they set any
    // 4. If no fallback method is set, return null.
    RiveFont._wireFallbackProc = function () {
        _runtimeLoader__WEBPACK_IMPORTED_MODULE_0__.RuntimeLoader.getInstance(function (rive) {
            var cb = RiveFont._fallbackFontCallback;
            if (cb) {
                rive.setFallbackFontCallback((function (missingGlyph, fallbackFontIndex, weight) {
                    var fontsReturned = cb(missingGlyph, weight);
                    if (fontsReturned) {
                        if (Array.isArray(fontsReturned)) {
                            return RiveFont._getFallbackPtr(fontsReturned, fallbackFontIndex);
                        }
                        // If the user callback only returns a single font, provide it to Rive the first time, otherwise if Rive
                        // calls back a second time, return null to indicate there are no more fallbacks to try.
                        return fallbackFontIndex === 0 ? RiveFont._fontToPtr(fontsReturned) : null;
                    }
                    return null;
                }));
            }
            else {
                rive.setFallbackFontCallback(null);
            }
        });
    };
    RiveFont._fallbackFontCallback = null;
    return RiveFont;
}());



/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Alignment: () => (/* binding */ Alignment),
/* harmony export */   DataEnum: () => (/* binding */ DataEnum),
/* harmony export */   DataType: () => (/* binding */ DataType),
/* harmony export */   DrawOptimizationOptions: () => (/* binding */ DrawOptimizationOptions),
/* harmony export */   EventType: () => (/* binding */ EventType),
/* harmony export */   Fit: () => (/* binding */ Fit),
/* harmony export */   Layout: () => (/* binding */ Layout),
/* harmony export */   LoopType: () => (/* binding */ LoopType),
/* harmony export */   Rive: () => (/* binding */ Rive),
/* harmony export */   RiveEventType: () => (/* binding */ RiveEventType),
/* harmony export */   RiveFile: () => (/* binding */ RiveFile),
/* harmony export */   RiveFont: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_2__.RiveFont),
/* harmony export */   RuntimeLoader: () => (/* reexport safe */ _runtimeLoader__WEBPACK_IMPORTED_MODULE_1__.RuntimeLoader),
/* harmony export */   StateMachineInput: () => (/* binding */ StateMachineInput),
/* harmony export */   StateMachineInputType: () => (/* binding */ StateMachineInputType),
/* harmony export */   Testing: () => (/* binding */ Testing),
/* harmony export */   ViewModel: () => (/* binding */ ViewModel),
/* harmony export */   ViewModelInstance: () => (/* binding */ ViewModelInstance),
/* harmony export */   ViewModelInstanceArtboard: () => (/* binding */ ViewModelInstanceArtboard),
/* harmony export */   ViewModelInstanceAssetImage: () => (/* binding */ ViewModelInstanceAssetImage),
/* harmony export */   ViewModelInstanceBoolean: () => (/* binding */ ViewModelInstanceBoolean),
/* harmony export */   ViewModelInstanceColor: () => (/* binding */ ViewModelInstanceColor),
/* harmony export */   ViewModelInstanceEnum: () => (/* binding */ ViewModelInstanceEnum),
/* harmony export */   ViewModelInstanceList: () => (/* binding */ ViewModelInstanceList),
/* harmony export */   ViewModelInstanceNumber: () => (/* binding */ ViewModelInstanceNumber),
/* harmony export */   ViewModelInstanceString: () => (/* binding */ ViewModelInstanceString),
/* harmony export */   ViewModelInstanceTrigger: () => (/* binding */ ViewModelInstanceTrigger),
/* harmony export */   ViewModelInstanceValue: () => (/* binding */ ViewModelInstanceValue),
/* harmony export */   decodeAudio: () => (/* binding */ decodeAudio),
/* harmony export */   decodeFont: () => (/* binding */ decodeFont),
/* harmony export */   decodeImage: () => (/* binding */ decodeImage)
/* harmony export */ });
/* harmony import */ var _animation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var _runtimeLoader__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(6);
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (undefined && undefined.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (undefined && undefined.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};



var RiveError = /** @class */ (function (_super) {
    __extends(RiveError, _super);
    function RiveError() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.isHandledError = true;
        return _this;
    }
    return RiveError;
}(Error));

// #regions helpers
var resolveErrorMessage = function (error) {
    return error && error.isHandledError
        ? error.message
        : "Problem loading file; may be corrupt!";
};
// #region layout
// Fit options for the canvas
var Fit;
(function (Fit) {
    Fit["Cover"] = "cover";
    Fit["Contain"] = "contain";
    Fit["Fill"] = "fill";
    Fit["FitWidth"] = "fitWidth";
    Fit["FitHeight"] = "fitHeight";
    Fit["None"] = "none";
    Fit["ScaleDown"] = "scaleDown";
    Fit["Layout"] = "layout";
})(Fit || (Fit = {}));
// Alignment options for the canvas
var Alignment;
(function (Alignment) {
    Alignment["Center"] = "center";
    Alignment["TopLeft"] = "topLeft";
    Alignment["TopCenter"] = "topCenter";
    Alignment["TopRight"] = "topRight";
    Alignment["CenterLeft"] = "centerLeft";
    Alignment["CenterRight"] = "centerRight";
    Alignment["BottomLeft"] = "bottomLeft";
    Alignment["BottomCenter"] = "bottomCenter";
    Alignment["BottomRight"] = "bottomRight";
})(Alignment || (Alignment = {}));
// Drawing optimization options
var DrawOptimizationOptions;
(function (DrawOptimizationOptions) {
    DrawOptimizationOptions["AlwaysDraw"] = "alwaysDraw";
    DrawOptimizationOptions["DrawOnChanged"] = "drawOnChanged";
})(DrawOptimizationOptions || (DrawOptimizationOptions = {}));
// Alignment options for Rive animations in a HTML canvas
var Layout = /** @class */ (function () {
    function Layout(params) {
        var _a, _b, _c, _d, _e, _f, _g;
        this.fit = (_a = params === null || params === void 0 ? void 0 : params.fit) !== null && _a !== void 0 ? _a : Fit.Contain;
        this.alignment = (_b = params === null || params === void 0 ? void 0 : params.alignment) !== null && _b !== void 0 ? _b : Alignment.Center;
        this.layoutScaleFactor = (_c = params === null || params === void 0 ? void 0 : params.layoutScaleFactor) !== null && _c !== void 0 ? _c : 1;
        this.minX = (_d = params === null || params === void 0 ? void 0 : params.minX) !== null && _d !== void 0 ? _d : 0;
        this.minY = (_e = params === null || params === void 0 ? void 0 : params.minY) !== null && _e !== void 0 ? _e : 0;
        this.maxX = (_f = params === null || params === void 0 ? void 0 : params.maxX) !== null && _f !== void 0 ? _f : 0;
        this.maxY = (_g = params === null || params === void 0 ? void 0 : params.maxY) !== null && _g !== void 0 ? _g : 0;
    }
    // Alternative constructor to build a Layout from an interface/object
    Layout.new = function (_a) {
        var fit = _a.fit, alignment = _a.alignment, minX = _a.minX, minY = _a.minY, maxX = _a.maxX, maxY = _a.maxY;
        console.warn("This function is deprecated: please use `new Layout({})` instead");
        return new Layout({ fit: fit, alignment: alignment, minX: minX, minY: minY, maxX: maxX, maxY: maxY });
    };
    /**
     * Makes a copy of the layout, replacing any specified parameters
     */
    Layout.prototype.copyWith = function (_a) {
        var fit = _a.fit, alignment = _a.alignment, layoutScaleFactor = _a.layoutScaleFactor, minX = _a.minX, minY = _a.minY, maxX = _a.maxX, maxY = _a.maxY;
        return new Layout({
            fit: fit !== null && fit !== void 0 ? fit : this.fit,
            alignment: alignment !== null && alignment !== void 0 ? alignment : this.alignment,
            layoutScaleFactor: layoutScaleFactor !== null && layoutScaleFactor !== void 0 ? layoutScaleFactor : this.layoutScaleFactor,
            minX: minX !== null && minX !== void 0 ? minX : this.minX,
            minY: minY !== null && minY !== void 0 ? minY : this.minY,
            maxX: maxX !== null && maxX !== void 0 ? maxX : this.maxX,
            maxY: maxY !== null && maxY !== void 0 ? maxY : this.maxY,
        });
    };
    // Returns fit for the Wasm runtime format
    Layout.prototype.runtimeFit = function (rive) {
        if (this.cachedRuntimeFit)
            return this.cachedRuntimeFit;
        var fit;
        if (this.fit === Fit.Cover)
            fit = rive.Fit.cover;
        else if (this.fit === Fit.Contain)
            fit = rive.Fit.contain;
        else if (this.fit === Fit.Fill)
            fit = rive.Fit.fill;
        else if (this.fit === Fit.FitWidth)
            fit = rive.Fit.fitWidth;
        else if (this.fit === Fit.FitHeight)
            fit = rive.Fit.fitHeight;
        else if (this.fit === Fit.ScaleDown)
            fit = rive.Fit.scaleDown;
        else if (this.fit === Fit.Layout)
            fit = rive.Fit.layout;
        else
            fit = rive.Fit.none;
        this.cachedRuntimeFit = fit;
        return fit;
    };
    // Returns alignment for the Wasm runtime format
    Layout.prototype.runtimeAlignment = function (rive) {
        if (this.cachedRuntimeAlignment)
            return this.cachedRuntimeAlignment;
        var alignment;
        if (this.alignment === Alignment.TopLeft)
            alignment = rive.Alignment.topLeft;
        else if (this.alignment === Alignment.TopCenter)
            alignment = rive.Alignment.topCenter;
        else if (this.alignment === Alignment.TopRight)
            alignment = rive.Alignment.topRight;
        else if (this.alignment === Alignment.CenterLeft)
            alignment = rive.Alignment.centerLeft;
        else if (this.alignment === Alignment.CenterRight)
            alignment = rive.Alignment.centerRight;
        else if (this.alignment === Alignment.BottomLeft)
            alignment = rive.Alignment.bottomLeft;
        else if (this.alignment === Alignment.BottomCenter)
            alignment = rive.Alignment.bottomCenter;
        else if (this.alignment === Alignment.BottomRight)
            alignment = rive.Alignment.bottomRight;
        else
            alignment = rive.Alignment.center;
        this.cachedRuntimeAlignment = alignment;
        return alignment;
    };
    return Layout;
}());

// #endregion
// #region runtime

// #endregion
// #region state machines
var StateMachineInputType;
(function (StateMachineInputType) {
    StateMachineInputType[StateMachineInputType["Number"] = 56] = "Number";
    StateMachineInputType[StateMachineInputType["Trigger"] = 58] = "Trigger";
    StateMachineInputType[StateMachineInputType["Boolean"] = 59] = "Boolean";
})(StateMachineInputType || (StateMachineInputType = {}));
/**
 * An input for a state machine
 */
var StateMachineInput = /** @class */ (function () {
    function StateMachineInput(type, runtimeInput) {
        this.type = type;
        this.runtimeInput = runtimeInput;
    }
    Object.defineProperty(StateMachineInput.prototype, "name", {
        /**
         * Returns the name of the input
         */
        get: function () {
            return this.runtimeInput.name;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(StateMachineInput.prototype, "value", {
        /**
         * Returns the current value of the input
         */
        get: function () {
            return this.runtimeInput.value;
        },
        /**
         * Sets the value of the input
         */
        set: function (value) {
            this.runtimeInput.value = value;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Fires a trigger; does nothing on Number or Boolean input types
     */
    StateMachineInput.prototype.fire = function () {
        if (this.type === StateMachineInputType.Trigger) {
            this.runtimeInput.fire();
        }
    };
    /**
     * Deletes the input
     */
    StateMachineInput.prototype.delete = function () {
        this.runtimeInput = null;
    };
    return StateMachineInput;
}());

var RiveEventType;
(function (RiveEventType) {
    RiveEventType[RiveEventType["General"] = 128] = "General";
    RiveEventType[RiveEventType["OpenUrl"] = 131] = "OpenUrl";
})(RiveEventType || (RiveEventType = {}));
var BaseArtboard = /** @class */ (function () {
    function BaseArtboard(_isBindableArtboard) {
        this.isBindableArtboard = false;
        this.isBindableArtboard = _isBindableArtboard;
    }
    return BaseArtboard;
}());
var Artboard = /** @class */ (function (_super) {
    __extends(Artboard, _super);
    function Artboard(artboard, _file) {
        var _this = _super.call(this, false) || this;
        _this.nativeArtboard = artboard;
        _this.file = _file;
        return _this;
    }
    return Artboard;
}(BaseArtboard));
var BindableArtboard = /** @class */ (function (_super) {
    __extends(BindableArtboard, _super);
    function BindableArtboard(artboard) {
        var _this = _super.call(this, true) || this;
        _this.selfUnref = false;
        _this.nativeArtboard = artboard;
        return _this;
    }
    Object.defineProperty(BindableArtboard.prototype, "viewModel", {
        set: function (value) {
            this.nativeViewModel = value.nativeInstance;
        },
        enumerable: false,
        configurable: true
    });
    BindableArtboard.prototype.destroy = function () {
        var _a;
        if (this.selfUnref) {
            this.nativeArtboard.unref();
            (_a = this.nativeViewModel) === null || _a === void 0 ? void 0 : _a.unref();
        }
    };
    return BindableArtboard;
}(BaseArtboard));
var StateMachine = /** @class */ (function () {
    /**
     * @constructor
     * @param stateMachine runtime state machine object
     * @param instance runtime state machine instance object
     */
    function StateMachine(stateMachine, runtime, playing, artboard) {
        this.stateMachine = stateMachine;
        this.playing = playing;
        this.artboard = artboard;
        /**
         * Caches the inputs from the runtime
         */
        this.inputs = [];
        this.instance = new runtime.StateMachineInstance(stateMachine, artboard);
        this.initInputs(runtime);
    }
    Object.defineProperty(StateMachine.prototype, "name", {
        get: function () {
            return this.stateMachine.name;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(StateMachine.prototype, "statesChanged", {
        /**
         * Returns a list of state names that have changed on this frame
         */
        get: function () {
            var names = [];
            for (var i = 0; i < this.instance.stateChangedCount(); i++) {
                names.push(this.instance.stateChangedNameByIndex(i));
            }
            return names;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Advances the state machine instance by a given time.
     * @param time - the time to advance the animation by in seconds
     */
    StateMachine.prototype.advance = function (time) {
        this.instance.advance(time);
    };
    /**
     * Advances the state machine instance by a given time and apply changes to artboard.
     * @param time - the time to advance the animation by in seconds
     */
    StateMachine.prototype.advanceAndApply = function (time) {
        this.instance.advanceAndApply(time);
    };
    /**
     * Returns the number of events reported from the last advance call
     * @returns Number of events reported
     */
    StateMachine.prototype.reportedEventCount = function () {
        return this.instance.reportedEventCount();
    };
    /**
     * Returns a RiveEvent object emitted from the last advance call at the given index
     * of a list of potentially multiple events. If an event at the index is not found,
     * undefined is returned.
     * @param i index of the event reported in a list of potentially multiple events
     * @returns RiveEvent or extended RiveEvent object returned, or undefined
     */
    StateMachine.prototype.reportedEventAt = function (i) {
        return this.instance.reportedEventAt(i);
    };
    /**
     * Fetches references to the state machine's inputs and caches them
     * @param runtime an instance of the runtime; needed for the SMIInput types
     */
    StateMachine.prototype.initInputs = function (runtime) {
        // Fetch the inputs from the runtime if we don't have them
        for (var i = 0; i < this.instance.inputCount(); i++) {
            var input = this.instance.input(i);
            this.inputs.push(this.mapRuntimeInput(input, runtime));
        }
    };
    /**
     * Maps a runtime input to it's appropriate type
     * @param input
     */
    StateMachine.prototype.mapRuntimeInput = function (input, runtime) {
        if (input.type === runtime.SMIInput.bool) {
            return new StateMachineInput(StateMachineInputType.Boolean, input.asBool());
        }
        else if (input.type === runtime.SMIInput.number) {
            return new StateMachineInput(StateMachineInputType.Number, input.asNumber());
        }
        else if (input.type === runtime.SMIInput.trigger) {
            return new StateMachineInput(StateMachineInputType.Trigger, input.asTrigger());
        }
    };
    /**
     * Deletes the backing Wasm state machine instance; once this is called, this
     * state machine is no more.
     */
    StateMachine.prototype.cleanup = function () {
        this.inputs.forEach(function (input) {
            input.delete();
        });
        this.inputs.length = 0;
        this.instance.delete();
    };
    StateMachine.prototype.bindViewModelInstance = function (viewModelInstance) {
        if (viewModelInstance.runtimeInstance != null) {
            this.instance.bindViewModelInstance(viewModelInstance.runtimeInstance);
        }
    };
    return StateMachine;
}());
// #endregion
// #region animator
/**
 * Manages animation
 */
var Animator = /** @class */ (function () {
    /**
     * Constructs a new animator
     * @constructor
     * @param runtime Rive runtime; needed to instance animations & state machines
     * @param artboard the artboard that holds all animations and state machines
     * @param animations optional list of animations
     * @param stateMachines optional list of state machines
     */
    function Animator(runtime, artboard, eventManager, animations, stateMachines) {
        if (animations === void 0) { animations = []; }
        if (stateMachines === void 0) { stateMachines = []; }
        this.runtime = runtime;
        this.artboard = artboard;
        this.eventManager = eventManager;
        this.animations = animations;
        this.stateMachines = stateMachines;
    }
    /**
     * Adds animations and state machines by their names. If names are shared
     * between animations & state machines, then the first one found will be
     * created. Best not to use the same names for these in your Rive file.
     * @param animatable the name(s) of animations and state machines to add
     * @returns a list of names of the playing animations and state machines
     */
    Animator.prototype.add = function (animatables, playing, fireEvent) {
        if (fireEvent === void 0) { fireEvent = true; }
        animatables = mapToStringArray(animatables);
        // If animatables is empty, play or pause everything
        if (animatables.length === 0) {
            this.animations.forEach(function (a) { return (a.playing = playing); });
            this.stateMachines.forEach(function (m) { return (m.playing = playing); });
        }
        else {
            // Play/pause already instanced items, or create new instances
            var instancedAnimationNames = this.animations.map(function (a) { return a.name; });
            var instancedMachineNames = this.stateMachines.map(function (m) { return m.name; });
            for (var i = 0; i < animatables.length; i++) {
                var aIndex = instancedAnimationNames.indexOf(animatables[i]);
                var mIndex = instancedMachineNames.indexOf(animatables[i]);
                if (aIndex >= 0 || mIndex >= 0) {
                    if (aIndex >= 0) {
                        // Animation is instanced, play/pause it
                        this.animations[aIndex].playing = playing;
                    }
                    else {
                        // State machine is instanced, play/pause it
                        this.stateMachines[mIndex].playing = playing;
                    }
                }
                else {
                    // Try to create a new animation instance
                    var anim = this.artboard.animationByName(animatables[i]);
                    if (anim) {
                        var newAnimation = new _animation__WEBPACK_IMPORTED_MODULE_0__.Animation(anim, this.artboard, this.runtime, playing);
                        // Display the first frame of the specified animation
                        newAnimation.advance(0);
                        newAnimation.apply(1.0);
                        this.animations.push(newAnimation);
                    }
                    else {
                        // Try to create a new state machine instance
                        var sm = this.artboard.stateMachineByName(animatables[i]);
                        if (sm) {
                            var newStateMachine = new StateMachine(sm, this.runtime, playing, this.artboard);
                            this.stateMachines.push(newStateMachine);
                        }
                    }
                }
            }
        }
        // Fire play/paused events for animations
        if (fireEvent) {
            if (playing) {
                this.eventManager.fire({
                    type: EventType.Play,
                    data: this.playing,
                });
            }
            else {
                this.eventManager.fire({
                    type: EventType.Pause,
                    data: this.paused,
                });
            }
        }
        return playing ? this.playing : this.paused;
    };
    /**
     * Adds linear animations by their names.
     * @param animatables the name(s) of animations to add
     * @param playing whether animations should play on instantiation
     */
    Animator.prototype.initLinearAnimations = function (animatables, playing, isFallingBackFromStateMachines) {
        if (isFallingBackFromStateMachines === void 0) { isFallingBackFromStateMachines = false; }
        // Play/pause already instanced items, or create new instances
        // This validation is kept to maintain compatibility with current behavior.
        // But given that it this is called during artboard initialization
        // it should probably be safe to remove.
        var instancedAnimationNames = this.animations.map(function (a) { return a.name; });
        for (var i = 0; i < animatables.length; i++) {
            var aIndex = instancedAnimationNames.indexOf(animatables[i]);
            if (aIndex >= 0) {
                this.animations[aIndex].playing = playing;
            }
            else {
                // Try to create a new animation instance
                var anim = this.artboard.animationByName(animatables[i]);
                if (anim) {
                    var newAnimation = new _animation__WEBPACK_IMPORTED_MODULE_0__.Animation(anim, this.artboard, this.runtime, playing);
                    // Display the first frame of the specified animation
                    newAnimation.advance(0);
                    newAnimation.apply(1.0);
                    this.animations.push(newAnimation);
                }
                else if (isFallingBackFromStateMachines) { // Throw LoadError if we cannot load the state machine name at all
                    var smInitializationMessage = "State Machine with name ".concat(animatables[i], " not found");
                    throw new RiveError(smInitializationMessage);
                }
                else {
                    console.error("Animation with name ".concat(animatables[i], " not found."));
                }
            }
        }
    };
    /**
     * Adds state machines by their names.
     * @param animatables the name(s) of state machines to add
     * @param playing whether state machines should play on instantiation
     */
    Animator.prototype.initStateMachines = function (animatables, playing) {
        // Play/pause already instanced items, or create new instances
        // This validation is kept to maintain compatibility with current behavior.
        // But given that it this is called during artboard initialization
        // it should probably be safe to remove.
        var instancedStateMachineNames = this.stateMachines.map(function (a) { return a.name; });
        for (var i = 0; i < animatables.length; i++) {
            var aIndex = instancedStateMachineNames.indexOf(animatables[i]);
            if (aIndex >= 0) {
                this.stateMachines[aIndex].playing = playing;
            }
            else {
                // Try to create a new state machine instance
                var sm = this.artboard.stateMachineByName(animatables[i]);
                if (sm) {
                    var newStateMachine = new StateMachine(sm, this.runtime, playing, this.artboard);
                    this.stateMachines.push(newStateMachine);
                }
                else {
                    console.warn("State Machine with name ".concat(animatables[i], " not found. Falling back to find an animation with the same name."));
                    // TODO: Remove this fallback in next major release as it complicates initialization.
                    // In order to maintain compatibility with current behavior, if a state machine is not found
                    // we look for an animation with the same name
                    this.initLinearAnimations([animatables[i]], playing, true);
                }
            }
        }
    };
    /**
     * Play the named animations/state machines
     * @param animatables the names of the animations/machines to play; plays all if empty
     * @returns a list of the playing items
     */
    Animator.prototype.play = function (animatables) {
        return this.add(animatables, true);
    };
    /**
     * Advance state machines if they are paused after initialization
     */
    Animator.prototype.advanceIfPaused = function () {
        this.stateMachines.forEach(function (sm) {
            if (!sm.playing) {
                sm.advanceAndApply(0);
            }
        });
    };
    /**
     * Pauses named animations and state machines, or everything if nothing is
     * specified
     * @param animatables names of the animations and state machines to pause
     * @returns a list of names of the animations and state machines paused
     */
    Animator.prototype.pause = function (animatables) {
        return this.add(animatables, false);
    };
    /**
     * Set time of named animations
     * @param animations names of the animations to scrub
     * @param value time scrub value, a floating point number to which the playhead is jumped
     * @returns a list of names of the animations that were scrubbed
     */
    Animator.prototype.scrub = function (animatables, value) {
        var forScrubbing = this.animations.filter(function (a) {
            return animatables.includes(a.name);
        });
        forScrubbing.forEach(function (a) { return (a.scrubTo = value); });
        return forScrubbing.map(function (a) { return a.name; });
    };
    Object.defineProperty(Animator.prototype, "playing", {
        /**
         * Returns a list of names of all animations and state machines currently
         * playing
         */
        get: function () {
            return this.animations
                .filter(function (a) { return a.playing; })
                .map(function (a) { return a.name; })
                .concat(this.stateMachines.filter(function (m) { return m.playing; }).map(function (m) { return m.name; }));
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Animator.prototype, "paused", {
        /**
         * Returns a list of names of all animations and state machines currently
         * paused
         */
        get: function () {
            return this.animations
                .filter(function (a) { return !a.playing; })
                .map(function (a) { return a.name; })
                .concat(this.stateMachines.filter(function (m) { return !m.playing; }).map(function (m) { return m.name; }));
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Stops and removes all named animations and state machines
     * @param animatables animations and state machines to remove
     * @returns a list of names of removed items
     */
    Animator.prototype.stop = function (animatables) {
        var _this = this;
        animatables = mapToStringArray(animatables);
        // If nothing's specified, wipe them out, all of them
        var removedNames = [];
        // Stop everything
        if (animatables.length === 0) {
            removedNames = this.animations
                .map(function (a) { return a.name; })
                .concat(this.stateMachines.map(function (m) { return m.name; }));
            // Clean up before emptying the arrays
            this.animations.forEach(function (a) { return a.cleanup(); });
            this.stateMachines.forEach(function (m) { return m.cleanup(); });
            // Empty out the arrays
            this.animations.splice(0, this.animations.length);
            this.stateMachines.splice(0, this.stateMachines.length);
        }
        else {
            // Remove only the named animations/state machines
            var animationsToRemove = this.animations.filter(function (a) {
                return animatables.includes(a.name);
            });
            animationsToRemove.forEach(function (a) {
                a.cleanup();
                _this.animations.splice(_this.animations.indexOf(a), 1);
            });
            var machinesToRemove = this.stateMachines.filter(function (m) {
                return animatables.includes(m.name);
            });
            machinesToRemove.forEach(function (m) {
                m.cleanup();
                _this.stateMachines.splice(_this.stateMachines.indexOf(m), 1);
            });
            removedNames = animationsToRemove
                .map(function (a) { return a.name; })
                .concat(machinesToRemove.map(function (m) { return m.name; }));
        }
        this.eventManager.fire({
            type: EventType.Stop,
            data: removedNames,
        });
        // Return the list of animations removed
        return removedNames;
    };
    Object.defineProperty(Animator.prototype, "isPlaying", {
        /**
         * Returns true if at least one animation is active
         */
        get: function () {
            return (this.animations.reduce(function (acc, curr) { return acc || curr.playing; }, false) ||
                this.stateMachines.reduce(function (acc, curr) { return acc || curr.playing; }, false));
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Animator.prototype, "isPaused", {
        /**
         * Returns true if all animations are paused and there's at least one animation
         */
        get: function () {
            return (!this.isPlaying &&
                (this.animations.length > 0 || this.stateMachines.length > 0));
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Animator.prototype, "isStopped", {
        /**
         * Returns true if there are no playing or paused animations/state machines
         */
        get: function () {
            return this.animations.length === 0 && this.stateMachines.length === 0;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * If there are no animations or state machines, add the first one found
     * @returns the name of the animation or state machine instanced
     */
    Animator.prototype.atLeastOne = function (playing, fireEvent) {
        if (fireEvent === void 0) { fireEvent = true; }
        var instancedName;
        if (this.animations.length === 0 && this.stateMachines.length === 0) {
            if (this.artboard.animationCount() > 0) {
                // Add the first animation
                this.add([(instancedName = this.artboard.animationByIndex(0).name)], playing, fireEvent);
            }
            else if (this.artboard.stateMachineCount() > 0) {
                // Add the first state machine
                this.add([(instancedName = this.artboard.stateMachineByIndex(0).name)], playing, fireEvent);
            }
        }
        return instancedName;
    };
    /**
     * Checks if any animations have looped and if so, fire the appropriate event
     */
    Animator.prototype.handleLooping = function () {
        for (var _i = 0, _a = this.animations.filter(function (a) { return a.playing; }); _i < _a.length; _i++) {
            var animation = _a[_i];
            // Emit if the animation looped
            if (animation.loopValue === 0 && animation.loopCount) {
                animation.loopCount = 0;
                // This is a one-shot; if it has ended, delete the instance
                this.stop(animation.name);
            }
            else if (animation.loopValue === 1 && animation.loopCount) {
                this.eventManager.fire({
                    type: EventType.Loop,
                    data: { animation: animation.name, type: LoopType.Loop },
                });
                animation.loopCount = 0;
            }
            // Wasm indicates a loop at each time the animation
            // changes direction, so a full loop/lap occurs every
            // two loop counts
            else if (animation.loopValue === 2 && animation.loopCount > 1) {
                this.eventManager.fire({
                    type: EventType.Loop,
                    data: { animation: animation.name, type: LoopType.PingPong },
                });
                animation.loopCount = 0;
            }
        }
    };
    /**
     * Checks if states have changed in state machines and fires a statechange
     * event
     */
    Animator.prototype.handleStateChanges = function () {
        var statesChanged = [];
        for (var _i = 0, _a = this.stateMachines.filter(function (sm) { return sm.playing; }); _i < _a.length; _i++) {
            var stateMachine = _a[_i];
            statesChanged.push.apply(statesChanged, stateMachine.statesChanged);
        }
        if (statesChanged.length > 0) {
            this.eventManager.fire({
                type: EventType.StateChange,
                data: statesChanged,
            });
        }
    };
    Animator.prototype.handleAdvancing = function (time) {
        this.eventManager.fire({
            type: EventType.Advance,
            data: time,
        });
    };
    return Animator;
}());
// #endregion
// #region events
/**
 * Supported event types triggered in Rive
 */
var EventType;
(function (EventType) {
    EventType["Load"] = "load";
    EventType["LoadError"] = "loaderror";
    EventType["Play"] = "play";
    EventType["Pause"] = "pause";
    EventType["Stop"] = "stop";
    EventType["Loop"] = "loop";
    EventType["Draw"] = "draw";
    EventType["Advance"] = "advance";
    EventType["StateChange"] = "statechange";
    EventType["RiveEvent"] = "riveevent";
    EventType["AudioStatusChange"] = "audiostatuschange";
})(EventType || (EventType = {}));
/**
 * Looping types: one-shot, loop, and ping-pong
 */
var LoopType;
(function (LoopType) {
    LoopType["OneShot"] = "oneshot";
    LoopType["Loop"] = "loop";
    LoopType["PingPong"] = "pingpong";
})(LoopType || (LoopType = {}));
// Manages Rive events and listeners
var EventManager = /** @class */ (function () {
    function EventManager(listeners) {
        if (listeners === void 0) { listeners = []; }
        this.listeners = listeners;
    }
    // Gets listeners of specified type
    EventManager.prototype.getListeners = function (type) {
        return this.listeners.filter(function (e) { return e.type === type; });
    };
    // Adds a listener
    EventManager.prototype.add = function (listener) {
        if (!this.listeners.includes(listener)) {
            this.listeners.push(listener);
        }
    };
    /**
     * Removes a listener
     * @param listener the listener with the callback to be removed
     */
    EventManager.prototype.remove = function (listener) {
        // We can't simply look for the listener as it'll be a different instance to
        // one originally subscribed. Find all the listeners of the right type and
        // then check their callbacks which should match.
        for (var i = 0; i < this.listeners.length; i++) {
            var currentListener = this.listeners[i];
            if (currentListener.type === listener.type) {
                if (currentListener.callback === listener.callback) {
                    this.listeners.splice(i, 1);
                    break;
                }
            }
        }
    };
    /**
     * Clears all listeners of specified type, or every listener if no type is
     * specified
     * @param type the type of listeners to clear, or all listeners if not
     * specified
     */
    EventManager.prototype.removeAll = function (type) {
        var _this = this;
        if (!type) {
            this.listeners.splice(0, this.listeners.length);
        }
        else {
            this.listeners
                .filter(function (l) { return l.type === type; })
                .forEach(function (l) { return _this.remove(l); });
        }
    };
    // Fires an event
    EventManager.prototype.fire = function (event) {
        var eventListeners = this.getListeners(event.type);
        eventListeners.forEach(function (listener) { return listener.callback(event); });
    };
    return EventManager;
}());
// Manages a queue of tasks
var TaskQueueManager = /** @class */ (function () {
    function TaskQueueManager(eventManager) {
        this.eventManager = eventManager;
        this.queue = [];
    }
    // Adds a task top the queue
    TaskQueueManager.prototype.add = function (task) {
        this.queue.push(task);
    };
    // Processes all tasks in the queue
    TaskQueueManager.prototype.process = function () {
        while (this.queue.length > 0) {
            var task = this.queue.shift();
            if (task === null || task === void 0 ? void 0 : task.action) {
                task.action();
            }
            if (task === null || task === void 0 ? void 0 : task.event) {
                this.eventManager.fire(task.event);
            }
        }
    };
    return TaskQueueManager;
}());
// #endregion
// #region Audio
var SystemAudioStatus;
(function (SystemAudioStatus) {
    SystemAudioStatus[SystemAudioStatus["AVAILABLE"] = 0] = "AVAILABLE";
    SystemAudioStatus[SystemAudioStatus["UNAVAILABLE"] = 1] = "UNAVAILABLE";
})(SystemAudioStatus || (SystemAudioStatus = {}));
// Class to handle audio context availability and status changes
var AudioManager = /** @class */ (function (_super) {
    __extends(AudioManager, _super);
    function AudioManager() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._started = false;
        _this._enabled = false;
        _this._status = SystemAudioStatus.UNAVAILABLE;
        return _this;
    }
    AudioManager.prototype.delay = function (time) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) { return setTimeout(resolve, time); })];
            });
        });
    };
    AudioManager.prototype.timeout = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (_, reject) { return setTimeout(reject, 50); })];
            });
        });
    };
    // Alerts animations on status changes and removes the listeners to avoid alerting twice.
    AudioManager.prototype.reportToListeners = function () {
        this.fire({ type: EventType.AudioStatusChange });
        this.removeAll();
    };
    /**
     * The audio context has been resolved.
     * Alert any listeners that we can now play audio.
     * Rive will now play audio at the configured volume.
     */
    AudioManager.prototype.enableAudio = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!this._enabled) {
                    this._enabled = true;
                    this._status = SystemAudioStatus.AVAILABLE;
                    this.reportToListeners();
                }
                return [2 /*return*/];
            });
        });
    };
    /**
     * Check if we are able to play audio.
     *
     * We currently check the audio context, when resume() returns before a timeout we know that the
     * audio context is running and we can enable audio.
     */
    AudioManager.prototype.testAudio = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(this._status === SystemAudioStatus.UNAVAILABLE &&
                            this._audioContext !== null)) return [3 /*break*/, 4];
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, Promise.race([this._audioContext.resume(), this.timeout()])];
                    case 2:
                        _b.sent();
                        this.enableAudio();
                        return [3 /*break*/, 4];
                    case 3:
                        _a = _b.sent();
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Establish audio for use with rive.
     * We both test if we can use audio intermittently and listen for user interaction.
     * The aim is to enable audio playback as soon as the browser allows this.
     */
    AudioManager.prototype._establishAudio = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this._started) return [3 /*break*/, 5];
                        this._started = true;
                        if (!(typeof window == "undefined")) return [3 /*break*/, 1];
                        this.enableAudio();
                        return [3 /*break*/, 5];
                    case 1:
                        this._audioContext = new AudioContext();
                        this.listenForUserAction();
                        _a.label = 2;
                    case 2:
                        if (!(this._status === SystemAudioStatus.UNAVAILABLE)) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.testAudio()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.delay(1000)];
                    case 4:
                        _a.sent();
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    AudioManager.prototype.listenForUserAction = function () {
        var _this = this;
        // NOTE: AudioContexts are ready immediately if requested in a ui callback
        // we *could* re request one in this listener.
        var _clickListener = function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // note this has "better" results than calling `await this.testAudio()`
                // as we force audio to be enabled in the current thread, rather than chancing
                // the thread to be passed over for some other async context
                this.enableAudio();
                return [2 /*return*/];
            });
        }); };
        // NOTE: we should test this on mobile/pads
        document.addEventListener("pointerdown", _clickListener, {
            once: true,
        });
    };
    /**
     * Establish the audio context for rive, this lets rive know that we can play audio.
     */
    AudioManager.prototype.establishAudio = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this._establishAudio();
                return [2 /*return*/];
            });
        });
    };
    Object.defineProperty(AudioManager.prototype, "systemVolume", {
        get: function () {
            if (this._status === SystemAudioStatus.UNAVAILABLE) {
                // We do an immediate test to avoid depending on the delay of the running test
                this.testAudio();
                return 0;
            }
            return 1;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AudioManager.prototype, "status", {
        get: function () {
            return this._status;
        },
        enumerable: false,
        configurable: true
    });
    return AudioManager;
}(EventManager));
var audioManager = new AudioManager();
var FakeResizeObserver = /** @class */ (function () {
    function FakeResizeObserver() {
    }
    FakeResizeObserver.prototype.observe = function () { };
    FakeResizeObserver.prototype.unobserve = function () { };
    FakeResizeObserver.prototype.disconnect = function () { };
    return FakeResizeObserver;
}());
var MyResizeObserver = globalThis.ResizeObserver || FakeResizeObserver;
/**
 * This class takes care of any observers that will be attached to an animation.
 * It should be treated as a singleton because observers are much more performant
 * when used for observing multiple elements by a single instance.
 */
var ObjectObservers = /** @class */ (function () {
    function ObjectObservers() {
        var _this = this;
        this._elementsMap = new Map();
        /**
         * Resize observers trigger both when the element changes its size and also when the
         * element is added or removed from the document.
         */
        this._onObservedEntry = function (entry) {
            var observed = _this._elementsMap.get(entry.target);
            if (observed !== null) {
                observed.onResize(entry.target.clientWidth == 0 || entry.target.clientHeight == 0);
            }
            else {
                _this._resizeObserver.unobserve(entry.target);
            }
        };
        this._onObserved = function (entries) {
            entries.forEach(_this._onObservedEntry);
        };
        this._resizeObserver = new MyResizeObserver(this._onObserved);
    }
    // Adds an observable element
    ObjectObservers.prototype.add = function (element, onResize) {
        var observed = {
            onResize: onResize,
            element: element,
        };
        this._elementsMap.set(element, observed);
        this._resizeObserver.observe(element);
        return observed;
    };
    // Removes an observable element
    ObjectObservers.prototype.remove = function (observed) {
        this._resizeObserver.unobserve(observed.element);
        this._elementsMap.delete(observed.element);
    };
    return ObjectObservers;
}());
var observers = new ObjectObservers();
var RiveFile = /** @class */ (function () {
    function RiveFile(params) {
        // Allow the runtime to automatically load assets hosted in Rive's runtime.
        this.enableRiveAssetCDN = true;
        // When true, emits performance.mark/measure entries during RiveFile load.
        this.enablePerfMarks = false;
        this.referenceCount = 0;
        this.destroyed = false;
        this.selfUnref = false;
        this.bindableArtboards = [];
        this.src = params.src;
        this.buffer = params.buffer;
        if (params.assetLoader)
            this.assetLoader = params.assetLoader;
        this.enableRiveAssetCDN =
            typeof params.enableRiveAssetCDN == "boolean"
                ? params.enableRiveAssetCDN
                : true;
        this.enablePerfMarks = !!params.enablePerfMarks;
        if (this.enablePerfMarks)
            _runtimeLoader__WEBPACK_IMPORTED_MODULE_1__.RuntimeLoader.enablePerfMarks = true;
        // New event management system
        this.eventManager = new EventManager();
        if (params.onLoad)
            this.on(EventType.Load, params.onLoad);
        if (params.onLoadError)
            this.on(EventType.LoadError, params.onLoadError);
    }
    RiveFile.prototype.releaseFile = function () {
        var _a;
        if (this.selfUnref) {
            (_a = this.file) === null || _a === void 0 ? void 0 : _a.unref();
        }
        this.file = null;
    };
    RiveFile.prototype.releaseBindableArtboards = function () {
        this.bindableArtboards.forEach(function (bindableArtboard) {
            return bindableArtboard.destroy();
        });
    };
    RiveFile.prototype.initData = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, error_1, loader, loaderWrapper, _b, fileFinalizer;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!(this.src && !this.buffer)) return [3 /*break*/, 4];
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 3, , 4]);
                        _a = this;
                        return [4 /*yield*/, loadRiveFile(this.src)];
                    case 2:
                        _a.buffer = _c.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _c.sent();
                        if (error_1 instanceof Error) {
                            throw error_1;
                        }
                        throw new RiveError(RiveFile.fileLoadErrorMessage);
                    case 4:
                        if (this.destroyed) {
                            return [2 /*return*/];
                        }
                        if (this.assetLoader) {
                            loaderWrapper = new _utils__WEBPACK_IMPORTED_MODULE_2__.CustomFileAssetLoaderWrapper(this.runtime, this.assetLoader);
                            loader = loaderWrapper.assetLoader;
                        }
                        // Load the Rive file
                        if (this.enablePerfMarks)
                            performance.mark('rive:file-load:start');
                        _b = this;
                        return [4 /*yield*/, this.runtime.load(new Uint8Array(this.buffer), loader, this.enableRiveAssetCDN)];
                    case 5:
                        _b.file = _c.sent();
                        if (this.enablePerfMarks) {
                            performance.mark('rive:file-load:end');
                            performance.measure('rive:file-load', 'rive:file-load:start', 'rive:file-load:end');
                        }
                        fileFinalizer = new _utils__WEBPACK_IMPORTED_MODULE_2__.FileFinalizer(this.file);
                        _utils__WEBPACK_IMPORTED_MODULE_2__.finalizationRegistry.register(this, fileFinalizer);
                        if (this.destroyed) {
                            this.releaseFile();
                            return [2 /*return*/];
                        }
                        if (this.file !== null) {
                            this.eventManager.fire({
                                type: EventType.Load,
                                data: this,
                            });
                        }
                        else {
                            this.fireLoadError(RiveFile.fileLoadErrorMessage);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    RiveFile.prototype.loadRiveFileBytes = function () {
        return __awaiter(this, void 0, void 0, function () {
            var bufferPromise;
            return __generator(this, function (_a) {
                if (this.enablePerfMarks)
                    performance.mark('rive:fetch-riv:start');
                bufferPromise = this.src
                    ? loadRiveFile(this.src)
                    : Promise.resolve(this.buffer);
                if (this.enablePerfMarks && this.src) {
                    bufferPromise.then(function () {
                        performance.mark('rive:fetch-riv:end');
                        performance.measure('rive:fetch-riv', 'rive:fetch-riv:start', 'rive:fetch-riv:end');
                    });
                }
                return [2 /*return*/, bufferPromise];
            });
        });
    };
    RiveFile.prototype.loadRuntime = function () {
        return __awaiter(this, void 0, void 0, function () {
            var runtimePromise;
            return __generator(this, function (_a) {
                if (this.enablePerfMarks)
                    performance.mark('rive:await-wasm:start');
                runtimePromise = _runtimeLoader__WEBPACK_IMPORTED_MODULE_1__.RuntimeLoader.awaitInstance();
                if (this.enablePerfMarks) {
                    runtimePromise.then(function () {
                        performance.mark('rive:await-wasm:end');
                        performance.measure('rive:await-wasm', 'rive:await-wasm:start', 'rive:await-wasm:end');
                    });
                }
                return [2 /*return*/, runtimePromise];
            });
        });
    };
    RiveFile.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, bufferResolved, runtimeResolved, error_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        // If no source file url specified, it's a bust
                        if (!this.src && !this.buffer) {
                            this.fireLoadError(RiveFile.missingErrorMessage);
                            return [2 /*return*/];
                        }
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, Promise.all([this.loadRiveFileBytes(), this.loadRuntime()])];
                    case 2:
                        _a = _b.sent(), bufferResolved = _a[0], runtimeResolved = _a[1];
                        if (this.destroyed) {
                            return [2 /*return*/];
                        }
                        // .riv file buffer and WASM runtime instance
                        this.buffer = bufferResolved;
                        this.runtime = runtimeResolved;
                        if (this.enablePerfMarks)
                            performance.mark('rive:init-data:start');
                        return [4 /*yield*/, this.initData()];
                    case 3:
                        _b.sent();
                        if (this.enablePerfMarks) {
                            performance.mark('rive:init-data:end');
                            performance.measure('rive:init-data', 'rive:init-data:start', 'rive:init-data:end');
                        }
                        return [3 /*break*/, 5];
                    case 4:
                        error_2 = _b.sent();
                        this.fireLoadError(error_2 instanceof Error ? error_2.message : RiveFile.fileLoadErrorMessage);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    RiveFile.prototype.fireLoadError = function (message) {
        this.eventManager.fire({
            type: EventType.LoadError,
            data: message,
        });
        throw new RiveError(message);
    };
    /**
     * Subscribe to Rive-generated events
     * @param type the type of event to subscribe to
     * @param callback callback to fire when the event occurs
     */
    RiveFile.prototype.on = function (type, callback) {
        this.eventManager.add({
            type: type,
            callback: callback,
        });
    };
    /**
     * Unsubscribes from a Rive-generated event
     * @param type the type of event to unsubscribe from
     * @param callback the callback to unsubscribe
     */
    RiveFile.prototype.off = function (type, callback) {
        this.eventManager.remove({
            type: type,
            callback: callback,
        });
    };
    RiveFile.prototype.cleanup = function () {
        this.referenceCount -= 1;
        if (this.referenceCount <= 0) {
            this.removeAllRiveEventListeners();
            this.releaseFile();
            this.releaseBindableArtboards();
            this.destroyed = true;
        }
    };
    /**
     * Unsubscribes all Rive listeners from an event type, or everything if no type is
     * given
     * @param type the type of event to unsubscribe from, or all types if
     * undefined
     */
    RiveFile.prototype.removeAllRiveEventListeners = function (type) {
        this.eventManager.removeAll(type);
    };
    RiveFile.prototype.getInstance = function () {
        if (this.file !== null) {
            this.referenceCount += 1;
            return this.file;
        }
    };
    RiveFile.prototype.destroyIfUnused = function () {
        if (this.referenceCount <= 0) {
            this.cleanup();
        }
    };
    RiveFile.prototype.createBindableArtboard = function (nativeBindableArtboard) {
        if (nativeBindableArtboard != null) {
            var bindableArtboard = new BindableArtboard(nativeBindableArtboard);
            (0,_utils__WEBPACK_IMPORTED_MODULE_2__.createFinalization)(bindableArtboard, bindableArtboard.nativeArtboard);
            this.bindableArtboards.push(bindableArtboard);
            return bindableArtboard;
        }
        return null;
    };
    /**
     * @deprecated This function is deprecated. For better stability and memory management
     * use `getBindableArtboard()` instead.
     * @param {string} name - The name of the artboard.
     * @returns {Artboard} The artboard to bind to.
     */
    RiveFile.prototype.getArtboard = function (name) {
        var nativeArtboard = this.file.artboardByName(name);
        if (nativeArtboard != null) {
            return new Artboard(nativeArtboard, this);
        }
    };
    RiveFile.prototype.getBindableArtboard = function (name) {
        var nativeArtboard = this.file.bindableArtboardByName(name);
        return this.createBindableArtboard(nativeArtboard);
    };
    RiveFile.prototype.getDefaultBindableArtboard = function () {
        var nativeArtboard = this.file.bindableArtboardDefault();
        return this.createBindableArtboard(nativeArtboard);
    };
    RiveFile.prototype.internalBindableArtboardFromArtboard = function (artboard) {
        var nativeBindableArtboard = this.file.internalBindableArtboardFromArtboard(artboard);
        return this.createBindableArtboard(nativeBindableArtboard);
    };
    RiveFile.prototype.viewModelByName = function (name) {
        var viewModel = this.file.viewModelByName(name);
        if (viewModel !== null) {
            return new ViewModel(viewModel);
        }
        return null;
    };
    // Error message for missing source or buffer
    RiveFile.missingErrorMessage = "Rive source file or data buffer required";
    // Error message for file load error
    RiveFile.fileLoadErrorMessage = "The file failed to load";
    return RiveFile;
}());

var Rive = /** @class */ (function () {
    function Rive(params) {
        var _this = this;
        var _a, _b;
        // Tracks if a Rive file is loaded
        this.loaded = false;
        // Tracks if a Rive file is destroyed
        this.destroyed = false;
        // Reference of an object that handles any observers for the animation
        this._observed = null;
        /**
         * Tracks if a Rive file is loaded; we need this in addition to loaded as some
         * commands (e.g. contents) can be called as soon as the file is loaded.
         * However, playback commands need to be queued and run in order once initial
         * animations and autoplay has been sorted out. This applies to play, pause,
         * and start.
         */
        this.readyForPlaying = false;
        // Runtime artboard
        this.artboard = null;
        // place to clear up pointer/touch event listeners
        this.eventCleanup = null;
        // place to clear up focus/keyboard event listeners
        this.keyboardEventCleanup = null;
        this.shouldDisableRiveListeners = false;
        this.automaticallyHandleEvents = false;
        this.dispatchPointerExit = true;
        // Allow all pointers to be passed to the runtime
        this.enableMultiTouch = false;
        // Allow the runtime to automatically load assets hosted in Rive's runtime.
        this.enableRiveAssetCDN = true;
        // Keep a local value of the set volume to update it asynchronously
        this._volume = 1;
        // Keep a local value of the set width to update it asynchronously
        this._artboardWidth = undefined;
        // Keep a local value of the set height to update it asynchronously
        this._artboardHeight = undefined;
        // Keep a local value of the device pixel ratio used in rendering and canvas/artboard resizing
        this._devicePixelRatioUsed = 1;
        // Whether the canvas element's size is 0
        this._hasZeroSize = false;
        // Whether a draw operation needs to be forced
        this._needsRedraw = false;
        // Canvas width and height. Values are lazily updated so they might
        // not be in sync with current canvas size.
        this._currentCanvasWidth = 0;
        this._currentCanvasHeight = 0;
        // Audio event listener
        this._audioEventListener = null;
        // draw method bound to the class
        this._boundDraw = null;
        // Page visibility handler — prevents state machine advancing / rAF from being invoked with large time delta
        // when the browser tab is switched back to after being hidden.
        this._pageVisibilityHandler = null;
        // True only when the page visibility handler itself cancelled an active frame.
        // Set by stopRendering(), cleared by startRendering(). Prevents the
        // visibilitychange handler from restarting a rendering loop the caller intentionally stopped.
        this._explicitlyStoppedRendering = false;
        this._viewModelInstance = null;
        this._dataEnums = null;
        this._tabIndex = null;
        this.drawOptimization = DrawOptimizationOptions.DrawOnChanged;
        // When true, emits performance.mark/measure entries for load and render.
        this.enablePerfMarks = false;
        // Durations to generate a frame for the last second. Used for performance profiling.
        this.durations = [];
        this.frameTimes = [];
        this.frameCount = 0;
        this.isTouchScrollEnabled = false;
        this.onCanvasResize = function (hasZeroSize) {
            var toggledDisplay = _this._hasZeroSize !== hasZeroSize;
            _this._hasZeroSize = hasZeroSize;
            if (!hasZeroSize) {
                if (toggledDisplay) {
                    _this.resizeDrawingSurfaceToCanvas();
                }
            }
            else if (!_this._layout.maxX || !_this._layout.maxY) {
                _this.resizeToCanvas();
            }
        };
        // Tracks the current animation frame request
        this.frameRequestId = null;
        /**
         * Used be draw to track when a second of active rendering time has passed.
         * Used for debugging purposes
         */
        this.renderSecondTimer = 0;
        this._boundDraw = this.draw.bind(this);
        if (typeof document !== 'undefined') {
            this._pageVisibilityHandler = this._onPageVisibilityChange.bind(this);
            document.addEventListener('visibilitychange', this._pageVisibilityHandler);
        }
        this.canvas = params.canvas;
        if (params.canvas.constructor === HTMLCanvasElement) {
            this._observed = observers.add(this.canvas, this.onCanvasResize);
        }
        this._currentCanvasWidth = this.canvas.width;
        this._currentCanvasHeight = this.canvas.height;
        this.src = params.src;
        this.buffer = params.buffer;
        this.riveFile = params.riveFile;
        this.layout = (_a = params.layout) !== null && _a !== void 0 ? _a : new Layout();
        this.shouldDisableRiveListeners = !!params.shouldDisableRiveListeners;
        this.isTouchScrollEnabled = !!params.isTouchScrollEnabled;
        this.automaticallyHandleEvents = !!params.automaticallyHandleEvents;
        this.dispatchPointerExit =
            params.dispatchPointerExit === false
                ? params.dispatchPointerExit
                : this.dispatchPointerExit;
        this.enableMultiTouch = !!params.enableMultiTouch;
        this.drawOptimization = (_b = params.drawingOptions) !== null && _b !== void 0 ? _b : this.drawOptimization;
        this.enableRiveAssetCDN =
            params.enableRiveAssetCDN === undefined
                ? true
                : params.enableRiveAssetCDN;
        this.enablePerfMarks = !!params.enablePerfMarks;
        if (this.enablePerfMarks)
            _runtimeLoader__WEBPACK_IMPORTED_MODULE_1__.RuntimeLoader.enablePerfMarks = true;
        // New event management system
        this.eventManager = new EventManager();
        if (params.onLoad)
            this.on(EventType.Load, params.onLoad);
        if (params.onLoadError)
            this.on(EventType.LoadError, params.onLoadError);
        if (params.onPlay)
            this.on(EventType.Play, params.onPlay);
        if (params.onPause)
            this.on(EventType.Pause, params.onPause);
        if (params.onStop)
            this.on(EventType.Stop, params.onStop);
        if (params.onLoop)
            this.on(EventType.Loop, params.onLoop);
        if (params.onStateChange)
            this.on(EventType.StateChange, params.onStateChange);
        if (params.onAdvance)
            this.on(EventType.Advance, params.onAdvance);
        /**
         * @deprecated Use camelCase'd versions instead.
         */
        if (params.onload && !params.onLoad)
            this.on(EventType.Load, params.onload);
        if (params.onloaderror && !params.onLoadError)
            this.on(EventType.LoadError, params.onloaderror);
        if (params.onplay && !params.onPlay)
            this.on(EventType.Play, params.onplay);
        if (params.onpause && !params.onPause)
            this.on(EventType.Pause, params.onpause);
        if (params.onstop && !params.onStop)
            this.on(EventType.Stop, params.onstop);
        if (params.onloop && !params.onLoop)
            this.on(EventType.Loop, params.onloop);
        if (params.onstatechange && !params.onStateChange)
            this.on(EventType.StateChange, params.onstatechange);
        /**
         * Asset loading
         */
        if (params.assetLoader)
            this.assetLoader = params.assetLoader;
        // Hook up the task queue
        this.taskQueue = new TaskQueueManager(this.eventManager);
        this.init({
            src: this.src,
            buffer: this.buffer,
            riveFile: this.riveFile,
            autoplay: params.autoplay,
            autoBind: params.autoBind,
            animations: params.animations,
            stateMachines: params.stateMachines,
            artboard: params.artboard,
            useOffscreenRenderer: params.useOffscreenRenderer,
            tabIndex: params.tabIndex,
        });
    }
    Object.defineProperty(Rive.prototype, "viewModelCount", {
        get: function () {
            return this.file.viewModelCount();
        },
        enumerable: false,
        configurable: true
    });
    // Alternative constructor to build a Rive instance from an interface/object
    Rive.new = function (params) {
        console.warn("This function is deprecated: please use `new Rive({})` instead");
        return new Rive(params);
    };
    // Event handler for when audio context becomes available
    Rive.prototype.onSystemAudioChanged = function () {
        this.volume = this._volume;
    };
    // Initializes the Rive object either from constructor or load()
    Rive.prototype.init = function (_a) {
        var _this = this;
        var src = _a.src, buffer = _a.buffer, riveFile = _a.riveFile, animations = _a.animations, stateMachines = _a.stateMachines, artboard = _a.artboard, _b = _a.autoplay, autoplay = _b === void 0 ? false : _b, _c = _a.useOffscreenRenderer, useOffscreenRenderer = _c === void 0 ? false : _c, _d = _a.autoBind, autoBind = _d === void 0 ? false : _d, tabIndex = _a.tabIndex;
        if (this.destroyed) {
            return;
        }
        this.src = src;
        this.buffer = buffer;
        this.riveFile = riveFile;
        this._tabIndex = tabIndex !== null && tabIndex !== void 0 ? tabIndex : null;
        // If no source file url specified, it's a bust
        if (!this.src && !this.buffer && !this.riveFile) {
            throw new RiveError(Rive.missingErrorMessage);
        }
        // List of animations that should be initialized.
        var startingAnimationNames = mapToStringArray(animations);
        // List of state machines that should be initialized
        var startingStateMachineNames = mapToStringArray(stateMachines);
        // Ensure loaded is marked as false if loading new file
        this.loaded = false;
        this.readyForPlaying = false;
        // Ensure the runtime is loaded
        _runtimeLoader__WEBPACK_IMPORTED_MODULE_1__.RuntimeLoader.awaitInstance()
            .then(function (runtime) {
            if (_this.destroyed) {
                return;
            }
            _this.runtime = runtime;
            _this.removeRiveListeners();
            _this.deleteRiveRenderer();
            // Get the canvas where you want to render the animation and create a renderer
            if (_this.enablePerfMarks)
                performance.mark('rive:make-renderer:start');
            try {
                _this.renderer = _this.runtime.makeRenderer(_this.canvas, useOffscreenRenderer);
                if (!_this.renderer) {
                    throw new Error("Renderer is null, cannot render Rive on the canvas.");
                }
            }
            catch (e) {
                console.error(e);
                throw new RiveError("Unable to create the renderer, your environment may not support WebGL. Try the @rive-app/canvas runtime as an alternative.");
            }
            if (_this.enablePerfMarks) {
                performance.mark('rive:make-renderer:end');
                performance.measure('rive:make-renderer', 'rive:make-renderer:start', 'rive:make-renderer:end');
            }
            // Initial size adjustment based on devicePixelRatio if no width/height are
            // specified explicitly
            if (!(_this.canvas.width || _this.canvas.height)) {
                _this.resizeDrawingSurfaceToCanvas();
            }
            // Load Rive data from a source uri or a data buffer
            _this.initData(artboard, startingAnimationNames, startingStateMachineNames, autoplay, autoBind)
                .then(function (hasInitialized) {
                if (hasInitialized) {
                    return _this.setupRiveListeners();
                }
            })
                .catch(function (e) {
                // initData already catches RiveErrors for load issues like artboard/state machine initialization
                // failures, so just console error and catch here so we don't double-fire the LoadError event
                console.error(e);
            });
        })
            .catch(function (e) {
            _this.eventManager.fire({ type: EventType.LoadError, data: e.message });
        });
    };
    /**
     * Setup Rive Listeners on the canvas
     * @param riveListenerOptions - Enables TouchEvent events on the canvas. Set to true to allow
     * touch scrolling on the canvas element on touch-enabled devices
     * i.e. { isTouchScrollEnabled: true }
     */
    Rive.prototype.setupRiveListeners = function (riveListenerOptions) {
        var _this = this;
        if (this.eventCleanup) {
            this.eventCleanup();
        }
        if (this.keyboardEventCleanup) {
            this.keyboardEventCleanup();
            this.keyboardEventCleanup = null;
        }
        if (!this.shouldDisableRiveListeners) {
            var playingStateMachines = this.animator.stateMachines.filter(function (sm) { return sm.playing; });
            var activeStateMachines = playingStateMachines
                .filter(function (sm) { return _this.runtime.hasListeners(sm.instance); })
                .map(function (sm) { return sm.instance; });
            var touchScrollEnabledOption = this.isTouchScrollEnabled;
            var dispatchPointerExit = this.dispatchPointerExit;
            var enableMultiTouch = this.enableMultiTouch;
            if (riveListenerOptions &&
                "isTouchScrollEnabled" in riveListenerOptions) {
                touchScrollEnabledOption = riveListenerOptions.isTouchScrollEnabled;
            }
            this.eventCleanup = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.registerTouchInteractions)({
                canvas: this.canvas,
                artboard: this.artboard,
                stateMachines: activeStateMachines,
                renderer: this.renderer,
                rive: this.runtime,
                fit: this._layout.runtimeFit(this.runtime),
                alignment: this._layout.runtimeAlignment(this.runtime),
                isTouchScrollEnabled: touchScrollEnabledOption,
                dispatchPointerExit: dispatchPointerExit,
                enableMultiTouch: enableMultiTouch,
                layoutScaleFactor: this._layout.layoutScaleFactor,
            });
            // Wire up keyboard interactions for state machines that have focus nodes.
            //   hasFocusNodes — unified focus tree check, gates tab traversal
            var smWithFocusNodes = playingStateMachines
                .filter(function (sm) { return sm.instance.hasFocusNodes(); })
                .map(function (sm) { return sm.instance; });
            if (smWithFocusNodes.length) {
                // Set the canvas as a tabbable element if there are any focus nodes.
                // Prefer the tabIndex param set by the user, otherwise use 0.
                // But do not override any explicit tabIndex already set on the canvas, if any.
                var currentCanvasTabIndex = this.canvas.tabIndex;
                // By default, canvas elements have a tabIndex of -1
                if (currentCanvasTabIndex === -1 || isNaN(currentCanvasTabIndex)) {
                    this.canvas.tabIndex = (this._tabIndex !== null ? this._tabIndex : 0);
                }
                this.keyboardEventCleanup = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.registerKeyboardInteractions)({
                    canvas: this.canvas,
                    stateMachine: smWithFocusNodes[0], // work off assumption of single state machine
                    rive: this.runtime,
                    hasFocusNodes: smWithFocusNodes.length > 0,
                });
            }
        }
    };
    /**
     * Remove Rive Listeners setup on the canvas
     */
    Rive.prototype.removeRiveListeners = function () {
        if (this.eventCleanup) {
            this.eventCleanup();
            this.eventCleanup = null;
        }
        if (this.keyboardEventCleanup) {
            this.keyboardEventCleanup();
            this.keyboardEventCleanup = null;
        }
    };
    /**
     * If the instance has audio and the system audio is not ready
     * we hook the instance to the audio manager
     */
    Rive.prototype.initializeAudio = function () {
        var _this = this;
        var _a;
        // Initialize audio if needed
        if (audioManager.status == SystemAudioStatus.UNAVAILABLE) {
            if (this.file.hasAudio ||
                (((_a = this.artboard) === null || _a === void 0 ? void 0 : _a.hasAudio) && this._audioEventListener === null)) {
                this._audioEventListener = {
                    type: EventType.AudioStatusChange,
                    callback: function () { return _this.onSystemAudioChanged(); },
                };
                audioManager.add(this._audioEventListener);
                audioManager.establishAudio();
            }
        }
    };
    Rive.prototype.initArtboardSize = function () {
        if (!this.artboard)
            return;
        // Use preset values if they are not undefined
        this._artboardWidth = this.artboard.width =
            this._artboardWidth || this.artboard.width;
        this._artboardHeight = this.artboard.height =
            this._artboardHeight || this.artboard.height;
    };
    // Initializes runtime with Rive data and preps for playing.
    // Returns true for successful initialization.
    Rive.prototype.initData = function (artboardName, animationNames, stateMachineNames, autoplay, autoBind) {
        return __awaiter(this, void 0, void 0, function () {
            var riveFile, error_3, msg;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        if (!(this.riveFile == null)) return [3 /*break*/, 2];
                        riveFile = new RiveFile({
                            src: this.src,
                            buffer: this.buffer,
                            enableRiveAssetCDN: this.enableRiveAssetCDN,
                            assetLoader: this.assetLoader,
                            enablePerfMarks: this.enablePerfMarks,
                        });
                        this.riveFile = riveFile;
                        return [4 /*yield*/, riveFile.init()];
                    case 1:
                        _b.sent();
                        if (this.destroyed) {
                            // In the very unlikely scenario where the rive file created by this Rive is shared by
                            // another rive file, we only want to destroy it if this file is the only owner.
                            riveFile.destroyIfUnused();
                            return [2 /*return*/, false];
                        }
                        _b.label = 2;
                    case 2:
                        this.file = this.riveFile.getInstance();
                        // Initialize and draw frame
                        this.initArtboard(artboardName, animationNames, stateMachineNames, autoplay, autoBind);
                        // Initialize the artboard size
                        this.initArtboardSize();
                        // Check for audio
                        this.initializeAudio();
                        // Everything's set up, emit a load event
                        try {
                            this.loaded = true;
                            this.eventManager.fire({
                                type: EventType.Load,
                                data: (_a = this.src) !== null && _a !== void 0 ? _a : "buffer",
                            });
                        }
                        catch (e) {
                            // If any synchronous errors surface from the user-supplied onLoad callback,
                            // this will console.error the error but will not invoke LoadError (onLoadError).
                            // Notably, this will not interfere with Rive rendering
                            console.error(e);
                        }
                        // Only initialize paused state machines after the load event has been fired
                        // to allow users to initialize inputs and view models before the first advance
                        this.animator.advanceIfPaused();
                        // Flag ready for playback commands and clear the task queue; this order
                        // is important or it may infinitely recurse
                        this.readyForPlaying = true;
                        this.taskQueue.process();
                        this.drawFrame();
                        return [2 /*return*/, true];
                    case 3:
                        error_3 = _b.sent();
                        msg = resolveErrorMessage(error_3);
                        this.eventManager.fire({ type: EventType.LoadError, data: msg });
                        return [2 /*return*/, Promise.reject(msg)];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // Initialize for playback
    Rive.prototype.initArtboard = function (artboardName, animationNames, stateMachineNames, autoplay, autoBind) {
        if (!this.file) {
            return;
        }
        // Fetch the artboard
        var rootArtboard = artboardName
            ? this.file.artboardByName(artboardName)
            : this.file.defaultArtboard();
        // Check we have a working artboard
        if (!rootArtboard) {
            throw new RiveError("Invalid artboard name or no default artboard");
        }
        this.artboard = rootArtboard;
        rootArtboard.volume = this._volume * audioManager.systemVolume;
        // Initialize the animator
        this.animator = new Animator(this.runtime, this.artboard, this.eventManager);
        // Initialize the animations; as loaded hasn't happened yet, we need to
        // suppress firing the play/pause events until the load event has fired. To
        // do this we tell the animator to suppress firing events, and add event
        // firing to the task queue.
        var instanceNames;
        if (animationNames.length > 0 || stateMachineNames.length > 0) {
            instanceNames = animationNames.concat(stateMachineNames);
            this.animator.initLinearAnimations(animationNames, autoplay);
            this.animator.initStateMachines(stateMachineNames, autoplay);
        }
        else {
            instanceNames = [this.animator.atLeastOne(autoplay, false)];
        }
        // Queue up firing the playback events
        this.taskQueue.add({
            event: {
                type: autoplay ? EventType.Play : EventType.Pause,
                data: instanceNames,
            },
        });
        if (autoBind) {
            var viewModel = this.file.defaultArtboardViewModel(rootArtboard);
            if (viewModel !== null) {
                var runtimeInstance = viewModel.defaultInstance();
                if (runtimeInstance !== null) {
                    var viewModelInstance = new ViewModelInstance(runtimeInstance, null);
                    (0,_utils__WEBPACK_IMPORTED_MODULE_2__.createFinalization)(viewModelInstance, viewModelInstance.runtimeInstance);
                    this.bindViewModelInstance(viewModelInstance);
                }
            }
        }
    };
    // Draws the current artboard frame
    Rive.prototype.drawFrame = function () {
        var _a, _b;
        if ((_a = document === null || document === void 0 ? void 0 : document.timeline) === null || _a === void 0 ? void 0 : _a.currentTime) {
            if (this.loaded && this.artboard && !this.frameRequestId) {
                this._boundDraw(document.timeline.currentTime);
                (_b = this.runtime) === null || _b === void 0 ? void 0 : _b.resolveAnimationFrame();
            }
        }
        else {
            this.scheduleRendering();
        }
    };
    Rive.prototype._canvasSizeChanged = function () {
        var changed = false;
        if (this.canvas) {
            if (this.canvas.width !== this._currentCanvasWidth) {
                this._currentCanvasWidth = this.canvas.width;
                changed = true;
            }
            if (this.canvas.height !== this._currentCanvasHeight) {
                this._currentCanvasHeight = this.canvas.height;
                changed = true;
            }
        }
        return changed;
    };
    /**
     * Draw rendering loop; renders animation frames at the correct time interval.
     * @param time the time at which to render a frame
     */
    Rive.prototype.draw = function (time, onSecond) {
        var _a;
        // Clear the frameRequestId, as we're now rendering a fresh frame
        this.frameRequestId = null;
        var before = performance.now();
        // On the first pass, make sure lastTime has a valid value
        if (!this.lastRenderTime) {
            this.lastRenderTime = time;
        }
        // Handle the onSecond callback
        this.renderSecondTimer += time - this.lastRenderTime;
        if (this.renderSecondTimer > 5000) {
            this.renderSecondTimer = 0;
            onSecond === null || onSecond === void 0 ? void 0 : onSecond();
        }
        // Calculate the elapsed time between frames in seconds
        var elapsedTime = (time - this.lastRenderTime) / 1000;
        this.lastRenderTime = time;
        // - Advance non-paused animations by the elapsed number of seconds
        // - Advance any animations that require scrubbing
        // - Advance to the first frame even when autoplay is false
        var activeAnimations = this.animator.animations
            .filter(function (a) { return a.playing || a.needsScrub; })
            // The scrubbed animations must be applied first to prevent weird artifacts
            // if the playing animations conflict with the scrubbed animating attribuates.
            .sort(function (first) { return (first.needsScrub ? -1 : 1); });
        for (var _i = 0, activeAnimations_1 = activeAnimations; _i < activeAnimations_1.length; _i++) {
            var animation = activeAnimations_1[_i];
            animation.advance(elapsedTime);
            if (animation.instance.didLoop) {
                animation.loopCount += 1;
            }
            animation.apply(1.0);
        }
        // - Advance non-paused state machines by the elapsed number of seconds
        // - Advance to the first frame even when autoplay is false
        var activeStateMachines = this.animator.stateMachines.filter(function (a) { return a.playing; });
        // Instrument the first 3 frames so the Performance timeline shows precise
        // per-call latency for advance, draw, and flush without polluting the trace.
        var _perfFrame = this.enablePerfMarks && this.frameCount < 3 ? this.frameCount : -1;
        for (var _b = 0, activeStateMachines_1 = activeStateMachines; _b < activeStateMachines_1.length; _b++) {
            var stateMachine = activeStateMachines_1[_b];
            // Check for events before the current frame's state machine advance
            var numEventsReported = stateMachine.reportedEventCount();
            if (numEventsReported) {
                for (var i = 0; i < numEventsReported; i++) {
                    var event_1 = stateMachine.reportedEventAt(i);
                    if (event_1) {
                        if (event_1.type === RiveEventType.OpenUrl) {
                            this.eventManager.fire({
                                type: EventType.RiveEvent,
                                data: event_1,
                            });
                            // Handle the event side effect if explicitly enabled
                            if (this.automaticallyHandleEvents) {
                                var newAnchorTag = document.createElement("a");
                                var _c = event_1, url = _c.url, target = _c.target;
                                var sanitizedUrl = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.sanitizeUrl)(url);
                                url && newAnchorTag.setAttribute("href", sanitizedUrl);
                                target && newAnchorTag.setAttribute("target", target);
                                if (sanitizedUrl && sanitizedUrl !== _utils__WEBPACK_IMPORTED_MODULE_2__.BLANK_URL) {
                                    newAnchorTag.click();
                                }
                            }
                        }
                        else {
                            this.eventManager.fire({
                                type: EventType.RiveEvent,
                                data: event_1,
                            });
                        }
                    }
                }
            }
            if (_perfFrame >= 0)
                performance.mark("rive:sm-advance:start:f".concat(_perfFrame));
            stateMachine.advanceAndApply(elapsedTime);
            if (_perfFrame >= 0) {
                performance.mark("rive:sm-advance:end:f".concat(_perfFrame));
                performance.measure("rive:sm-advance:f".concat(_perfFrame), "rive:sm-advance:start:f".concat(_perfFrame), "rive:sm-advance:end:f".concat(_perfFrame));
            }
            // stateMachine.instance.apply(this.artboard);
        }
        // Once the animations have been applied to the artboard, advance it
        // by the elapsed time.
        if (this.animator.stateMachines.length == 0) {
            this.artboard.advance(elapsedTime);
        }
        var renderer = this.renderer;
        // Do not draw on 0 canvas size
        if (!this._hasZeroSize) {
            // If there was no dirt on this frame, do not clear and draw
            if (this.drawOptimization == DrawOptimizationOptions.AlwaysDraw ||
                this.artboard.didChange() ||
                this._needsRedraw ||
                this._canvasSizeChanged()) {
                // Canvas must be wiped to prevent artifacts
                renderer.clear();
                renderer.save();
                // Update the renderer alignment if necessary
                if (_perfFrame >= 0)
                    performance.mark("rive:align-renderer:start:f".concat(_perfFrame));
                this.alignRenderer();
                if (_perfFrame >= 0) {
                    performance.mark("rive:align-renderer:end:f".concat(_perfFrame));
                    performance.measure("rive:align-renderer:f".concat(_perfFrame), "rive:align-renderer:start:f".concat(_perfFrame), "rive:align-renderer:end:f".concat(_perfFrame));
                }
                if (_perfFrame >= 0)
                    performance.mark("rive:artboard-draw:start:f".concat(_perfFrame));
                this.artboard.draw(renderer);
                if (_perfFrame >= 0) {
                    performance.mark("rive:artboard-draw:end:f".concat(_perfFrame));
                    performance.measure("rive:artboard-draw:f".concat(_perfFrame), "rive:artboard-draw:start:f".concat(_perfFrame), "rive:artboard-draw:end:f".concat(_perfFrame));
                }
                renderer.restore();
                if (_perfFrame >= 0)
                    performance.mark("rive:renderer-flush:start:f".concat(_perfFrame));
                renderer.flush();
                if (_perfFrame >= 0) {
                    performance.mark("rive:renderer-flush:end:f".concat(_perfFrame));
                    performance.measure("rive:renderer-flush:f".concat(_perfFrame), "rive:renderer-flush:start:f".concat(_perfFrame), "rive:renderer-flush:end:f".concat(_perfFrame));
                }
                this._needsRedraw = false;
            }
        }
        // Check for any animations that looped
        this.animator.handleLooping();
        // Check for any state machines that had a state change
        this.animator.handleStateChanges();
        // Report advanced time
        this.animator.handleAdvancing(elapsedTime);
        // Add duration to create frame to durations array
        this.frameCount++;
        var after = performance.now();
        this.frameTimes.push(after);
        this.durations.push(after - before);
        while (this.frameTimes[0] <= after - 1000) {
            this.frameTimes.shift();
            this.durations.shift();
        }
        (_a = this._viewModelInstance) === null || _a === void 0 ? void 0 : _a.handleCallbacks();
        // Calling requestAnimationFrame will rerun draw() at the correct rate:
        // https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Basic_animations
        if (this.animator.isPlaying) {
            // Request a new rendering frame
            this.scheduleRendering();
        }
        else if (this.animator.isPaused) {
            // Reset the end time so on playback it starts at the correct frame
            this.lastRenderTime = 0;
        }
        else if (this.animator.isStopped) {
            // Reset animation instances, artboard and time
            // TODO: implement this properly when we have instancing
            // this.initArtboard();
            // this.drawFrame();
            this.lastRenderTime = 0;
        }
    };
    /**
     * Align the renderer
     */
    Rive.prototype.alignRenderer = function () {
        var _a = this, renderer = _a.renderer, runtime = _a.runtime, _layout = _a._layout, artboard = _a.artboard;
        // Align things up safe in the knowledge we can restore if changed
        renderer.align(_layout.runtimeFit(runtime), _layout.runtimeAlignment(runtime), {
            minX: _layout.minX,
            minY: _layout.minY,
            maxX: _layout.maxX,
            maxY: _layout.maxY,
        }, artboard.bounds, this._devicePixelRatioUsed * _layout.layoutScaleFactor);
    };
    Object.defineProperty(Rive.prototype, "fps", {
        get: function () {
            return this.durations.length;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Rive.prototype, "frameTime", {
        get: function () {
            if (this.durations.length === 0) {
                return 0;
            }
            return (this.durations.reduce(function (a, b) { return a + b; }, 0) / this.durations.length).toFixed(4);
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Cleans up all Wasm-generated objects that need to be manually destroyed:
     * artboard instances, animation instances, state machine instances,
     * renderer instance, file and runtime.
     *
     * Once this is called, you will need to initialise a new instance of the
     * Rive class
     */
    Rive.prototype.cleanup = function () {
        var _a, _b;
        this.destroyed = true;
        // Stop the renderer if it hasn't already been stopped.
        this.stopRendering();
        // Clean up any artboard, animation or state machine instances.
        this.cleanupInstances();
        // Remove from observer
        if (this._observed !== null) {
            observers.remove(this._observed);
        }
        this.removeRiveListeners();
        if (this.file) {
            (_a = this.riveFile) === null || _a === void 0 ? void 0 : _a.cleanup();
            this.file = null;
        }
        this.riveFile = null;
        this.deleteRiveRenderer();
        if (this._audioEventListener !== null) {
            audioManager.remove(this._audioEventListener);
            this._audioEventListener = null;
        }
        if (this._pageVisibilityHandler) {
            document.removeEventListener('visibilitychange', this._pageVisibilityHandler);
            this._pageVisibilityHandler = null;
        }
        (_b = this._viewModelInstance) === null || _b === void 0 ? void 0 : _b.cleanup();
        this._viewModelInstance = null;
        this._dataEnums = null;
    };
    /**
     * Cleans up the Renderer object. Only call this API if you no longer
     * need to render Rive content in your session.
     */
    Rive.prototype.deleteRiveRenderer = function () {
        var _a;
        (_a = this.renderer) === null || _a === void 0 ? void 0 : _a.delete();
        this.renderer = null;
    };
    /**
     * Cleans up any Wasm-generated objects that need to be manually destroyed:
     * artboard instances, animation instances, state machine instances.
     *
     * Once this is called, things will need to be reinitialized or bad things
     * might happen.
     */
    Rive.prototype.cleanupInstances = function () {
        if (this.eventCleanup !== null) {
            this.eventCleanup();
        }
        if (this.keyboardEventCleanup) {
            this.keyboardEventCleanup();
            this.keyboardEventCleanup = null;
        }
        // Delete all animation and state machine instances
        this.stop();
        if (this.artboard) {
            this.artboard.delete();
            this.artboard = null;
        }
    };
    /**
     * Tries to query the setup Artboard for a text run node with the given name.
     *
     * @param textRunName - Name of the text run node associated with a text object
     * @returns - TextValueRun node or undefined if the text run cannot be queried
     */
    Rive.prototype.retrieveTextRun = function (textRunName) {
        var _a;
        if (!textRunName) {
            console.warn("No text run name provided");
            return;
        }
        if (!this.artboard) {
            console.warn("Tried to access text run, but the Artboard is null");
            return;
        }
        var textRun = this.artboard.textRun(textRunName);
        if (!textRun) {
            console.warn("Could not access a text run with name '".concat(textRunName, "' in the '").concat((_a = this.artboard) === null || _a === void 0 ? void 0 : _a.name, "' Artboard. Note that you must rename a text run node in the Rive editor to make it queryable at runtime."));
            return;
        }
        return textRun;
    };
    /**
     * Returns a string from a given text run node name, or undefined if the text run
     * cannot be queried.
     *
     * @param textRunName - Name of the text run node associated with a text object
     * @returns - String value of the text run node or undefined
     */
    Rive.prototype.getTextRunValue = function (textRunName) {
        var textRun = this.retrieveTextRun(textRunName);
        return textRun ? textRun.text : undefined;
    };
    /**
     * Sets a text value for a given text run node name if possible
     *
     * @param textRunName - Name of the text run node associated with a text object
     * @param textRunValue - String value to set on the text run node
     */
    Rive.prototype.setTextRunValue = function (textRunName, textRunValue) {
        var textRun = this.retrieveTextRun(textRunName);
        if (textRun) {
            textRun.text = textRunValue;
        }
    };
    // Plays specified animations; if none specified, it unpauses everything.
    Rive.prototype.play = function (animationNames, autoplay) {
        var _this = this;
        animationNames = mapToStringArray(animationNames);
        // If the file's not loaded, queue up the play
        if (!this.readyForPlaying) {
            this.taskQueue.add({
                action: function () { return _this.play(animationNames, autoplay); },
            });
            return;
        }
        this.animator.play(animationNames);
        if (this.eventCleanup) {
            this.eventCleanup();
        }
        if (this.keyboardEventCleanup) {
            this.keyboardEventCleanup();
            this.keyboardEventCleanup = null;
        }
        this.setupRiveListeners();
        this.startRendering();
    };
    // Pauses specified animations; if none specified, pauses all.
    Rive.prototype.pause = function (animationNames) {
        var _this = this;
        animationNames = mapToStringArray(animationNames);
        // If the file's not loaded, early out, nothing to pause
        if (!this.readyForPlaying) {
            this.taskQueue.add({
                action: function () { return _this.pause(animationNames); },
            });
            return;
        }
        if (this.eventCleanup) {
            this.eventCleanup();
        }
        if (this.keyboardEventCleanup) {
            this.keyboardEventCleanup();
            this.keyboardEventCleanup = null;
        }
        this.animator.pause(animationNames);
    };
    Rive.prototype.scrub = function (animationNames, value) {
        var _this = this;
        animationNames = mapToStringArray(animationNames);
        // If the file's not loaded, early out, nothing to pause
        if (!this.readyForPlaying) {
            this.taskQueue.add({
                action: function () { return _this.scrub(animationNames, value); },
            });
            return;
        }
        // Scrub the animation time; we draw a single frame here so that if
        // nothing's currently playing, the scrubbed animation is still rendered/
        this.animator.scrub(animationNames, value || 0);
        this.drawFrame();
    };
    // Stops specified animations; if none specifies, stops them all.
    Rive.prototype.stop = function (animationNames) {
        var _this = this;
        animationNames = mapToStringArray(animationNames);
        // If the file's not loaded, early out, nothing to pause
        if (!this.readyForPlaying) {
            this.taskQueue.add({
                action: function () { return _this.stop(animationNames); },
            });
            return;
        }
        // If there is no artboard, this.animator will be undefined
        if (this.animator) {
            this.animator.stop(animationNames);
        }
        if (this.eventCleanup) {
            this.eventCleanup();
        }
        if (this.keyboardEventCleanup) {
            this.keyboardEventCleanup();
            this.keyboardEventCleanup = null;
        }
    };
    /**
     * Resets the animation
     * @param artboard the name of the artboard, or default if none given
     * @param animations the names of animations for playback
     * @param stateMachines the names of state machines for playback
     * @param autoplay whether to autoplay when reset, defaults to false
     *
     */
    Rive.prototype.reset = function (params) {
        var _a, _b;
        // Get the current artboard, animations, state machines, and playback states
        var artBoardName = params === null || params === void 0 ? void 0 : params.artboard;
        var animationNames = mapToStringArray(params === null || params === void 0 ? void 0 : params.animations);
        var stateMachineNames = mapToStringArray(params === null || params === void 0 ? void 0 : params.stateMachines);
        var autoplay = (_a = params === null || params === void 0 ? void 0 : params.autoplay) !== null && _a !== void 0 ? _a : false;
        var autoBind = (_b = params === null || params === void 0 ? void 0 : params.autoBind) !== null && _b !== void 0 ? _b : false;
        // Stop everything and clean up
        this.cleanupInstances();
        // Reinitialize an artboard instance with the state
        this.initArtboard(artBoardName, animationNames, stateMachineNames, autoplay, autoBind);
        this.taskQueue.process();
    };
    // Loads a new Rive file, keeping listeners in place
    Rive.prototype.load = function (params) {
        this.file = null;
        // Stop all animations
        this.stop();
        // Reinitialize
        this.init(params);
    };
    Object.defineProperty(Rive.prototype, "layout", {
        /**
         * Returns the current layout. Note that layout should be treated as
         * immutable. If you want to change the layout, create a new one use the
         * layout setter
         */
        get: function () {
            return this._layout;
        },
        // Sets a new layout
        set: function (layout) {
            this._layout = layout;
            // If the maxX or maxY are 0, then set them to the canvas width and height
            if (!layout.maxX || !layout.maxY) {
                this.resizeToCanvas();
            }
            if (this.loaded && !this.animator.isPlaying) {
                this.drawFrame();
            }
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Sets the layout bounds to the current canvas size; this is typically called
     * when the canvas is resized
     */
    Rive.prototype.resizeToCanvas = function () {
        this._layout = this.layout.copyWith({
            minX: 0,
            minY: 0,
            maxX: this.canvas.width,
            maxY: this.canvas.height,
        });
    };
    /**
     * Accounts for devicePixelRatio as a multiplier to render the size of the canvas drawing surface.
     * Uses the size of the backing canvas to set new width/height attributes. Need to re-render
     * and resize the layout to match the new drawing surface afterwards.
     * Useful function for consumers to include in a window resize listener.
     *
     * This method will set the {@link devicePixelRatioUsed} property.
     *
     * Optionally, you can provide a {@link customDevicePixelRatio} to provide a
     * custom value.
     */
    Rive.prototype.resizeDrawingSurfaceToCanvas = function (customDevicePixelRatio) {
        if (this.canvas instanceof HTMLCanvasElement && !!window) {
            var _a = this.canvas.getBoundingClientRect(), width = _a.width, height = _a.height;
            var dpr = customDevicePixelRatio || window.devicePixelRatio || 1;
            this.devicePixelRatioUsed = dpr;
            this.canvas.width = dpr * width;
            this.canvas.height = dpr * height;
            this._needsRedraw = true;
            this.resizeToCanvas();
            this.drawFrame();
            if (this.layout.fit === Fit.Layout) {
                var scaleFactor = this._layout.layoutScaleFactor;
                this.artboard.width = width / scaleFactor;
                this.artboard.height = height / scaleFactor;
            }
        }
    };
    Object.defineProperty(Rive.prototype, "source", {
        // Returns the animation source, which may be undefined
        get: function () {
            return this.src;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Rive.prototype, "activeArtboard", {
        /**
         * Returns the name of the active artboard
         */
        get: function () {
            return this.artboard ? this.artboard.name : "";
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Rive.prototype, "animationNames", {
        // Returns a list of animation names on the chosen artboard
        get: function () {
            // If the file's not loaded, we got nothing to return
            if (!this.loaded || !this.artboard) {
                return [];
            }
            var animationNames = [];
            for (var i = 0; i < this.artboard.animationCount(); i++) {
                animationNames.push(this.artboard.animationByIndex(i).name);
            }
            return animationNames;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Rive.prototype, "stateMachineNames", {
        /**
         * Returns a list of state machine names from the current artboard
         */
        get: function () {
            // If the file's not loaded, we got nothing to return
            if (!this.loaded || !this.artboard) {
                return [];
            }
            var stateMachineNames = [];
            for (var i = 0; i < this.artboard.stateMachineCount(); i++) {
                stateMachineNames.push(this.artboard.stateMachineByIndex(i).name);
            }
            return stateMachineNames;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Returns the inputs for the specified instanced state machine, or an empty
     * list if the name is invalid or the state machine is not instanced
     * @param name the state machine name
     * @returns the inputs for the named state machine
     */
    Rive.prototype.stateMachineInputs = function (name) {
        // If the file's not loaded, early out, nothing to pause
        if (!this.loaded) {
            return;
        }
        var stateMachine = this.animator.stateMachines.find(function (m) { return m.name === name; });
        return stateMachine === null || stateMachine === void 0 ? void 0 : stateMachine.inputs;
    };
    // Returns the input with the provided name at the given path
    Rive.prototype.retrieveInputAtPath = function (name, path) {
        if (!name) {
            console.warn("No input name provided for path '".concat(path, "'"));
            return;
        }
        if (!this.artboard) {
            console.warn("Tried to access input: '".concat(name, "', at path: '").concat(path, "', but the Artboard is null"));
            return;
        }
        var input = this.artboard.inputByPath(name, path);
        if (!input) {
            console.warn("Could not access an input with name: '".concat(name, "', at path:'").concat(path, "'"));
            return;
        }
        return input;
    };
    /**
     * Set the boolean input with the provided name at the given path with value
     * @param input the state machine input name
     * @param value the value to set the input to
     * @param path the path the input is located at an artboard level
     */
    Rive.prototype.setBooleanStateAtPath = function (inputName, value, path) {
        var input = this.retrieveInputAtPath(inputName, path);
        if (!input)
            return;
        if (input.type === StateMachineInputType.Boolean) {
            input.asBool().value = value;
        }
        else {
            console.warn("Input with name: '".concat(inputName, "', at path:'").concat(path, "' is not a boolean"));
        }
    };
    /**
     * Set the number input with the provided name at the given path with value
     * @param input the state machine input name
     * @param value the value to set the input to
     * @param path the path the input is located at an artboard level
     */
    Rive.prototype.setNumberStateAtPath = function (inputName, value, path) {
        var input = this.retrieveInputAtPath(inputName, path);
        if (!input)
            return;
        if (input.type === StateMachineInputType.Number) {
            input.asNumber().value = value;
        }
        else {
            console.warn("Input with name: '".concat(inputName, "', at path:'").concat(path, "' is not a number"));
        }
    };
    /**
     * Fire the trigger with the provided name at the given path
     * @param input the state machine input name
     * @param path the path the input is located at an artboard level
     */
    Rive.prototype.fireStateAtPath = function (inputName, path) {
        var input = this.retrieveInputAtPath(inputName, path);
        if (!input)
            return;
        if (input.type === StateMachineInputType.Trigger) {
            input.asTrigger().fire();
        }
        else {
            console.warn("Input with name: '".concat(inputName, "', at path:'").concat(path, "' is not a trigger"));
        }
    };
    // Returns the TextValueRun object for the provided name at the given path
    Rive.prototype.retrieveTextAtPath = function (name, path) {
        if (!name) {
            console.warn("No text name provided for path '".concat(path, "'"));
            return;
        }
        if (!path) {
            console.warn("No path provided for text '".concat(name, "'"));
            return;
        }
        if (!this.artboard) {
            console.warn("Tried to access text: '".concat(name, "', at path: '").concat(path, "', but the Artboard is null"));
            return;
        }
        var text = this.artboard.textByPath(name, path);
        if (!text) {
            console.warn("Could not access text with name: '".concat(name, "', at path:'").concat(path, "'"));
            return;
        }
        return text;
    };
    /**
     * Retrieves the text value for a specified text run at a given path
     * @param textName The name of the text run
     * @param path The path to the text run within the artboard
     * @returns The text value of the text run, or undefined if not found
     *
     * @example
     * // Get the text value for a text run named "title" at one nested artboard deep
     * const titleText = riveInstance.getTextRunValueAtPath("title", "artboard1");
     *
     * @example
     * // Get the text value for a text run named "subtitle" within a nested group two artboards deep
     * const subtitleText = riveInstance.getTextRunValueAtPath("subtitle", "group/nestedGroup");
     *
     * @remarks
     * If the text run cannot be found at the specified path, a warning will be logged to the console.
     */
    Rive.prototype.getTextRunValueAtPath = function (textName, path) {
        var run = this.retrieveTextAtPath(textName, path);
        if (!run) {
            console.warn("Could not get text with name: '".concat(textName, "', at path:'").concat(path, "'"));
            return;
        }
        return run.text;
    };
    /**
     * Sets the text value for a specified text run at a given path
     * @param textName The name of the text run
     * @param value The new text value to set
     * @param path The path to the text run within the artboard
     * @returns void
     *
     * @example
     * // Set the text value for a text run named "title" at one nested artboard deep
     * riveInstance.setTextRunValueAtPath("title", "New Title", "artboard1");
     *
     * @example
     * // Set the text value for a text run named "subtitle" within a nested group two artboards deep
     * riveInstance.setTextRunValueAtPath("subtitle", "New Subtitle", "group/nestedGroup");
     *
     * @remarks
     * If the text run cannot be found at the specified path, a warning will be logged to the console.
     */
    Rive.prototype.setTextRunValueAtPath = function (textName, value, path) {
        var run = this.retrieveTextAtPath(textName, path);
        if (!run) {
            console.warn("Could not set text with name: '".concat(textName, "', at path:'").concat(path, "'"));
            return;
        }
        run.text = value;
    };
    Object.defineProperty(Rive.prototype, "playingStateMachineNames", {
        // Returns a list of playing machine names
        get: function () {
            // If the file's not loaded, we got nothing to return
            if (!this.loaded) {
                return [];
            }
            return this.animator.stateMachines
                .filter(function (m) { return m.playing; })
                .map(function (m) { return m.name; });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Rive.prototype, "playingAnimationNames", {
        // Returns a list of playing animation names
        get: function () {
            // If the file's not loaded, we got nothing to return
            if (!this.loaded) {
                return [];
            }
            return this.animator.animations.filter(function (a) { return a.playing; }).map(function (a) { return a.name; });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Rive.prototype, "pausedAnimationNames", {
        // Returns a list of paused animation names
        get: function () {
            // If the file's not loaded, we got nothing to return
            if (!this.loaded) {
                return [];
            }
            return this.animator.animations
                .filter(function (a) { return !a.playing; })
                .map(function (a) { return a.name; });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Rive.prototype, "pausedStateMachineNames", {
        /**
         *  Returns a list of paused machine names
         * @returns a list of state machine names that are paused
         */
        get: function () {
            // If the file's not loaded, we got nothing to return
            if (!this.loaded) {
                return [];
            }
            return this.animator.stateMachines
                .filter(function (m) { return !m.playing; })
                .map(function (m) { return m.name; });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Rive.prototype, "isPlaying", {
        /**
         * @returns true if any animation is playing
         */
        get: function () {
            return this.animator.isPlaying;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Rive.prototype, "isPaused", {
        /**
         * @returns true if all instanced animations are paused
         */
        get: function () {
            return this.animator.isPaused;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Rive.prototype, "isStopped", {
        /**
         * @returns true if no animations are playing or paused
         */
        get: function () {
            var _a, _b;
            return (_b = (_a = this.animator) === null || _a === void 0 ? void 0 : _a.isStopped) !== null && _b !== void 0 ? _b : true;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Rive.prototype, "bounds", {
        /**
         * @returns the bounds of the current artboard, or undefined if the artboard
         * isn't loaded yet.
         */
        get: function () {
            return this.artboard ? this.artboard.bounds : undefined;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Subscribe to Rive-generated events
     * @param type the type of event to subscribe to
     * @param callback callback to fire when the event occurs
     */
    Rive.prototype.on = function (type, callback) {
        this.eventManager.add({
            type: type,
            callback: callback,
        });
    };
    /**
     * Unsubscribes from a Rive-generated event
     * @param type the type of event to unsubscribe from
     * @param callback the callback to unsubscribe
     */
    Rive.prototype.off = function (type, callback) {
        this.eventManager.remove({
            type: type,
            callback: callback,
        });
    };
    /**
     * Unsubscribes from a Rive-generated event
     * @deprecated
     * @param callback the callback to unsubscribe from
     */
    Rive.prototype.unsubscribe = function (type, callback) {
        console.warn("This function is deprecated: please use `off()` instead.");
        this.off(type, callback);
    };
    /**
     * Unsubscribes all Rive listeners from an event type, or everything if no type is
     * given
     * @param type the type of event to unsubscribe from, or all types if
     * undefined
     */
    Rive.prototype.removeAllRiveEventListeners = function (type) {
        this.eventManager.removeAll(type);
    };
    /**
     * Unsubscribes all listeners from an event type, or everything if no type is
     * given
     * @deprecated
     * @param type the type of event to unsubscribe from, or all types if
     * undefined
     */
    Rive.prototype.unsubscribeAll = function (type) {
        console.warn("This function is deprecated: please use `removeAllRiveEventListeners()` instead.");
        this.removeAllRiveEventListeners(type);
    };
    /**
     * Stops the rendering loop; this is different from pausing in that it doesn't
     * change the state of any animation. It stops rendering from occurring. This
     * is designed for situations such as when Rive isn't visible.
     *
     * The only way to start rendering again is to call `startRendering`.
     * Animations that are marked as playing will start from the position that
     * they would have been at if rendering had not been stopped.
     */
    Rive.prototype.stopRendering = function () {
        this._explicitlyStoppedRendering = true;
        if (this.loaded && this.frameRequestId) {
            if (this.runtime.cancelAnimationFrame) {
                this.runtime.cancelAnimationFrame(this.frameRequestId);
            }
            else {
                cancelAnimationFrame(this.frameRequestId);
            }
            this.frameRequestId = null;
        }
    };
    /**
     * Starts the rendering loop if it has been previously stopped. If the
     * renderer is already active, then this will have zero effect.
     */
    Rive.prototype.startRendering = function () {
        this._explicitlyStoppedRendering = false;
        this.drawFrame();
    };
    Rive.prototype.scheduleRendering = function () {
        if (this.loaded && this.artboard && !this.frameRequestId) {
            if (this.runtime.requestAnimationFrame) {
                this.frameRequestId = this.runtime.requestAnimationFrame(this._boundDraw);
            }
            else {
                this.frameRequestId = requestAnimationFrame(this._boundDraw);
            }
        }
    };
    /**
     * Called when document.visibilitychange fires (tab change, window minimize, etc.).
     * Cancels the rAF loop on hide and resets the time reference so that no accumulated time is
     * applied to state machines when the tab becomes visible again. This prevents state machine
     * advances with large time deltas when rAF starts up again.
     */
    Rive.prototype._onPageVisibilityChange = function () {
        var _a, _b;
        if (document.hidden) {
            if (this.frameRequestId !== null) {
                if ((_a = this.runtime) === null || _a === void 0 ? void 0 : _a.cancelAnimationFrame) {
                    this.runtime.cancelAnimationFrame(this.frameRequestId);
                }
                else {
                    cancelAnimationFrame(this.frameRequestId);
                }
                this.frameRequestId = null;
            }
            // Reset so the first resumed frame starts with elapsedTime === 0.
            this.lastRenderTime = 0;
        }
        else if (((_b = this.animator) === null || _b === void 0 ? void 0 : _b.isPlaying) && !this._explicitlyStoppedRendering) {
            this.scheduleRendering();
        }
    };
    /**
     * Enables frames-per-second (FPS) reporting for the runtime
     * If no callback is provided, Rive will append a fixed-position div at the top-right corner of
     * the page with the FPS reading
     * @param fpsCallback - Callback from the runtime during the RAF loop that supplies the FPS value
     */
    Rive.prototype.enableFPSCounter = function (fpsCallback) {
        this.runtime.enableFPSCounter(fpsCallback);
    };
    /**
     * Disables frames-per-second (FPS) reporting for the runtime
     */
    Rive.prototype.disableFPSCounter = function () {
        this.runtime.disableFPSCounter();
    };
    Object.defineProperty(Rive.prototype, "contents", {
        /**
         * Returns the contents of a Rive file: the artboards, animations, and state machines
         */
        get: function () {
            if (!this.loaded) {
                return undefined;
            }
            var riveContents = {
                artboards: [],
            };
            for (var i = 0; i < this.file.artboardCount(); i++) {
                var artboard = this.file.artboardByIndex(i);
                var artboardContents = {
                    name: artboard.name,
                    animations: [],
                    stateMachines: [],
                };
                for (var j = 0; j < artboard.animationCount(); j++) {
                    var animation = artboard.animationByIndex(j);
                    artboardContents.animations.push(animation.name);
                }
                for (var k = 0; k < artboard.stateMachineCount(); k++) {
                    var stateMachine = artboard.stateMachineByIndex(k);
                    var name_1 = stateMachine.name;
                    var instance = new this.runtime.StateMachineInstance(stateMachine, artboard);
                    var inputContents = [];
                    for (var l = 0; l < instance.inputCount(); l++) {
                        var input = instance.input(l);
                        inputContents.push({ name: input.name, type: input.type });
                    }
                    artboardContents.stateMachines.push({
                        name: name_1,
                        inputs: inputContents,
                    });
                }
                riveContents.artboards.push(artboardContents);
            }
            return riveContents;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Rive.prototype, "volume", {
        /**
         * Getter / Setter for the volume of the artboard
         */
        get: function () {
            if (this.artboard && this.artboard.volume !== this._volume) {
                this._volume = this.artboard.volume;
            }
            return this._volume;
        },
        set: function (value) {
            this._volume = value;
            if (this.artboard) {
                this.artboard.volume = value * audioManager.systemVolume;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Rive.prototype, "artboardWidth", {
        /**
         * The width of the artboard.
         *
         * This will return 0 if the artboard is not loaded yet and a custom
         * width has not been set.
         *
         * Do not set this value manually when using {@link resizeDrawingSurfaceToCanvas}
         * with a {@link Layout.fit} of {@link Fit.Layout}, as the artboard width is
         * automatically set.
         */
        get: function () {
            var _a;
            if (this.artboard) {
                return this.artboard.width;
            }
            return (_a = this._artboardWidth) !== null && _a !== void 0 ? _a : 0;
        },
        set: function (value) {
            this._artboardWidth = value;
            if (this.artboard) {
                this.artboard.width = value;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Rive.prototype, "artboardHeight", {
        /**
         * The height of the artboard.
         *
         * This will return 0 if the artboard is not loaded yet and a custom
         * height has not been set.
         *
         * Do not set this value manually when using {@link resizeDrawingSurfaceToCanvas}
         * with a {@link Layout.fit} of {@link Fit.Layout}, as the artboard height is
         * automatically set.
         */
        get: function () {
            var _a;
            if (this.artboard) {
                return this.artboard.height;
            }
            return (_a = this._artboardHeight) !== null && _a !== void 0 ? _a : 0;
        },
        set: function (value) {
            this._artboardHeight = value;
            if (this.artboard) {
                this.artboard.height = value;
            }
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Reset the artboard size to its original values.
     */
    Rive.prototype.resetArtboardSize = function () {
        if (this.artboard) {
            this.artboard.resetArtboardSize();
            this._artboardWidth = this.artboard.width;
            this._artboardHeight = this.artboard.height;
        }
        else {
            // If the artboard isn't loaded, we need to reset the custom width and height
            this._artboardWidth = undefined;
            this._artboardHeight = undefined;
        }
    };
    Object.defineProperty(Rive.prototype, "devicePixelRatioUsed", {
        /**
         * The device pixel ratio used in rendering and canvas/artboard resizing.
         *
         * This value will be overidden by the device pixel ratio used in
         * {@link resizeDrawingSurfaceToCanvas}. If you use that method, do not set this value.
         */
        get: function () {
            return this._devicePixelRatioUsed;
        },
        set: function (value) {
            this._devicePixelRatioUsed = value;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Initialize the data context with the view model instance.
     */
    Rive.prototype.bindViewModelInstance = function (viewModelInstance) {
        var _a;
        if (this.artboard && !this.destroyed) {
            if (viewModelInstance && viewModelInstance.runtimeInstance) {
                viewModelInstance.internalIncrementReferenceCount();
                (_a = this._viewModelInstance) === null || _a === void 0 ? void 0 : _a.cleanup();
                this._viewModelInstance = viewModelInstance;
                if (this.animator.stateMachines.length > 0) {
                    this.animator.stateMachines.forEach(function (stateMachine) {
                        return stateMachine.bindViewModelInstance(viewModelInstance);
                    });
                }
                else {
                    this.artboard.bindViewModelInstance(viewModelInstance.runtimeInstance);
                }
            }
        }
    };
    Object.defineProperty(Rive.prototype, "viewModelInstance", {
        get: function () {
            return this._viewModelInstance;
        },
        enumerable: false,
        configurable: true
    });
    Rive.prototype.viewModelByIndex = function (index) {
        var viewModel = this.file.viewModelByIndex(index);
        if (viewModel !== null) {
            return new ViewModel(viewModel);
        }
        return null;
    };
    Rive.prototype.viewModelByName = function (name) {
        var _a;
        return (_a = this.riveFile) === null || _a === void 0 ? void 0 : _a.viewModelByName(name);
    };
    Rive.prototype.enums = function () {
        if (this._dataEnums === null) {
            var dataEnums = this.file.enums();
            this._dataEnums = dataEnums.map(function (dataEnum) {
                return new DataEnum(dataEnum);
            });
        }
        return this._dataEnums;
    };
    Rive.prototype.defaultViewModel = function () {
        if (this.artboard) {
            var viewModel = this.file.defaultArtboardViewModel(this.artboard);
            if (viewModel) {
                return new ViewModel(viewModel);
            }
        }
        return null;
    };
    /**
     * @deprecated This function is deprecated. For better stability and memory management
     * use `getBindableArtboard()` instead.
     * @param {string} name - The name of the artboard.
     * @returns {Artboard} The artboard to bind to.
     */
    Rive.prototype.getArtboard = function (name) {
        var _a, _b;
        return (_b = (_a = this.riveFile) === null || _a === void 0 ? void 0 : _a.getArtboard(name)) !== null && _b !== void 0 ? _b : null;
    };
    Rive.prototype.getBindableArtboard = function (name) {
        var _a, _b;
        return (_b = (_a = this.riveFile) === null || _a === void 0 ? void 0 : _a.getBindableArtboard(name)) !== null && _b !== void 0 ? _b : null;
    };
    Rive.prototype.getDefaultBindableArtboard = function () {
        var _a, _b;
        return (_b = (_a = this.riveFile) === null || _a === void 0 ? void 0 : _a.getDefaultBindableArtboard()) !== null && _b !== void 0 ? _b : null;
    };
    // Error message for missing source or buffer
    Rive.missingErrorMessage = "Rive source file or data buffer required";
    // Error message for removed rive file
    Rive.cleanupErrorMessage = "Attempt to use file after calling cleanup.";
    return Rive;
}());

var DataType;
(function (DataType) {
    DataType["none"] = "none";
    DataType["string"] = "string";
    DataType["number"] = "number";
    DataType["boolean"] = "boolean";
    DataType["color"] = "color";
    DataType["list"] = "list";
    DataType["enumType"] = "enumType";
    DataType["trigger"] = "trigger";
    DataType["viewModel"] = "viewModel";
    DataType["integer"] = "integer";
    DataType["listIndex"] = "listIndex";
    DataType["image"] = "image";
    DataType["artboard"] = "artboard";
})(DataType || (DataType = {}));
var ViewModel = /** @class */ (function () {
    function ViewModel(viewModel) {
        this._viewModel = viewModel;
    }
    Object.defineProperty(ViewModel.prototype, "instanceCount", {
        get: function () {
            return this._viewModel.instanceCount;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ViewModel.prototype, "name", {
        get: function () {
            return this._viewModel.name;
        },
        enumerable: false,
        configurable: true
    });
    ViewModel.prototype.instanceByIndex = function (index) {
        var instance = this._viewModel.instanceByIndex(index);
        if (instance !== null) {
            var viewModelInstance = new ViewModelInstance(instance, null);
            (0,_utils__WEBPACK_IMPORTED_MODULE_2__.createFinalization)(viewModelInstance, instance);
            return viewModelInstance;
        }
        return null;
    };
    ViewModel.prototype.instanceByName = function (name) {
        var instance = this._viewModel.instanceByName(name);
        if (instance !== null) {
            var viewModelInstance = new ViewModelInstance(instance, null);
            (0,_utils__WEBPACK_IMPORTED_MODULE_2__.createFinalization)(viewModelInstance, instance);
            return viewModelInstance;
        }
        return null;
    };
    ViewModel.prototype.defaultInstance = function () {
        var runtimeInstance = this._viewModel.defaultInstance();
        if (runtimeInstance !== null) {
            var viewModelInstance = new ViewModelInstance(runtimeInstance, null);
            (0,_utils__WEBPACK_IMPORTED_MODULE_2__.createFinalization)(viewModelInstance, runtimeInstance);
            return viewModelInstance;
        }
        return null;
    };
    ViewModel.prototype.instance = function () {
        var runtimeInstance = this._viewModel.instance();
        if (runtimeInstance !== null) {
            var viewModelInstance = new ViewModelInstance(runtimeInstance, null);
            (0,_utils__WEBPACK_IMPORTED_MODULE_2__.createFinalization)(viewModelInstance, runtimeInstance);
            return viewModelInstance;
        }
        return null;
    };
    Object.defineProperty(ViewModel.prototype, "properties", {
        get: function () {
            return this._viewModel.getProperties();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ViewModel.prototype, "instanceNames", {
        get: function () {
            return this._viewModel.getInstanceNames();
        },
        enumerable: false,
        configurable: true
    });
    return ViewModel;
}());

var DataEnum = /** @class */ (function () {
    function DataEnum(dataEnum) {
        this._dataEnum = dataEnum;
    }
    Object.defineProperty(DataEnum.prototype, "name", {
        get: function () {
            return this._dataEnum.name;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DataEnum.prototype, "values", {
        get: function () {
            return this._dataEnum.values;
        },
        enumerable: false,
        configurable: true
    });
    return DataEnum;
}());

var PropertyType;
(function (PropertyType) {
    PropertyType["Number"] = "number";
    PropertyType["String"] = "string";
    PropertyType["Boolean"] = "boolean";
    PropertyType["Color"] = "color";
    PropertyType["Trigger"] = "trigger";
    PropertyType["Enum"] = "enum";
    PropertyType["List"] = "list";
    PropertyType["Image"] = "image";
    PropertyType["Artboard"] = "artboard";
})(PropertyType || (PropertyType = {}));
var ViewModelInstance = /** @class */ (function () {
    function ViewModelInstance(runtimeInstance, parent) {
        this._parents = [];
        this._children = [];
        this._viewModelInstances = new Map();
        this._propertiesWithCallbacks = [];
        this._referenceCount = 0;
        this.selfUnref = false;
        this._runtimeInstance = runtimeInstance;
        if (parent !== null) {
            this._parents.push(parent);
        }
    }
    Object.defineProperty(ViewModelInstance.prototype, "runtimeInstance", {
        get: function () {
            return this._runtimeInstance;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ViewModelInstance.prototype, "nativeInstance", {
        get: function () {
            return this._runtimeInstance;
        },
        enumerable: false,
        configurable: true
    });
    ViewModelInstance.prototype.handleCallbacks = function () {
        if (this._propertiesWithCallbacks.length !== 0) {
            this._propertiesWithCallbacks.forEach(function (property) {
                property.handleCallbacks();
            });
            this._propertiesWithCallbacks.forEach(function (property) {
                property.clearChanges();
            });
        }
        this._children.forEach(function (child) { return child.handleCallbacks(); });
    };
    ViewModelInstance.prototype.addParent = function (parent) {
        if (!this._parents.includes(parent)) {
            this._parents.push(parent);
            if (this._propertiesWithCallbacks.length > 0 ||
                this._children.length > 0) {
                parent.addToViewModelCallbacks(this);
            }
        }
    };
    ViewModelInstance.prototype.removeParent = function (parent) {
        var index = this._parents.indexOf(parent);
        if (index !== -1) {
            var parent_1 = this._parents[index];
            parent_1.removeFromViewModelCallbacks(this);
            this._parents.splice(index, 1);
        }
    };
    /*
     * method for internal use, it shouldn't be called externally
     */
    ViewModelInstance.prototype.addToPropertyCallbacks = function (property) {
        var _this = this;
        if (!this._propertiesWithCallbacks.includes(property)) {
            this._propertiesWithCallbacks.push(property);
            if (this._propertiesWithCallbacks.length > 0) {
                this._parents.forEach(function (parent) {
                    parent.addToViewModelCallbacks(_this);
                });
            }
        }
    };
    /*
     * method for internal use, it shouldn't be called externally
     */
    ViewModelInstance.prototype.removeFromPropertyCallbacks = function (property) {
        var _this = this;
        if (this._propertiesWithCallbacks.includes(property)) {
            this._propertiesWithCallbacks = this._propertiesWithCallbacks.filter(function (prop) { return prop !== property; });
            if (this._children.length === 0 &&
                this._propertiesWithCallbacks.length === 0) {
                this._parents.forEach(function (parent) {
                    parent.removeFromViewModelCallbacks(_this);
                });
            }
        }
    };
    /*
     * method for internal use, it shouldn't be called externally
     */
    ViewModelInstance.prototype.addToViewModelCallbacks = function (instance) {
        var _this = this;
        if (!this._children.includes(instance)) {
            this._children.push(instance);
            this._parents.forEach(function (parent) {
                parent.addToViewModelCallbacks(_this);
            });
        }
    };
    /*
     * method for internal use, it shouldn't be called externally
     */
    ViewModelInstance.prototype.removeFromViewModelCallbacks = function (instance) {
        var _this = this;
        if (this._children.includes(instance)) {
            this._children = this._children.filter(function (child) { return child !== instance; });
            if (this._children.length === 0 &&
                this._propertiesWithCallbacks.length === 0) {
                this._parents.forEach(function (parent) {
                    parent.removeFromViewModelCallbacks(_this);
                });
            }
        }
    };
    ViewModelInstance.prototype.clearCallbacks = function () {
        this._propertiesWithCallbacks.forEach(function (property) {
            property.clearCallbacks();
        });
    };
    ViewModelInstance.prototype.propertyFromPath = function (path, type) {
        var pathSegments = path.split("/");
        return this.propertyFromPathSegments(pathSegments, 0, type);
    };
    ViewModelInstance.prototype.viewModelFromPathSegments = function (pathSegments, index) {
        var viewModelInstance = this.internalViewModelInstance(pathSegments[index]);
        if (viewModelInstance !== null) {
            if (index == pathSegments.length - 1) {
                return viewModelInstance;
            }
            else {
                return viewModelInstance.viewModelFromPathSegments(pathSegments, index++);
            }
        }
        return null;
    };
    ViewModelInstance.prototype.propertyFromPathSegments = function (pathSegments, index, type) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
        if (index < pathSegments.length - 1) {
            var viewModelInstance = this.internalViewModelInstance(pathSegments[index]);
            if (viewModelInstance !== null) {
                return viewModelInstance.propertyFromPathSegments(pathSegments, index + 1, type);
            }
            else {
                return null;
            }
        }
        var instance = null;
        switch (type) {
            case PropertyType.Number:
                instance = (_b = (_a = this._runtimeInstance) === null || _a === void 0 ? void 0 : _a.number(pathSegments[index])) !== null && _b !== void 0 ? _b : null;
                if (instance !== null) {
                    return new ViewModelInstanceNumber(instance, this);
                }
                break;
            case PropertyType.String:
                instance = (_d = (_c = this._runtimeInstance) === null || _c === void 0 ? void 0 : _c.string(pathSegments[index])) !== null && _d !== void 0 ? _d : null;
                if (instance !== null) {
                    return new ViewModelInstanceString(instance, this);
                }
                break;
            case PropertyType.Boolean:
                instance = (_f = (_e = this._runtimeInstance) === null || _e === void 0 ? void 0 : _e.boolean(pathSegments[index])) !== null && _f !== void 0 ? _f : null;
                if (instance !== null) {
                    return new ViewModelInstanceBoolean(instance, this);
                }
                break;
            case PropertyType.Color:
                instance = (_h = (_g = this._runtimeInstance) === null || _g === void 0 ? void 0 : _g.color(pathSegments[index])) !== null && _h !== void 0 ? _h : null;
                if (instance !== null) {
                    return new ViewModelInstanceColor(instance, this);
                }
                break;
            case PropertyType.Trigger:
                instance = (_k = (_j = this._runtimeInstance) === null || _j === void 0 ? void 0 : _j.trigger(pathSegments[index])) !== null && _k !== void 0 ? _k : null;
                if (instance !== null) {
                    return new ViewModelInstanceTrigger(instance, this);
                }
                break;
            case PropertyType.Enum:
                instance = (_m = (_l = this._runtimeInstance) === null || _l === void 0 ? void 0 : _l.enum(pathSegments[index])) !== null && _m !== void 0 ? _m : null;
                if (instance !== null) {
                    return new ViewModelInstanceEnum(instance, this);
                }
                break;
            case PropertyType.List:
                instance = (_p = (_o = this._runtimeInstance) === null || _o === void 0 ? void 0 : _o.list(pathSegments[index])) !== null && _p !== void 0 ? _p : null;
                if (instance !== null) {
                    return new ViewModelInstanceList(instance, this);
                }
                break;
            case PropertyType.Image:
                instance = (_r = (_q = this._runtimeInstance) === null || _q === void 0 ? void 0 : _q.image(pathSegments[index])) !== null && _r !== void 0 ? _r : null;
                if (instance !== null) {
                    return new ViewModelInstanceAssetImage(instance, this);
                }
                break;
            case PropertyType.Artboard:
                instance = (_t = (_s = this._runtimeInstance) === null || _s === void 0 ? void 0 : _s.artboard(pathSegments[index])) !== null && _t !== void 0 ? _t : null;
                if (instance !== null) {
                    return new ViewModelInstanceArtboard(instance, this);
                }
                break;
        }
        return null;
    };
    ViewModelInstance.prototype.internalViewModelInstance = function (name) {
        var _a;
        if (this._viewModelInstances.has(name)) {
            return this._viewModelInstances.get(name);
        }
        var viewModelRuntimeInstance = (_a = this._runtimeInstance) === null || _a === void 0 ? void 0 : _a.viewModel(name);
        if (viewModelRuntimeInstance !== null) {
            var viewModelInstance = new ViewModelInstance(viewModelRuntimeInstance, this);
            (0,_utils__WEBPACK_IMPORTED_MODULE_2__.createFinalization)(viewModelInstance, viewModelRuntimeInstance);
            viewModelInstance.internalIncrementReferenceCount();
            this._viewModelInstances.set(name, viewModelInstance);
            return viewModelInstance;
        }
        return null;
    };
    /**
     * method to access a property instance of type number belonging
     * to the view model instance or to a nested view model instance
     * @param path - path to the number property
     */
    ViewModelInstance.prototype.number = function (path) {
        var viewmodelInstanceValue = this.propertyFromPath(path, PropertyType.Number);
        return viewmodelInstanceValue;
    };
    /**
     * method to access a property instance of type string belonging
     * to the view model instance or to a nested view model instance
     * @param path - path to the string property
     */
    ViewModelInstance.prototype.string = function (path) {
        var viewmodelInstanceValue = this.propertyFromPath(path, PropertyType.String);
        return viewmodelInstanceValue;
    };
    /**
     * method to access a property instance of type boolean belonging
     * to the view model instance or to a nested view model instance
     * @param path - path to the boolean property
     */
    ViewModelInstance.prototype.boolean = function (path) {
        var viewmodelInstanceValue = this.propertyFromPath(path, PropertyType.Boolean);
        return viewmodelInstanceValue;
    };
    /**
     * method to access a property instance of type color belonging
     * to the view model instance or to a nested view model instance
     * @param path - path to the ttrigger property
     */
    ViewModelInstance.prototype.color = function (path) {
        var viewmodelInstanceValue = this.propertyFromPath(path, PropertyType.Color);
        return viewmodelInstanceValue;
    };
    /**
     * method to access a property instance of type trigger belonging
     * to the view model instance or to a nested view model instance
     * @param path - path to the trigger property
     */
    ViewModelInstance.prototype.trigger = function (path) {
        var viewmodelInstanceValue = this.propertyFromPath(path, PropertyType.Trigger);
        return viewmodelInstanceValue;
    };
    /**
     * method to access a property instance of type enum belonging
     * to the view model instance or to a nested view model instance
     * @param path - path to the enum property
     */
    ViewModelInstance.prototype.enum = function (path) {
        var viewmodelInstanceValue = this.propertyFromPath(path, PropertyType.Enum);
        return viewmodelInstanceValue;
    };
    /**
     * method to access a property instance of type list belonging
     * to the view model instance or to a nested view model instance
     * @param path - path to the list property
     */
    ViewModelInstance.prototype.list = function (path) {
        var viewmodelInstanceValue = this.propertyFromPath(path, PropertyType.List);
        return viewmodelInstanceValue;
    };
    /**
     * method to access a view model property instance belonging
     * to the view model instance or to a nested view model instance
     * @param path - path to the image property
     */
    ViewModelInstance.prototype.image = function (path) {
        var viewmodelInstanceValue = this.propertyFromPath(path, PropertyType.Image);
        return viewmodelInstanceValue;
    };
    /**
     * method to access an artboard property instance belonging
     * to the view model instance or to a nested view model instance
     * @param path - path to the image property
     */
    ViewModelInstance.prototype.artboard = function (path) {
        var viewmodelInstanceValue = this.propertyFromPath(path, PropertyType.Artboard);
        return viewmodelInstanceValue;
    };
    /**
     * method to access a view model property instance belonging
     * to the view model instance or to a nested view model instance
     * @param path - path to the view model property
     */
    ViewModelInstance.prototype.viewModel = function (path) {
        var pathSegments = path.split("/");
        var parentViewModelInstance = pathSegments.length > 1
            ? this.viewModelFromPathSegments(pathSegments.slice(0, pathSegments.length - 1), 0)
            : this;
        if (parentViewModelInstance != null) {
            return parentViewModelInstance.internalViewModelInstance(pathSegments[pathSegments.length - 1]);
        }
        return null;
    };
    ViewModelInstance.prototype.internalReplaceViewModel = function (name, value) {
        var _a;
        if (value.runtimeInstance !== null) {
            var result = ((_a = this._runtimeInstance) === null || _a === void 0 ? void 0 : _a.replaceViewModel(name, value.runtimeInstance)) ||
                false;
            if (result) {
                value.internalIncrementReferenceCount();
                var oldInstance_1 = this.internalViewModelInstance(name);
                if (oldInstance_1 !== null) {
                    oldInstance_1.removeParent(this);
                    if (this._children.includes(oldInstance_1)) {
                        this._children = this._children.filter(function (child) { return child !== oldInstance_1; });
                    }
                    oldInstance_1.cleanup();
                }
                this._viewModelInstances.set(name, value);
                value.addParent(this);
            }
            return result;
        }
        return false;
    };
    /**
     * method to replace a view model property with another view model value
     * @param path - path to the view model property
     * @param value - view model that will replace the original
     */
    ViewModelInstance.prototype.replaceViewModel = function (path, value) {
        var _a;
        var pathSegments = path.split("/");
        var viewModelInstance = pathSegments.length > 1
            ? this.viewModelFromPathSegments(pathSegments.slice(0, pathSegments.length - 1), 0)
            : this;
        return ((_a = viewModelInstance === null || viewModelInstance === void 0 ? void 0 : viewModelInstance.internalReplaceViewModel(pathSegments[pathSegments.length - 1], value)) !== null && _a !== void 0 ? _a : false);
    };
    /*
     * method to add one to the reference counter of the instance.
     * Use if the file owning the reference is destroyed but the instance needs to stay around
     */
    ViewModelInstance.prototype.incrementReferenceCount = function () {
        var _a;
        this._referenceCount++;
        (_a = this._runtimeInstance) === null || _a === void 0 ? void 0 : _a.incrementReferenceCount();
    };
    /*
     * method to subtract one to the reference counter of the instance.
     * Use if incrementReferenceCount has been called
     */
    ViewModelInstance.prototype.decrementReferenceCount = function () {
        var _a;
        this._referenceCount--;
        (_a = this._runtimeInstance) === null || _a === void 0 ? void 0 : _a.decrementReferenceCount();
    };
    Object.defineProperty(ViewModelInstance.prototype, "properties", {
        get: function () {
            var _a;
            return (((_a = this._runtimeInstance) === null || _a === void 0 ? void 0 : _a.getProperties().map(function (prop) { return (__assign({}, prop)); })) || []);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ViewModelInstance.prototype, "viewModelName", {
        /**
         * Get the name of the ViewModel definition this instance was created from.
         */
        get: function () {
            var _a, _b;
            return (_b = (_a = this._runtimeInstance) === null || _a === void 0 ? void 0 : _a.getViewModelName()) !== null && _b !== void 0 ? _b : "";
        },
        enumerable: false,
        configurable: true
    });
    ViewModelInstance.prototype.internalIncrementReferenceCount = function () {
        this._referenceCount++;
    };
    ViewModelInstance.prototype.cleanup = function () {
        var _this = this;
        var _a;
        this._referenceCount--;
        if (this._referenceCount <= 0) {
            if (this.selfUnref) {
                (_a = this._runtimeInstance) === null || _a === void 0 ? void 0 : _a.unref();
            }
            this._runtimeInstance = null;
            this.clearCallbacks();
            this._propertiesWithCallbacks = [];
            this._viewModelInstances.forEach(function (value) {
                value.cleanup();
            });
            this._viewModelInstances.clear();
            var children = __spreadArray([], this._children, true);
            this._children.length = 0;
            var parents = __spreadArray([], this._parents, true);
            this._parents.length = 0;
            children.forEach(function (child) {
                child.removeParent(_this);
            });
            parents.forEach(function (parent) {
                parent.removeFromViewModelCallbacks(_this);
            });
        }
    };
    return ViewModelInstance;
}());

var ViewModelInstanceValue = /** @class */ (function () {
    function ViewModelInstanceValue(instance, parent) {
        this.callbacks = [];
        this._viewModelInstanceValue = instance;
        this._parentViewModel = parent;
    }
    ViewModelInstanceValue.prototype.on = function (callback) {
        // Since we don't clean the changed flag for properties that don't have listeners,
        // we clean it the first time we add a listener to it
        if (this.callbacks.length === 0) {
            this._viewModelInstanceValue.clearChanges();
        }
        if (!this.callbacks.includes(callback)) {
            this.callbacks.push(callback);
            this._parentViewModel.addToPropertyCallbacks(this);
        }
    };
    ViewModelInstanceValue.prototype.off = function (callback) {
        if (!callback) {
            this.callbacks.length = 0;
        }
        else {
            this.callbacks = this.callbacks.filter(function (cb) { return cb !== callback; });
        }
        if (this.callbacks.length === 0) {
            this._parentViewModel.removeFromPropertyCallbacks(this);
        }
    };
    ViewModelInstanceValue.prototype.internalHandleCallback = function (callback) { };
    ViewModelInstanceValue.prototype.handleCallbacks = function () {
        var _this = this;
        if (this._viewModelInstanceValue.hasChanged) {
            this.callbacks.forEach(function (callback) {
                _this.internalHandleCallback(callback);
            });
        }
    };
    ViewModelInstanceValue.prototype.clearChanges = function () {
        this._viewModelInstanceValue.clearChanges();
    };
    ViewModelInstanceValue.prototype.clearCallbacks = function () {
        this.callbacks.length = 0;
    };
    Object.defineProperty(ViewModelInstanceValue.prototype, "name", {
        get: function () {
            return this._viewModelInstanceValue.name;
        },
        enumerable: false,
        configurable: true
    });
    return ViewModelInstanceValue;
}());

var ViewModelInstanceString = /** @class */ (function (_super) {
    __extends(ViewModelInstanceString, _super);
    function ViewModelInstanceString(instance, parent) {
        return _super.call(this, instance, parent) || this;
    }
    Object.defineProperty(ViewModelInstanceString.prototype, "value", {
        get: function () {
            return this._viewModelInstanceValue.value;
        },
        set: function (val) {
            this._viewModelInstanceValue.value = val;
        },
        enumerable: false,
        configurable: true
    });
    ViewModelInstanceString.prototype.internalHandleCallback = function (callback) {
        callback(this.value);
    };
    return ViewModelInstanceString;
}(ViewModelInstanceValue));

var ViewModelInstanceNumber = /** @class */ (function (_super) {
    __extends(ViewModelInstanceNumber, _super);
    function ViewModelInstanceNumber(instance, parent) {
        return _super.call(this, instance, parent) || this;
    }
    Object.defineProperty(ViewModelInstanceNumber.prototype, "value", {
        get: function () {
            return this._viewModelInstanceValue.value;
        },
        set: function (val) {
            this._viewModelInstanceValue.value = val;
        },
        enumerable: false,
        configurable: true
    });
    ViewModelInstanceNumber.prototype.internalHandleCallback = function (callback) {
        callback(this.value);
    };
    return ViewModelInstanceNumber;
}(ViewModelInstanceValue));

var ViewModelInstanceBoolean = /** @class */ (function (_super) {
    __extends(ViewModelInstanceBoolean, _super);
    function ViewModelInstanceBoolean(instance, parent) {
        return _super.call(this, instance, parent) || this;
    }
    Object.defineProperty(ViewModelInstanceBoolean.prototype, "value", {
        get: function () {
            return this._viewModelInstanceValue.value;
        },
        set: function (val) {
            this._viewModelInstanceValue.value = val;
        },
        enumerable: false,
        configurable: true
    });
    ViewModelInstanceBoolean.prototype.internalHandleCallback = function (callback) {
        callback(this.value);
    };
    return ViewModelInstanceBoolean;
}(ViewModelInstanceValue));

var ViewModelInstanceTrigger = /** @class */ (function (_super) {
    __extends(ViewModelInstanceTrigger, _super);
    function ViewModelInstanceTrigger(instance, parent) {
        return _super.call(this, instance, parent) || this;
    }
    ViewModelInstanceTrigger.prototype.trigger = function () {
        return this._viewModelInstanceValue.trigger();
    };
    ViewModelInstanceTrigger.prototype.internalHandleCallback = function (callback) {
        callback();
    };
    return ViewModelInstanceTrigger;
}(ViewModelInstanceValue));

var ViewModelInstanceEnum = /** @class */ (function (_super) {
    __extends(ViewModelInstanceEnum, _super);
    function ViewModelInstanceEnum(instance, parent) {
        return _super.call(this, instance, parent) || this;
    }
    Object.defineProperty(ViewModelInstanceEnum.prototype, "value", {
        get: function () {
            return this._viewModelInstanceValue.value;
        },
        set: function (val) {
            this._viewModelInstanceValue.value = val;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ViewModelInstanceEnum.prototype, "valueIndex", {
        get: function () {
            return this._viewModelInstanceValue
                .valueIndex;
        },
        set: function (val) {
            this._viewModelInstanceValue.valueIndex = val;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ViewModelInstanceEnum.prototype, "values", {
        get: function () {
            return this._viewModelInstanceValue.values;
        },
        enumerable: false,
        configurable: true
    });
    ViewModelInstanceEnum.prototype.internalHandleCallback = function (callback) {
        callback(this.value);
    };
    return ViewModelInstanceEnum;
}(ViewModelInstanceValue));

var ViewModelInstanceList = /** @class */ (function (_super) {
    __extends(ViewModelInstanceList, _super);
    function ViewModelInstanceList(instance, parent) {
        return _super.call(this, instance, parent) || this;
    }
    Object.defineProperty(ViewModelInstanceList.prototype, "length", {
        get: function () {
            return this._viewModelInstanceValue.size;
        },
        enumerable: false,
        configurable: true
    });
    ViewModelInstanceList.prototype.addInstance = function (instance) {
        if (instance.runtimeInstance != null) {
            this._viewModelInstanceValue.addInstance(instance.runtimeInstance);
            instance.addParent(this._parentViewModel);
        }
    };
    ViewModelInstanceList.prototype.addInstanceAt = function (instance, index) {
        if (instance.runtimeInstance != null) {
            if (this._viewModelInstanceValue.addInstanceAt(instance.runtimeInstance, index)) {
                instance.addParent(this._parentViewModel);
                return true;
            }
        }
        return false;
    };
    ViewModelInstanceList.prototype.removeInstance = function (instance) {
        if (instance.runtimeInstance != null) {
            this._viewModelInstanceValue.removeInstance(instance.runtimeInstance);
            instance.removeParent(this._parentViewModel);
        }
    };
    ViewModelInstanceList.prototype.removeInstanceAt = function (index) {
        this._viewModelInstanceValue.removeInstanceAt(index);
    };
    ViewModelInstanceList.prototype.instanceAt = function (index) {
        var runtimeInstance = this._viewModelInstanceValue.instanceAt(index);
        if (runtimeInstance != null) {
            var viewModelInstance = new ViewModelInstance(runtimeInstance, this._parentViewModel);
            (0,_utils__WEBPACK_IMPORTED_MODULE_2__.createFinalization)(viewModelInstance, runtimeInstance);
            return viewModelInstance;
        }
        return null;
    };
    ViewModelInstanceList.prototype.swap = function (a, b) {
        this._viewModelInstanceValue.swap(a, b);
    };
    ViewModelInstanceList.prototype.internalHandleCallback = function (callback) {
        callback();
    };
    return ViewModelInstanceList;
}(ViewModelInstanceValue));

var ViewModelInstanceColor = /** @class */ (function (_super) {
    __extends(ViewModelInstanceColor, _super);
    function ViewModelInstanceColor(instance, parent) {
        return _super.call(this, instance, parent) || this;
    }
    Object.defineProperty(ViewModelInstanceColor.prototype, "value", {
        get: function () {
            return this._viewModelInstanceValue.value;
        },
        set: function (val) {
            this._viewModelInstanceValue.value = val;
        },
        enumerable: false,
        configurable: true
    });
    ViewModelInstanceColor.prototype.rgb = function (r, g, b) {
        this._viewModelInstanceValue.rgb(r, g, b);
    };
    ViewModelInstanceColor.prototype.rgba = function (r, g, b, a) {
        this._viewModelInstanceValue.argb(a, r, g, b);
    };
    ViewModelInstanceColor.prototype.argb = function (a, r, g, b) {
        this._viewModelInstanceValue.argb(a, r, g, b);
    };
    // Value 0 to 255
    ViewModelInstanceColor.prototype.alpha = function (a) {
        this._viewModelInstanceValue.alpha(a);
    };
    // Value 0 to 1
    ViewModelInstanceColor.prototype.opacity = function (o) {
        this._viewModelInstanceValue.alpha(Math.round(Math.max(0, Math.min(1, o)) * 255));
    };
    ViewModelInstanceColor.prototype.internalHandleCallback = function (callback) {
        callback(this.value);
    };
    return ViewModelInstanceColor;
}(ViewModelInstanceValue));

var ViewModelInstanceAssetImage = /** @class */ (function (_super) {
    __extends(ViewModelInstanceAssetImage, _super);
    function ViewModelInstanceAssetImage(instance, root) {
        return _super.call(this, instance, root) || this;
    }
    Object.defineProperty(ViewModelInstanceAssetImage.prototype, "value", {
        set: function (image) {
            var _a;
            this._viewModelInstanceValue.value((_a = image === null || image === void 0 ? void 0 : image.nativeImage) !== null && _a !== void 0 ? _a : null);
        },
        enumerable: false,
        configurable: true
    });
    ViewModelInstanceAssetImage.prototype.internalHandleCallback = function (callback) {
        callback();
    };
    return ViewModelInstanceAssetImage;
}(ViewModelInstanceValue));

var ViewModelInstanceArtboard = /** @class */ (function (_super) {
    __extends(ViewModelInstanceArtboard, _super);
    function ViewModelInstanceArtboard(instance, root) {
        return _super.call(this, instance, root) || this;
    }
    Object.defineProperty(ViewModelInstanceArtboard.prototype, "value", {
        set: function (artboard) {
            var _a, _b;
            var bindableArtboard;
            if (artboard.isBindableArtboard) {
                bindableArtboard = artboard;
            }
            else {
                bindableArtboard = artboard.file.internalBindableArtboardFromArtboard(artboard.nativeArtboard);
            }
            this._viewModelInstanceValue.value((_a = bindableArtboard === null || bindableArtboard === void 0 ? void 0 : bindableArtboard.nativeArtboard) !== null && _a !== void 0 ? _a : null);
            if (bindableArtboard === null || bindableArtboard === void 0 ? void 0 : bindableArtboard.nativeViewModel) {
                this._viewModelInstanceValue.viewModelInstance((_b = bindableArtboard === null || bindableArtboard === void 0 ? void 0 : bindableArtboard.nativeViewModel) !== null && _b !== void 0 ? _b : null);
            }
        },
        enumerable: false,
        configurable: true
    });
    ViewModelInstanceArtboard.prototype.internalHandleCallback = function (callback) {
        callback();
    };
    return ViewModelInstanceArtboard;
}(ViewModelInstanceValue));

// Loads Rive data from a URI via fetch.
var loadRiveFile = function (src) { return __awaiter(void 0, void 0, void 0, function () {
    var req, res, buffer;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                req = new Request(src);
                return [4 /*yield*/, fetch(req)];
            case 1:
                res = _a.sent();
                if (!res.ok) {
                    throw new Error("Failed to fetch the Rive file: HTTP ".concat(res.status));
                }
                return [4 /*yield*/, res.arrayBuffer()];
            case 2:
                buffer = _a.sent();
                return [2 /*return*/, buffer];
        }
    });
}); };
// #endregion
// #region utility functions
/*
 * Utility function to ensure an object is a string array
 */
var mapToStringArray = function (obj) {
    if (typeof obj === "string") {
        return [obj];
    }
    else if (obj instanceof Array) {
        return obj;
    }
    // If obj is undefined, return empty array
    return [];
};
// #endregion
// #region testing utilities
// Exports to only be used for tests
var Testing = {
    EventManager: EventManager,
    TaskQueueManager: TaskQueueManager,
};
// #endregion
// #region asset loaders
/**
 * Decodes bytes into an audio asset.
 *
 * Be sure to call `.unref()` on the audio once it is no longer needed. This
 * allows the engine to clean it up when it is not used by any more animations.
 */
var decodeAudio = function (bytes) { return __awaiter(void 0, void 0, void 0, function () {
    var decodedPromise, audio, audioWrapper;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                decodedPromise = new Promise(function (resolve) {
                    return _runtimeLoader__WEBPACK_IMPORTED_MODULE_1__.RuntimeLoader.getInstance(function (rive) {
                        rive.decodeAudio(bytes, resolve);
                    });
                });
                return [4 /*yield*/, decodedPromise];
            case 1:
                audio = _a.sent();
                audioWrapper = new _utils__WEBPACK_IMPORTED_MODULE_2__.AudioWrapper(audio);
                _utils__WEBPACK_IMPORTED_MODULE_2__.finalizationRegistry.register(audioWrapper, audio);
                return [2 /*return*/, audioWrapper];
        }
    });
}); };
/**
 * Decodes bytes into an image.
 *
 * Be sure to call `.unref()` on the image once it is no longer needed. This
 * allows the engine to clean it up when it is not used by any more animations.
 */
var decodeImage = function (bytes) { return __awaiter(void 0, void 0, void 0, function () {
    var decodedPromise, image, imageWrapper;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                decodedPromise = new Promise(function (resolve) {
                    return _runtimeLoader__WEBPACK_IMPORTED_MODULE_1__.RuntimeLoader.getInstance(function (rive) {
                        rive.decodeImage(bytes, resolve);
                    });
                });
                return [4 /*yield*/, decodedPromise];
            case 1:
                image = _a.sent();
                imageWrapper = new _utils__WEBPACK_IMPORTED_MODULE_2__.ImageWrapper(image);
                _utils__WEBPACK_IMPORTED_MODULE_2__.finalizationRegistry.register(imageWrapper, image);
                return [2 /*return*/, imageWrapper];
        }
    });
}); };
/**
 * Decodes bytes into a font.
 *
 * Be sure to call `.unref()` on the font once it is no longer needed. This
 * allows the engine to clean it up when it is not used by any more animations.
 */
var decodeFont = function (bytes) { return __awaiter(void 0, void 0, void 0, function () {
    var decodedPromise, font, fontWrapper;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                decodedPromise = new Promise(function (resolve) {
                    return _runtimeLoader__WEBPACK_IMPORTED_MODULE_1__.RuntimeLoader.getInstance(function (rive) {
                        rive.decodeFont(bytes, resolve);
                    });
                });
                return [4 /*yield*/, decodedPromise];
            case 1:
                font = _a.sent();
                fontWrapper = new _utils__WEBPACK_IMPORTED_MODULE_2__.FontWrapper(font);
                _utils__WEBPACK_IMPORTED_MODULE_2__.finalizationRegistry.register(fontWrapper, font);
                return [2 /*return*/, fontWrapper];
        }
    });
}); };
// #endregion

})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});