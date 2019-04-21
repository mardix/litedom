/**
 * reLift v0.0.1
 * Copyright 2019 Mardix
 * Released under the MIT License
 * https://github.com/mardix/relift
 * Thanks to:
 *
 */
function _typeof(obj) {
  if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') {
    _typeof = function(obj) {
      return typeof obj;
    };
  } else {
    _typeof = function(obj) {
      return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype
        ? 'symbol'
        : typeof obj;
    };
  }

  return _typeof(obj);
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true,
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);

    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys = ownKeys.concat(
        Object.getOwnPropertySymbols(source).filter(function(sym) {
          return Object.getOwnPropertyDescriptor(source, sym).enumerable;
        })
      );
    }

    ownKeys.forEach(function(key) {
      _defineProperty(target, key, source[key]);
    });
  }

  return target;
}

var isPrimitive = function isPrimitive(value) {
  return value === null || (_typeof(value) !== 'object' && typeof value !== 'function');
};

var concatPath = function concatPath(path, property) {
  if (property && property.toString) {
    if (path) {
      path += '.';
    }

    path += property.toString();
  }

  return path;
};

var proxyTarget = Symbol('ProxyTarget');
var onChange = function onChange(object, _onChange) {
  var inApply = false;
  var changed = false;
  var propCache = new WeakMap();
  var pathCache = new WeakMap();

  var handleChange = function handleChange(path, property, previous, value) {
    if (!inApply) {
      _onChange.call(proxy, concatPath(path, property), value, previous);
    } else if (!changed) {
      changed = true;
    }
  };

  var getOwnPropertyDescriptor = function getOwnPropertyDescriptor(target, property) {
    var props = propCache.get(target);

    if (props) {
      return props;
    }

    props = new Map();
    propCache.set(target, props);
    var prop = props.get(property);

    if (!prop) {
      prop = Reflect.getOwnPropertyDescriptor(target, property);
      props.set(property, prop);
    }

    return prop;
  };

  var invalidateCachedDescriptor = function invalidateCachedDescriptor(target, property) {
    var props = propCache.get(target);

    if (props) {
      props['delete'](property);
    }
  };

  var handler = {
    get: function get(target, property, receiver) {
      if (property === '___target___') return target;

      if (property === proxyTarget) {
        return target;
      }

      var value = Reflect.get(target, property, receiver);

      if (isPrimitive(value) || property === 'constructor') {
        return value;
      } // Preserve invariants

      var descriptor = getOwnPropertyDescriptor(target, property);

      if (descriptor && !descriptor.configurable) {
        if (descriptor.set && !descriptor.get) {
          return undefined;
        }

        if (descriptor.writable === false) {
          return value;
        }
      }

      pathCache.set(value, concatPath(pathCache.get(target), property));
      return new Proxy(value, handler);
    },
    set: function set(target, property, value, receiver) {
      if (value && value[proxyTarget] !== undefined) {
        value = value[proxyTarget];
      }

      var previous = Reflect.get(target, property, receiver);
      var result = Reflect.set(target, property, value);

      if (previous !== value) {
        handleChange(pathCache.get(target), property, previous, value);
      }

      return result;
    },
    defineProperty: function defineProperty(target, property, descriptor) {
      var result = Reflect.defineProperty(target, property, descriptor);
      invalidateCachedDescriptor(target, property);
      handleChange(pathCache.get(target), property, undefined, descriptor.value);
      return result;
    },
    deleteProperty: function deleteProperty(target, property) {
      var previous = Reflect.get(target, property);
      var result = Reflect.deleteProperty(target, property);
      invalidateCachedDescriptor(target, property);
      handleChange(pathCache.get(target), property, previous);
      return result;
    },
    apply: function apply(target, thisArg, argumentsList) {
      if (!inApply) {
        inApply = true;
        var result = Reflect.apply(target, thisArg, argumentsList);

        if (changed) {
          _onChange();
        }

        inApply = false;
        changed = false;
        return result;
      }

      return Reflect.apply(target, thisArg, argumentsList);
    },
  };
  pathCache.set(object, '');
  var proxy = new Proxy(object, handler);
  return proxy;
};
/**
 * Compare two state
 * @param {object} s1
 * @param {object} s2
 * @returns {boolean}
 */

var compState = function compState(s1, s2) {
  return JSON.stringify(s1) === JSON.stringify(s2);
};
/**
 * Memoize a Proxy selector
 * @param {string} key
 * @param {function} fn
 * @return {function onChangeProxy}
 * ie: myMem = memoize(k, (state) => return value)
 * myMem(state)
 */

var memoize = function memoize(key, fn) {
  var prevState = null;
  var prevValue = undefined;
  var value = undefined;
  return function(state) {
    var exportedState = state.___target___ ? _objectSpread({}, state.___target___) : _objectSpread({}, state);

    if (!prevState || !compState(prevState, exportedState)) {
      prevState = exportedState;
      value = fn(prevState);
    }

    if (prevValue !== value) {
      prevValue = value;
      state[key] = value;
    }
  };
};
/**
 * isFn isFunction
 * @param {object} obj
 * @param {string} key
 * @returns {boolean}
 */

var isFn = function isFn(obj, key) {
  return obj && typeof obj[key] === 'function';
};

var ELEMENT_NODE = 1;
var TEXT_NODE = 3;
var COMMENT_NODE = 8;
var EVENTS_LIST = [
  'keydown',
  'keypress',
  'keyup',
  'focus',
  'blur',
  'hover',
  'change',
  'input',
  'reset',
  'submit',
  'click',
  'dblclick',
  'mouseenter',
  'mouseleave',
  'mousedown',
  'mousemove',
  'mouseout',
  'mouseover',
  'mouseup',
  'contextmenu',
  'select',
  'drag',
  'dragend',
  'dragenter',
  'dragstart',
  'dragleave',
  'drop',
  'cut',
  'copy',
  'paste',
];
var ATTR_EVENTS_LIST = 'r-on_events'; // to prevent conflict, name that may clash prefix them with $

var DIRECTIVES_LIST = {
  $for: r_for,
  $if: r_if,
  disabled: r_disabled,
  $class: r_class,
};

var md = function md(dir) {
  return 'r-' + dir;
};

var has_d = function has_d(el, dir) {
  return el.hasAttribute(md(dir));
};

var get_d = function get_d(el, dir) {
  return el.getAttribute(md(dir));
};

var rm_d = function rm_d(el, dir) {
  return el.removeAttribute(md(dir));
};

var qall_d = function qall_d(el, dir) {
  return el.querySelectorAll('[' + md(dir) + ']');
};

var beforeText = function beforeText(el, text) {
  return el.insertAdjacentText('beforebegin', text);
};

var afterText = function afterText(el, text) {
  return el.insertAdjacentText('afterend', text);
};

var wrapAround = function wrapAround(el, before, after) {
  beforeText(el, before);
  afterText(el, after);
};

var mkEventName = function mkEventName(e) {
  return 'r-on-' + e;
};

function r_if(el, value, directive) {
  rm_d(el, directive);
  beforeText(el, '${' + value + ' ? ');
  var rElse = el.nextElementSibling;

  if (rElse && has_d(rElse, 'else')) {
    wrapAround(el, '`', '`');
    rm_d(rElse, 'else');
    wrapAround(rElse, ':`', '`}');
  } else {
    wrapAround(el, '`', '`:``}');
  }
}

function r_for(el, value, directive) {
  var groups = /(.*)\s+(in)\s+(.*)$/.exec(value);

  if (groups.length === 4) {
    var sel = groups[1].replace('(', '').replace(')', '');
    var query = groups[3];
    wrapAround(el, '${' + query + '.map(function(' + sel + ') { return `', "`}.bind(this)).join('')}");
    rm_d(el, directive);
  }
}

function r_disabled(el, value, directive) {
  // /r\-disable\s*=(.*)\s*"/m
  var dir = 'disabled'; //rm_d(el, dir);

  el.setAttribute(dir, '${ ' + value + ' ? true : false}');
}

function r_class(el, value, directive) {
  if (!el.hasAttribute('class')) el.setAttribute('class', '');
  var cValue = el.getAttribute('class'); // parse the value to make the condition

  el.setAttribute('class', cValue);
  rm_d(el, directive);
} // ==================

/**
 * Patch baseTree with newTree
 */

var isProxy = function isProxy(node) {
  return node && node.dataset && node.dataset.proxy !== undefined;
};

var mergeAttrs = function mergeAttrs(baseNode, newNode) {
  var oldAttrs = baseNode.attributes;
  var newAttrs = newNode.attributes;
  var changes = [
    // old attrs
    Array.from(oldAttrs)
      .filter(function(attr) {
        return !(attr in newAttrs);
      })
      .map(function(attr) {
        return !baseNode.removeAttribute(attr);
      }), // new attrs
    Array.from(newAttrs)
      .filter(function(attr) {
        return !(attr in oldAttrs) && !(oldAttrs[attr] === newAttrs[attr]);
      })
      .map(function(attr) {
        return !baseNode.setAttribute(attr, newAttrs[attr]);
      }),
  ];
  return changes.some(function(v) {
    return v;
  });
};

var updateAttr = function updateAttr(newNode, baseNode, name) {
  if (newNode[name] !== baseNode[name]) {
    baseNode[name] = newNode[name];
    newNode[name] ? baseNode.setAttribute(name, '') : baseNode.removeAttribute(name);
    return true;
  }
};

var isNodeSame = function isNodeSame(a, b) {
  if (a.id) return a.id === b.id;
  if (a.isSameNode) return a.isSameNode(b);
  if (a.tagName !== b.tagName) return false;
  if (a.type === TEXT_NODE) return a.nodeValue === b.nodeValue;
  return false;
};

var updateInput = function updateInput(newNode, baseNode) {
  var newValue = newNode.value;
  var oldValue = baseNode.value;
  var updated = false;

  if (!newValue || newValue === 'undefined') {
    newValue = '';
  }

  updateAttr(newNode, baseNode, 'checked');
  updateAttr(newNode, baseNode, 'disabled');

  if (newValue !== oldValue) {
    updated = true;
    baseNode.setAttribute('value', newValue);
    baseNode.value = newValue;
  }

  if (newValue === 'null') {
    updated = true;
    baseNode.value = '';
    baseNode.removeAttribute('value');
  }

  if (!newNode.hasAttributeNS(null, 'value')) {
    updated = true;
    baseNode.removeAttribute('value');
  } else if (baseNode.type === 'range') {
    updated = true;
    baseNode.value = newValue;
  }

  return updated;
};

var updateTextarea = function updateTextarea(newNode, baseNode) {
  var updated = false;
  var newValue = newNode.value;

  if (!newValue || newValue === 'undefined') {
    newValue = '';
  }

  if (newValue !== baseNode.value) {
    baseNode.value = newValue;
    updated = true;
  }

  if (baseNode.firstChild && baseNode.firstChild.nodeValue !== newValue) {
    if (newValue === '' && baseNode.firstChild.nodeValue === baseNode.placeholder) {
      return;
    }

    baseNode.firstChild.nodeValue = newValue;
    updated = true;
  }

  return updated;
};

var updateForm = function updateForm(nodeName, newNode, baseNode) {
  switch (nodeName) {
    case 'INPUT':
      updateInput(newNode, baseNode);
      break;

    case 'OPTION':
      updateAttr(newNode, baseNode, 'selected');
      break;

    case 'TEXTAREA':
      updateTextarea(newNode, baseNode);
      break;
  }
};

var patchNode = function patchNode(newNode, baseNode) {
  var nodeType = newNode.nodeType;
  var nodeName = newNode.nodeName;

  if (nodeType === ELEMENT_NODE) {
    mergeAttrs(baseNode, newNode);
  }

  if (nodeType === TEXT_NODE || nodeType === COMMENT_NODE) {
    if (baseNode.nodeValue !== newNode.nodeValue) {
      baseNode.nodeValue = newNode.nodeValue;
    }
  }

  updateForm(nodeName, newNode, baseNode);
};

var updateNode = function updateNode(newNode, baseNode) {
  var oldChild, newChild, morphed, oldMatch;
  var offset = 0;
  var updated = true;

  for (var i = 0; ; i++) {
    oldChild = baseNode.childNodes[i];
    newChild = newNode.childNodes[i - offset];

    if (!oldChild && !newChild) {
      break;
    } else if (!newChild) {
      updated = true;
      baseNode.removeChild(oldChild);
      i--;
    } else if (!oldChild) {
      updated = true;
      baseNode.appendChild(newChild);
      offset++;
    } else if (isNodeSame(newChild, oldChild)) {
      morphed = walkNode(newChild, oldChild);

      if (morphed !== oldChild) {
        updated = true;
        baseNode.replaceChild(morphed, oldChild);
        offset++;
      }
    } else {
      oldMatch = null;

      for (var j = i; j < baseNode.childNodes.length; j++) {
        if (isNodeSame(baseNode.childNodes[j], newChild)) {
          oldMatch = baseNode.childNodes[j];
          break;
        }
      }

      if (oldMatch) {
        morphed = walkNode(newChild, oldMatch);
        if (morphed !== oldMatch) offset++;
        updated = true;
        baseNode.insertBefore(morphed, oldChild); // It's safe to morph two nodes in-place if neither has an ID
      } else if (!newChild.id && !oldChild.id) {
        morphed = walkNode(newChild, oldChild);

        if (morphed !== oldChild) {
          updated = true;
          baseNode.replaceChild(morphed, oldChild);
          offset++;
        }
      } else {
        if (isProxy(newChild) && !newChild.isSameNode(oldChild) && newChild.realNode) {
          updated = true;
          baseNode.insertBefore(newChild.realNode, oldChild);
        } else {
          updated = true;
          baseNode.insertBefore(newChild, oldChild);
        }

        offset++;
      }
    }
  }

  return updated;
};

var walkNode = function walkNode(newNode, baseNode) {
  if (!baseNode) return newNode;
  else if (!newNode) return null;
  else if (newNode.isSameNode && newNode.isSameNode(baseNode)) return baseNode;
  else if (newNode.tagName !== baseNode.tagName) return newNode;
  patchNode(newNode, baseNode);
  updateNode(newNode, baseNode);
  return baseNode;
}; // ==== EXPORTS ====

var htmlToDom = function htmlToDom(html) {
  return new DOMParser().parseFromString(html, 'text/html').body.firstChild;
};
/**
 * Get a string and turn it into template literal
 * @param {string} tpl
 * @param {object} state
 */

var parseLit = function parseLit(tpl, state) {
  return new Function('return `' + tpl + '`').call(state);
};
function parseDom(el) {
  var customDirectives = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var directives = _objectSpread({}, customDirectives, DIRECTIVES_LIST);

  for (var $dir in directives) {
    var directive = $dir.replace('$', '');
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (
        var _iterator = qall_d(el, directive)[Symbol.iterator](), _step;
        !(_iteratorNormalCompletion = (_step = _iterator.next()).done);
        _iteratorNormalCompletion = true
      ) {
        var el2 = _step.value;

        if (has_d(el2, directive)) {
          var value = get_d(el2, directive);
          directives[$dir](el2, value, directive);
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator['return'] != null) {
          _iterator['return']();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  }

  return el;
}
function tokenizeEvents(selector) {
  /**
   * '@call'
   * Wildcard events, base of the type of the element it will assign the right event name
   * ie: on input element, '@call' will turn into 'r-on-input' and 'r-on-paste'
   * on AHREF, '@call' will turn into 'r-on-click'
   */
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (
      var _iterator2 = selector.querySelectorAll('[\\@call]')[Symbol.iterator](), _step2;
      !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done);
      _iteratorNormalCompletion2 = true
    ) {
      var el = _step2.value;
      var method = el.getAttribute('@call');
      el.removeAttribute('@call');
      var evnts = ['click'];
      if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) evnts = ['input', 'paste'];
      else if (el instanceof HTMLInputElement) evnts = ['change'];
      else if (el instanceof HTMLFormElement) evnts = ['submit'];
      else if (el instanceof HTMLAnchorElement) el.setAttribute('href', 'javascript:void(0);');
      var eventsList = (el.getAttribute(ATTR_EVENTS_LIST) || '').split(',').filter(function(v) {
        return v;
      });
      eventsList = eventsList.concat(evnts);
      el.setAttribute(ATTR_EVENTS_LIST, eventsList.join(','));

      for (var _i2 = 0, _evnts = evnts; _i2 < _evnts.length; _i2++) {
        var e = _evnts[_i2];
        el.setAttribute(mkEventName(e), method);
      }
    } // Regular event list
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2['return'] != null) {
        _iterator2['return']();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  for (var _i = 0, _EVENTS_LIST = EVENTS_LIST; _i < _EVENTS_LIST.length; _i++) {
    var _e = _EVENTS_LIST[_i];
    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
      for (
        var _iterator3 = selector.querySelectorAll('[\\@' + _e + ']')[Symbol.iterator](), _step3;
        !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done);
        _iteratorNormalCompletion3 = true
      ) {
        var _el = _step3.value;

        var _eventsList = (_el.getAttribute(ATTR_EVENTS_LIST) || '').split(',').filter(function(v) {
          return v;
        });

        _eventsList.push(_e);

        _el.setAttribute(ATTR_EVENTS_LIST, _eventsList.join(','));

        _el.setAttribute(mkEventName(_e), _el.getAttribute('@' + _e));

        _el.removeAttribute('@' + _e);

        if (_el instanceof HTMLAnchorElement) _el.setAttribute('href', 'javascript:void(0);');
      }
    } catch (err) {
      _didIteratorError3 = true;
      _iteratorError3 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion3 && _iterator3['return'] != null) {
          _iterator3['return']();
        }
      } finally {
        if (_didIteratorError3) {
          throw _iteratorError3;
        }
      }
    }
  }
}
function bindEvents(selector, context) {
  function mapEvents(selector) {
    Array.from(selector.querySelectorAll('[' + ATTR_EVENTS_LIST + ']')).map(function(el) {
      return applyEvents(el);
    });
  }

  function observer(mutations) {
    var _iteratorNormalCompletion4 = true;
    var _didIteratorError4 = false;
    var _iteratorError4 = undefined;

    try {
      for (
        var _iterator4 = mutations[Symbol.iterator](), _step4;
        !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done);
        _iteratorNormalCompletion4 = true
      ) {
        var mutation = _step4.value;
        var _iteratorNormalCompletion5 = true;
        var _didIteratorError5 = false;
        var _iteratorError5 = undefined;

        try {
          for (
            var _iterator5 = mutation.removedNodes[Symbol.iterator](), _step5;
            !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done);
            _iteratorNormalCompletion5 = true
          ) {
            var el = _step5.value;
            applyEvents(el, true);
          }
        } catch (err) {
          _didIteratorError5 = true;
          _iteratorError5 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion5 && _iterator5['return'] != null) {
              _iterator5['return']();
            }
          } finally {
            if (_didIteratorError5) {
              throw _iteratorError5;
            }
          }
        }

        if (mutation.addedNodes.length > 0) {
          mapEvents(mutation.target);
        }
      }
    } catch (err) {
      _didIteratorError4 = true;
      _iteratorError4 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion4 && _iterator4['return'] != null) {
          _iterator4['return']();
        }
      } finally {
        if (_didIteratorError4) {
          throw _iteratorError4;
        }
      }
    }
  }

  function handler(method) {
    var e = arguments[1];
    var eType = e.type;

    try {
      e.preventDefault();
      context[method].call(context, e);
    } catch (err) {
      console.error("Events Handler Error: '" + method + "()' on '" + eType + "'", err);
    }
  }

  function applyEvents(el) {
    var _this = this;

    var remove = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    if (!el || !el.getAttribute) return;
    (el.getAttribute('r-on_events') || '')
      .split(',')
      .filter(function(v) {
        return v;
      })
      .map(function(e) {
        el['on' + e] = remove ? undefined : handler.bind(_this, el.getAttribute(mkEventName(e)));
      });
  }

  var options = {
    attributes: true,
    characterData: true,
    childList: true,
    subtree: true,
    attributeOldValue: true,
    characterDataOldValue: true,
  };
  var mutationsObserver = new MutationObserver(observer);
  mutationsObserver.observe(selector, options);
  mapEvents(selector);
  return mutationsObserver;
}
/**
 *
 * @returns {boolean} true for any changes
 */

function patchDom(newTree) {
  var baseTree = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  walkNode(newTree, baseTree); //[mergeAttrs(baseTree, newTree), ].some(v => !v);

  return false;
}

/**
 * reLiftState
 * @param {object} initialState
 * @param {object function} mutators
 */

function reLiftState() {
  var _this = this;

  var initialState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var mutators = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var subscribers = [];
  var initState = Object.keys(initialState)
    .filter(function(v) {
      return !isFn(initialState, v);
    })
    .reduce(function(pV, cV) {
      return _objectSpread({}, pV, _defineProperty({}, cV, initialState[cV]));
    }, {});
  /** Selectors, computed functions that accept the state as arg. Must return value */

  var selectors = Object.keys(initialState)
    .filter(function(v) {
      return isFn(initialState, v);
    })
    .map(function(k) {
      return memoize(k, initialState[k]);
    });
  var actions = Object.keys(mutators)
    .filter(function(v) {
      return isFn(mutators, v);
    })
    .reduce(function(pV, cV) {
      return _objectSpread(
        {},
        pV,
        _defineProperty({}, cV, function() {
          var _mutators$cV;

          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          (_mutators$cV = mutators[cV]).call.apply(_mutators$cV, [_this, state].concat(args));

          return actions; // to allow chainability
        })
      );
    }, {});
  var state = onChange(initState, function() {
    selectors.forEach(function(memoizedSel) {
      return memoizedSel(state);
    });
    subscribers.forEach(function(s) {
      return s(state.___target___);
    });
  });
  /** Initialize selectors */

  selectors.forEach(function(memoizedSel) {
    return memoizedSel(state);
  });
  return _objectSpread({}, actions, {
    $getState: function $getState() {
      return state.___target___;
    },
    $subscribe: function $subscribe(listener) {
      subscribers.push(listener);
      return function() {
        return subscribers.splice(subscribers.indexOf(listener), 1);
      };
    },
  });
}

/**
 *
 * @param {*} el
 * @param {*} context
 * @param {*} template
 */

function dom(el) {
  var context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var template = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  if (template) el.innerHTML = template;
  var node = el.cloneNode(true);
  tokenizeEvents(node);
  parseDom(node);
  el.innerHTML = node.innerHTML;
  bindEvents(el, context);
  var tpl = node.outerHTML;
  return function(state) {
    var newHtml = parseLit(tpl, state);
    var newNode = htmlToDom(newHtml);
    return patchDom(newNode, el);
  };
}

function reLiftHTML() {
  var opt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var reservedKeys = ['data', 'el', 'template', 'store', 'mounted', 'updated'];

  var conf = _objectSpread(
    {
      data: {},
      /** @type {object} local state data */
      el: document.body,
      /** @type {HTMLElement} The dom element to bind */
      template: null,
      /** @type {string} */
      store: {},
      /** @type {reStated} For global state. Must have subscribe() and getState() */
      mounted: function mounted() {},
      /** @type {function} triggered on initialization */
      updated: function updated() {},
      /** @type {function} triggered on update */
    },
    opt
  );

  var el = typeof conf.el === 'string' ? document.querySelector(conf.el) : conf.el;
  if (!(el instanceof HTMLElement))
    throw new Error("reLiftHTML setup error: 'el' is not a DOM Element. >> el: " + conf.el);
  var template = conf.template ? conf.template : el.innerHTML;
  /** Extract all methods to be used in the context */

  var methods = Object.keys(conf)
    .filter(function(k) {
      return !reservedKeys.includes(k);
    })
    .filter(function(k) {
      return !k.startsWith('$');
    })
    .filter(function(k) {
      return isFn(conf, k);
    })
    .reduce(function(pV, cK) {
      return _objectSpread({}, pV, _defineProperty({}, cK, conf[cK]));
    }, {});
  /** initialState */

  var initialState = Object.keys(conf.data)
    .filter(function(k) {
      return !isFn(conf.data, k);
    })
    .reduce(function(pV, cK) {
      return _objectSpread({}, pV, _defineProperty({}, cK, conf.data[cK]));
    }, {});
  /** computedState */

  var computedState = Object.keys(conf.data)
    .filter(function(k) {
      return isFn(conf.data, k);
    })
    .map(function(key) {
      return memoize(key, conf.data[key]);
    });

  function updateComputedState(state) {
    computedState.forEach(function(s) {
      return s(state);
    });
  }
  /** @type {object} the application state */

  var state = _objectSpread(
    {
      $store: {},
    },
    initialState
  );
  /** @type {reStated} */

  var store = undefined;

  if (Object.keys(conf.store).length) {
    store = conf.store;
    state.$store = conf.store.$getState();
    conf.store.$subscribe(function(data) {
      state.$store = conf.store.$getState();
      updateComputedState(state);
      render();
    });
  }
  /** data proxy */

  var data = onChange(state, function() {
    updateComputedState(state);
    render();
  });
  /** @type {object} context (events action methods) to be used in the  template */

  var context = _objectSpread({}, methods, {
    el: el,
    data: data,
    render: render,
    store: store,
  });
  /** To re-render and run updated() */

  function render() {
    if (updateDom(state));
  }
  /** Bind the dom and attach the method context */

  var updateDom = dom(el, context, template);
  /** DOM Ready */

  document.addEventListener('DOMContentLoaded', function() {
    updateComputedState(state);
    updateDom(state); // initial rendering

    conf.mounted.call(context); // lifecycle: created

    el.style.display = 'block'; // if the element is hidden, let's show it now
  });
}

export default reLiftHTML;
export { reLiftState };
