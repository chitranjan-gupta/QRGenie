import QrScanner from './qr-scanner.min.js';
// Get the video element
const video = document.querySelector('#video');
const input = document.querySelector('#img-in');
const outqrtxt = document.getElementById('out-qr-txt');
const flipbtn = document.getElementById('flip-btn');
const genbtn = document.getElementById('gen-btn');
const qrtxt = document.getElementById('qr-txt');
const qrcodee = document.getElementById("qrcode");
const openbtn = document.getElementById('open-btn');
const copybtn = document.getElementById('copy-btn');
const downloadbtn = document.getElementById('download-btn');

input.addEventListener('change', (event) => {
  const files = event.target.files;
  if(files.length > 0){
    const file = event.target.files[0];
    if(file instanceof File && file.type.includes("image")){
      QrScanner.scanImage(file, { returnDetailedScanResult: true })
      .then(result => {
        outqrtxt.value = String(result.data);
        console.log(result)
      })
      .catch(error => console.log(error || 'No QR code found.'));
    }
  }
});
// Check if device has camera
if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  // Use video without audio
  const constraints = { 
    video: true,
    audio: false
  }
  
  // Start video stream
  navigator.mediaDevices.getUserMedia(constraints).then(stream => {
    video.srcObject = stream;
    main();
  });
}

let qrScanner = null;

function initialise(){
  qrScanner = new QrScanner(
      video,
      result => {
        outqrtxt.innerText = result.data;
        console.log('decoded qr code:', result)
      },
      {
        returnDetailedScanResult: true,
        highlightScanRegion: true
      }
  );
  qrScanner.setInversionMode("both");
}

function main(){
  if(qrScanner){
    qrScanner.start();
  } else {
    initialise();
    qrScanner.start();
  }
}

let facingMode = "environment";

flipbtn.addEventListener('click', () => {
  if(qrScanner){
    if(facingMode === "environment"){
      qrScanner.setCamera("user");
      facingMode = "user";
    } else {
      qrScanner.setCamera("environment");
      facingMode = "environment";
    }
  }
})

let qrcode = null;

genbtn.addEventListener('click', () => {
  const txt = qrtxt.value;
  if(txt){
    generateQr(txt);
  }
})

function generateQr(txt){
  if(qrcode){
    qrcode.clear(); // clear the code.
    qrcode.makeCode(txt); // make another code.
  }else{
    qrcode = new QRCode(qrcodee, txt);
  }
}

openbtn.addEventListener('click', function(){
  if(browser && browser.tabs){
    browser.tabs.create({ url: 'index.html' });
  }
})

copybtn.addEventListener('click', function(){
  writeClipboardText(outqrtxt.innerText)
})

async function writeClipboardText(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch (error) {
    console.error(error.message);
  }
}

downloadbtn.addEventListener('click', function() {
  const imgs = document.getElementsByTagName('img');
  if(imgs.length > 0){
    const a = document.createElement('a');
    a.href = imgs[0].src;
    a.download = `qr-${Date.now()}.png`;
    a.click();
  }
})

if(browser && browser.storage && browser.storage.local){
  browser.storage.local.get(['qrurl'], (result) => {
    if(result && result.qrurl){
      generateQr(result.qrurl)
    }
  })
}

const targetKey = "qrurl";

if(browser && browser.storage){
  browser.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === 'local' && changes[targetKey]) {
      // If the specific key has changed
      const change = changes[targetKey];
      // Perform some action based on the change
      if (change.oldValue !== change.newValue) {
        // For example, trigger some action if the value has actually changed
        generateQr(change.newValue);
      }
    }
  });
}