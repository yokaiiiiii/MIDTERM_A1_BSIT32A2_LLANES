namespace SlotMachineBackend.Models
{
    public class GameResult
    {
        internal object Status;

        public int Id { get; set; }
        public DateTime DatePlayed { get; set; }
        public string Outcome { get; set; }  // Win, Loss
        public int PlayerId { get; set; }
        public Player Player { get; set; }

        public int RetriesBeforeWin { get; set; }
    }
}
