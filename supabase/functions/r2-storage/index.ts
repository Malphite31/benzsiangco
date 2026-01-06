import { S3Client, PutObjectCommand, DeleteObjectCommand } from "https://esm.sh/@aws-sdk/client-s3@3.370.0"
import { getSignedUrl } from "https://esm.sh/@aws-sdk/s3-request-presigner@3.370.0"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
}

Deno.serve(async (req) => {
    // Handle CORS
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { action, key, contentType } = await req.json()

        // Initialize R2 Client with Environment Variables
        const R2_ACCOUNT_ID = Deno.env.get('R2_ACCOUNT_ID')
        const R2_ACCESS_KEY_ID = Deno.env.get('R2_ACCESS_KEY_ID')
        const R2_SECRET_ACCESS_KEY = Deno.env.get('R2_SECRET_ACCESS_KEY')
        const R2_BUCKET_NAME = Deno.env.get('R2_BUCKET_NAME')

        if (!R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
            console.error('Missing R2 Credentials')
            throw new Error('Missing R2 Credentials on Server')
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
            if (!key || !contentType) throw new Error('Missing key or contentType')

            const command = new PutObjectCommand({
                Bucket: R2_BUCKET_NAME,
                Key: key,
                ContentType: contentType,
            })

            // Generate Presigned URL (valid for 10 minutes)
            const signedUrl = await getSignedUrl(r2, command, { expiresIn: 600 })

            return new Response(
                JSON.stringify({ url: signedUrl }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        if (action === 'delete') {
            if (!key) throw new Error('Missing key')

            const command = new DeleteObjectCommand({
                Bucket: R2_BUCKET_NAME,
                Key: key,
            })

            await r2.send(command)

            return new Response(
                JSON.stringify({ success: true }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        throw new Error('Invalid Action')

    } catch (error) {
        console.error('Edge Function Error:', error)
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
})
