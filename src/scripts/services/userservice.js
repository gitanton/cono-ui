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
                get: function(uuid) {
                    var deferred = $q.defer();
                    var user = store.get('user');
                    if(!uuid && user) {
                        deferred.resolve(user);
                    } else {

                        $http({
                            url: ENV.API_ENDPOINT + 'users/user/'+uuid,
                            method: 'GET',
                        }).then(function (response) {
                            var user = response.data;
                            store.set('user', user);
                            deferred.resolve(user);

                        }, function (error) {
                            $log.error({msg: 'userService.get error', error: error});
                            return $q.reject(error);
                        });
                    }

                    return deferred.promise;
                },

                login: function (username, password) {
                    $log.debug({msg: 'Logging in user', user: username});

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
                        $log.error({msg: 'userService.login error', error: error});
                        return $q.reject(error);
                    });
                },

                forgotPassword: function(email) {
                    $log.debug({msg: 'Fetching password: ', email: email});

                    return $http({
                        url: ENV.API_ENDPOINT + 'users/forgot_password',
                        method: 'POST',
                        data: $.param({email: email}),
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    }, function(error) {
                        $log.error({msg: 'userService.forgotPassword error', error: error});
                        return $q.reject(error);
                    });
                },

                /**
                 * Updates a user's password
                 * @param user
                 * @param password
                 * @return {*}
                 */
                changePassword: function (user, current, password) {
                    return $http({
                        url: ENV.API_ENDPOINT + 'users/password/',
                        data: {
                            current: current,
                            password: password
                        },
                        method: 'PUT'
                    }).then(function (response) {
                        return response.data;
                    }, function (error) {
                        $log.error({
                            msg: 'userService.changePassword error',
                            error: error
                        });
                        return $q.reject(error.data.message);
                    });
                },
            };

            return userService;
        });
