'use strict';
/**
 * @ngdoc function
 * @name conojoApp.controller:ProjectActivityCtrl
 * @description
 * # ProjectActivityCtrl
 * Controller of the conojoApp
 */
angular.module('conojoApp')
    .controller('ProjectActivityCtrl', function ($scope, $http, $location, $routeParams, currentUser, ENV) {
        $scope.activeProjectUuid = $routeParams.uuid;
        $scope.projectActivityBody = $(window).height() - 176;
        $scope.projectActivityDeleteContainer = $(window).height() - 228;
        $(".projectActivity-content-body").css('height', $scope.projectActivityBody);
        $(".projectActivity-content-delete").css('height', $scope.projectActivityDeleteContainer);

//    $('.projectActivity-content-body').jScrollPane();

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

        $scope.toScreen = function () {
            var url = '/project-screen/' + $scope.activeProjectUuid;
            $location.path(url);
        }

        $scope.toComment = function () {
            var url = '/project-comment/' + $scope.activeProjectUuid;
            $location.path(url);
        }

        $scope.openMessage = function () {
            var url = '/message/' + $scope.activeProjectUuid;
            $location.path(url);
        }
        $scope.toScreen = function(){
            var url = '/project-screen/'+$scope.activeProjectUuid;
            $location.path(url);
        }

        $scope.toComment = function(){
            var url = '/project-comment/'+$scope.activeProjectUuid;
            $location.path(url);
        }

        $scope.handleDrop = function() {
            alert('Item has been dropped');
        }

        $scope.init();
});
