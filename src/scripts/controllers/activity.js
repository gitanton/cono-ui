'use strict';

/**
 * @ngdoc function
 * @name conojoApp.controller:ActivityCtrl
 * @description
 * # ActivityCtrl
 * Controller of the conojoApp
 */
angular.module('conojoApp')
    .controller('ActivityCtrl', function ($scope, $http, ENV, NAV) {

        $scope.init = function () {
            $http({
                url: ENV.API_ENDPOINT + 'activities/user',
                method: 'GET',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then(function (response) {
                $scope.projectActivities = response.data;
            });
        };

        $scope.init();
    });
