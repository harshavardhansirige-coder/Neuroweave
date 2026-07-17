import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

export class ResendService {
  private resend: Resend | null = null;
  private fromAddress = 'LearnForge AI <learning@learnforge.ai>';

  constructor() {
    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) {
      this.resend = new Resend(apiKey);
      console.log('>>> [Resend Service] SDK Initialized.');
    } else {
      console.warn('>>> [Resend Service] Warning: RESEND_API_KEY environment variable is not defined.');
    }
  }

  private async sendEmail(to: string, subject: string, html: string) {
    if (!this.resend) {
      console.warn(`>>> [Resend Sandbox] Email to <${to}>, subject "${subject}" logged to terminal (Resend API key missing).`);
      return { id: 'sandbox-id-logged' };
    }

    try {
      const response = await this.resend.emails.send({
        from: this.fromAddress,
        to,
        subject,
        html
      });
      console.log(`>>> [Resend Service] Email sent successfully to ${to}. ID: ${response.data?.id}`);
      return response;
    } catch (error) {
      console.error(`>>> [Resend Service] Failed to send email to ${to}:`, error);
      throw error;
    }
  }

  async sendWelcomeEmail(to: string, displayName: string) {
    const subject = 'Welcome to LearnForge AI! 🚀';
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <h2 style="color: #6366f1;">Welcome to LearnForge AI, ${displayName}!</h2>
        <p>Your personalized Multi-Agent AI classroom is fully synchronized and ready for study.</p>
        <p>Type what you want to learn (e.g. <i>"Tokio Event Loops in Rust"</i> or <i>"Quantum Computing Basics"</i>) and watch your Master Orchestrator spin up curriculum, coding, and quiz agents dynamically.</p>
        <br />
        <a href="https://learnforge.ai/dashboard" style="background-color: #6366f1; color: white; padding: 10px 20px; text-decoration: none; border-radius: 8px; font-weight: bold;">Launch Classroom</a>
        <hr style="border: 0; border-top: 1px solid #eee; margin-top: 30px;" />
        <p style="font-size: 11px; color: #999;">If you didn't sign up for LearnForge AI, you can ignore this email.</p>
      </div>
    `;
    return this.sendEmail(to, subject, html);
  }

  async sendCourseCompletionEmail(to: string, displayName: string, courseTitle: string, certificateUrl?: string) {
    const subject = `Congratulations on completing ${courseTitle}! 🎓`;
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <h2 style="color: #10b981;">Milestone Achieved! 🏆</h2>
        <p>Hi ${displayName},</p>
        <p>You have successfully completed all modules and cleared the final assessment for <strong>${courseTitle}</strong>!</p>
        ${certificateUrl ? `
          <p>Your cryptographic certificate has been generated and backed up securely on Cloudinary.</p>
          <p><a href="${certificateUrl}" style="background-color: #10b981; color: white; padding: 10px 20px; text-decoration: none; border-radius: 8px; font-weight: bold;">View Certificate</a></p>
        ` : ''}
        <br />
        <p>Keep forging forward. Launch a new study session today!</p>
      </div>
    `;
    return this.sendEmail(to, subject, html);
  }

  async sendWeeklyProgressEmail(to: string, displayName: string, progressSummary: string) {
    const subject = 'Your LearnForge AI Weekly Report 📊';
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <h2 style="color: #6366f1;">Weekly Progress digest</h2>
        <p>Hi ${displayName},</p>
        <p>Here is a summary of what you mastered this week:</p>
        <blockquote style="background-color: #f3f4f6; border-left: 4px solid #6366f1; padding: 15px; margin: 15px 0;">
          ${progressSummary}
        </blockquote>
        <p>Consolidate your knowledge by testing yourself using revision flashcards!</p>
      </div>
    `;
    return this.sendEmail(to, subject, html);
  }

  async sendAssessmentResultsEmail(to: string, displayName: string, courseTitle: string, score: number, passed: boolean) {
    const subject = passed ? `Passed: ${courseTitle} Assessment ✅` : `Result: ${courseTitle} Assessment 📝`;
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <h2>Assessment Report</h2>
        <p>Hi ${displayName},</p>
        <p>You have cleared the final test for <strong>${courseTitle}</strong> with a score of <strong>${score}%</strong>.</p>
        ${passed 
          ? '<p style="color: #10b981; font-weight: bold;">Status: PASSED. Your certificate is processing!</p>' 
          : '<p style="color: #ef4444; font-weight: bold;">Status: RETRY RECOMMENDED. Revise the notes and try again!</p>'}
      </div>
    `;
    return this.sendEmail(to, subject, html);
  }
}

export const resendService = new ResendService();
export default resendService;
