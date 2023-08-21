// Importing required libraries
import { serve } from 'https://deno.land/std@0.192.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Defining CORS headers
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Log to indicate the function is up and running
console.log(`Function "auth-mailer" up and running!`)

// Creating a Supabase client using environment variables
const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

// Define a server that handles different types of requests
serve(async (req: Request) => {
  // Handling preflight CORS requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Destructuring request JSON and setting default values
    let { email, type, language = 'en', password = '', redirect_to = '' } = await req.json();
    console.log(JSON.stringify({ email, type, language, password }, null, 2));

    // Generate a link with admin API call
    let linkPayload: any = {
      type,
      email,
    }

    // If type is 'signup', add password to the payload
    if (type == 'signup') {
      linkPayload = {
        ...linkPayload,
        password,
      }
      console.log("linkPayload", linkPayload);
    }

    // Generate the link
    const { data: linkResponse, error: linkError } = await supabaseAdmin.auth.admin.generateLink(linkPayload)
    console.log("linkResponse", linkResponse);

    // Throw error if any occurs during link generation
    if (linkError) {
      throw linkError;
    }

    // Getting the actual link and manipulating the redirect link
    let actual_link = linkResponse.properties.action_link;
    if (redirect_to != '') {
      actual_link = actual_link.split('redirect_to=')[0];
      actual_link = actual_link + '&redirect_to=' + redirect_to;
    }

    // Log the template data
    console.log(JSON.stringify({ "template_type":type, "link": linkResponse, "language":language }, null, 2));

    // Get the email template
    const { data: templateData, error: templateError } = await supabaseAdmin.rpc('get_email_template', { "template_type":type, "link": actual_link, "language":language });

    // Throw error if any occurs during template fetching
    if (templateError) {
      throw templateError;
    }

    // Send the email using resend
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'rodrigo@mansueli.com',
        to: email,
        subject: templateData.subject,
        html: templateData.content,
      }),
    });

    // Handle the response from the resend request
    const resendData = await resendRes.json();
    return new Response(JSON.stringify(resendData), {
      status: resendRes.status,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    // Handle any other errors
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
