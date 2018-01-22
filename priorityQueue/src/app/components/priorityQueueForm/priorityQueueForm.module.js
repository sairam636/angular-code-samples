'use strict';
var angular = require('angular');

module.exports = angular.module('priorityQueueForm', [
    require('../priorityQueueFilters').name,
    require('../priorityQueueSecondaryFilterSelection').name,
    require('../priorityQueueDisplayColumns').name,
    require('../priorityQueueSorting').name,
  ])
  .component('priorityQueueForm', require('./priorityQueueForm.component'));
