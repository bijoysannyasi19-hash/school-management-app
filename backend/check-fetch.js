async function test() {
  const loginRes = await fetch('http://localhost:3000/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@school.com', password: 'password123' })
  });
  const token = (await loginRes.json()).access_token;
  
  const classesRes = await fetch('http://localhost:3000/classes', {
    headers: { Authorization: `Bearer ${token}` }
  });
  const classId = (await classesRes.json())[0].id;
  
  const attRes = await fetch(`http://localhost:3000/attendance/class/${classId}?date=2026-07-04`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const attData = await attRes.json();
  
  const student = attData.find(s => s.student.id === 'afcb8593-aa73-482c-ab28-6ea6e0706315');
  console.log("Student:", student.student.user.profile.firstName);
  console.log("Attendance Array:", student.student.attendance);
}
test();
