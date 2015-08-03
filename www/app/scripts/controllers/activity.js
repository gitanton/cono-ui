'use strict';

/**
 * @ngdoc function
 * @name conojoApp.controller:ActivityCtrl
 * @description
 * # ActivityCtrl
 * Controller of the conojoApp
 */
angular.module('conojoApp')
    .controller('ActivityCtrl', function ($scope, $http, ENV) {
        $scope.activityContent = $(window).height() - 128;
        $scope.activityDeleteContainer = $(window).height() - 180;
        $('.activity-content').css('height', $scope.activityContent);
        $('.activity-content-delete').css('height', $scope.activityDeleteContainer);

        $scope.init = function(){
        	$http({
                url: ENV.API_ENDPOINT + 'activities/user',
                method: 'GET',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function (data) {
                $scope.projectActivities = data;
            });
        };

        $scope.init();
    });
