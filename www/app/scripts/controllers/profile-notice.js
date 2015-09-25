'use strict';

/**
 * @ngdoc function
 * @name conojoApp.controller:ProfileNoticeCtrl
 * @description
 * # ProfileNoticeCtrl
 * Controller of the conojoApp
 */
angular.module('conojoApp')
    .controller('ProfileNoticeCtrl', function ($scope, $http, $location, ENV) {
        $scope.profileNoticeContent = $(window).height() - 250;
        $('.profileNotice-content-notice').css('height', $scope.profileNoticeContent);

        $scope.init = function () {
            $http({
                url: ENV.API_ENDPOINT + 'users/notifications',
                method: 'GET',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then(function (response) {
                $scope.notification = response.data;
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

        $scope.updateSettings = function (index, setting) {
            if (index === 'general') {
                $scope.notification.notify_general = setting;
            } else if (index === 'promition') {
                $scope.notification.notify_promotions = setting;
            } else {
                $scope.notification.projects[index].notify = setting;
            }
            $http({
                url: ENV.API_ENDPOINT + 'users/notifications',
                method: 'POST',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                data: $.param({notifications: JSON.stringify($scope.notification)})
            });
        };

        $scope.init();
    });
