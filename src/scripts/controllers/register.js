'use strict';

/**
 * @ngdoc function
 * @name conojoApp.controller:RegisterCtrl
 * @description
 * # RegisterCtrl
 * Controller of the conojoApp
 */
angular.module('conojoApp')
    .controller('RegisterCtrl', function ($rootScope, $scope, $http, $location, store, ENV, NAV) {
        $rootScope.bodyCls = 'gray';
        $scope.errorOne = false;
        $scope.errorTwo = false;
        $scope.errorThree = false;

        $scope.today = new Date();
        $scope.lastDay = $scope.today.setDate($scope.today.getDate() + 30);

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

        $scope.processForm = function (isValid) {
            if(!isValid) {
                return false;
            }

            $http({
                url: ENV.API_ENDPOINT + 'users',
                method: 'POST',
                data: $.param({
                    fullname: $scope.formData.username,
                    email: $scope.formData.email,
                    timezone: $scope.formData.timezone,
                    username: $scope.formData.username,
                    password: $scope.formData.password
                }),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then(function (response) {
                store.set('user', response.data);

                $location.path('project');
            }, function (dataMessage) {
                if (dataMessage.data.level === 1) {
                    $scope.errorOne = true;
                    $scope.errorTwo = false;
                    $scope.errorThree = false;
                    $('.register-email').val('').focus();
                } else if (dataMessage.data.level === 2) {
                    $scope.errorOne = false;
                    $scope.errorTwo = true;
                    $scope.errorThree = false;
                    $('.register-username').val('').focus();
                } else if (dataMessage.data.level === 3) {
                    $scope.errorOne = false;
                    $scope.errorTwo = false;
                    $scope.errorThree = true;
                    $('.register-username').val('').focus();
                    $('.register-email').val('');
                }
                $('#registerNote').modal('toggle');
            });
        };

        $scope.init();
    });
