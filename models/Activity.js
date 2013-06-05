var Activity = Backbone.Model.extend({
  defaults: function() {
    return {
      name: null,
      secs: null,
      mins: null,
      hrs: null,
      reps: 1
    }
  },
  initialize: function() {
    _.bindAll(this, 'setValues');
  },
  setValues: function(values) {
    var _this = this;

    _(values).each(function(v, k) {
      _this.set(k, v);
    });
  }
});
