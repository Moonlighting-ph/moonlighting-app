# Moonlighting.ph App Flow Document

## Introduction

Moonlighting.ph is an online platform that connects understaffed hospitals, clinics, and home care services with pre-vetted medical professionals for on-demand shift coverage. The application is designed to simplify the process of shift hiring, application management, and secure in-app payments. Its main goal is to enable providers to quickly post and fill shifts while offering moonlighters flexible work opportunities. Both providers and moonlighters benefit from AI-driven job matching, real-time notifications, and an intuitive user experience governed by modern security standards and compliance requirements in the Philippines. This document explains every step of the user journey, ensuring that every feature, page, and action is clearly understood from start to finish.

## Onboarding and Sign-In/Sign-Up

## Main Dashboard or Home Page

After a successful sign-in, the user is directed to a personalized dashboard that serves as the command center for their activities. For providers, this dashboard displays an overview of active and pending shifts along with notifications for new applications or job matches. Essential sections such as job postings, payment status, upcoming shifts, and rating summaries are immediately visible. Moonlighters see a customized dashboard that includes a live job board with dynamic job listings that match their specialization and location preferences, an earnings summary, and notifications for upcoming shifts. Both dashboards include intuitive sidebars, top navigation bars, and widgets that allow quick access to important functions such as applying filters on the public job board, checking real-time updates, and navigating among various sub-features within the application.

## Detailed Feature Flows and Page Transitions

Providers entering the platform first go through a dedicated registration process, where they create an account and complete their profile setup. This includes adding details about their healthcare facility, specialization, and the types of shifts they offer. After registration, providers can explore job listings but must complete profile verification before posting job opportunities.

Once verified, providers gain access to the provider dashboard, where they can post job listings using an AI-assisted job form that pre-fills fields based on free-text inputs. Providers can tag shifts as urgent with an emergency fill indicator, schedule recurring shifts, and either manually invite moonlighters or allow the AI algorithm to suggest matches. Providers can then manage upcoming, pending, and past shifts through a dedicated shift management page, which also integrates a payment status dashboard displaying transactions processed via Stripe and PayMongo.

Moonlighters follow a separate flow that starts with a secure sign-up process. After registering, they can browse job listings but must complete their PRC License verification and profile setup before applying. The PRC License is verified automatically, and if verification fails, the system provides clear guidance on submitting additional documents for manual review via the administrative dashboard. Once verified, moonlighters finalize their profiles by selecting their specialization, specifying years of experience, and setting work preferences.

After profile completion, moonlighters gain full access to the job board, where listings are displayed in real time. They can apply with one click and use advanced search filters to refine results based on location, pay rate, and provider ratings. Additional tools include an earnings dashboard to track transaction history and upcoming payouts, as well as an application management page to monitor job application statuses.

Both providers and moonlighters receive real-time updates through in-app alerts, email, and SMS notifications to keep them engaged and informed throughout their experience.

Administrators have a separate workflow, starting with logging into the administrative dashboard. This panel allows platform moderators to manage user disputes, oversee manual PRC License verifications, and moderate content. An integrated waitlist management feature enables administrators to convert waitlisted users into active members by sending password reset emails. Additionally, administrators have access to detailed reporting tools that track job posting performance, application success rates, and payment statuses, helping maintain compliance and monitor the platform's overall health.

## Settings and Account Management

Both providers and moonlighters have access to an account management section designed to keep personal information up-to-date and secure. Users can manage their profiles by updating contact information, changing passwords, and adjusting notification preferences. Providers can customize their dashboard settings to manage shift postings and payment details, while moonlighters can update work preferences and connect calendar integrations with services like Google Calendar or Outlook. For billing and subscription settings, the application offers secure procedures that guide users through payment management and invoice tracking. These settings pages are interconnected with the main dashboard, ensuring that any adjustments bring users back into the continuous flow of shift management and job matching without disruptions.

## Error States and Alternate Paths

The application handles error states with clear, user-friendly messages that ensure users are never left in the dark. When a user enters invalid data during sign-up or job posting, error messages appear near the corresponding fields, along with hints on how to correct the mistake. In cases where network connectivity is lost or an external API (like PRC License Verification, Stripe, or PayMongo) fails, the system displays a friendly error page that offers the user an option to retry the action. If a moonlighter’s license verification fails, they are presented with detailed instructions on possible issues and a link to submit additional documents for manual review. The administrative dashboard is also equipped to manage these alternate paths by letting moderators guide users through dispute resolution and re-verification processes. Overall, fallbacks are in place to ensure that error handling does not break the user journey and that any interruptions are swiftly managed to restore normal functionality.

## Conclusion and Overall App Journey

The complete journey on [Moonlighting.ph](http://Moonlighting.ph) begins with an engaging onboarding process that clearly distinguishes between providers and moonlighters. After signing up, users can immediately explore job listings but must complete necessary verification steps before fully participating—providers need to complete their profile setup to post jobs, while moonlighters must verify their PRC License and finalize their profiles before applying.

Once verified, each user is directed to a tailored dashboard where they can access core features such as job postings, applications, and payment tracking. Providers benefit from an AI-assisted job form that simplifies shift postings, while moonlighters enjoy a streamlined application experience with intelligent job matching and real-time notifications.

Behind the scenes, administrators manage the platform through a comprehensive control panel, ensuring compliance, overseeing manual verifications, and resolving disputes. Whether users are actively booking shifts, applying for jobs, or monitoring platform performance, [Moonlighting.ph](http://Moonlighting.ph) is designed to be interconnected, intuitive, and responsive. This well-rounded approach ensures that daily operations run smoothly while also efficiently handling exceptional cases, creating a seamless and fulfilling experience for all users.
