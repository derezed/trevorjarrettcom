(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // node_modules/scrollama/build/scrollama.js
  var require_scrollama = __commonJS({
    "node_modules/scrollama/build/scrollama.js"(exports, module) {
      (function(global, factory) {
        typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory() : typeof define === "function" && define.amd ? define(factory) : global.scrollama = factory();
      })(exports, function() {
        "use strict";
        function selectAll(selector, parent) {
          if (parent === void 0)
            parent = document;
          if (typeof selector === "string") {
            return Array.from(parent.querySelectorAll(selector));
          } else if (selector instanceof Element) {
            return [selector];
          } else if (selector instanceof NodeList) {
            return Array.from(selector);
          } else if (selector instanceof Array) {
            return selector;
          }
          return [];
        }
        function getOffsetId(id) {
          return "scrollama__debug-offset--" + id;
        }
        function setupOffset(ref) {
          var id = ref.id;
          var offsetVal = ref.offsetVal;
          var stepClass = ref.stepClass;
          var el = document.createElement("div");
          el.id = getOffsetId(id);
          el.className = "scrollama__debug-offset";
          el.style.position = "fixed";
          el.style.left = "0";
          el.style.width = "100%";
          el.style.height = "0";
          el.style.borderTop = "2px dashed black";
          el.style.zIndex = "9999";
          var p = document.createElement("p");
          p.innerHTML = '".' + stepClass + '" trigger: <span>' + offsetVal + "</span>";
          p.style.fontSize = "12px";
          p.style.fontFamily = "monospace";
          p.style.color = "black";
          p.style.margin = "0";
          p.style.padding = "6px";
          el.appendChild(p);
          document.body.appendChild(el);
        }
        function setup(ref) {
          var id = ref.id;
          var offsetVal = ref.offsetVal;
          var stepEl = ref.stepEl;
          var stepClass = stepEl[0].className;
          setupOffset({ id, offsetVal, stepClass });
        }
        function update(ref) {
          var id = ref.id;
          var offsetMargin = ref.offsetMargin;
          var offsetVal = ref.offsetVal;
          var format = ref.format;
          var post = format === "pixels" ? "px" : "";
          var idVal = getOffsetId(id);
          var el = document.getElementById(idVal);
          el.style.top = offsetMargin + "px";
          el.querySelector("span").innerText = "" + offsetVal + post;
        }
        function notifyStep(ref) {
          var id = ref.id;
          var index = ref.index;
          var state = ref.state;
          var prefix = "scrollama__debug-step--" + id + "-" + index;
          var elA = document.getElementById(prefix + "_above");
          var elB = document.getElementById(prefix + "_below");
          var display = state === "enter" ? "block" : "none";
          if (elA) {
            elA.style.display = display;
          }
          if (elB) {
            elB.style.display = display;
          }
        }
        function scrollama2() {
          var OBSERVER_NAMES = [
            "stepAbove",
            "stepBelow",
            "stepProgress",
            "viewportAbove",
            "viewportBelow"
          ];
          var cb = {};
          var io = {};
          var id = null;
          var stepEl = [];
          var stepOffsetHeight = [];
          var stepOffsetTop = [];
          var stepStates = [];
          var offsetVal = 0;
          var offsetMargin = 0;
          var viewH = 0;
          var pageH = 0;
          var previousYOffset = 0;
          var progressThreshold = 0;
          var isReady = false;
          var isEnabled = false;
          var isDebug = false;
          var progressMode = false;
          var preserveOrder = false;
          var triggerOnce = false;
          var direction = "down";
          var format = "percent";
          var exclude = [];
          function err(msg) {
            console.error("scrollama error: " + msg);
          }
          function reset() {
            cb = {
              stepEnter: function() {
              },
              stepExit: function() {
              },
              stepProgress: function() {
              }
            };
            io = {};
          }
          function generateInstanceID() {
            var a = "abcdefghijklmnopqrstuv";
            var l = a.length;
            var t = Date.now();
            var r = [0, 0, 0].map(function(d) {
              return a[Math.floor(Math.random() * l)];
            }).join("");
            return "" + r + t;
          }
          function getOffsetTop(el) {
            var ref = el.getBoundingClientRect();
            var top = ref.top;
            var scrollTop = window.pageYOffset;
            var clientTop = document.body.clientTop || 0;
            return top + scrollTop - clientTop;
          }
          function getPageHeight() {
            var body = document.body;
            var html = document.documentElement;
            return Math.max(
              body.scrollHeight,
              body.offsetHeight,
              html.clientHeight,
              html.scrollHeight,
              html.offsetHeight
            );
          }
          function getIndex(element) {
            return +element.getAttribute("data-scrollama-index");
          }
          function updateDirection() {
            if (window.pageYOffset > previousYOffset) {
              direction = "down";
            } else if (window.pageYOffset < previousYOffset) {
              direction = "up";
            }
            previousYOffset = window.pageYOffset;
          }
          function disconnectObserver(name) {
            if (io[name]) {
              io[name].forEach(function(d) {
                return d.disconnect();
              });
            }
          }
          function handleResize() {
            viewH = window.innerHeight;
            pageH = getPageHeight();
            var mult = format === "pixels" ? 1 : viewH;
            offsetMargin = offsetVal * mult;
            if (isReady) {
              stepOffsetHeight = stepEl.map(function(el) {
                return el.getBoundingClientRect().height;
              });
              stepOffsetTop = stepEl.map(getOffsetTop);
              if (isEnabled) {
                updateIO();
              }
            }
            if (isDebug) {
              update({ id, offsetMargin, offsetVal, format });
            }
          }
          function handleEnable(enable) {
            if (enable && !isEnabled) {
              if (isReady) {
                updateIO();
              } else {
                err("scrollama error: enable() called before scroller was ready");
                isEnabled = false;
                return;
              }
            }
            if (!enable && isEnabled) {
              OBSERVER_NAMES.forEach(disconnectObserver);
            }
            isEnabled = enable;
          }
          function createThreshold(height) {
            var count = Math.ceil(height / progressThreshold);
            var t = [];
            var ratio = 1 / count;
            for (var i = 0; i < count; i += 1) {
              t.push(i * ratio);
            }
            return t;
          }
          function notifyStepProgress(element, progress) {
            var index = getIndex(element);
            if (progress !== void 0) {
              stepStates[index].progress = progress;
            }
            var resp = { element, index, progress: stepStates[index].progress };
            if (stepStates[index].state === "enter") {
              cb.stepProgress(resp);
            }
          }
          function notifyOthers(index, location) {
            if (location === "above") {
              for (var i = 0; i < index; i += 1) {
                var ss = stepStates[i];
                if (ss.state !== "enter" && ss.direction !== "down") {
                  notifyStepEnter(stepEl[i], "down", false);
                  notifyStepExit(stepEl[i], "down");
                } else if (ss.state === "enter") {
                  notifyStepExit(stepEl[i], "down");
                }
              }
            } else if (location === "below") {
              for (var i$1 = stepStates.length - 1; i$1 > index; i$1 -= 1) {
                var ss$1 = stepStates[i$1];
                if (ss$1.state === "enter") {
                  notifyStepExit(stepEl[i$1], "up");
                }
                if (ss$1.direction === "down") {
                  notifyStepEnter(stepEl[i$1], "up", false);
                  notifyStepExit(stepEl[i$1], "up");
                }
              }
            }
          }
          function notifyStepEnter(element, dir, check) {
            if (check === void 0)
              check = true;
            var index = getIndex(element);
            var resp = { element, index, direction: dir };
            stepStates[index].direction = dir;
            stepStates[index].state = "enter";
            if (preserveOrder && check && dir === "down") {
              notifyOthers(index, "above");
            }
            if (preserveOrder && check && dir === "up") {
              notifyOthers(index, "below");
            }
            if (cb.stepEnter && !exclude[index]) {
              cb.stepEnter(resp, stepStates);
              if (isDebug) {
                notifyStep({ id, index, state: "enter" });
              }
              if (triggerOnce) {
                exclude[index] = true;
              }
            }
            if (progressMode) {
              notifyStepProgress(element);
            }
          }
          function notifyStepExit(element, dir) {
            var index = getIndex(element);
            var resp = { element, index, direction: dir };
            if (progressMode) {
              if (dir === "down" && stepStates[index].progress < 1) {
                notifyStepProgress(element, 1);
              } else if (dir === "up" && stepStates[index].progress > 0) {
                notifyStepProgress(element, 0);
              }
            }
            stepStates[index].direction = dir;
            stepStates[index].state = "exit";
            cb.stepExit(resp, stepStates);
            if (isDebug) {
              notifyStep({ id, index, state: "exit" });
            }
          }
          function intersectStepAbove(ref) {
            var entry = ref[0];
            updateDirection();
            var isIntersecting = entry.isIntersecting;
            var boundingClientRect = entry.boundingClientRect;
            var target = entry.target;
            var top = boundingClientRect.top;
            var bottom = boundingClientRect.bottom;
            var topAdjusted = top - offsetMargin;
            var bottomAdjusted = bottom - offsetMargin;
            var index = getIndex(target);
            var ss = stepStates[index];
            if (isIntersecting && topAdjusted <= 0 && bottomAdjusted >= 0 && direction === "down" && ss.state !== "enter") {
              notifyStepEnter(target, direction);
            }
            if (!isIntersecting && topAdjusted > 0 && direction === "up" && ss.state === "enter") {
              notifyStepExit(target, direction);
            }
          }
          function intersectStepBelow(ref) {
            var entry = ref[0];
            updateDirection();
            var isIntersecting = entry.isIntersecting;
            var boundingClientRect = entry.boundingClientRect;
            var target = entry.target;
            var top = boundingClientRect.top;
            var bottom = boundingClientRect.bottom;
            var topAdjusted = top - offsetMargin;
            var bottomAdjusted = bottom - offsetMargin;
            var index = getIndex(target);
            var ss = stepStates[index];
            if (isIntersecting && topAdjusted <= 0 && bottomAdjusted >= 0 && direction === "up" && ss.state !== "enter") {
              notifyStepEnter(target, direction);
            }
            if (!isIntersecting && bottomAdjusted < 0 && direction === "down" && ss.state === "enter") {
              notifyStepExit(target, direction);
            }
          }
          function intersectViewportAbove(ref) {
            var entry = ref[0];
            updateDirection();
            var isIntersecting = entry.isIntersecting;
            var target = entry.target;
            var index = getIndex(target);
            var ss = stepStates[index];
            if (isIntersecting && direction === "down" && ss.direction !== "down" && ss.state !== "enter") {
              notifyStepEnter(target, "down");
              notifyStepExit(target, "down");
            }
          }
          function intersectViewportBelow(ref) {
            var entry = ref[0];
            updateDirection();
            var isIntersecting = entry.isIntersecting;
            var target = entry.target;
            var index = getIndex(target);
            var ss = stepStates[index];
            if (isIntersecting && direction === "up" && ss.direction === "down" && ss.state !== "enter") {
              notifyStepEnter(target, "up");
              notifyStepExit(target, "up");
            }
          }
          function intersectStepProgress(ref) {
            var entry = ref[0];
            updateDirection();
            var isIntersecting = entry.isIntersecting;
            var intersectionRatio = entry.intersectionRatio;
            var boundingClientRect = entry.boundingClientRect;
            var target = entry.target;
            var bottom = boundingClientRect.bottom;
            var bottomAdjusted = bottom - offsetMargin;
            if (isIntersecting && bottomAdjusted >= 0) {
              notifyStepProgress(target, +intersectionRatio);
            }
          }
          function updateViewportAboveIO() {
            io.viewportAbove = stepEl.map(function(el, i) {
              var marginTop = pageH - stepOffsetTop[i];
              var marginBottom = offsetMargin - viewH - stepOffsetHeight[i];
              var rootMargin = marginTop + "px 0px " + marginBottom + "px 0px";
              var options = { rootMargin };
              var obs = new IntersectionObserver(intersectViewportAbove, options);
              obs.observe(el);
              return obs;
            });
          }
          function updateViewportBelowIO() {
            io.viewportBelow = stepEl.map(function(el, i) {
              var marginTop = -offsetMargin - stepOffsetHeight[i];
              var marginBottom = offsetMargin - viewH + stepOffsetHeight[i] + pageH;
              var rootMargin = marginTop + "px 0px " + marginBottom + "px 0px";
              var options = { rootMargin };
              var obs = new IntersectionObserver(intersectViewportBelow, options);
              obs.observe(el);
              return obs;
            });
          }
          function updateStepAboveIO() {
            io.stepAbove = stepEl.map(function(el, i) {
              var marginTop = -offsetMargin + stepOffsetHeight[i];
              var marginBottom = offsetMargin - viewH;
              var rootMargin = marginTop + "px 0px " + marginBottom + "px 0px";
              var options = { rootMargin };
              var obs = new IntersectionObserver(intersectStepAbove, options);
              obs.observe(el);
              return obs;
            });
          }
          function updateStepBelowIO() {
            io.stepBelow = stepEl.map(function(el, i) {
              var marginTop = -offsetMargin;
              var marginBottom = offsetMargin - viewH + stepOffsetHeight[i];
              var rootMargin = marginTop + "px 0px " + marginBottom + "px 0px";
              var options = { rootMargin };
              var obs = new IntersectionObserver(intersectStepBelow, options);
              obs.observe(el);
              return obs;
            });
          }
          function updateStepProgressIO() {
            io.stepProgress = stepEl.map(function(el, i) {
              var marginTop = stepOffsetHeight[i] - offsetMargin;
              var marginBottom = -viewH + offsetMargin;
              var rootMargin = marginTop + "px 0px " + marginBottom + "px 0px";
              var threshold = createThreshold(stepOffsetHeight[i]);
              var options = { rootMargin, threshold };
              var obs = new IntersectionObserver(intersectStepProgress, options);
              obs.observe(el);
              return obs;
            });
          }
          function updateIO() {
            OBSERVER_NAMES.forEach(disconnectObserver);
            updateViewportAboveIO();
            updateViewportBelowIO();
            updateStepAboveIO();
            updateStepBelowIO();
            if (progressMode) {
              updateStepProgressIO();
            }
          }
          function indexSteps() {
            stepEl.forEach(function(el, i) {
              return el.setAttribute("data-scrollama-index", i);
            });
          }
          function setupStates() {
            stepStates = stepEl.map(function() {
              return {
                direction: null,
                state: null,
                progress: 0
              };
            });
          }
          function addDebug() {
            if (isDebug) {
              setup({ id, stepEl, offsetVal });
            }
          }
          function isYScrollable(element) {
            var style = window.getComputedStyle(element);
            return (style.overflowY === "scroll" || style.overflowY === "auto") && element.scrollHeight > element.clientHeight;
          }
          function anyScrollableParent(element) {
            if (element && element.nodeType === 1) {
              return isYScrollable(element) ? element : anyScrollableParent(element.parentNode);
            }
            return false;
          }
          var S = {};
          S.setup = function(ref) {
            var step = ref.step;
            var parent = ref.parent;
            var offset = ref.offset;
            if (offset === void 0)
              offset = 0.5;
            var progress = ref.progress;
            if (progress === void 0)
              progress = false;
            var threshold = ref.threshold;
            if (threshold === void 0)
              threshold = 4;
            var debug = ref.debug;
            if (debug === void 0)
              debug = false;
            var order = ref.order;
            if (order === void 0)
              order = true;
            var once = ref.once;
            if (once === void 0)
              once = false;
            reset();
            id = generateInstanceID();
            stepEl = selectAll(step, parent);
            if (!stepEl.length) {
              err("no step elements");
              return S;
            }
            var scrollableParent = stepEl.reduce(
              function(foundScrollable, s) {
                return foundScrollable || anyScrollableParent(s.parentNode);
              },
              false
            );
            if (scrollableParent) {
              console.error(
                "scrollama error: step elements cannot be children of a scrollable element. Remove any css on the parent element with overflow: scroll; or overflow: auto; on elements with fixed height.",
                scrollableParent
              );
            }
            isDebug = debug;
            progressMode = progress;
            preserveOrder = order;
            triggerOnce = once;
            S.offsetTrigger(offset);
            progressThreshold = Math.max(1, +threshold);
            isReady = true;
            addDebug();
            indexSteps();
            setupStates();
            handleResize();
            S.enable();
            return S;
          };
          S.resize = function() {
            handleResize();
            return S;
          };
          S.enable = function() {
            handleEnable(true);
            return S;
          };
          S.disable = function() {
            handleEnable(false);
            return S;
          };
          S.destroy = function() {
            handleEnable(false);
            reset();
          };
          S.offsetTrigger = function(x) {
            if (x === null) {
              return offsetVal;
            }
            if (typeof x === "number") {
              format = "percent";
              if (x > 1) {
                err("offset value is greater than 1. Fallback to 1.");
              }
              if (x < 0) {
                err("offset value is lower than 0. Fallback to 0.");
              }
              offsetVal = Math.min(Math.max(0, x), 1);
            } else if (typeof x === "string" && x.indexOf("px") > 0) {
              var v = +x.replace("px", "");
              if (!isNaN(v)) {
                format = "pixels";
                offsetVal = v;
              } else {
                err("offset value must be in 'px' format. Fallback to 0.5.");
                offsetVal = 0.5;
              }
            } else {
              err("offset value does not include 'px'. Fallback to 0.5.");
              offsetVal = 0.5;
            }
            return S;
          };
          S.onStepEnter = function(f) {
            if (typeof f === "function") {
              cb.stepEnter = f;
            } else {
              err("onStepEnter requires a function");
            }
            return S;
          };
          S.onStepExit = function(f) {
            if (typeof f === "function") {
              cb.stepExit = f;
            } else {
              err("onStepExit requires a function");
            }
            return S;
          };
          S.onStepProgress = function(f) {
            if (typeof f === "function") {
              cb.stepProgress = f;
            } else {
              err("onStepProgress requires a function");
            }
            return S;
          };
          return S;
        }
        return scrollama2;
      });
    }
  });

  // src/scripts/animations.js
  var import_scrollama = __toESM(require_scrollama());
  var Animations = class {
    constructor() {
      this.desktopNavigation = document.querySelector(".DesktopNav");
      this.mobileNavigation = document.querySelector(".MobileNav");
      this.scroller = (0, import_scrollama.default)();
      this.scroller.setup({
        step: ".step",
        debug: false,
        offset: 0.5,
        container: document.querySelector("body")
      }).onStepEnter((response) => {
        this.handleStepEnter(response);
      }).onStepExit((response) => {
        this.handleStepExit(response);
      });
      window.addEventListener("resize", this.scroller.resize);
    }
    handleNavigationStateChange(state) {
      if (state === 0) {
        this.desktopNavigation.classList.add("fadeOut");
        this.desktopNavigation.classList.remove("fadeIn");
        this.mobileNavigation.classList.remove("hidden");
        setTimeout(() => {
          this.mobileNavigation.classList.add("fadeIn");
        }, 250);
      } else {
        this.mobileNavigation.classList.remove("fadeIn");
        this.mobileNavigation.classList.add("fadeOut");
        this.desktopNavigation.classList.add("fadeIn");
        this.desktopNavigation.classList.remove("fadeOut");
        setTimeout(() => {
          this.mobileNavigation.classList.add("hidden");
        }, 250);
      }
    }
    handleStepEnter(response) {
      if (response?.element?.dataset?.step === "CartoonTJ" && response?.direction === "down") {
        this.handleNavigationStateChange(0);
      }
    }
    handleStepExit(response) {
      if (response?.element?.dataset?.step === "CartoonTJ" && response?.direction === "up") {
        this.handleNavigationStateChange(1);
      }
    }
  };

  // src/scripts/index.js
  if (document.querySelector("main")) {
    new Animations();
  }
})();
