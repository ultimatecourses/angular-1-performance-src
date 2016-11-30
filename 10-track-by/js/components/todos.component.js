var todos = {
  template: `
  	<div>
      <button ng-click="$ctrl.reloadTodos()">Load Todos</button>
      <todo-list
        todos="$ctrl.todos"
        on-complete="$ctrl.completeTodo($event);"
        on-delete="$ctrl.removeTodo($event);">
      </todo-list>
    </div>
  `,
  controller: function (TodoService) {
  	this.$onInit = function () {
    	this.todos = [];
    };
    this.addTodo = function ({ label }) {
      this.todos = [{ label, id: this.todos.length + 1 }, ...this.todos];
    };
    this.completeTodo = function ({ todo }) {
      this.todos = this.todos.map(
        item => item.id === todo.id ? Object.assign({}, item, { complete: true }) : item
      );
    };
    this.removeTodo = function ({ todo }) {
      this.todos = this.todos.filter(({ id }) => id !== todo.id);
    };
    this.reloadTodos = function() {
      this.todos = TodoService.getTodos();
    };
  }
};

angular
	.module('app')
  .component('todos', todos);
