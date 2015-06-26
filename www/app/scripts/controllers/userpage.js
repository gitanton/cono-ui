'use strict';

/**
 * @ngdoc function
 * @name conojoApp.controller:UserpageCtrl
 * @description
 * # UserpageCtrl
 * Controller of the conojoApp
 */
angular.module('conojoApp')
    .controller('UserpageCtrl', function ($scope, $http, $routeParams, ENV) {
        $scope.userpageContent = $(window).height() - 128;
        $('.userpage-content').css('height', $scope.userpageContent);

        $scope.init = function () {
            $http({
                url: ENV.API_ENDPOINT + 'projects',
                method: 'GET',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function (data) {
                $scope.projects = data;
            });
        };

        $scope.openAddProjectMember = function (uuid) {
            $('#addPeopleToProject').modal('toggle');
            $scope.addToProjectUuid = uuid;
        };

        $scope.addProjectMember = function () {
            $http({
                url: ENV.API_ENDPOINT + 'projects/project/' + $scope.addToProjectUuid + '/invite',
                method: 'POST',
                data: $.param({uuid: $scope.addToProjectUuid, email: $scope.memberEmail}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function () {
                $('#addPeopleToProject').modal('hide');
            });
        };

        $scope.openAddTeamMember = function () {
            $('#addTeamMember').modal('toggle');
            $scope.activeTeamUuid = $routeParams.uuid;
        };

        $scope.addTeamMember = function () {
            $http({
                url: ENV.API_ENDPOINT + 'teams/team/' + $scope.activeTeamUuid + '/invite',
                method: 'POST',
                data: $.param({uuid: $scope.activeTeamUuid, email: $scope.teammemberemail}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function () {
                $('#addTeamMember').modal('hide');
            });
        };

        $scope.init();
    });