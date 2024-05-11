self.onmessage = function(e) {
    console.log('Worker: Received message from main script');
    const result = e.data[0] * e.data[1]; // Example processing
    self.postMessage(result);
}

export {}