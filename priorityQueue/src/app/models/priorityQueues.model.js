'use strict';
var angular = require('angular');
var _ = require('lodash');
var moment = require('moment');

module.exports = angular.module('PriorityQueueModel', ['PatientModel'])
  .factory('PriorityQueueModel', function ($http, $q, $filter, MapGatewayApi, authService, PatientModel) {

    var ageInYears = function(input) {
      return Math.floor(moment.duration(moment().diff(moment(input))).asYears());
    }

    var femaleOrMale = function(input) {
      if (input === 'f') {
        return 'Female';
      } else if (input === 'm') {
        return 'Male';
      }
    }

    var list = function() {
      var deferred = $q.defer();
      $http({
          method: 'GET',
          url: MapGatewayApi+'/api/medwise/priorityQueues',
          headers: {
            Authorization: 'Bearer ' + authService.getToken()
          }
        })
        .then(function (response) {
          if (response.data.error) {
            deferred.resolve(response.data.error);
          } else {
            deferred.resolve(response.data);
          }
        }, function (error) {
          deferred.reject({ msg: 'Cannot connect to gateway api', error: error })
        });

      return deferred.promise;
    };

    var indexedProperties = {
        name: {
          label: 'Patient',
          display: true
        },
        org: {
          label: 'Org',
          display: true,
          filter: {
            options: function(userProfile) {
              return _.map(userProfile.organizations, function(organization) {
                return {
                  label: organization,
                  filter: {
                    statType: 'org',
                    queryType: 'term',
                    term: organization
                  }
                };
              });
            }
          }
        },
        dob: {
          label: 'Age',
          display: function(source) {
            return ageInYears(source.dob);
          },
          filter: {
            options: _.map([18, 36, 51, 61, 71, 81, 91], function(age, i, ages) {
              var label;
              var filter = {
                statType: 'dob',
                queryType: 'range',
                lte: 'now-' + age + 'y'
              };
              if (ages[i + 1]) {
                label = age + '-' + (ages[i + 1] - 1) + ' yrs',
                filter.gte = 'now-' + (ages[i + 1] - 1) + 'y'
              } else {
                label = age + '+ yrs'
              }
              return {
                label: label,
                filter: filter
              };
            })
          }
        },
        date: {
            label: 'Last Updated',
            display: function(source) {
              return $filter('date')(source.date, 'MMM d, y h:mma');
            },
            filter: {
              options: _.map([1, 2, 3, 4, 5], function(n) {
                var filter = {
                  statType: 'date',
                  queryType: 'range',
                  lte: 'now-' + (n - 1) + 'w'
                };
                if (n < 5) filter.gte = 'now-' + n + 'w';
                var label = (n === 5 ? '4+' : (n - 1) + ' - ' + n);
                label += ' week' + (n > 1 ? 's' : '') + ' ago';
                return {
                  filter: filter,
                  label: label
                };
              })
            }
          },
    }
  })