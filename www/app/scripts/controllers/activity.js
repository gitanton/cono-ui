'use strict';

/**
 * @ngdoc function
 * @name conojoApp.controller:ActivityCtrl
 * @description
 * # ActivityCtrl
 * Controller of the conojoApp
 */
angular.module('conojoApp')
    .controller('ActivityCtrl', function ($scope, currentUser) {
        $scope.activityContent = $(window).height() - 128;
        $scope.activityDeleteContainer = $(window).height() - 180;
        $(".activity-content").css('height', $scope.activityContent);
        $(".activity-content-delete").css('height', $scope.activityDeleteContainer);

//        $('.activity-content').jScrollPane();
    });
