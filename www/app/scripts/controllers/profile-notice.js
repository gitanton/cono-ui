'use strict';

/**
 * @ngdoc function
 * @name conojoApp.controller:ProfileNoticeCtrl
 * @description
 * # ProfileNoticeCtrl
 * Controller of the conojoApp
 */
angular.module('conojoApp')
  .controller('ProfileNoticeCtrl', function ($scope) {
     $scope.setHeight = function(){
        $scope.siderbarContainer = $(window).height() - 64;
        $scope.siderbarExpand = $(window).height() - 442;
        $scope.profileProjectContent = $(window).height() - 128;
        
        $(".siderbar-closed-container").css('height',$scope.siderbarContainer);
        $(".siderbar-closed-container-expand").css('padding-top',$scope.siderbarExpand);
        $(".profileProject-content").css('height',$scope.profileProjectContent);
    };
  });
