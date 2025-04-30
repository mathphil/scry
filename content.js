let table = null

document.addEventListener("contextmenu", event => {
    table = event.target.closest("table")  

    // Update the context menu if Mozilla ever makes it possible
    // browser.runtime.sendMessage({
    //     type: "updateContextMenu",
    //     show: table !== null
    // });
});

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "getTable") {        
        // Exit if user doesn't target a table
        if (table === null) {
            alert("Scry: Must select a table");
            return
        }

        // Parse out cell data
        let data = []
        const rows = table.rows
        const columns = rows[0].cells.length

        // Exit if table is empty
        if (rows === 0 || columns === 0) {
            return
        }

        for (let i = 0; i < rows.length; i++) {
            // Skip incomplete rows
            const row = rows[i].cells
            if (row.length !== columns) {
                continue
            }

            for (let j = 0; j < row.length; j++) {
                data.push(row[j].outerText)
            }
        }

        // Wrap and send to the background
        const packet = {
            rows: rows.length,
            columns: columns,
            data: data
        }
        browser.runtime.sendMessage({
            type: "saveToCsv",
            packet: packet
        });
    }
});