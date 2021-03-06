'use strict';

/**
 * @ngdoc function
 * @name conojoApp.controller:ModalAlertCtrl
 * @description
 * # ModalAlertCtrl
 * Controller of the conojoApp
 */
angular.module('conojoApp')
    .controller('ModalChangePasswordCtrl', function ($scope, user, userService, close) {
        $scope.saving = false;
        $scope.saved = false;
        $scope.alertSuccess = null;
        $scope.alertError = null;
        $scope.user = user;
        $scope.model = {};

        $scope.submit = function(isValid) {
            if (!isValid) {
                return false;
            }
            $scope.saving = true;
            $scope.alertSuccess = null;
            $scope.alertError = null;
            userService.changePassword($scope.user, $scope.model.current, $scope.model.password).then(function() {
                $scope.saved = true;
                $scope.saving = false;
                $scope.alertSuccess = '<i class="fa fa-check-circle"></i> Your password has been updated successfully.';
            }, function(error) {
                $scope.saving = false;
                $scope.alertError = '<i class="fa fa-close-circle"></i> <strong>Profile update failed</strong>: '+error;
            });
        }
    });
