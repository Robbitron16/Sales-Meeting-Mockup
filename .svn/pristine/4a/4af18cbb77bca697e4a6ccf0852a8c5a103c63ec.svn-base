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
.service('CloudSave', function(PubSub) {

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
});
