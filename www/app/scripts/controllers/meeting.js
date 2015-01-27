'use strict';

/**
 * @ngdoc function
 * @name conojoApp.controller:MeetingCtrl
 * @description
 * # MeetingCtrl
 * Controller of the conojoApp
 */
angular.module('conojoApp')
  .controller('MeetingCtrl', function ($scope,$http,$routeParams,meetingFlag) {
    $scope.startMeeting = false;
    $scope.CLOCK = null;
    $scope.meetingUuid = $routeParams.uuid;
    $scope.comments = {};
    
    $scope.startOneMeeting= function(){
        $http({
            url: 'http://conojoapp.scmreview.com/rest/utils/bootstrap',
            method: 'GET',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function(data) {
            Twilio.Device.setup(data.token);
            // get the phone number to connect the call to
            var params = {"PhoneNumber": '4155992671'};
            var connection = Twilio.Device.connect(params);
            connection.accept(function(conn) {
                /* Wait about 7 seconds to get through the announcement so we can send the digits */
                setTimeout(function() {
                    conn.sendDigits($scope.digits);
                }, 7000);
            });
            
            meetingFlag.startMeeting = true;
            $scope.startMeeting = meetingFlag.startMeeting;
            
            $scope.CLOCK = setInterval(function(){
                $scope.getChat();
            },2000);
        });
    }
    
    $scope.endOneMeeting= function(){
        $http({
            url: 'http://conojoapp.scmreview.com/rest/meetings/meeting/'+ $scope.meetingUuid +'/end',
            method: 'POST',
            data: $.param({uuid:$scope.meetingUuid}),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function() {
            Twilio.Device.disconnectAll();
            clearInterval($scope.CLOCK);
            meetingFlag.startMeeting = false;
            $scope.startMeeting = meetingFlag.startMeeting;
        });
    }
    
    $scope.sendChat = function(){
        $http({
            url: 'http://conojoapp.scmreview.com/rest/meetings/meeting/'+ $scope.meetingUuid +'/chat',
            method: 'POST',
            data: $.param({uuid:$scope.meetingUuid,comment:$scope.chatComment}),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function() {
            $scope.chatComment = '';
        });
    }
    
    $scope.getChat = function(){
        $http({
            url: 'http://conojoapp.scmreview.com/rest/meetings/meeting/'+ $scope.meetingUuid +'/chat',
            method: 'GET',
            data: $.param({uuid:$scope.meetingUuid}),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function(data){
            for(var i=0;i<data.length;i++){
                data[i].fullname = data[i].creator.fullname;
            }
            $scope.comments = data;
        });
    }
  });
