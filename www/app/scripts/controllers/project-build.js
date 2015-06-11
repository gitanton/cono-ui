'use strict';
/**
 * @ngdoc function
 * @name conojoApp.controller:ProjectBuildCtrl
 * @description
 * # ProjectBuildCtrl
 * Controller of the conojoApp
 */
angular.module('conojoApp')
    .controller('ProjectBuildCtrl', function ($scope, $http, $location, $routeParams, meetingFlag, currentUser, ENV, Upload) {
        $scope.CLOCK = null;
        $scope.shapeFill = false;
        $scope.showComments = false;
        $scope.showAddHotspots = false;
        $scope.showCommentBlue = true;
        $scope.showHotspotsBlue = true;
        $scope.showBrushBlue = true;
        $scope.showEraser = false;
        $scope.showShape = false;
        $scope.hotspotsLinkTo = 0;
        $scope.activeProjectUuid = $routeParams.puuid;
        $scope.activeScreenUuid = $routeParams.suuid;
        $scope.drawingArea = $(window).width() - 64;
        $scope.projectContent = $(window).height() - 176;
        $('.projectBuild-content-body').css('height', $scope.projectContent);
        $('#drawing-f').css('marginLeft', ($scope.drawingArea - 1100) / 2);
        $('#drawing-b').css('marginLeft', ($scope.drawingArea - 1100) / 2);

        $scope.comments = [];
        $scope.hotspots = [];

        $scope.init = function () {
            $http({
                url: ENV.API_ENDPOINT + 'projects/project/' + $scope.activeProjectUuid,
                method: 'GET',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function (data) {
                $scope.projectMembers = data.users;
                $scope.updateProjectTitle = data.name;
                $scope.updateProjectTypeid = data.type_id;
            });

            if($scope.activeScreenUuid !== 'new'){
                $http({
                    url: ENV.API_ENDPOINT + 'screens/screen/' + $scope.activeScreenUuid,
                    method: 'GET',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                }).success(function (data) {
                    $scope.comments = data.comments;
                    $scope.hotspots = data.hotspots;

                    for (var i = 0; i < $scope.comments; i++) {
                        //load all comments
                    }

                    for (var j = 0; j < $scope.hotspots; j++) {
                        //load all hotspots
                    }

                    var img_b_init = new Image();
                    img_b_init.src = data.url;
                    img_b_init.onload = function () {
                        cxt_b.drawImage(img_b_init, 0, 0, 1000, 423);
                    };
                });
            }

            $('#pickerBrush').farbtastic(function (color) {
                $scope.setPenColor(color);
            });
            $('#pickerShape').farbtastic(function (color) {
                $scope.setPenColor(color);
            });
            $scope.setPenWidth(0);
        };

        $scope.openUpdateProject = function () {
            $('#updateproject').modal('toggle');
        };

        $scope.updateMyProject = function (uuid) {
            $http({
                url: ENV.API_ENDPOINT + 'projects/project/' + uuid,
                method: 'PUT',
                data: {name: $scope.updateProjectTitle, type_id: $scope.updateProjectTypeid}
            }).success(function () {
                $scope.init();
                $('#updateproject').modal('hide');
            });
        };

        $scope.openAddScreen = function () {
            $('#addProjectScreen').modal('toggle');
        };

        $('#screenFile').on('change',function(){
            $('.addScreen-file-desc').html($(this).val().substr($(this).val().lastIndexOf('\\')+1));
        });

        $scope.addUploadScreen = function (files) {
            Upload.upload({
                url: ENV.API_ENDPOINT + 'screens/project/' + $scope.activeProjectUuid,
                method: 'POST',
                fields: {
                    'project_uuid': $scope.activeProjectUuid,
                    'url': $scope.screenUrl
                },
                file: files[0]
            }).success(function (data) {
                $('#addProjectScreen').modal('hide');
                $scope.activeScreenUuid = data.uuid;
                $location.replace('/project-build/' + $scope.activeProjectUuid + '/' + data.uuid);
            });
        };

        $scope.openAddProjectMember = function () {
            $('#addPeopleToProject').modal('toggle');
        };

        $scope.addProjectMember = function () {
            $http({
                url: ENV.API_ENDPOINT + 'projects/project/' + $scope.activeProjectUuid + '/invite',
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

        $scope.showSelectMember = function (event) {
            $(event.target).parent().find('.newMeeting-group').show();
            $(document).on('click', function () {
                $(event.target).parent().find('.newMeeting-group').hide();
            });
            event.stopPropagation();
        };

        $('.newMeeting-group').on('click', function (event) {
            event.stopPropagation();
        });

        $scope.addNewMeeting = function () {
            $http({
                url: ENV.API_ENDPOINT + 'meetings',
                method: 'POST',
                data: $.param({
                    notes: $scope.meetingMessage,
                    project_uuid: $scope.activeProjectUuid,
                    name: $scope.meetingName,
                    date: $scope.meetingDateTime.split(' ')[0],
                    time: $scope.meetingDateTime.split(' ')[1],
                    attendees: $scope.meetingGroup
                }),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function () {
                $scope.init();
                $('#newMeeting').modal('hide');
            });
        };

        $('.newMeeting-time').datetimepicker({
            dateFormat: 'yy-mm-dd'
        });

        $scope.showSelectMemberC = function (event) {
            $(event.target).parent().find('.comment-group').show();
            $(document).on('click', function () {
                $(event.target).parent().find('.comment-group').hide();
            });
            event.stopPropagation();
        };

        $('comment-group').on('click', function (event) {
            event.stopPropagation();
        });

        $scope.toScreen = function () {
            var url = '/project-screen/' + $scope.activeProjectUuid;
            $location.path(url);
        };

        $scope.toActivity = function () {
            var url = '/project-activity/' + $scope.activeProjectUuid;
            $location.path(url);
        };

        $scope.toComment = function () {
            var url = '/project-comment/' + $scope.activeProjectUuid;
            $location.path(url);
        };

        $scope.openMessage = function () {
            var url = '/message/' + $scope.activeProjectUuid;
            $location.path(url);
        };

        var canvas_b = document.getElementById('drawing-b');
        var cxt_b = canvas_b.getContext('2d');
        var canvas = document.getElementById('drawing-f');
        var cxt = canvas.getContext('2d');

        var rectX = 0;
        var rectY = 0;
        var polyX = 0;
        var polyY = 0;
        var arcX = 0;
        var arcY = 0;
        var eraserFlag = 0;

        $scope.setPenWidth = function (width) {
            switch (width) {
                case 0:
                    cxt.lineWidth = 8;
                    break;
                case 1:
                    cxt.lineWidth = 20;
                    break;
                case 2:
                    cxt.lineWidth = 30;
                    break;
                default:
                    cxt.lineWidth = 8;
            }
        };

        $scope.setPenColor = function (color) {
            cxt.strokeStyle = color;
            cxt.fillStyle = color;
        };

        $scope.openTools = function () {
            $scope.showCommentBlue = true;
            $scope.showHotspotsBlue = true;
            $scope.showBrushBlue = false;
            $scope.showEraser = true;
            $scope.showShape = true;
            $('.projectBuild-brush-black').siblings().removeClass('tools-li-selected');
            $scope.setBrushWidth(8);
            cxt.strokeStyle = '#000';
            cxt.fillStyle = '#000';
        };

        var commentNum = $scope.comments.length + 1;
        $scope.addCommentFlag = false;

        $scope.openComments = function () {
            $('#drawing-f').off();

            $scope.showAddHotspots = false;
            $scope.showCommentBlue = false;
            $scope.showHotspotsBlue = true;
            $scope.showBrushBlue = true;
            $scope.showEraser = false;
            $scope.showShape = false;
            $('.projectBuild-comment-black').siblings().removeClass('tools-li-selected');
            $('.projectBuild-comment-black').addClass('tools-li-selected');

            $('#drawing-f').on('mousedown', function (evt) {
                if ($scope.addCommentFlag) {
                    $('#commentMarker' + commentNum).remove();
                }

                evt = window.event || evt;
                rectX = evt.pageX - 64;
                rectY = evt.pageY - 176;
                console.log(rectX + '---' + rectY);

                if (evt.pageX > 400) {
                    $('#addComment').css('left', evt.pageX - 400);
                    $scope.addCommentPosition = false;
                } else {
                    $('#addComment').css('left', evt.pageX + 40);
                    $scope.addCommentPosition = true;
                }
                $('#addComment').css('top', evt.pageY);

                $('.projectBuild-content-drawing').append("<div id='commentMarker'" + commentNum + " class='commentSqure' style='left:" + rectX + "px;top:" + rectY + "px'>" + commentNum + "</div>");

                $scope.addCommentFlag = true;
                $scope.showComments = true;
                $scope.$apply();
            });
        };

        $scope.saveComments = function () {
            $http({
                //post the comment's content,left,top and  marker.
            }).success(function () {
                //update the commentNum

                $scope.showComments = false;
                $scope.addCommentFlag = false;
            });
        };

        $scope.hideComments = function () {
            $scope.showComments = false;
            if ($scope.addCommentFlag) {
                $('#commentMarker' + commentNum).remove();
            }
        };

        $(document).on('click','.commentSqure',function(){
            //open add comment and reply comment
        });

        var hotspotsNum = $scope.hotspots.length + 1;
        $scope.addHotspotsFlag = false;

        $scope.openHotspots = function () {
            $('#drawing-f').off();

            $scope.showComments = false;
            $scope.showCommentBlue = true;
            $scope.showHotspotsBlue = false;
            $scope.showBrushBlue = true;
            $scope.showEraser = false;
            $scope.showShape = false;
            $('.projectBuild-hotspots-black').siblings().removeClass('tools-li-selected');
            $('.projectBuild-hotspots-black').addClass('tools-li-selected');

            $('#drawing-f').on({
                mousedown: function (evt) {
                    if ($scope.addHotspotsFlag) {
                        $('#hotspotsMarker' + hotspotsNum).remove();
                    }

                    evt = window.event || evt;
                    rectX = evt.pageX - 64;
                    rectY = evt.pageY - 176;
                },
                mouseup: function (evt) {
                    evt = window.event || evt;
                    var endX = evt.pageX - 64;
                    var endY = evt.pageY - 176;
                    var rectW = endX - rectX;
                    var rectH = endY - rectY;
                    if (evt.pageX > 400) {
                        $('#addHotspots').css('left', evt.pageX - rectW - 400);
                    } else {
                        $('#addHotspots').css('left', evt.pageX + 10);
                    }
                    $('#addHotspots').css('top', evt.pageY - rectH);

                    $('.projectBuild-content-drawing').append("<div id='hotspotsMarker'" + hotspotsNum + " class='hotspotsSqure' style='left:" + rectX + "px;top:" + rectY + "px;width:" + rectW + "px;height:" + rectH + "px'></div>");

                    $scope.showAddHotspots = true;
                    $scope.addHotspotsFlag = true;
                    $scope.$apply();
                }
            });
        };

        $scope.saveAddHotspots = function () {
            $http({
                //post the hotspots's linkTo,left,top
            }).success(function () {
                //update the hotspotsNum

            });
            //save to the Server successfully
            $scope.showAddHotspots = false;
            $scope.addHotspotsFlag = false;
        };

        $scope.hideAddHotspots = function () {
            $scope.showAddHotspots = false;
            if ($scope.addHotspotsFlag) {
                $('#hotspotsMarker' + hotspotsNum).remove();
            }
        };

        $(document).on('click','.hotspotsSqure',function(){
            //link to some position
        });

        $scope.openDrawing = function (type, evt) {
            $('#drawing-f').off();

            evt = window.event || evt;
            $scope.showAddHotspots = false;
            $scope.showComments = false;
            $scope.showCommentBlue = true;
            $scope.showHotspotsBlue = true;
            $scope.showBrushBlue = false;
            $scope.showEraser = true;
            $scope.showShape = true;
            if (type === 'brush') {
                $('.projectBuild-content-brush').show();
                $('.projectBuild-content-eraser').hide();
                $('.projectBuild-content-shape').hide();
                $('.projectBuild-brush-black').siblings().removeClass('tools-li-selected');
                $('.projectBuild-brush-black').addClass('tools-li-selected');
                $scope.setBrushWidth(8);
                cxt.strokeStyle = '#000';
                cxt.fillStyle = '#000';
                $(document).on('click', function () {
                    $('.projectBuild-content-brush').hide();
                });
                $('.projectBuild-content-brush').on('click', function (evt) {
                    evt = window.event || evt;
                    evt.stopPropagation();
                });
            } else if (type === 'eraser') {
                $('.projectBuild-content-brush').hide();
                $('.projectBuild-content-eraser').show();
                $('.projectBuild-content-shape').hide();
                $('.projectBuild-eraser').siblings().removeClass('tools-li-selected');
                $('.projectBuild-eraser').addClass('tools-li-selected');
                $scope.setEraserWidth(8);
                $(document).on('click', function () {
                    $('.projectBuild-content-eraser').hide();
                });
                $('.projectBuild-content-eraser').on('click', function (evt) {
                    evt = window.event || evt;
                    evt.stopPropagation();
                });
            } else if (type === 'shape') {
                $('.projectBuild-content-brush').hide();
                $('.projectBuild-content-eraser').hide();
                $('.projectBuild-content-shape').show();
                $('.projectBuild-shape').siblings().removeClass('tools-li-selected');
                $('.projectBuild-shape').addClass('tools-li-selected');
                $scope.setPenWidth(0);
                cxt.strokeStyle = '#000';
                cxt.fillStyle = '#000';
                $(document).on('click', function () {
                    $('.projectBuild-content-shape').hide();
                });
                $('.projectBuild-content-shape').on('click', function (evt) {
                    evt = window.event || evt;
                    evt.stopPropagation();
                });
            }
            evt.stopPropagation();
        };

        $scope.shapeFillSwitch = function (type) {
            if (type === 'on') {
                $scope.shapeFill = true;
                $('.shapeFillSwitchOn').removeClass('shapeUnFillItem').addClass('shapeFillItem');
                $('.shapeFillSwitchOff').removeClass('shapeFillItem').addClass('shapeUnFillItem');
            } else if (type === 'off') {
                $scope.shapeFill = false;
                $('.shapeFillSwitchOff').removeClass('shapeUnFillItem').addClass('shapeFillItem');
                $('.shapeFillSwitchOn').removeClass('shapeFillItem').addClass('shapeUnFillItem');
            }
        };

        $scope.specicalColor = function (color) {
            cxt.strokeStyle = color;
            cxt.fillStyle = color;
        };

        $scope.setBrushWidth = function (width) {
            cxt.lineWidth = width;
            var flag = 0;
            canvas.onmousedown = function (evt) {
                evt = window.event || evt;
                var startX = evt.pageX - 64;
                var startY = evt.pageY - 176;
                cxt.beginPath();
                cxt.moveTo(startX, startY);
                flag = 1;
            };
            canvas.onmousemove = function (evt) {
                evt = window.event || evt;
                var endX = evt.pageX - 64;
                var endY = evt.pageY - 176;
                if (flag) {
                    cxt.lineTo(endX, endY);
                    cxt.stroke();
                }
            };
            canvas.onmouseup = function () {
                flag = 0;

                var screenData = canvas.toDataURL();
                $http({
                    url: ENV.API_ENDPOINT + 'screens/screen/' + $scope.activeScreenUuid + '/hotspots',
                    method: 'POST',
                    data: $.param({screen_uuid: $scope.activeScreenUuid, data: screenData}),
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                });
            };
            canvas.onmouseout = function () {
                flag = 0;
            };
        };

        $scope.setEraserWidth = function (width) {
            cxt.lineWidth = width;
            canvas.onmousedown = function (evt) {
                evt = window.event || evt;
                var eraserX = evt.pageX - 64;
                var eraserY = evt.pageY - 176;
                cxt.clearRect(eraserX - cxt.lineWidth, eraserY - cxt.lineWidth, cxt.lineWidth * 2, cxt.lineWidth * 2);
                eraserFlag = 1;
            };
            canvas.onmousemove = function (evt) {
                evt = window.event || evt;
                var eraserX = evt.pageX - 64;
                var eraserY = evt.pageY - 176;
                if (eraserFlag) {
                    cxt.clearRect(eraserX - cxt.lineWidth, eraserY - cxt.lineWidth, cxt.lineWidth * 2, cxt.lineWidth * 2);
                }
            };
            canvas.onmouseup = function () {
                eraserFlag = 0;

                var screenData = canvas.toDataURL();
                $http({
                    url: ENV.API_ENDPOINT + 'screens/screen/' + $scope.activeScreenUuid + '/hotspots',
                    method: 'POST',
                    data: $.param({screen_uuid: $scope.activeScreenUuid, data: screenData}),
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                });
            };
            canvas.onmouseout = function () {
                eraserFlag = 0;
            };
        };

        $scope.drawSquare = function () {
            canvas.onmousedown = function (evt) {
                evt = window.event || evt;
                rectX = evt.pageX - 64;
                rectY = evt.pageY - 176;
            };

            canvas.onmouseup = function (evt) {
                evt = window.event || evt;
                var endX = evt.pageX - 64;
                var endY = evt.pageY - 176;
                var rectW = endX - rectX;
                var rectH = endY - rectY;
                if ($scope.shapeFill) {
                    cxt.fillRect(rectX, rectY, rectW, rectH);
                } else {
                    cxt.strokeRect(rectX, rectY, rectW, rectH);
                }

                var screenData = canvas.toDataURL();
                $http({
                    url: ENV.API_ENDPOINT + 'screens/screen/' + $scope.activeScreenUuid + '/hotspots',
                    method: 'POST',
                    data: $.param({screen_uuid: $scope.activeScreenUuid, data: screenData}),
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                });
            };
            canvas.onmousemove = null;
            canvas.onmouseout = null;
        };

        $scope.drawTriangle = function () {
            canvas.onmousedown = function (evt) {
                evt = window.event || evt;
                polyX = evt.pageX - 64;
                polyY = evt.pageY - 176;
            };
            canvas.onmouseup = function (evt) {
                evt = window.event || evt;
                var endX = evt.pageX - 64;
                var endY = evt.pageY - 176;
                cxt.beginPath();
                cxt.moveTo(endX, endY);
                var lbX = 2 * polyX - endX;
                var lbY = endY;
                cxt.lineTo(lbX, lbY);
                var tmpC = 2 * (endX - polyX);
                var tmpA = endX - polyX;
                var tmpB = Math.sqrt(tmpC * tmpC - tmpA * tmpA);
                cxt.lineTo(polyX, endY - tmpB);
                cxt.closePath();

                if ($scope.shapeFill) {
                    cxt.fill();
                } else {
                    cxt.stroke();
                }

                var screenData = canvas.toDataURL();
                $http({
                    url: ENV.API_ENDPOINT + 'screens/screen/' + $scope.activeScreenUuid + '/hotspots',
                    method: 'POST',
                    data: $.param({screen_uuid: $scope.activeScreenUuid, data: screenData}),
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                });
            };
            canvas.onmousemove = null;
            canvas.onmouseout = null;
        };

        $scope.drawCircle = function () {
            canvas.onmousedown = function (evt) {
                evt = window.event || evt;
                arcX = evt.pageX - 64;
                arcY = evt.pageY - 176;
            };
            canvas.onmouseup = function (evt) {
                evt = window.event || evt;
                var endX = evt.pageX - 64;
                var endY = evt.pageY - 176;
                var a = endX - arcX;
                var b = endY - arcY;
                var c = Math.sqrt(a * a + b * b);
                cxt.beginPath();
                cxt.arc(arcX, arcY, c, 0, 360, false);
                cxt.closePath();

                if ($scope.shapeFill) {
                    cxt.fill();
                } else {
                    cxt.stroke();
                }

                var screenData = canvas.toDataURL();
                $http({
                    url: ENV.API_ENDPOINT + 'screens/screen/' + $scope.activeScreenUuid + '/hotspots',
                    method: 'POST',
                    data: $.param({screen_uuid: $scope.activeScreenUuid, data: screenData}),
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                });
            };
            canvas.onmousemove = null;
            canvas.onmouseout = null;
        };

        $scope.drawTalk = function () {
            canvas.onmousedown = function (evt) {
                evt = window.event || evt;
                polyX = evt.pageX - 64;
                polyY = evt.pageY - 176;
            };
            canvas.onmouseup = function (evt) {
                evt = window.event || evt;
                cxt.beginPath();
                cxt.moveTo(polyX, polyY);
                cxt.quadraticCurveTo(polyX - 18, polyY, polyX - 18, polyY + 15);
                cxt.quadraticCurveTo(polyX - 18, polyY + 27, polyX - 3, polyY + 27);
                cxt.quadraticCurveTo(polyX - 3, polyY + 32, polyX - 8, polyY + 35);
                cxt.quadraticCurveTo(polyX, polyY + 35, polyX + 3, polyY + 27);
                cxt.quadraticCurveTo(polyX + 18, polyY + 27, polyX + 18, polyY + 15);
                cxt.quadraticCurveTo(polyX + 18, polyY, polyX, polyY);
                cxt.fill();

                var screenData = canvas.toDataURL();
                $http({
                    url: ENV.API_ENDPOINT + 'screens/screen/' + $scope.activeScreenUuid + '/hotspots',
                    method: 'POST',
                    data: $.param({screen_uuid: $scope.activeScreenUuid, data: screenData}),
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                });
            };
            canvas.onmousemove = null;
            canvas.onmouseout = null;
        };

        $scope.drawArrow = function () {
            canvas.onmousedown = function (evt) {
                evt = window.event || evt;
                polyX = evt.pageX - 64;
                polyY = evt.pageY - 176;
            };
            canvas.onmouseup = function (evt) {
                evt = window.event || evt;
                cxt.beginPath();
                cxt.moveTo(polyX, polyY);
                cxt.lineTo(polyX + 20, polyY);
                cxt.lineTo(polyX + 20, polyY - 5);
                cxt.lineTo(polyX + 30, polyY + 5);
                cxt.lineTo(polyX + 20, polyY + 15);
                cxt.lineTo(polyX + 20, polyY + 10);
                cxt.lineTo(polyX, polyY + 10);
                cxt.closePath();
                cxt.fill();

                var screenData = canvas.toDataURL();
                $http({
                    url: ENV.API_ENDPOINT + 'screens/screen/' + $scope.activeScreenUuid + '/hotspots',
                    method: 'POST',
                    data: $.param({screen_uuid: $scope.activeScreenUuid, data: screenData}),
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                });
            };
            canvas.onmousemove = null;
            canvas.onmouseout = null;
        };

        $scope.drawStar = function () {
            canvas.onmousedown = function (evt) {
                evt = window.event || evt;
                polyX = evt.pageX - 64;
                polyY = evt.pageY - 176;
            };
            canvas.onmouseup = function (evt) {
                evt = window.event || evt;
                cxt.beginPath();
                cxt.moveTo(polyX, polyY);
                cxt.lineTo(polyX + 12, polyY);
                cxt.lineTo(polyX + 15, polyY - 10);
                cxt.lineTo(polyX + 18, polyY);
                cxt.lineTo(polyX + 30, polyY);
                cxt.lineTo(polyX + 20, polyY + 7);
                cxt.lineTo(polyX + 23, polyY + 20);
                cxt.lineTo(polyX + 15, polyY + 13);
                cxt.lineTo(polyX + 7, polyY + 20);
                cxt.lineTo(polyX + 10, polyY + 7);
                cxt.fill();

                var screenData = canvas.toDataURL();
                $http({
                    url: ENV.API_ENDPOINT + 'screens/screen/' + $scope.activeScreenUuid + '/hotspots',
                    method: 'POST',
                    data: $.param({screen_uuid: $scope.activeScreenUuid, data: screenData}),
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                });
            };
            canvas.onmousemove = null;
            canvas.onmouseout = null;
        };

        $scope.init();
    });
