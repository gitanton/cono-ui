'use strict';

/**
 * @ngdoc function
 * @name conojoApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the conojoApp
 */
angular.module('conojoApp')
  .controller('MainCtrl', function ($scope,$http,$location,currentUser) {
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
        }).success(function(data) {
             $location.path('project');
             currentUser.currentUserUuid = data.uuid;
        });
    };
    
    $scope.openResetPassword = function(){
        $('#resetPassword').modal('toggle');
    };
    
    $scope.forgotPassword = function(){
        $http({
            url: 'http://conojoapp.scmreview.com/rest/users/forgot_password',
            method: 'POST',
            data:$.param({email:$scope.resetEmail}),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function(data){
//            if(data.status == 'success'){
//                $(".forgot-form").append("<p style='text-align:center;'>The email has been sent successfully, please read the email to get the password and go to <a href='#/'>Login</a> page</p>");
//            }
        });
    }
  });
