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
    $scope.activeProjectUuid = $routeParams.puuid;
    $scope.activeVideoProjectUuid = $routeParams.vuuid;
    $scope.commentFlag = false;
    $scope.showAddHotspots = false;
    $scope.projectScreenVideoBody = $(window).height() - 176;
    $scope.videoHeight = $(window).height() - 235;
    $(".projectScreenVideo-content-body").css('height',$scope.projectScreenVideoBody);
    $(".projectScreenVideo-content-video").css('height',$scope.videoHeight);
//    $("#videoBody").css('margin-Left',($(window).width() - 832)/2);
    
    //CONTROLS EVENTS
    //video screen and play button clicked
    var video = $('#videoBody');
    $('.btnPlay').on('click', function() {
        if(video[0].paused) {
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
    
    //end the video
    video.on('ended', function() {
        $('.timeBar').css('width',0);
        $('.btnPlay').removeClass("paused");
    });
    
    //VIDEO PROGRESS BAR
    //when video timebar clicked
    var timeDrag = false;	/* check for drag event */
    $('.video-player-processBar').on('mousedown', function(e) {
        timeDrag = true;
        updatebar(e.pageX);
    });
    $(document).on('mouseup', function(e) {
        if(timeDrag) {
                timeDrag = false;
                updatebar(e.pageX);
        }
    });
    $(document).on('mousemove', function(e) {
        if(timeDrag) {
                updatebar(e.pageX);
        }
    });
    var updatebar = function(x) {
        var progress = $('.video-player-processBar');

        //calculate drag position
        //and update video currenttime
        //as well as progress bar
        var maxduration = video[0].duration;
        var position = x - progress.offset().left;
        var percentage = 100 * position / progress.width();
        if(percentage > 100) {
                percentage = 100;
        }
        if(percentage < 0) {
                percentage = 0;
        }
        $('.timeBar').css('width',percentage+'%');	
        video[0].currentTime = maxduration * percentage / 100;
    };
    
    //sound button clicked
    $('.sound').click(function() {
        if(video[0].muted) {
                $('.volumeBar').css('width',0);
        }
        else{
                $('.volumeBar').css('width', video[0].volume*100+'%');
        }
    });
    
    //VOLUME BAR
    //volume bar event
    var volumeDrag = false;
    $('.volume').on('mousedown', function(e) {
        volumeDrag = true;
        video[0].muted = false;
        updateVolume(e.pageX);
    });
    $(document).on('mouseup', function(e) {
        if(volumeDrag) {
                volumeDrag = false;
                updateVolume(e.pageX);
        }
    });
    $(document).on('mousemove', function(e) {
        if(volumeDrag) {
                updateVolume(e.pageX);
        }
    });
    var updateVolume = function(x, vol) {
        var volume = $('.volume');
        var percentage;
        //if only volume have specificed
        //then direct update volume
        if(vol) {
                percentage = vol * 100;
        }
        else {
                var position = x - volume.offset().left;
                percentage = 100 * position / volume.width();
        }

        if(percentage > 100) {
                percentage = 100;
        }
        if(percentage < 0) {
                percentage = 0;
        }

        //update volume bar and video volume
        $('.volumeBar').css('width',percentage+'%');	
        video[0].volume = percentage / 100;
    };
    
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
            url: 'http://conojoapp.scmreview.com/rest/videos/video/'+$scope.activeVideoProjectUuid,
            method: 'GET',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function(data) {
            $scope.screens = data;
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
    
    var canvas = document.getElementById('videoDrawing');
    var cxt = canvas.getContext('2d');
    $scope.hotspotsList = [];
    $scope.preFlag = false;
    var rectX=0;
    var rectY=0;
    
    $scope.openHotspots = function(){
        cxt.strokeStyle = "rgba(250,246,162,0.7)";
        cxt.fillStyle = "rgba(250,246,162,0.7)";
        canvas.onmousedown=function(evt){
            if($scope.preFlag){
                cxt.clearRect(0,0,$('#videoBody').width(),$('#videoBody').height());
                if($scope.hotspotsList.length > 1){
                    var index = $scope.hotspotsList.length - 2;
                    var image = new Image();
                    image.src = $scope.hotspotsList[index][0];
                    cxt.drawImage(image , 0 ,0);
                }
                $scope.hotspotsList.pop();
            }
            evt=window.event||evt;
            rectX=evt.pageX-64;
            rectY=evt.pageY-176;
        }

        canvas.onmouseup=function(evt){
            evt=window.event||evt;
            cxt.fillRect(rectX,rectY,25,25);
            $scope.preFlag = true;
            $scope.hotspotsList.push([canvas.toDataURL(),rectX,rectY,25,25]);
            if(evt.pageX <= 400){
                $('#addHotspots').css('left',evt.pageX + 35);
                $('#addHotspots').css('top',evt.pageY);
            }else{
                $('#addHotspots').css('left',evt.pageX - 400);
                $('#addHotspots').css('top',evt.pageY);
            }
            $scope.showAddHotspots = true;
            $scope.$apply();
        }
        canvas.onmousemove=null;
        canvas.onmouseout=null;
    }
    
    $scope.saveAddHotspots = function(){
        $scope.preFlag = false;
        var imgDataArray = $scope.hotspotsList.slice(-1);
        var screenData = {'imgData':imgDataArray[0][0],'bX':imgDataArray[0][1],'bY':imgDataArray[0][2],'eX':imgDataArray[0][3],'eY':imgDataArray[0][4],'link':$scope.hotspotsLinkTo};
        $http({
            url: 'http://conojoapp.scmreview.com/rest/screens/screen/'+$scope.activeScreenUuid+'/hotspots',
            method: 'POST',
            data: $.param({screen_uuid:$scope.activeScreenUuid,data:screenData}),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function() {

        });
        //save to the Server successfully
        $scope.showAddHotspots = false;
    }
    
    $scope.hideAddHotspots = function(){
        $scope.preFlag = false;
        $scope.showAddHotspots = false;
        cxt.clearRect(0,0,$('#videoBody').width(),$('#videoBody').height());
        if($scope.hotspotsList.length > 1){
            var index = $scope.hotspotsList.length - 2;
            var image = new Image();
            image.src = $scope.hotspotsList[index][0];
            cxt.drawImage(image , 0 ,0);
        }
        $scope.hotspotsList.pop();
    }
    
    $scope.init();
});