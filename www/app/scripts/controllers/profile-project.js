'use strict';

/**
 * @ngdoc function
 * @name conojoApp.controller:ProfileProjectCtrl
 * @description
 * # ProfileProjectCtrl
 * Controller of the conojoApp
 */
angular.module('conojoApp')
  .controller('ProfileProjectCtrl', function ($scope) {
     $scope.setHeight = function(){
        $scope.siderbarContainer = $(window).height() - 64;
        $scope.siderbarExpand = $(window).height() - 442;
        $scope.profileProjectsContent = $(window).height() - 250;
        
        $(".siderbar-closed-container").css('height',$scope.siderbarContainer);
        $(".siderbar-closed-container-expand").css('padding-top',$scope.siderbarExpand);
        $(".profileProject-content-projects").css('height',$scope.profileProjectsContent);
    };
  });
