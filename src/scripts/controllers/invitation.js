'use strict';

/**
 * @ngdoc function
 * @name conojoApp.controller:InvitationCtrl
 * @description
 * # InvitationCtrl
 * Controller of the conojoApp
 */
angular.module('conojoApp')
    .controller('InvitationCtrl', function ($scope, $http, $location, $routeParams, ENV, NAV) {

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
        $scope.processLoginForm = function () {
            $http({
                url: ENV.API_ENDPOINT + 'users/login',
                method: 'POST',
                data: $.param({
                    invite_key: $routeParams.invite,
                    invite_type: $routeParams.type,
                    username: $scope.loginFormData.username,
                    password: $scope.loginFormData.password
                }),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then(function () {
                $location.path('project');
            }, function () {
                $('#loginNote').modal('toggle');
                $('.login-username').val('').focus();
                $('.login-password').val('');
            });
        };

        $scope.registerFormData = {};
        $scope.processRegisterForm = function () {
            $http({
                url: ENV.API_ENDPOINT + 'users',
                method: 'POST',
                data: $.param({
                    invite_key: $routeParams.invite,
                    invite_type: $routeParams.type,
                    fullname: $scope.registFormData.username,
                    email: $scope.registFormData.email,
                    timezone: $scope.timezone,
                    username: $scope.registFormData.username,
                    password: $scope.registFormData.password
                }),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then(function () {
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
