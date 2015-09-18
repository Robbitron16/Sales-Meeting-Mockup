'use strict';

//===========================================================================================
// Performs MathJax conversion on request (was automatic, but that was TOO SLOW)
//===========================================================================================
angular.module('problemType')

.directive('graphConst', function() {

	//=======================================================
	// Combine certain types into a metatype to keep the
	// graphTypes list clean and compact.
	//=======================================================
	var graphTypeMap = {
		hyperbolaxpos: 'hyperbola',
		hyperbolaypos: 'hyperbola',
		parabolax2: 'parabola',
		parabolay2: 'parabola',
	}

	//=======================================================
	//=======================================================
	var graphTypes = {
		point: {
			params: ['x', 'y'],	// Names of fields to be entered by the student in graphConst questions (in the same order as the database)
			plot: 1		// Number of points required to be plotted in graphPlot questions
		},

		line: {
			params: ['Slope (m)', 'y intercept (b)'],
			plot: 3
		},

		circle: {
			params: ['Center x', 'Center y', 'Radius'],
			plot: 4
		},

		ellipse: {
			params: ['h', 'k', 'a', 'b'],
			plot: 4
		},

		hyperbola: {
			params: ['h', 'k', 'a', 'b'],
			plot: 4
		},

		parabola: {
			params: ['h', 'k', 'p'],
			plot: 4
		},
	}

	//=======================================================
	//=======================================================
	function inputCnt(type)
	{
		// Convert to a metatype if one is available
		if (graphTypeMap[type])
			type = graphTypeMap[type];

		if (graphTypes[type])
			return graphTypes[type].plot;

		return 1;		// Unknown type. We need a default.
	}

	//=======================================================
	//=======================================================
	function getParams(type)
	{
		// Convert to a metatype if one is available
		if (graphTypeMap[type])
			type = graphTypeMap[type];

		if (graphTypes[type])
			return graphTypes[type].params;

		return ['Unknown'];		// Unknown type. Try to make it obvious.
	}

	//=======================================================
	// Converts a string graph definition to an object
	//=======================================================
	function graphStrToObj(string)
	{
		if (!string || typeof(string) !== 'string' || string.indexOf('=') === -1)
			return {type: 'unknown'};

		var eqIdx = string.indexOf('=');
		var type = string.slice(0, eqIdx).toLowerCase();
		var params = string.slice(eqIdx+1);
		if (params)
			var paramList = params.split(',');

		return {type:type, params: paramList};
	}

	//=======================================================
	//
	//=======================================================
	function link(scope, element, attrs)
	{
		// Convert answer string into object
		var obj = graphStrToObj(scope.answers);

		var paramList = getParams(obj.type);
		var ansList = graphStrToObj(scope.answers);

		// Interleave the parameters and supplied answers
		scope.model = [];
		_.forEach(paramList, function(val) {
			scope.model.push({
				label: val,
				value: parseFloat(ansList.params.shift())
			});
		});
	}

	//=======================================================
	// Configuration Block
	//=======================================================
	return {
		restrict: 'E',

		scope: {
			answers: '=gcAnswers'
		},

		link: link,
		templateUrl: 'problemTypes/graphConst.html'
	};
})
