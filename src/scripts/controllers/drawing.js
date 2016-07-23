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
        $scope.type = 2; // Pen 1, Line 2, Arrow 3, Rectangle 4, Shape 5, Marker 6, Text 7, Eraser 8
        $scope.color = "black";

        var isDragging = false,
            context1, canvas1, context2, canvas2,
            pt1 = {x:0, y:0}, pt2 = {x:0, y:0},
            isTextEnable = false;

        $scope.init = function () {
            canvas1 = document.getElementById("drawingCanvas");
            context2 = canvas1.getContext("2d");
            canvas1.width = $(window).width();
            canvas1.height = $(window).height() / 10 * 7;

            canvas2 = document.getElementById("tempCanvas");
            context1 = canvas2.getContext("2d");
            canvas2.width = canvas1.width;
            canvas2.height = canvas1.height;
            initPalette();
            initWebDrawingEvent();
            initAppDrawingEvent();
        };

        $scope.init();

        // Init Palette for canvas1
        function initPalette(){
            var bCanPreview = true; // can preview

            // create canvas1 and context objects
            var canvas1 = document.getElementById('picker');
            var ctx = canvas1.getContext('2d');

            // drawing active image
            var image = new Image();
            image.onload = function () {
                ctx.drawImage(image, 0, 0, image.width, image.height); // draw the image on the canvas1
            }

            // select desired colorwheel
            var imageSrc = 'images/palette.png';
            image.src = imageSrc;

            $('#picker').mousemove(function(e) { // mouse move handler
                if (bCanPreview) {
                    // get coordinates of current position
                    var canvas1Offset = $(canvas1).offset();
                    var canvas1X = Math.floor(e.pageX - canvas1Offset.left);
                    var canvas1Y = Math.floor(e.pageY - canvas1Offset.top);

                    // get current pixel
                    var imageData = ctx.getImageData(canvas1X, canvas1Y, 1, 1);
                    var pixel = imageData.data;

                    // update preview color
                    var pixelColor = "rgb("+pixel[0]+", "+pixel[1]+", "+pixel[2]+")";
                    $('.preview').css('backgroundColor', pixelColor);
                    $scope.color = pixelColor;
                    context1.strokeStyle = pixelColor;
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

            $(".tempControl").bind('mousedown', function(event){
                isDragging = true;
        
                context1.strokeStyle = $scope.color;
                context1.fillStyle = $scope.color;
                switch($scope.type){
                    case 1: // Pen
                        context1.beginPath();
                        context1.moveTo(event.offsetX, event.offsetY);
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
                            $('.canvasText').css("left", pt1.x + $(".canvasText").width() / 2);
                            $('.canvasText').css("top", pt1.y);
                            $('.canvasText').css("display", "block");
                            isTextEnable = true;
                        }
                        else{
                            context1.font = "16px Arial";
                            context1.fillText($('.canvasText').val(), pt1.x, pt1.y);
                            $('.canvasText').val("");
                            $('.canvasText').css("display", "none");
                            isTextEnable = false;
                        }
                    break;
                }

            });

            $(".tempControl").bind('mousemove', function(event){
                if(isDragging){
                    switch($scope.type){
                        case 1:
                            context1.lineTo(event.offsetX, event.offsetY);
                            context1.stroke();
                        break;
                        case 2:
                            drawLine(context1, pt1.x, pt1.y, event.offsetX, event.offsetY, $scope.color);
                        break;
                        case 3:
                            drawArrow(context1, pt1.x, pt1.y, event.offsetX, event.offsetY, $scope.color);
                        break;
                        case 4:
                            drawRectangle(context1, pt1.x, pt1.y, event.offsetX, event.offsetY, $scope.color);
                        break;
                        case 5:
                            pt2.x = event.offsetX, pt2.y = event.offsetY;
                            var triangleWidth = pt2.x - pt1.x;
                            var triangleHeight = pt2.y - pt1.y;
                            var triangleY = canvas1.height / 2 - triangleWidth / 2;
                            drawTriangle(context1, pt1.x, pt1.y, triangleWidth, triangleHeight, $scope.color);    
                        break;
                        case 6:
                            context1.lineTo(event.offsetX, event.offsetY);
                            context1.lineWidth = 8;
                            context1.stroke();
                        break;
                        case 8:
                            context1.lineTo(event.offsetX, event.offsetY);
                            context1.strokeStyle = "white";
                            context1.lineWidth = 15;
                            context1.stroke();
                        break;
                    }
                }
            });

            $(".tempControl").bind('mouseup', function(event){
                if(isDragging){
                    isDragging = false;
                    updateCanvas();    
                }
                
            });

            function drawTriangle(context, x, y, triangleWidth, triangleHeight, color){
                context.clearRect(0,0, canvas1.width, canvas1.height);
                context.beginPath();
                context.moveTo(x, y);
                context.lineTo(x + triangleWidth / 2, y + triangleHeight);
                context.lineTo(x - triangleWidth / 2, y + triangleHeight);
                context.color = color;
                context.strokeStyle = color;
                context.stroke();
                context.closePath();
            }

            function drawRectangle(context, x1, y1, x2, y2, color){
                context.clearRect(0,0, canvas1.width, canvas1.height);
                context.beginPath();
                pt2.x = event.offsetX, pt2.y = event.offsetY;
                context.rect(x1, y1, x2 - x1, y2 - y1);
                context.stroke();
                context.closePath();
            }

            function drawLine(context, x1, y1, x2, y2, color){
                context.clearRect(0,0, canvas1.width, canvas1.height);
                context.beginPath();
                context.moveTo(x1, y1);
                context.lineTo(x2, y2);
                context.color = color;
                context.strokeStyle = color;
                context.stroke();
                context.closePath();
            }

            function drawArrow(context, x1, y1, x2, y2, color){
                context.clearRect(0,0, canvas1.width, canvas1.height);
                context.beginPath();
                context.moveTo(x1, y1);
                context.strokeStyle = color;
                // Draw ArrowHead
                var headlen = 10;
                var angle = Math.atan2(y2 - y1, x2 - x1);
                context.lineTo(x2, y2);
                context.lineTo(x2 - headlen * Math.cos( angle - Math.PI / 6), y2 - headlen * Math.sin( angle - Math.PI / 6));
                context.moveTo(x2, y2);
                context.lineTo(x2 - headlen * Math.cos( angle + Math.PI / 6), y2 - headlen * Math.sin( angle + Math.PI / 6));
                context.stroke();
                context.closePath();
            }

            function updateCanvas(){
                context2.drawImage(canvas2, 0, 0);
                context1.clearRect(0, 0, canvas2.width, canvas2.height);
            }

            $( window ).resize(function() {
                var canvas1 = document.getElementById("drawingCanvas");
                var canvas2 = document.getElementById("tempCanvas");
                canvas1.width = $(window).width();
                canvas1.height = $(window).height() / 10 * 7;
                canvas2.width = canvas1.width;
                canvas2.height = canvas1.height;
            });
        }

        // Drawing Events for Mobile Application

        function initAppDrawingEvent(){

        }
    });
