'use strict';

/**
 * @ngdoc function
 * @name conojoApp.controller:InvitationCtrl
 * @description
 * # InvitationCtrl
 * Controller of the conojoApp
 */
angular.module('conojoApp')
  .controller('InvitationCtrl', function ($scope,$http,$location,$routeParams) {
     $scope.inviteMarginTop = ($(window).height() - 587)/2;
     
    $(".invitation-container").css('height',$(window).height());
    $(".invitation-container").css('padding-top',$scope.inviteMarginTop);
    $(".invitation-container").css('padding-bottom',$scope.inviteMarginTop);
     
    $scope.init = function(){
       $http({
            url: 'http://conojoapp.scmreview.com/rest/utils/timezones',
            method: 'GET',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function(data) {
             $scope.timezones = data;
        });
   }
     
    $scope.formData = {};
    $scope.processLoginForm = function(){
       $http({
            url: 'http://conojoapp.scmreview.com/rest/users/login',
            method: 'POST',
            data:$.param({invite_key:$routeParams.invite,invite_type:$routeParams.type,username:$scope.loginFormData.username,password:$scope.loginFormData.password}),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function() {
             $location.path('project'); 
        });
    };
    
    $scope.registerFormData = {};
    $scope.processRegisterForm = function(){
       $http({
            url: 'http://conojoapp.scmreview.com/rest/users',
            method: 'POST',
            data: $.param({invite_key:$routeParams.invite,invite_type:$routeParams.type,fullname:$scope.registFormData.fullname,email:$scope.registFormData.email,timezone:$scope.timezone,username:$scope.registFormData.fullname,password:$scope.registFormData.password}),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function() {
             $location.path('project'); 
        });
    };
    
    $scope.init();
  });
