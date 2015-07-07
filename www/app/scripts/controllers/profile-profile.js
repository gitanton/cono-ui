'use strict';

/**
 * @ngdoc function
 * @name conojoApp.controller:ProfileProfileCtrl
 * @description
 * # ProfileProfileCtrl
 * Controller of the conojoApp
 */
angular.module('conojoApp')
    .controller('ProfileProfileCtrl', function ($scope, $location, $http, ENV, Upload, $window) {
        $scope.profileProfileContent = $(window).height() - 250;
        $('.profileProfile-content-profile').css('height', $scope.profileProfileContent);

        $scope.init = function(){
            //get the country
            $http({
                url: ENV.API_ENDPOINT + 'utils/bootstrap',
                method: 'GET',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function(data){
                $scope.countries = data.countries;
            });

            $scope.fullname = $window.sessionStorage.fullname;
            $scope.email = $window.sessionStorage.email;
            $scope.avatar = $window.sessionStorage.avatar;
            $scope.city = $window.sessionStorage.city;
            $scope.state = $window.sessionStorage.state;
            $scope.userCountry = $window.sessionStorage.userCountry;
        };

        $scope.uploadAvatar = function(files){
            Upload.upload({
                url: ENV.API_ENDPOINT + 'users/avatar',
                method: 'POST',
                file: files[0]
            }).success(function (data) {
                $window.sessionStorage.avatar = data.avatar;
                $('#userAvatar').attr('src',data.avatar);
                $('.siderbar-closed-img').attr('src',data.avatar);
                $('.siderbar-expand-img').attr('src',data.avatar);
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
                url: ENV.API_ENDPOINT + 'users/user/' + $window.sessionStorage.currentUserUuid,
                method: 'PUT',
                data: {uuid: $window.sessionStorage.currentUserUuid,body:{'fullename': $scope.fullname,'email': $scope.email,'city':$scope.city,'state':$scope.state,'country':$scope.userCountry}},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function(data){
                $window.sessionStorage.fullname = data.fullname;
                $window.sessionStorage.email = data.email;
                $window.sessionStorage.city = data.city;
                $window.sessionStorage.state = data.state;
                $window.sessionStorage.country = data.country;
                $scope.init();
            });
        };

        $scope.forgotPassword = function () {
            $http({
                url: ENV.API_ENDPOINT + 'users/forgot_password',
                method: 'POST',
                data: $.param({email: $scope.resetEmail}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
        };

        $scope.init();
    });
