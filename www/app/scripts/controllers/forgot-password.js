'use strict';

/**
 * @ngdoc function
 * @name conojoApp.controller:forgotPasswordCtrl
 * @description
 * # forgotPasswordCtrl
 * Controller of the conojoApp
 */
angular.module('conojoApp')
  .controller('forgotPasswordCtrl', function ($scope,$http) {
    $scope.itemPadding = ($(window).height() - 386)/2;

    $(".forgot-logo").css('padding-top',$scope.itemPadding);
    $(".forgot-note").css('padding-bottom',$scope.itemPadding);
      
    $scope.formData = {};
    $scope.processForm = function(){
       $http({
            url: 'http://conojoapp.scmreview.com/rest/users/forgot_password',
            method: 'POST',
            data:$.param({email:$scope.formData.email}),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function(data){
            if(data.status == 'success'){
                $(".forgot-form").append("<p style='text-align:center;'>The email has been sent successfully, please read the email to get the password and go to <a href='#/'>Login</a> page</p>");
            }
        });
    }
  });
