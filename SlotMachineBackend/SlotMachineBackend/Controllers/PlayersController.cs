using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SlotMachineBackend.Models;

namespace SlotMachineBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PlayersController : ControllerBase
    {
        private readonly SlotMachineDbContext _context;

        public PlayersController(SlotMachineDbContext context)
        {
            _context = context;
        }

        // POST: api/players/register
        [HttpPost("register")]
        public async Task<IActionResult> RegisterPlayer([FromBody] Player player)
        {
            if (player == null || string.IsNullOrEmpty(player.Name) || string.IsNullOrEmpty(player.StudentNumber))
            {
                return BadRequest("Invalid player data.");
            }

            // Validate that the StudentNumber starts with "C" and contains only numeric characters after "C"
            if (!player.StudentNumber.StartsWith("C") || !player.StudentNumber.Substring(1).All(char.IsDigit))
            {
                return BadRequest("Invalid student number format. It must start with 'C' followed by numeric characters.");
            }

            // Check if the student number already exists
            var existingPlayer = await _context.Players
                .FirstOrDefaultAsync(p => p.StudentNumber == player.StudentNumber);

            if (existingPlayer != null)
            {
                return Conflict("Student number already registered.");
            }

            _context.Players.Add(player);
            await _context.SaveChangesAsync();

            return Ok(player);
        }

        // GET: api/players
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Player>>> GetAllPlayers()
        {
            var players = await _context.Players
                .Select(p => new
                {
                    p.Id,
                    p.StudentNumber,
                    p.Name
                })
                .ToListAsync();

            return Ok(players);
        }

        // GET: api/players/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetPlayerById(int id)
        {
            var player = await _context.Players
                .FirstOrDefaultAsync(p => p.Id == id);

            if (player == null)
            {
                return NotFound("Player not found.");
            }

            return Ok(player);
        }


        // DELETE: api/players/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePlayer(int id)
        {
            var player = await _context.Players.FirstOrDefaultAsync(p => p.Id == id);

            if (player == null)
            {
                // Return JSON response with proper Content-Type
                return NotFound(new { message = "Player not found." });
            }

            _context.Players.Remove(player);
            await _context.SaveChangesAsync();

            // Return JSON response with proper Content-Type
            return Ok(new { message = "Player deleted successfully." });
        }

        // GET: api/players/search?name=XXXX
        [HttpGet("search")]
        public async Task<IActionResult> SearchPlayers(string name)
        {
            if (string.IsNullOrWhiteSpace(name))
            {
                return BadRequest("Name is required for searching.");
            }

            var players = await _context.Players
                .Where(p => p.Name.Contains(name))
                .Select(p => new
                {
                    p.Id,
                    p.StudentNumber,
                    p.Name
                })
                .ToListAsync();

            return Ok(players);
        }
    }
}