function hideShowOptions() {
    chrome.storage.local.set({
        slackID: document.getElementById("slackID").value,
        slackURL: document.getElementById("slackURL").value
    });
}

function restore_options() {
    chrome.storage.local.get(function (items){
        console.log(items);
        document.getElementById("slackID").value = items.slackID;
        document.getElementById("slackURL").value = items.slackURL;
    })
}


document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById("slackID").addEventListener('change', hideShowOptions);
document.getElementById("slackURL").addEventListener('change', hideShowOptions);