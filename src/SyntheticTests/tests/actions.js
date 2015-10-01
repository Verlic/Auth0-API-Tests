var urlJoin = require('url-join'),
	request = require('request');

var getOptions = function (api, method, token) {
	return {
		url: api,
		method: method,
		headers: {
			'Authorization': 'Bearer ' + token
		}
	}
};

module.exports = function (domain, token) {
	return {
		getConnections: function (callback) {
			var options = getOptions(urlJoin(domain, '/api/v2/connections'), 'GET', token);
			request(options, callback);
		},
		deleteConnection: function (connectionName, callback) {			
			var options = getOptions(urlJoin(domain, '/api/v2/connections/' + connectionName), 'DELETE', token);
			request(options, callback);
		},
		createConnection: function(connection, callback){
			var options = getOptions(urlJoin(domain, '/api/v2/connections'), 'POST', token);			
			options.body = JSON.stringify(connection);			
			options.headers['Content-Type'] = 'application/json';
			request(options, callback);
		},
		createUser: function(user, callback){
			var options = getOptions(urlJoin(domain, '/api/v2/users'), 'POST', token);			
			options.body = user;
			options.json = true;			
			options.headers['Content-Type'] = 'application/json';
			request(options, callback);
		}
	};
} 