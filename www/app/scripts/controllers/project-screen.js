'use strict';
/**
 * @ngdoc function
 * @name conojoApp.controller:ProjectScreenCtrl
 * @description
 * # ProjectScreenCtrl
 * Controller of the conojoApp
 */
angular.module('conojoApp')
 .controller('ProjectScreenCtrl', function ($scope,$http,$location,$routeParams) {
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
        $('#addPeopleToProject').modal('toggle');
        $('body').css('padding',0);
    };
    
    $scope.addProjectMember = function(){
        $http({
            url: 'http://conojoapp.scmreview.com/rest/projects/project/'+$scope.activeProjectUuid+'/invite',
            method: 'POST',
            data: $.param({uuid:$scope.activeProjectUuid,email:$scope.memberEmail}),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function() {
            $('#addPeopleToProject').modal('hide');
        });
    };
    
    $scope.openUploadScreen = function(){
        $('#addProjectScreen').modal('toggle');
        $('body').css('padding',0);
    };
    
    $scope.addProjectMember = function(){
        $http({
            url: '',
            method: 'POST',
            data: $.param({}),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function() {
            $('#addProjectScreen').modal('hide');
        });
    };
    
    $scope.toBuild = function(){
        var url = '/project-build/'+$scope.activeProjectUuid;
        $location.path(url);
    }
    
    $scope.toActivity = function(){
        var url = '/project-activity/'+$scope.activeProjectUuid;
        $location.path(url);
    }
    
    $scope.toComment = function(){
        var url = '/project-comment/'+$scope.activeProjectUuid;
        $location.path(url);
    }
    
     $scope.openMessage = function(){
        var url = '/message/'+$scope.activeProjectUuid;
        $location.path(url);
    }
    
    $scope.init();
});
