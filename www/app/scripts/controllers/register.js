'use strict';

/**
 * @ngdoc function
 * @name conojoApp.controller:RegisterCtrl
 * @description
 * # RegisterCtrl
 * Controller of the conojoApp
 */
angular.module('conojoApp')
  .controller('RegisterCtrl', function ($scope,$http,$location) {
     $scope.today = new Date();
     $scope.lastDay = $scope.today.setDate($scope.today.getDate() + 30);
     $scope.loginPadding = ($(window).height() - 671)/2;

    $(".register-logo").css('padding-top',$scope.loginPadding);
    $(".register-note").css('padding-bottom',$scope.loginPadding);
    
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
    
    $scope.processForm = function(){        
       $http({
            url: 'http://conojoapp.scmreview.com/rest/users',
            method: 'POST',
            data: $.param({fullname:$scope.formData.fullname,email:$scope.formData.email,timezone:$scope.timezone,username:$scope.formData.fullname,password:$scope.formData.password}),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function() {
             $location.path('/'); 
        });
    };
    
    $scope.init();
  });
