const http = require('http');

async function test() {
  const req = http.request('http://localhost:8080?route=planner-daily&userId=1', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-User-Id': '1'
    }
  }, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => console.log('Status:', res.statusCode, 'Body:', data));
  });

  req.on('error', console.error);
  req.write(JSON.stringify({
    date: '2026-09-03',
    notes: 'Hello World test'
  }));
  req.end();
}

test();
