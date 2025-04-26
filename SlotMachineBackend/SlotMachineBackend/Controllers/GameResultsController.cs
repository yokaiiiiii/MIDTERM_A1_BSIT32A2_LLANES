using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using SlotMachineBackend.Models;


namespace SlotMachineBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GameResultsController : ControllerBase
    {
        private readonly SlotMachineDbContext _context;

        public GameResultsController(SlotMachineDbContext context)
        {
            _context = context;
        }

        // Get all game results within a date range (wins, losses, retries)
        [HttpGet("audit-trail")]
        public async Task<IActionResult> GetGameResultsAuditTrail(DateTime? startDate, DateTime? endDate)
        {
            // If no date range is provided, use the full range
            if (!startDate.HasValue) startDate = DateTime.MinValue;
            if (!endDate.HasValue) endDate = DateTime.MaxValue;

            var gameResults = await _context.GameResults
                .Where(gr => gr.DatePlayed >= startDate.Value && gr.DatePlayed <= endDate.Value)
                .OrderByDescending(gr => gr.DatePlayed)
                .Select(gr => new
                {
                    gr.Id,
                    gr.DatePlayed,
                    gr.Outcome,
                    gr.Player.StudentNumber,
                    gr.Player.Name
                })
                .ToListAsync();

            return Ok(gameResults);
        }

        // Get wins and losses per player, within a specific date range
        [HttpGet("player-stats")]
        public async Task<IActionResult> GetPlayerStats(DateTime? startDate, DateTime? endDate)
        {
            if (!startDate.HasValue) startDate = DateTime.MinValue;
            if (!endDate.HasValue) endDate = DateTime.MaxValue;

            // Ensure dates are in UTC if DatePlayed is stored in UTC
            startDate = startDate.Value.ToUniversalTime();
            endDate = endDate.Value.ToUniversalTime();

            Console.WriteLine($"Start Date (UTC): {startDate.Value}, End Date (UTC): {endDate.Value}");

            // Fetch game results within the date range
            var gameResults = await _context.GameResults
                .Where(gr => gr.DatePlayed >= startDate.Value && gr.DatePlayed <= endDate.Value)
                .Select(gr => new
                {
                    PlayerId = gr.PlayerId,
                    Outcome = gr.Outcome,
                    DatePlayed = gr.DatePlayed,
                    PlayerName = gr.Player.Name,
                    StudentNumber = gr.Player.StudentNumber
                })
                .OrderByDescending(gr => gr.DatePlayed) // Sort by most recent date
                .ToListAsync();

            return Ok(gameResults);
        }



        // Save a game result (used for recording game actions in the audit trail)
        [HttpPost("save-game")]
        public async Task<IActionResult> SaveGame(GameResult gameResult)
        {
            if (gameResult.Player == null || string.IsNullOrWhiteSpace(gameResult.Player.StudentNumber))
            {
                return BadRequest("Player's StudentNumber is required.");
            }

            var existingPlayer = await _context.Players
                .AsNoTracking()
                .FirstOrDefaultAsync(p => p.StudentNumber == gameResult.Player.StudentNumber);

            if (existingPlayer == null)
            {
                return NotFound($"No registered player found with StudentNumber '{gameResult.Player.StudentNumber}'.");
            }

            gameResult.PlayerId = existingPlayer.Id;
            gameResult.Player = null; // Ignore the Player object
            gameResult.DatePlayed = DateTime.UtcNow; // Set the current date and time in UTC

            if (gameResult.Outcome == "Win")
            {
                var retries = await _context.GameResults
                    .Where(gr => gr.PlayerId == existingPlayer.Id && gr.Outcome != "Win")
                    .CountAsync();

                gameResult.RetriesBeforeWin = retries;
            }
            else
            {
                gameResult.RetriesBeforeWin = 0;
            }

            _context.GameResults.Add(gameResult);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Game result saved successfully." });
        }

        [HttpGet("validate-player")]
        public async Task<IActionResult> ValidatePlayer(string studentNumber)
        {
            if (string.IsNullOrWhiteSpace(studentNumber) || !studentNumber.StartsWith("C"))
            {
                return BadRequest("Invalid student number format. Must start with 'C'.");
            }

            var playerExists = await _context.Players
                .AnyAsync(p => p.StudentNumber == studentNumber);

            if (!playerExists)
            {
                return NotFound("Player not found.");
            }

            return Ok("Player is valid.");
        }
        [HttpGet("recent-players")]
        public async Task<IActionResult> GetRecentPlayers()
        {
            var threeHoursAgo = DateTime.UtcNow.AddHours(-3);

            var recentPlayers = await _context.GameResults
                .Where(gr => gr.DatePlayed >= threeHoursAgo)
                .Select(gr => new
                {
                    gr.Player.StudentNumber,
                    gr.Player.Name,
                    gr.DatePlayed
                })
                .Distinct()
                .ToListAsync();

            return Ok(recentPlayers);
        }
    }
}
