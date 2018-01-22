var _ = require('lodash');

module.exports = angular.module('priorityQueue', [
    'angular-storage',
    require('../../models/priorityQueues.model').name,
    require('../../components/priorityQueueSecondaryFilters').name,
    require('../../components/priorityQueueTable').name,
    require('../../components/printBuilder').name,
    require('../../components/reservePatientButton').name,
  ])
  .component ('priorityQueue', {
    template: require('./priorityQueue.html'),
    // @ngInject
    controller: function ($window, $location, $routeParams, authService, store, PriorityQueueModel) {
      var $ctrl = this;

      $ctrl.$onInit = function() {
        $ctrl.userProfile = authService.getUserProfile();

        // The default route will open the /queues location with no :id
        // It should go to the user's last viewed queue if available
        if ($routeParams.id) {
          $ctrl.selectedQueueId = _.toInteger($routeParams.id);
        } else {
          var priorityQueueId = store.get('priorityQueueId');
          if (priorityQueueId) {
            $window.location.href = '/queues/' + priorityQueueId;
            return;
          }
        }

        PriorityQueueModel.inflateIndexedProperties()
          .then(function(indexedProperties) {
             $ctrl.indexedProperties = indexedProperties;
          });

        PriorityQueueModel.list()
          .then(function(results) {
            $ctrl.allQueues = results;
            $ctrl.userDefinedQueues = _.filter(results, 'userId');
            $ctrl.roleQueueGroups = _.filter(results, {role: null, userId: null, organizationId: null});
            $ctrl.orgQueueGroups = _(results).filter('organizationId').groupBy('Organization.name').value();
            $ctrl.selectedQueue = _.find($ctrl.allQueues, {id: $ctrl.selectedQueueId});
            if ($ctrl.selectedQueue) {
              store.set('priorityQueueId', $ctrl.selectedQueueId);
              $ctrl.filters = _.cloneDeep($ctrl.selectedQueue.filters);
            } else if ($ctrl.selectedQueueId) {
              $ctrl.selectedQueueId = null;
              store.remove('priorityQueueId');
              $window.location.href = '/queues';
            }
            $ctrl.isPriorityQueueEditable = _.find($ctrl.userDefinedQueues, {id: $ctrl.selectedQueueId})
          })
      }

      $ctrl.handleFiltersUpdated = function(filters) {
        $ctrl.filters = filters;
      }

      $ctrl.onSelectedQueueChanged = function() {
        $location.path('/queues/' + $ctrl.selectedQueueId);
      }
    }
  });
