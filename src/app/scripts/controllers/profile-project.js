'use strict';

/**
 * @ngdoc function
 * @name conojoApp.controller:ProfileProjectCtrl
 * @description
 * # ProfileProjectCtrl
 * Controller of the conojoApp
 */
angular.module('conojoApp')
    .controller('ProfileProjectCtrl', function ($scope, $http, $location, ENV) {
        $scope.projects = [];
        var projectInfo = [];

        $scope.init = function () {
            $http({
                url: ENV.API_ENDPOINT + 'projects',
                method: 'GET',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then(function (response) {
                var data = response.data;
                $scope.projects = data;

                getProjectInfo(data, 0);
            });
        };

        function getProjectInfo(data, i) {
            projectInfo[i] = new Array(data[i].name, data[i].type_id, '', []);
            if (data[i].type_id === 1 || data[i].type_id === 3) {
                $http({
                    url: ENV.API_ENDPOINT + 'screens/project/' + data[i].uuid,
                    method: 'GET',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                }).then(function (screens) {
                    if (screens.length === 0) {
                        projectInfo[i][2] = 'no screen';
                        projectInfo[i][3] = [];
                    } else if (screens.length === 1) {
                        projectInfo[i][2] = '1 screen';
                        projectInfo[i][3] = screens;
                    } else if (screens.length > 1) {
                        projectInfo[i][2] = screens.length + ' screens';
                        projectInfo[i][3] = screens;
                    }
                    if ((i + 1) < data.length) {
                        getProjectInfo(data, i + 1);
                    }
                });
            } else if (data[i].type_id === 2) {
                $http({
                    url: ENV.API_ENDPOINT + 'videos/project/' + data[i].uuid,
                    method: 'GET',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                }).then(function (videos) {
                    if (videos.length === 0) {
                        projectInfo[i][2] = 'no video';
                        projectInfo[i][3] = [];
                    } else if (videos.length === 1) {
                        projectInfo[i][2] = '1 video';
                        projectInfo[i][3] = videos;
                    } else if (videos.length > 1) {
                        projectInfo[i][2] = videos.length + ' videos';
                        projectInfo[i][3] = videos;
                    }
                    if ((i + 1) < data.length) {
                        getProjectInfo(data, i + 1);
                    }
                });
            }
            $scope.projectInfo = projectInfo;
        }

        $scope.toProfile = function () {
            var url = '/profile-profile/';
            $location.path(url);
        };

        $scope.toBilling = function () {
            var url = '/profile-billing/';
            $location.path(url);
        };

        $scope.toNotice = function () {
            var url = '/profile-notice/';
            $location.path(url);
        };

        $scope.init();
    });
