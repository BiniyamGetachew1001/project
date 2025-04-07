# Admin Portal Access Instructions

This document provides instructions on how to access the admin portal for content management.

## Accessing the Admin Portal

The admin portal is hidden from the regular user interface to prevent unauthorized access. To access the admin portal:

1. Navigate to the following URL in your browser:
   ```
   http://localhost:5173/admin-portal
   ```

2. Enter the admin password when prompted:
   ```
   admin123
   ```

3. You will now have access to the admin portal where you can:
   - Add, edit, or delete book summaries
   - Add, edit, or delete business plans
   - View statistics and analytics

## Security Notes

- The admin password is currently set to a simple value for development purposes. In a production environment, you should use a strong, unique password.
- The authentication is currently handled client-side. In a production environment, you should implement server-side authentication with proper security measures.
- The admin portal URL should not be shared with regular users.

## Changing the Admin Password

To change the admin password, edit the `AdminAuth.tsx` file in the `src/components` directory:

```typescript
// Change this line to update the admin password
const adminPassword = 'your-new-password';
```

## Troubleshooting

If you encounter any issues accessing the admin portal:

1. Make sure you're using the correct URL
2. Clear your browser cache and cookies
3. Try using a different browser
4. Check the browser console for any error messages
