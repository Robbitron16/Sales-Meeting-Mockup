'use strict';

//=======================================================
// Declare app level module which depends on views, and components
//=======================================================
angular.module('grades', [
	// Angular optional
	'ngRoute',
	'ngAnimate',

	// 3rd Party
	'ui.bootstrap',
	'cfp.hotkeys',
	'ngMdIcons',
	'ui.scrollToTopWhen',

	// Mine: Generic
	'pubsub-service',
	'mathJax',
	'sliderMenu',
	'kbBootstrap',
	'kbGraph',

	// Mine: Semi-reusable
	'state-service',
	'action-service',		// Cloud save

	// Mine: Project-specific
	'problemType',
	'comm-service',
	'kb.filterBar',
	'partials',				// "Compiled" templates
])

//=======================================================
// Route list
//=======================================================
.config(["$routeProvider", "$locationProvider", function($routeProvider, $locationProvider) {

	$locationProvider.html5Mode(true);

	// Routing Table
	$routeProvider.when('/change', {
		templateUrl: 'Change/change.html',
		controller: 'ChangeCtrl',
		controllerAs: 'change'
	});

	// Routing Table
	$routeProvider.when('/graph/:type', {
		templateUrl: 'Graph/graph.html',
		controller: 'GraphCtrl',
		controllerAs: 'graph'
	});

	// Default
	$routeProvider.otherwise({redirectTo: '/graph/1'});
}])

//=======================================================
// Disable sanitization. We'll take care of it on the back end
//=======================================================
.config(["$sceProvider", function($sceProvider) {
    $sceProvider.enabled(false);
}])

//=======================================================
//=======================================================
.config(["$httpProvider", function($httpProvider) {
	$httpProvider.defaults.withCredentials = true;
}])

//=======================================================
// This is a hack to add the ability to change routes
// without reloading the controller.
//
// $location.path now accepts a second parameter.
// If false, it will change the URL without rerouting.
//=======================================================
.run(['$route', '$rootScope', '$location', function ($route, $rootScope, $location) {
    var original = $location.path;
    $location.path = function (path, reload) {
        if (reload === false) {
            var lastRoute = $route.current;
            var un = $rootScope.$on('$locationChangeSuccess', function () {
                $route.current = lastRoute;
                un();
            });
        }
        return original.apply($location, [path]);
    };
}]);
'use strict';

//===========================================================================================
// Maintains an ordered list of actions that take place on a model. This allows
// persistence (saving) and undo, and possibly more.
//===========================================================================================
angular.module('action-service', ['pubsub-service']);

'use strict';

//===========================================================================================
// REST client and Communications Manager module
//===========================================================================================
angular.module('comm-service', []);

'use strict';

//===========================================================================================
// Problem Type Manager -- Allowes each problem type to handle its own display
//===========================================================================================
angular.module('problemType', []);

'use strict';

//===========================================================================================
//===========================================================================================
angular.module('grades')

.controller('ChangeCtrl', ["Problems", "State", "PubSub", "$scope", function(Problems, State, PubSub, $scope) {

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

}]);

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

.directive('filterBar', ["kbFilterBar", function(kbFilterBar) {

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
}])

//===========================================================================================
.controller('FilterBarCtrl', ["PubSub", "$scope", function(PubSub, $scope) {

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

}]);
'use strict';

//===========================================================================================
//===========================================================================================
angular.module('grades')

.controller('GraphCtrl', ["$location", "$routeParams", "$scope", "PubSub", function($location, $routeParams, $scope, PubSub) {

	var self = this;

/*
	Assignments
	-Assignments Overview
	-Assignment Details (formerly List)
	-Class Details
	-Problems Per Assignment
	-Problems Per Student
	-Assignment Intervention (this would be the preset filters that we've talked about in earlier meetings)

	Standards
	-Standards Overview
	-Standard Details
	-Class Details
	-Problems Per Standard
	-Problems Per Student
	-Standards Intervention (this would be the preset filters that we've talked about in earlier meetings)
*/
	self.reports = [
/*
		{id: 0, title: "Performance", options: [
			{id: 'perov', text: "Overview", template: "StudentSummary.html", filter: {section: true}, instructions: "Click a student to view details."},
			{id: 'pertr', text: "Trend", filter: {compare: true}, template: "StudentTrend.html"},
			{id: 'stdt', text: "Student Details", noFilters: true, studentSelect: true, template: "StudentDetails.html", instructions:"Click an assignment type or standard to view matching assignments."},
		]},
*/
		{id: 1, title: "Assignments", options: [
/*
			{id: 'perov', text: "Overview", template: "StudentSummary.html", filter: {section: true}, instructions: "Click a student to view details."},
			{id: 'aspe', text: "Pending", icon: 'glyphicon-alert', noFilters: true, template: "Pending.html", instructions: "Click an assignment to set or adjust grades and view student submissions."},
			{id: 'asli', text: "Assignment List", template: "AssignList.html", filter: {compare: true}, instructions: "Click an assignment to view student scores."},
			{id: 'ascls', text: "Class Scores", template: "AssignClass.html", filter: {section: true}, instructions: "Click a student to see their submissions and modify their scores."},
			{id: 'assts', text: "Student Scores", template: "AssignStudents.html", filter: {section: false}, instructions: "Click an assignment to see submissions and modify scores."},
			{id: 'asms', text: "Missing assignments", template: "AssignMissing.html", filter: {section: true}, instructions: "Click a student to view details."},
*/
			{id: 'perov', text: "Overview", template: "AssignOverview.html", filter: {section: false, noType: true, compare: true}, instructions: "Click a bar to view matching assignments."},
//			{id: 'aslia', text: "List", template: "AssignList.html", filter: {compare: true}, instructions: "Click an assignment to view student scores."},
			{id: 'aslib', text: "Assignment List", template: "AssignCategory.html", filter: {compare: true, noType: true}, instructions: ""},
			{id: 'ascls', text: "Student List", template: "AssignClass.html", filter: {section: true}, instructions: ""},
//			{id: 'asstd', text: "Standard List", template: "AssignStandards.html", filter: {compare: true, noType: true}, instructions: ""},
			{id: 'asprob', text: "Problem List", template: "AssignProblems.html", filter: {noStandard: true}, instructions: ""},
		]},
		{id: 2, title: "Standards", options: [
			{id: 'stdov', text: "Overview", template: "StandardOverview.html", filter: {noStandard: true, compare: true}, instructions: "Click a standard to view domain."},
//			{id: 'stddeta', text: "By Domain (A)", template: "StandardDetail.html", filter: {noStandard: true, compare: true}, instructions: "Click a standard to view standard performance."},
			{id: 'stddet', text: "Standard List", template: "StandardDetailB.html", filter: {noStandard: true, compare: true}, instructions: ""},
			{id: 'stdcls', text: "Student List", template: "StandardClass.html", filter: {section: true}, instructions: ""},
//			{id: 'stdprob', text: "Problems By Standard", template: "ProblemsByStandard.html", filter: {noStandard: true}, instructions: ""},
			{id: 'probpg', text: "Problem List", template: "ProblemExplorer.html", filter: {noStandard: true}, instructions: ""},

/*
			{id: 'stdco', text: "Performance", noFilters: true, template: 'StdCoverage.html', instructions: "Click a standard to show matching assignments."},
			{id: 'instd', text: "Intervention", template: "InterStandards.html", instructions: "Click on a standard to view matching assignments."},
*/
		]},
/*
		{id: 4, title: "Intervention", options: [
			{id: 'instu', text: "Students", noFilters: true, template: "InterStudents.html", instructions: "Click a student name to view details."},
			{id: 'inas', text: "Assignments", noFilters: true, template: "InterAssigns.html", instructions: "Click an assignment to view student scores."},
		]},
*/

		{id: 5, title: "Student Reports", options: [
			{id: 'stdt', text: "Overview", noFilters: true, studentSelect: true, template: "StudentDetails.html", instructions:"Click an assignment type or standard to view matching assignments."},
		]},

	];


	self.assign1 = [
		{name: 'Cray, Cathy', grade: 81, missing: 1},
		{name: 'McGee, Bubba', grade: 'X', missing: 6},
		{name: 'Smith, Alex', grade: 59, missing: 3},
		{name: 'Thompson, Alice', grade: 68, missing: 12},
		{name: 'Williams, Wendy', grade: 94, missing: 0}
	];

	self.problemStudents = [
		{name: 'McGee, Bubba', grade: 78, missing: 6, hw: 69, quiz: 81, test: 76},
		{name: 'Smith, Alex', grade: 59, missing: 3, stds: 'A-REI.3, F-LE.1c, N-RN.2', hw: 17, quiz: 73, test: 50},
		{name: 'Thompson, Alice', grade: 68, missing: 12, stds: 'A-REI.1', hw: 75, quiz: 73, test: 70},
	];

	self.problemStandards = [
		{name: 'A-REI.1', grade: 48},
		{name: 'A-REI.3', grade: 62},
	];

	self.problemAssigns = [
		{name: '1.1 Writing and Translating Algebraic Expressions', grade: 68},
		{name: '1.8 Scientific Notation, Significant Digits, Precision, and Accuracy', grade: 47},
	];

	self.assignments = [
		{type: 'Homework', name: '1.1 Writing and Translating Algebraic Expressions', grade: calcPercent(15/20), student: 71, due: '4/2/15', correct: 15, missed: 5, bar: getBar(7), epf: [2, 6, 5], plur: [plural(2), plural(6), plural(5)]},
		{type: 'Homework', name: '1.2 Translating and Writing Formulas', grade: calcPercent(25/30), student: 93, due: '4/4/15', pending: true, correct: 25, missed: 5, bar: getBar(1), epf: [5, 3, 5], plur: [plural(5), plural(3), plural(5)]},
		{type: 'Test', name: '1.3 Simple Algebraic Inequalities', grade: calcPercent(20/21), student: 89, due: '4/6/15', correct: 20, missed: 1, bar: getBar(6), epf:[11, 1, 1], plur: [plural(11), plural(1), plural(1)]},
		{type: 'Homework', name: '1.4 Evaluating Algebraic Expressions and Formulas', grade: calcPercent(12/19), student: 84, due: '4/8/15', pending: true, correct: 12, missed: 7, bar: getBar(5), epf: [1, 6, 6], plur: [plural(1), plural(6), plural(6)]},
		{type: 'Homework', name: '1.5 Algebraic Properties', grade: calcPercent(5/6), student: 76, due: '4/10/15', correct: 5, missed: 1, bar: getBar(1), epf: [5, 3, 5], plur: [plural(5), plural(3), plural(5)]},
		{type: 'Quiz', name: '1.6 Exponents', grade: calcPercent(17/19), student: 'X', due: '4/12/15', correct: 17, missed: 2, bar: getBar(2), epf: [8, 2, 3], plur: [plural(8), plural(2), plural(3)]},
		{type: 'Homework', name: '1.7 Roots and Radicals', grade: calcPercent(31/35), student: 47, due: '4/14/15', correct: 31, missed: 4, bar: getBar(2), epf: [8, 2, 3], plur: [plural(8), plural(2), plural(3)]},
		{type: 'Homework', name: '1.8 Scientific Notation, Significant Digits, Precision, and Accuracy', grade: calcPercent(11/12), student: 53, due: '4/16/15', correct: 11, missed: 12, bar: getBar(3), epf: [10, 1, 2], plur: [plural(10), plural(1), plural(2)]},
	];

	self.problems = [
		{text: "1) What is your name?", pending: false, grade: 80, assign: 1, epf: [17, 16, 17], excel: ["Abigail Hirano", "Lemuel Amorim", "Altha Cavins", "Sharonda Mongold", "Celestina Okeefe", "Blythe Ware", "Cierra Buie", "Mariette Garoutte", "Cliff Farless", "Christal Durrance", "Herman Zahn", "Winford Becnel", "Isaura Gossett", "Shoshana Brazier", "Ardell Ort", "Bethel Weiler", "Gilma Kidney",], 
		pass: ["Keely Harter", "Michell Dunkelberger", "Merissa Krom", "Seema McAdams", "Kimberley Heilmann","Adrienne McMath", "Dominick Harber", "Janett Solley", "Bev Dillow", "Ranee McKissick", "Yoko Ott", "Williams Shiflett", "Don Paez", "Deidra Stokely", "Jung Petrovich", "Launa Hyler",], 
		fail: ["Eilene Tripoli", "Hermila Valerius", "Roderick Childress", "Ligia Pepe", "Melia Currie", "Julie Circle", "Vonnie Ryba", "Lilli Figeroa", "Clarice Raco", "Georgette Martinez", "Lakenya Kinlaw", "Cecile Strohm", "Loni Kozel", "Sanjuana Faison", "Tyson Mayhue", "Madie Holdren", "Lynetta Marcelino",]
		},
		{text: "2) What is your quest?", pending: false, grade: 75, assign: 0, epf: [10, 20, 20], excel: ["Abigail Hirano", "Lemuel Amorim", "Altha Cavins", "Sharonda Mongold", "Celestina Okeefe", "Blythe Ware", "Cierra Buie", "Mariette Garoutte", "Cliff Farless", "Christal Durrance",], 
		pass: ["Keely Harter", "Michell Dunkelberger", "Merissa Krom", "Seema McAdams", "Kimberley Heilmann","Adrienne McMath", "Dominick Harber", "Janett Solley", "Bev Dillow", "Ranee McKissick", "Yoko Ott", "Williams Shiflett", "Don Paez", "Deidra Stokely", "Jung Petrovich", "Launa Hyler", "Herman Zahn", "Winford Becnel", "Isaura Gossett", "Shoshana Brazier",], 
		fail: ["Eilene Tripoli", "Hermila Valerius", "Roderick Childress", "Ligia Pepe", "Melia Currie", "Julie Circle", "Vonnie Ryba", "Lilli Figeroa", "Clarice Raco", "Georgette Martinez", "Lakenya Kinlaw", "Cecile Strohm", "Loni Kozel", "Sanjuana Faison", "Tyson Mayhue", "Madie Holdren", "Lynetta Marcelino", "Ardell Ort", "Bethel Weiler", "Gilma Kidney",]
		},
		{text: "3) What is your favorite color?", pending: false, grade: 79, assign: 1, epf: [17, 16, 17], excel: ["Abigail Hirano", "Lemuel Amorim", "Altha Cavins", "Sharonda Mongold", "Celestina Okeefe", "Blythe Ware", "Cierra Buie", "Mariette Garoutte", "Cliff Farless", "Christal Durrance", "Herman Zahn", "Winford Becnel", "Isaura Gossett", "Shoshana Brazier", "Ardell Ort", "Bethel Weiler", "Gilma Kidney",],
		 pass: ["Keely Harter", "Michell Dunkelberger", "Merissa Krom", "Seema McAdams", "Kimberley Heilmann","Adrienne McMath", "Dominick Harber", "Janett Solley", "Bev Dillow", "Ranee McKissick", "Yoko Ott", "Williams Shiflett", "Don Paez", "Deidra Stokely", "Jung Petrovich", "Launa Hyler",], 
		 fail: ["Eilene Tripoli", "Hermila Valerius", "Roderick Childress", "Ligia Pepe", "Melia Currie", "Julie Circle", "Vonnie Ryba", "Lilli Figeroa", "Clarice Raco", "Georgette Martinez", "Lakenya Kinlaw", "Cecile Strohm", "Loni Kozel", "Sanjuana Faison", "Tyson Mayhue", "Madie Holdren", "Lynetta Marcelino",]
		},
		{text: "4) What is the capital of Assyria?", pending: false, grade: 91, assign: 7, epf: [40, 5, 5], excel: ["Abigail Hirano", "Lemuel Amorim", "Altha Cavins", "Sharonda Mongold", "Celestina Okeefe", "Blythe Ware", "Cierra Buie", "Mariette Garoutte", "Cliff Farless", "Christal Durrance", "Herman Zahn", "Winford Becnel", "Isaura Gossett", "Shoshana Brazier", "Ardell Ort", "Bethel Weiler", "Gilma Kidney", "Adrienne McMath", "Dominick Harber", "Janett Solley", "Bev Dillow", "Ranee McKissick", "Yoko Ott", "Williams Shiflett", "Don Paez", "Deidra Stokely", "Jung Petrovich", "Launa Hyler", "Julie Circle", "Vonnie Ryba", "Lilli Figeroa", "Clarice Raco", "Georgette Martinez", "Lakenya Kinlaw", "Cecile Strohm", "Loni Kozel", "Sanjuana Faison", "Tyson Mayhue", "Madie Holdren", "Lynetta Marcelino",],
		 pass: ["Keely Harter", "Michell Dunkelberger", "Merissa Krom", "Seema McAdams", "Kimberley Heilmann",], 
		 fail: ["Eilene Tripoli", "Hermila Valerius", "Roderick Childress", "Ligia Pepe", "Melia Currie",]
		},
		{text: "5) What is the air-speed velocity of an unladen swallow?", pending: false, grade: 64, assign: 3, epf: [5, 22, 23], excel: ["Abigail Hirano", "Lemuel Amorim", "Altha Cavins", "Sharonda Mongold", "Celestina Okeefe",],
		 pass: ["Keely Harter", "Michell Dunkelberger", "Merissa Krom", "Seema McAdams", "Kimberley Heilmann","Adrienne McMath", "Dominick Harber", "Janett Solley", "Bev Dillow", "Ranee McKissick", "Yoko Ott", "Williams Shiflett", "Don Paez", "Deidra Stokely", "Jung Petrovich", "Launa Hyler", "Blythe Ware", "Cierra Buie", "Mariette Garoutte", "Cliff Farless", "Christal Durrance", "Herman Zahn",], 
		 fail: ["Eilene Tripoli", "Hermila Valerius", "Roderick Childress", "Ligia Pepe", "Melia Currie", "Julie Circle", "Vonnie Ryba", "Lilli Figeroa", "Clarice Raco", "Georgette Martinez", "Lakenya Kinlaw", "Cecile Strohm", "Loni Kozel", "Sanjuana Faison", "Tyson Mayhue", "Madie Holdren", "Lynetta Marcelino", "Winford Becnel", "Isaura Gossett", "Shoshana Brazier", "Ardell Ort", "Bethel Weiler", "Gilma Kidney",]
		},
	];

	self.assignList = _.map(self.assignments, function(entry) {return truncName(entry.name)});
	self.assignNoCatgegory = _.cloneDeep(self.assignList);
	self.assignList.unshift('All Homework', 'All Quizzes', 'All Tests', 'All i-Practice');
	self.curAssign = self.assignNoCatgegory[0];

	self.standards = [{"code":"A-APR","name":"Arithmetic with Polynomials & Rational Expressions","children":[{"id":"2518","code":"A-APR 1","name":"Apply operations to polynomials and understand closure."},{"id":"2576","code":"A-APR 3","name":"Find zeroes of factored polynomials."},{"id":"2581","code":"A-APR 6","name":"Rewrite rational expressions using inspection, long division, or a computer algebra system."}]},{"code":"A-CED","name":"Creating Equations","children":[{"id":"2519","code":"A-CED 1","name":"Solve problems in one variable by creating equations\/inequalities."},{"id":"2520","code":"A-CED 2","name":"Represent relationships by creating and graphing equations in two variables."},{"id":"2521","code":"A-CED 3","name":"Represent and interpret solutions of systems of equations\/inequalities."},{"id":"2522","code":"A-CED 4","name":"Rearrange formulas using the same reasoning as solving equations."}]},{"code":"A-REI","name":"Reasoning with Equations & Inequalities","children":[{"id":"2523","code":"A-REI 1","name":"Use equality of numbers to explain each step of solving an equation."},{"id":"2524","code":"A-REI 10","name":"Understand that the graph of a two-variable equation is the set of all its solutions."},{"id":"2525","code":"A-REI 11","name":"Explain why the <i>x<\/i>-coordinates of the points of intersection of <i>y<\/i> = <i>f<\/i>(<i>x<\/i>) and <i>y<\/i>  = <i>g<\/i>(<i>x<\/i>) are the solutions of the equation <i>f<\/i>(<i>x<\/i>) = <i>g<\/i>(<i>x<\/i>)."},{"id":"2526","code":"A-REI 12","name":"Graph the solutions to a linear inequality in two variables."},{"id":"2527","code":"A-REI 3","name":"Solve linear equations\/inequalities in one variable."},{"id":"2528","code":"A-REI 4a","name":"Complete the square to rewrite quadratic functions in vertex form and to derive the quadratic formula."},{"id":"2529","code":"A-REI 4b","name":"Solve quadratic equations in one variable."},{"id":"2530","code":"A-REI 5","name":"Prove that applying elimination to a system of equations in two variables produces a system with the same solutions."},{"id":"2531","code":"A-REI 6","name":"Solve systems of linear equations exactly and\/or approximately."},{"id":"2532","code":"A-REI 7","name":"Algebraically and graphically solve systems of one linear and one quadratic equation."}]},{"code":"A-SSE","name":"Seeing Structure in Expressions","children":[{"id":"2533","code":"A-SSE 1a","name":"Interpret terms, factors, and coefficients of an expression."},{"id":"2534","code":"A-SSE 1b","name":"Interpret complicated expressions by viewing parts as one object."},{"id":"2535","code":"A-SSE 2","name":"Identify ways to rewrite expressions."},{"id":"2536","code":"A-SSE 3a","name":"Find the zeros of a quadratic function by factoring."},{"id":"2537","code":"A-SSE 3b","name":"Find maximum\/minimum values of a quadratic function by completing the square."},{"id":"2538","code":"A-SSE 3c","name":"Transform exponential expressions."}]},{"code":"F-BF","name":"Building Functions","children":[{"id":"2539","code":"F-BF 1a","name":"Determine an explicit expression or a recursive process that describes a relationship between two quantities."},{"id":"2540","code":"F-BF 1b","name":"Write a function that describes a relationship by using arithmetic operations."},{"id":"2541","code":"F-BF 2","name":"Model arithmetic and geometric sequence situations recursively and\/or with an explicit formula."},{"id":"2542","code":"F-BF 3","name":"Identify and explain transformations in both equation and graphical form."},{"id":"2543","code":"F-BF 4a","name":"Write an expression for the inverse of a linear function."},{"id":"2580","code":"F-BF 4c","name":"Read values of an inverse function from a graph or a table."}]},{"code":"F-IF","name":"Interpreting Functions","children":[{"id":"2544","code":"F-IF 1","name":"Understand that in a function, each element of the domain, <i>x<\/i>, maps to exactly one element of the range, <i>f<\/i>(<i>x<\/i>)."},{"id":"2545","code":"F-IF 2","name":"Evaluate functions and interpret statements that use function notation."},{"id":"2546","code":"F-IF 3","name":"Recognize that sequences are functions, sometimes defined recursively, whose domain is a subset of the integers."},{"id":"2547","code":"F-IF 4","name":"For a function that models a relationship between two quantities, interpret tables and graphs and\/or sketch key features of graphs."},{"id":"2548","code":"F-IF 5","name":"Identify the appropriate domain of a function."},{"id":"2549","code":"F-IF 6","name":"Calculate, estimate, and\/or interpret the average rate of change of a function."},{"id":"2550","code":"F-IF 7a","name":"Graph and show the key features of linear and quadratic functions."},{"id":"2551","code":"F-IF 7b","name":"Graph and show the key features of square root, cube root, and piecewise-defined functions."},{"id":"2582","code":"F-IF 7c","name":"Graph polynomial functions expressed symbolically, identify zeros when factorizations are available, and show end behavior."},{"id":"2552","code":"F-IF 7e","name":"Factor and\/or complete the square in a quadratic function to reveal various properties."},{"id":"2553","code":"F-IF 8a","name":"Factor and\/or complete the square in a quadratic function to reveal various properties."},{"id":"2554","code":"F-IF 8b","name":"Use the properties of exponents to interpret exponential functions."},{"id":"2555","code":"F-IF 9","name":"Compare properties of two functions, each represented in a different way."}]},{"code":"F-LE","name":"Linear, Quadratic, & Exponential Models","children":[{"id":"2556","code":"F-LE 1a","name":"Prove that linear functions grow by equal differences over equal intervals, and that exponential functions grow by equal factors over equal intervals."},{"id":"2557","code":"F-LE 1b","name":"Recognize situations in which one quantity changes at a constant rate per unit change of another quantity."},{"id":"2558","code":"F-LE 1c","name":"Recognize situations in which a quantity grows or decays by a constant percent rate per unit change of another quantity."},{"id":"2559","code":"F-LE 2","name":"Construct linear and exponential functions given a graph, a description of a relationship, or two input\/output pairs."},{"id":"2560","code":"F-LE 3","name":"Observe that a quantity increasing exponentially eventually exceeds a quantity increasing linearly or quadratically."},{"id":"2561","code":"F-LE 5","name":"Interpret the parameters in a linear or exponential function in terms of a context."}]},{"code":"N-Q","name":"Quantities","children":[{"id":"2562","code":"N-Q 1","name":"Use units to understand multi-step problems, formulas, graphs, and data displays."},{"id":"2563","code":"N-Q 2","name":"Define quantities for descriptive modeling."},{"id":"2564","code":"N-Q 3","name":"Choose a level of accuracy appropriate to limitations on measurement."}]},{"code":"N-RN","name":"The Real Number System","children":[{"id":"2577","code":"N-RN 1","name":"Extend the properties of exponents to rational exponents."},{"id":"2578","code":"N-RN 2","name":"Rewrite expressions containing radicals and\/or rational exponents."},{"id":"2565","code":"N-RN 3","name":"Use properties of rational and irrational numbers and explain outcomes."}]},{"code":"S-ID","name":"Interpreting Categorical & Quantitative Data","children":[{"id":"2566","code":"S-ID 1","name":"Represent data with dot plots, histograms, and box plots."},{"id":"2567","code":"S-ID 2","name":"Compare median, mean, interquartile range, and standard deviation of data sets."},{"id":"2568","code":"S-ID 3","name":"Interpret differences in shape, center, and spread in the context of the data sets."},{"id":"2569","code":"S-ID 5","name":"Summarize and interpret data on two categorical and quantitative variables."},{"id":"2570","code":"S-ID 6a","name":"Create and\/or use linear, quadratic, and exponential models fitted to data to solve problems."},{"id":"2571","code":"S-ID 6b","name":"Informally assess the fit of a function by plotting and analyzing residuals."},{"id":"2572","code":"S-ID 6c","name":"Fit a linear function to a scatter plot when appropriate."},{"id":"2573","code":"S-ID 7","name":"Interpret the slope and the intercept of a linear model in the context of the data."},{"id":"2574","code":"S-ID 8","name":"Using technology, compute and interpret the correlation coefficient of a linear fit."},{"id":"2575","code":"S-ID 9","name":"Distinguish between correlation and causation."}]}];

	self.stdList = _.map(self.standards, function(entry) { return truncName(entry.code + ': ' + entry.name) });

	self.allStds = [{"code":"A-APR","name":"Arithmetic with Polynomials & Rational Expressions","children":[{"id":"4354","code":"A-APR 1","name":"Apply operations to polynomials and understand closure."},{"id":"4355","code":"A-APR 3","name":"Find zeroes of factored polynomials."}]},{"code":"A-CED","name":"Creating Equations","children":[{"id":"4356","code":"A-CED 1","name":"Solve problems in one variable by creating equations\/inequalities."},{"id":"4357","code":"A-CED 2","name":"Represent relationships by creating and graphing equations in two variables."},{"id":"4358","code":"A-CED 3","name":"Represent and interpret solutions of systems of equations\/inequalities."},{"id":"4359","code":"A-CED 4","name":"Rearrange formulas using the same reasoning as solving equations."}]},{"code":"A-REI","name":"Reasoning with Equations & Inequalities","children":[{"id":"4360","code":"A-REI 1","name":"Use equality of numbers to explain each step of solving an equation."},{"id":"4367","code":"A-REI 10","name":"Understand that the graph of a two-variable equation is the set of all its solutions."},{"id":"4368","code":"A-REI 11","name":"Explain why the <i>x<\/i>-coordinates of the points of intersection of <i>y<\/i> = <i>f<\/i>(<i>x<\/i>) and <i>y<\/i>  = <i>g<\/i>(<i>x<\/i>) are the solutions of the equation <i>f<\/i>(<i>x<\/i>) = <i>g<\/i>(<i>x<\/i>)."},{"id":"4369","code":"A-REI 12","name":"Graph the solutions to a linear inequality in two variables."},{"id":"4361","code":"A-REI 3","name":"Solve linear equations\/inequalities in one variable."},{"id":"4362","code":"A-REI 4a","name":"Complete the square to rewrite quadratic functions in vertex form and to derive the quadratic formula."},{"id":"4363","code":"A-REI 4b","name":"Solve quadratic equations in one variable."},{"id":"4364","code":"A-REI 5","name":"Prove that applying elimination to a system of equations in two variables produces a system with the same solutions."},{"id":"4365","code":"A-REI 6","name":"Solve systems of linear equations exactly and\/or approximately."},{"id":"4366","code":"A-REI 7","name":"Algebraically and graphically solve systems of one linear and one quadratic equation."}]},{"code":"A-SSE","name":"Seeing Structure in Expressions","children":[{"id":"4348","code":"A-SSE 1a","name":"Interpret terms, factors, and coefficients of an expression."},{"id":"4349","code":"A-SSE 1b","name":"Interpret complicated expressions by viewing parts as one object."},{"id":"4350","code":"A-SSE 2","name":"Identify ways to rewrite expressions."},{"id":"4351","code":"A-SSE 3a","name":"Find the zeros of a quadratic function by factoring."},{"id":"4352","code":"A-SSE 3b","name":"Find maximum\/minimum values of a quadratic function by completing the square."},{"id":"4353","code":"A-SSE 3c","name":"Transform exponential expressions."}]},{"code":"F-BF","name":"Building Functions","children":[{"id":"4382","code":"F-BF 1a","name":"Determine an explicit expression or a recursive process that describes a relationship between two quantities."},{"id":"4383","code":"F-BF 1b","name":"Write a function that describes a relationship by using arithmetic operations."},{"id":"4384","code":"F-BF 2","name":"Model arithmetic and geometric sequence situations recursively and\/or with an explicit formula."},{"id":"4385","code":"F-BF 3","name":"Identify and explain transformations in both equation and graphical form."},{"id":"4386","code":"F-BF 4a","name":"Write an expression for the inverse of a linear function."}]},{"code":"F-IF","name":"Interpreting Functions","children":[{"id":"4370","code":"F-IF 1","name":"Understand that in a function, each element of the domain, <i>x<\/i>, maps to exactly one element of the range, <i>f<\/i>(<i>x<\/i>)."},{"id":"4371","code":"F-IF 2","name":"Evaluate functions and interpret statements that use function notation."},{"id":"4372","code":"F-IF 3","name":"Recognize that sequences are functions, sometimes defined recursively, whose domain is a subset of the integers."},{"id":"4373","code":"F-IF 4","name":"For a function that models a relationship between two quantities, interpret tables and graphs and\/or sketch key features of graphs."},{"id":"4374","code":"F-IF 5","name":"Identify the appropriate domain of a function."},{"id":"4375","code":"F-IF 6","name":"Calculate, estimate, and\/or interpret the average rate of change of a function."},{"id":"4376","code":"F-IF 7a","name":"Graph and show the key features of linear and quadratic functions."},{"id":"4377","code":"F-IF 7b","name":"Graph and show the key features of square root, cube root, and piecewise-defined functions."},{"id":"4378","code":"F-IF 7e","name":"Factor and\/or complete the square in a quadratic function to reveal various properties."},{"id":"4379","code":"F-IF 8a","name":"Factor and\/or complete the square in a quadratic function to reveal various properties."},{"id":"4380","code":"F-IF 8b","name":"Use the properties of exponents to interpret exponential functions."},{"id":"4381","code":"F-IF 9","name":"Compare properties of two functions, each represented in a different way."}]},{"code":"F-LE","name":"Linear, Quadratic, & Exponential Models","children":[{"id":"4387","code":"F-LE 1a","name":"Prove that linear functions grow by equal differences over equal intervals, and that exponential functions grow by equal factors over equal intervals."},{"id":"4388","code":"F-LE 1b","name":"Recognize situations in which one quantity changes at a constant rate per unit change of another quantity."},{"id":"4389","code":"F-LE 1c","name":"Recognize situations in which a quantity grows or decays by a constant percent rate per unit change of another quantity."},{"id":"4390","code":"F-LE 2","name":"Construct linear and exponential functions given a graph, a description of a relationship, or two input\/output pairs."},{"id":"4391","code":"F-LE 3","name":"Observe that a quantity increasing exponentially eventually exceeds a quantity increasing linearly or quadratically."},{"id":"4392","code":"F-LE 5","name":"Interpret the parameters in a linear or exponential function in terms of a context."}]},{"code":"N-Q","name":"Quantities","children":[{"id":"4345","code":"N-Q 1","name":"Use units to understand multi-step problems, formulas, graphs, and data displays."},{"id":"4346","code":"N-Q 2","name":"Define quantities for descriptive modeling."},{"id":"4347","code":"N-Q 3","name":"Choose a level of accuracy appropriate to limitations on measurement."}]},{"code":"N-RN","name":"The Real Number System","children":[{"id":"4342","code":"N-RN 1","name":"Extend the properties of exponents to rational exponents."},{"id":"4343","code":"N-RN 2","name":"Rewrite expressions containing radicals and\/or rational exponents."},{"id":"4344","code":"N-RN 3","name":"Use properties of rational and irrational numbers and explain outcomes."}]},{"code":"S-ID","name":"Interpreting Categorical & Quantitative Data","children":[{"id":"4393","code":"S-ID 1","name":"Represent data with dot plots, histograms, and box plots."},{"id":"4394","code":"S-ID 2","name":"Compare median, mean, interquartile range, and standard deviation of data sets."},{"id":"4395","code":"S-ID 3","name":"Interpret differences in shape, center, and spread in the context of the data sets."},{"id":"4396","code":"S-ID 5","name":"Summarize and interpret data on two categorical and quantitative variables."},{"id":"4397","code":"S-ID 6a","name":"Create and\/or use linear, quadratic, and exponential models fitted to data to solve problems."},{"id":"4398","code":"S-ID 6b","name":"Informally assess the fit of a function by plotting and analyzing residuals."},{"id":"4399","code":"S-ID 6c","name":"Fit a linear function to a scatter plot when appropriate."},{"id":"4400","code":"S-ID 7","name":"Interpret the slope and the intercept of a linear model in the context of the data."},{"id":"4401","code":"S-ID 8","name":"Using technology, compute and interpret the correlation coefficient of a linear fit."},{"id":"4402","code":"S-ID 9","name":"Distinguish between correlation and causation."}]}];
	self.bigStdList = _.flatten(_.map(self.allStds, function(entry){ return [entry.code].concat(_.pluck(entry.children, 'code'))}));

	self.curStd = "A-APR.2";
	self.curStudent = "All Students";

	self.standardDetail = [
		{name: 'A-CED.1', grade: 68, student: 71, due: '4/2/15', correct: 15, missed: 5, bar: getBar(5), epf: [1, 6, 6], plur: [plural(1), plural(6), plural(6)]},
		{name: 'A-CED.2', grade: 84, student: 93, due: '4/4/15', pending: true, correct: 25, missed: 5, bar: getBar(1), epf: [5, 3, 5], plur: [plural(5), plural(3), plural(5)]},
		{name: 'A-CED.3', grade: 75, student: 89, due: '4/6/15', correct: 3, missed: 1, bar: getBar(7), epf: [2, 6, 5], plur: [plural(2), plural(6), plural(5)]},
		{name: 'A-CED.4', grade: 79, student: 84, due: '4/8/15', pending: true, correct: 12, missed: 7, bar: getBar(1), epf: [5, 3, 5], plur: [plural(5), plural(3), plural(5)]},
	];

	self.categories = ['Homework', 'Quiz', 'Test', 'i-Practice'];

	self.reportTitle = "Select a report";

	self.problemList = [{"id":"72968","standards":[{"id":"2454","name":"1.1","classid":"5"},{"id":"5109","name":"R.1","classid":"9"}],"vars":[{"label":"a","step":"1","min":"2","max":"20"}],"q":"Write an expression for the total cost of [a] shirts when each costs <i>x<\/i> dollars.","a":"<math xmlns=\"http:\/\/www.w3.org\/1998\/Math\/MathML\"><mrow><mtext>[a]<\/mtext><mi>x<\/mi><\/mrow><\/math>","ansType":"input","points":3,"video":"write_algebraic_expressions_about_products"},{"id":"72974","standards":[{"id":"2454","name":"1.1","classid":"5"},{"id":"5109","name":"R.1","classid":"9"}],"vars":[{"label":"a","step":"1","min":"5","max":"10"}],"constraints":["a!=6"],"q":"<p>Use the table to choose the correct expression for the cost of shipping gift baskets based on the number of baskets you buy.<\/p>\n\n<p><math xmlns=\"http:\/\/www.w3.org\/1998\/Math\/MathML\"><mrow><mtable columnalign=\"left\"><mtr columnalign=\"left\"><mtd columnalign=\"left\"><mrow><mi>N<\/mi><mi>u<\/mi><mi>m<\/mi><mi>b<\/mi><mi>e<\/mi><mi>r<\/mi><mtext>&#160;<\/mtext><mi>o<\/mi><mi>f<\/mi><mtext>&#160;<\/mtext><mi>b<\/mi><mi>a<\/mi><mi>s<\/mi><mi>k<\/mi><mi>e<\/mi><mi>t<\/mi><mi>s<\/mi><mrow><mo>(<\/mo><mi>N<\/mi><mo>)<\/mo><\/mrow><mtext>&#160;&#160;<\/mtext><\/mrow><\/mtd><mtd columnalign=\"left\"><mrow><mi>S<\/mi><mi>h<\/mi><mi>i<\/mi><mi>p<\/mi><mi>p<\/mi><mi>i<\/mi><mi>n<\/mi><mi>g<\/mi><mtext>&#160;<\/mtext><mi>c<\/mi><mi>o<\/mi><mi>s<\/mi><mi>t<\/mi><mtext>&#160;<\/mtext><mi>i<\/mi><mi>n<\/mi><mtext>&#160;<\/mtext><mi>d<\/mi><mi>o<\/mi><mi>l<\/mi><mi>l<\/mi><mi>a<\/mi><mi>r<\/mi><mi>s<\/mi><\/mrow><\/mtd><\/mtr><mtr columnalign=\"left\"><mtd columnalign=\"left\"><mn>1<\/mn><\/mtd><mtd columnalign=\"left\"><mrow><mtext>[a]<\/mtext><\/mrow><\/mtd><\/mtr><mtr columnalign=\"left\"><mtd columnalign=\"left\"><mn>2<\/mn><\/mtd><mtd columnalign=\"left\"><mrow><mtext>[a+2]<\/mtext><\/mrow><\/mtd><\/mtr><mtr columnalign=\"left\"><mtd columnalign=\"left\"><mn>3<\/mn><\/mtd><mtd columnalign=\"left\"><mrow><mtext>[a+4]<\/mtext><\/mrow><\/mtd><\/mtr><mtr columnalign=\"left\"><mtd columnalign=\"left\"><mn>4<\/mn><\/mtd><mtd columnalign=\"left\"><mrow><mtext>[a+6]<\/mtext><\/mrow><\/mtd><\/mtr><\/mtable><\/mrow><\/math><\/p>\n","choices":[{"id":"92310","a":"2<i>N <\/i>+ [a-2]"},{"id":"92311","a":"2<i>N <\/i>+ 4"},{"id":"92312","a":"<i>N <\/i>+ 4"},{"id":"92313","a":"2<i>N<\/i>"}],"a":"92310","ansType":"radio","points":5,"video":"write_algebraic_expressions_using_the_input_and_output_values_from"},{"id":"73746","standards":[{"id":"2454","name":"1.1","classid":"5"},{"id":"5109","name":"R.1","classid":"9"}],"vars":[{"label":"a","step":"1","min":"2","max":"50"}],"prefix":"Write an algebraic expression for:","q":"<i>M<\/i> less than <math xmlns=\"http:\/\/www.w3.org\/1998\/Math\/MathML\"><mrow><mrow><mtext>[a]<\/mtext><\/mrow><\/mrow><\/math>","a":"<math xmlns=\"http:\/\/www.w3.org\/1998\/Math\/MathML\"><mrow><mrow><mtext>[a]<\/mtext><\/mrow><mo>-<\/mo><mi>M<\/mi><\/mrow><\/math>","ansType":"input","points":3,"video":"write_algebraic_expressions_about_sums_and_differences"},{"id":"73747","standards":[{"id":"2454","name":"1.1","classid":"5"},{"id":"5109","name":"R.1","classid":"9"}],"vars":[{"label":"b","step":"1","min":"2","max":"20"},{"label":"a","step":"1","min":"2","max":"20"}],"prefix":"Write an algebraic expression for:","q":"<math xmlns=\"http:\/\/www.w3.org\/1998\/Math\/MathML\"><mrow><mrow><mtext>[a]<\/mtext><\/mrow><\/mrow><\/math> more than <i>z<\/i> times <math xmlns=\"http:\/\/www.w3.org\/1998\/Math\/MathML\"><mrow><mrow><mtext>[b]<\/mtext><\/mrow><\/mrow><\/math>","a":"<math xmlns=\"http:\/\/www.w3.org\/1998\/Math\/MathML\"><mrow><mrow><mtext>[b]<\/mtext><\/mrow><mi>z<\/mi><mo>+<\/mo><mrow><mtext>[a]<\/mtext><\/mrow><\/mrow><\/math>","ansType":"input","points":3},{"id":"73748","standards":[{"id":"2454","name":"1.1","classid":"5"},{"id":"5109","name":"R.1","classid":"9"}],"vars":[{"label":"a","step":"1","min":"5","max":"30"}],"q":"<p>There are <math xmlns=\"http:\/\/www.w3.org\/1998\/Math\/MathML\"><mrow><mrow><mtext>[a]<\/mtext><\/mrow><\/mrow><\/math> cell phones to choose from, and <i>b <\/i>of those cell phones are black.<\/p>\n\n<p>Write an expression for the number of cell phones that are not black.<\/p>\n","a":"<math xmlns=\"http:\/\/www.w3.org\/1998\/Math\/MathML\"><mrow><mrow><mtext>[a]<\/mtext><\/mrow><mo>-<\/mo><mi>b<\/mi><\/mrow><\/math>","ansType":"input","points":3,"video":"write_algebraic_expressions_about_sums_and_differences"},{"id":"73749","standards":[{"id":"2454","name":"1.1","classid":"5"},{"id":"5109","name":"R.1","classid":"9"}],"vars":[{"label":"a","step":"1","min":"2","max":"20"}],"q":"<p>There are <math xmlns=\"http:\/\/www.w3.org\/1998\/Math\/MathML\"><mrow><mrow><mtext>[a]<\/mtext><\/mrow><\/mrow><\/math> more women than there are men at a PTA meeting.<\/p>\n\n<p>Using <i>m<\/i> to represent the number of men, write an expression for the number of women.<\/p>\n","a":"<math xmlns=\"http:\/\/www.w3.org\/1998\/Math\/MathML\"><mrow><mrow><mtext>[a]<\/mtext><\/mrow><mo>+<\/mo><mi>m<\/mi><\/mrow><\/math>","ansType":"input","points":3,"video":"write_algebraic_expressions_about_sums_and_differences"},{"id":"73750","standards":[{"id":"2454","name":"1.1","classid":"5"},{"id":"5109","name":"R.1","classid":"9"}],"vars":[{"label":"a","step":"1","min":"2","max":"12"}],"q":"<p>On the shelves of a novelty store, there are <math xmlns=\"http:\/\/www.w3.org\/1998\/Math\/MathML\"><mrow><mrow><mtext>[a]<\/mtext><\/mrow><\/mrow><\/math> times as many rubber chickens as there are whoopee cushions.<\/p>\n\n<p>Using <i>w<\/i> to represent the number of whoopee cushions, write an expression to show how many rubber chickens there are.<\/p>","a":"<math xmlns=\"http:\/\/www.w3.org\/1998\/Math\/MathML\"><mrow><mrow><mtext>[a]<\/mtext><\/mrow><mi>w<\/mi><\/mrow><\/math>","ansType":"input","points":3,"video":"write_algebraic_expressions_about_products"},{"id":"73751","standards":[{"id":"2454","name":"1.1","classid":"5"},{"id":"5109","name":"R.1","classid":"9"}],"vars":[{"label":"a","step":"1","min":"10","max":"100"}],"q":"<p>In a grocery store, <math xmlns=\"http:\/\/www.w3.org\/1998\/Math\/MathML\"><mrow><mrow><mtext>[a]<\/mtext><\/mrow><\/mrow><\/math> more paper bags were used than plastic bags.<\/p>\n\n<p>Let <i>p<\/i> represent the number of paper bags used, and write an expression for the number of plastic bags used.<\/p>\n","a":"<math xmlns=\"http:\/\/www.w3.org\/1998\/Math\/MathML\"><mrow><mi>p<\/mi><mo>-<\/mo><mrow><mtext>[a]<\/mtext><\/mrow><\/mrow><\/math>","ansType":"input","points":3,"video":"write_algebraic_expressions_about_sums_and_differences"},{"id":"73752","standards":[{"id":"2454","name":"1.1","classid":"5"},{"id":"5109","name":"R.1","classid":"9"}],"vars":[{"label":"a","step":"1","min":"10","max":"50"}],"q":"<p>There are <math xmlns=\"http:\/\/www.w3.org\/1998\/Math\/MathML\"><mrow><mrow><mtext>[a]<\/mtext><\/mrow><\/mrow><\/math> people in a restaurant.<\/p>\n\n<p>Each person orders either coffee or tea.<\/p>\n\n<p>If <i>p<\/i> people order coffee, write an expression for the number of people who order tea.<\/p>\n","a":"<math xmlns=\"http:\/\/www.w3.org\/1998\/Math\/MathML\"><mrow><mrow><mtext>[a]<\/mtext><\/mrow><mo>-<\/mo><mi>p<\/mi><\/mrow><\/math>","ansType":"input","points":3,"video":"write_algebraic_expressions_about_sums_and_differences"},{"id":"73760","standards":[{"id":"2454","name":"1.1","classid":"5"},{"id":"5109","name":"R.1","classid":"9"}],"vars":[{"label":"b","step":"1","min":"2","max":"10"},{"label":"a","step":"1","min":"2","max":"10"}],"q":"<p>In the game of horseshoes, contestants toss U-shaped horseshoes toward a stake. One method of scoring grants 3 points for a <i>ringer<\/i> (a horseshoe that encircles the stake) and 1 point for a <i>leaner<\/i> (a horseshoe that touches the stake but is not a ringer). Melissa scores <math xmlns=\"http:\/\/www.w3.org\/1998\/Math\/MathML\"><mrow><mrow><mtext>[a]<\/mtext><\/mrow><\/mrow><\/math> ringers and <math xmlns=\"http:\/\/www.w3.org\/1998\/Math\/MathML\"><mrow><mrow><mtext>[b]<\/mtext><\/mrow><\/mrow><\/math> leaners.<\/p>\n\n<p>How many points did she score?<\/p>\n","a":"<math xmlns=\"http:\/\/www.w3.org\/1998\/Math\/MathML\"><maction selection=\"1\" actiontype=\"input\"><mtext>[3*a+b]<\/mtext><\/maction><\/math>","ansType":"MultKinetic","points":5,"video":"write_algebraic_expressions_about_sums_and_differences"},{"id":"74085","standards":[{"id":"2454","name":"1.1","classid":"5"},{"id":"5109","name":"R.1","classid":"9"}],"vars":[{"label":"a","step":"1","min":"2","max":"20"}],"q":"Write an expression for the total number of calories in [a] fries when there are <i>x<\/i> calories per fry.","a":"<math xmlns=\"http:\/\/www.w3.org\/1998\/Math\/MathML\"><mrow><mtext>[a]<\/mtext><mi>x<\/mi><\/mrow><\/math>","ansType":"input","points":3,"video":"write_algebraic_expressions_about_products"},{"id":"74086","standards":[{"id":"2454","name":"1.1","classid":"5"},{"id":"5109","name":"R.1","classid":"9"}],"vars":[{"label":"a","step":"1","min":"2","max":"20"}],"q":"Write an expression for the total cost of [a] shirts when each costs <i>x<\/i> dollars.","a":"<math xmlns=\"http:\/\/www.w3.org\/1998\/Math\/MathML\"><mrow><mtext>[a]<\/mtext><mi>x<\/mi><\/mrow><\/math>","ansType":"input","points":3,"video":"write_algebraic_expressions_about_products"},{"id":"74087","standards":[{"id":"2454","name":"1.1","classid":"5"},{"id":"5109","name":"R.1","classid":"9"}],"vars":[{"label":"a","step":"1","min":"2","max":"20"}],"q":"[a] apples are picked from a tree and placed evenly into <i>x<\/i> boxes. Write an expression for the number of apples in each box.","a":"<math xmlns=\"http:\/\/www.w3.org\/1998\/Math\/MathML\"><mrow><mfrac linethickness=\"thin\"><mrow><mtext>[a]<\/mtext><\/mrow><mi>x<\/mi><\/mfrac><\/mrow><\/math>","ansType":"input","points":3,"video":"write_algebraic_expressions_about_products"},{"id":"74845","standards":[{"id":"2454","name":"1.1","classid":"5"},{"id":"5109","name":"R.1","classid":"9"}],"prefix":"Write an expression that means &#8220;six more than a number.&#8221;","q":"Call the number &#8220;<span class=\"math\"><i>x<\/i><\/span>&#8221;.","a":"<math><mrow><mi>x<\/mi><mo>+<\/mo><mn>6<\/mn><\/mrow><\/math>","ansType":"input","points":5,"video":"write_algebraic_expressions_about_sums_and_differences"},{"id":"74846","standards":[{"id":"2454","name":"1.1","classid":"5"},{"id":"5109","name":"R.1","classid":"9"}],"prefix":"Write an expression that means &#8220;four times a number.&#8221;","q":"Call the number &#8220;<span class=\"math\"><i>x<\/i><\/span>&#8221;.","a":"<math><mrow><mn>4<\/mn><mi>x<\/mi><\/mrow><\/math>","ansType":"input","points":5,"video":"write_algebraic_expressions_about_products"},{"id":"74847","standards":[{"id":"2454","name":"1.1","classid":"5"},{"id":"5109","name":"R.1","classid":"9"}],"q":"Write an expression that means &#8220;<span class=\"math\"><i>x<\/i><\/span> less than five.&#8221;","a":"<math><mrow><mn>5<\/mn><mo>-<\/mo><mi>x<\/mi><\/mrow><\/math>","ansType":"input","points":5,"video":"write_algebraic_expressions_about_sums_and_differences"},{"id":"74849","standards":[{"id":"2454","name":"1.1","classid":"5"},{"id":"5109","name":"R.1","classid":"9"}],"prefix":"Write an expression that means &#8220;the sum of a number and 14.&#8221;","q":"Call the number &#8220;<span class=\"math\"><i>x<\/i><\/span>&#8221;","a":"<math><mrow><mi>x<\/mi><mo>+<\/mo><mn>14<\/mn><\/mrow><\/math>","ansType":"input","points":5,"video":"write_algebraic_expressions_about_sums_and_differences"},{"id":"74852","standards":[{"id":"2454","name":"1.1","classid":"5"},{"id":"5109","name":"R.1","classid":"9"}],"q":"<p>Write an expression for &#8220;The sum of 7 times a number and 15.&#8221;<\/p>\n\n<p>Use <i>x<\/i> to represent the number.<\/p>\n","hasSteps":true,"a":"<math><mrow><mn>7<\/mn><mi>x<\/mi><mo>+<\/mo><mn>15<\/mn><\/mrow><\/math>","ansType":"input","points":5},{"id":"74855","standards":[{"id":"2454","name":"1.1","classid":"5"},{"id":"5109","name":"R.1","classid":"9"}],"prefix":"Write an expression that means &#8220;the sum of three and twice a number.&#8221;","q":"Call the number &#8220;<span class=\"math\"><i>x<\/i><\/span>&#8221;.","a":"<math><mrow><mn>3<\/mn><mo>+<\/mo><mn>2<\/mn><mi>x<\/mi><\/mrow><\/math>","ansType":"input","points":5},{"id":"74856","standards":[{"id":"2454","name":"1.1","classid":"5"},{"id":"5109","name":"R.1","classid":"9"}],"q":"Write an expression that means &#8220;100 minus the quotient of 56 divided by <i>x<\/i>.&#8221;","a":"<math><mrow><mn>100<\/mn><mo>-<\/mo><mfrac><mrow><mn>56<\/mn><\/mrow><mi>x<\/mi><\/mfrac><\/mrow><\/math>","ansType":"input","points":5},{"id":"74884","standards":[{"id":"2454","name":"1.1","classid":"5"},{"id":"5109","name":"R.1","classid":"9"}],"q":"<p><span class=\"question\"><span><span>Which of the expressions gives the cost of renting a chainsaw for <\/span><span class=\"math\"><i>h<\/i><\/span><span> hours, based on the table below? <\/span><\/span><\/span><\/p>\n\n<p><span class=\"question\"><span><math xmlns=\"http:\/\/www.w3.org\/1998\/Math\/MathML\"><mrow><mtable columnalign=\"left\"><mtr columnalign=\"left\"><mtd columnalign=\"left\"><mrow><mstyle mathsize=\"normal\" mathvariant=\"bold\"><mi>H<\/mi><mi>o<\/mi><mi>u<\/mi><mi>r<\/mi><mi>s<\/mi><\/mstyle><mtext>&#160;<\/mtext><mrow><mo>(<\/mo><mi>h<\/mi><mo>)<\/mo><\/mrow><mtext>&#160;&#160;&#160;&#160;<\/mtext><\/mrow><\/mtd><mtd columnalign=\"left\"><mrow><mstyle mathsize=\"normal\" mathvariant=\"bold\"><mi>C<\/mi><mi>o<\/mi><mi>s<\/mi><mi>t<\/mi><\/mstyle><\/mrow><\/mtd><\/mtr><mtr columnalign=\"left\"><mtd columnalign=\"left\"><mtext>1<\/mtext><\/mtd><mtd columnalign=\"left\"><mrow><mtext>12<\/mtext><\/mrow><\/mtd><\/mtr><mtr columnalign=\"left\"><mtd columnalign=\"left\"><mtext>2<\/mtext><\/mtd><mtd columnalign=\"left\"><mrow><mtext>14<\/mtext><\/mrow><\/mtd><\/mtr><mtr columnalign=\"left\"><mtd columnalign=\"left\"><mtext>3<\/mtext><\/mtd><mtd columnalign=\"left\"><mrow><mtext>16<\/mtext><\/mrow><\/mtd><\/mtr><mtr columnalign=\"left\"><mtd columnalign=\"left\"><mtext>4<\/mtext><\/mtd><mtd columnalign=\"left\"><mrow><mtext>18<\/mtext><\/mrow><\/mtd><\/mtr><\/mtable><\/mrow><\/math><\/span><\/span><\/p>\n","choices":[{"id":"67853","a":"<span class=\"math\">12&#183;<i>h<\/i><\/span>"},{"id":"67854","a":"<span class=\"math\">10 + 2&#183;<i>h<\/i><\/span>"},{"id":"67855","a":"<span class=\"math\">12&#183;<i>h<\/i> + 2<\/span>"},{"id":"67856","a":"<span class=\"math\">12 + 2&#183;<i>h<\/i><\/span>"}],"a":"67854","ansType":"radio","points":5,"video":"write_algebraic_expressions_using_the_input_and_output_values_from"},{"id":"74886","standards":[{"id":"2454","name":"1.1","classid":"5"},{"id":"5109","name":"R.1","classid":"9"}],"q":"<p>Using the table, write an expression for the number of bags of candy left in a shop on the day before Halloween, a number of hours (<span class=\"math\"><i>h<\/i><\/span>) after opening.<\/p>\n\n<p><math xmlns=\"http:\/\/www.w3.org\/1998\/Math\/MathML\"><mrow><mtable columnalign=\"left\"><mtr columnalign=\"left\"><mtd columnalign=\"left\"><mrow><mstyle mathvariant=\"bold\" mathsize=\"normal\"><mi>H<\/mi><mi>o<\/mi><mi>u<\/mi><mi>r<\/mi><mi>s<\/mi><\/mstyle><mtext>&#160;<\/mtext><mstyle mathvariant=\"bold\" mathsize=\"normal\"><mi>a<\/mi><mi>f<\/mi><mi>t<\/mi><mi>e<\/mi><mi>r<\/mi><\/mstyle><mtext>&#160;<\/mtext><mstyle mathvariant=\"bold\" mathsize=\"normal\"><mi>o<\/mi><mi>p<\/mi><mi>e<\/mi><mi>n<\/mi><mi>i<\/mi><mi>n<\/mi><mi>g<\/mi><\/mstyle><mtext>&#160;<\/mtext><mrow><mo>(<\/mo><mi>h<\/mi><mo>)<\/mo><\/mrow><mtext>&#160;&#160;<\/mtext><\/mrow><\/mtd><mtd columnalign=\"left\"><mrow><mstyle mathvariant=\"bold\" mathsize=\"normal\"><mi>B<\/mi><mi>a<\/mi><mi>g<\/mi><mi>s<\/mi><\/mstyle><mtext>&#160;<\/mtext><mstyle mathvariant=\"bold\" mathsize=\"normal\"><mi>o<\/mi><mi>f<\/mi><\/mstyle><mtext>&#160;<\/mtext><mstyle mathvariant=\"bold\" mathsize=\"normal\"><mi>c<\/mi><mi>a<\/mi><mi>n<\/mi><mi>d<\/mi><mi>y<\/mi><\/mstyle><mtext>&#160;<\/mtext><mstyle mathvariant=\"bold\" mathsize=\"normal\"><mi>l<\/mi><mi>e<\/mi><mi>f<\/mi><mi>t<\/mi><\/mstyle><\/mrow><\/mtd><\/mtr><mtr columnalign=\"left\"><mtd columnalign=\"left\"><mtext>0<\/mtext><\/mtd><mtd columnalign=\"left\"><mrow><mtext>350<\/mtext><\/mrow><\/mtd><\/mtr><mtr columnalign=\"left\"><mtd columnalign=\"left\"><mtext>1<\/mtext><\/mtd><mtd columnalign=\"left\"><mrow><mtext>305<\/mtext><\/mrow><\/mtd><\/mtr><mtr columnalign=\"left\"><mtd columnalign=\"left\"><mtext>2<\/mtext><\/mtd><mtd columnalign=\"left\"><mrow><mtext>260<\/mtext><\/mrow><\/mtd><\/mtr><mtr columnalign=\"left\"><mtd columnalign=\"left\"><mtext>3<\/mtext><\/mtd><mtd columnalign=\"left\"><mrow><mtext>215<\/mtext><\/mrow><\/mtd><\/mtr><\/mtable><\/mrow><\/math><\/p>\n","choices":[{"id":"69730","a":"<span class=\"math\">350 + 45&#183;<i>h<\/i><\/span>"},{"id":"69731","a":"<span class=\"math\">350 - 45&#183;<i>h<\/i><\/span>"},{"id":"69732","a":"<span class=\"math\">45&#183;(<i>h<\/i> + 350)<\/span>"},{"id":"69733","a":"<span class=\"math\">45&#183;<i>h<\/i> - 350<\/span>"}],"a":"69731","ansType":"radio","points":5,"video":"write_algebraic_expressions_using_the_input_and_output_values_from"},{"id":"74887","standards":[{"id":"2454","name":"1.1","classid":"5"},{"id":"5109","name":"R.1","classid":"9"}],"q":"<p>Using the table, write an expression for the cost of a picture frame given the perimeter of the picture in inches (the minimum size is 24 inches).<\/p>\n\n<p><math xmlns=\"http:\/\/www.w3.org\/1998\/Math\/MathML\"><mrow><mtable columnalign=\"left\"><mtr columnalign=\"left\"><mtd columnalign=\"left\"><mrow><mstyle mathvariant=\"bold\" mathsize=\"normal\"><mi>P<\/mi><mi>e<\/mi><mi>r<\/mi><mi>i<\/mi><mi>m<\/mi><mi>e<\/mi><mi>t<\/mi><mi>e<\/mi><mi>r<\/mi><\/mstyle><mtext>&#160;<\/mtext><mstyle mathvariant=\"bold\" mathsize=\"normal\"><mi>i<\/mi><mi>n<\/mi><\/mstyle><mtext>&#160;<\/mtext><mstyle mathvariant=\"bold\" mathsize=\"normal\"><mi>i<\/mi><mi>n<\/mi><mi>c<\/mi><mi>h<\/mi><mi>e<\/mi><mi>s<\/mi><\/mstyle><mtext>&#160;<\/mtext><mrow><mo>(<\/mo><mi>p<\/mi><mo>)<\/mo><\/mrow><mtext>&#160;&#160;<\/mtext><\/mrow><\/mtd><mtd columnalign=\"left\"><mrow><mstyle mathvariant=\"bold\" mathsize=\"normal\"><mi>C<\/mi><mi>o<\/mi><mi>s<\/mi><mi>t<\/mi><\/mstyle><\/mrow><\/mtd><\/mtr><mtr columnalign=\"left\"><mtd columnalign=\"left\"><mrow><mtext>24<\/mtext><\/mrow><\/mtd><mtd columnalign=\"left\"><mrow><mtext>10<\/mtext><\/mrow><\/mtd><\/mtr><mtr columnalign=\"left\"><mtd columnalign=\"left\"><mrow><mtext>26<\/mtext><\/mrow><\/mtd><mtd columnalign=\"left\"><mrow><mtext>11<\/mtext><\/mrow><\/mtd><\/mtr><mtr columnalign=\"left\"><mtd columnalign=\"left\"><mrow><mtext>28<\/mtext><\/mrow><\/mtd><mtd columnalign=\"left\"><mrow><mtext>12<\/mtext><\/mrow><\/mtd><\/mtr><mtr columnalign=\"left\"><mtd columnalign=\"left\"><mrow><mtext>30<\/mtext><\/mrow><\/mtd><mtd columnalign=\"left\"><mrow><mtext>13<\/mtext><\/mrow><\/mtd><\/mtr><\/mtable><\/mrow><\/math><\/p>\n","choices":[{"id":"68204","a":"<span class=\"math\">24 + 10&#183;<i>p<\/i><\/span>"},{"id":"68205","a":"<span class=\"math\">24 + 10\/<i>p<\/i><\/span>"},{"id":"68206","a":"<span class=\"math\">10 + 2&#183;(<i>p<\/i> - 24)<\/span>"},{"id":"68207","a":"<span class=\"math\">10 + (1\/2)(<i>p<\/i> - 24)<\/span>"}],"a":"68207","ansType":"radio","points":5,"video":"write_algebraic_expressions_using_the_input_and_output_values_from"},{"id":"74888","standards":[{"id":"2454","name":"1.1","classid":"5"},{"id":"5109","name":"R.1","classid":"9"}],"prefix":"The table shows the cost <i>C<\/i> of renting a karaoke machine with <i>M<\/i> extra microphones.","q":"<p>Write an expression for the cost of a karaoke machine with <i>M<\/i> extra microphones.<\/p>\n\n<p>Assume the pattern in the table continues.<\/p>\n\n<p><math xmlns=\"http:\/\/www.w3.org\/1998\/Math\/MathML\"><mrow><mtable columnalign=\"left\"><mtr columnalign=\"left\"><mtd columnalign=\"left\"><mrow><mstyle mathvariant=\"bold\" mathsize=\"normal\"><mi>N<\/mi><mi>u<\/mi><mi>m<\/mi><mi>b<\/mi><mi>e<\/mi><mi>r<\/mi><\/mstyle><mtext>&#160;<\/mtext><mstyle mathvariant=\"bold\" mathsize=\"normal\"><mi>o<\/mi><mi>f<\/mi><\/mstyle><mtext>&#160;<\/mtext><mstyle mathvariant=\"bold\" mathsize=\"normal\"><mi>e<\/mi><mi>x<\/mi><mi>t<\/mi><mi>r<\/mi><mi>a<\/mi><\/mstyle><mtext>&#160;<\/mtext><mstyle mathvariant=\"bold\" mathsize=\"normal\"><mi>M<\/mi><mi>i<\/mi><mi>c<\/mi><mi>r<\/mi><mi>o<\/mi><mi>p<\/mi><mi>h<\/mi><mi>o<\/mi><mi>n<\/mi><mi>e<\/mi><mi>s<\/mi><\/mstyle><mtext>&#160;<\/mtext><mo stretchy=\"false\">(<\/mo><mi>M<\/mi><mo stretchy=\"false\">)<\/mo><mtext>&#160;&#160;<\/mtext><\/mrow><\/mtd><mtd columnalign=\"left\"><mrow><mstyle mathvariant=\"bold\" mathsize=\"normal\"><mi>C<\/mi><mi>o<\/mi><mi>s<\/mi><mi>t<\/mi><\/mstyle><\/mrow><\/mtd><\/mtr><mtr columnalign=\"left\"><mtd columnalign=\"left\"><mtext>0<\/mtext><\/mtd><mtd columnalign=\"left\"><mrow><mtext>100<\/mtext><\/mrow><\/mtd><\/mtr><mtr columnalign=\"left\"><mtd columnalign=\"left\"><mtext>1<\/mtext><\/mtd><mtd columnalign=\"left\"><mrow><mtext>110<\/mtext><\/mrow><\/mtd><\/mtr><mtr columnalign=\"left\"><mtd columnalign=\"left\"><mtext>2<\/mtext><\/mtd><mtd columnalign=\"left\"><mrow><mtext>120<\/mtext><\/mrow><\/mtd><\/mtr><mtr columnalign=\"left\"><mtd columnalign=\"left\"><mtext>3<\/mtext><\/mtd><mtd columnalign=\"left\"><mrow><mtext>130<\/mtext><\/mrow><\/mtd><\/mtr><\/mtable><\/mrow><\/math><\/p>\n","a":"<math xmlns=\"http:\/\/www.w3.org\/1998\/Math\/MathML\"><mn>100<\/mn><mo>+<\/mo><mn>10<\/mn><mi>M<\/mi><\/math>","ansType":"input","points":5,"video":"write_algebraic_expressions_using_the_input_and_output_values_from"},{"id":"75428","standards":[{"id":"2454","name":"1.1","classid":"5"},{"id":"5109","name":"R.1","classid":"9"}],"q":"<p>Write an expression for three times the sum of 5 and a number.&#160; Write your answer without parentheses.<\/p>\n\n<p>Call the number <i>n<\/i>.<\/p>","a":"<math xmlns=\"http:\/\/www.w3.org\/1998\/Math\/MathML\"><mn>3<\/mn><mi>n<\/mi><mo>+<\/mo><mn>15<\/mn><\/math>","ansType":"input","points":5},{"id":"76334","standards":[{"id":"2454","name":"1.1","classid":"5"},{"id":"5109","name":"R.1","classid":"9"}],"prefix":"Jaime&#8217;s age is 6 years more than three times Marie&#8217;s age.","q":"<p>Write an expression for Jaime&#8217;s age.<\/p>\n\n<p>Call Marie&#8217;s age <i>n<\/i>.<\/p>","a":"<math><mrow><mn>3<\/mn><mi>n<\/mi><mo>+<\/mo><mn>6<\/mn><\/mrow><\/math>","ansType":"input","points":5},{"id":"76376","standards":[{"id":"2454","name":"1.1","classid":"5"},{"id":"5109","name":"R.1","classid":"9"}],"prefix":"Write an expression for seven less than three times a number.","q":"Call the number <i>n<\/i>.","a":"<math><mrow><mn>3<\/mn><mi>n<\/mi><mo>-<\/mo><mn>7<\/mn><\/mrow><\/math>","ansType":"input","points":5},{"id":"76562","standards":[{"id":"2454","name":"1.1","classid":"5"},{"id":"5109","name":"R.1","classid":"9"}],"prefix":"Write the following statement as an algebraic expression:","q":"<p>Twelve less than twice a number.<\/p>\n\n<p>Use <span class=\"math\"><i>x<\/i><\/span> to represent the unknown number.<\/p>","a":"<math><mrow><mn>2<\/mn><mi>x<\/mi><mo>-<\/mo><mn>12<\/mn><\/mrow><\/math>","ansType":"input","points":5},{"id":"83632","standards":[{"id":"2454","name":"1.1","classid":"5"},{"id":"5109","name":"R.1","classid":"9"}],"q":"A gymnastics academy displays its prices on the sign shown. Write an expression for the total cost of taking <i>c<\/i>classes. ","qImg":"http:\/\/denali.kineticbooks.com:8081\/media\/mathxa2\/pa_c1_eou1_table.gif","a":"<math xmlns=\"http:\/\/www.w3.org\/1998\/Math\/MathML\"><mrow><mn>20<\/mn><mo>+<\/mo><mn>5<\/mn><mi>c<\/mi><\/mrow><\/math>","ansType":"input","points":5,"video":"write_algebraic_expressions_about_products"},{"id":"83633","standards":[{"id":"2454","name":"1.1","classid":"5"},{"id":"5109","name":"R.1","classid":"9"}],"q":"As shown in the illustration, Denise is mixing socks, shirts and pants. If she has <i>x<\/i> pairs of socks, <i>y<\/i>tops and <i>z<\/i>bottoms, write an expression for how many outfits she can create. (And congratulations, you discovered the fundamental counting principle for yourself!)","qImg":"http:\/\/denali.kineticbooks.com:8081\/media\/mathxa2\/pa_c1_eou1_socks.gif","a":"<math xmlns=\"http:\/\/www.w3.org\/1998\/Math\/MathML\"><mrow><mi>x<\/mi><mo>&#183;<\/mo><mi>y<\/mi><mo>&#183;<\/mo><mi>z<\/mi><\/mrow><\/math>","ansType":"input","points":5,"video":"write_algebraic_expressions_about_products"},{"id":"83634","standards":[{"id":"2454","name":"1.1","classid":"5"},{"id":"5109","name":"R.1","classid":"9"}],"q":"The volume of a sphere is <math xmlns=\"http:\/\/www.w3.org\/1998\/Math\/MathML\"><mrow><mfrac linethickness=\"thin\"><mn>4<\/mn><mn>3<\/mn><\/mfrac><mi>&#960;<\/mi><msup><mi>r<\/mi><mn>3<\/mn><\/msup><\/mrow><\/math>. What is the total volume of the balls if their radius is 3? Use <math xmlns=\"http:\/\/www.w3.org\/1998\/Math\/MathML\"><mi>&#960;<\/mi><\/math> as part of your answer.","qImg":"http:\/\/denali.kineticbooks.com:8081\/media\/mathxa2\/pa_c1_eou1_balls.gif","a":"<math xmlns=\"http:\/\/www.w3.org\/1998\/Math\/MathML\"><mrow><mn>108<\/mn><mi>&#960;<\/mi><\/mrow><\/math>","ansType":"input","points":5,"video":"write_algebraic_expressions_about_products"},{"id":"94081","standards":[{"id":"2454","name":"1.1","classid":"5"},{"id":"5109","name":"R.1","classid":"9"}],"q":"You stop at a gas station for car repairs.  You pay $25 for windshield wipers, and buy <i>g<\/i> gallons of gas at $4 a gallon. Write an expression for the total amount of money you spend. ","hasSteps":true,"a":"<math><mrow><mn>25<\/mn><mo>+<\/mo><mn>4<\/mn><mi>g<\/mi><\/mrow><\/math>","ansType":"input","points":5,"video":"write_algebraic_expressions_about_sums_and_differences"},{"id":"94085","standards":[{"id":"2454","name":"1.1","classid":"5"},{"id":"5109","name":"R.1","classid":"9"}],"q":"Sam bought <span class=\"math\"><i>d<\/i><\/span> donuts. Each donut cost $2.50. He paid using a $10 bill. Write an expression for the amount of change he will receive. Use&#160;<i>d&#160;<\/i>for the amount of donuts. Your expression should produce an output in dollars.","a":"<math><mrow><mn>10<\/mn><mo>-<\/mo><mn>2.5<\/mn><mi>d<\/mi><\/mrow><\/math>","ansType":"input","points":5,"video":"write_algebraic_expressions_about_products"}];
	
	self.names = {
		excel: [
			"Abigail Hirano",
			"Lemuel Amorim",
			"Altha Cavins",
			"Sharonda Mongold",
			"Celestina Okeefe",
			"Blythe Ware",
			"Cierra Buie",
			"Mariette Garoutte",
			"Cliff Farless",
			"Christal Durrance",
			"Herman Zahn",
			"Winford Becnel",
			"Isaura Gossett",
			"Shoshana Brazier",
			"Ardell Ort",
			"Bethel Weiler",
			"Gilma Kidney",
		],
		pass: [
			"Keely Harter",
			"Michell Dunkelberger",
			"Merissa Krom",
			"Seema McAdams",
			"Kimberley Heilmann",
			"Adrienne McMath",
			"Dominick Harber",
			"Janett Solley",
			"Bev Dillow",
			"Ranee McKissick",
			"Yoko Ott",
			"Williams Shiflett",
			"Don Paez",
			"Deidra Stokely",
			"Jung Petrovich",
			"Launa Hyler",
		
		],
		fail: [
			"Eilene Tripoli",
			"Hermila Valerius",
			"Roderick Childress",
			"Ligia Pepe",
			"Melia Currie",
			"Julie Circle",
			"Vonnie Ryba",
			"Lilli Figeroa",
			"Clarice Raco",
			"Georgette Martinez",
			"Lakenya Kinlaw",
			"Cecile Strohm",
			"Loni Kozel",
			"Sanjuana Faison",
			"Tyson Mayhue",
			"Madie Holdren",
			"Lynetta Marcelino",
		]
	};
	
	
	self.flatNames = self.names.excel.concat(self.names.pass, self.names.fail).sort();
	
	self.studentScores = initScores();

	// This requires that everything be defined, so no "self." routines can be called.
	jumpToReport($routeParams.type, true);

	self.state = {
		show: 'Class',
		showText: 'Entire class',
		showTextTitle: 'Entire class',

		compare: 'None',

		section: 'All'
	};

	var textMap = {
		Student: 'Thompson, Alice\u25BE',
		Class: 'Entire class',
		None: '',
		Morning: 'Section: Morning\u25BE',
		Afternoon: 'Section: Afternoon\u25BE'
	};

//	PubSub.subscribe('filter1', function(ev, val){self.curStd = val});
	PubSub.subscribe('filter2', function(ev, val){self.curStudent = val});
	//=======================================================
	//=======================================================
	function calcPercent(fraction) {
		return Math.floor(fraction * 100);
	}
	
	//=======================================================
	//=======================================================
	function setActive(entry, parent)
	{
		self.activeReport = entry;

		self.reportTitle = parent.title + ' - ' + entry.text
	}
	this.setActive = setActive;
    
	function wtf() {
		console.log("Hello, world!");
	}
	//=======================================================
	//=======================================================
	function jumpToReport(id, noRoute)
	{
		var found = false;
		for (var i = 0, len = self.reports.length; i < len; i++)
		{
			_.forEach(self.reports[i].options, function(entry) {
				if (entry.id === id)
				{
					setActive(entry, self.reports[i]);
					self.reports[i].isOpen = true;
					found = true;

					if (!noRoute)
						$location.path('/graph/' + id, false);

					return false;
				}
			});

			if (found)
				break;
		}
	}
	this.jumpToReport = jumpToReport;

	//=======================================================
	//=======================================================
	this.gradeChange = function()
	{
		window.location.href = 'change';
	}

	//=======================================================
	//=======================================================
	this.compare = function(val)
	{
		self.state.compare = val;
		self.state.compareText = textMap[val];

		if (val === 'Student')
			self.state.compareText = 'McGee, Bubba\u25BE';

		self.state.compareTextTitle = self.state.compareText.replace(/(\u25BE|Section: )/g, '');
	}

	//=======================================================
	//=======================================================
	this.show = function(val)
	{
		self.state.show = val;
		self.state.showText = textMap[val];

		self.state.showTextTitle = self.state.showText.replace(/(\u25BE|Section: )/g, '');
	}

	//=======================================================
	//=======================================================
	this.section = function(val)
	{
		self.state.section = val;
	}

	//=======================================================
	//
	//=======================================================
	function getBar(idx)
	{
//		return '../images/mocks/bar' + idx + '.png';
		return 'images/mocks/bar' + idx + '.png';
	}

	//=======================================================
	//=======================================================
	this.barWidth = function(score, opts)
	{
		var width = score;

		// Support a large size
		if ((typeof opts === 'string' && opts === 'large') || (opts && opts.size && opts.size === 'large'))
			width *= 2.5;

		// Account for the border
		if (typeof opts === 'object' && opts.container)
			width += 2;

		return {width: width + 'px'};
	}

	//=======================================================
	//=======================================================
	this.averagePercent = function(correct, total)
	{
		return Math.round (correct / total * 100);
	}

	//=======================================================
	//=======================================================
	
	function randomScore()
	{
		var scores = [Math.floor(Math.random() * 22 + 5), 0];
		var temp = Math.round((scores[0] * 100) / 27);
		scores[1] = temp;
		return scores;
	}
	//=======================================================
	//
	//=======================================================
	this.truncName = function(str)
	{
		return truncName(str);
	}

	//=======================================================
	//
	//=======================================================
	function truncName(str)
	{
		var maxlen = 20;

		if (str.length <= maxlen)
			return str;

		return str.substring(0, maxlen-3) + '...';
	}

	//=======================================================
	//=======================================================
	this.showStds = function(str)
	{
		return true;

		var regex = /[0-9]/;
		return !regex.test(str);
	}
	
	function plural(num) {
		if (num === 1) {
			return "student";
		} else {
			return "students";
		}
	}
	//=======================================================
	//
	//=======================================================
	function initScores()
	{
		var out = {};
		_.forEach(self.flatNames, function(name) {
			var scores = randomScore();
			out[name] = {
				score: scores[0],
				percent: scores[1]
			}
		});
		return out;
	}

}]);

'use strict';

//===========================================================================================
//===========================================================================================
angular.module('grades')

.directive('navHeader', function() {

	return {
		restrict: 'E',
		scope: {},
		controller: 'NavCtrl',
		controllerAs: 'nav',
		templateUrl: 'Nav/nav-header.html',
		replace: true,
		bindTo: true
	};
})

//===========================================================================================
.controller('NavCtrl', ["$scope", "Problems", "State", "kbBootstrap", "PubSub", "$modal", "hotkeys", "$window", "CloudSave", function($scope, Problems, State, kbBootstrap, PubSub, $modal, hotkeys, $window, CloudSave) {

	var self = this;

	// This will need to be bootstrapped, since we don't know which items are applicable.
	var menuOptions = [
		{icon:'images/slidermenu/iconHomework.gif', text:'Assignments', act: function(){linkTo('/syllabus.php')}},
		{icon: 'images/slidermenu/iconGraphs.png', text: 'Grades', act: function(){linkTo('')}},
		{icon: 'images/slidermenu/iconAdmin.png', text: 'Admin', act: function(){linkTo('/admin.php')}},
		{icon: 'images/slidermenu/iconSettings.gif', text: 'Settings', act: function(){linkTo('/admin_admin_detail.php?user_id={$user}&page=edit')}},
		{icon: 'images/slidermenu/iconHelp.gif', text: 'Support', act: function(){linkTo('http://www.perfectionlearning.com/kinetic-support?pid={$pid}')}},
		{icon: 'images/slidermenu/iconLogout.gif', text: 'Logout', act: function(){linkTo('//" . KMATHDOTCOM . "/logout.php')}}
	];
	self.menuModel = {
		items: menuOptions,
		opened: false
	};

	hotkeys
		.bindTo($scope)
		.add({
			combo: 'alt+v',
			description: 'Display application version',
			callback: showVersion
		});

	State.set('pendFilter', false);

	self.pendCnt = Problems.pendingCount();
	self.totalCnt = Problems.count();

	PubSub.subscribe('status', setStatus, $scope);
	PubSub.subscribe('saveStart', saving, $scope);
	PubSub.subscribe('saveDone', savingDone, $scope);

	$window.onbeforeunload = navAway;		// This catches actual page changes, and not routes. That's what we want.

	//===========================================================================================
	// Navigation
	//===========================================================================================

	//=======================================================
	//=======================================================
	self.getClass = function(setting)
	{
		var disabled = '';
		if (setting && self.pendCnt === 0)
			disabled = ' disabled';

		if (State.get('pendFilter') == setting)
			return 'active btn-default' + disabled;
		else
			return 'btn-info' + disabled;
	}

	//=======================================================
	//=======================================================
	self.setFilter = function(setting)
	{
		State.set('pendFilter', setting);

		// Reset the scroll bar to the top (technically, just let the world know the filter has changed. Let the world do whatever it wants.)
		PubSub.publish('filter_change');
	}

	//=======================================================
	//=======================================================
	self.done = function()
	{
		var dest = kbBootstrap.doneLink;
//		linkTo(dest);
		window.location.href = dest;		// @FIXME/dg: Use linkTo, but we're temporarily disabling the slider menu
	}

	//=======================================================
	//=======================================================
	self.doneBtnClass = function()
	{
		return true;	//self.hasProblems() ? '' : 'disabled';
	}

	//=======================================================
	// The "Done" button will display "Done" or "Cancel", depending
	// on circumstances.
	//=======================================================
	self.doneBtnName = function()
	{
		return 'Done';
	}

	//=======================================================
	//
	//=======================================================
	function linkTo(dest)
	{
		return;
		window.location.href = dest;
	}

	//=======================================================
	// If we're in the middle of saving, don't let the user leave
	// without confirmation.
	//=======================================================
	function navAway()
	{
		if (!CloudSave.isIdle())
			return "Your changes haven't been saved yet.";

		return undefined;
	}

	//===========================================================================================
	// General Event Handlers
	//===========================================================================================

	//=======================================================
	//=======================================================
	self.openMenu = function()
	{
		self.menuModel.opened = true;
	}

	//=======================================================
	// Having HTML in here violates controller/view separation.
	// However, the HTML is so simple we can look the other way.
	// Make a version directive since we're reusing this in each
	// module!
	//=======================================================
	function showVersion()
	{
		// Don't open if it's already being displayed
		if (self.activeModals)
			return;

		// Create the modal and save the instance reference
		self.activeModals = $modal.open({
			template: '<div id="loadFailed">' + State.get('appName') + ' version ' + State.get('version') + '</div>',
		});

		// Monitor the 'result' promise, and remove the instance reference when it closes
		self.activeModals.result.then(versionClosed, versionClosed);
	}

	//=======================================================
	//=======================================================
	function versionClosed()
	{
		self.activeModals = null;
	}

	//=======================================================
	//=======================================================
	function saving()
	{
		self.isSaving = true;
	}

	//=======================================================
	//=======================================================
	function savingDone()
	{
		// Update the pending count on any change
		self.pendCnt = Problems.pendingCount();

		// UI
		setTimeout(clearSaved, 500);
	}

	//=======================================================
	//
	//=======================================================
	function clearSaved()
	{
		$scope.$apply(function() {
			self.isSaving = false;
			self.isSaved = false;
		});
	}

	//=======================================================
	//=======================================================
	function showLoading()
	{
		setStatus(null, {act: 'loading'});
	}

	//=======================================================
	//=======================================================
	function clearLoading()
	{
		setStatus(null, {act: 'clear'});
	}

	//=======================================================
	// Display any requested status updates
	//=======================================================
	function setStatus(event, status)
	{
		// Validation
		if (typeof status !== 'object' && typeof status !== 'string')
			return;

		if (typeof status === 'string')
			var msg = status;

		else if (status.act && status.act === 'clear')
			msg = '';
		else if (status.act && status.act === 'loading')
			msg = 'LOADING...';

		// Hurray for multiple anonymous functions. This is a mess!
		// Sometimes setStatus is called asynchronously, sometimes synchronously.
		// When called async., we need to use $apply. When sync., we can't use $apply (throws inprog error).
		// Force async mode with setTimeout, then use $apply because we have to in async mode.
		setTimeout(function() {
			$scope.$apply(function() {
				self.status = msg;
			});
		}, 0);
	}

	//=======================================================
	//=======================================================
	self.options = function()
	{
		$modal.open({
			template: '<img src="images/mocks/Prefs.png">',
			size: 'lg'
		});
	}

}]);

'use strict';

//===========================================================================================
// Packages many small requests, sending them off at a fixed period.
//
// Duplicate and obsolete requests are eliminated. This is a nice optimization, but it's not
// always desired. If the timing of the action matters, such as setting that gets toggled at
// key moments, this feature would be bad. It can either be disabled, or the client could
// ensure unique IDs.
//===========================================================================================
angular.module('action-service')

//=======================================================
//=======================================================
.service('CloudSave', ["PubSub", function(PubSub) {

	var savePeriod = 1000;		// Time, in milliseconds, between saves

	var pending = false;
	var transmitting = false;

	var pendingQueue = [];		// Queue being added to.
	var transmitQueue = [];		// Data currently being transmitted (retained in case of failure)

	// External routine that performs the actual save operation, typically a REST client front-end
	var commManager;

	// External function that gets called after successful saves
	var notifyStartHandler, notifyDoneHandler;

	//=======================================================
	// Initialize with an external save function.
	//=======================================================
	function init(comm, notifyStart, notifyDone)
	{
		commManager = comm;
		notifyStartHandler = notifyStart;
		notifyDoneHandler = notifyDone;

		pendingQueue = [];
		transmitQueue = [];
		pending = false;
		transmitting = false;
	}

	//=======================================================
	// API: Add an item to the queue
	//=======================================================
	function add(id, data)
	{
		// Add to the queue
		pendingQueue = addToQueue(id, data, pendingQueue);

		// Transmit, now if we haven't transmitted in a while.
		// Otherwise, queue it up and send it later.
		if (!pending)
			scheduleTransmission();
	}

	//=======================================================
	// Adds a single item to the queue, removing dupes first.
	//=======================================================
	function addToQueue(id, data, queue)
	{
		// Check for existing items to remove
		queue = _.reject(queue, function(entry){return entry.id === id});

		// Add the item to the end of the queue
		queue.push({
			id: id,
			data: data
		});

		return queue;
	}

	//=======================================================
	// Request a transmission at some point in the near future.
	//=======================================================
	function scheduleTransmission()
	{
		pending = true;
		setTimeout(notifyAndSave, 1000);
	}

	//=======================================================
	// It's time for an actual transmission.
	//=======================================================
	function notifyAndSave()
	{
		PubSub.publish('saveStart');
		doSave();
	}

	//=======================================================
	// It's time for an actual transmission.
	//=======================================================
	function doSave()
	{
		transmitting = true;

		// Transmit the current collection
		transmitQueue = pendingQueue;
		pendingQueue = [];

		var data = _.pluck(transmitQueue, 'data');
		notifyStartHandler && notifyStartHandler(data);

		commManager(data).then(saveSuccess, saveFailed);
	}

	//=======================================================
	// Save failed. Add failed items back onto the queue.
	//=======================================================
	function saveFailed(event)
	{
		// Combine the queues (pending items added to the end, but replace duplicates)
		for (var i = 0, len = pendingQueue.length; i < len; i++)
			transmitQueue = addToQueue(pendingQueue[i].id, pendingQueue[i].data, transmitQueue);

		pendingQueue = transmitQueue;	// Silly overhead for doSave()

		// Start a resend immediately
		doSave();
	}

	//=======================================================
	// The transmission was successful. Allow more requests.
	//=======================================================
	function saveSuccess(response)
	{
		// Empty the queue
		transmitQueue = [];

		// Notify interested parties
		notifyDoneHandler && notifyDoneHandler(response);

		// Flag to allow more requests
		transmitting = false;
		pending = false;
		PubSub.publish('saveDone');

		// If data is already queued, trigger a new transmission
		if (pendingQueue.length > 0)
			scheduleTransmission();
	}

	//=======================================================
	// API: Is a transmission currently underway?
	//=======================================================
	function isSaving()
	{
		return transmitting;
	}

	//=======================================================
	// API: Is the system completely at rest?
	// That means there are no current transmissions,
	// and nothing is queued for transmission.
	//=======================================================
	function isIdle()
	{
		return (transmitQueue.length === 0 && pendingQueue.length === 0);
	}

	//=======================================================
	// Public API
	//=======================================================
	return {
		init: init,
		add: add,
		isSaving: isSaving,
		isIdle: isIdle
	}
}]);

'use strict';

//===========================================================================================
//===========================================================================================
angular.module('comm-service')

//===========================================================================================
// Service to fetch and transmit data.
//
// This handles caching and provides a public API that isolates data transmission.
//
// A single API function may perform multiple REST calls to provide requested data, isolating
// complexity and the server REST interface.
//===========================================================================================
.service('Comm', ["$http", function($http) {

	var base = 'http://dgalarneau-hw-bachelor.kbooks.local/rest.php/';

	//=======================================================
	// Set the grade for a single problem
	//
	// Requires:
	//   Assignment ID (aid) -- pset_id
	//   Question ID (qid) -- psp_id
	//   User ID (uid) -- user_id
	//   grade: The new score
	//=======================================================
	function setGrade(list)
	{
		var data = list[0];

		//$app->put('/pset/:pset_id/:psp_id/user/:student_id/score', 'adjust_score' );
		var url = base + 'pset/' + data.aid + '/' + data.qid + '/user/' + data.uid + '/score';
		return $http.put(url, {score: data.grade});
	}

	//=======================================================
	// Public API
	//=======================================================
	return {
		setGrade: setGrade
	};

}]);

'use strict';

//===========================================================================================
// Graded Problems
//===========================================================================================
angular.module('grades')

//=======================================================
//=======================================================
.service('Problems', ["kbBootstrap", "PubSub", "Comm", "CloudSave", function(kbBootstrap, PubSub, Comm, CloudSave) {

	//----------------------------------------------------------------------------
	// Internal model
	//----------------------------------------------------------------------------
	// Translate server answer types to something more sane
	var ansMap = {
		Kinetic: 'equation',
		input: 'equation',
		Multiple: 'check',
		MultKinetic: 'freeInput',
		VTPGraph: 'graphPlot',
		graphConst: 'graphConst',	// No change
		'no input': 'paper',
		essay: 'essay',
		check: 'check',
		radio: 'radio'
	};

	// Functions to normalize submitted and stored answers
	var format = {
		equation: formatGenericA,
		freeInput: formatFreeA,
		check: formatMultChoice,
		radio: formatMultChoice,
		graphPlot: formatGenericA,
		graphConst: formatGraphConstA,
		essay: formatGenericA,
		paper: formatGenericA
	};

	// Answer types that only allow a single instance
	var singleQtyOnly = ['radio', 'check'];

	// qNum
	// pset_id, psp_id, user_id, first_name, last_name
	// prefix, question, qImg, qImgText, choices
	// graphequations, graphparms
	// answer, ansType,
	// points, maxPoints, tries, maxTries, ++isPending
	// given
	var probList = [];

	// mode, ++title
	var metaData = {};
	CloudSave.init(Comm.setGrade);

	//=======================================================
	// Perform bootstrapping -- why here? Where else would it go?
	//=======================================================
	init(kbBootstrap.gradebook.data, kbBootstrap.title);

	//=======================================================
	//
	//=======================================================
	function init(data, title)
	{
		// Do some formatting and conversion.
		_.each(data, function(src, idx) {

			var newProb = {
				id: idx,
				qNum: src.qNum || (idx+1),
				aid: src.pset_id,
				qid: src.psp_id,
				uid: src.user_id,
				uname: {first: src.first_name, last: src.last_name},

				prefix: src.prefix,
				q: src.question,
				choices: src.choices,
				qImg: src.qImg,
				qImgOverlay: src.qImgText,

				graph: {eqs: src.graphequations, axis: src.graphparms},	// Break this down better

				a: src.answer,
				ansType: ansMap[src.ansType],

				score: (src.status !== 'pending' ? parseFloat(src.points) : ''),
//				score: parseFloat(src.points),
				scoreMax: parseFloat(src.maxPoints),
				attempts: src.tries,
				attemptsMax: src.maxTries,
				attemptsLeft: src.maxTries - src.tries,
				status: src.status,
				isPending: src.status === 'pending',	// Shortcut

				submission: src.given || ''
			};

			adjustAttempts(newProb);
			cleanEquations(newProb);
			cleanAnswer(newProb);
			format[newProb.ansType] && format[newProb.ansType](newProb);

			probList.push(newProb);
		});

		// Now set metadata
		metaData.mode = setMode();
		metaData.title = title;
	}

//------------------------------------------------------------------------------
// Formatters
//------------------------------------------------------------------------------

	//=======================================================
	//
	//=======================================================
	function formatGenericA(prob)
	{
		prob.cleanA = prob.a;
		prob.cleanSub = prob.submission;
	}

	//=======================================================
	//
	//=======================================================
	function formatFreeA(prob)
	{
		prob.cleanA = stripFIAnswer(prob.a);
		prob.cleanSub = prob.submission;
	}

	//=======================================================
	//
	//=======================================================
	function formatMultChoice(prob)
	{
		prob.cleanA = _.cloneDeep(prob.choices);
		prob.cleanSub = _.cloneDeep(prob.choices);

		var correct = prob.a.split(',');
		var submits = prob.submission.split(',');

		for (var i = 0, len = prob.choices.length; i < len; i++)
		{
			if (correct.indexOf(prob.choices[i].id) !== -1)
			{
				prob.cleanA[i].check = true;
//				prob.cleanA[i].style = 'mcCorrectAns';
			}

			if (submits.indexOf(prob.choices[i].id) !== -1)
			{
				prob.cleanSub[i].check = true;
				prob.cleanSub[i].style = prob.cleanA[i].check ? 'mcCorrectSub' : 'mcWrongSub';
			}
		}
	}

	//=======================================================
	//
	//=======================================================
	function formatGraphConstA(prob)
	{
		prob.cleanA = prob.graph.eqs[0];

		var type = prob.cleanA.split('=')[0];

		prob.cleanSub = type + '=' + prob.submission;
	}

	//=======================================================
	//
	//=======================================================
	function stripFIAnswer(mml)
	{
		var ansList = [];
		var regex = /<maction[^>]*>(<mtext>|<mn[^>]*>)*(.+?)(<\/mtext>|<\/mn>)*<\/maction>/g;

		// replace seems like the wrong choice. We just want to search. But multiple sets of parens means we'd have to prune out most of the results.
		mml.replace(regex, function(full, opener, val, closer) {
			ansList.push(val);	// Save the part we care about.
			return full;			// Return without changes. Clumsy!
		});

		return ansList.join(',');
	}

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------

	//=======================================================
	//
	//=======================================================
	function adjustAttempts(prob)
	{
		var singleAttempt = ['paper', 'essay', 'check', 'radio'];
		if (singleAttempt.indexOf(prob.ansType) !== -1)
			prob.attemptsMax = 1;

		if (prob.attempts > prob.attemptsMax)
		{
			prob.attempts = prob.attemptsMax;
			prob.attemptsLeft = 0;
		}
	}

	//=======================================================
	// Determines to mode we're in: Multiple students, or multiple problems
	//=======================================================
	function setMode()
	{
		// If there's only one problem, it could go either way. Just pick one.
		// multiProblem looks better, so that's our default.
		if (probList.length < 2)
			return 'multiProblem';

		// If the first 2 problems are for the same user, assume they all are.
		if (probList[0].uid === probList[1].uid)
			return 'multiProblem';

		return 'multiStudent';
	}

//------------------------------------------------------------------------------
// These are a direct cut-and-paste from the Assignments problem model.
// Either the model needs to be shared (probably bad), or this functionality
// needs to be moved to a service!
//------------------------------------------------------------------------------

	//=======================================================
	//
	//=======================================================
	function cleanEquations(prob)
	{
		prob.q = cleanMathML(prob.q);
		prob.a = cleanMathML(prob.a);

		for (var i = 0; i < (prob.choices && prob.choices.length); i++)
			prob.choices[i].a = cleanMathML(prob.choices[i].a);
	}

	//=======================================================
	// @FIXME/dg: This is causing issues in tags with hyphens.
	// Clean up text nodes only.
	//=======================================================
	function cleanMathML(str)
	{
		if (str)
			return str.replace(/-/g, '&#8722;');

		return '';
	}

	//=======================================================
	//
	//=======================================================
	function cleanAnswer(prob)
	{
		if (prob.ansType === 'equation')
		{
			// Split off prefixes and suffixes
			var split = splitEqAnswer(prob.a);
			prob.a = split.a;
			prob.ansPrefix = split.pre && replaceSpaces(split.pre);
			prob.ansSuffix = split.post && replaceSpaces(split.post);

			// Convert AND and OR symbols to text
			var fixAnd = /<mo>(\u2227|&#x2227;|&#8743;)<\/mo>/g;
			var fixOr = /<mo>(\u2228|&#x2228;|&#8744;)<\/mo>/g;
			prob.a = prob.a.replace(fixAnd, '<mtext>&nbsp;and&nbsp;</mtext>');
			prob.a = prob.a.replace(fixOr, '<mtext>&nbsp;or&nbsp;</mtext>');
		}
	}

	//=======================================================
	//=======================================================
	function splitEqAnswer(str)
	{
		str = str.trim();

		if (typeof(str) !== 'string')
			return {a: str};

		var open = findAll('<outside>', str);
		var close = findAll('</outside>', str);

		var errString = 'Prefix/Suffix error!';

		// Tag mismatch or too many tags
		if ((open.length !== close.length) || open.length > 2)
			return {a: errString};

		// No outside tags -- most common occurrence
		if (!open.length)
			return {a: str};

		var outOpen = "<outside>";
		var outClose = "</outside>";

		if (open[0] === 0)
		{
			var pre = str.substring(open[0] + outOpen.length, close[0]);
			open.shift();
			close.shift();
		}

		if (close.length && (close[0] === str.length - outClose.length))
		{
			var post = str.substring(open[0] + outOpen.length, str.length - outClose.length);
			open.shift();
			close.shift();
		}

		// Check for tags not at the start or end of the string
		if (open.length)
			return {a: errString};

		// Strip all outside tags
		var regex = /<outside>.*?<\/outside>/g;
		str = str.replace(regex, '');

		return {
			a: str.trim(),
			pre: pre,
			post: post
		};
	}

	//=======================================================
	// Poor man's XML-safe string replacement
	// This is seriously inadequate, but may be
	// just crazy enough to work.
	//
	// It's likely to cause issues.
	//=======================================================
	function replaceSpaces(str)
	{
		if (str[0] === ' ')
			str = '\u00A0' + str;;
		if (_.endsWith(str, ' '))
			str += '\u00A0';

		return str;
	}

	//=======================================================
	// Find all instances of a substring within a string.
	// The return value is an array of indices.
	//=======================================================
	function findAll(needle, haystack)
	{
		var out = [];
		var idx = -1;

		while (true)
		{
			idx = haystack.indexOf(needle, idx+1);

			if (idx === -1)
				break;

			out.push(idx);
		}

		return out;
	}

	//=======================================================
	// Look up a problem by ID
	//=======================================================
	function findProblem(id)
	{
		for (var i = 0, len = probList.length; i < len; i++)
		{
			if (probList[i].id === id)
				return probList[i];
		}

		return null;
	}

	//=======================================================
	// Updates the status. It can't set the pending status, because
	// there is no way to know.
	//=======================================================
	function getStatus(prob)
	{
		if (prob.score > 0)
			return 'correct';

		if (prob.attempts >= prob.attemptsMax)
			return 'incorrect';

		return 'new';
	}

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------

	//=======================================================
	//
	//=======================================================
	function get()
	{
		return angular.copy(probList);
	}

	//=======================================================
	//
	//=======================================================
	function pendingCount()
	{
		var cnt = 0;

		for (var i = 0, len = probList.length; i < len; i++)
		{
			if (probList[i].isPending)
				cnt++;
		}

		return cnt;
	}

	//=======================================================
	// Returns the total number of problems
	//=======================================================
	function count()
	{
		return probList.length;
	}

	//=======================================================
	// Modifies the score for a single problem
	// Updates the status of the problem based on the result.
	//=======================================================
	function setPoints(id, pts)
	{
		// Find the problems
		var prob = findProblem(id);
		if (!prob)
			return null;

		// Ensure something is actually changing.
		// If the problem was pending, any change is worth noting.
		if (prob.score === pts && !prob.isPending)
			return null;

		// Set the new score
		prob.score = pts;

		// Update various other fields
		if (pts <= 0)
		{
			prob.attempts = prob.attemptsMax;	// This marks the problem as incorrect. Unfortunately, we lose the proper count.
			prob.attemptsLeft = 0;
		}

		prob.isPending = false;
		prob.status = getStatus(prob);	// Since we set the attempts above, it's impossible for this to be "new" (or "pending", for other reasons)

		// Initiate a background save
		CloudSave.add('gradeChange', {
			aid: prob.aid,
			qid: prob.qid,
			uid: prob.uid,
			grade: pts
		});

		// Return the new problem instance to the client so they don't have to do all the same calculations
		return angular.copy(prob);
	}

	//=======================================================
	// Returns the page's mode
	//=======================================================
	function getMode()
	{
		return metaData.mode;
	}

	//=======================================================
	//
	//=======================================================
	function getTitle()
	{
		return metaData.title;
	}

	//=======================================================
	// Public API
	//=======================================================
	return {
		get: get,
		pendingCount: pendingCount,
		count: count,
		setPoints: setPoints,

		mode: getMode,
		title: getTitle,
	};

}]);

'use strict';

//===========================================================================================
// The simplest persistent state possible
//
// State is currently being used for two different things:
//   1) App-wide global variables (option settings, etc.)
//   2) Constants
//
// The constants should probably be replaced by a .constant provider. Technically, they are
// part of the global variables needed everywhere. However, their read-only nature and
// separate source suggests they be separated from the rest of State.
//===========================================================================================
angular.module('state-service', ['pubsub-service'])

//=======================================================
//=======================================================
.service('State', ["PubSub", function(PubSub) {

	var state = {

		// Application Version
		appName: 'Grades',
		version: '0.1.1'
	};

	return {

		//=======================================================
		//=======================================================
		get: function(key) {
			return state[key];
		},

		//=======================================================
		//=======================================================
		set: function(key, value) {
			if (state[key] !== value)
			{
				state[key] = value;
				PubSub.publish('StateChange:' + key, value);		// State change notification
			}
		}
	};

}]);

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

'use strict';

//===========================================================================================
// A Publish-Subscribe Event Manager
//
// Yanked from: https://gist.github.com/turtlemonvh/10686980/038e8b023f32b98325363513bf2a7245470eaf80
//===========================================================================================
angular.module('pubsub-service', [])

.factory('PubSub', ["$rootScope", function($rootScope) {

	var pubSub = {};

	//=======================================================
	// Publish an event, along with optional data
	//=======================================================
	pubSub.publish = function(msg, data)
	{
		if (typeof data === 'undefined')
			data = {};

		$rootScope.$emit(msg, data);
	};

	//=======================================================
	// Subscribe to an event
	//=======================================================
	pubSub.subscribe = function(msg, func, scope)
	{
		var unbind = $rootScope.$on(msg, func);

		if (scope)
			scope.$on('$destroy', unbind);
	};

	//=======================================================
	// PUBLIC API
	//=======================================================
	return pubSub;
}]);

'use strict';

//===========================================================================================
// Angular Directive For KB Math Graphs
//
// PARAMS:
//   width, height: in pixels
//   eqs: Array of equations (strings) to draw
//   axis: {x:[min,max,step], y:[min,max,step], skip: Int(def:1), usePiLabels: Boolean}
//
// Version 1.0. August 18th, 2014
//===========================================================================================
angular.module('kbGraph', [])

.directive('kbGraph', ["$document", function($document) {

	var self;

	//---------------------------------------------------------------------------------
	//---------------------------------------------------------------------------------
	var defaults = {

		width: 200,
		height: 200,

		eqs: [],
		axis: {
			x: [-100, 100, 10],
			y: [-100, 100, 10],
			skip: 1,
			usePiLabels: false
		}
	}

	//---------------------------------------------------------------------------------
	// Outer template. Since we have variables, we have to create it manually rather
	// than just returning it.
	//---------------------------------------------------------------------------------
	var template = '<canvas></canvas>';

	//---------------------------------------------------------------------------------
	// Global variables. These should almost certainly be members instead, but as long
	// as the plugin isn't interactive it shouldn't matter.
	//---------------------------------------------------------------------------------

	// graph
	var _xMax_lgc, _xMin_lgc, _xStep_lgc, xUpperBound;
	var _yMax_lgc, _yMin_lgc, _yStep_lgc;
	var _aryEq;
	var ctx;

	// graphGrid
	var Pi = '\u03c0';   //'&#960';
	var _negSignW = 2; // pixels

	var opts;
	var _xGrid, _yGrid;

	var style = {
		pointColor: 'red',
		pointTextColor: 'darkgreen',
		bgColor: 'white',
		gridColor: 'lightgray',
		axisColor: 'black',
		gridFont: "12px serif",
		gridFontColor: '#707070' // light gray
	};

	//=======================================================
	//
	//=======================================================
	function link(scope, element, attrs)
	{
		self = scope;

		scope.settings = _.extend({}, defaults, scope.options);

		// Add in answer points if they were supplied
		if (scope.answer)
			addAnswers(scope.answer);

		// Create the canvas element.
		element.html(template);
		scope.canvas = angular.element(element.children()[0]);

		scope.canvas.attr({
			'class': 'kbGraph',
			width: scope.settings.width,
			height: scope.settings.height
		});

		// Fill in the equations
		draw(scope.canvas);
	}

	//=======================================================
	//
	//=======================================================
	function addAnswers(ans)
	{
		var parsed = parseGraphPoints(ans);

		self.settings.eqs = self.settings.eqs.concat(parsed);
	}

	//=======================================================================
	// parseGraphPoints
	//=======================================================================
	function parseGraphPoints(strPoints)
	{
		var points = strPoints.split(",");
		var pointCount = points.length;

		var eq = [];
		for (var i = 0; i < pointCount; i+=2)
			eq.push("point=" + points[i] + "," + points[i+1]);

		return eq;
	}

//===========================================================================
// Directive configuration
//===========================================================================
	return {
		restrict: 'E',
		scope: {
			options: '=options',
			answer: '=kbAnswer'
		},

		link: link
	};


//===========================================================================================
// Private methods
//===========================================================================================

//===========================================================================================
// EQUATIONS AND GENERAL DRAWING
//===========================================================================================

	/*************************************************************************
	 This is the main function of the graph object
	 Input:
		_aryEq - arry of equations to draw
	*************************************************************************/
	function draw(canvas)
	{
		var eq = self.settings.eqs;
		if (eq.length < 1)
			return;

		_aryEq = eq.slice(0);		// Clone

		setAxis(canvas);
		gridDraw();
		drawEquations();
	}

	//---------------------------------------
	//---------------------------------------
	function setAxis(canvas)
	{
		var parms = self.settings.axis;

		// Set some default values if they are missing
		if (typeof parms.x === 'undefined')
			parms.x = [-10, 10, 1];
		if (typeof parms.y === 'undefined')
			parms.y = [-10, 10, 1];
		if (typeof parms.skip === 'undefined')
			parms.skip = 1;

		if (typeof parms.x === 'string')
			parms.x = parms.x.split(',');
		if (typeof parms.y === 'string')
			parms.y = parms.y.split(',');

		// Get the 2D context
		ctx = canvas[0].getContext("2d");

		gridCreate({
			xRange: parms.x,
			yRange: parms.y,
			labelSkip: parms.skip,
			usePiLabels: !!parms.usePiLabels
		});

		// index values for xRange, yRange to replace the magic numbers:
		var minIdx = 0, maxIdx = 1, StepSize = 2;

		_xMax_lgc = parms.x[maxIdx];
		_xMin_lgc = parms.x[minIdx];
		_xStep_lgc = parms.x[StepSize];

		xUpperBound = _xMax_lgc * 1.2; // make sure the graph draws to the border

		_yMax_lgc = parms.y[maxIdx];
		_yMin_lgc = parms.y[minIdx];
		_yStep_lgc = parms.y[StepSize];
	}

	//===================== draw equations ============================
	function appendColorFn(arg, color, drawFn)
	{
		drawFn.apply(this, arg.concat(color));
	}

	//=================================================
	//=================================================
	function initConicFn(arg, color)
	{
		arg.unshift(color); // Add elements at beginning of args array
		return initConics.apply(this, arg);
	}

	//=================================================
	//=================================================
	function drawEquations(newEq)
	{
		var drawAry;

		if (newEq)  drawAry = newEq;
		else
		{
			if (!_aryEq || _aryEq.length == 0)  return;
			drawAry = _aryEq;
		}

		// set transform matrix to identity:
		ctx.setTransform(1, 0, 0, 1, 0, 0);

		var strEq, colorEq, eqType, args, option;

		var eq = {
			line: { nParam:2,   fn: function(arg, color){ appendColorFn(arg, color, drawLineEqn) } },// 'line',

			circle: { nParam:3,   fn: function(arg, color){ appendColorFn(arg, color, drawCircle) } }, // 'circle',

			parabolax2: { nParam:3,   fn: function (arg, color)                              // 'parabolax2',
					{   var cnc = initConicFn(arg, color);

						// parabolaX2 h,k,p -- using formula 4p(y-k)=(x-h)^2
						// after translate to (h, k): y = +- x^2 / 4p
						cnc.xSlowThrink = 0;
						cnc.bDrawPositiveY = false;
						cnc.Eq = function(x, a) { return x*x / (4*a); }
						var p = arg[3], h = arg[1]; // color, h, k, a, b
						var xMaxY_lgc = Math.sqrt(4 * p * _yMax_lgc); // since 4py = x^2

						if (xMaxY_lgc < _xMax_lgc * 0.75)
						{
							cnc.xSlowThrink = xMaxY_lgc / 16;
							cnc.xfastThrink1 = xMaxY_lgc * 3 / 10;
							cnc.xfastThrink2 = xMaxY_lgc * 1 / 2;
							cnc.thrinkSlowFactor = 49/50; //
							cnc.thrinkFastFactor1 = 49/50;
							cnc.thrinkFastFactor2 = 49/50; //1/29; //17/49;
							cnc.xStart = 0;
							cnc.dX = -cnc.dX; // make it positive
							cnc.xCompare = function(x) { return x <= xUpperBound; }
							cnc.xChangeIncRate = function(x, threshold) { return x > threshold; }
						}

						arg.unshift(cnc);	// stuff extra param at beginning of arg
						drawConics.apply(this, arg); }
					},

			parabolay2: { nParam:3,   fn: function (arg, color)                              // 'parabolay2',
					{   var cnc = initConicFn(arg, color);

						// parabolaY2 h,k,p -- using formula 4p(x-h)=(y-k)^2
						// after translate to (h, k): y = +- sqrt(4px)
						cnc.xSlowThrink = cnc.xfastThrink2 / 4;
						cnc.bDrawNegativeX = false;

						var a = arg[3]; // color, h, k, a, b
						var Sign = mathSign(a); // sign of a
						cnc.xStart *= Sign;
						cnc.dX *= Sign; // keep going forever with this condition??
						if (Sign < 0)
							cnc.xCompare = function(x) { return x <= cnc.xVertex; };

						cnc.Eq = function(x, a) { return 2 * Math.sqrt( a * x ); }
						arg.unshift(cnc);	// stuff extra param at beginning of arg
						drawConics.apply(this, arg); }
					},

			ellipse: { nParam:4,   fn: function (arg, color)                              // 'ellipse',
					{   var cnc = initConicFn(arg, color);
						var a = arg[3]; // color, h, k, a, b
						cnc.xVertex = a;
						cnc.xVertexPx = gridXLgcLengthToPx(a);
						cnc.dotSize = 1;
						cnc.xSlowThrink = a / 2;
						cnc.xfastThrink1 = a * 17 / 20;
						cnc.xfastThrink2 = a * 79 / 80;
						cnc.thrinkSlowFactor = 19/20; //
						cnc.thrinkFastFactor1 = 18/19;
						cnc.thrinkFastFactor2 = 1/49;
						cnc.xStart = 0;
						cnc.dX = -cnc.dX; // make it positive
						cnc.xCompare = function(x) { return x <= Math.min(a, xUpperBound); };
						/**********************************************************************
							Draw an ellipse in the equation of (x-h)^2/a^2 + (y-k)^2/b^2 = 1;
							if h, k are zeros (we translate the system origin to h,k),
							the resulting equation will be     x^2/a^2 + y^2/b^2 = 1;

							therefore:   y = +- sqrt(1 - x^2/a^2) * b
						 **********************************************************************/
						cnc.Eq = function(x, a, b) { return Math.sqrt( 1 - x*x / (a*a) ) * b; }
						arg.unshift(cnc);	// stuff extra param at beginning of arg
						drawConics.apply(this, arg); }
					},

			hyperbolaxpos: { nParam:4,   fn: function (arg, color)                           // 'hyperbolaxpos',
					{   var cnc = initConicFn(arg, color);
						var a = arg[3], b = arg[4]; // color, h, k, a, b
						cnc.xVertex = a;
						cnc.xVertexPx = gridXLgcLengthToPx(a);

						cnc.xSlowThrink=  a * 1.42;

						cnc.thrinkFastFactor1= 19/20;
						cnc.thrinkFastFactor2= 13/19;

						// (x-h)^2/a^2 - (y-k)^2/b^2 = 1
						cnc.Eq = function(x, a, b) { return b * Math.sqrt( x*x / (a*a) - 1); }
//                                cnc.dotSize = 2;

						if (Math.abs(gridXLgcLengthToPx(a)) < Math.abs(gridXLgcLengthToPx(b)))
						{
							cnc.xSlowThrink = a * 2;
							cnc.xfastThrink1 = a * 1.5;
							cnc.xfastThrink2 = a * 0.9;
							cnc.thrinkSlowFactor = 39/40; //
							cnc.thrinkFastFactor1 = 29/30;
							cnc.thrinkFastFactor2 = 1/20; //1/29; //17/49;
						}

						arg.unshift(cnc);	// stuff extra param at beginning of arg
						drawConics.apply(this, arg); }
					},

			hyperbolaypos: { nParam:4,   fn: function (arg, color)                            // 'hyperbolaypos',
					{   var cnc = initConicFn(arg, color);
						// (y-k)^2/b^2 - (x-h)^2/a^2 = 1
						cnc.xSlowThrink = 0; // no shringk of dX
						cnc.Eq = function(x, a, b) { return b * Math.sqrt( x*x / (a*a) + 1); }
						arg.unshift(cnc);	// stuff extra param at beginning of arg
						drawConics.apply(this, arg); }
					},

			point: { nParam:2,   fn: function(arg, color, option)
						{   arg.unshift(color, option); // stuff extra param at beginning,
													// since label in the arg is an optional param
							drawDotEq.apply(this, arg); } }
		};

		for (var i=0; i < drawAry.length; i++)
		{
			strEq = drawAry[i];
			colorEq = drawAry[i].color || 'black';
			option = drawAry[i].option;

			// parse the parameters:
			strEq = strEq.replace(/\s*/g, "").toLowerCase();
			eqType = strEq.slice(0, strEq.indexOf('='));
			args = strEq.slice(strEq.indexOf('=')+1).split(','); //.concat(colorEq);

			// build parameters and then draw the equation:
			if ( typeof eq[eqType] !== 'undefined' )
			{
				// parse the parameters for current equation:
				for (var j=0; j < eq[eqType].nParam; j++) // string to number:
					if ( isNaN( args[j] = parseFloat(args[j]) ) )
						args[j] = 0;
						//console.log(eqType + " equation parameter has to be a number!");

				if (args.length >= eq[eqType].nParam)
				   eq[eqType].fn(args, colorEq, option);
				else
					continue;
					//console.log(eqType + " equation does not have right number of parameters!");
			}
			else
				console.log('Attempting to graph unknown type: ' + eqType);
		}
	}

	/************************************************************************************
	  Draw a straight line.
	  Input:
		x1, y1  - start point in pixel unit
		x2, y2  - end point in pixel unit
		width   - line width in pixel unit
		color   - line color
	************************************************************************************/
	function drawLine(x1, y1, x2, y2, width, color)
	{
		x1 = Math.round(x1);
		y1 = Math.round(y1);
		x2 = Math.round(x2);
		y2 = Math.round(y2);

		ctx.strokeStyle = color;
		ctx.lineWidth = width;
		ctx.beginPath();

		ctx.moveTo(x1, y1);
		ctx.lineTo(x2, y2);

		ctx.stroke();
		ctx.closePath();
	}

	/************************************************************************************
	************************************************************************************/
	function drawDotEq(color, option, x, y, label)
	{
		//pt_px = gridLgcPtToCanvasPt(x, y);
		gridDrawMouseLgcPt({x:x, y:y}, '', option, label);
	}

	/************************************************************************************
	  Take the input degree and return the translated radians.
	************************************************************************************/
	function degToRadian(deg)
	{
		return deg * Math.PI / 180;
	}

	/************************************************************************************
	  x, y             - position of the local object coordinates in pixel unit to
						 translate system origin to before rotation.
	  directionDegree  - rotation in degrees
	************************************************************************************/
	function transform(x, y, rotateDeg)
	{
		var directionInRad = degToRadian(rotateDeg);

		// set transform matrix to identity:
		ctx.setTransform(1, 0, 0, 1, 0, 0);

		// translate rotation center to the tip position:
		ctx.translate(x, y);
		ctx.rotate(directionInRad);
	}

	/************************************************************************************
	  x, y             - position of the arrow tip in pixel unit
	  directionDegree  - direction in degrees where the arrow points to
						 zero degree - arrow points to the right
	  length           - length of the arrow along the opposite direction of arrow tip
	************************************************************************************/
	function drawArrow(x, y, directionDegree, length, color)
	{
		var arrowSlentDegree = 5;
		var width = length * Math.tan(degToRadian(arrowSlentDegree));

		transform(x, y, directionDegree);

		// pretend the rotation degree is zero so we draw an arrow points to the right,
		// the trasform call above will take care the rotation effect.
		// since the screen origin has been translated to the tip of the arraw,
		// we need to use the local coordinate instead of original x,y:
		//
		drawLine(0, 0, -length, +width, 2, color);
		drawLine(0, 0, -length, -width, 2, color);
	}

	function drawDot(x, y, size)
	{
		ctx.fillRect(x-size/2, y-size/2, size, size);
	}

	function drawLineEqn(slope_lgc, intersect_lgc, color)
	{
		var ptScn1, ptScn2,
			x1 = _xMin_lgc,
			x2 = xUpperBound;

		var y1 = (x1 * slope_lgc + intersect_lgc),
			y2 = (x2 * slope_lgc + intersect_lgc);

		ptScn1 = gridLgcPtToCanvasPt(x1, y1);
		ptScn2 = gridLgcPtToCanvasPt(x2, y2);

		// set transform matrix to identity:
		ctx.setTransform(1, 0, 0, 1, 0, 0);

		drawLine(ptScn1.x, ptScn1.y, ptScn2.x, ptScn2.y, 1, color); //that.graphColor);
	}

	function drawCircle(x_lgc, y_lgc, r_lgc, color)
	{
		// Safety checks -- don't allow negative radius
		if (r_lgc < 0)
			return;

		var ptScn1, ptScn2,
			r_px = gridXLgcLengthToPx(r_lgc);

		ptScn1 = gridLgcPtToCanvasPt(x_lgc, y_lgc);

		ctx.beginPath();
		ctx.strokeStyle = color;
		ctx.lineWidth = 1;

		// set transform matrix to identity:
		ctx.setTransform(1, 0, 0, 1, 0, 0);

		ctx.arc(ptScn1.x, ptScn1.y, r_px, 0, Math.PI * 2, false);

		ctx.stroke();
		ctx.closePath();
	}

	/******************************************************************************
	 Input (all in logic unit and need to be converted to Canvas px unit):
		  a, b - x and y axis of the hyperbola.
		  h, k - x,y distances from the center of hyperbola to the origin
				 of x,y system.

	  Note: The cnc.Eq is to compute y according to x as if h, k are zeros;
	  x type:
				hyperbola equation is:   x^2 / a^2 - y^2 / b^2 = 1;

							therefore:   y = +- b * sqrt(x^2 / a^2 - 1)

	  y type:
				hyperbola equation is:   y^2 / b^2 - x^2 / a^2 = 1;

							therefore:   y = +- b * sqrt(x^2 / a^2 + 1)

	Algorithm:
		All the rendering is from the furthest opening points on the curve to the
	center point where the degenerate points are (eccept for eliipse, which is
	rendered from the center point to the furthest points on the x axist where the
	degenarate points are). The increment rate is divided into three phases -
	the closer to the degenate point, the finer the increment amount becomes.
	*****************************************************************************/
	function initConics(color, h, k, a, b)
	{
		var cnc = {
			dotSize:     2,
			hyperCenter: gridLgcPtToCanvasPt(h, k),
			xVertex:     0,
			xVertexPx:   0,
			bDrawNegativeX: true,
			bDrawPositiveY: true,

			xSlowThrink:  a *1.22,
			xfastThrink1: a * 1.182,
			xfastThrink2: a * 1.01,

			thrinkSlowFactor: 19/20, //
			thrinkFastFactor1: 18/19,
			thrinkFastFactor2: 1/49,

			xStart: xUpperBound + Math.abs(h),

			xCompare: function(x) { return x >= cnc.xVertex; },
			xChangeIncRate: function(x, threshold) { return x < threshold; }
		};

		cnc.dX = a / gridXLgcLengthToPx(a); // normalize the delta x

		// moving with increment of dX is not fine enough near y = 0:
		cnc.minDelta  = cnc.dX / 40;
		cnc.dX = -cnc.dX;

		// set transform matrix to identity:
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.translate(cnc.hyperCenter.x, cnc.hyperCenter.y);

		ctx.fillStyle = color;
		return cnc;
	}

	/******************************************************************************
		Draw a conic type such as hyperbola in the equation (x type)
			(x-h)^2/a^2 - (y-k)^2/b^2 = 1
		or y type :
			(y-k)^2/b^2 - (x-h)^2/a^2 = 1

		Input (all in logic unit and need to be converted to Canvas px unit):
		  a, b - x and y axis of the hyperbola.
		  h, k - x,y distances from the center of hyperbola to the origin
				 of x,y system.

		algorithm:
		1. translate the system origin to h,k;
		2. compute y according to x as if h, k are zeros;

		therefore:   y = +- b * sqrt(x^2/a^2 - 1)
	 *****************************************************************************/
	function drawConics(cnc, color, h, k, a, b)
	{
		var x, y;
		var pt = {x:0, y:0};

		cnc.xSlowThrink *= _xStep_lgc;
		cnc.xfastThrink1 *= _xStep_lgc;
		cnc.xfastThrink2 *= _xStep_lgc;
		cnc.thrinkFactor = cnc.thrinkSlowFactor;

		// draw points at the degenrate spot:
		drawDot(cnc.xVertexPx, 0, cnc.dotSize);
		if (cnc.bDrawNegativeX)
			drawDot(-cnc.xVertexPx, 0, cnc.dotSize);

		// use logic x to calculate logic y,
		// then convert to canvas coords before drawing it:
		//
		for (x = cnc.xStart; //_xMax_lgc + Math.abs(h);
								cnc.xCompare(x); //x >= cnc.xVertex;
																x += cnc.dX) //xIncrement)
		{
			y = cnc.Eq(x, a, b); //b * Math.sqrt( x*x / (a*a) - 1);

			pt.x = gridXLgcLengthToPx(x);
			pt.y = gridYLgcLengthToPx(y);

			drawDot( pt.x,  -pt.y, cnc.dotSize);

			if (cnc.bDrawNegativeX)    //conicType != 'parabolay2')
				drawDot(-pt.x,  -pt.y, cnc.dotSize);

			if (cnc.bDrawPositiveY) //conicType != 'parabolax2')
			{
				drawDot( pt.x, pt.y, cnc.dotSize);

				if (cnc.bDrawNegativeX) //conicType != 'parabolay2')
					drawDot(-pt.x, pt.y, cnc.dotSize);
			}

			if (cnc.xChangeIncRate(x, cnc.xSlowThrink)) // dynamically change delta size toward y = 0:
			{
				if (cnc.xChangeIncRate(x, cnc.xfastThrink1))
				{
					if (cnc.xChangeIncRate(x, cnc.xfastThrink2))
						cnc.thrinkFactor = cnc.thrinkFastFactor2;
					else
						cnc.thrinkFactor = cnc.thrinkFastFactor1;
				}

				if (Math.abs(cnc.dX) > cnc.minDelta)
					cnc.dX *= cnc.thrinkFactor;
			}
		}

		// be nice to next function and reset transform:
		ctx.setTransform(1, 0, 0, 1, 0, 0);
	}

	//=======================================================
	// Math.sign shim. Math.sign is an experimental function
	// not available in all browsers
	//=======================================================
	function mathSign(value)
	{
		var number = +value;
		if (number === 0) return number;
		if (Number.isNaN(number)) return number;
		return number < 0 ? -1 : 1;
	}


//===========================================================================================
// GRID DRAWING
//===========================================================================================

	//=======================================================
	//=======================================================
	function gridCreate(obj)
	{
		opts = obj;

		gridInit();
		gridDraw();
	}

	//=======================================================
	//=======================================================
	function initAxis(max_lgc, min_lgc, step_lgc, length_px, Offset_px)
	{
		var range_lgc = Math.abs(max_lgc - min_lgc);
		var idealNumGrids = 20, idealStep_lgc,
			maxNumGrids = idealNumGrids, minNumGrids = 4;
		var maxNum = Math.max(Math.abs(max_lgc), Math.abs(min_lgc));
		var metrics = ctx.measureText("-");
		_negSignW = metrics.width; // pixels

		var grid =
		{
			max_lgc: max_lgc,
			min_lgc: min_lgc,
			step_lgc: step_lgc,
			nScale: 1,
			decimalPoints: 1,  // change this to alter the decimal precision of grid

			toStr: function(x)
			{
				if (typeof(x) == "string")
					x = parseFloat(x);
				var f = x.toFixed(this.decimalPoints);
				var n = x.toFixed(0);
				if (f - n)
					return f;
				return n;
			}
		}
		grid.maxDigits = countDigits(maxNum);

		var totalNumGrids = Math.round(range_lgc / step_lgc);

		if (totalNumGrids > maxNumGrids || totalNumGrids < minNumGrids)
		{
			if (range_lgc > idealNumGrids)
				idealStep_lgc = Math.floor(range_lgc / idealNumGrids); // ideal granuality = 20 grids
			else
			{
				idealNumGrids = 8;
				idealStep_lgc = Math.floor(range_lgc / idealNumGrids * 10) / 10;
			}

			grid.step_lgc = idealStep_lgc;
			totalNumGrids = Math.round(range_lgc / idealStep_lgc);
		}

		grid.maxSingleSideGrids = Math.floor(Math.max(Math.abs(max_lgc), Math.abs(min_lgc)) / grid.step_lgc);
//        grid.maxGrids = Math.floor(Math.abs(max_lgc) / grid.step_lgc);
		grid.minGrids = Math.floor(Math.abs(min_lgc) / grid.step_lgc);

		// float result for accurate gird origin computation:
		grid.step_px = ( length_px - Offset_px * 2 ) / totalNumGrids;

		// compute the grid origin:
		grid.origin = Math.round(length_px - Offset_px - Math.abs(max_lgc * grid.step_px / grid.step_lgc));

		// get the interger step size:
		grid.step_px = Math.round(grid.step_px);

//        grid.decimalFactor = 2 / grid.step_lgc; // half point precision
//        if (grid.decimalFactor < 1)
//            grid.decimalPoints = 0;

		return grid;
	}

	/************************************************************************************
	  Initialize a

	  Input:
		xRange: [min, max, step size]
		yRange: [min, max, step size]
	************************************************************************************/
	function gridInit()
	{
		// Compute grid steps:
		var xOffset = 6, // pixels, so the edge of the grid can display points
			yOffset = 6;

		// index values for xRange, yRange to replace the magic numbers:
		var minIdx = 0, maxIdx=1, StepSize=2;

		_xGrid = initAxis(opts.xRange[maxIdx], opts.xRange[minIdx], opts.xRange[StepSize],
						  self.settings.width, xOffset);
		// y logic system is positive up, but y canvas system is positive down:
		_yGrid = initAxis(opts.yRange[minIdx], opts.yRange[maxIdx], opts.yRange[StepSize],
						  self.settings.height, yOffset);
	}

	/************************************************************************************
	  Draw a x,y coordinate grid on Canvas

	  Input:
		gridColor: Grid line color
		axisColor: color for the x,y axis
	************************************************************************************/
	function gridDraw()
	{
		var axisWidth = 1,
			ticHalfLength = 2, // pixels
			arrawLength = Math.round( 0.5 * _xGrid.step_px ),
			yTicBotm = _yGrid.origin + ticHalfLength,
			yTicTop = _yGrid.origin - ticHalfLength;


		// Paint background:
		ctx.fillStyle = style.bgColor;
		ctx.fillRect (0, 0, self.settings.width, self.settings.height);

		var color = style.gridColor;
		var axisColor = style.axisColor;

		// draw grid:
		for (var i=1; i <= _xGrid.maxSingleSideGrids; i++)
		{
			for (var j=1; j <= _yGrid.maxSingleSideGrids; j++)
			{
				var y = j * _yGrid.step_px;

				drawLine(0, _yGrid.origin + y, self.settings.width, _yGrid.origin + y, axisWidth, color);

				if (j <= _yGrid.minGrids)
					drawLine(0, _yGrid.origin - y, self.settings.width, _yGrid.origin - y, axisWidth, color);
			}

			var x    = i * _xGrid.step_px;
			var x_px = _xGrid.origin + x;   // positive region of x:

			// draw short grid Tic on axis:
			drawLine(x_px, 0,         x_px, self.settings.height,   axisWidth, color);     // vertical grid lines
			drawLine(x_px, yTicBotm,  x_px, yTicTop,  axisWidth, axisColor); // tic bars

			if (i <= _xGrid.minGrids)
			{
				x_px = _xGrid.origin - x;   // negative region of x:
				drawLine(x_px, 0, x_px, self.settings.height, axisWidth, color);             // vertical grid lines
				drawLine(x_px, yTicBotm, x_px, yTicTop, axisWidth, axisColor); // tic bars
			}
		}

		printLabels(ticHalfLength, yTicBotm, yTicTop);

		// draw x axis:
		drawLine(0, _yGrid.origin, self.settings.width, _yGrid.origin, axisWidth, axisColor);

		// draw y axis:
		drawLine(_xGrid.origin, 0, _xGrid.origin, self.settings.height, axisWidth, axisColor);

		// draw arrows:
		drawArrow(self.settings.width-1, _yGrid.origin, 0, arrawLength * _xGrid.nScale, axisColor);  // on x-axis
		drawArrow(1, _yGrid.origin, 180, arrawLength * _xGrid.nScale, axisColor);  // on x-axis
		drawArrow(_xGrid.origin, 1, -90, arrawLength * _yGrid.nScale, axisColor);       // on y-axis
		drawArrow(_xGrid.origin, self.settings.height-1, 90, arrawLength * _yGrid.nScale, axisColor);       // on y-axis

		// set transform matrix to identity:
		ctx.setTransform(1, 0, 0, 1, 0, 0); // clean up the transform after drawArrow
	}

	//=======================================================
	//=======================================================
	function isPrintableX(x, str)
	{
		var metrics = ctx.measureText(str);
		var halfStrW = metrics.width / 2;
		return ( x + halfStrW < self.settings.width && x - halfStrW > 0 )
	}

	//=======================================================
	//=======================================================
	function isPrintableY(y, str)
	{
		// since measureText doesn't provide height, this is a approximation:
		var metrics = ctx.measureText("M");
		var halfStrH = metrics.width;

		return ( y + halfStrH < self.settings.height && y - halfStrH > 0 )
	}

	/************************************************************************************
	  Print labels on x and y axis of the grid

	  Input:
		ticHalfLength: half length of the tics on the x axis.
		yTicBotm, yTicTop:  top and bottom Y positions of the tics on the x axis.
		gridFont: font for the labels
		gridFontColor: color for the labels
	************************************************************************************/
	function printLabels(ticHalfLength, yTicBotm, yTicTop)
	{
		var xTextHoriz, yTextHoriz, xTextVert, yTextVert,
			xGridNumber, yGridNumber, content,
			yClearance = 4, // pixels
			xDecimalPts = 0, yDecimalPts = 0,
			iSkipPosit = 0, iSkipNegat = 0,
			maxDenorm = 8;

		var skipCnt = opts.labelSkip || 0;
		var skipStep = _yGrid.step_lgc * (skipCnt + 1),
			skipStepDelta = skipStep - skipStep.toFixed();
		if (skipStepDelta)
			yDecimalPts = 1;

		if (_xGrid.step_lgc < 1)
			xDecimalPts = 2;

		ctx.font = style.gridFont;
		ctx.fillStyle = style.gridFontColor; // light gray for grid lines
		ctx.textAlign = "center";

		// Print grid numbers on x axis:
		yTextHoriz = yTicBotm - ticHalfLength*3;
		for (var i=1; i <= _xGrid.maxSingleSideGrids; i++)
		{
			// position of the label:
			var x = i * _xGrid.step_px;
			xTextHoriz = _xGrid.origin + x;

			// numbers on x-axis:
			xGridNumber = (i * _xGrid.step_lgc).toFixed(xDecimalPts);
			if (opts.usePiLabels)
				content = decToFracPiStr(xGridNumber, maxDenorm);
			else
				content = xGridNumber;

			if (i < _xGrid.maxSingleSideGrids || isPrintableX(xTextHoriz, content))
				iSkipPosit = printOneLabel(content, xTextHoriz, yTextHoriz, iSkipPosit, skipCnt);

			xTextHoriz = _xGrid.origin - x - _negSignW;

			if (isPrintableX(xTextHoriz, content))
				iSkipNegat = printOneLabel("-"+content, xTextHoriz, yTextHoriz, iSkipNegat, skipCnt);
		}

		// Print grid numbers on y axis:
		ctx.textAlign = "right";
		iSkipPosit = iSkipNegat = 0;
		xTextVert = _xGrid.origin -3; // 3 pixels to the left of y axis

		for (var j=1; j <= _yGrid.maxSingleSideGrids; j++)
		{
			// numbers on y-axis:
			yGridNumber = (j * _yGrid.step_lgc).toFixed(yDecimalPts);

			// position of the label:
			var y = j * _yGrid.step_px;
			yTextVert = _yGrid.origin - y + yClearance;

			if (isPrintableY(yTextVert, yGridNumber))
				iSkipPosit = printOneLabel(yGridNumber, xTextVert, yTextVert, iSkipPosit, skipCnt);

			// logic y is positive up, while canvas y is positive down:
			yTextVert = _yGrid.origin + y + yClearance;
			if (isPrintableY(yTextVert, yGridNumber))
				iSkipNegat = printOneLabel("-"+yGridNumber, xTextVert, yTextVert, iSkipNegat, skipCnt);
		}
	}

	//=======================================================
	//=======================================================
	function printOneLabel(content, x, y, iSkip, skipCnt)
	{
		if (iSkip == skipCnt)
		{
			ctx.fillText(content, x, y);
			iSkip = 0;
		}
		else
			iSkip++;
		return iSkip;
	}

	/************************************************************************************
	 Convert a decimal number to string of a Pi factored fraction number.
	 Input:
		dec         - the decimal number to be converted,
		maxDenom    - optional
					  the max denormitor of the conversion precision, default is 16

	 Return:
		xFrac.upper - upper part of the factored fraction
		xFrac.lower - lower part of the factored fraction

	 example:       xDec = 1.57;  maxDenorm = 8;
					return: xFrac.upper = 1; xFrac.lower = 2;    (i.e. 1.57 = 1/2 Pi)
	************************************************************************************/
	function decToFracPiStr(dec, maxDenorm)
	{
		var numPi = 3.14;
		var str = Pi;

		xFrac = decToFrac(dec, numPi, maxDenorm);
		if (xFrac.upper < 0)
			str = "-" + Pi;

		if (xFrac.lower != xFrac.upper)
		{
			if (Math.abs(xFrac.upper) > 1)
				str = xFrac.upper + Pi;

			if (xFrac.lower > 1)
				str += '/' + xFrac.lower;
		}
		return str;
	}

	/************************************************************************************
	 Convert a decimal number to a factored fraction number.
	 Input:
		xDec        - the decimal number to be converted,
		comDenorm   - optional
					  the common denormitor used for factoring, most often this = Pi.
					  If just want to convert a decimal number to fraction number,
					  make this equal to 1, which is default.
		maxDenom    - optional
					  the max denormitor of the conversion precision, default is 16

	 Return:
		xFrac.upper - upper part of the factored fraction
		xFrac.lower - lower part of the factored fraction

	 example:       xDec = 1.57; comDenorm = 3.14; maxDenorm = 8;
					return: xFrac.upper = 1; xFrac.lower = 2;    (i.e. 1.57 = 1/2 Pi)
	************************************************************************************/
	function decToFrac(xDec, comDenorm, maxDenorm)
	{
		var xFrac = {}, factor = 1,
			iMaxDenorm = 16, iComDenorm = 1;

		if (comDenorm) iComDenorm = comDenorm;
		if (maxDenorm) iMaxDenorm = maxDenorm;
/*
		for (var i = 1; i < iMaxDenorm; i++)
		{
			for (var j=1; j<=i; j++)
				if ( (i * xDec) % (j * comDenorm) == 0) // found factor
					return factorOut(j, i);
		}
 */
		// the maxDenorm is not enough, so we round it up:
		xFrac.upper = Math.round(iMaxDenorm * xDec / comDenorm );
		xFrac.lower = iMaxDenorm;
		factorOut(xFrac);
		return xFrac;
	}

	function factorOut(frac) //upper, lower)
	{
		if (frac.upper === 1)
			return;

		for (var i=2; i <= frac.lower; i++)
		{
			if (frac.upper % i == 0 && frac.lower % i == 0)
			{
				frac.upper /= i;
				frac.lower /= i;
				factorOut(frac); // start again until no longer can be factored
			}
		}
	}

/*************************** public interface: ******************************************/

	function gridLgcPtToCanvasPt(xLgc, yLgc)
	{
		var ptScrn = {};
		ptScrn.x = xLgc * _xGrid.step_px / _xGrid.step_lgc + _xGrid.origin;
		ptScrn.y = -yLgc * _yGrid.step_px / _yGrid.step_lgc + _yGrid.origin;

		return ptScrn;
	}

	function gridXLgcLengthToPx(r_lgc)
	{
		return r_lgc * _xGrid.step_px / _xGrid.step_lgc;
	}

	function gridYLgcLengthToPx(r_lgc)
	{
		return r_lgc * _yGrid.step_px / _yGrid.step_lgc;
	}

	/**************************************************************************
	 The position of the mouse point is adjusted according to the round up
	 logical point. This is to make it easier for the user to click the
	 previous point displayed on the screen so the position doesn't have to be
	 exact.
	 Input:
		msePt_lgc   - x,y position of the mouse in logic unit
		color       - color of the mouse point, dashline, label
		dispPosition - if x,y position should be displayed
		label       - if a string lable should be printed in stead of x,y position
	**************************************************************************/
	function gridDrawMouseLgcPt(msePt_lgc, color, dispPosition, label)
	{
		var rCircle = 2; //pixels
		var yLableClearance = 16; // pixels

		if (!color)
			color = style.pointColor;

		// set transform matrix to identity:
		ctx.setTransform(1, 0, 0, 1, 0, 0);

		var msePt_px  = gridLgcPtToCanvasPt(msePt_lgc.x, msePt_lgc.y);
		var xLable = msePt_px.x,
			yLable = msePt_px.y - rCircle * 3;

		// draw the dot:
		//ctx.beginPath();
		ctx.fillStyle = color;
		ctx.strokeStyle = color;
		ctx.textAlign = "center";
		ctx.beginPath();

		ctx.arc(msePt_px.x, msePt_px.y, rCircle, 0, Math.PI * 2, false);
		ctx.stroke();
		ctx.closePath();
		ctx.fill();

		// print the logical coordinates:
		var pt = {}
		pt.x = (msePt_lgc.x).toFixed(_xGrid.decimalPoints);
		pt.y = (msePt_lgc.y).toFixed(_yGrid.decimalPoints);

		var xStr = _xGrid.toStr(pt.x);
		if (opts.usePiLabels)
			xStr = decToFracPiStr(pt.x, 8);

		if (label)
			label = label.toUpperCase();
		else
		{
			if (dispPosition)
				label = '(' + xStr + ', ' + _xGrid.toStr(pt.y) + ')';
			else
				return; // work is done if no label
		}

		var metrics = ctx.measureText(label);
		var halfStrW = metrics.width / 2;

		// adjust position if the dot is near a border:
		if (msePt_px.x > self.settings.width - halfStrW)
			ctx.textAlign = "right";
		if (msePt_px.x < halfStrW)
			ctx.textAlign = "left";
		if (msePt_px.y < yLableClearance)
		{
			yLable = msePt_px.y + yLableClearance;
			if (!label) // label doesn't need to consider mouse cursor issue
			{
				if (msePt_px.x > that.w / 2)
				{
					ctx.textAlign = "right";
					xLable -= 6; // avoid the slanting down arrow handle
				}
				else
				{
					ctx.textAlign = "left";
					xLable += 12; // avoid the slanting down arrow handle
				}
			}
		}

		ctx.fillStyle = style.pointTextColor;
		ctx.fillText(label, xLable, yLable);
	}

	//=======================================================
	// Count the digits in a number
	//=======================================================
	function countDigits(num)
	{
		var digits = 0;

		if (num == 0)
			return 1;

		while (num > 0)
		{
			digits++;
			num = Math.floor(num / 10);
		}

		return digits;
	}

}]);
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

'use strict';

//===========================================================================================
// Resets the scroll position of an element on request.
//
// When switching views or applying filters/data changes to ngRepeats, the scroll position
// will stay the same by default. That is almost always undesirable.
//
// This solution comes from:
//   http://stackoverflow.com/questions/24040985/scroll-to-top-of-div-in-angularjs
//
// Modified to use PubSub instead of $scope broadcasts.
//
// USAGE:
//   Template: <div id="myList" scroll-to-top-when="items_changed">
//===========================================================================================
angular.module('ui.scrollToTopWhen', [])

.directive('scrollToTopWhen', ["PubSub", "$timeout", function(PubSub, $timeout) {

	//=======================================================
	//=======================================================
	function link (scope, element, attrs)
	{
		PubSub.subscribe(attrs.scrollToTopWhen, function() {
			$timeout(function() {
				angular.element(element)[0].scrollTop = 0;
			});
		});
	}

	//=======================================================
	// Configuration Block
	//=======================================================
	return {
		restrict: 'A',
		link: link
	}
}]);
'use strict';

//===========================================================================================
// Slide-out menu
//===========================================================================================
angular.module('sliderMenu', [])

.directive('sliderMenu', ["$document", function($document) {

	var self;

	// Any of these can be overridden by the user on creation
	var defaults = {
		blurDelay: 400,		// Time until close when the mouse leaves (in ms)
		autoClose: 1200		// Time until close if the mouse never enters (in ms)
	};

	//--------------------
	var menuTemplatePre =
		'<div id="slidermenu">' +
			'<div>' +
				'<div id="sm_top"></div>' +
				'<div id="sm_top_right"></div>' +
			'</div>' +

			'<div id="sm_main_body">' +
				'<div id="sm_center">';

	var menuTemplatePost =
				'</div>' +
				'<div id="sm_right"></div>' +
			'</div>' +

			'<div>' +
				'<div id="sm_bottom"></div>' +
				'<div id="sm_bottom_right"></div>' +
			'</div>' +
		'</div>';

	//--------------------
	var lineTemplate =
		'<div id="menu_item_{{index}}" class="sliderMenuLine">' +
			'<img src="{{icon}}">' +
			'<span>{{text}}</span>' +
		'</div>';

	//=======================================================
	//
	//=======================================================
	function link(scope, element, attrs)
	{
		self = scope;

		scope.settings = _.extend({}, defaults, scope.options);

		// Init variables
		scope.menuState = 'out';

		var html = menuCreate(scope.model.items);
		element.html(html);
		scope.menuEl = angular.element(element.children()[0]);


		// Attach all of the events (line click, blur)
		scope.$watch('model.opened', menuOpen);
		attachEvents(scope.model);

		setSizes(element);
		positionMenu(scope.menuEl);
	}

	//=======================================================
	//
	//=======================================================
	function menuCreate(items)
	{
		var html = menuTemplatePre;

		_.each(items, function(val, idx) {
			html += resolveTemplate(lineTemplate, {
				icon: val.icon,
				text: val.text,
				index: idx
			});
		});

		html += menuTemplatePost;

		return html;
	}

	//=======================================================
	// Our own low-tech template system
	//=======================================================
	function resolveTemplate(template, vars)
	{
		var findVars = /\{\{(\w+)\}\}/g;

		var resolved = template.replace(findVars, function(all, param) {
			return vars[param];
		});

		return resolved;
	}

	//=======================================================
	// Properly size the edges to match the content
	//=======================================================
	function setSizes(el)
	{
		var doc = $document[0];

		var top = angular.element(doc.getElementById('sm_top'));
		var bottom = angular.element(doc.getElementById('sm_bottom'));
		var right = angular.element(doc.getElementById('sm_right'));

		var center = doc.getElementById('sm_center');
		var wd = center.clientWidth;
		var ht = center.clientHeight;

		top.css('width', wd + 'px');
		bottom.css('width', wd + 'px');
		right.css('height', ht + 'px');
	}

	//=======================================================
	// Place the menu off the left edge of the screen
	//=======================================================
	function positionMenu(el)
	{
		var body = $document[0].getElementById('sm_main_body');
		self.closePos = -body.clientWidth + 'px';

//		el.css('left', self.closePos);
		el.css({
			transform: 'translateX(' + self.closePos + ')',
			'-webkit-transform': 'translateX(' + self.closePos + ')',
			'-moz-transform': 'translateX(' + self.closePos + ')',
			'-ms-transform': 'translateX(' + self.closePos + ')',
		});
	}

	//=======================================================
	// Attach all of the events (line click, blur)
	//=======================================================
	function attachEvents()
	{
		self.menuEl.on('mouseenter', mouseEnter);
		self.menuEl.on('mouseleave', mouseLeave);

		var lines = self.menuEl[0].getElementsByClassName('sliderMenuLine');
		angular.element(lines).on('click', lineClick);
	}

//===========================================================================
// Actions
//===========================================================================

	//=======================================================
	// A request to activate the menu has occurred
	//=======================================================
	function menuOpen(newVal, oldVal, scope)
	{
		if (newVal === oldVal || !newVal)
			return;

//		scope.menuEl.css('left', 0);
		scope.menuEl.css({
			transform: 'translateX(0)',
			'-webkit-transform': 'translateX(0)',
			'-moz-transform': 'translateX(0)',
			'-ms-transform': 'translateX(0)',
		});

		scope.autoCloseTimeout = setTimeout(menuClose, scope.settings.autoClose);	// Close unless the mouse enters in time
	}

	//=======================================================
	//
	//=======================================================
	function menuClose()
	{
//		self.menuEl.css('left', self.closePos);
		self.menuEl.css({
			transform: 'translateX(' + self.closePos + ')',
			'-webkit-transform': 'translateX(' + self.closePos + ')',
			'-moz-transform': 'translateX(' + self.closePos + ')',
			'-ms-transform': 'translateX(' + self.closePos + ')',
		});

		self.$apply(function() {
			self.model.opened = false;
		});

		clearTimeout(self.autoCloseTimeout);
	}

	//=======================================================
	// High-level auto-close system
	//=======================================================
	function setActive()
	{
		clearTimeout(self.autoCloseTimeout);
	}

	//=======================================================
	//
	//=======================================================
	function lineClick(ev)
	{
		var idx = -1;
		var node = ev.currentTarget;
		while (node) {
			idx++;
			node = node.previousSibling;
		}

		var act = self.model.items[idx].act;
		act && act();
	}

//===========================================================================
// Hover system (this should be a separate self!)
//===========================================================================

	//=======================================================
	// Low-level mouseenter handler
	//=======================================================
	function mouseEnter()
	{
		// Don't do this if it's already in
		if (self.menuState === 'in')
			return;

		if (self.menuState === 'leaving')
		{
			clearTimeout(self.timeout);
			self.menuState = 'in';
		}
		else if (self.menuState === 'out')
			doEnter();		// Eliminated the entry delay. Not needed by this self.
	}

	//=======================================================
	// Low-level mouseleave handler
	//=======================================================
	function mouseLeave()
	{
//		self.hoverCount--;

		// If we're already out somehow, don't do anything
		if (self.menuState === 'out')
			return;

		if (self.menuState === 'in')
			leaving();
	}

	//=======================================================
	// Transitioning from in to out
	//=======================================================
	function leaving()
	{
		// A delay is requested.  Start the timeout.
		self.timeout = setTimeout(function() {doLeave()}, self.settings.blurDelay);
		self.menuState = 'leaving';
	}

	//=======================================================
	//
	//=======================================================
	function doEnter()
	{
		self.menuState = 'in';
		setActive();
	}

	//=======================================================
	//
	//=======================================================
	function doLeave()
	{
		// It's possible to be in multiple widgets at once.  It's not a "real" leave until
		// we've exited every widget.
//		if (self.hoverCount <= 0)
		{
			self.menuState = 'out';

			menuClose();
		}
	}

//===========================================================================
// Directive configuration
//===========================================================================
	return {
		restrict: 'E',
		scope: {
			options: '=options',
			model: '=ngModel'
		},

		link: link
	};
}]);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImFjdGlvbi9tb2R1bGUuanMiLCJjb21tL21vZHVsZS5qcyIsInByb2JsZW1UeXBlcy9tb2R1bGUuanMiLCJDaGFuZ2UvY2hhbmdlLmpzIiwiR3JhcGgvZmlsdGVyLWJhci5qcyIsIkdyYXBoL2dyYXBoLmpzIiwiTmF2L25hdi1oZWFkZXIuanMiLCJhY3Rpb24vY2xvdWQtc2F2ZS5qcyIsImNvbW0vY29tbS1zZXJ2aWNlLmpzIiwibW9kZWxzL3Byb2JsZW0tbW9kZWwuanMiLCJtb2RlbHMvc3RhdGUtc2VydmljZS5qcyIsInByb2JsZW1UeXBlcy9mcmVlSW5wdXQuanMiLCJwcm9ibGVtVHlwZXMvZ3JhcGhDb25zdC5qcyIsInByb2JsZW1UeXBlcy9wcm9ibGVtVHlwZS5qcyIsInByb2JsZW1UeXBlcy9xSW1hZ2UuanMiLCJ0b29scy9wdWJzdWItc2VydmljZS5qcyIsInVpRGlyZWN0aXZlcy9rYkdyYXBoLmpzIiwidWlEaXJlY3RpdmVzL21hdGhqYXguanMiLCJ1aURpcmVjdGl2ZXMvc2Nyb2xsVG9Ub3AuanMiLCJ1aURpcmVjdGl2ZXMvc2xpZGVybWVudS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7QUFLQSxRQUFBLE9BQUEsVUFBQTs7Q0FFQTtDQUNBOzs7Q0FHQTtDQUNBO0NBQ0E7Q0FDQTs7O0NBR0E7Q0FDQTtDQUNBO0NBQ0E7Q0FDQTs7O0NBR0E7Q0FDQTs7O0NBR0E7Q0FDQTtDQUNBO0NBQ0E7Ozs7OztDQU1BLCtDQUFBLFNBQUEsZ0JBQUEsbUJBQUE7O0NBRUEsa0JBQUEsVUFBQTs7O0NBR0EsZUFBQSxLQUFBLFdBQUE7RUFDQSxhQUFBO0VBQ0EsWUFBQTtFQUNBLGNBQUE7Ozs7Q0FJQSxlQUFBLEtBQUEsZ0JBQUE7RUFDQSxhQUFBO0VBQ0EsWUFBQTtFQUNBLGNBQUE7Ozs7Q0FJQSxlQUFBLFVBQUEsQ0FBQSxZQUFBOzs7Ozs7Q0FNQSx3QkFBQSxTQUFBLGNBQUE7SUFDQSxhQUFBLFFBQUE7Ozs7O0NBS0EseUJBQUEsU0FBQSxlQUFBO0NBQ0EsY0FBQSxTQUFBLGtCQUFBOzs7Ozs7Ozs7O0NBVUEsSUFBQSxDQUFBLFVBQUEsY0FBQSxhQUFBLFVBQUEsUUFBQSxZQUFBLFdBQUE7SUFDQSxJQUFBLFdBQUEsVUFBQTtJQUNBLFVBQUEsT0FBQSxVQUFBLE1BQUEsUUFBQTtRQUNBLElBQUEsV0FBQSxPQUFBO1lBQ0EsSUFBQSxZQUFBLE9BQUE7WUFDQSxJQUFBLEtBQUEsV0FBQSxJQUFBLDBCQUFBLFlBQUE7Z0JBQ0EsT0FBQSxVQUFBO2dCQUNBOzs7UUFHQSxPQUFBLFNBQUEsTUFBQSxXQUFBLENBQUE7OztBQ3pGQTs7Ozs7O0FBTUEsUUFBQSxPQUFBLGtCQUFBLENBQUE7O0FDTkE7Ozs7O0FBS0EsUUFBQSxPQUFBLGdCQUFBOztBQ0xBOzs7OztBQUtBLFFBQUEsT0FBQSxlQUFBOztBQ0xBOzs7O0FBSUEsUUFBQSxPQUFBOztDQUVBLFdBQUEsd0RBQUEsU0FBQSxVQUFBLE9BQUEsUUFBQSxRQUFBOztDQUVBLElBQUEsT0FBQTs7Q0FFQSxLQUFBLFdBQUEsU0FBQTs7Q0FFQTtDQUNBOzs7OztDQUtBLEtBQUEsV0FBQSxTQUFBO0NBQ0E7RUFDQSxRQUFBLE1BQUEsSUFBQSxpQkFBQSxDQUFBOzs7OztDQUtBLEtBQUEsWUFBQSxTQUFBLE1BQUE7Q0FDQTtFQUNBLElBQUEsQ0FBQTtHQUNBOztFQUVBLElBQUEsVUFBQSxLQUFBOztFQUVBLE9BQUEsU0FBQSxVQUFBLEtBQUEsSUFBQSxLQUFBO0VBQ0EsSUFBQSxDQUFBO0dBQ0E7OztFQUdBLEtBQUEsTUFBQSxLQUFBO0VBQ0EsS0FBQSxXQUFBOzs7RUFHQSxJQUFBLE1BQUEsS0FBQTtFQUNBLEtBQUEsU0FBQSxPQUFBOzs7OztDQUtBLEtBQUEsVUFBQSxTQUFBO0NBQ0E7OztFQUdBLElBQUEsTUFBQTtHQUNBLFNBQUE7R0FDQSxTQUFBO0dBQ0EsT0FBQTtHQUNBLFdBQUE7O0dBRUEsV0FBQTs7O0VBR0EsT0FBQSxJQUFBLEtBQUEsV0FBQSxJQUFBOzs7Ozs7Q0FNQSxTQUFBO0NBQ0E7RUFDQSxLQUFBLElBQUEsSUFBQSxHQUFBLE1BQUEsS0FBQSxTQUFBLFFBQUEsSUFBQSxLQUFBO0VBQ0E7R0FDQSxLQUFBLFNBQUEsR0FBQSxNQUFBLEtBQUEsU0FBQSxHQUFBO0dBQ0EsS0FBQSxTQUFBLEdBQUEsV0FBQSxLQUFBLFNBQUEsR0FBQTs7Ozs7OztDQU9BLFNBQUE7Q0FDQTtFQUNBLEtBQUEsT0FBQSxTQUFBOztFQUVBLElBQUEsS0FBQSxTQUFBO0VBQ0E7R0FDQSxLQUFBLFFBQUEsS0FBQSxTQUFBLEdBQUEsTUFBQSxRQUFBLE1BQUEsS0FBQSxTQUFBLEdBQUEsTUFBQSxPQUFBLE9BQUEsU0FBQTs7O0VBR0E7R0FDQSxLQUFBLFFBQUEsU0FBQSxVQUFBLGdCQUFBLEtBQUEsU0FBQSxHQUFBOzs7Ozs7QUN4RkE7Ozs7Ozs7QUFPQSxRQUFBLE9BQUEsZ0JBQUE7O0NBRUEsU0FBQSxlQUFBO0NBQ0EsTUFBQTs7O0NBR0EsVUFBQSw2QkFBQSxTQUFBLGFBQUE7O0NBRUEsT0FBQTtFQUNBLFVBQUE7RUFDQSxPQUFBO0dBQ0EsT0FBQTtHQUNBLE1BQUE7R0FDQSxRQUFBOztHQUVBLFFBQUE7R0FDQSxPQUFBO0dBQ0EsU0FBQTs7R0FFQSxTQUFBOzs7R0FHQSxZQUFBOztFQUVBLFlBQUE7RUFDQSxRQUFBO0VBQ0EsU0FBQTtFQUNBLGFBQUEsWUFBQSxPQUFBOzs7Ozs7Ozs7Ozs7Ozs7Q0FlQSxXQUFBLHNDQUFBLFNBQUEsUUFBQSxRQUFBOztDQUVBLElBQUEsT0FBQTs7OztDQUlBLEtBQUEsYUFBQSxPQUFBOzs7O0NBSUEsS0FBQSxhQUFBO0NBQ0E7RUFDQSxPQUFBLFFBQUEsV0FBQSxLQUFBOzs7OztDQUtBLEtBQUEsYUFBQTtDQUNBO0VBQ0EsT0FBQSxRQUFBLFdBQUEsS0FBQTs7OztBQ3BFQTs7OztBQUlBLFFBQUEsT0FBQTs7Q0FFQSxXQUFBLCtEQUFBLFNBQUEsV0FBQSxjQUFBLFFBQUEsUUFBQTs7Q0FFQSxJQUFBLE9BQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Q0FtQkEsS0FBQSxVQUFBOzs7Ozs7OztFQVFBLENBQUEsSUFBQSxHQUFBLE9BQUEsZUFBQSxTQUFBOzs7Ozs7Ozs7R0FTQSxDQUFBLElBQUEsU0FBQSxNQUFBLFlBQUEsVUFBQSx1QkFBQSxRQUFBLENBQUEsU0FBQSxPQUFBLFFBQUEsTUFBQSxTQUFBLE9BQUEsY0FBQTs7R0FFQSxDQUFBLElBQUEsU0FBQSxNQUFBLG1CQUFBLFVBQUEsdUJBQUEsUUFBQSxDQUFBLFNBQUEsTUFBQSxRQUFBLE9BQUEsY0FBQTtHQUNBLENBQUEsSUFBQSxTQUFBLE1BQUEsZ0JBQUEsVUFBQSxvQkFBQSxRQUFBLENBQUEsU0FBQSxPQUFBLGNBQUE7O0dBRUEsQ0FBQSxJQUFBLFVBQUEsTUFBQSxnQkFBQSxVQUFBLHVCQUFBLFFBQUEsQ0FBQSxZQUFBLE9BQUEsY0FBQTs7RUFFQSxDQUFBLElBQUEsR0FBQSxPQUFBLGFBQUEsU0FBQTtHQUNBLENBQUEsSUFBQSxTQUFBLE1BQUEsWUFBQSxVQUFBLHlCQUFBLFFBQUEsQ0FBQSxZQUFBLE1BQUEsU0FBQSxPQUFBLGNBQUE7O0dBRUEsQ0FBQSxJQUFBLFVBQUEsTUFBQSxpQkFBQSxVQUFBLHdCQUFBLFFBQUEsQ0FBQSxZQUFBLE1BQUEsU0FBQSxPQUFBLGNBQUE7R0FDQSxDQUFBLElBQUEsVUFBQSxNQUFBLGdCQUFBLFVBQUEsc0JBQUEsUUFBQSxDQUFBLFNBQUEsT0FBQSxjQUFBOztHQUVBLENBQUEsSUFBQSxVQUFBLE1BQUEsZ0JBQUEsVUFBQSx3QkFBQSxRQUFBLENBQUEsWUFBQSxPQUFBLGNBQUE7Ozs7Ozs7Ozs7Ozs7O0VBY0EsQ0FBQSxJQUFBLEdBQUEsT0FBQSxtQkFBQSxTQUFBO0dBQ0EsQ0FBQSxJQUFBLFFBQUEsTUFBQSxZQUFBLFdBQUEsTUFBQSxlQUFBLE1BQUEsVUFBQSx1QkFBQSxhQUFBOzs7Ozs7Q0FNQSxLQUFBLFVBQUE7RUFDQSxDQUFBLE1BQUEsZUFBQSxPQUFBLElBQUEsU0FBQTtFQUNBLENBQUEsTUFBQSxnQkFBQSxPQUFBLEtBQUEsU0FBQTtFQUNBLENBQUEsTUFBQSxlQUFBLE9BQUEsSUFBQSxTQUFBO0VBQ0EsQ0FBQSxNQUFBLG1CQUFBLE9BQUEsSUFBQSxTQUFBO0VBQ0EsQ0FBQSxNQUFBLG1CQUFBLE9BQUEsSUFBQSxTQUFBOzs7Q0FHQSxLQUFBLGtCQUFBO0VBQ0EsQ0FBQSxNQUFBLGdCQUFBLE9BQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLE1BQUEsSUFBQSxNQUFBO0VBQ0EsQ0FBQSxNQUFBLGVBQUEsT0FBQSxJQUFBLFNBQUEsR0FBQSxNQUFBLDRCQUFBLElBQUEsSUFBQSxNQUFBLElBQUEsTUFBQTtFQUNBLENBQUEsTUFBQSxtQkFBQSxPQUFBLElBQUEsU0FBQSxJQUFBLE1BQUEsV0FBQSxJQUFBLElBQUEsTUFBQSxJQUFBLE1BQUE7OztDQUdBLEtBQUEsbUJBQUE7RUFDQSxDQUFBLE1BQUEsV0FBQSxPQUFBO0VBQ0EsQ0FBQSxNQUFBLFdBQUEsT0FBQTs7O0NBR0EsS0FBQSxpQkFBQTtFQUNBLENBQUEsTUFBQSxxREFBQSxPQUFBO0VBQ0EsQ0FBQSxNQUFBLHdFQUFBLE9BQUE7OztDQUdBLEtBQUEsY0FBQTtFQUNBLENBQUEsTUFBQSxZQUFBLE1BQUEscURBQUEsT0FBQSxZQUFBLEdBQUEsS0FBQSxTQUFBLElBQUEsS0FBQSxVQUFBLFNBQUEsSUFBQSxRQUFBLEdBQUEsS0FBQSxPQUFBLElBQUEsS0FBQSxDQUFBLEdBQUEsR0FBQSxJQUFBLE1BQUEsQ0FBQSxPQUFBLElBQUEsT0FBQSxJQUFBLE9BQUE7RUFDQSxDQUFBLE1BQUEsWUFBQSxNQUFBLHdDQUFBLE9BQUEsWUFBQSxHQUFBLEtBQUEsU0FBQSxJQUFBLEtBQUEsVUFBQSxTQUFBLE1BQUEsU0FBQSxJQUFBLFFBQUEsR0FBQSxLQUFBLE9BQUEsSUFBQSxLQUFBLENBQUEsR0FBQSxHQUFBLElBQUEsTUFBQSxDQUFBLE9BQUEsSUFBQSxPQUFBLElBQUEsT0FBQTtFQUNBLENBQUEsTUFBQSxRQUFBLE1BQUEscUNBQUEsT0FBQSxZQUFBLEdBQUEsS0FBQSxTQUFBLElBQUEsS0FBQSxVQUFBLFNBQUEsSUFBQSxRQUFBLEdBQUEsS0FBQSxPQUFBLElBQUEsSUFBQSxDQUFBLElBQUEsR0FBQSxJQUFBLE1BQUEsQ0FBQSxPQUFBLEtBQUEsT0FBQSxJQUFBLE9BQUE7RUFDQSxDQUFBLE1BQUEsWUFBQSxNQUFBLHFEQUFBLE9BQUEsWUFBQSxHQUFBLEtBQUEsU0FBQSxJQUFBLEtBQUEsVUFBQSxTQUFBLE1BQUEsU0FBQSxJQUFBLFFBQUEsR0FBQSxLQUFBLE9BQUEsSUFBQSxLQUFBLENBQUEsR0FBQSxHQUFBLElBQUEsTUFBQSxDQUFBLE9BQUEsSUFBQSxPQUFBLElBQUEsT0FBQTtFQUNBLENBQUEsTUFBQSxZQUFBLE1BQUEsNEJBQUEsT0FBQSxZQUFBLEVBQUEsSUFBQSxTQUFBLElBQUEsS0FBQSxXQUFBLFNBQUEsR0FBQSxRQUFBLEdBQUEsS0FBQSxPQUFBLElBQUEsS0FBQSxDQUFBLEdBQUEsR0FBQSxJQUFBLE1BQUEsQ0FBQSxPQUFBLElBQUEsT0FBQSxJQUFBLE9BQUE7RUFDQSxDQUFBLE1BQUEsUUFBQSxNQUFBLGlCQUFBLE9BQUEsWUFBQSxHQUFBLEtBQUEsU0FBQSxLQUFBLEtBQUEsV0FBQSxTQUFBLElBQUEsUUFBQSxHQUFBLEtBQUEsT0FBQSxJQUFBLEtBQUEsQ0FBQSxHQUFBLEdBQUEsSUFBQSxNQUFBLENBQUEsT0FBQSxJQUFBLE9BQUEsSUFBQSxPQUFBO0VBQ0EsQ0FBQSxNQUFBLFlBQUEsTUFBQSwwQkFBQSxPQUFBLFlBQUEsR0FBQSxLQUFBLFNBQUEsSUFBQSxLQUFBLFdBQUEsU0FBQSxJQUFBLFFBQUEsR0FBQSxLQUFBLE9BQUEsSUFBQSxLQUFBLENBQUEsR0FBQSxHQUFBLElBQUEsTUFBQSxDQUFBLE9BQUEsSUFBQSxPQUFBLElBQUEsT0FBQTtFQUNBLENBQUEsTUFBQSxZQUFBLE1BQUEsd0VBQUEsT0FBQSxZQUFBLEdBQUEsS0FBQSxTQUFBLElBQUEsS0FBQSxXQUFBLFNBQUEsSUFBQSxRQUFBLElBQUEsS0FBQSxPQUFBLElBQUEsS0FBQSxDQUFBLElBQUEsR0FBQSxJQUFBLE1BQUEsQ0FBQSxPQUFBLEtBQUEsT0FBQSxJQUFBLE9BQUE7OztDQUdBLEtBQUEsV0FBQTtFQUNBLENBQUEsTUFBQSx5QkFBQSxTQUFBLE9BQUEsT0FBQSxJQUFBLFFBQUEsR0FBQSxLQUFBLENBQUEsSUFBQSxJQUFBLEtBQUEsT0FBQSxDQUFBLGtCQUFBLGlCQUFBLGdCQUFBLG9CQUFBLG9CQUFBLGVBQUEsZUFBQSxxQkFBQSxpQkFBQSxxQkFBQSxlQUFBLGtCQUFBLGtCQUFBLG9CQUFBLGNBQUEsaUJBQUE7RUFDQSxNQUFBLENBQUEsZ0JBQUEsd0JBQUEsZ0JBQUEsaUJBQUEscUJBQUEsbUJBQUEsbUJBQUEsaUJBQUEsY0FBQSxtQkFBQSxZQUFBLHFCQUFBLFlBQUEsa0JBQUEsa0JBQUE7RUFDQSxNQUFBLENBQUEsa0JBQUEsb0JBQUEsc0JBQUEsY0FBQSxnQkFBQSxnQkFBQSxlQUFBLGlCQUFBLGdCQUFBLHNCQUFBLGtCQUFBLGlCQUFBLGNBQUEsbUJBQUEsZ0JBQUEsaUJBQUE7O0VBRUEsQ0FBQSxNQUFBLDBCQUFBLFNBQUEsT0FBQSxPQUFBLElBQUEsUUFBQSxHQUFBLEtBQUEsQ0FBQSxJQUFBLElBQUEsS0FBQSxPQUFBLENBQUEsa0JBQUEsaUJBQUEsZ0JBQUEsb0JBQUEsb0JBQUEsZUFBQSxlQUFBLHFCQUFBLGlCQUFBO0VBQ0EsTUFBQSxDQUFBLGdCQUFBLHdCQUFBLGdCQUFBLGlCQUFBLHFCQUFBLG1CQUFBLG1CQUFBLGlCQUFBLGNBQUEsbUJBQUEsWUFBQSxxQkFBQSxZQUFBLGtCQUFBLGtCQUFBLGVBQUEsZUFBQSxrQkFBQSxrQkFBQTtFQUNBLE1BQUEsQ0FBQSxrQkFBQSxvQkFBQSxzQkFBQSxjQUFBLGdCQUFBLGdCQUFBLGVBQUEsaUJBQUEsZ0JBQUEsc0JBQUEsa0JBQUEsaUJBQUEsY0FBQSxtQkFBQSxnQkFBQSxpQkFBQSxxQkFBQSxjQUFBLGlCQUFBOztFQUVBLENBQUEsTUFBQSxtQ0FBQSxTQUFBLE9BQUEsT0FBQSxJQUFBLFFBQUEsR0FBQSxLQUFBLENBQUEsSUFBQSxJQUFBLEtBQUEsT0FBQSxDQUFBLGtCQUFBLGlCQUFBLGdCQUFBLG9CQUFBLG9CQUFBLGVBQUEsZUFBQSxxQkFBQSxpQkFBQSxxQkFBQSxlQUFBLGtCQUFBLGtCQUFBLG9CQUFBLGNBQUEsaUJBQUE7R0FDQSxNQUFBLENBQUEsZ0JBQUEsd0JBQUEsZ0JBQUEsaUJBQUEscUJBQUEsbUJBQUEsbUJBQUEsaUJBQUEsY0FBQSxtQkFBQSxZQUFBLHFCQUFBLFlBQUEsa0JBQUEsa0JBQUE7R0FDQSxNQUFBLENBQUEsa0JBQUEsb0JBQUEsc0JBQUEsY0FBQSxnQkFBQSxnQkFBQSxlQUFBLGlCQUFBLGdCQUFBLHNCQUFBLGtCQUFBLGlCQUFBLGNBQUEsbUJBQUEsZ0JBQUEsaUJBQUE7O0VBRUEsQ0FBQSxNQUFBLHNDQUFBLFNBQUEsT0FBQSxPQUFBLElBQUEsUUFBQSxHQUFBLEtBQUEsQ0FBQSxJQUFBLEdBQUEsSUFBQSxPQUFBLENBQUEsa0JBQUEsaUJBQUEsZ0JBQUEsb0JBQUEsb0JBQUEsZUFBQSxlQUFBLHFCQUFBLGlCQUFBLHFCQUFBLGVBQUEsa0JBQUEsa0JBQUEsb0JBQUEsY0FBQSxpQkFBQSxnQkFBQSxtQkFBQSxtQkFBQSxpQkFBQSxjQUFBLG1CQUFBLFlBQUEscUJBQUEsWUFBQSxrQkFBQSxrQkFBQSxlQUFBLGdCQUFBLGVBQUEsaUJBQUEsZ0JBQUEsc0JBQUEsa0JBQUEsaUJBQUEsY0FBQSxtQkFBQSxnQkFBQSxpQkFBQTtHQUNBLE1BQUEsQ0FBQSxnQkFBQSx3QkFBQSxnQkFBQSxpQkFBQTtHQUNBLE1BQUEsQ0FBQSxrQkFBQSxvQkFBQSxzQkFBQSxjQUFBOztFQUVBLENBQUEsTUFBQSw0REFBQSxTQUFBLE9BQUEsT0FBQSxJQUFBLFFBQUEsR0FBQSxLQUFBLENBQUEsR0FBQSxJQUFBLEtBQUEsT0FBQSxDQUFBLGtCQUFBLGlCQUFBLGdCQUFBLG9CQUFBO0dBQ0EsTUFBQSxDQUFBLGdCQUFBLHdCQUFBLGdCQUFBLGlCQUFBLHFCQUFBLG1CQUFBLG1CQUFBLGlCQUFBLGNBQUEsbUJBQUEsWUFBQSxxQkFBQSxZQUFBLGtCQUFBLGtCQUFBLGVBQUEsZUFBQSxlQUFBLHFCQUFBLGlCQUFBLHFCQUFBO0dBQ0EsTUFBQSxDQUFBLGtCQUFBLG9CQUFBLHNCQUFBLGNBQUEsZ0JBQUEsZ0JBQUEsZUFBQSxpQkFBQSxnQkFBQSxzQkFBQSxrQkFBQSxpQkFBQSxjQUFBLG1CQUFBLGdCQUFBLGlCQUFBLHFCQUFBLGtCQUFBLGtCQUFBLG9CQUFBLGNBQUEsaUJBQUE7Ozs7Q0FJQSxLQUFBLGFBQUEsRUFBQSxJQUFBLEtBQUEsYUFBQSxTQUFBLE9BQUEsQ0FBQSxPQUFBLFVBQUEsTUFBQTtDQUNBLEtBQUEsb0JBQUEsRUFBQSxVQUFBLEtBQUE7Q0FDQSxLQUFBLFdBQUEsUUFBQSxnQkFBQSxlQUFBLGFBQUE7Q0FDQSxLQUFBLFlBQUEsS0FBQSxrQkFBQTs7Q0FFQSxLQUFBLFlBQUEsQ0FBQSxDQUFBLE9BQUEsUUFBQSxPQUFBLHFEQUFBLFdBQUEsQ0FBQSxDQUFBLEtBQUEsT0FBQSxPQUFBLFVBQUEsT0FBQSwyREFBQSxDQUFBLEtBQUEsT0FBQSxPQUFBLFVBQUEsT0FBQSx3Q0FBQSxDQUFBLEtBQUEsT0FBQSxPQUFBLFVBQUEsT0FBQSxpR0FBQSxDQUFBLE9BQUEsUUFBQSxPQUFBLHFCQUFBLFdBQUEsQ0FBQSxDQUFBLEtBQUEsT0FBQSxPQUFBLFVBQUEsT0FBQSx1RUFBQSxDQUFBLEtBQUEsT0FBQSxPQUFBLFVBQUEsT0FBQSxnRkFBQSxDQUFBLEtBQUEsT0FBQSxPQUFBLFVBQUEsT0FBQSw0RUFBQSxDQUFBLEtBQUEsT0FBQSxPQUFBLFVBQUEsT0FBQSx1RUFBQSxDQUFBLE9BQUEsUUFBQSxPQUFBLDBDQUFBLFdBQUEsQ0FBQSxDQUFBLEtBQUEsT0FBQSxPQUFBLFVBQUEsT0FBQSx3RUFBQSxDQUFBLEtBQUEsT0FBQSxPQUFBLFdBQUEsT0FBQSx5RkFBQSxDQUFBLEtBQUEsT0FBQSxPQUFBLFdBQUEsT0FBQSxnT0FBQSxDQUFBLEtBQUEsT0FBQSxPQUFBLFdBQUEsT0FBQSxnRUFBQSxDQUFBLEtBQUEsT0FBQSxPQUFBLFVBQUEsT0FBQSx5REFBQSxDQUFBLEtBQUEsT0FBQSxPQUFBLFdBQUEsT0FBQSwwR0FBQSxDQUFBLEtBQUEsT0FBQSxPQUFBLFdBQUEsT0FBQSw4Q0FBQSxDQUFBLEtBQUEsT0FBQSxPQUFBLFVBQUEsT0FBQSx3SEFBQSxDQUFBLEtBQUEsT0FBQSxPQUFBLFVBQUEsT0FBQSxvRUFBQSxDQUFBLEtBQUEsT0FBQSxPQUFBLFVBQUEsT0FBQSwyRkFBQSxDQUFBLE9BQUEsUUFBQSxPQUFBLGtDQUFBLFdBQUEsQ0FBQSxDQUFBLEtBQUEsT0FBQSxPQUFBLFdBQUEsT0FBQSxnRUFBQSxDQUFBLEtBQUEsT0FBQSxPQUFBLFdBQUEsT0FBQSxxRUFBQSxDQUFBLEtBQUEsT0FBQSxPQUFBLFVBQUEsT0FBQSx5Q0FBQSxDQUFBLEtBQUEsT0FBQSxPQUFBLFdBQUEsT0FBQSx3REFBQSxDQUFBLEtBQUEsT0FBQSxPQUFBLFdBQUEsT0FBQSxrRkFBQSxDQUFBLEtBQUEsT0FBQSxPQUFBLFdBQUEsT0FBQSx3Q0FBQSxDQUFBLE9BQUEsT0FBQSxPQUFBLHFCQUFBLFdBQUEsQ0FBQSxDQUFBLEtBQUEsT0FBQSxPQUFBLFVBQUEsT0FBQSxpSEFBQSxDQUFBLEtBQUEsT0FBQSxPQUFBLFVBQUEsT0FBQSxrRkFBQSxDQUFBLEtBQUEsT0FBQSxPQUFBLFNBQUEsT0FBQSxvR0FBQSxDQUFBLEtBQUEsT0FBQSxPQUFBLFNBQUEsT0FBQSw2RUFBQSxDQUFBLEtBQUEsT0FBQSxPQUFBLFVBQUEsT0FBQSw2REFBQSxDQUFBLEtBQUEsT0FBQSxPQUFBLFVBQUEsT0FBQSxpRUFBQSxDQUFBLE9BQUEsT0FBQSxPQUFBLHlCQUFBLFdBQUEsQ0FBQSxDQUFBLEtBQUEsT0FBQSxPQUFBLFNBQUEsT0FBQSx5SUFBQSxDQUFBLEtBQUEsT0FBQSxPQUFBLFNBQUEsT0FBQSwyRUFBQSxDQUFBLEtBQUEsT0FBQSxPQUFBLFNBQUEsT0FBQSxvSEFBQSxDQUFBLEtBQUEsT0FBQSxPQUFBLFNBQUEsT0FBQSx3SUFBQSxDQUFBLEtBQUEsT0FBQSxPQUFBLFNBQUEsT0FBQSxrREFBQSxDQUFBLEtBQUEsT0FBQSxPQUFBLFNBQUEsT0FBQSxvRkFBQSxDQUFBLEtBQUEsT0FBQSxPQUFBLFVBQUEsT0FBQSxzRUFBQSxDQUFBLEtBQUEsT0FBQSxPQUFBLFVBQUEsT0FBQSwrRkFBQSxDQUFBLEtBQUEsT0FBQSxPQUFBLFVBQUEsT0FBQSwrSEFBQSxDQUFBLEtBQUEsT0FBQSxPQUFBLFVBQUEsT0FBQSw0RkFBQSxDQUFBLEtBQUEsT0FBQSxPQUFBLFVBQUEsT0FBQSw0RkFBQSxDQUFBLEtBQUEsT0FBQSxPQUFBLFVBQUEsT0FBQSx1RUFBQSxDQUFBLEtBQUEsT0FBQSxPQUFBLFNBQUEsT0FBQSwrRUFBQSxDQUFBLE9BQUEsT0FBQSxPQUFBLDBDQUFBLFdBQUEsQ0FBQSxDQUFBLEtBQUEsT0FBQSxPQUFBLFVBQUEsT0FBQSwwSkFBQSxDQUFBLEtBQUEsT0FBQSxPQUFBLFVBQUEsT0FBQSw4R0FBQSxDQUFBLEtBQUEsT0FBQSxPQUFBLFVBQUEsT0FBQSw0SEFBQSxDQUFBLEtBQUEsT0FBQSxPQUFBLFNBQUEsT0FBQSwwSEFBQSxDQUFBLEtBQUEsT0FBQSxPQUFBLFNBQUEsT0FBQSx3SEFBQSxDQUFBLEtBQUEsT0FBQSxPQUFBLFNBQUEsT0FBQSx5RkFBQSxDQUFBLE9BQUEsTUFBQSxPQUFBLGFBQUEsV0FBQSxDQUFBLENBQUEsS0FBQSxPQUFBLE9BQUEsUUFBQSxPQUFBLHFGQUFBLENBQUEsS0FBQSxPQUFBLE9BQUEsUUFBQSxPQUFBLCtDQUFBLENBQUEsS0FBQSxPQUFBLE9BQUEsUUFBQSxPQUFBLDJFQUFBLENBQUEsT0FBQSxPQUFBLE9BQUEseUJBQUEsV0FBQSxDQUFBLENBQUEsS0FBQSxPQUFBLE9BQUEsU0FBQSxPQUFBLDZEQUFBLENBQUEsS0FBQSxPQUFBLE9BQUEsU0FBQSxPQUFBLHVFQUFBLENBQUEsS0FBQSxPQUFBLE9BQUEsU0FBQSxPQUFBLDZFQUFBLENBQUEsT0FBQSxPQUFBLE9BQUEsK0NBQUEsV0FBQSxDQUFBLENBQUEsS0FBQSxPQUFBLE9BQUEsU0FBQSxPQUFBLDZEQUFBLENBQUEsS0FBQSxPQUFBLE9BQUEsU0FBQSxPQUFBLG1GQUFBLENBQUEsS0FBQSxPQUFBLE9BQUEsU0FBQSxPQUFBLHVGQUFBLENBQUEsS0FBQSxPQUFBLE9BQUEsU0FBQSxPQUFBLCtFQUFBLENBQUEsS0FBQSxPQUFBLE9BQUEsVUFBQSxPQUFBLGtHQUFBLENBQUEsS0FBQSxPQUFBLE9BQUEsVUFBQSxPQUFBLGdGQUFBLENBQUEsS0FBQSxPQUFBLE9BQUEsVUFBQSxPQUFBLDZEQUFBLENBQUEsS0FBQSxPQUFBLE9BQUEsU0FBQSxPQUFBLHVGQUFBLENBQUEsS0FBQSxPQUFBLE9BQUEsU0FBQSxPQUFBLHdGQUFBLENBQUEsS0FBQSxPQUFBLE9BQUEsU0FBQSxPQUFBOztDQUVBLEtBQUEsVUFBQSxFQUFBLElBQUEsS0FBQSxXQUFBLFNBQUEsT0FBQSxFQUFBLE9BQUEsVUFBQSxNQUFBLE9BQUEsT0FBQSxNQUFBOztDQUVBLEtBQUEsVUFBQSxDQUFBLENBQUEsT0FBQSxRQUFBLE9BQUEscURBQUEsV0FBQSxDQUFBLENBQUEsS0FBQSxPQUFBLE9BQUEsVUFBQSxPQUFBLDJEQUFBLENBQUEsS0FBQSxPQUFBLE9BQUEsVUFBQSxPQUFBLDBDQUFBLENBQUEsT0FBQSxRQUFBLE9BQUEscUJBQUEsV0FBQSxDQUFBLENBQUEsS0FBQSxPQUFBLE9BQUEsVUFBQSxPQUFBLHVFQUFBLENBQUEsS0FBQSxPQUFBLE9BQUEsVUFBQSxPQUFBLGdGQUFBLENBQUEsS0FBQSxPQUFBLE9BQUEsVUFBQSxPQUFBLDRFQUFBLENBQUEsS0FBQSxPQUFBLE9BQUEsVUFBQSxPQUFBLHVFQUFBLENBQUEsT0FBQSxRQUFBLE9BQUEsMENBQUEsV0FBQSxDQUFBLENBQUEsS0FBQSxPQUFBLE9BQUEsVUFBQSxPQUFBLHdFQUFBLENBQUEsS0FBQSxPQUFBLE9BQUEsV0FBQSxPQUFBLHlGQUFBLENBQUEsS0FBQSxPQUFBLE9BQUEsV0FBQSxPQUFBLGdPQUFBLENBQUEsS0FBQSxPQUFBLE9BQUEsV0FBQSxPQUFBLGdFQUFBLENBQUEsS0FBQSxPQUFBLE9BQUEsVUFBQSxPQUFBLHlEQUFBLENBQUEsS0FBQSxPQUFBLE9BQUEsV0FBQSxPQUFBLDBHQUFBLENBQUEsS0FBQSxPQUFBLE9BQUEsV0FBQSxPQUFBLDhDQUFBLENBQUEsS0FBQSxPQUFBLE9BQUEsVUFBQSxPQUFBLHdIQUFBLENBQUEsS0FBQSxPQUFBLE9BQUEsVUFBQSxPQUFBLG9FQUFBLENBQUEsS0FBQSxPQUFBLE9BQUEsVUFBQSxPQUFBLDJGQUFBLENBQUEsT0FBQSxRQUFBLE9BQUEsa0NBQUEsV0FBQSxDQUFBLENBQUEsS0FBQSxPQUFBLE9BQUEsV0FBQSxPQUFBLGdFQUFBLENBQUEsS0FBQSxPQUFBLE9BQUEsV0FBQSxPQUFBLHFFQUFBLENBQUEsS0FBQSxPQUFBLE9BQUEsVUFBQSxPQUFBLHlDQUFBLENBQUEsS0FBQSxPQUFBLE9BQUEsV0FBQSxPQUFBLHdEQUFBLENBQUEsS0FBQSxPQUFBLE9BQUEsV0FBQSxPQUFBLGtGQUFBLENBQUEsS0FBQSxPQUFBLE9BQUEsV0FBQSxPQUFBLHdDQUFBLENBQUEsT0FBQSxPQUFBLE9BQUEscUJBQUEsV0FBQSxDQUFBLENBQUEsS0FBQSxPQUFBLE9BQUEsVUFBQSxPQUFBLGlIQUFBLENBQUEsS0FBQSxPQUFBLE9BQUEsVUFBQSxPQUFBLGtGQUFBLENBQUEsS0FBQSxPQUFBLE9BQUEsU0FBQSxPQUFBLG9HQUFBLENBQUEsS0FBQSxPQUFBLE9BQUEsU0FBQSxPQUFBLDZFQUFBLENBQUEsS0FBQSxPQUFBLE9BQUEsVUFBQSxPQUFBLCtEQUFBLENBQUEsT0FBQSxPQUFBLE9BQUEseUJBQUEsV0FBQSxDQUFBLENBQUEsS0FBQSxPQUFBLE9BQUEsU0FBQSxPQUFBLHlJQUFBLENBQUEsS0FBQSxPQUFBLE9BQUEsU0FBQSxPQUFBLDJFQUFBLENBQUEsS0FBQSxPQUFBLE9BQUEsU0FBQSxPQUFBLG9IQUFBLENBQUEsS0FBQSxPQUFBLE9BQUEsU0FBQSxPQUFBLHdJQUFBLENBQUEsS0FBQSxPQUFBLE9BQUEsU0FBQSxPQUFBLGtEQUFBLENBQUEsS0FBQSxPQUFBLE9BQUEsU0FBQSxPQUFBLG9GQUFBLENBQUEsS0FBQSxPQUFBLE9BQUEsVUFBQSxPQUFBLHNFQUFBLENBQUEsS0FBQSxPQUFBLE9BQUEsVUFBQSxPQUFBLCtGQUFBLENBQUEsS0FBQSxPQUFBLE9BQUEsVUFBQSxPQUFBLDRGQUFBLENBQUEsS0FBQSxPQUFBLE9BQUEsVUFBQSxPQUFBLDRGQUFBLENBQUEsS0FBQSxPQUFBLE9BQUEsVUFBQSxPQUFBLHVFQUFBLENBQUEsS0FBQSxPQUFBLE9BQUEsU0FBQSxPQUFBLCtFQUFBLENBQUEsT0FBQSxPQUFBLE9BQUEsMENBQUEsV0FBQSxDQUFBLENBQUEsS0FBQSxPQUFBLE9BQUEsVUFBQSxPQUFBLDBKQUFBLENBQUEsS0FBQSxPQUFBLE9BQUEsVUFBQSxPQUFBLDhHQUFBLENBQUEsS0FBQSxPQUFBLE9BQUEsVUFBQSxPQUFBLDRIQUFBLENBQUEsS0FBQSxPQUFBLE9BQUEsU0FBQSxPQUFBLDBIQUFBLENBQUEsS0FBQSxPQUFBLE9BQUEsU0FBQSxPQUFBLHdIQUFBLENBQUEsS0FBQSxPQUFBLE9BQUEsU0FBQSxPQUFBLHlGQUFBLENBQUEsT0FBQSxNQUFBLE9BQUEsYUFBQSxXQUFBLENBQUEsQ0FBQSxLQUFBLE9BQUEsT0FBQSxRQUFBLE9BQUEscUZBQUEsQ0FBQSxLQUFBLE9BQUEsT0FBQSxRQUFBLE9BQUEsK0NBQUEsQ0FBQSxLQUFBLE9BQUEsT0FBQSxRQUFBLE9BQUEsMkVBQUEsQ0FBQSxPQUFBLE9BQUEsT0FBQSx5QkFBQSxXQUFBLENBQUEsQ0FBQSxLQUFBLE9BQUEsT0FBQSxTQUFBLE9BQUEsNkRBQUEsQ0FBQSxLQUFBLE9BQUEsT0FBQSxTQUFBLE9BQUEsdUVBQUEsQ0FBQSxLQUFBLE9BQUEsT0FBQSxTQUFBLE9BQUEsNkVBQUEsQ0FBQSxPQUFBLE9BQUEsT0FBQSwrQ0FBQSxXQUFBLENBQUEsQ0FBQSxLQUFBLE9BQUEsT0FBQSxTQUFBLE9BQUEsNkRBQUEsQ0FBQSxLQUFBLE9BQUEsT0FBQSxTQUFBLE9BQUEsbUZBQUEsQ0FBQSxLQUFBLE9BQUEsT0FBQSxTQUFBLE9BQUEsdUZBQUEsQ0FBQSxLQUFBLE9BQUEsT0FBQSxTQUFBLE9BQUEsK0VBQUEsQ0FBQSxLQUFBLE9BQUEsT0FBQSxVQUFBLE9BQUEsa0dBQUEsQ0FBQSxLQUFBLE9BQUEsT0FBQSxVQUFBLE9BQUEsZ0ZBQUEsQ0FBQSxLQUFBLE9BQUEsT0FBQSxVQUFBLE9BQUEsNkRBQUEsQ0FBQSxLQUFBLE9BQUEsT0FBQSxTQUFBLE9BQUEsdUZBQUEsQ0FBQSxLQUFBLE9BQUEsT0FBQSxTQUFBLE9BQUEsd0ZBQUEsQ0FBQSxLQUFBLE9BQUEsT0FBQSxTQUFBLE9BQUE7Q0FDQSxLQUFBLGFBQUEsRUFBQSxRQUFBLEVBQUEsSUFBQSxLQUFBLFNBQUEsU0FBQSxNQUFBLEVBQUEsT0FBQSxDQUFBLE1BQUEsTUFBQSxPQUFBLEVBQUEsTUFBQSxNQUFBLFVBQUE7O0NBRUEsS0FBQSxTQUFBO0NBQ0EsS0FBQSxhQUFBOztDQUVBLEtBQUEsaUJBQUE7RUFDQSxDQUFBLE1BQUEsV0FBQSxPQUFBLElBQUEsU0FBQSxJQUFBLEtBQUEsVUFBQSxTQUFBLElBQUEsUUFBQSxHQUFBLEtBQUEsT0FBQSxJQUFBLEtBQUEsQ0FBQSxHQUFBLEdBQUEsSUFBQSxNQUFBLENBQUEsT0FBQSxJQUFBLE9BQUEsSUFBQSxPQUFBO0VBQ0EsQ0FBQSxNQUFBLFdBQUEsT0FBQSxJQUFBLFNBQUEsSUFBQSxLQUFBLFVBQUEsU0FBQSxNQUFBLFNBQUEsSUFBQSxRQUFBLEdBQUEsS0FBQSxPQUFBLElBQUEsS0FBQSxDQUFBLEdBQUEsR0FBQSxJQUFBLE1BQUEsQ0FBQSxPQUFBLElBQUEsT0FBQSxJQUFBLE9BQUE7RUFDQSxDQUFBLE1BQUEsV0FBQSxPQUFBLElBQUEsU0FBQSxJQUFBLEtBQUEsVUFBQSxTQUFBLEdBQUEsUUFBQSxHQUFBLEtBQUEsT0FBQSxJQUFBLEtBQUEsQ0FBQSxHQUFBLEdBQUEsSUFBQSxNQUFBLENBQUEsT0FBQSxJQUFBLE9BQUEsSUFBQSxPQUFBO0VBQ0EsQ0FBQSxNQUFBLFdBQUEsT0FBQSxJQUFBLFNBQUEsSUFBQSxLQUFBLFVBQUEsU0FBQSxNQUFBLFNBQUEsSUFBQSxRQUFBLEdBQUEsS0FBQSxPQUFBLElBQUEsS0FBQSxDQUFBLEdBQUEsR0FBQSxJQUFBLE1BQUEsQ0FBQSxPQUFBLElBQUEsT0FBQSxJQUFBLE9BQUE7OztDQUdBLEtBQUEsYUFBQSxDQUFBLFlBQUEsUUFBQSxRQUFBOztDQUVBLEtBQUEsY0FBQTs7Q0FFQSxLQUFBLGNBQUEsQ0FBQSxDQUFBLEtBQUEsUUFBQSxZQUFBLENBQUEsQ0FBQSxLQUFBLE9BQUEsT0FBQSxNQUFBLFVBQUEsS0FBQSxDQUFBLEtBQUEsT0FBQSxPQUFBLE1BQUEsVUFBQSxNQUFBLE9BQUEsQ0FBQSxDQUFBLFFBQUEsSUFBQSxPQUFBLElBQUEsTUFBQSxJQUFBLE1BQUEsT0FBQSxJQUFBLDBGQUFBLElBQUEsK0dBQUEsVUFBQSxRQUFBLFNBQUEsRUFBQSxRQUFBLDhDQUFBLENBQUEsS0FBQSxRQUFBLFlBQUEsQ0FBQSxDQUFBLEtBQUEsT0FBQSxPQUFBLE1BQUEsVUFBQSxLQUFBLENBQUEsS0FBQSxPQUFBLE9BQUEsTUFBQSxVQUFBLE1BQUEsT0FBQSxDQUFBLENBQUEsUUFBQSxJQUFBLE9BQUEsSUFBQSxNQUFBLElBQUEsTUFBQSxPQUFBLGNBQUEsQ0FBQSxRQUFBLElBQUEsZ2hEQUFBLFVBQUEsQ0FBQSxDQUFBLEtBQUEsUUFBQSxJQUFBLHNCQUFBLENBQUEsS0FBQSxRQUFBLElBQUEsa0JBQUEsQ0FBQSxLQUFBLFFBQUEsSUFBQSxpQkFBQSxDQUFBLEtBQUEsUUFBQSxJQUFBLGVBQUEsSUFBQSxRQUFBLFVBQUEsUUFBQSxTQUFBLEVBQUEsUUFBQSxzRUFBQSxDQUFBLEtBQUEsUUFBQSxZQUFBLENBQUEsQ0FBQSxLQUFBLE9BQUEsT0FBQSxNQUFBLFVBQUEsS0FBQSxDQUFBLEtBQUEsT0FBQSxPQUFBLE1BQUEsVUFBQSxNQUFBLE9BQUEsQ0FBQSxDQUFBLFFBQUEsSUFBQSxPQUFBLElBQUEsTUFBQSxJQUFBLE1BQUEsT0FBQSxTQUFBLHFDQUFBLElBQUEsc0lBQUEsSUFBQSx3SUFBQSxVQUFBLFFBQUEsU0FBQSxFQUFBLFFBQUEsMERBQUEsQ0FBQSxLQUFBLFFBQUEsWUFBQSxDQUFBLENBQUEsS0FBQSxPQUFBLE9BQUEsTUFBQSxVQUFBLEtBQUEsQ0FBQSxLQUFBLE9BQUEsT0FBQSxNQUFBLFVBQUEsTUFBQSxPQUFBLENBQUEsQ0FBQSxRQUFBLElBQUEsT0FBQSxJQUFBLE1BQUEsSUFBQSxNQUFBLE1BQUEsQ0FBQSxRQUFBLElBQUEsT0FBQSxJQUFBLE1BQUEsSUFBQSxNQUFBLE9BQUEsU0FBQSxxQ0FBQSxJQUFBLDRQQUFBLElBQUEseUtBQUEsVUFBQSxRQUFBLFNBQUEsR0FBQSxDQUFBLEtBQUEsUUFBQSxZQUFBLENBQUEsQ0FBQSxLQUFBLE9BQUEsT0FBQSxNQUFBLFVBQUEsS0FBQSxDQUFBLEtBQUEsT0FBQSxPQUFBLE1BQUEsVUFBQSxNQUFBLE9BQUEsQ0FBQSxDQUFBLFFBQUEsSUFBQSxPQUFBLElBQUEsTUFBQSxJQUFBLE1BQUEsT0FBQSxJQUFBLGlTQUFBLElBQUEsd0lBQUEsVUFBQSxRQUFBLFNBQUEsRUFBQSxRQUFBLDBEQUFBLENBQUEsS0FBQSxRQUFBLFlBQUEsQ0FBQSxDQUFBLEtBQUEsT0FBQSxPQUFBLE1BQUEsVUFBQSxLQUFBLENBQUEsS0FBQSxPQUFBLE9BQUEsTUFBQSxVQUFBLE1BQUEsT0FBQSxDQUFBLENBQUEsUUFBQSxJQUFBLE9BQUEsSUFBQSxNQUFBLElBQUEsTUFBQSxPQUFBLElBQUEsOFJBQUEsSUFBQSx3SUFBQSxVQUFBLFFBQUEsU0FBQSxFQUFBLFFBQUEsMERBQUEsQ0FBQSxLQUFBLFFBQUEsWUFBQSxDQUFBLENBQUEsS0FBQSxPQUFBLE9BQUEsTUFBQSxVQUFBLEtBQUEsQ0FBQSxLQUFBLE9BQUEsT0FBQSxNQUFBLFVBQUEsTUFBQSxPQUFBLENBQUEsQ0FBQSxRQUFBLElBQUEsT0FBQSxJQUFBLE1BQUEsSUFBQSxNQUFBLE9BQUEsSUFBQSw0V0FBQSxJQUFBLDZIQUFBLFVBQUEsUUFBQSxTQUFBLEVBQUEsUUFBQSw4Q0FBQSxDQUFBLEtBQUEsUUFBQSxZQUFBLENBQUEsQ0FBQSxLQUFBLE9BQUEsT0FBQSxNQUFBLFVBQUEsS0FBQSxDQUFBLEtBQUEsT0FBQSxPQUFBLE1BQUEsVUFBQSxNQUFBLE9BQUEsQ0FBQSxDQUFBLFFBQUEsSUFBQSxPQUFBLElBQUEsTUFBQSxLQUFBLE1BQUEsUUFBQSxJQUFBLDRUQUFBLElBQUEsd0lBQUEsVUFBQSxRQUFBLFNBQUEsRUFBQSxRQUFBLDBEQUFBLENBQUEsS0FBQSxRQUFBLFlBQUEsQ0FBQSxDQUFBLEtBQUEsT0FBQSxPQUFBLE1BQUEsVUFBQSxLQUFBLENBQUEsS0FBQSxPQUFBLE9BQUEsTUFBQSxVQUFBLE1BQUEsT0FBQSxDQUFBLENBQUEsUUFBQSxJQUFBLE9BQUEsSUFBQSxNQUFBLEtBQUEsTUFBQSxPQUFBLElBQUEsMlRBQUEsSUFBQSx3SUFBQSxVQUFBLFFBQUEsU0FBQSxFQUFBLFFBQUEsMERBQUEsQ0FBQSxLQUFBLFFBQUEsWUFBQSxDQUFBLENBQUEsS0FBQSxPQUFBLE9BQUEsTUFBQSxVQUFBLEtBQUEsQ0FBQSxLQUFBLE9BQUEsT0FBQSxNQUFBLFVBQUEsTUFBQSxPQUFBLENBQUEsQ0FBQSxRQUFBLElBQUEsT0FBQSxJQUFBLE1BQUEsSUFBQSxNQUFBLE1BQUEsQ0FBQSxRQUFBLElBQUEsT0FBQSxJQUFBLE1BQUEsSUFBQSxNQUFBLE9BQUEsSUFBQSx1a0JBQUEsSUFBQSxtSkFBQSxVQUFBLGNBQUEsU0FBQSxFQUFBLFFBQUEsMERBQUEsQ0FBQSxLQUFBLFFBQUEsWUFBQSxDQUFBLENBQUEsS0FBQSxPQUFBLE9BQUEsTUFBQSxVQUFBLEtBQUEsQ0FBQSxLQUFBLE9BQUEsT0FBQSxNQUFBLFVBQUEsTUFBQSxPQUFBLENBQUEsQ0FBQSxRQUFBLElBQUEsT0FBQSxJQUFBLE1BQUEsSUFBQSxNQUFBLE9BQUEsSUFBQSwrR0FBQSxJQUFBLCtHQUFBLFVBQUEsUUFBQSxTQUFBLEVBQUEsUUFBQSw4Q0FBQSxDQUFBLEtBQUEsUUFBQSxZQUFBLENBQUEsQ0FBQSxLQUFBLE9BQUEsT0FBQSxNQUFBLFVBQUEsS0FBQSxDQUFBLEtBQUEsT0FBQSxPQUFBLE1BQUEsVUFBQSxNQUFBLE9BQUEsQ0FBQSxDQUFBLFFBQUEsSUFBQSxPQUFBLElBQUEsTUFBQSxJQUFBLE1BQUEsT0FBQSxJQUFBLDBGQUFBLElBQUEsK0dBQUEsVUFBQSxRQUFBLFNBQUEsRUFBQSxRQUFBLDhDQUFBLENBQUEsS0FBQSxRQUFBLFlBQUEsQ0FBQSxDQUFBLEtBQUEsT0FBQSxPQUFBLE1BQUEsVUFBQSxLQUFBLENBQUEsS0FBQSxPQUFBLE9BQUEsTUFBQSxVQUFBLE1BQUEsT0FBQSxDQUFBLENBQUEsUUFBQSxJQUFBLE9BQUEsSUFBQSxNQUFBLElBQUEsTUFBQSxPQUFBLElBQUEsc0lBQUEsSUFBQSxvS0FBQSxVQUFBLFFBQUEsU0FBQSxFQUFBLFFBQUEsOENBQUEsQ0FBQSxLQUFBLFFBQUEsWUFBQSxDQUFBLENBQUEsS0FBQSxPQUFBLE9BQUEsTUFBQSxVQUFBLEtBQUEsQ0FBQSxLQUFBLE9BQUEsT0FBQSxNQUFBLFVBQUEsTUFBQSxTQUFBLHVFQUFBLElBQUEsd0VBQUEsSUFBQSxnRUFBQSxVQUFBLFFBQUEsU0FBQSxFQUFBLFFBQUEsMERBQUEsQ0FBQSxLQUFBLFFBQUEsWUFBQSxDQUFBLENBQUEsS0FBQSxPQUFBLE9BQUEsTUFBQSxVQUFBLEtBQUEsQ0FBQSxLQUFBLE9BQUEsT0FBQSxNQUFBLFVBQUEsTUFBQSxTQUFBLG9FQUFBLElBQUEsd0VBQUEsSUFBQSxxREFBQSxVQUFBLFFBQUEsU0FBQSxFQUFBLFFBQUEsOENBQUEsQ0FBQSxLQUFBLFFBQUEsWUFBQSxDQUFBLENBQUEsS0FBQSxPQUFBLE9BQUEsTUFBQSxVQUFBLEtBQUEsQ0FBQSxLQUFBLE9BQUEsT0FBQSxNQUFBLFVBQUEsTUFBQSxJQUFBLHNHQUFBLElBQUEsZ0VBQUEsVUFBQSxRQUFBLFNBQUEsRUFBQSxRQUFBLDBEQUFBLENBQUEsS0FBQSxRQUFBLFlBQUEsQ0FBQSxDQUFBLEtBQUEsT0FBQSxPQUFBLE1BQUEsVUFBQSxLQUFBLENBQUEsS0FBQSxPQUFBLE9BQUEsTUFBQSxVQUFBLE1BQUEsU0FBQSwyRUFBQSxJQUFBLHVFQUFBLElBQUEsaUVBQUEsVUFBQSxRQUFBLFNBQUEsRUFBQSxRQUFBLDBEQUFBLENBQUEsS0FBQSxRQUFBLFlBQUEsQ0FBQSxDQUFBLEtBQUEsT0FBQSxPQUFBLE1BQUEsVUFBQSxLQUFBLENBQUEsS0FBQSxPQUFBLE9BQUEsTUFBQSxVQUFBLE1BQUEsSUFBQSx3SUFBQSxXQUFBLEtBQUEsSUFBQSw0RUFBQSxVQUFBLFFBQUEsU0FBQSxHQUFBLENBQUEsS0FBQSxRQUFBLFlBQUEsQ0FBQSxDQUFBLEtBQUEsT0FBQSxPQUFBLE1BQUEsVUFBQSxLQUFBLENBQUEsS0FBQSxPQUFBLE9BQUEsTUFBQSxVQUFBLE1BQUEsU0FBQSxvRkFBQSxJQUFBLHdFQUFBLElBQUEsMkVBQUEsVUFBQSxRQUFBLFNBQUEsR0FBQSxDQUFBLEtBQUEsUUFBQSxZQUFBLENBQUEsQ0FBQSxLQUFBLE9BQUEsT0FBQSxNQUFBLFVBQUEsS0FBQSxDQUFBLEtBQUEsT0FBQSxPQUFBLE1BQUEsVUFBQSxNQUFBLElBQUEsa0dBQUEsSUFBQSw0R0FBQSxVQUFBLFFBQUEsU0FBQSxHQUFBLENBQUEsS0FBQSxRQUFBLFlBQUEsQ0FBQSxDQUFBLEtBQUEsT0FBQSxPQUFBLE1BQUEsVUFBQSxLQUFBLENBQUEsS0FBQSxPQUFBLE9BQUEsTUFBQSxVQUFBLE1BQUEsSUFBQSx1NkNBQUEsVUFBQSxDQUFBLENBQUEsS0FBQSxRQUFBLElBQUEsa0RBQUEsQ0FBQSxLQUFBLFFBQUEsSUFBQSxzREFBQSxDQUFBLEtBQUEsUUFBQSxJQUFBLHNEQUFBLENBQUEsS0FBQSxRQUFBLElBQUEsdURBQUEsSUFBQSxRQUFBLFVBQUEsUUFBQSxTQUFBLEVBQUEsUUFBQSxzRUFBQSxDQUFBLEtBQUEsUUFBQSxZQUFBLENBQUEsQ0FBQSxLQUFBLE9BQUEsT0FBQSxNQUFBLFVBQUEsS0FBQSxDQUFBLEtBQUEsT0FBQSxPQUFBLE1BQUEsVUFBQSxNQUFBLElBQUEsdStEQUFBLFVBQUEsQ0FBQSxDQUFBLEtBQUEsUUFBQSxJQUFBLHdEQUFBLENBQUEsS0FBQSxRQUFBLElBQUEsd0RBQUEsQ0FBQSxLQUFBLFFBQUEsSUFBQSwwREFBQSxDQUFBLEtBQUEsUUFBQSxJQUFBLHlEQUFBLElBQUEsUUFBQSxVQUFBLFFBQUEsU0FBQSxFQUFBLFFBQUEsc0VBQUEsQ0FBQSxLQUFBLFFBQUEsWUFBQSxDQUFBLENBQUEsS0FBQSxPQUFBLE9BQUEsTUFBQSxVQUFBLEtBQUEsQ0FBQSxLQUFBLE9BQUEsT0FBQSxNQUFBLFVBQUEsTUFBQSxJQUFBLDJvREFBQSxVQUFBLENBQUEsQ0FBQSxLQUFBLFFBQUEsSUFBQSx1REFBQSxDQUFBLEtBQUEsUUFBQSxJQUFBLG1EQUFBLENBQUEsS0FBQSxRQUFBLElBQUEsNkRBQUEsQ0FBQSxLQUFBLFFBQUEsSUFBQSw2REFBQSxJQUFBLFFBQUEsVUFBQSxRQUFBLFNBQUEsRUFBQSxRQUFBLHNFQUFBLENBQUEsS0FBQSxRQUFBLFlBQUEsQ0FBQSxDQUFBLEtBQUEsT0FBQSxPQUFBLE1BQUEsVUFBQSxLQUFBLENBQUEsS0FBQSxPQUFBLE9BQUEsTUFBQSxVQUFBLE1BQUEsU0FBQSxvR0FBQSxJQUFBLG93REFBQSxJQUFBLGtIQUFBLFVBQUEsUUFBQSxTQUFBLEVBQUEsUUFBQSxzRUFBQSxDQUFBLEtBQUEsUUFBQSxZQUFBLENBQUEsQ0FBQSxLQUFBLE9BQUEsT0FBQSxNQUFBLFVBQUEsS0FBQSxDQUFBLEtBQUEsT0FBQSxPQUFBLE1BQUEsVUFBQSxNQUFBLElBQUEsNEpBQUEsSUFBQSxnSEFBQSxVQUFBLFFBQUEsU0FBQSxHQUFBLENBQUEsS0FBQSxRQUFBLFlBQUEsQ0FBQSxDQUFBLEtBQUEsT0FBQSxPQUFBLE1BQUEsVUFBQSxLQUFBLENBQUEsS0FBQSxPQUFBLE9BQUEsTUFBQSxVQUFBLE1BQUEsU0FBQSx3RUFBQSxJQUFBLGtHQUFBLElBQUEsMkVBQUEsVUFBQSxRQUFBLFNBQUEsR0FBQSxDQUFBLEtBQUEsUUFBQSxZQUFBLENBQUEsQ0FBQSxLQUFBLE9BQUEsT0FBQSxNQUFBLFVBQUEsS0FBQSxDQUFBLEtBQUEsT0FBQSxPQUFBLE1BQUEsVUFBQSxNQUFBLFNBQUEsZ0VBQUEsSUFBQSw2QkFBQSxJQUFBLDJFQUFBLFVBQUEsUUFBQSxTQUFBLEdBQUEsQ0FBQSxLQUFBLFFBQUEsWUFBQSxDQUFBLENBQUEsS0FBQSxPQUFBLE9BQUEsTUFBQSxVQUFBLEtBQUEsQ0FBQSxLQUFBLE9BQUEsT0FBQSxNQUFBLFVBQUEsTUFBQSxTQUFBLDREQUFBLElBQUEsa0lBQUEsSUFBQSw0RUFBQSxVQUFBLFFBQUEsU0FBQSxHQUFBLENBQUEsS0FBQSxRQUFBLFlBQUEsQ0FBQSxDQUFBLEtBQUEsT0FBQSxPQUFBLE1BQUEsVUFBQSxLQUFBLENBQUEsS0FBQSxPQUFBLE9BQUEsTUFBQSxVQUFBLE1BQUEsSUFBQSxrSUFBQSxPQUFBLDhFQUFBLElBQUEsOEhBQUEsVUFBQSxRQUFBLFNBQUEsRUFBQSxRQUFBLDhDQUFBLENBQUEsS0FBQSxRQUFBLFlBQUEsQ0FBQSxDQUFBLEtBQUEsT0FBQSxPQUFBLE1BQUEsVUFBQSxLQUFBLENBQUEsS0FBQSxPQUFBLE9BQUEsTUFBQSxVQUFBLE1BQUEsSUFBQSxtU0FBQSxPQUFBLDhFQUFBLElBQUEsa0pBQUEsVUFBQSxRQUFBLFNBQUEsRUFBQSxRQUFBLDhDQUFBLENBQUEsS0FBQSxRQUFBLFlBQUEsQ0FBQSxDQUFBLEtBQUEsT0FBQSxPQUFBLE1BQUEsVUFBQSxLQUFBLENBQUEsS0FBQSxPQUFBLE9BQUEsTUFBQSxVQUFBLE1BQUEsSUFBQSxzWUFBQSxPQUFBLDhFQUFBLElBQUEsOEdBQUEsVUFBQSxRQUFBLFNBQUEsRUFBQSxRQUFBLDhDQUFBLENBQUEsS0FBQSxRQUFBLFlBQUEsQ0FBQSxDQUFBLEtBQUEsT0FBQSxPQUFBLE1BQUEsVUFBQSxLQUFBLENBQUEsS0FBQSxPQUFBLE9BQUEsTUFBQSxVQUFBLE1BQUEsSUFBQSxnTUFBQSxXQUFBLEtBQUEsSUFBQSw0RUFBQSxVQUFBLFFBQUEsU0FBQSxFQUFBLFFBQUEsMERBQUEsQ0FBQSxLQUFBLFFBQUEsWUFBQSxDQUFBLENBQUEsS0FBQSxPQUFBLE9BQUEsTUFBQSxVQUFBLEtBQUEsQ0FBQSxLQUFBLE9BQUEsT0FBQSxNQUFBLFVBQUEsTUFBQSxJQUFBLGtSQUFBLElBQUEsOEVBQUEsVUFBQSxRQUFBLFNBQUEsRUFBQSxRQUFBOztDQUVBLEtBQUEsUUFBQTtFQUNBLE9BQUE7R0FDQTtHQUNBO0dBQ0E7R0FDQTtHQUNBO0dBQ0E7R0FDQTtHQUNBO0dBQ0E7R0FDQTtHQUNBO0dBQ0E7R0FDQTtHQUNBO0dBQ0E7R0FDQTtHQUNBOztFQUVBLE1BQUE7R0FDQTtHQUNBO0dBQ0E7R0FDQTtHQUNBO0dBQ0E7R0FDQTtHQUNBO0dBQ0E7R0FDQTtHQUNBO0dBQ0E7R0FDQTtHQUNBO0dBQ0E7R0FDQTs7O0VBR0EsTUFBQTtHQUNBO0dBQ0E7R0FDQTtHQUNBO0dBQ0E7R0FDQTtHQUNBO0dBQ0E7R0FDQTtHQUNBO0dBQ0E7R0FDQTtHQUNBO0dBQ0E7R0FDQTtHQUNBO0dBQ0E7Ozs7O0NBS0EsS0FBQSxZQUFBLEtBQUEsTUFBQSxNQUFBLE9BQUEsS0FBQSxNQUFBLE1BQUEsS0FBQSxNQUFBLE1BQUE7O0NBRUEsS0FBQSxnQkFBQTs7O0NBR0EsYUFBQSxhQUFBLE1BQUE7O0NBRUEsS0FBQSxRQUFBO0VBQ0EsTUFBQTtFQUNBLFVBQUE7RUFDQSxlQUFBOztFQUVBLFNBQUE7O0VBRUEsU0FBQTs7O0NBR0EsSUFBQSxVQUFBO0VBQ0EsU0FBQTtFQUNBLE9BQUE7RUFDQSxNQUFBO0VBQ0EsU0FBQTtFQUNBLFdBQUE7Ozs7Q0FJQSxPQUFBLFVBQUEsV0FBQSxTQUFBLElBQUEsSUFBQSxDQUFBLEtBQUEsYUFBQTs7O0NBR0EsU0FBQSxZQUFBLFVBQUE7RUFDQSxPQUFBLEtBQUEsTUFBQSxXQUFBOzs7OztDQUtBLFNBQUEsVUFBQSxPQUFBO0NBQ0E7RUFDQSxLQUFBLGVBQUE7O0VBRUEsS0FBQSxjQUFBLE9BQUEsUUFBQSxRQUFBLE1BQUE7O0NBRUEsS0FBQSxZQUFBOztDQUVBLFNBQUEsTUFBQTtFQUNBLFFBQUEsSUFBQTs7OztDQUlBLFNBQUEsYUFBQSxJQUFBO0NBQ0E7RUFDQSxJQUFBLFFBQUE7RUFDQSxLQUFBLElBQUEsSUFBQSxHQUFBLE1BQUEsS0FBQSxRQUFBLFFBQUEsSUFBQSxLQUFBO0VBQ0E7R0FDQSxFQUFBLFFBQUEsS0FBQSxRQUFBLEdBQUEsU0FBQSxTQUFBLE9BQUE7SUFDQSxJQUFBLE1BQUEsT0FBQTtJQUNBO0tBQ0EsVUFBQSxPQUFBLEtBQUEsUUFBQTtLQUNBLEtBQUEsUUFBQSxHQUFBLFNBQUE7S0FDQSxRQUFBOztLQUVBLElBQUEsQ0FBQTtNQUNBLFVBQUEsS0FBQSxZQUFBLElBQUE7O0tBRUEsT0FBQTs7OztHQUlBLElBQUE7SUFDQTs7O0NBR0EsS0FBQSxlQUFBOzs7O0NBSUEsS0FBQSxjQUFBO0NBQ0E7RUFDQSxPQUFBLFNBQUEsT0FBQTs7Ozs7Q0FLQSxLQUFBLFVBQUEsU0FBQTtDQUNBO0VBQ0EsS0FBQSxNQUFBLFVBQUE7RUFDQSxLQUFBLE1BQUEsY0FBQSxRQUFBOztFQUVBLElBQUEsUUFBQTtHQUNBLEtBQUEsTUFBQSxjQUFBOztFQUVBLEtBQUEsTUFBQSxtQkFBQSxLQUFBLE1BQUEsWUFBQSxRQUFBLHVCQUFBOzs7OztDQUtBLEtBQUEsT0FBQSxTQUFBO0NBQ0E7RUFDQSxLQUFBLE1BQUEsT0FBQTtFQUNBLEtBQUEsTUFBQSxXQUFBLFFBQUE7O0VBRUEsS0FBQSxNQUFBLGdCQUFBLEtBQUEsTUFBQSxTQUFBLFFBQUEsdUJBQUE7Ozs7O0NBS0EsS0FBQSxVQUFBLFNBQUE7Q0FDQTtFQUNBLEtBQUEsTUFBQSxVQUFBOzs7Ozs7Q0FNQSxTQUFBLE9BQUE7Q0FDQTs7RUFFQSxPQUFBLHFCQUFBLE1BQUE7Ozs7O0NBS0EsS0FBQSxXQUFBLFNBQUEsT0FBQTtDQUNBO0VBQ0EsSUFBQSxRQUFBOzs7RUFHQSxJQUFBLENBQUEsT0FBQSxTQUFBLFlBQUEsU0FBQSxhQUFBLFFBQUEsS0FBQSxRQUFBLEtBQUEsU0FBQTtHQUNBLFNBQUE7OztFQUdBLElBQUEsT0FBQSxTQUFBLFlBQUEsS0FBQTtHQUNBLFNBQUE7O0VBRUEsT0FBQSxDQUFBLE9BQUEsUUFBQTs7Ozs7Q0FLQSxLQUFBLGlCQUFBLFNBQUEsU0FBQTtDQUNBO0VBQ0EsT0FBQSxLQUFBLE9BQUEsVUFBQSxRQUFBOzs7Ozs7Q0FNQSxTQUFBO0NBQ0E7RUFDQSxJQUFBLFNBQUEsQ0FBQSxLQUFBLE1BQUEsS0FBQSxXQUFBLEtBQUEsSUFBQTtFQUNBLElBQUEsT0FBQSxLQUFBLE1BQUEsQ0FBQSxPQUFBLEtBQUEsT0FBQTtFQUNBLE9BQUEsS0FBQTtFQUNBLE9BQUE7Ozs7O0NBS0EsS0FBQSxZQUFBLFNBQUE7Q0FDQTtFQUNBLE9BQUEsVUFBQTs7Ozs7O0NBTUEsU0FBQSxVQUFBO0NBQ0E7RUFDQSxJQUFBLFNBQUE7O0VBRUEsSUFBQSxJQUFBLFVBQUE7R0FDQSxPQUFBOztFQUVBLE9BQUEsSUFBQSxVQUFBLEdBQUEsT0FBQSxLQUFBOzs7OztDQUtBLEtBQUEsV0FBQSxTQUFBO0NBQ0E7RUFDQSxPQUFBOztFQUVBLElBQUEsUUFBQTtFQUNBLE9BQUEsQ0FBQSxNQUFBLEtBQUE7OztDQUdBLFNBQUEsT0FBQSxLQUFBO0VBQ0EsSUFBQSxRQUFBLEdBQUE7R0FDQSxPQUFBO1NBQ0E7R0FDQSxPQUFBOzs7Ozs7Q0FNQSxTQUFBO0NBQ0E7RUFDQSxJQUFBLE1BQUE7RUFDQSxFQUFBLFFBQUEsS0FBQSxXQUFBLFNBQUEsTUFBQTtHQUNBLElBQUEsU0FBQTtHQUNBLElBQUEsUUFBQTtJQUNBLE9BQUEsT0FBQTtJQUNBLFNBQUEsT0FBQTs7O0VBR0EsT0FBQTs7Ozs7QUM3YUE7Ozs7QUFJQSxRQUFBLE9BQUE7O0NBRUEsVUFBQSxhQUFBLFdBQUE7O0NBRUEsT0FBQTtFQUNBLFVBQUE7RUFDQSxPQUFBO0VBQ0EsWUFBQTtFQUNBLGNBQUE7RUFDQSxhQUFBO0VBQ0EsU0FBQTtFQUNBLFFBQUE7Ozs7O0NBS0EsV0FBQSxpSEFBQSxTQUFBLFFBQUEsVUFBQSxPQUFBLGFBQUEsUUFBQSxRQUFBLFNBQUEsU0FBQSxXQUFBOztDQUVBLElBQUEsT0FBQTs7O0NBR0EsSUFBQSxjQUFBO0VBQ0EsQ0FBQSxLQUFBLHNDQUFBLEtBQUEsZUFBQSxLQUFBLFVBQUEsQ0FBQSxPQUFBO0VBQ0EsQ0FBQSxNQUFBLG9DQUFBLE1BQUEsVUFBQSxLQUFBLFVBQUEsQ0FBQSxPQUFBO0VBQ0EsQ0FBQSxNQUFBLG1DQUFBLE1BQUEsU0FBQSxLQUFBLFVBQUEsQ0FBQSxPQUFBO0VBQ0EsQ0FBQSxNQUFBLHNDQUFBLE1BQUEsWUFBQSxLQUFBLFVBQUEsQ0FBQSxPQUFBO0VBQ0EsQ0FBQSxNQUFBLGtDQUFBLE1BQUEsV0FBQSxLQUFBLFVBQUEsQ0FBQSxPQUFBO0VBQ0EsQ0FBQSxNQUFBLG9DQUFBLE1BQUEsVUFBQSxLQUFBLFVBQUEsQ0FBQSxPQUFBOztDQUVBLEtBQUEsWUFBQTtFQUNBLE9BQUE7RUFDQSxRQUFBOzs7Q0FHQTtHQUNBLE9BQUE7R0FDQSxJQUFBO0dBQ0EsT0FBQTtHQUNBLGFBQUE7R0FDQSxVQUFBOzs7Q0FHQSxNQUFBLElBQUEsY0FBQTs7Q0FFQSxLQUFBLFVBQUEsU0FBQTtDQUNBLEtBQUEsV0FBQSxTQUFBOztDQUVBLE9BQUEsVUFBQSxVQUFBLFdBQUE7Q0FDQSxPQUFBLFVBQUEsYUFBQSxRQUFBO0NBQ0EsT0FBQSxVQUFBLFlBQUEsWUFBQTs7Q0FFQSxRQUFBLGlCQUFBOzs7Ozs7OztDQVFBLEtBQUEsV0FBQSxTQUFBO0NBQ0E7RUFDQSxJQUFBLFdBQUE7RUFDQSxJQUFBLFdBQUEsS0FBQSxZQUFBO0dBQ0EsV0FBQTs7RUFFQSxJQUFBLE1BQUEsSUFBQSxpQkFBQTtHQUNBLE9BQUEsdUJBQUE7O0dBRUEsT0FBQSxhQUFBOzs7OztDQUtBLEtBQUEsWUFBQSxTQUFBO0NBQ0E7RUFDQSxNQUFBLElBQUEsY0FBQTs7O0VBR0EsT0FBQSxRQUFBOzs7OztDQUtBLEtBQUEsT0FBQTtDQUNBO0VBQ0EsSUFBQSxPQUFBLFlBQUE7O0VBRUEsT0FBQSxTQUFBLE9BQUE7Ozs7O0NBS0EsS0FBQSxlQUFBO0NBQ0E7RUFDQSxPQUFBOzs7Ozs7O0NBT0EsS0FBQSxjQUFBO0NBQ0E7RUFDQSxPQUFBOzs7Ozs7Q0FNQSxTQUFBLE9BQUE7Q0FDQTtFQUNBO0VBQ0EsT0FBQSxTQUFBLE9BQUE7Ozs7Ozs7Q0FPQSxTQUFBO0NBQ0E7RUFDQSxJQUFBLENBQUEsVUFBQTtHQUNBLE9BQUE7O0VBRUEsT0FBQTs7Ozs7Ozs7O0NBU0EsS0FBQSxXQUFBO0NBQ0E7RUFDQSxLQUFBLFVBQUEsU0FBQTs7Ozs7Ozs7O0NBU0EsU0FBQTtDQUNBOztFQUVBLElBQUEsS0FBQTtHQUNBOzs7RUFHQSxLQUFBLGVBQUEsT0FBQSxLQUFBO0dBQ0EsVUFBQSwwQkFBQSxNQUFBLElBQUEsYUFBQSxjQUFBLE1BQUEsSUFBQSxhQUFBOzs7O0VBSUEsS0FBQSxhQUFBLE9BQUEsS0FBQSxlQUFBOzs7OztDQUtBLFNBQUE7Q0FDQTtFQUNBLEtBQUEsZUFBQTs7Ozs7Q0FLQSxTQUFBO0NBQ0E7RUFDQSxLQUFBLFdBQUE7Ozs7O0NBS0EsU0FBQTtDQUNBOztFQUVBLEtBQUEsVUFBQSxTQUFBOzs7RUFHQSxXQUFBLFlBQUE7Ozs7OztDQU1BLFNBQUE7Q0FDQTtFQUNBLE9BQUEsT0FBQSxXQUFBO0dBQ0EsS0FBQSxXQUFBO0dBQ0EsS0FBQSxVQUFBOzs7Ozs7Q0FNQSxTQUFBO0NBQ0E7RUFDQSxVQUFBLE1BQUEsQ0FBQSxLQUFBOzs7OztDQUtBLFNBQUE7Q0FDQTtFQUNBLFVBQUEsTUFBQSxDQUFBLEtBQUE7Ozs7OztDQU1BLFNBQUEsVUFBQSxPQUFBO0NBQ0E7O0VBRUEsSUFBQSxPQUFBLFdBQUEsWUFBQSxPQUFBLFdBQUE7R0FDQTs7RUFFQSxJQUFBLE9BQUEsV0FBQTtHQUNBLElBQUEsTUFBQTs7T0FFQSxJQUFBLE9BQUEsT0FBQSxPQUFBLFFBQUE7R0FDQSxNQUFBO09BQ0EsSUFBQSxPQUFBLE9BQUEsT0FBQSxRQUFBO0dBQ0EsTUFBQTs7Ozs7O0VBTUEsV0FBQSxXQUFBO0dBQ0EsT0FBQSxPQUFBLFdBQUE7SUFDQSxLQUFBLFNBQUE7O0tBRUE7Ozs7O0NBS0EsS0FBQSxVQUFBO0NBQ0E7RUFDQSxPQUFBLEtBQUE7R0FDQSxVQUFBO0dBQ0EsTUFBQTs7Ozs7O0FDdlBBOzs7Ozs7Ozs7O0FBVUEsUUFBQSxPQUFBOzs7O0NBSUEsUUFBQSx3QkFBQSxTQUFBLFFBQUE7O0NBRUEsSUFBQSxhQUFBOztDQUVBLElBQUEsVUFBQTtDQUNBLElBQUEsZUFBQTs7Q0FFQSxJQUFBLGVBQUE7Q0FDQSxJQUFBLGdCQUFBOzs7Q0FHQSxJQUFBOzs7Q0FHQSxJQUFBLG9CQUFBOzs7OztDQUtBLFNBQUEsS0FBQSxNQUFBLGFBQUE7Q0FDQTtFQUNBLGNBQUE7RUFDQSxxQkFBQTtFQUNBLG9CQUFBOztFQUVBLGVBQUE7RUFDQSxnQkFBQTtFQUNBLFVBQUE7RUFDQSxlQUFBOzs7Ozs7Q0FNQSxTQUFBLElBQUEsSUFBQTtDQUNBOztFQUVBLGVBQUEsV0FBQSxJQUFBLE1BQUE7Ozs7RUFJQSxJQUFBLENBQUE7R0FDQTs7Ozs7O0NBTUEsU0FBQSxXQUFBLElBQUEsTUFBQTtDQUNBOztFQUVBLFFBQUEsRUFBQSxPQUFBLE9BQUEsU0FBQSxNQUFBLENBQUEsT0FBQSxNQUFBLE9BQUE7OztFQUdBLE1BQUEsS0FBQTtHQUNBLElBQUE7R0FDQSxNQUFBOzs7RUFHQSxPQUFBOzs7Ozs7Q0FNQSxTQUFBO0NBQ0E7RUFDQSxVQUFBO0VBQ0EsV0FBQSxlQUFBOzs7Ozs7Q0FNQSxTQUFBO0NBQ0E7RUFDQSxPQUFBLFFBQUE7RUFDQTs7Ozs7O0NBTUEsU0FBQTtDQUNBO0VBQ0EsZUFBQTs7O0VBR0EsZ0JBQUE7RUFDQSxlQUFBOztFQUVBLElBQUEsT0FBQSxFQUFBLE1BQUEsZUFBQTtFQUNBLHNCQUFBLG1CQUFBOztFQUVBLFlBQUEsTUFBQSxLQUFBLGFBQUE7Ozs7OztDQU1BLFNBQUEsV0FBQTtDQUNBOztFQUVBLEtBQUEsSUFBQSxJQUFBLEdBQUEsTUFBQSxhQUFBLFFBQUEsSUFBQSxLQUFBO0dBQ0EsZ0JBQUEsV0FBQSxhQUFBLEdBQUEsSUFBQSxhQUFBLEdBQUEsTUFBQTs7RUFFQSxlQUFBOzs7RUFHQTs7Ozs7O0NBTUEsU0FBQSxZQUFBO0NBQ0E7O0VBRUEsZ0JBQUE7OztFQUdBLHFCQUFBLGtCQUFBOzs7RUFHQSxlQUFBO0VBQ0EsVUFBQTtFQUNBLE9BQUEsUUFBQTs7O0VBR0EsSUFBQSxhQUFBLFNBQUE7R0FDQTs7Ozs7O0NBTUEsU0FBQTtDQUNBO0VBQ0EsT0FBQTs7Ozs7Ozs7Q0FRQSxTQUFBO0NBQ0E7RUFDQSxRQUFBLGNBQUEsV0FBQSxLQUFBLGFBQUEsV0FBQTs7Ozs7O0NBTUEsT0FBQTtFQUNBLE1BQUE7RUFDQSxLQUFBO0VBQ0EsVUFBQTtFQUNBLFFBQUE7Ozs7QUM1S0E7Ozs7QUFJQSxRQUFBLE9BQUE7Ozs7Ozs7Ozs7Q0FVQSxRQUFBLGtCQUFBLFNBQUEsT0FBQTs7Q0FFQSxJQUFBLE9BQUE7Ozs7Ozs7Ozs7O0NBV0EsU0FBQSxTQUFBO0NBQ0E7RUFDQSxJQUFBLE9BQUEsS0FBQTs7O0VBR0EsSUFBQSxNQUFBLE9BQUEsVUFBQSxLQUFBLE1BQUEsTUFBQSxLQUFBLE1BQUEsV0FBQSxLQUFBLE1BQUE7RUFDQSxPQUFBLE1BQUEsSUFBQSxLQUFBLENBQUEsT0FBQSxLQUFBOzs7Ozs7Q0FNQSxPQUFBO0VBQ0EsVUFBQTs7Ozs7QUN4Q0E7Ozs7O0FBS0EsUUFBQSxPQUFBOzs7O0NBSUEsUUFBQSwyREFBQSxTQUFBLGFBQUEsUUFBQSxNQUFBLFdBQUE7Ozs7OztDQU1BLElBQUEsU0FBQTtFQUNBLFNBQUE7RUFDQSxPQUFBO0VBQ0EsVUFBQTtFQUNBLGFBQUE7RUFDQSxVQUFBO0VBQ0EsWUFBQTtFQUNBLFlBQUE7RUFDQSxPQUFBO0VBQ0EsT0FBQTtFQUNBLE9BQUE7Ozs7Q0FJQSxJQUFBLFNBQUE7RUFDQSxVQUFBO0VBQ0EsV0FBQTtFQUNBLE9BQUE7RUFDQSxPQUFBO0VBQ0EsV0FBQTtFQUNBLFlBQUE7RUFDQSxPQUFBO0VBQ0EsT0FBQTs7OztDQUlBLElBQUEsZ0JBQUEsQ0FBQSxTQUFBOzs7Ozs7Ozs7Q0FTQSxJQUFBLFdBQUE7OztDQUdBLElBQUEsV0FBQTtDQUNBLFVBQUEsS0FBQSxLQUFBOzs7OztDQUtBLEtBQUEsWUFBQSxVQUFBLE1BQUEsWUFBQTs7Ozs7Q0FLQSxTQUFBLEtBQUEsTUFBQTtDQUNBOztFQUVBLEVBQUEsS0FBQSxNQUFBLFNBQUEsS0FBQSxLQUFBOztHQUVBLElBQUEsVUFBQTtJQUNBLElBQUE7SUFDQSxNQUFBLElBQUEsU0FBQSxJQUFBO0lBQ0EsS0FBQSxJQUFBO0lBQ0EsS0FBQSxJQUFBO0lBQ0EsS0FBQSxJQUFBO0lBQ0EsT0FBQSxDQUFBLE9BQUEsSUFBQSxZQUFBLE1BQUEsSUFBQTs7SUFFQSxRQUFBLElBQUE7SUFDQSxHQUFBLElBQUE7SUFDQSxTQUFBLElBQUE7SUFDQSxNQUFBLElBQUE7SUFDQSxhQUFBLElBQUE7O0lBRUEsT0FBQSxDQUFBLEtBQUEsSUFBQSxnQkFBQSxNQUFBLElBQUE7O0lBRUEsR0FBQSxJQUFBO0lBQ0EsU0FBQSxPQUFBLElBQUE7O0lBRUEsUUFBQSxJQUFBLFdBQUEsWUFBQSxXQUFBLElBQUEsVUFBQTs7SUFFQSxVQUFBLFdBQUEsSUFBQTtJQUNBLFVBQUEsSUFBQTtJQUNBLGFBQUEsSUFBQTtJQUNBLGNBQUEsSUFBQSxXQUFBLElBQUE7SUFDQSxRQUFBLElBQUE7SUFDQSxXQUFBLElBQUEsV0FBQTs7SUFFQSxZQUFBLElBQUEsU0FBQTs7O0dBR0EsZUFBQTtHQUNBLGVBQUE7R0FDQSxZQUFBO0dBQ0EsT0FBQSxRQUFBLFlBQUEsT0FBQSxRQUFBLFNBQUE7O0dBRUEsU0FBQSxLQUFBOzs7O0VBSUEsU0FBQSxPQUFBO0VBQ0EsU0FBQSxRQUFBOzs7Ozs7Ozs7O0NBVUEsU0FBQSxlQUFBO0NBQ0E7RUFDQSxLQUFBLFNBQUEsS0FBQTtFQUNBLEtBQUEsV0FBQSxLQUFBOzs7Ozs7Q0FNQSxTQUFBLFlBQUE7Q0FDQTtFQUNBLEtBQUEsU0FBQSxjQUFBLEtBQUE7RUFDQSxLQUFBLFdBQUEsS0FBQTs7Ozs7O0NBTUEsU0FBQSxpQkFBQTtDQUNBO0VBQ0EsS0FBQSxTQUFBLEVBQUEsVUFBQSxLQUFBO0VBQ0EsS0FBQSxXQUFBLEVBQUEsVUFBQSxLQUFBOztFQUVBLElBQUEsVUFBQSxLQUFBLEVBQUEsTUFBQTtFQUNBLElBQUEsVUFBQSxLQUFBLFdBQUEsTUFBQTs7RUFFQSxLQUFBLElBQUEsSUFBQSxHQUFBLE1BQUEsS0FBQSxRQUFBLFFBQUEsSUFBQSxLQUFBO0VBQ0E7R0FDQSxJQUFBLFFBQUEsUUFBQSxLQUFBLFFBQUEsR0FBQSxRQUFBLENBQUE7R0FDQTtJQUNBLEtBQUEsT0FBQSxHQUFBLFFBQUE7Ozs7R0FJQSxJQUFBLFFBQUEsUUFBQSxLQUFBLFFBQUEsR0FBQSxRQUFBLENBQUE7R0FDQTtJQUNBLEtBQUEsU0FBQSxHQUFBLFFBQUE7SUFDQSxLQUFBLFNBQUEsR0FBQSxRQUFBLEtBQUEsT0FBQSxHQUFBLFFBQUEsaUJBQUE7Ozs7Ozs7O0NBUUEsU0FBQSxrQkFBQTtDQUNBO0VBQ0EsS0FBQSxTQUFBLEtBQUEsTUFBQSxJQUFBOztFQUVBLElBQUEsT0FBQSxLQUFBLE9BQUEsTUFBQSxLQUFBOztFQUVBLEtBQUEsV0FBQSxPQUFBLE1BQUEsS0FBQTs7Ozs7O0NBTUEsU0FBQSxjQUFBO0NBQ0E7RUFDQSxJQUFBLFVBQUE7RUFDQSxJQUFBLFFBQUE7OztFQUdBLElBQUEsUUFBQSxPQUFBLFNBQUEsTUFBQSxRQUFBLEtBQUEsUUFBQTtHQUNBLFFBQUEsS0FBQTtHQUNBLE9BQUE7OztFQUdBLE9BQUEsUUFBQSxLQUFBOzs7Ozs7Ozs7Q0FTQSxTQUFBLGVBQUE7Q0FDQTtFQUNBLElBQUEsZ0JBQUEsQ0FBQSxTQUFBLFNBQUEsU0FBQTtFQUNBLElBQUEsY0FBQSxRQUFBLEtBQUEsYUFBQSxDQUFBO0dBQ0EsS0FBQSxjQUFBOztFQUVBLElBQUEsS0FBQSxXQUFBLEtBQUE7RUFDQTtHQUNBLEtBQUEsV0FBQSxLQUFBO0dBQ0EsS0FBQSxlQUFBOzs7Ozs7O0NBT0EsU0FBQTtDQUNBOzs7RUFHQSxJQUFBLFNBQUEsU0FBQTtHQUNBLE9BQUE7OztFQUdBLElBQUEsU0FBQSxHQUFBLFFBQUEsU0FBQSxHQUFBO0dBQ0EsT0FBQTs7RUFFQSxPQUFBOzs7Ozs7Ozs7Ozs7Q0FZQSxTQUFBLGVBQUE7Q0FDQTtFQUNBLEtBQUEsSUFBQSxZQUFBLEtBQUE7RUFDQSxLQUFBLElBQUEsWUFBQSxLQUFBOztFQUVBLEtBQUEsSUFBQSxJQUFBLEdBQUEsS0FBQSxLQUFBLFdBQUEsS0FBQSxRQUFBLFNBQUE7R0FDQSxLQUFBLFFBQUEsR0FBQSxJQUFBLFlBQUEsS0FBQSxRQUFBLEdBQUE7Ozs7Ozs7Q0FPQSxTQUFBLFlBQUE7Q0FDQTtFQUNBLElBQUE7R0FDQSxPQUFBLElBQUEsUUFBQSxNQUFBOztFQUVBLE9BQUE7Ozs7OztDQU1BLFNBQUEsWUFBQTtDQUNBO0VBQ0EsSUFBQSxLQUFBLFlBQUE7RUFDQTs7R0FFQSxJQUFBLFFBQUEsY0FBQSxLQUFBO0dBQ0EsS0FBQSxJQUFBLE1BQUE7R0FDQSxLQUFBLFlBQUEsTUFBQSxPQUFBLGNBQUEsTUFBQTtHQUNBLEtBQUEsWUFBQSxNQUFBLFFBQUEsY0FBQSxNQUFBOzs7R0FHQSxJQUFBLFNBQUE7R0FDQSxJQUFBLFFBQUE7R0FDQSxLQUFBLElBQUEsS0FBQSxFQUFBLFFBQUEsUUFBQTtHQUNBLEtBQUEsSUFBQSxLQUFBLEVBQUEsUUFBQSxPQUFBOzs7Ozs7Q0FNQSxTQUFBLGNBQUE7Q0FDQTtFQUNBLE1BQUEsSUFBQTs7RUFFQSxJQUFBLE9BQUEsU0FBQTtHQUNBLE9BQUEsQ0FBQSxHQUFBOztFQUVBLElBQUEsT0FBQSxRQUFBLGFBQUE7RUFDQSxJQUFBLFFBQUEsUUFBQSxjQUFBOztFQUVBLElBQUEsWUFBQTs7O0VBR0EsSUFBQSxDQUFBLEtBQUEsV0FBQSxNQUFBLFdBQUEsS0FBQSxTQUFBO0dBQ0EsT0FBQSxDQUFBLEdBQUE7OztFQUdBLElBQUEsQ0FBQSxLQUFBO0dBQ0EsT0FBQSxDQUFBLEdBQUE7O0VBRUEsSUFBQSxVQUFBO0VBQ0EsSUFBQSxXQUFBOztFQUVBLElBQUEsS0FBQSxPQUFBO0VBQ0E7R0FDQSxJQUFBLE1BQUEsSUFBQSxVQUFBLEtBQUEsS0FBQSxRQUFBLFFBQUEsTUFBQTtHQUNBLEtBQUE7R0FDQSxNQUFBOzs7RUFHQSxJQUFBLE1BQUEsV0FBQSxNQUFBLE9BQUEsSUFBQSxTQUFBLFNBQUE7RUFDQTtHQUNBLElBQUEsT0FBQSxJQUFBLFVBQUEsS0FBQSxLQUFBLFFBQUEsUUFBQSxJQUFBLFNBQUEsU0FBQTtHQUNBLEtBQUE7R0FDQSxNQUFBOzs7O0VBSUEsSUFBQSxLQUFBO0dBQ0EsT0FBQSxDQUFBLEdBQUE7OztFQUdBLElBQUEsUUFBQTtFQUNBLE1BQUEsSUFBQSxRQUFBLE9BQUE7O0VBRUEsT0FBQTtHQUNBLEdBQUEsSUFBQTtHQUNBLEtBQUE7R0FDQSxNQUFBOzs7Ozs7Ozs7OztDQVdBLFNBQUEsY0FBQTtDQUNBO0VBQ0EsSUFBQSxJQUFBLE9BQUE7R0FDQSxNQUFBLFdBQUEsSUFBQTtFQUNBLElBQUEsRUFBQSxTQUFBLEtBQUE7R0FDQSxPQUFBOztFQUVBLE9BQUE7Ozs7Ozs7Q0FPQSxTQUFBLFFBQUEsUUFBQTtDQUNBO0VBQ0EsSUFBQSxNQUFBO0VBQ0EsSUFBQSxNQUFBLENBQUE7O0VBRUEsT0FBQTtFQUNBO0dBQ0EsTUFBQSxTQUFBLFFBQUEsUUFBQSxJQUFBOztHQUVBLElBQUEsUUFBQSxDQUFBO0lBQ0E7O0dBRUEsSUFBQSxLQUFBOzs7RUFHQSxPQUFBOzs7Ozs7Q0FNQSxTQUFBLFlBQUE7Q0FDQTtFQUNBLEtBQUEsSUFBQSxJQUFBLEdBQUEsTUFBQSxTQUFBLFFBQUEsSUFBQSxLQUFBO0VBQ0E7R0FDQSxJQUFBLFNBQUEsR0FBQSxPQUFBO0lBQ0EsT0FBQSxTQUFBOzs7RUFHQSxPQUFBOzs7Ozs7O0NBT0EsU0FBQSxVQUFBO0NBQ0E7RUFDQSxJQUFBLEtBQUEsUUFBQTtHQUNBLE9BQUE7O0VBRUEsSUFBQSxLQUFBLFlBQUEsS0FBQTtHQUNBLE9BQUE7O0VBRUEsT0FBQTs7Ozs7Ozs7O0NBU0EsU0FBQTtDQUNBO0VBQ0EsT0FBQSxRQUFBLEtBQUE7Ozs7OztDQU1BLFNBQUE7Q0FDQTtFQUNBLElBQUEsTUFBQTs7RUFFQSxLQUFBLElBQUEsSUFBQSxHQUFBLE1BQUEsU0FBQSxRQUFBLElBQUEsS0FBQTtFQUNBO0dBQ0EsSUFBQSxTQUFBLEdBQUE7SUFDQTs7O0VBR0EsT0FBQTs7Ozs7O0NBTUEsU0FBQTtDQUNBO0VBQ0EsT0FBQSxTQUFBOzs7Ozs7O0NBT0EsU0FBQSxVQUFBLElBQUE7Q0FDQTs7RUFFQSxJQUFBLE9BQUEsWUFBQTtFQUNBLElBQUEsQ0FBQTtHQUNBLE9BQUE7Ozs7RUFJQSxJQUFBLEtBQUEsVUFBQSxPQUFBLENBQUEsS0FBQTtHQUNBLE9BQUE7OztFQUdBLEtBQUEsUUFBQTs7O0VBR0EsSUFBQSxPQUFBO0VBQ0E7R0FDQSxLQUFBLFdBQUEsS0FBQTtHQUNBLEtBQUEsZUFBQTs7O0VBR0EsS0FBQSxZQUFBO0VBQ0EsS0FBQSxTQUFBLFVBQUE7OztFQUdBLFVBQUEsSUFBQSxlQUFBO0dBQ0EsS0FBQSxLQUFBO0dBQ0EsS0FBQSxLQUFBO0dBQ0EsS0FBQSxLQUFBO0dBQ0EsT0FBQTs7OztFQUlBLE9BQUEsUUFBQSxLQUFBOzs7Ozs7Q0FNQSxTQUFBO0NBQ0E7RUFDQSxPQUFBLFNBQUE7Ozs7OztDQU1BLFNBQUE7Q0FDQTtFQUNBLE9BQUEsU0FBQTs7Ozs7O0NBTUEsT0FBQTtFQUNBLEtBQUE7RUFDQSxjQUFBO0VBQ0EsT0FBQTtFQUNBLFdBQUE7O0VBRUEsTUFBQTtFQUNBLE9BQUE7Ozs7O0FDdGZBOzs7Ozs7Ozs7Ozs7O0FBYUEsUUFBQSxPQUFBLGlCQUFBLENBQUE7Ozs7Q0FJQSxRQUFBLG9CQUFBLFNBQUEsUUFBQTs7Q0FFQSxJQUFBLFFBQUE7OztFQUdBLFNBQUE7RUFDQSxTQUFBOzs7Q0FHQSxPQUFBOzs7O0VBSUEsS0FBQSxTQUFBLEtBQUE7R0FDQSxPQUFBLE1BQUE7Ozs7O0VBS0EsS0FBQSxTQUFBLEtBQUEsT0FBQTtHQUNBLElBQUEsTUFBQSxTQUFBO0dBQ0E7SUFDQSxNQUFBLE9BQUE7SUFDQSxPQUFBLFFBQUEsaUJBQUEsS0FBQTs7Ozs7OztBQ3hDQTs7Ozs7QUFLQSxRQUFBLE9BQUE7O0NBRUEsVUFBQSxhQUFBLFdBQUE7Ozs7OztDQU1BLElBQUEsUUFBQTs7O0NBR0EsSUFBQSxnQkFBQTs7OztDQUlBLElBQUEscUJBQUE7Q0FDQSxJQUFBLG9CQUFBLENBQUEsaUZBQUE7OztDQUdBLElBQUEscUJBQUE7Ozs7O0NBS0EsU0FBQSxhQUFBO0NBQ0E7RUFDQSxPQUFBLE9BQUEsUUFBQSxPQUFBOzs7OztDQUtBLFNBQUEsY0FBQSxRQUFBO0NBQ0E7O0VBRUEsSUFBQSxRQUFBLE9BQUEsTUFBQTs7O0VBR0EsSUFBQSxDQUFBO0dBQ0EsT0FBQSxPQUFBLFFBQUEsT0FBQTs7RUFFQTtHQUNBLElBQUEsVUFBQSxRQUFBLE1BQUE7O0dBRUEsT0FBQSxPQUFBLFFBQUEsT0FBQSxTQUFBLE1BQUE7SUFDQSxPQUFBLGtCQUFBLEtBQUEsUUFBQSxVQUFBLGtCQUFBOzs7Ozs7OztDQVFBLFNBQUEsS0FBQSxPQUFBLFNBQUE7Q0FDQTtFQUNBLElBQUEsTUFBQSxXQUFBO0dBQ0EsSUFBQSxTQUFBLGFBQUEsTUFBQTs7R0FFQSxJQUFBLFNBQUEsY0FBQSxNQUFBLE9BQUEsTUFBQTs7RUFFQSxRQUFBLEtBQUE7Ozs7O0NBS0EsT0FBQTtFQUNBLFVBQUE7O0VBRUEsT0FBQTtHQUNBLE9BQUE7R0FDQSxTQUFBOzs7RUFHQSxNQUFBOzs7O0FDN0VBOzs7OztBQUtBLFFBQUEsT0FBQTs7Q0FFQSxVQUFBLGNBQUEsV0FBQTs7Ozs7O0NBTUEsSUFBQSxlQUFBO0VBQ0EsZUFBQTtFQUNBLGVBQUE7RUFDQSxZQUFBO0VBQ0EsWUFBQTs7Ozs7Q0FLQSxJQUFBLGFBQUE7RUFDQSxPQUFBO0dBQ0EsUUFBQSxDQUFBLEtBQUE7R0FDQSxNQUFBOzs7RUFHQSxNQUFBO0dBQ0EsUUFBQSxDQUFBLGFBQUE7R0FDQSxNQUFBOzs7RUFHQSxRQUFBO0dBQ0EsUUFBQSxDQUFBLFlBQUEsWUFBQTtHQUNBLE1BQUE7OztFQUdBLFNBQUE7R0FDQSxRQUFBLENBQUEsS0FBQSxLQUFBLEtBQUE7R0FDQSxNQUFBOzs7RUFHQSxXQUFBO0dBQ0EsUUFBQSxDQUFBLEtBQUEsS0FBQSxLQUFBO0dBQ0EsTUFBQTs7O0VBR0EsVUFBQTtHQUNBLFFBQUEsQ0FBQSxLQUFBLEtBQUE7R0FDQSxNQUFBOzs7Ozs7Q0FNQSxTQUFBLFNBQUE7Q0FDQTs7RUFFQSxJQUFBLGFBQUE7R0FDQSxPQUFBLGFBQUE7O0VBRUEsSUFBQSxXQUFBO0dBQ0EsT0FBQSxXQUFBLE1BQUE7O0VBRUEsT0FBQTs7Ozs7Q0FLQSxTQUFBLFVBQUE7Q0FDQTs7RUFFQSxJQUFBLGFBQUE7R0FDQSxPQUFBLGFBQUE7O0VBRUEsSUFBQSxXQUFBO0dBQ0EsT0FBQSxXQUFBLE1BQUE7O0VBRUEsT0FBQSxDQUFBOzs7Ozs7Q0FNQSxTQUFBLGNBQUE7Q0FDQTtFQUNBLElBQUEsQ0FBQSxVQUFBLE9BQUEsWUFBQSxZQUFBLE9BQUEsUUFBQSxTQUFBLENBQUE7R0FDQSxPQUFBLENBQUEsTUFBQTs7RUFFQSxJQUFBLFFBQUEsT0FBQSxRQUFBO0VBQ0EsSUFBQSxPQUFBLE9BQUEsTUFBQSxHQUFBLE9BQUE7RUFDQSxJQUFBLFNBQUEsT0FBQSxNQUFBLE1BQUE7RUFDQSxJQUFBO0dBQ0EsSUFBQSxZQUFBLE9BQUEsTUFBQTs7RUFFQSxPQUFBLENBQUEsS0FBQSxNQUFBLFFBQUE7Ozs7OztDQU1BLFNBQUEsS0FBQSxPQUFBLFNBQUE7Q0FDQTs7RUFFQSxJQUFBLE1BQUEsY0FBQSxNQUFBOztFQUVBLElBQUEsWUFBQSxVQUFBLElBQUE7RUFDQSxJQUFBLFVBQUEsY0FBQSxNQUFBOzs7RUFHQSxNQUFBLFFBQUE7RUFDQSxFQUFBLFFBQUEsV0FBQSxTQUFBLEtBQUE7R0FDQSxNQUFBLE1BQUEsS0FBQTtJQUNBLE9BQUE7SUFDQSxPQUFBLFdBQUEsUUFBQSxPQUFBOzs7Ozs7OztDQVFBLE9BQUE7RUFDQSxVQUFBOztFQUVBLE9BQUE7R0FDQSxTQUFBOzs7RUFHQSxNQUFBO0VBQ0EsYUFBQTs7OztBQ25JQTs7Ozs7QUFLQSxRQUFBLE9BQUE7O0NBRUEsVUFBQSxlQUFBLFdBQUE7O0NBRUEsSUFBQSxlQUFBOztDQUVBLElBQUEsTUFBQTtFQUNBLFdBQUE7R0FDQSxHQUFBO0dBQ0EsR0FBQTs7O0VBR0EsVUFBQTtHQUNBLEdBQUE7R0FDQSxHQUFBOzs7RUFHQSxPQUFBO0dBQ0EsR0FBQTtHQUNBLEdBQUE7OztFQUdBLE9BQUE7R0FDQSxHQUFBO0dBQ0EsR0FBQTs7O0VBR0EsT0FBQTtHQUNBLEdBQUE7R0FDQSxHQUFBOzs7RUFHQSxPQUFBO0dBQ0EsR0FBQTtHQUNBLEdBQUE7OztFQUdBLFdBQUE7R0FDQSxHQUFBO0dBQ0EsR0FBQTs7O0VBR0EsWUFBQTtHQUNBLEdBQUE7R0FDQSxHQUFBOzs7Ozs7O0NBT0EsU0FBQSxZQUFBLE9BQUEsU0FBQTtDQUNBO0VBQ0EsSUFBQSxPQUFBLE1BQUE7RUFDQSxJQUFBLE9BQUEsTUFBQSxRQUFBOztFQUVBLE9BQUEsZUFBQSxJQUFBLE1BQUE7Ozs7O0NBS0EsT0FBQTtFQUNBLFVBQUE7RUFDQSxPQUFBO0dBQ0EsU0FBQTtHQUNBLFFBQUE7R0FDQSxTQUFBOzs7RUFHQSxNQUFBLFNBQUEsT0FBQSxTQUFBLE9BQUE7R0FDQSxNQUFBLGNBQUEsV0FBQSxDQUFBLE9BQUEsWUFBQSxPQUFBLFNBQUE7OztFQUdBLFVBQUE7OztBQzlFQTs7Ozs7QUFLQSxRQUFBLE9BQUE7O0NBRUEsVUFBQSxRQUFBLFdBQUE7Ozs7O0NBS0EsU0FBQSxLQUFBLE9BQUEsU0FBQTtDQUNBOzs7RUFHQSxLQUFBLElBQUEsSUFBQSxHQUFBLE1BQUEsTUFBQSxNQUFBLFFBQUEsSUFBQSxLQUFBO0VBQ0E7R0FDQSxNQUFBLE1BQUEsR0FBQSxJQUFBLFNBQUEsTUFBQSxNQUFBLEdBQUEsR0FBQSxNQUFBO0dBQ0EsTUFBQSxNQUFBLEdBQUEsSUFBQSxTQUFBLE1BQUEsTUFBQSxHQUFBLEdBQUEsTUFBQTs7Ozs7O0NBTUEsT0FBQTtFQUNBLFVBQUE7O0VBRUEsT0FBQTtHQUNBLE9BQUE7R0FDQSxLQUFBOzs7RUFHQSxNQUFBO0VBQ0EsYUFBQTs7OztBQ2xDQTs7Ozs7OztBQU9BLFFBQUEsT0FBQSxrQkFBQTs7Q0FFQSxRQUFBLHlCQUFBLFNBQUEsWUFBQTs7Q0FFQSxJQUFBLFNBQUE7Ozs7O0NBS0EsT0FBQSxVQUFBLFNBQUEsS0FBQTtDQUNBO0VBQ0EsSUFBQSxPQUFBLFNBQUE7R0FDQSxPQUFBOztFQUVBLFdBQUEsTUFBQSxLQUFBOzs7Ozs7Q0FNQSxPQUFBLFlBQUEsU0FBQSxLQUFBLE1BQUE7Q0FDQTtFQUNBLElBQUEsU0FBQSxXQUFBLElBQUEsS0FBQTs7RUFFQSxJQUFBO0dBQ0EsTUFBQSxJQUFBLFlBQUE7Ozs7OztDQU1BLE9BQUE7OztBQ3RDQTs7Ozs7Ozs7Ozs7O0FBWUEsUUFBQSxPQUFBLFdBQUE7O0NBRUEsVUFBQSx5QkFBQSxTQUFBLFdBQUE7O0NBRUEsSUFBQTs7OztDQUlBLElBQUEsV0FBQTs7RUFFQSxPQUFBO0VBQ0EsUUFBQTs7RUFFQSxLQUFBO0VBQ0EsTUFBQTtHQUNBLEdBQUEsQ0FBQSxDQUFBLEtBQUEsS0FBQTtHQUNBLEdBQUEsQ0FBQSxDQUFBLEtBQUEsS0FBQTtHQUNBLE1BQUE7R0FDQSxhQUFBOzs7Ozs7OztDQVFBLElBQUEsV0FBQTs7Ozs7Ozs7Q0FRQSxJQUFBLFdBQUEsV0FBQSxZQUFBO0NBQ0EsSUFBQSxXQUFBLFdBQUE7Q0FDQSxJQUFBO0NBQ0EsSUFBQTs7O0NBR0EsSUFBQSxLQUFBO0NBQ0EsSUFBQSxZQUFBOztDQUVBLElBQUE7Q0FDQSxJQUFBLFFBQUE7O0NBRUEsSUFBQSxRQUFBO0VBQ0EsWUFBQTtFQUNBLGdCQUFBO0VBQ0EsU0FBQTtFQUNBLFdBQUE7RUFDQSxXQUFBO0VBQ0EsVUFBQTtFQUNBLGVBQUE7Ozs7OztDQU1BLFNBQUEsS0FBQSxPQUFBLFNBQUE7Q0FDQTtFQUNBLE9BQUE7O0VBRUEsTUFBQSxXQUFBLEVBQUEsT0FBQSxJQUFBLFVBQUEsTUFBQTs7O0VBR0EsSUFBQSxNQUFBO0dBQ0EsV0FBQSxNQUFBOzs7RUFHQSxRQUFBLEtBQUE7RUFDQSxNQUFBLFNBQUEsUUFBQSxRQUFBLFFBQUEsV0FBQTs7RUFFQSxNQUFBLE9BQUEsS0FBQTtHQUNBLFNBQUE7R0FDQSxPQUFBLE1BQUEsU0FBQTtHQUNBLFFBQUEsTUFBQSxTQUFBOzs7O0VBSUEsS0FBQSxNQUFBOzs7Ozs7Q0FNQSxTQUFBLFdBQUE7Q0FDQTtFQUNBLElBQUEsU0FBQSxpQkFBQTs7RUFFQSxLQUFBLFNBQUEsTUFBQSxLQUFBLFNBQUEsSUFBQSxPQUFBOzs7Ozs7Q0FNQSxTQUFBLGlCQUFBO0NBQ0E7RUFDQSxJQUFBLFNBQUEsVUFBQSxNQUFBO0VBQ0EsSUFBQSxhQUFBLE9BQUE7O0VBRUEsSUFBQSxLQUFBO0VBQ0EsS0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLFlBQUEsR0FBQTtHQUNBLEdBQUEsS0FBQSxXQUFBLE9BQUEsS0FBQSxNQUFBLE9BQUEsRUFBQTs7RUFFQSxPQUFBOzs7Ozs7Q0FNQSxPQUFBO0VBQ0EsVUFBQTtFQUNBLE9BQUE7R0FDQSxTQUFBO0dBQ0EsUUFBQTs7O0VBR0EsTUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Q0FpQkEsU0FBQSxLQUFBO0NBQ0E7RUFDQSxJQUFBLEtBQUEsS0FBQSxTQUFBO0VBQ0EsSUFBQSxHQUFBLFNBQUE7R0FDQTs7RUFFQSxTQUFBLEdBQUEsTUFBQTs7RUFFQSxRQUFBO0VBQ0E7RUFDQTs7Ozs7Q0FLQSxTQUFBLFFBQUE7Q0FDQTtFQUNBLElBQUEsUUFBQSxLQUFBLFNBQUE7OztFQUdBLElBQUEsT0FBQSxNQUFBLE1BQUE7R0FDQSxNQUFBLElBQUEsQ0FBQSxDQUFBLElBQUEsSUFBQTtFQUNBLElBQUEsT0FBQSxNQUFBLE1BQUE7R0FDQSxNQUFBLElBQUEsQ0FBQSxDQUFBLElBQUEsSUFBQTtFQUNBLElBQUEsT0FBQSxNQUFBLFNBQUE7R0FDQSxNQUFBLE9BQUE7O0VBRUEsSUFBQSxPQUFBLE1BQUEsTUFBQTtHQUNBLE1BQUEsSUFBQSxNQUFBLEVBQUEsTUFBQTtFQUNBLElBQUEsT0FBQSxNQUFBLE1BQUE7R0FDQSxNQUFBLElBQUEsTUFBQSxFQUFBLE1BQUE7OztFQUdBLE1BQUEsT0FBQSxHQUFBLFdBQUE7O0VBRUEsV0FBQTtHQUNBLFFBQUEsTUFBQTtHQUNBLFFBQUEsTUFBQTtHQUNBLFdBQUEsTUFBQTtHQUNBLGFBQUEsQ0FBQSxDQUFBLE1BQUE7Ozs7RUFJQSxJQUFBLFNBQUEsR0FBQSxTQUFBLEdBQUEsV0FBQTs7RUFFQSxZQUFBLE1BQUEsRUFBQTtFQUNBLFlBQUEsTUFBQSxFQUFBO0VBQ0EsYUFBQSxNQUFBLEVBQUE7O0VBRUEsY0FBQSxZQUFBOztFQUVBLFlBQUEsTUFBQSxFQUFBO0VBQ0EsWUFBQSxNQUFBLEVBQUE7RUFDQSxhQUFBLE1BQUEsRUFBQTs7OztDQUlBLFNBQUEsY0FBQSxLQUFBLE9BQUE7Q0FDQTtFQUNBLE9BQUEsTUFBQSxNQUFBLElBQUEsT0FBQTs7Ozs7Q0FLQSxTQUFBLFlBQUEsS0FBQTtDQUNBO0VBQ0EsSUFBQSxRQUFBO0VBQ0EsT0FBQSxXQUFBLE1BQUEsTUFBQTs7Ozs7Q0FLQSxTQUFBLGNBQUE7Q0FDQTtFQUNBLElBQUE7O0VBRUEsSUFBQSxRQUFBLFVBQUE7O0VBRUE7R0FDQSxJQUFBLENBQUEsVUFBQSxPQUFBLFVBQUEsSUFBQTtHQUNBLFVBQUE7Ozs7RUFJQSxJQUFBLGFBQUEsR0FBQSxHQUFBLEdBQUEsR0FBQSxHQUFBOztFQUVBLElBQUEsT0FBQSxTQUFBLFFBQUEsTUFBQTs7RUFFQSxJQUFBLEtBQUE7R0FDQSxNQUFBLEVBQUEsT0FBQSxLQUFBLElBQUEsU0FBQSxLQUFBLE1BQUEsRUFBQSxjQUFBLEtBQUEsT0FBQTs7R0FFQSxRQUFBLEVBQUEsT0FBQSxLQUFBLElBQUEsU0FBQSxLQUFBLE1BQUEsRUFBQSxjQUFBLEtBQUEsT0FBQTs7R0FFQSxZQUFBLEVBQUEsT0FBQSxLQUFBLElBQUEsVUFBQSxLQUFBO0tBQ0EsSUFBQSxJQUFBLE1BQUEsWUFBQSxLQUFBOzs7O01BSUEsSUFBQSxjQUFBO01BQ0EsSUFBQSxpQkFBQTtNQUNBLElBQUEsS0FBQSxTQUFBLEdBQUEsR0FBQSxFQUFBLE9BQUEsRUFBQSxLQUFBLEVBQUE7TUFDQSxJQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsSUFBQTtNQUNBLElBQUEsWUFBQSxLQUFBLEtBQUEsSUFBQSxJQUFBOztNQUVBLElBQUEsWUFBQSxZQUFBO01BQ0E7T0FDQSxJQUFBLGNBQUEsWUFBQTtPQUNBLElBQUEsZUFBQSxZQUFBLElBQUE7T0FDQSxJQUFBLGVBQUEsWUFBQSxJQUFBO09BQ0EsSUFBQSxtQkFBQSxHQUFBO09BQ0EsSUFBQSxvQkFBQSxHQUFBO09BQ0EsSUFBQSxvQkFBQSxHQUFBO09BQ0EsSUFBQSxTQUFBO09BQ0EsSUFBQSxLQUFBLENBQUEsSUFBQTtPQUNBLElBQUEsV0FBQSxTQUFBLEdBQUEsRUFBQSxPQUFBLEtBQUE7T0FDQSxJQUFBLGlCQUFBLFNBQUEsR0FBQSxXQUFBLEVBQUEsT0FBQSxJQUFBOzs7TUFHQSxJQUFBLFFBQUE7TUFDQSxXQUFBLE1BQUEsTUFBQTs7O0dBR0EsWUFBQSxFQUFBLE9BQUEsS0FBQSxJQUFBLFVBQUEsS0FBQTtLQUNBLElBQUEsSUFBQSxNQUFBLFlBQUEsS0FBQTs7OztNQUlBLElBQUEsY0FBQSxJQUFBLGVBQUE7TUFDQSxJQUFBLGlCQUFBOztNQUVBLElBQUEsSUFBQSxJQUFBO01BQ0EsSUFBQSxPQUFBLFNBQUE7TUFDQSxJQUFBLFVBQUE7TUFDQSxJQUFBLE1BQUE7TUFDQSxJQUFBLE9BQUE7T0FDQSxJQUFBLFdBQUEsU0FBQSxHQUFBLEVBQUEsT0FBQSxLQUFBLElBQUE7O01BRUEsSUFBQSxLQUFBLFNBQUEsR0FBQSxHQUFBLEVBQUEsT0FBQSxJQUFBLEtBQUEsTUFBQSxJQUFBO01BQ0EsSUFBQSxRQUFBO01BQ0EsV0FBQSxNQUFBLE1BQUE7OztHQUdBLFNBQUEsRUFBQSxPQUFBLEtBQUEsSUFBQSxVQUFBLEtBQUE7S0FDQSxJQUFBLElBQUEsTUFBQSxZQUFBLEtBQUE7TUFDQSxJQUFBLElBQUEsSUFBQTtNQUNBLElBQUEsVUFBQTtNQUNBLElBQUEsWUFBQSxtQkFBQTtNQUNBLElBQUEsVUFBQTtNQUNBLElBQUEsY0FBQSxJQUFBO01BQ0EsSUFBQSxlQUFBLElBQUEsS0FBQTtNQUNBLElBQUEsZUFBQSxJQUFBLEtBQUE7TUFDQSxJQUFBLG1CQUFBLEdBQUE7TUFDQSxJQUFBLG9CQUFBLEdBQUE7TUFDQSxJQUFBLG9CQUFBLEVBQUE7TUFDQSxJQUFBLFNBQUE7TUFDQSxJQUFBLEtBQUEsQ0FBQSxJQUFBO01BQ0EsSUFBQSxXQUFBLFNBQUEsR0FBQSxFQUFBLE9BQUEsS0FBQSxLQUFBLElBQUEsR0FBQTs7Ozs7Ozs7TUFRQSxJQUFBLEtBQUEsU0FBQSxHQUFBLEdBQUEsR0FBQSxFQUFBLE9BQUEsS0FBQSxNQUFBLElBQUEsRUFBQSxLQUFBLEVBQUEsT0FBQTtNQUNBLElBQUEsUUFBQTtNQUNBLFdBQUEsTUFBQSxNQUFBOzs7R0FHQSxlQUFBLEVBQUEsT0FBQSxLQUFBLElBQUEsVUFBQSxLQUFBO0tBQ0EsSUFBQSxJQUFBLE1BQUEsWUFBQSxLQUFBO01BQ0EsSUFBQSxJQUFBLElBQUEsSUFBQSxJQUFBLElBQUE7TUFDQSxJQUFBLFVBQUE7TUFDQSxJQUFBLFlBQUEsbUJBQUE7O01BRUEsSUFBQSxjQUFBLElBQUE7O01BRUEsSUFBQSxtQkFBQSxHQUFBO01BQ0EsSUFBQSxtQkFBQSxHQUFBOzs7TUFHQSxJQUFBLEtBQUEsU0FBQSxHQUFBLEdBQUEsR0FBQSxFQUFBLE9BQUEsSUFBQSxLQUFBLE1BQUEsRUFBQSxLQUFBLEVBQUEsS0FBQTs7O01BR0EsSUFBQSxLQUFBLElBQUEsbUJBQUEsTUFBQSxLQUFBLElBQUEsbUJBQUE7TUFDQTtPQUNBLElBQUEsY0FBQSxJQUFBO09BQ0EsSUFBQSxlQUFBLElBQUE7T0FDQSxJQUFBLGVBQUEsSUFBQTtPQUNBLElBQUEsbUJBQUEsR0FBQTtPQUNBLElBQUEsb0JBQUEsR0FBQTtPQUNBLElBQUEsb0JBQUEsRUFBQTs7O01BR0EsSUFBQSxRQUFBO01BQ0EsV0FBQSxNQUFBLE1BQUE7OztHQUdBLGVBQUEsRUFBQSxPQUFBLEtBQUEsSUFBQSxVQUFBLEtBQUE7S0FDQSxJQUFBLElBQUEsTUFBQSxZQUFBLEtBQUE7O01BRUEsSUFBQSxjQUFBO01BQ0EsSUFBQSxLQUFBLFNBQUEsR0FBQSxHQUFBLEdBQUEsRUFBQSxPQUFBLElBQUEsS0FBQSxNQUFBLEVBQUEsS0FBQSxFQUFBLEtBQUE7TUFDQSxJQUFBLFFBQUE7TUFDQSxXQUFBLE1BQUEsTUFBQTs7O0dBR0EsT0FBQSxFQUFBLE9BQUEsS0FBQSxJQUFBLFNBQUEsS0FBQSxPQUFBO01BQ0EsSUFBQSxJQUFBLFFBQUEsT0FBQTs7T0FFQSxVQUFBLE1BQUEsTUFBQTs7O0VBR0EsS0FBQSxJQUFBLEVBQUEsR0FBQSxJQUFBLFFBQUEsUUFBQTtFQUNBO0dBQ0EsUUFBQSxRQUFBO0dBQ0EsVUFBQSxRQUFBLEdBQUEsU0FBQTtHQUNBLFNBQUEsUUFBQSxHQUFBOzs7R0FHQSxRQUFBLE1BQUEsUUFBQSxRQUFBLElBQUE7R0FDQSxTQUFBLE1BQUEsTUFBQSxHQUFBLE1BQUEsUUFBQTtHQUNBLE9BQUEsTUFBQSxNQUFBLE1BQUEsUUFBQSxLQUFBLEdBQUEsTUFBQTs7O0dBR0EsS0FBQSxPQUFBLEdBQUEsWUFBQTtHQUNBOztJQUVBLEtBQUEsSUFBQSxFQUFBLEdBQUEsSUFBQSxHQUFBLFFBQUEsUUFBQTtLQUNBLEtBQUEsT0FBQSxLQUFBLEtBQUEsV0FBQSxLQUFBO01BQ0EsS0FBQSxLQUFBOzs7SUFHQSxJQUFBLEtBQUEsVUFBQSxHQUFBLFFBQUE7T0FDQSxHQUFBLFFBQUEsR0FBQSxNQUFBLFNBQUE7O0tBRUE7Ozs7SUFJQSxRQUFBLElBQUEsdUNBQUE7Ozs7Ozs7Ozs7OztDQVlBLFNBQUEsU0FBQSxJQUFBLElBQUEsSUFBQSxJQUFBLE9BQUE7Q0FDQTtFQUNBLEtBQUEsS0FBQSxNQUFBO0VBQ0EsS0FBQSxLQUFBLE1BQUE7RUFDQSxLQUFBLEtBQUEsTUFBQTtFQUNBLEtBQUEsS0FBQSxNQUFBOztFQUVBLElBQUEsY0FBQTtFQUNBLElBQUEsWUFBQTtFQUNBLElBQUE7O0VBRUEsSUFBQSxPQUFBLElBQUE7RUFDQSxJQUFBLE9BQUEsSUFBQTs7RUFFQSxJQUFBO0VBQ0EsSUFBQTs7Ozs7Q0FLQSxTQUFBLFVBQUEsT0FBQSxRQUFBLEdBQUEsR0FBQTtDQUNBOztFQUVBLG1CQUFBLENBQUEsRUFBQSxHQUFBLEVBQUEsSUFBQSxJQUFBLFFBQUE7Ozs7OztDQU1BLFNBQUEsWUFBQTtDQUNBO0VBQ0EsT0FBQSxNQUFBLEtBQUEsS0FBQTs7Ozs7Ozs7Q0FRQSxTQUFBLFVBQUEsR0FBQSxHQUFBO0NBQ0E7RUFDQSxJQUFBLGlCQUFBLFlBQUE7OztFQUdBLElBQUEsYUFBQSxHQUFBLEdBQUEsR0FBQSxHQUFBLEdBQUE7OztFQUdBLElBQUEsVUFBQSxHQUFBO0VBQ0EsSUFBQSxPQUFBOzs7Ozs7Ozs7Q0FTQSxTQUFBLFVBQUEsR0FBQSxHQUFBLGlCQUFBLFFBQUE7Q0FDQTtFQUNBLElBQUEsbUJBQUE7RUFDQSxJQUFBLFFBQUEsU0FBQSxLQUFBLElBQUEsWUFBQTs7RUFFQSxVQUFBLEdBQUEsR0FBQTs7Ozs7OztFQU9BLFNBQUEsR0FBQSxHQUFBLENBQUEsUUFBQSxDQUFBLE9BQUEsR0FBQTtFQUNBLFNBQUEsR0FBQSxHQUFBLENBQUEsUUFBQSxDQUFBLE9BQUEsR0FBQTs7O0NBR0EsU0FBQSxRQUFBLEdBQUEsR0FBQTtDQUNBO0VBQ0EsSUFBQSxTQUFBLEVBQUEsS0FBQSxHQUFBLEVBQUEsS0FBQSxHQUFBLE1BQUE7OztDQUdBLFNBQUEsWUFBQSxXQUFBLGVBQUE7Q0FDQTtFQUNBLElBQUEsUUFBQTtHQUNBLEtBQUE7R0FDQSxLQUFBOztFQUVBLElBQUEsTUFBQSxLQUFBLFlBQUE7R0FDQSxNQUFBLEtBQUEsWUFBQTs7RUFFQSxTQUFBLG9CQUFBLElBQUE7RUFDQSxTQUFBLG9CQUFBLElBQUE7OztFQUdBLElBQUEsYUFBQSxHQUFBLEdBQUEsR0FBQSxHQUFBLEdBQUE7O0VBRUEsU0FBQSxPQUFBLEdBQUEsT0FBQSxHQUFBLE9BQUEsR0FBQSxPQUFBLEdBQUEsR0FBQTs7O0NBR0EsU0FBQSxXQUFBLE9BQUEsT0FBQSxPQUFBO0NBQ0E7O0VBRUEsSUFBQSxRQUFBO0dBQ0E7O0VBRUEsSUFBQSxRQUFBO0dBQ0EsT0FBQSxtQkFBQTs7RUFFQSxTQUFBLG9CQUFBLE9BQUE7O0VBRUEsSUFBQTtFQUNBLElBQUEsY0FBQTtFQUNBLElBQUEsWUFBQTs7O0VBR0EsSUFBQSxhQUFBLEdBQUEsR0FBQSxHQUFBLEdBQUEsR0FBQTs7RUFFQSxJQUFBLElBQUEsT0FBQSxHQUFBLE9BQUEsR0FBQSxNQUFBLEdBQUEsS0FBQSxLQUFBLEdBQUE7O0VBRUEsSUFBQTtFQUNBLElBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztDQTJCQSxTQUFBLFdBQUEsT0FBQSxHQUFBLEdBQUEsR0FBQTtDQUNBO0VBQ0EsSUFBQSxNQUFBO0dBQ0EsYUFBQTtHQUNBLGFBQUEsb0JBQUEsR0FBQTtHQUNBLGFBQUE7R0FDQSxhQUFBO0dBQ0EsZ0JBQUE7R0FDQSxnQkFBQTs7R0FFQSxjQUFBLEdBQUE7R0FDQSxjQUFBLElBQUE7R0FDQSxjQUFBLElBQUE7O0dBRUEsa0JBQUEsR0FBQTtHQUNBLG1CQUFBLEdBQUE7R0FDQSxtQkFBQSxFQUFBOztHQUVBLFFBQUEsY0FBQSxLQUFBLElBQUE7O0dBRUEsVUFBQSxTQUFBLEdBQUEsRUFBQSxPQUFBLEtBQUEsSUFBQTtHQUNBLGdCQUFBLFNBQUEsR0FBQSxXQUFBLEVBQUEsT0FBQSxJQUFBOzs7RUFHQSxJQUFBLEtBQUEsSUFBQSxtQkFBQTs7O0VBR0EsSUFBQSxZQUFBLElBQUEsS0FBQTtFQUNBLElBQUEsS0FBQSxDQUFBLElBQUE7OztFQUdBLElBQUEsYUFBQSxHQUFBLEdBQUEsR0FBQSxHQUFBLEdBQUE7RUFDQSxJQUFBLFVBQUEsSUFBQSxZQUFBLEdBQUEsSUFBQSxZQUFBOztFQUVBLElBQUEsWUFBQTtFQUNBLE9BQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0NBb0JBLFNBQUEsV0FBQSxLQUFBLE9BQUEsR0FBQSxHQUFBLEdBQUE7Q0FDQTtFQUNBLElBQUEsR0FBQTtFQUNBLElBQUEsS0FBQSxDQUFBLEVBQUEsR0FBQSxFQUFBOztFQUVBLElBQUEsZUFBQTtFQUNBLElBQUEsZ0JBQUE7RUFDQSxJQUFBLGdCQUFBO0VBQ0EsSUFBQSxlQUFBLElBQUE7OztFQUdBLFFBQUEsSUFBQSxXQUFBLEdBQUEsSUFBQTtFQUNBLElBQUEsSUFBQTtHQUNBLFFBQUEsQ0FBQSxJQUFBLFdBQUEsR0FBQSxJQUFBOzs7OztFQUtBLEtBQUEsSUFBQSxJQUFBO1FBQ0EsSUFBQSxTQUFBO2dCQUNBLEtBQUEsSUFBQTtFQUNBO0dBQ0EsSUFBQSxJQUFBLEdBQUEsR0FBQSxHQUFBOztHQUVBLEdBQUEsSUFBQSxtQkFBQTtHQUNBLEdBQUEsSUFBQSxtQkFBQTs7R0FFQSxTQUFBLEdBQUEsSUFBQSxDQUFBLEdBQUEsR0FBQSxJQUFBOztHQUVBLElBQUEsSUFBQTtJQUNBLFFBQUEsQ0FBQSxHQUFBLElBQUEsQ0FBQSxHQUFBLEdBQUEsSUFBQTs7R0FFQSxJQUFBLElBQUE7R0FDQTtJQUNBLFNBQUEsR0FBQSxHQUFBLEdBQUEsR0FBQSxJQUFBOztJQUVBLElBQUEsSUFBQTtLQUNBLFFBQUEsQ0FBQSxHQUFBLEdBQUEsR0FBQSxHQUFBLElBQUE7OztHQUdBLElBQUEsSUFBQSxlQUFBLEdBQUEsSUFBQTtHQUNBO0lBQ0EsSUFBQSxJQUFBLGVBQUEsR0FBQSxJQUFBO0lBQ0E7S0FDQSxJQUFBLElBQUEsZUFBQSxHQUFBLElBQUE7TUFDQSxJQUFBLGVBQUEsSUFBQTs7TUFFQSxJQUFBLGVBQUEsSUFBQTs7O0lBR0EsSUFBQSxLQUFBLElBQUEsSUFBQSxNQUFBLElBQUE7S0FDQSxJQUFBLE1BQUEsSUFBQTs7Ozs7RUFLQSxJQUFBLGFBQUEsR0FBQSxHQUFBLEdBQUEsR0FBQSxHQUFBOzs7Ozs7O0NBT0EsU0FBQSxTQUFBO0NBQ0E7RUFDQSxJQUFBLFNBQUEsQ0FBQTtFQUNBLElBQUEsV0FBQSxHQUFBLE9BQUE7RUFDQSxJQUFBLE9BQUEsTUFBQSxTQUFBLE9BQUE7RUFDQSxPQUFBLFNBQUEsSUFBQSxDQUFBLElBQUE7Ozs7Ozs7Ozs7Q0FVQSxTQUFBLFdBQUE7Q0FDQTtFQUNBLE9BQUE7O0VBRUE7RUFDQTs7Ozs7Q0FLQSxTQUFBLFNBQUEsU0FBQSxTQUFBLFVBQUEsV0FBQTtDQUNBO0VBQ0EsSUFBQSxZQUFBLEtBQUEsSUFBQSxVQUFBO0VBQ0EsSUFBQSxnQkFBQSxJQUFBO0dBQ0EsY0FBQSxlQUFBLGNBQUE7RUFDQSxJQUFBLFNBQUEsS0FBQSxJQUFBLEtBQUEsSUFBQSxVQUFBLEtBQUEsSUFBQTtFQUNBLElBQUEsVUFBQSxJQUFBLFlBQUE7RUFDQSxZQUFBLFFBQUE7O0VBRUEsSUFBQTtFQUNBO0dBQ0EsU0FBQTtHQUNBLFNBQUE7R0FDQSxVQUFBO0dBQ0EsUUFBQTtHQUNBLGVBQUE7O0dBRUEsT0FBQSxTQUFBO0dBQ0E7SUFDQSxJQUFBLE9BQUEsTUFBQTtLQUNBLElBQUEsV0FBQTtJQUNBLElBQUEsSUFBQSxFQUFBLFFBQUEsS0FBQTtJQUNBLElBQUEsSUFBQSxFQUFBLFFBQUE7SUFDQSxJQUFBLElBQUE7S0FDQSxPQUFBO0lBQ0EsT0FBQTs7O0VBR0EsS0FBQSxZQUFBLFlBQUE7O0VBRUEsSUFBQSxnQkFBQSxLQUFBLE1BQUEsWUFBQTs7RUFFQSxJQUFBLGdCQUFBLGVBQUEsZ0JBQUE7RUFDQTtHQUNBLElBQUEsWUFBQTtJQUNBLGdCQUFBLEtBQUEsTUFBQSxZQUFBOztHQUVBO0lBQ0EsZ0JBQUE7SUFDQSxnQkFBQSxLQUFBLE1BQUEsWUFBQSxnQkFBQSxNQUFBOzs7R0FHQSxLQUFBLFdBQUE7R0FDQSxnQkFBQSxLQUFBLE1BQUEsWUFBQTs7O0VBR0EsS0FBQSxxQkFBQSxLQUFBLE1BQUEsS0FBQSxJQUFBLEtBQUEsSUFBQSxVQUFBLEtBQUEsSUFBQSxZQUFBLEtBQUE7O0VBRUEsS0FBQSxXQUFBLEtBQUEsTUFBQSxLQUFBLElBQUEsV0FBQSxLQUFBOzs7RUFHQSxLQUFBLFVBQUEsRUFBQSxZQUFBLFlBQUEsTUFBQTs7O0VBR0EsS0FBQSxTQUFBLEtBQUEsTUFBQSxZQUFBLFlBQUEsS0FBQSxJQUFBLFVBQUEsS0FBQSxVQUFBLEtBQUE7OztFQUdBLEtBQUEsVUFBQSxLQUFBLE1BQUEsS0FBQTs7Ozs7O0VBTUEsT0FBQTs7Ozs7Ozs7OztDQVVBLFNBQUE7Q0FDQTs7RUFFQSxJQUFBLFVBQUE7R0FDQSxVQUFBOzs7RUFHQSxJQUFBLFNBQUEsR0FBQSxPQUFBLEdBQUEsU0FBQTs7RUFFQSxTQUFBLFNBQUEsS0FBQSxPQUFBLFNBQUEsS0FBQSxPQUFBLFNBQUEsS0FBQSxPQUFBO1FBQ0EsS0FBQSxTQUFBLE9BQUE7O0VBRUEsU0FBQSxTQUFBLEtBQUEsT0FBQSxTQUFBLEtBQUEsT0FBQSxTQUFBLEtBQUEsT0FBQTtRQUNBLEtBQUEsU0FBQSxRQUFBOzs7Ozs7Ozs7O0NBVUEsU0FBQTtDQUNBO0VBQ0EsSUFBQSxZQUFBO0dBQ0EsZ0JBQUE7R0FDQSxjQUFBLEtBQUEsT0FBQSxNQUFBLE9BQUE7R0FDQSxXQUFBLE9BQUEsU0FBQTtHQUNBLFVBQUEsT0FBQSxTQUFBOzs7O0VBSUEsSUFBQSxZQUFBLE1BQUE7RUFDQSxJQUFBLFVBQUEsR0FBQSxHQUFBLEtBQUEsU0FBQSxPQUFBLEtBQUEsU0FBQTs7RUFFQSxJQUFBLFFBQUEsTUFBQTtFQUNBLElBQUEsWUFBQSxNQUFBOzs7RUFHQSxLQUFBLElBQUEsRUFBQSxHQUFBLEtBQUEsT0FBQSxvQkFBQTtFQUNBO0dBQ0EsS0FBQSxJQUFBLEVBQUEsR0FBQSxLQUFBLE9BQUEsb0JBQUE7R0FDQTtJQUNBLElBQUEsSUFBQSxJQUFBLE9BQUE7O0lBRUEsU0FBQSxHQUFBLE9BQUEsU0FBQSxHQUFBLEtBQUEsU0FBQSxPQUFBLE9BQUEsU0FBQSxHQUFBLFdBQUE7O0lBRUEsSUFBQSxLQUFBLE9BQUE7S0FDQSxTQUFBLEdBQUEsT0FBQSxTQUFBLEdBQUEsS0FBQSxTQUFBLE9BQUEsT0FBQSxTQUFBLEdBQUEsV0FBQTs7O0dBR0EsSUFBQSxPQUFBLElBQUEsT0FBQTtHQUNBLElBQUEsT0FBQSxPQUFBLFNBQUE7OztHQUdBLFNBQUEsTUFBQSxXQUFBLE1BQUEsS0FBQSxTQUFBLFVBQUEsV0FBQTtHQUNBLFNBQUEsTUFBQSxXQUFBLE1BQUEsVUFBQSxXQUFBOztHQUVBLElBQUEsS0FBQSxPQUFBO0dBQ0E7SUFDQSxPQUFBLE9BQUEsU0FBQTtJQUNBLFNBQUEsTUFBQSxHQUFBLE1BQUEsS0FBQSxTQUFBLFFBQUEsV0FBQTtJQUNBLFNBQUEsTUFBQSxVQUFBLE1BQUEsU0FBQSxXQUFBOzs7O0VBSUEsWUFBQSxlQUFBLFVBQUE7OztFQUdBLFNBQUEsR0FBQSxPQUFBLFFBQUEsS0FBQSxTQUFBLE9BQUEsT0FBQSxRQUFBLFdBQUE7OztFQUdBLFNBQUEsT0FBQSxRQUFBLEdBQUEsT0FBQSxRQUFBLEtBQUEsU0FBQSxRQUFBLFdBQUE7OztFQUdBLFVBQUEsS0FBQSxTQUFBLE1BQUEsR0FBQSxPQUFBLFFBQUEsR0FBQSxjQUFBLE9BQUEsUUFBQTtFQUNBLFVBQUEsR0FBQSxPQUFBLFFBQUEsS0FBQSxjQUFBLE9BQUEsUUFBQTtFQUNBLFVBQUEsT0FBQSxRQUFBLEdBQUEsQ0FBQSxJQUFBLGNBQUEsT0FBQSxRQUFBO0VBQ0EsVUFBQSxPQUFBLFFBQUEsS0FBQSxTQUFBLE9BQUEsR0FBQSxJQUFBLGNBQUEsT0FBQSxRQUFBOzs7RUFHQSxJQUFBLGFBQUEsR0FBQSxHQUFBLEdBQUEsR0FBQSxHQUFBOzs7OztDQUtBLFNBQUEsYUFBQSxHQUFBO0NBQ0E7RUFDQSxJQUFBLFVBQUEsSUFBQSxZQUFBO0VBQ0EsSUFBQSxXQUFBLFFBQUEsUUFBQTtFQUNBLFNBQUEsSUFBQSxXQUFBLEtBQUEsU0FBQSxTQUFBLElBQUEsV0FBQTs7Ozs7Q0FLQSxTQUFBLGFBQUEsR0FBQTtDQUNBOztFQUVBLElBQUEsVUFBQSxJQUFBLFlBQUE7RUFDQSxJQUFBLFdBQUEsUUFBQTs7RUFFQSxTQUFBLElBQUEsV0FBQSxLQUFBLFNBQUEsVUFBQSxJQUFBLFdBQUE7Ozs7Ozs7Ozs7OztDQVlBLFNBQUEsWUFBQSxlQUFBLFVBQUE7Q0FDQTtFQUNBLElBQUEsWUFBQSxZQUFBLFdBQUE7R0FDQSxhQUFBLGFBQUE7R0FDQSxhQUFBO0dBQ0EsY0FBQSxHQUFBLGNBQUE7R0FDQSxhQUFBLEdBQUEsYUFBQTtHQUNBLFlBQUE7O0VBRUEsSUFBQSxVQUFBLEtBQUEsYUFBQTtFQUNBLElBQUEsV0FBQSxPQUFBLFlBQUEsVUFBQTtHQUNBLGdCQUFBLFdBQUEsU0FBQTtFQUNBLElBQUE7R0FDQSxjQUFBOztFQUVBLElBQUEsT0FBQSxXQUFBO0dBQ0EsY0FBQTs7RUFFQSxJQUFBLE9BQUEsTUFBQTtFQUNBLElBQUEsWUFBQSxNQUFBO0VBQ0EsSUFBQSxZQUFBOzs7RUFHQSxhQUFBLFdBQUEsY0FBQTtFQUNBLEtBQUEsSUFBQSxFQUFBLEdBQUEsS0FBQSxPQUFBLG9CQUFBO0VBQ0E7O0dBRUEsSUFBQSxJQUFBLElBQUEsT0FBQTtHQUNBLGFBQUEsT0FBQSxTQUFBOzs7R0FHQSxjQUFBLENBQUEsSUFBQSxPQUFBLFVBQUEsUUFBQTtHQUNBLElBQUEsS0FBQTtJQUNBLFVBQUEsZUFBQSxhQUFBOztJQUVBLFVBQUE7O0dBRUEsSUFBQSxJQUFBLE9BQUEsc0JBQUEsYUFBQSxZQUFBO0lBQ0EsYUFBQSxjQUFBLFNBQUEsWUFBQSxZQUFBLFlBQUE7O0dBRUEsYUFBQSxPQUFBLFNBQUEsSUFBQTs7R0FFQSxJQUFBLGFBQUEsWUFBQTtJQUNBLGFBQUEsY0FBQSxJQUFBLFNBQUEsWUFBQSxZQUFBLFlBQUE7Ozs7RUFJQSxJQUFBLFlBQUE7RUFDQSxhQUFBLGFBQUE7RUFDQSxZQUFBLE9BQUEsUUFBQTs7RUFFQSxLQUFBLElBQUEsRUFBQSxHQUFBLEtBQUEsT0FBQSxvQkFBQTtFQUNBOztHQUVBLGNBQUEsQ0FBQSxJQUFBLE9BQUEsVUFBQSxRQUFBOzs7R0FHQSxJQUFBLElBQUEsSUFBQSxPQUFBO0dBQ0EsWUFBQSxPQUFBLFNBQUEsSUFBQTs7R0FFQSxJQUFBLGFBQUEsV0FBQTtJQUNBLGFBQUEsY0FBQSxhQUFBLFdBQUEsV0FBQSxZQUFBOzs7R0FHQSxZQUFBLE9BQUEsU0FBQSxJQUFBO0dBQ0EsSUFBQSxhQUFBLFdBQUE7SUFDQSxhQUFBLGNBQUEsSUFBQSxhQUFBLFdBQUEsV0FBQSxZQUFBOzs7Ozs7Q0FNQSxTQUFBLGNBQUEsU0FBQSxHQUFBLEdBQUEsT0FBQTtDQUNBO0VBQ0EsSUFBQSxTQUFBO0VBQ0E7R0FDQSxJQUFBLFNBQUEsU0FBQSxHQUFBO0dBQ0EsUUFBQTs7O0dBR0E7RUFDQSxPQUFBOzs7Ozs7Ozs7Ozs7Ozs7OztDQWlCQSxTQUFBLGVBQUEsS0FBQTtDQUNBO0VBQ0EsSUFBQSxRQUFBO0VBQ0EsSUFBQSxNQUFBOztFQUVBLFFBQUEsVUFBQSxLQUFBLE9BQUE7RUFDQSxJQUFBLE1BQUEsUUFBQTtHQUNBLE1BQUEsTUFBQTs7RUFFQSxJQUFBLE1BQUEsU0FBQSxNQUFBO0VBQ0E7R0FDQSxJQUFBLEtBQUEsSUFBQSxNQUFBLFNBQUE7SUFDQSxNQUFBLE1BQUEsUUFBQTs7R0FFQSxJQUFBLE1BQUEsUUFBQTtJQUNBLE9BQUEsTUFBQSxNQUFBOztFQUVBLE9BQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztDQXFCQSxTQUFBLFVBQUEsTUFBQSxXQUFBO0NBQ0E7RUFDQSxJQUFBLFFBQUEsSUFBQSxTQUFBO0dBQ0EsYUFBQSxJQUFBLGFBQUE7O0VBRUEsSUFBQSxXQUFBLGFBQUE7RUFDQSxJQUFBLFdBQUEsYUFBQTs7Ozs7Ozs7OztFQVVBLE1BQUEsUUFBQSxLQUFBLE1BQUEsYUFBQSxPQUFBO0VBQ0EsTUFBQSxRQUFBO0VBQ0EsVUFBQTtFQUNBLE9BQUE7OztDQUdBLFNBQUEsVUFBQTtDQUNBO0VBQ0EsSUFBQSxLQUFBLFVBQUE7R0FDQTs7RUFFQSxLQUFBLElBQUEsRUFBQSxHQUFBLEtBQUEsS0FBQSxPQUFBO0VBQ0E7R0FDQSxJQUFBLEtBQUEsUUFBQSxLQUFBLEtBQUEsS0FBQSxRQUFBLEtBQUE7R0FDQTtJQUNBLEtBQUEsU0FBQTtJQUNBLEtBQUEsU0FBQTtJQUNBLFVBQUE7Ozs7Ozs7Q0FPQSxTQUFBLG9CQUFBLE1BQUE7Q0FDQTtFQUNBLElBQUEsU0FBQTtFQUNBLE9BQUEsSUFBQSxPQUFBLE9BQUEsVUFBQSxPQUFBLFdBQUEsT0FBQTtFQUNBLE9BQUEsSUFBQSxDQUFBLE9BQUEsT0FBQSxVQUFBLE9BQUEsV0FBQSxPQUFBOztFQUVBLE9BQUE7OztDQUdBLFNBQUEsbUJBQUE7Q0FDQTtFQUNBLE9BQUEsUUFBQSxPQUFBLFVBQUEsT0FBQTs7O0NBR0EsU0FBQSxtQkFBQTtDQUNBO0VBQ0EsT0FBQSxRQUFBLE9BQUEsVUFBQSxPQUFBOzs7Ozs7Ozs7Ozs7OztDQWNBLFNBQUEsbUJBQUEsV0FBQSxPQUFBLGNBQUE7Q0FDQTtFQUNBLElBQUEsVUFBQTtFQUNBLElBQUEsa0JBQUE7O0VBRUEsSUFBQSxDQUFBO0dBQ0EsUUFBQSxNQUFBOzs7RUFHQSxJQUFBLGFBQUEsR0FBQSxHQUFBLEdBQUEsR0FBQSxHQUFBOztFQUVBLElBQUEsWUFBQSxvQkFBQSxVQUFBLEdBQUEsVUFBQTtFQUNBLElBQUEsU0FBQSxTQUFBO0dBQ0EsU0FBQSxTQUFBLElBQUEsVUFBQTs7OztFQUlBLElBQUEsWUFBQTtFQUNBLElBQUEsY0FBQTtFQUNBLElBQUEsWUFBQTtFQUNBLElBQUE7O0VBRUEsSUFBQSxJQUFBLFNBQUEsR0FBQSxTQUFBLEdBQUEsU0FBQSxHQUFBLEtBQUEsS0FBQSxHQUFBO0VBQ0EsSUFBQTtFQUNBLElBQUE7RUFDQSxJQUFBOzs7RUFHQSxJQUFBLEtBQUE7RUFDQSxHQUFBLElBQUEsQ0FBQSxVQUFBLEdBQUEsUUFBQSxPQUFBO0VBQ0EsR0FBQSxJQUFBLENBQUEsVUFBQSxHQUFBLFFBQUEsT0FBQTs7RUFFQSxJQUFBLE9BQUEsT0FBQSxNQUFBLEdBQUE7RUFDQSxJQUFBLEtBQUE7R0FDQSxPQUFBLGVBQUEsR0FBQSxHQUFBOztFQUVBLElBQUE7R0FDQSxRQUFBLE1BQUE7O0VBRUE7R0FDQSxJQUFBO0lBQ0EsUUFBQSxNQUFBLE9BQUEsT0FBQSxPQUFBLE1BQUEsR0FBQSxLQUFBOztJQUVBOzs7RUFHQSxJQUFBLFVBQUEsSUFBQSxZQUFBO0VBQ0EsSUFBQSxXQUFBLFFBQUEsUUFBQTs7O0VBR0EsSUFBQSxTQUFBLElBQUEsS0FBQSxTQUFBLFFBQUE7R0FDQSxJQUFBLFlBQUE7RUFDQSxJQUFBLFNBQUEsSUFBQTtHQUNBLElBQUEsWUFBQTtFQUNBLElBQUEsU0FBQSxJQUFBO0VBQ0E7R0FDQSxTQUFBLFNBQUEsSUFBQTtHQUNBLElBQUEsQ0FBQTtHQUNBO0lBQ0EsSUFBQSxTQUFBLElBQUEsS0FBQSxJQUFBO0lBQ0E7S0FDQSxJQUFBLFlBQUE7S0FDQSxVQUFBOzs7SUFHQTtLQUNBLElBQUEsWUFBQTtLQUNBLFVBQUE7Ozs7O0VBS0EsSUFBQSxZQUFBLE1BQUE7RUFDQSxJQUFBLFNBQUEsT0FBQSxRQUFBOzs7Ozs7Q0FNQSxTQUFBLFlBQUE7Q0FDQTtFQUNBLElBQUEsU0FBQTs7RUFFQSxJQUFBLE9BQUE7R0FDQSxPQUFBOztFQUVBLE9BQUEsTUFBQTtFQUNBO0dBQ0E7R0FDQSxNQUFBLEtBQUEsTUFBQSxNQUFBOzs7RUFHQSxPQUFBOzs7O0FDbnBDQTs7Ozs7Ozs7OztBQVVBLFFBQUEsT0FBQSxXQUFBOztDQUVBLFVBQUEsV0FBQSxXQUFBOztDQUVBLE9BQUE7RUFDQSxVQUFBO0VBQ0EsTUFBQSxTQUFBLE9BQUEsU0FBQSxPQUFBOzs7OztHQUtBLFNBQUE7R0FDQTtJQUNBLFFBQUEsSUFBQSxjQUFBOzs7OztHQUtBLE1BQUEsSUFBQSxTQUFBLFlBQUE7OztJQUdBLFFBQUEsSUFBQSxjQUFBOzs7SUFHQSxXQUFBLFdBQUE7S0FDQSxRQUFBLElBQUEsTUFBQSxDQUFBLFdBQUEsUUFBQSxLQUFBLFFBQUEsSUFBQTtPQUNBOzs7Ozs7Ozs7OztDQVdBLFVBQUEsaUJBQUEsV0FBQTs7Q0FFQSxPQUFBO0VBQ0EsVUFBQTs7RUFFQSxNQUFBLFNBQUEsT0FBQSxTQUFBLE9BQUE7R0FDQSxJQUFBLE1BQUE7SUFDQSxNQUFBLE1BQUE7Ozs7O0FDdERBOzs7Ozs7Ozs7Ozs7Ozs7O0FBZ0JBLFFBQUEsT0FBQSxzQkFBQTs7Q0FFQSxVQUFBLDBDQUFBLFNBQUEsUUFBQSxVQUFBOzs7O0NBSUEsU0FBQSxNQUFBLE9BQUEsU0FBQTtDQUNBO0VBQ0EsT0FBQSxVQUFBLE1BQUEsaUJBQUEsV0FBQTtHQUNBLFNBQUEsV0FBQTtJQUNBLFFBQUEsUUFBQSxTQUFBLEdBQUEsWUFBQTs7Ozs7Ozs7Q0FRQSxPQUFBO0VBQ0EsVUFBQTtFQUNBLE1BQUE7OztBQ3BDQTs7Ozs7QUFLQSxRQUFBLE9BQUEsY0FBQTs7Q0FFQSxVQUFBLDRCQUFBLFNBQUEsV0FBQTs7Q0FFQSxJQUFBOzs7Q0FHQSxJQUFBLFdBQUE7RUFDQSxXQUFBO0VBQ0EsV0FBQTs7OztDQUlBLElBQUE7RUFDQTtHQUNBO0lBQ0E7SUFDQTtHQUNBOztHQUVBO0lBQ0E7O0NBRUEsSUFBQTtJQUNBO0lBQ0E7R0FDQTs7R0FFQTtJQUNBO0lBQ0E7R0FDQTtFQUNBOzs7Q0FHQSxJQUFBO0VBQ0E7R0FDQTtHQUNBO0VBQ0E7Ozs7O0NBS0EsU0FBQSxLQUFBLE9BQUEsU0FBQTtDQUNBO0VBQ0EsT0FBQTs7RUFFQSxNQUFBLFdBQUEsRUFBQSxPQUFBLElBQUEsVUFBQSxNQUFBOzs7RUFHQSxNQUFBLFlBQUE7O0VBRUEsSUFBQSxPQUFBLFdBQUEsTUFBQSxNQUFBO0VBQ0EsUUFBQSxLQUFBO0VBQ0EsTUFBQSxTQUFBLFFBQUEsUUFBQSxRQUFBLFdBQUE7Ozs7RUFJQSxNQUFBLE9BQUEsZ0JBQUE7RUFDQSxhQUFBLE1BQUE7O0VBRUEsU0FBQTtFQUNBLGFBQUEsTUFBQTs7Ozs7O0NBTUEsU0FBQSxXQUFBO0NBQ0E7RUFDQSxJQUFBLE9BQUE7O0VBRUEsRUFBQSxLQUFBLE9BQUEsU0FBQSxLQUFBLEtBQUE7R0FDQSxRQUFBLGdCQUFBLGNBQUE7SUFDQSxNQUFBLElBQUE7SUFDQSxNQUFBLElBQUE7SUFDQSxPQUFBOzs7O0VBSUEsUUFBQTs7RUFFQSxPQUFBOzs7Ozs7Q0FNQSxTQUFBLGdCQUFBLFVBQUE7Q0FDQTtFQUNBLElBQUEsV0FBQTs7RUFFQSxJQUFBLFdBQUEsU0FBQSxRQUFBLFVBQUEsU0FBQSxLQUFBLE9BQUE7R0FDQSxPQUFBLEtBQUE7OztFQUdBLE9BQUE7Ozs7OztDQU1BLFNBQUEsU0FBQTtDQUNBO0VBQ0EsSUFBQSxNQUFBLFVBQUE7O0VBRUEsSUFBQSxNQUFBLFFBQUEsUUFBQSxJQUFBLGVBQUE7RUFDQSxJQUFBLFNBQUEsUUFBQSxRQUFBLElBQUEsZUFBQTtFQUNBLElBQUEsUUFBQSxRQUFBLFFBQUEsSUFBQSxlQUFBOztFQUVBLElBQUEsU0FBQSxJQUFBLGVBQUE7RUFDQSxJQUFBLEtBQUEsT0FBQTtFQUNBLElBQUEsS0FBQSxPQUFBOztFQUVBLElBQUEsSUFBQSxTQUFBLEtBQUE7RUFDQSxPQUFBLElBQUEsU0FBQSxLQUFBO0VBQ0EsTUFBQSxJQUFBLFVBQUEsS0FBQTs7Ozs7O0NBTUEsU0FBQSxhQUFBO0NBQ0E7RUFDQSxJQUFBLE9BQUEsVUFBQSxHQUFBLGVBQUE7RUFDQSxLQUFBLFdBQUEsQ0FBQSxLQUFBLGNBQUE7OztFQUdBLEdBQUEsSUFBQTtHQUNBLFdBQUEsZ0JBQUEsS0FBQSxXQUFBO0dBQ0EscUJBQUEsZ0JBQUEsS0FBQSxXQUFBO0dBQ0Esa0JBQUEsZ0JBQUEsS0FBQSxXQUFBO0dBQ0EsaUJBQUEsZ0JBQUEsS0FBQSxXQUFBOzs7Ozs7O0NBT0EsU0FBQTtDQUNBO0VBQ0EsS0FBQSxPQUFBLEdBQUEsY0FBQTtFQUNBLEtBQUEsT0FBQSxHQUFBLGNBQUE7O0VBRUEsSUFBQSxRQUFBLEtBQUEsT0FBQSxHQUFBLHVCQUFBO0VBQ0EsUUFBQSxRQUFBLE9BQUEsR0FBQSxTQUFBOzs7Ozs7Ozs7O0NBVUEsU0FBQSxTQUFBLFFBQUEsUUFBQTtDQUNBO0VBQ0EsSUFBQSxXQUFBLFVBQUEsQ0FBQTtHQUNBOzs7RUFHQSxNQUFBLE9BQUEsSUFBQTtHQUNBLFdBQUE7R0FDQSxxQkFBQTtHQUNBLGtCQUFBO0dBQ0EsaUJBQUE7OztFQUdBLE1BQUEsbUJBQUEsV0FBQSxXQUFBLE1BQUEsU0FBQTs7Ozs7O0NBTUEsU0FBQTtDQUNBOztFQUVBLEtBQUEsT0FBQSxJQUFBO0dBQ0EsV0FBQSxnQkFBQSxLQUFBLFdBQUE7R0FDQSxxQkFBQSxnQkFBQSxLQUFBLFdBQUE7R0FDQSxrQkFBQSxnQkFBQSxLQUFBLFdBQUE7R0FDQSxpQkFBQSxnQkFBQSxLQUFBLFdBQUE7OztFQUdBLEtBQUEsT0FBQSxXQUFBO0dBQ0EsS0FBQSxNQUFBLFNBQUE7OztFQUdBLGFBQUEsS0FBQTs7Ozs7O0NBTUEsU0FBQTtDQUNBO0VBQ0EsYUFBQSxLQUFBOzs7Ozs7Q0FNQSxTQUFBLFVBQUE7Q0FDQTtFQUNBLElBQUEsTUFBQSxDQUFBO0VBQ0EsSUFBQSxPQUFBLEdBQUE7RUFDQSxPQUFBLE1BQUE7R0FDQTtHQUNBLE9BQUEsS0FBQTs7O0VBR0EsSUFBQSxNQUFBLEtBQUEsTUFBQSxNQUFBLEtBQUE7RUFDQSxPQUFBOzs7Ozs7Ozs7O0NBVUEsU0FBQTtDQUNBOztFQUVBLElBQUEsS0FBQSxjQUFBO0dBQ0E7O0VBRUEsSUFBQSxLQUFBLGNBQUE7RUFDQTtHQUNBLGFBQUEsS0FBQTtHQUNBLEtBQUEsWUFBQTs7T0FFQSxJQUFBLEtBQUEsY0FBQTtHQUNBOzs7Ozs7Q0FNQSxTQUFBO0NBQ0E7Ozs7RUFJQSxJQUFBLEtBQUEsY0FBQTtHQUNBOztFQUVBLElBQUEsS0FBQSxjQUFBO0dBQ0E7Ozs7OztDQU1BLFNBQUE7Q0FDQTs7RUFFQSxLQUFBLFVBQUEsV0FBQSxXQUFBLENBQUEsWUFBQSxLQUFBLFNBQUE7RUFDQSxLQUFBLFlBQUE7Ozs7OztDQU1BLFNBQUE7Q0FDQTtFQUNBLEtBQUEsWUFBQTtFQUNBOzs7Ozs7Q0FNQSxTQUFBO0NBQ0E7Ozs7RUFJQTtHQUNBLEtBQUEsWUFBQTs7R0FFQTs7Ozs7OztDQU9BLE9BQUE7RUFDQSxVQUFBO0VBQ0EsT0FBQTtHQUNBLFNBQUE7R0FDQSxPQUFBOzs7RUFHQSxNQUFBOzs7QUFHQSIsImZpbGUiOiJhcHAubWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xyXG5cclxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbi8vIERlY2xhcmUgYXBwIGxldmVsIG1vZHVsZSB3aGljaCBkZXBlbmRzIG9uIHZpZXdzLCBhbmQgY29tcG9uZW50c1xyXG4vLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuYW5ndWxhci5tb2R1bGUoJ2dyYWRlcycsIFtcclxuXHQvLyBBbmd1bGFyIG9wdGlvbmFsXHJcblx0J25nUm91dGUnLFxyXG5cdCduZ0FuaW1hdGUnLFxyXG5cclxuXHQvLyAzcmQgUGFydHlcclxuXHQndWkuYm9vdHN0cmFwJyxcclxuXHQnY2ZwLmhvdGtleXMnLFxyXG5cdCduZ01kSWNvbnMnLFxyXG5cdCd1aS5zY3JvbGxUb1RvcFdoZW4nLFxyXG5cclxuXHQvLyBNaW5lOiBHZW5lcmljXHJcblx0J3B1YnN1Yi1zZXJ2aWNlJyxcclxuXHQnbWF0aEpheCcsXHJcblx0J3NsaWRlck1lbnUnLFxyXG5cdCdrYkJvb3RzdHJhcCcsXHJcblx0J2tiR3JhcGgnLFxyXG5cclxuXHQvLyBNaW5lOiBTZW1pLXJldXNhYmxlXHJcblx0J3N0YXRlLXNlcnZpY2UnLFxyXG5cdCdhY3Rpb24tc2VydmljZScsXHRcdC8vIENsb3VkIHNhdmVcclxuXHJcblx0Ly8gTWluZTogUHJvamVjdC1zcGVjaWZpY1xyXG5cdCdwcm9ibGVtVHlwZScsXHJcblx0J2NvbW0tc2VydmljZScsXHJcblx0J2tiLmZpbHRlckJhcicsXHJcblx0J3BhcnRpYWxzJyxcdFx0XHRcdC8vIFwiQ29tcGlsZWRcIiB0ZW1wbGF0ZXNcclxuXSlcclxuXHJcbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4vLyBSb3V0ZSBsaXN0XHJcbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4uY29uZmlnKGZ1bmN0aW9uKCRyb3V0ZVByb3ZpZGVyLCAkbG9jYXRpb25Qcm92aWRlcikge1xyXG5cclxuXHQkbG9jYXRpb25Qcm92aWRlci5odG1sNU1vZGUodHJ1ZSk7XHJcblxyXG5cdC8vIFJvdXRpbmcgVGFibGVcclxuXHQkcm91dGVQcm92aWRlci53aGVuKCcvY2hhbmdlJywge1xyXG5cdFx0dGVtcGxhdGVVcmw6ICdDaGFuZ2UvY2hhbmdlLmh0bWwnLFxyXG5cdFx0Y29udHJvbGxlcjogJ0NoYW5nZUN0cmwnLFxyXG5cdFx0Y29udHJvbGxlckFzOiAnY2hhbmdlJ1xyXG5cdH0pO1xyXG5cclxuXHQvLyBSb3V0aW5nIFRhYmxlXHJcblx0JHJvdXRlUHJvdmlkZXIud2hlbignL2dyYXBoLzp0eXBlJywge1xyXG5cdFx0dGVtcGxhdGVVcmw6ICdHcmFwaC9ncmFwaC5odG1sJyxcclxuXHRcdGNvbnRyb2xsZXI6ICdHcmFwaEN0cmwnLFxyXG5cdFx0Y29udHJvbGxlckFzOiAnZ3JhcGgnXHJcblx0fSk7XHJcblxyXG5cdC8vIERlZmF1bHRcclxuXHQkcm91dGVQcm92aWRlci5vdGhlcndpc2Uoe3JlZGlyZWN0VG86ICcvZ3JhcGgvMSd9KTtcclxufSlcclxuXHJcbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4vLyBEaXNhYmxlIHNhbml0aXphdGlvbi4gV2UnbGwgdGFrZSBjYXJlIG9mIGl0IG9uIHRoZSBiYWNrIGVuZFxyXG4vLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuLmNvbmZpZyhmdW5jdGlvbigkc2NlUHJvdmlkZXIpIHtcclxuICAgICRzY2VQcm92aWRlci5lbmFibGVkKGZhbHNlKTtcclxufSlcclxuXHJcbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4vLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuLmNvbmZpZyhmdW5jdGlvbigkaHR0cFByb3ZpZGVyKSB7XHJcblx0JGh0dHBQcm92aWRlci5kZWZhdWx0cy53aXRoQ3JlZGVudGlhbHMgPSB0cnVlO1xyXG59KVxyXG5cclxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbi8vIFRoaXMgaXMgYSBoYWNrIHRvIGFkZCB0aGUgYWJpbGl0eSB0byBjaGFuZ2Ugcm91dGVzXHJcbi8vIHdpdGhvdXQgcmVsb2FkaW5nIHRoZSBjb250cm9sbGVyLlxyXG4vL1xyXG4vLyAkbG9jYXRpb24ucGF0aCBub3cgYWNjZXB0cyBhIHNlY29uZCBwYXJhbWV0ZXIuXHJcbi8vIElmIGZhbHNlLCBpdCB3aWxsIGNoYW5nZSB0aGUgVVJMIHdpdGhvdXQgcmVyb3V0aW5nLlxyXG4vLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuLnJ1bihbJyRyb3V0ZScsICckcm9vdFNjb3BlJywgJyRsb2NhdGlvbicsIGZ1bmN0aW9uICgkcm91dGUsICRyb290U2NvcGUsICRsb2NhdGlvbikge1xyXG4gICAgdmFyIG9yaWdpbmFsID0gJGxvY2F0aW9uLnBhdGg7XHJcbiAgICAkbG9jYXRpb24ucGF0aCA9IGZ1bmN0aW9uIChwYXRoLCByZWxvYWQpIHtcclxuICAgICAgICBpZiAocmVsb2FkID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICB2YXIgbGFzdFJvdXRlID0gJHJvdXRlLmN1cnJlbnQ7XHJcbiAgICAgICAgICAgIHZhciB1biA9ICRyb290U2NvcGUuJG9uKCckbG9jYXRpb25DaGFuZ2VTdWNjZXNzJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgJHJvdXRlLmN1cnJlbnQgPSBsYXN0Um91dGU7XHJcbiAgICAgICAgICAgICAgICB1bigpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG9yaWdpbmFsLmFwcGx5KCRsb2NhdGlvbiwgW3BhdGhdKTtcclxuICAgIH07XHJcbn1dKTsiLCIndXNlIHN0cmljdCc7XHJcblxyXG4vLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuLy8gTWFpbnRhaW5zIGFuIG9yZGVyZWQgbGlzdCBvZiBhY3Rpb25zIHRoYXQgdGFrZSBwbGFjZSBvbiBhIG1vZGVsLiBUaGlzIGFsbG93c1xyXG4vLyBwZXJzaXN0ZW5jZSAoc2F2aW5nKSBhbmQgdW5kbywgYW5kIHBvc3NpYmx5IG1vcmUuXHJcbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5hbmd1bGFyLm1vZHVsZSgnYWN0aW9uLXNlcnZpY2UnLCBbJ3B1YnN1Yi1zZXJ2aWNlJ10pO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG4vLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuLy8gUkVTVCBjbGllbnQgYW5kIENvbW11bmljYXRpb25zIE1hbmFnZXIgbW9kdWxlXHJcbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5hbmd1bGFyLm1vZHVsZSgnY29tbS1zZXJ2aWNlJywgW10pO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG4vLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuLy8gUHJvYmxlbSBUeXBlIE1hbmFnZXIgLS0gQWxsb3dlcyBlYWNoIHByb2JsZW0gdHlwZSB0byBoYW5kbGUgaXRzIG93biBkaXNwbGF5XHJcbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5hbmd1bGFyLm1vZHVsZSgncHJvYmxlbVR5cGUnLCBbXSk7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4vLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuYW5ndWxhci5tb2R1bGUoJ2dyYWRlcycpXHJcblxyXG4uY29udHJvbGxlcignQ2hhbmdlQ3RybCcsIGZ1bmN0aW9uKFByb2JsZW1zLCBTdGF0ZSwgUHViU3ViLCAkc2NvcGUpIHtcclxuXHJcblx0dmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuXHRzZWxmLnByb2JsZW1zID0gUHJvYmxlbXMuZ2V0KCk7XHRcdC8vIE1haW50YWluIGEgY29weSBvZiB0aGUgbW9kZWxcclxuXHJcblx0aW5pdE1ldGFEYXRhKCk7XHJcblx0aW5pdE1vZGVsKCk7XHJcblxyXG5cdC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vXHJcblx0Ly89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0c2VsZi5maWx0ZXJRcyA9IGZ1bmN0aW9uKHN0YXR1cylcclxuXHR7XHJcblx0XHRyZXR1cm4gKFN0YXRlLmdldCgncGVuZEZpbHRlcicpICYmICFzdGF0dXMpO1xyXG5cdH1cclxuXHJcblx0Ly89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0c2VsZi5zZXRQb2ludHMgPSBmdW5jdGlvbihwcm9iLCBpc1ZhbGlkKVxyXG5cdHtcclxuXHRcdGlmICghaXNWYWxpZClcclxuXHRcdFx0cmV0dXJuO1xyXG5cclxuXHRcdHZhciBvbGRQZW5kID0gcHJvYi5zaG93UGVuZDtcclxuXHJcblx0XHRwcm9iID0gUHJvYmxlbXMuc2V0UG9pbnRzKHByb2IuaWQsIHByb2IucHRzKTtcclxuXHRcdGlmICghcHJvYilcclxuXHRcdFx0cmV0dXJuO1xyXG5cclxuXHRcdC8vIFVwZGF0ZSBzYW5kYm94XHJcblx0XHRwcm9iLnB0cyA9IHByb2Iuc2NvcmU7XHJcblx0XHRwcm9iLnNob3dQZW5kID0gb2xkUGVuZDtcclxuXHJcblx0XHQvLyBVcGRhdGUgaW50ZXJuYWwgbW9kZWxcclxuXHRcdHZhciBpZHggPSBwcm9iLmlkO1x0XHRcdC8vIFNsaWdodGx5IGlmZnkuIFRoaXMgaXMgYSBib2xkIGFzc3VtcHRpb24uXHJcblx0XHRzZWxmLnByb2JsZW1zW2lkeF0gPSBwcm9iO1x0Ly8gUHJvcCBpcyBhIGNsb25lIG9mIHNlbGYucHJvYmxlbXNbaWR4XSwgc28gd2UgaGF2ZSB0byB1cGRhdGUgaXQuIEl0IGZlZWxzIGxpa2Ugd2UgY291bGQgZW5kIHVwIHdpdGggYSBtZW1vcnkgbGVhayBoZXJlLlxyXG5cdH1cclxuXHJcblx0Ly89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0c2VsZi5nZXRJY29uID0gZnVuY3Rpb24ocHJvYilcclxuXHR7XHJcblx0XHQvLyBBbWF6aW5nbHksIHRoaXMgZ2V0cyBjYWxsZWQgNSB0aW1lcyBwZXIgcHJvYmxlbSBvbiBwYWdlIGluaXRcclxuXHRcdC8vIEl0J3MgY2FsbGVkIG9uY2UgcGVyIGNoYW5nZSBvciBibHVyLCBmb3IgZXZlcnkgc2luZ2xlIHByb2JsZW1cclxuXHRcdHZhciBtYXAgPSB7XHJcblx0XHRcdHBlbmRpbmc6ICdzY2hlZHVsZScsXHJcblx0XHRcdGNvcnJlY3Q6ICdjaGVja19jaXJjbGUnLFxyXG5cdFx0XHQnbmV3JzogJ3JhZGlvX2J1dHRvbl9vZmYnLFxyXG5cdFx0XHRpbmNvcnJlY3Q6ICdjYW5jZWwnLFxyXG5cclxuXHRcdFx0J2RlZmF1bHQnOiAnY2FuY2VsJ1xyXG5cdFx0fTtcclxuXHJcblx0XHRyZXR1cm4gbWFwW3Byb2Iuc3RhdHVzXSB8fCBtYXBbJ2RlZmF1bHQnXTtcclxuXHR9XHJcblxyXG5cdC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vIENvcHkgdGhlIHBvaW50IHZhbHVlIHRvIGEgc2FmZSBzY3JhdGNocGFkIGFyZWFcclxuXHQvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHRmdW5jdGlvbiBpbml0TW9kZWwoKVxyXG5cdHtcclxuXHRcdGZvciAodmFyIGkgPSAwLCBsZW4gPSBzZWxmLnByb2JsZW1zLmxlbmd0aDsgaSA8IGxlbjsgaSsrKVxyXG5cdFx0e1xyXG5cdFx0XHRzZWxmLnByb2JsZW1zW2ldLnB0cyA9IHNlbGYucHJvYmxlbXNbaV0uc2NvcmU7XHJcblx0XHRcdHNlbGYucHJvYmxlbXNbaV0uc2hvd1BlbmQgPSBzZWxmLnByb2JsZW1zW2ldLmlzUGVuZGluZztcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vXHJcblx0Ly89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0ZnVuY3Rpb24gaW5pdE1ldGFEYXRhKClcclxuXHR7XHJcblx0XHRzZWxmLm1vZGUgPSBQcm9ibGVtcy5tb2RlKCk7XHJcblxyXG5cdFx0aWYgKHNlbGYubW9kZSA9PT0gJ211bHRpUHJvYmxlbScpXHJcblx0XHR7XHJcblx0XHRcdHNlbGYudGl0bGUgPSBzZWxmLnByb2JsZW1zWzBdLnVuYW1lLmZpcnN0ICsgJyAnICsgc2VsZi5wcm9ibGVtc1swXS51bmFtZS5sYXN0ICsgJywgJyArIFByb2JsZW1zLnRpdGxlKCk7XHJcblx0XHR9XHJcblx0XHRlbHNlXHJcblx0XHR7XHJcblx0XHRcdHNlbGYudGl0bGUgPSBQcm9ibGVtcy50aXRsZSgpICsgJywgUXVlc3Rpb24gJyArIHNlbGYucHJvYmxlbXNbMF0ucU51bTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG59KTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbi8vIE1vbml0b3JzIGZvciBlcnJvciBjb25kaXRpb25zLCBhbmQgZGlzcGxheXMgdGhlIGFwcHJvcHJpYXRlIHdhcm5pbmcgYW5kIGVycm9yIG1lc3NhZ2VzLlxyXG4vL1xyXG4vLyBDb25kaXRpb25zIG9mdGVuIGhhdmUgYSBSZXRyeSBhYmlsaXR5LCB3aGljaCBuZWVkcyB0byBiZSBjb21tdW5pY2F0ZWQgb3IgcmVnaXN0ZXJlZCBvbiBlcnJvci5cclxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbmFuZ3VsYXIubW9kdWxlKCdrYi5maWx0ZXJCYXInLCBbXSlcclxuXHJcbi5jb25zdGFudCgna2JGaWx0ZXJCYXInLCB7XHJcblx0cGF0aDogJ0dyYXBoLydcclxufSlcclxuXHJcbi5kaXJlY3RpdmUoJ2ZpbHRlckJhcicsIGZ1bmN0aW9uKGtiRmlsdGVyQmFyKSB7XHJcblxyXG5cdHJldHVybiB7XHJcblx0XHRyZXN0cmljdDogJ0UnLFxyXG5cdFx0c2NvcGU6IHtcclxuXHRcdFx0bW9kZWw6ICc9bmdNb2RlbCcsXHJcblx0XHRcdHR5cGU6ICdAJyxcclxuXHRcdFx0aGVhZGVyOiAnQCcsXHJcblxyXG5cdFx0XHRtb2RlbDI6ICc9bmdNb2RlbDInLFxyXG5cdFx0XHR0eXBlMjogJ0AnLFxyXG5cdFx0XHRoZWFkZXIyOiAnQCcsXHJcblxyXG5cdFx0XHRvcHRpb25zOiAnPScsXHJcblxyXG4vL1x0XHRcdGN1cmZpbHRlcjE6ICc9JyxcclxuXHRcdFx0Y3VyZmlsdGVyMjogJz0nLFxyXG5cdFx0fSxcclxuXHRcdGNvbnRyb2xsZXI6ICdGaWx0ZXJCYXJDdHJsIGFzIGN0cmwnLFxyXG5cdFx0YmluZFRvOiB0cnVlLFxyXG5cdFx0cmVwbGFjZTogdHJ1ZSxcclxuXHRcdHRlbXBsYXRlVXJsOiBrYkZpbHRlckJhci5wYXRoICsgJ2ZpbHRlci1iYXIuaHRtbCcsXHJcblxyXG4vKlxyXG5cdFx0cmVzb2x2ZToge1xyXG5cdFx0XHRpZDogZnVuY3Rpb24oKSB7cmV0dXJuIGFzc2lnbi5pZH0sXHRcdC8vIFRvIGtlZXAgdHJhY2sgb2Ygd2hhdCB3ZSdyZSBlZGl0aW5nXHJcblx0XHRcdGFzc2lnbmVkOiBmdW5jdGlvbigpIHtyZXR1cm4gYXNzaWduLmFzc2lnbmVkfSxcclxuXHRcdFx0ZHVlOiBmdW5jdGlvbigpIHtyZXR1cm4gYXNzaWduLmR1ZX0sXHJcblx0XHRcdHN0dWRlbnRzOiBmdW5jdGlvbigpIHtyZXR1cm4gc3R1ZGVudHN9LFxyXG5cdFx0fVxyXG4qL1xyXG5cclxuXHR9O1xyXG59KVxyXG5cclxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbi5jb250cm9sbGVyKCdGaWx0ZXJCYXJDdHJsJywgZnVuY3Rpb24oUHViU3ViLCAkc2NvcGUpIHtcclxuXHJcblx0dmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuXHQvLyBCYWQhXHJcbi8vXHRzZWxmLmN1cmZpbHRlcjEgPSAkc2NvcGUuY3VyZmlsdGVyMTtcclxuXHRzZWxmLmN1cmZpbHRlcjIgPSAkc2NvcGUuY3VyZmlsdGVyMjtcclxuXHJcblx0Ly89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0c2VsZi5zZXRGaWx0ZXIxID0gZnVuY3Rpb24oKVxyXG5cdHtcclxuXHRcdFB1YlN1Yi5wdWJsaXNoKCdmaWx0ZXIxJywgc2VsZi5jdXJmaWx0ZXIxKTtcclxuXHR9XHJcblxyXG5cdC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdHNlbGYuc2V0RmlsdGVyMiA9IGZ1bmN0aW9uKClcclxuXHR7XHJcblx0XHRQdWJTdWIucHVibGlzaCgnZmlsdGVyMicsIHNlbGYuY3VyZmlsdGVyMik7XHJcblx0fVxyXG5cclxufSk7IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5hbmd1bGFyLm1vZHVsZSgnZ3JhZGVzJylcclxuXHJcbi5jb250cm9sbGVyKCdHcmFwaEN0cmwnLCBmdW5jdGlvbigkbG9jYXRpb24sICRyb3V0ZVBhcmFtcywgJHNjb3BlLCBQdWJTdWIpIHtcclxuXHJcblx0dmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuLypcclxuXHRBc3NpZ25tZW50c1xyXG5cdC1Bc3NpZ25tZW50cyBPdmVydmlld1xyXG5cdC1Bc3NpZ25tZW50IERldGFpbHMgKGZvcm1lcmx5IExpc3QpXHJcblx0LUNsYXNzIERldGFpbHNcclxuXHQtUHJvYmxlbXMgUGVyIEFzc2lnbm1lbnRcclxuXHQtUHJvYmxlbXMgUGVyIFN0dWRlbnRcclxuXHQtQXNzaWdubWVudCBJbnRlcnZlbnRpb24gKHRoaXMgd291bGQgYmUgdGhlIHByZXNldCBmaWx0ZXJzIHRoYXQgd2UndmUgdGFsa2VkIGFib3V0IGluIGVhcmxpZXIgbWVldGluZ3MpXHJcblxyXG5cdFN0YW5kYXJkc1xyXG5cdC1TdGFuZGFyZHMgT3ZlcnZpZXdcclxuXHQtU3RhbmRhcmQgRGV0YWlsc1xyXG5cdC1DbGFzcyBEZXRhaWxzXHJcblx0LVByb2JsZW1zIFBlciBTdGFuZGFyZFxyXG5cdC1Qcm9ibGVtcyBQZXIgU3R1ZGVudFxyXG5cdC1TdGFuZGFyZHMgSW50ZXJ2ZW50aW9uICh0aGlzIHdvdWxkIGJlIHRoZSBwcmVzZXQgZmlsdGVycyB0aGF0IHdlJ3ZlIHRhbGtlZCBhYm91dCBpbiBlYXJsaWVyIG1lZXRpbmdzKVxyXG4qL1xyXG5cdHNlbGYucmVwb3J0cyA9IFtcclxuLypcclxuXHRcdHtpZDogMCwgdGl0bGU6IFwiUGVyZm9ybWFuY2VcIiwgb3B0aW9uczogW1xyXG5cdFx0XHR7aWQ6ICdwZXJvdicsIHRleHQ6IFwiT3ZlcnZpZXdcIiwgdGVtcGxhdGU6IFwiU3R1ZGVudFN1bW1hcnkuaHRtbFwiLCBmaWx0ZXI6IHtzZWN0aW9uOiB0cnVlfSwgaW5zdHJ1Y3Rpb25zOiBcIkNsaWNrIGEgc3R1ZGVudCB0byB2aWV3IGRldGFpbHMuXCJ9LFxyXG5cdFx0XHR7aWQ6ICdwZXJ0cicsIHRleHQ6IFwiVHJlbmRcIiwgZmlsdGVyOiB7Y29tcGFyZTogdHJ1ZX0sIHRlbXBsYXRlOiBcIlN0dWRlbnRUcmVuZC5odG1sXCJ9LFxyXG5cdFx0XHR7aWQ6ICdzdGR0JywgdGV4dDogXCJTdHVkZW50IERldGFpbHNcIiwgbm9GaWx0ZXJzOiB0cnVlLCBzdHVkZW50U2VsZWN0OiB0cnVlLCB0ZW1wbGF0ZTogXCJTdHVkZW50RGV0YWlscy5odG1sXCIsIGluc3RydWN0aW9uczpcIkNsaWNrIGFuIGFzc2lnbm1lbnQgdHlwZSBvciBzdGFuZGFyZCB0byB2aWV3IG1hdGNoaW5nIGFzc2lnbm1lbnRzLlwifSxcclxuXHRcdF19LFxyXG4qL1xyXG5cdFx0e2lkOiAxLCB0aXRsZTogXCJBc3NpZ25tZW50c1wiLCBvcHRpb25zOiBbXHJcbi8qXHJcblx0XHRcdHtpZDogJ3Blcm92JywgdGV4dDogXCJPdmVydmlld1wiLCB0ZW1wbGF0ZTogXCJTdHVkZW50U3VtbWFyeS5odG1sXCIsIGZpbHRlcjoge3NlY3Rpb246IHRydWV9LCBpbnN0cnVjdGlvbnM6IFwiQ2xpY2sgYSBzdHVkZW50IHRvIHZpZXcgZGV0YWlscy5cIn0sXHJcblx0XHRcdHtpZDogJ2FzcGUnLCB0ZXh0OiBcIlBlbmRpbmdcIiwgaWNvbjogJ2dseXBoaWNvbi1hbGVydCcsIG5vRmlsdGVyczogdHJ1ZSwgdGVtcGxhdGU6IFwiUGVuZGluZy5odG1sXCIsIGluc3RydWN0aW9uczogXCJDbGljayBhbiBhc3NpZ25tZW50IHRvIHNldCBvciBhZGp1c3QgZ3JhZGVzIGFuZCB2aWV3IHN0dWRlbnQgc3VibWlzc2lvbnMuXCJ9LFxyXG5cdFx0XHR7aWQ6ICdhc2xpJywgdGV4dDogXCJBc3NpZ25tZW50IExpc3RcIiwgdGVtcGxhdGU6IFwiQXNzaWduTGlzdC5odG1sXCIsIGZpbHRlcjoge2NvbXBhcmU6IHRydWV9LCBpbnN0cnVjdGlvbnM6IFwiQ2xpY2sgYW4gYXNzaWdubWVudCB0byB2aWV3IHN0dWRlbnQgc2NvcmVzLlwifSxcclxuXHRcdFx0e2lkOiAnYXNjbHMnLCB0ZXh0OiBcIkNsYXNzIFNjb3Jlc1wiLCB0ZW1wbGF0ZTogXCJBc3NpZ25DbGFzcy5odG1sXCIsIGZpbHRlcjoge3NlY3Rpb246IHRydWV9LCBpbnN0cnVjdGlvbnM6IFwiQ2xpY2sgYSBzdHVkZW50IHRvIHNlZSB0aGVpciBzdWJtaXNzaW9ucyBhbmQgbW9kaWZ5IHRoZWlyIHNjb3Jlcy5cIn0sXHJcblx0XHRcdHtpZDogJ2Fzc3RzJywgdGV4dDogXCJTdHVkZW50IFNjb3Jlc1wiLCB0ZW1wbGF0ZTogXCJBc3NpZ25TdHVkZW50cy5odG1sXCIsIGZpbHRlcjoge3NlY3Rpb246IGZhbHNlfSwgaW5zdHJ1Y3Rpb25zOiBcIkNsaWNrIGFuIGFzc2lnbm1lbnQgdG8gc2VlIHN1Ym1pc3Npb25zIGFuZCBtb2RpZnkgc2NvcmVzLlwifSxcclxuXHRcdFx0e2lkOiAnYXNtcycsIHRleHQ6IFwiTWlzc2luZyBhc3NpZ25tZW50c1wiLCB0ZW1wbGF0ZTogXCJBc3NpZ25NaXNzaW5nLmh0bWxcIiwgZmlsdGVyOiB7c2VjdGlvbjogdHJ1ZX0sIGluc3RydWN0aW9uczogXCJDbGljayBhIHN0dWRlbnQgdG8gdmlldyBkZXRhaWxzLlwifSxcclxuKi9cclxuXHRcdFx0e2lkOiAncGVyb3YnLCB0ZXh0OiBcIk92ZXJ2aWV3XCIsIHRlbXBsYXRlOiBcIkFzc2lnbk92ZXJ2aWV3Lmh0bWxcIiwgZmlsdGVyOiB7c2VjdGlvbjogZmFsc2UsIG5vVHlwZTogdHJ1ZSwgY29tcGFyZTogdHJ1ZX0sIGluc3RydWN0aW9uczogXCJDbGljayBhIGJhciB0byB2aWV3IG1hdGNoaW5nIGFzc2lnbm1lbnRzLlwifSxcclxuLy9cdFx0XHR7aWQ6ICdhc2xpYScsIHRleHQ6IFwiTGlzdFwiLCB0ZW1wbGF0ZTogXCJBc3NpZ25MaXN0Lmh0bWxcIiwgZmlsdGVyOiB7Y29tcGFyZTogdHJ1ZX0sIGluc3RydWN0aW9uczogXCJDbGljayBhbiBhc3NpZ25tZW50IHRvIHZpZXcgc3R1ZGVudCBzY29yZXMuXCJ9LFxyXG5cdFx0XHR7aWQ6ICdhc2xpYicsIHRleHQ6IFwiQXNzaWdubWVudCBMaXN0XCIsIHRlbXBsYXRlOiBcIkFzc2lnbkNhdGVnb3J5Lmh0bWxcIiwgZmlsdGVyOiB7Y29tcGFyZTogdHJ1ZSwgbm9UeXBlOiB0cnVlfSwgaW5zdHJ1Y3Rpb25zOiBcIlwifSxcclxuXHRcdFx0e2lkOiAnYXNjbHMnLCB0ZXh0OiBcIlN0dWRlbnQgTGlzdFwiLCB0ZW1wbGF0ZTogXCJBc3NpZ25DbGFzcy5odG1sXCIsIGZpbHRlcjoge3NlY3Rpb246IHRydWV9LCBpbnN0cnVjdGlvbnM6IFwiXCJ9LFxyXG4vL1x0XHRcdHtpZDogJ2Fzc3RkJywgdGV4dDogXCJTdGFuZGFyZCBMaXN0XCIsIHRlbXBsYXRlOiBcIkFzc2lnblN0YW5kYXJkcy5odG1sXCIsIGZpbHRlcjoge2NvbXBhcmU6IHRydWUsIG5vVHlwZTogdHJ1ZX0sIGluc3RydWN0aW9uczogXCJcIn0sXHJcblx0XHRcdHtpZDogJ2FzcHJvYicsIHRleHQ6IFwiUHJvYmxlbSBMaXN0XCIsIHRlbXBsYXRlOiBcIkFzc2lnblByb2JsZW1zLmh0bWxcIiwgZmlsdGVyOiB7bm9TdGFuZGFyZDogdHJ1ZX0sIGluc3RydWN0aW9uczogXCJcIn0sXHJcblx0XHRdfSxcclxuXHRcdHtpZDogMiwgdGl0bGU6IFwiU3RhbmRhcmRzXCIsIG9wdGlvbnM6IFtcclxuXHRcdFx0e2lkOiAnc3Rkb3YnLCB0ZXh0OiBcIk92ZXJ2aWV3XCIsIHRlbXBsYXRlOiBcIlN0YW5kYXJkT3ZlcnZpZXcuaHRtbFwiLCBmaWx0ZXI6IHtub1N0YW5kYXJkOiB0cnVlLCBjb21wYXJlOiB0cnVlfSwgaW5zdHJ1Y3Rpb25zOiBcIkNsaWNrIGEgc3RhbmRhcmQgdG8gdmlldyBkb21haW4uXCJ9LFxyXG4vL1x0XHRcdHtpZDogJ3N0ZGRldGEnLCB0ZXh0OiBcIkJ5IERvbWFpbiAoQSlcIiwgdGVtcGxhdGU6IFwiU3RhbmRhcmREZXRhaWwuaHRtbFwiLCBmaWx0ZXI6IHtub1N0YW5kYXJkOiB0cnVlLCBjb21wYXJlOiB0cnVlfSwgaW5zdHJ1Y3Rpb25zOiBcIkNsaWNrIGEgc3RhbmRhcmQgdG8gdmlldyBzdGFuZGFyZCBwZXJmb3JtYW5jZS5cIn0sXHJcblx0XHRcdHtpZDogJ3N0ZGRldCcsIHRleHQ6IFwiU3RhbmRhcmQgTGlzdFwiLCB0ZW1wbGF0ZTogXCJTdGFuZGFyZERldGFpbEIuaHRtbFwiLCBmaWx0ZXI6IHtub1N0YW5kYXJkOiB0cnVlLCBjb21wYXJlOiB0cnVlfSwgaW5zdHJ1Y3Rpb25zOiBcIlwifSxcclxuXHRcdFx0e2lkOiAnc3RkY2xzJywgdGV4dDogXCJTdHVkZW50IExpc3RcIiwgdGVtcGxhdGU6IFwiU3RhbmRhcmRDbGFzcy5odG1sXCIsIGZpbHRlcjoge3NlY3Rpb246IHRydWV9LCBpbnN0cnVjdGlvbnM6IFwiXCJ9LFxyXG4vL1x0XHRcdHtpZDogJ3N0ZHByb2InLCB0ZXh0OiBcIlByb2JsZW1zIEJ5IFN0YW5kYXJkXCIsIHRlbXBsYXRlOiBcIlByb2JsZW1zQnlTdGFuZGFyZC5odG1sXCIsIGZpbHRlcjoge25vU3RhbmRhcmQ6IHRydWV9LCBpbnN0cnVjdGlvbnM6IFwiXCJ9LFxyXG5cdFx0XHR7aWQ6ICdwcm9icGcnLCB0ZXh0OiBcIlByb2JsZW0gTGlzdFwiLCB0ZW1wbGF0ZTogXCJQcm9ibGVtRXhwbG9yZXIuaHRtbFwiLCBmaWx0ZXI6IHtub1N0YW5kYXJkOiB0cnVlfSwgaW5zdHJ1Y3Rpb25zOiBcIlwifSxcclxuXHJcbi8qXHJcblx0XHRcdHtpZDogJ3N0ZGNvJywgdGV4dDogXCJQZXJmb3JtYW5jZVwiLCBub0ZpbHRlcnM6IHRydWUsIHRlbXBsYXRlOiAnU3RkQ292ZXJhZ2UuaHRtbCcsIGluc3RydWN0aW9uczogXCJDbGljayBhIHN0YW5kYXJkIHRvIHNob3cgbWF0Y2hpbmcgYXNzaWdubWVudHMuXCJ9LFxyXG5cdFx0XHR7aWQ6ICdpbnN0ZCcsIHRleHQ6IFwiSW50ZXJ2ZW50aW9uXCIsIHRlbXBsYXRlOiBcIkludGVyU3RhbmRhcmRzLmh0bWxcIiwgaW5zdHJ1Y3Rpb25zOiBcIkNsaWNrIG9uIGEgc3RhbmRhcmQgdG8gdmlldyBtYXRjaGluZyBhc3NpZ25tZW50cy5cIn0sXHJcbiovXHJcblx0XHRdfSxcclxuLypcclxuXHRcdHtpZDogNCwgdGl0bGU6IFwiSW50ZXJ2ZW50aW9uXCIsIG9wdGlvbnM6IFtcclxuXHRcdFx0e2lkOiAnaW5zdHUnLCB0ZXh0OiBcIlN0dWRlbnRzXCIsIG5vRmlsdGVyczogdHJ1ZSwgdGVtcGxhdGU6IFwiSW50ZXJTdHVkZW50cy5odG1sXCIsIGluc3RydWN0aW9uczogXCJDbGljayBhIHN0dWRlbnQgbmFtZSB0byB2aWV3IGRldGFpbHMuXCJ9LFxyXG5cdFx0XHR7aWQ6ICdpbmFzJywgdGV4dDogXCJBc3NpZ25tZW50c1wiLCBub0ZpbHRlcnM6IHRydWUsIHRlbXBsYXRlOiBcIkludGVyQXNzaWducy5odG1sXCIsIGluc3RydWN0aW9uczogXCJDbGljayBhbiBhc3NpZ25tZW50IHRvIHZpZXcgc3R1ZGVudCBzY29yZXMuXCJ9LFxyXG5cdFx0XX0sXHJcbiovXHJcblxyXG5cdFx0e2lkOiA1LCB0aXRsZTogXCJTdHVkZW50IFJlcG9ydHNcIiwgb3B0aW9uczogW1xyXG5cdFx0XHR7aWQ6ICdzdGR0JywgdGV4dDogXCJPdmVydmlld1wiLCBub0ZpbHRlcnM6IHRydWUsIHN0dWRlbnRTZWxlY3Q6IHRydWUsIHRlbXBsYXRlOiBcIlN0dWRlbnREZXRhaWxzLmh0bWxcIiwgaW5zdHJ1Y3Rpb25zOlwiQ2xpY2sgYW4gYXNzaWdubWVudCB0eXBlIG9yIHN0YW5kYXJkIHRvIHZpZXcgbWF0Y2hpbmcgYXNzaWdubWVudHMuXCJ9LFxyXG5cdFx0XX0sXHJcblxyXG5cdF07XHJcblxyXG5cclxuXHRzZWxmLmFzc2lnbjEgPSBbXHJcblx0XHR7bmFtZTogJ0NyYXksIENhdGh5JywgZ3JhZGU6IDgxLCBtaXNzaW5nOiAxfSxcclxuXHRcdHtuYW1lOiAnTWNHZWUsIEJ1YmJhJywgZ3JhZGU6ICdYJywgbWlzc2luZzogNn0sXHJcblx0XHR7bmFtZTogJ1NtaXRoLCBBbGV4JywgZ3JhZGU6IDU5LCBtaXNzaW5nOiAzfSxcclxuXHRcdHtuYW1lOiAnVGhvbXBzb24sIEFsaWNlJywgZ3JhZGU6IDY4LCBtaXNzaW5nOiAxMn0sXHJcblx0XHR7bmFtZTogJ1dpbGxpYW1zLCBXZW5keScsIGdyYWRlOiA5NCwgbWlzc2luZzogMH1cclxuXHRdO1xyXG5cclxuXHRzZWxmLnByb2JsZW1TdHVkZW50cyA9IFtcclxuXHRcdHtuYW1lOiAnTWNHZWUsIEJ1YmJhJywgZ3JhZGU6IDc4LCBtaXNzaW5nOiA2LCBodzogNjksIHF1aXo6IDgxLCB0ZXN0OiA3Nn0sXHJcblx0XHR7bmFtZTogJ1NtaXRoLCBBbGV4JywgZ3JhZGU6IDU5LCBtaXNzaW5nOiAzLCBzdGRzOiAnQS1SRUkuMywgRi1MRS4xYywgTi1STi4yJywgaHc6IDE3LCBxdWl6OiA3MywgdGVzdDogNTB9LFxyXG5cdFx0e25hbWU6ICdUaG9tcHNvbiwgQWxpY2UnLCBncmFkZTogNjgsIG1pc3Npbmc6IDEyLCBzdGRzOiAnQS1SRUkuMScsIGh3OiA3NSwgcXVpejogNzMsIHRlc3Q6IDcwfSxcclxuXHRdO1xyXG5cclxuXHRzZWxmLnByb2JsZW1TdGFuZGFyZHMgPSBbXHJcblx0XHR7bmFtZTogJ0EtUkVJLjEnLCBncmFkZTogNDh9LFxyXG5cdFx0e25hbWU6ICdBLVJFSS4zJywgZ3JhZGU6IDYyfSxcclxuXHRdO1xyXG5cclxuXHRzZWxmLnByb2JsZW1Bc3NpZ25zID0gW1xyXG5cdFx0e25hbWU6ICcxLjEgV3JpdGluZyBhbmQgVHJhbnNsYXRpbmcgQWxnZWJyYWljIEV4cHJlc3Npb25zJywgZ3JhZGU6IDY4fSxcclxuXHRcdHtuYW1lOiAnMS44IFNjaWVudGlmaWMgTm90YXRpb24sIFNpZ25pZmljYW50IERpZ2l0cywgUHJlY2lzaW9uLCBhbmQgQWNjdXJhY3knLCBncmFkZTogNDd9LFxyXG5cdF07XHJcblxyXG5cdHNlbGYuYXNzaWdubWVudHMgPSBbXHJcblx0XHR7dHlwZTogJ0hvbWV3b3JrJywgbmFtZTogJzEuMSBXcml0aW5nIGFuZCBUcmFuc2xhdGluZyBBbGdlYnJhaWMgRXhwcmVzc2lvbnMnLCBncmFkZTogY2FsY1BlcmNlbnQoMTUvMjApLCBzdHVkZW50OiA3MSwgZHVlOiAnNC8yLzE1JywgY29ycmVjdDogMTUsIG1pc3NlZDogNSwgYmFyOiBnZXRCYXIoNyksIGVwZjogWzIsIDYsIDVdLCBwbHVyOiBbcGx1cmFsKDIpLCBwbHVyYWwoNiksIHBsdXJhbCg1KV19LFxyXG5cdFx0e3R5cGU6ICdIb21ld29yaycsIG5hbWU6ICcxLjIgVHJhbnNsYXRpbmcgYW5kIFdyaXRpbmcgRm9ybXVsYXMnLCBncmFkZTogY2FsY1BlcmNlbnQoMjUvMzApLCBzdHVkZW50OiA5MywgZHVlOiAnNC80LzE1JywgcGVuZGluZzogdHJ1ZSwgY29ycmVjdDogMjUsIG1pc3NlZDogNSwgYmFyOiBnZXRCYXIoMSksIGVwZjogWzUsIDMsIDVdLCBwbHVyOiBbcGx1cmFsKDUpLCBwbHVyYWwoMyksIHBsdXJhbCg1KV19LFxyXG5cdFx0e3R5cGU6ICdUZXN0JywgbmFtZTogJzEuMyBTaW1wbGUgQWxnZWJyYWljIEluZXF1YWxpdGllcycsIGdyYWRlOiBjYWxjUGVyY2VudCgyMC8yMSksIHN0dWRlbnQ6IDg5LCBkdWU6ICc0LzYvMTUnLCBjb3JyZWN0OiAyMCwgbWlzc2VkOiAxLCBiYXI6IGdldEJhcig2KSwgZXBmOlsxMSwgMSwgMV0sIHBsdXI6IFtwbHVyYWwoMTEpLCBwbHVyYWwoMSksIHBsdXJhbCgxKV19LFxyXG5cdFx0e3R5cGU6ICdIb21ld29yaycsIG5hbWU6ICcxLjQgRXZhbHVhdGluZyBBbGdlYnJhaWMgRXhwcmVzc2lvbnMgYW5kIEZvcm11bGFzJywgZ3JhZGU6IGNhbGNQZXJjZW50KDEyLzE5KSwgc3R1ZGVudDogODQsIGR1ZTogJzQvOC8xNScsIHBlbmRpbmc6IHRydWUsIGNvcnJlY3Q6IDEyLCBtaXNzZWQ6IDcsIGJhcjogZ2V0QmFyKDUpLCBlcGY6IFsxLCA2LCA2XSwgcGx1cjogW3BsdXJhbCgxKSwgcGx1cmFsKDYpLCBwbHVyYWwoNildfSxcclxuXHRcdHt0eXBlOiAnSG9tZXdvcmsnLCBuYW1lOiAnMS41IEFsZ2VicmFpYyBQcm9wZXJ0aWVzJywgZ3JhZGU6IGNhbGNQZXJjZW50KDUvNiksIHN0dWRlbnQ6IDc2LCBkdWU6ICc0LzEwLzE1JywgY29ycmVjdDogNSwgbWlzc2VkOiAxLCBiYXI6IGdldEJhcigxKSwgZXBmOiBbNSwgMywgNV0sIHBsdXI6IFtwbHVyYWwoNSksIHBsdXJhbCgzKSwgcGx1cmFsKDUpXX0sXHJcblx0XHR7dHlwZTogJ1F1aXonLCBuYW1lOiAnMS42IEV4cG9uZW50cycsIGdyYWRlOiBjYWxjUGVyY2VudCgxNy8xOSksIHN0dWRlbnQ6ICdYJywgZHVlOiAnNC8xMi8xNScsIGNvcnJlY3Q6IDE3LCBtaXNzZWQ6IDIsIGJhcjogZ2V0QmFyKDIpLCBlcGY6IFs4LCAyLCAzXSwgcGx1cjogW3BsdXJhbCg4KSwgcGx1cmFsKDIpLCBwbHVyYWwoMyldfSxcclxuXHRcdHt0eXBlOiAnSG9tZXdvcmsnLCBuYW1lOiAnMS43IFJvb3RzIGFuZCBSYWRpY2FscycsIGdyYWRlOiBjYWxjUGVyY2VudCgzMS8zNSksIHN0dWRlbnQ6IDQ3LCBkdWU6ICc0LzE0LzE1JywgY29ycmVjdDogMzEsIG1pc3NlZDogNCwgYmFyOiBnZXRCYXIoMiksIGVwZjogWzgsIDIsIDNdLCBwbHVyOiBbcGx1cmFsKDgpLCBwbHVyYWwoMiksIHBsdXJhbCgzKV19LFxyXG5cdFx0e3R5cGU6ICdIb21ld29yaycsIG5hbWU6ICcxLjggU2NpZW50aWZpYyBOb3RhdGlvbiwgU2lnbmlmaWNhbnQgRGlnaXRzLCBQcmVjaXNpb24sIGFuZCBBY2N1cmFjeScsIGdyYWRlOiBjYWxjUGVyY2VudCgxMS8xMiksIHN0dWRlbnQ6IDUzLCBkdWU6ICc0LzE2LzE1JywgY29ycmVjdDogMTEsIG1pc3NlZDogMTIsIGJhcjogZ2V0QmFyKDMpLCBlcGY6IFsxMCwgMSwgMl0sIHBsdXI6IFtwbHVyYWwoMTApLCBwbHVyYWwoMSksIHBsdXJhbCgyKV19LFxyXG5cdF07XHJcblxyXG5cdHNlbGYucHJvYmxlbXMgPSBbXHJcblx0XHR7dGV4dDogXCIxKSBXaGF0IGlzIHlvdXIgbmFtZT9cIiwgcGVuZGluZzogZmFsc2UsIGdyYWRlOiA4MCwgYXNzaWduOiAxLCBlcGY6IFsxNywgMTYsIDE3XSwgZXhjZWw6IFtcIkFiaWdhaWwgSGlyYW5vXCIsIFwiTGVtdWVsIEFtb3JpbVwiLCBcIkFsdGhhIENhdmluc1wiLCBcIlNoYXJvbmRhIE1vbmdvbGRcIiwgXCJDZWxlc3RpbmEgT2tlZWZlXCIsIFwiQmx5dGhlIFdhcmVcIiwgXCJDaWVycmEgQnVpZVwiLCBcIk1hcmlldHRlIEdhcm91dHRlXCIsIFwiQ2xpZmYgRmFybGVzc1wiLCBcIkNocmlzdGFsIER1cnJhbmNlXCIsIFwiSGVybWFuIFphaG5cIiwgXCJXaW5mb3JkIEJlY25lbFwiLCBcIklzYXVyYSBHb3NzZXR0XCIsIFwiU2hvc2hhbmEgQnJhemllclwiLCBcIkFyZGVsbCBPcnRcIiwgXCJCZXRoZWwgV2VpbGVyXCIsIFwiR2lsbWEgS2lkbmV5XCIsXSwgXHJcblx0XHRwYXNzOiBbXCJLZWVseSBIYXJ0ZXJcIiwgXCJNaWNoZWxsIER1bmtlbGJlcmdlclwiLCBcIk1lcmlzc2EgS3JvbVwiLCBcIlNlZW1hIE1jQWRhbXNcIiwgXCJLaW1iZXJsZXkgSGVpbG1hbm5cIixcIkFkcmllbm5lIE1jTWF0aFwiLCBcIkRvbWluaWNrIEhhcmJlclwiLCBcIkphbmV0dCBTb2xsZXlcIiwgXCJCZXYgRGlsbG93XCIsIFwiUmFuZWUgTWNLaXNzaWNrXCIsIFwiWW9rbyBPdHRcIiwgXCJXaWxsaWFtcyBTaGlmbGV0dFwiLCBcIkRvbiBQYWV6XCIsIFwiRGVpZHJhIFN0b2tlbHlcIiwgXCJKdW5nIFBldHJvdmljaFwiLCBcIkxhdW5hIEh5bGVyXCIsXSwgXHJcblx0XHRmYWlsOiBbXCJFaWxlbmUgVHJpcG9saVwiLCBcIkhlcm1pbGEgVmFsZXJpdXNcIiwgXCJSb2RlcmljayBDaGlsZHJlc3NcIiwgXCJMaWdpYSBQZXBlXCIsIFwiTWVsaWEgQ3VycmllXCIsIFwiSnVsaWUgQ2lyY2xlXCIsIFwiVm9ubmllIFJ5YmFcIiwgXCJMaWxsaSBGaWdlcm9hXCIsIFwiQ2xhcmljZSBSYWNvXCIsIFwiR2VvcmdldHRlIE1hcnRpbmV6XCIsIFwiTGFrZW55YSBLaW5sYXdcIiwgXCJDZWNpbGUgU3Ryb2htXCIsIFwiTG9uaSBLb3plbFwiLCBcIlNhbmp1YW5hIEZhaXNvblwiLCBcIlR5c29uIE1heWh1ZVwiLCBcIk1hZGllIEhvbGRyZW5cIiwgXCJMeW5ldHRhIE1hcmNlbGlub1wiLF1cclxuXHRcdH0sXHJcblx0XHR7dGV4dDogXCIyKSBXaGF0IGlzIHlvdXIgcXVlc3Q/XCIsIHBlbmRpbmc6IGZhbHNlLCBncmFkZTogNzUsIGFzc2lnbjogMCwgZXBmOiBbMTAsIDIwLCAyMF0sIGV4Y2VsOiBbXCJBYmlnYWlsIEhpcmFub1wiLCBcIkxlbXVlbCBBbW9yaW1cIiwgXCJBbHRoYSBDYXZpbnNcIiwgXCJTaGFyb25kYSBNb25nb2xkXCIsIFwiQ2VsZXN0aW5hIE9rZWVmZVwiLCBcIkJseXRoZSBXYXJlXCIsIFwiQ2llcnJhIEJ1aWVcIiwgXCJNYXJpZXR0ZSBHYXJvdXR0ZVwiLCBcIkNsaWZmIEZhcmxlc3NcIiwgXCJDaHJpc3RhbCBEdXJyYW5jZVwiLF0sIFxyXG5cdFx0cGFzczogW1wiS2VlbHkgSGFydGVyXCIsIFwiTWljaGVsbCBEdW5rZWxiZXJnZXJcIiwgXCJNZXJpc3NhIEtyb21cIiwgXCJTZWVtYSBNY0FkYW1zXCIsIFwiS2ltYmVybGV5IEhlaWxtYW5uXCIsXCJBZHJpZW5uZSBNY01hdGhcIiwgXCJEb21pbmljayBIYXJiZXJcIiwgXCJKYW5ldHQgU29sbGV5XCIsIFwiQmV2IERpbGxvd1wiLCBcIlJhbmVlIE1jS2lzc2lja1wiLCBcIllva28gT3R0XCIsIFwiV2lsbGlhbXMgU2hpZmxldHRcIiwgXCJEb24gUGFlelwiLCBcIkRlaWRyYSBTdG9rZWx5XCIsIFwiSnVuZyBQZXRyb3ZpY2hcIiwgXCJMYXVuYSBIeWxlclwiLCBcIkhlcm1hbiBaYWhuXCIsIFwiV2luZm9yZCBCZWNuZWxcIiwgXCJJc2F1cmEgR29zc2V0dFwiLCBcIlNob3NoYW5hIEJyYXppZXJcIixdLCBcclxuXHRcdGZhaWw6IFtcIkVpbGVuZSBUcmlwb2xpXCIsIFwiSGVybWlsYSBWYWxlcml1c1wiLCBcIlJvZGVyaWNrIENoaWxkcmVzc1wiLCBcIkxpZ2lhIFBlcGVcIiwgXCJNZWxpYSBDdXJyaWVcIiwgXCJKdWxpZSBDaXJjbGVcIiwgXCJWb25uaWUgUnliYVwiLCBcIkxpbGxpIEZpZ2Vyb2FcIiwgXCJDbGFyaWNlIFJhY29cIiwgXCJHZW9yZ2V0dGUgTWFydGluZXpcIiwgXCJMYWtlbnlhIEtpbmxhd1wiLCBcIkNlY2lsZSBTdHJvaG1cIiwgXCJMb25pIEtvemVsXCIsIFwiU2FuanVhbmEgRmFpc29uXCIsIFwiVHlzb24gTWF5aHVlXCIsIFwiTWFkaWUgSG9sZHJlblwiLCBcIkx5bmV0dGEgTWFyY2VsaW5vXCIsIFwiQXJkZWxsIE9ydFwiLCBcIkJldGhlbCBXZWlsZXJcIiwgXCJHaWxtYSBLaWRuZXlcIixdXHJcblx0XHR9LFxyXG5cdFx0e3RleHQ6IFwiMykgV2hhdCBpcyB5b3VyIGZhdm9yaXRlIGNvbG9yP1wiLCBwZW5kaW5nOiBmYWxzZSwgZ3JhZGU6IDc5LCBhc3NpZ246IDEsIGVwZjogWzE3LCAxNiwgMTddLCBleGNlbDogW1wiQWJpZ2FpbCBIaXJhbm9cIiwgXCJMZW11ZWwgQW1vcmltXCIsIFwiQWx0aGEgQ2F2aW5zXCIsIFwiU2hhcm9uZGEgTW9uZ29sZFwiLCBcIkNlbGVzdGluYSBPa2VlZmVcIiwgXCJCbHl0aGUgV2FyZVwiLCBcIkNpZXJyYSBCdWllXCIsIFwiTWFyaWV0dGUgR2Fyb3V0dGVcIiwgXCJDbGlmZiBGYXJsZXNzXCIsIFwiQ2hyaXN0YWwgRHVycmFuY2VcIiwgXCJIZXJtYW4gWmFoblwiLCBcIldpbmZvcmQgQmVjbmVsXCIsIFwiSXNhdXJhIEdvc3NldHRcIiwgXCJTaG9zaGFuYSBCcmF6aWVyXCIsIFwiQXJkZWxsIE9ydFwiLCBcIkJldGhlbCBXZWlsZXJcIiwgXCJHaWxtYSBLaWRuZXlcIixdLFxyXG5cdFx0IHBhc3M6IFtcIktlZWx5IEhhcnRlclwiLCBcIk1pY2hlbGwgRHVua2VsYmVyZ2VyXCIsIFwiTWVyaXNzYSBLcm9tXCIsIFwiU2VlbWEgTWNBZGFtc1wiLCBcIktpbWJlcmxleSBIZWlsbWFublwiLFwiQWRyaWVubmUgTWNNYXRoXCIsIFwiRG9taW5pY2sgSGFyYmVyXCIsIFwiSmFuZXR0IFNvbGxleVwiLCBcIkJldiBEaWxsb3dcIiwgXCJSYW5lZSBNY0tpc3NpY2tcIiwgXCJZb2tvIE90dFwiLCBcIldpbGxpYW1zIFNoaWZsZXR0XCIsIFwiRG9uIFBhZXpcIiwgXCJEZWlkcmEgU3Rva2VseVwiLCBcIkp1bmcgUGV0cm92aWNoXCIsIFwiTGF1bmEgSHlsZXJcIixdLCBcclxuXHRcdCBmYWlsOiBbXCJFaWxlbmUgVHJpcG9saVwiLCBcIkhlcm1pbGEgVmFsZXJpdXNcIiwgXCJSb2RlcmljayBDaGlsZHJlc3NcIiwgXCJMaWdpYSBQZXBlXCIsIFwiTWVsaWEgQ3VycmllXCIsIFwiSnVsaWUgQ2lyY2xlXCIsIFwiVm9ubmllIFJ5YmFcIiwgXCJMaWxsaSBGaWdlcm9hXCIsIFwiQ2xhcmljZSBSYWNvXCIsIFwiR2VvcmdldHRlIE1hcnRpbmV6XCIsIFwiTGFrZW55YSBLaW5sYXdcIiwgXCJDZWNpbGUgU3Ryb2htXCIsIFwiTG9uaSBLb3plbFwiLCBcIlNhbmp1YW5hIEZhaXNvblwiLCBcIlR5c29uIE1heWh1ZVwiLCBcIk1hZGllIEhvbGRyZW5cIiwgXCJMeW5ldHRhIE1hcmNlbGlub1wiLF1cclxuXHRcdH0sXHJcblx0XHR7dGV4dDogXCI0KSBXaGF0IGlzIHRoZSBjYXBpdGFsIG9mIEFzc3lyaWE/XCIsIHBlbmRpbmc6IGZhbHNlLCBncmFkZTogOTEsIGFzc2lnbjogNywgZXBmOiBbNDAsIDUsIDVdLCBleGNlbDogW1wiQWJpZ2FpbCBIaXJhbm9cIiwgXCJMZW11ZWwgQW1vcmltXCIsIFwiQWx0aGEgQ2F2aW5zXCIsIFwiU2hhcm9uZGEgTW9uZ29sZFwiLCBcIkNlbGVzdGluYSBPa2VlZmVcIiwgXCJCbHl0aGUgV2FyZVwiLCBcIkNpZXJyYSBCdWllXCIsIFwiTWFyaWV0dGUgR2Fyb3V0dGVcIiwgXCJDbGlmZiBGYXJsZXNzXCIsIFwiQ2hyaXN0YWwgRHVycmFuY2VcIiwgXCJIZXJtYW4gWmFoblwiLCBcIldpbmZvcmQgQmVjbmVsXCIsIFwiSXNhdXJhIEdvc3NldHRcIiwgXCJTaG9zaGFuYSBCcmF6aWVyXCIsIFwiQXJkZWxsIE9ydFwiLCBcIkJldGhlbCBXZWlsZXJcIiwgXCJHaWxtYSBLaWRuZXlcIiwgXCJBZHJpZW5uZSBNY01hdGhcIiwgXCJEb21pbmljayBIYXJiZXJcIiwgXCJKYW5ldHQgU29sbGV5XCIsIFwiQmV2IERpbGxvd1wiLCBcIlJhbmVlIE1jS2lzc2lja1wiLCBcIllva28gT3R0XCIsIFwiV2lsbGlhbXMgU2hpZmxldHRcIiwgXCJEb24gUGFlelwiLCBcIkRlaWRyYSBTdG9rZWx5XCIsIFwiSnVuZyBQZXRyb3ZpY2hcIiwgXCJMYXVuYSBIeWxlclwiLCBcIkp1bGllIENpcmNsZVwiLCBcIlZvbm5pZSBSeWJhXCIsIFwiTGlsbGkgRmlnZXJvYVwiLCBcIkNsYXJpY2UgUmFjb1wiLCBcIkdlb3JnZXR0ZSBNYXJ0aW5lelwiLCBcIkxha2VueWEgS2lubGF3XCIsIFwiQ2VjaWxlIFN0cm9obVwiLCBcIkxvbmkgS296ZWxcIiwgXCJTYW5qdWFuYSBGYWlzb25cIiwgXCJUeXNvbiBNYXlodWVcIiwgXCJNYWRpZSBIb2xkcmVuXCIsIFwiTHluZXR0YSBNYXJjZWxpbm9cIixdLFxyXG5cdFx0IHBhc3M6IFtcIktlZWx5IEhhcnRlclwiLCBcIk1pY2hlbGwgRHVua2VsYmVyZ2VyXCIsIFwiTWVyaXNzYSBLcm9tXCIsIFwiU2VlbWEgTWNBZGFtc1wiLCBcIktpbWJlcmxleSBIZWlsbWFublwiLF0sIFxyXG5cdFx0IGZhaWw6IFtcIkVpbGVuZSBUcmlwb2xpXCIsIFwiSGVybWlsYSBWYWxlcml1c1wiLCBcIlJvZGVyaWNrIENoaWxkcmVzc1wiLCBcIkxpZ2lhIFBlcGVcIiwgXCJNZWxpYSBDdXJyaWVcIixdXHJcblx0XHR9LFxyXG5cdFx0e3RleHQ6IFwiNSkgV2hhdCBpcyB0aGUgYWlyLXNwZWVkIHZlbG9jaXR5IG9mIGFuIHVubGFkZW4gc3dhbGxvdz9cIiwgcGVuZGluZzogZmFsc2UsIGdyYWRlOiA2NCwgYXNzaWduOiAzLCBlcGY6IFs1LCAyMiwgMjNdLCBleGNlbDogW1wiQWJpZ2FpbCBIaXJhbm9cIiwgXCJMZW11ZWwgQW1vcmltXCIsIFwiQWx0aGEgQ2F2aW5zXCIsIFwiU2hhcm9uZGEgTW9uZ29sZFwiLCBcIkNlbGVzdGluYSBPa2VlZmVcIixdLFxyXG5cdFx0IHBhc3M6IFtcIktlZWx5IEhhcnRlclwiLCBcIk1pY2hlbGwgRHVua2VsYmVyZ2VyXCIsIFwiTWVyaXNzYSBLcm9tXCIsIFwiU2VlbWEgTWNBZGFtc1wiLCBcIktpbWJlcmxleSBIZWlsbWFublwiLFwiQWRyaWVubmUgTWNNYXRoXCIsIFwiRG9taW5pY2sgSGFyYmVyXCIsIFwiSmFuZXR0IFNvbGxleVwiLCBcIkJldiBEaWxsb3dcIiwgXCJSYW5lZSBNY0tpc3NpY2tcIiwgXCJZb2tvIE90dFwiLCBcIldpbGxpYW1zIFNoaWZsZXR0XCIsIFwiRG9uIFBhZXpcIiwgXCJEZWlkcmEgU3Rva2VseVwiLCBcIkp1bmcgUGV0cm92aWNoXCIsIFwiTGF1bmEgSHlsZXJcIiwgXCJCbHl0aGUgV2FyZVwiLCBcIkNpZXJyYSBCdWllXCIsIFwiTWFyaWV0dGUgR2Fyb3V0dGVcIiwgXCJDbGlmZiBGYXJsZXNzXCIsIFwiQ2hyaXN0YWwgRHVycmFuY2VcIiwgXCJIZXJtYW4gWmFoblwiLF0sIFxyXG5cdFx0IGZhaWw6IFtcIkVpbGVuZSBUcmlwb2xpXCIsIFwiSGVybWlsYSBWYWxlcml1c1wiLCBcIlJvZGVyaWNrIENoaWxkcmVzc1wiLCBcIkxpZ2lhIFBlcGVcIiwgXCJNZWxpYSBDdXJyaWVcIiwgXCJKdWxpZSBDaXJjbGVcIiwgXCJWb25uaWUgUnliYVwiLCBcIkxpbGxpIEZpZ2Vyb2FcIiwgXCJDbGFyaWNlIFJhY29cIiwgXCJHZW9yZ2V0dGUgTWFydGluZXpcIiwgXCJMYWtlbnlhIEtpbmxhd1wiLCBcIkNlY2lsZSBTdHJvaG1cIiwgXCJMb25pIEtvemVsXCIsIFwiU2FuanVhbmEgRmFpc29uXCIsIFwiVHlzb24gTWF5aHVlXCIsIFwiTWFkaWUgSG9sZHJlblwiLCBcIkx5bmV0dGEgTWFyY2VsaW5vXCIsIFwiV2luZm9yZCBCZWNuZWxcIiwgXCJJc2F1cmEgR29zc2V0dFwiLCBcIlNob3NoYW5hIEJyYXppZXJcIiwgXCJBcmRlbGwgT3J0XCIsIFwiQmV0aGVsIFdlaWxlclwiLCBcIkdpbG1hIEtpZG5leVwiLF1cclxuXHRcdH0sXHJcblx0XTtcclxuXHJcblx0c2VsZi5hc3NpZ25MaXN0ID0gXy5tYXAoc2VsZi5hc3NpZ25tZW50cywgZnVuY3Rpb24oZW50cnkpIHtyZXR1cm4gdHJ1bmNOYW1lKGVudHJ5Lm5hbWUpfSk7XHJcblx0c2VsZi5hc3NpZ25Ob0NhdGdlZ29yeSA9IF8uY2xvbmVEZWVwKHNlbGYuYXNzaWduTGlzdCk7XHJcblx0c2VsZi5hc3NpZ25MaXN0LnVuc2hpZnQoJ0FsbCBIb21ld29yaycsICdBbGwgUXVpenplcycsICdBbGwgVGVzdHMnLCAnQWxsIGktUHJhY3RpY2UnKTtcclxuXHRzZWxmLmN1ckFzc2lnbiA9IHNlbGYuYXNzaWduTm9DYXRnZWdvcnlbMF07XHJcblxyXG5cdHNlbGYuc3RhbmRhcmRzID0gW3tcImNvZGVcIjpcIkEtQVBSXCIsXCJuYW1lXCI6XCJBcml0aG1ldGljIHdpdGggUG9seW5vbWlhbHMgJiBSYXRpb25hbCBFeHByZXNzaW9uc1wiLFwiY2hpbGRyZW5cIjpbe1wiaWRcIjpcIjI1MThcIixcImNvZGVcIjpcIkEtQVBSIDFcIixcIm5hbWVcIjpcIkFwcGx5IG9wZXJhdGlvbnMgdG8gcG9seW5vbWlhbHMgYW5kIHVuZGVyc3RhbmQgY2xvc3VyZS5cIn0se1wiaWRcIjpcIjI1NzZcIixcImNvZGVcIjpcIkEtQVBSIDNcIixcIm5hbWVcIjpcIkZpbmQgemVyb2VzIG9mIGZhY3RvcmVkIHBvbHlub21pYWxzLlwifSx7XCJpZFwiOlwiMjU4MVwiLFwiY29kZVwiOlwiQS1BUFIgNlwiLFwibmFtZVwiOlwiUmV3cml0ZSByYXRpb25hbCBleHByZXNzaW9ucyB1c2luZyBpbnNwZWN0aW9uLCBsb25nIGRpdmlzaW9uLCBvciBhIGNvbXB1dGVyIGFsZ2VicmEgc3lzdGVtLlwifV19LHtcImNvZGVcIjpcIkEtQ0VEXCIsXCJuYW1lXCI6XCJDcmVhdGluZyBFcXVhdGlvbnNcIixcImNoaWxkcmVuXCI6W3tcImlkXCI6XCIyNTE5XCIsXCJjb2RlXCI6XCJBLUNFRCAxXCIsXCJuYW1lXCI6XCJTb2x2ZSBwcm9ibGVtcyBpbiBvbmUgdmFyaWFibGUgYnkgY3JlYXRpbmcgZXF1YXRpb25zXFwvaW5lcXVhbGl0aWVzLlwifSx7XCJpZFwiOlwiMjUyMFwiLFwiY29kZVwiOlwiQS1DRUQgMlwiLFwibmFtZVwiOlwiUmVwcmVzZW50IHJlbGF0aW9uc2hpcHMgYnkgY3JlYXRpbmcgYW5kIGdyYXBoaW5nIGVxdWF0aW9ucyBpbiB0d28gdmFyaWFibGVzLlwifSx7XCJpZFwiOlwiMjUyMVwiLFwiY29kZVwiOlwiQS1DRUQgM1wiLFwibmFtZVwiOlwiUmVwcmVzZW50IGFuZCBpbnRlcnByZXQgc29sdXRpb25zIG9mIHN5c3RlbXMgb2YgZXF1YXRpb25zXFwvaW5lcXVhbGl0aWVzLlwifSx7XCJpZFwiOlwiMjUyMlwiLFwiY29kZVwiOlwiQS1DRUQgNFwiLFwibmFtZVwiOlwiUmVhcnJhbmdlIGZvcm11bGFzIHVzaW5nIHRoZSBzYW1lIHJlYXNvbmluZyBhcyBzb2x2aW5nIGVxdWF0aW9ucy5cIn1dfSx7XCJjb2RlXCI6XCJBLVJFSVwiLFwibmFtZVwiOlwiUmVhc29uaW5nIHdpdGggRXF1YXRpb25zICYgSW5lcXVhbGl0aWVzXCIsXCJjaGlsZHJlblwiOlt7XCJpZFwiOlwiMjUyM1wiLFwiY29kZVwiOlwiQS1SRUkgMVwiLFwibmFtZVwiOlwiVXNlIGVxdWFsaXR5IG9mIG51bWJlcnMgdG8gZXhwbGFpbiBlYWNoIHN0ZXAgb2Ygc29sdmluZyBhbiBlcXVhdGlvbi5cIn0se1wiaWRcIjpcIjI1MjRcIixcImNvZGVcIjpcIkEtUkVJIDEwXCIsXCJuYW1lXCI6XCJVbmRlcnN0YW5kIHRoYXQgdGhlIGdyYXBoIG9mIGEgdHdvLXZhcmlhYmxlIGVxdWF0aW9uIGlzIHRoZSBzZXQgb2YgYWxsIGl0cyBzb2x1dGlvbnMuXCJ9LHtcImlkXCI6XCIyNTI1XCIsXCJjb2RlXCI6XCJBLVJFSSAxMVwiLFwibmFtZVwiOlwiRXhwbGFpbiB3aHkgdGhlIDxpPng8XFwvaT4tY29vcmRpbmF0ZXMgb2YgdGhlIHBvaW50cyBvZiBpbnRlcnNlY3Rpb24gb2YgPGk+eTxcXC9pPiA9IDxpPmY8XFwvaT4oPGk+eDxcXC9pPikgYW5kIDxpPnk8XFwvaT4gID0gPGk+ZzxcXC9pPig8aT54PFxcL2k+KSBhcmUgdGhlIHNvbHV0aW9ucyBvZiB0aGUgZXF1YXRpb24gPGk+ZjxcXC9pPig8aT54PFxcL2k+KSA9IDxpPmc8XFwvaT4oPGk+eDxcXC9pPikuXCJ9LHtcImlkXCI6XCIyNTI2XCIsXCJjb2RlXCI6XCJBLVJFSSAxMlwiLFwibmFtZVwiOlwiR3JhcGggdGhlIHNvbHV0aW9ucyB0byBhIGxpbmVhciBpbmVxdWFsaXR5IGluIHR3byB2YXJpYWJsZXMuXCJ9LHtcImlkXCI6XCIyNTI3XCIsXCJjb2RlXCI6XCJBLVJFSSAzXCIsXCJuYW1lXCI6XCJTb2x2ZSBsaW5lYXIgZXF1YXRpb25zXFwvaW5lcXVhbGl0aWVzIGluIG9uZSB2YXJpYWJsZS5cIn0se1wiaWRcIjpcIjI1MjhcIixcImNvZGVcIjpcIkEtUkVJIDRhXCIsXCJuYW1lXCI6XCJDb21wbGV0ZSB0aGUgc3F1YXJlIHRvIHJld3JpdGUgcXVhZHJhdGljIGZ1bmN0aW9ucyBpbiB2ZXJ0ZXggZm9ybSBhbmQgdG8gZGVyaXZlIHRoZSBxdWFkcmF0aWMgZm9ybXVsYS5cIn0se1wiaWRcIjpcIjI1MjlcIixcImNvZGVcIjpcIkEtUkVJIDRiXCIsXCJuYW1lXCI6XCJTb2x2ZSBxdWFkcmF0aWMgZXF1YXRpb25zIGluIG9uZSB2YXJpYWJsZS5cIn0se1wiaWRcIjpcIjI1MzBcIixcImNvZGVcIjpcIkEtUkVJIDVcIixcIm5hbWVcIjpcIlByb3ZlIHRoYXQgYXBwbHlpbmcgZWxpbWluYXRpb24gdG8gYSBzeXN0ZW0gb2YgZXF1YXRpb25zIGluIHR3byB2YXJpYWJsZXMgcHJvZHVjZXMgYSBzeXN0ZW0gd2l0aCB0aGUgc2FtZSBzb2x1dGlvbnMuXCJ9LHtcImlkXCI6XCIyNTMxXCIsXCJjb2RlXCI6XCJBLVJFSSA2XCIsXCJuYW1lXCI6XCJTb2x2ZSBzeXN0ZW1zIG9mIGxpbmVhciBlcXVhdGlvbnMgZXhhY3RseSBhbmRcXC9vciBhcHByb3hpbWF0ZWx5LlwifSx7XCJpZFwiOlwiMjUzMlwiLFwiY29kZVwiOlwiQS1SRUkgN1wiLFwibmFtZVwiOlwiQWxnZWJyYWljYWxseSBhbmQgZ3JhcGhpY2FsbHkgc29sdmUgc3lzdGVtcyBvZiBvbmUgbGluZWFyIGFuZCBvbmUgcXVhZHJhdGljIGVxdWF0aW9uLlwifV19LHtcImNvZGVcIjpcIkEtU1NFXCIsXCJuYW1lXCI6XCJTZWVpbmcgU3RydWN0dXJlIGluIEV4cHJlc3Npb25zXCIsXCJjaGlsZHJlblwiOlt7XCJpZFwiOlwiMjUzM1wiLFwiY29kZVwiOlwiQS1TU0UgMWFcIixcIm5hbWVcIjpcIkludGVycHJldCB0ZXJtcywgZmFjdG9ycywgYW5kIGNvZWZmaWNpZW50cyBvZiBhbiBleHByZXNzaW9uLlwifSx7XCJpZFwiOlwiMjUzNFwiLFwiY29kZVwiOlwiQS1TU0UgMWJcIixcIm5hbWVcIjpcIkludGVycHJldCBjb21wbGljYXRlZCBleHByZXNzaW9ucyBieSB2aWV3aW5nIHBhcnRzIGFzIG9uZSBvYmplY3QuXCJ9LHtcImlkXCI6XCIyNTM1XCIsXCJjb2RlXCI6XCJBLVNTRSAyXCIsXCJuYW1lXCI6XCJJZGVudGlmeSB3YXlzIHRvIHJld3JpdGUgZXhwcmVzc2lvbnMuXCJ9LHtcImlkXCI6XCIyNTM2XCIsXCJjb2RlXCI6XCJBLVNTRSAzYVwiLFwibmFtZVwiOlwiRmluZCB0aGUgemVyb3Mgb2YgYSBxdWFkcmF0aWMgZnVuY3Rpb24gYnkgZmFjdG9yaW5nLlwifSx7XCJpZFwiOlwiMjUzN1wiLFwiY29kZVwiOlwiQS1TU0UgM2JcIixcIm5hbWVcIjpcIkZpbmQgbWF4aW11bVxcL21pbmltdW0gdmFsdWVzIG9mIGEgcXVhZHJhdGljIGZ1bmN0aW9uIGJ5IGNvbXBsZXRpbmcgdGhlIHNxdWFyZS5cIn0se1wiaWRcIjpcIjI1MzhcIixcImNvZGVcIjpcIkEtU1NFIDNjXCIsXCJuYW1lXCI6XCJUcmFuc2Zvcm0gZXhwb25lbnRpYWwgZXhwcmVzc2lvbnMuXCJ9XX0se1wiY29kZVwiOlwiRi1CRlwiLFwibmFtZVwiOlwiQnVpbGRpbmcgRnVuY3Rpb25zXCIsXCJjaGlsZHJlblwiOlt7XCJpZFwiOlwiMjUzOVwiLFwiY29kZVwiOlwiRi1CRiAxYVwiLFwibmFtZVwiOlwiRGV0ZXJtaW5lIGFuIGV4cGxpY2l0IGV4cHJlc3Npb24gb3IgYSByZWN1cnNpdmUgcHJvY2VzcyB0aGF0IGRlc2NyaWJlcyBhIHJlbGF0aW9uc2hpcCBiZXR3ZWVuIHR3byBxdWFudGl0aWVzLlwifSx7XCJpZFwiOlwiMjU0MFwiLFwiY29kZVwiOlwiRi1CRiAxYlwiLFwibmFtZVwiOlwiV3JpdGUgYSBmdW5jdGlvbiB0aGF0IGRlc2NyaWJlcyBhIHJlbGF0aW9uc2hpcCBieSB1c2luZyBhcml0aG1ldGljIG9wZXJhdGlvbnMuXCJ9LHtcImlkXCI6XCIyNTQxXCIsXCJjb2RlXCI6XCJGLUJGIDJcIixcIm5hbWVcIjpcIk1vZGVsIGFyaXRobWV0aWMgYW5kIGdlb21ldHJpYyBzZXF1ZW5jZSBzaXR1YXRpb25zIHJlY3Vyc2l2ZWx5IGFuZFxcL29yIHdpdGggYW4gZXhwbGljaXQgZm9ybXVsYS5cIn0se1wiaWRcIjpcIjI1NDJcIixcImNvZGVcIjpcIkYtQkYgM1wiLFwibmFtZVwiOlwiSWRlbnRpZnkgYW5kIGV4cGxhaW4gdHJhbnNmb3JtYXRpb25zIGluIGJvdGggZXF1YXRpb24gYW5kIGdyYXBoaWNhbCBmb3JtLlwifSx7XCJpZFwiOlwiMjU0M1wiLFwiY29kZVwiOlwiRi1CRiA0YVwiLFwibmFtZVwiOlwiV3JpdGUgYW4gZXhwcmVzc2lvbiBmb3IgdGhlIGludmVyc2Ugb2YgYSBsaW5lYXIgZnVuY3Rpb24uXCJ9LHtcImlkXCI6XCIyNTgwXCIsXCJjb2RlXCI6XCJGLUJGIDRjXCIsXCJuYW1lXCI6XCJSZWFkIHZhbHVlcyBvZiBhbiBpbnZlcnNlIGZ1bmN0aW9uIGZyb20gYSBncmFwaCBvciBhIHRhYmxlLlwifV19LHtcImNvZGVcIjpcIkYtSUZcIixcIm5hbWVcIjpcIkludGVycHJldGluZyBGdW5jdGlvbnNcIixcImNoaWxkcmVuXCI6W3tcImlkXCI6XCIyNTQ0XCIsXCJjb2RlXCI6XCJGLUlGIDFcIixcIm5hbWVcIjpcIlVuZGVyc3RhbmQgdGhhdCBpbiBhIGZ1bmN0aW9uLCBlYWNoIGVsZW1lbnQgb2YgdGhlIGRvbWFpbiwgPGk+eDxcXC9pPiwgbWFwcyB0byBleGFjdGx5IG9uZSBlbGVtZW50IG9mIHRoZSByYW5nZSwgPGk+ZjxcXC9pPig8aT54PFxcL2k+KS5cIn0se1wiaWRcIjpcIjI1NDVcIixcImNvZGVcIjpcIkYtSUYgMlwiLFwibmFtZVwiOlwiRXZhbHVhdGUgZnVuY3Rpb25zIGFuZCBpbnRlcnByZXQgc3RhdGVtZW50cyB0aGF0IHVzZSBmdW5jdGlvbiBub3RhdGlvbi5cIn0se1wiaWRcIjpcIjI1NDZcIixcImNvZGVcIjpcIkYtSUYgM1wiLFwibmFtZVwiOlwiUmVjb2duaXplIHRoYXQgc2VxdWVuY2VzIGFyZSBmdW5jdGlvbnMsIHNvbWV0aW1lcyBkZWZpbmVkIHJlY3Vyc2l2ZWx5LCB3aG9zZSBkb21haW4gaXMgYSBzdWJzZXQgb2YgdGhlIGludGVnZXJzLlwifSx7XCJpZFwiOlwiMjU0N1wiLFwiY29kZVwiOlwiRi1JRiA0XCIsXCJuYW1lXCI6XCJGb3IgYSBmdW5jdGlvbiB0aGF0IG1vZGVscyBhIHJlbGF0aW9uc2hpcCBiZXR3ZWVuIHR3byBxdWFudGl0aWVzLCBpbnRlcnByZXQgdGFibGVzIGFuZCBncmFwaHMgYW5kXFwvb3Igc2tldGNoIGtleSBmZWF0dXJlcyBvZiBncmFwaHMuXCJ9LHtcImlkXCI6XCIyNTQ4XCIsXCJjb2RlXCI6XCJGLUlGIDVcIixcIm5hbWVcIjpcIklkZW50aWZ5IHRoZSBhcHByb3ByaWF0ZSBkb21haW4gb2YgYSBmdW5jdGlvbi5cIn0se1wiaWRcIjpcIjI1NDlcIixcImNvZGVcIjpcIkYtSUYgNlwiLFwibmFtZVwiOlwiQ2FsY3VsYXRlLCBlc3RpbWF0ZSwgYW5kXFwvb3IgaW50ZXJwcmV0IHRoZSBhdmVyYWdlIHJhdGUgb2YgY2hhbmdlIG9mIGEgZnVuY3Rpb24uXCJ9LHtcImlkXCI6XCIyNTUwXCIsXCJjb2RlXCI6XCJGLUlGIDdhXCIsXCJuYW1lXCI6XCJHcmFwaCBhbmQgc2hvdyB0aGUga2V5IGZlYXR1cmVzIG9mIGxpbmVhciBhbmQgcXVhZHJhdGljIGZ1bmN0aW9ucy5cIn0se1wiaWRcIjpcIjI1NTFcIixcImNvZGVcIjpcIkYtSUYgN2JcIixcIm5hbWVcIjpcIkdyYXBoIGFuZCBzaG93IHRoZSBrZXkgZmVhdHVyZXMgb2Ygc3F1YXJlIHJvb3QsIGN1YmUgcm9vdCwgYW5kIHBpZWNld2lzZS1kZWZpbmVkIGZ1bmN0aW9ucy5cIn0se1wiaWRcIjpcIjI1ODJcIixcImNvZGVcIjpcIkYtSUYgN2NcIixcIm5hbWVcIjpcIkdyYXBoIHBvbHlub21pYWwgZnVuY3Rpb25zIGV4cHJlc3NlZCBzeW1ib2xpY2FsbHksIGlkZW50aWZ5IHplcm9zIHdoZW4gZmFjdG9yaXphdGlvbnMgYXJlIGF2YWlsYWJsZSwgYW5kIHNob3cgZW5kIGJlaGF2aW9yLlwifSx7XCJpZFwiOlwiMjU1MlwiLFwiY29kZVwiOlwiRi1JRiA3ZVwiLFwibmFtZVwiOlwiRmFjdG9yIGFuZFxcL29yIGNvbXBsZXRlIHRoZSBzcXVhcmUgaW4gYSBxdWFkcmF0aWMgZnVuY3Rpb24gdG8gcmV2ZWFsIHZhcmlvdXMgcHJvcGVydGllcy5cIn0se1wiaWRcIjpcIjI1NTNcIixcImNvZGVcIjpcIkYtSUYgOGFcIixcIm5hbWVcIjpcIkZhY3RvciBhbmRcXC9vciBjb21wbGV0ZSB0aGUgc3F1YXJlIGluIGEgcXVhZHJhdGljIGZ1bmN0aW9uIHRvIHJldmVhbCB2YXJpb3VzIHByb3BlcnRpZXMuXCJ9LHtcImlkXCI6XCIyNTU0XCIsXCJjb2RlXCI6XCJGLUlGIDhiXCIsXCJuYW1lXCI6XCJVc2UgdGhlIHByb3BlcnRpZXMgb2YgZXhwb25lbnRzIHRvIGludGVycHJldCBleHBvbmVudGlhbCBmdW5jdGlvbnMuXCJ9LHtcImlkXCI6XCIyNTU1XCIsXCJjb2RlXCI6XCJGLUlGIDlcIixcIm5hbWVcIjpcIkNvbXBhcmUgcHJvcGVydGllcyBvZiB0d28gZnVuY3Rpb25zLCBlYWNoIHJlcHJlc2VudGVkIGluIGEgZGlmZmVyZW50IHdheS5cIn1dfSx7XCJjb2RlXCI6XCJGLUxFXCIsXCJuYW1lXCI6XCJMaW5lYXIsIFF1YWRyYXRpYywgJiBFeHBvbmVudGlhbCBNb2RlbHNcIixcImNoaWxkcmVuXCI6W3tcImlkXCI6XCIyNTU2XCIsXCJjb2RlXCI6XCJGLUxFIDFhXCIsXCJuYW1lXCI6XCJQcm92ZSB0aGF0IGxpbmVhciBmdW5jdGlvbnMgZ3JvdyBieSBlcXVhbCBkaWZmZXJlbmNlcyBvdmVyIGVxdWFsIGludGVydmFscywgYW5kIHRoYXQgZXhwb25lbnRpYWwgZnVuY3Rpb25zIGdyb3cgYnkgZXF1YWwgZmFjdG9ycyBvdmVyIGVxdWFsIGludGVydmFscy5cIn0se1wiaWRcIjpcIjI1NTdcIixcImNvZGVcIjpcIkYtTEUgMWJcIixcIm5hbWVcIjpcIlJlY29nbml6ZSBzaXR1YXRpb25zIGluIHdoaWNoIG9uZSBxdWFudGl0eSBjaGFuZ2VzIGF0IGEgY29uc3RhbnQgcmF0ZSBwZXIgdW5pdCBjaGFuZ2Ugb2YgYW5vdGhlciBxdWFudGl0eS5cIn0se1wiaWRcIjpcIjI1NThcIixcImNvZGVcIjpcIkYtTEUgMWNcIixcIm5hbWVcIjpcIlJlY29nbml6ZSBzaXR1YXRpb25zIGluIHdoaWNoIGEgcXVhbnRpdHkgZ3Jvd3Mgb3IgZGVjYXlzIGJ5IGEgY29uc3RhbnQgcGVyY2VudCByYXRlIHBlciB1bml0IGNoYW5nZSBvZiBhbm90aGVyIHF1YW50aXR5LlwifSx7XCJpZFwiOlwiMjU1OVwiLFwiY29kZVwiOlwiRi1MRSAyXCIsXCJuYW1lXCI6XCJDb25zdHJ1Y3QgbGluZWFyIGFuZCBleHBvbmVudGlhbCBmdW5jdGlvbnMgZ2l2ZW4gYSBncmFwaCwgYSBkZXNjcmlwdGlvbiBvZiBhIHJlbGF0aW9uc2hpcCwgb3IgdHdvIGlucHV0XFwvb3V0cHV0IHBhaXJzLlwifSx7XCJpZFwiOlwiMjU2MFwiLFwiY29kZVwiOlwiRi1MRSAzXCIsXCJuYW1lXCI6XCJPYnNlcnZlIHRoYXQgYSBxdWFudGl0eSBpbmNyZWFzaW5nIGV4cG9uZW50aWFsbHkgZXZlbnR1YWxseSBleGNlZWRzIGEgcXVhbnRpdHkgaW5jcmVhc2luZyBsaW5lYXJseSBvciBxdWFkcmF0aWNhbGx5LlwifSx7XCJpZFwiOlwiMjU2MVwiLFwiY29kZVwiOlwiRi1MRSA1XCIsXCJuYW1lXCI6XCJJbnRlcnByZXQgdGhlIHBhcmFtZXRlcnMgaW4gYSBsaW5lYXIgb3IgZXhwb25lbnRpYWwgZnVuY3Rpb24gaW4gdGVybXMgb2YgYSBjb250ZXh0LlwifV19LHtcImNvZGVcIjpcIk4tUVwiLFwibmFtZVwiOlwiUXVhbnRpdGllc1wiLFwiY2hpbGRyZW5cIjpbe1wiaWRcIjpcIjI1NjJcIixcImNvZGVcIjpcIk4tUSAxXCIsXCJuYW1lXCI6XCJVc2UgdW5pdHMgdG8gdW5kZXJzdGFuZCBtdWx0aS1zdGVwIHByb2JsZW1zLCBmb3JtdWxhcywgZ3JhcGhzLCBhbmQgZGF0YSBkaXNwbGF5cy5cIn0se1wiaWRcIjpcIjI1NjNcIixcImNvZGVcIjpcIk4tUSAyXCIsXCJuYW1lXCI6XCJEZWZpbmUgcXVhbnRpdGllcyBmb3IgZGVzY3JpcHRpdmUgbW9kZWxpbmcuXCJ9LHtcImlkXCI6XCIyNTY0XCIsXCJjb2RlXCI6XCJOLVEgM1wiLFwibmFtZVwiOlwiQ2hvb3NlIGEgbGV2ZWwgb2YgYWNjdXJhY3kgYXBwcm9wcmlhdGUgdG8gbGltaXRhdGlvbnMgb24gbWVhc3VyZW1lbnQuXCJ9XX0se1wiY29kZVwiOlwiTi1STlwiLFwibmFtZVwiOlwiVGhlIFJlYWwgTnVtYmVyIFN5c3RlbVwiLFwiY2hpbGRyZW5cIjpbe1wiaWRcIjpcIjI1NzdcIixcImNvZGVcIjpcIk4tUk4gMVwiLFwibmFtZVwiOlwiRXh0ZW5kIHRoZSBwcm9wZXJ0aWVzIG9mIGV4cG9uZW50cyB0byByYXRpb25hbCBleHBvbmVudHMuXCJ9LHtcImlkXCI6XCIyNTc4XCIsXCJjb2RlXCI6XCJOLVJOIDJcIixcIm5hbWVcIjpcIlJld3JpdGUgZXhwcmVzc2lvbnMgY29udGFpbmluZyByYWRpY2FscyBhbmRcXC9vciByYXRpb25hbCBleHBvbmVudHMuXCJ9LHtcImlkXCI6XCIyNTY1XCIsXCJjb2RlXCI6XCJOLVJOIDNcIixcIm5hbWVcIjpcIlVzZSBwcm9wZXJ0aWVzIG9mIHJhdGlvbmFsIGFuZCBpcnJhdGlvbmFsIG51bWJlcnMgYW5kIGV4cGxhaW4gb3V0Y29tZXMuXCJ9XX0se1wiY29kZVwiOlwiUy1JRFwiLFwibmFtZVwiOlwiSW50ZXJwcmV0aW5nIENhdGVnb3JpY2FsICYgUXVhbnRpdGF0aXZlIERhdGFcIixcImNoaWxkcmVuXCI6W3tcImlkXCI6XCIyNTY2XCIsXCJjb2RlXCI6XCJTLUlEIDFcIixcIm5hbWVcIjpcIlJlcHJlc2VudCBkYXRhIHdpdGggZG90IHBsb3RzLCBoaXN0b2dyYW1zLCBhbmQgYm94IHBsb3RzLlwifSx7XCJpZFwiOlwiMjU2N1wiLFwiY29kZVwiOlwiUy1JRCAyXCIsXCJuYW1lXCI6XCJDb21wYXJlIG1lZGlhbiwgbWVhbiwgaW50ZXJxdWFydGlsZSByYW5nZSwgYW5kIHN0YW5kYXJkIGRldmlhdGlvbiBvZiBkYXRhIHNldHMuXCJ9LHtcImlkXCI6XCIyNTY4XCIsXCJjb2RlXCI6XCJTLUlEIDNcIixcIm5hbWVcIjpcIkludGVycHJldCBkaWZmZXJlbmNlcyBpbiBzaGFwZSwgY2VudGVyLCBhbmQgc3ByZWFkIGluIHRoZSBjb250ZXh0IG9mIHRoZSBkYXRhIHNldHMuXCJ9LHtcImlkXCI6XCIyNTY5XCIsXCJjb2RlXCI6XCJTLUlEIDVcIixcIm5hbWVcIjpcIlN1bW1hcml6ZSBhbmQgaW50ZXJwcmV0IGRhdGEgb24gdHdvIGNhdGVnb3JpY2FsIGFuZCBxdWFudGl0YXRpdmUgdmFyaWFibGVzLlwifSx7XCJpZFwiOlwiMjU3MFwiLFwiY29kZVwiOlwiUy1JRCA2YVwiLFwibmFtZVwiOlwiQ3JlYXRlIGFuZFxcL29yIHVzZSBsaW5lYXIsIHF1YWRyYXRpYywgYW5kIGV4cG9uZW50aWFsIG1vZGVscyBmaXR0ZWQgdG8gZGF0YSB0byBzb2x2ZSBwcm9ibGVtcy5cIn0se1wiaWRcIjpcIjI1NzFcIixcImNvZGVcIjpcIlMtSUQgNmJcIixcIm5hbWVcIjpcIkluZm9ybWFsbHkgYXNzZXNzIHRoZSBmaXQgb2YgYSBmdW5jdGlvbiBieSBwbG90dGluZyBhbmQgYW5hbHl6aW5nIHJlc2lkdWFscy5cIn0se1wiaWRcIjpcIjI1NzJcIixcImNvZGVcIjpcIlMtSUQgNmNcIixcIm5hbWVcIjpcIkZpdCBhIGxpbmVhciBmdW5jdGlvbiB0byBhIHNjYXR0ZXIgcGxvdCB3aGVuIGFwcHJvcHJpYXRlLlwifSx7XCJpZFwiOlwiMjU3M1wiLFwiY29kZVwiOlwiUy1JRCA3XCIsXCJuYW1lXCI6XCJJbnRlcnByZXQgdGhlIHNsb3BlIGFuZCB0aGUgaW50ZXJjZXB0IG9mIGEgbGluZWFyIG1vZGVsIGluIHRoZSBjb250ZXh0IG9mIHRoZSBkYXRhLlwifSx7XCJpZFwiOlwiMjU3NFwiLFwiY29kZVwiOlwiUy1JRCA4XCIsXCJuYW1lXCI6XCJVc2luZyB0ZWNobm9sb2d5LCBjb21wdXRlIGFuZCBpbnRlcnByZXQgdGhlIGNvcnJlbGF0aW9uIGNvZWZmaWNpZW50IG9mIGEgbGluZWFyIGZpdC5cIn0se1wiaWRcIjpcIjI1NzVcIixcImNvZGVcIjpcIlMtSUQgOVwiLFwibmFtZVwiOlwiRGlzdGluZ3Vpc2ggYmV0d2VlbiBjb3JyZWxhdGlvbiBhbmQgY2F1c2F0aW9uLlwifV19XTtcclxuXHJcblx0c2VsZi5zdGRMaXN0ID0gXy5tYXAoc2VsZi5zdGFuZGFyZHMsIGZ1bmN0aW9uKGVudHJ5KSB7IHJldHVybiB0cnVuY05hbWUoZW50cnkuY29kZSArICc6ICcgKyBlbnRyeS5uYW1lKSB9KTtcclxuXHJcblx0c2VsZi5hbGxTdGRzID0gW3tcImNvZGVcIjpcIkEtQVBSXCIsXCJuYW1lXCI6XCJBcml0aG1ldGljIHdpdGggUG9seW5vbWlhbHMgJiBSYXRpb25hbCBFeHByZXNzaW9uc1wiLFwiY2hpbGRyZW5cIjpbe1wiaWRcIjpcIjQzNTRcIixcImNvZGVcIjpcIkEtQVBSIDFcIixcIm5hbWVcIjpcIkFwcGx5IG9wZXJhdGlvbnMgdG8gcG9seW5vbWlhbHMgYW5kIHVuZGVyc3RhbmQgY2xvc3VyZS5cIn0se1wiaWRcIjpcIjQzNTVcIixcImNvZGVcIjpcIkEtQVBSIDNcIixcIm5hbWVcIjpcIkZpbmQgemVyb2VzIG9mIGZhY3RvcmVkIHBvbHlub21pYWxzLlwifV19LHtcImNvZGVcIjpcIkEtQ0VEXCIsXCJuYW1lXCI6XCJDcmVhdGluZyBFcXVhdGlvbnNcIixcImNoaWxkcmVuXCI6W3tcImlkXCI6XCI0MzU2XCIsXCJjb2RlXCI6XCJBLUNFRCAxXCIsXCJuYW1lXCI6XCJTb2x2ZSBwcm9ibGVtcyBpbiBvbmUgdmFyaWFibGUgYnkgY3JlYXRpbmcgZXF1YXRpb25zXFwvaW5lcXVhbGl0aWVzLlwifSx7XCJpZFwiOlwiNDM1N1wiLFwiY29kZVwiOlwiQS1DRUQgMlwiLFwibmFtZVwiOlwiUmVwcmVzZW50IHJlbGF0aW9uc2hpcHMgYnkgY3JlYXRpbmcgYW5kIGdyYXBoaW5nIGVxdWF0aW9ucyBpbiB0d28gdmFyaWFibGVzLlwifSx7XCJpZFwiOlwiNDM1OFwiLFwiY29kZVwiOlwiQS1DRUQgM1wiLFwibmFtZVwiOlwiUmVwcmVzZW50IGFuZCBpbnRlcnByZXQgc29sdXRpb25zIG9mIHN5c3RlbXMgb2YgZXF1YXRpb25zXFwvaW5lcXVhbGl0aWVzLlwifSx7XCJpZFwiOlwiNDM1OVwiLFwiY29kZVwiOlwiQS1DRUQgNFwiLFwibmFtZVwiOlwiUmVhcnJhbmdlIGZvcm11bGFzIHVzaW5nIHRoZSBzYW1lIHJlYXNvbmluZyBhcyBzb2x2aW5nIGVxdWF0aW9ucy5cIn1dfSx7XCJjb2RlXCI6XCJBLVJFSVwiLFwibmFtZVwiOlwiUmVhc29uaW5nIHdpdGggRXF1YXRpb25zICYgSW5lcXVhbGl0aWVzXCIsXCJjaGlsZHJlblwiOlt7XCJpZFwiOlwiNDM2MFwiLFwiY29kZVwiOlwiQS1SRUkgMVwiLFwibmFtZVwiOlwiVXNlIGVxdWFsaXR5IG9mIG51bWJlcnMgdG8gZXhwbGFpbiBlYWNoIHN0ZXAgb2Ygc29sdmluZyBhbiBlcXVhdGlvbi5cIn0se1wiaWRcIjpcIjQzNjdcIixcImNvZGVcIjpcIkEtUkVJIDEwXCIsXCJuYW1lXCI6XCJVbmRlcnN0YW5kIHRoYXQgdGhlIGdyYXBoIG9mIGEgdHdvLXZhcmlhYmxlIGVxdWF0aW9uIGlzIHRoZSBzZXQgb2YgYWxsIGl0cyBzb2x1dGlvbnMuXCJ9LHtcImlkXCI6XCI0MzY4XCIsXCJjb2RlXCI6XCJBLVJFSSAxMVwiLFwibmFtZVwiOlwiRXhwbGFpbiB3aHkgdGhlIDxpPng8XFwvaT4tY29vcmRpbmF0ZXMgb2YgdGhlIHBvaW50cyBvZiBpbnRlcnNlY3Rpb24gb2YgPGk+eTxcXC9pPiA9IDxpPmY8XFwvaT4oPGk+eDxcXC9pPikgYW5kIDxpPnk8XFwvaT4gID0gPGk+ZzxcXC9pPig8aT54PFxcL2k+KSBhcmUgdGhlIHNvbHV0aW9ucyBvZiB0aGUgZXF1YXRpb24gPGk+ZjxcXC9pPig8aT54PFxcL2k+KSA9IDxpPmc8XFwvaT4oPGk+eDxcXC9pPikuXCJ9LHtcImlkXCI6XCI0MzY5XCIsXCJjb2RlXCI6XCJBLVJFSSAxMlwiLFwibmFtZVwiOlwiR3JhcGggdGhlIHNvbHV0aW9ucyB0byBhIGxpbmVhciBpbmVxdWFsaXR5IGluIHR3byB2YXJpYWJsZXMuXCJ9LHtcImlkXCI6XCI0MzYxXCIsXCJjb2RlXCI6XCJBLVJFSSAzXCIsXCJuYW1lXCI6XCJTb2x2ZSBsaW5lYXIgZXF1YXRpb25zXFwvaW5lcXVhbGl0aWVzIGluIG9uZSB2YXJpYWJsZS5cIn0se1wiaWRcIjpcIjQzNjJcIixcImNvZGVcIjpcIkEtUkVJIDRhXCIsXCJuYW1lXCI6XCJDb21wbGV0ZSB0aGUgc3F1YXJlIHRvIHJld3JpdGUgcXVhZHJhdGljIGZ1bmN0aW9ucyBpbiB2ZXJ0ZXggZm9ybSBhbmQgdG8gZGVyaXZlIHRoZSBxdWFkcmF0aWMgZm9ybXVsYS5cIn0se1wiaWRcIjpcIjQzNjNcIixcImNvZGVcIjpcIkEtUkVJIDRiXCIsXCJuYW1lXCI6XCJTb2x2ZSBxdWFkcmF0aWMgZXF1YXRpb25zIGluIG9uZSB2YXJpYWJsZS5cIn0se1wiaWRcIjpcIjQzNjRcIixcImNvZGVcIjpcIkEtUkVJIDVcIixcIm5hbWVcIjpcIlByb3ZlIHRoYXQgYXBwbHlpbmcgZWxpbWluYXRpb24gdG8gYSBzeXN0ZW0gb2YgZXF1YXRpb25zIGluIHR3byB2YXJpYWJsZXMgcHJvZHVjZXMgYSBzeXN0ZW0gd2l0aCB0aGUgc2FtZSBzb2x1dGlvbnMuXCJ9LHtcImlkXCI6XCI0MzY1XCIsXCJjb2RlXCI6XCJBLVJFSSA2XCIsXCJuYW1lXCI6XCJTb2x2ZSBzeXN0ZW1zIG9mIGxpbmVhciBlcXVhdGlvbnMgZXhhY3RseSBhbmRcXC9vciBhcHByb3hpbWF0ZWx5LlwifSx7XCJpZFwiOlwiNDM2NlwiLFwiY29kZVwiOlwiQS1SRUkgN1wiLFwibmFtZVwiOlwiQWxnZWJyYWljYWxseSBhbmQgZ3JhcGhpY2FsbHkgc29sdmUgc3lzdGVtcyBvZiBvbmUgbGluZWFyIGFuZCBvbmUgcXVhZHJhdGljIGVxdWF0aW9uLlwifV19LHtcImNvZGVcIjpcIkEtU1NFXCIsXCJuYW1lXCI6XCJTZWVpbmcgU3RydWN0dXJlIGluIEV4cHJlc3Npb25zXCIsXCJjaGlsZHJlblwiOlt7XCJpZFwiOlwiNDM0OFwiLFwiY29kZVwiOlwiQS1TU0UgMWFcIixcIm5hbWVcIjpcIkludGVycHJldCB0ZXJtcywgZmFjdG9ycywgYW5kIGNvZWZmaWNpZW50cyBvZiBhbiBleHByZXNzaW9uLlwifSx7XCJpZFwiOlwiNDM0OVwiLFwiY29kZVwiOlwiQS1TU0UgMWJcIixcIm5hbWVcIjpcIkludGVycHJldCBjb21wbGljYXRlZCBleHByZXNzaW9ucyBieSB2aWV3aW5nIHBhcnRzIGFzIG9uZSBvYmplY3QuXCJ9LHtcImlkXCI6XCI0MzUwXCIsXCJjb2RlXCI6XCJBLVNTRSAyXCIsXCJuYW1lXCI6XCJJZGVudGlmeSB3YXlzIHRvIHJld3JpdGUgZXhwcmVzc2lvbnMuXCJ9LHtcImlkXCI6XCI0MzUxXCIsXCJjb2RlXCI6XCJBLVNTRSAzYVwiLFwibmFtZVwiOlwiRmluZCB0aGUgemVyb3Mgb2YgYSBxdWFkcmF0aWMgZnVuY3Rpb24gYnkgZmFjdG9yaW5nLlwifSx7XCJpZFwiOlwiNDM1MlwiLFwiY29kZVwiOlwiQS1TU0UgM2JcIixcIm5hbWVcIjpcIkZpbmQgbWF4aW11bVxcL21pbmltdW0gdmFsdWVzIG9mIGEgcXVhZHJhdGljIGZ1bmN0aW9uIGJ5IGNvbXBsZXRpbmcgdGhlIHNxdWFyZS5cIn0se1wiaWRcIjpcIjQzNTNcIixcImNvZGVcIjpcIkEtU1NFIDNjXCIsXCJuYW1lXCI6XCJUcmFuc2Zvcm0gZXhwb25lbnRpYWwgZXhwcmVzc2lvbnMuXCJ9XX0se1wiY29kZVwiOlwiRi1CRlwiLFwibmFtZVwiOlwiQnVpbGRpbmcgRnVuY3Rpb25zXCIsXCJjaGlsZHJlblwiOlt7XCJpZFwiOlwiNDM4MlwiLFwiY29kZVwiOlwiRi1CRiAxYVwiLFwibmFtZVwiOlwiRGV0ZXJtaW5lIGFuIGV4cGxpY2l0IGV4cHJlc3Npb24gb3IgYSByZWN1cnNpdmUgcHJvY2VzcyB0aGF0IGRlc2NyaWJlcyBhIHJlbGF0aW9uc2hpcCBiZXR3ZWVuIHR3byBxdWFudGl0aWVzLlwifSx7XCJpZFwiOlwiNDM4M1wiLFwiY29kZVwiOlwiRi1CRiAxYlwiLFwibmFtZVwiOlwiV3JpdGUgYSBmdW5jdGlvbiB0aGF0IGRlc2NyaWJlcyBhIHJlbGF0aW9uc2hpcCBieSB1c2luZyBhcml0aG1ldGljIG9wZXJhdGlvbnMuXCJ9LHtcImlkXCI6XCI0Mzg0XCIsXCJjb2RlXCI6XCJGLUJGIDJcIixcIm5hbWVcIjpcIk1vZGVsIGFyaXRobWV0aWMgYW5kIGdlb21ldHJpYyBzZXF1ZW5jZSBzaXR1YXRpb25zIHJlY3Vyc2l2ZWx5IGFuZFxcL29yIHdpdGggYW4gZXhwbGljaXQgZm9ybXVsYS5cIn0se1wiaWRcIjpcIjQzODVcIixcImNvZGVcIjpcIkYtQkYgM1wiLFwibmFtZVwiOlwiSWRlbnRpZnkgYW5kIGV4cGxhaW4gdHJhbnNmb3JtYXRpb25zIGluIGJvdGggZXF1YXRpb24gYW5kIGdyYXBoaWNhbCBmb3JtLlwifSx7XCJpZFwiOlwiNDM4NlwiLFwiY29kZVwiOlwiRi1CRiA0YVwiLFwibmFtZVwiOlwiV3JpdGUgYW4gZXhwcmVzc2lvbiBmb3IgdGhlIGludmVyc2Ugb2YgYSBsaW5lYXIgZnVuY3Rpb24uXCJ9XX0se1wiY29kZVwiOlwiRi1JRlwiLFwibmFtZVwiOlwiSW50ZXJwcmV0aW5nIEZ1bmN0aW9uc1wiLFwiY2hpbGRyZW5cIjpbe1wiaWRcIjpcIjQzNzBcIixcImNvZGVcIjpcIkYtSUYgMVwiLFwibmFtZVwiOlwiVW5kZXJzdGFuZCB0aGF0IGluIGEgZnVuY3Rpb24sIGVhY2ggZWxlbWVudCBvZiB0aGUgZG9tYWluLCA8aT54PFxcL2k+LCBtYXBzIHRvIGV4YWN0bHkgb25lIGVsZW1lbnQgb2YgdGhlIHJhbmdlLCA8aT5mPFxcL2k+KDxpPng8XFwvaT4pLlwifSx7XCJpZFwiOlwiNDM3MVwiLFwiY29kZVwiOlwiRi1JRiAyXCIsXCJuYW1lXCI6XCJFdmFsdWF0ZSBmdW5jdGlvbnMgYW5kIGludGVycHJldCBzdGF0ZW1lbnRzIHRoYXQgdXNlIGZ1bmN0aW9uIG5vdGF0aW9uLlwifSx7XCJpZFwiOlwiNDM3MlwiLFwiY29kZVwiOlwiRi1JRiAzXCIsXCJuYW1lXCI6XCJSZWNvZ25pemUgdGhhdCBzZXF1ZW5jZXMgYXJlIGZ1bmN0aW9ucywgc29tZXRpbWVzIGRlZmluZWQgcmVjdXJzaXZlbHksIHdob3NlIGRvbWFpbiBpcyBhIHN1YnNldCBvZiB0aGUgaW50ZWdlcnMuXCJ9LHtcImlkXCI6XCI0MzczXCIsXCJjb2RlXCI6XCJGLUlGIDRcIixcIm5hbWVcIjpcIkZvciBhIGZ1bmN0aW9uIHRoYXQgbW9kZWxzIGEgcmVsYXRpb25zaGlwIGJldHdlZW4gdHdvIHF1YW50aXRpZXMsIGludGVycHJldCB0YWJsZXMgYW5kIGdyYXBocyBhbmRcXC9vciBza2V0Y2gga2V5IGZlYXR1cmVzIG9mIGdyYXBocy5cIn0se1wiaWRcIjpcIjQzNzRcIixcImNvZGVcIjpcIkYtSUYgNVwiLFwibmFtZVwiOlwiSWRlbnRpZnkgdGhlIGFwcHJvcHJpYXRlIGRvbWFpbiBvZiBhIGZ1bmN0aW9uLlwifSx7XCJpZFwiOlwiNDM3NVwiLFwiY29kZVwiOlwiRi1JRiA2XCIsXCJuYW1lXCI6XCJDYWxjdWxhdGUsIGVzdGltYXRlLCBhbmRcXC9vciBpbnRlcnByZXQgdGhlIGF2ZXJhZ2UgcmF0ZSBvZiBjaGFuZ2Ugb2YgYSBmdW5jdGlvbi5cIn0se1wiaWRcIjpcIjQzNzZcIixcImNvZGVcIjpcIkYtSUYgN2FcIixcIm5hbWVcIjpcIkdyYXBoIGFuZCBzaG93IHRoZSBrZXkgZmVhdHVyZXMgb2YgbGluZWFyIGFuZCBxdWFkcmF0aWMgZnVuY3Rpb25zLlwifSx7XCJpZFwiOlwiNDM3N1wiLFwiY29kZVwiOlwiRi1JRiA3YlwiLFwibmFtZVwiOlwiR3JhcGggYW5kIHNob3cgdGhlIGtleSBmZWF0dXJlcyBvZiBzcXVhcmUgcm9vdCwgY3ViZSByb290LCBhbmQgcGllY2V3aXNlLWRlZmluZWQgZnVuY3Rpb25zLlwifSx7XCJpZFwiOlwiNDM3OFwiLFwiY29kZVwiOlwiRi1JRiA3ZVwiLFwibmFtZVwiOlwiRmFjdG9yIGFuZFxcL29yIGNvbXBsZXRlIHRoZSBzcXVhcmUgaW4gYSBxdWFkcmF0aWMgZnVuY3Rpb24gdG8gcmV2ZWFsIHZhcmlvdXMgcHJvcGVydGllcy5cIn0se1wiaWRcIjpcIjQzNzlcIixcImNvZGVcIjpcIkYtSUYgOGFcIixcIm5hbWVcIjpcIkZhY3RvciBhbmRcXC9vciBjb21wbGV0ZSB0aGUgc3F1YXJlIGluIGEgcXVhZHJhdGljIGZ1bmN0aW9uIHRvIHJldmVhbCB2YXJpb3VzIHByb3BlcnRpZXMuXCJ9LHtcImlkXCI6XCI0MzgwXCIsXCJjb2RlXCI6XCJGLUlGIDhiXCIsXCJuYW1lXCI6XCJVc2UgdGhlIHByb3BlcnRpZXMgb2YgZXhwb25lbnRzIHRvIGludGVycHJldCBleHBvbmVudGlhbCBmdW5jdGlvbnMuXCJ9LHtcImlkXCI6XCI0MzgxXCIsXCJjb2RlXCI6XCJGLUlGIDlcIixcIm5hbWVcIjpcIkNvbXBhcmUgcHJvcGVydGllcyBvZiB0d28gZnVuY3Rpb25zLCBlYWNoIHJlcHJlc2VudGVkIGluIGEgZGlmZmVyZW50IHdheS5cIn1dfSx7XCJjb2RlXCI6XCJGLUxFXCIsXCJuYW1lXCI6XCJMaW5lYXIsIFF1YWRyYXRpYywgJiBFeHBvbmVudGlhbCBNb2RlbHNcIixcImNoaWxkcmVuXCI6W3tcImlkXCI6XCI0Mzg3XCIsXCJjb2RlXCI6XCJGLUxFIDFhXCIsXCJuYW1lXCI6XCJQcm92ZSB0aGF0IGxpbmVhciBmdW5jdGlvbnMgZ3JvdyBieSBlcXVhbCBkaWZmZXJlbmNlcyBvdmVyIGVxdWFsIGludGVydmFscywgYW5kIHRoYXQgZXhwb25lbnRpYWwgZnVuY3Rpb25zIGdyb3cgYnkgZXF1YWwgZmFjdG9ycyBvdmVyIGVxdWFsIGludGVydmFscy5cIn0se1wiaWRcIjpcIjQzODhcIixcImNvZGVcIjpcIkYtTEUgMWJcIixcIm5hbWVcIjpcIlJlY29nbml6ZSBzaXR1YXRpb25zIGluIHdoaWNoIG9uZSBxdWFudGl0eSBjaGFuZ2VzIGF0IGEgY29uc3RhbnQgcmF0ZSBwZXIgdW5pdCBjaGFuZ2Ugb2YgYW5vdGhlciBxdWFudGl0eS5cIn0se1wiaWRcIjpcIjQzODlcIixcImNvZGVcIjpcIkYtTEUgMWNcIixcIm5hbWVcIjpcIlJlY29nbml6ZSBzaXR1YXRpb25zIGluIHdoaWNoIGEgcXVhbnRpdHkgZ3Jvd3Mgb3IgZGVjYXlzIGJ5IGEgY29uc3RhbnQgcGVyY2VudCByYXRlIHBlciB1bml0IGNoYW5nZSBvZiBhbm90aGVyIHF1YW50aXR5LlwifSx7XCJpZFwiOlwiNDM5MFwiLFwiY29kZVwiOlwiRi1MRSAyXCIsXCJuYW1lXCI6XCJDb25zdHJ1Y3QgbGluZWFyIGFuZCBleHBvbmVudGlhbCBmdW5jdGlvbnMgZ2l2ZW4gYSBncmFwaCwgYSBkZXNjcmlwdGlvbiBvZiBhIHJlbGF0aW9uc2hpcCwgb3IgdHdvIGlucHV0XFwvb3V0cHV0IHBhaXJzLlwifSx7XCJpZFwiOlwiNDM5MVwiLFwiY29kZVwiOlwiRi1MRSAzXCIsXCJuYW1lXCI6XCJPYnNlcnZlIHRoYXQgYSBxdWFudGl0eSBpbmNyZWFzaW5nIGV4cG9uZW50aWFsbHkgZXZlbnR1YWxseSBleGNlZWRzIGEgcXVhbnRpdHkgaW5jcmVhc2luZyBsaW5lYXJseSBvciBxdWFkcmF0aWNhbGx5LlwifSx7XCJpZFwiOlwiNDM5MlwiLFwiY29kZVwiOlwiRi1MRSA1XCIsXCJuYW1lXCI6XCJJbnRlcnByZXQgdGhlIHBhcmFtZXRlcnMgaW4gYSBsaW5lYXIgb3IgZXhwb25lbnRpYWwgZnVuY3Rpb24gaW4gdGVybXMgb2YgYSBjb250ZXh0LlwifV19LHtcImNvZGVcIjpcIk4tUVwiLFwibmFtZVwiOlwiUXVhbnRpdGllc1wiLFwiY2hpbGRyZW5cIjpbe1wiaWRcIjpcIjQzNDVcIixcImNvZGVcIjpcIk4tUSAxXCIsXCJuYW1lXCI6XCJVc2UgdW5pdHMgdG8gdW5kZXJzdGFuZCBtdWx0aS1zdGVwIHByb2JsZW1zLCBmb3JtdWxhcywgZ3JhcGhzLCBhbmQgZGF0YSBkaXNwbGF5cy5cIn0se1wiaWRcIjpcIjQzNDZcIixcImNvZGVcIjpcIk4tUSAyXCIsXCJuYW1lXCI6XCJEZWZpbmUgcXVhbnRpdGllcyBmb3IgZGVzY3JpcHRpdmUgbW9kZWxpbmcuXCJ9LHtcImlkXCI6XCI0MzQ3XCIsXCJjb2RlXCI6XCJOLVEgM1wiLFwibmFtZVwiOlwiQ2hvb3NlIGEgbGV2ZWwgb2YgYWNjdXJhY3kgYXBwcm9wcmlhdGUgdG8gbGltaXRhdGlvbnMgb24gbWVhc3VyZW1lbnQuXCJ9XX0se1wiY29kZVwiOlwiTi1STlwiLFwibmFtZVwiOlwiVGhlIFJlYWwgTnVtYmVyIFN5c3RlbVwiLFwiY2hpbGRyZW5cIjpbe1wiaWRcIjpcIjQzNDJcIixcImNvZGVcIjpcIk4tUk4gMVwiLFwibmFtZVwiOlwiRXh0ZW5kIHRoZSBwcm9wZXJ0aWVzIG9mIGV4cG9uZW50cyB0byByYXRpb25hbCBleHBvbmVudHMuXCJ9LHtcImlkXCI6XCI0MzQzXCIsXCJjb2RlXCI6XCJOLVJOIDJcIixcIm5hbWVcIjpcIlJld3JpdGUgZXhwcmVzc2lvbnMgY29udGFpbmluZyByYWRpY2FscyBhbmRcXC9vciByYXRpb25hbCBleHBvbmVudHMuXCJ9LHtcImlkXCI6XCI0MzQ0XCIsXCJjb2RlXCI6XCJOLVJOIDNcIixcIm5hbWVcIjpcIlVzZSBwcm9wZXJ0aWVzIG9mIHJhdGlvbmFsIGFuZCBpcnJhdGlvbmFsIG51bWJlcnMgYW5kIGV4cGxhaW4gb3V0Y29tZXMuXCJ9XX0se1wiY29kZVwiOlwiUy1JRFwiLFwibmFtZVwiOlwiSW50ZXJwcmV0aW5nIENhdGVnb3JpY2FsICYgUXVhbnRpdGF0aXZlIERhdGFcIixcImNoaWxkcmVuXCI6W3tcImlkXCI6XCI0MzkzXCIsXCJjb2RlXCI6XCJTLUlEIDFcIixcIm5hbWVcIjpcIlJlcHJlc2VudCBkYXRhIHdpdGggZG90IHBsb3RzLCBoaXN0b2dyYW1zLCBhbmQgYm94IHBsb3RzLlwifSx7XCJpZFwiOlwiNDM5NFwiLFwiY29kZVwiOlwiUy1JRCAyXCIsXCJuYW1lXCI6XCJDb21wYXJlIG1lZGlhbiwgbWVhbiwgaW50ZXJxdWFydGlsZSByYW5nZSwgYW5kIHN0YW5kYXJkIGRldmlhdGlvbiBvZiBkYXRhIHNldHMuXCJ9LHtcImlkXCI6XCI0Mzk1XCIsXCJjb2RlXCI6XCJTLUlEIDNcIixcIm5hbWVcIjpcIkludGVycHJldCBkaWZmZXJlbmNlcyBpbiBzaGFwZSwgY2VudGVyLCBhbmQgc3ByZWFkIGluIHRoZSBjb250ZXh0IG9mIHRoZSBkYXRhIHNldHMuXCJ9LHtcImlkXCI6XCI0Mzk2XCIsXCJjb2RlXCI6XCJTLUlEIDVcIixcIm5hbWVcIjpcIlN1bW1hcml6ZSBhbmQgaW50ZXJwcmV0IGRhdGEgb24gdHdvIGNhdGVnb3JpY2FsIGFuZCBxdWFudGl0YXRpdmUgdmFyaWFibGVzLlwifSx7XCJpZFwiOlwiNDM5N1wiLFwiY29kZVwiOlwiUy1JRCA2YVwiLFwibmFtZVwiOlwiQ3JlYXRlIGFuZFxcL29yIHVzZSBsaW5lYXIsIHF1YWRyYXRpYywgYW5kIGV4cG9uZW50aWFsIG1vZGVscyBmaXR0ZWQgdG8gZGF0YSB0byBzb2x2ZSBwcm9ibGVtcy5cIn0se1wiaWRcIjpcIjQzOThcIixcImNvZGVcIjpcIlMtSUQgNmJcIixcIm5hbWVcIjpcIkluZm9ybWFsbHkgYXNzZXNzIHRoZSBmaXQgb2YgYSBmdW5jdGlvbiBieSBwbG90dGluZyBhbmQgYW5hbHl6aW5nIHJlc2lkdWFscy5cIn0se1wiaWRcIjpcIjQzOTlcIixcImNvZGVcIjpcIlMtSUQgNmNcIixcIm5hbWVcIjpcIkZpdCBhIGxpbmVhciBmdW5jdGlvbiB0byBhIHNjYXR0ZXIgcGxvdCB3aGVuIGFwcHJvcHJpYXRlLlwifSx7XCJpZFwiOlwiNDQwMFwiLFwiY29kZVwiOlwiUy1JRCA3XCIsXCJuYW1lXCI6XCJJbnRlcnByZXQgdGhlIHNsb3BlIGFuZCB0aGUgaW50ZXJjZXB0IG9mIGEgbGluZWFyIG1vZGVsIGluIHRoZSBjb250ZXh0IG9mIHRoZSBkYXRhLlwifSx7XCJpZFwiOlwiNDQwMVwiLFwiY29kZVwiOlwiUy1JRCA4XCIsXCJuYW1lXCI6XCJVc2luZyB0ZWNobm9sb2d5LCBjb21wdXRlIGFuZCBpbnRlcnByZXQgdGhlIGNvcnJlbGF0aW9uIGNvZWZmaWNpZW50IG9mIGEgbGluZWFyIGZpdC5cIn0se1wiaWRcIjpcIjQ0MDJcIixcImNvZGVcIjpcIlMtSUQgOVwiLFwibmFtZVwiOlwiRGlzdGluZ3Vpc2ggYmV0d2VlbiBjb3JyZWxhdGlvbiBhbmQgY2F1c2F0aW9uLlwifV19XTtcclxuXHRzZWxmLmJpZ1N0ZExpc3QgPSBfLmZsYXR0ZW4oXy5tYXAoc2VsZi5hbGxTdGRzLCBmdW5jdGlvbihlbnRyeSl7IHJldHVybiBbZW50cnkuY29kZV0uY29uY2F0KF8ucGx1Y2soZW50cnkuY2hpbGRyZW4sICdjb2RlJykpfSkpO1xyXG5cclxuXHRzZWxmLmN1clN0ZCA9IFwiQS1BUFIuMlwiO1xyXG5cdHNlbGYuY3VyU3R1ZGVudCA9IFwiQWxsIFN0dWRlbnRzXCI7XHJcblxyXG5cdHNlbGYuc3RhbmRhcmREZXRhaWwgPSBbXHJcblx0XHR7bmFtZTogJ0EtQ0VELjEnLCBncmFkZTogNjgsIHN0dWRlbnQ6IDcxLCBkdWU6ICc0LzIvMTUnLCBjb3JyZWN0OiAxNSwgbWlzc2VkOiA1LCBiYXI6IGdldEJhcig1KSwgZXBmOiBbMSwgNiwgNl0sIHBsdXI6IFtwbHVyYWwoMSksIHBsdXJhbCg2KSwgcGx1cmFsKDYpXX0sXHJcblx0XHR7bmFtZTogJ0EtQ0VELjInLCBncmFkZTogODQsIHN0dWRlbnQ6IDkzLCBkdWU6ICc0LzQvMTUnLCBwZW5kaW5nOiB0cnVlLCBjb3JyZWN0OiAyNSwgbWlzc2VkOiA1LCBiYXI6IGdldEJhcigxKSwgZXBmOiBbNSwgMywgNV0sIHBsdXI6IFtwbHVyYWwoNSksIHBsdXJhbCgzKSwgcGx1cmFsKDUpXX0sXHJcblx0XHR7bmFtZTogJ0EtQ0VELjMnLCBncmFkZTogNzUsIHN0dWRlbnQ6IDg5LCBkdWU6ICc0LzYvMTUnLCBjb3JyZWN0OiAzLCBtaXNzZWQ6IDEsIGJhcjogZ2V0QmFyKDcpLCBlcGY6IFsyLCA2LCA1XSwgcGx1cjogW3BsdXJhbCgyKSwgcGx1cmFsKDYpLCBwbHVyYWwoNSldfSxcclxuXHRcdHtuYW1lOiAnQS1DRUQuNCcsIGdyYWRlOiA3OSwgc3R1ZGVudDogODQsIGR1ZTogJzQvOC8xNScsIHBlbmRpbmc6IHRydWUsIGNvcnJlY3Q6IDEyLCBtaXNzZWQ6IDcsIGJhcjogZ2V0QmFyKDEpLCBlcGY6IFs1LCAzLCA1XSwgcGx1cjogW3BsdXJhbCg1KSwgcGx1cmFsKDMpLCBwbHVyYWwoNSldfSxcclxuXHRdO1xyXG5cclxuXHRzZWxmLmNhdGVnb3JpZXMgPSBbJ0hvbWV3b3JrJywgJ1F1aXonLCAnVGVzdCcsICdpLVByYWN0aWNlJ107XHJcblxyXG5cdHNlbGYucmVwb3J0VGl0bGUgPSBcIlNlbGVjdCBhIHJlcG9ydFwiO1xyXG5cclxuXHRzZWxmLnByb2JsZW1MaXN0ID0gW3tcImlkXCI6XCI3Mjk2OFwiLFwic3RhbmRhcmRzXCI6W3tcImlkXCI6XCIyNDU0XCIsXCJuYW1lXCI6XCIxLjFcIixcImNsYXNzaWRcIjpcIjVcIn0se1wiaWRcIjpcIjUxMDlcIixcIm5hbWVcIjpcIlIuMVwiLFwiY2xhc3NpZFwiOlwiOVwifV0sXCJ2YXJzXCI6W3tcImxhYmVsXCI6XCJhXCIsXCJzdGVwXCI6XCIxXCIsXCJtaW5cIjpcIjJcIixcIm1heFwiOlwiMjBcIn1dLFwicVwiOlwiV3JpdGUgYW4gZXhwcmVzc2lvbiBmb3IgdGhlIHRvdGFsIGNvc3Qgb2YgW2FdIHNoaXJ0cyB3aGVuIGVhY2ggY29zdHMgPGk+eDxcXC9pPiBkb2xsYXJzLlwiLFwiYVwiOlwiPG1hdGggeG1sbnM9XFxcImh0dHA6XFwvXFwvd3d3LnczLm9yZ1xcLzE5OThcXC9NYXRoXFwvTWF0aE1MXFxcIj48bXJvdz48bXRleHQ+W2FdPFxcL210ZXh0PjxtaT54PFxcL21pPjxcXC9tcm93PjxcXC9tYXRoPlwiLFwiYW5zVHlwZVwiOlwiaW5wdXRcIixcInBvaW50c1wiOjMsXCJ2aWRlb1wiOlwid3JpdGVfYWxnZWJyYWljX2V4cHJlc3Npb25zX2Fib3V0X3Byb2R1Y3RzXCJ9LHtcImlkXCI6XCI3Mjk3NFwiLFwic3RhbmRhcmRzXCI6W3tcImlkXCI6XCIyNDU0XCIsXCJuYW1lXCI6XCIxLjFcIixcImNsYXNzaWRcIjpcIjVcIn0se1wiaWRcIjpcIjUxMDlcIixcIm5hbWVcIjpcIlIuMVwiLFwiY2xhc3NpZFwiOlwiOVwifV0sXCJ2YXJzXCI6W3tcImxhYmVsXCI6XCJhXCIsXCJzdGVwXCI6XCIxXCIsXCJtaW5cIjpcIjVcIixcIm1heFwiOlwiMTBcIn1dLFwiY29uc3RyYWludHNcIjpbXCJhIT02XCJdLFwicVwiOlwiPHA+VXNlIHRoZSB0YWJsZSB0byBjaG9vc2UgdGhlIGNvcnJlY3QgZXhwcmVzc2lvbiBmb3IgdGhlIGNvc3Qgb2Ygc2hpcHBpbmcgZ2lmdCBiYXNrZXRzIGJhc2VkIG9uIHRoZSBudW1iZXIgb2YgYmFza2V0cyB5b3UgYnV5LjxcXC9wPlxcblxcbjxwPjxtYXRoIHhtbG5zPVxcXCJodHRwOlxcL1xcL3d3dy53My5vcmdcXC8xOTk4XFwvTWF0aFxcL01hdGhNTFxcXCI+PG1yb3c+PG10YWJsZSBjb2x1bW5hbGlnbj1cXFwibGVmdFxcXCI+PG10ciBjb2x1bW5hbGlnbj1cXFwibGVmdFxcXCI+PG10ZCBjb2x1bW5hbGlnbj1cXFwibGVmdFxcXCI+PG1yb3c+PG1pPk48XFwvbWk+PG1pPnU8XFwvbWk+PG1pPm08XFwvbWk+PG1pPmI8XFwvbWk+PG1pPmU8XFwvbWk+PG1pPnI8XFwvbWk+PG10ZXh0PiYjMTYwOzxcXC9tdGV4dD48bWk+bzxcXC9taT48bWk+ZjxcXC9taT48bXRleHQ+JiMxNjA7PFxcL210ZXh0PjxtaT5iPFxcL21pPjxtaT5hPFxcL21pPjxtaT5zPFxcL21pPjxtaT5rPFxcL21pPjxtaT5lPFxcL21pPjxtaT50PFxcL21pPjxtaT5zPFxcL21pPjxtcm93Pjxtbz4oPFxcL21vPjxtaT5OPFxcL21pPjxtbz4pPFxcL21vPjxcXC9tcm93PjxtdGV4dD4mIzE2MDsmIzE2MDs8XFwvbXRleHQ+PFxcL21yb3c+PFxcL210ZD48bXRkIGNvbHVtbmFsaWduPVxcXCJsZWZ0XFxcIj48bXJvdz48bWk+UzxcXC9taT48bWk+aDxcXC9taT48bWk+aTxcXC9taT48bWk+cDxcXC9taT48bWk+cDxcXC9taT48bWk+aTxcXC9taT48bWk+bjxcXC9taT48bWk+ZzxcXC9taT48bXRleHQ+JiMxNjA7PFxcL210ZXh0PjxtaT5jPFxcL21pPjxtaT5vPFxcL21pPjxtaT5zPFxcL21pPjxtaT50PFxcL21pPjxtdGV4dD4mIzE2MDs8XFwvbXRleHQ+PG1pPmk8XFwvbWk+PG1pPm48XFwvbWk+PG10ZXh0PiYjMTYwOzxcXC9tdGV4dD48bWk+ZDxcXC9taT48bWk+bzxcXC9taT48bWk+bDxcXC9taT48bWk+bDxcXC9taT48bWk+YTxcXC9taT48bWk+cjxcXC9taT48bWk+czxcXC9taT48XFwvbXJvdz48XFwvbXRkPjxcXC9tdHI+PG10ciBjb2x1bW5hbGlnbj1cXFwibGVmdFxcXCI+PG10ZCBjb2x1bW5hbGlnbj1cXFwibGVmdFxcXCI+PG1uPjE8XFwvbW4+PFxcL210ZD48bXRkIGNvbHVtbmFsaWduPVxcXCJsZWZ0XFxcIj48bXJvdz48bXRleHQ+W2FdPFxcL210ZXh0PjxcXC9tcm93PjxcXC9tdGQ+PFxcL210cj48bXRyIGNvbHVtbmFsaWduPVxcXCJsZWZ0XFxcIj48bXRkIGNvbHVtbmFsaWduPVxcXCJsZWZ0XFxcIj48bW4+MjxcXC9tbj48XFwvbXRkPjxtdGQgY29sdW1uYWxpZ249XFxcImxlZnRcXFwiPjxtcm93PjxtdGV4dD5bYSsyXTxcXC9tdGV4dD48XFwvbXJvdz48XFwvbXRkPjxcXC9tdHI+PG10ciBjb2x1bW5hbGlnbj1cXFwibGVmdFxcXCI+PG10ZCBjb2x1bW5hbGlnbj1cXFwibGVmdFxcXCI+PG1uPjM8XFwvbW4+PFxcL210ZD48bXRkIGNvbHVtbmFsaWduPVxcXCJsZWZ0XFxcIj48bXJvdz48bXRleHQ+W2ErNF08XFwvbXRleHQ+PFxcL21yb3c+PFxcL210ZD48XFwvbXRyPjxtdHIgY29sdW1uYWxpZ249XFxcImxlZnRcXFwiPjxtdGQgY29sdW1uYWxpZ249XFxcImxlZnRcXFwiPjxtbj40PFxcL21uPjxcXC9tdGQ+PG10ZCBjb2x1bW5hbGlnbj1cXFwibGVmdFxcXCI+PG1yb3c+PG10ZXh0PlthKzZdPFxcL210ZXh0PjxcXC9tcm93PjxcXC9tdGQ+PFxcL210cj48XFwvbXRhYmxlPjxcXC9tcm93PjxcXC9tYXRoPjxcXC9wPlxcblwiLFwiY2hvaWNlc1wiOlt7XCJpZFwiOlwiOTIzMTBcIixcImFcIjpcIjI8aT5OIDxcXC9pPisgW2EtMl1cIn0se1wiaWRcIjpcIjkyMzExXCIsXCJhXCI6XCIyPGk+TiA8XFwvaT4rIDRcIn0se1wiaWRcIjpcIjkyMzEyXCIsXCJhXCI6XCI8aT5OIDxcXC9pPisgNFwifSx7XCJpZFwiOlwiOTIzMTNcIixcImFcIjpcIjI8aT5OPFxcL2k+XCJ9XSxcImFcIjpcIjkyMzEwXCIsXCJhbnNUeXBlXCI6XCJyYWRpb1wiLFwicG9pbnRzXCI6NSxcInZpZGVvXCI6XCJ3cml0ZV9hbGdlYnJhaWNfZXhwcmVzc2lvbnNfdXNpbmdfdGhlX2lucHV0X2FuZF9vdXRwdXRfdmFsdWVzX2Zyb21cIn0se1wiaWRcIjpcIjczNzQ2XCIsXCJzdGFuZGFyZHNcIjpbe1wiaWRcIjpcIjI0NTRcIixcIm5hbWVcIjpcIjEuMVwiLFwiY2xhc3NpZFwiOlwiNVwifSx7XCJpZFwiOlwiNTEwOVwiLFwibmFtZVwiOlwiUi4xXCIsXCJjbGFzc2lkXCI6XCI5XCJ9XSxcInZhcnNcIjpbe1wibGFiZWxcIjpcImFcIixcInN0ZXBcIjpcIjFcIixcIm1pblwiOlwiMlwiLFwibWF4XCI6XCI1MFwifV0sXCJwcmVmaXhcIjpcIldyaXRlIGFuIGFsZ2VicmFpYyBleHByZXNzaW9uIGZvcjpcIixcInFcIjpcIjxpPk08XFwvaT4gbGVzcyB0aGFuIDxtYXRoIHhtbG5zPVxcXCJodHRwOlxcL1xcL3d3dy53My5vcmdcXC8xOTk4XFwvTWF0aFxcL01hdGhNTFxcXCI+PG1yb3c+PG1yb3c+PG10ZXh0PlthXTxcXC9tdGV4dD48XFwvbXJvdz48XFwvbXJvdz48XFwvbWF0aD5cIixcImFcIjpcIjxtYXRoIHhtbG5zPVxcXCJodHRwOlxcL1xcL3d3dy53My5vcmdcXC8xOTk4XFwvTWF0aFxcL01hdGhNTFxcXCI+PG1yb3c+PG1yb3c+PG10ZXh0PlthXTxcXC9tdGV4dD48XFwvbXJvdz48bW8+LTxcXC9tbz48bWk+TTxcXC9taT48XFwvbXJvdz48XFwvbWF0aD5cIixcImFuc1R5cGVcIjpcImlucHV0XCIsXCJwb2ludHNcIjozLFwidmlkZW9cIjpcIndyaXRlX2FsZ2VicmFpY19leHByZXNzaW9uc19hYm91dF9zdW1zX2FuZF9kaWZmZXJlbmNlc1wifSx7XCJpZFwiOlwiNzM3NDdcIixcInN0YW5kYXJkc1wiOlt7XCJpZFwiOlwiMjQ1NFwiLFwibmFtZVwiOlwiMS4xXCIsXCJjbGFzc2lkXCI6XCI1XCJ9LHtcImlkXCI6XCI1MTA5XCIsXCJuYW1lXCI6XCJSLjFcIixcImNsYXNzaWRcIjpcIjlcIn1dLFwidmFyc1wiOlt7XCJsYWJlbFwiOlwiYlwiLFwic3RlcFwiOlwiMVwiLFwibWluXCI6XCIyXCIsXCJtYXhcIjpcIjIwXCJ9LHtcImxhYmVsXCI6XCJhXCIsXCJzdGVwXCI6XCIxXCIsXCJtaW5cIjpcIjJcIixcIm1heFwiOlwiMjBcIn1dLFwicHJlZml4XCI6XCJXcml0ZSBhbiBhbGdlYnJhaWMgZXhwcmVzc2lvbiBmb3I6XCIsXCJxXCI6XCI8bWF0aCB4bWxucz1cXFwiaHR0cDpcXC9cXC93d3cudzMub3JnXFwvMTk5OFxcL01hdGhcXC9NYXRoTUxcXFwiPjxtcm93Pjxtcm93PjxtdGV4dD5bYV08XFwvbXRleHQ+PFxcL21yb3c+PFxcL21yb3c+PFxcL21hdGg+IG1vcmUgdGhhbiA8aT56PFxcL2k+IHRpbWVzIDxtYXRoIHhtbG5zPVxcXCJodHRwOlxcL1xcL3d3dy53My5vcmdcXC8xOTk4XFwvTWF0aFxcL01hdGhNTFxcXCI+PG1yb3c+PG1yb3c+PG10ZXh0PltiXTxcXC9tdGV4dD48XFwvbXJvdz48XFwvbXJvdz48XFwvbWF0aD5cIixcImFcIjpcIjxtYXRoIHhtbG5zPVxcXCJodHRwOlxcL1xcL3d3dy53My5vcmdcXC8xOTk4XFwvTWF0aFxcL01hdGhNTFxcXCI+PG1yb3c+PG1yb3c+PG10ZXh0PltiXTxcXC9tdGV4dD48XFwvbXJvdz48bWk+ejxcXC9taT48bW8+KzxcXC9tbz48bXJvdz48bXRleHQ+W2FdPFxcL210ZXh0PjxcXC9tcm93PjxcXC9tcm93PjxcXC9tYXRoPlwiLFwiYW5zVHlwZVwiOlwiaW5wdXRcIixcInBvaW50c1wiOjN9LHtcImlkXCI6XCI3Mzc0OFwiLFwic3RhbmRhcmRzXCI6W3tcImlkXCI6XCIyNDU0XCIsXCJuYW1lXCI6XCIxLjFcIixcImNsYXNzaWRcIjpcIjVcIn0se1wiaWRcIjpcIjUxMDlcIixcIm5hbWVcIjpcIlIuMVwiLFwiY2xhc3NpZFwiOlwiOVwifV0sXCJ2YXJzXCI6W3tcImxhYmVsXCI6XCJhXCIsXCJzdGVwXCI6XCIxXCIsXCJtaW5cIjpcIjVcIixcIm1heFwiOlwiMzBcIn1dLFwicVwiOlwiPHA+VGhlcmUgYXJlIDxtYXRoIHhtbG5zPVxcXCJodHRwOlxcL1xcL3d3dy53My5vcmdcXC8xOTk4XFwvTWF0aFxcL01hdGhNTFxcXCI+PG1yb3c+PG1yb3c+PG10ZXh0PlthXTxcXC9tdGV4dD48XFwvbXJvdz48XFwvbXJvdz48XFwvbWF0aD4gY2VsbCBwaG9uZXMgdG8gY2hvb3NlIGZyb20sIGFuZCA8aT5iIDxcXC9pPm9mIHRob3NlIGNlbGwgcGhvbmVzIGFyZSBibGFjay48XFwvcD5cXG5cXG48cD5Xcml0ZSBhbiBleHByZXNzaW9uIGZvciB0aGUgbnVtYmVyIG9mIGNlbGwgcGhvbmVzIHRoYXQgYXJlIG5vdCBibGFjay48XFwvcD5cXG5cIixcImFcIjpcIjxtYXRoIHhtbG5zPVxcXCJodHRwOlxcL1xcL3d3dy53My5vcmdcXC8xOTk4XFwvTWF0aFxcL01hdGhNTFxcXCI+PG1yb3c+PG1yb3c+PG10ZXh0PlthXTxcXC9tdGV4dD48XFwvbXJvdz48bW8+LTxcXC9tbz48bWk+YjxcXC9taT48XFwvbXJvdz48XFwvbWF0aD5cIixcImFuc1R5cGVcIjpcImlucHV0XCIsXCJwb2ludHNcIjozLFwidmlkZW9cIjpcIndyaXRlX2FsZ2VicmFpY19leHByZXNzaW9uc19hYm91dF9zdW1zX2FuZF9kaWZmZXJlbmNlc1wifSx7XCJpZFwiOlwiNzM3NDlcIixcInN0YW5kYXJkc1wiOlt7XCJpZFwiOlwiMjQ1NFwiLFwibmFtZVwiOlwiMS4xXCIsXCJjbGFzc2lkXCI6XCI1XCJ9LHtcImlkXCI6XCI1MTA5XCIsXCJuYW1lXCI6XCJSLjFcIixcImNsYXNzaWRcIjpcIjlcIn1dLFwidmFyc1wiOlt7XCJsYWJlbFwiOlwiYVwiLFwic3RlcFwiOlwiMVwiLFwibWluXCI6XCIyXCIsXCJtYXhcIjpcIjIwXCJ9XSxcInFcIjpcIjxwPlRoZXJlIGFyZSA8bWF0aCB4bWxucz1cXFwiaHR0cDpcXC9cXC93d3cudzMub3JnXFwvMTk5OFxcL01hdGhcXC9NYXRoTUxcXFwiPjxtcm93Pjxtcm93PjxtdGV4dD5bYV08XFwvbXRleHQ+PFxcL21yb3c+PFxcL21yb3c+PFxcL21hdGg+IG1vcmUgd29tZW4gdGhhbiB0aGVyZSBhcmUgbWVuIGF0IGEgUFRBIG1lZXRpbmcuPFxcL3A+XFxuXFxuPHA+VXNpbmcgPGk+bTxcXC9pPiB0byByZXByZXNlbnQgdGhlIG51bWJlciBvZiBtZW4sIHdyaXRlIGFuIGV4cHJlc3Npb24gZm9yIHRoZSBudW1iZXIgb2Ygd29tZW4uPFxcL3A+XFxuXCIsXCJhXCI6XCI8bWF0aCB4bWxucz1cXFwiaHR0cDpcXC9cXC93d3cudzMub3JnXFwvMTk5OFxcL01hdGhcXC9NYXRoTUxcXFwiPjxtcm93Pjxtcm93PjxtdGV4dD5bYV08XFwvbXRleHQ+PFxcL21yb3c+PG1vPis8XFwvbW8+PG1pPm08XFwvbWk+PFxcL21yb3c+PFxcL21hdGg+XCIsXCJhbnNUeXBlXCI6XCJpbnB1dFwiLFwicG9pbnRzXCI6MyxcInZpZGVvXCI6XCJ3cml0ZV9hbGdlYnJhaWNfZXhwcmVzc2lvbnNfYWJvdXRfc3Vtc19hbmRfZGlmZmVyZW5jZXNcIn0se1wiaWRcIjpcIjczNzUwXCIsXCJzdGFuZGFyZHNcIjpbe1wiaWRcIjpcIjI0NTRcIixcIm5hbWVcIjpcIjEuMVwiLFwiY2xhc3NpZFwiOlwiNVwifSx7XCJpZFwiOlwiNTEwOVwiLFwibmFtZVwiOlwiUi4xXCIsXCJjbGFzc2lkXCI6XCI5XCJ9XSxcInZhcnNcIjpbe1wibGFiZWxcIjpcImFcIixcInN0ZXBcIjpcIjFcIixcIm1pblwiOlwiMlwiLFwibWF4XCI6XCIxMlwifV0sXCJxXCI6XCI8cD5PbiB0aGUgc2hlbHZlcyBvZiBhIG5vdmVsdHkgc3RvcmUsIHRoZXJlIGFyZSA8bWF0aCB4bWxucz1cXFwiaHR0cDpcXC9cXC93d3cudzMub3JnXFwvMTk5OFxcL01hdGhcXC9NYXRoTUxcXFwiPjxtcm93Pjxtcm93PjxtdGV4dD5bYV08XFwvbXRleHQ+PFxcL21yb3c+PFxcL21yb3c+PFxcL21hdGg+IHRpbWVzIGFzIG1hbnkgcnViYmVyIGNoaWNrZW5zIGFzIHRoZXJlIGFyZSB3aG9vcGVlIGN1c2hpb25zLjxcXC9wPlxcblxcbjxwPlVzaW5nIDxpPnc8XFwvaT4gdG8gcmVwcmVzZW50IHRoZSBudW1iZXIgb2Ygd2hvb3BlZSBjdXNoaW9ucywgd3JpdGUgYW4gZXhwcmVzc2lvbiB0byBzaG93IGhvdyBtYW55IHJ1YmJlciBjaGlja2VucyB0aGVyZSBhcmUuPFxcL3A+XCIsXCJhXCI6XCI8bWF0aCB4bWxucz1cXFwiaHR0cDpcXC9cXC93d3cudzMub3JnXFwvMTk5OFxcL01hdGhcXC9NYXRoTUxcXFwiPjxtcm93Pjxtcm93PjxtdGV4dD5bYV08XFwvbXRleHQ+PFxcL21yb3c+PG1pPnc8XFwvbWk+PFxcL21yb3c+PFxcL21hdGg+XCIsXCJhbnNUeXBlXCI6XCJpbnB1dFwiLFwicG9pbnRzXCI6MyxcInZpZGVvXCI6XCJ3cml0ZV9hbGdlYnJhaWNfZXhwcmVzc2lvbnNfYWJvdXRfcHJvZHVjdHNcIn0se1wiaWRcIjpcIjczNzUxXCIsXCJzdGFuZGFyZHNcIjpbe1wiaWRcIjpcIjI0NTRcIixcIm5hbWVcIjpcIjEuMVwiLFwiY2xhc3NpZFwiOlwiNVwifSx7XCJpZFwiOlwiNTEwOVwiLFwibmFtZVwiOlwiUi4xXCIsXCJjbGFzc2lkXCI6XCI5XCJ9XSxcInZhcnNcIjpbe1wibGFiZWxcIjpcImFcIixcInN0ZXBcIjpcIjFcIixcIm1pblwiOlwiMTBcIixcIm1heFwiOlwiMTAwXCJ9XSxcInFcIjpcIjxwPkluIGEgZ3JvY2VyeSBzdG9yZSwgPG1hdGggeG1sbnM9XFxcImh0dHA6XFwvXFwvd3d3LnczLm9yZ1xcLzE5OThcXC9NYXRoXFwvTWF0aE1MXFxcIj48bXJvdz48bXJvdz48bXRleHQ+W2FdPFxcL210ZXh0PjxcXC9tcm93PjxcXC9tcm93PjxcXC9tYXRoPiBtb3JlIHBhcGVyIGJhZ3Mgd2VyZSB1c2VkIHRoYW4gcGxhc3RpYyBiYWdzLjxcXC9wPlxcblxcbjxwPkxldCA8aT5wPFxcL2k+IHJlcHJlc2VudCB0aGUgbnVtYmVyIG9mIHBhcGVyIGJhZ3MgdXNlZCwgYW5kIHdyaXRlIGFuIGV4cHJlc3Npb24gZm9yIHRoZSBudW1iZXIgb2YgcGxhc3RpYyBiYWdzIHVzZWQuPFxcL3A+XFxuXCIsXCJhXCI6XCI8bWF0aCB4bWxucz1cXFwiaHR0cDpcXC9cXC93d3cudzMub3JnXFwvMTk5OFxcL01hdGhcXC9NYXRoTUxcXFwiPjxtcm93PjxtaT5wPFxcL21pPjxtbz4tPFxcL21vPjxtcm93PjxtdGV4dD5bYV08XFwvbXRleHQ+PFxcL21yb3c+PFxcL21yb3c+PFxcL21hdGg+XCIsXCJhbnNUeXBlXCI6XCJpbnB1dFwiLFwicG9pbnRzXCI6MyxcInZpZGVvXCI6XCJ3cml0ZV9hbGdlYnJhaWNfZXhwcmVzc2lvbnNfYWJvdXRfc3Vtc19hbmRfZGlmZmVyZW5jZXNcIn0se1wiaWRcIjpcIjczNzUyXCIsXCJzdGFuZGFyZHNcIjpbe1wiaWRcIjpcIjI0NTRcIixcIm5hbWVcIjpcIjEuMVwiLFwiY2xhc3NpZFwiOlwiNVwifSx7XCJpZFwiOlwiNTEwOVwiLFwibmFtZVwiOlwiUi4xXCIsXCJjbGFzc2lkXCI6XCI5XCJ9XSxcInZhcnNcIjpbe1wibGFiZWxcIjpcImFcIixcInN0ZXBcIjpcIjFcIixcIm1pblwiOlwiMTBcIixcIm1heFwiOlwiNTBcIn1dLFwicVwiOlwiPHA+VGhlcmUgYXJlIDxtYXRoIHhtbG5zPVxcXCJodHRwOlxcL1xcL3d3dy53My5vcmdcXC8xOTk4XFwvTWF0aFxcL01hdGhNTFxcXCI+PG1yb3c+PG1yb3c+PG10ZXh0PlthXTxcXC9tdGV4dD48XFwvbXJvdz48XFwvbXJvdz48XFwvbWF0aD4gcGVvcGxlIGluIGEgcmVzdGF1cmFudC48XFwvcD5cXG5cXG48cD5FYWNoIHBlcnNvbiBvcmRlcnMgZWl0aGVyIGNvZmZlZSBvciB0ZWEuPFxcL3A+XFxuXFxuPHA+SWYgPGk+cDxcXC9pPiBwZW9wbGUgb3JkZXIgY29mZmVlLCB3cml0ZSBhbiBleHByZXNzaW9uIGZvciB0aGUgbnVtYmVyIG9mIHBlb3BsZSB3aG8gb3JkZXIgdGVhLjxcXC9wPlxcblwiLFwiYVwiOlwiPG1hdGggeG1sbnM9XFxcImh0dHA6XFwvXFwvd3d3LnczLm9yZ1xcLzE5OThcXC9NYXRoXFwvTWF0aE1MXFxcIj48bXJvdz48bXJvdz48bXRleHQ+W2FdPFxcL210ZXh0PjxcXC9tcm93Pjxtbz4tPFxcL21vPjxtaT5wPFxcL21pPjxcXC9tcm93PjxcXC9tYXRoPlwiLFwiYW5zVHlwZVwiOlwiaW5wdXRcIixcInBvaW50c1wiOjMsXCJ2aWRlb1wiOlwid3JpdGVfYWxnZWJyYWljX2V4cHJlc3Npb25zX2Fib3V0X3N1bXNfYW5kX2RpZmZlcmVuY2VzXCJ9LHtcImlkXCI6XCI3Mzc2MFwiLFwic3RhbmRhcmRzXCI6W3tcImlkXCI6XCIyNDU0XCIsXCJuYW1lXCI6XCIxLjFcIixcImNsYXNzaWRcIjpcIjVcIn0se1wiaWRcIjpcIjUxMDlcIixcIm5hbWVcIjpcIlIuMVwiLFwiY2xhc3NpZFwiOlwiOVwifV0sXCJ2YXJzXCI6W3tcImxhYmVsXCI6XCJiXCIsXCJzdGVwXCI6XCIxXCIsXCJtaW5cIjpcIjJcIixcIm1heFwiOlwiMTBcIn0se1wibGFiZWxcIjpcImFcIixcInN0ZXBcIjpcIjFcIixcIm1pblwiOlwiMlwiLFwibWF4XCI6XCIxMFwifV0sXCJxXCI6XCI8cD5JbiB0aGUgZ2FtZSBvZiBob3JzZXNob2VzLCBjb250ZXN0YW50cyB0b3NzIFUtc2hhcGVkIGhvcnNlc2hvZXMgdG93YXJkIGEgc3Rha2UuIE9uZSBtZXRob2Qgb2Ygc2NvcmluZyBncmFudHMgMyBwb2ludHMgZm9yIGEgPGk+cmluZ2VyPFxcL2k+IChhIGhvcnNlc2hvZSB0aGF0IGVuY2lyY2xlcyB0aGUgc3Rha2UpIGFuZCAxIHBvaW50IGZvciBhIDxpPmxlYW5lcjxcXC9pPiAoYSBob3JzZXNob2UgdGhhdCB0b3VjaGVzIHRoZSBzdGFrZSBidXQgaXMgbm90IGEgcmluZ2VyKS4gTWVsaXNzYSBzY29yZXMgPG1hdGggeG1sbnM9XFxcImh0dHA6XFwvXFwvd3d3LnczLm9yZ1xcLzE5OThcXC9NYXRoXFwvTWF0aE1MXFxcIj48bXJvdz48bXJvdz48bXRleHQ+W2FdPFxcL210ZXh0PjxcXC9tcm93PjxcXC9tcm93PjxcXC9tYXRoPiByaW5nZXJzIGFuZCA8bWF0aCB4bWxucz1cXFwiaHR0cDpcXC9cXC93d3cudzMub3JnXFwvMTk5OFxcL01hdGhcXC9NYXRoTUxcXFwiPjxtcm93Pjxtcm93PjxtdGV4dD5bYl08XFwvbXRleHQ+PFxcL21yb3c+PFxcL21yb3c+PFxcL21hdGg+IGxlYW5lcnMuPFxcL3A+XFxuXFxuPHA+SG93IG1hbnkgcG9pbnRzIGRpZCBzaGUgc2NvcmU/PFxcL3A+XFxuXCIsXCJhXCI6XCI8bWF0aCB4bWxucz1cXFwiaHR0cDpcXC9cXC93d3cudzMub3JnXFwvMTk5OFxcL01hdGhcXC9NYXRoTUxcXFwiPjxtYWN0aW9uIHNlbGVjdGlvbj1cXFwiMVxcXCIgYWN0aW9udHlwZT1cXFwiaW5wdXRcXFwiPjxtdGV4dD5bMyphK2JdPFxcL210ZXh0PjxcXC9tYWN0aW9uPjxcXC9tYXRoPlwiLFwiYW5zVHlwZVwiOlwiTXVsdEtpbmV0aWNcIixcInBvaW50c1wiOjUsXCJ2aWRlb1wiOlwid3JpdGVfYWxnZWJyYWljX2V4cHJlc3Npb25zX2Fib3V0X3N1bXNfYW5kX2RpZmZlcmVuY2VzXCJ9LHtcImlkXCI6XCI3NDA4NVwiLFwic3RhbmRhcmRzXCI6W3tcImlkXCI6XCIyNDU0XCIsXCJuYW1lXCI6XCIxLjFcIixcImNsYXNzaWRcIjpcIjVcIn0se1wiaWRcIjpcIjUxMDlcIixcIm5hbWVcIjpcIlIuMVwiLFwiY2xhc3NpZFwiOlwiOVwifV0sXCJ2YXJzXCI6W3tcImxhYmVsXCI6XCJhXCIsXCJzdGVwXCI6XCIxXCIsXCJtaW5cIjpcIjJcIixcIm1heFwiOlwiMjBcIn1dLFwicVwiOlwiV3JpdGUgYW4gZXhwcmVzc2lvbiBmb3IgdGhlIHRvdGFsIG51bWJlciBvZiBjYWxvcmllcyBpbiBbYV0gZnJpZXMgd2hlbiB0aGVyZSBhcmUgPGk+eDxcXC9pPiBjYWxvcmllcyBwZXIgZnJ5LlwiLFwiYVwiOlwiPG1hdGggeG1sbnM9XFxcImh0dHA6XFwvXFwvd3d3LnczLm9yZ1xcLzE5OThcXC9NYXRoXFwvTWF0aE1MXFxcIj48bXJvdz48bXRleHQ+W2FdPFxcL210ZXh0PjxtaT54PFxcL21pPjxcXC9tcm93PjxcXC9tYXRoPlwiLFwiYW5zVHlwZVwiOlwiaW5wdXRcIixcInBvaW50c1wiOjMsXCJ2aWRlb1wiOlwid3JpdGVfYWxnZWJyYWljX2V4cHJlc3Npb25zX2Fib3V0X3Byb2R1Y3RzXCJ9LHtcImlkXCI6XCI3NDA4NlwiLFwic3RhbmRhcmRzXCI6W3tcImlkXCI6XCIyNDU0XCIsXCJuYW1lXCI6XCIxLjFcIixcImNsYXNzaWRcIjpcIjVcIn0se1wiaWRcIjpcIjUxMDlcIixcIm5hbWVcIjpcIlIuMVwiLFwiY2xhc3NpZFwiOlwiOVwifV0sXCJ2YXJzXCI6W3tcImxhYmVsXCI6XCJhXCIsXCJzdGVwXCI6XCIxXCIsXCJtaW5cIjpcIjJcIixcIm1heFwiOlwiMjBcIn1dLFwicVwiOlwiV3JpdGUgYW4gZXhwcmVzc2lvbiBmb3IgdGhlIHRvdGFsIGNvc3Qgb2YgW2FdIHNoaXJ0cyB3aGVuIGVhY2ggY29zdHMgPGk+eDxcXC9pPiBkb2xsYXJzLlwiLFwiYVwiOlwiPG1hdGggeG1sbnM9XFxcImh0dHA6XFwvXFwvd3d3LnczLm9yZ1xcLzE5OThcXC9NYXRoXFwvTWF0aE1MXFxcIj48bXJvdz48bXRleHQ+W2FdPFxcL210ZXh0PjxtaT54PFxcL21pPjxcXC9tcm93PjxcXC9tYXRoPlwiLFwiYW5zVHlwZVwiOlwiaW5wdXRcIixcInBvaW50c1wiOjMsXCJ2aWRlb1wiOlwid3JpdGVfYWxnZWJyYWljX2V4cHJlc3Npb25zX2Fib3V0X3Byb2R1Y3RzXCJ9LHtcImlkXCI6XCI3NDA4N1wiLFwic3RhbmRhcmRzXCI6W3tcImlkXCI6XCIyNDU0XCIsXCJuYW1lXCI6XCIxLjFcIixcImNsYXNzaWRcIjpcIjVcIn0se1wiaWRcIjpcIjUxMDlcIixcIm5hbWVcIjpcIlIuMVwiLFwiY2xhc3NpZFwiOlwiOVwifV0sXCJ2YXJzXCI6W3tcImxhYmVsXCI6XCJhXCIsXCJzdGVwXCI6XCIxXCIsXCJtaW5cIjpcIjJcIixcIm1heFwiOlwiMjBcIn1dLFwicVwiOlwiW2FdIGFwcGxlcyBhcmUgcGlja2VkIGZyb20gYSB0cmVlIGFuZCBwbGFjZWQgZXZlbmx5IGludG8gPGk+eDxcXC9pPiBib3hlcy4gV3JpdGUgYW4gZXhwcmVzc2lvbiBmb3IgdGhlIG51bWJlciBvZiBhcHBsZXMgaW4gZWFjaCBib3guXCIsXCJhXCI6XCI8bWF0aCB4bWxucz1cXFwiaHR0cDpcXC9cXC93d3cudzMub3JnXFwvMTk5OFxcL01hdGhcXC9NYXRoTUxcXFwiPjxtcm93PjxtZnJhYyBsaW5ldGhpY2tuZXNzPVxcXCJ0aGluXFxcIj48bXJvdz48bXRleHQ+W2FdPFxcL210ZXh0PjxcXC9tcm93PjxtaT54PFxcL21pPjxcXC9tZnJhYz48XFwvbXJvdz48XFwvbWF0aD5cIixcImFuc1R5cGVcIjpcImlucHV0XCIsXCJwb2ludHNcIjozLFwidmlkZW9cIjpcIndyaXRlX2FsZ2VicmFpY19leHByZXNzaW9uc19hYm91dF9wcm9kdWN0c1wifSx7XCJpZFwiOlwiNzQ4NDVcIixcInN0YW5kYXJkc1wiOlt7XCJpZFwiOlwiMjQ1NFwiLFwibmFtZVwiOlwiMS4xXCIsXCJjbGFzc2lkXCI6XCI1XCJ9LHtcImlkXCI6XCI1MTA5XCIsXCJuYW1lXCI6XCJSLjFcIixcImNsYXNzaWRcIjpcIjlcIn1dLFwicHJlZml4XCI6XCJXcml0ZSBhbiBleHByZXNzaW9uIHRoYXQgbWVhbnMgJiM4MjIwO3NpeCBtb3JlIHRoYW4gYSBudW1iZXIuJiM4MjIxO1wiLFwicVwiOlwiQ2FsbCB0aGUgbnVtYmVyICYjODIyMDs8c3BhbiBjbGFzcz1cXFwibWF0aFxcXCI+PGk+eDxcXC9pPjxcXC9zcGFuPiYjODIyMTsuXCIsXCJhXCI6XCI8bWF0aD48bXJvdz48bWk+eDxcXC9taT48bW8+KzxcXC9tbz48bW4+NjxcXC9tbj48XFwvbXJvdz48XFwvbWF0aD5cIixcImFuc1R5cGVcIjpcImlucHV0XCIsXCJwb2ludHNcIjo1LFwidmlkZW9cIjpcIndyaXRlX2FsZ2VicmFpY19leHByZXNzaW9uc19hYm91dF9zdW1zX2FuZF9kaWZmZXJlbmNlc1wifSx7XCJpZFwiOlwiNzQ4NDZcIixcInN0YW5kYXJkc1wiOlt7XCJpZFwiOlwiMjQ1NFwiLFwibmFtZVwiOlwiMS4xXCIsXCJjbGFzc2lkXCI6XCI1XCJ9LHtcImlkXCI6XCI1MTA5XCIsXCJuYW1lXCI6XCJSLjFcIixcImNsYXNzaWRcIjpcIjlcIn1dLFwicHJlZml4XCI6XCJXcml0ZSBhbiBleHByZXNzaW9uIHRoYXQgbWVhbnMgJiM4MjIwO2ZvdXIgdGltZXMgYSBudW1iZXIuJiM4MjIxO1wiLFwicVwiOlwiQ2FsbCB0aGUgbnVtYmVyICYjODIyMDs8c3BhbiBjbGFzcz1cXFwibWF0aFxcXCI+PGk+eDxcXC9pPjxcXC9zcGFuPiYjODIyMTsuXCIsXCJhXCI6XCI8bWF0aD48bXJvdz48bW4+NDxcXC9tbj48bWk+eDxcXC9taT48XFwvbXJvdz48XFwvbWF0aD5cIixcImFuc1R5cGVcIjpcImlucHV0XCIsXCJwb2ludHNcIjo1LFwidmlkZW9cIjpcIndyaXRlX2FsZ2VicmFpY19leHByZXNzaW9uc19hYm91dF9wcm9kdWN0c1wifSx7XCJpZFwiOlwiNzQ4NDdcIixcInN0YW5kYXJkc1wiOlt7XCJpZFwiOlwiMjQ1NFwiLFwibmFtZVwiOlwiMS4xXCIsXCJjbGFzc2lkXCI6XCI1XCJ9LHtcImlkXCI6XCI1MTA5XCIsXCJuYW1lXCI6XCJSLjFcIixcImNsYXNzaWRcIjpcIjlcIn1dLFwicVwiOlwiV3JpdGUgYW4gZXhwcmVzc2lvbiB0aGF0IG1lYW5zICYjODIyMDs8c3BhbiBjbGFzcz1cXFwibWF0aFxcXCI+PGk+eDxcXC9pPjxcXC9zcGFuPiBsZXNzIHRoYW4gZml2ZS4mIzgyMjE7XCIsXCJhXCI6XCI8bWF0aD48bXJvdz48bW4+NTxcXC9tbj48bW8+LTxcXC9tbz48bWk+eDxcXC9taT48XFwvbXJvdz48XFwvbWF0aD5cIixcImFuc1R5cGVcIjpcImlucHV0XCIsXCJwb2ludHNcIjo1LFwidmlkZW9cIjpcIndyaXRlX2FsZ2VicmFpY19leHByZXNzaW9uc19hYm91dF9zdW1zX2FuZF9kaWZmZXJlbmNlc1wifSx7XCJpZFwiOlwiNzQ4NDlcIixcInN0YW5kYXJkc1wiOlt7XCJpZFwiOlwiMjQ1NFwiLFwibmFtZVwiOlwiMS4xXCIsXCJjbGFzc2lkXCI6XCI1XCJ9LHtcImlkXCI6XCI1MTA5XCIsXCJuYW1lXCI6XCJSLjFcIixcImNsYXNzaWRcIjpcIjlcIn1dLFwicHJlZml4XCI6XCJXcml0ZSBhbiBleHByZXNzaW9uIHRoYXQgbWVhbnMgJiM4MjIwO3RoZSBzdW0gb2YgYSBudW1iZXIgYW5kIDE0LiYjODIyMTtcIixcInFcIjpcIkNhbGwgdGhlIG51bWJlciAmIzgyMjA7PHNwYW4gY2xhc3M9XFxcIm1hdGhcXFwiPjxpPng8XFwvaT48XFwvc3Bhbj4mIzgyMjE7XCIsXCJhXCI6XCI8bWF0aD48bXJvdz48bWk+eDxcXC9taT48bW8+KzxcXC9tbz48bW4+MTQ8XFwvbW4+PFxcL21yb3c+PFxcL21hdGg+XCIsXCJhbnNUeXBlXCI6XCJpbnB1dFwiLFwicG9pbnRzXCI6NSxcInZpZGVvXCI6XCJ3cml0ZV9hbGdlYnJhaWNfZXhwcmVzc2lvbnNfYWJvdXRfc3Vtc19hbmRfZGlmZmVyZW5jZXNcIn0se1wiaWRcIjpcIjc0ODUyXCIsXCJzdGFuZGFyZHNcIjpbe1wiaWRcIjpcIjI0NTRcIixcIm5hbWVcIjpcIjEuMVwiLFwiY2xhc3NpZFwiOlwiNVwifSx7XCJpZFwiOlwiNTEwOVwiLFwibmFtZVwiOlwiUi4xXCIsXCJjbGFzc2lkXCI6XCI5XCJ9XSxcInFcIjpcIjxwPldyaXRlIGFuIGV4cHJlc3Npb24gZm9yICYjODIyMDtUaGUgc3VtIG9mIDcgdGltZXMgYSBudW1iZXIgYW5kIDE1LiYjODIyMTs8XFwvcD5cXG5cXG48cD5Vc2UgPGk+eDxcXC9pPiB0byByZXByZXNlbnQgdGhlIG51bWJlci48XFwvcD5cXG5cIixcImhhc1N0ZXBzXCI6dHJ1ZSxcImFcIjpcIjxtYXRoPjxtcm93Pjxtbj43PFxcL21uPjxtaT54PFxcL21pPjxtbz4rPFxcL21vPjxtbj4xNTxcXC9tbj48XFwvbXJvdz48XFwvbWF0aD5cIixcImFuc1R5cGVcIjpcImlucHV0XCIsXCJwb2ludHNcIjo1fSx7XCJpZFwiOlwiNzQ4NTVcIixcInN0YW5kYXJkc1wiOlt7XCJpZFwiOlwiMjQ1NFwiLFwibmFtZVwiOlwiMS4xXCIsXCJjbGFzc2lkXCI6XCI1XCJ9LHtcImlkXCI6XCI1MTA5XCIsXCJuYW1lXCI6XCJSLjFcIixcImNsYXNzaWRcIjpcIjlcIn1dLFwicHJlZml4XCI6XCJXcml0ZSBhbiBleHByZXNzaW9uIHRoYXQgbWVhbnMgJiM4MjIwO3RoZSBzdW0gb2YgdGhyZWUgYW5kIHR3aWNlIGEgbnVtYmVyLiYjODIyMTtcIixcInFcIjpcIkNhbGwgdGhlIG51bWJlciAmIzgyMjA7PHNwYW4gY2xhc3M9XFxcIm1hdGhcXFwiPjxpPng8XFwvaT48XFwvc3Bhbj4mIzgyMjE7LlwiLFwiYVwiOlwiPG1hdGg+PG1yb3c+PG1uPjM8XFwvbW4+PG1vPis8XFwvbW8+PG1uPjI8XFwvbW4+PG1pPng8XFwvbWk+PFxcL21yb3c+PFxcL21hdGg+XCIsXCJhbnNUeXBlXCI6XCJpbnB1dFwiLFwicG9pbnRzXCI6NX0se1wiaWRcIjpcIjc0ODU2XCIsXCJzdGFuZGFyZHNcIjpbe1wiaWRcIjpcIjI0NTRcIixcIm5hbWVcIjpcIjEuMVwiLFwiY2xhc3NpZFwiOlwiNVwifSx7XCJpZFwiOlwiNTEwOVwiLFwibmFtZVwiOlwiUi4xXCIsXCJjbGFzc2lkXCI6XCI5XCJ9XSxcInFcIjpcIldyaXRlIGFuIGV4cHJlc3Npb24gdGhhdCBtZWFucyAmIzgyMjA7MTAwIG1pbnVzIHRoZSBxdW90aWVudCBvZiA1NiBkaXZpZGVkIGJ5IDxpPng8XFwvaT4uJiM4MjIxO1wiLFwiYVwiOlwiPG1hdGg+PG1yb3c+PG1uPjEwMDxcXC9tbj48bW8+LTxcXC9tbz48bWZyYWM+PG1yb3c+PG1uPjU2PFxcL21uPjxcXC9tcm93PjxtaT54PFxcL21pPjxcXC9tZnJhYz48XFwvbXJvdz48XFwvbWF0aD5cIixcImFuc1R5cGVcIjpcImlucHV0XCIsXCJwb2ludHNcIjo1fSx7XCJpZFwiOlwiNzQ4ODRcIixcInN0YW5kYXJkc1wiOlt7XCJpZFwiOlwiMjQ1NFwiLFwibmFtZVwiOlwiMS4xXCIsXCJjbGFzc2lkXCI6XCI1XCJ9LHtcImlkXCI6XCI1MTA5XCIsXCJuYW1lXCI6XCJSLjFcIixcImNsYXNzaWRcIjpcIjlcIn1dLFwicVwiOlwiPHA+PHNwYW4gY2xhc3M9XFxcInF1ZXN0aW9uXFxcIj48c3Bhbj48c3Bhbj5XaGljaCBvZiB0aGUgZXhwcmVzc2lvbnMgZ2l2ZXMgdGhlIGNvc3Qgb2YgcmVudGluZyBhIGNoYWluc2F3IGZvciA8XFwvc3Bhbj48c3BhbiBjbGFzcz1cXFwibWF0aFxcXCI+PGk+aDxcXC9pPjxcXC9zcGFuPjxzcGFuPiBob3VycywgYmFzZWQgb24gdGhlIHRhYmxlIGJlbG93PyA8XFwvc3Bhbj48XFwvc3Bhbj48XFwvc3Bhbj48XFwvcD5cXG5cXG48cD48c3BhbiBjbGFzcz1cXFwicXVlc3Rpb25cXFwiPjxzcGFuPjxtYXRoIHhtbG5zPVxcXCJodHRwOlxcL1xcL3d3dy53My5vcmdcXC8xOTk4XFwvTWF0aFxcL01hdGhNTFxcXCI+PG1yb3c+PG10YWJsZSBjb2x1bW5hbGlnbj1cXFwibGVmdFxcXCI+PG10ciBjb2x1bW5hbGlnbj1cXFwibGVmdFxcXCI+PG10ZCBjb2x1bW5hbGlnbj1cXFwibGVmdFxcXCI+PG1yb3c+PG1zdHlsZSBtYXRoc2l6ZT1cXFwibm9ybWFsXFxcIiBtYXRodmFyaWFudD1cXFwiYm9sZFxcXCI+PG1pPkg8XFwvbWk+PG1pPm88XFwvbWk+PG1pPnU8XFwvbWk+PG1pPnI8XFwvbWk+PG1pPnM8XFwvbWk+PFxcL21zdHlsZT48bXRleHQ+JiMxNjA7PFxcL210ZXh0Pjxtcm93Pjxtbz4oPFxcL21vPjxtaT5oPFxcL21pPjxtbz4pPFxcL21vPjxcXC9tcm93PjxtdGV4dD4mIzE2MDsmIzE2MDsmIzE2MDsmIzE2MDs8XFwvbXRleHQ+PFxcL21yb3c+PFxcL210ZD48bXRkIGNvbHVtbmFsaWduPVxcXCJsZWZ0XFxcIj48bXJvdz48bXN0eWxlIG1hdGhzaXplPVxcXCJub3JtYWxcXFwiIG1hdGh2YXJpYW50PVxcXCJib2xkXFxcIj48bWk+QzxcXC9taT48bWk+bzxcXC9taT48bWk+czxcXC9taT48bWk+dDxcXC9taT48XFwvbXN0eWxlPjxcXC9tcm93PjxcXC9tdGQ+PFxcL210cj48bXRyIGNvbHVtbmFsaWduPVxcXCJsZWZ0XFxcIj48bXRkIGNvbHVtbmFsaWduPVxcXCJsZWZ0XFxcIj48bXRleHQ+MTxcXC9tdGV4dD48XFwvbXRkPjxtdGQgY29sdW1uYWxpZ249XFxcImxlZnRcXFwiPjxtcm93PjxtdGV4dD4xMjxcXC9tdGV4dD48XFwvbXJvdz48XFwvbXRkPjxcXC9tdHI+PG10ciBjb2x1bW5hbGlnbj1cXFwibGVmdFxcXCI+PG10ZCBjb2x1bW5hbGlnbj1cXFwibGVmdFxcXCI+PG10ZXh0PjI8XFwvbXRleHQ+PFxcL210ZD48bXRkIGNvbHVtbmFsaWduPVxcXCJsZWZ0XFxcIj48bXJvdz48bXRleHQ+MTQ8XFwvbXRleHQ+PFxcL21yb3c+PFxcL210ZD48XFwvbXRyPjxtdHIgY29sdW1uYWxpZ249XFxcImxlZnRcXFwiPjxtdGQgY29sdW1uYWxpZ249XFxcImxlZnRcXFwiPjxtdGV4dD4zPFxcL210ZXh0PjxcXC9tdGQ+PG10ZCBjb2x1bW5hbGlnbj1cXFwibGVmdFxcXCI+PG1yb3c+PG10ZXh0PjE2PFxcL210ZXh0PjxcXC9tcm93PjxcXC9tdGQ+PFxcL210cj48bXRyIGNvbHVtbmFsaWduPVxcXCJsZWZ0XFxcIj48bXRkIGNvbHVtbmFsaWduPVxcXCJsZWZ0XFxcIj48bXRleHQ+NDxcXC9tdGV4dD48XFwvbXRkPjxtdGQgY29sdW1uYWxpZ249XFxcImxlZnRcXFwiPjxtcm93PjxtdGV4dD4xODxcXC9tdGV4dD48XFwvbXJvdz48XFwvbXRkPjxcXC9tdHI+PFxcL210YWJsZT48XFwvbXJvdz48XFwvbWF0aD48XFwvc3Bhbj48XFwvc3Bhbj48XFwvcD5cXG5cIixcImNob2ljZXNcIjpbe1wiaWRcIjpcIjY3ODUzXCIsXCJhXCI6XCI8c3BhbiBjbGFzcz1cXFwibWF0aFxcXCI+MTImIzE4Mzs8aT5oPFxcL2k+PFxcL3NwYW4+XCJ9LHtcImlkXCI6XCI2Nzg1NFwiLFwiYVwiOlwiPHNwYW4gY2xhc3M9XFxcIm1hdGhcXFwiPjEwICsgMiYjMTgzOzxpPmg8XFwvaT48XFwvc3Bhbj5cIn0se1wiaWRcIjpcIjY3ODU1XCIsXCJhXCI6XCI8c3BhbiBjbGFzcz1cXFwibWF0aFxcXCI+MTImIzE4Mzs8aT5oPFxcL2k+ICsgMjxcXC9zcGFuPlwifSx7XCJpZFwiOlwiNjc4NTZcIixcImFcIjpcIjxzcGFuIGNsYXNzPVxcXCJtYXRoXFxcIj4xMiArIDImIzE4Mzs8aT5oPFxcL2k+PFxcL3NwYW4+XCJ9XSxcImFcIjpcIjY3ODU0XCIsXCJhbnNUeXBlXCI6XCJyYWRpb1wiLFwicG9pbnRzXCI6NSxcInZpZGVvXCI6XCJ3cml0ZV9hbGdlYnJhaWNfZXhwcmVzc2lvbnNfdXNpbmdfdGhlX2lucHV0X2FuZF9vdXRwdXRfdmFsdWVzX2Zyb21cIn0se1wiaWRcIjpcIjc0ODg2XCIsXCJzdGFuZGFyZHNcIjpbe1wiaWRcIjpcIjI0NTRcIixcIm5hbWVcIjpcIjEuMVwiLFwiY2xhc3NpZFwiOlwiNVwifSx7XCJpZFwiOlwiNTEwOVwiLFwibmFtZVwiOlwiUi4xXCIsXCJjbGFzc2lkXCI6XCI5XCJ9XSxcInFcIjpcIjxwPlVzaW5nIHRoZSB0YWJsZSwgd3JpdGUgYW4gZXhwcmVzc2lvbiBmb3IgdGhlIG51bWJlciBvZiBiYWdzIG9mIGNhbmR5IGxlZnQgaW4gYSBzaG9wIG9uIHRoZSBkYXkgYmVmb3JlIEhhbGxvd2VlbiwgYSBudW1iZXIgb2YgaG91cnMgKDxzcGFuIGNsYXNzPVxcXCJtYXRoXFxcIj48aT5oPFxcL2k+PFxcL3NwYW4+KSBhZnRlciBvcGVuaW5nLjxcXC9wPlxcblxcbjxwPjxtYXRoIHhtbG5zPVxcXCJodHRwOlxcL1xcL3d3dy53My5vcmdcXC8xOTk4XFwvTWF0aFxcL01hdGhNTFxcXCI+PG1yb3c+PG10YWJsZSBjb2x1bW5hbGlnbj1cXFwibGVmdFxcXCI+PG10ciBjb2x1bW5hbGlnbj1cXFwibGVmdFxcXCI+PG10ZCBjb2x1bW5hbGlnbj1cXFwibGVmdFxcXCI+PG1yb3c+PG1zdHlsZSBtYXRodmFyaWFudD1cXFwiYm9sZFxcXCIgbWF0aHNpemU9XFxcIm5vcm1hbFxcXCI+PG1pPkg8XFwvbWk+PG1pPm88XFwvbWk+PG1pPnU8XFwvbWk+PG1pPnI8XFwvbWk+PG1pPnM8XFwvbWk+PFxcL21zdHlsZT48bXRleHQ+JiMxNjA7PFxcL210ZXh0Pjxtc3R5bGUgbWF0aHZhcmlhbnQ9XFxcImJvbGRcXFwiIG1hdGhzaXplPVxcXCJub3JtYWxcXFwiPjxtaT5hPFxcL21pPjxtaT5mPFxcL21pPjxtaT50PFxcL21pPjxtaT5lPFxcL21pPjxtaT5yPFxcL21pPjxcXC9tc3R5bGU+PG10ZXh0PiYjMTYwOzxcXC9tdGV4dD48bXN0eWxlIG1hdGh2YXJpYW50PVxcXCJib2xkXFxcIiBtYXRoc2l6ZT1cXFwibm9ybWFsXFxcIj48bWk+bzxcXC9taT48bWk+cDxcXC9taT48bWk+ZTxcXC9taT48bWk+bjxcXC9taT48bWk+aTxcXC9taT48bWk+bjxcXC9taT48bWk+ZzxcXC9taT48XFwvbXN0eWxlPjxtdGV4dD4mIzE2MDs8XFwvbXRleHQ+PG1yb3c+PG1vPig8XFwvbW8+PG1pPmg8XFwvbWk+PG1vPik8XFwvbW8+PFxcL21yb3c+PG10ZXh0PiYjMTYwOyYjMTYwOzxcXC9tdGV4dD48XFwvbXJvdz48XFwvbXRkPjxtdGQgY29sdW1uYWxpZ249XFxcImxlZnRcXFwiPjxtcm93Pjxtc3R5bGUgbWF0aHZhcmlhbnQ9XFxcImJvbGRcXFwiIG1hdGhzaXplPVxcXCJub3JtYWxcXFwiPjxtaT5CPFxcL21pPjxtaT5hPFxcL21pPjxtaT5nPFxcL21pPjxtaT5zPFxcL21pPjxcXC9tc3R5bGU+PG10ZXh0PiYjMTYwOzxcXC9tdGV4dD48bXN0eWxlIG1hdGh2YXJpYW50PVxcXCJib2xkXFxcIiBtYXRoc2l6ZT1cXFwibm9ybWFsXFxcIj48bWk+bzxcXC9taT48bWk+ZjxcXC9taT48XFwvbXN0eWxlPjxtdGV4dD4mIzE2MDs8XFwvbXRleHQ+PG1zdHlsZSBtYXRodmFyaWFudD1cXFwiYm9sZFxcXCIgbWF0aHNpemU9XFxcIm5vcm1hbFxcXCI+PG1pPmM8XFwvbWk+PG1pPmE8XFwvbWk+PG1pPm48XFwvbWk+PG1pPmQ8XFwvbWk+PG1pPnk8XFwvbWk+PFxcL21zdHlsZT48bXRleHQ+JiMxNjA7PFxcL210ZXh0Pjxtc3R5bGUgbWF0aHZhcmlhbnQ9XFxcImJvbGRcXFwiIG1hdGhzaXplPVxcXCJub3JtYWxcXFwiPjxtaT5sPFxcL21pPjxtaT5lPFxcL21pPjxtaT5mPFxcL21pPjxtaT50PFxcL21pPjxcXC9tc3R5bGU+PFxcL21yb3c+PFxcL210ZD48XFwvbXRyPjxtdHIgY29sdW1uYWxpZ249XFxcImxlZnRcXFwiPjxtdGQgY29sdW1uYWxpZ249XFxcImxlZnRcXFwiPjxtdGV4dD4wPFxcL210ZXh0PjxcXC9tdGQ+PG10ZCBjb2x1bW5hbGlnbj1cXFwibGVmdFxcXCI+PG1yb3c+PG10ZXh0PjM1MDxcXC9tdGV4dD48XFwvbXJvdz48XFwvbXRkPjxcXC9tdHI+PG10ciBjb2x1bW5hbGlnbj1cXFwibGVmdFxcXCI+PG10ZCBjb2x1bW5hbGlnbj1cXFwibGVmdFxcXCI+PG10ZXh0PjE8XFwvbXRleHQ+PFxcL210ZD48bXRkIGNvbHVtbmFsaWduPVxcXCJsZWZ0XFxcIj48bXJvdz48bXRleHQ+MzA1PFxcL210ZXh0PjxcXC9tcm93PjxcXC9tdGQ+PFxcL210cj48bXRyIGNvbHVtbmFsaWduPVxcXCJsZWZ0XFxcIj48bXRkIGNvbHVtbmFsaWduPVxcXCJsZWZ0XFxcIj48bXRleHQ+MjxcXC9tdGV4dD48XFwvbXRkPjxtdGQgY29sdW1uYWxpZ249XFxcImxlZnRcXFwiPjxtcm93PjxtdGV4dD4yNjA8XFwvbXRleHQ+PFxcL21yb3c+PFxcL210ZD48XFwvbXRyPjxtdHIgY29sdW1uYWxpZ249XFxcImxlZnRcXFwiPjxtdGQgY29sdW1uYWxpZ249XFxcImxlZnRcXFwiPjxtdGV4dD4zPFxcL210ZXh0PjxcXC9tdGQ+PG10ZCBjb2x1bW5hbGlnbj1cXFwibGVmdFxcXCI+PG1yb3c+PG10ZXh0PjIxNTxcXC9tdGV4dD48XFwvbXJvdz48XFwvbXRkPjxcXC9tdHI+PFxcL210YWJsZT48XFwvbXJvdz48XFwvbWF0aD48XFwvcD5cXG5cIixcImNob2ljZXNcIjpbe1wiaWRcIjpcIjY5NzMwXCIsXCJhXCI6XCI8c3BhbiBjbGFzcz1cXFwibWF0aFxcXCI+MzUwICsgNDUmIzE4Mzs8aT5oPFxcL2k+PFxcL3NwYW4+XCJ9LHtcImlkXCI6XCI2OTczMVwiLFwiYVwiOlwiPHNwYW4gY2xhc3M9XFxcIm1hdGhcXFwiPjM1MCAtIDQ1JiMxODM7PGk+aDxcXC9pPjxcXC9zcGFuPlwifSx7XCJpZFwiOlwiNjk3MzJcIixcImFcIjpcIjxzcGFuIGNsYXNzPVxcXCJtYXRoXFxcIj40NSYjMTgzOyg8aT5oPFxcL2k+ICsgMzUwKTxcXC9zcGFuPlwifSx7XCJpZFwiOlwiNjk3MzNcIixcImFcIjpcIjxzcGFuIGNsYXNzPVxcXCJtYXRoXFxcIj40NSYjMTgzOzxpPmg8XFwvaT4gLSAzNTA8XFwvc3Bhbj5cIn1dLFwiYVwiOlwiNjk3MzFcIixcImFuc1R5cGVcIjpcInJhZGlvXCIsXCJwb2ludHNcIjo1LFwidmlkZW9cIjpcIndyaXRlX2FsZ2VicmFpY19leHByZXNzaW9uc191c2luZ190aGVfaW5wdXRfYW5kX291dHB1dF92YWx1ZXNfZnJvbVwifSx7XCJpZFwiOlwiNzQ4ODdcIixcInN0YW5kYXJkc1wiOlt7XCJpZFwiOlwiMjQ1NFwiLFwibmFtZVwiOlwiMS4xXCIsXCJjbGFzc2lkXCI6XCI1XCJ9LHtcImlkXCI6XCI1MTA5XCIsXCJuYW1lXCI6XCJSLjFcIixcImNsYXNzaWRcIjpcIjlcIn1dLFwicVwiOlwiPHA+VXNpbmcgdGhlIHRhYmxlLCB3cml0ZSBhbiBleHByZXNzaW9uIGZvciB0aGUgY29zdCBvZiBhIHBpY3R1cmUgZnJhbWUgZ2l2ZW4gdGhlIHBlcmltZXRlciBvZiB0aGUgcGljdHVyZSBpbiBpbmNoZXMgKHRoZSBtaW5pbXVtIHNpemUgaXMgMjQgaW5jaGVzKS48XFwvcD5cXG5cXG48cD48bWF0aCB4bWxucz1cXFwiaHR0cDpcXC9cXC93d3cudzMub3JnXFwvMTk5OFxcL01hdGhcXC9NYXRoTUxcXFwiPjxtcm93PjxtdGFibGUgY29sdW1uYWxpZ249XFxcImxlZnRcXFwiPjxtdHIgY29sdW1uYWxpZ249XFxcImxlZnRcXFwiPjxtdGQgY29sdW1uYWxpZ249XFxcImxlZnRcXFwiPjxtcm93Pjxtc3R5bGUgbWF0aHZhcmlhbnQ9XFxcImJvbGRcXFwiIG1hdGhzaXplPVxcXCJub3JtYWxcXFwiPjxtaT5QPFxcL21pPjxtaT5lPFxcL21pPjxtaT5yPFxcL21pPjxtaT5pPFxcL21pPjxtaT5tPFxcL21pPjxtaT5lPFxcL21pPjxtaT50PFxcL21pPjxtaT5lPFxcL21pPjxtaT5yPFxcL21pPjxcXC9tc3R5bGU+PG10ZXh0PiYjMTYwOzxcXC9tdGV4dD48bXN0eWxlIG1hdGh2YXJpYW50PVxcXCJib2xkXFxcIiBtYXRoc2l6ZT1cXFwibm9ybWFsXFxcIj48bWk+aTxcXC9taT48bWk+bjxcXC9taT48XFwvbXN0eWxlPjxtdGV4dD4mIzE2MDs8XFwvbXRleHQ+PG1zdHlsZSBtYXRodmFyaWFudD1cXFwiYm9sZFxcXCIgbWF0aHNpemU9XFxcIm5vcm1hbFxcXCI+PG1pPmk8XFwvbWk+PG1pPm48XFwvbWk+PG1pPmM8XFwvbWk+PG1pPmg8XFwvbWk+PG1pPmU8XFwvbWk+PG1pPnM8XFwvbWk+PFxcL21zdHlsZT48bXRleHQ+JiMxNjA7PFxcL210ZXh0Pjxtcm93Pjxtbz4oPFxcL21vPjxtaT5wPFxcL21pPjxtbz4pPFxcL21vPjxcXC9tcm93PjxtdGV4dD4mIzE2MDsmIzE2MDs8XFwvbXRleHQ+PFxcL21yb3c+PFxcL210ZD48bXRkIGNvbHVtbmFsaWduPVxcXCJsZWZ0XFxcIj48bXJvdz48bXN0eWxlIG1hdGh2YXJpYW50PVxcXCJib2xkXFxcIiBtYXRoc2l6ZT1cXFwibm9ybWFsXFxcIj48bWk+QzxcXC9taT48bWk+bzxcXC9taT48bWk+czxcXC9taT48bWk+dDxcXC9taT48XFwvbXN0eWxlPjxcXC9tcm93PjxcXC9tdGQ+PFxcL210cj48bXRyIGNvbHVtbmFsaWduPVxcXCJsZWZ0XFxcIj48bXRkIGNvbHVtbmFsaWduPVxcXCJsZWZ0XFxcIj48bXJvdz48bXRleHQ+MjQ8XFwvbXRleHQ+PFxcL21yb3c+PFxcL210ZD48bXRkIGNvbHVtbmFsaWduPVxcXCJsZWZ0XFxcIj48bXJvdz48bXRleHQ+MTA8XFwvbXRleHQ+PFxcL21yb3c+PFxcL210ZD48XFwvbXRyPjxtdHIgY29sdW1uYWxpZ249XFxcImxlZnRcXFwiPjxtdGQgY29sdW1uYWxpZ249XFxcImxlZnRcXFwiPjxtcm93PjxtdGV4dD4yNjxcXC9tdGV4dD48XFwvbXJvdz48XFwvbXRkPjxtdGQgY29sdW1uYWxpZ249XFxcImxlZnRcXFwiPjxtcm93PjxtdGV4dD4xMTxcXC9tdGV4dD48XFwvbXJvdz48XFwvbXRkPjxcXC9tdHI+PG10ciBjb2x1bW5hbGlnbj1cXFwibGVmdFxcXCI+PG10ZCBjb2x1bW5hbGlnbj1cXFwibGVmdFxcXCI+PG1yb3c+PG10ZXh0PjI4PFxcL210ZXh0PjxcXC9tcm93PjxcXC9tdGQ+PG10ZCBjb2x1bW5hbGlnbj1cXFwibGVmdFxcXCI+PG1yb3c+PG10ZXh0PjEyPFxcL210ZXh0PjxcXC9tcm93PjxcXC9tdGQ+PFxcL210cj48bXRyIGNvbHVtbmFsaWduPVxcXCJsZWZ0XFxcIj48bXRkIGNvbHVtbmFsaWduPVxcXCJsZWZ0XFxcIj48bXJvdz48bXRleHQ+MzA8XFwvbXRleHQ+PFxcL21yb3c+PFxcL210ZD48bXRkIGNvbHVtbmFsaWduPVxcXCJsZWZ0XFxcIj48bXJvdz48bXRleHQ+MTM8XFwvbXRleHQ+PFxcL21yb3c+PFxcL210ZD48XFwvbXRyPjxcXC9tdGFibGU+PFxcL21yb3c+PFxcL21hdGg+PFxcL3A+XFxuXCIsXCJjaG9pY2VzXCI6W3tcImlkXCI6XCI2ODIwNFwiLFwiYVwiOlwiPHNwYW4gY2xhc3M9XFxcIm1hdGhcXFwiPjI0ICsgMTAmIzE4Mzs8aT5wPFxcL2k+PFxcL3NwYW4+XCJ9LHtcImlkXCI6XCI2ODIwNVwiLFwiYVwiOlwiPHNwYW4gY2xhc3M9XFxcIm1hdGhcXFwiPjI0ICsgMTBcXC88aT5wPFxcL2k+PFxcL3NwYW4+XCJ9LHtcImlkXCI6XCI2ODIwNlwiLFwiYVwiOlwiPHNwYW4gY2xhc3M9XFxcIm1hdGhcXFwiPjEwICsgMiYjMTgzOyg8aT5wPFxcL2k+IC0gMjQpPFxcL3NwYW4+XCJ9LHtcImlkXCI6XCI2ODIwN1wiLFwiYVwiOlwiPHNwYW4gY2xhc3M9XFxcIm1hdGhcXFwiPjEwICsgKDFcXC8yKSg8aT5wPFxcL2k+IC0gMjQpPFxcL3NwYW4+XCJ9XSxcImFcIjpcIjY4MjA3XCIsXCJhbnNUeXBlXCI6XCJyYWRpb1wiLFwicG9pbnRzXCI6NSxcInZpZGVvXCI6XCJ3cml0ZV9hbGdlYnJhaWNfZXhwcmVzc2lvbnNfdXNpbmdfdGhlX2lucHV0X2FuZF9vdXRwdXRfdmFsdWVzX2Zyb21cIn0se1wiaWRcIjpcIjc0ODg4XCIsXCJzdGFuZGFyZHNcIjpbe1wiaWRcIjpcIjI0NTRcIixcIm5hbWVcIjpcIjEuMVwiLFwiY2xhc3NpZFwiOlwiNVwifSx7XCJpZFwiOlwiNTEwOVwiLFwibmFtZVwiOlwiUi4xXCIsXCJjbGFzc2lkXCI6XCI5XCJ9XSxcInByZWZpeFwiOlwiVGhlIHRhYmxlIHNob3dzIHRoZSBjb3N0IDxpPkM8XFwvaT4gb2YgcmVudGluZyBhIGthcmFva2UgbWFjaGluZSB3aXRoIDxpPk08XFwvaT4gZXh0cmEgbWljcm9waG9uZXMuXCIsXCJxXCI6XCI8cD5Xcml0ZSBhbiBleHByZXNzaW9uIGZvciB0aGUgY29zdCBvZiBhIGthcmFva2UgbWFjaGluZSB3aXRoIDxpPk08XFwvaT4gZXh0cmEgbWljcm9waG9uZXMuPFxcL3A+XFxuXFxuPHA+QXNzdW1lIHRoZSBwYXR0ZXJuIGluIHRoZSB0YWJsZSBjb250aW51ZXMuPFxcL3A+XFxuXFxuPHA+PG1hdGggeG1sbnM9XFxcImh0dHA6XFwvXFwvd3d3LnczLm9yZ1xcLzE5OThcXC9NYXRoXFwvTWF0aE1MXFxcIj48bXJvdz48bXRhYmxlIGNvbHVtbmFsaWduPVxcXCJsZWZ0XFxcIj48bXRyIGNvbHVtbmFsaWduPVxcXCJsZWZ0XFxcIj48bXRkIGNvbHVtbmFsaWduPVxcXCJsZWZ0XFxcIj48bXJvdz48bXN0eWxlIG1hdGh2YXJpYW50PVxcXCJib2xkXFxcIiBtYXRoc2l6ZT1cXFwibm9ybWFsXFxcIj48bWk+TjxcXC9taT48bWk+dTxcXC9taT48bWk+bTxcXC9taT48bWk+YjxcXC9taT48bWk+ZTxcXC9taT48bWk+cjxcXC9taT48XFwvbXN0eWxlPjxtdGV4dD4mIzE2MDs8XFwvbXRleHQ+PG1zdHlsZSBtYXRodmFyaWFudD1cXFwiYm9sZFxcXCIgbWF0aHNpemU9XFxcIm5vcm1hbFxcXCI+PG1pPm88XFwvbWk+PG1pPmY8XFwvbWk+PFxcL21zdHlsZT48bXRleHQ+JiMxNjA7PFxcL210ZXh0Pjxtc3R5bGUgbWF0aHZhcmlhbnQ9XFxcImJvbGRcXFwiIG1hdGhzaXplPVxcXCJub3JtYWxcXFwiPjxtaT5lPFxcL21pPjxtaT54PFxcL21pPjxtaT50PFxcL21pPjxtaT5yPFxcL21pPjxtaT5hPFxcL21pPjxcXC9tc3R5bGU+PG10ZXh0PiYjMTYwOzxcXC9tdGV4dD48bXN0eWxlIG1hdGh2YXJpYW50PVxcXCJib2xkXFxcIiBtYXRoc2l6ZT1cXFwibm9ybWFsXFxcIj48bWk+TTxcXC9taT48bWk+aTxcXC9taT48bWk+YzxcXC9taT48bWk+cjxcXC9taT48bWk+bzxcXC9taT48bWk+cDxcXC9taT48bWk+aDxcXC9taT48bWk+bzxcXC9taT48bWk+bjxcXC9taT48bWk+ZTxcXC9taT48bWk+czxcXC9taT48XFwvbXN0eWxlPjxtdGV4dD4mIzE2MDs8XFwvbXRleHQ+PG1vIHN0cmV0Y2h5PVxcXCJmYWxzZVxcXCI+KDxcXC9tbz48bWk+TTxcXC9taT48bW8gc3RyZXRjaHk9XFxcImZhbHNlXFxcIj4pPFxcL21vPjxtdGV4dD4mIzE2MDsmIzE2MDs8XFwvbXRleHQ+PFxcL21yb3c+PFxcL210ZD48bXRkIGNvbHVtbmFsaWduPVxcXCJsZWZ0XFxcIj48bXJvdz48bXN0eWxlIG1hdGh2YXJpYW50PVxcXCJib2xkXFxcIiBtYXRoc2l6ZT1cXFwibm9ybWFsXFxcIj48bWk+QzxcXC9taT48bWk+bzxcXC9taT48bWk+czxcXC9taT48bWk+dDxcXC9taT48XFwvbXN0eWxlPjxcXC9tcm93PjxcXC9tdGQ+PFxcL210cj48bXRyIGNvbHVtbmFsaWduPVxcXCJsZWZ0XFxcIj48bXRkIGNvbHVtbmFsaWduPVxcXCJsZWZ0XFxcIj48bXRleHQ+MDxcXC9tdGV4dD48XFwvbXRkPjxtdGQgY29sdW1uYWxpZ249XFxcImxlZnRcXFwiPjxtcm93PjxtdGV4dD4xMDA8XFwvbXRleHQ+PFxcL21yb3c+PFxcL210ZD48XFwvbXRyPjxtdHIgY29sdW1uYWxpZ249XFxcImxlZnRcXFwiPjxtdGQgY29sdW1uYWxpZ249XFxcImxlZnRcXFwiPjxtdGV4dD4xPFxcL210ZXh0PjxcXC9tdGQ+PG10ZCBjb2x1bW5hbGlnbj1cXFwibGVmdFxcXCI+PG1yb3c+PG10ZXh0PjExMDxcXC9tdGV4dD48XFwvbXJvdz48XFwvbXRkPjxcXC9tdHI+PG10ciBjb2x1bW5hbGlnbj1cXFwibGVmdFxcXCI+PG10ZCBjb2x1bW5hbGlnbj1cXFwibGVmdFxcXCI+PG10ZXh0PjI8XFwvbXRleHQ+PFxcL210ZD48bXRkIGNvbHVtbmFsaWduPVxcXCJsZWZ0XFxcIj48bXJvdz48bXRleHQ+MTIwPFxcL210ZXh0PjxcXC9tcm93PjxcXC9tdGQ+PFxcL210cj48bXRyIGNvbHVtbmFsaWduPVxcXCJsZWZ0XFxcIj48bXRkIGNvbHVtbmFsaWduPVxcXCJsZWZ0XFxcIj48bXRleHQ+MzxcXC9tdGV4dD48XFwvbXRkPjxtdGQgY29sdW1uYWxpZ249XFxcImxlZnRcXFwiPjxtcm93PjxtdGV4dD4xMzA8XFwvbXRleHQ+PFxcL21yb3c+PFxcL210ZD48XFwvbXRyPjxcXC9tdGFibGU+PFxcL21yb3c+PFxcL21hdGg+PFxcL3A+XFxuXCIsXCJhXCI6XCI8bWF0aCB4bWxucz1cXFwiaHR0cDpcXC9cXC93d3cudzMub3JnXFwvMTk5OFxcL01hdGhcXC9NYXRoTUxcXFwiPjxtbj4xMDA8XFwvbW4+PG1vPis8XFwvbW8+PG1uPjEwPFxcL21uPjxtaT5NPFxcL21pPjxcXC9tYXRoPlwiLFwiYW5zVHlwZVwiOlwiaW5wdXRcIixcInBvaW50c1wiOjUsXCJ2aWRlb1wiOlwid3JpdGVfYWxnZWJyYWljX2V4cHJlc3Npb25zX3VzaW5nX3RoZV9pbnB1dF9hbmRfb3V0cHV0X3ZhbHVlc19mcm9tXCJ9LHtcImlkXCI6XCI3NTQyOFwiLFwic3RhbmRhcmRzXCI6W3tcImlkXCI6XCIyNDU0XCIsXCJuYW1lXCI6XCIxLjFcIixcImNsYXNzaWRcIjpcIjVcIn0se1wiaWRcIjpcIjUxMDlcIixcIm5hbWVcIjpcIlIuMVwiLFwiY2xhc3NpZFwiOlwiOVwifV0sXCJxXCI6XCI8cD5Xcml0ZSBhbiBleHByZXNzaW9uIGZvciB0aHJlZSB0aW1lcyB0aGUgc3VtIG9mIDUgYW5kIGEgbnVtYmVyLiYjMTYwOyBXcml0ZSB5b3VyIGFuc3dlciB3aXRob3V0IHBhcmVudGhlc2VzLjxcXC9wPlxcblxcbjxwPkNhbGwgdGhlIG51bWJlciA8aT5uPFxcL2k+LjxcXC9wPlwiLFwiYVwiOlwiPG1hdGggeG1sbnM9XFxcImh0dHA6XFwvXFwvd3d3LnczLm9yZ1xcLzE5OThcXC9NYXRoXFwvTWF0aE1MXFxcIj48bW4+MzxcXC9tbj48bWk+bjxcXC9taT48bW8+KzxcXC9tbz48bW4+MTU8XFwvbW4+PFxcL21hdGg+XCIsXCJhbnNUeXBlXCI6XCJpbnB1dFwiLFwicG9pbnRzXCI6NX0se1wiaWRcIjpcIjc2MzM0XCIsXCJzdGFuZGFyZHNcIjpbe1wiaWRcIjpcIjI0NTRcIixcIm5hbWVcIjpcIjEuMVwiLFwiY2xhc3NpZFwiOlwiNVwifSx7XCJpZFwiOlwiNTEwOVwiLFwibmFtZVwiOlwiUi4xXCIsXCJjbGFzc2lkXCI6XCI5XCJ9XSxcInByZWZpeFwiOlwiSmFpbWUmIzgyMTc7cyBhZ2UgaXMgNiB5ZWFycyBtb3JlIHRoYW4gdGhyZWUgdGltZXMgTWFyaWUmIzgyMTc7cyBhZ2UuXCIsXCJxXCI6XCI8cD5Xcml0ZSBhbiBleHByZXNzaW9uIGZvciBKYWltZSYjODIxNztzIGFnZS48XFwvcD5cXG5cXG48cD5DYWxsIE1hcmllJiM4MjE3O3MgYWdlIDxpPm48XFwvaT4uPFxcL3A+XCIsXCJhXCI6XCI8bWF0aD48bXJvdz48bW4+MzxcXC9tbj48bWk+bjxcXC9taT48bW8+KzxcXC9tbz48bW4+NjxcXC9tbj48XFwvbXJvdz48XFwvbWF0aD5cIixcImFuc1R5cGVcIjpcImlucHV0XCIsXCJwb2ludHNcIjo1fSx7XCJpZFwiOlwiNzYzNzZcIixcInN0YW5kYXJkc1wiOlt7XCJpZFwiOlwiMjQ1NFwiLFwibmFtZVwiOlwiMS4xXCIsXCJjbGFzc2lkXCI6XCI1XCJ9LHtcImlkXCI6XCI1MTA5XCIsXCJuYW1lXCI6XCJSLjFcIixcImNsYXNzaWRcIjpcIjlcIn1dLFwicHJlZml4XCI6XCJXcml0ZSBhbiBleHByZXNzaW9uIGZvciBzZXZlbiBsZXNzIHRoYW4gdGhyZWUgdGltZXMgYSBudW1iZXIuXCIsXCJxXCI6XCJDYWxsIHRoZSBudW1iZXIgPGk+bjxcXC9pPi5cIixcImFcIjpcIjxtYXRoPjxtcm93Pjxtbj4zPFxcL21uPjxtaT5uPFxcL21pPjxtbz4tPFxcL21vPjxtbj43PFxcL21uPjxcXC9tcm93PjxcXC9tYXRoPlwiLFwiYW5zVHlwZVwiOlwiaW5wdXRcIixcInBvaW50c1wiOjV9LHtcImlkXCI6XCI3NjU2MlwiLFwic3RhbmRhcmRzXCI6W3tcImlkXCI6XCIyNDU0XCIsXCJuYW1lXCI6XCIxLjFcIixcImNsYXNzaWRcIjpcIjVcIn0se1wiaWRcIjpcIjUxMDlcIixcIm5hbWVcIjpcIlIuMVwiLFwiY2xhc3NpZFwiOlwiOVwifV0sXCJwcmVmaXhcIjpcIldyaXRlIHRoZSBmb2xsb3dpbmcgc3RhdGVtZW50IGFzIGFuIGFsZ2VicmFpYyBleHByZXNzaW9uOlwiLFwicVwiOlwiPHA+VHdlbHZlIGxlc3MgdGhhbiB0d2ljZSBhIG51bWJlci48XFwvcD5cXG5cXG48cD5Vc2UgPHNwYW4gY2xhc3M9XFxcIm1hdGhcXFwiPjxpPng8XFwvaT48XFwvc3Bhbj4gdG8gcmVwcmVzZW50IHRoZSB1bmtub3duIG51bWJlci48XFwvcD5cIixcImFcIjpcIjxtYXRoPjxtcm93Pjxtbj4yPFxcL21uPjxtaT54PFxcL21pPjxtbz4tPFxcL21vPjxtbj4xMjxcXC9tbj48XFwvbXJvdz48XFwvbWF0aD5cIixcImFuc1R5cGVcIjpcImlucHV0XCIsXCJwb2ludHNcIjo1fSx7XCJpZFwiOlwiODM2MzJcIixcInN0YW5kYXJkc1wiOlt7XCJpZFwiOlwiMjQ1NFwiLFwibmFtZVwiOlwiMS4xXCIsXCJjbGFzc2lkXCI6XCI1XCJ9LHtcImlkXCI6XCI1MTA5XCIsXCJuYW1lXCI6XCJSLjFcIixcImNsYXNzaWRcIjpcIjlcIn1dLFwicVwiOlwiQSBneW1uYXN0aWNzIGFjYWRlbXkgZGlzcGxheXMgaXRzIHByaWNlcyBvbiB0aGUgc2lnbiBzaG93bi4gV3JpdGUgYW4gZXhwcmVzc2lvbiBmb3IgdGhlIHRvdGFsIGNvc3Qgb2YgdGFraW5nIDxpPmM8XFwvaT5jbGFzc2VzLiBcIixcInFJbWdcIjpcImh0dHA6XFwvXFwvZGVuYWxpLmtpbmV0aWNib29rcy5jb206ODA4MVxcL21lZGlhXFwvbWF0aHhhMlxcL3BhX2MxX2VvdTFfdGFibGUuZ2lmXCIsXCJhXCI6XCI8bWF0aCB4bWxucz1cXFwiaHR0cDpcXC9cXC93d3cudzMub3JnXFwvMTk5OFxcL01hdGhcXC9NYXRoTUxcXFwiPjxtcm93Pjxtbj4yMDxcXC9tbj48bW8+KzxcXC9tbz48bW4+NTxcXC9tbj48bWk+YzxcXC9taT48XFwvbXJvdz48XFwvbWF0aD5cIixcImFuc1R5cGVcIjpcImlucHV0XCIsXCJwb2ludHNcIjo1LFwidmlkZW9cIjpcIndyaXRlX2FsZ2VicmFpY19leHByZXNzaW9uc19hYm91dF9wcm9kdWN0c1wifSx7XCJpZFwiOlwiODM2MzNcIixcInN0YW5kYXJkc1wiOlt7XCJpZFwiOlwiMjQ1NFwiLFwibmFtZVwiOlwiMS4xXCIsXCJjbGFzc2lkXCI6XCI1XCJ9LHtcImlkXCI6XCI1MTA5XCIsXCJuYW1lXCI6XCJSLjFcIixcImNsYXNzaWRcIjpcIjlcIn1dLFwicVwiOlwiQXMgc2hvd24gaW4gdGhlIGlsbHVzdHJhdGlvbiwgRGVuaXNlIGlzIG1peGluZyBzb2Nrcywgc2hpcnRzIGFuZCBwYW50cy4gSWYgc2hlIGhhcyA8aT54PFxcL2k+IHBhaXJzIG9mIHNvY2tzLCA8aT55PFxcL2k+dG9wcyBhbmQgPGk+ejxcXC9pPmJvdHRvbXMsIHdyaXRlIGFuIGV4cHJlc3Npb24gZm9yIGhvdyBtYW55IG91dGZpdHMgc2hlIGNhbiBjcmVhdGUuIChBbmQgY29uZ3JhdHVsYXRpb25zLCB5b3UgZGlzY292ZXJlZCB0aGUgZnVuZGFtZW50YWwgY291bnRpbmcgcHJpbmNpcGxlIGZvciB5b3Vyc2VsZiEpXCIsXCJxSW1nXCI6XCJodHRwOlxcL1xcL2RlbmFsaS5raW5ldGljYm9va3MuY29tOjgwODFcXC9tZWRpYVxcL21hdGh4YTJcXC9wYV9jMV9lb3UxX3NvY2tzLmdpZlwiLFwiYVwiOlwiPG1hdGggeG1sbnM9XFxcImh0dHA6XFwvXFwvd3d3LnczLm9yZ1xcLzE5OThcXC9NYXRoXFwvTWF0aE1MXFxcIj48bXJvdz48bWk+eDxcXC9taT48bW8+JiMxODM7PFxcL21vPjxtaT55PFxcL21pPjxtbz4mIzE4Mzs8XFwvbW8+PG1pPno8XFwvbWk+PFxcL21yb3c+PFxcL21hdGg+XCIsXCJhbnNUeXBlXCI6XCJpbnB1dFwiLFwicG9pbnRzXCI6NSxcInZpZGVvXCI6XCJ3cml0ZV9hbGdlYnJhaWNfZXhwcmVzc2lvbnNfYWJvdXRfcHJvZHVjdHNcIn0se1wiaWRcIjpcIjgzNjM0XCIsXCJzdGFuZGFyZHNcIjpbe1wiaWRcIjpcIjI0NTRcIixcIm5hbWVcIjpcIjEuMVwiLFwiY2xhc3NpZFwiOlwiNVwifSx7XCJpZFwiOlwiNTEwOVwiLFwibmFtZVwiOlwiUi4xXCIsXCJjbGFzc2lkXCI6XCI5XCJ9XSxcInFcIjpcIlRoZSB2b2x1bWUgb2YgYSBzcGhlcmUgaXMgPG1hdGggeG1sbnM9XFxcImh0dHA6XFwvXFwvd3d3LnczLm9yZ1xcLzE5OThcXC9NYXRoXFwvTWF0aE1MXFxcIj48bXJvdz48bWZyYWMgbGluZXRoaWNrbmVzcz1cXFwidGhpblxcXCI+PG1uPjQ8XFwvbW4+PG1uPjM8XFwvbW4+PFxcL21mcmFjPjxtaT4mIzk2MDs8XFwvbWk+PG1zdXA+PG1pPnI8XFwvbWk+PG1uPjM8XFwvbW4+PFxcL21zdXA+PFxcL21yb3c+PFxcL21hdGg+LiBXaGF0IGlzIHRoZSB0b3RhbCB2b2x1bWUgb2YgdGhlIGJhbGxzIGlmIHRoZWlyIHJhZGl1cyBpcyAzPyBVc2UgPG1hdGggeG1sbnM9XFxcImh0dHA6XFwvXFwvd3d3LnczLm9yZ1xcLzE5OThcXC9NYXRoXFwvTWF0aE1MXFxcIj48bWk+JiM5NjA7PFxcL21pPjxcXC9tYXRoPiBhcyBwYXJ0IG9mIHlvdXIgYW5zd2VyLlwiLFwicUltZ1wiOlwiaHR0cDpcXC9cXC9kZW5hbGkua2luZXRpY2Jvb2tzLmNvbTo4MDgxXFwvbWVkaWFcXC9tYXRoeGEyXFwvcGFfYzFfZW91MV9iYWxscy5naWZcIixcImFcIjpcIjxtYXRoIHhtbG5zPVxcXCJodHRwOlxcL1xcL3d3dy53My5vcmdcXC8xOTk4XFwvTWF0aFxcL01hdGhNTFxcXCI+PG1yb3c+PG1uPjEwODxcXC9tbj48bWk+JiM5NjA7PFxcL21pPjxcXC9tcm93PjxcXC9tYXRoPlwiLFwiYW5zVHlwZVwiOlwiaW5wdXRcIixcInBvaW50c1wiOjUsXCJ2aWRlb1wiOlwid3JpdGVfYWxnZWJyYWljX2V4cHJlc3Npb25zX2Fib3V0X3Byb2R1Y3RzXCJ9LHtcImlkXCI6XCI5NDA4MVwiLFwic3RhbmRhcmRzXCI6W3tcImlkXCI6XCIyNDU0XCIsXCJuYW1lXCI6XCIxLjFcIixcImNsYXNzaWRcIjpcIjVcIn0se1wiaWRcIjpcIjUxMDlcIixcIm5hbWVcIjpcIlIuMVwiLFwiY2xhc3NpZFwiOlwiOVwifV0sXCJxXCI6XCJZb3Ugc3RvcCBhdCBhIGdhcyBzdGF0aW9uIGZvciBjYXIgcmVwYWlycy4gIFlvdSBwYXkgJDI1IGZvciB3aW5kc2hpZWxkIHdpcGVycywgYW5kIGJ1eSA8aT5nPFxcL2k+IGdhbGxvbnMgb2YgZ2FzIGF0ICQ0IGEgZ2FsbG9uLiBXcml0ZSBhbiBleHByZXNzaW9uIGZvciB0aGUgdG90YWwgYW1vdW50IG9mIG1vbmV5IHlvdSBzcGVuZC4gXCIsXCJoYXNTdGVwc1wiOnRydWUsXCJhXCI6XCI8bWF0aD48bXJvdz48bW4+MjU8XFwvbW4+PG1vPis8XFwvbW8+PG1uPjQ8XFwvbW4+PG1pPmc8XFwvbWk+PFxcL21yb3c+PFxcL21hdGg+XCIsXCJhbnNUeXBlXCI6XCJpbnB1dFwiLFwicG9pbnRzXCI6NSxcInZpZGVvXCI6XCJ3cml0ZV9hbGdlYnJhaWNfZXhwcmVzc2lvbnNfYWJvdXRfc3Vtc19hbmRfZGlmZmVyZW5jZXNcIn0se1wiaWRcIjpcIjk0MDg1XCIsXCJzdGFuZGFyZHNcIjpbe1wiaWRcIjpcIjI0NTRcIixcIm5hbWVcIjpcIjEuMVwiLFwiY2xhc3NpZFwiOlwiNVwifSx7XCJpZFwiOlwiNTEwOVwiLFwibmFtZVwiOlwiUi4xXCIsXCJjbGFzc2lkXCI6XCI5XCJ9XSxcInFcIjpcIlNhbSBib3VnaHQgPHNwYW4gY2xhc3M9XFxcIm1hdGhcXFwiPjxpPmQ8XFwvaT48XFwvc3Bhbj4gZG9udXRzLiBFYWNoIGRvbnV0IGNvc3QgJDIuNTAuIEhlIHBhaWQgdXNpbmcgYSAkMTAgYmlsbC4gV3JpdGUgYW4gZXhwcmVzc2lvbiBmb3IgdGhlIGFtb3VudCBvZiBjaGFuZ2UgaGUgd2lsbCByZWNlaXZlLiBVc2UmIzE2MDs8aT5kJiMxNjA7PFxcL2k+Zm9yIHRoZSBhbW91bnQgb2YgZG9udXRzLiBZb3VyIGV4cHJlc3Npb24gc2hvdWxkIHByb2R1Y2UgYW4gb3V0cHV0IGluIGRvbGxhcnMuXCIsXCJhXCI6XCI8bWF0aD48bXJvdz48bW4+MTA8XFwvbW4+PG1vPi08XFwvbW8+PG1uPjIuNTxcXC9tbj48bWk+ZDxcXC9taT48XFwvbXJvdz48XFwvbWF0aD5cIixcImFuc1R5cGVcIjpcImlucHV0XCIsXCJwb2ludHNcIjo1LFwidmlkZW9cIjpcIndyaXRlX2FsZ2VicmFpY19leHByZXNzaW9uc19hYm91dF9wcm9kdWN0c1wifV07XHJcblx0XHJcblx0c2VsZi5uYW1lcyA9IHtcclxuXHRcdGV4Y2VsOiBbXHJcblx0XHRcdFwiQWJpZ2FpbCBIaXJhbm9cIixcclxuXHRcdFx0XCJMZW11ZWwgQW1vcmltXCIsXHJcblx0XHRcdFwiQWx0aGEgQ2F2aW5zXCIsXHJcblx0XHRcdFwiU2hhcm9uZGEgTW9uZ29sZFwiLFxyXG5cdFx0XHRcIkNlbGVzdGluYSBPa2VlZmVcIixcclxuXHRcdFx0XCJCbHl0aGUgV2FyZVwiLFxyXG5cdFx0XHRcIkNpZXJyYSBCdWllXCIsXHJcblx0XHRcdFwiTWFyaWV0dGUgR2Fyb3V0dGVcIixcclxuXHRcdFx0XCJDbGlmZiBGYXJsZXNzXCIsXHJcblx0XHRcdFwiQ2hyaXN0YWwgRHVycmFuY2VcIixcclxuXHRcdFx0XCJIZXJtYW4gWmFoblwiLFxyXG5cdFx0XHRcIldpbmZvcmQgQmVjbmVsXCIsXHJcblx0XHRcdFwiSXNhdXJhIEdvc3NldHRcIixcclxuXHRcdFx0XCJTaG9zaGFuYSBCcmF6aWVyXCIsXHJcblx0XHRcdFwiQXJkZWxsIE9ydFwiLFxyXG5cdFx0XHRcIkJldGhlbCBXZWlsZXJcIixcclxuXHRcdFx0XCJHaWxtYSBLaWRuZXlcIixcclxuXHRcdF0sXHJcblx0XHRwYXNzOiBbXHJcblx0XHRcdFwiS2VlbHkgSGFydGVyXCIsXHJcblx0XHRcdFwiTWljaGVsbCBEdW5rZWxiZXJnZXJcIixcclxuXHRcdFx0XCJNZXJpc3NhIEtyb21cIixcclxuXHRcdFx0XCJTZWVtYSBNY0FkYW1zXCIsXHJcblx0XHRcdFwiS2ltYmVybGV5IEhlaWxtYW5uXCIsXHJcblx0XHRcdFwiQWRyaWVubmUgTWNNYXRoXCIsXHJcblx0XHRcdFwiRG9taW5pY2sgSGFyYmVyXCIsXHJcblx0XHRcdFwiSmFuZXR0IFNvbGxleVwiLFxyXG5cdFx0XHRcIkJldiBEaWxsb3dcIixcclxuXHRcdFx0XCJSYW5lZSBNY0tpc3NpY2tcIixcclxuXHRcdFx0XCJZb2tvIE90dFwiLFxyXG5cdFx0XHRcIldpbGxpYW1zIFNoaWZsZXR0XCIsXHJcblx0XHRcdFwiRG9uIFBhZXpcIixcclxuXHRcdFx0XCJEZWlkcmEgU3Rva2VseVwiLFxyXG5cdFx0XHRcIkp1bmcgUGV0cm92aWNoXCIsXHJcblx0XHRcdFwiTGF1bmEgSHlsZXJcIixcclxuXHRcdFxyXG5cdFx0XSxcclxuXHRcdGZhaWw6IFtcclxuXHRcdFx0XCJFaWxlbmUgVHJpcG9saVwiLFxyXG5cdFx0XHRcIkhlcm1pbGEgVmFsZXJpdXNcIixcclxuXHRcdFx0XCJSb2RlcmljayBDaGlsZHJlc3NcIixcclxuXHRcdFx0XCJMaWdpYSBQZXBlXCIsXHJcblx0XHRcdFwiTWVsaWEgQ3VycmllXCIsXHJcblx0XHRcdFwiSnVsaWUgQ2lyY2xlXCIsXHJcblx0XHRcdFwiVm9ubmllIFJ5YmFcIixcclxuXHRcdFx0XCJMaWxsaSBGaWdlcm9hXCIsXHJcblx0XHRcdFwiQ2xhcmljZSBSYWNvXCIsXHJcblx0XHRcdFwiR2VvcmdldHRlIE1hcnRpbmV6XCIsXHJcblx0XHRcdFwiTGFrZW55YSBLaW5sYXdcIixcclxuXHRcdFx0XCJDZWNpbGUgU3Ryb2htXCIsXHJcblx0XHRcdFwiTG9uaSBLb3plbFwiLFxyXG5cdFx0XHRcIlNhbmp1YW5hIEZhaXNvblwiLFxyXG5cdFx0XHRcIlR5c29uIE1heWh1ZVwiLFxyXG5cdFx0XHRcIk1hZGllIEhvbGRyZW5cIixcclxuXHRcdFx0XCJMeW5ldHRhIE1hcmNlbGlub1wiLFxyXG5cdFx0XVxyXG5cdH07XHJcblx0XHJcblx0XHJcblx0c2VsZi5mbGF0TmFtZXMgPSBzZWxmLm5hbWVzLmV4Y2VsLmNvbmNhdChzZWxmLm5hbWVzLnBhc3MsIHNlbGYubmFtZXMuZmFpbCkuc29ydCgpO1xyXG5cdFxyXG5cdHNlbGYuc3R1ZGVudFNjb3JlcyA9IGluaXRTY29yZXMoKTtcclxuXHJcblx0Ly8gVGhpcyByZXF1aXJlcyB0aGF0IGV2ZXJ5dGhpbmcgYmUgZGVmaW5lZCwgc28gbm8gXCJzZWxmLlwiIHJvdXRpbmVzIGNhbiBiZSBjYWxsZWQuXHJcblx0anVtcFRvUmVwb3J0KCRyb3V0ZVBhcmFtcy50eXBlLCB0cnVlKTtcclxuXHJcblx0c2VsZi5zdGF0ZSA9IHtcclxuXHRcdHNob3c6ICdDbGFzcycsXHJcblx0XHRzaG93VGV4dDogJ0VudGlyZSBjbGFzcycsXHJcblx0XHRzaG93VGV4dFRpdGxlOiAnRW50aXJlIGNsYXNzJyxcclxuXHJcblx0XHRjb21wYXJlOiAnTm9uZScsXHJcblxyXG5cdFx0c2VjdGlvbjogJ0FsbCdcclxuXHR9O1xyXG5cclxuXHR2YXIgdGV4dE1hcCA9IHtcclxuXHRcdFN0dWRlbnQ6ICdUaG9tcHNvbiwgQWxpY2VcXHUyNUJFJyxcclxuXHRcdENsYXNzOiAnRW50aXJlIGNsYXNzJyxcclxuXHRcdE5vbmU6ICcnLFxyXG5cdFx0TW9ybmluZzogJ1NlY3Rpb246IE1vcm5pbmdcXHUyNUJFJyxcclxuXHRcdEFmdGVybm9vbjogJ1NlY3Rpb246IEFmdGVybm9vblxcdTI1QkUnXHJcblx0fTtcclxuXHJcbi8vXHRQdWJTdWIuc3Vic2NyaWJlKCdmaWx0ZXIxJywgZnVuY3Rpb24oZXYsIHZhbCl7c2VsZi5jdXJTdGQgPSB2YWx9KTtcclxuXHRQdWJTdWIuc3Vic2NyaWJlKCdmaWx0ZXIyJywgZnVuY3Rpb24oZXYsIHZhbCl7c2VsZi5jdXJTdHVkZW50ID0gdmFsfSk7XHJcblx0Ly89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0ZnVuY3Rpb24gY2FsY1BlcmNlbnQoZnJhY3Rpb24pIHtcclxuXHRcdHJldHVybiBNYXRoLmZsb29yKGZyYWN0aW9uICogMTAwKTtcclxuXHR9XHJcblx0XHJcblx0Ly89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0ZnVuY3Rpb24gc2V0QWN0aXZlKGVudHJ5LCBwYXJlbnQpXHJcblx0e1xyXG5cdFx0c2VsZi5hY3RpdmVSZXBvcnQgPSBlbnRyeTtcclxuXHJcblx0XHRzZWxmLnJlcG9ydFRpdGxlID0gcGFyZW50LnRpdGxlICsgJyAtICcgKyBlbnRyeS50ZXh0XHJcblx0fVxyXG5cdHRoaXMuc2V0QWN0aXZlID0gc2V0QWN0aXZlO1xyXG4gICAgXHJcblx0ZnVuY3Rpb24gd3RmKCkge1xyXG5cdFx0Y29uc29sZS5sb2coXCJIZWxsbywgd29ybGQhXCIpO1xyXG5cdH1cclxuXHQvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHRmdW5jdGlvbiBqdW1wVG9SZXBvcnQoaWQsIG5vUm91dGUpXHJcblx0e1xyXG5cdFx0dmFyIGZvdW5kID0gZmFsc2U7XHJcblx0XHRmb3IgKHZhciBpID0gMCwgbGVuID0gc2VsZi5yZXBvcnRzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKVxyXG5cdFx0e1xyXG5cdFx0XHRfLmZvckVhY2goc2VsZi5yZXBvcnRzW2ldLm9wdGlvbnMsIGZ1bmN0aW9uKGVudHJ5KSB7XHJcblx0XHRcdFx0aWYgKGVudHJ5LmlkID09PSBpZClcclxuXHRcdFx0XHR7XHJcblx0XHRcdFx0XHRzZXRBY3RpdmUoZW50cnksIHNlbGYucmVwb3J0c1tpXSk7XHJcblx0XHRcdFx0XHRzZWxmLnJlcG9ydHNbaV0uaXNPcGVuID0gdHJ1ZTtcclxuXHRcdFx0XHRcdGZvdW5kID0gdHJ1ZTtcclxuXHJcblx0XHRcdFx0XHRpZiAoIW5vUm91dGUpXHJcblx0XHRcdFx0XHRcdCRsb2NhdGlvbi5wYXRoKCcvZ3JhcGgvJyArIGlkLCBmYWxzZSk7XHJcblxyXG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHRpZiAoZm91bmQpXHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHR9XHJcblx0fVxyXG5cdHRoaXMuanVtcFRvUmVwb3J0ID0ganVtcFRvUmVwb3J0O1xyXG5cclxuXHQvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHR0aGlzLmdyYWRlQ2hhbmdlID0gZnVuY3Rpb24oKVxyXG5cdHtcclxuXHRcdHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJ2NoYW5nZSc7XHJcblx0fVxyXG5cclxuXHQvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHR0aGlzLmNvbXBhcmUgPSBmdW5jdGlvbih2YWwpXHJcblx0e1xyXG5cdFx0c2VsZi5zdGF0ZS5jb21wYXJlID0gdmFsO1xyXG5cdFx0c2VsZi5zdGF0ZS5jb21wYXJlVGV4dCA9IHRleHRNYXBbdmFsXTtcclxuXHJcblx0XHRpZiAodmFsID09PSAnU3R1ZGVudCcpXHJcblx0XHRcdHNlbGYuc3RhdGUuY29tcGFyZVRleHQgPSAnTWNHZWUsIEJ1YmJhXFx1MjVCRSc7XHJcblxyXG5cdFx0c2VsZi5zdGF0ZS5jb21wYXJlVGV4dFRpdGxlID0gc2VsZi5zdGF0ZS5jb21wYXJlVGV4dC5yZXBsYWNlKC8oXFx1MjVCRXxTZWN0aW9uOiApL2csICcnKTtcclxuXHR9XHJcblxyXG5cdC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdHRoaXMuc2hvdyA9IGZ1bmN0aW9uKHZhbClcclxuXHR7XHJcblx0XHRzZWxmLnN0YXRlLnNob3cgPSB2YWw7XHJcblx0XHRzZWxmLnN0YXRlLnNob3dUZXh0ID0gdGV4dE1hcFt2YWxdO1xyXG5cclxuXHRcdHNlbGYuc3RhdGUuc2hvd1RleHRUaXRsZSA9IHNlbGYuc3RhdGUuc2hvd1RleHQucmVwbGFjZSgvKFxcdTI1QkV8U2VjdGlvbjogKS9nLCAnJyk7XHJcblx0fVxyXG5cclxuXHQvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHR0aGlzLnNlY3Rpb24gPSBmdW5jdGlvbih2YWwpXHJcblx0e1xyXG5cdFx0c2VsZi5zdGF0ZS5zZWN0aW9uID0gdmFsO1xyXG5cdH1cclxuXHJcblx0Ly89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly9cclxuXHQvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHRmdW5jdGlvbiBnZXRCYXIoaWR4KVxyXG5cdHtcclxuLy9cdFx0cmV0dXJuICcuLi9pbWFnZXMvbW9ja3MvYmFyJyArIGlkeCArICcucG5nJztcclxuXHRcdHJldHVybiAnaW1hZ2VzL21vY2tzL2JhcicgKyBpZHggKyAnLnBuZyc7XHJcblx0fVxyXG5cclxuXHQvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHR0aGlzLmJhcldpZHRoID0gZnVuY3Rpb24oc2NvcmUsIG9wdHMpXHJcblx0e1xyXG5cdFx0dmFyIHdpZHRoID0gc2NvcmU7XHJcblxyXG5cdFx0Ly8gU3VwcG9ydCBhIGxhcmdlIHNpemVcclxuXHRcdGlmICgodHlwZW9mIG9wdHMgPT09ICdzdHJpbmcnICYmIG9wdHMgPT09ICdsYXJnZScpIHx8IChvcHRzICYmIG9wdHMuc2l6ZSAmJiBvcHRzLnNpemUgPT09ICdsYXJnZScpKVxyXG5cdFx0XHR3aWR0aCAqPSAyLjU7XHJcblxyXG5cdFx0Ly8gQWNjb3VudCBmb3IgdGhlIGJvcmRlclxyXG5cdFx0aWYgKHR5cGVvZiBvcHRzID09PSAnb2JqZWN0JyAmJiBvcHRzLmNvbnRhaW5lcilcclxuXHRcdFx0d2lkdGggKz0gMjtcclxuXHJcblx0XHRyZXR1cm4ge3dpZHRoOiB3aWR0aCArICdweCd9O1xyXG5cdH1cclxuXHJcblx0Ly89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0dGhpcy5hdmVyYWdlUGVyY2VudCA9IGZ1bmN0aW9uKGNvcnJlY3QsIHRvdGFsKVxyXG5cdHtcclxuXHRcdHJldHVybiBNYXRoLnJvdW5kIChjb3JyZWN0IC8gdG90YWwgKiAxMDApO1xyXG5cdH1cclxuXHJcblx0Ly89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0XHJcblx0ZnVuY3Rpb24gcmFuZG9tU2NvcmUoKVxyXG5cdHtcclxuXHRcdHZhciBzY29yZXMgPSBbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMjIgKyA1KSwgMF07XHJcblx0XHR2YXIgdGVtcCA9IE1hdGgucm91bmQoKHNjb3Jlc1swXSAqIDEwMCkgLyAyNyk7XHJcblx0XHRzY29yZXNbMV0gPSB0ZW1wO1xyXG5cdFx0cmV0dXJuIHNjb3JlcztcclxuXHR9XHJcblx0Ly89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly9cclxuXHQvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHR0aGlzLnRydW5jTmFtZSA9IGZ1bmN0aW9uKHN0cilcclxuXHR7XHJcblx0XHRyZXR1cm4gdHJ1bmNOYW1lKHN0cik7XHJcblx0fVxyXG5cclxuXHQvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvL1xyXG5cdC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdGZ1bmN0aW9uIHRydW5jTmFtZShzdHIpXHJcblx0e1xyXG5cdFx0dmFyIG1heGxlbiA9IDIwO1xyXG5cclxuXHRcdGlmIChzdHIubGVuZ3RoIDw9IG1heGxlbilcclxuXHRcdFx0cmV0dXJuIHN0cjtcclxuXHJcblx0XHRyZXR1cm4gc3RyLnN1YnN0cmluZygwLCBtYXhsZW4tMykgKyAnLi4uJztcclxuXHR9XHJcblxyXG5cdC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdHRoaXMuc2hvd1N0ZHMgPSBmdW5jdGlvbihzdHIpXHJcblx0e1xyXG5cdFx0cmV0dXJuIHRydWU7XHJcblxyXG5cdFx0dmFyIHJlZ2V4ID0gL1swLTldLztcclxuXHRcdHJldHVybiAhcmVnZXgudGVzdChzdHIpO1xyXG5cdH1cclxuXHRcclxuXHRmdW5jdGlvbiBwbHVyYWwobnVtKSB7XHJcblx0XHRpZiAobnVtID09PSAxKSB7XHJcblx0XHRcdHJldHVybiBcInN0dWRlbnRcIjtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHJldHVybiBcInN0dWRlbnRzXCI7XHJcblx0XHR9XHJcblx0fVxyXG5cdC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vXHJcblx0Ly89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0ZnVuY3Rpb24gaW5pdFNjb3JlcygpXHJcblx0e1xyXG5cdFx0dmFyIG91dCA9IHt9O1xyXG5cdFx0Xy5mb3JFYWNoKHNlbGYuZmxhdE5hbWVzLCBmdW5jdGlvbihuYW1lKSB7XHJcblx0XHRcdHZhciBzY29yZXMgPSByYW5kb21TY29yZSgpO1xyXG5cdFx0XHRvdXRbbmFtZV0gPSB7XHJcblx0XHRcdFx0c2NvcmU6IHNjb3Jlc1swXSxcclxuXHRcdFx0XHRwZXJjZW50OiBzY29yZXNbMV1cclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHRyZXR1cm4gb3V0O1xyXG5cdH1cclxuXHJcbn0pO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG4vLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbmFuZ3VsYXIubW9kdWxlKCdncmFkZXMnKVxyXG5cclxuLmRpcmVjdGl2ZSgnbmF2SGVhZGVyJywgZnVuY3Rpb24oKSB7XHJcblxyXG5cdHJldHVybiB7XHJcblx0XHRyZXN0cmljdDogJ0UnLFxyXG5cdFx0c2NvcGU6IHt9LFxyXG5cdFx0Y29udHJvbGxlcjogJ05hdkN0cmwnLFxyXG5cdFx0Y29udHJvbGxlckFzOiAnbmF2JyxcclxuXHRcdHRlbXBsYXRlVXJsOiAnTmF2L25hdi1oZWFkZXIuaHRtbCcsXHJcblx0XHRyZXBsYWNlOiB0cnVlLFxyXG5cdFx0YmluZFRvOiB0cnVlXHJcblx0fTtcclxufSlcclxuXHJcbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4uY29udHJvbGxlcignTmF2Q3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgUHJvYmxlbXMsIFN0YXRlLCBrYkJvb3RzdHJhcCwgUHViU3ViLCAkbW9kYWwsIGhvdGtleXMsICR3aW5kb3csIENsb3VkU2F2ZSkge1xyXG5cclxuXHR2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG5cdC8vIFRoaXMgd2lsbCBuZWVkIHRvIGJlIGJvb3RzdHJhcHBlZCwgc2luY2Ugd2UgZG9uJ3Qga25vdyB3aGljaCBpdGVtcyBhcmUgYXBwbGljYWJsZS5cclxuXHR2YXIgbWVudU9wdGlvbnMgPSBbXHJcblx0XHR7aWNvbjonaW1hZ2VzL3NsaWRlcm1lbnUvaWNvbkhvbWV3b3JrLmdpZicsIHRleHQ6J0Fzc2lnbm1lbnRzJywgYWN0OiBmdW5jdGlvbigpe2xpbmtUbygnL3N5bGxhYnVzLnBocCcpfX0sXHJcblx0XHR7aWNvbjogJ2ltYWdlcy9zbGlkZXJtZW51L2ljb25HcmFwaHMucG5nJywgdGV4dDogJ0dyYWRlcycsIGFjdDogZnVuY3Rpb24oKXtsaW5rVG8oJycpfX0sXHJcblx0XHR7aWNvbjogJ2ltYWdlcy9zbGlkZXJtZW51L2ljb25BZG1pbi5wbmcnLCB0ZXh0OiAnQWRtaW4nLCBhY3Q6IGZ1bmN0aW9uKCl7bGlua1RvKCcvYWRtaW4ucGhwJyl9fSxcclxuXHRcdHtpY29uOiAnaW1hZ2VzL3NsaWRlcm1lbnUvaWNvblNldHRpbmdzLmdpZicsIHRleHQ6ICdTZXR0aW5ncycsIGFjdDogZnVuY3Rpb24oKXtsaW5rVG8oJy9hZG1pbl9hZG1pbl9kZXRhaWwucGhwP3VzZXJfaWQ9eyR1c2VyfSZwYWdlPWVkaXQnKX19LFxyXG5cdFx0e2ljb246ICdpbWFnZXMvc2xpZGVybWVudS9pY29uSGVscC5naWYnLCB0ZXh0OiAnU3VwcG9ydCcsIGFjdDogZnVuY3Rpb24oKXtsaW5rVG8oJ2h0dHA6Ly93d3cucGVyZmVjdGlvbmxlYXJuaW5nLmNvbS9raW5ldGljLXN1cHBvcnQ/cGlkPXskcGlkfScpfX0sXHJcblx0XHR7aWNvbjogJ2ltYWdlcy9zbGlkZXJtZW51L2ljb25Mb2dvdXQuZ2lmJywgdGV4dDogJ0xvZ291dCcsIGFjdDogZnVuY3Rpb24oKXtsaW5rVG8oJy8vXCIgLiBLTUFUSERPVENPTSAuIFwiL2xvZ291dC5waHAnKX19XHJcblx0XTtcclxuXHRzZWxmLm1lbnVNb2RlbCA9IHtcclxuXHRcdGl0ZW1zOiBtZW51T3B0aW9ucyxcclxuXHRcdG9wZW5lZDogZmFsc2VcclxuXHR9O1xyXG5cclxuXHRob3RrZXlzXHJcblx0XHQuYmluZFRvKCRzY29wZSlcclxuXHRcdC5hZGQoe1xyXG5cdFx0XHRjb21ibzogJ2FsdCt2JyxcclxuXHRcdFx0ZGVzY3JpcHRpb246ICdEaXNwbGF5IGFwcGxpY2F0aW9uIHZlcnNpb24nLFxyXG5cdFx0XHRjYWxsYmFjazogc2hvd1ZlcnNpb25cclxuXHRcdH0pO1xyXG5cclxuXHRTdGF0ZS5zZXQoJ3BlbmRGaWx0ZXInLCBmYWxzZSk7XHJcblxyXG5cdHNlbGYucGVuZENudCA9IFByb2JsZW1zLnBlbmRpbmdDb3VudCgpO1xyXG5cdHNlbGYudG90YWxDbnQgPSBQcm9ibGVtcy5jb3VudCgpO1xyXG5cclxuXHRQdWJTdWIuc3Vic2NyaWJlKCdzdGF0dXMnLCBzZXRTdGF0dXMsICRzY29wZSk7XHJcblx0UHViU3ViLnN1YnNjcmliZSgnc2F2ZVN0YXJ0Jywgc2F2aW5nLCAkc2NvcGUpO1xyXG5cdFB1YlN1Yi5zdWJzY3JpYmUoJ3NhdmVEb25lJywgc2F2aW5nRG9uZSwgJHNjb3BlKTtcclxuXHJcblx0JHdpbmRvdy5vbmJlZm9yZXVubG9hZCA9IG5hdkF3YXk7XHRcdC8vIFRoaXMgY2F0Y2hlcyBhY3R1YWwgcGFnZSBjaGFuZ2VzLCBhbmQgbm90IHJvdXRlcy4gVGhhdCdzIHdoYXQgd2Ugd2FudC5cclxuXHJcblx0Ly89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly8gTmF2aWdhdGlvblxyXG5cdC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuXHQvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHRzZWxmLmdldENsYXNzID0gZnVuY3Rpb24oc2V0dGluZylcclxuXHR7XHJcblx0XHR2YXIgZGlzYWJsZWQgPSAnJztcclxuXHRcdGlmIChzZXR0aW5nICYmIHNlbGYucGVuZENudCA9PT0gMClcclxuXHRcdFx0ZGlzYWJsZWQgPSAnIGRpc2FibGVkJztcclxuXHJcblx0XHRpZiAoU3RhdGUuZ2V0KCdwZW5kRmlsdGVyJykgPT0gc2V0dGluZylcclxuXHRcdFx0cmV0dXJuICdhY3RpdmUgYnRuLWRlZmF1bHQnICsgZGlzYWJsZWQ7XHJcblx0XHRlbHNlXHJcblx0XHRcdHJldHVybiAnYnRuLWluZm8nICsgZGlzYWJsZWQ7XHJcblx0fVxyXG5cclxuXHQvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHRzZWxmLnNldEZpbHRlciA9IGZ1bmN0aW9uKHNldHRpbmcpXHJcblx0e1xyXG5cdFx0U3RhdGUuc2V0KCdwZW5kRmlsdGVyJywgc2V0dGluZyk7XHJcblxyXG5cdFx0Ly8gUmVzZXQgdGhlIHNjcm9sbCBiYXIgdG8gdGhlIHRvcCAodGVjaG5pY2FsbHksIGp1c3QgbGV0IHRoZSB3b3JsZCBrbm93IHRoZSBmaWx0ZXIgaGFzIGNoYW5nZWQuIExldCB0aGUgd29ybGQgZG8gd2hhdGV2ZXIgaXQgd2FudHMuKVxyXG5cdFx0UHViU3ViLnB1Ymxpc2goJ2ZpbHRlcl9jaGFuZ2UnKTtcclxuXHR9XHJcblxyXG5cdC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdHNlbGYuZG9uZSA9IGZ1bmN0aW9uKClcclxuXHR7XHJcblx0XHR2YXIgZGVzdCA9IGtiQm9vdHN0cmFwLmRvbmVMaW5rO1xyXG4vL1x0XHRsaW5rVG8oZGVzdCk7XHJcblx0XHR3aW5kb3cubG9jYXRpb24uaHJlZiA9IGRlc3Q7XHRcdC8vIEBGSVhNRS9kZzogVXNlIGxpbmtUbywgYnV0IHdlJ3JlIHRlbXBvcmFyaWx5IGRpc2FibGluZyB0aGUgc2xpZGVyIG1lbnVcclxuXHR9XHJcblxyXG5cdC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdHNlbGYuZG9uZUJ0bkNsYXNzID0gZnVuY3Rpb24oKVxyXG5cdHtcclxuXHRcdHJldHVybiB0cnVlO1x0Ly9zZWxmLmhhc1Byb2JsZW1zKCkgPyAnJyA6ICdkaXNhYmxlZCc7XHJcblx0fVxyXG5cclxuXHQvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBUaGUgXCJEb25lXCIgYnV0dG9uIHdpbGwgZGlzcGxheSBcIkRvbmVcIiBvciBcIkNhbmNlbFwiLCBkZXBlbmRpbmdcclxuXHQvLyBvbiBjaXJjdW1zdGFuY2VzLlxyXG5cdC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdHNlbGYuZG9uZUJ0bk5hbWUgPSBmdW5jdGlvbigpXHJcblx0e1xyXG5cdFx0cmV0dXJuICdEb25lJztcclxuXHR9XHJcblxyXG5cdC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vXHJcblx0Ly89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0ZnVuY3Rpb24gbGlua1RvKGRlc3QpXHJcblx0e1xyXG5cdFx0cmV0dXJuO1xyXG5cdFx0d2luZG93LmxvY2F0aW9uLmhyZWYgPSBkZXN0O1xyXG5cdH1cclxuXHJcblx0Ly89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly8gSWYgd2UncmUgaW4gdGhlIG1pZGRsZSBvZiBzYXZpbmcsIGRvbid0IGxldCB0aGUgdXNlciBsZWF2ZVxyXG5cdC8vIHdpdGhvdXQgY29uZmlybWF0aW9uLlxyXG5cdC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdGZ1bmN0aW9uIG5hdkF3YXkoKVxyXG5cdHtcclxuXHRcdGlmICghQ2xvdWRTYXZlLmlzSWRsZSgpKVxyXG5cdFx0XHRyZXR1cm4gXCJZb3VyIGNoYW5nZXMgaGF2ZW4ndCBiZWVuIHNhdmVkIHlldC5cIjtcclxuXHJcblx0XHRyZXR1cm4gdW5kZWZpbmVkO1xyXG5cdH1cclxuXHJcblx0Ly89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly8gR2VuZXJhbCBFdmVudCBIYW5kbGVyc1xyXG5cdC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuXHQvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHRzZWxmLm9wZW5NZW51ID0gZnVuY3Rpb24oKVxyXG5cdHtcclxuXHRcdHNlbGYubWVudU1vZGVsLm9wZW5lZCA9IHRydWU7XHJcblx0fVxyXG5cclxuXHQvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBIYXZpbmcgSFRNTCBpbiBoZXJlIHZpb2xhdGVzIGNvbnRyb2xsZXIvdmlldyBzZXBhcmF0aW9uLlxyXG5cdC8vIEhvd2V2ZXIsIHRoZSBIVE1MIGlzIHNvIHNpbXBsZSB3ZSBjYW4gbG9vayB0aGUgb3RoZXIgd2F5LlxyXG5cdC8vIE1ha2UgYSB2ZXJzaW9uIGRpcmVjdGl2ZSBzaW5jZSB3ZSdyZSByZXVzaW5nIHRoaXMgaW4gZWFjaFxyXG5cdC8vIG1vZHVsZSFcclxuXHQvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHRmdW5jdGlvbiBzaG93VmVyc2lvbigpXHJcblx0e1xyXG5cdFx0Ly8gRG9uJ3Qgb3BlbiBpZiBpdCdzIGFscmVhZHkgYmVpbmcgZGlzcGxheWVkXHJcblx0XHRpZiAoc2VsZi5hY3RpdmVNb2RhbHMpXHJcblx0XHRcdHJldHVybjtcclxuXHJcblx0XHQvLyBDcmVhdGUgdGhlIG1vZGFsIGFuZCBzYXZlIHRoZSBpbnN0YW5jZSByZWZlcmVuY2VcclxuXHRcdHNlbGYuYWN0aXZlTW9kYWxzID0gJG1vZGFsLm9wZW4oe1xyXG5cdFx0XHR0ZW1wbGF0ZTogJzxkaXYgaWQ9XCJsb2FkRmFpbGVkXCI+JyArIFN0YXRlLmdldCgnYXBwTmFtZScpICsgJyB2ZXJzaW9uICcgKyBTdGF0ZS5nZXQoJ3ZlcnNpb24nKSArICc8L2Rpdj4nLFxyXG5cdFx0fSk7XHJcblxyXG5cdFx0Ly8gTW9uaXRvciB0aGUgJ3Jlc3VsdCcgcHJvbWlzZSwgYW5kIHJlbW92ZSB0aGUgaW5zdGFuY2UgcmVmZXJlbmNlIHdoZW4gaXQgY2xvc2VzXHJcblx0XHRzZWxmLmFjdGl2ZU1vZGFscy5yZXN1bHQudGhlbih2ZXJzaW9uQ2xvc2VkLCB2ZXJzaW9uQ2xvc2VkKTtcclxuXHR9XHJcblxyXG5cdC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdGZ1bmN0aW9uIHZlcnNpb25DbG9zZWQoKVxyXG5cdHtcclxuXHRcdHNlbGYuYWN0aXZlTW9kYWxzID0gbnVsbDtcclxuXHR9XHJcblxyXG5cdC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdGZ1bmN0aW9uIHNhdmluZygpXHJcblx0e1xyXG5cdFx0c2VsZi5pc1NhdmluZyA9IHRydWU7XHJcblx0fVxyXG5cclxuXHQvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHRmdW5jdGlvbiBzYXZpbmdEb25lKClcclxuXHR7XHJcblx0XHQvLyBVcGRhdGUgdGhlIHBlbmRpbmcgY291bnQgb24gYW55IGNoYW5nZVxyXG5cdFx0c2VsZi5wZW5kQ250ID0gUHJvYmxlbXMucGVuZGluZ0NvdW50KCk7XHJcblxyXG5cdFx0Ly8gVUlcclxuXHRcdHNldFRpbWVvdXQoY2xlYXJTYXZlZCwgNTAwKTtcclxuXHR9XHJcblxyXG5cdC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vXHJcblx0Ly89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0ZnVuY3Rpb24gY2xlYXJTYXZlZCgpXHJcblx0e1xyXG5cdFx0JHNjb3BlLiRhcHBseShmdW5jdGlvbigpIHtcclxuXHRcdFx0c2VsZi5pc1NhdmluZyA9IGZhbHNlO1xyXG5cdFx0XHRzZWxmLmlzU2F2ZWQgPSBmYWxzZTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0Ly89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0ZnVuY3Rpb24gc2hvd0xvYWRpbmcoKVxyXG5cdHtcclxuXHRcdHNldFN0YXR1cyhudWxsLCB7YWN0OiAnbG9hZGluZyd9KTtcclxuXHR9XHJcblxyXG5cdC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdGZ1bmN0aW9uIGNsZWFyTG9hZGluZygpXHJcblx0e1xyXG5cdFx0c2V0U3RhdHVzKG51bGwsIHthY3Q6ICdjbGVhcid9KTtcclxuXHR9XHJcblxyXG5cdC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vIERpc3BsYXkgYW55IHJlcXVlc3RlZCBzdGF0dXMgdXBkYXRlc1xyXG5cdC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdGZ1bmN0aW9uIHNldFN0YXR1cyhldmVudCwgc3RhdHVzKVxyXG5cdHtcclxuXHRcdC8vIFZhbGlkYXRpb25cclxuXHRcdGlmICh0eXBlb2Ygc3RhdHVzICE9PSAnb2JqZWN0JyAmJiB0eXBlb2Ygc3RhdHVzICE9PSAnc3RyaW5nJylcclxuXHRcdFx0cmV0dXJuO1xyXG5cclxuXHRcdGlmICh0eXBlb2Ygc3RhdHVzID09PSAnc3RyaW5nJylcclxuXHRcdFx0dmFyIG1zZyA9IHN0YXR1cztcclxuXHJcblx0XHRlbHNlIGlmIChzdGF0dXMuYWN0ICYmIHN0YXR1cy5hY3QgPT09ICdjbGVhcicpXHJcblx0XHRcdG1zZyA9ICcnO1xyXG5cdFx0ZWxzZSBpZiAoc3RhdHVzLmFjdCAmJiBzdGF0dXMuYWN0ID09PSAnbG9hZGluZycpXHJcblx0XHRcdG1zZyA9ICdMT0FESU5HLi4uJztcclxuXHJcblx0XHQvLyBIdXJyYXkgZm9yIG11bHRpcGxlIGFub255bW91cyBmdW5jdGlvbnMuIFRoaXMgaXMgYSBtZXNzIVxyXG5cdFx0Ly8gU29tZXRpbWVzIHNldFN0YXR1cyBpcyBjYWxsZWQgYXN5bmNocm9ub3VzbHksIHNvbWV0aW1lcyBzeW5jaHJvbm91c2x5LlxyXG5cdFx0Ly8gV2hlbiBjYWxsZWQgYXN5bmMuLCB3ZSBuZWVkIHRvIHVzZSAkYXBwbHkuIFdoZW4gc3luYy4sIHdlIGNhbid0IHVzZSAkYXBwbHkgKHRocm93cyBpbnByb2cgZXJyb3IpLlxyXG5cdFx0Ly8gRm9yY2UgYXN5bmMgbW9kZSB3aXRoIHNldFRpbWVvdXQsIHRoZW4gdXNlICRhcHBseSBiZWNhdXNlIHdlIGhhdmUgdG8gaW4gYXN5bmMgbW9kZS5cclxuXHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcblx0XHRcdCRzY29wZS4kYXBwbHkoZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0c2VsZi5zdGF0dXMgPSBtc2c7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSwgMCk7XHJcblx0fVxyXG5cclxuXHQvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHRzZWxmLm9wdGlvbnMgPSBmdW5jdGlvbigpXHJcblx0e1xyXG5cdFx0JG1vZGFsLm9wZW4oe1xyXG5cdFx0XHR0ZW1wbGF0ZTogJzxpbWcgc3JjPVwiaW1hZ2VzL21vY2tzL1ByZWZzLnBuZ1wiPicsXHJcblx0XHRcdHNpemU6ICdsZydcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcbn0pO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG4vLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuLy8gUGFja2FnZXMgbWFueSBzbWFsbCByZXF1ZXN0cywgc2VuZGluZyB0aGVtIG9mZiBhdCBhIGZpeGVkIHBlcmlvZC5cclxuLy9cclxuLy8gRHVwbGljYXRlIGFuZCBvYnNvbGV0ZSByZXF1ZXN0cyBhcmUgZWxpbWluYXRlZC4gVGhpcyBpcyBhIG5pY2Ugb3B0aW1pemF0aW9uLCBidXQgaXQncyBub3RcclxuLy8gYWx3YXlzIGRlc2lyZWQuIElmIHRoZSB0aW1pbmcgb2YgdGhlIGFjdGlvbiBtYXR0ZXJzLCBzdWNoIGFzIHNldHRpbmcgdGhhdCBnZXRzIHRvZ2dsZWQgYXRcclxuLy8ga2V5IG1vbWVudHMsIHRoaXMgZmVhdHVyZSB3b3VsZCBiZSBiYWQuIEl0IGNhbiBlaXRoZXIgYmUgZGlzYWJsZWQsIG9yIHRoZSBjbGllbnQgY291bGRcclxuLy8gZW5zdXJlIHVuaXF1ZSBJRHMuXHJcbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5hbmd1bGFyLm1vZHVsZSgnYWN0aW9uLXNlcnZpY2UnKVxyXG5cclxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4uc2VydmljZSgnQ2xvdWRTYXZlJywgZnVuY3Rpb24oUHViU3ViKSB7XHJcblxyXG5cdHZhciBzYXZlUGVyaW9kID0gMTAwMDtcdFx0Ly8gVGltZSwgaW4gbWlsbGlzZWNvbmRzLCBiZXR3ZWVuIHNhdmVzXHJcblxyXG5cdHZhciBwZW5kaW5nID0gZmFsc2U7XHJcblx0dmFyIHRyYW5zbWl0dGluZyA9IGZhbHNlO1xyXG5cclxuXHR2YXIgcGVuZGluZ1F1ZXVlID0gW107XHRcdC8vIFF1ZXVlIGJlaW5nIGFkZGVkIHRvLlxyXG5cdHZhciB0cmFuc21pdFF1ZXVlID0gW107XHRcdC8vIERhdGEgY3VycmVudGx5IGJlaW5nIHRyYW5zbWl0dGVkIChyZXRhaW5lZCBpbiBjYXNlIG9mIGZhaWx1cmUpXHJcblxyXG5cdC8vIEV4dGVybmFsIHJvdXRpbmUgdGhhdCBwZXJmb3JtcyB0aGUgYWN0dWFsIHNhdmUgb3BlcmF0aW9uLCB0eXBpY2FsbHkgYSBSRVNUIGNsaWVudCBmcm9udC1lbmRcclxuXHR2YXIgY29tbU1hbmFnZXI7XHJcblxyXG5cdC8vIEV4dGVybmFsIGZ1bmN0aW9uIHRoYXQgZ2V0cyBjYWxsZWQgYWZ0ZXIgc3VjY2Vzc2Z1bCBzYXZlc1xyXG5cdHZhciBub3RpZnlTdGFydEhhbmRsZXIsIG5vdGlmeURvbmVIYW5kbGVyO1xyXG5cclxuXHQvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBJbml0aWFsaXplIHdpdGggYW4gZXh0ZXJuYWwgc2F2ZSBmdW5jdGlvbi5cclxuXHQvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHRmdW5jdGlvbiBpbml0KGNvbW0sIG5vdGlmeVN0YXJ0LCBub3RpZnlEb25lKVxyXG5cdHtcclxuXHRcdGNvbW1NYW5hZ2VyID0gY29tbTtcclxuXHRcdG5vdGlmeVN0YXJ0SGFuZGxlciA9IG5vdGlmeVN0YXJ0O1xyXG5cdFx0bm90aWZ5RG9uZUhhbmRsZXIgPSBub3RpZnlEb25lO1xyXG5cclxuXHRcdHBlbmRpbmdRdWV1ZSA9IFtdO1xyXG5cdFx0dHJhbnNtaXRRdWV1ZSA9IFtdO1xyXG5cdFx0cGVuZGluZyA9IGZhbHNlO1xyXG5cdFx0dHJhbnNtaXR0aW5nID0gZmFsc2U7XHJcblx0fVxyXG5cclxuXHQvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBBUEk6IEFkZCBhbiBpdGVtIHRvIHRoZSBxdWV1ZVxyXG5cdC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdGZ1bmN0aW9uIGFkZChpZCwgZGF0YSlcclxuXHR7XHJcblx0XHQvLyBBZGQgdG8gdGhlIHF1ZXVlXHJcblx0XHRwZW5kaW5nUXVldWUgPSBhZGRUb1F1ZXVlKGlkLCBkYXRhLCBwZW5kaW5nUXVldWUpO1xyXG5cclxuXHRcdC8vIFRyYW5zbWl0LCBub3cgaWYgd2UgaGF2ZW4ndCB0cmFuc21pdHRlZCBpbiBhIHdoaWxlLlxyXG5cdFx0Ly8gT3RoZXJ3aXNlLCBxdWV1ZSBpdCB1cCBhbmQgc2VuZCBpdCBsYXRlci5cclxuXHRcdGlmICghcGVuZGluZylcclxuXHRcdFx0c2NoZWR1bGVUcmFuc21pc3Npb24oKTtcclxuXHR9XHJcblxyXG5cdC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vIEFkZHMgYSBzaW5nbGUgaXRlbSB0byB0aGUgcXVldWUsIHJlbW92aW5nIGR1cGVzIGZpcnN0LlxyXG5cdC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdGZ1bmN0aW9uIGFkZFRvUXVldWUoaWQsIGRhdGEsIHF1ZXVlKVxyXG5cdHtcclxuXHRcdC8vIENoZWNrIGZvciBleGlzdGluZyBpdGVtcyB0byByZW1vdmVcclxuXHRcdHF1ZXVlID0gXy5yZWplY3QocXVldWUsIGZ1bmN0aW9uKGVudHJ5KXtyZXR1cm4gZW50cnkuaWQgPT09IGlkfSk7XHJcblxyXG5cdFx0Ly8gQWRkIHRoZSBpdGVtIHRvIHRoZSBlbmQgb2YgdGhlIHF1ZXVlXHJcblx0XHRxdWV1ZS5wdXNoKHtcclxuXHRcdFx0aWQ6IGlkLFxyXG5cdFx0XHRkYXRhOiBkYXRhXHJcblx0XHR9KTtcclxuXHJcblx0XHRyZXR1cm4gcXVldWU7XHJcblx0fVxyXG5cclxuXHQvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBSZXF1ZXN0IGEgdHJhbnNtaXNzaW9uIGF0IHNvbWUgcG9pbnQgaW4gdGhlIG5lYXIgZnV0dXJlLlxyXG5cdC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdGZ1bmN0aW9uIHNjaGVkdWxlVHJhbnNtaXNzaW9uKClcclxuXHR7XHJcblx0XHRwZW5kaW5nID0gdHJ1ZTtcclxuXHRcdHNldFRpbWVvdXQobm90aWZ5QW5kU2F2ZSwgMTAwMCk7XHJcblx0fVxyXG5cclxuXHQvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBJdCdzIHRpbWUgZm9yIGFuIGFjdHVhbCB0cmFuc21pc3Npb24uXHJcblx0Ly89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0ZnVuY3Rpb24gbm90aWZ5QW5kU2F2ZSgpXHJcblx0e1xyXG5cdFx0UHViU3ViLnB1Ymxpc2goJ3NhdmVTdGFydCcpO1xyXG5cdFx0ZG9TYXZlKCk7XHJcblx0fVxyXG5cclxuXHQvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBJdCdzIHRpbWUgZm9yIGFuIGFjdHVhbCB0cmFuc21pc3Npb24uXHJcblx0Ly89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0ZnVuY3Rpb24gZG9TYXZlKClcclxuXHR7XHJcblx0XHR0cmFuc21pdHRpbmcgPSB0cnVlO1xyXG5cclxuXHRcdC8vIFRyYW5zbWl0IHRoZSBjdXJyZW50IGNvbGxlY3Rpb25cclxuXHRcdHRyYW5zbWl0UXVldWUgPSBwZW5kaW5nUXVldWU7XHJcblx0XHRwZW5kaW5nUXVldWUgPSBbXTtcclxuXHJcblx0XHR2YXIgZGF0YSA9IF8ucGx1Y2sodHJhbnNtaXRRdWV1ZSwgJ2RhdGEnKTtcclxuXHRcdG5vdGlmeVN0YXJ0SGFuZGxlciAmJiBub3RpZnlTdGFydEhhbmRsZXIoZGF0YSk7XHJcblxyXG5cdFx0Y29tbU1hbmFnZXIoZGF0YSkudGhlbihzYXZlU3VjY2Vzcywgc2F2ZUZhaWxlZCk7XHJcblx0fVxyXG5cclxuXHQvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBTYXZlIGZhaWxlZC4gQWRkIGZhaWxlZCBpdGVtcyBiYWNrIG9udG8gdGhlIHF1ZXVlLlxyXG5cdC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdGZ1bmN0aW9uIHNhdmVGYWlsZWQoZXZlbnQpXHJcblx0e1xyXG5cdFx0Ly8gQ29tYmluZSB0aGUgcXVldWVzIChwZW5kaW5nIGl0ZW1zIGFkZGVkIHRvIHRoZSBlbmQsIGJ1dCByZXBsYWNlIGR1cGxpY2F0ZXMpXHJcblx0XHRmb3IgKHZhciBpID0gMCwgbGVuID0gcGVuZGluZ1F1ZXVlLmxlbmd0aDsgaSA8IGxlbjsgaSsrKVxyXG5cdFx0XHR0cmFuc21pdFF1ZXVlID0gYWRkVG9RdWV1ZShwZW5kaW5nUXVldWVbaV0uaWQsIHBlbmRpbmdRdWV1ZVtpXS5kYXRhLCB0cmFuc21pdFF1ZXVlKTtcclxuXHJcblx0XHRwZW5kaW5nUXVldWUgPSB0cmFuc21pdFF1ZXVlO1x0Ly8gU2lsbHkgb3ZlcmhlYWQgZm9yIGRvU2F2ZSgpXHJcblxyXG5cdFx0Ly8gU3RhcnQgYSByZXNlbmQgaW1tZWRpYXRlbHlcclxuXHRcdGRvU2F2ZSgpO1xyXG5cdH1cclxuXHJcblx0Ly89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly8gVGhlIHRyYW5zbWlzc2lvbiB3YXMgc3VjY2Vzc2Z1bC4gQWxsb3cgbW9yZSByZXF1ZXN0cy5cclxuXHQvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHRmdW5jdGlvbiBzYXZlU3VjY2VzcyhyZXNwb25zZSlcclxuXHR7XHJcblx0XHQvLyBFbXB0eSB0aGUgcXVldWVcclxuXHRcdHRyYW5zbWl0UXVldWUgPSBbXTtcclxuXHJcblx0XHQvLyBOb3RpZnkgaW50ZXJlc3RlZCBwYXJ0aWVzXHJcblx0XHRub3RpZnlEb25lSGFuZGxlciAmJiBub3RpZnlEb25lSGFuZGxlcihyZXNwb25zZSk7XHJcblxyXG5cdFx0Ly8gRmxhZyB0byBhbGxvdyBtb3JlIHJlcXVlc3RzXHJcblx0XHR0cmFuc21pdHRpbmcgPSBmYWxzZTtcclxuXHRcdHBlbmRpbmcgPSBmYWxzZTtcclxuXHRcdFB1YlN1Yi5wdWJsaXNoKCdzYXZlRG9uZScpO1xyXG5cclxuXHRcdC8vIElmIGRhdGEgaXMgYWxyZWFkeSBxdWV1ZWQsIHRyaWdnZXIgYSBuZXcgdHJhbnNtaXNzaW9uXHJcblx0XHRpZiAocGVuZGluZ1F1ZXVlLmxlbmd0aCA+IDApXHJcblx0XHRcdHNjaGVkdWxlVHJhbnNtaXNzaW9uKCk7XHJcblx0fVxyXG5cclxuXHQvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBBUEk6IElzIGEgdHJhbnNtaXNzaW9uIGN1cnJlbnRseSB1bmRlcndheT9cclxuXHQvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHRmdW5jdGlvbiBpc1NhdmluZygpXHJcblx0e1xyXG5cdFx0cmV0dXJuIHRyYW5zbWl0dGluZztcclxuXHR9XHJcblxyXG5cdC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vIEFQSTogSXMgdGhlIHN5c3RlbSBjb21wbGV0ZWx5IGF0IHJlc3Q/XHJcblx0Ly8gVGhhdCBtZWFucyB0aGVyZSBhcmUgbm8gY3VycmVudCB0cmFuc21pc3Npb25zLFxyXG5cdC8vIGFuZCBub3RoaW5nIGlzIHF1ZXVlZCBmb3IgdHJhbnNtaXNzaW9uLlxyXG5cdC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdGZ1bmN0aW9uIGlzSWRsZSgpXHJcblx0e1xyXG5cdFx0cmV0dXJuICh0cmFuc21pdFF1ZXVlLmxlbmd0aCA9PT0gMCAmJiBwZW5kaW5nUXVldWUubGVuZ3RoID09PSAwKTtcclxuXHR9XHJcblxyXG5cdC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vIFB1YmxpYyBBUElcclxuXHQvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHRyZXR1cm4ge1xyXG5cdFx0aW5pdDogaW5pdCxcclxuXHRcdGFkZDogYWRkLFxyXG5cdFx0aXNTYXZpbmc6IGlzU2F2aW5nLFxyXG5cdFx0aXNJZGxlOiBpc0lkbGVcclxuXHR9XHJcbn0pO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG4vLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbmFuZ3VsYXIubW9kdWxlKCdjb21tLXNlcnZpY2UnKVxyXG5cclxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbi8vIFNlcnZpY2UgdG8gZmV0Y2ggYW5kIHRyYW5zbWl0IGRhdGEuXHJcbi8vXHJcbi8vIFRoaXMgaGFuZGxlcyBjYWNoaW5nIGFuZCBwcm92aWRlcyBhIHB1YmxpYyBBUEkgdGhhdCBpc29sYXRlcyBkYXRhIHRyYW5zbWlzc2lvbi5cclxuLy9cclxuLy8gQSBzaW5nbGUgQVBJIGZ1bmN0aW9uIG1heSBwZXJmb3JtIG11bHRpcGxlIFJFU1QgY2FsbHMgdG8gcHJvdmlkZSByZXF1ZXN0ZWQgZGF0YSwgaXNvbGF0aW5nXHJcbi8vIGNvbXBsZXhpdHkgYW5kIHRoZSBzZXJ2ZXIgUkVTVCBpbnRlcmZhY2UuXHJcbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4uc2VydmljZSgnQ29tbScsIGZ1bmN0aW9uKCRodHRwKSB7XHJcblxyXG5cdHZhciBiYXNlID0gJ2h0dHA6Ly9kZ2FsYXJuZWF1LWh3LWJhY2hlbG9yLmtib29rcy5sb2NhbC9yZXN0LnBocC8nO1xyXG5cclxuXHQvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBTZXQgdGhlIGdyYWRlIGZvciBhIHNpbmdsZSBwcm9ibGVtXHJcblx0Ly9cclxuXHQvLyBSZXF1aXJlczpcclxuXHQvLyAgIEFzc2lnbm1lbnQgSUQgKGFpZCkgLS0gcHNldF9pZFxyXG5cdC8vICAgUXVlc3Rpb24gSUQgKHFpZCkgLS0gcHNwX2lkXHJcblx0Ly8gICBVc2VyIElEICh1aWQpIC0tIHVzZXJfaWRcclxuXHQvLyAgIGdyYWRlOiBUaGUgbmV3IHNjb3JlXHJcblx0Ly89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0ZnVuY3Rpb24gc2V0R3JhZGUobGlzdClcclxuXHR7XHJcblx0XHR2YXIgZGF0YSA9IGxpc3RbMF07XHJcblxyXG5cdFx0Ly8kYXBwLT5wdXQoJy9wc2V0Lzpwc2V0X2lkLzpwc3BfaWQvdXNlci86c3R1ZGVudF9pZC9zY29yZScsICdhZGp1c3Rfc2NvcmUnICk7XHJcblx0XHR2YXIgdXJsID0gYmFzZSArICdwc2V0LycgKyBkYXRhLmFpZCArICcvJyArIGRhdGEucWlkICsgJy91c2VyLycgKyBkYXRhLnVpZCArICcvc2NvcmUnO1xyXG5cdFx0cmV0dXJuICRodHRwLnB1dCh1cmwsIHtzY29yZTogZGF0YS5ncmFkZX0pO1xyXG5cdH1cclxuXHJcblx0Ly89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly8gUHVibGljIEFQSVxyXG5cdC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdHJldHVybiB7XHJcblx0XHRzZXRHcmFkZTogc2V0R3JhZGVcclxuXHR9O1xyXG5cclxufSk7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4vLyBHcmFkZWQgUHJvYmxlbXNcclxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbmFuZ3VsYXIubW9kdWxlKCdncmFkZXMnKVxyXG5cclxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4uc2VydmljZSgnUHJvYmxlbXMnLCBmdW5jdGlvbihrYkJvb3RzdHJhcCwgUHViU3ViLCBDb21tLCBDbG91ZFNhdmUpIHtcclxuXHJcblx0Ly8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblx0Ly8gSW50ZXJuYWwgbW9kZWxcclxuXHQvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHQvLyBUcmFuc2xhdGUgc2VydmVyIGFuc3dlciB0eXBlcyB0byBzb21ldGhpbmcgbW9yZSBzYW5lXHJcblx0dmFyIGFuc01hcCA9IHtcclxuXHRcdEtpbmV0aWM6ICdlcXVhdGlvbicsXHJcblx0XHRpbnB1dDogJ2VxdWF0aW9uJyxcclxuXHRcdE11bHRpcGxlOiAnY2hlY2snLFxyXG5cdFx0TXVsdEtpbmV0aWM6ICdmcmVlSW5wdXQnLFxyXG5cdFx0VlRQR3JhcGg6ICdncmFwaFBsb3QnLFxyXG5cdFx0Z3JhcGhDb25zdDogJ2dyYXBoQ29uc3QnLFx0Ly8gTm8gY2hhbmdlXHJcblx0XHQnbm8gaW5wdXQnOiAncGFwZXInLFxyXG5cdFx0ZXNzYXk6ICdlc3NheScsXHJcblx0XHRjaGVjazogJ2NoZWNrJyxcclxuXHRcdHJhZGlvOiAncmFkaW8nXHJcblx0fTtcclxuXHJcblx0Ly8gRnVuY3Rpb25zIHRvIG5vcm1hbGl6ZSBzdWJtaXR0ZWQgYW5kIHN0b3JlZCBhbnN3ZXJzXHJcblx0dmFyIGZvcm1hdCA9IHtcclxuXHRcdGVxdWF0aW9uOiBmb3JtYXRHZW5lcmljQSxcclxuXHRcdGZyZWVJbnB1dDogZm9ybWF0RnJlZUEsXHJcblx0XHRjaGVjazogZm9ybWF0TXVsdENob2ljZSxcclxuXHRcdHJhZGlvOiBmb3JtYXRNdWx0Q2hvaWNlLFxyXG5cdFx0Z3JhcGhQbG90OiBmb3JtYXRHZW5lcmljQSxcclxuXHRcdGdyYXBoQ29uc3Q6IGZvcm1hdEdyYXBoQ29uc3RBLFxyXG5cdFx0ZXNzYXk6IGZvcm1hdEdlbmVyaWNBLFxyXG5cdFx0cGFwZXI6IGZvcm1hdEdlbmVyaWNBXHJcblx0fTtcclxuXHJcblx0Ly8gQW5zd2VyIHR5cGVzIHRoYXQgb25seSBhbGxvdyBhIHNpbmdsZSBpbnN0YW5jZVxyXG5cdHZhciBzaW5nbGVRdHlPbmx5ID0gWydyYWRpbycsICdjaGVjayddO1xyXG5cclxuXHQvLyBxTnVtXHJcblx0Ly8gcHNldF9pZCwgcHNwX2lkLCB1c2VyX2lkLCBmaXJzdF9uYW1lLCBsYXN0X25hbWVcclxuXHQvLyBwcmVmaXgsIHF1ZXN0aW9uLCBxSW1nLCBxSW1nVGV4dCwgY2hvaWNlc1xyXG5cdC8vIGdyYXBoZXF1YXRpb25zLCBncmFwaHBhcm1zXHJcblx0Ly8gYW5zd2VyLCBhbnNUeXBlLFxyXG5cdC8vIHBvaW50cywgbWF4UG9pbnRzLCB0cmllcywgbWF4VHJpZXMsICsraXNQZW5kaW5nXHJcblx0Ly8gZ2l2ZW5cclxuXHR2YXIgcHJvYkxpc3QgPSBbXTtcclxuXHJcblx0Ly8gbW9kZSwgKyt0aXRsZVxyXG5cdHZhciBtZXRhRGF0YSA9IHt9O1xyXG5cdENsb3VkU2F2ZS5pbml0KENvbW0uc2V0R3JhZGUpO1xyXG5cclxuXHQvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBQZXJmb3JtIGJvb3RzdHJhcHBpbmcgLS0gd2h5IGhlcmU/IFdoZXJlIGVsc2Ugd291bGQgaXQgZ28/XHJcblx0Ly89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0aW5pdChrYkJvb3RzdHJhcC5ncmFkZWJvb2suZGF0YSwga2JCb290c3RyYXAudGl0bGUpO1xyXG5cclxuXHQvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvL1xyXG5cdC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdGZ1bmN0aW9uIGluaXQoZGF0YSwgdGl0bGUpXHJcblx0e1xyXG5cdFx0Ly8gRG8gc29tZSBmb3JtYXR0aW5nIGFuZCBjb252ZXJzaW9uLlxyXG5cdFx0Xy5lYWNoKGRhdGEsIGZ1bmN0aW9uKHNyYywgaWR4KSB7XHJcblxyXG5cdFx0XHR2YXIgbmV3UHJvYiA9IHtcclxuXHRcdFx0XHRpZDogaWR4LFxyXG5cdFx0XHRcdHFOdW06IHNyYy5xTnVtIHx8IChpZHgrMSksXHJcblx0XHRcdFx0YWlkOiBzcmMucHNldF9pZCxcclxuXHRcdFx0XHRxaWQ6IHNyYy5wc3BfaWQsXHJcblx0XHRcdFx0dWlkOiBzcmMudXNlcl9pZCxcclxuXHRcdFx0XHR1bmFtZToge2ZpcnN0OiBzcmMuZmlyc3RfbmFtZSwgbGFzdDogc3JjLmxhc3RfbmFtZX0sXHJcblxyXG5cdFx0XHRcdHByZWZpeDogc3JjLnByZWZpeCxcclxuXHRcdFx0XHRxOiBzcmMucXVlc3Rpb24sXHJcblx0XHRcdFx0Y2hvaWNlczogc3JjLmNob2ljZXMsXHJcblx0XHRcdFx0cUltZzogc3JjLnFJbWcsXHJcblx0XHRcdFx0cUltZ092ZXJsYXk6IHNyYy5xSW1nVGV4dCxcclxuXHJcblx0XHRcdFx0Z3JhcGg6IHtlcXM6IHNyYy5ncmFwaGVxdWF0aW9ucywgYXhpczogc3JjLmdyYXBocGFybXN9LFx0Ly8gQnJlYWsgdGhpcyBkb3duIGJldHRlclxyXG5cclxuXHRcdFx0XHRhOiBzcmMuYW5zd2VyLFxyXG5cdFx0XHRcdGFuc1R5cGU6IGFuc01hcFtzcmMuYW5zVHlwZV0sXHJcblxyXG5cdFx0XHRcdHNjb3JlOiAoc3JjLnN0YXR1cyAhPT0gJ3BlbmRpbmcnID8gcGFyc2VGbG9hdChzcmMucG9pbnRzKSA6ICcnKSxcclxuLy9cdFx0XHRcdHNjb3JlOiBwYXJzZUZsb2F0KHNyYy5wb2ludHMpLFxyXG5cdFx0XHRcdHNjb3JlTWF4OiBwYXJzZUZsb2F0KHNyYy5tYXhQb2ludHMpLFxyXG5cdFx0XHRcdGF0dGVtcHRzOiBzcmMudHJpZXMsXHJcblx0XHRcdFx0YXR0ZW1wdHNNYXg6IHNyYy5tYXhUcmllcyxcclxuXHRcdFx0XHRhdHRlbXB0c0xlZnQ6IHNyYy5tYXhUcmllcyAtIHNyYy50cmllcyxcclxuXHRcdFx0XHRzdGF0dXM6IHNyYy5zdGF0dXMsXHJcblx0XHRcdFx0aXNQZW5kaW5nOiBzcmMuc3RhdHVzID09PSAncGVuZGluZycsXHQvLyBTaG9ydGN1dFxyXG5cclxuXHRcdFx0XHRzdWJtaXNzaW9uOiBzcmMuZ2l2ZW4gfHwgJydcclxuXHRcdFx0fTtcclxuXHJcblx0XHRcdGFkanVzdEF0dGVtcHRzKG5ld1Byb2IpO1xyXG5cdFx0XHRjbGVhbkVxdWF0aW9ucyhuZXdQcm9iKTtcclxuXHRcdFx0Y2xlYW5BbnN3ZXIobmV3UHJvYik7XHJcblx0XHRcdGZvcm1hdFtuZXdQcm9iLmFuc1R5cGVdICYmIGZvcm1hdFtuZXdQcm9iLmFuc1R5cGVdKG5ld1Byb2IpO1xyXG5cclxuXHRcdFx0cHJvYkxpc3QucHVzaChuZXdQcm9iKTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdC8vIE5vdyBzZXQgbWV0YWRhdGFcclxuXHRcdG1ldGFEYXRhLm1vZGUgPSBzZXRNb2RlKCk7XHJcblx0XHRtZXRhRGF0YS50aXRsZSA9IHRpdGxlO1xyXG5cdH1cclxuXHJcbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbi8vIEZvcm1hdHRlcnNcclxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcblx0Ly89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly9cclxuXHQvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHRmdW5jdGlvbiBmb3JtYXRHZW5lcmljQShwcm9iKVxyXG5cdHtcclxuXHRcdHByb2IuY2xlYW5BID0gcHJvYi5hO1xyXG5cdFx0cHJvYi5jbGVhblN1YiA9IHByb2Iuc3VibWlzc2lvbjtcclxuXHR9XHJcblxyXG5cdC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vXHJcblx0Ly89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0ZnVuY3Rpb24gZm9ybWF0RnJlZUEocHJvYilcclxuXHR7XHJcblx0XHRwcm9iLmNsZWFuQSA9IHN0cmlwRklBbnN3ZXIocHJvYi5hKTtcclxuXHRcdHByb2IuY2xlYW5TdWIgPSBwcm9iLnN1Ym1pc3Npb247XHJcblx0fVxyXG5cclxuXHQvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvL1xyXG5cdC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdGZ1bmN0aW9uIGZvcm1hdE11bHRDaG9pY2UocHJvYilcclxuXHR7XHJcblx0XHRwcm9iLmNsZWFuQSA9IF8uY2xvbmVEZWVwKHByb2IuY2hvaWNlcyk7XHJcblx0XHRwcm9iLmNsZWFuU3ViID0gXy5jbG9uZURlZXAocHJvYi5jaG9pY2VzKTtcclxuXHJcblx0XHR2YXIgY29ycmVjdCA9IHByb2IuYS5zcGxpdCgnLCcpO1xyXG5cdFx0dmFyIHN1Ym1pdHMgPSBwcm9iLnN1Ym1pc3Npb24uc3BsaXQoJywnKTtcclxuXHJcblx0XHRmb3IgKHZhciBpID0gMCwgbGVuID0gcHJvYi5jaG9pY2VzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKVxyXG5cdFx0e1xyXG5cdFx0XHRpZiAoY29ycmVjdC5pbmRleE9mKHByb2IuY2hvaWNlc1tpXS5pZCkgIT09IC0xKVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0cHJvYi5jbGVhbkFbaV0uY2hlY2sgPSB0cnVlO1xyXG4vL1x0XHRcdFx0cHJvYi5jbGVhbkFbaV0uc3R5bGUgPSAnbWNDb3JyZWN0QW5zJztcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKHN1Ym1pdHMuaW5kZXhPZihwcm9iLmNob2ljZXNbaV0uaWQpICE9PSAtMSlcclxuXHRcdFx0e1xyXG5cdFx0XHRcdHByb2IuY2xlYW5TdWJbaV0uY2hlY2sgPSB0cnVlO1xyXG5cdFx0XHRcdHByb2IuY2xlYW5TdWJbaV0uc3R5bGUgPSBwcm9iLmNsZWFuQVtpXS5jaGVjayA/ICdtY0NvcnJlY3RTdWInIDogJ21jV3JvbmdTdWInO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvL1xyXG5cdC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdGZ1bmN0aW9uIGZvcm1hdEdyYXBoQ29uc3RBKHByb2IpXHJcblx0e1xyXG5cdFx0cHJvYi5jbGVhbkEgPSBwcm9iLmdyYXBoLmVxc1swXTtcclxuXHJcblx0XHR2YXIgdHlwZSA9IHByb2IuY2xlYW5BLnNwbGl0KCc9JylbMF07XHJcblxyXG5cdFx0cHJvYi5jbGVhblN1YiA9IHR5cGUgKyAnPScgKyBwcm9iLnN1Ym1pc3Npb247XHJcblx0fVxyXG5cclxuXHQvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvL1xyXG5cdC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdGZ1bmN0aW9uIHN0cmlwRklBbnN3ZXIobW1sKVxyXG5cdHtcclxuXHRcdHZhciBhbnNMaXN0ID0gW107XHJcblx0XHR2YXIgcmVnZXggPSAvPG1hY3Rpb25bXj5dKj4oPG10ZXh0Pnw8bW5bXj5dKj4pKiguKz8pKDxcXC9tdGV4dD58PFxcL21uPikqPFxcL21hY3Rpb24+L2c7XHJcblxyXG5cdFx0Ly8gcmVwbGFjZSBzZWVtcyBsaWtlIHRoZSB3cm9uZyBjaG9pY2UuIFdlIGp1c3Qgd2FudCB0byBzZWFyY2guIEJ1dCBtdWx0aXBsZSBzZXRzIG9mIHBhcmVucyBtZWFucyB3ZSdkIGhhdmUgdG8gcHJ1bmUgb3V0IG1vc3Qgb2YgdGhlIHJlc3VsdHMuXHJcblx0XHRtbWwucmVwbGFjZShyZWdleCwgZnVuY3Rpb24oZnVsbCwgb3BlbmVyLCB2YWwsIGNsb3Nlcikge1xyXG5cdFx0XHRhbnNMaXN0LnB1c2godmFsKTtcdC8vIFNhdmUgdGhlIHBhcnQgd2UgY2FyZSBhYm91dC5cclxuXHRcdFx0cmV0dXJuIGZ1bGw7XHRcdFx0Ly8gUmV0dXJuIHdpdGhvdXQgY2hhbmdlcy4gQ2x1bXN5IVxyXG5cdFx0fSk7XHJcblxyXG5cdFx0cmV0dXJuIGFuc0xpc3Quam9pbignLCcpO1xyXG5cdH1cclxuXHJcbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG5cdC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vXHJcblx0Ly89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0ZnVuY3Rpb24gYWRqdXN0QXR0ZW1wdHMocHJvYilcclxuXHR7XHJcblx0XHR2YXIgc2luZ2xlQXR0ZW1wdCA9IFsncGFwZXInLCAnZXNzYXknLCAnY2hlY2snLCAncmFkaW8nXTtcclxuXHRcdGlmIChzaW5nbGVBdHRlbXB0LmluZGV4T2YocHJvYi5hbnNUeXBlKSAhPT0gLTEpXHJcblx0XHRcdHByb2IuYXR0ZW1wdHNNYXggPSAxO1xyXG5cclxuXHRcdGlmIChwcm9iLmF0dGVtcHRzID4gcHJvYi5hdHRlbXB0c01heClcclxuXHRcdHtcclxuXHRcdFx0cHJvYi5hdHRlbXB0cyA9IHByb2IuYXR0ZW1wdHNNYXg7XHJcblx0XHRcdHByb2IuYXR0ZW1wdHNMZWZ0ID0gMDtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vIERldGVybWluZXMgdG8gbW9kZSB3ZSdyZSBpbjogTXVsdGlwbGUgc3R1ZGVudHMsIG9yIG11bHRpcGxlIHByb2JsZW1zXHJcblx0Ly89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0ZnVuY3Rpb24gc2V0TW9kZSgpXHJcblx0e1xyXG5cdFx0Ly8gSWYgdGhlcmUncyBvbmx5IG9uZSBwcm9ibGVtLCBpdCBjb3VsZCBnbyBlaXRoZXIgd2F5LiBKdXN0IHBpY2sgb25lLlxyXG5cdFx0Ly8gbXVsdGlQcm9ibGVtIGxvb2tzIGJldHRlciwgc28gdGhhdCdzIG91ciBkZWZhdWx0LlxyXG5cdFx0aWYgKHByb2JMaXN0Lmxlbmd0aCA8IDIpXHJcblx0XHRcdHJldHVybiAnbXVsdGlQcm9ibGVtJztcclxuXHJcblx0XHQvLyBJZiB0aGUgZmlyc3QgMiBwcm9ibGVtcyBhcmUgZm9yIHRoZSBzYW1lIHVzZXIsIGFzc3VtZSB0aGV5IGFsbCBhcmUuXHJcblx0XHRpZiAocHJvYkxpc3RbMF0udWlkID09PSBwcm9iTGlzdFsxXS51aWQpXHJcblx0XHRcdHJldHVybiAnbXVsdGlQcm9ibGVtJztcclxuXHJcblx0XHRyZXR1cm4gJ211bHRpU3R1ZGVudCc7XHJcblx0fVxyXG5cclxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuLy8gVGhlc2UgYXJlIGEgZGlyZWN0IGN1dC1hbmQtcGFzdGUgZnJvbSB0aGUgQXNzaWdubWVudHMgcHJvYmxlbSBtb2RlbC5cclxuLy8gRWl0aGVyIHRoZSBtb2RlbCBuZWVkcyB0byBiZSBzaGFyZWQgKHByb2JhYmx5IGJhZCksIG9yIHRoaXMgZnVuY3Rpb25hbGl0eVxyXG4vLyBuZWVkcyB0byBiZSBtb3ZlZCB0byBhIHNlcnZpY2UhXHJcbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG5cdC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vXHJcblx0Ly89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0ZnVuY3Rpb24gY2xlYW5FcXVhdGlvbnMocHJvYilcclxuXHR7XHJcblx0XHRwcm9iLnEgPSBjbGVhbk1hdGhNTChwcm9iLnEpO1xyXG5cdFx0cHJvYi5hID0gY2xlYW5NYXRoTUwocHJvYi5hKTtcclxuXHJcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IChwcm9iLmNob2ljZXMgJiYgcHJvYi5jaG9pY2VzLmxlbmd0aCk7IGkrKylcclxuXHRcdFx0cHJvYi5jaG9pY2VzW2ldLmEgPSBjbGVhbk1hdGhNTChwcm9iLmNob2ljZXNbaV0uYSk7XHJcblx0fVxyXG5cclxuXHQvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBARklYTUUvZGc6IFRoaXMgaXMgY2F1c2luZyBpc3N1ZXMgaW4gdGFncyB3aXRoIGh5cGhlbnMuXHJcblx0Ly8gQ2xlYW4gdXAgdGV4dCBub2RlcyBvbmx5LlxyXG5cdC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdGZ1bmN0aW9uIGNsZWFuTWF0aE1MKHN0cilcclxuXHR7XHJcblx0XHRpZiAoc3RyKVxyXG5cdFx0XHRyZXR1cm4gc3RyLnJlcGxhY2UoLy0vZywgJyYjODcyMjsnKTtcclxuXHJcblx0XHRyZXR1cm4gJyc7XHJcblx0fVxyXG5cclxuXHQvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvL1xyXG5cdC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdGZ1bmN0aW9uIGNsZWFuQW5zd2VyKHByb2IpXHJcblx0e1xyXG5cdFx0aWYgKHByb2IuYW5zVHlwZSA9PT0gJ2VxdWF0aW9uJylcclxuXHRcdHtcclxuXHRcdFx0Ly8gU3BsaXQgb2ZmIHByZWZpeGVzIGFuZCBzdWZmaXhlc1xyXG5cdFx0XHR2YXIgc3BsaXQgPSBzcGxpdEVxQW5zd2VyKHByb2IuYSk7XHJcblx0XHRcdHByb2IuYSA9IHNwbGl0LmE7XHJcblx0XHRcdHByb2IuYW5zUHJlZml4ID0gc3BsaXQucHJlICYmIHJlcGxhY2VTcGFjZXMoc3BsaXQucHJlKTtcclxuXHRcdFx0cHJvYi5hbnNTdWZmaXggPSBzcGxpdC5wb3N0ICYmIHJlcGxhY2VTcGFjZXMoc3BsaXQucG9zdCk7XHJcblxyXG5cdFx0XHQvLyBDb252ZXJ0IEFORCBhbmQgT1Igc3ltYm9scyB0byB0ZXh0XHJcblx0XHRcdHZhciBmaXhBbmQgPSAvPG1vPihcXHUyMjI3fCYjeDIyMjc7fCYjODc0MzspPFxcL21vPi9nO1xyXG5cdFx0XHR2YXIgZml4T3IgPSAvPG1vPihcXHUyMjI4fCYjeDIyMjg7fCYjODc0NDspPFxcL21vPi9nO1xyXG5cdFx0XHRwcm9iLmEgPSBwcm9iLmEucmVwbGFjZShmaXhBbmQsICc8bXRleHQ+Jm5ic3A7YW5kJm5ic3A7PC9tdGV4dD4nKTtcclxuXHRcdFx0cHJvYi5hID0gcHJvYi5hLnJlcGxhY2UoZml4T3IsICc8bXRleHQ+Jm5ic3A7b3ImbmJzcDs8L210ZXh0PicpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0Ly89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0ZnVuY3Rpb24gc3BsaXRFcUFuc3dlcihzdHIpXHJcblx0e1xyXG5cdFx0c3RyID0gc3RyLnRyaW0oKTtcclxuXHJcblx0XHRpZiAodHlwZW9mKHN0cikgIT09ICdzdHJpbmcnKVxyXG5cdFx0XHRyZXR1cm4ge2E6IHN0cn07XHJcblxyXG5cdFx0dmFyIG9wZW4gPSBmaW5kQWxsKCc8b3V0c2lkZT4nLCBzdHIpO1xyXG5cdFx0dmFyIGNsb3NlID0gZmluZEFsbCgnPC9vdXRzaWRlPicsIHN0cik7XHJcblxyXG5cdFx0dmFyIGVyclN0cmluZyA9ICdQcmVmaXgvU3VmZml4IGVycm9yISc7XHJcblxyXG5cdFx0Ly8gVGFnIG1pc21hdGNoIG9yIHRvbyBtYW55IHRhZ3NcclxuXHRcdGlmICgob3Blbi5sZW5ndGggIT09IGNsb3NlLmxlbmd0aCkgfHwgb3Blbi5sZW5ndGggPiAyKVxyXG5cdFx0XHRyZXR1cm4ge2E6IGVyclN0cmluZ307XHJcblxyXG5cdFx0Ly8gTm8gb3V0c2lkZSB0YWdzIC0tIG1vc3QgY29tbW9uIG9jY3VycmVuY2VcclxuXHRcdGlmICghb3Blbi5sZW5ndGgpXHJcblx0XHRcdHJldHVybiB7YTogc3RyfTtcclxuXHJcblx0XHR2YXIgb3V0T3BlbiA9IFwiPG91dHNpZGU+XCI7XHJcblx0XHR2YXIgb3V0Q2xvc2UgPSBcIjwvb3V0c2lkZT5cIjtcclxuXHJcblx0XHRpZiAob3BlblswXSA9PT0gMClcclxuXHRcdHtcclxuXHRcdFx0dmFyIHByZSA9IHN0ci5zdWJzdHJpbmcob3BlblswXSArIG91dE9wZW4ubGVuZ3RoLCBjbG9zZVswXSk7XHJcblx0XHRcdG9wZW4uc2hpZnQoKTtcclxuXHRcdFx0Y2xvc2Uuc2hpZnQoKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoY2xvc2UubGVuZ3RoICYmIChjbG9zZVswXSA9PT0gc3RyLmxlbmd0aCAtIG91dENsb3NlLmxlbmd0aCkpXHJcblx0XHR7XHJcblx0XHRcdHZhciBwb3N0ID0gc3RyLnN1YnN0cmluZyhvcGVuWzBdICsgb3V0T3Blbi5sZW5ndGgsIHN0ci5sZW5ndGggLSBvdXRDbG9zZS5sZW5ndGgpO1xyXG5cdFx0XHRvcGVuLnNoaWZ0KCk7XHJcblx0XHRcdGNsb3NlLnNoaWZ0KCk7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gQ2hlY2sgZm9yIHRhZ3Mgbm90IGF0IHRoZSBzdGFydCBvciBlbmQgb2YgdGhlIHN0cmluZ1xyXG5cdFx0aWYgKG9wZW4ubGVuZ3RoKVxyXG5cdFx0XHRyZXR1cm4ge2E6IGVyclN0cmluZ307XHJcblxyXG5cdFx0Ly8gU3RyaXAgYWxsIG91dHNpZGUgdGFnc1xyXG5cdFx0dmFyIHJlZ2V4ID0gLzxvdXRzaWRlPi4qPzxcXC9vdXRzaWRlPi9nO1xyXG5cdFx0c3RyID0gc3RyLnJlcGxhY2UocmVnZXgsICcnKTtcclxuXHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRhOiBzdHIudHJpbSgpLFxyXG5cdFx0XHRwcmU6IHByZSxcclxuXHRcdFx0cG9zdDogcG9zdFxyXG5cdFx0fTtcclxuXHR9XHJcblxyXG5cdC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vIFBvb3IgbWFuJ3MgWE1MLXNhZmUgc3RyaW5nIHJlcGxhY2VtZW50XHJcblx0Ly8gVGhpcyBpcyBzZXJpb3VzbHkgaW5hZGVxdWF0ZSwgYnV0IG1heSBiZVxyXG5cdC8vIGp1c3QgY3JhenkgZW5vdWdoIHRvIHdvcmsuXHJcblx0Ly9cclxuXHQvLyBJdCdzIGxpa2VseSB0byBjYXVzZSBpc3N1ZXMuXHJcblx0Ly89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0ZnVuY3Rpb24gcmVwbGFjZVNwYWNlcyhzdHIpXHJcblx0e1xyXG5cdFx0aWYgKHN0clswXSA9PT0gJyAnKVxyXG5cdFx0XHRzdHIgPSAnXFx1MDBBMCcgKyBzdHI7O1xyXG5cdFx0aWYgKF8uZW5kc1dpdGgoc3RyLCAnICcpKVxyXG5cdFx0XHRzdHIgKz0gJ1xcdTAwQTAnO1xyXG5cclxuXHRcdHJldHVybiBzdHI7XHJcblx0fVxyXG5cclxuXHQvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBGaW5kIGFsbCBpbnN0YW5jZXMgb2YgYSBzdWJzdHJpbmcgd2l0aGluIGEgc3RyaW5nLlxyXG5cdC8vIFRoZSByZXR1cm4gdmFsdWUgaXMgYW4gYXJyYXkgb2YgaW5kaWNlcy5cclxuXHQvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHRmdW5jdGlvbiBmaW5kQWxsKG5lZWRsZSwgaGF5c3RhY2spXHJcblx0e1xyXG5cdFx0dmFyIG91dCA9IFtdO1xyXG5cdFx0dmFyIGlkeCA9IC0xO1xyXG5cclxuXHRcdHdoaWxlICh0cnVlKVxyXG5cdFx0e1xyXG5cdFx0XHRpZHggPSBoYXlzdGFjay5pbmRleE9mKG5lZWRsZSwgaWR4KzEpO1xyXG5cclxuXHRcdFx0aWYgKGlkeCA9PT0gLTEpXHJcblx0XHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0XHRvdXQucHVzaChpZHgpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBvdXQ7XHJcblx0fVxyXG5cclxuXHQvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBMb29rIHVwIGEgcHJvYmxlbSBieSBJRFxyXG5cdC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdGZ1bmN0aW9uIGZpbmRQcm9ibGVtKGlkKVxyXG5cdHtcclxuXHRcdGZvciAodmFyIGkgPSAwLCBsZW4gPSBwcm9iTGlzdC5sZW5ndGg7IGkgPCBsZW47IGkrKylcclxuXHRcdHtcclxuXHRcdFx0aWYgKHByb2JMaXN0W2ldLmlkID09PSBpZClcclxuXHRcdFx0XHRyZXR1cm4gcHJvYkxpc3RbaV07XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIG51bGw7XHJcblx0fVxyXG5cclxuXHQvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBVcGRhdGVzIHRoZSBzdGF0dXMuIEl0IGNhbid0IHNldCB0aGUgcGVuZGluZyBzdGF0dXMsIGJlY2F1c2VcclxuXHQvLyB0aGVyZSBpcyBubyB3YXkgdG8ga25vdy5cclxuXHQvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHRmdW5jdGlvbiBnZXRTdGF0dXMocHJvYilcclxuXHR7XHJcblx0XHRpZiAocHJvYi5zY29yZSA+IDApXHJcblx0XHRcdHJldHVybiAnY29ycmVjdCc7XHJcblxyXG5cdFx0aWYgKHByb2IuYXR0ZW1wdHMgPj0gcHJvYi5hdHRlbXB0c01heClcclxuXHRcdFx0cmV0dXJuICdpbmNvcnJlY3QnO1xyXG5cclxuXHRcdHJldHVybiAnbmV3JztcclxuXHR9XHJcblxyXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuXHQvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvL1xyXG5cdC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdGZ1bmN0aW9uIGdldCgpXHJcblx0e1xyXG5cdFx0cmV0dXJuIGFuZ3VsYXIuY29weShwcm9iTGlzdCk7XHJcblx0fVxyXG5cclxuXHQvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvL1xyXG5cdC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdGZ1bmN0aW9uIHBlbmRpbmdDb3VudCgpXHJcblx0e1xyXG5cdFx0dmFyIGNudCA9IDA7XHJcblxyXG5cdFx0Zm9yICh2YXIgaSA9IDAsIGxlbiA9IHByb2JMaXN0Lmxlbmd0aDsgaSA8IGxlbjsgaSsrKVxyXG5cdFx0e1xyXG5cdFx0XHRpZiAocHJvYkxpc3RbaV0uaXNQZW5kaW5nKVxyXG5cdFx0XHRcdGNudCsrO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBjbnQ7XHJcblx0fVxyXG5cclxuXHQvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBSZXR1cm5zIHRoZSB0b3RhbCBudW1iZXIgb2YgcHJvYmxlbXNcclxuXHQvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHRmdW5jdGlvbiBjb3VudCgpXHJcblx0e1xyXG5cdFx0cmV0dXJuIHByb2JMaXN0Lmxlbmd0aDtcclxuXHR9XHJcblxyXG5cdC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vIE1vZGlmaWVzIHRoZSBzY29yZSBmb3IgYSBzaW5nbGUgcHJvYmxlbVxyXG5cdC8vIFVwZGF0ZXMgdGhlIHN0YXR1cyBvZiB0aGUgcHJvYmxlbSBiYXNlZCBvbiB0aGUgcmVzdWx0LlxyXG5cdC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdGZ1bmN0aW9uIHNldFBvaW50cyhpZCwgcHRzKVxyXG5cdHtcclxuXHRcdC8vIEZpbmQgdGhlIHByb2JsZW1zXHJcblx0XHR2YXIgcHJvYiA9IGZpbmRQcm9ibGVtKGlkKTtcclxuXHRcdGlmICghcHJvYilcclxuXHRcdFx0cmV0dXJuIG51bGw7XHJcblxyXG5cdFx0Ly8gRW5zdXJlIHNvbWV0aGluZyBpcyBhY3R1YWxseSBjaGFuZ2luZy5cclxuXHRcdC8vIElmIHRoZSBwcm9ibGVtIHdhcyBwZW5kaW5nLCBhbnkgY2hhbmdlIGlzIHdvcnRoIG5vdGluZy5cclxuXHRcdGlmIChwcm9iLnNjb3JlID09PSBwdHMgJiYgIXByb2IuaXNQZW5kaW5nKVxyXG5cdFx0XHRyZXR1cm4gbnVsbDtcclxuXHJcblx0XHQvLyBTZXQgdGhlIG5ldyBzY29yZVxyXG5cdFx0cHJvYi5zY29yZSA9IHB0cztcclxuXHJcblx0XHQvLyBVcGRhdGUgdmFyaW91cyBvdGhlciBmaWVsZHNcclxuXHRcdGlmIChwdHMgPD0gMClcclxuXHRcdHtcclxuXHRcdFx0cHJvYi5hdHRlbXB0cyA9IHByb2IuYXR0ZW1wdHNNYXg7XHQvLyBUaGlzIG1hcmtzIHRoZSBwcm9ibGVtIGFzIGluY29ycmVjdC4gVW5mb3J0dW5hdGVseSwgd2UgbG9zZSB0aGUgcHJvcGVyIGNvdW50LlxyXG5cdFx0XHRwcm9iLmF0dGVtcHRzTGVmdCA9IDA7XHJcblx0XHR9XHJcblxyXG5cdFx0cHJvYi5pc1BlbmRpbmcgPSBmYWxzZTtcclxuXHRcdHByb2Iuc3RhdHVzID0gZ2V0U3RhdHVzKHByb2IpO1x0Ly8gU2luY2Ugd2Ugc2V0IHRoZSBhdHRlbXB0cyBhYm92ZSwgaXQncyBpbXBvc3NpYmxlIGZvciB0aGlzIHRvIGJlIFwibmV3XCIgKG9yIFwicGVuZGluZ1wiLCBmb3Igb3RoZXIgcmVhc29ucylcclxuXHJcblx0XHQvLyBJbml0aWF0ZSBhIGJhY2tncm91bmQgc2F2ZVxyXG5cdFx0Q2xvdWRTYXZlLmFkZCgnZ3JhZGVDaGFuZ2UnLCB7XHJcblx0XHRcdGFpZDogcHJvYi5haWQsXHJcblx0XHRcdHFpZDogcHJvYi5xaWQsXHJcblx0XHRcdHVpZDogcHJvYi51aWQsXHJcblx0XHRcdGdyYWRlOiBwdHNcclxuXHRcdH0pO1xyXG5cclxuXHRcdC8vIFJldHVybiB0aGUgbmV3IHByb2JsZW0gaW5zdGFuY2UgdG8gdGhlIGNsaWVudCBzbyB0aGV5IGRvbid0IGhhdmUgdG8gZG8gYWxsIHRoZSBzYW1lIGNhbGN1bGF0aW9uc1xyXG5cdFx0cmV0dXJuIGFuZ3VsYXIuY29weShwcm9iKTtcclxuXHR9XHJcblxyXG5cdC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vIFJldHVybnMgdGhlIHBhZ2UncyBtb2RlXHJcblx0Ly89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0ZnVuY3Rpb24gZ2V0TW9kZSgpXHJcblx0e1xyXG5cdFx0cmV0dXJuIG1ldGFEYXRhLm1vZGU7XHJcblx0fVxyXG5cclxuXHQvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvL1xyXG5cdC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdGZ1bmN0aW9uIGdldFRpdGxlKClcclxuXHR7XHJcblx0XHRyZXR1cm4gbWV0YURhdGEudGl0bGU7XHJcblx0fVxyXG5cclxuXHQvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBQdWJsaWMgQVBJXHJcblx0Ly89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0cmV0dXJuIHtcclxuXHRcdGdldDogZ2V0LFxyXG5cdFx0cGVuZGluZ0NvdW50OiBwZW5kaW5nQ291bnQsXHJcblx0XHRjb3VudDogY291bnQsXHJcblx0XHRzZXRQb2ludHM6IHNldFBvaW50cyxcclxuXHJcblx0XHRtb2RlOiBnZXRNb2RlLFxyXG5cdFx0dGl0bGU6IGdldFRpdGxlLFxyXG5cdH07XHJcblxyXG59KTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbi8vIFRoZSBzaW1wbGVzdCBwZXJzaXN0ZW50IHN0YXRlIHBvc3NpYmxlXHJcbi8vXHJcbi8vIFN0YXRlIGlzIGN1cnJlbnRseSBiZWluZyB1c2VkIGZvciB0d28gZGlmZmVyZW50IHRoaW5nczpcclxuLy8gICAxKSBBcHAtd2lkZSBnbG9iYWwgdmFyaWFibGVzIChvcHRpb24gc2V0dGluZ3MsIGV0Yy4pXHJcbi8vICAgMikgQ29uc3RhbnRzXHJcbi8vXHJcbi8vIFRoZSBjb25zdGFudHMgc2hvdWxkIHByb2JhYmx5IGJlIHJlcGxhY2VkIGJ5IGEgLmNvbnN0YW50IHByb3ZpZGVyLiBUZWNobmljYWxseSwgdGhleSBhcmVcclxuLy8gcGFydCBvZiB0aGUgZ2xvYmFsIHZhcmlhYmxlcyBuZWVkZWQgZXZlcnl3aGVyZS4gSG93ZXZlciwgdGhlaXIgcmVhZC1vbmx5IG5hdHVyZSBhbmRcclxuLy8gc2VwYXJhdGUgc291cmNlIHN1Z2dlc3RzIHRoZXkgYmUgc2VwYXJhdGVkIGZyb20gdGhlIHJlc3Qgb2YgU3RhdGUuXHJcbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5hbmd1bGFyLm1vZHVsZSgnc3RhdGUtc2VydmljZScsIFsncHVic3ViLXNlcnZpY2UnXSlcclxuXHJcbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4vLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuLnNlcnZpY2UoJ1N0YXRlJywgZnVuY3Rpb24oUHViU3ViKSB7XHJcblxyXG5cdHZhciBzdGF0ZSA9IHtcclxuXHJcblx0XHQvLyBBcHBsaWNhdGlvbiBWZXJzaW9uXHJcblx0XHRhcHBOYW1lOiAnR3JhZGVzJyxcclxuXHRcdHZlcnNpb246ICcwLjEuMSdcclxuXHR9O1xyXG5cclxuXHRyZXR1cm4ge1xyXG5cclxuXHRcdC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdFx0Ly89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0XHRnZXQ6IGZ1bmN0aW9uKGtleSkge1xyXG5cdFx0XHRyZXR1cm4gc3RhdGVba2V5XTtcclxuXHRcdH0sXHJcblxyXG5cdFx0Ly89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0XHQvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHRcdHNldDogZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xyXG5cdFx0XHRpZiAoc3RhdGVba2V5XSAhPT0gdmFsdWUpXHJcblx0XHRcdHtcclxuXHRcdFx0XHRzdGF0ZVtrZXldID0gdmFsdWU7XHJcblx0XHRcdFx0UHViU3ViLnB1Ymxpc2goJ1N0YXRlQ2hhbmdlOicgKyBrZXksIHZhbHVlKTtcdFx0Ly8gU3RhdGUgY2hhbmdlIG5vdGlmaWNhdGlvblxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fTtcclxuXHJcbn0pO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG4vLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuLy8gUGVyZm9ybXMgTWF0aEpheCBjb252ZXJzaW9uIG9uIHJlcXVlc3QgKHdhcyBhdXRvbWF0aWMsIGJ1dCB0aGF0IHdhcyBUT08gU0xPVylcclxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbmFuZ3VsYXIubW9kdWxlKCdwcm9ibGVtVHlwZScpXHJcblxyXG4uZGlyZWN0aXZlKCdmcmVlSW5wdXQnLCBmdW5jdGlvbigpIHtcclxuXHJcblx0Ly8gU2VhcmNoZXMgZm9yIGZyZWUgaW5wdXQgYm94ZXNcclxuXHQvLyBUYWdzIGluc2lkZSB0aGUgPG1hY3Rpb24+IGNhbiBiZSBlaXRoZXIgPG10ZXh0PiBpZiB0aGVyZSdzIG5vIFZUUCBpbnNpZGUsIG9yIDxtbj4gaWYgdGhlXHJcblx0Ly8gdmFsdWUgaXMgVlRQZWQuIFRoYXQgaXMgd2VpcmQgYW5kIGluY29uc2lzdGVudC4gV2UgcHJvYmFibHkgd2FudCA8bW4+IGluIGFsbCBjYXNlcyBmb3JcclxuXHQvLyBwcm9wZXIgZGlzcGxheS5cclxuXHR2YXIgcmVnZXggPSAvPG1hY3Rpb25bXj5dKj4oPG10ZXh0Pnw8bW5bXj5dKj4pKiguKz8pKDxcXC9tdGV4dD58PFxcL21uPikqPFxcL21hY3Rpb24+L2c7XHJcblxyXG5cdC8vIFJlcGxhY2VtZW50IHdoZW4gd2UgZG9uJ3Qgd2FudCB0byBkaXNwbGF5IHRoZSBhbnN3ZXJcclxuXHR2YXIgcmVwbGFjZUhpZGRlbiA9ICc8bWVuY2xvc2UgY2xhc3M9XCJwbGFjZWhvbGRlclwiIG5vdGF0aW9uPVwiYm94XCI+PG1zcGFjZSBoZWlnaHQ9XCIxOHB4XCIgd2lkdGg9XCI0MHB4XCIgLz48L21lbmNsb3NlPic7XHJcblxyXG5cdC8vIFNob3cgdGhlIGFuc3dlciB3aGVuIHRoZXJlIGFyZSBtdWx0aXBsZSBpbnB1dCBib3hlc1xyXG5cdC8vIEBGSVhNRS9kZzogUGFkZGluZyBhZGRlZCBmb3IgZ3JhZGUgY2hhbmdlIG9ubHkuIFJlaW50ZWdyYXRlIHdpdGggQXNzaWdubWVudCdzIGZyZWVJbnB1dC5qcyB3aXRoIGEgY29uZmlnIGJsb2NrLlxyXG5cdHZhciByZXBsYWNlVmlzaWJsZU1hbnkgPSAnPG1lbmNsb3NlIG5vdGF0aW9uPVwiYm94XCI+PG1wYWRkZWQgd2lkdGg9XCIrNHB4XCIgaGVpZ2h0PVwiKzJweFwiIGRlcHRoPVwiKzJweFwiPjxtbj4kMjwvbW4+PC9tcGFkZGVkPjwvbWVuY2xvc2U+JztcclxuXHR2YXIgcmVwbGFjZVdpdGhJbmplY3QgPSBbJzxtZW5jbG9zZSBub3RhdGlvbj1cImJveFwiPjxtcGFkZGVkIHdpZHRoPVwiKzRweFwiIGhlaWdodD1cIisycHhcIiBkZXB0aD1cIisycHhcIj48bW4+JywnPC9tbj48L21wYWRkZWQ+PC9tZW5jbG9zZT4nXTtcclxuXHJcblx0Ly8gU2hvdyB0aGUgYW5zd2VyIHdoZW4gdGhlcmUgaXMgb25lIGlucHV0IGJveGVzIC0tIGRyb3AgdGhlIHN1cnJvdW5kaW5nIGJveFxyXG5cdHZhciByZXBsYWNlVmlzaWJsZU9uZSA9ICAnPG1uPiQyPC9tbj4nO1xyXG5cclxuXHJcblx0Ly89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0ZnVuY3Rpb24gZm9ybWF0SGlkZGVuKHN0cmluZylcclxuXHR7XHJcblx0XHRyZXR1cm4gc3RyaW5nLnJlcGxhY2UocmVnZXgsIHJlcGxhY2VIaWRkZW4pO1xyXG5cdH1cclxuXHJcblx0Ly89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0ZnVuY3Rpb24gZm9ybWF0VmlzaWJsZShzdHJpbmcsIGFuc3dlcnMpXHJcblx0e1xyXG5cdFx0Ly8gRmluZCBvdXQgaG93IG1hbnkgaW5wdXQgYm94ZXMgdGhlcmUgYXJlXHJcblx0XHR2YXIgbWF0Y2ggPSBzdHJpbmcubWF0Y2gocmVnZXgpO1xyXG5cclxuXHRcdC8vIEBGSVhNRS9kZzogQWx3YXlzIHNob3cgdGhlIGJveCBmb3IgZ3JhZGUgY2hhbmdlIG9ubHkuIFJlaW50ZWdyYXRlIHdpdGggQXNzaWdubWVudCdzIGZyZWVJbnB1dC5qcyB3aXRoIGEgY29uZmlnIGJsb2NrLlxyXG5cdFx0aWYgKCFhbnN3ZXJzKVxyXG5cdFx0XHRyZXR1cm4gc3RyaW5nLnJlcGxhY2UocmVnZXgsIHJlcGxhY2VWaXNpYmxlTWFueSk7XHJcblx0XHRlbHNlXHJcblx0XHR7XHJcblx0XHRcdHZhciBhbnNMaXN0ID0gYW5zd2Vycy5zcGxpdCgnLCcpO1xyXG5cclxuXHRcdFx0cmV0dXJuIHN0cmluZy5yZXBsYWNlKHJlZ2V4LCBmdW5jdGlvbihsaXN0KSB7XHJcblx0XHRcdFx0cmV0dXJuIHJlcGxhY2VXaXRoSW5qZWN0WzBdICsgYW5zTGlzdC5zaGlmdCgpICsgcmVwbGFjZVdpdGhJbmplY3RbMV07XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0Ly89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly9cclxuXHQvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHRmdW5jdGlvbiBsaW5rKHNjb3BlLCBlbGVtZW50LCBhdHRycylcclxuXHR7XHJcblx0XHRpZiAoYXR0cnMuZmlNb2RlID09PSAnaGlkZGVuJylcclxuXHRcdFx0dmFyIG91dHB1dCA9IGZvcm1hdEhpZGRlbihzY29wZS5tb2RlbCk7XHJcblx0XHRlbHNlXHJcblx0XHRcdHZhciBvdXRwdXQgPSBmb3JtYXRWaXNpYmxlKHNjb3BlLm1vZGVsLCBzY29wZS5hbnN3ZXJzKTtcclxuXHJcblx0XHRlbGVtZW50Lmh0bWwob3V0cHV0KTtcclxuXHR9XHJcblxyXG5cdC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdHJldHVybiB7XHJcblx0XHRyZXN0cmljdDogJ0UnLFxyXG5cclxuXHRcdHNjb3BlOiB7XHJcblx0XHRcdG1vZGVsOiAnPWZpRGF0YScsXHJcblx0XHRcdGFuc3dlcnM6ICc9ZmlBbnN3ZXJzJ1xyXG5cdFx0fSxcclxuXHJcblx0XHRsaW5rOiBsaW5rXHJcblx0fTtcclxufSlcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbi8vIFBlcmZvcm1zIE1hdGhKYXggY29udmVyc2lvbiBvbiByZXF1ZXN0ICh3YXMgYXV0b21hdGljLCBidXQgdGhhdCB3YXMgVE9PIFNMT1cpXHJcbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5hbmd1bGFyLm1vZHVsZSgncHJvYmxlbVR5cGUnKVxyXG5cclxuLmRpcmVjdGl2ZSgnZ3JhcGhDb25zdCcsIGZ1bmN0aW9uKCkge1xyXG5cclxuXHQvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBDb21iaW5lIGNlcnRhaW4gdHlwZXMgaW50byBhIG1ldGF0eXBlIHRvIGtlZXAgdGhlXHJcblx0Ly8gZ3JhcGhUeXBlcyBsaXN0IGNsZWFuIGFuZCBjb21wYWN0LlxyXG5cdC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdHZhciBncmFwaFR5cGVNYXAgPSB7XHJcblx0XHRoeXBlcmJvbGF4cG9zOiAnaHlwZXJib2xhJyxcclxuXHRcdGh5cGVyYm9sYXlwb3M6ICdoeXBlcmJvbGEnLFxyXG5cdFx0cGFyYWJvbGF4MjogJ3BhcmFib2xhJyxcclxuXHRcdHBhcmFib2xheTI6ICdwYXJhYm9sYScsXHJcblx0fVxyXG5cclxuXHQvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHR2YXIgZ3JhcGhUeXBlcyA9IHtcclxuXHRcdHBvaW50OiB7XHJcblx0XHRcdHBhcmFtczogWyd4JywgJ3knXSxcdC8vIE5hbWVzIG9mIGZpZWxkcyB0byBiZSBlbnRlcmVkIGJ5IHRoZSBzdHVkZW50IGluIGdyYXBoQ29uc3QgcXVlc3Rpb25zIChpbiB0aGUgc2FtZSBvcmRlciBhcyB0aGUgZGF0YWJhc2UpXHJcblx0XHRcdHBsb3Q6IDFcdFx0Ly8gTnVtYmVyIG9mIHBvaW50cyByZXF1aXJlZCB0byBiZSBwbG90dGVkIGluIGdyYXBoUGxvdCBxdWVzdGlvbnNcclxuXHRcdH0sXHJcblxyXG5cdFx0bGluZToge1xyXG5cdFx0XHRwYXJhbXM6IFsnU2xvcGUgKG0pJywgJ3kgaW50ZXJjZXB0IChiKSddLFxyXG5cdFx0XHRwbG90OiAzXHJcblx0XHR9LFxyXG5cclxuXHRcdGNpcmNsZToge1xyXG5cdFx0XHRwYXJhbXM6IFsnQ2VudGVyIHgnLCAnQ2VudGVyIHknLCAnUmFkaXVzJ10sXHJcblx0XHRcdHBsb3Q6IDRcclxuXHRcdH0sXHJcblxyXG5cdFx0ZWxsaXBzZToge1xyXG5cdFx0XHRwYXJhbXM6IFsnaCcsICdrJywgJ2EnLCAnYiddLFxyXG5cdFx0XHRwbG90OiA0XHJcblx0XHR9LFxyXG5cclxuXHRcdGh5cGVyYm9sYToge1xyXG5cdFx0XHRwYXJhbXM6IFsnaCcsICdrJywgJ2EnLCAnYiddLFxyXG5cdFx0XHRwbG90OiA0XHJcblx0XHR9LFxyXG5cclxuXHRcdHBhcmFib2xhOiB7XHJcblx0XHRcdHBhcmFtczogWydoJywgJ2snLCAncCddLFxyXG5cdFx0XHRwbG90OiA0XHJcblx0XHR9LFxyXG5cdH1cclxuXHJcblx0Ly89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0ZnVuY3Rpb24gaW5wdXRDbnQodHlwZSlcclxuXHR7XHJcblx0XHQvLyBDb252ZXJ0IHRvIGEgbWV0YXR5cGUgaWYgb25lIGlzIGF2YWlsYWJsZVxyXG5cdFx0aWYgKGdyYXBoVHlwZU1hcFt0eXBlXSlcclxuXHRcdFx0dHlwZSA9IGdyYXBoVHlwZU1hcFt0eXBlXTtcclxuXHJcblx0XHRpZiAoZ3JhcGhUeXBlc1t0eXBlXSlcclxuXHRcdFx0cmV0dXJuIGdyYXBoVHlwZXNbdHlwZV0ucGxvdDtcclxuXHJcblx0XHRyZXR1cm4gMTtcdFx0Ly8gVW5rbm93biB0eXBlLiBXZSBuZWVkIGEgZGVmYXVsdC5cclxuXHR9XHJcblxyXG5cdC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdGZ1bmN0aW9uIGdldFBhcmFtcyh0eXBlKVxyXG5cdHtcclxuXHRcdC8vIENvbnZlcnQgdG8gYSBtZXRhdHlwZSBpZiBvbmUgaXMgYXZhaWxhYmxlXHJcblx0XHRpZiAoZ3JhcGhUeXBlTWFwW3R5cGVdKVxyXG5cdFx0XHR0eXBlID0gZ3JhcGhUeXBlTWFwW3R5cGVdO1xyXG5cclxuXHRcdGlmIChncmFwaFR5cGVzW3R5cGVdKVxyXG5cdFx0XHRyZXR1cm4gZ3JhcGhUeXBlc1t0eXBlXS5wYXJhbXM7XHJcblxyXG5cdFx0cmV0dXJuIFsnVW5rbm93biddO1x0XHQvLyBVbmtub3duIHR5cGUuIFRyeSB0byBtYWtlIGl0IG9idmlvdXMuXHJcblx0fVxyXG5cclxuXHQvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBDb252ZXJ0cyBhIHN0cmluZyBncmFwaCBkZWZpbml0aW9uIHRvIGFuIG9iamVjdFxyXG5cdC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdGZ1bmN0aW9uIGdyYXBoU3RyVG9PYmooc3RyaW5nKVxyXG5cdHtcclxuXHRcdGlmICghc3RyaW5nIHx8IHR5cGVvZihzdHJpbmcpICE9PSAnc3RyaW5nJyB8fCBzdHJpbmcuaW5kZXhPZignPScpID09PSAtMSlcclxuXHRcdFx0cmV0dXJuIHt0eXBlOiAndW5rbm93bid9O1xyXG5cclxuXHRcdHZhciBlcUlkeCA9IHN0cmluZy5pbmRleE9mKCc9Jyk7XHJcblx0XHR2YXIgdHlwZSA9IHN0cmluZy5zbGljZSgwLCBlcUlkeCkudG9Mb3dlckNhc2UoKTtcclxuXHRcdHZhciBwYXJhbXMgPSBzdHJpbmcuc2xpY2UoZXFJZHgrMSk7XHJcblx0XHRpZiAocGFyYW1zKVxyXG5cdFx0XHR2YXIgcGFyYW1MaXN0ID0gcGFyYW1zLnNwbGl0KCcsJyk7XHJcblxyXG5cdFx0cmV0dXJuIHt0eXBlOnR5cGUsIHBhcmFtczogcGFyYW1MaXN0fTtcclxuXHR9XHJcblxyXG5cdC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vXHJcblx0Ly89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0ZnVuY3Rpb24gbGluayhzY29wZSwgZWxlbWVudCwgYXR0cnMpXHJcblx0e1xyXG5cdFx0Ly8gQ29udmVydCBhbnN3ZXIgc3RyaW5nIGludG8gb2JqZWN0XHJcblx0XHR2YXIgb2JqID0gZ3JhcGhTdHJUb09iaihzY29wZS5hbnN3ZXJzKTtcclxuXHJcblx0XHR2YXIgcGFyYW1MaXN0ID0gZ2V0UGFyYW1zKG9iai50eXBlKTtcclxuXHRcdHZhciBhbnNMaXN0ID0gZ3JhcGhTdHJUb09iaihzY29wZS5hbnN3ZXJzKTtcclxuXHJcblx0XHQvLyBJbnRlcmxlYXZlIHRoZSBwYXJhbWV0ZXJzIGFuZCBzdXBwbGllZCBhbnN3ZXJzXHJcblx0XHRzY29wZS5tb2RlbCA9IFtdO1xyXG5cdFx0Xy5mb3JFYWNoKHBhcmFtTGlzdCwgZnVuY3Rpb24odmFsKSB7XHJcblx0XHRcdHNjb3BlLm1vZGVsLnB1c2goe1xyXG5cdFx0XHRcdGxhYmVsOiB2YWwsXHJcblx0XHRcdFx0dmFsdWU6IHBhcnNlRmxvYXQoYW5zTGlzdC5wYXJhbXMuc2hpZnQoKSlcclxuXHRcdFx0fSk7XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vIENvbmZpZ3VyYXRpb24gQmxvY2tcclxuXHQvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHRyZXR1cm4ge1xyXG5cdFx0cmVzdHJpY3Q6ICdFJyxcclxuXHJcblx0XHRzY29wZToge1xyXG5cdFx0XHRhbnN3ZXJzOiAnPWdjQW5zd2VycydcclxuXHRcdH0sXHJcblxyXG5cdFx0bGluazogbGluayxcclxuXHRcdHRlbXBsYXRlVXJsOiAncHJvYmxlbVR5cGVzL2dyYXBoQ29uc3QuaHRtbCdcclxuXHR9O1xyXG59KVxyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG4vLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuLy8gUGVyZm9ybXMgTWF0aEpheCBjb252ZXJzaW9uIG9uIHJlcXVlc3QgKHdhcyBhdXRvbWF0aWMsIGJ1dCB0aGF0IHdhcyBUT08gU0xPVylcclxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbmFuZ3VsYXIubW9kdWxlKCdwcm9ibGVtVHlwZScpXHJcblxyXG4uZGlyZWN0aXZlKCdwcm9ibGVtVHlwZScsIGZ1bmN0aW9uKCkge1xyXG5cclxuXHR2YXIgdGVtcGxhdGVQYXRoID0gJ3Byb2JsZW1UeXBlcy8nO1xyXG5cclxuXHR2YXIgbWFwID0ge1xyXG5cdFx0ZnJlZUlucHV0OiB7XHJcblx0XHRcdHE6ICdmcmVlSW5wdXRRLmh0bWwnLFxyXG5cdFx0XHRhOiAnZnJlZUlucHV0QS5odG1sJyxcclxuXHRcdH0sXHJcblxyXG5cdFx0ZXF1YXRpb246IHtcclxuXHRcdFx0cTogJ2VxdWF0aW9uUS5odG1sJyxcclxuXHRcdFx0YTogJ2VxdWF0aW9uQS5odG1sJyxcclxuXHRcdH0sXHJcblxyXG5cdFx0Y2hlY2s6IHtcclxuXHRcdFx0cTogJ211bHRDaG9pY2VRLmh0bWwnLFxyXG5cdFx0XHRhOiAnbXVsdENob2ljZUEuaHRtbCcsXHJcblx0XHR9LFxyXG5cclxuXHRcdHJhZGlvOiB7XHJcblx0XHRcdHE6ICdtdWx0Q2hvaWNlUS5odG1sJyxcclxuXHRcdFx0YTogJ211bHRDaG9pY2VBLmh0bWwnLFxyXG5cdFx0fSxcclxuXHJcblx0XHRwYXBlcjoge1xyXG5cdFx0XHRxOiAnZXNzYXlRLmh0bWwnLFxyXG5cdFx0XHRhOiAnc2ltcGxlQS5odG1sJyxcclxuXHRcdH0sXHJcblxyXG5cdFx0ZXNzYXk6IHtcclxuXHRcdFx0cTogJ2Vzc2F5US5odG1sJyxcclxuXHRcdFx0YTogJ3NpbXBsZUEuaHRtbCcsXHJcblx0XHR9LFxyXG5cclxuXHRcdGdyYXBoUGxvdDoge1xyXG5cdFx0XHRxOiAnc2ltcGxlUS5odG1sJyxcclxuXHRcdFx0YTogJ2dyYXBoUGxvdEEuaHRtbCcsXHJcblx0XHR9LFxyXG5cclxuXHRcdGdyYXBoQ29uc3Q6IHtcclxuXHRcdFx0cTogJ2dyYXBoQ29uc3RRLmh0bWwnLFxyXG5cdFx0XHRhOiAnZ3JhcGhDb25zdEEuaHRtbCcsXHJcblx0XHR9XHJcblx0fTtcclxuXHJcblx0Ly89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly8gRGVjaWRlIHdoaWNoIHRlbXBsYXRlIHRvIHVzZVxyXG5cdC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdGZ1bmN0aW9uIGdldFRlbXBsYXRlKHNjb3BlLCBlbGVtZW50LCBhdHRycylcclxuXHR7XHJcblx0XHR2YXIgbW9kZSA9IGF0dHJzLnB0TW9kZTtcclxuXHRcdHZhciB0eXBlID0gc2NvcGUucHJvYmxlbS5hbnNUeXBlO1xyXG5cclxuXHRcdHJldHVybiB0ZW1wbGF0ZVBhdGggKyBtYXBbdHlwZV1bbW9kZV07XHJcblx0fVxyXG5cclxuXHQvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHRyZXR1cm4ge1xyXG5cdFx0cmVzdHJpY3Q6ICdFJyxcclxuXHRcdHNjb3BlOiB7XHJcblx0XHRcdHByb2JsZW06ICc9bmdNb2RlbCcsXHJcblx0XHRcdGFuc3dlcjogJz1wdEFuc3dlcicsXHJcblx0XHRcdGNvcnJlY3Q6ICc9cHRDb3JyZWN0J1xyXG5cdFx0fSxcclxuXHJcblx0XHRsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcclxuXHRcdFx0c2NvcGUuZ2V0VGVtcGxhdGUgPSBmdW5jdGlvbigpIHtyZXR1cm4gZ2V0VGVtcGxhdGUoc2NvcGUsIGVsZW1lbnQsIGF0dHJzKX07XHJcblx0XHR9LFxyXG5cclxuXHRcdHRlbXBsYXRlOiAnPGRpdiBuZy1pbmNsdWRlPVwiZ2V0VGVtcGxhdGUoKVwiPjwvZGl2PidcclxuXHR9O1xyXG59KTsiLCIndXNlIHN0cmljdCc7XHJcblxyXG4vLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuLy8gUGVyZm9ybXMgTWF0aEpheCBjb252ZXJzaW9uIG9uIHJlcXVlc3QgKHdhcyBhdXRvbWF0aWMsIGJ1dCB0aGF0IHdhcyBUT08gU0xPVylcclxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbmFuZ3VsYXIubW9kdWxlKCdwcm9ibGVtVHlwZScpXHJcblxyXG4uZGlyZWN0aXZlKCdxaW1nJywgZnVuY3Rpb24oKSB7XHJcblxyXG5cdC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vXHJcblx0Ly89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0ZnVuY3Rpb24gbGluayhzY29wZSwgZWxlbWVudCwgYXR0cnMpXHJcblx0e1xyXG4vL1x0XHRlbGVtZW50Lmh0bWwob3V0cHV0KTtcclxuXHJcblx0XHRmb3IgKHZhciBpID0gMCwgbGVuID0gc2NvcGUubW9kZWwubGVuZ3RoOyBpIDwgbGVuOyBpKyspXHJcblx0XHR7XHJcblx0XHRcdHNjb3BlLm1vZGVsW2ldLnggPSBwYXJzZUludChzY29wZS5tb2RlbFtpXS54LCAxMCkgKyAzO1xyXG5cdFx0XHRzY29wZS5tb2RlbFtpXS55ID0gcGFyc2VJbnQoc2NvcGUubW9kZWxbaV0ueSwgMTApICsgMztcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdHJldHVybiB7XHJcblx0XHRyZXN0cmljdDogJ0UnLFxyXG5cclxuXHRcdHNjb3BlOiB7XHJcblx0XHRcdG1vZGVsOiAnPXFpRGF0YScsXHJcblx0XHRcdHNyYzogJ0BuZ1NyYydcclxuXHRcdH0sXHJcblxyXG5cdFx0bGluazogbGluayxcclxuXHRcdHRlbXBsYXRlVXJsOiAncHJvYmxlbVR5cGVzL3FJbWFnZS5odG1sJ1xyXG5cdH07XHJcbn0pXHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4vLyBBIFB1Ymxpc2gtU3Vic2NyaWJlIEV2ZW50IE1hbmFnZXJcclxuLy9cclxuLy8gWWFua2VkIGZyb206IGh0dHBzOi8vZ2lzdC5naXRodWIuY29tL3R1cnRsZW1vbnZoLzEwNjg2OTgwLzAzOGU4YjAyM2YzMmI5ODMyNTM2MzUxM2JmMmE3MjQ1NDcwZWFmODBcclxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbmFuZ3VsYXIubW9kdWxlKCdwdWJzdWItc2VydmljZScsIFtdKVxyXG5cclxuLmZhY3RvcnkoJ1B1YlN1YicsIGZ1bmN0aW9uKCRyb290U2NvcGUpIHtcclxuXHJcblx0dmFyIHB1YlN1YiA9IHt9O1xyXG5cclxuXHQvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBQdWJsaXNoIGFuIGV2ZW50LCBhbG9uZyB3aXRoIG9wdGlvbmFsIGRhdGFcclxuXHQvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHRwdWJTdWIucHVibGlzaCA9IGZ1bmN0aW9uKG1zZywgZGF0YSlcclxuXHR7XHJcblx0XHRpZiAodHlwZW9mIGRhdGEgPT09ICd1bmRlZmluZWQnKVxyXG5cdFx0XHRkYXRhID0ge307XHJcblxyXG5cdFx0JHJvb3RTY29wZS4kZW1pdChtc2csIGRhdGEpO1xyXG5cdH07XHJcblxyXG5cdC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vIFN1YnNjcmliZSB0byBhbiBldmVudFxyXG5cdC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdHB1YlN1Yi5zdWJzY3JpYmUgPSBmdW5jdGlvbihtc2csIGZ1bmMsIHNjb3BlKVxyXG5cdHtcclxuXHRcdHZhciB1bmJpbmQgPSAkcm9vdFNjb3BlLiRvbihtc2csIGZ1bmMpO1xyXG5cclxuXHRcdGlmIChzY29wZSlcclxuXHRcdFx0c2NvcGUuJG9uKCckZGVzdHJveScsIHVuYmluZCk7XHJcblx0fTtcclxuXHJcblx0Ly89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly8gUFVCTElDIEFQSVxyXG5cdC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdHJldHVybiBwdWJTdWI7XHJcbn0pO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG4vLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuLy8gQW5ndWxhciBEaXJlY3RpdmUgRm9yIEtCIE1hdGggR3JhcGhzXHJcbi8vXHJcbi8vIFBBUkFNUzpcclxuLy8gICB3aWR0aCwgaGVpZ2h0OiBpbiBwaXhlbHNcclxuLy8gICBlcXM6IEFycmF5IG9mIGVxdWF0aW9ucyAoc3RyaW5ncykgdG8gZHJhd1xyXG4vLyAgIGF4aXM6IHt4OlttaW4sbWF4LHN0ZXBdLCB5OlttaW4sbWF4LHN0ZXBdLCBza2lwOiBJbnQoZGVmOjEpLCB1c2VQaUxhYmVsczogQm9vbGVhbn1cclxuLy9cclxuLy8gVmVyc2lvbiAxLjAuIEF1Z3VzdCAxOHRoLCAyMDE0XHJcbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5hbmd1bGFyLm1vZHVsZSgna2JHcmFwaCcsIFtdKVxyXG5cclxuLmRpcmVjdGl2ZSgna2JHcmFwaCcsIGZ1bmN0aW9uKCRkb2N1bWVudCkge1xyXG5cclxuXHR2YXIgc2VsZjtcclxuXHJcblx0Ly8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHQvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cdHZhciBkZWZhdWx0cyA9IHtcclxuXHJcblx0XHR3aWR0aDogMjAwLFxyXG5cdFx0aGVpZ2h0OiAyMDAsXHJcblxyXG5cdFx0ZXFzOiBbXSxcclxuXHRcdGF4aXM6IHtcclxuXHRcdFx0eDogWy0xMDAsIDEwMCwgMTBdLFxyXG5cdFx0XHR5OiBbLTEwMCwgMTAwLCAxMF0sXHJcblx0XHRcdHNraXA6IDEsXHJcblx0XHRcdHVzZVBpTGFiZWxzOiBmYWxzZVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0Ly8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHQvLyBPdXRlciB0ZW1wbGF0ZS4gU2luY2Ugd2UgaGF2ZSB2YXJpYWJsZXMsIHdlIGhhdmUgdG8gY3JlYXRlIGl0IG1hbnVhbGx5IHJhdGhlclxyXG5cdC8vIHRoYW4ganVzdCByZXR1cm5pbmcgaXQuXHJcblx0Ly8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHR2YXIgdGVtcGxhdGUgPSAnPGNhbnZhcz48L2NhbnZhcz4nO1xyXG5cclxuXHQvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cdC8vIEdsb2JhbCB2YXJpYWJsZXMuIFRoZXNlIHNob3VsZCBhbG1vc3QgY2VydGFpbmx5IGJlIG1lbWJlcnMgaW5zdGVhZCwgYnV0IGFzIGxvbmdcclxuXHQvLyBhcyB0aGUgcGx1Z2luIGlzbid0IGludGVyYWN0aXZlIGl0IHNob3VsZG4ndCBtYXR0ZXIuXHJcblx0Ly8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcblx0Ly8gZ3JhcGhcclxuXHR2YXIgX3hNYXhfbGdjLCBfeE1pbl9sZ2MsIF94U3RlcF9sZ2MsIHhVcHBlckJvdW5kO1xyXG5cdHZhciBfeU1heF9sZ2MsIF95TWluX2xnYywgX3lTdGVwX2xnYztcclxuXHR2YXIgX2FyeUVxO1xyXG5cdHZhciBjdHg7XHJcblxyXG5cdC8vIGdyYXBoR3JpZFxyXG5cdHZhciBQaSA9ICdcXHUwM2MwJzsgICAvLycmIzk2MCc7XHJcblx0dmFyIF9uZWdTaWduVyA9IDI7IC8vIHBpeGVsc1xyXG5cclxuXHR2YXIgb3B0cztcclxuXHR2YXIgX3hHcmlkLCBfeUdyaWQ7XHJcblxyXG5cdHZhciBzdHlsZSA9IHtcclxuXHRcdHBvaW50Q29sb3I6ICdyZWQnLFxyXG5cdFx0cG9pbnRUZXh0Q29sb3I6ICdkYXJrZ3JlZW4nLFxyXG5cdFx0YmdDb2xvcjogJ3doaXRlJyxcclxuXHRcdGdyaWRDb2xvcjogJ2xpZ2h0Z3JheScsXHJcblx0XHRheGlzQ29sb3I6ICdibGFjaycsXHJcblx0XHRncmlkRm9udDogXCIxMnB4IHNlcmlmXCIsXHJcblx0XHRncmlkRm9udENvbG9yOiAnIzcwNzA3MCcgLy8gbGlnaHQgZ3JheVxyXG5cdH07XHJcblxyXG5cdC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vXHJcblx0Ly89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0ZnVuY3Rpb24gbGluayhzY29wZSwgZWxlbWVudCwgYXR0cnMpXHJcblx0e1xyXG5cdFx0c2VsZiA9IHNjb3BlO1xyXG5cclxuXHRcdHNjb3BlLnNldHRpbmdzID0gXy5leHRlbmQoe30sIGRlZmF1bHRzLCBzY29wZS5vcHRpb25zKTtcclxuXHJcblx0XHQvLyBBZGQgaW4gYW5zd2VyIHBvaW50cyBpZiB0aGV5IHdlcmUgc3VwcGxpZWRcclxuXHRcdGlmIChzY29wZS5hbnN3ZXIpXHJcblx0XHRcdGFkZEFuc3dlcnMoc2NvcGUuYW5zd2VyKTtcclxuXHJcblx0XHQvLyBDcmVhdGUgdGhlIGNhbnZhcyBlbGVtZW50LlxyXG5cdFx0ZWxlbWVudC5odG1sKHRlbXBsYXRlKTtcclxuXHRcdHNjb3BlLmNhbnZhcyA9IGFuZ3VsYXIuZWxlbWVudChlbGVtZW50LmNoaWxkcmVuKClbMF0pO1xyXG5cclxuXHRcdHNjb3BlLmNhbnZhcy5hdHRyKHtcclxuXHRcdFx0J2NsYXNzJzogJ2tiR3JhcGgnLFxyXG5cdFx0XHR3aWR0aDogc2NvcGUuc2V0dGluZ3Mud2lkdGgsXHJcblx0XHRcdGhlaWdodDogc2NvcGUuc2V0dGluZ3MuaGVpZ2h0XHJcblx0XHR9KTtcclxuXHJcblx0XHQvLyBGaWxsIGluIHRoZSBlcXVhdGlvbnNcclxuXHRcdGRyYXcoc2NvcGUuY2FudmFzKTtcclxuXHR9XHJcblxyXG5cdC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vXHJcblx0Ly89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0ZnVuY3Rpb24gYWRkQW5zd2VycyhhbnMpXHJcblx0e1xyXG5cdFx0dmFyIHBhcnNlZCA9IHBhcnNlR3JhcGhQb2ludHMoYW5zKTtcclxuXHJcblx0XHRzZWxmLnNldHRpbmdzLmVxcyA9IHNlbGYuc2V0dGluZ3MuZXFzLmNvbmNhdChwYXJzZWQpO1xyXG5cdH1cclxuXHJcblx0Ly89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vIHBhcnNlR3JhcGhQb2ludHNcclxuXHQvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0ZnVuY3Rpb24gcGFyc2VHcmFwaFBvaW50cyhzdHJQb2ludHMpXHJcblx0e1xyXG5cdFx0dmFyIHBvaW50cyA9IHN0clBvaW50cy5zcGxpdChcIixcIik7XHJcblx0XHR2YXIgcG9pbnRDb3VudCA9IHBvaW50cy5sZW5ndGg7XHJcblxyXG5cdFx0dmFyIGVxID0gW107XHJcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHBvaW50Q291bnQ7IGkrPTIpXHJcblx0XHRcdGVxLnB1c2goXCJwb2ludD1cIiArIHBvaW50c1tpXSArIFwiLFwiICsgcG9pbnRzW2krMV0pO1xyXG5cclxuXHRcdHJldHVybiBlcTtcclxuXHR9XHJcblxyXG4vLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4vLyBEaXJlY3RpdmUgY29uZmlndXJhdGlvblxyXG4vLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdHJldHVybiB7XHJcblx0XHRyZXN0cmljdDogJ0UnLFxyXG5cdFx0c2NvcGU6IHtcclxuXHRcdFx0b3B0aW9uczogJz1vcHRpb25zJyxcclxuXHRcdFx0YW5zd2VyOiAnPWtiQW5zd2VyJ1xyXG5cdFx0fSxcclxuXHJcblx0XHRsaW5rOiBsaW5rXHJcblx0fTtcclxuXHJcblxyXG4vLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuLy8gUHJpdmF0ZSBtZXRob2RzXHJcbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbi8vIEVRVUFUSU9OUyBBTkQgR0VORVJBTCBEUkFXSU5HXHJcbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuXHQvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG5cdCBUaGlzIGlzIHRoZSBtYWluIGZ1bmN0aW9uIG9mIHRoZSBncmFwaCBvYmplY3RcclxuXHQgSW5wdXQ6XHJcblx0XHRfYXJ5RXEgLSBhcnJ5IG9mIGVxdWF0aW9ucyB0byBkcmF3XHJcblx0KioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cclxuXHRmdW5jdGlvbiBkcmF3KGNhbnZhcylcclxuXHR7XHJcblx0XHR2YXIgZXEgPSBzZWxmLnNldHRpbmdzLmVxcztcclxuXHRcdGlmIChlcS5sZW5ndGggPCAxKVxyXG5cdFx0XHRyZXR1cm47XHJcblxyXG5cdFx0X2FyeUVxID0gZXEuc2xpY2UoMCk7XHRcdC8vIENsb25lXHJcblxyXG5cdFx0c2V0QXhpcyhjYW52YXMpO1xyXG5cdFx0Z3JpZERyYXcoKTtcclxuXHRcdGRyYXdFcXVhdGlvbnMoKTtcclxuXHR9XHJcblxyXG5cdC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblx0Ly8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHRmdW5jdGlvbiBzZXRBeGlzKGNhbnZhcylcclxuXHR7XHJcblx0XHR2YXIgcGFybXMgPSBzZWxmLnNldHRpbmdzLmF4aXM7XHJcblxyXG5cdFx0Ly8gU2V0IHNvbWUgZGVmYXVsdCB2YWx1ZXMgaWYgdGhleSBhcmUgbWlzc2luZ1xyXG5cdFx0aWYgKHR5cGVvZiBwYXJtcy54ID09PSAndW5kZWZpbmVkJylcclxuXHRcdFx0cGFybXMueCA9IFstMTAsIDEwLCAxXTtcclxuXHRcdGlmICh0eXBlb2YgcGFybXMueSA9PT0gJ3VuZGVmaW5lZCcpXHJcblx0XHRcdHBhcm1zLnkgPSBbLTEwLCAxMCwgMV07XHJcblx0XHRpZiAodHlwZW9mIHBhcm1zLnNraXAgPT09ICd1bmRlZmluZWQnKVxyXG5cdFx0XHRwYXJtcy5za2lwID0gMTtcclxuXHJcblx0XHRpZiAodHlwZW9mIHBhcm1zLnggPT09ICdzdHJpbmcnKVxyXG5cdFx0XHRwYXJtcy54ID0gcGFybXMueC5zcGxpdCgnLCcpO1xyXG5cdFx0aWYgKHR5cGVvZiBwYXJtcy55ID09PSAnc3RyaW5nJylcclxuXHRcdFx0cGFybXMueSA9IHBhcm1zLnkuc3BsaXQoJywnKTtcclxuXHJcblx0XHQvLyBHZXQgdGhlIDJEIGNvbnRleHRcclxuXHRcdGN0eCA9IGNhbnZhc1swXS5nZXRDb250ZXh0KFwiMmRcIik7XHJcblxyXG5cdFx0Z3JpZENyZWF0ZSh7XHJcblx0XHRcdHhSYW5nZTogcGFybXMueCxcclxuXHRcdFx0eVJhbmdlOiBwYXJtcy55LFxyXG5cdFx0XHRsYWJlbFNraXA6IHBhcm1zLnNraXAsXHJcblx0XHRcdHVzZVBpTGFiZWxzOiAhIXBhcm1zLnVzZVBpTGFiZWxzXHJcblx0XHR9KTtcclxuXHJcblx0XHQvLyBpbmRleCB2YWx1ZXMgZm9yIHhSYW5nZSwgeVJhbmdlIHRvIHJlcGxhY2UgdGhlIG1hZ2ljIG51bWJlcnM6XHJcblx0XHR2YXIgbWluSWR4ID0gMCwgbWF4SWR4ID0gMSwgU3RlcFNpemUgPSAyO1xyXG5cclxuXHRcdF94TWF4X2xnYyA9IHBhcm1zLnhbbWF4SWR4XTtcclxuXHRcdF94TWluX2xnYyA9IHBhcm1zLnhbbWluSWR4XTtcclxuXHRcdF94U3RlcF9sZ2MgPSBwYXJtcy54W1N0ZXBTaXplXTtcclxuXHJcblx0XHR4VXBwZXJCb3VuZCA9IF94TWF4X2xnYyAqIDEuMjsgLy8gbWFrZSBzdXJlIHRoZSBncmFwaCBkcmF3cyB0byB0aGUgYm9yZGVyXHJcblxyXG5cdFx0X3lNYXhfbGdjID0gcGFybXMueVttYXhJZHhdO1xyXG5cdFx0X3lNaW5fbGdjID0gcGFybXMueVttaW5JZHhdO1xyXG5cdFx0X3lTdGVwX2xnYyA9IHBhcm1zLnlbU3RlcFNpemVdO1xyXG5cdH1cclxuXHJcblx0Ly89PT09PT09PT09PT09PT09PT09PT0gZHJhdyBlcXVhdGlvbnMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdGZ1bmN0aW9uIGFwcGVuZENvbG9yRm4oYXJnLCBjb2xvciwgZHJhd0ZuKVxyXG5cdHtcclxuXHRcdGRyYXdGbi5hcHBseSh0aGlzLCBhcmcuY29uY2F0KGNvbG9yKSk7XHJcblx0fVxyXG5cclxuXHQvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHRmdW5jdGlvbiBpbml0Q29uaWNGbihhcmcsIGNvbG9yKVxyXG5cdHtcclxuXHRcdGFyZy51bnNoaWZ0KGNvbG9yKTsgLy8gQWRkIGVsZW1lbnRzIGF0IGJlZ2lubmluZyBvZiBhcmdzIGFycmF5XHJcblx0XHRyZXR1cm4gaW5pdENvbmljcy5hcHBseSh0aGlzLCBhcmcpO1xyXG5cdH1cclxuXHJcblx0Ly89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0ZnVuY3Rpb24gZHJhd0VxdWF0aW9ucyhuZXdFcSlcclxuXHR7XHJcblx0XHR2YXIgZHJhd0FyeTtcclxuXHJcblx0XHRpZiAobmV3RXEpICBkcmF3QXJ5ID0gbmV3RXE7XHJcblx0XHRlbHNlXHJcblx0XHR7XHJcblx0XHRcdGlmICghX2FyeUVxIHx8IF9hcnlFcS5sZW5ndGggPT0gMCkgIHJldHVybjtcclxuXHRcdFx0ZHJhd0FyeSA9IF9hcnlFcTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBzZXQgdHJhbnNmb3JtIG1hdHJpeCB0byBpZGVudGl0eTpcclxuXHRcdGN0eC5zZXRUcmFuc2Zvcm0oMSwgMCwgMCwgMSwgMCwgMCk7XHJcblxyXG5cdFx0dmFyIHN0ckVxLCBjb2xvckVxLCBlcVR5cGUsIGFyZ3MsIG9wdGlvbjtcclxuXHJcblx0XHR2YXIgZXEgPSB7XHJcblx0XHRcdGxpbmU6IHsgblBhcmFtOjIsICAgZm46IGZ1bmN0aW9uKGFyZywgY29sb3IpeyBhcHBlbmRDb2xvckZuKGFyZywgY29sb3IsIGRyYXdMaW5lRXFuKSB9IH0sLy8gJ2xpbmUnLFxyXG5cclxuXHRcdFx0Y2lyY2xlOiB7IG5QYXJhbTozLCAgIGZuOiBmdW5jdGlvbihhcmcsIGNvbG9yKXsgYXBwZW5kQ29sb3JGbihhcmcsIGNvbG9yLCBkcmF3Q2lyY2xlKSB9IH0sIC8vICdjaXJjbGUnLFxyXG5cclxuXHRcdFx0cGFyYWJvbGF4MjogeyBuUGFyYW06MywgICBmbjogZnVuY3Rpb24gKGFyZywgY29sb3IpICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gJ3BhcmFib2xheDInLFxyXG5cdFx0XHRcdFx0eyAgIHZhciBjbmMgPSBpbml0Q29uaWNGbihhcmcsIGNvbG9yKTtcclxuXHJcblx0XHRcdFx0XHRcdC8vIHBhcmFib2xhWDIgaCxrLHAgLS0gdXNpbmcgZm9ybXVsYSA0cCh5LWspPSh4LWgpXjJcclxuXHRcdFx0XHRcdFx0Ly8gYWZ0ZXIgdHJhbnNsYXRlIHRvIChoLCBrKTogeSA9ICstIHheMiAvIDRwXHJcblx0XHRcdFx0XHRcdGNuYy54U2xvd1RocmluayA9IDA7XHJcblx0XHRcdFx0XHRcdGNuYy5iRHJhd1Bvc2l0aXZlWSA9IGZhbHNlO1xyXG5cdFx0XHRcdFx0XHRjbmMuRXEgPSBmdW5jdGlvbih4LCBhKSB7IHJldHVybiB4KnggLyAoNCphKTsgfVxyXG5cdFx0XHRcdFx0XHR2YXIgcCA9IGFyZ1szXSwgaCA9IGFyZ1sxXTsgLy8gY29sb3IsIGgsIGssIGEsIGJcclxuXHRcdFx0XHRcdFx0dmFyIHhNYXhZX2xnYyA9IE1hdGguc3FydCg0ICogcCAqIF95TWF4X2xnYyk7IC8vIHNpbmNlIDRweSA9IHheMlxyXG5cclxuXHRcdFx0XHRcdFx0aWYgKHhNYXhZX2xnYyA8IF94TWF4X2xnYyAqIDAuNzUpXHJcblx0XHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0XHRjbmMueFNsb3dUaHJpbmsgPSB4TWF4WV9sZ2MgLyAxNjtcclxuXHRcdFx0XHRcdFx0XHRjbmMueGZhc3RUaHJpbmsxID0geE1heFlfbGdjICogMyAvIDEwO1xyXG5cdFx0XHRcdFx0XHRcdGNuYy54ZmFzdFRocmluazIgPSB4TWF4WV9sZ2MgKiAxIC8gMjtcclxuXHRcdFx0XHRcdFx0XHRjbmMudGhyaW5rU2xvd0ZhY3RvciA9IDQ5LzUwOyAvL1xyXG5cdFx0XHRcdFx0XHRcdGNuYy50aHJpbmtGYXN0RmFjdG9yMSA9IDQ5LzUwO1xyXG5cdFx0XHRcdFx0XHRcdGNuYy50aHJpbmtGYXN0RmFjdG9yMiA9IDQ5LzUwOyAvLzEvMjk7IC8vMTcvNDk7XHJcblx0XHRcdFx0XHRcdFx0Y25jLnhTdGFydCA9IDA7XHJcblx0XHRcdFx0XHRcdFx0Y25jLmRYID0gLWNuYy5kWDsgLy8gbWFrZSBpdCBwb3NpdGl2ZVxyXG5cdFx0XHRcdFx0XHRcdGNuYy54Q29tcGFyZSA9IGZ1bmN0aW9uKHgpIHsgcmV0dXJuIHggPD0geFVwcGVyQm91bmQ7IH1cclxuXHRcdFx0XHRcdFx0XHRjbmMueENoYW5nZUluY1JhdGUgPSBmdW5jdGlvbih4LCB0aHJlc2hvbGQpIHsgcmV0dXJuIHggPiB0aHJlc2hvbGQ7IH1cclxuXHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0YXJnLnVuc2hpZnQoY25jKTtcdC8vIHN0dWZmIGV4dHJhIHBhcmFtIGF0IGJlZ2lubmluZyBvZiBhcmdcclxuXHRcdFx0XHRcdFx0ZHJhd0Nvbmljcy5hcHBseSh0aGlzLCBhcmcpOyB9XHJcblx0XHRcdFx0XHR9LFxyXG5cclxuXHRcdFx0cGFyYWJvbGF5MjogeyBuUGFyYW06MywgICBmbjogZnVuY3Rpb24gKGFyZywgY29sb3IpICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gJ3BhcmFib2xheTInLFxyXG5cdFx0XHRcdFx0eyAgIHZhciBjbmMgPSBpbml0Q29uaWNGbihhcmcsIGNvbG9yKTtcclxuXHJcblx0XHRcdFx0XHRcdC8vIHBhcmFib2xhWTIgaCxrLHAgLS0gdXNpbmcgZm9ybXVsYSA0cCh4LWgpPSh5LWspXjJcclxuXHRcdFx0XHRcdFx0Ly8gYWZ0ZXIgdHJhbnNsYXRlIHRvIChoLCBrKTogeSA9ICstIHNxcnQoNHB4KVxyXG5cdFx0XHRcdFx0XHRjbmMueFNsb3dUaHJpbmsgPSBjbmMueGZhc3RUaHJpbmsyIC8gNDtcclxuXHRcdFx0XHRcdFx0Y25jLmJEcmF3TmVnYXRpdmVYID0gZmFsc2U7XHJcblxyXG5cdFx0XHRcdFx0XHR2YXIgYSA9IGFyZ1szXTsgLy8gY29sb3IsIGgsIGssIGEsIGJcclxuXHRcdFx0XHRcdFx0dmFyIFNpZ24gPSBtYXRoU2lnbihhKTsgLy8gc2lnbiBvZiBhXHJcblx0XHRcdFx0XHRcdGNuYy54U3RhcnQgKj0gU2lnbjtcclxuXHRcdFx0XHRcdFx0Y25jLmRYICo9IFNpZ247IC8vIGtlZXAgZ29pbmcgZm9yZXZlciB3aXRoIHRoaXMgY29uZGl0aW9uPz9cclxuXHRcdFx0XHRcdFx0aWYgKFNpZ24gPCAwKVxyXG5cdFx0XHRcdFx0XHRcdGNuYy54Q29tcGFyZSA9IGZ1bmN0aW9uKHgpIHsgcmV0dXJuIHggPD0gY25jLnhWZXJ0ZXg7IH07XHJcblxyXG5cdFx0XHRcdFx0XHRjbmMuRXEgPSBmdW5jdGlvbih4LCBhKSB7IHJldHVybiAyICogTWF0aC5zcXJ0KCBhICogeCApOyB9XHJcblx0XHRcdFx0XHRcdGFyZy51bnNoaWZ0KGNuYyk7XHQvLyBzdHVmZiBleHRyYSBwYXJhbSBhdCBiZWdpbm5pbmcgb2YgYXJnXHJcblx0XHRcdFx0XHRcdGRyYXdDb25pY3MuYXBwbHkodGhpcywgYXJnKTsgfVxyXG5cdFx0XHRcdFx0fSxcclxuXHJcblx0XHRcdGVsbGlwc2U6IHsgblBhcmFtOjQsICAgZm46IGZ1bmN0aW9uIChhcmcsIGNvbG9yKSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICdlbGxpcHNlJyxcclxuXHRcdFx0XHRcdHsgICB2YXIgY25jID0gaW5pdENvbmljRm4oYXJnLCBjb2xvcik7XHJcblx0XHRcdFx0XHRcdHZhciBhID0gYXJnWzNdOyAvLyBjb2xvciwgaCwgaywgYSwgYlxyXG5cdFx0XHRcdFx0XHRjbmMueFZlcnRleCA9IGE7XHJcblx0XHRcdFx0XHRcdGNuYy54VmVydGV4UHggPSBncmlkWExnY0xlbmd0aFRvUHgoYSk7XHJcblx0XHRcdFx0XHRcdGNuYy5kb3RTaXplID0gMTtcclxuXHRcdFx0XHRcdFx0Y25jLnhTbG93VGhyaW5rID0gYSAvIDI7XHJcblx0XHRcdFx0XHRcdGNuYy54ZmFzdFRocmluazEgPSBhICogMTcgLyAyMDtcclxuXHRcdFx0XHRcdFx0Y25jLnhmYXN0VGhyaW5rMiA9IGEgKiA3OSAvIDgwO1xyXG5cdFx0XHRcdFx0XHRjbmMudGhyaW5rU2xvd0ZhY3RvciA9IDE5LzIwOyAvL1xyXG5cdFx0XHRcdFx0XHRjbmMudGhyaW5rRmFzdEZhY3RvcjEgPSAxOC8xOTtcclxuXHRcdFx0XHRcdFx0Y25jLnRocmlua0Zhc3RGYWN0b3IyID0gMS80OTtcclxuXHRcdFx0XHRcdFx0Y25jLnhTdGFydCA9IDA7XHJcblx0XHRcdFx0XHRcdGNuYy5kWCA9IC1jbmMuZFg7IC8vIG1ha2UgaXQgcG9zaXRpdmVcclxuXHRcdFx0XHRcdFx0Y25jLnhDb21wYXJlID0gZnVuY3Rpb24oeCkgeyByZXR1cm4geCA8PSBNYXRoLm1pbihhLCB4VXBwZXJCb3VuZCk7IH07XHJcblx0XHRcdFx0XHRcdC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcblx0XHRcdFx0XHRcdFx0RHJhdyBhbiBlbGxpcHNlIGluIHRoZSBlcXVhdGlvbiBvZiAoeC1oKV4yL2FeMiArICh5LWspXjIvYl4yID0gMTtcclxuXHRcdFx0XHRcdFx0XHRpZiBoLCBrIGFyZSB6ZXJvcyAod2UgdHJhbnNsYXRlIHRoZSBzeXN0ZW0gb3JpZ2luIHRvIGgsayksXHJcblx0XHRcdFx0XHRcdFx0dGhlIHJlc3VsdGluZyBlcXVhdGlvbiB3aWxsIGJlICAgICB4XjIvYV4yICsgeV4yL2JeMiA9IDE7XHJcblxyXG5cdFx0XHRcdFx0XHRcdHRoZXJlZm9yZTogICB5ID0gKy0gc3FydCgxIC0geF4yL2FeMikgKiBiXHJcblx0XHRcdFx0XHRcdCAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xyXG5cdFx0XHRcdFx0XHRjbmMuRXEgPSBmdW5jdGlvbih4LCBhLCBiKSB7IHJldHVybiBNYXRoLnNxcnQoIDEgLSB4KnggLyAoYSphKSApICogYjsgfVxyXG5cdFx0XHRcdFx0XHRhcmcudW5zaGlmdChjbmMpO1x0Ly8gc3R1ZmYgZXh0cmEgcGFyYW0gYXQgYmVnaW5uaW5nIG9mIGFyZ1xyXG5cdFx0XHRcdFx0XHRkcmF3Q29uaWNzLmFwcGx5KHRoaXMsIGFyZyk7IH1cclxuXHRcdFx0XHRcdH0sXHJcblxyXG5cdFx0XHRoeXBlcmJvbGF4cG9zOiB7IG5QYXJhbTo0LCAgIGZuOiBmdW5jdGlvbiAoYXJnLCBjb2xvcikgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAnaHlwZXJib2xheHBvcycsXHJcblx0XHRcdFx0XHR7ICAgdmFyIGNuYyA9IGluaXRDb25pY0ZuKGFyZywgY29sb3IpO1xyXG5cdFx0XHRcdFx0XHR2YXIgYSA9IGFyZ1szXSwgYiA9IGFyZ1s0XTsgLy8gY29sb3IsIGgsIGssIGEsIGJcclxuXHRcdFx0XHRcdFx0Y25jLnhWZXJ0ZXggPSBhO1xyXG5cdFx0XHRcdFx0XHRjbmMueFZlcnRleFB4ID0gZ3JpZFhMZ2NMZW5ndGhUb1B4KGEpO1xyXG5cclxuXHRcdFx0XHRcdFx0Y25jLnhTbG93VGhyaW5rPSAgYSAqIDEuNDI7XHJcblxyXG5cdFx0XHRcdFx0XHRjbmMudGhyaW5rRmFzdEZhY3RvcjE9IDE5LzIwO1xyXG5cdFx0XHRcdFx0XHRjbmMudGhyaW5rRmFzdEZhY3RvcjI9IDEzLzE5O1xyXG5cclxuXHRcdFx0XHRcdFx0Ly8gKHgtaCleMi9hXjIgLSAoeS1rKV4yL2JeMiA9IDFcclxuXHRcdFx0XHRcdFx0Y25jLkVxID0gZnVuY3Rpb24oeCwgYSwgYikgeyByZXR1cm4gYiAqIE1hdGguc3FydCggeCp4IC8gKGEqYSkgLSAxKTsgfVxyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY25jLmRvdFNpemUgPSAyO1xyXG5cclxuXHRcdFx0XHRcdFx0aWYgKE1hdGguYWJzKGdyaWRYTGdjTGVuZ3RoVG9QeChhKSkgPCBNYXRoLmFicyhncmlkWExnY0xlbmd0aFRvUHgoYikpKVxyXG5cdFx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdFx0Y25jLnhTbG93VGhyaW5rID0gYSAqIDI7XHJcblx0XHRcdFx0XHRcdFx0Y25jLnhmYXN0VGhyaW5rMSA9IGEgKiAxLjU7XHJcblx0XHRcdFx0XHRcdFx0Y25jLnhmYXN0VGhyaW5rMiA9IGEgKiAwLjk7XHJcblx0XHRcdFx0XHRcdFx0Y25jLnRocmlua1Nsb3dGYWN0b3IgPSAzOS80MDsgLy9cclxuXHRcdFx0XHRcdFx0XHRjbmMudGhyaW5rRmFzdEZhY3RvcjEgPSAyOS8zMDtcclxuXHRcdFx0XHRcdFx0XHRjbmMudGhyaW5rRmFzdEZhY3RvcjIgPSAxLzIwOyAvLzEvMjk7IC8vMTcvNDk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdGFyZy51bnNoaWZ0KGNuYyk7XHQvLyBzdHVmZiBleHRyYSBwYXJhbSBhdCBiZWdpbm5pbmcgb2YgYXJnXHJcblx0XHRcdFx0XHRcdGRyYXdDb25pY3MuYXBwbHkodGhpcywgYXJnKTsgfVxyXG5cdFx0XHRcdFx0fSxcclxuXHJcblx0XHRcdGh5cGVyYm9sYXlwb3M6IHsgblBhcmFtOjQsICAgZm46IGZ1bmN0aW9uIChhcmcsIGNvbG9yKSAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAnaHlwZXJib2xheXBvcycsXHJcblx0XHRcdFx0XHR7ICAgdmFyIGNuYyA9IGluaXRDb25pY0ZuKGFyZywgY29sb3IpO1xyXG5cdFx0XHRcdFx0XHQvLyAoeS1rKV4yL2JeMiAtICh4LWgpXjIvYV4yID0gMVxyXG5cdFx0XHRcdFx0XHRjbmMueFNsb3dUaHJpbmsgPSAwOyAvLyBubyBzaHJpbmdrIG9mIGRYXHJcblx0XHRcdFx0XHRcdGNuYy5FcSA9IGZ1bmN0aW9uKHgsIGEsIGIpIHsgcmV0dXJuIGIgKiBNYXRoLnNxcnQoIHgqeCAvIChhKmEpICsgMSk7IH1cclxuXHRcdFx0XHRcdFx0YXJnLnVuc2hpZnQoY25jKTtcdC8vIHN0dWZmIGV4dHJhIHBhcmFtIGF0IGJlZ2lubmluZyBvZiBhcmdcclxuXHRcdFx0XHRcdFx0ZHJhd0Nvbmljcy5hcHBseSh0aGlzLCBhcmcpOyB9XHJcblx0XHRcdFx0XHR9LFxyXG5cclxuXHRcdFx0cG9pbnQ6IHsgblBhcmFtOjIsICAgZm46IGZ1bmN0aW9uKGFyZywgY29sb3IsIG9wdGlvbilcclxuXHRcdFx0XHRcdFx0eyAgIGFyZy51bnNoaWZ0KGNvbG9yLCBvcHRpb24pOyAvLyBzdHVmZiBleHRyYSBwYXJhbSBhdCBiZWdpbm5pbmcsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gc2luY2UgbGFiZWwgaW4gdGhlIGFyZyBpcyBhbiBvcHRpb25hbCBwYXJhbVxyXG5cdFx0XHRcdFx0XHRcdGRyYXdEb3RFcS5hcHBseSh0aGlzLCBhcmcpOyB9IH1cclxuXHRcdH07XHJcblxyXG5cdFx0Zm9yICh2YXIgaT0wOyBpIDwgZHJhd0FyeS5sZW5ndGg7IGkrKylcclxuXHRcdHtcclxuXHRcdFx0c3RyRXEgPSBkcmF3QXJ5W2ldO1xyXG5cdFx0XHRjb2xvckVxID0gZHJhd0FyeVtpXS5jb2xvciB8fCAnYmxhY2snO1xyXG5cdFx0XHRvcHRpb24gPSBkcmF3QXJ5W2ldLm9wdGlvbjtcclxuXHJcblx0XHRcdC8vIHBhcnNlIHRoZSBwYXJhbWV0ZXJzOlxyXG5cdFx0XHRzdHJFcSA9IHN0ckVxLnJlcGxhY2UoL1xccyovZywgXCJcIikudG9Mb3dlckNhc2UoKTtcclxuXHRcdFx0ZXFUeXBlID0gc3RyRXEuc2xpY2UoMCwgc3RyRXEuaW5kZXhPZignPScpKTtcclxuXHRcdFx0YXJncyA9IHN0ckVxLnNsaWNlKHN0ckVxLmluZGV4T2YoJz0nKSsxKS5zcGxpdCgnLCcpOyAvLy5jb25jYXQoY29sb3JFcSk7XHJcblxyXG5cdFx0XHQvLyBidWlsZCBwYXJhbWV0ZXJzIGFuZCB0aGVuIGRyYXcgdGhlIGVxdWF0aW9uOlxyXG5cdFx0XHRpZiAoIHR5cGVvZiBlcVtlcVR5cGVdICE9PSAndW5kZWZpbmVkJyApXHJcblx0XHRcdHtcclxuXHRcdFx0XHQvLyBwYXJzZSB0aGUgcGFyYW1ldGVycyBmb3IgY3VycmVudCBlcXVhdGlvbjpcclxuXHRcdFx0XHRmb3IgKHZhciBqPTA7IGogPCBlcVtlcVR5cGVdLm5QYXJhbTsgaisrKSAvLyBzdHJpbmcgdG8gbnVtYmVyOlxyXG5cdFx0XHRcdFx0aWYgKCBpc05hTiggYXJnc1tqXSA9IHBhcnNlRmxvYXQoYXJnc1tqXSkgKSApXHJcblx0XHRcdFx0XHRcdGFyZ3Nbal0gPSAwO1xyXG5cdFx0XHRcdFx0XHQvL2NvbnNvbGUubG9nKGVxVHlwZSArIFwiIGVxdWF0aW9uIHBhcmFtZXRlciBoYXMgdG8gYmUgYSBudW1iZXIhXCIpO1xyXG5cclxuXHRcdFx0XHRpZiAoYXJncy5sZW5ndGggPj0gZXFbZXFUeXBlXS5uUGFyYW0pXHJcblx0XHRcdFx0ICAgZXFbZXFUeXBlXS5mbihhcmdzLCBjb2xvckVxLCBvcHRpb24pO1xyXG5cdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdGNvbnRpbnVlO1xyXG5cdFx0XHRcdFx0Ly9jb25zb2xlLmxvZyhlcVR5cGUgKyBcIiBlcXVhdGlvbiBkb2VzIG5vdCBoYXZlIHJpZ2h0IG51bWJlciBvZiBwYXJhbWV0ZXJzIVwiKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0Y29uc29sZS5sb2coJ0F0dGVtcHRpbmcgdG8gZ3JhcGggdW5rbm93biB0eXBlOiAnICsgZXFUeXBlKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuXHQgIERyYXcgYSBzdHJhaWdodCBsaW5lLlxyXG5cdCAgSW5wdXQ6XHJcblx0XHR4MSwgeTEgIC0gc3RhcnQgcG9pbnQgaW4gcGl4ZWwgdW5pdFxyXG5cdFx0eDIsIHkyICAtIGVuZCBwb2ludCBpbiBwaXhlbCB1bml0XHJcblx0XHR3aWR0aCAgIC0gbGluZSB3aWR0aCBpbiBwaXhlbCB1bml0XHJcblx0XHRjb2xvciAgIC0gbGluZSBjb2xvclxyXG5cdCoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cclxuXHRmdW5jdGlvbiBkcmF3TGluZSh4MSwgeTEsIHgyLCB5Miwgd2lkdGgsIGNvbG9yKVxyXG5cdHtcclxuXHRcdHgxID0gTWF0aC5yb3VuZCh4MSk7XHJcblx0XHR5MSA9IE1hdGgucm91bmQoeTEpO1xyXG5cdFx0eDIgPSBNYXRoLnJvdW5kKHgyKTtcclxuXHRcdHkyID0gTWF0aC5yb3VuZCh5Mik7XHJcblxyXG5cdFx0Y3R4LnN0cm9rZVN0eWxlID0gY29sb3I7XHJcblx0XHRjdHgubGluZVdpZHRoID0gd2lkdGg7XHJcblx0XHRjdHguYmVnaW5QYXRoKCk7XHJcblxyXG5cdFx0Y3R4Lm1vdmVUbyh4MSwgeTEpO1xyXG5cdFx0Y3R4LmxpbmVUbyh4MiwgeTIpO1xyXG5cclxuXHRcdGN0eC5zdHJva2UoKTtcclxuXHRcdGN0eC5jbG9zZVBhdGgoKTtcclxuXHR9XHJcblxyXG5cdC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuXHQqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXHJcblx0ZnVuY3Rpb24gZHJhd0RvdEVxKGNvbG9yLCBvcHRpb24sIHgsIHksIGxhYmVsKVxyXG5cdHtcclxuXHRcdC8vcHRfcHggPSBncmlkTGdjUHRUb0NhbnZhc1B0KHgsIHkpO1xyXG5cdFx0Z3JpZERyYXdNb3VzZUxnY1B0KHt4OngsIHk6eX0sICcnLCBvcHRpb24sIGxhYmVsKTtcclxuXHR9XHJcblxyXG5cdC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuXHQgIFRha2UgdGhlIGlucHV0IGRlZ3JlZSBhbmQgcmV0dXJuIHRoZSB0cmFuc2xhdGVkIHJhZGlhbnMuXHJcblx0KioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xyXG5cdGZ1bmN0aW9uIGRlZ1RvUmFkaWFuKGRlZylcclxuXHR7XHJcblx0XHRyZXR1cm4gZGVnICogTWF0aC5QSSAvIDE4MDtcclxuXHR9XHJcblxyXG5cdC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuXHQgIHgsIHkgICAgICAgICAgICAgLSBwb3NpdGlvbiBvZiB0aGUgbG9jYWwgb2JqZWN0IGNvb3JkaW5hdGVzIGluIHBpeGVsIHVuaXQgdG9cclxuXHRcdFx0XHRcdFx0IHRyYW5zbGF0ZSBzeXN0ZW0gb3JpZ2luIHRvIGJlZm9yZSByb3RhdGlvbi5cclxuXHQgIGRpcmVjdGlvbkRlZ3JlZSAgLSByb3RhdGlvbiBpbiBkZWdyZWVzXHJcblx0KioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xyXG5cdGZ1bmN0aW9uIHRyYW5zZm9ybSh4LCB5LCByb3RhdGVEZWcpXHJcblx0e1xyXG5cdFx0dmFyIGRpcmVjdGlvbkluUmFkID0gZGVnVG9SYWRpYW4ocm90YXRlRGVnKTtcclxuXHJcblx0XHQvLyBzZXQgdHJhbnNmb3JtIG1hdHJpeCB0byBpZGVudGl0eTpcclxuXHRcdGN0eC5zZXRUcmFuc2Zvcm0oMSwgMCwgMCwgMSwgMCwgMCk7XHJcblxyXG5cdFx0Ly8gdHJhbnNsYXRlIHJvdGF0aW9uIGNlbnRlciB0byB0aGUgdGlwIHBvc2l0aW9uOlxyXG5cdFx0Y3R4LnRyYW5zbGF0ZSh4LCB5KTtcclxuXHRcdGN0eC5yb3RhdGUoZGlyZWN0aW9uSW5SYWQpO1xyXG5cdH1cclxuXHJcblx0LyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG5cdCAgeCwgeSAgICAgICAgICAgICAtIHBvc2l0aW9uIG9mIHRoZSBhcnJvdyB0aXAgaW4gcGl4ZWwgdW5pdFxyXG5cdCAgZGlyZWN0aW9uRGVncmVlICAtIGRpcmVjdGlvbiBpbiBkZWdyZWVzIHdoZXJlIHRoZSBhcnJvdyBwb2ludHMgdG9cclxuXHRcdFx0XHRcdFx0IHplcm8gZGVncmVlIC0gYXJyb3cgcG9pbnRzIHRvIHRoZSByaWdodFxyXG5cdCAgbGVuZ3RoICAgICAgICAgICAtIGxlbmd0aCBvZiB0aGUgYXJyb3cgYWxvbmcgdGhlIG9wcG9zaXRlIGRpcmVjdGlvbiBvZiBhcnJvdyB0aXBcclxuXHQqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXHJcblx0ZnVuY3Rpb24gZHJhd0Fycm93KHgsIHksIGRpcmVjdGlvbkRlZ3JlZSwgbGVuZ3RoLCBjb2xvcilcclxuXHR7XHJcblx0XHR2YXIgYXJyb3dTbGVudERlZ3JlZSA9IDU7XHJcblx0XHR2YXIgd2lkdGggPSBsZW5ndGggKiBNYXRoLnRhbihkZWdUb1JhZGlhbihhcnJvd1NsZW50RGVncmVlKSk7XHJcblxyXG5cdFx0dHJhbnNmb3JtKHgsIHksIGRpcmVjdGlvbkRlZ3JlZSk7XHJcblxyXG5cdFx0Ly8gcHJldGVuZCB0aGUgcm90YXRpb24gZGVncmVlIGlzIHplcm8gc28gd2UgZHJhdyBhbiBhcnJvdyBwb2ludHMgdG8gdGhlIHJpZ2h0LFxyXG5cdFx0Ly8gdGhlIHRyYXNmb3JtIGNhbGwgYWJvdmUgd2lsbCB0YWtlIGNhcmUgdGhlIHJvdGF0aW9uIGVmZmVjdC5cclxuXHRcdC8vIHNpbmNlIHRoZSBzY3JlZW4gb3JpZ2luIGhhcyBiZWVuIHRyYW5zbGF0ZWQgdG8gdGhlIHRpcCBvZiB0aGUgYXJyYXcsXHJcblx0XHQvLyB3ZSBuZWVkIHRvIHVzZSB0aGUgbG9jYWwgY29vcmRpbmF0ZSBpbnN0ZWFkIG9mIG9yaWdpbmFsIHgseTpcclxuXHRcdC8vXHJcblx0XHRkcmF3TGluZSgwLCAwLCAtbGVuZ3RoLCArd2lkdGgsIDIsIGNvbG9yKTtcclxuXHRcdGRyYXdMaW5lKDAsIDAsIC1sZW5ndGgsIC13aWR0aCwgMiwgY29sb3IpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gZHJhd0RvdCh4LCB5LCBzaXplKVxyXG5cdHtcclxuXHRcdGN0eC5maWxsUmVjdCh4LXNpemUvMiwgeS1zaXplLzIsIHNpemUsIHNpemUpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gZHJhd0xpbmVFcW4oc2xvcGVfbGdjLCBpbnRlcnNlY3RfbGdjLCBjb2xvcilcclxuXHR7XHJcblx0XHR2YXIgcHRTY24xLCBwdFNjbjIsXHJcblx0XHRcdHgxID0gX3hNaW5fbGdjLFxyXG5cdFx0XHR4MiA9IHhVcHBlckJvdW5kO1xyXG5cclxuXHRcdHZhciB5MSA9ICh4MSAqIHNsb3BlX2xnYyArIGludGVyc2VjdF9sZ2MpLFxyXG5cdFx0XHR5MiA9ICh4MiAqIHNsb3BlX2xnYyArIGludGVyc2VjdF9sZ2MpO1xyXG5cclxuXHRcdHB0U2NuMSA9IGdyaWRMZ2NQdFRvQ2FudmFzUHQoeDEsIHkxKTtcclxuXHRcdHB0U2NuMiA9IGdyaWRMZ2NQdFRvQ2FudmFzUHQoeDIsIHkyKTtcclxuXHJcblx0XHQvLyBzZXQgdHJhbnNmb3JtIG1hdHJpeCB0byBpZGVudGl0eTpcclxuXHRcdGN0eC5zZXRUcmFuc2Zvcm0oMSwgMCwgMCwgMSwgMCwgMCk7XHJcblxyXG5cdFx0ZHJhd0xpbmUocHRTY24xLngsIHB0U2NuMS55LCBwdFNjbjIueCwgcHRTY24yLnksIDEsIGNvbG9yKTsgLy90aGF0LmdyYXBoQ29sb3IpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gZHJhd0NpcmNsZSh4X2xnYywgeV9sZ2MsIHJfbGdjLCBjb2xvcilcclxuXHR7XHJcblx0XHQvLyBTYWZldHkgY2hlY2tzIC0tIGRvbid0IGFsbG93IG5lZ2F0aXZlIHJhZGl1c1xyXG5cdFx0aWYgKHJfbGdjIDwgMClcclxuXHRcdFx0cmV0dXJuO1xyXG5cclxuXHRcdHZhciBwdFNjbjEsIHB0U2NuMixcclxuXHRcdFx0cl9weCA9IGdyaWRYTGdjTGVuZ3RoVG9QeChyX2xnYyk7XHJcblxyXG5cdFx0cHRTY24xID0gZ3JpZExnY1B0VG9DYW52YXNQdCh4X2xnYywgeV9sZ2MpO1xyXG5cclxuXHRcdGN0eC5iZWdpblBhdGgoKTtcclxuXHRcdGN0eC5zdHJva2VTdHlsZSA9IGNvbG9yO1xyXG5cdFx0Y3R4LmxpbmVXaWR0aCA9IDE7XHJcblxyXG5cdFx0Ly8gc2V0IHRyYW5zZm9ybSBtYXRyaXggdG8gaWRlbnRpdHk6XHJcblx0XHRjdHguc2V0VHJhbnNmb3JtKDEsIDAsIDAsIDEsIDAsIDApO1xyXG5cclxuXHRcdGN0eC5hcmMocHRTY24xLngsIHB0U2NuMS55LCByX3B4LCAwLCBNYXRoLlBJICogMiwgZmFsc2UpO1xyXG5cclxuXHRcdGN0eC5zdHJva2UoKTtcclxuXHRcdGN0eC5jbG9zZVBhdGgoKTtcclxuXHR9XHJcblxyXG5cdC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuXHQgSW5wdXQgKGFsbCBpbiBsb2dpYyB1bml0IGFuZCBuZWVkIHRvIGJlIGNvbnZlcnRlZCB0byBDYW52YXMgcHggdW5pdCk6XHJcblx0XHQgIGEsIGIgLSB4IGFuZCB5IGF4aXMgb2YgdGhlIGh5cGVyYm9sYS5cclxuXHRcdCAgaCwgayAtIHgseSBkaXN0YW5jZXMgZnJvbSB0aGUgY2VudGVyIG9mIGh5cGVyYm9sYSB0byB0aGUgb3JpZ2luXHJcblx0XHRcdFx0IG9mIHgseSBzeXN0ZW0uXHJcblxyXG5cdCAgTm90ZTogVGhlIGNuYy5FcSBpcyB0byBjb21wdXRlIHkgYWNjb3JkaW5nIHRvIHggYXMgaWYgaCwgayBhcmUgemVyb3M7XHJcblx0ICB4IHR5cGU6XHJcblx0XHRcdFx0aHlwZXJib2xhIGVxdWF0aW9uIGlzOiAgIHheMiAvIGFeMiAtIHleMiAvIGJeMiA9IDE7XHJcblxyXG5cdFx0XHRcdFx0XHRcdHRoZXJlZm9yZTogICB5ID0gKy0gYiAqIHNxcnQoeF4yIC8gYV4yIC0gMSlcclxuXHJcblx0ICB5IHR5cGU6XHJcblx0XHRcdFx0aHlwZXJib2xhIGVxdWF0aW9uIGlzOiAgIHleMiAvIGJeMiAtIHheMiAvIGFeMiA9IDE7XHJcblxyXG5cdFx0XHRcdFx0XHRcdHRoZXJlZm9yZTogICB5ID0gKy0gYiAqIHNxcnQoeF4yIC8gYV4yICsgMSlcclxuXHJcblx0QWxnb3JpdGhtOlxyXG5cdFx0QWxsIHRoZSByZW5kZXJpbmcgaXMgZnJvbSB0aGUgZnVydGhlc3Qgb3BlbmluZyBwb2ludHMgb24gdGhlIGN1cnZlIHRvIHRoZVxyXG5cdGNlbnRlciBwb2ludCB3aGVyZSB0aGUgZGVnZW5lcmF0ZSBwb2ludHMgYXJlIChlY2NlcHQgZm9yIGVsaWlwc2UsIHdoaWNoIGlzXHJcblx0cmVuZGVyZWQgZnJvbSB0aGUgY2VudGVyIHBvaW50IHRvIHRoZSBmdXJ0aGVzdCBwb2ludHMgb24gdGhlIHggYXhpc3Qgd2hlcmUgdGhlXHJcblx0ZGVnZW5hcmF0ZSBwb2ludHMgYXJlKS4gVGhlIGluY3JlbWVudCByYXRlIGlzIGRpdmlkZWQgaW50byB0aHJlZSBwaGFzZXMgLVxyXG5cdHRoZSBjbG9zZXIgdG8gdGhlIGRlZ2VuYXRlIHBvaW50LCB0aGUgZmluZXIgdGhlIGluY3JlbWVudCBhbW91bnQgYmVjb21lcy5cclxuXHQqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cclxuXHRmdW5jdGlvbiBpbml0Q29uaWNzKGNvbG9yLCBoLCBrLCBhLCBiKVxyXG5cdHtcclxuXHRcdHZhciBjbmMgPSB7XHJcblx0XHRcdGRvdFNpemU6ICAgICAyLFxyXG5cdFx0XHRoeXBlckNlbnRlcjogZ3JpZExnY1B0VG9DYW52YXNQdChoLCBrKSxcclxuXHRcdFx0eFZlcnRleDogICAgIDAsXHJcblx0XHRcdHhWZXJ0ZXhQeDogICAwLFxyXG5cdFx0XHRiRHJhd05lZ2F0aXZlWDogdHJ1ZSxcclxuXHRcdFx0YkRyYXdQb3NpdGl2ZVk6IHRydWUsXHJcblxyXG5cdFx0XHR4U2xvd1RocmluazogIGEgKjEuMjIsXHJcblx0XHRcdHhmYXN0VGhyaW5rMTogYSAqIDEuMTgyLFxyXG5cdFx0XHR4ZmFzdFRocmluazI6IGEgKiAxLjAxLFxyXG5cclxuXHRcdFx0dGhyaW5rU2xvd0ZhY3RvcjogMTkvMjAsIC8vXHJcblx0XHRcdHRocmlua0Zhc3RGYWN0b3IxOiAxOC8xOSxcclxuXHRcdFx0dGhyaW5rRmFzdEZhY3RvcjI6IDEvNDksXHJcblxyXG5cdFx0XHR4U3RhcnQ6IHhVcHBlckJvdW5kICsgTWF0aC5hYnMoaCksXHJcblxyXG5cdFx0XHR4Q29tcGFyZTogZnVuY3Rpb24oeCkgeyByZXR1cm4geCA+PSBjbmMueFZlcnRleDsgfSxcclxuXHRcdFx0eENoYW5nZUluY1JhdGU6IGZ1bmN0aW9uKHgsIHRocmVzaG9sZCkgeyByZXR1cm4geCA8IHRocmVzaG9sZDsgfVxyXG5cdFx0fTtcclxuXHJcblx0XHRjbmMuZFggPSBhIC8gZ3JpZFhMZ2NMZW5ndGhUb1B4KGEpOyAvLyBub3JtYWxpemUgdGhlIGRlbHRhIHhcclxuXHJcblx0XHQvLyBtb3Zpbmcgd2l0aCBpbmNyZW1lbnQgb2YgZFggaXMgbm90IGZpbmUgZW5vdWdoIG5lYXIgeSA9IDA6XHJcblx0XHRjbmMubWluRGVsdGEgID0gY25jLmRYIC8gNDA7XHJcblx0XHRjbmMuZFggPSAtY25jLmRYO1xyXG5cclxuXHRcdC8vIHNldCB0cmFuc2Zvcm0gbWF0cml4IHRvIGlkZW50aXR5OlxyXG5cdFx0Y3R4LnNldFRyYW5zZm9ybSgxLCAwLCAwLCAxLCAwLCAwKTtcclxuXHRcdGN0eC50cmFuc2xhdGUoY25jLmh5cGVyQ2VudGVyLngsIGNuYy5oeXBlckNlbnRlci55KTtcclxuXHJcblx0XHRjdHguZmlsbFN0eWxlID0gY29sb3I7XHJcblx0XHRyZXR1cm4gY25jO1xyXG5cdH1cclxuXHJcblx0LyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG5cdFx0RHJhdyBhIGNvbmljIHR5cGUgc3VjaCBhcyBoeXBlcmJvbGEgaW4gdGhlIGVxdWF0aW9uICh4IHR5cGUpXHJcblx0XHRcdCh4LWgpXjIvYV4yIC0gKHktayleMi9iXjIgPSAxXHJcblx0XHRvciB5IHR5cGUgOlxyXG5cdFx0XHQoeS1rKV4yL2JeMiAtICh4LWgpXjIvYV4yID0gMVxyXG5cclxuXHRcdElucHV0IChhbGwgaW4gbG9naWMgdW5pdCBhbmQgbmVlZCB0byBiZSBjb252ZXJ0ZWQgdG8gQ2FudmFzIHB4IHVuaXQpOlxyXG5cdFx0ICBhLCBiIC0geCBhbmQgeSBheGlzIG9mIHRoZSBoeXBlcmJvbGEuXHJcblx0XHQgIGgsIGsgLSB4LHkgZGlzdGFuY2VzIGZyb20gdGhlIGNlbnRlciBvZiBoeXBlcmJvbGEgdG8gdGhlIG9yaWdpblxyXG5cdFx0XHRcdCBvZiB4LHkgc3lzdGVtLlxyXG5cclxuXHRcdGFsZ29yaXRobTpcclxuXHRcdDEuIHRyYW5zbGF0ZSB0aGUgc3lzdGVtIG9yaWdpbiB0byBoLGs7XHJcblx0XHQyLiBjb21wdXRlIHkgYWNjb3JkaW5nIHRvIHggYXMgaWYgaCwgayBhcmUgemVyb3M7XHJcblxyXG5cdFx0dGhlcmVmb3JlOiAgIHkgPSArLSBiICogc3FydCh4XjIvYV4yIC0gMSlcclxuXHQgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXHJcblx0ZnVuY3Rpb24gZHJhd0NvbmljcyhjbmMsIGNvbG9yLCBoLCBrLCBhLCBiKVxyXG5cdHtcclxuXHRcdHZhciB4LCB5O1xyXG5cdFx0dmFyIHB0ID0ge3g6MCwgeTowfTtcclxuXHJcblx0XHRjbmMueFNsb3dUaHJpbmsgKj0gX3hTdGVwX2xnYztcclxuXHRcdGNuYy54ZmFzdFRocmluazEgKj0gX3hTdGVwX2xnYztcclxuXHRcdGNuYy54ZmFzdFRocmluazIgKj0gX3hTdGVwX2xnYztcclxuXHRcdGNuYy50aHJpbmtGYWN0b3IgPSBjbmMudGhyaW5rU2xvd0ZhY3RvcjtcclxuXHJcblx0XHQvLyBkcmF3IHBvaW50cyBhdCB0aGUgZGVnZW5yYXRlIHNwb3Q6XHJcblx0XHRkcmF3RG90KGNuYy54VmVydGV4UHgsIDAsIGNuYy5kb3RTaXplKTtcclxuXHRcdGlmIChjbmMuYkRyYXdOZWdhdGl2ZVgpXHJcblx0XHRcdGRyYXdEb3QoLWNuYy54VmVydGV4UHgsIDAsIGNuYy5kb3RTaXplKTtcclxuXHJcblx0XHQvLyB1c2UgbG9naWMgeCB0byBjYWxjdWxhdGUgbG9naWMgeSxcclxuXHRcdC8vIHRoZW4gY29udmVydCB0byBjYW52YXMgY29vcmRzIGJlZm9yZSBkcmF3aW5nIGl0OlxyXG5cdFx0Ly9cclxuXHRcdGZvciAoeCA9IGNuYy54U3RhcnQ7IC8vX3hNYXhfbGdjICsgTWF0aC5hYnMoaCk7XHJcblx0XHRcdFx0XHRcdFx0XHRjbmMueENvbXBhcmUoeCk7IC8veCA+PSBjbmMueFZlcnRleDtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR4ICs9IGNuYy5kWCkgLy94SW5jcmVtZW50KVxyXG5cdFx0e1xyXG5cdFx0XHR5ID0gY25jLkVxKHgsIGEsIGIpOyAvL2IgKiBNYXRoLnNxcnQoIHgqeCAvIChhKmEpIC0gMSk7XHJcblxyXG5cdFx0XHRwdC54ID0gZ3JpZFhMZ2NMZW5ndGhUb1B4KHgpO1xyXG5cdFx0XHRwdC55ID0gZ3JpZFlMZ2NMZW5ndGhUb1B4KHkpO1xyXG5cclxuXHRcdFx0ZHJhd0RvdCggcHQueCwgIC1wdC55LCBjbmMuZG90U2l6ZSk7XHJcblxyXG5cdFx0XHRpZiAoY25jLmJEcmF3TmVnYXRpdmVYKSAgICAvL2NvbmljVHlwZSAhPSAncGFyYWJvbGF5MicpXHJcblx0XHRcdFx0ZHJhd0RvdCgtcHQueCwgIC1wdC55LCBjbmMuZG90U2l6ZSk7XHJcblxyXG5cdFx0XHRpZiAoY25jLmJEcmF3UG9zaXRpdmVZKSAvL2NvbmljVHlwZSAhPSAncGFyYWJvbGF4MicpXHJcblx0XHRcdHtcclxuXHRcdFx0XHRkcmF3RG90KCBwdC54LCBwdC55LCBjbmMuZG90U2l6ZSk7XHJcblxyXG5cdFx0XHRcdGlmIChjbmMuYkRyYXdOZWdhdGl2ZVgpIC8vY29uaWNUeXBlICE9ICdwYXJhYm9sYXkyJylcclxuXHRcdFx0XHRcdGRyYXdEb3QoLXB0LngsIHB0LnksIGNuYy5kb3RTaXplKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKGNuYy54Q2hhbmdlSW5jUmF0ZSh4LCBjbmMueFNsb3dUaHJpbmspKSAvLyBkeW5hbWljYWxseSBjaGFuZ2UgZGVsdGEgc2l6ZSB0b3dhcmQgeSA9IDA6XHJcblx0XHRcdHtcclxuXHRcdFx0XHRpZiAoY25jLnhDaGFuZ2VJbmNSYXRlKHgsIGNuYy54ZmFzdFRocmluazEpKVxyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdGlmIChjbmMueENoYW5nZUluY1JhdGUoeCwgY25jLnhmYXN0VGhyaW5rMikpXHJcblx0XHRcdFx0XHRcdGNuYy50aHJpbmtGYWN0b3IgPSBjbmMudGhyaW5rRmFzdEZhY3RvcjI7XHJcblx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdGNuYy50aHJpbmtGYWN0b3IgPSBjbmMudGhyaW5rRmFzdEZhY3RvcjE7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRpZiAoTWF0aC5hYnMoY25jLmRYKSA+IGNuYy5taW5EZWx0YSlcclxuXHRcdFx0XHRcdGNuYy5kWCAqPSBjbmMudGhyaW5rRmFjdG9yO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gYmUgbmljZSB0byBuZXh0IGZ1bmN0aW9uIGFuZCByZXNldCB0cmFuc2Zvcm06XHJcblx0XHRjdHguc2V0VHJhbnNmb3JtKDEsIDAsIDAsIDEsIDAsIDApO1xyXG5cdH1cclxuXHJcblx0Ly89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly8gTWF0aC5zaWduIHNoaW0uIE1hdGguc2lnbiBpcyBhbiBleHBlcmltZW50YWwgZnVuY3Rpb25cclxuXHQvLyBub3QgYXZhaWxhYmxlIGluIGFsbCBicm93c2Vyc1xyXG5cdC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdGZ1bmN0aW9uIG1hdGhTaWduKHZhbHVlKVxyXG5cdHtcclxuXHRcdHZhciBudW1iZXIgPSArdmFsdWU7XHJcblx0XHRpZiAobnVtYmVyID09PSAwKSByZXR1cm4gbnVtYmVyO1xyXG5cdFx0aWYgKE51bWJlci5pc05hTihudW1iZXIpKSByZXR1cm4gbnVtYmVyO1xyXG5cdFx0cmV0dXJuIG51bWJlciA8IDAgPyAtMSA6IDE7XHJcblx0fVxyXG5cclxuXHJcbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4vLyBHUklEIERSQVdJTkdcclxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG5cdC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdGZ1bmN0aW9uIGdyaWRDcmVhdGUob2JqKVxyXG5cdHtcclxuXHRcdG9wdHMgPSBvYmo7XHJcblxyXG5cdFx0Z3JpZEluaXQoKTtcclxuXHRcdGdyaWREcmF3KCk7XHJcblx0fVxyXG5cclxuXHQvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHRmdW5jdGlvbiBpbml0QXhpcyhtYXhfbGdjLCBtaW5fbGdjLCBzdGVwX2xnYywgbGVuZ3RoX3B4LCBPZmZzZXRfcHgpXHJcblx0e1xyXG5cdFx0dmFyIHJhbmdlX2xnYyA9IE1hdGguYWJzKG1heF9sZ2MgLSBtaW5fbGdjKTtcclxuXHRcdHZhciBpZGVhbE51bUdyaWRzID0gMjAsIGlkZWFsU3RlcF9sZ2MsXHJcblx0XHRcdG1heE51bUdyaWRzID0gaWRlYWxOdW1HcmlkcywgbWluTnVtR3JpZHMgPSA0O1xyXG5cdFx0dmFyIG1heE51bSA9IE1hdGgubWF4KE1hdGguYWJzKG1heF9sZ2MpLCBNYXRoLmFicyhtaW5fbGdjKSk7XHJcblx0XHR2YXIgbWV0cmljcyA9IGN0eC5tZWFzdXJlVGV4dChcIi1cIik7XHJcblx0XHRfbmVnU2lnblcgPSBtZXRyaWNzLndpZHRoOyAvLyBwaXhlbHNcclxuXHJcblx0XHR2YXIgZ3JpZCA9XHJcblx0XHR7XHJcblx0XHRcdG1heF9sZ2M6IG1heF9sZ2MsXHJcblx0XHRcdG1pbl9sZ2M6IG1pbl9sZ2MsXHJcblx0XHRcdHN0ZXBfbGdjOiBzdGVwX2xnYyxcclxuXHRcdFx0blNjYWxlOiAxLFxyXG5cdFx0XHRkZWNpbWFsUG9pbnRzOiAxLCAgLy8gY2hhbmdlIHRoaXMgdG8gYWx0ZXIgdGhlIGRlY2ltYWwgcHJlY2lzaW9uIG9mIGdyaWRcclxuXHJcblx0XHRcdHRvU3RyOiBmdW5jdGlvbih4KVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0aWYgKHR5cGVvZih4KSA9PSBcInN0cmluZ1wiKVxyXG5cdFx0XHRcdFx0eCA9IHBhcnNlRmxvYXQoeCk7XHJcblx0XHRcdFx0dmFyIGYgPSB4LnRvRml4ZWQodGhpcy5kZWNpbWFsUG9pbnRzKTtcclxuXHRcdFx0XHR2YXIgbiA9IHgudG9GaXhlZCgwKTtcclxuXHRcdFx0XHRpZiAoZiAtIG4pXHJcblx0XHRcdFx0XHRyZXR1cm4gZjtcclxuXHRcdFx0XHRyZXR1cm4gbjtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0Z3JpZC5tYXhEaWdpdHMgPSBjb3VudERpZ2l0cyhtYXhOdW0pO1xyXG5cclxuXHRcdHZhciB0b3RhbE51bUdyaWRzID0gTWF0aC5yb3VuZChyYW5nZV9sZ2MgLyBzdGVwX2xnYyk7XHJcblxyXG5cdFx0aWYgKHRvdGFsTnVtR3JpZHMgPiBtYXhOdW1HcmlkcyB8fCB0b3RhbE51bUdyaWRzIDwgbWluTnVtR3JpZHMpXHJcblx0XHR7XHJcblx0XHRcdGlmIChyYW5nZV9sZ2MgPiBpZGVhbE51bUdyaWRzKVxyXG5cdFx0XHRcdGlkZWFsU3RlcF9sZ2MgPSBNYXRoLmZsb29yKHJhbmdlX2xnYyAvIGlkZWFsTnVtR3JpZHMpOyAvLyBpZGVhbCBncmFudWFsaXR5ID0gMjAgZ3JpZHNcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0aWRlYWxOdW1HcmlkcyA9IDg7XHJcblx0XHRcdFx0aWRlYWxTdGVwX2xnYyA9IE1hdGguZmxvb3IocmFuZ2VfbGdjIC8gaWRlYWxOdW1HcmlkcyAqIDEwKSAvIDEwO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRncmlkLnN0ZXBfbGdjID0gaWRlYWxTdGVwX2xnYztcclxuXHRcdFx0dG90YWxOdW1HcmlkcyA9IE1hdGgucm91bmQocmFuZ2VfbGdjIC8gaWRlYWxTdGVwX2xnYyk7XHJcblx0XHR9XHJcblxyXG5cdFx0Z3JpZC5tYXhTaW5nbGVTaWRlR3JpZHMgPSBNYXRoLmZsb29yKE1hdGgubWF4KE1hdGguYWJzKG1heF9sZ2MpLCBNYXRoLmFicyhtaW5fbGdjKSkgLyBncmlkLnN0ZXBfbGdjKTtcclxuLy8gICAgICAgIGdyaWQubWF4R3JpZHMgPSBNYXRoLmZsb29yKE1hdGguYWJzKG1heF9sZ2MpIC8gZ3JpZC5zdGVwX2xnYyk7XHJcblx0XHRncmlkLm1pbkdyaWRzID0gTWF0aC5mbG9vcihNYXRoLmFicyhtaW5fbGdjKSAvIGdyaWQuc3RlcF9sZ2MpO1xyXG5cclxuXHRcdC8vIGZsb2F0IHJlc3VsdCBmb3IgYWNjdXJhdGUgZ2lyZCBvcmlnaW4gY29tcHV0YXRpb246XHJcblx0XHRncmlkLnN0ZXBfcHggPSAoIGxlbmd0aF9weCAtIE9mZnNldF9weCAqIDIgKSAvIHRvdGFsTnVtR3JpZHM7XHJcblxyXG5cdFx0Ly8gY29tcHV0ZSB0aGUgZ3JpZCBvcmlnaW46XHJcblx0XHRncmlkLm9yaWdpbiA9IE1hdGgucm91bmQobGVuZ3RoX3B4IC0gT2Zmc2V0X3B4IC0gTWF0aC5hYnMobWF4X2xnYyAqIGdyaWQuc3RlcF9weCAvIGdyaWQuc3RlcF9sZ2MpKTtcclxuXHJcblx0XHQvLyBnZXQgdGhlIGludGVyZ2VyIHN0ZXAgc2l6ZTpcclxuXHRcdGdyaWQuc3RlcF9weCA9IE1hdGgucm91bmQoZ3JpZC5zdGVwX3B4KTtcclxuXHJcbi8vICAgICAgICBncmlkLmRlY2ltYWxGYWN0b3IgPSAyIC8gZ3JpZC5zdGVwX2xnYzsgLy8gaGFsZiBwb2ludCBwcmVjaXNpb25cclxuLy8gICAgICAgIGlmIChncmlkLmRlY2ltYWxGYWN0b3IgPCAxKVxyXG4vLyAgICAgICAgICAgIGdyaWQuZGVjaW1hbFBvaW50cyA9IDA7XHJcblxyXG5cdFx0cmV0dXJuIGdyaWQ7XHJcblx0fVxyXG5cclxuXHQvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcblx0ICBJbml0aWFsaXplIGFcclxuXHJcblx0ICBJbnB1dDpcclxuXHRcdHhSYW5nZTogW21pbiwgbWF4LCBzdGVwIHNpemVdXHJcblx0XHR5UmFuZ2U6IFttaW4sIG1heCwgc3RlcCBzaXplXVxyXG5cdCoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cclxuXHRmdW5jdGlvbiBncmlkSW5pdCgpXHJcblx0e1xyXG5cdFx0Ly8gQ29tcHV0ZSBncmlkIHN0ZXBzOlxyXG5cdFx0dmFyIHhPZmZzZXQgPSA2LCAvLyBwaXhlbHMsIHNvIHRoZSBlZGdlIG9mIHRoZSBncmlkIGNhbiBkaXNwbGF5IHBvaW50c1xyXG5cdFx0XHR5T2Zmc2V0ID0gNjtcclxuXHJcblx0XHQvLyBpbmRleCB2YWx1ZXMgZm9yIHhSYW5nZSwgeVJhbmdlIHRvIHJlcGxhY2UgdGhlIG1hZ2ljIG51bWJlcnM6XHJcblx0XHR2YXIgbWluSWR4ID0gMCwgbWF4SWR4PTEsIFN0ZXBTaXplPTI7XHJcblxyXG5cdFx0X3hHcmlkID0gaW5pdEF4aXMob3B0cy54UmFuZ2VbbWF4SWR4XSwgb3B0cy54UmFuZ2VbbWluSWR4XSwgb3B0cy54UmFuZ2VbU3RlcFNpemVdLFxyXG5cdFx0XHRcdFx0XHQgIHNlbGYuc2V0dGluZ3Mud2lkdGgsIHhPZmZzZXQpO1xyXG5cdFx0Ly8geSBsb2dpYyBzeXN0ZW0gaXMgcG9zaXRpdmUgdXAsIGJ1dCB5IGNhbnZhcyBzeXN0ZW0gaXMgcG9zaXRpdmUgZG93bjpcclxuXHRcdF95R3JpZCA9IGluaXRBeGlzKG9wdHMueVJhbmdlW21pbklkeF0sIG9wdHMueVJhbmdlW21heElkeF0sIG9wdHMueVJhbmdlW1N0ZXBTaXplXSxcclxuXHRcdFx0XHRcdFx0ICBzZWxmLnNldHRpbmdzLmhlaWdodCwgeU9mZnNldCk7XHJcblx0fVxyXG5cclxuXHQvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcblx0ICBEcmF3IGEgeCx5IGNvb3JkaW5hdGUgZ3JpZCBvbiBDYW52YXNcclxuXHJcblx0ICBJbnB1dDpcclxuXHRcdGdyaWRDb2xvcjogR3JpZCBsaW5lIGNvbG9yXHJcblx0XHRheGlzQ29sb3I6IGNvbG9yIGZvciB0aGUgeCx5IGF4aXNcclxuXHQqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXHJcblx0ZnVuY3Rpb24gZ3JpZERyYXcoKVxyXG5cdHtcclxuXHRcdHZhciBheGlzV2lkdGggPSAxLFxyXG5cdFx0XHR0aWNIYWxmTGVuZ3RoID0gMiwgLy8gcGl4ZWxzXHJcblx0XHRcdGFycmF3TGVuZ3RoID0gTWF0aC5yb3VuZCggMC41ICogX3hHcmlkLnN0ZXBfcHggKSxcclxuXHRcdFx0eVRpY0JvdG0gPSBfeUdyaWQub3JpZ2luICsgdGljSGFsZkxlbmd0aCxcclxuXHRcdFx0eVRpY1RvcCA9IF95R3JpZC5vcmlnaW4gLSB0aWNIYWxmTGVuZ3RoO1xyXG5cclxuXHJcblx0XHQvLyBQYWludCBiYWNrZ3JvdW5kOlxyXG5cdFx0Y3R4LmZpbGxTdHlsZSA9IHN0eWxlLmJnQ29sb3I7XHJcblx0XHRjdHguZmlsbFJlY3QgKDAsIDAsIHNlbGYuc2V0dGluZ3Mud2lkdGgsIHNlbGYuc2V0dGluZ3MuaGVpZ2h0KTtcclxuXHJcblx0XHR2YXIgY29sb3IgPSBzdHlsZS5ncmlkQ29sb3I7XHJcblx0XHR2YXIgYXhpc0NvbG9yID0gc3R5bGUuYXhpc0NvbG9yO1xyXG5cclxuXHRcdC8vIGRyYXcgZ3JpZDpcclxuXHRcdGZvciAodmFyIGk9MTsgaSA8PSBfeEdyaWQubWF4U2luZ2xlU2lkZUdyaWRzOyBpKyspXHJcblx0XHR7XHJcblx0XHRcdGZvciAodmFyIGo9MTsgaiA8PSBfeUdyaWQubWF4U2luZ2xlU2lkZUdyaWRzOyBqKyspXHJcblx0XHRcdHtcclxuXHRcdFx0XHR2YXIgeSA9IGogKiBfeUdyaWQuc3RlcF9weDtcclxuXHJcblx0XHRcdFx0ZHJhd0xpbmUoMCwgX3lHcmlkLm9yaWdpbiArIHksIHNlbGYuc2V0dGluZ3Mud2lkdGgsIF95R3JpZC5vcmlnaW4gKyB5LCBheGlzV2lkdGgsIGNvbG9yKTtcclxuXHJcblx0XHRcdFx0aWYgKGogPD0gX3lHcmlkLm1pbkdyaWRzKVxyXG5cdFx0XHRcdFx0ZHJhd0xpbmUoMCwgX3lHcmlkLm9yaWdpbiAtIHksIHNlbGYuc2V0dGluZ3Mud2lkdGgsIF95R3JpZC5vcmlnaW4gLSB5LCBheGlzV2lkdGgsIGNvbG9yKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dmFyIHggICAgPSBpICogX3hHcmlkLnN0ZXBfcHg7XHJcblx0XHRcdHZhciB4X3B4ID0gX3hHcmlkLm9yaWdpbiArIHg7ICAgLy8gcG9zaXRpdmUgcmVnaW9uIG9mIHg6XHJcblxyXG5cdFx0XHQvLyBkcmF3IHNob3J0IGdyaWQgVGljIG9uIGF4aXM6XHJcblx0XHRcdGRyYXdMaW5lKHhfcHgsIDAsICAgICAgICAgeF9weCwgc2VsZi5zZXR0aW5ncy5oZWlnaHQsICAgYXhpc1dpZHRoLCBjb2xvcik7ICAgICAvLyB2ZXJ0aWNhbCBncmlkIGxpbmVzXHJcblx0XHRcdGRyYXdMaW5lKHhfcHgsIHlUaWNCb3RtLCAgeF9weCwgeVRpY1RvcCwgIGF4aXNXaWR0aCwgYXhpc0NvbG9yKTsgLy8gdGljIGJhcnNcclxuXHJcblx0XHRcdGlmIChpIDw9IF94R3JpZC5taW5HcmlkcylcclxuXHRcdFx0e1xyXG5cdFx0XHRcdHhfcHggPSBfeEdyaWQub3JpZ2luIC0geDsgICAvLyBuZWdhdGl2ZSByZWdpb24gb2YgeDpcclxuXHRcdFx0XHRkcmF3TGluZSh4X3B4LCAwLCB4X3B4LCBzZWxmLnNldHRpbmdzLmhlaWdodCwgYXhpc1dpZHRoLCBjb2xvcik7ICAgICAgICAgICAgIC8vIHZlcnRpY2FsIGdyaWQgbGluZXNcclxuXHRcdFx0XHRkcmF3TGluZSh4X3B4LCB5VGljQm90bSwgeF9weCwgeVRpY1RvcCwgYXhpc1dpZHRoLCBheGlzQ29sb3IpOyAvLyB0aWMgYmFyc1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0cHJpbnRMYWJlbHModGljSGFsZkxlbmd0aCwgeVRpY0JvdG0sIHlUaWNUb3ApO1xyXG5cclxuXHRcdC8vIGRyYXcgeCBheGlzOlxyXG5cdFx0ZHJhd0xpbmUoMCwgX3lHcmlkLm9yaWdpbiwgc2VsZi5zZXR0aW5ncy53aWR0aCwgX3lHcmlkLm9yaWdpbiwgYXhpc1dpZHRoLCBheGlzQ29sb3IpO1xyXG5cclxuXHRcdC8vIGRyYXcgeSBheGlzOlxyXG5cdFx0ZHJhd0xpbmUoX3hHcmlkLm9yaWdpbiwgMCwgX3hHcmlkLm9yaWdpbiwgc2VsZi5zZXR0aW5ncy5oZWlnaHQsIGF4aXNXaWR0aCwgYXhpc0NvbG9yKTtcclxuXHJcblx0XHQvLyBkcmF3IGFycm93czpcclxuXHRcdGRyYXdBcnJvdyhzZWxmLnNldHRpbmdzLndpZHRoLTEsIF95R3JpZC5vcmlnaW4sIDAsIGFycmF3TGVuZ3RoICogX3hHcmlkLm5TY2FsZSwgYXhpc0NvbG9yKTsgIC8vIG9uIHgtYXhpc1xyXG5cdFx0ZHJhd0Fycm93KDEsIF95R3JpZC5vcmlnaW4sIDE4MCwgYXJyYXdMZW5ndGggKiBfeEdyaWQublNjYWxlLCBheGlzQ29sb3IpOyAgLy8gb24geC1heGlzXHJcblx0XHRkcmF3QXJyb3coX3hHcmlkLm9yaWdpbiwgMSwgLTkwLCBhcnJhd0xlbmd0aCAqIF95R3JpZC5uU2NhbGUsIGF4aXNDb2xvcik7ICAgICAgIC8vIG9uIHktYXhpc1xyXG5cdFx0ZHJhd0Fycm93KF94R3JpZC5vcmlnaW4sIHNlbGYuc2V0dGluZ3MuaGVpZ2h0LTEsIDkwLCBhcnJhd0xlbmd0aCAqIF95R3JpZC5uU2NhbGUsIGF4aXNDb2xvcik7ICAgICAgIC8vIG9uIHktYXhpc1xyXG5cclxuXHRcdC8vIHNldCB0cmFuc2Zvcm0gbWF0cml4IHRvIGlkZW50aXR5OlxyXG5cdFx0Y3R4LnNldFRyYW5zZm9ybSgxLCAwLCAwLCAxLCAwLCAwKTsgLy8gY2xlYW4gdXAgdGhlIHRyYW5zZm9ybSBhZnRlciBkcmF3QXJyb3dcclxuXHR9XHJcblxyXG5cdC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdGZ1bmN0aW9uIGlzUHJpbnRhYmxlWCh4LCBzdHIpXHJcblx0e1xyXG5cdFx0dmFyIG1ldHJpY3MgPSBjdHgubWVhc3VyZVRleHQoc3RyKTtcclxuXHRcdHZhciBoYWxmU3RyVyA9IG1ldHJpY3Mud2lkdGggLyAyO1xyXG5cdFx0cmV0dXJuICggeCArIGhhbGZTdHJXIDwgc2VsZi5zZXR0aW5ncy53aWR0aCAmJiB4IC0gaGFsZlN0clcgPiAwIClcclxuXHR9XHJcblxyXG5cdC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdGZ1bmN0aW9uIGlzUHJpbnRhYmxlWSh5LCBzdHIpXHJcblx0e1xyXG5cdFx0Ly8gc2luY2UgbWVhc3VyZVRleHQgZG9lc24ndCBwcm92aWRlIGhlaWdodCwgdGhpcyBpcyBhIGFwcHJveGltYXRpb246XHJcblx0XHR2YXIgbWV0cmljcyA9IGN0eC5tZWFzdXJlVGV4dChcIk1cIik7XHJcblx0XHR2YXIgaGFsZlN0ckggPSBtZXRyaWNzLndpZHRoO1xyXG5cclxuXHRcdHJldHVybiAoIHkgKyBoYWxmU3RySCA8IHNlbGYuc2V0dGluZ3MuaGVpZ2h0ICYmIHkgLSBoYWxmU3RySCA+IDAgKVxyXG5cdH1cclxuXHJcblx0LyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG5cdCAgUHJpbnQgbGFiZWxzIG9uIHggYW5kIHkgYXhpcyBvZiB0aGUgZ3JpZFxyXG5cclxuXHQgIElucHV0OlxyXG5cdFx0dGljSGFsZkxlbmd0aDogaGFsZiBsZW5ndGggb2YgdGhlIHRpY3Mgb24gdGhlIHggYXhpcy5cclxuXHRcdHlUaWNCb3RtLCB5VGljVG9wOiAgdG9wIGFuZCBib3R0b20gWSBwb3NpdGlvbnMgb2YgdGhlIHRpY3Mgb24gdGhlIHggYXhpcy5cclxuXHRcdGdyaWRGb250OiBmb250IGZvciB0aGUgbGFiZWxzXHJcblx0XHRncmlkRm9udENvbG9yOiBjb2xvciBmb3IgdGhlIGxhYmVsc1xyXG5cdCoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cclxuXHRmdW5jdGlvbiBwcmludExhYmVscyh0aWNIYWxmTGVuZ3RoLCB5VGljQm90bSwgeVRpY1RvcClcclxuXHR7XHJcblx0XHR2YXIgeFRleHRIb3JpeiwgeVRleHRIb3JpeiwgeFRleHRWZXJ0LCB5VGV4dFZlcnQsXHJcblx0XHRcdHhHcmlkTnVtYmVyLCB5R3JpZE51bWJlciwgY29udGVudCxcclxuXHRcdFx0eUNsZWFyYW5jZSA9IDQsIC8vIHBpeGVsc1xyXG5cdFx0XHR4RGVjaW1hbFB0cyA9IDAsIHlEZWNpbWFsUHRzID0gMCxcclxuXHRcdFx0aVNraXBQb3NpdCA9IDAsIGlTa2lwTmVnYXQgPSAwLFxyXG5cdFx0XHRtYXhEZW5vcm0gPSA4O1xyXG5cclxuXHRcdHZhciBza2lwQ250ID0gb3B0cy5sYWJlbFNraXAgfHwgMDtcclxuXHRcdHZhciBza2lwU3RlcCA9IF95R3JpZC5zdGVwX2xnYyAqIChza2lwQ250ICsgMSksXHJcblx0XHRcdHNraXBTdGVwRGVsdGEgPSBza2lwU3RlcCAtIHNraXBTdGVwLnRvRml4ZWQoKTtcclxuXHRcdGlmIChza2lwU3RlcERlbHRhKVxyXG5cdFx0XHR5RGVjaW1hbFB0cyA9IDE7XHJcblxyXG5cdFx0aWYgKF94R3JpZC5zdGVwX2xnYyA8IDEpXHJcblx0XHRcdHhEZWNpbWFsUHRzID0gMjtcclxuXHJcblx0XHRjdHguZm9udCA9IHN0eWxlLmdyaWRGb250O1xyXG5cdFx0Y3R4LmZpbGxTdHlsZSA9IHN0eWxlLmdyaWRGb250Q29sb3I7IC8vIGxpZ2h0IGdyYXkgZm9yIGdyaWQgbGluZXNcclxuXHRcdGN0eC50ZXh0QWxpZ24gPSBcImNlbnRlclwiO1xyXG5cclxuXHRcdC8vIFByaW50IGdyaWQgbnVtYmVycyBvbiB4IGF4aXM6XHJcblx0XHR5VGV4dEhvcml6ID0geVRpY0JvdG0gLSB0aWNIYWxmTGVuZ3RoKjM7XHJcblx0XHRmb3IgKHZhciBpPTE7IGkgPD0gX3hHcmlkLm1heFNpbmdsZVNpZGVHcmlkczsgaSsrKVxyXG5cdFx0e1xyXG5cdFx0XHQvLyBwb3NpdGlvbiBvZiB0aGUgbGFiZWw6XHJcblx0XHRcdHZhciB4ID0gaSAqIF94R3JpZC5zdGVwX3B4O1xyXG5cdFx0XHR4VGV4dEhvcml6ID0gX3hHcmlkLm9yaWdpbiArIHg7XHJcblxyXG5cdFx0XHQvLyBudW1iZXJzIG9uIHgtYXhpczpcclxuXHRcdFx0eEdyaWROdW1iZXIgPSAoaSAqIF94R3JpZC5zdGVwX2xnYykudG9GaXhlZCh4RGVjaW1hbFB0cyk7XHJcblx0XHRcdGlmIChvcHRzLnVzZVBpTGFiZWxzKVxyXG5cdFx0XHRcdGNvbnRlbnQgPSBkZWNUb0ZyYWNQaVN0cih4R3JpZE51bWJlciwgbWF4RGVub3JtKTtcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdGNvbnRlbnQgPSB4R3JpZE51bWJlcjtcclxuXHJcblx0XHRcdGlmIChpIDwgX3hHcmlkLm1heFNpbmdsZVNpZGVHcmlkcyB8fCBpc1ByaW50YWJsZVgoeFRleHRIb3JpeiwgY29udGVudCkpXHJcblx0XHRcdFx0aVNraXBQb3NpdCA9IHByaW50T25lTGFiZWwoY29udGVudCwgeFRleHRIb3JpeiwgeVRleHRIb3JpeiwgaVNraXBQb3NpdCwgc2tpcENudCk7XHJcblxyXG5cdFx0XHR4VGV4dEhvcml6ID0gX3hHcmlkLm9yaWdpbiAtIHggLSBfbmVnU2lnblc7XHJcblxyXG5cdFx0XHRpZiAoaXNQcmludGFibGVYKHhUZXh0SG9yaXosIGNvbnRlbnQpKVxyXG5cdFx0XHRcdGlTa2lwTmVnYXQgPSBwcmludE9uZUxhYmVsKFwiLVwiK2NvbnRlbnQsIHhUZXh0SG9yaXosIHlUZXh0SG9yaXosIGlTa2lwTmVnYXQsIHNraXBDbnQpO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIFByaW50IGdyaWQgbnVtYmVycyBvbiB5IGF4aXM6XHJcblx0XHRjdHgudGV4dEFsaWduID0gXCJyaWdodFwiO1xyXG5cdFx0aVNraXBQb3NpdCA9IGlTa2lwTmVnYXQgPSAwO1xyXG5cdFx0eFRleHRWZXJ0ID0gX3hHcmlkLm9yaWdpbiAtMzsgLy8gMyBwaXhlbHMgdG8gdGhlIGxlZnQgb2YgeSBheGlzXHJcblxyXG5cdFx0Zm9yICh2YXIgaj0xOyBqIDw9IF95R3JpZC5tYXhTaW5nbGVTaWRlR3JpZHM7IGorKylcclxuXHRcdHtcclxuXHRcdFx0Ly8gbnVtYmVycyBvbiB5LWF4aXM6XHJcblx0XHRcdHlHcmlkTnVtYmVyID0gKGogKiBfeUdyaWQuc3RlcF9sZ2MpLnRvRml4ZWQoeURlY2ltYWxQdHMpO1xyXG5cclxuXHRcdFx0Ly8gcG9zaXRpb24gb2YgdGhlIGxhYmVsOlxyXG5cdFx0XHR2YXIgeSA9IGogKiBfeUdyaWQuc3RlcF9weDtcclxuXHRcdFx0eVRleHRWZXJ0ID0gX3lHcmlkLm9yaWdpbiAtIHkgKyB5Q2xlYXJhbmNlO1xyXG5cclxuXHRcdFx0aWYgKGlzUHJpbnRhYmxlWSh5VGV4dFZlcnQsIHlHcmlkTnVtYmVyKSlcclxuXHRcdFx0XHRpU2tpcFBvc2l0ID0gcHJpbnRPbmVMYWJlbCh5R3JpZE51bWJlciwgeFRleHRWZXJ0LCB5VGV4dFZlcnQsIGlTa2lwUG9zaXQsIHNraXBDbnQpO1xyXG5cclxuXHRcdFx0Ly8gbG9naWMgeSBpcyBwb3NpdGl2ZSB1cCwgd2hpbGUgY2FudmFzIHkgaXMgcG9zaXRpdmUgZG93bjpcclxuXHRcdFx0eVRleHRWZXJ0ID0gX3lHcmlkLm9yaWdpbiArIHkgKyB5Q2xlYXJhbmNlO1xyXG5cdFx0XHRpZiAoaXNQcmludGFibGVZKHlUZXh0VmVydCwgeUdyaWROdW1iZXIpKVxyXG5cdFx0XHRcdGlTa2lwTmVnYXQgPSBwcmludE9uZUxhYmVsKFwiLVwiK3lHcmlkTnVtYmVyLCB4VGV4dFZlcnQsIHlUZXh0VmVydCwgaVNraXBOZWdhdCwgc2tpcENudCk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHRmdW5jdGlvbiBwcmludE9uZUxhYmVsKGNvbnRlbnQsIHgsIHksIGlTa2lwLCBza2lwQ250KVxyXG5cdHtcclxuXHRcdGlmIChpU2tpcCA9PSBza2lwQ250KVxyXG5cdFx0e1xyXG5cdFx0XHRjdHguZmlsbFRleHQoY29udGVudCwgeCwgeSk7XHJcblx0XHRcdGlTa2lwID0gMDtcclxuXHRcdH1cclxuXHRcdGVsc2VcclxuXHRcdFx0aVNraXArKztcclxuXHRcdHJldHVybiBpU2tpcDtcclxuXHR9XHJcblxyXG5cdC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuXHQgQ29udmVydCBhIGRlY2ltYWwgbnVtYmVyIHRvIHN0cmluZyBvZiBhIFBpIGZhY3RvcmVkIGZyYWN0aW9uIG51bWJlci5cclxuXHQgSW5wdXQ6XHJcblx0XHRkZWMgICAgICAgICAtIHRoZSBkZWNpbWFsIG51bWJlciB0byBiZSBjb252ZXJ0ZWQsXHJcblx0XHRtYXhEZW5vbSAgICAtIG9wdGlvbmFsXHJcblx0XHRcdFx0XHQgIHRoZSBtYXggZGVub3JtaXRvciBvZiB0aGUgY29udmVyc2lvbiBwcmVjaXNpb24sIGRlZmF1bHQgaXMgMTZcclxuXHJcblx0IFJldHVybjpcclxuXHRcdHhGcmFjLnVwcGVyIC0gdXBwZXIgcGFydCBvZiB0aGUgZmFjdG9yZWQgZnJhY3Rpb25cclxuXHRcdHhGcmFjLmxvd2VyIC0gbG93ZXIgcGFydCBvZiB0aGUgZmFjdG9yZWQgZnJhY3Rpb25cclxuXHJcblx0IGV4YW1wbGU6ICAgICAgIHhEZWMgPSAxLjU3OyAgbWF4RGVub3JtID0gODtcclxuXHRcdFx0XHRcdHJldHVybjogeEZyYWMudXBwZXIgPSAxOyB4RnJhYy5sb3dlciA9IDI7ICAgIChpLmUuIDEuNTcgPSAxLzIgUGkpXHJcblx0KioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xyXG5cdGZ1bmN0aW9uIGRlY1RvRnJhY1BpU3RyKGRlYywgbWF4RGVub3JtKVxyXG5cdHtcclxuXHRcdHZhciBudW1QaSA9IDMuMTQ7XHJcblx0XHR2YXIgc3RyID0gUGk7XHJcblxyXG5cdFx0eEZyYWMgPSBkZWNUb0ZyYWMoZGVjLCBudW1QaSwgbWF4RGVub3JtKTtcclxuXHRcdGlmICh4RnJhYy51cHBlciA8IDApXHJcblx0XHRcdHN0ciA9IFwiLVwiICsgUGk7XHJcblxyXG5cdFx0aWYgKHhGcmFjLmxvd2VyICE9IHhGcmFjLnVwcGVyKVxyXG5cdFx0e1xyXG5cdFx0XHRpZiAoTWF0aC5hYnMoeEZyYWMudXBwZXIpID4gMSlcclxuXHRcdFx0XHRzdHIgPSB4RnJhYy51cHBlciArIFBpO1xyXG5cclxuXHRcdFx0aWYgKHhGcmFjLmxvd2VyID4gMSlcclxuXHRcdFx0XHRzdHIgKz0gJy8nICsgeEZyYWMubG93ZXI7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gc3RyO1xyXG5cdH1cclxuXHJcblx0LyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG5cdCBDb252ZXJ0IGEgZGVjaW1hbCBudW1iZXIgdG8gYSBmYWN0b3JlZCBmcmFjdGlvbiBudW1iZXIuXHJcblx0IElucHV0OlxyXG5cdFx0eERlYyAgICAgICAgLSB0aGUgZGVjaW1hbCBudW1iZXIgdG8gYmUgY29udmVydGVkLFxyXG5cdFx0Y29tRGVub3JtICAgLSBvcHRpb25hbFxyXG5cdFx0XHRcdFx0ICB0aGUgY29tbW9uIGRlbm9ybWl0b3IgdXNlZCBmb3IgZmFjdG9yaW5nLCBtb3N0IG9mdGVuIHRoaXMgPSBQaS5cclxuXHRcdFx0XHRcdCAgSWYganVzdCB3YW50IHRvIGNvbnZlcnQgYSBkZWNpbWFsIG51bWJlciB0byBmcmFjdGlvbiBudW1iZXIsXHJcblx0XHRcdFx0XHQgIG1ha2UgdGhpcyBlcXVhbCB0byAxLCB3aGljaCBpcyBkZWZhdWx0LlxyXG5cdFx0bWF4RGVub20gICAgLSBvcHRpb25hbFxyXG5cdFx0XHRcdFx0ICB0aGUgbWF4IGRlbm9ybWl0b3Igb2YgdGhlIGNvbnZlcnNpb24gcHJlY2lzaW9uLCBkZWZhdWx0IGlzIDE2XHJcblxyXG5cdCBSZXR1cm46XHJcblx0XHR4RnJhYy51cHBlciAtIHVwcGVyIHBhcnQgb2YgdGhlIGZhY3RvcmVkIGZyYWN0aW9uXHJcblx0XHR4RnJhYy5sb3dlciAtIGxvd2VyIHBhcnQgb2YgdGhlIGZhY3RvcmVkIGZyYWN0aW9uXHJcblxyXG5cdCBleGFtcGxlOiAgICAgICB4RGVjID0gMS41NzsgY29tRGVub3JtID0gMy4xNDsgbWF4RGVub3JtID0gODtcclxuXHRcdFx0XHRcdHJldHVybjogeEZyYWMudXBwZXIgPSAxOyB4RnJhYy5sb3dlciA9IDI7ICAgIChpLmUuIDEuNTcgPSAxLzIgUGkpXHJcblx0KioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xyXG5cdGZ1bmN0aW9uIGRlY1RvRnJhYyh4RGVjLCBjb21EZW5vcm0sIG1heERlbm9ybSlcclxuXHR7XHJcblx0XHR2YXIgeEZyYWMgPSB7fSwgZmFjdG9yID0gMSxcclxuXHRcdFx0aU1heERlbm9ybSA9IDE2LCBpQ29tRGVub3JtID0gMTtcclxuXHJcblx0XHRpZiAoY29tRGVub3JtKSBpQ29tRGVub3JtID0gY29tRGVub3JtO1xyXG5cdFx0aWYgKG1heERlbm9ybSkgaU1heERlbm9ybSA9IG1heERlbm9ybTtcclxuLypcclxuXHRcdGZvciAodmFyIGkgPSAxOyBpIDwgaU1heERlbm9ybTsgaSsrKVxyXG5cdFx0e1xyXG5cdFx0XHRmb3IgKHZhciBqPTE7IGo8PWk7IGorKylcclxuXHRcdFx0XHRpZiAoIChpICogeERlYykgJSAoaiAqIGNvbURlbm9ybSkgPT0gMCkgLy8gZm91bmQgZmFjdG9yXHJcblx0XHRcdFx0XHRyZXR1cm4gZmFjdG9yT3V0KGosIGkpO1xyXG5cdFx0fVxyXG4gKi9cclxuXHRcdC8vIHRoZSBtYXhEZW5vcm0gaXMgbm90IGVub3VnaCwgc28gd2Ugcm91bmQgaXQgdXA6XHJcblx0XHR4RnJhYy51cHBlciA9IE1hdGgucm91bmQoaU1heERlbm9ybSAqIHhEZWMgLyBjb21EZW5vcm0gKTtcclxuXHRcdHhGcmFjLmxvd2VyID0gaU1heERlbm9ybTtcclxuXHRcdGZhY3Rvck91dCh4RnJhYyk7XHJcblx0XHRyZXR1cm4geEZyYWM7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBmYWN0b3JPdXQoZnJhYykgLy91cHBlciwgbG93ZXIpXHJcblx0e1xyXG5cdFx0aWYgKGZyYWMudXBwZXIgPT09IDEpXHJcblx0XHRcdHJldHVybjtcclxuXHJcblx0XHRmb3IgKHZhciBpPTI7IGkgPD0gZnJhYy5sb3dlcjsgaSsrKVxyXG5cdFx0e1xyXG5cdFx0XHRpZiAoZnJhYy51cHBlciAlIGkgPT0gMCAmJiBmcmFjLmxvd2VyICUgaSA9PSAwKVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0ZnJhYy51cHBlciAvPSBpO1xyXG5cdFx0XHRcdGZyYWMubG93ZXIgLz0gaTtcclxuXHRcdFx0XHRmYWN0b3JPdXQoZnJhYyk7IC8vIHN0YXJ0IGFnYWluIHVudGlsIG5vIGxvbmdlciBjYW4gYmUgZmFjdG9yZWRcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcbi8qKioqKioqKioqKioqKioqKioqKioqKioqKiogcHVibGljIGludGVyZmFjZTogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xyXG5cclxuXHRmdW5jdGlvbiBncmlkTGdjUHRUb0NhbnZhc1B0KHhMZ2MsIHlMZ2MpXHJcblx0e1xyXG5cdFx0dmFyIHB0U2NybiA9IHt9O1xyXG5cdFx0cHRTY3JuLnggPSB4TGdjICogX3hHcmlkLnN0ZXBfcHggLyBfeEdyaWQuc3RlcF9sZ2MgKyBfeEdyaWQub3JpZ2luO1xyXG5cdFx0cHRTY3JuLnkgPSAteUxnYyAqIF95R3JpZC5zdGVwX3B4IC8gX3lHcmlkLnN0ZXBfbGdjICsgX3lHcmlkLm9yaWdpbjtcclxuXHJcblx0XHRyZXR1cm4gcHRTY3JuO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gZ3JpZFhMZ2NMZW5ndGhUb1B4KHJfbGdjKVxyXG5cdHtcclxuXHRcdHJldHVybiByX2xnYyAqIF94R3JpZC5zdGVwX3B4IC8gX3hHcmlkLnN0ZXBfbGdjO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gZ3JpZFlMZ2NMZW5ndGhUb1B4KHJfbGdjKVxyXG5cdHtcclxuXHRcdHJldHVybiByX2xnYyAqIF95R3JpZC5zdGVwX3B4IC8gX3lHcmlkLnN0ZXBfbGdjO1xyXG5cdH1cclxuXHJcblx0LyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcblx0IFRoZSBwb3NpdGlvbiBvZiB0aGUgbW91c2UgcG9pbnQgaXMgYWRqdXN0ZWQgYWNjb3JkaW5nIHRvIHRoZSByb3VuZCB1cFxyXG5cdCBsb2dpY2FsIHBvaW50LiBUaGlzIGlzIHRvIG1ha2UgaXQgZWFzaWVyIGZvciB0aGUgdXNlciB0byBjbGljayB0aGVcclxuXHQgcHJldmlvdXMgcG9pbnQgZGlzcGxheWVkIG9uIHRoZSBzY3JlZW4gc28gdGhlIHBvc2l0aW9uIGRvZXNuJ3QgaGF2ZSB0byBiZVxyXG5cdCBleGFjdC5cclxuXHQgSW5wdXQ6XHJcblx0XHRtc2VQdF9sZ2MgICAtIHgseSBwb3NpdGlvbiBvZiB0aGUgbW91c2UgaW4gbG9naWMgdW5pdFxyXG5cdFx0Y29sb3IgICAgICAgLSBjb2xvciBvZiB0aGUgbW91c2UgcG9pbnQsIGRhc2hsaW5lLCBsYWJlbFxyXG5cdFx0ZGlzcFBvc2l0aW9uIC0gaWYgeCx5IHBvc2l0aW9uIHNob3VsZCBiZSBkaXNwbGF5ZWRcclxuXHRcdGxhYmVsICAgICAgIC0gaWYgYSBzdHJpbmcgbGFibGUgc2hvdWxkIGJlIHByaW50ZWQgaW4gc3RlYWQgb2YgeCx5IHBvc2l0aW9uXHJcblx0KioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXHJcblx0ZnVuY3Rpb24gZ3JpZERyYXdNb3VzZUxnY1B0KG1zZVB0X2xnYywgY29sb3IsIGRpc3BQb3NpdGlvbiwgbGFiZWwpXHJcblx0e1xyXG5cdFx0dmFyIHJDaXJjbGUgPSAyOyAvL3BpeGVsc1xyXG5cdFx0dmFyIHlMYWJsZUNsZWFyYW5jZSA9IDE2OyAvLyBwaXhlbHNcclxuXHJcblx0XHRpZiAoIWNvbG9yKVxyXG5cdFx0XHRjb2xvciA9IHN0eWxlLnBvaW50Q29sb3I7XHJcblxyXG5cdFx0Ly8gc2V0IHRyYW5zZm9ybSBtYXRyaXggdG8gaWRlbnRpdHk6XHJcblx0XHRjdHguc2V0VHJhbnNmb3JtKDEsIDAsIDAsIDEsIDAsIDApO1xyXG5cclxuXHRcdHZhciBtc2VQdF9weCAgPSBncmlkTGdjUHRUb0NhbnZhc1B0KG1zZVB0X2xnYy54LCBtc2VQdF9sZ2MueSk7XHJcblx0XHR2YXIgeExhYmxlID0gbXNlUHRfcHgueCxcclxuXHRcdFx0eUxhYmxlID0gbXNlUHRfcHgueSAtIHJDaXJjbGUgKiAzO1xyXG5cclxuXHRcdC8vIGRyYXcgdGhlIGRvdDpcclxuXHRcdC8vY3R4LmJlZ2luUGF0aCgpO1xyXG5cdFx0Y3R4LmZpbGxTdHlsZSA9IGNvbG9yO1xyXG5cdFx0Y3R4LnN0cm9rZVN0eWxlID0gY29sb3I7XHJcblx0XHRjdHgudGV4dEFsaWduID0gXCJjZW50ZXJcIjtcclxuXHRcdGN0eC5iZWdpblBhdGgoKTtcclxuXHJcblx0XHRjdHguYXJjKG1zZVB0X3B4LngsIG1zZVB0X3B4LnksIHJDaXJjbGUsIDAsIE1hdGguUEkgKiAyLCBmYWxzZSk7XHJcblx0XHRjdHguc3Ryb2tlKCk7XHJcblx0XHRjdHguY2xvc2VQYXRoKCk7XHJcblx0XHRjdHguZmlsbCgpO1xyXG5cclxuXHRcdC8vIHByaW50IHRoZSBsb2dpY2FsIGNvb3JkaW5hdGVzOlxyXG5cdFx0dmFyIHB0ID0ge31cclxuXHRcdHB0LnggPSAobXNlUHRfbGdjLngpLnRvRml4ZWQoX3hHcmlkLmRlY2ltYWxQb2ludHMpO1xyXG5cdFx0cHQueSA9IChtc2VQdF9sZ2MueSkudG9GaXhlZChfeUdyaWQuZGVjaW1hbFBvaW50cyk7XHJcblxyXG5cdFx0dmFyIHhTdHIgPSBfeEdyaWQudG9TdHIocHQueCk7XHJcblx0XHRpZiAob3B0cy51c2VQaUxhYmVscylcclxuXHRcdFx0eFN0ciA9IGRlY1RvRnJhY1BpU3RyKHB0LngsIDgpO1xyXG5cclxuXHRcdGlmIChsYWJlbClcclxuXHRcdFx0bGFiZWwgPSBsYWJlbC50b1VwcGVyQ2FzZSgpO1xyXG5cdFx0ZWxzZVxyXG5cdFx0e1xyXG5cdFx0XHRpZiAoZGlzcFBvc2l0aW9uKVxyXG5cdFx0XHRcdGxhYmVsID0gJygnICsgeFN0ciArICcsICcgKyBfeEdyaWQudG9TdHIocHQueSkgKyAnKSc7XHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRyZXR1cm47IC8vIHdvcmsgaXMgZG9uZSBpZiBubyBsYWJlbFxyXG5cdFx0fVxyXG5cclxuXHRcdHZhciBtZXRyaWNzID0gY3R4Lm1lYXN1cmVUZXh0KGxhYmVsKTtcclxuXHRcdHZhciBoYWxmU3RyVyA9IG1ldHJpY3Mud2lkdGggLyAyO1xyXG5cclxuXHRcdC8vIGFkanVzdCBwb3NpdGlvbiBpZiB0aGUgZG90IGlzIG5lYXIgYSBib3JkZXI6XHJcblx0XHRpZiAobXNlUHRfcHgueCA+IHNlbGYuc2V0dGluZ3Mud2lkdGggLSBoYWxmU3RyVylcclxuXHRcdFx0Y3R4LnRleHRBbGlnbiA9IFwicmlnaHRcIjtcclxuXHRcdGlmIChtc2VQdF9weC54IDwgaGFsZlN0clcpXHJcblx0XHRcdGN0eC50ZXh0QWxpZ24gPSBcImxlZnRcIjtcclxuXHRcdGlmIChtc2VQdF9weC55IDwgeUxhYmxlQ2xlYXJhbmNlKVxyXG5cdFx0e1xyXG5cdFx0XHR5TGFibGUgPSBtc2VQdF9weC55ICsgeUxhYmxlQ2xlYXJhbmNlO1xyXG5cdFx0XHRpZiAoIWxhYmVsKSAvLyBsYWJlbCBkb2Vzbid0IG5lZWQgdG8gY29uc2lkZXIgbW91c2UgY3Vyc29yIGlzc3VlXHJcblx0XHRcdHtcclxuXHRcdFx0XHRpZiAobXNlUHRfcHgueCA+IHRoYXQudyAvIDIpXHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0Y3R4LnRleHRBbGlnbiA9IFwicmlnaHRcIjtcclxuXHRcdFx0XHRcdHhMYWJsZSAtPSA2OyAvLyBhdm9pZCB0aGUgc2xhbnRpbmcgZG93biBhcnJvdyBoYW5kbGVcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdGN0eC50ZXh0QWxpZ24gPSBcImxlZnRcIjtcclxuXHRcdFx0XHRcdHhMYWJsZSArPSAxMjsgLy8gYXZvaWQgdGhlIHNsYW50aW5nIGRvd24gYXJyb3cgaGFuZGxlXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0Y3R4LmZpbGxTdHlsZSA9IHN0eWxlLnBvaW50VGV4dENvbG9yO1xyXG5cdFx0Y3R4LmZpbGxUZXh0KGxhYmVsLCB4TGFibGUsIHlMYWJsZSk7XHJcblx0fVxyXG5cclxuXHQvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBDb3VudCB0aGUgZGlnaXRzIGluIGEgbnVtYmVyXHJcblx0Ly89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0ZnVuY3Rpb24gY291bnREaWdpdHMobnVtKVxyXG5cdHtcclxuXHRcdHZhciBkaWdpdHMgPSAwO1xyXG5cclxuXHRcdGlmIChudW0gPT0gMClcclxuXHRcdFx0cmV0dXJuIDE7XHJcblxyXG5cdFx0d2hpbGUgKG51bSA+IDApXHJcblx0XHR7XHJcblx0XHRcdGRpZ2l0cysrO1xyXG5cdFx0XHRudW0gPSBNYXRoLmZsb29yKG51bSAvIDEwKTtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gZGlnaXRzO1xyXG5cdH1cclxuXHJcbn0pOyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4vLyBQZXJmb3JtcyBNYXRoSmF4IGNvbnZlcnNpb25cclxuLy9cclxuLy8gSXQgd2FzIGZ1bGx5IGF1dG9tYXRpYywgYnV0IHRoYXQgd2FzIFRPTyBTTE9XLlxyXG4vLyBNYW51YWwgcmVxdWVzdHMgb2NjYXNpb25hbGx5IGZhaWxlZCBkdWUgdG8gZGlnZXN0IHVucHJlZGljdGFiaWxpdHkuXHJcbi8vIFRoaXMgbWV0aG9kIGlzIG1vc3RseSBhdXRvbWF0aWMsIGJ1dCBpdCBjYW4gb25seSBqYXggaXRlbXMgaW5zaWRlIG5nUmVwZWF0IGJsb2Nrcy5cclxuLy8gVGhhdCB3b3JrcyBmb3Igbm93LCBidXQgaW4gZ2VuZXJhbCBpcyBhIHBvb3IgbGltaXRhdGlvbi5cclxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbmFuZ3VsYXIubW9kdWxlKCdtYXRoSmF4JywgW10pXHJcblxyXG4uZGlyZWN0aXZlKCdtYXRoamF4JywgZnVuY3Rpb24oKSB7XHJcblxyXG5cdHJldHVybiB7XHJcblx0XHRyZXN0cmljdDogJ0EnLFxyXG5cdFx0bGluazogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XHJcblxyXG5cdFx0XHQvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHRcdFx0Ly8gRGlzcGxheSB0aGUgZWxlbWVudCBhZnRlciBKYXggY29udmVyc2lvbiBpcyBjb21wbGV0ZVxyXG5cdFx0XHQvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHRcdFx0ZnVuY3Rpb24gc2hvdygpXHJcblx0XHRcdHtcclxuXHRcdFx0XHRlbGVtZW50LmNzcygndmlzaWJpbGl0eScsICd2aXNpYmxlJyk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdFx0XHQvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHRcdFx0c2NvcGUuJG9uKCdqYXhJdCcsIGZ1bmN0aW9uICgpIHtcclxuXHJcblx0XHRcdFx0Ly8gSGlkZSB0aGUgZWxlbWVudCBkdXJpbmcgSmF4IGNvbnZlcnNpb25cclxuXHRcdFx0XHRlbGVtZW50LmNzcygndmlzaWJpbGl0eScsICdoaWRkZW4nKTtcclxuXHJcblx0XHRcdFx0Ly8gV2UgbmVlZCB0byB3YWl0IGZvciB0aGUgbmV4dCBkaWdlc3QgY3ljbGVcclxuXHRcdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0TWF0aEpheC5IdWIuUXVldWUoWydUeXBlc2V0JywgTWF0aEpheC5IdWIsIGVsZW1lbnRbMF0sIHNob3ddKTtcclxuXHRcdFx0XHR9LCAwKTtcclxuXHJcbiAgICAgICAgICAgIH0pO1xyXG5cdFx0fVxyXG5cdH07XHJcbn0pXHJcblxyXG4vLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuLy8gVGhpcyBtdXN0IGJlIGluY2x1ZGVkIGluIGFuIG5nUmVwZWF0IGJsb2NrIHRvIGNhdXNlXHJcbi8vIGpheGluZyB0byBvY2N1ci5cclxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbi5kaXJlY3RpdmUoJ21hdGhqYXhSZXBlYXQnLCBmdW5jdGlvbigpIHtcclxuXHJcblx0cmV0dXJuIHtcclxuXHRcdHJlc3RyaWN0OiAnQScsXHJcblxyXG5cdFx0bGluazogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XHJcblx0XHRcdGlmIChzY29wZS4kbGFzdClcclxuXHRcdFx0XHRzY29wZS4kZW1pdCgnamF4SXQnKTtcclxuXHRcdH1cclxuXHR9O1xyXG59KTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbi8vIFJlc2V0cyB0aGUgc2Nyb2xsIHBvc2l0aW9uIG9mIGFuIGVsZW1lbnQgb24gcmVxdWVzdC5cclxuLy9cclxuLy8gV2hlbiBzd2l0Y2hpbmcgdmlld3Mgb3IgYXBwbHlpbmcgZmlsdGVycy9kYXRhIGNoYW5nZXMgdG8gbmdSZXBlYXRzLCB0aGUgc2Nyb2xsIHBvc2l0aW9uXHJcbi8vIHdpbGwgc3RheSB0aGUgc2FtZSBieSBkZWZhdWx0LiBUaGF0IGlzIGFsbW9zdCBhbHdheXMgdW5kZXNpcmFibGUuXHJcbi8vXHJcbi8vIFRoaXMgc29sdXRpb24gY29tZXMgZnJvbTpcclxuLy8gICBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzI0MDQwOTg1L3Njcm9sbC10by10b3Atb2YtZGl2LWluLWFuZ3VsYXJqc1xyXG4vL1xyXG4vLyBNb2RpZmllZCB0byB1c2UgUHViU3ViIGluc3RlYWQgb2YgJHNjb3BlIGJyb2FkY2FzdHMuXHJcbi8vXHJcbi8vIFVTQUdFOlxyXG4vLyAgIFRlbXBsYXRlOiA8ZGl2IGlkPVwibXlMaXN0XCIgc2Nyb2xsLXRvLXRvcC13aGVuPVwiaXRlbXNfY2hhbmdlZFwiPlxyXG4vLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuYW5ndWxhci5tb2R1bGUoJ3VpLnNjcm9sbFRvVG9wV2hlbicsIFtdKVxyXG5cclxuLmRpcmVjdGl2ZSgnc2Nyb2xsVG9Ub3BXaGVuJywgZnVuY3Rpb24oUHViU3ViLCAkdGltZW91dCkge1xyXG5cclxuXHQvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHRmdW5jdGlvbiBsaW5rIChzY29wZSwgZWxlbWVudCwgYXR0cnMpXHJcblx0e1xyXG5cdFx0UHViU3ViLnN1YnNjcmliZShhdHRycy5zY3JvbGxUb1RvcFdoZW4sIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHQkdGltZW91dChmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRhbmd1bGFyLmVsZW1lbnQoZWxlbWVudClbMF0uc2Nyb2xsVG9wID0gMDtcclxuXHRcdFx0fSk7XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vIENvbmZpZ3VyYXRpb24gQmxvY2tcclxuXHQvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHRyZXR1cm4ge1xyXG5cdFx0cmVzdHJpY3Q6ICdBJyxcclxuXHRcdGxpbms6IGxpbmtcclxuXHR9XHJcbn0pOyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4vLyBTbGlkZS1vdXQgbWVudVxyXG4vLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuYW5ndWxhci5tb2R1bGUoJ3NsaWRlck1lbnUnLCBbXSlcclxuXHJcbi5kaXJlY3RpdmUoJ3NsaWRlck1lbnUnLCBmdW5jdGlvbigkZG9jdW1lbnQpIHtcclxuXHJcblx0dmFyIHNlbGY7XHJcblxyXG5cdC8vIEFueSBvZiB0aGVzZSBjYW4gYmUgb3ZlcnJpZGRlbiBieSB0aGUgdXNlciBvbiBjcmVhdGlvblxyXG5cdHZhciBkZWZhdWx0cyA9IHtcclxuXHRcdGJsdXJEZWxheTogNDAwLFx0XHQvLyBUaW1lIHVudGlsIGNsb3NlIHdoZW4gdGhlIG1vdXNlIGxlYXZlcyAoaW4gbXMpXHJcblx0XHRhdXRvQ2xvc2U6IDEyMDBcdFx0Ly8gVGltZSB1bnRpbCBjbG9zZSBpZiB0aGUgbW91c2UgbmV2ZXIgZW50ZXJzIChpbiBtcylcclxuXHR9O1xyXG5cclxuXHQvLy0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblx0dmFyIG1lbnVUZW1wbGF0ZVByZSA9XHJcblx0XHQnPGRpdiBpZD1cInNsaWRlcm1lbnVcIj4nICtcclxuXHRcdFx0JzxkaXY+JyArXHJcblx0XHRcdFx0JzxkaXYgaWQ9XCJzbV90b3BcIj48L2Rpdj4nICtcclxuXHRcdFx0XHQnPGRpdiBpZD1cInNtX3RvcF9yaWdodFwiPjwvZGl2PicgK1xyXG5cdFx0XHQnPC9kaXY+JyArXHJcblxyXG5cdFx0XHQnPGRpdiBpZD1cInNtX21haW5fYm9keVwiPicgK1xyXG5cdFx0XHRcdCc8ZGl2IGlkPVwic21fY2VudGVyXCI+JztcclxuXHJcblx0dmFyIG1lbnVUZW1wbGF0ZVBvc3QgPVxyXG5cdFx0XHRcdCc8L2Rpdj4nICtcclxuXHRcdFx0XHQnPGRpdiBpZD1cInNtX3JpZ2h0XCI+PC9kaXY+JyArXHJcblx0XHRcdCc8L2Rpdj4nICtcclxuXHJcblx0XHRcdCc8ZGl2PicgK1xyXG5cdFx0XHRcdCc8ZGl2IGlkPVwic21fYm90dG9tXCI+PC9kaXY+JyArXHJcblx0XHRcdFx0JzxkaXYgaWQ9XCJzbV9ib3R0b21fcmlnaHRcIj48L2Rpdj4nICtcclxuXHRcdFx0JzwvZGl2PicgK1xyXG5cdFx0JzwvZGl2Pic7XHJcblxyXG5cdC8vLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHR2YXIgbGluZVRlbXBsYXRlID1cclxuXHRcdCc8ZGl2IGlkPVwibWVudV9pdGVtX3t7aW5kZXh9fVwiIGNsYXNzPVwic2xpZGVyTWVudUxpbmVcIj4nICtcclxuXHRcdFx0JzxpbWcgc3JjPVwie3tpY29ufX1cIj4nICtcclxuXHRcdFx0JzxzcGFuPnt7dGV4dH19PC9zcGFuPicgK1xyXG5cdFx0JzwvZGl2Pic7XHJcblxyXG5cdC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vXHJcblx0Ly89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0ZnVuY3Rpb24gbGluayhzY29wZSwgZWxlbWVudCwgYXR0cnMpXHJcblx0e1xyXG5cdFx0c2VsZiA9IHNjb3BlO1xyXG5cclxuXHRcdHNjb3BlLnNldHRpbmdzID0gXy5leHRlbmQoe30sIGRlZmF1bHRzLCBzY29wZS5vcHRpb25zKTtcclxuXHJcblx0XHQvLyBJbml0IHZhcmlhYmxlc1xyXG5cdFx0c2NvcGUubWVudVN0YXRlID0gJ291dCc7XHJcblxyXG5cdFx0dmFyIGh0bWwgPSBtZW51Q3JlYXRlKHNjb3BlLm1vZGVsLml0ZW1zKTtcclxuXHRcdGVsZW1lbnQuaHRtbChodG1sKTtcclxuXHRcdHNjb3BlLm1lbnVFbCA9IGFuZ3VsYXIuZWxlbWVudChlbGVtZW50LmNoaWxkcmVuKClbMF0pO1xyXG5cclxuXHJcblx0XHQvLyBBdHRhY2ggYWxsIG9mIHRoZSBldmVudHMgKGxpbmUgY2xpY2ssIGJsdXIpXHJcblx0XHRzY29wZS4kd2F0Y2goJ21vZGVsLm9wZW5lZCcsIG1lbnVPcGVuKTtcclxuXHRcdGF0dGFjaEV2ZW50cyhzY29wZS5tb2RlbCk7XHJcblxyXG5cdFx0c2V0U2l6ZXMoZWxlbWVudCk7XHJcblx0XHRwb3NpdGlvbk1lbnUoc2NvcGUubWVudUVsKTtcclxuXHR9XHJcblxyXG5cdC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vXHJcblx0Ly89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0ZnVuY3Rpb24gbWVudUNyZWF0ZShpdGVtcylcclxuXHR7XHJcblx0XHR2YXIgaHRtbCA9IG1lbnVUZW1wbGF0ZVByZTtcclxuXHJcblx0XHRfLmVhY2goaXRlbXMsIGZ1bmN0aW9uKHZhbCwgaWR4KSB7XHJcblx0XHRcdGh0bWwgKz0gcmVzb2x2ZVRlbXBsYXRlKGxpbmVUZW1wbGF0ZSwge1xyXG5cdFx0XHRcdGljb246IHZhbC5pY29uLFxyXG5cdFx0XHRcdHRleHQ6IHZhbC50ZXh0LFxyXG5cdFx0XHRcdGluZGV4OiBpZHhcclxuXHRcdFx0fSk7XHJcblx0XHR9KTtcclxuXHJcblx0XHRodG1sICs9IG1lbnVUZW1wbGF0ZVBvc3Q7XHJcblxyXG5cdFx0cmV0dXJuIGh0bWw7XHJcblx0fVxyXG5cclxuXHQvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBPdXIgb3duIGxvdy10ZWNoIHRlbXBsYXRlIHN5c3RlbVxyXG5cdC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdGZ1bmN0aW9uIHJlc29sdmVUZW1wbGF0ZSh0ZW1wbGF0ZSwgdmFycylcclxuXHR7XHJcblx0XHR2YXIgZmluZFZhcnMgPSAvXFx7XFx7KFxcdyspXFx9XFx9L2c7XHJcblxyXG5cdFx0dmFyIHJlc29sdmVkID0gdGVtcGxhdGUucmVwbGFjZShmaW5kVmFycywgZnVuY3Rpb24oYWxsLCBwYXJhbSkge1xyXG5cdFx0XHRyZXR1cm4gdmFyc1twYXJhbV07XHJcblx0XHR9KTtcclxuXHJcblx0XHRyZXR1cm4gcmVzb2x2ZWQ7XHJcblx0fVxyXG5cclxuXHQvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBQcm9wZXJseSBzaXplIHRoZSBlZGdlcyB0byBtYXRjaCB0aGUgY29udGVudFxyXG5cdC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdGZ1bmN0aW9uIHNldFNpemVzKGVsKVxyXG5cdHtcclxuXHRcdHZhciBkb2MgPSAkZG9jdW1lbnRbMF07XHJcblxyXG5cdFx0dmFyIHRvcCA9IGFuZ3VsYXIuZWxlbWVudChkb2MuZ2V0RWxlbWVudEJ5SWQoJ3NtX3RvcCcpKTtcclxuXHRcdHZhciBib3R0b20gPSBhbmd1bGFyLmVsZW1lbnQoZG9jLmdldEVsZW1lbnRCeUlkKCdzbV9ib3R0b20nKSk7XHJcblx0XHR2YXIgcmlnaHQgPSBhbmd1bGFyLmVsZW1lbnQoZG9jLmdldEVsZW1lbnRCeUlkKCdzbV9yaWdodCcpKTtcclxuXHJcblx0XHR2YXIgY2VudGVyID0gZG9jLmdldEVsZW1lbnRCeUlkKCdzbV9jZW50ZXInKTtcclxuXHRcdHZhciB3ZCA9IGNlbnRlci5jbGllbnRXaWR0aDtcclxuXHRcdHZhciBodCA9IGNlbnRlci5jbGllbnRIZWlnaHQ7XHJcblxyXG5cdFx0dG9wLmNzcygnd2lkdGgnLCB3ZCArICdweCcpO1xyXG5cdFx0Ym90dG9tLmNzcygnd2lkdGgnLCB3ZCArICdweCcpO1xyXG5cdFx0cmlnaHQuY3NzKCdoZWlnaHQnLCBodCArICdweCcpO1xyXG5cdH1cclxuXHJcblx0Ly89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly8gUGxhY2UgdGhlIG1lbnUgb2ZmIHRoZSBsZWZ0IGVkZ2Ugb2YgdGhlIHNjcmVlblxyXG5cdC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdGZ1bmN0aW9uIHBvc2l0aW9uTWVudShlbClcclxuXHR7XHJcblx0XHR2YXIgYm9keSA9ICRkb2N1bWVudFswXS5nZXRFbGVtZW50QnlJZCgnc21fbWFpbl9ib2R5Jyk7XHJcblx0XHRzZWxmLmNsb3NlUG9zID0gLWJvZHkuY2xpZW50V2lkdGggKyAncHgnO1xyXG5cclxuLy9cdFx0ZWwuY3NzKCdsZWZ0Jywgc2VsZi5jbG9zZVBvcyk7XHJcblx0XHRlbC5jc3Moe1xyXG5cdFx0XHR0cmFuc2Zvcm06ICd0cmFuc2xhdGVYKCcgKyBzZWxmLmNsb3NlUG9zICsgJyknLFxyXG5cdFx0XHQnLXdlYmtpdC10cmFuc2Zvcm0nOiAndHJhbnNsYXRlWCgnICsgc2VsZi5jbG9zZVBvcyArICcpJyxcclxuXHRcdFx0Jy1tb3otdHJhbnNmb3JtJzogJ3RyYW5zbGF0ZVgoJyArIHNlbGYuY2xvc2VQb3MgKyAnKScsXHJcblx0XHRcdCctbXMtdHJhbnNmb3JtJzogJ3RyYW5zbGF0ZVgoJyArIHNlbGYuY2xvc2VQb3MgKyAnKScsXHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vIEF0dGFjaCBhbGwgb2YgdGhlIGV2ZW50cyAobGluZSBjbGljaywgYmx1cilcclxuXHQvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHRmdW5jdGlvbiBhdHRhY2hFdmVudHMoKVxyXG5cdHtcclxuXHRcdHNlbGYubWVudUVsLm9uKCdtb3VzZWVudGVyJywgbW91c2VFbnRlcik7XHJcblx0XHRzZWxmLm1lbnVFbC5vbignbW91c2VsZWF2ZScsIG1vdXNlTGVhdmUpO1xyXG5cclxuXHRcdHZhciBsaW5lcyA9IHNlbGYubWVudUVsWzBdLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3NsaWRlck1lbnVMaW5lJyk7XHJcblx0XHRhbmd1bGFyLmVsZW1lbnQobGluZXMpLm9uKCdjbGljaycsIGxpbmVDbGljayk7XHJcblx0fVxyXG5cclxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuLy8gQWN0aW9uc1xyXG4vLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuXHQvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBBIHJlcXVlc3QgdG8gYWN0aXZhdGUgdGhlIG1lbnUgaGFzIG9jY3VycmVkXHJcblx0Ly89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0ZnVuY3Rpb24gbWVudU9wZW4obmV3VmFsLCBvbGRWYWwsIHNjb3BlKVxyXG5cdHtcclxuXHRcdGlmIChuZXdWYWwgPT09IG9sZFZhbCB8fCAhbmV3VmFsKVxyXG5cdFx0XHRyZXR1cm47XHJcblxyXG4vL1x0XHRzY29wZS5tZW51RWwuY3NzKCdsZWZ0JywgMCk7XHJcblx0XHRzY29wZS5tZW51RWwuY3NzKHtcclxuXHRcdFx0dHJhbnNmb3JtOiAndHJhbnNsYXRlWCgwKScsXHJcblx0XHRcdCctd2Via2l0LXRyYW5zZm9ybSc6ICd0cmFuc2xhdGVYKDApJyxcclxuXHRcdFx0Jy1tb3otdHJhbnNmb3JtJzogJ3RyYW5zbGF0ZVgoMCknLFxyXG5cdFx0XHQnLW1zLXRyYW5zZm9ybSc6ICd0cmFuc2xhdGVYKDApJyxcclxuXHRcdH0pO1xyXG5cclxuXHRcdHNjb3BlLmF1dG9DbG9zZVRpbWVvdXQgPSBzZXRUaW1lb3V0KG1lbnVDbG9zZSwgc2NvcGUuc2V0dGluZ3MuYXV0b0Nsb3NlKTtcdC8vIENsb3NlIHVubGVzcyB0aGUgbW91c2UgZW50ZXJzIGluIHRpbWVcclxuXHR9XHJcblxyXG5cdC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vXHJcblx0Ly89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0ZnVuY3Rpb24gbWVudUNsb3NlKClcclxuXHR7XHJcbi8vXHRcdHNlbGYubWVudUVsLmNzcygnbGVmdCcsIHNlbGYuY2xvc2VQb3MpO1xyXG5cdFx0c2VsZi5tZW51RWwuY3NzKHtcclxuXHRcdFx0dHJhbnNmb3JtOiAndHJhbnNsYXRlWCgnICsgc2VsZi5jbG9zZVBvcyArICcpJyxcclxuXHRcdFx0Jy13ZWJraXQtdHJhbnNmb3JtJzogJ3RyYW5zbGF0ZVgoJyArIHNlbGYuY2xvc2VQb3MgKyAnKScsXHJcblx0XHRcdCctbW96LXRyYW5zZm9ybSc6ICd0cmFuc2xhdGVYKCcgKyBzZWxmLmNsb3NlUG9zICsgJyknLFxyXG5cdFx0XHQnLW1zLXRyYW5zZm9ybSc6ICd0cmFuc2xhdGVYKCcgKyBzZWxmLmNsb3NlUG9zICsgJyknLFxyXG5cdFx0fSk7XHJcblxyXG5cdFx0c2VsZi4kYXBwbHkoZnVuY3Rpb24oKSB7XHJcblx0XHRcdHNlbGYubW9kZWwub3BlbmVkID0gZmFsc2U7XHJcblx0XHR9KTtcclxuXHJcblx0XHRjbGVhclRpbWVvdXQoc2VsZi5hdXRvQ2xvc2VUaW1lb3V0KTtcclxuXHR9XHJcblxyXG5cdC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vIEhpZ2gtbGV2ZWwgYXV0by1jbG9zZSBzeXN0ZW1cclxuXHQvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHRmdW5jdGlvbiBzZXRBY3RpdmUoKVxyXG5cdHtcclxuXHRcdGNsZWFyVGltZW91dChzZWxmLmF1dG9DbG9zZVRpbWVvdXQpO1xyXG5cdH1cclxuXHJcblx0Ly89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly9cclxuXHQvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHRmdW5jdGlvbiBsaW5lQ2xpY2soZXYpXHJcblx0e1xyXG5cdFx0dmFyIGlkeCA9IC0xO1xyXG5cdFx0dmFyIG5vZGUgPSBldi5jdXJyZW50VGFyZ2V0O1xyXG5cdFx0d2hpbGUgKG5vZGUpIHtcclxuXHRcdFx0aWR4Kys7XHJcblx0XHRcdG5vZGUgPSBub2RlLnByZXZpb3VzU2libGluZztcclxuXHRcdH1cclxuXHJcblx0XHR2YXIgYWN0ID0gc2VsZi5tb2RlbC5pdGVtc1tpZHhdLmFjdDtcclxuXHRcdGFjdCAmJiBhY3QoKTtcclxuXHR9XHJcblxyXG4vLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4vLyBIb3ZlciBzeXN0ZW0gKHRoaXMgc2hvdWxkIGJlIGEgc2VwYXJhdGUgc2VsZiEpXHJcbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG5cdC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vIExvdy1sZXZlbCBtb3VzZWVudGVyIGhhbmRsZXJcclxuXHQvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHRmdW5jdGlvbiBtb3VzZUVudGVyKClcclxuXHR7XHJcblx0XHQvLyBEb24ndCBkbyB0aGlzIGlmIGl0J3MgYWxyZWFkeSBpblxyXG5cdFx0aWYgKHNlbGYubWVudVN0YXRlID09PSAnaW4nKVxyXG5cdFx0XHRyZXR1cm47XHJcblxyXG5cdFx0aWYgKHNlbGYubWVudVN0YXRlID09PSAnbGVhdmluZycpXHJcblx0XHR7XHJcblx0XHRcdGNsZWFyVGltZW91dChzZWxmLnRpbWVvdXQpO1xyXG5cdFx0XHRzZWxmLm1lbnVTdGF0ZSA9ICdpbic7XHJcblx0XHR9XHJcblx0XHRlbHNlIGlmIChzZWxmLm1lbnVTdGF0ZSA9PT0gJ291dCcpXHJcblx0XHRcdGRvRW50ZXIoKTtcdFx0Ly8gRWxpbWluYXRlZCB0aGUgZW50cnkgZGVsYXkuIE5vdCBuZWVkZWQgYnkgdGhpcyBzZWxmLlxyXG5cdH1cclxuXHJcblx0Ly89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly8gTG93LWxldmVsIG1vdXNlbGVhdmUgaGFuZGxlclxyXG5cdC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdGZ1bmN0aW9uIG1vdXNlTGVhdmUoKVxyXG5cdHtcclxuLy9cdFx0c2VsZi5ob3ZlckNvdW50LS07XHJcblxyXG5cdFx0Ly8gSWYgd2UncmUgYWxyZWFkeSBvdXQgc29tZWhvdywgZG9uJ3QgZG8gYW55dGhpbmdcclxuXHRcdGlmIChzZWxmLm1lbnVTdGF0ZSA9PT0gJ291dCcpXHJcblx0XHRcdHJldHVybjtcclxuXHJcblx0XHRpZiAoc2VsZi5tZW51U3RhdGUgPT09ICdpbicpXHJcblx0XHRcdGxlYXZpbmcoKTtcclxuXHR9XHJcblxyXG5cdC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vIFRyYW5zaXRpb25pbmcgZnJvbSBpbiB0byBvdXRcclxuXHQvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHRmdW5jdGlvbiBsZWF2aW5nKClcclxuXHR7XHJcblx0XHQvLyBBIGRlbGF5IGlzIHJlcXVlc3RlZC4gIFN0YXJ0IHRoZSB0aW1lb3V0LlxyXG5cdFx0c2VsZi50aW1lb3V0ID0gc2V0VGltZW91dChmdW5jdGlvbigpIHtkb0xlYXZlKCl9LCBzZWxmLnNldHRpbmdzLmJsdXJEZWxheSk7XHJcblx0XHRzZWxmLm1lbnVTdGF0ZSA9ICdsZWF2aW5nJztcclxuXHR9XHJcblxyXG5cdC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vXHJcblx0Ly89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0ZnVuY3Rpb24gZG9FbnRlcigpXHJcblx0e1xyXG5cdFx0c2VsZi5tZW51U3RhdGUgPSAnaW4nO1xyXG5cdFx0c2V0QWN0aXZlKCk7XHJcblx0fVxyXG5cclxuXHQvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvL1xyXG5cdC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdGZ1bmN0aW9uIGRvTGVhdmUoKVxyXG5cdHtcclxuXHRcdC8vIEl0J3MgcG9zc2libGUgdG8gYmUgaW4gbXVsdGlwbGUgd2lkZ2V0cyBhdCBvbmNlLiAgSXQncyBub3QgYSBcInJlYWxcIiBsZWF2ZSB1bnRpbFxyXG5cdFx0Ly8gd2UndmUgZXhpdGVkIGV2ZXJ5IHdpZGdldC5cclxuLy9cdFx0aWYgKHNlbGYuaG92ZXJDb3VudCA8PSAwKVxyXG5cdFx0e1xyXG5cdFx0XHRzZWxmLm1lbnVTdGF0ZSA9ICdvdXQnO1xyXG5cclxuXHRcdFx0bWVudUNsb3NlKCk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuLy8gRGlyZWN0aXZlIGNvbmZpZ3VyYXRpb25cclxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHRyZXR1cm4ge1xyXG5cdFx0cmVzdHJpY3Q6ICdFJyxcclxuXHRcdHNjb3BlOiB7XHJcblx0XHRcdG9wdGlvbnM6ICc9b3B0aW9ucycsXHJcblx0XHRcdG1vZGVsOiAnPW5nTW9kZWwnXHJcblx0XHR9LFxyXG5cclxuXHRcdGxpbms6IGxpbmtcclxuXHR9O1xyXG59KTtcclxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9