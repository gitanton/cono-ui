'use strict';

/**
 * @ngdoc function
 * @name conojoApp.controller:ProfileProfileCtrl
 * @description
 * # ProfileProfileCtrl
 * Controller of the conojoApp
 */
angular.module('conojoApp')
  .controller('ProfileProfileCtrl', function ($scope) {
     $scope.setHeight = function(){
        $scope.siderbarContainer = $(window).height() - 64;
        $scope.siderbarExpand = $(window).height() - 442;
        $scope.profileProfileContent = $(window).height() - 250;
        
        $(".siderbar-closed-container").css('height',$scope.siderbarContainer);
        $(".siderbar-closed-container-expand").css('padding-top',$scope.siderbarExpand);
        $(".profileProfile-content-profile").css('height',$scope.profileProfileContent);
    };  
  });
