# Contributing to Microsite Shop

First off, thank you for considering contributing to Microsite Shop! 🎉

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Commit Messages](#commit-messages)

## 📜 Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## 🤝 How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples**
- **Describe the behavior you observed and what you expected**
- **Include screenshots if possible**
- **Include your environment details** (OS, Node version, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Use a clear and descriptive title**
- **Provide a detailed description of the suggested enhancement**
- **Explain why this enhancement would be useful**
- **List any alternative solutions you've considered**

### Your First Code Contribution

Unsure where to begin? You can start by looking through these issues:

- `good-first-issue` - Issues that should only require a few lines of code
- `help-wanted` - Issues that are a bit more involved

## 🛠 Development Setup

### Prerequisites

- Node.js 18+
- PostgreSQL 15+
- Git

### Setup Steps

1. **Fork and clone the repository**

   ```bash
   git clone https://github.com/your-username/microsite-shop.git
   cd microsite-shop
   ```

2. **Install dependencies**

   ```bash
   # Install frontend dependencies
   npm install

   # Install backend dependencies
   cd backend
   npm install
   ```

3. **Set up environment variables**

   ```bash
   # Copy example files
   cp .env.example .env
   cp backend/.env.example backend/.env

   # Edit the files with your configuration
   ```

4. **Set up the database**

   ```bash
   cd backend
   npx prisma migrate dev
   npm run seed
   ```

5. **Start development servers**

   ```bash
   # Terminal 1: Backend
   cd backend
   npm run dev

   # Terminal 2: Frontend
   npm run dev
   ```

## 🔄 Pull Request Process

1. **Create a feature branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**

   - Write clean, readable code
   - Follow the coding standards
   - Add tests if applicable
   - Update documentation as needed

3. **Test your changes**

   ```bash
   npm run lint
   npm run test
   npm run build
   ```

4. **Commit your changes**

   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   ```

5. **Push to your fork**

   ```bash
   git push origin feature/your-feature-name
   ```

6. **Open a Pull Request**
   - Use a clear and descriptive title
   - Reference any related issues
   - Describe your changes in detail
   - Include screenshots for UI changes

### PR Review Process

- Maintainers will review your PR as soon as possible
- Address any requested changes
- Once approved, your PR will be merged

## 💻 Coding Standards

### TypeScript

- Use TypeScript for all new code
- Define proper types and interfaces
- Avoid using `any` when possible
- Use meaningful variable and function names

### React

- Use functional components with hooks
- Keep components small and focused
- Use proper prop types
- Follow React best practices

### Code Style

- Use 2 spaces for indentation
- Use semicolons
- Use single quotes for strings
- Use trailing commas in objects and arrays
- Run `npm run lint` before committing

### File Organization

```
src/
├── components/     # Reusable components
├── pages/         # Page components
├── contexts/      # React contexts
├── hooks/         # Custom hooks
├── lib/           # Utilities and helpers
└── types/         # TypeScript types
```

## 📝 Commit Messages

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```bash
feat(checkout): add shipping cost calculation
fix(cart): resolve item duplication issue
docs(readme): update installation instructions
style(admin): improve dashboard layout
refactor(api): optimize database queries
test(auth): add login flow tests
chore(deps): update dependencies
```

## 🧪 Testing

- Write tests for new features
- Ensure all tests pass before submitting PR
- Aim for good test coverage

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 📚 Documentation

- Update README.md if needed
- Add JSDoc comments for complex functions
- Update API documentation for backend changes
- Include inline comments for complex logic

## 🎨 UI/UX Guidelines

- Follow the existing design patterns
- Ensure responsive design (mobile-first)
- Test on different screen sizes
- Maintain accessibility standards
- Use shadcn/ui components when possible

## 🐛 Debugging

- Use browser DevTools for frontend debugging
- Use console.log sparingly (remove before committing)
- Check browser console for errors
- Review network requests in DevTools

## 📞 Getting Help

- Check existing documentation
- Search through existing issues
- Ask questions in GitHub Discussions
- Reach out to maintainers

## 🙏 Thank You!

Your contributions make this project better for everyone. We appreciate your time and effort! ❤️

---

**Happy Coding!** 🚀
