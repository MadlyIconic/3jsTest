import BlockLoadEvent from "./blockloadevent";

export default class EventDrivenObject{

}

EventDrivenObject.prototype.registerEvent = function (eventName) {
    var myEvent = new BlockLoadEvent(eventName, {
        detail: {
            info:'bob'
        },
        bubbles: true,
        cancelable: true,
        composed: false
      })

    this.events[eventName] = myEvent;
  };

EventDrivenObject.prototype.dispatchEvent = function (eventName, eventArgs) {
    this.events[eventName].callbacks.forEach(function (callback) {
      callback(eventArgs);
    });
  };

EventDrivenObject.prototype.addEventListener = function (eventName, callback) {
    this.events[eventName].registerCallback(callback);
  };