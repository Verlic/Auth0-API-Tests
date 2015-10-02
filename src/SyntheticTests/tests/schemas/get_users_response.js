module.exports = {
	"title": "get_users_response",
	"type": "array",
	"items": {
		"type": "object",
		"properties": {
			"email": { "type": "string" },
			"email_verified": { "type": "boolean" },
			"name": { "type": "string" },
			"phone_number": { "type": "string" },
			"phone_verified": { "type": "boolean" },
			"user_id": { "type": "string" },
			"created_at": { "type": "string" },
			"updated_at": { "type": "string" },
			"picture": { "type": "string" },
			"nickname": { "type": ["string", "null"] },
			"last_ip": { "type": "string" },
			"last_login": { "type": "string" },
			"logins_count": { "type": "integer" },
			"identities": {
				"type": "array",
				"items": {
					"type": "object",
					"properties": {
						"connection": { "type": "string" },
						"user_id": { "type": "string" },
						"provider": {
							"enum": ["ad", "adfs", "amazon", "aol", "auth0-adldap", "auth0", "baidu", "bitly", "box", "custom", "dwolla", "email", "evernote-sandbox", "evernote", "exact", "facebook", "fitbit", "flickr", "github", "google-apps", "google-oauth2", "google-openid", "instagram", "ip", "linkedin", "miicard", "mock", "oauth1", "oauth2", "office365", "paypal", "pingfederate", "planningcenter", "renren", "salesforce-community", "salesforce-sandbox", "salesforce", "samlp", "sharepoint", "shopify", "sms", "soundcloud", "thecity-sandbox", "thecity", "thirtysevensignals", "twitter", "vkontakte", "waad", "weibo", "windowslive", "wordpress", "yahoo", "yammer", "yandex"]
						},
						"isSocial": { "type": "boolean" }
					}
				}
			}
		}
	}
};
