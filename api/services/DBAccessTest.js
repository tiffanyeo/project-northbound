// DATA
const DB = {
    coaches: [],
    disciplines: [],
    locations: [],
    participants: [],
    seasons: [],
    skills: [],
    trainers: []
};

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

