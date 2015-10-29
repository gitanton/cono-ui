'use strict';

/**
 * @ngdoc function
 * @name conojoApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the conojoApp
 */
angular.module('conojoApp')
    .controller('LoginCtrl', function ($rootScope, $scope, $http, $location, ENV, store, userService, ModalService) {
        $rootScope.bodyCls = 'gray';
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


        $scope.resetPassword = function(args, cls) {
            return ModalService.showModal({
                templateUrl: 'views/modal/reset-password.html',
                controller: 'ModalResetPasswordCtrl'
            }).then(function (modal) {
                modal.element.modal();
            });
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
