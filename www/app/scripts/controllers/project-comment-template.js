'use strict';
/**
 * @ngdoc function
 * @name conojoApp.controller:ProjectCommentVideoCtrl
 * @description
 * # ProjectCommentVideoCtrl
 * Controller of the conojoApp
 */
angular.module('conojoApp')
 .controller('ProjectCommentVideoCtrl', function ($scope,$http,$location,$routeParams,currentUser) {
    $scope.activeProjectUuid = $routeParams.uuid;
    $scope.projectCommentBody = $(window).height() - 176;
    $(".projectComment-content-body").css('height',$scope.projectCommentBody);
    
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

    $scope.toScreen = function(){
        var url = '/project-screen-video/';
        $location.path(url);
    }
    
    $scope.toActivity = function(){
        var url = '/project-activity-video/';
        $location.path(url);
    }
    
    $scope.init();
});
