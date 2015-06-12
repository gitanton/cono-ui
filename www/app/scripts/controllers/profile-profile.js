'use strict';

/**
 * @ngdoc function
 * @name conojoApp.controller:ProfileProfileCtrl
 * @description
 * # ProfileProfileCtrl
 * Controller of the conojoApp
 */
angular.module('conojoApp')
    .controller('ProfileProfileCtrl', function ($scope, $location, currentUser, ENV, Upload, $rootScope) {
        $scope.profileProfileContent = $(window).height() - 250;
        $('.profileProfile-content-profile').css('height', $scope.profileProfileContent);
        $scope.fullname = $rootScope.fullname;
        $scope.email = $rootScope.email;
        $('#userAvatar').attr('src',$rootScope.avatar);
        console.log($scope.fullname + '---' + $scope.email + '---' + $rootScope.avatar);
        console.log($rootScope.fullname + '---' + $rootScope.email + '---' + $rootScope.avatar);

        $scope.init = function(){
            //get the city, state and country list
        };

        $scope.uploadAvatar = function(files){
            Upload.upload({
                url: ENV.API_ENDPOINT + 'users/avatar',
                method: 'POST',
                file: files[0]
            }).success(function (data) {
                $('#userAvatar').attr('src',data.url);
            });
        };

        $scope.toProject = function () {
            var url = '/profile-project/';
            $location.path(url);
        };

        $scope.toBilling = function () {
            var url = '/profile-billing/';
            $location.path(url);
        };

        $scope.toNotice = function () {
            var url = '/profile-notice/';
            $location.path(url);
        };

        $scope.openResetPassword = function () {
            $('#resetPassword').modal('toggle');
        };

        $scope.updateUserInfo = function(){
            $http({
                url: ENV.API_ENDPOINT + 'users/user' + currentUser.currentUserUuid,
                method: 'PUT',
                data: $.param({uuid: currentUser.currentUserUuid,body:{'fullename': $scope.fullname,'email': $scope.email}}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            })
        };

        $scope.forgotPassword = function () {
            $http({
                url: ENV.API_ENDPOINT + 'users/forgot_password',
                method: 'POST',
                data: $.param({email: $scope.resetEmail}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            })
        };

        $scope.init();
    });
