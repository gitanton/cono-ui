'use strict';

/**
 * @ngdoc function
 * @name conojoApp.controller:ProfileNoticeCtrl
 * @description
 * # ProfileNoticeCtrl
 * Controller of the conojoApp
 */
angular.module('conojoApp')
  .controller('ProfileNoticeCtrl', function ($scope,$location) {
     $scope.setHeight = function(){
        $scope.siderbarContainer = $(window).height() - 64;
        $scope.siderbarExpand = $(window).height() - 442;
        $scope.profileNoticeContent = $(window).height() - 250;
        
        $(".siderbar-closed-container").css('height',$scope.siderbarContainer);
        $(".siderbar-closed-container-expand").css('padding-top',$scope.siderbarExpand);
        $(".profileNotice-content-notice").css('height',$scope.profileNoticeContent);
    };
    
    $scope.toProject = function(){
        var url = '/profile-project/';
        $location.path(url);
    }
    
    $scope.toProfile = function(){
        var url = '/profile-profile/';
        $location.path(url);
    }
    
    $scope.toBilling = function(){
        var url = '/profile-billing/';
        $location.path(url);
    }
  });
