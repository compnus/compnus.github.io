import "jsr:@supabase/functions-js/edge-runtime.d.ts"

console.log("Hello from Functions!")

Deno.serve(async (req) => {
    const headers = new Headers()

    let name = 'world'; 
    try {
        const body = await req.json()
        name = body.name || name
    } catch (e) {
        console.log("Failed to parse JSON body", e)
    }

    const data = {
        message: `Hello, ${name}!`,
    }

    headers.set('Content-Type', 'application/json')
    headers.set('Access-Control-Allow-Origin', 'https://compnus.github.io')
    headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    headers.set('Access-Control-Allow-Headers', 'Content-Type')

    if (req.method === 'OPTIONS') {
        return new Response(null, {
            status: 204,
            headers,
        })
    }

    return new Response(JSON.stringify(data), {
        status: 200,
        headers,
    })
})
