var days = ['m', 't', 'w', 'h', 'f'];
var daynames = {'m': 'Mon', 't': 'Tue', 'w': 'Wed', 'h': 'Thu', 'f': 'Fri'};

function makeDayTime(s) {
	return new Date("Jan 1, 1970 " + s);
}

class ScheduleItem {
	constructor(name, place, startTime, endTime, days) {
		this.name = name;
		this.place = place;
		this.startTime = startTime;
		this.endTime = endTime;
		this.days = days;
	}
}

class ScheduleRenderer {
	constructor(canvas, startTime, endTime, cwidth, cheight) {
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

	addItem(item) {
		this.items.push(item);
	}

	clearItems() {
		this.items = [];
	}

	drawGrid() {
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

		for (var day of days.slice(1)) {
			var y = this._oy + days.indexOf(day) / 5 * this._realHeight;
			var line = this.canvas.line(0, y, this.cwidth, y);
			line.attr({
				stroke: "gray",
				strokeWidth: 1
			});
		}

		for (var day of days) {
			var y = this._oy + days.indexOf(day) / 5 * this._realHeight;
			var text = this.canvas.text(5, y+18, daynames[day]);
		}
	}

	drawItem(item) {
		for (var d of item.days) {
			var xs = this._ox + (item.startTime - this.startTime) / (this.endTime - this.startTime) * this._realWidth;
			var xe = this._ox + (item.endTime - this.startTime) / (this.endTime - this.startTime) * this._realWidth;
			var ys = this._oy + days.indexOf(d) / 5 * this._realHeight + 6;

			var r = this.canvas.rect(xs,ys,xe-xs,this._realHeight/5 - 12, 5, 5);
			r.attr({
				fill: Please.make_color(),
				stroke: "#000000",
				strokeWidth: 4
			});

			var name = this.canvas.text(xs+5, ys+18, item.name);
			var place = this.canvas.text(xs+5, ys+38, item.place);
		}
	}

	render() {
		this.canvas.clear();
		this.drawGrid();
		for (var item of this.items) {
			this.drawItem(item);
		}
		this.canvas.selectAll("text").attr({
			fontFamily: "monospace",
			fontSize: 15
		});
	}
}

var renderer = new ScheduleRenderer(Snap("#canvas"), makeDayTime("7:00 AM"), makeDayTime("7:00 PM"), $("#canvas").width(), $("#canvas").height());
renderer.addItem(new ScheduleItem("Name", "Place", makeDayTime("8:00 AM"), makeDayTime("8:50 AM"), ['m', 'w', 'f']));
renderer.addItem(new ScheduleItem("Name2", "Place2", makeDayTime("7:00 AM"), makeDayTime("7:00 PM"), ['t', 'h']));
renderer.render();

console.log(renderer);
