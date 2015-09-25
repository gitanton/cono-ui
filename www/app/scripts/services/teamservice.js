'use strict';

angular.module('conojoApp')
    .service('teamService', ['$http', '$q', '$log', 'LogglyLogger', 'ENV',
        function ($http, $q, $log, LogglyLogger, ENV) {

            /**
             * The user service that we will use to CRUD user objects
             */
            var teamService = {

                list: function () {
                    $log.debug('listing teams');

                    return $http({
                        url: ENV.API_ENDPOINT + 'teams',
                        method: 'GET',
                    }).then(function (response) {
                        return response.data;
                    }, function (error) {
                        $log.error('teamService.list error: ' + angular.toJson(error));
                        return $q.reject(error.data);
                    });
                },

                get: function(uuid) {
                    $log.debug('getting team: ' + uuid);

                    return $http({
                        url: uuid ? ENV.API_ENDPOINT + 'teams/team/'+uuid : ENV.API_ENDPOINT + 'teams/team',
                        method: 'GET',
                    }).then(function (response) {
                        return response.data;
                    }, function (error) {
                        $log.error('teamService.get error: ' + angular.toJson(error));
                        return $q.reject(error.data);
                    });
                }
            };

            return teamService;
        }]);
