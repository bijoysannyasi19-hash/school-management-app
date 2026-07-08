const http = require('http');

const data = JSON.stringify({
  email: 'admin@school.com',
  password: 'password123'
});

const req = http.request({
  hostname: 'localhost',
  port: 3000,
  path: '/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
}, res => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    const token = JSON.parse(body).access_token;
    console.log('token:', token);
    
    // now create event
    const eventData = JSON.stringify({
      title: "hallowen day",
      description: "hallowen day in school",
      date: "2024-10-31T12:39:00.000Z",
      location: "nataji hall",
      imageUrl: "data:image/jpeg;base64," + "A".repeat(10000000) // 10MB of data
    });
    
    const req2 = http.request({
      hostname: 'localhost',
      port: 3000,
      path: '/events',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(eventData),
        'Authorization': `Bearer ${token}`
      }
    }, res2 => {
      let body2 = '';
      res2.on('data', chunk => body2 += chunk);
      res2.on('end', () => {
        console.log('status:', res2.statusCode);
        console.log('response:', body2.slice(0, 500) + '...');
      });
    });
    req2.write(eventData);
    req2.end();
  });
});
req.write(data);
req.end();
