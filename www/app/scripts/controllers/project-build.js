'use strict';
/**
 * @ngdoc function
 * @name conojoApp.controller:ProjectBuildCtrl
 * @description
 * # ProjectBuildCtrl
 * Controller of the conojoApp
 */
angular.module('conojoApp')
 .controller('ProjectBuildCtrl', function ($scope,$http,$location,$routeParams,meetingFlag,currentUser) {
     $scope.CLOCK = null;
     $scope.shapeFill = false;
     $scope.showAddHotspots = false;
    $scope.activeProjectUuid = $routeParams.puuid;
    $scope.activeScreenUuid = $routeParams.suuid;
    $scope.projectContent = $(window).height() - 176;
    $scope.projectDrawing = $(window).height() - 234;
    $(".projectBuild-content-body").css('height',$scope.projectContent);
    $(".projectBuild-content-drawing").css('height',$scope.projectDrawing);
    
    if($scope.activeScreenUuid == 'new'){
        $scope.showNew = true;
    }else{
        $scope.showNew = false;
    }
    
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
        
        if($scope.activeScreenUuid != 'new'){
            $http({
                url: 'http://conojoapp.scmreview.com/rest/screens/screen/'+$scope.activeScreenUuid,
                method: 'GET',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function(data) {
                imageObj_b.src = data.url;
                imageObj_b.onload = function (){  
                    cxt_b.drawImage(imageObj_b,0,0,1000,423);  
                }

                if(data.hotspots.length > 0){
                    var h_length = data.hotspots.length - 1;
                    imageObj.src = 'data:image/png;base64,' + data.hotspots[h_length].data.slice(9);
                    imageObj.onload = function (){  
                        cxt.drawImage(imageObj,0,0,1000,423);  
                    }
                }
            });   
        }
        
        $('#pickerBrush').farbtastic(function(color){
            $scope.setPenColor(color);
        });
        $('#pickerShape').farbtastic(function(color){
            $scope.setPenColor(color);
        });
        $scope.setPenWidth(0);
    };
    
    $scope.$watch(meetingFlag.startMeeting, function() {
        console.log(meetingFlag.startMeeting);
    });
    
//    $scope.CLOCK = setInterval(function(){
//        if(meetingFlag.startMeeting){
//            $scope.getChange();
//        }
//    },2000);
    
    $scope.getChange = function(){
        $http({
            url: 'http://conojoapp.scmreview.com/rest/screens/screen/'+$scope.activeScreenUuid,
            method: 'GET',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function(data) {
            if(data.hotspots.length > 0){
                var h_length = data.hotspots.length - 1;
                imageObj.src = 'data:image/png;base64,' + data.hotspots[h_length].data.slice(9);
                imageObj.onload = function (){  
                    cxt.drawImage(imageObj,0,0,1000,423);  
                }
            }
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
    
    $("#screenupload-new").dropzone({
        url: 'http://conojoapp.scmreview.com/rest/screens/project/'+$scope.activeProjectUuid,
        paramName: "file", // The name that will be used to transfer the file
        maxFilesize: 5,
        clickable: false,
        init:function(){
            $(this).on('success',function(file,serverCallBack){
                var url = 'project-build/' + $scope.activeProjectUuid + '/' + serverCallBack.uuid;
                $location.path(url);
            });
        }
    });
    
    $scope.openNewMeeting = function(){
        $('#newMeeting').modal('toggle');
    };
    
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

    $scope.addNewMeeting = function(){
        $http({
            url: 'http://conojoapp.scmreview.com/rest/meetings',
            method: 'POST',
            data: $.param({notes:$scope.meetingMessage,project_uuid:$scope.activeProjectUuid,name:$scope.meetingName,date:$scope.meetingDateTime.split(" ")[0],time:$scope.meetingDateTime.split(" ")[1],attendees:$scope.meetingGroup}),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function() {
            $scope.init();
            $('#newMeeting').modal('hide');
        });
    };

    $('.newMeeting-time').datetimepicker({
        dateFormat: "yy-mm-dd"
    });
    
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
    
    var canvas_b = document.getElementById('drawing-b');
    var cxt_b = canvas_b.getContext('2d');
    var imageObj_b = new Image();
    var canvas = document.getElementById('drawing-f');
    var cxt = canvas.getContext('2d');
    var imageObj = new Image();
    
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
    
    $scope.hotspotsList = [];
    $scope.preFlag = false;
    
    $scope.openHotspots = function(){
        cxt.strokeStyle = "rgba(250,246,162,0.7)";
        cxt.fillStyle = "rgba(250,246,162,0.7)";
        canvas.onmousedown=function(evt){
            if($scope.preFlag){
                cxt.clearRect(0,0,1000,423);
                if($scope.hotspotsList.length > 1){
                    var index = $scope.hotspotsList.length - 2;
                    var image = new Image();
                    image.src = $scope.hotspotsList[index][0];
                    cxt.drawImage(image , 0 ,0);
                }
                $scope.hotspotsList.pop();
            }
            evt=window.event||evt;
            rectX=evt.pageX-this.offsetLeft-64;
            rectY=evt.pageY-this.offsetTop-176;
            $('#addHotspots').css('left',evt.pageX-400);
            $('#addHotspots').css('top',evt.pageY);
        }

        canvas.onmouseup=function(evt){
            evt=window.event||evt;
            var endX=evt.pageX-this.offsetLeft-64;
            var endY=evt.pageY-this.offsetTop-176;
            var rectW=endX-rectX;
            var rectH=endY-rectY;
            cxt.fillRect(rectX,rectY,rectW,rectH);
            $scope.preFlag = true;
            $scope.hotspotsList.push([canvas.toDataURL(),rectX,rectY,endX,endY]);
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
        cxt.clearRect(0,0,1000,423);
        if($scope.hotspotsList.length > 1){
            var index = $scope.hotspotsList.length - 2;
            var image = new Image();
            image.src = $scope.hotspotsList[index][0];
            cxt.drawImage(image , 0 ,0);
        }
        $scope.hotspotsList.pop();
    }
    
    $scope.openDrawing = function(type,event){
        if(type == 'brush'){
            $(".projectBuild-content-brush").show();
            $(".projectBuild-content-eraser").hide();
            $(".projectBuild-content-shape").hide();
            $scope.setBrushWidth(8);
            cxt.strokeStyle = '#000';
            cxt.fillStyle = '#000';
        }else if(type == 'eraser'){
            $(".projectBuild-content-brush").hide();
            $(".projectBuild-content-eraser").show();
            $(".projectBuild-content-shape").hide();
            $scope.setEraserWidth(8);
        }else if(type == 'shape'){
            $(".projectBuild-content-brush").hide();
            $(".projectBuild-content-eraser").hide();
            $(".projectBuild-content-shape").show();
            $scope.setPenWidth(0);
            cxt.strokeStyle = '#000';
            cxt.fillStyle = '#000';
        }
        event.stopPropagation();
    }
    
    $(document).on("click", function (){
        $(".projectBuild-content-brush").hide();
    });
    $(document).on("click", function (){
        $(".projectBuild-content-eraser").hide();
    });
    $(document).on("click", function (){
        $(".projectBuild-content-shape").hide();
    });
    
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
            
            var screenData = canvas.toDataURL();
            $http({
                url: 'http://conojoapp.scmreview.com/rest/screens/screen/'+$scope.activeScreenUuid+'/hotspots',
                method: 'POST',
                data: $.param({screen_uuid:$scope.activeScreenUuid,data:screenData}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function() {

            });
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
            
            var screenData = canvas.toDataURL();
            $http({
                url: 'http://conojoapp.scmreview.com/rest/screens/screen/'+$scope.activeScreenUuid+'/hotspots',
                method: 'POST',
                data: $.param({screen_uuid:$scope.activeScreenUuid,data:screenData}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function() {

            });
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
            
            var screenData = canvas.toDataURL();
            $http({
                url: 'http://conojoapp.scmreview.com/rest/screens/screen/'+$scope.activeScreenUuid+'/hotspots',
                method: 'POST',
                data: $.param({screen_uuid:$scope.activeScreenUuid,data:screenData}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function() {

            });
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
            
             var screenData = canvas.toDataURL();
            $http({
                url: 'http://conojoapp.scmreview.com/rest/screens/screen/'+$scope.activeScreenUuid+'/hotspots',
                method: 'POST',
                data: $.param({screen_uuid:$scope.activeScreenUuid,data:screenData}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function() {

            });
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
            
            var screenData = canvas.toDataURL();
            $http({
                url: 'http://conojoapp.scmreview.com/rest/screens/screen/'+$scope.activeScreenUuid+'/hotspots',
                method: 'POST',
                data: $.param({screen_uuid:$scope.activeScreenUuid,data:screenData}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function() {

            });
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
            
            var screenData = canvas.toDataURL();
            $http({
                url: 'http://conojoapp.scmreview.com/rest/screens/screen/'+$scope.activeScreenUuid+'/hotspots',
                method: 'POST',
                data: $.param({screen_uuid:$scope.activeScreenUuid,data:screenData}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function() {

            });
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
            
            var screenData = canvas.toDataURL();
            $http({
                url: 'http://conojoapp.scmreview.com/rest/screens/screen/'+$scope.activeScreenUuid+'/hotspots',
                method: 'POST',
                data: $.param({screen_uuid:$scope.activeScreenUuid,data:screenData}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function() {

            });
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
            
            var screenData = canvas.toDataURL();
            $http({
                url: 'http://conojoapp.scmreview.com/rest/screens/screen/'+$scope.activeScreenUuid+'/hotspots',
                method: 'POST',
                data: $.param({screen_uuid:$scope.activeScreenUuid,data:screenData}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function() {

            });
        }
        canvas.onmousemove=null;
        canvas.onmouseout=null;
    }
    
    $scope.init();
});
