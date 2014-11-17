'use strict';

/**
 * @ngdoc function
 * @name conojoApp.controller:InvitePeopleCtrl
 * @description
 * # InvitePeopleCtrl
 * Controller of the conojoApp
 */
angular.module('conojoApp')
  .controller('InvitePeopleCtrl', function ($scope,$http,$location,$routeParams) {
    $scope.loginFormData = {};
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
            data: $.param({invite_key:$routeParams.invite,invite_type:$routeParams.type,fullname:$scope.registFormData.fullname,email:$scope.registFormData.email,username:$scope.registFormData.fullname,password:$scope.registFormData.password}),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function() {
             $location.path('project'); 
        });
    };
  });
