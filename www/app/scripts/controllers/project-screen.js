'use strict';
/**
 * @ngdoc function
 * @name conojoApp.controller:ProjectScreenCtrl
 * @description
 * # ProjectScreenCtrl
 * Controller of the conojoApp
 */
angular.module('conojoApp')
    .controller('ProjectScreenCtrl', function ($scope, $http, $location, $routeParams, ENV) {
        $scope.activeProjectUuid = $routeParams.uuid;
        $scope.projectScreenBody = $(window).height() - 176;
        $scope.projectScreenDropcontainer = $(window).height() - 212;
        $('.projectScreen-content-body').css('height', $scope.projectScreenBody);
        $('.projectScreen-content-dropcontainer').css('height', $scope.projectScreenDropcontainer);

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
            }).success(function () {
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
            }).success(function () {
                $('#addPeopleToProject').modal('hide');
            }).error(function(data){
                $('#addPeopleToProject').modal('hide');
                $('.reset-note').html(data.message);
                $('#statusNotice').modal('toggle');
            });
        };

        $scope.openNewMeeting = function () {
            $scope.meetingMessage = '';
            $scope.meetingName = '';
            $scope.meetingDateTime = '';
            $scope.recipients = '';
            $('#newMeeting').modal('toggle');
        };

        $scope.addNewMeeting = function () {
            $http({
                url: ENV.API_ENDPOINT + 'meetings',
                method: 'POST',
                data: $.param({notes: $scope.meetingMessage, project_uuid: $scope.activeProjectUuid, name: $scope.meetingName, date: $scope.meetingDateTime.split(' ')[0], time: $scope.meetingDateTime.split(' ')[1], attendees: $scope.recipients.join(',')}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function () {
                $scope.init();
                $('#newMeeting').modal('hide');
            }).error(function(data){
                $('#newMeeting').modal('hide');
                $('.reset-note').html(data.message);
                $('#statusNotice').modal('toggle');
            });
        };

        $('.newMeeting-time').datetimepicker({
            format: 'YYYY-MM-DD HH:mm',
            useCurrent: false
        });

        $scope.toBuildFirst = function () {
            $http({
                url: ENV.API_ENDPOINT + 'screens/project/' + $scope.activeProjectUuid,
                method: 'GET',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function (data) {
                if(data.length > 0){
                    $location.path('/project-build/' + $scope.activeProjectUuid + '/' + data[0].uuid);
                }else{
                    $location.path('/project-screenUpload/' + $scope.activeProjectUuid);
                }
            });
        };

        $scope.toBuild = function (suuid) {
            var url = '/project-build/' + $scope.activeProjectUuid + '/' + suuid;
            $location.path(url);
        };

        $scope.toActivity = function () {
            var url = '/project-activity/' + $scope.activeProjectUuid;
            $location.path(url);
        };

        $scope.toComment = function () {
            var url = '/project-comment/' + $scope.activeProjectUuid;
            $location.path(url);
        };

        $scope.init();
    });
