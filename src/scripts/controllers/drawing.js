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
        $scope.type = 1; // Pen 1, Line 2, Arrow 3, Rectangle 4, Shape 5, Marker 6, Text 7, Eraser 8, Select 9
                        // Rectangle 10, Oval 11, Triangle 12, Star 13, Balloon 14, Arrow 15, Polygon 16, Diamon 17
        $scope.color = "black";
        $scope.width = 1;
        $scope.selection = {x1:0, y1:0, y1:0, y2:0};
        var isDragging = false, isSelectable = true, isSelected = false,
            context1, canvas1, context2, canvas2,
            pt1 = {x:0, y:0}, pt2 = {x:0, y:0},
            isTextEnable = false;

        $scope.init = function () {
            canvas1 = document.getElementById("drawingCanvas");
            context2 = canvas1.getContext("2d");
            canvas1.width = $(window).width();
            canvas1.height = $(window).height() * 8 / 10;

            canvas2 = document.getElementById("tempCanvas");
            context1 = canvas2.getContext("2d");
            canvas2.width = canvas1.width;
            canvas2.height = canvas1.height;

            initPalette();
            initWidth();
            initShapeWindow();
            if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/)) {
                initAppDrawingEvent();    
            }else{
                initWebDrawingEvent();
            }
        };

        $scope.init();

        // Init Palette for canvas1
        function initPalette(){
            var bCanPreview = true; // can preview

            // create canvas1 and context objects
            var pickerCanvas = document.getElementById('picker');
            var ctx = pickerCanvas.getContext('2d');

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
                    var canvasOffset = $(pickerCanvas).offset();
                    var canvasX = Math.floor(e.pageX - canvasOffset.left);
                    var canvasY = Math.floor(e.pageY - canvasOffset.top);

                    // get current pixel
                    var imageData = ctx.getImageData(canvasX, canvasY, 1, 1);
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

        function initWidth(){
            var bCanPreview = true;
            $('.drawing-tool-10').click(function(e) { // click event handler
               $('.widthcontroller').fadeToggle("slow", "linear");
                bCanPreview = !bCanPreview; 
            });

        }

        function initShapeWindow(){
            var bCanPreview = true;
            $('.drawing-tool-5').click(function(e) { // click event handler
               $('.shapecontroller').fadeToggle("slow", "linear");
                bCanPreview = !bCanPreview; 
            });

        }

        $scope.selectTool = function(type){
            $scope.type = type;
            for(var i = 1; i < 10; i++){
                if(i == type)
                {
                    $('.drawing-tool-' + i).addClass('selected');
                }
                else{
                    $('.drawing-tool-' + i).removeClass("selected");
                }
            }
        }

        $scope.selectWidth = function(width){
            $scope.width = width * 2;
            for(var i = 1; i < 6; i++){
                if(i == width)
                {
                    $('.btn-width-' + i).addClass('selected');
                }
                else{
                    $('.btn-width-' + i).removeClass("selected");
                }
            }
        }

        $scope.selectShape = function(shape){
            $scope.type = shape + 9;
            for(var i = 1; i < 9; i++){
                if(i == shape)
                {
                    $('.btn-shape-' + i).addClass('selected');
                }
                else{
                    $('.btn-shape-' + i).removeClass("selected");
                }
            }
        }

        $scope.fileOp = function(op){
            if(op == 1){

            }
            else if(op == 2){
                var c = canvas1, filename = "aab.png";
                var lnk = document.createElement('a'), e;

                /// the key here is to set the download attribute of the a tag
                lnk.download = filename;

                /// convert canvas content to data-uri for link. When download
                /// attribute is set the content pointed to by link will be
                /// pushed as "download" in HTML5 capable browsers
                lnk.href = c.toDataURL();

                /// create a "fake" click-event to trigger the download
                if (document.createEvent) {
                    e = document.createEvent("MouseEvents");
                    e.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                    lnk.dispatchEvent(e);
                } else if (lnk.fireEvent) {
                    lnk.fireEvent("onclick");
                }
            }
        }

        function processDownEvent(event){
            isDragging = true;
            context1.strokeStyle = $scope.color;
            context1.fillStyle = $scope.color;
            context1.lineWidth = $scope.width;
            switch($scope.type){
                case 1: // Pen
                case 6: // Marker
                case 8: // Eraser
                    context1.beginPath();
                    context1.moveTo(event.offsetX, event.offsetY);
                    break;
                case 2: // Line
                case 3: // Arrow
                case 10:// Rectangle
                case 4: // Rectangle
                case 5: // Shape
                case 9: // Selection
                case 11://Oval
                case 12:// Triangle
                case 13:// Star
                case 16: //Poly
                case 17: //Diamond
                case 14: // Speech Bubble
                    pt1.x = event.offsetX;
                    pt1.y = event.offsetY;
                    var leftX = Math.min($scope.selection.x1, $scope.selection.x2),
                        leftY = Math.min($scope.selection.y1, $scope.selection.y2),
                        absWidth = Math.abs($scope.selection.x1 - $scope.selection.x2),
                        absHeight = Math.abs($scope.selection.y1 - $scope.selection.y2);
                    if (leftX < pt1.x && leftX + absWidth > pt1.x && leftY < pt1.y && leftY + absHeight > pt1.y){
                        if(isSelected){
                            isSelectable = false;
                        }
                    }
                    else{
                        isSelectable = true;
                        context1.clearRect(0, 0, canvas2.width, canvas2.height);
                    }
                break;
                case 7:
                    if(!isTextEnable){
                        pt1.x = event.offsetX;
                        pt1.y = event.offsetY;
                        $('.canvasText').css("left", pt1.x + $(".canvasText").width() / 2);
                        $('.canvasText').css("top", pt1.y - 17);
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
        }

        function processMoveEvent(event){
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
                    case 10:
                        drawRectangle(context1, pt1.x, pt1.y, event.offsetX, event.offsetY, $scope.color);
                    break;
                    case 11:
                        drawCircle(context1, pt1.x, pt1.y, event.offsetX, event.offsetY, $scope.color);
                    break;
                    case 12:
                        pt2.x = event.offsetX, pt2.y = event.offsetY;
                        var triangleWidth = pt2.x - pt1.x;
                        var triangleHeight = pt2.y - pt1.y;
                        var triangleY = canvas1.height / 2 - triangleWidth / 2;
                        drawTriangle(context1, pt1.x, pt1.y, triangleWidth, triangleHeight, $scope.color);    
                    break;
                    case 13:
                        drawStar(context1, pt1.x, pt1.y, event.offsetX, event.offsetY, 5, $scope.color);
                    break;
                    case 14:
                        drawBubble(context1, pt1.x, pt1.y, event.offsetX, event.offsetY, $scope.color);
                    break;
                    case 16:
                        drawStar(context1, pt1.x, pt1.y, event.offsetX, event.offsetY, 6, $scope.color);
                    break;
                    case 17:
                        drawStar(context1, pt1.x, pt1.y, event.offsetX, event.offsetY, 4, $scope.color);
                    break;
                    case 6:
                        context1.lineTo(event.offsetX, event.offsetY);
                        context1.globalAlpha = 0.3;
                        context2.globalAlpha = 0.3;
                        context1.stroke();
                    break;
                    case 8:
                        context1.lineTo(event.offsetX, event.offsetY);
                        context1.strokeStyle = "white";
                        context1.stroke();
                    break;
                    case 9:
                        if(isSelectable){
                            context1.save();
                            context1.setLineDash([5]);
                            context1.strokeStyle = "black";
                            drawRectangle(context1, pt1.x, pt1.y, event.offsetX, event.offsetY, $scope.color);
                            isSelected = true;
                            context1.restore();
                        }
                    break;
                }
            }
        }

        function processUpEvent(){
            if(isDragging){
                isDragging = false;
                
                if($scope.type != 9)
                {
                    updateCanvas();    
                }
                context1.closePath();
            }
        }

        function drawTriangle(context, x, y, triangleWidth, triangleHeight, color){
            context.clearRect(0,0, canvas1.width, canvas1.height);
            context.beginPath();
            context.moveTo(x, y);
            context.lineTo(x + triangleWidth / 2, y + triangleHeight);
            context.lineTo(x - triangleWidth / 2, y + triangleHeight);
            context.lineTo(x, y);
            context.color = color;
            context.strokeStyle = color;
            context.stroke();
            context.closePath();
        }

        function drawRectangle(context, x1, y1, x2, y2, color){
            context.clearRect(0,0, canvas1.width, canvas1.height);
            context.beginPath();
            context.rect(x1, y1, x2 - x1, y2 - y1);
            context.stroke();
            context.closePath();
            if($scope.type == 9){
                $scope.selection = {x1:x1, y1:y1, x2:x2, y2:y2};
            }
        }

        function drawCircle(context, x1, y1, x2, y2, color){
            context.clearRect(0,0, canvas1.width, canvas1.height);
            context.beginPath();
            var width = Math.abs(x1 - x2),
                height = Math.abs(y1 - y2),
                centerX = Math.min(x1, x2) + width/2,
                centerY = Math.min(y1, y2) + height/2;

            context.moveTo(centerX, centerY - height/2); // A1

            context.bezierCurveTo(
            centerX + width/2, centerY - height/2, // C1
            centerX + width/2, centerY + height/2, // C2
            centerX, centerY + height/2); // A2

            context.bezierCurveTo(
            centerX - width/2, centerY + height/2, // C3
            centerX - width/2, centerY - height/2, // C4
            centerX, centerY - height/2); // A1
            context.strokeStyle = color;
            context.stroke();
            context.closePath();
        }

        function drawStar(context, x1, y1, x2, y2, spikes, color) {
            context.clearRect(0,0, canvas1.width, canvas1.height);
            context.beginPath();
            var width = Math.abs(x1 - x2),
                height = Math.abs(y1 - y2),
                cx = Math.min(x1, x2) + width/2,
                cy = Math.min(y1, y2) + height/2,
                outerRadius = width / 2,
                innerRadius = width / 4;

            var rot = Math.PI / 2 * 3;
            var x = cx;
            var y = cy;
            var step = Math.PI / spikes;

            context.moveTo(cx, cy - outerRadius);
            for (var i = 0; i < spikes; i++) {
                x = cx + Math.cos(rot) * outerRadius;
                y = cy + Math.sin(rot) * outerRadius;
                context.lineTo(x, y);
                rot += step;

                x = cx + Math.cos(rot) * innerRadius;
                y = cy + Math.sin(rot) * innerRadius;
                context.lineTo(x, y);
                rot += step;
            }
            context.lineTo(cx, cy - outerRadius);
            context.strokeStyle=color;
            context.stroke();
            context.closePath();
        }

        function drawBubble(context, x1, y1, x2, y2, color){
            context.clearRect(0,0, canvas1.width, canvas1.height);
            var w = Math.abs(x1 - x2),
                h = Math.abs(y1 - y2),
                radius = 20;
            var x = Math.min(x1, x2),
                y = Math.min(y1, y2);
            var r = x + w;
            var b = y + h;
            context.beginPath();
            context.strokeStyle=color;
            context.moveTo(x+radius, y);
            context.lineTo(x+radius/2, y-10);
            context.lineTo(x+radius * 2, y);
            context.lineTo(r-radius, y);
            context.quadraticCurveTo(r, y, r, y+radius);
            context.lineTo(r, y+h-radius);
            context.quadraticCurveTo(r, b, r-radius, b);
            context.lineTo(x+radius, b);
            context.quadraticCurveTo(x, b, x, b-radius);
            context.lineTo(x, y+radius);
            context.quadraticCurveTo(x, y, x+radius, y);
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
            var headlen = 8;
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
            context1.globalAlpha = 1;
            context2.globalAlpha = 1;
        }

        $(window).resize(function() {
            var canvas1 = document.getElementById("drawingCanvas");
            var canvas2 = document.getElementById("tempCanvas");
            canvas1.width = $(window).width();
            canvas1.height = $(window).height() * 8 / 10;
            canvas2.width = canvas1.width;
            canvas2.height = canvas1.height;
        });

        // Drawing Events for Web Application
        function initWebDrawingEvent(){
            $(".tempControl").bind('mousedown', function(event){
                processDownEvent({offsetX:event.offsetX, offsetY:event.offsetY});
            });

            $(".tempControl").bind('mousemove', function(event){
                processMoveEvent({offsetX:event.offsetX, offsetY:event.offsetY});
            });

            $(".tempControl").bind('mouseup', function(event){
                processUpEvent();
            });

            document.addEventListener( "keydown", function(e){
                if(isSelected && e.keyCode == 46){
                    context2.clearRect(Math.min($scope.selection.x1 , $scope.selection.x2), Math.min($scope.selection.y1 , $scope.selection.y2), Math.abs($scope.selection.x1 - $scope.selection.x2), Math.abs($scope.selection.y1 - $scope.selection.y2));
                    isSelected = false;
                    context1.clearRect(0, 0, canvas2.width, canvas2.height);
                }
            }, false );
        }

        // Drawing Events for Mobile Application
        function initAppDrawingEvent(){
            var pointOffset = 0;
            if(window.screen.width < 768)   pointOffset = 0;
            else pointOffset = 64;
            canvas2.addEventListener("touchstart", function(e) {
                var offsetX = e.touches[0].clientX - pointOffset,
                    offsetY = e.touches[0].clientY - $('.drawing-body').position().top ;
                processDownEvent({offsetX: offsetX , offsetY: offsetY});
            }, false);
            canvas2.addEventListener("touchmove", function(e) {
                var offsetX = e.touches[0].clientX - pointOffset,
                    offsetY = e.touches[0].clientY- $('.drawing-body').position().top;
                processMoveEvent({offsetX: offsetX , offsetY: offsetY});
            }, false);
            canvas2.addEventListener("touchend", function(e) {
                processUpEvent();
            }, false);
        }
    });
