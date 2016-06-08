'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var days = ['m', 't', 'w', 'h', 'f'];
var daynames = { 'm': 'Mon', 't': 'Tue', 'w': 'Wed', 'h': 'Thu', 'f': 'Fri' };

function makeDayTime(s) {
	return new Date("Jan 1, 1970 " + s);
}

var ScheduleItem = function ScheduleItem(name, place, startTime, endTime, days) {
	_classCallCheck(this, ScheduleItem);

	this.name = name;
	this.place = place;
	this.startTime = startTime;
	this.endTime = endTime;
	this.days = days;
};

var ScheduleRenderer = function () {
	function ScheduleRenderer(canvas, startTime, endTime, cwidth, cheight) {
		_classCallCheck(this, ScheduleRenderer);

		this.canvas = canvas;
		this.items = [];

		this.cwidth = cwidth;
		this.cheight = cheight;

		this._ox = 60;
		this._oy = 8;
		this._realWidth = cwidth - 68;
		this._realHeight = cheight - 28;

		this.startTime = startTime;
		this.endTime = endTime;
	}

	_createClass(ScheduleRenderer, [{
		key: 'addItem',
		value: function addItem(item) {
			this.items.push(item);
		}
	}, {
		key: 'clearItems',
		value: function clearItems() {
			this.items = [];
		}
	}, {
		key: 'setItemsFromString',
		value: function setItemsFromString(s) {
			this.clearItems();
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = s.split("\n")[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var line = _step.value;

					if (line == "" || line.charAt(0) == "#") continue;

					var _line$split$map = line.split(',').map(function (x) {
						return x.trim();
					});

					var _line$split$map2 = _slicedToArray(_line$split$map, 5);

					var name = _line$split$map2[0];
					var place = _line$split$map2[1];
					var start = _line$split$map2[2];
					var end = _line$split$map2[3];
					var days = _line$split$map2[4];

					var startTime = makeDayTime(start);
					var endTime = makeDayTime(end);
					if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) return false;
					this.addItem(new ScheduleItem(name, place, makeDayTime(start), makeDayTime(end), Array.from(days)));
				}
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator.return) {
						_iterator.return();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
			}

			return true;
		}
	}, {
		key: 'drawGrid',
		value: function drawGrid() {
			var d = new Date(this.startTime);
			while (this.endTime - d > 0) {
				var x = this._ox + (d - this.startTime) / (this.endTime - this.startTime) * this._realWidth;
				var line = this.canvas.line(x, 0, x, this.cheight);
				line.attr({
					stroke: "gray",
					strokeWidth: 1
				});
				var text = this.canvas.text(x + 5, this.cheight, d.getHours() == 12 ? 12 : d.getHours() % 12);
				d.setHours(d.getHours() + 1);
			}

			var _iteratorNormalCompletion2 = true;
			var _didIteratorError2 = false;
			var _iteratorError2 = undefined;

			try {
				for (var _iterator2 = days.slice(1)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
					var day = _step2.value;

					var y = this._oy + days.indexOf(day) / 5 * this._realHeight;
					var line = this.canvas.line(0, y, this.cwidth, y);
					line.attr({
						stroke: "gray",
						strokeWidth: 1
					});
				}
			} catch (err) {
				_didIteratorError2 = true;
				_iteratorError2 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion2 && _iterator2.return) {
						_iterator2.return();
					}
				} finally {
					if (_didIteratorError2) {
						throw _iteratorError2;
					}
				}
			}

			var _iteratorNormalCompletion3 = true;
			var _didIteratorError3 = false;
			var _iteratorError3 = undefined;

			try {
				for (var _iterator3 = days[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
					var day = _step3.value;

					var y = this._oy + days.indexOf(day) / 5 * this._realHeight;
					var text = this.canvas.text(5, y + 18, daynames[day]);
				}
			} catch (err) {
				_didIteratorError3 = true;
				_iteratorError3 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion3 && _iterator3.return) {
						_iterator3.return();
					}
				} finally {
					if (_didIteratorError3) {
						throw _iteratorError3;
					}
				}
			}
		}
	}, {
		key: 'drawItem',
		value: function drawItem(item) {
			var color = Please.make_color();
			var _iteratorNormalCompletion4 = true;
			var _didIteratorError4 = false;
			var _iteratorError4 = undefined;

			try {
				for (var _iterator4 = item.days[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
					var d = _step4.value;

					var xs = this._ox + (item.startTime - this.startTime) / (this.endTime - this.startTime) * this._realWidth;
					var xe = this._ox + (item.endTime - this.startTime) / (this.endTime - this.startTime) * this._realWidth;
					var ys = this._oy + days.indexOf(d) / 5 * this._realHeight + 6;

					var r = this.canvas.rect(xs, ys, xe - xs, this._realHeight / 5 - 12, 5, 5);
					r.attr({
						fill: color,
						stroke: "#000000",
						strokeWidth: 4
					});

					var name = this.canvas.text(xs + 5, ys + 18, item.name).addClass("item-text");
					var place = this.canvas.text(xs + 5, ys + 38, item.place).addClass("item-text");
				}
			} catch (err) {
				_didIteratorError4 = true;
				_iteratorError4 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion4 && _iterator4.return) {
						_iterator4.return();
					}
				} finally {
					if (_didIteratorError4) {
						throw _iteratorError4;
					}
				}
			}
		}
	}, {
		key: 'render',
		value: function render() {
			this.canvas.clear();
			this.drawGrid();
			var _iteratorNormalCompletion5 = true;
			var _didIteratorError5 = false;
			var _iteratorError5 = undefined;

			try {
				for (var _iterator5 = this.items[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
					var item = _step5.value;

					this.drawItem(item);
				}
			} catch (err) {
				_didIteratorError5 = true;
				_iteratorError5 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion5 && _iterator5.return) {
						_iterator5.return();
					}
				} finally {
					if (_didIteratorError5) {
						throw _iteratorError5;
					}
				}
			}

			this.canvas.selectAll("text").attr({
				fontFamily: "monospace",
				fontSize: 15
			});
			this.canvas.selectAll(".item-text").attr({
				fontSize: 12
			});
		}
	}]);

	return ScheduleRenderer;
}();

$(document).ready(function () {
	var renderer = new ScheduleRenderer(Snap("#canvas"), makeDayTime("7:00 AM"), makeDayTime("7:00 PM"), $("#canvas").width(), $("#canvas").height());
	renderer.render();
	var hash = window.location.hash ? window.location.hash.substring(1) : null;

	var sString = null;
	if (hash != null) {
		sString = atob(hash);
		renderer.setItemsFromString(sString);
		renderer.render();
	}

	$("#inputText").keydown(function (e) {
		if (e.keyCode == 13 && e.ctrlKey) {
			var text = $("#inputText").val();
			text = text.split('\n').filter(function (line) {
				return !(line == "" || line.startsWith('#'));
			}).join('\n');
			var success = renderer.setItemsFromString(text);
			if (!success) alert("Malformed input");
			renderer.cwidth = $("#canvas").width();
			renderer.cheight = $("#canvas").height();
			renderer.render();

			var encoded = btoa(text);
			$("#shareLink").attr("href", "#" + encoded);

			e.preventDefault();
		}
	});

	var text = '# Enter classes using the following format (lines starting with # are ignored). Use Ctrl-Enter to display.\n# Class, Location, 8:00 AM, 8:50 AM, mwf\n# Class, Location, 11:00 AM, 12:15 PM, th';
	text = sString ? text + '\n' + sString : text;

	$("#inputText").val(text);
});