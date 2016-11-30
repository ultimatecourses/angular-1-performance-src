var todos = {
  template: `
  	<div>
    	<todo-search
        on-search="$ctrl.onSearch($event);">
      </todo-search>
      <todo-form
        on-add="$ctrl.addTodo($event);">
      </todo-form>
      <todo-list
        search="$ctrl.todosFilter"
        todos="$ctrl.todos"
        on-complete="$ctrl.completeTodo($event);"
        on-delete="$ctrl.removeTodo($event);">
      </todo-list>
    </div>
  `,
  controller: function ($filter, $interval, TodoService) {
  	this.$onInit = function () {
      this.todosFilter = '';
      this.todosPayload = TodoService.getTodos();
    	this.todos = this.todosPayload;
      $interval(function() {}, 1000);
    };
    this.addTodo = function ({ label }) {
      this.todos = [{ label, id: this.todos.length + 1 }, ...this.todos];
    };
    this.onSearch = function (search) {
      this.todos = $filter('filter')(this.todosPayload, search.term);
      // this.todosFilter = search;
    };
    this.completeTodo = function ({ todo }) {
      this.todos = this.todos.map(
        item => item.id === todo.id ? Object.assign({}, item, { complete: true }) : item
      );
    };
    this.removeTodo = function ({ todo }) {
      this.todos = this.todos.filter(({ id }) => id !== todo.id);
    };
  }
};

angular
	.module('app')
  .component('todos', todos);
