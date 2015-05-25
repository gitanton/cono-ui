'use strict';

/**
 * @ngdoc function
 * @name conojoApp.controller:registerBillingCtrl
 * @description
 * # registerBillingCtrl
 * Controller of the conojoApp
 */
angular.module('conojoApp')
    .controller('registerBillingCtrl', function ($scope, $http, $location, ENV) {
        $scope.loginPadding = ($(window).height() - 590) / 2;

        $(".register-container").css('padding-top', $scope.loginPadding);
        $(".register-container").css('padding-bottom', $scope.loginPadding);

        $scope.init = function () {
            $http({
                url: ENV.API_ENDPOINT + 'utils/timezones',
                method: 'GET',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function (data) {
                    $scope.timezones = data;
                });
        }

        $scope.formData = {};

        $scope.processForm = function () {
            $http({
                url: ENV.API_ENDPOINT + 'users',
                method: 'POST',
                data: $.param({fullname: $scope.formData.fullname, email: $scope.formData.email, timezone: $scope.timezone, username: $scope.formData.fullname, password: $scope.formData.password}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function () {
                    $location.path('/');
                });
        };

        $scope.init();
    });
