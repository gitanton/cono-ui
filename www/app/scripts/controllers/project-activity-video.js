'use strict';
/**
 * @ngdoc function
 * @name conojoApp.controller:ProjectActivityVideoCtrl
 * @description
 * # ProjectActivityVideoCtrl
 * Controller of the conojoApp
 */
angular.module('conojoApp')
    .controller('ProjectActivityVideoCtrl', function ($scope, $http, $location, $routeParams, currentUser, ENV) {
        $scope.activeProjectUuid = $routeParams.uuid;
        $scope.projectActivityBody = $(window).height() - 176;
        $scope.projectActivityDeleteContainer = $(window).height() - 228;
        $(".projectActivity-content-body").css('height', $scope.projectActivityBody);
        $(".projectActivity-content-delete").css('height', $scope.projectActivityDeleteContainer);

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
                url: ENV.API_ENDPOINT + 'activities/project/' + $scope.activeProjectUuid,
                method: 'GET',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function (data) {
                    $scope.projectActivities = data;
                });
        };

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

        $scope.openNewMeeting = function () {
            $('#newMeeting').modal('toggle');
        };

        $scope.addNewMeeting = function () {
            $http({
                url: ENV.API_ENDPOINT + 'meetings',
                method: 'POST',
                data: $.param({notes: $scope.meetingMessage, project_uuid: $scope.activeProjectUuid, name: $scope.meetingName, date: $scope.meetingDateTime.split(" ")[0], time: $scope.meetingDateTime.split(" ")[1], attendees: $scope.meetingGroup}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function () {
                    $scope.init();
                    $('#newMeeting').modal('hide');
                });
        };

        $('.newMeeting-time').datetimepicker({
            dateFormat: "yy-mm-dd"
        });

        $scope.toVideo = function () {
            $http({
                url: ENV.API_ENDPOINT + 'videos/project/' + $scope.activeProjectUuid,
                method: 'GET',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function (data) {
                    if (data.length == 0) {
                        $location.path('/project-video/' + $scope.activeProjectUuid);
                    } else {
                        $location.path('/project-videoPlay/' + $scope.activeProjectUuid + '/' + data[0].uuid);
                    }
                });
        }

        $scope.toComment = function () {
            var url = '/project-comment-video/' + $scope.activeProjectUuid;
            $location.path(url);
        }

        $scope.handleDrop = function () {
            alert('Item has been dropped');
        }

        $scope.init();
    });