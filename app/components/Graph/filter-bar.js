'use strict';

//===========================================================================================
// Monitors for error conditions, and displays the appropriate warning and error messages.
//
// Conditions often have a Retry ability, which needs to be communicated or registered on error.
//===========================================================================================
angular.module('kb.filterBar', [])

.constant('kbFilterBar', {
	path: 'Graph/'
})

.directive('filterBar', function(kbFilterBar) {

	return {
		restrict: 'E',
		scope: {
			model: '=ngModel',
			type: '@',
			header: '@',

			model2: '=ngModel2',
			type2: '@',
			header2: '@',

			options: '=',

//			curfilter1: '=',
			curfilter2: '=',
		},
		controller: 'FilterBarCtrl as ctrl',
		bindTo: true,
		replace: true,
		templateUrl: kbFilterBar.path + 'filter-bar.html',

/*
		resolve: {
			id: function() {return assign.id},		// To keep track of what we're editing
			assigned: function() {return assign.assigned},
			due: function() {return assign.due},
			students: function() {return students},
		}
*/

	};
})

//===========================================================================================
.controller('FilterBarCtrl', function(PubSub, $scope) {

	var self = this;

	// Bad!
//	self.curfilter1 = $scope.curfilter1;
	self.curfilter2 = $scope.curfilter2;

	//=======================================================
	//=======================================================
	self.setFilter1 = function()
	{
		PubSub.publish('filter1', self.curfilter1);
	}

	//=======================================================
	//=======================================================
	self.setFilter2 = function()
	{
		PubSub.publish('filter2', self.curfilter2);
	}

});