console.log("Zendesk ticket claim content script loaded");

var buttonList = [];

var observer = new MutationObserver(function (mutations, observer) {
    for (var mut = 0; mut < mutations.length; mut++) {
        try {
            // console.log("Tab change");
            var allBtnGroups = document.getElementsByClassName("ember-view btn-group");
            for (let item of allBtnGroups) {
                if (!item.classList.contains("claimBtnAdded") && !item.classList.contains("apps_group")) {
                    // console.log("append");
                    item.classList.add("claimBtnAdded");
                    chrome.storage.local.get(function (items){
                        if (items.buttonList !== undefined){
                            buttonList = items.buttonList;
                        } else {
                            if (items.slackURL === undefined) {
                                buttonList = [];
                            } else {
                                buttonList = [{ID: 163, buttonLabel: "Claim", slackURL: items.slackURL}];
                            }
                        }
                        for (let buttonToInsert of buttonList){

                            let claimButton = document.createElement("span");
                            claimButton.className = "ember-view btn";
                            claimButton.classList.add("claimBtn");
                            claimButton.setAttribute("buttonURL", buttonToInsert.slackURL);
                            claimButton.innerText = buttonToInsert.buttonLabel;
                            claimButton.addEventListener('click', claimTicket);
                            item.appendChild(claimButton);

                        }

                        let copyButton = document.createElement("span");
                        copyButton.className = "ember-view btn";
                        copyButton.classList.add("copyBtn");
                        copyButton.innerText = "Copy Ticket No.";
                        copyButton.addEventListener('click', copyTicket);
                        item.appendChild(copyButton);
                    });


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
    console.log("button clicked", clickEvent.target);
    let tktNo = /#\d+/.exec(clickEvent.target.parentElement.children[2].innerText);
    let btnURL = clickEvent.target.getAttribute("buttonURL");
    let btnTxt = clickEvent.target.innerText;
    console.log("ticket", tktNo, "\nURL", btnURL, "\ntext", btnTxt);
    if (tktNo !== null) {
        chrome.runtime.sendMessage({ticket: tktNo, url:btnURL, texty:btnTxt});
    }
}

function copyTicket(clickEvent) {
    let tktNo = /#\d+/.exec(clickEvent.target.parentElement.children[2].innerText);
    copyToClipboard(tktNo);

}

function copyToClipboard(text) {
    const input = document.createElement('textarea');
    input.style.position = 'fixed';
    input.style.opacity = 0;
    input.value = text;
    document.body.appendChild(input);
    input.select();
    document.execCommand('Copy');
    document.body.removeChild(input);
}