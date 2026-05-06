import { serveDir, serveFile } from "jsr:@std/http/file-server";


async function handler(request) {

    const headersCORS = new Headers()
    headersCORS.set("Access-Control-Allow-Origin", "*");
    headersCORS.set("Access-Control-Allow-Headers", "*");
    headersCORS.set("Access-Control-Allow-Methods", "*");
    if (request.method === "OPTIONS") {
        return new Response(null, { status: 204, headers: headersCORS })
    }

    const serveDirResponse = await serveDir(request, {
        fsRoot: ".",
        urlRoot: "",
        showDirListing: true
    })


    if (request.url == "http://localhost:8000/getjsoncountrys") {
        console.log("HSHSH")
        let jsonFileContent = await Deno.readTextFile("./selectedCountrys.json");
        let parsedContent = JSON.parse(jsonFileContent);

        return new Response(JSON.stringify({ parsedContent }), { status: 200, header: headersCORS });
    }

    // Om vi vill navigera med sökvägen, så att deno inte ger oss 404
    if (request.status == 404) {
        return serveDir(new Request(new URL("/index.html", request.url)), {
            fsRoot: ".",
            urlRoot: ""
        });

    }

    return serveDirResponse;

}




Deno.serve(handler)