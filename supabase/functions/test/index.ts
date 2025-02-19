// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

console.log("Hello from Functions!")

Deno.serve(async (req) => {
    const headers = new Headers()
    const { name } = await req.json()
    const data = {
        message: `Hello ${name}!`,
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

    return new Response(JSON.stringify(
        { message: 'Hello, world!' }
    ), {
        status: 200,
        headers,
    })
})