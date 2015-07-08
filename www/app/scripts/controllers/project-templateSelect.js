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
        $scope.templatesContent = $(window).height() - 128;
        $('.templates-content').css('height',$scope.templatesContent);

        $scope.init = function(){
            $http({
                url: ENV.API_ENDPOINT + 'templates',
                method: 'GET',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function(data) {
                $scope.templates = data;
            });
        };

        $scope.selectTemplate = function(templateUrl){
            $http({
                url: ENV.API_ENDPOINT + 'screens/project/' + $scope.activeProjectUuid,
                method: 'POST',
                data: $.param({project_uuid: $scope.activeProjectUuid, url: templateUrl}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function () {
                $('#addPeopleToProject').modal('hide');
            }).error(function(data){
                $('#addPeopleToProject').modal('hide');
                $('.reset-note').html(data.message);
                $('#statusNotice').modal('toggle');
            });
        };

        $scope.init();
    });
