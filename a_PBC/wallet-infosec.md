# Partisia Wallet Security Concern: Automatic Connection Without User Consent

## Responsible Disclosure Report

**Date:** March 30, 2025  
**Reporter:** PartiVotes Development Team  
**Product:** Partisia Blockchain Wallet (Browser Extension)  
**Environment:** Chrome Browser with Partisia Wallet Extension  
**Network:** Testnet  

## Summary

We have identified a potential security vulnerability in the Partisia Wallet browser extension where the wallet connects to websites without requiring explicit user consent. This behavior bypasses the expected security model of cryptocurrency wallets and could potentially lead to privacy leaks and unauthorized connections.

## Detailed Description

### Observed Behavior

1. We implemented standard wallet connection code in our application (PartiVotes) using `window.partisiawallet.connect()` method.
2. Upon page refresh, the wallet automatically connected to our application without displaying any permission prompt to the user.
3. The application was able to retrieve the wallet address and balance without any user interaction or approval.
4. Checking the "Connected Sites" section in the wallet extension settings did not show our application as a connected site, yet the connection was established.

### Expected Behavior

1. The first time a website attempts to connect to the Partisia Wallet, a permission prompt should be displayed.
2. The user should have to explicitly approve the connection before the website can access the wallet address.
3. The connected website should appear in the "Connected Sites" list in the wallet settings.

### Documentation Discrepancy

It's worth noting that we encountered significant discrepancies between the official Partisia documentation and the actual implementation requirements:

1. The official documentation recommends using the `partisia-sdk` npm package for wallet integration:
   ```javascript
   import PartisiaSdk from 'partisia-sdk'
   const sdk = new PartisiaSdk()
   await sdk.connect({...})
   ```

2. However, this approach fails in browser environments with the error:
   ```
   ERROR: Cannot find module 'crypto'
   ```

3. We determined that the `partisia-sdk` package is designed for Node.js environments, not browser applications. Our application is a pure browser-based application without a Node.js backend.

4. After research, we implemented the correct browser-based approach using `window.partisiawallet` which is injected by the browser extension. This is when we discovered the security issue.

5. The documentation does not clearly distinguish between server-side (Node.js) and client-side (browser) integration approaches, which could lead developers to implement incorrect or insecure patterns.

## Additional Findings (March 31, 2025)

During our security testing, we identified some important characteristics of the Partisia Wallet browser extension that make testing and verification challenging:

1. **Specific Initialization Pattern Required**: The wallet extension does not consistently inject itself into all web pages. It appears to require a specific initialization pattern similar to the one used in our main React application.

2. **Inconsistent Detection in Test Environments**: Despite multiple test approaches, the wallet was consistently detectable in our main application but not in isolated test pages.

3. **Main Application Initialization Flow**: Our main application uses the following initialization pattern:
   - Automatic initialization through `initializeWalletSDK()` when the wallet service is imported
   - A React context provider (`WalletProvider`) that checks connection status on component mount
   - React component lifecycle hooks that provide a structured environment for wallet detection

4. **Security Implications**: This behavior makes the wallet's security model less predictable. If the wallet selectively injects itself based on application structure or initialization patterns, it creates an inconsistent security boundary that's harder for developers to test against.

These findings reinforce our concern about the automatic connection behavior. Not only does the wallet connect without user consent when detected, but its detection pattern itself is inconsistent, making it harder to implement proper security controls.

## Security Implications

This behavior presents several security concerns:

1. **Privacy Violation:** Websites can identify users through their blockchain address without consent.
2. **Tracking Risk:** Malicious sites could track users across the web by detecting their wallet address.
3. **Phishing Vector:** Users have no opportunity to verify if they're connecting to a legitimate application.
4. **False Sense of Security:** Users may believe their wallet is protected by permission prompts that aren’t actually functioning.
5. **Documentation Confusion:** Developers following official documentation may implement incorrect patterns, potentially leading to additional security issues.

### Potential for Fund Theft on Mainnet

If this vulnerability exists on the mainnet version of the Partisia Wallet, it could be exploited to steal user funds through several attack vectors:

1. **Malicious Transaction Submission:**
   - An attacker could create a website that automatically connects to the user's wallet without consent
   - The site could immediately attempt to submit transactions to transfer funds to the attacker's address
   - While transaction signing would still require user approval, the attacker could use social engineering or UI manipulation to trick users into approving transactions they didn't intend to make

2. **Phishing with Pre-Connected Wallets:**
   - Attackers could create convincing clones of legitimate Partisia applications
   - When users visit these sites, their wallets would automatically connect without the usual security prompt
   - This lack of prompt removes a critical security indicator that users rely on to distinguish legitimate from malicious sites
   - Users may be more likely to trust a site that has "successfully connected" to their wallet

3. **Session Hijacking:**
   - If the wallet maintains connection state between page refreshes without proper validation
   - An attacker might be able to hijack these sessions through cross-site scripting or other web vulnerabilities
   - This could potentially allow execution of wallet operations without the standard security checks

4. **Mass Scanning for Vulnerable Users:**
   - Attackers could create automated systems that scan for Partisia Wallet users across the web
   - When a wallet is detected, the system could immediately deploy targeted attacks based on the user's address and balance
   - This could be particularly dangerous for high-value wallets that would be prime targets

5. **Approval Conditioning:**
   - If users become accustomed to their wallet connecting without prompts, they may become less vigilant about other security measures
   - This could lead to users approving transactions without proper scrutiny, creating a pathway for attackers to exploit this conditioned behavior

The combination of automatic connections and the lack of visibility in the "Connected Sites" list creates a particularly dangerous scenario where users may have no idea which sites have access to their wallet information.

## Testing Methodology and Findings

### Testing Attempts

We attempted to create a simple test page to replicate the security vulnerability, but encountered inconsistent behavior with the Partisia Wallet extension. The test page was deployed to the same domain as our main application (https://www.partivotes.xyz/test-hack.html), but the wallet extension was not detected by the test page despite being clearly installed and working in the browser.

This inconsistent detection behavior makes it difficult to create a reliable test case for the vulnerability. It suggests that the Partisia Wallet extension may:

1. Only inject itself into certain domains or pages based on unknown criteria
2. Use a non-standard detection mechanism that differs from conventional wallet extensions
3. Have specific security policies about when it becomes available to websites

### Implications

This inconsistent behavior adds another layer of concern to the security vulnerability:

1. It makes it harder for developers to test and verify wallet integration security
2. It creates unpredictable user experiences where the wallet may or may not be available
3. It complicates the responsible disclosure process as the issue cannot be easily demonstrated in isolation

Despite these testing challenges, the core security vulnerability remains: when the wallet is detected, it can connect automatically without user consent, which violates the expected security model of cryptocurrency wallets.

## Steps to Reproduce

1. Install the Partisia Wallet browser extension
2. Create or import a wallet (we tested with a fresh wallet that had never connected to any site)
3. Navigate to a website that implements the standard Partisia Wallet connection code using `window.partisiawallet.connect()`
4. Observe that the wallet connects without displaying a permission prompt
5. Verify that the website can access the wallet address and balance

## Questions for Investigation

1. Is this behavior specific to the testnet version of the wallet, or does it also affect mainnet?
2. Is there a configuration setting that might be causing this behavior?
3. Could this be related to a recent update to the wallet extension?
4. Are there any internal permission caches that might not be visible in the UI?
5. Why does the documentation not clearly distinguish between Node.js and browser integration approaches?

## Recommendations

1. Implement mandatory permission prompts for first-time connections to any website
2. Ensure all connected sites are visible in the wallet's settings
3. Add an option for users to require confirmation for every connection attempt
4. Review the wallet's connection handling code for any security bypasses
5. Update the official documentation to clearly distinguish between:
   - Node.js server-side integration using `partisia-sdk`
   - Browser-based integration using `window.partisiawallet`
6. Provide clear security guidelines for both approaches

## Impact Assessment

**Severity:** High  
**Exploitability:** Easy  
**Affected Users:** All Partisia Wallet users  
**Required Access:** Any website can potentially exploit this issue

## Contact Information

Please contact the PartiVotes development team at [contact information] for any questions or updates regarding this report.

We are reporting this issue in accordance with responsible disclosure practices and are available to assist with verification or testing of any fixes.

## Mainnet Testing Required

We have not yet verified if this issue affects the mainnet version of the Partisia Wallet. We recommend immediate testing to determine if mainnet users are also affected, as this would significantly increase the urgency of addressing this vulnerability.
