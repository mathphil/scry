browser.contextMenus.create(
    {
        id: "csvDownload",
        title: "Save as .csv",
        contexts: ["all"]
        // visible/enable: false;
    }
);

function jsonToCsv(packet) {
    const { rows, columns, data } = packet;
    let csvString = ""

    for (let i = 0; i < data.length; i++) {
        // Add new line
        if (i !== 0 && i % columns === 0) {
            csvString += '\n'
        }

        // Strip out existing commas and append
        csvString += data[i].replace(/,/g,'') + ','
    }

    // Trigger download
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    browser.downloads.download({
        url,
        filename: 'table.csv',
        saveAs: true
    }).then(() => {
        console.log("Download triggered.");
    }).catch((err) => {
        console.error("Download failed:", err)
    })
}

// Process messages from the content script
browser.runtime.onMessage.addListener((message, sender) => {
    console.log("Got message type", message.type)
    switch(message.type) {
        // Dynamically enable button if Mozilla ever allows it
        // case "updateContextMenu":
        //     browser.contextMenus.update("csv-download", {
        //         enabled: message.show
        //     });
        // break;
        case "saveToCsv":
            jsonToCsv(message.packet)
        break;
    }
});

// Respond to the menu item
browser.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "csvDownload") {
        browser.tabs.sendMessage(tab.id, { action: "getTable", info });
    }
})

