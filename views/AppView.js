var AppView = Backbone.View.extend({
  tagName: 'div',
  id: 'app',
  events: {
    'click #add-activity': 'addActivity'
  },
  initialize: function() {
    _.bindAll(this, 'addActivity');

    this.activities = new Activities();
    this.activitiesInputView = new ActivitiesInputView({
      collection: this.activities
    });
    this.timerView = new TimerView({
      collection: this.activities
    });

    this.template = Handlebars.compile($("#app-template").html());
  },
  render: function() {
    this.$el.html(this.activitiesInputView.render().$el);
    this.$el.append(this.template());
    this.$el.append(this.timerView.render().$el);

    return this;
  },
  addActivity: function() {
    this.activities.add({});
  }
});