

const DB = {
    coaches: [],
    disciplines: [],
    locations: [],
    participants: [],
    seasons: [],
    skills: [],
    trainers: []
};

function createFilename(entity) {
    return `./backend/repository/${entity}.json`;
}

async function readDB() {
    for (const entity in DB) {
        const raw = await Deno.readTextFile(
            createFilename(entity)
        );
        const data = JSON.parse(raw);
        // save entity inner array
        DB[entity] = data[entity];
    }
}

async function clientDBFile() {
    const outputDB = `export const DB = ${JSON.stringify(DB, null, 4)};`;
    await Deno.writeTextFile(
        "./client/services/DBAccess.js",
        outputDB
    );
}

await readDB();
await clientDBFile();