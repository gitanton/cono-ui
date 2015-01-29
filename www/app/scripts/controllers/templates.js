'use strict';

/**
 * @ngdoc function
 * @name conojoApp.controller:templatesCtrl
 * @description
 * # templatesCtrl
 * Controller of the conojoApp
 */
angular.module('conojoApp')
  .controller('templatesCtrl', function ($scope) {
     $scope.setHeight = function(){
        $scope.siderbarContainer = $(window).height() - 64;
        $scope.siderbarExpand = $(window).height() - 442;
        $scope.templatesContent = $(window).height() - 128;
        
        $(".siderbar-closed-container").css('height',$scope.siderbarContainer);
        $(".siderbar-closed-container-expand").css('padding-top',$scope.siderbarExpand);
        $(".templates-content").css('height',$scope.templatesContent);
    };
  });
