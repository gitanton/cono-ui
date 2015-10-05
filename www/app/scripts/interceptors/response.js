'use strict';

angular.module('conojoApp')
    .factory('ResponseInterceptor', function ($q, $location, store) {
        return {
            responseError: function (response) {
                if (response.status === 401) {
                    store.remove('user');
                    $location.path('/');
                }
                return $q.reject(response);
            }
        };
    });
