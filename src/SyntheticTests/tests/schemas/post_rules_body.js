module.exports = {
	"title": "post_rules_body",
	"type": "object",
	"properties": {
		"name": { "type": "string" },
		"enabled": { "type": "boolean" },
		"id": { "type": "string" },
		"script": { "type": "string" },
		"order": { "type": "integer" },
		"stage": {
			"enum": ["login_success", "login_failure", "pre_authorize"]
		}
	}
};
