using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ArsAmorisDesignApi.Migrations
{
    /// <inheritdoc />
    public partial class AddImageOrder : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "order",
                table: "product_images",
                type: "integer",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "order",
                table: "product_images");
        }
    }
}
