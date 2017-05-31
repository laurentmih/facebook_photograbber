// Because ain't nobody got time for X-Frame-Options lmao
chrome.webRequest.onHeadersReceived.addListener(
	function (details) {
		return {
			responseHeaders: details.responseHeaders.filter(function(header) {
				return (header.name.toLowerCase() !== 'x-frame-options');
			})
		};
	},

	{
		urls: ["<all_urls>"]
	},

	["blocking", "responseHeaders"]
);

// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab) {
	// No tabs or host permissions needed!
	chrome.tabs.executeScript(null, { file: "main.js" });
});