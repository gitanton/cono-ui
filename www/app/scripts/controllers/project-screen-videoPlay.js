'use strict';
/**
 * @ngdoc function
 * @name conojoApp.controller:ProjectScreenVideoPlayCtrl
 * @description
 * # ProjectScreenVideoPlayCtrl
 * Controller of the conojoApp
 */
angular.module('conojoApp')
 .controller('ProjectScreenVideoPlayCtrl', function ($scope,$http,$location,$routeParams,currentUser) {
    $scope.activeProjectUuid = $routeParams.uuid;
    $scope.projectScreenVideoBody = $(window).height() - 176;
    $scope.videoHeight = $(window).height() - 235;
    $(".projectScreenVideo-content-body").css('height',$scope.projectScreenVideoBody);
    $(".projectScreenVideo-content-video").css('height',$scope.videoHeight);
    
    //CONTROLS EVENTS
    //video screen and play button clicked
    var video = $('#videoBody');
    console.log(video);
    $('.btnPlay').on('click', function() {
        if(video[0].paused || video[0].ended) {
            $('.btnPlay').addClass("paused");
            video[0].play();
        }
        else {
            $('.btnPlay').removeClass("paused");
            video[0].pause();
        }
    });
    
    //video prev event
    $('.btnPrev').on('click', function() {
        var now = video[0].currentTime - 10;
        video[0].currentTime = now;
    });
    
    //video next event
    $('.btnNext').on('click', function() {
        var now = video[0].currentTime + 10;
        video[0].currentTime = now;
    });
    
    //display current video play time
    video.on('timeupdate', function() {
        var currentPos = video[0].currentTime;
        var maxduration = video[0].duration;
        var perc = 100 * currentPos / maxduration;
        $('.timeBar').css('width',perc+'%');	
    });
    
    $scope.init = function(){
        $http({
            url: 'http://conojoapp.scmreview.com/rest/projects/project/'+$scope.activeProjectUuid,
            method: 'GET',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function(data) {
            $scope.projectMembers = data.users;
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
    
    $scope.toActivity = function(){
        var url = '/project-activity-video/';
        $location.path(url);
    }
    
    $scope.toComment = function(){
        var url = '/project-comment-video/';
        $location.path(url);
    }
    
    $scope.init();
});
