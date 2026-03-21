const buildTemplate = ({ title, intro, code, note }) => `
  <div style="margin:0;padding:0;background-color:#f4f6fb;font-family:Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#f4f6fb;padding:24px 0;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 8px 24px rgba(25,42,70,0.08);">
            <tr>
              <td style="background:#1e3a8a;padding:20px 28px;color:#ffffff;font-size:18px;font-weight:700;">
                PlanYU
              </td>
            </tr>
            <tr>
              <td style="padding:28px 28px 8px 28px;color:#0f172a;">
                <h1 style="margin:0 0 12px 0;font-size:20px;">${title}</h1>
                <p style="margin:0 0 16px 0;font-size:14px;line-height:1.6;color:#475569;">${intro}</p>
                <div style="margin:16px 0;padding:16px;border-radius:10px;background:#f8fafc;border:1px solid #e2e8f0;text-align:center;">
                  <div style="font-size:24px;letter-spacing:6px;font-weight:700;color:#0f172a;">${code}</div>
                </div>
                <p style="margin:0 0 8px 0;font-size:13px;line-height:1.6;color:#64748b;">${note}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 28px 24px 28px;font-size:12px;color:#94a3b8;">
                If you did not request this, you can safely ignore this email.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </div>
`;

export { buildTemplate };
