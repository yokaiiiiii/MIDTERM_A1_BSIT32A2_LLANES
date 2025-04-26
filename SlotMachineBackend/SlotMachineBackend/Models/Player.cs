using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace SlotMachineBackend.Models
{
    public class Player
    {
        public int Id { get; set; }
        public string StudentNumber { get; set; }
        public string Name { get; set; }

        [JsonIgnore]
        [ValidateNever]
        public List<GameResult>? GameResults { get; set; }
    }
}
