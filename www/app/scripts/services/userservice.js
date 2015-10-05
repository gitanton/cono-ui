'use strict';

angular.module('conojoApp')
    .service('userService', function ($http, $q, store, $log, LogglyLogger, ENV) {

            /**
             * The user service that we will use to CRUD user objects
             */
            var userService = {

                /**
                 * Return the user uuid
                 * @returns {*}
                 */
                getUserUUID: function() {
                    return store.get('user') ? store.get('user').uuid : null;
                },

                /**
                 * Return the full user object from local storage
                 * @returns {*}
                 */
                getUser: function() {
                    return store.get('user');
                },

                login: function (username, password) {
                    $log.debug('Logging in user: ' + username);

                    return $http({
                        url: ENV.API_ENDPOINT + 'users/login',
                        method: 'POST',
                        data: $.param({username: username, password: password}),
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    }).then(function (response) {
                        var user = response.data;
                        store.set('user', user);
                        return user;

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
        });
