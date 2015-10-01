var dotenv = require('dotenv').load(),
	chai = require('chai'),
	urlJoin = require('url-join'),
	request = require('request'),
	validator = require('tv4'),
	domain = 'https://' + process.env.DOMAIN,
	token = process.env.TOKEN,
	actions = require('./actions')(domain, token),
	expect = chai.expect,
	schemas = require('./schemas');

describe('Auth0 API v2', function () {
	var connectionId,
		testConnection = {
			name: 'automated-test-connection',
			strategy: 'auth0'
		},
		testUser = {
			email: 'hernanmj@live.com.ar',
			password: 'Time2work!',
			connection: testConnection.name
		};

	describe('#Connections API', function () {
		it('should find and remove any existing test connections', function (done) {
			actions.getConnections(function (error, response, body) {
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
						actions.deleteConnection(connectionId, function (error, response, body) {
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
			actions.createConnection(testConnection, function (error, response, body) {
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
		it('correctly creates a new user for the test connection', function (done) {
			actions.createUser(testUser, function (error, response, body) {
				if (error) {
					console.error(error);
				}				
				
				expect(response.statusCode).to.be.equal(201); // CREATED
				expect(error).to.be.null;
				expect(body).not.to.be.empty;

				if (body) {			
					var isValid = validator.validate(body, schemas.post_users_body, false, true);
					if (!isValid) {
						console.log('\n\tBody:\n\t' + JSON.stringify(body) + '\n');
						console.error(validator.error);
					}
				}

				done(error);
			});
		});
	});
});

