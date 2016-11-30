var header = {
  bindings: {},
  template: `<h2>Header Component (ng-show)</h2>`,
  controller: function HeaderController() {
    this.$onDestroy = function() {
      console.log('ON DESTROY FIRED! HEADER COMPONENT!');
    }
  }
};

angular
  .module('app')
  .component('header', header)
;