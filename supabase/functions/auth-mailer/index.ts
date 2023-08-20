import { serve } from 'https://deno.land/std@0.192.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

console.log(`Function "invite" up and running!`)
const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)
serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    let { email, type, language, password, redirect_to } = await req.json();
    language = language || 'en'; // default to 'en' if no language is provided
    password = password || ''; // default to '' if no password is provided
    redirect_to = redirect_to || ''; // default to '' if no redirect_to is provided
    console.log(JSON.stringify({ email, type, language, password }, null, 2));
    // Generate a link with admin API call
    let linkPayload: any = {
      type, // e.g., 'recovery', 'magiclink', ...
      email,
    }
    if (type == 'signup') {
      linkPayload = {
        ...linkPayload,
        password,
      }
      console.log("linkPayload", linkPayload);
    }
    const { data: linkResponse, error: linkError } = await supabaseAdmin.auth.admin.generateLink(linkPayload)
    console.log("linkResponse", linkResponse);
    if (linkError) {
      throw linkError;
    }
    let actual_link = linkResponse.properties.action_link;
    //You can manipulate the redirect link here:
    if (redirect_to != '') {
      actual_link = actual_link.split('redirect_to=')[0];
      actual_link = actual_link + '&redirect_to=' + redirect_to;
    }
    console.log(JSON.stringify({ "template_type":type, "link": linkResponse, "language":language }, null, 2));
    const { data: templateData, error: templateError } = await supabaseAdmin.rpc('get_email_template', { "template_type":type, "link": actual_link, "language":language });
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

    const resendData = await resendRes.json();
    return new Response(JSON.stringify(resendData), {
      status: resendRes.status,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
