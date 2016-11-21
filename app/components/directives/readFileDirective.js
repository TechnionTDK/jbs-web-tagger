'use strict';

angular.module('myApp.directives')
    .directive('readFile', function ($parse) {
        return {
            restrict: 'A',
            scope: false,
            link: function(scope, element, attrs) {
                var fn = $parse(attrs.readFile);

                element.on('change', function(onChangeEvent) {
                    var reader = new FileReader();

                    reader.onload = function(onLoadEvent) {
                        scope.$apply(function() {
                            fn(scope, {$fileContent:onLoadEvent.target.result});
                        });
                    };
                    try
                    {
                        reader.readAsText((onChangeEvent.srcElement || onChangeEvent.target).files[0]);
                    }
                    catch(err)
                    {
                        console.log('readFile - ' + err);
                    }
                });
            }
        };
    });