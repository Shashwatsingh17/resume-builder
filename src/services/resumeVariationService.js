// AI Resume Variation Service
// Generates different versions of resumes optimized for specific roles or industries

export class ResumeVariationService {
  static async generateVariation(resumeData, variationType) {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      const variation = this.createVariation(resumeData, variationType);
      return variation;
    } catch (error) {
      console.error('Resume Variation Error:', error);
      throw new Error('Failed to generate resume variation. Please try again.');
    }
  }

  static createVariation(originalData, variationType) {
    // Create a deep copy of the original data
    const variation = JSON.parse(JSON.stringify(originalData));
    
    switch (variationType) {
      case 'technical':
        return this.createTechnicalVariation(variation);
      case 'leadership':
        return this.createLeadershipVariation(variation);
      case 'creative':
        return this.createCreativeVariation(variation);
      case 'sales':
        return this.createSalesVariation(variation);
      case 'startup':
        return this.createStartupVariation(variation);
      default:
        return this.createGeneralVariation(variation);
    }
  }

  static createTechnicalVariation(data) {
    // Adjust colors for technical roles
    data.colors.left.highlight = "#10b981";
    data.colors.right.highlight = "#10b981";
    
    // Update intro for technical focus
    data.introText = "Passionate technologist with expertise in building scalable solutions and driving innovation through cutting-edge technologies and data-driven approaches.";
    
    // Enhance technical skills
    if (data.skills.includes('Python')) {
      const pythonIndex = data.skills.indexOf('Python');
      data.skills[pythonIndex] = 'Python (Advanced)';
    }
    
    // Add technical skills if not present
    const technicalSkills = ['Docker', 'Kubernetes', 'AWS', 'Git', 'CI/CD', 'Microservices'];
    technicalSkills.forEach(skill => {
      if (!data.skills.some(s => s.toLowerCase().includes(skill.toLowerCase()))) {
        data.skills.push(skill);
      }
    });
    
    // Enhance experience descriptions with technical focus
    data.experience.forEach(exp => {
      exp.description = exp.description.map(desc => {
        if (desc.includes('team')) {
          return desc.replace('team', 'cross-functional engineering team');
        }
        if (desc.includes('developed')) {
          return desc.replace('developed', 'architected and developed');
        }
        return desc;
      });
    });
    
    return data;
  }

  static createLeadershipVariation(data) {
    // Adjust colors for leadership roles
    data.colors.left.highlight = "#6366f1";
    data.colors.right.highlight = "#6366f1";
    
    // Update intro for leadership focus
    data.introText = "Strategic leader with proven track record of building high-performing teams, driving organizational growth, and delivering exceptional results in dynamic environments.";
    
    // Add leadership skills
    const leadershipSkills = ['Team Leadership', 'Strategic Planning', 'Stakeholder Management', 'Change Management', 'Mentoring'];
    leadershipSkills.forEach(skill => {
      if (!data.skills.some(s => s.toLowerCase().includes(skill.toLowerCase()))) {
        data.skills.unshift(skill);
      }
    });
    
    // Enhance experience descriptions with leadership focus
    data.experience.forEach(exp => {
      exp.description = exp.description.map(desc => {
        if (desc.includes('Led')) {
          return desc.replace('Led', 'Successfully led and mentored');
        }
        if (desc.includes('team')) {
          return desc.replace('team', 'diverse team of professionals');
        }
        if (desc.includes('developed')) {
          return desc.replace('developed', 'spearheaded the development of');
        }
        return desc;
      });
    });
    
    return data;
  }

  static createCreativeVariation(data) {
    // Adjust colors for creative roles
    data.colors.left.highlight = "#ec4899";
    data.colors.right.highlight = "#ec4899";
    
    // Update intro for creative focus
    data.introText = "Creative professional passionate about innovative design solutions, user experience, and bringing compelling visual stories to life through technology and artistry.";
    
    // Add creative skills
    const creativeSkills = ['Creative Problem Solving', 'Design Thinking', 'User Experience', 'Visual Communication', 'Innovation'];
    creativeSkills.forEach(skill => {
      if (!data.skills.some(s => s.toLowerCase().includes(skill.toLowerCase()))) {
        data.skills.unshift(skill);
      }
    });
    
    // Enhance experience descriptions with creative focus
    data.experience.forEach(exp => {
      exp.description = exp.description.map(desc => {
        if (desc.includes('developed')) {
          return desc.replace('developed', 'conceptualized and developed');
        }
        if (desc.includes('analysis')) {
          return desc.replace('analysis', 'creative analysis and insights');
        }
        return desc;
      });
    });
    
    return data;
  }

  static createSalesVariation(data) {
    // Adjust colors for sales roles
    data.colors.left.highlight = "#f59e0b";
    data.colors.right.highlight = "#f59e0b";
    
    // Update intro for sales focus
    data.introText = "Results-driven sales professional with exceptional relationship-building skills and a proven track record of exceeding targets and driving revenue growth.";
    
    // Add sales skills
    const salesSkills = ['Relationship Building', 'Negotiation', 'Revenue Growth', 'Client Management', 'Market Analysis'];
    salesSkills.forEach(skill => {
      if (!data.skills.some(s => s.toLowerCase().includes(skill.toLowerCase()))) {
        data.skills.unshift(skill);
      }
    });
    
    // Enhance experience descriptions with sales focus
    data.experience.forEach(exp => {
      exp.description = exp.description.map(desc => {
        if (desc.includes('20%')) {
          return desc.replace('20%', '25%');
        }
        if (desc.includes('revenue')) {
          return desc.replace('revenue', 'quarterly revenue and client satisfaction');
        }
        return desc;
      });
    });
    
    return data;
  }

  static createStartupVariation(data) {
    // Adjust colors for startup roles
    data.colors.left.highlight = "#8b5cf6";
    data.colors.right.highlight = "#8b5cf6";
    
    // Update intro for startup focus
    data.introText = "Versatile professional thriving in fast-paced startup environments, with expertise in wearing multiple hats and driving rapid growth through innovative solutions.";
    
    // Add startup skills
    const startupSkills = ['Rapid Prototyping', 'Cross-functional Collaboration', 'Agile Methodology', 'Growth Hacking', 'Adaptability'];
    startupSkills.forEach(skill => {
      if (!data.skills.some(s => s.toLowerCase().includes(skill.toLowerCase()))) {
        data.skills.unshift(skill);
      }
    });
    
    // Enhance experience descriptions with startup focus
    data.experience.forEach(exp => {
      exp.description = exp.description.map(desc => {
        if (desc.includes('developed')) {
          return desc.replace('developed', 'rapidly developed and iterated on');
        }
        if (desc.includes('team')) {
          return desc.replace('team', 'agile startup team');
        }
        return desc;
      });
    });
    
    return data;
  }

  static createGeneralVariation(data) {
    // Slight adjustments for general optimization
    data.introText = "Dedicated professional with strong analytical skills and a passion for delivering high-quality results in collaborative environments.";
    
    // Enhance descriptions slightly
    data.experience.forEach(exp => {
      exp.description = exp.description.map(desc => {
        if (desc.includes('Led')) {
          return desc.replace('Led', 'Successfully led');
        }
        return desc;
      });
    });
    
    return data;
  }

  static getVariationTypes() {
    return [
      { name: 'Technical Focus', value: 'technical', description: 'Emphasizes technical skills and engineering capabilities' },
      { name: 'Leadership Focus', value: 'leadership', description: 'Highlights management and leadership experience' },
      { name: 'Creative Focus', value: 'creative', description: 'Showcases creativity and design thinking' },
      { name: 'Sales Focus', value: 'sales', description: 'Optimized for sales and business development roles' },
      { name: 'Startup Focus', value: 'startup', description: 'Tailored for fast-paced startup environments' },
      { name: 'General Optimization', value: 'general', description: 'Balanced approach suitable for various roles' }
    ];
  }
}