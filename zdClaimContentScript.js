console.log("Zendesk content script loaded");

var emailInserted = false;


var observer = new MutationObserver(function(mutations, observer) {
    for (var mut = 0; mut < mutations.length; mut++) {
        if (emailInserted === false){

            try{
                // console.log("Tab change");
                var claimButton = document.createElement("span");
                claimButton.className = "ember-view btn";
                claimButton.classList.add("claimBtn");
                claimButton.innerText = "Claim";
                claimButton.addEventListener('click', claimTicket);
                var allBtnGroups = document.getElementsByClassName("ember-view btn-group");
                for (let item of allBtnGroups) {
                    if (!item.classList.contains("claimBtnAdded") && !item.classList.contains("apps_group")){
                        // console.log("append");
                        item.appendChild(claimButton);
                        item.classList.add("claimBtnAdded");
                    }
                }

            } catch(err){
                // console.log("error")
            }
        }

    }
});

// define what element should be observed by the observer
// and what types of mutations trigger the callback
observer.observe(document, {
    subtree: true,
    attributes: true,
    childList: true
});


function claimTicket(clickEvent) {
    var tktNo = /#\d+/.exec(clickEvent.target.previousElementSibling.innerText);
    if (tktNo !== null){
        chrome.runtime.sendMessage({ticket: tktNo});
    }

}
