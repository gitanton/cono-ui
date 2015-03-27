'use strict';
/**
 * @ngdoc function
 * @name conojoApp.controller:ProjectVideoPlayCtrl
 * @description
 * # ProjectVideoPlayCtrl
 * Controller of the conojoApp
 */
angular.module('conojoApp')
        .controller('ProjectVideoPlayCtrl', function ($scope, $http, $location, $routeParams, currentUser) {
            $scope.activeProjectUuid = $routeParams.puuid;
            $scope.activeVideoProjectUuid = $routeParams.vuuid;
            $scope.showCanvas = false;
            $scope.shapeFill = false;
            $scope.showComment = false;
            $scope.showCommentBlue = true;
            $scope.showBrushBlue = true;
            $scope.showEraser = false;
            $scope.showShape = false;
            $scope.videoHeight = $(window).height() - 270;
            $(".projectScreenVideo-content-video").css('height', $scope.videoHeight);
            $("#videoBody").on("loadedmetadata", function () {
                $("#videoDrawing").css('margin-Left', ($(window).width() - $("#videoBody").width() - 64)/2);
//                $("#videoDrawing").attr('width',$("#videoBody").width());
//                $("#videoDrawing").attr('height',$("#videoBody").height());
            });

            $scope.init = function () {
                $http({
                    url: 'http://conojoapp.scmreview.com/rest/projects/project/' + $scope.activeProjectUuid,
                    method: 'GET',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                }).success(function (data) {
                    $scope.projectMembers = data.users;
                    $scope.updateProjectTitle = data.name;
                    $scope.updateProjectTypeid = data.type_id;
                });
                
                $http({
                    url: 'http://conojoapp.scmreview.com/rest/videos/video/' + $scope.activeVideoProjectUuid,
                    method: 'GET',                    
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                }).success(function (data) {
                        $('#videoBody').attr("src", data.url);
                        $scope.videoComments = data.comments;
                });
                
                $('#pickerBrush').farbtastic(function(color){
                    $scope.setPenColor(color);
                });
                $('#pickerShape').farbtastic(function(color){
                    $scope.setPenColor(color);
                });
                $scope.setPenWidth(0);
            };
           
            //CONTROLS EVENTS
            //video screen and play button clicked
            var video = $('#videoBody');
            $('.btnPlay').on('click', function () {
                if (video[0].paused) {
                    $scope.showCanvas = false;
                    $scope.showCommentBlue = true;
                    $scope.showBrushBlue = true;
                    $scope.showEraser = false;
                    $scope.showShape = false;
                    $scope.$apply();
                    cxt.clearRect(0, 0, $('#videoBody').width(), $('#videoBody').height());
                    if($scope.showComment){
                        $scope.hideComment();
                    }
                    $('.btnPlay').addClass("paused");
                    video[0].play();
                }
                else {
                    $('.btnPlay').removeClass("paused");
                    video[0].pause();
                }
            });

            //video prev event
            $('.btnPrev').on('click', function () {
                var now = video[0].currentTime - 10;
                video[0].currentTime = now;
            });

            //video next event
            $('.btnNext').on('click', function () {
                var now = video[0].currentTime + 10;
                video[0].currentTime = now;
            });

            //display current video play time
            video.on('timeupdate', function () {
                var currentPos = video[0].currentTime;
                var maxduration = video[0].duration;
                var perc = 100 * currentPos / maxduration;
                $('.timeBar').css('width', perc + '%');
            });

            //end the video
            video.on('ended', function () {
                $('.timeBar').css('width', 0);
                $('.btnPlay').removeClass("paused");
            });
            
            //arrow the video
            $scope.goToComment = function(time,order){
                $scope.showCanvas = true;
                video[0].currentTime = time;
                var imageObj = new Image();
                imageObj.src = 'data:image/png;base64,' + $scope.videoComments[order - 1].data.slice(9);
                cxt.clearRect(0, 0, $('#videoBody').width(), $('#videoBody').height());
                cxt.drawImage(imageObj,0,0,$("#videoBody").width(),$("#videoBody").height());  
                $('.btnPlay').removeClass("paused");
                video[0].pause();
            }

            //VIDEO PROGRESS BAR
            //when video timebar clicked
            var timeDrag = false;	/* check for drag event */
            $('.video-player-processBar').on('mousedown', function (e) {
                timeDrag = true;
                updatebar(e.pageX);
            });
            $('.video-player-processBar').on('mouseup', function (e) {
                if (timeDrag) {
                    timeDrag = false;
                    updatebar(e.pageX);
                }
            });
            $('.video-player-processBar').on('mousemove', function (e) {
                if (timeDrag) {
                    updatebar(e.pageX);
                }
            });
            var updatebar = function (x) {
                var progress = $('.video-player-processBar');

                //calculate drag position
                //and update video currenttime
                //as well as progress bar
                var maxduration = video[0].duration;
                var position = x - progress.offset().left;
                var percentage = 100 * position / progress.width();
                if (percentage > 100) {
                    percentage = 100;
                }
                if (percentage < 0) {
                    percentage = 0;
                }
                $('.timeBar').css('width', percentage + '%');
                video[0].currentTime = maxduration * percentage / 100;
            };

            //sound button clicked
            $('.sound').click(function () {
                if (video[0].muted) {
                    $('.volumeBar').css('width', 0);
                }
                else {
                    $('.volumeBar').css('width', video[0].volume * 100 + '%');
                }
            });

            //VOLUME BAR
            //volume bar event
            var volumeDrag = false;
            $('.volume').on('mousedown', function (e) {
                volumeDrag = true;
                video[0].muted = false;
                updateVolume(e.pageX);
            });
            $(document).on('mouseup', function (e) {
                if (volumeDrag) {
                    volumeDrag = false;
                    updateVolume(e.pageX);
                }
            });
            $(document).on('mousemove', function (e) {
                if (volumeDrag) {
                    updateVolume(e.pageX);
                }
            });
            var updateVolume = function (x, vol) {
                var volume = $('.volume');
                var percentage;
                //if only volume have specificed
                //then direct update volume
                if (vol) {
                    percentage = vol * 100;
                }
                else {
                    var position = x - volume.offset().left;
                    percentage = 100 * position / volume.width();
                }

                if (percentage > 100) {
                    percentage = 100;
                }
                if (percentage < 0) {
                    percentage = 0;
                }

                //update volume bar and video volume
                $('.volumeBar').css('width', percentage + '%');
                video[0].volume = percentage / 100;
            };

            $scope.openUpdateProject = function () {
                $('#updateproject').modal('toggle');
            };

            $scope.updateMyProject = function (uuid) {
                $http({
                    url: 'http://conojoapp.scmreview.com/rest/projects/project/' + uuid,
                    method: 'PUT',
                    data: {name: $scope.updateProjectTitle, type_id: $scope.updateProjectTypeid}
                }).success(function () {
                    $scope.init();
                    $('#updateproject').modal('hide');
                });
            };

            $scope.openAddProjectMember = function () {
                $('#addPeopleToProject').modal('toggle');
            };

            $scope.addProjectMember = function () {
                $http({
                    url: 'http://conojoapp.scmreview.com/rest/projects/project/' + $scope.activeProjectUuid + '/invite',
                    method: 'POST',
                    data: $.param({uuid: $scope.activeProjectUuid, email: $scope.memberEmail}),
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                }).success(function () {
                    $('#addPeopleToProject').modal('hide');
                });
            };

            $scope.openNewMeeting = function () {
                $('#newMeeting').modal('toggle');
            };

            $scope.addNewMeeting = function () {
                $http({
                    url: 'http://conojoapp.scmreview.com/rest/meetings',
                    method: 'POST',
                    data: $.param({notes: $scope.meetingMessage, project_uuid: $scope.activeProjectUuid, name: $scope.meetingName, date: $scope.meetingDateTime.split(" ")[0], time: $scope.meetingDateTime.split(" ")[1], attendees: $scope.meetingGroup.join(",")}),
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                }).success(function () {
                    $scope.init();
                    $('#newMeeting').modal('hide');
                });
            };

            $('.newMeeting-time').datetimepicker({
                dateFormat: "yy-mm-dd"
            });

            $scope.showSelectMember = function (event) {
                $(event.target).parent().find(".newMeeting-group").show();
                $(document).on("click", function () {
                    $(event.target).parent().find(".newMeeting-group").hide();
                });
                event.stopPropagation();
            }

            $(".newMeeting-group").on("click", function (event) {
                event.stopPropagation();
            });

            $scope.toActivity = function () {
                var url = '/project-activity-video/' + $scope.activeProjectUuid;
                $location.path(url);
            }

            $scope.toComment = function () {
                var url = '/project-comment-video/' + $scope.activeProjectUuid;
                $location.path(url);
            }
            
            var canvas = document.getElementById('videoDrawing');
            var cxt = canvas.getContext('2d');

            $scope.commentList = [];
            var rectX=0;
            var rectY=0;
            var polyX=0;
            var polyY=0;
            var arcX=0;
            var arcY=0;
            var eraserFlag=0;

            $scope.setPenWidth = function(width){
                switch(width){
                    case 0:
                        cxt.lineWidth=8;
                        break;
                    case 1:
                        cxt.lineWidth=20;
                        break;
                    case 2:
                        cxt.lineWidth=30;
                        break;
                    default:
                        cxt.lineWidth=8;
                }
            }

            $scope.setPenColor = function(color){
                cxt.strokeStyle = color;
                cxt.fillStyle = color;
            }
            
            $scope.openComment = function () {
                $scope.showCanvas = true;
                $scope.showCommentBlue = false;
                $scope.showBrushBlue = true;
                $scope.showEraser = false;
                $scope.showShape = false;
                $(".projectScreenVideo-comment-black").siblings().removeClass("tools-li-selected");
                $(".projectScreenVideo-comment-black").addClass("tools-li-selected");
                $('.btnPlay').removeClass("paused");
                video[0].pause();
                
                cxt.strokeStyle = "rgba(250,246,162,0.7)";
                cxt.fillStyle = "rgba(250,246,162,0.7)";
                canvas.onmousedown = function (evt) {
                    if ($scope.commentList.length > 0) {
                        cxt.clearRect(0, 0, $('#videoBody').width(), $('#videoBody').height());
                        $scope.commentList = [];
                    }
                    evt = window.event || evt;
                    rectX = evt.pageX - this.offsetLeft - 64;
                    rectY = evt.pageY - this.offsetTop - 176;
                }

                canvas.onmouseup = function (evt) {
                    evt = window.event || evt;
                    cxt.fillRect(rectX, rectY, 25, 25);
                    $scope.commentList.push([canvas.toDataURL(), rectX, rectY, 25, 25]);
                    $('#addComment').css('left', evt.pageX - 400);
                    $('#addComment').css('top', evt.pageY);
                    $scope.showComment = true;
                    $scope.$apply();
                }
                canvas.onmousemove = null;
                canvas.onmouseout = null;
            }

            $scope.saveComment = function () {
                var imgDataArray = $scope.commentList.slice(-1);
                $http({
                    url: 'http://conojoapp.scmreview.com/rest/videos/video/' + $scope.activeVideoProjectUuid + '/comments',
                    method: 'POST',
                    data: $.param({video_uuid: $scope.activeVideoProjectUuid, content:$scope.commentContent, time:video[0].currentTime, begin_x:imgDataArray[0][1], begin_y:imgDataArray[0][2], end_x:25, end_y:25, left_x:100 * video[0].currentTime / video[0].duration+'%',data:imgDataArray[0][0]}),
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                }).success(function (data) {
                    $('.video-player-commentFlag').append("<div class='arrow-down' style='left:"+100 * video[0].currentTime / video[0].duration+"%' ng-click='goToComment('"+video[0].currentTime+"')'>"+data.ordering+"</div>");
                });
            }

            $scope.hideComment = function () {
                $scope.showComment = false;
                cxt.clearRect(0, 0, $('#videoBody').width(), $('#videoBody').height());
                if ($scope.commentList.length > 1) {
                    var index = $scope.commentList.length - 2;
                    var image = new Image();
                    image.src = $scope.commentList[index][0];
                    cxt.drawImage(image, 0, 0);
                }
                $scope.commentList.pop();
            }
            
            $scope.openTools = function(){
                $scope.showCanvas = true;
                $scope.showCommentBlue = true;
                $scope.showBrushBlue = false;
                $scope.showEraser = true;
                $scope.showShape = true;
                $(".projectScreenVideo-comment-black").removeClass("tools-li-selected");
                $scope.setBrushWidth(8);
                cxt.strokeStyle = '#000';
                cxt.fillStyle = '#000';
                $('.btnPlay').removeClass("paused");
                video[0].pause();
            }

            $scope.openDrawing = function(type,event){
                $('.btnPlay').removeClass("paused");
                video[0].pause();
                $scope.showCommentBlue = true;
                $scope.showBrushBlue = false;
                $scope.showEraser = true;
                $scope.showShape = true;
                if(type == 'brush'){
                    $(".projectBuild-content-brush").show();
                    $(".projectBuild-content-eraser").hide();
                    $(".projectBuild-content-shape").hide();
                    $(".projectScreenVideo-brush-black").siblings().removeClass("tools-li-selected");
                    $(".projectScreenVideo-brush-black").addClass("tools-li-selected");
                    $scope.setBrushWidth(8);
                    cxt.strokeStyle = '#000';
                    cxt.fillStyle = '#000';
                    $(".projectBuild-content-brush").on("click", function (){
                        event.stopPropagation();
                    });
                    $(document).on("click", function (){
                        $(".projectBuild-content-brush").hide();
                    });
                }else if(type == 'eraser'){
                    $(".projectBuild-content-brush").hide();
                    $(".projectBuild-content-eraser").show();
                    $(".projectBuild-content-shape").hide();
                    $(".projectScreenVideo-eraser").siblings().removeClass("tools-li-selected");
                    $(".projectScreenVideo-eraser").addClass("tools-li-selected");
                    $scope.setEraserWidth(8);
                    $(".projectBuild-content-eraser").on("click", function (){
                        event.stopPropagation();
                    });
                    $(document).on("click", function (){
                        $(".projectBuild-content-eraser").hide();
                    });
                }else if(type == 'shape'){
                    $(".projectBuild-content-brush").hide();
                    $(".projectBuild-content-eraser").hide();
                    $(".projectBuild-content-shape").show();
                    $(".projectScreenVideo-shape").siblings().removeClass("tools-li-selected");
                    $(".projectScreenVideo-shape").addClass("tools-li-selected");
                    $scope.setPenWidth(0);
                    cxt.strokeStyle = '#000';
                    cxt.fillStyle = '#000';
                    $(".projectBuild-content-shape").on("click", function (){
                        event.stopPropagation();
                    });
                    $(document).on("click", function (){
                        $(".projectBuild-content-shape").hide();
                    });
                }
                event.stopPropagation();
            }

            $scope.shapeFillSwitch = function(type){
                if(type == 'on'){
                    $scope.shapeFill = true;
                    $('.shapeFillSwitchOn').removeClass('shapeUnFillItem').addClass('shapeFillItem');
                    $('.shapeFillSwitchOff').removeClass('shapeFillItem').addClass('shapeUnFillItem');
                }else if(type == 'off'){
                    $scope.shapeFill = false;
                    $('.shapeFillSwitchOff').removeClass('shapeUnFillItem').addClass('shapeFillItem');
                    $('.shapeFillSwitchOn').removeClass('shapeFillItem').addClass('shapeUnFillItem');
                }
            }

            $scope.specicalColor = function(color){
                cxt.strokeStyle = color;
                cxt.fillStyle = color;
            }

            $scope.setBrushWidth = function(width){
                cxt.lineWidth = width;
                var flag=0;
                canvas.onmousedown=function(evt){
                        evt=window.event||evt;
                        var startX=evt.pageX-this.offsetLeft-64;
                        var startY=evt.pageY-this.offsetTop-176;
                        cxt.beginPath();
                        cxt.moveTo(startX,startY);
                        flag=1;
                }
                canvas.onmousemove=function(evt){
                        evt=window.event||evt;
                        var endX=evt.pageX-this.offsetLeft-64;
                        var endY=evt.pageY-this.offsetTop-176;
                        if(flag){
                                cxt.lineTo(endX,endY);
                                cxt.stroke();
                        }
                }
                canvas.onmouseup=function(){
                    flag=0;
                }
                canvas.onmouseout=function(){
                    flag=0;
                }
            }

            $scope.setEraserWidth = function(width){
                cxt.lineWidth = width;
                canvas.onmousedown=function(evt){
                    evt=window.event||evt;
                    var eraserX=evt.pageX-this.offsetLeft-64;
                    var eraserY=evt.pageY-this.offsetTop-176;
                    cxt.clearRect(eraserX-cxt.lineWidth,eraserY-cxt.lineWidth,cxt.lineWidth*2,cxt.lineWidth*2);
                    eraserFlag=1;
                }
                canvas.onmousemove=function(evt){
                    evt=window.event||evt;
                    var eraserX=evt.pageX-this.offsetLeft-64;
                    var eraserY=evt.pageY-this.offsetTop-176;
                    if(eraserFlag){
                        cxt.clearRect(eraserX-cxt.lineWidth,eraserY-cxt.lineWidth,cxt.lineWidth*2,cxt.lineWidth*2);
                    }
                }
                canvas.onmouseup=function(){
                    eraserFlag=0;
                }
                canvas.onmouseout=function(){
                    eraserFlag=0;
                }
            };

            $scope.drawSquare = function(){
                canvas.onmousedown=function(evt){
                    evt=window.event||evt;
                    rectX=evt.pageX-this.offsetLeft-64;
                    rectY=evt.pageY-this.offsetTop-176;
                }

                canvas.onmouseup=function(evt){
                    evt=window.event||evt;
                    var endX=evt.pageX-this.offsetLeft-64;
                    var endY=evt.pageY-this.offsetTop-176;
                    var rectW=endX-rectX;
                    var rectH=endY-rectY;
                    if($scope.shapeFill){
                        cxt.fillRect(rectX,rectY,rectW,rectH);
                    }else{
                        cxt.strokeRect(rectX,rectY,rectW,rectH);
                    }
                }
                canvas.onmousemove=null;
                canvas.onmouseout=null;
            };

            $scope.drawTriangle = function(){
                canvas.onmousedown=function(evt){
                    evt=window.event||evt;
                    polyX=evt.pageX-this.offsetLeft-64;
                    polyY=evt.pageY-this.offsetTop-176;
                }
                canvas.onmouseup=function(evt){
                    evt=window.event||evt;
                    var endX=evt.pageX-this.offsetLeft-64;
                    var endY=evt.pageY-this.offsetTop-176;
                    cxt.beginPath();
                    cxt.moveTo(endX,endY);
                    var lbX=2*polyX-endX;
                    var lbY=endY;
                    cxt.lineTo(lbX,lbY);
                    var tmpC=2*(endX-polyX);
                    var tmpA=endX-polyX;
                    var tmpB=Math.sqrt(tmpC*tmpC-tmpA*tmpA);
                    cxt.lineTo(polyX,endY-tmpB);
                    cxt.closePath();

                    if($scope.shapeFill){
                        cxt.fill();
                    }else{
                        cxt.stroke();
                    }
                }
                canvas.onmousemove=null;
                canvas.onmouseout=null;
            };

            $scope.drawCircle = function(){
                canvas.onmousedown=function(evt){
                    evt=window.event||evt;
                    arcX=evt.pageX-this.offsetLeft-64;
                    arcY=evt.pageY-this.offsetTop-176;
                }
                canvas.onmouseup=function(evt){
                    evt=window.event||evt;
                    var endX=evt.pageX-this.offsetLeft-64;
                    var endY=evt.pageY-this.offsetTop-176;
                    var a=endX-arcX;
                    var b=endY-arcY;
                    var c=Math.sqrt(a*a+b*b);
                    cxt.beginPath();
                    cxt.arc(arcX,arcY,c,0,360,false);
                    cxt.closePath();

                    if($scope.shapeFill){
                        cxt.fill();
                    }else{
                        cxt.stroke();
                    }
                }
                canvas.onmousemove=null;
                canvas.onmouseout=null;
            };

            $scope.drawTalk = function(){
                canvas.onmousedown=function(evt){
                    evt=window.event||evt;
                    polyX=evt.pageX-this.offsetLeft-64;
                    polyY=evt.pageY-this.offsetTop-176;
                }
                canvas.onmouseup=function(evt){
                    evt=window.event||evt;
                    cxt.beginPath();
                    cxt.moveTo(polyX,polyY);
                    cxt.quadraticCurveTo(polyX-18,polyY,polyX-18,polyY+15);
                    cxt.quadraticCurveTo(polyX-18,polyY+27,polyX-3,polyY+27);
                    cxt.quadraticCurveTo(polyX-3,polyY+32,polyX-8,polyY+35);
                    cxt.quadraticCurveTo(polyX,polyY+35,polyX+3,polyY+27);
                    cxt.quadraticCurveTo(polyX+18,polyY+27,polyX+18,polyY+15);
                    cxt.quadraticCurveTo(polyX+18,polyY,polyX,polyY);
                    cxt.fill();
                }
                canvas.onmousemove=null;
                canvas.onmouseout=null;
            }

            $scope.drawArrow = function(){
                canvas.onmousedown=function(evt){
                    evt=window.event||evt;
                    polyX=evt.pageX-this.offsetLeft-64;
                    polyY=evt.pageY-this.offsetTop-176;
                }
                canvas.onmouseup=function(evt){
                    evt=window.event||evt;
                    cxt.beginPath();
                    cxt.moveTo(polyX,polyY);
                    cxt.lineTo(polyX+20,polyY);
                    cxt.lineTo(polyX+20,polyY-5);
                    cxt.lineTo(polyX+30,polyY+5);
                    cxt.lineTo(polyX+20,polyY+15);
                    cxt.lineTo(polyX+20,polyY+10);
                    cxt.lineTo(polyX,polyY+10);
                    cxt.closePath();
                    cxt.fill();
                }
                canvas.onmousemove=null;
                canvas.onmouseout=null;
            }

            $scope.drawStar = function(){
                canvas.onmousedown=function(evt){
                    evt=window.event||evt;
                    polyX=evt.pageX-this.offsetLeft-64;
                    polyY=evt.pageY-this.offsetTop-176;
                }
                canvas.onmouseup=function(evt){
                    evt=window.event||evt;
                    cxt.beginPath();
                    cxt.moveTo(polyX,polyY);
                    cxt.lineTo(polyX+12,polyY);
                    cxt.lineTo(polyX+15,polyY-10);
                    cxt.lineTo(polyX+18,polyY);
                    cxt.lineTo(polyX+30,polyY);
                    cxt.lineTo(polyX+20,polyY+7);
                    cxt.lineTo(polyX+23,polyY+20);
                    cxt.lineTo(polyX+15,polyY+13);
                    cxt.lineTo(polyX+7,polyY+20);
                    cxt.lineTo(polyX+10,polyY+7);
                    cxt.fill();
                }
                canvas.onmousemove=null;
                canvas.onmouseout=null;
            }

            $scope.init();
        });

