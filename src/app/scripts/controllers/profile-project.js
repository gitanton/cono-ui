'use strict';

/**
 * @ngdoc function
 * @name conojoApp.controller:ProfileProjectCtrl
 * @description
 * # ProfileProjectCtrl
 * Controller of the conojoApp
 */
angular.module('conojoApp')
    .controller('ProfileProjectCtrl', function ($scope, $http, $location, ENV, NAV) {
        $scope.projects = [];
        var projectInfo = [];

        $scope.init = function () {
            $http({
                url: ENV.API_ENDPOINT + 'projects',
                method: 'GET',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then(function (response) {
                var data = response.data;
                $scope.projects = data;
                console.log(data);
            });
        };

        $scope.selectProject = function (val, index) {
            $('.defaultProject').html(val);
            $('.profile-project-content-project').hide();
            $('.profile-project-content-project').eq(index).show();
        };

        $scope.init();
    });
