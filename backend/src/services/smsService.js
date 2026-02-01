import twilio from 'twilio';
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER;
const client = twilio(accountSid, authToken);

export const sendSMS = async ({ to, message }) => {
  try {
    const res = await client.messages.create({
      body: message,
      from: twilioPhone,
      to,
    });
    return res;
  } catch (err) {
    throw err;
  }
};

export const scheduleSMS = async ({ to, message, scheduleTime }) => {
  // For demo: just return a mock, real scheduling would use a job queue
  return { status: 'scheduled', to, message, scheduleTime };
};
