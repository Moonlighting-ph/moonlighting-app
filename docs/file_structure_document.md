## File Structure Document

In order to maintain organization and facilitate scalability of Moonlighting.ph, a structured file organization is essential. This will ensure ease of navigation, efficient coding practices, and streamline maintenance efforts. Below is a detailed structure of the project's files and directories:

### Root Directory

`moonlighting-ph/ │── public/ # Contains static assets such as images, icons, and static scripts │── src/ # Primary source code directory │ │── components/ # Reusable React components for the UI │ │── hooks/ # Custom React hooks for managing state and API calls │ │── layouts/ # Shared layout components (e.g., header, footer, navigation) │ │── pages/ # Next.js page components representing routes │ │ │── index.tsx # Home page of the application ("/") │ │ │── jobs/ # Pages related to job listings │ │ │ ├── index.tsx # Page listing all job postings ("/jobs") │ │ │ ├── [id].tsx # Dynamic page for individual job posts ("/jobs/:id") │ │ │── provider/ # Provider-specific page components │ │ │ ├── dashboard.tsx # Provider's dashboard view ("/provider/dashboard") │ │ │ ├── post-job.tsx # Job posting interface for providers ("/provider/post-job") │ │ │── moonlighter/ # Moonlighter-specific page components │ │ │ ├── dashboard.tsx # Moonlighter's dashboard view ("/moonlighter/dashboard") │ │ │ ├── my-applications.tsx # View of moonlighter's job applications ("/moonlighter/my-applications") │ │── api/ # API services module for handling external requests │ │── utils/ # Utility functions for common tasks like data formatting and validation │ │── styles/ # Global styling files and Tailwind CSS settings │── .env # Environment configuration file for sensitive information │── package.json # Node.js dependencies and project metadata │── tsconfig.json # TypeScript configuration file │── README.md # Documentation about the project setup and contribution`

### Key Directories Explained

*   **Public**: This directory holds assets that will be directly served by the server, such as images, fonts, and common JavaScript libraries that should not go through the build process.
*   **Components**: Houses modular UI components built using React. These components are designed to be reusable, promoting DRY (Don't Repeat Yourself) principles.
*   **Hooks**: This folder contains custom hooks to handle state management logic, interact with APIs, and facilitate data fetching and caching strategies.
*   **Layouts**: This directory includes layout components which wrap pages and may include shared site elements like headers, footers, or navigation bars.
*   **Pages**: Each file in this folder corresponds to a route managed by Next.js, with dynamic routing for job and application details.
*   **API**: Contains functions for making HTTP requests and handling API interaction logic, including fetching data from external services and processing responses.
*   **Utils**: Provides utility functions that are used throughout the application, such as data formatters, validators, and helper functions to simplify complex operations.
*   **Styles**: Contains global CSS files and Tailwind CSS configurations for theming and styling the application consistently.

### Contributing and Development

1.  **Environment Setup**: Place API keys and sensitive configurations in the `.env` file. Refer to `README.md` for more setup information.
2.  **Dependency Management**: Use `package.json` to manage project dependencies, scripts, and project metadata.
3.  **TypeScript Configuration**: Manage TypeScript settings via `tsconfig.json` to ensure consistent typing across the codebase.
4.  **Documentation**: Use `README.md` for maintaining project documentation and instructions for developers on setting up and contributing to the project.

This file structure is designed to maintain cleanliness and modularity, ensuring all team members can contribute effectively and new features are introduced without clutter.
