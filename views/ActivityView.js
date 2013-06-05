var ActivityView = Backbone.View.extend({
  tagName: 'div',
  className: 'activity',
  events: {
    'click .remove': 'removeActivity'
  },
  initialize: function() {
    _.bindAll(this, 'render', 'setModelValues', 'removeActivity');

    this.listenTo(app, 'start:time', this.setModelValues);

    this.template = Handlebars.compile($("#activity-template").html());
  },
  render: function() {
    this.$el.html(this.template(this.model.toJSON()));

    return this;
  },
  setModelValues: function() {
    var values = {};

    $("input", this.$el).each(function(i, el) {
      values[el.className] = el.value;
    });

    this.model.setValues(values);
  },
  removeActivity: function() {
    this.stopListening();
    this.trigger('remove:activity', this, this.model);
  }
})