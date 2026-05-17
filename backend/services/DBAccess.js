
// DATA
export const DB = {
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
        const raw = await Deno.readTextFile(createFilename(entity));
        const data = JSON.parse(raw);
        // Save the enteties inner array
        DB[entity] = data[entity];
    }
}


await readDB();
