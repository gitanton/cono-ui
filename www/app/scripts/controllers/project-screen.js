'use strict';
/**
 * @ngdoc function
 * @name conojoApp.controller:ProjectScreenCtrl
 * @description
 * # ProjectScreenCtrl
 * Controller of the conojoApp
 */
angular.module('conojoApp')
 .controller('ProjectScreenCtrl', function ($scope,$http,$location,$routeParams) {
    $scope.activeProjectUuid = $routeParams.uuid;
    
    $scope.setHeight = function(){
        $scope.siderbarContainer = $(window).height() - 64;
        $scope.siderbarExpand = $(window).height() - 442;
        $scope.projectScreenBody = $(window).height() - 176;
        
        $(".siderbar-closed-container").css('height',$scope.siderbarContainer);
        $(".siderbar-closed-container-expand").css('padding-top',$scope.siderbarExpand);
        $(".projectScreen-content-body").css('height',$scope.projectScreenBody);
    };
    
    $scope.init = function(){
        $http({
            url: 'http://conojoapp.scmreview.com/rest/projects/project/'+$scope.activeProjectUuid,
            method: 'GET',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function(data) {
            $scope.updateProjectTitle = data.name;
            $scope.updateProjectTypeid = data.type_id;
        });
        
        $http({
            url: 'http://conojoapp.scmreview.com/rest/screens/project/'+$scope.activeProjectUuid,
            method: 'GET',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function(data) {
            $scope.screens = data;
        });
        
        $http({
            url: 'http://conojoapp.scmreview.com/rest/users',
            method: 'GET',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function(data) {
             $scope.users = data;
        });
    };
    
    $("#screenupload").dropzone({
        url: 'http://conojoapp.scmreview.com/rest/screens/project/'+$scope.activeProjectUuid,
        paramName: "file", // The name that will be used to transfer the file
        maxFilesize: 5,
        clickable: false,
        init:function(){
            $(this).on('success',function(){
                $scope.init();
            });
        }
    });
    
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
     
    $scope.openAddProjectMember = function(){
        $('#addPeopleToProject').modal('toggle');
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
    
    $scope.openUploadScreen = function(){
        $('#addProjectScreen').modal('toggle');
    };
    
    $scope.addUploadScreen = function(){
        $http({
            url: 'http://conojoapp.scmreview.com/rest/screens/project/'+$scope.activeProjectUuid,
            method: 'POST',
            data: $.param({project_uuid:$scope.activeProjectUuid,url:$scope.screenUrl}),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function() {
            $scope.init();
            $('#addProjectScreen').modal('hide');
        });
    };
    
    $scope.openNewMeeting = function(){
        $('#newMeeting').modal('toggle');
    };
    
    $scope.addNewMeeting = function(){
        $http({
            url: 'http://conojoapp.scmreview.com/rest/meetings',
            method: 'POST',
            data: $.param({notes:$scope.meetingMessage,project_uuid:$scope.activeProjectUuid,name:$scope.meetingName,date:$scope.meetingDateTime.split(" ")[0],time:$scope.meetingDateTime.split(" ")[1],attendees:$scope.meetingGroup.join(",")}),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function() {
            $scope.init();
            $('#newMeeting').modal('hide');
        });
    };
    
    $('.newMeeting-time').datetimepicker({
        dateFormat: "yy-mm-dd"
    });
    
    $scope.showSelectMember = function(event){
        $(event.target).parent().find(".newMeeting-group").show();
        $(document).on("click", function (){
            $(event.target).parent().find(".newMeeting-group").hide();
        });
        event.stopPropagation();
    }
    
    $(".newMeeting-group").on("click", function (event){
        event.stopPropagation();
    });
    
    $scope.toBuildNewScreen = function(){
        var url = '/project-newscreen-build/'+$scope.activeProjectUuid;
        $location.path(url);
    }
    
    $scope.toBuild = function(suuid){
        var url = '/project-build/'+$scope.activeProjectUuid+'/'+suuid;
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
    
    $scope.init();
});
