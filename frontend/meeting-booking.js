// Meeting Booking Module for Planet Eco Services Chat
class MeetingBookingHandler {
    constructor() {
        // Google Form URL - Planet Eco Services Meeting Request Form
        this.googleFormBaseUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSeXu96HofJbD7-tGkrisCAhjipR3lgzR8YcudyT6vI7q3xOsA/viewform';
        
        // Form field IDs from your actual Google Form
        this.formFields = {
            name: 'entry.682685384',      // Full Name field
            email: 'entry.1238611864',    // Email field
            phone: 'entry.1407605129',    // Phone Number field
            service: 'entry.152986260',   // Service dropdown (Free Central Heating Grants, Air Source Heat Pumps, etc.)
            preferredTimeHour: 'entry.1449457478_hour',   // Preferred Time Hour
            preferredTimeMinute: 'entry.1449457478_minute', // Preferred Time Minute
            additionalDateYear: 'entry.378052578_year',    // Preferred Date Year
            additionalDateMonth: 'entry.378052578_month',  // Preferred Date Month
            additionalDateDay: 'entry.378052578_day',      // Preferred Date Day
            message: 'entry.1891032903'    // Additional Message field
        };
        
        this.bookingData = {};
        this.currentStep = null;
    }
    
    // Check if message contains booking intent
    detectBookingIntent(message) {
        const bookingKeywords = [
            'book', 'meeting', 'appointment', 'schedule', 'discuss',
            'consultation', 'assessment', 'survey', 'visit', 'talk',
            'speak', 'call', 'contact'
        ];
        
        const lowerMessage = message.toLowerCase();
        return bookingKeywords.some(keyword => lowerMessage.includes(keyword));
    }
    
    // Start booking flow
    startBookingFlow() {
        this.bookingData = {};
        this.currentStep = 'name';
        
        return {
            message: "Great! I'd be happy to help you schedule a consultation. Let me collect some information to book your meeting.\n\n👤 First, what's your full name?",
            isBookingFlow: true
        };
    }
    
    // Process booking step
    processBookingStep(userInput) {
        const steps = {
            name: {
                field: 'name',
                next: 'email',
                validation: (input) => input.length > 2,
                errorMessage: 'Please provide your full name.',
                nextQuestion: "📧 Thanks! What's your email address?"
            },
            email: {
                field: 'email',
                next: 'phone',
                validation: (input) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input),
                errorMessage: 'Please provide a valid email address.',
                nextQuestion: "📱 And your phone number?"
            },
            phone: {
                field: 'phone',
                next: 'service',
                validation: (input) => input.replace(/\D/g, '').length >= 10,
                errorMessage: 'Please provide a valid phone number.',
                nextQuestion: "🏠 Which service are you interested in?\n\n1️⃣ Free Central Heating Grants\n2️⃣ Air Source Heat Pumps\n3️⃣ Insulation (Loft/Wall/Room)\n4️⃣ General Energy Assessment\n\nPlease type the number or service name:"
            },
            service: {
                field: 'service',
                next: 'preferredDate',
                validation: (input) => true,
                process: (input) => {
                    // Map user input to exact dropdown values in Google Form
                    const services = {
                        '1': 'Free Central Heating Grants',
                        '2': 'Air Source Heat Pumps',
                        '3': 'Insulation Services',
                        '4': 'General Energy Assessment',
                        // Also handle text input
                        'free central heating grants': 'Free Central Heating Grants',
                        'air source heat pumps': 'Air Source Heat Pumps',
                        'insulation': 'Insulation Services',
                        'insulation services': 'Insulation Services',
                        'general energy assessment': 'General Energy Assessment',
                        'energy assessment': 'General Energy Assessment'
                    };
                    // Check if input is a number or text and return the appropriate service
                    const normalized = input.toLowerCase().trim();
                    return services[input] || services[normalized] || input;
                },
                nextQuestion: "📅 When would you prefer to meet? (e.g., 'next Monday', 'tomorrow afternoon', or specific date)"
            },
            preferredDate: {
                field: 'preferredDate',
                next: 'preferredTime',
                validation: (input) => input.length > 2,
                nextQuestion: "⏰ What time would you prefer? (e.g., '9am', '2:30pm', 'morning')"
            },
            preferredTime: {
                field: 'preferredTime',
                next: 'message',
                validation: (input) => input.length > 0,
                process: (input) => input || 'Flexible',
                nextQuestion: "💬 Is there anything specific you'd like to discuss or any questions you have?"
            },
            message: {
                field: 'message',
                next: 'confirmation',
                validation: (input) => true,
                process: (input) => input || 'No additional questions',
                nextQuestion: "📋 Ready to submit your booking? Type 'yes' to confirm and auto-submit, or 'review' to see the form first."
            },
            confirmation: {
                field: 'confirmation',
                next: 'complete',
                validation: (input) => {
                    const lower = input.toLowerCase();
                    return lower === 'yes' || lower === 'y' || lower === 'review' || lower === 'r';
                },
                errorMessage: "Please type 'yes' to confirm or 'review' to see the form first.",
                process: (input) => input.toLowerCase()
            }
        };
        
        const currentStepConfig = steps[this.currentStep];
        
        // Validate input
        if (!currentStepConfig.validation(userInput)) {
            return {
                message: currentStepConfig.errorMessage,
                isBookingFlow: true,
                continueFlow: true
            };
        }
        
        // Process and store data
        const processedValue = currentStepConfig.process 
            ? currentStepConfig.process(userInput) 
            : userInput;
        this.bookingData[currentStepConfig.field] = processedValue;
        
        // Move to next step
        if (currentStepConfig.next === 'complete') {
            return this.completeBooking();
        }
        
        this.currentStep = currentStepConfig.next;
        return {
            message: currentStepConfig.nextQuestion,
            isBookingFlow: true,
            continueFlow: true
        };
    }
    
    // Parse time string to hour and minute
    parseTime(timeStr) {
        if (!timeStr) return { hour: '', minute: '' };
        
        const match = timeStr.match(/(\d{1,2}):?(\d{0,2})\s*(am|pm)?/i);
        if (!match) return { hour: '', minute: '' };
        
        let hour = parseInt(match[1]);
        const minute = match[2] || '00';
        const period = match[3];
        
        if (period && period.toLowerCase() === 'pm' && hour !== 12) {
            hour += 12;
        } else if (period && period.toLowerCase() === 'am' && hour === 12) {
            hour = 0;
        }
        
        return { hour: hour.toString(), minute: minute.toString() };
    }
    
    // Parse date string to year, month, day
    parseDate(dateStr) {
        const today = new Date();
        const result = { year: '', month: '', day: '' };
        
        if (!dateStr) return result;
        
        // Handle "next monday", "tomorrow", etc.
        const lowerDate = dateStr.toLowerCase();
        let targetDate = new Date();
        
        if (lowerDate.includes('tomorrow')) {
            targetDate.setDate(today.getDate() + 1);
        } else if (lowerDate.includes('next')) {
            const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
            const dayMatch = days.findIndex(day => lowerDate.includes(day));
            if (dayMatch !== -1) {
                const daysUntilTarget = (dayMatch + 7 - today.getDay()) % 7 || 7;
                targetDate.setDate(today.getDate() + daysUntilTarget);
            }
        }
        
        result.year = targetDate.getFullYear().toString();
        result.month = (targetDate.getMonth() + 1).toString();
        result.day = targetDate.getDate().toString();
        
        return result;
    }
    
    // Complete booking and generate form link
    completeBooking() {
        // Parse date and time
        const parsedTime = this.parseTime(this.bookingData.preferredTime);
        const parsedDate = this.parseDate(this.bookingData.preferredDate);
        
        // Generate pre-filled Google Form URL
        const params = new URLSearchParams();
        
        // Add basic fields
        params.append(this.formFields.name, this.bookingData.name);
        params.append(this.formFields.email, this.bookingData.email);
        params.append(this.formFields.phone, this.bookingData.phone);
        
        // For service field - directly append without encoding (URLSearchParams handles it)
        if (this.bookingData.service) {
            params.append(this.formFields.service, this.bookingData.service);
        }
        
        // Add parsed date fields
        if (parsedDate.year) params.append(this.formFields.additionalDateYear, parsedDate.year);
        if (parsedDate.month) params.append(this.formFields.additionalDateMonth, parsedDate.month);
        if (parsedDate.day) params.append(this.formFields.additionalDateDay, parsedDate.day);
        
        // Add parsed time fields
        if (parsedTime.hour) params.append(this.formFields.preferredTimeHour, parsedTime.hour);
        if (parsedTime.minute) params.append(this.formFields.preferredTimeMinute, parsedTime.minute);
        
        // Add message field if exists
        if (this.bookingData.message && this.bookingData.message !== 'no') {
            params.append(this.formFields.message, this.bookingData.message);
        }
        
        const prefilledFormUrl = `${this.googleFormBaseUrl}?${params.toString()}`;
        
        // Create auto-submit URL by replacing viewform with formResponse
        const autoSubmitUrl = this.googleFormBaseUrl.replace('/viewform', '/formResponse') + '?' + params.toString();
        
        // Debug: Log the parameters being sent
        console.log('Form Parameters:', {
            name: this.bookingData.name,
            email: this.bookingData.email,
            phone: this.bookingData.phone,
            service: this.bookingData.service,
            date: `${parsedDate.year}-${parsedDate.month}-${parsedDate.day}`,
            time: `${parsedTime.hour}:${parsedTime.minute}`,
            url: prefilledFormUrl,
            autoSubmitUrl: autoSubmitUrl
        });
        
        // Check user's confirmation choice
        const userChoice = this.bookingData.confirmation;
        let summary = '';
        
        if (userChoice === 'yes' || userChoice === 'y') {
            // Auto-submit the form
            this.autoSubmitForm(autoSubmitUrl);
            
            summary = `
✅ **Meeting Request Submitted!**

👤 **Name:** ${this.bookingData.name}
📧 **Email:** ${this.bookingData.email}
📱 **Phone:** ${this.bookingData.phone}
🏠 **Service:** ${this.bookingData.service}
📅 **Preferred Date:** ${this.bookingData.preferredDate}
⏰ **Preferred Time:** ${this.bookingData.preferredTime || 'Flexible'}
💬 **Message:** ${this.bookingData.message || 'No additional questions'}

🎉 **Your booking has been automatically submitted!**
✅ You should receive a confirmation email shortly.

If you need to make changes, call us at 📞 07765556558.
            `;
        } else {
            // Show the form link for manual review
            summary = `
✅ **Meeting Request Ready:**

👤 **Name:** ${this.bookingData.name}
📧 **Email:** ${this.bookingData.email}
📱 **Phone:** ${this.bookingData.phone}
🏠 **Service:** ${this.bookingData.service}
📅 **Preferred Date:** ${this.bookingData.preferredDate}
⏰ **Preferred Time:** ${this.bookingData.preferredTime || 'Flexible'}
💬 **Message:** ${this.bookingData.message || 'No additional questions'}

[Click here to review and submit your booking](${prefilledFormUrl})

Your information has been pre-filled. Please review and click submit to confirm.

Or call us directly at 📞 07765556558.
            `;
        }
        
        // Reset booking flow
        this.currentStep = null;
        this.bookingData = {};
        
        return {
            message: summary,
            isBookingFlow: false,
            complete: true,
            formUrl: prefilledFormUrl
        };
    }
    
    // Auto-submit form using iframe or fetch
    async autoSubmitForm(submitUrl) {
        try {
            // Method 1: Using a hidden iframe (works around CORS)
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.name = 'submit-frame';
            document.body.appendChild(iframe);
            
            // Navigate the iframe to submit the form
            iframe.src = submitUrl;
            
            // Clean up after a delay
            setTimeout(() => {
                document.body.removeChild(iframe);
            }, 3000);
            
            console.log('Form auto-submitted successfully via iframe');
            
            // Method 2: Fallback using fetch (may be blocked by CORS)
            // Uncomment if you want to try both methods
            /*
            fetch(submitUrl, {
                method: 'GET',
                mode: 'no-cors'
            }).then(() => {
                console.log('Form submitted via fetch');
            }).catch(err => {
                console.log('Fetch submission failed (expected due to CORS):', err);
            });
            */
            
        } catch (error) {
            console.error('Auto-submit error:', error);
        }
    }
    
    // Cancel booking flow
    cancelBooking() {
        this.currentStep = null;
        this.bookingData = {};
        
        return {
            message: "No problem! If you'd like to book a meeting later, just let me know. You can also call us at 07765556558.",
            isBookingFlow: false
        };
    }
}

// Export for use in main chat
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MeetingBookingHandler;
}