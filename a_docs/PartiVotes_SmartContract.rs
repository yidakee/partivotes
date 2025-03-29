#![no_std]

#[macro_use]
extern crate pbc_contract_codegen;
extern crate core;
extern crate alloc;

use alloc::string::String;
use alloc::vec::Vec;
use alloc::collections::BTreeMap;
use pbc_contract_common::address::Address;
use pbc_contract_common::context::ContractContext;
use pbc_contract_common::events::EventGroup;
use pbc_contract_common::sorted_vec_map::SortedVecMap;

/// State for the PartiVotes contract
#[state]
pub struct PartiVotesState {
    /// Contract owner
    pub owner: Address,
    
    /// Polls storage - mapping from poll_id to Poll
    pub polls: SortedVecMap<u64, Poll>,
    
    /// Poll ID counter
    pub poll_counter: u64,
    
    /// Votes storage - mapping from poll_id to voter to vote_option
    /// For public votes, the vote_option is stored
    /// For private votes, 0 is stored as a placeholder
    pub votes: SortedVecMap<u64, SortedVecMap<Address, u32>>,
    
    /// Private votes count - mapping from poll_id to option to count
    pub private_vote_counts: SortedVecMap<u64, SortedVecMap<u32, u32>>,
}

/// Poll structure
#[derive(ReadRPC, WriteRPC, CreateTypeSpec, Clone, PartialEq)]
pub struct Poll {
    /// Unique identifier
    pub id: u64,
    
    /// Poll creator
    pub creator: Address,
    
    /// Poll title
    pub title: String,
    
    /// Poll description
    pub description: String,
    
    /// Poll options
    pub options: Vec<String>,
    
    /// Creation timestamp
    pub created_at: u64,
    
    /// Expiration timestamp
    pub expires_at: u64,
    
    /// Whether the poll is active
    pub active: bool,
    
    /// Public vote counts - mapping from option_index to count
    pub public_vote_counts: SortedVecMap<u32, u32>,
}

/// Parameters for creating a poll
#[derive(ReadRPC, WriteRPC, CreateTypeSpec, Clone, PartialEq)]
pub struct CreatePollParams {
    /// Poll title
    pub title: String,
    
    /// Poll description
    pub description: String,
    
    /// Poll options
    pub options: Vec<String>,
    
    /// Expiration timestamp
    pub expires_at: u64,
}

/// Parameters for voting
#[derive(ReadRPC, WriteRPC, CreateTypeSpec, Clone, PartialEq)]
pub struct VoteParams {
    /// Poll ID
    pub poll_id: u64,
    
    /// Option index
    pub option_index: u32,
    
    /// Signature (for signature-based voting)
    pub signature: Option<String>,
}

/// Parameters for ending a poll
#[derive(ReadRPC, WriteRPC, CreateTypeSpec, Clone, PartialEq)]
pub struct EndPollParams {
    /// Poll ID
    pub poll_id: u64,
}

/// Parameters for getting poll results
#[derive(ReadRPC, WriteRPC, CreateTypeSpec, Clone, PartialEq)]
pub struct GetPollResultsParams {
    /// Poll ID
    pub poll_id: u64,
}

/// Initialize the contract
#[init]
pub fn initialize(context: ContractContext) -> (PartiVotesState, Vec<EventGroup>) {
    // Create initial state
    let state = PartiVotesState {
        owner: context.sender,
        polls: SortedVecMap::new(),
        poll_counter: 0,
        votes: SortedVecMap::new(),
        private_vote_counts: SortedVecMap::new(),
    };
    
    // Return state and empty events
    (state, Vec::new())
}

/// Create a new poll
#[action(shortname = 0x01)]
pub fn create_poll(
    context: ContractContext,
    mut state: PartiVotesState,
    params: CreatePollParams,
) -> (PartiVotesState, Vec<EventGroup>) {
    // Verify MPC payment (100 MPC)
    assert!(context.amount >= 100, "Insufficient MPC payment. 100 MPC required to create a poll.");
    
    // Validate input parameters
    assert!(!params.title.is_empty(), "Poll title cannot be empty");
    assert!(!params.description.is_empty(), "Poll description cannot be empty");
    assert!(params.options.len() >= 2, "Poll must have at least 2 options");
    assert!(params.expires_at > context.block_production_time, "Expiration time must be in the future");
    
    // Create new poll
    let poll_id = state.poll_counter;
    state.poll_counter += 1;
    
    // Initialize public vote counts
    let mut public_vote_counts = SortedVecMap::new();
    for i in 0..params.options.len() {
        public_vote_counts.insert(i as u32, 0);
    }
    
    // Create poll
    let poll = Poll {
        id: poll_id,
        creator: context.sender,
        title: params.title,
        description: params.description,
        options: params.options,
        created_at: context.block_production_time,
        expires_at: params.expires_at,
        active: true,
        public_vote_counts,
    };
    
    // Store poll
    state.polls.insert(poll_id, poll.clone());
    
    // Initialize private vote counts
    let mut option_counts = SortedVecMap::new();
    for i in 0..poll.options.len() {
        option_counts.insert(i as u32, 0);
    }
    state.private_vote_counts.insert(poll_id, option_counts);
    
    // Create event
    let mut events = Vec::new();
    let event_group = EventGroup::builder()
        .with_type("PollCreated")
        .with_data("poll_id", &poll_id)
        .with_data("creator", &context.sender)
        .with_data("title", &poll.title)
        .build();
    events.push(event_group);
    
    (state, events)
}

/// Vote with signature (public)
#[action(shortname = 0x02)]
pub fn vote_with_signature(
    context: ContractContext,
    mut state: PartiVotesState,
    params: VoteParams,
) -> (PartiVotesState, Vec<EventGroup>) {
    // Verify poll exists
    assert!(state.polls.contains_key(&params.poll_id), "Poll not found");
    
    // Get poll
    let mut poll = state.polls.get(&params.poll_id).unwrap().clone();
    
    // Verify poll is active
    assert!(poll.active, "Poll is not active");
    assert!(context.block_production_time < poll.expires_at, "Poll has expired");
    
    // Verify option index is valid
    assert!(params.option_index < poll.options.len() as u32, "Invalid option index");
    
    // Verify user hasn't voted already
    if !state.votes.contains_key(&params.poll_id) {
        state.votes.insert(params.poll_id, SortedVecMap::new());
    }
    
    let poll_votes = state.votes.get_mut(&params.poll_id).unwrap();
    assert!(!poll_votes.contains_key(&context.sender), "Already voted in this poll");
    
    // Verify signature (in a real implementation, this would validate the signature)
    // For simplicity, we're skipping actual signature verification in this example
    
    // Record vote
    poll_votes.insert(context.sender, params.option_index);
    
    // Update public vote count
    let current_count = *poll.public_vote_counts.get(&params.option_index).unwrap_or(&0);
    poll.public_vote_counts.insert(params.option_index, current_count + 1);
    
    // Update poll
    state.polls.insert(params.poll_id, poll.clone());
    
    // Create event
    let mut events = Vec::new();
    let event_group = EventGroup::builder()
        .with_type("PublicVoteCast")
        .with_data("poll_id", &params.poll_id)
        .with_data("voter", &context.sender)
        .with_data("option", &params.option_index)
        .build();
    events.push(event_group);
    
    (state, events)
}

/// Vote with MPC (private)
#[action(shortname = 0x03)]
pub fn vote_with_mpc(
    context: ContractContext,
    mut state: PartiVotesState,
    params: VoteParams,
) -> (PartiVotesState, Vec<EventGroup>) {
    // Verify MPC payment (100 MPC)
    assert!(context.amount >= 100, "Insufficient MPC payment. 100 MPC required for private voting.");
    
    // Verify poll exists
    assert!(state.polls.contains_key(&params.poll_id), "Poll not found");
    
    // Get poll
    let poll = state.polls.get(&params.poll_id).unwrap().clone();
    
    // Verify poll is active
    assert!(poll.active, "Poll is not active");
    assert!(context.block_production_time < poll.expires_at, "Poll has expired");
    
    // Verify option index is valid
    assert!(params.option_index < poll.options.len() as u32, "Invalid option index");
    
    // Verify user hasn't voted already
    if !state.votes.contains_key(&params.poll_id) {
        state.votes.insert(params.poll_id, SortedVecMap::new());
    }
    
    let poll_votes = state.votes.get_mut(&params.poll_id).unwrap();
    assert!(!poll_votes.contains_key(&context.sender), "Already voted in this poll");
    
    // Record vote (only record that user voted, not what they voted for)
    poll_votes.insert(context.sender, 0); // Use 0 as a placeholder
    
    // Update private vote count
    if !state.private_vote_counts.contains_key(&params.poll_id) {
        let mut option_counts = SortedVecMap::new();
        for i in 0..poll.options.len() {
            option_counts.insert(i as u32, 0);
        }
        state.private_vote_counts.insert(params.poll_id, option_counts);
    }
    
    let option_counts = state.private_vote_counts.get_mut(&params.poll_id).unwrap();
    let current_count = *option_counts.get(&params.option_index).unwrap_or(&0);
    option_counts.insert(params.option_index, current_count + 1);
    
    // Create event
    let mut events = Vec::new();
    let event_group = EventGroup::builder()
        .with_type("PrivateVoteCast")
        .with_data("poll_id", &params.poll_id)
        .with_data("voter", &context.sender)
        .build();
    events.push(event_group);
    
    (state, events)
}

/// End a poll early
#[action(shortname = 0x04)]
pub fn end_poll(
    context: ContractContext,
    mut state: PartiVotesState,
    params: EndPollParams,
) -> (PartiVotesState, Vec<EventGroup>) {
    // Verify poll exists
    assert!(state.polls.contains_key(&params.poll_id), "Poll not found");
    
    // Get poll
    let mut poll = state.polls.get(&params.poll_id).unwrap().clone();
    
    // Verify sender is poll creator
    assert!(poll.creator == context.sender, "Only poll creator can end poll");
    
    // Verify poll is active
    assert!(poll.active, "Poll is already ended");
    
    // End poll
    poll.active = false;
    
    // Update poll
    state.polls.insert(params.poll_id, poll);
    
    // Create event
    let mut events = Vec::new();
    let event_group = EventGroup::builder()
        .with_type("PollEnded")
        .with_data("poll_id", &params.poll_id)
        .with_data("ended_by", &context.sender)
        .build();
    events.push(event_group);
    
    (state, events)
}

/// Get all polls
#[action(shortname = 0x05)]
pub fn get_polls(
    _context: ContractContext,
    state: PartiVotesState,
) -> (PartiVotesState, Vec<EventGroup>) {
    // Create event with all polls
    let mut events = Vec::new();
    let event_group = EventGroup::builder()
        .with_type("PollsList")
        .with_data("polls", &state.polls.values().collect::<Vec<_>>())
        .build();
    events.push(event_group);
    
    (state, events)
}

/// Get poll details
#[action(shortname = 0x06)]
pub fn get_poll(
    _context: ContractContext,
    state: PartiVotesState,
    params: GetPollResultsParams,
) -> (PartiVotesState, Vec<EventGroup>) {
    // Verify poll exists
    assert!(state.polls.contains_key(&params.poll_id), "Poll not found");
    
    // Get poll
    let poll = state.polls.get(&params.poll_id).unwrap();
    
    // Create event with poll details
    let mut events = Vec::new();
    let event_group = EventGroup::builder()
        .with_type("PollDetails")
        .with_data("poll", poll)
        .build();
    events.push(event_group);
    
    (state, events)
}

/// Get poll results
#[action(shortname = 0x07)]
pub fn get_poll_results(
    _context: ContractContext,
    state: PartiVotesState,
    params: GetPollResultsParams,
) -> (PartiVotesState, Vec<EventGroup>) {
    // Verify poll exists
    assert!(state.polls.contains_key(&params.poll_id), "Poll not found");
    
    // Get poll
    let poll = state.polls.get(&params.poll_id).unwrap();
    
    // Get public vote counts
    let public_votes = &poll.public_vote_counts;
    
    // Get private vote counts
    let private_votes = if state.private_vote_counts.contains_key(&params.poll_id) {
        state.private_vote_counts.get(&params.poll_id).unwrap()
    } else {
        // If no private votes, create empty map
        let mut empty_map = SortedVecMap::new();
        for i in 0..poll.options.len() {
            empty_map.insert(i as u32, 0);
        }
        &empty_map
    };
    
    // Create event with poll results
    let mut events = Vec::new();
    let event_group = EventGroup::builder()
        .with_type("PollResults")
        .with_data("poll_id", &params.poll_id)
        .with_data("public_votes", public_votes)
        .with_data("private_votes", private_votes)
        .build();
    events.push(event_group);
    
    (state, events)
}

/// Check if user has voted in a poll
#[action(shortname = 0x08)]
pub fn has_voted(
    context: ContractContext,
    state: PartiVotesState,
    params: GetPollResultsParams,
) -> (PartiVotesState, Vec<EventGroup>) {
    // Verify poll exists
    assert!(state.polls.contains_key(&params.poll_id), "Poll not found");
    
    // Check if user has voted
    let has_voted = if state.votes.contains_key(&params.poll_id) {
        state.votes.get(&params.poll_id).unwrap().contains_key(&context.sender)
    } else {
        false
    };
    
    // Create event with result
    let mut events = Vec::new();
    let event_group = EventGroup::builder()
        .with_type("HasVoted")
        .with_data("poll_id", &params.poll_id)
        .with_data("user", &context.sender)
        .with_data("has_voted", &has_voted)
        .build();
    events.push(event_group);
    
    (state, events)
}
