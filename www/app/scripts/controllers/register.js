'use strict';

/**
 * @ngdoc function
 * @name conojoApp.controller:RegisterCtrl
 * @description
 * # RegisterCtrl
 * Controller of the conojoApp
 */
angular.module('conojoApp')
  .controller('RegisterCtrl', function ($scope,$http,$location,$routeParams) {
    $scope.formData = {};
    if($routeParams.invite){
        $scope.postRegisterData = {invite_key:$routeParams.invite,fullname:$scope.formData.fullname,email:$scope.formData.email,username:$scope.formData.fullname,password:$scope.formData.password};
    }else{
        $scope.postRegisterData = {fullname:$scope.formData.fullname,email:$scope.formData.email,username:$scope.formData.fullname,password:$scope.formData.password};
    }
    $scope.processForm = function(){
       $http({
            url: 'http://conojoapp.scmreview.com/rest/users',
            method: 'POST',
            data: $.param($scope.postRegisterData),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function() {
             $location.path('/'); 
        });
    };
  });
