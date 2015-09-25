'use strict';

angular.module('conojoApp')
    .service('projectService', ['$http', '$q', '$log', 'LogglyLogger', 'ENV',
        function ($http, $q, $log, LogglyLogger, ENV) {

            /**
             * The user service that we will use to CRUD user objects
             */
            var projectService = {

                list: function (filters) {
                    $log.debug('listing projects');
                    var data = filters ? filters : {};

                    return $http({
                        url: ENV.API_ENDPOINT + 'projects',
                        method: 'GET',
                        data: data,
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    });
                },

                forgotPassword: function(email) {
                    $log.debug('Fetching password for: ' + email);

                    return $http({
                        url: ENV.API_ENDPOINT + 'users/forgot_password',
                        method: 'POST',
                        data: $.param({email: email}),
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    }, function(error) {
                        $log.error('userService.forgotPassword error: ' + angular.toJson(error));
                        return $q.reject(error);
                    });
                }
            };

            return projectService;
        }]);
