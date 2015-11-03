'use strict';
/**
 * @ngdoc function
 * @name conojoApp.controller:ProjectBuildTemplateCtrl
 * @description
 * # ProjectBuildTemplateCtrl
 * Controller of the conojoApp
 */
angular.module('conojoApp')
    .controller('ProjectBuildTemplateCtrl', function ($scope, $http, $location, $routeParams, ENV, ModalService) {
        $scope.isTask = 1;
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
        $scope.drawLeft = ($scope.drawingArea - 790) / 2;
        $('.projectBuild-content-body').css('height', $scope.projectContent);
        $('.projectBuild-content-drawing').css('marginLeft', $scope.drawLeft);
        var commentNum = 1;
        var hotspotsNum = 1;

        $scope.comments = [];
        $scope.hotspots = [];

        $scope.init = function () {
            $http({
                url: ENV.API_ENDPOINT + 'projects/project/' + $scope.activeProjectUuid,
                method: 'GET',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then(function (response) {
                var data = response.data;
                $scope.projectMembers = data.users;
                $scope.updateProjectTitle = data.name;
                $scope.updateProjectTypeid = data.type_id;
            });

            $http({
                url: ENV.API_ENDPOINT + 'screens/screen/' + $scope.activeScreenUuid,
                method: 'GET',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then(function (response) {
                var data = response.data;
                hotspotsNum = data.hotspots.length + 1;

                if (data.drawings.length > 0) {
                    var img_f_init = new Image();
                    img_f_init.src = 'data:image/png;base64,' + data.drawings[data.drawings.length - 1].data.slice(9);
                    img_f_init.onload = function () {
                        cxt.drawImage(img_f_init, 0, 0, 790, 440);
                    };
                }

                if (data.hotspots.length > 0) {
                    for (var j = 0; j < data.hotspots.length; j++) {
                        var left = data.hotspots[j].begin_x + $scope.drawLeft;
                        var currentH = j + 1;
                        $('.projectBuild-content-drawing').append("<div data-linkto='" + data.hotspots[j].link_to + "' id='hotspotsMarker" + currentH + "' class='hotspotsSqure' style='left:" + left + "px;top:" + data.hotspots[j].begin_y + "px;width:" + data.hotspots[j].end_x + "px;height:" + data.hotspots[j].end_y + "px'></div>");
                    }
                }

                var img_b_init = new Image();
                img_b_init.src = data.url;
                var img_width = data.image_width;
                var img_height = data.image_height;
                img_b_init.onload = function () {
                    if (img_width <= 790 && img_height <= 440) {
                        cxt_b.drawImage(img_b_init, 0, 0, img_width, img_height);
                    } else {
                        cxt_b.drawImage(img_b_init, 0, 0, 790, 440);
                    }
                };
            });

            $http({
                url: ENV.API_ENDPOINT + 'screens/screen/' + $scope.activeScreenUuid + '/comments',
                method: 'GET',
                data: $.param({screen_uuid: $scope.activeScreenUuid}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then(function (response) {
                var data = response.data;
                if (data.length > 0) {
                    for (var i = 0; i < data.length; i++) {
                        //group the comment
                        var num = data[i].marker;
                        if (!$scope.comments[num]) {
                            $scope.comments[num] = num;
                            commentNum = num + 1;
                            var left = data[i].begin_x + $scope.drawLeft;
                            $('.projectBuild-content-drawing').append("<div data-beginx='" + currentCommentLeft + "' data-beginy='" + currentCommentTop + "' data-comment='" + num + "' id='commentMarker" + num + "' class='commentSqure' style='left:" + left + "px;top:" + data[i].begin_y + "px'>" + num + "</div>");
                        }
                    }
                }
            });

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
            }).then(function () {
                $scope.init();
                $('#updateproject').modal('hide');
            });
        };

        $scope.openAddScreen = function () {
            var url = '/project-templateSelect/' + $scope.activeProjectUuid;
            $location.path(url);
        };

        $scope.openAddProjectMember = function () {
            $scope.memberEmail = '';
            $('#addPeopleToProject').modal('toggle');
        };

        $scope.addProjectMember = function () {
            $http({
                url: ENV.API_ENDPOINT + 'projects/project/' + $scope.activeProjectUuid + '/invite',
                method: 'POST',
                data: $.param({uuid: $scope.activeProjectUuid, email: $scope.memberEmail}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then(function () {
                $scope.init();
                $('#addPeopleToProject').modal('hide');
            }, function (data) {
                $('#addPeopleToProject').modal('hide');
                $('.reset-note').html(data.message);
                $('#statusNotice').modal('toggle');
            });
        };

        /**
         * Open the modal to create a new meeting for the project
         * @returns Modal The modal that is created
         */
        $scope.openNewMeeting = function () {
            return ModalService.showModal({
                templateUrl: 'views/modal/new-meeting.html',
                controller: 'ModalNewMeetingCtrl',
                inputs: {
                    projectMembers: $scope.projectMembers,
                    projectUUID: $scope.activeProjectUuid
                }
            }).then(function (modal) {
                modal.element.modal();
            });
        };

        $scope.toScreen = function () {
            var url = '/project-screen-template/' + $scope.activeProjectUuid;
            $location.path(url);
        };

        $scope.toActivity = function () {
            var url = '/project-activity-template/' + $scope.activeProjectUuid;
            $location.path(url);
        };

        $scope.toComment = function () {
            var url = '/project-comment-template/' + $scope.activeProjectUuid;
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

        $scope.addCommentFlag = false;
        var rectCommentX = 0;
        var rectCommentY = 0;
        var currentCommentLeft = 0;
        var currentCommentTop = 0;

        $scope.openComments = function () {
            $('#drawing-f').off();
            if ($scope.addHotspotsFlag) {
                $('#hotspotsMarker' + hotspotsNum).remove();
                $scope.addHotspotsFlag = false;
            }

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
                rectCommentX = evt.pageX - 64;
                rectCommentY = evt.pageY - 176;
                currentCommentLeft = evt.pageX - this.offsetLeft - 64;
                currentCommentTop = evt.pageY - this.offsetTop - 176;

                if (evt.pageX > 400) {
                    $('#addComment').css('left', evt.pageX - 400);
                    $scope.addCommentPosition = false;
                } else {
                    $('#addComment').css('left', evt.pageX + 40);
                    $scope.addCommentPosition = true;
                }
                $('#addComment').css('top', evt.pageY);

                $('.projectBuild-content-drawing').append("<div data-beginx='" + currentCommentLeft + "' data-beginy='" + currentCommentTop + "' data-comment='" + commentNum + "' id='commentMarker" + commentNum + "' class='commentSqure' style='left:" + rectCommentX + "px;top:" + rectCommentY + "px'>" + commentNum + "</div>");
                $('.comment-add').data('marker', commentNum);

                $scope.currentComments = [];
                $scope.commentContent = '';
                $scope.commentRecipients = '';

                $(".js-example-basic-multiple").select2({
                    templateResult: function (state) {
                        return $('<p>' + state.text + '<span class="glyphicon glyphicon-ok" aria-hidden="true"></span></p>');
                    }
                }).val('');
                $(".select2-selection__choice").remove();

                $scope.addCommentFlag = true;
                $scope.showComments = true;
                $scope.$apply();
            });
        };

        $scope.saveComments = function (event) {
            $http({
                //post the comment's content,left,top and  marker.
                url: ENV.API_ENDPOINT + 'screens/screen/' + $scope.activeScreenUuid + '/comments',
                method: 'POST',
                data: $.param({
                    screen_uuid: $scope.activeScreenUuid,
                    content: $scope.commentContent,
                    is_task: $scope.isTask,
                    marker: $(event.target).parents('.comment-add').data('marker'),
                    assignee_uuid: $scope.commentRecipients.join(','),
                    begin_x: currentCommentLeft,
                    begin_y: currentCommentTop
                }),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then(function (response) {
                var data = response.data;
                //update the commentNum
                if (data.marker > commentNum) {
                    commentNum++;
                }

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

        $(document).on('click', '.commentSqure', function (evt) {
            //open add comment and reply comment
            $scope.currentComments = [];
            $scope.currentComments = [];
            $scope.commentContent = '';
            $scope.commentRecipients = '';

            $(".js-example-basic-multiple").select2({
                templateResult: function (state) {
                    return $('<p>' + state.text + '<span class="glyphicon glyphicon-ok" aria-hidden="true"></span></p>');
                }
            }).val('');
            $(".select2-selection__choice").remove();
            var addMarker = $(this).data('comment');
            var addBeginx = $(this).data('beginx');
            // var addBeginy = $(this).data('beginy');

            console.log('click comments ' + $(this).data('comment'));
            $http({
                url: ENV.API_ENDPOINT + 'screens/screen/' + $scope.activeScreenUuid + '/comments/search',
                method: 'POST',
                data: $.param({screen_uuid: $scope.activeScreenUuid, filter: JSON.stringify({marker: addMarker})}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then(function (response) {
                var data = response.data;
                $scope.currentComments = data;
                if (evt.pageX > 400) {
                    $('#addComment').css('left', addBeginx + $scope.drawLeft - 336);
                    $scope.addCommentPosition = false;
                } else {
                    $('#addComment').css('left', addBeginx + $scope.drawLeft + 104);
                    $scope.addCommentPosition = true;
                }
                $('#addComment').css('top', evt.pageY);
                $('.comment-add').data('marker', addMarker);
                $scope.addCommentFlag = true;
                $scope.showComments = true;
            });
        });

        $scope.addHotspotsFlag = false;
        var rectHotspotsX = 0;
        var rectHotspotsY = 0;
        var rectHotspotsW = 0;
        var rectHotspotsH = 0;
        var currentHotspotsLeft = 0;
        var currentHotspotsTop = 0;

        $scope.openHotspots = function () {
            $('#drawing-f').off();
            if ($scope.addCommentFlag) {
                $('#commentMarker' + commentNum).remove();
                $scope.addCommentFlag = false;
            }

            $scope.showComments = false;
            $scope.showCommentBlue = true;
            $scope.showHotspotsBlue = false;
            $scope.showBrushBlue = true;
            $scope.showEraser = false;
            $scope.showShape = false;
            $('.projectBuild-hotspots-black').siblings().removeClass('tools-li-selected');
            $('.projectBuild-hotspots-black').addClass('tools-li-selected');

            $('#drawing-f').on('mousedown', function (evt) {
                if ($scope.addHotspotsFlag) {
                    $('#hotspotsMarker' + hotspotsNum).remove();
                }

                evt = window.event || evt;
                rectHotspotsX = evt.pageX - 64;
                rectHotspotsY = evt.pageY - 176;
            });

            $('#drawing-f').on('mouseup', function (evt) {
                evt = window.event || evt;
                var endX = evt.pageX - 64;
                var endY = evt.pageY - 176;
                rectHotspotsW = endX - rectHotspotsX;
                rectHotspotsH = endY - rectHotspotsY;
                currentHotspotsLeft = evt.pageX - this.offsetLeft - rectHotspotsW - 64;
                currentHotspotsTop = evt.pageY - this.offsetTop - rectHotspotsH - 176;
                if (evt.pageX - rectHotspotsW > 400) {
                    $('#addHotspots').css('left', evt.pageX - rectHotspotsW - 400);
                    $scope.addHotspotsPosition = false;
                } else {
                    $('#addHotspots').css('left', evt.pageX + 10);
                    $scope.addHotspotsPosition = true;
                }
                $('#addHotspots').css('top', evt.pageY - rectHotspotsH);

                $('.projectBuild-content-drawing').append("<div data-linkto='' id='hotspotsMarker" + hotspotsNum + "' class='hotspotsSqure' style='left:" + rectHotspotsX + "px;top:" + rectHotspotsY + "px;width:" + rectHotspotsW + "px;height:" + rectHotspotsH + "px'></div>");

                $scope.hotspotsLinkTo = '';

                $scope.showAddHotspots = true;
                $scope.addHotspotsFlag = true;
                $scope.$apply();
            });
        };

        $scope.saveAddHotspots = function () {
            $http({
                //post the comment's content,left,top and  marker.
                url: ENV.API_ENDPOINT + 'screens/screen/' + $scope.activeScreenUuid + '/hotspots',
                method: 'POST',
                data: $.param({
                    screen_uuid: $scope.activeScreenUuid,
                    begin_x: currentHotspotsLeft,
                    begin_y: currentHotspotsTop,
                    end_x: rectHotspotsW,
                    end_y: rectHotspotsH,
                    link_to: $scope.hotspotsLinkTo
                }),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then(function () {
                //update the commentNum
                $('#hotspotsMarker' + hotspotsNum).data('linkto', $scope.hotspotsLinkTo);
                hotspotsNum++;

                //save to the Server successfully
                $scope.showAddHotspots = false;
                $scope.addHotspotsFlag = false;
            });
        };

        $scope.hideAddHotspots = function () {
            $scope.showAddHotspots = false;
            if ($scope.addHotspotsFlag) {
                $('#hotspotsMarker' + hotspotsNum).remove();
            }
        };

        $(document).on('click', '.hotspotsSqure', function () {
            //link to some position
            console.log('click hotspots ' + $(this).data('linkto'));
            // $location.path('/project-build/' + $scope.activeProjectUuid + '/' + $(this).data('linkto'));
        });

        $scope.openTools = function () {
            if ($scope.addCommentFlag) {
                $('#commentMarker' + commentNum).remove();
                $scope.addCommentFlag = false;
            }

            if ($scope.addHotspotsFlag) {
                $('#hotspotsMarker' + hotspotsNum).remove();
                $scope.addHotspotsFlag = false;
            }

            $scope.showAddHotspots = false;
            $scope.showComments = false;

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

        $scope.openDrawing = function (type, evt) {
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
            $('#drawing-f').off();
            cxt.lineWidth = width;
            var flag = 0;
            $('#drawing-f').on('mousedown', function (evt) {
                evt = window.event || evt;
                var startX = evt.pageX - this.offsetLeft - 64;
                var startY = evt.pageY - this.offsetTop - 176;
                cxt.beginPath();
                cxt.moveTo(startX, startY);
                flag = 1;
            });

            $('#drawing-f').on('mousemove', function (evt) {
                evt = window.event || evt;
                var endX = evt.pageX - this.offsetLeft - 64;
                var endY = evt.pageY - this.offsetTop - 176;
                if (flag) {
                    cxt.lineTo(endX, endY);
                    cxt.stroke();
                }
            });

            $('#drawing-f').on('mouseup', function () {
                flag = 0;

                var screenData = canvas.toDataURL();
                $http({
                    url: ENV.API_ENDPOINT + 'screens/screen/' + $scope.activeScreenUuid + '/drawings',
                    method: 'POST',
                    data: $.param({screen_uuid: $scope.activeScreenUuid, data: screenData}),
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                });
            });

            $('#drawing-f').on('mouseout', function () {
                flag = 0;
            });
        };

        $scope.setEraserWidth = function (width) {
            $('#drawing-f').off();
            cxt.lineWidth = width;
            $('#drawing-f').on('mousedown', function (evt) {
                evt = window.event || evt;
                var eraserX = evt.pageX - this.offsetLeft - 64;
                var eraserY = evt.pageY - this.offsetTop - 176;
                cxt.clearRect(eraserX - cxt.lineWidth, eraserY - cxt.lineWidth, cxt.lineWidth * 2, cxt.lineWidth * 2);
                eraserFlag = 1;
            });
            $('#drawing-f').on('mousemove', function (evt) {
                evt = window.event || evt;
                var eraserX = evt.pageX - this.offsetLeft - 64;
                var eraserY = evt.pageY - this.offsetTop - 176;
                if (eraserFlag) {
                    cxt.clearRect(eraserX - cxt.lineWidth, eraserY - cxt.lineWidth, cxt.lineWidth * 2, cxt.lineWidth * 2);
                }
            });
            $('#drawing-f').on('mouseup', function () {
                eraserFlag = 0;

                var screenData = canvas.toDataURL();
                $http({
                    url: ENV.API_ENDPOINT + 'screens/screen/' + $scope.activeScreenUuid + '/drawings',
                    method: 'POST',
                    data: $.param({screen_uuid: $scope.activeScreenUuid, data: screenData}),
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                });
            });
            $('#drawing-f').on('mouseout', function () {
                eraserFlag = 0;
            });
        };

        $scope.drawSquare = function () {
            $('#drawing-f').off();
            $('#drawing-f').on('mousedown', function (evt) {
                evt = window.event || evt;
                rectX = evt.pageX - this.offsetLeft - 64;
                rectY = evt.pageY - this.offsetTop - 176;
            });

            $('#drawing-f').on('mouseup', function (evt) {
                evt = window.event || evt;
                var endX = evt.pageX - this.offsetLeft - 64;
                var endY = evt.pageY - this.offsetTop - 176;
                var rectW = endX - rectX;
                var rectH = endY - rectY;
                if ($scope.shapeFill) {
                    cxt.fillRect(rectX, rectY, rectW, rectH);
                } else {
                    cxt.strokeRect(rectX, rectY, rectW, rectH);
                }

                var screenData = canvas.toDataURL();
                $http({
                    url: ENV.API_ENDPOINT + 'screens/screen/' + $scope.activeScreenUuid + '/drawings',
                    method: 'POST',
                    data: $.param({screen_uuid: $scope.activeScreenUuid, data: screenData}),
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                });
            });
        };

        $scope.drawTriangle = function () {
            $('#drawing-f').off();
            $('#drawing-f').on('mousedown', function (evt) {
                evt = window.event || evt;
                polyX = evt.pageX - this.offsetLeft - 64;
                polyY = evt.pageY - this.offsetTop - 176;
            });
            $('#drawing-f').on('mouseup', function (evt) {
                evt = window.event || evt;
                var endX = evt.pageX - this.offsetLeft - 64;
                var endY = evt.pageY - this.offsetTop - 176;
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
                    url: ENV.API_ENDPOINT + 'screens/screen/' + $scope.activeScreenUuid + '/drawings',
                    method: 'POST',
                    data: $.param({screen_uuid: $scope.activeScreenUuid, data: screenData}),
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                });
            });
        };

        $scope.drawCircle = function () {
            $('#drawing-f').off();
            $('#drawing-f').on('mousedown', function (evt) {
                evt = window.event || evt;
                arcX = evt.pageX - this.offsetLeft - 64;
                arcY = evt.pageY - this.offsetTop - 176;
            });
            $('#drawing-f').on('mouseup', function (evt) {
                evt = window.event || evt;
                var endX = evt.pageX - this.offsetLeft - 64;
                var endY = evt.pageY - this.offsetTop - 176;
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
                    url: ENV.API_ENDPOINT + 'screens/screen/' + $scope.activeScreenUuid + '/drawings',
                    method: 'POST',
                    data: $.param({screen_uuid: $scope.activeScreenUuid, data: screenData}),
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                });
            });
        };

        $scope.drawTalk = function () {
            $('#drawing-f').off();
            $('#drawing-f').on('mousedown', function (evt) {
                evt = window.event || evt;
                polyX = evt.pageX - this.offsetLeft - 64;
                polyY = evt.pageY - this.offsetTop - 176;
            });
            $('#drawing-f').on('mouseup', function (evt) {
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
                    url: ENV.API_ENDPOINT + 'screens/screen/' + $scope.activeScreenUuid + '/drawings',
                    method: 'POST',
                    data: $.param({screen_uuid: $scope.activeScreenUuid, data: screenData}),
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                });
            });
        };

        $scope.drawArrow = function () {
            $('#drawing-f').off();
            $('#drawing-f').on('mousedown', function (evt) {
                evt = window.event || evt;
                polyX = evt.pageX - this.offsetLeft - 64;
                polyY = evt.pageY - this.offsetTop - 176;
            });
            $('#drawing-f').on('mouseup', function (evt) {
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
                    url: ENV.API_ENDPOINT + 'screens/screen/' + $scope.activeScreenUuid + '/drawings',
                    method: 'POST',
                    data: $.param({screen_uuid: $scope.activeScreenUuid, data: screenData}),
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                });
            });
        };

        $scope.drawStar = function () {
            $('#drawing-f').off();
            $('#drawing-f').on('mousedown', function (evt) {
                evt = window.event || evt;
                polyX = evt.pageX - this.offsetLeft - 64;
                polyY = evt.pageY - this.offsetTop - 176;
            });
            $('#drawing-f').on('mouseup', function (evt) {
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
                    url: ENV.API_ENDPOINT + 'screens/screen/' + $scope.activeScreenUuid + '/drawings',
                    method: 'POST',
                    data: $.param({screen_uuid: $scope.activeScreenUuid, data: screenData}),
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                });
            });
        };

        $scope.init();
    });
