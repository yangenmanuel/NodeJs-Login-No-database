/*DEPENDENCIES*/
const express = require('express'),
 bcrypt = require('bcrypt'),
 path = require("path"),
 bodyParser = require('body-parser'),
 colors = require('colors'),
 users = require('./data').userDB;

const port = 3000;

const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname,'./public')));


/*MAIN PAGE*/
app.get('/',(req,res) => {
    res.sendFile(path.join(__dirname,'./public/index.html'));
});




/*REGISTER A USER*/
app.post('/register', async (req, res) => {
  /*CHECK IS THE USER IS ALREADY REGISTERED*/
    try{
        let foundUser = users.find((data) => req.body.username === data.username);
        /*IF IT'S REGISTRATED, THEN WILL ADD HIS DATA*/
        if (!foundUser) {

            /*HASHING HIS PASSWORD WITH BCRYPT*/
            let hashPassword = await bcrypt.hash(req.body.password, 10);

            let newUser = {
                id: Date.now(),
                username: req.body.username,
                password: hashPassword,
            };

            /*PRINT ON THE TERMINAL THE NEW USER'S INFO*/
            users.push(newUser);
            console.log('User list', users);

            /*SHOW THAT THE USER IS SUCCESFULLY REGISTERED*/
            res.send("<link rel='icon' type='img/png' href='icon.png'><title>✔ Success ✔</title><body><h1>Registration successful</h1><br><br><a href='./login.html'>Login</a><br><br><br><br><br><a href='./registration.html'>Register another user</a></body> <style> body{background-color:#bebebe;text-align:center;font-family:'Open sans';} h1{font-size:50px;color:#038c65;} a{text-decoration:none;color:inherit;font-size:20px;padding:10px;border:2px solid grey;border-radius:10px;transition:.3s} a:hover{border:2px solid white;background-color:white;} </style>");

        }


        else {
            res.send("<link rel='icon' type='img/png' href='icon.png'><title>❌ Failure ❌</title><body><h1>The user is already taken</h1><br><br><a href='./registration.html'>Register again</a></body> <style> body{background-color:#bebebe;text-align:center;font-family:'Open sans';} h1{font-size:50px;color:#8c0404;} a{text-decoration:none;color:inherit;font-size:20px;padding:10px;border:2px solid grey;border-radius:10px;transition:.3s} a:hover{border:2px solid white;background-color:white;} </style>");

        }


    }

    /*IF EVERYTHING WENT WRONG*/
    catch{
        res.send("Internal server error");
    }
});



/* LOG IN A USER*/
app.post('/login', async (req, res) => {
  /*CHECK IS THE USER IS ALREADY LOGED*/
    try{
        let foundUser = users.find((data) => req.body.username === data.username);
        if (foundUser) {

            let submittedPass = req.body.password;
            let storedPass = foundUser.password;

            /*COMPARING PASSWORDS*/
            const passwordMatch = await bcrypt.compare(submittedPass, storedPass);

            /*IF THE PASSSWORD MATCHS, WELLCOME THE USER*/
            if (passwordMatch) {
                let username = foundUser.username;
                res.send(`<link rel='icon' type='img/png' href='icon.png'><title>✔ Success ✔</title><body align=center><h1>Login successful</h1><br><br><br><h2>Hello ${username} 👋</h2><br><br><a href='./login.html'>Logout</a></body> <style>body{background-color:#bebebe;font-family:'Open sans';} h1{font-size:50px;color:#038c65;} a{text-decoration:none;color:inherit;font-size:20px;padding:10px;border:2px solid grey;border-radius:10px;transition:.3s} a:hover{border:2px solid white;background-color:white;}</style>`);
            }

            else {
                res.send("<link rel='icon' type='img/png' href='icon.png'><title>❌ Failure ❌</title><body><h1>Invalid user or password</h1><br><br><a href='./login.html'>Login again</a></body>  <style> body{background-color:#bebebe;text-align:center;font-family:'Open sans';} h1{font-size:50px;color:#8c0404;} a{text-decoration:none;color:inherit;font-size:20px;padding:10px;border:2px solid grey;border-radius:10px;transition:.3s} a:hover{border:2px solid white;background-color:white;} </style>");
            }

        }

        else {

            let fakePass = `$2b$$10$ifgfgfgfgfgfgfggfgfgfggggfgfgfga`;
            await bcrypt.compare(req.body.password, fakePass);

            res.send("<link rel='icon' type='img/png' href='icon.png'><title>❌ Failure ❌</title><body><h1>Invalid user or password</h1><br><br><a href='./login.html'>login again</a></body>  <style> body{background-color:#bebebe;text-align:center;font-family:'Open sans';} h1{font-size:50px;color:#8c0404;} a{text-decoration:none;color:inherit;font-size:20px;padding:10px;border:2px solid grey;border-radius:10px;transition:.3s} a:hover{border:2px solid white;background-color:white;} </style>");

           }
       }

  /*IF EVERYTHING WENT WRONG*/
  catch{
        res.send("<link rel='icon' type='img/png' href='icon.png'><title>❌ Failure ❌</title><body><h1>Internal server error<h1></body> <style>body{background-color:#bebebe;font-family:'Open sans';text-align:center}h1{font-size:50px;color:#8c0404}</style>");
    }
});



/*INIZIALIZATE SERVER*/
app.listen(port, ()=>{
    console.log("Local server allocated on port: ".green + port);
});
