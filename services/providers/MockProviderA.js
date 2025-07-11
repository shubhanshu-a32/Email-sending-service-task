module.exports = {
  sendEmail: async (email) => {
    if (Math.random() < 0.7) {
      console.log("[ProviderA] Email sent to", email.to);
      return { success: true };
    } else {
      throw new error("[ProviderA] failed to send email");
    }
  },
};
