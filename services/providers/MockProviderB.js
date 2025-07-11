module.exports = {
  sendEmail: async (email) => {
    if (Math.random() < 0.9) {
      console.log("[ProviderB] Email sent to", email.to);
      return { success: true };
    } else {
      throw new Error("[ProviderB] Failed to send email");
    }
  },
};
