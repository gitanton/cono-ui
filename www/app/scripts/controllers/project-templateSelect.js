'use strict';
/**
 * @ngdoc function
 * @name conojoApp.controller:ProjectTemplateSelectCtrl
 * @description
 * # ProjectTemplateSelectCtrl
 * Controller of the conojoApp
 */
angular.module('conojoApp')
 .controller('ProjectTemplateSelectCtrl', function ($scope,$http,$location,$routeParams,currentUser) {
    $scope.templatesContent = $(window).height() - 128;
    $(".templates-content").css('height',$scope.templatesContent);

    $scope.init = function(){
        $http({
            url: 'http://conojoapp.scmreview.com/rest/templates',
            method: 'GET',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function(data) {
            $scope.templates = data;
        });
    };

    $scope.init();
});
