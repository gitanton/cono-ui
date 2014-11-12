'use strict';
/**
 * @ngdoc function
 * @name conojoApp.controller:ProjectBuildActivityCtrl
 * @description
 * # ProjectBuildActivityCtrl
 * Controller of the conojoApp
 */
angular.module('conojoApp')
 .controller('ProjectBuildActivityCtrl', function ($scope,$http,$location,$routeParams) {
    $scope.activeProjectUuid = $routeParams.uuid;
    
    $scope.init = function(){
        $http({
            url: 'http://conojoapp.scmreview.com/rest/projects/project/'+$scope.activeProjectUuid,
            method: 'GET',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function(data) {
            $scope.updateProjectTitle = data.name;
            $scope.updateProjectTypeid = data.type_id;
        });
    };
    
    $scope.openUpdateProject = function(){
        $('#updateproject').modal('toggle');
        $('body').css('padding',0);
    };
    
    $scope.updateMyProject = function(uuid){
        $http({
            url: 'http://conojoapp.scmreview.com/rest/projects/project/'+uuid,
            method: 'PUT',
            data: {name:$scope.updateProjectTitle,type_id:$scope.updateProjectTypeid}
        }).success(function() {
            $scope.init();
            $('#updateproject').modal('hide');
        });
   };
     
    $scope.openAddProjectMember = function(){
        $('#addProjectMember').modal('toggle');
        $('body').css('padding',0);
    };
    
     $scope.openMessage = function(uuid){
        var url = '/message/'+uuid;
        $location.path(url);
    }
    
    $scope.init();
});
