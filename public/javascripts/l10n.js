define([], function () {

  var _strings = {},
      _requestCache = {},
      _requestedStrings = false;

  var l10n = {
    debug: function(message) {
    },
    get: function (key) {
      return _strings[key] || "";
    },
    ready: function (options) {
      var noCache = !!options.noCache,
          verboseLogging = !!options.verboseLogging,
          url = options.url || '/strings';

      if (verboseLogging){
        this.debug = console.log;
      }

      // Add cache busting if requested.
      url = url + (noCache ? '?bust=' + Date.now() : '');

      _requestedStrings = false;
      if (!_requestedStrings) {
        _requestedStrings = true;

        if (_requestCache.hasOwnProperty(url)) {
          if (_requestCache[url].status === 200) {
            this.debug("[L10n]: Translation file cached. Firing callback for: ", url);

            var data = _requestCache[url].response;
            for (var key in data) {
              if(data.hasOwnProperty(key)) {
                _strings[key] = data[key];
              }
            }
            return;
          }

          if (_requestCache[url].status === 404) {
            this.debug("[L10n]: Skipping the request for: " + url + " Status: " + _requestCache[url].status);
            return;
          }
        }


        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, false);
        xhr.onreadystatechange = function(){
          _requestCache[url] = {};
          _requestCache[url].status = xhr.status;
          if (this.readyState !== 4) {
            return;
          }

          if (xhr.status !== 200) {
            console.error("Localized Error: HTTP error " + xhr.status, url);
            return;
          }

          try {
            _requestCache[url].response = JSON.parse(this.responseText);
            var data = JSON.parse(this.responseText);
            for (var key in data) {
              if(data.hasOwnProperty(key)) {
                _strings[key] = data[key];
              }
            }
          } catch (err) {
            console.error("Localized Error: " + err + ", url = ", url);
          }
        };
        xhr.send(null);
      }
    },
    getCurrentLang: function () {
      var html = document.querySelector( "html" );
      return html && html.lang ? html.lang : "en-US";
    }
  };
  return l10n;
});

