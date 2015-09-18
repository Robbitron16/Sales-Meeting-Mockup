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
.service('State', function(PubSub) {

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

});
