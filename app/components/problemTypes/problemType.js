'use strict';

//===========================================================================================
// Performs MathJax conversion on request (was automatic, but that was TOO SLOW)
//===========================================================================================
angular.module('problemType')

.directive('problemType', function() {

	var templatePath = 'problemTypes/';

	var map = {
		freeInput: {
			q: 'freeInputQ.html',
			a: 'freeInputA.html',
		},

		equation: {
			q: 'equationQ.html',
			a: 'equationA.html',
		},

		check: {
			q: 'multChoiceQ.html',
			a: 'multChoiceA.html',
		},

		radio: {
			q: 'multChoiceQ.html',
			a: 'multChoiceA.html',
		},

		paper: {
			q: 'essayQ.html',
			a: 'simpleA.html',
		},

		essay: {
			q: 'essayQ.html',
			a: 'simpleA.html',
		},

		graphPlot: {
			q: 'simpleQ.html',
			a: 'graphPlotA.html',
		},

		graphConst: {
			q: 'graphConstQ.html',
			a: 'graphConstA.html',
		}
	};

	//=======================================================
	// Decide which template to use
	//=======================================================
	function getTemplate(scope, element, attrs)
	{
		var mode = attrs.ptMode;
		var type = scope.problem.ansType;

		return templatePath + map[type][mode];
	}

	//=======================================================
	//=======================================================
	return {
		restrict: 'E',
		scope: {
			problem: '=ngModel',
			answer: '=ptAnswer',
			correct: '=ptCorrect'
		},

		link: function(scope, element, attrs) {
			scope.getTemplate = function() {return getTemplate(scope, element, attrs)};
		},

		template: '<div ng-include="getTemplate()"></div>'
	};
});