// A/B Test Stats Toolkit Embed Script
(function() {
  // Create iframe element
  function createIframe(targetElement) {
    const iframe = document.createElement('iframe');
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    iframe.style.minHeight = '800px'; // Adjust based on content
    iframe.src = 'https://your-deployment-url.com'; // Replace with actual deployment URL
    
    // Add iframe to target element
    targetElement.appendChild(iframe);
    
    // Handle iframe resizing
    window.addEventListener('message', function(e) {
      if (e.data && e.data.type === 'ab-test-toolkit-height') {
        iframe.style.height = e.data.height + 'px';
      }
    });
  }

  // Initialize toolkit
  window.initABTestingToolkit = function(elementId) {
    const targetElement = document.getElementById(elementId);
    if (targetElement) {
      createIframe(targetElement);
    }
  };
})();