'use strict';

/**
 * @ngdoc function
 * @name conojoApp.controller:UserpageCtrl
 * @description
 * # UserpageCtrl
 * Controller of the conojoApp
 */
angular.module('conojoApp')
  .controller('UserpageCtrl', function ($scope,$http) {
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
    
    $scope.addProjectMember = function(uuid){
        $http({
            url: 'http://conojoapp.scmreview.com/rest/projects/project/'+uuid+'/invite',
            method: 'POST',
            data: $.param({uuid:$scope.addProjectMemberUuid,user_uuid:$scope.memberUuid,email:$scope.teammemberemail}),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function() {
            $scope.init();
            $('#duplicateproject').modal('hide');
        });
    };
    
    $scope.init();
  });
