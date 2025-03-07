# Moonlighting.ph – Project Requirements Document (PRD)

## 1. Project Overview

Moonlighting.ph is an online platform designed to effortlessly connect understaffed hospitals, clinics, and in-home care services with pre-vetted, on-demand medical professionals. The platform simplifies every step of the process—from shift hiring and application management to secure in-app payments—ensuring that providers quickly fill staffing vacancies while medical professionals (moonlighters) find well-paid, flexible work opportunities. By leveraging AI for job matching and automation, Moonlighting.ph aims to enhance efficiency and reduce administrative burdens in the fast-paced healthcare environment.

This platform is being built to address the challenge of last-minute staffing shortages in healthcare settings, ensuring that critical shifts are filled promptly with qualified personnel. Success for the project will be measured by user satisfaction among both providers and moonlighters, reliability of the real-time job board, secure and seamless integration of payment systems, and adherence to local healthcare compliance standards such as the Data Privacy Act (DPA) of 2012 and HITECH requirements.

## 2. In-Scope vs. Out-of-Scope

**In-Scope:**

*   A responsive public dashboard that displays live job listings with advanced search and filtering by specialization, location, pay rate, and provider ratings.
*   Provider account creation, profile setup, and a secure registration process with verification.
*   AI-assisted job posting that pre-fills forms based on free-text input.
*   Job posting capabilities including options for urgent/last-minute shifts, recurring shifts, instant booking, and manual moonlighter invitations.
*   Moonlighter registration with secure sign-up (including OAuth options), PRC License verification (with an automated process and a manual review appeal system), and detailed profile creation.
*   A one-click job application process for moonlighters along with advanced filtering.
*   AI-powered matching engine prioritizing specialization, location, provider ratings, work preferences, and availability.
*   Real-time notifications delivered via in-app alerts and SMS/email for shift updates, booking confirmations, and urgent job postings.
*   Integrations with Stripe and PayMongo for in-app payment processing and direct payouts.
*   An administrative dashboard for managing user disputes, content moderation, compliance issues, and waitlist management that automatically triggers password reset emails.
*   Calendar sync features (e.g., Google Calendar and Outlook) to help users automatically add scheduled shifts.

**Out-of-Scope (for Version 1):**

*   Multi-language support beyond English. Although future localization (e.g., Filipino) might be considered, the initial release will focus on English.
*   Advanced customization of user dashboards beyond what is required for basic shift management, notifications, and reporting.
*   Long-term scalability features beyond handling 1,000 concurrent users during peak times. Future iterations can address broader scalability as the platform grows.
*   Extensive reporting customizations and analytics beyond essential tracking of job posting performance, application success, and payment statuses. Detailed analytics enhancements might be developed in later phases.

## 3. User Flow

When a new provider visits [Moonlighting.ph](http://Moonlighting.ph), they are first prompted to create an account through a secure sign-up process using either traditional email and password or OAuth methods like Google, Facebook, or Apple. After registering, providers can immediately view job listings but must complete their profile setup before posting job listings. The profile setup includes adding key details such as specialization, work environment, and location. Once their details are verified, providers gain access to job posting features, including AI-assisted job descriptions that pre-fill forms based on simple free-text inputs. Providers can also tag shifts as urgent, schedule recurring shifts, and either directly book or manually invite moonlighters.

A new moonlighter starts by signing up using either traditional email and password or OAuth methods like Google, Facebook, or Apple. After signing up, they can explore job listings but must complete their PRC License verification and profile setup before applying for shifts. The PRC License is verified automatically, and if verification fails, the system provides clear guidance, allowing them to submit additional documents for manual review via the administrative dashboard. Once verified, moonlighters complete their profiles by selecting their specialization, specifying years of experience, and setting work preferences. After completing these steps, they can apply for shifts with one click, filter job opportunities, and receive real-time alerts about job matches, updates, and booking confirmations.

## 4. Core Features (Bullet Points)

*   **Public Dashboard & Job Board:**

    *   Live job listings updated in real-time.
    *   Advanced search with filters for specialization, location, pay rate, and provider ratings.
    *   Special sections for trending and urgent shifts.

*   **Provider Features:**

    *   Secure registration and profile setup.
    *   AI-assisted job posting that pre-fills forms based on free text.
    *   Options to tag shifts as "Emergency Fill Needed" and schedule recurring shifts.
    *   Automated AI-powered matching (using GPT-4) and manual invitation options.
    *   Instant booking of moonlighters.
    *   Dashboard to track upcoming, pending, and completed shifts along with payment status.

*   **Moonlighter Features:**

    *   Secure sign-up with email/password or OAuth (Google, Facebook, Apple).
    *   PRC License verification process (automated with manual appeal if needed).
    *   Detailed profile creation including specialization, professional experience, and work preferences.
    *   One-click apply for shifts with advanced filtering options.
    *   AI-driven job recommendations and real-time shift invitations.
    *   Earnings dashboard showing total pay, upcoming payouts, and transaction history.

*   **Payment and Integrations:**

    *   Integration with Stripe and PayMongo for secure payment processing and direct payouts.
    *   Email notifications and calendar sync support (Google Calendar/Outlook) for shift reminders.

*   **Administrative Dashboard:**

    *   Tools for moderators to manage user disputes, review manual PRC License appeals, and oversee content moderation.
    *   Functionality to manage waitlisted users by triggering registration and sending password reset emails.

*   **Real-Time Notifications:**

    *   In-app alerts partnered with SMS/email notifications for immediate shift updates, confirmations, and emergency jobs.

*   **Analytics & Reporting:**

    *   Detailed reports for providers and healthcare administrators tracking job posting performance, application success rates, and payment statuses.

## 5. Tech Stack & Tools

*   **Frontend:**

    *   Next.js 14
    *   TypeScript
    *   Tailwind CSS
    *   shadcn/UI
    *   Radix UI
    *   Lucide Icons

*   **Backend & Storage:**

    *   Supabase (for database, authentication, and storage)

*   **AI Integration:**

    *   GPT-4 for AI-powered job matching and AI-assisted job posting forms

*   **Payment & External Integration:**

    *   Stripe and PayMongo APIs for secure payment processing and direct payouts
    *   External integration with PRC License Portal for license verification

*   **Additional Tools & Plugins:**

    *   Integration with email services for real-time notifications and automated password resets
    *   Calendar sync integration with Google Calendar and Outlook
    *   Lovable (as an AI tool component to generate front-end and full-stack web apps)

## 6. Non-Functional Requirements

*   **Performance:**

    *   Optimize the platform to handle a minimum of 1,000 concurrent users during peak times.
    *   Aim for low latency in real-time job listing updates and notifications.

*   **Security & Compliance:**

    *   Ensure data is encrypted both in transit and at rest.
    *   Comply with regional security standards such as the Data Privacy Act (DPA) of 2012 and HITECH requirements.
    *   Implement stringent access controls and conduct regular security audits to safeguard healthcare and personal data.

*   **User Usability:**

    *   Maintain a clean, modern, and intuitive dashboard interface for a seamless user experience.
    *   Use smooth animations and transitions (e.g., fade-ins using keyframes) to enhance user interactions.
    *   Ensure responsive design across all devices (desktop and mobile).

*   **Scalability:**

    *   The system should be designed to scale seamlessly as user demand increases, with performance testing ensuring robustness under heavy load.

## 7. Constraints & Assumptions

*   The project is primarily targeted for users in the Philippines; therefore, regulatory compliance (HITECH and DPA 2012) is assumed to be sufficient for initial deployment.
*   PRC License verification is automated through an external portal; a manual review process will be available via the administrative dashboard in case of failure.
*   The platform is designed to handle around 1,000 concurrent users at peak times; future scalability enhancements may be required as the user base expands.
*   It is assumed that users have internet access and compatible devices to access a modern web application.
*   Email and SMS integrations assume that third-party services (e.g., SMTP servers, Twilio, Resend etc.) are available and remain stable.

## 8. Known Issues & Potential Pitfalls

*   **API Rate Limits & External Integration Issues:**

    *   The platform relies on external services like PRC License Verification, Stripe, and PayMongo. Limits or outages with these services could impact functionality. Mitigation includes implementing fallback mechanisms and clear error handling.

*   **Real-Time Data and Notifications:**

    *   Real-time updates demand a robust back-end infrastructure; any delays or failures in the notification system (in-app, SMS, or email) can cause user frustration. Rigorous performance testing and a responsive retry mechanism are recommended.

*   **Security & Data Compliance:**

    *   Handling sensitive personal and healthcare data means a breach or non-compliance can have severe consequences. Regular security audits, automated monitoring tools, and strict adherence to protocols must be enforced.

*   **AI Matching Accuracy:**

    *   AI-powered matching might occasionally pair users inaccurately due to input variations or insufficient data. Continuous improvements through machine learning feedback loops, periodic recalibration of matching criteria, and options for manual overrides can mitigate this issue.

*   **User Onboarding and Verification:**

    *   Complex registration and verification processes (especially for PRC License validation) may lead to potential user drop-off. Providing clear instructions, real-time assistance, and an efficient manual review process in the administrative dashboard will help smooth the onboarding journey.

This document serves as a detailed and unambiguous guide for the AI model to proceed with subsequent technical documentation. Every functionality, integration point, and design specification is captured here to facilitate a smooth development process for Moonlighting.ph.
