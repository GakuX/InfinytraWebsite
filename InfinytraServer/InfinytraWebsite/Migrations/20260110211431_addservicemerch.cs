using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InfinytraWebsite.Migrations
{
    /// <inheritdoc />
    public partial class addservicemerch : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Item",
                table: "Merches",
                newName: "NewItem");

            migrationBuilder.AddColumn<string>(
                name: "Categories",
                table: "Merches",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ImageURL",
                table: "Merches",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<bool>(
                name: "InStock",
                table: "Merches",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "ItemDescription",
                table: "Merches",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ItemName",
                table: "Merches",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<decimal>(
                name: "Price",
                table: "Merches",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Categories",
                table: "Merches");

            migrationBuilder.DropColumn(
                name: "ImageURL",
                table: "Merches");

            migrationBuilder.DropColumn(
                name: "InStock",
                table: "Merches");

            migrationBuilder.DropColumn(
                name: "ItemDescription",
                table: "Merches");

            migrationBuilder.DropColumn(
                name: "ItemName",
                table: "Merches");

            migrationBuilder.DropColumn(
                name: "Price",
                table: "Merches");

            migrationBuilder.RenameColumn(
                name: "NewItem",
                table: "Merches",
                newName: "Item");
        }
    }
}
