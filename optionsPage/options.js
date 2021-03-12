var buttonList = [];


class InsertedButton {
    constructor() {
        this.buttonLabel = "";
        this.slackURL = "";
        this.ID = generateID();

    }
}

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
        if (items.buttonList !== undefined){
            buttonList = items.buttonList;
        }
        drawPageFromList(buttonList);
    })
}

function generateID(){
    let idAttempt = Math.floor(Math.random() * 1024) + 1;
    if (buttonList.find(button => button.ID === idAttempt) === undefined){
        return idAttempt;
    } else {
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
    return buttonList.findIndex(button => button.ID === ID);
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
        remBut.innerText = "Remove button";
        remBut.addEventListener('click', removeButton)
        let newRow = newTbody.insertRow(-1)
        newRow.className = "buttonRow";
        newRow.buttonID = button.ID;
        let buttLabCell = newRow.insertCell(0)
        let slackURLCell = newRow.insertCell(1)
        let remButtCell = newRow.insertCell(2)
        let idCell = newRow.insertCell(3)
        idCell.innerText = button.ID;
        buttLabCell.appendChild(curLab);
        slackURLCell.appendChild(curURL);
        remButtCell.appendChild(remBut);
    }
}


document.addEventListener('DOMContentLoaded', restore_options);
// document.getElementById("slackID").addEventListener('change', hideShowOptions);
// document.getElementById("slackURL").addEventListener('change', hideShowOptions);
document.getElementById("newButtButt").addEventListener('click', addNewButton);