const express = require('express');
const app = express();

const db = require('./db').db;
const Student = require('./db').Student;
const Teacher = require('./db').Teacher;

let PORT = 8080;

//if I wanted to mount my files on an HTML file, 
//I could do put an "index.html" in a public folder,
//then pass my data through it this way:
app.use(express.static('public'))

app.get("/test", (req, res, next) => {
	// Visit http://localhost:8080/test to see the message!
	res.send("Hello GET Route!")
})

app.get("/students/:id", (req, res, next) => {
	const studentId = req.params.id 
	Student.findById(studentId)
		.then((student) => {
			res.send(student)
		})
		.catch(next);
	//get student by id (access id from req.params)
	//res.json the student instance that matches
})

app.get("/students/teachers/:id", (req, res, next) => {
	//get teacher by id
	//access teacher id from req.params
	//match that teacher to the students who match
	//res.json the student instances
	const teacherId = req.params.id

	Teacher.findById(teacherId) 
		.then((teacher) => {
			return teacher.getStudents()
			.then((students) => {
				if(students) {
					res.json(students);
				}
			})
		})
	})

app.get("/teachers/:id", (req, res, next) => {
	const teacherId = req.params.id
	Teacher.findById(teacherId)
		.then((teacher) => {
			res.send(teacher)
		})
		.catch(next);
	//get teacher by id
	//
	})

app.get("/students", (req, res, next) => {
	Student.findAll()
		.then((students) => {
			res.send(students);
		})
		.catch(next);
})

app.get("/teachers", (req, res, next) => {
	Teacher.findAll()
	.then((teachers) => {
		res.send(teachers);
	})
	.catch(next);
})

app.delete("/students/:id", (req, res, next) => {
	const studentToDelete = req.params.id; //other ways to send/acces
	//the information of: "here is a student I want to delete"
	//req.body?
	Student.destroy({
		where: {
			id: studentToDelete
		}
	})
	.then((numAffectedRows) => {
		if (numAffectedRows > 0) {
			res.sendStatus(202)
		}
	})
	.catch(next);
	//delete a student
	//return a status code of 202
	
})

app.put('/students/:studentId/teachers/:teacherId', (req, res, next) => {
	const studentId = req.params.studentId
	const teacherId = req.params.teacherId

	Student.findById(studentId)
		.then((student) => {
			student.update({teacherId: teacherId})
		})
		.then((updatedStudent) => {
			if (updatedStudent) {
				res.sendStatus(204)
			}
		})
		.catch(next);
	
	//update a student's teacher
	//return a status code of 204
	
})

app.use((err, req, res, next) => {
	console.error(err);
	res.status(err.status || 500).send(err.message || "Oh no! An error has occured.")
})

db.sync()
.then(() => {
	return Teacher.findOrCreate({ where: {
		name: 'Mr. Fuller',
		subject: 'Latin'
	}	
})
.then((createArr) => {
	let teacher = createArr[0];
	let mrFullerId = teacher.dataValues.id
		return Student.findOrCreate({
			where: {
				name: 'Chris',
				gpa: 3.8,
				teacherId: mrFullerId	
			}	
		})
	})
.then((createArr2)  => {
	let student = createArr2[0];
		
	console.log('db synced')
	app.listen(PORT, () => console.log(`server listening on port ${PORT}`))
	}) 
});

