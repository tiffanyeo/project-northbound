import { serveDir } from "jsr:@std/http/file-server";


async function handler(request) {

    const url = new URL(request.url);

    const headersCORS = new Headers()
    headersCORS.set("Access-Control-Allow-Origin", "*");
    headersCORS.set("Access-Control-Allow-Headers", "*");
    headersCORS.set("Access-Control-Allow-Methods", "*");
    if (request.method === "OPTIONS") {
        return new Response(null, { status: 204, headers: headersCORS })
    }


    if (url.pathname == "/getjsoncountrys") {
        console.log("HSHSH")
        let jsonFileContent = await Deno.readTextFile("./client/selectedCountrys.json");
        let parsedContent = JSON.parse(jsonFileContent);

        return new Response(JSON.stringify({ parsedContent }), { status: 200, header: headersCORS });
    }

    if (url.pathname == "/getdatasetquery") {
        let entity = url.searchParams.get("entity");

        let jsonFileContent = await Deno.readTextFile(`./api/repository/${entity}.json`);

        let parsedContent = JSON.parse(jsonFileContent);
        return new Response(JSON.stringify(parsedContent), { status: 200, header: headersCORS });
    }

    const serveDirResponse = await serveDir(request, {
        fsRoot: ".",
        urlRoot: "",
        showDirListing: true
    })

    // Om vi vill navigera med sökvägen, så att deno inte ger oss 404
    if (request.status == 404) {
        return serveDir(new Request(new URL("client/index.html", request.url)), {
            fsRoot: ".",
            urlRoot: ""
        });

    }

    return serveDirResponse;

}




Deno.serve(handler)