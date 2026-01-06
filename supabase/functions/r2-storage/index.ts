
import { AwsClient } from "https://esm.sh/aws4fetch@1.0.17"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
}

console.log("R2 Storage Function (aws4fetch) initializing...")

Deno.serve(async (req) => {
    // Handle CORS
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { action, key, contentType } = await req.json()

        const R2_ACCOUNT_ID = Deno.env.get('R2_ACCOUNT_ID')
        const R2_ACCESS_KEY_ID = Deno.env.get('R2_ACCESS_KEY_ID')
        const R2_SECRET_ACCESS_KEY = Deno.env.get('R2_SECRET_ACCESS_KEY')
        const R2_BUCKET_NAME = Deno.env.get('R2_BUCKET_NAME')

        if (!R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_ACCOUNT_ID || !R2_BUCKET_NAME) {
            throw new Error('Missing R2 Credentials')
        }

        const aws = new AwsClient({
            accessKeyId: R2_ACCESS_KEY_ID,
            secretAccessKey: R2_SECRET_ACCESS_KEY,
            service: 's3',
            region: 'auto',
        })

        if (action === 'upload-sign') {
            // Using Path-Style access: https://<accountid>.r2.cloudflarestorage.com/<bucket>/<key>
            const url = new URL(`https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${R2_BUCKET_NAME}/${key}`)

            // Generate Presigned URL
            const signed = await aws.sign(new Request(url, {
                method: 'PUT',
                headers: { 'Content-Type': contentType }
            }), {
                aws: { signQuery: true }
            })

            return new Response(JSON.stringify({ url: signed.url }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
        }

        if (action === 'delete') {
            const url = `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${R2_BUCKET_NAME}/${key}`
            const res = await aws.fetch(url, { method: 'DELETE' })

            // R2 usually returns 204 No Content for deletes
            if (res.status >= 300) throw new Error(`R2 Delete failed: ${res.statusText}`)

            return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
        }

        throw new Error('Invalid Action')

    } catch (error) {
        console.error(error)
        return new Response(
            JSON.stringify({ error: error.message || 'Unknown error' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
})
