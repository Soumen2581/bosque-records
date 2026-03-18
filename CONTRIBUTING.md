# Contributing to Bosque Records

Thank you for your interest in contributing to Bosque Records! This document provides guidelines and instructions for contributing.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Commit Messages](#commit-messages)
- [Pull Requests](#pull-requests)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Features](#suggesting-features)

## 📜 Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for everyone. We do not tolerate harassment or discrimination of any kind.

## 🚀 Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/cus_bosque-records.git
   cd cus_bosque-records
   ```
3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/TribeWarez/cus_bosque-records.git
   ```

## 💻 Development Setup

### Frontend (Vue 3 + Vite)

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run linting
npm run lint

# Type check
npm run type-check
```

### Backend (Bun + Prisma)

```bash
cd backend

# Install dependencies
bun install

# Generate Prisma client
bun run db:generate

# Push database schema
bun run db:push

# Seed with sample data (optional)
bun run db:seed

# Start development server
bun run dev
```

## 🔧 Making Changes

1. **Create a feature branch** from `develop`:
   ```bash
   git checkout develop
   git pull upstream develop
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following the coding standards:
   - Use TypeScript for all new code
   - Follow existing component patterns
   - Write meaningful variable and function names
   - Add comments for complex logic

3. **Test your changes**:
   ```bash
   # Run linting
   npm run lint

   # Run type checking
   npm run type-check

   # Build to ensure no errors
   npm run build
   ```

4. **Commit your changes** (see commit message guidelines below)

## 📝 Commit Messages

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

### Types

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation changes |
| `style` | Code style changes (formatting, semicolons, etc) |
| `refactor` | Code refactoring |
| `perf` | Performance improvements |
| `test` | Adding or updating tests |
| `chore` | Build process or auxiliary tool changes |
| `ci` | CI/CD changes |

### Examples

```bash
feat(releases): add track preview functionality
fix(admin): resolve form validation issue
docs(readme): update installation instructions
style(components): format code with Prettier
refactor(frontend): extract shared composables
```

## 🔄 Pull Requests

### Before Submitting

1. Ensure all tests pass
2. Update documentation if needed
3. Add yourself to the contributors list (if applicable)
4. Squash commits into logical units

### Pull Request Process

1. **Fill out the PR template** with:
   - Clear title and description
   - Link to related issues
   - Screenshots for UI changes
   - Test instructions

2. **Request review** from maintainers

3. **Make revisions** based on feedback

4. **Merge** once approved and CI passes

### PR Title Format

```
<type>(<scope>): <short description>

[optional detailed description and motivation]
```

## 🐛 Reporting Bugs

Before creating a bug report:

1. **Check existing issues** to avoid duplicates
2. **Update to the latest version** to see if resolved

### Bug Report Template

```markdown
## Bug Description
[Clear description of the bug]

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. See error

## Expected Behavior
[What should happen]

## Actual Behavior
[What happens instead]

## Environment
- Browser:
- OS:
- Node version:
- Package version:

## Screenshots
[If applicable]

## Additional Context
[Any other context]
```

## 💡 Suggesting Features

Before suggesting a feature:

1. **Check existing issues** and discussions
2. **Consider the project scope** - Is it aligned with our vision?

### Feature Request Template

```markdown
## Feature Summary
[Short summary of the feature]

## Problem/Motivation
[Explain the use case this feature addresses]

## Proposed Solution
[Describe your proposed solution]

## Alternatives Considered
[Any alternative solutions you've considered]

## Additional Context
[Mockups, examples, or other context]
```

## 📐 Coding Standards

### General
- Use TypeScript for all new code
- Follow ESLint rules (run `npm run lint`)
- Write self-documenting code with clear variable names
- Keep functions small and focused

### Vue Components
- Use Composition API with `<script setup>`
- Define prop types explicitly
- Emit events with typed payloads
- Use Pinia stores for shared state

### CSS/Tailwind
- Use Tailwind utility classes when possible
- Follow the existing theme colors
- Keep responsive design in mind

## ❓ Questions?

- Open an issue for general questions
- Check existing discussions
- Contact maintainers directly

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for making Bosque Records better! 🌿
