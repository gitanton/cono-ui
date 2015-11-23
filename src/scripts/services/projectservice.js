'use strict';

angular.module('conojoApp')
    .service('projectService', ['$http', '$q', '$log', 'LogglyLogger', 'ENV',
        function ($http, $q, $log, LogglyLogger, ENV) {

            /**
             * The user service that we will use to CRUD user objects
             */
            var projectService = {

                add: function (name, typeId) {
                    var data = {
                        name: name,
                        type_id: typeId
                    };

                    return $http({
                        url: ENV.API_ENDPOINT + 'projects',
                        method: 'POST',
                        data: $.param(data),
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    }).then(function (response) {
                        return response;
                    }, function (error) {
                        $log.error({msg: 'projectService.add error', error: error});
                        return $q.reject(error);
                    });
                },

                list: function (filters) {
                    var data = filters ? filters : {};

                    return $http({
                        url: ENV.API_ENDPOINT + 'projects',
                        method: 'GET',
                        data: data,
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    }).then(function (response) {
                        return response;
                    }, function (error) {
                        $log.error({msg: 'projectService.list error', error: error});
                        return $q.reject(error);
                    });
                },

                reorder: function (uuids) {
                    return $http({
                        url: ENV.API_ENDPOINT + 'projects/ordering',
                        method: 'POST',
                        data: $.param({uuids: uuids}),
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    }).then(function (response) {
                        return response;
                    }, function (error) {
                        $log.error({msg: 'projectService.reorder error: ', error: error});
                        return $q.reject(error.data);
                    });
                },

                invite: function(uuid, user_uuid) {
                    return $http({
                        url: ENV.API_ENDPOINT + 'projects/project/' + uuid + '/invite',
                        method: 'POST',
                        data: $.param({user_uuid: user_uuid}),
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    }).then(function (response) {
                        return response;
                    }, function (error) {
                        $log.error({msg: 'projectService.invite error: ', error: error});
                        return $q.reject(error.data.error);
                    });
                }
            };

            return projectService;
        }]);
