console.log("Zendesk ticket claim content script loaded");

buttonList = [];

var observer = new MutationObserver(function (mutations, observer) {
    for (var mut = 0; mut < mutations.length; mut++) {
        try {
            // console.log("Tab change");
            var allBtnGroups = document.getElementsByClassName("ember-view btn-group");
            for (let item of allBtnGroups) {
                if (!item.classList.contains("claimBtnAdded") && !item.classList.contains("apps_group")) {
                    // console.log("append");
                    chrome.storage.local.get({buttonList:[]}, function (items){
                        if (items.buttonList !== undefined){
                            buttonList = items.buttonList;
                        }
                    })

                    for (let buttonToInsert of buttonList){

                        let claimButton = document.createElement("span");
                        claimButton.className = "ember-view btn";
                        claimButton.classList.add("claimBtn");
                        claimButton.buttonURL = buttonToInsert.slackURL;
                        claimButton.innerText = buttonToInsert.buttonLabel;
                        claimButton.addEventListener('click', claimTicket);
                        item.appendChild(claimButton);
                    }

                    item.classList.add("claimBtnAdded");
                }
            }
        } catch (err) {
            // console.log("error")
        }
    }
});


observer.observe(document, {
    subtree: true,
    attributes: true,
    childList: true
});


function claimTicket(clickEvent) {
    let tktNo = /#\d+/.exec(clickEvent.target.previousElementSibling.innerText);
    let btnURL = clickEvent.target.buttonURL;
    if (tktNo !== null) {
        chrome.runtime.sendMessage({ticket: tktNo, url:btnURL});
    }
}
