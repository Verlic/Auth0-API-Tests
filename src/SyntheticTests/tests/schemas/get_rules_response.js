module.exports = {
	"title": "get_rules_response",
	"type": "array",
	"items": {
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
	}
};
