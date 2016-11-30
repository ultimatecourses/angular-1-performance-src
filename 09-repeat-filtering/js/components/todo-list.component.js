var todoList = {
  bindings: {
    todos: '<',
    search: '<',
    onComplete: '&',
    onDelete: '&'
  },
	template: `
    <ul>
	    <li ng-repeat="todo in $ctrl.todos | testFilter">
  	    <todo
    	    item="todo"
      	  on-change="$ctrl.onComplete($locals);"
        	on-remove="$ctrl.onDelete($locals);">
	      </todo>
  	  </li>
    </ul>
  `
};

angular
  .module('app')
  .component('todoList', todoList);
