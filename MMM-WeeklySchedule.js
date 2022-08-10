
/* Magic Mirror
 * Module: MMM_WeeklySchedule
 *
 * By Ulrich Pinsdorf
 * MIT Licensed.
 */

Module.register("MMM-WeeklySchedule", {

	defaults: {
		customCssFile: "MMM-WeeklySchedule.css",
		showWeekdayinHeader: true,
		updateInterval: 1 * 60 * 60 * 1000,     // 1 hour
		showNextDayAfter: "16:00",
		fadeSpeed: 4000,
		allowHTML: false,
		debug: true
	},

	requiresVersion: "2.1.0", // Required version of MagicMirror

	/* start()
	 * Start module after all modules have been loaded
	 * by the MagicMirror framework
	 */
	start: function() {
		// Schedule update timer.
		var self = this;
		setInterval(function() {
			self.updateDom(self.config.fadeSpeed);
		}, this.config.updateInterval);

		this.loaded = true;		
	},

	/* getHeader()
	 * Create the module header. Regards configuration showWeekdayinHeader 
	 */
	getHeader: function() {
		var header = this.data.header || this.translate("LESSONS");
		if(this.config.showWeekdayinHeader) {
			header += " " + this.translate("ON_DAY") + " " + this.getDisplayDate().toLocaleString(config.language, {weekday: "long"});
		}
		return header;
	},

	/* getDom()
	 * Create the DOM to show content
	 */
	getDom: function() {
		var date = this.getDisplayDate(); 

		// get day of week and access respective element in lessons array
		var dow = date.toLocaleString('en', {weekday: "short"}).toLowerCase();
		var lessons = this.config.schedule.lessons[dow];

		// no lessons today, we return default text
		if(lessons == undefined)
		{
			return this.createTextOnlyDom(
				this.translate("NO_LESSONS")
			);
		}

		// get timeslots
		var timeslots = this.config.schedule.timeslots;
		if ("timeslots" in lessons) {
			timeslots = lessons.timeslots;
			lessons = lessons.lessons;
		}

		// build table with timeslot definitions and lessons
		wrapper = document.createElement("table");
		for (let index = 0; index < lessons.length; index++) {
			const lesson = lessons[index];
			const time = timeslots[index];

			// only create a row if the timeslot's lesson is defined and not an empty string
			if(lesson)
			{
				var row = this.createTimetableRow(time, lesson); 
				wrapper.appendChild(row);
			}
		}
		return wrapper;
	},

	getDisplayDate: function() {
		// check if config contains a threshold 'showNextDayAfter'
		const threshold = new Date();
		if(this.config.showNextDayAfter) {
			const after = new Date(`1970-01-01 ${this.config.showNextDayAfter} Z`);
			threshold.setHours(after.getUTCHours(), after.getUTCMinutes(), after.getUTCSeconds());
		} else {
			threshold.setHours(23, 59, 59);
		}
		
		// get the current time and increment by one day if threshold time has passed
		const now = new Date();
		if(now > threshold) {
			now.setDate(now.getDate() + 1);
		}

		return now;
	},

	createTextOnlyDom: function(text) {
		var wrapper = document.createElement("table");
		var tr = document.createElement("tr");
		var td = document.createElement("td");
		var text = document.createTextNode(text); 
		td.className = "xsmall bright lesson";

		wrapper.appendChild(tr);
		tr.appendChild(td);
		td.appendChild(text);

		return wrapper;
	},

	createTimetableRow: function(time, lesson) {
		var row = document.createElement("tr");

		var tdtime = document.createElement("td");
		tdtime.className = "xsmall dimmed lessontime";
		if (this.config.allowHTML) {
			tdtime.innerHTML  = time;
		} else {
			tdtime.appendChild(
				document.createTextNode(time)
			);
		}
		row.appendChild(tdtime);

		var tdlesson = document.createElement("td");
		tdlesson.className = "xsmall bright lesson";
		if (this.config.allowHTML) {
			tdlesson.innerHTML  = lesson;
		} else {
			tdlesson.appendChild(
				document.createTextNode(lesson)
			);
		}
		row.appendChild(tdlesson);

		return row;
	},

	getStyles: function () {
		return [
			this.config.customCssFile
		];
	},

	getTranslations: function() {
		return {
				en: "translations/en.json",
				de: "translations/de.json",
				fr: "translations/fr.json",
				sv: "translations/sv.json",
				nb: "translations/nb.json",
				nl: "translations/nl.json",
				nn: "translations/nn.json",
				he: "translations/he.json",
				hu: "translations/hu.json",
				da: "translations/da.json",
				pl: "translations/pl.json",
				"zh-cn": "translations/zh-cn.json"
		}
	}

});
