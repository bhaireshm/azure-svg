const fs = require('fs');
const mainFolder = 'D:/CloudScaffolding/Docs/Azure_Public_Service_Icons_V3/Azure_Public_Service_Icons/Icons';

/**
 *  this.addImagePalette('Azure', 'Azure SVG', dir + '/azure/AI+Machine Learning/', '.svg',
		['10165-icon-service-Bot-Services', '10162-icon-service-Cognitive-Services'], null, {
			'Wireless_Router_N': 'wireless router switch wap wifi access point wlan',
			'Router_Icon': 'router switch'
		}); 
*/

const fsmainFolder = fs.readdirSync(mainFolder);
let template = '';
let seedData = [];
let id = 10552;

fsmainFolder.forEach(fldr => {
    const files = fs.readdirSync(`${mainFolder}/${fldr}`);
    let fileNames = [];
    let fileNamesInObj = {};

    let fileNamesWithoutSpecialChars = [];

    files.forEach(file => {

        // console.log(createdDate(`${mainFolder}/${fldr}/${file}`));

        fileNames.push(`'${file}'`);
        let name = titleize(file.toString().toLowerCase()
            .replace('.svg', '').replace(/-/g, ' ').substring("00524-icon-service-avs".indexOf('service') + 'service'.length + 1));

        seedData.push({
            infraType: fldr,
            version: '0.0.1',
            id: `CP-${++id}`,
            name: name.split(' ').join('_'),
            description: `${fldr}-${name}-Asset`
        });

        fileNamesWithoutSpecialChars.push(`'${name}'`);
        fileNamesInObj[file.replace('.svg', '')] = name;
    });
    let fileNamesWithoutSVG = fileNames.map(f => f.replace('.svg', ''));

    console.log(fileNames);
    console.log(fileNamesWithoutSVG);
    console.log(fileNamesWithoutSpecialChars);
    template += `this.addImagePalette('Azure', azure + '${fldr}', dir + '/azure/${fldr}/', '.svg',
                [${fileNamesWithoutSVG}], [${fileNamesWithoutSpecialChars}], 
                ${JSON.stringify(fileNamesInObj)});` + '\n\n';


    console.log(`Pallete: ${fldr}`);

    for (let k in fileNamesInObj) {
        console.log(`${k} : ${fileNamesInObj[k]}`);
    }
    console.log('---------------------------------------------------------------------------------');
});


function createdDate(file) {
    // console.log(file)
    const {
        birthtime
    } = fs.statSync(file)

    return birthtime
}

function titleize(str) {
    let upper = true
    let newStr = ""
    for (let i = 0, l = str.length; i < l; i++) {
        // Note that you can also check for all kinds of spaces  with
        // str[i].match(/\s/)
        if (str[i] == " ") {
            upper = true
            newStr += str[i]
            continue
        }
        newStr += upper ? str[i].toUpperCase() : str[i].toLowerCase()
        upper = false
    }
    return newStr;
}

console.log(seedData);

let rows = "";
seedData.forEach(sd => {
    rows += `<ctrGbrComponents description="${sd.description}" id="${sd.id}" infraType="${sd.infraType}" name="${sd.name}" version="${sd.version}"/> \n`;
});

let xml = `
<?xml version="1.0" encoding="UTF-8"?>
    <entity-engine-xml>
    ${rows}
    </entity-engine-xml>`;

console.log(xml);

fs.writeFileSync('new-azure-svg.txt', template);
fs.writeFileSync('azureSeedData.xml', rows);