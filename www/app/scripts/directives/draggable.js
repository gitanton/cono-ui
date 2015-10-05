'use strict';

/**
 * @ngdoc directive
 * @name conojoApp.directive:draggable
 * @description
 * # draggable
 */
angular.module('conojoApp')
    .directive('draggable', function () {
        return function (scope, element) {
            // this gives us the native JS object
            var el = element[0];

            el.draggable = true;

            el.addEventListener(
                'dragstart',
                function (e) {
                    e.dataTransfer.effectAllowed = 'move';
                    e.dataTransfer.setData('Text', this.id);
                    this.classList.add('drag');
                    return false;
                },
                false
            );

            el.addEventListener(
                'dragend',
                function () {
                    this.classList.remove('drag');
                    return false;
                },
                false
            );
        };
    });
