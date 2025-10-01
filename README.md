**StarkMinds-Frontend**

StarkMinds-Frontend is the user interface for StarkMinds—a cutting-edge blockchain education platform built on Stellar. Developed with ReactJS/Next.js, this repository delivers a responsive, engaging, and intuitive experience for learners accessing interactive courses and real-time blockchain data.

**Features**  
• Interactive UI built with ReactJS/Next.js for dynamic content and fast navigation  
• Responsive design ensuring optimal experience on desktop, mobile, and tablet  
• Integration with the backend API for course management and user progress tracking  
• Clean, modular components adhering to modern UI/UX best practices  
• Performance optimization, code splitting, and client-side caching  
• Authentication flows integrated with JWT/OAuth

**Getting Started**

_Prerequisites:_  
• Node.js v18 or higher  
• pnpm (recommended) or npm

_Installation:_

1. Clone the repository:  
   `git clone https://github.com/your-username/strellerminds-frontend.git`
2. Change to the project directory:  
   `cd strellerminds-frontend`
3. Install dependencies:  
   `npm install`
4. **Environment Configuration**:  
   Copy the `.env.example` file to `.env` and configure your environment variables:

   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your actual values. The app will validate all required environment variables at startup and fail gracefully with clear error messages if any are missing or invalid.

   `pnpm install` (or `npm install`)

5. Create a `.env` file using the provided `.env.example` for environment-specific configurations.

6. Start the development server:  
   `pnpm run dev` (or `npm run dev`)

**Available Scripts**

• `pnpm run dev` - Start development server
• `pnpm run build` - Build for production
• `pnpm run start` - Start production server
• `pnpm run lint` - Run ESLint
• `pnpm run lint:fix` - Fix ESLint errors automatically
• `pnpm run format` - Format code with Prettier
• `pnpm run format:check` - Check code formatting
• `pnpm run type-check` - Run TypeScript type checking
• `pnpm run test` - Run tests (placeholder)
• `pnpm run ci` - Run all CI checks locally

**CI/CD Pipeline**

This project includes a comprehensive GitHub Actions workflow that automatically runs on pull requests and pushes to main/develop branches. The CI pipeline includes:

• **Type Check** - Runs `tsc --noEmit` to verify TypeScript types
• **Lint** - Runs ESLint to check code quality and style
• **Format Check** - Verifies code formatting with Prettier
• **Build** - Ensures the project builds successfully
• **Test** - Runs tests (when available)

All checks must pass before pull requests can be merged. You can run the same checks locally using:

```bash
pnpm run ci
```

**Contribution Guidelines**

• Fork the repository and create a feature branch.  
• Adhere to the established coding standards and use ESLint/Prettier for formatting.  
• Run `pnpm run ci` locally before submitting a pull request.
• Ensure UI changes are tested across different screen sizes.  
• Submit a pull request with clear documentation of your enhancements.
• All CI checks must pass before your PR can be merged.

**Contact**  
For any issues or suggestions, please open an issue or reach out to the project maintainers.
