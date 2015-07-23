'use strict';
/**
 * @ngdoc function
 * @name conojoApp.controller:ProjectScreenUploadCtrl
 * @description
 * # ProjectScreenUploadCtrl
 * Controller of the conojoApp
 */
angular.module('conojoApp')
    .controller('ProjectScreenUploadCtrl', function ($scope, $http, $location, $routeParams, ENV) {
        $scope.activeProjectUuid = $routeParams.uuid;
        $scope.projectScreenVideoBody = $(window).height() - 176;
        $('.projectScreenVideo-content-body').css('height', $scope.projectScreenVideoBody);

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
        };

        var screenUploadZone = new Dropzone('#screenUpload', {
            url: ENV.API_ENDPOINT + 'screens/project/' + $scope.activeProjectUuid,
            paramName: 'file', // The name that will be used to transfer the file
            maxFilesize: 10,
            clickable: true,
            header:{'Cache-Control': null,'X-Requested-With': null}
        });

        screenUploadZone.on('success', function (file, serverCallBack) {
            var url = '/project-build/' + $scope.activeProjectUuid + '/' + serverCallBack.uuid;
            $location.path(url).replace();
            $scope.$apply();
        });


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

        $scope.goBack = function(){
            var url = '/project';
            $location.path(url);
        };

        $scope.init();
    });
