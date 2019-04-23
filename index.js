const co = require('co');
const dookie = require( "dookie" );
const fs = require( "fs" );
const config = require( "./config" );
const FILE_PATH = "./export.json";

let exportData = co.wrap(function*() {

    //const mongodbUri = 'mongodb://localhost:27017/test';
    // Insert data into dookie
    // Or, at the command line:
    // `dookie pull --db test --file ./output.json`
    const json = yield dookie.pull(config.SOURCE_DB_URL);
    console.log('exported Data ', json);
    fs.writeFileSync( FILE_PATH, JSON.stringify(json));
});

let importData = co.wrap(function* () {

    // Insert data into dookie
    // Or, at the command line:
    // `dookie push --db test --file ./example/basic/file.yml`
    const data = JSON.parse(fs.readFileSync(FILE_PATH, 'utf8'));
    console.log('Data from File: ', data);
    yield dookie.push(config.TARGET_DB_URL, data);
});

function run() {
    exportData().then(()=>{
        console.log( "Export finished..." );
        return importData();
    }).then(()=>{
        console.log( "Import finished..." );
    }).catch(err=>{
        console.log( "Error Occured: ", err );
    });
}

/**
 * Execute the Import/Export Process
 */
run();
