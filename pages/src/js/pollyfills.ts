(window as any).global = window;

(window as any).Buffer = (window as any).Buffer || require('buffer').Buffer;

global.process = require('process');
