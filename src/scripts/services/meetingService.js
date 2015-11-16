'use strict';

angular.module('conojoApp')
    .service('meetingService', ['$http', '$q', '$log', 'LogglyLogger', 'ENV', '$window',
        function ($http, $q, $log, LogglyLogger, ENV, $window) {

            /**
             * The user service that we will use to CRUD user objects
             */
            var meetingService = {

                add: function (projectUUID, notes, name, date, attendees) {
                    var data = {
                        notes: notes,
                        project_uuid: projectUUID,
                        name: name,
                        date: $window.moment(date).format('YYYY-MM-DD'),
                        time: $window.moment(date).format('HH:mm:ss'),
                        attendees: attendees.join(',')
                    };

                    return $http({
                        url: ENV.API_ENDPOINT + 'meetings',
                        method: 'POST',
                        data: $.param(data),
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    }).then(function (response) {
                        return response;
                    }, function (error) {
                        $log.error({msg: 'meetingService.add error', error: error});
                        return $q.reject(error.data.message);
                    });
                }
            };

            return meetingService;
        }]);
