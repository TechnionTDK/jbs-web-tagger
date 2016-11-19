'use strict';

angular.module('myApp.view3', ['ngRoute'])
    .directive('compileTemplate', function ($compile,$parse) {
        return {
        link: function (scope, element, attr) {
            var parsed = $parse(attr.ngBindHtml);

            function getStringValue() {
                return (parsed(scope) || '').toString();
            }
            //Recompile if the template changes
            scope.$watch(getStringValue, function () {
                $compile(element, null, -9999)(scope);  //The -9999 makes it skip directives so that we do not recompile ourselves
            });
        }
    }})
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/view3', {
            templateUrl: 'components/view3/view3.html',
            controller: 'View3Ctrl',
            controllerAs: 'vm'
        });
    }])
    .controller('View3Ctrl', ['$rootScope', '$scope', '$http', '$sce', '$document',
    function ($rootScope, $scope, $http, $sce) {
        var vm = this;

        vm.loadLabelsDB = loadLabelsDB;
        vm.loadText = loadText;
        vm.updateSelectedText = updateSelectedText;
        vm.updateFilter = updateFilter;
        vm.tag = tag;

        vm.startOffset = -1;
        vm.endOffset = -1;
        vm.filter = "";
        vm.labelsDBjson = {"subjects": []};
        vm.labelsDB = angular.toJson(vm.labelsDBjson);
        vm.activeTags = [];
        vm.textArray = [];

        activate();

        //////////////////////////////////////////

        function activate() {
            $rootScope.down = function(e)
            {
                if (e.keyCode === 84 && isSelectionValid() && !vm.isTagScreenOn)
                {
                    showTagScreen();
                }
                if (e.keyCode === 27 && isSelectionValid() && vm.isTagScreenOn)
                {
                    closeTagScreen();
                }
            };

            $http({
                method: 'GET',
                url: 'http://localhost:8000/data/book1.json'
            }).then(function successCallback(response) {
                vm.labelsDBjson = response.data;
                vm.labelsDB = angular.toJson(response.data);

            }, function errorCallback(response) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });

            vm.text = "בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה\n" +
                "בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה\n" +
                "בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה\n" +
                "בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה\n" +
                "בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה\n" +
                "בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה\n" +
                "בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה\n" +
                "בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה\n" +
                "בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה\n" +
                "בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה\n" +
                "בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה\n" +
                "בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה\n" +
                "בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה";

            vm.loadLabelsDB();
            vm.loadText();
            vm.taggedText = $sce.trustAsHtml(vm.text);
        }

        function isSelectionValid() {
            return vm.startOffset >= 0 && vm.endOffset >= 0;
        }

        function showTagScreen()
        {
            console.log("<show tag screen>");
            vm.isTagScreenOn = true;
        }

        function closeTagScreen()
        {
            console.log("<close tag screen>");
            vm.isTagScreenOn = false;
        }

        function loadLabelsDB() {
            vm.labelsDBjson = JSON.parse(vm.labelsDB);
            vm.labelsDBjsonFiltered = {"collection": []};
        }

        function loadText() {
            vm.textArray = vm.text.split('');
        }

        function updateSelectedText() {
            console.log("<updateSelectedText>");
            // var flag = 0;
            var sel = window.getSelection();
            vm.startOffset = sel.anchorOffset;
            vm.endOffset = sel.extentOffset;
            console.log("vm.startOffset = " + vm.startOffset);
            console.log("vm.endOffset = " + vm.endOffset)
        }

        function updateFilter() {
            vm.labelsDBjsonFiltered = {"subjects": []};
            vm.labelsDBjsonFiltered.subjects = [];
            if (vm.filter.length > 0) {
                vm.labelsDBjson.subjects.forEach(function (titlesObj) {
                    titlesObj.titles.every(function (title) {
                        if (title.title.includes(vm.filter)) {
                            vm.labelsDBjsonFiltered.subjects.push(titlesObj);
                            return false;
                        }
                        return true;
                    });
                });
            }
        }

        function tag(titlesObj) {
            console.log(titlesObj);
            if (vm.startOffset >= 0 && vm.endOffset >= 0) {
                vm.textArray[vm.startOffset] = '<a uib-tooltip="' + titlesObj.titles[0].title + '">' + vm.textArray[vm.startOffset];
                vm.textArray[vm.endOffset] = vm.textArray[vm.endOffset] + '</a>';
                vm.taggedText = $sce.trustAsHtml(vm.textArray.join(''));
            }
        }

        vm.RemoveTag = function (tag) {
            console.log(vm.hoveredPart, tag);
        };
    }]);

