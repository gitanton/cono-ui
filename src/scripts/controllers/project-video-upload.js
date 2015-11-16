'use strict';
/**
 * @ngdoc function
 * @name conojoApp.controller:ProjectVideoUploadCtrl
 * @description
 * # ProjectVideoUploadCtrl
 * Controller of the conojoApp
 */
angular.module('conojoApp')
    .controller('ProjectVideoUploadCtrl', function ($scope, $http, $location, $routeParams, ENV, $log, $rootScope, ModalService, NAV) {
        $scope.activeProjectUuid = $routeParams.uuid;

        /**
         * Navigation
         */
        $scope.hasScreens = function() {
            return false;
        };
        $scope.hasVideos = function() {
            return true;
        };
        $scope.isBuild = function() {
            return true;
        };
        $scope.videoURL = '#/'+NAV.PROJECT_VIDEO+'/' + $scope.activeProjectUuid;
        $scope.buildURL = '#/'+NAV.PROJECT_VIDEO_PLAY+'/' + $scope.activeProjectUuid;
        $scope.activityURL = '#/'+NAV.PROJECT_VIDEO_ACTIVITY+'/' + $scope.activeProjectUuid;
        $scope.commentURL = '#/'+NAV.PROJECT_VIDEO_COMMENT+'/' + $scope.activeProjectUuid;

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

        var videoUploadZone = new Dropzone('#videoUpload', {
            url: ENV.API_ENDPOINT + 'videos/project/' + $scope.activeProjectUuid,
            paramName: 'file', // The name that will be used to transfer the file
            maxFilesize: 10,
            withCredentials: true,
            clickable: true
        });

        videoUploadZone.on('success', function (file, serverCallBack) {
            var url = '/project-videoPlay/' + $scope.activeProjectUuid + '/' + serverCallBack.uuid;
            $location.path(url).replace();
            $scope.$apply();
        });

        videoUploadZone.on('error', function (file, error) {
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
                $scope.init();
                $('#addPeopleToProject').modal('hide');
            }, function (error) {
                $('#addPeopleToProject').modal('hide');
                $('.reset-note').html(error.data.message);
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
