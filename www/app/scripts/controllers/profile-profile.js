'use strict';

/**
 * @ngdoc function
 * @name conojoApp.controller:ProfileProfileCtrl
 * @description
 * # ProfileProfileCtrl
 * Controller of the conojoApp
 */
angular.module('conojoApp')
    .controller('ProfileProfileCtrl', function ($scope, $location, $http, ENV, Upload, store, userService) {
        $scope.profileProfileContent = $(window).height() - 250;
        $('.profileProfile-content-profile').css('height', $scope.profileProfileContent);

        $scope.uploadAvatar = function (files) {
            Upload.upload({
                url: ENV.API_ENDPOINT + 'users/avatar',
                method: 'POST',
                file: files[0]
            }).then(function (response) {
                var user = response.data;
                user.avatar = user.avatar;
                $('#userAvatar').attr('src', user.avatar);
                $('.siderbar-closed-img').attr('src', user.avatar);
                $('.siderbar-expand-img').attr('src', user.avatar);
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
            $scope.resetEmail = '';
            $('#resetPassword').modal('toggle');
        };

        $scope.updateUserInfo = function () {
            $http({
                url: ENV.API_ENDPOINT + 'users/user/' + userService.getUserUUID(),
                method: 'PUT',
                data: $.param({
                    'uuid': userService.getUserUUID(),
                    'fullname': $scope.fullname,
                    'email': $scope.email,
                    'username': store.get('user').username,
                    'city': $scope.city,
                    'state': $scope.state,
                    'country': $scope.country
                }),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then(function (response) {
                var user = response.data;
                store.set('user', user);
                $scope.init();
                return user;
            }, function (data) {
                $('.reset-note').html(data.message);
                $('#statusNotice').modal('toggle');
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



        ////////////////////////////////////////////////////////////////////////////
        //
        // INITIALIZATION
        //
        ////////////////////////////////////////////////////////////////////////////
        $scope.init = function () {
            //get the country
            $http({
                url: ENV.API_ENDPOINT + 'utils/bootstrap',
                method: 'GET',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then(function (response) {
                $scope.countries = response.data.countries;
            });

            userService.get().then(function(user) {
                if(user) {
                    $scope.user = user;
                    $scope.fullname = user.fullname;
                    $scope.email = user.email;
                    $scope.avatar = user.avatar;
                    $scope.city = user.city;
                    $scope.state = user.state;
                    $scope.country = user.country;
                }
            });
        };
        $scope.init();
    });
