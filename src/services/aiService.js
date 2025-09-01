// Mock AI service for demonstration purposes
// In a real application, you would integrate with actual AI services

export class AIService {
  static async analyzeResume(resumeData) {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const resumeText = this.extractResumeText(resumeData);
      const analysis = this.generateMockAnalysis(resumeData, resumeText);
      
      return analysis;
    } catch (error) {
      console.error('AI Analysis Error:', error);
      throw new Error('Failed to analyze resume. Please try again.');
    }
  }

  static generateMockAnalysis(resumeData, resumeText) {
    // Calculate scores based on resume content
    const hasPhoto = resumeData.showImage && resumeData.imageUrl;
    const experienceCount = resumeData.experience?.length || 0;
    const educationCount = resumeData.education?.length || 0;
    const skillsCount = resumeData.skills?.length || 0;
    const certificationsCount = resumeData.highlights?.length || 0;
    
    // Calculate ATS score based on content completeness
    let atsScore = 60; // Base score
    
    if (experienceCount >= 2) atsScore += 15;
    if (educationCount >= 1) atsScore += 10;
    if (skillsCount >= 5) atsScore += 10;
    if (certificationsCount >= 1) atsScore += 5;
    
    // Formatting score
    const formattingScore = hasPhoto ? 85 : 90; // Photos can sometimes hurt ATS parsing
    
    // Content score based on description quality
    let contentScore = 70;
    const hasQuantifiedAchievements = resumeText.includes('%') || resumeText.includes('$') || /\d+/.test(resumeText);
    if (hasQuantifiedAchievements) contentScore += 15;
    
    const strengths = [];
    const improvements = [];
    const keywordSuggestions = [];
    
    // Analyze strengths
    if (experienceCount >= 2) {
      strengths.push("Strong work experience with multiple positions");
    }
    if (skillsCount >= 8) {
      strengths.push("Comprehensive skills section with relevant technologies");
    }
    if (hasQuantifiedAchievements) {
      strengths.push("Includes quantified achievements and metrics");
    }
    if (resumeData.introText && resumeData.introText.length > 50) {
      strengths.push("Professional summary provides good overview");
    }
    
    // Analyze improvements
    if (experienceCount < 2) {
      improvements.push("Add more work experience entries to demonstrate career progression");
    }
    if (!hasQuantifiedAchievements) {
      improvements.push("Include specific numbers, percentages, and metrics to quantify your achievements");
    }
    if (skillsCount < 8) {
      improvements.push("Expand your skills section with more relevant technical and soft skills");
    }
    if (resumeData.experience?.some(exp => exp.description?.length < 2)) {
      improvements.push("Add more detailed descriptions for each role with specific accomplishments");
    }
    
    // Keyword suggestions based on role
    const title = resumeData.title?.toLowerCase() || '';
    if (title.includes('data')) {
      keywordSuggestions.push('Machine Learning', 'Data Analysis', 'Statistical Modeling', 'Python', 'SQL', 'Visualization');
    } else if (title.includes('developer') || title.includes('engineer')) {
      keywordSuggestions.push('Agile', 'CI/CD', 'Version Control', 'Testing', 'API Development', 'Cloud Computing');
    } else {
      keywordSuggestions.push('Leadership', 'Project Management', 'Strategic Planning', 'Team Collaboration', 'Problem Solving');
    }
    
    return {
      atsScore: Math.min(100, atsScore),
      overallFeedback: this.generateOverallFeedback(atsScore, experienceCount, skillsCount),
      strengths,
      improvements,
      keywordSuggestions,
      formatting: {
        score: formattingScore,
        feedback: hasPhoto 
          ? "Clean layout, though consider removing photo for better ATS compatibility"
          : "Excellent formatting that's ATS-friendly and easy to scan"
      },
      content: {
        score: Math.min(100, contentScore),
        feedback: hasQuantifiedAchievements
          ? "Strong content with quantified achievements"
          : "Good content foundation - consider adding more specific metrics and achievements"
      }
    };
  }
  
  static generateOverallFeedback(score, experienceCount, skillsCount) {
    if (score >= 85) {
      return "Excellent resume! Your resume demonstrates strong qualifications and is well-optimized for ATS systems. You have a competitive profile that should perform well in applicant tracking systems.";
    } else if (score >= 70) {
      return "Good foundation with room for enhancement. Your resume shows solid experience and skills. Focus on quantifying achievements and adding industry-specific keywords to improve ATS performance.";
    } else if (score >= 55) {
      return "Decent start that needs strengthening. Consider expanding your experience descriptions, adding more relevant skills, and including specific metrics to make your accomplishments more impactful.";
    } else {
      return "Significant improvements needed. Focus on adding more detailed work experience, expanding your skills section, and including quantified achievements to make your resume more competitive.";
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
}