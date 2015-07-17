
'use strict';

/**
 * @ngdoc function
 * @name conojoApp.controller:headerCtrl
 * @description
 * # headerCtrl
 * Controller of the conojoApp
 */
angular.module('conojoApp')
    .controller('headerCtrl', function ($scope, $http, $location, ENV) {
        $scope.meetingDetails = true;
        $scope.startMeeting = false;
        $scope.chatContainer = true;
        $scope.CLOCK = null;
        $scope.comments = {};

        $scope.showCalendar = function (evt) {
            $http({
                url: ENV.API_ENDPOINT + 'meetings',
                method: 'GET',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function (data) {
                $scope.meetings = data;
            });

            $('#datetimepicker').datepicker({
                dateFormat: 'yy-mm-dd',
                // beforeShowDay : function(){
                //    //get all meeting for this user
                //    // for(var i = 0;i < $scope.meetings.length;i++){
                //    //      if(dt === $scope.meetings[i].date){
                //    //          return [true, 'red', 'Show meetings in today'];
                //    //      }
                //    // }
                // },
                onSelect: function () {
                    $('#meetingDetail').modal('toggle');
                }
            });
            $('#datetimepicker').show();
            evt.stopPropagation();
        };

        $(document).on('click', function () {
            $('#datetimepicker').hide();
        });

        $('#datetimepicker').on('click', function (evt) {
            evt = window.event || evt;
            evt.stopPropagation();
        });

        $scope.startOneMeeting = function(){
            $scope.meetingDetails = false;
        };

        $scope.joinOneMeeting = function () {
            $('#meetingDetail').modal('hide');
            $scope.digits = '';
            $http({
                url: ENV.API_ENDPOINT + 'utils/bootstrap',
                method: 'GET',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function (data) {
                Twilio.Device.setup(data.token);
                // get the phone number to connect the call to
                var params = {'PhoneNumber': '4155992671'};
                var connection = Twilio.Device.connect(params);
                connection.accept(function (conn) {
                    /* Wait about 7 seconds to get through the announcement so we can send the digits */
                    setTimeout(function () {
                        conn.sendDigits($scope.digits);
                    }, 7000);
                });

                $scope.startMeeting = true;

                $scope.CLOCK = setInterval(function () {
                    $scope.getChat();
                }, 2000);
            });
        };

        $scope.endOneMeeting = function () {
            $http({
                url: ENV.API_ENDPOINT + 'meetings/meeting/' + $scope.meetingUuid + '/end',
                method: 'POST',
                data: $.param({uuid: $scope.meetingUuid}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function () {
                Twilio.Device.disconnectAll();
                clearInterval($scope.CLOCK);
                $scope.startMeeting = false;
            });
        };

        $scope.sendChat = function () {
            $http({
                url: ENV.API_ENDPOINT + 'meetings/meeting/' + $scope.meetingUuid + '/chat',
                method: 'POST',
                data: $.param({uuid: $scope.meetingUuid, comment: $scope.chatComment}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function () {
                $scope.chatComment = '';
            }).error(function(data){
                $('.reset-note').html(data.message);
                $('#statusNotice').modal('toggle');
            });
        };

        $scope.getChat = function () {
            $http({
                url: ENV.API_ENDPOINT + 'meetings/meeting/' + $scope.meetingUuid + '/chat',
                method: 'GET',
                data: $.param({uuid: $scope.meetingUuid}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function (data) {
                for (var i = 0; i < data.length; i++) {
                    data[i].fullname = data[i].creator.fullname;
                }
                $scope.comments = data;
            });
        };

        $scope.chatUp = function(){
            $scope.chatContainer = true;
        };

        $scope.chatDown = function(){
            $scope.chatContainer = false;
        };

        $scope.goToMessages = function () {
            var url = '/message';
            $location.path(url);
        };

        $scope.openFeedBack = function(){
            $('#addFeedback').modal('toggle');
        };

        $scope.addNewFeedBack = function(){
            //add new feedback
        };
    });

