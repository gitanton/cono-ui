'use strict';
/**
 * @ngdoc function
 * @name conojoApp.controller:ProjectActivityCtrl
 * @description
 * # ProjectActivityCtrl
 * Controller of the conojoApp
 */
angular.module('conojoApp')
    .controller('ProjectActivityCtrl', function ($rootScope, $scope, $http, $location, $routeParams, ENV, ModalService, NAV) {
        $scope.activeProjectUuid = $routeParams.uuid;
        /**
         * Navigation
         */
        $scope.hasScreens = function() {
            return true;
        };
        $scope.hasVideos = function() {
            return false;
        };
        $scope.isActivity = function() {
            return true;
        };
        $scope.screenURL = '#/'+NAV.PROJECT_SCREEN+'/' + $scope.activeProjectUuid;
        $scope.buildURL = '#/'+NAV.PROJECT_BUILD+'/' + $scope.activeProjectUuid;
        $scope.activityURL = '#/'+NAV.PROJECT_ACTIVITY+'/' + $scope.activeProjectUuid;
        $scope.commentURL = '#/'+NAV.PROJECT_COMMENT+'/' + $scope.activeProjectUuid;

        $scope.init = function () {
            $http({
                url: ENV.API_ENDPOINT + 'projects/project/' + $scope.activeProjectUuid,
                method: 'GET',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then(function (response) {
                var data = response.data;
                $scope.projectMembers = data.users;
                $scope.updateProjectTitle = data.name;
                $scope.updateProjectTypeid = data.type_id;
            });

            $http({
                url: ENV.API_ENDPOINT + 'activities/project/' + $scope.activeProjectUuid,
                method: 'GET',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then(function (response) {
                $scope.projectActivities = response.data;
            });
        };

        $scope.openUpdateProject = function () {
            $scope.memberEmail = '';
            $('#updateproject').modal('toggle');
        };

        $scope.updateMyProject = function (uuid) {
            $http({
                url: ENV.API_ENDPOINT + 'projects/project/' + uuid,
                method: 'PUT',
                data: {name: $scope.updateProjectTitle, type_id: $scope.updateProjectTypeid}
            }).then(function () {
                $scope.init();
                $('#updateproject').modal('hide');
            });
        };

        $scope.openAddProjectMember = function () {
            $scope.memberEmail = '';
            $('#addPeopleToProject').modal('toggle');
        };

        $scope.addProjectMember = function () {
            $http({
                url: ENV.API_ENDPOINT + 'projects/project/' + $scope.activeProjectUuid + '/invite',
                method: 'POST',
                data: $.param({uuid: $scope.activeProjectUuid, email: $scope.memberEmail}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then(function () {
                $scope.init();
                $('#addPeopleToProject').modal('hide');
            }, function (data) {
                $('#addPeopleToProject').modal('hide');
                $('.reset-note').html(data.message);
                $('#statusNotice').modal('toggle');
            });
        };

        /**
         * Open the modal to create a new meeting for the project
         * @returns Modal The modal that is created
         */
        $scope.openNewMeeting = function () {
            return ModalService.showModal({
                templateUrl: 'views/modal/new-meeting.html',
                controller: 'ModalNewMeetingCtrl',
                inputs: {
                    projectMembers: $scope.projectMembers,
                    projectUUID: $scope.activeProjectUuid
                }
            }).then(function (modal) {
                modal.element.modal();
            });
        };

        $scope.handleDrop = function () {

        };

        $scope.init();
    });
