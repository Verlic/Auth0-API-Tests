var dotenv = require('dotenv').load(),
	chai = require('chai'),
	urlJoin = require('url-join'),
	request = require('request'),
	validator = require('tv4'),
	domain = 'https://' + process.env.DOMAIN,
	token = process.env.TOKEN,
	auth0Api = require('./auth0-api')(domain, token),
	expect = chai.expect,
	schemas = require('./schemas'),
	jwt = require('jsonwebtoken');

describe('Auth0 API v2', function () {
	// Arrange
	var connectionId,
		ruleId,
		tokenInfo,
		testConnection = {
			name: 'automated-test-connection',
			strategy: 'auth0'
		},
		testUser = {
			email: 'hernanmj@live.com.ar',
			password: 'Time2work!',
			connection: testConnection.name
		},
		testRule = {
			name: 'automated-test-rule',
			script: 'function (user, context, callback) {   if (context.connection === \'' + testConnection.name + '\') {     user.tested = true;   }    callback(null, user, context); }',
			order: 1,
			enabled: true,
			stage: 'login_success'
		},
		auth = {
			client_id: process.env.CLIENT_ID,
			username: testUser.email,
			password: testUser.password,
			scope: 'openid profile',
			connection: testConnection.name
		};

	describe('#Connections API', function () {
		it('should find and remove any existing test connections', function (done) {
			// Act
			auth0Api.connections.getConnections(function (error, response, body) {
				// Expect
				expect(response).not.to.be.empty;
				expect(response.statusCode).to.be.equal(200); // OK
				expect(error).to.be.null;
				expect(body).not.to.be.empty;
				if (body && response.statusCode === 200) {
					var data = JSON.parse(body);
					var isValid = validator.validate(data, schemas.get_connections_response);
					if (!isValid) {
						console.error(validator.error);
					}

					// Search for the test connection
					for (var i = 0; i < data.length; i++) {
						if (data[i].name === testConnection.name) {
							connectionId = data[i].id;
							break;
						}
					}

					if (connectionId) {
						// Test connection found. Remove it.
						auth0Api.connections.deleteConnection(connectionId, function (error, response, body) {
							expect(response).not.to.be.empty;
							expect(response.statusCode).to.be.equal(204); // REMOVED
							expect(error).to.be.null;
							expect(body).to.be.empty;
							done(error);
						});
					} else {
						done();
					}
				} else {
					done(error);
				}
			});
		});

		it('correctly creates a new database connection', function (done) {
			// Act
			auth0Api.connections.createConnection(testConnection, function (error, response, body) {
				// Expect
				expect(response).not.to.be.empty;
				expect(response.statusCode).to.be.equal(201); // CREATED
				expect(error).to.be.null;
				expect(body).not.to.be.empty;
				if (body) {
					var data = JSON.parse(body);
					var isValid = validator.validate(data, schemas.post_connections_body);
					if (!isValid) {
						console.error(validator.error);
					}
				}

				done(error);
			});
		});
	});

	describe('#Users API', function () {
		var userCount = 0;
		it('gets the existing user count', function (done) {
			// Act
			auth0Api.users.getUsers(testConnection.name, function (error, response, body) {
				expect(response).not.to.be.empty;
				expect(response.statusCode).to.be.equal(200); // OK
				expect(error).to.be.null;
				expect(body).not.to.be.empty;
				if (body && response.statusCode === 200) {
					var data = JSON.parse(body);
					var isValid = validator.validate(data, schemas.get_users_response);
					if (!isValid) {
						console.error(validator.error);
					} else {
						userCount = data.length;
					}					
				}
				
				done(error);
			});
		});

		it('correctly creates a new user for the test connection', function (done) {
			// Act
			auth0Api.users.createUser(testUser, function (error, response, body) {
				if (error) {
					console.error(error);
				}
				
				// Expect
				expect(response).not.to.be.empty;
				expect(response.statusCode).to.be.equal(201); // CREATED
				expect(error).to.be.null;
				expect(body).not.to.be.empty;

				if (body) {
					var isValid = validator.validate(body, schemas.post_users_body, false, true);
					if (!isValid) {						
						console.error(validator.error);
					}
				}

				done(error);
			});
		});

		it('validates that the user count increased', function (done) {
			// Act
			auth0Api.users.getUsers(testConnection.name, function (error, response, body) {
				expect(response).not.to.be.empty;
				expect(response.statusCode).to.be.equal(200); // OK
				expect(error).to.be.null;
				expect(body).not.to.be.empty;
				if (body && response.statusCode === 200) {
					var data = JSON.parse(body);
					var isValid = validator.validate(data, schemas.get_users_response);
					if (!isValid) {
						console.error(validator.error);
					} else {
						expect(data.length).to.be.equal(userCount + 1);
					}					
				}
				
				done(error);
			});
		});
	});

	describe('#Rules API', function () {
		it('should find and remove any test rule', function (done) {
			// Act
			auth0Api.rules.getRules(function (error, response, body) {
				// Expect
				expect(response).not.to.be.empty;
				expect(response.statusCode).to.be.equal(200); // OK
				expect(error).to.be.null;
				expect(body).not.to.be.empty;
				if (body && response.statusCode === 200) {
					var data = JSON.parse(body);
					var isValid = validator.validate(data, schemas.get_rules_response);
					if (!isValid) {
						console.error(validator.error);
					}

					// Remove all rules
					for (var i = 0; i < data.length; i++) {
						ruleId = data[i].id;
						auth0Api.rules.deleteRule(ruleId, function (error, response, body) {
							expect(response).not.to.be.empty;
							expect(response.statusCode).to.be.equal(204); // REMOVED
							expect(error).to.be.null;
							expect(body).to.be.empty;
							done(error);
						});

					}
				} else {
					done(error);
				}
			});
		});

		it('correctly creates a new test rule', function (done) {
			// Act
			auth0Api.rules.createRule(testRule, function (error, response, body) {
				// Expect
				expect(response).not.to.be.empty;
				expect(response.statusCode).to.be.equal(201); // CREATED
				expect(error).to.be.null;
				expect(body).not.to.be.empty;
				if (body) {
					var data = JSON.parse(body);
					var isValid = validator.validate(data, schemas.post_rules_body);
					if (!isValid) {
						console.error(validator.error);
					}
				}

				done(error);
			});
		});
	});

	describe('#Auth /ro', function () {
		it('correctly authenticates user', function (done) {
			// Act
			auth0Api.oauth.authenticate(auth, function (error, response, body) {
				// Expect
				if (error) {
					console.error(error);
				}

				expect(response).not.to.be.empty;
				expect(response.statusCode).to.be.equal(200); // CREATED
				expect(error).to.be.null;
				expect(body).not.to.be.null;
				
				// Getting the id_token value for next test.
				var data = JSON.parse(body);
				tokenInfo = data.id_token;
				done(error);
			})
		});

		it('correctly verifies the JWT token and the custom attribute from Rule', function (done) {
			// Act
			auth0Api.oauth.tokenInfo(tokenInfo, function (error, response, body) {
				// Expect
				if (error) {
					console.error(error);
				}

				expect(response).not.to.be.empty;
				expect(response.statusCode).to.be.equal(200); // CREATED
				expect(error).to.be.null;
				expect(body).not.to.be.null;
				
				// Validate custom attribute
				var data = JSON.parse(body);
				expect(data.tested).to.be.equal(true);
				done(error);
			});
		});
	});
});

