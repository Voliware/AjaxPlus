## AjaxPlus
`AjaxPlus+` is small a library of AJAX modules, including:

### AjaxModule
Fetches data via an AJAX request every x milliseconds.
```js
var newsGetter = new AjaxModule({
    request : Server.getData,
    interval : 40000    
});
newsGetter.on('done', function(data){
    $newsPanel.update(data);
});
newsGetter.start();
```

### AjaxMonitor
Monitors all AJAX requests during a page's life time. If the number of failed requests equals `maxFailures` before the `resetTimer` amount passes, `AjaxMonitor` will change its internal state to offline. By default, it will also abort all requests other than its own heartbeat until it is back online.
```js
var monitor = new AjaxMonitor({
   heartbeatUrl : '/',
   maxFailures : 10,
   resetTimer : 30000
});
```

Also included is `AjaxPoll` and `AjaxQueue`. Read more about [Ajax+](https://github.com/Voliware/AjaxPlus/wiki).

## Documentation & Tutorials

View the [docs](http://voliware.github.io/AjaxPlus) for a `jsDoc` documentation, or check out the [Wiki](https://github.com/Voliware/AjaxPlus/wiki) for step-by-step explinations of how to use all of the classes.

## Contributors
Written by Anthony Agostino.

## License
Licensed under the MIT license.
