var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
const util = require('util');
var cors = require('cors');
var CryptoJS = require("crypto-js");
var multer = require('multer');
var fs = require('fs')


var fileStorage = multer.diskStorage({
    destination: function (req, file, cb) {
    console.log('req in storage',req.query.id)
    cb(null, '/HandshakeFiles/Resumes')
  },
  filename: function (req, file, cb) {
    cb(null, req.query.studentId+'_'+req.query.jobId+'.pdf')
  }
})

var studentProfileStorage = multer.diskStorage({
    destination: function (req, file, cb) {
    console.log('req in storage',req.query.studentId)
    cb(null, './HandshakeFiles/students/')
  },
  filename: function (req, file, cb) {
    cb(null, req.query.studentId+'.jpg')
  }
})

var companyProfileStorage = multer.diskStorage({
    destination: function (req, file, cb) {
    console.log('req in storage',req.query.studentId)
    cb(null, '/HandshakeFiles/company/')
  },
  filename: function (req, file, cb) {
    cb(null, req.query.companyId+'.jpg')
  }
})

var imageUpload = multer({ storage: studentProfileStorage }).single('studentProfileStorage')

var upload = multer({storage:fileStorage}).single('file')

var companyImageUpload = multer({storage:companyProfileStorage}).single('companyProfileStorage')

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
	    connection.query('SELECT * FROM `lu_user` WHERE `user_name` = ? ', [username],async function(error, results) {
           //console.log(error);
			if (results.length == 1) {
                var id;
                var role = results[0].role_name
                console.log(results[0].role_name)
                res.role = role;
                var bytes  =await  CryptoJS.AES.decrypt(results[0].password, 'secretKey123');
                var plaintext = await bytes.toString(CryptoJS.enc.Utf8);
                //console.log("decrypted text", plaintext);
                if(plaintext === password){
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
            }
            else{
                response.send("error")
            }
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

app.post('/uploadFile',async function(req,res){
    if(req.query.type === 'resume'){
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
           // console.log('error',err)
            return res.status(500).json(err)
        } else if (err) {
           // console.log('error',err)
            return res.status(500).json(err)
        }
   // console.log('response',res.file)
   return res.status(200).send(req.file)
    })
    }else if(req.query.type === 'studentProfilePic'){
        console.log('Image uplaoding')
        imageUpload(req, res, function (err) {
            if (err instanceof multer.MulterError) {
                console.log('error',err)
                return res.status(500).json(err)
            } else if (err) {
               console.log('error',err)
                return res.status(500).json(err)
            }
       console.log('response',res.file)
       return res.status(200).send(req.file)
    })
}else if(req.query.type === 'companyProfilePic'){
    console.log('Image uplaoding')
    companyImageUpload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            console.log('error',err)
            return res.status(500).json(err)
        } else if (err) {
           console.log('error',err)
            return res.status(500).json(err)
        }
   console.log('response',res.file)
   return res.status(200).send(req.file)
})
}
})

app.post('/saveApplication',async function(request,response){
    var jobId = request.body.jobId;
    var studentId = request.body.studentId;
   var resumePath = request.body.resumePath;

    console.log('fileData:::',resumePath)

    var dateNow = new Date();
    var dd = dateNow.getDate();
    var monthSingleDigit = dateNow.getMonth() + 1,
    mm = monthSingleDigit < 10 ? '0' + monthSingleDigit : monthSingleDigit;
    var yyyy = dateNow.getFullYear().toString();

    var application_date = yyyy + '-' + mm + '-' +dd;

    var applicationsQuery = "insert into map_student_job (fk_student_id,fk_job_id ,application_date,status,resume_path) Values ('" + studentId + "','" + jobId +"','" + application_date +"','" + "Pending" +"','" + resumePath +"')";

    results = await getResults(applicationsQuery);
    console.log(results);
    response.writeHead(200,{
    'Content-Type' : 'text/plain'
    })
    response.end("Successfully Saved application");;

})


app.post('/saveRegister',async function(request,response){
    var event_id = request.body.event_id;
    var studentId = request.body.studentId;

    var dateNow = new Date();
    var dd = dateNow.getDate();
    var monthSingleDigit = dateNow.getMonth() + 1,
    mm = monthSingleDigit < 10 ? '0' + monthSingleDigit : monthSingleDigit;
    var yyyy = dateNow.getFullYear().toString();

    var application_date = yyyy + '-' + mm + '-' +dd;

    var applicationsQuery = "insert into map_student_event (fk_student_id,fk_event_id ,registration_data) Values ('" + studentId + "','" + event_id +"','" + application_date +"')";

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
        
	} 
});


app.get('/events/:id', function(request, response) {
	if (true) {
        var data = request.params.id
        var event_name = request.query.event_name
        var jobPostings;
        renderEventsPage(request, response,jobPostings,data,event_name)
        
	} 
	//response.end();
});

app.get('/applications/:id', async function(request, response) {
	if (true) {
        var data = request.params.id;
        var status = request.query.status
        await renderApplicationsData(request, response,data,status)
        
	} else {
        response.redirect('/');
	}
	
});

app.get('/profile/:id', function(request, response) {
   if (true) {
        var student_id = request.params.id;
        //console.log('===', student_id)
       var studentObject;
       var stduentEducation;
       var studentExperience;
       renderProfilePage(request,response, studentObject,stduentEducation,studentExperience,student_id);
       
	} else {
        response.redirect('/');
	}
	//response.end();
});



app.get('/getJobStudents/:id', async function(request,response) {
    
    var jobStudentsQuery = "select * from map_student_job msj join students s on msj.fk_student_id = s.student_id where msj.fk_job_id ='"+request.params.id+"'";
    jobStudents = await getResults(jobStudentsQuery);
    console.log(jobStudents)

    
    var studentsQuery = 'select * from students'
    // values = [1]
     results = await getResults(studentsQuery);
     response.send(jobStudents); 
});


app.get('/getEventStudents/:id', async function(request,response) {    
var jobStudentsQuery = "select * from map_student_event mse join students s on mse.fk_student_id = s.student_id where mse.fk_event_id ='"+request.params.id+"'";
jobStudents = await getResults(jobStudentsQuery);
console.log(jobStudents)


//var studentsQuery = 'select * from students'
// values = [1]
 //results = await getResults(studentsQuery);
 response.send(jobStudents); 
});

app.get('/getAllStudents',async function(request,response){
    var first_name = request.query.first_name
    var college_name = request.query.college_name
    var major = request.query.major
    var skills = request.query.skills
    let values = [college_name,major];
    let parameter = false;
    if((first_name!= '') || (college_name!='' )|| (major!='')){
        console.log('fetching only few guys',first_name , college_name, major )
        let studentsQuery = "select * from students where"
            if(first_name != 'undefined' && first_name!= ''){
                studentsQuery= studentsQuery.concat(" first_name like '%"+first_name+"%' ")
                console.log('appending',studentsQuery)
                //values.concat(first_name)
                parameter = true
            }
            if(college_name != 'undefined'){
                if(parameter){
                    studentsQuery= studentsQuery.concat(" and ")
                    
                }
                studentsQuery = studentsQuery.concat(" college_name = '"+ college_name+"'")
                parameter = true
                //values.concat(college_name)
            }
            if(major != 'undefined'){
                if(parameter){
                    studentsQuery =  studentsQuery.concat(" and ")
                }
                studentsQuery = studentsQuery.concat(" major = '"+major+"'")
               parameter = true;
            }
            if(skills != 'undefined' && skills!= ''){
                if(parameter){
                    studentsQuery =   studentsQuery.concat(" and ")
                }
                studentsQuery= studentsQuery.concat(" skills like '%"+skills+"%' ")
                console.log('appending',studentsQuery)
                //values.concat(first_name)
                
            }
        console.log(studentsQuery)
       // let values = [first_name,college_name,major]
        let results = await getResults(studentsQuery);
        response.send(results);
    }else{
        console.log('fetching everyone')
    var studentsQuery = 'select * from students'
   // values = [1]
    results = await getResults(studentsQuery);
    response.send(results);
    }
})


app.get('/searchJobs',async function(request,response){
    var company_name = request.query.company_name
    var postion = request.query.postion
    var job_location = request.query.job_location
    var category = request.query.category
   // let values = [college_name,major];
    let parameter = false;
    if((company_name!= '') || (postion!='' )|| (job_location!='')|| (category !='' )){
        console.log('fetching only few guys',company_name , postion, job_location,category )
        let studentsQuery = "select * from job_postings where"
            if(company_name != 'undefined' && company_name!= ''){
                studentsQuery= studentsQuery.concat(" company_name like '%"+company_name+"%' ")
                //console.log('appending',studentsQuery)
                //values.concat(first_name)
                parameter = true
            }
            if(postion != 'undefined' && postion!= ''){
                if(paramater){
                    studentsQuery.concat(" and ")
                }
                studentsQuery= studentsQuery.concat(" postion like '%"+postion+"%' ")
                //console.log('appending',studentsQuery)
                //values.concat(first_name)
                parameter = true
            }
            if(job_location != 'undefined'){
                if(parameter){
                    studentsQuery.concat(" and ")
                    
                }
                studentsQuery = studentsQuery.concat(" job_location = '"+ job_location+"'")
                parameter = true
                //values.concat(college_name)
            }
            if(category != 'undefined'){
                if(parameter){
                    studentsQuery.concat(" and ")
                }
                studentsQuery = studentsQuery.concat(" category = '"+category+"'")
               // values.concat(major)
            }
        console.log(studentsQuery)
       // let values = [first_name,college_name,major]
        let results = await getResults(studentsQuery);
        response.send(results);
    }else{
        console.log('fetching everyone')
    var studentsQuery = 'select * from job_postings'
   // values = [1]
    results = await getResults(studentsQuery);
    response.send(results);
    }
})

app.get('/companyJobPostings/:id',async function(request,response){
   var data = request.params.id
   console.log('data::',data)
    var companyJobQuery = 'select * from job_postings where fk_company_id = ?'
    values = [data]
    results = await getResults(companyJobQuery,values);
    response.send(results);
})

app.put('/updateJobStatus',async function(request,response){
    try{
        values = [request.body.status,request.body.map_application_id]
        var updateQuery = 'update map_student_job set status = ? where  map_application_id = ?';
        results = await getResults(updateQuery,values); 
        //console.log('jaffa',jaffa)
        response.writeHead(200,{
            'Content-Type' : 'text/plain'
        })
        response.end("Successful updated");
    }catch(err){
        console.log('error')
        response.end(err.message);
    }
})

app.put('/saveJobs',async function(request, response) {
    if (true) {
       
        //var data = request.body;
        //console.log('Expereince id: ',expId);
        const job = request.body;
       // var student_id = experiences[0].fk_student_id;
        console.log(job);
        if(job.job_id){
            console.log('updating job')
            var values  = [job.postion, job.job_desc,job.job_long_desc,job.job_long_desc2,job.job_long_dec3,job.job_location,job.deadline,job.category,job.skills_required,job.job_id]
            var updateQuery = 'update job_postings set postion = ?, job_desc = ?,job_long_desc = ?,job_long_desc2 = ?,job_long_dec3=?,job_location = ?,deadline = ? ,category = ?,skills_required = ? where job_id = ?';
            results = await getResults(updateQuery,values);
            console.log(results);
            }else{
                console.log('inserting experince')
                var companyQuery = "select * from company where company_id = '"+job.fk_company_id+"'"
                companyResults = await getResults(companyQuery)               
                var insertQuery = "insert into job_postings (postion,fk_company_id,job_desc,job_long_desc,job_long_desc2,job_long_dec3,job_location,deadline,category,skills_required,company_name) values ('" + job.postion + "','"+job.fk_company_id + "','" +job.job_desc+"','" + job.job_long_desc + "','" +job.job_long_desc2 + "','" +job.job_long_dec3 + "','" +job.job_location + "','" +job.deadline + "','" +job.category + "','" +job.skills_required +"','"+ companyResults[0].company_name+"')";
                results = await getResults(insertQuery,values);
            }

            }
        
        
        response.writeHead(200,{
            'Content-Type' : 'text/plain'
        })
        response.end("Successful Login");;
        
     } );
     //response.end();
 
     app.put('/saveEvents',async function(request, response) {
        if (true) {
           try{
            const event = request.body;
            console.log(event);
            if(event.event_id){
                console.log('updating job')
                var values  = [event.event_name, event.event_desc,event.location,event.event_time,event.eligiblity,event.event_id]
                var updateQuery = 'update company_events set event_name = ?, event_desc = ?,location = ?,event_time = ?,eligiblity=? where event_id = ?';
                results = await getResults(updateQuery,values);
                console.log(results);
                }else{
                    console.log('inserting experince')
                    var insertQuery = "insert into company_events (event_name,fk_company_id,event_desc,location,event_time,eligiblity) values ('" + event.event_name + "','"+event.fk_company_id + "','" +event.event_desc+"','" + event.location + "','" +event.event_time + "','" +event.eligibility +"')";
                    results = await getResults(insertQuery);
                }
    
                
            response.writeHead(200,{
                'Content-Type' : 'text/plain'
            })
            response.end("Successfully Upated");;
        }catch(err){
            response.end(err.message)
        }
         } 
        });

app.get('/companyEvents/:id',async function(request,response){
    var data = request.params.id
   console.log('data::',data)
    var companyJobQuery = 'select * from company_events where fk_company_id = ?'
    values = [data]
    results = await getResults(companyJobQuery,values);
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
            var values  = [exp.company, exp.postion,exp.work_desc,exp.work_location,exp.from_date,exp.to_date,exp.student_exp_id]
            var updateQuery = 'update student_experience_details set company = ?, postion = ?, work_desc = ? ,work_location = ?,from_date =?,to_date=?  where student_exp_id = ?';
            results = await getResults(updateQuery,values);
            console.log(results);
            }else{
                console.log('inserting experince')
                var insertQuery = "insert into student_experience_details (fk_student_id,company,postion,work_desc,work_location,from_date,to_date) values ('" + student_id + "','"+exp.company+"','" + exp.postion + "','" +exp.work_desc +"','" +exp.work_location + "','" +exp.from_date +"','"+exp.to_date +"')";
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
        var filePath = request.query.filePath
        console.log('filePath::',filePath)
        const studentObjects = request.body;
        console.log(studentObjects);
        var student_id = studentObjects[0].student_id;
        studentObjects.forEach(async obj => {
            if(obj.student_id){
            var values  = [obj.first_name,obj.last_name,obj.city,obj.email,obj.phone_no, obj.skills,obj.major,obj.objective,obj.college_name,filePath,student_id]
            var updateQuery = 'update students set first_name =?,last_name = ?,city=?, email = ?, phone_no = ?,skills = ?,major=?,objective =?,college_name=?,profile_path=? where student_id = ?';
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
            var values  = [edu.college, edu.course,edu.grad_date,edu.gpa,edu.student_education_id]
            var updateQuery = 'update student_educational_details set college = ?, course = ?,grad_date =?,gpa=?  where student_education_id = ?';
            results = await getResults(updateQuery,values);
            console.log(results);
            }else{
                var insertQuery = "insert into student_educational_details (fk_student_id,college,course,grad_date,gpa) values ('" + student_id + "','"+edu.college+"','" + edu.course +  "','"+edu.grad_date+"','"+edu.gpa +"')";
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
    //console.log(results);
    response.send(tabHeaders);
});

app.get('/companyProfile/:id',async function(request,response){

    var data = request.params.id;
    var companyProfileQuery = "select * from company where company_id = ?"
    var values = [data]
     results = await getResults(companyProfileQuery,values);  
     //console.log(results[1].job_desc);
     companyProfile= await results;
     response.send(companyProfile);
 });

 app.put('/companyProfile/:id',async function (request,response){
    var data = request.params.id;
    console.log('Jaffa')
    var companyObjects =  request.body;
    companyObjects.forEach(async companyObject =>{
    var companyProfileQuery = "update company set company_name = ?, company_desc = ?,email = ?,phone_no = ?, city = ?, state= ?,country = ?,profile_path=? where company_id = ?"
    var values = [companyObject.company_name,companyObject.company_desc,companyObject.email,companyObject.phone_no,companyObject.city,companyObject.state,companyObject.country,companyObject.resumePath,companyObject.company_id]
     results = await getResults(companyProfileQuery,values);  
     //console.log(results[1].job_desc);
     companyProfile= await results;
    
    })
     response.writeHead(200,{
        'Content-Type' : 'text/plain'
    })
    response.end("Successful Login");;
    //response.send(companyProfile);
 })

async function renderProfilePage(request,response, studentObject,stduentEducation,studentExperience,student_id){
   // console.log('studentId: ',student_id)     
    var studentsQuery = 'select * from students where student_id ='+student_id
        values = [1]
        //console.log('studentId: ',student_id)
        results = await getResults(studentsQuery);        
        studentObject = await results[0];
       // console.log(studentObject.dob);
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
  var company_name = request.query.company_name
    var postion = request.query.postion
    var job_location = request.query.job_location
    var category = request.query.category
    var jobPostingsQuery
   // let values = [college_name,major];
   
    if((company_name != undefined) || (postion != undefined )|| (job_location!=undefined)|| (category !=undefined )){
        console.log('fetching only few guys',company_name , postion, job_location,category )
        jobPostingsQuery = "select * from job_postings where"
        let parameter = false;
            if(await company_name != 'undefined' && company_name!= ''){
                  jobPostingsQuery= jobPostingsQuery.concat(" company_name like '%"+company_name+"%' ")
                parameter = true
            }
            if(postion != 'undefined' && postion!= ''){
                console.log('Parameter here ::',parameter)
                 if(await parameter){
                    console.log('Anddd')
                    jobPostingsQuery = jobPostingsQuery.concat(" and ");
                }
                jobPostingsQuery= jobPostingsQuery.concat(" postion like '%"+postion+"%' ")
                //console.log('appending',studentsQuery)
                //values.concat(first_name)
                parameter = true
            }
            if(job_location != 'undefined'){
                if(parameter){
                    jobPostingsQuery =    jobPostingsQuery.concat(" and ")
                    
                }
                jobPostingsQuery = jobPostingsQuery.concat(" job_location = '"+ job_location+"'")
                parameter = true
                //values.concat(college_name)
            }
            if(category != 'undefined'){
                if(parameter){
                    jobPostingsQuery=  jobPostingsQuery.concat(" and ")
                }
                jobPostingsQuery = jobPostingsQuery.concat(" category = '"+category+"'")
               // values.concat(major)
            }
        console.log(jobPostingsQuery)
       // let values = [first_name,college_name,major]
        //let results = await getResults(studentsQuery);
        //response.send(results);
    }else{
        console.log('fetching everyone')
         jobPostingsQuery = "select * from job_postings ";
         // values = [1]
    //results = await getResults(studentsQuery);
    //response.send(results);
    }
    
    var values = [data]
    console.log('dataaa:',data)
    var applicationsQuery = 'select * from map_student_job where fk_student_id = ?';
    results = await getResults(jobPostingsQuery);  
    studentApplications = await getResults(applicationsQuery,values);
    //console.log('All Job Applications::',studentApplications)
    job_ids = []
    await studentApplications.forEach(async obj=>{
       await job_ids.push(obj.fk_job_id)
       //console.log('Jaffa')
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

async function renderEventsPage(request,response,events,data,event_name){
    //data = 1
    var eventsQuery = "select * from company_events ";
    if(event_name){
        console.log('event_name::',event_name)
        eventsQuery= eventsQuery.concat(" where event_name like '%"+event_name+"%'")
    }
    eventsQuery.concat(" order by event_time")
    results = await getResults(eventsQuery);  
    //console.log(results[1].job_desc);
    events = await results;

    var studentQuery = "select * from students where student_id = '"+data+"'"
    var studentsResult = await getResults(studentQuery)
    for(event of events){
       event = await modifyEventsData(event,data,studentsResult[0].major)
    }

    var studentEventQuery = 'select * from map_student_event where fk_student_id ='+"'"+data+"'";
   // console.log('postings:'+jobPostings.job_desc)
    studentEvents = await getResults(studentEventQuery);
    for(event of studentEvents){
        event = await modifyStudentsEventsData(event,data)
     }
    response.json({
        events:events,
        studentEvents:studentEvents
    })
}


async function renderApplicationsData(request,response,data,status){
    var values = [data]
    var applicationsQuery = 'select * from map_student_job where fk_student_id = ?';
    if(status){
        applicationsQuery=  applicationsQuery.concat(" and status = '"+status +"'")
    }
    studentApplications = await getResults(applicationsQuery,values);

    for (var app of studentApplications){
      app =  await modifyData(app)
    }
    results = await studentApplications
    //console.log('modified result:',results);
    response.send(results);
}

async function modifyData(app){
    var jobQuery = 'select * from job_postings where job_id = ?'
        var jobValues = [app.fk_job_id];
        job = await getResults(jobQuery,jobValues);
       // console.log('jobs:',job[0].postion)
        app.postion =  job[0].postion;
        app.job_desc =  job[0].job_desc;
        app.job_location =  job[0].job_location
        var companyQuery = 'select * from company where company_id = ?'
        var companyValues = [job[0].fk_company_id];
        company = await getResults(companyQuery,companyValues);
        app.company_name =  company[0].company_name;
        //console.log('apppp:',app)
        return app
}

async function modifyEventsData(event,data,major){
    var query = 'select * from map_student_event where fk_student_id = ? and fk_event_id = ?'
    var values = [data,event.event_id]

    result = await getResults(query,values)
    console.log('result',result)
    if(result.length>0){
        event.status = 'Registered'
        event.disable = true
    }else{
        {
        if(event.eligiblity === major || event.eligiblity ==='All'){
        event.status = 'Register'
        event.disable = false
        }else{
            event.status = 'Ineligible'
            event.disable = true
        }
        }
    }
    return event
}

async function modifyStudentsEventsData(event,data){
    var query = 'select * from company_events where event_id = ?'
    var values = [event.fk_event_id]

    results = await getResults(query,values)

    event.event_name = await results[0].event_name;
    event.location = await results[0].location;
    event.eligibility = await results[0].eligibility;
    event.event_time = await results[0].event_time;
    event.event_desc = await results[0].event_desc;

    
}


app.get("/file/:name", (req, res) => {
    const name = req.params.name;
    console.log("/file req.params: " + JSON.stringify(req.params));
    const path = __dirname +"/HandshakeFiles/"+req.query.role+"/"+ name;

    console.log('path::',path)
    try {
      if (fs.existsSync(path)) {
        res.sendFile(path);
      } else {
        res.status(400);
        res.statusMessage("Not Found");
        res.end();
      }
    } catch (err) {
      res.status(500);
      console.log("/file/:name error: " + err);
      res.end();
    }
   });
   