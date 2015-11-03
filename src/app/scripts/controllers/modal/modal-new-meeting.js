'use strict';

/**
 * @ngdoc function
 * @name conojoApp.controller:ModalAlertCtrl
 * @description
 * # ModalAlertCtrl
 * Controller of the conojoApp
 */
angular.module('conojoApp')
    .controller('ModalNewMeetingCtrl', function ($scope, projectUUID, projectMembers, meetingService, close) {
        $scope.saving = false;
        $scope.saved = false;
        $scope.alertSuccess = null;
        $scope.alertError = null;
        $scope.projectMembers = projectMembers;
        $scope.model = {};

        $scope.submit = function(isValid) {
            if (!isValid) {
                return false;
            }

            if($scope.model.date < new Date()) {
                $scope.alertError = '<i class="fa fa-close-circle"></i> You have picked a date for the meeting in the past. ' +
                    ' Please schedule the meeting for the future.';
                return false;
            }

            $scope.saving = true;
            $scope.alertSuccess = null;
            $scope.alertError = null;
            meetingService.add(projectUUID, $scope.model.notes, $scope.model.name, $scope.model.date, $scope.model.recipients).then(function() {
                $scope.saved = true;
                $scope.saving = false;
                $scope.alertSuccess = '<i class="fa fa-check-circle"></i> Your meeting has been scheduled successfully.';
            }, function(error) {
                $scope.saving = false;
                $scope.alertError = '<i class="fa fa-close-circle"></i> <strong>Meeting creation failed</strong>: '+error;
            });
        }
    });
