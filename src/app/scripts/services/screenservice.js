'use strict';

angular.module('conojoApp')
    .service('screenService', ['$http', '$q', '$log', 'LogglyLogger', 'ENV',
        function ($http, $q, $log, LogglyLogger, ENV) {

            /**
             * The user service that we will use to CRUD user objects
             */
            var screenService = {

                getForProject: function (projectUUID) {
                    return $http({
                        url: ENV.API_ENDPOINT + 'screens/project/' + projectUUID,
                        method: 'GET',
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    }).then(function (response) {
                        return response.data
                    }, function (error) {
                        $log.error({msg: 'screenService.getForProject error', error: error});
                        return $q.reject(error.data);
                    });
                }
            };

            return screenService;
        }]);
