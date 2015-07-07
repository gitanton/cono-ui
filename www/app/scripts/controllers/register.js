'use strict';

/**
 * @ngdoc function
 * @name conojoApp.controller:RegisterCtrl
 * @description
 * # RegisterCtrl
 * Controller of the conojoApp
 */
angular.module('conojoApp')
    .controller('RegisterCtrl', function ($scope, $http, $location, $window, ENV) {
        $scope.errorOne = false;
        $scope.errorTwo = false;
        $scope.errorThree = false;

        $scope.today = new Date();
        $scope.lastDay = $scope.today.setDate($scope.today.getDate() + 30);
        $scope.loginPadding = ($(window).height() - 651) / 2;

        $('.register-logo').css('padding-top', $scope.loginPadding);
        $('.register-note').css('padding-bottom', $scope.loginPadding);

        $scope.init = function () {
            $http({
                url: ENV.API_ENDPOINT + 'utils/timezones',
                method: 'GET',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function (data) {
                $scope.timezones = data;
            });
        };

        $scope.formData = {};

        $scope.processForm = function () {
            $http({
                url: ENV.API_ENDPOINT + 'users',
                method: 'POST',
                data: $.param({fullname: $scope.formData.username, email: $scope.formData.email, timezone: $scope.timezone, username: $scope.formData.username, password: $scope.formData.password}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function (data) {
                $window.sessionStorage.currentUserUuid = data.uuid;

                if(data.avatar === null){
                    $window.sessionStorage.avatar = '';
                }else{
                    $window.sessionStorage.avatar = data.avatar;
                }
                console.log($window.sessionStorage.avatar);

                $window.sessionStorage.fullname = data.fullname;
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
            }).error(function (dataMessage) {
                if (dataMessage.data.level === 1) {
                    $scope.errorOne = true;
                    $scope.errorTwo = false;
                    $scope.errorThree = false;
                    $('.register-email').val('').focus();
                } else if (dataMessage.data.level === 2) {
                    $scope.errorOne = false;
                    $scope.errorTwo = true;
                    $scope.errorThree = false;
                    $('.register-username').val('').focus();
                } else if (dataMessage.data.level === 3) {
                    $scope.errorOne = false;
                    $scope.errorTwo = false;
                    $scope.errorThree = true;
                    $('.register-username').val('').focus();
                    $('.register-email').val('');
                }
                $('#registerNote').modal('toggle');
            });
        };

        $scope.init();
    });
