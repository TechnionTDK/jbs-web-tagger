'use strict';

angular.module('myApp.view4', [])
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
        $routeProvider.when('/view4', {
            templateUrl: 'components/view4/view4.html',
            controller: 'View4Ctrl',
            controllerAs: 'vm'
        });
    }])
    .controller('View4Ctrl', function ($rootScope, $scope, $http, $sce, $timeout) {
        var vm = this;
        vm.log = true;
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
        	if (vm.log) console.log("** activate (begin) **");
            $rootScope.down = function(e)
            {
            	
                if (e.keyCode === 84 && isSelectionValid() && !vm.isTagScreenOn)
                {
                    showTagScreen();
                    console.log('1')
                }
                else if (e.keyCode === 27 && isSelectionValid() && vm.isTagScreenOn)
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
        	if (vm.log) console.log("** activate (end) **");
        }

        function isSelectionValid() {
        	if (vm.log) console.log("** isSelectionValid (begin) **");
            return vm.startOffset >= 0 && vm.endOffset >= 0;
        }

        function showTagScreen()
        {
        	if (vm.log) console.log("** showTagScreen (begin) **");
            vm.isTagScreenOn = true;
            $timeout(function (){
            	$("#tagNameInput").focus();
            }, 200);
            if (vm.log) console.log("** showTagScreen (end) **");
        }

        function closeTagScreen()
        {
        	if (vm.log) console.log("** closeTagScreen (begin) **");
            console.log("<close tag screen>");
            vm.isTagScreenOn = false;
        	if (vm.log) console.log("** closeTagScreen (end) **");
        }

        function loadLabelsDB() {
        	if (vm.log) console.log("** loadLabelsDB (begin) **");
            vm.labelsDBjson = JSON.parse(vm.labelsDB);
            vm.labelsDBjsonFiltered = {"collection": []};
        	if (vm.log) console.log("** loadLabelsDB (end) **");
        }

        function loadText() {
        	if (vm.log) console.log("** loadText (begin) **");
            vm.textArray = vm.text.split('');
            vm.templateUrl = 'popoverTemplate.html';
            vm.textArray.forEach(function (char, index) {
                vm.textTags[index] = [];
                vm.textArray[index] =   '<span>' +
							                '<span ng-show="vm.textTags['+index+'].length > 0">' +
                                                '<a class="tagged-text" id="text_'+index+'_tagged" ng-click="vm.selectedIndex='+index+'" uib-popover-template="vm.templateUrl" popover-trigger="\'outsideClick\'" popover-append-to-body="true" popover-placement="bottom">' +
                                                    char +
                                                '</a>' +
                                            '</span>' +
                                            '<span id="text_'+index+'_untagged" ng-hide="vm.textTags['+index+'].length > 0">' +
                                                char +
							                '</span>' +
                                        '</span>';
            });
            vm.taggedText = $sce.trustAsHtml(vm.textArray.join(''));
            if (vm.log) console.log("** loadText (end) **");
        }

        function removeTag(index) {
        	if (vm.log) console.log("** removeTag (begin) **");
            vm.textTags[vm.selectedIndex].splice(index,1);
            if (vm.log) console.log("** removeTag (end) **");
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
        	if (vm.log) console.log("** updateFilter (begin) **");
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
        	if (vm.log) console.log("** updateFilter (end) **");
        }

        function tag(titlesObj) {
        	if (vm.log) console.log("** tag (begin) **");
            
            if (vm.startOffset >= 0 && vm.endOffset > 0) {
                var title = {};
                title.startIndex = vm.startOffset;
                title.endIndex = vm.endOffset - 1;
                title.title = titlesObj.titles[0].title;
                title.text = vm.text.substring(vm.startOffset,vm.endOffset);
                title.object = titlesObj;
                for (var i = title.startIndex; i < vm.endOffset; i++)
                {
                	console.log(i);
                	vm.textTags[i].push(title);
                }
                console.log('oren',vm.textTags);
            }
            vm.isTagScreenOn = false;
        	if (vm.log) console.log("** tag (end) **");
        }

        vm.RemoveTag = function (tag) {
        	if (vm.log) console.log("** RemoveTag (begin) **");
            console.log(vm.hoveredPart, tag);
        	if (vm.log) console.log("** RemoveTag (end) **");
        };
        
        
        

    });

