var ActivitiesInputView = Backbone.View.extend({
  tagName: 'div',
  id: 'activity-input-container',
  events: {
  },
  initialize: function() {
    _.bindAll(this, 'render', 'appendActivity', 'removeActivity');
    this.collection.on('add', this.appendActivity);
  },
  render: function() {
    var _this = this;

    this.$el.empty();
    this.collection.each(function(activity) {
      _this.appendActivity(activity);
    });

    return this;
  },
  appendActivity: function(activity) {
    var view = new ActivityView({
      model: activity
    });

    this.listenTo(view, 'remove:activity', this.removeActivity);

    this.$el.append(view.render().$el);
  },
  removeActivity: function(view, model) {
    this.stopListening(view);
    this.collection.remove(model);
    view.remove();

    if (this.collection.size() == 0) {
      this.collection.add({});
    }
  }
})