async function test() {
  const loginRes = await fetch('http://localhost:3000/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@school.com', password: 'password123' })
  });
  const token = (await loginRes.json()).access_token;
  
  const records = [{
    studentId: 'e9930c4d-ab09-4e88-a710-b338af7ee52d',
    date: '2026-07-05',
    status: 'ABSENT',
    remarks: 'Test'
  }];
  
  console.log('Sending first time...');
  let res = await fetch('http://localhost:3000/attendance/bulk-mark', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ records })
  });
  console.log('1:', res.status, await res.text());
  
  console.log('Sending second time...');
  res = await fetch('http://localhost:3000/attendance/bulk-mark', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ records })
  });
  console.log('2:', res.status, await res.text());
}
test();
