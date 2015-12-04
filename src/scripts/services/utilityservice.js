'use strict';

/**
 * The purpose of this service is to provide utility functions used throughout the application.  If you have a
 * function that you will need to use throughout the app, put it here
 */
angular.module('conojoApp')
    .service('utilityService',
        function ($rootScope, $q, $window, $log, LogglyLogger, store, ENV) {

            var utilityService = {
                pubNubInitialized: false,
                online: false,

                isDevice: function () {
                    return window.cordova ? true : false;
                },

                guid: function () {
                    function s4() {
                        return Math.floor((1 + Math.random()) * 0x10000)
                            .toString(16)
                            .substring(1);
                    }

                    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                        s4() + '-' + s4() + s4() + s4();
                },

                /**
                 * Convert a mysql datetime string into a javascript date object
                 * format: YYYY-mm-DD HH:mm:ss
                 * @param dateString
                 * @returns {Date}
                 */
                mysqlToDate: function (dateString) {
                    if (dateString) {
                        var t = dateString.split(/[- :]/);
                        var date = new Date(t[0], t[1] - 1, t[2], t[3], t[4], t[5]);
                        return date;
                    }
                },

                /**
                 * Format a date as MM/DD/YYYY
                 * @param dateString
                 * @returns {string}
                 */
                prettyDate: function (dateString) {
                    if (dateString) {
                        var date = this.mysqlToDate(dateString);
                        return (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
                    }
                },

                /**
                 * Format a number with commas
                 * @param number
                 * @returns {string}
                 */
                numberWithCommas: function (number) {
                    if (number) {
                        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                    } else {
                        return '';
                    }
                },

                endsWith: function (string, suffix) {
                    return string.indexOf(suffix, string.length - suffix.length) !== -1;
                },

                validateEmail: function (email) {
                    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
                    return re.test(email);
                },

                shortenUrl: function (link) {
                    var defer = $q.defer();
                    window.gapi.client.setApiKey(ENV.GOOGLE_API_KEY);
                    window.gapi.client.load('urlshortener', 'v1', function () {
                        var request = window.gapi.client.urlshortener.url.insert({
                            'resource': {'longUrl': link}
                        });
                        request.then(function (response) {
                            defer.resolve(response.result.id);
                        });
                    });
                    return defer.promise;
                },

            };
            return utilityService;

        });
