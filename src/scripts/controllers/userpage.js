'use strict';

/**
 * @ngdoc function
 * @name conojoApp.controller:UserpageCtrl
 * @description
 * # UserpageCtrl
 * Controller of the conojoApp
 */
angular.module('conojoApp')
    .controller('UserPageCtrl', function ($scope, $http, $routeParams, ENV, NAV, userService, projectService, $rootScope) {
        $scope.userUUID = $routeParams.ouuid;

        $scope.init = function () {
            $http({
                url: ENV.API_ENDPOINT + 'projects',
                method: 'GET',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then(function (response) {
                $scope.projects = response.data;
            });

            userService.get($scope.userUUID).then(function (user) {
                $scope.user = user;
            });

            //this need to get the current team user's project
        };

        $scope.isOnProject = function (project) {
            var isOnProject = false;

            if(project.invited) {
                return false;
            }

            angular.forEach($scope.user.projects, function (userProject) {
                if (userProject.uuid === project.uuid) {
                    isOnProject = true;
                }
            });

            return isOnProject;
        };

        $scope.openAddTeamMember = function () {
            $('#addTeamMember').modal('toggle');
            $scope.activeTeamUuid = $routeParams.tuuid;
        };

        /**
         * Invite a user to a project
         * @param project_uuid
         */
        $scope.invite = function(project) {
            projectService.invite(project.uuid, $scope.user.uuid).then(function(invitation) {
                project.invited = true;
            }, function(error) {
                $rootScope.$broadcast('ui:error', {
                    title: 'Invitation Failed',
                    content: 'Inviting the user to the chosen project failed due to the following error: ' + error
                });
            });
        };

        $scope.addTeamMember = function () {
            $http({
                url: ENV.API_ENDPOINT + 'teams/team/' + $scope.activeTeamUuid + '/invite',
                method: 'POST',
                data: $.param({uuid: $scope.activeTeamUuid, email: $scope.teammemberemail}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then(function () {
                $('#addTeamMember').modal('hide');
            }, function(error) {
                $rootScope.$broadcast('ui:error', {
                    title: 'Add Team Member Failed',
                    content: 'Adding a team member failed with the following error: ' + error.data.error
                });
            });
        };

        $scope.init();
    });
