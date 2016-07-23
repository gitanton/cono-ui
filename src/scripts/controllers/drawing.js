'use strict';

/**
 * @ngdoc function
 * @name conojoApp.controller:DrawingCtrl
 * @description
 * # DrawingCtrl
 * Controller of the conojoApp
 */
angular.module('conojoApp')
    .controller('DrawingCtrl', function ($rootScope, $scope, $http, ENV, NAV) {

        // Drawing Variables
        $scope.type = 1; // Pen 1, Line 2, Arrow 3, Rectangle 4, Shape 5, Marker 6, Text 7, Eraser 8
        $scope.color = "black";

        var isDragging = false,
            drawingCtx, canvas,
            objectsList = [],
            pensList = [],
            tempPointList = [],
            pt1 = {x:0, y:0}, pt2 = {x:0, y:0},
            isTextEnable = false;

        var CObject = function(){
            this.type = 1; // 
            this.color = "black";
            this.pt1 = {x:0, y:0};
            this.pt2 = {x:0, y:0};
            this.width = 1;
        };

        $scope.init = function () {
            canvas = document.getElementById("drawingCanvas");
            drawingCtx = canvas.getContext("2d");
            canvas.width = $(window).width();
            canvas.height = $(window).height() / 10 * 7;
            initPalette();
            initWebDrawingEvent();
            initAppDrawingEvent();
        };

        $scope.init();

        // Init Palette for Canvas
        function initPalette(){
            var bCanPreview = true; // can preview

            // create canvas and context objects
            var canvas = document.getElementById('picker');
            var ctx = canvas.getContext('2d');

            // drawing active image
            var image = new Image();
            image.onload = function () {
                ctx.drawImage(image, 0, 0, image.width, image.height); // draw the image on the canvas
            }

            // select desired colorwheel
            var imageSrc = 'images/palette.png';
            image.src = imageSrc;

            $('#picker').mousemove(function(e) { // mouse move handler
                if (bCanPreview) {
                    // get coordinates of current position
                    var canvasOffset = $(canvas).offset();
                    var canvasX = Math.floor(e.pageX - canvasOffset.left);
                    var canvasY = Math.floor(e.pageY - canvasOffset.top);

                    // get current pixel
                    var imageData = ctx.getImageData(canvasX, canvasY, 1, 1);
                    var pixel = imageData.data;

                    // update preview color
                    var pixelColor = "rgb("+pixel[0]+", "+pixel[1]+", "+pixel[2]+")";
                    $('.preview').css('backgroundColor', pixelColor);
                    $scope.color = pixelColor;
                    drawingCtx.strokeStyle = pixelColor;
                    // update controls
                    $('#rVal').val(pixel[0]);
                    $('#gVal').val(pixel[1]);
                    $('#bVal').val(pixel[2]);
                    $('#rgbVal').val(pixel[0]+','+pixel[1]+','+pixel[2]);

                    var dColor = pixel[2] + 256 * pixel[1] + 65536 * pixel[0];
                    $('#hexVal').val('#' + ('0000' + dColor.toString(16)).substr(-6));
                }
            });
            $('#picker').click(function(e) { // click event handler
                bCanPreview = !bCanPreview;
            }); 
            $('.preview').click(function(e) { // preview click
                $('.colorpicker').fadeToggle("slow", "linear");
                bCanPreview = true;
            });
        }

        // Drawing Events for Web Application
        function initWebDrawingEvent(){

            $(".drawingControl").bind('mousedown', function(event){
                isDragging = true;
                
                drawingCtx.beginPath();
                drawingCtx.strokeStyle = $scope.color;
                drawingCtx.fillStyle = $scope.color;
                switch($scope.type){
                    case 1: // Pen
                        pt1.x = event.offsetX;
                        pt1.y = event.offsetY;
                        tempPointList.push(pt1);
                    break;
                    case 2: // Line
                    case 3: // Arrow
                    case 4: // Rectangle
                    case 5: // Shape
                    case 6: // Marker
                    case 8: // Eraser
                        pt1.x = event.offsetX;
                        pt1.y = event.offsetY;
                    break;
                    case 7:
                        if(!isTextEnable){
                            pt1.x = event.offsetX;
                            pt1.y = event.offsetY;
                            $('.canvasText').css("left", pt1.x + canvas.getBoundingClientRect().left);
                            $('.canvasText').css("top", pt1.y + canvas.getBoundingClientRect().top - 17);
                            $('.canvasText').css("display", "block");
                            isTextEnable = true;
                        }
                        else{
                            drawingCtx.font = "16px Arial";
                            drawingCtx.fillText($('.canvasText').val(), pt1.x, pt1.y);
                            $('.canvasText').val("");
                            $('.canvasText').css("display", "none");
                            isTextEnable = false;
                        }
                    break;
                }

            });

            $(".drawingControl").bind('mousemove', function(event){
                if(isDragging){
                    switch($scope.type){
                        case 1:
                            drawingCtx.strokeStyle = $scope.color;
                            drawLine(drawingCtx, pt1.x, pt1.y, event.offsetX, event.offsetY, $scope.color);
                            pt1.x = event.offsetX, pt1.y = event.offsetY;
                            tempPointList.push(pt1);
                        break;
                        case 2:
                            redrawCanvas();
                            pt2.x = event.offsetX, pt2.y = event.offsetY;
                            drawLine(drawingCtx, pt1.x, pt1.y, pt2.x, pt2.y, $scope.color);
                        break;
                        case 3:
                            redrawCanvas();
                            drawingCtx.lineTo(pt1.x, pt1.y);
                            drawingCtx.strokeStyle = $scope.color;
                            pt2.x = event.offsetX, pt2.y = event.offsetY;

                            // Draw ArrowHead
                            var headlen = 10;
                            var angle = Math.atan2(pt2.y - pt1.y, pt2.x - pt1.x);
                            drawingCtx.lineTo(pt2.x, pt2.y);
                            drawingCtx.lineTo(pt2.x - headlen * Math.cos( angle - Math.PI / 6), pt2.y - headlen * Math.sin( angle - Math.PI / 6));
                            drawingCtx.moveTo(pt2.x, pt2.y);
                            drawingCtx.lineTo(pt2.x - headlen * Math.cos( angle + Math.PI / 6), pt2.y - headlen * Math.sin( angle + Math.PI / 6));
                            drawingCtx.stroke();
                        break;
                        case 4:
                            redrawCanvas();
                            drawingCtx.strokeStyle = $scope.color;
                            pt2.x = event.offsetX, pt2.y = event.offsetY;
                            drawingCtx.rect(pt1.x, pt1.y, pt2.x - pt1.x, pt2.y - pt1.y);
                            drawingCtx.stroke();
                        break;
                        case 5:
                            redrawCanvas();
                            pt2.x = event.offsetX, pt2.y = event.offsetY;
                            var triangleWidth = pt2.x - pt1.x;
                            var triangleHeight = pt2.y - pt1.y;
                            var triangleY = canvas.height / 2 - triangleWidth / 2;
                            drawTriangle(drawingCtx, pt1.x, pt1.y, triangleWidth, triangleHeight, $scope.color);    
                        break;
                        case 6:
                            pt1.x = event.offsetX, pt1.y = event.offsetY;
                            drawingCtx.lineTo(pt1.x, pt1.y);
                            drawingCtx.lineWidth = 8;
                            drawingCtx.stroke();
                        break;
                        case 8:
                            pt1.x = event.offsetX, pt1.y = event.offsetY;
                            drawingCtx.lineTo(pt1.x, pt1.y);
                            drawingCtx.strokeStyle = "white";
                            drawingCtx.lineWidth = 15;
                            drawingCtx.stroke();
                        break;
                    }
                }
            });

            $(".drawingControl").bind('mouseup', function(event){
                isDragging = false;
                switch($scope.type){
                    case 1:
                        pensList.push({pointList:tempPointList, color:$scope.color});
                        tempPointList = [];
                    break;
                    case 2:
                    break;
                    case 3:
                    break;
                }
                drawingCtx.closePath();
            });

            function drawTriangle(context, x, y, triangleWidth, triangleHeight, color){
                context.moveTo(x, y);
                context.lineTo(x + triangleWidth / 2, y + triangleHeight);
                context.lineTo(x - triangleWidth / 2, y + triangleHeight);
                context.closePath();
                context.color = color;
                context.strokeStyle = color;
                context.stroke();
            }

            function drawLine(context, x1, y1, x2, y2, color){
                context.moveTo(x1, y1);
                context.lineTo(x2, y2);
                context.closePath();
                context.color = color;
                context.strokeStyle = color;
                context.stroke();
            }

            function redrawCanvas(){
                canvas.width = canvas.width;

                // Draw/Redraw all drawings
                //Pen
                
                for(var index = 0; index < pensList.length; index ++){
                    drawingCtx.beginPath();
                    var penDrawingItem = pensList[index];
                    var color = penDrawingItem['color'];
                    for(var i = 1; i < penDrawingItem['pointList'].length; i ++){
                        var firstPoint = penDrawingItem['pointList'][i - 1],
                            lastPoint = penDrawingItem['pointList'][i];
                        drawLine(drawingCtx, firstPoint.x, firstPoint.y, lastPoint.x, lastPoint.y, color);
                    }
                }

            }

            $( window ).resize(function() {
                var canvas = document.getElementById("drawingCanvas");
                canvas.width = $(window).width();
                canvas.height = $(window).height() / 10 * 7;
            });
        }

        // Drawing Events for Mobile Application

        function initAppDrawingEvent(){

        }
    });
