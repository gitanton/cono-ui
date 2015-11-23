'use strict';

/**
 * @ngdoc function
 * @name conojoApp.controller:siderBarCtrl
 * @description
 * # siderBarCtrl
 * Controller of the conojoApp
 */
angular.module('conojoApp')
    .controller('siderBarCtrl', function ($rootScope, $scope, $http, store, $location, ENV, NAV) {
        $scope.expandMenuFlag = false;
        $scope.user = store.get('user');

        $scope.init = function () {
            if($scope.user) {
                $scope.userAvatar = $scope.user.avatar;
            }
        };

        /**
         * Watch the user's avatar for changes so we can change it when it changes.
         */
        $scope.$watch('user.avatar', function () {
            if($scope.user) {
                $('.siderbar-closed-img').attr('src', $scope.user.avatar);
                $('.siderbar-expand-img').attr('src', $scope.user.avatar);
            }
        });

        $scope.expandMenu = function () {
            $scope.expandMenuFlag = true;
        };

        $scope.closeMenu = function () {
            $scope.expandMenuFlag = false;
        };

        $scope.setHeight = function () {

        };

        $scope.goToProfile = function () {
            var url = '/profile-project';
            $location.path(url);
        };

        $scope.logout = function () {
            $http({
                url: ENV.API_ENDPOINT + 'users/logout',
                method: 'POST',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then(function (response) {
                store.remove('user');
                if (response.data.status === 'success') {
                    $location.path('/');
                }
            }, function (error) {
                $('.reset-note').html(error.data.message);
                $('#statusNotice').modal('toggle');
            });
        };

        $scope.init();
    });

