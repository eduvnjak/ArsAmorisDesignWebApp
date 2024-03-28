using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ArsAmorisDesignApi.Migrations
{
    /// <inheritdoc />
    public partial class MultipleImagesNamingFixes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_product_image_products_product_id",
                table: "product_image");

            migrationBuilder.DropPrimaryKey(
                name: "PK_product_image",
                table: "product_image");

            migrationBuilder.RenameTable(
                name: "product_image",
                newName: "product_images");

            migrationBuilder.RenameColumn(
                name: "name",
                table: "product_images",
                newName: "image_name");

            migrationBuilder.AddPrimaryKey(
                name: "PK_product_images",
                table: "product_images",
                columns: new[] { "product_id", "image_name" });

            migrationBuilder.AddForeignKey(
                name: "FK_product_images_products_product_id",
                table: "product_images",
                column: "product_id",
                principalTable: "products",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_product_images_products_product_id",
                table: "product_images");

            migrationBuilder.DropPrimaryKey(
                name: "PK_product_images",
                table: "product_images");

            migrationBuilder.RenameTable(
                name: "product_images",
                newName: "product_image");

            migrationBuilder.RenameColumn(
                name: "image_name",
                table: "product_image",
                newName: "name");

            migrationBuilder.AddPrimaryKey(
                name: "PK_product_image",
                table: "product_image",
                columns: new[] { "product_id", "name" });

            migrationBuilder.AddForeignKey(
                name: "FK_product_image_products_product_id",
                table: "product_image",
                column: "product_id",
                principalTable: "products",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
