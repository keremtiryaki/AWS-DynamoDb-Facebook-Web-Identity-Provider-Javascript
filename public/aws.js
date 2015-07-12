if (!window.Promise) {
	alert("Please use a better browser http://caniuse.com/#feat=promises ");
}

function initAws() {

	assumeRole().then(function(credentialsData) {
		
		return scanDdb(credentialsData);
		
	}).then(function(data) {

		var items = '';
		for ( i = 0; i < data.Count; i++) {
			items += data.Items[i].Id.N + ',';
		}
		console.log(JSON.stringify(items));
		var body = document.getElementsByTagName("body")[0];
		var innerHtml = body.innerHTML;
		body.innerHTML = innerHtml + "<br>Ids from db:" + items;
		
	});

}

function assumeRole() {
	var promise = new Promise(function(resolve, reject) {

		new AWS.STS({
			region : "eu-west-1",
			apiVersion : '2011-06-15'
		}).assumeRoleWithWebIdentity({
			RoleArn : AMAZON_RESOURCE_NAME,
			RoleSessionName : "AppTestSession",
			WebIdentityToken : FB.getAccessToken(),
			ProviderId : "graph.facebook.com",
		}, function(error, credentialsData) {
			
			if (error) {
				reject(error);
			} else {
				resolve(credentialsData);
			}
			
		});

	});
	return promise;
}

function scanDdb(credentialsData) {
	var promise = new Promise(function(resolve, reject) {

		new AWS.DynamoDB({
			region : "eu-west-1",
			apiVersion : '2012-08-10',
			accessKeyId : credentialsData.Credentials.AccessKeyId,
			sessionToken : credentialsData.Credentials.SessionToken,
			secretAccessKey : credentialsData.Credentials.SecretAccessKey
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
