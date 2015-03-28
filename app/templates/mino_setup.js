var globals = require('./globals');
var MinoDB = require('minodb');
var MinoCMS = require('minocms');
var MinoVal = require('minoval');
var MinoAuth = MinoDB.Auth;
var MinoDBPermissions = MinoDB.Permissions;

module.exports = function(callback){

	globals.minodb = new MinoDB({
	    ui: true,
	    db_address: globals.mongodb_url
	}, globals.username)

	globals.minodb.create_user({
		"username": globals.username,
		"email": globals.email,
		"password": globals.password
	}, function(err, res){
		
		<%if (include_minoval) {%>
		globals.minoval = new MinoVal({
			user: globals.username
		});
		globals.minodb.add_plugin(globals.minoval);
		<%}%>

		<%if (include_minocms) {%>
		globals.minocms = new MinoCMS({
			"folder_name": "cms",
			"user": globals.username
		});
		globals.minodb.add_plugin(globals.minocms);
		<%}%>

		<%if (include_minoauth) {%>
		globals.auth = new MinoAuth({
			name: "my_app_auth",
			display_name: "My Auth",
			user_path: "/" + globals.username + "/users/",
			session_path: "/" + globals.username + "/sessions/",
			cookie_name: "my_app_token",
			username: globals.username
		})
		globals.minodb.add_plugin(globals.auth);
		<%}%>

		<%if (include_minoperms) {%>
		globals.permissions = new MinoDBPermissions({
			path: "/" + globals.username + "/minodb_permissions/",
			name: "my_permissions",
			display_name: "My Permissions",
			username: globals.username
		})
		globals.minodb.add_plugin(globals.permissions);
		<%}%>
		callback();

	});
};