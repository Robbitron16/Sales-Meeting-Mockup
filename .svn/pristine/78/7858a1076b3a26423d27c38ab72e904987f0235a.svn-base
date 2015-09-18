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
.service('Comm', function($http) {

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

});
