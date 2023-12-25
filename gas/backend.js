
function onOpen(e) {
    SpreadsheetApp.getUi()
        .createAddonMenu()
        .addItem('Open', 'open')
        .addToUi();
}

function open() {
    let html = HtmlService.createHtmlOutputFromFile('vue/index')
        .setTitle('CSV Exporter');
    SpreadsheetApp.getUi().showSidebar(html);
}

var objContext = {
    configs: configs()
}

function getContext() {
    console.log('New context fetched');
    let objSessionContext = objContext
    objSessionContext.documentProperties = PropertiesService.getDocumentProperties().getProperties();
    objSessionContext.activeUserEmail = Session.getActiveUser().getEmail();
    return { success: true, type: 'context', data: objSessionContext }
}

function startExport(selectedConfig) {

    let ui = SpreadsheetApp.getUi();
    let sheet = SpreadsheetApp.getActiveSheet();
    let sheetname = sheet.getSheetName();
    let date = new Date();
    let year = date.getFullYear().toString().slice(-2);
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let formattedDate = `${year}${month}${day}`;
    let fileName = `${formattedDate}-${sheetname.toLowerCase()}.csv`;

    let result = ui.alert(
        'Please confirm',
        `Are you sure you want to export ${sheet.getName()}?`,
        ui.ButtonSet.YES_NO);
    if (result == ui.Button.YES) {

        let csv = _buildCSV(sheet, objContext.configs[selectedConfig])
        DriveApp.createFile(fileName, csv, MimeType.PLAIN_TEXT);  
        ui.alert(
            'Finished',
            `Export has been finished.`,
            ui.ButtonSet.OK);
    }

    return { success: true, type: 'export', data: objContext }
}

function _buildCSV(sheet, obj) {
    let csv = "";
    let rowdata = [];
    let rangeData = sheet.getDataRange();
    let lastColumn = rangeData.getLastColumn();
    let lastRow = rangeData.getLastRow();
    let rangeValues = rangeData.getValues();

    for (i = 0; i < lastRow; i++) {
        for (j = 0; j < lastColumn; j++) {

            let value = rangeValues[i][j];

            // Field replacer
            if (obj.fieldReplacer){
                if (typeof value != 'string') {
                    value = String(value)
                }
                obj.fieldReplacer.forEach(r => {
                    value = value.replaceAll(r.search, r.replace)
                })
            }

            // Enclosing
            if (obj.enclosing){
                value = `${obj.enclosing}${value}${obj.enclosing}`
            }
            
            rowdata.push([value]);

        };
        csv += rowdata.join(obj.fieldDelimiter || ',') + obj.recordDelimiter || "\n";
        rowdata = [];
    };
    return csv;
};