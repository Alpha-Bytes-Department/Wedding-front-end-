import Swal from "sweetalert2";
import type { User } from "./types";

// Helper to render field if exists
const renderField = (label: string, value: any, isLong = false) => {
  if (!value || value === "N/A") return "";
  return `
    <div style="padding: 8px 0; border-bottom: 1px solid rgba(0,0,0,0.05);">
      <div style="font-size: 11px; color: #6b7280; text-transform: uppercase; font-weight: 600; margin-bottom: 4px;">${label}</div>
      <div style="font-size: 13px; color: #1f2937; ${
        isLong ? "white-space: pre-wrap; line-height: 1.5;" : ""
      }">${value}</div>
    </div>
  `;
};

// Format status with color
const getStatusBadge = (status?: string) => {
  if (!status)
    return '<span style="background: #e5e7eb; color: #6b7280; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600;">No Status</span>';
  const statusMap: Record<string, string> = {
    planned: "background: #dbeafe; color: #1e40af;",
    submitted: "background: #fef3c7; color: #92400e;",
    approved: "background: #e0e7ff; color: #3730a3;",
    completed: "background: #d1fae5; color: #065f46;",
    canceled: "background: #fee2e2; color: #991b1b;",
  };
  const style =
    statusMap[status.toLowerCase()] || "background: #e5e7eb; color: #6b7280;";
  return `<span style="${style} padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600; text-transform: capitalize;">${status}</span>`;
};

// Event Header Component HTML
const getEventHeaderHTML = (event: any) => `
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 12px; margin-bottom: 20px; color: white; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
    <h3 style="margin: 0 0 8px 0; font-size: 20px; font-weight: 700;">${
      event.title || "Untitled Event"
    }</h3>
    <p style="margin: 0; font-size: 14px; opacity: 0.95; line-height: 1.6;">${
      event.description || "No description"
    }</p>
    <div style="margin-top: 12px; font-size: 13px; opacity: 0.9;">
      <strong>Ceremony Type:</strong> ${event.ceremonyType || "Not specified"}
    </div>
  </div>
`;

// Status & Price Grid Component HTML
const getStatusPriceGridHTML = (event: any) => `
  <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin-bottom: 20px;">
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 14px; border-radius: 10px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
      <div style="font-size: 11px; color: rgba(255,255,255,0.8); text-transform: uppercase; font-weight: 600; margin-bottom: 6px;">Status</div>
      <div>${getStatusBadge(event.status)}</div>
    </div>
    <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 14px; border-radius: 10px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
      <div style="font-size: 11px; color: rgba(255,255,255,0.9); text-transform: uppercase; font-weight: 600; margin-bottom: 6px;">Price</div>
      <div style="font-size: 20px; font-weight: 700; color: white;">$${
        event.price || 0
      }</div>
    </div>
    <div style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); padding: 14px; border-radius: 10px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
      <div style="font-size: 11px; color: rgba(255,255,255,0.9); text-transform: uppercase; font-weight: 600; margin-bottom: 6px;">Language</div>
      <div style="font-size: 14px; font-weight: 600; color: white;">${
        event.language || "Not specified"
      }</div>
    </div>
  </div>
`;

// Couple Information Component HTML
const getCoupleInfoHTML = (event: any) => `
  <div style="background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%); padding: 18px; border-radius: 12px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.08);">
    <h4 style="margin: 0 0 14px 0; font-size: 15px; font-weight: 700; color: #78350f; display: flex; align-items: center;">
      <span style="margin-right: 8px; font-size: 20px;">💑</span> Couple Information
    </h4>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
      <div style="background: rgba(255,255,255,0.6); padding: 12px; border-radius: 8px;">
        <span style="font-size: 11px; color: #78350f; text-transform: uppercase; font-weight: 600;">Groom</span>
        <div style="font-weight: 700; color: #1f2937; font-size: 15px; margin-top: 4px;">${
          event.groomName || "N/A"
        }</div>
      </div>
      <div style="background: rgba(255,255,255,0.6); padding: 12px; border-radius: 8px;">
        <span style="font-size: 11px; color: #78350f; text-transform: uppercase; font-weight: 600;">Bride</span>
        <div style="font-weight: 700; color: #1f2937; font-size: 15px; margin-top: 4px;">${
          event.brideName || "N/A"
        }</div>
      </div>
    </div>
  </div>
`;

// Event Schedule Component HTML
const getEventScheduleHTML = (event: any) => `
  <div style="background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%); padding: 18px; border-radius: 12px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.08);">
    <h4 style="margin: 0 0 14px 0; font-size: 15px; font-weight: 700; color: #064e3b; display: flex; align-items: center;">
      <span style="margin-right: 8px; font-size: 20px;">📅</span> Event Schedule
    </h4>
    <div style="background: rgba(255,255,255,0.7); padding: 14px; border-radius: 8px;">
      ${renderField(
        "Event Date",
        event.eventDate
          ? new Date(event.eventDate).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          : "N/A"
      )}
      ${renderField(
        "Event Time",
        event.eventTime
          ? new Date(event.eventTime).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "N/A"
      )}
      ${renderField(
        "Rehearsal Date",
        event.rehearsalDate
          ? new Date(event.rehearsalDate).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          : "N/A"
      )}
      ${renderField(
        "Created At",
        event.createdAt
          ? new Date(event.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          : "N/A"
      )}
      ${
        event.updatedAt
          ? renderField(
              "Last Updated",
              new Date(event.updatedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            )
          : ""
      }
    </div>
  </div>
`;

// Location & Officiant Component HTML
const getLocationOfficiantHTML = (event: any) => `
  <div style="background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%); padding: 18px; border-radius: 12px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.08);">
    <h4 style="margin: 0 0 14px 0; font-size: 15px; font-weight: 700; color: #881337; display: flex; align-items: center;">
      <span style="margin-right: 8px; font-size: 20px;">📍</span> Location & Officiant
    </h4>
    <div style="background: rgba(255,255,255,0.7); padding: 14px; border-radius: 8px;">
      ${renderField("Location", event.location)}
      ${renderField("Officiant", event.officiantName || "Not Assigned")}
      ${event.officiantId ? renderField("Officiant ID", event.officiantId) : ""}
    </div>
  </div>
`;

// Greetings & Opening Component HTML
const getGreetingsOpeningHTML = (event: any) => {
  if (!event.greetingSpeech && !event.presentationOfBride && !event.invocation)
    return "";

  return `
    <div style="background: linear-gradient(135deg, #d299c2 0%, #fef9d7 100%); padding: 18px; border-radius: 12px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.08);">
      <h4 style="margin: 0 0 14px 0; font-size: 15px; font-weight: 700; color: #701a75; display: flex; align-items: center;">
        <span style="margin-right: 8px; font-size: 20px;">🎤</span> Greetings & Opening
      </h4>
      <div style="background: rgba(255,255,255,0.7); padding: 14px; border-radius: 8px;">
        ${renderField("Greeting Speech", event.greetingSpeech, true)}
        ${renderField("Presentation of Bride", event.presentationOfBride, true)}
        ${renderField(
          "Question for Presentation",
          event.questionForPresentation,
          true
        )}
        ${renderField("Response to Question", event.responseToQuestion, true)}
        ${renderField("Invocation", event.invocation, true)}
      </div>
    </div>
  `;
};

// Vows & Commitments Component HTML
const getVowsCommitmentsHTML = (event: any) => {
  if (!event.vows && !event.pledge && !event.chargeToGroomAndBride) return "";

  return `
    <div style="background: linear-gradient(135deg, #fddb92 0%, #d1fdff 100%); padding: 18px; border-radius: 12px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.08);">
      <h4 style="margin: 0 0 14px 0; font-size: 15px; font-weight: 700; color: #713f12; display: flex; align-items: center;">
        <span style="margin-right: 8px; font-size: 20px;">💕</span> Vows & Commitments
      </h4>
      <div style="background: rgba(255,255,255,0.7); padding: 14px; border-radius: 8px;">
        ${renderField(
          "Charge to Groom and Bride",
          event.chargeToGroomAndBride,
          true
        )}
        ${renderField("Pledge", event.pledge, true)}
        ${renderField(
          "Introduction to Exchange of Vows",
          event.introductionToExchangeOfVows,
          true
        )}
        ${renderField("Vows", event.vows, true)}
        ${renderField("Readings", event.readings, true)}
      </div>
    </div>
  `;
};

// Ring Exchange Component HTML
const getRingExchangeHTML = (event: any) => {
  if (
    !event.exchangeOfRingsGroom &&
    !event.exchangeOfRingsBride &&
    !event.blessingsOfRings
  )
    return "";

  return `
    <div style="background: linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%); padding: 18px; border-radius: 12px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.08);">
      <h4 style="margin: 0 0 14px 0; font-size: 15px; font-weight: 700; color: #581c87; display: flex; align-items: center;">
        <span style="margin-right: 8px; font-size: 20px;">💍</span> Ring Exchange
      </h4>
      <div style="background: rgba(255,255,255,0.7); padding: 14px; border-radius: 8px;">
        ${renderField(
          "Introduction to Exchange of Rings",
          event.introductionToExchangeOfRings,
          true
        )}
        ${renderField("Blessings of Rings", event.blessingsOfRings, true)}
        ${renderField(
          "Exchange of Rings - Groom",
          event.exchangeOfRingsGroom,
          true
        )}
        ${renderField(
          "Exchange of Rings - Bride",
          event.exchangeOfRingsBride,
          true
        )}
        ${renderField(
          "Prayer on the New Union",
          event.prayerOnTheNewUnion,
          true
        )}
      </div>
    </div>
  `;
};

// Rituals & Closing Component HTML
const getRitualsClosingHTML = (event: any) => {
  if (!event.ritualsSelection && !event.closingStatement && !event.pronouncing)
    return "";

  return `
    <div style="background: linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%); padding: 18px; border-radius: 12px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.08);">
      <h4 style="margin: 0 0 14px 0; font-size: 15px; font-weight: 700; color: #1e3a8a; display: flex; align-items: center;">
        <span style="margin-right: 8px; font-size: 20px;">✨</span> Rituals & Closing
      </h4>
      <div style="background: rgba(255,255,255,0.7); padding: 14px; border-radius: 8px;">
        ${renderField("Rituals Selection", event.ritualsSelection, true)}
        ${renderField("Rituals Option", event.ritualsOption, true)}
        ${renderField("Closing Statement", event.closingStatement, true)}
        ${renderField("Pronouncing", event.pronouncing, true)}
        ${renderField("Kiss", event.kiss, true)}
        ${renderField(
          "Introduction of Couple",
          event.introductionOfCouple,
          true
        )}
      </div>
    </div>
  `;
};

// No Event Message Component HTML
const getNoEventHTML = () => `
  <div style="text-align: center; padding: 40px 20px; background: #f9fafb; border-radius: 8px; border: 2px dashed #d1d5db;">
    <div style="font-size: 48px; margin-bottom: 12px;">📅</div>
    <p style="margin: 0; color: #6b7280; font-size: 15px;">No wedding ceremony information available</p>
    <p style="margin: 8px 0 0 0; color: #9ca3af; font-size: 13px;">This user hasn't created an event yet</p>
  </div>
`;

// User Information Component HTML
const getUserInfoHTML = (user: User) => `
  <div style="background: #f8fafc; padding: 16px; border-radius: 8px; margin-bottom: 20px;">
    <h4 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #475569;">👤 User Information</h4>
    <div style="display: grid; gap: 6px;">
      <p style="margin: 0; font-size: 13px;"><strong style="color: #64748b;">Email:</strong> <span style="color: #1e293b;">${
        user.email
      }</span></p>
      <p style="margin: 0; font-size: 13px;"><strong style="color: #64748b;">Phone:</strong> <span style="color: #1e293b;">${
        user.phone || "N/A"
      }</span></p>
      <p style="margin: 0; font-size: 13px;"><strong style="color: #64748b;">Address:</strong> <span style="color: #1e293b;">${
        user.address || "N/A"
      }</span></p>
      <p style="margin: 0; font-size: 13px;"><strong style="color: #64748b;">Account Status:</strong> ${
        user.isVerified
          ? '<span style="color: #059669;">✅ Verified</span>'
          : '<span style="color: #d97706;">⚠️ Unverified</span>'
      }</p>
      <p style="margin: 0; font-size: 13px;"><strong style="color: #64748b;">Joined:</strong> <span style="color: #1e293b;">${new Date(
        user.createdAt
      ).toLocaleDateString()}</span></p>
    </div>
  </div>
`;

// Main function to build wedding info HTML
const getWeddingInfoHTML = (event: any) => {
  if (!event) return getNoEventHTML();

  return `
    ${getEventHeaderHTML(event)}
    ${getStatusPriceGridHTML(event)}
    ${getCoupleInfoHTML(event)}
    ${getEventScheduleHTML(event)}
    ${getLocationOfficiantHTML(event)}
    ${getGreetingsOpeningHTML(event)}
    ${getVowsCommitmentsHTML(event)}
    ${getRingExchangeHTML(event)}
    ${getRitualsClosingHTML(event)}
  `;
};

// Main exported function to show user details modal
export const showUserDetailsModal = async (user: User) => {
  const event = user.event_details;
  const weddingInfo = getWeddingInfoHTML(event);

  await Swal.fire({
    title: `${
      user.name || `${user.partner_1 || ""} & ${user.partner_2 || ""}`.trim()
    }`,
    html: `
      <div style="text-align: left;">
        ${getUserInfoHTML(user)}
        <h4 style="margin: 0 0 12px 0; font-size: 15px; font-weight: 700; color: #1e293b;">💒 Wedding Ceremony Details</h4>
        ${weddingInfo}
      </div>
    `,
    width: "800px",
    showConfirmButton: true,
    confirmButtonText: "Close",
    confirmButtonColor: "#3B82F6",
    customClass: {
      popup: "swal-custom-popup",
      htmlContainer: "swal-custom-html",
    },
  });
};
