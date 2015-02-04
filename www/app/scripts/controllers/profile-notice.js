'use strict';

/**
 * @ngdoc function
 * @name conojoApp.controller:ProfileNoticeCtrl
 * @description
 * # ProfileNoticeCtrl
 * Controller of the conojoApp
 */
angular.module('conojoApp')
  .controller('ProfileNoticeCtrl', function ($scope,$location,currentUser) {
    $scope.profileNoticeContent = $(window).height() - 250;
    $(".profileNotice-content-notice").css('height',$scope.profileNoticeContent);
    
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
