const axios = require('axios');

async function test() {
  try {
    const loginRes = await axios.post('http://localhost:3000/auth/login', {
      email: 'admin@school.com',
      password123: 'password123'
    });
    console.log('Login:', loginRes.data); const token = loginRes.data.access_token;
    
    // Get classes
    const classRes = await axios.get('http://localhost:3000/classes', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const cls = classRes.data[0];
    
    // Create an exam
    const examRes = await axios.post('http://localhost:3000/exams', {
      title: 'Test Exam',
      date: '2023-10-10',
      academicYear: '2023-2024',
      classId: cls.id
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const exam = examRes.data;
    
    console.log('Created exam:', exam.id);
    
    // Get class details (to get students and subjects)
    const clsDetails = await axios.get(`http://localhost:3000/classes/${cls.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const student = clsDetails.data.students[0].studentId;
    const subject = clsDetails.data.subjects[0].id;
    
    // Save marks
    const saveRes = await axios.post(`http://localhost:3000/exams/${exam.id}/results`, {
      results: [{
        studentId: student,
        subjectId: subject,
        marksObtained: 85,
        maxMarks: 100,
        remarks: 'Good'
      }]
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('Saved marks:', saveRes.data.length);
  } catch(e) {
    console.error('Error:', e.response?.data || e.message);
  }
}

test();
