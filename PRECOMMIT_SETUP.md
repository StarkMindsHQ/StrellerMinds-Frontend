# Pre-commit Hooks Setup

This project uses Husky and lint-staged to ensure code quality and consistency before commits.

## What's Included

### 1. Husky Pre-commit Hooks

- **Pre-commit**: Runs lint-staged on staged files
- **Commit-msg**: Validates commit messages using commitlint

### 2. Lint-staged Configuration

Automatically runs on staged files:

- **JavaScript/TypeScript files** (`.js`, `.jsx`, `.ts`, `.tsx`):
  - ESLint with auto-fix
  - Prettier formatting
- **Other files** (`.json`, `.css`, `.md`):
  - Prettier formatting

### 3. Conventional Commits

- **Commitizen**: Interactive commit message creation
- **Commitlint**: Validates commit message format

## Usage

### Making Commits

Use the interactive commit tool for conventional commits:

```bash
npm run commit
# or
git cz
```

### Manual Linting and Formatting

```bash
# Lint and fix issues
npm run lint:fix

# Format all files
npm run format

# Check formatting without fixing
npm run format:check
```

### Commit Message Format

Follow conventional commit format:

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

**Types:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `build`: Build system changes
- `ci`: CI/CD changes
- `chore`: Maintenance tasks
- `revert`: Reverting changes

**Examples:**

```
feat(auth): add user login functionality
fix(ui): resolve button alignment issue
docs: update API documentation
chore: update dependencies
```

## How It Works

1. **Before Commit**: When you run `git commit`, Husky triggers the pre-commit hook
2. **Lint-staged**: Only processes staged files, running ESLint and Prettier
3. **Auto-fix**: ESLint automatically fixes fixable issues
4. **Format**: Prettier formats the code consistently
5. **Validation**: If there are unfixable errors, the commit is blocked
6. **Commit Message**: Commitlint validates the commit message format

## Benefits

- **Consistent Code Quality**: All code is linted and formatted before commits
- **Clean Git History**: Only properly formatted code enters the repository
- **Team Consistency**: Everyone follows the same coding standards
- **Conventional Commits**: Standardized commit messages for better changelog generation
- **Faster Reviews**: Less time spent on formatting issues in code reviews

## Troubleshooting

### Pre-commit Hook Fails

If the pre-commit hook fails:

1. Fix the linting errors shown in the output
2. Re-stage the files: `git add <file>`
3. Try committing again

### Bypassing Hooks (Not Recommended)

If you absolutely need to bypass hooks (emergency fixes):

```bash
git commit --no-verify -m "emergency fix"
```

### Updating Hooks

To update the pre-commit configuration, modify:

- `package.json` - lint-staged configuration
- `.husky/pre-commit` - pre-commit hook script
- `.husky/commit-msg` - commit message validation
- `commitlint.config.js` - commit message rules
