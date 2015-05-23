'use strict';
/**
 * @ngdoc function
 * @name conojoApp.controller:ProjectCtrl
 * @description
 * # ProjectCtrl
 * Controller of the conojoApp
 */
angular.module('conojoApp')
    .controller('ProjectCtrl', function ($scope, $http, $location, currentUser, ENV) {
        $scope.projecttype = 0;
        $scope.projecttitle = "";
        $scope.projectContent = $(window).height() - 128;
        $(".project-content").css('height', $scope.projectContent);

//    $('.project-content').jScrollPane();

        $scope.init = function () {
            $http({
                url: ENV.API_ENDPOINT + 'projects',
                method: 'GET',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function (data) {
                    $scope.projects = data;
                    $scope.projectsNum = $scope.projects.length;
                });
        };

        $scope.newProject = function () {
            $('#newproject').modal('toggle');
        };

        $scope.operateProject = function (project) {
            if (project.is_open) {
                project.is_open = false;
            } else {
                project.is_open = true;
            }
        };

        $scope.showGear = function (is_open) {
            if (is_open) {
                return 'project-content-gear-a-selected';
            } else {
                return 'project-content-gear-a';
            }
        };

        $scope.showBackground = function (is_open) {
            if (is_open) {
                return 'project-content-gear-background';
            } else {
                return 'project-content-gear-nobackground';
            }
        };

        $scope.showOperate = function (is_open) {
            if (is_open) {
                return 'project-content-operate-show';
            } else {
                return 'project-content-operate-hide';
            }
        };

        $scope.myProject = function () {
            $http({
                url: ENV.API_ENDPOINT + 'projects',
                method: 'POST',
                data: $.param({name: $scope.projecttitle, type_id: $scope.projecttype}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function () {
                    $scope.init();
                    $('#newproject').modal('hide');
                });
        };

        $scope.projectScreen = function (uuid, type) {
            if (type == 1) {
                $location.path('/project-screen/' + uuid);
            } else if (type == 2) {
                $http({
                    url: ENV.API_ENDPOINT + 'videos/project/' + uuid,
                    method: 'GET',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                }).success(function (data) {
                        if (data.length == 0) {
                            $location.path('/project-video/' + uuid);
                        } else {
                            $location.path('/project-videoPlay/' + uuid + '/' + data[0].uuid);
                        }
                    });
            } else if (type == 3) {
                //
            }
        }

        $scope.duplicateProjectModal = function (uuid, name) {
            $('#duplicateproject').modal('toggle');
            $scope.duplicateProjectUuid = uuid;
            $scope.duplicateProjectName = name;
        };

        $scope.duplicateProject = function (uuid) {
            $http({
                url: ENV.API_ENDPOINT + 'projects/project/' + uuid + '/duplicate',
                method: 'POST',
                data: $.param({uuid: $scope.duplicateProjectUuid, name: $scope.duplicateProjectName + '-Copy'}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function () {
                    $scope.init();
                    $('#duplicateproject').modal('hide');
                });
        };

        $scope.shareProjectModal = function (uuid) {
            $('#shareproject').modal('toggle');
            $scope.shareProjectUuid = uuid;
        };

        $scope.shareProject = function (uuid) {
            $http({
                url: ENV.API_ENDPOINT + 'projects/project/' + uuid + '/share',
                method: 'POST',
                data: $.param({uuid: $scope.shareProjectUuid}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function () {
                    $('#shareproject').modal('hide');
                });
        };

        $scope.archiveProjectModal = function (uuid, typeid) {
            $('#archiveproject').modal('toggle');
            $scope.archiveProjectUuid = uuid;
            $scope.archiveProjectTypeid = typeid;
        };

        $scope.archiveProject = function (uuid) {
            $http({
                url: ENV.API_ENDPOINT + 'projects/project/' + uuid,
                method: 'PUT',
                data: {type_id: $scope.archiveProjectTypeid, archived: "1"}
            }).success(function () {
                    $scope.init();
                    $('#archiveproject').modal('hide');
                });
        };

        $scope.deleteProjectModal = function (uuid) {
            $('#deleteproject').modal('toggle');
            $scope.deleteProjectUuid = uuid;
        };

        $scope.deleteProject = function (uuid) {
            $http({
                url: ENV.API_ENDPOINT + 'projects/project/' + uuid,
                method: 'DELETE',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function () {
                    $scope.init();
                    $('#deleteproject').modal('hide');
                });
        };

        $("#sortable").sortable({
            revert: true,
            handle: ".project-content-move img",
            stop: function () {
                //reorder the project endpoint
                var uuids = [];
                for (var i = 0; i < $scope.projectsNum; i++) {
                    uuids[i] = $(".project-content-name").eq(i).data("uuid");
                }
                $http({
                    url: ENV.API_ENDPOINT + 'projects/ordering',
                    method: 'POST',
                    data: {uuids: uuids},
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                });
            }
        });
        $("#sortable").disableSelection();

        $scope.init();
    });
