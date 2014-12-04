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
    var canvas = document.getElementById('drawing');
    var cxt = canvas.getContext('2d');
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
    
     $scope.brushTool = true;
     $scope.eraserTool = true;
     $scope.shapeTool = true;
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
        $(".projectBuild-content-brush").css('top',$scope.projectDrawing-305);
        $(".projectBuild-content-eraser").css('top',$scope.projectDrawing-90);
        $(".projectBuild-content-shape").css('top',$scope.projectDrawing-305);
        $(".projectBuild-content-tools").css('top',$scope.projectDrawing+10);
        $(".projectBuild-content-addScreens").css('top',$scope.projectDrawing+10);
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
        
        $('#pickerBrush').farbtastic(function(color){
            $scope.setPenColor(color);
        });
        $('#pickerShape').farbtastic(function(color){
            $scope.setPenColor(color);
        });
        $scope.setPenWidth(0);
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
    
    $scope.openUploadScreen = function(){
        $('#addProjectScreen').modal('toggle');
    };
    
    $scope.addUploadScreen = function(){
        $http({
            url: 'http://conojoapp.scmreview.com/rest/screens/project/'+$scope.activeProjectUuid,
            method: 'POST',
            data: $.param({project_uuid:$scope.activeProjectUuid,file:'1qaz2wsx3edc',url:$scope.screenUrl}),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function() {
            $('#addProjectScreen').modal('hide');
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
    
    $scope.openDrawing = function(type){
        if(type == 'brush'){
            $scope.brushTool = false;
            $scope.eraserTool = true;
            $scope.shapeTool = true;
            $scope.setBrushWidth(8);
            cxt.strokeStyle = '#000';
            cxt.fillStyle = '#000';
        }else if(type == 'eraser'){
            $scope.brushTool = true;
            $scope.eraserTool = false;
            $scope.shapeTool = true;
            $scope.setEraserWidth(8);
        }else if(type == 'shape'){
            $scope.brushTool = true;
            $scope.eraserTool = true;
            $scope.shapeTool = false;
            cxt.strokeStyle = '#000';
            cxt.fillStyle = '#000';
        }
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
            cxt.strokeRect(rectX,rectY,rectW,rectH);
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
            cxt.stroke();
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
            cxt.stroke();
        }
        canvas.onmousemove=null;
        canvas.onmouseout=null;
    };
    
    $scope.init();
});
