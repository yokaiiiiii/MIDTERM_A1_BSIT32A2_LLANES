using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SlotMachineBackend.Migrations
{
    /// <inheritdoc />
    public partial class AddRetriesBeforeWin : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "RetriesBeforeWin",
                table: "GameResults",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RetriesBeforeWin",
                table: "GameResults");
        }
    }
}
