'use strict';
/**
 * @ngdoc function
 * @name conojoApp.controller:ProjectCtrl
 * @description
 * # ProjectCtrl
 * Controller of the conojoApp
 */
angular.module('conojoApp').controller('ProjectCtrl', function ($scope,$http) {
    $scope.projecttype = 0;
    $scope.projecttitle = "";
    $scope.updateProjectUuid = "";
    $scope.updateProjectTypeid = 0;
    
    $scope.init = function(){
        $http({
            url: 'http://conojoapp.scmreview.com/rest/projects',
            method: 'GET',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function(data) {
             $scope.projects = data;
        });
    };
    
    $scope.newProject = function(){
        $('#newproject').modal('toggle');
        $('body').css('padding',0);
    };
    
    $scope.operateProject = function(project){
        if (project.is_open) {
            project.is_open = false;
        } else {
            project.is_open = true;
        }
    };
    
    $scope.showGear = function(is_open){
        if (is_open) {
            return 'project-content-gear-a-selected';
        } else {
            return 'project-content-gear-a';
        }
    };
    
    $scope.showBackground = function(is_open){
        if (is_open) {
            return 'project-content-gear-background';
        } else {
            return 'project-content-gear-nobackground';
        }
    };
    
    $scope.showOperate = function(is_open){
        if (is_open) {
            return 'project-content-operate-show';
        } else {
            return 'project-content-operate-hide';
        }
    };
    
    $scope.myProject = function(){
        $http({
            url: 'http://conojoapp.scmreview.com/rest/projects',
            method: 'POST',
            data: $.param({name:$scope.projecttitle,type_id:$scope.projecttype}),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function(data) {
            $scope.projects.push(data);
            $('#newproject').modal('hide');
        });
   };
   
   $scope.openUpdateProject = function(uuid){
        $('#updateproject').modal('toggle');
        $('body').css('padding',0);
        $http({
            url: 'http://conojoapp.scmreview.com/rest/projects/project/'+uuid,
            method: 'GET',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function(data) {
            $scope.updateProjectUuid = data.uuid;
            $scope.updateProjectTitle = data.name;
            $scope.updateProjectTypeid = data.type_id;
        });
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
   
   $scope.duplicateProjectModal = function(uuid){
        $('#duplicateproject').modal('toggle');
        $('body').css('padding',0);
        $scope.duplicateProjectUuid = uuid;
    };
    
    $scope.duplicateProject = function(uuid){
        
    };
   
   $scope.archiveProjectModal = function(uuid,typeid){
        $('#archiveproject').modal('toggle');
        $('body').css('padding',0);
        $scope.archiveProjectUuid = uuid;
        $scope.archiveProjectTypeid = typeid;
    };
    
    $scope.archiveProject = function(uuid){
        $http({
            url: 'http://conojoapp.scmreview.com/rest/projects/project/'+uuid,
            method: 'PUT',
            data:{type_id:$scope.archiveProjectTypeid,archived:"1"}
        }).success(function() {
            $scope.init();
            $('#archiveproject').modal('hide');
        });
    };
   
    $scope.deleteProjectModal = function(uuid){
        $('#deleteproject').modal('toggle');
        $('body').css('padding',0);
        $scope.deleteProjectUuid = uuid;
    };
    
    $scope.deleteProject = function(uuid){
        $http({
            url: 'http://conojoapp.scmreview.com/rest/projects/project/'+uuid,
            method: 'DELETE',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function() {
            $scope.init();
            $('#deleteproject').modal('hide');
        });
    };
   
   $scope.init();
});
