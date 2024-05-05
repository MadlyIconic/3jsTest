export default function BlockLoadEvent(name, eventOptions) {
  this.name = name;
  this.eventOptions = eventOptions;
  this.callbacks = [];
}

BlockLoadEvent.prototype.registerCallback = function (callback) {
    this.callbacks.push(callback);
};