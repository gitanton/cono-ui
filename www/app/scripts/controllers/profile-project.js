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
        $scope.profileProjectsContent = $(window).height() - 250;
        $('.profileProject-content-projects').css('height', $scope.profileProjectsContent);
        $scope.projectInfo = [];

        $scope.init = function () {
            $http({
                url: ENV.API_ENDPOINT + 'projects',
                method: 'GET',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function (data) {
                var projectInfo = [];
                var projectName = [];
                var projectType = [];

                for(var i = 0;i < data.length; i++){
                    projectName.push(data[i].name);
                    projectType.push(data[i].type_id);
                    if(data[i].type_id === 1 || data[i].type_id === 3){
                        $http({
                            url: ENV.API_ENDPOINT + 'screens/project/' + data[i].uuid,
                            method: 'GET',
                            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                        }).success(function (screens) {
                            if(screens.length === 0){
                                projectInfo.push([projectName.pop(),projectType.pop(),'no screen']);
                            }else if(screens.length === 1){
                                projectInfo.push([projectName.pop(),projectType.pop(),'1 screen',screens]);
                            }else if(screens.length > 1){
                                projectInfo.push([projectName.pop(),projectType.pop(),screens.length +' screens',screens]);
                            }
                            $scope.projectInfo = projectInfo;
                        });
                    }else if(data[i].type_id === 2){
                        $http({
                            url: ENV.API_ENDPOINT + 'videos/project/' + data[i].uuid,
                            method: 'GET',
                            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                        }).success(function (videos) {
                            if(videos.length === 0){
                                projectInfo.push([projectName.pop(),projectType.pop(),'no video']);
                            }else if(videos.length === 1){
                                projectInfo.push([projectName.pop(),projectType.pop(),'1 video',videos]);
                            }else if(videos.length > 1){
                                projectInfo.push([projectName.pop(),projectType.pop(),videos.length +' videos',videos]);
                            }
                            $scope.projectInfo = projectInfo;
                        });
                    }
                }
            });
        };

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
