'use strict';

//===========================================================================================
// Slide-out menu
//===========================================================================================
angular.module('sliderMenu', [])

.directive('sliderMenu', function($document) {

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
});
