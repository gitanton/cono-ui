'use strict';

/**
 * @ngdoc function
 * @name conojoApp.controller:TeamCtrl
 * @description
 * # TeamCtrl
 * Controller of the conojoApp
 */
angular.module('conojoApp')
  .controller('TeamCtrl', function ($scope,$http) {
    $scope.memberUuid = 0;
    
    $scope.init = function(){
        $http({
            url: 'http://conojoapp.scmreview.com/rest/teams',
            method: 'GET'
        }).success(function() {
             $scope.teams = [
                 {member:"R.Dawkins"},
                 {member:"J.Chan"},
                 {member:"R.Dawkins"}
             ];
        });
    };
    
    $scope.openAddTeamMember = function(){
        $('#addTeamMember').modal('toggle');
        $('body').css('padding',0);
    };
    
    $scope.addTeamMember = function(){
        $http({
            url: 'http://conojoapp.scmreview.com/rest/teams/team/'+uuid+'/invite',
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function() {
            $scope.init();
            $('#duplicateproject').modal('hide');
        });
    };
    
    $scope.init();
  });
