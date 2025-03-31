#!/usr/bin/env python3
"""
PartiVotes Database Manager CLI Tool

This tool provides administrative capabilities for managing the PartiVotes MongoDB database,
including backup, restore, listing polls, and deleting polls.
"""

import os
import sys
import json
import argparse
import datetime
import time
import curses
import csv
import shutil
from pymongo import MongoClient
from bson import ObjectId
from dotenv import load_dotenv
from tabulate import tabulate

# Load environment variables from .env file
load_dotenv()

# MongoDB connection settings
MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017/partivotes")
MONGODB_USER = os.getenv("MONGODB_USER")
MONGODB_PASS = os.getenv("MONGODB_PASS")

# Backup directory
BACKUP_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "backups")

# Maximum number of backups to keep (for rotation)
MAX_BACKUPS = 10

# Export directory
EXPORT_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "exports")

# Color definitions for the CLI interface
COLORS = {
    "HEADER": "\033[95m",
    "BLUE": "\033[94m",
    "GREEN": "\033[92m",
    "YELLOW": "\033[93m",
    "RED": "\033[91m",
    "ENDC": "\033[0m",
    "BOLD": "\033[1m",
    "UNDERLINE": "\033[4m"
}

class JSONEncoder(json.JSONEncoder):
    """Custom JSON encoder to handle MongoDB ObjectId and dates"""
    def default(self, obj):
        if isinstance(obj, ObjectId):
            return str(obj)
        if isinstance(obj, datetime.datetime):
            return obj.isoformat()
        return json.JSONEncoder.default(self, obj)

class DBManager:
    """Database manager for PartiVotes MongoDB"""
    
    def __init__(self):
        """Initialize the database connection"""
        self.client = None
        self.db = None
        self.connect()
        
    def connect(self):
        """Connect to MongoDB"""
        try:
            # Prepare connection options
            options = {}
            if MONGODB_USER and MONGODB_PASS:
                options["username"] = MONGODB_USER
                options["password"] = MONGODB_PASS
                
            # Connect to MongoDB
            self.client = MongoClient(MONGODB_URI, **options)
            
            # Get database name from URI
            db_name = MONGODB_URI.split("/")[-1]
            self.db = self.client[db_name]
            
            # Test connection
            self.client.admin.command('ping')
            print(f"{COLORS['GREEN']}✅ Connected to MongoDB database: {db_name}{COLORS['ENDC']}")
            
            return True
        except Exception as e:
            print(f"{COLORS['RED']}❌ Error connecting to MongoDB: {e}{COLORS['ENDC']}")
            return False
    
    def check_health(self):
        """Check database health and connection status"""
        try:
            # Check if connection is active
            if not self.client:
                print(f"{COLORS['RED']}❌ Not connected to MongoDB.{COLORS['ENDC']}")
                return False
            
            # Ping the database to check connection
            self.client.admin.command('ping')
            
            # Get database stats
            db_stats = self.db.command("dbStats")
            
            # Get collection stats
            polls_count = self.db.polls.count_documents({})
            votes_count = self.db.votes.count_documents({})
            
            # Print health information
            print(f"{COLORS['GREEN']}✅ MongoDB connection is healthy{COLORS['ENDC']}")
            print(f"\n{COLORS['BOLD']}Database Statistics:{COLORS['ENDC']}")
            print(f"  Database Size: {db_stats['dataSize'] / (1024*1024):.2f} MB")
            print(f"  Storage Size: {db_stats['storageSize'] / (1024*1024):.2f} MB")
            print(f"  Number of Collections: {len(db_stats['collections'])}")
            
            print(f"\n{COLORS['BOLD']}Collection Statistics:{COLORS['ENDC']}")
            print(f"  Polls: {polls_count} documents")
            print(f"  Votes: {votes_count} documents")
            
            # Check for any polls with issues (missing required fields)
            invalid_polls = list(self.db.polls.find({"$or": [
                {"title": {"$exists": False}},
                {"options": {"$exists": False}},
                {"status": {"$exists": False}}
            ]}))
            
            if invalid_polls:
                print(f"\n{COLORS['YELLOW']}⚠️ Found {len(invalid_polls)} polls with missing required fields.{COLORS['ENDC']}")
                for poll in invalid_polls:
                    print(f"  Poll ID: {poll['_id']} - Missing fields")
            
            return True
        except Exception as e:
            print(f"{COLORS['RED']}❌ Database health check failed: {e}{COLORS['ENDC']}")
            return False
    
    def list_polls(self, poll_type=None, status=None, limit=10, creator=None, search_term=None, sort_by="createdAt", sort_order=-1):
        """List polls with enhanced filtering options"""
        try:
            # Make sure we're connected to the database
            if not self.client:
                if not self.connect():
                    print(f"{COLORS['RED']}❌ Not connected to MongoDB. Please check your connection.{COLORS['ENDC']}")
                    return []
            
            # Prepare filter
            filter_query = {}
            if poll_type:
                filter_query["type"] = poll_type
            if status:
                filter_query["status"] = status
            if creator:
                filter_query["creator"] = {"$regex": creator, "$options": "i"}
            if search_term:
                filter_query["$or"] = [
                    {"title": {"$regex": search_term, "$options": "i"}},
                    {"description": {"$regex": search_term, "$options": "i"}}
                ]
            
            # Get polls with sorting
            try:
                polls = list(self.db.polls.find(filter_query).sort(sort_by, sort_order).limit(limit))
            except Exception as e:
                print(f"{COLORS['RED']}❌ Error querying database: {e}{COLORS['ENDC']}")
                # Try with default sort if the specified sort field doesn't exist
                polls = list(self.db.polls.find(filter_query).limit(limit))
            
            if not polls:
                print(f"{COLORS['YELLOW']}No polls found matching the criteria.{COLORS['ENDC']}")
                return []
            
            # Prepare table data
            table_data = []
            for i, poll in enumerate(polls, 1):
                # Add index for easier selection
                created_at = poll.get("createdAt", "N/A")
                if created_at != "N/A":
                    try:
                        created_at = created_at.strftime("%Y-%m-%d %H:%M")
                    except:
                        # Handle case where createdAt is not a datetime object
                        created_at = str(created_at)
                
                table_data.append([
                    i,  # Add index number for easier selection
                    str(poll["_id"]),
                    poll.get("title", "No Title"),
                    poll.get("type", "Unknown"),
                    poll.get("status", "Unknown"),
                    poll.get("totalVotes", 0),
                    poll.get("creator", "Unknown"),
                    created_at
                ])
            
            # Print table
            headers = ["#", "ID", "Title", "Type", "Status", "Votes", "Creator", "Created At"]
            print(tabulate(table_data, headers=headers, tablefmt="grid"))
            print(f"Total: {len(polls)} polls")
            
            return polls
        except Exception as e:
            print(f"{COLORS['RED']}❌ Error listing polls: {e}{COLORS['ENDC']}")
            return []
    
    def view_poll(self, poll_id):
        """View details of a specific poll"""
        try:
            # Convert string ID to ObjectId
            obj_id = ObjectId(poll_id)
            
            # Get poll
            poll = self.db.polls.find_one({"_id": obj_id})
            
            if not poll:
                print(f"{COLORS['YELLOW']}Poll with ID {poll_id} not found.{COLORS['ENDC']}")
                return None
            
            # Print poll details
            print("\n" + "="*50)
            print(f"{COLORS['BOLD']}Poll ID:{COLORS['ENDC']} {poll_id}")
            print(f"{COLORS['BOLD']}Title:{COLORS['ENDC']} {poll['title']}")
            print(f"{COLORS['BOLD']}Description:{COLORS['ENDC']} {poll['description']}")
            print(f"{COLORS['BOLD']}Type:{COLORS['ENDC']} {poll['type']}")
            print(f"{COLORS['BOLD']}Status:{COLORS['ENDC']} {poll['status']}")
            print(f"{COLORS['BOLD']}Creator:{COLORS['ENDC']} {poll['creator']}")
            print(f"{COLORS['BOLD']}Total Votes:{COLORS['ENDC']} {poll['totalVotes']}")
            print(f"{COLORS['BOLD']}Created:{COLORS['ENDC']} {poll['createdAt'].strftime('%Y-%m-%d %H:%M') if 'createdAt' in poll else 'N/A'}")
            print(f"{COLORS['BOLD']}Start Date:{COLORS['ENDC']} {poll['startDate'].strftime('%Y-%m-%d %H:%M') if 'startDate' in poll else 'N/A'}")
            print(f"{COLORS['BOLD']}End Date:{COLORS['ENDC']} {poll['endDate'].strftime('%Y-%m-%d %H:%M') if 'endDate' in poll else 'N/A'}")
            
            # Print options
            print(f"\n{COLORS['BOLD']}Options:{COLORS['ENDC']}")
            for i, option in enumerate(poll["options"], 1):
                print(f"  {i}. {option['text']} - {option['votes']} votes")
            
            # Get votes for this poll
            votes = list(self.db.votes.find({"pollId": obj_id}))
            print(f"\n{COLORS['BOLD']}Votes:{COLORS['ENDC']} {len(votes)}")
            
            print("="*50 + "\n")
            
            return poll
        except Exception as e:
            print(f"{COLORS['RED']}❌ Error viewing poll: {e}{COLORS['ENDC']}")
            return None
    
    def delete_poll(self, poll_id, force=False):
        """Delete a poll and its votes"""
        try:
            # Make sure we're connected to the database
            if not self.client:
                if not self.connect():
                    print(f"{COLORS['RED']}❌ Not connected to MongoDB. Please check your connection.{COLORS['ENDC']}")
                    return False
            
            # Validate poll_id format
            if not poll_id or not isinstance(poll_id, str) or len(poll_id) != 24:
                print(f"{COLORS['YELLOW']}Invalid poll ID format: {poll_id}{COLORS['ENDC']}")
                return False
                
            try:
                # Convert string ID to ObjectId
                obj_id = ObjectId(poll_id)
            except Exception as e:
                print(f"{COLORS['YELLOW']}Invalid poll ID: {poll_id} - {str(e)}{COLORS['ENDC']}")
                return False
            
            # Get poll
            poll = self.db.polls.find_one({"_id": obj_id})
            
            if not poll:
                print(f"{COLORS['YELLOW']}Poll with ID {poll_id} not found.{COLORS['ENDC']}")
                return False
            
            # Confirm deletion
            if not force:
                print(f"\n{COLORS['BOLD']}Poll:{COLORS['ENDC']} {poll.get('title', 'Untitled')}")
                print(f"{COLORS['BOLD']}ID:{COLORS['ENDC']} {poll_id}")
                print(f"{COLORS['BOLD']}Total Votes:{COLORS['ENDC']} {poll.get('totalVotes', 0)}")
                confirm = input(f"\n{COLORS['RED']}⚠️ Are you sure you want to delete this poll? This action cannot be undone. (y/N):{COLORS['ENDC']} ")
                if confirm.lower() != "y":
                    print(f"{COLORS['YELLOW']}Deletion cancelled.{COLORS['ENDC']}")
                    return False
            
            # Delete votes first
            try:
                votes_result = self.db.votes.delete_many({"pollId": obj_id})
                votes_deleted = votes_result.deleted_count
            except Exception as e:
                print(f"{COLORS['YELLOW']}Warning: Error deleting votes: {e}. Continuing with poll deletion.{COLORS['ENDC']}")
                votes_deleted = 0
            
            # Delete poll
            try:
                poll_result = self.db.polls.delete_one({"_id": obj_id})
                
                if poll_result.deleted_count > 0:
                    print(f"{COLORS['GREEN']}✅ Poll deleted successfully.{COLORS['ENDC']}")
                    print(f"{COLORS['GREEN']}✅ {votes_deleted} votes deleted.{COLORS['ENDC']}")
                    return True
                else:
                    print(f"{COLORS['RED']}❌ Failed to delete poll. No documents matched the query.{COLORS['ENDC']}")
                    return False
            except Exception as e:
                print(f"{COLORS['RED']}❌ Error deleting poll: {e}{COLORS['ENDC']}")
                return False
            
        except Exception as e:
            print(f"{COLORS['RED']}❌ Error in delete_poll: {e}{COLORS['ENDC']}")
            return False
    
    def delete_all_polls(self, force=False):
        """Delete all polls and votes"""
        try:
            # Count polls and votes
            poll_count = self.db.polls.count_documents({})
            vote_count = self.db.votes.count_documents({})
            
            # Confirm deletion
            if not force:
                print(f"\n{COLORS['RED']}⚠️ This will delete ALL {poll_count} polls and {vote_count} votes.{COLORS['ENDC']}")
                confirm = input("Are you sure you want to proceed? This action cannot be undone. (y/N): ")
                if confirm.lower() != "y":
                    print(f"{COLORS['YELLOW']}Deletion cancelled.{COLORS['ENDC']}")
                    return False
            
            # Delete votes first
            votes_result = self.db.votes.delete_many({})
            
            # Delete polls
            polls_result = self.db.polls.delete_many({})
            
            print(f"{COLORS['GREEN']}✅ {polls_result.deleted_count} polls deleted.{COLORS['ENDC']}")
            print(f"{COLORS['GREEN']}✅ {votes_result.deleted_count} votes deleted.{COLORS['ENDC']}")
            return True
            
        except Exception as e:
            print(f"{COLORS['RED']}❌ Error deleting polls: {e}{COLORS['ENDC']}")
            return False
    
    def create_backup(self):
        """Create a backup of the database"""
        try:
            # Create backup directory if it doesn't exist
            os.makedirs(BACKUP_DIR, exist_ok=True)
            
            # Create timestamp for backup filename
            timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
            backup_file = os.path.join(BACKUP_DIR, f"partivotes_backup_{timestamp}.json")
            
            # Get all collections
            collections = {
                "polls": list(self.db.polls.find()),
                "votes": list(self.db.votes.find())
            }
            
            # Write to file
            with open(backup_file, "w") as f:
                json.dump(collections, f, cls=JSONEncoder, indent=2)
            
            print(f"{COLORS['GREEN']}✅ Backup created: {backup_file}{COLORS['ENDC']}")
            print(f"   Polls: {len(collections['polls'])}")
            print(f"   Votes: {len(collections['votes'])}")
            
            # Rotate backups if needed
            self._rotate_backups()
            
            return backup_file
        except Exception as e:
            print(f"{COLORS['RED']}❌ Error creating backup: {e}{COLORS['ENDC']}")
            return None
    
    def _rotate_backups(self):
        """Rotate backups to keep only the most recent ones"""
        try:
            # Get all backup files
            backup_files = [os.path.join(BACKUP_DIR, f) for f in os.listdir(BACKUP_DIR) 
                           if f.startswith("partivotes_backup_") and f.endswith(".json")]
            
            # Sort by modification time (oldest first)
            backup_files.sort(key=os.path.getmtime)
            
            # Remove oldest backups if we have too many
            if len(backup_files) > MAX_BACKUPS:
                files_to_remove = backup_files[0:len(backup_files) - MAX_BACKUPS]
                for file_path in files_to_remove:
                    os.remove(file_path)
                    print(f"{COLORS['YELLOW']}🔄 Removed old backup: {os.path.basename(file_path)}{COLORS['ENDC']}")
        except Exception as e:
            print(f"{COLORS['YELLOW']}⚠️ Warning: Could not rotate backups: {e}{COLORS['ENDC']}")
    
    def restore_backup(self, backup_file, force=False):
        """Restore database from backup"""
        try:
            # Check if file exists
            if not os.path.exists(backup_file):
                print(f"{COLORS['RED']}❌ Backup file not found: {backup_file}{COLORS['ENDC']}")
                return False
            
            # Load backup data
            with open(backup_file, "r") as f:
                backup_data = json.load(f)
            
            # Validate backup data
            if "polls" not in backup_data or "votes" not in backup_data:
                print(f"{COLORS['RED']}❌ Invalid backup file format.{COLORS['ENDC']}")
                return False
            
            # Count existing data
            existing_polls = self.db.polls.count_documents({})
            existing_votes = self.db.votes.count_documents({})
            
            # Confirm restore
            if not force and (existing_polls > 0 or existing_votes > 0):
                print(f"\n{COLORS['RED']}⚠️ This will overwrite your existing database with {len(backup_data['polls'])} polls and {len(backup_data['votes'])} votes.{COLORS['ENDC']}")
                print(f"Current database has {existing_polls} polls and {existing_votes} votes.")
                confirm = input("Are you sure you want to proceed? (y/N): ")
                if confirm.lower() != "y":
                    print(f"{COLORS['YELLOW']}Restore cancelled.{COLORS['ENDC']}")
                    return False
            
            # Create a backup before restoring (safety measure)
            if existing_polls > 0 or existing_votes > 0:
                print(f"{COLORS['YELLOW']}Creating safety backup before restore...{COLORS['ENDC']}")
                self.create_backup()
            
            # Delete existing data
            self.db.polls.delete_many({})
            self.db.votes.delete_many({})
            
            # Convert string IDs back to ObjectIds
            for poll in backup_data["polls"]:
                poll["_id"] = ObjectId(poll["_id"])
                
            for vote in backup_data["votes"]:
                vote["_id"] = ObjectId(vote["_id"])
                vote["pollId"] = ObjectId(vote["pollId"])
            
            # Insert backup data
            if backup_data["polls"]:
                self.db.polls.insert_many(backup_data["polls"])
            
            if backup_data["votes"]:
                self.db.votes.insert_many(backup_data["votes"])
            
            print(f"{COLORS['GREEN']}✅ Restored {len(backup_data['polls'])} polls and {len(backup_data['votes'])} votes.{COLORS['ENDC']}")
            return True
            
        except Exception as e:
            print(f"{COLORS['RED']}❌ Error restoring backup: {e}{COLORS['ENDC']}")
            return False
    
    def list_backups(self):
        """List available backups"""
        try:
            # Create backup directory if it doesn't exist
            os.makedirs(BACKUP_DIR, exist_ok=True)
            
            # Get all backup files
            backup_files = [f for f in os.listdir(BACKUP_DIR) if f.startswith("partivotes_backup_") and f.endswith(".json")]
            
            if not backup_files:
                print(f"{COLORS['YELLOW']}No backups found.{COLORS['ENDC']}")
                return []
            
            # Sort by timestamp (newest first)
            backup_files.sort(reverse=True)
            
            # Print table
            table_data = []
            for i, file in enumerate(backup_files, 1):
                # Extract timestamp from filename
                timestamp = file.replace("partivotes_backup_", "").replace(".json", "")
                formatted_time = datetime.datetime.strptime(timestamp, "%Y%m%d_%H%M%S").strftime("%Y-%m-%d %H:%M:%S")
                
                # Get file size
                file_path = os.path.join(BACKUP_DIR, file)
                size_kb = os.path.getsize(file_path) / 1024
                
                table_data.append([i, formatted_time, f"{size_kb:.1f} KB", file])
            
            headers = ["#", "Created", "Size", "Filename"]
            print(tabulate(table_data, headers=headers, tablefmt="grid"))
            
            return backup_files
        except Exception as e:
            print(f"{COLORS['RED']}❌ Error listing backups: {e}{COLORS['ENDC']}")
            return []
    
    def export_polls_to_csv(self, output_file=None):
        """Export polls to CSV format for external analysis"""
        try:
            # Create export directory if it doesn't exist
            os.makedirs(EXPORT_DIR, exist_ok=True)
            
            # Create default filename if not provided
            if not output_file:
                timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
                output_file = os.path.join(EXPORT_DIR, f"polls_export_{timestamp}.csv")
            
            # Get all polls
            polls = list(self.db.polls.find())
            
            if not polls:
                print(f"{COLORS['YELLOW']}No polls to export.{COLORS['ENDC']}")
                return None
            
            # Prepare CSV data
            csv_data = []
            for poll in polls:
                # Count votes for this poll
                vote_count = self.db.votes.count_documents({"pollId": poll["_id"]})
                
                # Get options as a formatted string
                options_str = "; ".join([f"{opt['text']} ({opt['votes']} votes)" for opt in poll["options"]])
                
                # Add poll data
                csv_data.append({
                    "Poll ID": str(poll["_id"]),
                    "Title": poll["title"],
                    "Description": poll["description"],
                    "Type": poll["type"],
                    "Status": poll["status"],
                    "Creator": poll["creator"],
                    "Total Votes": poll["totalVotes"],
                    "Actual Vote Count": vote_count,
                    "Created At": poll["createdAt"].strftime("%Y-%m-%d %H:%M") if "createdAt" in poll else "N/A",
                    "Start Date": poll["startDate"].strftime("%Y-%m-%d %H:%M") if "startDate" in poll else "N/A",
                    "End Date": poll["endDate"].strftime("%Y-%m-%d %H:%M") if "endDate" in poll else "N/A",
                    "Options": options_str
                })
            
            # Write to CSV file
            with open(output_file, "w", newline="") as f:
                writer = csv.DictWriter(f, fieldnames=csv_data[0].keys())
                writer.writeheader()
                writer.writerows(csv_data)
            
            print(f"{COLORS['GREEN']}✅ Exported {len(polls)} polls to: {output_file}{COLORS['ENDC']}")
            return output_file
        except Exception as e:
            print(f"{COLORS['RED']}❌ Error exporting polls: {e}{COLORS['ENDC']}")
            return None

class InteractiveMenu:
    """Interactive menu for the database manager"""
    
    def __init__(self):
        """Initialize the interactive menu"""
        self.db_manager = DBManager()
        self.current_polls = []
        self.current_backups = []
        
    def clear_screen(self):
        """Clear the terminal screen"""
        os.system('cls' if os.name == 'nt' else 'clear')
        
    def print_header(self):
        """Print the application header"""
        self.clear_screen()
        print(f"{COLORS['HEADER']}{COLORS['BOLD']}===================================={COLORS['ENDC']}")
        print(f"{COLORS['HEADER']}{COLORS['BOLD']}  PartiVotes Database Manager v1.0  {COLORS['ENDC']}")
        print(f"{COLORS['HEADER']}{COLORS['BOLD']}===================================={COLORS['ENDC']}")
        print()
        
    def print_menu(self, title, options):
        """Print a menu with options"""
        print(f"{COLORS['BOLD']}{title}{COLORS['ENDC']}")
        print("-" * len(title))
        
        for i, option in enumerate(options, 1):
            print(f"{i}. {option}")
            
        print(f"0. {'Back' if title != 'Main Menu' else 'Exit'}")
        print()
        
    def get_choice(self, max_choice):
        """Get user choice with validation"""
        while True:
            try:
                choice = input(f"{COLORS['BOLD']}Enter your choice (0-{max_choice}):{COLORS['ENDC']} ")
                choice = int(choice)
                if 0 <= choice <= max_choice:
                    return choice
                print(f"{COLORS['YELLOW']}Invalid choice. Please enter a number between 0 and {max_choice}.{COLORS['ENDC']}")
            except ValueError:
                print(f"{COLORS['YELLOW']}Invalid input. Please enter a number.{COLORS['ENDC']}")
                
    def wait_for_key(self):
        """Wait for a key press"""
        input(f"\n{COLORS['BOLD']}Press Enter to continue...{COLORS['ENDC']}")
        
    def main_menu(self):
        """Display the main menu"""
        while True:
            self.print_header()
            options = [
                "List Polls",
                "View Poll Details",
                "Delete Poll",
                "Delete All Polls",
                "Create Backup",
                "List Backups",
                "Restore from Backup",
                "Export Polls to CSV",
                "Check Database Health"
            ]
            self.print_menu("Main Menu", options)
            
            choice = self.get_choice(len(options))
            
            if choice == 0:
                self.clear_screen()
                print(f"{COLORS['GREEN']}Thank you for using PartiVotes Database Manager!{COLORS['ENDC']}")
                break
            elif choice == 1:
                self.list_polls_menu()
            elif choice == 2:
                self.view_poll_menu()
            elif choice == 3:
                self.delete_poll_menu()
            elif choice == 4:
                self.delete_all_polls_menu()
            elif choice == 5:
                self.create_backup_menu()
            elif choice == 6:
                self.list_backups_menu()
            elif choice == 7:
                self.restore_backup_menu()
            elif choice == 8:
                self.export_polls_menu()
            elif choice == 9:
                self.check_health_menu()
                
    def list_polls_menu(self):
        """Display the list polls menu"""
        self.print_header()
        print(f"{COLORS['BOLD']}List Polls{COLORS['ENDC']}")
        print("-" * 10)
        
        # Show all polls by default
        print(f"{COLORS['BOLD']}Showing all polls (up to 50):{COLORS['ENDC']}")
        print()
        
        # List polls with default settings
        self.current_polls = self.db_manager.list_polls(limit=50)
        
        # Show actions for poll list
        if self.current_polls:
            print("\nOptions:")
            print("1. View poll details")
            print("2. Delete a poll")
            print("3. Filter polls")
            print("0. Back to main menu")
            
            action_choice = self.get_choice(3)
            
            if action_choice == 1:
                self.view_poll_from_list()
            elif action_choice == 2:
                self.delete_poll_from_list()
            elif action_choice == 3:
                self.filter_polls_menu()
        else:
            self.wait_for_key()
    
    def filter_polls_menu(self):
        """Display the filter polls menu"""
        while True:
            self.print_header()
            print(f"{COLORS['BOLD']}Filter Polls{COLORS['ENDC']}")
            print("-" * 11)
            
            # Filter options
            filter_options = [
                "Show all polls (no filter)",
                "Filter by poll type",
                "Filter by status",
                "Filter by creator",
                "Search by keyword"
            ]
            
            self.print_menu("Filter Options", filter_options)
            filter_choice = self.get_choice(len(filter_options))
            
            if filter_choice == 0:
                return
                
            # Default filter values
            poll_type = None
            status = None
            creator = None
            search_term = None
            limit = 50
            
            if filter_choice == 1:
                # Show all polls
                self.print_header()
                print(f"{COLORS['BOLD']}All Polls{COLORS['ENDC']}")
                print("-" * 9)
                self.current_polls = self.db_manager.list_polls(limit=limit)
                
            elif filter_choice == 2:
                # Filter by poll type
                self.print_header()
                type_options = ["SINGLE_CHOICE", "MULTIPLE_CHOICE", "RANKED_CHOICE"]
                self.print_menu("Select Poll Type", type_options)
                type_choice = self.get_choice(len(type_options))
                if type_choice > 0:
                    poll_type = type_options[type_choice - 1]
                    self.print_header()
                    print(f"{COLORS['BOLD']}Polls of type: {poll_type}{COLORS['ENDC']}")
                    print("-" * 20)
                    self.current_polls = self.db_manager.list_polls(poll_type=poll_type, limit=limit)
                    
            elif filter_choice == 3:
                # Filter by status
                self.print_header()
                status_options = ["ACTIVE", "PENDING", "ENDED", "CANCELLED"]
                self.print_menu("Select Status", status_options)
                status_choice = self.get_choice(len(status_options))
                if status_choice > 0:
                    status = status_options[status_choice - 1]
                    self.print_header()
                    print(f"{COLORS['BOLD']}Polls with status: {status}{COLORS['ENDC']}")
                    print("-" * 25)
                    self.current_polls = self.db_manager.list_polls(status=status, limit=limit)
                    
            elif filter_choice == 4:
                # Filter by creator
                self.print_header()
                creator = input(f"{COLORS['BOLD']}Enter creator wallet address (or part of it):{COLORS['ENDC']} ")
                if creator.strip():
                    self.print_header()
                    print(f"{COLORS['BOLD']}Polls by creator: {creator}{COLORS['ENDC']}")
                    print("-" * 25)
                    self.current_polls = self.db_manager.list_polls(creator=creator, limit=limit)
                    
            elif filter_choice == 5:
                # Search by keyword
                self.print_header()
                search_term = input(f"{COLORS['BOLD']}Enter search term (title or description):{COLORS['ENDC']} ")
                if search_term.strip():
                    self.print_header()
                    print(f"{COLORS['BOLD']}Polls matching: '{search_term}'{COLORS['ENDC']}")
                    print("-" * 25)
                    self.current_polls = self.db_manager.list_polls(search_term=search_term, limit=limit)
            
            # Show actions for poll list
            if self.current_polls:
                print("\nOptions:")
                print("1. View poll details")
                print("2. Delete a poll")
                print("0. Back to filter menu")
                
                action_choice = self.get_choice(2)
                
                if action_choice == 1:
                    self.view_poll_from_list()
                elif action_choice == 2:
                    self.delete_poll_from_list()
            else:
                self.wait_for_key()
    
    def view_poll_from_list(self):
        """View a poll from the current list"""
        if not self.current_polls:
            print(f"{COLORS['YELLOW']}No polls in current list.{COLORS['ENDC']}")
            self.wait_for_key()
            return
            
        self.print_header()
        print(f"{COLORS['BOLD']}View Poll from List{COLORS['ENDC']}")
        print("-" * 18)
        
        # Display numbered list of polls
        print(f"{COLORS['BOLD']}Current Poll List:{COLORS['ENDC']}")
        for i, poll in enumerate(self.current_polls, 1):
            print(f"{i}. {poll['title']} ({poll['status']}, {poll['totalVotes']} votes)")
        
        # Get poll selection
        poll_index = -1
        while True:
            try:
                poll_index = int(input(f"\n{COLORS['BOLD']}Enter poll number to view (0 to cancel):{COLORS['ENDC']} "))
                if poll_index == 0:
                    return
                if 1 <= poll_index <= len(self.current_polls):
                    break
                print(f"{COLORS['YELLOW']}Invalid choice. Please enter a number between 0 and {len(self.current_polls)}.{COLORS['ENDC']}")
            except ValueError:
                print(f"{COLORS['YELLOW']}Invalid input. Please enter a number.{COLORS['ENDC']}")
        
        # View selected poll
        poll = self.current_polls[poll_index - 1]
        self.print_header()
        self.db_manager.view_poll(str(poll["_id"]))
        self.wait_for_key()

    def delete_poll_from_list(self):
        """Delete a poll from the current list"""
        if not self.current_polls:
            print(f"{COLORS['YELLOW']}No polls in current list.{COLORS['ENDC']}")
            self.wait_for_key()
            return
        
        print(f"\n{COLORS['BOLD']}Delete Poll{COLORS['ENDC']}")
        print(f"{COLORS['YELLOW']}Warning: This action cannot be undone!{COLORS['ENDC']}")
        
        poll_index = -1
        while True:
            try:
                poll_index = int(input(f"\n{COLORS['BOLD']}Enter poll number to delete (0 to cancel):{COLORS['ENDC']} "))
                if poll_index == 0:
                    return
                if 1 <= poll_index <= len(self.current_polls):
                    break
                print(f"{COLORS['YELLOW']}Invalid choice. Please enter a number between 0 and {len(self.current_polls)}.{COLORS['ENDC']}")
            except ValueError:
                print(f"{COLORS['YELLOW']}Invalid input. Please enter a number.{COLORS['ENDC']}")
        
        # Get confirmation
        poll = self.current_polls[poll_index - 1]
        confirm = input(f"\n{COLORS['RED']}Are you sure you want to delete poll '{poll.get('title', 'Untitled')}' (y/n)? {COLORS['ENDC']}")
        
        if confirm.lower() != 'y':
            print(f"{COLORS['GREEN']}Deletion cancelled.{COLORS['ENDC']}")
            self.wait_for_key()
            return
        
        # Delete selected poll
        self.print_header()
        print(f"{COLORS['BOLD']}Deleting poll...{COLORS['ENDC']}")
        
        try:
            if self.db_manager.delete_poll(str(poll["_id"])):
                # Remove from current list if deletion was successful
                self.current_polls.pop(poll_index - 1)
                print(f"{COLORS['GREEN']}✅ Poll deleted successfully.{COLORS['ENDC']}")
            else:
                print(f"{COLORS['RED']}❌ Failed to delete poll.{COLORS['ENDC']}")
        except Exception as e:
            print(f"{COLORS['RED']}❌ Error deleting poll: {e}{COLORS['ENDC']}")
        
        self.wait_for_key()

    def view_poll_menu(self):
        """Display the view poll menu"""
        self.print_header()
        print(f"{COLORS['BOLD']}View Poll Details{COLORS['ENDC']}")
        print("-" * 16)
        
        poll_id = input(f"{COLORS['BOLD']}Enter Poll ID (or leave empty to go back):{COLORS['ENDC']} ")
        
        if not poll_id:
            return
        
        self.print_header()
        self.db_manager.view_poll(poll_id)
        self.wait_for_key()
        
    def delete_poll_menu(self):
        """Display the delete poll menu"""
        self.print_header()
        print(f"{COLORS['BOLD']}Delete Poll{COLORS['ENDC']}")
        print("-" * 11)
        
        poll_id = input(f"{COLORS['BOLD']}Enter Poll ID (or leave empty to go back):{COLORS['ENDC']} ")
        
        if not poll_id:
            return
        
        self.print_header()
        self.db_manager.delete_poll(poll_id)
        self.wait_for_key()
        
    def delete_all_polls_menu(self):
        """Display the delete all polls menu"""
        self.print_header()
        print(f"{COLORS['BOLD']}Delete All Polls{COLORS['ENDC']}")
        print("-" * 15)
        
        self.db_manager.delete_all_polls()
        self.wait_for_key()
        
    def create_backup_menu(self):
        """Display the create backup menu"""
        self.print_header()
        print(f"{COLORS['BOLD']}Create Backup{COLORS['ENDC']}")
        print("-" * 13)
        
        backup_file = self.db_manager.create_backup()
        if backup_file:
            print(f"\nBackup saved to: {backup_file}")
        self.wait_for_key()
        
    def list_backups_menu(self):
        """Display the list backups menu"""
        self.print_header()
        print(f"{COLORS['BOLD']}Available Backups{COLORS['ENDC']}")
        print("-" * 16)
        
        self.current_backups = self.db_manager.list_backups()
        
        if not self.current_backups:
            self.wait_for_key()
            return
        
        print("\nOptions:")
        print("1. Restore a backup")
        print("0. Back to main menu")
        
        choice = self.get_choice(1)
        
        if choice == 1:
            self.restore_backup_menu(True)
        
    def restore_backup_menu(self, from_list=False):
        """Display the restore backup menu"""
        if not from_list:
            self.print_header()
            print(f"{COLORS['BOLD']}Restore from Backup{COLORS['ENDC']}")
            print("-" * 18)
            
            self.current_backups = self.db_manager.list_backups()
            
            if not self.current_backups:
                self.wait_for_key()
                return
        
        # Get backup selection
        backup_index = -1
        while True:
            try:
                backup_index = int(input(f"\n{COLORS['BOLD']}Enter backup number to restore (0 to cancel):{COLORS['ENDC']} "))
                if backup_index == 0:
                    return
                if 1 <= backup_index <= len(self.current_backups):
                    break
                print(f"{COLORS['YELLOW']}Invalid choice. Please enter a number between 0 and {len(self.current_backups)}.{COLORS['ENDC']}")
            except ValueError:
                print(f"{COLORS['YELLOW']}Invalid input. Please enter a number.{COLORS['ENDC']}")
        
        # Restore selected backup
        backup_file = os.path.join(BACKUP_DIR, self.current_backups[backup_index - 1])
        self.db_manager.restore_backup(backup_file)
        self.wait_for_key()

    def export_polls_menu(self):
        """Display the export polls menu"""
        self.print_header()
        print(f"{COLORS['BOLD']}Export Polls to CSV{COLORS['ENDC']}")
        print("-" * 18)
        
        output_file = self.db_manager.export_polls_to_csv()
        if output_file:
            print(f"\nExport saved to: {output_file}")
        self.wait_for_key()

    def check_health_menu(self):
        """Display the check health menu"""
        self.print_header()
        print(f"{COLORS['BOLD']}Check Database Health{COLORS['ENDC']}")
        print("-" * 19)
        
        self.db_manager.check_health()
        self.wait_for_key()

def main():
    """Main CLI entry point"""
    parser = argparse.ArgumentParser(description="PartiVotes Database Manager")
    parser.add_argument("command", nargs="?", default="help", 
                      help="Command to run (list, view, delete, delete-all, backup, list-backups, restore, interactive)")
    parser.add_argument("--type", choices=["SINGLE_CHOICE", "MULTIPLE_CHOICE", "RANKED_CHOICE"], 
                      help="Filter by poll type")
    parser.add_argument("--status", choices=["ACTIVE", "PENDING", "ENDED", "CANCELLED"], 
                      help="Filter by poll status")
    parser.add_argument("--limit", type=int, default=10, 
                      help="Maximum number of polls to list")
    parser.add_argument("--poll-id", help="Poll ID for view/delete commands")
    parser.add_argument("--backup-file", help="Backup file path for restore command")
    parser.add_argument("--force", action="store_true", 
                      help="Skip confirmation for destructive actions")
    
    # Parse arguments
    args = parser.parse_args()
    
    # Initialize database manager
    db_manager = DBManager()
    
    # Run in interactive mode if requested
    if args.command == "interactive":
        menu = InteractiveMenu()
        menu.main_menu()
        return
    
    # Execute command
    if args.command == "list":
        db_manager.list_polls(args.type, args.status, args.limit)
    elif args.command == "view":
        if not args.poll_id:
            print(f"{COLORS['RED']}Error: Poll ID is required for view command.{COLORS['ENDC']}")
            return
        db_manager.view_poll(args.poll_id)
    elif args.command == "delete":
        if not args.poll_id:
            print(f"{COLORS['RED']}Error: Poll ID is required for delete command.{COLORS['ENDC']}")
            return
        db_manager.delete_poll(args.poll_id, args.force)
    elif args.command == "delete-all":
        db_manager.delete_all_polls(args.force)
    elif args.command == "backup":
        db_manager.create_backup()
    elif args.command == "list-backups":
        db_manager.list_backups()
    elif args.command == "restore":
        if not args.backup_file:
            print(f"{COLORS['RED']}Error: Backup file path is required for restore command.{COLORS['ENDC']}")
            return
        db_manager.restore_backup(args.backup_file, args.force)
    elif args.command == "export":
        db_manager.export_polls_to_csv()
    elif args.command == "health":
        db_manager.check_health()
    else:
        print(f"{COLORS['BOLD']}PartiVotes Database Manager{COLORS['ENDC']}")
        print(f"\nUsage: {sys.argv[0]} [command] [options]\n")
        print(f"Commands:")
        print(f"  interactive    Run in interactive menu mode")
        print(f"  list           List polls")
        print(f"  view           View poll details")
        print(f"  delete         Delete a poll")
        print(f"  delete-all     Delete all polls")
        print(f"  backup         Create a database backup")
        print(f"  list-backups   List available backups")
        print(f"  restore        Restore from backup")
        print(f"  export         Export polls to CSV")
        print(f"  health         Check database health")
        print(f"\nUse --help for more information on options.")

if __name__ == "__main__":
    main()
