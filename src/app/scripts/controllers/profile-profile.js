'use strict';

/**
 * @ngdoc function
 * @name conojoApp.controller:ProfileProfileCtrl
 * @description
 * # ProfileProfileCtrl
 * Controller of the conojoApp
 */
angular.module('conojoApp')
    .controller('ProfileProfileCtrl', function ($scope, $location, $http, $log, ENV, Upload, store, userService, ModalService) {

        /**
         * Upload the user's avatar
         * @param files An array of files.  The file we care about will be in index 0
         */
        $scope.uploadAvatar = function (files) {
            if(files && files.length>0) {
                Upload.upload({
                    url: ENV.API_ENDPOINT + 'users/avatar',
                    file: files[0]
                }).then(function (response) {
                    var user = response.data;
                    user.avatar = user.avatar;
                    store.set('user', user);
                    $('#userAvatar').attr('src', user.avatar);
                    $('.siderbar-closed-img').attr('src', user.avatar);
                    $('.siderbar-expand-img').attr('src', user.avatar);
                    $scope.alertSuccess = '<i class="fa fa-check-circle"></i> Image uploaded successfully!';
                }, function (error) {
                    $scope.alertError = '<i class="fa fa-close-circle"></i> <strong>Image uploaded failed</strong>: '+error.data.message;
                    $log.error({msg: 'User avatar upload error', error: error});
                });
            }
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

        $scope.changePassword = function(args, cls) {
            return ModalService.showModal({
                templateUrl: "views/modal/change-password.html",
                controller: "ModalChangePasswordCtrl",
                inputs: {
                    user: $scope.user
                }
            }).then(function (modal) {
                modal.element.modal();
            });
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
                $scope.alertSuccess = '<i class="fa fa-check-circle"></i> Profile updated successfully!';
                return user;
            }, function (error) {
                $scope.alertError = '<i class="fa fa-close-circle"></i> <strong>Profile update failed</strong>: '+error.data.message;
                $log.error({msg: 'User profile update error', error: error});
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
