'use strict';

/**
 * @ngdoc function
 * @name conojoApp.controller:ProfileNoticeCtrl
 * @description
 * # ProfileNoticeCtrl
 * Controller of the conojoApp
 */
angular.module('conojoApp')
    .controller('ProfileNoticeCtrl', function ($scope, $http, $location, currentUser,ENV) {
        $scope.profileNoticeContent = $(window).height() - 250;
        $('.profileNotice-content-notice').css('height', $scope.profileNoticeContent);

        $scope.init = function () {
            $http({
                url: ENV.API_ENDPOINT + 'users/notifications',
                method: 'GET',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function (data) {
                $scope.notification = data;
            });
        };

        $scope.toProject = function () {
            var url = '/profile-project/';
            $location.path(url);
        };

        $scope.toProfile = function () {
            var url = '/profile-profile/';
            $location.path(url);
        };

        $scope.toBilling = function () {
            var url = '/profile-billing/';
            $location.path(url);
        };

        $scope.updateSettings = function(index,setting){
            if(index === 'general'){
                
            }else if(index === 'promition'){

            }else{
                
            }
        }

        $scope.init();
    });
