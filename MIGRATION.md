# Migration Guide: Moving to Monorepo Structure

This guide helps you migrate existing Next.js files to the new `apps/web` structure.

## Files to Move

Move the following directories and files from the project root to `apps/web/`:

### Directories
- `app/` → `apps/web/app/`
- `components/` → `apps/web/components/`
- `lib/` → `apps/web/lib/`
- `data/` → `apps/web/data/`
- `types/` → `apps/web/types/`
- `public/` → `apps/web/public/`

### Configuration Files (Already Created)
- `package.json` ✅ (already in `apps/web/`)
- `tsconfig.json` ✅ (already in `apps/web/`)
- `.eslintrc.json` ✅ (already in `apps/web/`)
- `next.config.js` ✅ (already in `apps/web/`)
- `tailwind.config.ts` ✅ (already in `apps/web/`)
- `postcss.config.js` ✅ (already in `apps/web/`)

### Files to Keep in Root
- `.gitignore`
- `.cursorrules`
- `.pre-commit-config.yaml`
- `ENGINEERING_STANDARDS.md`
- `package.json` (root workspace config)
- `README.md`

## Migration Steps

### Option 1: Manual Move (Recommended)

1. **Backup your work**: Commit all changes first
   ```bash
   git add .
   git commit -m "chore: prepare for monorepo migration"
   ```

2. **Move directories**:
   ```powershell
   # Windows PowerShell
   Move-Item -Path app -Destination apps\web\app
   Move-Item -Path components -Destination apps\web\components
   Move-Item -Path lib -Destination apps\web\lib
   Move-Item -Path data -Destination apps\web\data
   Move-Item -Path types -Destination apps\web\types
   Move-Item -Path public -Destination apps\web\public
   ```

3. **Update import paths** (if needed):
   - Check for any absolute imports that reference root-level paths
   - Update `tsconfig.json` paths if necessary (already configured for `apps/web`)

4. **Test the application**:
   ```bash
   cd apps/web
   npm install
   npm run dev
   ```

### Option 2: Using Git (Safer)

1. **Create a new branch**:
   ```bash
   git checkout -b monorepo-migration
   ```

2. **Move files using git**:
   ```bash
   git mv app apps/web/app
   git mv components apps/web/components
   git mv lib apps/web/lib
   git mv data apps/web/data
   git mv types apps/web/types
   git mv public apps/web/public
   ```

3. **Commit the changes**:
   ```bash
   git commit -m "refactor: move Next.js files to apps/web"
   ```

## After Migration

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Verify the setup**:
   ```bash
   npm run dev:web
   ```

3. **Run linting**:
   ```bash
   npm run lint:web
   ```

## Troubleshooting

### Import Errors

If you see import errors after moving files:

1. Check `apps/web/tsconfig.json` - paths should be:
   ```json
   "paths": {
     "@/*": ["./*"]
   }
   ```

2. Ensure imports use the `@/` alias:
   ```typescript
   import { something } from "@/lib/utils";
   ```

### Build Errors

If build fails:

1. Clear Next.js cache:
   ```bash
   rm -rf apps/web/.next
   ```

2. Reinstall dependencies:
   ```bash
   cd apps/web
   rm -rf node_modules
   npm install
   ```

## Next Steps

After migration is complete:

1. ✅ Test the application locally
2. ✅ Run pre-commit hooks: `pre-commit run --all-files`
3. ✅ Update CI/CD pipelines to use `apps/web` path
4. ✅ Update documentation references
