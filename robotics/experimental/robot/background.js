chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('index.html', {
    bounds: {
      width: 960,
      height: 500,
      left: 100,
      top: 100
    }
  });
});

chrome.runtime.onSuspend.addListener(function() {
  // Do some simple clean-up tasks.
});

chrome.runtime.onInstalled.addListener(function() {
  // chrome.storage.local.set(object items, function callback);
});

chrome.bluetooth.onDeviceAdded.addListener(function(device) {
  var uuid = '4bae4737780042b0a665dbb47c6185e7';
  if (!device.uuids || device.uuids.indexOf(uuid) < 0)
    return;

  // The device has a service with the desired UUID.
  chrome.bluetoothLowEnergy.connect(device.address, function () {
    if (chrome.runtime.lastError) {
      console.log('Failed to connect: ' + chrome.runtime.lastError.message);
      return;
    }
   // Connected! Do stuff...
   //connect to another script
 });
});



