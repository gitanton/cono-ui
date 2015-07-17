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

        $scope.templateUrl = '';

        $scope.selectTemplate = function(url,event,index){
            if($(event.target).parent().parent().hasClass('templates-content-unselect')){
                $(event.target).parents('.templates-content-body').children().removeClass('templates-content-select').addClass('templates-content-unselect');
                $(event.target).parents('.templates-content-body').children().eq(index).removeClass('templates-content-unselect').addClass('templates-content-select');
                $scope.templateUrl = url;
                console.log('select');
            }else{
                $(event.target).parent().parent().removeClass('templates-content-select').addClass('templates-content-unselect');
                $scope.templateUrl = '';
                console.log('unselect');
            }
        };

        $scope.uploadSelectTemplate = function(){
            if($scope.templateUrl === ''){
                $('.reset-note').html('You have not select the template.');
                $('#statusNotice').modal('toggle');
            }else{
                $http({
                    url: ENV.API_ENDPOINT + 'screens/project/' + $scope.activeProjectUuid,
                    method: 'POST',
                    data: $.param({project_uuid: $scope.activeProjectUuid, url: $scope.templateUrl}),
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                }).success(function (data) {
                    var url = '/project-build-template/' + $scope.activeProjectUuid + '/' + data.uuid;
                    $location.path(url).replace();
                    $scope.$apply();
                }).error(function(data){
                    $('.reset-note').html(data.message);
                    $('#statusNotice').modal('toggle');
                });
            }
        };

        $scope.goBack = function(){
            var url = '/project';
            $location.path(url);
        };

        $scope.selectTemplate = function(name,index){
            $('.templates').hide();
            $('.defaultTemplate').html(name);
            $('.templates-content-unselect').hide();
            $('.templates-content-select').hide();
            $('.templates-content-body').children().eq(index).show();
        };

        $(document).on('click', function () {
            $('.templates').hide();
        });

        $('.templates').on('click', function (evt) {
            evt = window.event || evt;
            evt.stopPropagation();
        });

        $scope.openTemplates = function(evt){
            $('.templates').show();
            evt.stopPropagation();
        };

        $scope.init();
    });
