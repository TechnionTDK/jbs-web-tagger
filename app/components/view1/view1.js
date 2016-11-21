'use strict';

angular.module('myApp.view1', [])
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
        $routeProvider.when('/view1', {
            templateUrl: 'components/view1/view1.html',
            controller: 'View1Ctrl',
            controllerAs: 'vm'
        });
    }])
    .controller('View1Ctrl', function ($rootScope, $scope, $http, $sce, $timeout, $uibModal, $window) {
        var vm = this;
        vm.log = true;
        vm.loadText = loadText;
        vm.updateSelectedText = updateSelectedText;
        vm.updateFilter = updateFilter;
        vm.tag = tag;
        vm.removeTag = removeTag;

        vm.selectedIndex = 0;
        vm.startOffset = -1;
        vm.endOffset = -1;
        vm.filter = "";
        vm.labelsDBjson = {};
        vm.labelsDBjson.subjects = [];
        vm.labelsDB = angular.toJson(vm.labelsDBjson);
        vm.activeTags = [];
        vm.textArray = [];
        vm.textTags = [];
        vm.highlightedText = {};
        vm.currentSelectedFilter = -1;
        activate();

        //////////////////////////////////////////

        function activate() {
        	if (vm.log) console.log("** activate (begin) **");
            $rootScope.down = function(e)
            {
                if (e.keyCode === 84 && isSelectionValid() && !vm.isTagScreenOn)
                {
                    showTagScreen();
                    vm.currentSelectedFilter = -1;
                }
                else if (e.keyCode === 27 && isSelectionValid() && vm.isTagScreenOn)
                {
                    closeTagScreen();
                }
                else if (e.keyCode === 40 && isSelectionValid() && vm.isTagScreenOn) //down
                {
                	if (vm.lim >= 0)
                	{
                		vm.labelsDBjsonFiltered.subjects[vm.currentSelectedFilter].selected = false;
                		vm.currentSelectedFilter = vm.currentSelectedFilter + 1;
                		if (vm.currentSelectedFilter > vm.lim) vm.currentSelectedFilter = 0;
                		vm.labelsDBjsonFiltered.subjects[vm.currentSelectedFilter].selected = true;
                	}
                }
                else if (e.keyCode === 38 && vm.isTagScreenOn) //up
                {
                	if (vm.lim >= 0)
                	{
                		vm.labelsDBjsonFiltered.subjects[vm.currentSelectedFilter].selected = false;
                		vm.currentSelectedFilter = vm.currentSelectedFilter - 1;
                		if (vm.currentSelectedFilter < 0) vm.currentSelectedFilter = vm.lim;
                		vm.labelsDBjsonFiltered.subjects[vm.currentSelectedFilter].selected = true;                    
                	}
                }
                else if (e.keyCode === 13 && vm.isTagScreenOn) //up
                {
                	if (vm.lim >= 0) {
                		vm.tag(vm.labelsDBjsonFiltered.subjects[vm.currentSelectedFilter]);
                		closeTagScreen();                    
                	}
                }
            	
                
            };

            $http({
                method: 'GET',
                url: 'http://localhost:8000/data/'
            }).then(function (response) {
                vm.files = response.data;
                vm.files.replace(/>/g,' ').replace(/</g,' ').split(' ').forEach(function (file) {
                    if (file.endsWith('.json')) {
                        $http({
                            method: 'GET',
                            url: 'http://localhost:8000/data/' + file
                        }).then(function (content) {
                            vm.labelsDBjson.subjects = vm.labelsDBjson.subjects.concat(content.data.subjects);
                        }, errorCallback);
                    }
                });
            }, errorCallback);

            function errorCallback() {
                if (vm.log) console.log("** activate - get data - " + angular.toJson(response));
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            }

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
            	var el = document.getElementById('tagNameInput');
            	el.value = "";
            	vm.filter = "";
            	vm.updateFilter();
            	vm.limit = -1;
            	$("#tagNameInput").focus();
            	
            	}, 50);
            if (vm.log) console.log("** showTagScreen (end) **");
        }

        function closeTagScreen()
        {
        	if (vm.log) console.log("** closeTagScreen (begin) **");
            vm.isTagScreenOn = false;
        	if (vm.log) console.log("** closeTagScreen (end) **");
        }

        function loadText() {
        	if (vm.log) console.log("** loadText (begin) **");
            vm.textArray = vm.text.split('');
            vm.templateUrl = 'popoverTemplate.html';
            vm.textArray.forEach(function (char, index) {
                vm.textTags[index] = [];

                var cl = 'ng-class="(vm.highlightedText['+index+']) ? \'highlighted-text\' : \'\'"';
                vm.textArray[index] =   '<span ' +  cl + '>' +
                                            '<span ng-show="vm.textTags['+index+'].length > 0">' +
                                                '<a class="tagged-text" id="text_'+index+'_tagged" ng-click="vm.selectedIndex='+index+'" uib-popover-template="vm.templateUrl" popover-trigger="\'outsideClick\'" popover-append-to-body="true" popover-placement="bottom">' +
                                                    char +
                                                '</a>' +
                                            '</span>' +
                                            '<span id="text_'+index+'_untagged" ng-hide="vm.textTags['+index+'].length > 0">' +
                                                char +
                                            '</span>' +
                                        '</span>';
                vm.maxIndex = index;
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
            if (sel)
            {
            	var a = sel.getRangeAt(0).startContainer.parentNode.id;
            	var b = sel.getRangeAt(0).endContainer.parentNode.id;
            	
            	if (a.indexOf('text_') === 0 && b.indexOf('text_') === 0)
            	{
            		a = a.split("_")[1];
            		b = b.split("_")[1];
            		vm.startOffset = Number(a);
            		vm.endOffset = Number(b)+1;

            		//fix to the left
            		while (vm.startOffset < vm.maxIndex && (vm.text[vm.startOffset] === " " || vm.text[vm.startOffset] === "\n"))
            		{
            			vm.startOffset++;
            		}
        			while (vm.startOffset >= 0 && vm.text[vm.startOffset] !== " " && vm.text[vm.startOffset] !== "\n")
        			{
        				vm.startOffset--;
        			}
        			vm.startOffset++;
            		//fix to the right
            		while (vm.endOffset && (vm.text[vm.endOffset] === " " || vm.text[vm.endOffset] === "\n"))
            		{
            			vm.endOffset--;
            		}
        			while (vm.endOffset <= vm.maxIndex && vm.text[vm.endOffset] !== " " && vm.text[vm.endOffset] !== "\n")
        			{
        				vm.endOffset++;
        			}
        			
        			vm.highlightedText = {};
        			for (var i = vm.startOffset; i < vm.endOffset; i++)
        			{
        				vm.highlightedText[i] = true;
        			}
            	}
            }
            $window.getSelection().removeAllRanges();
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
            vm.lim = Math.min(vm.labelsDBjsonFiltered.subjects.length, 10) - 1;
            if (vm.labelsDBjsonFiltered.subjects.length > 0)
            {
            	if (vm.currentSelectedFilter === -1)
            	{
            		vm.currentSelectedFilter = 0;
            	}
            	else if (vm.currentSelectedFilter > vm.lim)
            	{
            		vm.currentSelectedFilter = vm.lim;
            	}
            }
            
            for (var i = 0; i<= vm.lim; i++) {
            	vm.labelsDBjsonFiltered.subjects[i].selected = (vm.currentSelectedFilter === i);
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
                	vm.textTags[i].push(title);
                }
            }
            vm.isTagScreenOn = false;
        	if (vm.log) console.log("** tag (end) **");
        }
        
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

