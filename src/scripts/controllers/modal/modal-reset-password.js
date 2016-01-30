'use strict';

/**
 * @ngdoc function
 * @name conojoApp.controller:ModalAlertCtrl
 * @description
 * # ModalAlertCtrl
 * Controller of the conojoApp
 */
angular.module('conojoApp')
    .controller('ModalResetPasswordCtrl', function ($scope, userService, $log, close) {
        $scope.saving = false;
        $scope.saved = false;
        $scope.alertSuccess = null;
        $scope.alertError = null;
        $scope.model = {};

        $scope.submit = function(isValid) {
            if (!isValid) {
                return false;
            }
            $scope.saving = true;
            $scope.alertSuccess = null;
            $scope.alertError = null;
            userService.forgotPassword($scope.model.email).then(function() {
                $scope.saved = true;
                $scope.saving = false;
                $scope.alertSuccess = '<i class="fa fa-check-circle"></i> The email has been sent to you successfully.  Please check your email.';
            }, function(error) {
                $scope.saving = false;
                $scope.alertError = '<i class="fa fa-close-circle"></i> <strong>Password reset failed</strong>: '+' No Record Found in Database!';
            });
        }
    });
