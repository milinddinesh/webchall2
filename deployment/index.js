const express = require('express');
const body_parser = require('body-parser');
const path = require('path');
const cookie_parser = require('cookie-parser');
const mysql = require('mysql');
const { exec } = require("child_process");

var mysql_connection = mysql.createConnection({
	host:'localhost',
	user:'root',
	password:'',
	database:'zeltron'
});

mysql_connection.on('error', (error) => {
	console.log('MYSQL connection failed!');
	process.exit();
});

let app = express();

app.set('view engine', 'ejs');

app.use(body_parser.urlencoded({
	extended : true
}));

app.use(body_parser.json());

app.use(cookie_parser());

app.use('/static', express.static(path.join(__dirname, '/images')));

let port = 8080;
let admin_user_id = 0;
let admin_username = 'admin';

mysql_connection.query('SELECT * FROM users WHERE username = ?', [admin_username], (error, results, fields) => {
	if (error) {
		console.log(error);
		process.exit();
	} else {
		if (results.length == 1) {
			admin_user_id = results[0].cookie;
		} else {
			console.log('admin field not created in database with password and cookie, please create one.');
			process.exit();
		}
	}
});

let random_number_generator = function(length, ignore_number) {
	let nvns = ignore_number.toString();
	let generated_random_number = '';
	let random_number_generator_function = (length) => {
		let characters = '0123456789';
		let characters_ones_place = '05';
		let random_number = '';
		for (let i = 0; i < length; i ++) {
			if (i == (length - 1)) {
				random_number += characters_ones_place.charAt(Math.floor(Math.random() * characters_ones_place.length));
			} else {
				random_number += characters.charAt(Math.floor(Math.random() * characters.length));
			}
		}
		return random_number;
	}
	while ((nvns === generated_random_number) || (generated_random_number === '')) {
		generated_random_number = random_number_generator_function(length);
	}
	return parseInt(generated_random_number);
}


let srandom_number_generator = function() {
	let characters = '12345';
	let random_number = '';
	random_number = characters.charAt(Math.floor(Math.random() * characters.length));
	return parseInt(random_number);
}

app.get('/', (request, response) => {
	if (request.cookies['user_id'] && request.cookies['user']) {
		response.redirect('/logged_in');
	} else {
		response.sendFile(path.join(__dirname + '/lgorsppage.html'));
	}
});


app.get('/sign_up', (request, response) => {
	if (request.cookies['user_id'] && request.cookies['user']) {
		response.redirect('/logged_in');
	} else {
		response.render(path.join(__dirname + '/signuppage.ejs'), {
			check : 0
		});
	}
});

app.post('/signup_info', (request, response) => {
	if (request.body.username && (request.body.username.length <= 40)) {
		if (request.body.password && (request.body.password.length <= 20)) {
			if (request.body.password === request.body.check_password) {
				mysql_connection.query('SELECT * FROM users WHERE username = ?', [request.body.username], (error, results, fields) => {
					if (results.length > 0) {
						response.render(path.join(__dirname + '/signuppage.ejs'), {
							check : 4
						});
					} else {
						mysql_connection.query('INSERT INTO users (username, password, cookie) VALUES (?, ?, ?)', [request.body.username, request.body.password, 0], (error, results, fields) => {
							response.redirect('/login');
						});
					}
				});
			} else {
				response.render(path.join(__dirname + '/signuppage.ejs'), {
					check : 3
				});
			}
		} else {
			response.render(path.join(__dirname + '/signuppage.ejs'), {
				check : 2
			});
		}
	} else {
		response.render(path.join(__dirname + '/signuppage.ejs'), {
			check : 1
		});
	}
});

app.get('/login', (request, response) => {
	if (request.cookies['user_id'] && request.cookies['user']) {
		response.redirect('/logged_in');
	} else {
		response.render(path.join(__dirname + '/loginpage.ejs'), {
			check : 0
		});
	}
});

app.post('/login_info', (request, response) => {
	if (request.body.username && (request.body.username != admin_username)) {
		if (request.body.password) {
			mysql_connection.query('SELECT * FROM users WHERE username = ? AND password = ?', [request.body.username, request.body.password], (error, results, fields) => {
				if (results.length == 1) {
					let temp = random_number_generator(admin_user_id.toString().length, admin_user_id);
					response.cookie('user_id', temp, {
						httpOnly : true
					});
					response.cookie('user', request.body.username, {
						httpOnly : true
					});
					mysql_connection.query('UPDATE users SET cookie = ? WHERE username = ?', [temp, request.body.username], (error, results, fields) => {
						response.redirect('/logged_in');
					});
				} else {
					response.render(path.join(__dirname + '/loginpage.ejs'), {
						check : 1
					});
				}
			});
		} else {
			response.render(path.join(__dirname + '/loginpage.ejs'), {
				check : 1
			});
		}
	} else {
		response.render(path.join(__dirname + '/loginpage.ejs'), {
			check : 1
		});
	}
});

app.get('/logged_in', (request, response) => {
	if (request.cookies['user_id'] && request.cookies['user']) {
		mysql_connection.query('SELECT * FROM users WHERE username = ?', [request.cookies['user']], (error, results, fields) => {
			if (results.length == 1) {
				if (request.cookies['user_id'] == results[0].cookie) {
					let temp = srandom_number_generator();
					if ((request.cookies['user_id'] == admin_user_id) && (request.cookies['user'] == admin_username)) {
						response.render(path.join(__dirname + '/homepage.ejs'), {
							user : request.cookies['user'],
							check : true,
							subordinate : temp
						});
					} else {
						response.render(path.join(__dirname + '/homepage.ejs'), {
							user : request.cookies['user'],
							check : false,
							subordinate : temp
						});
					}
				} else {
					response.redirect('/sign_up');
				}
			} else {
				response.redirect('/sign_up');
			}
		});
	} else {
		response.redirect('/sign_up');
	}
});

app.post('/check_permissions', (request, response) => {
	if (request.cookies['user_id'] && request.cookies['user']) {
		response.redirect('/logged_in');
	} else {
		response.redirect('/sign_up');
	}
});

app.post('/logout', (request, response) => {
	if (request.cookies['user_id'] && request.cookies['user']) {
		response.clearCookie('user_id');
		response.clearCookie('user');
		response.redirect('/');
	} else {
		response.redirect('/');
	}
});

app.post('/pinger', (request, response) => {
    if (request.cookies['user_id'] && request.cookies['user']) {
        mysql_connection.query('SELECT * FROM users WHERE username = ?', [request.cookies['user']], (error, results, fields) => {
            if (results.length == 1) {
                if (request.cookies['user_id'] == results[0].cookie) {
                    let ipa = request.body.ip;
                    let cmd = 'ping -c 3 '+ ipa + ' | head -2'
                    exec(cmd, (error, stdout, stderr) => {
                        if (error) {
                            console.log(`error: ${error.message}`);
                            return;
                        }
                        if (stderr) {
                            console.log(`stderr: ${stderr}`);
                            return;
                        }
                        response.render(path.join(__dirname + '/result.ejs'), {
                            values : stdout,
                            result : true
                        });
                    });
                } else {
                    response.redirect('/sign_up');
                }
            } else {
                response.redirect('/sign_up');
            }
        })
    }
});

app.listen(port, (error) => {
	if (error) {
		console.log('Port 8080 not idle!');
		process.exit();
	} else {
		console.log('Listening at port: 8080');
	}
	});
	