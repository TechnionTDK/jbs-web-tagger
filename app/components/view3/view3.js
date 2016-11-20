'use strict';

angular.module('myApp.view3', [])
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
    .controller('View3Ctrl', function ($rootScope, $scope, $http, $sce, $uibModal) {
        var vm = this;

        vm.loadLabelsDB = loadLabelsDB;
        vm.loadText = loadText;
        vm.updateSelectedText = updateSelectedText;
        vm.updateFilter = updateFilter;
        vm.tag = tag;
        vm.removeTag = removeTag;

        vm.selectedIndex = 0;
        vm.startOffset = -1;
        vm.endOffset = -1;
        vm.filter = "";
        vm.labelsDBjson = {"subjects": []};
        vm.labelsDB = angular.toJson(vm.labelsDBjson);
        vm.activeTags = [];
        vm.textArray = [];
        vm.textTags = [];

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

            vm.text = "אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא\n" +
                "אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא\n" +
                "אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא\n" +
                "אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא\n" +
                "אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא\n" +
                "אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא\n" +
                "אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא\n" +
                "אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא\n" +
                "אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא\n" +
                "אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא\n" +
                "אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא\n" +
                "אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא\n" +
                "אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא אאא";

            vm.loadLabelsDB();
            vm.loadText();
        }

        function isSelectionValid() {
            return vm.startOffset >= 0 && vm.endOffset >= 0;
        }

        function showTagScreen()
        {
            console.log("<show tag screen>");
            // createTagModal();
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
            vm.templateUrl = 'popoverTemplate.html';
            vm.textArray.forEach(function (char, index) {
                vm.textTags[index] = [];
                vm.textArray[index] =   '<span id="text_'+index+'">' +
                                            char +
                                            '<sup ng-show="vm.textTags['+index+'].length > 0">' +
                                                '<a ng-click="vm.selectedIndex='+index+'" uib-popover-template="vm.templateUrl" popover-trigger="\'outsideClick\'" popover-append-to-body="true" popover-placement="bottom">' +
                                                    '*' +
                                                '</a>' +
                                            '</sup>' +
                                        '</span>';
            });
            vm.taggedText = $sce.trustAsHtml(vm.textArray.join(''));
        }

        function removeTag(index) {
            vm.textTags[vm.selectedIndex].splice(index,1);
        }

        function updateSelectedText() {
            var sel = window.getSelection();
            var a = sel.getRangeAt(0).startContainer.parentNode.id;
            var b = sel.getRangeAt(0).endContainer.parentNode.id;

            if (a.indexOf('text_') === 0 && b.indexOf('text_') === 0)
            {
                a = a.split("_")[1];
                b = b.split("_")[1];
                vm.startOffset = Number(a);
                vm.endOffset = Number(b)+1;
                console.log(a,b)
            }
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
            if (vm.startOffset >= 0 && vm.endOffset > 0) {
                var title = {};
                title.startIndex = vm.startOffset;
                title.endIndex = vm.endOffset - 1;
                title.title = titlesObj.titles[0].title;
                title.text = vm.text.substring(vm.startOffset,vm.endOffset);
                title.object = titlesObj;
                vm.textTags[title.endIndex].push(title);
            }
            vm.isTagScreenOn = false;
        }

        vm.RemoveTag = function (tag) {
            console.log(vm.hoveredPart, tag);
        };

        function createTagModal() {
            var resolve = {
                header: 'Tag Modal'
            };
            return createModal('/components/modals/tagModal/tagModal.html','tagModalCtrl as vm','wide',resolve,'static');
        }

        function createModal(templateUrl,controller,size,resolve,backdrop) {
            var options = {};
            options.templateUrl = templateUrl;
            options.controller = controller;
            options.size = size;
            options.resolve = resolve;
            if (backdrop) {
                options.backdrop = backdrop;
            }
            return $uibModal.open(options);
        }
    });

