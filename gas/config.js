function configs() {

    let objConfigs = {

        csv_rfc4180: {
            name: 'Default CSV',
            description: 'Based on RFC 4180',
            fieldDelimiter: ',',
            recordDelimiter: '\n',
            enclosing: '"',
            fieldReplacer: [
                {
                    search: /(^|[^"])(")([^"]|$)/g,
                    replace: '$1""$3'
                }
            ]
        },

        shopware_import: {
            name: 'Shopware import',
            description: 'Shopware import',
            fieldDelimiter: ';',
            recordDelimiter: '\n',
            enclosing: '"',
            fieldReplacer: [
                {
                    search: /(^|[^"])(")([^"]|$)/g,
                    replace: '$1""$3'
                },
                {
                    search: '\n',
                    replace: '\\n'
                }
            ]
        },

        digitec_galaxus: {
            name: 'Digitec Galaxus',
            description: 'Product feed of Digitec Galaxus',
            fieldDelimiter: ';',
            recordDelimiter: ';\n',
            enclosing: '"',
                fieldReplacer: [
                    {
                        search: /(^|[^"])(")([^"]|$)/g,
                        replace: '$1""$3'
                    }
                ]
        }


    };

    return objConfigs;
}