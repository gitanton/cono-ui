'use strict';
/**
 * @ngdoc function
 * @name conojoApp.controller:ProjectCtrl
 * @description
 * # ProjectCtrl
 * Controller of the conojoApp
 */
angular.module('conojoApp').controller('ProjectCtrl', function ($scope,$http,$location) {
    $scope.projecttype = 0;
    $scope.projecttitle = "";
    
    $scope.setHeight = function(){
        $scope.siderbarContainer = $(window).height() - 64;
        $scope.siderbarExpand = $(window).height() - 442;
        $scope.projectContent = $(window).height() - 128;
        
        $(".siderbar-closed-container").css('height',$scope.siderbarContainer);
        $(".siderbar-closed-container-expand").css('padding-top',$scope.siderbarExpand);
        $(".project-content").css('height',$scope.projectContent);
        $(".projectBuild-content-tools").css('height',$scope.projectContent);
    };
    
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
        }).success(function() {
            $scope.init();
            $('#newproject').modal('hide');
        });
   };
   
   $scope.projectScreen = function(uuid){
        var url = '/project-screen/'+uuid;
        $location.path(url);
    }
   
   $scope.duplicateProjectModal = function(uuid,name){
        $('#duplicateproject').modal('toggle');
        $scope.duplicateProjectUuid = uuid;
        $scope.duplicateProjectName = name;
    };
    
    $scope.duplicateProject = function(uuid){
        $http({
            url: 'http://conojoapp.scmreview.com/rest/projects/project/'+uuid+'/duplicate',
            method: 'POST',
            data: $.param({uuid:$scope.duplicateProjectUuid,name:$scope.duplicateProjectName+'-Copy'}),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function() {
            $scope.init();
            $('#duplicateproject').modal('hide');
        });
    };
    
    $scope.shareProjectModal = function(uuid){
        $('#shareproject').modal('toggle');
        $scope.shareProjectUuid = uuid;
    };
    
    $scope.shareProject = function(uuid){
        $http({
            url: 'http://conojoapp.scmreview.com/rest/projects/project/'+uuid+'/share',
            method: 'POST',
            data: $.param({uuid:$scope.shareProjectUuid}),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function() {
            $('#shareproject').modal('hide');
        });
    };
   
   $scope.archiveProjectModal = function(uuid,typeid){
        $('#archiveproject').modal('toggle');
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
