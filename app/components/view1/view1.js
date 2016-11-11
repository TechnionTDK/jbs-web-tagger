'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'components/view1/view1.html',
    controller: 'View1Ctrl',
    controllerAs: 'vm',

  });
}])

.controller('View1Ctrl', ['$scope', '$document', function($scope, $document) {
	var vm = this;
	vm.text = "bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla\n" + 
				"bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla\n" + 
				"bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla\n" + 
				"bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla\n" + 
				"bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla\n" + 
				"bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla\n" + 
				"bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla\n" + 
				"bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla\n" + 
				"bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla\n" + 
				"bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla\n" + 
				"bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla\n" + 
				"bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla\n" + 
				"bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla";


	vm.updateSelectedText = function() {
		var flag = 0;
		var sel = window.getSelection();
		var startOffset = -1;
		var endOffset = -1;

		for (var i = 0; i < sel.rangeCount; i++) {
		    var s = sel.getRangeAt(i).startContainer.parentNode.id;
		    var e = sel.getRangeAt(i).endContainer.parentNode.id;
		    // console.log(i,s,e,sel);
		    if (s == "oren") flag = 1;
		    if (flag = 1 && e == "oren" || e == "child") flag = 2;
		    if (flag == 2) {
				startOffset = sel.getRangeAt(i).startOffset;
				endOffset = sel.getRangeAt(i).endOffset;
		    }
		}

		if (flag == 2) {
			console.log(vm.text.substring(startOffset, endOffset))
		} 
	}

}]);