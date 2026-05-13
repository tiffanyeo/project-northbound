
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


// function createFilename(entity) {
//     return `./api/repository/${entity}.json`;
// }

async function readDB() {

    for (const entity in DB) {
        const raw = await fetch(`http://localhost:8000/getdatasetquery?entity=${entity}`);
        const data = await raw.json();
        // Save the enteties inner array
        DB[entity] = data[entity];
    }
}

await readDB();

export default DB;

