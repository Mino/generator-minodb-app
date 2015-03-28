var logger = require('tracer').console();
var generators = require('yeoman-generator');
var FieldVal = require('fieldval');
var BasicVal = FieldVal.BasicVal;

module.exports = generators.Base.extend({
	initializing: function() {
		this.project_name = 'minodb-app-example';
		this.username = 'my_app';
		this.password = 'my_password';
		this.email = 'minodb@example.com';
		this.mongodb_url = 'mongodb://127.0.0.1:27017/minodb';
	},
	prompting: function() {
		var done = this.async();
		this.prompt([
			{
			    type    : 'input',
		    	name    : 'project_name',
			    message : 'Plugin project name',
			    default : this.project_name
		   	},
		   	{
		   		type: "checkbox",
		   		message: "Which libs and plugins would you like to include?",
		   		name: "libs",
				choices: [{
		   	      name: "SAFE",
		   	      checked: true
		   	    },{
		   	      name: "MinoVal",
		   	      checked: true
		   	    },{
		   	      name: "MinoCMS",
		   	      checked: true
		   	    },{
		   	      name: "MinoAuth",
		   	      checked: true
		   	    },{
		   	      name: "MinoDbPermissions",
		   	      checked: true
		   	    }]
		   	},
	   		{
	   		    type    : 'input',
	   	    	name    : 'username',
	   		    message : 'MinoDB username',
	   		    default : this.username
	   	   	},
   	   		{
   	   		    type    : 'input',
   	   	    	name    : 'email',
   	   		    message : 'MinoDB email',
   	   		    default : this.email
   	   	   	},
   	   		{
   	   		    type    : 'input',
   	   	    	name    : 'password',
   	   		    message : 'MinoDB password',
   	   		    default : this.password
   	   	   	},
		   	{
			    type: "input",
			    message: "Enter MongoDB URL",
			    name: "mongodb_url",
			    default: this.mongodb_url,
			    validate: function(value) {
			    	var error = BasicVal.prefix("mongodb://").check(value);
			    	if (error) {
			    		return error.error_message;
			    	}
			    	return true;
			    }
			}
	   	], function (answers) {

		    var include_safe = answers.libs.indexOf("SAFE") != -1;
		    var include_minoval = answers.libs.indexOf("MinoVal") != -1;
		    var include_minocms = answers.libs.indexOf("MinoCMS") != -1;
		    var include_minoauth = answers.libs.indexOf("MinoAuth") != -1;
		    var include_minoperms = answers.libs.indexOf("MinoDbPermissions") != -1;

	   		this.options = {
	   			include_safe: include_safe,
	   			include_minoval: include_minoval,
	   			include_minocms: include_minocms,
	   			include_minoauth: include_minoauth,
	   			include_minoperms: include_minoperms,
	   			project_name: answers.project_name,
	   			mongodb_url: answers.mongodb_url,
	   			username: answers.username,
	   			email: answers.email,
	   			password: answers.password
	   		}

		    done();
		}.bind(this));
	},
	writing: function () {
		var copy_file = function(path, destination_path) {
			if (arguments.length == 1) {
				destination_path = path;
			}

			this.fs.copyTpl(
				this.templatePath(path),
		     	this.destinationPath(destination_path),
		    	this.options
		    );
		}.bind(this);

		copy_file('server.js');
		copy_file('mino_setup.js');
		copy_file('package.json');
		copy_file('bower.json');
		copy_file('gulpfile.js');
		copy_file('.gitignore');
		copy_file('README.md');
		copy_file('test');
		copy_file('views');
		copy_file('globals.js');
		copy_file('public_src/init.js');
		copy_file('public_src/style/style.less');
		
		if (this.options.include_safe) {
			copy_file('public_src/pages');
		}
	},
	install: function() {
		var generator = this;
		this.npmInstall(undefined, undefined, function() {
			generator.spawnCommand('gulp', ['js']);
			generator.spawnCommand('gulp', ['less']);
			generator.spawnCommand('gulp', ['test']);		
		});
	}

});