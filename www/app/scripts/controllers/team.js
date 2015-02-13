'use strict';

/**
 * @ngdoc function
 * @name conojoApp.controller:TeamCtrl
 * @description
 * # TeamCtrl
 * Controller of the conojoApp
 */
angular.module('conojoApp')
  .controller('TeamCtrl', function ($scope,$http,currentUser) {
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
    
    $(".team-content-offset").on('mouseover',function(){
        $(this).find(".team-content-permissions").show();
    }).on('mouseleave',function(){
        $(this).find(".team-content-permissions").hide();
    });
    
    $scope.init();
  });
