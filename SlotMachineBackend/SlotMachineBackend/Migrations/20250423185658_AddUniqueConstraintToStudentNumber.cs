using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SlotMachineBackend.Migrations
{
    /// <inheritdoc />
    public partial class AddUniqueConstraintToStudentNumber : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Players_StudentNumber",
                table: "Players",
                column: "StudentNumber",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Players_StudentNumber",
                table: "Players");
        }
    }
}
