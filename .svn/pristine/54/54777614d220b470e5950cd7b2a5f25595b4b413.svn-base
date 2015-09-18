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
.controller('NavCtrl', function($scope, Problems, State, kbBootstrap, PubSub, $modal, hotkeys, $window, CloudSave) {

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

});
