var buttonList = [];


class InsertedButton {
    constructor() {
        this.buttonLabel = "";
        this.slackURL = "";
        this.ID = generateID();

    }
}

function restore_options() {
    chrome.storage.local.get(function (items){
        console.log(items);
        document.getElementById("slackID").value = items.slackID;
        if (items.buttonList !== undefined){
            buttonList = items.buttonList;
        } else {
            if (items.slackURL === undefined) {
                buttonList = [];
            } else {
                saveButtonList([{ID: 163, buttonLabel: "Claim", slackURL: items.slackURL}]);
                restore_options();
            }
        }
        drawPageFromList(buttonList);
    })
}

function deleteButtonsFromStorage() {
    chrome.storage.local.remove('buttonList');
    restore_options();
}

function generateID(){
    let idAttempt = Math.floor(Math.random() * 1024) + 1;
    if (buttonList.find(button => button.ID === idAttempt) === undefined){
        console.log("id generated", idAttempt);
        return idAttempt;
    } else {
        console.log(idAttempt, "already in use, retrying");
        generateID();
    }

}

function saveButtonList(buttonListIn){
    chrome.storage.local.set({buttonList: buttonListIn});
    console.log(buttonListIn)
}


function addNewButton() {
    let newButt = new InsertedButton;
    buttonList.push(newButt);
    console.log(buttonList);
    drawPageFromList(buttonList);
    saveButtonList(buttonList);
}

function removeButton(mouseEvent) {
        let buttonToRemove = mouseEvent.target.parentElement.parentElement.buttonID;
        console.log(buttonToRemove);
        let buttRemIndex = getButtonIndexFromId(buttonToRemove);
        console.log(buttRemIndex);
        buttonList.splice(buttRemIndex,1);
        drawPageFromList(buttonList);
        saveButtonList(buttonList);
}

function getButtonIndexFromId(ID){
    return buttonList.findIndex(button => button.ID === ID)
}

function updateButtonList(changeEvent){
    console.log(changeEvent);
    let updatedButton = changeEvent.target.parentElement.parentElement.buttonID;
    let buttonToUpdate = getButtonIndexFromId(updatedButton);
    console.log("row ID is", updatedButton);
    console.log("updating but at index", buttonToUpdate);
    buttonList[buttonToUpdate].buttonLabel = changeEvent.target.parentElement.parentElement.children[0].children[0].value;
    buttonList[buttonToUpdate].slackURL = changeEvent.target.parentElement.parentElement.children[1].children[0].value;
    saveButtonList(buttonList);
}

function drawPageFromList(buttonList){
    let newTbody = document.createElement('tbody');
    let oldTbody = document.getElementById("buttTabBod");
    oldTbody.parentNode.replaceChild(newTbody, oldTbody);
    newTbody.id = "buttTabBod";
    for (let button of buttonList){
        let curLab = document.createElement("input");
        curLab.value = button.buttonLabel;
        let curURL = document.createElement("input");
        curURL.value = button.slackURL;
        curLab.addEventListener('change', updateButtonList);
        curURL.addEventListener('change', updateButtonList);
        let remBut = document.createElement("button");
        remBut.innerText = "Remove";
        remBut.addEventListener('click', removeButton);
        let newRow = newTbody.insertRow(-1);
        newRow.className = "buttonRow";
        newRow.buttonID = button.ID;
        let buttLabCell = newRow.insertCell(0);
        let slackURLCell = newRow.insertCell(1);
        let remButtCell = newRow.insertCell(2);
        // let idCell = newRow.insertCell(3);
        // idCell.innerText = button.ID;
        buttLabCell.appendChild(curLab);
        slackURLCell.appendChild(curURL);
        remButtCell.appendChild(remBut);
    }
}

function exportButtonList(){
    let buttonBlob = new Blob([JSON.stringify(buttonList)]);
    saveBlob(buttonBlob, "buttons.buttonlist");

}

function importButtonList(){
    let importedFile = document.getElementById("uploadSelector").files[0];
    console.log(importedFile);
    importedFile.text().then(text => {
        console.log(text);
        try{
            buttonList = JSON.parse(text);
            document.getElementById("importError").hidden = true;
            document.getElementById("importSuccess").hidden = false;
            drawPageFromList(buttonList);
        } catch {
            document.getElementById("importError").hidden = false;
            document.getElementById("importSuccess").hidden = true;
        }


    });
}

function saveBlob(blob, fileName) {
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";

    var url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById("newButtButt").addEventListener('click', addNewButton);
document.getElementById("delButts").addEventListener('click', deleteButtonsFromStorage);
document.getElementById("exportButtons").addEventListener('click', exportButtonList);
document.getElementById("uploadSelector").addEventListener('change', importButtonList);