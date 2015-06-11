'use strict';

/**
 * @ngdoc function
 * @name conojoApp.controller:ProfileProjectCtrl
 * @description
 * # ProfileProjectCtrl
 * Controller of the conojoApp
 */
angular.module('conojoApp')
    .controller('ProfileProjectCtrl', function ($scope, $http, $location, currentUser, ENV) {
        $scope.profileProjectsContent = $(window).height() - 250;
        $('.profileProject-content-projects').css('height', $scope.profileProjectsContent);

        $scope.init = function () {
            $http({
                url: ENV.API_ENDPOINT + 'projects',
                method: 'GET',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function (data) {
                $scope.projects = data;
                for(var i = 0;i < data.length; i++){
                    if(data[i].type_id === 1 || data[i].type_id === 3){
                        $http({
                            url: ENV.API_ENDPOINT + 'screens/project/' + data[i].uuid,
                            method: 'GET',
                            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                        }).success(function (data) {
                            // $scope.projects[i]['infoNum'] = data.length + ' screens';
                            // $scope.projects[i]['info'] = data;
                            // console.log($scope.projects[i]);
                        });
                    }else if(data[i].type_id === 2){
                        $http({
                            url: ENV.API_ENDPOINT + 'videos/project/' + data[i].uuid,
                            method: 'GET',
                            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                        }).success(function (data) {
                            // $scope.projects[i]['infoNum'] = data.length + ' videos';
                            // $scope.projects[i]['info'] = data;
                            // console.log($scope.projects[i]);
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
