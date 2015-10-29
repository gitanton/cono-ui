'use strict';

angular.module('conojoApp')
    .service('teamService', ['$http', '$q', '$log', 'LogglyLogger', 'ENV',
        function ($http, $q, $log, LogglyLogger, ENV) {

            /**
             * The user service that we will use to CRUD user objects
             */
            var teamService = {

                list: function () {
                    $log.debug({msg: 'listing teams'});

                    return $http({
                        url: ENV.API_ENDPOINT + 'teams',
                        method: 'GET',
                    }).then(function (response) {
                        return response.data;
                    }, function (error) {
                        $log.error({msg: 'teamService.list error', error: error});
                        return $q.reject(error.data);
                    });
                },

                get: function(uuid) {

                    return $http({
                        url: uuid ? ENV.API_ENDPOINT + 'teams/team/'+uuid : ENV.API_ENDPOINT + 'teams/team',
                        method: 'GET',
                    }).then(function (response) {
                        return response.data;
                    }, function (error) {
                        $log.error({msg: 'teamService.get error', error: error});
                        return $q.reject(error.data);
                    });
                }
            };

            return teamService;
        }]);
