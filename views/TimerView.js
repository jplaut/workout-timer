var TimerView = Backbone.View.extend({
  tagName: 'div',
  id: 'timer',
  events: {
    'click #start': 'startTicking',
    'click #stop': 'stopTicking'
  },
  initialize: function() {
    _.bindAll(this, 'render', 'tick', 'queueNextActivity', 'startTicking', 'stopTicking', 'completeWorkout');

    this.isRunning = false;
    this.pristine= true;
    this.timer = null;
    this.currentActivity = { index: 0, rep: 0 }
    this.activities = [];

    this.template = Handlebars.compile($("#timer-template").html());
  },
  render: function() {
    this.$el.html(this.template());

    return this;
  },
  tick: function(hrs, mins, secs, ms, cb) {
    if (hrs == 0 && mins == 0 && secs == 0 && ms == 0) {
      clearTimeout(this.timer);
      return cb();
    } else if (mins == 0 && secs == 0 && ms == 0) {
      hrs--;
      mins = 59;
      secs = 59;
      ms = 99;
    } else if (secs == 0 && ms == 0) {
      mins--;
      secs = 59;
      ms = 99;
    } else if (ms == 0) {
      secs--;
      ms = 99;
    } else {
      ms--;
    }

    $("#time").text(formatTime(hrs) + ":" + formatTime(mins) + ":" + formatTime(secs) + "." + formatTime(ms));
    this.timer = setTimeout(this.tick, 10, hrs, mins, secs, ms, cb);

    function formatTime(time) {
      if (time == "") {
        return "00";
      } else if (String(time).length == 1) {
        return "0" + time;
      } else {
        return time;
      }
    }
  },
  queueNextActivity: function() {
    var activity = this.activities[this.currentActivity.index];
    if (this.currentActivity.rep == activity.get("reps")) {
      if (this.activities.length > this.currentActivity.index + 1) {
        this.currentActivity.index++;
        activity = this.activities[this.currentActivity.index];
        this.currentActivity.rep = 0;
      } else {
        return this.completeWorkout();
      }
    } else {
      this.currentActivity.rep++;
    }

    $("#activity").text(activity.get('name'));
    this.tick(activity.get('hrs'), activity.get('mins'), activity.get('secs'), 0, this.queueNextActivity);
  },
  startTicking: function() {
    if (this.pristine && !this.isRunning) {
      app.trigger('start:time');
      this.activities = this.collection.filter(function(a) {
        return (a.get("hrs") || a.get("mins") || a.get("secs")) && a.get("reps")
      });

      if (this.activities.length > 0) {
        this.isRunning = true;
        this.pristine = false;
        $("#stop").text("Stop");
        this.queueNextActivity()
      }
    } else {
      $("#stop").text("Stop");
      this.isRunning = true;
      this.tick(this.timeRemaining[0], this.timeRemaining[1], this.timeRemaining[2], this.timeRemaining[3], this.queueNextActivity);
    }
  },
  stopTicking: function() {
    if (this.isRunning) {
      clearTimeout(this.timer);
      this.isRunning = false;
      $("#stop").text("Clear");
      timeRemaining = $("#time").text().match(/([0-9]{2}):([0-9]{2}):([0-9]{2})\.([0-9]{2})/);
      if (timeRemaining) {
        timeRemaining =  timeRemaining.slice(1, 5);

        if (_(timeRemaining).all(function(t) {return t == "00"})) {
          this.pristine = true;
        } else {
          this.timeRemaining = timeRemaining;
        }
      }
    } else if (!this.pristine) {
      this.resetTimer();
    }
  },
  resetTimer: function() {
    this.isRunning = false;
    this.pristine = true;
    this.currentActivity.rep = 0;
    this.currentActivity.index = 0;
    $("#time").text("00:00:00.00");
    $("#stop").text("Clear");
  },
  completeWorkout: function() {
    $("#activity").text("Complete");
    this.resetTimer();
  }
})