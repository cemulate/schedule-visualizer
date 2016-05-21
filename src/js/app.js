var daymap = {'m':0, 't':1, 'w':2, 'h':3, 'f':4};

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

		this._ox = 8;
		this._oy = 8;
		this._realWidth = cwidth - 16;
		this._realHeight = cheight - 16;

		this.startTime = startTime;
		this.endTime = endTime;
	}

	addItem(item) {
		this.items.push(item);
	}

	clearItems() {
		this.items = [];
	}

	drawItem(item) {
		for (var d of item.days) {
			var xs = this._ox + (item.startTime - this.startTime) / (this.endTime - this.startTime) * this._realWidth;
			var xe = this._ox + (item.endTime - this.startTime) / (this.endTime - this.startTime) * this._realWidth;
			var ys = this._oy + daymap[d] / 5 * this._realHeight + 10;

			var r = this.canvas.rect(xs,ys,xe-xs,this.cheight/5 - 10, 5, 5);
			r.attr({
				fill: Please.make_color(),
				stroke: "#000000",
				strokeWidth: 4
			});
		}
	}

	render() {
		this.canvas.clear();
		for (var item of this.items) {
			this.drawItem(item);
		}
	}
}

var renderer = new ScheduleRenderer(Snap("#canvas"), makeDayTime("7:00 AM"), makeDayTime("7:00 PM"), $("#canvas").width(), $("#canvas").height());
renderer.addItem(new ScheduleItem("Name", "Place", makeDayTime("8:00 AM"), makeDayTime("8:50 AM"), ['m', 'w', 'f']));
renderer.addItem(new ScheduleItem("Name2", "Place2", makeDayTime("7:00 AM"), makeDayTime("7:00 PM"), ['t', 'h']));
renderer.render();

console.log(renderer);
