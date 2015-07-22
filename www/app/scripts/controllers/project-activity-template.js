'use strict';
/**
 * @ngdoc function
 * @name conojoApp.controller:ProjectActivityTemplateCtrl
 * @description
 * # ProjectActivityTemplateCtrl
 * Controller of the conojoApp
 */
angular.module('conojoApp')
    .controller('ProjectActivityTemplateCtrl', function ($scope, $http, $location, $window, $routeParams, ENV) {
        $scope.activeProjectUuid = $routeParams.uuid;
        $scope.projectActivityBody = $(window).height() - 176;
        $scope.projectActivityDeleteContainer = $(window).height() - 228;
        $('.projectActivity-content-body').css('height', $scope.projectActivityBody);
        $('.projectActivity-content-delete').css('height', $scope.projectActivityDeleteContainer);

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
                $scope.init();
                $('#addPeopleToProject').modal('hide');
            }).error(function(data){
                $('#addPeopleToProject').modal('hide');
                $('.reset-note').html(data.message);
                $('#statusNotice').modal('toggle');
            });
        };

        function resultFormatState(state){
            var $state = $('<p>' + state.text + '<span class="glyphicon glyphicon-ok" aria-hidden="true"></span></p>');
            return $state;
        }

        $scope.openNewMeeting = function () {
            $scope.meetingMessage = '';
            $scope.meetingName = '';
            $scope.recipients = [];
            $(".js-example-basic-multiple").select2({
                templateResult: resultFormatState
            }).val('');
            $(".select2-selection__choice").remove();
            $('#newMeeting').modal('toggle');
        };

        $scope.addNewMeeting = function () {
            $http({
                url: ENV.API_ENDPOINT + 'meetings',
                method: 'POST',
                data: $.param({
                    notes: $scope.meetingMessage,
                    project_uuid: $scope.activeProjectUuid,
                    name: $scope.meetingName,
                    date: $('.newMeeting-time').val().split(' ')[0],
                    time: $('.newMeeting-time').val().split(' ')[1],
                    attendees: $scope.recipients.join(',')
                }),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function () {
                $scope.init();
                $('#newMeeting').modal('hide');
            });
        };

        $('.newMeeting-time').datetimepicker({
            format: 'YYYY-MM-DD HH:mm',
            useCurrent: false
        });

        $scope.toBuild = function () {
            $http({
                url: ENV.API_ENDPOINT + 'screens/project/' + $scope.activeProjectUuid,
                method: 'GET',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function (data) {
                if(data.length > 0){
                    $location.path('/project-build-template/' + $scope.activeProjectUuid + '/' + data[0].uuid);
                }else{
                    $location.path('/project-templateSelect/' + $scope.activeProjectUuid);
                }
            });
        };

        $scope.toScreen = function () {
            var url = '/project-screen-template/' + $scope.activeProjectUuid;
            $location.path(url);
        };

        $scope.toComment = function () {
            var url = '/project-comment-template/' + $scope.activeProjectUuid;
            $location.path(url);
        };

        $scope.handleDrop = function () {

        };

        $scope.init();
    });