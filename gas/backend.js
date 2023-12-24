
function onOpen(e) {
    SpreadsheetApp.getUi()
        .createAddonMenu()
        .addItem('Open', 'open')
        .addToUi();
}

function open() {
    var html = HtmlService.createHtmlOutputFromFile('vue/index')
        .setTitle('CSV Exporter');
    SpreadsheetApp.getUi().showSidebar(html);
}

var objContext = {
    configs: configs()
}

function getContext() {
    Logger.log('New context fetched');
    objContext.documentProperties = PropertiesService.getDocumentProperties().getProperties();
    objContext.activeUserEmail = Session.getActiveUser().getEmail();
    return { success: true, type: 'context', data: objContext }
}

function startExport(obj) {
    _updateContext(obj);

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
        let csv = _buildCSV(sheet, obj)
        DriveApp.createFile(fileName, csv,  MimeType.PLAIN_TEXT);

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
            if (obj.currentConfig?.fieldReplacer){
                obj.currentConfig.fieldReplacer.forEach(r => {
                    value = String(value).replaceAll(r.search, r.replace)
                })
            }

            // Enclosing
            if (obj.currentConfig?.enclosing){
                value = `${obj.currentConfig?.enclosing}${value}${obj.currentConfig?.enclosing}`
            }
            
            rowdata.push([value]);

        };
        csv += rowdata.join(obj.currentConfig?.fieldDelimiter || ',') + obj.currentConfig?.recordDelimiter || "\n";
        rowdata = [];
    };
    return csv;
};

function _updateContext(updatedContext) {
    objContext.currentConfig = updatedContext.currentConfig
}