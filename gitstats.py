import subprocess
from rich.console import Console
from rich.table import Table

console = Console()

def run_command(cmd):
    """Run a shell command and return output as string."""
    result = subprocess.run(cmd, shell=True, text=True, capture_output=True)
    return result.stdout.strip()

def get_git_stats():
    """Fetches various Git statistics."""
    stats = {
        "Total Lines of Code": run_command("git ls-files | xargs wc -l | tail -n 1 | awk '{print $1}'"),
        "Total Number of Files": run_command("git ls-files | wc -l"),
        "Total Number of Commits": run_command("git rev-list --count HEAD"),
        "Repository Size": run_command("du -sh .git | cut -f1"),
        "First Commit Date": run_command("git log --reverse --format=%cd --date=short | head -1"),
        "Last Commit Date": run_command("git log -1 --format=%cd --date=short"),
        "Number of Branches": run_command("git branch | wc -l"),
        "Number of Tags (Releases)": run_command("git tag | wc -l"),
        "Largest File (Tracked)": run_command("git ls-files | xargs du -sh | sort -rh | head -1 | awk '{print $2}'"),
        "Average Commit Message Length": run_command("git log --format=%s | awk '{ print length }' | awk '{sum+=$1} END {print sum/NR}'"),
        "Most Changed Files (Top 5)": run_command("git log --pretty=format: --name-only | sort | uniq -c | sort -nr | head -5"),
        "Number of Contributors": run_command("git log --format='%aN' | sort -u | wc -l"),
        "Total Lines Added": run_command("git log --format= --numstat | awk '{ added+=$1 } END { print added }'"),
        "Total Lines Removed": run_command("git log --format= --numstat | awk '{ removed+=$2 } END { print removed }'"),
        "Most Active Commit Day": run_command("git log --date=format:'%A' --pretty=format:'%ad' | sort | uniq -c | sort -nr | head -1 | awk '{print $2}'"),
        "Commit Stats Per Author": run_command("git shortlog -s -n")
    }
    return stats

def display_stats(stats):
    """Displays git stats in a nicely formatted table."""
    table = Table(title="Git Repository Statistics", show_lines=True)
    
    table.add_column("Metric", style="cyan", justify="left")
    table.add_column("Value", style="magenta", justify="right")
    
    for key, value in stats.items():
        if key == "Commit Stats Per Author":
            console.print("\n[bold]Commits Per Author:[/bold]", style="yellow")
            console.print(value, style="white")
        elif key == "Most Changed Files (Top 5)":
            console.print("\n[bold]Most Changed Files:[/bold]", style="yellow")
            console.print(value, style="white")
        else:
            table.add_row(key, value)
    
    console.print(table)

if __name__ == "__main__":
    try:
        stats = get_git_stats()
        display_stats(stats)
    except Exception as e:
        console.print(f"[bold red]Error:[/bold red] {e}")
