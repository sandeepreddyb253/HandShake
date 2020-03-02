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
    database : 'handshake',
    dateStrings:true
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

app.post('/auth', async function(request, response) {
	var username = request.body.username;
    var password = request.body.password;
    var res = {}
	if (username && password) {
	    connection.query('SELECT * FROM `lu_user` WHERE `user_name` = ? AND `password` = ?', [username, password],async function(error, results) {
           //console.log(error);
			if (results.length == 1) {
                var id;
                var role = results[0].role_name
                console.log(results[0].role_name)
                res.role = role;
                if(role ==='student'){
                    
                    var sqlQuery = 'select * from students where fk_user_id = '+results[0].user_id;
                    var results = await getResults(sqlQuery);
                    //console.log('student coookie id:', results)
                    id = results[0].student_id
                }else if(role ==='company'){
                    console.log('role is company !!')
                    var sqlQuery = 'select * from company where fk_user_id = '+results[0].user_id;
                    var results = await getResults(sqlQuery);
                    id = results[0].company_id
                }
                id = role+':'+id
                response.cookie('cookie',id,{maxAge: 900000, httpOnly: false, path : '/'});
            //    response.writeHead(200,{
            //         'Content-Type' : 'text/plain'
            //     })
             response.send(res);;
			} else {
                console.log('Incorrect Username and/or Password!');
            }			
			
		});
	} else {
		response.send('Please enter Username and Password!');
		//response.end();
	}
});




app.post('/register', async function(request, response) {
	var username = request.body.username;
    var email = request.body.email;
    var password = request.body.password;
    var role = request.body.role;
    var firstName = request.body.firstName;
    var lastName = request.body.lastName
    var bool = false;
    if (username && password) {
        var sql = "INSERT INTO `lu_user`(`user_name`, `email`,`password`,`role_name`) VALUES ('" + username + "','" + email + "','" +password +"','"+ role + "')";
        var values = [username,email,password,role];
        console.log(values);
       var results = await getResults(sql);
	    var userId = results.insertId;
        if(role == "student"){
                    var sql = "INSERT INTO `students`(`first_name`, `last_name`,`fk_user_id`,`email`) VALUES ('"+firstName+"','"+lastName+"'," + userId + ",'" +email + "')";
                    var results = await getResults(sql);
        }
        if(role == "company"){
                    var sql = "INSERT INTO `company`(`company_name`, `company_desc`,`fk_user_id`,`email`) VALUES ('"+firstName+"','"+lastName+"',"+ userId + ",'" +email + "')";
                    var results = await getResults(sql)
        }
        
					
			//response.end();
        }
        response.writeHead(200,{
            'Content-Type' : 'text/plain'
            })  
         response.end("succesfully saved");
    } );



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

app.get('/home/:id', async function(request, response) {
	if (true) {
        var data = request.params.id;
        var jobPostings;
        console.log("request in Home page")
       await  renderHomePage(request, response,jobPostings,data)
        
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

app.get('/applications/:id', async function(request, response) {
	if (true) {
        var data = request.params.id;
        await renderApplicationsData(request, response,data)
        
	} else {
        response.redirect('/');
	}
	
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
                var insertQuery = "insert into student_experience_details (fk_student_id,company,postion,work_desc,work_location) values ('" + student_id + "','"+exp.company+"','" + exp.postion + "','" +exp.work_desc +"','" +exp.work_location + "')";
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

   // var data = request.params.id;
    var tabHeadersQuery = "select * from map_role_tab "
    results = await getResults(tabHeadersQuery);  
    //console.log(results[1].job_desc);
    tabHeaders= await results;
    // var result = [];
    // tabHeaders.forEach(async tab => {
    //     if(tab.role_name === roleName){
    //         result.push(tab)
    //     }

    // })
    console.log(results);
    response.send(tabHeaders);
});

async function renderProfilePage(request,response, studentObject,stduentEducation,studentExperience,student_id){
    console.log('studentId: ',student_id)     
    var studentsQuery = 'select * from students where student_id ='+student_id
        values = [1]
        console.log('studentId: ',student_id)
        results = await getResults(studentsQuery);        
        studentObject = await results[0];
        console.log(studentObject.dob);
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

async function renderHomePage(request,response,jobPostings,data){
  // var student_id = data;
    var jobPostingsQuery = "select * from job_postings ";
    var values = [data]
    console.log('dataaa:',data)
    var applicationsQuery = 'select * from map_student_job where fk_student_id = ?';
    results = await getResults(jobPostingsQuery);  
    studentApplications = await getResults(applicationsQuery,values);
    console.log('All Job Applications::',studentApplications)
    job_ids = []
    await studentApplications.forEach(async obj=>{
       await job_ids.push(obj.fk_job_id)
       console.log('Jaffa')
    })
    console.log('jobIds:::',job_ids)
    results.forEach(async obj => {
        if(job_ids.includes(obj.job_id)){
            obj.status = 'Applied';
            obj.disable = true
        }else{
            obj.status = 'Apply';
            obj.disable = false
        }
    })
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


async function renderApplicationsData(request,response,data){
    var values = [data]
    var applicationsQuery = 'select * from map_student_job where fk_student_id = ?';
    studentApplications = await getResults(applicationsQuery,values);

    await studentApplications.forEach(async app=>{
        var jobQuery = 'select * from job_postings where job_id = ?'
        var jobValues = [app.fk_job_id];
        job = await getResults(jobQuery,jobValues);
        console.log('jobs:',job[0].postion)
        app.postion =  job[0].postion;
        app.job_desc =  job[0].job_desc;
        app.job_location =  job[0].job_location
        var companyQuery = 'select * from company where company_id = ?'
        var companyValues = [job[0].fk_company_id];
        company = await getResults(companyQuery,companyValues);
        app.company_name =  company[0].company_name;
        console.log('apppp:',app)
    })
    results = await studentApplications
    console.log('modified result:',results);
    response.send(results);
}


