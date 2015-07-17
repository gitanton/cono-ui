'use strict';

/**
 * @ngdoc function
 * @name conojoApp.controller:InvitationCtrl
 * @description
 * # InvitationCtrl
 * Controller of the conojoApp
 */
angular.module('conojoApp')
    .controller('InvitationCtrl', function ($scope, $http, $location, $routeParams, ENV) {
        $scope.inviteMarginTop = ($(window).height() - 610) / 2;

        $('.invitation-container').css('height', $(window).height());
        $('.invitation-container').css('padding-top', $scope.inviteMarginTop);
        $('.invitation-container').css('padding-bottom', $scope.inviteMarginTop);

        $scope.init = function () {
            $http({
                url: ENV.API_ENDPOINT + 'utils/timezones',
                method: 'GET',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function (data) {
                $scope.timezones = data;
            });
        };

        $scope.formData = {};
        $scope.processLoginForm = function () {
            $http({
                url: ENV.API_ENDPOINT + 'users/login',
                method: 'POST',
                data: $.param({invite_key: $routeParams.invite, invite_type: $routeParams.type, username: $scope.loginFormData.username, password: $scope.loginFormData.password}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function () {
                $location.path('project');
            }).error(function(){
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
                data: $.param({invite_key: $routeParams.invite, invite_type: $routeParams.type, fullname: $scope.registFormData.username, email: $scope.registFormData.email, timezone: $scope.timezone, username: $scope.registFormData.username, password: $scope.registFormData.password}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function () {
                $location.path('project');
            }).error(function (dataMessage) {
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
