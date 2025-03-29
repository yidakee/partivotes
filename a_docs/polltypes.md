# PartiVotes Poll Types

This document outlines the different types of voting polls available in the PartiVotes application, their characteristics, use cases, and implementation details.

## Overview

PartiVotes currently supports three main types of polls:

1. **Single Choice** - Traditional voting where each voter selects exactly one option
2. **Multiple Choice** - Voters can select multiple options up to a configured maximum
3. **Ranked Choice** - Voters rank options in order of preference (partially implemented)

## Poll Types in Detail

### Single Choice

**Description:**  
The most common form of voting where each participant selects exactly one option from the available choices.

**Characteristics:**
- Each voter gets exactly one vote
- The option with the most votes wins
- Simple to understand and implement
- Results are easy to calculate and visualize

**Implementation:**
- Implemented using radio buttons, allowing only one selection
- Stored as a single option ID in the vote data
- The poll creator simply needs to provide a list of options

**Use Cases:**
- Binary decisions (Yes/No)
- Elections with single winners
- Simple preference polling
- When clear, decisive outcomes are needed

### Multiple Choice

**Description:**  
Allows voters to select multiple options up to a configurable maximum number of choices.

**Characteristics:**
- Voters can select from 0 up to N options (where N is configured by poll creator)
- Provides more nuanced data about voter preferences
- May result in multiple "winning" options
- Good for gathering comprehensive feedback

**Implementation:**
- Implemented using checkboxes to allow multiple selections
- The poll creator must specify the maximum number of selections allowed
- The UI dynamically disables additional options once the maximum is reached
- Stored as an array of option IDs in the vote data

**Use Cases:**
- Committee selection
- Feature prioritization
- Preference gathering
- "Select all that apply" surveys
- Approving multiple proposals simultaneously

### Ranked Choice

**Description:**  
Voters rank options in order of preference, allowing for a more nuanced expression of voter intention.

**Status: Partially Implemented**

**Characteristics:**
- Voters rank options (1st choice, 2nd choice, etc.)
- Eliminates the "spoiler effect" in elections
- Can find a consensus winner even in a crowded field
- More complex to explain and calculate results

**Implementation:**
- Currently marked in the UI as "not yet implemented"
- Will likely use a drag-and-drop interface for ranking options
- Will require a specialized algorithm for calculating winners (e.g., instant runoff)
- Will store an ordered array of option IDs representing the voter's ranking

**Use Cases:**
- Political elections with multiple candidates
- Decision-making where compromise is important
- When you want to avoid vote-splitting between similar options
- Determining a clear winner when there are many options

## Future Poll Types

Potential future additions to the voting system could include:

1. **Quadratic Voting** - Voters receive a budget of "voice credits" that they can allocate across options in a quadratic manner
2. **Approval Voting** - Voters can approve as many options as they wish (similar to multiple choice but without a maximum)
3. **Score/Range Voting** - Voters assign scores to each option within a defined range
4. **Delegated Voting** - Voters can delegate their voting power to trusted representatives

## Technical Implementation

Poll types are defined in the constants file at `src/utils/constants.js` and implemented primarily in:
- `PollCreate.jsx` for poll creation
- `VoteForm.jsx` for vote casting

The underlying data structure for different poll types is handled through appropriate form controls and validation rules specific to each type.
