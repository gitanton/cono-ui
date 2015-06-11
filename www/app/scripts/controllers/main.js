'use strict';

/**
 * @ngdoc function
 * @name conojoApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the conojoApp
 */
angular.module('conojoApp')
    .controller('MainCtrl', function ($scope, $http, $location, currentUser, ENV) {
        $scope.loginPadding = ($(window).height() - 519) / 2;

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
                $location.path('project');
                currentUser.currentUserUuid = data.uuid;
                currentUser.avatar = data.avatar;
                currentUser.fullname = data.fullname;
                currentUser.email = data.email;
            }).error(function(data){
                    $("#loginNote").modal('toggle');
                    $(".login-username").val('').focus();
                    $(".login-password").val('');
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
            })
        };
    });
