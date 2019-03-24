var TChart = (function () {
  'use strict';

  function forEach(obj, cb) {
    var keys = Object.keys(obj);

    keys.forEach(function (key, i) { return cb(obj[key], key, i); });
  }

  function createElement(tag) {
    return document.createElementNS('http://www.w3.org/2000/svg', tag);
  }

  function createTextNode(text) {
    return document.createTextNode(text);
  }

  function toDashCase(str) {
    return str.replace( /([a-z])([A-Z])/g, '$1-$2' ).toLowerCase();
  }


  function formatBigNumber(number) {
    if(number > 10000) {
      return (number / 1000).toFixed(0) + 'K';
    }

    return number;
  }

  function makeId(length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < length; i++)
      { text += possible.charAt(Math.floor(Math.random() * possible.length)); }

    return text;
  }

  var Element = function Element(tag, opts) {
    var this$1 = this;
    if ( opts === void 0 ) opts = {};

    this._el = createElement(tag);

    forEach(opts, function (v, prop) {
      if(prop === 'style') {
        this$1.style(v);
        return;
      }
      this$1.attr(prop, v);
    });
  };

  var prototypeAccessors = { node: { configurable: true } };

  prototypeAccessors.node.get = function () {
    return this._el;
  };

  Element.prototype.attr = function attr () {
      var this$1 = this;

    if(arguments.length > 1) {
      this._el.setAttribute(toDashCase(arguments[0]), arguments[1]);
    } else {
      if(typeof arguments[0] === 'object') {
        forEach(arguments[0], function (value, property) {
          this$1.attr(property, value);
        });
        return;
      }

      return this._el.getAttribute(toDashCase(arguments[0]));
    }
  };

  Element.prototype.style = function style () {
      var this$1 = this;

    if(arguments.length > 1) {
      this._el.style[toDashCase(arguments[0])] = arguments[1];
    } else {
      if(typeof arguments[0] === 'object') {
        forEach(arguments[0], function (value, property) {
          this$1.style(property, value);
        });
        return;
      }

      return this._el.style[toDashCase(arguments[0])];
    }
  };

  Element.prototype.addEventListener = function addEventListener (name, handler) {
    this._el.addEventListener(name, handler);
  };

  Element.prototype.mount = function mount (to) {
    if(to instanceof Element) {
      to._el.appendChild(this._el);
    } else {
      to.appendChild(this._el);
    }
  };

  Object.defineProperties( Element.prototype, prototypeAccessors );

  var Control = function Control(layoutTag) {
    this._layout = new Layout(layoutTag);

    this._layout.push(this);
  };

  var prototypeAccessors$1 = { layout: { configurable: true } };

  prototypeAccessors$1.layout.get = function () {
    return this._layout;
  };

  prototypeAccessors$1.layout.set = function (val) {
    //
  };

  Object.defineProperties( Control.prototype, prototypeAccessors$1 );

  var Layout = function Layout(tag) {
    this._container = tag ? new Element(tag) : null;
    this._collection = [];
    this._mounted = false;

    this._position = {};

    this._viewbox = {
      width: 0,
      height: 0,
    };
  };

  Layout.prototype.viewbox = function viewbox (viewbox$1) {
    this._viewbox = viewbox$1;
  };

  Layout.prototype.position = function position (pos) {
    this._position = pos;
  };

  Layout.prototype.push = function push () {
      var ref;

      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];
    (ref = this._collection).push.apply(ref, args);
  };

  Layout.prototype.render = function render (theme) {
    this._collection.forEach(function (e) {
      if(e instanceof Layout || e instanceof Control) {
        e.render(theme);
      }
    });
  };

  Layout.prototype.mount = function mount (to) {
      var this$1 = this;

    if(this._mounted) {
      return;
    }

    if(to instanceof Layout || to instanceof Element || to instanceof Control) {
      if(this._container) {
        this._collection.forEach(function (e) {
          if(e instanceof Element || e instanceof Layout || e instanceof Control) {
            e.mount(this$1._container);
          } else {
            this$1._container.appendChild(e);
          }
        });
        this._container.mount(to);
      } else {
        this._collection.forEach(function (e) {
          if(e instanceof Element || e instanceof Layout || e instanceof Control) {
            e.mount(to);
          } else {
            to.appendChild(e);
          }
        });
      }
    } else {
      if(this._container) {
        this._collection.forEach(function (e) {
          if(e instanceof Element || e instanceof Layout || e instanceof Control) {
            e.mount(this$1._container);
          } else {
            this$1._container.appendChild(e);
          }
        });
        to.appendChild(this._container.node);
      } else {
        this._collection.forEach(function (e) {
          if(e instanceof Element || e instanceof Layout || e instanceof Control) {
            e.mount(to);
          } else {
            to.appendChild(e);
          }
        });
      }
    }

    if(this._container) {
      this._container.attr('transform', ("translate(" + (this._position.left || 0) + " " + (this._position.top || 0) + ")"));
    }

    this._mounted = true;
  };

  var LightTheme = {
    Root: {
      background: 'white',
    },
    Navigator: {
      height: 50,
      background: 'white',
      Drawer: {
        handlerWidth: 10,
        border: 4,
        maskColor: '#F6FAFC',
        borderColor: 'rgba(20,123,123,0.2)',
      },
      Line: {
        linejoin: 'round',
        size: 1,
      }
    },
    Tooltip: {
      Mark: {
        background: 'white',
      },
      labelColor: '#222222',
      background: 'white',
      borderColor: '#D8D8D8',
      wayLineColor: '#DFE6EB',
    },
    Plot: {
      Line: {
        linejoin: 'round',
        size: 2,
      },
      yAxis: {
        lineColor: '#F2F4F5',
        textColor: '#96A2AA',
      },
      xAxis: {
        textColor: '#96A2AA',
      }
    }
  };

  var NightTheme = {
    Root: {
      background: '#242F3E',
    },
    Navigator: {
      height: 50,
      background: '#242F3E',
      Drawer: {
        handlerWidth: 10,
        border: 4,
        maskColor: '#1F2A38',
        borderColor: 'rgba(64,87,106,1)',
      },
      Line: {
        linejoin: 'round',
        size: 1,
      }
    },
    Tooltip: {
      Mark: {
        background: '#242F3E',
      },
      labelColor: 'white',
      background: '#253241',
      borderColor: '#212D3A',
      wayLineColor: '#3B4A5A'
    },
    Plot: {
      Line: {
        linejoin: 'round',
        size: 2,
      },
      yAxis: {
        lineColor: '#293544',
        textColor: '#546778',
      },
      xAxis: {
        textColor: '#546778',
      }
    }
  };

  var obId = 0;

  var Ob = function Ob(target) {
    this._target = target;
    this._rel = [];
    this._watchers = [];
    this._id = ++obId;
  };

  Ob.prototype.addRelation = function addRelation (ob) {
    this._rel.push(ob);
    // console.log(ob, this._id, this);
    ob.watch(this.notify.bind(this));
  };

  Ob.prototype.watch = function watch (cb) {
    this._watchers.push(cb);
  };

  Ob.prototype.notify = function notify (targetProp, newValue, oldValue) {
    // console.log('notify in', this._target);
    this._watchers.forEach(function (w) { return w(targetProp, newValue, oldValue); });
  };

  function reactive(target) {
    var res = null;
    if(Array.isArray(target)) {
      res = target.slice(0);
    } else if(typeof target === 'object' && target instanceof Object) {
      res = Object.assign({}, target);
    }

    makeReactive(res);

    return res;
  }

  function makeReactive(target) {
    if(Array.isArray(target)) {
      makeArray(target);
      return 1;
    } else if(typeof target === 'object' && target instanceof Object) {
      makeObject(target);
      return 1;
    }

    return -1;
  }

  function def (obj, key, val, enumerable) {
    if ( enumerable === void 0 ) enumerable = false;

    Object.defineProperty(obj, key, {
      value: val,
      enumerable: !!enumerable,
      writable: true,
      configurable: true
    });
  }

  var arrayProto = Array.prototype;
  var arrayMethods = Object.create(arrayProto);

  var arrayMethodsToPatch = [
    'push',
    'pop',
    'shift',
    'unshift',
    'splice',
    'sort',
    'reverse'
  ];

  function makeObject(obj) {
    var ob = new Ob(obj);

    forEach(obj, function (value, key) {

      if(Array.isArray(value) || typeof value === 'object' && value instanceof Object) {
        // def(value, '__ob', ob);
        makeReactive(value);
        // console.log(ob, value.__ob);
        ob.addRelation(value.__ob);
      }

      Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get: function getter () {
          return value;
        },
        set: function setter (newVal) {
          if (newVal === value) {
            return;
          }

          if(value.__ob && value.__ob instanceof Ob) {
            makeReactive(newVal);
          }

          var old = value;
          value = newVal;
          ob.notify(key, newVal, old);
        }
      });

    });

    def(obj, '__ob', ob);
  }

  function makeArray(array) {
    // console.log(array);
    var ob = new Ob(array);
    array.forEach(function (item) {
      var i = makeReactive(item);
      if(i !== -1) {
        ob.addRelation(item.__ob);
      }
    });

    def(array, '__ob', ob);

    arrayMethodsToPatch.forEach(function (method) {
      var original = arrayProto[method];
      def(arrayMethods, method, function mutator () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        var result = original.apply(this, args);
        var ob = this.__ob;
        // if (inserted) ob.observeArray(inserted)
        // notify change
        ob.notify(null, original);
        return result;
      });
    });

    arrayMethodsToPatch.forEach(function (method) {
      def(array, method, arrayMethods[method]);
    });

    return array;
  }

  function watch(reactiveValue, watchValues) {
    if(typeof watchValues === 'object' && watchValues instanceof Object) {
      forEach(watchValues, function (val, key) {
        if(reactiveValue[key] !== 'undefined') {
          var cb = null;
          var deep = false;
          if(val && {}.toString.call(val) === '[object Function]') {
            cb = val;
          } else {
            cb = val.handler;
            deep = val.deep || false;
          }

          // if(reactiveValue[key].__ob) {
          //   reactiveValue[key].__ob.watch((prop, n, o) => cb(n, o));
          // } else {
          //   reactiveValue.__ob.watch((prop, newVal, oldVal) => {
          //     if(prop === key) {
          //       cb(newVal, oldVal);
          //     }
          //   })
          // }

          reactiveValue.__ob.watch(function (prop, newVal, oldVal) {
            if(prop === key) {
              cb(newVal, oldVal);
            }
          });

        }
      });
    }
  }

  function animate(options) {
    var start = performance.now();

    return requestAnimationFrame(function animate(time) {
      var timeFraction = (time - start) / options.duration;
      if (timeFraction > 1) { timeFraction = 1; }

      var progress = options.timing(timeFraction);

      options.draw(progress);

      if (timeFraction < 1) {
        requestAnimationFrame(animate);
      }
    });
  }

  var Line = function Line(theme, opts) {
    this._theme = theme;
    this._options = opts;

    this._container = new Element('polyline', {
      stroke: opts.color,
      strokeWidth: theme.size,
      fill: 'none',
      strokeLinecap: theme.linejoin,
      strokeLinejoin: theme.linejoin,
      style: {
        willChange: 'auto'
      }
    });
  };

  Line.prototype.changeVisible = function changeVisible (visible) {
      var this$1 = this;

    this._visible = visible;

    animate({
      duration: 200,
      timing: function (timeFraction) {
        return timeFraction;
      },
      draw: function (progress) {

        this$1._container.style('opacity', visible ? progress : 1 - progress);

        // this._container.attr('transform', `translate(0 ${-top})`);

        // if(progress >= 1) {
        // // this._container.style('visibility', 'hidden');
        // this._lines[id].changeVisible(isVisible);
        // }
      }
    });
  };

  Line.prototype.redraw = function redraw (opts) {
    var xPerOne = opts.viewbox.width / opts.points.length;

    var xRatio = opts.viewbox.width / (opts.points.length - 1);
    // let yRatio = this.$options.height / (Math.max(...all) - Math.min(...all));
    var yRatio = opts.viewbox.height / opts.max;

    this.xRatio = xRatio;
    this.yRatio = yRatio;

    var x = 0;

    var polylinePoints = [];

    for(var i = 0; i < opts.points.length; i++) {
      var cp = opts.points[i];
      polylinePoints.push(x * xRatio); // start x
      polylinePoints.push((opts.max - cp) * yRatio); // start y

      // if(i !== this.$points.length - 1) {
        // polylinePoints.push(x * xRatio); // end x
        // polylinePoints.push((opts.max - cp) * yRatio); // end y
      // }

      x++;
    }
    this._container.attr('points', polylinePoints.join(','));
  };

  var PlotArea = /*@__PURE__*/(function (Control) {
    function PlotArea(state) {
      var this$1 = this;

      Control.call(this, 'g');
      this._state = state;

      this._maxValue = 0;
      this._minValue = 0;

      this._lines = {};

      this._animateQueue = {};

      Object.keys(state.data).forEach(function (id) {
        watch(state.data[id], {
          data: function () { return this$1._handlerUpdateData(id); },
          visible: function (n, o) { return this$1._changeVisible(id, n); }
        });

        this$1._lines[id] = new Line(state.theme.Line, { color: state.data[id].color });
      });

      this._recalc();

      this._timer = null;
    }

    if ( Control ) PlotArea.__proto__ = Control;
    PlotArea.prototype = Object.create( Control && Control.prototype );
    PlotArea.prototype.constructor = PlotArea;

    PlotArea.prototype._recalc = function _recalc () {
      var data = [];

      forEach(this._state.data, function (v) {
        if(v.visible) {
          data.push.apply(data, v.data);
        }
      });

      this._prevMaxValue = this._maxValue;
      this._prevMinValue = this._minValue;

      this._maxValue = Math.max.apply(Math, data);
      this._minValue = Math.min.apply(Math, data);

      this._state.maxValue = this._maxValue;
      this._state.minValue = this._minValue;

      if(this._prevMaxValue === 0) {
        this._prevMaxValue = this._maxValue * 5;
      }

    };

    PlotArea.prototype._handlerUpdateData = function _handlerUpdateData (id) {
      var this$1 = this;

      // console.log(id);
      // this._recalc();

      this._prevMaxValue = this._maxValue;
      this._prevMinValue = this._minValue;

      this.render();

      if(this._timer) {
        clearTimeout(this._timer);
        this._timer = null;
      }

      this._timer = setTimeout(function () {
        this$1._recalc(false);
        this$1._render();
        this$1._timer = null;
        clearTimeout(this$1._timer);
      }, 100);

    };

    PlotArea.prototype._changeVisible = function _changeVisible (id, isVisible) {
      this._recalc();
      this.render();

      this._lines[id].changeVisible(isVisible);
    };

    PlotArea.prototype.mount = function mount (to) {
      forEach(this._lines, function (l) {
        l._container.mount(to);
      });
    };

    PlotArea.prototype._render = function _render (force) {
      var this$1 = this;

      // wait sync array length
      var firstLineLength = this._state.data[Object.keys(this._state.data)[0]].data.length;
      var isSync = Object.keys(this._state.data).every(function (id) { return this$1._state.data[id].data.length === firstLineLength; });

      if(!isSync) {
        return;
      }

      forEach(this._lines, function (line, id) {
        if(force && this$1._animateQueue[id]) {
          return;
        }

        this$1._animateQueue[id] = true;

        animate({
          duration: 200,
          timing: function (timeFraction) {
            return timeFraction;
          },
          draw: function (progress) {
            var offset = this$1._prevMaxValue - this$1._maxValue;

            line.redraw({
              points: this$1._state.data[id].data,
              max: this$1._prevMaxValue - offset * progress,
              min: this$1._minValue,
              viewbox: this$1._layout._viewbox,
            });

            if(progress >= 1) {
              this$1._animateQueue[id] = false;
            }
          }
        });
      });
    };

    PlotArea.prototype.render = function render () {
      this._render(true);
    };

    return PlotArea;
  }(Control));

  var yAxis = /*@__PURE__*/(function (Control) {
    function yAxis(state) {
      Control.call(this, 'g');

      this._state = state;
      this._oldMax = 0;
      this._max = state.maxValue;
      this._height = 400;
      this._width = 400;
      this._linesCount = 5;
      this._zeroLine = null;

      watch(state, {
        maxValue: this._changeMax.bind(this),
        theme: this._changeTheme.bind(this),
      });

      this._container = new Element('g');

      this._currentGroup = 'first';
      this._labels = {
        first: [],
        second: [],
      };
    }

    if ( Control ) yAxis.__proto__ = Control;
    yAxis.prototype = Object.create( Control && Control.prototype );
    yAxis.prototype.constructor = yAxis;

    yAxis.prototype._changeTheme = function _changeTheme () {
      var this$1 = this;

      var items = ( this._labels.first ).concat( this._labels.second);

      if(this._zeroLine) {
        items.push(this._zeroLine);
      }

      items.forEach(function (i) {
        console.log(i);
        i.label.attr('stroke', this$1._state.theme.yAxis.textColor);
        i.line.attr('stroke', this$1._state.theme.yAxis.lineColor);
      });
    };

    yAxis.prototype._changeMax = function _changeMax (value) {
      this._oldMax = this._max;
      console.log('change max');
      this._max = value;
      this.render();
    };

    yAxis.prototype._createLabels = function _createLabels (n) {
      var labels = [];

      for(var i = 1; i <= n; i++) {
        var r = (this._height / n) * i;
        var line = new Element('line', {
          x1: 0,
          y1: 0,
          x2: this._width - 20,
          y2: 0,
          stroke: this._state.theme.yAxis.lineColor,
        });

        var label = new Element('text', {
          y: -10,
          x: 0,
          stroke: this._state.theme.yAxis.textColor,
          fontSize: 12,
          fontWeight: 100,
        });

        var container = new Element('g', {
          transform: ("translate(0 " + (this._height) + ")"),
          style: {
            transition: 'all 200ms',
          }
        });

        label.mount(container);
        line.mount(container);

        labels.push({
          container: container,
          label: label,
          line: line
        });
      }

      return labels;
    };

    yAxis.prototype.mount = function mount (to) {
      var this$1 = this;

      var range = this._max / this._linesCount;

      this._zeroLine = this._createLabels(1)[0];
      this._zeroLine.container.mount(this._container);
      this._zeroLine.container.attr('transform', ("translate(10 " + (this._height) + ")"));
      this._zeroLine.label.node.appendChild(createTextNode(0));

      this._labels.first = this._createLabels(this._linesCount);
      this._labels.first.forEach(function (e, i) {
        var value = this$1._max - i * range;
        e.container.mount(this$1._container);
        e.label.node.innerHTML = '';
        e.label.node.appendChild(createTextNode(value));
      });

      this._labels.second = this._createLabels(this._linesCount);
      this._labels.second.forEach(function (e, i) {
        e.container.mount(this$1._container);
        e.container.style('translate', '');
        e.container.attr('transform', '');
      });

      this._container.mount(to);
    };

    yAxis.prototype.render = function render () {
      var this$1 = this;

      this._labels[this._currentGroup].forEach(function (e, i) {
        e.container.style('transition', 'all 200ms');
        e.container.attr('transform', "translate(10 -100)");
        e.container.style('opacity', "0");
      });

      this._currentGroup = this._currentGroup === 'first' ? 'second' : 'first';

      var range = this._max / (this._linesCount + 1);
      this._labels[this._currentGroup].forEach(function (e, i) {
        e.container.style('transition', '');
        if(this$1._max < this$1._oldMax) {
          e.container.attr('transform', ("translate(10 " + (this$1._height) + ")"));
        }
        e.container.style('opacity', "0");

        e.container.style('transition', 'all 200ms');
        var value = this$1._max - i * range - range;
        // let value = ((range * this._linesCount) - (range * i))

        e.label.node.innerHTML = '';
        e.label.node.appendChild(createTextNode(formatBigNumber(Math.ceil(value))));

        var r = (this$1._height / (this$1._linesCount + 1)) * (i + 1);

        e.container.attr('transform', ("translate(10 " + r + ")"));
        e.container.style('opacity', "1");
      });

      // let labels = this._oldLabels;
      // this._oldLabels = this._labels;


    };

    return yAxis;
  }(Control));

  var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];


  function dateFormat(date) {
    return monthNames[date.getMonth()] + ' ' + date.getDate();
  }

  var xAxis = /*@__PURE__*/(function (Control) {
    function xAxis(state) {
      Control.call(this, 'g');

      this._state = state;
      this._container = new Element('g');

      this._height = 375;

      watch(state, {
        data: this._changeData.bind(this),
        theme: this._changeTheme.bind(this),
      });

      this._labels = [];
    }

    if ( Control ) xAxis.__proto__ = Control;
    xAxis.prototype = Object.create( Control && Control.prototype );
    xAxis.prototype.constructor = xAxis;

    xAxis.prototype._changeTheme = function _changeTheme (n) {
      this._labels.forEach(function (label) {
        label.label.attr('stroke', n.xAxis.textColor);
      });
    };

    xAxis.prototype._changeData = function _changeData (points) {
      var dateRange = points[points.length - 1] - points[0];
      var onePart = dateRange / 6;
      this._saved = onePart;

      for(var i = 0; i < 6; i++) {
        var date = dateFormat(new Date(points[0] + i * onePart));
        if(!this._labels[i]) {
          var label = new Element('text', {
            stroke: this._state.theme.xAxis.textColor,
            fontSize: 12,
            fontWeight: 100,
            alignmentBaseline: 'middle',
          });
          var container = new Element('g');

          label.node.appendChild(createTextNode(date));
          label.mount(container);
          container.mount(this._container);

          this._labels[i] = {
            label: label, container: container,
          };

        }

        var leftOffset = this._height / 6 * i + 10;
        this._labels[i].label.node.innerHTML = '';
        this._labels[i].label.node.appendChild(createTextNode(date));
        this._labels[i].container.attr('transform', ("translate(" + leftOffset + " 0)"));

      }
    };

    xAxis.prototype.mount = function mount (to) {
      this._container.mount(to);
      this._container.attr('transform', 'translate(15 420)');
    };

    xAxis.prototype.render = function render () {

    };

    return xAxis;
  }(Control));

  var Plot = /*@__PURE__*/(function (Control) {
    function Plot(state) {
      var this$1 = this;

      Control.call(this, 'g');
      this._state = state;

      this._plotAreaData = {
        data: {},
        theme: state.theme.Plot,
        maxValue: 0,
        minValue: 0,
      };

      this._xAxisData = reactive({
        data: [],
        theme: state.theme.Plot
      });

      this._series = {};
      this._totalPoints = 0;
      this._savedStartIndex = null;
      this._savedEndIndex = null;

      state.series
        .filter(function (s) { return s.type !== 'x'; })
        .forEach(function (s) {
          watch(s, {
            data: this$1._render,
            visible: function (n, o) { return this$1._changeVisible(s.id, n); }
          });

          this$1._plotAreaData.data[s.id] = {
            data: s.data,
            color: s.color,
            visible: s.visible
          };

          this$1._series[s.id] = s;
          this$1._totalPoints = s.data.length;
        });

      this._plotAreaData = reactive(this._plotAreaData);
      this._plotArea = new PlotArea(this._plotAreaData);
      this._plotArea.layout.viewbox({width: 400, height: 400});

      this._yAxis = new yAxis(this._plotAreaData);
      this._xAxis = new xAxis(this._xAxisData);

      watch(state, {
        range: this._changeRange.bind(this),
        theme: this._changeTheme.bind(this)
      });

      this._changeRange(this._state.range);

      var bg = new Element('rect', {fill: 'transparent', height: 420, width: 400});
      bg._el.addEventListener('mousemove', this._tooltipHandler.bind(this));
      bg._el.addEventListener('touchmove', this._tooltipHandler.bind(this));

      this._layout.push(bg);
      this._layout.push(this._yAxis);
      this._layout.push(this._xAxis);
      this._layout.push(this._plotArea);
    }

    if ( Control ) Plot.__proto__ = Control;
    Plot.prototype = Object.create( Control && Control.prototype );
    Plot.prototype.constructor = Plot;

    Plot.prototype._changeTheme = function _changeTheme (n) {
      this._plotAreaData.theme = n.Plot;
      this._xAxisData.theme = n.Plot;
    };

    Plot.prototype._tooltipHandler = function _tooltipHandler (e) {
      var x = !e.offsetX ? e.layerX : e.offsetX;
      this._calcTooltip(x);
    };

    Plot.prototype._calcTooltip = function _calcTooltip (x) {
      this._savedX = x;

      var length = 0;
      var max = this._plotArea._maxValue;
      forEach(this._plotAreaData.data, function (d, id) {
        if(!d.visible) {
          return;
        }

        length = d.data.length;
      });

      var xRatio = 400 / (length - 1);
      var yRatio = 400 / max;

      var index = Math.ceil((x - xRatio / 2) / xRatio);

      this._state.tooltip.visible = true;
      var values = this._testTooltip(index, xRatio, yRatio);
      this._state.tooltip.data = values;

      if(this._state.tooltip.xRatio === xRatio && this._state.tooltip.yRatio === yRatio && this._state.tooltip.index === index) {
        return;
      }

      this._state.tooltip.xRatio = xRatio;
      this._state.tooltip.yRatio = yRatio;
      this._state.tooltip.index = index;
      this._state.tooltip.label = this._xAxisData.data[index];
    };

    Plot.prototype._testTooltip = function _testTooltip (pointIndex, xRatio, yRatio) {
      var values = [];

      forEach(this._plotAreaData.data, function (d, id) {
        if(d.visible) {
          values.push({id: id, value: d.data[pointIndex]});
        }
      });

      return values;
    };

    Plot.prototype.mount = function mount (to) {
      // this._drawer.$container.mount(to);
    };

    Plot.prototype.render = function render () {

    };

    Plot.prototype._render = function _render () {
    };

    Plot.prototype._changeRange = function _changeRange (range) {
      var this$1 = this;

      var startFloatIndex = (range.left) * this._totalPoints;
      var endFloatIndex = (range.left + range.value) * this._totalPoints;

      var startIndex = Math.trunc(startFloatIndex);
      var endIndex = Math.trunc(endFloatIndex);
      this._state.tooltip.visible = false;

      startIndex = startIndex > 0 ? startIndex - 1 : startIndex;
      endIndex = endIndex < this._totalPoints - 1 ? endIndex + 1 : endIndex;

      if(this._savedStartIndex === startIndex && this._savedEndIndex === endIndex) {
        return;
      }

      this._savedStartIndex = startIndex;
      this._savedEndIndex = endIndex;

      this._xAxisData.data = this._state.series.find(function (s) { return s.type === 'x'; }).data.slice(startIndex, endIndex);

      forEach(this._plotAreaData.data, function (s, id) {
        s.data = this$1._series[id].data.slice(startIndex, endIndex);
      });

    };

    Plot.prototype._changeVisible = function _changeVisible (id, isVisible) {
      this._state.tooltip.visible = false;
      this._plotAreaData.data[id].visible = isVisible;
      // if(this._savedX && this._state.tooltip.visible) {
      //   this._calcTooltip(this._savedX);
      // }
    };

    return Plot;
  }(Control));

  function makeResizable(el, options) {
    // const element = document.querySelector(div);
    // const resizers = document.querySelectorAll(div + ' .resizer');
    var element = el._el;
    var original_width = 0;
    var original_height = 0;
    var original_x = 0;
    var original_y = 0;
    var original_mouse_x = 0;
    var original_mouse_y = 0;

    var originalDraverOffset = 0;

    var leftOffset = 0;
    var rightOffset = 0;

    forEach(options.resizers, function (er, align) {
      var currentResizer = er._el;
      var startResizeFn = function(e) {
        e.preventDefault();
        original_width = parseFloat(getComputedStyle(element, null).getPropertyValue('width').replace('px', ''));
        original_height = parseFloat(getComputedStyle(element, null).getPropertyValue('height').replace('px', ''));
        // original_x = element.getBoundingClientRect().left;
        original_x = parseFloat(el.attr('x'));
        original_y = element.getBoundingClientRect().top;
        original_mouse_x = e.pageX;
        original_mouse_y = e.pageY;

        originalDraverOffset = parseFloat(er.attr('x'));

        window.addEventListener('mousemove', resize);
        window.addEventListener('touchmove', resize);
        window.addEventListener('mouseup', stopResize);
        window.addEventListener('touchend', stopResize);
      };

      currentResizer.addEventListener('touchstart', startResizeFn);
      currentResizer.addEventListener('mousedown', startResizeFn);

      function resize(e) {
        // right
        if (align === 'right') {
          var width = original_width + (e.pageX - original_mouse_x);
          var draverOffset = originalDraverOffset - (original_width - width);

          if (width >= options.minWidth && width <= options.maxWidth && draverOffset >= options.minX && draverOffset <= options.maxX) {
            el.attr('width', width);
            er.attr('x', draverOffset);
            rightOffset = options.maxX - draverOffset;
            // TODO fix it
            options.hooks.after(width, draverOffset - width - 10, rightOffset);
          }
        }
        // left
        else if (align === 'left') {
          var width$1 = original_width - (e.pageX - original_mouse_x);
          var draverOffset$1 = originalDraverOffset + (original_width - width$1);

          if (width$1 >= options.minWidth && width$1 <= options.maxWidth && draverOffset$1 >= options.minX && draverOffset$1 <= options.maxX) {
            el.attr('width', width$1);
            el.attr('x', original_x + (e.pageX - original_mouse_x));

            er.attr('x', draverOffset$1);
            leftOffset = draverOffset$1;

            options.hooks.after(width$1, leftOffset, rightOffset);
          }
        }
      }

      function stopResize() {
        window.removeEventListener('mousemove', resize);
        window.removeEventListener('touchmove', resize);
      }
    });
  }

  function makeDraggable(el, options) {
    // const element = document.querySelector(div);
    // const resizers = document.querySelectorAll(div + ' .resizer');
    var element = el._el;
    var original_width = 0;
    var original_height = 0;
    var original_x = 0;
    var original_y = 0;
    var original_mouse_x = 0;
    var original_mouse_y = 0;

    var dragFn = function (e) {
      e.preventDefault();
      original_width = parseFloat(getComputedStyle(element, null).getPropertyValue('width').replace('px', ''));
      original_height = parseFloat(getComputedStyle(element, null).getPropertyValue('height').replace('px', ''));
      // original_x = element.getBoundingClientRect().left;
      original_x = parseFloat(el.attr('x'));
      original_y = element.getBoundingClientRect().top;
      original_mouse_x = e.pageX;
      original_mouse_y = e.pageY;

      window.addEventListener('mousemove', dragging);
      window.addEventListener('touchmove', dragging);
      window.addEventListener('mouseup', stopDragging);
      window.addEventListener('touchend', stopDragging);

      function dragging(e) {
        var x = original_x + e.pageX - original_mouse_x;
        if(x >= options.minX && x + original_width <= options.maxX) {
          el.attr('x', x);
          options.hooks.after(original_width, x);
        }

      }

      function stopDragging() {
        window.removeEventListener('touchmove', dragging);
        window.removeEventListener('mousemove', dragging);
      }
    };

    el.addEventListener('mousedown', dragFn);
    el.addEventListener('touchstart', dragFn);
  }

  var Drawer = function Drawer(state, theme, options) {
    this._theme = theme;
    this._state = state;
    this._options = options;
    this.$container = new Element('g');
    this.$drawerContainer = new Element('g');

    this._init();
  };

  Drawer.prototype.changeTheme = function changeTheme (theme) {
    this._theme = theme;

    var handlerWidth = this._theme.handlerWidth;
    var border = this._theme.border;
    var maskColor = this._theme.maskColor;
    var borderColor = this._theme.borderColor;

    this.$left.attr({
      width: handlerWidth,
    });

    this.$right.attr({
      width: handlerWidth,
    });

    this.$backMask.attr({
      fill: maskColor
    });

    this.$borderMask.attr({
      fill: borderColor
    });

    // this.$alpha = new Element('rect', {
    // width: '100%',
    // height: '100%',
    // fill: 'rgba(255,255,255, 0.5)',
    // });
  };

  Drawer.prototype._init = function _init () {
      var this$1 = this;

    var height = this._options.height;
    var width = this._options.width;
    var handlerWidth = this._theme.handlerWidth;
    var border = this._theme.border;
    var maskColor = this._theme.maskColor;
    var borderColor = this._theme.borderColor;

    var maskId = makeId(10);
    this.$maskContainer = new Element('mask', {
      id: maskId,
    });

    this.$left = new Element('rect', {
      width: handlerWidth,
      height: height,
      fill: 'transparent',
      x: width * this._state.range.left,
      y: 0,
    });

    this.$right = new Element('rect', {
      width: handlerWidth,
      height: height,
      fill: 'transparent',
      x: width * this._state.range.left - handlerWidth,
      y: 0,
    });

    this.$contains = new Element('rect', {
      width: width * this._state.range.value - handlerWidth * 2,
      height: height - border * 2,
      x: width * this._state.range.left + handlerWidth,
      y: border,
      class: 'contains',
    });

    this.$backMask = new Element('rect', {
      width: width,
      height: height,
      fill: maskColor,
      x: 0,
      y: 0,
      mask: ("url(#" + maskId + ")"),
    });

    this.$borderMask = new Element('rect', {
      width: width * this._state.range.value,
      height: height,
      x: width * this._state.range.left,
      y: 0,
      fill: borderColor,
      mask: ("url(#" + maskId + ")"),
      style: {
        cursor: 'ew-resize',
      }
    });

    this.$alpha = new Element('rect', {
      width: '100%',
      height: '100%',
      fill: 'rgba(255,255,255, 0.5)',
    });

    this.$alpha.mount(this.$maskContainer);
    this.$contains.mount(this.$maskContainer);

    this.$maskContainer.mount(this.$container);
    this.$backMask.mount(this.$container);

    this.$borderMask.mount(this.$drawerContainer);
    this.$right.mount(this.$drawerContainer);
    this.$left.mount(this.$drawerContainer);

    this.$drawerContainer.mount(this.$container);

    makeResizable(this.$contains, {
      resizers: {
        left: this.$left,
        right: this.$right,
      },
      maxWidth: width - handlerWidth * 2,
      minWidth: handlerWidth,
      maxX: width - handlerWidth,
      minX: 0,
      hooks: {
        after: function (newWidth, offsetLeft, offsetRight) {
          var visiblePercent = (newWidth + handlerWidth * 2) / width;
          var offsetLeftPercent = offsetLeft / width;

          this$1._state.range = {
            left: offsetLeftPercent,
            value: visiblePercent
          };

          this$1.$borderMask.attr('x', offsetLeft);
          this$1.$borderMask.attr('width', newWidth + handlerWidth * 2);
          // console.log(newWidth);

          // this.emit('changeRange', this.$currentRange);
        }
      }
    });

    makeDraggable(this.$borderMask, {
      maxX: width,
      minX: 0,
      hooks: {
        after: function (newWidth, offsetLeft) {
          // console.log(newWidth);
          var visiblePercent = (newWidth) / width;
          var offsetLeftPercent = offsetLeft / width;

          this$1._state.range = {
            left: offsetLeftPercent,
            value: visiblePercent
          };

          this$1.$contains.attr('x', offsetLeft + handlerWidth);
          this$1.$borderMask.attr('x', offsetLeft);
          this$1.$left.attr('x', offsetLeft);
          this$1.$right.attr('x', offsetLeft + newWidth - handlerWidth);

          // this.$sEvents.emit('Navigator:changeRange', this.$currentRange);
          // this.emit('changeRange', this.$currentRange);
        }
      }
    });
  };

  var Navigator = /*@__PURE__*/(function (Control) {
    function Navigator(state) {
      var this$1 = this;

      Control.call(this, 'g');

      this._state = state;

      watch(state, {
        theme: function (newTheme) {
          this$1._plotAreaData.theme = newTheme.Navigator;

          this$1._drawer.changeTheme(newTheme.Navigator.Drawer);
          this$1._bg.attr('fill', state.theme.Navigator.background);
        }
      });

      this._bg = new Element('rect', {
        width: 380,
        height: 50,
        fill: state.theme.Navigator.background
      });

      this._plotAreaData = {
        data: {},
        theme: state.theme.Navigator,
      };

      this._series = state.series
        .filter(function (s) { return s.type !== 'x'; })
        .map(function (s) {
          watch(s, {
            data: this$1._render,
            visible: function (n, o) { return this$1._changeVisible(s.id, n); }
          });

          this$1._plotAreaData.data[s.id] = {
            data: s.data,
            color: s.color,
            visible: s.visible
          };

          return s;
        });

      this._plotAreaData = reactive(this._plotAreaData);
      this._plotArea = new PlotArea(this._plotAreaData);
      this._plotArea.layout.viewbox({width: 378, height: 42});
      this._plotArea.layout.position({top: 4, left: 1});

      // this._drawer = new Drawer(state, state.theme.Navigator.Drawer, {width: 380, height: state.theme.Navigator.height});
      this._drawer = new Drawer(state, state.theme.Navigator.Drawer, {width: 380, height: state.theme.Navigator.height});
      this._layout.push(this._bg);
      this._layout.push(this._plotArea.layout);
      this._layout.push(this._drawer.$container);
    }

    if ( Control ) Navigator.__proto__ = Control;
    Navigator.prototype = Object.create( Control && Control.prototype );
    Navigator.prototype.constructor = Navigator;

    Navigator.prototype.mount = function mount (to) {

    };

    Navigator.prototype.render = function render () {

    };

    Navigator.prototype._render = function _render () {
    };

    Navigator.prototype._changeData = function _changeData () {
      console.log('changeData');
    };

    Navigator.prototype._changeVisible = function _changeVisible (id, isVisible) {
      this._plotAreaData.data[id].visible = isVisible;
    };

    return Navigator;
  }(Control));

  var monthNames$1 = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  var dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  function dateFormat$1(date) {
    return dayNames[date.getDay()] + ', ' + monthNames$1[date.getMonth()] + ' ' + date.getDate();
  }

  var Wrapper = function Wrapper(state) {
    this._state = state;

    this._container = new Element('g', {
      style: {
        transition: 'all 100ms'
      }
    });
    this._textGroup = new Element('g');
    this._ratio = 0;

    this._textGroup.attr('transform', 'translate(0, 35)');

    this._tooltipWidth = 100;
    this._tooltipHeight = 60;

    this._bg = new Element('rect', {
      width: this._tooltipWidth,
      height: this._tooltipHeight,
      fill: state.theme.Tooltip.background,
      stroke: state.theme.Tooltip.borderColor,
      strokeWidth: 1,
      rx: 5,
      ry: 5,
    });

    this._header = new Element('text', {
      x: 10,
      y: 15,
      alignmentBaseline: 'middle',
      fontSize: 12,
      strokeWidth: 0,
      fill: state.theme.Tooltip.labelColor,
    });

    this._wayLine = new Element('line', {
      x1: 0,
      y1: 0,
      x2: 0,
      y2: 420,
      stroke: state.theme.Tooltip.wayLineColor,
      visibility: 'hidden'
    });

    this._contentText = [];
    this._label = '';

    watch(state, {
      theme: this._changeTheme.bind(this),
    });

    this._bg.mount(this._container);
    this._header.mount(this._container);
    this._textGroup.mount(this._container);

    this._container.attr('visibility', 'hidden');
  };

  Wrapper.prototype._changeTheme = function _changeTheme (n) {
    this._header.attr('fill', n.Tooltip.labelColor);
    this._wayLine.attr('stroke', n.Tooltip.wayLineColor);
    this._bg.attr({
      fill: n.Tooltip.background,
      stroke: n.Tooltip.borderColor,
    });
  };

  Wrapper.prototype.changeVisible = function changeVisible (isVisible) {
    this._container.attr('opacity', isVisible ? 1 : 0);
    this._container.attr('visibility', isVisible ? 'visible' : 'hidden');
    this._wayLine.attr('visibility', isVisible ? 'visible' : 'hidden');
  };

  Wrapper.prototype.render = function render () {
    var all = this._state.tooltip.data.map(function (d) { return d.value; });

    this._header.node.innerHTML = '';
    this._label = dateFormat$1(new Date(this._state.tooltip.label));
    this._header.node.appendChild(createTextNode(this._label));
    this._renderText(this._state.tooltip.data);
    this.setPosition(this._state.tooltip.index, this._state.tooltip.xRatio, this._state.tooltip.yRatio, Math.max.apply(Math, all));
  };

  Wrapper.prototype._renderText = function _renderText (data) {
      var this$1 = this;

    var widthPerItem = 0;

    data.forEach(function (el) {
      var s = this$1._state.series.find(function (s) { return s.id === el.id; });
      var value = formatBigNumber(el.value);
      if(!this$1._contentText[el.id]) {
        this$1._contentText[el.id] = this$1._createTextGroup();
      }

      widthPerItem = widthPerItem < value.toString().length ? value.toString().length : widthPerItem;
      widthPerItem = widthPerItem < s.label.toString().length ? s.label.toString().length : widthPerItem;

      this$1._updateTextNode(this$1._contentText[el.id], s.label, value, s.color);
    });

    widthPerItem = widthPerItem * 12;

    var visibleData = {};

    forEach(this._contentText, function (t, id, num) {
      if(t.visible && data.find(function (el) { return el.id === id; })) {
        visibleData[id] = t;
        t.container.attr('visibility', 'visible');
      } else {
        t.container.attr('visibility', 'hidden');
      }
    });


    var tempWidth = (widthPerItem) * 2 + 10;
    var labelWidth = this._label.length * 6.2 + 20;

    if(labelWidth > tempWidth) {
      widthPerItem = labelWidth / 2;
    }

    forEach(visibleData, function (t, id, num) {
      var offsetY = Math.floor(num / 2) * 35;

      t.container.attr('transform', ("translate(" + (num % 2 * widthPerItem + 10) + " " + offsetY + ")"));
    });

    this._tooltipWidth = tempWidth > labelWidth ? tempWidth : labelWidth;
    this._tooltipHeight = Math.ceil(Object.keys(visibleData).length / 2) * 35 + 30;
  };

  Wrapper.prototype._updateTextNode = function _updateTextNode (text, label, value, color) {
    text.container.style('fill', color);

    text.label._el.innerHTML = '';
    text.value._el.innerHTML = '';

    text.label._el.appendChild(createTextNode(label));
    text.value._el.appendChild(createTextNode(value));
  };

  Wrapper.prototype._createTextGroup = function _createTextGroup () {
    var container = new Element('g');

    var labelEl = new Element('text', {
      style: {
        fontWeight: 200,
        fontSize: '12px'
      },
      y: 15,
      alignmentBaseline: 'middle',
    });

    var valueEl = new Element('text', {
      style: {
        fontWeight: 600,
        fontSize: '14px'
      },
      alignmentBaseline: 'middle',
    });

    valueEl.mount(container);
    labelEl.mount(container);

    container.mount(this._textGroup);

    return {
      container: container,
      label: labelEl,
      value: valueEl,
      visible: true,
    };
  };

  Wrapper.prototype.setPosition = function setPosition (index, xRatio, yRatio, max) {
    // let transformX = ratio > 20 ? index * ratio - ratio : index * ratio - 20;
    var transformX = 0;
    var transformY = 0;

    var offsetY = 400 - max * yRatio;
    var offsetX = index * xRatio;

    var elWidth = this._tooltipWidth;
    var elHeight = this._tooltipHeight;

    var maxPadding = 20;
    var minPadding = 10;

    var padding = xRatio;

    var width = 400;

    if(padding > maxPadding) {
      padding = maxPadding;
    } else if(padding < minPadding) {
      padding = minPadding;
    }

    if(offsetY < elHeight + padding) {
      if(offsetX + elWidth + padding > width) {
        transformX = offsetX - elWidth - padding;
      } else {
        transformX = offsetX + padding;
      }
    } else {
      if(offsetX + elWidth - padding > width) {
        transformX = offsetX - elWidth + padding;
      } else {
        transformX = offsetX - padding;
      }
    }

    if(transformX < padding) {
      transformX = padding;
    } else if(transformX + elWidth + padding > width) {
      transformX = width - elWidth - padding;
    }

    transformX = transformX > padding ? transformX : padding;

    var transformContainer = "translate(" + transformX + " " + transformY + ")";
    var transformLine = "translate(" + (index * xRatio) + " 0)";

    // animate({
    // duration: 200,
    // timing: (timeFraction) => {
    //   return timeFraction;
    // },
    // draw: (progress) => {
    //   this._container.attr('transform', `translate(${transformX} ${transformY})`)
    // }
    // });

    this._container.attr('transform', transformContainer);
    this._bg.attr({
      width: this._tooltipWidth,
      height: this._tooltipHeight,
    });
    this._wayLine.attr('transform', transformLine);

    // this.setVisibility(true);
  };

  var Tooltip = /*@__PURE__*/(function (Control) {
    function Tooltip(state) {
      Control.call(this, 'g');
      this._state = state;
      this._wrapper = new Wrapper(state);
      this._marksContainer = new Element('g');

      this._marks = {};

      watch(state.tooltip, {
        visible: this._changeVisible.bind(this),
        data: this._changeData.bind(this),
      });

      watch(state, {
        theme: this._changeTheme.bind(this),
      });
    }

    if ( Control ) Tooltip.__proto__ = Control;
    Tooltip.prototype = Object.create( Control && Control.prototype );
    Tooltip.prototype.constructor = Tooltip;

    Tooltip.prototype._changeTheme = function _changeTheme (n) {
      forEach(this._marks, function (m) {
        m.attr('fill', n.Tooltip.Mark.background);
      });
    };

    Tooltip.prototype._changeVisible = function _changeVisible (isVisible) {
      this._wrapper.changeVisible(isVisible);

      forEach(this._marks, function (m) {
        m.style('visibility', 'hidden');
      });
    };

    Tooltip.prototype._changeData = function _changeData () {
      var this$1 = this;

      this._wrapper.render();

      this._state.tooltip.data.forEach(function (el) {
        if(!this$1._marks[el.id]) {
          var s = this$1._state.series.find(function (s) { return s.id === el.id; });
          this$1._marks[el.id] = new Element('circle', {
            r: 5,
            stroke: s.color,
            strokeWidth: 3,
            fill: this$1._state.theme.Tooltip.Mark.background,
            style: {
              visibility: 'hidden',
            }
          });

          this$1._marks[el.id].mount(this$1._marksContainer);
        }

        this$1._marks[el.id].attr({
          cx: this$1._state.tooltip.index * this$1._state.tooltip.xRatio,
          cy: 420 - el.value * this$1._state.tooltip.yRatio,
        });

        this$1._marks[el.id].style('visibility', 'visible');
      });

      Object.keys(this._marks).forEach(function (id) {
        if(!this$1._state.tooltip.data.find(function (el) { return el.id === id; })) {
          this$1._marks[id].style('visibility', 'hidden');
        }
      });
    };

    Tooltip.prototype.mount = function mount (to) {
      this._wrapper._wayLine.mount(to);
      this._marksContainer.mount(to);
      this._wrapper._container.mount(to);
    };

    Tooltip.prototype.render = function render () {

    };

    return Tooltip;
  }(Control));

  var TChart = function TChart(opts) {
    var this$1 = this;

    this._options = opts;
    this._root = new Layout('svg');

    var series = opts.columns.map(function (column) {
      var id = column[0];
      return {
        id: id,
        data: column.slice(1),
        visible: true,
        type: opts.types[id],
        color: opts.colors[id] || null,
        label: opts.names[id] || null
      };
    });

    this._state = reactive({
      series: series,
      tooltip: {
        filterId: makeId(10),
        visible: false,
        data: [],
        index: 0,
        xRatio: 0,
        yRatio: 0,
        label: '',
      },
      theme: LightTheme,
      range: {
        left: 0.65,
        value: 0.35
      },
    });

    watch(this._state, {
      theme: function () {
        this$1._root._container.style('background', this$1._state.theme.Root.background);
      }
    });

    this._init();
  };

  TChart.prototype._init = function _init () {
    var plot = new Plot(this._state);
    var navigator = new Navigator(this._state);
    var tooltip = new Tooltip(this._state);
    // const navLayout = new Layout({zIndex: 2});
    // const tooltipLayout = new Layout({zIndex: 3});

    // plotLayout.push(new Navigator());
    plot.layout.position({top: 20});
    navigator.layout.position({top: 460, left: 10});

    this._root.push(navigator.layout);
    this._root.push(plot.layout);
    this._root.push(tooltip.layout);


    // this._state.series[0].visible = false;
    // this._state.series[0].data.push(1);
  };

  TChart.prototype.changeTheme = function changeTheme (name) {
    this._state.theme = name === 'night' ? NightTheme : LightTheme;
  };

  TChart.prototype.mount = function mount (to) {
    var width = 400;
    var height = 520;

    this._root.viewbox({
      width: width,
      height: height,
    });

    this._root._container.attr({
      width: (width + "px"),
      height: (height + "px"),
      viewbox: ("0 0 " + width + " " + height),
      version: 1.1,
      xmlns: 'http://www.w3.org/2000/svg',
      style: {
        background: this._state.theme.Root.background
      }
    });

    this._root._container.style('fontFamily', 'Roboto');

    this._root._container._el.insertAdjacentHTML('afterBegin',
    '<defs>' +
      '<filter id="' + this._state.tooltip.filterId + '" x="-0.5" y="-0.5" width="200%" height="200%"><feGaussianBlur in="SourceAlpha" stdDeviation="3"></feGaussianBlur> <!-- stdDeviation is how much to blur -->' +
        '<feOffset dx="0" dy="0" result="offsetblur"></feOffset> <!-- how much to offset -->' +
        '<feComponentTransfer>' +
          '<feFuncA type="linear" slope="0.08"></feFuncA> <!-- slope is the opacity of the shadow -->' +
        '</feComponentTransfer>' +
        '<feMerge>' +
          '<feMergeNode></feMergeNode> <!-- this contains the offset blurred image -->' +
          '<feMergeNode in="SourceGraphic"></feMergeNode> <!-- this contains the element that the filter is applied to -->' +
        '</feMerge>' +
      '</filter>' +
      '<filter x="0" y="0" width="1" height="1" id="solid">' +
        '<feFlood flood-color="white"/>' +
        '<feComposite in="SourceGraphic" operator="xor" />' +
      '</filter>' +
    '</defs>'
  );

    this._root.mount(to);

    return this;
  };

  TChart.prototype.render = function render (theme) {
    // select theme
    this.changeTheme(theme);
    this._root.render();
  };

  return TChart;

}());
//# sourceMappingURL=tchart.js.map
