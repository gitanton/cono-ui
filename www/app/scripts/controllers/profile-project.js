'use strict';

/**
 * @ngdoc function
 * @name conojoApp.controller:ProfileProjectCtrl
 * @description
 * # ProfileProjectCtrl
 * Controller of the conojoApp
 */
angular.module('conojoApp')
  .controller('ProfileProjectCtrl', function ($scope,$location,currentUser) {
    $scope.profileProjectsContent = $(window).height() - 250;
    $(".profileProject-content-projects").css('height',$scope.profileProjectsContent);
    
    $scope.toProfile = function(){
        var url = '/profile-profile/';
        $location.path(url);
    }
    
    $scope.toBilling = function(){
        var url = '/profile-billing/';
        $location.path(url);
    }
    
    $scope.toNotice = function(){
        var url = '/profile-notice/';
        $location.path(url);
    }
  });
