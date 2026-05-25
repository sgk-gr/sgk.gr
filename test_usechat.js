const ai = require('ai/react');
console.log('ai/react exports:', Object.keys(ai));
try {
  const react_sdk = require('@ai-sdk/react');
  console.log('@ai-sdk/react exports:', Object.keys(react_sdk));
} catch(e) {}
