'use strict';
/**
 * @ngdoc function
 * @name conojoApp.controller:ProjectScreenUploadCtrl
 * @description
 * # ProjectScreenUploadCtrl
 * Controller of the conojoApp
 */
angular.module('conojoApp')
    .controller('ProjectScreenUploadCtrl', function ($rootScope, $scope, $http, $location, $routeParams, ENV, $log, ModalService, NAV) {
        $scope.activeProjectUuid = $routeParams.uuid;
        /**
         * Navigation
         */
        $scope.hasScreens = function () {
            return true;
        };
        $scope.hasVideos = function () {
            return false;
        };
        $scope.isScreen = function () {
            return true;
        };
        $scope.screenURL = '#/' + NAV.PROJECT_SCREEN + '/' + $scope.activeProjectUuid;
        $scope.buildURL = '#/' + NAV.PROJECT_BUILD + '/' + $scope.activeProjectUuid;
        $scope.activityURL = '#/' + NAV.PROJECT_ACTIVITY + '/' + $scope.activeProjectUuid;
        $scope.commentURL = '#/' + NAV.PROJECT_COMMENT + '/' + $scope.activeProjectUuid;

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
        };

        var screenUploadZone = new Dropzone('#screenUpload', {
            url: ENV.API_ENDPOINT + 'screens/project/' + $scope.activeProjectUuid,
            paramName: 'file', // The name that will be used to transfer the file
            maxFilesize: 10,
            withCredentials: true,
            clickable: true
        });

        screenUploadZone.on('success', function (file, serverCallBack) {
            var url = '/project-build/' + $scope.activeProjectUuid + '/' + serverCallBack.uuid;
            $location.path(url).replace();
            $scope.$apply();
        });

        screenUploadZone.on('error', function (file, error) {
            $rootScope.$broadcast('ui:error', {
                title: 'Upload Failed',
                content: error
            });
            $log.error({
                cls: 'project-videoUpload.js',
                msg: 'Video upload error',
                error: error
            });
        });


        $scope.openUpdateProject = function () {
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

        $scope.goBack = function () {
            var url = '/' + NAV.PROJECT;
            $location.path(url);
        };

        $scope.init();
    });
