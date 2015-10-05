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
            userService.login($scope.formData.username, $scope.formData.password).then(function () {
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


        ////////////////////////////////////////////////////////////////////////////
        //
        // INITIALIZATION
        //
        ////////////////////////////////////////////////////////////////////////////
        if(userService.getUserUUID()) {
            $location.path('project');
        }
    });
