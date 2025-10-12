// Elegant HTML email template for vendor notification on new inquiry
// Usage: const inquiryTemplate = require("../mails/inquiryNotificationTemplate");
// html = inquiryTemplate({ businessName, businessLink, inquiry, customer });

const formatBudget = (budget) => {
  if (!budget || typeof budget !== 'object') return null;
  const { min, max, currency = 'INR' } = budget;
  if (min && max) return `${currency} ${min} - ${max}`;
  if (min) return `${currency} ${min}+`;
  if (max) return `${currency} up to ${max}`;
  return null;
};

const formatServiceInterests = (serviceInterest) => {
  if (!Array.isArray(serviceInterest) || serviceInterest.length === 0) return '';
  try {
    const items = serviceInterest.map((item) => {
      if (typeof item === 'string') {
        return `<li>${item}</li>`;
      }
      const name = item?.serviceName || 'Service';
      const budgetText = formatBudget(item?.budget);
      return `<li>${name}${budgetText ? ` — <span style="color:#555;">Budget: ${budgetText}</span>` : ''}</li>`;
    }).join('');
    return `
      <div style="margin-top: 12px;">
        <div style="font-weight:600; margin-bottom:6px;">Service Interest</div>
        <ul style="margin:0; padding-left:18px;">${items}</ul>
      </div>
    `;
  } catch {
    return '';
  }
};

const formatLocation = (location) => {
  if (!location || typeof location !== 'object') return '';
  const { city, area, pincode } = location;
  const parts = [area, city, pincode].filter(Boolean);
  return parts.length ? parts.join(', ') : '';
};

const inquiryNotificationTemplate = ({ businessName, businessLink, inquiry, customer }) => {
  const createdAt = inquiry?.createdAt ? new Date(inquiry.createdAt) : new Date();
  const createdAtStr = createdAt.toLocaleString('en-IN', { hour12: true });

  const locationText = formatLocation(customer?.location);
  const serviceInterestHtml = formatServiceInterests(inquiry?.serviceInterest);

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New Inquiry — ${businessName}</title>
  <style>
    body { background:#f6f7fb; margin:0; padding:0; font-family: Arial, sans-serif; color:#222; }
    .container { max-width:700px; margin:0 auto; padding:24px; }
    .card { background:#ffffff; border-radius:12px; box-shadow: 0 2px 6px rgba(0,0,0,0.06); overflow:hidden; }
    .header { background:#111827; color:#fff; padding:18px 20px; }
    .brand { font-weight:700; font-size:18px; letter-spacing:0.3px; }
    .title { font-size:20px; font-weight:600; margin:0; }
    .content { padding:20px; }
    .section { margin-bottom:16px; }
    .label { color:#374151; font-weight:600; margin-bottom:6px; }
    .muted { color:#6b7280; font-size:13px; }
    .divider { border-top:1px solid #eee; margin:16px 0; }
    .summary-grid { display:grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap:10px; }
    .summary-item { background:#f9fafb; border:1px solid #eef2f7; border-radius:8px; padding:10px; }
    .cta { display:inline-block; background:#0ea5e9; color:#fff !important; text-decoration:none; padding:12px 16px; border-radius:8px; font-weight:600; }
    .link { color:#0ea5e9; text-decoration:none; }
    .message { white-space:pre-line; background:#fff; border:1px solid #eef2f7; border-radius:8px; padding:12px; }
    .footer { color:#6b7280; font-size:12px; text-align:center; padding:14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="header">
        <div class="brand">Business Gurujee</div>
        <div class="title">New Inquiry Received</div>
      </div>
      <div class="content">
        <div class="section">
          <div class="muted">You have received a new inquiry for <strong>${businessName}</strong>.</div>
        </div>

        <div class="section">
          <div class="label">Inquiry Summary</div>
          <div class="summary-grid">
            <div class="summary-item"><div class="muted">Subject</div><div>${inquiry?.subject || '-'}</div></div>
            <div class="summary-item"><div class="muted">Type</div><div>${inquiry?.inquiryType || 'general'}</div></div>
            <div class="summary-item"><div class="muted">Priority</div><div>${inquiry?.priority || 'medium'}</div></div>
            <div class="summary-item"><div class="muted">Received</div><div>${createdAtStr}</div></div>
          </div>
        </div>

        <div class="section">
          <div class="label">Customer Details</div>
          <div style="display:grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap:10px;">
            <div class="summary-item"><div class="muted">Name</div><div>${customer?.name || '-'}</div></div>
            <div class="summary-item"><div class="muted">Email</div><div>${customer?.email || '-'}</div></div>
            <div class="summary-item"><div class="muted">Phone</div><div>${customer?.phone || '-'}</div></div>
            <div class="summary-item"><div class="muted">Preferred Contact</div><div>${customer?.preferredContact || 'any'}</div></div>
            <div class="summary-item"><div class="muted">Best Time</div><div>${customer?.bestTimeToContact || 'anytime'}</div></div>
            ${locationText ? `<div class="summary-item"><div class="muted">Location</div><div>${locationText}</div></div>` : ''}
          </div>
        </div>

        <div class="section">
          <div class="label">Message</div>
          <div class="message">${inquiry?.message || ''}</div>
        </div>

        ${serviceInterestHtml}

        <div class="divider"></div>

        <div class="section">
          <a class="cta" href="${businessLink}" target="_blank" rel="noopener">View Business</a>
          <div class="muted" style="margin-top:8px;">Or open: <a class="link" href="${businessLink}" target="_blank" rel="noopener">${businessLink}</a></div>
        </div>

        <div class="footer">This notification was sent automatically by Business Gurujee.</div>
      </div>
    </div>
  </div>
</body>
</html>`;
};

module.exports = inquiryNotificationTemplate;