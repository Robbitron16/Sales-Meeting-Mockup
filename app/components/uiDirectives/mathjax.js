'use strict';

//===========================================================================================
// Performs MathJax conversion
//
// It was fully automatic, but that was TOO SLOW.
// Manual requests occasionally failed due to digest unpredictability.
// This method is mostly automatic, but it can only jax items inside ngRepeat blocks.
// That works for now, but in general is a poor limitation.
//===========================================================================================
angular.module('mathJax', [])

.directive('mathjax', function() {

	return {
		restrict: 'A',
		link: function(scope, element, attrs) {

			//=======================================================
			// Display the element after Jax conversion is complete
			//=======================================================
			function show()
			{
				element.css('visibility', 'visible');
			}

			//=======================================================
			//=======================================================
			scope.$on('jaxIt', function () {

				// Hide the element during Jax conversion
				element.css('visibility', 'hidden');

				// We need to wait for the next digest cycle
				setTimeout(function() {
					MathJax.Hub.Queue(['Typeset', MathJax.Hub, element[0], show]);
				}, 0);

            });
		}
	};
})

//=======================================================
// This must be included in an ngRepeat block to cause
// jaxing to occur.
//=======================================================
.directive('mathjaxRepeat', function() {

	return {
		restrict: 'A',

		link: function(scope, element, attrs) {
			if (scope.$last)
				scope.$emit('jaxIt');
		}
	};
});
