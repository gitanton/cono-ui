'use strict';
/**
 * @ngdoc function
 * @name conojoApp.controller:ProjectCommentVideoCtrl
 * @description
 * # ProjectCommentVideoCtrl
 * Controller of the conojoApp
 */
angular.module('conojoApp')
    .controller('ProjectCommentVideoCtrl', function ($scope, $http, $location, $routeParams, currentUser, ENV) {
        $scope.activeProjectUuid = $routeParams.uuid;
        $scope.projectCommentBody = $(window).height() - 242;
        $(".projectComment-content-body").css('height', $scope.projectCommentBody);

        $scope.init = function () {
            $http({
                url: ENV.API_ENDPOINT + 'projects/project/' + $scope.activeProjectUuid,
                method: 'GET',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function (data) {
                $scope.updateProjectTitle = data.name;
                $scope.updateProjectTypeid = data.type_id;
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

        $scope.toActivity = function () {
            var url = '/project-activity-video/' + $scope.activeProjectUuid;
            $location.path(url);
        }

        $scope.init();
    });
