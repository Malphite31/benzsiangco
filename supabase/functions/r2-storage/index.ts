
// Using npm specifiers which are now supported and often more stable than esm.sh for AWS SDK
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "npm:@aws-sdk/client-s3@3.400.0"
import { getSignedUrl } from "npm:@aws-sdk/s3-request-presigner@3.400.0"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
}

console.log("Function initializing...")

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

        if (!R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
            throw new Error('Missing R2 Credentials')
        }

        const r2 = new S3Client({
            region: 'auto',
            endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
            credentials: {
                accessKeyId: R2_ACCESS_KEY_ID,
                secretAccessKey: R2_SECRET_ACCESS_KEY,
            },
        })

        if (action === 'upload-sign') {
            const command = new PutObjectCommand({
                Bucket: R2_BUCKET_NAME,
                Key: key,
                ContentType: contentType,
            })
            const signedUrl = await getSignedUrl(r2, command, { expiresIn: 600 })
            return new Response(JSON.stringify({ url: signedUrl }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
        }

        if (action === 'delete') {
            const command = new DeleteObjectCommand({ Bucket: R2_BUCKET_NAME, Key: key })
            await r2.send(command)
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
