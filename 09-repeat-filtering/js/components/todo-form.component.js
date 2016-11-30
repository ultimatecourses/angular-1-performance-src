var todoForm = {
  bindings: {
    onAdd: '&'
  },
  template: `
    <form ng-submit="$ctrl.submit();">
      <input type="text" placeholder="Add a new todo" ng-model="$ctrl.label">
      <button type="submit">Add todo</button>
    </form>
  `,
  controller: function () {
  	this.submit = function () {
      if (!this.label) return;
    	this.onAdd({
        $event: {
          label: this.label
        }
      });
      this.label = '';
    };
  }
};

angular
  .module('app')
  .component('todoForm', todoForm);
