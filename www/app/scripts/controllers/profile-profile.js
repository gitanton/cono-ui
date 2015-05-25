'use strict';

/**
 * @ngdoc function
 * @name conojoApp.controller:ProfileProfileCtrl
 * @description
 * # ProfileProfileCtrl
 * Controller of the conojoApp
 */
angular.module('conojoApp')
    .controller('ProfileProfileCtrl', function ($scope, $location, currentUser) {
        $scope.profileProfileContent = $(window).height() - 250;
        $(".profileProfile-content-profile").css('height', $scope.profileProfileContent);

        $scope.toProject = function () {
            var url = '/profile-project/';
            $location.path(url);
        }

        $scope.toBilling = function () {
            var url = '/profile-billing/';
            $location.path(url);
        }

        $scope.toNotice = function () {
            var url = '/profile-notice/';
            $location.path(url);
        }
    });
