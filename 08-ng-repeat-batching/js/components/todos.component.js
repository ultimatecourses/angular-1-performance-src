var todos = {
  template: `
  	<div>
      <button type="button" ng-click="$ctrl.renderBatched();">
        Render chunked
      </button>
      <button type="button" ng-click="$ctrl.renderAll();">
        Render non-chunked
      </button>
    	<todo-form
        new-todo="$ctrl.newTodo"
        on-add="$ctrl.addTodo($event);">
      </todo-form>
      <todo-list
        todos="$ctrl.todos"
        on-complete="$ctrl.completeTodo($event);"
        on-delete="$ctrl.removeTodo($event);">
      </todo-list>
    </div>
  `,
  controller: function (TodoService, $q, $timeout) {
  	this.$onInit = function () {
      this.todos = [];
    };
    this.renderBatched = function () {
      this.chunkAndBatchRender('todos', TodoService.getTodos(), 25);
    };
    this.renderAll = function () {
      this.todos = TodoService.getTodos();
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
    this.chunkAndBatchRender = function (hash, collection, size) {

      var _this = this;
      var promise = $q.resolve();

      function chunkCollection(collection, size) {
        var chunks = [];
        for (var i = 0; i < collection.length; i += size) {
          chunks.push(collection.slice(i, i + size));
        }
        return chunks;
      }

      function scheduleRender(chunk) {
        Array.prototype.push.apply(_this[hash], chunk);
        return $timeout(function () {}, 0);
      }

      var chunked = chunkCollection(collection, size);

      var nextBatch;
      chunked.forEach(function(chunk, index) {
        nextBatch = scheduleRender.bind(null, chunk);
        promise = promise.then(nextBatch);
      });

      promise.then(function() {
        console.log('Rendered.');
      });

    };
  }
};

angular
	.module('app')
  .component('todos', todos);
