import io from 'socket.io-client';
const signals=io.connect('https://rtc.greensideproductions.com.au');

var teachers=[];

signals.on('teacher_connected',(data) => {
	console.log(data.username + " arrived.");
	teachers.push(data.username);
	updateTeachers();
});
signals.on('teacher_disconnected',(data) => {
	console.log(data.username + " left.");
});


function updateTeachers() {
	var divTeachers=document.getElementById('teachers_registered');
	var dt2;
	teachers.forEach((element) => {
		dt2+="<option value='"+element+"'>"+element+"</option>";
	});
	var dt="<select name='teachers_reg_select' size='4'>"+dt2+"</select>";
	divTeachers.innerHTML=dt;
}
