'use strict';

//===========================================================================================
//===========================================================================================
angular.module('grades')

.controller('ChangeCtrl', function(Problems, State, PubSub, $scope) {

	var self = this;

	self.problems = Problems.get();		// Maintain a copy of the model

	initMetaData();
	initModel();

	//=======================================================
	//
	//=======================================================
	self.filterQs = function(status)
	{
		return (State.get('pendFilter') && !status);
	}

	//=======================================================
	//=======================================================
	self.setPoints = function(prob, isValid)
	{
		if (!isValid)
			return;

		var oldPend = prob.showPend;

		prob = Problems.setPoints(prob.id, prob.pts);
		if (!prob)
			return;

		// Update sandbox
		prob.pts = prob.score;
		prob.showPend = oldPend;

		// Update internal model
		var idx = prob.id;			// Slightly iffy. This is a bold assumption.
		self.problems[idx] = prob;	// Prop is a clone of self.problems[idx], so we have to update it. It feels like we could end up with a memory leak here.
	}

	//=======================================================
	//=======================================================
	self.getIcon = function(prob)
	{
		// Amazingly, this gets called 5 times per problem on page init
		// It's called once per change or blur, for every single problem
		var map = {
			pending: 'schedule',
			correct: 'check_circle',
			'new': 'radio_button_off',
			incorrect: 'cancel',

			'default': 'cancel'
		};

		return map[prob.status] || map['default'];
	}

	//=======================================================
	// Copy the point value to a safe scratchpad area
	//=======================================================
	function initModel()
	{
		for (var i = 0, len = self.problems.length; i < len; i++)
		{
			self.problems[i].pts = self.problems[i].score;
			self.problems[i].showPend = self.problems[i].isPending;
		}
	}

	//=======================================================
	//
	//=======================================================
	function initMetaData()
	{
		self.mode = Problems.mode();

		if (self.mode === 'multiProblem')
		{
			self.title = self.problems[0].uname.first + ' ' + self.problems[0].uname.last + ', ' + Problems.title();
		}
		else
		{
			self.title = Problems.title() + ', Question ' + self.problems[0].qNum;
		}
	}

});
