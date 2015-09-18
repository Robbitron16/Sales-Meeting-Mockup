'use strict';

//===========================================================================================
// Graded Problems
//===========================================================================================
angular.module('grades')

//=======================================================
//=======================================================
.service('Problems', function(kbBootstrap, PubSub, Comm, CloudSave) {

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

});
