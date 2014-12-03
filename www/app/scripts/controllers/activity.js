'use strict';

/**
 * @ngdoc function
 * @name conojoApp.controller:ActivityCtrl
 * @description
 * # ActivityCtrl
 * Controller of the conojoApp
 */
angular.module('conojoApp')
  .controller('ActivityCtrl', function ($scope) {
    $scope.setHeight = function(){
        $scope.siderbarContainer = $(window).height() - 64;
        $scope.siderbarExpand = $(window).height() - 442;
        $scope.activityContent = $(window).height() - 128;
        
        $(".siderbar-closed-container").css('height',$scope.siderbarContainer);
        $(".siderbar-closed-container-expand").css('padding-top',$scope.siderbarExpand);
        $(".activity-content").css('height',$scope.activityContent);
    };
  });
