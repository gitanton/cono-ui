'use strict';
/**
 * @ngdoc function
 * @name conojoApp.controller:ProjectActivityCtrl
 * @description
 * # ProjectActivityCtrl
 * Controller of the conojoApp
 */
angular.module('conojoApp')
    .controller('ProjectActivityCtrl', function ($scope, $http, $location, $routeParams, ENV) {
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
            $scope.memberEmail = '';
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

        function resultFormatState(state){
            var $state = $('<p>' + state.text + '<span class="glyphicon glyphicon-ok" aria-hidden="true"></span></p>');
            return $state;
        }

        $scope.openNewMeeting = function () {
            $scope.meetingMessage = '';
            $scope.meetingName = '';
            $scope.meetingDateTime = '';
            $scope.recipients = [];
            $(".js-example-basic-multiple").select2({
                templateResult: resultFormatState
            }).val('');
            $(".select2-selection__choice").remove();
            $('#newMeeting').modal('toggle');
        };

        $scope.showSelectMember = function (event) {
            $(event.target).parent().find('.newMeeting-group').show();
            $(document).on('click', function () {
                $(event.target).parent().find('.newMeeting-group').hide();
            });
            event.stopPropagation();
        };

        $('.newMeeting-group').on('click', function (event) {
            event.stopPropagation();
        });

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

        $scope.toBuild = function () {
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

        $scope.toScreen = function () {
            var url = '/project-screen/' + $scope.activeProjectUuid;
            $location.path(url);
        };

        $scope.toComment = function () {
            var url = '/project-comment/' + $scope.activeProjectUuid;
            $location.path(url);
        };

        $scope.openMessage = function () {
            var url = '/message/' + $scope.activeProjectUuid;
            $location.path(url);
        };
        $scope.toScreen = function(){
            var url = '/project-screen/'+$scope.activeProjectUuid;
            $location.path(url);
        };

        $scope.toComment = function(){
            var url = '/project-comment/'+$scope.activeProjectUuid;
            $location.path(url);
        };

        $scope.handleDrop = function() {

        };

        $scope.init();
});
