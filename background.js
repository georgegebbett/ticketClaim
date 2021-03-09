var slackUserId = "";
var slackURL = "";
var firstTime = true;

function setOptionsFromStorage() {
    chrome.storage.local.get(function (items){
        slackUserId = items.slackID;
        slackURL = items.slackURL;
    })
}


function claimTicket(ticketNo) {
    setOptionsFromStorage();
    console.log("claming ticket");
    const req = new XMLHttpRequest();
    const baseUrl = slackURL;
    const urlParams = "{\"ticket_number\": \"" + ticketNo + "\", \"slack_user\": \""+ slackUserId + "\"}";

    req.open("POST", baseUrl, true);
    req.setRequestHeader("Content-type", "application/json");
    req.send(urlParams);
    if (firstTime){
        req.send(urlParams);
        firstTime = false;
    }
    console.log("webhook fired");
}


chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        // console.log("Message received");
        claimTicket(request.ticket);
    }
);

