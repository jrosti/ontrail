/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	__webpack_require__(1);

	var _rx = __webpack_require__(287);

	var _feedRouter = __webpack_require__(380);

	var _core = __webpack_require__(348);

	var _core2 = _interopRequireDefault(_core);

	var _dom = __webpack_require__(290);

	var _http = __webpack_require__(381);

	var _cycleRouter = __webpack_require__(349);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	_core2.default.run(_feedRouter.FeedRouter, {
	    HTTP: (0, _http.makeHTTPDriver)(),
	    DOM: (0, _dom.makeDOMDriver)('#content-entries'),
	    router: (0, _cycleRouter.makeRouterDriver)({ hash: true }),
	    entries$: function entries$() {
	        return _rx.Observable.of([{ "id": 1, "title": "entry 1" }, { "id": 2, "title": "entry 2" }]);
	    }
	});
	console.log("hello ontrail");

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {/* eslint max-len: 0 */

	"use strict";

	var _Object$defineProperty = __webpack_require__(2)["default"];

	__webpack_require__(5);

	__webpack_require__(281);

	// Should be removed in the next major release:

	__webpack_require__(284);

	if (global._babelPolyfill) {
	  throw new Error("only one instance of babel-polyfill is allowed");
	}
	global._babelPolyfill = true;

	function define(O, key, value) {
	  O[key] || _Object$defineProperty(O, key, {
	    writable: true,
	    configurable: true,
	    value: value
	  });
	}

	define(String.prototype, "padLeft", "".padStart);
	define(String.prototype, "padRight", "".padEnd);

	"pop,reverse,shift,keys,values,entries,indexOf,every,some,forEach,map,filter,find,findIndex,includes,join,slice,concat,push,splice,unshift,sort,lastIndexOf,reduce,reduceRight,copyWithin,fill".split(",").forEach(function (key) {
	  [][key] && define(Array, key, Function.call.bind([][key]));
	});
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	module.exports = { "default": __webpack_require__(3), __esModule: true };

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var $ = __webpack_require__(4);
	module.exports = function defineProperty(it, key, desc) {
	  return $.setDesc(it, key, desc);
	};

/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";

	var $Object = Object;
	module.exports = {
	  create: $Object.create,
	  getProto: $Object.getPrototypeOf,
	  isEnum: {}.propertyIsEnumerable,
	  getDesc: $Object.getOwnPropertyDescriptor,
	  setDesc: $Object.defineProperty,
	  setDescs: $Object.defineProperties,
	  getKeys: $Object.keys,
	  getNames: $Object.getOwnPropertyNames,
	  getSymbols: $Object.getOwnPropertySymbols,
	  each: [].forEach
	};

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	__webpack_require__(6);
	__webpack_require__(53);
	__webpack_require__(54);
	__webpack_require__(55);
	__webpack_require__(56);
	__webpack_require__(58);
	__webpack_require__(61);
	__webpack_require__(62);
	__webpack_require__(63);
	__webpack_require__(64);
	__webpack_require__(65);
	__webpack_require__(66);
	__webpack_require__(67);
	__webpack_require__(68);
	__webpack_require__(69);
	__webpack_require__(71);
	__webpack_require__(73);
	__webpack_require__(75);
	__webpack_require__(77);
	__webpack_require__(80);
	__webpack_require__(81);
	__webpack_require__(82);
	__webpack_require__(86);
	__webpack_require__(88);
	__webpack_require__(90);
	__webpack_require__(94);
	__webpack_require__(95);
	__webpack_require__(96);
	__webpack_require__(97);
	__webpack_require__(99);
	__webpack_require__(100);
	__webpack_require__(101);
	__webpack_require__(102);
	__webpack_require__(103);
	__webpack_require__(104);
	__webpack_require__(105);
	__webpack_require__(107);
	__webpack_require__(108);
	__webpack_require__(109);
	__webpack_require__(111);
	__webpack_require__(112);
	__webpack_require__(113);
	__webpack_require__(115);
	__webpack_require__(116);
	__webpack_require__(117);
	__webpack_require__(118);
	__webpack_require__(119);
	__webpack_require__(120);
	__webpack_require__(121);
	__webpack_require__(122);
	__webpack_require__(123);
	__webpack_require__(124);
	__webpack_require__(125);
	__webpack_require__(126);
	__webpack_require__(127);
	__webpack_require__(128);
	__webpack_require__(133);
	__webpack_require__(134);
	__webpack_require__(138);
	__webpack_require__(139);
	__webpack_require__(140);
	__webpack_require__(141);
	__webpack_require__(143);
	__webpack_require__(144);
	__webpack_require__(145);
	__webpack_require__(146);
	__webpack_require__(147);
	__webpack_require__(148);
	__webpack_require__(149);
	__webpack_require__(150);
	__webpack_require__(151);
	__webpack_require__(152);
	__webpack_require__(153);
	__webpack_require__(154);
	__webpack_require__(155);
	__webpack_require__(156);
	__webpack_require__(157);
	__webpack_require__(158);
	__webpack_require__(159);
	__webpack_require__(160);
	__webpack_require__(165);
	__webpack_require__(166);
	__webpack_require__(168);
	__webpack_require__(169);
	__webpack_require__(170);
	__webpack_require__(173);
	__webpack_require__(174);
	__webpack_require__(175);
	__webpack_require__(176);
	__webpack_require__(177);
	__webpack_require__(179);
	__webpack_require__(180);
	__webpack_require__(181);
	__webpack_require__(182);
	__webpack_require__(185);
	__webpack_require__(187);
	__webpack_require__(188);
	__webpack_require__(189);
	__webpack_require__(191);
	__webpack_require__(193);
	__webpack_require__(195);
	__webpack_require__(196);
	__webpack_require__(197);
	__webpack_require__(199);
	__webpack_require__(200);
	__webpack_require__(201);
	__webpack_require__(202);
	__webpack_require__(208);
	__webpack_require__(211);
	__webpack_require__(212);
	__webpack_require__(214);
	__webpack_require__(215);
	__webpack_require__(218);
	__webpack_require__(219);
	__webpack_require__(222);
	__webpack_require__(223);
	__webpack_require__(224);
	__webpack_require__(225);
	__webpack_require__(226);
	__webpack_require__(227);
	__webpack_require__(228);
	__webpack_require__(229);
	__webpack_require__(230);
	__webpack_require__(231);
	__webpack_require__(232);
	__webpack_require__(233);
	__webpack_require__(234);
	__webpack_require__(235);
	__webpack_require__(236);
	__webpack_require__(237);
	__webpack_require__(238);
	__webpack_require__(239);
	__webpack_require__(240);
	__webpack_require__(242);
	__webpack_require__(243);
	__webpack_require__(244);
	__webpack_require__(245);
	__webpack_require__(246);
	__webpack_require__(247);
	__webpack_require__(249);
	__webpack_require__(250);
	__webpack_require__(251);
	__webpack_require__(252);
	__webpack_require__(253);
	__webpack_require__(255);
	__webpack_require__(256);
	__webpack_require__(259);
	__webpack_require__(260);
	__webpack_require__(261);
	__webpack_require__(262);
	__webpack_require__(263);
	__webpack_require__(264);
	__webpack_require__(265);
	__webpack_require__(266);
	__webpack_require__(268);
	__webpack_require__(269);
	__webpack_require__(270);
	__webpack_require__(271);
	__webpack_require__(272);
	__webpack_require__(273);
	__webpack_require__(274);
	__webpack_require__(275);
	__webpack_require__(276);
	__webpack_require__(279);
	__webpack_require__(280);
	module.exports = __webpack_require__(8);

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// ECMAScript 6 symbols shim

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	var global = __webpack_require__(7),
	    core = __webpack_require__(8),
	    has = __webpack_require__(9),
	    DESCRIPTORS = __webpack_require__(10),
	    $export = __webpack_require__(12),
	    redefine = __webpack_require__(21),
	    META = __webpack_require__(25).KEY,
	    $fails = __webpack_require__(11),
	    shared = __webpack_require__(26),
	    setToStringTag = __webpack_require__(27),
	    uid = __webpack_require__(22),
	    wks = __webpack_require__(28),
	    keyOf = __webpack_require__(29),
	    enumKeys = __webpack_require__(42),
	    isArray = __webpack_require__(45),
	    anObject = __webpack_require__(15),
	    toIObject = __webpack_require__(32),
	    toPrimitive = __webpack_require__(19),
	    createDesc = __webpack_require__(20),
	    _create = __webpack_require__(46),
	    gOPNExt = __webpack_require__(49),
	    $GOPD = __webpack_require__(51),
	    $DP = __webpack_require__(14),
	    gOPD = $GOPD.f,
	    dP = $DP.f,
	    gOPN = gOPNExt.f,
	    $Symbol = global.Symbol,
	    $JSON = global.JSON,
	    _stringify = $JSON && $JSON.stringify,
	    setter = false,
	    HIDDEN = wks('_hidden'),
	    isEnum = {}.propertyIsEnumerable,
	    SymbolRegistry = shared('symbol-registry'),
	    AllSymbols = shared('symbols'),
	    ObjectProto = Object.prototype,
	    USE_NATIVE = typeof $Symbol == 'function';

	// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
	var setSymbolDesc = DESCRIPTORS && $fails(function () {
	  return _create(dP({}, 'a', {
	    get: function get() {
	      return dP(this, 'a', { value: 7 }).a;
	    }
	  })).a != 7;
	}) ? function (it, key, D) {
	  var protoDesc = gOPD(ObjectProto, key);
	  if (protoDesc) delete ObjectProto[key];
	  dP(it, key, D);
	  if (protoDesc && it !== ObjectProto) dP(ObjectProto, key, protoDesc);
	} : dP;

	var wrap = function wrap(tag) {
	  var sym = AllSymbols[tag] = _create($Symbol.prototype);
	  sym._k = tag;
	  DESCRIPTORS && setter && setSymbolDesc(ObjectProto, tag, {
	    configurable: true,
	    set: function set(value) {
	      if (has(this, HIDDEN) && has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
	      setSymbolDesc(this, tag, createDesc(1, value));
	    }
	  });
	  return sym;
	};

	var isSymbol = function isSymbol(it) {
	  return (typeof it === 'undefined' ? 'undefined' : _typeof(it)) == 'symbol';
	};

	var $defineProperty = function defineProperty(it, key, D) {
	  anObject(it);
	  key = toPrimitive(key, true);
	  anObject(D);
	  if (has(AllSymbols, key)) {
	    if (!D.enumerable) {
	      if (!has(it, HIDDEN)) dP(it, HIDDEN, createDesc(1, {}));
	      it[HIDDEN][key] = true;
	    } else {
	      if (has(it, HIDDEN) && it[HIDDEN][key]) it[HIDDEN][key] = false;
	      D = _create(D, { enumerable: createDesc(0, false) });
	    }return setSymbolDesc(it, key, D);
	  }return dP(it, key, D);
	};
	var $defineProperties = function defineProperties(it, P) {
	  anObject(it);
	  var keys = enumKeys(P = toIObject(P)),
	      i = 0,
	      l = keys.length,
	      key;
	  while (l > i) {
	    $defineProperty(it, key = keys[i++], P[key]);
	  }return it;
	};
	var $create = function create(it, P) {
	  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
	};
	var $propertyIsEnumerable = function propertyIsEnumerable(key) {
	  var E = isEnum.call(this, key = toPrimitive(key, true));
	  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
	};
	var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key) {
	  var D = gOPD(it = toIObject(it), key = toPrimitive(key, true));
	  if (D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key])) D.enumerable = true;
	  return D;
	};
	var $getOwnPropertyNames = function getOwnPropertyNames(it) {
	  var names = gOPN(toIObject(it)),
	      result = [],
	      i = 0,
	      key;
	  while (names.length > i) {
	    if (!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META) result.push(key);
	  }return result;
	};
	var $getOwnPropertySymbols = function getOwnPropertySymbols(it) {
	  var names = gOPN(toIObject(it)),
	      result = [],
	      i = 0,
	      key;
	  while (names.length > i) {
	    if (has(AllSymbols, key = names[i++])) result.push(AllSymbols[key]);
	  }return result;
	};
	var $stringify = function stringify(it) {
	  if (it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
	  var args = [it],
	      i = 1,
	      replacer,
	      $replacer;
	  while (arguments.length > i) {
	    args.push(arguments[i++]);
	  }replacer = args[1];
	  if (typeof replacer == 'function') $replacer = replacer;
	  if ($replacer || !isArray(replacer)) replacer = function replacer(key, value) {
	    if ($replacer) value = $replacer.call(this, key, value);
	    if (!isSymbol(value)) return value;
	  };
	  args[1] = replacer;
	  return _stringify.apply($JSON, args);
	};
	var BUGGY_JSON = $fails(function () {
	  var S = $Symbol();
	  // MS Edge converts symbol values to JSON as {}
	  // WebKit converts symbol values to JSON as null
	  // V8 throws on boxed symbols
	  return _stringify([S]) != '[null]' || _stringify({ a: S }) != '{}' || _stringify(Object(S)) != '{}';
	});

	// 19.4.1.1 Symbol([description])
	if (!USE_NATIVE) {
	  $Symbol = function _Symbol() {
	    if (isSymbol(this)) throw TypeError('Symbol is not a constructor');
	    return wrap(uid(arguments.length > 0 ? arguments[0] : undefined));
	  };
	  redefine($Symbol.prototype, 'toString', function toString() {
	    return this._k;
	  });

	  isSymbol = function isSymbol(it) {
	    return it instanceof $Symbol;
	  };

	  $GOPD.f = $getOwnPropertyDescriptor;
	  $DP.f = $defineProperty;
	  __webpack_require__(50).f = gOPNExt.f = $getOwnPropertyNames;
	  __webpack_require__(44).f = $propertyIsEnumerable;
	  __webpack_require__(43).f = $getOwnPropertySymbols;

	  if (DESCRIPTORS && !__webpack_require__(52)) {
	    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
	  }
	}

	$export($export.G + $export.W + $export.F * !USE_NATIVE, { Symbol: $Symbol });

	// 19.4.2.2 Symbol.hasInstance
	// 19.4.2.3 Symbol.isConcatSpreadable
	// 19.4.2.4 Symbol.iterator
	// 19.4.2.6 Symbol.match
	// 19.4.2.8 Symbol.replace
	// 19.4.2.9 Symbol.search
	// 19.4.2.10 Symbol.species
	// 19.4.2.11 Symbol.split
	// 19.4.2.12 Symbol.toPrimitive
	// 19.4.2.13 Symbol.toStringTag
	// 19.4.2.14 Symbol.unscopables
	for (var symbols = 'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'.split(','), i = 0; symbols.length > i;) {
	  var key = symbols[i++],
	      Wrapper = core.Symbol,
	      sym = wks(key);
	  if (!(key in Wrapper)) dP(Wrapper, key, { value: USE_NATIVE ? sym : wrap(sym) });
	};

	setter = true;

	$export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
	  // 19.4.2.1 Symbol.for(key)
	  'for': function _for(key) {
	    return has(SymbolRegistry, key += '') ? SymbolRegistry[key] : SymbolRegistry[key] = $Symbol(key);
	  },
	  // 19.4.2.5 Symbol.keyFor(sym)
	  keyFor: function keyFor(key) {
	    return keyOf(SymbolRegistry, key);
	  },
	  useSetter: function useSetter() {
	    setter = true;
	  },
	  useSimple: function useSimple() {
	    setter = false;
	  }
	});

	$export($export.S + $export.F * !USE_NATIVE, 'Object', {
	  // 19.1.2.2 Object.create(O [, Properties])
	  create: $create,
	  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
	  defineProperty: $defineProperty,
	  // 19.1.2.3 Object.defineProperties(O, Properties)
	  defineProperties: $defineProperties,
	  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
	  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
	  // 19.1.2.7 Object.getOwnPropertyNames(O)
	  getOwnPropertyNames: $getOwnPropertyNames,
	  // 19.1.2.8 Object.getOwnPropertySymbols(O)
	  getOwnPropertySymbols: $getOwnPropertySymbols
	});

	// 24.3.2 JSON.stringify(value [, replacer [, space]])
	$JSON && $export($export.S + $export.F * (!USE_NATIVE || BUGGY_JSON), 'JSON', { stringify: $stringify });

	// 19.4.3.5 Symbol.prototype[@@toStringTag]
	setToStringTag($Symbol, 'Symbol');
	// 20.2.1.9 Math[@@toStringTag]
	setToStringTag(Math, 'Math', true);
	// 24.3.3 JSON[@@toStringTag]
	setToStringTag(global.JSON, 'JSON', true);

/***/ },
/* 7 */
/***/ function(module, exports) {

	'use strict';

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global = module.exports = typeof window != 'undefined' && window.Math == Math ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
	if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef

/***/ },
/* 8 */
/***/ function(module, exports) {

	'use strict';

	var core = module.exports = { version: '2.1.3' };
	if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef

/***/ },
/* 9 */
/***/ function(module, exports) {

	"use strict";

	var hasOwnProperty = {}.hasOwnProperty;
	module.exports = function (it, key) {
	  return hasOwnProperty.call(it, key);
	};

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// Thank's IE8 for his funny defineProperty
	module.exports = !__webpack_require__(11)(function () {
	  return Object.defineProperty({}, 'a', { get: function get() {
	      return 7;
	    } }).a != 7;
	});

/***/ },
/* 11 */
/***/ function(module, exports) {

	"use strict";

	module.exports = function (exec) {
	  try {
	    return !!exec();
	  } catch (e) {
	    return true;
	  }
	};

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var global = __webpack_require__(7),
	    core = __webpack_require__(8),
	    hide = __webpack_require__(13),
	    redefine = __webpack_require__(21),
	    ctx = __webpack_require__(23),
	    PROTOTYPE = 'prototype';

	var $export = function $export(type, name, source) {
	  var IS_FORCED = type & $export.F,
	      IS_GLOBAL = type & $export.G,
	      IS_STATIC = type & $export.S,
	      IS_PROTO = type & $export.P,
	      IS_BIND = type & $export.B,
	      target = IS_GLOBAL ? global : IS_STATIC ? global[name] || (global[name] = {}) : (global[name] || {})[PROTOTYPE],
	      exports = IS_GLOBAL ? core : core[name] || (core[name] = {}),
	      expProto = exports[PROTOTYPE] || (exports[PROTOTYPE] = {}),
	      key,
	      own,
	      out,
	      exp;
	  if (IS_GLOBAL) source = name;
	  for (key in source) {
	    // contains in native
	    own = !IS_FORCED && target && target[key] !== undefined;
	    // export native or passed
	    out = (own ? target : source)[key];
	    // bind timers to global for call from export context
	    exp = IS_BIND && own ? ctx(out, global) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
	    // extend global
	    if (target) redefine(target, key, out, type & $export.U);
	    // export
	    if (exports[key] != out) hide(exports, key, exp);
	    if (IS_PROTO && expProto[key] != out) expProto[key] = out;
	  }
	};
	global.core = core;
	// type bitmap
	$export.F = 1; // forced
	$export.G = 2; // global
	$export.S = 4; // static
	$export.P = 8; // proto
	$export.B = 16; // bind
	$export.W = 32; // wrap
	$export.U = 64; // safe
	$export.R = 128; // real proto method for `library`
	module.exports = $export;

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var dP = __webpack_require__(14),
	    createDesc = __webpack_require__(20);
	module.exports = __webpack_require__(10) ? function (object, key, value) {
	  return dP.f(object, key, createDesc(1, value));
	} : function (object, key, value) {
	  object[key] = value;
	  return object;
	};

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var anObject = __webpack_require__(15),
	    IE8_DOM_DEFINE = __webpack_require__(17),
	    toPrimitive = __webpack_require__(19),
	    dP = Object.defineProperty;

	exports.f = __webpack_require__(10) ? Object.defineProperty : function defineProperty(O, P, Attributes) {
	  anObject(O);
	  P = toPrimitive(P, true);
	  anObject(Attributes);
	  if (IE8_DOM_DEFINE) try {
	    return dP(O, P, Attributes);
	  } catch (e) {/* empty */}
	  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
	  if ('value' in Attributes) O[P] = Attributes.value;
	  return O;
	};

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var isObject = __webpack_require__(16);
	module.exports = function (it) {
	  if (!isObject(it)) throw TypeError(it + ' is not an object!');
	  return it;
	};

/***/ },
/* 16 */
/***/ function(module, exports) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	module.exports = function (it) {
	  return (typeof it === 'undefined' ? 'undefined' : _typeof(it)) === 'object' ? it !== null : typeof it === 'function';
	};

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = !__webpack_require__(10) && !__webpack_require__(11)(function () {
	  return Object.defineProperty(__webpack_require__(18)('div'), 'a', { get: function get() {
	      return 7;
	    } }).a != 7;
	});

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var isObject = __webpack_require__(16),
	    document = __webpack_require__(7).document
	// in old IE typeof document.createElement is 'object'
	,
	    is = isObject(document) && isObject(document.createElement);
	module.exports = function (it) {
	  return is ? document.createElement(it) : {};
	};

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// 7.1.1 ToPrimitive(input [, PreferredType])
	var isObject = __webpack_require__(16);
	// instead of the ES6 spec version, we didn't implement @@toPrimitive case
	// and the second argument - flag - preferred type is a string
	module.exports = function (it, S) {
	  if (!isObject(it)) return it;
	  var fn, val;
	  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
	  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
	  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
	  throw TypeError("Can't convert object to primitive value");
	};

/***/ },
/* 20 */
/***/ function(module, exports) {

	"use strict";

	module.exports = function (bitmap, value) {
	  return {
	    enumerable: !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable: !(bitmap & 4),
	    value: value
	  };
	};

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var global = __webpack_require__(7),
	    hide = __webpack_require__(13),
	    has = __webpack_require__(9),
	    SRC = __webpack_require__(22)('src'),
	    TO_STRING = 'toString',
	    $toString = Function[TO_STRING],
	    TPL = ('' + $toString).split(TO_STRING);

	__webpack_require__(8).inspectSource = function (it) {
	  return $toString.call(it);
	};

	(module.exports = function (O, key, val, safe) {
	  var isFunction = typeof val == 'function';
	  if (isFunction) has(val, 'name') || hide(val, 'name', key);
	  if (O[key] === val) return;
	  if (isFunction) has(val, SRC) || hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
	  if (O === global) {
	    O[key] = val;
	  } else {
	    if (!safe) {
	      delete O[key];
	      hide(O, key, val);
	    } else {
	      if (O[key]) O[key] = val;else hide(O, key, val);
	    }
	  }
	  // add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
	})(Function.prototype, TO_STRING, function toString() {
	  return typeof this == 'function' && this[SRC] || $toString.call(this);
	});

/***/ },
/* 22 */
/***/ function(module, exports) {

	'use strict';

	var id = 0,
	    px = Math.random();
	module.exports = function (key) {
	  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
	};

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// optional / simple context binding
	var aFunction = __webpack_require__(24);
	module.exports = function (fn, that, length) {
	  aFunction(fn);
	  if (that === undefined) return fn;
	  switch (length) {
	    case 1:
	      return function (a) {
	        return fn.call(that, a);
	      };
	    case 2:
	      return function (a, b) {
	        return fn.call(that, a, b);
	      };
	    case 3:
	      return function (a, b, c) {
	        return fn.call(that, a, b, c);
	      };
	  }
	  return function () /* ...args */{
	    return fn.apply(that, arguments);
	  };
	};

/***/ },
/* 24 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function (it) {
	  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
	  return it;
	};

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	var META = __webpack_require__(22)('meta'),
	    isObject = __webpack_require__(16),
	    has = __webpack_require__(9),
	    setDesc = __webpack_require__(14).f,
	    id = 0;
	var isExtensible = Object.isExtensible || function () {
	  return true;
	};
	var FREEZE = !__webpack_require__(11)(function () {
	  return isExtensible(Object.preventExtensions({}));
	});
	var setMeta = function setMeta(it) {
	  setDesc(it, META, { value: {
	      i: 'O' + ++id, // object ID
	      w: {} // weak collections IDs
	    } });
	};
	var fastKey = function fastKey(it, create) {
	  // return primitive with prefix
	  if (!isObject(it)) return (typeof it === 'undefined' ? 'undefined' : _typeof(it)) == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
	  if (!has(it, META)) {
	    // can't set metadata to uncaught frozen object
	    if (!isExtensible(it)) return 'F';
	    // not necessary to add metadata
	    if (!create) return 'E';
	    // add missing metadata
	    setMeta(it);
	    // return object ID
	  }return it[META].i;
	};
	var getWeak = function getWeak(it, create) {
	  if (!has(it, META)) {
	    // can't set metadata to uncaught frozen object
	    if (!isExtensible(it)) return true;
	    // not necessary to add metadata
	    if (!create) return false;
	    // add missing metadata
	    setMeta(it);
	    // return hash weak collections IDs
	  }return it[META].w;
	};
	// add metadata on freeze-family methods calling
	var onFreeze = function onFreeze(it) {
	  if (FREEZE && meta.NEED && isExtensible(it) && !has(it, META)) setMeta(it);
	  return it;
	};
	var meta = module.exports = {
	  KEY: META,
	  NEED: false,
	  fastKey: fastKey,
	  getWeak: getWeak,
	  onFreeze: onFreeze
	};

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var global = __webpack_require__(7),
	    SHARED = '__core-js_shared__',
	    store = global[SHARED] || (global[SHARED] = {});
	module.exports = function (key) {
	  return store[key] || (store[key] = {});
	};

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var def = __webpack_require__(14).f,
	    has = __webpack_require__(9),
	    TAG = __webpack_require__(28)('toStringTag');

	module.exports = function (it, tag, stat) {
	  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
	};

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var store = __webpack_require__(26)('wks'),
	    uid = __webpack_require__(22),
	    _Symbol = __webpack_require__(7).Symbol,
	    USE_SYMBOL = typeof _Symbol == 'function';
	module.exports = function (name) {
	  return store[name] || (store[name] = USE_SYMBOL && _Symbol[name] || (USE_SYMBOL ? _Symbol : uid)('Symbol.' + name));
	};

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var getKeys = __webpack_require__(30),
	    toIObject = __webpack_require__(32);
	module.exports = function (object, el) {
	  var O = toIObject(object),
	      keys = getKeys(O),
	      length = keys.length,
	      index = 0,
	      key;
	  while (length > index) {
	    if (O[key = keys[index++]] === el) return key;
	  }
	};

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// 19.1.2.14 / 15.2.3.14 Object.keys(O)
	var $keys = __webpack_require__(31),
	    enumBugKeys = __webpack_require__(41);

	module.exports = Object.keys || function keys(O) {
	  return $keys(O, enumBugKeys);
	};

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var has = __webpack_require__(9),
	    toIObject = __webpack_require__(32),
	    arrayIndexOf = __webpack_require__(36)(false),
	    IE_PROTO = __webpack_require__(40)('IE_PROTO');

	module.exports = function (object, names) {
	  var O = toIObject(object),
	      i = 0,
	      result = [],
	      key;
	  for (key in O) {
	    if (key != IE_PROTO) has(O, key) && result.push(key);
	  } // Don't enum bug & hidden keys
	  while (names.length > i) {
	    if (has(O, key = names[i++])) {
	      ~arrayIndexOf(result, key) || result.push(key);
	    }
	  }return result;
	};

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// to indexed object, toObject with fallback for non-array-like ES3 strings
	var IObject = __webpack_require__(33),
	    defined = __webpack_require__(35);
	module.exports = function (it) {
	  return IObject(defined(it));
	};

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	var cof = __webpack_require__(34);
	module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
	  return cof(it) == 'String' ? it.split('') : Object(it);
	};

/***/ },
/* 34 */
/***/ function(module, exports) {

	"use strict";

	var toString = {}.toString;

	module.exports = function (it) {
	  return toString.call(it).slice(8, -1);
	};

/***/ },
/* 35 */
/***/ function(module, exports) {

	"use strict";

	// 7.2.1 RequireObjectCoercible(argument)
	module.exports = function (it) {
	  if (it == undefined) throw TypeError("Can't call method on  " + it);
	  return it;
	};

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// false -> Array#indexOf
	// true  -> Array#includes
	var toIObject = __webpack_require__(32),
	    toLength = __webpack_require__(37),
	    toIndex = __webpack_require__(39);
	module.exports = function (IS_INCLUDES) {
	  return function ($this, el, fromIndex) {
	    var O = toIObject($this),
	        length = toLength(O.length),
	        index = toIndex(fromIndex, length),
	        value;
	    // Array#includes uses SameValueZero equality algorithm
	    if (IS_INCLUDES && el != el) while (length > index) {
	      value = O[index++];
	      if (value != value) return true;
	      // Array#toIndex ignores holes, Array#includes - not
	    } else for (; length > index; index++) {
	        if (IS_INCLUDES || index in O) {
	          if (O[index] === el) return IS_INCLUDES || index;
	        }
	      }return !IS_INCLUDES && -1;
	  };
	};

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// 7.1.15 ToLength
	var toInteger = __webpack_require__(38),
	    min = Math.min;
	module.exports = function (it) {
	  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
	};

/***/ },
/* 38 */
/***/ function(module, exports) {

	"use strict";

	// 7.1.4 ToInteger
	var ceil = Math.ceil,
	    floor = Math.floor;
	module.exports = function (it) {
	  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
	};

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var toInteger = __webpack_require__(38),
	    max = Math.max,
	    min = Math.min;
	module.exports = function (index, length) {
	  index = toInteger(index);
	  return index < 0 ? max(index + length, 0) : min(index, length);
	};

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var shared = __webpack_require__(26)('keys'),
	    uid = __webpack_require__(22);
	module.exports = function (key) {
	  return shared[key] || (shared[key] = uid(key));
	};

/***/ },
/* 41 */
/***/ function(module, exports) {

	'use strict';

	// IE 8- don't enum bug keys
	module.exports = 'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'.split(',');

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// all enumerable object keys, includes symbols
	var getKeys = __webpack_require__(30),
	    gOPS = __webpack_require__(43),
	    pIE = __webpack_require__(44);
	module.exports = function (it) {
	  var result = getKeys(it),
	      getSymbols = gOPS.f;
	  if (getSymbols) {
	    var symbols = getSymbols(it),
	        isEnum = pIE.f,
	        i = 0,
	        key;
	    while (symbols.length > i) {
	      if (isEnum.call(it, key = symbols[i++])) result.push(key);
	    }
	  }return result;
	};

/***/ },
/* 43 */
/***/ function(module, exports) {

	"use strict";

	exports.f = Object.getOwnPropertySymbols;

/***/ },
/* 44 */
/***/ function(module, exports) {

	"use strict";

	exports.f = {}.propertyIsEnumerable;

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// 7.2.2 IsArray(argument)
	var cof = __webpack_require__(34);
	module.exports = Array.isArray || function isArray(arg) {
	  return cof(arg) == 'Array';
	};

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
	var anObject = __webpack_require__(15),
	    dPs = __webpack_require__(47),
	    enumBugKeys = __webpack_require__(41),
	    IE_PROTO = __webpack_require__(40)('IE_PROTO'),
	    Empty = function Empty() {/* empty */},
	    PROTOTYPE = 'prototype';

	// Create object with fake `null` prototype: use iframe Object with cleared prototype
	var _createDict = function createDict() {
	  // Thrash, waste and sodomy: IE GC bug
	  var iframe = __webpack_require__(18)('iframe'),
	      i = enumBugKeys.length,
	      gt = '>',
	      iframeDocument;
	  iframe.style.display = 'none';
	  __webpack_require__(48).appendChild(iframe);
	  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
	  // createDict = iframe.contentWindow.Object;
	  // html.removeChild(iframe);
	  iframeDocument = iframe.contentWindow.document;
	  iframeDocument.open();
	  iframeDocument.write('<script>document.F=Object</script' + gt);
	  iframeDocument.close();
	  _createDict = iframeDocument.F;
	  while (i--) {
	    delete _createDict[PROTOTYPE][enumBugKeys[i]];
	  }return _createDict();
	};

	module.exports = Object.create || function create(O, Properties) {
	  var result;
	  if (O !== null) {
	    Empty[PROTOTYPE] = anObject(O);
	    result = new Empty();
	    Empty[PROTOTYPE] = null;
	    // add "__proto__" for Object.getPrototypeOf polyfill
	    result[IE_PROTO] = O;
	  } else result = _createDict();
	  return Properties === undefined ? result : dPs(result, Properties);
	};

/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var dP = __webpack_require__(14),
	    anObject = __webpack_require__(15),
	    getKeys = __webpack_require__(30);

	module.exports = __webpack_require__(10) ? Object.defineProperties : function defineProperties(O, Properties) {
	  anObject(O);
	  var keys = getKeys(Properties),
	      length = keys.length,
	      i = 0,
	      P;
	  while (length > i) {
	    dP.f(O, P = keys[i++], Properties[P]);
	  }return O;
	};

/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(7).document && document.documentElement;

/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
	var toIObject = __webpack_require__(32),
	    gOPN = __webpack_require__(50).f,
	    toString = {}.toString;

	var windowNames = (typeof window === 'undefined' ? 'undefined' : _typeof(window)) == 'object' && window && Object.getOwnPropertyNames ? Object.getOwnPropertyNames(window) : [];

	var getWindowNames = function getWindowNames(it) {
	  try {
	    return gOPN.f(it);
	  } catch (e) {
	    return windowNames.slice();
	  }
	};

	module.exports.f = function getOwnPropertyNames(it) {
	  return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
	};

/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
	var $keys = __webpack_require__(31),
	    hiddenKeys = __webpack_require__(41).concat('length', 'prototype');

	exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
	  return $keys(O, hiddenKeys);
	};

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var pIE = __webpack_require__(44),
	    createDesc = __webpack_require__(20),
	    toIObject = __webpack_require__(32),
	    toPrimitive = __webpack_require__(19),
	    has = __webpack_require__(9),
	    IE8_DOM_DEFINE = __webpack_require__(17),
	    gOPD = Object.getOwnPropertyDescriptor;

	exports.f = __webpack_require__(10) ? gOPD : function getOwnPropertyDescriptor(O, P) {
	  O = toIObject(O);
	  P = toPrimitive(P, true);
	  if (IE8_DOM_DEFINE) try {
	    return gOPD(O, P);
	  } catch (e) {/* empty */}
	  if (has(O, P)) return createDesc(!pIE.f.call(O, P), O[P]);
	};

/***/ },
/* 52 */
/***/ function(module, exports) {

	"use strict";

	module.exports = false;

/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var $export = __webpack_require__(12);
	// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
	$export($export.S, 'Object', { create: __webpack_require__(46) });

/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var $export = __webpack_require__(12);
	// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
	$export($export.S + $export.F * !__webpack_require__(10), 'Object', { defineProperty: __webpack_require__(14).f });

/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var $export = __webpack_require__(12);
	// 19.1.2.3 / 15.2.3.7 Object.defineProperties(O, Properties)
	$export($export.S + $export.F * !__webpack_require__(10), 'Object', { defineProperties: __webpack_require__(47) });

/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
	var toIObject = __webpack_require__(32),
	    $getOwnPropertyDescriptor = __webpack_require__(51).f;

	__webpack_require__(57)('getOwnPropertyDescriptor', function () {
	  return function getOwnPropertyDescriptor(it, key) {
	    return $getOwnPropertyDescriptor(toIObject(it), key);
	  };
	});

/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// most Object methods by ES6 should accept primitives
	var $export = __webpack_require__(12),
	    core = __webpack_require__(8),
	    fails = __webpack_require__(11);
	module.exports = function (KEY, exec) {
	  var fn = (core.Object || {})[KEY] || Object[KEY],
	      exp = {};
	  exp[KEY] = exec(fn);
	  $export($export.S + $export.F * fails(function () {
	    fn(1);
	  }), 'Object', exp);
	};

/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// 19.1.2.9 Object.getPrototypeOf(O)
	var toObject = __webpack_require__(59),
	    $getPrototypeOf = __webpack_require__(60);

	__webpack_require__(57)('getPrototypeOf', function () {
	  return function getPrototypeOf(it) {
	    return $getPrototypeOf(toObject(it));
	  };
	});

/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// 7.1.13 ToObject(argument)
	var defined = __webpack_require__(35);
	module.exports = function (it) {
	  return Object(defined(it));
	};

/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
	var has = __webpack_require__(9),
	    toObject = __webpack_require__(59),
	    IE_PROTO = __webpack_require__(40)('IE_PROTO'),
	    ObjectProto = Object.prototype;

	module.exports = Object.getPrototypeOf || function (O) {
	  O = toObject(O);
	  if (has(O, IE_PROTO)) return O[IE_PROTO];
	  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
	    return O.constructor.prototype;
	  }return O instanceof Object ? ObjectProto : null;
	};

/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// 19.1.2.14 Object.keys(O)
	var toObject = __webpack_require__(59),
	    $keys = __webpack_require__(30);

	__webpack_require__(57)('keys', function () {
	  return function keys(it) {
	    return $keys(toObject(it));
	  };
	});

/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// 19.1.2.7 Object.getOwnPropertyNames(O)
	__webpack_require__(57)('getOwnPropertyNames', function () {
	  return __webpack_require__(49).f;
	});

/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// 19.1.2.5 Object.freeze(O)
	var isObject = __webpack_require__(16),
	    meta = __webpack_require__(25).onFreeze;

	__webpack_require__(57)('freeze', function ($freeze) {
	  return function freeze(it) {
	    return $freeze && isObject(it) ? $freeze(meta(it)) : it;
	  };
	});

/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// 19.1.2.17 Object.seal(O)
	var isObject = __webpack_require__(16),
	    meta = __webpack_require__(25).onFreeze;

	__webpack_require__(57)('seal', function ($seal) {
	  return function seal(it) {
	    return $seal && isObject(it) ? $seal(meta(it)) : it;
	  };
	});

/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// 19.1.2.15 Object.preventExtensions(O)
	var isObject = __webpack_require__(16),
	    meta = __webpack_require__(25).onFreeze;

	__webpack_require__(57)('preventExtensions', function ($preventExtensions) {
	  return function preventExtensions(it) {
	    return $preventExtensions && isObject(it) ? $preventExtensions(meta(it)) : it;
	  };
	});

/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// 19.1.2.12 Object.isFrozen(O)
	var isObject = __webpack_require__(16);

	__webpack_require__(57)('isFrozen', function ($isFrozen) {
	  return function isFrozen(it) {
	    return isObject(it) ? $isFrozen ? $isFrozen(it) : false : true;
	  };
	});

/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// 19.1.2.13 Object.isSealed(O)
	var isObject = __webpack_require__(16);

	__webpack_require__(57)('isSealed', function ($isSealed) {
	  return function isSealed(it) {
	    return isObject(it) ? $isSealed ? $isSealed(it) : false : true;
	  };
	});

/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// 19.1.2.11 Object.isExtensible(O)
	var isObject = __webpack_require__(16);

	__webpack_require__(57)('isExtensible', function ($isExtensible) {
	  return function isExtensible(it) {
	    return isObject(it) ? $isExtensible ? $isExtensible(it) : true : false;
	  };
	});

/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// 19.1.3.1 Object.assign(target, source)
	var $export = __webpack_require__(12);

	$export($export.S + $export.F, 'Object', { assign: __webpack_require__(70) });

/***/ },
/* 70 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// 19.1.2.1 Object.assign(target, source, ...)

	var getKeys = __webpack_require__(30),
	    gOPS = __webpack_require__(43),
	    pIE = __webpack_require__(44),
	    toObject = __webpack_require__(59),
	    IObject = __webpack_require__(33);

	// should work with symbols and should have deterministic property order (V8 bug)
	module.exports = __webpack_require__(11)(function () {
	  var a = Object.assign,
	      A = {},
	      B = {},
	      S = Symbol(),
	      K = 'abcdefghijklmnopqrst';
	  A[S] = 7;
	  K.split('').forEach(function (k) {
	    B[k] = k;
	  });
	  return a({}, A)[S] != 7 || Object.keys(a({}, B)).join('') != K;
	}) ? function assign(target, source) {
	  // eslint-disable-line no-unused-vars
	  var T = toObject(target),
	      aLen = arguments.length,
	      index = 1,
	      getSymbols = gOPS.f,
	      isEnum = pIE.f;
	  while (aLen > index) {
	    var S = IObject(arguments[index++]),
	        keys = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S),
	        length = keys.length,
	        j = 0,
	        key;
	    while (length > j) {
	      if (isEnum.call(S, key = keys[j++])) T[key] = S[key];
	    }
	  }
	  return T;
	} : Object.assign;

/***/ },
/* 71 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// 19.1.3.10 Object.is(value1, value2)
	var $export = __webpack_require__(12);
	$export($export.S, 'Object', { is: __webpack_require__(72) });

/***/ },
/* 72 */
/***/ function(module, exports) {

	"use strict";

	// 7.2.9 SameValue(x, y)
	module.exports = Object.is || function is(x, y) {
	  return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
	};

/***/ },
/* 73 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// 19.1.3.19 Object.setPrototypeOf(O, proto)
	var $export = __webpack_require__(12);
	$export($export.S, 'Object', { setPrototypeOf: __webpack_require__(74).set });

/***/ },
/* 74 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// Works with __proto__ only. Old v8 can't work with null proto objects.
	/* eslint-disable no-proto */
	var isObject = __webpack_require__(16),
	    anObject = __webpack_require__(15);
	var check = function check(O, proto) {
	  anObject(O);
	  if (!isObject(proto) && proto !== null) throw TypeError(proto + ": can't set as prototype!");
	};
	module.exports = {
	  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
	  function (test, buggy, set) {
	    try {
	      set = __webpack_require__(23)(Function.call, __webpack_require__(51).f(Object.prototype, '__proto__').set, 2);
	      set(test, []);
	      buggy = !(test instanceof Array);
	    } catch (e) {
	      buggy = true;
	    }
	    return function setPrototypeOf(O, proto) {
	      check(O, proto);
	      if (buggy) O.__proto__ = proto;else set(O, proto);
	      return O;
	    };
	  }({}, false) : undefined),
	  check: check
	};

/***/ },
/* 75 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// 19.1.3.6 Object.prototype.toString()

	var classof = __webpack_require__(76),
	    test = {};
	test[__webpack_require__(28)('toStringTag')] = 'z';
	if (test + '' != '[object z]') {
	  __webpack_require__(21)(Object.prototype, 'toString', function toString() {
	    return '[object ' + classof(this) + ']';
	  }, true);
	}

/***/ },
/* 76 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// getting tag from 19.1.3.6 Object.prototype.toString()
	var cof = __webpack_require__(34),
	    TAG = __webpack_require__(28)('toStringTag')
	// ES3 wrong here
	,
	    ARG = cof(function () {
	  return arguments;
	}()) == 'Arguments';

	module.exports = function (it) {
	  var O, T, B;
	  return it === undefined ? 'Undefined' : it === null ? 'Null'
	  // @@toStringTag case
	  : typeof (T = (O = Object(it))[TAG]) == 'string' ? T
	  // builtinTag case
	  : ARG ? cof(O)
	  // ES3 arguments fallback
	  : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
	};

/***/ },
/* 77 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// 19.2.3.2 / 15.3.4.5 Function.prototype.bind(thisArg, args...)
	var $export = __webpack_require__(12);

	$export($export.P, 'Function', { bind: __webpack_require__(78) });

/***/ },
/* 78 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var aFunction = __webpack_require__(24),
	    isObject = __webpack_require__(16),
	    invoke = __webpack_require__(79),
	    arraySlice = [].slice,
	    factories = {};

	var construct = function construct(F, len, args) {
	  if (!(len in factories)) {
	    for (var n = [], i = 0; i < len; i++) {
	      n[i] = 'a[' + i + ']';
	    }factories[len] = Function('F,a', 'return new F(' + n.join(',') + ')');
	  }return factories[len](F, args);
	};

	module.exports = Function.bind || function bind(that /*, args... */) {
	  var fn = aFunction(this),
	      partArgs = arraySlice.call(arguments, 1);
	  var bound = function bound() /* args... */{
	    var args = partArgs.concat(arraySlice.call(arguments));
	    return this instanceof bound ? construct(fn, args.length, args) : invoke(fn, args, that);
	  };
	  if (isObject(fn.prototype)) bound.prototype = fn.prototype;
	  return bound;
	};

/***/ },
/* 79 */
/***/ function(module, exports) {

	"use strict";

	// fast apply, http://jsperf.lnkit.com/fast-apply/5
	module.exports = function (fn, args, that) {
	                  var un = that === undefined;
	                  switch (args.length) {
	                                    case 0:
	                                                      return un ? fn() : fn.call(that);
	                                    case 1:
	                                                      return un ? fn(args[0]) : fn.call(that, args[0]);
	                                    case 2:
	                                                      return un ? fn(args[0], args[1]) : fn.call(that, args[0], args[1]);
	                                    case 3:
	                                                      return un ? fn(args[0], args[1], args[2]) : fn.call(that, args[0], args[1], args[2]);
	                                    case 4:
	                                                      return un ? fn(args[0], args[1], args[2], args[3]) : fn.call(that, args[0], args[1], args[2], args[3]);
	                  }return fn.apply(that, args);
	};

/***/ },
/* 80 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var dP = __webpack_require__(14).f,
	    createDesc = __webpack_require__(20),
	    has = __webpack_require__(9),
	    FProto = Function.prototype,
	    nameRE = /^\s*function ([^ (]*)/,
	    NAME = 'name';
	// 19.2.4.2 name
	NAME in FProto || __webpack_require__(10) && dP(FProto, NAME, {
	  configurable: true,
	  get: function get() {
	    var match = ('' + this).match(nameRE),
	        name = match ? match[1] : '';
	    has(this, NAME) || dP(this, NAME, createDesc(5, name));
	    return name;
	  }
	});

/***/ },
/* 81 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var isObject = __webpack_require__(16),
	    getPrototypeOf = __webpack_require__(60),
	    HAS_INSTANCE = __webpack_require__(28)('hasInstance'),
	    FunctionProto = Function.prototype;
	// 19.2.3.6 Function.prototype[@@hasInstance](V)
	if (!(HAS_INSTANCE in FunctionProto)) __webpack_require__(14).f(FunctionProto, HAS_INSTANCE, { value: function value(O) {
	    if (typeof this != 'function' || !isObject(O)) return false;
	    if (!isObject(this.prototype)) return O instanceof this;
	    // for environment w/o native `@@hasInstance` logic enough `instanceof`, but add this:
	    while (O = getPrototypeOf(O)) {
	      if (this.prototype === O) return true;
	    }return false;
	  } });

/***/ },
/* 82 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var $export = __webpack_require__(12),
	    $parseInt = __webpack_require__(83);
	// 18.2.5 parseInt(string, radix)
	$export($export.G + $export.F * (parseInt != $parseInt), { parseInt: $parseInt });

/***/ },
/* 83 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var $parseInt = __webpack_require__(7).parseInt,
	    $trim = __webpack_require__(84).trim,
	    ws = __webpack_require__(85),
	    hex = /^[\-+]?0[xX]/;

	module.exports = $parseInt(ws + '08') !== 8 || $parseInt(ws + '0x16') !== 22 ? function parseInt(str, radix) {
	  var string = $trim(String(str), 3);
	  return $parseInt(string, radix >>> 0 || (hex.test(string) ? 16 : 10));
	} : $parseInt;

/***/ },
/* 84 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var $export = __webpack_require__(12),
	    defined = __webpack_require__(35),
	    fails = __webpack_require__(11),
	    spaces = __webpack_require__(85),
	    space = '[' + spaces + ']',
	    non = '​',
	    ltrim = RegExp('^' + space + space + '*'),
	    rtrim = RegExp(space + space + '*$');

	var exporter = function exporter(KEY, exec, ALIAS) {
	  var exp = {};
	  var FORCE = fails(function () {
	    return !!spaces[KEY]() || non[KEY]() != non;
	  });
	  var fn = exp[KEY] = FORCE ? exec(trim) : spaces[KEY];
	  if (ALIAS) exp[ALIAS] = fn;
	  $export($export.P + $export.F * FORCE, 'String', exp);
	};

	// 1 -> String#trimLeft
	// 2 -> String#trimRight
	// 3 -> String#trim
	var trim = exporter.trim = function (string, TYPE) {
	  string = String(defined(string));
	  if (TYPE & 1) string = string.replace(ltrim, '');
	  if (TYPE & 2) string = string.replace(rtrim, '');
	  return string;
	};

	module.exports = exporter;

/***/ },
/* 85 */
/***/ function(module, exports) {

	'use strict';

	module.exports = '\t\n\u000b\f\r   ᠎    ' + '         　\u2028\u2029﻿';

/***/ },
/* 86 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var $export = __webpack_require__(12),
	    $parseFloat = __webpack_require__(87);
	// 18.2.4 parseFloat(string)
	$export($export.G + $export.F * (parseFloat != $parseFloat), { parseFloat: $parseFloat });

/***/ },
/* 87 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var $parseFloat = __webpack_require__(7).parseFloat,
	    $trim = __webpack_require__(84).trim;

	module.exports = 1 / $parseFloat(__webpack_require__(85) + '-0') !== -Infinity ? function parseFloat(str) {
	  var string = $trim(String(str), 3),
	      result = $parseFloat(string);
	  return result === 0 && string.charAt(0) == '-' ? -0 : result;
	} : $parseFloat;

/***/ },
/* 88 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var global = __webpack_require__(7),
	    has = __webpack_require__(9),
	    cof = __webpack_require__(34),
	    inheritIfRequired = __webpack_require__(89),
	    toPrimitive = __webpack_require__(19),
	    fails = __webpack_require__(11),
	    gOPN = __webpack_require__(50).f,
	    gOPD = __webpack_require__(51).f,
	    dP = __webpack_require__(14).f,
	    $trim = __webpack_require__(84).trim,
	    NUMBER = 'Number',
	    $Number = global[NUMBER],
	    Base = $Number,
	    proto = $Number.prototype
	// Opera ~12 has broken Object#toString
	,
	    BROKEN_COF = cof(__webpack_require__(46)(proto)) == NUMBER,
	    TRIM = 'trim' in String.prototype;

	// 7.1.3 ToNumber(argument)
	var toNumber = function toNumber(argument) {
	  var it = toPrimitive(argument, false);
	  if (typeof it == 'string' && it.length > 2) {
	    it = TRIM ? it.trim() : $trim(it, 3);
	    var first = it.charCodeAt(0),
	        third,
	        radix,
	        maxCode;
	    if (first === 43 || first === 45) {
	      third = it.charCodeAt(2);
	      if (third === 88 || third === 120) return NaN; // Number('+0x1') should be NaN, old V8 fix
	    } else if (first === 48) {
	        switch (it.charCodeAt(1)) {
	          case 66:case 98:
	            radix = 2;maxCode = 49;break; // fast equal /^0b[01]+$/i
	          case 79:case 111:
	            radix = 8;maxCode = 55;break; // fast equal /^0o[0-7]+$/i
	          default:
	            return +it;
	        }
	        for (var digits = it.slice(2), i = 0, l = digits.length, code; i < l; i++) {
	          code = digits.charCodeAt(i);
	          // parseInt parses a string to a first unavailable symbol
	          // but ToNumber should return NaN if a string contains unavailable symbols
	          if (code < 48 || code > maxCode) return NaN;
	        }return parseInt(digits, radix);
	      }
	  }return +it;
	};

	if (!$Number(' 0o1') || !$Number('0b1') || $Number('+0x1')) {
	  $Number = function Number(value) {
	    var it = arguments.length < 1 ? 0 : value,
	        that = this;
	    return that instanceof $Number
	    // check on 1..constructor(foo) case
	     && (BROKEN_COF ? fails(function () {
	      proto.valueOf.call(that);
	    }) : cof(that) != NUMBER) ? inheritIfRequired(new Base(toNumber(it)), that, $Number) : toNumber(it);
	  };
	  for (var keys = __webpack_require__(10) ? gOPN(Base) : (
	  // ES3:
	  'MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,' +
	  // ES6 (in case, if modules with ES6 Number statics required before):
	  'EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,' + 'MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger').split(','), j = 0, key; keys.length > j; j++) {
	    if (has(Base, key = keys[j]) && !has($Number, key)) {
	      dP($Number, key, gOPD(Base, key));
	    }
	  }
	  $Number.prototype = proto;
	  proto.constructor = $Number;
	  __webpack_require__(21)(global, NUMBER, $Number);
	}

/***/ },
/* 89 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var isObject = __webpack_require__(16),
	    setPrototypeOf = __webpack_require__(74).set;
	module.exports = function (that, target, C) {
	  var P,
	      S = target.constructor;
	  if (S !== C && typeof S == 'function' && (P = S.prototype) !== C.prototype && isObject(P) && setPrototypeOf) {
	    setPrototypeOf(that, P);
	  }return that;
	};

/***/ },
/* 90 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var $export = __webpack_require__(12),
	    anInstance = __webpack_require__(91),
	    toInteger = __webpack_require__(38),
	    aNumberValue = __webpack_require__(92),
	    repeat = __webpack_require__(93),
	    $toFixed = 1..toFixed,
	    floor = Math.floor,
	    data = [0, 0, 0, 0, 0, 0],
	    ERROR = 'Number.toFixed: incorrect invocation!',
	    ZERO = '0';

	var multiply = function multiply(n, c) {
	  var i = -1,
	      c2 = c;
	  while (++i < 6) {
	    c2 += n * data[i];
	    data[i] = c2 % 1e7;
	    c2 = floor(c2 / 1e7);
	  }
	};
	var divide = function divide(n) {
	  var i = 6,
	      c = 0;
	  while (--i >= 0) {
	    c += data[i];
	    data[i] = floor(c / n);
	    c = c % n * 1e7;
	  }
	};
	var numToString = function numToString() {
	  var i = 6,
	      s = '';
	  while (--i >= 0) {
	    if (s !== '' || i === 0 || data[i] !== 0) {
	      var t = String(data[i]);
	      s = s === '' ? t : s + repeat.call(ZERO, 7 - t.length) + t;
	    }
	  }return s;
	};
	var pow = function pow(x, n, acc) {
	  return n === 0 ? acc : n % 2 === 1 ? pow(x, n - 1, acc * x) : pow(x * x, n / 2, acc);
	};
	var log = function log(x) {
	  var n = 0,
	      x2 = x;
	  while (x2 >= 4096) {
	    n += 12;
	    x2 /= 4096;
	  }
	  while (x2 >= 2) {
	    n += 1;
	    x2 /= 2;
	  }return n;
	};

	$export($export.P + $export.F * (!!$toFixed && (0.00008.toFixed(3) !== '0.000' || 0.9.toFixed(0) !== '1' || 1.255.toFixed(2) !== '1.25' || 1000000000000000128..toFixed(0) !== '1000000000000000128') || !__webpack_require__(11)(function () {
	  // V8 ~ Android 4.3-
	  $toFixed.call({});
	})), 'Number', {
	  toFixed: function toFixed(fractionDigits) {
	    var x = aNumberValue(this, ERROR),
	        f = toInteger(fractionDigits),
	        s = '',
	        m = ZERO,
	        e,
	        z,
	        j,
	        k;
	    if (f < 0 || f > 20) throw RangeError(ERROR);
	    if (x != x) return 'NaN';
	    if (x <= -1e21 || x >= 1e21) return String(x);
	    if (x < 0) {
	      s = '-';
	      x = -x;
	    }
	    if (x > 1e-21) {
	      e = log(x * pow(2, 69, 1)) - 69;
	      z = e < 0 ? x * pow(2, -e, 1) : x / pow(2, e, 1);
	      z *= 0x10000000000000;
	      e = 52 - e;
	      if (e > 0) {
	        multiply(0, z);
	        j = f;
	        while (j >= 7) {
	          multiply(1e7, 0);
	          j -= 7;
	        }
	        multiply(pow(10, j, 1), 0);
	        j = e - 1;
	        while (j >= 23) {
	          divide(1 << 23);
	          j -= 23;
	        }
	        divide(1 << j);
	        multiply(1, 1);
	        divide(2);
	        m = numToString();
	      } else {
	        multiply(0, z);
	        multiply(1 << -e, 0);
	        m = numToString() + repeat.call(ZERO, f);
	      }
	    }
	    if (f > 0) {
	      k = m.length;
	      m = s + (k <= f ? '0.' + repeat.call(ZERO, f - k) + m : m.slice(0, k - f) + '.' + m.slice(k - f));
	    } else {
	      m = s + m;
	    }return m;
	  }
	});

/***/ },
/* 91 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function (it, Constructor, name, forbiddenField) {
	  if (!(it instanceof Constructor) || forbiddenField !== undefined && forbiddenField in it) {
	    throw TypeError(name + ': incorrect invocation!');
	  }return it;
	};

/***/ },
/* 92 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var cof = __webpack_require__(34);
	module.exports = function (it, msg) {
	  if (typeof it != 'number' && cof(it) != 'Number') throw TypeError(msg);
	  return +it;
	};

/***/ },
/* 93 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var toInteger = __webpack_require__(38),
	    defined = __webpack_require__(35);

	module.exports = function repeat(count) {
	  var str = String(defined(this)),
	      res = '',
	      n = toInteger(count);
	  if (n < 0 || n == Infinity) throw RangeError("Count can't be negative");
	  for (; n > 0; (n >>>= 1) && (str += str)) {
	    if (n & 1) res += str;
	  }return res;
	};

/***/ },
/* 94 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var $export = __webpack_require__(12),
	    $fails = __webpack_require__(11),
	    aNumberValue = __webpack_require__(92),
	    $toPrecision = 1..toPrecision;

	$export($export.P + $export.F * ($fails(function () {
	  // IE7-
	  return $toPrecision.call(1, undefined) !== '1';
	}) || !$fails(function () {
	  // V8 ~ Android 4.3-
	  $toPrecision.call({});
	})), 'Number', {
	  toPrecision: function toPrecision(precision) {
	    var that = aNumberValue(this, 'Number#toPrecision: incorrect invocation!');
	    return precision === undefined ? $toPrecision.call(that) : $toPrecision.call(that, precision);
	  }
	});

/***/ },
/* 95 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// 20.1.2.1 Number.EPSILON
	var $export = __webpack_require__(12);

	$export($export.S, 'Number', { EPSILON: Math.pow(2, -52) });

/***/ },
/* 96 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// 20.1.2.2 Number.isFinite(number)
	var $export = __webpack_require__(12),
	    _isFinite = __webpack_require__(7).isFinite;

	$export($export.S, 'Number', {
	  isFinite: function isFinite(it) {
	    return typeof it == 'number' && _isFinite(it);
	  }
	});

/***/ },
/* 97 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// 20.1.2.3 Number.isInteger(number)
	var $export = __webpack_require__(12);

	$export($export.S, 'Number', { isInteger: __webpack_require__(98) });

/***/ },
/* 98 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// 20.1.2.3 Number.isInteger(number)
	var isObject = __webpack_require__(16),
	    floor = Math.floor;
	module.exports = function isInteger(it) {
	  return !isObject(it) && isFinite(it) && floor(it) === it;
	};

/***/ },
/* 99 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// 20.1.2.4 Number.isNaN(number)
	var $export = __webpack_require__(12);

	$export($export.S, 'Number', {
	  isNaN: function isNaN(number) {
	    return number != number;
	  }
	});

/***/ },
/* 100 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// 20.1.2.5 Number.isSafeInteger(number)
	var $export = __webpack_require__(12),
	    isInteger = __webpack_require__(98),
	    abs = Math.abs;

	$export($export.S, 'Number', {
	  isSafeInteger: function isSafeInteger(number) {
	    return isInteger(number) && abs(number) <= 0x1fffffffffffff;
	  }
	});

/***/ },
/* 101 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// 20.1.2.6 Number.MAX_SAFE_INTEGER
	var $export = __webpack_require__(12);

	$export($export.S, 'Number', { MAX_SAFE_INTEGER: 0x1fffffffffffff });

/***/ },
/* 102 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// 20.1.2.10 Number.MIN_SAFE_INTEGER
	var $export = __webpack_require__(12);

	$export($export.S, 'Number', { MIN_SAFE_INTEGER: -0x1fffffffffffff });

/***/ },
/* 103 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var $export = __webpack_require__(12),
	    $parseFloat = __webpack_require__(87);
	// 20.1.2.12 Number.parseFloat(string)
	$export($export.S + $export.F * (Number.parseFloat != $parseFloat), 'Number', { parseFloat: $parseFloat });

/***/ },
/* 104 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var $export = __webpack_require__(12),
	    $parseInt = __webpack_require__(83);
	// 20.1.2.13 Number.parseInt(string, radix)
	$export($export.S + $export.F * (Number.parseInt != $parseInt), 'Number', { parseInt: $parseInt });

/***/ },
/* 105 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// 20.2.2.3 Math.acosh(x)
	var $export = __webpack_require__(12),
	    log1p = __webpack_require__(106),
	    sqrt = Math.sqrt,
	    $acosh = Math.acosh;

	// V8 bug https://code.google.com/p/v8/issues/detail?id=3509
	$export($export.S + $export.F * !($acosh && Math.floor($acosh(Number.MAX_VALUE)) == 710), 'Math', {
	  acosh: function acosh(x) {
	    return (x = +x) < 1 ? NaN : x > 94906265.62425156 ? Math.log(x) + Math.LN2 : log1p(x - 1 + sqrt(x - 1) * sqrt(x + 1));
	  }
	});

/***/ },
/* 106 */
/***/ function(module, exports) {

	"use strict";

	// 20.2.2.20 Math.log1p(x)
	module.exports = Math.log1p || function log1p(x) {
	  return (x = +x) > -1e-8 && x < 1e-8 ? x - x * x / 2 : Math.log(1 + x);
	};

/***/ },
/* 107 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// 20.2.2.5 Math.asinh(x)
	var $export = __webpack_require__(12);

	function asinh(x) {
	  return !isFinite(x = +x) || x == 0 ? x : x < 0 ? -asinh(-x) : Math.log(x + Math.sqrt(x * x + 1));
	}

	$export($export.S, 'Math', { asinh: asinh });

/***/ },
/* 108 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// 20.2.2.7 Math.atanh(x)
	var $export = __webpack_require__(12);

	$export($export.S, 'Math', {
	  atanh: function atanh(x) {
	    return (x = +x) == 0 ? x : Math.log((1 + x) / (1 - x)) / 2;
	  }
	});

/***/ },
/* 109 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// 20.2.2.9 Math.cbrt(x)
	var $export = __webpack_require__(12),
	    sign = __webpack_require__(110);

	$export($export.S, 'Math', {
	  cbrt: function cbrt(x) {
	    return sign(x = +x) * Math.pow(Math.abs(x), 1 / 3);
	  }
	});

/***/ },
/* 110 */
/***/ function(module, exports) {

	"use strict";

	// 20.2.2.28 Math.sign(x)
	module.exports = Math.sign || function sign(x) {
	  return (x = +x) == 0 || x != x ? x : x < 0 ? -1 : 1;
	};

/***/ },
/* 111 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// 20.2.2.11 Math.clz32(x)
	var $export = __webpack_require__(12);

	$export($export.S, 'Math', {
	  clz32: function clz32(x) {
	    return (x >>>= 0) ? 31 - Math.floor(Math.log(x + 0.5) * Math.LOG2E) : 32;
	  }
	});

/***/ },
/* 112 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// 20.2.2.12 Math.cosh(x)
	var $export = __webpack_require__(12),
	    exp = Math.exp;

	$export($export.S, 'Math', {
	  cosh: function cosh(x) {
	    return (exp(x = +x) + exp(-x)) / 2;
	  }
	});

/***/ },
/* 113 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// 20.2.2.14 Math.expm1(x)
	var $export = __webpack_require__(12);

	$export($export.S, 'Math', { expm1: __webpack_require__(114) });

/***/ },
/* 114 */
/***/ function(module, exports) {

	"use strict";

	// 20.2.2.14 Math.expm1(x)
	module.exports = Math.expm1 || function expm1(x) {
	  return (x = +x) == 0 ? x : x > -1e-6 && x < 1e-6 ? x + x * x / 2 : Math.exp(x) - 1;
	};

/***/ },
/* 115 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// 20.2.2.16 Math.fround(x)
	var $export = __webpack_require__(12),
	    sign = __webpack_require__(110),
	    pow = Math.pow,
	    EPSILON = pow(2, -52),
	    EPSILON32 = pow(2, -23),
	    MAX32 = pow(2, 127) * (2 - EPSILON32),
	    MIN32 = pow(2, -126);

	var roundTiesToEven = function roundTiesToEven(n) {
	  return n + 1 / EPSILON - 1 / EPSILON;
	};

	$export($export.S, 'Math', {
	  fround: function fround(x) {
	    var $abs = Math.abs(x),
	        $sign = sign(x),
	        a,
	        result;
	    if ($abs < MIN32) return $sign * roundTiesToEven($abs / MIN32 / EPSILON32) * MIN32 * EPSILON32;
	    a = (1 + EPSILON32 / EPSILON) * $abs;
	    result = a - (a - $abs);
	    if (result > MAX32 || result != result) return $sign * Infinity;
	    return $sign * result;
	  }
	});

/***/ },
/* 116 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// 20.2.2.17 Math.hypot([value1[, value2[, … ]]])
	var $export = __webpack_require__(12),
	    abs = Math.abs;

	$export($export.S, 'Math', {
	  hypot: function hypot(value1, value2) {
	    // eslint-disable-line no-unused-vars
	    var sum = 0,
	        i = 0,
	        aLen = arguments.length,
	        larg = 0,
	        arg,
	        div;
	    while (i < aLen) {
	      arg = abs(arguments[i++]);
	      if (larg < arg) {
	        div = larg / arg;
	        sum = sum * div * div + 1;
	        larg = arg;
	      } else if (arg > 0) {
	        div = arg / larg;
	        sum += div * div;
	      } else sum += arg;
	    }
	    return larg === Infinity ? Infinity : larg * Math.sqrt(sum);
	  }
	});

/***/ },
/* 117 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// 20.2.2.18 Math.imul(x, y)
	var $export = __webpack_require__(12),
	    $imul = Math.imul;

	// some WebKit versions fails with big numbers, some has wrong arity
	$export($export.S + $export.F * __webpack_require__(11)(function () {
	  return $imul(0xffffffff, 5) != -5 || $imul.length != 2;
	}), 'Math', {
	  imul: function imul(x, y) {
	    var UINT16 = 0xffff,
	        xn = +x,
	        yn = +y,
	        xl = UINT16 & xn,
	        yl = UINT16 & yn;
	    return 0 | xl * yl + ((UINT16 & xn >>> 16) * yl + xl * (UINT16 & yn >>> 16) << 16 >>> 0);
	  }
	});

/***/ },
/* 118 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// 20.2.2.21 Math.log10(x)
	var $export = __webpack_require__(12);

	$export($export.S, 'Math', {
	  log10: function log10(x) {
	    return Math.log(x) / Math.LN10;
	  }
	});

/***/ },
/* 119 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// 20.2.2.20 Math.log1p(x)
	var $export = __webpack_require__(12);

	$export($export.S, 'Math', { log1p: __webpack_require__(106) });

/***/ },
/* 120 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// 20.2.2.22 Math.log2(x)
	var $export = __webpack_require__(12);

	$export($export.S, 'Math', {
	  log2: function log2(x) {
	    return Math.log(x) / Math.LN2;
	  }
	});

/***/ },
/* 121 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// 20.2.2.28 Math.sign(x)
	var $export = __webpack_require__(12);

	$export($export.S, 'Math', { sign: __webpack_require__(110) });

/***/ },
/* 122 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// 20.2.2.30 Math.sinh(x)
	var $export = __webpack_require__(12),
	    expm1 = __webpack_require__(114),
	    exp = Math.exp;

	// V8 near Chromium 38 has a problem with very small numbers
	$export($export.S + $export.F * __webpack_require__(11)(function () {
	  return !Math.sinh(-2e-17) != -2e-17;
	}), 'Math', {
	  sinh: function sinh(x) {
	    return Math.abs(x = +x) < 1 ? (expm1(x) - expm1(-x)) / 2 : (exp(x - 1) - exp(-x - 1)) * (Math.E / 2);
	  }
	});

/***/ },
/* 123 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// 20.2.2.33 Math.tanh(x)
	var $export = __webpack_require__(12),
	    expm1 = __webpack_require__(114),
	    exp = Math.exp;

	$export($export.S, 'Math', {
	  tanh: function tanh(x) {
	    var a = expm1(x = +x),
	        b = expm1(-x);
	    return a == Infinity ? 1 : b == Infinity ? -1 : (a - b) / (exp(x) + exp(-x));
	  }
	});

/***/ },
/* 124 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// 20.2.2.34 Math.trunc(x)
	var $export = __webpack_require__(12);

	$export($export.S, 'Math', {
	  trunc: function trunc(it) {
	    return (it > 0 ? Math.floor : Math.ceil)(it);
	  }
	});

/***/ },
/* 125 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var $export = __webpack_require__(12),
	    toIndex = __webpack_require__(39),
	    fromCharCode = String.fromCharCode,
	    $fromCodePoint = String.fromCodePoint;

	// length should be 1, old FF problem
	$export($export.S + $export.F * (!!$fromCodePoint && $fromCodePoint.length != 1), 'String', {
	  // 21.1.2.2 String.fromCodePoint(...codePoints)
	  fromCodePoint: function fromCodePoint(x) {
	    // eslint-disable-line no-unused-vars
	    var res = [],
	        aLen = arguments.length,
	        i = 0,
	        code;
	    while (aLen > i) {
	      code = +arguments[i++];
	      if (toIndex(code, 0x10ffff) !== code) throw RangeError(code + ' is not a valid code point');
	      res.push(code < 0x10000 ? fromCharCode(code) : fromCharCode(((code -= 0x10000) >> 10) + 0xd800, code % 0x400 + 0xdc00));
	    }return res.join('');
	  }
	});

/***/ },
/* 126 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var $export = __webpack_require__(12),
	    toIObject = __webpack_require__(32),
	    toLength = __webpack_require__(37);

	$export($export.S, 'String', {
	  // 21.1.2.4 String.raw(callSite, ...substitutions)
	  raw: function raw(callSite) {
	    var tpl = toIObject(callSite.raw),
	        len = toLength(tpl.length),
	        aLen = arguments.length,
	        res = [],
	        i = 0;
	    while (len > i) {
	      res.push(String(tpl[i++]));
	      if (i < aLen) res.push(String(arguments[i]));
	    }return res.join('');
	  }
	});

/***/ },
/* 127 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// 21.1.3.25 String.prototype.trim()

	__webpack_require__(84)('trim', function ($trim) {
	  return function trim() {
	    return $trim(this, 3);
	  };
	});

/***/ },
/* 128 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var $at = __webpack_require__(129)(true);

	// 21.1.3.27 String.prototype[@@iterator]()
	__webpack_require__(130)(String, 'String', function (iterated) {
	  this._t = String(iterated); // target
	  this._i = 0; // next index
	  // 21.1.5.2.1 %StringIteratorPrototype%.next()
	}, function () {
	  var O = this._t,
	      index = this._i,
	      point;
	  if (index >= O.length) return { value: undefined, done: true };
	  point = $at(O, index);
	  this._i += point.length;
	  return { value: point, done: false };
	});

/***/ },
/* 129 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var toInteger = __webpack_require__(38),
	    defined = __webpack_require__(35);
	// true  -> String#at
	// false -> String#codePointAt
	module.exports = function (TO_STRING) {
	  return function (that, pos) {
	    var s = String(defined(that)),
	        i = toInteger(pos),
	        l = s.length,
	        a,
	        b;
	    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
	    a = s.charCodeAt(i);
	    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff ? TO_STRING ? s.charAt(i) : a : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
	  };
	};

/***/ },
/* 130 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var LIBRARY = __webpack_require__(52),
	    $export = __webpack_require__(12),
	    redefine = __webpack_require__(21),
	    hide = __webpack_require__(13),
	    has = __webpack_require__(9),
	    Iterators = __webpack_require__(131),
	    $iterCreate = __webpack_require__(132),
	    setToStringTag = __webpack_require__(27),
	    getPrototypeOf = __webpack_require__(60),
	    ITERATOR = __webpack_require__(28)('iterator'),
	    BUGGY = !([].keys && 'next' in [].keys()) // Safari has buggy iterators w/o `next`
	,
	    FF_ITERATOR = '@@iterator',
	    KEYS = 'keys',
	    VALUES = 'values';

	var returnThis = function returnThis() {
	  return this;
	};

	module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
	  $iterCreate(Constructor, NAME, next);
	  var getMethod = function getMethod(kind) {
	    if (!BUGGY && kind in proto) return proto[kind];
	    switch (kind) {
	      case KEYS:
	        return function keys() {
	          return new Constructor(this, kind);
	        };
	      case VALUES:
	        return function values() {
	          return new Constructor(this, kind);
	        };
	    }return function entries() {
	      return new Constructor(this, kind);
	    };
	  };
	  var TAG = NAME + ' Iterator',
	      DEF_VALUES = DEFAULT == VALUES,
	      VALUES_BUG = false,
	      proto = Base.prototype,
	      $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT],
	      $default = $native || getMethod(DEFAULT),
	      $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined,
	      $anyNative = NAME == 'Array' ? proto.entries || $native : $native,
	      methods,
	      key,
	      IteratorPrototype;
	  // Fix native
	  if ($anyNative) {
	    IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
	    if (IteratorPrototype !== Object.prototype) {
	      // Set @@toStringTag to native iterators
	      setToStringTag(IteratorPrototype, TAG, true);
	      // fix for some old engines
	      if (!LIBRARY && !has(IteratorPrototype, ITERATOR)) hide(IteratorPrototype, ITERATOR, returnThis);
	    }
	  }
	  // fix Array#{values, @@iterator}.name in V8 / FF
	  if (DEF_VALUES && $native && $native.name !== VALUES) {
	    VALUES_BUG = true;
	    $default = function values() {
	      return $native.call(this);
	    };
	  }
	  // Define iterator
	  if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
	    hide(proto, ITERATOR, $default);
	  }
	  // Plug for library
	  Iterators[NAME] = $default;
	  Iterators[TAG] = returnThis;
	  if (DEFAULT) {
	    methods = {
	      values: DEF_VALUES ? $default : getMethod(VALUES),
	      keys: IS_SET ? $default : getMethod(KEYS),
	      entries: $entries
	    };
	    if (FORCED) for (key in methods) {
	      if (!(key in proto)) redefine(proto, key, methods[key]);
	    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
	  }
	  return methods;
	};

/***/ },
/* 131 */
/***/ function(module, exports) {

	"use strict";

	module.exports = {};

/***/ },
/* 132 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var create = __webpack_require__(46),
	    descriptor = __webpack_require__(20),
	    setToStringTag = __webpack_require__(27),
	    IteratorPrototype = {};

	// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
	__webpack_require__(13)(IteratorPrototype, __webpack_require__(28)('iterator'), function () {
	  return this;
	});

	module.exports = function (Constructor, NAME, next) {
	  Constructor.prototype = create(IteratorPrototype, { next: descriptor(1, next) });
	  setToStringTag(Constructor, NAME + ' Iterator');
	};

/***/ },
/* 133 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var $export = __webpack_require__(12),
	    $at = __webpack_require__(129)(false);
	$export($export.P, 'String', {
	  // 21.1.3.3 String.prototype.codePointAt(pos)
	  codePointAt: function codePointAt(pos) {
	    return $at(this, pos);
	  }
	});

/***/ },
/* 134 */
/***/ function(module, exports, __webpack_require__) {

	// 21.1.3.6 String.prototype.endsWith(searchString [, endPosition])
	'use strict';

	var $export = __webpack_require__(12),
	    toLength = __webpack_require__(37),
	    context = __webpack_require__(135),
	    ENDS_WITH = 'endsWith',
	    $endsWith = ''[ENDS_WITH];

	$export($export.P + $export.F * __webpack_require__(137)(ENDS_WITH), 'String', {
	  endsWith: function endsWith(searchString /*, endPosition = @length */) {
	    var that = context(this, searchString, ENDS_WITH),
	        endPosition = arguments.length > 1 ? arguments[1] : undefined,
	        len = toLength(that.length),
	        end = endPosition === undefined ? len : Math.min(toLength(endPosition), len),
	        search = String(searchString);
	    return $endsWith ? $endsWith.call(that, search, end) : that.slice(end - search.length, end) === search;
	  }
	});

/***/ },
/* 135 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// helper for String#{startsWith, endsWith, includes}
	var isRegExp = __webpack_require__(136),
	    defined = __webpack_require__(35);

	module.exports = function (that, searchString, NAME) {
	  if (isRegExp(searchString)) throw TypeError('String#' + NAME + " doesn't accept regex!");
	  return String(defined(that));
	};

/***/ },
/* 136 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// 7.2.8 IsRegExp(argument)
	var isObject = __webpack_require__(16),
	    cof = __webpack_require__(34),
	    MATCH = __webpack_require__(28)('match');
	module.exports = function (it) {
	  var isRegExp;
	  return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : cof(it) == 'RegExp');
	};

/***/ },
/* 137 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var MATCH = __webpack_require__(28)('match');
	module.exports = function (KEY) {
	  var re = /./;
	  try {
	    '/./'[KEY](re);
	  } catch (e) {
	    try {
	      re[MATCH] = false;
	      return !'/./'[KEY](re);
	    } catch (f) {/* empty */}
	  }return true;
	};

/***/ },
/* 138 */
/***/ function(module, exports, __webpack_require__) {

	// 21.1.3.7 String.prototype.includes(searchString, position = 0)
	'use strict';

	var $export = __webpack_require__(12),
	    context = __webpack_require__(135),
	    INCLUDES = 'includes';

	$export($export.P + $export.F * __webpack_require__(137)(INCLUDES), 'String', {
	  includes: function includes(searchString /*, position = 0 */) {
	    return !! ~context(this, searchString, INCLUDES).indexOf(searchString, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

/***/ },
/* 139 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var $export = __webpack_require__(12);

	$export($export.P, 'String', {
	  // 21.1.3.13 String.prototype.repeat(count)
	  repeat: __webpack_require__(93)
	});

/***/ },
/* 140 */
/***/ function(module, exports, __webpack_require__) {

	// 21.1.3.18 String.prototype.startsWith(searchString [, position ])
	'use strict';

	var $export = __webpack_require__(12),
	    toLength = __webpack_require__(37),
	    context = __webpack_require__(135),
	    STARTS_WITH = 'startsWith',
	    $startsWith = ''[STARTS_WITH];

	$export($export.P + $export.F * __webpack_require__(137)(STARTS_WITH), 'String', {
	  startsWith: function startsWith(searchString /*, position = 0 */) {
	    var that = context(this, searchString, STARTS_WITH),
	        index = toLength(Math.min(arguments.length > 1 ? arguments[1] : undefined, that.length)),
	        search = String(searchString);
	    return $startsWith ? $startsWith.call(that, search, index) : that.slice(index, index + search.length) === search;
	  }
	});

/***/ },
/* 141 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// B.2.3.2 String.prototype.anchor(name)

	__webpack_require__(142)('anchor', function (createHTML) {
	  return function anchor(name) {
	    return createHTML(this, 'a', 'name', name);
	  };
	});

/***/ },
/* 142 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var $export = __webpack_require__(12),
	    fails = __webpack_require__(11),
	    defined = __webpack_require__(35),
	    quot = /"/g;
	// B.2.3.2.1 CreateHTML(string, tag, attribute, value)
	var createHTML = function createHTML(string, tag, attribute, value) {
	  var S = String(defined(string)),
	      p1 = '<' + tag;
	  if (attribute !== '') p1 += ' ' + attribute + '="' + String(value).replace(quot, '&quot;') + '"';
	  return p1 + '>' + S + '</' + tag + '>';
	};
	module.exports = function (NAME, exec) {
	  var O = {};
	  O[NAME] = exec(createHTML);
	  $export($export.P + $export.F * fails(function () {
	    var test = ''[NAME]('"');
	    return test !== test.toLowerCase() || test.split('"').length > 3;
	  }), 'String', O);
	};

/***/ },
/* 143 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// B.2.3.3 String.prototype.big()

	__webpack_require__(142)('big', function (createHTML) {
	  return function big() {
	    return createHTML(this, 'big', '', '');
	  };
	});

/***/ },
/* 144 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// B.2.3.4 String.prototype.blink()

	__webpack_require__(142)('blink', function (createHTML) {
	  return function blink() {
	    return createHTML(this, 'blink', '', '');
	  };
	});

/***/ },
/* 145 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// B.2.3.5 String.prototype.bold()

	__webpack_require__(142)('bold', function (createHTML) {
	  return function bold() {
	    return createHTML(this, 'b', '', '');
	  };
	});

/***/ },
/* 146 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// B.2.3.6 String.prototype.fixed()

	__webpack_require__(142)('fixed', function (createHTML) {
	  return function fixed() {
	    return createHTML(this, 'tt', '', '');
	  };
	});

/***/ },
/* 147 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// B.2.3.7 String.prototype.fontcolor(color)

	__webpack_require__(142)('fontcolor', function (createHTML) {
	  return function fontcolor(color) {
	    return createHTML(this, 'font', 'color', color);
	  };
	});

/***/ },
/* 148 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// B.2.3.8 String.prototype.fontsize(size)

	__webpack_require__(142)('fontsize', function (createHTML) {
	  return function fontsize(size) {
	    return createHTML(this, 'font', 'size', size);
	  };
	});

/***/ },
/* 149 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// B.2.3.9 String.prototype.italics()

	__webpack_require__(142)('italics', function (createHTML) {
	  return function italics() {
	    return createHTML(this, 'i', '', '');
	  };
	});

/***/ },
/* 150 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// B.2.3.10 String.prototype.link(url)

	__webpack_require__(142)('link', function (createHTML) {
	  return function link(url) {
	    return createHTML(this, 'a', 'href', url);
	  };
	});

/***/ },
/* 151 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// B.2.3.11 String.prototype.small()

	__webpack_require__(142)('small', function (createHTML) {
	  return function small() {
	    return createHTML(this, 'small', '', '');
	  };
	});

/***/ },
/* 152 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// B.2.3.12 String.prototype.strike()

	__webpack_require__(142)('strike', function (createHTML) {
	  return function strike() {
	    return createHTML(this, 'strike', '', '');
	  };
	});

/***/ },
/* 153 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// B.2.3.13 String.prototype.sub()

	__webpack_require__(142)('sub', function (createHTML) {
	  return function sub() {
	    return createHTML(this, 'sub', '', '');
	  };
	});

/***/ },
/* 154 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// B.2.3.14 String.prototype.sup()

	__webpack_require__(142)('sup', function (createHTML) {
	  return function sup() {
	    return createHTML(this, 'sup', '', '');
	  };
	});

/***/ },
/* 155 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// 20.3.3.1 / 15.9.4.4 Date.now()
	var $export = __webpack_require__(12);

	$export($export.S, 'Date', { now: function now() {
	    return +new Date();
	  } });

/***/ },
/* 156 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var DateProto = Date.prototype,
	    INVALID_DATE = 'Invalid Date',
	    TO_STRING = 'toString',
	    $toString = DateProto[TO_STRING];
	if (new Date(NaN) + '' != INVALID_DATE) {
	  __webpack_require__(21)(DateProto, TO_STRING, function toString() {
	    var value = +this;
	    return value === value ? $toString.call(this) : INVALID_DATE;
	  });
	}

/***/ },
/* 157 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// 20.3.4.36 / 15.9.5.43 Date.prototype.toISOString()

	var $export = __webpack_require__(12),
	    fails = __webpack_require__(11);

	var lz = function lz(num) {
	  return num > 9 ? num : '0' + num;
	};

	// PhantomJS / old WebKit has a broken implementations
	$export($export.P + $export.F * (fails(function () {
	  return new Date(-5e13 - 1).toISOString() != '0385-07-25T07:06:39.999Z';
	}) || !fails(function () {
	  new Date(NaN).toISOString();
	})), 'Date', {
	  toISOString: function toISOString() {
	    if (!isFinite(this)) throw RangeError('Invalid time value');
	    var d = this,
	        y = d.getUTCFullYear(),
	        m = d.getUTCMilliseconds(),
	        s = y < 0 ? '-' : y > 9999 ? '+' : '';
	    return s + ('00000' + Math.abs(y)).slice(s ? -6 : -4) + '-' + lz(d.getUTCMonth() + 1) + '-' + lz(d.getUTCDate()) + 'T' + lz(d.getUTCHours()) + ':' + lz(d.getUTCMinutes()) + ':' + lz(d.getUTCSeconds()) + '.' + (m > 99 ? m : '0' + lz(m)) + 'Z';
	  }
	});

/***/ },
/* 158 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var $export = __webpack_require__(12),
	    toObject = __webpack_require__(59),
	    toPrimitive = __webpack_require__(19);

	$export($export.P + $export.F * __webpack_require__(11)(function () {
	  return new Date(NaN).toJSON() !== null || Date.prototype.toJSON.call({ toISOString: function toISOString() {
	      return 1;
	    } }) !== 1;
	}), 'Date', {
	  toJSON: function toJSON(key) {
	    var O = toObject(this),
	        pv = toPrimitive(O);
	    return typeof pv == 'number' && !isFinite(pv) ? null : O.toISOString();
	  }
	});

/***/ },
/* 159 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// 22.1.2.2 / 15.4.3.2 Array.isArray(arg)
	var $export = __webpack_require__(12);

	$export($export.S, 'Array', { isArray: __webpack_require__(45) });

/***/ },
/* 160 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var ctx = __webpack_require__(23),
	    $export = __webpack_require__(12),
	    toObject = __webpack_require__(59),
	    call = __webpack_require__(161),
	    isArrayIter = __webpack_require__(162),
	    toLength = __webpack_require__(37),
	    getIterFn = __webpack_require__(163);
	$export($export.S + $export.F * !__webpack_require__(164)(function (iter) {
	  Array.from(iter);
	}), 'Array', {
	  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
	  from: function from(arrayLike /*, mapfn = undefined, thisArg = undefined*/) {
	    var O = toObject(arrayLike),
	        C = typeof this == 'function' ? this : Array,
	        aLen = arguments.length,
	        mapfn = aLen > 1 ? arguments[1] : undefined,
	        mapping = mapfn !== undefined,
	        index = 0,
	        iterFn = getIterFn(O),
	        length,
	        result,
	        step,
	        iterator;
	    if (mapping) mapfn = ctx(mapfn, aLen > 2 ? arguments[2] : undefined, 2);
	    // if object isn't iterable or it's array with default iterator - use simple case
	    if (iterFn != undefined && !(C == Array && isArrayIter(iterFn))) {
	      for (iterator = iterFn.call(O), result = new C(); !(step = iterator.next()).done; index++) {
	        result[index] = mapping ? call(iterator, mapfn, [step.value, index], true) : step.value;
	      }
	    } else {
	      length = toLength(O.length);
	      for (result = new C(length); length > index; index++) {
	        result[index] = mapping ? mapfn(O[index], index) : O[index];
	      }
	    }
	    result.length = index;
	    return result;
	  }
	});

/***/ },
/* 161 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// call something on iterator step with safe closing on error
	var anObject = __webpack_require__(15);
	module.exports = function (iterator, fn, value, entries) {
	  try {
	    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
	    // 7.4.6 IteratorClose(iterator, completion)
	  } catch (e) {
	    var ret = iterator['return'];
	    if (ret !== undefined) anObject(ret.call(iterator));
	    throw e;
	  }
	};

/***/ },
/* 162 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// check on default Array iterator
	var Iterators = __webpack_require__(131),
	    ITERATOR = __webpack_require__(28)('iterator'),
	    ArrayProto = Array.prototype;

	module.exports = function (it) {
	  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
	};

/***/ },
/* 163 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var classof = __webpack_require__(76),
	    ITERATOR = __webpack_require__(28)('iterator'),
	    Iterators = __webpack_require__(131);
	module.exports = __webpack_require__(8).getIteratorMethod = function (it) {
	  if (it != undefined) return it[ITERATOR] || it['@@iterator'] || Iterators[classof(it)];
	};

/***/ },
/* 164 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var ITERATOR = __webpack_require__(28)('iterator'),
	    SAFE_CLOSING = false;

	try {
	  var riter = [7][ITERATOR]();
	  riter['return'] = function () {
	    SAFE_CLOSING = true;
	  };
	  Array.from(riter, function () {
	    throw 2;
	  });
	} catch (e) {/* empty */}

	module.exports = function (exec, skipClosing) {
	  if (!skipClosing && !SAFE_CLOSING) return false;
	  var safe = false;
	  try {
	    var arr = [7],
	        iter = arr[ITERATOR]();
	    iter.next = function () {
	      safe = true;
	    };
	    arr[ITERATOR] = function () {
	      return iter;
	    };
	    exec(arr);
	  } catch (e) {/* empty */}
	  return safe;
	};

/***/ },
/* 165 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var $export = __webpack_require__(12);

	// WebKit Array.of isn't generic
	$export($export.S + $export.F * __webpack_require__(11)(function () {
	  function F() {}
	  return !(Array.of.call(F) instanceof F);
	}), 'Array', {
	  // 22.1.2.3 Array.of( ...items)
	  of: function of() /* ...args */{
	    var index = 0,
	        aLen = arguments.length,
	        result = new (typeof this == 'function' ? this : Array)(aLen);
	    while (aLen > index) {
	      result[index] = arguments[index++];
	    }result.length = aLen;
	    return result;
	  }
	});

/***/ },
/* 166 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// 22.1.3.13 Array.prototype.join(separator)

	var $export = __webpack_require__(12),
	    toIObject = __webpack_require__(32),
	    arrayJoin = [].join;

	// fallback for not array-like strings
	$export($export.P + $export.F * (__webpack_require__(33) != Object || !__webpack_require__(167)(arrayJoin)), 'Array', {
	  join: function join(separator) {
	    return arrayJoin.call(toIObject(this), separator === undefined ? ',' : separator);
	  }
	});

/***/ },
/* 167 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var fails = __webpack_require__(11);

	module.exports = function (method, arg) {
	  return !!method && fails(function () {
	    arg ? method.call(null, function () {}, 1) : method.call(null);
	  });
	};

/***/ },
/* 168 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var $export = __webpack_require__(12),
	    html = __webpack_require__(48),
	    cof = __webpack_require__(34),
	    toIndex = __webpack_require__(39),
	    toLength = __webpack_require__(37),
	    arraySlice = [].slice;

	// fallback for not array-like ES3 strings and DOM objects
	$export($export.P + $export.F * __webpack_require__(11)(function () {
	  if (html) arraySlice.call(html);
	}), 'Array', {
	  slice: function slice(begin, end) {
	    var len = toLength(this.length),
	        klass = cof(this);
	    end = end === undefined ? len : end;
	    if (klass == 'Array') return arraySlice.call(this, begin, end);
	    var start = toIndex(begin, len),
	        upTo = toIndex(end, len),
	        size = toLength(upTo - start),
	        cloned = Array(size),
	        i = 0;
	    for (; i < size; i++) {
	      cloned[i] = klass == 'String' ? this.charAt(start + i) : this[start + i];
	    }return cloned;
	  }
	});

/***/ },
/* 169 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var $export = __webpack_require__(12),
	    aFunction = __webpack_require__(24),
	    toObject = __webpack_require__(59),
	    fails = __webpack_require__(11),
	    $sort = [].sort,
	    test = [1, 2, 3];

	$export($export.P + $export.F * (fails(function () {
	  // IE8-
	  test.sort(undefined);
	}) || !fails(function () {
	  // V8 bug
	  test.sort(null);
	  // Old WebKit
	}) || !__webpack_require__(167)($sort)), 'Array', {
	  // 22.1.3.25 Array.prototype.sort(comparefn)
	  sort: function sort(comparefn) {
	    return comparefn === undefined ? $sort.call(toObject(this)) : $sort.call(toObject(this), aFunction(comparefn));
	  }
	});

/***/ },
/* 170 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var $export = __webpack_require__(12),
	    $forEach = __webpack_require__(171)(0),
	    STRICT = __webpack_require__(167)([].forEach, true);

	$export($export.P + $export.F * !STRICT, 'Array', {
	  // 22.1.3.10 / 15.4.4.18 Array.prototype.forEach(callbackfn [, thisArg])
	  forEach: function forEach(callbackfn /* , thisArg */) {
	    return $forEach(this, callbackfn, arguments[1]);
	  }
	});

/***/ },
/* 171 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// 0 -> Array#forEach
	// 1 -> Array#map
	// 2 -> Array#filter
	// 3 -> Array#some
	// 4 -> Array#every
	// 5 -> Array#find
	// 6 -> Array#findIndex
	var ctx = __webpack_require__(23),
	    IObject = __webpack_require__(33),
	    toObject = __webpack_require__(59),
	    toLength = __webpack_require__(37),
	    asc = __webpack_require__(172);
	module.exports = function (TYPE, $create) {
	  var IS_MAP = TYPE == 1,
	      IS_FILTER = TYPE == 2,
	      IS_SOME = TYPE == 3,
	      IS_EVERY = TYPE == 4,
	      IS_FIND_INDEX = TYPE == 6,
	      NO_HOLES = TYPE == 5 || IS_FIND_INDEX,
	      create = $create || asc;
	  return function ($this, callbackfn, that) {
	    var O = toObject($this),
	        self = IObject(O),
	        f = ctx(callbackfn, that, 3),
	        length = toLength(self.length),
	        index = 0,
	        result = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined,
	        val,
	        res;
	    for (; length > index; index++) {
	      if (NO_HOLES || index in self) {
	        val = self[index];
	        res = f(val, index, O);
	        if (TYPE) {
	          if (IS_MAP) result[index] = res; // map
	          else if (res) switch (TYPE) {
	              case 3:
	                return true; // some
	              case 5:
	                return val; // find
	              case 6:
	                return index; // findIndex
	              case 2:
	                result.push(val); // filter
	            } else if (IS_EVERY) return false; // every
	        }
	      }
	    }return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;
	  };
	};

/***/ },
/* 172 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// 9.4.2.3 ArraySpeciesCreate(originalArray, length)
	var isObject = __webpack_require__(16),
	    isArray = __webpack_require__(45),
	    SPECIES = __webpack_require__(28)('species');
	module.exports = function (original, length) {
	  var C;
	  if (isArray(original)) {
	    C = original.constructor;
	    // cross-realm fallback
	    if (typeof C == 'function' && (C === Array || isArray(C.prototype))) C = undefined;
	    if (isObject(C)) {
	      C = C[SPECIES];
	      if (C === null) C = undefined;
	    }
	  }return new (C === undefined ? Array : C)(length);
	};

/***/ },
/* 173 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var $export = __webpack_require__(12),
	    $map = __webpack_require__(171)(1);

	$export($export.P + $export.F * !__webpack_require__(167)([].map, true), 'Array', {
	  // 22.1.3.15 / 15.4.4.19 Array.prototype.map(callbackfn [, thisArg])
	  map: function map(callbackfn /* , thisArg */) {
	    return $map(this, callbackfn, arguments[1]);
	  }
	});

/***/ },
/* 174 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var $export = __webpack_require__(12),
	    $filter = __webpack_require__(171)(2);

	$export($export.P + $export.F * !__webpack_require__(167)([].filter, true), 'Array', {
	  // 22.1.3.7 / 15.4.4.20 Array.prototype.filter(callbackfn [, thisArg])
	  filter: function filter(callbackfn /* , thisArg */) {
	    return $filter(this, callbackfn, arguments[1]);
	  }
	});

/***/ },
/* 175 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var $export = __webpack_require__(12),
	    $some = __webpack_require__(171)(3);

	$export($export.P + $export.F * !__webpack_require__(167)([].some, true), 'Array', {
	  // 22.1.3.23 / 15.4.4.17 Array.prototype.some(callbackfn [, thisArg])
	  some: function some(callbackfn /* , thisArg */) {
	    return $some(this, callbackfn, arguments[1]);
	  }
	});

/***/ },
/* 176 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var $export = __webpack_require__(12),
	    $every = __webpack_require__(171)(4);

	$export($export.P + $export.F * !__webpack_require__(167)([].every, true), 'Array', {
	  // 22.1.3.5 / 15.4.4.16 Array.prototype.every(callbackfn [, thisArg])
	  every: function every(callbackfn /* , thisArg */) {
	    return $every(this, callbackfn, arguments[1]);
	  }
	});

/***/ },
/* 177 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var $export = __webpack_require__(12),
	    $reduce = __webpack_require__(178);

	$export($export.P + $export.F * !__webpack_require__(167)([].reduce, true), 'Array', {
	  // 22.1.3.18 / 15.4.4.21 Array.prototype.reduce(callbackfn [, initialValue])
	  reduce: function reduce(callbackfn /* , initialValue */) {
	    return $reduce(this, callbackfn, arguments.length, arguments[1], false);
	  }
	});

/***/ },
/* 178 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var aFunction = __webpack_require__(24),
	    toObject = __webpack_require__(59),
	    IObject = __webpack_require__(33),
	    toLength = __webpack_require__(37);

	module.exports = function (that, callbackfn, aLen, memo, isRight) {
	  aFunction(callbackfn);
	  var O = toObject(that),
	      self = IObject(O),
	      length = toLength(O.length),
	      index = isRight ? length - 1 : 0,
	      i = isRight ? -1 : 1;
	  if (aLen < 2) for (;;) {
	    if (index in self) {
	      memo = self[index];
	      index += i;
	      break;
	    }
	    index += i;
	    if (isRight ? index < 0 : length <= index) {
	      throw TypeError('Reduce of empty array with no initial value');
	    }
	  }
	  for (; isRight ? index >= 0 : length > index; index += i) {
	    if (index in self) {
	      memo = callbackfn(memo, self[index], index, O);
	    }
	  }return memo;
	};

/***/ },
/* 179 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var $export = __webpack_require__(12),
	    $reduce = __webpack_require__(178);

	$export($export.P + $export.F * !__webpack_require__(167)([].reduceRight, true), 'Array', {
	  // 22.1.3.19 / 15.4.4.22 Array.prototype.reduceRight(callbackfn [, initialValue])
	  reduceRight: function reduceRight(callbackfn /* , initialValue */) {
	    return $reduce(this, callbackfn, arguments.length, arguments[1], true);
	  }
	});

/***/ },
/* 180 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var $export = __webpack_require__(12),
	    $indexOf = __webpack_require__(36)(false);

	$export($export.P + $export.F * !__webpack_require__(167)([].indexOf), 'Array', {
	  // 22.1.3.11 / 15.4.4.14 Array.prototype.indexOf(searchElement [, fromIndex])
	  indexOf: function indexOf(searchElement /*, fromIndex = 0 */) {
	    return $indexOf(this, searchElement, arguments[1]);
	  }
	});

/***/ },
/* 181 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var $export = __webpack_require__(12),
	    toIObject = __webpack_require__(32),
	    toInteger = __webpack_require__(38),
	    toLength = __webpack_require__(37);

	$export($export.P + $export.F * !__webpack_require__(167)([].lastIndexOf), 'Array', {
	  // 22.1.3.14 / 15.4.4.15 Array.prototype.lastIndexOf(searchElement [, fromIndex])
	  lastIndexOf: function lastIndexOf(searchElement /*, fromIndex = @[*-1] */) {
	    var O = toIObject(this),
	        length = toLength(O.length),
	        index = length - 1;
	    if (arguments.length > 1) index = Math.min(index, toInteger(arguments[1]));
	    if (index < 0) index = length + index;
	    for (; index >= 0; index--) {
	      if (index in O) if (O[index] === searchElement) return index;
	    }return -1;
	  }
	});

/***/ },
/* 182 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// 22.1.3.3 Array.prototype.copyWithin(target, start, end = this.length)
	var $export = __webpack_require__(12);

	$export($export.P, 'Array', { copyWithin: __webpack_require__(183) });

	__webpack_require__(184)('copyWithin');

/***/ },
/* 183 */
/***/ function(module, exports, __webpack_require__) {

	// 22.1.3.3 Array.prototype.copyWithin(target, start, end = this.length)
	'use strict';

	var toObject = __webpack_require__(59),
	    toIndex = __webpack_require__(39),
	    toLength = __webpack_require__(37);

	module.exports = [].copyWithin || function copyWithin(target /*= 0*/, start /*= 0, end = @length*/) {
	  var O = toObject(this),
	      len = toLength(O.length),
	      to = toIndex(target, len),
	      from = toIndex(start, len),
	      end = arguments.length > 2 ? arguments[2] : undefined,
	      count = Math.min((end === undefined ? len : toIndex(end, len)) - from, len - to),
	      inc = 1;
	  if (from < to && to < from + count) {
	    inc = -1;
	    from += count - 1;
	    to += count - 1;
	  }
	  while (count-- > 0) {
	    if (from in O) O[to] = O[from];else delete O[to];
	    to += inc;
	    from += inc;
	  }return O;
	};

/***/ },
/* 184 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// 22.1.3.31 Array.prototype[@@unscopables]
	var UNSCOPABLES = __webpack_require__(28)('unscopables'),
	    ArrayProto = Array.prototype;
	if (ArrayProto[UNSCOPABLES] == undefined) __webpack_require__(13)(ArrayProto, UNSCOPABLES, {});
	module.exports = function (key) {
	  ArrayProto[UNSCOPABLES][key] = true;
	};

/***/ },
/* 185 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// 22.1.3.6 Array.prototype.fill(value, start = 0, end = this.length)
	var $export = __webpack_require__(12);

	$export($export.P, 'Array', { fill: __webpack_require__(186) });

	__webpack_require__(184)('fill');

/***/ },
/* 186 */
/***/ function(module, exports, __webpack_require__) {

	// 22.1.3.6 Array.prototype.fill(value, start = 0, end = this.length)
	'use strict';

	var toObject = __webpack_require__(59),
	    toIndex = __webpack_require__(39),
	    toLength = __webpack_require__(37);
	module.exports = function fill(value /*, start = 0, end = @length */) {
	  var O = toObject(this),
	      length = toLength(O.length),
	      aLen = arguments.length,
	      index = toIndex(aLen > 1 ? arguments[1] : undefined, length),
	      end = aLen > 2 ? arguments[2] : undefined,
	      endPos = end === undefined ? length : toIndex(end, length);
	  while (endPos > index) {
	    O[index++] = value;
	  }return O;
	};

/***/ },
/* 187 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// 22.1.3.8 Array.prototype.find(predicate, thisArg = undefined)

	var $export = __webpack_require__(12),
	    $find = __webpack_require__(171)(5),
	    KEY = 'find',
	    forced = true;
	// Shouldn't skip holes
	if (KEY in []) Array(1)[KEY](function () {
	  forced = false;
	});
	$export($export.P + $export.F * forced, 'Array', {
	  find: function find(callbackfn /*, that = undefined */) {
	    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});
	__webpack_require__(184)(KEY);

/***/ },
/* 188 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// 22.1.3.9 Array.prototype.findIndex(predicate, thisArg = undefined)

	var $export = __webpack_require__(12),
	    $find = __webpack_require__(171)(6),
	    KEY = 'findIndex',
	    forced = true;
	// Shouldn't skip holes
	if (KEY in []) Array(1)[KEY](function () {
	  forced = false;
	});
	$export($export.P + $export.F * forced, 'Array', {
	  findIndex: function findIndex(callbackfn /*, that = undefined */) {
	    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});
	__webpack_require__(184)(KEY);

/***/ },
/* 189 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	__webpack_require__(190)('Array');

/***/ },
/* 190 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var global = __webpack_require__(7),
	    dP = __webpack_require__(14),
	    DESCRIPTORS = __webpack_require__(10),
	    SPECIES = __webpack_require__(28)('species');

	module.exports = function (KEY) {
	  var C = global[KEY];
	  if (DESCRIPTORS && C && !C[SPECIES]) dP.f(C, SPECIES, {
	    configurable: true,
	    get: function get() {
	      return this;
	    }
	  });
	};

/***/ },
/* 191 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var addToUnscopables = __webpack_require__(184),
	    step = __webpack_require__(192),
	    Iterators = __webpack_require__(131),
	    toIObject = __webpack_require__(32);

	// 22.1.3.4 Array.prototype.entries()
	// 22.1.3.13 Array.prototype.keys()
	// 22.1.3.29 Array.prototype.values()
	// 22.1.3.30 Array.prototype[@@iterator]()
	module.exports = __webpack_require__(130)(Array, 'Array', function (iterated, kind) {
	  this._t = toIObject(iterated); // target
	  this._i = 0; // next index
	  this._k = kind; // kind
	  // 22.1.5.2.1 %ArrayIteratorPrototype%.next()
	}, function () {
	  var O = this._t,
	      kind = this._k,
	      index = this._i++;
	  if (!O || index >= O.length) {
	    this._t = undefined;
	    return step(1);
	  }
	  if (kind == 'keys') return step(0, index);
	  if (kind == 'values') return step(0, O[index]);
	  return step(0, [index, O[index]]);
	}, 'values');

	// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
	Iterators.Arguments = Iterators.Array;

	addToUnscopables('keys');
	addToUnscopables('values');
	addToUnscopables('entries');

/***/ },
/* 192 */
/***/ function(module, exports) {

	"use strict";

	module.exports = function (done, value) {
	  return { value: value, done: !!done };
	};

/***/ },
/* 193 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var global = __webpack_require__(7),
	    inheritIfRequired = __webpack_require__(89),
	    dP = __webpack_require__(14).f,
	    gOPN = __webpack_require__(50).f,
	    isRegExp = __webpack_require__(136),
	    $flags = __webpack_require__(194),
	    $RegExp = global.RegExp,
	    Base = $RegExp,
	    proto = $RegExp.prototype,
	    re1 = /a/g,
	    re2 = /a/g
	// "new" creates a new object, old webkit buggy here
	,
	    CORRECT_NEW = new $RegExp(re1) !== re1;

	if (__webpack_require__(10) && (!CORRECT_NEW || __webpack_require__(11)(function () {
	  re2[__webpack_require__(28)('match')] = false;
	  // RegExp constructor can alter flags and IsRegExp works correct with @@match
	  return $RegExp(re1) != re1 || $RegExp(re2) == re2 || $RegExp(re1, 'i') != '/a/i';
	}))) {
	  $RegExp = function RegExp(p, f) {
	    var tiRE = this instanceof $RegExp,
	        piRE = isRegExp(p),
	        fiU = f === undefined;
	    return !tiRE && piRE && p.constructor === $RegExp && fiU ? p : inheritIfRequired(CORRECT_NEW ? new Base(piRE && !fiU ? p.source : p, f) : Base((piRE = p instanceof $RegExp) ? p.source : p, piRE && fiU ? $flags.call(p) : f), tiRE ? this : proto, $RegExp);
	  };
	  var proxy = function proxy(key) {
	    key in $RegExp || dP($RegExp, key, {
	      configurable: true,
	      get: function get() {
	        return Base[key];
	      },
	      set: function set(it) {
	        Base[key] = it;
	      }
	    });
	  };
	  for (var keys = gOPN(Base), i = 0; keys.length > i;) {
	    proxy(keys[i++]);
	  }proto.constructor = $RegExp;
	  $RegExp.prototype = proto;
	  __webpack_require__(21)(global, 'RegExp', $RegExp);
	}

	__webpack_require__(190)('RegExp');

/***/ },
/* 194 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// 21.2.5.3 get RegExp.prototype.flags

	var anObject = __webpack_require__(15);
	module.exports = function () {
	  var that = anObject(this),
	      result = '';
	  if (that.global) result += 'g';
	  if (that.ignoreCase) result += 'i';
	  if (that.multiline) result += 'm';
	  if (that.unicode) result += 'u';
	  if (that.sticky) result += 'y';
	  return result;
	};

/***/ },
/* 195 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	__webpack_require__(196);
	var anObject = __webpack_require__(15),
	    $flags = __webpack_require__(194),
	    DESCRIPTORS = __webpack_require__(10),
	    TO_STRING = 'toString',
	    $toString = /./[TO_STRING];

	var define = function define(fn) {
	  __webpack_require__(21)(RegExp.prototype, TO_STRING, fn, true);
	};

	// 21.2.5.14 RegExp.prototype.toString()
	if (__webpack_require__(11)(function () {
	  return $toString.call({ source: 'a', flags: 'b' }) != '/a/b';
	})) {
	  define(function toString() {
	    var R = anObject(this);
	    return '/'.concat(R.source, '/', 'flags' in R ? R.flags : !DESCRIPTORS && R instanceof RegExp ? $flags.call(R) : undefined);
	  });
	  // FF44- RegExp#toString has a wrong name
	} else if ($toString.name != TO_STRING) {
	    define(function toString() {
	      return $toString.call(this);
	    });
	  }

/***/ },
/* 196 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// 21.2.5.3 get RegExp.prototype.flags()
	if (__webpack_require__(10) && /./g.flags != 'g') __webpack_require__(14).f(RegExp.prototype, 'flags', {
	  configurable: true,
	  get: __webpack_require__(194)
	});

/***/ },
/* 197 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// @@match logic
	__webpack_require__(198)('match', 1, function (defined, MATCH, $match) {
	  // 21.1.3.11 String.prototype.match(regexp)
	  return [function match(regexp) {
	    'use strict';

	    var O = defined(this),
	        fn = regexp == undefined ? undefined : regexp[MATCH];
	    return fn !== undefined ? fn.call(regexp, O) : new RegExp(regexp)[MATCH](String(O));
	  }, $match];
	});

/***/ },
/* 198 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var hide = __webpack_require__(13),
	    redefine = __webpack_require__(21),
	    fails = __webpack_require__(11),
	    defined = __webpack_require__(35),
	    wks = __webpack_require__(28);

	module.exports = function (KEY, length, exec) {
	  var SYMBOL = wks(KEY),
	      fns = exec(defined, SYMBOL, ''[KEY]),
	      strfn = fns[0],
	      rxfn = fns[1];
	  if (fails(function () {
	    var O = {};
	    O[SYMBOL] = function () {
	      return 7;
	    };
	    return ''[KEY](O) != 7;
	  })) {
	    redefine(String.prototype, KEY, strfn);
	    hide(RegExp.prototype, SYMBOL, length == 2
	    // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
	    // 21.2.5.11 RegExp.prototype[@@split](string, limit)
	    ? function (string, arg) {
	      return rxfn.call(string, this, arg);
	    }
	    // 21.2.5.6 RegExp.prototype[@@match](string)
	    // 21.2.5.9 RegExp.prototype[@@search](string)
	    : function (string) {
	      return rxfn.call(string, this);
	    });
	  }
	};

/***/ },
/* 199 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// @@replace logic
	__webpack_require__(198)('replace', 2, function (defined, REPLACE, $replace) {
	  // 21.1.3.14 String.prototype.replace(searchValue, replaceValue)
	  return [function replace(searchValue, replaceValue) {
	    'use strict';

	    var O = defined(this),
	        fn = searchValue == undefined ? undefined : searchValue[REPLACE];
	    return fn !== undefined ? fn.call(searchValue, O, replaceValue) : $replace.call(String(O), searchValue, replaceValue);
	  }, $replace];
	});

/***/ },
/* 200 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// @@search logic
	__webpack_require__(198)('search', 1, function (defined, SEARCH, $search) {
	  // 21.1.3.15 String.prototype.search(regexp)
	  return [function search(regexp) {
	    'use strict';

	    var O = defined(this),
	        fn = regexp == undefined ? undefined : regexp[SEARCH];
	    return fn !== undefined ? fn.call(regexp, O) : new RegExp(regexp)[SEARCH](String(O));
	  }, $search];
	});

/***/ },
/* 201 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// @@split logic
	__webpack_require__(198)('split', 2, function (defined, SPLIT, $split) {
	  'use strict';

	  var isRegExp = __webpack_require__(136),
	      _split = $split,
	      $push = [].push,
	      $SPLIT = 'split',
	      LENGTH = 'length',
	      LAST_INDEX = 'lastIndex';
	  if ('abbc'[$SPLIT](/(b)*/)[1] == 'c' || 'test'[$SPLIT](/(?:)/, -1)[LENGTH] != 4 || 'ab'[$SPLIT](/(?:ab)*/)[LENGTH] != 2 || '.'[$SPLIT](/(.?)(.?)/)[LENGTH] != 4 || '.'[$SPLIT](/()()/)[LENGTH] > 1 || ''[$SPLIT](/.?/)[LENGTH]) {
	    var NPCG = /()??/.exec('')[1] === undefined; // nonparticipating capturing group
	    // based on es5-shim implementation, need to rework it
	    $split = function $split(separator, limit) {
	      var string = String(this);
	      if (separator === undefined && limit === 0) return [];
	      // If `separator` is not a regex, use native split
	      if (!isRegExp(separator)) return _split.call(string, separator, limit);
	      var output = [];
	      var flags = (separator.ignoreCase ? 'i' : '') + (separator.multiline ? 'm' : '') + (separator.unicode ? 'u' : '') + (separator.sticky ? 'y' : '');
	      var lastLastIndex = 0;
	      var splitLimit = limit === undefined ? 4294967295 : limit >>> 0;
	      // Make `global` and avoid `lastIndex` issues by working with a copy
	      var separatorCopy = new RegExp(separator.source, flags + 'g');
	      var separator2, match, lastIndex, lastLength, i;
	      // Doesn't need flags gy, but they don't hurt
	      if (!NPCG) separator2 = new RegExp('^' + separatorCopy.source + '$(?!\\s)', flags);
	      while (match = separatorCopy.exec(string)) {
	        // `separatorCopy.lastIndex` is not reliable cross-browser
	        lastIndex = match.index + match[0][LENGTH];
	        if (lastIndex > lastLastIndex) {
	          output.push(string.slice(lastLastIndex, match.index));
	          // Fix browsers whose `exec` methods don't consistently return `undefined` for NPCG
	          if (!NPCG && match[LENGTH] > 1) match[0].replace(separator2, function () {
	            for (i = 1; i < arguments[LENGTH] - 2; i++) {
	              if (arguments[i] === undefined) match[i] = undefined;
	            }
	          });
	          if (match[LENGTH] > 1 && match.index < string[LENGTH]) $push.apply(output, match.slice(1));
	          lastLength = match[0][LENGTH];
	          lastLastIndex = lastIndex;
	          if (output[LENGTH] >= splitLimit) break;
	        }
	        if (separatorCopy[LAST_INDEX] === match.index) separatorCopy[LAST_INDEX]++; // Avoid an infinite loop
	      }
	      if (lastLastIndex === string[LENGTH]) {
	        if (lastLength || !separatorCopy.test('')) output.push('');
	      } else output.push(string.slice(lastLastIndex));
	      return output[LENGTH] > splitLimit ? output.slice(0, splitLimit) : output;
	    };
	    // Chakra, V8
	  } else if ('0'[$SPLIT](undefined, 0)[LENGTH]) {
	      $split = function $split(separator, limit) {
	        return separator === undefined && limit === 0 ? [] : _split.call(this, separator, limit);
	      };
	    }
	  // 21.1.3.17 String.prototype.split(separator, limit)
	  return [function split(separator, limit) {
	    var O = defined(this),
	        fn = separator == undefined ? undefined : separator[SPLIT];
	    return fn !== undefined ? fn.call(separator, O, limit) : $split.call(String(O), separator, limit);
	  }, $split];
	});

/***/ },
/* 202 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var LIBRARY = __webpack_require__(52),
	    global = __webpack_require__(7),
	    ctx = __webpack_require__(23),
	    classof = __webpack_require__(76),
	    $export = __webpack_require__(12),
	    isObject = __webpack_require__(16),
	    anObject = __webpack_require__(15),
	    aFunction = __webpack_require__(24),
	    anInstance = __webpack_require__(91),
	    forOf = __webpack_require__(203),
	    setProto = __webpack_require__(74).set,
	    speciesConstructor = __webpack_require__(204),
	    task = __webpack_require__(205).set,
	    microtask = __webpack_require__(206),
	    PROMISE = 'Promise',
	    TypeError = global.TypeError,
	    process = global.process,
	    $Promise = global[PROMISE],
	    isNode = classof(process) == 'process',
	    empty = function empty() {/* empty */},
	    Internal,
	    GenericPromiseCapability,
	    Wrapper;

	var USE_NATIVE = !!function () {
	  try {
	    // correct subclassing with @@species support
	    var promise = $Promise.resolve(1),
	        FakePromise = (promise.constructor = {})[__webpack_require__(28)('species')] = function (exec) {
	      exec(empty, empty);
	    };
	    // unhandled rejections tracking support, NodeJS Promise without it fails @@species test
	    return (isNode || typeof PromiseRejectionEvent == 'function') && promise.then(empty) instanceof FakePromise;
	  } catch (e) {/* empty */}
	}();

	// helpers
	var sameConstructor = function sameConstructor(a, b) {
	  // with library wrapper special case
	  return a === b || a === $Promise && b === Wrapper;
	};
	var isThenable = function isThenable(it) {
	  var then;
	  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
	};
	var newPromiseCapability = function newPromiseCapability(C) {
	  return sameConstructor($Promise, C) ? new PromiseCapability(C) : new GenericPromiseCapability(C);
	};
	var PromiseCapability = GenericPromiseCapability = function GenericPromiseCapability(C) {
	  var resolve, reject;
	  this.promise = new C(function ($$resolve, $$reject) {
	    if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
	    resolve = $$resolve;
	    reject = $$reject;
	  });
	  this.resolve = aFunction(resolve);
	  this.reject = aFunction(reject);
	};
	var perform = function perform(exec) {
	  try {
	    exec();
	  } catch (e) {
	    return { error: e };
	  }
	};
	var notify = function notify(promise, isReject) {
	  if (promise._n) return;
	  promise._n = true;
	  var chain = promise._c;
	  microtask(function () {
	    var value = promise._v,
	        ok = promise._s == 1,
	        i = 0;
	    var run = function run(reaction) {
	      var handler = ok ? reaction.ok : reaction.fail,
	          resolve = reaction.resolve,
	          reject = reaction.reject,
	          result,
	          then;
	      try {
	        if (handler) {
	          if (!ok) {
	            if (promise._h == 2) onHandleUnhandled(promise);
	            promise._h = 1;
	          }
	          result = handler === true ? value : handler(value);
	          if (result === reaction.promise) {
	            reject(TypeError('Promise-chain cycle'));
	          } else if (then = isThenable(result)) {
	            then.call(result, resolve, reject);
	          } else resolve(result);
	        } else reject(value);
	      } catch (e) {
	        reject(e);
	      }
	    };
	    while (chain.length > i) {
	      run(chain[i++]);
	    } // variable length - can't use forEach
	    promise._c = [];
	    promise._n = false;
	    if (isReject && !promise._h) onUnhandled(promise);
	  });
	};
	var onUnhandled = function onUnhandled(promise) {
	  task.call(global, function () {
	    var value = promise._v,
	        abrupt,
	        handler,
	        console;
	    if (isUnhandled(promise)) {
	      abrupt = perform(function () {
	        if (isNode) {
	          process.emit('unhandledRejection', value, promise);
	        } else if (handler = global.onunhandledrejection) {
	          handler({ promise: promise, reason: value });
	        } else if ((console = global.console) && console.error) {
	          console.error('Unhandled promise rejection', value);
	        }
	      });
	      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
	      promise._h = isNode || isUnhandled(promise) ? 2 : 1;
	    }promise._a = undefined;
	    if (abrupt) throw abrupt.error;
	  });
	};
	var isUnhandled = function isUnhandled(promise) {
	  if (promise._h == 1) return false;
	  var chain = promise._a || promise._c,
	      i = 0,
	      reaction;
	  while (chain.length > i) {
	    reaction = chain[i++];
	    if (reaction.fail || !isUnhandled(reaction.promise)) return false;
	  }return true;
	};
	var onHandleUnhandled = function onHandleUnhandled(promise) {
	  task.call(global, function () {
	    var handler;
	    if (isNode) {
	      process.emit('rejectionHandled', promise);
	    } else if (handler = global.onrejectionhandled) {
	      handler({ promise: promise, reason: promise._v });
	    }
	  });
	};
	var $reject = function $reject(value) {
	  var promise = this;
	  if (promise._d) return;
	  promise._d = true;
	  promise = promise._w || promise; // unwrap
	  promise._v = value;
	  promise._s = 2;
	  if (!promise._a) promise._a = promise._c.slice();
	  notify(promise, true);
	};
	var $resolve = function $resolve(value) {
	  var promise = this,
	      then;
	  if (promise._d) return;
	  promise._d = true;
	  promise = promise._w || promise; // unwrap
	  try {
	    if (promise === value) throw TypeError("Promise can't be resolved itself");
	    if (then = isThenable(value)) {
	      microtask(function () {
	        var wrapper = { _w: promise, _d: false }; // wrap
	        try {
	          then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
	        } catch (e) {
	          $reject.call(wrapper, e);
	        }
	      });
	    } else {
	      promise._v = value;
	      promise._s = 1;
	      notify(promise, false);
	    }
	  } catch (e) {
	    $reject.call({ _w: promise, _d: false }, e); // wrap
	  }
	};

	// constructor polyfill
	if (!USE_NATIVE) {
	  // 25.4.3.1 Promise(executor)
	  $Promise = function Promise(executor) {
	    anInstance(this, $Promise, PROMISE, '_h');
	    aFunction(executor);
	    Internal.call(this);
	    try {
	      executor(ctx($resolve, this, 1), ctx($reject, this, 1));
	    } catch (err) {
	      $reject.call(this, err);
	    }
	  };
	  Internal = function Promise(executor) {
	    this._c = []; // <- awaiting reactions
	    this._a = undefined; // <- checked in isUnhandled reactions
	    this._s = 0; // <- state
	    this._d = false; // <- done
	    this._v = undefined; // <- value
	    this._h = 0; // <- rejection state, 0 - default, 1 - handled, 2 - unhandled
	    this._n = false; // <- notify
	  };
	  Internal.prototype = __webpack_require__(207)($Promise.prototype, {
	    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
	    then: function then(onFulfilled, onRejected) {
	      var reaction = newPromiseCapability(speciesConstructor(this, $Promise));
	      reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
	      reaction.fail = typeof onRejected == 'function' && onRejected;
	      this._c.push(reaction);
	      if (this._a) this._a.push(reaction);
	      if (this._s) notify(this, false);
	      return reaction.promise;
	    },
	    // 25.4.5.1 Promise.prototype.catch(onRejected)
	    'catch': function _catch(onRejected) {
	      return this.then(undefined, onRejected);
	    }
	  });
	  PromiseCapability = function PromiseCapability() {
	    var promise = new Internal();
	    this.promise = promise;
	    this.resolve = ctx($resolve, promise, 1);
	    this.reject = ctx($reject, promise, 1);
	  };
	}

	$export($export.G + $export.W + $export.F * !USE_NATIVE, { Promise: $Promise });
	__webpack_require__(27)($Promise, PROMISE);
	__webpack_require__(190)(PROMISE);
	Wrapper = __webpack_require__(8)[PROMISE];

	// statics
	$export($export.S + $export.F * !USE_NATIVE, PROMISE, {
	  // 25.4.4.5 Promise.reject(r)
	  reject: function reject(r) {
	    var capability = newPromiseCapability(this),
	        $$reject = capability.reject;
	    $$reject(r);
	    return capability.promise;
	  }
	});
	$export($export.S + $export.F * (LIBRARY || !USE_NATIVE), PROMISE, {
	  // 25.4.4.6 Promise.resolve(x)
	  resolve: function resolve(x) {
	    // instanceof instead of internal slot check because we should fix it without replacement native Promise core
	    if (x instanceof $Promise && sameConstructor(x.constructor, this)) return x;
	    var capability = newPromiseCapability(this),
	        $$resolve = capability.resolve;
	    $$resolve(x);
	    return capability.promise;
	  }
	});
	$export($export.S + $export.F * !(USE_NATIVE && __webpack_require__(164)(function (iter) {
	  $Promise.all(iter)['catch'](empty);
	})), PROMISE, {
	  // 25.4.4.1 Promise.all(iterable)
	  all: function all(iterable) {
	    var C = this,
	        capability = newPromiseCapability(C),
	        resolve = capability.resolve,
	        reject = capability.reject;
	    var abrupt = perform(function () {
	      var values = [],
	          index = 0,
	          remaining = 1;
	      forOf(iterable, false, function (promise) {
	        var $index = index++,
	            alreadyCalled = false;
	        values.push(undefined);
	        remaining++;
	        C.resolve(promise).then(function (value) {
	          if (alreadyCalled) return;
	          alreadyCalled = true;
	          values[$index] = value;
	          --remaining || resolve(values);
	        }, reject);
	      });
	      --remaining || resolve(values);
	    });
	    if (abrupt) reject(abrupt.error);
	    return capability.promise;
	  },
	  // 25.4.4.4 Promise.race(iterable)
	  race: function race(iterable) {
	    var C = this,
	        capability = newPromiseCapability(C),
	        reject = capability.reject;
	    var abrupt = perform(function () {
	      forOf(iterable, false, function (promise) {
	        C.resolve(promise).then(capability.resolve, reject);
	      });
	    });
	    if (abrupt) reject(abrupt.error);
	    return capability.promise;
	  }
	});

/***/ },
/* 203 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var ctx = __webpack_require__(23),
	    call = __webpack_require__(161),
	    isArrayIter = __webpack_require__(162),
	    anObject = __webpack_require__(15),
	    toLength = __webpack_require__(37),
	    getIterFn = __webpack_require__(163);
	module.exports = function (iterable, entries, fn, that, ITERATOR) {
	  var iterFn = ITERATOR ? function () {
	    return iterable;
	  } : getIterFn(iterable),
	      f = ctx(fn, that, entries ? 2 : 1),
	      index = 0,
	      length,
	      step,
	      iterator;
	  if (typeof iterFn != 'function') throw TypeError(iterable + ' is not iterable!');
	  // fast case for arrays with default iterator
	  if (isArrayIter(iterFn)) for (length = toLength(iterable.length); length > index; index++) {
	    entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
	  } else for (iterator = iterFn.call(iterable); !(step = iterator.next()).done;) {
	    call(iterator, f, step.value, entries);
	  }
	};

/***/ },
/* 204 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// 7.3.20 SpeciesConstructor(O, defaultConstructor)
	var anObject = __webpack_require__(15),
	    aFunction = __webpack_require__(24),
	    SPECIES = __webpack_require__(28)('species');
	module.exports = function (O, D) {
	  var C = anObject(O).constructor,
	      S;
	  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
	};

/***/ },
/* 205 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var ctx = __webpack_require__(23),
	    invoke = __webpack_require__(79),
	    html = __webpack_require__(48),
	    cel = __webpack_require__(18),
	    global = __webpack_require__(7),
	    process = global.process,
	    setTask = global.setImmediate,
	    clearTask = global.clearImmediate,
	    MessageChannel = global.MessageChannel,
	    counter = 0,
	    queue = {},
	    ONREADYSTATECHANGE = 'onreadystatechange',
	    defer,
	    channel,
	    port;
	var run = function run() {
	  var id = +this;
	  if (queue.hasOwnProperty(id)) {
	    var fn = queue[id];
	    delete queue[id];
	    fn();
	  }
	};
	var listener = function listener(event) {
	  run.call(event.data);
	};
	// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
	if (!setTask || !clearTask) {
	  setTask = function setImmediate(fn) {
	    var args = [],
	        i = 1;
	    while (arguments.length > i) {
	      args.push(arguments[i++]);
	    }queue[++counter] = function () {
	      invoke(typeof fn == 'function' ? fn : Function(fn), args);
	    };
	    defer(counter);
	    return counter;
	  };
	  clearTask = function clearImmediate(id) {
	    delete queue[id];
	  };
	  // Node.js 0.8-
	  if (__webpack_require__(34)(process) == 'process') {
	    defer = function defer(id) {
	      process.nextTick(ctx(run, id, 1));
	    };
	    // Browsers with MessageChannel, includes WebWorkers
	  } else if (MessageChannel) {
	      channel = new MessageChannel();
	      port = channel.port2;
	      channel.port1.onmessage = listener;
	      defer = ctx(port.postMessage, port, 1);
	      // Browsers with postMessage, skip WebWorkers
	      // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
	    } else if (global.addEventListener && typeof postMessage == 'function' && !global.importScripts) {
	        defer = function defer(id) {
	          global.postMessage(id + '', '*');
	        };
	        global.addEventListener('message', listener, false);
	        // IE8-
	      } else if (ONREADYSTATECHANGE in cel('script')) {
	          defer = function defer(id) {
	            html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function () {
	              html.removeChild(this);
	              run.call(id);
	            };
	          };
	          // Rest old browsers
	        } else {
	            defer = function defer(id) {
	              setTimeout(ctx(run, id, 1), 0);
	            };
	          }
	}
	module.exports = {
	  set: setTask,
	  clear: clearTask
	};

/***/ },
/* 206 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var global = __webpack_require__(7),
	    macrotask = __webpack_require__(205).set,
	    Observer = global.MutationObserver || global.WebKitMutationObserver,
	    process = global.process,
	    Promise = global.Promise,
	    isNode = __webpack_require__(34)(process) == 'process',
	    head,
	    last,
	    notify;

	var flush = function flush() {
	  var parent, domain, fn;
	  if (isNode && (parent = process.domain)) {
	    process.domain = null;
	    parent.exit();
	  }
	  while (head) {
	    domain = head.domain;
	    fn = head.fn;
	    if (domain) domain.enter();
	    fn(); // <- currently we use it only for Promise - try / catch not required
	    if (domain) domain.exit();
	    head = head.next;
	  }last = undefined;
	  if (parent) parent.enter();
	};

	// Node.js
	if (isNode) {
	  notify = function notify() {
	    process.nextTick(flush);
	  };
	  // browsers with MutationObserver
	} else if (Observer) {
	    var toggle = 1,
	        node = document.createTextNode('');
	    new Observer(flush).observe(node, { characterData: true }); // eslint-disable-line no-new
	    notify = function notify() {
	      node.data = toggle = -toggle;
	    };
	    // environments with maybe non-completely correct, but existent Promise
	  } else if (Promise && Promise.resolve) {
	      notify = function notify() {
	        Promise.resolve().then(flush);
	      };
	      // for other environments - macrotask based on:
	      // - setImmediate
	      // - MessageChannel
	      // - window.postMessag
	      // - onreadystatechange
	      // - setTimeout
	    } else {
	        notify = function notify() {
	          // strange IE + webpack dev server bug - use .call(global)
	          macrotask.call(global, flush);
	        };
	      }

	module.exports = function (fn) {
	  var task = { fn: fn, next: undefined, domain: isNode && process.domain };
	  if (last) last.next = task;
	  if (!head) {
	    head = task;
	    notify();
	  }last = task;
	};

/***/ },
/* 207 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var redefine = __webpack_require__(21);
	module.exports = function (target, src, safe) {
	  for (var key in src) {
	    redefine(target, key, src[key], safe);
	  }return target;
	};

/***/ },
/* 208 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var strong = __webpack_require__(209);

	// 23.1 Map Objects
	module.exports = __webpack_require__(210)('Map', function (get) {
	  return function Map() {
	    return get(this, arguments.length > 0 ? arguments[0] : undefined);
	  };
	}, {
	  // 23.1.3.6 Map.prototype.get(key)
	  get: function get(key) {
	    var entry = strong.getEntry(this, key);
	    return entry && entry.v;
	  },
	  // 23.1.3.9 Map.prototype.set(key, value)
	  set: function set(key, value) {
	    return strong.def(this, key === 0 ? 0 : key, value);
	  }
	}, strong, true);

/***/ },
/* 209 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var dP = __webpack_require__(14).f,
	    create = __webpack_require__(46),
	    hide = __webpack_require__(13),
	    redefineAll = __webpack_require__(207),
	    ctx = __webpack_require__(23),
	    anInstance = __webpack_require__(91),
	    defined = __webpack_require__(35),
	    forOf = __webpack_require__(203),
	    $iterDefine = __webpack_require__(130),
	    step = __webpack_require__(192),
	    setSpecies = __webpack_require__(190),
	    DESCRIPTORS = __webpack_require__(10),
	    fastKey = __webpack_require__(25).fastKey,
	    SIZE = DESCRIPTORS ? '_s' : 'size';

	var getEntry = function getEntry(that, key) {
	  // fast case
	  var index = fastKey(key),
	      entry;
	  if (index !== 'F') return that._i[index];
	  // frozen object case
	  for (entry = that._f; entry; entry = entry.n) {
	    if (entry.k == key) return entry;
	  }
	};

	module.exports = {
	  getConstructor: function getConstructor(wrapper, NAME, IS_MAP, ADDER) {
	    var C = wrapper(function (that, iterable) {
	      anInstance(that, C, NAME, '_i');
	      that._i = create(null); // index
	      that._f = undefined; // first entry
	      that._l = undefined; // last entry
	      that[SIZE] = 0; // size
	      if (iterable != undefined) forOf(iterable, IS_MAP, that[ADDER], that);
	    });
	    redefineAll(C.prototype, {
	      // 23.1.3.1 Map.prototype.clear()
	      // 23.2.3.2 Set.prototype.clear()
	      clear: function clear() {
	        for (var that = this, data = that._i, entry = that._f; entry; entry = entry.n) {
	          entry.r = true;
	          if (entry.p) entry.p = entry.p.n = undefined;
	          delete data[entry.i];
	        }
	        that._f = that._l = undefined;
	        that[SIZE] = 0;
	      },
	      // 23.1.3.3 Map.prototype.delete(key)
	      // 23.2.3.4 Set.prototype.delete(value)
	      'delete': function _delete(key) {
	        var that = this,
	            entry = getEntry(that, key);
	        if (entry) {
	          var next = entry.n,
	              prev = entry.p;
	          delete that._i[entry.i];
	          entry.r = true;
	          if (prev) prev.n = next;
	          if (next) next.p = prev;
	          if (that._f == entry) that._f = next;
	          if (that._l == entry) that._l = prev;
	          that[SIZE]--;
	        }return !!entry;
	      },
	      // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
	      // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
	      forEach: function forEach(callbackfn /*, that = undefined */) {
	        anInstance(this, C, 'forEach');
	        var f = ctx(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3),
	            entry;
	        while (entry = entry ? entry.n : this._f) {
	          f(entry.v, entry.k, this);
	          // revert to the last existing entry
	          while (entry && entry.r) {
	            entry = entry.p;
	          }
	        }
	      },
	      // 23.1.3.7 Map.prototype.has(key)
	      // 23.2.3.7 Set.prototype.has(value)
	      has: function has(key) {
	        return !!getEntry(this, key);
	      }
	    });
	    if (DESCRIPTORS) dP(C.prototype, 'size', {
	      get: function get() {
	        return defined(this[SIZE]);
	      }
	    });
	    return C;
	  },
	  def: function def(that, key, value) {
	    var entry = getEntry(that, key),
	        prev,
	        index;
	    // change existing entry
	    if (entry) {
	      entry.v = value;
	      // create new entry
	    } else {
	        that._l = entry = {
	          i: index = fastKey(key, true), // <- index
	          k: key, // <- key
	          v: value, // <- value
	          p: prev = that._l, // <- previous entry
	          n: undefined, // <- next entry
	          r: false // <- removed
	        };
	        if (!that._f) that._f = entry;
	        if (prev) prev.n = entry;
	        that[SIZE]++;
	        // add to index
	        if (index !== 'F') that._i[index] = entry;
	      }return that;
	  },
	  getEntry: getEntry,
	  setStrong: function setStrong(C, NAME, IS_MAP) {
	    // add .keys, .values, .entries, [@@iterator]
	    // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
	    $iterDefine(C, NAME, function (iterated, kind) {
	      this._t = iterated; // target
	      this._k = kind; // kind
	      this._l = undefined; // previous
	    }, function () {
	      var that = this,
	          kind = that._k,
	          entry = that._l;
	      // revert to the last existing entry
	      while (entry && entry.r) {
	        entry = entry.p;
	      } // get next entry
	      if (!that._t || !(that._l = entry = entry ? entry.n : that._t._f)) {
	        // or finish the iteration
	        that._t = undefined;
	        return step(1);
	      }
	      // return step by kind
	      if (kind == 'keys') return step(0, entry.k);
	      if (kind == 'values') return step(0, entry.v);
	      return step(0, [entry.k, entry.v]);
	    }, IS_MAP ? 'entries' : 'values', !IS_MAP, true);

	    // add [@@species], 23.1.2.2, 23.2.2.2
	    setSpecies(NAME);
	  }
	};

/***/ },
/* 210 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var global = __webpack_require__(7),
	    $export = __webpack_require__(12),
	    redefine = __webpack_require__(21),
	    redefineAll = __webpack_require__(207),
	    meta = __webpack_require__(25),
	    forOf = __webpack_require__(203),
	    anInstance = __webpack_require__(91),
	    isObject = __webpack_require__(16),
	    fails = __webpack_require__(11),
	    $iterDetect = __webpack_require__(164),
	    setToStringTag = __webpack_require__(27),
	    inheritIfRequired = __webpack_require__(89);

	module.exports = function (NAME, wrapper, methods, common, IS_MAP, IS_WEAK) {
	  var Base = global[NAME],
	      C = Base,
	      ADDER = IS_MAP ? 'set' : 'add',
	      proto = C && C.prototype,
	      O = {};
	  var fixMethod = function fixMethod(KEY) {
	    var fn = proto[KEY];
	    redefine(proto, KEY, KEY == 'delete' ? function (a) {
	      return IS_WEAK && !isObject(a) ? false : fn.call(this, a === 0 ? 0 : a);
	    } : KEY == 'has' ? function has(a) {
	      return IS_WEAK && !isObject(a) ? false : fn.call(this, a === 0 ? 0 : a);
	    } : KEY == 'get' ? function get(a) {
	      return IS_WEAK && !isObject(a) ? undefined : fn.call(this, a === 0 ? 0 : a);
	    } : KEY == 'add' ? function add(a) {
	      fn.call(this, a === 0 ? 0 : a);return this;
	    } : function set(a, b) {
	      fn.call(this, a === 0 ? 0 : a, b);return this;
	    });
	  };
	  if (typeof C != 'function' || !(IS_WEAK || proto.forEach && !fails(function () {
	    new C().entries().next();
	  }))) {
	    // create collection constructor
	    C = common.getConstructor(wrapper, NAME, IS_MAP, ADDER);
	    redefineAll(C.prototype, methods);
	    meta.NEED = true;
	  } else {
	    var instance = new C()
	    // early implementations not supports chaining
	    ,
	        HASNT_CHAINING = instance[ADDER](IS_WEAK ? {} : -0, 1) != instance
	    // V8 ~  Chromium 40- weak-collections throws on primitives, but should return false
	    ,
	        THROWS_ON_PRIMITIVES = fails(function () {
	      instance.has(1);
	    })
	    // most early implementations doesn't supports iterables, most modern - not close it correctly
	    ,
	        ACCEPT_ITERABLES = $iterDetect(function (iter) {
	      new C(iter);
	    }) // eslint-disable-line no-new
	    // for early implementations -0 and +0 not the same
	    ,
	        BUGGY_ZERO = !IS_WEAK && fails(function () {
	      // V8 ~ Chromium 42- fails only with 5+ elements
	      var $instance = new C(),
	          index = 5;
	      while (index--) {
	        $instance[ADDER](index, index);
	      }return !$instance.has(-0);
	    });
	    if (!ACCEPT_ITERABLES) {
	      C = wrapper(function (target, iterable) {
	        anInstance(target, C, NAME);
	        var that = inheritIfRequired(new Base(), target, C);
	        if (iterable != undefined) forOf(iterable, IS_MAP, that[ADDER], that);
	        return that;
	      });
	      C.prototype = proto;
	      proto.constructor = C;
	    }
	    if (THROWS_ON_PRIMITIVES || BUGGY_ZERO) {
	      fixMethod('delete');
	      fixMethod('has');
	      IS_MAP && fixMethod('get');
	    }
	    if (BUGGY_ZERO || HASNT_CHAINING) fixMethod(ADDER);
	    // weak collections should not contains .clear method
	    if (IS_WEAK && proto.clear) delete proto.clear;
	  }

	  setToStringTag(C, NAME);

	  O[NAME] = C;
	  $export($export.G + $export.W + $export.F * (C != Base), O);

	  if (!IS_WEAK) common.setStrong(C, NAME, IS_MAP);

	  return C;
	};

/***/ },
/* 211 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var strong = __webpack_require__(209);

	// 23.2 Set Objects
	module.exports = __webpack_require__(210)('Set', function (get) {
	  return function Set() {
	    return get(this, arguments.length > 0 ? arguments[0] : undefined);
	  };
	}, {
	  // 23.2.3.1 Set.prototype.add(value)
	  add: function add(value) {
	    return strong.def(this, value = value === 0 ? 0 : value, value);
	  }
	}, strong);

/***/ },
/* 212 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var each = __webpack_require__(171)(0),
	    redefine = __webpack_require__(21),
	    meta = __webpack_require__(25),
	    assign = __webpack_require__(70),
	    weak = __webpack_require__(213),
	    isObject = __webpack_require__(16),
	    has = __webpack_require__(9),
	    getWeak = meta.getWeak,
	    isExtensible = Object.isExtensible,
	    uncaughtFrozenStore = weak.ufstore,
	    tmp = {},
	    InternalMap;

	var wrapper = function wrapper(get) {
	  return function WeakMap() {
	    return get(this, arguments.length > 0 ? arguments[0] : undefined);
	  };
	};

	var methods = {
	  // 23.3.3.3 WeakMap.prototype.get(key)
	  get: function get(key) {
	    if (isObject(key)) {
	      var data = getWeak(key);
	      if (data === true) return uncaughtFrozenStore(this).get(key);
	      return data ? data[this._i] : undefined;
	    }
	  },
	  // 23.3.3.5 WeakMap.prototype.set(key, value)
	  set: function set(key, value) {
	    return weak.def(this, key, value);
	  }
	};

	// 23.3 WeakMap Objects
	var $WeakMap = module.exports = __webpack_require__(210)('WeakMap', wrapper, methods, weak, true, true);

	// IE11 WeakMap frozen keys fix
	if (new $WeakMap().set((Object.freeze || Object)(tmp), 7).get(tmp) != 7) {
	  InternalMap = weak.getConstructor(wrapper);
	  assign(InternalMap.prototype, methods);
	  meta.NEED = true;
	  each(['delete', 'has', 'get', 'set'], function (key) {
	    var proto = $WeakMap.prototype,
	        method = proto[key];
	    redefine(proto, key, function (a, b) {
	      // store frozen objects on internal weakmap shim
	      if (isObject(a) && !isExtensible(a)) {
	        if (!this._f) this._f = new InternalMap();
	        var result = this._f[key](a, b);
	        return key == 'set' ? this : result;
	        // store all the rest on native weakmap
	      }return method.call(this, a, b);
	    });
	  });
	}

/***/ },
/* 213 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var redefineAll = __webpack_require__(207),
	    getWeak = __webpack_require__(25).getWeak,
	    anObject = __webpack_require__(15),
	    isObject = __webpack_require__(16),
	    anInstance = __webpack_require__(91),
	    forOf = __webpack_require__(203),
	    createArrayMethod = __webpack_require__(171),
	    $has = __webpack_require__(9),
	    arrayFind = createArrayMethod(5),
	    arrayFindIndex = createArrayMethod(6),
	    id = 0;

	// fallback for uncaught frozen keys
	var uncaughtFrozenStore = function uncaughtFrozenStore(that) {
	  return that._l || (that._l = new UncaughtFrozenStore());
	};
	var UncaughtFrozenStore = function UncaughtFrozenStore() {
	  this.a = [];
	};
	var findUncaughtFrozen = function findUncaughtFrozen(store, key) {
	  return arrayFind(store.a, function (it) {
	    return it[0] === key;
	  });
	};
	UncaughtFrozenStore.prototype = {
	  get: function get(key) {
	    var entry = findUncaughtFrozen(this, key);
	    if (entry) return entry[1];
	  },
	  has: function has(key) {
	    return !!findUncaughtFrozen(this, key);
	  },
	  set: function set(key, value) {
	    var entry = findUncaughtFrozen(this, key);
	    if (entry) entry[1] = value;else this.a.push([key, value]);
	  },
	  'delete': function _delete(key) {
	    var index = arrayFindIndex(this.a, function (it) {
	      return it[0] === key;
	    });
	    if (~index) this.a.splice(index, 1);
	    return !! ~index;
	  }
	};

	module.exports = {
	  getConstructor: function getConstructor(wrapper, NAME, IS_MAP, ADDER) {
	    var C = wrapper(function (that, iterable) {
	      anInstance(that, C, NAME, '_i');
	      that._i = id++; // collection id
	      that._l = undefined; // leak store for uncaught frozen objects
	      if (iterable != undefined) forOf(iterable, IS_MAP, that[ADDER], that);
	    });
	    redefineAll(C.prototype, {
	      // 23.3.3.2 WeakMap.prototype.delete(key)
	      // 23.4.3.3 WeakSet.prototype.delete(value)
	      'delete': function _delete(key) {
	        if (!isObject(key)) return false;
	        var data = getWeak(key);
	        if (data === true) return uncaughtFrozenStore(this)['delete'](key);
	        return data && $has(data, this._i) && delete data[this._i];
	      },
	      // 23.3.3.4 WeakMap.prototype.has(key)
	      // 23.4.3.4 WeakSet.prototype.has(value)
	      has: function has(key) {
	        if (!isObject(key)) return false;
	        var data = getWeak(key);
	        if (data === true) return uncaughtFrozenStore(this).has(key);
	        return data && $has(data, this._i);
	      }
	    });
	    return C;
	  },
	  def: function def(that, key, value) {
	    var data = getWeak(anObject(key), true);
	    if (data === true) uncaughtFrozenStore(that).set(key, value);else data[that._i] = value;
	    return that;
	  },
	  ufstore: uncaughtFrozenStore
	};

/***/ },
/* 214 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var weak = __webpack_require__(213);

	// 23.4 WeakSet Objects
	__webpack_require__(210)('WeakSet', function (get) {
	  return function WeakSet() {
	    return get(this, arguments.length > 0 ? arguments[0] : undefined);
	  };
	}, {
	  // 23.4.3.1 WeakSet.prototype.add(value)
	  add: function add(value) {
	    return weak.def(this, value, true);
	  }
	}, weak, false, true);

/***/ },
/* 215 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var $export = __webpack_require__(12),
	    $typed = __webpack_require__(216),
	    buffer = __webpack_require__(217),
	    anObject = __webpack_require__(15),
	    toIndex = __webpack_require__(39),
	    toLength = __webpack_require__(37),
	    isObject = __webpack_require__(16),
	    TYPED_ARRAY = __webpack_require__(28)('typed_array'),
	    ArrayBuffer = __webpack_require__(7).ArrayBuffer,
	    speciesConstructor = __webpack_require__(204),
	    $ArrayBuffer = buffer.ArrayBuffer,
	    $DataView = buffer.DataView,
	    $isView = $typed.ABV && ArrayBuffer.isView,
	    $slice = $ArrayBuffer.prototype.slice,
	    VIEW = $typed.VIEW,
	    ARRAY_BUFFER = 'ArrayBuffer';

	$export($export.G + $export.W + $export.F * (ArrayBuffer !== $ArrayBuffer), { ArrayBuffer: $ArrayBuffer });

	$export($export.S + $export.F * !$typed.CONSTR, ARRAY_BUFFER, {
	  // 24.1.3.1 ArrayBuffer.isView(arg)
	  isView: function isView(it) {
	    return $isView && $isView(it) || isObject(it) && VIEW in it;
	  }
	});

	$export($export.P + $export.U + $export.F * __webpack_require__(11)(function () {
	  return !new $ArrayBuffer(2).slice(1, undefined).byteLength;
	}), ARRAY_BUFFER, {
	  // 24.1.4.3 ArrayBuffer.prototype.slice(start, end)
	  slice: function slice(start, end) {
	    if ($slice !== undefined && end === undefined) return $slice.call(anObject(this), start); // FF fix
	    var len = anObject(this).byteLength,
	        first = toIndex(start, len),
	        final = toIndex(end === undefined ? len : end, len),
	        result = new (speciesConstructor(this, $ArrayBuffer))(toLength(final - first)),
	        viewS = new $DataView(this),
	        viewT = new $DataView(result),
	        index = 0;
	    while (first < final) {
	      viewT.setUint8(index++, viewS.getUint8(first++));
	    }return result;
	  }
	});

	__webpack_require__(190)(ARRAY_BUFFER);

/***/ },
/* 216 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var global = __webpack_require__(7),
	    hide = __webpack_require__(13),
	    uid = __webpack_require__(22),
	    TYPED = uid('typed_array'),
	    VIEW = uid('view'),
	    ABV = !!(global.ArrayBuffer && global.DataView),
	    CONSTR = ABV,
	    i = 0,
	    l = 9,
	    Typed;

	var TypedArrayConstructors = 'Int8Array,Uint8Array,Uint8ClampedArray,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array'.split(',');

	while (i < l) {
	  if (Typed = global[TypedArrayConstructors[i++]]) {
	    hide(Typed.prototype, TYPED, true);
	    hide(Typed.prototype, VIEW, true);
	  } else CONSTR = false;
	}

	module.exports = {
	  ABV: ABV,
	  CONSTR: CONSTR,
	  TYPED: TYPED,
	  VIEW: VIEW
	};

/***/ },
/* 217 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var global = __webpack_require__(7),
	    DESCRIPTORS = __webpack_require__(10),
	    LIBRARY = __webpack_require__(52),
	    $typed = __webpack_require__(216),
	    hide = __webpack_require__(13),
	    redefineAll = __webpack_require__(207),
	    fails = __webpack_require__(11),
	    anInstance = __webpack_require__(91),
	    toInteger = __webpack_require__(38),
	    toLength = __webpack_require__(37),
	    gOPN = __webpack_require__(50).f,
	    dP = __webpack_require__(14).f,
	    arrayFill = __webpack_require__(186),
	    setToStringTag = __webpack_require__(27),
	    ARRAY_BUFFER = 'ArrayBuffer',
	    DATA_VIEW = 'DataView',
	    PROTOTYPE = 'prototype',
	    WRONG_LENGTH = 'Wrong length!',
	    WRONG_INDEX = 'Wrong index!',
	    $ArrayBuffer = global[ARRAY_BUFFER],
	    $DataView = global[DATA_VIEW],
	    Math = global.Math,
	    parseInt = global.parseInt,
	    RangeError = global.RangeError,
	    Infinity = global.Infinity,
	    BaseBuffer = $ArrayBuffer,
	    abs = Math.abs,
	    pow = Math.pow,
	    min = Math.min,
	    floor = Math.floor,
	    log = Math.log,
	    LN2 = Math.LN2,
	    BUFFER = 'buffer',
	    BYTE_LENGTH = 'byteLength',
	    BYTE_OFFSET = 'byteOffset',
	    $BUFFER = DESCRIPTORS ? '_b' : BUFFER,
	    $LENGTH = DESCRIPTORS ? '_l' : BYTE_LENGTH,
	    $OFFSET = DESCRIPTORS ? '_o' : BYTE_OFFSET;

	// IEEE754 conversions based on https://github.com/feross/ieee754
	var packIEEE754 = function packIEEE754(value, mLen, nBytes) {
	  var buffer = Array(nBytes),
	      eLen = nBytes * 8 - mLen - 1,
	      eMax = (1 << eLen) - 1,
	      eBias = eMax >> 1,
	      rt = mLen === 23 ? pow(2, -24) - pow(2, -77) : 0,
	      i = 0,
	      s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0,
	      e,
	      m,
	      c;
	  value = abs(value);
	  if (value != value || value === Infinity) {
	    m = value != value ? 1 : 0;
	    e = eMax;
	  } else {
	    e = floor(log(value) / LN2);
	    if (value * (c = pow(2, -e)) < 1) {
	      e--;
	      c *= 2;
	    }
	    if (e + eBias >= 1) {
	      value += rt / c;
	    } else {
	      value += rt * pow(2, 1 - eBias);
	    }
	    if (value * c >= 2) {
	      e++;
	      c /= 2;
	    }
	    if (e + eBias >= eMax) {
	      m = 0;
	      e = eMax;
	    } else if (e + eBias >= 1) {
	      m = (value * c - 1) * pow(2, mLen);
	      e = e + eBias;
	    } else {
	      m = value * pow(2, eBias - 1) * pow(2, mLen);
	      e = 0;
	    }
	  }
	  for (; mLen >= 8; buffer[i++] = m & 255, m /= 256, mLen -= 8) {}
	  e = e << mLen | m;
	  eLen += mLen;
	  for (; eLen > 0; buffer[i++] = e & 255, e /= 256, eLen -= 8) {}
	  buffer[--i] |= s * 128;
	  return buffer;
	};
	var unpackIEEE754 = function unpackIEEE754(buffer, mLen, nBytes) {
	  var eLen = nBytes * 8 - mLen - 1,
	      eMax = (1 << eLen) - 1,
	      eBias = eMax >> 1,
	      nBits = eLen - 7,
	      i = nBytes - 1,
	      s = buffer[i--],
	      e = s & 127,
	      m;
	  s >>= 7;
	  for (; nBits > 0; e = e * 256 + buffer[i], i--, nBits -= 8) {}
	  m = e & (1 << -nBits) - 1;
	  e >>= -nBits;
	  nBits += mLen;
	  for (; nBits > 0; m = m * 256 + buffer[i], i--, nBits -= 8) {}
	  if (e === 0) {
	    e = 1 - eBias;
	  } else if (e === eMax) {
	    return m ? NaN : s ? -Infinity : Infinity;
	  } else {
	    m = m + pow(2, mLen);
	    e = e - eBias;
	  }return (s ? -1 : 1) * m * pow(2, e - mLen);
	};

	var unpackI32 = function unpackI32(bytes) {
	  return bytes[3] << 24 | bytes[2] << 16 | bytes[1] << 8 | bytes[0];
	};
	var packI8 = function packI8(it) {
	  return [it & 0xff];
	};
	var packI16 = function packI16(it) {
	  return [it & 0xff, it >> 8 & 0xff];
	};
	var packI32 = function packI32(it) {
	  return [it & 0xff, it >> 8 & 0xff, it >> 16 & 0xff, it >> 24 & 0xff];
	};
	var packF64 = function packF64(it) {
	  return packIEEE754(it, 52, 8);
	};
	var packF32 = function packF32(it) {
	  return packIEEE754(it, 23, 4);
	};

	var addGetter = function addGetter(C, key, internal) {
	  dP(C[PROTOTYPE], key, { get: function get() {
	      return this[internal];
	    } });
	};

	var get = function get(view, bytes, index, isLittleEndian) {
	  var numIndex = +index,
	      intIndex = toInteger(numIndex);
	  if (numIndex != intIndex || intIndex < 0 || intIndex + bytes > view[$LENGTH]) throw RangeError(WRONG_INDEX);
	  var store = view[$BUFFER]._b,
	      start = intIndex + view[$OFFSET],
	      pack = store.slice(start, start + bytes);
	  return isLittleEndian ? pack : pack.reverse();
	};
	var set = function set(view, bytes, index, conversion, value, isLittleEndian) {
	  var numIndex = +index,
	      intIndex = toInteger(numIndex);
	  if (numIndex != intIndex || intIndex < 0 || intIndex + bytes > view[$LENGTH]) throw RangeError(WRONG_INDEX);
	  var store = view[$BUFFER]._b,
	      start = intIndex + view[$OFFSET],
	      pack = conversion(+value);
	  for (var i = 0; i < bytes; i++) {
	    store[start + i] = pack[isLittleEndian ? i : bytes - i - 1];
	  }
	};

	var validateArrayBufferArguments = function validateArrayBufferArguments(that, length) {
	  anInstance(that, $ArrayBuffer, ARRAY_BUFFER);
	  var numberLength = +length,
	      byteLength = toLength(numberLength);
	  if (numberLength != byteLength) throw RangeError(WRONG_LENGTH);
	  return byteLength;
	};

	if (!$typed.ABV) {
	  $ArrayBuffer = function ArrayBuffer(length) {
	    var byteLength = validateArrayBufferArguments(this, length);
	    this._b = arrayFill.call(Array(byteLength), 0);
	    this[$LENGTH] = byteLength;
	  };

	  $DataView = function DataView(buffer, byteOffset, byteLength) {
	    anInstance(this, $DataView, DATA_VIEW);
	    anInstance(buffer, $ArrayBuffer, DATA_VIEW);
	    var bufferLength = buffer[$LENGTH],
	        offset = toInteger(byteOffset);
	    if (offset < 0 || offset > bufferLength) throw RangeError('Wrong offset!');
	    byteLength = byteLength === undefined ? bufferLength - offset : toLength(byteLength);
	    if (offset + byteLength > bufferLength) throw RangeError(WRONG_LENGTH);
	    this[$BUFFER] = buffer;
	    this[$OFFSET] = offset;
	    this[$LENGTH] = byteLength;
	  };

	  if (DESCRIPTORS) {
	    addGetter($ArrayBuffer, BYTE_LENGTH, '_l');
	    addGetter($DataView, BUFFER, '_b');
	    addGetter($DataView, BYTE_LENGTH, '_l');
	    addGetter($DataView, BYTE_OFFSET, '_o');
	  }

	  redefineAll($DataView[PROTOTYPE], {
	    getInt8: function getInt8(byteOffset) {
	      return get(this, 1, byteOffset)[0] << 24 >> 24;
	    },
	    getUint8: function getUint8(byteOffset) {
	      return get(this, 1, byteOffset)[0];
	    },
	    getInt16: function getInt16(byteOffset /*, littleEndian */) {
	      var bytes = get(this, 2, byteOffset, arguments[1]);
	      return (bytes[1] << 8 | bytes[0]) << 16 >> 16;
	    },
	    getUint16: function getUint16(byteOffset /*, littleEndian */) {
	      var bytes = get(this, 2, byteOffset, arguments[1]);
	      return bytes[1] << 8 | bytes[0];
	    },
	    getInt32: function getInt32(byteOffset /*, littleEndian */) {
	      return unpackI32(get(this, 4, byteOffset, arguments[1]));
	    },
	    getUint32: function getUint32(byteOffset /*, littleEndian */) {
	      return unpackI32(get(this, 4, byteOffset, arguments[1])) >>> 0;
	    },
	    getFloat32: function getFloat32(byteOffset /*, littleEndian */) {
	      return unpackIEEE754(get(this, 4, byteOffset, arguments[1]), 23, 4);
	    },
	    getFloat64: function getFloat64(byteOffset /*, littleEndian */) {
	      return unpackIEEE754(get(this, 8, byteOffset, arguments[1]), 52, 8);
	    },
	    setInt8: function setInt8(byteOffset, value) {
	      set(this, 1, byteOffset, packI8, value);
	    },
	    setUint8: function setUint8(byteOffset, value) {
	      set(this, 1, byteOffset, packI8, value);
	    },
	    setInt16: function setInt16(byteOffset, value /*, littleEndian */) {
	      set(this, 2, byteOffset, packI16, value, arguments[2]);
	    },
	    setUint16: function setUint16(byteOffset, value /*, littleEndian */) {
	      set(this, 2, byteOffset, packI16, value, arguments[2]);
	    },
	    setInt32: function setInt32(byteOffset, value /*, littleEndian */) {
	      set(this, 4, byteOffset, packI32, value, arguments[2]);
	    },
	    setUint32: function setUint32(byteOffset, value /*, littleEndian */) {
	      set(this, 4, byteOffset, packI32, value, arguments[2]);
	    },
	    setFloat32: function setFloat32(byteOffset, value /*, littleEndian */) {
	      set(this, 4, byteOffset, packF32, value, arguments[2]);
	    },
	    setFloat64: function setFloat64(byteOffset, value /*, littleEndian */) {
	      set(this, 8, byteOffset, packF64, value, arguments[2]);
	    }
	  });
	} else {
	  if (!fails(function () {
	    new $ArrayBuffer(); // eslint-disable-line no-new
	  }) || !fails(function () {
	    new $ArrayBuffer(.5); // eslint-disable-line no-new
	  })) {
	      $ArrayBuffer = function ArrayBuffer(length) {
	        return new BaseBuffer(validateArrayBufferArguments(this, length));
	      };
	      var ArrayBufferProto = $ArrayBuffer[PROTOTYPE] = BaseBuffer[PROTOTYPE];
	      for (var keys = gOPN(BaseBuffer), j = 0, key; keys.length > j;) {
	        if (!((key = keys[j++]) in $ArrayBuffer)) hide($ArrayBuffer, key, BaseBuffer[key]);
	      };
	      if (!LIBRARY) ArrayBufferProto.constructor = $ArrayBuffer;
	    }
	  // iOS Safari 7.x bug
	  var view = new $DataView(new $ArrayBuffer(2)),
	      $setInt8 = $DataView[PROTOTYPE].setInt8;
	  view.setInt8(0, 2147483648);
	  view.setInt8(1, 2147483649);
	  if (view.getInt8(0) || !view.getInt8(1)) redefineAll($DataView[PROTOTYPE], {
	    setInt8: function setInt8(byteOffset, value) {
	      $setInt8.call(this, byteOffset, value << 24 >> 24);
	    },
	    setUint8: function setUint8(byteOffset, value) {
	      $setInt8.call(this, byteOffset, value << 24 >> 24);
	    }
	  }, true);
	}
	setToStringTag($ArrayBuffer, ARRAY_BUFFER);
	setToStringTag($DataView, DATA_VIEW);
	hide($DataView[PROTOTYPE], $typed.VIEW, true);
	exports[ARRAY_BUFFER] = $ArrayBuffer;
	exports[DATA_VIEW] = $DataView;

/***/ },
/* 218 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var $export = __webpack_require__(12);
	$export($export.G + $export.W + $export.F * !__webpack_require__(216).ABV, {
	  DataView: __webpack_require__(217).DataView
	});

/***/ },
/* 219 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	__webpack_require__(220)('Int8', 1, function (init) {
	  return function Int8Array(data, byteOffset, length) {
	    return init(this, data, byteOffset, length);
	  };
	});

/***/ },
/* 220 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	if (__webpack_require__(10)) {
	  var LIBRARY = __webpack_require__(52),
	      global = __webpack_require__(7),
	      fails = __webpack_require__(11),
	      $export = __webpack_require__(12),
	      $typed = __webpack_require__(216),
	      $buffer = __webpack_require__(217),
	      ctx = __webpack_require__(23),
	      anInstance = __webpack_require__(91),
	      propertyDesc = __webpack_require__(20),
	      hide = __webpack_require__(13),
	      redefineAll = __webpack_require__(207),
	      isInteger = __webpack_require__(98),
	      toInteger = __webpack_require__(38),
	      toLength = __webpack_require__(37),
	      toIndex = __webpack_require__(39),
	      toPrimitive = __webpack_require__(19),
	      has = __webpack_require__(9),
	      same = __webpack_require__(72),
	      classof = __webpack_require__(76),
	      isObject = __webpack_require__(16),
	      toObject = __webpack_require__(59),
	      isArrayIter = __webpack_require__(162),
	      create = __webpack_require__(46),
	      getPrototypeOf = __webpack_require__(60),
	      gOPN = __webpack_require__(50).f,
	      isIterable = __webpack_require__(221),
	      getIterFn = __webpack_require__(163),
	      uid = __webpack_require__(22),
	      wks = __webpack_require__(28),
	      createArrayMethod = __webpack_require__(171),
	      createArrayIncludes = __webpack_require__(36),
	      speciesConstructor = __webpack_require__(204),
	      ArrayIterators = __webpack_require__(191),
	      Iterators = __webpack_require__(131),
	      $iterDetect = __webpack_require__(164),
	      setSpecies = __webpack_require__(190),
	      arrayFill = __webpack_require__(186),
	      arrayCopyWithin = __webpack_require__(183),
	      $DP = __webpack_require__(14),
	      $GOPD = __webpack_require__(51),
	      dP = $DP.f,
	      gOPD = $GOPD.f,
	      RangeError = global.RangeError,
	      TypeError = global.TypeError,
	      Uint8Array = global.Uint8Array,
	      ARRAY_BUFFER = 'ArrayBuffer',
	      SHARED_BUFFER = 'Shared' + ARRAY_BUFFER,
	      BYTES_PER_ELEMENT = 'BYTES_PER_ELEMENT',
	      PROTOTYPE = 'prototype',
	      ArrayProto = Array[PROTOTYPE],
	      $ArrayBuffer = $buffer.ArrayBuffer,
	      $DataView = $buffer.DataView,
	      arrayForEach = createArrayMethod(0),
	      arrayFilter = createArrayMethod(2),
	      arraySome = createArrayMethod(3),
	      arrayEvery = createArrayMethod(4),
	      arrayFind = createArrayMethod(5),
	      arrayFindIndex = createArrayMethod(6),
	      arrayIncludes = createArrayIncludes(true),
	      arrayIndexOf = createArrayIncludes(false),
	      arrayValues = ArrayIterators.values,
	      arrayKeys = ArrayIterators.keys,
	      arrayEntries = ArrayIterators.entries,
	      arrayLastIndexOf = ArrayProto.lastIndexOf,
	      arrayReduce = ArrayProto.reduce,
	      arrayReduceRight = ArrayProto.reduceRight,
	      arrayJoin = ArrayProto.join,
	      arraySort = ArrayProto.sort,
	      arraySlice = ArrayProto.slice,
	      arrayToString = ArrayProto.toString,
	      arrayToLocaleString = ArrayProto.toLocaleString,
	      ITERATOR = wks('iterator'),
	      TAG = wks('toStringTag'),
	      TYPED_CONSTRUCTOR = uid('typed_constructor'),
	      DEF_CONSTRUCTOR = uid('def_constructor'),
	      ALL_CONSTRUCTORS = $typed.CONSTR,
	      TYPED_ARRAY = $typed.TYPED,
	      VIEW = $typed.VIEW,
	      WRONG_LENGTH = 'Wrong length!';

	  var $map = createArrayMethod(1, function (O, length) {
	    return allocate(speciesConstructor(O, O[DEF_CONSTRUCTOR]), length);
	  });

	  var LITTLE_ENDIAN = fails(function () {
	    return new Uint8Array(new Uint16Array([1]).buffer)[0] === 1;
	  });

	  var FORCED_SET = !!Uint8Array && !!Uint8Array[PROTOTYPE].set && fails(function () {
	    new Uint8Array(1).set({});
	  });

	  var strictToLength = function strictToLength(it, SAME) {
	    if (it === undefined) throw TypeError(WRONG_LENGTH);
	    var number = +it,
	        length = toLength(it);
	    if (SAME && !same(number, length)) throw RangeError(WRONG_LENGTH);
	    return length;
	  };

	  var toOffset = function toOffset(it, BYTES) {
	    var offset = toInteger(it);
	    if (offset < 0 || offset % BYTES) throw RangeError('Wrong offset!');
	    return offset;
	  };

	  var validate = function validate(it) {
	    if (isObject(it) && TYPED_ARRAY in it) return it;
	    throw TypeError(it + ' is not a typed array!');
	  };

	  var allocate = function allocate(C, length) {
	    if (!(isObject(C) && TYPED_CONSTRUCTOR in C)) {
	      throw TypeError('It is not a typed array constructor!');
	    }return new C(length);
	  };

	  var speciesFromList = function speciesFromList(O, list) {
	    return fromList(speciesConstructor(O, O[DEF_CONSTRUCTOR]), list);
	  };

	  var fromList = function fromList(C, list) {
	    var index = 0,
	        length = list.length,
	        result = allocate(C, length);
	    while (length > index) {
	      result[index] = list[index++];
	    }return result;
	  };

	  var addGetter = function addGetter(it, key, internal) {
	    dP(it, key, { get: function get() {
	        return this._d[internal];
	      } });
	  };

	  var $from = function from(source /*, mapfn, thisArg */) {
	    var O = toObject(source),
	        aLen = arguments.length,
	        mapfn = aLen > 1 ? arguments[1] : undefined,
	        mapping = mapfn !== undefined,
	        iterFn = getIterFn(O),
	        i,
	        length,
	        values,
	        result,
	        step,
	        iterator;
	    if (iterFn != undefined && !isArrayIter(iterFn)) {
	      for (iterator = iterFn.call(O), values = [], i = 0; !(step = iterator.next()).done; i++) {
	        values.push(step.value);
	      }O = values;
	    }
	    if (mapping && aLen > 2) mapfn = ctx(mapfn, arguments[2], 2);
	    for (i = 0, length = toLength(O.length), result = allocate(this, length); length > i; i++) {
	      result[i] = mapping ? mapfn(O[i], i) : O[i];
	    }
	    return result;
	  };

	  var $of = function of() /*...items*/{
	    var index = 0,
	        length = arguments.length,
	        result = allocate(this, length);
	    while (length > index) {
	      result[index] = arguments[index++];
	    }return result;
	  };

	  // iOS Safari 6.x fails here
	  var TO_LOCALE_BUG = !!Uint8Array && fails(function () {
	    arrayToLocaleString.call(new Uint8Array(1));
	  });

	  var $toLocaleString = function toLocaleString() {
	    return arrayToLocaleString.apply(TO_LOCALE_BUG ? arraySlice.call(validate(this)) : validate(this), arguments);
	  };

	  var proto = {
	    copyWithin: function copyWithin(target, start /*, end */) {
	      return arrayCopyWithin.call(validate(this), target, start, arguments.length > 2 ? arguments[2] : undefined);
	    },
	    every: function every(callbackfn /*, thisArg */) {
	      return arrayEvery(validate(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	    },
	    fill: function fill(value /*, start, end */) {
	      // eslint-disable-line no-unused-vars
	      return arrayFill.apply(validate(this), arguments);
	    },
	    filter: function filter(callbackfn /*, thisArg */) {
	      return speciesFromList(this, arrayFilter(validate(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined));
	    },
	    find: function find(predicate /*, thisArg */) {
	      return arrayFind(validate(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
	    },
	    findIndex: function findIndex(predicate /*, thisArg */) {
	      return arrayFindIndex(validate(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
	    },
	    forEach: function forEach(callbackfn /*, thisArg */) {
	      arrayForEach(validate(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	    },
	    indexOf: function indexOf(searchElement /*, fromIndex */) {
	      return arrayIndexOf(validate(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
	    },
	    includes: function includes(searchElement /*, fromIndex */) {
	      return arrayIncludes(validate(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
	    },
	    join: function join(separator) {
	      // eslint-disable-line no-unused-vars
	      return arrayJoin.apply(validate(this), arguments);
	    },
	    lastIndexOf: function lastIndexOf(searchElement /*, fromIndex */) {
	      // eslint-disable-line no-unused-vars
	      return arrayLastIndexOf.apply(validate(this), arguments);
	    },
	    map: function map(mapfn /*, thisArg */) {
	      return $map(validate(this), mapfn, arguments.length > 1 ? arguments[1] : undefined);
	    },
	    reduce: function reduce(callbackfn /*, initialValue */) {
	      // eslint-disable-line no-unused-vars
	      return arrayReduce.apply(validate(this), arguments);
	    },
	    reduceRight: function reduceRight(callbackfn /*, initialValue */) {
	      // eslint-disable-line no-unused-vars
	      return arrayReduceRight.apply(validate(this), arguments);
	    },
	    reverse: function reverse() {
	      var that = this,
	          length = validate(that).length,
	          middle = Math.floor(length / 2),
	          index = 0,
	          value;
	      while (index < middle) {
	        value = that[index];
	        that[index++] = that[--length];
	        that[length] = value;
	      }return that;
	    },
	    slice: function slice(start, end) {
	      return speciesFromList(this, arraySlice.call(validate(this), start, end));
	    },
	    some: function some(callbackfn /*, thisArg */) {
	      return arraySome(validate(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	    },
	    sort: function sort(comparefn) {
	      return arraySort.call(validate(this), comparefn);
	    },
	    subarray: function subarray(begin, end) {
	      var O = validate(this),
	          length = O.length,
	          $begin = toIndex(begin, length);
	      return new (speciesConstructor(O, O[DEF_CONSTRUCTOR]))(O.buffer, O.byteOffset + $begin * O.BYTES_PER_ELEMENT, toLength((end === undefined ? length : toIndex(end, length)) - $begin));
	    }
	  };

	  var $set = function set(arrayLike /*, offset */) {
	    validate(this);
	    var offset = toOffset(arguments[1], 1),
	        length = this.length,
	        src = toObject(arrayLike),
	        len = toLength(src.length),
	        index = 0;
	    if (len + offset > length) throw RangeError(WRONG_LENGTH);
	    while (index < len) {
	      this[offset + index] = src[index++];
	    }
	  };

	  var $iterators = {
	    entries: function entries() {
	      return arrayEntries.call(validate(this));
	    },
	    keys: function keys() {
	      return arrayKeys.call(validate(this));
	    },
	    values: function values() {
	      return arrayValues.call(validate(this));
	    }
	  };

	  var isTAIndex = function isTAIndex(target, key) {
	    return isObject(target) && target[TYPED_ARRAY] && (typeof key === 'undefined' ? 'undefined' : _typeof(key)) != 'symbol' && key in target && String(+key) == String(key);
	  };
	  var $getDesc = function getOwnPropertyDescriptor(target, key) {
	    return isTAIndex(target, key = toPrimitive(key, true)) ? propertyDesc(2, target[key]) : gOPD(target, key);
	  };
	  var $setDesc = function defineProperty(target, key, desc) {
	    if (isTAIndex(target, key = toPrimitive(key, true)) && isObject(desc) && has(desc, 'value') && !has(desc, 'get') && !has(desc, 'set')
	    // TODO: add validation descriptor w/o calling accessors
	     && !desc.configurable && (!has(desc, 'writable') || desc.writable) && (!has(desc, 'enumerable') || desc.enumerable)) {
	      target[key] = desc.value;
	      return target;
	    } else return dP(target, key, desc);
	  };

	  if (!ALL_CONSTRUCTORS) {
	    $GOPD.f = $getDesc;
	    $DP.f = $setDesc;
	  }

	  $export($export.S + $export.F * !ALL_CONSTRUCTORS, 'Object', {
	    getOwnPropertyDescriptor: $getDesc,
	    defineProperty: $setDesc
	  });

	  if (fails(function () {
	    arrayToString.call({});
	  })) {
	    arrayToString = arrayToLocaleString = function toString() {
	      return arrayJoin.call(this);
	    };
	  }

	  var $TypedArrayPrototype$ = redefineAll({}, proto);
	  redefineAll($TypedArrayPrototype$, $iterators);
	  hide($TypedArrayPrototype$, ITERATOR, $iterators.values);
	  redefineAll($TypedArrayPrototype$, {
	    set: $set,
	    constructor: function constructor() {/* noop */},
	    toString: arrayToString,
	    toLocaleString: $toLocaleString
	  });
	  addGetter($TypedArrayPrototype$, 'buffer', 'b');
	  addGetter($TypedArrayPrototype$, 'byteOffset', 'o');
	  addGetter($TypedArrayPrototype$, 'byteLength', 'l');
	  addGetter($TypedArrayPrototype$, 'length', 'e');
	  dP($TypedArrayPrototype$, TAG, {
	    get: function get() {
	      return this[TYPED_ARRAY];
	    }
	  });

	  module.exports = function (KEY, BYTES, wrapper, CLAMPED) {
	    CLAMPED = !!CLAMPED;
	    var NAME = KEY + (CLAMPED ? 'Clamped' : '') + 'Array',
	        ISNT_UINT8 = NAME != 'Uint8Array',
	        GETTER = 'get' + KEY,
	        SETTER = 'set' + KEY,
	        TypedArray = global[NAME],
	        Base = TypedArray || {},
	        TAC = TypedArray && getPrototypeOf(TypedArray),
	        FORCED = !TypedArray || !$typed.ABV,
	        O = {},
	        TypedArrayPrototype = TypedArray && TypedArray[PROTOTYPE];
	    var getter = function getter(that, index) {
	      var data = that._d;
	      return data.v[GETTER](index * BYTES + data.o, LITTLE_ENDIAN);
	    };
	    var setter = function setter(that, index, value) {
	      var data = that._d;
	      if (CLAMPED) value = (value = Math.round(value)) < 0 ? 0 : value > 0xff ? 0xff : value & 0xff;
	      data.v[SETTER](index * BYTES + data.o, value, LITTLE_ENDIAN);
	    };
	    var addElement = function addElement(that, index) {
	      dP(that, index, {
	        get: function get() {
	          return getter(this, index);
	        },
	        set: function set(value) {
	          return setter(this, index, value);
	        },
	        enumerable: true
	      });
	    };
	    if (FORCED) {
	      TypedArray = wrapper(function (that, data, $offset, $length) {
	        anInstance(that, TypedArray, NAME, '_d');
	        var index = 0,
	            offset = 0,
	            buffer,
	            byteLength,
	            length,
	            klass;
	        if (!isObject(data)) {
	          length = strictToLength(data, true);
	          byteLength = length * BYTES;
	          buffer = new $ArrayBuffer(byteLength);
	        } else if (data instanceof $ArrayBuffer || (klass = classof(data)) == ARRAY_BUFFER || klass == SHARED_BUFFER) {
	          buffer = data;
	          offset = toOffset($offset, BYTES);
	          var $len = data.byteLength;
	          if ($length === undefined) {
	            if ($len % BYTES) throw RangeError(WRONG_LENGTH);
	            byteLength = $len - offset;
	            if (byteLength < 0) throw RangeError(WRONG_LENGTH);
	          } else {
	            byteLength = toLength($length) * BYTES;
	            if (byteLength + offset > $len) throw RangeError(WRONG_LENGTH);
	          }
	          length = byteLength / BYTES;
	        } else if (TYPED_ARRAY in data) {
	          return fromList(TypedArray, data);
	        } else {
	          return $from.call(TypedArray, data);
	        }
	        hide(that, '_d', {
	          b: buffer,
	          o: offset,
	          l: byteLength,
	          e: length,
	          v: new $DataView(buffer)
	        });
	        while (index < length) {
	          addElement(that, index++);
	        }
	      });
	      TypedArrayPrototype = TypedArray[PROTOTYPE] = create($TypedArrayPrototype$);
	      hide(TypedArrayPrototype, 'constructor', TypedArray);
	    } else if (!$iterDetect(function (iter) {
	      // V8 works with iterators, but fails in many other cases
	      // https://code.google.com/p/v8/issues/detail?id=4552
	      new TypedArray(null); // eslint-disable-line no-new
	      new TypedArray(iter); // eslint-disable-line no-new
	    }, true)) {
	      TypedArray = wrapper(function (that, data, $offset, $length) {
	        anInstance(that, TypedArray, NAME);
	        var klass;
	        // `ws` module bug, temporarily remove validation length for Uint8Array
	        // https://github.com/websockets/ws/pull/645
	        if (!isObject(data)) return new Base(strictToLength(data, ISNT_UINT8));
	        if (data instanceof $ArrayBuffer || (klass = classof(data)) == ARRAY_BUFFER || klass == SHARED_BUFFER) {
	          return $length !== undefined ? new Base(data, toOffset($offset, BYTES), $length) : $offset !== undefined ? new Base(data, toOffset($offset, BYTES)) : new Base(data);
	        }
	        if (TYPED_ARRAY in data) return fromList(TypedArray, data);
	        return $from.call(TypedArray, data);
	      });
	      arrayForEach(TAC !== Function.prototype ? gOPN(Base).concat(gOPN(TAC)) : gOPN(Base), function (key) {
	        if (!(key in TypedArray)) hide(TypedArray, key, Base[key]);
	      });
	      TypedArray[PROTOTYPE] = TypedArrayPrototype;
	      if (!LIBRARY) TypedArrayPrototype.constructor = TypedArray;
	    }
	    var $nativeIterator = TypedArrayPrototype[ITERATOR],
	        CORRECT_ITER_NAME = !!$nativeIterator && ($nativeIterator.name == 'values' || $nativeIterator.name == undefined),
	        $iterator = $iterators.values;
	    hide(TypedArray, TYPED_CONSTRUCTOR, true);
	    hide(TypedArrayPrototype, TYPED_ARRAY, NAME);
	    hide(TypedArrayPrototype, VIEW, true);
	    hide(TypedArrayPrototype, DEF_CONSTRUCTOR, TypedArray);

	    if (CLAMPED ? new TypedArray(1)[TAG] != NAME : !(TAG in TypedArrayPrototype)) {
	      dP(TypedArrayPrototype, TAG, {
	        get: function get() {
	          return NAME;
	        }
	      });
	    }

	    O[NAME] = TypedArray;

	    $export($export.G + $export.W + $export.F * (TypedArray != Base), O);

	    $export($export.S, NAME, {
	      BYTES_PER_ELEMENT: BYTES,
	      from: $from,
	      of: $of
	    });

	    if (!(BYTES_PER_ELEMENT in TypedArrayPrototype)) hide(TypedArrayPrototype, BYTES_PER_ELEMENT, BYTES);

	    $export($export.P, NAME, proto);

	    $export($export.P + $export.F * FORCED_SET, NAME, { set: $set });

	    $export($export.P + $export.F * !CORRECT_ITER_NAME, NAME, $iterators);

	    $export($export.P + $export.F * (TypedArrayPrototype.toString != arrayToString), NAME, { toString: arrayToString });

	    $export($export.P + $export.F * (fails(function () {
	      return [1, 2].toLocaleString() != new TypedArray([1, 2]).toLocaleString();
	    }) || !fails(function () {
	      TypedArrayPrototype.toLocaleString.call([1, 2]);
	    })), NAME, { toLocaleString: $toLocaleString });

	    Iterators[NAME] = CORRECT_ITER_NAME ? $nativeIterator : $iterator;
	    if (!LIBRARY && !CORRECT_ITER_NAME) hide(TypedArrayPrototype, ITERATOR, $iterator);

	    setSpecies(NAME);
	  };
	} else module.exports = function () {/* empty */};

/***/ },
/* 221 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var classof = __webpack_require__(76),
	    ITERATOR = __webpack_require__(28)('iterator'),
	    Iterators = __webpack_require__(131);
	module.exports = __webpack_require__(8).isIterable = function (it) {
	  var O = Object(it);
	  return O[ITERATOR] !== undefined || '@@iterator' in O || Iterators.hasOwnProperty(classof(O));
	};

/***/ },
/* 222 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	__webpack_require__(220)('Uint8', 1, function (init) {
	  return function Uint8Array(data, byteOffset, length) {
	    return init(this, data, byteOffset, length);
	  };
	});

/***/ },
/* 223 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	__webpack_require__(220)('Uint8', 1, function (init) {
	  return function Uint8ClampedArray(data, byteOffset, length) {
	    return init(this, data, byteOffset, length);
	  };
	}, true);

/***/ },
/* 224 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	__webpack_require__(220)('Int16', 2, function (init) {
	  return function Int16Array(data, byteOffset, length) {
	    return init(this, data, byteOffset, length);
	  };
	});

/***/ },
/* 225 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	__webpack_require__(220)('Uint16', 2, function (init) {
	  return function Uint16Array(data, byteOffset, length) {
	    return init(this, data, byteOffset, length);
	  };
	});

/***/ },
/* 226 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	__webpack_require__(220)('Int32', 4, function (init) {
	  return function Int32Array(data, byteOffset, length) {
	    return init(this, data, byteOffset, length);
	  };
	});

/***/ },
/* 227 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	__webpack_require__(220)('Uint32', 4, function (init) {
	  return function Uint32Array(data, byteOffset, length) {
	    return init(this, data, byteOffset, length);
	  };
	});

/***/ },
/* 228 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	__webpack_require__(220)('Float32', 4, function (init) {
	  return function Float32Array(data, byteOffset, length) {
	    return init(this, data, byteOffset, length);
	  };
	});

/***/ },
/* 229 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	__webpack_require__(220)('Float64', 8, function (init) {
	  return function Float64Array(data, byteOffset, length) {
	    return init(this, data, byteOffset, length);
	  };
	});

/***/ },
/* 230 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// 26.1.1 Reflect.apply(target, thisArgument, argumentsList)
	var $export = __webpack_require__(12),
	    _apply = Function.apply;

	$export($export.S, 'Reflect', {
	  apply: function apply(target, thisArgument, argumentsList) {
	    return _apply.call(target, thisArgument, argumentsList);
	  }
	});

/***/ },
/* 231 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// 26.1.2 Reflect.construct(target, argumentsList [, newTarget])
	var $export = __webpack_require__(12),
	    create = __webpack_require__(46),
	    aFunction = __webpack_require__(24),
	    anObject = __webpack_require__(15),
	    isObject = __webpack_require__(16),
	    bind = __webpack_require__(78);

	// MS Edge supports only 2 arguments
	// FF Nightly sets third argument as `new.target`, but does not create `this` from it
	$export($export.S + $export.F * __webpack_require__(11)(function () {
	  function F() {}
	  return !(Reflect.construct(function () {}, [], F) instanceof F);
	}), 'Reflect', {
	  construct: function construct(Target, args /*, newTarget*/) {
	    aFunction(Target);
	    var newTarget = arguments.length < 3 ? Target : aFunction(arguments[2]);
	    if (Target == newTarget) {
	      // w/o altered newTarget, optimization for 0-4 arguments
	      if (args != undefined) switch (anObject(args).length) {
	        case 0:
	          return new Target();
	        case 1:
	          return new Target(args[0]);
	        case 2:
	          return new Target(args[0], args[1]);
	        case 3:
	          return new Target(args[0], args[1], args[2]);
	        case 4:
	          return new Target(args[0], args[1], args[2], args[3]);
	      }
	      // w/o altered newTarget, lot of arguments case
	      var $args = [null];
	      $args.push.apply($args, args);
	      return new (bind.apply(Target, $args))();
	    }
	    // with altered newTarget, not support built-in constructors
	    var proto = newTarget.prototype,
	        instance = create(isObject(proto) ? proto : Object.prototype),
	        result = Function.apply.call(Target, instance, args);
	    return isObject(result) ? result : instance;
	  }
	});

/***/ },
/* 232 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// 26.1.3 Reflect.defineProperty(target, propertyKey, attributes)
	var dP = __webpack_require__(14),
	    $export = __webpack_require__(12),
	    anObject = __webpack_require__(15),
	    toPrimitive = __webpack_require__(19);

	// MS Edge has broken Reflect.defineProperty - throwing instead of returning false
	$export($export.S + $export.F * __webpack_require__(11)(function () {
	  Reflect.defineProperty(dP.f({}, 1, { value: 1 }), 1, { value: 2 });
	}), 'Reflect', {
	  defineProperty: function defineProperty(target, propertyKey, attributes) {
	    anObject(target);
	    propertyKey = toPrimitive(propertyKey, true);
	    anObject(attributes);
	    try {
	      dP.f(target, propertyKey, attributes);
	      return true;
	    } catch (e) {
	      return false;
	    }
	  }
	});

/***/ },
/* 233 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// 26.1.4 Reflect.deleteProperty(target, propertyKey)
	var $export = __webpack_require__(12),
	    gOPD = __webpack_require__(51).f,
	    anObject = __webpack_require__(15);

	$export($export.S, 'Reflect', {
	  deleteProperty: function deleteProperty(target, propertyKey) {
	    var desc = gOPD(anObject(target), propertyKey);
	    return desc && !desc.configurable ? false : delete target[propertyKey];
	  }
	});

/***/ },
/* 234 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// 26.1.5 Reflect.enumerate(target)

	var $export = __webpack_require__(12),
	    anObject = __webpack_require__(15);
	var Enumerate = function Enumerate(iterated) {
	  this._t = anObject(iterated); // target
	  this._i = 0; // next index
	  var keys = this._k = [] // keys
	  ,
	      key;
	  for (key in iterated) {
	    keys.push(key);
	  }
	};
	__webpack_require__(132)(Enumerate, 'Object', function () {
	  var that = this,
	      keys = that._k,
	      key;
	  do {
	    if (that._i >= keys.length) return { value: undefined, done: true };
	  } while (!((key = keys[that._i++]) in that._t));
	  return { value: key, done: false };
	});

	$export($export.S, 'Reflect', {
	  enumerate: function enumerate(target) {
	    return new Enumerate(target);
	  }
	});

/***/ },
/* 235 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// 26.1.6 Reflect.get(target, propertyKey [, receiver])
	var gOPD = __webpack_require__(51),
	    getPrototypeOf = __webpack_require__(60),
	    has = __webpack_require__(9),
	    $export = __webpack_require__(12),
	    isObject = __webpack_require__(16),
	    anObject = __webpack_require__(15);

	function get(target, propertyKey /*, receiver*/) {
	  var receiver = arguments.length < 3 ? target : arguments[2],
	      desc,
	      proto;
	  if (anObject(target) === receiver) return target[propertyKey];
	  if (desc = gOPD.f(target, propertyKey)) return has(desc, 'value') ? desc.value : desc.get !== undefined ? desc.get.call(receiver) : undefined;
	  if (isObject(proto = getPrototypeOf(target))) return get(proto, propertyKey, receiver);
	}

	$export($export.S, 'Reflect', { get: get });

/***/ },
/* 236 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// 26.1.7 Reflect.getOwnPropertyDescriptor(target, propertyKey)
	var gOPD = __webpack_require__(51),
	    $export = __webpack_require__(12),
	    anObject = __webpack_require__(15);

	$export($export.S, 'Reflect', {
	  getOwnPropertyDescriptor: function getOwnPropertyDescriptor(target, propertyKey) {
	    return gOPD.f(anObject(target), propertyKey);
	  }
	});

/***/ },
/* 237 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// 26.1.8 Reflect.getPrototypeOf(target)
	var $export = __webpack_require__(12),
	    getProto = __webpack_require__(60),
	    anObject = __webpack_require__(15);

	$export($export.S, 'Reflect', {
	  getPrototypeOf: function getPrototypeOf(target) {
	    return getProto(anObject(target));
	  }
	});

/***/ },
/* 238 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// 26.1.9 Reflect.has(target, propertyKey)
	var $export = __webpack_require__(12);

	$export($export.S, 'Reflect', {
	  has: function has(target, propertyKey) {
	    return propertyKey in target;
	  }
	});

/***/ },
/* 239 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// 26.1.10 Reflect.isExtensible(target)
	var $export = __webpack_require__(12),
	    anObject = __webpack_require__(15),
	    $isExtensible = Object.isExtensible;

	$export($export.S, 'Reflect', {
	  isExtensible: function isExtensible(target) {
	    anObject(target);
	    return $isExtensible ? $isExtensible(target) : true;
	  }
	});

/***/ },
/* 240 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// 26.1.11 Reflect.ownKeys(target)
	var $export = __webpack_require__(12);

	$export($export.S, 'Reflect', { ownKeys: __webpack_require__(241) });

/***/ },
/* 241 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// all object keys, includes non-enumerable and symbols
	var gOPN = __webpack_require__(50),
	    gOPS = __webpack_require__(43),
	    anObject = __webpack_require__(15),
	    Reflect = __webpack_require__(7).Reflect;
	module.exports = Reflect && Reflect.ownKeys || function ownKeys(it) {
	  var keys = gOPN.f(anObject(it)),
	      getSymbols = gOPS.f;
	  return getSymbols ? keys.concat(getSymbols(it)) : keys;
	};

/***/ },
/* 242 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// 26.1.12 Reflect.preventExtensions(target)
	var $export = __webpack_require__(12),
	    anObject = __webpack_require__(15),
	    $preventExtensions = Object.preventExtensions;

	$export($export.S, 'Reflect', {
	  preventExtensions: function preventExtensions(target) {
	    anObject(target);
	    try {
	      if ($preventExtensions) $preventExtensions(target);
	      return true;
	    } catch (e) {
	      return false;
	    }
	  }
	});

/***/ },
/* 243 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// 26.1.13 Reflect.set(target, propertyKey, V [, receiver])
	var dP = __webpack_require__(14),
	    gOPD = __webpack_require__(51),
	    getPrototypeOf = __webpack_require__(60),
	    has = __webpack_require__(9),
	    $export = __webpack_require__(12),
	    createDesc = __webpack_require__(20),
	    anObject = __webpack_require__(15),
	    isObject = __webpack_require__(16);

	function set(target, propertyKey, V /*, receiver*/) {
	  var receiver = arguments.length < 4 ? target : arguments[3],
	      ownDesc = gOPD.f(anObject(target), propertyKey),
	      existingDescriptor,
	      proto;
	  if (!ownDesc) {
	    if (isObject(proto = getPrototypeOf(target))) {
	      return set(proto, propertyKey, V, receiver);
	    }
	    ownDesc = createDesc(0);
	  }
	  if (has(ownDesc, 'value')) {
	    if (ownDesc.writable === false || !isObject(receiver)) return false;
	    existingDescriptor = gOPD.f(receiver, propertyKey) || createDesc(0);
	    existingDescriptor.value = V;
	    dP.f(receiver, propertyKey, existingDescriptor);
	    return true;
	  }
	  return ownDesc.set === undefined ? false : (ownDesc.set.call(receiver, V), true);
	}

	$export($export.S, 'Reflect', { set: set });

/***/ },
/* 244 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// 26.1.14 Reflect.setPrototypeOf(target, proto)
	var $export = __webpack_require__(12),
	    setProto = __webpack_require__(74);

	if (setProto) $export($export.S, 'Reflect', {
	  setPrototypeOf: function setPrototypeOf(target, proto) {
	    setProto.check(target, proto);
	    try {
	      setProto.set(target, proto);
	      return true;
	    } catch (e) {
	      return false;
	    }
	  }
	});

/***/ },
/* 245 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var $export = __webpack_require__(12),
	    $includes = __webpack_require__(36)(true);

	$export($export.P, 'Array', {
	  // https://github.com/domenic/Array.prototype.includes
	  includes: function includes(el /*, fromIndex = 0 */) {
	    return $includes(this, el, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	__webpack_require__(184)('includes');

/***/ },
/* 246 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// https://github.com/mathiasbynens/String.prototype.at

	var $export = __webpack_require__(12),
	    $at = __webpack_require__(129)(true);

	$export($export.P, 'String', {
	  at: function at(pos) {
	    return $at(this, pos);
	  }
	});

/***/ },
/* 247 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var $export = __webpack_require__(12),
	    $pad = __webpack_require__(248);

	$export($export.P, 'String', {
	  padStart: function padStart(maxLength /*, fillString = ' ' */) {
	    return $pad(this, maxLength, arguments.length > 1 ? arguments[1] : undefined, true);
	  }
	});

/***/ },
/* 248 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// https://github.com/tc39/proposal-string-pad-start-end
	var toLength = __webpack_require__(37),
	    repeat = __webpack_require__(93),
	    defined = __webpack_require__(35);

	module.exports = function (that, maxLength, fillString, left) {
	  var S = String(defined(that)),
	      stringLength = S.length,
	      fillStr = fillString === undefined ? ' ' : String(fillString),
	      intMaxLength = toLength(maxLength);
	  if (intMaxLength <= stringLength) return S;
	  if (fillStr == '') fillStr = ' ';
	  var fillLen = intMaxLength - stringLength,
	      stringFiller = repeat.call(fillStr, Math.ceil(fillLen / fillStr.length));
	  if (stringFiller.length > fillLen) stringFiller = stringFiller.slice(0, fillLen);
	  return left ? stringFiller + S : S + stringFiller;
	};

/***/ },
/* 249 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var $export = __webpack_require__(12),
	    $pad = __webpack_require__(248);

	$export($export.P, 'String', {
	  padEnd: function padEnd(maxLength /*, fillString = ' ' */) {
	    return $pad(this, maxLength, arguments.length > 1 ? arguments[1] : undefined, false);
	  }
	});

/***/ },
/* 250 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// https://github.com/sebmarkbage/ecmascript-string-left-right-trim

	__webpack_require__(84)('trimLeft', function ($trim) {
	  return function trimLeft() {
	    return $trim(this, 1);
	  };
	}, 'trimStart');

/***/ },
/* 251 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// https://github.com/sebmarkbage/ecmascript-string-left-right-trim

	__webpack_require__(84)('trimRight', function ($trim) {
	  return function trimRight() {
	    return $trim(this, 2);
	  };
	}, 'trimEnd');

/***/ },
/* 252 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// https://gist.github.com/WebReflection/9353781
	var $export = __webpack_require__(12),
	    ownKeys = __webpack_require__(241),
	    toIObject = __webpack_require__(32),
	    createDesc = __webpack_require__(20),
	    gOPD = __webpack_require__(51),
	    dP = __webpack_require__(14);

	$export($export.S, 'Object', {
	  getOwnPropertyDescriptors: function getOwnPropertyDescriptors(object) {
	    var O = toIObject(object),
	        getDesc = gOPD.f,
	        keys = ownKeys(O),
	        result = {},
	        i = 0,
	        key,
	        D;
	    while (keys.length > i) {
	      D = getDesc(O, key = keys[i++]);
	      if (key in result) dP.f(result, key, createDesc(0, D));else result[key] = D;
	    }return result;
	  }
	});

/***/ },
/* 253 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// http://goo.gl/XkBrjD
	var $export = __webpack_require__(12),
	    $values = __webpack_require__(254)(false);

	$export($export.S, 'Object', {
	  values: function values(it) {
	    return $values(it);
	  }
	});

/***/ },
/* 254 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var getKeys = __webpack_require__(30),
	    toIObject = __webpack_require__(32),
	    isEnum = __webpack_require__(44).f;
	module.exports = function (isEntries) {
	  return function (it) {
	    var O = toIObject(it),
	        keys = getKeys(O),
	        length = keys.length,
	        i = 0,
	        result = [],
	        key;
	    while (length > i) {
	      if (isEnum.call(O, key = keys[i++])) {
	        result.push(isEntries ? [key, O[key]] : O[key]);
	      }
	    }return result;
	  };
	};

/***/ },
/* 255 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// http://goo.gl/XkBrjD
	var $export = __webpack_require__(12),
	    $entries = __webpack_require__(254)(true);

	$export($export.S, 'Object', {
	  entries: function entries(it) {
	    return $entries(it);
	  }
	});

/***/ },
/* 256 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// https://github.com/DavidBruant/Map-Set.prototype.toJSON
	var $export = __webpack_require__(12);

	$export($export.P + $export.R, 'Map', { toJSON: __webpack_require__(257)('Map') });

/***/ },
/* 257 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// https://github.com/DavidBruant/Map-Set.prototype.toJSON
	var classof = __webpack_require__(76),
	    from = __webpack_require__(258);
	module.exports = function (NAME) {
	  return function toJSON() {
	    if (classof(this) != NAME) throw TypeError(NAME + "#toJSON isn't generic");
	    return from(this);
	  };
	};

/***/ },
/* 258 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var forOf = __webpack_require__(203);

	module.exports = function (iter, ITERATOR) {
	  var result = [];
	  forOf(iter, false, result.push, result, ITERATOR);
	  return result;
	};

/***/ },
/* 259 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// https://github.com/DavidBruant/Map-Set.prototype.toJSON
	var $export = __webpack_require__(12);

	$export($export.P + $export.R, 'Set', { toJSON: __webpack_require__(257)('Set') });

/***/ },
/* 260 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// https://github.com/ljharb/proposal-global
	var $export = __webpack_require__(12);

	$export($export.S, 'System', { global: __webpack_require__(7) });

/***/ },
/* 261 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// https://github.com/ljharb/proposal-is-error
	var $export = __webpack_require__(12),
	    cof = __webpack_require__(34);

	$export($export.S, 'Error', {
	  isError: function isError(it) {
	    return cof(it) === 'Error';
	  }
	});

/***/ },
/* 262 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// https://gist.github.com/BrendanEich/4294d5c212a6d2254703
	var $export = __webpack_require__(12);

	$export($export.S, 'Math', {
	  iaddh: function iaddh(x0, x1, y0, y1) {
	    var $x0 = x0 >>> 0,
	        $x1 = x1 >>> 0,
	        $y0 = y0 >>> 0;
	    return $x1 + (y1 >>> 0) + (($x0 & $y0 | ($x0 | $y0) & ~($x0 + $y0 >>> 0)) >>> 31) | 0;
	  }
	});

/***/ },
/* 263 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// https://gist.github.com/BrendanEich/4294d5c212a6d2254703
	var $export = __webpack_require__(12);

	$export($export.S, 'Math', {
	  isubh: function isubh(x0, x1, y0, y1) {
	    var $x0 = x0 >>> 0,
	        $x1 = x1 >>> 0,
	        $y0 = y0 >>> 0;
	    return $x1 - (y1 >>> 0) - ((~$x0 & $y0 | ~($x0 ^ $y0) & $x0 - $y0 >>> 0) >>> 31) | 0;
	  }
	});

/***/ },
/* 264 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// https://gist.github.com/BrendanEich/4294d5c212a6d2254703
	var $export = __webpack_require__(12);

	$export($export.S, 'Math', {
	  imulh: function imulh(u, v) {
	    var UINT16 = 0xffff,
	        $u = +u,
	        $v = +v,
	        u0 = $u & UINT16,
	        v0 = $v & UINT16,
	        u1 = $u >> 16,
	        v1 = $v >> 16,
	        t = (u1 * v0 >>> 0) + (u0 * v0 >>> 16);
	    return u1 * v1 + (t >> 16) + ((u0 * v1 >>> 0) + (t & UINT16) >> 16);
	  }
	});

/***/ },
/* 265 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// https://gist.github.com/BrendanEich/4294d5c212a6d2254703
	var $export = __webpack_require__(12);

	$export($export.S, 'Math', {
	  umulh: function umulh(u, v) {
	    var UINT16 = 0xffff,
	        $u = +u,
	        $v = +v,
	        u0 = $u & UINT16,
	        v0 = $v & UINT16,
	        u1 = $u >>> 16,
	        v1 = $v >>> 16,
	        t = (u1 * v0 >>> 0) + (u0 * v0 >>> 16);
	    return u1 * v1 + (t >>> 16) + ((u0 * v1 >>> 0) + (t & UINT16) >>> 16);
	  }
	});

/***/ },
/* 266 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var metadata = __webpack_require__(267),
	    anObject = __webpack_require__(15),
	    toMetaKey = metadata.key,
	    ordinaryDefineOwnMetadata = metadata.set;

	metadata.exp({ defineMetadata: function defineMetadata(metadataKey, metadataValue, target, targetKey) {
	    ordinaryDefineOwnMetadata(metadataKey, metadataValue, anObject(target), toMetaKey(targetKey));
	  } });

/***/ },
/* 267 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	var Map = __webpack_require__(208),
	    $export = __webpack_require__(12),
	    shared = __webpack_require__(26)('metadata'),
	    store = shared.store || (shared.store = new (__webpack_require__(212))());

	var getOrCreateMetadataMap = function getOrCreateMetadataMap(target, targetKey, create) {
	  var targetMetadata = store.get(target);
	  if (!targetMetadata) {
	    if (!create) return undefined;
	    store.set(target, targetMetadata = new Map());
	  }
	  var keyMetadata = targetMetadata.get(targetKey);
	  if (!keyMetadata) {
	    if (!create) return undefined;
	    targetMetadata.set(targetKey, keyMetadata = new Map());
	  }return keyMetadata;
	};
	var ordinaryHasOwnMetadata = function ordinaryHasOwnMetadata(MetadataKey, O, P) {
	  var metadataMap = getOrCreateMetadataMap(O, P, false);
	  return metadataMap === undefined ? false : metadataMap.has(MetadataKey);
	};
	var ordinaryGetOwnMetadata = function ordinaryGetOwnMetadata(MetadataKey, O, P) {
	  var metadataMap = getOrCreateMetadataMap(O, P, false);
	  return metadataMap === undefined ? undefined : metadataMap.get(MetadataKey);
	};
	var ordinaryDefineOwnMetadata = function ordinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P) {
	  getOrCreateMetadataMap(O, P, true).set(MetadataKey, MetadataValue);
	};
	var ordinaryOwnMetadataKeys = function ordinaryOwnMetadataKeys(target, targetKey) {
	  var metadataMap = getOrCreateMetadataMap(target, targetKey, false),
	      keys = [];
	  if (metadataMap) metadataMap.forEach(function (_, key) {
	    keys.push(key);
	  });
	  return keys;
	};
	var toMetaKey = function toMetaKey(it) {
	  return it === undefined || (typeof it === 'undefined' ? 'undefined' : _typeof(it)) == 'symbol' ? it : String(it);
	};
	var exp = function exp(O) {
	  $export($export.S, 'Reflect', O);
	};

	module.exports = {
	  store: store,
	  map: getOrCreateMetadataMap,
	  has: ordinaryHasOwnMetadata,
	  get: ordinaryGetOwnMetadata,
	  set: ordinaryDefineOwnMetadata,
	  keys: ordinaryOwnMetadataKeys,
	  key: toMetaKey,
	  exp: exp
	};

/***/ },
/* 268 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var metadata = __webpack_require__(267),
	    anObject = __webpack_require__(15),
	    toMetaKey = metadata.key,
	    getOrCreateMetadataMap = metadata.map,
	    store = metadata.store;

	metadata.exp({ deleteMetadata: function deleteMetadata(metadataKey, target /*, targetKey */) {
	    var targetKey = arguments.length < 3 ? undefined : toMetaKey(arguments[2]),
	        metadataMap = getOrCreateMetadataMap(anObject(target), targetKey, false);
	    if (metadataMap === undefined || !metadataMap['delete'](metadataKey)) return false;
	    if (metadataMap.size) return true;
	    var targetMetadata = store.get(target);
	    targetMetadata['delete'](targetKey);
	    return !!targetMetadata.size || store['delete'](target);
	  } });

/***/ },
/* 269 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var metadata = __webpack_require__(267),
	    anObject = __webpack_require__(15),
	    getPrototypeOf = __webpack_require__(60),
	    ordinaryHasOwnMetadata = metadata.has,
	    ordinaryGetOwnMetadata = metadata.get,
	    toMetaKey = metadata.key;

	var ordinaryGetMetadata = function ordinaryGetMetadata(MetadataKey, O, P) {
	  var hasOwn = ordinaryHasOwnMetadata(MetadataKey, O, P);
	  if (hasOwn) return ordinaryGetOwnMetadata(MetadataKey, O, P);
	  var parent = getPrototypeOf(O);
	  return parent !== null ? ordinaryGetMetadata(MetadataKey, parent, P) : undefined;
	};

	metadata.exp({ getMetadata: function getMetadata(metadataKey, target /*, targetKey */) {
	    return ordinaryGetMetadata(metadataKey, anObject(target), arguments.length < 3 ? undefined : toMetaKey(arguments[2]));
	  } });

/***/ },
/* 270 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Set = __webpack_require__(211),
	    from = __webpack_require__(258),
	    metadata = __webpack_require__(267),
	    anObject = __webpack_require__(15),
	    getPrototypeOf = __webpack_require__(60),
	    ordinaryOwnMetadataKeys = metadata.keys,
	    toMetaKey = metadata.key;

	var ordinaryMetadataKeys = function ordinaryMetadataKeys(O, P) {
	  var oKeys = ordinaryOwnMetadataKeys(O, P),
	      parent = getPrototypeOf(O);
	  if (parent === null) return oKeys;
	  var pKeys = ordinaryMetadataKeys(parent, P);
	  return pKeys.length ? oKeys.length ? from(new Set(oKeys.concat(pKeys))) : pKeys : oKeys;
	};

	metadata.exp({ getMetadataKeys: function getMetadataKeys(target /*, targetKey */) {
	    return ordinaryMetadataKeys(anObject(target), arguments.length < 2 ? undefined : toMetaKey(arguments[1]));
	  } });

/***/ },
/* 271 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var metadata = __webpack_require__(267),
	    anObject = __webpack_require__(15),
	    ordinaryGetOwnMetadata = metadata.get,
	    toMetaKey = metadata.key;

	metadata.exp({ getOwnMetadata: function getOwnMetadata(metadataKey, target /*, targetKey */) {
	    return ordinaryGetOwnMetadata(metadataKey, anObject(target), arguments.length < 3 ? undefined : toMetaKey(arguments[2]));
	  } });

/***/ },
/* 272 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var metadata = __webpack_require__(267),
	    anObject = __webpack_require__(15),
	    ordinaryOwnMetadataKeys = metadata.keys,
	    toMetaKey = metadata.key;

	metadata.exp({ getOwnMetadataKeys: function getOwnMetadataKeys(target /*, targetKey */) {
	    return ordinaryOwnMetadataKeys(anObject(target), arguments.length < 2 ? undefined : toMetaKey(arguments[1]));
	  } });

/***/ },
/* 273 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var metadata = __webpack_require__(267),
	    anObject = __webpack_require__(15),
	    getPrototypeOf = __webpack_require__(60),
	    ordinaryHasOwnMetadata = metadata.has,
	    toMetaKey = metadata.key;

	var ordinaryHasMetadata = function ordinaryHasMetadata(MetadataKey, O, P) {
	  var hasOwn = ordinaryHasOwnMetadata(MetadataKey, O, P);
	  if (hasOwn) return true;
	  var parent = getPrototypeOf(O);
	  return parent !== null ? ordinaryHasMetadata(MetadataKey, parent, P) : false;
	};

	metadata.exp({ hasMetadata: function hasMetadata(metadataKey, target /*, targetKey */) {
	    return ordinaryHasMetadata(metadataKey, anObject(target), arguments.length < 3 ? undefined : toMetaKey(arguments[2]));
	  } });

/***/ },
/* 274 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var metadata = __webpack_require__(267),
	    anObject = __webpack_require__(15),
	    ordinaryHasOwnMetadata = metadata.has,
	    toMetaKey = metadata.key;

	metadata.exp({ hasOwnMetadata: function hasOwnMetadata(metadataKey, target /*, targetKey */) {
	    return ordinaryHasOwnMetadata(metadataKey, anObject(target), arguments.length < 3 ? undefined : toMetaKey(arguments[2]));
	  } });

/***/ },
/* 275 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var metadata = __webpack_require__(267),
	    anObject = __webpack_require__(15),
	    aFunction = __webpack_require__(24),
	    toMetaKey = metadata.key,
	    ordinaryDefineOwnMetadata = metadata.set;

	metadata.exp({ metadata: function metadata(metadataKey, metadataValue) {
	    return function decorator(target, targetKey) {
	      ordinaryDefineOwnMetadata(metadataKey, metadataValue, (targetKey !== undefined ? anObject : aFunction)(target), toMetaKey(targetKey));
	    };
	  } });

/***/ },
/* 276 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// ie9- setTimeout & setInterval additional parameters fix
	var global = __webpack_require__(7),
	    $export = __webpack_require__(12),
	    invoke = __webpack_require__(79),
	    partial = __webpack_require__(277),
	    navigator = global.navigator,
	    MSIE = !!navigator && /MSIE .\./.test(navigator.userAgent); // <- dirty ie9- check
	var wrap = function wrap(set) {
	  return MSIE ? function (fn, time /*, ...args */) {
	    return set(invoke(partial, [].slice.call(arguments, 2), typeof fn == 'function' ? fn : Function(fn)), time);
	  } : set;
	};
	$export($export.G + $export.B + $export.F * MSIE, {
	  setTimeout: wrap(global.setTimeout),
	  setInterval: wrap(global.setInterval)
	});

/***/ },
/* 277 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var path = __webpack_require__(278),
	    invoke = __webpack_require__(79),
	    aFunction = __webpack_require__(24);
	module.exports = function () /* ...pargs */{
	  var fn = aFunction(this),
	      length = arguments.length,
	      pargs = Array(length),
	      i = 0,
	      _ = path._,
	      holder = false;
	  while (length > i) {
	    if ((pargs[i] = arguments[i++]) === _) holder = true;
	  }return function () /* ...args */{
	    var that = this,
	        aLen = arguments.length,
	        j = 0,
	        k = 0,
	        args;
	    if (!holder && !aLen) return invoke(fn, pargs, that);
	    args = pargs.slice();
	    if (holder) for (; length > j; j++) {
	      if (args[j] === _) args[j] = arguments[k++];
	    }while (aLen > k) {
	      args.push(arguments[k++]);
	    }return invoke(fn, args, that);
	  };
	};

/***/ },
/* 278 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(7);

/***/ },
/* 279 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var $export = __webpack_require__(12),
	    $task = __webpack_require__(205);
	$export($export.G + $export.B, {
	  setImmediate: $task.set,
	  clearImmediate: $task.clear
	});

/***/ },
/* 280 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var $iterators = __webpack_require__(191),
	    redefine = __webpack_require__(21),
	    global = __webpack_require__(7),
	    hide = __webpack_require__(13),
	    Iterators = __webpack_require__(131),
	    wks = __webpack_require__(28),
	    ITERATOR = wks('iterator'),
	    TO_STRING_TAG = wks('toStringTag'),
	    ArrayValues = Iterators.Array;

	for (var collections = ['NodeList', 'DOMTokenList', 'MediaList', 'StyleSheetList', 'CSSRuleList'], i = 0; i < 5; i++) {
	  var NAME = collections[i],
	      Collection = global[NAME],
	      proto = Collection && Collection.prototype,
	      key;
	  if (proto) {
	    if (!proto[ITERATOR]) hide(proto, ITERATOR, ArrayValues);
	    if (!proto[TO_STRING_TAG]) hide(proto, TO_STRING_TAG, NAME);
	    Iterators[NAME] = ArrayValues;
	    for (key in $iterators) {
	      if (!proto[key]) redefine(proto, key, $iterators[key], true);
	    }
	  }
	}

/***/ },
/* 281 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global, module, process) {"use strict";

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	/**
	 * Copyright (c) 2014, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * https://raw.github.com/facebook/regenerator/master/LICENSE file. An
	 * additional grant of patent rights can be found in the PATENTS file in
	 * the same directory.
	 */

	!function (global) {
	  "use strict";

	  var hasOwn = Object.prototype.hasOwnProperty;
	  var undefined; // More compressible than void 0.
	  var iteratorSymbol = typeof Symbol === "function" && Symbol.iterator || "@@iterator";

	  var inModule = ( false ? "undefined" : _typeof(module)) === "object";
	  var runtime = global.regeneratorRuntime;
	  if (runtime) {
	    if (inModule) {
	      // If regeneratorRuntime is defined globally and we're in a module,
	      // make the exports object identical to regeneratorRuntime.
	      module.exports = runtime;
	    }
	    // Don't bother evaluating the rest of this file if the runtime was
	    // already defined globally.
	    return;
	  }

	  // Define the runtime globally (as expected by generated code) as either
	  // module.exports (if we're in a module) or a new, empty object.
	  runtime = global.regeneratorRuntime = inModule ? module.exports : {};

	  function wrap(innerFn, outerFn, self, tryLocsList) {
	    // If outerFn provided, then outerFn.prototype instanceof Generator.
	    var generator = Object.create((outerFn || Generator).prototype);
	    var context = new Context(tryLocsList || []);

	    // The ._invoke method unifies the implementations of the .next,
	    // .throw, and .return methods.
	    generator._invoke = makeInvokeMethod(innerFn, self, context);

	    return generator;
	  }
	  runtime.wrap = wrap;

	  // Try/catch helper to minimize deoptimizations. Returns a completion
	  // record like context.tryEntries[i].completion. This interface could
	  // have been (and was previously) designed to take a closure to be
	  // invoked without arguments, but in all the cases we care about we
	  // already have an existing method we want to call, so there's no need
	  // to create a new function object. We can even get away with assuming
	  // the method takes exactly one argument, since that happens to be true
	  // in every case, so we don't have to touch the arguments object. The
	  // only additional allocation required is the completion record, which
	  // has a stable shape and so hopefully should be cheap to allocate.
	  function tryCatch(fn, obj, arg) {
	    try {
	      return { type: "normal", arg: fn.call(obj, arg) };
	    } catch (err) {
	      return { type: "throw", arg: err };
	    }
	  }

	  var GenStateSuspendedStart = "suspendedStart";
	  var GenStateSuspendedYield = "suspendedYield";
	  var GenStateExecuting = "executing";
	  var GenStateCompleted = "completed";

	  // Returning this object from the innerFn has the same effect as
	  // breaking out of the dispatch switch statement.
	  var ContinueSentinel = {};

	  // Dummy constructor functions that we use as the .constructor and
	  // .constructor.prototype properties for functions that return Generator
	  // objects. For full spec compliance, you may wish to configure your
	  // minifier not to mangle the names of these two functions.
	  function Generator() {}
	  function GeneratorFunction() {}
	  function GeneratorFunctionPrototype() {}

	  var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype;
	  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
	  GeneratorFunctionPrototype.constructor = GeneratorFunction;
	  GeneratorFunction.displayName = "GeneratorFunction";

	  // Helper for defining the .next, .throw, and .return methods of the
	  // Iterator interface in terms of a single ._invoke method.
	  function defineIteratorMethods(prototype) {
	    ["next", "throw", "return"].forEach(function (method) {
	      prototype[method] = function (arg) {
	        return this._invoke(method, arg);
	      };
	    });
	  }

	  runtime.isGeneratorFunction = function (genFun) {
	    var ctor = typeof genFun === "function" && genFun.constructor;
	    return ctor ? ctor === GeneratorFunction ||
	    // For the native GeneratorFunction constructor, the best we can
	    // do is to check its .name property.
	    (ctor.displayName || ctor.name) === "GeneratorFunction" : false;
	  };

	  runtime.mark = function (genFun) {
	    if (Object.setPrototypeOf) {
	      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
	    } else {
	      genFun.__proto__ = GeneratorFunctionPrototype;
	    }
	    genFun.prototype = Object.create(Gp);
	    return genFun;
	  };

	  // Within the body of any async function, `await x` is transformed to
	  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
	  // `value instanceof AwaitArgument` to determine if the yielded value is
	  // meant to be awaited. Some may consider the name of this method too
	  // cutesy, but they are curmudgeons.
	  runtime.awrap = function (arg) {
	    return new AwaitArgument(arg);
	  };

	  function AwaitArgument(arg) {
	    this.arg = arg;
	  }

	  function AsyncIterator(generator) {
	    // This invoke function is written in a style that assumes some
	    // calling function (or Promise) will handle exceptions.
	    function invoke(method, arg) {
	      var result = generator[method](arg);
	      var value = result.value;
	      return value instanceof AwaitArgument ? Promise.resolve(value.arg).then(invokeNext, invokeThrow) : Promise.resolve(value).then(function (unwrapped) {
	        // When a yielded Promise is resolved, its final value becomes
	        // the .value of the Promise<{value,done}> result for the
	        // current iteration. If the Promise is rejected, however, the
	        // result for this iteration will be rejected with the same
	        // reason. Note that rejections of yielded Promises are not
	        // thrown back into the generator function, as is the case
	        // when an awaited Promise is rejected. This difference in
	        // behavior between yield and await is important, because it
	        // allows the consumer to decide what to do with the yielded
	        // rejection (swallow it and continue, manually .throw it back
	        // into the generator, abandon iteration, whatever). With
	        // await, by contrast, there is no opportunity to examine the
	        // rejection reason outside the generator function, so the
	        // only option is to throw it from the await expression, and
	        // let the generator function handle the exception.
	        result.value = unwrapped;
	        return result;
	      });
	    }

	    if ((typeof process === "undefined" ? "undefined" : _typeof(process)) === "object" && process.domain) {
	      invoke = process.domain.bind(invoke);
	    }

	    var invokeNext = invoke.bind(generator, "next");
	    var invokeThrow = invoke.bind(generator, "throw");
	    var invokeReturn = invoke.bind(generator, "return");
	    var previousPromise;

	    function enqueue(method, arg) {
	      function callInvokeWithMethodAndArg() {
	        return invoke(method, arg);
	      }

	      return previousPromise =
	      // If enqueue has been called before, then we want to wait until
	      // all previous Promises have been resolved before calling invoke,
	      // so that results are always delivered in the correct order. If
	      // enqueue has not been called before, then it is important to
	      // call invoke immediately, without waiting on a callback to fire,
	      // so that the async generator function has the opportunity to do
	      // any necessary setup in a predictable way. This predictability
	      // is why the Promise constructor synchronously invokes its
	      // executor callback, and why async functions synchronously
	      // execute code before the first await. Since we implement simple
	      // async functions in terms of async generators, it is especially
	      // important to get this right, even though it requires care.
	      previousPromise ? previousPromise.then(callInvokeWithMethodAndArg,
	      // Avoid propagating failures to Promises returned by later
	      // invocations of the iterator.
	      callInvokeWithMethodAndArg) : new Promise(function (resolve) {
	        resolve(callInvokeWithMethodAndArg());
	      });
	    }

	    // Define the unified helper method that is used to implement .next,
	    // .throw, and .return (see defineIteratorMethods).
	    this._invoke = enqueue;
	  }

	  defineIteratorMethods(AsyncIterator.prototype);

	  // Note that simple async functions are implemented on top of
	  // AsyncIterator objects; they just return a Promise for the value of
	  // the final result produced by the iterator.
	  runtime.async = function (innerFn, outerFn, self, tryLocsList) {
	    var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList));

	    return runtime.isGeneratorFunction(outerFn) ? iter // If outerFn is a generator, return the full iterator.
	    : iter.next().then(function (result) {
	      return result.done ? result.value : iter.next();
	    });
	  };

	  function makeInvokeMethod(innerFn, self, context) {
	    var state = GenStateSuspendedStart;

	    return function invoke(method, arg) {
	      if (state === GenStateExecuting) {
	        throw new Error("Generator is already running");
	      }

	      if (state === GenStateCompleted) {
	        if (method === "throw") {
	          throw arg;
	        }

	        // Be forgiving, per 25.3.3.3.3 of the spec:
	        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
	        return doneResult();
	      }

	      while (true) {
	        var delegate = context.delegate;
	        if (delegate) {
	          if (method === "return" || method === "throw" && delegate.iterator[method] === undefined) {
	            // A return or throw (when the delegate iterator has no throw
	            // method) always terminates the yield* loop.
	            context.delegate = null;

	            // If the delegate iterator has a return method, give it a
	            // chance to clean up.
	            var returnMethod = delegate.iterator["return"];
	            if (returnMethod) {
	              var record = tryCatch(returnMethod, delegate.iterator, arg);
	              if (record.type === "throw") {
	                // If the return method threw an exception, let that
	                // exception prevail over the original return or throw.
	                method = "throw";
	                arg = record.arg;
	                continue;
	              }
	            }

	            if (method === "return") {
	              // Continue with the outer return, now that the delegate
	              // iterator has been terminated.
	              continue;
	            }
	          }

	          var record = tryCatch(delegate.iterator[method], delegate.iterator, arg);

	          if (record.type === "throw") {
	            context.delegate = null;

	            // Like returning generator.throw(uncaught), but without the
	            // overhead of an extra function call.
	            method = "throw";
	            arg = record.arg;
	            continue;
	          }

	          // Delegate generator ran and handled its own exceptions so
	          // regardless of what the method was, we continue as if it is
	          // "next" with an undefined arg.
	          method = "next";
	          arg = undefined;

	          var info = record.arg;
	          if (info.done) {
	            context[delegate.resultName] = info.value;
	            context.next = delegate.nextLoc;
	          } else {
	            state = GenStateSuspendedYield;
	            return info;
	          }

	          context.delegate = null;
	        }

	        if (method === "next") {
	          context._sent = arg;

	          if (state === GenStateSuspendedYield) {
	            context.sent = arg;
	          } else {
	            context.sent = undefined;
	          }
	        } else if (method === "throw") {
	          if (state === GenStateSuspendedStart) {
	            state = GenStateCompleted;
	            throw arg;
	          }

	          if (context.dispatchException(arg)) {
	            // If the dispatched exception was caught by a catch block,
	            // then let that catch block handle the exception normally.
	            method = "next";
	            arg = undefined;
	          }
	        } else if (method === "return") {
	          context.abrupt("return", arg);
	        }

	        state = GenStateExecuting;

	        var record = tryCatch(innerFn, self, context);
	        if (record.type === "normal") {
	          // If an exception is thrown from innerFn, we leave state ===
	          // GenStateExecuting and loop back for another invocation.
	          state = context.done ? GenStateCompleted : GenStateSuspendedYield;

	          var info = {
	            value: record.arg,
	            done: context.done
	          };

	          if (record.arg === ContinueSentinel) {
	            if (context.delegate && method === "next") {
	              // Deliberately forget the last sent value so that we don't
	              // accidentally pass it on to the delegate.
	              arg = undefined;
	            }
	          } else {
	            return info;
	          }
	        } else if (record.type === "throw") {
	          state = GenStateCompleted;
	          // Dispatch the exception by looping back around to the
	          // context.dispatchException(arg) call above.
	          method = "throw";
	          arg = record.arg;
	        }
	      }
	    };
	  }

	  // Define Generator.prototype.{next,throw,return} in terms of the
	  // unified ._invoke helper method.
	  defineIteratorMethods(Gp);

	  Gp[iteratorSymbol] = function () {
	    return this;
	  };

	  Gp.toString = function () {
	    return "[object Generator]";
	  };

	  function pushTryEntry(locs) {
	    var entry = { tryLoc: locs[0] };

	    if (1 in locs) {
	      entry.catchLoc = locs[1];
	    }

	    if (2 in locs) {
	      entry.finallyLoc = locs[2];
	      entry.afterLoc = locs[3];
	    }

	    this.tryEntries.push(entry);
	  }

	  function resetTryEntry(entry) {
	    var record = entry.completion || {};
	    record.type = "normal";
	    delete record.arg;
	    entry.completion = record;
	  }

	  function Context(tryLocsList) {
	    // The root entry object (effectively a try statement without a catch
	    // or a finally block) gives us a place to store values thrown from
	    // locations where there is no enclosing try statement.
	    this.tryEntries = [{ tryLoc: "root" }];
	    tryLocsList.forEach(pushTryEntry, this);
	    this.reset(true);
	  }

	  runtime.keys = function (object) {
	    var keys = [];
	    for (var key in object) {
	      keys.push(key);
	    }
	    keys.reverse();

	    // Rather than returning an object with a next method, we keep
	    // things simple and return the next function itself.
	    return function next() {
	      while (keys.length) {
	        var key = keys.pop();
	        if (key in object) {
	          next.value = key;
	          next.done = false;
	          return next;
	        }
	      }

	      // To avoid creating an additional object, we just hang the .value
	      // and .done properties off the next function object itself. This
	      // also ensures that the minifier will not anonymize the function.
	      next.done = true;
	      return next;
	    };
	  };

	  function values(iterable) {
	    if (iterable) {
	      var iteratorMethod = iterable[iteratorSymbol];
	      if (iteratorMethod) {
	        return iteratorMethod.call(iterable);
	      }

	      if (typeof iterable.next === "function") {
	        return iterable;
	      }

	      if (!isNaN(iterable.length)) {
	        var i = -1,
	            next = function next() {
	          while (++i < iterable.length) {
	            if (hasOwn.call(iterable, i)) {
	              next.value = iterable[i];
	              next.done = false;
	              return next;
	            }
	          }

	          next.value = undefined;
	          next.done = true;

	          return next;
	        };

	        return next.next = next;
	      }
	    }

	    // Return an iterator with no values.
	    return { next: doneResult };
	  }
	  runtime.values = values;

	  function doneResult() {
	    return { value: undefined, done: true };
	  }

	  Context.prototype = {
	    constructor: Context,

	    reset: function reset(skipTempReset) {
	      this.prev = 0;
	      this.next = 0;
	      this.sent = undefined;
	      this.done = false;
	      this.delegate = null;

	      this.tryEntries.forEach(resetTryEntry);

	      if (!skipTempReset) {
	        for (var name in this) {
	          // Not sure about the optimal order of these conditions:
	          if (name.charAt(0) === "t" && hasOwn.call(this, name) && !isNaN(+name.slice(1))) {
	            this[name] = undefined;
	          }
	        }
	      }
	    },

	    stop: function stop() {
	      this.done = true;

	      var rootEntry = this.tryEntries[0];
	      var rootRecord = rootEntry.completion;
	      if (rootRecord.type === "throw") {
	        throw rootRecord.arg;
	      }

	      return this.rval;
	    },

	    dispatchException: function dispatchException(exception) {
	      if (this.done) {
	        throw exception;
	      }

	      var context = this;
	      function handle(loc, caught) {
	        record.type = "throw";
	        record.arg = exception;
	        context.next = loc;
	        return !!caught;
	      }

	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        var record = entry.completion;

	        if (entry.tryLoc === "root") {
	          // Exception thrown outside of any try block that could handle
	          // it, so set the completion value of the entire function to
	          // throw the exception.
	          return handle("end");
	        }

	        if (entry.tryLoc <= this.prev) {
	          var hasCatch = hasOwn.call(entry, "catchLoc");
	          var hasFinally = hasOwn.call(entry, "finallyLoc");

	          if (hasCatch && hasFinally) {
	            if (this.prev < entry.catchLoc) {
	              return handle(entry.catchLoc, true);
	            } else if (this.prev < entry.finallyLoc) {
	              return handle(entry.finallyLoc);
	            }
	          } else if (hasCatch) {
	            if (this.prev < entry.catchLoc) {
	              return handle(entry.catchLoc, true);
	            }
	          } else if (hasFinally) {
	            if (this.prev < entry.finallyLoc) {
	              return handle(entry.finallyLoc);
	            }
	          } else {
	            throw new Error("try statement without catch or finally");
	          }
	        }
	      }
	    },

	    abrupt: function abrupt(type, arg) {
	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
	          var finallyEntry = entry;
	          break;
	        }
	      }

	      if (finallyEntry && (type === "break" || type === "continue") && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc) {
	        // Ignore the finally entry if control is not jumping to a
	        // location outside the try/catch block.
	        finallyEntry = null;
	      }

	      var record = finallyEntry ? finallyEntry.completion : {};
	      record.type = type;
	      record.arg = arg;

	      if (finallyEntry) {
	        this.next = finallyEntry.finallyLoc;
	      } else {
	        this.complete(record);
	      }

	      return ContinueSentinel;
	    },

	    complete: function complete(record, afterLoc) {
	      if (record.type === "throw") {
	        throw record.arg;
	      }

	      if (record.type === "break" || record.type === "continue") {
	        this.next = record.arg;
	      } else if (record.type === "return") {
	        this.rval = record.arg;
	        this.next = "end";
	      } else if (record.type === "normal" && afterLoc) {
	        this.next = afterLoc;
	      }
	    },

	    finish: function finish(finallyLoc) {
	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        if (entry.finallyLoc === finallyLoc) {
	          this.complete(entry.completion, entry.afterLoc);
	          resetTryEntry(entry);
	          return ContinueSentinel;
	        }
	      }
	    },

	    "catch": function _catch(tryLoc) {
	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        if (entry.tryLoc === tryLoc) {
	          var record = entry.completion;
	          if (record.type === "throw") {
	            var thrown = record.arg;
	            resetTryEntry(entry);
	          }
	          return thrown;
	        }
	      }

	      // The context.catch method must only be called with a location
	      // argument that corresponds to a known catch block.
	      throw new Error("illegal catch attempt");
	    },

	    delegateYield: function delegateYield(iterable, resultName, nextLoc) {
	      this.delegate = {
	        iterator: values(iterable),
	        resultName: resultName,
	        nextLoc: nextLoc
	      };

	      return ContinueSentinel;
	    }
	  };
	}(
	// Among the various tricks for obtaining a reference to the global
	// object, this seems to be the most reliable technique that does not
	// use indirect eval (which violates Content Security Policy).
	(typeof global === "undefined" ? "undefined" : _typeof(global)) === "object" ? global : (typeof window === "undefined" ? "undefined" : _typeof(window)) === "object" ? window : (typeof self === "undefined" ? "undefined" : _typeof(self)) === "object" ? self : undefined);
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(282)(module), __webpack_require__(283)))

/***/ },
/* 282 */
/***/ function(module, exports) {

	"use strict";

	module.exports = function (module) {
		if (!module.webpackPolyfill) {
			module.deprecate = function () {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	};

/***/ },
/* 283 */
/***/ function(module, exports) {

	'use strict';

	// shim for using process in browser

	var process = module.exports = {};
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = setTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while (len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    clearTimeout(timeout);
	}

	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        setTimeout(drainQueue, 0);
	    }
	};

	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	process.cwd = function () {
	    return '/';
	};
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function () {
	    return 0;
	};

/***/ },
/* 284 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	__webpack_require__(285);
	module.exports = __webpack_require__(8).RegExp.escape;

/***/ },
/* 285 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// https://github.com/benjamingr/RexExp.escape
	var $export = __webpack_require__(12),
	    $re = __webpack_require__(286)(/[\\^$*+?.()|[\]{}]/g, '\\$&');

	$export($export.S, 'RegExp', { escape: function escape(it) {
	    return $re(it);
	  } });

/***/ },
/* 286 */
/***/ function(module, exports) {

	"use strict";

	module.exports = function (regExp, replace) {
	  var replacer = replace === Object(replace) ? function (part) {
	    return replace[part];
	  } : replace;
	  return function (it) {
	    return String(it).replace(regExp, replacer);
	  };
	};

/***/ },
/* 287 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module, global, process) {'use strict';var _typeof=typeof Symbol==="function"&&typeof Symbol.iterator==="symbol"?function(obj){return typeof obj;}:function(obj){return obj&&typeof Symbol==="function"&&obj.constructor===Symbol?"symbol":typeof obj;}; // Copyright (c) Microsoft, All rights reserved. See License.txt in the project root for license information.
	;(function(undefined){var objectTypes={'function':true,'object':true};function checkGlobal(value){return value&&value.Object===Object?value:null;}var freeExports=objectTypes[ false?'undefined':_typeof(exports)]&&exports&&!exports.nodeType?exports:null;var freeModule=objectTypes[ false?'undefined':_typeof(module)]&&module&&!module.nodeType?module:null;var freeGlobal=checkGlobal(freeExports&&freeModule&&(typeof global==='undefined'?'undefined':_typeof(global))==='object'&&global);var freeSelf=checkGlobal(objectTypes[typeof self==='undefined'?'undefined':_typeof(self)]&&self);var freeWindow=checkGlobal(objectTypes[typeof window==='undefined'?'undefined':_typeof(window)]&&window);var moduleExports=freeModule&&freeModule.exports===freeExports?freeExports:null;var thisGlobal=checkGlobal(objectTypes[_typeof(this)]&&this);var root=freeGlobal||freeWindow!==(thisGlobal&&thisGlobal.window)&&freeWindow||freeSelf||thisGlobal||Function('return this')();var Rx={internals:{},config:{Promise:root.Promise},helpers:{}}; // Defaults
	var noop=Rx.helpers.noop=function(){},identity=Rx.helpers.identity=function(x){return x;},defaultNow=Rx.helpers.defaultNow=Date.now,defaultComparer=Rx.helpers.defaultComparer=function(x,y){return isEqual(x,y);},defaultSubComparer=Rx.helpers.defaultSubComparer=function(x,y){return x>y?1:x<y?-1:0;},defaultKeySerializer=Rx.helpers.defaultKeySerializer=function(x){return x.toString();},defaultError=Rx.helpers.defaultError=function(err){throw err;},isPromise=Rx.helpers.isPromise=function(p){return !!p&&typeof p.subscribe!=='function'&&typeof p.then==='function';},isFunction=Rx.helpers.isFunction=function(){var isFn=function isFn(value){return typeof value=='function'||false;}; // fallback for older versions of Chrome and Safari
	if(isFn(/x/)){isFn=function isFn(value){return typeof value=='function'&&toString.call(value)=='[object Function]';};}return isFn;}();function cloneArray(arr){for(var a=[],i=0,len=arr.length;i<len;i++){a.push(arr[i]);}return a;}var errorObj={e:{}};function tryCatcherGen(tryCatchTarget){return function tryCatcher(){try{return tryCatchTarget.apply(this,arguments);}catch(e){errorObj.e=e;return errorObj;}};}var tryCatch=Rx.internals.tryCatch=function tryCatch(fn){if(!isFunction(fn)){throw new TypeError('fn must be a function');}return tryCatcherGen(fn);};function thrower(e){throw e;}Rx.config.longStackSupport=false;var hasStacks=false,stacks=tryCatch(function(){throw new Error();})();hasStacks=!!stacks.e&&!!stacks.e.stack; // All code after this point will be filtered from stack traces reported by RxJS
	var rStartingLine=captureLine(),rFileName;var STACK_JUMP_SEPARATOR='From previous event:';function makeStackTraceLong(error,observable){ // If possible, transform the error stack trace by removing Node and RxJS
	// cruft, then concatenating with the stack trace of `observable`.
	if(hasStacks&&observable.stack&&(typeof error==='undefined'?'undefined':_typeof(error))==='object'&&error!==null&&error.stack&&error.stack.indexOf(STACK_JUMP_SEPARATOR)===-1){var stacks=[];for(var o=observable;!!o;o=o.source){if(o.stack){stacks.unshift(o.stack);}}stacks.unshift(error.stack);var concatedStacks=stacks.join('\n'+STACK_JUMP_SEPARATOR+'\n');error.stack=filterStackString(concatedStacks);}}function filterStackString(stackString){var lines=stackString.split('\n'),desiredLines=[];for(var i=0,len=lines.length;i<len;i++){var line=lines[i];if(!isInternalFrame(line)&&!isNodeFrame(line)&&line){desiredLines.push(line);}}return desiredLines.join('\n');}function isInternalFrame(stackLine){var fileNameAndLineNumber=getFileNameAndLineNumber(stackLine);if(!fileNameAndLineNumber){return false;}var fileName=fileNameAndLineNumber[0],lineNumber=fileNameAndLineNumber[1];return fileName===rFileName&&lineNumber>=rStartingLine&&lineNumber<=rEndingLine;}function isNodeFrame(stackLine){return stackLine.indexOf('(module.js:')!==-1||stackLine.indexOf('(node.js:')!==-1;}function captureLine(){if(!hasStacks){return;}try{throw new Error();}catch(e){var lines=e.stack.split('\n');var firstLine=lines[0].indexOf('@')>0?lines[1]:lines[2];var fileNameAndLineNumber=getFileNameAndLineNumber(firstLine);if(!fileNameAndLineNumber){return;}rFileName=fileNameAndLineNumber[0];return fileNameAndLineNumber[1];}}function getFileNameAndLineNumber(stackLine){ // Named functions: 'at functionName (filename:lineNumber:columnNumber)'
	var attempt1=/at .+ \((.+):(\d+):(?:\d+)\)$/.exec(stackLine);if(attempt1){return [attempt1[1],Number(attempt1[2])];} // Anonymous functions: 'at filename:lineNumber:columnNumber'
	var attempt2=/at ([^ ]+):(\d+):(?:\d+)$/.exec(stackLine);if(attempt2){return [attempt2[1],Number(attempt2[2])];} // Firefox style: 'function@filename:lineNumber or @filename:lineNumber'
	var attempt3=/.*@(.+):(\d+)$/.exec(stackLine);if(attempt3){return [attempt3[1],Number(attempt3[2])];}}var EmptyError=Rx.EmptyError=function(){this.message='Sequence contains no elements.';Error.call(this);};EmptyError.prototype=Object.create(Error.prototype);EmptyError.prototype.name='EmptyError';var ObjectDisposedError=Rx.ObjectDisposedError=function(){this.message='Object has been disposed';Error.call(this);};ObjectDisposedError.prototype=Object.create(Error.prototype);ObjectDisposedError.prototype.name='ObjectDisposedError';var ArgumentOutOfRangeError=Rx.ArgumentOutOfRangeError=function(){this.message='Argument out of range';Error.call(this);};ArgumentOutOfRangeError.prototype=Object.create(Error.prototype);ArgumentOutOfRangeError.prototype.name='ArgumentOutOfRangeError';var NotSupportedError=Rx.NotSupportedError=function(message){this.message=message||'This operation is not supported';Error.call(this);};NotSupportedError.prototype=Object.create(Error.prototype);NotSupportedError.prototype.name='NotSupportedError';var NotImplementedError=Rx.NotImplementedError=function(message){this.message=message||'This operation is not implemented';Error.call(this);};NotImplementedError.prototype=Object.create(Error.prototype);NotImplementedError.prototype.name='NotImplementedError';var notImplemented=Rx.helpers.notImplemented=function(){throw new NotImplementedError();};var notSupported=Rx.helpers.notSupported=function(){throw new NotSupportedError();}; // Shim in iterator support
	var $iterator$=typeof Symbol==='function'&&Symbol.iterator||'_es6shim_iterator_'; // Bug for mozilla version
	if(root.Set&&typeof new root.Set()['@@iterator']==='function'){$iterator$='@@iterator';}var doneEnumerator=Rx.doneEnumerator={done:true,value:undefined};var isIterable=Rx.helpers.isIterable=function(o){return o&&o[$iterator$]!==undefined;};var isArrayLike=Rx.helpers.isArrayLike=function(o){return o&&o.length!==undefined;};Rx.helpers.iterator=$iterator$;var bindCallback=Rx.internals.bindCallback=function(func,thisArg,argCount){if(typeof thisArg==='undefined'){return func;}switch(argCount){case 0:return function(){return func.call(thisArg);};case 1:return function(arg){return func.call(thisArg,arg);};case 2:return function(value,index){return func.call(thisArg,value,index);};case 3:return function(value,index,collection){return func.call(thisArg,value,index,collection);};}return function(){return func.apply(thisArg,arguments);};}; /** Used to determine if values are of the language type Object */var dontEnums=['toString','toLocaleString','valueOf','hasOwnProperty','isPrototypeOf','propertyIsEnumerable','constructor'],dontEnumsLength=dontEnums.length;var argsTag='[object Arguments]',arrayTag='[object Array]',boolTag='[object Boolean]',dateTag='[object Date]',errorTag='[object Error]',funcTag='[object Function]',mapTag='[object Map]',numberTag='[object Number]',objectTag='[object Object]',regexpTag='[object RegExp]',setTag='[object Set]',stringTag='[object String]',weakMapTag='[object WeakMap]';var arrayBufferTag='[object ArrayBuffer]',float32Tag='[object Float32Array]',float64Tag='[object Float64Array]',int8Tag='[object Int8Array]',int16Tag='[object Int16Array]',int32Tag='[object Int32Array]',uint8Tag='[object Uint8Array]',uint8ClampedTag='[object Uint8ClampedArray]',uint16Tag='[object Uint16Array]',uint32Tag='[object Uint32Array]';var typedArrayTags={};typedArrayTags[float32Tag]=typedArrayTags[float64Tag]=typedArrayTags[int8Tag]=typedArrayTags[int16Tag]=typedArrayTags[int32Tag]=typedArrayTags[uint8Tag]=typedArrayTags[uint8ClampedTag]=typedArrayTags[uint16Tag]=typedArrayTags[uint32Tag]=true;typedArrayTags[argsTag]=typedArrayTags[arrayTag]=typedArrayTags[arrayBufferTag]=typedArrayTags[boolTag]=typedArrayTags[dateTag]=typedArrayTags[errorTag]=typedArrayTags[funcTag]=typedArrayTags[mapTag]=typedArrayTags[numberTag]=typedArrayTags[objectTag]=typedArrayTags[regexpTag]=typedArrayTags[setTag]=typedArrayTags[stringTag]=typedArrayTags[weakMapTag]=false;var objectProto=Object.prototype,hasOwnProperty=objectProto.hasOwnProperty,objToString=objectProto.toString,MAX_SAFE_INTEGER=Math.pow(2,53)-1;var keys=Object.keys||function(){var hasOwnProperty=Object.prototype.hasOwnProperty,hasDontEnumBug=!{toString:null}.propertyIsEnumerable('toString'),dontEnums=['toString','toLocaleString','valueOf','hasOwnProperty','isPrototypeOf','propertyIsEnumerable','constructor'],dontEnumsLength=dontEnums.length;return function(obj){if((typeof obj==='undefined'?'undefined':_typeof(obj))!=='object'&&(typeof obj!=='function'||obj===null)){throw new TypeError('Object.keys called on non-object');}var result=[],prop,i;for(prop in obj){if(hasOwnProperty.call(obj,prop)){result.push(prop);}}if(hasDontEnumBug){for(i=0;i<dontEnumsLength;i++){if(hasOwnProperty.call(obj,dontEnums[i])){result.push(dontEnums[i]);}}}return result;};}();function equalObjects(object,other,equalFunc,isLoose,stackA,stackB){var objProps=keys(object),objLength=objProps.length,othProps=keys(other),othLength=othProps.length;if(objLength!==othLength&&!isLoose){return false;}var index=objLength,key;while(index--){key=objProps[index];if(!(isLoose?key in other:hasOwnProperty.call(other,key))){return false;}}var skipCtor=isLoose;while(++index<objLength){key=objProps[index];var objValue=object[key],othValue=other[key],result;if(!(result===undefined?equalFunc(objValue,othValue,isLoose,stackA,stackB):result)){return false;}skipCtor||(skipCtor=key==='constructor');}if(!skipCtor){var objCtor=object.constructor,othCtor=other.constructor;if(objCtor!==othCtor&&'constructor' in object&&'constructor' in other&&!(typeof objCtor==='function'&&objCtor instanceof objCtor&&typeof othCtor==='function'&&othCtor instanceof othCtor)){return false;}}return true;}function equalByTag(object,other,tag){switch(tag){case boolTag:case dateTag:return +object===+other;case errorTag:return object.name===other.name&&object.message===other.message;case numberTag:return object!==+object?other!==+other:object===+other;case regexpTag:case stringTag:return object===other+'';}return false;}var isObject=Rx.internals.isObject=function(value){var type=typeof value==='undefined'?'undefined':_typeof(value);return !!value&&(type==='object'||type==='function');};function isObjectLike(value){return !!value&&(typeof value==='undefined'?'undefined':_typeof(value))==='object';}function isLength(value){return typeof value==='number'&&value>-1&&value%1===0&&value<=MAX_SAFE_INTEGER;}var isHostObject=function(){try{Object({'toString':0}+'');}catch(e){return function(){return false;};}return function(value){return typeof value.toString!=='function'&&typeof (value+'')==='string';};}();function isTypedArray(value){return isObjectLike(value)&&isLength(value.length)&&!!typedArrayTags[objToString.call(value)];}var isArray=Array.isArray||function(value){return isObjectLike(value)&&isLength(value.length)&&objToString.call(value)===arrayTag;};function arraySome(array,predicate){var index=-1,length=array.length;while(++index<length){if(predicate(array[index],index,array)){return true;}}return false;}function equalArrays(array,other,equalFunc,isLoose,stackA,stackB){var index=-1,arrLength=array.length,othLength=other.length;if(arrLength!==othLength&&!(isLoose&&othLength>arrLength)){return false;} // Ignore non-index properties.
	while(++index<arrLength){var arrValue=array[index],othValue=other[index],result;if(result!==undefined){if(result){continue;}return false;} // Recursively compare arrays (susceptible to call stack limits).
	if(isLoose){if(!arraySome(other,function(othValue){return arrValue===othValue||equalFunc(arrValue,othValue,isLoose,stackA,stackB);})){return false;}}else if(!(arrValue===othValue||equalFunc(arrValue,othValue,isLoose,stackA,stackB))){return false;}}return true;}function baseIsEqualDeep(object,other,equalFunc,isLoose,stackA,stackB){var objIsArr=isArray(object),othIsArr=isArray(other),objTag=arrayTag,othTag=arrayTag;if(!objIsArr){objTag=objToString.call(object);if(objTag===argsTag){objTag=objectTag;}else if(objTag!==objectTag){objIsArr=isTypedArray(object);}}if(!othIsArr){othTag=objToString.call(other);if(othTag===argsTag){othTag=objectTag;}}var objIsObj=objTag===objectTag&&!isHostObject(object),othIsObj=othTag===objectTag&&!isHostObject(other),isSameTag=objTag===othTag;if(isSameTag&&!(objIsArr||objIsObj)){return equalByTag(object,other,objTag);}if(!isLoose){var objIsWrapped=objIsObj&&hasOwnProperty.call(object,'__wrapped__'),othIsWrapped=othIsObj&&hasOwnProperty.call(other,'__wrapped__');if(objIsWrapped||othIsWrapped){return equalFunc(objIsWrapped?object.value():object,othIsWrapped?other.value():other,isLoose,stackA,stackB);}}if(!isSameTag){return false;} // Assume cyclic values are equal.
	// For more information on detecting circular references see https://es5.github.io/#JO.
	stackA||(stackA=[]);stackB||(stackB=[]);var length=stackA.length;while(length--){if(stackA[length]===object){return stackB[length]===other;}} // Add `object` and `other` to the stack of traversed objects.
	stackA.push(object);stackB.push(other);var result=(objIsArr?equalArrays:equalObjects)(object,other,equalFunc,isLoose,stackA,stackB);stackA.pop();stackB.pop();return result;}function baseIsEqual(value,other,isLoose,stackA,stackB){if(value===other){return true;}if(value==null||other==null||!isObject(value)&&!isObjectLike(other)){return value!==value&&other!==other;}return baseIsEqualDeep(value,other,baseIsEqual,isLoose,stackA,stackB);}var isEqual=Rx.internals.isEqual=function(value,other){return baseIsEqual(value,other);};var hasProp={}.hasOwnProperty,slice=Array.prototype.slice;var inherits=Rx.internals.inherits=function(child,parent){function __(){this.constructor=child;}__.prototype=parent.prototype;child.prototype=new __();};var addProperties=Rx.internals.addProperties=function(obj){for(var sources=[],i=1,len=arguments.length;i<len;i++){sources.push(arguments[i]);}for(var idx=0,ln=sources.length;idx<ln;idx++){var source=sources[idx];for(var prop in source){obj[prop]=source[prop];}}}; // Rx Utils
	var addRef=Rx.internals.addRef=function(xs,r){return new AnonymousObservable(function(observer){return new BinaryDisposable(r.getDisposable(),xs.subscribe(observer));});};function arrayInitialize(count,factory){var a=new Array(count);for(var i=0;i<count;i++){a[i]=factory();}return a;}function IndexedItem(id,value){this.id=id;this.value=value;}IndexedItem.prototype.compareTo=function(other){var c=this.value.compareTo(other.value);c===0&&(c=this.id-other.id);return c;};var PriorityQueue=Rx.internals.PriorityQueue=function(capacity){this.items=new Array(capacity);this.length=0;};var priorityProto=PriorityQueue.prototype;priorityProto.isHigherPriority=function(left,right){return this.items[left].compareTo(this.items[right])<0;};priorityProto.percolate=function(index){if(index>=this.length||index<0){return;}var parent=index-1>>1;if(parent<0||parent===index){return;}if(this.isHigherPriority(index,parent)){var temp=this.items[index];this.items[index]=this.items[parent];this.items[parent]=temp;this.percolate(parent);}};priorityProto.heapify=function(index){+index||(index=0);if(index>=this.length||index<0){return;}var left=2*index+1,right=2*index+2,first=index;if(left<this.length&&this.isHigherPriority(left,first)){first=left;}if(right<this.length&&this.isHigherPriority(right,first)){first=right;}if(first!==index){var temp=this.items[index];this.items[index]=this.items[first];this.items[first]=temp;this.heapify(first);}};priorityProto.peek=function(){return this.items[0].value;};priorityProto.removeAt=function(index){this.items[index]=this.items[--this.length];this.items[this.length]=undefined;this.heapify();};priorityProto.dequeue=function(){var result=this.peek();this.removeAt(0);return result;};priorityProto.enqueue=function(item){var index=this.length++;this.items[index]=new IndexedItem(PriorityQueue.count++,item);this.percolate(index);};priorityProto.remove=function(item){for(var i=0;i<this.length;i++){if(this.items[i].value===item){this.removeAt(i);return true;}}return false;};PriorityQueue.count=0; /**
	   * Represents a group of disposable resources that are disposed together.
	   * @constructor
	   */var CompositeDisposable=Rx.CompositeDisposable=function(){var args=[],i,len;if(Array.isArray(arguments[0])){args=arguments[0];}else {len=arguments.length;args=new Array(len);for(i=0;i<len;i++){args[i]=arguments[i];}}this.disposables=args;this.isDisposed=false;this.length=args.length;};var CompositeDisposablePrototype=CompositeDisposable.prototype; /**
	   * Adds a disposable to the CompositeDisposable or disposes the disposable if the CompositeDisposable is disposed.
	   * @param {Mixed} item Disposable to add.
	   */CompositeDisposablePrototype.add=function(item){if(this.isDisposed){item.dispose();}else {this.disposables.push(item);this.length++;}}; /**
	   * Removes and disposes the first occurrence of a disposable from the CompositeDisposable.
	   * @param {Mixed} item Disposable to remove.
	   * @returns {Boolean} true if found; false otherwise.
	   */CompositeDisposablePrototype.remove=function(item){var shouldDispose=false;if(!this.isDisposed){var idx=this.disposables.indexOf(item);if(idx!==-1){shouldDispose=true;this.disposables.splice(idx,1);this.length--;item.dispose();}}return shouldDispose;}; /**
	   *  Disposes all disposables in the group and removes them from the group.
	   */CompositeDisposablePrototype.dispose=function(){if(!this.isDisposed){this.isDisposed=true;var len=this.disposables.length,currentDisposables=new Array(len);for(var i=0;i<len;i++){currentDisposables[i]=this.disposables[i];}this.disposables=[];this.length=0;for(i=0;i<len;i++){currentDisposables[i].dispose();}}}; /**
	   * Provides a set of static methods for creating Disposables.
	   * @param {Function} dispose Action to run during the first call to dispose. The action is guaranteed to be run at most once.
	   */var Disposable=Rx.Disposable=function(action){this.isDisposed=false;this.action=action||noop;}; /** Performs the task of cleaning up resources. */Disposable.prototype.dispose=function(){if(!this.isDisposed){this.action();this.isDisposed=true;}}; /**
	   * Creates a disposable object that invokes the specified action when disposed.
	   * @param {Function} dispose Action to run during the first call to dispose. The action is guaranteed to be run at most once.
	   * @return {Disposable} The disposable object that runs the given action upon disposal.
	   */var disposableCreate=Disposable.create=function(action){return new Disposable(action);}; /**
	   * Gets the disposable that does nothing when disposed.
	   */var disposableEmpty=Disposable.empty={dispose:noop}; /**
	   * Validates whether the given object is a disposable
	   * @param {Object} Object to test whether it has a dispose method
	   * @returns {Boolean} true if a disposable object, else false.
	   */var isDisposable=Disposable.isDisposable=function(d){return d&&isFunction(d.dispose);};var checkDisposed=Disposable.checkDisposed=function(disposable){if(disposable.isDisposed){throw new ObjectDisposedError();}};var disposableFixup=Disposable._fixup=function(result){return isDisposable(result)?result:disposableEmpty;}; // Single assignment
	var SingleAssignmentDisposable=Rx.SingleAssignmentDisposable=function(){this.isDisposed=false;this.current=null;};SingleAssignmentDisposable.prototype.getDisposable=function(){return this.current;};SingleAssignmentDisposable.prototype.setDisposable=function(value){if(this.current){throw new Error('Disposable has already been assigned');}var shouldDispose=this.isDisposed;!shouldDispose&&(this.current=value);shouldDispose&&value&&value.dispose();};SingleAssignmentDisposable.prototype.dispose=function(){if(!this.isDisposed){this.isDisposed=true;var old=this.current;this.current=null;old&&old.dispose();}}; // Multiple assignment disposable
	var SerialDisposable=Rx.SerialDisposable=function(){this.isDisposed=false;this.current=null;};SerialDisposable.prototype.getDisposable=function(){return this.current;};SerialDisposable.prototype.setDisposable=function(value){var shouldDispose=this.isDisposed;if(!shouldDispose){var old=this.current;this.current=value;}old&&old.dispose();shouldDispose&&value&&value.dispose();};SerialDisposable.prototype.dispose=function(){if(!this.isDisposed){this.isDisposed=true;var old=this.current;this.current=null;}old&&old.dispose();};var BinaryDisposable=Rx.BinaryDisposable=function(first,second){this._first=first;this._second=second;this.isDisposed=false;};BinaryDisposable.prototype.dispose=function(){if(!this.isDisposed){this.isDisposed=true;var old1=this._first;this._first=null;old1&&old1.dispose();var old2=this._second;this._second=null;old2&&old2.dispose();}};var NAryDisposable=Rx.NAryDisposable=function(disposables){this._disposables=disposables;this.isDisposed=false;};NAryDisposable.prototype.dispose=function(){if(!this.isDisposed){this.isDisposed=true;for(var i=0,len=this._disposables.length;i<len;i++){this._disposables[i].dispose();}this._disposables.length=0;}}; /**
	   * Represents a disposable resource that only disposes its underlying disposable resource when all dependent disposable objects have been disposed.
	   */var RefCountDisposable=Rx.RefCountDisposable=function(){function InnerDisposable(disposable){this.disposable=disposable;this.disposable.count++;this.isInnerDisposed=false;}InnerDisposable.prototype.dispose=function(){if(!this.disposable.isDisposed&&!this.isInnerDisposed){this.isInnerDisposed=true;this.disposable.count--;if(this.disposable.count===0&&this.disposable.isPrimaryDisposed){this.disposable.isDisposed=true;this.disposable.underlyingDisposable.dispose();}}}; /**
	     * Initializes a new instance of the RefCountDisposable with the specified disposable.
	     * @constructor
	     * @param {Disposable} disposable Underlying disposable.
	      */function RefCountDisposable(disposable){this.underlyingDisposable=disposable;this.isDisposed=false;this.isPrimaryDisposed=false;this.count=0;} /**
	     * Disposes the underlying disposable only when all dependent disposables have been disposed
	     */RefCountDisposable.prototype.dispose=function(){if(!this.isDisposed&&!this.isPrimaryDisposed){this.isPrimaryDisposed=true;if(this.count===0){this.isDisposed=true;this.underlyingDisposable.dispose();}}}; /**
	     * Returns a dependent disposable that when disposed decreases the refcount on the underlying disposable.
	     * @returns {Disposable} A dependent disposable contributing to the reference count that manages the underlying disposable's lifetime.
	     */RefCountDisposable.prototype.getDisposable=function(){return this.isDisposed?disposableEmpty:new InnerDisposable(this);};return RefCountDisposable;}();function ScheduledDisposable(scheduler,disposable){this.scheduler=scheduler;this.disposable=disposable;this.isDisposed=false;}function scheduleItem(s,self){if(!self.isDisposed){self.isDisposed=true;self.disposable.dispose();}}ScheduledDisposable.prototype.dispose=function(){this.scheduler.schedule(this,scheduleItem);};var ScheduledItem=Rx.internals.ScheduledItem=function(scheduler,state,action,dueTime,comparer){this.scheduler=scheduler;this.state=state;this.action=action;this.dueTime=dueTime;this.comparer=comparer||defaultSubComparer;this.disposable=new SingleAssignmentDisposable();};ScheduledItem.prototype.invoke=function(){this.disposable.setDisposable(this.invokeCore());};ScheduledItem.prototype.compareTo=function(other){return this.comparer(this.dueTime,other.dueTime);};ScheduledItem.prototype.isCancelled=function(){return this.disposable.isDisposed;};ScheduledItem.prototype.invokeCore=function(){return disposableFixup(this.action(this.scheduler,this.state));}; /** Provides a set of static properties to access commonly used schedulers. */var Scheduler=Rx.Scheduler=function(){function Scheduler(){} /** Determines whether the given object is a scheduler */Scheduler.isScheduler=function(s){return s instanceof Scheduler;};var schedulerProto=Scheduler.prototype; /**
	   * Schedules an action to be executed.
	   * @param state State passed to the action to be executed.
	   * @param {Function} action Action to be executed.
	   * @returns {Disposable} The disposable object used to cancel the scheduled action (best effort).
	   */schedulerProto.schedule=function(state,action){throw new NotImplementedError();}; /**
	   * Schedules an action to be executed after dueTime.
	   * @param state State passed to the action to be executed.
	   * @param {Function} action Action to be executed.
	   * @param {Number} dueTime Relative time after which to execute the action.
	   * @returns {Disposable} The disposable object used to cancel the scheduled action (best effort).
	   */schedulerProto.scheduleFuture=function(state,dueTime,action){var dt=dueTime;dt instanceof Date&&(dt=dt-this.now());dt=Scheduler.normalize(dt);if(dt===0){return this.schedule(state,action);}return this._scheduleFuture(state,dt,action);};schedulerProto._scheduleFuture=function(state,dueTime,action){throw new NotImplementedError();}; /** Gets the current time according to the local machine's system clock. */Scheduler.now=defaultNow; /** Gets the current time according to the local machine's system clock. */Scheduler.prototype.now=defaultNow; /**
	     * Normalizes the specified TimeSpan value to a positive value.
	     * @param {Number} timeSpan The time span value to normalize.
	     * @returns {Number} The specified TimeSpan value if it is zero or positive; otherwise, 0
	     */Scheduler.normalize=function(timeSpan){timeSpan<0&&(timeSpan=0);return timeSpan;};return Scheduler;}();var normalizeTime=Scheduler.normalize,isScheduler=Scheduler.isScheduler;(function(schedulerProto){function invokeRecImmediate(scheduler,pair){var state=pair[0],action=pair[1],group=new CompositeDisposable();action(state,innerAction);return group;function innerAction(state2){var isAdded=false,isDone=false;var d=scheduler.schedule(state2,scheduleWork);if(!isDone){group.add(d);isAdded=true;}function scheduleWork(_,state3){if(isAdded){group.remove(d);}else {isDone=true;}action(state3,innerAction);return disposableEmpty;}}}function invokeRecDate(scheduler,pair){var state=pair[0],action=pair[1],group=new CompositeDisposable();action(state,innerAction);return group;function innerAction(state2,dueTime1){var isAdded=false,isDone=false;var d=scheduler.scheduleFuture(state2,dueTime1,scheduleWork);if(!isDone){group.add(d);isAdded=true;}function scheduleWork(_,state3){if(isAdded){group.remove(d);}else {isDone=true;}action(state3,innerAction);return disposableEmpty;}}} /**
	     * Schedules an action to be executed recursively.
	     * @param {Mixed} state State passed to the action to be executed.
	     * @param {Function} action Action to execute recursively. The last parameter passed to the action is used to trigger recursive scheduling of the action, passing in recursive invocation state.
	     * @returns {Disposable} The disposable object used to cancel the scheduled action (best effort).
	     */schedulerProto.scheduleRecursive=function(state,action){return this.schedule([state,action],invokeRecImmediate);}; /**
	     * Schedules an action to be executed recursively after a specified relative or absolute due time.
	     * @param {Mixed} state State passed to the action to be executed.
	     * @param {Function} action Action to execute recursively. The last parameter passed to the action is used to trigger recursive scheduling of the action, passing in the recursive due time and invocation state.
	     * @param {Number | Date} dueTime Relative or absolute time after which to execute the action for the first time.
	     * @returns {Disposable} The disposable object used to cancel the scheduled action (best effort).
	     */schedulerProto.scheduleRecursiveFuture=function(state,dueTime,action){return this.scheduleFuture([state,action],dueTime,invokeRecDate);};})(Scheduler.prototype);(function(schedulerProto){ /**
	     * Schedules a periodic piece of work by dynamically discovering the scheduler's capabilities. The periodic task will be scheduled using window.setInterval for the base implementation.
	     * @param {Mixed} state Initial state passed to the action upon the first iteration.
	     * @param {Number} period Period for running the work periodically.
	     * @param {Function} action Action to be executed, potentially updating the state.
	     * @returns {Disposable} The disposable object used to cancel the scheduled recurring action (best effort).
	     */schedulerProto.schedulePeriodic=function(state,period,action){if(typeof root.setInterval==='undefined'){throw new NotSupportedError();}period=normalizeTime(period);var s=state,id=root.setInterval(function(){s=action(s);},period);return disposableCreate(function(){root.clearInterval(id);});};})(Scheduler.prototype);(function(schedulerProto){ /**
	     * Returns a scheduler that wraps the original scheduler, adding exception handling for scheduled actions.
	     * @param {Function} handler Handler that's run if an exception is caught. The exception will be rethrown if the handler returns false.
	     * @returns {Scheduler} Wrapper around the original scheduler, enforcing exception handling.
	     */schedulerProto.catchError=schedulerProto['catch']=function(handler){return new CatchScheduler(this,handler);};})(Scheduler.prototype);var SchedulePeriodicRecursive=Rx.internals.SchedulePeriodicRecursive=function(){function createTick(self){return function tick(command,recurse){recurse(0,self._period);var state=tryCatch(self._action)(self._state);if(state===errorObj){self._cancel.dispose();thrower(state.e);}self._state=state;};}function SchedulePeriodicRecursive(scheduler,state,period,action){this._scheduler=scheduler;this._state=state;this._period=period;this._action=action;}SchedulePeriodicRecursive.prototype.start=function(){var d=new SingleAssignmentDisposable();this._cancel=d;d.setDisposable(this._scheduler.scheduleRecursiveFuture(0,this._period,createTick(this)));return d;};return SchedulePeriodicRecursive;}(); /** Gets a scheduler that schedules work immediately on the current thread. */var ImmediateScheduler=function(__super__){inherits(ImmediateScheduler,__super__);function ImmediateScheduler(){__super__.call(this);}ImmediateScheduler.prototype.schedule=function(state,action){return disposableFixup(action(this,state));};return ImmediateScheduler;}(Scheduler);var immediateScheduler=Scheduler.immediate=new ImmediateScheduler(); /**
	   * Gets a scheduler that schedules work as soon as possible on the current thread.
	   */var CurrentThreadScheduler=function(__super__){var queue;function runTrampoline(){while(queue.length>0){var item=queue.dequeue();!item.isCancelled()&&item.invoke();}}inherits(CurrentThreadScheduler,__super__);function CurrentThreadScheduler(){__super__.call(this);}CurrentThreadScheduler.prototype.schedule=function(state,action){var si=new ScheduledItem(this,state,action,this.now());if(!queue){queue=new PriorityQueue(4);queue.enqueue(si);var result=tryCatch(runTrampoline)();queue=null;if(result===errorObj){thrower(result.e);}}else {queue.enqueue(si);}return si.disposable;};CurrentThreadScheduler.prototype.scheduleRequired=function(){return !queue;};return CurrentThreadScheduler;}(Scheduler);var currentThreadScheduler=Scheduler.currentThread=new CurrentThreadScheduler();var scheduleMethod,clearMethod;var localTimer=function(){var localSetTimeout,localClearTimeout=noop;if(!!root.setTimeout){localSetTimeout=root.setTimeout;localClearTimeout=root.clearTimeout;}else if(!!root.WScript){localSetTimeout=function localSetTimeout(fn,time){root.WScript.Sleep(time);fn();};}else {throw new NotSupportedError();}return {setTimeout:localSetTimeout,clearTimeout:localClearTimeout};}();var localSetTimeout=localTimer.setTimeout,localClearTimeout=localTimer.clearTimeout;(function(){var nextHandle=1,tasksByHandle={},currentlyRunning=false;clearMethod=function clearMethod(handle){delete tasksByHandle[handle];};function runTask(handle){if(currentlyRunning){localSetTimeout(function(){runTask(handle);},0);}else {var task=tasksByHandle[handle];if(task){currentlyRunning=true;var result=tryCatch(task)();clearMethod(handle);currentlyRunning=false;if(result===errorObj){thrower(result.e);}}}}var reNative=new RegExp('^'+String(toString).replace(/[.*+?^${}()|[\]\\]/g,'\\$&').replace(/toString| for [^\]]+/g,'.*?')+'$');var setImmediate=typeof (setImmediate=freeGlobal&&moduleExports&&freeGlobal.setImmediate)=='function'&&!reNative.test(setImmediate)&&setImmediate;function postMessageSupported(){ // Ensure not in a worker
	if(!root.postMessage||root.importScripts){return false;}var isAsync=false,oldHandler=root.onmessage; // Test for async
	root.onmessage=function(){isAsync=true;};root.postMessage('','*');root.onmessage=oldHandler;return isAsync;} // Use in order, setImmediate, nextTick, postMessage, MessageChannel, script readystatechanged, setTimeout
	if(isFunction(setImmediate)){scheduleMethod=function scheduleMethod(action){var id=nextHandle++;tasksByHandle[id]=action;setImmediate(function(){runTask(id);});return id;};}else if(typeof process!=='undefined'&&{}.toString.call(process)==='[object process]'){scheduleMethod=function scheduleMethod(action){var id=nextHandle++;tasksByHandle[id]=action;process.nextTick(function(){runTask(id);});return id;};}else if(postMessageSupported()){var MSG_PREFIX='ms.rx.schedule'+Math.random();var onGlobalPostMessage=function onGlobalPostMessage(event){ // Only if we're a match to avoid any other global events
	if(typeof event.data==='string'&&event.data.substring(0,MSG_PREFIX.length)===MSG_PREFIX){runTask(event.data.substring(MSG_PREFIX.length));}};root.addEventListener('message',onGlobalPostMessage,false);scheduleMethod=function scheduleMethod(action){var id=nextHandle++;tasksByHandle[id]=action;root.postMessage(MSG_PREFIX+id,'*');return id;};}else if(!!root.MessageChannel){var channel=new root.MessageChannel();channel.port1.onmessage=function(e){runTask(e.data);};scheduleMethod=function scheduleMethod(action){var id=nextHandle++;tasksByHandle[id]=action;channel.port2.postMessage(id);return id;};}else if('document' in root&&'onreadystatechange' in root.document.createElement('script')){scheduleMethod=function scheduleMethod(action){var scriptElement=root.document.createElement('script');var id=nextHandle++;tasksByHandle[id]=action;scriptElement.onreadystatechange=function(){runTask(id);scriptElement.onreadystatechange=null;scriptElement.parentNode.removeChild(scriptElement);scriptElement=null;};root.document.documentElement.appendChild(scriptElement);return id;};}else {scheduleMethod=function scheduleMethod(action){var id=nextHandle++;tasksByHandle[id]=action;localSetTimeout(function(){runTask(id);},0);return id;};}})(); /**
	   * Gets a scheduler that schedules work via a timed callback based upon platform.
	   */var DefaultScheduler=function(__super__){inherits(DefaultScheduler,__super__);function DefaultScheduler(){__super__.call(this);}function scheduleAction(disposable,action,scheduler,state){return function schedule(){disposable.setDisposable(Disposable._fixup(action(scheduler,state)));};}function ClearDisposable(id){this._id=id;this.isDisposed=false;}ClearDisposable.prototype.dispose=function(){if(!this.isDisposed){this.isDisposed=true;clearMethod(this._id);}};function LocalClearDisposable(id){this._id=id;this.isDisposed=false;}LocalClearDisposable.prototype.dispose=function(){if(!this.isDisposed){this.isDisposed=true;localClearTimeout(this._id);}};DefaultScheduler.prototype.schedule=function(state,action){var disposable=new SingleAssignmentDisposable(),id=scheduleMethod(scheduleAction(disposable,action,this,state));return new BinaryDisposable(disposable,new ClearDisposable(id));};DefaultScheduler.prototype._scheduleFuture=function(state,dueTime,action){if(dueTime===0){return this.schedule(state,action);}var disposable=new SingleAssignmentDisposable(),id=localSetTimeout(scheduleAction(disposable,action,this,state),dueTime);return new BinaryDisposable(disposable,new LocalClearDisposable(id));};return DefaultScheduler;}(Scheduler);var defaultScheduler=Scheduler['default']=Scheduler.async=new DefaultScheduler();var CatchScheduler=function(__super__){inherits(CatchScheduler,__super__);function CatchScheduler(scheduler,handler){this._scheduler=scheduler;this._handler=handler;this._recursiveOriginal=null;this._recursiveWrapper=null;__super__.call(this);}CatchScheduler.prototype.schedule=function(state,action){return this._scheduler.schedule(state,this._wrap(action));};CatchScheduler.prototype._scheduleFuture=function(state,dueTime,action){return this._scheduler.schedule(state,dueTime,this._wrap(action));};CatchScheduler.prototype.now=function(){return this._scheduler.now();};CatchScheduler.prototype._clone=function(scheduler){return new CatchScheduler(scheduler,this._handler);};CatchScheduler.prototype._wrap=function(action){var parent=this;return function(self,state){var res=tryCatch(action)(parent._getRecursiveWrapper(self),state);if(res===errorObj){if(!parent._handler(res.e)){thrower(res.e);}return disposableEmpty;}return disposableFixup(res);};};CatchScheduler.prototype._getRecursiveWrapper=function(scheduler){if(this._recursiveOriginal!==scheduler){this._recursiveOriginal=scheduler;var wrapper=this._clone(scheduler);wrapper._recursiveOriginal=scheduler;wrapper._recursiveWrapper=wrapper;this._recursiveWrapper=wrapper;}return this._recursiveWrapper;};CatchScheduler.prototype.schedulePeriodic=function(state,period,action){var self=this,failed=false,d=new SingleAssignmentDisposable();d.setDisposable(this._scheduler.schedulePeriodic(state,period,function(state1){if(failed){return null;}var res=tryCatch(action)(state1);if(res===errorObj){failed=true;if(!self._handler(res.e)){thrower(res.e);}d.dispose();return null;}return res;}));return d;};return CatchScheduler;}(Scheduler); /**
	   *  Represents a notification to an observer.
	   */var Notification=Rx.Notification=function(){function Notification(){}Notification.prototype._accept=function(onNext,onError,onCompleted){throw new NotImplementedError();};Notification.prototype._acceptObserver=function(onNext,onError,onCompleted){throw new NotImplementedError();}; /**
	     * Invokes the delegate corresponding to the notification or the observer's method corresponding to the notification and returns the produced result.
	     * @param {Function | Observer} observerOrOnNext Function to invoke for an OnNext notification or Observer to invoke the notification on..
	     * @param {Function} onError Function to invoke for an OnError notification.
	     * @param {Function} onCompleted Function to invoke for an OnCompleted notification.
	     * @returns {Any} Result produced by the observation.
	     */Notification.prototype.accept=function(observerOrOnNext,onError,onCompleted){return observerOrOnNext&&(typeof observerOrOnNext==='undefined'?'undefined':_typeof(observerOrOnNext))==='object'?this._acceptObserver(observerOrOnNext):this._accept(observerOrOnNext,onError,onCompleted);}; /**
	     * Returns an observable sequence with a single notification.
	     *
	     * @memberOf Notifications
	     * @param {Scheduler} [scheduler] Scheduler to send out the notification calls on.
	     * @returns {Observable} The observable sequence that surfaces the behavior of the notification upon subscription.
	     */Notification.prototype.toObservable=function(scheduler){var self=this;isScheduler(scheduler)||(scheduler=immediateScheduler);return new AnonymousObservable(function(o){return scheduler.schedule(self,function(_,notification){notification._acceptObserver(o);notification.kind==='N'&&o.onCompleted();});});};return Notification;}();var OnNextNotification=function(__super__){inherits(OnNextNotification,__super__);function OnNextNotification(value){this.value=value;this.kind='N';}OnNextNotification.prototype._accept=function(onNext){return onNext(this.value);};OnNextNotification.prototype._acceptObserver=function(o){return o.onNext(this.value);};OnNextNotification.prototype.toString=function(){return 'OnNext('+this.value+')';};return OnNextNotification;}(Notification);var OnErrorNotification=function(__super__){inherits(OnErrorNotification,__super__);function OnErrorNotification(error){this.error=error;this.kind='E';}OnErrorNotification.prototype._accept=function(onNext,onError){return onError(this.error);};OnErrorNotification.prototype._acceptObserver=function(o){return o.onError(this.error);};OnErrorNotification.prototype.toString=function(){return 'OnError('+this.error+')';};return OnErrorNotification;}(Notification);var OnCompletedNotification=function(__super__){inherits(OnCompletedNotification,__super__);function OnCompletedNotification(){this.kind='C';}OnCompletedNotification.prototype._accept=function(onNext,onError,onCompleted){return onCompleted();};OnCompletedNotification.prototype._acceptObserver=function(o){return o.onCompleted();};OnCompletedNotification.prototype.toString=function(){return 'OnCompleted()';};return OnCompletedNotification;}(Notification); /**
	   * Creates an object that represents an OnNext notification to an observer.
	   * @param {Any} value The value contained in the notification.
	   * @returns {Notification} The OnNext notification containing the value.
	   */var notificationCreateOnNext=Notification.createOnNext=function(value){return new OnNextNotification(value);}; /**
	   * Creates an object that represents an OnError notification to an observer.
	   * @param {Any} error The exception contained in the notification.
	   * @returns {Notification} The OnError notification containing the exception.
	   */var notificationCreateOnError=Notification.createOnError=function(error){return new OnErrorNotification(error);}; /**
	   * Creates an object that represents an OnCompleted notification to an observer.
	   * @returns {Notification} The OnCompleted notification.
	   */var notificationCreateOnCompleted=Notification.createOnCompleted=function(){return new OnCompletedNotification();}; /**
	   * Supports push-style iteration over an observable sequence.
	   */var Observer=Rx.Observer=function(){}; /**
	   *  Creates a notification callback from an observer.
	   * @returns The action that forwards its input notification to the underlying observer.
	   */Observer.prototype.toNotifier=function(){var observer=this;return function(n){return n.accept(observer);};}; /**
	   *  Hides the identity of an observer.
	   * @returns An observer that hides the identity of the specified observer.
	   */Observer.prototype.asObserver=function(){var self=this;return new AnonymousObserver(function(x){self.onNext(x);},function(err){self.onError(err);},function(){self.onCompleted();});}; /**
	   *  Checks access to the observer for grammar violations. This includes checking for multiple OnError or OnCompleted calls, as well as reentrancy in any of the observer methods.
	   *  If a violation is detected, an Error is thrown from the offending observer method call.
	   * @returns An observer that checks callbacks invocations against the observer grammar and, if the checks pass, forwards those to the specified observer.
	   */Observer.prototype.checked=function(){return new CheckedObserver(this);}; /**
	   *  Creates an observer from the specified OnNext, along with optional OnError, and OnCompleted actions.
	   * @param {Function} [onNext] Observer's OnNext action implementation.
	   * @param {Function} [onError] Observer's OnError action implementation.
	   * @param {Function} [onCompleted] Observer's OnCompleted action implementation.
	   * @returns {Observer} The observer object implemented using the given actions.
	   */var observerCreate=Observer.create=function(onNext,onError,onCompleted){onNext||(onNext=noop);onError||(onError=defaultError);onCompleted||(onCompleted=noop);return new AnonymousObserver(onNext,onError,onCompleted);}; /**
	   *  Creates an observer from a notification callback.
	   * @param {Function} handler Action that handles a notification.
	   * @returns The observer object that invokes the specified handler using a notification corresponding to each message it receives.
	   */Observer.fromNotifier=function(handler,thisArg){var cb=bindCallback(handler,thisArg,1);return new AnonymousObserver(function(x){return cb(notificationCreateOnNext(x));},function(e){return cb(notificationCreateOnError(e));},function(){return cb(notificationCreateOnCompleted());});}; /**
	   * Schedules the invocation of observer methods on the given scheduler.
	   * @param {Scheduler} scheduler Scheduler to schedule observer messages on.
	   * @returns {Observer} Observer whose messages are scheduled on the given scheduler.
	   */Observer.prototype.notifyOn=function(scheduler){return new ObserveOnObserver(scheduler,this);};Observer.prototype.makeSafe=function(disposable){return new AnonymousSafeObserver(this._onNext,this._onError,this._onCompleted,disposable);}; /**
	   * Abstract base class for implementations of the Observer class.
	   * This base class enforces the grammar of observers where OnError and OnCompleted are terminal messages.
	   */var AbstractObserver=Rx.internals.AbstractObserver=function(__super__){inherits(AbstractObserver,__super__); /**
	     * Creates a new observer in a non-stopped state.
	     */function AbstractObserver(){this.isStopped=false;} // Must be implemented by other observers
	AbstractObserver.prototype.next=notImplemented;AbstractObserver.prototype.error=notImplemented;AbstractObserver.prototype.completed=notImplemented; /**
	     * Notifies the observer of a new element in the sequence.
	     * @param {Any} value Next element in the sequence.
	     */AbstractObserver.prototype.onNext=function(value){!this.isStopped&&this.next(value);}; /**
	     * Notifies the observer that an exception has occurred.
	     * @param {Any} error The error that has occurred.
	     */AbstractObserver.prototype.onError=function(error){if(!this.isStopped){this.isStopped=true;this.error(error);}}; /**
	     * Notifies the observer of the end of the sequence.
	     */AbstractObserver.prototype.onCompleted=function(){if(!this.isStopped){this.isStopped=true;this.completed();}}; /**
	     * Disposes the observer, causing it to transition to the stopped state.
	     */AbstractObserver.prototype.dispose=function(){this.isStopped=true;};AbstractObserver.prototype.fail=function(e){if(!this.isStopped){this.isStopped=true;this.error(e);return true;}return false;};return AbstractObserver;}(Observer); /**
	   * Class to create an Observer instance from delegate-based implementations of the on* methods.
	   */var AnonymousObserver=Rx.AnonymousObserver=function(__super__){inherits(AnonymousObserver,__super__); /**
	     * Creates an observer from the specified OnNext, OnError, and OnCompleted actions.
	     * @param {Any} onNext Observer's OnNext action implementation.
	     * @param {Any} onError Observer's OnError action implementation.
	     * @param {Any} onCompleted Observer's OnCompleted action implementation.
	     */function AnonymousObserver(onNext,onError,onCompleted){__super__.call(this);this._onNext=onNext;this._onError=onError;this._onCompleted=onCompleted;} /**
	     * Calls the onNext action.
	     * @param {Any} value Next element in the sequence.
	     */AnonymousObserver.prototype.next=function(value){this._onNext(value);}; /**
	     * Calls the onError action.
	     * @param {Any} error The error that has occurred.
	     */AnonymousObserver.prototype.error=function(error){this._onError(error);}; /**
	     *  Calls the onCompleted action.
	     */AnonymousObserver.prototype.completed=function(){this._onCompleted();};return AnonymousObserver;}(AbstractObserver);var CheckedObserver=function(__super__){inherits(CheckedObserver,__super__);function CheckedObserver(observer){__super__.call(this);this._observer=observer;this._state=0; // 0 - idle, 1 - busy, 2 - done
	}var CheckedObserverPrototype=CheckedObserver.prototype;CheckedObserverPrototype.onNext=function(value){this.checkAccess();var res=tryCatch(this._observer.onNext).call(this._observer,value);this._state=0;res===errorObj&&thrower(res.e);};CheckedObserverPrototype.onError=function(err){this.checkAccess();var res=tryCatch(this._observer.onError).call(this._observer,err);this._state=2;res===errorObj&&thrower(res.e);};CheckedObserverPrototype.onCompleted=function(){this.checkAccess();var res=tryCatch(this._observer.onCompleted).call(this._observer);this._state=2;res===errorObj&&thrower(res.e);};CheckedObserverPrototype.checkAccess=function(){if(this._state===1){throw new Error('Re-entrancy detected');}if(this._state===2){throw new Error('Observer completed');}if(this._state===0){this._state=1;}};return CheckedObserver;}(Observer);var ScheduledObserver=Rx.internals.ScheduledObserver=function(__super__){inherits(ScheduledObserver,__super__);function ScheduledObserver(scheduler,observer){__super__.call(this);this.scheduler=scheduler;this.observer=observer;this.isAcquired=false;this.hasFaulted=false;this.queue=[];this.disposable=new SerialDisposable();}function enqueueNext(observer,x){return function(){observer.onNext(x);};}function enqueueError(observer,e){return function(){observer.onError(e);};}function enqueueCompleted(observer){return function(){observer.onCompleted();};}ScheduledObserver.prototype.next=function(x){this.queue.push(enqueueNext(this.observer,x));};ScheduledObserver.prototype.error=function(e){this.queue.push(enqueueError(this.observer,e));};ScheduledObserver.prototype.completed=function(){this.queue.push(enqueueCompleted(this.observer));};function scheduleMethod(state,recurse){var work;if(state.queue.length>0){work=state.queue.shift();}else {state.isAcquired=false;return;}var res=tryCatch(work)();if(res===errorObj){state.queue=[];state.hasFaulted=true;return thrower(res.e);}recurse(state);}ScheduledObserver.prototype.ensureActive=function(){var isOwner=false;if(!this.hasFaulted&&this.queue.length>0){isOwner=!this.isAcquired;this.isAcquired=true;}isOwner&&this.disposable.setDisposable(this.scheduler.scheduleRecursive(this,scheduleMethod));};ScheduledObserver.prototype.dispose=function(){__super__.prototype.dispose.call(this);this.disposable.dispose();};return ScheduledObserver;}(AbstractObserver);var ObserveOnObserver=function(__super__){inherits(ObserveOnObserver,__super__);function ObserveOnObserver(scheduler,observer,cancel){__super__.call(this,scheduler,observer);this._cancel=cancel;}ObserveOnObserver.prototype.next=function(value){__super__.prototype.next.call(this,value);this.ensureActive();};ObserveOnObserver.prototype.error=function(e){__super__.prototype.error.call(this,e);this.ensureActive();};ObserveOnObserver.prototype.completed=function(){__super__.prototype.completed.call(this);this.ensureActive();};ObserveOnObserver.prototype.dispose=function(){__super__.prototype.dispose.call(this);this._cancel&&this._cancel.dispose();this._cancel=null;};return ObserveOnObserver;}(ScheduledObserver);var observableProto; /**
	   * Represents a push-style collection.
	   */var Observable=Rx.Observable=function(){function makeSubscribe(self,subscribe){return function(o){var oldOnError=o.onError;o.onError=function(e){makeStackTraceLong(e,self);oldOnError.call(o,e);};return subscribe.call(self,o);};}function Observable(){if(Rx.config.longStackSupport&&hasStacks){var oldSubscribe=this._subscribe;var e=tryCatch(thrower)(new Error()).e;this.stack=e.stack.substring(e.stack.indexOf('\n')+1);this._subscribe=makeSubscribe(this,oldSubscribe);}}observableProto=Observable.prototype; /**
	    * Determines whether the given object is an Observable
	    * @param {Any} An object to determine whether it is an Observable
	    * @returns {Boolean} true if an Observable, else false.
	    */Observable.isObservable=function(o){return o&&isFunction(o.subscribe);}; /**
	     *  Subscribes an o to the observable sequence.
	     *  @param {Mixed} [oOrOnNext] The object that is to receive notifications or an action to invoke for each element in the observable sequence.
	     *  @param {Function} [onError] Action to invoke upon exceptional termination of the observable sequence.
	     *  @param {Function} [onCompleted] Action to invoke upon graceful termination of the observable sequence.
	     *  @returns {Diposable} A disposable handling the subscriptions and unsubscriptions.
	     */observableProto.subscribe=observableProto.forEach=function(oOrOnNext,onError,onCompleted){return this._subscribe((typeof oOrOnNext==='undefined'?'undefined':_typeof(oOrOnNext))==='object'?oOrOnNext:observerCreate(oOrOnNext,onError,onCompleted));}; /**
	     * Subscribes to the next value in the sequence with an optional "this" argument.
	     * @param {Function} onNext The function to invoke on each element in the observable sequence.
	     * @param {Any} [thisArg] Object to use as this when executing callback.
	     * @returns {Disposable} A disposable handling the subscriptions and unsubscriptions.
	     */observableProto.subscribeOnNext=function(onNext,thisArg){return this._subscribe(observerCreate(typeof thisArg!=='undefined'?function(x){onNext.call(thisArg,x);}:onNext));}; /**
	     * Subscribes to an exceptional condition in the sequence with an optional "this" argument.
	     * @param {Function} onError The function to invoke upon exceptional termination of the observable sequence.
	     * @param {Any} [thisArg] Object to use as this when executing callback.
	     * @returns {Disposable} A disposable handling the subscriptions and unsubscriptions.
	     */observableProto.subscribeOnError=function(onError,thisArg){return this._subscribe(observerCreate(null,typeof thisArg!=='undefined'?function(e){onError.call(thisArg,e);}:onError));}; /**
	     * Subscribes to the next value in the sequence with an optional "this" argument.
	     * @param {Function} onCompleted The function to invoke upon graceful termination of the observable sequence.
	     * @param {Any} [thisArg] Object to use as this when executing callback.
	     * @returns {Disposable} A disposable handling the subscriptions and unsubscriptions.
	     */observableProto.subscribeOnCompleted=function(onCompleted,thisArg){return this._subscribe(observerCreate(null,null,typeof thisArg!=='undefined'?function(){onCompleted.call(thisArg);}:onCompleted));};return Observable;}();var ObservableBase=Rx.ObservableBase=function(__super__){inherits(ObservableBase,__super__);function fixSubscriber(subscriber){return subscriber&&isFunction(subscriber.dispose)?subscriber:isFunction(subscriber)?disposableCreate(subscriber):disposableEmpty;}function setDisposable(s,state){var ado=state[0],self=state[1];var sub=tryCatch(self.subscribeCore).call(self,ado);if(sub===errorObj&&!ado.fail(errorObj.e)){thrower(errorObj.e);}ado.setDisposable(fixSubscriber(sub));}function ObservableBase(){__super__.call(this);}ObservableBase.prototype._subscribe=function(o){var ado=new AutoDetachObserver(o),state=[ado,this];if(currentThreadScheduler.scheduleRequired()){currentThreadScheduler.schedule(state,setDisposable);}else {setDisposable(null,state);}return ado;};ObservableBase.prototype.subscribeCore=notImplemented;return ObservableBase;}(Observable);var FlatMapObservable=Rx.FlatMapObservable=function(__super__){inherits(FlatMapObservable,__super__);function FlatMapObservable(source,selector,resultSelector,thisArg){this.resultSelector=isFunction(resultSelector)?resultSelector:null;this.selector=bindCallback(isFunction(selector)?selector:function(){return selector;},thisArg,3);this.source=source;__super__.call(this);}FlatMapObservable.prototype.subscribeCore=function(o){return this.source.subscribe(new InnerObserver(o,this.selector,this.resultSelector,this));};inherits(InnerObserver,AbstractObserver);function InnerObserver(observer,selector,resultSelector,source){this.i=0;this.selector=selector;this.resultSelector=resultSelector;this.source=source;this.o=observer;AbstractObserver.call(this);}InnerObserver.prototype._wrapResult=function(result,x,i){return this.resultSelector?result.map(function(y,i2){return this.resultSelector(x,y,i,i2);},this):result;};InnerObserver.prototype.next=function(x){var i=this.i++;var result=tryCatch(this.selector)(x,i,this.source);if(result===errorObj){return this.o.onError(result.e);}isPromise(result)&&(result=observableFromPromise(result));(isArrayLike(result)||isIterable(result))&&(result=Observable.from(result));this.o.onNext(this._wrapResult(result,x,i));};InnerObserver.prototype.error=function(e){this.o.onError(e);};InnerObserver.prototype.completed=function(){this.o.onCompleted();};return FlatMapObservable;}(ObservableBase);var Enumerable=Rx.internals.Enumerable=function(){};function IsDisposedDisposable(state){this._s=state;this.isDisposed=false;}IsDisposedDisposable.prototype.dispose=function(){if(!this.isDisposed){this.isDisposed=true;this._s.isDisposed=true;}};var ConcatEnumerableObservable=function(__super__){inherits(ConcatEnumerableObservable,__super__);function ConcatEnumerableObservable(sources){this.sources=sources;__super__.call(this);}function scheduleMethod(state,recurse){if(state.isDisposed){return;}var currentItem=tryCatch(state.e.next).call(state.e);if(currentItem===errorObj){return state.o.onError(currentItem.e);}if(currentItem.done){return state.o.onCompleted();} // Check if promise
	var currentValue=currentItem.value;isPromise(currentValue)&&(currentValue=observableFromPromise(currentValue));var d=new SingleAssignmentDisposable();state.subscription.setDisposable(d);d.setDisposable(currentValue.subscribe(new InnerObserver(state,recurse)));}ConcatEnumerableObservable.prototype.subscribeCore=function(o){var subscription=new SerialDisposable();var state={isDisposed:false,o:o,subscription:subscription,e:this.sources[$iterator$]()};var cancelable=currentThreadScheduler.scheduleRecursive(state,scheduleMethod);return new NAryDisposable([subscription,cancelable,new IsDisposedDisposable(state)]);};function InnerObserver(state,recurse){this._state=state;this._recurse=recurse;AbstractObserver.call(this);}inherits(InnerObserver,AbstractObserver);InnerObserver.prototype.next=function(x){this._state.o.onNext(x);};InnerObserver.prototype.error=function(e){this._state.o.onError(e);};InnerObserver.prototype.completed=function(){this._recurse(this._state);};return ConcatEnumerableObservable;}(ObservableBase);Enumerable.prototype.concat=function(){return new ConcatEnumerableObservable(this);};var CatchErrorObservable=function(__super__){function CatchErrorObservable(sources){this.sources=sources;__super__.call(this);}inherits(CatchErrorObservable,__super__);function scheduleMethod(state,recurse){if(state.isDisposed){return;}var currentItem=tryCatch(state.e.next).call(state.e);if(currentItem===errorObj){return state.o.onError(currentItem.e);}if(currentItem.done){return state.lastError!==null?state.o.onError(state.lastError):state.o.onCompleted();}var currentValue=currentItem.value;isPromise(currentValue)&&(currentValue=observableFromPromise(currentValue));var d=new SingleAssignmentDisposable();state.subscription.setDisposable(d);d.setDisposable(currentValue.subscribe(new InnerObserver(state,recurse)));}CatchErrorObservable.prototype.subscribeCore=function(o){var subscription=new SerialDisposable();var state={isDisposed:false,e:this.sources[$iterator$](),subscription:subscription,lastError:null,o:o};var cancelable=currentThreadScheduler.scheduleRecursive(state,scheduleMethod);return new NAryDisposable([subscription,cancelable,new IsDisposedDisposable(state)]);};function InnerObserver(state,recurse){this._state=state;this._recurse=recurse;AbstractObserver.call(this);}inherits(InnerObserver,AbstractObserver);InnerObserver.prototype.next=function(x){this._state.o.onNext(x);};InnerObserver.prototype.error=function(e){this._state.lastError=e;this._recurse(this._state);};InnerObserver.prototype.completed=function(){this._state.o.onCompleted();};return CatchErrorObservable;}(ObservableBase);Enumerable.prototype.catchError=function(){return new CatchErrorObservable(this);};var RepeatEnumerable=function(__super__){inherits(RepeatEnumerable,__super__);function RepeatEnumerable(v,c){this.v=v;this.c=c==null?-1:c;}RepeatEnumerable.prototype[$iterator$]=function(){return new RepeatEnumerator(this);};function RepeatEnumerator(p){this.v=p.v;this.l=p.c;}RepeatEnumerator.prototype.next=function(){if(this.l===0){return doneEnumerator;}if(this.l>0){this.l--;}return {done:false,value:this.v};};return RepeatEnumerable;}(Enumerable);var enumerableRepeat=Enumerable.repeat=function(value,repeatCount){return new RepeatEnumerable(value,repeatCount);};var OfEnumerable=function(__super__){inherits(OfEnumerable,__super__);function OfEnumerable(s,fn,thisArg){this.s=s;this.fn=fn?bindCallback(fn,thisArg,3):null;}OfEnumerable.prototype[$iterator$]=function(){return new OfEnumerator(this);};function OfEnumerator(p){this.i=-1;this.s=p.s;this.l=this.s.length;this.fn=p.fn;}OfEnumerator.prototype.next=function(){return ++this.i<this.l?{done:false,value:!this.fn?this.s[this.i]:this.fn(this.s[this.i],this.i,this.s)}:doneEnumerator;};return OfEnumerable;}(Enumerable);var enumerableOf=Enumerable.of=function(source,selector,thisArg){return new OfEnumerable(source,selector,thisArg);};var ObserveOnObservable=function(__super__){inherits(ObserveOnObservable,__super__);function ObserveOnObservable(source,s){this.source=source;this._s=s;__super__.call(this);}ObserveOnObservable.prototype.subscribeCore=function(o){return this.source.subscribe(new ObserveOnObserver(this._s,o));};return ObserveOnObservable;}(ObservableBase); /**
	   *  Wraps the source sequence in order to run its observer callbacks on the specified scheduler.
	   *
	   *  This only invokes observer callbacks on a scheduler. In case the subscription and/or unsubscription actions have side-effects
	   *  that require to be run on a scheduler, use subscribeOn.
	   *
	   *  @param {Scheduler} scheduler Scheduler to notify observers on.
	   *  @returns {Observable} The source sequence whose observations happen on the specified scheduler.
	   */observableProto.observeOn=function(scheduler){return new ObserveOnObservable(this,scheduler);};var SubscribeOnObservable=function(__super__){inherits(SubscribeOnObservable,__super__);function SubscribeOnObservable(source,s){this.source=source;this._s=s;__super__.call(this);}function scheduleMethod(scheduler,state){var source=state[0],d=state[1],o=state[2];d.setDisposable(new ScheduledDisposable(scheduler,source.subscribe(o)));}SubscribeOnObservable.prototype.subscribeCore=function(o){var m=new SingleAssignmentDisposable(),d=new SerialDisposable();d.setDisposable(m);m.setDisposable(this._s.schedule([this.source,d,o],scheduleMethod));return d;};return SubscribeOnObservable;}(ObservableBase); /**
	   *  Wraps the source sequence in order to run its subscription and unsubscription logic on the specified scheduler. This operation is not commonly used;
	   *  see the remarks section for more information on the distinction between subscribeOn and observeOn.

	   *  This only performs the side-effects of subscription and unsubscription on the specified scheduler. In order to invoke observer
	   *  callbacks on a scheduler, use observeOn.

	   *  @param {Scheduler} scheduler Scheduler to perform subscription and unsubscription actions on.
	   *  @returns {Observable} The source sequence whose subscriptions and unsubscriptions happen on the specified scheduler.
	   */observableProto.subscribeOn=function(scheduler){return new SubscribeOnObservable(this,scheduler);};var FromPromiseObservable=function(__super__){inherits(FromPromiseObservable,__super__);function FromPromiseObservable(p,s){this._p=p;this._s=s;__super__.call(this);}function scheduleNext(s,state){var o=state[0],data=state[1];o.onNext(data);o.onCompleted();}function scheduleError(s,state){var o=state[0],err=state[1];o.onError(err);}FromPromiseObservable.prototype.subscribeCore=function(o){var sad=new SingleAssignmentDisposable(),self=this;this._p.then(function(data){sad.setDisposable(self._s.schedule([o,data],scheduleNext));},function(err){sad.setDisposable(self._s.schedule([o,err],scheduleError));});return sad;};return FromPromiseObservable;}(ObservableBase); /**
	  * Converts a Promise to an Observable sequence
	  * @param {Promise} An ES6 Compliant promise.
	  * @returns {Observable} An Observable sequence which wraps the existing promise success and failure.
	  */var observableFromPromise=Observable.fromPromise=function(promise,scheduler){scheduler||(scheduler=defaultScheduler);return new FromPromiseObservable(promise,scheduler);}; /*
	   * Converts an existing observable sequence to an ES6 Compatible Promise
	   * @example
	   * var promise = Rx.Observable.return(42).toPromise(RSVP.Promise);
	   *
	   * // With config
	   * Rx.config.Promise = RSVP.Promise;
	   * var promise = Rx.Observable.return(42).toPromise();
	   * @param {Function} [promiseCtor] The constructor of the promise. If not provided, it looks for it in Rx.config.Promise.
	   * @returns {Promise} An ES6 compatible promise with the last value from the observable sequence.
	   */observableProto.toPromise=function(promiseCtor){promiseCtor||(promiseCtor=Rx.config.Promise);if(!promiseCtor){throw new NotSupportedError('Promise type not provided nor in Rx.config.Promise');}var source=this;return new promiseCtor(function(resolve,reject){ // No cancellation can be done
	var value;source.subscribe(function(v){value=v;},reject,function(){resolve(value);});});};var ToArrayObservable=function(__super__){inherits(ToArrayObservable,__super__);function ToArrayObservable(source){this.source=source;__super__.call(this);}ToArrayObservable.prototype.subscribeCore=function(o){return this.source.subscribe(new InnerObserver(o));};inherits(InnerObserver,AbstractObserver);function InnerObserver(o){this.o=o;this.a=[];AbstractObserver.call(this);}InnerObserver.prototype.next=function(x){this.a.push(x);};InnerObserver.prototype.error=function(e){this.o.onError(e);};InnerObserver.prototype.completed=function(){this.o.onNext(this.a);this.o.onCompleted();};return ToArrayObservable;}(ObservableBase); /**
	  * Creates an array from an observable sequence.
	  * @returns {Observable} An observable sequence containing a single element with a list containing all the elements of the source sequence.
	  */observableProto.toArray=function(){return new ToArrayObservable(this);}; /**
	   *  Creates an observable sequence from a specified subscribe method implementation.
	   * @example
	   *  var res = Rx.Observable.create(function (observer) { return function () { } );
	   *  var res = Rx.Observable.create(function (observer) { return Rx.Disposable.empty; } );
	   *  var res = Rx.Observable.create(function (observer) { } );
	   * @param {Function} subscribe Implementation of the resulting observable sequence's subscribe method, returning a function that will be wrapped in a Disposable.
	   * @returns {Observable} The observable sequence with the specified implementation for the Subscribe method.
	   */Observable.create=function(subscribe,parent){return new AnonymousObservable(subscribe,parent);};var Defer=function(__super__){inherits(Defer,__super__);function Defer(factory){this._f=factory;__super__.call(this);}Defer.prototype.subscribeCore=function(o){var result=tryCatch(this._f)();if(result===errorObj){return observableThrow(result.e).subscribe(o);}isPromise(result)&&(result=observableFromPromise(result));return result.subscribe(o);};return Defer;}(ObservableBase); /**
	   *  Returns an observable sequence that invokes the specified factory function whenever a new observer subscribes.
	   *
	   * @example
	   *  var res = Rx.Observable.defer(function () { return Rx.Observable.fromArray([1,2,3]); });
	   * @param {Function} observableFactory Observable factory function to invoke for each observer that subscribes to the resulting sequence or Promise.
	   * @returns {Observable} An observable sequence whose observers trigger an invocation of the given observable factory function.
	   */var observableDefer=Observable.defer=function(observableFactory){return new Defer(observableFactory);};var EmptyObservable=function(__super__){inherits(EmptyObservable,__super__);function EmptyObservable(scheduler){this.scheduler=scheduler;__super__.call(this);}EmptyObservable.prototype.subscribeCore=function(observer){var sink=new EmptySink(observer,this.scheduler);return sink.run();};function EmptySink(observer,scheduler){this.observer=observer;this.scheduler=scheduler;}function scheduleItem(s,state){state.onCompleted();return disposableEmpty;}EmptySink.prototype.run=function(){var state=this.observer;return this.scheduler===immediateScheduler?scheduleItem(null,state):this.scheduler.schedule(state,scheduleItem);};return EmptyObservable;}(ObservableBase);var EMPTY_OBSERVABLE=new EmptyObservable(immediateScheduler); /**
	   *  Returns an empty observable sequence, using the specified scheduler to send out the single OnCompleted message.
	   *
	   * @example
	   *  var res = Rx.Observable.empty();
	   *  var res = Rx.Observable.empty(Rx.Scheduler.timeout);
	   * @param {Scheduler} [scheduler] Scheduler to send the termination call on.
	   * @returns {Observable} An observable sequence with no elements.
	   */var observableEmpty=Observable.empty=function(scheduler){isScheduler(scheduler)||(scheduler=immediateScheduler);return scheduler===immediateScheduler?EMPTY_OBSERVABLE:new EmptyObservable(scheduler);};var FromObservable=function(__super__){inherits(FromObservable,__super__);function FromObservable(iterable,fn,scheduler){this._iterable=iterable;this._fn=fn;this._scheduler=scheduler;__super__.call(this);}function createScheduleMethod(o,it,fn){return function loopRecursive(i,recurse){var next=tryCatch(it.next).call(it);if(next===errorObj){return o.onError(next.e);}if(next.done){return o.onCompleted();}var result=next.value;if(isFunction(fn)){result=tryCatch(fn)(result,i);if(result===errorObj){return o.onError(result.e);}}o.onNext(result);recurse(i+1);};}FromObservable.prototype.subscribeCore=function(o){var list=Object(this._iterable),it=getIterable(list);return this._scheduler.scheduleRecursive(0,createScheduleMethod(o,it,this._fn));};return FromObservable;}(ObservableBase);var maxSafeInteger=Math.pow(2,53)-1;function StringIterable(s){this._s=s;}StringIterable.prototype[$iterator$]=function(){return new StringIterator(this._s);};function StringIterator(s){this._s=s;this._l=s.length;this._i=0;}StringIterator.prototype[$iterator$]=function(){return this;};StringIterator.prototype.next=function(){return this._i<this._l?{done:false,value:this._s.charAt(this._i++)}:doneEnumerator;};function ArrayIterable(a){this._a=a;}ArrayIterable.prototype[$iterator$]=function(){return new ArrayIterator(this._a);};function ArrayIterator(a){this._a=a;this._l=toLength(a);this._i=0;}ArrayIterator.prototype[$iterator$]=function(){return this;};ArrayIterator.prototype.next=function(){return this._i<this._l?{done:false,value:this._a[this._i++]}:doneEnumerator;};function numberIsFinite(value){return typeof value==='number'&&root.isFinite(value);}function isNan(n){return n!==n;}function getIterable(o){var i=o[$iterator$],it;if(!i&&typeof o==='string'){it=new StringIterable(o);return it[$iterator$]();}if(!i&&o.length!==undefined){it=new ArrayIterable(o);return it[$iterator$]();}if(!i){throw new TypeError('Object is not iterable');}return o[$iterator$]();}function sign(value){var number=+value;if(number===0){return number;}if(isNaN(number)){return number;}return number<0?-1:1;}function toLength(o){var len=+o.length;if(isNaN(len)){return 0;}if(len===0||!numberIsFinite(len)){return len;}len=sign(len)*Math.floor(Math.abs(len));if(len<=0){return 0;}if(len>maxSafeInteger){return maxSafeInteger;}return len;} /**
	  * This method creates a new Observable sequence from an array-like or iterable object.
	  * @param {Any} arrayLike An array-like or iterable object to convert to an Observable sequence.
	  * @param {Function} [mapFn] Map function to call on every element of the array.
	  * @param {Any} [thisArg] The context to use calling the mapFn if provided.
	  * @param {Scheduler} [scheduler] Optional scheduler to use for scheduling.  If not provided, defaults to Scheduler.currentThread.
	  */var observableFrom=Observable.from=function(iterable,mapFn,thisArg,scheduler){if(iterable==null){throw new Error('iterable cannot be null.');}if(mapFn&&!isFunction(mapFn)){throw new Error('mapFn when provided must be a function');}if(mapFn){var mapper=bindCallback(mapFn,thisArg,2);}isScheduler(scheduler)||(scheduler=currentThreadScheduler);return new FromObservable(iterable,mapper,scheduler);};var FromArrayObservable=function(__super__){inherits(FromArrayObservable,__super__);function FromArrayObservable(args,scheduler){this._args=args;this._scheduler=scheduler;__super__.call(this);}function scheduleMethod(o,args){var len=args.length;return function loopRecursive(i,recurse){if(i<len){o.onNext(args[i]);recurse(i+1);}else {o.onCompleted();}};}FromArrayObservable.prototype.subscribeCore=function(o){return this._scheduler.scheduleRecursive(0,scheduleMethod(o,this._args));};return FromArrayObservable;}(ObservableBase); /**
	  *  Converts an array to an observable sequence, using an optional scheduler to enumerate the array.
	  * @deprecated use Observable.from or Observable.of
	  * @param {Scheduler} [scheduler] Scheduler to run the enumeration of the input sequence on.
	  * @returns {Observable} The observable sequence whose elements are pulled from the given enumerable sequence.
	  */var observableFromArray=Observable.fromArray=function(array,scheduler){isScheduler(scheduler)||(scheduler=currentThreadScheduler);return new FromArrayObservable(array,scheduler);};var GenerateObservable=function(__super__){inherits(GenerateObservable,__super__);function GenerateObservable(state,cndFn,itrFn,resFn,s){this._initialState=state;this._cndFn=cndFn;this._itrFn=itrFn;this._resFn=resFn;this._s=s;__super__.call(this);}function scheduleRecursive(state,recurse){if(state.first){state.first=false;}else {state.newState=tryCatch(state.self._itrFn)(state.newState);if(state.newState===errorObj){return state.o.onError(state.newState.e);}}var hasResult=tryCatch(state.self._cndFn)(state.newState);if(hasResult===errorObj){return state.o.onError(hasResult.e);}if(hasResult){var result=tryCatch(state.self._resFn)(state.newState);if(result===errorObj){return state.o.onError(result.e);}state.o.onNext(result);recurse(state);}else {state.o.onCompleted();}}GenerateObservable.prototype.subscribeCore=function(o){var state={o:o,self:this,first:true,newState:this._initialState};return this._s.scheduleRecursive(state,scheduleRecursive);};return GenerateObservable;}(ObservableBase); /**
	   *  Generates an observable sequence by running a state-driven loop producing the sequence's elements, using the specified scheduler to send out observer messages.
	   *
	   * @example
	   *  var res = Rx.Observable.generate(0, function (x) { return x < 10; }, function (x) { return x + 1; }, function (x) { return x; });
	   *  var res = Rx.Observable.generate(0, function (x) { return x < 10; }, function (x) { return x + 1; }, function (x) { return x; }, Rx.Scheduler.timeout);
	   * @param {Mixed} initialState Initial state.
	   * @param {Function} condition Condition to terminate generation (upon returning false).
	   * @param {Function} iterate Iteration step function.
	   * @param {Function} resultSelector Selector function for results produced in the sequence.
	   * @param {Scheduler} [scheduler] Scheduler on which to run the generator loop. If not provided, defaults to Scheduler.currentThread.
	   * @returns {Observable} The generated sequence.
	   */Observable.generate=function(initialState,condition,iterate,resultSelector,scheduler){isScheduler(scheduler)||(scheduler=currentThreadScheduler);return new GenerateObservable(initialState,condition,iterate,resultSelector,scheduler);};function observableOf(scheduler,array){isScheduler(scheduler)||(scheduler=currentThreadScheduler);return new FromArrayObservable(array,scheduler);} /**
	  *  This method creates a new Observable instance with a variable number of arguments, regardless of number or type of the arguments.
	  * @returns {Observable} The observable sequence whose elements are pulled from the given arguments.
	  */Observable.of=function(){var len=arguments.length,args=new Array(len);for(var i=0;i<len;i++){args[i]=arguments[i];}return new FromArrayObservable(args,currentThreadScheduler);}; /**
	  *  This method creates a new Observable instance with a variable number of arguments, regardless of number or type of the arguments.
	  * @param {Scheduler} scheduler A scheduler to use for scheduling the arguments.
	  * @returns {Observable} The observable sequence whose elements are pulled from the given arguments.
	  */Observable.ofWithScheduler=function(scheduler){var len=arguments.length,args=new Array(len-1);for(var i=1;i<len;i++){args[i-1]=arguments[i];}return new FromArrayObservable(args,scheduler);}; /**
	   * Creates an Observable sequence from changes to an array using Array.observe.
	   * @param {Array} array An array to observe changes.
	   * @returns {Observable} An observable sequence containing changes to an array from Array.observe.
	   */Observable.ofArrayChanges=function(array){if(!Array.isArray(array)){throw new TypeError('Array.observe only accepts arrays.');}if(typeof Array.observe!=='function'&&typeof Array.unobserve!=='function'){throw new TypeError('Array.observe is not supported on your platform');}return new AnonymousObservable(function(observer){function observerFn(changes){for(var i=0,len=changes.length;i<len;i++){observer.onNext(changes[i]);}}Array.observe(array,observerFn);return function(){Array.unobserve(array,observerFn);};});}; /**
	   * Creates an Observable sequence from changes to an object using Object.observe.
	   * @param {Object} obj An object to observe changes.
	   * @returns {Observable} An observable sequence containing changes to an object from Object.observe.
	   */Observable.ofObjectChanges=function(obj){if(obj==null){throw new TypeError('object must not be null or undefined.');}if(typeof Object.observe!=='function'&&typeof Object.unobserve!=='function'){throw new TypeError('Object.observe is not supported on your platform');}return new AnonymousObservable(function(observer){function observerFn(changes){for(var i=0,len=changes.length;i<len;i++){observer.onNext(changes[i]);}}Object.observe(obj,observerFn);return function(){Object.unobserve(obj,observerFn);};});};var NeverObservable=function(__super__){inherits(NeverObservable,__super__);function NeverObservable(){__super__.call(this);}NeverObservable.prototype.subscribeCore=function(observer){return disposableEmpty;};return NeverObservable;}(ObservableBase);var NEVER_OBSERVABLE=new NeverObservable(); /**
	   * Returns a non-terminating observable sequence, which can be used to denote an infinite duration (e.g. when using reactive joins).
	   * @returns {Observable} An observable sequence whose observers will never get called.
	   */var observableNever=Observable.never=function(){return NEVER_OBSERVABLE;};var PairsObservable=function(__super__){inherits(PairsObservable,__super__);function PairsObservable(o,scheduler){this._o=o;this._keys=Object.keys(o);this._scheduler=scheduler;__super__.call(this);}function scheduleMethod(o,obj,keys){return function loopRecursive(i,recurse){if(i<keys.length){var key=keys[i];o.onNext([key,obj[key]]);recurse(i+1);}else {o.onCompleted();}};}PairsObservable.prototype.subscribeCore=function(o){return this._scheduler.scheduleRecursive(0,scheduleMethod(o,this._o,this._keys));};return PairsObservable;}(ObservableBase); /**
	   * Convert an object into an observable sequence of [key, value] pairs.
	   * @param {Object} obj The object to inspect.
	   * @param {Scheduler} [scheduler] Scheduler to run the enumeration of the input sequence on.
	   * @returns {Observable} An observable sequence of [key, value] pairs from the object.
	   */Observable.pairs=function(obj,scheduler){scheduler||(scheduler=currentThreadScheduler);return new PairsObservable(obj,scheduler);};var RangeObservable=function(__super__){inherits(RangeObservable,__super__);function RangeObservable(start,count,scheduler){this.start=start;this.rangeCount=count;this.scheduler=scheduler;__super__.call(this);}function loopRecursive(start,count,o){return function loop(i,recurse){if(i<count){o.onNext(start+i);recurse(i+1);}else {o.onCompleted();}};}RangeObservable.prototype.subscribeCore=function(o){return this.scheduler.scheduleRecursive(0,loopRecursive(this.start,this.rangeCount,o));};return RangeObservable;}(ObservableBase); /**
	  *  Generates an observable sequence of integral numbers within a specified range, using the specified scheduler to send out observer messages.
	  * @param {Number} start The value of the first integer in the sequence.
	  * @param {Number} count The number of sequential integers to generate.
	  * @param {Scheduler} [scheduler] Scheduler to run the generator loop on. If not specified, defaults to Scheduler.currentThread.
	  * @returns {Observable} An observable sequence that contains a range of sequential integral numbers.
	  */Observable.range=function(start,count,scheduler){isScheduler(scheduler)||(scheduler=currentThreadScheduler);return new RangeObservable(start,count,scheduler);};var RepeatObservable=function(__super__){inherits(RepeatObservable,__super__);function RepeatObservable(value,repeatCount,scheduler){this.value=value;this.repeatCount=repeatCount==null?-1:repeatCount;this.scheduler=scheduler;__super__.call(this);}RepeatObservable.prototype.subscribeCore=function(observer){var sink=new RepeatSink(observer,this);return sink.run();};return RepeatObservable;}(ObservableBase);function RepeatSink(observer,parent){this.observer=observer;this.parent=parent;}RepeatSink.prototype.run=function(){var observer=this.observer,value=this.parent.value;function loopRecursive(i,recurse){if(i===-1||i>0){observer.onNext(value);i>0&&i--;}if(i===0){return observer.onCompleted();}recurse(i);}return this.parent.scheduler.scheduleRecursive(this.parent.repeatCount,loopRecursive);}; /**
	   *  Generates an observable sequence that repeats the given element the specified number of times, using the specified scheduler to send out observer messages.
	   * @param {Mixed} value Element to repeat.
	   * @param {Number} repeatCount [Optiona] Number of times to repeat the element. If not specified, repeats indefinitely.
	   * @param {Scheduler} scheduler Scheduler to run the producer loop on. If not specified, defaults to Scheduler.immediate.
	   * @returns {Observable} An observable sequence that repeats the given element the specified number of times.
	   */Observable.repeat=function(value,repeatCount,scheduler){isScheduler(scheduler)||(scheduler=currentThreadScheduler);return new RepeatObservable(value,repeatCount,scheduler);};var JustObservable=function(__super__){inherits(JustObservable,__super__);function JustObservable(value,scheduler){this._value=value;this._scheduler=scheduler;__super__.call(this);}JustObservable.prototype.subscribeCore=function(o){var state=[this._value,o];return this._scheduler===immediateScheduler?scheduleItem(null,state):this._scheduler.schedule(state,scheduleItem);};function scheduleItem(s,state){var value=state[0],observer=state[1];observer.onNext(value);observer.onCompleted();return disposableEmpty;}return JustObservable;}(ObservableBase); /**
	   *  Returns an observable sequence that contains a single element, using the specified scheduler to send out observer messages.
	   *  There is an alias called 'just' or browsers <IE9.
	   * @param {Mixed} value Single element in the resulting observable sequence.
	   * @param {Scheduler} scheduler Scheduler to send the single element on. If not specified, defaults to Scheduler.immediate.
	   * @returns {Observable} An observable sequence containing the single specified element.
	   */var observableReturn=Observable['return']=Observable.just=function(value,scheduler){isScheduler(scheduler)||(scheduler=immediateScheduler);return new JustObservable(value,scheduler);};var ThrowObservable=function(__super__){inherits(ThrowObservable,__super__);function ThrowObservable(error,scheduler){this._error=error;this._scheduler=scheduler;__super__.call(this);}ThrowObservable.prototype.subscribeCore=function(o){var state=[this._error,o];return this._scheduler===immediateScheduler?scheduleItem(null,state):this._scheduler.schedule(state,scheduleItem);};function scheduleItem(s,state){var e=state[0],o=state[1];o.onError(e);return disposableEmpty;}return ThrowObservable;}(ObservableBase); /**
	   *  Returns an observable sequence that terminates with an exception, using the specified scheduler to send out the single onError message.
	   *  There is an alias to this method called 'throwError' for browsers <IE9.
	   * @param {Mixed} error An object used for the sequence's termination.
	   * @param {Scheduler} scheduler Scheduler to send the exceptional termination call on. If not specified, defaults to Scheduler.immediate.
	   * @returns {Observable} The observable sequence that terminates exceptionally with the specified exception object.
	   */var observableThrow=Observable['throw']=function(error,scheduler){isScheduler(scheduler)||(scheduler=immediateScheduler);return new ThrowObservable(error,scheduler);};var UsingObservable=function(__super__){inherits(UsingObservable,__super__);function UsingObservable(resFn,obsFn){this._resFn=resFn;this._obsFn=obsFn;__super__.call(this);}UsingObservable.prototype.subscribeCore=function(o){var disposable=disposableEmpty;var resource=tryCatch(this._resFn)();if(resource===errorObj){return new BinaryDisposable(observableThrow(resource.e).subscribe(o),disposable);}resource&&(disposable=resource);var source=tryCatch(this._obsFn)(resource);if(source===errorObj){return new BinaryDisposable(observableThrow(source.e).subscribe(o),disposable);}return new BinaryDisposable(source.subscribe(o),disposable);};return UsingObservable;}(ObservableBase); /**
	   * Constructs an observable sequence that depends on a resource object, whose lifetime is tied to the resulting observable sequence's lifetime.
	   * @param {Function} resourceFactory Factory function to obtain a resource object.
	   * @param {Function} observableFactory Factory function to obtain an observable sequence that depends on the obtained resource.
	   * @returns {Observable} An observable sequence whose lifetime controls the lifetime of the dependent resource object.
	   */Observable.using=function(resourceFactory,observableFactory){return new UsingObservable(resourceFactory,observableFactory);}; /**
	   * Propagates the observable sequence or Promise that reacts first.
	   * @param {Observable} rightSource Second observable sequence or Promise.
	   * @returns {Observable} {Observable} An observable sequence that surfaces either of the given sequences, whichever reacted first.
	   */observableProto.amb=function(rightSource){var leftSource=this;return new AnonymousObservable(function(observer){var choice,leftChoice='L',rightChoice='R',leftSubscription=new SingleAssignmentDisposable(),rightSubscription=new SingleAssignmentDisposable();isPromise(rightSource)&&(rightSource=observableFromPromise(rightSource));function choiceL(){if(!choice){choice=leftChoice;rightSubscription.dispose();}}function choiceR(){if(!choice){choice=rightChoice;leftSubscription.dispose();}}var leftSubscribe=observerCreate(function(left){choiceL();choice===leftChoice&&observer.onNext(left);},function(e){choiceL();choice===leftChoice&&observer.onError(e);},function(){choiceL();choice===leftChoice&&observer.onCompleted();});var rightSubscribe=observerCreate(function(right){choiceR();choice===rightChoice&&observer.onNext(right);},function(e){choiceR();choice===rightChoice&&observer.onError(e);},function(){choiceR();choice===rightChoice&&observer.onCompleted();});leftSubscription.setDisposable(leftSource.subscribe(leftSubscribe));rightSubscription.setDisposable(rightSource.subscribe(rightSubscribe));return new BinaryDisposable(leftSubscription,rightSubscription);});};function amb(p,c){return p.amb(c);} /**
	   * Propagates the observable sequence or Promise that reacts first.
	   * @returns {Observable} An observable sequence that surfaces any of the given sequences, whichever reacted first.
	   */Observable.amb=function(){var acc=observableNever(),items;if(Array.isArray(arguments[0])){items=arguments[0];}else {var len=arguments.length;items=new Array(items);for(var i=0;i<len;i++){items[i]=arguments[i];}}for(var i=0,len=items.length;i<len;i++){acc=amb(acc,items[i]);}return acc;};var CatchObservable=function(__super__){inherits(CatchObservable,__super__);function CatchObservable(source,fn){this.source=source;this._fn=fn;__super__.call(this);}CatchObservable.prototype.subscribeCore=function(o){var d1=new SingleAssignmentDisposable(),subscription=new SerialDisposable();subscription.setDisposable(d1);d1.setDisposable(this.source.subscribe(new CatchObserver(o,subscription,this._fn)));return subscription;};return CatchObservable;}(ObservableBase);var CatchObserver=function(__super__){inherits(CatchObserver,__super__);function CatchObserver(o,s,fn){this._o=o;this._s=s;this._fn=fn;__super__.call(this);}CatchObserver.prototype.next=function(x){this._o.onNext(x);};CatchObserver.prototype.completed=function(){return this._o.onCompleted();};CatchObserver.prototype.error=function(e){var result=tryCatch(this._fn)(e);if(result===errorObj){return this._o.onError(result.e);}isPromise(result)&&(result=observableFromPromise(result));var d=new SingleAssignmentDisposable();this._s.setDisposable(d);d.setDisposable(result.subscribe(this._o));};return CatchObserver;}(AbstractObserver); /**
	   * Continues an observable sequence that is terminated by an exception with the next observable sequence.
	   * @param {Mixed} handlerOrSecond Exception handler function that returns an observable sequence given the error that occurred in the first sequence, or a second observable sequence used to produce results when an error occurred in the first sequence.
	   * @returns {Observable} An observable sequence containing the first sequence's elements, followed by the elements of the handler sequence in case an exception occurred.
	   */observableProto['catch']=function(handlerOrSecond){return isFunction(handlerOrSecond)?new CatchObservable(this,handlerOrSecond):observableCatch([this,handlerOrSecond]);}; /**
	   * Continues an observable sequence that is terminated by an exception with the next observable sequence.
	   * @param {Array | Arguments} args Arguments or an array to use as the next sequence if an error occurs.
	   * @returns {Observable} An observable sequence containing elements from consecutive source sequences until a source sequence terminates successfully.
	   */var observableCatch=Observable['catch']=function(){var items;if(Array.isArray(arguments[0])){items=arguments[0];}else {var len=arguments.length;items=new Array(len);for(var i=0;i<len;i++){items[i]=arguments[i];}}return enumerableOf(items).catchError();}; /**
	   * Merges the specified observable sequences into one observable sequence by using the selector function whenever any of the observable sequences or Promises produces an element.
	   * This can be in the form of an argument list of observables or an array.
	   *
	   * @example
	   * 1 - obs = observable.combineLatest(obs1, obs2, obs3, function (o1, o2, o3) { return o1 + o2 + o3; });
	   * 2 - obs = observable.combineLatest([obs1, obs2, obs3], function (o1, o2, o3) { return o1 + o2 + o3; });
	   * @returns {Observable} An observable sequence containing the result of combining elements of the sources using the specified result selector function.
	   */observableProto.combineLatest=function(){var len=arguments.length,args=new Array(len);for(var i=0;i<len;i++){args[i]=arguments[i];}if(Array.isArray(args[0])){args[0].unshift(this);}else {args.unshift(this);}return combineLatest.apply(this,args);};function falseFactory(){return false;}function argumentsToArray(){var len=arguments.length,args=new Array(len);for(var i=0;i<len;i++){args[i]=arguments[i];}return args;}var CombineLatestObservable=function(__super__){inherits(CombineLatestObservable,__super__);function CombineLatestObservable(params,cb){this._params=params;this._cb=cb;__super__.call(this);}CombineLatestObservable.prototype.subscribeCore=function(observer){var len=this._params.length,subscriptions=new Array(len);var state={hasValue:arrayInitialize(len,falseFactory),hasValueAll:false,isDone:arrayInitialize(len,falseFactory),values:new Array(len)};for(var i=0;i<len;i++){var source=this._params[i],sad=new SingleAssignmentDisposable();subscriptions[i]=sad;isPromise(source)&&(source=observableFromPromise(source));sad.setDisposable(source.subscribe(new CombineLatestObserver(observer,i,this._cb,state)));}return new NAryDisposable(subscriptions);};return CombineLatestObservable;}(ObservableBase);var CombineLatestObserver=function(__super__){inherits(CombineLatestObserver,__super__);function CombineLatestObserver(o,i,cb,state){this._o=o;this._i=i;this._cb=cb;this._state=state;__super__.call(this);}function notTheSame(i){return function(x,j){return j!==i;};}CombineLatestObserver.prototype.next=function(x){this._state.values[this._i]=x;this._state.hasValue[this._i]=true;if(this._state.hasValueAll||(this._state.hasValueAll=this._state.hasValue.every(identity))){var res=tryCatch(this._cb).apply(null,this._state.values);if(res===errorObj){return this._o.onError(res.e);}this._o.onNext(res);}else if(this._state.isDone.filter(notTheSame(this._i)).every(identity)){this._o.onCompleted();}};CombineLatestObserver.prototype.error=function(e){this._o.onError(e);};CombineLatestObserver.prototype.completed=function(){this._state.isDone[this._i]=true;this._state.isDone.every(identity)&&this._o.onCompleted();};return CombineLatestObserver;}(AbstractObserver); /**
	  * Merges the specified observable sequences into one observable sequence by using the selector function whenever any of the observable sequences or Promises produces an element.
	  *
	  * @example
	  * 1 - obs = Rx.Observable.combineLatest(obs1, obs2, obs3, function (o1, o2, o3) { return o1 + o2 + o3; });
	  * 2 - obs = Rx.Observable.combineLatest([obs1, obs2, obs3], function (o1, o2, o3) { return o1 + o2 + o3; });
	  * @returns {Observable} An observable sequence containing the result of combining elements of the sources using the specified result selector function.
	  */var combineLatest=Observable.combineLatest=function(){var len=arguments.length,args=new Array(len);for(var i=0;i<len;i++){args[i]=arguments[i];}var resultSelector=isFunction(args[len-1])?args.pop():argumentsToArray;Array.isArray(args[0])&&(args=args[0]);return new CombineLatestObservable(args,resultSelector);}; /**
	   * Concatenates all the observable sequences.  This takes in either an array or variable arguments to concatenate.
	   * @returns {Observable} An observable sequence that contains the elements of each given sequence, in sequential order.
	   */observableProto.concat=function(){for(var args=[],i=0,len=arguments.length;i<len;i++){args.push(arguments[i]);}args.unshift(this);return observableConcat.apply(null,args);};var ConcatObserver=function(__super__){inherits(ConcatObserver,__super__);function ConcatObserver(s,fn){this._s=s;this._fn=fn;__super__.call(this);}ConcatObserver.prototype.next=function(x){this._s.o.onNext(x);};ConcatObserver.prototype.error=function(e){this._s.o.onError(e);};ConcatObserver.prototype.completed=function(){this._s.i++;this._fn(this._s);};return ConcatObserver;}(AbstractObserver);var ConcatObservable=function(__super__){inherits(ConcatObservable,__super__);function ConcatObservable(sources){this._sources=sources;__super__.call(this);}function scheduleRecursive(state,recurse){if(state.disposable.isDisposed){return;}if(state.i===state.sources.length){return state.o.onCompleted();} // Check if promise
	var currentValue=state.sources[state.i];isPromise(currentValue)&&(currentValue=observableFromPromise(currentValue));var d=new SingleAssignmentDisposable();state.subscription.setDisposable(d);d.setDisposable(currentValue.subscribe(new ConcatObserver(state,recurse)));}ConcatObservable.prototype.subscribeCore=function(o){var subscription=new SerialDisposable();var disposable=disposableCreate(noop);var state={o:o,i:0,subscription:subscription,disposable:disposable,sources:this._sources};var cancelable=immediateScheduler.scheduleRecursive(state,scheduleRecursive);return new NAryDisposable([subscription,disposable,cancelable]);};return ConcatObservable;}(ObservableBase); /**
	   * Concatenates all the observable sequences.
	   * @param {Array | Arguments} args Arguments or an array to concat to the observable sequence.
	   * @returns {Observable} An observable sequence that contains the elements of each given sequence, in sequential order.
	   */var observableConcat=Observable.concat=function(){var args;if(Array.isArray(arguments[0])){args=arguments[0];}else {args=new Array(arguments.length);for(var i=0,len=arguments.length;i<len;i++){args[i]=arguments[i];}}return new ConcatObservable(args);}; /**
	   * Concatenates an observable sequence of observable sequences.
	   * @returns {Observable} An observable sequence that contains the elements of each observed inner sequence, in sequential order.
	   */observableProto.concatAll=function(){return this.merge(1);};var MergeObservable=function(__super__){inherits(MergeObservable,__super__);function MergeObservable(source,maxConcurrent){this.source=source;this.maxConcurrent=maxConcurrent;__super__.call(this);}MergeObservable.prototype.subscribeCore=function(observer){var g=new CompositeDisposable();g.add(this.source.subscribe(new MergeObserver(observer,this.maxConcurrent,g)));return g;};return MergeObservable;}(ObservableBase);var MergeObserver=function(__super__){function MergeObserver(o,max,g){this.o=o;this.max=max;this.g=g;this.done=false;this.q=[];this.activeCount=0;__super__.call(this);}inherits(MergeObserver,__super__);MergeObserver.prototype.handleSubscribe=function(xs){var sad=new SingleAssignmentDisposable();this.g.add(sad);isPromise(xs)&&(xs=observableFromPromise(xs));sad.setDisposable(xs.subscribe(new InnerObserver(this,sad)));};MergeObserver.prototype.next=function(innerSource){if(this.activeCount<this.max){this.activeCount++;this.handleSubscribe(innerSource);}else {this.q.push(innerSource);}};MergeObserver.prototype.error=function(e){this.o.onError(e);};MergeObserver.prototype.completed=function(){this.done=true;this.activeCount===0&&this.o.onCompleted();};function InnerObserver(parent,sad){this.parent=parent;this.sad=sad;__super__.call(this);}inherits(InnerObserver,__super__);InnerObserver.prototype.next=function(x){this.parent.o.onNext(x);};InnerObserver.prototype.error=function(e){this.parent.o.onError(e);};InnerObserver.prototype.completed=function(){this.parent.g.remove(this.sad);if(this.parent.q.length>0){this.parent.handleSubscribe(this.parent.q.shift());}else {this.parent.activeCount--;this.parent.done&&this.parent.activeCount===0&&this.parent.o.onCompleted();}};return MergeObserver;}(AbstractObserver); /**
	  * Merges an observable sequence of observable sequences into an observable sequence, limiting the number of concurrent subscriptions to inner sequences.
	  * Or merges two observable sequences into a single observable sequence.
	  * @param {Mixed} [maxConcurrentOrOther] Maximum number of inner observable sequences being subscribed to concurrently or the second observable sequence.
	  * @returns {Observable} The observable sequence that merges the elements of the inner sequences.
	  */observableProto.merge=function(maxConcurrentOrOther){return typeof maxConcurrentOrOther!=='number'?observableMerge(this,maxConcurrentOrOther):new MergeObservable(this,maxConcurrentOrOther);}; /**
	   * Merges all the observable sequences into a single observable sequence.
	   * The scheduler is optional and if not specified, the immediate scheduler is used.
	   * @returns {Observable} The observable sequence that merges the elements of the observable sequences.
	   */var observableMerge=Observable.merge=function(){var scheduler,sources=[],i,len=arguments.length;if(!arguments[0]){scheduler=immediateScheduler;for(i=1;i<len;i++){sources.push(arguments[i]);}}else if(isScheduler(arguments[0])){scheduler=arguments[0];for(i=1;i<len;i++){sources.push(arguments[i]);}}else {scheduler=immediateScheduler;for(i=0;i<len;i++){sources.push(arguments[i]);}}if(Array.isArray(sources[0])){sources=sources[0];}return observableOf(scheduler,sources).mergeAll();};var MergeAllObservable=function(__super__){inherits(MergeAllObservable,__super__);function MergeAllObservable(source){this.source=source;__super__.call(this);}MergeAllObservable.prototype.subscribeCore=function(o){var g=new CompositeDisposable(),m=new SingleAssignmentDisposable();g.add(m);m.setDisposable(this.source.subscribe(new MergeAllObserver(o,g)));return g;};return MergeAllObservable;}(ObservableBase);var MergeAllObserver=function(__super__){function MergeAllObserver(o,g){this.o=o;this.g=g;this.done=false;__super__.call(this);}inherits(MergeAllObserver,__super__);MergeAllObserver.prototype.next=function(innerSource){var sad=new SingleAssignmentDisposable();this.g.add(sad);isPromise(innerSource)&&(innerSource=observableFromPromise(innerSource));sad.setDisposable(innerSource.subscribe(new InnerObserver(this,sad)));};MergeAllObserver.prototype.error=function(e){this.o.onError(e);};MergeAllObserver.prototype.completed=function(){this.done=true;this.g.length===1&&this.o.onCompleted();};function InnerObserver(parent,sad){this.parent=parent;this.sad=sad;__super__.call(this);}inherits(InnerObserver,__super__);InnerObserver.prototype.next=function(x){this.parent.o.onNext(x);};InnerObserver.prototype.error=function(e){this.parent.o.onError(e);};InnerObserver.prototype.completed=function(){this.parent.g.remove(this.sad);this.parent.done&&this.parent.g.length===1&&this.parent.o.onCompleted();};return MergeAllObserver;}(AbstractObserver); /**
	  * Merges an observable sequence of observable sequences into an observable sequence.
	  * @returns {Observable} The observable sequence that merges the elements of the inner sequences.
	  */observableProto.mergeAll=function(){return new MergeAllObservable(this);};var CompositeError=Rx.CompositeError=function(errors){this.innerErrors=errors;this.message='This contains multiple errors. Check the innerErrors';Error.call(this);};CompositeError.prototype=Object.create(Error.prototype);CompositeError.prototype.name='CompositeError';var MergeDelayErrorObservable=function(__super__){inherits(MergeDelayErrorObservable,__super__);function MergeDelayErrorObservable(source){this.source=source;__super__.call(this);}MergeDelayErrorObservable.prototype.subscribeCore=function(o){var group=new CompositeDisposable(),m=new SingleAssignmentDisposable(),state={isStopped:false,errors:[],o:o};group.add(m);m.setDisposable(this.source.subscribe(new MergeDelayErrorObserver(group,state)));return group;};return MergeDelayErrorObservable;}(ObservableBase);var MergeDelayErrorObserver=function(__super__){inherits(MergeDelayErrorObserver,__super__);function MergeDelayErrorObserver(group,state){this._group=group;this._state=state;__super__.call(this);}function setCompletion(o,errors){if(errors.length===0){o.onCompleted();}else if(errors.length===1){o.onError(errors[0]);}else {o.onError(new CompositeError(errors));}}MergeDelayErrorObserver.prototype.next=function(x){var inner=new SingleAssignmentDisposable();this._group.add(inner); // Check for promises support
	isPromise(x)&&(x=observableFromPromise(x));inner.setDisposable(x.subscribe(new InnerObserver(inner,this._group,this._state)));};MergeDelayErrorObserver.prototype.error=function(e){this._state.errors.push(e);this._state.isStopped=true;this._group.length===1&&setCompletion(this._state.o,this._state.errors);};MergeDelayErrorObserver.prototype.completed=function(){this._state.isStopped=true;this._group.length===1&&setCompletion(this._state.o,this._state.errors);};inherits(InnerObserver,__super__);function InnerObserver(inner,group,state){this._inner=inner;this._group=group;this._state=state;__super__.call(this);}InnerObserver.prototype.next=function(x){this._state.o.onNext(x);};InnerObserver.prototype.error=function(e){this._state.errors.push(e);this._group.remove(this._inner);this._state.isStopped&&this._group.length===1&&setCompletion(this._state.o,this._state.errors);};InnerObserver.prototype.completed=function(){this._group.remove(this._inner);this._state.isStopped&&this._group.length===1&&setCompletion(this._state.o,this._state.errors);};return MergeDelayErrorObserver;}(AbstractObserver); /**
	  * Flattens an Observable that emits Observables into one Observable, in a way that allows an Observer to
	  * receive all successfully emitted items from all of the source Observables without being interrupted by
	  * an error notification from one of them.
	  *
	  * This behaves like Observable.prototype.mergeAll except that if any of the merged Observables notify of an
	  * error via the Observer's onError, mergeDelayError will refrain from propagating that
	  * error notification until all of the merged Observables have finished emitting items.
	  * @param {Array | Arguments} args Arguments or an array to merge.
	  * @returns {Observable} an Observable that emits all of the items emitted by the Observables emitted by the Observable
	  */Observable.mergeDelayError=function(){var args;if(Array.isArray(arguments[0])){args=arguments[0];}else {var len=arguments.length;args=new Array(len);for(var i=0;i<len;i++){args[i]=arguments[i];}}var source=observableOf(null,args);return new MergeDelayErrorObservable(source);}; /**
	   * Continues an observable sequence that is terminated normally or by an exception with the next observable sequence.
	   * @param {Observable} second Second observable sequence used to produce results after the first sequence terminates.
	   * @returns {Observable} An observable sequence that concatenates the first and second sequence, even if the first sequence terminates exceptionally.
	   */observableProto.onErrorResumeNext=function(second){if(!second){throw new Error('Second observable is required');}return onErrorResumeNext([this,second]);};var OnErrorResumeNextObservable=function(__super__){inherits(OnErrorResumeNextObservable,__super__);function OnErrorResumeNextObservable(sources){this.sources=sources;__super__.call(this);}function scheduleMethod(state,recurse){if(state.pos<state.sources.length){var current=state.sources[state.pos++];isPromise(current)&&(current=observableFromPromise(current));var d=new SingleAssignmentDisposable();state.subscription.setDisposable(d);d.setDisposable(current.subscribe(new OnErrorResumeNextObserver(state,recurse)));}else {state.o.onCompleted();}}OnErrorResumeNextObservable.prototype.subscribeCore=function(o){var subscription=new SerialDisposable(),state={pos:0,subscription:subscription,o:o,sources:this.sources},cancellable=immediateScheduler.scheduleRecursive(state,scheduleMethod);return new BinaryDisposable(subscription,cancellable);};return OnErrorResumeNextObservable;}(ObservableBase);var OnErrorResumeNextObserver=function(__super__){inherits(OnErrorResumeNextObserver,__super__);function OnErrorResumeNextObserver(state,recurse){this._state=state;this._recurse=recurse;__super__.call(this);}OnErrorResumeNextObserver.prototype.next=function(x){this._state.o.onNext(x);};OnErrorResumeNextObserver.prototype.error=function(){this._recurse(this._state);};OnErrorResumeNextObserver.prototype.completed=function(){this._recurse(this._state);};return OnErrorResumeNextObserver;}(AbstractObserver); /**
	   * Continues an observable sequence that is terminated normally or by an exception with the next observable sequence.
	   * @returns {Observable} An observable sequence that concatenates the source sequences, even if a sequence terminates exceptionally.
	   */var onErrorResumeNext=Observable.onErrorResumeNext=function(){var sources=[];if(Array.isArray(arguments[0])){sources=arguments[0];}else {var len=arguments.length;sources=new Array(len);for(var i=0;i<len;i++){sources[i]=arguments[i];}}return new OnErrorResumeNextObservable(sources);};var SkipUntilObservable=function(__super__){inherits(SkipUntilObservable,__super__);function SkipUntilObservable(source,other){this._s=source;this._o=isPromise(other)?observableFromPromise(other):other;this._open=false;__super__.call(this);}SkipUntilObservable.prototype.subscribeCore=function(o){var leftSubscription=new SingleAssignmentDisposable();leftSubscription.setDisposable(this._s.subscribe(new SkipUntilSourceObserver(o,this)));isPromise(this._o)&&(this._o=observableFromPromise(this._o));var rightSubscription=new SingleAssignmentDisposable();rightSubscription.setDisposable(this._o.subscribe(new SkipUntilOtherObserver(o,this,rightSubscription)));return new BinaryDisposable(leftSubscription,rightSubscription);};return SkipUntilObservable;}(ObservableBase);var SkipUntilSourceObserver=function(__super__){inherits(SkipUntilSourceObserver,__super__);function SkipUntilSourceObserver(o,p){this._o=o;this._p=p;__super__.call(this);}SkipUntilSourceObserver.prototype.next=function(x){this._p._open&&this._o.onNext(x);};SkipUntilSourceObserver.prototype.error=function(err){this._o.onError(err);};SkipUntilSourceObserver.prototype.onCompleted=function(){this._p._open&&this._o.onCompleted();};return SkipUntilSourceObserver;}(AbstractObserver);var SkipUntilOtherObserver=function(__super__){inherits(SkipUntilOtherObserver,__super__);function SkipUntilOtherObserver(o,p,r){this._o=o;this._p=p;this._r=r;__super__.call(this);}SkipUntilOtherObserver.prototype.next=function(){this._p._open=true;this._r.dispose();};SkipUntilOtherObserver.prototype.error=function(err){this._o.onError(err);};SkipUntilOtherObserver.prototype.onCompleted=function(){this._r.dispose();};return SkipUntilOtherObserver;}(AbstractObserver); /**
	   * Returns the values from the source observable sequence only after the other observable sequence produces a value.
	   * @param {Observable | Promise} other The observable sequence or Promise that triggers propagation of elements of the source sequence.
	   * @returns {Observable} An observable sequence containing the elements of the source sequence starting from the point the other sequence triggered propagation.
	   */observableProto.skipUntil=function(other){return new SkipUntilObservable(this,other);};var SwitchObservable=function(__super__){inherits(SwitchObservable,__super__);function SwitchObservable(source){this.source=source;__super__.call(this);}SwitchObservable.prototype.subscribeCore=function(o){var inner=new SerialDisposable(),s=this.source.subscribe(new SwitchObserver(o,inner));return new BinaryDisposable(s,inner);};inherits(SwitchObserver,AbstractObserver);function SwitchObserver(o,inner){this.o=o;this.inner=inner;this.stopped=false;this.latest=0;this.hasLatest=false;AbstractObserver.call(this);}SwitchObserver.prototype.next=function(innerSource){var d=new SingleAssignmentDisposable(),id=++this.latest;this.hasLatest=true;this.inner.setDisposable(d);isPromise(innerSource)&&(innerSource=observableFromPromise(innerSource));d.setDisposable(innerSource.subscribe(new InnerObserver(this,id)));};SwitchObserver.prototype.error=function(e){this.o.onError(e);};SwitchObserver.prototype.completed=function(){this.stopped=true;!this.hasLatest&&this.o.onCompleted();};inherits(InnerObserver,AbstractObserver);function InnerObserver(parent,id){this.parent=parent;this.id=id;AbstractObserver.call(this);}InnerObserver.prototype.next=function(x){this.parent.latest===this.id&&this.parent.o.onNext(x);};InnerObserver.prototype.error=function(e){this.parent.latest===this.id&&this.parent.o.onError(e);};InnerObserver.prototype.completed=function(){if(this.parent.latest===this.id){this.parent.hasLatest=false;this.parent.stopped&&this.parent.o.onCompleted();}};return SwitchObservable;}(ObservableBase); /**
	  * Transforms an observable sequence of observable sequences into an observable sequence producing values only from the most recent observable sequence.
	  * @returns {Observable} The observable sequence that at any point in time produces the elements of the most recent inner observable sequence that has been received.
	  */observableProto['switch']=observableProto.switchLatest=function(){return new SwitchObservable(this);};var TakeUntilObservable=function(__super__){inherits(TakeUntilObservable,__super__);function TakeUntilObservable(source,other){this.source=source;this.other=isPromise(other)?observableFromPromise(other):other;__super__.call(this);}TakeUntilObservable.prototype.subscribeCore=function(o){return new BinaryDisposable(this.source.subscribe(o),this.other.subscribe(new TakeUntilObserver(o)));};return TakeUntilObservable;}(ObservableBase);var TakeUntilObserver=function(__super__){inherits(TakeUntilObserver,__super__);function TakeUntilObserver(o){this._o=o;__super__.call(this);}TakeUntilObserver.prototype.next=function(){this._o.onCompleted();};TakeUntilObserver.prototype.error=function(err){this._o.onError(err);};TakeUntilObserver.prototype.onCompleted=noop;return TakeUntilObserver;}(AbstractObserver); /**
	   * Returns the values from the source observable sequence until the other observable sequence produces a value.
	   * @param {Observable | Promise} other Observable sequence or Promise that terminates propagation of elements of the source sequence.
	   * @returns {Observable} An observable sequence containing the elements of the source sequence up to the point the other sequence interrupted further propagation.
	   */observableProto.takeUntil=function(other){return new TakeUntilObservable(this,other);};function falseFactory(){return false;}function argumentsToArray(){var len=arguments.length,args=new Array(len);for(var i=0;i<len;i++){args[i]=arguments[i];}return args;}var WithLatestFromObservable=function(__super__){inherits(WithLatestFromObservable,__super__);function WithLatestFromObservable(source,sources,resultSelector){this._s=source;this._ss=sources;this._cb=resultSelector;__super__.call(this);}WithLatestFromObservable.prototype.subscribeCore=function(o){var len=this._ss.length;var state={hasValue:arrayInitialize(len,falseFactory),hasValueAll:false,values:new Array(len)};var n=this._ss.length,subscriptions=new Array(n+1);for(var i=0;i<n;i++){var other=this._ss[i],sad=new SingleAssignmentDisposable();isPromise(other)&&(other=observableFromPromise(other));sad.setDisposable(other.subscribe(new WithLatestFromOtherObserver(o,i,state)));subscriptions[i]=sad;}var outerSad=new SingleAssignmentDisposable();outerSad.setDisposable(this._s.subscribe(new WithLatestFromSourceObserver(o,this._cb,state)));subscriptions[n]=outerSad;return new NAryDisposable(subscriptions);};return WithLatestFromObservable;}(ObservableBase);var WithLatestFromOtherObserver=function(__super__){inherits(WithLatestFromOtherObserver,__super__);function WithLatestFromOtherObserver(o,i,state){this._o=o;this._i=i;this._state=state;__super__.call(this);}WithLatestFromOtherObserver.prototype.next=function(x){this._state.values[this._i]=x;this._state.hasValue[this._i]=true;this._state.hasValueAll=this._state.hasValue.every(identity);};WithLatestFromOtherObserver.prototype.error=function(e){this._o.onError(e);};WithLatestFromOtherObserver.prototype.completed=noop;return WithLatestFromOtherObserver;}(AbstractObserver);var WithLatestFromSourceObserver=function(__super__){inherits(WithLatestFromSourceObserver,__super__);function WithLatestFromSourceObserver(o,cb,state){this._o=o;this._cb=cb;this._state=state;__super__.call(this);}WithLatestFromSourceObserver.prototype.next=function(x){var allValues=[x].concat(this._state.values);if(!this._state.hasValueAll){return;}var res=tryCatch(this._cb).apply(null,allValues);if(res===errorObj){return this._o.onError(res.e);}this._o.onNext(res);};WithLatestFromSourceObserver.prototype.error=function(e){this._o.onError(e);};WithLatestFromSourceObserver.prototype.completed=function(){this._o.onCompleted();};return WithLatestFromSourceObserver;}(AbstractObserver); /**
	   * Merges the specified observable sequences into one observable sequence by using the selector function only when the (first) source observable sequence produces an element.
	   * @returns {Observable} An observable sequence containing the result of combining elements of the sources using the specified result selector function.
	   */observableProto.withLatestFrom=function(){if(arguments.length===0){throw new Error('invalid arguments');}var len=arguments.length,args=new Array(len);for(var i=0;i<len;i++){args[i]=arguments[i];}var resultSelector=isFunction(args[len-1])?args.pop():argumentsToArray;Array.isArray(args[0])&&(args=args[0]);return new WithLatestFromObservable(this,args,resultSelector);};function falseFactory(){return false;}function emptyArrayFactory(){return [];}var ZipObservable=function(__super__){inherits(ZipObservable,__super__);function ZipObservable(sources,resultSelector){this._s=sources;this._cb=resultSelector;__super__.call(this);}ZipObservable.prototype.subscribeCore=function(observer){var n=this._s.length,subscriptions=new Array(n),done=arrayInitialize(n,falseFactory),q=arrayInitialize(n,emptyArrayFactory);for(var i=0;i<n;i++){var source=this._s[i],sad=new SingleAssignmentDisposable();subscriptions[i]=sad;isPromise(source)&&(source=observableFromPromise(source));sad.setDisposable(source.subscribe(new ZipObserver(observer,i,this,q,done)));}return new NAryDisposable(subscriptions);};return ZipObservable;}(ObservableBase);var ZipObserver=function(__super__){inherits(ZipObserver,__super__);function ZipObserver(o,i,p,q,d){this._o=o;this._i=i;this._p=p;this._q=q;this._d=d;__super__.call(this);}function notEmpty(x){return x.length>0;}function shiftEach(x){return x.shift();}function notTheSame(i){return function(x,j){return j!==i;};}ZipObserver.prototype.next=function(x){this._q[this._i].push(x);if(this._q.every(notEmpty)){var queuedValues=this._q.map(shiftEach);var res=tryCatch(this._p._cb).apply(null,queuedValues);if(res===errorObj){return this._o.onError(res.e);}this._o.onNext(res);}else if(this._d.filter(notTheSame(this._i)).every(identity)){this._o.onCompleted();}};ZipObserver.prototype.error=function(e){this._o.onError(e);};ZipObserver.prototype.completed=function(){this._d[this._i]=true;this._d.every(identity)&&this._o.onCompleted();};return ZipObserver;}(AbstractObserver); /**
	   * Merges the specified observable sequences into one observable sequence by using the selector function whenever all of the observable sequences or an array have produced an element at a corresponding index.
	   * The last element in the arguments must be a function to invoke for each series of elements at corresponding indexes in the args.
	   * @returns {Observable} An observable sequence containing the result of combining elements of the args using the specified result selector function.
	   */observableProto.zip=function(){if(arguments.length===0){throw new Error('invalid arguments');}var len=arguments.length,args=new Array(len);for(var i=0;i<len;i++){args[i]=arguments[i];}var resultSelector=isFunction(args[len-1])?args.pop():argumentsToArray;Array.isArray(args[0])&&(args=args[0]);var parent=this;args.unshift(parent);return new ZipObservable(args,resultSelector);}; /**
	   * Merges the specified observable sequences into one observable sequence by using the selector function whenever all of the observable sequences have produced an element at a corresponding index.
	   * @param arguments Observable sources.
	   * @param {Function} resultSelector Function to invoke for each series of elements at corresponding indexes in the sources.
	   * @returns {Observable} An observable sequence containing the result of combining elements of the sources using the specified result selector function.
	   */Observable.zip=function(){var len=arguments.length,args=new Array(len);for(var i=0;i<len;i++){args[i]=arguments[i];}if(Array.isArray(args[0])){args=isFunction(args[1])?args[0].concat(args[1]):args[0];}var first=args.shift();return first.zip.apply(first,args);};function falseFactory(){return false;}function emptyArrayFactory(){return [];}function argumentsToArray(){var len=arguments.length,args=new Array(len);for(var i=0;i<len;i++){args[i]=arguments[i];}return args;}var ZipIterableObservable=function(__super__){inherits(ZipIterableObservable,__super__);function ZipIterableObservable(sources,cb){this.sources=sources;this._cb=cb;__super__.call(this);}ZipIterableObservable.prototype.subscribeCore=function(o){var sources=this.sources,len=sources.length,subscriptions=new Array(len);var state={q:arrayInitialize(len,emptyArrayFactory),done:arrayInitialize(len,falseFactory),cb:this._cb,o:o};for(var i=0;i<len;i++){(function(i){var source=sources[i],sad=new SingleAssignmentDisposable();(isArrayLike(source)||isIterable(source))&&(source=observableFrom(source));subscriptions[i]=sad;sad.setDisposable(source.subscribe(new ZipIterableObserver(state,i)));})(i);}return new NAryDisposable(subscriptions);};return ZipIterableObservable;}(ObservableBase);var ZipIterableObserver=function(__super__){inherits(ZipIterableObserver,__super__);function ZipIterableObserver(s,i){this._s=s;this._i=i;__super__.call(this);}function notEmpty(x){return x.length>0;}function shiftEach(x){return x.shift();}function notTheSame(i){return function(x,j){return j!==i;};}ZipIterableObserver.prototype.next=function(x){this._s.q[this._i].push(x);if(this._s.q.every(notEmpty)){var queuedValues=this._s.q.map(shiftEach),res=tryCatch(this._s.cb).apply(null,queuedValues);if(res===errorObj){return this._s.o.onError(res.e);}this._s.o.onNext(res);}else if(this._s.done.filter(notTheSame(this._i)).every(identity)){this._s.o.onCompleted();}};ZipIterableObserver.prototype.error=function(e){this._s.o.onError(e);};ZipIterableObserver.prototype.completed=function(){this._s.done[this._i]=true;this._s.done.every(identity)&&this._s.o.onCompleted();};return ZipIterableObserver;}(AbstractObserver); /**
	 * Merges the specified observable sequences into one observable sequence by using the selector function whenever all of the observable sequences or an array have produced an element at a corresponding index.
	 * The last element in the arguments must be a function to invoke for each series of elements at corresponding indexes in the args.
	 * @returns {Observable} An observable sequence containing the result of combining elements of the args using the specified result selector function.
	 */observableProto.zipIterable=function(){if(arguments.length===0){throw new Error('invalid arguments');}var len=arguments.length,args=new Array(len);for(var i=0;i<len;i++){args[i]=arguments[i];}var resultSelector=isFunction(args[len-1])?args.pop():argumentsToArray;var parent=this;args.unshift(parent);return new ZipIterableObservable(args,resultSelector);};function asObservable(source){return function subscribe(o){return source.subscribe(o);};} /**
	   *  Hides the identity of an observable sequence.
	   * @returns {Observable} An observable sequence that hides the identity of the source sequence.
	   */observableProto.asObservable=function(){return new AnonymousObservable(asObservable(this),this);};function toArray(x){return x.toArray();}function notEmpty(x){return x.length>0;} /**
	   *  Projects each element of an observable sequence into zero or more buffers which are produced based on element count information.
	   * @param {Number} count Length of each buffer.
	   * @param {Number} [skip] Number of elements to skip between creation of consecutive buffers. If not provided, defaults to the count.
	   * @returns {Observable} An observable sequence of buffers.
	   */observableProto.bufferWithCount=function(count,skip){typeof skip!=='number'&&(skip=count);return this.windowWithCount(count,skip).flatMap(toArray).filter(notEmpty);};var DematerializeObservable=function(__super__){inherits(DematerializeObservable,__super__);function DematerializeObservable(source){this.source=source;__super__.call(this);}DematerializeObservable.prototype.subscribeCore=function(o){return this.source.subscribe(new DematerializeObserver(o));};return DematerializeObservable;}(ObservableBase);var DematerializeObserver=function(__super__){inherits(DematerializeObserver,__super__);function DematerializeObserver(o){this._o=o;__super__.call(this);}DematerializeObserver.prototype.next=function(x){x.accept(this._o);};DematerializeObserver.prototype.error=function(e){this._o.onError(e);};DematerializeObserver.prototype.completed=function(){this._o.onCompleted();};return DematerializeObserver;}(AbstractObserver); /**
	   * Dematerializes the explicit notification values of an observable sequence as implicit notifications.
	   * @returns {Observable} An observable sequence exhibiting the behavior corresponding to the source sequence's notification values.
	   */observableProto.dematerialize=function(){return new DematerializeObservable(this);};var DistinctUntilChangedObservable=function(__super__){inherits(DistinctUntilChangedObservable,__super__);function DistinctUntilChangedObservable(source,keyFn,comparer){this.source=source;this.keyFn=keyFn;this.comparer=comparer;__super__.call(this);}DistinctUntilChangedObservable.prototype.subscribeCore=function(o){return this.source.subscribe(new DistinctUntilChangedObserver(o,this.keyFn,this.comparer));};return DistinctUntilChangedObservable;}(ObservableBase);var DistinctUntilChangedObserver=function(__super__){inherits(DistinctUntilChangedObserver,__super__);function DistinctUntilChangedObserver(o,keyFn,comparer){this.o=o;this.keyFn=keyFn;this.comparer=comparer;this.hasCurrentKey=false;this.currentKey=null;__super__.call(this);}DistinctUntilChangedObserver.prototype.next=function(x){var key=x,comparerEquals;if(isFunction(this.keyFn)){key=tryCatch(this.keyFn)(x);if(key===errorObj){return this.o.onError(key.e);}}if(this.hasCurrentKey){comparerEquals=tryCatch(this.comparer)(this.currentKey,key);if(comparerEquals===errorObj){return this.o.onError(comparerEquals.e);}}if(!this.hasCurrentKey||!comparerEquals){this.hasCurrentKey=true;this.currentKey=key;this.o.onNext(x);}};DistinctUntilChangedObserver.prototype.error=function(e){this.o.onError(e);};DistinctUntilChangedObserver.prototype.completed=function(){this.o.onCompleted();};return DistinctUntilChangedObserver;}(AbstractObserver); /**
	  *  Returns an observable sequence that contains only distinct contiguous elements according to the keyFn and the comparer.
	  * @param {Function} [keyFn] A function to compute the comparison key for each element. If not provided, it projects the value.
	  * @param {Function} [comparer] Equality comparer for computed key values. If not provided, defaults to an equality comparer function.
	  * @returns {Observable} An observable sequence only containing the distinct contiguous elements, based on a computed key value, from the source sequence.
	  */observableProto.distinctUntilChanged=function(keyFn,comparer){comparer||(comparer=defaultComparer);return new DistinctUntilChangedObservable(this,keyFn,comparer);};var TapObservable=function(__super__){inherits(TapObservable,__super__);function TapObservable(source,observerOrOnNext,onError,onCompleted){this.source=source;this._oN=observerOrOnNext;this._oE=onError;this._oC=onCompleted;__super__.call(this);}TapObservable.prototype.subscribeCore=function(o){return this.source.subscribe(new InnerObserver(o,this));};inherits(InnerObserver,AbstractObserver);function InnerObserver(o,p){this.o=o;this.t=!p._oN||isFunction(p._oN)?observerCreate(p._oN||noop,p._oE||noop,p._oC||noop):p._oN;this.isStopped=false;AbstractObserver.call(this);}InnerObserver.prototype.next=function(x){var res=tryCatch(this.t.onNext).call(this.t,x);if(res===errorObj){this.o.onError(res.e);}this.o.onNext(x);};InnerObserver.prototype.error=function(err){var res=tryCatch(this.t.onError).call(this.t,err);if(res===errorObj){return this.o.onError(res.e);}this.o.onError(err);};InnerObserver.prototype.completed=function(){var res=tryCatch(this.t.onCompleted).call(this.t);if(res===errorObj){return this.o.onError(res.e);}this.o.onCompleted();};return TapObservable;}(ObservableBase); /**
	  *  Invokes an action for each element in the observable sequence and invokes an action upon graceful or exceptional termination of the observable sequence.
	  *  This method can be used for debugging, logging, etc. of query behavior by intercepting the message stream to run arbitrary actions for messages on the pipeline.
	  * @param {Function | Observer} observerOrOnNext Action to invoke for each element in the observable sequence or an o.
	  * @param {Function} [onError]  Action to invoke upon exceptional termination of the observable sequence. Used if only the observerOrOnNext parameter is also a function.
	  * @param {Function} [onCompleted]  Action to invoke upon graceful termination of the observable sequence. Used if only the observerOrOnNext parameter is also a function.
	  * @returns {Observable} The source sequence with the side-effecting behavior applied.
	  */observableProto['do']=observableProto.tap=observableProto.doAction=function(observerOrOnNext,onError,onCompleted){return new TapObservable(this,observerOrOnNext,onError,onCompleted);}; /**
	  *  Invokes an action for each element in the observable sequence.
	  *  This method can be used for debugging, logging, etc. of query behavior by intercepting the message stream to run arbitrary actions for messages on the pipeline.
	  * @param {Function} onNext Action to invoke for each element in the observable sequence.
	  * @param {Any} [thisArg] Object to use as this when executing callback.
	  * @returns {Observable} The source sequence with the side-effecting behavior applied.
	  */observableProto.doOnNext=observableProto.tapOnNext=function(onNext,thisArg){return this.tap(typeof thisArg!=='undefined'?function(x){onNext.call(thisArg,x);}:onNext);}; /**
	  *  Invokes an action upon exceptional termination of the observable sequence.
	  *  This method can be used for debugging, logging, etc. of query behavior by intercepting the message stream to run arbitrary actions for messages on the pipeline.
	  * @param {Function} onError Action to invoke upon exceptional termination of the observable sequence.
	  * @param {Any} [thisArg] Object to use as this when executing callback.
	  * @returns {Observable} The source sequence with the side-effecting behavior applied.
	  */observableProto.doOnError=observableProto.tapOnError=function(onError,thisArg){return this.tap(noop,typeof thisArg!=='undefined'?function(e){onError.call(thisArg,e);}:onError);}; /**
	  *  Invokes an action upon graceful termination of the observable sequence.
	  *  This method can be used for debugging, logging, etc. of query behavior by intercepting the message stream to run arbitrary actions for messages on the pipeline.
	  * @param {Function} onCompleted Action to invoke upon graceful termination of the observable sequence.
	  * @param {Any} [thisArg] Object to use as this when executing callback.
	  * @returns {Observable} The source sequence with the side-effecting behavior applied.
	  */observableProto.doOnCompleted=observableProto.tapOnCompleted=function(onCompleted,thisArg){return this.tap(noop,null,typeof thisArg!=='undefined'?function(){onCompleted.call(thisArg);}:onCompleted);};var FinallyObservable=function(__super__){inherits(FinallyObservable,__super__);function FinallyObservable(source,fn,thisArg){this.source=source;this._fn=bindCallback(fn,thisArg,0);__super__.call(this);}FinallyObservable.prototype.subscribeCore=function(o){var d=tryCatch(this.source.subscribe).call(this.source,o);if(d===errorObj){this._fn();thrower(d.e);}return new FinallyDisposable(d,this._fn);};function FinallyDisposable(s,fn){this.isDisposed=false;this._s=s;this._fn=fn;}FinallyDisposable.prototype.dispose=function(){if(!this.isDisposed){var res=tryCatch(this._s.dispose).call(this._s);this._fn();res===errorObj&&thrower(res.e);}};return FinallyObservable;}(ObservableBase); /**
	   *  Invokes a specified action after the source observable sequence terminates gracefully or exceptionally.
	   * @param {Function} finallyAction Action to invoke after the source observable sequence terminates.
	   * @returns {Observable} Source sequence with the action-invoking termination behavior applied.
	   */observableProto['finally']=function(action,thisArg){return new FinallyObservable(this,action,thisArg);};var IgnoreElementsObservable=function(__super__){inherits(IgnoreElementsObservable,__super__);function IgnoreElementsObservable(source){this.source=source;__super__.call(this);}IgnoreElementsObservable.prototype.subscribeCore=function(o){return this.source.subscribe(new InnerObserver(o));};function InnerObserver(o){this.o=o;this.isStopped=false;}InnerObserver.prototype.onNext=noop;InnerObserver.prototype.onError=function(err){if(!this.isStopped){this.isStopped=true;this.o.onError(err);}};InnerObserver.prototype.onCompleted=function(){if(!this.isStopped){this.isStopped=true;this.o.onCompleted();}};InnerObserver.prototype.dispose=function(){this.isStopped=true;};InnerObserver.prototype.fail=function(e){if(!this.isStopped){this.isStopped=true;this.observer.onError(e);return true;}return false;};return IgnoreElementsObservable;}(ObservableBase); /**
	   *  Ignores all elements in an observable sequence leaving only the termination messages.
	   * @returns {Observable} An empty observable sequence that signals termination, successful or exceptional, of the source sequence.
	   */observableProto.ignoreElements=function(){return new IgnoreElementsObservable(this);};var MaterializeObservable=function(__super__){inherits(MaterializeObservable,__super__);function MaterializeObservable(source,fn){this.source=source;__super__.call(this);}MaterializeObservable.prototype.subscribeCore=function(o){return this.source.subscribe(new MaterializeObserver(o));};return MaterializeObservable;}(ObservableBase);var MaterializeObserver=function(__super__){inherits(MaterializeObserver,__super__);function MaterializeObserver(o){this._o=o;__super__.call(this);}MaterializeObserver.prototype.next=function(x){this._o.onNext(notificationCreateOnNext(x));};MaterializeObserver.prototype.error=function(e){this._o.onNext(notificationCreateOnError(e));this._o.onCompleted();};MaterializeObserver.prototype.completed=function(){this._o.onNext(notificationCreateOnCompleted());this._o.onCompleted();};return MaterializeObserver;}(AbstractObserver); /**
	   *  Materializes the implicit notifications of an observable sequence as explicit notification values.
	   * @returns {Observable} An observable sequence containing the materialized notification values from the source sequence.
	   */observableProto.materialize=function(){return new MaterializeObservable(this);}; /**
	   *  Repeats the observable sequence a specified number of times. If the repeat count is not specified, the sequence repeats indefinitely.
	   * @param {Number} [repeatCount]  Number of times to repeat the sequence. If not provided, repeats the sequence indefinitely.
	   * @returns {Observable} The observable sequence producing the elements of the given sequence repeatedly.
	   */observableProto.repeat=function(repeatCount){return enumerableRepeat(this,repeatCount).concat();}; /**
	   *  Repeats the source observable sequence the specified number of times or until it successfully terminates. If the retry count is not specified, it retries indefinitely.
	   *  Note if you encounter an error and want it to retry once, then you must use .retry(2);
	   *
	   * @example
	   *  var res = retried = retry.repeat();
	   *  var res = retried = retry.repeat(2);
	   * @param {Number} [retryCount]  Number of times to retry the sequence. If not provided, retry the sequence indefinitely.
	   * @returns {Observable} An observable sequence producing the elements of the given sequence repeatedly until it terminates successfully.
	   */observableProto.retry=function(retryCount){return enumerableRepeat(this,retryCount).catchError();};function repeat(value){return {'@@iterator':function iterator(){return {next:function next(){return {done:false,value:value};}};}};}var RetryWhenObservable=function(__super__){function createDisposable(state){return {isDisposed:false,dispose:function dispose(){if(!this.isDisposed){this.isDisposed=true;state.isDisposed=true;}}};}function RetryWhenObservable(source,notifier){this.source=source;this._notifier=notifier;__super__.call(this);}inherits(RetryWhenObservable,__super__);RetryWhenObservable.prototype.subscribeCore=function(o){var exceptions=new Subject(),notifier=new Subject(),handled=this._notifier(exceptions),notificationDisposable=handled.subscribe(notifier);var e=this.source['@@iterator']();var state={isDisposed:false},lastError,subscription=new SerialDisposable();var cancelable=currentThreadScheduler.scheduleRecursive(null,function(_,recurse){if(state.isDisposed){return;}var currentItem=e.next();if(currentItem.done){if(lastError){o.onError(lastError);}else {o.onCompleted();}return;} // Check if promise
	var currentValue=currentItem.value;isPromise(currentValue)&&(currentValue=observableFromPromise(currentValue));var outer=new SingleAssignmentDisposable();var inner=new SingleAssignmentDisposable();subscription.setDisposable(new BinaryDisposable(inner,outer));outer.setDisposable(currentValue.subscribe(function(x){o.onNext(x);},function(exn){inner.setDisposable(notifier.subscribe(recurse,function(ex){o.onError(ex);},function(){o.onCompleted();}));exceptions.onNext(exn);outer.dispose();},function(){o.onCompleted();}));});return new NAryDisposable([notificationDisposable,subscription,cancelable,createDisposable(state)]);};return RetryWhenObservable;}(ObservableBase);observableProto.retryWhen=function(notifier){return new RetryWhenObservable(repeat(this),notifier);};function repeat(value){return {'@@iterator':function iterator(){return {next:function next(){return {done:false,value:value};}};}};}var RepeatWhenObservable=function(__super__){function createDisposable(state){return {isDisposed:false,dispose:function dispose(){if(!this.isDisposed){this.isDisposed=true;state.isDisposed=true;}}};}function RepeatWhenObservable(source,notifier){this.source=source;this._notifier=notifier;__super__.call(this);}inherits(RepeatWhenObservable,__super__);RepeatWhenObservable.prototype.subscribeCore=function(o){var completions=new Subject(),notifier=new Subject(),handled=this._notifier(completions),notificationDisposable=handled.subscribe(notifier);var e=this.source['@@iterator']();var state={isDisposed:false},lastError,subscription=new SerialDisposable();var cancelable=currentThreadScheduler.scheduleRecursive(null,function(_,recurse){if(state.isDisposed){return;}var currentItem=e.next();if(currentItem.done){if(lastError){o.onError(lastError);}else {o.onCompleted();}return;} // Check if promise
	var currentValue=currentItem.value;isPromise(currentValue)&&(currentValue=observableFromPromise(currentValue));var outer=new SingleAssignmentDisposable();var inner=new SingleAssignmentDisposable();subscription.setDisposable(new BinaryDisposable(inner,outer));outer.setDisposable(currentValue.subscribe(function(x){o.onNext(x);},function(exn){o.onError(exn);},function(){inner.setDisposable(notifier.subscribe(recurse,function(ex){o.onError(ex);},function(){o.onCompleted();}));completions.onNext(null);outer.dispose();}));});return new NAryDisposable([notificationDisposable,subscription,cancelable,createDisposable(state)]);};return RepeatWhenObservable;}(ObservableBase);observableProto.repeatWhen=function(notifier){return new RepeatWhenObservable(repeat(this),notifier);};var ScanObservable=function(__super__){inherits(ScanObservable,__super__);function ScanObservable(source,accumulator,hasSeed,seed){this.source=source;this.accumulator=accumulator;this.hasSeed=hasSeed;this.seed=seed;__super__.call(this);}ScanObservable.prototype.subscribeCore=function(o){return this.source.subscribe(new ScanObserver(o,this));};return ScanObservable;}(ObservableBase);var ScanObserver=function(__super__){inherits(ScanObserver,__super__);function ScanObserver(o,parent){this._o=o;this._p=parent;this._fn=parent.accumulator;this._hs=parent.hasSeed;this._s=parent.seed;this._ha=false;this._a=null;this._hv=false;this._i=0;__super__.call(this);}ScanObserver.prototype.next=function(x){!this._hv&&(this._hv=true);if(this._ha){this._a=tryCatch(this._fn)(this._a,x,this._i,this._p);}else {this._a=this._hs?tryCatch(this._fn)(this._s,x,this._i,this._p):x;this._ha=true;}if(this._a===errorObj){return this._o.onError(this._a.e);}this._o.onNext(this._a);this._i++;};ScanObserver.prototype.error=function(e){this._o.onError(e);};ScanObserver.prototype.completed=function(){!this._hv&&this._hs&&this._o.onNext(this._s);this._o.onCompleted();};return ScanObserver;}(AbstractObserver); /**
	  *  Applies an accumulator function over an observable sequence and returns each intermediate result. The optional seed value is used as the initial accumulator value.
	  *  For aggregation behavior with no intermediate results, see Observable.aggregate.
	  * @param {Mixed} [seed] The initial accumulator value.
	  * @param {Function} accumulator An accumulator function to be invoked on each element.
	  * @returns {Observable} An observable sequence containing the accumulated values.
	  */observableProto.scan=function(){var hasSeed=false,seed,accumulator=arguments[0];if(arguments.length===2){hasSeed=true;seed=arguments[1];}return new ScanObservable(this,accumulator,hasSeed,seed);};var SkipLastObservable=function(__super__){inherits(SkipLastObservable,__super__);function SkipLastObservable(source,c){this.source=source;this._c=c;__super__.call(this);}SkipLastObservable.prototype.subscribeCore=function(o){return this.source.subscribe(new SkipLastObserver(o,this._c));};return SkipLastObservable;}(ObservableBase);var SkipLastObserver=function(__super__){inherits(SkipLastObserver,__super__);function SkipLastObserver(o,c){this._o=o;this._c=c;this._q=[];__super__.call(this);}SkipLastObserver.prototype.next=function(x){this._q.push(x);this._q.length>this._c&&this._o.onNext(this._q.shift());};SkipLastObserver.prototype.error=function(e){this._o.onError(e);};SkipLastObserver.prototype.completed=function(){this._o.onCompleted();};return SkipLastObserver;}(AbstractObserver); /**
	   *  Bypasses a specified number of elements at the end of an observable sequence.
	   * @description
	   *  This operator accumulates a queue with a length enough to store the first `count` elements. As more elements are
	   *  received, elements are taken from the front of the queue and produced on the result sequence. This causes elements to be delayed.
	   * @param count Number of elements to bypass at the end of the source sequence.
	   * @returns {Observable} An observable sequence containing the source sequence elements except for the bypassed ones at the end.
	   */observableProto.skipLast=function(count){if(count<0){throw new ArgumentOutOfRangeError();}return new SkipLastObservable(this,count);}; /**
	   *  Prepends a sequence of values to an observable sequence with an optional scheduler and an argument list of values to prepend.
	   *  @example
	   *  var res = source.startWith(1, 2, 3);
	   *  var res = source.startWith(Rx.Scheduler.timeout, 1, 2, 3);
	   * @param {Arguments} args The specified values to prepend to the observable sequence
	   * @returns {Observable} The source sequence prepended with the specified values.
	   */observableProto.startWith=function(){var values,scheduler,start=0;if(!!arguments.length&&isScheduler(arguments[0])){scheduler=arguments[0];start=1;}else {scheduler=immediateScheduler;}for(var args=[],i=start,len=arguments.length;i<len;i++){args.push(arguments[i]);}return enumerableOf([observableFromArray(args,scheduler),this]).concat();};var TakeLastObserver=function(__super__){inherits(TakeLastObserver,__super__);function TakeLastObserver(o,c){this._o=o;this._c=c;this._q=[];__super__.call(this);}TakeLastObserver.prototype.next=function(x){this._q.push(x);this._q.length>this._c&&this._q.shift();};TakeLastObserver.prototype.error=function(e){this._o.onError(e);};TakeLastObserver.prototype.completed=function(){while(this._q.length>0){this._o.onNext(this._q.shift());}this._o.onCompleted();};return TakeLastObserver;}(AbstractObserver); /**
	   *  Returns a specified number of contiguous elements from the end of an observable sequence.
	   * @description
	   *  This operator accumulates a buffer with a length enough to store elements count elements. Upon completion of
	   *  the source sequence, this buffer is drained on the result sequence. This causes the elements to be delayed.
	   * @param {Number} count Number of elements to take from the end of the source sequence.
	   * @returns {Observable} An observable sequence containing the specified number of elements from the end of the source sequence.
	   */observableProto.takeLast=function(count){if(count<0){throw new ArgumentOutOfRangeError();}var source=this;return new AnonymousObservable(function(o){return source.subscribe(new TakeLastObserver(o,count));},source);};var TakeLastBufferObserver=function(__super__){inherits(TakeLastBufferObserver,__super__);function TakeLastBufferObserver(o,c){this._o=o;this._c=c;this._q=[];__super__.call(this);}TakeLastBufferObserver.prototype.next=function(x){this._q.push(x);this._q.length>this._c&&this._q.shift();};TakeLastBufferObserver.prototype.error=function(e){this._o.onError(e);};TakeLastBufferObserver.prototype.completed=function(){this._o.onNext(this._q);this._o.onCompleted();};return TakeLastBufferObserver;}(AbstractObserver); /**
	   *  Returns an array with the specified number of contiguous elements from the end of an observable sequence.
	   *
	   * @description
	   *  This operator accumulates a buffer with a length enough to store count elements. Upon completion of the
	   *  source sequence, this buffer is produced on the result sequence.
	   * @param {Number} count Number of elements to take from the end of the source sequence.
	   * @returns {Observable} An observable sequence containing a single array with the specified number of elements from the end of the source sequence.
	   */observableProto.takeLastBuffer=function(count){if(count<0){throw new ArgumentOutOfRangeError();}var source=this;return new AnonymousObservable(function(o){return source.subscribe(new TakeLastBufferObserver(o,count));},source);}; /**
	   *  Projects each element of an observable sequence into zero or more windows which are produced based on element count information.
	   * @param {Number} count Length of each window.
	   * @param {Number} [skip] Number of elements to skip between creation of consecutive windows. If not specified, defaults to the count.
	   * @returns {Observable} An observable sequence of windows.
	   */observableProto.windowWithCount=function(count,skip){var source=this;+count||(count=0);Math.abs(count)===Infinity&&(count=0);if(count<=0){throw new ArgumentOutOfRangeError();}skip==null&&(skip=count);+skip||(skip=0);Math.abs(skip)===Infinity&&(skip=0);if(skip<=0){throw new ArgumentOutOfRangeError();}return new AnonymousObservable(function(observer){var m=new SingleAssignmentDisposable(),refCountDisposable=new RefCountDisposable(m),n=0,q=[];function createWindow(){var s=new Subject();q.push(s);observer.onNext(addRef(s,refCountDisposable));}createWindow();m.setDisposable(source.subscribe(function(x){for(var i=0,len=q.length;i<len;i++){q[i].onNext(x);}var c=n-count+1;c>=0&&c%skip===0&&q.shift().onCompleted();++n%skip===0&&createWindow();},function(e){while(q.length>0){q.shift().onError(e);}observer.onError(e);},function(){while(q.length>0){q.shift().onCompleted();}observer.onCompleted();}));return refCountDisposable;},source);};function concatMap(source,selector,thisArg){var selectorFunc=bindCallback(selector,thisArg,3);return source.map(function(x,i){var result=selectorFunc(x,i,source);isPromise(result)&&(result=observableFromPromise(result));(isArrayLike(result)||isIterable(result))&&(result=observableFrom(result));return result;}).concatAll();} /**
	   *  One of the Following:
	   *  Projects each element of an observable sequence to an observable sequence and merges the resulting observable sequences into one observable sequence.
	   *
	   * @example
	   *  var res = source.concatMap(function (x) { return Rx.Observable.range(0, x); });
	   *  Or:
	   *  Projects each element of an observable sequence to an observable sequence, invokes the result selector for the source element and each of the corresponding inner sequence's elements, and merges the results into one observable sequence.
	   *
	   *  var res = source.concatMap(function (x) { return Rx.Observable.range(0, x); }, function (x, y) { return x + y; });
	   *  Or:
	   *  Projects each element of the source observable sequence to the other observable sequence and merges the resulting observable sequences into one observable sequence.
	   *
	   *  var res = source.concatMap(Rx.Observable.fromArray([1,2,3]));
	   * @param {Function} selector A transform function to apply to each element or an observable sequence to project each element from the
	   * source sequence onto which could be either an observable or Promise.
	   * @param {Function} [resultSelector]  A transform function to apply to each element of the intermediate sequence.
	   * @returns {Observable} An observable sequence whose elements are the result of invoking the one-to-many transform function collectionSelector on each element of the input sequence and then mapping each of those sequence elements and their corresponding source element to a result element.
	   */observableProto.selectConcat=observableProto.concatMap=function(selector,resultSelector,thisArg){if(isFunction(selector)&&isFunction(resultSelector)){return this.concatMap(function(x,i){var selectorResult=selector(x,i);isPromise(selectorResult)&&(selectorResult=observableFromPromise(selectorResult));(isArrayLike(selectorResult)||isIterable(selectorResult))&&(selectorResult=observableFrom(selectorResult));return selectorResult.map(function(y,i2){return resultSelector(x,y,i,i2);});});}return isFunction(selector)?concatMap(this,selector,thisArg):concatMap(this,function(){return selector;});}; /**
	   * Projects each notification of an observable sequence to an observable sequence and concats the resulting observable sequences into one observable sequence.
	   * @param {Function} onNext A transform function to apply to each element; the second parameter of the function represents the index of the source element.
	   * @param {Function} onError A transform function to apply when an error occurs in the source sequence.
	   * @param {Function} onCompleted A transform function to apply when the end of the source sequence is reached.
	   * @param {Any} [thisArg] An optional "this" to use to invoke each transform.
	   * @returns {Observable} An observable sequence whose elements are the result of invoking the one-to-many transform function corresponding to each notification in the input sequence.
	   */observableProto.concatMapObserver=observableProto.selectConcatObserver=function(onNext,onError,onCompleted,thisArg){var source=this,onNextFunc=bindCallback(onNext,thisArg,2),onErrorFunc=bindCallback(onError,thisArg,1),onCompletedFunc=bindCallback(onCompleted,thisArg,0);return new AnonymousObservable(function(observer){var index=0;return source.subscribe(function(x){var result;try{result=onNextFunc(x,index++);}catch(e){observer.onError(e);return;}isPromise(result)&&(result=observableFromPromise(result));observer.onNext(result);},function(err){var result;try{result=onErrorFunc(err);}catch(e){observer.onError(e);return;}isPromise(result)&&(result=observableFromPromise(result));observer.onNext(result);observer.onCompleted();},function(){var result;try{result=onCompletedFunc();}catch(e){observer.onError(e);return;}isPromise(result)&&(result=observableFromPromise(result));observer.onNext(result);observer.onCompleted();});},this).concatAll();};var DefaultIfEmptyObserver=function(__super__){inherits(DefaultIfEmptyObserver,__super__);function DefaultIfEmptyObserver(o,d){this._o=o;this._d=d;this._f=false;__super__.call(this);}DefaultIfEmptyObserver.prototype.next=function(x){this._f=true;this._o.onNext(x);};DefaultIfEmptyObserver.prototype.error=function(e){this._o.onError(e);};DefaultIfEmptyObserver.prototype.completed=function(){!this._f&&this._o.onNext(this._d);this._o.onCompleted();};return DefaultIfEmptyObserver;}(AbstractObserver); /**
	   *  Returns the elements of the specified sequence or the specified value in a singleton sequence if the sequence is empty.
	   *
	   *  var res = obs = xs.defaultIfEmpty();
	   *  2 - obs = xs.defaultIfEmpty(false);
	   *
	   * @memberOf Observable#
	   * @param defaultValue The value to return if the sequence is empty. If not provided, this defaults to null.
	   * @returns {Observable} An observable sequence that contains the specified default value if the source is empty; otherwise, the elements of the source itself.
	   */observableProto.defaultIfEmpty=function(defaultValue){var source=this;defaultValue===undefined&&(defaultValue=null);return new AnonymousObservable(function(o){return source.subscribe(new DefaultIfEmptyObserver(o,defaultValue));},source);}; // Swap out for Array.findIndex
	function arrayIndexOfComparer(array,item,comparer){for(var i=0,len=array.length;i<len;i++){if(comparer(array[i],item)){return i;}}return -1;}function HashSet(comparer){this.comparer=comparer;this.set=[];}HashSet.prototype.push=function(value){var retValue=arrayIndexOfComparer(this.set,value,this.comparer)===-1;retValue&&this.set.push(value);return retValue;};var DistinctObservable=function(__super__){inherits(DistinctObservable,__super__);function DistinctObservable(source,keyFn,cmpFn){this.source=source;this._keyFn=keyFn;this._cmpFn=cmpFn;__super__.call(this);}DistinctObservable.prototype.subscribeCore=function(o){return this.source.subscribe(new DistinctObserver(o,this._keyFn,this._cmpFn));};return DistinctObservable;}(ObservableBase);var DistinctObserver=function(__super__){inherits(DistinctObserver,__super__);function DistinctObserver(o,keyFn,cmpFn){this._o=o;this._keyFn=keyFn;this._h=new HashSet(cmpFn);__super__.call(this);}DistinctObserver.prototype.next=function(x){var key=x;if(isFunction(this._keyFn)){key=tryCatch(this._keyFn)(x);if(key===errorObj){return this._o.onError(key.e);}}this._h.push(key)&&this._o.onNext(x);};DistinctObserver.prototype.error=function(e){this._o.onError(e);};DistinctObserver.prototype.completed=function(){this._o.onCompleted();};return DistinctObserver;}(AbstractObserver); /**
	   *  Returns an observable sequence that contains only distinct elements according to the keySelector and the comparer.
	   *  Usage of this operator should be considered carefully due to the maintenance of an internal lookup structure which can grow large.
	   *
	   * @example
	   *  var res = obs = xs.distinct();
	   *  2 - obs = xs.distinct(function (x) { return x.id; });
	   *  2 - obs = xs.distinct(function (x) { return x.id; }, function (a,b) { return a === b; });
	   * @param {Function} [keySelector]  A function to compute the comparison key for each element.
	   * @param {Function} [comparer]  Used to compare items in the collection.
	   * @returns {Observable} An observable sequence only containing the distinct elements, based on a computed key value, from the source sequence.
	   */observableProto.distinct=function(keySelector,comparer){comparer||(comparer=defaultComparer);return new DistinctObservable(this,keySelector,comparer);}; /**
	   *  Groups the elements of an observable sequence according to a specified key selector function and comparer and selects the resulting elements by using a specified function.
	   *
	   * @example
	   *  var res = observable.groupBy(function (x) { return x.id; });
	   *  2 - observable.groupBy(function (x) { return x.id; }), function (x) { return x.name; });
	   *  3 - observable.groupBy(function (x) { return x.id; }), function (x) { return x.name; }, function (x) { return x.toString(); });
	   * @param {Function} keySelector A function to extract the key for each element.
	   * @param {Function} [elementSelector]  A function to map each source element to an element in an observable group.
	   * @returns {Observable} A sequence of observable groups, each of which corresponds to a unique key value, containing all elements that share that same key value.
	   */observableProto.groupBy=function(keySelector,elementSelector){return this.groupByUntil(keySelector,elementSelector,observableNever);}; /**
	     *  Groups the elements of an observable sequence according to a specified key selector function.
	     *  A duration selector function is used to control the lifetime of groups. When a group expires, it receives an OnCompleted notification. When a new element with the same
	     *  key value as a reclaimed group occurs, the group will be reborn with a new lifetime request.
	     *
	     * @example
	     *  var res = observable.groupByUntil(function (x) { return x.id; }, null,  function () { return Rx.Observable.never(); });
	     *  2 - observable.groupBy(function (x) { return x.id; }), function (x) { return x.name; },  function () { return Rx.Observable.never(); });
	     *  3 - observable.groupBy(function (x) { return x.id; }), function (x) { return x.name; },  function () { return Rx.Observable.never(); }, function (x) { return x.toString(); });
	     * @param {Function} keySelector A function to extract the key for each element.
	     * @param {Function} durationSelector A function to signal the expiration of a group.
	     * @returns {Observable}
	     *  A sequence of observable groups, each of which corresponds to a unique key value, containing all elements that share that same key value.
	     *  If a group's lifetime expires, a new group with the same key value can be created once an element with such a key value is encoutered.
	     *
	     */observableProto.groupByUntil=function(keySelector,elementSelector,durationSelector){var source=this;return new AnonymousObservable(function(o){var map=new Map(),groupDisposable=new CompositeDisposable(),refCountDisposable=new RefCountDisposable(groupDisposable),handleError=function handleError(e){return function(item){item.onError(e);};};groupDisposable.add(source.subscribe(function(x){var key=tryCatch(keySelector)(x);if(key===errorObj){map.forEach(handleError(key.e));return o.onError(key.e);}var fireNewMapEntry=false,writer=map.get(key);if(writer===undefined){writer=new Subject();map.set(key,writer);fireNewMapEntry=true;}if(fireNewMapEntry){var group=new GroupedObservable(key,writer,refCountDisposable),durationGroup=new GroupedObservable(key,writer);var duration=tryCatch(durationSelector)(durationGroup);if(duration===errorObj){map.forEach(handleError(duration.e));return o.onError(duration.e);}o.onNext(group);var md=new SingleAssignmentDisposable();groupDisposable.add(md);md.setDisposable(duration.take(1).subscribe(noop,function(e){map.forEach(handleError(e));o.onError(e);},function(){if(map['delete'](key)){writer.onCompleted();}groupDisposable.remove(md);}));}var element=x;if(isFunction(elementSelector)){element=tryCatch(elementSelector)(x);if(element===errorObj){map.forEach(handleError(element.e));return o.onError(element.e);}}writer.onNext(element);},function(e){map.forEach(handleError(e));o.onError(e);},function(){map.forEach(function(item){item.onCompleted();});o.onCompleted();}));return refCountDisposable;},source);};var MapObservable=function(__super__){inherits(MapObservable,__super__);function MapObservable(source,selector,thisArg){this.source=source;this.selector=bindCallback(selector,thisArg,3);__super__.call(this);}function innerMap(selector,self){return function(x,i,o){return selector.call(this,self.selector(x,i,o),i,o);};}MapObservable.prototype.internalMap=function(selector,thisArg){return new MapObservable(this.source,innerMap(selector,this),thisArg);};MapObservable.prototype.subscribeCore=function(o){return this.source.subscribe(new InnerObserver(o,this.selector,this));};inherits(InnerObserver,AbstractObserver);function InnerObserver(o,selector,source){this.o=o;this.selector=selector;this.source=source;this.i=0;AbstractObserver.call(this);}InnerObserver.prototype.next=function(x){var result=tryCatch(this.selector)(x,this.i++,this.source);if(result===errorObj){return this.o.onError(result.e);}this.o.onNext(result);};InnerObserver.prototype.error=function(e){this.o.onError(e);};InnerObserver.prototype.completed=function(){this.o.onCompleted();};return MapObservable;}(ObservableBase); /**
	  * Projects each element of an observable sequence into a new form by incorporating the element's index.
	  * @param {Function} selector A transform function to apply to each source element; the second parameter of the function represents the index of the source element.
	  * @param {Any} [thisArg] Object to use as this when executing callback.
	  * @returns {Observable} An observable sequence whose elements are the result of invoking the transform function on each element of source.
	  */observableProto.map=observableProto.select=function(selector,thisArg){var selectorFn=typeof selector==='function'?selector:function(){return selector;};return this instanceof MapObservable?this.internalMap(selectorFn,thisArg):new MapObservable(this,selectorFn,thisArg);};function plucker(args,len){return function mapper(x){var currentProp=x;for(var i=0;i<len;i++){var p=currentProp[args[i]];if(typeof p!=='undefined'){currentProp=p;}else {return undefined;}}return currentProp;};} /**
	   * Retrieves the value of a specified nested property from all elements in
	   * the Observable sequence.
	   * @param {Arguments} arguments The nested properties to pluck.
	   * @returns {Observable} Returns a new Observable sequence of property values.
	   */observableProto.pluck=function(){var len=arguments.length,args=new Array(len);if(len===0){throw new Error('List of properties cannot be empty.');}for(var i=0;i<len;i++){args[i]=arguments[i];}return this.map(plucker(args,len));};observableProto.flatMap=observableProto.selectMany=function(selector,resultSelector,thisArg){return new FlatMapObservable(this,selector,resultSelector,thisArg).mergeAll();}; /**
	   * Projects each notification of an observable sequence to an observable sequence and merges the resulting observable sequences into one observable sequence.
	   * @param {Function} onNext A transform function to apply to each element; the second parameter of the function represents the index of the source element.
	   * @param {Function} onError A transform function to apply when an error occurs in the source sequence.
	   * @param {Function} onCompleted A transform function to apply when the end of the source sequence is reached.
	   * @param {Any} [thisArg] An optional "this" to use to invoke each transform.
	   * @returns {Observable} An observable sequence whose elements are the result of invoking the one-to-many transform function corresponding to each notification in the input sequence.
	   */observableProto.flatMapObserver=observableProto.selectManyObserver=function(onNext,onError,onCompleted,thisArg){var source=this;return new AnonymousObservable(function(observer){var index=0;return source.subscribe(function(x){var result;try{result=onNext.call(thisArg,x,index++);}catch(e){observer.onError(e);return;}isPromise(result)&&(result=observableFromPromise(result));observer.onNext(result);},function(err){var result;try{result=onError.call(thisArg,err);}catch(e){observer.onError(e);return;}isPromise(result)&&(result=observableFromPromise(result));observer.onNext(result);observer.onCompleted();},function(){var result;try{result=onCompleted.call(thisArg);}catch(e){observer.onError(e);return;}isPromise(result)&&(result=observableFromPromise(result));observer.onNext(result);observer.onCompleted();});},source).mergeAll();};Rx.Observable.prototype.flatMapLatest=function(selector,resultSelector,thisArg){return new FlatMapObservable(this,selector,resultSelector,thisArg).switchLatest();};var SkipObservable=function(__super__){inherits(SkipObservable,__super__);function SkipObservable(source,count){this.source=source;this._count=count;__super__.call(this);}SkipObservable.prototype.subscribeCore=function(o){return this.source.subscribe(new SkipObserver(o,this._count));};function SkipObserver(o,c){this._o=o;this._r=c;AbstractObserver.call(this);}inherits(SkipObserver,AbstractObserver);SkipObserver.prototype.next=function(x){if(this._r<=0){this._o.onNext(x);}else {this._r--;}};SkipObserver.prototype.error=function(e){this._o.onError(e);};SkipObserver.prototype.completed=function(){this._o.onCompleted();};return SkipObservable;}(ObservableBase); /**
	   * Bypasses a specified number of elements in an observable sequence and then returns the remaining elements.
	   * @param {Number} count The number of elements to skip before returning the remaining elements.
	   * @returns {Observable} An observable sequence that contains the elements that occur after the specified index in the input sequence.
	   */observableProto.skip=function(count){if(count<0){throw new ArgumentOutOfRangeError();}return new SkipObservable(this,count);};var SkipWhileObservable=function(__super__){inherits(SkipWhileObservable,__super__);function SkipWhileObservable(source,fn){this.source=source;this._fn=fn;__super__.call(this);}SkipWhileObservable.prototype.subscribeCore=function(o){return this.source.subscribe(new SkipWhileObserver(o,this));};return SkipWhileObservable;}(ObservableBase);var SkipWhileObserver=function(__super__){inherits(SkipWhileObserver,__super__);function SkipWhileObserver(o,p){this._o=o;this._p=p;this._i=0;this._r=false;__super__.call(this);}SkipWhileObserver.prototype.next=function(x){if(!this._r){var res=tryCatch(this._p._fn)(x,this._i++,this._p);if(res===errorObj){return this._o.onError(res.e);}this._r=!res;}this._r&&this._o.onNext(x);};SkipWhileObserver.prototype.error=function(e){this._o.onError(e);};SkipWhileObserver.prototype.completed=function(){this._o.onCompleted();};return SkipWhileObserver;}(AbstractObserver); /**
	   *  Bypasses elements in an observable sequence as long as a specified condition is true and then returns the remaining elements.
	   *  The element's index is used in the logic of the predicate function.
	   *
	   *  var res = source.skipWhile(function (value) { return value < 10; });
	   *  var res = source.skipWhile(function (value, index) { return value < 10 || index < 10; });
	   * @param {Function} predicate A function to test each element for a condition; the second parameter of the function represents the index of the source element.
	   * @param {Any} [thisArg] Object to use as this when executing callback.
	   * @returns {Observable} An observable sequence that contains the elements from the input sequence starting at the first element in the linear series that does not pass the test specified by predicate.
	   */observableProto.skipWhile=function(predicate,thisArg){var fn=bindCallback(predicate,thisArg,3);return new SkipWhileObservable(this,fn);};var TakeObservable=function(__super__){inherits(TakeObservable,__super__);function TakeObservable(source,count){this.source=source;this._count=count;__super__.call(this);}TakeObservable.prototype.subscribeCore=function(o){return this.source.subscribe(new TakeObserver(o,this._count));};function TakeObserver(o,c){this._o=o;this._c=c;this._r=c;AbstractObserver.call(this);}inherits(TakeObserver,AbstractObserver);TakeObserver.prototype.next=function(x){if(this._r-->0){this._o.onNext(x);this._r<=0&&this._o.onCompleted();}};TakeObserver.prototype.error=function(e){this._o.onError(e);};TakeObserver.prototype.completed=function(){this._o.onCompleted();};return TakeObservable;}(ObservableBase); /**
	   *  Returns a specified number of contiguous elements from the start of an observable sequence, using the specified scheduler for the edge case of take(0).
	   * @param {Number} count The number of elements to return.
	   * @param {Scheduler} [scheduler] Scheduler used to produce an OnCompleted message in case <paramref name="count count</paramref> is set to 0.
	   * @returns {Observable} An observable sequence that contains the specified number of elements from the start of the input sequence.
	   */observableProto.take=function(count,scheduler){if(count<0){throw new ArgumentOutOfRangeError();}if(count===0){return observableEmpty(scheduler);}return new TakeObservable(this,count);};var TakeWhileObservable=function(__super__){inherits(TakeWhileObservable,__super__);function TakeWhileObservable(source,fn){this.source=source;this._fn=fn;__super__.call(this);}TakeWhileObservable.prototype.subscribeCore=function(o){return this.source.subscribe(new TakeWhileObserver(o,this));};return TakeWhileObservable;}(ObservableBase);var TakeWhileObserver=function(__super__){inherits(TakeWhileObserver,__super__);function TakeWhileObserver(o,p){this._o=o;this._p=p;this._i=0;this._r=true;__super__.call(this);}TakeWhileObserver.prototype.next=function(x){if(this._r){this._r=tryCatch(this._p._fn)(x,this._i++,this._p);if(this._r===errorObj){return this._o.onError(this._r.e);}}if(this._r){this._o.onNext(x);}else {this._o.onCompleted();}};TakeWhileObserver.prototype.error=function(e){this._o.onError(e);};TakeWhileObserver.prototype.completed=function(){this._o.onCompleted();};return TakeWhileObserver;}(AbstractObserver); /**
	   *  Returns elements from an observable sequence as long as a specified condition is true.
	   *  The element's index is used in the logic of the predicate function.
	   * @param {Function} predicate A function to test each element for a condition; the second parameter of the function represents the index of the source element.
	   * @param {Any} [thisArg] Object to use as this when executing callback.
	   * @returns {Observable} An observable sequence that contains the elements from the input sequence that occur before the element at which the test no longer passes.
	   */observableProto.takeWhile=function(predicate,thisArg){var fn=bindCallback(predicate,thisArg,3);return new TakeWhileObservable(this,fn);};var FilterObservable=function(__super__){inherits(FilterObservable,__super__);function FilterObservable(source,predicate,thisArg){this.source=source;this.predicate=bindCallback(predicate,thisArg,3);__super__.call(this);}FilterObservable.prototype.subscribeCore=function(o){return this.source.subscribe(new InnerObserver(o,this.predicate,this));};function innerPredicate(predicate,self){return function(x,i,o){return self.predicate(x,i,o)&&predicate.call(this,x,i,o);};}FilterObservable.prototype.internalFilter=function(predicate,thisArg){return new FilterObservable(this.source,innerPredicate(predicate,this),thisArg);};inherits(InnerObserver,AbstractObserver);function InnerObserver(o,predicate,source){this.o=o;this.predicate=predicate;this.source=source;this.i=0;AbstractObserver.call(this);}InnerObserver.prototype.next=function(x){var shouldYield=tryCatch(this.predicate)(x,this.i++,this.source);if(shouldYield===errorObj){return this.o.onError(shouldYield.e);}shouldYield&&this.o.onNext(x);};InnerObserver.prototype.error=function(e){this.o.onError(e);};InnerObserver.prototype.completed=function(){this.o.onCompleted();};return FilterObservable;}(ObservableBase); /**
	  *  Filters the elements of an observable sequence based on a predicate by incorporating the element's index.
	  * @param {Function} predicate A function to test each source element for a condition; the second parameter of the function represents the index of the source element.
	  * @param {Any} [thisArg] Object to use as this when executing callback.
	  * @returns {Observable} An observable sequence that contains elements from the input sequence that satisfy the condition.
	  */observableProto.filter=observableProto.where=function(predicate,thisArg){return this instanceof FilterObservable?this.internalFilter(predicate,thisArg):new FilterObservable(this,predicate,thisArg);};var ExtremaByObservable=function(__super__){inherits(ExtremaByObservable,__super__);function ExtremaByObservable(source,k,c){this.source=source;this._k=k;this._c=c;__super__.call(this);}ExtremaByObservable.prototype.subscribeCore=function(o){return this.source.subscribe(new ExtremaByObserver(o,this._k,this._c));};return ExtremaByObservable;}(ObservableBase);var ExtremaByObserver=function(__super__){inherits(ExtremaByObserver,__super__);function ExtremaByObserver(o,k,c){this._o=o;this._k=k;this._c=c;this._v=null;this._hv=false;this._l=[];__super__.call(this);}ExtremaByObserver.prototype.next=function(x){var key=tryCatch(this._k)(x);if(key===errorObj){return this._o.onError(key.e);}var comparison=0;if(!this._hv){this._hv=true;this._v=key;}else {comparison=tryCatch(this._c)(key,this._v);if(comparison===errorObj){return this._o.onError(comparison.e);}}if(comparison>0){this._v=key;this._l=[];}if(comparison>=0){this._l.push(x);}};ExtremaByObserver.prototype.error=function(e){this._o.onError(e);};ExtremaByObserver.prototype.completed=function(){this._o.onNext(this._l);this._o.onCompleted();};return ExtremaByObserver;}(AbstractObserver);function firstOnly(x){if(x.length===0){throw new EmptyError();}return x[0];}var ReduceObservable=function(__super__){inherits(ReduceObservable,__super__);function ReduceObservable(source,accumulator,hasSeed,seed){this.source=source;this.accumulator=accumulator;this.hasSeed=hasSeed;this.seed=seed;__super__.call(this);}ReduceObservable.prototype.subscribeCore=function(observer){return this.source.subscribe(new ReduceObserver(observer,this));};return ReduceObservable;}(ObservableBase);var ReduceObserver=function(__super__){inherits(ReduceObserver,__super__);function ReduceObserver(o,parent){this._o=o;this._p=parent;this._fn=parent.accumulator;this._hs=parent.hasSeed;this._s=parent.seed;this._ha=false;this._a=null;this._hv=false;this._i=0;__super__.call(this);}ReduceObserver.prototype.next=function(x){!this._hv&&(this._hv=true);if(this._ha){this._a=tryCatch(this._fn)(this._a,x,this._i,this._p);}else {this._a=this._hs?tryCatch(this._fn)(this._s,x,this._i,this._p):x;this._ha=true;}if(this._a===errorObj){return this._o.onError(this._a.e);}this._i++;};ReduceObserver.prototype.error=function(e){this._o.onError(e);};ReduceObserver.prototype.completed=function(){this._hv&&this._o.onNext(this._a);!this._hv&&this._hs&&this._o.onNext(this._s);!this._hv&&!this._hs&&this._o.onError(new EmptyError());this._o.onCompleted();};return ReduceObserver;}(AbstractObserver); /**
	  * Applies an accumulator function over an observable sequence, returning the result of the aggregation as a single element in the result sequence. The specified seed value is used as the initial accumulator value.
	  * For aggregation behavior with incremental intermediate results, see Observable.scan.
	  * @param {Function} accumulator An accumulator function to be invoked on each element.
	  * @param {Any} [seed] The initial accumulator value.
	  * @returns {Observable} An observable sequence containing a single element with the final accumulator value.
	  */observableProto.reduce=function(){var hasSeed=false,seed,accumulator=arguments[0];if(arguments.length===2){hasSeed=true;seed=arguments[1];}return new ReduceObservable(this,accumulator,hasSeed,seed);};var SomeObservable=function(__super__){inherits(SomeObservable,__super__);function SomeObservable(source,fn){this.source=source;this._fn=fn;__super__.call(this);}SomeObservable.prototype.subscribeCore=function(o){return this.source.subscribe(new SomeObserver(o,this._fn,this.source));};return SomeObservable;}(ObservableBase);var SomeObserver=function(__super__){inherits(SomeObserver,__super__);function SomeObserver(o,fn,s){this._o=o;this._fn=fn;this._s=s;this._i=0;__super__.call(this);}SomeObserver.prototype.next=function(x){var result=tryCatch(this._fn)(x,this._i++,this._s);if(result===errorObj){return this._o.onError(result.e);}if(Boolean(result)){this._o.onNext(true);this._o.onCompleted();}};SomeObserver.prototype.error=function(e){this._o.onError(e);};SomeObserver.prototype.completed=function(){this._o.onNext(false);this._o.onCompleted();};return SomeObserver;}(AbstractObserver); /**
	   * Determines whether any element of an observable sequence satisfies a condition if present, else if any items are in the sequence.
	   * @param {Function} [predicate] A function to test each element for a condition.
	   * @returns {Observable} An observable sequence containing a single element determining whether any elements in the source sequence pass the test in the specified predicate if given, else if any items are in the sequence.
	   */observableProto.some=function(predicate,thisArg){var fn=bindCallback(predicate,thisArg,3);return new SomeObservable(this,fn);};var IsEmptyObservable=function(__super__){inherits(IsEmptyObservable,__super__);function IsEmptyObservable(source){this.source=source;__super__.call(this);}IsEmptyObservable.prototype.subscribeCore=function(o){return this.source.subscribe(new IsEmptyObserver(o));};return IsEmptyObservable;}(ObservableBase);var IsEmptyObserver=function(__super__){inherits(IsEmptyObserver,__super__);function IsEmptyObserver(o){this._o=o;__super__.call(this);}IsEmptyObserver.prototype.next=function(){this._o.onNext(false);this._o.onCompleted();};IsEmptyObserver.prototype.error=function(e){this._o.onError(e);};IsEmptyObserver.prototype.completed=function(){this._o.onNext(true);this._o.onCompleted();};return IsEmptyObserver;}(AbstractObserver); /**
	   * Determines whether an observable sequence is empty.
	   * @returns {Observable} An observable sequence containing a single element determining whether the source sequence is empty.
	   */observableProto.isEmpty=function(){return new IsEmptyObservable(this);};var EveryObservable=function(__super__){inherits(EveryObservable,__super__);function EveryObservable(source,fn){this.source=source;this._fn=fn;__super__.call(this);}EveryObservable.prototype.subscribeCore=function(o){return this.source.subscribe(new EveryObserver(o,this._fn,this.source));};return EveryObservable;}(ObservableBase);var EveryObserver=function(__super__){inherits(EveryObserver,__super__);function EveryObserver(o,fn,s){this._o=o;this._fn=fn;this._s=s;this._i=0;__super__.call(this);}EveryObserver.prototype.next=function(x){var result=tryCatch(this._fn)(x,this._i++,this._s);if(result===errorObj){return this._o.onError(result.e);}if(!Boolean(result)){this._o.onNext(false);this._o.onCompleted();}};EveryObserver.prototype.error=function(e){this._o.onError(e);};EveryObserver.prototype.completed=function(){this._o.onNext(true);this._o.onCompleted();};return EveryObserver;}(AbstractObserver); /**
	   * Determines whether all elements of an observable sequence satisfy a condition.
	   * @param {Function} [predicate] A function to test each element for a condition.
	   * @param {Any} [thisArg] Object to use as this when executing callback.
	   * @returns {Observable} An observable sequence containing a single element determining whether all elements in the source sequence pass the test in the specified predicate.
	   */observableProto.every=function(predicate,thisArg){var fn=bindCallback(predicate,thisArg,3);return new EveryObservable(this,fn);};var IncludesObservable=function(__super__){inherits(IncludesObservable,__super__);function IncludesObservable(source,elem,idx){var n=+idx||0;Math.abs(n)===Infinity&&(n=0);this.source=source;this._elem=elem;this._n=n;__super__.call(this);}IncludesObservable.prototype.subscribeCore=function(o){if(this._n<0){o.onNext(false);o.onCompleted();return disposableEmpty;}return this.source.subscribe(new IncludesObserver(o,this._elem,this._n));};return IncludesObservable;}(ObservableBase);var IncludesObserver=function(__super__){inherits(IncludesObserver,__super__);function IncludesObserver(o,elem,n){this._o=o;this._elem=elem;this._n=n;this._i=0;__super__.call(this);}function comparer(a,b){return a===0&&b===0||a===b||isNaN(a)&&isNaN(b);}IncludesObserver.prototype.next=function(x){if(this._i++>=this._n&&comparer(x,this._elem)){this._o.onNext(true);this._o.onCompleted();}};IncludesObserver.prototype.error=function(e){this._o.onError(e);};IncludesObserver.prototype.completed=function(){this._o.onNext(false);this._o.onCompleted();};return IncludesObserver;}(AbstractObserver); /**
	   * Determines whether an observable sequence includes a specified element with an optional equality comparer.
	   * @param searchElement The value to locate in the source sequence.
	   * @param {Number} [fromIndex] An equality comparer to compare elements.
	   * @returns {Observable} An observable sequence containing a single element determining whether the source sequence includes an element that has the specified value from the given index.
	   */observableProto.includes=function(searchElement,fromIndex){return new IncludesObservable(this,searchElement,fromIndex);};var CountObservable=function(__super__){inherits(CountObservable,__super__);function CountObservable(source,fn){this.source=source;this._fn=fn;__super__.call(this);}CountObservable.prototype.subscribeCore=function(o){return this.source.subscribe(new CountObserver(o,this._fn,this.source));};return CountObservable;}(ObservableBase);var CountObserver=function(__super__){inherits(CountObserver,__super__);function CountObserver(o,fn,s){this._o=o;this._fn=fn;this._s=s;this._i=0;this._c=0;__super__.call(this);}CountObserver.prototype.next=function(x){if(this._fn){var result=tryCatch(this._fn)(x,this._i++,this._s);if(result===errorObj){return this._o.onError(result.e);}Boolean(result)&&this._c++;}else {this._c++;}};CountObserver.prototype.error=function(e){this._o.onError(e);};CountObserver.prototype.completed=function(){this._o.onNext(this._c);this._o.onCompleted();};return CountObserver;}(AbstractObserver); /**
	   * Returns an observable sequence containing a value that represents how many elements in the specified observable sequence satisfy a condition if provided, else the count of items.
	   * @example
	   * res = source.count();
	   * res = source.count(function (x) { return x > 3; });
	   * @param {Function} [predicate]A function to test each element for a condition.
	   * @param {Any} [thisArg] Object to use as this when executing callback.
	   * @returns {Observable} An observable sequence containing a single element with a number that represents how many elements in the input sequence satisfy the condition in the predicate function if provided, else the count of items in the sequence.
	   */observableProto.count=function(predicate,thisArg){var fn=bindCallback(predicate,thisArg,3);return new CountObservable(this,fn);};var IndexOfObservable=function(__super__){inherits(IndexOfObservable,__super__);function IndexOfObservable(source,e,n){this.source=source;this._e=e;this._n=n;__super__.call(this);}IndexOfObservable.prototype.subscribeCore=function(o){if(this._n<0){o.onNext(-1);o.onCompleted();return disposableEmpty;}return this.source.subscribe(new IndexOfObserver(o,this._e,this._n));};return IndexOfObservable;}(ObservableBase);var IndexOfObserver=function(__super__){inherits(IndexOfObserver,__super__);function IndexOfObserver(o,e,n){this._o=o;this._e=e;this._n=n;this._i=0;__super__.call(this);}IndexOfObserver.prototype.next=function(x){if(this._i>=this._n&&x===this._e){this._o.onNext(this._i);this._o.onCompleted();}this._i++;};IndexOfObserver.prototype.error=function(e){this._o.onError(e);};IndexOfObserver.prototype.completed=function(){this._o.onNext(-1);this._o.onCompleted();};return IndexOfObserver;}(AbstractObserver); /**
	   * Returns the first index at which a given element can be found in the observable sequence, or -1 if it is not present.
	   * @param {Any} searchElement Element to locate in the array.
	   * @param {Number} [fromIndex] The index to start the search.  If not specified, defaults to 0.
	   * @returns {Observable} And observable sequence containing the first index at which a given element can be found in the observable sequence, or -1 if it is not present.
	   */observableProto.indexOf=function(searchElement,fromIndex){var n=+fromIndex||0;Math.abs(n)===Infinity&&(n=0);return new IndexOfObservable(this,searchElement,n);};var SumObservable=function(__super__){inherits(SumObservable,__super__);function SumObservable(source,fn){this.source=source;this._fn=fn;__super__.call(this);}SumObservable.prototype.subscribeCore=function(o){return this.source.subscribe(new SumObserver(o,this._fn,this.source));};return SumObservable;}(ObservableBase);var SumObserver=function(__super__){inherits(SumObserver,__super__);function SumObserver(o,fn,s){this._o=o;this._fn=fn;this._s=s;this._i=0;this._c=0;__super__.call(this);}SumObserver.prototype.next=function(x){if(this._fn){var result=tryCatch(this._fn)(x,this._i++,this._s);if(result===errorObj){return this._o.onError(result.e);}this._c+=result;}else {this._c+=x;}};SumObserver.prototype.error=function(e){this._o.onError(e);};SumObserver.prototype.completed=function(){this._o.onNext(this._c);this._o.onCompleted();};return SumObserver;}(AbstractObserver); /**
	   * Computes the sum of a sequence of values that are obtained by invoking an optional transform function on each element of the input sequence, else if not specified computes the sum on each item in the sequence.
	   * @param {Function} [selector] A transform function to apply to each element.
	   * @param {Any} [thisArg] Object to use as this when executing callback.
	   * @returns {Observable} An observable sequence containing a single element with the sum of the values in the source sequence.
	   */observableProto.sum=function(keySelector,thisArg){var fn=bindCallback(keySelector,thisArg,3);return new SumObservable(this,fn);}; /**
	   * Returns the elements in an observable sequence with the minimum key value according to the specified comparer.
	   * @example
	   * var res = source.minBy(function (x) { return x.value; });
	   * var res = source.minBy(function (x) { return x.value; }, function (x, y) { return x - y; });
	   * @param {Function} keySelector Key selector function.
	   * @param {Function} [comparer] Comparer used to compare key values.
	   * @returns {Observable} An observable sequence containing a list of zero or more elements that have a minimum key value.
	   */observableProto.minBy=function(keySelector,comparer){comparer||(comparer=defaultSubComparer);return new ExtremaByObservable(this,keySelector,function(x,y){return comparer(x,y)*-1;});}; /**
	   * Returns the minimum element in an observable sequence according to the optional comparer else a default greater than less than check.
	   * @example
	   * var res = source.min();
	   * var res = source.min(function (x, y) { return x.value - y.value; });
	   * @param {Function} [comparer] Comparer used to compare elements.
	   * @returns {Observable} An observable sequence containing a single element with the minimum element in the source sequence.
	   */observableProto.min=function(comparer){return this.minBy(identity,comparer).map(firstOnly);}; /**
	   * Returns the elements in an observable sequence with the maximum  key value according to the specified comparer.
	   * @example
	   * var res = source.maxBy(function (x) { return x.value; });
	   * var res = source.maxBy(function (x) { return x.value; }, function (x, y) { return x - y;; });
	   * @param {Function} keySelector Key selector function.
	   * @param {Function} [comparer]  Comparer used to compare key values.
	   * @returns {Observable} An observable sequence containing a list of zero or more elements that have a maximum key value.
	   */observableProto.maxBy=function(keySelector,comparer){comparer||(comparer=defaultSubComparer);return new ExtremaByObservable(this,keySelector,comparer);}; /**
	   * Returns the maximum value in an observable sequence according to the specified comparer.
	   * @example
	   * var res = source.max();
	   * var res = source.max(function (x, y) { return x.value - y.value; });
	   * @param {Function} [comparer] Comparer used to compare elements.
	   * @returns {Observable} An observable sequence containing a single element with the maximum element in the source sequence.
	   */observableProto.max=function(comparer){return this.maxBy(identity,comparer).map(firstOnly);};var AverageObservable=function(__super__){inherits(AverageObservable,__super__);function AverageObservable(source,fn){this.source=source;this._fn=fn;__super__.call(this);}AverageObservable.prototype.subscribeCore=function(o){return this.source.subscribe(new AverageObserver(o,this._fn,this.source));};return AverageObservable;}(ObservableBase);var AverageObserver=function(__super__){inherits(AverageObserver,__super__);function AverageObserver(o,fn,s){this._o=o;this._fn=fn;this._s=s;this._c=0;this._t=0;__super__.call(this);}AverageObserver.prototype.next=function(x){if(this._fn){var r=tryCatch(this._fn)(x,this._c++,this._s);if(r===errorObj){return this._o.onError(r.e);}this._t+=r;}else {this._c++;this._t+=x;}};AverageObserver.prototype.error=function(e){this._o.onError(e);};AverageObserver.prototype.completed=function(){if(this._c===0){return this._o.onError(new EmptyError());}this._o.onNext(this._t/this._c);this._o.onCompleted();};return AverageObserver;}(AbstractObserver); /**
	   * Computes the average of an observable sequence of values that are in the sequence or obtained by invoking a transform function on each element of the input sequence if present.
	   * @param {Function} [selector] A transform function to apply to each element.
	   * @param {Any} [thisArg] Object to use as this when executing callback.
	   * @returns {Observable} An observable sequence containing a single element with the average of the sequence of values.
	   */observableProto.average=function(keySelector,thisArg){var source=this,fn;if(isFunction(keySelector)){fn=bindCallback(keySelector,thisArg,3);}return new AverageObservable(source,fn);}; /**
	   *  Determines whether two sequences are equal by comparing the elements pairwise using a specified equality comparer.
	   *
	   * @example
	   * var res = res = source.sequenceEqual([1,2,3]);
	   * var res = res = source.sequenceEqual([{ value: 42 }], function (x, y) { return x.value === y.value; });
	   * 3 - res = source.sequenceEqual(Rx.Observable.returnValue(42));
	   * 4 - res = source.sequenceEqual(Rx.Observable.returnValue({ value: 42 }), function (x, y) { return x.value === y.value; });
	   * @param {Observable} second Second observable sequence or array to compare.
	   * @param {Function} [comparer] Comparer used to compare elements of both sequences.
	   * @returns {Observable} An observable sequence that contains a single element which indicates whether both sequences are of equal length and their corresponding elements are equal according to the specified equality comparer.
	   */observableProto.sequenceEqual=function(second,comparer){var first=this;comparer||(comparer=defaultComparer);return new AnonymousObservable(function(o){var donel=false,doner=false,ql=[],qr=[];var subscription1=first.subscribe(function(x){if(qr.length>0){var v=qr.shift();var equal=tryCatch(comparer)(v,x);if(equal===errorObj){return o.onError(equal.e);}if(!equal){o.onNext(false);o.onCompleted();}}else if(doner){o.onNext(false);o.onCompleted();}else {ql.push(x);}},function(e){o.onError(e);},function(){donel=true;if(ql.length===0){if(qr.length>0){o.onNext(false);o.onCompleted();}else if(doner){o.onNext(true);o.onCompleted();}}});(isArrayLike(second)||isIterable(second))&&(second=observableFrom(second));isPromise(second)&&(second=observableFromPromise(second));var subscription2=second.subscribe(function(x){if(ql.length>0){var v=ql.shift();var equal=tryCatch(comparer)(v,x);if(equal===errorObj){return o.onError(equal.e);}if(!equal){o.onNext(false);o.onCompleted();}}else if(donel){o.onNext(false);o.onCompleted();}else {qr.push(x);}},function(e){o.onError(e);},function(){doner=true;if(qr.length===0){if(ql.length>0){o.onNext(false);o.onCompleted();}else if(donel){o.onNext(true);o.onCompleted();}}});return new BinaryDisposable(subscription1,subscription2);},first);};var ElementAtObservable=function(__super__){inherits(ElementAtObservable,__super__);function ElementAtObservable(source,i,d){this.source=source;this._i=i;this._d=d;__super__.call(this);}ElementAtObservable.prototype.subscribeCore=function(o){return this.source.subscribe(new ElementAtObserver(o,this._i,this._d));};return ElementAtObservable;}(ObservableBase);var ElementAtObserver=function(__super__){inherits(ElementAtObserver,__super__);function ElementAtObserver(o,i,d){this._o=o;this._i=i;this._d=d;__super__.call(this);}ElementAtObserver.prototype.next=function(x){if(this._i--===0){this._o.onNext(x);this._o.onCompleted();}};ElementAtObserver.prototype.error=function(e){this._o.onError(e);};ElementAtObserver.prototype.completed=function(){if(this._d===undefined){this._o.onError(new ArgumentOutOfRangeError());}else {this._o.onNext(this._d);this._o.onCompleted();}};return ElementAtObserver;}(AbstractObserver); /**
	   * Returns the element at a specified index in a sequence or default value if not found.
	   * @param {Number} index The zero-based index of the element to retrieve.
	   * @param {Any} [defaultValue] The default value to use if elementAt does not find a value.
	   * @returns {Observable} An observable sequence that produces the element at the specified position in the source sequence.
	   */observableProto.elementAt=function(index,defaultValue){if(index<0){throw new ArgumentOutOfRangeError();}return new ElementAtObservable(this,index,defaultValue);};var SingleObserver=function(__super__){inherits(SingleObserver,__super__);function SingleObserver(o,obj,s){this._o=o;this._obj=obj;this._s=s;this._i=0;this._hv=false;this._v=null;__super__.call(this);}SingleObserver.prototype.next=function(x){var shouldYield=false;if(this._obj.predicate){var res=tryCatch(this._obj.predicate)(x,this._i++,this._s);if(res===errorObj){return this._o.onError(res.e);}Boolean(res)&&(shouldYield=true);}else if(!this._obj.predicate){shouldYield=true;}if(shouldYield){if(this._hv){return this._o.onError(new Error('Sequence contains more than one matching element'));}this._hv=true;this._v=x;}};SingleObserver.prototype.error=function(e){this._o.onError(e);};SingleObserver.prototype.completed=function(){if(this._hv){this._o.onNext(this._v);this._o.onCompleted();}else if(this._obj.defaultValue===undefined){this._o.onError(new EmptyError());}else {this._o.onNext(this._obj.defaultValue);this._o.onCompleted();}};return SingleObserver;}(AbstractObserver); /**
	     * Returns the only element of an observable sequence that satisfies the condition in the optional predicate, and reports an exception if there is not exactly one element in the observable sequence.
	     * @returns {Observable} Sequence containing the single element in the observable sequence that satisfies the condition in the predicate.
	     */observableProto.single=function(predicate,thisArg){var obj={},source=this;if(_typeof(arguments[0])==='object'){obj=arguments[0];}else {obj={predicate:arguments[0],thisArg:arguments[1],defaultValue:arguments[2]};}if(isFunction(obj.predicate)){var fn=obj.predicate;obj.predicate=bindCallback(fn,obj.thisArg,3);}return new AnonymousObservable(function(o){return source.subscribe(new SingleObserver(o,obj,source));},source);};var FirstObservable=function(__super__){inherits(FirstObservable,__super__);function FirstObservable(source,obj){this.source=source;this._obj=obj;__super__.call(this);}FirstObservable.prototype.subscribeCore=function(o){return this.source.subscribe(new FirstObserver(o,this._obj,this.source));};return FirstObservable;}(ObservableBase);var FirstObserver=function(__super__){inherits(FirstObserver,__super__);function FirstObserver(o,obj,s){this._o=o;this._obj=obj;this._s=s;this._i=0;__super__.call(this);}FirstObserver.prototype.next=function(x){if(this._obj.predicate){var res=tryCatch(this._obj.predicate)(x,this._i++,this._s);if(res===errorObj){return this._o.onError(res.e);}if(Boolean(res)){this._o.onNext(x);this._o.onCompleted();}}else if(!this._obj.predicate){this._o.onNext(x);this._o.onCompleted();}};FirstObserver.prototype.error=function(e){this._o.onError(e);};FirstObserver.prototype.completed=function(){if(this._obj.defaultValue===undefined){this._o.onError(new EmptyError());}else {this._o.onNext(this._obj.defaultValue);this._o.onCompleted();}};return FirstObserver;}(AbstractObserver); /**
	   * Returns the first element of an observable sequence that satisfies the condition in the predicate if present else the first item in the sequence.
	   * @returns {Observable} Sequence containing the first element in the observable sequence that satisfies the condition in the predicate if provided, else the first item in the sequence.
	   */observableProto.first=function(){var obj={},source=this;if(_typeof(arguments[0])==='object'){obj=arguments[0];}else {obj={predicate:arguments[0],thisArg:arguments[1],defaultValue:arguments[2]};}if(isFunction(obj.predicate)){var fn=obj.predicate;obj.predicate=bindCallback(fn,obj.thisArg,3);}return new FirstObservable(this,obj);};var LastObservable=function(__super__){inherits(LastObservable,__super__);function LastObservable(source,obj){this.source=source;this._obj=obj;__super__.call(this);}LastObservable.prototype.subscribeCore=function(o){return this.source.subscribe(new LastObserver(o,this._obj,this.source));};return LastObservable;}(ObservableBase);var LastObserver=function(__super__){inherits(LastObserver,__super__);function LastObserver(o,obj,s){this._o=o;this._obj=obj;this._s=s;this._i=0;this._hv=false;this._v=null;__super__.call(this);}LastObserver.prototype.next=function(x){var shouldYield=false;if(this._obj.predicate){var res=tryCatch(this._obj.predicate)(x,this._i++,this._s);if(res===errorObj){return this._o.onError(res.e);}Boolean(res)&&(shouldYield=true);}else if(!this._obj.predicate){shouldYield=true;}if(shouldYield){this._hv=true;this._v=x;}};LastObserver.prototype.error=function(e){this._o.onError(e);};LastObserver.prototype.completed=function(){if(this._hv){this._o.onNext(this._v);this._o.onCompleted();}else if(this._obj.defaultValue===undefined){this._o.onError(new EmptyError());}else {this._o.onNext(this._obj.defaultValue);this._o.onCompleted();}};return LastObserver;}(AbstractObserver); /**
	   * Returns the last element of an observable sequence that satisfies the condition in the predicate if specified, else the last element.
	   * @returns {Observable} Sequence containing the last element in the observable sequence that satisfies the condition in the predicate.
	   */observableProto.last=function(){var obj={},source=this;if(_typeof(arguments[0])==='object'){obj=arguments[0];}else {obj={predicate:arguments[0],thisArg:arguments[1],defaultValue:arguments[2]};}if(isFunction(obj.predicate)){var fn=obj.predicate;obj.predicate=bindCallback(fn,obj.thisArg,3);}return new LastObservable(this,obj);};var FindValueObserver=function(__super__){inherits(FindValueObserver,__super__);function FindValueObserver(observer,source,callback,yieldIndex){this._o=observer;this._s=source;this._cb=callback;this._y=yieldIndex;this._i=0;__super__.call(this);}FindValueObserver.prototype.next=function(x){var shouldRun=tryCatch(this._cb)(x,this._i,this._s);if(shouldRun===errorObj){return this._o.onError(shouldRun.e);}if(shouldRun){this._o.onNext(this._y?this._i:x);this._o.onCompleted();}else {this._i++;}};FindValueObserver.prototype.error=function(e){this._o.onError(e);};FindValueObserver.prototype.completed=function(){this._y&&this._o.onNext(-1);this._o.onCompleted();};return FindValueObserver;}(AbstractObserver);function findValue(source,predicate,thisArg,yieldIndex){var callback=bindCallback(predicate,thisArg,3);return new AnonymousObservable(function(o){return source.subscribe(new FindValueObserver(o,source,callback,yieldIndex));},source);} /**
	   * Searches for an element that matches the conditions defined by the specified predicate, and returns the first occurrence within the entire Observable sequence.
	   * @param {Function} predicate The predicate that defines the conditions of the element to search for.
	   * @param {Any} [thisArg] Object to use as `this` when executing the predicate.
	   * @returns {Observable} An Observable sequence with the first element that matches the conditions defined by the specified predicate, if found; otherwise, undefined.
	   */observableProto.find=function(predicate,thisArg){return findValue(this,predicate,thisArg,false);}; /**
	   * Searches for an element that matches the conditions defined by the specified predicate, and returns
	   * an Observable sequence with the zero-based index of the first occurrence within the entire Observable sequence.
	   * @param {Function} predicate The predicate that defines the conditions of the element to search for.
	   * @param {Any} [thisArg] Object to use as `this` when executing the predicate.
	   * @returns {Observable} An Observable sequence with the zero-based index of the first occurrence of an element that matches the conditions defined by match, if found; otherwise, –1.
	  */observableProto.findIndex=function(predicate,thisArg){return findValue(this,predicate,thisArg,true);};var ToSetObservable=function(__super__){inherits(ToSetObservable,__super__);function ToSetObservable(source){this.source=source;__super__.call(this);}ToSetObservable.prototype.subscribeCore=function(o){return this.source.subscribe(new ToSetObserver(o));};return ToSetObservable;}(ObservableBase);var ToSetObserver=function(__super__){inherits(ToSetObserver,__super__);function ToSetObserver(o){this._o=o;this._s=new root.Set();__super__.call(this);}ToSetObserver.prototype.next=function(x){this._s.add(x);};ToSetObserver.prototype.error=function(e){this._o.onError(e);};ToSetObserver.prototype.completed=function(){this._o.onNext(this._s);this._o.onCompleted();};return ToSetObserver;}(AbstractObserver); /**
	   * Converts the observable sequence to a Set if it exists.
	   * @returns {Observable} An observable sequence with a single value of a Set containing the values from the observable sequence.
	   */observableProto.toSet=function(){if(typeof root.Set==='undefined'){throw new TypeError();}return new ToSetObservable(this);};var ToMapObservable=function(__super__){inherits(ToMapObservable,__super__);function ToMapObservable(source,k,e){this.source=source;this._k=k;this._e=e;__super__.call(this);}ToMapObservable.prototype.subscribeCore=function(o){return this.source.subscribe(new ToMapObserver(o,this._k,this._e));};return ToMapObservable;}(ObservableBase);var ToMapObserver=function(__super__){inherits(ToMapObserver,__super__);function ToMapObserver(o,k,e){this._o=o;this._k=k;this._e=e;this._m=new root.Map();__super__.call(this);}ToMapObserver.prototype.next=function(x){var key=tryCatch(this._k)(x);if(key===errorObj){return this._o.onError(key.e);}var elem=x;if(this._e){elem=tryCatch(this._e)(x);if(elem===errorObj){return this._o.onError(elem.e);}}this._m.set(key,elem);};ToMapObserver.prototype.error=function(e){this._o.onError(e);};ToMapObserver.prototype.completed=function(){this._o.onNext(this._m);this._o.onCompleted();};return ToMapObserver;}(AbstractObserver); /**
	  * Converts the observable sequence to a Map if it exists.
	  * @param {Function} keySelector A function which produces the key for the Map.
	  * @param {Function} [elementSelector] An optional function which produces the element for the Map. If not present, defaults to the value from the observable sequence.
	  * @returns {Observable} An observable sequence with a single value of a Map containing the values from the observable sequence.
	  */observableProto.toMap=function(keySelector,elementSelector){if(typeof root.Map==='undefined'){throw new TypeError();}return new ToMapObservable(this,keySelector,elementSelector);};var SliceObservable=function(__super__){inherits(SliceObservable,__super__);function SliceObservable(source,b,e){this.source=source;this._b=b;this._e=e;__super__.call(this);}SliceObservable.prototype.subscribeCore=function(o){return this.source.subscribe(new SliceObserver(o,this._b,this._e));};return SliceObservable;}(ObservableBase);var SliceObserver=function(__super__){inherits(SliceObserver,__super__);function SliceObserver(o,b,e){this._o=o;this._b=b;this._e=e;this._i=0;__super__.call(this);}SliceObserver.prototype.next=function(x){if(this._i>=this._b){if(this._e===this._i){this._o.onCompleted();}else {this._o.onNext(x);}}this._i++;};SliceObserver.prototype.error=function(e){this._o.onError(e);};SliceObserver.prototype.completed=function(){this._o.onCompleted();};return SliceObserver;}(AbstractObserver); /*
	  * The slice() method returns a shallow copy of a portion of an Observable into a new Observable object.
	  * Unlike the array version, this does not support negative numbers for being or end.
	  * @param {Number} [begin] Zero-based index at which to begin extraction. If omitted, this will default to zero.
	  * @param {Number} [end] Zero-based index at which to end extraction. slice extracts up to but not including end.
	  * If omitted, this will emit the rest of the Observable object.
	  * @returns {Observable} A shallow copy of a portion of an Observable into a new Observable object.
	  */observableProto.slice=function(begin,end){var start=begin||0;if(start<0){throw new Rx.ArgumentOutOfRangeError();}if(typeof end==='number'&&end<start){throw new Rx.ArgumentOutOfRangeError();}return new SliceObservable(this,start,end);};var LastIndexOfObservable=function(__super__){inherits(LastIndexOfObservable,__super__);function LastIndexOfObservable(source,e,n){this.source=source;this._e=e;this._n=n;__super__.call(this);}LastIndexOfObservable.prototype.subscribeCore=function(o){if(this._n<0){o.onNext(-1);o.onCompleted();return disposableEmpty;}return this.source.subscribe(new LastIndexOfObserver(o,this._e,this._n));};return LastIndexOfObservable;}(ObservableBase);var LastIndexOfObserver=function(__super__){inherits(LastIndexOfObserver,__super__);function LastIndexOfObserver(o,e,n){this._o=o;this._e=e;this._n=n;this._v=0;this._hv=false;this._i=0;__super__.call(this);}LastIndexOfObserver.prototype.next=function(x){if(this._i>=this._n&&x===this._e){this._hv=true;this._v=this._i;}this._i++;};LastIndexOfObserver.prototype.error=function(e){this._o.onError(e);};LastIndexOfObserver.prototype.completed=function(){if(this._hv){this._o.onNext(this._v);}else {this._o.onNext(-1);}this._o.onCompleted();};return LastIndexOfObserver;}(AbstractObserver); /**
	   * Returns the last index at which a given element can be found in the observable sequence, or -1 if it is not present.
	   * @param {Any} searchElement Element to locate in the array.
	   * @param {Number} [fromIndex] The index to start the search.  If not specified, defaults to 0.
	   * @returns {Observable} And observable sequence containing the last index at which a given element can be found in the observable sequence, or -1 if it is not present.
	   */observableProto.lastIndexOf=function(searchElement,fromIndex){var n=+fromIndex||0;Math.abs(n)===Infinity&&(n=0);return new LastIndexOfObservable(this,searchElement,n);};Observable.wrap=function(fn){function createObservable(){return Observable.spawn.call(this,fn.apply(this,arguments));}createObservable.__generatorFunction__=fn;return createObservable;};var spawn=Observable.spawn=function(){var gen=arguments[0],self=this,args=[];for(var i=1,len=arguments.length;i<len;i++){args.push(arguments[i]);}return new AnonymousObservable(function(o){var g=new CompositeDisposable();if(isFunction(gen)){gen=gen.apply(self,args);}if(!gen||!isFunction(gen.next)){o.onNext(gen);return o.onCompleted();}function processGenerator(res){var ret=tryCatch(gen.next).call(gen,res);if(ret===errorObj){return o.onError(ret.e);}next(ret);}processGenerator();function onError(err){var ret=tryCatch(gen.next).call(gen,err);if(ret===errorObj){return o.onError(ret.e);}next(ret);}function next(ret){if(ret.done){o.onNext(ret.value);o.onCompleted();return;}var obs=toObservable.call(self,ret.value);var value=null;var hasValue=false;if(Observable.isObservable(obs)){g.add(obs.subscribe(function(val){hasValue=true;value=val;},onError,function(){hasValue&&processGenerator(value);}));}else {onError(new TypeError('type not supported'));}}return g;});};function toObservable(obj){if(!obj){return obj;}if(Observable.isObservable(obj)){return obj;}if(isPromise(obj)){return Observable.fromPromise(obj);}if(isGeneratorFunction(obj)||isGenerator(obj)){return spawn.call(this,obj);}if(isFunction(obj)){return thunkToObservable.call(this,obj);}if(isArrayLike(obj)||isIterable(obj)){return arrayToObservable.call(this,obj);}if(isObject(obj)){return objectToObservable.call(this,obj);}return obj;}function arrayToObservable(obj){return Observable.from(obj).concatMap(function(o){if(Observable.isObservable(o)||isObject(o)){return toObservable.call(null,o);}else {return Rx.Observable.just(o);}}).toArray();}function objectToObservable(obj){var results=new obj.constructor(),keys=Object.keys(obj),observables=[];for(var i=0,len=keys.length;i<len;i++){var key=keys[i];var observable=toObservable.call(this,obj[key]);if(observable&&Observable.isObservable(observable)){defer(observable,key);}else {results[key]=obj[key];}}return Observable.forkJoin.apply(Observable,observables).map(function(){return results;});function defer(observable,key){results[key]=undefined;observables.push(observable.map(function(next){results[key]=next;}));}}function thunkToObservable(fn){var self=this;return new AnonymousObservable(function(o){fn.call(self,function(){var err=arguments[0],res=arguments[1];if(err){return o.onError(err);}if(arguments.length>2){var args=[];for(var i=1,len=arguments.length;i<len;i++){args.push(arguments[i]);}res=args;}o.onNext(res);o.onCompleted();});});}function isGenerator(obj){return isFunction(obj.next)&&isFunction(obj['throw']);}function isGeneratorFunction(obj){var ctor=obj.constructor;if(!ctor){return false;}if(ctor.name==='GeneratorFunction'||ctor.displayName==='GeneratorFunction'){return true;}return isGenerator(ctor.prototype);}function isObject(val){return Object==val.constructor;} /**
	   * Invokes the specified function asynchronously on the specified scheduler, surfacing the result through an observable sequence.
	   *
	   * @example
	   * var res = Rx.Observable.start(function () { console.log('hello'); });
	   * var res = Rx.Observable.start(function () { console.log('hello'); }, Rx.Scheduler.timeout);
	   * var res = Rx.Observable.start(function () { this.log('hello'); }, Rx.Scheduler.timeout, console);
	   *
	   * @param {Function} func Function to run asynchronously.
	   * @param {Scheduler} [scheduler]  Scheduler to run the function on. If not specified, defaults to Scheduler.timeout.
	   * @param [context]  The context for the func parameter to be executed.  If not specified, defaults to undefined.
	   * @returns {Observable} An observable sequence exposing the function's result value, or an exception.
	   *
	   * Remarks
	   * * The function is called immediately, not during the subscription of the resulting sequence.
	   * * Multiple subscriptions to the resulting sequence can observe the function's result.
	   */Observable.start=function(func,context,scheduler){return observableToAsync(func,context,scheduler)();}; /**
	   * Converts the function into an asynchronous function. Each invocation of the resulting asynchronous function causes an invocation of the original synchronous function on the specified scheduler.
	   * @param {Function} function Function to convert to an asynchronous function.
	   * @param {Scheduler} [scheduler] Scheduler to run the function on. If not specified, defaults to Scheduler.timeout.
	   * @param {Mixed} [context] The context for the func parameter to be executed.  If not specified, defaults to undefined.
	   * @returns {Function} Asynchronous function.
	   */var observableToAsync=Observable.toAsync=function(func,context,scheduler){isScheduler(scheduler)||(scheduler=defaultScheduler);return function(){var args=arguments,subject=new AsyncSubject();scheduler.schedule(null,function(){var result;try{result=func.apply(context,args);}catch(e){subject.onError(e);return;}subject.onNext(result);subject.onCompleted();});return subject.asObservable();};};function createCbObservable(fn,ctx,selector,args){var o=new AsyncSubject();args.push(createCbHandler(o,ctx,selector));fn.apply(ctx,args);return o.asObservable();}function createCbHandler(o,ctx,selector){return function handler(){var len=arguments.length,results=new Array(len);for(var i=0;i<len;i++){results[i]=arguments[i];}if(isFunction(selector)){results=tryCatch(selector).apply(ctx,results);if(results===errorObj){return o.onError(results.e);}o.onNext(results);}else {if(results.length<=1){o.onNext(results[0]);}else {o.onNext(results);}}o.onCompleted();};} /**
	 * Converts a callback function to an observable sequence.
	 *
	 * @param {Function} fn Function with a callback as the last parameter to convert to an Observable sequence.
	 * @param {Mixed} [ctx] The context for the func parameter to be executed.  If not specified, defaults to undefined.
	 * @param {Function} [selector] A selector which takes the arguments from the callback to produce a single item to yield on next.
	 * @returns {Function} A function, when executed with the required parameters minus the callback, produces an Observable sequence with a single value of the arguments to the callback as an array.
	 */Observable.fromCallback=function(fn,ctx,selector){return function(){typeof ctx==='undefined'&&(ctx=this);var len=arguments.length,args=new Array(len);for(var i=0;i<len;i++){args[i]=arguments[i];}return createCbObservable(fn,ctx,selector,args);};};function createNodeObservable(fn,ctx,selector,args){var o=new AsyncSubject();args.push(createNodeHandler(o,ctx,selector));fn.apply(ctx,args);return o.asObservable();}function createNodeHandler(o,ctx,selector){return function handler(){var err=arguments[0];if(err){return o.onError(err);}var len=arguments.length,results=[];for(var i=1;i<len;i++){results[i-1]=arguments[i];}if(isFunction(selector)){var results=tryCatch(selector).apply(ctx,results);if(results===errorObj){return o.onError(results.e);}o.onNext(results);}else {if(results.length<=1){o.onNext(results[0]);}else {o.onNext(results);}}o.onCompleted();};} /**
	 * Converts a Node.js callback style function to an observable sequence.  This must be in function (err, ...) format.
	 * @param {Function} fn The function to call
	 * @param {Mixed} [ctx] The context for the func parameter to be executed.  If not specified, defaults to undefined.
	 * @param {Function} [selector] A selector which takes the arguments from the callback minus the error to produce a single item to yield on next.
	 * @returns {Function} An async function which when applied, returns an observable sequence with the callback arguments as an array.
	 */Observable.fromNodeCallback=function(fn,ctx,selector){return function(){typeof ctx==='undefined'&&(ctx=this);var len=arguments.length,args=new Array(len);for(var i=0;i<len;i++){args[i]=arguments[i];}return createNodeObservable(fn,ctx,selector,args);};};function isNodeList(el){if(root.StaticNodeList){ // IE8 Specific
	// instanceof is slower than Object#toString, but Object#toString will not work as intended in IE8
	return el instanceof root.StaticNodeList||el instanceof root.NodeList;}else {return Object.prototype.toString.call(el)==='[object NodeList]';}}function ListenDisposable(e,n,fn){this._e=e;this._n=n;this._fn=fn;this._e.addEventListener(this._n,this._fn,false);this.isDisposed=false;}ListenDisposable.prototype.dispose=function(){if(!this.isDisposed){this._e.removeEventListener(this._n,this._fn,false);this.isDisposed=true;}};function createEventListener(el,eventName,handler){var disposables=new CompositeDisposable(); // Asume NodeList or HTMLCollection
	var elemToString=Object.prototype.toString.call(el);if(isNodeList(el)||elemToString==='[object HTMLCollection]'){for(var i=0,len=el.length;i<len;i++){disposables.add(createEventListener(el.item(i),eventName,handler));}}else if(el){disposables.add(new ListenDisposable(el,eventName,handler));}return disposables;} /**
	   * Configuration option to determine whether to use native events only
	   */Rx.config.useNativeEvents=false;var EventObservable=function(__super__){inherits(EventObservable,__super__);function EventObservable(el,name,fn){this._el=el;this._n=name;this._fn=fn;__super__.call(this);}function createHandler(o,fn){return function handler(){var results=arguments[0];if(isFunction(fn)){results=tryCatch(fn).apply(null,arguments);if(results===errorObj){return o.onError(results.e);}}o.onNext(results);};}EventObservable.prototype.subscribeCore=function(o){return createEventListener(this._el,this._n,createHandler(o,this._fn));};return EventObservable;}(ObservableBase); /**
	   * Creates an observable sequence by adding an event listener to the matching DOMElement or each item in the NodeList.
	   * @param {Object} element The DOMElement or NodeList to attach a listener.
	   * @param {String} eventName The event name to attach the observable sequence.
	   * @param {Function} [selector] A selector which takes the arguments from the event handler to produce a single item to yield on next.
	   * @returns {Observable} An observable sequence of events from the specified element and the specified event.
	   */Observable.fromEvent=function(element,eventName,selector){ // Node.js specific
	if(element.addListener){return fromEventPattern(function(h){element.addListener(eventName,h);},function(h){element.removeListener(eventName,h);},selector);} // Use only if non-native events are allowed
	if(!Rx.config.useNativeEvents){ // Handles jq, Angular.js, Zepto, Marionette, Ember.js
	if(typeof element.on==='function'&&typeof element.off==='function'){return fromEventPattern(function(h){element.on(eventName,h);},function(h){element.off(eventName,h);},selector);}}return new EventObservable(element,eventName,selector).publish().refCount();};var EventPatternObservable=function(__super__){inherits(EventPatternObservable,__super__);function EventPatternObservable(add,del,fn){this._add=add;this._del=del;this._fn=fn;__super__.call(this);}function createHandler(o,fn){return function handler(){var results=arguments[0];if(isFunction(fn)){results=tryCatch(fn).apply(null,arguments);if(results===errorObj){return o.onError(results.e);}}o.onNext(results);};}EventPatternObservable.prototype.subscribeCore=function(o){var fn=createHandler(o,this._fn);var returnValue=this._add(fn);return new EventPatternDisposable(this._del,fn,returnValue);};function EventPatternDisposable(del,fn,ret){this._del=del;this._fn=fn;this._ret=ret;this.isDisposed=false;}EventPatternDisposable.prototype.dispose=function(){if(!this.isDisposed){isFunction(this._del)&&this._del(this._fn,this._ret);this.isDisposed=true;}};return EventPatternObservable;}(ObservableBase); /**
	   * Creates an observable sequence from an event emitter via an addHandler/removeHandler pair.
	   * @param {Function} addHandler The function to add a handler to the emitter.
	   * @param {Function} [removeHandler] The optional function to remove a handler from an emitter.
	   * @param {Function} [selector] A selector which takes the arguments from the event handler to produce a single item to yield on next.
	   * @returns {Observable} An observable sequence which wraps an event from an event emitter
	   */var fromEventPattern=Observable.fromEventPattern=function(addHandler,removeHandler,selector){return new EventPatternObservable(addHandler,removeHandler,selector).publish().refCount();}; /**
	   * Invokes the asynchronous function, surfacing the result through an observable sequence.
	   * @param {Function} functionAsync Asynchronous function which returns a Promise to run.
	   * @returns {Observable} An observable sequence exposing the function's result value, or an exception.
	   */Observable.startAsync=function(functionAsync){var promise=tryCatch(functionAsync)();if(promise===errorObj){return observableThrow(promise.e);}return observableFromPromise(promise);};var PausableObservable=function(__super__){inherits(PausableObservable,__super__);function PausableObservable(source,pauser){this.source=source;this.controller=new Subject();if(pauser&&pauser.subscribe){this.pauser=this.controller.merge(pauser);}else {this.pauser=this.controller;}__super__.call(this);}PausableObservable.prototype._subscribe=function(o){var conn=this.source.publish(),subscription=conn.subscribe(o),connection=disposableEmpty;var pausable=this.pauser.distinctUntilChanged().subscribe(function(b){if(b){connection=conn.connect();}else {connection.dispose();connection=disposableEmpty;}});return new NAryDisposable([subscription,connection,pausable]);};PausableObservable.prototype.pause=function(){this.controller.onNext(false);};PausableObservable.prototype.resume=function(){this.controller.onNext(true);};return PausableObservable;}(Observable); /**
	   * Pauses the underlying observable sequence based upon the observable sequence which yields true/false.
	   * @example
	   * var pauser = new Rx.Subject();
	   * var source = Rx.Observable.interval(100).pausable(pauser);
	   * @param {Observable} pauser The observable sequence used to pause the underlying sequence.
	   * @returns {Observable} The observable sequence which is paused based upon the pauser.
	   */observableProto.pausable=function(pauser){return new PausableObservable(this,pauser);};function combineLatestSource(source,subject,resultSelector){return new AnonymousObservable(function(o){var hasValue=[false,false],hasValueAll=false,isDone=false,values=new Array(2),err;function next(x,i){values[i]=x;hasValue[i]=true;if(hasValueAll||(hasValueAll=hasValue.every(identity))){if(err){return o.onError(err);}var res=tryCatch(resultSelector).apply(null,values);if(res===errorObj){return o.onError(res.e);}o.onNext(res);}isDone&&values[1]&&o.onCompleted();}return new BinaryDisposable(source.subscribe(function(x){next(x,0);},function(e){if(values[1]){o.onError(e);}else {err=e;}},function(){isDone=true;values[1]&&o.onCompleted();}),subject.subscribe(function(x){next(x,1);},function(e){o.onError(e);},function(){isDone=true;next(true,1);}));},source);}var PausableBufferedObservable=function(__super__){inherits(PausableBufferedObservable,__super__);function PausableBufferedObservable(source,pauser){this.source=source;this.controller=new Subject();if(pauser&&pauser.subscribe){this.pauser=this.controller.merge(pauser);}else {this.pauser=this.controller;}__super__.call(this);}PausableBufferedObservable.prototype._subscribe=function(o){var q=[],previousShouldFire;function drainQueue(){while(q.length>0){o.onNext(q.shift());}}var subscription=combineLatestSource(this.source,this.pauser.startWith(false).distinctUntilChanged(),function(data,shouldFire){return {data:data,shouldFire:shouldFire};}).subscribe(function(results){if(previousShouldFire!==undefined&&results.shouldFire!==previousShouldFire){previousShouldFire=results.shouldFire; // change in shouldFire
	if(results.shouldFire){drainQueue();}}else {previousShouldFire=results.shouldFire; // new data
	if(results.shouldFire){o.onNext(results.data);}else {q.push(results.data);}}},function(err){drainQueue();o.onError(err);},function(){drainQueue();o.onCompleted();});return subscription;};PausableBufferedObservable.prototype.pause=function(){this.controller.onNext(false);};PausableBufferedObservable.prototype.resume=function(){this.controller.onNext(true);};return PausableBufferedObservable;}(Observable); /**
	   * Pauses the underlying observable sequence based upon the observable sequence which yields true/false,
	   * and yields the values that were buffered while paused.
	   * @example
	   * var pauser = new Rx.Subject();
	   * var source = Rx.Observable.interval(100).pausableBuffered(pauser);
	   * @param {Observable} pauser The observable sequence used to pause the underlying sequence.
	   * @returns {Observable} The observable sequence which is paused based upon the pauser.
	   */observableProto.pausableBuffered=function(pauser){return new PausableBufferedObservable(this,pauser);};var ControlledObservable=function(__super__){inherits(ControlledObservable,__super__);function ControlledObservable(source,enableQueue,scheduler){__super__.call(this);this.subject=new ControlledSubject(enableQueue,scheduler);this.source=source.multicast(this.subject).refCount();}ControlledObservable.prototype._subscribe=function(o){return this.source.subscribe(o);};ControlledObservable.prototype.request=function(numberOfItems){return this.subject.request(numberOfItems==null?-1:numberOfItems);};return ControlledObservable;}(Observable);var ControlledSubject=function(__super__){inherits(ControlledSubject,__super__);function ControlledSubject(enableQueue,scheduler){enableQueue==null&&(enableQueue=true);__super__.call(this);this.subject=new Subject();this.enableQueue=enableQueue;this.queue=enableQueue?[]:null;this.requestedCount=0;this.requestedDisposable=null;this.error=null;this.hasFailed=false;this.hasCompleted=false;this.scheduler=scheduler||currentThreadScheduler;}addProperties(ControlledSubject.prototype,Observer,{_subscribe:function _subscribe(o){return this.subject.subscribe(o);},onCompleted:function onCompleted(){this.hasCompleted=true;if(!this.enableQueue||this.queue.length===0){this.subject.onCompleted();this.disposeCurrentRequest();}else {this.queue.push(Notification.createOnCompleted());}},onError:function onError(error){this.hasFailed=true;this.error=error;if(!this.enableQueue||this.queue.length===0){this.subject.onError(error);this.disposeCurrentRequest();}else {this.queue.push(Notification.createOnError(error));}},onNext:function onNext(value){if(this.requestedCount<=0){this.enableQueue&&this.queue.push(Notification.createOnNext(value));}else {this.requestedCount--===0&&this.disposeCurrentRequest();this.subject.onNext(value);}},_processRequest:function _processRequest(numberOfItems){if(this.enableQueue){while(this.queue.length>0&&(numberOfItems>0||this.queue[0].kind!=='N')){var first=this.queue.shift();first.accept(this.subject);if(first.kind==='N'){numberOfItems--;}else {this.disposeCurrentRequest();this.queue=[];}}}return numberOfItems;},request:function request(number){this.disposeCurrentRequest();var self=this;this.requestedDisposable=this.scheduler.schedule(number,function(s,i){var remaining=self._processRequest(i);var stopped=self.hasCompleted||self.hasFailed;if(!stopped&&remaining>0){self.requestedCount=remaining;return disposableCreate(function(){self.requestedCount=0;}); // Scheduled item is still in progress. Return a new
	// disposable to allow the request to be interrupted
	// via dispose.
	}});return this.requestedDisposable;},disposeCurrentRequest:function disposeCurrentRequest(){if(this.requestedDisposable){this.requestedDisposable.dispose();this.requestedDisposable=null;}}});return ControlledSubject;}(Observable); /**
	   * Attaches a controller to the observable sequence with the ability to queue.
	   * @example
	   * var source = Rx.Observable.interval(100).controlled();
	   * source.request(3); // Reads 3 values
	   * @param {bool} enableQueue truthy value to determine if values should be queued pending the next request
	   * @param {Scheduler} scheduler determines how the requests will be scheduled
	   * @returns {Observable} The observable sequence which only propagates values on request.
	   */observableProto.controlled=function(enableQueue,scheduler){if(enableQueue&&isScheduler(enableQueue)){scheduler=enableQueue;enableQueue=true;}if(enableQueue==null){enableQueue=true;}return new ControlledObservable(this,enableQueue,scheduler);};var StopAndWaitObservable=function(__super__){inherits(StopAndWaitObservable,__super__);function StopAndWaitObservable(source){__super__.call(this);this.source=source;}function scheduleMethod(s,self){self.source.request(1);}StopAndWaitObservable.prototype._subscribe=function(o){this.subscription=this.source.subscribe(new StopAndWaitObserver(o,this,this.subscription));return new BinaryDisposable(this.subscription,defaultScheduler.schedule(this,scheduleMethod));};var StopAndWaitObserver=function(__sub__){inherits(StopAndWaitObserver,__sub__);function StopAndWaitObserver(observer,observable,cancel){__sub__.call(this);this.observer=observer;this.observable=observable;this.cancel=cancel;this.scheduleDisposable=null;}StopAndWaitObserver.prototype.completed=function(){this.observer.onCompleted();this.dispose();};StopAndWaitObserver.prototype.error=function(error){this.observer.onError(error);this.dispose();};function innerScheduleMethod(s,self){self.observable.source.request(1);}StopAndWaitObserver.prototype.next=function(value){this.observer.onNext(value);this.scheduleDisposable=defaultScheduler.schedule(this,innerScheduleMethod);};StopAndWaitObservable.dispose=function(){this.observer=null;if(this.cancel){this.cancel.dispose();this.cancel=null;}if(this.scheduleDisposable){this.scheduleDisposable.dispose();this.scheduleDisposable=null;}__sub__.prototype.dispose.call(this);};return StopAndWaitObserver;}(AbstractObserver);return StopAndWaitObservable;}(Observable); /**
	   * Attaches a stop and wait observable to the current observable.
	   * @returns {Observable} A stop and wait observable.
	   */ControlledObservable.prototype.stopAndWait=function(){return new StopAndWaitObservable(this);};var WindowedObservable=function(__super__){inherits(WindowedObservable,__super__);function WindowedObservable(source,windowSize){__super__.call(this);this.source=source;this.windowSize=windowSize;}function scheduleMethod(s,self){self.source.request(self.windowSize);}WindowedObservable.prototype._subscribe=function(o){this.subscription=this.source.subscribe(new WindowedObserver(o,this,this.subscription));return new BinaryDisposable(this.subscription,defaultScheduler.schedule(this,scheduleMethod));};var WindowedObserver=function(__sub__){inherits(WindowedObserver,__sub__);function WindowedObserver(observer,observable,cancel){this.observer=observer;this.observable=observable;this.cancel=cancel;this.received=0;this.scheduleDisposable=null;__sub__.call(this);}WindowedObserver.prototype.completed=function(){this.observer.onCompleted();this.dispose();};WindowedObserver.prototype.error=function(error){this.observer.onError(error);this.dispose();};function innerScheduleMethod(s,self){self.observable.source.request(self.observable.windowSize);}WindowedObserver.prototype.next=function(value){this.observer.onNext(value);this.received=++this.received%this.observable.windowSize;this.received===0&&(this.scheduleDisposable=defaultScheduler.schedule(this,innerScheduleMethod));};WindowedObserver.prototype.dispose=function(){this.observer=null;if(this.cancel){this.cancel.dispose();this.cancel=null;}if(this.scheduleDisposable){this.scheduleDisposable.dispose();this.scheduleDisposable=null;}__sub__.prototype.dispose.call(this);};return WindowedObserver;}(AbstractObserver);return WindowedObservable;}(Observable); /**
	   * Creates a sliding windowed observable based upon the window size.
	   * @param {Number} windowSize The number of items in the window
	   * @returns {Observable} A windowed observable based upon the window size.
	   */ControlledObservable.prototype.windowed=function(windowSize){return new WindowedObservable(this,windowSize);}; /**
	   * Pipes the existing Observable sequence into a Node.js Stream.
	   * @param {Stream} dest The destination Node.js stream.
	   * @returns {Stream} The destination stream.
	   */observableProto.pipe=function(dest){var source=this.pausableBuffered();function onDrain(){source.resume();}dest.addListener('drain',onDrain);source.subscribe(function(x){!dest.write(String(x))&&source.pause();},function(err){dest.emit('error',err);},function(){ // Hack check because STDIO is not closable
	!dest._isStdio&&dest.end();dest.removeListener('drain',onDrain);});source.resume();return dest;};var MulticastObservable=function(__super__){inherits(MulticastObservable,__super__);function MulticastObservable(source,fn1,fn2){this.source=source;this._fn1=fn1;this._fn2=fn2;__super__.call(this);}MulticastObservable.prototype.subscribeCore=function(o){var connectable=this.source.multicast(this._fn1());return new BinaryDisposable(this._fn2(connectable).subscribe(o),connectable.connect());};return MulticastObservable;}(ObservableBase); /**
	   * Multicasts the source sequence notifications through an instantiated subject into all uses of the sequence within a selector function. Each
	   * subscription to the resulting sequence causes a separate multicast invocation, exposing the sequence resulting from the selector function's
	   * invocation. For specializations with fixed subject types, see Publish, PublishLast, and Replay.
	   *
	   * @example
	   * 1 - res = source.multicast(observable);
	   * 2 - res = source.multicast(function () { return new Subject(); }, function (x) { return x; });
	   *
	   * @param {Function|Subject} subjectOrSubjectSelector
	   * Factory function to create an intermediate subject through which the source sequence's elements will be multicast to the selector function.
	   * Or:
	   * Subject to push source elements into.
	   *
	   * @param {Function} [selector] Optional selector function which can use the multicasted source sequence subject to the policies enforced by the created subject. Specified only if <paramref name="subjectOrSubjectSelector" is a factory function.
	   * @returns {Observable} An observable sequence that contains the elements of a sequence produced by multicasting the source sequence within a selector function.
	   */observableProto.multicast=function(subjectOrSubjectSelector,selector){return isFunction(subjectOrSubjectSelector)?new MulticastObservable(this,subjectOrSubjectSelector,selector):new ConnectableObservable(this,subjectOrSubjectSelector);}; /**
	   * Returns an observable sequence that is the result of invoking the selector on a connectable observable sequence that shares a single subscription to the underlying sequence.
	   * This operator is a specialization of Multicast using a regular Subject.
	   *
	   * @example
	   * var resres = source.publish();
	   * var res = source.publish(function (x) { return x; });
	   *
	   * @param {Function} [selector] Selector function which can use the multicasted source sequence as many times as needed, without causing multiple subscriptions to the source sequence. Subscribers to the given source will receive all notifications of the source from the time of the subscription on.
	   * @returns {Observable} An observable sequence that contains the elements of a sequence produced by multicasting the source sequence within a selector function.
	   */observableProto.publish=function(selector){return selector&&isFunction(selector)?this.multicast(function(){return new Subject();},selector):this.multicast(new Subject());}; /**
	   * Returns an observable sequence that shares a single subscription to the underlying sequence.
	   * This operator is a specialization of publish which creates a subscription when the number of observers goes from zero to one, then shares that subscription with all subsequent observers until the number of observers returns to zero, at which point the subscription is disposed.
	   * @returns {Observable} An observable sequence that contains the elements of a sequence produced by multicasting the source sequence.
	   */observableProto.share=function(){return this.publish().refCount();}; /**
	   * Returns an observable sequence that is the result of invoking the selector on a connectable observable sequence that shares a single subscription to the underlying sequence containing only the last notification.
	   * This operator is a specialization of Multicast using a AsyncSubject.
	   *
	   * @example
	   * var res = source.publishLast();
	   * var res = source.publishLast(function (x) { return x; });
	   *
	   * @param selector [Optional] Selector function which can use the multicasted source sequence as many times as needed, without causing multiple subscriptions to the source sequence. Subscribers to the given source will only receive the last notification of the source.
	   * @returns {Observable} An observable sequence that contains the elements of a sequence produced by multicasting the source sequence within a selector function.
	   */observableProto.publishLast=function(selector){return selector&&isFunction(selector)?this.multicast(function(){return new AsyncSubject();},selector):this.multicast(new AsyncSubject());}; /**
	   * Returns an observable sequence that is the result of invoking the selector on a connectable observable sequence that shares a single subscription to the underlying sequence and starts with initialValue.
	   * This operator is a specialization of Multicast using a BehaviorSubject.
	   *
	   * @example
	   * var res = source.publishValue(42);
	   * var res = source.publishValue(function (x) { return x.select(function (y) { return y * y; }) }, 42);
	   *
	   * @param {Function} [selector] Optional selector function which can use the multicasted source sequence as many times as needed, without causing multiple subscriptions to the source sequence. Subscribers to the given source will receive immediately receive the initial value, followed by all notifications of the source from the time of the subscription on.
	   * @param {Mixed} initialValue Initial value received by observers upon subscription.
	   * @returns {Observable} An observable sequence that contains the elements of a sequence produced by multicasting the source sequence within a selector function.
	   */observableProto.publishValue=function(initialValueOrSelector,initialValue){return arguments.length===2?this.multicast(function(){return new BehaviorSubject(initialValue);},initialValueOrSelector):this.multicast(new BehaviorSubject(initialValueOrSelector));}; /**
	   * Returns an observable sequence that shares a single subscription to the underlying sequence and starts with an initialValue.
	   * This operator is a specialization of publishValue which creates a subscription when the number of observers goes from zero to one, then shares that subscription with all subsequent observers until the number of observers returns to zero, at which point the subscription is disposed.
	   * @param {Mixed} initialValue Initial value received by observers upon subscription.
	   * @returns {Observable} An observable sequence that contains the elements of a sequence produced by multicasting the source sequence.
	   */observableProto.shareValue=function(initialValue){return this.publishValue(initialValue).refCount();}; /**
	   * Returns an observable sequence that is the result of invoking the selector on a connectable observable sequence that shares a single subscription to the underlying sequence replaying notifications subject to a maximum time length for the replay buffer.
	   * This operator is a specialization of Multicast using a ReplaySubject.
	   *
	   * @example
	   * var res = source.replay(null, 3);
	   * var res = source.replay(null, 3, 500);
	   * var res = source.replay(null, 3, 500, scheduler);
	   * var res = source.replay(function (x) { return x.take(6).repeat(); }, 3, 500, scheduler);
	   *
	   * @param selector [Optional] Selector function which can use the multicasted source sequence as many times as needed, without causing multiple subscriptions to the source sequence. Subscribers to the given source will receive all the notifications of the source subject to the specified replay buffer trimming policy.
	   * @param bufferSize [Optional] Maximum element count of the replay buffer.
	   * @param windowSize [Optional] Maximum time length of the replay buffer.
	   * @param scheduler [Optional] Scheduler where connected observers within the selector function will be invoked on.
	   * @returns {Observable} An observable sequence that contains the elements of a sequence produced by multicasting the source sequence within a selector function.
	   */observableProto.replay=function(selector,bufferSize,windowSize,scheduler){return selector&&isFunction(selector)?this.multicast(function(){return new ReplaySubject(bufferSize,windowSize,scheduler);},selector):this.multicast(new ReplaySubject(bufferSize,windowSize,scheduler));}; /**
	   * Returns an observable sequence that shares a single subscription to the underlying sequence replaying notifications subject to a maximum time length for the replay buffer.
	   * This operator is a specialization of replay which creates a subscription when the number of observers goes from zero to one, then shares that subscription with all subsequent observers until the number of observers returns to zero, at which point the subscription is disposed.
	   *
	   * @example
	   * var res = source.shareReplay(3);
	   * var res = source.shareReplay(3, 500);
	   * var res = source.shareReplay(3, 500, scheduler);
	   *

	   * @param bufferSize [Optional] Maximum element count of the replay buffer.
	   * @param window [Optional] Maximum time length of the replay buffer.
	   * @param scheduler [Optional] Scheduler where connected observers within the selector function will be invoked on.
	   * @returns {Observable} An observable sequence that contains the elements of a sequence produced by multicasting the source sequence.
	   */observableProto.shareReplay=function(bufferSize,windowSize,scheduler){return this.replay(null,bufferSize,windowSize,scheduler).refCount();};var InnerSubscription=function InnerSubscription(s,o){this._s=s;this._o=o;};InnerSubscription.prototype.dispose=function(){if(!this._s.isDisposed&&this._o!==null){var idx=this._s.observers.indexOf(this._o);this._s.observers.splice(idx,1);this._o=null;}};var RefCountObservable=function(__super__){inherits(RefCountObservable,__super__);function RefCountObservable(source){this.source=source;this._count=0;this._connectableSubscription=null;__super__.call(this);}RefCountObservable.prototype.subscribeCore=function(o){var subscription=this.source.subscribe(o);++this._count===1&&(this._connectableSubscription=this.source.connect());return new RefCountDisposable(this,subscription);};function RefCountDisposable(p,s){this._p=p;this._s=s;this.isDisposed=false;}RefCountDisposable.prototype.dispose=function(){if(!this.isDisposed){this.isDisposed=true;this._s.dispose();--this._p._count===0&&this._p._connectableSubscription.dispose();}};return RefCountObservable;}(ObservableBase);var ConnectableObservable=Rx.ConnectableObservable=function(__super__){inherits(ConnectableObservable,__super__);function ConnectableObservable(source,subject){this.source=source;this._connection=null;this._source=source.asObservable();this._subject=subject;__super__.call(this);}function ConnectDisposable(parent,subscription){this._p=parent;this._s=subscription;}ConnectDisposable.prototype.dispose=function(){if(this._s){this._s.dispose();this._s=null;this._p._connection=null;}};ConnectableObservable.prototype.connect=function(){if(!this._connection){var subscription=this._source.subscribe(this._subject);this._connection=new ConnectDisposable(this,subscription);}return this._connection;};ConnectableObservable.prototype._subscribe=function(o){return this._subject.subscribe(o);};ConnectableObservable.prototype.refCount=function(){return new RefCountObservable(this);};return ConnectableObservable;}(Observable); /**
	   * Returns an observable sequence that shares a single subscription to the underlying sequence. This observable sequence
	   * can be resubscribed to, even if all prior subscriptions have ended. (unlike `.publish().refCount()`)
	   * @returns {Observable} An observable sequence that contains the elements of a sequence produced by multicasting the source.
	   */observableProto.singleInstance=function(){var source=this,hasObservable=false,observable;function getObservable(){if(!hasObservable){hasObservable=true;observable=source['finally'](function(){hasObservable=false;}).publish().refCount();}return observable;}return new AnonymousObservable(function(o){return getObservable().subscribe(o);});}; /**
	   *  Correlates the elements of two sequences based on overlapping durations.
	   *
	   *  @param {Observable} right The right observable sequence to join elements for.
	   *  @param {Function} leftDurationSelector A function to select the duration (expressed as an observable sequence) of each element of the left observable sequence, used to determine overlap.
	   *  @param {Function} rightDurationSelector A function to select the duration (expressed as an observable sequence) of each element of the right observable sequence, used to determine overlap.
	   *  @param {Function} resultSelector A function invoked to compute a result element for any two overlapping elements of the left and right observable sequences. The parameters passed to the function correspond with the elements from the left and right source sequences for which overlap occurs.
	   *  @returns {Observable} An observable sequence that contains result elements computed from source elements that have an overlapping duration.
	   */observableProto.join=function(right,leftDurationSelector,rightDurationSelector,resultSelector){var left=this;return new AnonymousObservable(function(o){var group=new CompositeDisposable();var leftDone=false,rightDone=false;var leftId=0,rightId=0;var leftMap=new Map(),rightMap=new Map();var handleError=function handleError(e){o.onError(e);};group.add(left.subscribe(function(value){var id=leftId++,md=new SingleAssignmentDisposable();leftMap.set(id,value);group.add(md);var duration=tryCatch(leftDurationSelector)(value);if(duration===errorObj){return o.onError(duration.e);}md.setDisposable(duration.take(1).subscribe(noop,handleError,function(){leftMap['delete'](id)&&leftMap.size===0&&leftDone&&o.onCompleted();group.remove(md);}));rightMap.forEach(function(v){var result=tryCatch(resultSelector)(value,v);if(result===errorObj){return o.onError(result.e);}o.onNext(result);});},handleError,function(){leftDone=true;(rightDone||leftMap.size===0)&&o.onCompleted();}));group.add(right.subscribe(function(value){var id=rightId++,md=new SingleAssignmentDisposable();rightMap.set(id,value);group.add(md);var duration=tryCatch(rightDurationSelector)(value);if(duration===errorObj){return o.onError(duration.e);}md.setDisposable(duration.take(1).subscribe(noop,handleError,function(){rightMap['delete'](id)&&rightMap.size===0&&rightDone&&o.onCompleted();group.remove(md);}));leftMap.forEach(function(v){var result=tryCatch(resultSelector)(v,value);if(result===errorObj){return o.onError(result.e);}o.onNext(result);});},handleError,function(){rightDone=true;(leftDone||rightMap.size===0)&&o.onCompleted();}));return group;},left);}; /**
	   *  Correlates the elements of two sequences based on overlapping durations, and groups the results.
	   *
	   *  @param {Observable} right The right observable sequence to join elements for.
	   *  @param {Function} leftDurationSelector A function to select the duration (expressed as an observable sequence) of each element of the left observable sequence, used to determine overlap.
	   *  @param {Function} rightDurationSelector A function to select the duration (expressed as an observable sequence) of each element of the right observable sequence, used to determine overlap.
	   *  @param {Function} resultSelector A function invoked to compute a result element for any element of the left sequence with overlapping elements from the right observable sequence. The first parameter passed to the function is an element of the left sequence. The second parameter passed to the function is an observable sequence with elements from the right sequence that overlap with the left sequence's element.
	   *  @returns {Observable} An observable sequence that contains result elements computed from source elements that have an overlapping duration.
	   */observableProto.groupJoin=function(right,leftDurationSelector,rightDurationSelector,resultSelector){var left=this;return new AnonymousObservable(function(o){var group=new CompositeDisposable();var r=new RefCountDisposable(group);var leftMap=new Map(),rightMap=new Map();var leftId=0,rightId=0;var handleError=function handleError(e){return function(v){v.onError(e);};};function handleError(e){};group.add(left.subscribe(function(value){var s=new Subject();var id=leftId++;leftMap.set(id,s);var result=tryCatch(resultSelector)(value,addRef(s,r));if(result===errorObj){leftMap.forEach(handleError(result.e));return o.onError(result.e);}o.onNext(result);rightMap.forEach(function(v){s.onNext(v);});var md=new SingleAssignmentDisposable();group.add(md);var duration=tryCatch(leftDurationSelector)(value);if(duration===errorObj){leftMap.forEach(handleError(duration.e));return o.onError(duration.e);}md.setDisposable(duration.take(1).subscribe(noop,function(e){leftMap.forEach(handleError(e));o.onError(e);},function(){leftMap['delete'](id)&&s.onCompleted();group.remove(md);}));},function(e){leftMap.forEach(handleError(e));o.onError(e);},function(){o.onCompleted();}));group.add(right.subscribe(function(value){var id=rightId++;rightMap.set(id,value);var md=new SingleAssignmentDisposable();group.add(md);var duration=tryCatch(rightDurationSelector)(value);if(duration===errorObj){leftMap.forEach(handleError(duration.e));return o.onError(duration.e);}md.setDisposable(duration.take(1).subscribe(noop,function(e){leftMap.forEach(handleError(e));o.onError(e);},function(){rightMap['delete'](id);group.remove(md);}));leftMap.forEach(function(v){v.onNext(value);});},function(e){leftMap.forEach(handleError(e));o.onError(e);}));return r;},left);};function toArray(x){return x.toArray();} /**
	   *  Projects each element of an observable sequence into zero or more buffers.
	   *  @param {Mixed} bufferOpeningsOrClosingSelector Observable sequence whose elements denote the creation of new windows, or, a function invoked to define the boundaries of the produced windows (a new window is started when the previous one is closed, resulting in non-overlapping windows).
	   *  @param {Function} [bufferClosingSelector] A function invoked to define the closing of each produced window. If a closing selector function is specified for the first parameter, this parameter is ignored.
	   *  @returns {Observable} An observable sequence of windows.
	   */observableProto.buffer=function(){return this.window.apply(this,arguments).flatMap(toArray);}; /**
	   *  Projects each element of an observable sequence into zero or more windows.
	   *
	   *  @param {Mixed} windowOpeningsOrClosingSelector Observable sequence whose elements denote the creation of new windows, or, a function invoked to define the boundaries of the produced windows (a new window is started when the previous one is closed, resulting in non-overlapping windows).
	   *  @param {Function} [windowClosingSelector] A function invoked to define the closing of each produced window. If a closing selector function is specified for the first parameter, this parameter is ignored.
	   *  @returns {Observable} An observable sequence of windows.
	   */observableProto.window=function(windowOpeningsOrClosingSelector,windowClosingSelector){if(arguments.length===1&&typeof arguments[0]!=='function'){return observableWindowWithBoundaries.call(this,windowOpeningsOrClosingSelector);}return typeof windowOpeningsOrClosingSelector==='function'?observableWindowWithClosingSelector.call(this,windowOpeningsOrClosingSelector):observableWindowWithOpenings.call(this,windowOpeningsOrClosingSelector,windowClosingSelector);};function observableWindowWithOpenings(windowOpenings,windowClosingSelector){return windowOpenings.groupJoin(this,windowClosingSelector,observableEmpty,function(_,win){return win;});}function observableWindowWithBoundaries(windowBoundaries){var source=this;return new AnonymousObservable(function(observer){var win=new Subject(),d=new CompositeDisposable(),r=new RefCountDisposable(d);observer.onNext(addRef(win,r));d.add(source.subscribe(function(x){win.onNext(x);},function(err){win.onError(err);observer.onError(err);},function(){win.onCompleted();observer.onCompleted();}));isPromise(windowBoundaries)&&(windowBoundaries=observableFromPromise(windowBoundaries));d.add(windowBoundaries.subscribe(function(w){win.onCompleted();win=new Subject();observer.onNext(addRef(win,r));},function(err){win.onError(err);observer.onError(err);},function(){win.onCompleted();observer.onCompleted();}));return r;},source);}function observableWindowWithClosingSelector(windowClosingSelector){var source=this;return new AnonymousObservable(function(observer){var m=new SerialDisposable(),d=new CompositeDisposable(m),r=new RefCountDisposable(d),win=new Subject();observer.onNext(addRef(win,r));d.add(source.subscribe(function(x){win.onNext(x);},function(err){win.onError(err);observer.onError(err);},function(){win.onCompleted();observer.onCompleted();}));function createWindowClose(){var windowClose;try{windowClose=windowClosingSelector();}catch(e){observer.onError(e);return;}isPromise(windowClose)&&(windowClose=observableFromPromise(windowClose));var m1=new SingleAssignmentDisposable();m.setDisposable(m1);m1.setDisposable(windowClose.take(1).subscribe(noop,function(err){win.onError(err);observer.onError(err);},function(){win.onCompleted();win=new Subject();observer.onNext(addRef(win,r));createWindowClose();}));}createWindowClose();return r;},source);}var PairwiseObservable=function(__super__){inherits(PairwiseObservable,__super__);function PairwiseObservable(source){this.source=source;__super__.call(this);}PairwiseObservable.prototype.subscribeCore=function(o){return this.source.subscribe(new PairwiseObserver(o));};return PairwiseObservable;}(ObservableBase);var PairwiseObserver=function(__super__){inherits(PairwiseObserver,__super__);function PairwiseObserver(o){this._o=o;this._p=null;this._hp=false;__super__.call(this);}PairwiseObserver.prototype.next=function(x){if(this._hp){this._o.onNext([this._p,x]);}else {this._hp=true;}this._p=x;};PairwiseObserver.prototype.error=function(err){this._o.onError(err);};PairwiseObserver.prototype.completed=function(){this._o.onCompleted();};return PairwiseObserver;}(AbstractObserver); /**
	   * Returns a new observable that triggers on the second and subsequent triggerings of the input observable.
	   * The Nth triggering of the input observable passes the arguments from the N-1th and Nth triggering as a pair.
	   * The argument passed to the N-1th triggering is held in hidden internal state until the Nth triggering occurs.
	   * @returns {Observable} An observable that triggers on successive pairs of observations from the input observable as an array.
	   */observableProto.pairwise=function(){return new PairwiseObservable(this);}; /**
	   * Returns two observables which partition the observations of the source by the given function.
	   * The first will trigger observations for those values for which the predicate returns true.
	   * The second will trigger observations for those values where the predicate returns false.
	   * The predicate is executed once for each subscribed observer.
	   * Both also propagate all error observations arising from the source and each completes
	   * when the source completes.
	   * @param {Function} predicate
	   *    The function to determine which output Observable will trigger a particular observation.
	   * @returns {Array}
	   *    An array of observables. The first triggers when the predicate returns true,
	   *    and the second triggers when the predicate returns false.
	  */observableProto.partition=function(predicate,thisArg){var fn=bindCallback(predicate,thisArg,3);return [this.filter(predicate,thisArg),this.filter(function(x,i,o){return !fn(x,i,o);})];};var WhileEnumerable=function(__super__){inherits(WhileEnumerable,__super__);function WhileEnumerable(c,s){this.c=c;this.s=s;}WhileEnumerable.prototype[$iterator$]=function(){var self=this;return {next:function next(){return self.c()?{done:false,value:self.s}:{done:true,value:void 0};}};};return WhileEnumerable;}(Enumerable);function enumerableWhile(condition,source){return new WhileEnumerable(condition,source);} /**
	   *  Returns an observable sequence that is the result of invoking the selector on the source sequence, without sharing subscriptions.
	   *  This operator allows for a fluent style of writing queries that use the same sequence multiple times.
	   *
	   * @param {Function} selector Selector function which can use the source sequence as many times as needed, without sharing subscriptions to the source sequence.
	   * @returns {Observable} An observable sequence that contains the elements of a sequence produced by multicasting the source sequence within a selector function.
	   */observableProto.letBind=observableProto['let']=function(func){return func(this);}; /**
	   *  Determines whether an observable collection contains values. 
	   *
	   * @example
	   *  1 - res = Rx.Observable.if(condition, obs1);
	   *  2 - res = Rx.Observable.if(condition, obs1, obs2);
	   *  3 - res = Rx.Observable.if(condition, obs1, scheduler);
	   * @param {Function} condition The condition which determines if the thenSource or elseSource will be run.
	   * @param {Observable} thenSource The observable sequence or Promise that will be run if the condition function returns true.
	   * @param {Observable} [elseSource] The observable sequence or Promise that will be run if the condition function returns false. If this is not provided, it defaults to Rx.Observabe.Empty with the specified scheduler.
	   * @returns {Observable} An observable sequence which is either the thenSource or elseSource.
	   */Observable['if']=function(condition,thenSource,elseSourceOrScheduler){return observableDefer(function(){elseSourceOrScheduler||(elseSourceOrScheduler=observableEmpty());isPromise(thenSource)&&(thenSource=observableFromPromise(thenSource));isPromise(elseSourceOrScheduler)&&(elseSourceOrScheduler=observableFromPromise(elseSourceOrScheduler)); // Assume a scheduler for empty only
	typeof elseSourceOrScheduler.now==='function'&&(elseSourceOrScheduler=observableEmpty(elseSourceOrScheduler));return condition()?thenSource:elseSourceOrScheduler;});}; /**
	   *  Concatenates the observable sequences obtained by running the specified result selector for each element in source.
	   * There is an alias for this method called 'forIn' for browsers <IE9
	   * @param {Array} sources An array of values to turn into an observable sequence.
	   * @param {Function} resultSelector A function to apply to each item in the sources array to turn it into an observable sequence.
	   * @returns {Observable} An observable sequence from the concatenated observable sequences.
	   */Observable['for']=Observable.forIn=function(sources,resultSelector,thisArg){return enumerableOf(sources,resultSelector,thisArg).concat();}; /**
	   *  Repeats source as long as condition holds emulating a while loop.
	   * There is an alias for this method called 'whileDo' for browsers <IE9
	   *
	   * @param {Function} condition The condition which determines if the source will be repeated.
	   * @param {Observable} source The observable sequence that will be run if the condition function returns true.
	   * @returns {Observable} An observable sequence which is repeated as long as the condition holds.
	   */var observableWhileDo=Observable['while']=Observable.whileDo=function(condition,source){isPromise(source)&&(source=observableFromPromise(source));return enumerableWhile(condition,source).concat();}; /**
	   *  Repeats source as long as condition holds emulating a do while loop.
	   *
	   * @param {Function} condition The condition which determines if the source will be repeated.
	   * @param {Observable} source The observable sequence that will be run if the condition function returns true.
	   * @returns {Observable} An observable sequence which is repeated as long as the condition holds.
	   */observableProto.doWhile=function(condition){return observableConcat([this,observableWhileDo(condition,this)]);}; /**
	   *  Uses selector to determine which source in sources to use.
	   * @param {Function} selector The function which extracts the value for to test in a case statement.
	   * @param {Array} sources A object which has keys which correspond to the case statement labels.
	   * @param {Observable} [elseSource] The observable sequence or Promise that will be run if the sources are not matched. If this is not provided, it defaults to Rx.Observabe.empty with the specified scheduler.
	   *
	   * @returns {Observable} An observable sequence which is determined by a case statement.
	   */Observable['case']=function(selector,sources,defaultSourceOrScheduler){return observableDefer(function(){isPromise(defaultSourceOrScheduler)&&(defaultSourceOrScheduler=observableFromPromise(defaultSourceOrScheduler));defaultSourceOrScheduler||(defaultSourceOrScheduler=observableEmpty());isScheduler(defaultSourceOrScheduler)&&(defaultSourceOrScheduler=observableEmpty(defaultSourceOrScheduler));var result=sources[selector()];isPromise(result)&&(result=observableFromPromise(result));return result||defaultSourceOrScheduler;});};var ExpandObservable=function(__super__){inherits(ExpandObservable,__super__);function ExpandObservable(source,fn,scheduler){this.source=source;this._fn=fn;this._scheduler=scheduler;__super__.call(this);}function scheduleRecursive(args,recurse){var state=args[0],self=args[1];var work;if(state.q.length>0){work=state.q.shift();}else {state.isAcquired=false;return;}var m1=new SingleAssignmentDisposable();state.d.add(m1);m1.setDisposable(work.subscribe(new ExpandObserver(state,self,m1)));recurse([state,self]);}ExpandObservable.prototype._ensureActive=function(state){var isOwner=false;if(state.q.length>0){isOwner=!state.isAcquired;state.isAcquired=true;}isOwner&&state.m.setDisposable(this._scheduler.scheduleRecursive([state,this],scheduleRecursive));};ExpandObservable.prototype.subscribeCore=function(o){var m=new SerialDisposable(),d=new CompositeDisposable(m),state={q:[],m:m,d:d,activeCount:0,isAcquired:false,o:o};state.q.push(this.source);state.activeCount++;this._ensureActive(state);return d;};return ExpandObservable;}(ObservableBase);var ExpandObserver=function(__super__){inherits(ExpandObserver,__super__);function ExpandObserver(state,parent,m1){this._s=state;this._p=parent;this._m1=m1;__super__.call(this);}ExpandObserver.prototype.next=function(x){this._s.o.onNext(x);var result=tryCatch(this._p._fn)(x);if(result===errorObj){return this._s.o.onError(result.e);}this._s.q.push(result);this._s.activeCount++;this._p._ensureActive(this._s);};ExpandObserver.prototype.error=function(e){this._s.o.onError(e);};ExpandObserver.prototype.completed=function(){this._s.d.remove(this._m1);this._s.activeCount--;this._s.activeCount===0&&this._s.o.onCompleted();};return ExpandObserver;}(AbstractObserver); /**
	   *  Expands an observable sequence by recursively invoking selector.
	   *
	   * @param {Function} selector Selector function to invoke for each produced element, resulting in another sequence to which the selector will be invoked recursively again.
	   * @param {Scheduler} [scheduler] Scheduler on which to perform the expansion. If not provided, this defaults to the current thread scheduler.
	   * @returns {Observable} An observable sequence containing all the elements produced by the recursive expansion.
	   */observableProto.expand=function(selector,scheduler){isScheduler(scheduler)||(scheduler=currentThreadScheduler);return new ExpandObservable(this,selector,scheduler);};function argumentsToArray(){var len=arguments.length,args=new Array(len);for(var i=0;i<len;i++){args[i]=arguments[i];}return args;}var ForkJoinObservable=function(__super__){inherits(ForkJoinObservable,__super__);function ForkJoinObservable(sources,cb){this._sources=sources;this._cb=cb;__super__.call(this);}ForkJoinObservable.prototype.subscribeCore=function(o){if(this._sources.length===0){o.onCompleted();return disposableEmpty;}var count=this._sources.length;var state={finished:false,hasResults:new Array(count),hasCompleted:new Array(count),results:new Array(count)};var subscriptions=new CompositeDisposable();for(var i=0,len=this._sources.length;i<len;i++){var source=this._sources[i];isPromise(source)&&(source=observableFromPromise(source));subscriptions.add(source.subscribe(new ForkJoinObserver(o,state,i,this._cb,subscriptions)));}return subscriptions;};return ForkJoinObservable;}(ObservableBase);var ForkJoinObserver=function(__super__){inherits(ForkJoinObserver,__super__);function ForkJoinObserver(o,s,i,cb,subs){this._o=o;this._s=s;this._i=i;this._cb=cb;this._subs=subs;__super__.call(this);}ForkJoinObserver.prototype.next=function(x){if(!this._s.finished){this._s.hasResults[this._i]=true;this._s.results[this._i]=x;}};ForkJoinObserver.prototype.error=function(e){this._s.finished=true;this._o.onError(e);this._subs.dispose();};ForkJoinObserver.prototype.completed=function(){if(!this._s.finished){if(!this._s.hasResults[this._i]){return this._o.onCompleted();}this._s.hasCompleted[this._i]=true;for(var i=0;i<this._s.results.length;i++){if(!this._s.hasCompleted[i]){return;}}this._s.finished=true;var res=tryCatch(this._cb).apply(null,this._s.results);if(res===errorObj){return this._o.onError(res.e);}this._o.onNext(res);this._o.onCompleted();}};return ForkJoinObserver;}(AbstractObserver); /**
	   *  Runs all observable sequences in parallel and collect their last elements.
	   *
	   * @example
	   *  1 - res = Rx.Observable.forkJoin([obs1, obs2]);
	   *  1 - res = Rx.Observable.forkJoin(obs1, obs2, ...);
	   * @returns {Observable} An observable sequence with an array collecting the last elements of all the input sequences.
	   */Observable.forkJoin=function(){var len=arguments.length,args=new Array(len);for(var i=0;i<len;i++){args[i]=arguments[i];}var resultSelector=isFunction(args[len-1])?args.pop():argumentsToArray;Array.isArray(args[0])&&(args=args[0]);return new ForkJoinObservable(args,resultSelector);}; /**
	   *  Runs two observable sequences in parallel and combines their last elemenets.
	   * @param {Observable} second Second observable sequence.
	   * @param {Function} resultSelector Result selector function to invoke with the last elements of both sequences.
	   * @returns {Observable} An observable sequence with the result of calling the selector function with the last elements of both input sequences.
	   */observableProto.forkJoin=function(){var len=arguments.length,args=new Array(len);for(var i=0;i<len;i++){args[i]=arguments[i];}if(Array.isArray(args[0])){args[0].unshift(this);}else {args.unshift(this);}return Observable.forkJoin.apply(null,args);}; /**
	   * Comonadic bind operator.
	   * @param {Function} selector A transform function to apply to each element.
	   * @param {Object} scheduler Scheduler used to execute the operation. If not specified, defaults to the ImmediateScheduler.
	   * @returns {Observable} An observable sequence which results from the comonadic bind operation.
	   */observableProto.manySelect=observableProto.extend=function(selector,scheduler){isScheduler(scheduler)||(scheduler=Rx.Scheduler.immediate);var source=this;return observableDefer(function(){var chain;return source.map(function(x){var curr=new ChainObservable(x);chain&&chain.onNext(x);chain=curr;return curr;}).tap(noop,function(e){chain&&chain.onError(e);},function(){chain&&chain.onCompleted();}).observeOn(scheduler).map(selector);},source);};var ChainObservable=function(__super__){inherits(ChainObservable,__super__);function ChainObservable(head){__super__.call(this);this.head=head;this.tail=new AsyncSubject();}addProperties(ChainObservable.prototype,Observer,{_subscribe:function _subscribe(o){var g=new CompositeDisposable();g.add(currentThreadScheduler.schedule(this,function(_,self){o.onNext(self.head);g.add(self.tail.mergeAll().subscribe(o));}));return g;},onCompleted:function onCompleted(){this.onNext(Observable.empty());},onError:function onError(e){this.onNext(Observable['throw'](e));},onNext:function onNext(v){this.tail.onNext(v);this.tail.onCompleted();}});return ChainObservable;}(Observable);var Map=root.Map||function(){function Map(){this.size=0;this._values=[];this._keys=[];}Map.prototype['delete']=function(key){var i=this._keys.indexOf(key);if(i===-1){return false;}this._values.splice(i,1);this._keys.splice(i,1);this.size--;return true;};Map.prototype.get=function(key){var i=this._keys.indexOf(key);return i===-1?undefined:this._values[i];};Map.prototype.set=function(key,value){var i=this._keys.indexOf(key);if(i===-1){this._keys.push(key);this._values.push(value);this.size++;}else {this._values[i]=value;}return this;};Map.prototype.forEach=function(cb,thisArg){for(var i=0;i<this.size;i++){cb.call(thisArg,this._values[i],this._keys[i]);}};return Map;}(); /**
	   * @constructor
	   * Represents a join pattern over observable sequences.
	   */function Pattern(patterns){this.patterns=patterns;} /**
	   *  Creates a pattern that matches the current plan matches and when the specified observable sequences has an available value.
	   *  @param other Observable sequence to match in addition to the current pattern.
	   *  @return {Pattern} Pattern object that matches when all observable sequences in the pattern have an available value.
	   */Pattern.prototype.and=function(other){return new Pattern(this.patterns.concat(other));}; /**
	   *  Matches when all observable sequences in the pattern (specified using a chain of and operators) have an available value and projects the values.
	   *  @param {Function} selector Selector that will be invoked with available values from the source sequences, in the same order of the sequences in the pattern.
	   *  @return {Plan} Plan that produces the projected values, to be fed (with other plans) to the when operator.
	   */Pattern.prototype.thenDo=function(selector){return new Plan(this,selector);};function Plan(expression,selector){this.expression=expression;this.selector=selector;}function handleOnError(o){return function(e){o.onError(e);};}function handleOnNext(self,observer){return function onNext(){var result=tryCatch(self.selector).apply(self,arguments);if(result===errorObj){return observer.onError(result.e);}observer.onNext(result);};}Plan.prototype.activate=function(externalSubscriptions,observer,deactivate){var joinObservers=[],errHandler=handleOnError(observer);for(var i=0,len=this.expression.patterns.length;i<len;i++){joinObservers.push(planCreateObserver(externalSubscriptions,this.expression.patterns[i],errHandler));}var activePlan=new ActivePlan(joinObservers,handleOnNext(this,observer),function(){for(var j=0,jlen=joinObservers.length;j<jlen;j++){joinObservers[j].removeActivePlan(activePlan);}deactivate(activePlan);});for(i=0,len=joinObservers.length;i<len;i++){joinObservers[i].addActivePlan(activePlan);}return activePlan;};function planCreateObserver(externalSubscriptions,observable,onError){var entry=externalSubscriptions.get(observable);if(!entry){var observer=new JoinObserver(observable,onError);externalSubscriptions.set(observable,observer);return observer;}return entry;}function ActivePlan(joinObserverArray,onNext,onCompleted){this.joinObserverArray=joinObserverArray;this.onNext=onNext;this.onCompleted=onCompleted;this.joinObservers=new Map();for(var i=0,len=this.joinObserverArray.length;i<len;i++){var joinObserver=this.joinObserverArray[i];this.joinObservers.set(joinObserver,joinObserver);}}ActivePlan.prototype.dequeue=function(){this.joinObservers.forEach(function(v){v.queue.shift();});};ActivePlan.prototype.match=function(){var i,len,hasValues=true;for(i=0,len=this.joinObserverArray.length;i<len;i++){if(this.joinObserverArray[i].queue.length===0){hasValues=false;break;}}if(hasValues){var firstValues=[],isCompleted=false;for(i=0,len=this.joinObserverArray.length;i<len;i++){firstValues.push(this.joinObserverArray[i].queue[0]);this.joinObserverArray[i].queue[0].kind==='C'&&(isCompleted=true);}if(isCompleted){this.onCompleted();}else {this.dequeue();var values=[];for(i=0,len=firstValues.length;i<firstValues.length;i++){values.push(firstValues[i].value);}this.onNext.apply(this,values);}}};var JoinObserver=function(__super__){inherits(JoinObserver,__super__);function JoinObserver(source,onError){__super__.call(this);this.source=source;this.onError=onError;this.queue=[];this.activePlans=[];this.subscription=new SingleAssignmentDisposable();this.isDisposed=false;}var JoinObserverPrototype=JoinObserver.prototype;JoinObserverPrototype.next=function(notification){if(!this.isDisposed){if(notification.kind==='E'){return this.onError(notification.error);}this.queue.push(notification);var activePlans=this.activePlans.slice(0);for(var i=0,len=activePlans.length;i<len;i++){activePlans[i].match();}}};JoinObserverPrototype.error=noop;JoinObserverPrototype.completed=noop;JoinObserverPrototype.addActivePlan=function(activePlan){this.activePlans.push(activePlan);};JoinObserverPrototype.subscribe=function(){this.subscription.setDisposable(this.source.materialize().subscribe(this));};JoinObserverPrototype.removeActivePlan=function(activePlan){this.activePlans.splice(this.activePlans.indexOf(activePlan),1);this.activePlans.length===0&&this.dispose();};JoinObserverPrototype.dispose=function(){__super__.prototype.dispose.call(this);if(!this.isDisposed){this.isDisposed=true;this.subscription.dispose();}};return JoinObserver;}(AbstractObserver); /**
	   *  Creates a pattern that matches when both observable sequences have an available value.
	   *
	   *  @param right Observable sequence to match with the current sequence.
	   *  @return {Pattern} Pattern object that matches when both observable sequences have an available value.
	   */observableProto.and=function(right){return new Pattern([this,right]);}; /**
	   *  Matches when the observable sequence has an available value and projects the value.
	   *
	   *  @param {Function} selector Selector that will be invoked for values in the source sequence.
	   *  @returns {Plan} Plan that produces the projected values, to be fed (with other plans) to the when operator.
	   */observableProto.thenDo=function(selector){return new Pattern([this]).thenDo(selector);}; /**
	   *  Joins together the results from several patterns.
	   *
	   *  @param plans A series of plans (specified as an Array of as a series of arguments) created by use of the Then operator on patterns.
	   *  @returns {Observable} Observable sequence with the results form matching several patterns.
	   */Observable.when=function(){var len=arguments.length,plans;if(Array.isArray(arguments[0])){plans=arguments[0];}else {plans=new Array(len);for(var i=0;i<len;i++){plans[i]=arguments[i];}}return new AnonymousObservable(function(o){var activePlans=[],externalSubscriptions=new Map();var outObserver=observerCreate(function(x){o.onNext(x);},function(err){externalSubscriptions.forEach(function(v){v.onError(err);});o.onError(err);},function(x){o.onCompleted();});try{for(var i=0,len=plans.length;i<len;i++){activePlans.push(plans[i].activate(externalSubscriptions,outObserver,function(activePlan){var idx=activePlans.indexOf(activePlan);activePlans.splice(idx,1);activePlans.length===0&&o.onCompleted();}));}}catch(e){return observableThrow(e).subscribe(o);}var group=new CompositeDisposable();externalSubscriptions.forEach(function(joinObserver){joinObserver.subscribe();group.add(joinObserver);});return group;});};var TimerObservable=function(__super__){inherits(TimerObservable,__super__);function TimerObservable(dt,s){this._dt=dt;this._s=s;__super__.call(this);}TimerObservable.prototype.subscribeCore=function(o){return this._s.scheduleFuture(o,this._dt,scheduleMethod);};function scheduleMethod(s,o){o.onNext(0);o.onCompleted();}return TimerObservable;}(ObservableBase);function _observableTimer(dueTime,scheduler){return new TimerObservable(dueTime,scheduler);}function observableTimerDateAndPeriod(dueTime,period,scheduler){return new AnonymousObservable(function(observer){var d=dueTime,p=normalizeTime(period);return scheduler.scheduleRecursiveFuture(0,d,function(count,self){if(p>0){var now=scheduler.now();d=new Date(d.getTime()+p);d.getTime()<=now&&(d=new Date(now+p));}observer.onNext(count);self(count+1,new Date(d));});});}function observableTimerTimeSpanAndPeriod(dueTime,period,scheduler){return dueTime===period?new AnonymousObservable(function(observer){return scheduler.schedulePeriodic(0,period,function(count){observer.onNext(count);return count+1;});}):observableDefer(function(){return observableTimerDateAndPeriod(new Date(scheduler.now()+dueTime),period,scheduler);});} /**
	   *  Returns an observable sequence that produces a value after each period.
	   *
	   * @example
	   *  1 - res = Rx.Observable.interval(1000);
	   *  2 - res = Rx.Observable.interval(1000, Rx.Scheduler.timeout);
	   *
	   * @param {Number} period Period for producing the values in the resulting sequence (specified as an integer denoting milliseconds).
	   * @param {Scheduler} [scheduler] Scheduler to run the timer on. If not specified, Rx.Scheduler.timeout is used.
	   * @returns {Observable} An observable sequence that produces a value after each period.
	   */var observableinterval=Observable.interval=function(period,scheduler){return observableTimerTimeSpanAndPeriod(period,period,isScheduler(scheduler)?scheduler:defaultScheduler);}; /**
	   *  Returns an observable sequence that produces a value after dueTime has elapsed and then after each period.
	   * @param {Number} dueTime Absolute (specified as a Date object) or relative time (specified as an integer denoting milliseconds) at which to produce the first value.
	   * @param {Mixed} [periodOrScheduler]  Period to produce subsequent values (specified as an integer denoting milliseconds), or the scheduler to run the timer on. If not specified, the resulting timer is not recurring.
	   * @param {Scheduler} [scheduler]  Scheduler to run the timer on. If not specified, the timeout scheduler is used.
	   * @returns {Observable} An observable sequence that produces a value after due time has elapsed and then each period.
	   */var observableTimer=Observable.timer=function(dueTime,periodOrScheduler,scheduler){var period;isScheduler(scheduler)||(scheduler=defaultScheduler);if(periodOrScheduler!=null&&typeof periodOrScheduler==='number'){period=periodOrScheduler;}else if(isScheduler(periodOrScheduler)){scheduler=periodOrScheduler;}if((dueTime instanceof Date||typeof dueTime==='number')&&period===undefined){return _observableTimer(dueTime,scheduler);}if(dueTime instanceof Date&&period!==undefined){return observableTimerDateAndPeriod(dueTime,periodOrScheduler,scheduler);}return observableTimerTimeSpanAndPeriod(dueTime,period,scheduler);};function observableDelayRelative(source,dueTime,scheduler){return new AnonymousObservable(function(o){var active=false,cancelable=new SerialDisposable(),exception=null,q=[],running=false,subscription;subscription=source.materialize().timestamp(scheduler).subscribe(function(notification){var d,shouldRun;if(notification.value.kind==='E'){q=[];q.push(notification);exception=notification.value.error;shouldRun=!running;}else {q.push({value:notification.value,timestamp:notification.timestamp+dueTime});shouldRun=!active;active=true;}if(shouldRun){if(exception!==null){o.onError(exception);}else {d=new SingleAssignmentDisposable();cancelable.setDisposable(d);d.setDisposable(scheduler.scheduleRecursiveFuture(null,dueTime,function(_,self){var e,recurseDueTime,result,shouldRecurse;if(exception!==null){return;}running=true;do {result=null;if(q.length>0&&q[0].timestamp-scheduler.now()<=0){result=q.shift().value;}if(result!==null){result.accept(o);}}while(result!==null);shouldRecurse=false;recurseDueTime=0;if(q.length>0){shouldRecurse=true;recurseDueTime=Math.max(0,q[0].timestamp-scheduler.now());}else {active=false;}e=exception;running=false;if(e!==null){o.onError(e);}else if(shouldRecurse){self(null,recurseDueTime);}}));}}});return new BinaryDisposable(subscription,cancelable);},source);}function observableDelayAbsolute(source,dueTime,scheduler){return observableDefer(function(){return observableDelayRelative(source,dueTime-scheduler.now(),scheduler);});}function delayWithSelector(source,subscriptionDelay,delayDurationSelector){var subDelay,selector;if(isFunction(subscriptionDelay)){selector=subscriptionDelay;}else {subDelay=subscriptionDelay;selector=delayDurationSelector;}return new AnonymousObservable(function(o){var delays=new CompositeDisposable(),atEnd=false,subscription=new SerialDisposable();function start(){subscription.setDisposable(source.subscribe(function(x){var delay=tryCatch(selector)(x);if(delay===errorObj){return o.onError(delay.e);}var d=new SingleAssignmentDisposable();delays.add(d);d.setDisposable(delay.subscribe(function(){o.onNext(x);delays.remove(d);done();},function(e){o.onError(e);},function(){o.onNext(x);delays.remove(d);done();}));},function(e){o.onError(e);},function(){atEnd=true;subscription.dispose();done();}));}function done(){atEnd&&delays.length===0&&o.onCompleted();}if(!subDelay){start();}else {subscription.setDisposable(subDelay.subscribe(start,function(e){o.onError(e);},start));}return new BinaryDisposable(subscription,delays);},source);} /**
	   *  Time shifts the observable sequence by dueTime.
	   *  The relative time intervals between the values are preserved.
	   *
	   * @param {Number} dueTime Absolute (specified as a Date object) or relative time (specified as an integer denoting milliseconds) by which to shift the observable sequence.
	   * @param {Scheduler} [scheduler] Scheduler to run the delay timers on. If not specified, the timeout scheduler is used.
	   * @returns {Observable} Time-shifted sequence.
	   */observableProto.delay=function(){var firstArg=arguments[0];if(typeof firstArg==='number'||firstArg instanceof Date){var dueTime=firstArg,scheduler=arguments[1];isScheduler(scheduler)||(scheduler=defaultScheduler);return dueTime instanceof Date?observableDelayAbsolute(this,dueTime,scheduler):observableDelayRelative(this,dueTime,scheduler);}else if(Observable.isObservable(firstArg)||isFunction(firstArg)){return delayWithSelector(this,firstArg,arguments[1]);}else {throw new Error('Invalid arguments');}};var DebounceObservable=function(__super__){inherits(DebounceObservable,__super__);function DebounceObservable(source,dt,s){isScheduler(s)||(s=defaultScheduler);this.source=source;this._dt=dt;this._s=s;__super__.call(this);}DebounceObservable.prototype.subscribeCore=function(o){var cancelable=new SerialDisposable();return new BinaryDisposable(this.source.subscribe(new DebounceObserver(o,this._dt,this._s,cancelable)),cancelable);};return DebounceObservable;}(ObservableBase);var DebounceObserver=function(__super__){inherits(DebounceObserver,__super__);function DebounceObserver(observer,dueTime,scheduler,cancelable){this._o=observer;this._d=dueTime;this._scheduler=scheduler;this._c=cancelable;this._v=null;this._hv=false;this._id=0;__super__.call(this);}function scheduleFuture(s,state){state.self._hv&&state.self._id===state.currentId&&state.self._o.onNext(state.x);state.self._hv=false;}DebounceObserver.prototype.next=function(x){this._hv=true;this._v=x;var currentId=++this._id,d=new SingleAssignmentDisposable();this._c.setDisposable(d);d.setDisposable(this._scheduler.scheduleFuture(this,this._d,function(_,self){self._hv&&self._id===currentId&&self._o.onNext(x);self._hv=false;}));};DebounceObserver.prototype.error=function(e){this._c.dispose();this._o.onError(e);this._hv=false;this._id++;};DebounceObserver.prototype.completed=function(){this._c.dispose();this._hv&&this._o.onNext(this._v);this._o.onCompleted();this._hv=false;this._id++;};return DebounceObserver;}(AbstractObserver);function debounceWithSelector(source,durationSelector){return new AnonymousObservable(function(o){var value,hasValue=false,cancelable=new SerialDisposable(),id=0;var subscription=source.subscribe(function(x){var throttle=tryCatch(durationSelector)(x);if(throttle===errorObj){return o.onError(throttle.e);}isPromise(throttle)&&(throttle=observableFromPromise(throttle));hasValue=true;value=x;id++;var currentid=id,d=new SingleAssignmentDisposable();cancelable.setDisposable(d);d.setDisposable(throttle.subscribe(function(){hasValue&&id===currentid&&o.onNext(value);hasValue=false;d.dispose();},function(e){o.onError(e);},function(){hasValue&&id===currentid&&o.onNext(value);hasValue=false;d.dispose();}));},function(e){cancelable.dispose();o.onError(e);hasValue=false;id++;},function(){cancelable.dispose();hasValue&&o.onNext(value);o.onCompleted();hasValue=false;id++;});return new BinaryDisposable(subscription,cancelable);},source);}observableProto.debounce=function(){if(isFunction(arguments[0])){return debounceWithSelector(this,arguments[0]);}else if(typeof arguments[0]==='number'){return new DebounceObservable(this,arguments[0],arguments[1]);}else {throw new Error('Invalid arguments');}}; /**
	   *  Projects each element of an observable sequence into zero or more windows which are produced based on timing information.
	   * @param {Number} timeSpan Length of each window (specified as an integer denoting milliseconds).
	   * @param {Mixed} [timeShiftOrScheduler]  Interval between creation of consecutive windows (specified as an integer denoting milliseconds), or an optional scheduler parameter. If not specified, the time shift corresponds to the timeSpan parameter, resulting in non-overlapping adjacent windows.
	   * @param {Scheduler} [scheduler]  Scheduler to run windowing timers on. If not specified, the timeout scheduler is used.
	   * @returns {Observable} An observable sequence of windows.
	   */observableProto.windowWithTime=function(timeSpan,timeShiftOrScheduler,scheduler){var source=this,timeShift;timeShiftOrScheduler==null&&(timeShift=timeSpan);isScheduler(scheduler)||(scheduler=defaultScheduler);if(typeof timeShiftOrScheduler==='number'){timeShift=timeShiftOrScheduler;}else if(isScheduler(timeShiftOrScheduler)){timeShift=timeSpan;scheduler=timeShiftOrScheduler;}return new AnonymousObservable(function(observer){var groupDisposable,nextShift=timeShift,nextSpan=timeSpan,q=[],refCountDisposable,timerD=new SerialDisposable(),totalTime=0;groupDisposable=new CompositeDisposable(timerD),refCountDisposable=new RefCountDisposable(groupDisposable);function createTimer(){var m=new SingleAssignmentDisposable(),isSpan=false,isShift=false;timerD.setDisposable(m);if(nextSpan===nextShift){isSpan=true;isShift=true;}else if(nextSpan<nextShift){isSpan=true;}else {isShift=true;}var newTotalTime=isSpan?nextSpan:nextShift,ts=newTotalTime-totalTime;totalTime=newTotalTime;if(isSpan){nextSpan+=timeShift;}if(isShift){nextShift+=timeShift;}m.setDisposable(scheduler.scheduleFuture(null,ts,function(){if(isShift){var s=new Subject();q.push(s);observer.onNext(addRef(s,refCountDisposable));}isSpan&&q.shift().onCompleted();createTimer();}));};q.push(new Subject());observer.onNext(addRef(q[0],refCountDisposable));createTimer();groupDisposable.add(source.subscribe(function(x){for(var i=0,len=q.length;i<len;i++){q[i].onNext(x);}},function(e){for(var i=0,len=q.length;i<len;i++){q[i].onError(e);}observer.onError(e);},function(){for(var i=0,len=q.length;i<len;i++){q[i].onCompleted();}observer.onCompleted();}));return refCountDisposable;},source);}; /**
	   *  Projects each element of an observable sequence into a window that is completed when either it's full or a given amount of time has elapsed.
	   * @param {Number} timeSpan Maximum time length of a window.
	   * @param {Number} count Maximum element count of a window.
	   * @param {Scheduler} [scheduler]  Scheduler to run windowing timers on. If not specified, the timeout scheduler is used.
	   * @returns {Observable} An observable sequence of windows.
	   */observableProto.windowWithTimeOrCount=function(timeSpan,count,scheduler){var source=this;isScheduler(scheduler)||(scheduler=defaultScheduler);return new AnonymousObservable(function(observer){var timerD=new SerialDisposable(),groupDisposable=new CompositeDisposable(timerD),refCountDisposable=new RefCountDisposable(groupDisposable),n=0,windowId=0,s=new Subject();function createTimer(id){var m=new SingleAssignmentDisposable();timerD.setDisposable(m);m.setDisposable(scheduler.scheduleFuture(null,timeSpan,function(){if(id!==windowId){return;}n=0;var newId=++windowId;s.onCompleted();s=new Subject();observer.onNext(addRef(s,refCountDisposable));createTimer(newId);}));}observer.onNext(addRef(s,refCountDisposable));createTimer(0);groupDisposable.add(source.subscribe(function(x){var newId=0,newWindow=false;s.onNext(x);if(++n===count){newWindow=true;n=0;newId=++windowId;s.onCompleted();s=new Subject();observer.onNext(addRef(s,refCountDisposable));}newWindow&&createTimer(newId);},function(e){s.onError(e);observer.onError(e);},function(){s.onCompleted();observer.onCompleted();}));return refCountDisposable;},source);};function toArray(x){return x.toArray();} /**
	   *  Projects each element of an observable sequence into zero or more buffers which are produced based on timing information.
	   * @param {Number} timeSpan Length of each buffer (specified as an integer denoting milliseconds).
	   * @param {Mixed} [timeShiftOrScheduler]  Interval between creation of consecutive buffers (specified as an integer denoting milliseconds), or an optional scheduler parameter. If not specified, the time shift corresponds to the timeSpan parameter, resulting in non-overlapping adjacent buffers.
	   * @param {Scheduler} [scheduler]  Scheduler to run buffer timers on. If not specified, the timeout scheduler is used.
	   * @returns {Observable} An observable sequence of buffers.
	   */observableProto.bufferWithTime=function(timeSpan,timeShiftOrScheduler,scheduler){return this.windowWithTime(timeSpan,timeShiftOrScheduler,scheduler).flatMap(toArray);};function toArray(x){return x.toArray();} /**
	   *  Projects each element of an observable sequence into a buffer that is completed when either it's full or a given amount of time has elapsed.
	   * @param {Number} timeSpan Maximum time length of a buffer.
	   * @param {Number} count Maximum element count of a buffer.
	   * @param {Scheduler} [scheduler]  Scheduler to run bufferin timers on. If not specified, the timeout scheduler is used.
	   * @returns {Observable} An observable sequence of buffers.
	   */observableProto.bufferWithTimeOrCount=function(timeSpan,count,scheduler){return this.windowWithTimeOrCount(timeSpan,count,scheduler).flatMap(toArray);};var TimeIntervalObservable=function(__super__){inherits(TimeIntervalObservable,__super__);function TimeIntervalObservable(source,s){this.source=source;this._s=s;__super__.call(this);}TimeIntervalObservable.prototype.subscribeCore=function(o){return this.source.subscribe(new TimeIntervalObserver(o,this._s));};return TimeIntervalObservable;}(ObservableBase);var TimeIntervalObserver=function(__super__){inherits(TimeIntervalObserver,__super__);function TimeIntervalObserver(o,s){this._o=o;this._s=s;this._l=s.now();__super__.call(this);}TimeIntervalObserver.prototype.next=function(x){var now=this._s.now(),span=now-this._l;this._l=now;this._o.onNext({value:x,interval:span});};TimeIntervalObserver.prototype.error=function(e){this._o.onError(e);};TimeIntervalObserver.prototype.completed=function(){this._o.onCompleted();};return TimeIntervalObserver;}(AbstractObserver); /**
	   *  Records the time interval between consecutive values in an observable sequence.
	   *
	   * @example
	   *  1 - res = source.timeInterval();
	   *  2 - res = source.timeInterval(Rx.Scheduler.timeout);
	   *
	   * @param [scheduler]  Scheduler used to compute time intervals. If not specified, the timeout scheduler is used.
	   * @returns {Observable} An observable sequence with time interval information on values.
	   */observableProto.timeInterval=function(scheduler){isScheduler(scheduler)||(scheduler=defaultScheduler);return new TimeIntervalObservable(this,scheduler);};var TimestampObservable=function(__super__){inherits(TimestampObservable,__super__);function TimestampObservable(source,s){this.source=source;this._s=s;__super__.call(this);}TimestampObservable.prototype.subscribeCore=function(o){return this.source.subscribe(new TimestampObserver(o,this._s));};return TimestampObservable;}(ObservableBase);var TimestampObserver=function(__super__){inherits(TimestampObserver,__super__);function TimestampObserver(o,s){this._o=o;this._s=s;__super__.call(this);}TimestampObserver.prototype.next=function(x){this._o.onNext({value:x,timestamp:this._s.now()});};TimestampObserver.prototype.error=function(e){this._o.onError(e);};TimestampObserver.prototype.completed=function(){this._o.onCompleted();};return TimestampObserver;}(AbstractObserver); /**
	   *  Records the timestamp for each value in an observable sequence.
	   *
	   * @example
	   *  1 - res = source.timestamp(); // produces { value: x, timestamp: ts }
	   *  2 - res = source.timestamp(Rx.Scheduler.default);
	   *
	   * @param {Scheduler} [scheduler]  Scheduler used to compute timestamps. If not specified, the default scheduler is used.
	   * @returns {Observable} An observable sequence with timestamp information on values.
	   */observableProto.timestamp=function(scheduler){isScheduler(scheduler)||(scheduler=defaultScheduler);return new TimestampObservable(this,scheduler);};var SampleObservable=function(__super__){inherits(SampleObservable,__super__);function SampleObservable(source,sampler){this.source=source;this._sampler=sampler;__super__.call(this);}SampleObservable.prototype.subscribeCore=function(o){var state={o:o,atEnd:false,value:null,hasValue:false,sourceSubscription:new SingleAssignmentDisposable()};state.sourceSubscription.setDisposable(this.source.subscribe(new SampleSourceObserver(state)));return new BinaryDisposable(state.sourceSubscription,this._sampler.subscribe(new SamplerObserver(state)));};return SampleObservable;}(ObservableBase);var SamplerObserver=function(__super__){inherits(SamplerObserver,__super__);function SamplerObserver(s){this._s=s;__super__.call(this);}SamplerObserver.prototype._handleMessage=function(){if(this._s.hasValue){this._s.hasValue=false;this._s.o.onNext(this._s.value);}this._s.atEnd&&this._s.o.onCompleted();};SamplerObserver.prototype.next=function(){this._handleMessage();};SamplerObserver.prototype.error=function(e){this._s.onError(e);};SamplerObserver.prototype.completed=function(){this._handleMessage();};return SamplerObserver;}(AbstractObserver);var SampleSourceObserver=function(__super__){inherits(SampleSourceObserver,__super__);function SampleSourceObserver(s){this._s=s;__super__.call(this);}SampleSourceObserver.prototype.next=function(x){this._s.hasValue=true;this._s.value=x;};SampleSourceObserver.prototype.error=function(e){this._s.o.onError(e);};SampleSourceObserver.prototype.completed=function(){this._s.atEnd=true;this._s.sourceSubscription.dispose();};return SampleSourceObserver;}(AbstractObserver); /**
	   *  Samples the observable sequence at each interval.
	   *
	   * @example
	   *  1 - res = source.sample(sampleObservable); // Sampler tick sequence
	   *  2 - res = source.sample(5000); // 5 seconds
	   *  2 - res = source.sample(5000, Rx.Scheduler.timeout); // 5 seconds
	   *
	   * @param {Mixed} intervalOrSampler Interval at which to sample (specified as an integer denoting milliseconds) or Sampler Observable.
	   * @param {Scheduler} [scheduler]  Scheduler to run the sampling timer on. If not specified, the timeout scheduler is used.
	   * @returns {Observable} Sampled observable sequence.
	   */observableProto.sample=function(intervalOrSampler,scheduler){isScheduler(scheduler)||(scheduler=defaultScheduler);return typeof intervalOrSampler==='number'?new SampleObservable(this,observableinterval(intervalOrSampler,scheduler)):new SampleObservable(this,intervalOrSampler);};var TimeoutError=Rx.TimeoutError=function(message){this.message=message||'Timeout has occurred';this.name='TimeoutError';Error.call(this);};TimeoutError.prototype=Object.create(Error.prototype);function timeoutWithSelector(source,firstTimeout,timeoutDurationSelector,other){if(isFunction(firstTimeout)){other=timeoutDurationSelector;timeoutDurationSelector=firstTimeout;firstTimeout=observableNever();}Observable.isObservable(other)||(other=observableThrow(new TimeoutError()));return new AnonymousObservable(function(o){var subscription=new SerialDisposable(),timer=new SerialDisposable(),original=new SingleAssignmentDisposable();subscription.setDisposable(original);var id=0,switched=false;function setTimer(timeout){var myId=id,d=new SingleAssignmentDisposable();function timerWins(){switched=myId===id;return switched;}timer.setDisposable(d);d.setDisposable(timeout.subscribe(function(){timerWins()&&subscription.setDisposable(other.subscribe(o));d.dispose();},function(e){timerWins()&&o.onError(e);},function(){timerWins()&&subscription.setDisposable(other.subscribe(o));}));};setTimer(firstTimeout);function oWins(){var res=!switched;if(res){id++;}return res;}original.setDisposable(source.subscribe(function(x){if(oWins()){o.onNext(x);var timeout=tryCatch(timeoutDurationSelector)(x);if(timeout===errorObj){return o.onError(timeout.e);}setTimer(isPromise(timeout)?observableFromPromise(timeout):timeout);}},function(e){oWins()&&o.onError(e);},function(){oWins()&&o.onCompleted();}));return new BinaryDisposable(subscription,timer);},source);}function timeout(source,dueTime,other,scheduler){if(isScheduler(other)){scheduler=other;other=observableThrow(new TimeoutError());}if(other instanceof Error){other=observableThrow(other);}isScheduler(scheduler)||(scheduler=defaultScheduler);Observable.isObservable(other)||(other=observableThrow(new TimeoutError()));return new AnonymousObservable(function(o){var id=0,original=new SingleAssignmentDisposable(),subscription=new SerialDisposable(),switched=false,timer=new SerialDisposable();subscription.setDisposable(original);function createTimer(){var myId=id;timer.setDisposable(scheduler.scheduleFuture(null,dueTime,function(){switched=id===myId;if(switched){isPromise(other)&&(other=observableFromPromise(other));subscription.setDisposable(other.subscribe(o));}}));}createTimer();original.setDisposable(source.subscribe(function(x){if(!switched){id++;o.onNext(x);createTimer();}},function(e){if(!switched){id++;o.onError(e);}},function(){if(!switched){id++;o.onCompleted();}}));return new BinaryDisposable(subscription,timer);},source);}observableProto.timeout=function(){var firstArg=arguments[0];if(firstArg instanceof Date||typeof firstArg==='number'){return timeout(this,firstArg,arguments[1],arguments[2]);}else if(Observable.isObservable(firstArg)||isFunction(firstArg)){return timeoutWithSelector(this,firstArg,arguments[1],arguments[2]);}else {throw new Error('Invalid arguments');}};var GenerateAbsoluteObservable=function(__super__){inherits(GenerateAbsoluteObservable,__super__);function GenerateAbsoluteObservable(state,cndFn,itrFn,resFn,timeFn,s){this._state=state;this._cndFn=cndFn;this._itrFn=itrFn;this._resFn=resFn;this._timeFn=timeFn;this._s=s;__super__.call(this);}function scheduleRecursive(state,recurse){state.hasResult&&state.o.onNext(state.result);if(state.first){state.first=false;}else {state.newState=tryCatch(state.self._itrFn)(state.newState);if(state.newState===errorObj){return state.o.onError(state.newState.e);}}state.hasResult=tryCatch(state.self._cndFn)(state.newState);if(state.hasResult===errorObj){return state.o.onError(state.hasResult.e);}if(state.hasResult){state.result=tryCatch(state.self._resFn)(state.newState);if(state.result===errorObj){return state.o.onError(state.result.e);}var time=tryCatch(state.self._timeFn)(state.newState);if(time===errorObj){return state.o.onError(time.e);}recurse(state,time);}else {state.o.onCompleted();}}GenerateAbsoluteObservable.prototype.subscribeCore=function(o){var state={o:o,self:this,newState:this._state,first:true,hasResult:false};return this._s.scheduleRecursiveFuture(state,new Date(this._s.now()),scheduleRecursive);};return GenerateAbsoluteObservable;}(ObservableBase); /**
	   *  GenerateAbsolutes an observable sequence by iterating a state from an initial state until the condition fails.
	   *
	   * @example
	   *  res = source.generateWithAbsoluteTime(0,
	   *      function (x) { return return true; },
	   *      function (x) { return x + 1; },
	   *      function (x) { return x; },
	   *      function (x) { return new Date(); }
	   *  });
	   *
	   * @param {Mixed} initialState Initial state.
	   * @param {Function} condition Condition to terminate generation (upon returning false).
	   * @param {Function} iterate Iteration step function.
	   * @param {Function} resultSelector Selector function for results produced in the sequence.
	   * @param {Function} timeSelector Time selector function to control the speed of values being produced each iteration, returning Date values.
	   * @param {Scheduler} [scheduler]  Scheduler on which to run the generator loop. If not specified, the timeout scheduler is used.
	   * @returns {Observable} The generated sequence.
	   */Observable.generateWithAbsoluteTime=function(initialState,condition,iterate,resultSelector,timeSelector,scheduler){isScheduler(scheduler)||(scheduler=defaultScheduler);return new GenerateAbsoluteObservable(initialState,condition,iterate,resultSelector,timeSelector,scheduler);};var GenerateRelativeObservable=function(__super__){inherits(GenerateRelativeObservable,__super__);function GenerateRelativeObservable(state,cndFn,itrFn,resFn,timeFn,s){this._state=state;this._cndFn=cndFn;this._itrFn=itrFn;this._resFn=resFn;this._timeFn=timeFn;this._s=s;__super__.call(this);}function scheduleRecursive(state,recurse){state.hasResult&&state.o.onNext(state.result);if(state.first){state.first=false;}else {state.newState=tryCatch(state.self._itrFn)(state.newState);if(state.newState===errorObj){return state.o.onError(state.newState.e);}}state.hasResult=tryCatch(state.self._cndFn)(state.newState);if(state.hasResult===errorObj){return state.o.onError(state.hasResult.e);}if(state.hasResult){state.result=tryCatch(state.self._resFn)(state.newState);if(state.result===errorObj){return state.o.onError(state.result.e);}var time=tryCatch(state.self._timeFn)(state.newState);if(time===errorObj){return state.o.onError(time.e);}recurse(state,time);}else {state.o.onCompleted();}}GenerateRelativeObservable.prototype.subscribeCore=function(o){var state={o:o,self:this,newState:this._state,first:true,hasResult:false};return this._s.scheduleRecursiveFuture(state,0,scheduleRecursive);};return GenerateRelativeObservable;}(ObservableBase); /**
	   *  Generates an observable sequence by iterating a state from an initial state until the condition fails.
	   *
	   * @example
	   *  res = source.generateWithRelativeTime(0,
	   *      function (x) { return return true; },
	   *      function (x) { return x + 1; },
	   *      function (x) { return x; },
	   *      function (x) { return 500; }
	   *  );
	   *
	   * @param {Mixed} initialState Initial state.
	   * @param {Function} condition Condition to terminate generation (upon returning false).
	   * @param {Function} iterate Iteration step function.
	   * @param {Function} resultSelector Selector function for results produced in the sequence.
	   * @param {Function} timeSelector Time selector function to control the speed of values being produced each iteration, returning integer values denoting milliseconds.
	   * @param {Scheduler} [scheduler]  Scheduler on which to run the generator loop. If not specified, the timeout scheduler is used.
	   * @returns {Observable} The generated sequence.
	   */Observable.generateWithRelativeTime=function(initialState,condition,iterate,resultSelector,timeSelector,scheduler){isScheduler(scheduler)||(scheduler=defaultScheduler);return new GenerateRelativeObservable(initialState,condition,iterate,resultSelector,timeSelector,scheduler);};var DelaySubscription=function(__super__){inherits(DelaySubscription,__super__);function DelaySubscription(source,dt,s){this.source=source;this._dt=dt;this._s=s;__super__.call(this);}DelaySubscription.prototype.subscribeCore=function(o){var d=new SerialDisposable();d.setDisposable(this._s.scheduleFuture([this.source,o,d],this._dt,scheduleMethod));return d;};function scheduleMethod(s,state){var source=state[0],o=state[1],d=state[2];d.setDisposable(source.subscribe(o));}return DelaySubscription;}(ObservableBase); /**
	   *  Time shifts the observable sequence by delaying the subscription with the specified relative time duration, using the specified scheduler to run timers.
	   *
	   * @example
	   *  1 - res = source.delaySubscription(5000); // 5s
	   *  2 - res = source.delaySubscription(5000, Rx.Scheduler.default); // 5 seconds
	   *
	   * @param {Number} dueTime Relative or absolute time shift of the subscription.
	   * @param {Scheduler} [scheduler]  Scheduler to run the subscription delay timer on. If not specified, the timeout scheduler is used.
	   * @returns {Observable} Time-shifted sequence.
	   */observableProto.delaySubscription=function(dueTime,scheduler){isScheduler(scheduler)||(scheduler=defaultScheduler);return new DelaySubscription(this,dueTime,scheduler);};var SkipLastWithTimeObservable=function(__super__){inherits(SkipLastWithTimeObservable,__super__);function SkipLastWithTimeObservable(source,d,s){this.source=source;this._d=d;this._s=s;__super__.call(this);}SkipLastWithTimeObservable.prototype.subscribeCore=function(o){return this.source.subscribe(new SkipLastWithTimeObserver(o,this));};return SkipLastWithTimeObservable;}(ObservableBase);var SkipLastWithTimeObserver=function(__super__){inherits(SkipLastWithTimeObserver,__super__);function SkipLastWithTimeObserver(o,p){this._o=o;this._s=p._s;this._d=p._d;this._q=[];__super__.call(this);}SkipLastWithTimeObserver.prototype.next=function(x){var now=this._s.now();this._q.push({interval:now,value:x});while(this._q.length>0&&now-this._q[0].interval>=this._d){this._o.onNext(this._q.shift().value);}};SkipLastWithTimeObserver.prototype.error=function(e){this._o.onError(e);};SkipLastWithTimeObserver.prototype.completed=function(){var now=this._s.now();while(this._q.length>0&&now-this._q[0].interval>=this._d){this._o.onNext(this._q.shift().value);}this._o.onCompleted();};return SkipLastWithTimeObserver;}(AbstractObserver); /**
	   *  Skips elements for the specified duration from the end of the observable source sequence, using the specified scheduler to run timers.
	   * @description
	   *  This operator accumulates a queue with a length enough to store elements received during the initial duration window.
	   *  As more elements are received, elements older than the specified duration are taken from the queue and produced on the
	   *  result sequence. This causes elements to be delayed with duration.
	   * @param {Number} duration Duration for skipping elements from the end of the sequence.
	   * @param {Scheduler} [scheduler]  Scheduler to run the timer on. If not specified, defaults to Rx.Scheduler.timeout
	   * @returns {Observable} An observable sequence with the elements skipped during the specified duration from the end of the source sequence.
	   */observableProto.skipLastWithTime=function(duration,scheduler){isScheduler(scheduler)||(scheduler=defaultScheduler);return new SkipLastWithTimeObservable(this,duration,scheduler);};var TakeLastWithTimeObservable=function(__super__){inherits(TakeLastWithTimeObservable,__super__);function TakeLastWithTimeObservable(source,d,s){this.source=source;this._d=d;this._s=s;__super__.call(this);}TakeLastWithTimeObservable.prototype.subscribeCore=function(o){return this.source.subscribe(new TakeLastWithTimeObserver(o,this._d,this._s));};return TakeLastWithTimeObservable;}(ObservableBase);var TakeLastWithTimeObserver=function(__super__){inherits(TakeLastWithTimeObserver,__super__);function TakeLastWithTimeObserver(o,d,s){this._o=o;this._d=d;this._s=s;this._q=[];__super__.call(this);}TakeLastWithTimeObserver.prototype.next=function(x){var now=this._s.now();this._q.push({interval:now,value:x});while(this._q.length>0&&now-this._q[0].interval>=this._d){this._q.shift();}};TakeLastWithTimeObserver.prototype.error=function(e){this._o.onError(e);};TakeLastWithTimeObserver.prototype.completed=function(){var now=this._s.now();while(this._q.length>0){var next=this._q.shift();if(now-next.interval<=this._d){this._o.onNext(next.value);}}this._o.onCompleted();};return TakeLastWithTimeObserver;}(AbstractObserver); /**
	   *  Returns elements within the specified duration from the end of the observable source sequence, using the specified schedulers to run timers and to drain the collected elements.
	   * @description
	   *  This operator accumulates a queue with a length enough to store elements received during the initial duration window.
	   *  As more elements are received, elements older than the specified duration are taken from the queue and produced on the
	   *  result sequence. This causes elements to be delayed with duration.
	   * @param {Number} duration Duration for taking elements from the end of the sequence.
	   * @param {Scheduler} [scheduler]  Scheduler to run the timer on. If not specified, defaults to Rx.Scheduler.timeout.
	   * @returns {Observable} An observable sequence with the elements taken during the specified duration from the end of the source sequence.
	   */observableProto.takeLastWithTime=function(duration,scheduler){isScheduler(scheduler)||(scheduler=defaultScheduler);return new TakeLastWithTimeObservable(this,duration,scheduler);}; /**
	   *  Returns an array with the elements within the specified duration from the end of the observable source sequence, using the specified scheduler to run timers.
	   * @description
	   *  This operator accumulates a queue with a length enough to store elements received during the initial duration window.
	   *  As more elements are received, elements older than the specified duration are taken from the queue and produced on the
	   *  result sequence. This causes elements to be delayed with duration.
	   * @param {Number} duration Duration for taking elements from the end of the sequence.
	   * @param {Scheduler} scheduler Scheduler to run the timer on. If not specified, defaults to Rx.Scheduler.timeout.
	   * @returns {Observable} An observable sequence containing a single array with the elements taken during the specified duration from the end of the source sequence.
	   */observableProto.takeLastBufferWithTime=function(duration,scheduler){var source=this;isScheduler(scheduler)||(scheduler=defaultScheduler);return new AnonymousObservable(function(o){var q=[];return source.subscribe(function(x){var now=scheduler.now();q.push({interval:now,value:x});while(q.length>0&&now-q[0].interval>=duration){q.shift();}},function(e){o.onError(e);},function(){var now=scheduler.now(),res=[];while(q.length>0){var next=q.shift();now-next.interval<=duration&&res.push(next.value);}o.onNext(res);o.onCompleted();});},source);};var TakeWithTimeObservable=function(__super__){inherits(TakeWithTimeObservable,__super__);function TakeWithTimeObservable(source,d,s){this.source=source;this._d=d;this._s=s;__super__.call(this);}function scheduleMethod(s,o){o.onCompleted();}TakeWithTimeObservable.prototype.subscribeCore=function(o){return new BinaryDisposable(this._s.scheduleFuture(o,this._d,scheduleMethod),this.source.subscribe(o));};return TakeWithTimeObservable;}(ObservableBase); /**
	   *  Takes elements for the specified duration from the start of the observable source sequence, using the specified scheduler to run timers.
	   *
	   * @example
	   *  1 - res = source.takeWithTime(5000,  [optional scheduler]);
	   * @description
	   *  This operator accumulates a queue with a length enough to store elements received during the initial duration window.
	   *  As more elements are received, elements older than the specified duration are taken from the queue and produced on the
	   *  result sequence. This causes elements to be delayed with duration.
	   * @param {Number} duration Duration for taking elements from the start of the sequence.
	   * @param {Scheduler} scheduler Scheduler to run the timer on. If not specified, defaults to Rx.Scheduler.timeout.
	   * @returns {Observable} An observable sequence with the elements taken during the specified duration from the start of the source sequence.
	   */observableProto.takeWithTime=function(duration,scheduler){isScheduler(scheduler)||(scheduler=defaultScheduler);return new TakeWithTimeObservable(this,duration,scheduler);};var SkipWithTimeObservable=function(__super__){inherits(SkipWithTimeObservable,__super__);function SkipWithTimeObservable(source,d,s){this.source=source;this._d=d;this._s=s;this._open=false;__super__.call(this);}function scheduleMethod(s,self){self._open=true;}SkipWithTimeObservable.prototype.subscribeCore=function(o){return new BinaryDisposable(this._s.scheduleFuture(this,this._d,scheduleMethod),this.source.subscribe(new SkipWithTimeObserver(o,this)));};return SkipWithTimeObservable;}(ObservableBase);var SkipWithTimeObserver=function(__super__){inherits(SkipWithTimeObserver,__super__);function SkipWithTimeObserver(o,p){this._o=o;this._p=p;__super__.call(this);}SkipWithTimeObserver.prototype.next=function(x){this._p._open&&this._o.onNext(x);};SkipWithTimeObserver.prototype.error=function(e){this._o.onError(e);};SkipWithTimeObserver.prototype.completed=function(){this._o.onCompleted();};return SkipWithTimeObserver;}(AbstractObserver); /**
	   *  Skips elements for the specified duration from the start of the observable source sequence, using the specified scheduler to run timers.
	   * @description
	   *  Specifying a zero value for duration doesn't guarantee no elements will be dropped from the start of the source sequence.
	   *  This is a side-effect of the asynchrony introduced by the scheduler, where the action that causes callbacks from the source sequence to be forwarded
	   *  may not execute immediately, despite the zero due time.
	   *
	   *  Errors produced by the source sequence are always forwarded to the result sequence, even if the error occurs before the duration.
	   * @param {Number} duration Duration for skipping elements from the start of the sequence.
	   * @param {Scheduler} scheduler Scheduler to run the timer on. If not specified, defaults to Rx.Scheduler.timeout.
	   * @returns {Observable} An observable sequence with the elements skipped during the specified duration from the start of the source sequence.
	   */observableProto.skipWithTime=function(duration,scheduler){isScheduler(scheduler)||(scheduler=defaultScheduler);return new SkipWithTimeObservable(this,duration,scheduler);};var SkipUntilWithTimeObservable=function(__super__){inherits(SkipUntilWithTimeObservable,__super__);function SkipUntilWithTimeObservable(source,startTime,scheduler){this.source=source;this._st=startTime;this._s=scheduler;__super__.call(this);}function scheduleMethod(s,state){state._open=true;}SkipUntilWithTimeObservable.prototype.subscribeCore=function(o){this._open=false;return new BinaryDisposable(this._s.scheduleFuture(this,this._st,scheduleMethod),this.source.subscribe(new SkipUntilWithTimeObserver(o,this)));};return SkipUntilWithTimeObservable;}(ObservableBase);var SkipUntilWithTimeObserver=function(__super__){inherits(SkipUntilWithTimeObserver,__super__);function SkipUntilWithTimeObserver(o,p){this._o=o;this._p=p;__super__.call(this);}SkipUntilWithTimeObserver.prototype.next=function(x){this._p._open&&this._o.onNext(x);};SkipUntilWithTimeObserver.prototype.error=function(e){this._o.onError(e);};SkipUntilWithTimeObserver.prototype.completed=function(){this._o.onCompleted();};return SkipUntilWithTimeObserver;}(AbstractObserver); /**
	   *  Skips elements from the observable source sequence until the specified start time, using the specified scheduler to run timers.
	   *  Errors produced by the source sequence are always forwarded to the result sequence, even if the error occurs before the start time.
	   *
	   * @examples
	   *  1 - res = source.skipUntilWithTime(new Date(), [scheduler]);
	   *  2 - res = source.skipUntilWithTime(5000, [scheduler]);
	   * @param {Date|Number} startTime Time to start taking elements from the source sequence. If this value is less than or equal to Date(), no elements will be skipped.
	   * @param {Scheduler} [scheduler] Scheduler to run the timer on. If not specified, defaults to Rx.Scheduler.timeout.
	   * @returns {Observable} An observable sequence with the elements skipped until the specified start time.
	   */observableProto.skipUntilWithTime=function(startTime,scheduler){isScheduler(scheduler)||(scheduler=defaultScheduler);return new SkipUntilWithTimeObservable(this,startTime,scheduler);}; /**
	   *  Takes elements for the specified duration until the specified end time, using the specified scheduler to run timers.
	   * @param {Number | Date} endTime Time to stop taking elements from the source sequence. If this value is less than or equal to new Date(), the result stream will complete immediately.
	   * @param {Scheduler} [scheduler] Scheduler to run the timer on.
	   * @returns {Observable} An observable sequence with the elements taken until the specified end time.
	   */observableProto.takeUntilWithTime=function(endTime,scheduler){isScheduler(scheduler)||(scheduler=defaultScheduler);var source=this;return new AnonymousObservable(function(o){return new BinaryDisposable(scheduler.scheduleFuture(o,endTime,function(_,o){o.onCompleted();}),source.subscribe(o));},source);}; /**
	   * Returns an Observable that emits only the first item emitted by the source Observable during sequential time windows of a specified duration.
	   * @param {Number} windowDuration time to wait before emitting another item after emitting the last item
	   * @param {Scheduler} [scheduler] the Scheduler to use internally to manage the timers that handle timeout for each item. If not provided, defaults to Scheduler.timeout.
	   * @returns {Observable} An Observable that performs the throttle operation.
	   */observableProto.throttle=function(windowDuration,scheduler){isScheduler(scheduler)||(scheduler=defaultScheduler);var duration=+windowDuration||0;if(duration<=0){throw new RangeError('windowDuration cannot be less or equal zero.');}var source=this;return new AnonymousObservable(function(o){var lastOnNext=0;return source.subscribe(function(x){var now=scheduler.now();if(lastOnNext===0||now-lastOnNext>=duration){lastOnNext=now;o.onNext(x);}},function(e){o.onError(e);},function(){o.onCompleted();});},source);};var TransduceObserver=function(__super__){inherits(TransduceObserver,__super__);function TransduceObserver(o,xform){this._o=o;this._xform=xform;__super__.call(this);}TransduceObserver.prototype.next=function(x){var res=tryCatch(this._xform['@@transducer/step']).call(this._xform,this._o,x);if(res===errorObj){this._o.onError(res.e);}};TransduceObserver.prototype.error=function(e){this._o.onError(e);};TransduceObserver.prototype.completed=function(){this._xform['@@transducer/result'](this._o);};return TransduceObserver;}(AbstractObserver);function transformForObserver(o){return {'@@transducer/init':function transducerInit(){return o;},'@@transducer/step':function transducerStep(obs,input){return obs.onNext(input);},'@@transducer/result':function transducerResult(obs){return obs.onCompleted();}};} /**
	   * Executes a transducer to transform the observable sequence
	   * @param {Transducer} transducer A transducer to execute
	   * @returns {Observable} An Observable sequence containing the results from the transducer.
	   */observableProto.transduce=function(transducer){var source=this;return new AnonymousObservable(function(o){var xform=transducer(transformForObserver(o));return source.subscribe(new TransduceObserver(o,xform));},source);};var SwitchFirstObservable=function(__super__){inherits(SwitchFirstObservable,__super__);function SwitchFirstObservable(source){this.source=source;__super__.call(this);}SwitchFirstObservable.prototype.subscribeCore=function(o){var m=new SingleAssignmentDisposable(),g=new CompositeDisposable(),state={hasCurrent:false,isStopped:false,o:o,g:g};g.add(m);m.setDisposable(this.source.subscribe(new SwitchFirstObserver(state)));return g;};return SwitchFirstObservable;}(ObservableBase);var SwitchFirstObserver=function(__super__){inherits(SwitchFirstObserver,__super__);function SwitchFirstObserver(state){this._s=state;__super__.call(this);}SwitchFirstObserver.prototype.next=function(x){if(!this._s.hasCurrent){this._s.hasCurrent=true;isPromise(x)&&(x=observableFromPromise(x));var inner=new SingleAssignmentDisposable();this._s.g.add(inner);inner.setDisposable(x.subscribe(new InnerObserver(this._s,inner)));}};SwitchFirstObserver.prototype.error=function(e){this._s.o.onError(e);};SwitchFirstObserver.prototype.completed=function(){this._s.isStopped=true;!this._s.hasCurrent&&this._s.g.length===1&&this._s.o.onCompleted();};inherits(InnerObserver,__super__);function InnerObserver(state,inner){this._s=state;this._i=inner;__super__.call(this);}InnerObserver.prototype.next=function(x){this._s.o.onNext(x);};InnerObserver.prototype.error=function(e){this._s.o.onError(e);};InnerObserver.prototype.completed=function(){this._s.g.remove(this._i);this._s.hasCurrent=false;this._s.isStopped&&this._s.g.length===1&&this._s.o.onCompleted();};return SwitchFirstObserver;}(AbstractObserver); /**
	   * Performs a exclusive waiting for the first to finish before subscribing to another observable.
	   * Observables that come in between subscriptions will be dropped on the floor.
	   * @returns {Observable} A exclusive observable with only the results that happen when subscribed.
	   */observableProto.switchFirst=function(){return new SwitchFirstObservable(this);};observableProto.flatMapFirst=observableProto.selectManyFirst=function(selector,resultSelector,thisArg){return new FlatMapObservable(this,selector,resultSelector,thisArg).switchFirst();};Rx.Observable.prototype.flatMapWithMaxConcurrent=function(limit,selector,resultSelector,thisArg){return new FlatMapObservable(this,selector,resultSelector,thisArg).merge(limit);}; /** Provides a set of extension methods for virtual time scheduling. */var VirtualTimeScheduler=Rx.VirtualTimeScheduler=function(__super__){inherits(VirtualTimeScheduler,__super__); /**
	     * Creates a new virtual time scheduler with the specified initial clock value and absolute time comparer.
	     *
	     * @constructor
	     * @param {Number} initialClock Initial value for the clock.
	     * @param {Function} comparer Comparer to determine causality of events based on absolute time.
	     */function VirtualTimeScheduler(initialClock,comparer){this.clock=initialClock;this.comparer=comparer;this.isEnabled=false;this.queue=new PriorityQueue(1024);__super__.call(this);}var VirtualTimeSchedulerPrototype=VirtualTimeScheduler.prototype;VirtualTimeSchedulerPrototype.now=function(){return this.toAbsoluteTime(this.clock);};VirtualTimeSchedulerPrototype.schedule=function(state,action){return this.scheduleAbsolute(state,this.clock,action);};VirtualTimeSchedulerPrototype.scheduleFuture=function(state,dueTime,action){var dt=dueTime instanceof Date?this.toRelativeTime(dueTime-this.now()):this.toRelativeTime(dueTime);return this.scheduleRelative(state,dt,action);}; /**
	     * Adds a relative time value to an absolute time value.
	     * @param {Number} absolute Absolute virtual time value.
	     * @param {Number} relative Relative virtual time value to add.
	     * @return {Number} Resulting absolute virtual time sum value.
	     */VirtualTimeSchedulerPrototype.add=notImplemented; /**
	     * Converts an absolute time to a number
	     * @param {Any} The absolute time.
	     * @returns {Number} The absolute time in ms
	     */VirtualTimeSchedulerPrototype.toAbsoluteTime=notImplemented; /**
	     * Converts the TimeSpan value to a relative virtual time value.
	     * @param {Number} timeSpan TimeSpan value to convert.
	     * @return {Number} Corresponding relative virtual time value.
	     */VirtualTimeSchedulerPrototype.toRelativeTime=notImplemented; /**
	     * Schedules a periodic piece of work by dynamically discovering the scheduler's capabilities. The periodic task will be emulated using recursive scheduling.
	     * @param {Mixed} state Initial state passed to the action upon the first iteration.
	     * @param {Number} period Period for running the work periodically.
	     * @param {Function} action Action to be executed, potentially updating the state.
	     * @returns {Disposable} The disposable object used to cancel the scheduled recurring action (best effort).
	     */VirtualTimeSchedulerPrototype.schedulePeriodic=function(state,period,action){var s=new SchedulePeriodicRecursive(this,state,period,action);return s.start();}; /**
	     * Schedules an action to be executed after dueTime.
	     * @param {Mixed} state State passed to the action to be executed.
	     * @param {Number} dueTime Relative time after which to execute the action.
	     * @param {Function} action Action to be executed.
	     * @returns {Disposable} The disposable object used to cancel the scheduled action (best effort).
	     */VirtualTimeSchedulerPrototype.scheduleRelative=function(state,dueTime,action){var runAt=this.add(this.clock,dueTime);return this.scheduleAbsolute(state,runAt,action);}; /**
	     * Starts the virtual time scheduler.
	     */VirtualTimeSchedulerPrototype.start=function(){if(!this.isEnabled){this.isEnabled=true;do {var next=this.getNext();if(next!==null){this.comparer(next.dueTime,this.clock)>0&&(this.clock=next.dueTime);next.invoke();}else {this.isEnabled=false;}}while(this.isEnabled);}}; /**
	     * Stops the virtual time scheduler.
	     */VirtualTimeSchedulerPrototype.stop=function(){this.isEnabled=false;}; /**
	     * Advances the scheduler's clock to the specified time, running all work till that point.
	     * @param {Number} time Absolute time to advance the scheduler's clock to.
	     */VirtualTimeSchedulerPrototype.advanceTo=function(time){var dueToClock=this.comparer(this.clock,time);if(this.comparer(this.clock,time)>0){throw new ArgumentOutOfRangeError();}if(dueToClock===0){return;}if(!this.isEnabled){this.isEnabled=true;do {var next=this.getNext();if(next!==null&&this.comparer(next.dueTime,time)<=0){this.comparer(next.dueTime,this.clock)>0&&(this.clock=next.dueTime);next.invoke();}else {this.isEnabled=false;}}while(this.isEnabled);this.clock=time;}}; /**
	     * Advances the scheduler's clock by the specified relative time, running all work scheduled for that timespan.
	     * @param {Number} time Relative time to advance the scheduler's clock by.
	     */VirtualTimeSchedulerPrototype.advanceBy=function(time){var dt=this.add(this.clock,time),dueToClock=this.comparer(this.clock,dt);if(dueToClock>0){throw new ArgumentOutOfRangeError();}if(dueToClock===0){return;}this.advanceTo(dt);}; /**
	     * Advances the scheduler's clock by the specified relative time.
	     * @param {Number} time Relative time to advance the scheduler's clock by.
	     */VirtualTimeSchedulerPrototype.sleep=function(time){var dt=this.add(this.clock,time);if(this.comparer(this.clock,dt)>=0){throw new ArgumentOutOfRangeError();}this.clock=dt;}; /**
	     * Gets the next scheduled item to be executed.
	     * @returns {ScheduledItem} The next scheduled item.
	     */VirtualTimeSchedulerPrototype.getNext=function(){while(this.queue.length>0){var next=this.queue.peek();if(next.isCancelled()){this.queue.dequeue();}else {return next;}}return null;}; /**
	     * Schedules an action to be executed at dueTime.
	     * @param {Mixed} state State passed to the action to be executed.
	     * @param {Number} dueTime Absolute time at which to execute the action.
	     * @param {Function} action Action to be executed.
	     * @returns {Disposable} The disposable object used to cancel the scheduled action (best effort).
	     */VirtualTimeSchedulerPrototype.scheduleAbsolute=function(state,dueTime,action){var self=this;function run(scheduler,state1){self.queue.remove(si);return action(scheduler,state1);}var si=new ScheduledItem(this,state,run,dueTime,this.comparer);this.queue.enqueue(si);return si.disposable;};return VirtualTimeScheduler;}(Scheduler); /** Provides a virtual time scheduler that uses Date for absolute time and number for relative time. */Rx.HistoricalScheduler=function(__super__){inherits(HistoricalScheduler,__super__); /**
	     * Creates a new historical scheduler with the specified initial clock value.
	     * @constructor
	     * @param {Number} initialClock Initial value for the clock.
	     * @param {Function} comparer Comparer to determine causality of events based on absolute time.
	     */function HistoricalScheduler(initialClock,comparer){var clock=initialClock==null?0:initialClock;var cmp=comparer||defaultSubComparer;__super__.call(this,clock,cmp);}var HistoricalSchedulerProto=HistoricalScheduler.prototype; /**
	     * Adds a relative time value to an absolute time value.
	     * @param {Number} absolute Absolute virtual time value.
	     * @param {Number} relative Relative virtual time value to add.
	     * @return {Number} Resulting absolute virtual time sum value.
	     */HistoricalSchedulerProto.add=function(absolute,relative){return absolute+relative;};HistoricalSchedulerProto.toAbsoluteTime=function(absolute){return new Date(absolute).getTime();}; /**
	     * Converts the TimeSpan value to a relative virtual time value.
	     * @memberOf HistoricalScheduler
	     * @param {Number} timeSpan TimeSpan value to convert.
	     * @return {Number} Corresponding relative virtual time value.
	     */HistoricalSchedulerProto.toRelativeTime=function(timeSpan){return timeSpan;};return HistoricalScheduler;}(Rx.VirtualTimeScheduler);function OnNextPredicate(predicate){this.predicate=predicate;}OnNextPredicate.prototype.equals=function(other){if(other===this){return true;}if(other==null){return false;}if(other.kind!=='N'){return false;}return this.predicate(other.value);};function OnErrorPredicate(predicate){this.predicate=predicate;}OnErrorPredicate.prototype.equals=function(other){if(other===this){return true;}if(other==null){return false;}if(other.kind!=='E'){return false;}return this.predicate(other.error);};var ReactiveTest=Rx.ReactiveTest={ /** Default virtual time used for creation of observable sequences in unit tests. */created:100, /** Default virtual time used to subscribe to observable sequences in unit tests. */subscribed:200, /** Default virtual time used to dispose subscriptions in unit tests. */disposed:1000, /**
	   * Factory method for an OnNext notification record at a given time with a given value or a predicate function.
	   *
	   * 1 - ReactiveTest.onNext(200, 42);
	   * 2 - ReactiveTest.onNext(200, function (x) { return x.length == 2; });
	   *
	   * @param ticks Recorded virtual time the OnNext notification occurs.
	   * @param value Recorded value stored in the OnNext notification or a predicate.
	   * @return Recorded OnNext notification.
	   */onNext:function onNext(ticks,value){return typeof value==='function'?new Recorded(ticks,new OnNextPredicate(value)):new Recorded(ticks,Notification.createOnNext(value));}, /**
	   * Factory method for an OnError notification record at a given time with a given error.
	   *
	   * 1 - ReactiveTest.onNext(200, new Error('error'));
	   * 2 - ReactiveTest.onNext(200, function (e) { return e.message === 'error'; });
	   *
	   * @param ticks Recorded virtual time the OnError notification occurs.
	   * @param exception Recorded exception stored in the OnError notification.
	   * @return Recorded OnError notification.
	   */onError:function onError(ticks,error){return typeof error==='function'?new Recorded(ticks,new OnErrorPredicate(error)):new Recorded(ticks,Notification.createOnError(error));}, /**
	   * Factory method for an OnCompleted notification record at a given time.
	   *
	   * @param ticks Recorded virtual time the OnCompleted notification occurs.
	   * @return Recorded OnCompleted notification.
	   */onCompleted:function onCompleted(ticks){return new Recorded(ticks,Notification.createOnCompleted());}, /**
	   * Factory method for a subscription record based on a given subscription and disposal time.
	   *
	   * @param start Virtual time indicating when the subscription was created.
	   * @param end Virtual time indicating when the subscription was disposed.
	   * @return Subscription object.
	   */subscribe:function subscribe(start,end){return new Subscription(start,end);}}; /**
	   * Creates a new object recording the production of the specified value at the given virtual time.
	   *
	   * @constructor
	   * @param {Number} time Virtual time the value was produced on.
	   * @param {Mixed} value Value that was produced.
	   * @param {Function} comparer An optional comparer.
	   */var Recorded=Rx.Recorded=function(time,value,comparer){this.time=time;this.value=value;this.comparer=comparer||defaultComparer;}; /**
	   * Checks whether the given recorded object is equal to the current instance.
	   *
	   * @param {Recorded} other Recorded object to check for equality.
	   * @returns {Boolean} true if both objects are equal; false otherwise.
	   */Recorded.prototype.equals=function(other){return this.time===other.time&&this.comparer(this.value,other.value);}; /**
	   * Returns a string representation of the current Recorded value.
	   *
	   * @returns {String} String representation of the current Recorded value.
	   */Recorded.prototype.toString=function(){return this.value.toString()+'@'+this.time;}; /**
	   * Creates a new subscription object with the given virtual subscription and unsubscription time.
	   *
	   * @constructor
	   * @param {Number} subscribe Virtual time at which the subscription occurred.
	   * @param {Number} unsubscribe Virtual time at which the unsubscription occurred.
	   */var Subscription=Rx.Subscription=function(start,end){this.subscribe=start;this.unsubscribe=end||Number.MAX_VALUE;}; /**
	   * Checks whether the given subscription is equal to the current instance.
	   * @param other Subscription object to check for equality.
	   * @returns {Boolean} true if both objects are equal; false otherwise.
	   */Subscription.prototype.equals=function(other){return this.subscribe===other.subscribe&&this.unsubscribe===other.unsubscribe;}; /**
	   * Returns a string representation of the current Subscription value.
	   * @returns {String} String representation of the current Subscription value.
	   */Subscription.prototype.toString=function(){return '('+this.subscribe+', '+(this.unsubscribe===Number.MAX_VALUE?'Infinite':this.unsubscribe)+')';};var MockDisposable=Rx.MockDisposable=function(scheduler){this.scheduler=scheduler;this.disposes=[];this.disposes.push(this.scheduler.clock);};MockDisposable.prototype.dispose=function(){this.disposes.push(this.scheduler.clock);};var MockObserver=function(__super__){inherits(MockObserver,__super__);function MockObserver(scheduler){__super__.call(this);this.scheduler=scheduler;this.messages=[];}var MockObserverPrototype=MockObserver.prototype;MockObserverPrototype.onNext=function(value){this.messages.push(new Recorded(this.scheduler.clock,Notification.createOnNext(value)));};MockObserverPrototype.onError=function(e){this.messages.push(new Recorded(this.scheduler.clock,Notification.createOnError(e)));};MockObserverPrototype.onCompleted=function(){this.messages.push(new Recorded(this.scheduler.clock,Notification.createOnCompleted()));};return MockObserver;}(Observer);function MockPromise(scheduler,messages){var self=this;this.scheduler=scheduler;this.messages=messages;this.subscriptions=[];this.observers=[];for(var i=0,len=this.messages.length;i<len;i++){var message=this.messages[i],notification=message.value;(function(innerNotification){scheduler.scheduleAbsolute(null,message.time,function(){var obs=self.observers.slice(0);for(var j=0,jLen=obs.length;j<jLen;j++){innerNotification.accept(obs[j]);}return disposableEmpty;});})(notification);}}MockPromise.prototype.then=function(onResolved,onRejected){var self=this;this.subscriptions.push(new Subscription(this.scheduler.clock));var index=this.subscriptions.length-1;var newPromise;var observer=Rx.Observer.create(function(x){var retValue=onResolved(x);if(retValue&&typeof retValue.then==='function'){newPromise=retValue;}else {var ticks=self.scheduler.clock;newPromise=new MockPromise(self.scheduler,[Rx.ReactiveTest.onNext(ticks,undefined),Rx.ReactiveTest.onCompleted(ticks)]);}var idx=self.observers.indexOf(observer);self.observers.splice(idx,1);self.subscriptions[index]=new Subscription(self.subscriptions[index].subscribe,self.scheduler.clock);},function(err){onRejected(err);var idx=self.observers.indexOf(observer);self.observers.splice(idx,1);self.subscriptions[index]=new Subscription(self.subscriptions[index].subscribe,self.scheduler.clock);});this.observers.push(observer);return newPromise||new MockPromise(this.scheduler,this.messages);};var HotObservable=function(__super__){inherits(HotObservable,__super__);function HotObservable(scheduler,messages){__super__.call(this);var message,notification,observable=this;this.scheduler=scheduler;this.messages=messages;this.subscriptions=[];this.observers=[];for(var i=0,len=this.messages.length;i<len;i++){message=this.messages[i];notification=message.value;(function(innerNotification){scheduler.scheduleAbsolute(null,message.time,function(){var obs=observable.observers.slice(0);for(var j=0,jLen=obs.length;j<jLen;j++){innerNotification.accept(obs[j]);}return disposableEmpty;});})(notification);}}HotObservable.prototype._subscribe=function(o){var observable=this;this.observers.push(o);this.subscriptions.push(new Subscription(this.scheduler.clock));var index=this.subscriptions.length-1;return disposableCreate(function(){var idx=observable.observers.indexOf(o);observable.observers.splice(idx,1);observable.subscriptions[index]=new Subscription(observable.subscriptions[index].subscribe,observable.scheduler.clock);});};return HotObservable;}(Observable);var ColdObservable=function(__super__){inherits(ColdObservable,__super__);function ColdObservable(scheduler,messages){__super__.call(this);this.scheduler=scheduler;this.messages=messages;this.subscriptions=[];}ColdObservable.prototype._subscribe=function(o){var message,notification,observable=this;this.subscriptions.push(new Subscription(this.scheduler.clock));var index=this.subscriptions.length-1;var d=new CompositeDisposable();for(var i=0,len=this.messages.length;i<len;i++){message=this.messages[i];notification=message.value;(function(innerNotification){d.add(observable.scheduler.scheduleRelative(null,message.time,function(){innerNotification.accept(o);return disposableEmpty;}));})(notification);}return disposableCreate(function(){observable.subscriptions[index]=new Subscription(observable.subscriptions[index].subscribe,observable.scheduler.clock);d.dispose();});};return ColdObservable;}(Observable); /** Virtual time scheduler used for testing applications and libraries built using Reactive Extensions. */Rx.TestScheduler=function(__super__){inherits(TestScheduler,__super__);function baseComparer(x,y){return x>y?1:x<y?-1:0;}function TestScheduler(){__super__.call(this,0,baseComparer);} /**
	     * Schedules an action to be executed at the specified virtual time.
	     *
	     * @param state State passed to the action to be executed.
	     * @param dueTime Absolute virtual time at which to execute the action.
	     * @param action Action to be executed.
	     * @return Disposable object used to cancel the scheduled action (best effort).
	     */TestScheduler.prototype.scheduleAbsolute=function(state,dueTime,action){dueTime<=this.clock&&(dueTime=this.clock+1);return __super__.prototype.scheduleAbsolute.call(this,state,dueTime,action);}; /**
	     * Adds a relative virtual time to an absolute virtual time value.
	     *
	     * @param absolute Absolute virtual time value.
	     * @param relative Relative virtual time value to add.
	     * @return Resulting absolute virtual time sum value.
	     */TestScheduler.prototype.add=function(absolute,relative){return absolute+relative;}; /**
	     * Converts the absolute virtual time value to a DateTimeOffset value.
	     *
	     * @param absolute Absolute virtual time value to convert.
	     * @return Corresponding DateTimeOffset value.
	     */TestScheduler.prototype.toAbsoluteTime=function(absolute){return new Date(absolute).getTime();}; /**
	     * Converts the TimeSpan value to a relative virtual time value.
	     *
	     * @param timeSpan TimeSpan value to convert.
	     * @return Corresponding relative virtual time value.
	     */TestScheduler.prototype.toRelativeTime=function(timeSpan){return timeSpan;}; /**
	     * Starts the test scheduler and uses the specified virtual times to invoke the factory function, subscribe to the resulting sequence, and dispose the subscription.
	     *
	     * @param create Factory method to create an observable sequence.
	     * @param created Virtual time at which to invoke the factory to create an observable sequence.
	     * @param subscribed Virtual time at which to subscribe to the created observable sequence.
	     * @param disposed Virtual time at which to dispose the subscription.
	     * @return Observer with timestamped recordings of notification messages that were received during the virtual time window when the subscription to the source sequence was active.
	     */TestScheduler.prototype.startScheduler=function(createFn,settings){settings||(settings={});settings.created==null&&(settings.created=ReactiveTest.created);settings.subscribed==null&&(settings.subscribed=ReactiveTest.subscribed);settings.disposed==null&&(settings.disposed=ReactiveTest.disposed);var observer=this.createObserver(),source,subscription;this.scheduleAbsolute(null,settings.created,function(){source=createFn();return disposableEmpty;});this.scheduleAbsolute(null,settings.subscribed,function(){subscription=source.subscribe(observer);return disposableEmpty;});this.scheduleAbsolute(null,settings.disposed,function(){subscription.dispose();return disposableEmpty;});this.start();return observer;}; /**
	     * Creates a hot observable using the specified timestamped notification messages either as an array or arguments.
	     * @param messages Notifications to surface through the created sequence at their specified absolute virtual times.
	     * @return Hot observable sequence that can be used to assert the timing of subscriptions and notifications.
	     */TestScheduler.prototype.createHotObservable=function(){var len=arguments.length,args;if(Array.isArray(arguments[0])){args=arguments[0];}else {args=new Array(len);for(var i=0;i<len;i++){args[i]=arguments[i];}}return new HotObservable(this,args);}; /**
	     * Creates a cold observable using the specified timestamped notification messages either as an array or arguments.
	     * @param messages Notifications to surface through the created sequence at their specified virtual time offsets from the sequence subscription time.
	     * @return Cold observable sequence that can be used to assert the timing of subscriptions and notifications.
	     */TestScheduler.prototype.createColdObservable=function(){var len=arguments.length,args;if(Array.isArray(arguments[0])){args=arguments[0];}else {args=new Array(len);for(var i=0;i<len;i++){args[i]=arguments[i];}}return new ColdObservable(this,args);}; /**
	     * Creates a resolved promise with the given value and ticks
	     * @param {Number} ticks The absolute time of the resolution.
	     * @param {Any} value The value to yield at the given tick.
	     * @returns {MockPromise} A mock Promise which fulfills with the given value.
	     */TestScheduler.prototype.createResolvedPromise=function(ticks,value){return new MockPromise(this,[Rx.ReactiveTest.onNext(ticks,value),Rx.ReactiveTest.onCompleted(ticks)]);}; /**
	     * Creates a rejected promise with the given reason and ticks
	     * @param {Number} ticks The absolute time of the resolution.
	     * @param {Any} reason The reason for rejection to yield at the given tick.
	     * @returns {MockPromise} A mock Promise which rejects with the given reason.
	     */TestScheduler.prototype.createRejectedPromise=function(ticks,reason){return new MockPromise(this,[Rx.ReactiveTest.onError(ticks,reason)]);}; /**
	     * Creates an observer that records received notification messages and timestamps those.
	     * @return Observer that can be used to assert the timing of received notifications.
	     */TestScheduler.prototype.createObserver=function(){return new MockObserver(this);};return TestScheduler;}(VirtualTimeScheduler);var AnonymousObservable=Rx.AnonymousObservable=function(__super__){inherits(AnonymousObservable,__super__); // Fix subscriber to check for undefined or function returned to decorate as Disposable
	function fixSubscriber(subscriber){return subscriber&&isFunction(subscriber.dispose)?subscriber:isFunction(subscriber)?disposableCreate(subscriber):disposableEmpty;}function setDisposable(s,state){var ado=state[0],self=state[1];var sub=tryCatch(self.__subscribe).call(self,ado);if(sub===errorObj&&!ado.fail(errorObj.e)){thrower(errorObj.e);}ado.setDisposable(fixSubscriber(sub));}function AnonymousObservable(subscribe,parent){this.source=parent;this.__subscribe=subscribe;__super__.call(this);}AnonymousObservable.prototype._subscribe=function(o){var ado=new AutoDetachObserver(o),state=[ado,this];if(currentThreadScheduler.scheduleRequired()){currentThreadScheduler.schedule(state,setDisposable);}else {setDisposable(null,state);}return ado;};return AnonymousObservable;}(Observable);var AutoDetachObserver=function(__super__){inherits(AutoDetachObserver,__super__);function AutoDetachObserver(observer){__super__.call(this);this.observer=observer;this.m=new SingleAssignmentDisposable();}var AutoDetachObserverPrototype=AutoDetachObserver.prototype;AutoDetachObserverPrototype.next=function(value){var result=tryCatch(this.observer.onNext).call(this.observer,value);if(result===errorObj){this.dispose();thrower(result.e);}};AutoDetachObserverPrototype.error=function(err){var result=tryCatch(this.observer.onError).call(this.observer,err);this.dispose();result===errorObj&&thrower(result.e);};AutoDetachObserverPrototype.completed=function(){var result=tryCatch(this.observer.onCompleted).call(this.observer);this.dispose();result===errorObj&&thrower(result.e);};AutoDetachObserverPrototype.setDisposable=function(value){this.m.setDisposable(value);};AutoDetachObserverPrototype.getDisposable=function(){return this.m.getDisposable();};AutoDetachObserverPrototype.dispose=function(){__super__.prototype.dispose.call(this);this.m.dispose();};return AutoDetachObserver;}(AbstractObserver);var UnderlyingObservable=function(__super__){inherits(UnderlyingObservable,__super__);function UnderlyingObservable(m,u){this._m=m;this._u=u;__super__.call(this);}UnderlyingObservable.prototype.subscribeCore=function(o){return new BinaryDisposable(this._m.getDisposable(),this._u.subscribe(o));};return UnderlyingObservable;}(ObservableBase);var GroupedObservable=function(__super__){inherits(GroupedObservable,__super__);function GroupedObservable(key,underlyingObservable,mergedDisposable){__super__.call(this);this.key=key;this.underlyingObservable=!mergedDisposable?underlyingObservable:new UnderlyingObservable(mergedDisposable,underlyingObservable);}GroupedObservable.prototype._subscribe=function(o){return this.underlyingObservable.subscribe(o);};return GroupedObservable;}(Observable); /**
	   *  Represents an object that is both an observable sequence as well as an observer.
	   *  Each notification is broadcasted to all subscribed observers.
	   */var Subject=Rx.Subject=function(__super__){inherits(Subject,__super__);function Subject(){__super__.call(this);this.isDisposed=false;this.isStopped=false;this.observers=[];this.hasError=false;}addProperties(Subject.prototype,Observer.prototype,{_subscribe:function _subscribe(o){checkDisposed(this);if(!this.isStopped){this.observers.push(o);return new InnerSubscription(this,o);}if(this.hasError){o.onError(this.error);return disposableEmpty;}o.onCompleted();return disposableEmpty;}, /**
	       * Indicates whether the subject has observers subscribed to it.
	       * @returns {Boolean} Indicates whether the subject has observers subscribed to it.
	       */hasObservers:function hasObservers(){checkDisposed(this);return this.observers.length>0;}, /**
	       * Notifies all subscribed observers about the end of the sequence.
	       */onCompleted:function onCompleted(){checkDisposed(this);if(!this.isStopped){this.isStopped=true;for(var i=0,os=cloneArray(this.observers),len=os.length;i<len;i++){os[i].onCompleted();}this.observers.length=0;}}, /**
	       * Notifies all subscribed observers about the exception.
	       * @param {Mixed} error The exception to send to all observers.
	       */onError:function onError(error){checkDisposed(this);if(!this.isStopped){this.isStopped=true;this.error=error;this.hasError=true;for(var i=0,os=cloneArray(this.observers),len=os.length;i<len;i++){os[i].onError(error);}this.observers.length=0;}}, /**
	       * Notifies all subscribed observers about the arrival of the specified element in the sequence.
	       * @param {Mixed} value The value to send to all observers.
	       */onNext:function onNext(value){checkDisposed(this);if(!this.isStopped){for(var i=0,os=cloneArray(this.observers),len=os.length;i<len;i++){os[i].onNext(value);}}}, /**
	       * Unsubscribe all observers and release resources.
	       */dispose:function dispose(){this.isDisposed=true;this.observers=null;}}); /**
	     * Creates a subject from the specified observer and observable.
	     * @param {Observer} observer The observer used to send messages to the subject.
	     * @param {Observable} observable The observable used to subscribe to messages sent from the subject.
	     * @returns {Subject} Subject implemented using the given observer and observable.
	     */Subject.create=function(observer,observable){return new AnonymousSubject(observer,observable);};return Subject;}(Observable); /**
	   *  Represents the result of an asynchronous operation.
	   *  The last value before the OnCompleted notification, or the error received through OnError, is sent to all subscribed observers.
	   */var AsyncSubject=Rx.AsyncSubject=function(__super__){inherits(AsyncSubject,__super__); /**
	     * Creates a subject that can only receive one value and that value is cached for all future observations.
	     * @constructor
	     */function AsyncSubject(){__super__.call(this);this.isDisposed=false;this.isStopped=false;this.hasValue=false;this.observers=[];this.hasError=false;}addProperties(AsyncSubject.prototype,Observer.prototype,{_subscribe:function _subscribe(o){checkDisposed(this);if(!this.isStopped){this.observers.push(o);return new InnerSubscription(this,o);}if(this.hasError){o.onError(this.error);}else if(this.hasValue){o.onNext(this.value);o.onCompleted();}else {o.onCompleted();}return disposableEmpty;}, /**
	       * Indicates whether the subject has observers subscribed to it.
	       * @returns {Boolean} Indicates whether the subject has observers subscribed to it.
	       */hasObservers:function hasObservers(){checkDisposed(this);return this.observers.length>0;}, /**
	       * Notifies all subscribed observers about the end of the sequence, also causing the last received value to be sent out (if any).
	       */onCompleted:function onCompleted(){var i,len;checkDisposed(this);if(!this.isStopped){this.isStopped=true;var os=cloneArray(this.observers),len=os.length;if(this.hasValue){for(i=0;i<len;i++){var o=os[i];o.onNext(this.value);o.onCompleted();}}else {for(i=0;i<len;i++){os[i].onCompleted();}}this.observers.length=0;}}, /**
	       * Notifies all subscribed observers about the error.
	       * @param {Mixed} error The Error to send to all observers.
	       */onError:function onError(error){checkDisposed(this);if(!this.isStopped){this.isStopped=true;this.hasError=true;this.error=error;for(var i=0,os=cloneArray(this.observers),len=os.length;i<len;i++){os[i].onError(error);}this.observers.length=0;}}, /**
	       * Sends a value to the subject. The last value received before successful termination will be sent to all subscribed and future observers.
	       * @param {Mixed} value The value to store in the subject.
	       */onNext:function onNext(value){checkDisposed(this);if(this.isStopped){return;}this.value=value;this.hasValue=true;}, /**
	       * Unsubscribe all observers and release resources.
	       */dispose:function dispose(){this.isDisposed=true;this.observers=null;this.error=null;this.value=null;}});return AsyncSubject;}(Observable); /**
	   *  Represents a value that changes over time.
	   *  Observers can subscribe to the subject to receive the last (or initial) value and all subsequent notifications.
	   */var BehaviorSubject=Rx.BehaviorSubject=function(__super__){inherits(BehaviorSubject,__super__);function BehaviorSubject(value){__super__.call(this);this.value=value;this.observers=[];this.isDisposed=false;this.isStopped=false;this.hasError=false;}addProperties(BehaviorSubject.prototype,Observer.prototype,{_subscribe:function _subscribe(o){checkDisposed(this);if(!this.isStopped){this.observers.push(o);o.onNext(this.value);return new InnerSubscription(this,o);}if(this.hasError){o.onError(this.error);}else {o.onCompleted();}return disposableEmpty;}, /**
	       * Gets the current value or throws an exception.
	       * Value is frozen after onCompleted is called.
	       * After onError is called always throws the specified exception.
	       * An exception is always thrown after dispose is called.
	       * @returns {Mixed} The initial value passed to the constructor until onNext is called; after which, the last value passed to onNext.
	       */getValue:function getValue(){checkDisposed(this);if(this.hasError){thrower(this.error);}return this.value;}, /**
	       * Indicates whether the subject has observers subscribed to it.
	       * @returns {Boolean} Indicates whether the subject has observers subscribed to it.
	       */hasObservers:function hasObservers(){checkDisposed(this);return this.observers.length>0;}, /**
	       * Notifies all subscribed observers about the end of the sequence.
	       */onCompleted:function onCompleted(){checkDisposed(this);if(this.isStopped){return;}this.isStopped=true;for(var i=0,os=cloneArray(this.observers),len=os.length;i<len;i++){os[i].onCompleted();}this.observers.length=0;}, /**
	       * Notifies all subscribed observers about the exception.
	       * @param {Mixed} error The exception to send to all observers.
	       */onError:function onError(error){checkDisposed(this);if(this.isStopped){return;}this.isStopped=true;this.hasError=true;this.error=error;for(var i=0,os=cloneArray(this.observers),len=os.length;i<len;i++){os[i].onError(error);}this.observers.length=0;}, /**
	       * Notifies all subscribed observers about the arrival of the specified element in the sequence.
	       * @param {Mixed} value The value to send to all observers.
	       */onNext:function onNext(value){checkDisposed(this);if(this.isStopped){return;}this.value=value;for(var i=0,os=cloneArray(this.observers),len=os.length;i<len;i++){os[i].onNext(value);}}, /**
	       * Unsubscribe all observers and release resources.
	       */dispose:function dispose(){this.isDisposed=true;this.observers=null;this.value=null;this.error=null;}});return BehaviorSubject;}(Observable); /**
	   * Represents an object that is both an observable sequence as well as an observer.
	   * Each notification is broadcasted to all subscribed and future observers, subject to buffer trimming policies.
	   */var ReplaySubject=Rx.ReplaySubject=function(__super__){var maxSafeInteger=Math.pow(2,53)-1;function createRemovableDisposable(subject,observer){return disposableCreate(function(){observer.dispose();!subject.isDisposed&&subject.observers.splice(subject.observers.indexOf(observer),1);});}inherits(ReplaySubject,__super__); /**
	     *  Initializes a new instance of the ReplaySubject class with the specified buffer size, window size and scheduler.
	     *  @param {Number} [bufferSize] Maximum element count of the replay buffer.
	     *  @param {Number} [windowSize] Maximum time length of the replay buffer.
	     *  @param {Scheduler} [scheduler] Scheduler the observers are invoked on.
	     */function ReplaySubject(bufferSize,windowSize,scheduler){this.bufferSize=bufferSize==null?maxSafeInteger:bufferSize;this.windowSize=windowSize==null?maxSafeInteger:windowSize;this.scheduler=scheduler||currentThreadScheduler;this.q=[];this.observers=[];this.isStopped=false;this.isDisposed=false;this.hasError=false;this.error=null;__super__.call(this);}addProperties(ReplaySubject.prototype,Observer.prototype,{_subscribe:function _subscribe(o){checkDisposed(this);var so=new ScheduledObserver(this.scheduler,o),subscription=createRemovableDisposable(this,so);this._trim(this.scheduler.now());this.observers.push(so);for(var i=0,len=this.q.length;i<len;i++){so.onNext(this.q[i].value);}if(this.hasError){so.onError(this.error);}else if(this.isStopped){so.onCompleted();}so.ensureActive();return subscription;}, /**
	       * Indicates whether the subject has observers subscribed to it.
	       * @returns {Boolean} Indicates whether the subject has observers subscribed to it.
	       */hasObservers:function hasObservers(){checkDisposed(this);return this.observers.length>0;},_trim:function _trim(now){while(this.q.length>this.bufferSize){this.q.shift();}while(this.q.length>0&&now-this.q[0].interval>this.windowSize){this.q.shift();}}, /**
	       * Notifies all subscribed observers about the arrival of the specified element in the sequence.
	       * @param {Mixed} value The value to send to all observers.
	       */onNext:function onNext(value){checkDisposed(this);if(this.isStopped){return;}var now=this.scheduler.now();this.q.push({interval:now,value:value});this._trim(now);for(var i=0,os=cloneArray(this.observers),len=os.length;i<len;i++){var observer=os[i];observer.onNext(value);observer.ensureActive();}}, /**
	       * Notifies all subscribed observers about the exception.
	       * @param {Mixed} error The exception to send to all observers.
	       */onError:function onError(error){checkDisposed(this);if(this.isStopped){return;}this.isStopped=true;this.error=error;this.hasError=true;var now=this.scheduler.now();this._trim(now);for(var i=0,os=cloneArray(this.observers),len=os.length;i<len;i++){var observer=os[i];observer.onError(error);observer.ensureActive();}this.observers.length=0;}, /**
	       * Notifies all subscribed observers about the end of the sequence.
	       */onCompleted:function onCompleted(){checkDisposed(this);if(this.isStopped){return;}this.isStopped=true;var now=this.scheduler.now();this._trim(now);for(var i=0,os=cloneArray(this.observers),len=os.length;i<len;i++){var observer=os[i];observer.onCompleted();observer.ensureActive();}this.observers.length=0;}, /**
	       * Unsubscribe all observers and release resources.
	       */dispose:function dispose(){this.isDisposed=true;this.observers=null;}});return ReplaySubject;}(Observable);var AnonymousSubject=Rx.AnonymousSubject=function(__super__){inherits(AnonymousSubject,__super__);function AnonymousSubject(observer,observable){this.observer=observer;this.observable=observable;__super__.call(this);}addProperties(AnonymousSubject.prototype,Observer.prototype,{_subscribe:function _subscribe(o){return this.observable.subscribe(o);},onCompleted:function onCompleted(){this.observer.onCompleted();},onError:function onError(error){this.observer.onError(error);},onNext:function onNext(value){this.observer.onNext(value);}});return AnonymousSubject;}(Observable); /**
	  * Used to pause and resume streams.
	  */Rx.Pauser=function(__super__){inherits(Pauser,__super__);function Pauser(){__super__.call(this);} /**
	     * Pauses the underlying sequence.
	     */Pauser.prototype.pause=function(){this.onNext(false);}; /**
	    * Resumes the underlying sequence.
	    */Pauser.prototype.resume=function(){this.onNext(true);};return Pauser;}(Subject);if("function"=='function'&&_typeof(__webpack_require__(288))=='object'&&__webpack_require__(288)){root.Rx=Rx;!(__WEBPACK_AMD_DEFINE_RESULT__ = function(){return Rx;}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));}else if(freeExports&&freeModule){ // in Node.js or RingoJS
	if(moduleExports){(freeModule.exports=Rx).Rx=Rx;}else {freeExports.Rx=Rx;}}else { // in a browser or Rhino
	root.Rx=Rx;} // All code before this point will be filtered from stack traces.
	var rEndingLine=captureLine();}).call(undefined);
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(282)(module), (function() { return this; }()), __webpack_require__(283)))

/***/ },
/* 288 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(__webpack_amd_options__) {module.exports = __webpack_amd_options__;

	/* WEBPACK VAR INJECTION */}.call(exports, {}))

/***/ },
/* 289 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.Entries = undefined;

	var _rx = __webpack_require__(287);

	var _dom = __webpack_require__(290);

	// Render current list of entries
	var Entries = exports.Entries = function Entries(sources) {
	    var vtree$ = sources.entries$.map(function (entries) {
	        return (0, _dom.div)(".entries", [entries.map(function (entry) {
	            return (0, _dom.div)('.exercise', [(0, _dom.span)('.label', 'hello ' + entry.title), (0, _dom.a)(".pageLink", { dataset: { target: "/entries/user/10" } }, 'Käyttäjä ' + entry.id)]);
	        })]);
	    });

	    return {
	        DOM: vtree$
	    };
	};

/***/ },
/* 290 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _extends = Object.assign || function (target) {
	  for (var i = 1; i < arguments.length; i++) {
	    var source = arguments[i];for (var key in source) {
	      if (Object.prototype.hasOwnProperty.call(source, key)) {
	        target[key] = source[key];
	      }
	    }
	  }return target;
	};

	var svg = __webpack_require__(291);

	var _require = __webpack_require__(311);

	var makeDOMDriver = _require.makeDOMDriver;

	var _require2 = __webpack_require__(333);

	var makeHTMLDriver = _require2.makeHTMLDriver;

	var mockDOMSource = __webpack_require__(346);
	var h = __webpack_require__(293);
	var hh = __webpack_require__(347)(h);

	var CycleDOM = _extends({
	  /**
	   * A factory for the DOM driver function. Takes a `container` to define the
	   * target on the existing DOM which this driver will operate on. The output
	   * ("source") of this driver is a collection of Observables queried with:
	   * `DOMSource.select(selector).events(eventType)` returns an Observable of
	   * events of `eventType` happening on the element determined by `selector`.
	   * Just `DOMSource.select(selector).observable` returns an Observable of the
	   * DOM element matched by the given selector. Also,
	   * `DOMSource.select(':root').observable` returns an Observable of DOM element
	   * corresponding to the root (or container) of the app on the DOM. The
	   * `events()` function also allows you to specify the `useCapture` parameter
	   * of the event listener. That is, the full function signature is
	   * `events(eventType, useCapture)` where `useCapture` is by default `false`.
	   *
	   * @param {(String|HTMLElement)} container the DOM selector for the element
	   * (or the element itself) to contain the rendering of the VTrees.
	   * @return {Function} the DOM driver function. The function expects an
	   * Observable of VTree as input, and outputs the source object for this
	   * driver, containing functions `select()` and `dispose()` that can be used
	   * for debugging and testing.
	   * @param {Object} options an options object containing additional
	   * configurations. The options object is optional. These are the parameters
	   * that may be specified:
	   *   - `onError`: a callback function to handle errors. By default it is
	   *   `console.error`.
	   * @function makeDOMDriver
	   */
	  makeDOMDriver: makeDOMDriver,

	  /**
	   * A factory for the HTML driver function.
	   *
	   * @return {Function} the HTML driver function. The function expects an
	   * Observable of Virtual DOM elements as input, and outputs an Observable of
	   * strings as the HTML renderization of the virtual DOM elements.
	   * @function makeHTMLDriver
	   */
	  makeHTMLDriver: makeHTMLDriver,

	  /**
	   * A shortcut to [virtual-hyperscript](
	   * https://github.com/Matt-Esch/virtual-dom/tree/master/virtual-hyperscript).
	   * This is a helper for creating VTrees in Views.
	   * @name h
	   */
	  h: h

	}, hh, {

	  /**
	   * An adapter around virtual-hyperscript `h()` to allow JSX to be used easily
	   * with Babel. Place the [Babel configuration comment](
	   * http://babeljs.io/docs/advanced/transformers/other/react/) `@jsx hJSX` at
	   * the top of the ES6 file, make sure you import `hJSX` with
	   * `import {hJSX} from '@cycle/dom'`, and then you can use JSX to create
	   * VTrees.
	   *
	   * Note that to pass in custom attributes, e.g. data-*, you must use the
	   * attributes key like `<tag attributes={{'data-custom-attr': 'foo'}} />`.
	   *
	   * @name hJSX
	   */
	  hJSX: function hJSX(tag, attrs) {
	    for (var _len = arguments.length, children = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
	      children[_key - 2] = arguments[_key];
	    }

	    return h(tag, attrs, children);
	  },

	  /**
	   * A shortcut to the svg hyperscript function.
	   * @name svg
	   */
	  svg: svg,

	  /**
	   * A testing utility which aids in creating a queryable collection of
	   * Observables. Call mockDOMSource giving it an object specifying selectors,
	   * eventTypes and their Observables, and get as output an object following the
	   * same format as the DOM Driver's source. Example:
	   *
	   * ```js
	   * const domSource = mockDOMSource({
	   *   '.foo': {
	   *     'click': Rx.Observable.of({target: {}}),
	   *     'mouseover': Rx.Observable.of({target: {}}),
	   *   },
	   *   '.bar': {
	   *     'scroll': Rx.Observable.of({target: {}}),
	   *     observable: Rx.Observable.of({tagName: 'div'}),
	   *   }
	   * });
	   *
	   * // Usage
	   * const click$ = domSource.select('.foo').events('click');
	   * const element$ = domSource.select('.bar').observable;
	   * ```
	   *
	   * @param {Object} mockedSelectors an object where keys are selector strings
	   * and values are objects. Those nested objects have eventType strings as keys
	   * and values are Observables you created.
	   * @return {Object} fake DOM source object, containing a function `select()`
	   * which can be used just like the DOM Driver's source. Call
	   * `select(selector).events(eventType)` on the source object to get the
	   * Observable you defined in the input of `mockDOMSource`.
	   * @function mockDOMSource
	   */
	  mockDOMSource: mockDOMSource
	});

	module.exports = CycleDOM;
	/**
	 * Shortcuts to
	 * [hyperscript-helpers](https://github.com/ohanhi/hyperscript-helpers).
	 * This is a helper for writing virtual-hyperscript. Create virtual DOM
	 * elements with `div('.wrapper', [ h1('Header') ])` instead of
	 * `h('div.wrapper', [ h('h1', 'Header') ])`.
	 * @name hyperscript-helpers
	 */

/***/ },
/* 291 */
/***/ function(module, exports, __webpack_require__) {

	/*eslint-disable */
	'use strict';

	var isArray = __webpack_require__(292);

	// START Cycle.js-specific code >>>>>>>>
	var h = __webpack_require__(293);
	// END Cycle.js-specific code <<<<<<<<<<

	var SVGAttributeNamespace = __webpack_require__(309);
	var attributeHook = __webpack_require__(310);

	var SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

	module.exports = svg;

	function svg(tagName, properties, children) {
	  if (!children && isChildren(properties)) {
	    children = properties;
	    properties = {};
	  }

	  properties = properties || {};

	  // set namespace for svg
	  properties.namespace = SVG_NAMESPACE;

	  var attributes = properties.attributes || (properties.attributes = {});

	  for (var key in properties) {
	    if (!properties.hasOwnProperty(key)) {
	      continue;
	    }

	    var namespace = SVGAttributeNamespace(key);

	    if (namespace === undefined) {
	      // not a svg attribute
	      continue;
	    }

	    var value = properties[key];

	    if (typeof value !== 'string' && typeof value !== 'number' && typeof value !== 'boolean') {
	      continue;
	    }

	    if (namespace !== null) {
	      // namespaced attribute
	      properties[key] = attributeHook(namespace, value);
	      continue;
	    }

	    attributes[key] = value;
	    properties[key] = undefined;
	  }

	  return h(tagName, properties, children);
	}

	// START Cycle.js-specific code >>>>>>>>
	function isObservable(x) {
	  return x && typeof x.subscribe === 'function';
	}

	function isChildren(x) {
	  return typeof x === 'string' || isArray(x) || isObservable(x);
	}
	// END Cycle.js-specific code <<<<<<<<<<

/***/ },
/* 292 */
/***/ function(module, exports) {

	"use strict";

	var nativeIsArray = Array.isArray;
	var toString = Object.prototype.toString;

	module.exports = nativeIsArray || isArray;

	function isArray(obj) {
	    return toString.call(obj) === "[object Array]";
	}

/***/ },
/* 293 */
/***/ function(module, exports, __webpack_require__) {

	/* eslint-disable */
	'use strict';

	var isArray = __webpack_require__(292);

	var VNode = __webpack_require__(294);
	var VText = __webpack_require__(300);
	var isVNode = __webpack_require__(296);
	var isVText = __webpack_require__(301);
	var isWidget = __webpack_require__(297);
	var isHook = __webpack_require__(299);
	var isVThunk = __webpack_require__(298);

	var parseTag = __webpack_require__(302);
	var softSetHook = __webpack_require__(304);
	var evHook = __webpack_require__(305);

	module.exports = h;

	function h(tagName, properties, children) {
	  var childNodes = [];
	  var tag, props, key, namespace;

	  if (!children && isChildren(properties)) {
	    children = properties;
	    props = {};
	  }

	  props = props || properties || {};
	  tag = parseTag(tagName, props);

	  // support keys
	  if (props.hasOwnProperty('key')) {
	    key = props.key;
	    props.key = undefined;
	  }

	  // support namespace
	  if (props.hasOwnProperty('namespace')) {
	    namespace = props.namespace;
	    props.namespace = undefined;
	  }

	  // fix cursor bug
	  if (tag === 'INPUT' && !namespace && props.hasOwnProperty('value') && props.value !== undefined && !isHook(props.value)) {
	    props.value = softSetHook(props.value);
	  }

	  transformProperties(props);

	  if (children !== undefined && children !== null) {
	    addChild(children, childNodes, tag, props);
	  }

	  return new VNode(tag, props, childNodes, key, namespace);
	}

	function addChild(c, childNodes, tag, props) {
	  if (typeof c === 'string') {
	    childNodes.push(new VText(c));
	  } else if (typeof c === 'number') {
	    childNodes.push(new VText(String(c)));
	  } else if (isChild(c)) {
	    childNodes.push(c);
	  } else if (isArray(c)) {
	    for (var i = 0; i < c.length; i++) {
	      addChild(c[i], childNodes, tag, props);
	    }
	  } else if (c === null || c === undefined) {
	    return;
	  } else {
	    throw UnexpectedVirtualElement({
	      foreignObject: c,
	      parentVnode: {
	        tagName: tag,
	        properties: props
	      }
	    });
	  }
	}

	function transformProperties(props) {
	  for (var propName in props) {
	    if (props.hasOwnProperty(propName)) {
	      var value = props[propName];

	      if (isHook(value)) {
	        continue;
	      }

	      if (propName.substr(0, 3) === 'ev-') {
	        // add ev-foo support
	        props[propName] = evHook(value);
	      }
	    }
	  }
	}

	// START Cycle.js-specific code >>>>>>>>
	function isObservable(x) {
	  return x && typeof x.subscribe === 'function';
	}

	function isChild(x) {
	  return isVNode(x) || isVText(x) || isObservable(x) || isWidget(x) || isVThunk(x);
	}
	// END Cycle.js-specific code <<<<<<<<<<

	function isChildren(x) {
	  return typeof x === 'string' || isArray(x) || isChild(x);
	}

	function UnexpectedVirtualElement(data) {
	  var err = new Error();

	  err.type = 'virtual-hyperscript.unexpected.virtual-element';
	  err.message = 'Unexpected virtual child passed to h().\n' + 'Expected a VNode / Vthunk / VWidget / string but:\n' + 'got:\n' + errorString(data.foreignObject) + '.\n' + 'The parent vnode is:\n' + errorString(data.parentVnode);
	  '\n' + 'Suggested fix: change your `h(..., [ ... ])` callsite.';
	  err.foreignObject = data.foreignObject;
	  err.parentVnode = data.parentVnode;

	  return err;
	}

	function errorString(obj) {
	  try {
	    return JSON.stringify(obj, null, '    ');
	  } catch (e) {
	    return String(obj);
	  }
	}
	/* eslint-enable */

/***/ },
/* 294 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var version = __webpack_require__(295);
	var isVNode = __webpack_require__(296);
	var isWidget = __webpack_require__(297);
	var isThunk = __webpack_require__(298);
	var isVHook = __webpack_require__(299);

	module.exports = VirtualNode;

	var noProperties = {};
	var noChildren = [];

	function VirtualNode(tagName, properties, children, key, namespace) {
	    this.tagName = tagName;
	    this.properties = properties || noProperties;
	    this.children = children || noChildren;
	    this.key = key != null ? String(key) : undefined;
	    this.namespace = typeof namespace === "string" ? namespace : null;

	    var count = children && children.length || 0;
	    var descendants = 0;
	    var hasWidgets = false;
	    var hasThunks = false;
	    var descendantHooks = false;
	    var hooks;

	    for (var propName in properties) {
	        if (properties.hasOwnProperty(propName)) {
	            var property = properties[propName];
	            if (isVHook(property) && property.unhook) {
	                if (!hooks) {
	                    hooks = {};
	                }

	                hooks[propName] = property;
	            }
	        }
	    }

	    for (var i = 0; i < count; i++) {
	        var child = children[i];
	        if (isVNode(child)) {
	            descendants += child.count || 0;

	            if (!hasWidgets && child.hasWidgets) {
	                hasWidgets = true;
	            }

	            if (!hasThunks && child.hasThunks) {
	                hasThunks = true;
	            }

	            if (!descendantHooks && (child.hooks || child.descendantHooks)) {
	                descendantHooks = true;
	            }
	        } else if (!hasWidgets && isWidget(child)) {
	            if (typeof child.destroy === "function") {
	                hasWidgets = true;
	            }
	        } else if (!hasThunks && isThunk(child)) {
	            hasThunks = true;
	        }
	    }

	    this.count = count + descendants;
	    this.hasWidgets = hasWidgets;
	    this.hasThunks = hasThunks;
	    this.hooks = hooks;
	    this.descendantHooks = descendantHooks;
	}

	VirtualNode.prototype.version = version;
	VirtualNode.prototype.type = "VirtualNode";

/***/ },
/* 295 */
/***/ function(module, exports) {

	"use strict";

	module.exports = "2";

/***/ },
/* 296 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var version = __webpack_require__(295);

	module.exports = isVirtualNode;

	function isVirtualNode(x) {
	    return x && x.type === "VirtualNode" && x.version === version;
	}

/***/ },
/* 297 */
/***/ function(module, exports) {

	"use strict";

	module.exports = isWidget;

	function isWidget(w) {
	    return w && w.type === "Widget";
	}

/***/ },
/* 298 */
/***/ function(module, exports) {

	"use strict";

	module.exports = isThunk;

	function isThunk(t) {
	    return t && t.type === "Thunk";
	}

/***/ },
/* 299 */
/***/ function(module, exports) {

	"use strict";

	module.exports = isHook;

	function isHook(hook) {
	  return hook && (typeof hook.hook === "function" && !hook.hasOwnProperty("hook") || typeof hook.unhook === "function" && !hook.hasOwnProperty("unhook"));
	}

/***/ },
/* 300 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var version = __webpack_require__(295);

	module.exports = VirtualText;

	function VirtualText(text) {
	    this.text = String(text);
	}

	VirtualText.prototype.version = version;
	VirtualText.prototype.type = "VirtualText";

/***/ },
/* 301 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var version = __webpack_require__(295);

	module.exports = isVirtualText;

	function isVirtualText(x) {
	    return x && x.type === "VirtualText" && x.version === version;
	}

/***/ },
/* 302 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var split = __webpack_require__(303);

	var classIdSplit = /([\.#]?[a-zA-Z0-9\u007F-\uFFFF_:-]+)/;
	var notClassId = /^\.|#/;

	module.exports = parseTag;

	function parseTag(tag, props) {
	    if (!tag) {
	        return 'DIV';
	    }

	    var noId = !props.hasOwnProperty('id');

	    var tagParts = split(tag, classIdSplit);
	    var tagName = null;

	    if (notClassId.test(tagParts[1])) {
	        tagName = 'DIV';
	    }

	    var classes, part, type, i;

	    for (i = 0; i < tagParts.length; i++) {
	        part = tagParts[i];

	        if (!part) {
	            continue;
	        }

	        type = part.charAt(0);

	        if (!tagName) {
	            tagName = part;
	        } else if (type === '.') {
	            classes = classes || [];
	            classes.push(part.substring(1, part.length));
	        } else if (type === '#' && noId) {
	            props.id = part.substring(1, part.length);
	        }
	    }

	    if (classes) {
	        if (props.className) {
	            classes.push(props.className);
	        }

	        props.className = classes.join(' ');
	    }

	    return props.namespace ? tagName : tagName.toUpperCase();
	}

/***/ },
/* 303 */
/***/ function(module, exports) {

	"use strict";

	/*!
	 * Cross-Browser Split 1.1.1
	 * Copyright 2007-2012 Steven Levithan <stevenlevithan.com>
	 * Available under the MIT License
	 * ECMAScript compliant, uniform cross-browser split method
	 */

	/**
	 * Splits a string into an array of strings using a regex or string separator. Matches of the
	 * separator are not included in the result array. However, if `separator` is a regex that contains
	 * capturing groups, backreferences are spliced into the result each time `separator` is matched.
	 * Fixes browser bugs compared to the native `String.prototype.split` and can be used reliably
	 * cross-browser.
	 * @param {String} str String to split.
	 * @param {RegExp|String} separator Regex or string to use for separating the string.
	 * @param {Number} [limit] Maximum number of items to include in the result array.
	 * @returns {Array} Array of substrings.
	 * @example
	 *
	 * // Basic use
	 * split('a b c d', ' ');
	 * // -> ['a', 'b', 'c', 'd']
	 *
	 * // With limit
	 * split('a b c d', ' ', 2);
	 * // -> ['a', 'b']
	 *
	 * // Backreferences in result array
	 * split('..word1 word2..', /([a-z]+)(\d+)/i);
	 * // -> ['..', 'word', '1', ' ', 'word', '2', '..']
	 */
	module.exports = function split(undef) {

	  var nativeSplit = String.prototype.split,
	      compliantExecNpcg = /()??/.exec("")[1] === undef,

	  // NPCG: nonparticipating capturing group
	  self;

	  self = function self(str, separator, limit) {
	    // If `separator` is not a regex, use `nativeSplit`
	    if (Object.prototype.toString.call(separator) !== "[object RegExp]") {
	      return nativeSplit.call(str, separator, limit);
	    }
	    var output = [],
	        flags = (separator.ignoreCase ? "i" : "") + (separator.multiline ? "m" : "") + (separator.extended ? "x" : "") + ( // Proposed for ES6
	    separator.sticky ? "y" : ""),

	    // Firefox 3+
	    lastLastIndex = 0,

	    // Make `global` and avoid `lastIndex` issues by working with a copy
	    separator = new RegExp(separator.source, flags + "g"),
	        separator2,
	        match,
	        lastIndex,
	        lastLength;
	    str += ""; // Type-convert
	    if (!compliantExecNpcg) {
	      // Doesn't need flags gy, but they don't hurt
	      separator2 = new RegExp("^" + separator.source + "$(?!\\s)", flags);
	    }
	    /* Values for `limit`, per the spec:
	     * If undefined: 4294967295 // Math.pow(2, 32) - 1
	     * If 0, Infinity, or NaN: 0
	     * If positive number: limit = Math.floor(limit); if (limit > 4294967295) limit -= 4294967296;
	     * If negative number: 4294967296 - Math.floor(Math.abs(limit))
	     * If other: Type-convert, then use the above rules
	     */
	    limit = limit === undef ? -1 >>> 0 : // Math.pow(2, 32) - 1
	    limit >>> 0; // ToUint32(limit)
	    while (match = separator.exec(str)) {
	      // `separator.lastIndex` is not reliable cross-browser
	      lastIndex = match.index + match[0].length;
	      if (lastIndex > lastLastIndex) {
	        output.push(str.slice(lastLastIndex, match.index));
	        // Fix browsers whose `exec` methods don't consistently return `undefined` for
	        // nonparticipating capturing groups
	        if (!compliantExecNpcg && match.length > 1) {
	          match[0].replace(separator2, function () {
	            for (var i = 1; i < arguments.length - 2; i++) {
	              if (arguments[i] === undef) {
	                match[i] = undef;
	              }
	            }
	          });
	        }
	        if (match.length > 1 && match.index < str.length) {
	          Array.prototype.push.apply(output, match.slice(1));
	        }
	        lastLength = match[0].length;
	        lastLastIndex = lastIndex;
	        if (output.length >= limit) {
	          break;
	        }
	      }
	      if (separator.lastIndex === match.index) {
	        separator.lastIndex++; // Avoid an infinite loop
	      }
	    }
	    if (lastLastIndex === str.length) {
	      if (lastLength || !separator.test("")) {
	        output.push("");
	      }
	    } else {
	      output.push(str.slice(lastLastIndex));
	    }
	    return output.length > limit ? output.slice(0, limit) : output;
	  };

	  return self;
	}();

/***/ },
/* 304 */
/***/ function(module, exports) {

	'use strict';

	module.exports = SoftSetHook;

	function SoftSetHook(value) {
	    if (!(this instanceof SoftSetHook)) {
	        return new SoftSetHook(value);
	    }

	    this.value = value;
	}

	SoftSetHook.prototype.hook = function (node, propertyName) {
	    if (node[propertyName] !== this.value) {
	        node[propertyName] = this.value;
	    }
	};

/***/ },
/* 305 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var EvStore = __webpack_require__(306);

	module.exports = EvHook;

	function EvHook(value) {
	    if (!(this instanceof EvHook)) {
	        return new EvHook(value);
	    }

	    this.value = value;
	}

	EvHook.prototype.hook = function (node, propertyName) {
	    var es = EvStore(node);
	    var propName = propertyName.substr(3);

	    es[propName] = this.value;
	};

	EvHook.prototype.unhook = function (node, propertyName) {
	    var es = EvStore(node);
	    var propName = propertyName.substr(3);

	    es[propName] = undefined;
	};

/***/ },
/* 306 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var OneVersionConstraint = __webpack_require__(307);

	var MY_VERSION = '7';
	OneVersionConstraint('ev-store', MY_VERSION);

	var hashKey = '__EV_STORE_KEY@' + MY_VERSION;

	module.exports = EvStore;

	function EvStore(elem) {
	    var hash = elem[hashKey];

	    if (!hash) {
	        hash = elem[hashKey] = {};
	    }

	    return hash;
	}

/***/ },
/* 307 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Individual = __webpack_require__(308);

	module.exports = OneVersion;

	function OneVersion(moduleName, version, defaultValue) {
	    var key = '__INDIVIDUAL_ONE_VERSION_' + moduleName;
	    var enforceKey = key + '_ENFORCE_SINGLETON';

	    var versionValue = Individual(enforceKey, version);

	    if (versionValue !== version) {
	        throw new Error('Can only have one copy of ' + moduleName + '.\n' + 'You already have version ' + versionValue + ' installed.\n' + 'This means you cannot install version ' + version);
	    }

	    return Individual(key, defaultValue);
	}

/***/ },
/* 308 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	/*global window, global*/

	var root = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : {};

	module.exports = Individual;

	function Individual(key, value) {
	    if (key in root) {
	        return root[key];
	    }

	    root[key] = value;

	    return value;
	}
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 309 */
/***/ function(module, exports) {

	'use strict';

	var DEFAULT_NAMESPACE = null;
	var EV_NAMESPACE = 'http://www.w3.org/2001/xml-events';
	var XLINK_NAMESPACE = 'http://www.w3.org/1999/xlink';
	var XML_NAMESPACE = 'http://www.w3.org/XML/1998/namespace';

	// http://www.w3.org/TR/SVGTiny12/attributeTable.html
	// http://www.w3.org/TR/SVG/attindex.html
	var SVG_PROPERTIES = {
	  'about': DEFAULT_NAMESPACE,
	  'accent-height': DEFAULT_NAMESPACE,
	  'accumulate': DEFAULT_NAMESPACE,
	  'additive': DEFAULT_NAMESPACE,
	  'alignment-baseline': DEFAULT_NAMESPACE,
	  'alphabetic': DEFAULT_NAMESPACE,
	  'amplitude': DEFAULT_NAMESPACE,
	  'arabic-form': DEFAULT_NAMESPACE,
	  'ascent': DEFAULT_NAMESPACE,
	  'attributeName': DEFAULT_NAMESPACE,
	  'attributeType': DEFAULT_NAMESPACE,
	  'azimuth': DEFAULT_NAMESPACE,
	  'bandwidth': DEFAULT_NAMESPACE,
	  'baseFrequency': DEFAULT_NAMESPACE,
	  'baseProfile': DEFAULT_NAMESPACE,
	  'baseline-shift': DEFAULT_NAMESPACE,
	  'bbox': DEFAULT_NAMESPACE,
	  'begin': DEFAULT_NAMESPACE,
	  'bias': DEFAULT_NAMESPACE,
	  'by': DEFAULT_NAMESPACE,
	  'calcMode': DEFAULT_NAMESPACE,
	  'cap-height': DEFAULT_NAMESPACE,
	  'class': DEFAULT_NAMESPACE,
	  'clip': DEFAULT_NAMESPACE,
	  'clip-path': DEFAULT_NAMESPACE,
	  'clip-rule': DEFAULT_NAMESPACE,
	  'clipPathUnits': DEFAULT_NAMESPACE,
	  'color': DEFAULT_NAMESPACE,
	  'color-interpolation': DEFAULT_NAMESPACE,
	  'color-interpolation-filters': DEFAULT_NAMESPACE,
	  'color-profile': DEFAULT_NAMESPACE,
	  'color-rendering': DEFAULT_NAMESPACE,
	  'content': DEFAULT_NAMESPACE,
	  'contentScriptType': DEFAULT_NAMESPACE,
	  'contentStyleType': DEFAULT_NAMESPACE,
	  'cursor': DEFAULT_NAMESPACE,
	  'cx': DEFAULT_NAMESPACE,
	  'cy': DEFAULT_NAMESPACE,
	  'd': DEFAULT_NAMESPACE,
	  'datatype': DEFAULT_NAMESPACE,
	  'defaultAction': DEFAULT_NAMESPACE,
	  'descent': DEFAULT_NAMESPACE,
	  'diffuseConstant': DEFAULT_NAMESPACE,
	  'direction': DEFAULT_NAMESPACE,
	  'display': DEFAULT_NAMESPACE,
	  'divisor': DEFAULT_NAMESPACE,
	  'dominant-baseline': DEFAULT_NAMESPACE,
	  'dur': DEFAULT_NAMESPACE,
	  'dx': DEFAULT_NAMESPACE,
	  'dy': DEFAULT_NAMESPACE,
	  'edgeMode': DEFAULT_NAMESPACE,
	  'editable': DEFAULT_NAMESPACE,
	  'elevation': DEFAULT_NAMESPACE,
	  'enable-background': DEFAULT_NAMESPACE,
	  'end': DEFAULT_NAMESPACE,
	  'ev:event': EV_NAMESPACE,
	  'event': DEFAULT_NAMESPACE,
	  'exponent': DEFAULT_NAMESPACE,
	  'externalResourcesRequired': DEFAULT_NAMESPACE,
	  'fill': DEFAULT_NAMESPACE,
	  'fill-opacity': DEFAULT_NAMESPACE,
	  'fill-rule': DEFAULT_NAMESPACE,
	  'filter': DEFAULT_NAMESPACE,
	  'filterRes': DEFAULT_NAMESPACE,
	  'filterUnits': DEFAULT_NAMESPACE,
	  'flood-color': DEFAULT_NAMESPACE,
	  'flood-opacity': DEFAULT_NAMESPACE,
	  'focusHighlight': DEFAULT_NAMESPACE,
	  'focusable': DEFAULT_NAMESPACE,
	  'font-family': DEFAULT_NAMESPACE,
	  'font-size': DEFAULT_NAMESPACE,
	  'font-size-adjust': DEFAULT_NAMESPACE,
	  'font-stretch': DEFAULT_NAMESPACE,
	  'font-style': DEFAULT_NAMESPACE,
	  'font-variant': DEFAULT_NAMESPACE,
	  'font-weight': DEFAULT_NAMESPACE,
	  'format': DEFAULT_NAMESPACE,
	  'from': DEFAULT_NAMESPACE,
	  'fx': DEFAULT_NAMESPACE,
	  'fy': DEFAULT_NAMESPACE,
	  'g1': DEFAULT_NAMESPACE,
	  'g2': DEFAULT_NAMESPACE,
	  'glyph-name': DEFAULT_NAMESPACE,
	  'glyph-orientation-horizontal': DEFAULT_NAMESPACE,
	  'glyph-orientation-vertical': DEFAULT_NAMESPACE,
	  'glyphRef': DEFAULT_NAMESPACE,
	  'gradientTransform': DEFAULT_NAMESPACE,
	  'gradientUnits': DEFAULT_NAMESPACE,
	  'handler': DEFAULT_NAMESPACE,
	  'hanging': DEFAULT_NAMESPACE,
	  'height': DEFAULT_NAMESPACE,
	  'horiz-adv-x': DEFAULT_NAMESPACE,
	  'horiz-origin-x': DEFAULT_NAMESPACE,
	  'horiz-origin-y': DEFAULT_NAMESPACE,
	  'id': DEFAULT_NAMESPACE,
	  'ideographic': DEFAULT_NAMESPACE,
	  'image-rendering': DEFAULT_NAMESPACE,
	  'in': DEFAULT_NAMESPACE,
	  'in2': DEFAULT_NAMESPACE,
	  'initialVisibility': DEFAULT_NAMESPACE,
	  'intercept': DEFAULT_NAMESPACE,
	  'k': DEFAULT_NAMESPACE,
	  'k1': DEFAULT_NAMESPACE,
	  'k2': DEFAULT_NAMESPACE,
	  'k3': DEFAULT_NAMESPACE,
	  'k4': DEFAULT_NAMESPACE,
	  'kernelMatrix': DEFAULT_NAMESPACE,
	  'kernelUnitLength': DEFAULT_NAMESPACE,
	  'kerning': DEFAULT_NAMESPACE,
	  'keyPoints': DEFAULT_NAMESPACE,
	  'keySplines': DEFAULT_NAMESPACE,
	  'keyTimes': DEFAULT_NAMESPACE,
	  'lang': DEFAULT_NAMESPACE,
	  'lengthAdjust': DEFAULT_NAMESPACE,
	  'letter-spacing': DEFAULT_NAMESPACE,
	  'lighting-color': DEFAULT_NAMESPACE,
	  'limitingConeAngle': DEFAULT_NAMESPACE,
	  'local': DEFAULT_NAMESPACE,
	  'marker-end': DEFAULT_NAMESPACE,
	  'marker-mid': DEFAULT_NAMESPACE,
	  'marker-start': DEFAULT_NAMESPACE,
	  'markerHeight': DEFAULT_NAMESPACE,
	  'markerUnits': DEFAULT_NAMESPACE,
	  'markerWidth': DEFAULT_NAMESPACE,
	  'mask': DEFAULT_NAMESPACE,
	  'maskContentUnits': DEFAULT_NAMESPACE,
	  'maskUnits': DEFAULT_NAMESPACE,
	  'mathematical': DEFAULT_NAMESPACE,
	  'max': DEFAULT_NAMESPACE,
	  'media': DEFAULT_NAMESPACE,
	  'mediaCharacterEncoding': DEFAULT_NAMESPACE,
	  'mediaContentEncodings': DEFAULT_NAMESPACE,
	  'mediaSize': DEFAULT_NAMESPACE,
	  'mediaTime': DEFAULT_NAMESPACE,
	  'method': DEFAULT_NAMESPACE,
	  'min': DEFAULT_NAMESPACE,
	  'mode': DEFAULT_NAMESPACE,
	  'name': DEFAULT_NAMESPACE,
	  'nav-down': DEFAULT_NAMESPACE,
	  'nav-down-left': DEFAULT_NAMESPACE,
	  'nav-down-right': DEFAULT_NAMESPACE,
	  'nav-left': DEFAULT_NAMESPACE,
	  'nav-next': DEFAULT_NAMESPACE,
	  'nav-prev': DEFAULT_NAMESPACE,
	  'nav-right': DEFAULT_NAMESPACE,
	  'nav-up': DEFAULT_NAMESPACE,
	  'nav-up-left': DEFAULT_NAMESPACE,
	  'nav-up-right': DEFAULT_NAMESPACE,
	  'numOctaves': DEFAULT_NAMESPACE,
	  'observer': DEFAULT_NAMESPACE,
	  'offset': DEFAULT_NAMESPACE,
	  'opacity': DEFAULT_NAMESPACE,
	  'operator': DEFAULT_NAMESPACE,
	  'order': DEFAULT_NAMESPACE,
	  'orient': DEFAULT_NAMESPACE,
	  'orientation': DEFAULT_NAMESPACE,
	  'origin': DEFAULT_NAMESPACE,
	  'overflow': DEFAULT_NAMESPACE,
	  'overlay': DEFAULT_NAMESPACE,
	  'overline-position': DEFAULT_NAMESPACE,
	  'overline-thickness': DEFAULT_NAMESPACE,
	  'panose-1': DEFAULT_NAMESPACE,
	  'path': DEFAULT_NAMESPACE,
	  'pathLength': DEFAULT_NAMESPACE,
	  'patternContentUnits': DEFAULT_NAMESPACE,
	  'patternTransform': DEFAULT_NAMESPACE,
	  'patternUnits': DEFAULT_NAMESPACE,
	  'phase': DEFAULT_NAMESPACE,
	  'playbackOrder': DEFAULT_NAMESPACE,
	  'pointer-events': DEFAULT_NAMESPACE,
	  'points': DEFAULT_NAMESPACE,
	  'pointsAtX': DEFAULT_NAMESPACE,
	  'pointsAtY': DEFAULT_NAMESPACE,
	  'pointsAtZ': DEFAULT_NAMESPACE,
	  'preserveAlpha': DEFAULT_NAMESPACE,
	  'preserveAspectRatio': DEFAULT_NAMESPACE,
	  'primitiveUnits': DEFAULT_NAMESPACE,
	  'propagate': DEFAULT_NAMESPACE,
	  'property': DEFAULT_NAMESPACE,
	  'r': DEFAULT_NAMESPACE,
	  'radius': DEFAULT_NAMESPACE,
	  'refX': DEFAULT_NAMESPACE,
	  'refY': DEFAULT_NAMESPACE,
	  'rel': DEFAULT_NAMESPACE,
	  'rendering-intent': DEFAULT_NAMESPACE,
	  'repeatCount': DEFAULT_NAMESPACE,
	  'repeatDur': DEFAULT_NAMESPACE,
	  'requiredExtensions': DEFAULT_NAMESPACE,
	  'requiredFeatures': DEFAULT_NAMESPACE,
	  'requiredFonts': DEFAULT_NAMESPACE,
	  'requiredFormats': DEFAULT_NAMESPACE,
	  'resource': DEFAULT_NAMESPACE,
	  'restart': DEFAULT_NAMESPACE,
	  'result': DEFAULT_NAMESPACE,
	  'rev': DEFAULT_NAMESPACE,
	  'role': DEFAULT_NAMESPACE,
	  'rotate': DEFAULT_NAMESPACE,
	  'rx': DEFAULT_NAMESPACE,
	  'ry': DEFAULT_NAMESPACE,
	  'scale': DEFAULT_NAMESPACE,
	  'seed': DEFAULT_NAMESPACE,
	  'shape-rendering': DEFAULT_NAMESPACE,
	  'slope': DEFAULT_NAMESPACE,
	  'snapshotTime': DEFAULT_NAMESPACE,
	  'spacing': DEFAULT_NAMESPACE,
	  'specularConstant': DEFAULT_NAMESPACE,
	  'specularExponent': DEFAULT_NAMESPACE,
	  'spreadMethod': DEFAULT_NAMESPACE,
	  'startOffset': DEFAULT_NAMESPACE,
	  'stdDeviation': DEFAULT_NAMESPACE,
	  'stemh': DEFAULT_NAMESPACE,
	  'stemv': DEFAULT_NAMESPACE,
	  'stitchTiles': DEFAULT_NAMESPACE,
	  'stop-color': DEFAULT_NAMESPACE,
	  'stop-opacity': DEFAULT_NAMESPACE,
	  'strikethrough-position': DEFAULT_NAMESPACE,
	  'strikethrough-thickness': DEFAULT_NAMESPACE,
	  'string': DEFAULT_NAMESPACE,
	  'stroke': DEFAULT_NAMESPACE,
	  'stroke-dasharray': DEFAULT_NAMESPACE,
	  'stroke-dashoffset': DEFAULT_NAMESPACE,
	  'stroke-linecap': DEFAULT_NAMESPACE,
	  'stroke-linejoin': DEFAULT_NAMESPACE,
	  'stroke-miterlimit': DEFAULT_NAMESPACE,
	  'stroke-opacity': DEFAULT_NAMESPACE,
	  'stroke-width': DEFAULT_NAMESPACE,
	  'surfaceScale': DEFAULT_NAMESPACE,
	  'syncBehavior': DEFAULT_NAMESPACE,
	  'syncBehaviorDefault': DEFAULT_NAMESPACE,
	  'syncMaster': DEFAULT_NAMESPACE,
	  'syncTolerance': DEFAULT_NAMESPACE,
	  'syncToleranceDefault': DEFAULT_NAMESPACE,
	  'systemLanguage': DEFAULT_NAMESPACE,
	  'tableValues': DEFAULT_NAMESPACE,
	  'target': DEFAULT_NAMESPACE,
	  'targetX': DEFAULT_NAMESPACE,
	  'targetY': DEFAULT_NAMESPACE,
	  'text-anchor': DEFAULT_NAMESPACE,
	  'text-decoration': DEFAULT_NAMESPACE,
	  'text-rendering': DEFAULT_NAMESPACE,
	  'textLength': DEFAULT_NAMESPACE,
	  'timelineBegin': DEFAULT_NAMESPACE,
	  'title': DEFAULT_NAMESPACE,
	  'to': DEFAULT_NAMESPACE,
	  'transform': DEFAULT_NAMESPACE,
	  'transformBehavior': DEFAULT_NAMESPACE,
	  'type': DEFAULT_NAMESPACE,
	  'typeof': DEFAULT_NAMESPACE,
	  'u1': DEFAULT_NAMESPACE,
	  'u2': DEFAULT_NAMESPACE,
	  'underline-position': DEFAULT_NAMESPACE,
	  'underline-thickness': DEFAULT_NAMESPACE,
	  'unicode': DEFAULT_NAMESPACE,
	  'unicode-bidi': DEFAULT_NAMESPACE,
	  'unicode-range': DEFAULT_NAMESPACE,
	  'units-per-em': DEFAULT_NAMESPACE,
	  'v-alphabetic': DEFAULT_NAMESPACE,
	  'v-hanging': DEFAULT_NAMESPACE,
	  'v-ideographic': DEFAULT_NAMESPACE,
	  'v-mathematical': DEFAULT_NAMESPACE,
	  'values': DEFAULT_NAMESPACE,
	  'version': DEFAULT_NAMESPACE,
	  'vert-adv-y': DEFAULT_NAMESPACE,
	  'vert-origin-x': DEFAULT_NAMESPACE,
	  'vert-origin-y': DEFAULT_NAMESPACE,
	  'viewBox': DEFAULT_NAMESPACE,
	  'viewTarget': DEFAULT_NAMESPACE,
	  'visibility': DEFAULT_NAMESPACE,
	  'width': DEFAULT_NAMESPACE,
	  'widths': DEFAULT_NAMESPACE,
	  'word-spacing': DEFAULT_NAMESPACE,
	  'writing-mode': DEFAULT_NAMESPACE,
	  'x': DEFAULT_NAMESPACE,
	  'x-height': DEFAULT_NAMESPACE,
	  'x1': DEFAULT_NAMESPACE,
	  'x2': DEFAULT_NAMESPACE,
	  'xChannelSelector': DEFAULT_NAMESPACE,
	  'xlink:actuate': XLINK_NAMESPACE,
	  'xlink:arcrole': XLINK_NAMESPACE,
	  'xlink:href': XLINK_NAMESPACE,
	  'xlink:role': XLINK_NAMESPACE,
	  'xlink:show': XLINK_NAMESPACE,
	  'xlink:title': XLINK_NAMESPACE,
	  'xlink:type': XLINK_NAMESPACE,
	  'xml:base': XML_NAMESPACE,
	  'xml:id': XML_NAMESPACE,
	  'xml:lang': XML_NAMESPACE,
	  'xml:space': XML_NAMESPACE,
	  'y': DEFAULT_NAMESPACE,
	  'y1': DEFAULT_NAMESPACE,
	  'y2': DEFAULT_NAMESPACE,
	  'yChannelSelector': DEFAULT_NAMESPACE,
	  'z': DEFAULT_NAMESPACE,
	  'zoomAndPan': DEFAULT_NAMESPACE
	};

	module.exports = SVGAttributeNamespace;

	function SVGAttributeNamespace(value) {
	  if (SVG_PROPERTIES.hasOwnProperty(value)) {
	    return SVG_PROPERTIES[value];
	  }
	}

/***/ },
/* 310 */
/***/ function(module, exports) {

	'use strict';

	module.exports = AttributeHook;

	function AttributeHook(namespace, value) {
	    if (!(this instanceof AttributeHook)) {
	        return new AttributeHook(namespace, value);
	    }

	    this.namespace = namespace;
	    this.value = value;
	}

	AttributeHook.prototype.hook = function (node, prop, prev) {
	    if (prev && prev.type === 'AttributeHook' && prev.value === this.value && prev.namespace === this.namespace) {
	        return;
	    }

	    node.setAttributeNS(this.namespace, prop, this.value);
	};

	AttributeHook.prototype.unhook = function (node, prop, next) {
	    if (next && next.type === 'AttributeHook' && next.namespace === this.namespace) {
	        return;
	    }

	    var colonPosition = prop.indexOf(':');
	    var localName = colonPosition > -1 ? prop.substr(colonPosition + 1) : prop;
	    node.removeAttributeNS(this.namespace, localName);
	};

	AttributeHook.prototype.type = 'AttributeHook';

/***/ },
/* 311 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	var _slicedToArray = function () {
	  function sliceIterator(arr, i) {
	    var _arr = [];var _n = true;var _d = false;var _e = undefined;try {
	      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
	        _arr.push(_s.value);if (i && _arr.length === i) break;
	      }
	    } catch (err) {
	      _d = true;_e = err;
	    } finally {
	      try {
	        if (!_n && _i["return"]) _i["return"]();
	      } finally {
	        if (_d) throw _e;
	      }
	    }return _arr;
	  }return function (arr, i) {
	    if (Array.isArray(arr)) {
	      return arr;
	    } else if (Symbol.iterator in Object(arr)) {
	      return sliceIterator(arr, i);
	    } else {
	      throw new TypeError("Invalid attempt to destructure non-iterable instance");
	    }
	  };
	}();

	var Rx = __webpack_require__(287);
	var fromEvent = __webpack_require__(312);
	var VDOM = {
	  h: __webpack_require__(293),
	  diff: __webpack_require__(313),
	  patch: __webpack_require__(319),
	  parse: typeof window !== "undefined" ? __webpack_require__(328) : function () {}
	};

	var _require = __webpack_require__(331);

	var transposeVTree = _require.transposeVTree;

	var matchesSelector = undefined;
	// Try-catch to prevent unnecessary import of DOM-specifics in Node.js env:
	try {
	  matchesSelector = __webpack_require__(332);
	} catch (err) {
	  matchesSelector = function matchesSelector() {};
	}

	function isElement(obj) {
	  return (typeof HTMLElement === "undefined" ? "undefined" : _typeof(HTMLElement)) === "object" ? obj instanceof HTMLElement || obj instanceof DocumentFragment : //DOM2
	  obj && (typeof obj === "undefined" ? "undefined" : _typeof(obj)) === "object" && obj !== null && (obj.nodeType === 1 || obj.nodeType === 11) && typeof obj.nodeName === "string";
	}

	function wrapTopLevelVTree(vtree, rootElem) {
	  var _vtree$properties$id = vtree.properties.id;
	  var vtreeId = _vtree$properties$id === undefined ? "" : _vtree$properties$id;
	  var _vtree$properties$className = vtree.properties.className;
	  var vtreeClass = _vtree$properties$className === undefined ? "" : _vtree$properties$className;

	  var sameId = vtreeId === rootElem.id;
	  var sameClass = vtreeClass === rootElem.className;
	  var sameTagName = vtree.tagName.toUpperCase() === rootElem.tagName;
	  if (sameId && sameClass && sameTagName) {
	    return vtree;
	  }
	  var attrs = {};
	  if (rootElem.id) {
	    attrs.id = rootElem.id;
	  }
	  if (rootElem.className) {
	    attrs.className = rootElem.className;
	  }
	  return VDOM.h(rootElem.tagName, attrs, [vtree]);
	}

	function makeDiffAndPatchToElement$(rootElem) {
	  return function diffAndPatchToElement$(_ref) {
	    var _ref2 = _slicedToArray(_ref, 2);

	    var oldVTree = _ref2[0];
	    var newVTree = _ref2[1];

	    if (typeof newVTree === "undefined") {
	      return Rx.Observable.empty();
	    }

	    var prevVTree = wrapTopLevelVTree(oldVTree, rootElem);
	    var nextVTree = wrapTopLevelVTree(newVTree, rootElem);
	    /* eslint-disable */
	    rootElem = VDOM.patch(rootElem, VDOM.diff(prevVTree, nextVTree));
	    /* eslint-enable */
	    return Rx.Observable.just(rootElem);
	  };
	}

	function renderRawRootElem$(vtree$, domContainer) {
	  var diffAndPatchToElement$ = makeDiffAndPatchToElement$(domContainer);
	  return vtree$.flatMapLatest(transposeVTree).startWith(VDOM.parse(domContainer)).pairwise().flatMap(diffAndPatchToElement$);
	}

	function isolateSource(source, scope) {
	  return source.select(".cycle-scope-" + scope);
	}

	function isolateSink(sink, scope) {
	  return sink.map(function (vtree) {
	    var _vtree$properties$className2 = vtree.properties.className;
	    var vtreeClass = _vtree$properties$className2 === undefined ? "" : _vtree$properties$className2;

	    if (vtreeClass.indexOf("cycle-scope-" + scope) === -1) {
	      var c = (vtreeClass + " cycle-scope-" + scope).trim();
	      vtree.properties.className = c;
	    }
	    if (vtree.properties.attributes) {
	      // for svg root elements
	      var vtreeAttrClass = vtree.properties.attributes["class"] || "";
	      if (vtreeAttrClass.indexOf("cycle-scope-" + scope) === -1) {
	        var cattr = (vtreeAttrClass + " cycle-scope-" + scope).trim();
	        vtree.properties.attributes["class"] = cattr;
	      }
	    }
	    return vtree;
	  });
	}

	function makeIsStrictlyInRootScope(namespace) {
	  var classIsForeign = function classIsForeign(c) {
	    var matched = c.match(/cycle-scope-(\S+)/);
	    return matched && namespace.indexOf("." + c) === -1;
	  };
	  var classIsDomestic = function classIsDomestic(c) {
	    var matched = c.match(/cycle-scope-(\S+)/);
	    return matched && namespace.indexOf("." + c) !== -1;
	  };
	  return function isStrictlyInRootScope(leaf) {
	    for (var el = leaf; el; el = el.parentElement) {
	      var split = String.prototype.split;
	      var classList = el.classList || split.call(el.className, " ");
	      if (Array.prototype.some.call(classList, classIsDomestic)) {
	        return true;
	      }
	      if (Array.prototype.some.call(classList, classIsForeign)) {
	        return false;
	      }
	    }
	    return true;
	  };
	}

	var eventTypesThatDontBubble = ["load", "unload", "focus", "blur", "mouseenter", "mouseleave", "submit", "change", "reset", "timeupdate", "playing", "waiting", "seeking", "seeked", "ended", "loadedmetadata", "loadeddata", "canplay", "canplaythrough", "durationchange", "play", "pause", "ratechange", "volumechange", "suspend", "emptied", "stalled"];

	function maybeMutateEventPropagationAttributes(event) {
	  if (!event.hasOwnProperty("propagationHasBeenStopped")) {
	    (function () {
	      event.propagationHasBeenStopped = false;
	      var oldStopPropagation = event.stopPropagation;
	      event.stopPropagation = function stopPropagation() {
	        oldStopPropagation.call(this);
	        this.propagationHasBeenStopped = true;
	      };
	    })();
	  }
	}

	function mutateEventCurrentTarget(event, currentTargetElement) {
	  try {
	    Object.defineProperty(event, "currentTarget", {
	      value: currentTargetElement,
	      configurable: true
	    });
	  } catch (err) {
	    void err; // noop
	  }
	  event.ownerTarget = currentTargetElement;
	}

	function makeSimulateBubbling(namespace, rootEl) {
	  var isStrictlyInRootScope = makeIsStrictlyInRootScope(namespace);
	  var descendantSel = namespace.join(" ");
	  var topSel = namespace.join("");
	  var roof = rootEl.parentElement;

	  return function simulateBubbling(ev) {
	    maybeMutateEventPropagationAttributes(ev);
	    if (ev.propagationHasBeenStopped) {
	      return false;
	    }
	    for (var el = ev.target; el && el !== roof; el = el.parentElement) {
	      if (!isStrictlyInRootScope(el)) {
	        continue;
	      }
	      if (matchesSelector(el, descendantSel) || matchesSelector(el, topSel)) {
	        mutateEventCurrentTarget(ev, el);
	        return true;
	      }
	    }
	    return false;
	  };
	}

	function makeEventsSelector(rootEl$, namespace) {
	  return function events(eventName) {
	    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	    if (typeof eventName !== "string") {
	      throw new Error("DOM driver's events() expects argument to be a " + "string representing the event type to listen for.");
	    }
	    var useCapture = false;
	    if (eventTypesThatDontBubble.indexOf(eventName) !== -1) {
	      useCapture = true;
	    }
	    if (typeof options.useCapture === "boolean") {
	      useCapture = options.useCapture;
	    }

	    return rootEl$.first().flatMapLatest(function (rootEl) {
	      if (!namespace || namespace.length === 0) {
	        return fromEvent(rootEl, eventName, useCapture);
	      }
	      var simulateBubbling = makeSimulateBubbling(namespace, rootEl);
	      return fromEvent(rootEl, eventName, useCapture).filter(simulateBubbling);
	    }).share();
	  };
	}

	function makeElementSelector(rootEl$) {
	  return function select(selector) {
	    if (typeof selector !== "string") {
	      throw new Error("DOM driver's select() expects the argument to be a " + "string as a CSS selector");
	    }

	    var namespace = this.namespace;
	    var trimmedSelector = selector.trim();
	    var childNamespace = trimmedSelector === ":root" ? namespace : namespace.concat(trimmedSelector);
	    var element$ = rootEl$.map(function (rootEl) {
	      if (childNamespace.join("") === "") {
	        return rootEl;
	      }
	      var nodeList = rootEl.querySelectorAll(childNamespace.join(" "));
	      if (nodeList.length === 0) {
	        nodeList = rootEl.querySelectorAll(childNamespace.join(""));
	      }
	      var array = Array.prototype.slice.call(nodeList);
	      return array.filter(makeIsStrictlyInRootScope(childNamespace));
	    });
	    return {
	      observable: element$,
	      namespace: childNamespace,
	      select: makeElementSelector(rootEl$),
	      events: makeEventsSelector(rootEl$, childNamespace),
	      isolateSource: isolateSource,
	      isolateSink: isolateSink
	    };
	  };
	}

	function validateDOMSink(vtree$) {
	  if (!vtree$ || typeof vtree$.subscribe !== "function") {
	    throw new Error("The DOM driver function expects as input an " + "Observable of virtual DOM elements");
	  }
	}

	function defaultOnErrorFn(msg) {
	  if (console && console.error) {
	    console.error(msg);
	  } else {
	    console.log(msg);
	  }
	}

	function makeDOMDriver(container, options) {
	  // Find and prepare the container
	  var domContainer = typeof container === "string" ? document.querySelector(container) : container;
	  // Check pre-conditions
	  if (typeof container === "string" && domContainer === null) {
	    throw new Error("Cannot render into unknown element `" + container + "`");
	  } else if (!isElement(domContainer)) {
	    throw new Error("Given container is not a DOM element neither a selector " + "string.");
	  }

	  var _ref3 = options || {};

	  var _ref3$onError = _ref3.onError;
	  var onError = _ref3$onError === undefined ? defaultOnErrorFn : _ref3$onError;

	  if (typeof onError !== "function") {
	    throw new Error("You provided an `onError` to makeDOMDriver but it was " + "not a function. It should be a callback function to handle errors.");
	  }

	  return function domDriver(vtree$) {
	    validateDOMSink(vtree$);
	    var rootElem$ = renderRawRootElem$(vtree$, domContainer).startWith(domContainer).doOnError(onError).replay(null, 1);
	    var disposable = rootElem$.connect();
	    return {
	      observable: rootElem$,
	      namespace: [],
	      select: makeElementSelector(rootElem$),
	      events: makeEventsSelector(rootElem$, []),
	      dispose: function dispose() {
	        return disposable.dispose();
	      },
	      isolateSource: isolateSource,
	      isolateSink: isolateSink
	    };
	  };
	}

	module.exports = {
	  isElement: isElement,
	  wrapTopLevelVTree: wrapTopLevelVTree,
	  makeDiffAndPatchToElement$: makeDiffAndPatchToElement$,
	  renderRawRootElem$: renderRawRootElem$,
	  validateDOMSink: validateDOMSink,

	  makeDOMDriver: makeDOMDriver
	};

/***/ },
/* 312 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var Rx = __webpack_require__(287);

	var disposableCreate = Rx.Disposable.create;
	var CompositeDisposable = Rx.CompositeDisposable;
	var AnonymousObservable = Rx.AnonymousObservable;

	function createListener(_ref) {
	  var element = _ref.element;
	  var eventName = _ref.eventName;
	  var handler = _ref.handler;
	  var useCapture = _ref.useCapture;

	  if (element.addEventListener) {
	    element.addEventListener(eventName, handler, useCapture);
	    return disposableCreate(function removeEventListener() {
	      element.removeEventListener(eventName, handler, useCapture);
	    });
	  }
	  throw new Error("No listener found");
	}

	function createEventListener(_ref2) {
	  var element = _ref2.element;
	  var eventName = _ref2.eventName;
	  var handler = _ref2.handler;
	  var useCapture = _ref2.useCapture;

	  var disposables = new CompositeDisposable();

	  if (Array.isArray(element)) {
	    for (var i = 0, len = element.length; i < len; i++) {
	      disposables.add(createEventListener({
	        element: element[i],
	        eventName: eventName,
	        handler: handler,
	        useCapture: useCapture
	      }));
	    }
	  } else if (element) {
	    disposables.add(createListener({ element: element, eventName: eventName, handler: handler, useCapture: useCapture }));
	  }
	  return disposables;
	}

	function fromEvent(element, eventName) {
	  var useCapture = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

	  return new AnonymousObservable(function subscribe(observer) {
	    return createEventListener({
	      element: element,
	      eventName: eventName,
	      handler: function handler() {
	        observer.onNext(arguments[0]);
	      },
	      useCapture: useCapture
	    });
	  }).share();
	}

	module.exports = fromEvent;

/***/ },
/* 313 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var diff = __webpack_require__(314);

	module.exports = diff;

/***/ },
/* 314 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var isArray = __webpack_require__(292);

	var VPatch = __webpack_require__(315);
	var isVNode = __webpack_require__(296);
	var isVText = __webpack_require__(301);
	var isWidget = __webpack_require__(297);
	var isThunk = __webpack_require__(298);
	var handleThunk = __webpack_require__(316);

	var diffProps = __webpack_require__(317);

	module.exports = diff;

	function diff(a, b) {
	    var patch = { a: a };
	    walk(a, b, patch, 0);
	    return patch;
	}

	function walk(a, b, patch, index) {
	    if (a === b) {
	        return;
	    }

	    var apply = patch[index];
	    var applyClear = false;

	    if (isThunk(a) || isThunk(b)) {
	        thunks(a, b, patch, index);
	    } else if (b == null) {

	        // If a is a widget we will add a remove patch for it
	        // Otherwise any child widgets/hooks must be destroyed.
	        // This prevents adding two remove patches for a widget.
	        if (!isWidget(a)) {
	            clearState(a, patch, index);
	            apply = patch[index];
	        }

	        apply = appendPatch(apply, new VPatch(VPatch.REMOVE, a, b));
	    } else if (isVNode(b)) {
	        if (isVNode(a)) {
	            if (a.tagName === b.tagName && a.namespace === b.namespace && a.key === b.key) {
	                var propsPatch = diffProps(a.properties, b.properties);
	                if (propsPatch) {
	                    apply = appendPatch(apply, new VPatch(VPatch.PROPS, a, propsPatch));
	                }
	                apply = diffChildren(a, b, patch, apply, index);
	            } else {
	                apply = appendPatch(apply, new VPatch(VPatch.VNODE, a, b));
	                applyClear = true;
	            }
	        } else {
	            apply = appendPatch(apply, new VPatch(VPatch.VNODE, a, b));
	            applyClear = true;
	        }
	    } else if (isVText(b)) {
	        if (!isVText(a)) {
	            apply = appendPatch(apply, new VPatch(VPatch.VTEXT, a, b));
	            applyClear = true;
	        } else if (a.text !== b.text) {
	            apply = appendPatch(apply, new VPatch(VPatch.VTEXT, a, b));
	        }
	    } else if (isWidget(b)) {
	        if (!isWidget(a)) {
	            applyClear = true;
	        }

	        apply = appendPatch(apply, new VPatch(VPatch.WIDGET, a, b));
	    }

	    if (apply) {
	        patch[index] = apply;
	    }

	    if (applyClear) {
	        clearState(a, patch, index);
	    }
	}

	function diffChildren(a, b, patch, apply, index) {
	    var aChildren = a.children;
	    var orderedSet = reorder(aChildren, b.children);
	    var bChildren = orderedSet.children;

	    var aLen = aChildren.length;
	    var bLen = bChildren.length;
	    var len = aLen > bLen ? aLen : bLen;

	    for (var i = 0; i < len; i++) {
	        var leftNode = aChildren[i];
	        var rightNode = bChildren[i];
	        index += 1;

	        if (!leftNode) {
	            if (rightNode) {
	                // Excess nodes in b need to be added
	                apply = appendPatch(apply, new VPatch(VPatch.INSERT, null, rightNode));
	            }
	        } else {
	            walk(leftNode, rightNode, patch, index);
	        }

	        if (isVNode(leftNode) && leftNode.count) {
	            index += leftNode.count;
	        }
	    }

	    if (orderedSet.moves) {
	        // Reorder nodes last
	        apply = appendPatch(apply, new VPatch(VPatch.ORDER, a, orderedSet.moves));
	    }

	    return apply;
	}

	function clearState(vNode, patch, index) {
	    // TODO: Make this a single walk, not two
	    unhook(vNode, patch, index);
	    destroyWidgets(vNode, patch, index);
	}

	// Patch records for all destroyed widgets must be added because we need
	// a DOM node reference for the destroy function
	function destroyWidgets(vNode, patch, index) {
	    if (isWidget(vNode)) {
	        if (typeof vNode.destroy === "function") {
	            patch[index] = appendPatch(patch[index], new VPatch(VPatch.REMOVE, vNode, null));
	        }
	    } else if (isVNode(vNode) && (vNode.hasWidgets || vNode.hasThunks)) {
	        var children = vNode.children;
	        var len = children.length;
	        for (var i = 0; i < len; i++) {
	            var child = children[i];
	            index += 1;

	            destroyWidgets(child, patch, index);

	            if (isVNode(child) && child.count) {
	                index += child.count;
	            }
	        }
	    } else if (isThunk(vNode)) {
	        thunks(vNode, null, patch, index);
	    }
	}

	// Create a sub-patch for thunks
	function thunks(a, b, patch, index) {
	    var nodes = handleThunk(a, b);
	    var thunkPatch = diff(nodes.a, nodes.b);
	    if (hasPatches(thunkPatch)) {
	        patch[index] = new VPatch(VPatch.THUNK, null, thunkPatch);
	    }
	}

	function hasPatches(patch) {
	    for (var index in patch) {
	        if (index !== "a") {
	            return true;
	        }
	    }

	    return false;
	}

	// Execute hooks when two nodes are identical
	function unhook(vNode, patch, index) {
	    if (isVNode(vNode)) {
	        if (vNode.hooks) {
	            patch[index] = appendPatch(patch[index], new VPatch(VPatch.PROPS, vNode, undefinedKeys(vNode.hooks)));
	        }

	        if (vNode.descendantHooks || vNode.hasThunks) {
	            var children = vNode.children;
	            var len = children.length;
	            for (var i = 0; i < len; i++) {
	                var child = children[i];
	                index += 1;

	                unhook(child, patch, index);

	                if (isVNode(child) && child.count) {
	                    index += child.count;
	                }
	            }
	        }
	    } else if (isThunk(vNode)) {
	        thunks(vNode, null, patch, index);
	    }
	}

	function undefinedKeys(obj) {
	    var result = {};

	    for (var key in obj) {
	        result[key] = undefined;
	    }

	    return result;
	}

	// List diff, naive left to right reordering
	function reorder(aChildren, bChildren) {
	    // O(M) time, O(M) memory
	    var bChildIndex = keyIndex(bChildren);
	    var bKeys = bChildIndex.keys;
	    var bFree = bChildIndex.free;

	    if (bFree.length === bChildren.length) {
	        return {
	            children: bChildren,
	            moves: null
	        };
	    }

	    // O(N) time, O(N) memory
	    var aChildIndex = keyIndex(aChildren);
	    var aKeys = aChildIndex.keys;
	    var aFree = aChildIndex.free;

	    if (aFree.length === aChildren.length) {
	        return {
	            children: bChildren,
	            moves: null
	        };
	    }

	    // O(MAX(N, M)) memory
	    var newChildren = [];

	    var freeIndex = 0;
	    var freeCount = bFree.length;
	    var deletedItems = 0;

	    // Iterate through a and match a node in b
	    // O(N) time,
	    for (var i = 0; i < aChildren.length; i++) {
	        var aItem = aChildren[i];
	        var itemIndex;

	        if (aItem.key) {
	            if (bKeys.hasOwnProperty(aItem.key)) {
	                // Match up the old keys
	                itemIndex = bKeys[aItem.key];
	                newChildren.push(bChildren[itemIndex]);
	            } else {
	                // Remove old keyed items
	                itemIndex = i - deletedItems++;
	                newChildren.push(null);
	            }
	        } else {
	            // Match the item in a with the next free item in b
	            if (freeIndex < freeCount) {
	                itemIndex = bFree[freeIndex++];
	                newChildren.push(bChildren[itemIndex]);
	            } else {
	                // There are no free items in b to match with
	                // the free items in a, so the extra free nodes
	                // are deleted.
	                itemIndex = i - deletedItems++;
	                newChildren.push(null);
	            }
	        }
	    }

	    var lastFreeIndex = freeIndex >= bFree.length ? bChildren.length : bFree[freeIndex];

	    // Iterate through b and append any new keys
	    // O(M) time
	    for (var j = 0; j < bChildren.length; j++) {
	        var newItem = bChildren[j];

	        if (newItem.key) {
	            if (!aKeys.hasOwnProperty(newItem.key)) {
	                // Add any new keyed items
	                // We are adding new items to the end and then sorting them
	                // in place. In future we should insert new items in place.
	                newChildren.push(newItem);
	            }
	        } else if (j >= lastFreeIndex) {
	            // Add any leftover non-keyed items
	            newChildren.push(newItem);
	        }
	    }

	    var simulate = newChildren.slice();
	    var simulateIndex = 0;
	    var removes = [];
	    var inserts = [];
	    var simulateItem;

	    for (var k = 0; k < bChildren.length;) {
	        var wantedItem = bChildren[k];
	        simulateItem = simulate[simulateIndex];

	        // remove items
	        while (simulateItem === null && simulate.length) {
	            removes.push(remove(simulate, simulateIndex, null));
	            simulateItem = simulate[simulateIndex];
	        }

	        if (!simulateItem || simulateItem.key !== wantedItem.key) {
	            // if we need a key in this position...
	            if (wantedItem.key) {
	                if (simulateItem && simulateItem.key) {
	                    // if an insert doesn't put this key in place, it needs to move
	                    if (bKeys[simulateItem.key] !== k + 1) {
	                        removes.push(remove(simulate, simulateIndex, simulateItem.key));
	                        simulateItem = simulate[simulateIndex];
	                        // if the remove didn't put the wanted item in place, we need to insert it
	                        if (!simulateItem || simulateItem.key !== wantedItem.key) {
	                            inserts.push({ key: wantedItem.key, to: k });
	                        }
	                        // items are matching, so skip ahead
	                        else {
	                                simulateIndex++;
	                            }
	                    } else {
	                        inserts.push({ key: wantedItem.key, to: k });
	                    }
	                } else {
	                    inserts.push({ key: wantedItem.key, to: k });
	                }
	                k++;
	            }
	            // a key in simulate has no matching wanted key, remove it
	            else if (simulateItem && simulateItem.key) {
	                    removes.push(remove(simulate, simulateIndex, simulateItem.key));
	                }
	        } else {
	            simulateIndex++;
	            k++;
	        }
	    }

	    // remove all the remaining nodes from simulate
	    while (simulateIndex < simulate.length) {
	        simulateItem = simulate[simulateIndex];
	        removes.push(remove(simulate, simulateIndex, simulateItem && simulateItem.key));
	    }

	    // If the only moves we have are deletes then we can just
	    // let the delete patch remove these items.
	    if (removes.length === deletedItems && !inserts.length) {
	        return {
	            children: newChildren,
	            moves: null
	        };
	    }

	    return {
	        children: newChildren,
	        moves: {
	            removes: removes,
	            inserts: inserts
	        }
	    };
	}

	function remove(arr, index, key) {
	    arr.splice(index, 1);

	    return {
	        from: index,
	        key: key
	    };
	}

	function keyIndex(children) {
	    var keys = {};
	    var free = [];
	    var length = children.length;

	    for (var i = 0; i < length; i++) {
	        var child = children[i];

	        if (child.key) {
	            keys[child.key] = i;
	        } else {
	            free.push(i);
	        }
	    }

	    return {
	        keys: keys, // A hash of key name to index
	        free: free // An array of unkeyed item indices
	    };
	}

	function appendPatch(apply, patch) {
	    if (apply) {
	        if (isArray(apply)) {
	            apply.push(patch);
	        } else {
	            apply = [apply, patch];
	        }

	        return apply;
	    } else {
	        return patch;
	    }
	}

/***/ },
/* 315 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var version = __webpack_require__(295);

	VirtualPatch.NONE = 0;
	VirtualPatch.VTEXT = 1;
	VirtualPatch.VNODE = 2;
	VirtualPatch.WIDGET = 3;
	VirtualPatch.PROPS = 4;
	VirtualPatch.ORDER = 5;
	VirtualPatch.INSERT = 6;
	VirtualPatch.REMOVE = 7;
	VirtualPatch.THUNK = 8;

	module.exports = VirtualPatch;

	function VirtualPatch(type, vNode, patch) {
	    this.type = Number(type);
	    this.vNode = vNode;
	    this.patch = patch;
	}

	VirtualPatch.prototype.version = version;
	VirtualPatch.prototype.type = "VirtualPatch";

/***/ },
/* 316 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var isVNode = __webpack_require__(296);
	var isVText = __webpack_require__(301);
	var isWidget = __webpack_require__(297);
	var isThunk = __webpack_require__(298);

	module.exports = handleThunk;

	function handleThunk(a, b) {
	    var renderedA = a;
	    var renderedB = b;

	    if (isThunk(b)) {
	        renderedB = renderThunk(b, a);
	    }

	    if (isThunk(a)) {
	        renderedA = renderThunk(a, null);
	    }

	    return {
	        a: renderedA,
	        b: renderedB
	    };
	}

	function renderThunk(thunk, previous) {
	    var renderedThunk = thunk.vnode;

	    if (!renderedThunk) {
	        renderedThunk = thunk.vnode = thunk.render(previous);
	    }

	    if (!(isVNode(renderedThunk) || isVText(renderedThunk) || isWidget(renderedThunk))) {
	        throw new Error("thunk did not return a valid node");
	    }

	    return renderedThunk;
	}

/***/ },
/* 317 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var isObject = __webpack_require__(318);
	var isHook = __webpack_require__(299);

	module.exports = diffProps;

	function diffProps(a, b) {
	    var diff;

	    for (var aKey in a) {
	        if (!(aKey in b)) {
	            diff = diff || {};
	            diff[aKey] = undefined;
	        }

	        var aValue = a[aKey];
	        var bValue = b[aKey];

	        if (aValue === bValue) {
	            continue;
	        } else if (isObject(aValue) && isObject(bValue)) {
	            if (getPrototype(bValue) !== getPrototype(aValue)) {
	                diff = diff || {};
	                diff[aKey] = bValue;
	            } else if (isHook(bValue)) {
	                diff = diff || {};
	                diff[aKey] = bValue;
	            } else {
	                var objectDiff = diffProps(aValue, bValue);
	                if (objectDiff) {
	                    diff = diff || {};
	                    diff[aKey] = objectDiff;
	                }
	            }
	        } else {
	            diff = diff || {};
	            diff[aKey] = bValue;
	        }
	    }

	    for (var bKey in b) {
	        if (!(bKey in a)) {
	            diff = diff || {};
	            diff[bKey] = b[bKey];
	        }
	    }

	    return diff;
	}

	function getPrototype(value) {
	    if (Object.getPrototypeOf) {
	        return Object.getPrototypeOf(value);
	    } else if (value.__proto__) {
	        return value.__proto__;
	    } else if (value.constructor) {
	        return value.constructor.prototype;
	    }
	}

/***/ },
/* 318 */
/***/ function(module, exports) {

	"use strict";

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	module.exports = function isObject(x) {
		return (typeof x === "undefined" ? "undefined" : _typeof(x)) === "object" && x !== null;
	};

/***/ },
/* 319 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var patch = __webpack_require__(320);

	module.exports = patch;

/***/ },
/* 320 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var document = __webpack_require__(321);
	var isArray = __webpack_require__(292);

	var render = __webpack_require__(323);
	var domIndex = __webpack_require__(325);
	var patchOp = __webpack_require__(326);
	module.exports = patch;

	function patch(rootNode, patches, renderOptions) {
	    renderOptions = renderOptions || {};
	    renderOptions.patch = renderOptions.patch && renderOptions.patch !== patch ? renderOptions.patch : patchRecursive;
	    renderOptions.render = renderOptions.render || render;

	    return renderOptions.patch(rootNode, patches, renderOptions);
	}

	function patchRecursive(rootNode, patches, renderOptions) {
	    var indices = patchIndices(patches);

	    if (indices.length === 0) {
	        return rootNode;
	    }

	    var index = domIndex(rootNode, patches.a, indices);
	    var ownerDocument = rootNode.ownerDocument;

	    if (!renderOptions.document && ownerDocument !== document) {
	        renderOptions.document = ownerDocument;
	    }

	    for (var i = 0; i < indices.length; i++) {
	        var nodeIndex = indices[i];
	        rootNode = applyPatch(rootNode, index[nodeIndex], patches[nodeIndex], renderOptions);
	    }

	    return rootNode;
	}

	function applyPatch(rootNode, domNode, patchList, renderOptions) {
	    if (!domNode) {
	        return rootNode;
	    }

	    var newNode;

	    if (isArray(patchList)) {
	        for (var i = 0; i < patchList.length; i++) {
	            newNode = patchOp(patchList[i], domNode, renderOptions);

	            if (domNode === rootNode) {
	                rootNode = newNode;
	            }
	        }
	    } else {
	        newNode = patchOp(patchList, domNode, renderOptions);

	        if (domNode === rootNode) {
	            rootNode = newNode;
	        }
	    }

	    return rootNode;
	}

	function patchIndices(patches) {
	    var indices = [];

	    for (var key in patches) {
	        if (key !== "a") {
	            indices.push(Number(key));
	        }
	    }

	    return indices;
	}

/***/ },
/* 321 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var topLevel = typeof global !== 'undefined' ? global : typeof window !== 'undefined' ? window : {};
	var minDoc = __webpack_require__(322);

	if (typeof document !== 'undefined') {
	    module.exports = document;
	} else {
	    var doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'];

	    if (!doccy) {
	        doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'] = minDoc;
	    }

	    module.exports = doccy;
	}
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 322 */
/***/ function(module, exports) {

	/* (ignored) */

/***/ },
/* 323 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var document = __webpack_require__(321);

	var applyProperties = __webpack_require__(324);

	var isVNode = __webpack_require__(296);
	var isVText = __webpack_require__(301);
	var isWidget = __webpack_require__(297);
	var handleThunk = __webpack_require__(316);

	module.exports = createElement;

	function createElement(vnode, opts) {
	    var doc = opts ? opts.document || document : document;
	    var warn = opts ? opts.warn : null;

	    vnode = handleThunk(vnode).a;

	    if (isWidget(vnode)) {
	        return vnode.init();
	    } else if (isVText(vnode)) {
	        return doc.createTextNode(vnode.text);
	    } else if (!isVNode(vnode)) {
	        if (warn) {
	            warn("Item is not a valid virtual dom node", vnode);
	        }
	        return null;
	    }

	    var node = vnode.namespace === null ? doc.createElement(vnode.tagName) : doc.createElementNS(vnode.namespace, vnode.tagName);

	    var props = vnode.properties;
	    applyProperties(node, props);

	    var children = vnode.children;

	    for (var i = 0; i < children.length; i++) {
	        var childNode = createElement(children[i], opts);
	        if (childNode) {
	            node.appendChild(childNode);
	        }
	    }

	    return node;
	}

/***/ },
/* 324 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var isObject = __webpack_require__(318);
	var isHook = __webpack_require__(299);

	module.exports = applyProperties;

	function applyProperties(node, props, previous) {
	    for (var propName in props) {
	        var propValue = props[propName];

	        if (propValue === undefined) {
	            removeProperty(node, propName, propValue, previous);
	        } else if (isHook(propValue)) {
	            removeProperty(node, propName, propValue, previous);
	            if (propValue.hook) {
	                propValue.hook(node, propName, previous ? previous[propName] : undefined);
	            }
	        } else {
	            if (isObject(propValue)) {
	                patchObject(node, props, previous, propName, propValue);
	            } else {
	                node[propName] = propValue;
	            }
	        }
	    }
	}

	function removeProperty(node, propName, propValue, previous) {
	    if (previous) {
	        var previousValue = previous[propName];

	        if (!isHook(previousValue)) {
	            if (propName === "attributes") {
	                for (var attrName in previousValue) {
	                    node.removeAttribute(attrName);
	                }
	            } else if (propName === "style") {
	                for (var i in previousValue) {
	                    node.style[i] = "";
	                }
	            } else if (typeof previousValue === "string") {
	                node[propName] = "";
	            } else {
	                node[propName] = null;
	            }
	        } else if (previousValue.unhook) {
	            previousValue.unhook(node, propName, propValue);
	        }
	    }
	}

	function patchObject(node, props, previous, propName, propValue) {
	    var previousValue = previous ? previous[propName] : undefined;

	    // Set attributes
	    if (propName === "attributes") {
	        for (var attrName in propValue) {
	            var attrValue = propValue[attrName];

	            if (attrValue === undefined) {
	                node.removeAttribute(attrName);
	            } else {
	                node.setAttribute(attrName, attrValue);
	            }
	        }

	        return;
	    }

	    if (previousValue && isObject(previousValue) && getPrototype(previousValue) !== getPrototype(propValue)) {
	        node[propName] = propValue;
	        return;
	    }

	    if (!isObject(node[propName])) {
	        node[propName] = {};
	    }

	    var replacer = propName === "style" ? "" : undefined;

	    for (var k in propValue) {
	        var value = propValue[k];
	        node[propName][k] = value === undefined ? replacer : value;
	    }
	}

	function getPrototype(value) {
	    if (Object.getPrototypeOf) {
	        return Object.getPrototypeOf(value);
	    } else if (value.__proto__) {
	        return value.__proto__;
	    } else if (value.constructor) {
	        return value.constructor.prototype;
	    }
	}

/***/ },
/* 325 */
/***/ function(module, exports) {

	"use strict";

	// Maps a virtual DOM tree onto a real DOM tree in an efficient manner.
	// We don't want to read all of the DOM nodes in the tree so we use
	// the in-order tree indexing to eliminate recursion down certain branches.
	// We only recurse into a DOM node if we know that it contains a child of
	// interest.

	var noChild = {};

	module.exports = domIndex;

	function domIndex(rootNode, tree, indices, nodes) {
	    if (!indices || indices.length === 0) {
	        return {};
	    } else {
	        indices.sort(ascending);
	        return recurse(rootNode, tree, indices, nodes, 0);
	    }
	}

	function recurse(rootNode, tree, indices, nodes, rootIndex) {
	    nodes = nodes || {};

	    if (rootNode) {
	        if (indexInRange(indices, rootIndex, rootIndex)) {
	            nodes[rootIndex] = rootNode;
	        }

	        var vChildren = tree.children;

	        if (vChildren) {

	            var childNodes = rootNode.childNodes;

	            for (var i = 0; i < tree.children.length; i++) {
	                rootIndex += 1;

	                var vChild = vChildren[i] || noChild;
	                var nextIndex = rootIndex + (vChild.count || 0);

	                // skip recursion down the tree if there are no nodes down here
	                if (indexInRange(indices, rootIndex, nextIndex)) {
	                    recurse(childNodes[i], vChild, indices, nodes, rootIndex);
	                }

	                rootIndex = nextIndex;
	            }
	        }
	    }

	    return nodes;
	}

	// Binary search for an index in the interval [left, right]
	function indexInRange(indices, left, right) {
	    if (indices.length === 0) {
	        return false;
	    }

	    var minIndex = 0;
	    var maxIndex = indices.length - 1;
	    var currentIndex;
	    var currentItem;

	    while (minIndex <= maxIndex) {
	        currentIndex = (maxIndex + minIndex) / 2 >> 0;
	        currentItem = indices[currentIndex];

	        if (minIndex === maxIndex) {
	            return currentItem >= left && currentItem <= right;
	        } else if (currentItem < left) {
	            minIndex = currentIndex + 1;
	        } else if (currentItem > right) {
	            maxIndex = currentIndex - 1;
	        } else {
	            return true;
	        }
	    }

	    return false;
	}

	function ascending(a, b) {
	    return a > b ? 1 : -1;
	}

/***/ },
/* 326 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var applyProperties = __webpack_require__(324);

	var isWidget = __webpack_require__(297);
	var VPatch = __webpack_require__(315);

	var updateWidget = __webpack_require__(327);

	module.exports = applyPatch;

	function applyPatch(vpatch, domNode, renderOptions) {
	    var type = vpatch.type;
	    var vNode = vpatch.vNode;
	    var patch = vpatch.patch;

	    switch (type) {
	        case VPatch.REMOVE:
	            return removeNode(domNode, vNode);
	        case VPatch.INSERT:
	            return insertNode(domNode, patch, renderOptions);
	        case VPatch.VTEXT:
	            return stringPatch(domNode, vNode, patch, renderOptions);
	        case VPatch.WIDGET:
	            return widgetPatch(domNode, vNode, patch, renderOptions);
	        case VPatch.VNODE:
	            return vNodePatch(domNode, vNode, patch, renderOptions);
	        case VPatch.ORDER:
	            reorderChildren(domNode, patch);
	            return domNode;
	        case VPatch.PROPS:
	            applyProperties(domNode, patch, vNode.properties);
	            return domNode;
	        case VPatch.THUNK:
	            return replaceRoot(domNode, renderOptions.patch(domNode, patch, renderOptions));
	        default:
	            return domNode;
	    }
	}

	function removeNode(domNode, vNode) {
	    var parentNode = domNode.parentNode;

	    if (parentNode) {
	        parentNode.removeChild(domNode);
	    }

	    destroyWidget(domNode, vNode);

	    return null;
	}

	function insertNode(parentNode, vNode, renderOptions) {
	    var newNode = renderOptions.render(vNode, renderOptions);

	    if (parentNode) {
	        parentNode.appendChild(newNode);
	    }

	    return parentNode;
	}

	function stringPatch(domNode, leftVNode, vText, renderOptions) {
	    var newNode;

	    if (domNode.nodeType === 3) {
	        domNode.replaceData(0, domNode.length, vText.text);
	        newNode = domNode;
	    } else {
	        var parentNode = domNode.parentNode;
	        newNode = renderOptions.render(vText, renderOptions);

	        if (parentNode && newNode !== domNode) {
	            parentNode.replaceChild(newNode, domNode);
	        }
	    }

	    return newNode;
	}

	function widgetPatch(domNode, leftVNode, widget, renderOptions) {
	    var updating = updateWidget(leftVNode, widget);
	    var newNode;

	    if (updating) {
	        newNode = widget.update(leftVNode, domNode) || domNode;
	    } else {
	        newNode = renderOptions.render(widget, renderOptions);
	    }

	    var parentNode = domNode.parentNode;

	    if (parentNode && newNode !== domNode) {
	        parentNode.replaceChild(newNode, domNode);
	    }

	    if (!updating) {
	        destroyWidget(domNode, leftVNode);
	    }

	    return newNode;
	}

	function vNodePatch(domNode, leftVNode, vNode, renderOptions) {
	    var parentNode = domNode.parentNode;
	    var newNode = renderOptions.render(vNode, renderOptions);

	    if (parentNode && newNode !== domNode) {
	        parentNode.replaceChild(newNode, domNode);
	    }

	    return newNode;
	}

	function destroyWidget(domNode, w) {
	    if (typeof w.destroy === "function" && isWidget(w)) {
	        w.destroy(domNode);
	    }
	}

	function reorderChildren(domNode, moves) {
	    var childNodes = domNode.childNodes;
	    var keyMap = {};
	    var node;
	    var remove;
	    var insert;

	    for (var i = 0; i < moves.removes.length; i++) {
	        remove = moves.removes[i];
	        node = childNodes[remove.from];
	        if (remove.key) {
	            keyMap[remove.key] = node;
	        }
	        domNode.removeChild(node);
	    }

	    var length = childNodes.length;
	    for (var j = 0; j < moves.inserts.length; j++) {
	        insert = moves.inserts[j];
	        node = keyMap[insert.key];
	        // this is the weirdest bug i've ever seen in webkit
	        domNode.insertBefore(node, insert.to >= length++ ? null : childNodes[insert.to]);
	    }
	}

	function replaceRoot(oldRoot, newRoot) {
	    if (oldRoot && newRoot && oldRoot !== newRoot && oldRoot.parentNode) {
	        oldRoot.parentNode.replaceChild(newRoot, oldRoot);
	    }

	    return newRoot;
	}

/***/ },
/* 327 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var isWidget = __webpack_require__(297);

	module.exports = updateWidget;

	function updateWidget(a, b) {
	    if (isWidget(a) && isWidget(b)) {
	        if ("name" in a && "name" in b) {
	            return a.id === b.id;
	        } else {
	            return a.init === b.init;
	        }
	    }

	    return false;
	}

/***/ },
/* 328 */
/***/ function(module, exports, __webpack_require__) {

	
	/**
	 * index.js
	 *
	 * A client-side DOM to vdom parser based on DOMParser API
	 */

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	var VNode = __webpack_require__(294);
	var VText = __webpack_require__(300);
	var domParser = new DOMParser();

	var propertyMap = __webpack_require__(329);
	var namespaceMap = __webpack_require__(330);

	var HTML_NAMESPACE = 'http://www.w3.org/1999/xhtml';

	module.exports = parser;

	/**
	 * DOM/html string to vdom parser
	 *
	 * @param   Mixed   el    DOM element or html string
	 * @param   String  attr  Attribute name that contains vdom key
	 * @return  Object        VNode or VText
	 */
	function parser(el, attr) {
		// empty input fallback to empty text node
		if (!el) {
			return createNode(document.createTextNode(''));
		}

		if (typeof el === 'string') {
			var doc = domParser.parseFromString(el, 'text/html');

			// most tags default to body
			if (doc.body.firstChild) {
				el = doc.body.firstChild;

				// some tags, like script and style, default to head
			} else if (doc.head.firstChild && (doc.head.firstChild.tagName !== 'TITLE' || doc.title)) {
					el = doc.head.firstChild;

					// special case for html comment, cdata, doctype
				} else if (doc.firstChild && doc.firstChild.tagName !== 'HTML') {
						el = doc.firstChild;

						// other element, such as whitespace, or html/body/head tag, fallback to empty text node
					} else {
							el = document.createTextNode('');
						}
		}

		if ((typeof el === 'undefined' ? 'undefined' : _typeof(el)) !== 'object' || !el || !el.nodeType) {
			throw new Error('invalid dom node', el);
		}

		return createNode(el, attr);
	}

	/**
	 * Create vdom from dom node
	 *
	 * @param   Object  el    DOM element
	 * @param   String  attr  Attribute name that contains vdom key
	 * @return  Object        VNode or VText
	 */
	function createNode(el, attr) {
		// html comment is not currently supported by virtual-dom
		if (el.nodeType === 3) {
			return createVirtualTextNode(el);

			// cdata or doctype is not currently supported by virtual-dom
		} else if (el.nodeType === 1 || el.nodeType === 9) {
				return createVirtualDomNode(el, attr);
			}

		// default to empty text node
		return new VText('');
	}

	/**
	 * Create vtext from dom node
	 *
	 * @param   Object  el  Text node
	 * @return  Object      VText
	 */
	function createVirtualTextNode(el) {
		return new VText(el.nodeValue);
	}

	/**
	 * Create vnode from dom node
	 *
	 * @param   Object  el    DOM element
	 * @param   String  attr  Attribute name that contains vdom key
	 * @return  Object        VNode
	 */
	function createVirtualDomNode(el, attr) {
		var ns = el.namespaceURI !== HTML_NAMESPACE ? el.namespaceURI : null;
		var key = attr && el.getAttribute(attr) ? el.getAttribute(attr) : null;

		return new VNode(el.tagName, createProperties(el), createChildren(el, attr), key, ns);
	}

	/**
	 * Recursively create vdom
	 *
	 * @param   Object  el    Parent element
	 * @param   String  attr  Attribute name that contains vdom key
	 * @return  Array         Child vnode or vtext
	 */
	function createChildren(el, attr) {
		var children = [];
		for (var i = 0; i < el.childNodes.length; i++) {
			children.push(createNode(el.childNodes[i], attr));
		};

		return children;
	}

	/**
	 * Create properties from dom node
	 *
	 * @param   Object  el  DOM element
	 * @return  Object      Node properties and attributes
	 */
	function createProperties(el) {
		var properties = {};

		if (!el.hasAttributes()) {
			return properties;
		}

		var ns;
		if (el.namespaceURI && el.namespaceURI !== HTML_NAMESPACE) {
			ns = el.namespaceURI;
		}

		var attr;
		for (var i = 0; i < el.attributes.length; i++) {
			if (ns) {
				attr = createPropertyNS(el.attributes[i]);
			} else {
				attr = createProperty(el.attributes[i]);
			}

			// special case, namespaced attribute, use properties.foobar
			if (attr.ns) {
				properties[attr.name] = {
					namespace: attr.ns,
					value: attr.value
				};

				// special case, use properties.attributes.foobar
			} else if (attr.isAttr) {
					// init attributes object only when necessary
					if (!properties.attributes) {
						properties.attributes = {};
					}
					properties.attributes[attr.name] = attr.value;

					// default case, use properties.foobar
				} else {
						properties[attr.name] = attr.value;
					}
		};

		return properties;
	}

	/**
	 * Create property from dom attribute 
	 *
	 * @param   Object  attr  DOM attribute
	 * @return  Object        Normalized attribute
	 */
	function createProperty(attr) {
		var name, value, isAttr;

		// using a map to find the correct case of property name
		if (propertyMap[attr.name]) {
			name = propertyMap[attr.name];
		} else {
			name = attr.name;
		}

		// special cases for style attribute, we default to properties.style
		if (name === 'style') {
			var style = {};
			attr.value.split(';').forEach(function (s) {
				var pos = s.indexOf(':');
				if (pos < 0) {
					return;
				}
				style[s.substr(0, pos).trim()] = s.substr(pos + 1).trim();
			});
			value = style;
			// special cases for data attribute, we default to properties.attributes.data
		} else if (name.indexOf('data-') === 0) {
				value = attr.value;
				isAttr = true;
			} else {
				value = attr.value;
			}

		return {
			name: name,
			value: value,
			isAttr: isAttr || false
		};
	}

	/**
	 * Create namespaced property from dom attribute 
	 *
	 * @param   Object  attr  DOM attribute
	 * @return  Object        Normalized attribute
	 */
	function createPropertyNS(attr) {
		var name, value;

		return {
			name: attr.name,
			value: attr.value,
			ns: namespaceMap[attr.name] || ''
		};
	}

/***/ },
/* 329 */
/***/ function(module, exports) {

	
	/**
	 * property-map.js
	 *
	 * Necessary to map dom attributes back to vdom properties
	 */

	'use strict';

	// invert of https://www.npmjs.com/package/html-attributes

	var properties = {
		'abbr': 'abbr',
		'accept': 'accept',
		'accept-charset': 'acceptCharset',
		'accesskey': 'accessKey',
		'action': 'action',
		'allowfullscreen': 'allowFullScreen',
		'allowtransparency': 'allowTransparency',
		'alt': 'alt',
		'async': 'async',
		'autocomplete': 'autoComplete',
		'autofocus': 'autoFocus',
		'autoplay': 'autoPlay',
		'cellpadding': 'cellPadding',
		'cellspacing': 'cellSpacing',
		'challenge': 'challenge',
		'charset': 'charset',
		'checked': 'checked',
		'cite': 'cite',
		'class': 'className',
		'cols': 'cols',
		'colspan': 'colSpan',
		'command': 'command',
		'content': 'content',
		'contenteditable': 'contentEditable',
		'contextmenu': 'contextMenu',
		'controls': 'controls',
		'coords': 'coords',
		'crossorigin': 'crossOrigin',
		'data': 'data',
		'datetime': 'dateTime',
		'default': 'default',
		'defer': 'defer',
		'dir': 'dir',
		'disabled': 'disabled',
		'download': 'download',
		'draggable': 'draggable',
		'dropzone': 'dropzone',
		'enctype': 'encType',
		'for': 'htmlFor',
		'form': 'form',
		'formaction': 'formAction',
		'formenctype': 'formEncType',
		'formmethod': 'formMethod',
		'formnovalidate': 'formNoValidate',
		'formtarget': 'formTarget',
		'frameBorder': 'frameBorder',
		'headers': 'headers',
		'height': 'height',
		'hidden': 'hidden',
		'high': 'high',
		'href': 'href',
		'hreflang': 'hrefLang',
		'http-equiv': 'httpEquiv',
		'icon': 'icon',
		'id': 'id',
		'inputmode': 'inputMode',
		'ismap': 'isMap',
		'itemid': 'itemId',
		'itemprop': 'itemProp',
		'itemref': 'itemRef',
		'itemscope': 'itemScope',
		'itemtype': 'itemType',
		'kind': 'kind',
		'label': 'label',
		'lang': 'lang',
		'list': 'list',
		'loop': 'loop',
		'manifest': 'manifest',
		'max': 'max',
		'maxlength': 'maxLength',
		'media': 'media',
		'mediagroup': 'mediaGroup',
		'method': 'method',
		'min': 'min',
		'minlength': 'minLength',
		'multiple': 'multiple',
		'muted': 'muted',
		'name': 'name',
		'novalidate': 'noValidate',
		'open': 'open',
		'optimum': 'optimum',
		'pattern': 'pattern',
		'ping': 'ping',
		'placeholder': 'placeholder',
		'poster': 'poster',
		'preload': 'preload',
		'radiogroup': 'radioGroup',
		'readonly': 'readOnly',
		'rel': 'rel',
		'required': 'required',
		'role': 'role',
		'rows': 'rows',
		'rowspan': 'rowSpan',
		'sandbox': 'sandbox',
		'scope': 'scope',
		'scoped': 'scoped',
		'scrolling': 'scrolling',
		'seamless': 'seamless',
		'selected': 'selected',
		'shape': 'shape',
		'size': 'size',
		'sizes': 'sizes',
		'sortable': 'sortable',
		'span': 'span',
		'spellcheck': 'spellCheck',
		'src': 'src',
		'srcdoc': 'srcDoc',
		'srcset': 'srcSet',
		'start': 'start',
		'step': 'step',
		'style': 'style',
		'tabindex': 'tabIndex',
		'target': 'target',
		'title': 'title',
		'translate': 'translate',
		'type': 'type',
		'typemustmatch': 'typeMustMatch',
		'usemap': 'useMap',
		'value': 'value',
		'width': 'width',
		'wmode': 'wmode',
		'wrap': 'wrap'
	};

	module.exports = properties;

/***/ },
/* 330 */
/***/ function(module, exports) {

	
	/**
	 * namespace-map.js
	 *
	 * Necessary to map svg attributes back to their namespace
	 */

	'use strict';

	// extracted from https://github.com/Matt-Esch/virtual-dom/blob/master/virtual-hyperscript/svg-attribute-namespace.js

	var DEFAULT_NAMESPACE = null;
	var EV_NAMESPACE = 'http://www.w3.org/2001/xml-events';
	var XLINK_NAMESPACE = 'http://www.w3.org/1999/xlink';
	var XML_NAMESPACE = 'http://www.w3.org/XML/1998/namespace';

	var namespaces = {
		'about': DEFAULT_NAMESPACE,
		'accent-height': DEFAULT_NAMESPACE,
		'accumulate': DEFAULT_NAMESPACE,
		'additive': DEFAULT_NAMESPACE,
		'alignment-baseline': DEFAULT_NAMESPACE,
		'alphabetic': DEFAULT_NAMESPACE,
		'amplitude': DEFAULT_NAMESPACE,
		'arabic-form': DEFAULT_NAMESPACE,
		'ascent': DEFAULT_NAMESPACE,
		'attributeName': DEFAULT_NAMESPACE,
		'attributeType': DEFAULT_NAMESPACE,
		'azimuth': DEFAULT_NAMESPACE,
		'bandwidth': DEFAULT_NAMESPACE,
		'baseFrequency': DEFAULT_NAMESPACE,
		'baseProfile': DEFAULT_NAMESPACE,
		'baseline-shift': DEFAULT_NAMESPACE,
		'bbox': DEFAULT_NAMESPACE,
		'begin': DEFAULT_NAMESPACE,
		'bias': DEFAULT_NAMESPACE,
		'by': DEFAULT_NAMESPACE,
		'calcMode': DEFAULT_NAMESPACE,
		'cap-height': DEFAULT_NAMESPACE,
		'class': DEFAULT_NAMESPACE,
		'clip': DEFAULT_NAMESPACE,
		'clip-path': DEFAULT_NAMESPACE,
		'clip-rule': DEFAULT_NAMESPACE,
		'clipPathUnits': DEFAULT_NAMESPACE,
		'color': DEFAULT_NAMESPACE,
		'color-interpolation': DEFAULT_NAMESPACE,
		'color-interpolation-filters': DEFAULT_NAMESPACE,
		'color-profile': DEFAULT_NAMESPACE,
		'color-rendering': DEFAULT_NAMESPACE,
		'content': DEFAULT_NAMESPACE,
		'contentScriptType': DEFAULT_NAMESPACE,
		'contentStyleType': DEFAULT_NAMESPACE,
		'cursor': DEFAULT_NAMESPACE,
		'cx': DEFAULT_NAMESPACE,
		'cy': DEFAULT_NAMESPACE,
		'd': DEFAULT_NAMESPACE,
		'datatype': DEFAULT_NAMESPACE,
		'defaultAction': DEFAULT_NAMESPACE,
		'descent': DEFAULT_NAMESPACE,
		'diffuseConstant': DEFAULT_NAMESPACE,
		'direction': DEFAULT_NAMESPACE,
		'display': DEFAULT_NAMESPACE,
		'divisor': DEFAULT_NAMESPACE,
		'dominant-baseline': DEFAULT_NAMESPACE,
		'dur': DEFAULT_NAMESPACE,
		'dx': DEFAULT_NAMESPACE,
		'dy': DEFAULT_NAMESPACE,
		'edgeMode': DEFAULT_NAMESPACE,
		'editable': DEFAULT_NAMESPACE,
		'elevation': DEFAULT_NAMESPACE,
		'enable-background': DEFAULT_NAMESPACE,
		'end': DEFAULT_NAMESPACE,
		'ev:event': EV_NAMESPACE,
		'event': DEFAULT_NAMESPACE,
		'exponent': DEFAULT_NAMESPACE,
		'externalResourcesRequired': DEFAULT_NAMESPACE,
		'fill': DEFAULT_NAMESPACE,
		'fill-opacity': DEFAULT_NAMESPACE,
		'fill-rule': DEFAULT_NAMESPACE,
		'filter': DEFAULT_NAMESPACE,
		'filterRes': DEFAULT_NAMESPACE,
		'filterUnits': DEFAULT_NAMESPACE,
		'flood-color': DEFAULT_NAMESPACE,
		'flood-opacity': DEFAULT_NAMESPACE,
		'focusHighlight': DEFAULT_NAMESPACE,
		'focusable': DEFAULT_NAMESPACE,
		'font-family': DEFAULT_NAMESPACE,
		'font-size': DEFAULT_NAMESPACE,
		'font-size-adjust': DEFAULT_NAMESPACE,
		'font-stretch': DEFAULT_NAMESPACE,
		'font-style': DEFAULT_NAMESPACE,
		'font-variant': DEFAULT_NAMESPACE,
		'font-weight': DEFAULT_NAMESPACE,
		'format': DEFAULT_NAMESPACE,
		'from': DEFAULT_NAMESPACE,
		'fx': DEFAULT_NAMESPACE,
		'fy': DEFAULT_NAMESPACE,
		'g1': DEFAULT_NAMESPACE,
		'g2': DEFAULT_NAMESPACE,
		'glyph-name': DEFAULT_NAMESPACE,
		'glyph-orientation-horizontal': DEFAULT_NAMESPACE,
		'glyph-orientation-vertical': DEFAULT_NAMESPACE,
		'glyphRef': DEFAULT_NAMESPACE,
		'gradientTransform': DEFAULT_NAMESPACE,
		'gradientUnits': DEFAULT_NAMESPACE,
		'handler': DEFAULT_NAMESPACE,
		'hanging': DEFAULT_NAMESPACE,
		'height': DEFAULT_NAMESPACE,
		'horiz-adv-x': DEFAULT_NAMESPACE,
		'horiz-origin-x': DEFAULT_NAMESPACE,
		'horiz-origin-y': DEFAULT_NAMESPACE,
		'id': DEFAULT_NAMESPACE,
		'ideographic': DEFAULT_NAMESPACE,
		'image-rendering': DEFAULT_NAMESPACE,
		'in': DEFAULT_NAMESPACE,
		'in2': DEFAULT_NAMESPACE,
		'initialVisibility': DEFAULT_NAMESPACE,
		'intercept': DEFAULT_NAMESPACE,
		'k': DEFAULT_NAMESPACE,
		'k1': DEFAULT_NAMESPACE,
		'k2': DEFAULT_NAMESPACE,
		'k3': DEFAULT_NAMESPACE,
		'k4': DEFAULT_NAMESPACE,
		'kernelMatrix': DEFAULT_NAMESPACE,
		'kernelUnitLength': DEFAULT_NAMESPACE,
		'kerning': DEFAULT_NAMESPACE,
		'keyPoints': DEFAULT_NAMESPACE,
		'keySplines': DEFAULT_NAMESPACE,
		'keyTimes': DEFAULT_NAMESPACE,
		'lang': DEFAULT_NAMESPACE,
		'lengthAdjust': DEFAULT_NAMESPACE,
		'letter-spacing': DEFAULT_NAMESPACE,
		'lighting-color': DEFAULT_NAMESPACE,
		'limitingConeAngle': DEFAULT_NAMESPACE,
		'local': DEFAULT_NAMESPACE,
		'marker-end': DEFAULT_NAMESPACE,
		'marker-mid': DEFAULT_NAMESPACE,
		'marker-start': DEFAULT_NAMESPACE,
		'markerHeight': DEFAULT_NAMESPACE,
		'markerUnits': DEFAULT_NAMESPACE,
		'markerWidth': DEFAULT_NAMESPACE,
		'mask': DEFAULT_NAMESPACE,
		'maskContentUnits': DEFAULT_NAMESPACE,
		'maskUnits': DEFAULT_NAMESPACE,
		'mathematical': DEFAULT_NAMESPACE,
		'max': DEFAULT_NAMESPACE,
		'media': DEFAULT_NAMESPACE,
		'mediaCharacterEncoding': DEFAULT_NAMESPACE,
		'mediaContentEncodings': DEFAULT_NAMESPACE,
		'mediaSize': DEFAULT_NAMESPACE,
		'mediaTime': DEFAULT_NAMESPACE,
		'method': DEFAULT_NAMESPACE,
		'min': DEFAULT_NAMESPACE,
		'mode': DEFAULT_NAMESPACE,
		'name': DEFAULT_NAMESPACE,
		'nav-down': DEFAULT_NAMESPACE,
		'nav-down-left': DEFAULT_NAMESPACE,
		'nav-down-right': DEFAULT_NAMESPACE,
		'nav-left': DEFAULT_NAMESPACE,
		'nav-next': DEFAULT_NAMESPACE,
		'nav-prev': DEFAULT_NAMESPACE,
		'nav-right': DEFAULT_NAMESPACE,
		'nav-up': DEFAULT_NAMESPACE,
		'nav-up-left': DEFAULT_NAMESPACE,
		'nav-up-right': DEFAULT_NAMESPACE,
		'numOctaves': DEFAULT_NAMESPACE,
		'observer': DEFAULT_NAMESPACE,
		'offset': DEFAULT_NAMESPACE,
		'opacity': DEFAULT_NAMESPACE,
		'operator': DEFAULT_NAMESPACE,
		'order': DEFAULT_NAMESPACE,
		'orient': DEFAULT_NAMESPACE,
		'orientation': DEFAULT_NAMESPACE,
		'origin': DEFAULT_NAMESPACE,
		'overflow': DEFAULT_NAMESPACE,
		'overlay': DEFAULT_NAMESPACE,
		'overline-position': DEFAULT_NAMESPACE,
		'overline-thickness': DEFAULT_NAMESPACE,
		'panose-1': DEFAULT_NAMESPACE,
		'path': DEFAULT_NAMESPACE,
		'pathLength': DEFAULT_NAMESPACE,
		'patternContentUnits': DEFAULT_NAMESPACE,
		'patternTransform': DEFAULT_NAMESPACE,
		'patternUnits': DEFAULT_NAMESPACE,
		'phase': DEFAULT_NAMESPACE,
		'playbackOrder': DEFAULT_NAMESPACE,
		'pointer-events': DEFAULT_NAMESPACE,
		'points': DEFAULT_NAMESPACE,
		'pointsAtX': DEFAULT_NAMESPACE,
		'pointsAtY': DEFAULT_NAMESPACE,
		'pointsAtZ': DEFAULT_NAMESPACE,
		'preserveAlpha': DEFAULT_NAMESPACE,
		'preserveAspectRatio': DEFAULT_NAMESPACE,
		'primitiveUnits': DEFAULT_NAMESPACE,
		'propagate': DEFAULT_NAMESPACE,
		'property': DEFAULT_NAMESPACE,
		'r': DEFAULT_NAMESPACE,
		'radius': DEFAULT_NAMESPACE,
		'refX': DEFAULT_NAMESPACE,
		'refY': DEFAULT_NAMESPACE,
		'rel': DEFAULT_NAMESPACE,
		'rendering-intent': DEFAULT_NAMESPACE,
		'repeatCount': DEFAULT_NAMESPACE,
		'repeatDur': DEFAULT_NAMESPACE,
		'requiredExtensions': DEFAULT_NAMESPACE,
		'requiredFeatures': DEFAULT_NAMESPACE,
		'requiredFonts': DEFAULT_NAMESPACE,
		'requiredFormats': DEFAULT_NAMESPACE,
		'resource': DEFAULT_NAMESPACE,
		'restart': DEFAULT_NAMESPACE,
		'result': DEFAULT_NAMESPACE,
		'rev': DEFAULT_NAMESPACE,
		'role': DEFAULT_NAMESPACE,
		'rotate': DEFAULT_NAMESPACE,
		'rx': DEFAULT_NAMESPACE,
		'ry': DEFAULT_NAMESPACE,
		'scale': DEFAULT_NAMESPACE,
		'seed': DEFAULT_NAMESPACE,
		'shape-rendering': DEFAULT_NAMESPACE,
		'slope': DEFAULT_NAMESPACE,
		'snapshotTime': DEFAULT_NAMESPACE,
		'spacing': DEFAULT_NAMESPACE,
		'specularConstant': DEFAULT_NAMESPACE,
		'specularExponent': DEFAULT_NAMESPACE,
		'spreadMethod': DEFAULT_NAMESPACE,
		'startOffset': DEFAULT_NAMESPACE,
		'stdDeviation': DEFAULT_NAMESPACE,
		'stemh': DEFAULT_NAMESPACE,
		'stemv': DEFAULT_NAMESPACE,
		'stitchTiles': DEFAULT_NAMESPACE,
		'stop-color': DEFAULT_NAMESPACE,
		'stop-opacity': DEFAULT_NAMESPACE,
		'strikethrough-position': DEFAULT_NAMESPACE,
		'strikethrough-thickness': DEFAULT_NAMESPACE,
		'string': DEFAULT_NAMESPACE,
		'stroke': DEFAULT_NAMESPACE,
		'stroke-dasharray': DEFAULT_NAMESPACE,
		'stroke-dashoffset': DEFAULT_NAMESPACE,
		'stroke-linecap': DEFAULT_NAMESPACE,
		'stroke-linejoin': DEFAULT_NAMESPACE,
		'stroke-miterlimit': DEFAULT_NAMESPACE,
		'stroke-opacity': DEFAULT_NAMESPACE,
		'stroke-width': DEFAULT_NAMESPACE,
		'surfaceScale': DEFAULT_NAMESPACE,
		'syncBehavior': DEFAULT_NAMESPACE,
		'syncBehaviorDefault': DEFAULT_NAMESPACE,
		'syncMaster': DEFAULT_NAMESPACE,
		'syncTolerance': DEFAULT_NAMESPACE,
		'syncToleranceDefault': DEFAULT_NAMESPACE,
		'systemLanguage': DEFAULT_NAMESPACE,
		'tableValues': DEFAULT_NAMESPACE,
		'target': DEFAULT_NAMESPACE,
		'targetX': DEFAULT_NAMESPACE,
		'targetY': DEFAULT_NAMESPACE,
		'text-anchor': DEFAULT_NAMESPACE,
		'text-decoration': DEFAULT_NAMESPACE,
		'text-rendering': DEFAULT_NAMESPACE,
		'textLength': DEFAULT_NAMESPACE,
		'timelineBegin': DEFAULT_NAMESPACE,
		'title': DEFAULT_NAMESPACE,
		'to': DEFAULT_NAMESPACE,
		'transform': DEFAULT_NAMESPACE,
		'transformBehavior': DEFAULT_NAMESPACE,
		'type': DEFAULT_NAMESPACE,
		'typeof': DEFAULT_NAMESPACE,
		'u1': DEFAULT_NAMESPACE,
		'u2': DEFAULT_NAMESPACE,
		'underline-position': DEFAULT_NAMESPACE,
		'underline-thickness': DEFAULT_NAMESPACE,
		'unicode': DEFAULT_NAMESPACE,
		'unicode-bidi': DEFAULT_NAMESPACE,
		'unicode-range': DEFAULT_NAMESPACE,
		'units-per-em': DEFAULT_NAMESPACE,
		'v-alphabetic': DEFAULT_NAMESPACE,
		'v-hanging': DEFAULT_NAMESPACE,
		'v-ideographic': DEFAULT_NAMESPACE,
		'v-mathematical': DEFAULT_NAMESPACE,
		'values': DEFAULT_NAMESPACE,
		'version': DEFAULT_NAMESPACE,
		'vert-adv-y': DEFAULT_NAMESPACE,
		'vert-origin-x': DEFAULT_NAMESPACE,
		'vert-origin-y': DEFAULT_NAMESPACE,
		'viewBox': DEFAULT_NAMESPACE,
		'viewTarget': DEFAULT_NAMESPACE,
		'visibility': DEFAULT_NAMESPACE,
		'width': DEFAULT_NAMESPACE,
		'widths': DEFAULT_NAMESPACE,
		'word-spacing': DEFAULT_NAMESPACE,
		'writing-mode': DEFAULT_NAMESPACE,
		'x': DEFAULT_NAMESPACE,
		'x-height': DEFAULT_NAMESPACE,
		'x1': DEFAULT_NAMESPACE,
		'x2': DEFAULT_NAMESPACE,
		'xChannelSelector': DEFAULT_NAMESPACE,
		'xlink:actuate': XLINK_NAMESPACE,
		'xlink:arcrole': XLINK_NAMESPACE,
		'xlink:href': XLINK_NAMESPACE,
		'xlink:role': XLINK_NAMESPACE,
		'xlink:show': XLINK_NAMESPACE,
		'xlink:title': XLINK_NAMESPACE,
		'xlink:type': XLINK_NAMESPACE,
		'xml:base': XML_NAMESPACE,
		'xml:id': XML_NAMESPACE,
		'xml:lang': XML_NAMESPACE,
		'xml:space': XML_NAMESPACE,
		'y': DEFAULT_NAMESPACE,
		'y1': DEFAULT_NAMESPACE,
		'y2': DEFAULT_NAMESPACE,
		'yChannelSelector': DEFAULT_NAMESPACE,
		'z': DEFAULT_NAMESPACE,
		'zoomAndPan': DEFAULT_NAMESPACE
	};

	module.exports = namespaces;

/***/ },
/* 331 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var Rx = __webpack_require__(287);
	var VirtualNode = __webpack_require__(294);

	/**
	 * Converts a tree of VirtualNode|Observable<VirtualNode> into
	 * Observable<VirtualNode>.
	 */
	function transposeVTree(vtree) {
	  if (typeof vtree.subscribe === "function") {
	    return vtree.flatMapLatest(transposeVTree);
	  } else if (vtree.type === "VirtualText") {
	    return Rx.Observable.just(vtree);
	  } else if (vtree.type === "VirtualNode" && Array.isArray(vtree.children) && vtree.children.length > 0) {
	    return Rx.Observable.combineLatest(vtree.children.map(transposeVTree), function () {
	      for (var _len = arguments.length, arr = Array(_len), _key = 0; _key < _len; _key++) {
	        arr[_key] = arguments[_key];
	      }

	      return new VirtualNode(vtree.tagName, vtree.properties, arr, vtree.key, vtree.namespace);
	    });
	  } else if (vtree.type === "VirtualNode" || vtree.type === "Widget" || vtree.type === "Thunk") {
	    return Rx.Observable.just(vtree);
	  } else {
	    throw new Error("Unhandled case in transposeVTree()");
	  }
	}

	module.exports = {
	  transposeVTree: transposeVTree
	};

/***/ },
/* 332 */
/***/ function(module, exports) {

	'use strict';

	var proto = Element.prototype;
	var vendor = proto.matches || proto.matchesSelector || proto.webkitMatchesSelector || proto.mozMatchesSelector || proto.msMatchesSelector || proto.oMatchesSelector;

	module.exports = match;

	/**
	 * Match `el` to `selector`.
	 *
	 * @param {Element} el
	 * @param {String} selector
	 * @return {Boolean}
	 * @api public
	 */

	function match(el, selector) {
	  if (vendor) return vendor.call(el, selector);
	  var nodes = el.parentNode.querySelectorAll(selector);
	  for (var i = 0; i < nodes.length; i++) {
	    if (nodes[i] == el) return true;
	  }
	  return false;
	}

/***/ },
/* 333 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var Rx = __webpack_require__(287);
	var toHTML = __webpack_require__(334);

	var _require = __webpack_require__(331);

	var transposeVTree = _require.transposeVTree;

	function makeBogusSelect() {
	  return function select() {
	    return {
	      observable: Rx.Observable.empty(),
	      events: function events() {
	        return Rx.Observable.empty();
	      }
	    };
	  };
	}

	function makeHTMLDriver() {
	  return function htmlDriver(vtree$) {
	    var output$ = vtree$.flatMapLatest(transposeVTree).last().map(toHTML);
	    output$.select = makeBogusSelect();
	    return output$;
	  };
	}

	module.exports = {
	  makeBogusSelect: makeBogusSelect,

	  makeHTMLDriver: makeHTMLDriver
	};

/***/ },
/* 334 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var escape = __webpack_require__(335);
	var extend = __webpack_require__(336);
	var isVNode = __webpack_require__(296);
	var isVText = __webpack_require__(301);
	var isThunk = __webpack_require__(298);
	var isWidget = __webpack_require__(297);
	var softHook = __webpack_require__(304);
	var attrHook = __webpack_require__(310);
	var paramCase = __webpack_require__(337);
	var createAttribute = __webpack_require__(343);
	var voidElements = __webpack_require__(345);

	module.exports = toHTML;

	function toHTML(node, parent) {
	  if (!node) return '';

	  if (isThunk(node)) {
	    node = node.render();
	  }

	  if (isWidget(node) && node.render) {
	    node = node.render();
	  }

	  if (isVNode(node)) {
	    return openTag(node) + tagContent(node) + closeTag(node);
	  } else if (isVText(node)) {
	    if (parent && parent.tagName.toLowerCase() === 'script') return String(node.text);
	    return escape(String(node.text));
	  }

	  return '';
	}

	function openTag(node) {
	  var props = node.properties;
	  var ret = '<' + node.tagName.toLowerCase();

	  for (var name in props) {
	    var value = props[name];
	    if (value == null) continue;

	    if (name == 'attributes') {
	      value = extend({}, value);
	      for (var attrProp in value) {
	        ret += ' ' + createAttribute(attrProp, value[attrProp], true);
	      }
	      continue;
	    }

	    if (name == 'style') {
	      var css = '';
	      value = extend({}, value);
	      for (var styleProp in value) {
	        css += paramCase(styleProp) + ': ' + value[styleProp] + '; ';
	      }
	      value = css.trim();
	    }

	    if (value instanceof softHook || value instanceof attrHook) {
	      ret += ' ' + createAttribute(name, value.value, true);
	      continue;
	    }

	    var attr = createAttribute(name, value);
	    if (attr) ret += ' ' + attr;
	  }

	  return ret + '>';
	}

	function tagContent(node) {
	  var innerHTML = node.properties.innerHTML;
	  if (innerHTML != null) return innerHTML;else {
	    var ret = '';
	    if (node.children && node.children.length) {
	      for (var i = 0, l = node.children.length; i < l; i++) {
	        var child = node.children[i];
	        ret += toHTML(child, node);
	      }
	    }
	    return ret;
	  }
	}

	function closeTag(node) {
	  var tag = node.tagName.toLowerCase();
	  return voidElements[tag] ? '' : '</' + tag + '>';
	}

/***/ },
/* 335 */
/***/ function(module, exports) {

	/*!
	 * escape-html
	 * Copyright(c) 2012-2013 TJ Holowaychuk
	 * Copyright(c) 2015 Andreas Lubbe
	 * Copyright(c) 2015 Tiancheng "Timothy" Gu
	 * MIT Licensed
	 */

	'use strict';

	/**
	 * Module variables.
	 * @private
	 */

	var matchHtmlRegExp = /["'&<>]/;

	/**
	 * Module exports.
	 * @public
	 */

	module.exports = escapeHtml;

	/**
	 * Escape special characters in the given string of html.
	 *
	 * @param  {string} string The string to escape for inserting into HTML
	 * @return {string}
	 * @public
	 */

	function escapeHtml(string) {
	  var str = '' + string;
	  var match = matchHtmlRegExp.exec(str);

	  if (!match) {
	    return str;
	  }

	  var escape;
	  var html = '';
	  var index = 0;
	  var lastIndex = 0;

	  for (index = match.index; index < str.length; index++) {
	    switch (str.charCodeAt(index)) {
	      case 34:
	        // "
	        escape = '&quot;';
	        break;
	      case 38:
	        // &
	        escape = '&amp;';
	        break;
	      case 39:
	        // '
	        escape = '&#39;';
	        break;
	      case 60:
	        // <
	        escape = '&lt;';
	        break;
	      case 62:
	        // >
	        escape = '&gt;';
	        break;
	      default:
	        continue;
	    }

	    if (lastIndex !== index) {
	      html += str.substring(lastIndex, index);
	    }

	    lastIndex = index + 1;
	    html += escape;
	  }

	  return lastIndex !== index ? html + str.substring(lastIndex, index) : html;
	}

/***/ },
/* 336 */
/***/ function(module, exports) {

	"use strict";

	module.exports = extend;

	var hasOwnProperty = Object.prototype.hasOwnProperty;

	function extend() {
	    var target = {};

	    for (var i = 0; i < arguments.length; i++) {
	        var source = arguments[i];

	        for (var key in source) {
	            if (hasOwnProperty.call(source, key)) {
	                target[key] = source[key];
	            }
	        }
	    }

	    return target;
	}

/***/ },
/* 337 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var sentenceCase = __webpack_require__(338);

	/**
	 * Param case a string.
	 *
	 * @param  {String} string
	 * @param  {String} [locale]
	 * @return {String}
	 */
	module.exports = function (string, locale) {
	  return sentenceCase(string, locale, '-');
	};

/***/ },
/* 338 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var lowerCase = __webpack_require__(339);

	var NON_WORD_REGEXP = __webpack_require__(340);
	var CAMEL_CASE_REGEXP = __webpack_require__(341);
	var TRAILING_DIGIT_REGEXP = __webpack_require__(342);

	/**
	 * Sentence case a string.
	 *
	 * @param  {String} str
	 * @param  {String} locale
	 * @param  {String} replacement
	 * @return {String}
	 */
	module.exports = function (str, locale, replacement) {
	  if (str == null) {
	    return '';
	  }

	  replacement = replacement || ' ';

	  function replace(match, index, string) {
	    if (index === 0 || index === string.length - match.length) {
	      return '';
	    }

	    return replacement;
	  }

	  str = String(str)
	  // Support camel case ("camelCase" -> "camel Case").
	  .replace(CAMEL_CASE_REGEXP, '$1 $2')
	  // Support digit groups ("test2012" -> "test 2012").
	  .replace(TRAILING_DIGIT_REGEXP, '$1 $2')
	  // Remove all non-word characters and replace with a single space.
	  .replace(NON_WORD_REGEXP, replace);

	  // Lower case the entire string.
	  return lowerCase(str, locale);
	};

/***/ },
/* 339 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * Special language-specific overrides.
	 *
	 * Source: ftp://ftp.unicode.org/Public/UCD/latest/ucd/SpecialCasing.txt
	 *
	 * @type {Object}
	 */
	var LANGUAGES = {
	  tr: {
	    regexp: /\u0130|\u0049|\u0049\u0307/g,
	    map: {
	      'İ': 'i',
	      'I': 'ı',
	      'İ': 'i'
	    }
	  },
	  az: {
	    regexp: /[\u0130]/g,
	    map: {
	      'İ': 'i',
	      'I': 'ı',
	      'İ': 'i'
	    }
	  },
	  lt: {
	    regexp: /[\u0049\u004A\u012E\u00CC\u00CD\u0128]/g,
	    map: {
	      'I': 'i̇',
	      'J': 'j̇',
	      'Į': 'į̇',
	      'Ì': 'i̇̀',
	      'Í': 'i̇́',
	      'Ĩ': 'i̇̃'
	    }
	  }
	};

	/**
	 * Lowercase a string.
	 *
	 * @param  {String} str
	 * @return {String}
	 */
	module.exports = function (str, locale) {
	  var lang = LANGUAGES[locale];

	  str = str == null ? '' : String(str);

	  if (lang) {
	    str = str.replace(lang.regexp, function (m) {
	      return lang.map[m];
	    });
	  }

	  return str.toLowerCase();
	};

/***/ },
/* 340 */
/***/ function(module, exports) {

	"use strict";

	module.exports = /[^\u0041-\u005A\u0061-\u007A\u00AA\u00B5\u00BA\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0\u08A2-\u08AC\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0977\u0979-\u097F\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D\u0C58\u0C59\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D60\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191C\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19C1-\u19C7\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA697\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA793\uA7A0-\uA7AA\uA7F8-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA80-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC\u0030-\u0039\u00B2\u00B3\u00B9\u00BC-\u00BE\u0660-\u0669\u06F0-\u06F9\u07C0-\u07C9\u0966-\u096F\u09E6-\u09EF\u09F4-\u09F9\u0A66-\u0A6F\u0AE6-\u0AEF\u0B66-\u0B6F\u0B72-\u0B77\u0BE6-\u0BF2\u0C66-\u0C6F\u0C78-\u0C7E\u0CE6-\u0CEF\u0D66-\u0D75\u0E50-\u0E59\u0ED0-\u0ED9\u0F20-\u0F33\u1040-\u1049\u1090-\u1099\u1369-\u137C\u16EE-\u16F0\u17E0-\u17E9\u17F0-\u17F9\u1810-\u1819\u1946-\u194F\u19D0-\u19DA\u1A80-\u1A89\u1A90-\u1A99\u1B50-\u1B59\u1BB0-\u1BB9\u1C40-\u1C49\u1C50-\u1C59\u2070\u2074-\u2079\u2080-\u2089\u2150-\u2182\u2185-\u2189\u2460-\u249B\u24EA-\u24FF\u2776-\u2793\u2CFD\u3007\u3021-\u3029\u3038-\u303A\u3192-\u3195\u3220-\u3229\u3248-\u324F\u3251-\u325F\u3280-\u3289\u32B1-\u32BF\uA620-\uA629\uA6E6-\uA6EF\uA830-\uA835\uA8D0-\uA8D9\uA900-\uA909\uA9D0-\uA9D9\uAA50-\uAA59\uABF0-\uABF9\uFF10-\uFF19]+/g;

/***/ },
/* 341 */
/***/ function(module, exports) {

	"use strict";

	module.exports = /([\u0061-\u007A\u00B5\u00DF-\u00F6\u00F8-\u00FF\u0101\u0103\u0105\u0107\u0109\u010B\u010D\u010F\u0111\u0113\u0115\u0117\u0119\u011B\u011D\u011F\u0121\u0123\u0125\u0127\u0129\u012B\u012D\u012F\u0131\u0133\u0135\u0137\u0138\u013A\u013C\u013E\u0140\u0142\u0144\u0146\u0148\u0149\u014B\u014D\u014F\u0151\u0153\u0155\u0157\u0159\u015B\u015D\u015F\u0161\u0163\u0165\u0167\u0169\u016B\u016D\u016F\u0171\u0173\u0175\u0177\u017A\u017C\u017E-\u0180\u0183\u0185\u0188\u018C\u018D\u0192\u0195\u0199-\u019B\u019E\u01A1\u01A3\u01A5\u01A8\u01AA\u01AB\u01AD\u01B0\u01B4\u01B6\u01B9\u01BA\u01BD-\u01BF\u01C6\u01C9\u01CC\u01CE\u01D0\u01D2\u01D4\u01D6\u01D8\u01DA\u01DC\u01DD\u01DF\u01E1\u01E3\u01E5\u01E7\u01E9\u01EB\u01ED\u01EF\u01F0\u01F3\u01F5\u01F9\u01FB\u01FD\u01FF\u0201\u0203\u0205\u0207\u0209\u020B\u020D\u020F\u0211\u0213\u0215\u0217\u0219\u021B\u021D\u021F\u0221\u0223\u0225\u0227\u0229\u022B\u022D\u022F\u0231\u0233-\u0239\u023C\u023F\u0240\u0242\u0247\u0249\u024B\u024D\u024F-\u0293\u0295-\u02AF\u0371\u0373\u0377\u037B-\u037D\u0390\u03AC-\u03CE\u03D0\u03D1\u03D5-\u03D7\u03D9\u03DB\u03DD\u03DF\u03E1\u03E3\u03E5\u03E7\u03E9\u03EB\u03ED\u03EF-\u03F3\u03F5\u03F8\u03FB\u03FC\u0430-\u045F\u0461\u0463\u0465\u0467\u0469\u046B\u046D\u046F\u0471\u0473\u0475\u0477\u0479\u047B\u047D\u047F\u0481\u048B\u048D\u048F\u0491\u0493\u0495\u0497\u0499\u049B\u049D\u049F\u04A1\u04A3\u04A5\u04A7\u04A9\u04AB\u04AD\u04AF\u04B1\u04B3\u04B5\u04B7\u04B9\u04BB\u04BD\u04BF\u04C2\u04C4\u04C6\u04C8\u04CA\u04CC\u04CE\u04CF\u04D1\u04D3\u04D5\u04D7\u04D9\u04DB\u04DD\u04DF\u04E1\u04E3\u04E5\u04E7\u04E9\u04EB\u04ED\u04EF\u04F1\u04F3\u04F5\u04F7\u04F9\u04FB\u04FD\u04FF\u0501\u0503\u0505\u0507\u0509\u050B\u050D\u050F\u0511\u0513\u0515\u0517\u0519\u051B\u051D\u051F\u0521\u0523\u0525\u0527\u0561-\u0587\u1D00-\u1D2B\u1D6B-\u1D77\u1D79-\u1D9A\u1E01\u1E03\u1E05\u1E07\u1E09\u1E0B\u1E0D\u1E0F\u1E11\u1E13\u1E15\u1E17\u1E19\u1E1B\u1E1D\u1E1F\u1E21\u1E23\u1E25\u1E27\u1E29\u1E2B\u1E2D\u1E2F\u1E31\u1E33\u1E35\u1E37\u1E39\u1E3B\u1E3D\u1E3F\u1E41\u1E43\u1E45\u1E47\u1E49\u1E4B\u1E4D\u1E4F\u1E51\u1E53\u1E55\u1E57\u1E59\u1E5B\u1E5D\u1E5F\u1E61\u1E63\u1E65\u1E67\u1E69\u1E6B\u1E6D\u1E6F\u1E71\u1E73\u1E75\u1E77\u1E79\u1E7B\u1E7D\u1E7F\u1E81\u1E83\u1E85\u1E87\u1E89\u1E8B\u1E8D\u1E8F\u1E91\u1E93\u1E95-\u1E9D\u1E9F\u1EA1\u1EA3\u1EA5\u1EA7\u1EA9\u1EAB\u1EAD\u1EAF\u1EB1\u1EB3\u1EB5\u1EB7\u1EB9\u1EBB\u1EBD\u1EBF\u1EC1\u1EC3\u1EC5\u1EC7\u1EC9\u1ECB\u1ECD\u1ECF\u1ED1\u1ED3\u1ED5\u1ED7\u1ED9\u1EDB\u1EDD\u1EDF\u1EE1\u1EE3\u1EE5\u1EE7\u1EE9\u1EEB\u1EED\u1EEF\u1EF1\u1EF3\u1EF5\u1EF7\u1EF9\u1EFB\u1EFD\u1EFF-\u1F07\u1F10-\u1F15\u1F20-\u1F27\u1F30-\u1F37\u1F40-\u1F45\u1F50-\u1F57\u1F60-\u1F67\u1F70-\u1F7D\u1F80-\u1F87\u1F90-\u1F97\u1FA0-\u1FA7\u1FB0-\u1FB4\u1FB6\u1FB7\u1FBE\u1FC2-\u1FC4\u1FC6\u1FC7\u1FD0-\u1FD3\u1FD6\u1FD7\u1FE0-\u1FE7\u1FF2-\u1FF4\u1FF6\u1FF7\u210A\u210E\u210F\u2113\u212F\u2134\u2139\u213C\u213D\u2146-\u2149\u214E\u2184\u2C30-\u2C5E\u2C61\u2C65\u2C66\u2C68\u2C6A\u2C6C\u2C71\u2C73\u2C74\u2C76-\u2C7B\u2C81\u2C83\u2C85\u2C87\u2C89\u2C8B\u2C8D\u2C8F\u2C91\u2C93\u2C95\u2C97\u2C99\u2C9B\u2C9D\u2C9F\u2CA1\u2CA3\u2CA5\u2CA7\u2CA9\u2CAB\u2CAD\u2CAF\u2CB1\u2CB3\u2CB5\u2CB7\u2CB9\u2CBB\u2CBD\u2CBF\u2CC1\u2CC3\u2CC5\u2CC7\u2CC9\u2CCB\u2CCD\u2CCF\u2CD1\u2CD3\u2CD5\u2CD7\u2CD9\u2CDB\u2CDD\u2CDF\u2CE1\u2CE3\u2CE4\u2CEC\u2CEE\u2CF3\u2D00-\u2D25\u2D27\u2D2D\uA641\uA643\uA645\uA647\uA649\uA64B\uA64D\uA64F\uA651\uA653\uA655\uA657\uA659\uA65B\uA65D\uA65F\uA661\uA663\uA665\uA667\uA669\uA66B\uA66D\uA681\uA683\uA685\uA687\uA689\uA68B\uA68D\uA68F\uA691\uA693\uA695\uA697\uA723\uA725\uA727\uA729\uA72B\uA72D\uA72F-\uA731\uA733\uA735\uA737\uA739\uA73B\uA73D\uA73F\uA741\uA743\uA745\uA747\uA749\uA74B\uA74D\uA74F\uA751\uA753\uA755\uA757\uA759\uA75B\uA75D\uA75F\uA761\uA763\uA765\uA767\uA769\uA76B\uA76D\uA76F\uA771-\uA778\uA77A\uA77C\uA77F\uA781\uA783\uA785\uA787\uA78C\uA78E\uA791\uA793\uA7A1\uA7A3\uA7A5\uA7A7\uA7A9\uA7FA\uFB00-\uFB06\uFB13-\uFB17\uFF41-\uFF5A])([\u0041-\u005A\u00C0-\u00D6\u00D8-\u00DE\u0100\u0102\u0104\u0106\u0108\u010A\u010C\u010E\u0110\u0112\u0114\u0116\u0118\u011A\u011C\u011E\u0120\u0122\u0124\u0126\u0128\u012A\u012C\u012E\u0130\u0132\u0134\u0136\u0139\u013B\u013D\u013F\u0141\u0143\u0145\u0147\u014A\u014C\u014E\u0150\u0152\u0154\u0156\u0158\u015A\u015C\u015E\u0160\u0162\u0164\u0166\u0168\u016A\u016C\u016E\u0170\u0172\u0174\u0176\u0178\u0179\u017B\u017D\u0181\u0182\u0184\u0186\u0187\u0189-\u018B\u018E-\u0191\u0193\u0194\u0196-\u0198\u019C\u019D\u019F\u01A0\u01A2\u01A4\u01A6\u01A7\u01A9\u01AC\u01AE\u01AF\u01B1-\u01B3\u01B5\u01B7\u01B8\u01BC\u01C4\u01C7\u01CA\u01CD\u01CF\u01D1\u01D3\u01D5\u01D7\u01D9\u01DB\u01DE\u01E0\u01E2\u01E4\u01E6\u01E8\u01EA\u01EC\u01EE\u01F1\u01F4\u01F6-\u01F8\u01FA\u01FC\u01FE\u0200\u0202\u0204\u0206\u0208\u020A\u020C\u020E\u0210\u0212\u0214\u0216\u0218\u021A\u021C\u021E\u0220\u0222\u0224\u0226\u0228\u022A\u022C\u022E\u0230\u0232\u023A\u023B\u023D\u023E\u0241\u0243-\u0246\u0248\u024A\u024C\u024E\u0370\u0372\u0376\u0386\u0388-\u038A\u038C\u038E\u038F\u0391-\u03A1\u03A3-\u03AB\u03CF\u03D2-\u03D4\u03D8\u03DA\u03DC\u03DE\u03E0\u03E2\u03E4\u03E6\u03E8\u03EA\u03EC\u03EE\u03F4\u03F7\u03F9\u03FA\u03FD-\u042F\u0460\u0462\u0464\u0466\u0468\u046A\u046C\u046E\u0470\u0472\u0474\u0476\u0478\u047A\u047C\u047E\u0480\u048A\u048C\u048E\u0490\u0492\u0494\u0496\u0498\u049A\u049C\u049E\u04A0\u04A2\u04A4\u04A6\u04A8\u04AA\u04AC\u04AE\u04B0\u04B2\u04B4\u04B6\u04B8\u04BA\u04BC\u04BE\u04C0\u04C1\u04C3\u04C5\u04C7\u04C9\u04CB\u04CD\u04D0\u04D2\u04D4\u04D6\u04D8\u04DA\u04DC\u04DE\u04E0\u04E2\u04E4\u04E6\u04E8\u04EA\u04EC\u04EE\u04F0\u04F2\u04F4\u04F6\u04F8\u04FA\u04FC\u04FE\u0500\u0502\u0504\u0506\u0508\u050A\u050C\u050E\u0510\u0512\u0514\u0516\u0518\u051A\u051C\u051E\u0520\u0522\u0524\u0526\u0531-\u0556\u10A0-\u10C5\u10C7\u10CD\u1E00\u1E02\u1E04\u1E06\u1E08\u1E0A\u1E0C\u1E0E\u1E10\u1E12\u1E14\u1E16\u1E18\u1E1A\u1E1C\u1E1E\u1E20\u1E22\u1E24\u1E26\u1E28\u1E2A\u1E2C\u1E2E\u1E30\u1E32\u1E34\u1E36\u1E38\u1E3A\u1E3C\u1E3E\u1E40\u1E42\u1E44\u1E46\u1E48\u1E4A\u1E4C\u1E4E\u1E50\u1E52\u1E54\u1E56\u1E58\u1E5A\u1E5C\u1E5E\u1E60\u1E62\u1E64\u1E66\u1E68\u1E6A\u1E6C\u1E6E\u1E70\u1E72\u1E74\u1E76\u1E78\u1E7A\u1E7C\u1E7E\u1E80\u1E82\u1E84\u1E86\u1E88\u1E8A\u1E8C\u1E8E\u1E90\u1E92\u1E94\u1E9E\u1EA0\u1EA2\u1EA4\u1EA6\u1EA8\u1EAA\u1EAC\u1EAE\u1EB0\u1EB2\u1EB4\u1EB6\u1EB8\u1EBA\u1EBC\u1EBE\u1EC0\u1EC2\u1EC4\u1EC6\u1EC8\u1ECA\u1ECC\u1ECE\u1ED0\u1ED2\u1ED4\u1ED6\u1ED8\u1EDA\u1EDC\u1EDE\u1EE0\u1EE2\u1EE4\u1EE6\u1EE8\u1EEA\u1EEC\u1EEE\u1EF0\u1EF2\u1EF4\u1EF6\u1EF8\u1EFA\u1EFC\u1EFE\u1F08-\u1F0F\u1F18-\u1F1D\u1F28-\u1F2F\u1F38-\u1F3F\u1F48-\u1F4D\u1F59\u1F5B\u1F5D\u1F5F\u1F68-\u1F6F\u1FB8-\u1FBB\u1FC8-\u1FCB\u1FD8-\u1FDB\u1FE8-\u1FEC\u1FF8-\u1FFB\u2102\u2107\u210B-\u210D\u2110-\u2112\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u2130-\u2133\u213E\u213F\u2145\u2183\u2C00-\u2C2E\u2C60\u2C62-\u2C64\u2C67\u2C69\u2C6B\u2C6D-\u2C70\u2C72\u2C75\u2C7E-\u2C80\u2C82\u2C84\u2C86\u2C88\u2C8A\u2C8C\u2C8E\u2C90\u2C92\u2C94\u2C96\u2C98\u2C9A\u2C9C\u2C9E\u2CA0\u2CA2\u2CA4\u2CA6\u2CA8\u2CAA\u2CAC\u2CAE\u2CB0\u2CB2\u2CB4\u2CB6\u2CB8\u2CBA\u2CBC\u2CBE\u2CC0\u2CC2\u2CC4\u2CC6\u2CC8\u2CCA\u2CCC\u2CCE\u2CD0\u2CD2\u2CD4\u2CD6\u2CD8\u2CDA\u2CDC\u2CDE\u2CE0\u2CE2\u2CEB\u2CED\u2CF2\uA640\uA642\uA644\uA646\uA648\uA64A\uA64C\uA64E\uA650\uA652\uA654\uA656\uA658\uA65A\uA65C\uA65E\uA660\uA662\uA664\uA666\uA668\uA66A\uA66C\uA680\uA682\uA684\uA686\uA688\uA68A\uA68C\uA68E\uA690\uA692\uA694\uA696\uA722\uA724\uA726\uA728\uA72A\uA72C\uA72E\uA732\uA734\uA736\uA738\uA73A\uA73C\uA73E\uA740\uA742\uA744\uA746\uA748\uA74A\uA74C\uA74E\uA750\uA752\uA754\uA756\uA758\uA75A\uA75C\uA75E\uA760\uA762\uA764\uA766\uA768\uA76A\uA76C\uA76E\uA779\uA77B\uA77D\uA77E\uA780\uA782\uA784\uA786\uA78B\uA78D\uA790\uA792\uA7A0\uA7A2\uA7A4\uA7A6\uA7A8\uA7AA\uFF21-\uFF3A\u0030-\u0039\u00B2\u00B3\u00B9\u00BC-\u00BE\u0660-\u0669\u06F0-\u06F9\u07C0-\u07C9\u0966-\u096F\u09E6-\u09EF\u09F4-\u09F9\u0A66-\u0A6F\u0AE6-\u0AEF\u0B66-\u0B6F\u0B72-\u0B77\u0BE6-\u0BF2\u0C66-\u0C6F\u0C78-\u0C7E\u0CE6-\u0CEF\u0D66-\u0D75\u0E50-\u0E59\u0ED0-\u0ED9\u0F20-\u0F33\u1040-\u1049\u1090-\u1099\u1369-\u137C\u16EE-\u16F0\u17E0-\u17E9\u17F0-\u17F9\u1810-\u1819\u1946-\u194F\u19D0-\u19DA\u1A80-\u1A89\u1A90-\u1A99\u1B50-\u1B59\u1BB0-\u1BB9\u1C40-\u1C49\u1C50-\u1C59\u2070\u2074-\u2079\u2080-\u2089\u2150-\u2182\u2185-\u2189\u2460-\u249B\u24EA-\u24FF\u2776-\u2793\u2CFD\u3007\u3021-\u3029\u3038-\u303A\u3192-\u3195\u3220-\u3229\u3248-\u324F\u3251-\u325F\u3280-\u3289\u32B1-\u32BF\uA620-\uA629\uA6E6-\uA6EF\uA830-\uA835\uA8D0-\uA8D9\uA900-\uA909\uA9D0-\uA9D9\uAA50-\uAA59\uABF0-\uABF9\uFF10-\uFF19])/g;

/***/ },
/* 342 */
/***/ function(module, exports) {

	"use strict";

	module.exports = /([\u0030-\u0039\u00B2\u00B3\u00B9\u00BC-\u00BE\u0660-\u0669\u06F0-\u06F9\u07C0-\u07C9\u0966-\u096F\u09E6-\u09EF\u09F4-\u09F9\u0A66-\u0A6F\u0AE6-\u0AEF\u0B66-\u0B6F\u0B72-\u0B77\u0BE6-\u0BF2\u0C66-\u0C6F\u0C78-\u0C7E\u0CE6-\u0CEF\u0D66-\u0D75\u0E50-\u0E59\u0ED0-\u0ED9\u0F20-\u0F33\u1040-\u1049\u1090-\u1099\u1369-\u137C\u16EE-\u16F0\u17E0-\u17E9\u17F0-\u17F9\u1810-\u1819\u1946-\u194F\u19D0-\u19DA\u1A80-\u1A89\u1A90-\u1A99\u1B50-\u1B59\u1BB0-\u1BB9\u1C40-\u1C49\u1C50-\u1C59\u2070\u2074-\u2079\u2080-\u2089\u2150-\u2182\u2185-\u2189\u2460-\u249B\u24EA-\u24FF\u2776-\u2793\u2CFD\u3007\u3021-\u3029\u3038-\u303A\u3192-\u3195\u3220-\u3229\u3248-\u324F\u3251-\u325F\u3280-\u3289\u32B1-\u32BF\uA620-\uA629\uA6E6-\uA6EF\uA830-\uA835\uA8D0-\uA8D9\uA900-\uA909\uA9D0-\uA9D9\uAA50-\uAA59\uABF0-\uABF9\uFF10-\uFF19])([^\u0030-\u0039\u00B2\u00B3\u00B9\u00BC-\u00BE\u0660-\u0669\u06F0-\u06F9\u07C0-\u07C9\u0966-\u096F\u09E6-\u09EF\u09F4-\u09F9\u0A66-\u0A6F\u0AE6-\u0AEF\u0B66-\u0B6F\u0B72-\u0B77\u0BE6-\u0BF2\u0C66-\u0C6F\u0C78-\u0C7E\u0CE6-\u0CEF\u0D66-\u0D75\u0E50-\u0E59\u0ED0-\u0ED9\u0F20-\u0F33\u1040-\u1049\u1090-\u1099\u1369-\u137C\u16EE-\u16F0\u17E0-\u17E9\u17F0-\u17F9\u1810-\u1819\u1946-\u194F\u19D0-\u19DA\u1A80-\u1A89\u1A90-\u1A99\u1B50-\u1B59\u1BB0-\u1BB9\u1C40-\u1C49\u1C50-\u1C59\u2070\u2074-\u2079\u2080-\u2089\u2150-\u2182\u2185-\u2189\u2460-\u249B\u24EA-\u24FF\u2776-\u2793\u2CFD\u3007\u3021-\u3029\u3038-\u303A\u3192-\u3195\u3220-\u3229\u3248-\u324F\u3251-\u325F\u3280-\u3289\u32B1-\u32BF\uA620-\uA629\uA6E6-\uA6EF\uA830-\uA835\uA8D0-\uA8D9\uA900-\uA909\uA9D0-\uA9D9\uAA50-\uAA59\uABF0-\uABF9\uFF10-\uFF19])/g;

/***/ },
/* 343 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var escape = __webpack_require__(335);
	var propConfig = __webpack_require__(344);
	var types = propConfig.attributeTypes;
	var properties = propConfig.properties;
	var attributeNames = propConfig.attributeNames;

	var prefixAttribute = memoizeString(function (name) {
	  return escape(name) + '="';
	});

	module.exports = createAttribute;

	/**
	 * Create attribute string.
	 *
	 * @param {String} name The name of the property or attribute
	 * @param {*} value The value
	 * @param {Boolean} [isAttribute] Denotes whether `name` is an attribute.
	 * @return {?String} Attribute string || null if not a valid property or custom attribute.
	 */

	function createAttribute(name, value, isAttribute) {
	  if (properties.hasOwnProperty(name)) {
	    if (shouldSkip(name, value)) return '';
	    name = (attributeNames[name] || name).toLowerCase();
	    var attrType = properties[name];
	    // for BOOLEAN `value` only has to be truthy
	    // for OVERLOADED_BOOLEAN `value` has to be === true
	    if (attrType === types.BOOLEAN || attrType === types.OVERLOADED_BOOLEAN && value === true) {
	      return escape(name);
	    }
	    return prefixAttribute(name) + escape(value) + '"';
	  } else if (isAttribute) {
	    if (value == null) return '';
	    return prefixAttribute(name) + escape(value) + '"';
	  }
	  // return null if `name` is neither a valid property nor an attribute
	  return null;
	}

	/**
	 * Should skip false boolean attributes.
	 */

	function shouldSkip(name, value) {
	  var attrType = properties[name];
	  return value == null || attrType === types.BOOLEAN && !value || attrType === types.OVERLOADED_BOOLEAN && value === false;
	}

	/**
	 * Memoizes the return value of a function that accepts one string argument.
	 *
	 * @param {function} callback
	 * @return {function}
	 */

	function memoizeString(callback) {
	  var cache = {};
	  return function (string) {
	    if (cache.hasOwnProperty(string)) {
	      return cache[string];
	    } else {
	      return cache[string] = callback.call(this, string);
	    }
	  };
	}

/***/ },
/* 344 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * Attribute types.
	 */

	var types = {
	  BOOLEAN: 1,
	  OVERLOADED_BOOLEAN: 2
	};

	/**
	 * Properties.
	 *
	 * Taken from https://github.com/facebook/react/blob/847357e42e5267b04dd6e297219eaa125ab2f9f4/src/browser/ui/dom/HTMLDOMPropertyConfig.js
	 *
	 */

	var properties = {
	  /**
	   * Standard Properties
	   */
	  accept: true,
	  acceptCharset: true,
	  accessKey: true,
	  action: true,
	  allowFullScreen: types.BOOLEAN,
	  allowTransparency: true,
	  alt: true,
	  async: types.BOOLEAN,
	  autocomplete: true,
	  autofocus: types.BOOLEAN,
	  autoplay: types.BOOLEAN,
	  cellPadding: true,
	  cellSpacing: true,
	  charset: true,
	  checked: types.BOOLEAN,
	  classID: true,
	  className: true,
	  cols: true,
	  colSpan: true,
	  content: true,
	  contentEditable: true,
	  contextMenu: true,
	  controls: types.BOOLEAN,
	  coords: true,
	  crossOrigin: true,
	  data: true, // For `<object />` acts as `src`.
	  dateTime: true,
	  defer: types.BOOLEAN,
	  dir: true,
	  disabled: types.BOOLEAN,
	  download: types.OVERLOADED_BOOLEAN,
	  draggable: true,
	  enctype: true,
	  form: true,
	  formAction: true,
	  formEncType: true,
	  formMethod: true,
	  formNoValidate: types.BOOLEAN,
	  formTarget: true,
	  frameBorder: true,
	  headers: true,
	  height: true,
	  hidden: types.BOOLEAN,
	  href: true,
	  hreflang: true,
	  htmlFor: true,
	  httpEquiv: true,
	  icon: true,
	  id: true,
	  label: true,
	  lang: true,
	  list: true,
	  loop: types.BOOLEAN,
	  manifest: true,
	  marginHeight: true,
	  marginWidth: true,
	  max: true,
	  maxLength: true,
	  media: true,
	  mediaGroup: true,
	  method: true,
	  min: true,
	  multiple: types.BOOLEAN,
	  muted: types.BOOLEAN,
	  name: true,
	  noValidate: types.BOOLEAN,
	  open: true,
	  pattern: true,
	  placeholder: true,
	  poster: true,
	  preload: true,
	  radiogroup: true,
	  readOnly: types.BOOLEAN,
	  rel: true,
	  required: types.BOOLEAN,
	  role: true,
	  rows: true,
	  rowSpan: true,
	  sandbox: true,
	  scope: true,
	  scrolling: true,
	  seamless: types.BOOLEAN,
	  selected: types.BOOLEAN,
	  shape: true,
	  size: true,
	  sizes: true,
	  span: true,
	  spellcheck: true,
	  src: true,
	  srcdoc: true,
	  srcset: true,
	  start: true,
	  step: true,
	  style: true,
	  tabIndex: true,
	  target: true,
	  title: true,
	  type: true,
	  useMap: true,
	  value: true,
	  width: true,
	  wmode: true,

	  /**
	   * Non-standard Properties
	   */
	  // autoCapitalize and autoCorrect are supported in Mobile Safari for
	  // keyboard hints.
	  autocapitalize: true,
	  autocorrect: true,
	  // itemProp, itemScope, itemType are for Microdata support. See
	  // http://schema.org/docs/gs.html
	  itemProp: true,
	  itemScope: types.BOOLEAN,
	  itemType: true,
	  // property is supported for OpenGraph in meta tags.
	  property: true
	};

	/**
	 * Properties to attributes mapping.
	 *
	 * The ones not here are simply converted to lower case.
	 */

	var attributeNames = {
	  acceptCharset: 'accept-charset',
	  className: 'class',
	  htmlFor: 'for',
	  httpEquiv: 'http-equiv'
	};

	/**
	 * Exports.
	 */

	module.exports = {
	  attributeTypes: types,
	  properties: properties,
	  attributeNames: attributeNames
	};

/***/ },
/* 345 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * Void elements.
	 *
	 * https://github.com/facebook/react/blob/v0.12.0/src/browser/ui/ReactDOMComponent.js#L99
	 */

	module.exports = {
	  'area': true,
	  'base': true,
	  'br': true,
	  'col': true,
	  'embed': true,
	  'hr': true,
	  'img': true,
	  'input': true,
	  'keygen': true,
	  'link': true,
	  'meta': true,
	  'param': true,
	  'source': true,
	  'track': true,
	  'wbr': true
	};

/***/ },
/* 346 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { 'default': obj };
	}

	var _rx = __webpack_require__(287);

	var _rx2 = _interopRequireDefault(_rx);

	var emptyStream = _rx2['default'].Observable.empty();

	function getEventsStreamForSelector(mockedEventTypes) {
	  return function getEventsStream(eventType) {
	    for (var key in mockedEventTypes) {
	      if (mockedEventTypes.hasOwnProperty(key) && key === eventType) {
	        return mockedEventTypes[key];
	      }
	    }
	    return emptyStream;
	  };
	}

	function mockDOMSource() {
	  var mockedSelectors = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	  return {
	    select: function select(selector) {
	      for (var key in mockedSelectors) {
	        if (mockedSelectors.hasOwnProperty(key) && key === selector) {
	          var observable = emptyStream;
	          if (mockedSelectors[key].hasOwnProperty('observable')) {
	            observable = mockedSelectors[key].observable;
	          }
	          return {
	            observable: observable,
	            events: getEventsStreamForSelector(mockedSelectors[key])
	          };
	        }
	      }
	      return {
	        observable: emptyStream,
	        events: function events() {
	          return emptyStream;
	        }
	      };
	    }
	  };
	}

	exports['default'] = mockDOMSource;
	module.exports = exports['default'];

/***/ },
/* 347 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	var isValidString = function isValidString(param) {
	  return typeof param === 'string' && param.length > 0;
	};

	var startsWith = function startsWith(string, start) {
	  return string[0] === start;
	};

	var isSelector = function isSelector(param) {
	  return isValidString(param) && (startsWith(param, '.') || startsWith(param, '#'));
	};

	var node = function node(h) {
	  return function (tagName) {
	    return function (first) {
	      for (var _len = arguments.length, rest = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	        rest[_key - 1] = arguments[_key];
	      }

	      if (isSelector(first)) {
	        return h.apply(undefined, [tagName + first].concat(rest));
	      } else {
	        return h.apply(undefined, [tagName, first].concat(rest));
	      }
	    };
	  };
	};

	var TAG_NAMES = ['a', 'abbr', 'address', 'area', 'article', 'aside', 'audio', 'b', 'base', 'bdi', 'bdo', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'cite', 'code', 'col', 'colgroup', 'dd', 'del', 'dfn', 'dir', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hgroup', 'hr', 'html', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'keygen', 'label', 'legend', 'li', 'link', 'main', 'map', 'mark', 'menu', 'meta', 'nav', 'noscript', 'object', 'ol', 'optgroup', 'option', 'p', 'param', 'pre', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'script', 'section', 'select', 'small', 'source', 'span', 'strong', 'style', 'sub', 'sup', 'table', 'tbody', 'td', 'textarea', 'tfoot', 'th', 'thead', 'title', 'tr', 'u', 'ul', 'video'];

	exports['default'] = function (h) {
	  var createTag = node(h);
	  var exported = { TAG_NAMES: TAG_NAMES, isSelector: isSelector, createTag: createTag };
	  TAG_NAMES.forEach(function (n) {
	    exported[n] = createTag(n);
	  });
	  return exported;
	};

	module.exports = exports['default'];

/***/ },
/* 348 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	var Rx = __webpack_require__(287);

	function makeSinkProxies(drivers) {
	  var sinkProxies = {};
	  var keys = Object.keys(drivers);
	  for (var i = 0; i < keys.length; i++) {
	    sinkProxies[keys[i]] = new Rx.ReplaySubject(1);
	  }
	  return sinkProxies;
	}

	function callDrivers(drivers, sinkProxies) {
	  var sources = {};
	  var keys = Object.keys(drivers);
	  for (var i = 0; i < keys.length; i++) {
	    var _name = keys[i];
	    sources[_name] = drivers[_name](sinkProxies[_name], _name);
	  }
	  return sources;
	}

	function attachDisposeToSinks(sinks, replicationSubscription) {
	  return Object.defineProperty(sinks, "dispose", {
	    value: function value() {
	      replicationSubscription.dispose();
	    }
	  });
	}

	function makeDisposeSources(sources) {
	  return function dispose() {
	    var keys = Object.keys(sources);
	    for (var i = 0; i < keys.length; i++) {
	      var source = sources[keys[i]];
	      if (typeof source.dispose === "function") {
	        source.dispose();
	      }
	    }
	  };
	}

	function attachDisposeToSources(sources) {
	  return Object.defineProperty(sources, "dispose", {
	    value: makeDisposeSources(sources)
	  });
	}

	var logToConsoleError = typeof console !== "undefined" && console.error ? function (error) {
	  console.error(error.stack || error);
	} : Function.prototype;

	function replicateMany(observables, subjects) {
	  return Rx.Observable.create(function (observer) {
	    var subscription = new Rx.CompositeDisposable();
	    setTimeout(function () {
	      var keys = Object.keys(observables);
	      for (var i = 0; i < keys.length; i++) {
	        var _name2 = keys[i];
	        if (subjects.hasOwnProperty(_name2) && !subjects[_name2].isDisposed) {
	          subscription.add(observables[_name2].doOnError(logToConsoleError).subscribe(subjects[_name2].asObserver()));
	        }
	      }
	      observer.onNext(subscription);
	    });

	    return function dispose() {
	      subscription.dispose();
	      var keys = Object.keys(subjects);
	      for (var i = 0; i < keys.length; i++) {
	        subjects[keys[i]].dispose();
	      }
	    };
	  });
	}

	function run(main, drivers) {
	  if (typeof main !== "function") {
	    throw new Error("First argument given to Cycle.run() must be the 'main' " + "function.");
	  }
	  if ((typeof drivers === "undefined" ? "undefined" : _typeof(drivers)) !== "object" || drivers === null) {
	    throw new Error("Second argument given to Cycle.run() must be an object " + "with driver functions as properties.");
	  }
	  if (Object.keys(drivers).length === 0) {
	    throw new Error("Second argument given to Cycle.run() must be an object " + "with at least one driver function declared as a property.");
	  }

	  var sinkProxies = makeSinkProxies(drivers);
	  var sources = callDrivers(drivers, sinkProxies);
	  var sinks = main(sources);
	  var subscription = replicateMany(sinks, sinkProxies).subscribe();
	  var sinksWithDispose = attachDisposeToSinks(sinks, subscription);
	  var sourcesWithDispose = attachDisposeToSources(sources);
	  return { sources: sourcesWithDispose, sinks: sinksWithDispose };
	}

	var Cycle = {
	  /**
	   * Takes a `main` function and circularly connects it to the given collection
	   * of driver functions.
	   *
	   * The `main` function expects a collection of "driver source" Observables
	   * as input, and should return a collection of "driver sink" Observables.
	   * A "collection of Observables" is a JavaScript object where
	   * keys match the driver names registered by the `drivers` object, and values
	   * are Observables or a collection of Observables.
	   *
	   * @param {Function} main a function that takes `sources` as input
	   * and outputs a collection of `sinks` Observables.
	   * @param {Object} drivers an object where keys are driver names and values
	   * are driver functions.
	   * @return {Object} an object with two properties: `sources` and `sinks`.
	   * `sinks` is the collection of driver sinks, and `sources` is the collection
	   * of driver sources, that can be used for debugging or testing.
	   * @function run
	   */
	  run: run
	};

	module.exports = Cycle;

/***/ },
/* 349 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _extends = Object.assign || function (target) {
	  for (var i = 1; i < arguments.length; i++) {
	    var source = arguments[i];for (var key in source) {
	      if (Object.prototype.hasOwnProperty.call(source, key)) {
	        target[key] = source[key];
	      }
	    }
	  }return target;
	};

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.createHref = exports.createLocation = exports.makeRouterDriver = undefined;

	var _rx = __webpack_require__(287);

	var _rx2 = _interopRequireDefault(_rx);

	var _switchPath2 = __webpack_require__(350);

	var _switchPath3 = _interopRequireDefault(_switchPath2);

	var _history = __webpack_require__(351);

	var _history2 = __webpack_require__(379);

	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { default: obj };
	}

	function _objectWithoutProperties(obj, keys) {
	  var target = {};for (var i in obj) {
	    if (keys.indexOf(i) >= 0) continue;if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;target[i] = obj[i];
	  }return target;
	}

	function filterPush(location) {
	  return location.action === 'PUSH' || location.action === 'REPLACE';
	}

	function isStrictlyInScope(namespace, path) {
	  var pathParts = path.split('/').filter(function (x) {
	    return x.length > 0;
	  });
	  return namespace.every(function (v, i) {
	    return pathParts[i] === v;
	  });
	}

	function makeDefinitionResolver(source$) {
	  return function definitionResolver(routeDefinitions) {
	    var props$ = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

	    var namespace = this.namespace;
	    var props$_ = props$ === null ? this.props$ : props$;
	    var history$ = this.history$;
	    return source$.map(function (_ref) {
	      var pathname = _ref.pathname;

	      var pathParts = pathname.split('/').filter(function (x) {
	        return x.length > 0;
	      });
	      var path_ = pathParts.filter(function (i) {
	        return namespace.indexOf(i) < 0;
	      }).join('/');

	      var _switchPath = (0, _switchPath3.default)('/' + path_, routeDefinitions);

	      var path = _switchPath.path;
	      var value = _switchPath.value;

	      return {
	        path: path,
	        value: value,
	        routeDefinitions: routeDefinitions,
	        fullPath: pathname,
	        props$: props$_.shareReplay(1),
	        history$: history$
	      };
	    }).filter(function (_ref2) {
	      var path = _ref2.path;
	      return path !== null;
	    }).share();
	  };
	}

	function makePathFilter(source$) {
	  return function pathFilter(path) {
	    var props$ = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

	    var namespace = this.namespace;
	    var props$_ = props$ === null ? this.props$ : props$;
	    var history$ = this.history$;
	    var scopedNamespace = namespace.concat(path.split('/').filter(function (s) {
	      return s.length > 0;
	    }));
	    var scopedSource$ = source$.filter(function (_ref3) {
	      var pathname = _ref3.pathname;

	      return isStrictlyInScope(scopedNamespace, pathname);
	    }).share();
	    return {
	      namespace: scopedNamespace,
	      observable: scopedSource$,
	      path: makePathFilter(scopedSource$),
	      define: makeDefinitionResolver(scopedSource$, props$),
	      props$: props$_.shareReplay(1),
	      history$: history$
	    };
	  };
	}

	var defaultOptions = {
	  hash: true,
	  basename: '/'
	};

	function makeRouterDriver() {
	  var config = arguments.length <= 0 || arguments[0] === undefined ? defaultOptions : arguments[0];
	  var hash = config.hash;

	  var options = _objectWithoutProperties(config, ['hash']);

	  var history = (0, _history2.makeHistory)(hash, options);

	  return function routerDriver(sink$) {
	    var source$ = new _rx2.default.ReplaySubject(1);
	    var history$ = new _rx2.default.ReplaySubject(1);
	    sink$.subscribe((0, _history2.makePushState)(history));

	    history.listen(function (_ref4) {
	      var pathname = _ref4.pathname;

	      var location = _objectWithoutProperties(_ref4, ['pathname']);

	      var path = pathname === '/' ? pathname : '/' + pathname;
	      source$.onNext(_extends({ pathname: path }, location));
	      if (location.action !== 'POP') {
	        history$.onNext(location);
	      }
	    });

	    return {
	      namespace: [],
	      observable: source$.filter(filterPush).share(),
	      path: makePathFilter(source$.filter(filterPush)),
	      define: makeDefinitionResolver(source$.filter(filterPush)),
	      props$: _rx2.default.Observable.just({}).replay(1),
	      history$: history$
	    };
	  };
	}

	exports.makeRouterDriver = makeRouterDriver;
	exports.createLocation = _history.createLocation;
	exports.createHref = _history.createHref;

/***/ },
/* 350 */
/***/ function(module, exports) {

	"use strict";

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	function isPattern(candidate) {
	  return typeof candidate === "string" && (candidate.charAt(0) === "/" || candidate === "*");
	}

	function isRouteConfigurationObject(routes) {
	  if ((typeof routes === "undefined" ? "undefined" : _typeof(routes)) !== "object") {
	    return false;
	  }
	  for (var path in routes) {
	    if (routes.hasOwnProperty(path)) {
	      return isPattern(path);
	    }
	  }
	}

	function unprefixed(fullStr, prefix) {
	  return fullStr.split(prefix)[1];
	}

	function matchesWithParams(sourcePath, pattern) {
	  var sourceParts = sourcePath.split("/").filter(function (s) {
	    return s.length > 0;
	  });
	  var patternParts = pattern.split("/").filter(function (s) {
	    return s.length > 0;
	  });
	  var params = patternParts.map(function (patternPart, index) {
	    if (patternPart.match(/:\w+/) !== null) {
	      return sourceParts[index];
	    } else {
	      return null;
	    }
	  }).filter(function (x) {
	    return x !== null;
	  });
	  var matched = patternParts.every(function (part, i) {
	    return part.match(/:\w+/) !== null || part === sourceParts[i];
	  });
	  return matched ? params : [];
	}

	function validateSwitchPathPreconditions(sourcePath, routes) {
	  if (typeof sourcePath !== "string") {
	    throw new Error("Invalid source path. We expected to see a string given " + "as the sourcePath (first argument) to switchPath.");
	  }
	  if (!isRouteConfigurationObject(routes)) {
	    throw new Error("Invalid routes object. We expected to see a routes " + "configuration object where keys are strings that look like '/foo'. " + "These keys must start with a slash '/'.");
	  }
	}

	function validatePatternPreconditions(pattern) {
	  if (!isPattern(pattern)) {
	    throw new Error("Paths in route configuration must be strings that start " + "with a slash '/'.");
	  }
	}

	function isNormalPattern(routes, pattern) {
	  if (pattern === "*" || !routes.hasOwnProperty(pattern)) {
	    return false;
	  }
	  return true;
	}

	function handleTrailingSlash(paramsFn) {
	  if (isRouteConfigurationObject(paramsFn)) {
	    return paramsFn["/"];
	  }
	  return paramsFn;
	}

	function getParamsFnValue(paramFn, params) {
	  var _paramFn = handleTrailingSlash(paramFn);
	  if (typeof _paramFn !== "function") {
	    return _paramFn;
	  }
	  return _paramFn.apply(null, params);
	}

	function splitPath(path) {
	  var pathParts = path.split("/");
	  if (pathParts[pathParts.length - 1] === "") {
	    pathParts.pop();
	  }
	  return pathParts;
	}

	function validatePath(sourcePath, matchedPath) {
	  if (matchedPath === null) {
	    return "";
	  }
	  var sourceParts = splitPath(sourcePath);
	  var matchedParts = splitPath(matchedPath);
	  var validPath = sourceParts.map(function (part, index) {
	    if (part !== matchedParts[index]) {
	      return null;
	    }
	    return part;
	  }).filter(function (x) {
	    return x !== null;
	  }).join("/");
	  return validPath;
	}

	function validate(_ref) {
	  var sourcePath = _ref.sourcePath;
	  var matchedPath = _ref.matchedPath;
	  var value = _ref.value;
	  var routes = _ref.routes;

	  var validPath = validatePath(sourcePath, matchedPath);
	  if (!validPath) {
	    validPath = !routes["*"] ? null : sourcePath;
	    var validValue = !validPath ? null : routes["*"];
	    return {
	      validPath: validPath,
	      validValue: validValue
	    };
	  }
	  return { validPath: validPath, validValue: value };
	}

	function betterMatch(candidate, reference) {
	  if (candidate === null) {
	    return false;
	  }
	  if (reference === null) {
	    return true;
	  }
	  return candidate.length >= reference.length;
	}

	function switchPath(sourcePath, routes) {
	  validateSwitchPathPreconditions(sourcePath, routes);
	  var matchedPath = null;
	  var value = null;
	  for (var pattern in routes) {
	    if (!isNormalPattern(routes, pattern)) {
	      continue;
	    }
	    validatePatternPreconditions(pattern);
	    if (sourcePath.search(pattern) === 0 && betterMatch(pattern, matchedPath)) {
	      matchedPath = pattern;
	      value = routes[pattern];
	    }
	    var params = matchesWithParams(sourcePath, pattern);
	    if (params.length > 0 && betterMatch(sourcePath, matchedPath)) {
	      matchedPath = sourcePath;
	      value = getParamsFnValue(routes[pattern], params);
	    }
	    if (isRouteConfigurationObject(routes[pattern]) && params.length === 0) {
	      var child = switchPath(unprefixed(sourcePath, pattern), routes[pattern]);
	      var nestedPath = pattern + child.path;
	      if (child.path !== null && betterMatch(nestedPath, matchedPath)) {
	        matchedPath = nestedPath;
	        value = child.value;
	      }
	    }
	    if (pattern === sourcePath) {
	      return { path: pattern, value: handleTrailingSlash(routes[pattern]) };
	    }
	  }

	  var _validate = validate({
	    sourcePath: sourcePath,
	    matchedPath: matchedPath,
	    value: value,
	    routes: routes
	  });

	  var validPath = _validate.validPath;
	  var validValue = _validate.validValue;

	  return { path: validPath, value: validValue };
	}

	module.exports = switchPath;

/***/ },
/* 351 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { 'default': obj };
	}

	var _deprecate = __webpack_require__(352);

	var _deprecate2 = _interopRequireDefault(_deprecate);

	var _createLocation2 = __webpack_require__(353);

	var _createLocation3 = _interopRequireDefault(_createLocation2);

	var _createBrowserHistory = __webpack_require__(358);

	var _createBrowserHistory2 = _interopRequireDefault(_createBrowserHistory);

	exports.createHistory = _createBrowserHistory2['default'];

	var _createHashHistory2 = __webpack_require__(370);

	var _createHashHistory3 = _interopRequireDefault(_createHashHistory2);

	exports.createHashHistory = _createHashHistory3['default'];

	var _createMemoryHistory2 = __webpack_require__(371);

	var _createMemoryHistory3 = _interopRequireDefault(_createMemoryHistory2);

	exports.createMemoryHistory = _createMemoryHistory3['default'];

	var _useBasename2 = __webpack_require__(372);

	var _useBasename3 = _interopRequireDefault(_useBasename2);

	exports.useBasename = _useBasename3['default'];

	var _useBeforeUnload2 = __webpack_require__(373);

	var _useBeforeUnload3 = _interopRequireDefault(_useBeforeUnload2);

	exports.useBeforeUnload = _useBeforeUnload3['default'];

	var _useQueries2 = __webpack_require__(374);

	var _useQueries3 = _interopRequireDefault(_useQueries2);

	exports.useQueries = _useQueries3['default'];

	var _Actions2 = __webpack_require__(354);

	var _Actions3 = _interopRequireDefault(_Actions2);

	exports.Actions = _Actions3['default'];

	// deprecated

	var _enableBeforeUnload2 = __webpack_require__(377);

	var _enableBeforeUnload3 = _interopRequireDefault(_enableBeforeUnload2);

	exports.enableBeforeUnload = _enableBeforeUnload3['default'];

	var _enableQueries2 = __webpack_require__(378);

	var _enableQueries3 = _interopRequireDefault(_enableQueries2);

	exports.enableQueries = _enableQueries3['default'];
	var createLocation = _deprecate2['default'](_createLocation3['default'], 'Using createLocation without a history instance is deprecated; please use history.createLocation instead');
	exports.createLocation = createLocation;

/***/ },
/* 352 */
/***/ function(module, exports) {

	//import warning from 'warning'

	"use strict";

	exports.__esModule = true;
	function deprecate(fn) {
	  return fn;
	  //return function () {
	  //  warning(false, '[history] ' + message)
	  //  return fn.apply(this, arguments)
	  //}
	}

	exports["default"] = deprecate;
	module.exports = exports["default"];

/***/ },
/* 353 */
/***/ function(module, exports, __webpack_require__) {

	//import warning from 'warning'
	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	exports.__esModule = true;

	var _extends = Object.assign || function (target) {
	  for (var i = 1; i < arguments.length; i++) {
	    var source = arguments[i];for (var key in source) {
	      if (Object.prototype.hasOwnProperty.call(source, key)) {
	        target[key] = source[key];
	      }
	    }
	  }return target;
	};

	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { 'default': obj };
	}

	var _Actions = __webpack_require__(354);

	var _parsePath = __webpack_require__(355);

	var _parsePath2 = _interopRequireDefault(_parsePath);

	function createLocation() {
	  var location = arguments.length <= 0 || arguments[0] === undefined ? '/' : arguments[0];
	  var action = arguments.length <= 1 || arguments[1] === undefined ? _Actions.POP : arguments[1];
	  var key = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

	  var _fourthArg = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];

	  if (typeof location === 'string') location = _parsePath2['default'](location);

	  if ((typeof action === 'undefined' ? 'undefined' : _typeof(action)) === 'object') {
	    //warning(
	    //  false,
	    //  'The state (2nd) argument to createLocation is deprecated; use a ' +
	    //  'location descriptor instead'
	    //)

	    location = _extends({}, location, { state: action });

	    action = key || _Actions.POP;
	    key = _fourthArg;
	  }

	  var pathname = location.pathname || '/';
	  var search = location.search || '';
	  var hash = location.hash || '';
	  var state = location.state || null;

	  return {
	    pathname: pathname,
	    search: search,
	    hash: hash,
	    state: state,
	    action: action,
	    key: key
	  };
	}

	exports['default'] = createLocation;
	module.exports = exports['default'];

/***/ },
/* 354 */
/***/ function(module, exports) {

	/**
	 * Indicates that navigation was caused by a call to history.push.
	 */
	'use strict';

	exports.__esModule = true;
	var PUSH = 'PUSH';

	exports.PUSH = PUSH;
	/**
	 * Indicates that navigation was caused by a call to history.replace.
	 */
	var REPLACE = 'REPLACE';

	exports.REPLACE = REPLACE;
	/**
	 * Indicates that navigation was caused by some other action such
	 * as using a browser's back/forward buttons and/or manually manipulating
	 * the URL in a browser's location bar. This is the default.
	 *
	 * See https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onpopstate
	 * for more information.
	 */
	var POP = 'POP';

	exports.POP = POP;
	exports['default'] = {
	  PUSH: PUSH,
	  REPLACE: REPLACE,
	  POP: POP
	};

/***/ },
/* 355 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	exports.__esModule = true;

	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { 'default': obj };
	}

	var _warning = __webpack_require__(356);

	var _warning2 = _interopRequireDefault(_warning);

	var _extractPath = __webpack_require__(357);

	var _extractPath2 = _interopRequireDefault(_extractPath);

	function parsePath(path) {
	  var pathname = _extractPath2['default'](path);
	  var search = '';
	  var hash = '';

	  process.env.NODE_ENV !== 'production' ? _warning2['default'](path === pathname, 'A path must be pathname + search + hash only, not a fully qualified URL like "%s"', path) : undefined;

	  var hashIndex = pathname.indexOf('#');
	  if (hashIndex !== -1) {
	    hash = pathname.substring(hashIndex);
	    pathname = pathname.substring(0, hashIndex);
	  }

	  var searchIndex = pathname.indexOf('?');
	  if (searchIndex !== -1) {
	    search = pathname.substring(searchIndex);
	    pathname = pathname.substring(0, searchIndex);
	  }

	  if (pathname === '') pathname = '/';

	  return {
	    pathname: pathname,
	    search: search,
	    hash: hash
	  };
	}

	exports['default'] = parsePath;
	module.exports = exports['default'];
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(283)))

/***/ },
/* 356 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * Copyright 2014-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 */

	'use strict';

	/**
	 * Similar to invariant but only logs a warning if the condition is not met.
	 * This can be used to log issues in development environments in critical
	 * paths. Removing the logging code for production environments will keep the
	 * same logic and follow the same code paths.
	 */

	var warning = function warning() {};

	if (process.env.NODE_ENV !== 'production') {
	  warning = function warning(condition, format, args) {
	    var len = arguments.length;
	    args = new Array(len > 2 ? len - 2 : 0);
	    for (var key = 2; key < len; key++) {
	      args[key - 2] = arguments[key];
	    }
	    if (format === undefined) {
	      throw new Error('`warning(condition, format, ...args)` requires a warning ' + 'message argument');
	    }

	    if (format.length < 10 || /^[s\W]*$/.test(format)) {
	      throw new Error('The warning format should be able to uniquely identify this ' + 'warning. Please, use a more descriptive format than: ' + format);
	    }

	    if (!condition) {
	      var argIndex = 0;
	      var message = 'Warning: ' + format.replace(/%s/g, function () {
	        return args[argIndex++];
	      });
	      if (typeof console !== 'undefined') {
	        console.error(message);
	      }
	      try {
	        // This error was thrown as a convenience so that you can use this stack
	        // to find the callsite that caused this warning to fire.
	        throw new Error(message);
	      } catch (x) {}
	    }
	  };
	}

	module.exports = warning;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(283)))

/***/ },
/* 357 */
/***/ function(module, exports) {

	"use strict";

	exports.__esModule = true;
	function extractPath(string) {
	  var match = string.match(/^https?:\/\/[^\/]*/);

	  if (match == null) return string;

	  return string.substring(match[0].length);
	}

	exports["default"] = extractPath;
	module.exports = exports["default"];

/***/ },
/* 358 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	exports.__esModule = true;

	var _extends = Object.assign || function (target) {
	  for (var i = 1; i < arguments.length; i++) {
	    var source = arguments[i];for (var key in source) {
	      if (Object.prototype.hasOwnProperty.call(source, key)) {
	        target[key] = source[key];
	      }
	    }
	  }return target;
	};

	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { 'default': obj };
	}

	var _invariant = __webpack_require__(359);

	var _invariant2 = _interopRequireDefault(_invariant);

	var _Actions = __webpack_require__(354);

	var _ExecutionEnvironment = __webpack_require__(360);

	var _DOMUtils = __webpack_require__(361);

	var _DOMStateStorage = __webpack_require__(362);

	var _createDOMHistory = __webpack_require__(363);

	var _createDOMHistory2 = _interopRequireDefault(_createDOMHistory);

	var _parsePath = __webpack_require__(355);

	var _parsePath2 = _interopRequireDefault(_parsePath);

	/**
	 * Creates and returns a history object that uses HTML5's history API
	 * (pushState, replaceState, and the popstate event) to manage history.
	 * This is the recommended method of managing history in browsers because
	 * it provides the cleanest URLs.
	 *
	 * Note: In browsers that do not support the HTML5 history API full
	 * page reloads will be used to preserve URLs.
	 */
	function createBrowserHistory() {
	  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	  !_ExecutionEnvironment.canUseDOM ? process.env.NODE_ENV !== 'production' ? _invariant2['default'](false, 'Browser history needs a DOM') : _invariant2['default'](false) : undefined;

	  var forceRefresh = options.forceRefresh;

	  var isSupported = _DOMUtils.supportsHistory();
	  var useRefresh = !isSupported || forceRefresh;

	  function getCurrentLocation(historyState) {
	    historyState = historyState || window.history.state || {};

	    var path = _DOMUtils.getWindowPath();
	    var _historyState = historyState;
	    var key = _historyState.key;

	    var state = undefined;
	    if (key) {
	      state = _DOMStateStorage.readState(key);
	    } else {
	      state = null;
	      key = history.createKey();

	      if (isSupported) window.history.replaceState(_extends({}, historyState, { key: key }), null, path);
	    }

	    var location = _parsePath2['default'](path);

	    return history.createLocation(_extends({}, location, { state: state }), undefined, key);
	  }

	  function startPopStateListener(_ref) {
	    var transitionTo = _ref.transitionTo;

	    function popStateListener(event) {
	      if (event.state === undefined) return; // Ignore extraneous popstate events in WebKit.

	      transitionTo(getCurrentLocation(event.state));
	    }

	    _DOMUtils.addEventListener(window, 'popstate', popStateListener);

	    return function () {
	      _DOMUtils.removeEventListener(window, 'popstate', popStateListener);
	    };
	  }

	  function finishTransition(location) {
	    var basename = location.basename;
	    var pathname = location.pathname;
	    var search = location.search;
	    var hash = location.hash;
	    var state = location.state;
	    var action = location.action;
	    var key = location.key;

	    if (action === _Actions.POP) return; // Nothing to do.

	    _DOMStateStorage.saveState(key, state);

	    var path = (basename || '') + pathname + search + hash;
	    var historyState = {
	      key: key
	    };

	    if (action === _Actions.PUSH) {
	      if (useRefresh) {
	        window.location.href = path;
	        return false; // Prevent location update.
	      } else {
	          window.history.pushState(historyState, null, path);
	        }
	    } else {
	      // REPLACE
	      if (useRefresh) {
	        window.location.replace(path);
	        return false; // Prevent location update.
	      } else {
	          window.history.replaceState(historyState, null, path);
	        }
	    }
	  }

	  var history = _createDOMHistory2['default'](_extends({}, options, {
	    getCurrentLocation: getCurrentLocation,
	    finishTransition: finishTransition,
	    saveState: _DOMStateStorage.saveState
	  }));

	  var listenerCount = 0,
	      stopPopStateListener = undefined;

	  function listenBefore(listener) {
	    if (++listenerCount === 1) stopPopStateListener = startPopStateListener(history);

	    var unlisten = history.listenBefore(listener);

	    return function () {
	      unlisten();

	      if (--listenerCount === 0) stopPopStateListener();
	    };
	  }

	  function listen(listener) {
	    if (++listenerCount === 1) stopPopStateListener = startPopStateListener(history);

	    var unlisten = history.listen(listener);

	    return function () {
	      unlisten();

	      if (--listenerCount === 0) stopPopStateListener();
	    };
	  }

	  // deprecated
	  function registerTransitionHook(hook) {
	    if (++listenerCount === 1) stopPopStateListener = startPopStateListener(history);

	    history.registerTransitionHook(hook);
	  }

	  // deprecated
	  function unregisterTransitionHook(hook) {
	    history.unregisterTransitionHook(hook);

	    if (--listenerCount === 0) stopPopStateListener();
	  }

	  return _extends({}, history, {
	    listenBefore: listenBefore,
	    listen: listen,
	    registerTransitionHook: registerTransitionHook,
	    unregisterTransitionHook: unregisterTransitionHook
	  });
	}

	exports['default'] = createBrowserHistory;
	module.exports = exports['default'];
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(283)))

/***/ },
/* 359 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 */

	'use strict';

	/**
	 * Use invariant() to assert state which your program assumes to be true.
	 *
	 * Provide sprintf-style format (only %s is supported) and arguments
	 * to provide information about what broke and what you were
	 * expecting.
	 *
	 * The invariant message will be stripped in production, but the invariant
	 * will remain to ensure logic does not differ in production.
	 */

	var invariant = function invariant(condition, format, a, b, c, d, e, f) {
	  if (process.env.NODE_ENV !== 'production') {
	    if (format === undefined) {
	      throw new Error('invariant requires an error message argument');
	    }
	  }

	  if (!condition) {
	    var error;
	    if (format === undefined) {
	      error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
	    } else {
	      var args = [a, b, c, d, e, f];
	      var argIndex = 0;
	      error = new Error(format.replace(/%s/g, function () {
	        return args[argIndex++];
	      }));
	      error.name = 'Invariant Violation';
	    }

	    error.framesToPop = 1; // we don't care about invariant's own frame
	    throw error;
	  }
	};

	module.exports = invariant;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(283)))

/***/ },
/* 360 */
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;
	var canUseDOM = !!(typeof window !== 'undefined' && window.document && window.document.createElement);
	exports.canUseDOM = canUseDOM;

/***/ },
/* 361 */
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;
	exports.addEventListener = addEventListener;
	exports.removeEventListener = removeEventListener;
	exports.getHashPath = getHashPath;
	exports.replaceHashPath = replaceHashPath;
	exports.getWindowPath = getWindowPath;
	exports.go = go;
	exports.getUserConfirmation = getUserConfirmation;
	exports.supportsHistory = supportsHistory;
	exports.supportsGoWithoutReloadUsingHash = supportsGoWithoutReloadUsingHash;

	function addEventListener(node, event, listener) {
	  if (node.addEventListener) {
	    node.addEventListener(event, listener, false);
	  } else {
	    node.attachEvent('on' + event, listener);
	  }
	}

	function removeEventListener(node, event, listener) {
	  if (node.removeEventListener) {
	    node.removeEventListener(event, listener, false);
	  } else {
	    node.detachEvent('on' + event, listener);
	  }
	}

	function getHashPath() {
	  // We can't use window.location.hash here because it's not
	  // consistent across browsers - Firefox will pre-decode it!
	  return window.location.href.split('#')[1] || '';
	}

	function replaceHashPath(path) {
	  window.location.replace(window.location.pathname + window.location.search + '#' + path);
	}

	function getWindowPath() {
	  return window.location.pathname + window.location.search + window.location.hash;
	}

	function go(n) {
	  if (n) window.history.go(n);
	}

	function getUserConfirmation(message, callback) {
	  callback(window.confirm(message));
	}

	/**
	 * Returns true if the HTML5 history API is supported. Taken from Modernizr.
	 *
	 * https://github.com/Modernizr/Modernizr/blob/master/LICENSE
	 * https://github.com/Modernizr/Modernizr/blob/master/feature-detects/history.js
	 * changed to avoid false negatives for Windows Phones: https://github.com/rackt/react-router/issues/586
	 */

	function supportsHistory() {
	  var ua = navigator.userAgent;
	  if ((ua.indexOf('Android 2.') !== -1 || ua.indexOf('Android 4.0') !== -1) && ua.indexOf('Mobile Safari') !== -1 && ua.indexOf('Chrome') === -1 && ua.indexOf('Windows Phone') === -1) {
	    return false;
	  }
	  // FIXME: Work around our browser history not working correctly on Chrome
	  // iOS: https://github.com/rackt/react-router/issues/2565
	  if (ua.indexOf('CriOS') !== -1) {
	    return false;
	  }
	  return window.history && 'pushState' in window.history;
	}

	/**
	 * Returns false if using go(n) with hash history causes a full page reload.
	 */

	function supportsGoWithoutReloadUsingHash() {
	  var ua = navigator.userAgent;
	  return ua.indexOf('Firefox') === -1;
	}

/***/ },
/* 362 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/*eslint-disable no-empty */
	'use strict';

	exports.__esModule = true;
	exports.saveState = saveState;
	exports.readState = readState;

	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { 'default': obj };
	}

	var _warning = __webpack_require__(356);

	var _warning2 = _interopRequireDefault(_warning);

	var KeyPrefix = '@@History/';
	var QuotaExceededError = 'QuotaExceededError';
	var SecurityError = 'SecurityError';

	function createKey(key) {
	  return KeyPrefix + key;
	}

	function saveState(key, state) {
	  try {
	    window.sessionStorage.setItem(createKey(key), JSON.stringify(state));
	  } catch (error) {
	    if (error.name === SecurityError) {
	      // Blocking cookies in Chrome/Firefox/Safari throws SecurityError on any
	      // attempt to access window.sessionStorage.
	      process.env.NODE_ENV !== 'production' ? _warning2['default'](false, '[history] Unable to save state; sessionStorage is not available due to security settings') : undefined;

	      return;
	    }

	    if (error.name === QuotaExceededError && window.sessionStorage.length === 0) {
	      // Safari "private mode" throws QuotaExceededError.
	      process.env.NODE_ENV !== 'production' ? _warning2['default'](false, '[history] Unable to save state; sessionStorage is not available in Safari private mode') : undefined;

	      return;
	    }

	    throw error;
	  }
	}

	function readState(key) {
	  var json = undefined;
	  try {
	    json = window.sessionStorage.getItem(createKey(key));
	  } catch (error) {
	    if (error.name === SecurityError) {
	      // Blocking cookies in Chrome/Firefox/Safari throws SecurityError on any
	      // attempt to access window.sessionStorage.
	      process.env.NODE_ENV !== 'production' ? _warning2['default'](false, '[history] Unable to read state; sessionStorage is not available due to security settings') : undefined;

	      return null;
	    }
	  }

	  if (json) {
	    try {
	      return JSON.parse(json);
	    } catch (error) {
	      // Ignore invalid JSON.
	    }
	  }

	  return null;
	}
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(283)))

/***/ },
/* 363 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	exports.__esModule = true;

	var _extends = Object.assign || function (target) {
	  for (var i = 1; i < arguments.length; i++) {
	    var source = arguments[i];for (var key in source) {
	      if (Object.prototype.hasOwnProperty.call(source, key)) {
	        target[key] = source[key];
	      }
	    }
	  }return target;
	};

	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { 'default': obj };
	}

	var _invariant = __webpack_require__(359);

	var _invariant2 = _interopRequireDefault(_invariant);

	var _ExecutionEnvironment = __webpack_require__(360);

	var _DOMUtils = __webpack_require__(361);

	var _createHistory = __webpack_require__(364);

	var _createHistory2 = _interopRequireDefault(_createHistory);

	function createDOMHistory(options) {
	  var history = _createHistory2['default'](_extends({
	    getUserConfirmation: _DOMUtils.getUserConfirmation
	  }, options, {
	    go: _DOMUtils.go
	  }));

	  function listen(listener) {
	    !_ExecutionEnvironment.canUseDOM ? process.env.NODE_ENV !== 'production' ? _invariant2['default'](false, 'DOM history needs a DOM') : _invariant2['default'](false) : undefined;

	    return history.listen(listener);
	  }

	  return _extends({}, history, {
	    listen: listen
	  });
	}

	exports['default'] = createDOMHistory;
	module.exports = exports['default'];
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(283)))

/***/ },
/* 364 */
/***/ function(module, exports, __webpack_require__) {

	//import warning from 'warning'
	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	exports.__esModule = true;

	var _extends = Object.assign || function (target) {
	  for (var i = 1; i < arguments.length; i++) {
	    var source = arguments[i];for (var key in source) {
	      if (Object.prototype.hasOwnProperty.call(source, key)) {
	        target[key] = source[key];
	      }
	    }
	  }return target;
	};

	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { 'default': obj };
	}

	var _deepEqual = __webpack_require__(365);

	var _deepEqual2 = _interopRequireDefault(_deepEqual);

	var _AsyncUtils = __webpack_require__(368);

	var _Actions = __webpack_require__(354);

	var _createLocation2 = __webpack_require__(353);

	var _createLocation3 = _interopRequireDefault(_createLocation2);

	var _runTransitionHook = __webpack_require__(369);

	var _runTransitionHook2 = _interopRequireDefault(_runTransitionHook);

	var _parsePath = __webpack_require__(355);

	var _parsePath2 = _interopRequireDefault(_parsePath);

	var _deprecate = __webpack_require__(352);

	var _deprecate2 = _interopRequireDefault(_deprecate);

	function createRandomKey(length) {
	  return Math.random().toString(36).substr(2, length);
	}

	function locationsAreEqual(a, b) {
	  return a.pathname === b.pathname && a.search === b.search &&
	  //a.action === b.action && // Different action !== location change.
	  a.key === b.key && _deepEqual2['default'](a.state, b.state);
	}

	var DefaultKeyLength = 6;

	function createHistory() {
	  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	  var getCurrentLocation = options.getCurrentLocation;
	  var finishTransition = options.finishTransition;
	  var saveState = options.saveState;
	  var go = options.go;
	  var keyLength = options.keyLength;
	  var getUserConfirmation = options.getUserConfirmation;

	  if (typeof keyLength !== 'number') keyLength = DefaultKeyLength;

	  var transitionHooks = [];

	  function listenBefore(hook) {
	    transitionHooks.push(hook);

	    return function () {
	      transitionHooks = transitionHooks.filter(function (item) {
	        return item !== hook;
	      });
	    };
	  }

	  var allKeys = [];
	  var changeListeners = [];
	  var location = undefined;

	  function getCurrent() {
	    if (pendingLocation && pendingLocation.action === _Actions.POP) {
	      return allKeys.indexOf(pendingLocation.key);
	    } else if (location) {
	      return allKeys.indexOf(location.key);
	    } else {
	      return -1;
	    }
	  }

	  function updateLocation(newLocation) {
	    var current = getCurrent();

	    location = newLocation;

	    if (location.action === _Actions.PUSH) {
	      allKeys = [].concat(allKeys.slice(0, current + 1), [location.key]);
	    } else if (location.action === _Actions.REPLACE) {
	      allKeys[current] = location.key;
	    }

	    changeListeners.forEach(function (listener) {
	      listener(location);
	    });
	  }

	  function listen(listener) {
	    changeListeners.push(listener);

	    if (location) {
	      listener(location);
	    } else {
	      var _location = getCurrentLocation();
	      allKeys = [_location.key];
	      updateLocation(_location);
	    }

	    return function () {
	      changeListeners = changeListeners.filter(function (item) {
	        return item !== listener;
	      });
	    };
	  }

	  function confirmTransitionTo(location, callback) {
	    _AsyncUtils.loopAsync(transitionHooks.length, function (index, next, done) {
	      _runTransitionHook2['default'](transitionHooks[index], location, function (result) {
	        if (result != null) {
	          done(result);
	        } else {
	          next();
	        }
	      });
	    }, function (message) {
	      if (getUserConfirmation && typeof message === 'string') {
	        getUserConfirmation(message, function (ok) {
	          callback(ok !== false);
	        });
	      } else {
	        callback(message !== false);
	      }
	    });
	  }

	  var pendingLocation = undefined;

	  function transitionTo(nextLocation) {
	    if (location && locationsAreEqual(location, nextLocation)) return; // Nothing to do.

	    pendingLocation = nextLocation;

	    confirmTransitionTo(nextLocation, function (ok) {
	      if (pendingLocation !== nextLocation) return; // Transition was interrupted.

	      if (ok) {
	        // treat PUSH to current path like REPLACE to be consistent with browsers
	        if (nextLocation.action === _Actions.PUSH) {
	          var prevPath = createPath(location);
	          var nextPath = createPath(nextLocation);

	          if (nextPath === prevPath) nextLocation.action = _Actions.REPLACE;
	        }

	        if (finishTransition(nextLocation) !== false) updateLocation(nextLocation);
	      } else if (location && nextLocation.action === _Actions.POP) {
	        var prevIndex = allKeys.indexOf(location.key);
	        var nextIndex = allKeys.indexOf(nextLocation.key);

	        if (prevIndex !== -1 && nextIndex !== -1) go(prevIndex - nextIndex); // Restore the URL.
	      }
	    });
	  }

	  function push(location) {
	    transitionTo(createLocation(location, _Actions.PUSH, createKey()));
	  }

	  function replace(location) {
	    transitionTo(createLocation(location, _Actions.REPLACE, createKey()));
	  }

	  function goBack() {
	    go(-1);
	  }

	  function goForward() {
	    go(1);
	  }

	  function createKey() {
	    return createRandomKey(keyLength);
	  }

	  function createPath(location) {
	    if (location == null || typeof location === 'string') return location;

	    var pathname = location.pathname;
	    var search = location.search;
	    var hash = location.hash;

	    var result = pathname;

	    if (search) result += search;

	    if (hash) result += hash;

	    return result;
	  }

	  function createHref(location) {
	    return createPath(location);
	  }

	  function createLocation(location, action) {
	    var key = arguments.length <= 2 || arguments[2] === undefined ? createKey() : arguments[2];

	    if ((typeof action === 'undefined' ? 'undefined' : _typeof(action)) === 'object') {
	      //warning(
	      //  false,
	      //  'The state (2nd) argument to history.createLocation is deprecated; use a ' +
	      //  'location descriptor instead'
	      //)

	      if (typeof location === 'string') location = _parsePath2['default'](location);

	      location = _extends({}, location, { state: action });

	      action = key;
	      key = arguments[3] || createKey();
	    }

	    return _createLocation3['default'](location, action, key);
	  }

	  // deprecated
	  function setState(state) {
	    if (location) {
	      updateLocationState(location, state);
	      updateLocation(location);
	    } else {
	      updateLocationState(getCurrentLocation(), state);
	    }
	  }

	  function updateLocationState(location, state) {
	    location.state = _extends({}, location.state, state);
	    saveState(location.key, location.state);
	  }

	  // deprecated
	  function registerTransitionHook(hook) {
	    if (transitionHooks.indexOf(hook) === -1) transitionHooks.push(hook);
	  }

	  // deprecated
	  function unregisterTransitionHook(hook) {
	    transitionHooks = transitionHooks.filter(function (item) {
	      return item !== hook;
	    });
	  }

	  // deprecated
	  function pushState(state, path) {
	    if (typeof path === 'string') path = _parsePath2['default'](path);

	    push(_extends({ state: state }, path));
	  }

	  // deprecated
	  function replaceState(state, path) {
	    if (typeof path === 'string') path = _parsePath2['default'](path);

	    replace(_extends({ state: state }, path));
	  }

	  return {
	    listenBefore: listenBefore,
	    listen: listen,
	    transitionTo: transitionTo,
	    push: push,
	    replace: replace,
	    go: go,
	    goBack: goBack,
	    goForward: goForward,
	    createKey: createKey,
	    createPath: createPath,
	    createHref: createHref,
	    createLocation: createLocation,

	    setState: _deprecate2['default'](setState, 'setState is deprecated; use location.key to save state instead'),
	    registerTransitionHook: _deprecate2['default'](registerTransitionHook, 'registerTransitionHook is deprecated; use listenBefore instead'),
	    unregisterTransitionHook: _deprecate2['default'](unregisterTransitionHook, 'unregisterTransitionHook is deprecated; use the callback returned from listenBefore instead'),
	    pushState: _deprecate2['default'](pushState, 'pushState is deprecated; use push instead'),
	    replaceState: _deprecate2['default'](replaceState, 'replaceState is deprecated; use replace instead')
	  };
	}

	exports['default'] = createHistory;
	module.exports = exports['default'];

/***/ },
/* 365 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	var pSlice = Array.prototype.slice;
	var objectKeys = __webpack_require__(366);
	var isArguments = __webpack_require__(367);

	var deepEqual = module.exports = function (actual, expected, opts) {
	  if (!opts) opts = {};
	  // 7.1. All identical values are equivalent, as determined by ===.
	  if (actual === expected) {
	    return true;
	  } else if (actual instanceof Date && expected instanceof Date) {
	    return actual.getTime() === expected.getTime();

	    // 7.3. Other pairs that do not both pass typeof value == 'object',
	    // equivalence is determined by ==.
	  } else if (!actual || !expected || (typeof actual === 'undefined' ? 'undefined' : _typeof(actual)) != 'object' && (typeof expected === 'undefined' ? 'undefined' : _typeof(expected)) != 'object') {
	      return opts.strict ? actual === expected : actual == expected;

	      // 7.4. For all other Object pairs, including Array objects, equivalence is
	      // determined by having the same number of owned properties (as verified
	      // with Object.prototype.hasOwnProperty.call), the same set of keys
	      // (although not necessarily the same order), equivalent values for every
	      // corresponding key, and an identical 'prototype' property. Note: this
	      // accounts for both named and indexed properties on Arrays.
	    } else {
	        return objEquiv(actual, expected, opts);
	      }
	};

	function isUndefinedOrNull(value) {
	  return value === null || value === undefined;
	}

	function isBuffer(x) {
	  if (!x || (typeof x === 'undefined' ? 'undefined' : _typeof(x)) !== 'object' || typeof x.length !== 'number') return false;
	  if (typeof x.copy !== 'function' || typeof x.slice !== 'function') {
	    return false;
	  }
	  if (x.length > 0 && typeof x[0] !== 'number') return false;
	  return true;
	}

	function objEquiv(a, b, opts) {
	  var i, key;
	  if (isUndefinedOrNull(a) || isUndefinedOrNull(b)) return false;
	  // an identical 'prototype' property.
	  if (a.prototype !== b.prototype) return false;
	  //~~~I've managed to break Object.keys through screwy arguments passing.
	  //   Converting to array solves the problem.
	  if (isArguments(a)) {
	    if (!isArguments(b)) {
	      return false;
	    }
	    a = pSlice.call(a);
	    b = pSlice.call(b);
	    return deepEqual(a, b, opts);
	  }
	  if (isBuffer(a)) {
	    if (!isBuffer(b)) {
	      return false;
	    }
	    if (a.length !== b.length) return false;
	    for (i = 0; i < a.length; i++) {
	      if (a[i] !== b[i]) return false;
	    }
	    return true;
	  }
	  try {
	    var ka = objectKeys(a),
	        kb = objectKeys(b);
	  } catch (e) {
	    //happens when one is a string literal and the other isn't
	    return false;
	  }
	  // having the same number of owned properties (keys incorporates
	  // hasOwnProperty)
	  if (ka.length != kb.length) return false;
	  //the same set of keys (although not necessarily the same order),
	  ka.sort();
	  kb.sort();
	  //~~~cheap key test
	  for (i = ka.length - 1; i >= 0; i--) {
	    if (ka[i] != kb[i]) return false;
	  }
	  //equivalent values for every corresponding key, and
	  //~~~possibly expensive deep test
	  for (i = ka.length - 1; i >= 0; i--) {
	    key = ka[i];
	    if (!deepEqual(a[key], b[key], opts)) return false;
	  }
	  return (typeof a === 'undefined' ? 'undefined' : _typeof(a)) === (typeof b === 'undefined' ? 'undefined' : _typeof(b));
	}

/***/ },
/* 366 */
/***/ function(module, exports) {

	'use strict';

	exports = module.exports = typeof Object.keys === 'function' ? Object.keys : shim;

	exports.shim = shim;
	function shim(obj) {
	  var keys = [];
	  for (var key in obj) {
	    keys.push(key);
	  }return keys;
	}

/***/ },
/* 367 */
/***/ function(module, exports) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	var supportsArgumentsClass = function () {
	  return Object.prototype.toString.call(arguments);
	}() == '[object Arguments]';

	exports = module.exports = supportsArgumentsClass ? supported : unsupported;

	exports.supported = supported;
	function supported(object) {
	  return Object.prototype.toString.call(object) == '[object Arguments]';
	};

	exports.unsupported = unsupported;
	function unsupported(object) {
	  return object && (typeof object === 'undefined' ? 'undefined' : _typeof(object)) == 'object' && typeof object.length == 'number' && Object.prototype.hasOwnProperty.call(object, 'callee') && !Object.prototype.propertyIsEnumerable.call(object, 'callee') || false;
	};

/***/ },
/* 368 */
/***/ function(module, exports) {

	"use strict";

	exports.__esModule = true;
	exports.loopAsync = loopAsync;

	function loopAsync(turns, work, callback) {
	  var currentTurn = 0;
	  var isDone = false;

	  function done() {
	    isDone = true;
	    callback.apply(this, arguments);
	  }

	  function next() {
	    if (isDone) return;

	    if (currentTurn < turns) {
	      work.call(this, currentTurn++, next, done);
	    } else {
	      done.apply(this, arguments);
	    }
	  }

	  next();
	}

/***/ },
/* 369 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	exports.__esModule = true;

	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { 'default': obj };
	}

	var _warning = __webpack_require__(356);

	var _warning2 = _interopRequireDefault(_warning);

	function runTransitionHook(hook, location, callback) {
	  var result = hook(location, callback);

	  if (hook.length < 2) {
	    // Assume the hook runs synchronously and automatically
	    // call the callback with the return value.
	    callback(result);
	  } else {
	    process.env.NODE_ENV !== 'production' ? _warning2['default'](result === undefined, 'You should not "return" in a transition hook with a callback argument; call the callback instead') : undefined;
	  }
	}

	exports['default'] = runTransitionHook;
	module.exports = exports['default'];
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(283)))

/***/ },
/* 370 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	exports.__esModule = true;

	var _extends = Object.assign || function (target) {
	  for (var i = 1; i < arguments.length; i++) {
	    var source = arguments[i];for (var key in source) {
	      if (Object.prototype.hasOwnProperty.call(source, key)) {
	        target[key] = source[key];
	      }
	    }
	  }return target;
	};

	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { 'default': obj };
	}

	var _warning = __webpack_require__(356);

	var _warning2 = _interopRequireDefault(_warning);

	var _invariant = __webpack_require__(359);

	var _invariant2 = _interopRequireDefault(_invariant);

	var _Actions = __webpack_require__(354);

	var _ExecutionEnvironment = __webpack_require__(360);

	var _DOMUtils = __webpack_require__(361);

	var _DOMStateStorage = __webpack_require__(362);

	var _createDOMHistory = __webpack_require__(363);

	var _createDOMHistory2 = _interopRequireDefault(_createDOMHistory);

	var _parsePath = __webpack_require__(355);

	var _parsePath2 = _interopRequireDefault(_parsePath);

	function isAbsolutePath(path) {
	  return typeof path === 'string' && path.charAt(0) === '/';
	}

	function ensureSlash() {
	  var path = _DOMUtils.getHashPath();

	  if (isAbsolutePath(path)) return true;

	  _DOMUtils.replaceHashPath('/' + path);

	  return false;
	}

	function addQueryStringValueToPath(path, key, value) {
	  return path + (path.indexOf('?') === -1 ? '?' : '&') + (key + '=' + value);
	}

	function stripQueryStringValueFromPath(path, key) {
	  return path.replace(new RegExp('[?&]?' + key + '=[a-zA-Z0-9]+'), '');
	}

	function getQueryStringValueFromPath(path, key) {
	  var match = path.match(new RegExp('\\?.*?\\b' + key + '=(.+?)\\b'));
	  return match && match[1];
	}

	var DefaultQueryKey = '_k';

	function createHashHistory() {
	  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	  !_ExecutionEnvironment.canUseDOM ? process.env.NODE_ENV !== 'production' ? _invariant2['default'](false, 'Hash history needs a DOM') : _invariant2['default'](false) : undefined;

	  var queryKey = options.queryKey;

	  if (queryKey === undefined || !!queryKey) queryKey = typeof queryKey === 'string' ? queryKey : DefaultQueryKey;

	  function getCurrentLocation() {
	    var path = _DOMUtils.getHashPath();

	    var key = undefined,
	        state = undefined;
	    if (queryKey) {
	      key = getQueryStringValueFromPath(path, queryKey);
	      path = stripQueryStringValueFromPath(path, queryKey);

	      if (key) {
	        state = _DOMStateStorage.readState(key);
	      } else {
	        state = null;
	        key = history.createKey();
	        _DOMUtils.replaceHashPath(addQueryStringValueToPath(path, queryKey, key));
	      }
	    } else {
	      key = state = null;
	    }

	    var location = _parsePath2['default'](path);

	    return history.createLocation(_extends({}, location, { state: state }), undefined, key);
	  }

	  function startHashChangeListener(_ref) {
	    var transitionTo = _ref.transitionTo;

	    function hashChangeListener() {
	      if (!ensureSlash()) return; // Always make sure hashes are preceeded with a /.

	      transitionTo(getCurrentLocation());
	    }

	    ensureSlash();
	    _DOMUtils.addEventListener(window, 'hashchange', hashChangeListener);

	    return function () {
	      _DOMUtils.removeEventListener(window, 'hashchange', hashChangeListener);
	    };
	  }

	  function finishTransition(location) {
	    var basename = location.basename;
	    var pathname = location.pathname;
	    var search = location.search;
	    var state = location.state;
	    var action = location.action;
	    var key = location.key;

	    if (action === _Actions.POP) return; // Nothing to do.

	    var path = (basename || '') + pathname + search;

	    if (queryKey) {
	      path = addQueryStringValueToPath(path, queryKey, key);
	      _DOMStateStorage.saveState(key, state);
	    } else {
	      // Drop key and state.
	      location.key = location.state = null;
	    }

	    var currentHash = _DOMUtils.getHashPath();

	    if (action === _Actions.PUSH) {
	      if (currentHash !== path) {
	        window.location.hash = path;
	      } else {
	        process.env.NODE_ENV !== 'production' ? _warning2['default'](false, 'You cannot PUSH the same path using hash history') : undefined;
	      }
	    } else if (currentHash !== path) {
	      // REPLACE
	      _DOMUtils.replaceHashPath(path);
	    }
	  }

	  var history = _createDOMHistory2['default'](_extends({}, options, {
	    getCurrentLocation: getCurrentLocation,
	    finishTransition: finishTransition,
	    saveState: _DOMStateStorage.saveState
	  }));

	  var listenerCount = 0,
	      stopHashChangeListener = undefined;

	  function listenBefore(listener) {
	    if (++listenerCount === 1) stopHashChangeListener = startHashChangeListener(history);

	    var unlisten = history.listenBefore(listener);

	    return function () {
	      unlisten();

	      if (--listenerCount === 0) stopHashChangeListener();
	    };
	  }

	  function listen(listener) {
	    if (++listenerCount === 1) stopHashChangeListener = startHashChangeListener(history);

	    var unlisten = history.listen(listener);

	    return function () {
	      unlisten();

	      if (--listenerCount === 0) stopHashChangeListener();
	    };
	  }

	  function push(location) {
	    process.env.NODE_ENV !== 'production' ? _warning2['default'](queryKey || location.state == null, 'You cannot use state without a queryKey it will be dropped') : undefined;

	    history.push(location);
	  }

	  function replace(location) {
	    process.env.NODE_ENV !== 'production' ? _warning2['default'](queryKey || location.state == null, 'You cannot use state without a queryKey it will be dropped') : undefined;

	    history.replace(location);
	  }

	  var goIsSupportedWithoutReload = _DOMUtils.supportsGoWithoutReloadUsingHash();

	  function go(n) {
	    process.env.NODE_ENV !== 'production' ? _warning2['default'](goIsSupportedWithoutReload, 'Hash history go(n) causes a full page reload in this browser') : undefined;

	    history.go(n);
	  }

	  function createHref(path) {
	    return '#' + history.createHref(path);
	  }

	  // deprecated
	  function registerTransitionHook(hook) {
	    if (++listenerCount === 1) stopHashChangeListener = startHashChangeListener(history);

	    history.registerTransitionHook(hook);
	  }

	  // deprecated
	  function unregisterTransitionHook(hook) {
	    history.unregisterTransitionHook(hook);

	    if (--listenerCount === 0) stopHashChangeListener();
	  }

	  // deprecated
	  function pushState(state, path) {
	    process.env.NODE_ENV !== 'production' ? _warning2['default'](queryKey || state == null, 'You cannot use state without a queryKey it will be dropped') : undefined;

	    history.pushState(state, path);
	  }

	  // deprecated
	  function replaceState(state, path) {
	    process.env.NODE_ENV !== 'production' ? _warning2['default'](queryKey || state == null, 'You cannot use state without a queryKey it will be dropped') : undefined;

	    history.replaceState(state, path);
	  }

	  return _extends({}, history, {
	    listenBefore: listenBefore,
	    listen: listen,
	    push: push,
	    replace: replace,
	    go: go,
	    createHref: createHref,

	    registerTransitionHook: registerTransitionHook, // deprecated - warning is in createHistory
	    unregisterTransitionHook: unregisterTransitionHook, // deprecated - warning is in createHistory
	    pushState: pushState, // deprecated - warning is in createHistory
	    replaceState: replaceState // deprecated - warning is in createHistory
	  });
	}

	exports['default'] = createHashHistory;
	module.exports = exports['default'];
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(283)))

/***/ },
/* 371 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	exports.__esModule = true;

	var _extends = Object.assign || function (target) {
	  for (var i = 1; i < arguments.length; i++) {
	    var source = arguments[i];for (var key in source) {
	      if (Object.prototype.hasOwnProperty.call(source, key)) {
	        target[key] = source[key];
	      }
	    }
	  }return target;
	};

	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { 'default': obj };
	}

	var _warning = __webpack_require__(356);

	var _warning2 = _interopRequireDefault(_warning);

	var _invariant = __webpack_require__(359);

	var _invariant2 = _interopRequireDefault(_invariant);

	var _Actions = __webpack_require__(354);

	var _createHistory = __webpack_require__(364);

	var _createHistory2 = _interopRequireDefault(_createHistory);

	var _parsePath = __webpack_require__(355);

	var _parsePath2 = _interopRequireDefault(_parsePath);

	function createStateStorage(entries) {
	  return entries.filter(function (entry) {
	    return entry.state;
	  }).reduce(function (memo, entry) {
	    memo[entry.key] = entry.state;
	    return memo;
	  }, {});
	}

	function createMemoryHistory() {
	  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	  if (Array.isArray(options)) {
	    options = { entries: options };
	  } else if (typeof options === 'string') {
	    options = { entries: [options] };
	  }

	  var history = _createHistory2['default'](_extends({}, options, {
	    getCurrentLocation: getCurrentLocation,
	    finishTransition: finishTransition,
	    saveState: saveState,
	    go: go
	  }));

	  var _options = options;
	  var entries = _options.entries;
	  var current = _options.current;

	  if (typeof entries === 'string') {
	    entries = [entries];
	  } else if (!Array.isArray(entries)) {
	    entries = ['/'];
	  }

	  entries = entries.map(function (entry) {
	    var key = history.createKey();

	    if (typeof entry === 'string') return { pathname: entry, key: key };

	    if ((typeof entry === 'undefined' ? 'undefined' : _typeof(entry)) === 'object' && entry) return _extends({}, entry, { key: key });

	     true ? process.env.NODE_ENV !== 'production' ? _invariant2['default'](false, 'Unable to create history entry from %s', entry) : _invariant2['default'](false) : undefined;
	  });

	  if (current == null) {
	    current = entries.length - 1;
	  } else {
	    !(current >= 0 && current < entries.length) ? process.env.NODE_ENV !== 'production' ? _invariant2['default'](false, 'Current index must be >= 0 and < %s, was %s', entries.length, current) : _invariant2['default'](false) : undefined;
	  }

	  var storage = createStateStorage(entries);

	  function saveState(key, state) {
	    storage[key] = state;
	  }

	  function readState(key) {
	    return storage[key];
	  }

	  function getCurrentLocation() {
	    var entry = entries[current];
	    var key = entry.key;
	    var basename = entry.basename;
	    var pathname = entry.pathname;
	    var search = entry.search;

	    var path = (basename || '') + pathname + (search || '');

	    var state = undefined;
	    if (key) {
	      state = readState(key);
	    } else {
	      state = null;
	      key = history.createKey();
	      entry.key = key;
	    }

	    var location = _parsePath2['default'](path);

	    return history.createLocation(_extends({}, location, { state: state }), undefined, key);
	  }

	  function canGo(n) {
	    var index = current + n;
	    return index >= 0 && index < entries.length;
	  }

	  function go(n) {
	    if (n) {
	      if (!canGo(n)) {
	        process.env.NODE_ENV !== 'production' ? _warning2['default'](false, 'Cannot go(%s) there is not enough history', n) : undefined;
	        return;
	      }

	      current += n;

	      var currentLocation = getCurrentLocation();

	      // change action to POP
	      history.transitionTo(_extends({}, currentLocation, { action: _Actions.POP }));
	    }
	  }

	  function finishTransition(location) {
	    switch (location.action) {
	      case _Actions.PUSH:
	        current += 1;

	        // if we are not on the top of stack
	        // remove rest and push new
	        if (current < entries.length) entries.splice(current);

	        entries.push(location);
	        saveState(location.key, location.state);
	        break;
	      case _Actions.REPLACE:
	        entries[current] = location;
	        saveState(location.key, location.state);
	        break;
	    }
	  }

	  return history;
	}

	exports['default'] = createMemoryHistory;
	module.exports = exports['default'];
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(283)))

/***/ },
/* 372 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _extends = Object.assign || function (target) {
	  for (var i = 1; i < arguments.length; i++) {
	    var source = arguments[i];for (var key in source) {
	      if (Object.prototype.hasOwnProperty.call(source, key)) {
	        target[key] = source[key];
	      }
	    }
	  }return target;
	};

	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { 'default': obj };
	}

	function _objectWithoutProperties(obj, keys) {
	  var target = {};for (var i in obj) {
	    if (keys.indexOf(i) >= 0) continue;if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;target[i] = obj[i];
	  }return target;
	}

	var _ExecutionEnvironment = __webpack_require__(360);

	var _runTransitionHook = __webpack_require__(369);

	var _runTransitionHook2 = _interopRequireDefault(_runTransitionHook);

	var _extractPath = __webpack_require__(357);

	var _extractPath2 = _interopRequireDefault(_extractPath);

	var _parsePath = __webpack_require__(355);

	var _parsePath2 = _interopRequireDefault(_parsePath);

	var _deprecate = __webpack_require__(352);

	var _deprecate2 = _interopRequireDefault(_deprecate);

	function useBasename(createHistory) {
	  return function () {
	    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	    var basename = options.basename;

	    var historyOptions = _objectWithoutProperties(options, ['basename']);

	    var history = createHistory(historyOptions);

	    // Automatically use the value of <base href> in HTML
	    // documents as basename if it's not explicitly given.
	    if (basename == null && _ExecutionEnvironment.canUseDOM) {
	      var base = document.getElementsByTagName('base')[0];

	      if (base) basename = _extractPath2['default'](base.href);
	    }

	    function addBasename(location) {
	      if (basename && location.basename == null) {
	        if (location.pathname.indexOf(basename) === 0) {
	          location.pathname = location.pathname.substring(basename.length);
	          location.basename = basename;

	          if (location.pathname === '') location.pathname = '/';
	        } else {
	          location.basename = '';
	        }
	      }

	      return location;
	    }

	    function prependBasename(location) {
	      if (!basename) return location;

	      if (typeof location === 'string') location = _parsePath2['default'](location);

	      var pname = location.pathname;
	      var normalizedBasename = basename.slice(-1) === '/' ? basename : basename + '/';
	      var normalizedPathname = pname.charAt(0) === '/' ? pname.slice(1) : pname;
	      var pathname = normalizedBasename + normalizedPathname;

	      return _extends({}, location, {
	        pathname: pathname
	      });
	    }

	    // Override all read methods with basename-aware versions.
	    function listenBefore(hook) {
	      return history.listenBefore(function (location, callback) {
	        _runTransitionHook2['default'](hook, addBasename(location), callback);
	      });
	    }

	    function listen(listener) {
	      return history.listen(function (location) {
	        listener(addBasename(location));
	      });
	    }

	    // Override all write methods with basename-aware versions.
	    function push(location) {
	      history.push(prependBasename(location));
	    }

	    function replace(location) {
	      history.replace(prependBasename(location));
	    }

	    function createPath(location) {
	      return history.createPath(prependBasename(location));
	    }

	    function createHref(location) {
	      return history.createHref(prependBasename(location));
	    }

	    function createLocation() {
	      return addBasename(history.createLocation.apply(history, arguments));
	    }

	    // deprecated
	    function pushState(state, path) {
	      if (typeof path === 'string') path = _parsePath2['default'](path);

	      push(_extends({ state: state }, path));
	    }

	    // deprecated
	    function replaceState(state, path) {
	      if (typeof path === 'string') path = _parsePath2['default'](path);

	      replace(_extends({ state: state }, path));
	    }

	    return _extends({}, history, {
	      listenBefore: listenBefore,
	      listen: listen,
	      push: push,
	      replace: replace,
	      createPath: createPath,
	      createHref: createHref,
	      createLocation: createLocation,

	      pushState: _deprecate2['default'](pushState, 'pushState is deprecated; use push instead'),
	      replaceState: _deprecate2['default'](replaceState, 'replaceState is deprecated; use replace instead')
	    });
	  };
	}

	exports['default'] = useBasename;
	module.exports = exports['default'];

/***/ },
/* 373 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	exports.__esModule = true;

	var _extends = Object.assign || function (target) {
	  for (var i = 1; i < arguments.length; i++) {
	    var source = arguments[i];for (var key in source) {
	      if (Object.prototype.hasOwnProperty.call(source, key)) {
	        target[key] = source[key];
	      }
	    }
	  }return target;
	};

	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { 'default': obj };
	}

	var _warning = __webpack_require__(356);

	var _warning2 = _interopRequireDefault(_warning);

	var _ExecutionEnvironment = __webpack_require__(360);

	var _DOMUtils = __webpack_require__(361);

	var _deprecate = __webpack_require__(352);

	var _deprecate2 = _interopRequireDefault(_deprecate);

	function startBeforeUnloadListener(getBeforeUnloadPromptMessage) {
	  function listener(event) {
	    var message = getBeforeUnloadPromptMessage();

	    if (typeof message === 'string') {
	      (event || window.event).returnValue = message;
	      return message;
	    }
	  }

	  _DOMUtils.addEventListener(window, 'beforeunload', listener);

	  return function () {
	    _DOMUtils.removeEventListener(window, 'beforeunload', listener);
	  };
	}

	/**
	 * Returns a new createHistory function that can be used to create
	 * history objects that know how to use the beforeunload event in web
	 * browsers to cancel navigation.
	 */
	function useBeforeUnload(createHistory) {
	  return function (options) {
	    var history = createHistory(options);

	    var stopBeforeUnloadListener = undefined;
	    var beforeUnloadHooks = [];

	    function getBeforeUnloadPromptMessage() {
	      var message = undefined;

	      for (var i = 0, len = beforeUnloadHooks.length; message == null && i < len; ++i) {
	        message = beforeUnloadHooks[i].call();
	      }return message;
	    }

	    function listenBeforeUnload(hook) {
	      beforeUnloadHooks.push(hook);

	      if (beforeUnloadHooks.length === 1) {
	        if (_ExecutionEnvironment.canUseDOM) {
	          stopBeforeUnloadListener = startBeforeUnloadListener(getBeforeUnloadPromptMessage);
	        } else {
	          process.env.NODE_ENV !== 'production' ? _warning2['default'](false, 'listenBeforeUnload only works in DOM environments') : undefined;
	        }
	      }

	      return function () {
	        beforeUnloadHooks = beforeUnloadHooks.filter(function (item) {
	          return item !== hook;
	        });

	        if (beforeUnloadHooks.length === 0 && stopBeforeUnloadListener) {
	          stopBeforeUnloadListener();
	          stopBeforeUnloadListener = null;
	        }
	      };
	    }

	    // deprecated
	    function registerBeforeUnloadHook(hook) {
	      if (_ExecutionEnvironment.canUseDOM && beforeUnloadHooks.indexOf(hook) === -1) {
	        beforeUnloadHooks.push(hook);

	        if (beforeUnloadHooks.length === 1) stopBeforeUnloadListener = startBeforeUnloadListener(getBeforeUnloadPromptMessage);
	      }
	    }

	    // deprecated
	    function unregisterBeforeUnloadHook(hook) {
	      if (beforeUnloadHooks.length > 0) {
	        beforeUnloadHooks = beforeUnloadHooks.filter(function (item) {
	          return item !== hook;
	        });

	        if (beforeUnloadHooks.length === 0) stopBeforeUnloadListener();
	      }
	    }

	    return _extends({}, history, {
	      listenBeforeUnload: listenBeforeUnload,

	      registerBeforeUnloadHook: _deprecate2['default'](registerBeforeUnloadHook, 'registerBeforeUnloadHook is deprecated; use listenBeforeUnload instead'),
	      unregisterBeforeUnloadHook: _deprecate2['default'](unregisterBeforeUnloadHook, 'unregisterBeforeUnloadHook is deprecated; use the callback returned from listenBeforeUnload instead')
	    });
	  };
	}

	exports['default'] = useBeforeUnload;
	module.exports = exports['default'];
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(283)))

/***/ },
/* 374 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	exports.__esModule = true;

	var _extends = Object.assign || function (target) {
	  for (var i = 1; i < arguments.length; i++) {
	    var source = arguments[i];for (var key in source) {
	      if (Object.prototype.hasOwnProperty.call(source, key)) {
	        target[key] = source[key];
	      }
	    }
	  }return target;
	};

	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { 'default': obj };
	}

	function _objectWithoutProperties(obj, keys) {
	  var target = {};for (var i in obj) {
	    if (keys.indexOf(i) >= 0) continue;if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;target[i] = obj[i];
	  }return target;
	}

	var _warning = __webpack_require__(356);

	var _warning2 = _interopRequireDefault(_warning);

	var _queryString = __webpack_require__(375);

	var _runTransitionHook = __webpack_require__(369);

	var _runTransitionHook2 = _interopRequireDefault(_runTransitionHook);

	var _parsePath = __webpack_require__(355);

	var _parsePath2 = _interopRequireDefault(_parsePath);

	var _deprecate = __webpack_require__(352);

	var _deprecate2 = _interopRequireDefault(_deprecate);

	var SEARCH_BASE_KEY = '$searchBase';

	function defaultStringifyQuery(query) {
	  return _queryString.stringify(query).replace(/%20/g, '+');
	}

	var defaultParseQueryString = _queryString.parse;

	function isNestedObject(object) {
	  for (var p in object) {
	    if (object.hasOwnProperty(p) && _typeof(object[p]) === 'object' && !Array.isArray(object[p]) && object[p] !== null) return true;
	  }return false;
	}

	/**
	 * Returns a new createHistory function that may be used to create
	 * history objects that know how to handle URL queries.
	 */
	function useQueries(createHistory) {
	  return function () {
	    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	    var stringifyQuery = options.stringifyQuery;
	    var parseQueryString = options.parseQueryString;

	    var historyOptions = _objectWithoutProperties(options, ['stringifyQuery', 'parseQueryString']);

	    var history = createHistory(historyOptions);

	    if (typeof stringifyQuery !== 'function') stringifyQuery = defaultStringifyQuery;

	    if (typeof parseQueryString !== 'function') parseQueryString = defaultParseQueryString;

	    function addQuery(location) {
	      if (location.query == null) {
	        var search = location.search;

	        location.query = parseQueryString(search.substring(1));
	        location[SEARCH_BASE_KEY] = { search: search, searchBase: '' };
	      }

	      // TODO: Instead of all the book-keeping here, this should just strip the
	      // stringified query from the search.

	      return location;
	    }

	    function appendQuery(location, query) {
	      var _extends2;

	      var queryString = undefined;
	      if (!query || (queryString = stringifyQuery(query)) === '') return location;

	      process.env.NODE_ENV !== 'production' ? _warning2['default'](stringifyQuery !== defaultStringifyQuery || !isNestedObject(query), 'useQueries does not stringify nested query objects by default; ' + 'use a custom stringifyQuery function') : undefined;

	      if (typeof location === 'string') location = _parsePath2['default'](location);

	      var searchBaseSpec = location[SEARCH_BASE_KEY];
	      var searchBase = undefined;
	      if (searchBaseSpec && location.search === searchBaseSpec.search) {
	        searchBase = searchBaseSpec.searchBase;
	      } else {
	        searchBase = location.search || '';
	      }

	      var search = searchBase + (searchBase ? '&' : '?') + queryString;

	      return _extends({}, location, (_extends2 = {
	        search: search
	      }, _extends2[SEARCH_BASE_KEY] = { search: search, searchBase: searchBase }, _extends2));
	    }

	    // Override all read methods with query-aware versions.
	    function listenBefore(hook) {
	      return history.listenBefore(function (location, callback) {
	        _runTransitionHook2['default'](hook, addQuery(location), callback);
	      });
	    }

	    function listen(listener) {
	      return history.listen(function (location) {
	        listener(addQuery(location));
	      });
	    }

	    // Override all write methods with query-aware versions.
	    function push(location) {
	      history.push(appendQuery(location, location.query));
	    }

	    function replace(location) {
	      history.replace(appendQuery(location, location.query));
	    }

	    function createPath(location, query) {
	      //warning(
	      //  !query,
	      //  'the query argument to createPath is deprecated; use a location descriptor instead'
	      //)
	      return history.createPath(appendQuery(location, query || location.query));
	    }

	    function createHref(location, query) {
	      //warning(
	      //  !query,
	      //  'the query argument to createHref is deprecated; use a location descriptor instead'
	      //)
	      return history.createHref(appendQuery(location, query || location.query));
	    }

	    function createLocation() {
	      return addQuery(history.createLocation.apply(history, arguments));
	    }

	    // deprecated
	    function pushState(state, path, query) {
	      if (typeof path === 'string') path = _parsePath2['default'](path);

	      push(_extends({ state: state }, path, { query: query }));
	    }

	    // deprecated
	    function replaceState(state, path, query) {
	      if (typeof path === 'string') path = _parsePath2['default'](path);

	      replace(_extends({ state: state }, path, { query: query }));
	    }

	    return _extends({}, history, {
	      listenBefore: listenBefore,
	      listen: listen,
	      push: push,
	      replace: replace,
	      createPath: createPath,
	      createHref: createHref,
	      createLocation: createLocation,

	      pushState: _deprecate2['default'](pushState, 'pushState is deprecated; use push instead'),
	      replaceState: _deprecate2['default'](replaceState, 'replaceState is deprecated; use replace instead')
	    });
	  };
	}

	exports['default'] = useQueries;
	module.exports = exports['default'];
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(283)))

/***/ },
/* 375 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var strictUriEncode = __webpack_require__(376);

	exports.extract = function (str) {
		return str.split('?')[1] || '';
	};

	exports.parse = function (str) {
		if (typeof str !== 'string') {
			return {};
		}

		str = str.trim().replace(/^(\?|#|&)/, '');

		if (!str) {
			return {};
		}

		return str.split('&').reduce(function (ret, param) {
			var parts = param.replace(/\+/g, ' ').split('=');
			// Firefox (pre 40) decodes `%3D` to `=`
			// https://github.com/sindresorhus/query-string/pull/37
			var key = parts.shift();
			var val = parts.length > 0 ? parts.join('=') : undefined;

			key = decodeURIComponent(key);

			// missing `=` should be `null`:
			// http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
			val = val === undefined ? null : decodeURIComponent(val);

			if (!ret.hasOwnProperty(key)) {
				ret[key] = val;
			} else if (Array.isArray(ret[key])) {
				ret[key].push(val);
			} else {
				ret[key] = [ret[key], val];
			}

			return ret;
		}, {});
	};

	exports.stringify = function (obj) {
		return obj ? Object.keys(obj).sort().map(function (key) {
			var val = obj[key];

			if (val === undefined) {
				return '';
			}

			if (val === null) {
				return key;
			}

			if (Array.isArray(val)) {
				return val.slice().sort().map(function (val2) {
					return strictUriEncode(key) + '=' + strictUriEncode(val2);
				}).join('&');
			}

			return strictUriEncode(key) + '=' + strictUriEncode(val);
		}).filter(function (x) {
			return x.length > 0;
		}).join('&') : '';
	};

/***/ },
/* 376 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function (str) {
		return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
			return '%' + c.charCodeAt(0).toString(16).toUpperCase();
		});
	};

/***/ },
/* 377 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { 'default': obj };
	}

	var _deprecate = __webpack_require__(352);

	var _deprecate2 = _interopRequireDefault(_deprecate);

	var _useBeforeUnload = __webpack_require__(373);

	var _useBeforeUnload2 = _interopRequireDefault(_useBeforeUnload);

	exports['default'] = _deprecate2['default'](_useBeforeUnload2['default'], 'enableBeforeUnload is deprecated, use useBeforeUnload instead');
	module.exports = exports['default'];

/***/ },
/* 378 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { 'default': obj };
	}

	var _deprecate = __webpack_require__(352);

	var _deprecate2 = _interopRequireDefault(_deprecate);

	var _useQueries = __webpack_require__(374);

	var _useQueries2 = _interopRequireDefault(_useQueries);

	exports['default'] = _deprecate2['default'](_useQueries2['default'], 'enableQueries is deprecated, use useQueries instead');
	module.exports = exports['default'];

/***/ },
/* 379 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _typeof2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
	  return typeof obj === "undefined" ? "undefined" : _typeof2(obj);
	} : function (obj) {
	  return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof2(obj);
	};

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.makePushState = exports.makeHistory = undefined;

	var _history = __webpack_require__(351);

	function supportsHistory() {
	  var ua = navigator.userAgent;

	  if ((ua.indexOf('Android 2.') !== -1 || ua.indexOf('Android 4.0') !== -1) && ua.indexOf('Mobile Safari') !== -1 && ua.indexOf('Chrome') === -1 && ua.indexOf('Windows Phone') === -1) {
	    {
	      return false;
	    }
	  }

	  // Return the regular check
	  return window.history && 'pushState' in window.history;
	}

	function makeHistory(hash, options) {
	  var useHash = hash || !supportsHistory();
	  return useHash ? (0, _history.useQueries)((0, _history.useBasename)(_history.createHashHistory))(options) : (0, _history.useQueries)((0, _history.useBasename)(_history.createHistory))(options);
	}

	function makePushState(history) {
	  return function pushState(url) {
	    if ('string' === typeof url || 'object' === (typeof url === 'undefined' ? 'undefined' : _typeof(url))) {
	      history.push(url);
	    } else {
	      throw new Error('Router Driver input must be a string or\n        object but received ' + (typeof url === 'undefined' ? 'undefined' : _typeof(url)));
	    }
	  };
	}

	exports.makeHistory = makeHistory;
	exports.makePushState = makePushState;

/***/ },
/* 380 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.FeedRouter = undefined;

	var _rx = __webpack_require__(287);

	var _entries = __webpack_require__(289);

	var _dom = __webpack_require__(290);

	var _api = __webpack_require__(386);

	var FeedRouter = exports.FeedRouter = function FeedRouter(sources) {
	    var entriesRoot = sources.router.path("/entries");

	    var user$ = entriesRoot.define({
	        "/user/:user": function userUser(user) {
	            return user;
	        }
	    }).map(function (_ref) {
	        var value = _ref.value;
	        return {
	            "url": _api.ApiBase + '/ex-list-filter?user=' + value + '&page=1',
	            "category": "feed"
	        };
	    });

	    var latest$ = entriesRoot.define({
	        "/": "latest"
	    }).doAction(function (e) {
	        return console.log("latest", e);
	    }).map(function (_ref2) {
	        var value = _ref2.value;
	        return {
	            "url": _api.ApiBase + '/ex-list-all/1',
	            "category": "feed"
	        };
	    });

	    var responses$ = sources.HTTP.filter(function (res) {
	        return res.request.category === "feed";
	    }).flatMap(function (x) {
	        return x;
	    }).map(function (res) {
	        return res.body.results;
	    });

	    responses$.subscribe(function (e) {
	        console.log("resp", e);
	    });

	    var vtree$ = (0, _entries.Entries)({ entries$: responses$, sources: sources }).DOM;

	    var pages$ = sources.DOM.select(".pageLink").events('click').map(function (e) {
	        return e.target.dataset["target"];
	    });

	    return {
	        HTTP: latest$,
	        //        HTTP: user$.merge(latest$).doAction(u => console.log("url", u)),
	        DOM: vtree$,
	        router: pages$.startWith("entries/")
	    };
	};

/***/ },
/* 381 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _require = __webpack_require__(382);

	var makeHTTPDriver = _require.makeHTTPDriver;

	var CycleHTTPDriver = {
	  /**
	   * HTTP Driver factory.
	   *
	   * This is a function which, when called, returns a HTTP Driver for Cycle.js
	   * apps. The driver is also a function, and it takes an Observable of requests
	   * as input, and generates a metastream of responses.
	   *
	   * **Requests**. The Observable of requests should emit either strings or
	   * objects. If the Observable emits strings, those should be the URL of the
	   * remote resource over HTTP. If the Observable emits objects, these should be
	   * instructions how superagent should execute the request. These objects
	   * follow a structure similar to superagent's request API itself.
	   * `request` object properties:
	   *
	   * - `url` *(String)*: the remote resource path. **required**
	   * - `method` *(String)*: HTTP Method for the request (GET, POST, PUT, etc).
	   * - `query` *(Object)*: an object with the payload for `GET` or `POST`.
	   * - `send` *(Object)*: an object with the payload for `POST`.
	   * - `headers` *(Object)*: object specifying HTTP headers.
	   * - `accept` *(String)*: the Accept header.
	   * - `type` *(String)*: a short-hand for setting Content-Type.
	   * - `user` *(String)*: username for authentication.
	   * - `password` *(String)*: password for authentication.
	   * - `field` *(Object)*: object where key/values are Form fields.
	   * - `progress` *(Boolean)*: whether or not to detect and emit progress events
	   *   on the response Observable.
	   * - `attach` *(Array)*: array of objects, where each object specifies `name`,
	   * `path`, and `filename` of a resource to upload.
	   * - `withCredentials` *(Boolean)*: enables the ability to send cookies from
	   * the origin.
	   * - `redirects` *(Number)*: number of redirects to follow.
	   * - `eager` *(Boolean)*: whether or not to execute the request regardless of
	   *   usage of its corresponding response. By default the eager setting of the
	   *   driver is used (whose default is `false`, i.e. the request is lazy).
	   *   Explicitely setting eager in the request always overrides the driver
	   *   setting. Main use case is: set this option to `true` if you send POST
	   *   requests and you are not interested in its response.
	   *
	   * **Responses**. A metastream is an Observable of Observables. The response
	   * metastream emits Observables of responses. These Observables of responses
	   * have a `request` field attached to them (to the Observable object itself)
	   * indicating which request (from the driver input) generated this response
	   * Observable. The response Observables themselves emit the response object
	   * received through superagent.
	   *
	   * @param {Object} options an object with settings options that apply globally
	   * for all requests processed by the returned HTTP Driver function. The
	   * options are:
	   * - `eager` *(Boolean)*: execute the HTTP eagerly, even if its
	   *   response Observable is not subscribed to. Default: **false**.
	   *   Can be overridden in the request.
	   * @return {Function} the HTTP Driver function
	   * @function makeHTTPDriver
	   */
	  makeHTTPDriver: makeHTTPDriver
	};

	module.exports = CycleHTTPDriver;

/***/ },
/* 382 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	var Rx = __webpack_require__(287);
	var superagent = __webpack_require__(383);

	function optionsToSuperagent(_ref) {
	  var url = _ref.url;
	  var _ref$send = _ref.send;
	  var send = _ref$send === undefined ? null : _ref$send;
	  var _ref$accept = _ref.accept;
	  var accept = _ref$accept === undefined ? null : _ref$accept;
	  var _ref$query = _ref.query;
	  var query = _ref$query === undefined ? null : _ref$query;
	  var _ref$user = _ref.user;
	  var user = _ref$user === undefined ? null : _ref$user;
	  var _ref$password = _ref.password;
	  var password = _ref$password === undefined ? null : _ref$password;
	  var _ref$field = _ref.field;
	  var field = _ref$field === undefined ? null : _ref$field;
	  var _ref$attach = _ref.attach;
	  var attach = _ref$attach === undefined ? null : _ref$attach;
	  var _ref$withCredentials = _ref.withCredentials;
	  var // if valid, should be an array
	  withCredentials = _ref$withCredentials === undefined ? false : _ref$withCredentials;
	  var _ref$headers = _ref.headers;
	  var headers = _ref$headers === undefined ? {} : _ref$headers;
	  var _ref$redirects = _ref.redirects;
	  var redirects = _ref$redirects === undefined ? 5 : _ref$redirects;
	  var _ref$type = _ref.type;
	  var type = _ref$type === undefined ? "json" : _ref$type;
	  var _ref$method = _ref.method;
	  var method = _ref$method === undefined ? "get" : _ref$method;

	  if (typeof url !== "string") {
	    throw new Error("Please provide a `url` property in the request options.");
	  }
	  var lowerCaseMethod = method.toLowerCase();
	  var sanitizedMethod = lowerCaseMethod === "delete" ? "del" : lowerCaseMethod;

	  var request = superagent[sanitizedMethod](url);
	  if (typeof request.redirects === "function") {
	    request = request.redirects(redirects);
	  }
	  request = request.type(type);
	  if (send !== null) {
	    request = request.send(send);
	  }
	  if (accept !== null) {
	    request = request.accept(accept);
	  }
	  if (query !== null) {
	    request = request.query(query);
	  }
	  if (withCredentials) {
	    request = request.withCredentials();
	  }
	  if (user !== null && password !== null) {
	    request = request.auth(user, password);
	  }
	  for (var key in headers) {
	    if (headers.hasOwnProperty(key)) {
	      request = request.set(key, headers[key]);
	    }
	  }
	  if (field !== null) {
	    for (var key in field) {
	      if (field.hasOwnProperty(key)) {
	        request = request.field(key, field[key]);
	      }
	    }
	  }
	  if (attach !== null) {
	    for (var i = attach.length - 1; i >= 0; i--) {
	      var a = attach[i];
	      request = request.attach(a.name, a.path, a.filename);
	    }
	  }
	  return request;
	}

	function createResponse$(reqOptions) {
	  return Rx.Observable.create(function (observer) {
	    var request = optionsToSuperagent(reqOptions);

	    try {
	      if (reqOptions.progress) {
	        request = request.on("progress", function (res) {
	          res.request = reqOptions;
	          observer.onNext(res);
	        });
	      }
	      request.end(function (err, res) {
	        if (err) {
	          observer.onError(err);
	        } else {
	          res.request = reqOptions;
	          observer.onNext(res);
	          observer.onCompleted();
	        }
	      });
	    } catch (err) {
	      observer.onError(err);
	    }

	    return function onDispose() {
	      request.abort();
	    };
	  });
	}

	function normalizeRequestOptions(reqOptions) {
	  if (typeof reqOptions === "string") {
	    return { url: reqOptions };
	  } else if ((typeof reqOptions === "undefined" ? "undefined" : _typeof(reqOptions)) === "object") {
	    return reqOptions;
	  } else {
	    throw new Error("Observable of requests given to HTTP Driver must emit " + "either URL strings or objects with parameters.");
	  }
	}

	function isolateSink(request$, scope) {
	  return request$.map(function (req) {
	    if (typeof req === "string") {
	      return { url: req, _namespace: [scope] };
	    }
	    req._namespace = req._namespace || [];
	    req._namespace.push(scope);
	    return req;
	  });
	}

	function isolateSource(response$$, scope) {
	  var isolatedResponse$$ = response$$.filter(function (res$) {
	    return Array.isArray(res$.request._namespace) && res$.request._namespace.indexOf(scope) !== -1;
	  });
	  isolatedResponse$$.isolateSource = isolateSource;
	  isolatedResponse$$.isolateSink = isolateSink;
	  return isolatedResponse$$;
	}

	function makeHTTPDriver() {
	  var _ref2 = arguments.length <= 0 || arguments[0] === undefined ? { eager: false } : arguments[0];

	  var _ref2$eager = _ref2.eager;
	  var eager = _ref2$eager === undefined ? false : _ref2$eager;

	  return function httpDriver(request$) {
	    var response$$ = request$.map(function (request) {
	      var reqOptions = normalizeRequestOptions(request);
	      var response$ = createResponse$(reqOptions);
	      if (typeof reqOptions.eager === "boolean" ? reqOptions.eager : eager) {
	        response$ = response$.replay(null, 1);
	        response$.connect();
	      }
	      response$.request = reqOptions;
	      return response$;
	    }).replay(null, 1);
	    response$$.connect();
	    response$$.isolateSource = isolateSource;
	    response$$.isolateSink = isolateSink;
	    return response$$;
	  };
	}

	module.exports = {
	  optionsToSuperagent: optionsToSuperagent,
	  createResponse$: createResponse$,

	  makeHTTPDriver: makeHTTPDriver
	};

/***/ },
/* 383 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * Module dependencies.
	 */

	var Emitter = __webpack_require__(384);
	var reduce = __webpack_require__(385);

	/**
	 * Root reference for iframes.
	 */

	var root;
	if (typeof window !== 'undefined') {
	  // Browser window
	  root = window;
	} else if (typeof self !== 'undefined') {
	  // Web Worker
	  root = self;
	} else {
	  // Other environments
	  root = undefined;
	}

	/**
	 * Noop.
	 */

	function noop() {};

	/**
	 * Check if `obj` is a host object,
	 * we don't want to serialize these :)
	 *
	 * TODO: future proof, move to compoent land
	 *
	 * @param {Object} obj
	 * @return {Boolean}
	 * @api private
	 */

	function isHost(obj) {
	  var str = {}.toString.call(obj);

	  switch (str) {
	    case '[object File]':
	    case '[object Blob]':
	    case '[object FormData]':
	      return true;
	    default:
	      return false;
	  }
	}

	/**
	 * Determine XHR.
	 */

	request.getXHR = function () {
	  if (root.XMLHttpRequest && (!root.location || 'file:' != root.location.protocol || !root.ActiveXObject)) {
	    return new XMLHttpRequest();
	  } else {
	    try {
	      return new ActiveXObject('Microsoft.XMLHTTP');
	    } catch (e) {}
	    try {
	      return new ActiveXObject('Msxml2.XMLHTTP.6.0');
	    } catch (e) {}
	    try {
	      return new ActiveXObject('Msxml2.XMLHTTP.3.0');
	    } catch (e) {}
	    try {
	      return new ActiveXObject('Msxml2.XMLHTTP');
	    } catch (e) {}
	  }
	  return false;
	};

	/**
	 * Removes leading and trailing whitespace, added to support IE.
	 *
	 * @param {String} s
	 * @return {String}
	 * @api private
	 */

	var trim = ''.trim ? function (s) {
	  return s.trim();
	} : function (s) {
	  return s.replace(/(^\s*|\s*$)/g, '');
	};

	/**
	 * Check if `obj` is an object.
	 *
	 * @param {Object} obj
	 * @return {Boolean}
	 * @api private
	 */

	function isObject(obj) {
	  return obj === Object(obj);
	}

	/**
	 * Serialize the given `obj`.
	 *
	 * @param {Object} obj
	 * @return {String}
	 * @api private
	 */

	function serialize(obj) {
	  if (!isObject(obj)) return obj;
	  var pairs = [];
	  for (var key in obj) {
	    if (null != obj[key]) {
	      pushEncodedKeyValuePair(pairs, key, obj[key]);
	    }
	  }
	  return pairs.join('&');
	}

	/**
	 * Helps 'serialize' with serializing arrays.
	 * Mutates the pairs array.
	 *
	 * @param {Array} pairs
	 * @param {String} key
	 * @param {Mixed} val
	 */

	function pushEncodedKeyValuePair(pairs, key, val) {
	  if (Array.isArray(val)) {
	    return val.forEach(function (v) {
	      pushEncodedKeyValuePair(pairs, key, v);
	    });
	  }
	  pairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(val));
	}

	/**
	 * Expose serialization method.
	 */

	request.serializeObject = serialize;

	/**
	 * Parse the given x-www-form-urlencoded `str`.
	 *
	 * @param {String} str
	 * @return {Object}
	 * @api private
	 */

	function parseString(str) {
	  var obj = {};
	  var pairs = str.split('&');
	  var parts;
	  var pair;

	  for (var i = 0, len = pairs.length; i < len; ++i) {
	    pair = pairs[i];
	    parts = pair.split('=');
	    obj[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1]);
	  }

	  return obj;
	}

	/**
	 * Expose parser.
	 */

	request.parseString = parseString;

	/**
	 * Default MIME type map.
	 *
	 *     superagent.types.xml = 'application/xml';
	 *
	 */

	request.types = {
	  html: 'text/html',
	  json: 'application/json',
	  xml: 'application/xml',
	  urlencoded: 'application/x-www-form-urlencoded',
	  'form': 'application/x-www-form-urlencoded',
	  'form-data': 'application/x-www-form-urlencoded'
	};

	/**
	 * Default serialization map.
	 *
	 *     superagent.serialize['application/xml'] = function(obj){
	 *       return 'generated xml here';
	 *     };
	 *
	 */

	request.serialize = {
	  'application/x-www-form-urlencoded': serialize,
	  'application/json': JSON.stringify
	};

	/**
	 * Default parsers.
	 *
	 *     superagent.parse['application/xml'] = function(str){
	 *       return { object parsed from str };
	 *     };
	 *
	 */

	request.parse = {
	  'application/x-www-form-urlencoded': parseString,
	  'application/json': JSON.parse
	};

	/**
	 * Parse the given header `str` into
	 * an object containing the mapped fields.
	 *
	 * @param {String} str
	 * @return {Object}
	 * @api private
	 */

	function parseHeader(str) {
	  var lines = str.split(/\r?\n/);
	  var fields = {};
	  var index;
	  var line;
	  var field;
	  var val;

	  lines.pop(); // trailing CRLF

	  for (var i = 0, len = lines.length; i < len; ++i) {
	    line = lines[i];
	    index = line.indexOf(':');
	    field = line.slice(0, index).toLowerCase();
	    val = trim(line.slice(index + 1));
	    fields[field] = val;
	  }

	  return fields;
	}

	/**
	 * Check if `mime` is json or has +json structured syntax suffix.
	 *
	 * @param {String} mime
	 * @return {Boolean}
	 * @api private
	 */

	function isJSON(mime) {
	  return (/[\/+]json\b/.test(mime)
	  );
	}

	/**
	 * Return the mime type for the given `str`.
	 *
	 * @param {String} str
	 * @return {String}
	 * @api private
	 */

	function type(str) {
	  return str.split(/ *; */).shift();
	};

	/**
	 * Return header field parameters.
	 *
	 * @param {String} str
	 * @return {Object}
	 * @api private
	 */

	function params(str) {
	  return reduce(str.split(/ *; */), function (obj, str) {
	    var parts = str.split(/ *= */),
	        key = parts.shift(),
	        val = parts.shift();

	    if (key && val) obj[key] = val;
	    return obj;
	  }, {});
	};

	/**
	 * Initialize a new `Response` with the given `xhr`.
	 *
	 *  - set flags (.ok, .error, etc)
	 *  - parse header
	 *
	 * Examples:
	 *
	 *  Aliasing `superagent` as `request` is nice:
	 *
	 *      request = superagent;
	 *
	 *  We can use the promise-like API, or pass callbacks:
	 *
	 *      request.get('/').end(function(res){});
	 *      request.get('/', function(res){});
	 *
	 *  Sending data can be chained:
	 *
	 *      request
	 *        .post('/user')
	 *        .send({ name: 'tj' })
	 *        .end(function(res){});
	 *
	 *  Or passed to `.send()`:
	 *
	 *      request
	 *        .post('/user')
	 *        .send({ name: 'tj' }, function(res){});
	 *
	 *  Or passed to `.post()`:
	 *
	 *      request
	 *        .post('/user', { name: 'tj' })
	 *        .end(function(res){});
	 *
	 * Or further reduced to a single call for simple cases:
	 *
	 *      request
	 *        .post('/user', { name: 'tj' }, function(res){});
	 *
	 * @param {XMLHTTPRequest} xhr
	 * @param {Object} options
	 * @api private
	 */

	function Response(req, options) {
	  options = options || {};
	  this.req = req;
	  this.xhr = this.req.xhr;
	  // responseText is accessible only if responseType is '' or 'text' and on older browsers
	  this.text = this.req.method != 'HEAD' && (this.xhr.responseType === '' || this.xhr.responseType === 'text') || typeof this.xhr.responseType === 'undefined' ? this.xhr.responseText : null;
	  this.statusText = this.req.xhr.statusText;
	  this.setStatusProperties(this.xhr.status);
	  this.header = this.headers = parseHeader(this.xhr.getAllResponseHeaders());
	  // getAllResponseHeaders sometimes falsely returns "" for CORS requests, but
	  // getResponseHeader still works. so we get content-type even if getting
	  // other headers fails.
	  this.header['content-type'] = this.xhr.getResponseHeader('content-type');
	  this.setHeaderProperties(this.header);
	  this.body = this.req.method != 'HEAD' ? this.parseBody(this.text ? this.text : this.xhr.response) : null;
	}

	/**
	 * Get case-insensitive `field` value.
	 *
	 * @param {String} field
	 * @return {String}
	 * @api public
	 */

	Response.prototype.get = function (field) {
	  return this.header[field.toLowerCase()];
	};

	/**
	 * Set header related properties:
	 *
	 *   - `.type` the content type without params
	 *
	 * A response of "Content-Type: text/plain; charset=utf-8"
	 * will provide you with a `.type` of "text/plain".
	 *
	 * @param {Object} header
	 * @api private
	 */

	Response.prototype.setHeaderProperties = function (header) {
	  // content-type
	  var ct = this.header['content-type'] || '';
	  this.type = type(ct);

	  // params
	  var obj = params(ct);
	  for (var key in obj) {
	    this[key] = obj[key];
	  }
	};

	/**
	 * Parse the given body `str`.
	 *
	 * Used for auto-parsing of bodies. Parsers
	 * are defined on the `superagent.parse` object.
	 *
	 * @param {String} str
	 * @return {Mixed}
	 * @api private
	 */

	Response.prototype.parseBody = function (str) {
	  var parse = request.parse[this.type];
	  return parse && str && (str.length || str instanceof Object) ? parse(str) : null;
	};

	/**
	 * Set flags such as `.ok` based on `status`.
	 *
	 * For example a 2xx response will give you a `.ok` of __true__
	 * whereas 5xx will be __false__ and `.error` will be __true__. The
	 * `.clientError` and `.serverError` are also available to be more
	 * specific, and `.statusType` is the class of error ranging from 1..5
	 * sometimes useful for mapping respond colors etc.
	 *
	 * "sugar" properties are also defined for common cases. Currently providing:
	 *
	 *   - .noContent
	 *   - .badRequest
	 *   - .unauthorized
	 *   - .notAcceptable
	 *   - .notFound
	 *
	 * @param {Number} status
	 * @api private
	 */

	Response.prototype.setStatusProperties = function (status) {
	  // handle IE9 bug: http://stackoverflow.com/questions/10046972/msie-returns-status-code-of-1223-for-ajax-request
	  if (status === 1223) {
	    status = 204;
	  }

	  var type = status / 100 | 0;

	  // status / class
	  this.status = this.statusCode = status;
	  this.statusType = type;

	  // basics
	  this.info = 1 == type;
	  this.ok = 2 == type;
	  this.clientError = 4 == type;
	  this.serverError = 5 == type;
	  this.error = 4 == type || 5 == type ? this.toError() : false;

	  // sugar
	  this.accepted = 202 == status;
	  this.noContent = 204 == status;
	  this.badRequest = 400 == status;
	  this.unauthorized = 401 == status;
	  this.notAcceptable = 406 == status;
	  this.notFound = 404 == status;
	  this.forbidden = 403 == status;
	};

	/**
	 * Return an `Error` representative of this response.
	 *
	 * @return {Error}
	 * @api public
	 */

	Response.prototype.toError = function () {
	  var req = this.req;
	  var method = req.method;
	  var url = req.url;

	  var msg = 'cannot ' + method + ' ' + url + ' (' + this.status + ')';
	  var err = new Error(msg);
	  err.status = this.status;
	  err.method = method;
	  err.url = url;

	  return err;
	};

	/**
	 * Expose `Response`.
	 */

	request.Response = Response;

	/**
	 * Initialize a new `Request` with the given `method` and `url`.
	 *
	 * @param {String} method
	 * @param {String} url
	 * @api public
	 */

	function Request(method, url) {
	  var self = this;
	  Emitter.call(this);
	  this._query = this._query || [];
	  this.method = method;
	  this.url = url;
	  this.header = {};
	  this._header = {};
	  this.on('end', function () {
	    var err = null;
	    var res = null;

	    try {
	      res = new Response(self);
	    } catch (e) {
	      err = new Error('Parser is unable to parse the response');
	      err.parse = true;
	      err.original = e;
	      // issue #675: return the raw response if the response parsing fails
	      err.rawResponse = self.xhr && self.xhr.responseText ? self.xhr.responseText : null;
	      return self.callback(err);
	    }

	    self.emit('response', res);

	    if (err) {
	      return self.callback(err, res);
	    }

	    if (res.status >= 200 && res.status < 300) {
	      return self.callback(err, res);
	    }

	    var new_err = new Error(res.statusText || 'Unsuccessful HTTP response');
	    new_err.original = err;
	    new_err.response = res;
	    new_err.status = res.status;

	    self.callback(new_err, res);
	  });
	}

	/**
	 * Mixin `Emitter`.
	 */

	Emitter(Request.prototype);

	/**
	 * Allow for extension
	 */

	Request.prototype.use = function (fn) {
	  fn(this);
	  return this;
	};

	/**
	 * Set timeout to `ms`.
	 *
	 * @param {Number} ms
	 * @return {Request} for chaining
	 * @api public
	 */

	Request.prototype.timeout = function (ms) {
	  this._timeout = ms;
	  return this;
	};

	/**
	 * Clear previous timeout.
	 *
	 * @return {Request} for chaining
	 * @api public
	 */

	Request.prototype.clearTimeout = function () {
	  this._timeout = 0;
	  clearTimeout(this._timer);
	  return this;
	};

	/**
	 * Abort the request, and clear potential timeout.
	 *
	 * @return {Request}
	 * @api public
	 */

	Request.prototype.abort = function () {
	  if (this.aborted) return;
	  this.aborted = true;
	  this.xhr.abort();
	  this.clearTimeout();
	  this.emit('abort');
	  return this;
	};

	/**
	 * Set header `field` to `val`, or multiple fields with one object.
	 *
	 * Examples:
	 *
	 *      req.get('/')
	 *        .set('Accept', 'application/json')
	 *        .set('X-API-Key', 'foobar')
	 *        .end(callback);
	 *
	 *      req.get('/')
	 *        .set({ Accept: 'application/json', 'X-API-Key': 'foobar' })
	 *        .end(callback);
	 *
	 * @param {String|Object} field
	 * @param {String} val
	 * @return {Request} for chaining
	 * @api public
	 */

	Request.prototype.set = function (field, val) {
	  if (isObject(field)) {
	    for (var key in field) {
	      this.set(key, field[key]);
	    }
	    return this;
	  }
	  this._header[field.toLowerCase()] = val;
	  this.header[field] = val;
	  return this;
	};

	/**
	 * Remove header `field`.
	 *
	 * Example:
	 *
	 *      req.get('/')
	 *        .unset('User-Agent')
	 *        .end(callback);
	 *
	 * @param {String} field
	 * @return {Request} for chaining
	 * @api public
	 */

	Request.prototype.unset = function (field) {
	  delete this._header[field.toLowerCase()];
	  delete this.header[field];
	  return this;
	};

	/**
	 * Get case-insensitive header `field` value.
	 *
	 * @param {String} field
	 * @return {String}
	 * @api private
	 */

	Request.prototype.getHeader = function (field) {
	  return this._header[field.toLowerCase()];
	};

	/**
	 * Set Content-Type to `type`, mapping values from `request.types`.
	 *
	 * Examples:
	 *
	 *      superagent.types.xml = 'application/xml';
	 *
	 *      request.post('/')
	 *        .type('xml')
	 *        .send(xmlstring)
	 *        .end(callback);
	 *
	 *      request.post('/')
	 *        .type('application/xml')
	 *        .send(xmlstring)
	 *        .end(callback);
	 *
	 * @param {String} type
	 * @return {Request} for chaining
	 * @api public
	 */

	Request.prototype.type = function (type) {
	  this.set('Content-Type', request.types[type] || type);
	  return this;
	};

	/**
	 * Force given parser
	 *
	 * Sets the body parser no matter type.
	 *
	 * @param {Function}
	 * @api public
	 */

	Request.prototype.parse = function (fn) {
	  this._parser = fn;
	  return this;
	};

	/**
	 * Set Accept to `type`, mapping values from `request.types`.
	 *
	 * Examples:
	 *
	 *      superagent.types.json = 'application/json';
	 *
	 *      request.get('/agent')
	 *        .accept('json')
	 *        .end(callback);
	 *
	 *      request.get('/agent')
	 *        .accept('application/json')
	 *        .end(callback);
	 *
	 * @param {String} accept
	 * @return {Request} for chaining
	 * @api public
	 */

	Request.prototype.accept = function (type) {
	  this.set('Accept', request.types[type] || type);
	  return this;
	};

	/**
	 * Set Authorization field value with `user` and `pass`.
	 *
	 * @param {String} user
	 * @param {String} pass
	 * @return {Request} for chaining
	 * @api public
	 */

	Request.prototype.auth = function (user, pass) {
	  var str = btoa(user + ':' + pass);
	  this.set('Authorization', 'Basic ' + str);
	  return this;
	};

	/**
	* Add query-string `val`.
	*
	* Examples:
	*
	*   request.get('/shoes')
	*     .query('size=10')
	*     .query({ color: 'blue' })
	*
	* @param {Object|String} val
	* @return {Request} for chaining
	* @api public
	*/

	Request.prototype.query = function (val) {
	  if ('string' != typeof val) val = serialize(val);
	  if (val) this._query.push(val);
	  return this;
	};

	/**
	 * Write the field `name` and `val` for "multipart/form-data"
	 * request bodies.
	 *
	 * ``` js
	 * request.post('/upload')
	 *   .field('foo', 'bar')
	 *   .end(callback);
	 * ```
	 *
	 * @param {String} name
	 * @param {String|Blob|File} val
	 * @return {Request} for chaining
	 * @api public
	 */

	Request.prototype.field = function (name, val) {
	  if (!this._formData) this._formData = new root.FormData();
	  this._formData.append(name, val);
	  return this;
	};

	/**
	 * Queue the given `file` as an attachment to the specified `field`,
	 * with optional `filename`.
	 *
	 * ``` js
	 * request.post('/upload')
	 *   .attach(new Blob(['<a id="a"><b id="b">hey!</b></a>'], { type: "text/html"}))
	 *   .end(callback);
	 * ```
	 *
	 * @param {String} field
	 * @param {Blob|File} file
	 * @param {String} filename
	 * @return {Request} for chaining
	 * @api public
	 */

	Request.prototype.attach = function (field, file, filename) {
	  if (!this._formData) this._formData = new root.FormData();
	  this._formData.append(field, file, filename || file.name);
	  return this;
	};

	/**
	 * Send `data` as the request body, defaulting the `.type()` to "json" when
	 * an object is given.
	 *
	 * Examples:
	 *
	 *       // manual json
	 *       request.post('/user')
	 *         .type('json')
	 *         .send('{"name":"tj"}')
	 *         .end(callback)
	 *
	 *       // auto json
	 *       request.post('/user')
	 *         .send({ name: 'tj' })
	 *         .end(callback)
	 *
	 *       // manual x-www-form-urlencoded
	 *       request.post('/user')
	 *         .type('form')
	 *         .send('name=tj')
	 *         .end(callback)
	 *
	 *       // auto x-www-form-urlencoded
	 *       request.post('/user')
	 *         .type('form')
	 *         .send({ name: 'tj' })
	 *         .end(callback)
	 *
	 *       // defaults to x-www-form-urlencoded
	  *      request.post('/user')
	  *        .send('name=tobi')
	  *        .send('species=ferret')
	  *        .end(callback)
	 *
	 * @param {String|Object} data
	 * @return {Request} for chaining
	 * @api public
	 */

	Request.prototype.send = function (data) {
	  var obj = isObject(data);
	  var type = this.getHeader('Content-Type');

	  // merge
	  if (obj && isObject(this._data)) {
	    for (var key in data) {
	      this._data[key] = data[key];
	    }
	  } else if ('string' == typeof data) {
	    if (!type) this.type('form');
	    type = this.getHeader('Content-Type');
	    if ('application/x-www-form-urlencoded' == type) {
	      this._data = this._data ? this._data + '&' + data : data;
	    } else {
	      this._data = (this._data || '') + data;
	    }
	  } else {
	    this._data = data;
	  }

	  if (!obj || isHost(data)) return this;
	  if (!type) this.type('json');
	  return this;
	};

	/**
	 * Invoke the callback with `err` and `res`
	 * and handle arity check.
	 *
	 * @param {Error} err
	 * @param {Response} res
	 * @api private
	 */

	Request.prototype.callback = function (err, res) {
	  var fn = this._callback;
	  this.clearTimeout();
	  fn(err, res);
	};

	/**
	 * Invoke callback with x-domain error.
	 *
	 * @api private
	 */

	Request.prototype.crossDomainError = function () {
	  var err = new Error('Request has been terminated\nPossible causes: the network is offline, Origin is not allowed by Access-Control-Allow-Origin, the page is being unloaded, etc.');
	  err.crossDomain = true;

	  err.status = this.status;
	  err.method = this.method;
	  err.url = this.url;

	  this.callback(err);
	};

	/**
	 * Invoke callback with timeout error.
	 *
	 * @api private
	 */

	Request.prototype.timeoutError = function () {
	  var timeout = this._timeout;
	  var err = new Error('timeout of ' + timeout + 'ms exceeded');
	  err.timeout = timeout;
	  this.callback(err);
	};

	/**
	 * Enable transmission of cookies with x-domain requests.
	 *
	 * Note that for this to work the origin must not be
	 * using "Access-Control-Allow-Origin" with a wildcard,
	 * and also must set "Access-Control-Allow-Credentials"
	 * to "true".
	 *
	 * @api public
	 */

	Request.prototype.withCredentials = function () {
	  this._withCredentials = true;
	  return this;
	};

	/**
	 * Initiate request, invoking callback `fn(res)`
	 * with an instanceof `Response`.
	 *
	 * @param {Function} fn
	 * @return {Request} for chaining
	 * @api public
	 */

	Request.prototype.end = function (fn) {
	  var self = this;
	  var xhr = this.xhr = request.getXHR();
	  var query = this._query.join('&');
	  var timeout = this._timeout;
	  var data = this._formData || this._data;

	  // store callback
	  this._callback = fn || noop;

	  // state change
	  xhr.onreadystatechange = function () {
	    if (4 != xhr.readyState) return;

	    // In IE9, reads to any property (e.g. status) off of an aborted XHR will
	    // result in the error "Could not complete the operation due to error c00c023f"
	    var status;
	    try {
	      status = xhr.status;
	    } catch (e) {
	      status = 0;
	    }

	    if (0 == status) {
	      if (self.timedout) return self.timeoutError();
	      if (self.aborted) return;
	      return self.crossDomainError();
	    }
	    self.emit('end');
	  };

	  // progress
	  var handleProgress = function handleProgress(e) {
	    if (e.total > 0) {
	      e.percent = e.loaded / e.total * 100;
	    }
	    e.direction = 'download';
	    self.emit('progress', e);
	  };
	  if (this.hasListeners('progress')) {
	    xhr.onprogress = handleProgress;
	  }
	  try {
	    if (xhr.upload && this.hasListeners('progress')) {
	      xhr.upload.onprogress = handleProgress;
	    }
	  } catch (e) {}
	  // Accessing xhr.upload fails in IE from a web worker, so just pretend it doesn't exist.
	  // Reported here:
	  // https://connect.microsoft.com/IE/feedback/details/837245/xmlhttprequest-upload-throws-invalid-argument-when-used-from-web-worker-context


	  // timeout
	  if (timeout && !this._timer) {
	    this._timer = setTimeout(function () {
	      self.timedout = true;
	      self.abort();
	    }, timeout);
	  }

	  // querystring
	  if (query) {
	    query = request.serializeObject(query);
	    this.url += ~this.url.indexOf('?') ? '&' + query : '?' + query;
	  }

	  // initiate request
	  xhr.open(this.method, this.url, true);

	  // CORS
	  if (this._withCredentials) xhr.withCredentials = true;

	  // body
	  if ('GET' != this.method && 'HEAD' != this.method && 'string' != typeof data && !isHost(data)) {
	    // serialize stuff
	    var contentType = this.getHeader('Content-Type');
	    var serialize = this._parser || request.serialize[contentType ? contentType.split(';')[0] : ''];
	    if (!serialize && isJSON(contentType)) serialize = request.serialize['application/json'];
	    if (serialize) data = serialize(data);
	  }

	  // set header fields
	  for (var field in this.header) {
	    if (null == this.header[field]) continue;
	    xhr.setRequestHeader(field, this.header[field]);
	  }

	  // send stuff
	  this.emit('request', this);

	  // IE11 xhr.send(undefined) sends 'undefined' string as POST payload (instead of nothing)
	  // We need null here if data is undefined
	  xhr.send(typeof data !== 'undefined' ? data : null);
	  return this;
	};

	/**
	 * Faux promise support
	 *
	 * @param {Function} fulfill
	 * @param {Function} reject
	 * @return {Request}
	 */

	Request.prototype.then = function (fulfill, reject) {
	  return this.end(function (err, res) {
	    err ? reject(err) : fulfill(res);
	  });
	};

	/**
	 * Expose `Request`.
	 */

	request.Request = Request;

	/**
	 * Issue a request:
	 *
	 * Examples:
	 *
	 *    request('GET', '/users').end(callback)
	 *    request('/users').end(callback)
	 *    request('/users', callback)
	 *
	 * @param {String} method
	 * @param {String|Function} url or callback
	 * @return {Request}
	 * @api public
	 */

	function request(method, url) {
	  // callback
	  if ('function' == typeof url) {
	    return new Request('GET', method).end(url);
	  }

	  // url first
	  if (1 == arguments.length) {
	    return new Request('GET', method);
	  }

	  return new Request(method, url);
	}

	/**
	 * GET `url` with optional callback `fn(res)`.
	 *
	 * @param {String} url
	 * @param {Mixed|Function} data or fn
	 * @param {Function} fn
	 * @return {Request}
	 * @api public
	 */

	request.get = function (url, data, fn) {
	  var req = request('GET', url);
	  if ('function' == typeof data) fn = data, data = null;
	  if (data) req.query(data);
	  if (fn) req.end(fn);
	  return req;
	};

	/**
	 * HEAD `url` with optional callback `fn(res)`.
	 *
	 * @param {String} url
	 * @param {Mixed|Function} data or fn
	 * @param {Function} fn
	 * @return {Request}
	 * @api public
	 */

	request.head = function (url, data, fn) {
	  var req = request('HEAD', url);
	  if ('function' == typeof data) fn = data, data = null;
	  if (data) req.send(data);
	  if (fn) req.end(fn);
	  return req;
	};

	/**
	 * DELETE `url` with optional callback `fn(res)`.
	 *
	 * @param {String} url
	 * @param {Function} fn
	 * @return {Request}
	 * @api public
	 */

	function del(url, fn) {
	  var req = request('DELETE', url);
	  if (fn) req.end(fn);
	  return req;
	};

	request['del'] = del;
	request['delete'] = del;

	/**
	 * PATCH `url` with optional `data` and callback `fn(res)`.
	 *
	 * @param {String} url
	 * @param {Mixed} data
	 * @param {Function} fn
	 * @return {Request}
	 * @api public
	 */

	request.patch = function (url, data, fn) {
	  var req = request('PATCH', url);
	  if ('function' == typeof data) fn = data, data = null;
	  if (data) req.send(data);
	  if (fn) req.end(fn);
	  return req;
	};

	/**
	 * POST `url` with optional `data` and callback `fn(res)`.
	 *
	 * @param {String} url
	 * @param {Mixed} data
	 * @param {Function} fn
	 * @return {Request}
	 * @api public
	 */

	request.post = function (url, data, fn) {
	  var req = request('POST', url);
	  if ('function' == typeof data) fn = data, data = null;
	  if (data) req.send(data);
	  if (fn) req.end(fn);
	  return req;
	};

	/**
	 * PUT `url` with optional `data` and callback `fn(res)`.
	 *
	 * @param {String} url
	 * @param {Mixed|Function} data or fn
	 * @param {Function} fn
	 * @return {Request}
	 * @api public
	 */

	request.put = function (url, data, fn) {
	  var req = request('PUT', url);
	  if ('function' == typeof data) fn = data, data = null;
	  if (data) req.send(data);
	  if (fn) req.end(fn);
	  return req;
	};

	/**
	 * Expose `request`.
	 */

	module.exports = request;

/***/ },
/* 384 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * Expose `Emitter`.
	 */

	module.exports = Emitter;

	/**
	 * Initialize a new `Emitter`.
	 *
	 * @api public
	 */

	function Emitter(obj) {
	  if (obj) return mixin(obj);
	};

	/**
	 * Mixin the emitter properties.
	 *
	 * @param {Object} obj
	 * @return {Object}
	 * @api private
	 */

	function mixin(obj) {
	  for (var key in Emitter.prototype) {
	    obj[key] = Emitter.prototype[key];
	  }
	  return obj;
	}

	/**
	 * Listen on the given `event` with `fn`.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 * @return {Emitter}
	 * @api public
	 */

	Emitter.prototype.on = Emitter.prototype.addEventListener = function (event, fn) {
	  this._callbacks = this._callbacks || {};
	  (this._callbacks['$' + event] = this._callbacks['$' + event] || []).push(fn);
	  return this;
	};

	/**
	 * Adds an `event` listener that will be invoked a single
	 * time then automatically removed.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 * @return {Emitter}
	 * @api public
	 */

	Emitter.prototype.once = function (event, fn) {
	  function on() {
	    this.off(event, on);
	    fn.apply(this, arguments);
	  }

	  on.fn = fn;
	  this.on(event, on);
	  return this;
	};

	/**
	 * Remove the given callback for `event` or all
	 * registered callbacks.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 * @return {Emitter}
	 * @api public
	 */

	Emitter.prototype.off = Emitter.prototype.removeListener = Emitter.prototype.removeAllListeners = Emitter.prototype.removeEventListener = function (event, fn) {
	  this._callbacks = this._callbacks || {};

	  // all
	  if (0 == arguments.length) {
	    this._callbacks = {};
	    return this;
	  }

	  // specific event
	  var callbacks = this._callbacks['$' + event];
	  if (!callbacks) return this;

	  // remove all handlers
	  if (1 == arguments.length) {
	    delete this._callbacks['$' + event];
	    return this;
	  }

	  // remove specific handler
	  var cb;
	  for (var i = 0; i < callbacks.length; i++) {
	    cb = callbacks[i];
	    if (cb === fn || cb.fn === fn) {
	      callbacks.splice(i, 1);
	      break;
	    }
	  }
	  return this;
	};

	/**
	 * Emit `event` with the given args.
	 *
	 * @param {String} event
	 * @param {Mixed} ...
	 * @return {Emitter}
	 */

	Emitter.prototype.emit = function (event) {
	  this._callbacks = this._callbacks || {};
	  var args = [].slice.call(arguments, 1),
	      callbacks = this._callbacks['$' + event];

	  if (callbacks) {
	    callbacks = callbacks.slice(0);
	    for (var i = 0, len = callbacks.length; i < len; ++i) {
	      callbacks[i].apply(this, args);
	    }
	  }

	  return this;
	};

	/**
	 * Return array of callbacks for `event`.
	 *
	 * @param {String} event
	 * @return {Array}
	 * @api public
	 */

	Emitter.prototype.listeners = function (event) {
	  this._callbacks = this._callbacks || {};
	  return this._callbacks['$' + event] || [];
	};

	/**
	 * Check if this emitter has `event` handlers.
	 *
	 * @param {String} event
	 * @return {Boolean}
	 * @api public
	 */

	Emitter.prototype.hasListeners = function (event) {
	  return !!this.listeners(event).length;
	};

/***/ },
/* 385 */
/***/ function(module, exports) {

	"use strict";

	/**
	 * Reduce `arr` with `fn`.
	 *
	 * @param {Array} arr
	 * @param {Function} fn
	 * @param {Mixed} initial
	 *
	 * TODO: combatible error handling?
	 */

	module.exports = function (arr, fn, initial) {
	  var idx = 0;
	  var len = arr.length;
	  var curr = arguments.length == 3 ? initial : arr[idx++];

	  while (idx < len) {
	    curr = fn.call(null, curr, arr[idx], ++idx, arr);
	  }

	  return curr;
	};

/***/ },
/* 386 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var ApiBase = exports.ApiBase = "/rest/v1";

/***/ }
/******/ ]);