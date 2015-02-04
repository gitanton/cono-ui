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
        });
    };
    
    $scope.userPage = function(uuid){
        var url = '/userpage/'+uuid;
        $location.path(url);
    }
    
    $scope.init();
  });
