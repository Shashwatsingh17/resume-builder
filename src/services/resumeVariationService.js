// AI Resume Variation Service
// Generates different versions of resumes optimized for specific roles or industries

export class ResumeVariationService {
  static async generateVariation(resumeData, variationType) {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
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
      case 'consulting':
        return this.createConsultingVariation(variation);
      case 'finance':
        return this.createFinanceVariation(variation);
      default:
        return this.createGeneralVariation(variation);
    }
  }

  static createTechnicalVariation(data) {
    // Adjust colors for technical roles
    data.colors.left.highlight = "#10b981";
    data.colors.right.highlight = "#10b981";
    
    // Update intro for technical focus
    data.introText = "Senior technologist with deep expertise in architecting scalable systems, implementing cutting-edge solutions, and leading technical innovation through advanced engineering practices and data-driven methodologies.";
    
    // Update job title for technical focus
    if (data.title.includes('Data Scientist')) {
      data.title = 'Senior Data Scientist & ML Engineer';
    }
    
    // Add technical skills if not present
    const technicalSkills = ['Docker', 'Kubernetes', 'AWS', 'Git', 'CI/CD', 'Microservices', 'Apache Spark', 'MLOps'];
    technicalSkills.forEach(skill => {
      if (!data.skills.some(s => s.toLowerCase().includes(skill.toLowerCase()))) {
        data.skills.splice(Math.floor(data.skills.length / 2), 0, skill);
      }
    });
    
    // Enhance experience descriptions with technical focus
    data.experience.forEach(exp => {
      exp.description = exp.description.map(desc => {
        if (desc.includes('Led a team')) {
          return desc.replace('Led a team', 'Led a cross-functional engineering team');
        }
        if (desc.includes('Developed and deployed')) {
          return desc.replace('Developed and deployed', 'Architected, developed, and deployed production-grade');
        }
        if (desc.includes('machine learning models')) {
          return desc.replace('machine learning models', 'scalable ML pipelines and deep learning models');
        }
        if (desc.includes('recommendation system')) {
          return desc.replace('recommendation system', 'real-time recommendation engine using collaborative filtering');
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
    data.introText = "Visionary leader with extensive experience building and scaling high-performing teams, driving strategic initiatives, and delivering transformational business results across diverse organizational environments.";
    
    // Update job title for leadership focus
    if (data.title.includes('Data Scientist')) {
      data.title = 'Head of Data Science & Analytics';
    }
    
    // Add leadership skills
    const leadershipSkills = ['Executive Leadership', 'Strategic Planning', 'Stakeholder Management', 'Change Management', 'Team Building', 'Performance Management'];
    leadershipSkills.forEach(skill => {
      if (!data.skills.some(s => s.toLowerCase().includes(skill.toLowerCase()))) {
        data.skills.unshift(skill);
      }
    });
    
    // Enhance experience descriptions with leadership focus
    data.experience.forEach(exp => {
      exp.description = exp.description.map(desc => {
        if (desc.includes('Led a team')) {
          return desc.replace('Led a team', 'Successfully led and mentored a diverse team');
        }
        if (desc.includes('20% increase')) {
          return desc.replace('20% increase', '20% increase while managing stakeholder expectations and driving organizational alignment');
        }
        if (desc.includes('Conducted')) {
          return desc.replace('Conducted', 'Strategically planned and conducted');
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
    data.introText = "Innovative data storyteller combining analytical rigor with creative problem-solving to transform complex datasets into compelling insights and user-centered solutions.";
    
    // Update job title for creative focus
    if (data.title.includes('Data Scientist')) {
      data.title = 'Data Scientist & Analytics Designer';
    }
    
    // Add creative skills
    const creativeSkills = ['Data Storytelling', 'Design Thinking', 'Data Visualization', 'User Experience Research', 'Creative Problem Solving', 'Visual Analytics'];
    creativeSkills.forEach(skill => {
      if (!data.skills.some(s => s.toLowerCase().includes(skill.toLowerCase()))) {
        data.skills.unshift(skill);
      }
    });
    
    // Enhance experience descriptions with creative focus
    data.experience.forEach(exp => {
      exp.description = exp.description.map(desc => {
        if (desc.includes('recommendation system')) {
          return desc.replace('recommendation system', 'intuitive recommendation system with user-centric design');
        }
        if (desc.includes('statistical analysis')) {
          return desc.replace('statistical analysis', 'innovative statistical analysis with compelling data visualizations');
        }
        if (desc.includes('data analysis')) {
          return desc.replace('data analysis', 'creative data exploration and storytelling');
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
    data.introText = "Results-driven data professional with exceptional client relationship skills and proven track record of translating complex analytics into revenue-generating business solutions.";
    
    // Update job title for sales focus
    if (data.title.includes('Data Scientist')) {
      data.title = 'Senior Data Scientist & Business Development';
    }
    
    // Add sales skills
    const salesSkills = ['Client Relationship Management', 'Business Development', 'Revenue Optimization', 'Stakeholder Engagement', 'Market Analysis', 'Presentation Skills'];
    salesSkills.forEach(skill => {
      if (!data.skills.some(s => s.toLowerCase().includes(skill.toLowerCase()))) {
        data.skills.unshift(skill);
      }
    });
    
    // Enhance experience descriptions with sales focus
    data.experience.forEach(exp => {
      exp.description = exp.description.map(desc => {
        if (desc.includes('20%')) {
          return desc.replace('20%', '25% while strengthening client relationships');
        }
        if (desc.includes('boosted cross-selling')) {
          return desc.replace('boosted cross-selling', 'drove strategic cross-selling initiatives');
        }
        if (desc.includes('Presented')) {
          return desc.replace('Presented', 'Delivered compelling presentations of');
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
    data.introText = "Agile data scientist thriving in fast-paced startup environments, with proven ability to wear multiple hats, move fast, and drive exponential growth through data-driven innovation.";
    
    // Update job title for startup focus
    if (data.title.includes('Data Scientist')) {
      data.title = 'Senior Data Scientist & Growth Lead';
    }
    
    // Add startup skills
    const startupSkills = ['Rapid Prototyping', 'Growth Hacking', 'Agile Development', 'Cross-functional Leadership', 'MVP Development', 'Startup Scaling'];
    startupSkills.forEach(skill => {
      if (!data.skills.some(s => s.toLowerCase().includes(skill.toLowerCase()))) {
        data.skills.unshift(skill);
      }
    });
    
    // Enhance experience descriptions with startup focus
    data.experience.forEach(exp => {
      exp.description = exp.description.map(desc => {
        if (desc.includes('Developed and deployed')) {
          return desc.replace('Developed and deployed', 'Rapidly prototyped and deployed');
        }
        if (desc.includes('Led a team')) {
          return desc.replace('Led a team', 'Built and led a lean, agile team');
        }
        if (desc.includes('20% increase')) {
          return desc.replace('20% increase', '20% increase in just 6 months');
        }
        return desc;
      });
    });
    
    return data;
  }

  static createConsultingVariation(data) {
    // Adjust colors for consulting roles
    data.colors.left.highlight = "#0ea5e9";
    data.colors.right.highlight = "#0ea5e9";
    
    // Update intro for consulting focus
    data.introText = "Strategic data consultant with expertise in delivering actionable insights to C-level executives, transforming business challenges into data-driven solutions across multiple industries.";
    
    // Update job title for consulting focus
    if (data.title.includes('Data Scientist')) {
      data.title = 'Senior Data Science Consultant';
    }
    
    // Add consulting skills
    const consultingSkills = ['Strategic Consulting', 'Executive Communication', 'Business Intelligence', 'Client Advisory', 'Industry Analysis', 'Solution Architecture'];
    consultingSkills.forEach(skill => {
      if (!data.skills.some(s => s.toLowerCase().includes(skill.toLowerCase()))) {
        data.skills.unshift(skill);
      }
    });
    
    // Enhance experience descriptions with consulting focus
    data.experience.forEach(exp => {
      exp.description = exp.description.map(desc => {
        if (desc.includes('Led a team')) {
          return desc.replace('Led a team', 'Advised executive leadership and led cross-functional teams');
        }
        if (desc.includes('recommendation system')) {
          return desc.replace('recommendation system', 'strategic recommendation framework for enterprise clients');
        }
        if (desc.includes('Presented')) {
          return desc.replace('Presented', 'Delivered executive-level presentations of');
        }
        return desc;
      });
    });
    
    return data;
  }

  static createFinanceVariation(data) {
    // Adjust colors for finance roles
    data.colors.left.highlight = "#059669";
    data.colors.right.highlight = "#059669";
    
    // Update intro for finance focus
    data.introText = "Quantitative finance professional specializing in risk modeling, algorithmic trading strategies, and financial data analysis with proven track record in delivering ROI-focused solutions.";
    
    // Update job title for finance focus
    if (data.title.includes('Data Scientist')) {
      data.title = 'Quantitative Analyst & Data Scientist';
    }
    
    // Add finance skills
    const financeSkills = ['Risk Modeling', 'Financial Analysis', 'Quantitative Research', 'Portfolio Optimization', 'Algorithmic Trading', 'Regulatory Compliance'];
    financeSkills.forEach(skill => {
      if (!data.skills.some(s => s.toLowerCase().includes(skill.toLowerCase()))) {
        data.skills.unshift(skill);
      }
    });
    
    // Enhance experience descriptions with finance focus
    data.experience.forEach(exp => {
      exp.description = exp.description.map(desc => {
        if (desc.includes('fraud detection')) {
          return desc.replace('fraud detection', 'financial fraud detection and risk assessment');
        }
        if (desc.includes('20% increase in revenue')) {
          return desc.replace('20% increase in revenue', '20% increase in revenue with improved risk-adjusted returns');
        }
        if (desc.includes('statistical analysis')) {
          return desc.replace('statistical analysis', 'quantitative financial analysis and risk modeling');
        }
        return desc;
      });
    });
    
    return data;
  }
  static createGeneralVariation(data) {
    // Slight adjustments for general optimization
    data.introText = "Accomplished data professional with strong analytical capabilities and proven track record of delivering impactful, data-driven solutions in collaborative, results-oriented environments.";
    
    // Enhance descriptions slightly
    data.experience.forEach(exp => {
      exp.description = exp.description.map(desc => {
        if (desc.includes('Led a team')) {
          return desc.replace('Led a team', 'Successfully led and collaborated with');
        }
        if (desc.includes('20% increase')) {
          return desc.replace('20% increase', '20% measurable increase');
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
      { name: 'Consulting Focus', value: 'consulting', description: 'Optimized for advisory roles and client-facing consulting positions' },
      { name: 'Finance Focus', value: 'finance', description: 'Specialized for quantitative finance and financial services roles' },
      { name: 'General Optimization', value: 'general', description: 'Balanced approach suitable for various roles' }
    ];
  }
}