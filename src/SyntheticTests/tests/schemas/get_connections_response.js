module.exports = {
	"title": "get_connections_response",
	"type": "array",
	"items": {
		"type": "object",
		"properties": {
			"name": {
				"type": "string"
			},
			"options":{
				"type": "object"
			},
			"id": {
				"type": "string"
			},
			"strategy": {
				"enum": ["ad", "adfs", "amazon", "aol", "auth0-adldap", "auth0", "baidu", "bitly", "box", "custom", "dwolla", "email", "evernote-sandbox", "evernote", "exact", "facebook", "fitbit", "flickr", "github", "google-apps", "google-oauth2", "google-openid", "instagram", "ip", "linkedin", "miicard", "mock", "oauth1", "oauth2", "office365", "paypal", "pingfederate", "planningcenter", "renren", "salesforce-community", "salesforce-sandbox", "salesforce", "samlp", "sharepoint", "shopify", "sms", "soundcloud", "thecity-sandbox", "thecity", "thirtysevensignals", "twitter", "vkontakte", "waad", "weibo", "windowslive", "wordpress", "yahoo", "yammer", "yandex"]
			},
			"enabled_clients": {
				"type": "array",				
				"items": { type: "string" },
				"uniqueItems": true
			}
		}
	}	
};
