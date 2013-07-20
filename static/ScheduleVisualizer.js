function ScheduleVisualizer(width, height) {

    this.width = width
    this.height = height

    this.surface = new Kinetic.Layer()

    this.config = {
        rowHeight: 80,
        startTime: Date.parse("7:00 am"),
        endTime: Date.parse("8:00 pm"),
        leftMarginWidth: 100,
        topMargin: 1,
        animEnlarge: 30
    }

    this.drawBackground()

}

ScheduleVisualizer.prototype.nextColor = function () {
    if (!this._colorBank) {
        this._colorBank = ["#44FF66", "#44FF99", "#44FFCC", "#44FFFF", "#44CCFF", "#44AAFF"]
    }

    var c = this._colorBank.shift()
    this._colorBank.push(c)
    return c
}

ScheduleVisualizer.prototype.parseInput = function (s) {
    
    try {
        lines = s.split("\n")

        this.data = []

        var i = 0
        for (i = 0; i < lines.length; i ++) {
            if (lines[i] == "") {
                continue
            } else if (lines[i].charAt(0) == "#") {
                continue
            }

            parts = lines[i].split(',')

            name = parts[0]
            room = parts[1]

            sTime = Date.parse(parts[2])
            eTime = Date.parse(parts[3])

            dayString = parts[4]

            this.data.push({
                name: name, 
                room: room, 
                startTime: sTime, 
                endTime: eTime, 
                dayString: dayString
            })
        }

        this.update()
    
    } catch(err) {
        alert("Input syntax error")
    }

}

ScheduleVisualizer.prototype.letterToYValue = function (letter) {
    if (letter == "m") {
        return this.config.topMargin + 0 * this.config.rowHeight
    } else if (letter == "t") {
        return this.config.topMargin + 1 * this.config.rowHeight
    } else if (letter == "w") {
        return this.config.topMargin + 2 * this.config.rowHeight
    } else if (letter == "h") {
        return this.config.topMargin + 3 * this.config.rowHeight
    } else if (letter == "f") {
        return this.config.topMargin + 4 * this.config.rowHeight
    }
}

ScheduleVisualizer.prototype.update = function () {
    if (!this._mainGroup) {
        this._mainGroup = new Kinetic.Group()
        this.surface.add(this._mainGroup)
    }

    this._mainGroup.removeChildren()

    totalDiff = this.config.endTime - this.config.startTime

    var i = 0
    for (i = 0; i < this.data.length; i ++) {

        var color = this.nextColor()

        var cl = this.data[i]

        var x = ((cl.startTime - this.config.startTime) / totalDiff) * (this.width - this.config.leftMarginWidth) + this.config.leftMarginWidth
        var width = ((cl.endTime - cl.startTime) / totalDiff) * (this.width - this.config.leftMarginWidth)
        var height = this.config.rowHeight

        var j = 0
        for (j = 0; j < cl.dayString.length; j ++) {
            var y = this.letterToYValue(cl.dayString.charAt(j))
            var r = new Kinetic.Rect({
                x: x,
                y: y,
                width: width,
                height: height,
                stroke: 'gray',
                strokeWidth: 3,
                fill: color,
                opacity: 0.8,
                cornerRadius: 10
            })

            var text1 = new Kinetic.Text({
                x: x + 10,
                y: y + 10,
                width: width,
                text: cl.name,
                fontSize: 12,
                fontFamily: "Calibri",
                fill: 'black',
                opacity: 0.8
            })

            var text2 = new Kinetic.Text({
                x: x + 10,
                y: y + 40,
                width: width,
                text: cl.room,
                fontSize: 12,
                fontFamily: "Calibri",
                fill: 'black',
                opacity: 0.8
            })


            this._mainGroup.add(r)
            this._mainGroup.add(text1)
            this._mainGroup.add(text2)
        }
    }

    this.surface.draw()

    this.doAnimation()
}

ScheduleVisualizer.prototype.stretchShape = function (shape) {

    var orig = {
        setX: shape.getX(),
        setY: shape.getY(),
        setWidth: shape.getWidth(),
        setHeight: shape.getHeight(),
        setOpacity: shape.getOpacity()
    }

    shape.setX(shape.getX() - this.config.animEnlarge)
    shape.setY(shape.getY() - this.config.animEnlarge)
    shape.setWidth(shape.getWidth() + 2*this.config.animEnlarge)
    shape.setHeight(shape.getHeight() + 2*this.config.animEnlarge)
    shape.setOpacity(shape.getOpacity() - 0.5)

    return orig
}

ScheduleVisualizer.prototype.doAnimation = function () {
    var i = 0
    for (i = 0; i < this._mainGroup.children.length; i ++) {
        var shape = this._mainGroup.children[i]

        var orig = this.stretchShape(shape)
        orig.onUpdate = function (obj) {
            return function () {
                obj.surface.batchDraw()
            }
        }(this)
        orig.ease = Elastic.easeOut
        TweenLite.to(shape, 1, orig)

    }
}

ScheduleVisualizer.prototype.drawBackground = function () {

    if (!this._bgGroup) {
        this._bgGroup = new Kinetic.Group()
        this.surface.add(this._bgGroup)
    }

    this._bgGroup.removeChildren()

    var i = 0
    var y = -this.config.rowHeight + this.config.topMargin

    dayNames = ["Mon", "Tues", "Wed", "Thurs", "Fri", ""]

    for (i = 0; i < 6; i ++) {
        y += this.config.rowHeight
        var line = new Kinetic.Line({points: [0, y, this.width, y], stroke:'black', strokeWidth: 1, opacity: 0.5})
        this._bgGroup.add(line)

        var text = new Kinetic.Text({
            x: 10,
            y: y + 0.7*this.config.rowHeight,
            text: dayNames[i],
            fontSize: 14,
            fontFamily: "Calibri",
            fill: 'black'
        })

        this._bgGroup.add(text)
    }

    var hours = (this.config.endTime - this.config.startTime) / (1000 * 60 * 60)
    var startHour = this.config.startTime.getHours()
    var xStep = (this.width - this.config.leftMarginWidth) / hours
    var x = this.config.leftMarginWidth - xStep

    for (i = 0; i < hours; i ++) {
        x += xStep
        var line = new Kinetic.Line({points: [x, 0, x, this.height], stroke:'black', strokeWidth: 1, opacity: 0.2})
        this._bgGroup.add(line)

        var text = new Kinetic.Text({
            x: x,
            y: this.height - 30,
            text: (startHour + i == 12 ? 12 : ((startHour + i) % 12)) + ":00",
            fontSize: 14,
            fontFamily: "Calibri",
            fill: 'black'
        })

        this._bgGroup.add(text)
    }

    this.surface.draw()

}