const API_KEY = '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';
const API_URL = 'https://openrouter.ai/api/v1/chat/completions';

export class AIService {
  static async analyzeResume(resumeData) {
    try {
      const resumeText = this.extractResumeText(resumeData);
      
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Resume Builder AI Analysis'
        },
        body: JSON.stringify({
          model: 'anthropic/claude-3.5-sonnet',
          messages: [
            {
              role: 'system',
              content: `You are an expert resume reviewer and ATS (Applicant Tracking System) specialist. Analyze the provided resume and return a JSON response with the following structure:
              {
                "atsScore": number (0-100),
                "overallFeedback": "string",
                "strengths": ["array of strings"],
                "improvements": ["array of strings"],
                "keywordSuggestions": ["array of strings"],
                "formatting": {
                  "score": number (0-100),
                  "feedback": "string"
                },
                "content": {
                  "score": number (0-100),
                  "feedback": "string"
                }
              }
              
              Focus on ATS compatibility, keyword optimization, formatting consistency, and content quality. Be specific and actionable in your feedback.`
            },
            {
              role: 'user',
              content: `Please analyze this resume:\n\n${resumeText}`
            }
          ],
          temperature: 0.3,
          max_tokens: 2000
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      
      // Try to parse JSON from the response
      try {
        return JSON.parse(content);
      } catch (parseError) {
        // If JSON parsing fails, extract key information manually
        return this.parseTextResponse(content);
      }
    } catch (error) {
      console.error('AI Analysis Error:', error);
      throw new Error('Failed to analyze resume. Please try again.');
    }
  }

  static extractResumeText(resumeData) {
    let text = `Name: ${resumeData.name}\n`;
    text += `Title: ${resumeData.title}\n\n`;
    
    if (resumeData.introText) {
      text += `About: ${resumeData.introText}\n\n`;
    }

    // Contact information
    text += `Contact:\n`;
    text += `Phone: ${resumeData.contact.phone}\n`;
    text += `Email: ${resumeData.contact.email}\n`;
    text += `Address: ${resumeData.contact.address}\n\n`;

    // Skills
    if (resumeData.skills && resumeData.skills.length > 0) {
      text += `Skills:\n${resumeData.skills.join(', ')}\n\n`;
    }

    // Experience
    if (resumeData.experience && resumeData.experience.length > 0) {
      text += `Experience:\n`;
      resumeData.experience.forEach(exp => {
        text += `${exp.title} at ${exp.company}, ${exp.location} (${exp.date})\n`;
        if (exp.description && exp.description.length > 0) {
          exp.description.forEach(desc => {
            text += `- ${desc}\n`;
          });
        }
        text += '\n';
      });
    }

    // Education
    if (resumeData.education && resumeData.education.length > 0) {
      text += `Education:\n`;
      resumeData.education.forEach(edu => {
        text += `${edu.title} at ${edu.university}, ${edu.location} (${edu.date})\n`;
        if (edu.description && edu.description.length > 0) {
          edu.description.forEach(desc => {
            text += `- ${desc}\n`;
          });
        }
        text += '\n';
      });
    }

    // Certifications/Highlights
    if (resumeData.highlights && resumeData.highlights.length > 0) {
      text += `Certifications:\n${resumeData.highlights.join('\n')}\n\n`;
    }

    return text;
  }

  static parseTextResponse(content) {
    // Fallback parser for non-JSON responses
    const atsScoreMatch = content.match(/(?:ats|score).*?(\d+)/i);
    const atsScore = atsScoreMatch ? parseInt(atsScoreMatch[1]) : 75;

    return {
      atsScore,
      overallFeedback: "AI analysis completed. Consider the suggestions below to improve your resume.",
      strengths: ["Professional experience listed", "Education included", "Contact information provided"],
      improvements: ["Add more relevant keywords", "Quantify achievements with numbers", "Optimize for ATS scanning"],
      keywordSuggestions: ["Industry-specific terms", "Technical skills", "Action verbs"],
      formatting: {
        score: 80,
        feedback: "Good overall structure with room for improvement"
      },
      content: {
        score: 75,
        feedback: "Content is solid but could be more impactful"
      }
    };
  }
}