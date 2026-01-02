import { supabase } from './supabase';

export const R2_BUCKET = import.meta.env.VITE_R2_BUCKET_NAME;
export const R2_PUBLIC_URL = import.meta.env.VITE_R2_PUBLIC_URL;

/**
 * Securely gets a presigned URL from the server (Edge Function)
 * This prevents exposing the R2 Secret Key in the client bundle.
 */
export const getUploadUrl = async (key: string, contentType: string) => {
    const { data, error } = await supabase.functions.invoke('r2-storage', {
        body: { action: 'upload-sign', key, contentType }
    });

    if (error) {
        console.error('Edge Function Error:', error);
        throw new Error('Failed to get upload signature from server');
    }

    return data.url;
};

/**
 * Securely deletes a file using the server (Edge Function)
 */
export const deleteR2File = async (key: string) => {
    const { data, error } = await supabase.functions.invoke('r2-storage', {
        body: { action: 'delete', key }
    });

    if (error) {
        console.error('Edge Function Error:', error);
        throw error;
    }

    return data;
};
