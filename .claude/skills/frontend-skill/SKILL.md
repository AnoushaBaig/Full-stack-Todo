---
name: frontend-skill
description: Build frontend pages, components, layouts, and styling for modern web applications.
---

# Frontend Skill

## Instructions

1. **Page structure**
   - Build application pages with clear hierarchy
   - Use reusable layouts and templates
   - Implement routing and navigation correctly

2. **Component design**
   - Create reusable and composable UI components
   - Manage component state and props effectively
   - Separate logic from presentation where possible

3. **Layout and styling**
   - Design responsive layouts for all screen sizes
   - Apply consistent styling using modern CSS techniques
   - Use design systems or utility frameworks when appropriate

4. **User interaction**
   - Handle user interactions and UI state changes
   - Provide clear feedback for loading, error, and success states
   - Ensure accessibility and usability standards are met

## Best Practices
- Follow component-based architecture
- Reuse layouts and components to reduce duplication
- Build mobile-first and responsive designs
- Keep styling consistent and maintainable
- Optimize UI for performance and accessibility

## Example Structure
```tsx
export function PageLayout({ children }) {
  return (
    <main className="container">
      <header className="header">App Header</header>
      <section>{children}</section>
    </main>
  )
}
