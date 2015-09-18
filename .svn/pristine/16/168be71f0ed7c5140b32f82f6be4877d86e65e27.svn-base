'use strict';

//===========================================================================================
// Performs MathJax conversion on request (was automatic, but that was TOO SLOW)
//===========================================================================================
angular.module('problemType')

.directive('qimg', function() {

	//=======================================================
	//
	//=======================================================
	function link(scope, element, attrs)
	{
//		element.html(output);

		for (var i = 0, len = scope.model.length; i < len; i++)
		{
			scope.model[i].x = parseInt(scope.model[i].x, 10) + 3;
			scope.model[i].y = parseInt(scope.model[i].y, 10) + 3;
		}
	}

	//=======================================================
	//=======================================================
	return {
		restrict: 'E',

		scope: {
			model: '=qiData',
			src: '@ngSrc'
		},

		link: link,
		templateUrl: 'problemTypes/qImage.html'
	};
})
