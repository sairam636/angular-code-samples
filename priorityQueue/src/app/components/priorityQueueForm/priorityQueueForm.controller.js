module.exports = function($routeParams, $window, _, authService, PriorityQueueModel) {
    var $ctrl = this;
  
    $ctrl.$onInit = function() {
      $ctrl.userProfile = authService.getUserProfile()
  
      if ($ctrl.mode === 'edit') {
        PriorityQueueModel.show($routeParams.id)
          .then(function(priorityQueue) {
             $ctrl.priorityQueue = priorityQueue[0]
          })
      } else {
        $ctrl.priorityQueue = {
          name: null,
          filters: [],
          secondaryFilters: {},
          displayColumns: {
            name: true,
            workflow_iteration: true,
            workflow: true,
            date: true,
            reserve_button: true
          },
          sorting: [{statType: 'date', order: 'asc'}]
        }
      }
      PriorityQueueModel.inflateIndexedProperties()
        .then(function(indexedProperties) {
           $ctrl.indexedProperties = indexedProperties
        })
    }
  
    $ctrl.saveFilter = function() {
      $ctrl.saving = true
  
      PriorityQueueModel.create($ctrl.priorityQueue)
        .then(function(priorityQueue){
          $window.location.href = '/queues/' + priorityQueue.id
        })
        .catch(function(err) {
          console.log(err)
          $ctrl.saving = false
        })
    }
  
    $ctrl.handleFiltersUpdated = function(filters) {
      $ctrl.priorityQueue = _.assign($ctrl.priorityQueue, {filters: filters})
    }
  
    $ctrl.handleSecondaryFiltersUpdated = function(secondaryFilters) {
      $ctrl.priorityQueue = _.assign($ctrl.priorityQueue, {secondaryFilters: secondaryFilters})
    }
  
    $ctrl.handleDisplayColumnsUpdated = function(displayColumns) {
      $ctrl.priorityQueue = _.assign($ctrl.priorityQueue, {displayColumns: displayColumns})
    }
  
    $ctrl.handleSortingUpdated = function(sorting) {
      $ctrl.priorityQueue = _.assign($ctrl.priorityQueue, {sorting: sorting})
    }
  };
  