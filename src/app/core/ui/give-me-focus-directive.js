﻿(function () {
    'use strict';

    var module = angular.module('__MODULE__.core');

    module.directive('giveMeFocus', function () {

        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                (scope.$eval(attrs.giveMeFocus) && $(element).focus());
            }
        };

    });
}());
