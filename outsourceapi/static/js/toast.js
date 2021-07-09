var zwsoft = (function(document, undefined) {
	var readyRE = /complete|loaded|interactive/;
	var idSelectorRE = /^#([\w-]+)$/;
	var classSelectorRE = /^\.([\w-]+)$/;
	var tagSelectorRE = /^[\w-]+$/;
	var translateRE = /translate(?:3d)?\((.+?)\)/;
	var translateMatrixRE = /matrix(3d)?\((.+?)\)/;

	var zw = function(selector, context) {
		context = context || document;
		if (!selector)
			return wrap();
		if (typeof selector === 'object')
			if (zw.isArrayLike(selector)) {
				return wrap(zw.slice.call(selector), null);
			} else {
				return wrap([selector], null);
			}
		if (typeof selector === 'function')
			return zw.ready(selector);
		if (typeof selector === 'string') {
			try {
				selector = selector.trim();
				if (idSelectorRE.test(selector)) {
					var found = document.getElementById(RegExp.$1);
					return wrap(found ? [found] : []);
				}
				return wrap(zw.qsa(selector, context), selector);
			} catch (e) {}
		}
		return wrap();
	};

	var wrap = function(dom, selector) {
		dom = dom || [];
		Object.setPrototypeOf(dom, zw.fn);
		dom.selector = selector || '';
		return dom;
	};

	zw.uuid = 0;

	zw.data = {};
	/**
	 * extend(simple)
	 * @param {type} target
	 * @param {type} source
	 * @param {type} deep
	 * @returns {unresolved}
	 */
	zw.extend = function() { //from jquery2
		var options, name, src, copy, copyIsArray, clone,
			target = arguments[0] || {},
			i = 1,
			length = arguments.length,
			deep = false;

		if (typeof target === "boolean") {
			deep = target;

			target = arguments[i] || {};
			i++;
		}

		if (typeof target !== "object" && !zw.isFunction(target)) {
			target = {};
		}

		if (i === length) {
			target = this;
			i--;
		}

		for (; i < length; i++) {
			if ((options = arguments[i]) != null) {
				for (name in options) {
					src = target[name];
					copy = options[name];

					if (target === copy) {
						continue;
					}

					if (deep && copy && (zw.isPlainObject(copy) || (copyIsArray = zw.isArray(copy)))) {
						if (copyIsArray) {
							copyIsArray = false;
							clone = src && zw.isArray(src) ? src : [];

						} else {
							clone = src && zw.isPlainObject(src) ? src : {};
						}

						target[name] = zw.extend(deep, clone, copy);

					} else if (copy !== undefined) {
						target[name] = copy;
					}
				}
			}
		}

		return target;
	};
	/**
	 * zwsoft noop(function)
	 */
	zw.noop = function() {};
	/**
	 * zwsoft slice(array)
	 */
	zw.slice = [].slice;
	/**
	 * zwsoft filter(array)
	 */
	zw.filter = [].filter;

	zw.type = function(obj) {
		return obj == null ? String(obj) : class2type[{}.toString.call(obj)] || "object";
	};
	/**
	 * zwsoft isArray
	 */
	zw.isArray = Array.isArray ||
		function(object) {
			return object instanceof Array;
		};
	/**
	 * zwsoft isArrayLike 
	 * @param {Object} obj
	 */
	zw.isArrayLike = function(obj) {
		var length = !!obj && "length" in obj && obj.length;
		var type = zw.type(obj);
		if (type === "function" || zw.isWindow(obj)) {
			return false;
		}
		return type === "array" || length === 0 ||
			typeof length === "number" && length > 0 && (length - 1) in obj;
	};
	/**
	 * zwsoft isWindow(需考虑obj为undefined的情况)
	 */
	zw.isWindow = function(obj) {
		return obj != null && obj === obj.window;
	};
	/**
	 * zwsoft isObject
	 */
	zw.isObject = function(obj) {
		return zw.type(obj) === "object";
	};
	/**
	 * zwsoft isPlainObject
	 */
	zw.isPlainObject = function(obj) {
		return zw.isObject(obj) && !zw.isWindow(obj) && Object.getPrototypeOf(obj) === Object.prototype;
	};
	/**
	 * zwsoft isEmptyObject
	 * @param {Object} o
	 */
	zw.isEmptyObject = function(o) {
		for (var p in o) {
			if (p !== undefined) {
				return false;
			}
		}
		return true;
	};
	/**
	 * zwsoft isFunction
	 */
	zw.isFunction = function(value) {
		return zw.type(value) === "function";
	};
	/**
	 * zwsoft querySelectorAll
	 * @param {type} selector
	 * @param {type} context
	 * @returns {Array}
	 */
	zw.qsa = function(selector, context) {
		context = context || document;
		return zw.slice.call(classSelectorRE.test(selector) ? context.getElementsByClassName(RegExp.$1) : tagSelectorRE.test(selector) ? context.getElementsByTagName(selector) : context.querySelectorAll(selector));
	};
	/**
	 * ready(DOMContentLoaded)
	 * @param {type} callback
	 * @returns {_L6.zw}
	 */
	zw.ready = function(callback) {
		if (readyRE.test(document.readyState)) {
			callback(zw);
		} else {
			document.addEventListener('DOMContentLoaded', function() {
				callback(zw);
			}, false);
		}
		return this;
	};
	/**
	 * 将 fn 缓存一段时间后, 再被调用执行
	 * 此方法为了避免在 ms 段时间内, 执行 fn 多次. 常用于 resize , scroll , mousemove 等连续性事件中;
	 * 当 ms 设置为 -1, 表示立即执行 fn, 即和直接调用 fn 一样;
	 * 调用返回函数的 stop 停止最后一次的 buffer 效果
	 * @param {Object} fn
	 * @param {Object} ms
	 * @param {Object} context
	 */
	zw.buffer = function(fn, ms, context) {
		var timer;
		var lastStart = 0;
		var lastEnd = 0;
		var ms = ms || 150;

		function run() {
			if (timer) {
				timer.cancel();
				timer = 0;
			}
			lastStart = zw.now();
			fn.apply(context || this, arguments);
			lastEnd = zw.now();
		}

		return zw.extend(function() {
			if (
				(!lastStart) || // 从未运行过
				(lastEnd >= lastStart && zw.now() - lastEnd > ms) || // 上次运行成功后已经超过ms毫秒
				(lastEnd < lastStart && zw.now() - lastStart > ms * 8) // 上次运行或未完成，后8*ms毫秒
			) {
				run.apply(this, arguments);
			} else {
				if (timer) {
					timer.cancel();
				}
				timer = zw.later(run, ms, null, zw.slice.call(arguments));
			}
		}, {
			stop: function() {
				if (timer) {
					timer.cancel();
					timer = 0;
				}
			}
		});
	};
	/**
	 * each
	 * @param {type} elements
	 * @param {type} callback
	 * @returns {_L8.zw}
	 */
	zw.each = function(elements, callback, hasOwnProperty) {
		if (!elements) {
			return this;
		}
		if (typeof elements.length === 'number') {
			[].every.call(elements, function(el, idx) {
				return callback.call(el, idx, el) !== false;
			});
		} else {
			for (var key in elements) {
				if (hasOwnProperty) {
					if (elements.hasOwnProperty(key)) {
						if (callback.call(elements[key], key, elements[key]) === false) return elements;
					}
				} else {
					if (callback.call(elements[key], key, elements[key]) === false) return elements;
				}
			}
		}
		return this;
	};
	zw.focus = function(element) {
		if (zw.os.ios) {
			setTimeout(function() {
				element.focus();
			}, 10);
		} else {
			element.focus();
		}
	};
	/**
	 * trigger event
	 * @param {type} element
	 * @param {type} eventType
	 * @param {type} eventData
	 * @returns {_L8.zw}
	 */
	zw.trigger = function(element, eventType, eventData) {
		element.dispatchEvent(new CustomEvent(eventType, {
			detail: eventData,
			bubbles: true,
			cancelable: true
		}));
		return this;
	};
	/**
	 * getStyles
	 * @param {type} element
	 * @param {type} property
	 * @returns {styles}
	 */
	zw.getStyles = function(element, property) {
		var styles = element.ownerDocument.defaultView.getComputedStyle(element, null);
		if (property) {
			return styles.getPropertyValue(property) || styles[property];
		}
		return styles;
	};
	/**
	 * parseTranslate
	 * @param {type} translateString
	 * @param {type} position
	 * @returns {Object}
	 */
	zw.parseTranslate = function(translateString, position) {
		var result = translateString.match(translateRE || '');
		if (!result || !result[1]) {
			result = ['', '0,0,0'];
		}
		result = result[1].split(",");
		result = {
			x: parseFloat(result[0]),
			y: parseFloat(result[1]),
			z: parseFloat(result[2])
		};
		if (position && result.hasOwnProperty(position)) {
			return result[position];
		}
		return result;
	};
	/**
	 * parseTranslateMatrix
	 * @param {type} translateString
	 * @param {type} position
	 * @returns {Object}
	 */
	zw.parseTranslateMatrix = function(translateString, position) {
		var matrix = translateString.match(translateMatrixRE);
		var is3D = matrix && matrix[1];
		if (matrix) {
			matrix = matrix[2].split(",");
			if (is3D === "3d")
				matrix = matrix.slice(12, 15);
			else {
				matrix.push(0);
				matrix = matrix.slice(4, 7);
			}
		} else {
			matrix = [0, 0, 0];
		}
		var result = {
			x: parseFloat(matrix[0]),
			y: parseFloat(matrix[1]),
			z: parseFloat(matrix[2])
		};
		if (position && result.hasOwnProperty(position)) {
			return result[position];
		}
		return result;
	};
	zw.hooks = {};
	zw.addAction = function(type, hook) {
		var hooks = zw.hooks[type];
		if (!hooks) {
			hooks = [];
		}
		hook.index = hook.index || 1000;
		hooks.push(hook);
		hooks.sort(function(a, b) {
			return a.index - b.index;
		});
		zw.hooks[type] = hooks;
		return zw.hooks[type];
	};
	zw.doAction = function(type, callback) {
		if (zw.isFunction(callback)) { //指定了callback
			zw.each(zw.hooks[type], callback);
		} else { //未指定callback，直接执行
			zw.each(zw.hooks[type], function(index, hook) {
				return !hook.handle();
			});
		}
	};
	/**
	 * setTimeout封装
	 * @param {Object} fn
	 * @param {Object} when
	 * @param {Object} context
	 * @param {Object} data
	 */
	zw.later = function(fn, when, context, data) {
		when = when || 0;
		var m = fn;
		var d = data;
		var f;
		var r;

		if (typeof fn === 'string') {
			m = context[fn];
		}

		f = function() {
			m.apply(context, zw.isArray(d) ? d : [d]);
		};

		r = setTimeout(f, when);

		return {
			id: r,
			cancel: function() {
				clearTimeout(r);
			}
		};
	};
	zw.now = Date.now || function() {
		return +new Date();
	};
	var class2type = {};
	zw.each(['Boolean', 'Number', 'String', 'Function', 'Array', 'Date', 'RegExp', 'Object', 'Error'], function(i, name) {
		class2type["[object " + name + "]"] = name.toLowerCase();
	});
	if (window.JSON) {
		zw.parseJSON = JSON.parse;
	}
	/**
	 * zw.fn
	 */
	zw.fn = {
		each: function(callback) {
			[].every.call(this, function(el, idx) {
				return callback.call(el, idx, el) !== false;
			});
			return this;
		}
	};

	/**
	 * 兼容 AMD 模块
	 **/
	if (typeof define === 'function' && define.amd) {
		define('zwsoft', [], function() {
			return zw;
		});
	}

	return zw;
})(document);
/**
 * zw.os.plus
 * @param {type} zw
 * @returns {undefined}
 */
(function(zw, document) {
	function detect(ua) {
		this.os = this.os || {};
		var plus = ua.match(/Html5Plus/i); //TODO 5\+Browser?
		if (plus) {
			this.os.plus = true;
			$(function() {
				document.body.classList.add('zwsoft-plus');
			});
			if (ua.match(/StreamApp/i)) { //TODO 最好有流应用自己的标识
				this.os.stream = true;
				$(function() {
					document.body.classList.add('zwsoft-plus-stream');
				});
			}
		}
	}
	detect.call(zw, navigator.userAgent);
})(zwsoft, document);
(function(zw, window) {
	var CLASS_ACTIVE = 'zwsoft-active';
	/**
	 * 自动消失提示框
	 */
	zw.toast = function(message, colorTypeclass, options) {
		var durations = {
		    'long': 3500,
		    'short': 3500
		};

		//计算显示时间
		 options = zw.extend({
	        duration: 'short'
	    }, options || {});


		if (zw.os.plus && options.type !== 'div') {
			//默认显示在底部；
			zw.plusReady(function() {
				plus.nativeUI.toast(message, {
					verticalAlign: 'bottom',
					duration:options.duration
				});
			});
		} else {
			if (typeof options.duration === 'number') {
		        duration = options.duration>0 ? options.duration:durations['short'];
		    } else {
		        duration = durations[options.duration];
		    }
		    if (!duration) {
		        duration = durations['short'];
		    }
			var toast = document.createElement('div');
			toast.classList.add('zwsoft-toast-container');
			toast.classList.add(colorTypeclass);
			toast.innerHTML = '<div class="' + 'zwsoft-toast-message' + '">' + message + '</div>';
			toast.addEventListener('webkitTransitionEnd', function() {
				if (!toast.classList.contains(CLASS_ACTIVE)) {
					toast.parentNode.removeChild(toast);
					toast = null;
				}
			});
			//点击则自动消失
			toast.addEventListener('click', function() {
		        toast.parentNode.removeChild(toast);
		        toast = null;
		    });
			document.body.appendChild(toast);
			toast.offsetHeight;
			toast.classList.add(CLASS_ACTIVE);
			setTimeout(function() {
				toast && toast.classList.remove(CLASS_ACTIVE);
			}, duration);
			
			return {
		        isVisible: function() {return !!toast;}
		    }
		}   
	};
})(zwsoft, window);
