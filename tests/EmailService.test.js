// const { sendEmail, getStatus } = require('../services/EmailService');

// describe('EmailService', () => {
//   jest.setTimeout(10000); // increase timeout due to backoff retries

//   const testEmail = {
//     to: 'test@example.com',
//     subject: 'Test Subject',
//     body: 'Test Body',
//     userId: 'user1',
//     requestId: 'req12345'
//   };

//   it('should send an email successfully', async () => {
//     const result = await sendEmail(testEmail);
//     expect(result.status).toBe('sent');
//     expect(['A', 'B']).toContain(result.provider);
//   });

//   it('should prevent duplicate emails (idempotency)', async () => {
//     const duplicate = await sendEmail(testEmail);
//     expect(duplicate.status).toBe('duplicate');
//   });

//   it('should return email status from getStatus()', () => {
//     const status = getStatus(testEmail.requestId);
//     expect(['sent', 'failed', 'duplicate']).toContain(status.status);
//   });

//   it('should rate limit after too many sends', async () => {
//     const spamEmail = {
//       to: 'spam@example.com',
//       subject: 'Spam',
//       body: 'Spam Body',
//       userId: 'spammer'
//     };

//     const results = [];
//     for (let i = 0; i < 6; i++) {
//       spamEmail.requestId = 'spam-' + i;
//       const result = await sendEmail(spamEmail);
//       results.push(result.status);
//     }

//     expect(results.filter(r => r === 'rate_limited').length).toBeGreaterThanOrEqual(1);
//   });
// });
