'use strict';

//===========================================================================================
//===========================================================================================
angular.module('grades')

.controller('GraphCtrl', function($location, $routeParams, $scope, PubSub) {

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

});
