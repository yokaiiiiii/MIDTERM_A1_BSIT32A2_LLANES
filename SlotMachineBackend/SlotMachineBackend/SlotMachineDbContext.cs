using Microsoft.EntityFrameworkCore;
using SlotMachineBackend.Models;

namespace SlotMachineBackend
{
    public class SlotMachineDbContext : DbContext
    {
        public SlotMachineDbContext(DbContextOptions<SlotMachineDbContext> options)
            : base(options)
        {
        }

        public DbSet<Player> Players { get; set; }
        public DbSet<GameResult> GameResults { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Player>()
                .HasIndex(p => p.StudentNumber)
                .IsUnique(); // Enforce unique constraint on StudentNumber

            modelBuilder.Entity<GameResult>()
                .HasOne(gr => gr.Player)
                .WithMany(p => p.GameResults)
                .HasForeignKey(gr => gr.PlayerId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}