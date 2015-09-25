'use strict';

angular.module('conojoApp')
    .service('userService', ['$http', '$q', '$log', 'LogglyLogger', 'ENV',
        function ($http, $q, $log, LogglyLogger, ENV) {

            /**
             * The user service that we will use to CRUD user objects
             */
            var userService = {

                login: function (username, password) {
                    $log.debug('Logging in user: ' + username);

                    return $http({
                        url: ENV.API_ENDPOINT + 'users/login',
                        method: 'POST',
                        data: $.param({username: username, password: password}),
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    }).then(function (response) {
                        return response.data;
                    }, function(error) {
                        $log.error('userService.login error: ' + angular.toJson(error));
                        return $q.reject(error);
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

            return userService;
        }]);
