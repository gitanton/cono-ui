'use strict';
/**
 * @ngdoc function
 * @name conojoApp.controller:ProjectBuildCtrl
 * @description
 * # ProjectBuildCtrl
 * Controller of the conojoApp
 */
angular.module('conojoApp')
 .controller('ProjectBuildCtrl', function ($scope,$http,$location,$routeParams) {
    $scope.activeProjectUuid = $routeParams.uuid;
    $scope.setHeight = function(){
        $scope.siderbarContainer = $(window).height() - 64;
        $scope.siderbarExpand = $(window).height() - 442;
        $scope.projectContent = $(window).height() - 176;
        $scope.projectDrawing = $(window).height() - 244;
        $scope.projectShapeTool = $(window).height() - 509;
        
        $(".siderbar-closed-container").css('height',$scope.siderbarContainer);
        $(".siderbar-closed-container-expand").css('padding-top',$scope.siderbarExpand);
        $(".projectBuild-content-body").css('height',$scope.projectContent);
        $(".projectBuild-content-drawing").css('height',$scope.projectDrawing);
        $(".projectBuild-content-shape").css('top',$scope.projectDrawing-305);
        $(".projectBuild-content-tools").css('top',$scope.projectDrawing+10);
        $(".projectBuild-content-addScreens").css('top',$scope.projectDrawing+10);
    };
    
    $scope.init = function(){
        $('#picker').farbtastic(function(color){
            console.log(color);
        });
        
        $http({
            url: 'http://conojoapp.scmreview.com/rest/projects/project/'+$scope.activeProjectUuid,
            method: 'GET',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function(data) {
            $scope.updateProjectTitle = data.name;
            $scope.updateProjectTypeid = data.type_id;
            $scope.setHeight();
        });
    };
    
    $scope.openUpdateProject = function(){
        $('#updateproject').modal('toggle');
        $('body').css('padding',0);
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
     
    $scope.openAddProjectMember = function(){
        $('#addPeopleToProject').modal('toggle');
        $('body').css('padding',0);
    };
    
    $scope.addProjectMember = function(){
        $http({
            url: 'http://conojoapp.scmreview.com/rest/projects/project/'+$scope.activeProjectUuid+'/invite',
            method: 'POST',
            data: $.param({uuid:$scope.activeProjectUuid,email:$scope.memberEmail}),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function() {
            $('#addPeopleToProject').modal('hide');
        });
    };
    
    $scope.toScreen = function(){
        var url = '/project-screen/'+$scope.activeProjectUuid;
        $location.path(url);
    }
    
    $scope.toActivity = function(){
        var url = '/project-activity/'+$scope.activeProjectUuid;
        $location.path(url);
    }
    
    $scope.toComment = function(){
        var url = '/project-comment/'+$scope.activeProjectUuid;
        $location.path(url);
    }
    
     $scope.openMessage = function(){
        var url = '/message/'+$scope.activeProjectUuid;
        $location.path(url);
    }
    
    $scope.openComments = function(){
        
    }
    
    $scope.openHotspots = function(){
        
    }
    
    $scope.openDrawing = function(){
        
    }
    
    $scope.openBrush = function(){
        $('.projectBuild-content-brush').show();
    }
    
    $scope.openEraser = function(){
        $('.projectBuild-content-eraser').show();
    }
    
    $scope.openShape = function(){
        $('.projectBuild-content-shape').show();
    }
    
    $scope.init();
});
