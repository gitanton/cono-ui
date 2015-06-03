'use strict';
/**
 * @ngdoc function
 * @name conojoApp.controller:ProjectTemplateUploadCtrl
 * @description
 * # ProjectTemplateUploadCtrl
 * Controller of the conojoApp
 */
angular.module('conojoApp')
    .controller('ProjectTemplateUploadCtrl', function ($scope, $http, $location, $routeParams, currentUser, ENV) {
        $scope.activeProjectUuid = $routeParams.uuid;
        $scope.projectTemplateBody = $(window).height() - 176;
        $scope.projectScreenDropcontainer = $(window).height() - 212;
        $(".projectScreen-content-body").css('height', $scope.projectTemplateBody);
        $(".projectScreen-content-dropcontainer").css('height', $scope.projectScreenDropcontainer);

        $scope.init = function () {
            $http({
                url: ENV.API_ENDPOINT + 'projects/project/' + $scope.activeProjectUuid,
                method: 'GET',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function (data) {
                    $scope.projectMembers = data.users;
                    $scope.updateProjectTitle = data.name;
                    $scope.updateProjectTypeid = data.type_id;
                });

            $http({
                url: ENV.API_ENDPOINT + 'screens/project/' + $scope.activeProjectUuid,
                method: 'GET',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function (data) {
                    $scope.screens = data;
                });
        };

        //var templateUploadZone = new Dropzone("#templateupload", {
        //    url: ENV.API_ENDPOINT + 'videos/project/' + $scope.activeProjectUuid,
        //    paramName: "file", // The name that will be used to transfer the file
        //    maxFilesize: 10,
        //    clickable: false
        //});
        //
        //templateUploadZone.on("success", function (file, serverCallBack) {
        //    var url = '/project-screen-videoPlay/' + $scope.activeProjectUuid + '/' + serverCallBack.uuid;
        //    $location.path(url).replace();
        //    $scope.$apply();
        //});


        $scope.openUpdateProject = function () {
            $('#updateproject').modal('toggle');
        };

        $scope.updateMyProject = function (uuid) {
            $http({
                url: ENV.API_ENDPOINT + 'projects/project/' + uuid,
                method: 'PUT',
                data: {name: $scope.updateProjectTitle, type_id: $scope.updateProjectTypeid}
            }).success(function () {
                    $scope.init();
                    $('#updateproject').modal('hide');
                });
        };

        $scope.openAddProjectMember = function () {
            $('#addPeopleToProject').modal('toggle');
        };

        $scope.addProjectMember = function () {
            $http({
                url: ENV.API_ENDPOINT + 'projects/project/' + $scope.activeProjectUuid + '/invite',
                method: 'POST',
                data: $.param({uuid: $scope.activeProjectUuid, email: $scope.memberEmail}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function () {
                    $('#addPeopleToProject').modal('hide');
                });
        };

        $scope.openUploadScreen = function () {
            $('#addProjectScreen').modal('toggle');
        };

        $scope.addUploadScreen = function () {
            $http({
                url: ENV.API_ENDPOINT + 'screens/project/' + $scope.activeProjectUuid,
                method: 'POST',
                data: $.param({project_uuid: $scope.activeProjectUuid, url: $scope.screenUrl}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function () {
                    $scope.init();
                    $('#addProjectScreen').modal('hide');
                });
        };

        $scope.openNewMeeting = function () {
            $('#newMeeting').modal('toggle');
        };

        $scope.addNewMeeting = function () {
            $http({
                url: ENV.API_ENDPOINT + 'meetings',
                method: 'POST',
                data: $.param({notes: $scope.meetingMessage, project_uuid: $scope.activeProjectUuid, name: $scope.meetingName, date: $scope.meetingDateTime.split(" ")[0], time: $scope.meetingDateTime.split(" ")[1], attendees: $scope.meetingGroup.join(",")}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function () {
                    $scope.init();
                    $('#newMeeting').modal('hide');
                });
        };

        $('.newMeeting-time').datetimepicker({
            dateFormat: "yy-mm-dd"
        });

        $scope.showSelectMember = function (event) {
            $(event.target).parent().find(".newMeeting-group").show();
            $(document).on("click", function () {
                $(event.target).parent().find(".newMeeting-group").hide();
            });
            event.stopPropagation();
        }

        $(".newMeeting-group").on("click", function (event) {
            event.stopPropagation();
        });

        $scope.toActivity = function () {
            var url = '/project-activity-template/';
            $location.path(url);
        }

        $scope.toComment = function () {
            var url = '/project-comment-template/';
            $location.path(url);
        }

        $scope.init();
    });
