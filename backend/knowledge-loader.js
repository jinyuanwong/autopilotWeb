/**
 * Knowledge Base Loader for Planet Eco Services
 * This file loads the comprehensive knowledge from the scraped website
 */

const fs = require('fs');
const path = require('path');

// Load the full knowledge base
function loadKnowledgeBase() {
    try {
        const knowledgePath = '/Users/shanxiafeng/planet_eco_services_knowledge_base.md';
        const knowledge = fs.readFileSync(knowledgePath, 'utf8');
        return knowledge;
    } catch (error) {
        console.error('Error loading knowledge base:', error);
        return null;
    }
}

// Create a system prompt with the full knowledge
function createSystemPrompt() {
    const knowledge = loadKnowledgeBase();
    
    return `You are an AI assistant for Planet Eco Services, a UK-based company specializing in energy-efficient home improvements. 

HERE IS YOUR COMPREHENSIVE KNOWLEDGE BASE:

${knowledge}

IMPORTANT INSTRUCTIONS:
1. Use ONLY the information provided in the knowledge base above
2. Be accurate about eligibility criteria, especially for ECO4 scheme
3. Always mention the phone number (07765556558) for bookings
4. Encourage users to book free home assessments
5. Be helpful and professional
6. If asked about pricing, mention that assessments are free and grants are available
7. For specific technical questions not in the knowledge base, suggest calling the team

Remember: You have access to complete information about all services, ECO4 eligibility, application processes, and company details.`;
}

// For use in OpenAI API calls
function getEnhancedSystemPrompt() {
    return createSystemPrompt();
}

// For use in static knowledge base (extract key points)
function getStructuredKnowledge() {
    const knowledge = loadKnowledgeBase();
    
    // Parse and structure the knowledge for easier access
    const structured = {
        company: {
            name: "Planet Eco Services",
            phone: "07765556558",
            email: "info@planetecoservices.co.uk",
            address: "Units 2 & 2A Hendham Vale Industrial Park, Manchester M8 0AD"
        },
        services: {
            heating: "Free Central Heating Grants through ECO4 scheme",
            heatPumps: "Air Source Heat Pumps with up to £12,000 funding",
            insulation: "Internal Wall, Loft, and Room in Roof insulation",
            solar: "Solar Panel Grants (if mentioned in knowledge)"
        },
        eco4: {
            eligibility: [
                "Income-based Jobseeker's Allowance (JSA)",
                "Income-related Employment & Support Allowance (ESA)",
                "Income Support (IS)",
                "Pension Credit Guarantee Credit",
                "Working Tax Credit (WTC)",
                "Child Tax Credits (CTC)",
                "Universal Credit (UC)",
                "Housing Benefit",
                "Pension Credit Savings Credit",
                "Child Benefit (income thresholds apply)"
            ],
            process: "3 steps: Eligibility Check → Home Survey → Installation"
        }
    };
    
    return structured;
}

module.exports = {
    loadKnowledgeBase,
    createSystemPrompt,
    getEnhancedSystemPrompt,
    getStructuredKnowledge
};

// If running directly, print the system prompt
if (require.main === module) {
    console.log('=== ENHANCED SYSTEM PROMPT WITH FULL KNOWLEDGE ===\n');
    console.log(getEnhancedSystemPrompt());
}