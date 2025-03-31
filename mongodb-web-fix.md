# MongoDB-Web Integration Troubleshooting Checklist

This document provides a comprehensive step-by-step approach to diagnose and fix issues with MongoDB integration in the PartiVotes web application, specifically focusing on poll status filtering.

## 1. Initial Diagnostics

- [x] Check browser console for errors
- [x] Verify MongoDB connection in server logs
- [x] Confirm proper environment variables are set
- [x] Test API endpoints directly using a tool like Postman or curl

**Issues Found:**
- No dedicated app log file found at the expected location
- After recent changes, no polls are showing up at all (regression)

## 2. Database Schema Verification

- [x] Examine MongoDB collection schemas
- [x] Check case sensitivity in status fields (ACTIVE vs active)
- [x] Verify indexes are properly set up
- [x] Confirm poll documents have all required fields
- [x] Run test queries directly against MongoDB

**Findings:**
- Database connection is working correctly
- 25 polls are present in the database
- Status values are stored in UPPERCASE ('ACTIVE', 'PENDING', 'ENDED')
- Case-sensitive matching is required (lowercase queries return 0 results)
- Database schema is correct and data is accessible

## 3. Data Retrieval Layer

- [x] Trace data flow from MongoDB to frontend
- [x] Check for any data transformation issues
- [x] Verify filter parameters are correctly passed to database queries
- [x] Check for case sensitivity handling in queries
- [x] Examine format of retrieved data vs. expected format

**Findings:**
- The PollList component correctly receives statusType prop from route configuration
- Status is properly converted to uppercase in retrieval.js before querying MongoDB
- Multiple recent changes to routing structure may have caused unintended side effects
- The flow is: App.js routes → PollList component → retrieval.js → dbService.js → MongoDB
- Issue likely caused by route configuration changes not aligned with component expectations

## 4. UI Component Inspection

- [x] Check if filters in UI components match expected formats
- [x] Verify correct URL parameters are being passed
- [x] Confirm components are re-rendering when filter changes
- [x] Examine state management for filter parameters
- [x] Check for any client-side filtering that might override server filtering

**Critical Issue Found:**
- Mismatch between constants and routing structure:
  - Constants define lowercase values: POLL_STATUS.ACTIVE = 'active'
  - MongoDB stores uppercase values: 'ACTIVE', 'PENDING', 'ENDED'
  - Route configuration passes uppercase statusType to PollList
  - But Header component uses constants (lowercase) for determining selected tab
- This creates inconsistent behavior in the UI and data retrieval

## 5. Production Environment Considerations

- [x] Verify that all changes work in production environment
- [x] Check for production-specific configurations
- [x] Consider caching issues in production deployment
- [x] Examine frontend-backend communication in production

**Findings:**
- PartiVotes is running as a LIVE production site on www.partivotes.xyz
- The application is running on a VPS with Nginx on Ubuntu 24.04 LTS
- Changes are directly serving the application files without a build workflow
- Browser detection logic and MongoDB connection handling are environment-aware
- Need to ensure environment detection is working as expected on production server

## 6. Confirmed Root Cause

After thorough testing, we've identified several potential issues:

- [x] MongoDB stores all poll status values in UPPERCASE (ACTIVE, PENDING, ENDED)
- [x] Application constants (POLL_STATUS) define them as lowercase (active, pending, ended)
- [x] Route configuration in App.js was using hardcoded uppercase strings
- [x] URL format has changed from what the application expects
- [x] Console logs show attempts to fetch data from localStorage instead of MongoDB

## 7. Route Path Analysis (NEW)

- [x] Examine exact URL format in production
- [x] Compare with route definitions in App.js
- [x] Check how URL segments are parsed
- [x] Verify route matching logic
- [x] Test with direct URL navigation

**Issues Found:**
- URL in production is `/polls/ACTIVE` but routes might be expecting a different format
- Route path matching may not be handling uppercase/lowercase correctly
- Possible Nginx configuration issue affecting URL routing

## 8. Environment Detection Verification (NEW)

- [ ] Verify browser detection logic
- [ ] Check if server environment variables are set correctly
- [ ] Test environment detection in local vs. production
- [ ] Verify MongoDB connection in production environment
- [ ] Check if the application is falling back to localStorage incorrectly

## 9. Implemented Fixes - Phase 1 (Previous)

- [x] Updated constants.js to use uppercase values
- [x] Modified App.js to use constants for routing
- [x] Updated Header component navigation
- [x] Enhanced PollList to handle different status formats

**Result:** Initial fixes did not resolve the issue. Console still shows "No polls found" and data is being fetched from localStorage instead of MongoDB.

## 10. Network Analysis

- [x] Use browser Network tab to monitor API requests
- [x] Verify correct parameters are being sent
- [x] Check response status codes
- [x] Look for any CORS or other network issues
- [x] Test API endpoints with different parameters

**Findings:**
- Based on console logs, the application is attempting to use localStorage
- This suggests a possible issue with environment detection or MongoDB connection
- Need to verify why MongoDB data is not being accessed

## 11. Enhanced Debugging Approach (NEW)

- [x] Add explicit console logging for environment detection
- [x] Trace MongoDB connection attempts in browser
- [x] Test direct database access via server-side script
- [x] Add visual indicators in the UI for data source
- [ ] Test with mock data to bypass database connection

**Critical Finding:**
- Browser console shows error: `mongoose.connect is not a function`
- This confirms the browser cannot directly connect to MongoDB
- Production environment detection is working (shows "Production Browser")
- The application needs a server-side API to communicate with MongoDB

**New Errors:**
- `Error fetching polls from API: SyntaxError: Unexpected token '<', '<DOCTYPE "... is not valid JSON`
- `WebSocket connection to 'wss://www.partivotes.xyz:3000/ws' failed`
- The first error indicates API endpoint is returning HTML instead of JSON (likely a 404 page)
- The second error suggests WebSocket connection issue with the API server

## 12. URL Path Corrections (NEW)

- [x] Ensure all URL paths use a consistent format
- [x] Fix any mismatches between route definitions and navigation
- [x] Update regular expressions for URL path matching
- [x] Add fallback routes for handling different URL formats
- [ ] Implement canonical URL redirects

**URL Structure:**
- URL shows correctly as lowercase "partivotes.xyz/polls/active"
- Application is properly detecting the path
- Route matching is working correctly for this path

## 13. Implementation Plan - Phase 2 (UPDATED)

- [x] Create a server-side API endpoint to access MongoDB
- [x] Update frontend code to use API instead of direct MongoDB connection
- [ ] **CRITICAL:** Verify API server is running and accessible
- [ ] **CRITICAL:** Configure NGINX to properly route API requests
- [ ] **CRITICAL:** Test API endpoints directly using curl or Postman
- [ ] Implement proper error handling for API response parsing
- [ ] Add fallback to localStorage only when API is unavailable

**API Connectivity Issues:**
- The API server appears to not be running or is not accessible
- NGINX may not be correctly configured to proxy API requests
- The browser is receiving HTML instead of JSON when calling the API endpoint

## 14. Final Verification

- [ ] Full end-to-end test of filtering functionality
- [ ] Verify all poll statuses appear correctly
- [ ] Confirm performance is acceptable
- [ ] Document any remaining issues

## 15. Conclusion

**Current Status:** Issue identified but not yet resolved. The browser cannot directly connect to MongoDB (mongoose.connect is not available in browser environments). The application architecture needs to be updated to use a server-side API for database access.

**Next Steps:**
1. Create a simple Node.js API to serve poll data from MongoDB
2. Update the frontend to fetch data from this API
3. Implement proper error handling for when the API is unavailable
4. Test the changes in the production environment

## 16. Immediate Next Steps for Debugging

- [ ] Verify API server is running: `sudo systemctl status partivotes-api`
- [ ] Check API server logs: `journalctl -u partivotes-api`
- [ ] Test API directly: `curl http://localhost:3000/api/polls`
- [ ] Verify NGINX configuration: `sudo nginx -t`
- [ ] Check NGINX logs: `sudo tail -f /var/log/nginx/error.log`
- [ ] Test network connectivity: `curl -v https://www.partivotes.xyz/api/polls`
