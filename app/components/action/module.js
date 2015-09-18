'use strict';

//===========================================================================================
// Maintains an ordered list of actions that take place on a model. This allows
// persistence (saving) and undo, and possibly more.
//===========================================================================================
angular.module('action-service', ['pubsub-service']);
