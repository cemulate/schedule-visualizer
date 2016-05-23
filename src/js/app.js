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

	setItemsFromString(s) {
		this.clearItems();
        for (var line of s.split("\n")) {
            if (line == "" || line.charAt(0) == "#") continue;

			var [name, place, start, end, days] = line.split(',').map(x => x.trim());
			var startTime = makeDayTime(start);
			var endTime = makeDayTime(end);
			if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) return false;
            this.addItem(new ScheduleItem(name, place, makeDayTime(start), makeDayTime(end), Array.from(days)));
        }
		return true;
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
		var color = Please.make_color();
		for (var d of item.days) {
			var xs = this._ox + (item.startTime - this.startTime) / (this.endTime - this.startTime) * this._realWidth;
			var xe = this._ox + (item.endTime - this.startTime) / (this.endTime - this.startTime) * this._realWidth;
			var ys = this._oy + days.indexOf(d) / 5 * this._realHeight + 6;

			var r = this.canvas.rect(xs,ys,xe-xs,this._realHeight/5 - 12, 5, 5);
			r.attr({
				fill: color,
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

$(document).ready(function() {
	var renderer = new ScheduleRenderer(Snap("#canvas"), makeDayTime("7:00 AM"), makeDayTime("7:00 PM"), $("#canvas").width(), $("#canvas").height());
	renderer.render();
	var hash = window.location.hash ? window.location.hash.substring(1) : null;

	var sString = null;
	if (hash != null) {
		sString = decodeURIComponent(hash);
		renderer.setItemsFromString(sString);
		renderer.render();
	}

	$("#inputText").keydown(e => {
		if (e.keyCode == 13 && e.ctrlKey) {
			var text = $("#inputText").val();
			text = text.split('\n').filter(line => !(line == "" || line.startsWith('#'))).join('\n');
			var success = renderer.setItemsFromString(text);
			if (!success) alert("Malformed input");
			renderer.render();

			var encoded = encodeURIComponent(text);
			$("#shareLink").attr("href", "#" + encoded);

			e.preventDefault();
		}
	});

	var text = `# Enter classes using the following format (lines starting with # are ignored)
# Class, Location, 8:00 AM, 8:50 AM, mwf
# Class, Location, 11:00 AM, 12:15 PM, th`
	text = sString ? text + '\n' + sString : text;

	$("#inputText").val(text);

});
