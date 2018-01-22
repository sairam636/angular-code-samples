// app.js
var angular = require('angular');
window.Raven = require('raven-js'); //attach to window to be global
// auth0
require('angular-cookies');
require('angular-storage');
require('angular-route');
require('angular-ui-bootstrap');
require('angular-ui-mask');
require('ui-select');
require('ng-csv');

var common = require('@jrs/map-common');
var extensions = require('./extensions/extensions');

angular.module('app', [
  'ui.mask',
  'ui.bootstrap',
  'ui.select',
  'ngRoute',
  'ngSanitize',
  'ngCookies',
  'ngCsv',
  'angular-storage',
  'map-common',
  common.components,
  require('./components/components.js'),
  require('./pages/patientFormPage').name,
  require('./pages/patientProfile').name,
  require('./pages/dashboard').name,
  require('./pages/organizations').name,
  require('./pages/orgFormPage').name,
  require('./pages/priorityQueue').name,
  require('./pages/batchActionPage').name,
  require('angular-bootstrap-confirm')
])
.service('_', function () { return require('lodash'); })
.service('authService', common.authService)
.service('sidebarService', common.sidebarService)
.config(function ($routeProvider, $locationProvider, $provide, authProvider, environment, RavenDSN) {
  // force https connection
  if (environment !== 'local' && location.protocol !== 'https:') location.replace('https:' + location.href.slice(5))

  authProvider.setAppName('medwise-advisor');

  extensions(common.extendFn($provide));

  $routeProvider
    .when('/', {
      redirectTo: '/queues',
    })
    .when('/queues/new', {
      template: '<new-priority-queue></new-priority-queue>',
      template: '<priority-queue-form mode="\'new\'"></priority-queue-form>',
      title: 'New MWA Priority Queue'
    })
    .when('/queues/:id/edit', {
      template: '<priority-queue-form mode="\'edit\'"></priority-queue-form>',
      title: 'MWA Priority Queue'
    })
    .when('/queues/:id?', {
      template: '<priority-queue></priority-queue>',
      title: 'MWA Priority Queue'
    })
})
.run(function (auth, authService, $rootScope, $route) {
    authService.init();
    $rootScope.$on("$routeChangeSuccess", function(currentRoute, previousRoute){
      //Change page title, based on Route information
      $rootScope.title = $route.current.title;
    });
  });
  