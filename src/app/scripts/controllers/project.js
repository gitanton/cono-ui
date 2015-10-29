'use strict';
/**
 * @ngdoc function
 * @name conojoApp.controller:ProjectCtrl
 * @description
 * # ProjectCtrl
 * Controller of the conojoApp
 */
angular.module('conojoApp')
    .controller('ProjectCtrl', function ($scope, $http, $location, ENV, projectService) {
        $scope.projecttype = 0;
        $scope.projecttitle = '';
        $scope.errorMessageProject = '';

        $scope.init = function () {
            projectService.list().then(function (response) {
                $scope.projects = response.data;
                $scope.projectsNum = $scope.projects.length;
            });
        };

        $scope.newProject = function () {
            $scope.projecttype = 0;
            $scope.projecttitle = '';
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
            projectService.list($.param({name: $scope.projecttitle, type_id: $scope.projecttype})).then(function () {
                $scope.init();
                $('#newproject').modal('hide');
            }, function (error) {
                $('#newproject').modal('hide');
                $scope.errorMessageProject = error.message;
                $('#statusNoticeProject').modal('toggle');
            });
        };

        $scope.goToBilling = function () {
            $('#statusNoticeProject').modal('hide');
            $location.path('/profile-billing');
        };

        $scope.projectScreen = function (uuid, type) {
            if (type === '1') {
                $http({
                    url: ENV.API_ENDPOINT + 'screens/project/' + uuid,
                    method: 'GET',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                }).then(function (response) {
                    var data = response.data;
                    if (data.length > 0) {
                        $location.path('/project-build/' + uuid + '/' + data[0].uuid);
                    } else {
                        $location.path('/project-screenUpload/' + uuid);
                    }
                });
            } else if (type === '2') {
                $http({
                    url: ENV.API_ENDPOINT + 'videos/project/' + uuid,
                    method: 'GET',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                }).then(function (response) {
                    var data = response.data;
                    if (data.length > 0) {
                        $location.path('/project-videoPlay/' + uuid + '/' + data[0].uuid);
                    } else {
                        $location.path('/project-videoUpload/' + uuid);
                    }
                });
            } else if (type === '3') {
                $http({
                    url: ENV.API_ENDPOINT + 'screens/project/' + uuid,
                    method: 'GET',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                }).then(function (response) {
                    var data = response.data;
                    if (data.length > 0) {
                        $location.path('/project-build-template/' + uuid + '/' + data[0].uuid);
                    } else {
                        $location.path('/project-templateSelect/' + uuid);
                    }
                });
            }
        };

        $scope.duplicateProjectModal = function (uuid, name) {
            $('#duplicateproject').modal('toggle');
            $scope.duplicateProjectUuid = uuid;
            $scope.duplicateProjectName = name;
        };

        $scope.duplicateProject = function () {
            $http({
                url: ENV.API_ENDPOINT + 'projects/project/' + $scope.duplicateProjectUuid + '/duplicate',
                method: 'POST',
                data: $.param({uuid: $scope.duplicateProjectUuid, name: $scope.duplicateProjectName + '-Copy'}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then(function () {
                $scope.init();
                $('#duplicateproject').modal('hide');
            }, function (error) {
                $('#duplicateproject').modal('hide');
                $('.reset-note').html(error.message);
                $('#statusNotice').modal('toggle');
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
            }).then(function () {
                $('#shareproject').modal('hide');
            }, function (error) {
                $('#shareproject').modal('hide');
                $('.reset-note').html(error.message);
                $('#statusNotice').modal('toggle');
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
                data: {type_id: $scope.archiveProjectTypeid, archived: '1'}
            }).then(function () {
                $scope.init();
                $('#archiveproject').modal('hide');
            }, function (error) {
                $('#archiveproject').modal('hide');
                $('.reset-note').html(error.message);
                $('#statusNotice').modal('toggle');
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
            }).then(function () {
                $scope.init();
                $('#deleteproject').modal('hide');
            }, function (error) {
                $('#deleteproject').modal('hide');
                $('.reset-note').html(error.message);
                $('#statusNotice').modal('toggle');
            });
        };

        $('#sortable').sortable({
            revert: true,
            handle: '.project-content-move img',
            stop: function () {
                //reorder the project endpoint
                var uuids = [];
                for (var i = 0; i < $scope.projectsNum; i++) {
                    uuids[i] = $('.project-content-name').eq(i).data('uuid');
                }
                projectService.reorder(uuids).then(function () {
                    $scope.init();
                }, function (error) {
                    $('.reset-note').html(error.message);
                    $('#statusNotice').modal('toggle');
                });
            }
        });
        $('#sortable').disableSelection();

        $scope.openProjectNote = function (uuid, name) {
            $scope.projectNoteUuid = uuid;
            $scope.projectNoteName = name;
            $('#addProjectNote').modal('toggle');
        };

        $scope.addProjectNote = function () {

        };

        $scope.init();
    });
