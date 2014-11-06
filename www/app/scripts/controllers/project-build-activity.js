'use strict';
/**
 * @ngdoc function
 * @name conojoApp.controller:ProjectBuildActivityCtrl
 * @description
 * # ProjectBuildActivityCtrl
 * Controller of the conojoApp
 */
angular.module('conojoApp')
 .controller('ProjectBuildActivityCtrl', function ($scope) {
    $scope.openAddProjectMember = function(){
        $('#addProjectMember').modal('toggle');
        $('body').css('padding',0);
    };
});
