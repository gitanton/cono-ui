'use strict';

angular.module('conojoApp')
    .service('videoService', ['$http', '$q', '$log', 'LogglyLogger', 'ENV',
        function ($http, $q, $log, LogglyLogger, ENV) {

            /**
             * The user service that we will use to CRUD user objects
             */
            var videoService = {

                getForProject: function (projectUUID) {
                    return $http({
                        url: ENV.API_ENDPOINT + 'videos/project/' + projectUUID,
                        method: 'GET',
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    }).then(function (response) {
                        return response.data
                    }, function (error) {
                        $log.error({msg: 'videoService.getForProject error', error: error});
                        return $q.reject(error.data);
                    });
                }
            };

            return videoService;
        }]);
