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
    $scope.formData = {};
    
    $scope.processForm = function(){        
       $http({
            url: 'http://conojoapp.scmreview.com/rest/users',
            method: 'POST',
            data: $.param({fullname:$scope.formData.fullname,email:$scope.formData.email,username:$scope.formData.fullname,password:$scope.formData.password}),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function() {
             $location.path('/'); 
        });
    };
  });
