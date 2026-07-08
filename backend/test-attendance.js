async function test() {
  try {
    // 1. Login as super admin
    const loginRes = await fetch('http://localhost:3000/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@school.com', password: 'password123' })
    });
    const loginData = await loginRes.json();
    
    const token = loginData.access_token;
    console.log('Got token:', token.substring(0, 15) + '...');
    
    // 2. Fetch a class
    const classesRes = await fetch('http://localhost:3000/classes', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const classesData = await classesRes.json();
    const classId = classesData[0].id;
    
    // 3. Get students in class
    const attRes = await fetch(`http://localhost:3000/attendance/class/${classId}?date=2026-07-04`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const attData = await attRes.json();
    
    const students = attData.map(item => item.student.id);
    console.log(`Found ${students.length} students`);
    
    // 4. Mark attendance
    const records = students.map(id => ({
      studentId: id,
      date: '2026-07-04',
      status: 'PRESENT',
      remarks: 'Test'
    }));
    
    const saveRes = await fetch('http://localhost:3000/attendance/bulk-mark', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify({ records })
    });
    
    if (saveRes.ok) {
      const saveData = await saveRes.json();
      console.log('Saved successfully!', saveData.length, 'records');
    } else {
      const err = await saveRes.json();
      console.log('Error saving:', err);
    }
  } catch (e) {
    console.error('Error:', e.message);
  }
}

test();
