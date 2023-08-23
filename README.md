# Supabase-Edge-AuthMailer

Welcome to the **Supabase-Edge-AuthMailer** repository! This repository contains the code and resources discussed in the blog post titled "Building a Custom Authentication Email System with Supabase Edge Functions, PostgreSQL, and Resend." You can read the full blog post [here](https://blog.mansueli.com/creating-customized-i18n-ready-authentication-emails-using-supabase-edge-functions-postgresql-and-resend).

## Introduction

This repository provides a practical implementation of a personalized authentication email system using Supabase Edge Functions, PostgreSQL, and the Resend email service. By following the instructions and code samples provided in the blog post, you can build a powerful and customizable email authentication system for your applications.

## Getting Started

To get started with this project, follow these steps:

1. Clone the repository to your local machine:

   ```bash
   git clone https://github.com/mansueli/Supabase-Edge-AuthMailer.git
   ```

2. Set up your development environment:

   - Ensure you have Deno, PostgreSQL, and Supabase configured on your system.
   - Configure your environment variables, such as `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and `RESEND_API_KEY`.

3. Explore the Code:

   - Navigate to the [`index.ts`](https://github.com/mansueli/Supabase-Edge-AuthMailer/blob/main/supabase/functions/auth-mailer/index.ts) file to explore the Deno Edge Function responsible for handling authentication email requests.
   - Review the SQL code in the [`init.sql`](https://github.com/mansueli/Supabase-Edge-AuthMailer/blob/main/init.sql) file, which defines the PostgreSQL functions and table structure for email templates.

## Code Explanation

For a detailed explanation of the code and its functionality, refer to the blog post: [Building a Custom Authentication Email System with Supabase Edge Functions, PostgreSQL, and Resend]([https://blog.mansueli.com/building-custom-authentication-email-system-supabase-edge-functions](https://blog.mansueli.com/creating-customized-i18n-ready-authentication-emails-using-supabase-edge-functions-postgresql-and-resend).

## Additional Resources

- [Official Supabase Documentation](https://supabase.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Deno Official Website](https://deno.land/)
- [Resend API Documentation](https://resend.com/docs)

## License

This project is licensed under the [Apache License 2.0](LICENSE).
