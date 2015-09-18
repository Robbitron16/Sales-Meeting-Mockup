'use strict';

//===========================================================================================
// A Publish-Subscribe Event Manager
//
// Yanked from: https://gist.github.com/turtlemonvh/10686980/038e8b023f32b98325363513bf2a7245470eaf80
//===========================================================================================
angular.module('pubsub-service', [])

.factory('PubSub', function($rootScope) {

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
});
