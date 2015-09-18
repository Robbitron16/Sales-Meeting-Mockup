'use strict';

//===========================================================================================
// Performs MathJax conversion on request (was automatic, but that was TOO SLOW)
//===========================================================================================
angular.module('problemType')

.directive('freeInput', function() {

	// Searches for free input boxes
	// Tags inside the <maction> can be either <mtext> if there's no VTP inside, or <mn> if the
	// value is VTPed. That is weird and inconsistent. We probably want <mn> in all cases for
	// proper display.
	var regex = /<maction[^>]*>(<mtext>|<mn[^>]*>)*(.+?)(<\/mtext>|<\/mn>)*<\/maction>/g;

	// Replacement when we don't want to display the answer
	var replaceHidden = '<menclose class="placeholder" notation="box"><mspace height="18px" width="40px" /></menclose>';

	// Show the answer when there are multiple input boxes
	// @FIXME/dg: Padding added for grade change only. Reintegrate with Assignment's freeInput.js with a config block.
	var replaceVisibleMany = '<menclose notation="box"><mpadded width="+4px" height="+2px" depth="+2px"><mn>$2</mn></mpadded></menclose>';
	var replaceWithInject = ['<menclose notation="box"><mpadded width="+4px" height="+2px" depth="+2px"><mn>','</mn></mpadded></menclose>'];

	// Show the answer when there is one input boxes -- drop the surrounding box
	var replaceVisibleOne =  '<mn>$2</mn>';


	//=======================================================
	//=======================================================
	function formatHidden(string)
	{
		return string.replace(regex, replaceHidden);
	}

	//=======================================================
	//=======================================================
	function formatVisible(string, answers)
	{
		// Find out how many input boxes there are
		var match = string.match(regex);

		// @FIXME/dg: Always show the box for grade change only. Reintegrate with Assignment's freeInput.js with a config block.
		if (!answers)
			return string.replace(regex, replaceVisibleMany);
		else
		{
			var ansList = answers.split(',');

			return string.replace(regex, function(list) {
				return replaceWithInject[0] + ansList.shift() + replaceWithInject[1];
			});
		}
	}

	//=======================================================
	//
	//=======================================================
	function link(scope, element, attrs)
	{
		if (attrs.fiMode === 'hidden')
			var output = formatHidden(scope.model);
		else
			var output = formatVisible(scope.model, scope.answers);

		element.html(output);
	}

	//=======================================================
	//=======================================================
	return {
		restrict: 'E',

		scope: {
			model: '=fiData',
			answers: '=fiAnswers'
		},

		link: link
	};
})
