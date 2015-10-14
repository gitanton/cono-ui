'use strict';

/**
 * @ngdoc function
 * @name conojoApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the conojoApp
 */
angular.module('conojoApp')
    .controller('MainCtrl', function ($scope, $http, $location, ENV, store, userService) {
        $scope.loginPadding = ($(window).height() - 536) / 2;
        $scope.rememberMe = store.get('rememberMe');
        $scope.formData = {
            username: store.get('username')
        };

        /**
         * Watch the remember me value and store it in local storage
         */
        $scope.$watch('rememberMe', function(newVal) {
            store.set('rememberMe', newVal);
        });

        $('.login-logo').css('padding-top', $scope.loginPadding);
        $('.login-link').css('padding-bottom', $scope.loginPadding);


        $scope.processForm = function () {
            userService.login($scope.formData.username, $scope.formData.password).then(function () {
                if($scope.rememberMe) {
                    store.set('username', $scope.formData.username);
                } else {
                    store.remove('username');
                }
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
