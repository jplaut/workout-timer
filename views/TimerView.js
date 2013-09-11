var TimerView = Backbone.View.extend({
  tagName: 'div',
  id: 'timer',
  events: {
    'click #start': 'startTicking',
    'click #stop': 'stopTicking'
  },
  initialize: function() {
    _.bindAll(this, 'render', 'tick', 'rest', 'startActivity', 'queueNextActivity', 'startTicking', 'stopTicking', 'completeWorkout');

    this.isRunning = false;
    this.pristine= true;
    this.timer = null;
    this.currentActivity = { index: 0, rep: 1 }
    this.resting = false;
    this.activities = [];
    this.startTime = null;
    this.pausedTime = null;
    this.totalTime = null;

    this.template = Handlebars.compile($("#timer-template").html());
  },
  render: function() {
    this.$el.html(this.template());

    return this;
  },
  tick: function() {
    var curTime = new Date();
    var timeRemaining = this.totalTime - (curTime - this.startTime);
    if (timeRemaining <= 0) {
      this.queueNextActivity();
    } else {
      var hrs = Math.floor(timeRemaining/3600000);
      timeRemaining -= 3600000 * hrs;
      var mins = Math.floor(timeRemaining/60000);
      timeRemaining -= 60000 * mins;
      var secs = Math.floor(timeRemaining/1000);
      timeRemaining -= 1000 * secs;
      $("#time").text(formatTime(hrs) + ":" + formatTime(mins) + ":" + formatTime(secs) + "." + formatTime(timeRemaining));
      this.timer = setTimeout(this.tick, 0);
    }

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
  rest: function() {
    this.startTime = new Date();
    this.totalTime = 6000;
    $("#activity").text("REST!");
    this.tick();
  },
  startActivity: function() {
    activity = this.activities[this.currentActivity.index];
    this.setTime(activity);
    var startTime = new Date();
    $("#activity").text(activity.get('name'));
    this.tick();
  },
  queueNextActivity: function() {
    var next, activity = this.activities[this.currentActivity.index];
    this.resting = !this.resting;

    if (this.currentActivity.rep == activity.get("reps")) {
      if (this.activities.length > this.currentActivity.index + 1) {
        if (!this.resting) {
          this.currentActivity.index++;
          this.currentActivity.rep = 1;
        }
      } else {
        next = this.completeWorkout;
      }
    } else {
      if (!this.resting) this.currentActivity.rep++;
    }

    if (!next) {
      if (this.resting) {
        next = this.rest;          
      } else {
        next = this.startActivity;
      }
    }

    next();
  },
  startTicking: function() {
    if (this.pristine && !this.isRunning) {
      app.trigger('start:time');
      this.activities = this.collection.filter(function(a) {
        return (a.get("hrs") || a.get("mins") || a.get("secs")) && a.get("reps")
      });

      if (this.activities.length > 0) {
        $("#stop").attr('disabled', false);
        this.isRunning = true;
        this.pristine = false;
        $("#stop").text("Stop");
        this.startActivity();
      }
    } else {
      $("#stop").text("Stop");
      this.isRunning = true;
      this.tick();
    }
  },
  setTime: function(activity) {
    this.totalTime = activity.get('hrs') * 3600000 + activity.get('mins') * 60000 + activity.get('secs') * 1000 + 1000;
    this.startTime = new Date();
  },
  stopTicking: function() {
    if (this.isRunning) {
      clearTimeout(this.timer);
      this.pausedTime = new Date();
      this.isRunning = false;
      $("#stop").text("Clear");
    } else if (!this.pristine) {
      this.resetTimer();
    }
  },
  resetTimer: function() {
    this.isRunning = false;
    this.pristine = true;
    this.currentActivity.rep = 1;
    this.currentActivity.index = 0;
    this.resting = false;
    this.startTime = null;
    this.pausedTime = null;
    this.totalTime = null;
    $("#time").text("00:00:00.00");
    $("#stop").text("Clear");
    $("#activity").empty();
    $("#stop").attr('disabled', true);
  },
  completeWorkout: function() {
    $("#activity").text("Complete");
    this.resetTimer();
  }
})