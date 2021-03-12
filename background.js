function getOptionsAndClaimTicket(ticketNo, hookURL) {
    chrome.storage.local.get(function (items){
        console.log("looking up user ID");
        console.log("user ID:", items.slackID);
        claimTicket(ticketNo, items.slackID, hookURL);
    })
}


function claimTicket(ticketNo, slackUserID, slackURL) {
    console.log("posting to slack");
    const req = new XMLHttpRequest();
    const baseUrl = slackURL;
    const urlParams = "{\"ticket_number\": \"" + ticketNo + "\", \"slack_user\": \""+ slackUserID + "\"}";
    req.open("POST", baseUrl, true);
    req.setRequestHeader("Content-type", "application/json");
    req.send(urlParams);
    console.log("webhook fired", req);
}


chrome.runtime.onMessage.addListener(
    function(request) {
        console.log("Message received");
        getOptionsAndClaimTicket(request.ticket, request.url);
    }
);

