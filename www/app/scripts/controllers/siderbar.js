
'use strict';

/**
 * @ngdoc function
 * @name conojoApp.controller:siderBarCtrl
 * @description
 * # siderBarCtrl
 * Controller of the conojoApp
 */
angular.module('conojoApp')
    .controller('siderBarCtrl', function ($scope, $http, $window, $location, ENV) {
        $scope.expandMenuFlag = false;
        $scope.siderbarContainer = $(window).height() - 64;
        $scope.projectContent = $(window).height() - 128;

        $('.siderbar-closed-container').css('height', $scope.siderbarContainer);
        $('.siderbar-expand-container').css('height', $scope.siderbarContainer);

        $scope.init = function () {
            $scope.userAvatar = $window.sessionStorage.avatar;
        };

        $scope.$watch('$window.sessionStorage.avatar', function() {
            $('.siderbar-closed-img').attr('src',$window.sessionStorage.avatar);
            $('.siderbar-expand-img').attr('src',$window.sessionStorage.avatar);
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

        $scope.Logout = function () {
            $http({
                url: ENV.API_ENDPOINT + 'users/logout',
                method: 'POST',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function (data) {
                if (data.status === 'success') {
                    $location.path('/');
                }
            });
        };

        $scope.init();
    });

