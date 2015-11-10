'use strict';

/**
 * @ngdoc function
 * @name conojoApp.controller:headerCtrl
 * @description
 * # headerCtrl
 * Controller of the conojoApp
 */
angular.module('conojoApp')
    .controller('headerCtrl', function ($scope, $http, $location, ENV, NAV) {
        $scope.meetingDetails = true;
        $scope.startMeeting = false;
        $scope.chatContainer = true;
        $scope.CLOCK = null;
        $scope.comments = [];
        $scope.meetingDate = [];

        $scope.showCalendar = function (evt) {
            $http({
                url: ENV.API_ENDPOINT + 'meetings',
                method: 'GET'
            }).then(function (response) {
                var data = response.data;
                if (data.length > 0) {
                    for (var i = 0; i < data.length; i++) {
                        $scope.meetingDate.push(data[i].date);
                    }
                }

                $('#datetimepicker').datepicker({
                    dateFormat: 'yy-mm-dd',
                    beforeShowDay: function (dt) {
                        var datestring = jQuery.datepicker.formatDate('yy-mm-dd', dt);
                        var hindex = $.inArray(datestring, $scope.meetingDate);
                        if (hindex > -1) {
                            return [true, 'ui-state-active', 'Show meetings in today'];
                        } else {
                            return [false, '', 'There is no meeting in today'];
                        }
                    },
                    onSelect: function (date) {
                        $http({
                            url: ENV.API_ENDPOINT + 'meetings/?date=' + date,
                            method: 'GET'
                        }).then(function (response) {
                            $scope.selectDateMeetings = response.data;
                        });
                        $('#meetingDetail').modal('toggle');
                    }
                });
                $('#datetimepicker').show();
                evt.stopPropagation();
            });
        };

        $(document).on('click', function () {
            $('#datetimepicker').hide();
        });

        $('#datetimepicker').on('click', function (evt) {
            evt = window.event || evt;
            evt.stopPropagation();
        });

        $scope.startOneMeeting = function (uuid) {
            $scope.meetingDetails = false;
            $scope.joinTheMeeting = uuid;
        };

        $scope.joinOneMeeting = function () {
            $('#meetingDetail').modal('hide');
            $scope.digits = '';
            $http({
                url: ENV.API_ENDPOINT + 'utils/bootstrap',
                method: 'GET',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then(function (response) {
                Twilio.Device.setup(response.data.token);
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
                url: ENV.API_ENDPOINT + 'meetings/meeting/' + $scope.joinTheMeeting + '/end',
                method: 'POST',
                data: $.param({uuid: $scope.joinTheMeeting}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then(function () {
                Twilio.Device.disconnectAll();
                clearInterval($scope.CLOCK);
                $scope.startMeeting = false;
            });
        };

        $scope.sendChat = function () {
            $http({
                url: ENV.API_ENDPOINT + 'meetings/meeting/' + $scope.joinTheMeeting + '/chat',
                method: 'POST',
                data: $.param({uuid: $scope.joinTheMeeting, comment: $scope.chatComment}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then(function () {
                $scope.chatComment = '';
            }, function (error) {
                $('.reset-note').html(error.message);
                $('#statusNotice').modal('toggle');
            });
        };

        $scope.getChat = function () {
            $http({
                url: ENV.API_ENDPOINT + 'meetings/meeting/' + $scope.joinTheMeeting + '/chat',
                method: 'GET',
                data: $.param({uuid: $scope.joinTheMeeting}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then(function (response) {
                var data = response.data;
                for (var i = 0; i < response.data.length; i++) {
                    data[i].fullname = data[i].creator.fullname;
                }
                $scope.comments = data;
            });
        };

        $scope.chatUp = function () {
            $scope.chatContainer = true;
        };

        $scope.chatDown = function () {
            $scope.chatContainer = false;
        };

        $scope.goToMessages = function () {
            var url = '/message';
            $location.path(url);
        };

        $scope.reasons = [{id: 1, text: 'reason one'}, {id: 2, text: 'reason two'}, {
            id: 3,
            text: 'reason three'
        }, {id: 4, text: 'reason four'}, {id: 5, text: 'reason five'}];

        $scope.openFeedBack = function () {
            $(".js-example-basic-single").select2({
                templateResult: function (state) {
                    return $('<p>' + state.text + '<span class="glyphicon glyphicon-ok" aria-hidden="true"></span></p>');
                },
                minimumResultsForSearch: Infinity,
                data: $scope.reasons,
            });
            $(".js-example-basic-single").select2('val', '');
            $('#addFeedback').modal('toggle');
        };

        $scope.addNewFeedBack = function () {
            //add new feedback
        };
    });

