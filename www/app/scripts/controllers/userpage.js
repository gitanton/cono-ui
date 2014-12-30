'use strict';

/**
 * @ngdoc function
 * @name conojoApp.controller:UserpageCtrl
 * @description
 * # UserpageCtrl
 * Controller of the conojoApp
 */
angular.module('conojoApp')
  .controller('UserpageCtrl', function ($scope,$http,$routeParams) {
    $scope.setHeight = function(){
        $scope.siderbarContainer = $(window).height() - 64;
        $scope.siderbarExpand = $(window).height() - 442;
        $scope.userpageContent = $(window).height() - 128;
        
        $(".siderbar-closed-container").css('height',$scope.siderbarContainer);
        $(".siderbar-closed-container-expand").css('padding-top',$scope.siderbarExpand);
        $(".userpage-content").css('height',$scope.userpageContent);
    }
    
    $scope.memberUuid = 0; 
    $scope.setHeight = function(){
        $scope.siderbarContainer = $(window).height() - 64;
        $scope.siderbarExpand = $(window).height() - 442;
        
        $(".siderbar-closed-container").css('height',$scope.siderbarContainer);
        $(".siderbar-closed-container-expand").css('padding-top',$scope.siderbarExpand);
    };
    
    $scope.init = function(){
        $http({
            url: 'http://conojoapp.scmreview.com/rest/projects',
            method: 'GET',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function(data) {
             $scope.projects = data;
        });
        $http({
            url: 'http://conojoapp.scmreview.com/rest/users',
            method: 'GET',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function(data) {
             $scope.users = data;
        });
    };
    
    $scope.openAddProjectMember = function(uuid){
        $('#addPeopleToProject').modal('toggle');
        $scope.addToProjectUuid = uuid;
    };
    
    $scope.addProjectMember = function(){
        $http({
            url: 'http://conojoapp.scmreview.com/rest/projects/project/'+$scope.addToProjectUuid+'/invite',
            method: 'POST',
            data: $.param({uuid:$scope.addToProjectUuid,email:$scope.memberEmail}),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function() {
            $('#addPeopleToProject').modal('hide');
        });
    };
    
    $scope.openAddTeamMember = function(){
        $('#addTeamMember').modal('toggle');
        $scope.activeTeamUuid = $routeParams.uuid;
    };
    
    $scope.addTeamMember = function(){
        $http({
            url: 'http://conojoapp.scmreview.com/rest/teams/team/'+$scope.activeTeamUuid+'/invite',
            method: 'POST',
            data: $.param({uuid:$scope.activeTeamUuid,email:$scope.teammemberemail}),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function() {
            $('#addTeamMember').modal('hide');
        });
    };
    
    $scope.init();
  });