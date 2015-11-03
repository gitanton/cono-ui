'use strict';
/**
 * @ngdoc function
 * @name conojoApp.controller:ProjectTemplateSelectCtrl
 * @description
 * # ProjectTemplateSelectCtrl
 * Controller of the conojoApp
 */
angular.module('conojoApp')
    .controller('ProjectTemplateSelectCtrl', function ($scope, $http, $location, $routeParams, ENV) {
        $scope.activeProjectUuid = $routeParams.uuid;

        $scope.init = function () {
            $http({
                url: ENV.API_ENDPOINT + 'templates',
                method: 'GET',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then(function (response) {
                $scope.templates = response.data;
            });
        };

        $scope.templateUrl = '';

        $scope.clickTemplate = function (url, event, index) {
            if ($(event.target).parent().parent().hasClass('templates-content-unselect')) {
                $(event.target).parents('.templates-content-body').children().removeClass('templates-content-select').addClass('templates-content-unselect');
                $(event.target).parents('.templates-content-body').children().eq(index).removeClass('templates-content-unselect').addClass('templates-content-select');
                $scope.templateUrl = url;
            } else {
                $(event.target).parent().parent().removeClass('templates-content-select').addClass('templates-content-unselect');
                $scope.templateUrl = '';
                console.log('unselect');
            }
        };

        $scope.uploadSelectTemplate = function () {
            if ($scope.templateUrl === '') {
                $('.reset-note').html('You have not select the template.');
                $('#statusNotice').modal('toggle');
            } else {
                $http({
                    url: ENV.API_ENDPOINT + 'screens/project/' + $scope.activeProjectUuid,
                    method: 'POST',
                    data: $.param({project_uuid: $scope.activeProjectUuid, url: $scope.templateUrl}),
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                }).then(function (response) {
                    var data = response.data;
                    var url = '/project-build-template/' + $scope.activeProjectUuid + '/' + data.uuid;
                    $location.path(url).replace();
                    $scope.$apply();
                }, function (data) {
                    $('.reset-note').html(data.message);
                    $('#statusNotice').modal('toggle');
                });
            }
        };

        $scope.goBack = function () {
            var url = '/project';
            $location.path(url);
        };

        $scope.selectTemplate = function (name, index) {
            $('.defaultTemplate').html(name);
            $('.templates-content-unselect').hide();
            $('.templates-content-select').hide();
            $('.templates-content-body').children().eq(index).show();
        };

        $scope.init();
    });
