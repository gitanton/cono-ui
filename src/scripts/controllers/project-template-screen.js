'use strict';
/**
 * @ngdoc function
 * @name conojoApp.controller:ProjectScreenTemplateCtrl
 * @description
 * # ProjectScreenTemplateCtrl
 * Controller of the conojoApp
 */
angular.module('conojoApp')
    .controller('ProjectScreenTemplateCtrl', function ($rootScope, $scope, $http, $location, $routeParams, ENV, ModalService, NAV) {
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
        $scope.isScreen = function() {
            return true;
        };
        $scope.screenURL = '#/'+NAV.PROJECT_TEMPLATE_SCREEN+'/' + $scope.activeProjectUuid;
        $scope.buildURL = '#/'+NAV.PROJECT_TEMPLATE_BUILD+'/' + $scope.activeProjectUuid;
        $scope.activityURL = '#/'+NAV.PROJECT_TEMPLATE_ACTIVITY+'/' + $scope.activeProjectUuid;
        $scope.commentURL = '#/'+NAV.PROJECT_TEMPLATE_COMMENT+'/' + $scope.activeProjectUuid;

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
                url: ENV.API_ENDPOINT + 'screens/project/' + $scope.activeProjectUuid,
                method: 'GET',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then(function (response) {
                $scope.screens = response.data;
            });
        };

        //$("#screenupload").dropzone({
        //    url: ENV.API_ENDPOINT + 'screens/project/' + $scope.activeProjectUuid,
        //    paramName: "file", // The name that will be used to transfer the file
        //    maxFilesize: 5,
        //    clickable: false,
        //    init: function () {
        //        $(this).get(0).on('success', function () {
        //            $scope.init();
        //        });
        //    }
        //});

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

        $scope.toBuildFirst = function () {
            $http({
                url: ENV.API_ENDPOINT + 'screens/project/' + $scope.activeProjectUuid,
                method: 'GET',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then(function (response) {
                var data = response.data;
                if (data.length > 0) {
                    $location.path('/project-build-template/' + $scope.activeProjectUuid + '/' + data[0].uuid);
                } else {
                    $location.path('/project-templateSelect/' + $scope.activeProjectUuid);
                }
            });
        };

        $scope.toBuild = function (suuid) {
            var url = '/'+NAV.PROJECT_TEMPLATE_BUILD_SCREEN+'/' + $scope.activeProjectUuid + '/' + suuid;
            $location.path(url);
        };

        $scope.openMessage = function () {
            var url = '/message/' + $scope.activeProjectUuid;
            $location.path(url);
        };

        $scope.init();
    });
