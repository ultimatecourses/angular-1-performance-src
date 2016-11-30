var todo = {
	bindings: {
  	item: '<',
    onChange: '&',
    onRemove: '&'
  },
  template: `
  	<div>
      <span ng-class="{ complete: $ctrl.item.complete }">
				{{ ::$ctrl.item.label }}
			</span>
      <button
        type="button"
        ng-click="$ctrl.onChange({ $event: { todo: $ctrl.item } });">Done</button>
      <button
        type="button"
        ng-click="$ctrl.onRemove({ $event: { todo: $ctrl.item } });">Delete</button>
    </div>
  `
};

angular
	.module('app')
  .component('todo', todo);
