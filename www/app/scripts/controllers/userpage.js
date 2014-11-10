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
    $scope.memberUuid = 0;  
    
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
        $scope.addProjectMemberUuid = uuid;
        $('body').css('padding',0);
    };
    
    $scope.addProjectMember = function(){
        $http({
            url: 'http://conojoapp.scmreview.com/rest/projects/project/'+$scope.addProjectMemberUuid+'/invite',
            method: 'POST',
            data: $.param({uuid:$scope.addProjectMemberUuid,user_uuid:$scope.memberUuid,email:$scope.memberEmail}),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function() {
            $('#addPeopleToProject').modal('hide');
        });
    };
    
    $scope.openAddTeamMember = function(){
        $('#addTeamMember').modal('toggle');
        $('body').css('padding',0);
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
