if (!window.Promise) {
	console.log("Please use a better browser http://caniuse.com/#feat=promises ");
}

function initAws() {
	
	assumeRole().then(function(data) {
		return scanDdb(data);
	}).then(function(data) {
		var items = '';
		for ( i = 0; i < data.Count; i++) {
			items += data.Items[i].Id.N + ' ';
		}
		console.log(JSON.stringify(items));
	});
	
}

function assumeRole() {
	var promise = new Promise(function(resolve, reject) {

		new AWS.STS({
			region : "eu-west-1",
			apiVersion : '2011-06-15'
		}).assumeRoleWithWebIdentity({
			RoleArn : 'AccessRoleName',
			RoleSessionName : "AppTestSession",
			WebIdentityToken : FB.getAccessToken(),
			ProviderId : "graph.facebook.com",
		}, function(error, data) {
			if (error) {
				reject(error);
			} else {
				resolve(data);
			}
		});

	});
	return promise;
}

function scanDdb(data) {
	var promise = new Promise(function(resolve, reject) {

		new AWS.DynamoDB({
			region : "eu-west-1",
			apiVersion : '2012-08-10',
			accessKeyId : data.Credentials.AccessKeyId,
			sessionToken : data.Credentials.SessionToken,
			secretAccessKey : data.Credentials.SecretAccessKey
		}).scan({
			TableName : "ProductCatalog"
		}, function(error, data) {
			if (error) {
				reject(error);
			} else {
				resolve(data);
			}
		});

	});
	return promise;
}
