'use strict';

angular
    .module('myApp.bl')
    .factory('Text', TextFactory);

function TextFactory() {
    /* jshint validthis: true */

    Text.prototype.refresh = refresh;

    function Text (data)
    {
        var text = this;
        _createTextObject(text, data);
    }

    return Text;

    ////////////////

    function refresh(data) {
        var text = this;
        text.refreshing = true;
        _createTextObject(text, data);
    }

    function _createTextObject(text,data)
    {
        var textObj = text;
        angular.extend(textObj, data);
        textObj.refreshing = false;
    }
}