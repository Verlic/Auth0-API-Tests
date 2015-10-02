var urlJoin = require('url-join'),
	request = require('request'),
	qs = require('querystring');

var getOptions = function (api, method, token) {
	return {
		url: api,
		method: method,
		headers: {
			'Authorization': 'Bearer ' + token
		}
	}
};

/// Auth0 API v2 wrapper functions
module.exports = function (domain, token) {
	return {
		/// Connections API
		connections: {
			apiEndpoint: urlJoin(domain, '/api/v2/connections'),
			getConnections: function (callback) {
				var options = getOptions(this.apiEndpoint, 'GET', token);
				request(options, callback);
			},
			deleteConnection: function (connectionId, callback) {
				var options = getOptions(urlJoin(this.apiEndpoint, connectionId), 'DELETE', token);
				request(options, callback);
			},
			createConnection: function (connection, callback) {
				var options = getOptions(this.apiEndpoint, 'POST', token);
				options.body = JSON.stringify(connection);
				options.headers['Content-Type'] = 'application/json';
				request(options, callback);
			}
		},
		
		/// Users API
		users: {
			apiEndpoint: urlJoin(domain, '/api/v2/users'),
			createUser: function (user, callback) {
				var options = getOptions(this.apiEndpoint, 'POST', token);
				options.body = user;
				options.json = true;
				options.headers['Content-Type'] = 'application/json';
				request(options, callback);
			},
			getUsers: function (connectionName, callback) {				
				var options = getOptions(this.apiEndpoint, 'GET', token);
				options.qs = { connection: connectionName };
				request(options, callback);
			}
		},
		
		/// Rules API
		rules: {
			apiEndpoint: urlJoin(domain, '/api/v2/rules'),
			getRules: function (callback) {
				var options = getOptions(this.apiEndpoint, 'GET', token);
				request(options, callback);
			},
			deleteRule: function (ruleId, callback) {
				var options = getOptions(urlJoin(this.apiEndpoint, ruleId), 'DELETE', token);
				request(options, callback);
			},
			createRule: function (connection, callback) {
				var options = getOptions(this.apiEndpoint, 'POST', token);
				options.body = JSON.stringify(connection);
				options.headers['Content-Type'] = 'application/json';
				request(options, callback);
			}
		},
		
		/// OAUTH
		oauth: {
			apiEndpoint: domain,
			authenticate: function (auth, callback) {
				var options = getOptions(urlJoin(this.apiEndpoint, '/oauth/ro'), 'POST', token);
				options.body = JSON.stringify(auth);
				options.headers['Content-Type'] = 'application/json';
				request(options, callback);
			},
			tokenInfo: function (token, callback) {
				var options = getOptions(urlJoin(this.apiEndpoint, '/tokeninfo'), 'POST', token);
				options.body = JSON.stringify({ id_token: token });
				options.headers['Content-Type'] = 'application/json';
				request(options, callback);
			}
		}
	};
} 