'use strict';

/**
 * @ngdoc function
 * @name conojoApp.controller:TeamCtrl
 * @description
 * # TeamCtrl
 * Controller of the conojoApp
 */
angular.module('conojoApp')
  .controller('TeamCtrl', function ($scope,$http,$location,currentUser) {
    $scope.memberUuid = 0;
    $scope.teamContent = $(window).height() - 128;
    $(".team-content").css('height',$scope.teamContent);
    
    $scope.init = function(){
        $http({
            url: 'http://conojoapp.scmreview.com/rest/teams',
            method: 'GET'
        }).success(function(data) {
             $scope.teams = data;
             $scope.selectTeam = $scope.teams[0];
        });
    };
    
    $scope.openAddTeamMember = function(){
        $('#addTeamMember').modal('toggle');
    };
    
    $scope.addTeamMember = function(){
        $http({
            url: 'http://conojoapp.scmreview.com/rest/teams/team/'+$scope.selectTeam.uuid+'/invite',
            method: 'POST',
            data: $.param({uuid:$scope.selectTeam.uuid,email:$scope.teammemberemail}),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function() {
            $('#addTeamMember').modal('hide');
        });
    };
    
//    $(".team-content-offset").on('mouseover',function(){
//        $(this).find(".team-content-permissions").show();
//    }).on('mouseout',function(){
//        $(this).find(".team-content-permissions").hide();
//    });

    $scope.hoverOver = function(event){
        $(event.target).parents(".team-content-offset").find(".team-content-permissions").show();
    }
    
    $scope.hoverLeave = function(event){
        $(event.target).hide();
    }
    
    $scope.goToEdit= function(uuid){
        var url = '/userpage/'+uuid;
        $location.path(url);
    }
    
    $scope.init();
  });
