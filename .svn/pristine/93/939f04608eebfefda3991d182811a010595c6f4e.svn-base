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
.config(function($routeProvider, $locationProvider) {

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
})

//=======================================================
// Disable sanitization. We'll take care of it on the back end
//=======================================================
.config(function($sceProvider) {
    $sceProvider.enabled(false);
})

//=======================================================
//=======================================================
.config(function($httpProvider) {
	$httpProvider.defaults.withCredentials = true;
})

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