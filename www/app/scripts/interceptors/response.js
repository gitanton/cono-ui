'use strict';

angular.module('conojoApp')
    .factory('ResponseInterceptor', function ($q, $location, $window) {
        return {
            responseError: function (response) {
                if (response.status === 401) {
                    $window.sessionStorage = {};
                    $location.path('/');
                }
                return $q.reject(response);
            }
        };
    });
