const Sequelize = require('sequelize');


const db = new Sequelize('postgres://localhost/juniorenrichment', {
  logging: false
});


const Student = db.define("student" , {
	name: {
		type: Sequelize.STRING,
		allowNull: false
	},
	gpa: {
		type: Sequelize.FLOAT
	},
	// teacherId: {
		
	// }, //associate a student with a teacher
	letterGrade: {
		type: Sequelize.VIRTUAL,
		get() {
			
			let gpa = this.getDataValue('gpa')
			
			switch(true) { //to enter the case, the statement must match to the switch expression
				case +gpa > 3: 
					return 'A';
					break;
				case +gpa >= 2.7:
					return 'B';
					break;
				case +gpa >= 1.3:
					return 'C';
					break;
				case +gpa >= 1:
					return 'D';
					break;
				default: 
					return 'F';
					break;
			}
		}
		//get gpa, turn it into a letter grade
	}

})
	

const Teacher = db.define('teacher', {
	/* TEACHER MODEL CODE HERE */
	name: {
		type: Sequelize.STRING,
		allowNull: false
	},
	subject: {
		type: Sequelize.STRING,
		allowNull: false
	}

});

Student.belongsTo(Teacher, {as: 'student'});
Teacher.hasMany(Student);

module.exports = {db, Student, Teacher}