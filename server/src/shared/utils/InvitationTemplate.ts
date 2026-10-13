export class InvitationTemplate {
  static generate(invitationLink: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <title>Nexora Invitation</title>
        </head>

        <body
          style="
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            background-color: #f5f7fb;
          "
        >
          <div
            style="
              max-width: 600px;
              margin: 40px auto;
              background: white;
              padding: 40px;
              border-radius: 10px;
            "
          >
            <h2 style="margin-bottom: 20px;">
              You're invited to Nexora
            </h2>

            <p>
              You have been invited to join an organization
              on Nexora as a member.
            </p>

            <p>
              Click the button below to accept your invitation
              and create your account.
            </p>

            <div style="margin: 30px 0;">
              <a
                href="${invitationLink}"
                style="
                  display: inline-block;
                  padding: 12px 24px;
                  background-color: #2563eb;
                  color: white;
                  text-decoration: none;
                  border-radius: 6px;
                "
              >
                Accept Invitation
              </a>
            </div>

            <p>
              This invitation will expire in 24 hours.
            </p>

            <p>
              If you did not expect this invitation, you can
              safely ignore this email.
            </p>

            <p style="margin-top: 30px;">
              Thanks,<br />
              Nexora Team
            </p>
          </div>
        </body>
      </html>
    `;
  }
}