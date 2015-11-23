'use strict';

/**
 * @ngdoc function
 * @name conojoApp.controller:registerBillingCtrl
 * @description
 * # registerBillingCtrl
 * Controller of the conojoApp
 */
angular.module('conojoApp')
    .controller('registerBillingCtrl', function ($rootScope, $scope, $http, $location, ENV, NAV) {

        $scope.init = function () {
            $http({
                url: ENV.API_ENDPOINT + 'utils/timezones',
                method: 'GET',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then(function (response) {
                $scope.timezones = response.data;
            });
        };

        $scope.formData = {};

        $scope.processForm = function () {
            $http({
                url: ENV.API_ENDPOINT + 'users',
                method: 'POST',
                data: $.param({
                    fullname: $scope.formData.fullname,
                    email: $scope.formData.email,
                    timezone: $scope.timezone,
                    username: $scope.formData.fullname,
                    password: $scope.formData.password
                }),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then(function () {
                $location.path('/');
            });
        };

        $scope.init();
    });
