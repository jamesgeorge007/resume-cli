var request = require('superagent');
var Spinner = require('cli-spinner').Spinner;
var spinner = new Spinner('publishing...');
spinner.setSpinnerString('/-\\');
var read = require('read');
var resumeJson = require('../resume');

function settings() {
    mainMenu(function(setting) {
        switch (setting) {
            case 'CHANGE THEME':
                themeMenu(function(theme) {
                    console.log(theme);
                });


                break;
            case 'DELETE ACCOUNT':

                read({
                    prompt: "Email: ",
                    default: resumeJson.bio && resumeJson.bio.email && resumeJson.bio.email.personal || ''
                }, function(er, email) {
                    if (er) {
                        console.log();
                        process.exit();
                    }
                    read({
                        prompt: "Password: ",
                        silent: true
                    }, function(er, password) {
                        if (er) {
                            console.log();
                            process.exit();
                        }
                        deleteUser({
                            email: email,
                            password: password
                        });
                    });
                });

                break;
        }
    });
}

function deleteUser(deleteCredentials) {

    read({
        prompt: 'Are you sure you want to delete your JsonResume.org account? [y/n]: '
    }, function(er, answer) {
        if (answer === 'y') {


            spinner.start();
            request
                .delete(registryServer + '/account')
                .send(deleteCredentials)
                .set('X-API-Key', 'foobar')
                .set('Accept', 'application/json')
                .end(function(error, res) {
                    spinner.stop();
                    // cannot read property of null
                    if (error && error.code === 'ENOTFOUND') {
                        console.log('\nThere has been an error publishing your resume.'.red);
                        console.log('Please check your network connection.'.cyan);
                        process.exit();
                        return;
                    } else if (error || res.body.message === 'ERRORRRSSSS') {

                        console.log('\nThere has been an error publishing your resume.'.red);
                        // console.log('Details:', error, res.body.message);
                        console.log('Please check you are using correct login details.'.blue);
                    } else {

                        console.log('\nYour account has been successfully deleted.');

                    }
                });
            return;


        } else if (answer === 'n') {
            process.exit();
        }
    });

}

function mainMenu(callback) {
    var menu = require('terminal-menu')({
        width: 29,
        x: 4,
        y: 2,
        bg: 'black',
        fg: 'cyan'
    });
    menu.reset();
    menu.write('SETTINGS\n');
    menu.write('-------------------------\n');
    menu.add('CHANGE THEME');
    menu.add('DELETE ACCOUNT');
    menu.write('------------------------------\n');
    menu.add('EXIT');
    menu.on('select', function(setting) {
        menu.close();
        console.log('SELECTED: ' + setting);

        callback(setting);

    });
    menu.createStream().pipe(process.stdout);
}


function themeMenu(callback) {
    var menu = require('terminal-menu')({
        width: 29,
        x: 4,
        y: 2,
        bg: 'black',
        fg: 'cyan'
    });
    menu.reset();
    menu.write('SETTINGS\n');
    menu.write('-------------------------\n');
    menu.add('TRADITIONAL');
    menu.add('MODERN');
    menu.add('CRISP');
    menu.write('------------------------------\n');
    menu.add('EXIT');
    menu.on('select', function(theme) {
        menu.close();
        console.log('SELECTED: ' + theme);
        callback(theme);
    });
    menu.createStream().pipe(process.stdout);
}



module.exports = settings;