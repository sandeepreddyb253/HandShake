var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
const util = require('util');
var cors = require('cors');


var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : 'Demo@123',
	database : 'handshake'
});
const getResults = util.promisify(connection.query).bind(connection);

var app = express();
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.set('view engine', 'ejs');
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());


// app.get('/', function(request, response) {
// 	response.redirect('/home');
// });

app.post('/auth', function(request, response) {
	var username = request.body.username;
	var password = request.body.password;
	if (username && password) {
	    connection.query('SELECT * FROM `lu_user` WHERE `user_name` = ? AND `password` = ?', [username, password], function(error, results) {
           //console.log(error);
			if (results.length == 1) {
                request.session.loggedin = true;
                var  userdetailsCookie={
                    loggedin :true,
                    username: username,
                    role : results[0].role_name
                }
                response.cookie('cookie',userdetailsCookie,{maxAge: 900000, httpOnly: false, path : '/'});
               response.writeHead(200,{
                    'Content-Type' : 'text/plain'
                })
             response.end("Successful Login");;
			} else {
                console.log('Incorrect Username and/or Password!');
            }			
			
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

app.post('/registerSubmit', function(request, response) {
    var username = request.body.username;
    var email = request.body.email;
    var password = request.body.password;
    var role = request.body.role;
    var bool = false;
    if (username && password) {
        var sql = "INSERT INTO `lu_user`(`user_name`, `email`,`password`) VALUES ('" + username + "','" + email + "','" +password + "')";
        var values = [username,email,password];
        console.log(values);
	    connection.query(sql,function(error, results, fields) {
           // console.log(error);
            if (error == null) {
                console.log('User Registered Succesfully ', results.affectedRows);
                var userId = results.insertId;
                if(role == "student"){
                    var sql = "INSERT INTO `students`(`first_name`, `last_name`,`fk_user_id`,`email`) VALUES ('firstName','lastName'," + userId + ",'" +email + "')";
                     connection.query(sql,function(error, results, fields) {
                            if(error == null){
                                console.log('Student Registered Succesfully ');
                            }else{
                                console.log(error);
                                bool= true;
                                response.redirect('/error');
                            }
                    });
                }
                if(role == "company"){
                    var sql = "INSERT INTO `company`(`company_name`, `company_desc`,`fk_user_id`,`email`) VALUES ('firstName','lastName'," + userId + ",'" +email + "')";
                    connection.query(sql,function(error, results, fields) {
                            if(error == null){
                                console.log('company Registered Succesfully ');
                            }else{
                                console.log(error);
                                bool= true;
                                response.redirect('/error');
                            }
                    });
                }
                if(!bool){
                    response.redirect('/');
                }
            } else {
                response.redirect('/error');
			}			
			//response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}

});


app.post('/register', function(request, response) {
	response.sendFile(path.join(__dirname + '/register.html'));
});


app.post('/saveApplication',async function(request,response){
    var jobId = request.body.jobId;
    var studentId = request.body.studentId;

    var applicationsQuery = "insert into map_student_job (fk_student_id,fk_job_id ) Values ('" + studentId + "','" + jobId + "')";

    results = await getResults(applicationsQuery);
    console.log(results);
    response.writeHead(200,{
    'Content-Type' : 'text/plain'
    })
    response.end("Successfully Saved application");;

})

app.get('/home', function(request, response) {
	if (true) {
        var jobPostings;
        console.log("request in Home page")
        renderHomePage(request, response,jobPostings)
        
	} else {
        response.redirect('/');
	}
	//response.end();
});


app.get('/events', function(request, response) {
	if (true) {
        var jobPostings;
        renderEventsPage(request, response,jobPostings)
        
	} else {
        response.redirect('/');
	}
	//response.end();
});


app.get('/profile/:id', function(request, response) {
   if (true) {
        var student_id = request.params.id;
        console.log('===', student_id)
       var studentObject;
       var stduentEducation;
       var studentExperience;
       renderProfilePage(request,response, studentObject,stduentEducation,studentExperience,student_id);
       
	} else {
        response.redirect('/');
	}
	//response.end();
});


app.get('/getAllStudents',async function(request,response){
    var studentsQuery = 'select * from students'
   // values = [1]
    results = await getResults(studentsQuery);
    response.send(results);
})

app.put('/profile/editExperience/:id', function(request, response) {
    if (true) {
       
        const expId = request.params.id;
        console.log('Expereince id: ',expId);
        const experiences = request.body;
        var student_id = experiences[0].fk_student_id;
        console.log(experiences);
         experiences.forEach(async exp => {
            if(exp.student_exp_id){
                console.log('updating experience')
            var values  = [exp.company, exp.postion,exp.work_desc,exp.work_location,exp.student_exp_id]
            var updateQuery = 'update student_experience_details set company = ?, postion = ?, work_desc = ? ,work_location = ?  where student_exp_id = ?';
            results = await getResults(updateQuery,values);
            console.log(results);
            }else{
                console.log('inserting experince')
                var insertQuery = "insert into student_experience_details (fk_student_id,company,postion,work_desc,work_location,from_date,to_date) values ('" + student_id + "','"+exp.company+"','" + exp.postion + "','" +exp.work_desc +"','" +exp.work_location +"','" +exp.from_date +"','" +exp.to_date + "')";
                results = await getResults(insertQuery,values);
            }
        })
        
        response.writeHead(200,{
            'Content-Type' : 'text/plain'
        })
        response.end("Successful Login");;
        
     } 
     //response.end();
 });

 app.delete('/profile/deleteExperience/:id', async function(request,response){
    var studentExpId = request.params.id
    var deleteExpQuery = "delete from student_experience_details where student_exp_id = "+studentExpId;
    results = await getResults(deleteExpQuery);  
    response.send(results);

 })

 app.delete('/profile/deleteEducation/:id', async function(request,response){
    var studentEduId = request.params.id
    var deleteExpQuery = "delete from student_educational_details where student_education_id = "+studentEduId;
    results = await getResults(deleteExpQuery);  
    response.send(results);

 })

 //editstudentObject

 app.put('/profile/editstudentObject/:id', function(request, response) {
    if (true) {
       
        const studentObjects = request.body;
        console.log(studentObjects);
        var student_id = studentObjects[0].student_id;
        studentObjects.forEach(async obj => {
            if(obj.student_id){
            var values  = [obj.first_name,obj.last_name,obj.city,obj.email,obj.phone_no, obj.skills,obj.education,obj.objective,student_id]
            var updateQuery = 'update students set first_name =?,last_name = ?,city=?, email = ?, phone_no = ?,skills = ?,education=?,objective =? where student_id = ?';
            results = await getResults(updateQuery,values);
            console.log(results);
            }
        })
        
        response.writeHead(200,{
            'Content-Type' : 'text/plain'
        })
        response.end("Successfully Saved");;
        
     } 
     //response.end();
 });

 app.put('/profile/editEducation/:id', function(request, response) {
    if (true) {
       
        const educations = request.body;
        console.log(educations);
        var student_id = educations[0].fk_student_id;
        educations.forEach(async edu => {
            if(edu.student_education_id){
            var values  = [edu.college, edu.course,edu.student_education_id]
            var updateQuery = 'update student_educational_details set college = ?, course = ?  where student_education_id = ?';
            results = await getResults(updateQuery,values);
            console.log(results);
            }else{
                var insertQuery = "insert into student_educational_details (fk_student_id,college,course) values ('" + student_id + "','"+edu.college+"','" + edu.course + "')";
                results = await getResults(insertQuery,values);
            }
        })
        
        response.writeHead(200,{
            'Content-Type' : 'text/plain'
        })
        response.end("Successful Login");;
        
     } 
     //response.end();
 });


app.get('/logout', function(request,response){
    request.session.destroy((err) => {
        if(err) {
            return console.log(err);
        }
    response.redirect('/');
    });
});

app.get('/error',function(rqst,response){
    response.render('pages/error');
});

app.listen(8080);


app.get('/tabHeaders',async function(request,response){

    var tabHeadersQuery = "select * from map_role_tab ";
    results = await getResults(tabHeadersQuery);  
    //console.log(results[1].job_desc);
    tabHeaders= await results;
    // var result = [];
    // tabHeaders.forEach(async tab => {
    //     if(tab.role_name === roleName){
    //         result.push(tab)
    //     }

    // })
    // console.log(result);
    response.send(tabHeaders);
});

async function renderProfilePage(request,response, studentObject,stduentEducation,studentExperience,student_id){
    console.log('studentId: ',student_id)     
    var studentsQuery = 'select * from students where student_id ='+student_id
        values = [1]
        console.log('studentId: ',student_id)
        results = await getResults(studentsQuery);        
        studentObject = await results[0];
        console.log(studentObject);
        var studentsEduQuery = "select * from student_educational_details where fk_student_id = " + studentObject.student_id;
        var studentExpQuery = "select * from student_experience_details where fk_student_id = " + studentObject.student_id;
        results = await getResults(studentsEduQuery);
        stduentEducation = await results;
        results = await getResults(studentExpQuery);
        studentExperience = await results;
      //  console.log(studentObject.college_name);
        response.json({
            studentObject: (studentObject) ,
            studentExperience :(studentExperience),
            stduentEducation:(stduentEducation)
        });
}

async function renderHomePage(request,response,jobPostings){
   var responseObject ;
    var jobPostingsQuery = "select * from job_postings ";
    results = await getResults(jobPostingsQuery);  
    //console.log(results[1].job_desc);
    jobPostings= await results;
    response.send(jobPostings);
}

async function renderEventsPage(request,response,events){
    var eventsQuery = "select * from company_events ";
    results = await getResults(eventsQuery);  
    //console.log(results[1].job_desc);
    events = await results;
   // console.log('postings:'+jobPostings.job_desc)
	response.send(events)
}



