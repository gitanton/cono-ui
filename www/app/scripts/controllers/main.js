'use strict';

/**
 * @ngdoc function
 * @name conojoApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the conojoApp
 */
angular.module('conojoApp')
    .controller('MainCtrl', function ($scope, $http, $location, ENV, $window) {
        $scope.loginPadding = ($(window).height() - 536) / 2;

        $('.login-logo').css('padding-top', $scope.loginPadding);
        $('.login-link').css('padding-bottom', $scope.loginPadding);

        $scope.formData = {};
        $scope.processForm = function () {
            $http({
                url: ENV.API_ENDPOINT + 'users/login',
                method: 'POST',
                data: $.param({username: $scope.formData.username, password: $scope.formData.password}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function (data) {
                $window.sessionStorage.currentUserUuid = data.uuid;

                if(data.avatar === null){
                    $window.sessionStorage.avatar = '';
                }else{
                    $window.sessionStorage.avatar = data.avatar;
                }

                $window.sessionStorage.fullname = data.fullname;
                $window.sessionStorage.username = data.username;
                $window.sessionStorage.email = data.email;

                if(data.city === null){
                    $window.sessionStorage.city = '';
                }else{
                    $window.sessionStorage.city = data.city;
                }
                console.log($window.sessionStorage.city);

                if(data.state === null){
                    $window.sessionStorage.state = '';
                }else{
                    $window.sessionStorage.state = data.state;
                }

                $window.sessionStorage.userCountry = data.country;
                $location.path('project');
            }).error(function(){
                    $('#loginNote').modal('toggle');
                    $('.login-username').val('').focus();
                    $('.login-password').val('');
                });
        };

        $scope.openResetPassword = function () {
            $('#resetPassword').modal('toggle');
        };

        $scope.forgotPassword = function () {
            $http({
                url: ENV.API_ENDPOINT + 'users/forgot_password',
                method: 'POST',
                data: $.param({email: $scope.resetEmail}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function(){
                $('#resetPassword').modal('hide');
                $('#resetNote').modal('toggle');
            });
        };
    });
