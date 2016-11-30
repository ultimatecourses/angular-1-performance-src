var todoSearch = {
	bindings: {
    onSearch: '&'
  },
  template: `
  	<div>
      <input
				type="text"
				placeholder="Search for a todo"
				ng-model="search"
				ng-change="$ctrl.onSearch({ $event: { term: search } });">
    </div>
  `
};

angular
	.module('app')
  .component('todoSearch', todoSearch);
