'use strict';

/**
 * @ngdoc function
 * @name conojoApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the conojoApp
 */
angular.module('conojoApp')
    .controller('MainCtrl', function ($scope, $http, $location, ENV, $window, userService) {
        $scope.loginPadding = ($(window).height() - 536) / 2;

        $('.login-logo').css('padding-top', $scope.loginPadding);
        $('.login-link').css('padding-bottom', $scope.loginPadding);

        $scope.formData = {};
        $scope.processForm = function () {
            userService.login($scope.formData.username, $scope.formData.password).then(function (user) {
                $window.sessionStorage.currentUserUuid = user.uuid;

                if (user.avatar === null) {
                    $window.sessionStorage.avatar = '';
                } else {
                    $window.sessionStorage.avatar = user.avatar;
                }

                $window.sessionStorage.fullname = user.fullname;
                $window.sessionStorage.username = user.username;
                $window.sessionStorage.email = user.email;

                if (user.city === null) {
                    $window.sessionStorage.city = '';
                } else {
                    $window.sessionStorage.city = user.city;
                }

                if (user.state === null) {
                    $window.sessionStorage.state = '';
                } else {
                    $window.sessionStorage.state = user.state;
                }

                $window.sessionStorage.userCountry = user.country;
                $location.path('project');
            }, function () {
                $('#loginNote').modal('toggle');
                $('.login-username').val('').focus();
                $('.login-password').val('');
            });
        };

        $scope.openResetPassword = function () {
            $('#resetPassword').modal('toggle');
        };

        $scope.forgotPassword = function () {
            userService.forgotPassword($scope.resetEmail).then(function () {
                $('#resetPassword').modal('hide');
                $('#resetNote').modal('toggle');
            });
        };
    });
