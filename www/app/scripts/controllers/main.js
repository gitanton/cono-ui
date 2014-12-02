'use strict';

/**
 * @ngdoc function
 * @name conojoApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the conojoApp
 */
angular.module('conojoApp')
  .controller('MainCtrl', function ($scope,$http,$location) {
    $scope.loginPadding = ($(window).height() - 519)/2;

    $(".login-logo").css('padding-top',$scope.loginPadding);
    $(".login-link").css('padding-bottom',$scope.loginPadding);
      
    $scope.formData = {};
    $scope.processForm = function(){
       $http({
            url: 'http://conojoapp.scmreview.com/rest/users/login',
            method: 'POST',
            data:$.param({username:$scope.formData.username,password:$scope.formData.password}),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function() {
             $location.path('project'); 
        });
    };
  });
