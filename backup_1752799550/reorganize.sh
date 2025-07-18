#!/bin/bash

# Clean Code File Reorganization Script
# Usage: ./reorganize.sh [--dry-run] [--force]

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DRY_RUN=false
FORCE=false
BACKUP_DIR="backup_$(date +%s)"

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --dry-run)
      DRY_RUN=true
      shift
      ;;
    --force)
      FORCE=true
      shift
      ;;
    -h|--help)
      echo "Usage: $0 [--dry-run] [--force]"
      echo "  --dry-run  Preview changes without making them"
      echo "  --force    Actually perform the reorganization"
      exit 0
      ;;
    *)
      echo "Unknown option $1"
      exit 1
      ;;
  esac
done

# Functions
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

check_prerequisites() {
    log_info "Checking prerequisites..."
    
    # Check if we're in a git repository
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        log_error "Not in a git repository. Please run 'git init' first for safety."
        exit 1
    fi
    
    # Check for uncommitted changes
    if [[ -n $(git status --porcelain) ]] && [[ "$FORCE" != true ]]; then
        log_warning "You have uncommitted changes. Please commit them first or use --force."
        git status --short
        exit 1
    fi
    
    # Check if utils directory exists
    if [[ ! -d "utils" ]]; then
        log_warning "No utils directory found. This script is designed for projects with a utils folder."
    fi
    
    log_success "Prerequisites check passed"
}

create_backup() {
    if [[ "$DRY_RUN" == true ]]; then
        log_info "Would create backup at $BACKUP_DIR"
        return
    fi
    
    log_info "Creating backup..."
    mkdir -p "$BACKUP_DIR"
    
    # Copy everything except node_modules, .git, and other backup folders
    rsync -av --exclude='node_modules' --exclude='.git' --exclude='backup_*' . "$BACKUP_DIR/"
    
    log_success "Backup created at $BACKUP_DIR"
}

create_directories() {
    log_info "Creating new directory structure..."
    
    local directories=(
        "lib"
        "lib/analytics"
        "lib/validation"
        "lib/calculations"
        "lib/transformers"
        "services"
        "services/storage"
        "services/device"
        "services/error"
        "formatters"
        "factories"
        "components/exercise"
        "components/motion"
        "components/forms"
        "hooks/setup"
        "hooks/workout"
        "hooks/device"
    )
    
    for dir in "${directories[@]}"; do
        if [[ "$DRY_RUN" == true ]]; then
            log_info "Would create directory: $dir"
        else
            mkdir -p "$dir"
            log_info "Created: $dir"
        fi
    done
    
    log_success "Directory structure ready"
}

move_file() {
    local from="$1"
    local to="$2"
    
    if [[ ! -f "$from" ]]; then
        log_warning "Skipping $from (not found)"
        return
    fi
    
    if [[ "$DRY_RUN" == true ]]; then
        log_info "Would move: $from → $to"
        return
    fi
    
    # Ensure destination directory exists
    mkdir -p "$(dirname "$to")"
    
    # Move the file
    mv "$from" "$to"
    log_info "Moved: $from → $to"
}

move_files() {
    log_info "Moving files to new locations..."
    
    # Define file moves as an array of "from:to" pairs
    local file_moves=(
        # Analytics
        "utils/analytics.ts:lib/analytics/workoutAnalytics.ts"
        
        # Validation
        "utils/validation.ts:lib/validation/userValidation.ts"
        "utils/workoutValidation.ts:lib/validation/workoutValidation.ts"
        
        # Calculations
        "utils/workoutUtils.ts:lib/calculations/workoutCalculations.ts"
        
        # Transformers
        "utils/dataTransformers.ts:lib/transformers/dataSerializer.ts"
        
        # Services
        "utils/errorHandling.ts:services/error/errorHandler.ts"
        "utils/permissions.ts:services/device/permissionService.ts"
        
        # Formatters
        "utils/formatters.ts:formatters/workoutFormatter.ts"
        
        # Factories
        "utils/idHelpers.ts:factories/idFactory.ts"
        "utils/userHelpers.ts:factories/userFactory.ts"
        
        # Components
        "components/workout/ExerciseCard.tsx:components/exercise/ExerciseCard.tsx"
        "components/workout/SetTracker.tsx:components/exercise/SetTracker.tsx"
        "components/workout/PhotoCapture.tsx:components/exercise/PhotoCapture.tsx"
        "components/workout/MotionDetector.tsx:components/motion/MotionDetector.tsx"
        "components/workout/AddExerciseModal.tsx:components/forms/AddExerciseModal.tsx"
        
        # Hooks
        "hooks/useWorkoutSetup.ts:hooks/setup/useWorkoutSetup.ts"
        "hooks/useExerciseForm.ts:hooks/workout/useExerciseForm.ts"
        "hooks/useMotionDetection.ts:hooks/device/useMotionDetection.ts"
    )
    
    for move in "${file_moves[@]}"; do
        IFS=':' read -r from to <<< "$move"
        move_file "$from" "$to"
    done
    
    log_success "Files moved"
}

create_index_files() {
    log_info "Creating index files..."
    
    if [[ "$DRY_RUN" == true ]]; then
        log_info "Would create index.ts files in new directories"
        return
    fi
    
    # lib/index.ts
    cat > lib/index.ts << EOF
export * from './analytics';
export * from './validation';
export * from './calculations';
export * from './transformers';
EOF
    
    # lib/analytics/index.ts
    cat > lib/analytics/index.ts << EOF
export * from './workoutAnalytics';
EOF
    
    # lib/validation/index.ts
    cat > lib/validation/index.ts << EOF
export * from './userValidation';
export * from './workoutValidation';
EOF
    
    # lib/calculations/index.ts
    cat > lib/calculations/index.ts << EOF
export * from './workoutCalculations';
EOF
    
    # lib/transformers/index.ts
    cat > lib/transformers/index.ts << EOF
export * from './dataSerializer';
EOF
    
    # services/index.ts
    cat > services/index.ts << EOF
export * from './storage';
export * from './device';
export * from './error';
EOF
    
    # services/device/index.ts
    cat > services/device/index.ts << EOF
export * from './permissionService';
EOF
    
    # services/error/index.ts
    cat > services/error/index.ts << EOF
export * from './errorHandler';
EOF
    
    # formatters/index.ts
    cat > formatters/index.ts << EOF
export * from './workoutFormatter';
EOF
    
    # factories/index.ts
    cat > factories/index.ts << EOF
export * from './idFactory';
export * from './userFactory';
EOF
    
    # components/exercise/index.ts
    cat > components/exercise/index.ts << EOF
export * from './ExerciseCard';
export * from './SetTracker';
export * from './PhotoCapture';
EOF
    
    # components/motion/index.ts
    cat > components/motion/index.ts << EOF
export * from './MotionDetector';
EOF
    
    # components/forms/index.ts
    cat > components/forms/index.ts << EOF
export * from './AddExerciseModal';
EOF
    
    # hooks/setup/index.ts
    cat > hooks/setup/index.ts << EOF
export * from './useWorkoutSetup';
EOF
    
    # hooks/workout/index.ts
    cat > hooks/workout/index.ts << EOF
export * from './useExerciseForm';
EOF
    
    # hooks/device/index.ts
    cat > hooks/device/index.ts << EOF
export * from './useMotionDetection';
EOF
    
    log_success "Index files created"
}

update_imports() {
    log_info "Updating import statements..."
    
    if [[ "$DRY_RUN" == true ]]; then
        log_info "Would update import statements in TypeScript files"
        return
    fi
    
    # Find all TypeScript files (excluding node_modules and backup)
    local ts_files=$(find . -name "*.ts" -o -name "*.tsx" | grep -v node_modules | grep -v backup_ | grep -v .git)
    
    for file in $ts_files; do
        update_imports_in_file "$file"
    done
    
    log_success "Import statements updated"
}

update_imports_in_file() {
    local file="$1"
    local temp_file=$(mktemp)
    local updated=false
    
    # Create sed patterns for common import updates
    sed -E \
        -e "s|from ['\"](\\.{1,2}/)*utils/analytics['\"]|from '../lib/analytics'|g" \
        -e "s|from ['\"](\\.{1,2}/)*utils/validation['\"]|from '../lib/validation'|g" \
        -e "s|from ['\"](\\.{1,2}/)*utils/workoutValidation['\"]|from '../lib/validation'|g" \
        -e "s|from ['\"](\\.{1,2}/)*utils/workoutUtils['\"]|from '../lib/calculations'|g" \
        -e "s|from ['\"](\\.{1,2}/)*utils/dataTransformers['\"]|from '../lib/transformers'|g" \
        -e "s|from ['\"](\\.{1,2}/)*utils/errorHandling['\"]|from '../services/error'|g" \
        -e "s|from ['\"](\\.{1,2}/)*utils/permissions['\"]|from '../services/device'|g" \
        -e "s|from ['\"](\\.{1,2}/)*utils/formatters['\"]|from '../formatters'|g" \
        -e "s|from ['\"](\\.{1,2}/)*utils/idHelpers['\"]|from '../factories'|g" \
        -e "s|from ['\"](\\.{1,2}/)*utils/userHelpers['\"]|from '../factories'|g" \
        -e "s|from ['\"](\\.{1,2}/)*utils/index['\"]|from '../lib'|g" \
        -e "s|from ['\"](\\.{1,2}/)*utils['\"]|from '../lib'|g" \
        "$file" > "$temp_file"
    
    # Check if file was actually changed
    if ! cmp -s "$file" "$temp_file"; then
        mv "$temp_file" "$file"
        log_info "Updated imports in: $file"
    else
        rm "$temp_file"
    fi
}

cleanup_empty_dirs() {
    log_info "Cleaning up empty directories..."
    
    if [[ "$DRY_RUN" == true ]]; then
        log_info "Would remove empty utils directory if empty"
        return
    fi
    
    # Remove utils directory if it's empty
    if [[ -d "utils" ]] && [[ -z "$(ls -A utils)" ]]; then
        rmdir utils
        log_info "Removed empty utils directory"
    fi
    
    # Remove any other empty directories
    find . -type d -empty -not -path "./node_modules*" -not -path "./.git*" -not -path "./backup_*" -delete 2>/dev/null || true
    
    log_success "Cleanup completed"
}

run_tests() {
    log_info "Running tests to verify everything works..."
    
    if [[ "$DRY_RUN" == true ]]; then
        log_info "Would run tests after reorganization"
        return
    fi
    
    # Check if package.json has test script
    if [[ -f "package.json" ]] && grep -q '"test"' package.json; then
        if npm test; then
            log_success "Tests passed!"
        else
            log_error "Tests failed! You may need to manually fix some imports."
            log_info "Check the backup at $BACKUP_DIR if you need to revert."
        fi
    else
        log_info "No test script found in package.json, skipping tests"
    fi
}

show_summary() {
    echo
    echo "=================================================================================="
    echo -e "${GREEN}🎉 Clean Code Reorganization Complete!${NC}"
    echo "=================================================================================="
    echo
    
    if [[ "$DRY_RUN" == true ]]; then
        echo "This was a dry run. No files were actually moved."
        echo "Run without --dry-run to perform the actual reorganization."
        return
    fi
    
    echo "📁 New Structure Created:"
    echo "  ├── lib/           (Core business logic)"
    echo "  ├── services/      (External integrations)"
    echo "  ├── formatters/    (Display logic)"
    echo "  ├── factories/     (Object creation)"
    echo "  └── components/    (Reorganized UI components)"
    echo
    echo "💾 Backup Location: $BACKUP_DIR"
    echo
    echo "🔍 Next Steps:"
    echo "  1. Run your tests: npm test"
    echo "  2. Check your app builds: npm run build"
    echo "  3. Fix any remaining import issues manually"
    echo "  4. Remove backup when satisfied: rm -rf $BACKUP_DIR"
    echo
    echo "🚨 If Something Went Wrong:"
    echo "  1. Restore from backup: cp -r $BACKUP_DIR/* ."
    echo "  2. Or use git: git checkout ."
    echo
}

# Main execution
main() {
    echo "🧹 Clean Code File Reorganizer (Shell Version)"
    echo "=============================================="
    echo
    
    if [[ "$DRY_RUN" == false ]] && [[ "$FORCE" == false ]]; then
        log_warning "This will reorganize your entire codebase!"
        log_warning "Make sure you have committed all changes to git first."
        echo
        echo "Usage:"
        echo "  $0 --dry-run    Preview changes without making them"
        echo "  $0 --force      Actually perform the reorganization"
        echo "  $0 --help       Show this help message"
        echo
        exit 1
    fi
    
    check_prerequisites
    create_backup
    create_directories
    move_files
    create_index_files
    update_imports
    cleanup_empty_dirs
    
    if [[ "$DRY_RUN" == false ]]; then
        run_tests
    fi
    
    show_summary
}

# Error handling
cleanup_on_error() {
    log_error "Script failed! Cleaning up..."
    
    if [[ "$DRY_RUN" == false ]] && [[ -d "$BACKUP_DIR" ]]; then
        log_info "Restoring from backup..."
        # Remove any partially created directories
        rm -rf lib services formatters factories 2>/dev/null || true
        
        # Restore from backup
        cp -r "$BACKUP_DIR"/* . 2>/dev/null || true
        log_info "Restored from backup"
    fi
    
    exit 1
}

# Set up error handling
trap cleanup_on_error ERR

# Run the main function
main "$@"