function TodoService() {
  this.getTodos = function () {
  	return [{
      label: 'Eat pizza',
      id: 0,
      complete: true
    },{
      label: 'Do some coding',
      id: 1,
      complete: true
    },{
      label: 'Sleep',
      id: 2,
      complete: false
    },{
      label: 'Print tickets',
      id: 3,
      complete: true
    }];
  }
}


angular
	.module('app')
  .service('TodoService', TodoService);
